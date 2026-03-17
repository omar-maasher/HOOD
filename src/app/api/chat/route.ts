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

    // 1. Get default AI settings
    const settings = await db.query.aiSettingsSchema.findFirst();

    // 2. Fetch business profile
    const profile = settings
      ? await db.query.businessProfileSchema.findFirst({
        where: eq(businessProfileSchema.organizationId, settings.organizationId),
      })
      : null;

    const businessInfo = profile
      ? `اسم النشاط: ${profile.businessName}\nالوصف: ${profile.businessDescription}\nساعات العمل: ${profile.workingHours}\nالعنوان: ${profile.address}`
      : '';

    // 3. Try N8n Integration
    const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

    logger.info({ n8nUrl }, 'Attempting to contact N8n');

    if (n8nUrl) {
      try {
        const n8nRes = await fetch(n8nUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
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

        if (n8nRes.ok) {
          const n8nData = await n8nRes.json();
          const reply = n8nData.reply || n8nData.output || n8nData.response;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (error) {
        logger.error(error, 'n8n forwarding failed');
      }
    }

    // 4. Fallback if n8n is not set or failed
    if (!settings || settings.isActive !== 'true') {
      return NextResponse.json({
        reply: 'عذراً، المساعد غير متصل حالياً. يمكنك المحاولة لاحقاً.',
      }, { status: 200 });
    }

    return NextResponse.json({
      reply: 'عذراً، لم أتمكن من الحصول على رد من النظام حالياً.',
    }, { status: 200 });
  } catch (error) {
    logger.error(error, 'Chat API Error');
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
