import { verifySignatureAppRouter } from '@upstash/qstash/dist/nextjs';
import { NextResponse } from 'next/server';

import { processMetaWebhookPayload } from '@/app/api/webhooks/meta/route';

/**
 * Worker endpoint for Upstash QStash.
 * The verifySignatureAppRouter middleware ensures that the request
 * is genuinely sent by Upstash using your signing keys.
 * 
 * Required ENV vars for verification:
 * - QSTASH_CURRENT_SIGNING_KEY
 * - QSTASH_NEXT_SIGNING_KEY
 */
async function handler(req: Request) {
  try {
    const body = await req.json();
    const { taskType, data } = body;

    console.log(`[Queue Worker] Processing task: ${taskType}`);

    // Route tasks based on taskType
    switch (taskType) {
      case 'process_meta_webhook':
        console.log('[Queue] Processing Meta Webhook in background...');
        await processMetaWebhookPayload(data);
        break;

      case 'sync_meta_comments':

      case 'send_bulk_whatsapp':
        // Example: Send bulk messages
        console.log('[Queue] Sending WhatsApp bulk message to:', data?.phoneNumbers?.length, 'users');
        break;

      default:
        console.warn(`[Queue Worker] Unknown task type: ${taskType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Queue Worker] Error processing task:', error);
    
    // Returning 500 tells QStash to retry the task later based on your retry settings.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Wrap the handler with Upstash's signature verification
export const POST = verifySignatureAppRouter(handler);
