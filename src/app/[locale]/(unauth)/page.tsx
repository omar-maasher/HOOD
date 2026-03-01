import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Globe2,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Link } from '@/libs/i18nNavigation';
import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
  return {
    title: 'Hood Trading | مستقبل الأتمتة',
    description: 'روبوتات ذكية مصممة خصيصًا لتطوير البيزنس الخاص بك ورفع مبيعاتك',
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);
  const t = useTranslations('Landing');
  const isAr = props.params.locale === 'ar';

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground selection:bg-primary/20" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero Section - Radical New Layout (Split Design) */}
      <section className="relative overflow-hidden pb-20 pt-32 lg:pb-32 lg:pt-48">
        {/* Glow Effects */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 size-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 opacity-50 blur-[120px]"></div>
        <div className="pointer-events-none absolute right-0 top-0 size-[500px] rounded-full bg-purple-500/10 opacity-50 blur-[100px]"></div>

        <div className="container relative z-10 mx-auto px-4 lg:max-w-7xl">
          <div className="flex flex-col items-center gap-16 lg:flex-row">

            {/* Left/Right Text Content */}
            <div className="flex-1 text-center lg:text-start">
              <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-primary">
                <Sparkles className="size-4" />
                {isAr ? 'الإصدار الجديد كلياً' : 'The All-New Release'}
              </div>

              <h1 className="mb-6 animate-fade-in-up text-5xl font-black leading-[1.1] tracking-tighter lg:text-7xl" style={{ animationDelay: '100ms' }}>
                <span className="block text-foreground">{t('Hero.title1')}</span>
                <span className="mt-2 block bg-gradient-to-r from-primary to-purple-600 bg-clip-text pb-2 text-transparent">
                  {t('Hero.title2')}
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-xl animate-fade-in-up text-xl font-medium text-muted-foreground lg:mx-0" style={{ animationDelay: '200ms' }}>
                {t('Hero.desc')}
              </p>

              <div className="flex animate-fade-in-up flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start" style={{ animationDelay: '300ms' }}>
                <Link href="#pricing">
                  <Button size="lg" className="h-16 gap-3 rounded-2xl px-10 text-xl font-black shadow-xl shadow-primary/25 transition-all hover:scale-105">
                    {t('Hero.cta')}
                    <ArrowRight className={`size-6 ${isAr ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
                <Link href="#formula">
                  <Button variant="outline" size="lg" className="h-16 gap-3 rounded-2xl border-border bg-background/50 px-10 text-xl font-black backdrop-blur transition-all hover:bg-muted">
                    {isAr ? 'اكتشف النظام' : 'Discover the System'}
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex animate-fade-in-up items-center justify-center gap-3 text-sm font-bold text-muted-foreground lg:justify-start" style={{ animationDelay: '400ms' }}>
                <div className="rounded-full bg-emerald-500/10 p-2">
                  <ShieldCheck className="size-4 text-emerald-500" />
                </div>
                <span>
                  🔒
                  {' '}
                  {isAr ? 'لم تحقق تحسن ملحوظ خلال أول 30 يوم؟' : 'Didn\'t see noticeable improvement within the first 30 days?'}
                  {' '}
                  <span className="text-foreground">{isAr ? 'سنعيد لك كامل المبلغ.' : 'We\'ll refund your money in full.'}</span>
                </span>
              </div>
            </div>

            {/* Visual/Image Representation */}
            <div className="w-full flex-1 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="relative mx-auto aspect-square w-full max-w-[600px]">
                <div className="absolute inset-0 rotate-3 scale-105 rounded-[3rem] bg-gradient-to-tr from-primary/20 to-purple-500/20"></div>
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[3rem] border border-border bg-card shadow-2xl">
                  {/* Mockup Header */}
                  <div className="flex h-14 items-center gap-3 border-b border-border bg-muted/50 px-6">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-400"></div>
                      <div className="size-3 rounded-full bg-amber-400"></div>
                      <div className="size-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="mx-auto rounded-md bg-background px-6 py-1.5 text-xs font-bold text-muted-foreground shadow-sm">
                      hoodtrading.com
                    </div>
                  </div>
                  {/* Mockup Body */}
                  <div className="relative flex flex-1 flex-col justify-center p-8">
                    <div className="absolute right-8 top-8 max-w-[80%] animate-fade-in-up rounded-3xl rounded-tr-sm bg-primary p-4 text-sm font-bold text-primary-foreground shadow-xl">
                      {isAr ? 'أهلاً بك في متجرنا! 👋 كيف أقدر أساعدك اليوم؟' : 'Welcome to our store! 👋 How can I help you today?'}
                    </div>
                    <div className="absolute left-8 top-32 max-w-[80%] animate-fade-in-up rounded-3xl rounded-tl-sm border border-border bg-muted p-4 text-sm font-bold text-foreground shadow-md" style={{ animationDelay: '500ms' }}>
                      {isAr ? 'هل يتوفر عندكم حذاء الركض الرياضي مقاس 42 باللون الأسود؟' : 'Do you have the running shoes size 42 in black?'}
                    </div>
                    <div className="absolute right-8 top-56 max-w-[80%] animate-fade-in-up rounded-3xl rounded-tr-sm bg-primary p-4 text-sm font-bold text-primary-foreground shadow-xl" style={{ animationDelay: '1000ms' }}>
                      {isAr ? 'نعم متوفر! 👟 وتقدر تطلبه مباشرة ويصلك خلال 24 ساعة. هل أضيفه لسلتك؟' : 'Yes, it is available! 👟 You can order it directly and it will reach you within 24 hours. Should I add it to your cart?'}
                    </div>

                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-4">
                      <div className="flex animate-bounce items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-xl" style={{ animationDuration: '3s' }}>
                        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                          <TrendingUp className="size-5" />
                        </div>
                        <div className="text-start">
                          <div className="text-xs font-bold text-muted-foreground">{isAr ? '+45% مبيعات' : '+45% Sales'}</div>
                          <div className="text-sm font-black">{isAr ? 'هذا الأسبوع' : 'This Week'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bento Grid Features Section */}
      <section className="border-y border-border bg-muted/30 py-24" id="features">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black md:text-5xl">{isAr ? 'كل ما تحتاجه في مكان واحد' : 'Everything you need in one place'}</h2>
            <p className="mx-auto max-w-2xl text-xl font-medium text-muted-foreground">
              {isAr ? 'أدوات مصممة بعناية فائقة لتأخذ تجارتك إلى المستوى التالي.' : 'Carefully crafted tools to take your business to the next level.'}
            </p>
          </div>

          <div className="grid auto-rows-[300px] grid-cols-1 gap-6 md:grid-cols-3">
            {/* Box 1 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-md transition-all hover:shadow-xl md:col-span-2">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
              <div className="relative z-10">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                  <Bot className="size-7" />
                </div>
                <h3 className="mb-3 text-2xl font-black text-foreground">{t('Features.title')}</h3>
                <p className="max-w-md text-lg font-medium leading-relaxed text-muted-foreground">{t('Features.desc')}</p>
              </div>
              <div className="absolute bottom-0 left-0 p-8 opacity-20 transition-opacity group-hover:opacity-40">
                <Bot className="size-40 text-primary" />
              </div>
            </div>

            {/* Box 2 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 shadow-md transition-all hover:shadow-xl">
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Clock className="size-7" />
                </div>
                <h3 className="mb-3 mt-auto text-2xl font-black text-foreground">{isAr ? 'دعم 24/7' : '24/7 Support'}</h3>
                <p className="font-medium text-muted-foreground">{isAr ? 'روبوتات لا تنام، تخدم عملائك بأي وقت.' : 'Bots that never sleep, serving your customers anytime.'}</p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="group rounded-[2.5rem] border border-border bg-card p-10 shadow-md transition-all hover:shadow-xl">
              <div className="flex h-full flex-col">
                <div className="mb-6 flex size-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
                  <TrendingUp className="size-7" />
                </div>
                <h3 className="mb-3 mt-auto text-2xl font-black text-foreground">{isAr ? 'زيادة التحويلات' : 'Increase Conversions'}</h3>
                <p className="font-medium text-muted-foreground">{isAr ? 'تحويل الزوار إلى مشترين بسرعة.' : 'Turn visitors into buyers quickly.'}</p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-800 bg-gradient-to-r from-slate-900 to-indigo-950 p-10 text-white shadow-xl transition-all md:col-span-2">
              <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-primary/20 to-transparent"></div>
              <div className="relative z-10 flex h-full flex-col justify-center">
                <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                  <Globe2 className="size-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">{isAr ? 'ارتباط عالمي' : 'Global Connection'}</span>
                </div>
                <h3 className="mb-3 text-3xl font-black">{isAr ? 'ربط مع كافة المنصات' : 'Connect with all platforms'}</h3>
                <p className="max-w-md text-lg font-medium text-slate-300">{isAr ? 'أدر محادثاتك من انستجرام، واتساب، وماسنجر من مكان واحد بنظام متكامل لإدارة علاقات العملاء.' : 'Manage your conversations from Instagram, WhatsApp, and Messenger from one integrated CRM system.'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hood Trading System Section */}
      <section className="relative overflow-hidden bg-background py-32" id="formula">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl">
              {isAr ? 'ما هو نظام' : 'What is the'}
              {' '}
              <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Hood Trading</span>
              {' '}
              {isAr ? 'وما الذي يجعله النظام الأمثل لتطوير أي بيزنس؟' : 'system and what makes it the ideal system to develop any business?'}
            </h2>
            <p className="mx-auto max-w-3xl text-xl font-medium leading-relaxed text-muted-foreground">
              {t('Features.desc')}
            </p>
            <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 rounded-3xl border border-border bg-muted/50 px-6 py-4 text-lg font-black text-foreground shadow-sm md:text-2xl">
              <span className="text-blue-500">{t('Features.cs')}</span>
              <span className="text-muted-foreground">+</span>
              <span className="text-purple-500">{t('Features.lead')}</span>
              <span className="text-muted-foreground">+</span>
              <span className="text-emerald-500">{t('Features.booking')}</span>
            </div>
          </div>

          <div className="space-y-12">
            {[
              {
                title: t('Details.s1_title'),
                desc: t('Details.s1_l1'),
                example: t('Details.s1_ex_desc'),
                icon: MessageCircle,
                color: 'text-blue-500',
                bg: 'bg-blue-500/10',
                exampleBadge: isAr ? 'للشركات والمتاجر' : 'For Companies & Stores',
              },
              {
                title: t('Details.s2_title'),
                desc: t('Details.s2_l1'),
                example: t('Details.s2_ex_desc'),
                icon: Users,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
                exampleBadge: isAr ? 'للمتاجر الإلكترونية' : 'For E-commerce Stores',
              },
              {
                title: t('Details.s3_title'),
                desc: t('Details.s3_l1'),
                example: t('Details.s3_ex_desc'),
                icon: Calendar,
                color: 'text-emerald-500',
                bg: 'bg-emerald-500/10',
                exampleBadge: isAr ? 'للعيادات والمكاتب' : 'For Clinics & Offices',
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col items-center gap-8 rounded-[3rem] border border-border bg-card p-8 shadow-lg transition-all hover:shadow-xl md:flex-row md:p-12">
                <div className={`flex size-24 shrink-0 items-center justify-center rounded-3xl ${feature.bg}`}>
                  <feature.icon className={`size-12 ${feature.color}`} />
                </div>
                <div className="w-full flex-1">
                  <h3 className="mb-4 text-3xl font-black text-foreground">{feature.title}</h3>
                  <p className="mb-6 text-xl font-medium leading-relaxed text-muted-foreground">{feature.desc}</p>

                  {feature.example && (
                    <div className="relative rounded-2xl border border-border/50 bg-muted/30 p-5">
                      <span className={`absolute -top-3 right-5 rounded-full px-3 py-1 text-[10px] font-black uppercase text-white ${feature.color.replace('text-', 'bg-')}`}>
                        {feature.exampleBadge}
                      </span>
                      <p className="mt-1 text-sm font-bold leading-relaxed text-foreground/80">
                        {feature.example}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="border-y border-border bg-muted/20 py-24">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-black md:text-5xl">{t('Audience.title')}</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:gap-12">
            <div className="rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 p-8 shadow-sm md:p-10">
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-black text-emerald-600">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/20">
                  <CheckCircle2 className="size-6" />
                </div>
                {t('Audience.pro_title')}
              </h3>
              <ul className="space-y-6">
                {[
                  t('Audience.pro_l1'),
                  t('Audience.pro_l2'),
                  t('Audience.pro_l3'),
                  t('Audience.pro_l4'),
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 font-bold leading-relaxed text-foreground">
                    <div className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs text-white shadow-md">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2.5rem] border border-rose-500/20 bg-rose-500/5 p-8 shadow-sm md:p-10">
              <h3 className="mb-8 flex items-center gap-3 text-2xl font-black text-rose-600">
                <div className="flex size-10 items-center justify-center rounded-full bg-rose-500/20">
                  <span className="mb-1 pb-1 text-2xl font-black">×</span>
                </div>
                {t('Audience.con_title')}
              </h3>
              <ul className="space-y-6">
                {[
                  t('Audience.con_l1'),
                  t('Audience.con_l2'),
                  t('Audience.con_l3'),
                  t('Audience.con_l4'),
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 font-bold leading-relaxed text-foreground">
                    <span className="mt-2 shrink-0 text-rose-500"><Bot className="size-5" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Streamlined */}
      <section className="relative bg-slate-900 py-32 text-white" id="pricing">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%__0%,rgba(99,102,241,0.15),transparent_70%)]"></div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-4xl font-black text-white md:text-5xl">{t('Pricing.title')}</h2>
            <p className="mx-auto max-w-2xl text-xl font-medium text-slate-400">{t('Pricing.desc')}</p>
          </div>

          <div className="grid items-center gap-8 md:grid-cols-3">
            {/* Starter */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all hover:bg-white/10">
              <h3 className="mb-2 text-2xl font-black">{t('Pricing.p1_title')}</h3>
              <p className="mb-8 text-sm font-medium text-slate-400">{t('Pricing.p1_desc')}</p>
              <div className="mb-10 w-full border-b border-white/10 pb-10 text-5xl font-black text-white">
                {t('Pricing.p1_price')}
                {' '}
                <span className="text-lg uppercase text-slate-500">{t('Pricing.p1_month')}</span>
              </div>
              <ul className="mb-10 space-y-4">
                {[t('Pricing.p1_l1'), t('Pricing.p1_l2'), t('Pricing.p1_l3')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-300">
                    <CheckCircle2 className="size-5 text-indigo-400" />
                    {' '}
                    {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant="outline" className="h-14 w-full rounded-2xl border-white/20 bg-transparent text-lg font-black text-white hover:bg-white hover:text-black">
                  {t('Pricing.p1_btn')}
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-[3rem] border-2 border-primary bg-gradient-to-b from-primary/20 to-primary/5 p-12 shadow-2xl md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-6 py-1.5 text-xs font-black uppercase tracking-widest text-white">
                {isAr ? 'الأكثر طلباً' : 'Most Popular 🚀'}
              </div>
              <h3 className="mb-2 text-3xl font-black">{t('Pricing.p2_title')}</h3>
              <p className="mb-8 text-sm font-medium text-indigo-200">{t('Pricing.p2_desc')}</p>
              <div className="mb-10 w-full border-b border-white/10 pb-10 text-6xl font-black text-white">
                {t('Pricing.p2_price')}
                {' '}
                <span className="text-lg uppercase text-indigo-300">{t('Pricing.p2_month')}</span>
              </div>
              <ul className="mb-10 space-y-4">
                {[t('Pricing.p2_l1'), t('Pricing.p2_l2'), t('Pricing.p2_l3'), t('Pricing.p2_l4')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-white">
                    <CheckCircle2 className="size-5 text-emerald-400" />
                    {' '}
                    {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="h-16 w-full rounded-2xl bg-primary text-xl font-black text-white shadow-xl shadow-primary/20 hover:bg-primary/90">
                  {t('Pricing.p2_btn')}
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all hover:bg-white/10">
              <h3 className="mb-2 text-2xl font-black">{t('Pricing.p3_title')}</h3>
              <p className="mb-8 text-sm font-medium text-slate-400">{t('Pricing.p3_desc')}</p>
              <div className="mb-10 w-full border-b border-white/10 pb-10 text-5xl font-black text-white">
                {t('Pricing.p3_price')}
              </div>
              <ul className="mb-10 space-y-4">
                {[t('Pricing.p3_l1'), t('Pricing.p3_l2'), t('Pricing.p3_l3')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 font-bold text-slate-300">
                    <CheckCircle2 className="size-5 text-indigo-400" />
                    {' '}
                    {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant="outline" className="h-14 w-full rounded-2xl border-white/20 bg-transparent text-lg font-black text-white hover:bg-white hover:text-black">
                  {t('Pricing.p3_btn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative overflow-hidden border-t border-border bg-background py-32">
        <div className="container relative z-10 mx-auto px-4 lg:max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-6 text-4xl font-black text-foreground md:text-5xl">{isAr ? 'الأسئلة الشائعة' : 'FAQs'}</h2>
            <p className="text-xl font-medium text-muted-foreground">{isAr ? 'كل ما تحتاج لمعرفته حول الخدمة.' : 'Everything you need to know about the service.'}</p>
          </div>

          <div className="space-y-4">
            {[
              { q: isAr ? 'هل أحتاج لخبرة برمجية لإنشاء البوت الخاص بي؟' : 'Do I need programming experience to create my bot?', a: isAr ? 'إطلاقاً! المنصة صُممت لتكون سهلة الاستخدام، يمكنك تدريب وإعداد الروبوت الخاص بك ببضع نقرات فقط من لوحة التحكم.' : 'Not at all! The platform is designed to be user-friendly, you can train and setup your bot with a few clicks.' },
              { q: isAr ? 'هل يمكنني ربط البوت بحساب الإنستجرام والواتساب معاً؟' : 'Can I connect the bot to my Instagram and WhatsApp?', a: isAr ? 'نعم! بفضل ميزة الترابط الشامل (Omnichannel)، يمكنك إدارة الانستجرام، الواتساب، والماسنجر من مكان واحد وبنفس الذكاء الاصطناعي.' : 'Yes! With our omnichannel approach, you can manage Instagram, WhatsApp, and Messenger from one place.' },
              { q: isAr ? 'ماذا لو لم يجد الروبوت الإجابة المناسبة لطلب العميل؟' : 'What if the bot cannot answer the customer\'s request?', a: isAr ? 'في حال لم يتعرف الروبوت على سؤال العميل، سيقوم بتحويل المحادثة فوراً إلى أحد موظفي خدمة العملاء لديك ليتمكن من الرد البشري.' : 'If the bot doesn\'t recognize a query, it will immediately route the conversation to a human agent.' },
              { q: isAr ? 'هل يمكن إلغاء الاشتراك في أي وقت؟' : 'Can I cancel my subscription at any time?', a: isAr ? 'بالتأكيد. يمكنك الترقية، تخفيض الباقة، أو إلغاء اشتراكك تماماً في أي وقت بدون أي عقود إجبارية من لوحة تحكم الفوترة.' : 'Absolutely. You can upgrade, downgrade, or cancel your subscription at any time with no contracts.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-3xl border border-border bg-card p-8 transition-colors hover:border-primary/30">
                <h3 className="mb-3 flex items-center gap-3 text-xl font-black text-foreground">
                  <div className="size-2 shrink-0 rounded-full bg-primary"></div>
                  {faq.q}
                </h3>
                <p className="pr-5 text-lg font-medium leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Premium CTA */}
      <section className="relative overflow-hidden border-t border-border bg-background py-32 text-center">
        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-5xl font-black tracking-tighter text-foreground md:text-7xl">
            {isAr ? 'جاهز لتحويل البزنس المالك؟' : 'Ready to Transform Your Business?'}
          </h2>
          <p className="mb-14 text-xl font-medium leading-relaxed text-muted-foreground">
            {isAr ? 'انضم إلى مئات الشركات التي ضاعفت مبيعاتها ووفرت آلاف الساعات باستخدام روبوتات Hood Trading.' : 'Join hundreds of companies that doubled their sales and saved thousands of hours using Hood Trading bots.'}
          </p>
          <Link href="#pricing">
            <Button size="lg" className="h-20 gap-4 rounded-[2rem] px-16 text-2xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95">
              {isAr ? 'ابدأ التجربة مجاناً الآن' : 'Start Your Free Trial Now'}
              <ArrowRight className={`size-8 ${isAr ? 'rotate-180' : ''}`} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndexPage;
