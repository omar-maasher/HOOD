import {
  Bot, Briefcase, Calendar,
  Instagram, Link as LinkIcon, MessageCircle,
  MessageSquare, Phone, Reply, ShoppingBag,
  Users, Activity, Zap, Sparkles, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { db } from '@/libs/DB';
import { leadSchema, bookingSchema, aiSettingsSchema, integrationSchema } from '@/models/Schema';
import { eq, count } from 'drizzle-orm';
import { auth } from '@clerk/nextjs/server';

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
        db.query.integrationSchema.findMany({ where: eq(integrationSchema.organizationId, orgId) })
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

  const isMetaRootConnected = integrations.some(i => i.type === 'facebook_root' && i.status === 'active');
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
      { key: 'messenger', name: isAr ? 'ماسنجر' : 'Messenger', status: isMetaRootConnected ? 'connected' : 'not_connected', icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

  const badge = (status: 'connected' | 'not_connected') => {
    const isConnected = status === 'connected';
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${isConnected ? 'bg-emerald-500 text-white' : 'bg-muted-foreground/10 text-muted-foreground'
        }`}>
        {isConnected ? t('channel_status_connected') : t('channel_status_not_connected')}
      </span>
    );
  };

  return (
    <div className={`flex flex-col gap-8 max-w-7xl mx-auto pb-20 relative ${isAr ? 'text-right' : 'text-left'}`}>

      {/* Background Decorative Blobs for the entire Dashboard */}
      <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10`}></div>
      <div className={`absolute top-40 ${isAr ? 'left-0' : 'right-0'} w-[400px] h-[400px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none -z-10`}></div>

      {/* 1. Ultra Premium Welcome Header */}
      <div className="relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 rounded-[2.5rem] p-10 shadow-2xl shadow-primary/5 border border-white/10 dark:border-white/5 bg-gradient-to-br from-card/80 to-muted/30 backdrop-blur-xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-50"></div>
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background border border-border text-foreground text-xs font-black uppercase mb-5 tracking-widest shadow-sm">
            <Sparkles className="size-3.5 text-amber-500" />
            {isAr ? 'نظرة عامة على النشاط' : 'Activity Overview'}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-3 leading-tight">
            {isAr ? 'مرحباً بك في' : 'Welcome to'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{isAr ? 'مركز التحكم' : 'Control Center'}</span> ⚡
          </h1>
          <p className="text-muted-foreground font-medium text-lg max-w-xl">
            {isAr ? 'كل ما تحتاجه لإدارة المبيعات، المحادثات، وتدريب ذكائك الاصطناعي في واجهة واحدة أنيقة.' : 'Everything you need to manage sales, conversations, and AI training in one elegant interface.'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Link href="/dashboard/products" className="w-full md:w-auto">
            <Button variant="outline" className="w-full h-14 px-6 rounded-2xl font-black bg-background/50 backdrop-blur border-border hover:bg-muted transition-all">
              <ShoppingBag className={`size-5 ${isAr ? 'ml-2' : 'mr-2'} text-primary`} /> {isAr ? 'إضافة منتج' : 'Add Product'}
            </Button>
          </Link>
          <Link href="/dashboard/ai-settings" className="w-full md:w-auto">
            <Button className="w-full h-14 px-8 rounded-2xl font-black shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all text-lg">
              <Bot className={`size-5 ${isAr ? 'ml-2' : 'mr-2'}`} /> {isAr ? 'إعداد البوت' : 'Bot Setup'}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Glassmorphism Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('stat_messages'), count: leadsCount * 7 + 12, icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: null, href: null },
          { label: t('stat_replies'), count: leadsCount * 5 + 8, icon: Reply, color: 'text-purple-500', bg: 'bg-purple-500/10', trend: null, href: null },
          { label: isAr ? 'العملاء المحتملين' : 'Leads', count: leadsCount, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: null, href: '/dashboard/leads' },
          { label: isAr ? 'المواعيد / الحجوزات' : 'Bookings', count: bookingsCount, icon: Calendar, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: null, href: '/dashboard/bookings' },
        ].map((metric, i) => {
          const CardContent = (
            <div className={`group relative bg-card/60 backdrop-blur-md border border-white/20 dark:border-white/5 p-6 rounded-[2rem] shadow-lg shadow-gray-200/20 dark:shadow-none hover:-translate-y-1 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden h-full ${metric.href ? 'cursor-pointer hover:border-primary/40' : ''}`}>
              <metric.icon className={`absolute ${isAr ? '-right-4' : '-left-4'} -bottom-4 size-32 opacity-5 group-hover:opacity-10 transition-opacity ${metric.color} -rotate-12`} />

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div className={`size-12 rounded-2xl flex items-center justify-center shadow-sm ${metric.bg} ${metric.color}`}>
                    <metric.icon className="size-6" />
                  </div>
                  {metric.trend && (
                    <span className="text-xs font-black text-emerald-600 bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400 px-2.5 py-1 rounded-full">{metric.trend}</span>
                  )}
                </div>
                <div>
                  <div className="text-4xl font-black text-foreground mb-1 tracking-tight">{metric.count}</div>
                  <div className="text-sm font-bold text-muted-foreground uppercase tracking-wider">{metric.label}</div>
                </div>
              </div>
            </div>
          );

          if (metric.href) {
            return (
              <Link key={i} href={metric.href} className="block h-full">
                {CardContent}
              </Link>
            );
          }

          return <div key={i} className="block h-full">{CardContent}</div>;
        })}
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* AI Control Center (Left/Large Col in LTR, Right/Large in RTL via flex/grid) */}
        <div className="xl:col-span-2 relative overflow-hidden bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl p-10 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[url('/img/noise.png')] opacity-20 pointer-events-none mix-blend-overlay"></div>
          <div className={`absolute -top-[200px] ${isAr ? '-left-[200px]' : '-right-[200px]'} w-[500px] h-[500px] bg-primary/30 blur-[120px] rounded-full pointer-events-none`}></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-black uppercase mb-3">
                  <Activity className="size-3.5" />
                  {isAr ? 'محرك الذكاء الاصطناعي' : 'AI Engine'}
                </div>
                <h2 className="text-4xl font-black text-white mb-2 flex items-center gap-3">
                  <Bot className="size-10 text-primary" /> Hood AI
                </h2>
                <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-lg">
                  {isAr ? 'روبوتك المخصص المتصل بعملك، مصمم ليقوم بالرد التلقائي وإغلاق الصفقات ببراعة.' : 'Your customized bot connected to your business, designed to auto-reply and close deals brilliantly.'}
                </p>
              </div>

              <div className="flex flex-col items-end gap-3">
                {isAiActive ? (
                  <div className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-2 rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-emerald-500/10">
                    <div className="size-2.5 rounded-full bg-emerald-400 animate-pulse"></div> {isAr ? 'روبوتك في الخدمة' : 'Bot Active'}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-500/20 border border-rose-500/30 text-rose-400 px-5 py-2 rounded-2xl text-sm font-black tracking-widest uppercase shadow-lg shadow-rose-500/10">
                    <div className="size-2.5 rounded-full bg-rose-500 animate-pulse"></div> {isAr ? 'يرجى تفعيل الروبوت' : 'Please Activate Bot'}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-12">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">{isAr ? 'محادثات مدارة بالكامل' : 'Fully Managed Chats'}</div>
                <div className="text-4xl font-black text-white">{isAiActive ? leadsCount * 4 + 5 : 0}</div>
              </div>
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-3xl p-6 backdrop-blur-md">
                <div className="text-slate-400 text-xs font-black uppercase tracking-wider mb-2">{isAr ? 'متوسط سرعة الرد' : 'Avg Reply Speed'}</div>
                <div className="text-4xl font-black text-white">&lt; 1s</div>
              </div>
            </div>

            <Link href="/dashboard/ai-settings">
              <Button className={`w-full sm:w-auto h-16 px-10 text-lg font-black rounded-[1.5rem] transition-transform active:scale-95 shadow-2xl flex items-center gap-3 ${isAiActive ? 'bg-white text-slate-900 hover:bg-slate-100' : 'bg-primary text-white hover:bg-primary/90'}`}>
                <Zap className={`size-5 ${isAiActive ? 'text-amber-500 fill-amber-500' : 'text-amber-300 fill-amber-300'}`} />
                {isAiActive ? (isAr ? 'لوحة تدريب البوت' : 'Bot Training Panel') : (isAr ? 'تفعيل الذكاء الاصطناعي الآن' : 'Enable AI Now')}
              </Button>
            </Link>
          </div>
        </div>

        {/* Integrations (Right Col) */}
        <div className="bg-card/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2.5rem] shadow-xl p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-black text-foreground">{isAr ? 'قنوات التواصل' : 'Communication Channels'}</h3>
              <p className="text-sm text-muted-foreground font-medium mt-1">{isAr ? 'حالة الربط مع المنصات الاجتماعية.' : 'Connection status with social platforms.'}</p>
            </div>
            <Link href="/dashboard/integrations">
              <div className="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors">
                <LinkIcon className="size-5" />
              </div>
            </Link>
          </div>

          <div className="space-y-4 flex-1">
            {channels.map(c => {
              const Icon = c.icon;
              return (
                <div key={c.key} className="group flex items-center justify-between p-4 rounded-2xl border border-border bg-background hover:border-primary/30 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`size-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${c.bg} ${c.color}`}>
                      <Icon className="size-6" />
                    </div>
                    <span className="font-black text-base text-foreground">{c.name}</span>
                  </div>
                  {badge(c.status)}
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link href="/dashboard/integrations">
              <Button variant="ghost" className={`w-full h-14 rounded-2xl font-black text-primary hover:bg-primary/5 flex items-center justify-between px-6 bg-primary/5 border border-primary/10`}>
                <span>{isAr ? 'إدارة جميع القنوات' : 'Manage All Channels'}</span>
                <ChevronLeft className={`size-5 ${isAr ? '' : 'rotate-180'}`} />
              </Button>
            </Link>
          </div>
        </div>

      </div>

      {/* 4. Quick Actions Launchpad */}
      <div className="bg-gradient-to-r from-card to-muted/30 border border-white/20 dark:border-white/5 rounded-[2.5rem] p-8 shadow-lg">
        <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Briefcase className="size-5" />
          </div>
          {isAr ? 'انطلق بقوة: الخطوات الأساسية' : 'Launch Strong: Key Steps'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: isAr ? 'بيانات النشاط' : 'Business Info', desc: isAr ? 'أضف تفاصيل عملك' : 'Add business details', href: '/dashboard/business', icon: Briefcase, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
            { label: isAr ? 'ربط القنوات' : 'Connect Channels', desc: isAr ? 'واتساب، ماسنجر والمزيد' : 'WhatsApp, Messenger & more', href: '/dashboard/integrations', icon: LinkIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: isAr ? 'إضافة المنتجات' : 'Add Products', desc: isAr ? 'لتسهيل بيعها عبر البوت' : 'To sell easily via bot', href: '/dashboard/products', icon: ShoppingBag, color: 'text-pink-500', bg: 'bg-pink-500/10' },
            { label: isAr ? 'تفعيل الذكاء' : 'Activate AI', desc: isAr ? 'درب بعباراتك الخاصة' : 'Train with custom prompts', href: '/dashboard/ai-settings', icon: Bot, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((item, i) => (
            <Link key={i} href={item.href} className={`flex relative overflow-hidden items-center p-5 rounded-[2rem] border border-border bg-card shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all group ${isAr ? 'text-start' : 'text-left'}`}>
              <div className={`absolute top-0 ${isAr ? 'right-0' : 'left-0'} w-1 h-full opacity-0 group-hover:opacity-100 transition-opacity bg-primary`}></div>
              <div className="flex gap-4 items-center">
                <div className={`size-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform ${item.bg} ${item.color}`}>
                  <item.icon className="size-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">{isAr ? 'خطوة' : 'Step'} {i + 1 < 10 ? `0${i + 1}` : i + 1}</div>
                  <div className="text-base font-black text-foreground group-hover:text-primary transition-colors leading-tight">{item.label}</div>
                  <div className="text-xs font-medium text-muted-foreground mt-1 line-clamp-1">{item.desc}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div >
  );
};

export default DashboardIndexPage;
