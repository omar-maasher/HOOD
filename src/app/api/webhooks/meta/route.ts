import { NextResponse } from 'next/server';

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.META_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }

  return new NextResponse('Forbidden', { status: 403 });
};

export const POST = async (request: Request) => {
  const body = await request.json();

  console.log('Received Meta Webhook:', JSON.stringify(body, null, 2));

  // Handle different object types: 'page' (Messenger/IG), 'whatsapp_business_account'
  if (body.object === 'page') {
    // Handle Messenger/Instagram messages
    body.entry?.forEach((entry: any) => {
      const messaging = entry.messaging?.[0];
      if (messaging) {
        console.log('New Message from:', messaging.sender.id, 'Content:', messaging.message?.text);
        // Here you would trigger your AI processing logic
      }
    });
  } else if (body.object === 'whatsapp_business_account') {
    // Handle WhatsApp messages
    body.entry?.forEach((entry: any) => {
      const changes = entry.changes?.[0];
      if (changes?.value?.messages) {
        console.log('New WhatsApp Message from:', changes.value.messages[0].from);
      }
    });
  }

  return new NextResponse('OK', { status: 200 });
};
