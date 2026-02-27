'use client';

import { useState } from 'react';
import { 
  Plus, Calendar as CalendarIcon, Search, MoreHorizontal, 
  Edit, Trash2, X, Clock, User, 
  CheckCircle2, ShoppingCart
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';

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
import { createBooking, updateBooking, deleteBooking, deleteBookings, updateBookingsStatus } from './actions';

export default function BookingsClient({ initialBookings, products }: { initialBookings: any[], products: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState(initialBookings || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    bookingDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    status: 'upcoming',
    notes: '',
    source: 'whatsapp',
    socialUsername: '',
    cart: [] as any[],
  });

  const [currentProduct, setCurrentProduct] = useState({ id: '', quantity: '1' });
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);

  const handleOpenModal = () => {
    setEditingBookingId(null);
    setFormData({ 
      customerName: '', 
      contactInfo: '', 
      bookingDate: format(new Date(), "yyyy-MM-dd'T'HH:mm"), 
      status: 'upcoming', 
      notes: '',
      source: 'whatsapp',
      socialUsername: '',
      cart: [],
    });
    setCurrentProduct({ id: '', quantity: '1' });
    setIsModalOpen(true);
  };
  
  const handleEdit = (booking: any) => {
    setEditingBookingId(booking.id);
    setFormData({
      customerName: booking.customerName,
      contactInfo: booking.contactInfo,
      bookingDate: format(new Date(booking.bookingDate), "yyyy-MM-dd'T'HH:mm"),
      status: booking.status,
      notes: booking.notes || '',
      source: booking.source || 'whatsapp',
      socialUsername: booking.socialUsername || '',
      cart: booking.cart || [],
    });
    setCurrentProduct({ id: '', quantity: '1' });
    setIsModalOpen(true);
  };
  
  const handleAddToCart = () => {
    if (!currentProduct.id) return;
    
    setFormData(prev => {
      const existingProductIndex = prev.cart.findIndex((item: any) => item.productId === currentProduct.id);
      
      if (existingProductIndex >= 0) {
        const updatedCart = [...prev.cart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: (Number(updatedCart[existingProductIndex].quantity) + Number(currentProduct.quantity)).toString()
        };
        return { ...prev, cart: updatedCart };
      } else {
        return {
          ...prev,
          cart: [...prev.cart, { productId: currentProduct.id, quantity: currentProduct.quantity }]
        };
      }
    });

    setCurrentProduct({ id: '', quantity: '1' });
  };
  
  const handleRemoveFromCart = (index: number) => {
    const newCart = [...formData.cart];
    newCart.splice(index, 1);
    setFormData({ ...formData, cart: newCart });
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingBookingId) {
        const updatedBooking = await updateBooking(editingBookingId, formData);
        setBookings(bookings.map(b => b.id === editingBookingId ? updatedBooking : b));
      } else {
        const newBooking = await createBooking(formData);
        const newBookings = [newBooking, ...bookings].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime());
        setBookings(newBookings);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save booking', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا الموعد؟')) return;
    try {
      await deleteBooking(id);
      setBookings(bookings.filter(b => b.id !== id));
    } catch (error) {
      console.error('Failed to delete booking', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-100 text-blue-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-blue-50">
            <Clock className="size-3" />
            قادم
          </span>
        );
      case 'completed': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-emerald-50">
            <CheckCircle2 className="size-3" />
            مكتمل
          </span>
        );
      case 'cancelled': 
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-100 text-red-700 text-[10px] font-extrabold uppercase tracking-widest ring-4 ring-red-50">
            <X className="size-3" />
            ملغي
          </span>
        );
      default: return <Badge className="rounded-xl">{status}</Badge>;
    }
  };

  const getRelativeDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: arSA });
  };

  const filteredBookings = bookings.filter(b => {
    const cartMatches = (b.cart || []).some((item: any) => {
       const prod = products.find(p => p.id.toString() === item.productId?.toString());
       return prod && prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    });
    
    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.contactInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.socialUsername && b.socialUsername.toLowerCase().includes(searchQuery.toLowerCase())) ||
    cartMatches ||
    (b.notes && b.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter ? b.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedBookingIds(filteredBookings.map(b => b.id));
    } else {
      setSelectedBookingIds([]);
    }
  };

  const handleSelectBooking = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedBookingIds(prev => [...prev, id]);
    } else {
      setSelectedBookingIds(prev => prev.filter(bid => bid !== id));
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`هل أنت متأكد من حذف ${selectedBookingIds.length} موعد؟`)) return;
    try {
      await deleteBookings(selectedBookingIds);
      setBookings(bookings.filter(b => !selectedBookingIds.includes(b.id)));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to delete bookings', error);
      alert('حدث خطأ أثناء الحذف');
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      await updateBookingsStatus(selectedBookingIds, status);
      setBookings(bookings.map(b => selectedBookingIds.includes(b.id) ? { ...b, status } : b));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to update bookings status', error);
      alert('حدث خطأ أثناء تحديث الحالة');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            نظام الحجوزات والمواعيد
          </h1>
          <p className="text-muted-foreground mt-1 font-medium">إدارة الطلبات، المواعيد، والاجتماعات في مكان واحد.</p>
        </div>
        <Button onClick={handleOpenModal} className="rounded-2xl h-11 px-8 font-bold flex gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <Plus className="size-5" />
          حجز جديد
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="size-5" />
            </div>
            <Input 
              placeholder="ابحث بالاسم، التواصل، أو تفاصيل الحجز..." 
              className="rounded-2xl h-14 pr-12 bg-card border-none shadow-xl shadow-gray-100/40 text-lg focus-visible:ring-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="rounded-2xl h-14 px-6 bg-card border-none shadow-xl shadow-gray-100/40 text-base font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary w-full sm:w-auto min-w-[150px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="upcoming">قادم / مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
        <div className="lg:col-span-4 flex items-center gap-4 bg-muted/20 p-2 rounded-2xl border border-white/50 h-14 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-tighter">قادمة</span>
            <span className="text-xl font-black text-blue-600">{bookings.filter(b => b.status === 'upcoming').length}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-tighter">إجمالي الحجوزات</span>
            <span className="text-xl font-black text-primary">{bookings.length}</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between mb-4">
        {selectedBookingIds.length > 0 && (
          <div className="flex flex-wrap gap-2 animate-in fade-in zoom-in-95 duration-200">
            <Button 
              onClick={handleBulkDelete}
              variant="destructive" 
              className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-red-500/20"
            >
              <Trash2 className="size-4 mr-2 ml-1" />
              حذف المحدد ({selectedBookingIds.length})
            </Button>
            <Button 
              onClick={() => handleBulkStatusUpdate('completed')}
              className="rounded-xl h-10 px-6 font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 text-white"
            >
              <CheckCircle2 className="size-4 mr-2 ml-1" />
              تحديد كمكتمل
            </Button>
            <Button 
              onClick={() => handleBulkStatusUpdate('cancelled')}
              variant="outline"
              className="rounded-xl h-10 px-6 font-bold hover:bg-red-50 hover:text-red-600 border-red-200 text-red-500 bg-white"
            >
              <X className="size-4 mr-2 ml-1" />
              إلغاء المواعيد
            </Button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="bg-card border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        {bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-24 rounded-[2rem] bg-muted/30 flex items-center justify-center mb-6 text-muted-foreground/30 animate-pulse">
              <CalendarIcon className="size-12" />
            </div>
            <h3 className="text-3xl font-black text-muted-foreground mb-3">لا توجد حجوزات</h3>
            <p className="text-base text-muted-foreground max-w-sm mx-auto italic">سيظهر هنا أي موعد أو حجز يقوم الذكاء الاصطناعي بتنظيمه.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/10 border-b">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-6 px-6 w-12">
                  <input 
                    type="checkbox" 
                    className="size-5 rounded-md border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                    checked={filteredBookings.length > 0 && selectedBookingIds.length === filteredBookings.length}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="py-6 px-4 font-black text-sm uppercase tracking-widest text-start">العميل</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">المنتجات</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">الموعد</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">الحالة</TableHead>
                <TableHead className="py-6 px-8 font-black text-sm uppercase tracking-widest text-end">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow 
                  key={booking.id} 
                  className={`group hover:bg-muted/5 border-b last:border-0 transition-all cursor-pointer ${selectedBookingIds.includes(booking.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                  onClick={() => handleEdit(booking)}
                >
                  <TableCell className="py-5 px-6" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="size-5 rounded-md border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                      checked={selectedBookingIds.includes(booking.id)}
                      onChange={(e) => handleSelectBooking(booking.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className="flex items-center gap-4 text-start">
                      <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner shrink-0">
                        <User className="size-7" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">{booking.customerName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground font-medium" dir="ltr">{booking.contactInfo}</span>
                          {booking.socialUsername && (
                            <span className="text-xs text-blue-500 font-bold" dir="ltr">@{booking.socialUsername}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                      {booking.cart && booking.cart.length > 0 ? (
                        booking.cart.map((item: any, i: number) => {
                          const prod = products.find(p => p.id.toString() === item.productId?.toString());
                          if (!prod) return null;
                          return (
                            <span key={i} className="px-3 py-1 rounded-xl bg-primary/5 text-primary border border-primary/10 text-xs font-bold shadow-sm">
                              {item.quantity}x {prod.name}
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-muted-foreground italic text-sm font-medium">خدمة / عام</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <div className="flex flex-col text-start">
                      <div className="flex items-center gap-2 font-black text-base text-gray-800 tracking-tighter">
                        <CalendarIcon className="size-4 text-primary/60" />
                        <span dir="ltr">{format(new Date(booking.bookingDate), "PPp", { locale: arSA })}</span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 font-bold">{getRelativeDate(booking.bookingDate)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {getStatusBadge(booking.status)}
                  </TableCell>
                  <TableCell className="py-5 px-8 text-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="group-hover:bg-muted rounded-2xl h-10 w-10 transition-all">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-muted/50 shadow-2xl min-w-[200px]">
                        <DropdownMenuItem onClick={() => handleEdit(booking)} className="flex gap-3 py-3 rounded-xl font-bold text-base cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                          <Edit className="size-5" />
                          تعديل الحجز
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(booking.id)} className="flex gap-3 py-3 rounded-xl font-bold text-base cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
                          <Trash2 className="size-5" />
                          حذف الموعد
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

      {/* Modern Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between p-8 border-b bg-muted/10">
              <div className="flex items-center gap-4 text-start">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {editingBookingId ? <Edit className="size-7" /> : <Plus className="size-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {editingBookingId ? 'تعديل بيانات الحجز' : 'إضافة حجز يدوي'}
                  </h2>
                  <p className="text-sm text-muted-foreground font-bold mt-1 italic">نظم جدولك باحترافية وسهولة.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all size-12">
                <X className="size-7" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 text-start scrollbar-hide">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">اسم العميل</Label>
                    <Input
                      required
                      placeholder="مثلاً: محمد علي"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner text-xl font-bold"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">رقم التواصل / المعرف</Label>
                    <Input
                      placeholder="+966 50 000 0000"
                      value={formData.contactInfo}
                      onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner text-xl font-bold"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">المصدر / القناة</Label>
                    <select
                      className="h-16 rounded-2xl bg-muted/50 border-none px-6 text-base font-bold focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer hover:bg-muted transition-colors"
                      value={formData.source}
                      onChange={e => setFormData({ ...formData, source: e.target.value })}
                    >
                      <option value="whatsapp">واتساب (WhatsApp)</option>
                      <option value="instagram">إنستجرام (Instagram)</option>
                      <option value="facebook">فيسبوك (Messenger)</option>
                      <option value="manual">يدوي / مباشر</option>
                    </select>
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">اسم المستخدم (السوشيال)</Label>
                    <Input
                      placeholder="@username"
                      value={formData.socialUsername}
                      onChange={e => setFormData({ ...formData, socialUsername: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner text-xl font-bold"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Shopping Cart Section Improved */}
                <div className="p-8 rounded-[2rem] bg-indigo-50/30 border border-indigo-100/60 shadow-inner space-y-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                      <ShoppingCart className="size-6" />
                    </div>
                    <Label className="text-lg font-black text-indigo-900">سلة المنتجات المطلوبة</Label>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-6 lg:col-span-7">
                      <select
                        className="w-full h-14 rounded-xl bg-white border-2 border-transparent hover:border-indigo-100 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50 px-4 text-sm font-bold outline-none cursor-pointer transition-all shadow-sm"
                        value={currentProduct.id}
                        onChange={e => setCurrentProduct({ ...currentProduct, id: e.target.value })}
                      >
                        <option value="">اختر منتجاً أو خدمة...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.name} - {p.price} {p.currency}</option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3 lg:col-span-2">
                       <Input
                          type="number"
                          min="1"
                          placeholder="الكمية"
                          className="w-full h-14 rounded-xl border-none shadow-sm bg-white text-center font-bold text-base focus-visible:ring-indigo-300"
                          value={currentProduct.quantity}
                          onChange={e => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                        />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-3">
                      <Button type="button" onClick={handleAddToCart} className="w-full h-14 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all active:scale-95">
                        <Plus className="size-4 ml-1" />
                        إضافة
                      </Button>
                    </div>
                  </div>

                  {formData.cart.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                      {formData.cart.map((item, i) => {
                        const prod = products.find(p => p.id.toString() === item.productId?.toString());
                        return (
                          <div key={i} className="group flex items-center justify-between bg-white p-4 rounded-2xl border border-indigo-50 shadow-sm transition-all hover:shadow-md hover:border-indigo-200 animate-in zoom-in-95">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center justify-center size-8 rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm">{item.quantity}x</span>
                              <span className="font-bold text-base text-gray-800 line-clamp-1">{prod?.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFromCart(i)} className="size-10 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 opacity-50 group-hover:opacity-100 transition-all">
                              <X className="size-5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">تاريخ ووقت الموعد</Label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.bookingDate}
                      onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner text-xl font-bold"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="text-lg font-black px-1">حالة الموعد</Label>
                    <select
                      className="h-16 rounded-2xl bg-muted/50 border-none px-6 text-base font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:bg-muted transition-colors"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="upcoming">⏳ قادم / مؤكد</option>
                      <option value="completed">✅ مكتمل</option>
                      <option value="cancelled">❌ ملغي</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Label className="text-lg font-black px-1">تفاصيل وملاحظات (اختياري)</Label>
                  <textarea
                    rows={4}
                    placeholder="أي تعليمات إضافية تتعلق بهذا الحجز..."
                    className="flex min-h-[140px] w-full rounded-[2rem] bg-muted/30 p-6 text-base font-medium border-none focus:ring-2 focus:ring-primary outline-none resize-none shadow-inner leading-relaxed"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col sm:flex-row gap-4">
                <Button type="submit" size="lg" className="flex-1 rounded-2xl h-16 font-black text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95 transition-all text-white" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : editingBookingId ? 'تعديل بيانات الحجز' : 'إنشاء الحجز الآن'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="h-16 px-10 rounded-2xl font-bold text-lg bg-muted/20 hover:bg-muted transition-all">
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

