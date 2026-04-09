'use client';

import { CalendarHeart, ExternalLink, Facebook, Image as ImageIcon, Instagram, RefreshCcw, Search } from 'lucide-react';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from '@/libs/i18nNavigation';

type Platform = 'instagram' | 'facebook';

type PostItem = {
  id: string;
  platform: Platform;
  caption: string;
  mediaUrl?: string;
  permalink?: string;
  timestamp?: string;
  mediaType?: string;
};

const gradientBg = (platform: Platform) =>
  platform === 'instagram'
    ? 'bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent border-pink-500/20'
    : 'bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent border-blue-500/20';

const pill = (platform: Platform) => {
  if (platform === 'instagram') {
    return (
      <Badge className="rounded-xl bg-gradient-to-tl from-pink-600 to-purple-600 px-3 py-1 font-extrabold uppercase tracking-widest text-[#FFF] shadow-lg shadow-pink-500/30 backdrop-blur-md hover:from-pink-500 hover:to-purple-500">
        <Instagram className="mr-1.5 size-3.5 fill-current" />
        Instagram
      </Badge>
    );
  }
  return (
    <Badge className="rounded-xl bg-gradient-to-tl from-blue-600 to-cyan-600 px-3 py-1 font-extrabold uppercase tracking-widest text-[#FFF] shadow-lg shadow-blue-500/30 backdrop-blur-md hover:from-blue-500 hover:to-cyan-500">
      <Facebook className="mr-1.5 size-3.5 fill-current" />
      Facebook
    </Badge>
  );
};

