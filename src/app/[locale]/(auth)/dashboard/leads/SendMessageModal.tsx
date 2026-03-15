'use client';

import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  LayoutTemplate,
  Loader2,
  Send,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { getTemplates, sendMessage } from './actions';

type Template = {
  id: number;
  name: string;
  language: string;
  bodyText: string;
  metaStatus: string | null;
};

export default function SendMessageModal({
  lead,
  onClose,
}: {
  lead: any;
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [platform, setPlatform] = useState<'whatsapp' | 'instagram' | 'messenger'>(
    (lead.source === 'whatsapp' || lead.source === 'instagram' || lead.source === 'messenger')
      ? lead.source
      : 'whatsapp',
  );

  const [messageType, setMessageType] = useState<'text' | 'template'>('text');
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  useEffect(() => {
    if (platform === 'whatsapp') {
      setLoadingTemplates(true);
      getTemplates()
        .then((data: any) => {
          setTemplates(data);
          if (data.length > 0) {
            setSelectedTemplate(data[0]);
            setMessageType('template');
          }
        })
        .finally(() => setLoadingTemplates(false));
    } else {
      setMessageType('text');
    }
  }, [platform]);

  const handleSend = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await sendMessage({
        leadId: lead.id,
        platform,
        type: messageType,
        text: messageType === 'text' ? messageText : undefined,
        templateName: messageType === 'template' ? selectedTemplate?.name : undefined,
        language: messageType === 'template' ? selectedTemplate?.language : undefined,
      });
      setSuccess('تم إرسال الرسالة بنجاح!');
      setTimeout(onClose, 2000);
    } catch (err: any) {
      setError(err.message || 'فشل في إرسال الرسالة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
      <div className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[2.5rem] bg-card shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-muted/10 p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Send className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                إرسال رسالة إلى
                {lead.name}
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">التواصل المباشر</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl hover:bg-red-50 hover:text-red-500">
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6 text-start">
          {/* Platform Toggle */}
          <div className="space-y-2">
            <Label className="px-1 text-sm font-black">المنصة</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['whatsapp', 'instagram', 'messenger'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all ${
                    platform === p
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-muted bg-muted/10 opacity-50 grayscale hover:opacity-100'
                  }`}
                >
                  <span className="text-xs font-black capitalize">{p === 'whatsapp' ? 'واتساب' : p}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Select (WA only) */}
          {platform === 'whatsapp' && (
            <div className="space-y-2">
              <Label className="px-1 text-sm font-black">نوع الرسالة</Label>
              <div className="flex gap-2 rounded-2xl bg-muted/20 p-1">
                <button
                  onClick={() => setMessageType('text')}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                    messageType === 'text' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  نص عادي
                </button>
                <button
                  onClick={() => setMessageType('template')}
                  className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                    messageType === 'template' ? 'bg-card shadow-sm' : 'text-muted-foreground'
                  }`}
                >
                  قالب (Template)
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          {messageType === 'text'
            ? (
                <div className="space-y-2">
                  <Label className="px-1 text-sm font-black">محتوى الرسالة</Label>
                  <textarea
                    rows={4}
                    placeholder="اكتب رسالتك هنا..."
                    className="w-full resize-none rounded-2xl border-none bg-muted/30 p-4 text-sm font-medium shadow-inner outline-none focus:ring-2 focus:ring-primary"
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                  />
                  <p className="px-1 text-[10px] italic text-muted-foreground">
                    * بالنسبة لواتساب، يرسل النص العادي فقط للمحادثات النشطة خلال آخر 24 ساعة.
                  </p>
                </div>
              )
            : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="px-1 text-sm font-black">اختر القالب</Label>
                    {loadingTemplates
                      ? (
                          <div className="flex items-center gap-2 p-4 text-xs italic text-muted-foreground">
                            <Loader2 className="size-4 animate-spin" />
                            {' '}
                            جاري تحميل القوالب...
                          </div>
                        )
                      : templates.length === 0
                        ? (
                            <div className="rounded-2xl border border-dashed p-6 text-center text-xs font-medium text-muted-foreground">
                              لا يوجد قوالب معتمدة حالياً.
                            </div>
                          )
                        : (
                            <div className="group relative">
                              <select
                                className="w-full appearance-none rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm font-bold shadow-inner outline-none focus:ring-2 focus:ring-primary"
                                value={selectedTemplate?.id || ''}
                                onChange={(e) => {
                                  const tpl = templates.find(t => t.id === Number(e.target.value));
                                  setSelectedTemplate(tpl || null);
                                }}
                              >
                                {templates.map(tpl => (
                                  <option key={tpl.id} value={tpl.id}>
                                    {tpl.name}
                                    {' '}
                                    (
                                    {tpl.language}
                                    )
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary" />
                            </div>
                          )}
                  </div>

                  {selectedTemplate && (
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px] font-black uppercase text-slate-400">
                          <LayoutTemplate className="size-3" />
                          {' '}
                          معاينة القالب
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter text-emerald-600">
                          Approved
                        </span>
                      </div>
                      <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                        {selectedTemplate.bodyText}
                      </p>
                    </div>
                  )}
                </div>
              )}

          {error && (
            <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600">
              <AlertCircle className="size-4 shrink-0" />
              {' '}
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-bold text-emerald-600 animate-in slide-in-from-top-2">
              <CheckCircle2 className="size-4 shrink-0" />
              {' '}
              {success}
            </div>
          )}
        </div>

        <div className="p-6 pt-0">
          <Button
            onClick={handleSend}
            disabled={loading || (messageType === 'text' && !messageText) || (messageType === 'template' && !selectedTemplate)}
            className="h-14 w-full rounded-2xl bg-primary text-lg font-black shadow-xl shadow-primary/20 transition-all active:scale-95"
          >
            {loading
              ? (
                  <>
                    <Loader2 className="mr-2 size-5 animate-spin" />
                    {' '}
                    جاري الإرسال...
                  </>
                )
              : (
                  <>
                    <Send className="ml-2 size-5" />
                    {' '}
                    إرسال الرسالة
                  </>
                )}
          </Button>
        </div>
      </div>
    </div>
  );
}
