import { logger } from './Logger';

export const META_CONFIG = {
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI,
  systemUserToken: process.env.META_SYSTEM_USER_TOKEN,
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
  ],
};

const handleMetaError = (error: any) => {
  const metaError = error?.error;

  if (!metaError) {
    throw new Error('Unknown Meta API error');
  }

  // Handle common Meta API specific error codes cleanly
  switch (metaError.code) {
    case 190:
      throw new Error('META_TOKEN_EXPIRED: Please reconnect your Meta account.');
    case 200:
      throw new Error('USER_BLOCKED_BOT: The user has blocked this bot or page.');
    case 131030:
      throw new Error('PHONE_NOT_REGISTERED: The phone number is not registered or linked properly.');
    case 131047:
      throw new Error('PAYMENT_REQUIRED: Missing valid payment method to start outbound conversation.');
    default:
      throw new Error(`META_ERROR: ${metaError.message}`);
  }
};

export const getMetaAuthUrl = (state: string, platform?: MetaPlatform) => {
  const scopes = platform
    ? PLATFORM_SCOPES[platform]
    : [...new Set(Object.values(PLATFORM_SCOPES).flat())];

  const params = new URLSearchParams({
    client_id: META_CONFIG.appId || '',
    redirect_uri: META_CONFIG.redirectUri || '',
    state,
    scope: scopes.join(','),
  });

  return `https://www.facebook.com/${META_CONFIG.graphVersion}/dialog/oauth?${params.toString()}`;
};

