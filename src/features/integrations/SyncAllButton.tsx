'use client';

import { RefreshCw } from 'lucide-react';
import { useState, useTransition } from 'react';

import { triggerGoogleSheetsSync } from '@/app/[locale]/(auth)/dashboard/integrations/actions';
import { Button } from '@/components/ui/button';

export function SyncAllButton({ isAr }: { isAr: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const handleSync = () => {
    setMessage(null);
    startTransition(async () => {
      const result = await triggerGoogleSheetsSync();
      if (result.success) {
        setMessage(isAr ? `تمت المزامنة بنجاح! تم نقل ${result.count} حجز.` : `Successfully synced ${result.count} bookings.`);
      } else {
        setMessage(result.error || (isAr ? 'فشلت المزامنة.' : 'Sync failed.'));
      }
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {message && (
        <div className={`rounded-lg border p-2 text-center text-xs font-bold ${message.includes('نجاح') || message.includes('Success') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}
      <Button
        variant="outline"
        onClick={handleSync}
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
      >
        <RefreshCw className={`size-4 ${isPending ? 'animate-spin' : ''}`} />
        {isPending
          ? (isAr ? 'جاري المزامنة...' : 'Syncing...')
          : (isAr ? 'مزامنة الحجوزات القديمة' : 'Sync Old Bookings')}
      </Button>
    </div>
  );
}