export const PostsClient = ({ isAr }: { isAr: boolean }) => {
  const locale = useLocale();
  const t = useTranslations('Posts');

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [items, setItems] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const fetchPosts = async () => {
    setLoading(true);
    setErrorCode(null);
    try {
      const res = await fetch(`/api/meta/posts?platform=${platform}&limit=30`, { cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setItems([]);
        setErrorCode(data?.error || 'UNKNOWN');
        return;
      }
      setItems(Array.isArray(data?.items) ? data.items : []);
    } catch {
      setItems([]);
      setErrorCode('NETWORK');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return items;
    }
    return items.filter(p => (p.caption || '').toLowerCase().includes(q));
  }, [items, query]);

  const emptyState = (() => {
    if (loading) {
      return null;
    } // We use skeletons for loading now
    if (errorCode === 'INSTAGRAM_NOT_CONNECTED' || errorCode === 'FACEBOOK_NOT_CONNECTED') {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-6 flex size-24 items-center justify-center rounded-[2rem] bg-gradient-to-tr from-rose-500/20 to-orange-500/20 shadow-inner">
            <Instagram className="size-10 text-rose-500" />
          </div>
          <h3 className="mb-2 text-2xl font-black text-[#E2E8F0]">{t('not_connected')}</h3>
          <p className="mb-8 max-w-sm text-sm font-medium text-[#94A3B8]">
            {isAr ? 'عذراً لا يمكن عرض المنشورات لأن الحساب غير مرتبط لتنشيط الخدمة.' : 'Please connect your account to view and manage your posts.'}
          </p>
          <Link href={`/${locale}/dashboard/integrations`}>
            <Button className="h-14 rounded-2xl bg-gradient-to-r from-primary to-primary/80 px-8 font-black shadow-xl shadow-primary/20 transition-all hover:scale-105">
              {t('go_integrations')}
            </Button>
          </Link>
        </div>
      );
    }
    if (errorCode) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center text-[#E2E8F0]">
          <div className="mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-red-500/10">
            <RefreshCcw className="size-8 text-red-400" />
          </div>
          <h3 className="mb-2 text-xl font-bold">{t('error')}</h3>
          <Button onClick={fetchPosts} variant="outline" className="mt-4 rounded-xl border-white/10 hover:bg-white/5">
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </Button>
        </div>
      );
    }
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-[#94A3B8]">
        <div className="mb-4 flex size-20 items-center justify-center rounded-[2rem] bg-white/5 shadow-inner">
          <ImageIcon className="size-8 opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-[#E2E8F0]">{t('no_posts')}</h3>
      </div>
    );
  })();

  return (
    <div className={`mx-auto flex min-h-screen w-full flex-col gap-8 pb-24 ${isAr ? 'text-right' : 'text-left'}`}>
      {/* ─── HERO HEADER ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0F172A]/80 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-primary shadow-inner">
                {t('badge')}
              </span>
            </div>
            <h1 className="bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-[#94A3B8]">
              {t('subtitle')}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Button
              onClick={() => setPlatform('instagram')}
              className={`group relative h-14 w-full overflow-hidden rounded-2xl border-none font-bold sm:w-auto ${platform === 'instagram' ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-xl shadow-pink-500/25' : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#273548] hover:text-white'}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Instagram className={`size-5 ${platform === 'instagram' ? 'animate-pulse' : ''}`} />
                Instagram
              </span>
            </Button>
            <Button
              onClick={() => setPlatform('facebook')}
              className={`group relative h-14 w-full overflow-hidden rounded-2xl border-none font-bold sm:w-auto ${platform === 'facebook' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xl shadow-blue-500/25' : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#273548] hover:text-white'}`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Facebook className="size-5" />
                Facebook
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* ─── FILTERS & SEARCH ─────────────────────────────────────────────────── */}
      <Card className="rounded-[2rem] border-white/5 bg-[#0F172A]/60 shadow-lg backdrop-blur-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:w-96">
              <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 size-5 -translate-y-1/2 text-[#64748B]`} />
              <Input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={t('search')}
                className={`h-14 rounded-2xl border-white/10 bg-[#1E293B]/50 ${isAr ? 'pr-12' : 'pl-12'} text-base font-semibold text-[#F8FAFC] placeholder:text-[#64748B] hover:border-white/20 focus:border-primary focus:bg-[#1E293B] focus:ring-1 focus:ring-primary`}
              />
            </div>

            <div className="flex items-center gap-3 rounded-full border border-white/5 bg-[#1E293B]/30 px-5 py-2.5 shadow-inner">
              <div className="size-2 animate-pulse rounded-full bg-emerald-500"></div>
              <span className="text-sm font-black uppercase tracking-wide text-[#94A3B8]">
                {t('count', { count: filtered.length })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── CONTENT GRID ─────────────────────────────────────────────────────── */}
      {(() => {
        if (loading) {
          return (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={`skeleton-${i}`} className="flex h-[380px] w-full animate-pulse flex-col overflow-hidden rounded-[2.5rem] bg-[#1E293B]/40 blur-[1px]">
                  <div className="h-3/5 w-full bg-[#334155]/20"></div>
                  <div className="flex-1 space-y-4 p-6">
                    <div className="h-4 w-3/4 rounded-full bg-[#334155]/40"></div>
                    <div className="h-4 w-1/2 rounded-full bg-[#334155]/40"></div>
                    <div className="mt-4 h-3 w-1/4 rounded-full bg-[#334155]/20"></div>
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (filtered.length === 0) {
          return (
            <div className="overflow-hidden rounded-[3rem] border border-white/5 bg-[#0F172A]/40 shadow-2xl backdrop-blur-md">
              {emptyState}
            </div>
          );
        }

        return (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map(p => (
              <Card key={p.id} className={`group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0F172A]/70 shadow-xl backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${platform === 'instagram' ? 'hover:shadow-pink-500/10' : 'hover:shadow-blue-500/10'}`}>

                {/* Media Container */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#090E17]">
                  {p.mediaUrl
                    ? (
                        <Image
                          src={p.mediaUrl}
                          alt={p.caption || 'post'}
                          fill
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      )
                    : (
                        <div className="flex size-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#1E293B] to-[#0F172A]">
                          <ImageIcon className="size-10 text-[#334155]" />
                          <span className="text-xs font-bold text-[#475569]">{t('no_media')}</span>
                        </div>
                      )}

                  {/* Gradient Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"></div>

                  {/* Top Overlay Elements */}
                  <div className="absolute left-4 top-4 z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    {pill(p.platform)}
                  </div>

                  {p.mediaType === 'VIDEO' && (
                    <div className="absolute right-4 top-4 z-10 flex size-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                    </div>
                  )}
                </div>

                {/* Content Panel */}
                <div className={`relative flex flex-1 flex-col border-t border-white/5 p-6 ${gradientBg(p.platform)}`}>
                  <div className="mb-4 flex-1">
                    <p className="line-clamp-3 text-sm font-medium leading-relaxed text-[#CBD5E1]">
                      {p.caption || <span className="font-bold italic text-muted-foreground">{t('no_caption')}</span>}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-col justify-between gap-4 border-t border-white/10 pt-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]" dir="ltr">
                      <CalendarHeart className="size-3.5" />
                      <span>{p.timestamp ? new Date(p.timestamp).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown Date'}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/${locale}/dashboard/comments?postId=${p.id}`}
                        className="group/btn flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary/20 py-2.5 text-xs font-black text-primary transition-all hover:bg-primary/30"
                      >
                        <span>{isAr ? 'إدارة التعليقات' : 'Manage Comments'}</span>
                      </Link>

                      {p.permalink && (
                        <a
                          href={p.permalink}
                          target="_blank"
                          rel="noreferrer"
                          className="group/link flex size-[38px] shrink-0 items-center justify-center rounded-xl bg-white/5 text-xs font-black text-[#F8FAFC] transition-colors hover:bg-white/10"
                          title={t('open')}
                        >
                          <ExternalLink className="size-3.5 transition-transform duration-300 group-hover/link:scale-110" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

              </Card>
            ))}
          </div>
        );
      })()}
    </div>
  );
};
