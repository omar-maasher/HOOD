import { Instagram, Link as LinkIcon, MessageSquare, Phone, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/libs/DB';
import { integrationSchema } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { getLocale } from 'next-intl/server';

import { DisconnectButton } from './DisconnectButton';

export default async function IntegrationsPage() {
  const { orgId } = await auth();
  const locale = await getLocale();
  const isAr = locale === 'ar';

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
  const isMetaRootConnected = integrations.some(i => i.type === 'facebook_root' && i.status === 'active');
  const isInstagramConnected = integrations.some(i => i.type === 'instagram' && i.status === 'active');
  const isWhatsappConnected = integrations.some(i => i.type === 'whatsapp' && i.status === 'active');

  const channels = [
    {
      key: 'instagram',
      name: isAr ? 'إنستجرام (Instagram)' : 'Instagram',
      description: isAr ? 'الرد الآلي على الرسائل المباشرة والتعليقات والقصص.' : 'Automated replies for DMs, comments, and stories.',
      status: isInstagramConnected ? 'connected' : 'not_connected',
      icon: Instagram,
      color: 'text-pink-600',
      bg: 'bg-pink-50',
    },
    {
      key: 'messenger',
      name: isAr ? 'ماسنجر (Messenger)' : 'Messenger',
      description: isAr ? 'إدارة رسائل صفحة الفيسبوك الخاصة بك تلقائياً.' : 'Automatically manage your Facebook Page messages.',
      status: isMetaRootConnected ? 'connected' : 'not_connected',
      icon: MessageSquare,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      key: 'whatsapp',
      name: isAr ? 'واتساب (WhatsApp)' : 'WhatsApp',
      description: isAr ? 'ربط واجهة Cloud API للردود السريعة وحملات التسويق.' : 'Connect Cloud API for quick replies and marketing campaigns.',
      status: isWhatsappConnected ? 'connected' : 'not_connected',
      icon: Phone,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${isAr ? 'text-start' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            {isAr ? 'ربط المنصات والقنوات' : 'Connect Platforms & Channels'}
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">
            {isAr ? 'اربط حسابات التواصل الاجتماعي لتبدأ الأتمتة الذكية.' : 'Connect your social media accounts to start smart automation.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          const isConnected = channel.status === 'connected';

          return (
            <div 
              key={channel.key} 
              className={`relative flex flex-col group p-8 rounded-[2rem] border transition-all duration-300 bg-card shadow-xl shadow-gray-100/50 ${isConnected ? 'border-emerald-200 ring-4 ring-emerald-500/5' : 'hover:border-primary/40'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`size-14 rounded-2xl flex items-center justify-center ${channel.bg} ${channel.color} shadow-inner`}>
                  <Icon className="size-7" />
                </div>
                {isConnected ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {isAr ? 'متصل الآن' : 'CONNECTED'}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-[10px] font-extrabold uppercase tracking-wider">
                    {isAr ? 'غير مرتبط' : 'NOT CONNECTED'}
                  </span>
                )}
              </div>

              <div className={`flex-1 ${isAr ? 'text-start' : 'text-left'}`}>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  {channel.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {channel.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed">
                {isConnected ? (
                  <div className="flex items-center justify-between">
                    <DisconnectButton channelKey={channel.key} />
                    <Button variant="outline" size="sm" className="rounded-xl font-bold">
                      {isAr ? 'إعدادات' : 'Settings'}
                    </Button>
                  </div>
                ) : (
                  <a 
                    href={channel.key === 'whatsapp' ? '#' : '/api/auth/meta'} 
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 font-bold text-white transition-all hover:bg-primary/90 shadow-lg shadow-primary/20 active:scale-[0.98]"
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

      <div className={`rounded-[2rem] bg-amber-50/50 border border-amber-200/50 p-8 flex flex-col md:flex-row items-center gap-6 mt-4 ${isAr ? 'text-start' : 'text-left'}`}>
        <div className="size-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
          <Info className="size-8" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-amber-900 mb-1">
            {isAr ? 'تعليمات هامة قبل الربط' : 'Important Instructions'}
          </h3>
          <p className="text-sm text-amber-800/80 leading-relaxed max-w-3xl">
            {isAr 
              ? 'لضمان نجاح عملية الربط، تأكد من تحويل حسابك إلى **حساب أعمال (Business Account)** وربطه بصفحة فيسبوك نشطة. يساعدك ذلك في الحصول على أفضل أداء للردود الآلية والتحليلات.'
              : 'To ensure a successful connection, make sure your account is a **Business Account** and linked to an active Facebook Page. This helps you get the best performance for automated replies.'}
          </p>
        </div>
      </div>
    </div>
  );
}

