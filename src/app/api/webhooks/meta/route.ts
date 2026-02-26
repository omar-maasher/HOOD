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

  // Forward the entire payload to n8n webhook
  const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
  
  if (n8nWebhookUrl) {
    try {
      console.log('Forwarding payload to n8n...');
      // We do not await this, we just fire and forget so Meta gets a 200 OK immediately
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).catch(err => console.error('Error forwarding to n8n (async block):', err));
      
    } catch (error) {
      console.error('Error initiating forward to n8n:', error);
    }
  } else {
    console.log('No N8N_WEBHOOK_URL configured, skipping forward.');
  }

  // Acknowledge receipt to Meta immediately
  return new NextResponse('OK', { status: 200 });
};
