import React from 'react';

export default function SubscriptionPage({ params }: { params: { locale: string } }) {
  const isAr = params.locale === 'ar';

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
      <h1 className="text-4xl font-bold">
        {isAr ? 'صفحة الاشتراكات' : 'Subscription Page'}
      </h1>
      <p className="text-xl text-muted-foreground">
        {isAr ? 'جاري فحص النظام... إذا كنت ترى هذه الرسالة فالبنية الأساسية للموقع تعمل.' : 'System check... if you see this, the core infrastructure is working.'}
      </p>
      
      {/* عرض نسخة Next.js للتأكد */}
      <div className="mt-8 p-4 bg-muted rounded-xl text-sm font-mono">
        Locale: {params.locale}
      </div>
    </div>
  );
}
