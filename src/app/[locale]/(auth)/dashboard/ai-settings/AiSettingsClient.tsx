'use client';

import {
  AlertTriangle,
  Bot,
  Check,
  Clock,
  List,
  MessageCircle,
  MousePointer2,
  Plus,
  Save,
  Settings2,
  ShieldAlert,
  ShieldQuestion,
  Trash2,
  User,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { saveAiSettings } from './actions';

export default function AiSettingsClient({ settings }: { settings: any }) {
  const t = useTranslations('AiSettings');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('identity');

  const [formData, setFormData] = useState({
    isActive: settings?.isActive ? (settings.isActive === 'true' || settings.isActive === true) : true,
    isCommentsActive: settings?.isCommentsActive ? (settings.isCommentsActive === 'true' || settings.isCommentsActive === true) : true,
    botName: settings?.botName || 'مساعد المتجر',
    systemPrompt: settings?.systemPrompt || '',
    tone: settings?.tone || 'friendly',
    escalationRules: settings?.escalationRules || '',
    faqs: settings?.faqs || [] as { question: string; answer: string }[],
    welcomeMessage: settings?.welcomeMessage || 'أهلاً بك {name}! كيف يمكنني مساعدتك؟',
    workingHours: settings?.workingHours || { enabled: false, start: '09:00', end: '17:00', outOfHoursMessage: '' },
    antiSpam: settings?.antiSpam || { enabled: true, maxMessagesPerWindow: 3, windowMinutes: 5, warningMessage: '' },
    whatsappMenu: settings?.whatsappMenu || {
      enabled: false,
      header: 'قائمة الخيارات الرئيسية',
      body: 'يسعدنا خدمتك، يرجى اختيار ما تبحث عنه:',
      footer: 'نحن هنا لخدمتك',
      buttonText: 'عرض القائمة',
      sections: [{ title: 'خدماتنا', rows: [] }],
    },
    whatsappButtons: settings?.whatsappButtons || {
      enabled: false,
      header: 'تواصل معنا',
      body: 'كيف يمكننا مساعدتك اليوم؟ يمكنك الاختيار من الأزرار أدناه:',
      footer: 'نحن هنا لخدمتك',
      buttons: [],
    },
  });

  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' });

  const toneOptions = [
    { id: 'friendly', label: t('tone_friendly'), icon: '😊' },
    { id: 'professional', label: t('tone_professional'), icon: '💼' },
    { id: 'enthusiastic', label: t('tone_enthusiastic'), icon: '⚡' },
  ];

  const handleAddFaq = () => {
    if (!currentFaq.question || !currentFaq.answer) {
      return;
    }
    setFormData({ ...formData, faqs: [...formData.faqs, { ...currentFaq }] });
    setCurrentFaq({ question: '', answer: '' });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsLoading(true);
    setIsSaved(false);

    try {
      await saveAiSettings({
        ...formData,
        isActive: formData.isActive ? 'true' : 'false',
        isCommentsActive: formData.isCommentsActive ? 'true' : 'false',
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save AI settings', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async () => {
    const newState = !formData.isActive;
    setFormData({ ...formData, isActive: newState });
    setIsLoading(true);
    try {
      await saveAiSettings({
        ...formData,
        isActive: newState ? 'true' : 'false',
        isCommentsActive: formData.isCommentsActive ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Failed to save AI settings', error);
      setFormData({ ...formData, isActive: !newState });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleComments = async () => {
    const newState = !formData.isCommentsActive;
    setFormData({ ...formData, isCommentsActive: newState });
    setIsLoading(true);
    try {
      await saveAiSettings({
        ...formData,
        isActive: formData.isActive ? 'true' : 'false',
        isCommentsActive: newState ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Failed to save AI settings', error);
      setFormData({ ...formData, isCommentsActive: !newState });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-20">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {t('title')}
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-background p-1.5 shadow-sm">
          <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${formData.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
            <span className={`size-2 animate-pulse rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            {formData.isActive ? t('bot_online') : t('bot_offline')}
          </div>
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isLoading}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${formData.isActive ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200'} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <span className={`inline-block size-6 rounded-full bg-white transition-transform duration-300${formData.isActive ? 'translate-x-1 rtl:-translate-x-7' : 'translate-x-7 rtl:-translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Sidebar Nav */}
        <div className="flex flex-col gap-2 lg:col-span-3">
          {[
            { id: 'identity', label: t('tab_identity'), icon: <User className="size-5" /> },
            { id: 'faq', label: t('tab_faq'), icon: <ShieldQuestion className="size-5" /> },
            { id: 'system', label: t('tab_system'), icon: <Settings2 className="size-5" /> },
            { id: 'welcome', label: t('tab_welcome'), icon: <MessageCircle className="size-5" /> },
            { id: 'hours', label: t('tab_hours'), icon: <Clock className="size-5" /> },
            { id: 'spam', label: t('tab_spam'), icon: <ShieldAlert className="size-5" /> },
            { id: 'whatsapp_menu', label: 'قائمة واتساب', icon: <List className="size-5" /> },
            { id: 'whatsapp_buttons', label: 'أزرار واتساب', icon: <MousePointer2 className="size-5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === tab.id ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-9">
          <div className={`overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-gray-100/50 transition-all duration-500 ${formData.isActive ? 'opacity-100' : 'pointer-events-none opacity-50 grayscale'}`}>
            <div className="p-8 md:p-10">

              {/* Identity */}
              {activeTab === 'identity' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Bot className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('identity_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('identity_desc')}</p>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    {/* Comments Toggle */}
                    <div className="flex items-center justify-between rounded-2xl border bg-muted/20 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <MessageCircle className="size-5" />
                        </div>
                        <div className="flex flex-col text-start">
                          <span className="text-sm font-bold">الرد التلقائي على التعليقات</span>
                          <span className="text-xs text-muted-foreground">تفعيل أو إيقاف رد البوت على تعليقات انستقرام</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleToggleComments}
                        disabled={isLoading}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none ${formData.isCommentsActive ? 'bg-primary' : 'bg-gray-300'} ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
                      >
                        <span className={`inline-block size-4 rounded-full bg-white transition-transform duration-300${formData.isCommentsActive ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                      </button>
                    </div>

                    <div className="grid gap-2 text-start">
                      <Label htmlFor="botName" className="text-base font-bold">{t('bot_name')}</Label>
                      <Input
                        id="botName"
                        placeholder={t('bot_name_placeholder')}
                        value={formData.botName}
                        onChange={e => setFormData({ ...formData, botName: e.target.value })}
                        className="h-12 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="grid gap-3 text-start">
                      <Label className="text-base font-bold">{t('tone')}</Label>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                        {toneOptions.map(option => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, tone: option.id })}
                            className={`flex items-center gap-3 rounded-2xl border-2 p-4 text-start transition-all ${
                              formData.tone === option.id
                                ? 'border-primary bg-primary/5 shadow-md'
                                : 'border-transparent bg-muted/30 hover:bg-muted/50'
                            }`}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="text-sm font-bold tracking-tight">{option.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-2 text-start">
                      <Label htmlFor="systemPrompt" className="text-base font-bold">{t('system_prompt')}</Label>
                      <textarea
                        id="systemPrompt"
                        rows={6}
                        placeholder={t('system_prompt_placeholder')}
                        className="flex min-h-[120px] w-full resize-y rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={formData.systemPrompt}
                        onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* FAQ */}
              {activeTab === 'faq' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldQuestion className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('faq_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('faq_desc')}</p>
                    </div>
                  </div>
                  <div className="rounded-3xl border-2 border-dashed border-muted/50 bg-muted/20 p-6 text-start">
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label className="font-bold">{t('faq_question')}</Label>
                        <Input
                          placeholder={t('faq_question_placeholder')}
                          value={currentFaq.question}
                          onChange={e => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                          className="h-11 rounded-xl border-none bg-background shadow-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="font-bold">{t('faq_answer')}</Label>
                        <textarea
                          rows={2}
                          placeholder={t('faq_answer_placeholder')}
                          value={currentFaq.answer}
                          onChange={e => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                          className="flex min-h-[80px] w-full rounded-xl border-none bg-background px-4 py-3 text-sm shadow-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <Button
                        type="button"
                        onClick={handleAddFaq}
                        className="self-end rounded-xl px-8 font-bold"
                        disabled={!currentFaq.question || !currentFaq.answer}
                      >
                        <Plus className="ml-2 size-4" />
                        {t('faq_add')}
                      </Button>
                    </div>
                  </div>
                  {formData.faqs.length > 0 && (
                    <div className="grid gap-4 text-start">
                      <h4 className="px-2 text-lg font-bold">
                        {t('faq_current')}
                        {' '}
                        (
                        {formData.faqs.length}
                        )
                      </h4>
                      <div className="flex flex-col gap-3">
                        {formData.faqs.map((faq: { question: string; answer: string }, index: number) => (
                          <div key={faq.question} className="group relative flex flex-col gap-2 rounded-2xl border bg-muted/10 p-5 transition-all hover:border-primary/30">
                            <div className="flex items-start justify-between">
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">FAQ</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                className="text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                            <p className="font-bold leading-tight text-blue-900">
                              Q:
                              {faq.question}
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              A:
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* System */}
              {activeTab === 'system' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                      <Settings2 className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('system_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('system_desc')}</p>
                    </div>
                  </div>
                  <div className="grid gap-6 text-start">
                    <div className="grid gap-2">
                      <Label htmlFor="escalationRules" className="flex items-center gap-2 text-base font-bold">
                        <AlertTriangle className="size-4 text-amber-500" />
                        {t('escalation_label')}
                      </Label>
                      <p className="mb-2 text-xs text-muted-foreground">{t('escalation_desc')}</p>
                      <textarea
                        id="escalationRules"
                        rows={5}
                        placeholder={t('escalation_placeholder')}
                        className="flex min-h-[140px] w-full resize-y rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                        value={formData.escalationRules}
                        onChange={e => setFormData({ ...formData, escalationRules: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Welcome */}
              {activeTab === 'welcome' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                      <MessageCircle className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('welcome_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('welcome_desc')}</p>
                    </div>
                  </div>
                  <div className="grid gap-6 text-start">
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 text-base font-bold">{t('welcome_label')}</Label>
                      <p className="mb-2 text-xs text-muted-foreground">
                        {t('welcome_hint')}
                      </p>
                      <textarea
                        rows={4}
                        className="flex w-full resize-y rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                        value={formData.welcomeMessage}
                        onChange={e => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Working Hours */}
              {activeTab === 'hours' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                      <Clock className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('hours_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('hours_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, workingHours: { ...formData.workingHours, enabled: !formData.workingHours.enabled } })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.workingHours.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.workingHours.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">{t('hours_toggle')}</span>
                      <span className="text-xs text-muted-foreground">{t('hours_toggle_desc')}</span>
                    </div>
                  </div>
                  {formData.workingHours.enabled && (
                    <div className="grid gap-6 text-start">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">{t('hours_start')}</Label>
                          <Input
                            type="time"
                            value={formData.workingHours.start}
                            onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, start: e.target.value } })}
                            className="rounded-xl border-none bg-muted/30 shadow-sm"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">{t('hours_end')}</Label>
                          <Input
                            type="time"
                            value={formData.workingHours.end}
                            onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, end: e.target.value } })}
                            className="rounded-xl border-none bg-muted/30 shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-base font-bold">{t('hours_out_of_hours')}</Label>
                        <p className="mb-2 text-xs text-muted-foreground">{t('hours_hint')}</p>
                        <textarea
                          rows={3}
                          className="flex w-full resize-y rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                          value={formData.workingHours.outOfHoursMessage}
                          onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, outOfHoursMessage: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Anti-Spam */}
              {activeTab === 'spam' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                      <ShieldAlert className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{t('spam_title')}</h3>
                      <p className="text-sm text-muted-foreground">{t('spam_desc')}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, enabled: !formData.antiSpam.enabled } })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.antiSpam.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.antiSpam.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">{t('spam_toggle')}</span>
                    </div>
                  </div>
                  {formData.antiSpam.enabled && (
                    <div className="grid gap-6 rounded-2xl border border-dashed bg-muted/10 p-6 text-start">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">{t('spam_max')}</Label>
                          <Input
                            type="number"
                            min="1"
                            value={formData.antiSpam.maxMessagesPerWindow}
                            onChange={e => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, maxMessagesPerWindow: Number.parseInt(e.target.value) || 3 } })}
                            className="rounded-xl border-none bg-background shadow-sm"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">{t('spam_window')}</Label>
                          <Input
                            type="number"
                            min="1"
                            value={formData.antiSpam.windowMinutes}
                            onChange={e => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, windowMinutes: Number.parseInt(e.target.value) || 5 } })}
                            className="rounded-xl border-none bg-background shadow-sm"
                          />
                        </div>
                      </div>
                      <div className="mt-2 grid gap-2">
                        <Label className="text-sm font-bold">{t('spam_warning')}</Label>
                        <textarea
                          rows={2}
                          className="flex w-full resize-y rounded-2xl border-none bg-background px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                          value={formData.antiSpam.warningMessage}
                          onChange={e => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, warningMessage: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WhatsApp Menu */}
              {activeTab === 'whatsapp_menu' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-600">
                      <List className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">تخصيص قائمة واتساب التفاعلية</h3>
                      <p className="text-sm text-muted-foreground">تعديل الخيارات التي تظهر للعملاء في واتساب عند بدء المحادثة.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, enabled: !formData.whatsappMenu.enabled } })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.whatsappMenu.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.whatsappMenu.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">تفعيل القائمة التفاعلية</span>
                      <span className="text-xs text-muted-foreground">عند التفعيل، سيتم إرسال هذه القائمة للعملاء الجدد تلقائياً.</span>
                    </div>
                  </div>

                  {formData.whatsappMenu.enabled && (
                    <div className="grid gap-6 text-start">
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">العنوان (اختياري)</Label>
                        <Input
                          value={formData.whatsappMenu.header}
                          onChange={e => setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, header: e.target.value } })}
                          className="h-11 rounded-xl border-none bg-muted/30"
                          placeholder="مثلاً: مرحباً بك في متجرنا"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">نص الرسالة</Label>
                        <textarea
                          rows={3}
                          value={formData.whatsappMenu.body}
                          onChange={e => setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, body: e.target.value } })}
                          className="flex w-full rounded-xl border-none bg-muted/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                          placeholder="مثلاً: يرجى اختيار الخدمة المطلوبة:"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">نص التذييل (اختياري)</Label>
                        <Input
                          value={formData.whatsappMenu.footer}
                          onChange={e => setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, footer: e.target.value } })}
                          className="h-11 rounded-xl border-none bg-muted/30"
                          placeholder="مثلاً: نحن هنا لخدمتك"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">نص الزر</Label>
                        <Input
                          value={formData.whatsappMenu.buttonText}
                          onChange={e => setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, buttonText: e.target.value } })}
                          className="h-11 rounded-xl border-none bg-muted/30"
                          placeholder="مثلاً: عرض الخيارات"
                        />
                      </div>

                      <div className="mt-4 flex flex-col gap-4">
                        <Label className="text-lg font-bold">خيارات القائمة</Label>
                        {formData.whatsappMenu.sections[0].rows.map((row: any, idx: number) => (
                          <div key={row.id} className="group relative grid grid-cols-1 items-end gap-4 rounded-2xl border bg-muted/5 p-4 md:grid-cols-12">
                            <div className="md:col-span-3">
                              <Label className="mb-1 block text-xs">العنوان</Label>
                              <Input
                                value={row.title}
                                onChange={(e) => {
                                  const newRows = [...formData.whatsappMenu.sections[0].rows];
                                  newRows[idx].title = e.target.value;
                                  setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, sections: [{ ...formData.whatsappMenu.sections[0], rows: newRows }] } });
                                }}
                                className="h-10 text-sm"
                              />
                            </div>
                            <div className="md:col-span-7">
                              <Label className="mb-1 block text-xs">الوصف (اختياري)</Label>
                              <Input
                                value={row.description}
                                onChange={(e) => {
                                  const newRows = [...formData.whatsappMenu.sections[0].rows];
                                  newRows[idx].description = e.target.value;
                                  setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, sections: [{ ...formData.whatsappMenu.sections[0], rows: newRows }] } });
                                }}
                                className="h-10 text-sm"
                              />
                            </div>
                            <div className="flex justify-end md:col-span-2">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  const newRows = [...formData.whatsappMenu.sections[0].rows];
                                  newRows.splice(idx, 1);
                                  setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, sections: [{ ...formData.whatsappMenu.sections[0], rows: newRows }] } });
                                }}
                                className="text-red-500 hover:bg-red-50"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            const newRows = [...formData.whatsappMenu.sections[0].rows, { id: `item_${Date.now()}`, title: '', description: '' }];
                            setFormData({ ...formData, whatsappMenu: { ...formData.whatsappMenu, sections: [{ ...formData.whatsappMenu.sections[0], rows: newRows }] } });
                          }}
                          className="rounded-xl border-2 border-dashed py-6"
                        >
                          <Plus className="ml-2 size-4" />
                          إضافة خيار جديد
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WhatsApp Buttons */}
              {activeTab === 'whatsapp_buttons' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                      <MousePointer2 className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">تخصيص أزرار الرد السريع</h3>
                      <p className="text-sm text-muted-foreground">أضف أزراراً سريعة (بحد أقصى 3) تظهر للعملاء للرد السريع.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, enabled: !formData.whatsappButtons.enabled } })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.whatsappButtons.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.whatsappButtons.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">تفعيل أزرار الرد السريع</span>
                      <span className="text-xs text-muted-foreground">عند التفعيل، يمكنك طلب إرسال هذه الأزرار عبر أدوات الذكاء الاصطناعي.</span>
                    </div>
                  </div>

                  {formData.whatsappButtons.enabled && (
                    <div className="grid gap-6 text-start">
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">العنوان (اختياري)</Label>
                        <Input
                          value={formData.whatsappButtons.header}
                          onChange={e => setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, header: e.target.value } })}
                          className="h-11 rounded-xl border-none bg-muted/30"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">نص الرسالة</Label>
                        <textarea
                          rows={3}
                          value={formData.whatsappButtons.body}
                          onChange={e => setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, body: e.target.value } })}
                          className="flex w-full rounded-xl border-none bg-muted/30 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-sm font-bold">نص التذييل (اختياري)</Label>
                        <Input
                          value={formData.whatsappButtons.footer}
                          onChange={e => setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, footer: e.target.value } })}
                          className="h-11 rounded-xl border-none bg-muted/30"
                        />
                      </div>

                      <div className="mt-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-lg font-bold">الأزرار (بحد أقصى 3)</Label>
                          <span className="text-xs text-muted-foreground">
                            {formData.whatsappButtons.buttons.length}
                            {' '}
                            / 3
                          </span>
                        </div>
                        {formData.whatsappButtons.buttons.map((btn: any, idx: number) => (
                          <div key={btn.id} className="group relative flex items-center gap-4 rounded-2xl border bg-muted/5 p-4">
                            <div className="flex-1">
                              <Label className="mb-1 block text-xs">نص الزر</Label>
                              <Input
                                value={btn.title}
                                onChange={(e) => {
                                  const newBtns = [...formData.whatsappButtons.buttons];
                                  newBtns[idx].title = e.target.value;
                                  setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, buttons: newBtns } });
                                }}
                                className="h-10 text-sm"
                                maxLength={20}
                              />
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newBtns = [...formData.whatsappButtons.buttons];
                                newBtns.splice(idx, 1);
                                setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, buttons: newBtns } });
                              }}
                              className="text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        ))}
                        {formData.whatsappButtons.buttons.length < 3 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              const newBtns = [...formData.whatsappButtons.buttons, { id: `btn_${Date.now()}`, title: '' }];
                              setFormData({ ...formData, whatsappButtons: { ...formData.whatsappButtons, buttons: newBtns } });
                            }}
                            className="rounded-xl border-2 border-dashed py-6"
                          >
                            <Plus className="ml-2 size-4" />
                            إضافة زر جديد
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-4 border-t bg-muted/10 px-8 py-6">
              <p className="hidden text-sm text-muted-foreground md:block">{t('footer_hint')}</p>
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className={`h-12 rounded-2xl px-12 font-bold transition-all duration-300 ${isSaved ? 'bg-green-600 shadow-lg shadow-green-500/20 hover:bg-green-700' : 'shadow-lg shadow-primary/20'}`}
              >
                {isLoading
                  ? (
                      <span className="flex items-center gap-2">
                        <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t('saving')}
                      </span>
                    )
                  : isSaved
                    ? (
                        <>
                          <Check className="ml-2 size-5" />
                          {t('saved')}
                        </>
                      )
                    : (
                        <>
                          <Save className="ml-2 size-5" />
                          {t('save')}
                        </>
                      )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
