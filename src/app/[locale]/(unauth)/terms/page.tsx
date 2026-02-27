import { ArrowRight, Scale, FileText, CreditCard, Ban, AlertTriangle, RefreshCw, Gavel, Mail } from 'lucide-react';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
    return {
        title: 'شروط الاستخدام | Hood Trading',
        description: 'شروط استخدام منصة Hood Trading - تعرف على الشروط والأحكام المنظمة لاستخدام خدماتنا.',
    };
}

const sections = [
    {
        icon: FileText,
        title: 'مقدمة',
        color: 'indigo',
        content: [
            {
                subtitle: 'قبول الشروط',
                text: 'باستخدامك لمنصة Hood Trading فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.',
            },
            {
                subtitle: 'التعديلات',
                text: 'نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إخطارك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة. استمرارك في استخدام الخدمة بعد التعديل يعني موافقتك على الشروط المحدثة.',
            },
        ],
    },
    {
        icon: Scale,
        title: 'الخدمات المقدمة',
        color: 'emerald',
        content: [
            {
                subtitle: 'وصف الخدمة',
                text: 'توفر Hood Trading منصة متكاملة لإدارة المحادثات عبر قنوات متعددة (واتساب، انستقرام، ماسنجر) مع خدمات الذكاء الاصطناعي، وإدارة العملاء (CRM)، والحملات التسويقية، ونظام الحجوزات.',
            },
            {
                subtitle: 'التوفر',
                text: 'نسعى لتوفير الخدمة على مدار الساعة، لكننا لا نضمن عدم انقطاع الخدمة. قد تحدث فترات صيانة مجدولة أو انقطاعات غير متوقعة.',
            },
            {
                subtitle: 'الباقات والميزات',
                text: 'تخضع الميزات المتاحة لك لنوع الباقة المشترك بها. يمكنك الاطلاع على تفاصيل كل باقة في صفحة الأسعار.',
            },
        ],
    },
    {
        icon: CreditCard,
        title: 'الدفع والاشتراكات',
        color: 'purple',
        content: [
            {
                subtitle: 'الفواتير',
                text: 'يتم إصدار الفواتير شهرياً أو سنوياً حسب خطة اشتراكك. تتم معالجة المدفوعات عبر Stripe بشكل آمن.',
            },
            {
                subtitle: 'التجديد التلقائي',
                text: 'يتم تجديد اشتراكك تلقائياً في نهاية كل فترة فوترة ما لم تقم بإلغائه قبل تاريخ التجديد.',
            },
            {
                subtitle: 'الأسعار',
                text: 'نحتفظ بالحق في تعديل الأسعار مع إشعار مسبق لا يقل عن 30 يوماً. لن تؤثر تغييرات الأسعار على فترة اشتراكك الحالية.',
            },
        ],
    },
    {
        icon: Ban,
        title: 'الاستخدام المحظور',
        color: 'red',
        content: [
            {
                subtitle: 'أنشطة غير قانونية',
                text: 'يُحظر استخدام المنصة لأي أنشطة غير قانونية أو مخالفة للأنظمة المعمول بها في بلد إقامتك.',
            },
            {
                subtitle: 'الرسائل المزعجة (Spam)',
                text: 'يُحظر إرسال رسائل غير مرغوب فيها أو رسائل جماعية مزعجة عبر قنوات التواصل المتصلة بالمنصة.',
            },
            {
                subtitle: 'إساءة الاستخدام',
                text: 'يُحظر محاولة اختراق المنصة، أو التلاعب بالنظام، أو استخدام الخدمة بطريقة تضر بمستخدمين آخرين أو بالبنية التحتية.',
            },
        ],
    },
    {
        icon: AlertTriangle,
        title: 'إخلاء المسؤولية',
        color: 'amber',
        content: [
            {
                subtitle: 'الخدمة كما هي',
                text: 'تُقدم الخدمة "كما هي" و"كما هي متاحة" دون أي ضمانات صريحة أو ضمنية بشأن الملاءمة لغرض معين أو عدم الانقطاع.',
            },
            {
                subtitle: 'حدود المسؤولية',
                text: 'لن تكون Hood Trading مسؤولة عن أي أضرار غير مباشرة أو عرضية أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام الخدمة.',
            },
        ],
    },
    {
        icon: RefreshCw,
        title: 'الإلغاء واسترداد الأموال',
        color: 'blue',
        content: [
            {
                subtitle: 'إلغاء الاشتراك',
                text: 'يمكنك إلغاء اشتراكك في أي وقت. سيظل حسابك نشطاً حتى نهاية فترة الفوترة الحالية.',
            },
            {
                subtitle: 'استرداد الأموال',
                text: 'لا يتم استرداد أي مبالغ عن الفترة المتبقية من الاشتراك بعد الإلغاء، ما لم ينص القانون المحلي على خلاف ذلك.',
            },
            {
                subtitle: 'حذف الحساب',
                text: 'عند حذف حسابك، سيتم حذف جميع بياناتك بشكل نهائي خلال 30 يوماً من تاريخ الطلب.',
            },
        ],
    },
    {
        icon: Gavel,
        title: 'القانون الحاكم',
        color: 'slate',
        content: [
            {
                subtitle: 'الاختصاص القضائي',
                text: 'تخضع هذه الشروط وتُفسر وفقاً للقوانين المعمول بها. أي نزاع ينشأ عن استخدام الخدمة يخضع للاختصاص القضائي المحدد.',
            },
            {
                subtitle: 'حل النزاعات',
                text: 'في حالة وجود أي نزاع، نشجع على التواصل معنا أولاً لمحاولة حل المشكلة ودياً قبل اللجوء إلى الإجراءات القانونية.',
            },
        ],
    },
    {
        icon: Mail,
        title: 'تواصل معنا',
        color: 'rose',
        content: [
            {
                subtitle: 'الدعم الفني',
                text: 'إذا كانت لديك أي أسئلة حول شروط الاستخدام، يمكنك التواصل مع فريق الدعم الفني عبر المنصة أو البريد الإلكتروني.',
            },
        ],
    },
];

