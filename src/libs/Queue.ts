import { Client } from '@upstash/qstash';

// Initialize the Upstash QStash client
// Ensure QSTASH_TOKEN is in your .env file
export const queueClient = new Client({
  token: process.env.QSTASH_TOKEN || '',
  baseUrl: process.env.QSTASH_URL,
});

/**
 * Helper function to publish a task to the queue
 * @param endpointUrl - The absolute URL of your API endpoint (e.g., https://yourdomain.com/api/queue/worker)
 * @param payload - The data you want to send to the worker
 * @param delay - Optional delay before execution (e.g., "10s", "5m", "2h", "1d")
 */
export const enqueueTask = async (endpointUrl: string, payload: any, delay?: string) => {
  if (!process.env.QSTASH_TOKEN) {
    console.warn('[QStash] Missing QSTASH_TOKEN, task not enqueued.');
    return null;
  }

  try {
    const res = await queueClient.publishJSON({
      url: endpointUrl,
      body: payload,
      delay, 
    });
    console.log(`[QStash] Task enqueued successfully: ${res.messageId}`);
    return res;
  } catch (error) {
    console.error('[QStash] Error publishing task:', error);
    throw error;
  }
};
