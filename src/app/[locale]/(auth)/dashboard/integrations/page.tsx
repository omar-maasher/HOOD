import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { Info, Instagram, Link as LinkIcon, MessageSquare, Phone } from 'lucide-react';
import { getLocale } from 'next-intl/server';

import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';

import { DisconnectButton } from './DisconnectButton';

export default async function IntegrationsPage(props: { searchParams: Promise<any> }) {
  const { orgId } = await auth();
  const locale = await getLocale();
  const isAr = locale === 'ar';
  const searchParams = await props.searchParams;
  const error = searchParams.error;
  const success = searchParams.success;

  let integrations: any[] = [];

  try {
    // Fetch real integrations for this organization
    if (orgId) {
      integrations = await db.query.integrationSchema.findMany({
        where: eq(integrationSchema.organizationId, orgId),
      });
    }
  } catch (error) {
    console.error('Error fetching integrations:', error);
  }

  // Check specific statuses
  const isMessengerConnected = integrations.some(i => i.type === 'messenger' && i.status === 'active');
  const isInstagramConnected = integrations.some(i => i.type === 'instagram' && i.status === 'active');
  const isWhatsappConnected = integrations.some(i => i.type === 'whatsapp' && i.status === 'active');

  const channels = [
    {
      key: 'instagram',
      name: isAr ? 'إنستجرام (Instagram)' : 'Instagram',
      description: isAr ? 'الرد الآلي على الرسائل المباشرة والتعليقات .' : 'Automated replies for DMs, comments.',
      status: isInstagramConnected ? 'connected' : 'not_connected',
      icon: Instagram,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      key: 'messenger',
      name: isAr ? 'ماسنجر (Messenger)' : 'Messenger',
      description: isAr ? 'إدارة رسائل صفحة الفيسبوك الخاصة بك تلقائياً.' : 'Automatically manage your Facebook Page messages.',
      status: isMessengerConnected ? 'connected' : 'not_connected',
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      key: 'whatsapp',
      name: isAr ? 'واتساب (WhatsApp)' : 'WhatsApp',
      description: isAr ? 'ربط واجهة Cloud API للردود السريعة  .' : 'Connect Cloud API for quick replies .',
      status: isWhatsappConnected ? 'connected' : 'not_connected',
      icon: Phone,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className={`flex flex-col items-start justify-between gap-4 md:flex-row md:items-center ${isAr ? 'text-start' : 'text-left'}`}>
        <div>
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {isAr ? 'ربط المنصات والقنوات' : 'Connect Platforms & Channels'}
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            {isAr ? 'اربط حسابات التواصل الاجتماعي لتبدأ الأتمتة الذكية.' : 'Connect your social media accounts to start smart automation.'}
          </p>
        </div>
      </div>

      {error === 'no_instagram_account' && (
        <div className={`rounded-2xl border border-red-200 bg-red-50 p-6 ${isAr ? 'text-start' : 'text-left'}`}>
          <h3 className="text-lg font-bold text-red-900">
            {isAr ? 'لم يتم العثور على حساب إنستجرام أعمال' : 'No Instagram Business Account Found'}
          </h3>
          <p className="mt-1 text-sm text-red-800/80">
            {isAr
              ? `تم العثور على (${searchParams.pages_found || 0}) صفحة فيسبوك، ولكن لا توجد أي واحدة منها مرتبطة بحساب إنستجرام احترافي. تأكد من ربط حساب الأعمال بصفحتك في إعدادات فيسبوك.`
              : `Found (${searchParams.pages_found || 0}) Facebook pages, but none are linked to an Instagram Business account. Please link your Business account in Facebook settings.`}
          </p>
        </div>
      )}

      {success === 'connected' && (
        <div className={`rounded-2xl border border-emerald-200 bg-emerald-50 p-6 ${isAr ? 'text-start' : 'text-left'}`}>
          <h3 className="text-lg font-bold text-emerald-900">
            {isAr ? 'تم الربط بنجاح!' : 'Connected Successfully!'}
          </h3>
          <p className="mt-1 text-sm text-emerald-800/80">
            {isAr ? 'تم تفعيل الاتصال بنجاح.' : 'The connection has been successfully established.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isConnected = channel.status === 'connected';

          return (
            <div
              key={channel.key}
              className={`group relative flex flex-col rounded-[2rem] border bg-card p-8 shadow-xl shadow-gray-100/50 transition-all duration-300 ${isConnected ? 'border-emerald-200 ring-4 ring-emerald-500/5' : 'hover:border-primary/40'}`}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className={`flex size-14 items-center justify-center rounded-2xl ${channel.bg} ${channel.color} shadow-inner`}>
                  <Icon className="size-7" />
                </div>
                {isConnected
                  ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                        <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {isAr ? 'متصل الآن' : 'CONNECTED'}
                      </span>
                    )
                  : (
                      <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground">
                        {isAr ? 'غير مرتبط' : 'NOT CONNECTED'}
                      </span>
                    )}
              </div>

              <div className={`flex-1 ${isAr ? 'text-start' : 'text-left'}`}>
                <h3 className="mb-2 flex items-center gap-2 text-xl font-bold">
                  {channel.name}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {channel.description}
                </p>
              </div>

              <div className="mt-8 border-t border-dashed pt-6">
                {isConnected
                  ? (
                      <div className="flex items-center justify-start">
                        <DisconnectButton channelKey={channel.key} />
                      </div>
                    )
                  : (
                      <a
                        href={`/api/auth/meta?platform=${channel.key}&locale=${locale}`}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-[0.98]"
                      >
                        <LinkIcon className="size-4" />
                        {isAr ? 'ربط الحساب' : 'Connect Account'}
                      </a>
                    )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`mt-4 flex flex-col items-center gap-6 rounded-[2rem] border border-amber-200/50 bg-amber-50/50 p-8 md:flex-row ${isAr ? 'text-start' : 'text-left'}`}>
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-inner">
          <Info className="size-8" />
        </div>
        <div>
          <h3 className="mb-1 text-lg font-bold text-amber-900">
            {isAr ? 'تعليمات هامة قبل الربط' : 'Important Instructions'}
          </h3>
          <p className="max-w-3xl text-sm leading-relaxed text-amber-800/80">
            {isAr
              ? 'لضمان نجاح عملية الربط، تأكد من تحويل حسابك إلى **حساب أعمال (Business Account)** وربطه بصفحة فيسبوك نشطة. يساعدك ذلك في الحصول على أفضل أداء للردود الآلية والتحليلات.'
              : 'To ensure a successful connection, make sure your account is a **Business Account** and linked to an active Facebook Page. This helps you get the best performance for automated replies.'}
          </p>
        </div>
      </div>
    </div>
  );
}
