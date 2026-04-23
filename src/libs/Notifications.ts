import { eq } from 'drizzle-orm';
import { db } from './DB';
import { logger } from './Logger';
import { organizationSchema } from '@/models/Schema';

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

export async function notifyOrg(orgId: string, title: string, body: string, data?: Record<string, any>) {
  try {
    const org = await db.query.organizationSchema.findFirst({
      where: eq(organizationSchema.id, orgId),
    });

    if (!org || !org.expoPushTokens || org.expoPushTokens.length === 0) {
      return;
    }

    // Expo allows sending up to 100 notifications at once in one request
    const tokens = org.expoPushTokens.filter(t => t.startsWith('ExponentPushToken'));
    
    if (tokens.length === 0) return;

    await sendPushNotification({
      to: tokens,
      title,
      body,
      data,
      sound: 'default',
    });
  } catch (error) {
    logger.error({ error, orgId }, 'Failed to notify organization');
  }
}
