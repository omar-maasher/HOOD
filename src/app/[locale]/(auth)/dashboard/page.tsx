import { 
  BarChart2, Bot, Briefcase, Calendar, 
  Instagram, Link as LinkIcon, MessageCircle, 
  MessageSquare, Phone, Reply, ShoppingBag, 
  Users, Sparkles, ArrowRight, ShieldCheck,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { db } from '@/libs/DB';
import { leadSchema, bookingSchema, aiSettingsSchema } from '@/models/Schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

type ChannelKey = 'instagram' | 'messenger' | 'whatsapp';

const DashboardIndexPage = async () => {
  const t = await getTranslations('DashboardHome');
  const { orgId } = await auth();

  let leadsCount = 0;
  let bookingsCount = 0;
  let isAiActive = false;
  try {
    if (orgId) {
      const leadsResult = await db.select({ count: count() }).from(leadSchema).where(eq(leadSchema.organizationId, orgId));
      leadsCount = leadsResult[0]?.count || 0;

      const bookingsResult = await db.select({ count: count() }).from(bookingSchema).where(eq(bookingSchema.organizationId, orgId));
      bookingsCount = bookingsResult[0]?.count || 0;

      const aiResult = await db.select().from(aiSettingsSchema).where(eq(aiSettingsSchema.organizationId, orgId));
      if (aiResult.length > 0 && aiResult[0]?.isActive === 'true') {
        isAiActive = true;
      }
    }
  } catch (error) {
    console.error('Dashboard DB error:', error);
  }

  const stats = [
    { label: t('stat_messages'), value: 0, icon: MessageCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('stat_replies'), value: 0, icon: Reply, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'العملاء المحتملين', value: leadsCount, icon: Users, href: '/dashboard/leads', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'المواعيد / الحجوزات', value: bookingsCount, icon: Calendar, href: '/dashboard/bookings', color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const channels: Array<{
    key: ChannelKey;
    name: string;
    status: 'connected' | 'not_connected';
    hint: string;
    icon: any;
    color: string;
  }> = [
    { key: 'instagram', name: 'Instagram', status: 'not_connected', hint: 'Auto-replies & DMs', icon: Instagram, color: 'text-pink-500' },
    { key: 'messenger', name: 'Messenger', status: 'not_connected', hint: 'Facebook Page', icon: MessageSquare, color: 'text-blue-500' },
    { key: 'whatsapp', name: 'WhatsApp', status: 'not_connected', hint: 'Business API', icon: Phone, color: 'text-emerald-500' },
  ];

  const quickActions = [
    { label: t('action_connect'), href: '/dashboard/integrations', icon: LinkIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('action_business'), href: '/dashboard/business', icon: Briefcase, color: 'text-slate-600', bg: 'bg-slate-50' },
    { label: t('action_products'), href: '/dashboard/products', icon: ShoppingBag, color: 'text-pink-600', bg: 'bg-pink-50' },
    { label: t('action_ai'), href: '/dashboard/ai-settings', icon: Bot, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: t('action_reports'), href: '/dashboard/reports', icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  const steps = [
    { title: t('setup_step1_title'), desc: t('setup_step1_desc'), href: '/dashboard/integrations', icon: LinkIcon },
    { title: t('setup_step2_title'), desc: t('setup_step2_desc'), href: '/dashboard/business', icon: Briefcase },
    { title: t('setup_step3_title'), desc: t('setup_step3_desc'), href: '/dashboard/products', icon: ShoppingBag },
    { title: t('setup_step4_title'), desc: t('setup_step4_desc'), href: '/dashboard/ai-settings', icon: Bot },
  ];

  const badge = (status: 'connected' | 'not_connected') => {
    const isConnected = status === 'connected';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${
        isConnected ? 'bg-emerald-100/80 text-emerald-700 ring-1 ring-emerald-200' : 'bg-gray-100 text-gray-500 ring-1 ring-gray-200'
      }`}>
        <span className={`size-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
        {isConnected ? t('channel_status_connected') : t('channel_status_not_connected')}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-10 max-w-7xl mx-auto pb-20">
      {/* Premium Hero Section */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-indigo-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 bg-card border border-white/40 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 backdrop-blur-sm overflow-hidden">
          <div className="absolute top-0 right-0 p-8 text-primary/5 -translate-y-4 translate-x-4">
            <LayoutDashboard size={200} strokeWidth={1} />
          </div>
          
          <div className="relative z-10 text-center md:text-start max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-sm font-black uppercase mb-4 tracking-widest">
              <Sparkles className="size-4" />
              أهلاً بك في المستقبل
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 mb-3 leading-tight">
              {t('title')}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
              {t('subtitle')}
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <Link href="/dashboard/integrations">
                <Button className="h-14 px-8 rounded-2xl text-lg font-black gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  <LinkIcon className="size-5" />
                  {t('action_connect')}
                </Button>
              </Link>
              <Link href="/dashboard/ai-settings">
                <Button variant="outline" className="h-14 px-8 rounded-2xl text-lg font-black gap-2 bg-white/50 backdrop-blur hover:bg-white hover:scale-[1.02] active:scale-95 transition-all">
                  <Bot className="size-5" />
                  {t('action_ai')}
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
            {quickActions.slice(0, 4).map((action) => {
              const Icon = action.icon;
              return (
                <Link key={action.href} href={action.href} className="group/item relative h-32 w-full md:w-36 bg-white/40 hover:bg-white border border-white/60 p-4 rounded-2xl shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center">
                  <div className={`p-2.5 rounded-xl ${action.bg} ${action.color} mb-3 inline-block w-fit transition-transform group-hover/item:scale-110`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="text-sm font-black text-gray-800">{action.label}</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const content = (
            <div className="group relative flex flex-col justify-between h-52 bg-card border border-white/60 p-8 rounded-[2rem] shadow-xl shadow-gray-100/50 transition-all hover:-translate-y-2 hover:shadow-2xl hover:border-primary/20 overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] -translate-y-4 translate-x-4">
                <Icon size={140} strokeWidth={1} />
              </div>
              <div className="flex items-center justify-between z-10">
                <div className={`p-3.5 rounded-2xl ${s.bg} ${s.color} transition-transform group-hover:rotate-6 shadow-sm`}>
                  <Icon className="size-7" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="text-5xl font-black tracking-tighter text-gray-900">{s.value}</div>
                  <div className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground/70 mt-1">{s.label}</div>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-8 z-10">
                <div className={`h-full ${s.bg.replace('bg-', 'bg-').split('-')[0]}-${s.color.split('-')[1]} transition-all duration-1000 w-[15%] group-hover:w-full opacity-30`}></div>
              </div>
            </div>
          );

          return s.href ? (
            <Link key={s.label} href={s.href} className="block transition-all">
              {content}
            </Link>
          ) : (
            <div key={s.label}>
              {content}
            </div>
          );
        })}
      </div>

      {/* Main Content Areas */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Onboarding Steps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <ShieldCheck className="text-primary size-7" />
              {t('setup_title')}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link key={s.href} href={s.href} className="group flex items-center p-6 bg-card border border-white/60 rounded-[2rem] shadow-lg shadow-gray-100/40 transition-all hover:bg-white hover:border-primary/20">
                  <div className="flex items-center gap-6 text-start">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-muted/30 text-muted-foreground transition-all group-hover:bg-primary group-hover:text-white group-hover:rotate-3 shadow-inner">
                      <Icon className="size-7" />
                    </div>
                    <div>
                      <div className="text-sm font-black uppercase tracking-tighter text-muted-foreground/60 mb-1">خطوة 0{i+1}</div>
                      <div className="text-lg font-black text-gray-900 group-hover:text-primary transition-colors">{s.title}</div>
                      <p className="text-sm text-muted-foreground font-medium mt-1.5 leading-relaxed line-clamp-2">{s.desc}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* AI Overview Box */}
        <div className="bg-gradient-to-br from-primary via-indigo-600 to-primary p-1 rounded-[2.5rem] shadow-2xl shadow-primary/20">
          <div className="h-full bg-white/95 backdrop-blur-sm rounded-[2.3rem] p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="p-3 bg-primary/10 rounded-2xl text-primary inline-block">
                  <Bot className="size-7" />
                </span>
                {isAiActive ? (
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    نشط الآن
                  </span>
                ) : (
                  <span className="text-xs font-black uppercase tracking-widest text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-gray-400" />
                    غير نشط
                  </span>
                )}
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{t('ai_box_title')}</h3>
              <p className="text-base text-muted-foreground font-medium leading-relaxed mb-6 italic">{t('ai_box_desc')}</p>
              
              <div className="space-y-4">
                <div className="group/item flex items-center justify-between p-5 rounded-2xl bg-muted/20 border-white hover:bg-white hover:shadow-lg transition-all border">
                  <div className="flex items-center gap-3">
                    <MessageCircle className="size-5 text-primary" />
                    <span className="text-sm font-extrabold text-gray-700">وضع الرد الذكي</span>
                  </div>
                  <div className={`size-2.5 rounded-full ${isAiActive ? 'bg-primary animate-pulse' : 'bg-gray-300'}`}></div>
                </div>
                <div className="group/item flex items-center justify-between p-5 rounded-2xl bg-muted/20 border-white hover:bg-white hover:shadow-lg transition-all border">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="size-5 text-emerald-500" />
                    <span className="text-sm font-extrabold text-gray-700">سياسات العمل</span>
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover/item:translate-x-[-4px] transition-transform" />
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/ai-settings" className="mt-8">
              <Button className="w-full h-16 rounded-2xl bg-black text-white font-black text-lg shadow-xl hover:bg-gray-800 transition-all active:scale-95">
                {t('ai_box_button')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Connectivity Status with Modern Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-card border border-white/60 p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50">
          <div className="flex items-center justify-between mb-10">
            <div className="text-start">
              <h2 className="text-3xl font-black text-gray-900">{t('channels_title')}</h2>
              <p className="text-sm mt-1 text-muted-foreground font-medium">حالة الربط مع منصات التواصل الاجتماعي المختلفة.</p>
            </div>
            <Link href="/dashboard/integrations">
              <Button variant="ghost" className="text-primary font-black gap-2 hover:bg-primary/5 rounded-2xl text-base px-6 h-12">
                {t('action_connect')}
                <ArrowRight className="size-5 rotate-180" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {channels.map((c) => {
              const connected = c.status === 'connected';
              const Icon = c.icon;
              return (
                <div key={c.key} className="relative group/chan flex flex-col p-6 rounded-[2rem] bg-muted/10 border border-white hover:bg-white hover:shadow-xl transition-all h-full">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-2xl bg-white shadow-sm ${c.color} group-hover/chan:scale-110 transition-transform`}>
                      <Icon className="size-7" />
                    </div>
                    {badge(c.status)}
                  </div>
                  <div className="text-start mb-8">
                    <div className="text-xl font-black text-gray-900">{c.name}</div>
                    <div className="text-sm text-muted-foreground font-medium mt-1.5">{c.hint}</div>
                  </div>
                  <Link href="/dashboard/integrations" className="mt-auto">
                    <Button variant={connected ? 'outline' : 'default'} className={`w-full h-12 rounded-2xl font-black text-sm ${!connected && 'shadow-lg shadow-black/10'}`}>
                      {connected ? t('channel_manage') : t('channel_connect')}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tip/Logs Box */}
        <div className="flex flex-col gap-6">
          <div className="bg-white border border-white/60 p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 flex-1">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Briefcase className="size-6 text-indigo-500" />
              أحدث التنبيهات
            </h2>
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-start">
                <div className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2">
                  <Bot size={16} />
                  نصيحة تقنية
                </div>
                <p className="text-sm text-indigo-700/80 font-medium leading-relaxed italic">
                  تأكد من تحديد قواعد تصعيد واضحة للبوت لضمان عدم فقدان أي فرصة بيع تحتاج تدخل بشري.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center min-h-[120px] text-center">
                 <p className="text-sm text-muted-foreground font-black uppercase tracking-widest leading-relaxed">{t('logs_empty')}</p>
              </div>
            </div>
            
            <Link href="/dashboard/reports" className="mt-8 block">
              <Button variant="outline" className="w-full h-14 rounded-2xl text-base font-black border-dashed border-gray-300 hover:border-primary hover:bg-primary/5">
                تصفح التقارير التفصيلية
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIndexPage;

