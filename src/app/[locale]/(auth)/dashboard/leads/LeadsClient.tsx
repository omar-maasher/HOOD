'use client';

import {
  Edit,
  Facebook,
  Instagram,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { createLead, deleteLead, updateLead } from './actions';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState(initialLeads || []);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    contactMethod: '',
    source: 'whatsapp',
    status: 'new',
    notes: '',
  });

  const [editingLeadId, setEditingLeadId] = useState<number | null>(null);

  const handleOpenModal = () => {
    setEditingLeadId(null);
    setFormData({ name: '', contactMethod: '', source: 'whatsapp', status: 'new', notes: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (lead: any) => {
    setEditingLeadId(lead.id);
    setFormData({
      name: lead.name,
      contactMethod: lead.contactMethod,
      source: lead.source,
      status: lead.status,
      notes: lead.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingLeadId) {
        const updatedLead = await updateLead(editingLeadId, formData);
        setLeads(leads.map(l => l.id === editingLeadId ? updatedLead : l));
      } else {
        const newLead = await createLead(formData);
        setLeads([newLead, ...leads]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save lead', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLead(id);
      setLeads(leads.filter(l => l.id !== id));
    } catch (error) {
      console.error('Failed to delete lead', error);
    }
  };

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'whatsapp': return (
        <span className="flex items-center gap-1.5 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1 text-[10px] font-bold text-emerald-700">
          <Phone className="size-3" />
          واتساب
        </span>
      );
      case 'instagram': return (
        <span className="flex items-center gap-1.5 rounded-xl border border-pink-100 bg-pink-50 px-3 py-1 text-[10px] font-bold text-pink-700">
          <Instagram className="size-3" />
          انستقرام
        </span>
      );
      case 'messenger': return (
        <span className="flex items-center gap-1.5 rounded-xl border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700">
          <Facebook className="size-3" />
          ماسنجر
        </span>
      );
      default: return (
        <span className="flex items-center gap-1.5 rounded-xl border border-gray-100 bg-gray-50 px-3 py-1 text-[10px] font-bold text-gray-700">
          إضافة يدوية
        </span>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-700 ring-4 ring-blue-50/50">
          <UserPlus className="size-3" />
          جديد
        </span>
      );
      case 'interested': return (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-amber-700 ring-4 ring-amber-50/50">
          <TrendingUp className="size-3" />
          مهتم
        </span>
      );
      case 'negotiating': return (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-purple-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-purple-700 ring-4 ring-purple-50/50">
          <MessageSquare className="size-3" />
          تفاوض
        </span>
      );
      case 'closed_won': return (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 ring-4 ring-emerald-50/50">
          <UserCheck className="size-3" />
          تم البيع
        </span>
      );
      case 'closed_lost': return (
        <span className="inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gray-500">
          <UserMinus className="size-3" />
          انسحاب
        </span>
      );
      default: return <Badge className="rounded-xl">{status}</Badge>;
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
    || lead.contactMethod.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-start">
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {isAr ? 'إدارة العملاء والمهتمين' : 'Leads & Customers Management'}
          </h1>
          <p className="mt-1 font-medium italic text-muted-foreground">
            {isAr ? 'تتبع رحلة عملائك من أول محادثة حتى إتمام البيع.' : 'Track your customers\' journey from the first chat until the sale is closed.'}
          </p>
        </div>
        <Button onClick={handleOpenModal} className="flex h-11 gap-2 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="size-5" />
          {isAr ? 'إضافة عميل' : 'Add Lead'}
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="group relative lg:col-span-8">
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-primary">
            <Search className="size-5" />
          </div>
          <Input
            placeholder="ابحث عن اسم أو وسيلة تواصل..."
            className="h-14 rounded-2xl border-none bg-card pr-12 text-lg shadow-xl shadow-gray-100/40 focus-visible:ring-primary"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex h-14 items-center gap-4 overflow-hidden rounded-2xl border border-white/50 bg-muted/20 p-2 lg:col-span-4">
          <div className="flex flex-1 flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="text-[10px] font-extrabold uppercase tracking-tighter text-muted-foreground">عملاء نشطون</span>
            <span className="text-xl font-black text-emerald-600">{leads.filter(l => l.status === 'closed_won').length}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <span className="text-[10px] font-extrabold uppercase tracking-tighter text-muted-foreground">قيد المتابعة</span>
            <span className="text-xl font-black text-primary">{leads.filter(l => ['new', 'interested', 'negotiating'].includes(l.status)).length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-[2rem] border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        {leads.length === 0
          ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex size-24 animate-pulse items-center justify-center rounded-[2rem] bg-muted/30 text-muted-foreground/30">
                  <Users className="size-12" />
                </div>
                <h3 className="mb-2 text-2xl font-black text-muted-foreground">{isAr ? 'لا يوجد عملاء حالياً' : 'No leads currently'}</h3>
                <p className="mx-auto max-w-xs text-sm italic text-muted-foreground">{isAr ? 'المحادثات الجديدة من السوشيال ميديا ستظهر هنا تلقائياً.' : 'New chats from social media will appear here automatically.'}</p>
              </div>
            )
          : (
              <Table>
                <TableHeader className="border-b bg-muted/10">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="px-8 py-6 text-start text-xs font-black uppercase tracking-widest">العميل</TableHead>
                    <TableHead className="p-6 text-start text-xs font-black uppercase tracking-widest">المصدر</TableHead>
                    <TableHead className="p-6 text-start text-xs font-black uppercase tracking-widest">وسيلة التواصل</TableHead>
                    <TableHead className="p-6 text-start text-xs font-black uppercase tracking-widest">المرحلة</TableHead>
                    <TableHead className="px-8 py-6 text-end text-xs font-black uppercase tracking-widest">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map(lead => (
                    <TableRow key={lead.id} className="group border-b transition-all last:border-0 hover:bg-muted/5">
                      <TableCell className="px-8 py-5">
                        <div className="flex items-center gap-4 text-start">
                          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/5 text-lg font-black italic text-primary shadow-inner transition-transform group-hover:scale-110">
                            {lead.name.substring(0, 1)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-lg font-bold text-gray-900 transition-colors group-hover:text-primary">{lead.name}</span>
                            <span className="max-w-[150px] truncate text-[10px] italic text-muted-foreground">{lead.notes || 'بدون ملاحظات'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {getSourceBadge(lead.source)}
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="font-mono text-sm font-bold tracking-tighter text-gray-700" dir="ltr">{lead.contactMethod}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {getStatusBadge(lead.status)}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-end">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-10 rounded-2xl transition-all group-hover:bg-muted">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[160px] rounded-2xl border-muted/50 p-2 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleEdit(lead)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-sm font-bold hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                              <Edit className="size-4" />
                              مراجعة العميل
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-sm font-bold text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
                              <Trash2 className="size-4" />
                              حذف البيانات
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
      </div>

      {/* Modern Modal REDESIGN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-300 animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] bg-card shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] duration-300 animate-in zoom-in-95 slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b bg-muted/10 p-8">
              <div className="flex items-center gap-4 text-start">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {editingLeadId ? <Edit className="size-6" /> : <Plus className="size-6" />}
                </div>
                <div>
                  <h2 className="text-start text-2xl font-black">
                    {editingLeadId ? 'تحديث ملف العميل' : 'إضافة عميل جديد'}
                  </h2>
                  <p className="text-xs font-bold italic text-muted-foreground">قم ببناء قاعدة بيانات عملائك بذكاء.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-2xl transition-all hover:bg-red-50 hover:text-red-500">
                <X className="size-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-8 overflow-y-auto p-10 text-start">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="px-1 text-base font-black">اسم العميل</Label>
                  <Input
                    id="name"
                    required
                    placeholder="مثلاً: محمد أحمد"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 rounded-2xl border-none bg-muted/30 text-lg font-bold shadow-inner focus-visible:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="contactMethod" className="px-1 text-base font-black">وسيلة التواصل</Label>
                    <Input
                      id="contactMethod"
                      required
                      placeholder="+966 50 000 0000"
                      value={formData.contactMethod}
                      onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                      className="h-14 rounded-2xl border-none bg-muted/30 text-lg font-bold shadow-inner"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="source" className="px-1 text-base font-black">المصدر</Label>
                    <select
                      id="source"
                      className="h-14 cursor-pointer rounded-2xl border-none bg-muted/50 px-6 text-sm font-bold shadow-sm outline-none"
                      value={formData.source}
                      onChange={e => setFormData({ ...formData, source: e.target.value })}
                    >
                      <option value="manual">إضافة يدوية</option>
                      <option value="whatsapp">واتساب (WhatsApp)</option>
                      <option value="instagram">انستقرام (Instagram)</option>
                      <option value="messenger">ماسنجر (Facebook)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="status" className="px-1 text-start text-base font-black">المرحلة الحالية</Label>
                  <select
                    id="status"
                    className="h-14 cursor-pointer rounded-2xl border-none bg-muted/50 px-6 text-sm font-bold shadow-sm outline-none"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="new">🌟 عميل جديد</option>
                    <option value="interested">🤔 مهتم بالمنتج</option>
                    <option value="negotiating">💬 جاري التفاوض</option>
                    <option value="closed_won">✅ تم البيع بنجاح</option>
                    <option value="closed_lost">❌ غير مهتم / انسحب</option>
                  </select>
                </div>

                <div className="grid gap-3">
                  <Label htmlFor="notes" className="px-1 text-base font-black">ملاحظات المحادثة والاهتمامات</Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="اكتب هنا أي تفاصيل حول ما يريده العميل أو ملخص محادثته لتذكيرك مستقبلاً..."
                    className="flex min-h-[140px] w-full resize-none rounded-[2rem] border-none bg-muted/30 p-6 text-sm font-medium shadow-inner outline-none transition-all focus:ring-2 focus:ring-primary"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row">
                <Button type="submit" size="lg" className="h-14 flex-1 rounded-2xl bg-primary text-lg font-black shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : editingLeadId ? 'تعديل البيانات' : 'حفظ ملف العميل'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="h-14 rounded-2xl bg-muted/20 px-8 font-bold transition-all hover:bg-muted">
                  إلغاء
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
