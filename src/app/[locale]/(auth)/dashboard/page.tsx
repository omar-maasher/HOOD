import { auth } from '@clerk/nextjs/server';
import { count, eq } from 'drizzle-orm';
import {
  Activity,
  Bot,
  Briefcase,
  Calendar,
  ChevronLeft,
  Instagram,
  Link as LinkIcon,
  MessageCircle,
  MessageSquare,
  Phone,
  Reply,
  ShoppingBag,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { db } from '@/libs/DB';
import { Link } from '@/libs/i18nNavigation';
import { aiSettingsSchema, bookingSchema, integrationSchema, leadSchema } from '@/models/Schema';

type ChannelKey = 'instagram' | 'messenger' | 'whatsapp';

const DashboardIndexPage = async () => {
  const t = await getTranslations('DashboardHome');
  const locale = await getLocale();
  const isAr = locale === 'ar';

  const { orgId } = await auth();

  let leadsCount = 0;
  let bookingsCount = 0;
  let isAiActive = false;
  let integrations: any[] = [];

  try {
    if (orgId) {
      const [leadsResult, bookingsResult, aiSettingsResult, integrationsResult] = await Promise.all([
        db.select({ count: count() }).from(leadSchema).where(eq(leadSchema.organizationId, orgId)),
        db.select({ count: count() }).from(bookingSchema).where(eq(bookingSchema.organizationId, orgId)),
        db.select().from(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, orgId)),
        db.query.integrationSchema.findMany({ where: eq(integrationSchema.organizationId, orgId) }),
      ]);

      leadsCount = leadsResult[0]?.count || 0;
      bookingsCount = bookingsResult[0]?.count || 0;
      integrations = integrationsResult || [];

      if (aiSettingsResult.length > 0 && aiSettingsResult[0]?.isActive === 'true') {
        isAiActive = true;
      }
    }
  } catch (error) {
    console.error('Dashboard DB error:', error);
  }

  const isMessengerConnected = integrations.some(i => i.type === 'messenger' && i.status === 'active');
  const isInstagramConnected = integrations.some(i => i.type === 'instagram' && i.status === 'active');
  const isWhatsappConnected = integrations.some(i => i.type === 'whatsapp' && i.status === 'active');

  const channels: Array<{
    key: ChannelKey;
    name: string;
    status: 'connected' | 'not_connected';
    icon: any;
    color: string;
    bg: string;
  }> = [
    { key: 'whatsapp', name: isAr ? 'واتساب' : 'WhatsApp', status: isWhatsappConnected ? 'connected' : 'not_connected', icon: Phone, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { key: 'instagram', name: isAr ? 'إنستجرام' : 'Instagram', status: isInstagramConnected ? 'connected' : 'not_connected', icon: Instagram, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { key: 'messenger', name: isAr ? 'ماسنجر' : 'Messenger', status: isMessengerConnected ? 'connected' : 'not_connected', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  ];

  const badge = (status: 'connected' | 'not_connected') => {
    const isConnected = status === 'connected';
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-sm ${isConnected ? 'bg-emerald-500 text-white' : 'bg-muted-foreground/10 text-muted-foreground'
      }`}
      >
        {isConnected ? t('channel_status_connected') : t('channel_status_not_connected')}
      </span>
    );
  };

  return (
    <div className={`relative mx-auto flex max-w-7xl flex-col gap-8 pb-20 ${isAr ? 'text-right' : 'text-left'}`}>

      {/* Background Decorative Blobs for the entire Dashboard */}
      <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} pointer-events-none -z-10 size-[600px] rounded-full bg-primary/5 blur-[120px]`}></div>
      <div className={`absolute top-40 ${isAr ? 'left-0' : 'right-0'} pointer-events-none -z-10 size-[400px] rounded-full bg-purple-500/5 blur-[100px]`}></div>

      {/* 1. Ultra Premium Welcome Header */}
      <div className="relative flex flex-col items-start justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 to-muted/30 p-10 shadow-2xl shadow-primary/5 backdrop-blur-xl dark:border-white/5 md:flex-row md:items-center">
        <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-50"></div>
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-1.5 text-xs font-black uppercase tracking-widest text-foreground shadow-sm">
            <Sparkles className="size-3.5 text-amber-500" />
            {isAr ? 'نظرة عامة على النشاط' : 'Activity Overview'}
          </div>
          <h1 className="mb-3 text-4xl font-black leading-tight tracking-tighter text-foreground md:text-5xl">
            {isAr ? 'مرحباً بك في' : 'Welcome to'}
            {' '}
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">{isAr ? 'مركز التحكم' : 'Control Center'}</span>
            {' '}
            ⚡
          </h1>
          <p className="max-w-xl text-lg font-medium text-muted-foreground">
            {isAr ? 'كل ما تحتاجه لإدارة المبيعات، المحادثات، وتدريب ذكائك الاصطناعي في واجهة واحدة أنيقة.' : 'Everything you need to manage sales, conversations, and AI training in one elegant interface.'}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
          <Link href="/dashboard/products" className="w-full md:w-auto">
            <Button variant="outline" className="h-14 w-full rounded-2xl border-border bg-background/50 px-6 font-black backdrop-blur transition-all hover:bg-muted">
              <ShoppingBag className={`size-5 ${isAr ? 'ml-2' : 'mr-2'} text-primary`} />
              {' '}
              {isAr ? 'إضافة منتج' : 'Add Product'}
            </Button>
          </Link>
          <Link href="/dashboard/ai-settings" className="w-full md:w-auto">
            <Button className="h-14 w-full rounded-2xl px-8 text-lg font-black shadow-xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              <Bot className={`size-5 ${isAr ? 'ml-2' : 'mr-2'}`} />
              {' '}
              {isAr ? 'إعداد البوت' : 'Bot Setup'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Glassmorphism Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: t('stat_messages'), count: 0, icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: null, href: null },
          { label: t('stat_replies'), count: 0, icon: Reply, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: null, href: null },
          { label: isAr ? 'العملاء المحتملين' : 'Leads', count: leadsCount, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: null, href: '/dashboard/leads' },
          { label: isAr ? 'المواعيد / الحجوزات' : 'Bookings', count: bookingsCount, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: null, href: '/dashboard/bookings' },
        ].map((metric) => {
          const CardContent = (
            <div className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-[2rem] border border-white/20 bg-card/60 p-6 shadow-lg shadow-gray-200/20 backdrop-blur-md transition-all hover:-translate-y-1 hover:shadow-xl dark:border-white/5 dark:shadow-none ${metric.href ? 'cursor-pointer hover:border-primary/40' : ''}`}>
              <metric.icon className={`absolute ${isAr ? '-right-4' : '-left-4'} -bottom-4 size-32 opacity-5 transition-opacity group-hover:opacity-10 ${metric.color} -rotate-12`} />

              <div className="relative z-10">
                <div className="mb-6 flex items-start justify-between">
                  <div className={`flex size-12 items-center justify-center rounded-2xl shadow-sm ${metric.bg} ${metric.color}`}>
                    <metric.icon className="size-6" />
                  </div>
                  {metric.trend && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400">{metric.trend}</span>
                  )}
                </div>
                <div>
                  <div className="mb-1 text-4xl font-black tracking-tight text-foreground">{metric.count}</div>
                  <div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            </div>
          );

          if (metric.href) {
            return (
              <Link key={metric.label} href={metric.href} className="block h-full">
                {CardContent}
              </Link>
            );
          }

          return <div key={metric.label} className="block h-full">{CardContent}</div>;
        })}
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* AI Control Center (Left/Large Col in LTR, Right/Large in RTL via flex/grid) */}
        <div className="relative flex flex-col justify-between overflow-hidden rounded-[2.5rem] border border-slate-800 bg-slate-900 p-10 shadow-2xl xl:col-span-2">
          <div className="pointer-events-none absolute inset-0 bg-[url('/img/noise.png')] opacity-20 mix-blend-overlay"></div>
          <div className={`absolute -top-[200px] ${isAr ? '-left-[200px]' : '-right-[200px]'} pointer-events-none size-[500px] rounded-full bg-primary/30 blur-[120px]`}></div>

          <div className="relative z-10">
            <div className="mb-10 flex items-start justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-black uppercase text-indigo-300">
                  <Activity className="size-3.5" />
                  {isAr ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}
                </div>
                <h2 className="mb-2 flex items-center gap-3 text-4xl font-black text-white">
                  <Bot className="size-10 text-primary" />
                  {' '}
                  Hood AI
                </h2>
                <p className="max-w-lg text-lg font-medium leading-relaxed text-slate-400">
                  {isAr ? 'روبوتك المخصص المتصل بعملك، مصمم ليقوم بالرد التلقائي وإغلاق الصفقات ببراعة.' : 'Your customized bot connected to your business, designed to auto-reply and close deals brilliantly.'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                {isAiActive
                  ? (
                      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/20 px-5 py-2 text-sm font-black uppercase tracking-widest text-emerald-400 shadow-lg shadow-emerald-500/10">
                        <div className="size-2.5 animate-pulse rounded-full bg-emerald-400"></div>
                        {' '}
                        {isAr ? 'روبوتك في الخدمة' : 'Bot Active'}
                      </div>
                    )
                  : (
                      <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/20 px-5 py-2 text-sm font-black uppercase tracking-widest text-rose-400 shadow-lg shadow-rose-500/10">
                        <div className="size-2.5 animate-pulse rounded-full bg-rose-500"></div>
                        {' '}
                        {isAr ? 'يرجى تفعيل الروبوت' : 'Please Activate Bot'}
                      </div>
                    )}
              </div>
            </div>

            <div className="mb-12 grid grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{isAr ? 'محادثات مدارة بالكامل' : 'Fully Managed Chats'}</div>
                <div className="text-4xl font-black text-white">0</div>
              </div>
              <div className="rounded-3xl border border-slate-700/50 bg-slate-800/40 p-6 backdrop-blur-md">
                <div className="mb-2 text-xs font-black uppercase tracking-wider text-slate-400">{isAr ? 'متوسط سرعة الرد' : 'Avg Reply Speed'}</div>
                <div className="text-4xl font-black text-white">0s</div>
              </div>
            </div>

            <Link href="/dashboard/ai-settings">
              <Button className={`flex h-16 w-full items-center gap-3 rounded-3xl px-10 text-lg font-black shadow-2xl transition-transform active:scale-95 sm:w-auto ${isAiActive ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-primary text-white hover:bg-primary/90'}`}>
                <Zap className={`size-5 ${isAiActive ? 'fill-amber-500 text-amber-500' : 'fill-amber-300 text-amber-300'}`} />
                {isAiActive ? (isAr ? 'لوحة تدريب البوت' : 'Bot Training Panel') : (isAr ? 'تفعيل الذكاء الاصطناعي الآن' : 'Enable AI Now')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Integrations (Right Col) */}
        <div className="flex flex-col rounded-[2.5rem] border border-white/20 bg-card/80 p-8 shadow-xl backdrop-blur-xl dark:border-white/5">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-black text-foreground">{isAr ? 'قنوات التواصل' : 'Communication Channels'}</h3>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{isAr ? 'حالة الربط مع المنصات الاجتماعية.' : 'Connection status with social platforms.'}</p>
            </div>
            <Link href="/dashboard/integrations">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
                <LinkIcon className="size-5" />
              </div>
            </Link>
          </div>

          <div className="flex-1 space-y-4">
            {channels.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.key} className="group flex items-center justify-between rounded-2xl border border-border bg-background p-4 transition-all hover:border-primary/30 hover:shadow-md">
                  <div className="flex items-center gap-4">
                    <div className={`flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${c.bg} ${c.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <span className="text-base font-black text-foreground">{c.name}</span>
                  </div>
                  {badge(c.status)}
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-border pt-6">
            <Link href="/dashboard/integrations">
              <Button variant="ghost" className="flex h-14 w-full items-center justify-between rounded-2xl border border-primary/10 bg-primary/5 px-6 font-black text-primary hover:bg-primary/5">
                <span>{isAr ? 'إدارة جميع القنوات' : 'Manage All Channels'}</span>
                <ChevronLeft className={`size-5 ${isAr ? '' : 'rotate-180'}`} />
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Quick Actions Launchpad */}
      <div className="rounded-[2.5rem] border border-white/20 bg-gradient-to-r from-card to-muted/30 p-8 shadow-lg dark:border-white/5">
        <h3 className="mb-6 flex items-center gap-3 text-xl font-black text-foreground">
          <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-500">
            <Briefcase className="size-5" />
          </div>
          {isAr ? 'انطلق بقوة: الخطوات الأساسية' : 'Launch Strong: Key Steps'}
        </h3>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: isAr ? 'بيانات النشاط' : 'Business Info', desc: isAr ? 'أضف تفاصيل عملك' : 'Add business details', href: '/dashboard/business', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: isAr ? 'ربط القنوات' : 'Connect Channels', desc: isAr ? 'واتساب، ماسنجر والمزيد' : 'WhatsApp, Messenger & more', href: '/dashboard/integrations', icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: isAr ? 'إضافة المنتجات' : 'Add Products', desc: isAr ? 'لتسهيل بيعها عبر البوت' : 'To sell easily via bot', href: '/dashboard/products', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            { label: isAr ? 'تفعيل الذكاء' : 'Activate AI', desc: isAr ? 'درب بعباراتك الخاصة' : 'Train with custom prompts', href: '/dashboard/ai-settings', icon: Bot, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((item, i) => (
            <Link key={item.label} href={item.href} className={`group relative flex items-center overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl ${isAr ? 'text-start' : 'text-left'}`}>
              <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} h-full w-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100`}></div>
              <div className="flex items-center gap-4">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-inner transition-transform group-hover:scale-110 ${item.bg} ${item.color}`}>
                  <item.icon className="size-6" />
                </div>
                <div>
                  <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    {isAr ? 'خطوة' : 'Step'}
                    {' '}
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </div>
                  <div className="text-base font-black leading-tight text-foreground transition-colors group-hover:text-primary">{item.label}</div>
                  <div className="mt-1 line-clamp-1 text-xs font-medium text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardIndexPage;
