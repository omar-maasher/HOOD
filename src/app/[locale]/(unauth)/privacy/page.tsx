import { ArrowRight, Shield, Eye, Database, Lock, UserCheck, Globe, Mail } from 'lucide-react';
import Link from 'next/link';
import { unstable_setRequestLocale } from 'next-intl/server';

import { Footer } from '@/templates/Footer';
import { Navbar } from '@/templates/Navbar';

export async function generateMetadata() {
    return {
        title: 'سياسة الخصوصية | Hood Trading',
        description: 'سياسة الخصوصية الخاصة بمنصة Hood Trading - تعرف على كيفية جمع واستخدام وحماية بياناتك الشخصية.',
    };
}

const sections = [
    {
        icon: Database,
        title: 'البيانات التي نجمعها',
        color: 'indigo',
        content: [
            {
                subtitle: 'المعلومات الشخصية',
                text: 'عند إنشاء حسابك أو الاشتراك في خدماتنا، قد نجمع الاسم الكامل، عنوان البريد الإلكتروني، رقم الهاتف، واسم النشاط التجاري.',
            },
            {
                subtitle: 'بيانات الاستخدام',
                text: 'نجمع تلقائياً معلومات حول كيفية تفاعلك مع المنصة، مثل الصفحات التي تزورها، والميزات التي تستخدمها، وأوقات الوصول.',
            },
            {
                subtitle: 'بيانات الدفع',
                text: 'تتم معالجة المدفوعات عبر Stripe، ولا نقوم بتخزين بيانات بطاقتك الائتمانية على خوادمنا مباشرة.',
            },
        ],
    },
    {
        icon: Eye,
        title: 'كيف نستخدم بياناتك',
        color: 'emerald',
        content: [
            {
                subtitle: 'تقديم الخدمات',
                text: 'نستخدم بياناتك لتشغيل حسابك، ومعالجة المدفوعات، وتوفير خدمات الذكاء الاصطناعي والأتمتة.',
            },
            {
                subtitle: 'تحسين التجربة',
                text: 'نحلل أنماط الاستخدام لتحسين أداء المنصة وتطوير ميزات جديدة تلبي احتياجاتك.',
            },
            {
                subtitle: 'التواصل معك',
                text: 'قد نرسل لك إشعارات مهمة حول حسابك، وتحديثات الخدمة، والعروض الترويجية (يمكنك إلغاء الاشتراك في أي وقت).',
            },
        ],
    },
    {
        icon: Lock,
        title: 'حماية بياناتك',
        color: 'purple',
        content: [
            {
                subtitle: 'التشفير',
                text: 'نستخدم تشفير SSL/TLS لحماية جميع البيانات المنقولة بين جهازك وخوادمنا.',
            },
            {
                subtitle: 'الأمان السحابي',
                text: 'نستضيف بياناتك على خوادم آمنة مع حماية متقدمة ضد الاختراق ونسخ احتياطية منتظمة.',
            },
            {
                subtitle: 'الوصول المقيد',
                text: 'يقتصر الوصول إلى بياناتك على الموظفين المصرح لهم فقط الذين يحتاجون إليها لتقديم الخدمة.',
            },
        ],
    },
    {
        icon: UserCheck,
        title: 'حقوقك',
        color: 'amber',
        content: [
            {
                subtitle: 'الوصول والتعديل',
                text: 'يحق لك الوصول إلى بياناتك الشخصية وتعديلها في أي وقت من خلال إعدادات حسابك.',
            },
            {
                subtitle: 'حذف البيانات',
                text: 'يمكنك طلب حذف حسابك وجميع بياناتك المرتبطة به بشكل نهائي.',
            },
            {
                subtitle: 'نقل البيانات',
                text: 'يحق لك طلب نسخة من بياناتك بتنسيق قابل للقراءة الآلية.',
            },
        ],
    },
    {
        icon: Globe,
        title: 'ملفات تعريف الارتباط',
        color: 'blue',
        content: [
            {
                subtitle: 'ملفات ضرورية',
                text: 'نستخدم ملفات تعريف ارتباط ضرورية لعمل المنصة بشكل صحيح، مثل الحفاظ على جلسة تسجيل الدخول.',
            },
            {
                subtitle: 'ملفات تحليلية',
                text: 'قد نستخدم ملفات تعريف ارتباط لتحليل الاستخدام وتحسين تجربة المستخدم.',
            },
        ],
    },
    {
        icon: Mail,
        title: 'تواصل معنا',
        color: 'rose',
        content: [
            {
                subtitle: 'الدعم',
                text: 'إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية، يمكنك التواصل معنا عبر البريد الإلكتروني أو من خلال المنصة.',
            },
            {
                subtitle: 'التحديثات',
                text: 'قد نقوم بتحديث سياسة الخصوصية من وقت لآخر. سنخطرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو إشعار داخل المنصة.',
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
};

const PrivacyPage = (props: { params: { locale: string } }) => {
    unstable_setRequestLocale(props.params.locale);
    const isAr = props.params.locale === 'ar';

    return (
        <div className="min-h-screen overflow-x-hidden bg-white font-sans text-slate-900" dir={isAr ? 'rtl' : 'ltr'}>
            <Navbar />

            {/* Hero */}
            <section className="relative pb-16 pt-32 lg:pt-44">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_0%,rgba(99,102,241,0.07)_0%,transparent_100%)]" />
                <div className="container mx-auto max-w-4xl px-4 text-center">
                    <div className="mx-auto mb-8 flex size-20 items-center justify-center rounded-3xl bg-indigo-100 shadow-inner">
                        <Shield className="size-10 text-indigo-600" />
                    </div>
                    <h1 className="mb-6 text-4xl font-black tracking-tight md:text-6xl">
                        سياسة الخصوصية
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-500">
                        نحن في Hood Trading نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك.
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
                    <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-10 text-center shadow-sm md:p-14">
                        <h2 className="mb-4 text-2xl font-black">هل لديك أسئلة؟</h2>
                        <p className="mb-8 font-medium text-slate-500">لا تتردد في التواصل معنا إذا كانت لديك أي استفسارات حول سياسة الخصوصية</p>
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

export default PrivacyPage;
