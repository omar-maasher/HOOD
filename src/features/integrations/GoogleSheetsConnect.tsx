'use client';

import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { createGoogleSheetIntegration } from '@/app/[locale]/(auth)/dashboard/integrations/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GoogleSheetsConnect({ isAr }: { isAr: boolean }) {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      return;
    }

    startTransition(async () => {
      const result = await createGoogleSheetIntegration(email);
      if (!result.success) {
        setError(result.error || (isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'));
      }
    });
  };

  return (
    <form onSubmit={handleConnect} className="flex flex-col gap-3">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <Input
        type="email"
        placeholder={isAr ? 'أدخل إيميلك (مثل: user@gmail.com)' : 'Enter your email (e.g. user@gmail.com)'}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={isPending}
        className="rounded-xl"
      />
      <Button
        type="submit"
        disabled={isPending || !email}
        className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] ${isPending ? 'opacity-70' : ''}`}
      >
        {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
        {isPending
          ? (isAr ? 'جاري الإنشاء...' : 'Creating...')
          : (isAr ? 'إنشاء وربط الجدول' : 'Create & Link Sheet')}
      </Button>
    </form>
  );
}
