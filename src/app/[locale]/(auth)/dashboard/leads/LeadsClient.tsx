'use client';

import { useState } from 'react';
import { 
  Plus, Users, Search, MoreHorizontal, 
  Edit, Trash2, X, MessageSquare, 
  TrendingUp, UserCheck, UserMinus, UserPlus,
  Instagram, Facebook, Phone
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createLead, updateLead, deleteLead } from './actions';

export default function LeadsClient({ initialLeads }: { initialLeads: any[] }) {
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
    if (!confirm('هل أنت متأكد من حذف هذا العميل؟')) return;
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
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
          <Phone className="size-3" />
          واتساب
        </span>
      );
      case 'instagram': return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 text-pink-700 text-[10px] font-bold border border-pink-100">
          <Instagram className="size-3" />
          انستقرام
        </span>
      );
      case 'messenger': return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
          <Facebook className="size-3" />
          ماسنجر
        </span>
      );
      default: return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 text-gray-700 text-[10px] font-bold border border-gray-100">
          إضافة يدوية
        </span>
      );
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-blue-50/50">
          <UserPlus className="size-3" />
          جديد
        </span>
      );
      case 'interested': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-100 text-amber-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-amber-50/50">
          <TrendingUp className="size-3" />
          مهتم
        </span>
      );
      case 'negotiating': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-100 text-purple-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-purple-50/50">
          <MessageSquare className="size-3" />
          تفاوض
        </span>
      );
      case 'closed_won': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-emerald-50/50">
          <UserCheck className="size-3" />
          تم البيع
        </span>
      );
      case 'closed_lost': return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-100 text-gray-500 text-[10px] font-extrabold uppercase tracking-widest">
          <UserMinus className="size-3" />
          انسحاب
        </span>
      );
      default: return <Badge className="rounded-xl">{status}</Badge>;
    }
  };

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.contactMethod.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            إدارة العملاء والمهتمين
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic">تتبع رحلة عملائك من أول محادثة حتى إتمام البيع.</p>
        </div>
        <Button onClick={handleOpenModal} className="rounded-2xl h-11 px-8 font-bold flex gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <Plus className="size-5" />
          إضافة عميل
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 relative group">
          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="size-5" />
          </div>
          <Input 
            placeholder="ابحث عن اسم أو وسيلة تواصل..." 
            className="rounded-2xl h-14 pr-12 bg-card border-none shadow-xl shadow-gray-100/40 text-lg focus-visible:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="lg:col-span-4 flex items-center gap-4 bg-muted/20 p-2 rounded-2xl border border-white/50 h-14 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-tighter">عملاء نشطون</span>
            <span className="text-xl font-black text-emerald-600">{leads.filter(l => l.status === 'closed_won').length}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-tighter">قيد المتابعة</span>
            <span className="text-xl font-black text-primary">{leads.filter(l => ['new', 'interested', 'negotiating'].includes(l.status)).length}</span>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-card border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-24 rounded-[2rem] bg-muted/30 flex items-center justify-center mb-6 text-muted-foreground/30 animate-pulse">
              <Users className="size-12" />
            </div>
            <h3 className="text-2xl font-black text-muted-foreground mb-2">لا يوجد عملاء حالياً</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto italic">المحادثات الجديدة من السوشيال ميديا ستظهر هنا تلقائياً.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/10 border-b">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-6 px-8 font-black text-xs uppercase tracking-widest text-start">العميل</TableHead>
                <TableHead className="py-6 px-6 font-black text-xs uppercase tracking-widest text-start">المصدر</TableHead>
                <TableHead className="py-6 px-6 font-black text-xs uppercase tracking-widest text-start">وسيلة التواصل</TableHead>
                <TableHead className="py-6 px-6 font-black text-xs uppercase tracking-widest text-start">المرحلة</TableHead>
                <TableHead className="py-6 px-8 font-black text-xs uppercase tracking-widest text-end font-bold">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="group hover:bg-muted/5 border-b last:border-0 transition-all">
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-4 text-start">
                      <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner text-lg font-black italic">
                        {lead.name.substring(0, 1)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors text-lg">{lead.name}</span>
                        <span className="text-[10px] text-muted-foreground italic truncate max-w-[150px]">{lead.notes || 'بدون ملاحظات'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {getSourceBadge(lead.source)}
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <span className="text-sm font-bold text-gray-700 font-mono tracking-tighter" dir="ltr">{lead.contactMethod}</span>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {getStatusBadge(lead.status)}
                  </TableCell>
                  <TableCell className="py-5 px-8 text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="group-hover:bg-muted rounded-2xl h-10 w-10 transition-all">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-muted/50 shadow-2xl min-w-[160px]">
                        <DropdownMenuItem onClick={() => handleEdit(lead)} className="flex gap-3 py-3 rounded-xl font-bold text-sm cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                          <Edit className="size-4" />
                          مراجعة العميل
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(lead.id)} className="flex gap-3 py-3 rounded-xl font-bold text-sm cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between p-8 border-b bg-muted/10">
              <div className="flex items-center gap-4 text-start">
                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {editingLeadId ? <Edit className="size-6" /> : <Plus className="size-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-start">
                    {editingLeadId ? 'تحديث ملف العميل' : 'إضافة عميل جديد'}
                  </h2>
                  <p className="text-xs text-muted-foreground font-bold italic">قم ببناء قاعدة بيانات عملائك بذكاء.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                <X className="size-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 text-start scrollbar-hide">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-base font-black px-1">اسم العميل</Label>
                  <Input
                    id="name"
                    required
                    placeholder="مثلاً: محمد أحمد"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="h-14 rounded-2xl bg-muted/30 border-none shadow-inner focus-visible:ring-primary text-lg font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="contactMethod" className="text-base font-black px-1">وسيلة التواصل</Label>
                    <Input
                      id="contactMethod"
                      required
                      placeholder="+966 50 000 0000"
                      value={formData.contactMethod}
                      onChange={e => setFormData({ ...formData, contactMethod: e.target.value })}
                      className="h-14 rounded-2xl bg-muted/30 border-none shadow-inner text-lg font-bold"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="source" className="text-base font-black px-1">المصدر</Label>
                    <select
                      id="source"
                      className="h-14 rounded-2xl bg-muted/50 border-none px-6 text-sm font-bold shadow-sm outline-none cursor-pointer"
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
                  <Label htmlFor="status" className="text-base font-black px-1 text-start">المرحلة الحالية</Label>
                  <select
                    id="status"
                    className="h-14 rounded-2xl bg-muted/50 border-none px-6 text-sm font-bold shadow-sm outline-none cursor-pointer"
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
                  <Label htmlFor="notes" className="text-base font-black px-1">ملاحظات المحادثة والاهتمامات</Label>
                  <textarea
                    id="notes"
                    rows={4}
                    placeholder="اكتب هنا أي تفاصيل حول ما يريده العميل أو ملخص محادثته لتذكيرك مستقبلاً..."
                    className="flex min-h-[140px] w-full rounded-[2rem] bg-muted/30 p-6 text-sm font-medium border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-inner"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col sm:flex-row gap-4">
                <Button type="submit" size="lg" className="flex-1 rounded-2xl h-14 font-black text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95 transition-all" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : editingLeadId ? 'تعديل البيانات' : 'حفظ ملف العميل'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="h-14 px-8 rounded-2xl font-bold bg-muted/20 hover:bg-muted transition-all">
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

