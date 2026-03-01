import { ArrowRight, Database, Eye, Globe, Lock, Mail, Shield, UserCheck } from 'lucide-react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Link } from '@/libs/i18nNavigation';
import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'سياسة الخصوصية | Hood Trading' : 'Privacy Policy | Hood Trading',
    description: isAr ? 'سياسة الخصوصية الخاصة بمنصة Hood Trading - تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية.' : 'Hood Trading Platform Privacy Policy - Learn how we collect, use, and protect your personal data.',
  };
}

const getSections = (isAr: boolean) => [
  {
    icon: Database,
    title: isAr ? 'البيانات التي نجمعها' : 'Data We Collect',
    color: 'indigo',
    content: [
      {
        subtitle: isAr ? 'المعلومات الشخصية' : 'Personal Information',
        text: isAr ? 'عند إنشاء حسابك أو الاشتراك في خدماتنا، قد نجمع الاسم الكامل، عنوان البريد الإلكتروني، رقم الهاتف، واسم النشاط التجاري.' : 'When creating an account or subscribing to our services, we may collect your full name, email address, phone number, and business name.',
      },
      {
        subtitle: isAr ? 'بيانات الاستخدام' : 'Usage Data',
        text: isAr ? 'نجمع تلقائياً معلومات حول كيفية تفاعلك مع المنصة، مثل الصفحات التي تزورها، والميزات التي تستخدمها، وأوقات الوصول.' : 'We automatically collect information about how you interact with the platform, such as visited pages, used features, and access times.',
      },
      {
        subtitle: isAr ? 'بيانات الدفع' : 'Payment Data',
        text: isAr ? 'تتم معالجة المدفوعات عبر Stripe، ولا نقوم بتخزين بيانات بطاقتك الائتمانية على خوادمنا مباشرة.' : 'Payments are processed via Stripe, and we do not store your credit card details directly on our servers.',
      },
    ],
  },
  {
    icon: Eye,
    title: isAr ? 'كيف نستخدم بياناتك' : 'How We Use Your Data',
    color: 'emerald',
    content: [
      {
        subtitle: isAr ? 'تقديم الخدمات' : 'Providing Services',
        text: isAr ? 'نستخدم بياناتك لتشغيل حسابك، ومعالجة المدفوعات، وتوفير خدمات الذكاء الاصطناعي والأتمتة.' : 'We use your data to operate your account, process payments, and provide AI and automation services.',
      },
      {
        subtitle: isAr ? 'تحسين التجربة' : 'Improving Experience',
        text: isAr ? 'نحلل أنماط الاستخدام لتحسين أداء المنصة وتطوير ميزات جديدة تلبي احتياجاتك.' : 'We analyze usage patterns to improve platform performance and develop new features that meet your needs.',
      },
      {
        subtitle: isAr ? 'التواصل معك' : 'Communication',
        text: isAr ? 'قد نرسل لك إشعارات مهمة حول حسابك، وتحديثات الخدمة، والعروض الترويجية (يمكنك إلغاء الاشتراك في أي وقت).' : 'We may send you important account notifications, service updates, and promotions (you can unsubscribe at any time).',
      },
    ],
  },
  {
    icon: Lock,
    title: isAr ? 'حماية بياناتك' : 'Protecting Your Data',
    color: 'purple',
    content: [
      {
        subtitle: isAr ? 'التشفير' : 'Encryption',
        text: isAr ? 'نستخدم تشفير SSL/TLS لحماية جميع البيانات المنقولة بين جهازك وخوادمنا.' : 'We use SSL/TLS encryption to protect all data transmitted between your device and our servers.',
      },
      {
        subtitle: isAr ? 'الأمان السحابي' : 'Cloud Security',
        text: isAr ? 'نستضيف بياناتك على خوادم آمنة مع حماية متقدمة ضد الاختراق ونسخ احتياطية منتظمة.' : 'Your data is hosted on secure servers with advanced intrusion protection and regular backups.',
      },
      {
        subtitle: isAr ? 'الوصول المقيد' : 'Restricted Access',
        text: isAr ? 'يقتصر الوصول إلى بياناتك على الموظفين المصرح لهم فقط الذين يحتاجون إليها لتقديم الخدمة.' : 'Access to your data is restricted to authorized personnel only who need it to provide the service.',
      },
    ],
  },
  {
    icon: UserCheck,
    title: isAr ? 'حقوقك' : 'Your Rights',
    color: 'amber',
    content: [
      {
        subtitle: isAr ? 'الوصول والتعديل' : 'Access & Modification',
        text: isAr ? 'يحق لك الوصول إلى بياناتك الشخصية وتعديلها في أي وقت من خلال إعدادات حسابك.' : 'You have the right to access and modify your personal data at any time through your account settings.',
      },
      {
        subtitle: isAr ? 'حذف البيانات' : 'Data Deletion',
        text: isAr ? 'يمكنك طلب حذف حسابك وجميع بياناتك المرتبطة به بشكل نهائي.' : 'You can request the permanent deletion of your account and all associated data.',
      },
      {
        subtitle: isAr ? 'نقل البيانات' : 'Data Portability',
        text: isAr ? 'يحق لك طلب نسخة من بياناتك بتنسيق قابل للقراءة الآلية.' : 'You have the right to request a copy of your data in a machine-readable format.',
      },
    ],
  },
  {
    icon: Globe,
    title: isAr ? 'ملفات تعريف الارتباط' : 'Cookies',
    color: 'blue',
    content: [
      {
        subtitle: isAr ? 'ملفات ضرورية' : 'Essential Cookies',
        text: isAr ? 'نستخدم ملفات تعريف ارتباط ضرورية لعمل المنصة بشكل صحيح، مثل الحفاظ على جلسة تسجيل الدخول.' : 'We use essential cookies for the platform to function properly, such as maintaining login sessions.',
      },
      {
        subtitle: isAr ? 'ملفات تحليلية' : 'Analytics Cookies',
        text: isAr ? 'قد نستخدم ملفات تعريف ارتباط لتحليل الاستخدام وتحسين تجربة المستخدم.' : 'We may use cookies to analyze usage and improve the user experience.',
      },
    ],
  },
  {
    icon: Mail,
    title: isAr ? 'تواصل معنا' : 'Contact Us',
    color: 'rose',
    content: [
      {
        subtitle: isAr ? 'الدعم' : 'Support',
        text: isAr ? 'إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال المنصة.' : 'If you have any questions or concerns about the privacy policy, contact us via email or platform.',
      },
      {
        subtitle: isAr ? 'التحديثات' : 'Updates',
        text: isAr ? 'قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة.' : 'We may update the privacy policy from time to time. We will notify you of material changes via email or platform.',
      },
    ],
  },
];

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
  indigo: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400', light: 'bg-indigo-50 dark:bg-indigo-900/10', border: 'border-indigo-100 dark:border-indigo-900/50' },
  emerald: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400', light: 'bg-emerald-50 dark:bg-emerald-900/10', border: 'border-emerald-100 dark:border-emerald-900/50' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400', light: 'bg-purple-50 dark:bg-purple-900/10', border: 'border-purple-100 dark:border-purple-900/50' },
  amber: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', light: 'bg-amber-50 dark:bg-amber-900/10', border: 'border-amber-100 dark:border-amber-900/50' },
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', light: 'bg-blue-50 dark:bg-blue-900/10', border: 'border-blue-100 dark:border-blue-900/50' },
  rose: { bg: 'bg-rose-100 dark:bg-rose-900/30', text: 'text-rose-600 dark:text-rose-400', light: 'bg-rose-50 dark:bg-rose-900/10', border: 'border-rose-100 dark:border-rose-900/50' },
};

const PrivacyPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);
  const isAr = props.params.locale === 'ar';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero */}
      <section className="relative pb-16 pt-32 lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_100%)] dark:bg-[radial-gradient(45%_40%_at_50%_0%,rgba(99,102,241,0.15)_0%,transparent_100%)]" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-indigo-100 shadow-inner dark:bg-indigo-900/40">
            <Shield className="size-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {isAr ? 'نحن في Hood Trading نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.' : 'At Hood Trading, we are committed to protecting your privacy and personal data. This policy explains how we collect, use, and protect your information.'}
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-bold text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
            {isAr ? 'آخر تحديث: فبراير 2026' : 'Last Updated: February 2026'}
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-32">
        <div className="container mx-auto max-w-4xl space-y-10 px-4">
          {getSections(isAr).map((section, idx) => {
            const colors = colorMap[section.color] ?? colorMap.indigo!;
            const Icon = section.icon;
            return (
              <div
                key={idx}
                className={`rounded-[2.5rem] border ${colors.border} bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:bg-slate-900 dark:hover:shadow-indigo-500/5 md:p-12`}
              >
                <div className="mb-8 flex items-center gap-4">
                  <div className={`flex size-14 items-center justify-center rounded-2xl ${colors.bg}`}>
                    <Icon className={`size-7 ${colors.text}`} />
                  </div>
                  <h2 className="text-2xl font-black md:text-3xl">{section.title}</h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((item, i) => (
                    <div key={i} className={`rounded-2xl ${colors.light} p-6`}>
                      <h3 className={`mb-2 text-lg font-black ${colors.text}`}>{item.subtitle}</h3>
                      <p className="font-medium leading-relaxed text-slate-600 dark:text-slate-400">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* CTA */}
          <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-10 text-center shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-indigo-900/20 md:p-14">
            <h2 className="mb-4 text-2xl font-black">{isAr ? 'هل لديك أسئلة؟' : 'Have Questions?'}</h2>
            <p className="mb-8 font-medium text-slate-500 dark:text-slate-400">{isAr ? 'لا تتردد في التواصل معنا إذا كانت لديك أي استفسارات حول سياسة الخصوصية' : 'Feel free to contact us if you have any questions regarding our privacy policy.'}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
            >
              {isAr ? 'العودة للرئيسية' : 'Back to Home'}
              <ArrowRight className={`size-5 ${isAr ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
