import {
  ArrowRight,
  Bot,
  Globe2,
  MessageCircle,
  Clock,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Users,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Button } from '@/components/ui/button';
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero Section - Radical New Layout (Split Design) */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full opacity-50 pointer-events-none"></div>

        <div className="container mx-auto px-4 lg:max-w-7xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left/Right Text Content */}
            <div className="flex-1 text-center lg:text-start">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-8 font-black uppercase text-xs tracking-widest animate-fade-in-up">
                <Sparkles className="size-4" />
                الإصدار الجديد كلياً
              </div>

              <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tighter mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <span className="block text-foreground">{t('Hero.title1')}</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600 block mt-2 pb-2">
                  {t('Hero.title2')}
                </span>
              </h1>

              <p className="text-xl text-muted-foreground font-medium mb-10 max-w-xl mx-auto lg:mx-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                طور عملك الآن من خلال مساعد ذكي متكامل يوفر لك العديد من الحلول والمزايا التي توفر عليك الكثير من المهام الروتينية.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <Link href="#pricing">
                  <Button size="lg" className="h-16 px-10 text-xl font-black rounded-2xl gap-3 shadow-xl shadow-primary/25 hover:scale-105 transition-all">
                    احصل الآن على مساعدك الذكي
                    <ArrowRight className={`size-6 ${isAr ? 'rotate-180' : ''}`} />
                  </Button>
                </Link>
                <Link href="#formula">
                  <Button variant="outline" size="lg" className="h-16 px-10 text-xl font-black rounded-2xl gap-3 bg-background/50 backdrop-blur border-border hover:bg-muted transition-all">
                    اكتشف النظام
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-3 text-sm font-bold text-muted-foreground animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <div className="p-2 rounded-full bg-emerald-500/10">
                  <ShieldCheck className="size-4 text-emerald-500" />
                </div>
                <span>
                  🔒 لم تحقق تحسن ملحوظ خلال أول 30 يوم؟ <span className="text-foreground">سنعيد لك كامل المبلغ.</span>
                </span>
              </div>
            </div>

            {/* Visual/Image Representation */}
            <div className="flex-1 w-full animate-fade-in-up" style={{ animationDelay: '400ms' }}>
              <div className="relative w-full aspect-square max-w-[600px] mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-purple-500/20 rounded-[3rem] transform rotate-3 scale-105"></div>
                <div className="absolute inset-0 bg-card border border-border rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
                  {/* Mockup Header */}
                  <div className="h-14 border-b border-border bg-muted/50 flex items-center px-6 gap-3">
                    <div className="flex gap-1.5">
                      <div className="size-3 rounded-full bg-red-400"></div>
                      <div className="size-3 rounded-full bg-amber-400"></div>
                      <div className="size-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <div className="mx-auto px-6 py-1.5 rounded-md bg-background text-xs font-bold text-muted-foreground shadow-sm">
                      hoodtrading.com
                    </div>
                  </div>
                  {/* Mockup Body */}
                  <div className="flex-1 p-8 flex flex-col justify-center relative">
                    <div className="absolute right-8 top-8 max-w-[80%] bg-primary text-primary-foreground p-4 rounded-3xl rounded-tr-sm shadow-xl text-sm font-bold animate-fade-in-up">
                      أهلاً بك في متجرنا! 👋 كيف أقدر أساعدك اليوم؟
                    </div>
                    <div className="absolute left-8 top-32 max-w-[80%] bg-muted text-foreground border border-border p-4 rounded-3xl rounded-tl-sm shadow-md text-sm font-bold animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                      هل يتوفر عندكم حذاء الركض الرياضي مقاس 42 باللون الأسود؟
                    </div>
                    <div className="absolute right-8 top-56 max-w-[80%] bg-primary text-primary-foreground p-4 rounded-3xl rounded-tr-sm shadow-xl text-sm font-bold animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
                      نعم متوفر! 👟 وتقدر تطلبه مباشرة ويصلك خلال 24 ساعة. هل أضيفه لسلتك؟
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
                      <div className="p-3 bg-card border border-border shadow-xl rounded-2xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                        <div className="size-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                          <TrendingUp className="size-5" />
                        </div>
                        <div className="text-start">
                          <div className="text-xs font-bold text-muted-foreground">+45% مبيعات</div>
                          <div className="text-sm font-black">هذا الأسبوع</div>
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
      <section className="py-24 bg-muted/30 border-y border-border" id="features">
        <div className="container mx-auto px-4 lg:max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">كل ما تحتاجه في مكان واحد</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
              أدوات مصممة بعناية فائقة لتأخذ تجارتك إلى المستوى التالي.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Box 1 */}
            <div className="md:col-span-2 bg-card rounded-[2.5rem] p-10 border border-border shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="size-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6">
                  <Bot className="size-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground">{t('Features.title')}</h3>
                <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-md">{t('Features.desc')}</p>
              </div>
              <div className="absolute left-0 bottom-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                <Bot className="size-40 text-primary" />
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-card rounded-[2.5rem] p-10 border border-border shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full">
                <div className="size-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-6">
                  <Clock className="size-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground mt-auto">دعم 24/7</h3>
                <p className="text-muted-foreground font-medium">روبوتات لا تنام، تخدم عملائك بأي وقت.</p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-card rounded-[2.5rem] p-10 border border-border shadow-md hover:shadow-xl transition-all group">
              <div className="flex flex-col h-full">
                <div className="size-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-6">
                  <TrendingUp className="size-7" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-foreground mt-auto">زيادة التحويلات</h3>
                <p className="text-muted-foreground font-medium">تحويل الزوار إلى مشترين بسرعة.</p>
              </div>
            </div>

            {/* Box 4 */}
            <div className="md:col-span-2 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-[2.5rem] p-10 border border-slate-800 shadow-xl transition-all group text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-primary/20 to-transparent pointer-events-none"></div>
              <div className="relative z-10 flex flex-col justify-center h-full">
                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6 w-fit backdrop-blur-md">
                  <Globe2 className="size-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">ارتباط عالمي</span>
                </div>
                <h3 className="text-3xl font-black mb-3">ربط مع كافة المنصات</h3>
                <p className="text-slate-300 font-medium text-lg max-w-md">أدر محادثاتك من انستجرام، واتساب، وماسنجر من مكان واحد بنظام متكامل لإدارة علاقات العملاء.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hood Trading System Section */}
      <section className="py-32 bg-background relative overflow-hidden" id="formula">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
              ما هو نظام <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Hood Trading</span> وما الذي يجعله النظام الأمثل لتطوير أي بيزنس؟
            </h2>
            <p className="text-xl text-muted-foreground font-medium max-w-3xl mx-auto leading-relaxed">
              نظام ذكي متكامل يوفر لك توفيرًا في التكاليف والوقت من خلال أتمتة العمليات الأساسية باستخدام معادلة بسيطة:
            </p>
            <div className="inline-flex flex-wrap items-center justify-center gap-3 mt-8 bg-muted/50 border border-border px-6 py-4 rounded-3xl text-lg md:text-2xl font-black text-foreground shadow-sm">
              <span className="text-blue-500">خدمة العملاء</span>
              <span className="text-muted-foreground">+</span>
              <span className="text-purple-500">توليد العملاء المحتملين</span>
              <span className="text-muted-foreground">+</span>
              <span className="text-emerald-500">حجز المواعيد</span>
            </div>
          </div>

          <div className="space-y-12">
            {[
              {
                title: "#1 خدمة العملاء (Customer Support)",
                desc: "إجابات فورية ودقيقة عبر بناء قاعدة بيانات للأسئلة الشائعة، مع القدرة على تحويل الطلبات المعقدة للفريق البشري مباشرة.",
                example: "مثال للتوضيح أكثر: العملاء يتصلون بشكل متكرر للاستفسار عن حالة الشحنات، تكاليف الشحن، ومواعيد التوصيل، مما يسبب ضغطًا كبيرًا على فريق خدمة العملاء. فالروبوت يتولى الرد على استفسارات العملاء حول حالة الشحنة باستخدام رقم التتبع وايضا يقدم اجابات جاهزة حول تكاليف الشحن وطرق الدفع واجراءات التوصيل وغيرها.",
                icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-500/10', exampleBadge: 'للشركات والمتاجر'
              },
              {
                title: "#2 توليد العملاء المحتملين (Lead Gen)",
                desc: "جمع بيانات العملاء (كالاسم والهاتف) أثناء المحادثة تلقائياً، وتصنيفهم حسب الاهتمام للمبيعات وتقديم تقارير وعروض تناسبهم.",
                example: "مثال للتوضيح أكثر [ متجر إلكتروني للملابس ]: عندما يدخل العميل إلى الموقع ويستفسر عن تخفيضات على مجموعة معينة، يقوم الروبوت بجمع بيانات الاتصال الخاصة به ويعرض عليه الانضمام إلى النشرة البريدية لتلقي عروض حصرية، ثم يرسل البيانات المجمعة إلى فريق المبيعات.",
                icon: Users, color: 'text-purple-500', bg: 'bg-purple-500/10', exampleBadge: 'للمتاجر الإلكترونية'
              },
              {
                title: "#3 حجز المواعيد تلقائياً (Bookings)",
                desc: "ربط الروبوت بالتقويم الخاص بك لجدولة الاجتماعات والمكالمات في الأوقات المتاحة بدون أي تدخل بشري، مع تنبيهات فورية.",
                example: "مثال للتوضيح أكثر [ عيادة طبية ]: عندما يقوم أحد المرضى بالتواصل مع الروبوت لحجز موعد مع الطبيب، يسأل الروبوت عن الخدمة المطلوبة، ثم يعرض المواعيد المتاحة، ويقوم بتأكيد الموعد مع المريض وتحديث جدول الطبيب تلقائيًا.",
                icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-500/10', exampleBadge: 'للعيادات والمكاتب'
              },
            ].map((feature, i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-8 p-8 md:p-12 rounded-[3rem] bg-card border border-border shadow-lg hover:shadow-xl transition-all">
                <div className={`size-24 rounded-3xl flex items-center justify-center shrink-0 ${feature.bg}`}>
                  <feature.icon className={`size-12 ${feature.color}`} />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-3xl font-black mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-6">{feature.desc}</p>

                  {feature.example && (
                    <div className="bg-muted/30 border border-border/50 rounded-2xl p-5 relative">
                      <span className={`absolute -top-3 right-5 text-[10px] font-black uppercase text-white px-3 py-1 rounded-full ${feature.color.replace('text-', 'bg-')}`}>
                        {feature.exampleBadge}
                      </span>
                      <p className="text-sm font-bold text-foreground/80 leading-relaxed mt-1">
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
      <section className="py-24 bg-muted/20 border-y border-border">
        <div className="container mx-auto px-4 lg:max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">هل النظام مناسب لك؟</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
              <h3 className="text-2xl font-black text-emerald-600 mb-8 flex items-center gap-3">
                <div className="size-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="size-6" />
                </div>
                النظام مناسب لك إذا كنت:
              </h3>
              <ul className="space-y-6">
                {[
                  "تسعى لتحسين تجربة عملائك وتقديم دعم مستمر على مدار الساعة.",
                  "تحتاج لأتمتة العمليات اليومية لتوفير الوقت وتقليل عبء الروتين.",
                  "تمتلك شركة صغيرة، متجر إلكتروني، أو تعمل كصاحب مشروع ناشئ.",
                  "تبحث عن حلول ذكية لتحليل البيانات بشكل أسرع وأكثر دقة."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 font-bold text-foreground leading-relaxed">
                    <div className="size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 text-xs shadow-md mt-1">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-rose-500/5 border border-rose-500/20 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
              <h3 className="text-2xl font-black text-rose-600 mb-8 flex items-center gap-3">
                <div className="size-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <span className="font-black text-2xl mb-1 pb-1">×</span>
                </div>
                غير مناسب لك أبداً إذا:
              </h3>
              <ul className="space-y-6">
                {[
                  "لا تؤمن بفوائد الذكاء الاصطناعي وتفضل الطرق التقليدية.",
                  "لديك ميزانية معدومة ولا تستطيع تحمل الاستثمار في تقنياتك.",
                  "تريد سيطرة ومراقبة بشرية كاملة على كل التفاعلات البسيطة.",
                  "سوقك وعملائك لا يفضلون استخدام أي أدوات أو تقنيات حديثة."
                ].map((item, i) => (
                  <li key={i} className="flex gap-4 font-bold text-foreground leading-relaxed">
                    <span className="text-rose-500 mt-2 shrink-0"><Bot className="size-5" /></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>



      {/* Pricing - Streamlined */}
      <section className="py-32 bg-slate-900 text-white relative" id="pricing">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%__0%,rgba(99,102,241,0.15),transparent_70%)]"></div>
        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">{t('Pricing.title')}</h2>
            <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">{t('Pricing.desc')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-center">
            {/* Starter */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all">
              <h3 className="text-2xl font-black mb-2">{t('Pricing.p1_title')}</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">{t('Pricing.p1_desc')}</p>
              <div className="text-5xl font-black mb-10 text-white w-full border-b border-white/10 pb-10">
                {t('Pricing.p1_price')} <span className="text-lg text-slate-500 uppercase">{t('Pricing.p1_month')}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[t('Pricing.p1_l1'), t('Pricing.p1_l2'), t('Pricing.p1_l3')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                    <CheckCircle2 className="size-5 text-indigo-400" /> {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-black text-lg">
                  {t('Pricing.p1_btn')}
                </Button>
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-b from-primary/20 to-primary/5 border-2 border-primary p-12 rounded-[3rem] transform md:scale-105 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-black uppercase tracking-widest px-6 py-1.5 rounded-full">
                الأكثر طلباً
              </div>
              <h3 className="text-3xl font-black mb-2">{t('Pricing.p2_title')}</h3>
              <p className="text-indigo-200 text-sm mb-8 font-medium">{t('Pricing.p2_desc')}</p>
              <div className="text-6xl font-black mb-10 text-white w-full border-b border-white/10 pb-10">
                {t('Pricing.p2_price')} <span className="text-lg text-indigo-300 uppercase">{t('Pricing.p2_month')}</span>
              </div>
              <ul className="space-y-4 mb-10">
                {[t('Pricing.p2_l1'), t('Pricing.p2_l2'), t('Pricing.p2_l3'), t('Pricing.p2_l4')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 text-white font-bold">
                    <CheckCircle2 className="size-5 text-emerald-400" /> {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-xl shadow-xl shadow-primary/20">
                  {t('Pricing.p2_btn')}
                </Button>
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-10 rounded-[2.5rem] hover:bg-white/10 transition-all">
              <h3 className="text-2xl font-black mb-2">{t('Pricing.p3_title')}</h3>
              <p className="text-slate-400 text-sm mb-8 font-medium">{t('Pricing.p3_desc')}</p>
              <div className="text-5xl font-black mb-10 text-white w-full border-b border-white/10 pb-10">
                {t('Pricing.p3_price')}
              </div>
              <ul className="space-y-4 mb-10">
                {[t('Pricing.p3_l1'), t('Pricing.p3_l2'), t('Pricing.p3_l3')].map((l, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 font-bold">
                    <CheckCircle2 className="size-5 text-indigo-400" /> {l}
                  </li>
                ))}
              </ul>
              <Link href="/sign-up">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-white/20 bg-transparent text-white hover:bg-white hover:text-black font-black text-lg">
                  {t('Pricing.p3_btn')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-background border-t border-border relative overflow-hidden">
        <div className="container mx-auto px-4 lg:max-w-4xl relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-foreground">الأسئلة الشائعة</h2>
            <p className="text-xl text-muted-foreground font-medium">كل ما تحتاج لمعرفته حول الخدمة.</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "هل أحتاج لخبرة برمجية لإنشاء البوت الخاص بي؟", a: "إطلاقاً! المنصة صُممت لتكون سهلة الاستخدام، يمكنك تدريب وإعداد الروبوت الخاص بك ببضع نقرات فقط من لوحة التحكم." },
              { q: "هل يمكنني ربط البوت بحساب الإنستجرام والواتساب معاً؟", a: "نعم! بفضل ميزة الترابط الشامل (Omnichannel)، يمكنك إدارة الانستجرام، الواتساب، والماسنجر من مكان واحد وبنفس الذكاء الاصطناعي." },
              { q: "ماذا لو لم يجد الروبوت الإجابة المناسبة لطلب العميل؟", a: "في حال لم يتعرف الروبوت على سؤال العميل، سيقوم بتحويل المحادثة فوراً إلى أحد موظفي خدمة العملاء لديك ليتمكن من الرد البشري." },
              { q: "هل يمكن إلغاء الاشتراك في أي وقت؟", a: "بالتأكيد. يمكنك الترقية، تخفيض الباقة، أو إلغاء اشتراكك تماماً في أي وقت بدون أي عقود إجبارية من لوحة تحكم الفوترة." }
            ].map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-3xl p-8 hover:border-primary/30 transition-colors">
                <h3 className="text-xl font-black mb-3 text-foreground flex items-center gap-3">
                  <div className="size-2 rounded-full bg-primary shrink-0"></div>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground font-medium text-lg pr-5 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Premium CTA */}
      <section className="py-32 bg-background relative overflow-hidden text-center border-t border-border">
        <div className="container relative z-10 mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-5xl md:text-7xl font-black tracking-tighter text-foreground">
            جاهز لتحويل البزنس المالك؟
          </h2>
          <p className="mb-14 text-xl font-medium text-muted-foreground leading-relaxed">
            انضم إلى مئات الشركات التي ضاعفت مبيعاتها ووفرت آلاف الساعات باستخدام روبوتات Hood Trading.
          </p>
          <Link href="#pricing">
            <Button size="lg" className="h-20 px-16 text-2xl font-black rounded-[2rem] shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all gap-4">
              ابدأ التجربة مجاناً الآن
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
