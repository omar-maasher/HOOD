'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Edit,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
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

import { createBooking, deleteBooking, deleteBookings, updateBooking, updateBookingsStatus } from './actions';

export default function BookingsClient({ initialBookings, products }: { initialBookings: any[]; products: any[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState(initialBookings || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    bookingDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
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
      bookingDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
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
      bookingDate: format(new Date(booking.bookingDate), 'yyyy-MM-dd\'T\'HH:mm'),
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
    if (!currentProduct.id) {
      return;
    }

    setFormData((prev) => {
      const existingProductIndex = prev.cart.findIndex((item: any) => item.productId === currentProduct.id);

      if (existingProductIndex >= 0) {
        const updatedCart = [...prev.cart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity: (Number(updatedCart[existingProductIndex].quantity) + Number(currentProduct.quantity)).toString(),
        };
        return { ...prev, cart: updatedCart };
      } else {
        return {
          ...prev,
          cart: [...prev.cart, { productId: currentProduct.id, quantity: currentProduct.quantity }],
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
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-blue-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-blue-700 ring-4 ring-blue-50">
            <Clock className="size-3" />
            قادم
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 ring-4 ring-emerald-50">
            <CheckCircle2 className="size-3" />
            مكتمل
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-red-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-red-700 ring-4 ring-red-50">
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

  const filteredBookings = bookings.filter((b) => {
    const cartMatches = (b.cart || []).some((item: any) => {
      const prod = products.find(p => p.id.toString() === item.productId?.toString());
      return prod && prod.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const matchesSearch = b.customerName.toLowerCase().includes(searchQuery.toLowerCase())
      || b.contactInfo.toLowerCase().includes(searchQuery.toLowerCase())
      || (b.socialUsername && b.socialUsername.toLowerCase().includes(searchQuery.toLowerCase()))
      || cartMatches
      || (b.notes && b.notes.toLowerCase().includes(searchQuery.toLowerCase()));

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
    try {
      await deleteBookings(selectedBookingIds);
      setBookings(bookings.filter(b => !selectedBookingIds.includes(b.id)));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to delete bookings', error);
    }
  };

  const handleBulkStatusUpdate = async (status: string) => {
    try {
      await updateBookingsStatus(selectedBookingIds, status);
      setBookings(bookings.map(b => selectedBookingIds.includes(b.id) ? { ...b, status } : b));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to update bookings status', error);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-start">
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {isAr ? 'نظام الحجوزات والمواعيد' : 'Bookings & Appointments System'}
          </h1>
          <p className="mt-1 font-medium text-muted-foreground">
            {isAr ? 'إدارة الطلبات، المواعيد، والاجتماعات في مكان واحد.' : 'Manage requests, appointments, and meetings in one place.'}
          </p>
        </div>
        <Button onClick={handleOpenModal} className="flex h-11 gap-2 rounded-2xl px-8 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
          <Plus className="size-5" />
          {isAr ? 'حجز جديد' : 'New Booking'}
        </Button>
      </div>

      {/* Stats & Search */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 sm:flex-row lg:col-span-8">
          <div className="group relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-primary">
              <Search className="size-5" />
            </div>
            <Input
              placeholder="ابحث بالاسم، التواصل، أو تفاصيل الحجز..."
              className="h-14 w-full rounded-2xl border-none bg-card pr-12 text-lg shadow-xl shadow-gray-100/40 focus-visible:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="h-14 w-full min-w-[150px] cursor-pointer rounded-2xl border-none bg-card px-6 text-base font-bold shadow-xl shadow-gray-100/40 outline-none focus:ring-2 focus:ring-primary sm:w-auto"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">جميع الحالات</option>
            <option value="upcoming">قادم / مؤكد</option>
            <option value="completed">مكتمل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
        <div className="flex h-14 items-center gap-4 overflow-hidden rounded-2xl border border-white/50 bg-muted/20 p-2 lg:col-span-4">
          <div className="flex flex-1 flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="text-[10px] font-extrabold uppercase tracking-tighter text-muted-foreground">قادمة</span>
            <span className="text-xl font-black text-blue-600">{bookings.filter(b => b.status === 'upcoming').length}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <span className="text-[10px] font-extrabold uppercase tracking-tighter text-muted-foreground">إجمالي الحجوزات</span>
            <span className="text-xl font-black text-primary">{bookings.length}</span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="mb-4 flex items-center justify-between">
        {selectedBookingIds.length > 0 && (
          <div className="flex flex-wrap gap-2 duration-200 animate-in fade-in zoom-in-95">
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="h-10 rounded-xl px-6 font-bold shadow-lg shadow-red-500/20"
            >
              <Trash2 className="ml-1 mr-2 size-4" />
              حذف المحدد (
              {selectedBookingIds.length}
              )
            </Button>
            <Button
              onClick={() => handleBulkStatusUpdate('completed')}
              className="h-10 rounded-xl bg-emerald-600 px-6 font-bold text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700"
            >
              <CheckCircle2 className="ml-1 mr-2 size-4" />
              تحديد كمكتمل
            </Button>
            <Button
              onClick={() => handleBulkStatusUpdate('cancelled')}
              variant="outline"
              className="h-10 rounded-xl border-red-200 bg-white px-6 font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <X className="ml-1 mr-2 size-4" />
              إلغاء المواعيد
            </Button>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-[2rem] border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        {bookings.length === 0
          ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex size-24 animate-pulse items-center justify-center rounded-[2rem] bg-muted/30 text-muted-foreground/30">
                  <CalendarIcon className="size-12" />
                </div>
                <h3 className="mb-3 text-3xl font-black text-muted-foreground">{isAr ? 'لا توجد حجوزات' : 'No Bookings'}</h3>
                <p className="mx-auto max-w-sm text-base italic text-muted-foreground">{isAr ? 'سيظهر هنا أي موعد أو حجز يقوم الذكاء الاصطناعي بتنظيمه.' : 'Any appointment or booking organized by AI will appear here.'}</p>
              </div>
            )
          : (
              <Table>
                <TableHeader className="border-b bg-muted/10">
                  <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="w-12 p-6">
                      <input
                        type="checkbox"
                        className="size-5 cursor-pointer rounded-md border-gray-300 text-primary accent-primary focus:ring-primary"
                        checked={filteredBookings.length > 0 && selectedBookingIds.length === filteredBookings.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="px-4 py-6 text-start text-sm font-black uppercase tracking-widest">العميل</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">المنتجات</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">الموعد</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">الحالة</TableHead>
                    <TableHead className="px-8 py-6 text-end text-sm font-black uppercase tracking-widest">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map(booking => (
                    <TableRow
                      key={booking.id}
                      className={`group cursor-pointer border-b transition-all last:border-0 hover:bg-muted/5 ${selectedBookingIds.includes(booking.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                      onClick={() => handleEdit(booking)}
                    >
                      <TableCell className="px-6 py-5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="size-5 cursor-pointer rounded-md border-gray-300 text-primary accent-primary focus:ring-primary"
                          checked={selectedBookingIds.includes(booking.id)}
                          onChange={e => handleSelectBooking(booking.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <div className="flex items-center gap-4 text-start">
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner transition-transform group-hover:scale-110">
                            <User className="size-7" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-gray-900 transition-colors group-hover:text-primary">{booking.customerName}</span>
                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-xs font-medium text-muted-foreground" dir="ltr">{booking.contactInfo}</span>
                              {booking.socialUsername && (
                                <span className="text-xs font-bold text-blue-500" dir="ltr">
                                  @
                                  {booking.socialUsername}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex max-w-[240px] flex-wrap gap-1.5">
                          {booking.cart && booking.cart.length > 0
                            ? (
                                booking.cart.map((item: any) => {
                                  const prod = products.find(p => p.id.toString() === item.productId?.toString());
                                  if (!prod) {
                                    return null;
                                  }
                                  return (
                                    <span key={item.productId} className="rounded-xl border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-bold text-primary shadow-sm">
                                      {item.quantity}
                                      x
                                      {prod.name}
                                    </span>
                                  );
                                })
                              )
                            : (
                                <span className="text-sm font-medium italic text-muted-foreground">خدمة / عام</span>
                              )}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex flex-col text-start">
                          <div className="flex items-center gap-2 text-base font-black tracking-tighter text-gray-800">
                            <CalendarIcon className="size-4 text-primary/60" />
                            <span dir="ltr">{format(new Date(booking.bookingDate), 'PPp', { locale: arSA })}</span>
                          </div>
                          <span className="mt-1 text-xs font-bold text-muted-foreground">{getRelativeDate(booking.bookingDate)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {getStatusBadge(booking.status)}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-end" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-10 rounded-2xl transition-all group-hover:bg-muted">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[200px] rounded-2xl border-muted/50 p-2 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleEdit(booking)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-base font-bold hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                              <Edit className="size-5" />
                              تعديل الحجز
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(booking.id)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-base font-bold text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-300 animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] bg-card shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] duration-300 animate-in zoom-in-95 slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b bg-muted/10 p-8">
              <div className="flex items-center gap-4 text-start">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {editingBookingId ? <Edit className="size-7" /> : <Plus className="size-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {editingBookingId ? 'تعديل بيانات الحجز' : 'إضافة حجز يدوي'}
                  </h2>
                  <p className="mt-1 text-sm font-bold italic text-muted-foreground">نظم جدولك باحترافية وسهولة.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="size-12 rounded-2xl transition-all hover:bg-red-50 hover:text-red-500">
                <X className="size-7" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-8 overflow-y-auto p-10 text-start">
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label className="px-1 text-lg font-black">اسم العميل</Label>
                    <Input
                      required
                      placeholder="مثلاً: محمد علي"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-xl font-bold shadow-inner"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="px-1 text-lg font-black">رقم التواصل / المعرف</Label>
                    <Input
                      placeholder="+966 50 000 0000"
                      value={formData.contactInfo}
                      onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-xl font-bold shadow-inner"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label className="px-1 text-lg font-black">المصدر / القناة</Label>
                    <select
                      className="h-16 cursor-pointer appearance-none rounded-2xl border-none bg-muted/50 px-6 text-base font-bold outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary"
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
                    <Label className="px-1 text-lg font-black">اسم المستخدم (السوشيال)</Label>
                    <Input
                      placeholder="@username"
                      value={formData.socialUsername}
                      onChange={e => setFormData({ ...formData, socialUsername: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-xl font-bold shadow-inner"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Shopping Cart Section Improved */}
                <div className="space-y-5 rounded-[2rem] border border-indigo-100/60 bg-indigo-50/30 p-8 shadow-inner">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                      <ShoppingCart className="size-6" />
                    </div>
                    <Label className="text-lg font-black text-indigo-900">سلة المنتجات المطلوبة</Label>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-6 lg:col-span-7">
                      <select
                        className="h-14 w-full cursor-pointer rounded-xl border-2 border-transparent bg-white px-4 text-sm font-bold shadow-sm outline-none transition-all hover:border-indigo-100 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/50"
                        value={currentProduct.id}
                        onChange={e => setCurrentProduct({ ...currentProduct, id: e.target.value })}
                      >
                        <option value="">اختر منتجاً أو خدمة...</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                            {' '}
                            -
                            {' '}
                            {p.price}
                            {' '}
                            {p.currency}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-3 lg:col-span-2">
                      <Input
                        type="number"
                        min="1"
                        placeholder="الكمية"
                        className="h-14 w-full rounded-xl border-none bg-white text-center text-base font-bold shadow-sm focus-visible:ring-indigo-300"
                        value={currentProduct.quantity}
                        onChange={e => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                      />
                    </div>
                    <div className="sm:col-span-3 lg:col-span-3">
                      <Button type="button" onClick={handleAddToCart} className="h-14 w-full rounded-xl bg-indigo-600 text-sm font-bold shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-95">
                        <Plus className="ml-1 size-4" />
                        إضافة
                      </Button>
                    </div>
                  </div>

                  {formData.cart.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {formData.cart.map((item, i) => {
                        const prod = products.find(p => p.id.toString() === item.productId?.toString());
                        return (
                          <div key={item.productId || i} className="group flex items-center justify-between rounded-2xl border border-indigo-50 bg-white p-4 shadow-sm transition-all animate-in zoom-in-95 hover:border-indigo-200 hover:shadow-md">
                            <div className="flex items-center gap-3">
                              <span className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 text-sm font-black text-indigo-700">
                                {item.quantity}
                                x
                              </span>
                              <span className="line-clamp-1 text-base font-bold text-gray-800">{prod?.name}</span>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveFromCart(i)} className="size-10 rounded-xl text-red-400 opacity-50 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100">
                              <X className="size-5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label className="px-1 text-lg font-black">تاريخ ووقت الموعد</Label>
                    <Input
                      type="datetime-local"
                      required
                      value={formData.bookingDate}
                      onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-xl font-bold shadow-inner"
                      dir="ltr"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label className="px-1 text-lg font-black">حالة الموعد</Label>
                    <select
                      className="h-16 cursor-pointer rounded-2xl border-none bg-muted/50 px-6 text-base font-bold outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary"
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
                  <Label className="px-1 text-lg font-black">تفاصيل وملاحظات (اختياري)</Label>
                  <textarea
                    rows={4}
                    placeholder="أي تعليمات إضافية تتعلق بهذا الحجز..."
                    className="flex min-h-[140px] w-full resize-none rounded-[2rem] border-none bg-muted/30 p-6 text-base font-medium leading-relaxed shadow-inner outline-none focus:ring-2 focus:ring-primary"
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row">
                <Button type="submit" size="lg" className="h-16 flex-1 rounded-2xl bg-primary text-xl font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95" disabled={isLoading}>
                  {isLoading ? 'جاري الحفظ...' : editingBookingId ? 'تعديل بيانات الحجز' : 'إنشاء الحجز الآن'}
                </Button>
                <Button type="button" variant="ghost" onClick={handleCloseModal} className="h-16 rounded-2xl bg-muted/20 px-10 text-lg font-bold transition-all hover:bg-muted">
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
