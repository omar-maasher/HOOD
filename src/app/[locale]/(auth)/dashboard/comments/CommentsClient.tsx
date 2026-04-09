'use client';

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  AtSign,
  ChevronRight,
  ExternalLink,
  Heart,
  Instagram,
  Loader2,
  MessageCircle,
  MessageSquare,
  MoreVertical,
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/utils/Helpers';

type Conversation = {
  id: number;
  platform: string;
  externalId: string;
  customerName: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | string | null;
  isUnread: string | null;
  status?: 'open' | 'closed' | 'pending';
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
      'flex shrink-0 items-center justify-center font-black shadow-inner shadow-white/10 ring-1 ring-border dark:ring-white/10',
      'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700 dark:from-slate-800 dark:to-[#0D0E14] dark:text-slate-200',
      sizes[size],
    )}
    >
      {text[0]?.toUpperCase()}
    </div>
  );
};

export const CommentsClient = ({
  initialConversations,
  isAr,
}: {
  initialConversations: Conversation[];
  isAr: boolean;
}) => {
  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations.filter(c => c.platform === 'instagram'),
  );
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [postDetails, setPostDetails] = useState<any>(null);
  const [commentId, setCommentId] = useState<string | null>(null);
  const t = useTranslations('Comments');

  const l = <T,>(arContent: T, enContent: T): T => {
    if (isAr) {
      return arContent;
    }
    return enContent;
  };

  const lang = {
    refresh: l('تحديث', 'Refresh'),
    search: l('ابحث في التعليقات...', 'Search comments...'),
    all: l('الكل', 'All'),
    unread: l('غير المقروءة', 'Unread'),
    noComments: l('لا توجد تعليقات', 'No comments found'),
    filterNoMatch: l('لم نتمكن من العثور على أي تعليقات تطابق هذا الفلتر.', 'We couldn\'t find any comments matching this filter.'),
    commentedOnPost: l('علق على منشورك', 'Commented on your post'),
    loadingComments: l('جاري تحميل التعليق...', 'Loading comment details...'),
    relatedPost: l('المنشور المرتبط', 'Related Post'),
    viewOnInstagram: l('مشاهدة المنشور على إنستقرام', 'View post on Instagram'),
    like: l('إعجاب', 'Like'),
    reply: l('رد', 'Reply'),
    noData: l('لا توجد بيانات متاحة لهذا التعليق', 'No data available for this comment'),
    botReply: l('رد البوت', 'AI REPLY'),
    agentReply: l('رد المتجر', 'REPLY'),
    replyAsBusiness: l('رد كحساب المتجر', 'Reply as Business'),
    placeholderReply: l('اكتب ردك المباشر للعميل...', 'Write your direct reply...'),
    postReply: l('نشر الرد', 'Post Reply'),
    selectStart: l('اختر تعليقاً للبدء', 'Select a comment to start'),
    browseSidebar: l('استعرض التعليقات من القائمة الجانبية لعرض التفاصيل والرد عليها.', 'Browse comments from the sidebar to view details and reply to them.'),
  };

  const filteredConversations = useMemo(() => {
    return conversations
      .filter(
        c =>
          (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
          || (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .filter(c => activeTab === 'all' || c.isUnread === 'true');
  }, [conversations, searchQuery, activeTab]);

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const loadMessages = useCallback(async (convId: number) => {
    setLoadingMessages(true);
    setPostDetails(null);
    setCommentId(null);
    try {
      const res = await fetch(`/api/inbox/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);

        // Try to fetch post details if mediaId exists in metadata
        const incomingMsg = data.find((m: any) => m.direction === 'incoming');
        if (incomingMsg?.metadata) {
          try {
            const meta = JSON.parse(incomingMsg.metadata);
            if (meta.commentId) {
              setCommentId(meta.commentId.toString());
            }
            if (meta.mediaId) {
              const postRes = await fetch(`/api/meta/media?mediaId=${meta.mediaId}`);
              if (postRes.ok) {
                const postData = await postRes.json();
                setPostDetails(postData);
              }
            }
          } catch {
            // Silently fail
          }
        }
      }
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    } else {
      setMessages([]);
    }
  }, [selectedConvId, loadMessages]);

  const refreshComments = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inbox/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data.filter((c: any) => c.platform === 'instagram'));
      }
    } catch (error) {
      console.error('Failed to refresh comments', error);
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv || sending) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/inbox/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          platform: selectedConv.platform,
          externalId: selectedConv.externalId,
          text: replyText,
          // For Instagram comments we need commentId to reply publicly on the comment.
          commentId,
        }),
      });

      if (res.ok) {
        await res.json();
        setReplyText('');
        if (selectedConvId) {
          loadMessages(selectedConvId);
        }
      }
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSending(false);
    }
  };

  const renderOriginalComment = () => {
    const originalMsg = messages.find(m => m.direction === 'incoming');
    if (!originalMsg) {
      return (
        <div className="mb-8 p-10 text-center opacity-40">
          {lang.noData}
        </div>
      );
    }

    return (
      <div className="relative mb-12 ml-6">
        <div className="absolute -left-6 bottom-[-40px] top-8 w-px bg-border dark:bg-white/10" />
        <div className="relative flex max-w-[85%] flex-col rounded-[2rem] rounded-tl-sm border border-border bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111218] dark:shadow-2xl">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {selectedConv?.customerName}
              </span>
              <span className="text-[11px] font-bold text-slate-400">
                @
                {selectedConv?.customerName?.split(' ')[0]?.toLowerCase() || 'user'}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {originalMsg.createdAt
                ? format(new Date(originalMsg.createdAt), 'PP p', {
                  locale: l(ar, enUS),
                })
                : ''}
            </span>
          </div>
          <p className="text-base font-bold leading-relaxed text-slate-700 dark:text-slate-300">
            {originalMsg.text}
          </p>
          <div className="mt-4 flex items-center gap-4 text-slate-400">
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:text-pink-500"
            >
              <Heart size={14} />
              {' '}
              {lang.like}
            </button>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs font-bold transition-colors hover:text-primary"
            >
              <Reply size={14} />
              {' '}
              {lang.reply}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderReplies = () => {
    const originalMsg = messages.find(m => m.direction === 'incoming');
    return messages
      .filter(m => m.id !== originalMsg?.id)
      .map(msg => (
        <div key={msg.id} className="group relative ml-12">
          <div className="absolute inset-y-[-24px] -left-6 w-px bg-border dark:bg-white/10" />
          <div className={cn(
            'relative flex max-w-[85%] flex-col rounded-[1.5rem] p-4 border transition-all',
            msg.direction === 'outgoing'
              ? 'bg-slate-50 dark:bg-white/5 border-border dark:border-white/10 ml-0'
              : 'bg-white dark:bg-slate-900/50 border-border dark:border-white/10',
          )}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase',
                  msg.senderType === 'bot'
                    ? 'bg-indigo-500/10 text-indigo-500'
                    : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-slate-400',
                )}
                >
                  {msg.senderType === 'bot' ? <Zap size={10} /> : <User size={10} />}
                  {msg.senderType === 'bot'
                    ? lang.botReply
                    : lang.agentReply}
                </span>
              </div>
              <span className="text-[9px] font-bold text-slate-400">
                {format(new Date(msg.createdAt), 'p', {
                  locale: l(ar, enUS),
                })}
              </span>
            </div>
            <p className="text-[13px] font-bold leading-relaxed text-slate-600 dark:text-slate-300">
              {msg.text}
            </p>
          </div>
        </div>
      ));
  };

  const renderMessagesSection = () => {
    if (loadingMessages) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="mt-4 text-xs font-black uppercase text-slate-400">
            {lang.loadingComments}
          </p>
        </div>
      );
    }

    return (
      <>
        {/* Related Post Context */}
        {postDetails && (
          <Card className="mb-8 overflow-hidden rounded-[2rem] border-primary/15 bg-primary/5 shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 gap-0 md:grid-cols-[220px_1fr]">
                <div className="relative aspect-[4/3] w-full bg-muted md:aspect-auto md:h-full">
                  {postDetails.media_url
                    ? (
                        <Image
                          src={postDetails.media_url}
                          alt="Post content"
                          className="size-full object-cover"
                          fill
                          sizes="(max-width: 768px) 100vw, 220px"
                          unoptimized
                        />
                      )
                    : (
                        <div className="flex size-full items-center justify-center bg-gradient-to-tr from-pink-500/20 to-purple-500/20 text-xs font-bold text-muted-foreground">
                          {lang.relatedPost}
                        </div>
                      )}
                </div>
                <div className="flex flex-col gap-3 p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                        {lang.relatedPost}
                      </div>
                      <div className="mt-1 line-clamp-2 text-sm font-black text-foreground">
                        {postDetails.caption || lang.viewOnInstagram}
                      </div>
                    </div>
                    {postDetails.permalink && (
                      <a
                        href={postDetails.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-2xl border border-primary/15 bg-background px-4 py-2 text-xs font-black text-primary hover:bg-primary/5"
                      >
                        <ExternalLink size={14} />
                        {lang.viewOnInstagram}
                      </a>
                    )}
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/60 p-4 text-xs font-bold text-muted-foreground">
                    {isAr ? 'هذا التعليق جاء من هذا المنشور.' : 'This comment came from this post.'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* The Original Comment */}
        {renderOriginalComment()}

        {/* All Replies (Bot/Agent) */}
        <div className="space-y-6">
          {renderReplies()}
        </div>
      </>
    );
  };

  const renderReplyBox = () => {
    return (
      <div className="relative flex w-full flex-col rounded-[1.75rem] border border-border bg-card shadow-sm">
        <form onSubmit={handleReply} className="flex flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Reply size={12} className="text-primary" />
              {lang.replyAsBusiness}
            </div>
            <div className="flex items-center gap-1">
              <button type="button" className="rounded-2xl p-2 text-muted-foreground hover:bg-muted/30 hover:text-primary">
                <AtSign size={18} />
              </button>
              <button type="button" className="rounded-2xl p-2 text-muted-foreground hover:bg-muted/30 hover:text-primary">
                <MessageCircle size={18} />
              </button>
            </div>
          </div>

          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={lang.placeholderReply}
            className="min-h-[110px] w-full resize-none border-none bg-transparent p-5 text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
          />

          <div className="flex items-center justify-end gap-2 px-5 pb-5 pt-2">
            <Button
              type="submit"
              disabled={!replyText.trim() || sending}
              className="h-12 rounded-2xl bg-primary px-8 font-black shadow-xl shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {sending
                ? <Loader2 className="animate-spin" />
                : (
                    <>
                      {lang.postReply}
                      <Send size={16} className={cn('ml-2', isAr && 'mr-2 ml-0 rotate-180')} />
                    </>
                  )}
            </Button>
          </div>
        </form>
      </div>
    );
  };

  const renderMainArea = () => {
    if (!selectedConv) {
      return (
        <div className="relative flex h-full flex-col items-center justify-center p-12 text-center">
          <div className="absolute -right-40 -top-40 size-96 rounded-full bg-pink-500/5 blur-[120px]" />
          <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-primary/5 blur-[120px]" />
          <div className="group relative mb-8">
            <div className="absolute inset-0 rounded-full bg-slate-200/50 blur-3xl transition-all group-hover:bg-slate-300/50 dark:bg-white/5 dark:group-hover:bg-white/10" />
            <div className="relative flex size-32 items-center justify-center rounded-[2.5rem] border border-border bg-white shadow-2xl dark:border-white/10 dark:bg-[#111218]">
              <MessageSquare size={48} className="text-slate-300 transition-all group-hover:scale-110 group-hover:text-primary dark:text-slate-600" />
            </div>
          </div>
          <h3 className="mb-3 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            {lang.selectStart}
          </h3>
          <p className="max-w-[280px] text-sm font-bold text-slate-500">
            {lang.browseSidebar}
          </p>
        </div>
      );
    }

    return (
      <>
        <div className="flex h-20 items-center justify-between border-b border-border bg-background/70 px-6 backdrop-blur-xl md:h-24 md:px-8">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setSelectedConvId(null)}
              className={cn(
                'mr-1 inline-flex size-11 items-center justify-center rounded-2xl text-muted-foreground transition-colors hover:bg-black/5 hover:text-primary dark:hover:bg-white/5 md:hidden',
                isAr && 'mr-0 ml-1 rotate-180',
              )}
              aria-label={isAr ? 'رجوع' : 'Back'}
            >
              <ChevronRight size={20} />
            </button>
            <Avatar text={selectedConv.customerName || 'U'} size="lg" />
            <div>
              <h3 className="text-lg font-black tracking-tight text-foreground">
                {selectedConv.customerName || selectedConv.externalId}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-pink-500/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
                  <Instagram size={10} />
                  Instagram
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  {lang.commentedOnPost}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <ExternalLink size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1 flex-col">
          <ScrollArea className="min-h-0 flex-1 px-4 py-6 md:px-8 md:py-10">
            <div className="mx-auto flex max-w-2xl flex-col gap-6 pb-44">
              {renderMessagesSection()}
            </div>
          </ScrollArea>

          <div className="sticky bottom-0 border-t border-border bg-background/85 p-4 backdrop-blur-xl md:p-6">
            <div className="mx-auto max-w-2xl">
              {renderReplyBox()}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 to-muted/30 p-10 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.18),transparent_40%),radial-gradient(circle_at_80%_35%,rgba(236,72,153,0.14),transparent_40%),radial-gradient(circle_at_45%_110%,rgba(16,185,129,0.10),transparent_45%)]"></div>
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              {isAr ? 'التعليقات' : 'COMMENTS'}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tighter">{t('title')}</h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-muted-foreground">{t('subtitle')}</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <Button onClick={refreshComments} variant="outline" className="h-12 w-full rounded-2xl font-black sm:w-auto">
              <Zap size={18} className={cn('mr-2', isAr && 'ml-2 mr-0', loading && 'animate-pulse text-primary')} />
              {lang.refresh}
            </Button>
          </div>
        </div>
      </div>

      <Card className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl">
        <CardContent className="p-0">
          <div className="grid h-[calc(100vh-260px)] min-h-0 grid-cols-1 md:grid-cols-[380px_1fr]">
            <div className={cn('min-h-0 border-b border-border bg-slate-50/50 dark:bg-[#0D0E14] md:border-b-0 md:border-r', selectedConv ? 'hidden md:block' : 'block')}>
              <div className="space-y-4 p-6">
                <Input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={lang.search}
                  className="h-12 rounded-2xl bg-background font-semibold shadow-inner"
                />
                <div className="flex rounded-2xl border border-border bg-background p-1 shadow-sm">
                  <button
                    type="button"
                    onClick={() => setActiveTab('all')}
                    className={cn(
                      'flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-widest transition-all',
                      activeTab === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40',
                    )}
                  >
                    {lang.all}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('unread')}
                    className={cn(
                      'flex-1 rounded-xl py-2.5 text-[11px] font-black uppercase tracking-widest transition-all',
                      activeTab === 'unread' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/40',
                    )}
                  >
                    {lang.unread}
                  </button>
                </div>
              </div>

              <ScrollArea className="h-[calc(100vh-260px-104px)] px-4 pb-4">
                <div className="space-y-2">
                  {filteredConversations.length === 0
                    ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="mb-4 flex size-16 items-center justify-center rounded-[2rem] border border-dashed border-border bg-background">
                            <MessageSquare size={24} className="text-muted-foreground" />
                          </div>
                          <h4 className="text-sm font-black text-foreground">{lang.noComments}</h4>
                          <p className="mt-1 max-w-[220px] text-[11px] font-bold text-muted-foreground">{lang.filterNoMatch}</p>
                        </div>
                      )
                    : (
                        filteredConversations.map(conv => (
                          <button
                            key={conv.id}
                            type="button"
                            onClick={() => setSelectedConvId(conv.id)}
                            className={cn(
                              'group flex w-full flex-col gap-3 rounded-[1.5rem] p-4 text-start transition-all',
                              selectedConvId === conv.id
                                ? 'bg-background ring-1 ring-border shadow-lg'
                                : 'hover:bg-background/70 ring-1 ring-transparent hover:ring-border/50',
                            )}
                          >
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex min-w-0 items-center gap-3">
                                <div className="relative">
                                  <Avatar text={conv.customerName || 'U'} />
                                  <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-md bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-sm ring-2 ring-background">
                                    <Instagram size={10} />
                                  </div>
                                </div>
                                <div className="min-w-0">
                                  <h4 className="flex items-center gap-2 truncate text-[13px] font-black tracking-tight text-foreground">
                                    <span className="truncate">{conv.customerName || conv.externalId}</span>
                                    {conv.isUnread === 'true' && <span className="size-1.5 rounded-full bg-primary" />}
                                  </h4>
                                  <span className="block truncate text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                    @
                                    {conv.customerName?.split(' ')[0]?.toLowerCase() || 'user'}
                                  </span>
                                </div>
                              </div>
                              <span className="shrink-0 text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                {(() => {
                                  if (!conv.lastMessageAt) {
                                    return '';
                                  }
                                  return format(new Date(conv.lastMessageAt), 'MMM d, p', { locale: l(ar, enUS) });
                                })()}
                              </span>
                            </div>
                            <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
                              <p className="line-clamp-2 text-xs font-bold leading-relaxed text-foreground/80">
                                {conv.lastMessage}
                              </p>
                            </div>
                          </button>
                        ))
                      )}
                </div>
              </ScrollArea>
            </div>

            <div className={cn('relative min-h-0 bg-background', selectedConv ? 'block' : 'hidden md:block')}>
              <div className="md:hidden">
                <div className="flex items-center gap-2 border-b border-border bg-background/80 px-4 py-3 backdrop-blur">
                  <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setSelectedConvId(null)} aria-label={isAr ? 'رجوع' : 'Back'}>
                    <ChevronRight className={cn('size-5', isAr && 'rotate-180')} />
                  </Button>
                  <div className="text-sm font-black text-foreground">{isAr ? 'التفاصيل' : 'Details'}</div>
                </div>
              </div>
              <div className="flex h-full min-h-0 flex-col">{renderMainArea()}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
