'use client';

import {
  AlertTriangle,
  Bot,
  Check,
  Clock,
  MessageCircle,
  Plus,
  Save,
  Settings2,
  ShieldAlert,
  ShieldQuestion,
  Trash2,
  User,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { saveAiSettings } from './actions';

export default function AiSettingsClient({ settings }: { settings: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('identity'); // 'identity' | 'faq' | 'system'

  const [formData, setFormData] = useState({
    isActive: settings?.isActive ? (settings.isActive === 'true' || settings.isActive === true) : true,
    botName: settings?.botName || 'مساعد المتجر',
    systemPrompt: settings?.systemPrompt || '',
    tone: settings?.tone || 'friendly',
    escalationRules: settings?.escalationRules || '',
    faqs: settings?.faqs || [] as { question: string; answer: string }[],
    welcomeMessage: settings?.welcomeMessage || 'أهلاً بك {name}! كيف يمكنني مساعدتك؟ (طلب / سعر / دعم / حجز / تواصل بشري)',
    workingHours: settings?.workingHours || { enabled: false, start: '09:00', end: '17:00', outOfHoursMessage: 'عذراً، نحن خارج أوقات العمل حالياً. سنقوم بالرد عليك في أقرب وقت. (مواعيد العمل: {start} إلى {end})' },
    antiSpam: settings?.antiSpam || { enabled: true, maxMessagesPerWindow: 3, windowMinutes: 5, warningMessage: 'تم استلام طلبك، يرجى الانتظار قليلاً لتجنب تكرار الرسائل الثمينة.' },
  });

  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' });

  const toneOptions = [
    { id: 'friendly', label: 'ودود ولطيف', icon: '😊' },
    { id: 'professional', label: 'احترافي ورسمي', icon: '💼' },
    { id: 'enthusiastic', label: 'حماسي ومرح', icon: '⚡' },
  ];

  const handleAddFaq = () => {
    if (!currentFaq.question || !currentFaq.answer) {
      return;
    }
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { ...currentFaq }],
    });
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

    // Auto-save when toggling the bot status
    setIsLoading(true);
    try {
      await saveAiSettings({
        ...formData,
        isActive: newState ? 'true' : 'false',
      });
    } catch (error) {
      console.error('Failed to save AI settings', error);
      // Revert on error
      setFormData({ ...formData, isActive: !newState });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            تخصيص المساعد الذكي
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">تحكم في شخصية وكفاءة المساعد الآلي لمتجرك.</p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border bg-background p-1.5 shadow-sm">
          <div className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors ${formData.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
            <span className={`size-2 animate-pulse rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            {formData.isActive ? 'المساعد متصل' : 'المساعد متوقف'}
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
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2 lg:col-span-3">
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'identity' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <User className="size-5" />
            شخصية البوت
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'faq' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <ShieldQuestion className="size-5" />
            الأسئلة الشائعة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'system' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Settings2 className="size-5" />
            القواعد المتقدمة
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('welcome')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'welcome' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <MessageCircle className="size-5" />
            رسالة الترحيب
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'hours' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Clock className="size-5" />
            ساعات العمل
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('spam')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'spam' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <ShieldAlert className="size-5" />
            منع الإزعاج
          </button>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-9">
          <div className={`overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-gray-100/50 transition-all duration-500 ${formData.isActive ? 'opacity-100' : 'pointer-events-none opacity-50 grayscale'}`}>

            <div className="p-8 md:p-10">
              {/* Tab: Identity */}
              {activeTab === 'identity' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <Bot className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">هوية ونبرة المساعد</h3>
                      <p className="text-sm text-muted-foreground">تحديد الاسم والأسلوب الذي يتحدث به البوت</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid gap-2 text-start">
                      <Label htmlFor="botName" className="text-base font-bold">اسم المساعد</Label>
                      <Input
                        id="botName"
                        placeholder="مثلاً: مساعد متجر هود"
                        value={formData.botName}
                        onChange={e => setFormData({ ...formData, botName: e.target.value })}
                        className="h-12 rounded-2xl border-none bg-muted/30 focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-3 text-start">
                      <Label className="text-base font-bold">نبرة الحديث</Label>
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
                      <Label htmlFor="systemPrompt" className="text-base font-bold">وصف المساعد وتعليماته</Label>
                      <textarea
                        id="systemPrompt"
                        rows={6}
                        placeholder="أنت مساعد ذكي ولطيف، مهمتك مساعدة العملاء..."
                        className="flex min-h-[120px] w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={formData.systemPrompt}
                        onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: FAQ */}
              {activeTab === 'faq' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <ShieldQuestion className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">قاعدة بيانات الأسئلة الشائعة</h3>
                      <p className="text-sm text-muted-foreground">أضف معلومات دقيقة ليتمكن البوت من الإجابة عليها</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border-2 border-dashed border-muted/50 bg-muted/20 p-6 text-start">
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label className="font-bold">السؤال المكرر</Label>
                        <Input
                          placeholder="مثلاً: كم يستغرق الشحن؟"
                          value={currentFaq.question}
                          onChange={e => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                          className="h-11 rounded-xl border-none bg-background shadow-sm"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="font-bold">الإجابة المعتمدة</Label>
                        <textarea
                          rows={2}
                          placeholder="الشحن يستغرق من 2-5 أيام عمل لجميع مناطق المملكة."
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
                        إضافة للسجل
                      </Button>
                    </div>
                  </div>

                  {formData.faqs.length > 0 && (
                    <div className="grid gap-4 text-start">
                      <h4 className="px-2 text-lg font-bold">
                        الأسئلة والردود الحالية (
                        {formData.faqs.length}
                        )
                      </h4>
                      <div className="flex flex-col gap-3">
                        {formData.faqs.map((faq: { question: string; answer: string }, index: number) => (
                          <div key={faq.question} className="group relative flex flex-col gap-2 rounded-2xl border bg-muted/10 p-5 transition-all hover:border-primary/30">
                            <div className="flex items-start justify-between">
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-extrabold uppercase text-primary">FAQ Item</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                className="text-muted-foreground opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                            <p className="font-bold leading-tight text-blue-900">
                              س:
                              {faq.question}
                            </p>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                              ج:
                              {faq.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: System */}
              {activeTab === 'system' && (activeTab === 'system') && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                      <Settings2 className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">القواعد والسياسات</h3>
                      <p className="text-sm text-muted-foreground">متى يجب أن يتوقف البوت ويطلب تدخل بشري؟</p>
                    </div>
                  </div>

                  <div className="grid gap-6 text-start">
                    <div className="grid gap-2">
                      <Label htmlFor="escalationRules" className="flex items-center gap-2 text-base font-bold">
                        <AlertTriangle className="size-4 text-amber-500" />
                        قواعد التصعيد (Escalation)
                      </Label>
                      <p className="mb-2 text-xs text-muted-foreground">أدخل الحالات التي يجب فيها تحويل المحادثة لأحد الموظفين.</p>
                      <textarea
                        id="escalationRules"
                        rows={5}
                        placeholder="مثلاً: عند الطلب المتكرر للتحدث مع بشري، أو عند الشكاوى الفنية المعقدة..."
                        className="flex min-h-[140px] w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                        value={formData.escalationRules}
                        onChange={e => setFormData({ ...formData, escalationRules: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Welcome Message */}
              {activeTab === 'welcome' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-600">
                      <MessageCircle className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">رسالة الترحيب الأولى</h3>
                      <p className="text-sm text-muted-foreground">تخصيص رد الترحيب للمستخدمين الجدد</p>
                    </div>
                  </div>

                  <div className="grid gap-6 text-start">
                    <div className="grid gap-2">
                      <Label className="flex items-center gap-2 text-base font-bold">
                        محتوى رسالة الترحيب
                      </Label>
                      <p className="mb-2 text-xs text-muted-foreground">
                        استخدم
                        {`{name}`}
                        {' '}
                        لجلب اسم العميل (إن أمكن). وضع الخيارات التوجيهية للعميل.
                      </p>
                      <textarea
                        rows={4}
                        placeholder="أهلاً بك {name}! كيف يمكنني مساعدتك؟ (طلب / سعر / دعم / حجز / تواصل بشري)"
                        className="flex w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                        value={formData.welcomeMessage}
                        onChange={e => setFormData({ ...formData, welcomeMessage: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Working Hours */}
              {activeTab === 'hours' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-600">
                      <Clock className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">مواعيد الدوام وخارج العمل</h3>
                      <p className="text-sm text-muted-foreground">ضبط الرد التلقائي وإدارة التوقعات خارج أوقات العمل</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        workingHours: { ...formData.workingHours, enabled: !formData.workingHours.enabled },
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.workingHours.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.workingHours.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">تفعيل نظام أوقات العمل</span>
                      <span className="text-xs text-muted-foreground">خارج العمل: رد آلي محترم وتأجيل المتابعة</span>
                    </div>
                  </div>

                  {formData.workingHours.enabled && (
                    <div className="grid gap-6 text-start">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">وقت بدء العمل</Label>
                          <Input
                            type="time"
                            value={formData.workingHours.start}
                            onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, start: e.target.value } })}
                            className="rounded-xl border-none bg-muted/30 shadow-sm"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">وقت انتهاء العمل</Label>
                          <Input
                            type="time"
                            value={formData.workingHours.end}
                            onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, end: e.target.value } })}
                            className="rounded-xl border-none bg-muted/30 shadow-sm"
                          />
                        </div>
                      </div>

                      <div className="grid gap-2">
                        <Label className="text-base font-bold">رسالة خارج وقت العمل</Label>
                        <p className="mb-2 text-xs text-muted-foreground">
                          استخدم
                          {`{start}`}
                          {' '}
                          و
                          {`{end}`}
                          {' '}
                          لعرض الأوقات تلقائياً.
                        </p>
                        <textarea
                          rows={3}
                          className="flex w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                          value={formData.workingHours.outOfHoursMessage}
                          onChange={e => setFormData({ ...formData, workingHours: { ...formData.workingHours, outOfHoursMessage: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Anti-spam */}
              {activeTab === 'spam' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-600">
                      <ShieldAlert className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">قواعد حماية من الإزعاج (Anti-Spam)</h3>
                      <p className="text-sm text-muted-foreground">منع الزبائن من التكرار وإرهاق حصة الذكاء الاصطناعي</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border bg-muted/10 p-4">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        antiSpam: { ...formData.antiSpam, enabled: !formData.antiSpam.enabled },
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${formData.antiSpam.enabled ? 'bg-primary' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block size-4 rounded-full bg-white transition-transform${formData.antiSpam.enabled ? 'translate-x-1 rtl:-translate-x-6' : 'translate-x-6 rtl:-translate-x-1'}`} />
                    </button>
                    <div className="flex flex-col text-start">
                      <span className="text-sm font-bold">تفعيل التدريع وإيقاف الإزعاج</span>
                    </div>
                  </div>

                  {formData.antiSpam.enabled && (
                    <div className="grid gap-6 rounded-2xl border border-dashed bg-muted/10 p-6 text-start">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">أقصى عدد رسائل (ردود آلية)</Label>
                          <Input
                            type="number"
                            min="1"
                            value={formData.antiSpam.maxMessagesPerWindow}
                            onChange={e => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, maxMessagesPerWindow: Number.parseInt(e.target.value) || 3 } })}
                            className="rounded-xl border-none bg-background shadow-sm"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-sm font-bold">المدة الزمنية (بالدقائق)</Label>
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
                        <Label className="text-sm font-bold">الرد الحازم عند تجاوز الحد (تكرار الرسائل)</Label>
                        <textarea
                          rows={2}
                          className="flex w-full rounded-2xl border-none bg-background px-4 py-3 text-sm shadow-inner outline-none focus:ring-2 focus:ring-primary"
                          value={formData.antiSpam.warningMessage}
                          onChange={e => setFormData({ ...formData, antiSpam: { ...formData.antiSpam, warningMessage: e.target.value } })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between gap-4 border-t bg-muted/10 px-8 py-6">
              <p className="hidden text-sm text-muted-foreground md:block">يتم حفظ جميع التعديلات في قاعدة البيانات بشكل فوري عند الضغط على حفظ.</p>
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
                        جاري الحفظ
                      </span>
                    )
                  : isSaved
                    ? (
                        <>
                          <Check className="ml-2 size-5" />
                          تم الحفظ بنجاح
                        </>
                      )
                    : (
                        <>
                          <Save className="ml-2 size-5" />
                          حفظ التغييرات
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
