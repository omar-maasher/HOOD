'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { syncAllIntegrationsAction } from './actions';

export function SyncButton({ isAr, variant = 'default' }: { isAr: boolean; variant?: 'default' | 'minimal' }) {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      const result = await syncAllIntegrationsAction();
      if (result.success) {
        toast.success(isAr ? 'تمت المزامنة بنجاح!' : 'Sync completed successfully!');
      } else {
        toast.error(result.error || (isAr ? 'فشلت المزامنة' : 'Sync failed'));
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error(isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleSync}
        disabled={loading}
        className="rounded-lg p-1.5 text-muted-foreground transition-all hover:bg-muted active:scale-95 disabled:opacity-50"
        title={isAr ? 'مزامنة' : 'Sync'}
      >
        {loading ? <Loader2 className="size-4 animate-spin text-primary" /> : <RefreshCw className="size-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="flex items-center gap-2 rounded-2xl bg-white/10 px-6 py-2.5 text-sm font-bold text-white shadow-lg backdrop-blur-xl transition-all hover:bg-white/20 active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
      {isAr ? 'مزامنة كافة القنوات' : 'Sync All Channels'}
    </button>
  );
}
