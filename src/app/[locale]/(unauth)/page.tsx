import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Briefcase,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Globe,
  Headphones,
  MessageSquare,
  Phone,
  Search,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
  return {
    title: 'Hood Trading',
    description: 'روبوتات ذكية مصممة خصيصًا لتطوير البيزنس الخاص بك',
  };
}

const IndexPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);
  const t = useTranslations('Landing');
  const isAr = props.params.locale === 'ar';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 selection:bg-primary/20" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Premium Hero Section */}
      <section className="relative pb-24 pt-32 lg:pb-40 lg:pt-48">
        {/* Animated Background Artifacts */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_100%)]"></div>
        <div className="absolute left-1/2 top-0 -z-10 h-[1000px] w-[1000px] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:h-[1500px] sm:w-[1500px]">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 [mask-image:radial-gradient(farthest-side_at_top_left,white,transparent)]"></div>
          <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.03)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="container mx-auto px-4 text-center">
          <div className="mb-10 flex animate-in fade-in slide-in-from-bottom-4 justify-center duration-1000">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary shadow-sm backdrop-blur-md">
              <Sparkles className="size-3.5 fill-primary/20" />
              <span>{t('Hero.badge')}</span>
            </div>
          </div>

          <h1 className="mx-auto max-w-5xl animate-in text-center text-5xl font-black leading-[0.9] tracking-tighter fade-in slide-in-from-bottom-8 delay-200 duration-1000 sm:text-7xl lg:text-8xl">
            <span className="block text-slate-900">{t('Hero.title1')}</span>
            <span className="bg-gradient-to-r from-primary via-indigo-600 to-primary bg-clip-text italic text-transparent decoration-primary/30">
              {t('Hero.title2')}
            </span>
          </h1>

          <p className="mx-auto mt-10 max-w-2xl animate-in text-lg font-medium leading-relaxed text-slate-500 fade-in slide-in-from-bottom-8 delay-300 duration-1000 md:text-xl lg:text-2xl">
            {t('Hero.desc')}
            {' '}
            <span className="font-bold text-slate-900 underline decoration-primary/40 decoration-wavy">hood trading</span>
            .
          </p>

          <div className="mt-12 flex animate-in flex-col items-center justify-center gap-6 fade-in slide-in-from-bottom-8 delay-500 duration-1000 sm:flex-row">
            <Link href="#pricing">
              <Button size="lg" className="h-16 gap-3 rounded-2xl px-10 text-xl font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95">
                {t('Hero.cta')}
                <ArrowRight className={`size-6 ${isAr ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
            <div className="flex items-center gap-8 rounded-2xl border border-slate-100 bg-slate-50/50 px-6 py-3 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
              <div className="flex -space-x-3 rtl:space-x-reverse">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="size-10 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-inner">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i * 123}`} alt="User" />
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-start gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="whitespace-nowrap text-xs font-black uppercase tracking-tighter text-slate-600">وثق به +500 شركة متطورة</span>
              </div>
            </div>
          </div>

          <div className="mt-20 flex animate-in justify-center fade-in delay-700 duration-1000">
             <div className="inline-flex items-center gap-3 rounded-2xl border bg-white px-6 py-3 shadow-xl shadow-slate-100/50">
                <ShieldCheck className="size-5 text-emerald-500" />
                <span className="text-sm font-bold text-slate-600">{t('Hero.guarantee')}</span>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid with 3D Effect */}
      <section className="relative bg-slate-50 py-32" id="features">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-20 lg:grid-cols-2">
            <div className="space-y-8 text-start">
              <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                <Zap className="size-4 fill-primary/20" />
                الجيل القادم من التجارة
              </div>
              <h2 className="text-4xl font-black leading-[1.1] tracking-tighter md:text-5xl lg:text-6xl">
                {t('Features.title')}
              </h2>
              <p className="text-lg font-medium italic leading-relaxed text-slate-500">
                {t('Features.desc')}
              </p>
              
              <div className="grid gap-4">
                {[
                  { icon: Headphones, label: t('Features.cs'), color: 'bg-blue-50 text-blue-600' },
                  { icon: Users, label: t('Features.lead'), color: 'bg-emerald-50 text-emerald-600' },
                  { icon: CalendarCheck, label: t('Features.booking'), color: 'bg-amber-50 text-amber-600' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 rounded-3xl border border-white/40 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
                    <div className={`size-14 rounded-2xl ${item.color} flex items-center justify-center`}>
                      <item.icon className="size-7" />
                    </div>
                    <span className="text-xl font-bold font-black">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-primary/30 to-purple-500/30 opacity-20 blur-2xl transition duration-1000 group-hover:opacity-40"></div>
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[2.5rem] border-8 border-slate-50 bg-white p-6 shadow-2xl">
                <div className="space-y-6 text-center">
                   <div className="mx-auto flex size-32 items-center justify-center rounded-[2rem] bg-indigo-600 shadow-2xl shadow-indigo-200 duration-[3000ms] animate-in fade-in zoom-in slide-in-from-bottom-5">
                      <Bot className="size-16 text-white" />
                   </div>
                   <div className="space-y-2">
                      <div className="mx-auto h-4 w-48 rounded-full bg-slate-100"></div>
                      <div className="mx-auto h-4 w-32 rounded-full bg-slate-100 opacity-50"></div>
                   </div>
                </div>
                {/* Floating Micro-UI elements */}
                <div className="absolute right-10 top-10 rotate-12 rounded-2xl bg-emerald-500 p-4 text-xs font-black text-white shadow-xl">
                   تم البيع! ✅
                </div>
                <div className="absolute bottom-20 left-10 -rotate-6 rounded-2xl bg-blue-600 p-4 text-xs font-black text-white shadow-xl">
                   جاري الرد... 💬
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section - Dark Premium */}
      <section className="relative overflow-hidden bg-slate-900 py-32 text-white" id="challenges">
        <div className="pointer-events-none absolute inset-0 opacity-10">
           <div className="absolute -left-20 -top-24 size-96 bg-primary blur-[160px]"></div>
           <div className="absolute -bottom-24 -right-20 size-96 bg-purple-600 blur-[160px]"></div>
        </div>
        
        <div className="container relative z-10 mx-auto max-w-6xl px-4">
          <div className="mb-24 text-center">
            <h2 className="mb-6 text-4xl font-black tracking-tighter md:text-6xl">{t('Challenges.title')}</h2>
            <p className="mx-auto max-w-3xl text-xl font-medium italic text-slate-400">{t('Challenges.desc')}</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              { title: t('Challenges.c1_title'), desc: t('Challenges.c1_desc'), icon: Clock },
              { title: t('Challenges.c2_title'), desc: t('Challenges.c2_desc'), icon: Zap },
              { title: t('Challenges.c3_title'), desc: t('Challenges.c3_desc'), icon: Target },
              { title: t('Challenges.c4_title'), desc: t('Challenges.c4_desc'), icon: Settings },
              { title: t('Challenges.c5_title'), desc: t('Challenges.c5_desc'), icon: TrendingUp },
              { title: t('Challenges.c6_title'), desc: t('Challenges.c6_desc'), icon: MessageSquare },
            ].map((item, i) => (
              <div key={i} className="group rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-sm transition-all hover:-translate-y-2 hover:border-white/20 hover:bg-white/10">
                <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 transition-transform group-hover:scale-110">
                  <item.icon className="size-8 text-primary" />
                </div>
                <h3 className="mb-4 text-2xl font-black transition-colors group-hover:text-primary">{item.title}</h3>
                <p className="font-medium leading-relaxed text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center">
            <div className="inline-block rounded-[1.5rem] bg-gradient-to-r from-primary to-purple-500 p-1">
               <div className="rounded-[1.4rem] bg-slate-900 px-10 py-6 text-2xl font-black italic">
                 {t('Challenges.footer')}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Details Section - Visual Excellence */}
      <section className="bg-white py-32" id="services">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-20 space-y-4 text-center">
            <h2 className="text-4xl font-black tracking-tighter md:text-6xl">{t('Details.title')}</h2>
            <div className="mx-auto h-2 w-24 rounded-full bg-primary"></div>
          </div>

          <div className="space-y-32">
            {[
              { title: t('Details.s1_title'), items: [t('Details.s1_l1'), t('Details.s1_l2')], icon: Headphones, ex: t('Details.s1_ex'), ex_desc: t('Details.s1_ex_desc'), color: 'indigo' },
              { title: t('Details.s2_title'), items: [t('Details.s2_l1'), t('Details.s2_l2'), t('Details.s2_l3')], icon: Users, ex: t('Details.s2_ex'), ex_desc: t('Details.s2_ex_desc'), color: 'emerald' },
              { title: t('Details.s3_title'), items: [t('Details.s3_l1'), t('Details.s3_l2'), t('Details.s3_l3')], icon: CalendarCheck, ex: t('Details.s3_ex'), ex_desc: t('Details.s3_ex_desc'), color: 'amber' },
            ].map((s, idx) => (
              <div key={idx} className={`flex flex-col lg:flex-row gap-16 items-start ${idx % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                 <div className="flex-1 space-y-8">
                    <div className={`size-20 rounded-3xl bg-${s.color}-50 text-${s.color}-600 flex items-center justify-center shadow-inner`}>
                       <s.icon className="size-10" />
                    </div>
                    <h3 className="text-3xl font-black lg:text-5xl">{s.title}</h3>
                    <ul className="space-y-4 text-lg font-medium italic text-slate-500">
                       {s.items.map((item, i) => (
                         <li key={i} className="flex items-center gap-4">
                            <CheckCircle2 className={`size-6 text-${s.color}-500 shrink-0`} />
                            {item}
                         </li>
                       ))}
                    </ul>
                 </div>
                 <div className="w-full flex-1 rounded-[3rem] border border-slate-100 bg-slate-50 p-10 shadow-xl">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                       مثال حي من الواقع
                    </div>
                    <h4 className="mb-4 text-2xl font-black italic text-emerald-600">{s.ex}</h4>
                    <p className="font-medium leading-relaxed text-slate-600">{s.ex_desc}</p>
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Premium Cards */}
      <section className="relative overflow-hidden bg-slate-50 py-32" id="pricing">
         <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
         <div className="container relative z-10 mx-auto max-w-7xl px-4">
            <div className="mb-24 text-center">
              <h2 className="mb-6 text-4xl font-black tracking-tighter md:text-6xl">{t('Pricing.title')}</h2>
              <p className="mx-auto max-w-2xl text-xl font-medium italic text-slate-500">{t('Pricing.desc')}</p>
            </div>

            <div className="grid items-start gap-8 md:grid-cols-3">
              {/* Starter Plan */}
              <div className="group rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl transition-all hover:scale-105 hover:shadow-2xl">
                 <h3 className="mb-2 text-2xl font-black">{t('Pricing.p1_title')}</h3>
                 <p className="mb-8 text-sm font-medium italic text-slate-500 underline decoration-primary/20">{t('Pricing.p1_desc')}</p>
                 <div className="mb-10 flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{t('Pricing.p1_price')}</span>
                    <span className="px-2 text-xs font-black uppercase tracking-widest text-slate-400">{t('Pricing.p1_month')}</span>
                 </div>
                 <ul className="mb-12 space-y-5">
                   {[t('Pricing.p1_l1'), t('Pricing.p1_l2'), t('Pricing.p1_l3'), t('Pricing.p1_l4')].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 font-bold text-slate-600">
                        <CheckCircle2 className="size-5 shrink-0 text-primary" />
                        {item}
                     </li>
                   ))}
                 </ul>
                 <Link href="/sign-up" className="block">
                   <Button variant="outline" className="h-14 w-full rounded-2xl border-2 border-slate-900 text-lg font-black group-hover:bg-slate-900 group-hover:text-white">
                      {t('Pricing.p1_btn')}
                   </Button>
                 </Link>
              </div>

              {/* Pro Plan - Premium Highlight */}
              <div className="group/pro relative">
                 <div className="absolute -inset-1 rounded-[2.6rem] bg-gradient-to-r from-primary to-purple-600 opacity-25 blur transition duration-1000 group-hover/pro:opacity-100 group-hover/pro:duration-200"></div>
                 <div className="relative scale-105 transform rounded-[2.5rem] border-2 border-primary bg-white p-12 shadow-2xl transition-all md:-translate-y-4">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-8 py-2 text-xs font-black uppercase tracking-widest text-white shadow-xl">
                       {t('Pricing.p2_badge')}
                       {' '}
                       🏆
                    </div>
                    <h3 className="mb-2 text-3xl font-black">{t('Pricing.p2_title')}</h3>
                    <p className="mb-8 text-sm font-medium italic text-slate-500">{t('Pricing.p2_desc')}</p>
                    <div className="mb-12 flex items-baseline gap-1">
                       <span className="text-6xl font-black tracking-tighter text-primary">{t('Pricing.p2_price')}</span>
                       <span className="px-2 text-xs font-black uppercase tracking-widest text-slate-400">{t('Pricing.p2_month')}</span>
                    </div>
                    <ul className="mb-12 space-y-5">
                      {[t('Pricing.p2_l1'), t('Pricing.p2_l2'), t('Pricing.p2_l3'), t('Pricing.p2_l4'), t('Pricing.p2_l5')].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 font-bold text-slate-900">
                           <CheckCircle2 className="size-6 shrink-0 text-emerald-500" />
                           {item}
                        </li>
                      ))}
                    </ul>
                    <Link href="/sign-up" className="block">
                      <Button className="h-16 w-full rounded-2xl text-xl font-black shadow-xl shadow-primary/30">
                         {t('Pricing.p2_btn')}
                      </Button>
                    </Link>
                 </div>
              </div>

              {/* Enterprise Plan */}
              <div className="group rounded-[2.5rem] border border-slate-200 bg-white p-10 shadow-xl transition-all hover:scale-105">
                 <h3 className="mb-2 text-2xl font-black">{t('Pricing.p3_title')}</h3>
                 <p className="mb-8 text-sm font-medium italic text-slate-500">{t('Pricing.p3_desc')}</p>
                 <div className="mb-10 flex items-baseline gap-1">
                    <span className="text-5xl font-black tracking-tighter">{t('Pricing.p3_price')}</span>
                 </div>
                 <ul className="mb-12 space-y-5">
                   {[t('Pricing.p3_l1'), t('Pricing.p3_l2'), t('Pricing.p3_l3'), t('Pricing.p3_l4')].map((item, i) => (
                     <li key={i} className="flex items-center gap-3 font-bold text-slate-600">
                        <CheckCircle2 className="size-5 shrink-0 text-indigo-500" />
                        {item}
                     </li>
                   ))}
                 </ul>
                 <Link href="/sign-up" className="block">
                   <Button variant="ghost" className="h-14 w-full rounded-2xl bg-slate-100 text-lg font-black hover:bg-slate-200">
                      {t('Pricing.p3_btn')}
                   </Button>
                 </Link>
              </div>
            </div>
         </div>
      </section>

      {/* Target Audience Categories */}
      <section className="relative py-24">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">{t('Categories.title')}</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Briefcase, title: t('Categories.c1_title'), desc: t('Categories.c1_desc') },
              { icon: Target, title: t('Categories.c2_title'), desc: t('Categories.c2_desc') },
              { icon: ShoppingCart, title: t('Categories.c3_title'), desc: t('Categories.c3_desc') },
              { icon: Search, title: t('Categories.c4_title'), desc: t('Categories.c4_desc') },
              { icon: Phone, title: t('Categories.c5_title'), desc: t('Categories.c5_desc') },
              { icon: Settings, title: t('Categories.c6_title'), desc: t('Categories.c6_desc') },
            ].map(cat => (
              <div key={cat.title} className="rounded-3xl border bg-card p-6 shadow-sm transition-colors hover:border-primary/50">
                <cat.icon className="mb-4 size-8 text-primary" />
                <h3 className="mb-2 text-lg font-bold">{cat.title}</h3>
                <p className="text-sm font-medium text-slate-500">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Premium CTA */}
      <section className="relative overflow-hidden bg-slate-900 py-40">
         <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
         {/* Animated backgrounds */}
         <div className="pointer-events-none absolute left-1/2 top-1/2 size-full -translate-x-1/2 -translate-y-1/2 opacity-30">
            <div className="absolute left-1/2 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-primary/20 blur-[120px]"></div>
         </div>

         <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center">
            <div className="mx-auto mb-10 flex size-24 items-center justify-center rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
               <ShieldCheck className="size-12 text-emerald-400" />
            </div>
            <h2 className="mb-10 text-5xl font-black leading-none tracking-tighter text-white md:text-7xl lg:text-8xl">
               {t('CTA.title')}
            </h2>
            <p className="mb-16 text-xl font-medium italic leading-relaxed text-slate-400 md:text-2xl">
               {t.rich('CTA.desc', {
                 strongText: chunks => <strong className="font-black text-white">{chunks}</strong>,
               })}
            </p>
            <Link href="#pricing">
               <Button size="lg" className="h-20 gap-4 rounded-[2rem] px-16 text-2xl font-black shadow-2xl shadow-primary/40 transition-all hover:scale-105 active:scale-95">
                  {t('CTA.btn')}
                  <ArrowRight className={`size-8 ${isAr ? 'rotate-180' : ''}`} />
               </Button>
            </Link>
            <div className="mt-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
               بدون مخاطرة • إلغاء في أي وقت • دعم فني 24/7
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default IndexPage;
