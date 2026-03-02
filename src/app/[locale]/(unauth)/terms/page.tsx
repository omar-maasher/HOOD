import { AlertTriangle, ArrowRight, Ban, CreditCard, Facebook, FileText, Gavel, Mail, RefreshCw, Scale } from 'lucide-react';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Link } from '@/libs/i18nNavigation';
import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const isAr = locale === 'ar';
  return {
    title: isAr ? 'شروط الاستخدام | Hood Trading' : 'Terms of Use | Hood Trading',
    description: isAr ? 'شروط استخدام منصة Hood Trading - تعرف على الشروط والأحكام المنظمة لاستخدام خدماتنا.' : 'Hood Trading Platform Terms of Use - Learn about the terms and conditions governing the use of our services.',
  };
}

const getSections = (isAr: boolean) => [
  {
    icon: FileText,
    title: isAr ? 'مقدمة' : 'Introduction',
    color: 'indigo',
    content: [
      {
        subtitle: isAr ? 'قبول الشروط' : 'Acceptance of Terms',
        text: isAr ? 'باستخدامك لمنصة Hood Trading فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.' : 'By using Hood Trading, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the platform.',
      },
      {
        subtitle: isAr ? 'التعديلات' : 'Modifications',
        text: isAr ? 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة. استمرارك في استخدام الخدمة بعد التعديل يعني موافقتك على الشروط المحدثة.' : 'We reserve the right to modify these terms. Material changes will be notified via email or platform notice. Continued use implies acceptance.',
      },
    ],
  },
  {
    icon: Scale,
    title: isAr ? 'الخدمات المقدمة' : 'Services Provided',
    color: 'emerald',
    content: [
      {
        subtitle: isAr ? 'وصف الخدمة' : 'Service Description',
        text: isAr ? 'توفر Hood Trading منصة متكاملة لإدارة المحادثات عبر قنوات متعددة (واتساب، انستقرام، ماسنجر) مع خدمات الذكاء الاصطناعي، وإدارة العملاء (CRM)، والحملات التسويقية، ونظام الحجوزات.' : 'We provide an omnichannel platform (WhatsApp, Instagram, Messenger) with AI, CRM, marketing campaigns, and booking systems.',
      },
      {
        subtitle: isAr ? 'التوفر' : 'Availability',
        text: isAr ? 'نسعى لتوفير الخدمة على مدار الساعة، لكننا لا نضمن عدم انقطاع الخدمة. قد تحدث فترات صيانة مجدولة أو انقطاعات غير متوقعة.' : 'We strive for 24/7 uptime but do not guarantee uninterrupted service due to maintenance or unforeseen outages.',
      },
      {
        subtitle: isAr ? 'الباقات والميزات' : 'Plans & Features',
        text: isAr ? 'تخضع الميزات المتاحة لك لنوع الباقة المشترك بها. يمكنك الاطلاع على تفاصيل كل باقة في صفحة الأسعار.' : 'Available features depend on your chosen subscription plan as detailed on the Pricing page.',
      },
    ],
  },
  {
    icon: CreditCard,
    title: isAr ? 'الدفع والاشتراكات' : 'Payments & Subscriptions',
    color: 'purple',
    content: [
      {
        subtitle: isAr ? 'الفواتير' : 'Billing',
        text: isAr ? 'يتم إصدار الفواتير شهرياً أو سنوياً حسب خطة اشتراكك. تتم معالجة المدفوعات عبر Stripe بشكل آمن.' : 'Invoices are issued monthly or annually. Payments are securely processed via Stripe.',
      },
      {
        subtitle: isAr ? 'التجديد التلقائي' : 'Auto-Renewal',
        text: isAr ? 'يتم تجديد اشتراكك تلقائياً في نهاية كل فترة فوترة ما لم تقم بإلغائه قبل تاريخ التجديد.' : 'Subscriptions auto-renew at the end of the billing cycle unless canceled beforehand.',
      },
      {
        subtitle: isAr ? 'الأسعار' : 'Pricing',
        text: isAr ? 'نحتفظ بالحق في تعديل الأسعار مع إشعار مسبق لا يقل عن 30 يوماً. لن تؤثر تغييرات الأسعار على فترة اشتراكك الحالية.' : 'We reserve the right to modify prices with a 30-day notice. Current subscription periods will not be affected.',
      },
    ],
  },
  {
    icon: Ban,
    title: isAr ? 'الاستخدام المحظور' : 'Prohibited Use',
    color: 'red',
    content: [
      {
        subtitle: isAr ? 'أنشطة غير قانونية' : 'Illegal Activities',
        text: isAr ? 'يُحظر استخدام المنصة لأي أنشطة غير قانونية أو مخالفة للأنظمة المعمول بها في بلد إقامتك.' : 'Using the platform for illegal activities or violating local laws is strictly prohibited.',
      },
      {
        subtitle: isAr ? 'الرسائل المزعجة (Spam)' : 'Spam',
        text: isAr ? 'يُحظر إرسال رسائل غير مرغوب فيها أو رسائل جماعية مزعجة عبر قنوات التواصل المتصلة بالمنصة.' : 'Sending unsolicited or bulk spam messages through connected channels is prohibited.',
      },
      {
        subtitle: isAr ? 'إساءة الاستخدام' : 'Misuse',
        text: isAr ? 'يُحظر محاولة اختراق المنصة، أو التلاعب بالنظام، أو استخدام الخدمة بطريقة تضر بمستخدمين آخرين أو بالبنية التحتية.' : 'Hacking, manipulating the system, or harming the infrastructure or other users is forbidden.',
      },
    ],
  },
  {
    icon: Facebook,
    title: isAr ? 'الامتثال لسياسات منصات Meta' : 'Meta Platform Compliance',
    color: 'blue',
    content: [
      {
        subtitle: isAr ? 'سياسات Meta' : 'Meta Policies',
        text: isAr
          ? 'يقر المستخدم بأن استخدام المنصة عبر Instagram وFacebook Messenger وWhatsApp يخضع لسياسات وشروط منصات Meta. يتحمل المستخدم المسؤولية الكاملة عن الالتزام بسياسات Meta، بما في ذلك سياسات الرسائل، مكافحة الرسائل غير المرغوب فيها (Spam)، وسياسات المحتوى.'
          : 'User acknowledges that using the platform via Instagram, Facebook Messenger, and WhatsApp is subject to Meta platform policies. Users bear full responsibility for complying with Meta policies, including messaging, anti-spam, and content policies.',
      },
      {
        subtitle: isAr ? 'مسؤولية المحتوى' : 'Content Responsibility',
        text: isAr
          ? 'يتحمل المستخدم كامل المسؤولية عن جميع الرسائل، التعليقات، أو المحتوى الذي يتم إرساله عبر المنصة باستخدام حساباته المرتبطة. لا تتحمل Hood Trading أي مسؤولية عن محتوى المستخدم أو أي مخالفات تنشأ عن استخدامه للخدمة.'
          : 'Users bear full responsibility for all messages, comments, or content sent via the platform using linked accounts. Hood Trading is not liable for user content or any violations arising from service usage.',
      },
      {
        subtitle: isAr ? 'تعليق أو إنهاء الخدمة' : 'Service Suspension or Termination',
        text: isAr
          ? 'تحتفظ Hood Trading بالحق في تعليق أو إنهاء حساب أي مستخدم يخالف هذه الشروط أو يستخدم المنصة بشكل يعرّضها لمخاطر قانونية أو تقنية، بما في ذلك مخالفة سياسات مزودي الخدمات مثل Meta.'
          : 'Hood Trading reserves the right to suspend or terminate any account that violates these terms or uses the platform in a way that exposes it to legal or technical risks, including violating service provider policies like Meta.',
      },
      {
        subtitle: isAr ? 'بيانات الطرف الثالث' : 'Third-Party Data',
        text: isAr
          ? 'قد تعتمد بعض ميزات المنصة على بيانات مقدمة من منصات طرف ثالث مثل Meta. لا نتحكم في دقة أو توفر هذه البيانات، وقد تتأثر الخدمة بأي تغييرات تجريها تلك المنصات على واجهات برمجة التطبيقات الخاصة بها.'
          : 'Some features may rely on data provided by third-party platforms like Meta. We do not control the accuracy or availability of this data, and service may be affected by API changes from those platforms.',
      },
    ],
  },
  {
    icon: AlertTriangle,
    title: isAr ? 'إخلاء المسؤولية' : 'Disclaimer',
    color: 'amber',
    content: [
      {
        subtitle: isAr ? 'الخدمة كما هي' : 'Service "As Is"',
        text: isAr ? 'تُقدم الخدمة "كما هي" و"كما هي متاحة" دون أي ضمانات صريحة أو ضمنية بشأن الملاءمة لغرض معين أو عدم الانقطاع.' : 'The service is provided "as is" and "as available" without any explicit or implicit warranties.',
      },
      {
        subtitle: isAr ? 'حدود المسؤولية' : 'Limitation of Liability',
        text: isAr ? 'لن تكون Hood Trading مسؤولة عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام الخدمة.' : 'Hood Trading is not liable for indirect, incidental, or consequential damages arising from service usage.',
      },
    ],
  },
  {
    icon: RefreshCw,
    title: isAr ? 'الإلغاء واسترداد الأموال' : 'Cancellation & Refunds',
    color: 'blue',
    content: [
      {
        subtitle: isAr ? 'إلغاء الاشتراك' : 'Canceling Subscription',
        text: isAr ? 'يمكنك إلغاء اشتراكك في أي وقت. سيظل حسابك نشطاً حتى نهاية فترة الفوترة الحالية.' : 'You can cancel anytime. Your account remains active until the end of the billing period.',
      },
      {
        subtitle: isAr ? 'استرداد الأموال' : 'Refunds',
        text: isAr ? 'لا يتم استرداد أي مبالغ عن الفترة المتبقية من الاشتراك بعد الإلغاء، ما لم ينص القانون المحلي على خلاف ذلك.' : 'No refunds are provided for the remaining subscription period unless required by local law.',
      },
      {
        subtitle: isAr ? 'حذف الحساب' : 'Account Deletion',
        text: isAr ? 'عند حذف حسابك، سيتم حذف جميع بياناتك بشكل نهائي خلال 30 يوماً من تاريخ الطلب.' : 'Deleted accounts will have all data permanently removed within 30 days.',
      },
    ],
  },
  {
    icon: Gavel,
    title: isAr ? 'القانون الحاكم' : 'Governing Law',
    color: 'slate',
    content: [
      {
        subtitle: isAr ? 'الاختصاص القضائي' : 'Jurisdiction',
        text: isAr ? 'تخضع هذه الشروط وتُفسر وفقاً للقوانين المعمول بها. أي نزاع ينشأ عن استخدام الخدمة يخضع للاختصاص القضائي المحدد.' : 'These terms are governed by applicable laws. Disputes are subject to specific jurisdiction.',
      },
      {
        subtitle: isAr ? 'حل النزاعات' : 'Dispute Resolution',
        text: isAr ? 'في حالة وجود أي نزاع، نشجع على التواصل معنا أولاً لمحاولة حل المشكلة ودياً قبل اللجوء إلى الإجراءات القانونية.' : 'In case of disputes, we encourage reaching out to us first for a friendly resolution.',
      },
    ],
  },
  {
    icon: Mail,
    title: isAr ? 'تواصل معنا' : 'Contact Us',
    color: 'rose',
    content: [
      {
        subtitle: isAr ? 'الدعم الفني' : 'Technical Support',
        text: isAr ? 'إذا كانت لديك أي أسئلة حول شروط الاستخدام، يمكنك التواصل مع فريق الدعم الفني عبر المنصة أو البريد الإلكتروني.' : 'If you have questions about the terms, contact our support team via platform or email.',
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
  red: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400', light: 'bg-red-50 dark:bg-red-900/10', border: 'border-red-100 dark:border-red-900/50' },
  slate: { bg: 'bg-slate-200 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', light: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700' },
};

const TermsPage = (props: { params: { locale: string } }) => {
  unstable_setRequestLocale(props.params.locale);
  const isAr = props.params.locale === 'ar';

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir={isAr ? 'rtl' : 'ltr'}>
      <Navbar />

      {/* Hero */}
      <section className="relative pb-16 pt-32 lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(139,92,246,0.07)_0%,transparent_100%)] dark:bg-[radial-gradient(45%_40%_at_50%_0%,rgba(139,92,246,0.15)_0%,transparent_100%)]" />
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-purple-100 shadow-inner dark:bg-purple-900/40">
            <Scale className="size-10 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
            {isAr ? 'شروط الاستخدام' : 'Terms of Use'}
          </h1>
          <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500 dark:text-slate-400">
            {isAr ? 'يرجى قراءة هذه الشروط بعناية قبل استخدام منصة Hood Trading. باستخدامك للمنصة فإنك توافق على الالتزام بهذه الشروط والأحكام.' : 'Please read these terms carefully before using the Hood Trading platform. By using the platform, you agree to be bound by these terms and conditions.'}
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
          <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30 p-10 text-center shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-purple-900/20 md:p-14">
            <h2 className="mb-4 text-2xl font-black">{isAr ? 'هل لديك أسئلة؟' : 'Have Questions?'}</h2>
            <p className="mb-8 font-medium text-slate-500 dark:text-slate-400">{isAr ? 'لا تتردد في التواصل معنا إذا كانت لديك أي استفسارات حول شروط الاستخدام' : 'Feel free to contact us if you have any questions regarding our terms of service.'}</p>
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

export default TermsPage;
