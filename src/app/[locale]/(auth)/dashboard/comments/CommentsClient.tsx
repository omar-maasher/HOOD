'use client';

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  ExternalLink,
  Filter,
  Instagram,
  Loader2,
  MessageCircle,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

const Avatar = ({ text, size = 'md' }: { text: string; size?: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-14 text-xl',
  };

  return (
    <div className={cn(
      'flex shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white font-black shadow-lg',
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
    initialConversations.filter(c => c.platform === 'instagram'), // Only IG for comments for now
  );
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const t = useTranslations('Comments');

  const filteredConversations = useMemo(() => {
    return conversations.filter(
      c =>
        (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
        || (c.lastMessage || '').toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [conversations, searchQuery]);

  const selectedConv = conversations.find(c => c.id === selectedConvId);

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
      setLoading(false);
    }
  };

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedConv || sending) {
      return;
    }

    setSending(true);
    try {
      // Use the generic sendMessage API - since it's already implemented
      // but for comments we might need a specific 'replyToComment' API later.
      // For now, let's use what the Inbox uses.
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
        setReplyText('');
        // Suggest a success toast or update UI
      }
    } catch (error) {
      console.error('Failed to send reply', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">{t('subtitle')}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-11 gap-2 rounded-xl border-border bg-white dark:border-white/10 dark:bg-white/5"
            onClick={refreshComments}
            disabled={loading}
          >
            <RefreshCw size={18} className={cn(loading && 'animate-spin')} />
            {isAr ? 'تحديث' : 'Refresh'}
          </Button>
          <Button
            className="h-11 gap-2 rounded-xl bg-primary px-6 font-black shadow-lg shadow-primary/20 hover:bg-primary/90"
            onClick={() => router.push('/dashboard/integrations')}
          >
            <Plus size={18} />
            {isAr
              ? 'ربط القنوات'
              : 'Connect Channels'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Comments Sidebar/List */}
        <div className="lg:col-span-4 lg:row-span-1">
          <div className="flex h-[calc(100vh-280px)] flex-col overflow-hidden rounded-[2rem] border border-border bg-white shadow-xl dark:border-white/5 dark:bg-[#111218]">
            <div className="border-b border-border p-5 dark:border-white/5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <Input
                  placeholder={isAr ? 'ابحث في التعليقات...' : 'Search comments...'}
                  className="h-11 rounded-xl border-border bg-slate-50 pl-10 dark:border-white/5 dark:bg-white/[0.02]"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y divide-border dark:divide-white/5">
                {filteredConversations.length === 0
                  ? (
                      <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                        <MessageCircle size={40} className="mb-4 text-slate-400" />
                        <p className="px-4 text-xs font-black uppercase tracking-widest text-slate-500">
                          {isAr
                            ? 'لا توجد تعليقات'
                            : 'Zero Comments Found'}
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
                            'flex w-full flex-col gap-2 p-5 transition-all text-start',
                            selectedConvId === conv.id
                              ? 'bg-slate-50 dark:bg-white/5 border-l-4 border-primary'
                              : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.02]',
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar text={conv.customerName || 'U'} />
                              <span className="max-w-[120px] truncate text-[13px] font-black text-slate-900 dark:text-slate-100">
                                {conv.customerName || conv.externalId}
                              </span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">
                              {conv.lastMessageAt
                                ? format(new Date(conv.lastMessageAt), 'MMM d, p', {
                                  locale: isAr ? ar : enUS,
                                })
                                : ''}
                            </span>
                          </div>
                          <p className="line-clamp-2 text-xs font-medium italic leading-relaxed text-slate-500 dark:text-slate-400">
                            "
                            {conv.lastMessage}
                            "
                          </p>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-1 opacity-60">
                              <Instagram size={10} className="text-pink-500" />
                              <span className="text-[9px] font-black uppercase tracking-tighter">Instagram Comment</span>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Comment View/Reply */}
        <div className="lg:col-span-8 lg:row-span-1">
          {selectedConv
            ? (
                <div className="flex h-[calc(100vh-280px)] flex-col rounded-[2rem] border border-border bg-white shadow-xl dark:border-white/5 dark:bg-[#111218]">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-border px-8 py-6 dark:border-white/5">
                    <div className="flex items-center gap-4">
                      <Avatar text={selectedConv.customerName || 'U'} size="lg" />
                      <div>
                        <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          {selectedConv.customerName || selectedConv.externalId}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <Instagram size={14} className="text-pink-500" />
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                            Instagram Profile Content
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <ExternalLink size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-500">
                        <Trash2 size={20} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <MoreVertical size={20} />
                      </Button>
                    </div>
                  </div>

                  {/* Interaction Content */}
                  <ScrollArea className="flex-1 p-8">
                    <div className="mx-auto max-w-2xl space-y-10">
                      {/* The actual comment */}
                      <div className="relative rounded-[2rem] border border-border bg-slate-50/50 p-8 dark:border-white/5 dark:bg-white/[0.02]">
                        <div className="absolute -top-4 left-8 flex h-8 items-center justify-center rounded-full bg-slate-900 px-4 text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
                          {isAr
                            ? 'تعليق العميل'
                            : 'Customer Comment'}
                        </div>
                        <p className="text-lg font-bold italic leading-relaxed text-slate-800 dark:text-slate-200">
                          "
                          {selectedConv.lastMessage}
                          "
                        </p>
                        <div className="mt-6 flex items-center justify-between border-t border-border pt-6 dark:border-white/5">
                          <span className="text-xs font-medium text-slate-500">
                            {selectedConv.lastMessageAt
                              ? format(new Date(selectedConv.lastMessageAt), 'PPPP p', {
                                locale: isAr ? ar : enUS,
                              })
                              : ''}
                          </span>
                          <Badge variant="outline" className="h-6 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {selectedConv.platform}
                          </Badge>
                        </div>
                      </div>

                      {/* Reply Area */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                          <Send size={12} />
                          {isAr
                            ? 'اكتب ردك المعتمد'
                            : 'Write your official reply'}
                        </div>
                        <form onSubmit={handleReply} className="group relative">
                          <textarea
                            value={replyText}
                            onChange={e => setReplyText(e.target.value)}
                            placeholder={isAr ? 'اكتب ردك الذي سيظهر كتعليق...' : 'Type your reply as a comment...'}
                            className="min-h-[160px] w-full resize-none rounded-3xl border border-border bg-white p-6 text-sm font-bold shadow-inner outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:bg-[#0D0E14] dark:text-slate-200"
                          />
                          <div className="absolute bottom-4 right-4">
                            <Button
                              type="submit"
                              disabled={!replyText.trim() || sending}
                              className="rounded-xl bg-primary px-4 py-6 shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
                            >
                              {sending ? <Loader2 className="animate-spin" /> : <Send size={20} className={isAr ? 'rotate-180' : ''} />}
                              <span className="sr-only">Send Reply</span>
                            </Button>
                          </div>
                        </form>
                        <p className="px-2 text-[10px] font-medium italic text-slate-400">
                          *
                          {' '}
                          {isAr ? 'سيظهر هذا الرد كتعليق مباشرة تحت تعليق العميل على المنشور.' : 'This reply will appear as a direct comment under the customer\'s post comment.'}
                        </p>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              )
            : (
                <div className="flex h-full flex-col items-center justify-center rounded-[2rem] border border-dashed border-border p-12 text-center opacity-40 dark:border-white/10">
                  <div className="mb-6 flex size-24 items-center justify-center rounded-full bg-slate-100 dark:bg-white/5">
                    <Filter size={40} className="text-slate-400" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {isAr
                      ? 'بانتظار تحديد تعليق'
                      : 'Awaiting Selection'}
                  </h3>
                  <p className="mt-2 text-xs font-bold text-slate-500">
                    {isAr
                      ? 'اختر تعليقاً من القائمة الجانبية لعرض التفاصيل والرد عليه.'
                      : 'Select a comment from the list to view details and reply.'}
                  </p>
                </div>
              )}
        </div>
      </div>
    </div>
  );
};
