import { eq } from 'drizzle-orm';
import webpush from 'web-push';

import { organizationSchema } from '@/models/Schema';

import { db } from './DB';
import { logger } from './Logger';

if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || 'mailto:admin@localhost',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY,
  );
}

export type PushNotificationPayload = {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
};

export async function sendPushNotification(payload: PushNotificationPayload) {
  try {
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      logger.error({ data, payload }, 'Failed to send Expo Push Notification');
      return { success: false, error: data };
    }

    logger.info({ data }, 'Successfully sent Expo Push Notification');
    return { success: true, data };
  } catch (error) {
    logger.error({ error, payload }, 'Error sending Expo Push Notification');
    return { success: false, error };
  }
}

export async function notifyOrg(orgId: string, title: string, body: string, data?: Record<string, any>, type: string = 'info') {
  try {
    // 1. Save to Database for Web In-App Notifications
    try {
      const { notificationSchema } = await import('@/models/Schema');
      await db.insert(notificationSchema).values({
        organizationId: orgId,
        title,
        message: body,
        type,
        link: data?.link,
      });
    } catch (dbErr) {
      logger.error({ dbErr, orgId }, 'Failed to save web notification to database');
    }

    // 2. Fetch Organization to send Expo Push & Web Push
    const org = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (!org) {
      return;
    }

    // --- Web Push ---
    if (org.webPushSubscriptions && org.webPushSubscriptions.length > 0) {
      const payload = JSON.stringify({ title, body, data });
      const webPushPromises = org.webPushSubscriptions.map((sub: any) =>
        webpush.sendNotification(sub, payload).catch((err: any) => {
          logger.error({ err, sub }, 'Failed to send web push notification');
        }),
      );
      await Promise.all(webPushPromises);
    }

    // --- Expo Push ---
    if (org.expoPushTokens && org.expoPushTokens.length > 0) {
      const tokens = org.expoPushTokens.filter(t => t.startsWith('ExponentPushToken'));
      if (tokens.length > 0) {
        await sendPushNotification({
          to: tokens,
          title,
          body,
          data,
          sound: 'default',
        });
      }
    }
  } catch (error) {
    logger.error({ error, orgId }, 'Failed to notify organization');
  }
}
