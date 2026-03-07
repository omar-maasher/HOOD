import { NextResponse } from 'next/server';

/**
 * INSTRUCTIONS FOR USER:
 * If this page says "waiting", it means the server has not received ANY request from Meta.
 *
 * Check these 3 things in Meta Dashboard:
 * 1. Is your URL exactly: https://your-domain.com/api/webhooks/meta
 * 2. Did you click "Manage" in WhatsApp Configuration and "Subscribe" to "messages"?
 * 3. In the WhatsApp 'Getting Started' page, did you add YOUR phone number to the 'To' field
 *    (Recipient Phone Numbers)? Meta won't send webhooks from unverified numbers in dev mode.
 */
export const GET = async () => {
  return NextResponse.json({
    status: 'waiting',
    message: 'No webhook received by the server yet.',
    troubleshooting: [
      'Ensure your phone number is added to \'Recipient Phone Numbers\' in WhatsApp Dashboard',
      'Verify that you subscribed to \'messages\' field in WhatsApp > Configuration > Webhooks',
      'Check your server logs for \'INCOMING_WEBHOOK_PAYLOAD\'',
    ],
  });
};
