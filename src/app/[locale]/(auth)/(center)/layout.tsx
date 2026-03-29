import { auth } from '@clerk/nextjs/server';
import { Sparkles, TrendingUp } from 'lucide-react';
import Image from 'next/image';
import { redirect } from 'next/navigation';

export default async function AuthLayout(props: { children: React.ReactNode; params: { locale: string } }) {
  const { userId } = await auth();
  const isAr = props.params.locale === 'ar';

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side: Premium Branding (Desktop Only) */}
      <div className="relative hidden w-1/2 flex-col items-center justify-center overflow-hidden bg-black lg:flex">
        {/* Glow Effects */}
        <div className="absolute left-1/2 top-1/2 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F15A24]/10 blur-[120px]" />

        <div className="relative z-10 flex flex-col items-center p-12 text-center">
          <div className="mb-12 flex animate-fade-in items-center gap-4 text-white">
            <div className="flex size-20 items-center justify-center rounded-[2.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
              <Image src="/logo.png" alt="Logo" width={60} height={60} className="scale-110" />
            </div>
            <div className="text-start">
              <h1 className="text-4xl font-black uppercase tracking-tighter">Hood</h1>
              <h2 className="-mt-1 text-2xl font-black uppercase leading-none tracking-tighter text-[#F15A24]">Trading</h2>
            </div>
          </div>

          <div className="max-w-md space-y-6 text-center">
            <h3 className="animate-fade-in text-5xl font-black leading-[1.1] tracking-tighter text-white">
              {isAr ? 'حوّل محادثاتك إلى' : 'Turn your conversations into'}
              {' '}
              <span className="text-[#F15A24]">{isAr ? 'أرباح' : 'Profits'}</span>
              {' '}
              {isAr ? 'فورية.' : 'instantly.'}
            </h3>
            <p className="animate-fade-in text-xl font-medium text-slate-400" style={{ animationDelay: '100ms' }}>
              {isAr ? 'ذكاء اصطناعي يخدم عملائك، يغلق صفقاتك، ويطور تجارتك 24/7 دون تدخل بشري.' : 'AI that serves your customers, closes your deals, and develops your business 24/7 without human intervention.'}
            </p>

            <div className="flex gap-4 pt-6">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md">
                <TrendingUp className="size-5 text-emerald-500" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-200">{isAr ? '+45% مبيعات' : '+45% Sales'}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-md">
                <Sparkles className="size-5 text-amber-500" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-200">{isAr ? 'ذكاء خارق' : 'AI Power'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Background Element */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_20%,rgba(241,90,36,0.05)_0%,transparent_50%)]" />
      </div>

      {/* Right side: Focused Form */}
      <div className="relative flex flex-1 flex-col items-center justify-center bg-[#0a0a0a] p-6">
        <div className="absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -right-40 -top-40 size-96 rounded-full bg-[#F15A24]/10 blur-[100px]" />
        </div>

        <div className="relative z-10 w-full max-w-lg lg:scale-110">
          {props.children}
        </div>

        {/* Footer Text */}
        <div className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
          © 2026 Hood Trading System • AI Powered
        </div>
      </div>
    </div>
  );
}
