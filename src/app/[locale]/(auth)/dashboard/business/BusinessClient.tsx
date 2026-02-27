'use client';

import { useState } from 'react';
import { 
  Save, Clock, Check, Info, ShieldCheck, 
  Building2, CreditCard, Plus, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { saveBusinessProfile } from './actions';

export default function BusinessClient({ profile }: { profile: any }) {
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
      bankAccounts: [...formData.bankAccounts, { bankName: '', accountName: '', accountNumber: '' }]
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
    <div className="flex flex-col gap-8 w-full max-w-6xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            بيانات النشاط التجاري
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">أدخل بيانات متجرك بدقة لتدريب الذكاء الاصطناعي على نشاطك.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'general' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Building2 className="size-5" />
            المعلومات الأساسية
          </button>
          <button 
            onClick={() => setActiveTab('hours')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'hours' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <Clock className="size-5" />
            المواعيد والسياسات
          </button>
          <button 
            onClick={() => setActiveTab('payment')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${activeTab === 'payment' ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' : 'hover:bg-muted text-muted-foreground'}`}
          >
            <CreditCard className="size-5" />
            بيانات الدفع
          </button>
        </div>

        {/* Main Form Content */}
        <form onSubmit={handleSubmit} className="lg:col-span-9 flex flex-col gap-6">
          <div className="bg-card border rounded-[2rem] shadow-xl shadow-gray-100/50 overflow-hidden min-h-[500px]">
            <div className="p-8 md:p-10">
              {/* Tab: General Info */}
              {activeTab === 'general' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6 text-start">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-start">
                      <Info className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-start">معلومات النشاط</h3>
                      <p className="text-sm text-muted-foreground text-start">الاسم، الوصف، وبيانات التواصل</p>
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
                        className="rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-base"
                      />
                    </div>

                    <div className="grid gap-2 text-start">
                      <Label htmlFor="businessDescription" className="text-lg font-bold">عن المتجر (وصف للـ AI)</Label>
                      <textarea
                        id="businessDescription"
                        rows={5}
                        placeholder="نحن متجر متخصص في بيع..."
                        className="flex min-h-[140px] w-full rounded-2xl border-none bg-muted/30 px-5 py-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all leading-relaxed"
                        value={formData.businessDescription}
                        onChange={e => setFormData({ ...formData, businessDescription: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 items-start">
                      <div className="grid gap-2 text-start">
                        <Label htmlFor="phoneNumber" className="text-lg font-bold">رقم التواصل</Label>
                        <Input
                          id="phoneNumber"
                          placeholder="+966xxxxxxxxx"
                          value={formData.phoneNumber}
                          onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-start text-base"
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
                          className="rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-base"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Hours & Policies */}
              {activeTab === 'hours' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="size-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600">
                      <Clock className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-start">المواعيد والسياسات</h3>
                      <p className="text-base text-muted-foreground text-start">أوقات العمل المتاحة وسياسات المتجر</p>
                    </div>
                  </div>

                  <div className="grid gap-8 text-start">
                    <div className="grid gap-2">
                       <Label htmlFor="workingHours" className="text-lg font-bold flex items-center gap-2">
                        ساعات العمل
                      </Label>
                      <Input
                        id="workingHours"
                        placeholder="يومياً من الساعة 9 ص حتى 10 م"
                        value={formData.workingHours}
                        onChange={e => setFormData({ ...formData, workingHours: e.target.value })}
                        className="rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-base"
                      />
                    </div>

                    <div className="grid gap-2">
                       <Label htmlFor="policies" className="text-lg font-bold flex items-center gap-2">
                        <ShieldCheck className="size-5 text-emerald-500 -mt-0.5" />
                        سياسات الشحن والاسترجاع
                      </Label>
                      <p className="text-sm text-muted-foreground mb-2">هذه المعلومات ضرورية ليتمكن البوت من طمأنة العملاء.</p>
                      <textarea
                        id="policies"
                        rows={6}
                        placeholder="نسمح بالاسترجاع خلال 3 أيام، الشحن يستغرق يومين..."
                        className="flex min-h-[160px] w-full rounded-2xl border-none bg-muted/30 px-5 py-4 text-base shadow-inner focus:ring-2 focus:ring-primary outline-none leading-relaxed"
                        value={formData.policies}
                        onChange={e => setFormData({ ...formData, policies: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Payment Info */}
              {activeTab === 'payment' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8">
                  <div className="flex items-center gap-3 border-b pb-6">
                    <div className="size-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                      <CreditCard className="size-7" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-start">بيانات الدفع والحسابات</h3>
                      <p className="text-base text-muted-foreground text-start">وسائل الدفع المتاحة وأرقام الحسابات البنكية</p>
                    </div>
                  </div>

                  <div className="grid gap-8 text-start">
                    <div className="grid gap-2">
                       <Label htmlFor="paymentMethods" className="text-lg font-bold flex items-center gap-2">
                        وسائل الدفع المتاحة
                      </Label>
                      <Input
                        id="paymentMethods"
                        placeholder="مدى، فيزا، أبل باي، تحويل بنكي..."
                        value={formData.paymentMethods}
                        onChange={e => setFormData({ ...formData, paymentMethods: e.target.value })}
                        className="rounded-2xl h-14 bg-muted/30 border-none focus-visible:ring-primary text-base"
                      />
                    </div>

                    <div className="grid gap-4">
                       <div className="flex items-center justify-between">
                         <Label className="text-lg font-bold flex items-center gap-2">
                           أرقام الحسابات البنكية (الآيبان)
                         </Label>
                         <Button type="button" onClick={handleAddBankAccount} variant="outline" size="sm" className="rounded-xl h-9 gap-1 font-bold text-xs bg-muted/20 hover:bg-muted">
                           <Plus className="size-3" />
                           إضافة حساب
                         </Button>
                       </div>
                       <p className="text-sm text-muted-foreground mb-1 -mt-2">يمكن للذكاء الاصطناعي تقديم هذه الحسابات للعملاء عند طلب التحويل.</p>
                       
                       <div className="space-y-3">
                         {formData.bankAccounts.length === 0 && (
                           <div className="text-center py-6 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                             <p className="text-sm text-muted-foreground italic font-medium">لم تقم بإضافة أي حسابات بنكية بعد.</p>
                           </div>
                         )}
                         {formData.bankAccounts.map((account: any, index: number) => (
                           <div key={index} className="flex flex-col sm:flex-row gap-3 items-center bg-muted/20 p-3 rounded-2xl border border-white/50 animate-in fade-in zoom-in-95 duration-200">
                             <Input
                               placeholder="اسم البنك (مثال: الراجحي)"
                               value={account.bankName}
                               onChange={(e) => handleUpdateBankAccount(index, 'bankName', e.target.value)}
                               className="h-12 rounded-xl bg-background border-none shadow-sm focus-visible:ring-primary w-full sm:w-1/3 text-sm font-bold"
                             />
                             <Input
                               placeholder="اسم صاحب الحساب"
                               value={account.accountName}
                               onChange={(e) => handleUpdateBankAccount(index, 'accountName', e.target.value)}
                               className="h-12 rounded-xl bg-background border-none shadow-sm focus-visible:ring-primary w-full sm:w-1/3 text-sm font-bold"
                             />
                             <div className="flex w-full sm:w-1/3 gap-2">
                               <Input
                                 placeholder="رقم الحساب أو الآيبان"
                                 value={account.accountNumber}
                                 onChange={(e) => handleUpdateBankAccount(index, 'accountNumber', e.target.value)}
                                 className="h-12 rounded-xl bg-background border-none shadow-sm focus-visible:ring-primary w-full text-sm font-bold"
                                 dir="ltr"
                               />
                               <Button
                                 type="button"
                                 onClick={() => handleRemoveBankAccount(index)}
                                 variant="ghost" 
                                 size="icon"
                                 className="h-12 w-12 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 shrink-0 transition-colors"
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
            <div className="border-t bg-muted/10 px-8 py-6 flex items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground hidden md:block text-start">احرص على تحديث بياناتك بشكل دوري لضمان دقة ردود المساعد.</p>
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
                    تم الحفظ
                  </>
                ) : (
                  <>
                    <Save className="size-5 ml-2" />
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

