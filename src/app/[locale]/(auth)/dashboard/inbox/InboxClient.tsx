'use client';

import { format, isToday, isYesterday } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import {
  ArrowRight,
  CheckCheck,
  CalendarCheck,
  Filter,
  Instagram,
  Loader2,
  MessageCircle,
  MoreVertical,
  Phone,
  Search,
  Send,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

type Conversation = {
  id: number;
  platform: string;
  externalId: string;
  customerName: string | null;
  lastMessage: string | null;
  lastMessageAt: Date | string | null;
  isUnread: string | null;
};

type Message = {
  id: number;
  direction: 'incoming' | 'outgoing';
  text: string | null;
  type: string;
  mediaUrl: string | null;
  createdAt: Date | string;
};

export const InboxClient = ({ initialConversations, isAr }: { initialConversations: Conversation[]; isAr: boolean }) => {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConvId, setSelectedConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showDetails, setShowDetails] = useState(true);
  const router = useRouter();

  // Keep conversations fresh if page data changes (via router.refresh)
  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const selectedConv = conversations.find(c => c.id === selectedConvId) as Conversation & { status?: string };

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

  // Fetch messages when a conversation is selected and start polling
  useEffect(() => {
    if (selectedConvId) {
      loadMessages(selectedConvId);
    }

    // Polling interval for live updates without page refresh
    const interval = setInterval(() => {
      // 1. Refresh conversations sidebar invisibly
      router.refresh();

      // 2. Refresh active chat messages invisibly
      if (selectedConvId) {
        fetch(`/api/inbox/messages?conversationId=${selectedConvId}`)
          .then(res => res.ok ? res.json() : null)
          .then((data) => {
            if (data) {
              setMessages(data);
            }
          })
          .catch(err => console.error('Background message fetch failed', err));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedConvId, router]);

  // Auto-scroll to bottom of messages
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

        // Update last message in sidebar
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

  const getPlatformIcon = (platform: string, size = 14) => {
    switch (platform) {
      case 'whatsapp': return <div className="rounded-lg bg-emerald-100 p-1.5 text-emerald-600"><Phone size={size} /></div>;
      case 'instagram': return <div className="rounded-lg bg-pink-100 p-1.5 text-pink-600"><Instagram size={size} /></div>;
      case 'messenger': return <div className="rounded-lg bg-blue-100 p-1.5 text-blue-600"><MessageCircle size={size} /></div>;
      default: return <MessageCircle size={size} />;
    }
  };

  const filteredConversations = conversations.filter(c =>
    (c.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
    || (c.externalId || '').includes(searchQuery),
  );

  const containerDirClass = 'flex-row';
  const sidebarVisibilityClass = selectedConvId ? 'hidden md:flex' : 'flex';
  const arrowClass = isAr ? '' : 'rotate-180';
  const handleCloseConv = () => setSelectedConvId(null);

  return (
    <div className={`flex h-[calc(100vh-140px)] w-full overflow-hidden rounded-[2.5rem] border bg-background shadow-2xl ${containerDirClass}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sidebar - Conversations List (Column 1) */}
      <div className={`flex w-full flex-col border-x transition-all duration-300 md:w-[320px] lg:w-[380px] ${sidebarVisibilityClass}`}>
        <div className="space-y-4 border-b p-6 bg-muted/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black">{isAr ? 'المحادثات' : 'Conversations'}</h2>
            <Button type="button" variant="ghost" size="icon" className="rounded-xl hover:bg-muted-foreground/10">
              <Filter size={18} />
            </Button>
          </div>
          <div className="relative">
            <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 size-4 -translate-y-1/2 text-muted-foreground`} />
            <Input
              placeholder={isAr ? 'ابحث عن عميل...' : 'Search customers...'}
              className={`h-11 rounded-xl border-none bg-muted/30 focus-visible:ring-primary ${isAr ? 'pr-10' : 'pl-10'}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="space-y-1 p-3">
            {filteredConversations.length === 0
              ? (
                  <div className="space-y-2 py-20 text-center text-muted-foreground opacity-30">
                    <MessageCircle size={48} className="mx-auto" />
                    <p className="text-sm font-medium">{isAr ? 'لا توجد محادثات' : 'No conversations'}</p>
                  </div>
                )
              : (
                  filteredConversations.map((conv) => {
                    const isSelected = selectedConvId === conv.id;
                    const buttonClass = isSelected
                      ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[0.98]'
                      : 'hover:bg-muted/50 active:scale-95';
                    const avatarBorderClass = isSelected ? 'border-primary-foreground/30' : 'border-background';
                    const timeClass = isSelected ? 'text-primary-foreground/60' : 'text-muted-foreground';
                    const lastMsgClass = isSelected ? 'text-primary-foreground/70' : 'text-muted-foreground';
                    return (
                      <button
                        key={conv.id}
                        type="button"
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`group flex w-full items-center gap-4 rounded-2xl p-4 transition-all duration-300 ${buttonClass}`}
                      >
                        <div className="relative shrink-0">
                          <div className={`flex size-14 items-center justify-center overflow-hidden rounded-2xl border-2 bg-muted text-xl font-black ${avatarBorderClass}`}>
                            {conv.customerName ? conv.customerName[0]?.toUpperCase() : <User size={24} />}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 rounded-lg shadow-sm ${isSelected ? 'ring-2 ring-primary-foreground/30' : 'ring-4 ring-background'}`}>
                            {getPlatformIcon(conv.platform, 12)}
                          </div>
                        </div>

                        <div className="min-w-0 flex-1 text-start">
                          <div className="mb-1 flex items-center justify-between">
                            <h4 className="truncate text-sm font-bold">
                              {conv.customerName || conv.externalId}
                            </h4>
                            <span className={`text-[10px] ${timeClass} font-medium whitespace-nowrap`}>
                              {conv.lastMessageAt ? format(new Date(conv.lastMessageAt), 'p', { locale: isAr ? ar : enUS }) : ''}
                            </span>
                          </div>
                          <p className={`truncate text-xs font-medium ${lastMsgClass}`}>
                            {conv.lastMessage || (isAr ? 'بدء محادثة جديدة' : 'Started a new chat')}
                          </p>
                        </div>

                        {conv.isUnread === 'true' && selectedConvId !== conv.id && (
                          <div className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                        )}
                      </button>
                    );
                  })
                )}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area (Column 2) */}
      <div className="flex flex-1 flex-col bg-muted/10 transition-all">
        {selectedConv
          ? (
              <>
                {/* Chat Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 p-4 backdrop-blur-md md:p-6">
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleCloseConv}
                      className="md:hidden"
                    >
                      <ArrowRight className={arrowClass} />
                    </Button>
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-lg font-black text-primary">
                      {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={22} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight">{selectedConv.customerName || selectedConv.externalId}</h3>
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        <span className="inline-block size-1.5 animate-pulse rounded-full bg-emerald-500" />
                        {selectedConv.platform}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowDetails(!showDetails)}
                      className="hidden rounded-xl border-none bg-muted/50 font-bold transition-all active:scale-95 lg:flex h-9 px-4"
                    >
                      {showDetails ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details') : (isAr ? 'عرض التفاصيل' : 'Show Details')}
                    </Button>
                    <Button type="button" variant="outline" size="icon" className="group rounded-xl border-none bg-muted/50 active:scale-95">
                      <MoreVertical size={18} className="transition-transform group-hover:rotate-90" />
                    </Button>
                  </div>
                </div>

                {/* Messages Area */}
                <ScrollArea className="flex-1 p-6">
                  <div className="flex flex-col gap-6">
                    {loadingMessages
                      ? (
                          ['s1', 's2', 's3', 's4', 's5'].map((key, i) => (
                            <div
                              key={key}
                              className={`flex ${i % 2 === 0
                                ? 'justify-start'
                                : 'justify-end'}`}
                            >
                              <Skeleton className="h-12 w-[200px] rounded-2xl" />
                            </div>
                          ))
                        )
                      : (
                          <>
                            {(() => {
                              let lastDateStr = '';
                              return messages.map((msg) => {
                                const msgDate = new Date(msg.createdAt);
                                const dateStr = format(msgDate, 'yyyy-MM-dd');
                                const showDivider = dateStr !== lastDateStr;
                                lastDateStr = dateStr;

                                const dateLabel = isToday(msgDate)
                                  ? (isAr ? 'اليوم' : 'Today')
                                  : isYesterday(msgDate)
                                    ? (isAr ? 'أمس' : 'Yesterday')
                                    : format(msgDate, 'dd MMMM yyyy', { locale: isAr ? ar : enUS });

                                return (
                                  <React.Fragment key={msg.id}>
                                    {showDivider && (
                                      <div className="py-4 text-center">
                                        <Badge variant="outline" className="bg-background px-3 py-1 border-none text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                                          {dateLabel}
                                        </Badge>
                                      </div>
                                    )}

                                    <div
                                      className={`group flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                                    >
                                      <div className={`flex max-w-[75%] flex-col gap-1 ${msg.direction === 'outgoing' ? 'items-end' : 'items-start'}`}>
                                        <div
                                          className={`rounded-2xl p-4 text-[13px] font-bold leading-relaxed shadow-sm transition-all duration-300 hover:shadow-md ${
                                            msg.direction === 'outgoing'
                                              ? 'rounded-tr-none bg-primary text-primary-foreground'
                                              : 'rounded-tl-none border bg-background text-foreground'
                                          }`}
                                        >
                                          {msg.text}
                                        </div>
                                        <div className="flex items-center gap-2 px-1 opacity-0 transition-opacity group-hover:opacity-100">
                                          <span className="text-[10px] font-bold italic text-muted-foreground">
                                            {format(msgDate, 'p', { locale: isAr ? ar : enUS })}
                                          </span>
                                          {msg.direction === 'outgoing' && <CheckCheck size={12} className="text-primary" />}
                                        </div>
                                      </div>
                                    </div>
                                  </React.Fragment>
                                );
                              });
                            })()}
                          </>
                        )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="border-t bg-background/50 p-6 backdrop-blur-md">
                  <form onSubmit={handleSendMessage} className="flex items-end gap-3">
                    <div className="relative flex-1 rounded-2xl border-none bg-muted/40 transition-all duration-300 focus-within:bg-muted/60 focus-within:ring-2 focus-within:ring-primary/20">
                      <textarea
                        placeholder={isAr ? 'اكتب ردك هنا...' : 'Type your reply...'}
                        className="max-h-[150px] min-h-[50px] w-full resize-none border-none bg-transparent p-4 text-[13px] font-bold focus:outline-none placeholder:font-medium"
                        rows={1}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage(e as any);
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!inputText.trim() || sending}
                      className="size-12 shrink-0 rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95"
                    >
                      {sending ? <Loader2 className="animate-spin size-5" /> : <Send size={20} className={isAr ? 'rotate-180' : ''} />}
                    </Button>
                  </form>
                </div>
              </>
            )
          : (
              <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-12 text-center text-muted-foreground/30">
                <div className="flex size-32 items-center justify-center rounded-3xl bg-muted/20">
                  <MessageCircle size={64} className="opacity-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-foreground/20">{isAr ? 'اختر محادثة للبدء' : 'Select Chat to Start'}</h3>
                </div>
              </div>
            )}
      </div>

      {/* Right Details Pane (Column 3) - Only visible if showDetails is true & desktop */}
      {selectedConv && showDetails && (
        <div className="hidden h-full flex-col border-r bg-background lg:flex lg:w-[320px] transition-all animate-in slide-in-from-right-10">
          <div className="flex items-center justify-between border-b p-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground">{isAr ? 'ملف العميل' : 'Profile'}</h3>
            <Badge className="bg-primary/10 text-primary border-none rounded-lg text-[10px] font-black">
              {selectedConv.status?.toUpperCase() || 'OPEN'}
            </Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {/* Profile Card */}
              <div className="mb-8 flex flex-col items-center text-center">
                <div className="mb-4 flex size-24 items-center justify-center rounded-[2rem] border bg-muted text-3xl font-black shadow-inner shadow-black/5">
                  {selectedConv.customerName ? selectedConv.customerName[0]?.toUpperCase() : <User size={40} />}
                </div>
                <h4 className="text-lg font-black">{selectedConv.customerName || isAr ? 'عميل غير مسجل' : 'Anonymous Customer'}</h4>
                <p className="text-xs font-bold text-muted-foreground">{selectedConv.externalId}</p>
              </div>

              {/* Attributes */}
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{isAr ? 'المنصة' : 'Platform'}</label>
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 border border-muted-foreground/5">
                    {getPlatformIcon(selectedConv.platform)}
                    <span className="text-sm font-bold uppercase">{selectedConv.platform}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{isAr ? 'تاريخ البدء' : 'First Interaction'}</label>
                  <div className="flex items-center gap-3 rounded-2xl bg-muted/30 p-4 border border-muted-foreground/5">
                    <CalendarCheck size={16} className="text-muted-foreground" />
                    <span className="text-sm font-bold">{isAr ? 'منذ 3 ساعات' : '3 hours ago'}</span>
                  </div>
                </div>

                {/* Internal Notes Placeholder */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">{isAr ? 'ملاحظات' : 'Notes'}</label>
                  <div className="rounded-2xl bg-amber-50/50 p-4 border border-amber-200/50">
                    <p className="text-[11px] font-bold text-amber-900/60 italic leading-relaxed">
                      {isAr ? 'لا توجد ملاحظات داخلية لهذا العميل.' : 'No internal notes for this contact.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-8 pt-6 border-t space-y-2">
                <Button variant="outline" className="w-full rounded-2xl font-bold border-muted-foreground/10 hover:bg-muted text-xs h-10 shadow-sm">
                   {isAr ? 'تحويل لعميل دائم' : 'Mark as VIP'}
                </Button>
                <Button variant="outline" className="w-full rounded-2xl font-bold border-red-200 text-red-500 hover:bg-red-50 text-xs h-10 shadow-sm">
                   {isAr ? 'إغلاق المحادثة' : 'Close Ticket'}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};
