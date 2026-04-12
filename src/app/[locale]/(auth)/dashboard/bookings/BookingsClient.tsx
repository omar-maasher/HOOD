'use client';

import { format, formatDistanceToNow } from 'date-fns';
import { arSA } from 'date-fns/locale';
import {
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  List,
  MoreHorizontal,
  Plus,
  Search,
  ShoppingCart,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';

import {
  createBooking,
  deleteBooking,
  deleteBookings,
  updateBooking,
  updateBookingsStatus,
} from './actions';

type BookingStatus = 'upcoming' | 'completed' | 'cancelled' | string;

type Product = {
  id: number | string;
  name: string;
  price?: string | number;
  currency?: string;
};

type CartItem = { productId: number | string; quantity: string | number };

type Booking = {
  id: number;
  customerName: string;
  contactInfo?: string | null;
  bookingDate: string;
  status: BookingStatus;
  notes?: string | null;
  source?: string | null;
  socialUsername?: string | null;
  serviceDetails?: string | null;
  doctorName?: string | null;
  serviceType?: string | null;
  cart?: CartItem[] | null;
};

function toLowerSafe(value: unknown) {
  return (value ?? '').toString().toLowerCase();
}

function statusLabel(status: BookingStatus, isAr: boolean) {
  if (!isAr) {
    if (status === 'upcoming') {
      return 'Upcoming';
    }
    if (status === 'completed') {
      return 'Completed';
    }
    if (status === 'cancelled') {
      return 'Cancelled';
    }
    return status;
  }

  if (status === 'upcoming') {
    return 'قادم';
  }
  if (status === 'completed') {
    return 'مكتمل';
  }
  if (status === 'cancelled') {
    return 'ملغي';
  }
  return status;
}

function statusPill(status: BookingStatus, isAr: boolean) {
  const base = 'inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-black tracking-tight';
  if (status === 'upcoming') {
    return (
      <span className={`${base} bg-sky-500/10 text-sky-700 ring-1 ring-sky-500/15`}>
        <Clock className="size-3.5" />
        {statusLabel(status, isAr)}
      </span>
    );
  }
  if (status === 'completed') {
    return (
      <span className={`${base} bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/15`}>
        <CheckCircle2 className="size-3.5" />
        {statusLabel(status, isAr)}
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className={`${base} bg-rose-500/10 text-rose-700 ring-1 ring-rose-500/15`}>
        <X className="size-3.5" />
        {statusLabel(status, isAr)}
      </span>
    );
  }
  return <Badge className="rounded-full">{statusLabel(status, isAr)}</Badge>;
}

export default function BookingsClient({ initialBookings, products }: { initialBookings: Booking[]; products: Product[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedBookingIds, setSelectedBookingIds] = useState<number[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingBookingId, setEditingBookingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    contactInfo: '',
    bookingDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
    status: 'upcoming' as BookingStatus,
    notes: '',
    source: 'whatsapp',
    socialUsername: '',
    serviceDetails: '',
    doctorName: '',
    serviceType: '',
    cart: [] as Array<{ productId: string; quantity: string }>,
  });

  const [view, setView] = useState<'table' | 'calendar'>('table');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const [currentProduct, setCurrentProduct] = useState({ id: '', quantity: '1' });

  const counts = useMemo(() => {
    const total = bookings.length;
    const upcoming = bookings.filter(b => b.status === 'upcoming').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    return { total, upcoming, completed, cancelled };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return bookings.filter((b) => {
      const cart = (b.cart || []) as CartItem[];
      const cartMatches = cart.some((item) => {
        const prod = products.find(p => p.id?.toString() === item.productId?.toString());
        return prod ? toLowerSafe(prod.name).includes(q) : false;
      });

      const matchesSearch = !q
        || toLowerSafe(b.customerName).includes(q)
        || toLowerSafe(b.contactInfo).includes(q)
        || toLowerSafe(b.socialUsername).includes(q)
        || toLowerSafe(b.notes).includes(q)
        || toLowerSafe(b.serviceDetails).includes(q)
        || cartMatches;

      const matchesStatus = statusFilter ? b.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [bookings, products, searchQuery, statusFilter]);

  const openCreate = () => {
    setEditingBookingId(null);
    setFormData({
      customerName: '',
      contactInfo: '',
      bookingDate: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm'),
      status: 'upcoming',
      notes: '',
      source: 'whatsapp',
      socialUsername: '',
      serviceDetails: '',
      doctorName: '',
      serviceType: '',
      cart: [],
    });
    setCurrentProduct({ id: '', quantity: '1' });
    setIsModalOpen(true);
  };

  const openEdit = (booking: Booking) => {
    setEditingBookingId(booking.id);
    setFormData({
      customerName: booking.customerName || '',
      contactInfo: booking.contactInfo || '',
      bookingDate: format(new Date(booking.bookingDate), 'yyyy-MM-dd\'T\'HH:mm'),
      status: booking.status || 'upcoming',
      notes: booking.notes || '',
      source: booking.source || 'whatsapp',
      socialUsername: booking.socialUsername || '',
      serviceDetails: booking.serviceDetails || '',
      doctorName: booking.doctorName || '',
      serviceType: booking.serviceType || '',
      cart: ((booking.cart || []) as CartItem[]).map(i => ({ productId: i.productId?.toString?.() ?? `${i.productId}`, quantity: `${i.quantity}` })),
    });
    setCurrentProduct({ id: '', quantity: '1' });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const relativeDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: isAr ? arSA : undefined });
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBookingIds(filteredBookings.map(b => b.id));
    } else {
      setSelectedBookingIds([]);
    }
  };

  const toggleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedBookingIds(prev => prev.includes(id) ? prev : [...prev, id]);
    } else {
      setSelectedBookingIds(prev => prev.filter(x => x !== id));
    }
  };

  const handleBulkDelete = async () => {
    try {
      await deleteBookings(selectedBookingIds);
      setBookings(prev => prev.filter(b => !selectedBookingIds.includes(b.id)));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to delete bookings', error);
    }
  };

  const handleBulkStatusUpdate = async (status: BookingStatus) => {
    try {
      await updateBookingsStatus(selectedBookingIds, status);
      setBookings(prev => prev.map(b => selectedBookingIds.includes(b.id) ? { ...b, status } : b));
      setSelectedBookingIds([]);
    } catch (error) {
      console.error('Failed to update bookings status', error);
    }
  };

  const handleDeleteOne = async (id: number) => {
    try {
      await deleteBooking(id);
      setBookings(prev => prev.filter(b => b.id !== id));
      setSelectedBookingIds(prev => prev.filter(x => x !== id));
    } catch (error) {
      console.error('Failed to delete booking', error);
    }
  };

  const addToCart = () => {
    if (!currentProduct.id) {
      return;
    }
    const qty = Math.max(1, Number(currentProduct.quantity || 1));

    setFormData((prev) => {
      const idx = prev.cart.findIndex(i => i.productId === currentProduct.id);
      if (idx >= 0) {
        const nextCart = [...prev.cart];
        const existing = nextCart[idx]!;
        nextCart[idx] = { productId: existing.productId, quantity: `${Math.max(1, Number(existing.quantity || 1) + qty)}` };
        return { ...prev, cart: nextCart };
      }
      return { ...prev, cart: [...prev.cart, { productId: currentProduct.id, quantity: `${qty}` }] };
    });

    setCurrentProduct({ id: '', quantity: '1' });
  };

  const removeFromCart = (index: number) => {
    setFormData((prev) => {
      const next = [...prev.cart];
      next.splice(index, 1);
      return { ...prev, cart: next };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingBookingId) {
        const updated = (await updateBooking(editingBookingId, formData)) as Booking;
        setBookings(prev => prev.map(b => b.id === editingBookingId ? updated : b));
      } else {
        const created = (await createBooking(formData)) as Booking;
        setBookings(prev => [created, ...prev].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()));
      }
      closeModal();
    } catch (error) {
      console.error('Failed to save booking', error);
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = useMemo(() => {
    const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const days = [];

    // Add padding for start of month
    const startPadding = start.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add actual days
    for (let i = 1; i <= end.getDate(); i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    return days;
  }, [currentMonth]);

  const changeMonth = (offset: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
  };

  return (
    <div className={`mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20 ${isAr ? 'text-right' : 'text-left'}`}>
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-card/80 to-muted/30 p-10 shadow-2xl shadow-primary/5 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-20 [background:radial-gradient(circle_at_20%_10%,rgba(59,130,246,0.20),transparent_40%),radial-gradient(circle_at_80%_40%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_45%_100%,rgba(244,63,94,0.12),transparent_45%)]"></div>
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-4 py-1.5 text-xs font-black uppercase tracking-widest">
              <Calendar className="size-3.5 text-primary" />
              {isAr ? 'الحجوزات' : 'Bookings'}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-tighter">
              {isAr ? 'إدارة المواعيد والحجوزات' : 'Bookings & Appointments'}
            </h1>
            <p className="mt-2 max-w-2xl text-base font-medium text-muted-foreground">
              {isAr ? 'بحث سريع، تنظيم الحالة، وإنشاء حجز يدوي خلال ثواني.' : 'Fast search, status control, and manual booking creation in seconds.'}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <div className="flex rounded-2xl bg-background/50 p-1 shadow-inner">
              <Button
                variant="ghost"
                className={`h-12 rounded-xl px-4 font-black ${view === 'table' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setView('table')}
              >
                <List className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">{isAr ? 'قائمة' : 'List'}</span>
              </Button>
              <Button
                variant="ghost"
                className={`h-12 rounded-xl px-4 font-black ${view === 'calendar' ? 'bg-background shadow-sm' : ''}`}
                onClick={() => setView('calendar')}
              >
                <CalendarDays className="size-4 sm:mr-2" />
                <span className="hidden sm:inline">{isAr ? 'تقويم' : 'Calendar'}</span>
              </Button>
            </div>
            <Button onClick={openCreate} className="h-14 w-full rounded-2xl px-7 text-base font-black shadow-xl shadow-primary/25 transition-transform active:scale-[0.98] sm:w-auto">
              <Plus className={`size-5 ${isAr ? 'ml-2' : 'mr-2'}`} />
              {isAr ? 'حجز جديد' : 'New booking'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{isAr ? 'إجمالي' : 'Total'}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-4">
            <div className="text-4xl font-black tracking-tight">{counts.total}</div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Calendar className="size-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{isAr ? 'قادمة' : 'Upcoming'}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-4">
            <div className="text-4xl font-black tracking-tight text-sky-700">{counts.upcoming}</div>
            <div className="rounded-2xl bg-sky-500/10 p-3 text-sky-700">
              <Clock className="size-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{isAr ? 'مكتملة' : 'Completed'}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-4">
            <div className="text-4xl font-black tracking-tight text-emerald-700">{counts.completed}</div>
            <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-700">
              <CheckCircle2 className="size-6" />
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-wider text-muted-foreground">{isAr ? 'ملغاة' : 'Cancelled'}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between gap-4">
            <div className="text-4xl font-black tracking-tight text-rose-700">{counts.cancelled}</div>
            <div className="rounded-2xl bg-rose-500/10 p-3 text-rose-700">
              <X className="size-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {view === 'calendar'
        ? (
            <Card className="overflow-hidden rounded-[2.5rem] border-white/20 bg-card/70 shadow-2xl shadow-gray-200/20 backdrop-blur-md">
              <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5 px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-14 items-center justify-center rounded-3xl bg-primary/10 text-primary">
                    <Calendar className="size-7" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black tracking-tight">
                      <span className="capitalize">{format(currentMonth, 'MMMM yyyy', { locale: isAr ? arSA : undefined })}</span>
                    </CardTitle>
                    <p className="text-xs font-bold text-muted-foreground">{isAr ? 'عرض الحجوزات موزعة على الشهر' : 'Monthly overview of all bookings'}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="size-12 rounded-2xl" onClick={() => changeMonth(-1)}>
                    <ChevronLeft className="size-6" />
                  </Button>
                  <Button variant="outline" className="h-12 rounded-2xl px-5 font-black" onClick={() => setCurrentMonth(new Date())}>
                    {isAr ? 'اليوم' : 'Today'}
                  </Button>
                  <Button variant="outline" size="icon" className="size-12 rounded-2xl" onClick={() => changeMonth(1)}>
                    <ChevronRight className="size-6" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-7 border-b bg-muted/5">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="py-4 text-center text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {isAr ? (d === 'Sun' ? 'أحد' : d === 'Mon' ? 'اثنين' : d === 'Tue' ? 'ثلاثاء' : d === 'Wed' ? 'أربعاء' : d === 'Thu' ? 'خميس' : d === 'Fri' ? 'جمعة' : 'سبت') : d}
                    </div>
                  ))}
                </div>
                <div className="grid border-collapse grid-cols-7">
                  {daysInMonth.map((day, idx) => {
                    if (!day) {
                      return <div key={`empty-${idx}`} className="h-32 border-b border-e bg-muted/5" />;
                    }
                    const dayStr = format(day, 'yyyy-MM-dd');
                    const todayStr = format(new Date(), 'yyyy-MM-dd');
                    const isToday = dayStr === todayStr;
                    const dayBookings = bookings.filter(b => format(new Date(b.bookingDate), 'yyyy-MM-dd') === dayStr);

                    return (
                      <div
                        key={dayStr}
                        role="button"
                        tabIndex={0}
                        className={`group relative h-32 cursor-pointer border-b border-e p-4 transition-colors hover:bg-primary/5 ${isToday ? 'bg-primary/5' : ''}`}
                        onClick={() => setSelectedDay(dayStr)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            setSelectedDay(dayStr);
                          }
                        }}
                      >
                        <div className={`text-sm font-black ${isToday ? 'flex size-7 items-center justify-center rounded-full bg-primary text-white' : 'text-foreground/70'}`}>
                          {day.getDate()}
                        </div>
                        {dayBookings.length > 0 && (
                          <div className="mt-2 flex flex-col gap-1">
                            <div className="flex flex-wrap gap-1">
                              {dayBookings.slice(0, 3).map(b => (
                                <div key={b.id} className="h-1.5 min-w-[20%] flex-1 rounded-full bg-primary/40" />
                              ))}
                            </div>
                            <div className="text-[10px] font-black text-primary/80">
                              {dayBookings.length}
                              {' '}
                              {isAr ? 'حجوزات' : 'bookings'}
                            </div>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex size-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <Plus className="size-4" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )
        : (
            <Card className="rounded-[2rem] border-white/20 bg-card/70 shadow-lg shadow-gray-200/20 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="relative flex-1">
                    <div className={`pointer-events-none absolute inset-y-0 ${isAr ? 'left-4' : 'right-4'} flex items-center text-muted-foreground`}>
                      <Search className="size-5" />
                    </div>
                    <Input
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder={isAr ? 'ابحث بالاسم، التواصل، المنتج، أو التفاصيل...' : 'Search by name, contact, product, or details...'}
                      className={`h-14 rounded-2xl border-none bg-background/60 px-5 text-base font-semibold shadow-inner ${isAr ? 'pl-12' : 'pr-12'}`}
                    />
                  </div>
                  <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <select
                      className="h-14 w-full cursor-pointer rounded-2xl border border-input bg-background/60 px-5 text-sm font-black shadow-inner outline-none focus:ring-2 focus:ring-primary sm:w-[220px]"
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value)}
                    >
                      <option value="">{isAr ? 'كل الحالات' : 'All status'}</option>
                      <option value="upcoming">{isAr ? 'قادمة' : 'Upcoming'}</option>
                      <option value="completed">{isAr ? 'مكتملة' : 'Completed'}</option>
                      <option value="cancelled">{isAr ? 'ملغاة' : 'Cancelled'}</option>
                    </select>
                    <Button
                      variant="outline"
                      className="h-14 w-full rounded-2xl border-primary/15 bg-primary/5 font-black text-primary hover:bg-primary/10 sm:w-auto"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('');
                        setSelectedBookingIds([]);
                      }}
                    >
                      {isAr ? 'مسح الفلاتر' : 'Clear'}
                    </Button>
                  </div>
                </div>

                {selectedBookingIds.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-muted-foreground">
                      {isAr ? 'المحدد:' : 'Selected:'}
                      {' '}
                      <span className="font-black text-foreground">{selectedBookingIds.length}</span>
                    </span>
                    <Button variant="destructive" className="h-10 rounded-xl px-5 font-black" onClick={handleBulkDelete}>
                      <Trash2 className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                      {isAr ? 'حذف' : 'Delete'}
                    </Button>
                    <Button className="h-10 rounded-xl bg-emerald-600 px-5 font-black text-white hover:bg-emerald-700" onClick={() => handleBulkStatusUpdate('completed')}>
                      <CheckCircle2 className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                      {isAr ? 'تحديد كمكتمل' : 'Mark completed'}
                    </Button>
                    <Button variant="outline" className="h-10 rounded-xl border-rose-200 bg-white px-5 font-black text-rose-600 hover:bg-rose-50" onClick={() => handleBulkStatusUpdate('cancelled')}>
                      <X className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

      {filteredBookings.length === 0
        ? (
            <div className="rounded-[2.5rem] border bg-card p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-[2rem] bg-muted/30 text-muted-foreground">
                <Calendar className="size-10" />
              </div>
              <h3 className="text-2xl font-black">{isAr ? 'لا توجد حجوزات' : 'No bookings'}</h3>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                {isAr ? 'ابدأ بإنشاء حجز جديد أو انتظر الحجوزات القادمة من التكاملات.' : 'Create a new booking or wait for bookings from integrations.'}
              </p>
            </div>
          )
        : (
            <>
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {filteredBookings.map((b) => {
                  const cart = (b.cart || []) as CartItem[];
                  const cartPreview = cart.slice(0, 2).map((item) => {
                    const prod = products.find(p => p.id?.toString() === item.productId?.toString());
                    return prod ? `${item.quantity}x ${prod.name}` : null;
                  }).filter(Boolean) as string[];

                  return (
                    <Card key={b.id} className="rounded-[2rem] border-white/20 bg-card/80 shadow-lg shadow-gray-200/20 backdrop-blur-md">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                              <User className="size-6" />
                            </div>
                            <div>
                              <div className="text-base font-black">{b.customerName}</div>
                              <div className="mt-0.5 text-xs font-semibold text-muted-foreground" dir="ltr">
                                {b.contactInfo || '-'}
                                {b.socialUsername ? ` • @${b.socialUsername}` : ''}
                              </div>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            className="mt-1 size-5 cursor-pointer rounded-md border-gray-300 accent-primary"
                            checked={selectedBookingIds.includes(b.id)}
                            onChange={e => toggleSelectOne(b.id, e.target.checked)}
                          />
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          {statusPill(b.status, isAr)}
                          <span className="inline-flex items-center gap-2 rounded-full bg-muted/30 px-3 py-1 text-[11px] font-black text-foreground/80">
                            <Calendar className="size-3.5 text-primary/70" />
                            <span dir="ltr">{format(new Date(b.bookingDate), 'PPp', { locale: isAr ? arSA : undefined })}</span>
                          </span>
                        </div>

                        {(b.serviceDetails || cartPreview.length > 0) && (
                          <div className="mt-4 rounded-2xl bg-muted/20 p-4">
                            <div className="text-xs font-black uppercase tracking-wider text-muted-foreground">{isAr ? 'التفاصيل' : 'Details'}</div>
                            <div className="mt-1 text-sm font-semibold text-foreground/90">
                              {b.serviceDetails ? b.serviceDetails : cartPreview.join(' • ')}
                            </div>
                          </div>
                        )}

                        <div className="mt-5 flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-muted-foreground">{relativeDate(b.bookingDate)}</span>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" className="h-10 rounded-xl px-4 font-black" onClick={() => openEdit(b)}>
                              <Edit className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                              {isAr ? 'تعديل' : 'Edit'}
                            </Button>
                            <Button variant="destructive" className="h-10 rounded-xl px-4 font-black" onClick={() => handleDeleteOne(b.id)}>
                              <Trash2 className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                              {isAr ? 'حذف' : 'Delete'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              <div className="hidden overflow-hidden rounded-[2.5rem] border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.06)] md:block">
                <div className="min-w-[980px]">
                  <Table>
                    <TableHeader className="border-b bg-muted/10">
                      <TableRow className="border-none hover:bg-transparent">
                        <TableHead className="w-12 px-6 py-5">
                          <input
                            type="checkbox"
                            className="size-5 cursor-pointer rounded-md border-gray-300 accent-primary"
                            checked={filteredBookings.length > 0 && selectedBookingIds.length === filteredBookings.length}
                            onChange={e => toggleSelectAll(e.target.checked)}
                          />
                        </TableHead>
                        <TableHead className="px-4 py-5 text-sm font-black uppercase tracking-widest">{isAr ? 'العميل' : 'Customer'}</TableHead>
                        <TableHead className="px-6 py-5 text-sm font-black uppercase tracking-widest">{isAr ? 'المنتجات' : 'Products'}</TableHead>
                        <TableHead className="px-6 py-5 text-sm font-black uppercase tracking-widest">{isAr ? 'التفاصيل' : 'Details'}</TableHead>
                        <TableHead className="px-6 py-5 text-sm font-black uppercase tracking-widest">{isAr ? 'الموعد' : 'Date'}</TableHead>
                        <TableHead className="px-6 py-5 text-sm font-black uppercase tracking-widest">{isAr ? 'الحالة' : 'Status'}</TableHead>
                        <TableHead className="px-8 py-5 text-end text-sm font-black uppercase tracking-widest">{isAr ? 'إجراءات' : 'Actions'}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBookings.map(b => (
                        <TableRow
                          key={b.id}
                          className={`group cursor-pointer border-b transition-colors last:border-0 hover:bg-muted/5 ${selectedBookingIds.includes(b.id) ? 'bg-primary/5' : ''}`}
                          onClick={() => openEdit(b)}
                        >
                          <TableCell className="px-6 py-5" onClick={e => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="size-5 cursor-pointer rounded-md border-gray-300 accent-primary"
                              checked={selectedBookingIds.includes(b.id)}
                              onChange={e => toggleSelectOne(b.id, e.target.checked)}
                            />
                          </TableCell>
                          <TableCell className="px-4 py-5">
                            <div className="flex items-center gap-4">
                              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
                                <User className="size-6" />
                              </div>
                              <div className="min-w-0">
                                <div className="truncate text-base font-black">{b.customerName}</div>
                                <div className="mt-0.5 truncate text-xs font-semibold text-muted-foreground" dir="ltr">
                                  {b.contactInfo || '-'}
                                  {b.socialUsername ? ` • @${b.socialUsername}` : ''}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <div className="flex max-w-[280px] flex-wrap gap-1.5">
                              {(b.cart || []).length > 0
                                ? (b.cart || []).map((item: any) => {
                                    const prod = products.find(p => p.id?.toString() === item.productId?.toString());
                                    if (!prod) {
                                      return null;
                                    }
                                    return (
                                      <span key={`${b.id}-${item.productId}`} className="rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-black text-primary">
                                        {item.quantity}
                                        x
                                        {prod.name}
                                      </span>
                                    );
                                  })
                                : <span className="text-sm font-semibold italic text-muted-foreground">{isAr ? 'عام' : 'General'}</span>}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <div className="max-w-[240px] truncate text-sm font-semibold text-foreground/80" title={b.serviceDetails || ''}>
                              {b.serviceDetails || '-'}
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2 text-sm font-black text-foreground/90">
                                <Calendar className="size-4 text-primary/70" />
                                <span dir="ltr">{format(new Date(b.bookingDate), isAr ? 'dd/MM/yyyy • hh:mm a' : 'PPp', { locale: isAr ? arSA : undefined })}</span>
                              </div>
                              <span className="mt-1 text-xs font-bold text-muted-foreground">{relativeDate(b.bookingDate)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-5">{statusPill(b.status, isAr)}</TableCell>
                          <TableCell className="px-8 py-5 text-end" onClick={e => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="size-10 rounded-2xl transition-colors hover:bg-muted">
                                  <MoreHorizontal className="size-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="min-w-[210px] rounded-2xl p-2">
                                <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl py-3 text-base font-black" onClick={() => openEdit(b)}>
                                  <Edit className="size-5" />
                                  {isAr ? 'تعديل الحجز' : 'Edit booking'}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer gap-3 rounded-xl py-3 text-base font-black text-rose-600 focus:text-rose-600" onClick={() => handleDeleteOne(b.id)}>
                                  <Trash2 className="size-5" />
                                  {isAr ? 'حذف' : 'Delete'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </>
          )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-2 backdrop-blur-md sm:p-4">
          <div className="relative flex max-h-[95vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] bg-card shadow-[0_32px_128px_-10px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between border-b bg-muted/10 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {editingBookingId ? <Edit className="size-6" /> : <Plus className="size-6" />}
                </div>
                <div>
                  <div className="text-xl font-black">
                    {editingBookingId ? (isAr ? 'تعديل الحجز' : 'Edit booking') : (isAr ? 'حجز جديد' : 'New booking')}
                  </div>
                  <div className="text-xs font-bold text-muted-foreground">
                    {isAr ? 'أضف بيانات العميل والموعد والمنتجات.' : 'Customer, date, and products.'}
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={closeModal} className="size-11 rounded-2xl hover:bg-rose-50 hover:text-rose-600">
                <X className="size-6" />
              </Button>
            </div>

            <form onSubmit={submit} className="flex-1 space-y-7 overflow-y-auto p-8">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'اسم العميل' : 'Customer name'}</Label>
                  <Input
                    required
                    value={formData.customerName}
                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder={isAr ? 'مثال: محمد علي' : 'e.g. John Smith'}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'رقم التواصل' : 'Contact'}</Label>
                  <Input
                    value={formData.contactInfo}
                    onChange={e => setFormData({ ...formData, contactInfo: e.target.value })}
                    className="h-12 rounded-2xl"
                    dir="ltr"
                    placeholder={isAr ? '+966...' : '+1...'}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'المصدر' : 'Source'}</Label>
                  <select
                    className="h-12 cursor-pointer rounded-2xl border border-input bg-background px-4 text-sm font-black outline-none focus:ring-2 focus:ring-primary"
                    value={formData.source}
                    onChange={e => setFormData({ ...formData, source: e.target.value })}
                  >
                    <option value="whatsapp">{isAr ? 'واتساب' : 'WhatsApp'}</option>
                    <option value="instagram">{isAr ? 'انستقرام' : 'Instagram'}</option>
                    <option value="facebook">{isAr ? 'فيسبوك (Messenger)' : 'Facebook (Messenger)'}</option>
                    <option value="manual">{isAr ? 'يدوي' : 'Manual'}</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'اسم المستخدم' : 'Username'}</Label>
                  <Input
                    value={formData.socialUsername}
                    onChange={e => setFormData({ ...formData, socialUsername: e.target.value })}
                    className="h-12 rounded-2xl"
                    dir="ltr"
                    placeholder="@username"
                  />
                </div>
              </div>

              <Card className="rounded-[2rem] border-primary/10 bg-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-primary/10 p-2 text-primary">
                        <ShoppingCart className="size-5" />
                      </div>
                      <div className="text-sm font-black">{isAr ? 'سلة المنتجات' : 'Cart'}</div>
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">{isAr ? 'اختياري' : 'Optional'}</div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-12">
                    <div className="sm:col-span-7">
                      <select
                        className="h-12 w-full cursor-pointer rounded-2xl border border-input bg-background px-4 text-sm font-black outline-none focus:ring-2 focus:ring-primary"
                        value={currentProduct.id}
                        onChange={e => setCurrentProduct({ ...currentProduct, id: e.target.value })}
                      >
                        <option value="">{isAr ? 'اختر منتج...' : 'Select product...'}</option>
                        {products.map(p => (
                          <option key={p.id?.toString()} value={p.id?.toString()}>
                            {p.name}
                            {p.price ? ` - ${p.price}` : ''}
                            {p.currency ? ` ${p.currency}` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <Input
                        type="number"
                        min={1}
                        value={currentProduct.quantity}
                        onChange={e => setCurrentProduct({ ...currentProduct, quantity: e.target.value })}
                        className="h-12 rounded-2xl text-center font-black"
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Button type="button" onClick={addToCart} className="h-12 w-full rounded-2xl font-black">
                        <Plus className={`size-4 ${isAr ? 'ml-2' : 'mr-2'}`} />
                        {isAr ? 'إضافة' : 'Add'}
                      </Button>
                    </div>
                  </div>

                  {formData.cart.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {formData.cart.map((item, idx) => {
                        const prod = products.find(p => p.id?.toString() === item.productId?.toString());
                        return (
                          <div key={`${item.productId}-${idx}`} className="flex items-center justify-between rounded-2xl border bg-background p-3">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-black">
                                {item.quantity}
                                x
                                {' '}
                                {prod?.name || item.productId}
                              </div>
                              <div className="mt-0.5 text-xs font-semibold text-muted-foreground">
                                {isAr ? 'معرّف المنتج:' : 'Product ID:'}
                                {' '}
                                <span dir="ltr">{item.productId}</span>
                              </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" className="size-10 rounded-2xl text-rose-600 hover:bg-rose-50" onClick={() => removeFromCart(idx)}>
                              <X className="size-5" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'التاريخ والوقت' : 'Date & time'}</Label>
                  <Input
                    type="datetime-local"
                    required
                    value={formData.bookingDate}
                    onChange={e => setFormData({ ...formData, bookingDate: e.target.value })}
                    className="h-12 rounded-2xl"
                    dir="ltr"
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'الحالة' : 'Status'}</Label>
                  <select
                    className="h-12 cursor-pointer rounded-2xl border border-input bg-background px-4 text-sm font-black outline-none focus:ring-2 focus:ring-primary"
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="upcoming">{isAr ? 'قادم' : 'Upcoming'}</option>
                    <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                    <option value="cancelled">{isAr ? 'ملغي' : 'Cancelled'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'المسؤول / مقدم الخدمة' : 'Provider / Specialist'}</Label>
                  <Input
                    value={formData.doctorName}
                    onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder={isAr ? 'مثال: فلان، أو اسم الموظف' : 'e.g. Employee name'}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-sm font-black">{isAr ? 'نوع الخدمة / الطلب' : 'Service Type / Inquiry'}</Label>
                  <Input
                    value={formData.serviceType}
                    onChange={e => setFormData({ ...formData, serviceType: e.target.value })}
                    className="h-12 rounded-2xl"
                    placeholder={isAr ? 'مثال: صيانة، حجز موعد، إلخ' : 'e.g. Repair, Appointment, etc.'}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-black">{isAr ? 'تفاصيل الخدمة' : 'Service details'}</Label>
                <Textarea
                  value={formData.serviceDetails}
                  onChange={e => setFormData({ ...formData, serviceDetails: e.target.value })}
                  className="min-h-[90px] rounded-3xl text-sm font-semibold"
                  placeholder={isAr ? 'مثال: صيانة، استشارة، جلسة...' : 'e.g. Repair, consultation, session...'}
                />
              </div>

              <div className="grid gap-2">
                <Label className="text-sm font-black">{isAr ? 'ملاحظات' : 'Notes'}</Label>
                <Textarea
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  className="min-h-[120px] rounded-3xl"
                  placeholder={isAr ? 'أي ملاحظات إضافية...' : 'Any extra notes...'}
                />
              </div>

              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row">
                <Button type="submit" className="h-12 flex-1 rounded-2xl text-base font-black" disabled={isLoading}>
                  {isLoading ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (editingBookingId ? (isAr ? 'حفظ التعديل' : 'Save changes') : (isAr ? 'إنشاء الحجز' : 'Create booking'))}
                </Button>
                <Button type="button" variant="outline" className="h-12 rounded-2xl font-black" onClick={closeModal}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Day Agenda Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <Card className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-[2.5rem] shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between border-b px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <CalendarDays className="size-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-black">{isAr ? `أجندة يوم ${selectedDay}` : `Agenda for ${selectedDay}`}</CardTitle>
                  <p className="text-xs font-bold text-muted-foreground">{isAr ? 'عرض كافة الحجوزات لهذا اليوم' : 'All bookings for this day'}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="rounded-2xl" onClick={() => setSelectedDay(null)}>
                <X className="size-6" />
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto p-0">
              <div className="divide-y">
                {bookings
                  .filter(b => format(new Date(b.bookingDate), 'yyyy-MM-dd') === selectedDay)
                  .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
                  .map(b => (
                    <div key={b.id} className="group relative flex items-center justify-between p-6 transition-colors hover:bg-muted/30">
                      <div className="flex items-start gap-4">
                        <div className="mt-1 flex flex-col items-center">
                          <div className="text-sm font-black text-primary" dir="ltr">{format(new Date(b.bookingDate), 'hh:mm a')}</div>
                          <div className="h-full w-0.5 bg-primary/20 group-last:hidden"></div>
                        </div>
                        <div>
                          <p className="text-base font-black">{b.customerName}</p>
                          <div className="mt-1 flex flex-wrap gap-2">
                            {statusPill(b.status, isAr)}
                            {b.doctorName && (
                              <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 font-bold text-primary">
                                {isAr ? 'المسؤول:' : 'Staff:'}
                                {' '}
                                {b.doctorName}
                              </Badge>
                            )}
                          </div>
                          {b.serviceDetails && (
                            <p className="mt-2 line-clamp-2 text-sm font-medium text-muted-foreground">{b.serviceDetails}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                        <Button
                          size="icon"
                          variant="outline"
                          className="size-10 rounded-xl"
                          onClick={() => {
                            setSelectedDay(null);
                            openEdit(b);
                          }}
                        >
                          <Edit className="size-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                {bookings.filter(b => format(new Date(b.bookingDate), 'yyyy-MM-dd') === selectedDay).length === 0 && (
                  <div className="py-20 text-center">
                    <p className="font-bold text-muted-foreground">{isAr ? 'لا توجد حجوزات في هذا اليوم' : 'No bookings on this day'}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
