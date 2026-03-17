import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { logger } from '@/libs/Logger';
import { businessProfileSchema } from '@/models/Schema';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Attempt to get settings if they exist
    let settings = null;
    try {
      settings = await db.query.aiSettingsSchema.findFirst();
    } catch (e) {
      logger.error(e, 'Failed to fetch AI settings from DB');
    }

    // Fetch business profile
    let profile = null;
    if (settings) {
      try {
        profile = await db.query.businessProfileSchema.findFirst({
          where: eq(businessProfileSchema.organizationId, settings.organizationId),
        });
      } catch (e) {
        logger.error(e, 'Failed to fetch business profile');
      }
    }

    const businessInfo = profile
      ? `اسم النشاط: ${profile.businessName}\nالوصف: ${profile.businessDescription}\nساعات العمل: ${profile.workingHours}\nالعنوان: ${profile.address}`
      : '';

    // 3. Try N8n Integration
    // Check DB for global setting first, then fallback to Env
    const globalSettings = await db.query.globalSettingsSchema.findMany();
    const dbN8nUrl = globalSettings.find(s => s.key === 'N8N_WEBHOOK_URL')?.value;

    const n8nUrl = dbN8nUrl || process.env.N8N_CHAT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

    if (n8nUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        const n8nRes = await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            message,
            platform: 'website',
            senderId: 'website_visitor',
            context: {
              organizationId: settings?.organizationId || 'default',
              aiConfig: settings || null,
              businessInfo: businessInfo || '',
              faqs: settings?.faqs || [],
            },
          }),
        });

        clearTimeout(timeoutId);

        if (n8nRes.ok) {
          const n8nData = await n8nRes.json();
          const reply = n8nData.reply || n8nData.output || n8nData.response;
          if (reply) {
            return NextResponse.json({ reply });
          }
        } else {
          const errText = await n8nRes.text();
          logger.error({ status: n8nRes.status, errText }, 'n8n responded with error');
        }
      } catch (error) {
        logger.error(error, 'n8n connection failed');
      }
    }

    // If we reach here, it means N8n failed or was not configured
    // We only show "Offline" if settings are missing OR explicitly inactive
    if (!n8nUrl && (!settings || settings.isActive !== 'true')) {
      return NextResponse.json({
        reply: 'عذراً، نظام المحادثة غير مكتمل الإعداد (رابط n8n مفقود والبوت غير مفعل في القاعدة).',
      }, { status: 200 });
    }

    return NextResponse.json({
      reply: 'عذراً، فشل الاتصال بنظام n8n. يرجى التأكد من تشغيل الـ Workflow ومن صحة الرابط.',
    }, { status: 200 });
  } catch (error) {
    logger.error(error, 'Chat API Error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
