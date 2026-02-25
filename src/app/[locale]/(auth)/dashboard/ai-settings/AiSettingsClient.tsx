'use client';

import { useState } from 'react';
import { 
  Save, Bot, Plus, Trash2, 
  ShieldQuestion, Check, 
  AlertTriangle, User, Settings2
} from 'lucide-react';
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
  });

  const [currentFaq, setCurrentFaq] = useState({ question: '', answer: '' });

  const toneOptions = [
    { id: 'friendly', label: 'ودود ولطيف', icon: '😊' },
    { id: 'professional', label: 'احترافي ورسمي', icon: '💼' },
    { id: 'enthusiastic', label: 'حماسي ومرح', icon: '⚡' },
  ];

  const handleAddFaq = () => {
    if (!currentFaq.question || !currentFaq.answer) return;
    setFormData({
      ...formData,
      faqs: [...formData.faqs, { ...currentFaq }]
    });
    setCurrentFaq({ question: '', answer: '' });
  };

  const handleRemoveFaq = (index: number) => {
    const newFaqs = [...formData.faqs];
    newFaqs.splice(index, 1);
    setFormData({ ...formData, faqs: newFaqs });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            تخصيص المساعد الذكي
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">تحكم في شخصية وكفاءة المساعد الآلي لمتجرك.</p>
        </div>
        
        <div className="flex items-center gap-4 p-1.5 bg-background border rounded-2xl shadow-sm">
          <div className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors ${formData.isActive ? 'text-green-600' : 'text-muted-foreground'}`}>
            <span className={`size-2 rounded-full animate-pulse ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            {formData.isActive ? 'المساعد متصل' : 'المساعد متوقف'}
          </div>
          <button
            type="button"
            onClick={handleToggleActive}
            disabled={isLoading}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-all duration-300 focus:outline-none ${formData.isActive ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-gray-200'} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span className={`inline-block size-6 transform rounded-full bg-white transition-transform duration-300 ${formData.isActive ? 'translate-x-1 rtl:-translate-x-7' : 'translate-x-7 rtl:-translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('identity')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'identity' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <User className="size-5" />
            شخصية البوت
          </button>
          <button 
            onClick={() => setActiveTab('faq')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'faq' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <ShieldQuestion className="size-5" />
            الأسئلة الشائعة
          </button>
          <button 
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'system' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Settings2 className="size-5" />
            القواعد المتقدمة
          </button>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="lg:col-span-9 flex flex-col gap-6">
          <div className={`bg-card border rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden transition-all duration-500 ${formData.isActive ? 'opacity-100' : 'opacity-50 grayscale pointer-events-none'}`}>
            
            <div className="p-8 md:p-10">
              {/* Tab: Identity */}
              {activeTab === 'identity' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
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
                        className="rounded-2xl h-12 bg-muted/30 border-none focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-3 text-start">
                      <Label className="text-base font-bold">نبرة الحديث</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {toneOptions.map((option) => (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => setFormData({ ...formData, tone: option.id })}
                            className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-start ${
                              formData.tone === option.id 
                                ? 'border-primary bg-primary/5 shadow-md' 
                                : 'border-transparent bg-muted/30 hover:bg-muted/50'
                            }`}
                          >
                            <span className="text-2xl">{option.icon}</span>
                            <span className="font-bold text-sm tracking-tight">{option.label}</span>
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
                        className="flex min-h-[120px] w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                        value={formData.systemPrompt}
                        onChange={e => setFormData({ ...formData, systemPrompt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: FAQ */}
              {activeTab === 'faq' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                      <ShieldQuestion className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">قاعدة بيانات الأسئلة الشائعة</h3>
                      <p className="text-sm text-muted-foreground">أضف معلومات دقيقة ليتمكن البوت من الإجابة عليها</p>
                    </div>
                  </div>

                  <div className="bg-muted/20 p-6 rounded-3xl border-2 border-dashed border-muted/50 text-start">
                    <div className="flex flex-col gap-4">
                      <div className="grid gap-2">
                        <Label className="font-bold">السؤال المكرر</Label>
                        <Input
                          placeholder="مثلاً: كم يستغرق الشحن؟"
                          value={currentFaq.question}
                          onChange={e => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                          className="rounded-xl border-none bg-background shadow-sm h-11"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="font-bold">الإجابة المعتمدة</Label>
                        <textarea
                          rows={2}
                          placeholder="الشحن يستغرق من 2-5 أيام عمل لجميع مناطق المملكة."
                          value={currentFaq.answer}
                          onChange={e => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                          className="flex min-h-[80px] w-full rounded-xl border-none bg-background px-4 py-3 text-sm shadow-sm focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={handleAddFaq}
                        className="rounded-xl self-end px-8 font-bold"
                        disabled={!currentFaq.question || !currentFaq.answer}
                      >
                        <Plus className="size-4 ml-2" />
                        إضافة للسجل
                      </Button>
                    </div>
                  </div>

                  {formData.faqs.length > 0 && (
                    <div className="grid gap-4 text-start">
                      <h4 className="font-bold text-lg px-2">الأسئلة والردود الحالية ({formData.faqs.length})</h4>
                      <div className="flex flex-col gap-3">
                        {formData.faqs.map((faq: { question: string; answer: string }, index: number) => (
                          <div key={index} className="group flex flex-col gap-2 p-5 bg-muted/10 border rounded-2xl hover:border-primary/30 transition-all relative">
                            <div className="flex justify-between items-start">
                              <span className="bg-primary/10 text-primary text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">FAQ Item</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFaq(index)}
                                className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="size-4" />
                              </button>
                            </div>
                            <p className="font-bold text-blue-900 leading-tight">س: {faq.question}</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">ج: {faq.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: System */}
              {activeTab === 'system' && (activeTab === 'system') && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="size-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Settings2 className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">القواعد والسياسات</h3>
                      <p className="text-sm text-muted-foreground">متى يجب أن يتوقف البوت ويطلب تدخل بشري؟</p>
                    </div>
                  </div>

                  <div className="grid gap-6 text-start">
                    <div className="grid gap-2">
                       <Label htmlFor="escalationRules" className="text-base font-bold flex items-center gap-2">
                        <AlertTriangle className="size-4 text-amber-500" />
                        قواعد التصعيد (Escalation)
                      </Label>
                      <p className="text-xs text-muted-foreground mb-2">أدخل الحالات التي يجب فيها تحويل المحادثة لأحد الموظفين.</p>
                      <textarea
                        id="escalationRules"
                        rows={5}
                        placeholder="مثلاً: عند الطلب المتكرر للتحدث مع بشري، أو عند الشكاوى الفنية المعقدة..."
                        className="flex min-h-[140px] w-full rounded-2xl border-none bg-muted/30 px-4 py-3 text-sm shadow-inner focus:ring-2 focus:ring-primary outline-none"
                        value={formData.escalationRules}
                        onChange={e => setFormData({ ...formData, escalationRules: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="border-t bg-muted/10 px-8 py-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground hidden md:block">يتم حفظ جميع التعديلات في قاعدة البيانات بشكل فوري عند الضغط على حفظ.</p>
              <Button 
                type="submit" 
                disabled={isLoading}
                size="lg"
                className={`rounded-2xl px-12 font-bold transition-all duration-300 h-12 ${isSaved ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20' : 'shadow-lg shadow-primary/20'}`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    جاري الحفظ
                  </span>
                ) : isSaved ? (
                  <>
                    <Check className="size-5 ml-2" />
                    تم الحفظ بنجاح
                  </>
                ) : (
                  <>
                    <Save className="size-5 ml-2" />
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


