export const META_CONFIG = {
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI,
  graphVersion: 'v21.0',
};

export type MetaPlatform = 'instagram' | 'messenger' | 'whatsapp';

const PLATFORM_SCOPES: Record<MetaPlatform, string[]> = {
  instagram: [
    'pages_show_list',
    'pages_messaging',
    'instagram_basic',
    'instagram_manage_messages',
    'public_profile',
  ],
  messenger: [
    'pages_show_list',
    'pages_messaging',
    'public_profile',
  ],
  whatsapp: [
    'whatsapp_business_management',
    'whatsapp_business_messaging',
    'public_profile',
  ],
};

export const getMetaAuthUrl = (state: string, platform?: MetaPlatform) => {
  const scopes = platform
    ? PLATFORM_SCOPES[platform].join(',')
    : [...new Set(Object.values(PLATFORM_SCOPES).flat())].join(',');

  return `https://www.facebook.com/${META_CONFIG.graphVersion}/dialog/oauth?client_id=${META_CONFIG.appId}&redirect_uri=${META_CONFIG.redirectUri}&state=${state}&scope=${scopes}`;
};

export const exchangeCodeForToken = async (code: string) => {
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/oauth/access_token?client_id=${META_CONFIG.appId}&redirect_uri=${META_CONFIG.redirectUri}&client_secret=${META_CONFIG.appSecret}&code=${code}`;

  const response = await fetch(url);
  return response.json();
};

export const getLongLivedToken = async (shortLivedToken: string) => {
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/oauth/access_token?grant_type=fb_exchange_token&client_id=${META_CONFIG.appId}&client_secret=${META_CONFIG.appSecret}&fb_exchange_token=${shortLivedToken}`;

  const response = await fetch(url);
  return response.json();
};

/**
 * Send a message via the Messenger API for Instagram.
 *
 * IMPORTANT: `pageId` must be the FACEBOOK PAGE ID (not the Instagram
 * Business Account ID). The `/messages` endpoint is scoped to the Facebook
 * Page that is linked to the Instagram account.
 *
 * The `accessToken` must be the PAGE ACCESS TOKEN for that page.
 *
 * Required app permissions:
 *   - instagram_manage_messages  (needs Meta App Review for live mode)
 *   - pages_messaging
 *
 * Docs: https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message
 */
export const sendInstagramMessage = async (
  pageId: string, // Facebook Page ID (stored as providerId in DB)
  recipientId: string, // Instagram-scoped user ID of the recipient
  text: string,
  accessToken: string, // Page Access Token
) => {
  // Endpoint: POST /{page-id}/messages  (Messenger API for Instagram)
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${pageId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to send Instagram message:', errorData);
    throw new Error(`Meta API error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};
