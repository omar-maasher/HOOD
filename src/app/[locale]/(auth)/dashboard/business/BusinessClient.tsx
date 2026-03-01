'use client';

import {
  Building2,
  Check,
  Clock,
  CreditCard,
  Info,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { saveBusinessProfile } from './actions';

export default function BusinessClient({ profile }: { profile: any }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'hours' | 'payment'

  const [formData, setFormData] = useState({
    businessName: profile?.businessName || '',
    businessDescription: profile?.businessDescription || '',
    phoneNumber: profile?.phoneNumber || '',
    address: profile?.address || '',
    workingHours: profile?.workingHours || '',
    policies: profile?.policies || '',
    paymentMethods: profile?.paymentMethods || '',
    bankAccounts: Array.isArray(profile?.bankAccounts) ? profile.bankAccounts : [],
  });

  const handleAddBankAccount = () => {
    setFormData({
      ...formData,
      bankAccounts: [...formData.bankAccounts, { bankName: '', accountName: '', accountNumber: '' }],
    });
  };

  const handleUpdateBankAccount = (index: number, field: string, value: string) => {
    const newAccounts = [...formData.bankAccounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const handleRemoveBankAccount = (index: number) => {
    const newAccounts = [...formData.bankAccounts];
    newAccounts.splice(index, 1);
    setFormData({ ...formData, bankAccounts: newAccounts });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsSaved(false);

    try {
      await saveBusinessProfile(formData);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile', error);
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
            {isAr ? 'بيانات النشاط التجاري' : 'Business Profile'}
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            {isAr ? 'أدخل بيانات متجرك بدقة لتدريب الذكاء الاصطناعي على نشاطك.' : 'Enter your store details accurately to train the AI on your business.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar */}
        <div className="flex flex-col gap-2 lg:col-span-3">
          <button
            type="button"
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'general' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Building2 className="size-5" />
            {isAr ? 'المعلومات الأساسية' : 'General Info'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'hours' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Clock className="size-5" />
            {isAr ? 'المواعيد والسياسات' : 'Hours & Policies'}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-all ${activeTab === 'payment' ? 'scale-[1.02] bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <CreditCard className="size-5" />
            {isAr ? 'بيانات الدفع' : 'Payment Methods'}
          </button>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 lg:col-span-9">
          <div className="min-h-[500px] overflow-hidden rounded-[2rem] border bg-card shadow-xl shadow-gray-100/50">
            <div className="p-8 md:p-10">
              {/* Tab: General Info */}
              {activeTab === 'general' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6 text-start">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-start text-primary">
                      <Info className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-start text-xl font-bold">معلومات النشاط</h3>
                      <p className="text-start text-sm text-muted-foreground">الاسم، الوصف، وبيانات التواصل</p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="grid gap-2 text-start">
                      <Label htmlFor="businessName" className="text-lg font-bold">اسم المتجر / العلامة التجارية</Label>
                      <Input
                        id="businessName"
                        placeholder="مثلاً: متجر هود المطور"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                        className="h-14 rounded-2xl border-none bg-muted/30 text-base focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-2 text-start">
                      <Label htmlFor="businessDescription" className="text-lg font-bold">عن المتجر (وصف للـ AI)</Label>
                      <textarea
                        id="businessDescription"
                        rows={5}
                        placeholder="نحن متجر متخصص في بيع..."
                        className="flex min-h-[140px] w-full rounded-2xl border-none bg-muted/30 px-5 py-4 text-base leading-relaxed transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={formData.businessDescription}
                        onChange={e => setFormData({ ...formData, businessDescription: e.target.value })}
                      />
                    </div>

                    <div className="grid items-start gap-6 sm:grid-cols-2">
                      <div className="grid gap-2 text-start">
                        <Label htmlFor="phoneNumber" className="text-lg font-bold">رقم التواصل</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+966xxxxxxxxx"
                          value={formData.phoneNumber}
                          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="h-14 rounded-2xl border-none bg-muted/30 text-start text-base focus-visible:ring-primary"
                          dir="ltr"
                        />
                      </div>

                      <div className="grid gap-2 text-start">
                        <Label htmlFor="address" className="text-lg font-bold">الموقع / العنوان</Label>
                        <Input
                          id="address"
                          placeholder="مثلاً: الرياض، حي المروج"
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="h-14 rounded-2xl border-none bg-muted/30 text-base focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Hours & Policies */}
              {activeTab === 'hours' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                      <Clock className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-start text-xl font-bold">المواعيد والسياسات</h3>
                      <p className="text-start text-base text-muted-foreground">أوقات العمل المتاحة وسياسات المتجر</p>
                    </div>
                  </div>

                  <div className="grid gap-8 text-start">
                    <div className="grid gap-2">
                      <Label htmlFor="workingHours" className="flex items-center gap-2 text-lg font-bold">
                        ساعات العمل
                      </Label>
                      <Input
                        id="workingHours"
                        placeholder="يومياً من الساعة 9 ص حتى 10 م"
                        value={formData.workingHours}
                        onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                        className="h-14 rounded-2xl border-none bg-muted/30 text-base focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="policies" className="flex items-center gap-2 text-lg font-bold">
                        <ShieldCheck className="-mt-0.5 size-5 text-emerald-500" />
                        سياسات الشحن والاسترجاع
                      </Label>
                      <p className="mb-2 text-sm text-muted-foreground">هذه المعلومات ضرورية ليتمكن البوت من طمأنة العملاء.</p>
                      <textarea
                        id="policies"
                        rows={6}
                        placeholder="نسمح بالاسترجاع خلال 3 أيام، الشحن يستغرق يومين..."
                        className="flex min-h-[160px] w-full rounded-2xl border-none bg-muted/30 px-5 py-4 text-base leading-relaxed shadow-inner outline-none focus:ring-2 focus:ring-primary"
                        value={formData.policies}
                        onChange={e => setFormData({ ...formData, policies: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Payment Info */}
              {activeTab === 'payment' && (
                <div className="flex flex-col gap-8 duration-500 animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600">
                      <CreditCard className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-start text-xl font-bold">بيانات الدفع والحسابات</h3>
                      <p className="text-start text-base text-muted-foreground">وسائل الدفع المتاحة وأرقام الحسابات البنكية</p>
                    </div>
                  </div>

                  <div className="grid gap-8 text-start">
                    <div className="grid gap-2">
                      <Label htmlFor="paymentMethods" className="flex items-center gap-2 text-lg font-bold">
                        وسائل الدفع المتاحة
                      </Label>
                      <Input
                        id="paymentMethods"
                        placeholder="مدى، فيزا، أبل باي، تحويل بنكي..."
                        value={formData.paymentMethods}
                        onChange={e => setFormData({ ...formData, paymentMethods: e.target.value })}
                        className="h-14 rounded-2xl border-none bg-muted/30 text-base focus-visible:ring-primary"
                      />
                    </div>

                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2 text-lg font-bold">
                          أرقام الحسابات البنكية (الآيبان)
                        </Label>
                        <Button type="button" onClick={handleAddBankAccount} variant="outline" size="sm" className="h-9 gap-1 rounded-xl bg-muted/20 text-xs font-bold hover:bg-muted">
                          <Plus className="size-3" />
                          إضافة حساب
                        </Button>
                      </div>
                      <p className="-mt-2 mb-1 text-sm text-muted-foreground">يمكن للذكاء الاصطناعي تقديم هذه الحسابات للعملاء عند طلب التحويل.</p>

                      <div className="space-y-3">
                        {formData.bankAccounts.length === 0 && (
                          <div className="rounded-2xl border border-dashed border-muted-foreground/20 bg-muted/30 py-6 text-center">
                            <p className="text-sm font-medium italic text-muted-foreground">لم تقم بإضافة أي حسابات بنكية بعد.</p>
                          </div>
                        )}
                        {formData.bankAccounts.map((account: any, index: number) => (
                          <div key={`${account.bankName}-${index}`} className="flex flex-col items-center gap-3 rounded-2xl border border-white/50 bg-muted/20 p-3 duration-200 animate-in fade-in zoom-in-95 sm:flex-row">
                            <Input
                              placeholder="اسم البنك (مثال: الراجحي)"
                              value={account.bankName}
                              onChange={e => handleUpdateBankAccount(index, 'bankName', e.target.value)}
                              className="h-12 w-full rounded-xl border-none bg-background text-sm font-bold shadow-sm focus-visible:ring-primary sm:w-1/3"
                            />
                            <Input
                              placeholder="اسم صاحب الحساب"
                              value={account.accountName}
                              onChange={e => handleUpdateBankAccount(index, 'accountName', e.target.value)}
                              className="h-12 w-full rounded-xl border-none bg-background text-sm font-bold shadow-sm focus-visible:ring-primary sm:w-1/3"
                            />
                            <div className="flex w-full gap-2 sm:w-1/3">
                              <Input
                                placeholder="رقم الحساب أو الآيبان"
                                value={account.accountNumber}
                                onChange={e => handleUpdateBankAccount(index, 'accountNumber', e.target.value)}
                                className="h-12 w-full rounded-xl border-none bg-background text-sm font-bold shadow-sm focus-visible:ring-primary"
                                dir="ltr"
                              />
                              <Button
                                type="button"
                                onClick={() => handleRemoveBankAccount(index)}
                                variant="ghost"
                                size="icon"
                                className="size-12 shrink-0 rounded-xl text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                              >
                                <Trash2 className="size-5" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Action Bar */}
            <div className="flex items-center justify-between gap-4 border-t bg-muted/10 px-8 py-6">
              <p className="hidden text-start text-sm text-muted-foreground md:block">احرص على تحديث بياناتك بشكل دوري لضمان دقة ردود المساعد.</p>
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
                          تم الحفظ
                        </>
                      )
                    : (
                        <>
                          <Save className="ml-2 size-5" />
                          حفظ البيانات
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