const colorMap: Record<string, { bg: string; text: string; light: string; border: string }> = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', light: 'bg-indigo-50', border: 'border-indigo-100' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-100' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-100' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-100' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-100' },
    rose: { bg: 'bg-rose-100', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-100' },
    red: { bg: 'bg-red-100', text: 'text-red-600', light: 'bg-red-50', border: 'border-red-100' },
    slate: { bg: 'bg-slate-200', text: 'text-slate-700', light: 'bg-slate-50', border: 'border-slate-200' },
};

const TermsPage = (props: { params: { locale: string } }) => {
    unstable_setRequestLocale(props.params.locale);
    const isAr = props.params.locale === 'ar';

    return (
        <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Hero */}
            <section className="relative pb-16 pt-32 lg:pt-44">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(139,92,246,0.07)_0%,transparent_100%)]" />
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-purple-100 shadow-inner">
                        <Scale className="size-10 text-purple-600" />
                    </div>
                    <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
                        شروط الاستخدام
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
                        يرجى قراءة هذه الشروط بعناية قبل استخدام منصة Hood Trading. باستخدامك للمنصة فإنك توافق على الالتزام بهذه الشروط والأحكام.
                    </p>
                    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-sm font-bold text-slate-500">
                        آخر تحديث: فبراير 2026
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="pb-32">
                <div className="container mx-auto max-w-4xl space-y-10 px-4">
                    {sections.map((section, idx) => {
                        const colors = colorMap[section.color] ?? colorMap.indigo!;
                        const Icon = section.icon;
                        return (
                            <div
                                key={idx}
                                className={`rounded-[2.5rem] border ${colors.border} bg-white p-8 shadow-sm transition-all hover:shadow-xl md:p-12`}
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
                                            <p className="font-medium leading-relaxed text-slate-600">{item.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* CTA */}
                    <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-slate-50 to-purple-50/30 p-10 text-center shadow-sm md:p-14">
                        <h2 className="mb-4 text-2xl font-black">هل لديك أسئلة؟</h2>
                        <p className="mb-8 font-medium text-slate-500">لا تتردد في التواصل معنا إذا كانت لديك أي استفسارات حول شروط الاستخدام</p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                        >
                            العودة للرئيسية
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