export const exchangeCodeForToken = async (code: string, redirectUri?: string) => {
  // If redirectUri is explicitly passed as "", we use it (required for JS SDK exchange)
  // Otherwise we use the default from config.
  const rUri = redirectUri !== undefined ? redirectUri : META_CONFIG.redirectUri;

  const params = new URLSearchParams({
    client_id: META_CONFIG.appId || '',
    client_secret: META_CONFIG.appSecret || '',
    code,
  });

  if (rUri || redirectUri === '') {
    params.append('redirect_uri', rUri || '');
  }

  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/oauth/access_token?${params.toString()}`;

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
    logger.error({ errorData }, 'Failed to send Instagram message');
    handleMetaError(errorData);
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
    logger.error({ errorData }, 'Failed to send Messenger message');
    handleMetaError(errorData);
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
    logger.error({ errorData }, 'Failed to send WhatsApp message');
    handleMetaError(errorData);
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

  // 3. Fallback 3: Debug the Token itself to find any associated WABA or Business IDs
  try {
    const debugUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/debug_token?input_token=${accessToken}&access_token=${META_CONFIG.appId}|${META_CONFIG.appSecret}`;
    const debugRes = await fetch(debugUrl);
    const debugResJson = await debugRes.json();
    debugData.tokenDebug = debugResJson;

    // Some Embedded Signup tokens inherently grant access to granular IDs
    if (debugRes.ok && debugResJson.data && debugResJson.data.granular_scopes) {
      const wabaScope = debugResJson.data.granular_scopes.find((s: any) => s.scope === 'whatsapp_business_management');
      if (wabaScope && wabaScope.target_ids) {
        for (const targetId of wabaScope.target_ids) {
          // Verify if it's a valid WABA by fetching it using the client's token which has the granular scope
          const checkWabaUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${targetId}?access_token=${accessToken}`;
          const checkWabaRes = await fetch(checkWabaUrl);
          const checkWabaResJson = await checkWabaRes.json();
          debugData[`waba_verify_${targetId}`] = checkWabaResJson;
          if (checkWabaRes.ok && checkWabaResJson.id) {
            results.push(checkWabaResJson);
          }
        }
      }
    }
  } catch (e) {
    console.error('Token debug failed', e);
    debugData.tokenDebugError = String(e);
  }

  // Remove duplicates by ID
  const uniqueResults = Array.from(new Map(results.map(item => [item?.id || item, item])).values());

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
export const fetchWabaDetails = async ({
  accessToken,
  wabaId: providedWabaId,
  phoneNumberId: providedPhoneNumberId,
  pin,
}: {
  accessToken: string;
  wabaId?: string;
  phoneNumberId?: string;
  pin: string;
}) => {
  let wabaId = providedWabaId;
  let wabaName = 'WhatsApp Business Account';

  // 1. Get WABA ID if not provided
  if (!wabaId) {
    const wabaData = await getWabaAccounts(accessToken);
    if (!wabaData.data || wabaData.data.length === 0) {
      throw new Error('Could not extract any valid WhatsApp Business Account IDs from the provided Meta configuration. Please ensure the Business Account exists and has WhatsApp enabled.');
    }
    wabaId = wabaData.data[0].id;
    wabaName = wabaData.data[0].name || wabaName;
  } else {
    // Alternatively, we could fetch exactly this wabaId to get its name, but it's optional
  }

  // 2. Get Phone Number ID if not provided, else verify it exists
  const phoneData = await getWabaPhoneNumbers(wabaId as string, accessToken);
  if (!phoneData.data || phoneData.data.length === 0) {
    throw new Error('No WhatsApp Phone Number found in this WABA');
  }

  const phoneObj = providedPhoneNumberId
    ? phoneData.data.find((p: any) => p.id === providedPhoneNumberId)
    : phoneData.data[0];

  if (!phoneObj) {
    throw new Error('Requested Phone number ID not found in the selected WABA');
  }

  const phoneNumberId = phoneObj.id;
  const displayPhoneNumber = phoneObj.display_phone_number;

  // 3. Register the Phone Number with Meta (Required to start sending messages)
  try {
    const registerUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${phoneNumberId}/register`;
    const registerRes = await fetch(registerUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        pin, // Use dynamically generated or user-provided PIN
      }),
    });

    if (!registerRes.ok) {
      const errorData = await registerRes.json().catch(() => ({}));
      logger.warn({ errorData }, 'Phone number registration warn/error:'); // Don't throw, it might be already registered
    }
  } catch (err) {
    logger.error(err, 'Failed to execute phone number registration API');
  }

  // 4. Subscribe the App to the WABA Webhooks
  try {
    const validToken = META_CONFIG.systemUserToken || accessToken;
    const subscribeUrl = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/subscribed_apps`;
    const subscribeRes = await fetch(subscribeUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${validToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!subscribeRes.ok) {
      const errorData = await subscribeRes.json().catch(() => ({}));
      logger.warn({ errorData }, 'WABA Subscribed Apps warn/error');
    } else {
      logger.info({ wabaId }, 'Successfully subscribed app to WABA webhooks');
    }
  } catch (err) {
    logger.error(err, 'Failed to execute WABA subscribed apps API');
  }

  return {
    wabaId,
    wabaName,
    phoneNumberId,
    displayPhoneNumber,
  };
};

// ─── WhatsApp Template Management ────────────────────────────────────────────

export type WaTemplateButton =
  | { type: 'URL'; text: string; url: string }
  | { type: 'PHONE_NUMBER'; text: string; phone_number: string }
  | { type: 'QUICK_REPLY'; text: string };

export type CreateWaTemplateInput = {
  wabaId: string;
  accessToken: string;
  name: string; // snake_case
  language: string; // 'ar' | 'en_US'
  category: 'MARKETING' | 'UTILITY';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: WaTemplateButton[];
};

export const createWaTemplate = async (input: CreateWaTemplateInput) => {
  const { wabaId, accessToken, name, language, category, headerText, bodyText, footerText, buttons } = input;

  const components: any[] = [];

  if (headerText) {
    components.push({ type: 'HEADER', format: 'TEXT', text: headerText });
  }

  const bodyComponent: any = { type: 'BODY', text: bodyText };
  // Detect variables like {{1}}, {{2}} and add examples (required by Meta)
  const matches = bodyText.match(/\{\{\d+\}\}/g);
  if (matches && matches.length > 0) {
    const examples = matches.map(() => 'نموذج'); // Sample text for each variable
    bodyComponent.example = { body_text: [examples] };
  }
  components.push(bodyComponent);

  if (footerText) {
    components.push({ type: 'FOOTER', text: footerText });
  }

  if (buttons && buttons.length > 0) {
    components.push({
      type: 'BUTTONS',
      buttons: buttons.map((b) => {
        if (b.type === 'URL') {
          return { type: 'URL', text: b.text, url: b.url };
        }
        if (b.type === 'PHONE_NUMBER') {
          return { type: 'PHONE_NUMBER', text: b.text, phone_number: b.phone_number };
        }
        return { type: 'QUICK_REPLY', text: b.text };
      }),
    });
  }

  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/message_templates`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, language, category, components }),
  });

  const data = await res.json();
  if (!res.ok) {
    handleMetaError(data);
  }
  return data; // { id, status }
};

export const listWaTemplates = async (wabaId: string, accessToken: string) => {
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/message_templates?fields=id,name,status,category,language,components,rejected_reason&limit=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) {
    handleMetaError(data);
  }
  return data; // { data: [...templates] }
};

export const deleteWaTemplate = async (wabaId: string, templateName: string, accessToken: string) => {
  const params = new URLSearchParams({ name: templateName });
  const url = `https://graph.facebook.com/${META_CONFIG.graphVersion}/${wabaId}/message_templates?${params.toString()}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) {
    handleMetaError(data);
  }
  return data;
};

/**
 * Send a template-based message via the WhatsApp Business Cloud API.
 */
export const sendWaTemplate = async (
  phoneNumberId: string,
  recipientId: string,
  templateName: string,
  languageCode: string,
  accessToken: string,
  components?: any[], // optional variable values
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
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    logger.error({ errorData }, 'Failed to send WhatsApp template message');
    handleMetaError(errorData);
  }

  return response.json();
};
