'use client';

import { AlertCircle, Check, DatabaseZap, Loader2, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

import { saveStoreIntegrationAndSync } from '@/app/[locale]/(auth)/dashboard/integrations/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function StoreConnect({ platform, isAr }: { platform: string; isAr: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successCount, setSuccessCount] = useState<number | null>(null);

  const handleConnect = async () => {
    if (platform !== 'custom' && platform !== 'scraper' && !accessToken) {
      setError(isAr ? 'يرجى إدخال رمز الوصول أولاً' : 'Access token is required');
      return;
    }
    if (platform === 'scraper' && !storeUrl) {
      setError(isAr ? 'يرجى إدخال رابط الموقع أو المنتج المطلوب سحبه.' : 'Link is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessCount(null);
    try {
      const res = await saveStoreIntegrationAndSync(platform, storeUrl, accessToken);
      if (res.success) {
        setSuccessCount(res.count);
        setTimeout(() => setIsOpen(false), 5000);
      }
    } catch (e: any) {
      setError(e.message || 'حدث خطأ مجهول');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-500 p-6 font-bold text-white shadow-lg shadow-amber-500/20 transition-all hover:bg-amber-600 active:scale-[0.98]"
      >
        <DatabaseZap className="size-4" />
        {platform === 'scraper'
          ? (isAr ? 'تعرف على المنتجات والخدمات (Auto-Discover)' : 'Discover Services & Products')
          : (isAr ? 'اربط المتجر واسحب البيانات' : 'Connect & Sync Data')}
      </Button>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4">
      <div className="mt-2 space-y-4 rounded-2xl border bg-muted/20 p-4 shadow-inner">

        {platform !== 'salla' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">
              {platform === 'custom' ? (isAr ? 'رابط الـ API Endpoint' : 'API Endpoint URL') : platform === 'scraper' ? (isAr ? 'رابط موقعك (لجلب جميع خدماتك) أو رابط منتج محدد' : 'Website or Product URL') : (isAr ? 'رابط المتجر (Store URL)' : 'Store URL')}
            </label>
            <Input
              value={storeUrl}
              onChange={e => setStoreUrl(e.target.value)}
              placeholder={platform === 'custom' ? 'https://api.my-domain.com/v1/products' : platform === 'scraper' ? 'https://mystore.com' : 'https://mystore.com'}
              className="h-12 rounded-xl bg-background"
              dir="ltr"
            />
          </div>
        )}

        {platform !== 'scraper' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground">
              {platform === 'custom'
                ? (isAr ? 'قيمة المصادقة - اختياري (Auth Header)' : 'Auth Header')
                : (isAr ? 'مفتاح الربط (Access Token)' : 'Access Token')}
            </label>
            <Input
              value={accessToken}
              onChange={e => setAccessToken(e.target.value)}
              placeholder={platform === 'custom' ? 'Bearer xxxxxxxxx' : 'xxxxxxxxxxxxxxxxxx'}
              className="h-12 rounded-xl bg-background"
              type="password"
              dir="ltr"
            />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm font-medium text-red-600">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {successCount !== null && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm font-medium text-emerald-600">
            <Check size={16} />
            {isAr ? `نجاح! تم سحب ${successCount} منتج رسمياً إلى المنصة.` : `Success! Synced ${successCount} products officially.`}
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button disabled={loading} variant="outline" className="h-11 w-1/3 rounded-xl" onClick={() => setIsOpen(false)}>
            {isAr ? 'إلغاء' : 'Cancel'}
          </Button>
          <Button disabled={loading} className="h-11 w-2/3 rounded-xl bg-primary font-bold hover:bg-primary/90" onClick={handleConnect}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : <ShoppingBag className="mx-2 size-4" />}
            {isAr ? 'سحب المنتجات رسمياً' : 'Pull Products Officially'}
          </Button>
        </div>

      </div>
    </div>
  );
}
