'use client';

import { format, isToday, isYesterday } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  CheckCheck,
  Filter,
  Instagram,
  Loader2,
  MessageCircle,
  MoreVertical,
  Phone,
  Search,
  Send,
  User,
  Inbox,
  UserCheck,
  Users,
  Plus,
  Settings,
  PhoneCall,
  Flame,
  Star,
  Zap,
  CreditCard,
  Target,
  ChevronRight,
  ChevronLeft,
  X,
  Clock,
  ExternalLink,
  StickyNote
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState, useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');
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
    return conversations.filter(c => {
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
    if (!inputText.trim() || !selectedConv || sending) return;

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
    <div className="flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2.5rem] bg-[#0A0B10] border border-white/5 shadow-2xl transition-all duration-700" dir={isAr ? 'rtl' : 'ltr'}>
      
      {/* Column 1: Slim Filters Sidebar */}
      <div className="flex w-16 flex-col items-center py-6 gap-6 border-x border-white/5 bg-[#0D0E14] z-20">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30 ring-1 ring-white/10 active:scale-90 transition-transform cursor-pointer">
          <Inbox size={20} />
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <button 
            title={isAr ? 'الكل' : 'All'}
            onClick={() => setFilter('all')}
            className={cn("p-2.5 rounded-xl transition-all", filter === 'all' ? "bg-white/10 text-white ring-1 ring-white/5" : "text-slate-500 hover:text-slate-300")}
          >
            <Users size={20} />
          </button>
          <button 
            title={isAr ? 'محادثاتي' : 'Mine'}
            onClick={() => setFilter('mine')}
            className={cn("p-2.5 rounded-xl transition-all", filter === 'mine' ? "bg-white/10 text-white ring-1 ring-white/5" : "text-slate-500 hover:text-slate-300")}
          >
            <UserCheck size={20} />
          </button>
          <button 
            title={isAr ? 'غير المعين' : 'Unassigned'}
            onClick={() => setFilter('unassigned')}
            className={cn("p-2.5 rounded-xl transition-all", filter === 'unassigned' ? "bg-white/10 text-white ring-1 ring-white/5" : "text-slate-500 hover:text-slate-300")}
          >
            <Inbox size={20} className="opacity-50" />
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-4">
            <button 
                onClick={() => router.push('/dashboard/integrations')}
                className="p-2.5 text-slate-500 hover:text-white transition-colors"
                title={isAr ? 'الإعدادات' : 'Integrations'}
            >
                <Plus size={20} />
            </button>
        </div>
      </div>

      {/* Column 2: Conversation List */}
      <div className="flex w-[340px] flex-col border-x border-white/5 bg-[#111218] z-10">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white tracking-tight">{isAr ? 'البريد الوارد' : 'Inbox'}</h2>
            <div className="flex gap-1">
                <button className="p-2 text-slate-500 hover:text-white transition-all active:scale-95"><Search size={16} /></button>
                <button className="p-2 text-slate-500 hover:text-white transition-all active:scale-95"><Filter size={16} /></button>
            </div>
          </div>
          
          <div className="flex border-b border-white/5 p-1 bg-white/[0.02] rounded-xl">
            <button 
                onClick={() => setActiveTab('chats')}
                className={cn("flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg", activeTab === 'chats' ? "bg-white/5 text-primary" : "text-slate-500")}
            >
                {isAr ? 'الدردشات' : 'Chats'}
            </button>
            <button 
                onClick={() => setActiveTab('calls')}
                className={cn("flex-1 py-2 text-[11px] font-black uppercase tracking-widest transition-all rounded-lg", activeTab === 'calls' ? "bg-white/5 text-primary" : "text-slate-500")}
            >
                {isAr ? 'المكالمات' : 'Calls'}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {filteredConversations.length === 0 ? (
                <div className="py-24 text-center">
                    <div className="size-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/5">
                        <MessageCircle size={24} className="text-slate-700" />
                    </div>
                    <p className="text-[11px] font-black uppercase tracking-widest text-slate-600 px-4">
                        {!hasIntegrations 
                          ? (isAr ? 'بانتظار ربط قنوات التواصل' : 'Awaiting Integration')
                          : (isAr ? 'لا توجد محادثات نشطة' : 'Zero Active Chats')}
                    </p>
                </div>
            ) : (
                filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-2xl p-4 transition-all duration-300 relative",
                        selectedConvId === conv.id ? "bg-white/5 ring-1 ring-white/10 shadow-2xl" : "hover:bg-white/[0.02]"
                      )}
                    >
                      <div className="relative shrink-0">
                        <div className={cn(
                            "flex size-12 items-center justify-center rounded-2xl bg-[#0D0E14] border border-white/10 text-lg font-black transition-colors",
                            selectedConvId === conv.id ? "text-primary border-primary/30" : "text-slate-400"
                        )}>
                          {conv.customerName ? conv.customerName[0]?.toUpperCase() : <User size={20} />}
                        </div>
                        <div className="absolute -bottom-1 -right-0.5 rounded-lg bg-[#111218] p-1 shadow-xl ring-1 ring-white/5">
                          {getPlatformIcon(conv.platform, 10)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1 text-start">
                         <div className="flex items-center justify-between mb-1">
                            <h4 className="truncate text-[13px] font-black text-slate-100">{conv.customerName || conv.externalId}</h4>
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">
                                {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'p', { locale: isAr ? ar : enUS }) : ''}
                            </span>
                         </div>
                         <p className="truncate text-xs text-slate-500 font-bold">
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
      <div className="flex flex-1 flex-col bg-[#0A0B10]">
        {selectedConv ? (
          <>
            <div className="flex h-20 items-center justify-between border-b border-white/5 px-8 bg-[#0C0D13]/50 backdrop-blur-md">
              <div className="flex items-center gap-4">
                 <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary text-xl font-black border border-primary/20 shadow-inner">
                    {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={24} />}
                 </div>
                 <div>
                    <h3 className="text-base font-black text-white tracking-tighter leading-tight">{selectedConv.customerName || selectedConv.externalId}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-glow shadow-emerald-500/50" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{selectedConv.platform}</span>
                        <div className="mx-2 h-3 w-px bg-white/5" />
                        <Badge variant="outline" className="h-5 px-2 bg-white/5 border-white/10 text-[9px] font-black text-slate-400 rounded-lg">
                            {selectedConv.status?.toUpperCase() || 'OPEN'}
                        </Badge>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowLifecycle(!showLifecycle)}
                    className={cn("text-slate-400 hover:text-white transition-transform active:scale-90", !showLifecycle && "rotate-180")}
                 >
                    <ChevronRight size={20} />
                 </Button>
                 <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white"><MoreVertical size={20} /></Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-8 space-y-8">
               <div className="flex flex-col gap-8">
                  {loadingMessages ? (
                    <div className="space-y-6">
                        <Skeleton className="h-12 w-64 rounded-2xl bg-white/5" />
                        <Skeleton className="h-12 w-48 rounded-2xl bg-white/5 self-end" />
                    </div>
                  ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={cn("flex flex-col group", msg.direction === 'outgoing' ? "items-end" : "items-start")}>
                            <div className={cn(
                                "max-w-[65%] rounded-3xl p-5 text-sm font-bold leading-relaxed shadow-2xl transition-all duration-300",
                                msg.direction === 'outgoing' 
                                    ? "bg-primary text-white rounded-tr-none shadow-orange-950/40" 
                                    : "bg-white/5 text-slate-200 rounded-tl-none border border-white/10 hover:bg-white/[0.08]"
                            )}>
                                {msg.text}
                            </div>
                            <div className="flex items-center gap-2 mt-2 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-black text-slate-700 uppercase">
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

            <div className="p-8 border-t border-white/5 bg-[#0C0D13]/30">
               <form onSubmit={handleSendMessage} className="flex gap-4 items-center">
                  <div className="flex-1 relative group">
                    <input 
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isAr ? 'اكتب ردك هنا...' : 'Type a reply...'}
                      className="relative w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-sm font-bold text-slate-200 outline-none focus:border-primary transition-all placeholder:text-slate-700 shadow-inner"
                    />
                  </div>
                  <Button type="submit" className="relative h-14 w-14 rounded-2xl bg-primary hover:bg-orange-600 shadow-2xl shadow-orange-950/50 active:scale-95 transition-all">
                    {sending ? <Loader2 className="animate-spin size-6" /> : <Send size={22} className={isAr ? 'rotate-180' : ''} />}
                  </Button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center p-12 text-center relative overflow-hidden">
            <div className="absolute -top-40 -right-40 size-96 rounded-full bg-primary/10 blur-[120px]" />
            <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-blue-600/10 blur-[120px]" />

            <div className="relative mb-12 group">
              <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full group-hover:bg-primary/30 transition-all" />
              <div className="relative flex items-center justify-center scale-x-[-1] animate-bounce duration-[4000ms]">
                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-12 rounded-[4rem] shadow-2xl skew-y-3">
                   <div className="flex gap-6 items-end">
                      <div className="size-20 rounded-full bg-white/10 border border-white/5 flex items-center justify-center">
                         <div className="size-4 rounded-full bg-slate-700/50 animate-pulse" />
                         <div className="size-4 rounded-full bg-slate-700/50 mx-1.5 animate-pulse delay-75" />
                         <div className="size-4 rounded-full bg-slate-700/50 animate-pulse delay-150" />
                      </div>
                      <div className="size-32 rounded-[2.5rem] bg-primary/20 border border-primary/20 shadow-inner overflow-hidden">
                        <div className="h-full w-full bg-gradient-to-br from-indigo-500/20 to-transparent" />
                      </div>
                   </div>
                </div>
              </div>
            </div>
            
            {!hasIntegrations ? (
              <>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">{isAr ? 'يبدو أن صندوق الوارد فارغ' : 'Inbox is empty'}</h3>
                <p className="max-w-xs text-sm text-slate-500 font-bold mb-10 leading-relaxed">
                    {isAr ? 'لا توجد محادثات نشطة حالياً. يمكنك البدء بربط قنوات التواصل الاجتماعي الخاصة بك.' : 'Currently no active conversations. You can start by connecting your social channels.'}
                </p>
                <Button 
                    onClick={() => router.push('/dashboard/integrations')}
                    className="rounded-2xl h-14 px-10 bg-primary hover:bg-orange-600 font-black shadow-2xl shadow-orange-950/60 transition-all hover:scale-105 active:scale-95"
                >
                    {isAr ? 'ربط القنوات' : 'Connect Channels'}
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-black text-white mb-3 tracking-tighter">{isAr ? 'بانتظار وصول رسائل' : 'Awaiting Messages'}</h3>
                <p className="max-w-xs text-sm text-slate-500 font-bold mb-10 leading-relaxed">
                    {isAr ? 'القنوات مربوطة بنجاح، ستظهر المحادثات هنا بمجرد وصول أول رسالة من عملائك.' : 'Channels are connected successfully. Conversations will appear here once your customers send a message.'}
                </p>
                <div className="flex items-center gap-2 px-6 py-2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-black uppercase tracking-widest">
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            "flex h-full flex-col border-r border-white/5 bg-[#0D0E14] transition-all duration-500",
            selectedConv ? "w-[300px]" : "w-0 p-0 overflow-hidden opacity-0"
        )}>
           <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{isAr ? 'ملف العميل' : 'Profile'}</h3>
                <button onClick={() => setShowLifecycle(false)} className="text-slate-600 hover:text-white"><X size={16} /></button>
           </div>

           <ScrollArea className="flex-1">
             {selectedConv && (
                <div className="p-6 space-y-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="size-24 rounded-[2.5rem] bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 flex items-center justify-center text-3xl font-black text-slate-200 mb-4 shadow-2xl">
                            {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={40} />}
                        </div>
                        <h4 className="text-sm font-black text-white">{selectedConv.customerName || isAr ? 'عميل نشط' : 'Active Customer'}</h4>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">{selectedConv.externalId}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase">{isAr ? 'المنصة' : 'Platform'}</span>
                                <Badge className="bg-indigo-500/10 text-indigo-400 border-none rounded-lg text-[9px]">{selectedConv.platform}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-500 uppercase">{isAr ? 'المسؤول' : 'Agent'}</span>
                                <span className="text-[10px] font-bold text-slate-300">{selectedConv.assignedTo || 'Unassigned'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 px-1">{isAr ? 'دورة الحياة' : 'Lifecycle'}</h3>
                    <div className="space-y-2">
                        {[
                            { id: 'new', label: 'New Lead', icon: <Target size={16} />, color: 'blue' },
                            { id: 'hot', label: 'Hot Lead', icon: <Flame size={16} />, color: 'orange' },
                            { id: 'payment', label: 'Payment', icon: <CreditCard size={16} />, color: 'emerald' },
                            { id: 'customer', label: 'Customer', icon: <Star size={16} />, color: 'purple' },
                        ].map((stage) => (
                            <button
                                key={stage.id}
                                onClick={() => updateLifecycle(selectedConv.id, stage.id as any)}
                                className={cn(
                                    "flex w-full items-center justify-between rounded-xl p-3 border transition-all active:scale-95",
                                    selectedConv.lifecycle === stage.id 
                                        ? `bg-${stage.color}-500/10 border-${stage.color}-500/30 text-${stage.color}-400`
                                        : "bg-white/[0.02] border-white/5 text-slate-500 hover:bg-white/5 hover:text-slate-300"
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

                    <div className="pt-4 space-y-2">
                        <Button variant="outline" className="w-full h-11 rounded-xl bg-white/5 border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all">
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
