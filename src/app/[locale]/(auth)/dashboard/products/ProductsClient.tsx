'use client';

import { useState, useRef } from 'react';
import { 
  Plus, MoreHorizontal, 
  Edit, Trash2, Sparkles, X, Upload, 
  Download, Search, Box, Package, Info
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createProduct, updateProduct, deleteProduct, bulkUploadProducts, deleteProducts } from './actions';
import * as XLSX from 'xlsx';

export default function ProductsClient({ initialProducts }: { initialProducts: any[] }) {
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
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
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
    if (!file) return;

    setIsLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error('No sheet found');
      
      const worksheet = workbook.Sheets[sheetName];
      if (!worksheet) throw new Error('Worksheet is undefined');
      
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const formattedProducts = jsonData.map(row => {
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
        alert('لم يتم العثور على منتجات صالحة في الملف. تأكد من تطابق أسماء الأعمدة.');
        setIsLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const newProducts = await bulkUploadProducts(formattedProducts);
      setProducts([...newProducts, ...products]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Failed to upload file', error);
      alert('حدث خطأ أثناء رفع الملف. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const templateData = [
      { 'اسم المنتج': 'مثال: اشتراك رقمي', 'السعر': 150, 'العملة': 'SAR', 'القسم': 'اشتراكات', 'الوصف': 'اشتراك لمدة شهر', 'المخزون': 20 },
      { 'اسم المنتج': 'مثال: بطاقة العاب', 'السعر': 45, 'العملة': 'USD', 'القسم': 'بطاقات', 'الوصف': 'بطاقة شحن 10 دولار', 'المخزون': 15 },
      { 'اسم المنتج': 'مثال: شدات ببجي', 'السعر': 2000, 'العملة': 'يمني قعيطي', 'القسم': 'ألعاب', 'الوصف': '600 شدة', 'المخزون': 50 },
      { 'اسم المنتج': 'مثال: رصيد العاب', 'السعر': 3000, 'العملة': 'يمني قديم', 'القسم': 'شحن', 'الوصف': 'شحن فوري', 'المخزون': 10 }
    ];
    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    workbook.Workbook = { Views: [{ RTL: true }] };
    XLSX.utils.book_append_sheet(workbook, worksheet, 'المنتجات');
    XLSX.writeFile(workbook, 'نموذج_المنتجات.xlsx');
  };

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean) as string[];

  const filteredProducts = products.filter(p => {
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
    if (!confirm(`هل أنت متأكد من حذف ${selectedProductIds.length} منتج؟`)) return;
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
      alert('حدث خطأ أثناء الحذف');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-7xl mx-auto pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="text-start">
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
            كتالوج المنتجات
          </h1>
          <p className="text-muted-foreground mt-1 font-medium italic text-base">أضف منتجاتك هنا ليتمكن البوت من تعريف العملاء عليها.</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          <Button onClick={handleDownloadTemplate} variant="outline" className="rounded-2xl h-11 px-6 font-bold flex gap-2 border-2 border-dashed bg-muted/5 group hover:bg-muted transition-all text-sm">
            <Download className="size-4 group-hover:-translate-y-0.5 transition-transform" />
            تحميل النموذج
          </Button>
          <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-2xl h-11 px-6 font-bold flex gap-2 border-2 group hover:bg-muted transition-all text-sm">
            <Upload className="size-4 group-hover:-translate-y-0.5 transition-transform" />
            رفع (Excel)
          </Button>
          <Button onClick={handleOpenModal} className="rounded-2xl h-11 px-8 font-bold flex gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all text-sm">
            <Plus className="size-5" />
            منتج جديد
          </Button>
        </div>
      </div>

      {/* Excel Upload Instructions */}
      <div className="bg-blue-50/50 border border-blue-100 rounded-[2rem] p-6 md:p-8 text-start animate-in fade-in duration-500 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="p-4 bg-blue-100/50 rounded-2xl text-blue-600 shrink-0">
            <Info className="size-8" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-blue-900">كيفية رفع المنتجات دفعة واحدة (Excel)</h3>
            <p className="text-base text-blue-800/80 leading-relaxed font-medium">لتسهيل إضافة منتجاتك، يمكنك استخدام ملف Excel. اتبع الخطوات التالية:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-bold text-blue-900">
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-blue-200 text-blue-800 text-xs shrink-0">1</span>
                اضغط على &quot;تحميل النموذج&quot; للحصول على الملف الجاهز.
              </li>
              <li className="flex items-center gap-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-blue-200 text-blue-800 text-xs shrink-0">2</span>
                افتح الملف وقم بتعبئة منتجاتك (مثال: الاسم، السعر، القسم...).
              </li>
              <li className="flex items-start gap-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-blue-200 text-blue-800 text-xs shrink-0 mt-0.5">3</span>
                <span className="flex-1">تأكد من كتابة <strong>رمز العملة الصحيح</strong> (مثل: SAR ، USD).</span>
              </li>
              <li className="flex items-start gap-2 md:col-span-2 bg-blue-100/30 p-3 rounded-xl border border-blue-100 mt-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-amber-200 text-amber-800 text-xs shrink-0 mt-0.5">هام</span>
                <span className="flex-1"><strong>للعملات اليمنية:</strong> يجب التفريق بين الريال القديم والجديد كالتالي:<br />
                • اكتب <strong>يمني قعيطي</strong> للريال اليمني الجديد.<br />
                • اكتب <strong>يمني قديم</strong> للريال اليمني القديم (طبعة صنعاء).</span>
              </li>
              <li className="flex items-start gap-2 md:col-span-2">
                <span className="flex items-center justify-center size-6 rounded-full bg-blue-200 text-blue-800 text-xs shrink-0 mt-0.5">4</span>
                <span className="flex-1">اضغط على &quot;رفع (Excel)&quot; لاختيار الملف المحفوظ ورفعه للنظام.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Stats & Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8 flex flex-col sm:flex-row gap-4">
          <div className="relative group flex-1">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
              <Search className="size-5" />
            </div>
            <Input 
              placeholder="ابحث عن اسم منتج..." 
              className="rounded-2xl h-16 pr-12 bg-card border-none shadow-xl shadow-gray-100/40 text-lg focus-visible:ring-primary w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="rounded-2xl h-16 px-6 bg-card border-none shadow-xl shadow-gray-100/40 text-base font-bold outline-none cursor-pointer focus:ring-2 focus:ring-primary w-full sm:w-auto min-w-[160px]"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">جميع الأقسام</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="lg:col-span-4 flex items-center gap-4 bg-muted/20 p-2 rounded-2xl border border-white/50 h-16 overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center border-l border-muted-foreground/10 px-4">
            <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-tighter mb-1">إجمالي المنتجات</span>
            <span className="text-2xl font-black text-primary">{products.length}</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-tighter mb-1">الفئات النشطة</span>
            <span className="text-2xl font-black text-blue-600">{new Set(products.map(p => p.category)).size}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        {selectedProductIds.length > 0 && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
            <Button 
              onClick={handleBulkDelete}
              variant="destructive" 
              className="rounded-xl h-10 px-6 font-bold shadow-lg shadow-red-500/20"
              disabled={isLoading}
            >
              <Trash2 className="size-4 mr-2 ml-1" />
              حذف المحدد ({selectedProductIds.length})
            </Button>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-card border rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="size-24 rounded-[2rem] bg-muted/30 flex items-center justify-center mb-6 text-muted-foreground/30 animate-pulse">
              <Package className="size-12" />
            </div>
            <h3 className="text-3xl font-black text-muted-foreground mb-3">لا يوجد منتجات حالياً</h3>
            <p className="text-base text-muted-foreground max-w-sm mx-auto italic">ابدأ بإضافة أول منتج لتجربة قوة الرد الآلي في متجرك.</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/10 border-b">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="py-6 px-6 w-12">
                  <input 
                    type="checkbox" 
                    className="size-5 rounded-md border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                    checked={filteredProducts.length > 0 && selectedProductIds.length === filteredProducts.length}
                    onChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="py-6 px-4 font-black text-sm uppercase tracking-widest text-start">تفاصيل المنتج</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">التصنيف</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">السعر</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start text-center">المخزون</TableHead>
                <TableHead className="py-6 px-6 font-black text-sm uppercase tracking-widest text-start">الحالة</TableHead>
                <TableHead className="py-6 px-8 font-black text-sm uppercase tracking-widest text-end font-bold">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow 
                  key={product.id} 
                  className={`group hover:bg-muted/5 border-b last:border-0 transition-all cursor-pointer ${selectedProductIds.includes(product.id) ? 'bg-primary/5 hover:bg-primary/10' : ''}`}
                  onClick={() => handleEdit(product)}
                >
                  <TableCell className="py-5 px-6" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="size-5 rounded-md border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </TableCell>
                  <TableCell className="py-5 px-4">
                    <div className="flex items-center gap-4 text-start">
                      <div className="size-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-inner shrink-0">
                        <Box className="size-7" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-base text-gray-900 group-hover:text-primary transition-colors">{product.name}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2 max-w-[240px] mt-0.5 leading-relaxed">{product.description || 'بدون وصف'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <span className="px-4 py-1.5 rounded-xl bg-muted text-xs font-bold text-muted-foreground">{product.category}</span>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    <span className="text-xl font-black text-gray-800 tracking-tight">
                      {product.price} <span className="text-xs text-muted-foreground font-medium uppercase mr-1">{product.currency}</span>
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-6 text-center">
                    <span className={`text-base font-bold ${product.stock > 10 ? 'text-gray-600' : 'text-amber-600'}`}>
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-6">
                    {product.status === 'active' ? (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-emerald-100 text-emerald-700 text-xs font-extrabold uppercase tracking-widest ring-4 ring-emerald-50 w-fit">
                        <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                        نشط
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gray-100 text-gray-500 text-xs font-extrabold uppercase tracking-widest w-fit">
                        مسودة
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-5 px-8 text-end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="group-hover:bg-muted rounded-2xl h-10 w-10 transition-all">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 border-muted/50 shadow-2xl min-w-[200px]">
                        <DropdownMenuItem onClick={() => handleEdit(product)} className="flex gap-3 py-3 rounded-xl font-bold text-base cursor-pointer hover:bg-primary/5 hover:text-primary focus:bg-primary/5 focus:text-primary">
                          <Edit className="size-5" />
                          تعديل المنتج
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(product.id)} className="flex gap-3 py-3 rounded-xl font-bold text-base cursor-pointer text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50 focus:text-red-600">
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

      <div className="rounded-[2rem] bg-indigo-50/50 border border-indigo-200/50 p-8 flex flex-col md:flex-row items-center gap-6 text-start">
        <div className="size-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-inner">
          <Sparkles className="size-8" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-indigo-900 mb-2">تلميح للذكاء الاصطناعي</h3>
          <p className="text-base text-indigo-800/80 leading-relaxed max-w-4xl italic">
            كل منتج تضيفه يصبح جزءاً من "ذاكرة" مساعدك الذكي. البوت سيتمكن من ترشيح المنتجات لعملائك، شرح مميزاتها، وحتى إعطائهم الأسعار بدقة خرافية!
          </p>
        </div>
      </div>

      {/* Modern Modal REDESIGN */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl bg-card rounded-[2.5rem] shadow-[0_32px_128px_-10px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
            <div className="flex items-center justify-between p-8 border-b bg-muted/10">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  {editingProductId ? <Edit className="size-7" /> : <Plus className="size-7" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black">
                    {editingProductId ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد'}
                  </h2>
                  <p className="text-sm text-muted-foreground font-bold mt-1">أدخل التفاصيل بدقة ليتمكن الـ AI من مساعدتك.</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseModal} className="rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all size-12">
                <X className="size-7" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-8 text-start scrollbar-hide">
              <div className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="name" className="text-lg font-black px-1">اسم المنتج</Label>
                  <Input
                    id="name"
                    required
                    placeholder="مثلاً: سماعة ابل Airpods Pro"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner focus-visible:ring-primary text-xl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="price" className="text-lg font-black px-1">السعر والعملة</Label>
                    <div className="flex gap-2 h-16">
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        required
                        placeholder="0.00"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="rounded-2xl h-full flex-1 bg-muted/30 border-none text-start text-xl font-bold"
                        dir="ltr"
                      />
                      <select
                        value={formData.currency}
                        onChange={e => setFormData({ ...formData, currency: e.target.value })}
                        className="h-full w-32 rounded-2xl bg-muted/50 border-none px-4 text-sm font-black tracking-tighter focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer hover:bg-muted transition-colors"
                      >
                        <option value="SAR">ر.س (SAR)</option>
                        <option value="USD">دولار ($)</option>
                        <option value="يمني قعيطي">يمني (قعيطي)</option>
                        <option value="يمني قديم">يمني (قديم)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="category" className="text-lg font-black px-1">التصنيف / الفئة</Label>
                    <Input
                      id="category"
                      required
                      placeholder="مثلاً: الكترونيات"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none shadow-inner focus-visible:ring-primary text-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="stock" className="text-lg font-black px-1">الكمية المتوفرة</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="h-16 rounded-2xl bg-muted/30 border-none text-center text-xl font-bold"
                    />
                  </div>
                  <div className="grid gap-3 text-start">
                    <Label htmlFor="status" className="text-lg font-black px-1">حالة العرض</Label>
                    <select
                      id="status"
                      className="h-16 rounded-2xl bg-muted/50 border-none px-6 text-base font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:bg-muted transition-colors"
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="active">نشط (متاح للبيع)</option>
                      <option value="draft">مسودة (للمعاينة فقط)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-3 text-start">
                  <Label htmlFor="description" className="text-lg font-black px-1">وصف المنتج (لأتمتة الأجوبة)</Label>
                  <textarea
                    id="description"
                    required
                    rows={5}
                    placeholder="اكتب هنا جميع تفاصيل المنتج، لونه، مقاسه، ضمانه... الذكاء الاصطناعي سيتعلم من هذا النص للرد على العملاء."
                    className="flex min-h-[160px] w-full rounded-[2rem] bg-muted/30 p-6 text-base font-medium border-none focus:ring-2 focus:ring-primary outline-none transition-all resize-none shadow-inner leading-relaxed"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-8 border-t flex flex-col sm:flex-row gap-4">
                <Button type="submit" size="lg" className="flex-1 rounded-2xl h-16 font-black text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 active:scale-95 transition-all text-white" disabled={isLoading}>
                  {isLoading ? 'جاري المعالجة...' : editingProductId ? 'تحديث البيانات' : 'إضافة إلى الكتالوج'}
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

