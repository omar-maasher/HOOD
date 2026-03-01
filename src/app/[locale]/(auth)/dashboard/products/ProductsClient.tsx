'use client';

import {
  Box,
  Download,
  Edit,
  Info,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';

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

import { bulkUploadProducts, createProduct, deleteProduct, deleteProducts, updateProduct } from './actions';

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState(initialProducts || []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    currency: 'SAR',
    category: '',
    status: 'active',
    description: '',
    stock: '',
  });

  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  const handleOpenModal = () => {
    setEditingProductId(null);
    setFormData({ name: '', price: '', currency: 'SAR', category: '', status: 'active', description: '', stock: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (product: any) => {
    setEditingProductId(product.id);
    setFormData({
      name: product.name,
      price: product.price,
      currency: product.currency,
      category: product.category,
      status: product.status,
      description: product.description || '',
      stock: product.stock?.toString() || '0',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingProductId) {
        const updatedProduct = await updateProduct(editingProductId, formData);
        setProducts(products.map(p => p.id === editingProductId ? updatedProduct : p));
      } else {
        const newProduct = await createProduct(formData);
        setProducts([...products, newProduct]);
      }
      setEditingProductId(null);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save product', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      const remainingProducts = products.filter(p => p.id !== id);
      setProducts(remainingProducts);
      if (categoryFilter && !remainingProducts.some(p => p.category === categoryFilter)) {
        setCategoryFilter('');
      }
    } catch (error) {
      console.error('Failed to delete product', error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('No sheet found');
      }

      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) {
        throw new Error('Worksheet is undefined');
      }

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const formattedProducts = jsonData.map((row) => {
        // Normalize keys (remove surrounding spaces) to prevent mapping issues
        const normalizedRow: any = {};
        for (const key in row) {
          if (Object.prototype.hasOwnProperty.call(row, key)) {
            normalizedRow[key.trim()] = row[key];
          }
        }

        return {
          name: normalizedRow.name || normalizedRow['اسم المنتج'] || normalizedRow.Name || '',
          price: normalizedRow.price || normalizedRow['السعر'] || normalizedRow.Price || 0,
          currency: normalizedRow.currency || normalizedRow['العملة'] || normalizedRow.Currency || 'SAR',
          category: normalizedRow.category || normalizedRow['القسم'] || normalizedRow.Category || '',
          status: normalizedRow.status || normalizedRow['الحالة'] || normalizedRow.Status || 'active',
          description: normalizedRow.description || normalizedRow['الوصف'] || normalizedRow.Description || '',
          stock: normalizedRow.stock || normalizedRow['المخزون'] || normalizedRow.Stock || 0,
        };
      }).filter(p => p.name && String(p.name).trim() !== '');

      if (formattedProducts.length === 0) {
        setIsLoading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      const newProducts = await bulkUploadProducts(formattedProducts);
      setProducts([...newProducts, ...products]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Failed to upload file', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { 'اسم المنتج': 'مثال: اشتراك رقمي', 'السعر': 150, 'العملة': 'SAR', 'القسم': 'اشتراكات', 'الوصف': 'اشتراك لمدة شهر', 'المخزون': 20 },
      { 'اسم المنتج': 'مثال: بطاقة العاب', 'السعر': 45, 'العملة': 'USD', 'القسم': 'بطاقات', 'الوصف': 'بطاقة شحن 10 دولار', 'المخزون': 15 },
      { 'اسم المنتج': 'مثال: شدات ببجي', 'السعر': 2000, 'العملة': 'يمني قعيطي', 'القسم': 'ألعاب', 'الوصف': '600 شدة', 'المخزون': 50 },
      { 'اسم المنتج': 'مثال: رصيد العاب', 'السعر': 3000, 'العملة': 'يمني قديم', 'القسم': 'شحن', 'الوصف': 'شحن فوري', 'المخزون': 10 },
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    workbook.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');
    XLSX.writeFile(workbook, 'نموذج_المنتجات.xlsx');
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean) as string[];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? p.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedProductIds(prev => [...prev, id]);
    } else {
      setSelectedProductIds(prev => prev.filter(pid => pid !== id));
    }
  };

  const handleBulkDelete = async () => {
    setIsLoading(true);
    try {
      await deleteProducts(selectedProductIds);
      const remainingProducts = products.filter(p => !selectedProductIds.includes(p.id));
      setProducts(remainingProducts);
      setSelectedProductIds([]);
      if (categoryFilter && !remainingProducts.some(p => p.category === categoryFilter)) {
        setCategoryFilter('');
      }
    } catch (error) {
      console.error('Failed to delete products', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div className="text-start">
          <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
            {isAr ? 'كتالوج المنتجات' : 'Products Catalog'}
          </h1>
          <p className="mt-1 text-base font-medium italic text-muted-foreground">
            {isAr ? 'أضف منتجاتك هنا ليتمكن البوت من تعريف العملاء عليها.' : 'Add your products here so the bot can introduce them to customers.'}
          </p>
        </div>

        <div className="flex w-full flex-wrap gap-3 md:w-auto">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <Button onClick={handleDownloadTemplate} variant="outline" className="group flex h-11 gap-2 rounded-2xl border-2 border-dashed bg-muted/5 px-6 text-sm font-bold transition-all hover:bg-muted">
            <Download className="size-4 transition-transform group-hover:-translate-y-0.5" />
            {isAr ? 'تحميل النموذج' : 'Download Template'}
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="group flex h-11 gap-2 rounded-2xl border-2 px-6 text-sm font-bold transition-all hover:bg-muted">
            <Upload className="size-4 transition-transform group-hover:-translate-y-0.5" />
            {isAr ? 'رفع (Excel)' : 'Upload (Excel)'}
          </Button>
          <Button onClick={handleOpenModal} className="flex h-11 gap-2 rounded-2xl px-8 text-sm font-bold shadow-lg shadow-primary/20 transition-all active:scale-95">
            <Plus className="size-5" />
            {isAr ? 'منتج جديد' : 'New Product'}
          </Button>
        </div>
      </div>

      {/* Excel Upload Instructions */}
      <div className="rounded-[2rem] border border-blue-100 bg-blue-50/50 p-6 text-start shadow-sm duration-500 animate-in fade-in md:p-8">
        <div className="flex flex-col items-start gap-6 md:flex-row">
          <div className="shrink-0 rounded-2xl bg-blue-100/50 p-4 text-blue-600">
            <Info className="size-8" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-blue-900">كيفية رفع المنتجات دفعة واحدة (Excel)</h3>
            <p className="text-base font-medium leading-relaxed text-blue-800/80">لتسهيل إضافة منتجاتك، يمكنك استخدام ملف Excel. اتبع الخطوات التالية:</p>
            <ul className="grid grid-cols-1 gap-4 text-sm font-bold text-blue-900 md:grid-cols-2">
              <li className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs text-blue-800">1</span>
                اضغط على &quot;تحميل النموذج&quot; للحصول على الملف الجاهز.
              </li>
              <li className="flex items-center gap-2">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs text-blue-800">2</span>
                افتح الملف وقم بتعبئة منتجاتك (مثال: الاسم، السعر، القسم...).
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs text-blue-800">3</span>
                <span className="flex-1">
                  تأكد من كتابة
                  <strong>رمز العملة الصحيح</strong>
                  {' '}
                  (مثل: SAR ، USD).
                </span>
              </li>
              <li className="mt-2 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-100/30 p-3 md:col-span-2">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs text-amber-800">هام</span>
                <span className="flex-1">
                  <strong>للعملات اليمنية:</strong>
                  {' '}
                  يجب التفريق بين الريال القديم والجديد كالتالي:
                  <br />
                  • اكتب
                  {' '}
                  <strong>يمني قعيطي</strong>
                  {' '}
                  للريال اليمني الجديد.
                  <br />
                  • اكتب
                  {' '}
                  <strong>يمني قديم</strong>
                  {' '}
                  للريال اليمني القديم (طبعة صنعاء).
                </span>
              </li>
              <li className="flex items-start gap-2 md:col-span-2">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs text-blue-800">4</span>
                <span className="flex-1">اضغط على &quot;رفع (Excel)&quot; لاختيار الملف المحفوظ ورفعه للنظام.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-4 sm:flex-row lg:col-span-8">
          <div className="group relative flex-1">
            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-primary">
              <Search className="size-5" />
            </div>
            <Input
              placeholder="ابحث عن اسم منتج..."
              className="h-16 w-full rounded-2xl border-none bg-card pr-12 text-lg shadow-xl shadow-gray-100/40 focus-visible:ring-primary"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <select
            className="h-16 w-full min-w-[160px] cursor-pointer rounded-2xl border-none bg-card px-6 text-base font-bold shadow-xl shadow-gray-100/40 outline-none focus:ring-2 focus:ring-primary sm:w-auto"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          >
            <option value="">جميع الأقسام</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex h-16 items-center gap-4 overflow-hidden rounded-2xl border border-white/50 bg-muted/20 p-2 lg:col-span-4">
          <div className="flex flex-1 flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="mb-1 text-xs font-extrabold uppercase tracking-tighter text-muted-foreground">إجمالي المنتجات</span>
            <span className="text-2xl font-black text-primary">{products.length}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-4">
            <span className="mb-1 text-xs font-extrabold uppercase tracking-tighter text-muted-foreground">الفئات النشطة</span>
            <span className="text-2xl font-black text-blue-600">{new Set(products.map(p => p.category)).size}</span>
          </div>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between">
        {selectedProductIds.length > 0 && (
          <div className="duration-200 animate-in fade-in zoom-in-95">
            <Button
              onClick={handleBulkDelete}
              variant="destructive"
              className="h-10 rounded-xl px-6 font-bold shadow-lg shadow-red-500/20"
              disabled={isLoading}
            >
              <Trash2 className="ml-1 mr-2 size-4" />
              حذف المحدد (
              {selectedProductIds.length}
              )
            </Button>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-[2rem] border bg-card shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
        {filteredProducts.length === 0
          ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-6 flex size-24 animate-pulse items-center justify-center rounded-[2rem] bg-muted/30 text-muted-foreground/30">
                  <Package className="size-12" />
                </div>
                <h3 className="mb-3 text-3xl font-black text-muted-foreground">{isAr ? 'لا يوجد منتجات حالياً' : 'No products available'}</h3>
                <p className="mx-auto max-w-sm text-base italic text-muted-foreground">{isAr ? 'ابدأ بإضافة أول منتج لتجربة قوة الرد الآلي في متجرك.' : 'Start by adding your first product to experience the power of AI replies in your store.'}</p>
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
                        checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="px-4 py-6 text-start text-sm font-black uppercase tracking-widest">تفاصيل المنتج</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">التصنيف</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">السعر</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">المخزون</TableHead>
                    <TableHead className="p-6 text-start text-sm font-black uppercase tracking-widest">الحالة</TableHead>
                    <TableHead className="px-8 py-6 text-end text-sm font-black uppercase tracking-widest">إجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map(product => (
                    <TableRow
                      key={product.id}
                      className={`group cursor-pointer border-b transition-all last:border-0 hover:bg-muted/5 ${selectedProductIds.includes(product.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                      onClick={() => handleEdit(product)}
                    >
                      <TableCell className="px-6 py-5" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="size-5 cursor-pointer rounded-md border-gray-300 text-primary accent-primary focus:ring-primary"
                          checked={selectedProductIds.includes(product.id)}
                          onChange={e => handleSelectProduct(product.id, e.target.checked)}
                        />
                      </TableCell>
                      <TableCell className="px-4 py-5">
                        <div className="flex items-center gap-4 text-start">
                          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary shadow-inner transition-transform group-hover:scale-110">
                            <Box className="size-7" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-base font-bold text-gray-900 transition-colors group-hover:text-primary">{product.name}</span>
                            <span className="mt-0.5 line-clamp-2 max-w-[240px] text-xs leading-relaxed text-muted-foreground">{product.description || 'بدون وصف'}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="rounded-xl bg-muted px-4 py-1.5 text-xs font-bold text-muted-foreground">{product.category}</span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <span className="text-xl font-black tracking-tight text-gray-800">
                          {product.price}
                          {' '}
                          <span className="mr-1 text-xs font-medium uppercase text-muted-foreground">{product.currency}</span>
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5 text-center">
                        <span className={`text-base font-bold ${product.stock > 10 ? 'text-gray-600' : 'text-amber-600'}`}>
                          {product.stock}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        {product.status === 'active'
                          ? (
                              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 ring-4 ring-emerald-50">
                                <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                                نشط
                              </span>
                            )
                          : (
                              <span className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-100 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                                مسودة
                              </span>
                            )}
                      </TableCell>
                      <TableCell className="px-8 py-5 text-end" onClick={e => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-10 rounded-2xl transition-all group-hover:bg-muted">
                              <MoreHorizontal className="size-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-[200px] rounded-2xl border-muted/50 p-2 shadow-2xl">
                            <DropdownMenuItem onClick={() => handleEdit(product)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-base font-bold hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                              <Edit className="size-5" />
                              تعديل المنتج
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(product.id)} className="flex cursor-pointer gap-3 rounded-xl py-3 text-base font-bold text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
                              <Trash2 className="size-5" />
                              حذف المنتج
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

      <div className="flex flex-col items-center gap-6 rounded-[2rem] border border-indigo-200/50 bg-indigo-50/50 p-8 text-start md:flex-row">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 shadow-inner">
          <Sparkles className="size-8" />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-indigo-900">تلميح للذكاء الاصطناعي</h3>
          <p className="max-w-4xl text-base italic leading-relaxed text-indigo-800/80">
            كل منتج تضيفه يصبح جزءاً من "ذاكرة" مساعدك الذكي. البوت سيتمكن من ترشيح المنتجات لعملائك، شرح مميزاتها، وحتى إعطائهم الأسعار بدقة خرافية!
          </p>
        </div>
      </div>

      {/* Modern Modal REDESIGN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md duration-300 animate-in fade-in">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2.5rem] bg-card shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] duration-300 animate-in zoom-in-95 slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b bg-muted/10 p-8">
              <div className="flex items-center gap-4">
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  {editingProductId ? <Edit className="size-7" /> : <Plus className="size-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                  </h2>
                  <p className="mt-1 text-sm font-bold text-muted-foreground">أدخل التفاصيل بدقة ليتمكن الـ AI من مساعدتك.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="size-12 rounded-2xl transition-all hover:bg-red-50 hover:text-red-500">
                <X className="size-7" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 space-y-8 overflow-y-auto p-10 text-start">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="px-1 text-lg font-black">اسم المنتج</Label>
                  <Input
                    id="name"
                    required
                    placeholder="مثلاً: سماعة ابل Airpods Pro"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="h-16 rounded-2xl border-none bg-muted/30 text-xl shadow-inner focus-visible:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="price" className="px-1 text-lg font-black">السعر والعملة</Label>
                    <div className="flex h-16 gap-2">
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="h-full flex-1 rounded-2xl border-none bg-muted/30 text-start text-xl font-bold"
                        dir="ltr"
                      />
                      <select
                        value={formData.currency}
                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                        className="h-full w-32 cursor-pointer appearance-none rounded-2xl border-none bg-muted/50 px-4 text-sm font-black tracking-tighter outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary"
                      >
                        <option value="SAR">ر.س (SAR)</option>
                        <option value="USD">دولار ($)</option>
                        <option value="يمني قعيطي">يمني (قعيطي)</option>
                        <option value="يمني قديم">يمني (قديم)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="category" className="px-1 text-lg font-black">التصنيف / الفئة</Label>
                    <Input
                      id="category"
                      required
                      placeholder="مثلاً: الكترونيات"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-xl shadow-inner focus-visible:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="stock" className="px-1 text-lg font-black">الكمية المتوفرة</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="h-16 rounded-2xl border-none bg-muted/30 text-center text-xl font-bold"
                    />
                  </div>
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="status" className="px-1 text-lg font-black">حالة العرض</Label>
                    <select
                      id="status"
                      className="h-16 cursor-pointer rounded-2xl border-none bg-muted/50 px-6 text-base font-bold outline-none transition-colors hover:bg-muted focus:ring-2 focus:ring-primary"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">نشط (متاح للبيع)</option>
                      <option value="draft">مسودة (للمعاينة فقط)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 text-start">
                  <Label htmlFor="description" className="px-1 text-lg font-black">وصف المنتج (لأتمتة الأجوبة)</Label>
                  <textarea
                    id="description"
                    required
                    rows={5}
                    placeholder="اكتب هنا جميع تفاصيل المنتج، لونه، مقاسه، ضمانه... الذكاء الاصطناعي سيتعلم من هذا النص للرد على العملاء."
                    className="flex min-h-[160px] w-full resize-none rounded-[2rem] border-none bg-muted/30 p-6 text-base font-medium leading-relaxed shadow-inner outline-none transition-all focus:ring-2 focus:ring-primary"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4 border-t pt-8 sm:flex-row">
                <Button type="submit" size="lg" className="h-16 flex-1 rounded-2xl bg-primary text-xl font-black text-white shadow-xl shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95" disabled={isLoading}>
                  {isLoading ? 'جاري المعالجة...' : editingProductId ? 'تحديث البيانات' : 'إضافة إلى الكتالوج'}
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
