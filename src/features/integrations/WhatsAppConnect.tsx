'use client';

import { Link as LinkIcon, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

type WhatsAppConnectProps = {
  appId: string;
  isAr?: boolean;
};

export const WhatsAppConnect: React.FC<WhatsAppConnectProps> = ({ appId, isAr }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    // Load Meta SDK
    if (window.FB) {
      setSdkReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v25.0',
      });
      setSdkReady(true);
    };

    (function (d, s, id) {
      const js = d.createElement(s) as any;
      const fjs = d.getElementsByTagName(s)[0] as any;
      if (d.getElementById(id)) {
        return;
      }
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, [appId]);

  const handleCallback = async (code: string) => {
    try {
      const res = await fetch('/api/integrations/whatsapp/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (res.ok) {
        // eslint-disable-next-line no-alert
        alert(isAr ? 'تم الربط بنجاح! تم ربط حساب واتساب أعمال بنجاح.' : 'Connected Successfully! WhatsApp Business account connected successfully.');
        router.refresh();
      } else {
        const errorData = await res.json();
        const errorMsg = errorData.error || 'Failed to register WABA';
        throw new Error(errorMsg);
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      // eslint-disable-next-line no-alert
      alert(`${isAr ? 'خطأ في الربط: ' : 'Connection Error: '} ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  const launchWhatsAppSignup = () => {
    if (!sdkReady) {
      return;
    }

    setLoading(true);

    // Embedded Signup flow with Coexistence
    // IDs provided: App ID 4004663493011326, Config ID 1161530359261782
    window.FB.login((response: any) => {
      if (response.authResponse) {
        const code = response.authResponse.code;
        handleCallback(code);
      } else {
        setLoading(false);
        // eslint-disable-next-line no-console
        console.log('User cancelled login or did not fully authorize.');
      }
    }, {
      config_id: process.env.NEXT_PUBLIC_META_WA_CONFIG_ID, // Use environment variable
      response_type: 'code',
      override_default_response_type: true,
      scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management,public_profile',
      extras: {
        featureType: 'whatsapp_business_app_onboarding',
        sessionInfoVersion: '3',
        version: 'v3',
      },
    });
  };

  return (
    <Button
      onClick={launchWhatsAppSignup}
      disabled={loading || !sdkReady}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <LinkIcon className="size-4" />}
      {isAr ? 'ربط واتساب (Embedded)' : 'Connect WhatsApp (Embedded)'}
    </Button>
  );
};
