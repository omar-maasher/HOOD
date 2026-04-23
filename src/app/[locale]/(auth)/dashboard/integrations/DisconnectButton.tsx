'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';

export function DisconnectButton({ channelKey, integrationId }: { channelKey: string; integrationId?: number }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === 'ar';

  const handleDisconnect = () => {
    if (!confirm(isAr ? 'هل أنت متأكد من رغبتك في إلغاء الربط؟' : 'Are you sure you want to disconnect?')) {
      return;
    }

    startTransition(async () => {
      try {
        const res = await fetch('/api/integrations/disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: channelKey, integrationId }),
        });

        if (res.ok) {
          router.refresh();
        }
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleDisconnect}
      disabled={isPending}
      className="rounded-xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      {isPending ? (isAr ? 'جاري الإلغاء...' : 'Disconnecting...') : (isAr ? 'إلغاء الربط' : 'Disconnect')}
    </Button>
  );
}
