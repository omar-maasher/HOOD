'use client';

import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  CheckCheck,
  ChevronRight,
  CreditCard,
  ExternalLink,
  Filter,
  Flame,
  Inbox,
  Instagram,
  Loader2,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Star,
  Target,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
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
  assignedTo?: string | null;
  lifecycle?: 'new' | 'hot' | 'payment' | 'customer';
};

type Message = {
  id: number;
  direction: 'incoming' | 'outgoing';
  text: string | null;
  type: string;
  mediaUrl: string | null;
  createdAt: Date | string;
};

export const InboxClient = ({ initialConversations, isAr, hasIntegrations }: { initialConversations: Conversation[]; isAr: boolean; hasIntegrations: boolean }) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'calls'>('chats');
  const [filter, setFilter] = useState<'all' | 'mine' | 'unassigned'>('all');
  const [showLifecycle, setShowLifecycle] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  // Advanced Filtering Logic
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      const matchesSearch = (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) || (c.externalId || '').includes(searchQuery);
      const matchesFilter = filter === 'all'
        ? true
        : filter === 'mine'
          ? c.assignedTo === 'me'
          : c.assignedTo === null || c.assignedTo === undefined;

      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchQuery, filter]);

  const loadMessages = async (convId: number) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/inbox/messages?conversationId=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Failed to load messages', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    }
  }, [selectedConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedConv || sending) {
      return;
    }

    setSending(true);
    const textToSend = inputText.trim();
    setInputText('');

    try {
      const res = await fetch('/api/inbox/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: selectedConv.id,
          platform: selectedConv.platform,
          externalId: selectedConv.externalId,
          text: textToSend,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, data.message]);
        setConversations(prev => prev.map(c =>
          c.id === selectedConvId
            ? { ...c, lastMessage: textToSend, lastMessageAt: new Date().toISOString() }
            : c,
        ));
      }
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  };

  const updateLifecycle = (convId: number, stage: Conversation['lifecycle']) => {
    setConversations(prev => prev.map(c => c.id === convId ? { ...c, lifecycle: stage } : c));
  };

  const getPlatformIcon = (platform: string, size = 14) => {
    switch (platform) {
      case 'whatsapp': return <Phone size={size} className="text-emerald-500" />;
      case 'instagram': return <Instagram size={size} className="text-pink-500" />;
      case 'messenger': return <MessageCircle size={size} className="text-blue-500" />;
      default: return <MessageCircle size={size} />;
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2.5rem] border border-border bg-white shadow-2xl transition-all duration-700 dark:border-white/5 dark:bg-[#0A0B10]" dir={isAr ? 'rtl' : 'ltr'}>

      {/* Column 1: Slim Filters Sidebar */}
      <div className="z-20 flex w-16 flex-col items-center gap-6 border-x border-border bg-slate-50 py-6 dark:border-white/5 dark:bg-[#0D0E14]">
        <div className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-white/10 transition-transform active:scale-90">
          <Inbox size={20} />
        </div>
        <div className="mt-4 flex flex-col gap-4">
          <button
            title={isAr ? 'الكل' : 'All'}
            onClick={() => setFilter('all')}
            className={cn('p-2.5 rounded-xl transition-all', filter === 'all' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white ring-1 ring-primary/20 dark:ring-white/5' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5')}
          >
            <Users size={20} />
          </button>
          <button
            title={isAr ? 'محادثاتي' : 'Mine'}
            onClick={() => setFilter('mine')}
            className={cn('p-2.5 rounded-xl transition-all', filter === 'mine' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white ring-1 ring-primary/20 dark:ring-white/5' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5')}
          >
            <UserCheck size={20} />
          </button>
          <button
            title={isAr ? 'غير المعين' : 'Unassigned'}
            onClick={() => setFilter('unassigned')}
            className={cn('p-2.5 rounded-xl transition-all', filter === 'unassigned' ? 'bg-primary/10 dark:bg-white/10 text-primary dark:text-white ring-1 ring-primary/20 dark:ring-white/5' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5')}
          >
            <Inbox size={20} className="opacity-50" />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
          <button
            onClick={() => router.push('/dashboard/integrations')}
            className="p-2.5 text-slate-500 transition-colors hover:text-white"
            title={isAr ? 'الإعدادات' : 'Integrations'}
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Column 2: Conversation List */}
      <div className="z-10 flex w-[340px] flex-col border-x border-border bg-white dark:border-white/5 dark:bg-[#111218]">
        <div className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black tracking-tight text-foreground dark:text-white">{isAr ? 'البريد الوارد' : 'Inbox'}</h2>
            <div className="flex gap-1">
              <button className="p-2 text-slate-400 transition-all hover:text-primary active:scale-95 dark:text-slate-500 dark:hover:text-white"><Search size={16} /></button>
              <button className="p-2 text-slate-400 transition-all hover:text-primary active:scale-95 dark:text-slate-500 dark:hover:text-white"><Filter size={16} /></button>
            </div>
          </div>

          <div className="flex rounded-xl border-b border-border bg-slate-50 p-1 dark:border-white/5 dark:bg-white/[0.02]">
            <button
              onClick={() => setActiveTab('chats')}
              className={cn('flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg', activeTab === 'chats' ? 'bg-white dark:bg-white/5 text-primary shadow-sm' : 'text-slate-400 dark:text-slate-500')}
            >
              {isAr ? 'الدردشات' : 'Chats'}
            </button>
            <button
              onClick={() => setActiveTab('calls')}
              className={cn('flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg', activeTab === 'calls' ? 'bg-white dark:bg-white/5 text-primary shadow-sm' : 'text-slate-400 dark:text-slate-500')}
            >
              {isAr ? 'المكالمات' : 'Calls'}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.length === 0
              ? (
                  <div className="py-24 text-center">
                    <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full border border-white/5 bg-white/5">
                      <MessageCircle size={24} className="text-slate-700" />
                    </div>
                    <p className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-600">
                      {!hasIntegrations
                        ? (isAr ? 'بانتظار ربط قنوات التواصل' : 'Awaiting Integration')
                        : (isAr ? 'لا توجد محادثات نشطة' : 'Zero Active Chats')}
                    </p>
                  </div>
                )
              : (
                  filteredConversations.map(conv => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={cn(
                        'group flex w-full items-center gap-3 rounded-2xl p-4 transition-all duration-300 relative',
                        selectedConvId === conv.id ? 'bg-slate-50 dark:bg-white/5 ring-1 ring-border dark:ring-white/10 shadow-lg dark:shadow-2xl' : 'hover:bg-slate-50/50 dark:hover:bg-white/[0.02]',
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn(
                          'flex size-12 items-center justify-center rounded-2xl bg-white dark:bg-[#0D0E14] border border-border dark:border-white/10 text-lg font-black transition-colors',
                          selectedConvId === conv.id ? 'text-primary border-primary/30' : 'text-slate-400',
                        )}
                        >
                          {conv.customerName ? conv.customerName[0]?.toUpperCase() : <User size={20} />}
                        </div>
                        <div className="absolute -bottom-1 -right-0.5 rounded-lg bg-white p-1 shadow-xl ring-1 ring-border dark:bg-[#111218] dark:ring-white/5">
                          {getPlatformIcon(conv.platform, 10)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 text-start">
                        <div className="mb-1 flex items-center justify-between">
                          <h4 className="truncate text-[13px] font-black text-slate-900 dark:text-slate-100">{conv.customerName || conv.externalId}</h4>
                          <span className="text-[9px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-600">
                            {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'p', { locale: isAr ? ar : enUS }) : ''}
                          </span>
                        </div>
                        <p className="truncate text-xs font-bold text-slate-500">
                          {conv.lastMessage || (isAr ? 'بدء محادثة جديدة' : 'New interaction')}
                        </p>
                      </div>
                    </button>
                  ))
                )}
          </div>
        </ScrollArea>
      </div>

      {/* Column 3: Main Chat View */}
      <div className="flex flex-1 flex-col bg-slate-50 dark:bg-[#0A0B10]">
        {selectedConv
          ? (
              <>
                <div className="flex h-20 items-center justify-between border-b border-border bg-white/80 px-8 backdrop-blur-md dark:border-white/5 dark:bg-[#0C0D13]/50">
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-xl font-black text-primary shadow-inner">
                      {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={24} />}
                    </div>
                    <div>
                      <h3 className="text-base font-black leading-tight tracking-tighter text-slate-900 dark:text-white">{selectedConv.customerName || selectedConv.externalId}</h3>
                      <div className="mt-0.5 flex items-center gap-2">
                        <span className="shadow-glow size-2 animate-pulse rounded-full bg-emerald-500 shadow-emerald-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{selectedConv.platform}</span>
                        <div className="mx-2 h-3 w-px bg-border dark:bg-white/5" />
                        <Badge variant="outline" className="h-5 rounded-lg border-border bg-slate-100 px-2 text-[9px] font-black text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
                          {selectedConv.status?.toUpperCase() || 'OPEN'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowLifecycle(!showLifecycle)}
                      className={cn('p-2 text-slate-400 dark:text-slate-500 hover:text-primary dark:hover:text-white transition-all active:scale-90', !showLifecycle && 'rotate-180')}
                    >
                      <ChevronRight size={20} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-primary dark:text-slate-500 dark:hover:text-white"><MoreVertical size={20} /></button>
                  </div>
                </div>

                <ScrollArea className="flex-1 space-y-8 p-8">
                  <div className="flex flex-col gap-8">
                    {loadingMessages
                      ? (
                          <div className="space-y-6">
                            <Skeleton className="h-12 w-64 rounded-2xl bg-white/5" />
                            <Skeleton className="h-12 w-48 self-end rounded-2xl bg-white/5" />
                          </div>
                        )
                      : (
                          messages.map(msg => (
                            <div key={msg.id} className={cn('flex flex-col group', msg.direction === 'outgoing' ? 'items-end' : 'items-start')}>
                              <div className={cn(
                                'max-w-[65%] rounded-3xl p-5 text-sm font-bold leading-relaxed shadow-sm dark:shadow-2xl transition-all duration-300',
                                msg.direction === 'outgoing'
                                  ? 'bg-primary text-white rounded-tr-none shadow-orange-950/20 dark:shadow-orange-950/40'
                                  : 'bg-white dark:bg-white/5 text-slate-800 dark:text-slate-200 rounded-tl-none border border-border dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.08]',
                              )}
                              >
                                {msg.text}
                              </div>
                              <div className="mt-2 flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100">
                                <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-700">
                                  {format(new Date(msg.createdAt), 'p', { locale: isAr ? ar : enUS })}
                                </span>
                                {msg.direction === 'outgoing' && <CheckCheck size={12} className="text-primary" />}
                              </div>
                            </div>
                          ))
                        )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="border-t border-border bg-white p-8 dark:border-white/5 dark:bg-[#0C0D13]/30">
                  <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                    <div className="group relative flex-1">
                      <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        placeholder={isAr ? 'اكتب ردك هنا...' : 'Type a reply...'}
                        className="relative h-14 w-full rounded-2xl border border-border bg-slate-50 px-6 text-sm font-bold text-slate-900 shadow-inner outline-none transition-all placeholder:text-slate-400 focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:placeholder:text-slate-700"
                      />
                    </div>
                    <Button type="submit" className="relative size-14 rounded-2xl bg-primary shadow-xl shadow-orange-950/20 transition-all hover:bg-orange-600 active:scale-95 dark:shadow-2xl dark:shadow-orange-950/50">
                      {sending ? <Loader2 className="size-6 animate-spin" /> : <Send size={22} className={isAr ? 'rotate-180' : ''} />}
                    </Button>
                  </form>
                </div>
              </>
            )
          : (
              <div className="relative flex h-full flex-col items-center justify-center overflow-hidden p-12 text-center">
                <div className="absolute -right-40 -top-40 size-96 rounded-full bg-primary/5 blur-[120px]" />
                <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-600/5 blur-[120px]" />

                <div className="group relative mb-12">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px] transition-all group-hover:bg-primary/30 dark:opacity-50" />
                  <div className="duration-[4000ms] relative flex -scale-x-100 animate-bounce items-center justify-center">
                    <div className="skew-y-3 rounded-[4rem] border border-border bg-white p-12 shadow-2xl backdrop-blur-3xl dark:border-white/10 dark:bg-white/5">
                      <div className="flex items-end gap-6">
                        <div className="flex size-20 items-center justify-center rounded-full border border-border bg-slate-50 dark:border-white/5 dark:bg-white/10">
                          <div className="size-4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700/50" />
                          <div className="mx-1.5 size-4 animate-pulse rounded-full bg-slate-200 delay-75 dark:bg-slate-700/50" />
                          <div className="size-4 animate-pulse rounded-full bg-slate-200 delay-150 dark:bg-slate-700/50" />
                        </div>
                        <div className="size-32 overflow-hidden rounded-[2.5rem] border border-primary/20 bg-primary/10 shadow-inner dark:bg-primary/20">
                          <div className="size-full bg-gradient-to-br from-indigo-500/20 to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!hasIntegrations
                  ? (
                      <>
                        <h3 className="mb-3 text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{isAr ? 'يبدو أن صندوق الوارد فارغ' : 'Inbox is empty'}</h3>
                        <p className="mb-10 max-w-xs text-sm font-bold leading-relaxed text-slate-400 dark:text-slate-500">
                          {isAr ? 'لا توجد محادثات نشطة حالياً. يمكنك البدء بربط قنوات التواصل الاجتماعي الخاصة بك.' : 'Currently no active conversations. You can start by connecting your social channels.'}
                        </p>
                        <Button
                          onClick={() => router.push('/dashboard/integrations')}
                          className="h-14 rounded-2xl bg-primary px-10 font-black shadow-2xl shadow-orange-950/60 transition-all hover:scale-105 hover:bg-orange-600 active:scale-95"
                        >
                          {isAr ? 'ربط القنوات' : 'Connect Channels'}
                        </Button>
                      </>
                    )
                  : (
                      <>
                        <h3 className="mb-3 text-3xl font-black tracking-tighter text-slate-900 dark:text-white">{isAr ? 'بانتظار وصول رسائل' : 'Awaiting Messages'}</h3>
                        <p className="mb-10 max-w-xs text-sm font-bold leading-relaxed text-slate-400 dark:text-slate-500">
                          {isAr ? 'القنوات مربوطة بنجاح، ستظهر المحادثات هنا بمجرد وصول أول رسالة من عملائك.' : 'Channels are connected successfully. Conversations will appear here once your customers send a message.'}
                        </p>
                        <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                          {isAr ? 'القنوات متصلة' : 'Channels Connected'}
                        </div>
                      </>
                    )}
              </div>
            )}
      </div>

      {/* Column 4: Customer Profile & Lifecycle */}
      {showLifecycle && (
        <div className={cn(
          'flex h-full flex-col border-r border-border dark:border-white/5 bg-slate-50 dark:bg-[#0D0E14] transition-all duration-500',
          selectedConv ? 'w-[300px]' : 'w-0 p-0 overflow-hidden opacity-0',
        )}
        >
          <div className="flex items-center justify-between border-b border-border p-6 dark:border-white/5">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{isAr ? 'ملف العميل' : 'Profile'}</h3>
            <button onClick={() => setShowLifecycle(false)} className="text-slate-400 hover:text-foreground dark:text-slate-600"><X size={16} /></button>
          </div>

          <ScrollArea className="flex-1">
            {selectedConv && (
              <div className="space-y-8 p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex size-24 items-center justify-center rounded-[2.5rem] border border-border bg-white text-3xl font-black text-slate-900 shadow-xl dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-800 dark:to-slate-900 dark:text-slate-200 dark:shadow-2xl">
                    {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={40} />}
                  </div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white">{selectedConv.customerName || (isAr ? 'عميل نشط' : 'Active Customer')}</h4>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{selectedConv.externalId}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 rounded-2xl border border-border bg-white p-4 shadow-sm dark:border-white/5 dark:bg-white/[0.03]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">{isAr ? 'المنصة' : 'Platform'}</span>
                      <Badge className="rounded-lg border-none bg-indigo-500/10 text-[9px] text-indigo-600 dark:text-indigo-400">{selectedConv.platform}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500">{isAr ? 'المسؤول' : 'Agent'}</span>
                      <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{selectedConv.assignedTo || 'Unassigned'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 px-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{isAr ? 'دورة الحياة' : 'Lifecycle'}</h3>
                  <div className="space-y-2">
                    {[
                      { id: 'new', label: 'New Lead', icon: <Target size={16} />, color: 'blue' },
                      { id: 'hot', label: 'Hot Lead', icon: <Flame size={16} />, color: 'orange' },
                      { id: 'payment', label: 'Payment', icon: <CreditCard size={16} />, color: 'emerald' },
                      { id: 'customer', label: 'Customer', icon: <Star size={16} />, color: 'purple' },
                    ].map(stage => (
                      <button
                        key={stage.id}
                        onClick={() => updateLifecycle(selectedConv.id, stage.id as any)}
                        className={cn(
                          'flex w-full items-center justify-between rounded-xl p-3 border transition-all active:scale-95',
                          selectedConv.lifecycle === stage.id
                            ? `bg-${stage.color}-500/10 border-${stage.color}-500/30 text-${stage.color}-500 dark:text-${stage.color}-400`
                            : 'bg-white dark:bg-white/[0.02] border-border dark:border-white/5 text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-primary dark:hover:text-slate-300 shadow-sm dark:shadow-none',
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {stage.icon}
                          <span className="text-[11px] font-black tracking-tight">{stage.label}</span>
                        </div>
                        {selectedConv.lifecycle === stage.id && <Zap size={12} className="animate-pulse" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <Button variant="outline" className="h-11 w-full rounded-xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 transition-all hover:bg-white/10 hover:text-white">
                    {isAr ? 'فتح في الـ CRM' : 'Open in CRM'}
                    <ExternalLink size={12} className="ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
