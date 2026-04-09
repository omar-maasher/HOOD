'use client';

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
};

const pill = (platform: Platform) => {
  if (platform === 'instagram') {
    return <Badge className="rounded-full bg-pink-600 hover:bg-pink-600">Instagram</Badge>;
  }
  return <Badge className="rounded-full bg-blue-600 hover:bg-blue-600">Facebook</Badge>;
};

export const PostsClient = ({ isAr }: { isAr: boolean }) => {
  const locale = useLocale();
  const t = useTranslations('Posts');

  const [platform, setPlatform] = useState<Platform>('instagram');
  const [items, setItems] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
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
        if (!cancelled) {
          setItems(Array.isArray(data?.items) ? data.items : []);
        }
      } catch {
        if (!cancelled) {
          setItems([]);
          setErrorCode('NETWORK');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
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
      return t('loading');
    }
    if (errorCode === 'INSTAGRAM_NOT_CONNECTED' || errorCode === 'FACEBOOK_NOT_CONNECTED') {
      return t('not_connected');
    }
    if (errorCode) {
      return t('error');
    }
    return t('no_posts');
  })();

  return (
    <div className={`mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 to-muted/30 p-10 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_35%,rgba(236,72,153,0.14),transparent_40%),radial-gradient(circle_at_45%_110%,rgba(16,185,129,0.10),transparent_45%)]"></div>
        <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              {t('badge')}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tighter">{t('title')}</h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <Button
              variant={platform === 'instagram' ? 'default' : 'outline'}
              className={`h-12 w-full rounded-2xl font-black sm:w-auto ${platform === 'instagram' ? 'bg-pink-600 hover:bg-pink-700' : ''}`}
              onClick={() => setPlatform('instagram')}
            >
              Instagram
            </Button>
            <Button
              variant={platform === 'facebook' ? 'default' : 'outline'}
              className={`h-12 w-full rounded-2xl font-black sm:w-auto ${platform === 'facebook' ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
              onClick={() => setPlatform('facebook')}
            >
              Facebook
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={t('search')}
              className="h-12 rounded-2xl bg-background/60 font-semibold shadow-inner"
            />
            <div className="text-sm font-black text-muted-foreground">
              {t('count', { count: filtered.length })}
            </div>
          </div>
        </CardContent>
      </Card>

      {(filtered.length === 0) && (
        <div className="rounded-[2.5rem] border bg-card p-12 text-center shadow-sm">
          <h3 className="text-2xl font-black">{emptyState}</h3>
          {(errorCode === 'INSTAGRAM_NOT_CONNECTED' || errorCode === 'FACEBOOK_NOT_CONNECTED') && (
            <div className="mt-4">
              <Link href="/dashboard/integrations">
                <Button className="h-12 rounded-2xl font-black">{t('go_integrations')}</Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(p => (
            <Card key={p.id} className="group overflow-hidden rounded-[2rem] border-white/20 bg-card/80 shadow-lg shadow-gray-200/20 backdrop-blur-md">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] w-full bg-muted/20">
                  {p.mediaUrl
                    ? (
                        <Image
                          src={p.mediaUrl}
                          alt={p.caption || 'post'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 50vw, 33vw"
                        />
                      )
                    : (
                        <div className="flex h-full items-center justify-center text-sm font-bold text-muted-foreground">
                          {t('no_media')}
                        </div>
                      )}
                  <div className="absolute left-4 top-4">{pill(p.platform)}</div>
                </div>

                <div className="space-y-3 p-6">
                  <div className="line-clamp-3 text-sm font-semibold text-foreground/90">
                    {p.caption || t('no_caption')}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-muted-foreground" dir="ltr">
                      {p.timestamp ? new Date(p.timestamp).toLocaleString(locale) : ''}
                    </span>
                    {p.permalink && (
                      <a href={p.permalink} target="_blank" rel="noreferrer" className="text-xs font-black text-primary hover:underline">
                        {t('open')}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
