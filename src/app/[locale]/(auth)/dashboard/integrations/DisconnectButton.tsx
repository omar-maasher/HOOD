'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export function DisconnectButton({ channelKey }: { channelKey: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDisconnect = () => {
    startTransition(async () => {
      try {
        const res = await fetch('/api/integrations/disconnect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: channelKey })
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
      className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl font-bold"
    >
      {isPending ? 'جاري الإلغاء...' : 'إلغاء الربط'}
    </Button>
  );
}
