'use client';

import { Loader2, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { refreshInstagramIntegration } from './actions';

type RefreshIGButtonProps = {
  integrationId: number;
  isAr: boolean;
};

export function RefreshIGButton({ integrationId, isAr }: RefreshIGButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const result = await refreshInstagramIntegration(integrationId);
      if (result.success) {
        toast.success(isAr ? 'تم تحديث الربط وتفعيل الرسائل بنجاح!' : 'Connection refreshed and messages activated!');
      } else {
        toast.error(result.error || (isAr ? 'فشل تحديث الربط' : 'Refresh failed'));
      }
    } catch (error) {
      console.error('Refresh error:', error);
      toast.error(isAr ? 'حدث خطأ أثناء محاولة التحديث' : 'An error occurred during refresh');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2 text-xs font-bold text-pink-700 transition-all hover:bg-pink-100 active:scale-95 disabled:opacity-50"
    >
      {loading ? <Loader2 className="size-3 animate-spin" /> : <RefreshCw className="size-3" />}
      {isAr ? 'تحديث الربط' : 'Refresh Connection'}
    </button>
  );
}
