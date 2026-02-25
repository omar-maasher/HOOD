export const META_CONFIG = {
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  redirectUri: process.env.NEXT_PUBLIC_META_REDIRECT_URI,
  graphVersion: 'v21.0',
};

export const getMetaAuthUrl = (state: string) => {
  const scopes = [
    'pages_show_list',
    'pages_messaging',
    'instagram_basic',
    'instagram_manage_messages',
    'whatsapp_business_management',
    'whatsapp_business_messaging',
    'public_profile',
    'email'
  ].join(',');

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
