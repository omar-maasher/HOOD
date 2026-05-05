'use client';

import { Check, Copy, FileSpreadsheet, Loader2 } from 'lucide-react';
import { useState, useTransition } from 'react';

import { createGoogleSheetIntegration } from '@/app/[locale]/(auth)/dashboard/integrations/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function GoogleSheetsConnect({ isAr }: { isAr: boolean }) {
  const [url, setUrl] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const botEmail = 'sheets-bot@neon-effect-495417-t3.iam.gserviceaccount.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(botEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!url) {
      return;
    }

    startTransition(async () => {
      const result = await createGoogleSheetIntegration(url);
      if (!result.success) {
        setError(result.error || (isAr ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred'));
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-5">
      <div className="text-sm text-muted-foreground">
        <p className="mb-2 font-bold text-foreground">{isAr ? 'خطوات الربط:' : 'Connection Steps:'}</p>
        <ol className="list-inside list-decimal space-y-2">
          <li>{isAr ? 'قم بإنشاء جدول Google Sheets جديد.' : 'Create a new Google Sheet.'}</li>
          <li>
            {isAr ? 'اضغط على زر المشاركة (Share) وأضف هذا الإيميل كـ (مُحرر / Editor):' : 'Click Share and add this email as Editor:'}
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-muted p-2">
              <code className="flex-1 text-xs">{botEmail}</code>
              <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={handleCopy}>
                {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
              </Button>
            </div>
          </li>
          <li>{isAr ? 'انسخ رابط الجدول وألصقه بالأسفل.' : 'Copy the Sheet URL and paste it below.'}</li>
        </ol>
      </div>

      <form onSubmit={handleConnect} className="mt-2 flex flex-col gap-3">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <Input
          type="url"
          placeholder={isAr ? 'أدخل رابط جدول جوجل (https://docs.google.com/...)' : 'Enter Google Sheet URL'}
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
          disabled={isPending}
          className="rounded-xl"
        />
        <Button
          type="submit"
          disabled={isPending || !url}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] ${isPending ? 'opacity-70' : ''}`}
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <FileSpreadsheet className="size-4" />}
          {isPending
            ? (isAr ? 'جاري الربط...' : 'Connecting...')
            : (isAr ? 'ربط الجدول' : 'Link Sheet')}
        </Button>
      </form>
    </div>
  );
}
