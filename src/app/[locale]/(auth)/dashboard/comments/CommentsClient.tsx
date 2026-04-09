'use client';

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  AtSign,
  Heart,
  Image as ImageIcon,
  Loader2,
  MessageSquare,
  Reply,
  Send,
  User,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/Helpers';

type PostItem = {
  id: string;
  caption: string;
  mediaUrl?: string;
};

type AllCommentItem = {
  messageId: number;
  conversationId: number;
  text: string | null;
  createdAt: string | Date;
  customerName: string | null;
  externalId: string;
  isUnread: string | null;
  metaMediaId?: string;
  metaCommentId?: string;
  lastReply?: {
    text: string;
    createdAt: string | Date;
    senderType: string;
  } | null;
};

const Avatar = ({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) => {
  const sizes = {
    sm: 'size-8 text-xs rounded-xl',
    md: 'size-10 text-sm rounded-2xl',
    lg: 'size-14 text-xl rounded-2xl',
    xl: 'size-24 text-3xl rounded-[2.5rem]',
  };

  return (
    <div className={cn(
      'flex shrink-0 items-center justify-center font-black shadow-inner shadow-white/10 ring-1 ring-white/10',
      'bg-gradient-to-br from-[#334155] to-[#0F172A] text-[#F8FAFC]',
      sizes[size],
    )}
    >
      {text?.[0]?.toUpperCase() || 'U'}
    </div>
  );
};

export const CommentsClient = ({
  isAr,
  botName,
  initialPostId,
}: {
  isAr: boolean;
  botName: string;
  initialPostId?: string | null;
}) => {
  const t = useTranslations('Comments');

  const [commentsLoading, setCommentsLoading] = useState(true);
  const [allComments, setAllComments] = useState<AllCommentItem[]>([]);
  const [postsDict, setPostsDict] = useState<Record<string, PostItem>>({});

  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState<number | null>(null);

  const l = <T,>(arContent: T, enContent: T): T => (isAr ? arContent : enContent);

  const lang = {
    search: l('ابحث في جميع التعليقات...', 'Search all comments...'),
    noComments: l('لا توجد تعليقات حتى الآن', 'No comments yet'),
    refresh: l('تحديث التعليقات', 'Refresh Comments'),
    reply: l('رد', 'Reply'),
    like: l('إعجاب', 'Like'),
    writeReply: l('اكتب ردك المباشر للعميل...', 'Write direct reply...'),
    send: l('إرسال', 'Send'),
    loadingComments: l('جاري تحميل التعليقات...', 'Loading comments...'),
  };

  const loadEverything = useCallback(async () => {
    setCommentsLoading(true);
    try {
      // 1. Fetch Posts to map mediaId to Post Thumbnail
      const postsRes = await fetch('/api/meta/posts?platform=instagram&limit=100', { cache: 'no-store' });
      const pd: Record<string, PostItem> = {};
      if (postsRes.ok) {
        const pData = await postsRes.json();
        const items = Array.isArray(pData?.items) ? pData.items : [];
        items.forEach((p: any) => {
          if (p.id) {
            pd[p.id.toString()] = { id: p.id, caption: p.caption, mediaUrl: p.mediaUrl };
          }
        });
        setPostsDict(pd);
      }

      // 2. Fetch ALL comments globally
      const comRes = await fetch('/api/comments/all', { cache: 'no-store' });
      if (comRes.ok) {
        const cData = await comRes.json();
        setAllComments(cData.items || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCommentsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEverything();
  }, [loadEverything]);

  useEffect(() => {
    if (initialPostId) {
      setSearchQuery(initialPostId);
    }
  }, [initialPostId]);

  const filteredComments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return allComments;
    }
    return allComments.filter(c =>
      (c.customerName || '').toLowerCase().includes(q)
      || (c.text || '').toLowerCase().includes(q),
    );
  }, [allComments, searchQuery]);

  const handleReply = async (comment: AllCommentItem, e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !comment.metaCommentId || sendingReply) {
      return;
    }

    setSendingReply(comment.messageId);
    try {
      const res = await fetch('/api/inbox/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: comment.conversationId,
          platform: 'instagram',
          externalId: comment.externalId,
          text: replyText,
          commentId: comment.metaCommentId,
        }),
      });

      if (res.ok) {
        setReplyText('');
        setActiveReplyId(null);
        // Optionally inject the sent reply locally so they know it sent, but for now we trust it.
      }
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSendingReply(null);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 pb-24" dir={isAr ? 'rtl' : 'ltr'}>

      {/* ─── UNIFIED HEADER ──────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0F172A]/80 p-8 shadow-2xl backdrop-blur-2xl md:p-12">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background:radial-gradient(circle_at_20%_0%,rgba(139,92,246,0.15),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(236,72,153,0.1),transparent_50%)]"></div>

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex items-center gap-2 rounded-full border border-pink-500/20 bg-pink-500/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-pink-400 shadow-inner">
                <MessageSquare size={14} />
                {isAr ? 'خزانة التعليقات الشاملة' : 'UNIFIED COMMENTS FEED'}
              </span>
            </div>
            <h1 className="bg-gradient-to-br from-[#F8FAFC] to-[#94A3B8] bg-clip-text text-4xl font-extrabold tracking-tight text-transparent md:text-5xl">
              {t('title')}
            </h1>
            <p className="mt-4 max-w-xl text-lg font-medium leading-relaxed text-[#94A3B8]">
              {isAr ? 'شاشة واحدة فقط، لا داعي للدخول لمنشور تلو الآخر. ستجد هنا جميع التعليقات من كل المنشورات جاهزة للرد.' : 'One unified inbox for all your Instagram comments. No need to click into posts anymore.'}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-[#1E293B] px-4 py-2 text-xs font-black text-[#94A3B8]">
              <Zap size={14} className="text-indigo-500" />
              {isAr ? 'البوت:' : 'Bot:'}
              {' '}
              <span className="text-white">{botName}</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            <Button
              onClick={loadEverything}
              className="group relative h-14 overflow-hidden rounded-2xl border-none bg-[#1E293B] px-8 font-bold text-[#94A3B8] shadow-xl hover:bg-[#273548] hover:text-white"
            >
              <Zap size={18} className={cn('mr-2', isAr && 'ml-2 mr-0 text-yellow-400', commentsLoading && 'animate-pulse text-indigo-400')} />
              <span>{lang.refresh}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-[2rem] border border-white/5 bg-[#0F172A]/80 px-6 py-4 shadow-xl backdrop-blur-md">
        <Input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder={lang.search}
          className="h-12 w-full max-w-md rounded-xl border-white/10 bg-[#1E293B]/50 font-semibold text-white placeholder:text-[#64748B] hover:border-white/20 focus:border-primary"
        />
        <div className="text-sm font-black text-[#94A3B8]">
          {allComments.length}
          {' '}
          {isAr ? 'تعليق مكتشف' : 'Comments'}
        </div>
      </div>

      {/* ─── THE MASSIVE FEED ────────────────────────────────────────── */}
      {(() => {
        if (commentsLoading) {
          return (
            <div className="flex flex-col items-center justify-center py-40">
              <Loader2 className="size-16 animate-spin text-primary" />
              <p className="mt-6 text-sm font-black uppercase tracking-widest text-[#64748B]">{lang.loadingComments}</p>
            </div>
          );
        }

        if (filteredComments.length === 0) {
          return (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-white/5 bg-[#0F172A]/40 py-40 text-center shadow-xl">
              <div className="mb-6 flex size-24 items-center justify-center rounded-full border border-dashed border-white/10 bg-white/5">
                <MessageSquare className="size-10 text-[#64748B]" />
              </div>
              <h3 className="text-2xl font-black text-white">{lang.noComments}</h3>
            </div>
          );
        }

        return (
          <div className="flex flex-col gap-6">
            {filteredComments.map((comment) => {
              const name = comment.customerName || comment.externalId;
              const post = comment.metaMediaId ? postsDict[comment.metaMediaId] : null;

              return (
                <Card key={comment.messageId} className="overflow-hidden rounded-[2rem] border-white/5 bg-[#0F172A]/70 shadow-2xl backdrop-blur-md transition-all hover:border-white/10 hover:bg-[#0F172A]">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      {/* Post Context Sidebar (Right side visually if RTL, but let's keep it contextual) */}
                      <div className="flex w-full shrink-0 flex-row gap-4 border-b border-white/5 bg-black/20 p-4 md:w-64 md:flex-col md:border-b-0 md:border-r md:border-white/5 md:p-6">
                        <div className="relative size-16 shrink-0 overflow-hidden rounded-xl border border-white/10 shadow-lg md:aspect-square md:size-auto md:w-full">
                          {post?.mediaUrl
                            ? (
                                <Image src={post.mediaUrl} alt="Post" fill className="object-cover" unoptimized />
                              )
                            : (
                                <div className="flex size-full items-center justify-center bg-[#1E293B]">
                                  <ImageIcon className="size-6 text-[#334155]" />
                                </div>
                              )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <div className="mb-1 text-[10px] font-black uppercase tracking-widest text-pink-400">
                            {isAr ? 'من هذا المنشور' : 'From this post'}
                          </div>
                          <div className="line-clamp-2 text-xs font-semibold leading-relaxed text-[#94A3B8] lg:line-clamp-4">
                            {post?.caption || <span className="italic">No caption</span>}
                          </div>
                        </div>
                      </div>

                      {/* Comment Content */}
                      <div className="flex min-w-0 flex-1 flex-col p-6 md:p-8">
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar text={name} size="lg" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-black text-white">{name}</span>
                                {comment.isUnread === 'true' && <span className="size-2 animate-pulse rounded-full bg-pink-500" />}
                              </div>
                              <div className="text-xs font-bold text-[#64748B]" dir="ltr">
                                {format(new Date(comment.createdAt), 'PP p', { locale: l(ar, enUS) })}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="mb-6 text-base font-semibold leading-relaxed text-gray-200">
                          {comment.text}
                        </p>

                        {/* Bot Reply Preview */}
                        {comment.lastReply && (
                          <div className="mb-6 flex flex-col gap-2 rounded-2xl border border-[#334155]/30 bg-[#1E293B]/30 p-4">
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                'flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest',
                                comment.lastReply.senderType === 'bot' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-[#64748B]/20 text-[#64748B]',
                              )}
                              >
                                {comment.lastReply.senderType === 'bot' ? <Zap size={10} /> : <User size={10} />}
                                {comment.lastReply.senderType === 'bot' ? botName : (isAr ? 'رد المتجر' : 'STORE REPLY')}
                              </span>
                              <span className="text-[9px] font-bold text-[#64748B]">
                                {format(new Date(comment.lastReply.createdAt), 'p', { locale: l(ar, enUS) })}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-[#94A3B8]">
                              {comment.lastReply.text}
                            </p>
                          </div>
                        )}

                        <div className="mt-auto flex items-center gap-4 border-t border-white/10 pt-4">
                          <button type="button" className="group flex items-center gap-1.5 text-xs font-bold text-[#64748B] transition-colors hover:text-pink-500">
                            <Heart size={16} className="transition-transform group-hover:scale-110" />
                            {' '}
                            {lang.like}
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(activeReplyId === comment.messageId ? null : comment.messageId)}
                            className={cn('group flex items-center gap-1.5 text-xs font-bold transition-colors', activeReplyId === comment.messageId ? 'text-primary' : 'text-[#64748B] hover:text-primary')}
                          >
                            <Reply size={16} className={cn('transition-transform', !activeReplyId && 'group-hover:-rotate-12')} />
                            {lang.reply}
                          </button>
                        </div>

                        {/* Expandable Reply Box */}
                        {activeReplyId === comment.messageId && (
                          <form onSubmit={e => handleReply(comment, e)} className="mt-6 flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-2 shadow-inner">
                            <textarea
                              value={replyText}
                              onChange={e => setReplyText(e.target.value)}
                              placeholder={lang.writeReply}
                              className="min-h-[80px] w-full resize-none border-none bg-transparent px-4 py-3 text-sm font-semibold text-white outline-none placeholder:text-[#64748B]"
                            />
                            <div className="flex items-center justify-between px-2 pb-1">
                              <div className="flex gap-2 text-[#64748B]">
                                <button type="button" className="rounded-full p-2 hover:bg-white/5 hover:text-white"><AtSign size={16} /></button>
                              </div>
                              <Button
                                type="submit"
                                disabled={!replyText.trim() || sendingReply === comment.messageId || !comment.metaCommentId}
                                className="h-10 rounded-xl bg-primary px-6 font-black shadow-xl transition-all hover:scale-105 disabled:opacity-50"
                              >
                                {sendingReply === comment.messageId
                                  ? <Loader2 className="size-4 animate-spin" />
                                  : (
                                      <>
                                        {lang.send}
                                        <Send size={14} className={cn('ml-2', isAr && 'ml-0 mr-2 rotate-180')} />
                                      </>
                                    )}
                              </Button>
                            </div>
                          </form>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        );
      })()}
    </div>
  );
};
