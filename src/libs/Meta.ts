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
    'instagram_basic',
    'instagram_manage_messages',
    'public_profile',
    'pages_read_engagement', // Needed to see the link between page and IG
  ],
  messenger: [
    'pages_show_list',
    'pages_messaging',
    'pages_read_engagement',
    'pages_messaging_subscriptions',
    'public_profile',
  ],
  whatsapp: [
    'whatsapp_business_management',
    'whatsapp_business_messaging',
    'business_management',
    'public_profile',
  ],
};

export const getMetaAuthUrl = (state: string, platform?: MetaPlatform) => {
  const scopes = platform
    ? PLATFORM_SCOPES[platform]
    : [...new Set(Object.values(PLATFORM_SCOPES).flat())];

  const scopeString = scopes.join(',');

  return `https://www.facebook.com/${META_CONFIG.graphVersion}/dialog/oauth?client_id=${META_CONFIG.appId}&redirect_uri=${META_CONFIG.redirectUri}&state=${state}&scope=${scopeString}`;
};

export const exchangeCodeForToken = async (code: string, redirectUri?: string) => {
  // If redirectUri is explicitly passed as "", we use it (required for JS SDK exchange)
  // Otherwise we use the default from config.
  const rUri = redirectUri !== undefined ? redirectUri : META_CONFIG.redirectUri;

  let url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/oauth/access_token?client_id=${META_CONFIG.appId}&client_secret=${META_CONFIG.appSecret}&code=${code}`;

  if (rUri) {
    url += `&redirect_uri=${rUri}`;
  } else if (redirectUri === '') {
    url += `&redirect_uri=`;
  }

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

/**
 * Send a message via the Messenger API for Facebook Pages.
 */
export const sendMessengerMessage = async (
  pageId: string, // Facebook Page ID (stored as providerId in DB)
  recipientId: string, // Page-scoped user ID of the recipient
  text: string,
  accessToken: string, // Page Access Token
) => {
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
    console.error('Failed to send Messenger message:', errorData);
    throw new Error(`Meta API error: ${JSON.stringify(errorData)}`);
  }

  return response.json();
};
/**
 * Send a message via the WhatsApp Business Cloud API.
 */
export const sendWhatsAppMessage = async (
  phoneNumberId: string, // WhatsApp Phone Number ID (stored as providerId in DB)
  recipientId: string, // Phone number (with country code, no +)
  text: string,
  accessToken: string, // System User Access Token
) => {
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: recipientId,
      type: 'text',
      text: {
        preview_url: false,
        body: text,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error('Failed to send WhatsApp message:', errorData);
    throw new Error(`Meta API error (WhatsApp): ${JSON.stringify(errorData)}`);
  }

  return response.json();
};
/**
 * Fetch WhatsApp Business Accounts (WABA) for the current user.
 */
export const getWabaAccounts = async (accessToken: string) => {
  const results: any[] = [];
  const debugData: any = {};

  try {
    // 1. Try direct edge first
    const directUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/me/whatsapp_business_accounts?access_token=${accessToken}`;
    const directRes = await fetch(directUrl);
    const directResJson = await directRes.json();
    debugData.direct = directResJson;

    if (directRes.ok && directResJson.data) {
      results.push(...directResJson.data);
    }
  } catch (e) {
    console.error('Direct WABA fetch failed, trying businesses...', e);
    debugData.directError = String(e);
  }

  // 2. Fallback: Search through Business Managers (Very common for Embedded Signup)
  try {
    const bizUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/me/businesses?access_token=${accessToken}`;
    const bizRes = await fetch(bizUrl);
    const bizResJson = await bizRes.json();
    debugData.biz = bizResJson;

    if (bizRes.ok && bizResJson.data) {
      // eslint-disable-next-line no-console
      console.log(`Found ${bizResJson.data.length} businesses for this user.`);
      for (const business of bizResJson.data) {
        // eslint-disable-next-line no-console
        console.log(`Checking business: ${business.name} (${business.id})`);
        const wabaUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${business.id}/whatsapp_business_accounts?access_token=${accessToken}`;
        const wabaRes = await fetch(wabaUrl);
        const wabaResJson = await wabaRes.json();
        debugData[`waba_biz_${business.id}`] = wabaResJson;

        if (wabaRes.ok && wabaResJson.data) {
          // eslint-disable-next-line no-console
          console.log(`Found ${wabaResJson.data.length} WABAs in business ${business.id}`);
          results.push(...wabaResJson.data);
        }
      }
    }
  } catch (e) {
    console.error('Business-based WABA fetch failed', e);
    debugData.bizError = String(e);
  }

  // Remove duplicates by ID
  const uniqueResults = Array.from(new Map(results.map(item => [item.id, item])).values());

  if (uniqueResults.length === 0) {
    throw new Error(`WABA Error. Debug info: ${JSON.stringify(debugData)}`);
  }

  return { data: uniqueResults };
};

/**
 * Fetch Phone Numbers for a specific WABA ID.
 */
export const getWabaPhoneNumbers = async (wabaId: string, accessToken: string) => {
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/phone_numbers?access_token=${accessToken}`;
  const response = await fetch(url);
  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(`Failed to fetch WABA phone numbers: ${JSON.stringify(errData.error || errData)}`);
  }
  return response.json();
};

/**
 * Register a WABA account metadata in our database.
 * This is usually called after the user completes the Embedded Signup.
 */
export const fetchWabaDetails = async (accessToken: string) => {
  // 1. Get WABA ID
  const wabaData = await getWabaAccounts(accessToken);
  if (!wabaData.data || wabaData.data.length === 0) {
    throw new Error('No WhatsApp Business Account found');
  }

  const wabaId = wabaData.data[0].id;
  const wabaName = wabaData.data[0].name;

  // 2. Get Phone Number ID
  const phoneData = await getWabaPhoneNumbers(wabaId, accessToken);
  if (!phoneData.data || phoneData.data.length === 0) {
    throw new Error('No WhatsApp Phone Number found in this WABA');
  }

  const phoneNumberId = phoneData.data[0].id;
  const displayPhoneNumber = phoneData.data[0].display_phone_number;

  return {
    wabaId,
    wabaName,
    phoneNumberId,
    displayPhoneNumber,
  };
};
