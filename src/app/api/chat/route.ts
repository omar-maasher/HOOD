import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

import { db } from '@/libs/DB';
import { businessProfileSchema } from '@/models/Schema';

export const POST = async (req: Request) => {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 1. Get default AI settings (landing page bot)
    // We attempt to find the first organization's settings as a fallback for the landing page
    const settings = await db.query.aiSettingsSchema.findFirst();

    if (!settings || settings.isActive !== 'true') {
      return NextResponse.json({
        reply: 'عذراً، المساعد غير متصل حالياً. يمكنك المحاولة لاحقاً.',
      }, { status: 200 });
    }

    // 2. Fetch business profile for more context
    const profile = await db.query.businessProfileSchema.findFirst({
      where: eq(businessProfileSchema.organizationId, settings.organizationId),
    });

    // 3. Prepare Context for N8n
    const businessInfo = profile
      ? `اسم النشاط: ${profile.businessName}\nالوصف: ${profile.businessDescription}\nساعات العمل: ${profile.workingHours}\nالعنوان: ${profile.address}`
      : '';

    // 4. Try N8n Integration
    const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

    if (!n8nUrl) {
      return NextResponse.json({
        reply: 'N8n Webhook is not configured.',
      }, { status: 200 });
    }

    try {
      const n8nRes = await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          platform: 'website',
          senderId: 'website_visitor',
          context: {
            organizationId: settings.organizationId,
            aiConfig: settings,
            businessInfo,
            faqs: settings.faqs,
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

      return NextResponse.json({
        reply: 'عذراً، لم أتمكن من الحصول على رد من النظام حالياً.',
      }, { status: 200 });
    } catch (error) {
      console.error('n8n forwarding failed:', error);
      return NextResponse.json({
        reply: 'عذراً، حدث خطأ في الاتصال بنظام المعالجة (N8n).',
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
