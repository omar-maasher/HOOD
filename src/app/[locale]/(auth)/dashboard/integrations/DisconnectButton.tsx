'use client';

import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';

export function DisconnectButton({ channelKey }: { channelKey: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const isAr = locale === 'ar';

  const handleDisconnect = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/integrations/disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: channelKey }),
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
