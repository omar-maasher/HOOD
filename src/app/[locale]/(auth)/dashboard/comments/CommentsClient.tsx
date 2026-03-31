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
  Search,
  Send,
  User,
  Zap,
} from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
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
          <a
            href={postDetails.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group mb-12 flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-primary/20 bg-primary/5 p-4 transition-all hover:bg-primary/10 dark:border-primary/20 dark:hover:bg-primary/20"
          >
            <div className="flex items-center gap-4">
              <div className="size-16 overflow-hidden rounded-xl bg-slate-200 shadow-sm ring-1 ring-white/10 transition-transform group-hover:scale-105 dark:bg-slate-800">
                {postDetails.media_url
                  ? (
                      <Image
                        src={postDetails.media_url}
                        alt="Post content"
                        className="size-full object-cover"
                        width={64}
                        height={64}
                        unoptimized
                      />
                    )
                  : (
                      <div className="size-full bg-gradient-to-tr from-pink-500/20 to-purple-500/20" />
                    )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">
                  {lang.relatedPost}
                </p>
                <p className="mt-1 max-w-[280px] truncate text-sm font-black text-slate-900 dark:text-white">
                  {postDetails.caption || lang.viewOnInstagram}
                </p>
              </div>
            </div>
            <ChevronRight
              size={20}
              className={cn(
                'text-primary/40 transition-transform group-hover:translate-x-1',
                l('rotate-180 group-hover:-translate-x-1', ''),
              )}
            />
          </a>
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
      <div className="relative ml-12 flex max-w-[85%] flex-col rounded-[2rem] rounded-tl-sm border border-primary/20 bg-primary/5 p-2 shadow-inner dark:border-primary/20 dark:bg-primary/5">
        <form onSubmit={handleReply} className="flex flex-1 flex-col">
          <div className="flex items-center gap-2 border-b border-primary/10 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-primary/70 dark:border-primary/10">
            <Reply size={12} />
            {lang.replyAsBusiness}
          </div>

          <textarea
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder={lang.placeholderReply}
            className="min-h-[140px] w-full resize-none border-none bg-transparent p-6 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-600"
          />

          <div className="flex items-center justify-between px-4 pb-4 pt-2">
            <div className="flex gap-2">
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-black/5 hover:text-primary dark:hover:bg-white/5">
                <AtSign size={18} />
              </button>
              <button type="button" className="rounded-full p-2 text-slate-400 hover:bg-black/5 hover:text-primary dark:hover:bg-white/5">
                <MessageCircle size={18} />
              </button>
            </div>
            <Button
              type="submit"
              disabled={!replyText.trim() || sending}
              className="h-12 rounded-xl bg-primary px-8 font-black shadow-xl shadow-orange-950/20 transition-all hover:bg-orange-600 active:scale-95 disabled:opacity-50 dark:shadow-orange-950/40"
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
        <div className="flex h-24 items-center justify-between border-b border-border bg-white/60 px-8 backdrop-blur-xl dark:border-white/5 dark:bg-[#0C0D13]/60">
          <div className="flex items-center gap-4">
            <Avatar text={selectedConv.customerName || 'U'} size="lg" />
            <div>
              <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                {selectedConv.customerName || selectedConv.externalId}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-pink-500/10 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-pink-600 dark:bg-pink-500/20 dark:text-pink-400">
                  <Instagram size={10} />
                  Instagram
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  {lang.commentedOnPost}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary dark:hover:text-white">
              <ExternalLink size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary dark:hover:text-white">
              <MoreVertical size={20} />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-8 py-10">
          <div className="mx-auto max-w-2xl">
            {renderMessagesSection()}
            <div className="h-10" />
            {renderReplyBox()}
          </div>
        </ScrollArea>
      </>
    );
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-2xl transition-all duration-700 dark:border-white/5 dark:bg-[#0A0B10]" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Sidebar - Comments List */}
      <div className="z-10 flex w-[380px] flex-col border-r border-border bg-slate-50/50 dark:border-white/5 dark:bg-[#0D0E14]">
        <div className="space-y-6 p-6 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black tracking-tight text-foreground dark:text-white">
              {t('title')}
            </h2>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={refreshComments}
                className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-white hover:text-primary hover:shadow-sm active:scale-95 dark:text-slate-500 dark:hover:bg-white/5 dark:hover:text-white"
                title={lang.refresh}
              >
                <Zap size={18} className={cn(loading && 'animate-pulse text-primary')} />
              </button>
            </div>
          </div>

          <div className="group relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" size={16} />
            <input
              type="text"
              placeholder={lang.search}
              className="h-12 w-full rounded-2xl border border-border bg-white pl-11 pr-4 text-sm font-bold text-slate-900 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-[#111218] dark:text-white dark:placeholder:text-slate-600"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex rounded-xl border border-border bg-white p-1 shadow-sm dark:border-white/5 dark:bg-[#111218]">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={cn('flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg', activeTab === 'all' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5')}
            >
              {lang.all}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={cn('flex-1 py-2.5 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg', activeTab === 'unread' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5')}
            >
              {lang.unread}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 px-4 pb-4">
          <div className="space-y-2">
            {filteredConversations.length === 0
              ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex size-16 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 dark:border-white/10 dark:bg-white/5">
                      <MessageSquare size={24} className="text-slate-400 dark:text-slate-600" />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white">
                      {lang.noComments}
                    </h4>
                    <p className="mt-1 flex max-w-[200px] text-[11px] font-bold text-slate-500">
                      {lang.filterNoMatch}
                    </p>
                  </div>
                )
              : (
                  filteredConversations.map(conv => (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => setSelectedConvId(conv.id)}
                      className={cn(
                        'group flex w-full flex-col gap-3 rounded-2xl p-4 transition-all duration-300 relative text-start',
                        selectedConvId === conv.id
                          ? 'bg-white dark:bg-white/10 ring-1 ring-border dark:ring-white/20 shadow-xl'
                          : 'hover:bg-white/60 dark:hover:bg-white/[0.04] ring-1 ring-transparent hover:ring-border/50 dark:hover:ring-white/5',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar text={conv.customerName || 'U'} />
                            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-md bg-gradient-to-tr from-pink-600 to-purple-600 text-white shadow-sm ring-2 ring-white dark:ring-[#0D0E14]">
                              <Instagram size={10} />
                            </div>
                          </div>
                          <div>
                            <h4 className="flex items-center gap-1.5 text-[13px] font-black tracking-tight text-slate-900 dark:text-white">
                              {conv.customerName || conv.externalId}
                              {conv.isUnread === 'true' && (
                                <span className="size-1.5 rounded-full bg-primary" />
                              )}
                            </h4>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              @
                              {conv.customerName?.split(' ')[0]?.toLowerCase() || 'user'}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-500">
                          {(() => {
                            if (!conv.lastMessageAt) {
                              return '';
                            }
                            return format(new Date(conv.lastMessageAt), 'MMM d, p', {
                              locale: l(ar, enUS),
                            });
                          })()}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3 dark:border-white/5 dark:bg-black/20">
                        <p className="line-clamp-2 text-xs font-bold leading-relaxed text-slate-600 dark:text-slate-300">
                          {conv.lastMessage}
                        </p>
                      </div>
                    </button>
                  ))
                )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Area - Reply View */}
      <div className="relative flex flex-1 flex-col bg-slate-50/20 dark:bg-transparent">
        {renderMainArea()}
      </div>
    </div>
  );
};
