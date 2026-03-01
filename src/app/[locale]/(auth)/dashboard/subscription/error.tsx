'use client';

export default function SubscriptionError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <div className="space-y-3 text-center">
        <h2 className="text-2xl font-bold text-gray-900">حدث خطأ في تحميل الصفحة</h2>
        <p className="text-muted-foreground">يرجى المحاولة مرة أخرى</p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-2xl bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:bg-primary/90"
      >
        إعادة المحاولة
      </button>
    </div>
  );
}
