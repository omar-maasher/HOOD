'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ChatWidget = () => {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) {
      return;
    }

    const userMessage = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'bot', text: data.reply || (isAr ? 'عذراً، حدث خطأ ما.' : 'Sorry, something went wrong.') }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'bot', text: isAr ? 'فشل الاتصال بالخادم.' : 'Failed to connect to server.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4" dir={isAr ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden"
          >
            <Card className="flex flex-col border-none bg-white/80 shadow-2xl backdrop-blur-xl dark:bg-black/80">
              {/* Header */}
              <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                    <Bot className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{isAr ? 'مساعد هود تريندينج' : 'HoodTrading Assistant'}</h3>
                    <p className="text-[10px] opacity-80">{isAr ? 'متصل الآن' : 'Online now'}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleChat} className="text-white hover:bg-white/10">
                  <X className="size-5" />
                </Button>
              </div>

              {/* Messages Area */}
              <ScrollArea className="h-[400px] p-4" ref={scrollRef}>
                <div className="flex flex-col gap-4">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                      <Bot className="mb-2 size-12 opacity-20" />
                      <p className="text-sm font-medium">
                        {isAr ? 'كيف يمكنني مساعدتك اليوم؟' : 'How can I help you today?'}
                      </p>
                    </div>
                  )}
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm font-medium shadow-sm ${
                          msg.role === 'user'
                            ? 'rounded-tr-none bg-primary text-primary-foreground'
                            : 'rounded-tl-none bg-muted text-foreground'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-1 rounded-2xl bg-muted px-4 py-3 shadow-sm">
                        <span className="size-1.5 animate-bounce rounded-full bg-foreground/40" />
                        <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 delay-75" />
                        <span className="size-1.5 animate-bounce rounded-full bg-foreground/40 delay-150" />
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={isAr ? 'اكتب رسالتك...' : 'Type a message...'}
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    className="h-10 border-none bg-muted/50 focus-visible:ring-primary"
                  />
                  <Button type="submit" size="icon" disabled={!inputText.trim() || isLoading} className="shrink-0">
                    <Send className={`size-5 ${isAr ? 'rotate-180' : ''}`} />
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleChat}
        className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/40 focus:outline-none"
      >
        {isOpen ? <X className="size-7" /> : <MessageCircle className="size-7" />}
      </motion.button>
    </div>
  );
};
