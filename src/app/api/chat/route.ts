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

    // 3. Prepare System Prompt
    const faqsText = settings.faqs?.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n') || '';
    const businessInfo = profile
      ? `اسم النشاط: ${profile.businessName}\nالوصف: ${profile.businessDescription}\nساعات العمل: ${profile.workingHours}\nالعنوان: ${profile.address}`
      : '';

    const systemPrompt = `
      ${settings.systemPrompt || 'أنت مساعد ذكي ومحترف لهود تريندينج.'}
      الأسلوب (Tone): ${settings.tone || 'friendly'}
      
      معلومات النشاط التجاري:
      ${businessInfo}
      
      الأسئلة الشائعة (FAQs):
      ${faqsText}
      
      تعليمات الرد:
      - كن موجزاً وودوداً.
      - أجب بنفس لغة المستخدم (عربية أو إنجليزية).
      - استخدم المعلومات المتاحة في الأسئلة الشائعة (FAQs) للإجابة إذا كانت ذات صلة.
      - إذا سأل عن شيء لا تعرفه، وجهه للتواصل عبر الواتساب أو اطلب منه ترك تفاصيله.
      - التزم بحدود 3 جُمل في الرد الواحد ما لم تكن المعلومات تتطلب أكثر.
    `;

    // 4. Check for n8n integration
    const n8nUrl = process.env.N8N_CHAT_WEBHOOK_URL || process.env.N8N_WEBHOOK_URL;

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
              organizationId: settings.organizationId,
              aiConfig: settings,
              businessInfo,
              faqs: settings.faqs,
            },
          }),
        });

        if (n8nRes.ok) {
          const n8nData = await n8nRes.json();
          // Expecting n8n to return { reply: "..." } or { output: "..." }
          const reply = n8nData.reply || n8nData.output || n8nData.response;
          if (reply) {
            return NextResponse.json({ reply });
          }
        }
      } catch (error) {
        console.error('n8n forwarding failed, falling back to OpenAI:', error);
      }
    }

    // 5. Fallback to OpenAI (using fetch)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: 'AI Chat is not configured (Missing API Keys in .env).',
      }, { status: 200 });
    }

    const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!aiRes.ok) {
      const errorData = await aiRes.json();
      console.error('OpenAI API Error:', errorData);
      return NextResponse.json({
        reply: 'حدث خطأ في معالجة طلبك عبر الذكاء الاصطناعي.',
      }, { status: 200 });
    }

    const aiData = await aiRes.json();
    const reply = aiData.choices?.[0]?.message?.content || 'لم أتمكن من الحصول على رد مفيد حالياً.';

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
};
