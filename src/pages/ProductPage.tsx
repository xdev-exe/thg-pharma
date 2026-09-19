import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import { useSEO } from '../hooks/useSEO';
import {
  ShieldCheck,
  ShoppingBag,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table,
  ChevronDown,
  Zap,
  ArrowRight,
  ArrowLeft,
  Truck,
  Share2,
  MessageCircle,
  Check,
  Plus,
  Minus,
  Star,
  Award
} from 'lucide-react';

export const ProductPage: React.FC = () => {
  const { slugOrId } = useParams<{ slugOrId: string }>();
  const navigate = useNavigate();
  const { lang, t, addToCart, buyNow, openRestockAlert, showToast } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'formula' | 'usage' | 'faqs'>('formula');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find product by id or slug
  const product = PRODUCTS.find(
    (p) => p.id === slugOrId || p.slug === slugOrId
  );

  // Apply dynamic SEO and Schema.org
  useSEO({ product, lang });

  const BackIcon = lang === 'ar' ? ArrowRight : ArrowLeft;

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center font-black text-2xl">
            !
          </div>
          <h1 className="text-xl font-black text-slate-900">
            {t('المكمل غير موجود أو تم تغيير الرابط', 'Product Not Found')}
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t(
              'الرابط الذي تبحث عنه غير متاح حالياً، يمكنك تصفح جميع المكملات الألمانية المعتمدة من الصفحة الرئيسية.',
              'The product you are looking for is unavailable. Browse our certified German supplements on the homepage.'
            )}
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#0A1628] hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors"
          >
            <BackIcon size={16} />
            <span>{t('العودة لجميع المكملات', 'Back to All Products')}</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related products (exclude current)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  const handleShare = () => {
    const url = `https://thg4pharma.com/product/${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      showToast(
        lang === 'ar' ? 'تم نسخ رابط المنتج بنجاح! 📋' : 'Product link copied to clipboard! 📋',
        'success'
      );
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const whatsAppMessage = encodeURIComponent(
    `السلام عليكم، حابب أستفسر وأطلب مكمل ${product.name_ar} (سعر: ${product.price} ج.م مع الشحن المجاني).`
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-16 animate-fade-in">
      {/* Breadcrumbs Strip */}
      <div className="bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-[#C8102E] transition-colors flex items-center gap-1">
              <span>{t('الرئيسية', 'Home')}</span>
            </Link>
            <span>/</span>
            <Link to="/#products" className="hover:text-[#C8102E] transition-colors">
              {t('مكملات دوبيل هيرز الألمانية', 'German Supplements')}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">
              {lang === 'ar' ? product.name_ar.split('—')[0].trim() : product.name_en.split('—')[0].trim()}
            </span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
        {/* Main Product Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Product Visual Showcase (5 Cols on desktop) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-sm flex flex-col items-center justify-center min-h-[380px] sm:min-h-[440px] overflow-hidden group">
              {/* Badges Overlay */}
              <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
                <span className="bg-[#0A1628]/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <span>🇩🇪</span>
                  <span>{t('تصنيع ألماني صيدلاني GMP', 'German Pharma GMP')}</span>
                </span>

                {product.badge_ar && (
                  <span className="bg-[#C8102E] text-white px-3 py-1 rounded-full text-xs font-black shadow-xs">
                    {lang === 'ar' ? product.badge_ar : product.badge_en}
                  </span>
                )}
              </div>

              {/* Ambient Glow */}
              <div
                className="absolute w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none group-hover:opacity-30 transition-opacity"
                style={{ backgroundColor: product.accentColor }}
              />

              {/* Product Pack Photo */}
              <picture className="relative z-10">
                <source srcSet={product.image} type="image/webp" />
                <img
                  src={product.image.replace('.webp', '.jpg')}
                  alt={lang === 'ar' ? product.name_ar : product.name_en}
                  className="h-64 sm:h-80 w-auto object-contain rounded-2xl drop-shadow-[0_20px_30px_rgba(0,0,0,0.18)] transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
              </picture>

              {/* Pack details bottom bar */}
              <div className="absolute bottom-4 inset-x-4 flex items-center justify-between text-xs">
                <span className="bg-white/95 backdrop-blur-sm text-slate-800 px-3 py-1 rounded-lg font-bold shadow-xs border border-slate-200/80">
                  {lang === 'ar' ? product.packSize_ar : product.packSize_en} • {t(`تكفي ${product.supplyDays} يوماً`, `${product.supplyDays}d supply`)}
                </span>

                <span className="text-[11px] text-slate-500 font-black uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md">
                  THG 4 PHARMA
                </span>
              </div>
            </div>

            {/* Quality Reassurance Strip Under Photo */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{t('معاينة قبل الدفع', 'Inspect Before Pay')}</span>
                  <span className="text-slate-500 text-[11px]">{t('افحص العلبة بنفسك', 'Open & inspect')}</span>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <Truck size={18} />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block">{t('شحن مجاني وسريع', 'Free Express')}</span>
                  <span className="text-slate-500 text-[11px]">{t('لكل الـ 27 محافظة', 'All 27 Governorates')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Commercial Details & High-Converting CTAs (7 Cols on desktop) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-black tracking-wider uppercase text-[#C8102E] bg-red-50 border border-red-200/80 px-3 py-1 rounded-full">
                  {t('المستورد الصيدلاني المعتمد في مصر • Queisser Pharma', 'Certified Pharma Import • Queisser Pharma')}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-[#0A1628] bg-white border border-slate-200 px-3 py-1 rounded-full transition-colors cursor-pointer hover:bg-slate-50"
                  title={t('مشاركة رابط المنتج', 'Share product link')}
                >
                  {copiedLink ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                  <span>{copiedLink ? t('تم النسخ', 'Copied') : t('مشاركة', 'Share')}</span>
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {lang === 'ar' ? product.name_ar : product.name_en}
              </h1>

              <p className="text-sm sm:text-base font-semibold text-slate-700 leading-relaxed">
                {lang === 'ar' ? product.tagline_ar : product.tagline_en}
              </p>

              {/* Star Rating Strip */}
              <div className="flex items-center gap-2 text-xs pt-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="font-bold text-slate-900">4.9 / 5</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 font-medium">
                  {t('أكثر من 150 تقييم صيدلاني معتمد في مصر', 'Over 150 verified Egyptian customer reviews')}
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 space-y-4 shadow-xs">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">
                    {t('السعر الرسمي المعتمد من المستورد', 'Official Importer Price')}
                  </span>
                  <div className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {formatEGP(product.price, lang)}
                  </div>
                </div>

                <div className="text-right rtl:text-left space-y-1">
                  <span className="text-xs text-emerald-700 font-black bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-2xs">
                    <Truck size={14} />
                    <span>{t('شحن مجاني بالكامل', 'Free Shipping')}</span>
                  </span>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {t('التوصيل خلال 24–48 ساعة', 'Delivered in 24–48h')}
                  </div>
                </div>
              </div>

              {/* Quantity selector (if in stock) */}
              {product.inStock && (
                <div className="flex items-center justify-between pt-3 border-t border-slate-150">
                  <span className="text-xs font-bold text-slate-700">
                    {t('الكمية المطلوبة:', 'Order Quantity:')}
                  </span>
                  <div className="flex items-center bg-slate-100 rounded-xl border border-slate-200 p-1">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer shadow-2xs"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-12 text-center font-black text-slate-900 text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer shadow-2xs"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons: 1-Tap Buy Now + Add to Bag */}
              <div className="space-y-3 pt-2">
                {product.inStock ? (
                  <>
                    {/* Primary Buy Now (COD) Button */}
                    <button
                      onClick={() => buyNow(product, quantity)}
                      className="w-full py-4 px-6 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-sm sm:text-base rounded-2xl transition-all shadow-lg shadow-red-900/25 hover:shadow-red-900/40 flex items-center justify-center gap-2.5 active:scale-95 cursor-pointer"
                    >
                      <Zap size={18} className="fill-white" />
                      <span>
                        {t(
                          'شراء فوري الآن (الدفع عند الاستلام بعد المعاينة)',
                          'Buy Now (Cash on Delivery After Inspection)'
                        )}
                      </span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Add to Cart */}
                      <button
                        onClick={() => addToCart(product, quantity)}
                        className="py-3.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <ShoppingBag size={16} />
                        <span>{t('إضافة إلى سلة المشتريات', 'Add to Bag')}</span>
                      </button>

                      {/* Direct WhatsApp Order */}
                      <a
                        href={`https://wa.me/201220722034?text=${whatsAppMessage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <MessageCircle size={16} />
                        <span>{t('اطلب عبر واتساب مباشرة', 'Order via WhatsApp')}</span>
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <Clock size={15} className="text-amber-700" />
                        <span>{t('نفد المخزون مؤقتاً — الشحنة الجديدة في الطريق', 'Temporarily Sold Out — Next Shipment Incoming')}</span>
                      </div>
                      <p className="text-slate-600">
                        {t(
                          'الشحنة الألمانية الجديدة قيد الفحص والإفراج الجمركي المبرد. احجز الآن وسنتواصل معك فور توفرها.',
                          'The new German shipment is in cold-chain transit. Join the waitlist for priority notification.'
                        )}
                      </p>
                    </div>

                    <button
                      onClick={() => openRestockAlert(product)}
                      className="w-full py-4 px-6 bg-[#0A1628] hover:bg-slate-800 text-white font-black text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <BellRing size={18} className="text-[#D4A843]" />
                      <span>{t('سجل في قائمة الانتظار للحصول على أسبقية الشحن', 'Join Priority Waitlist')}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Inspection Guarantee Callout */}
              <div className="pt-2 text-center text-xs text-slate-500 font-medium">
                {t(
                  '🔒 ضمان THG: لا تدفع أي مليم إلا بعد فتح الشحنة والتأكد من سلامتها ومطابقتها للمواصفات الألمانية.',
                  '🔒 THG Guarantee: Pay zero until you open and inspect the authentic package with the courier.'
                )}
              </div>
            </div>

            {/* Quick Declared Matrix Cards */}
            <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="uppercase tracking-wider">
                  {t('المواد الفعالة المعلنة بالجرام الدقيق:', 'Declared Actives Per Daily Serving:')}
                </span>
                <span className="text-slate-500">
                  {lang === 'ar' ? product.servingBasis_ar : product.servingBasis_en}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {product.nutrients.slice(0, 4).map((nut, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200/90 text-center space-y-0.5">
                    <span className="text-[11px] text-slate-600 font-medium block truncate">
                      {lang === 'ar' ? nut.name_ar.split('(')[0] : nut.name_en.split('(')[0]}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-[#C8102E] block">
                      {nut.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Deep Scientific & Clinical Formulation Tabs */}
        <section className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto">
            <button
              onClick={() => setActiveTab('formula')}
              className={`flex items-center gap-2 py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'formula'
                  ? 'border-[#C8102E] text-[#C8102E] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Table size={16} />
              <span>{t('التركيبة والمليجرامات المعلنة بالكامل', 'Declared Formulation Matrix')}</span>
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              className={`flex items-center gap-2 py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'usage'
                  ? 'border-[#C8102E] text-[#C8102E] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={16} />
              <span>{t('طريقة الاستخدام والتخزين والتحذيرات', 'Usage & Storage Guidelines')}</span>
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`flex items-center gap-2 py-4 px-6 font-bold text-xs sm:text-sm border-b-2 transition-all shrink-0 cursor-pointer ${
                activeTab === 'faqs'
                  ? 'border-[#C8102E] text-[#C8102E] bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <HelpCircle size={16} />
              <span>{t('الأسئلة الصيدلانية الشائعة', 'Clinical FAQs')}</span>
            </button>
          </div>

          {/* Tab Content Area */}
          <div className="p-6 sm:p-10 space-y-8 text-slate-800">
            {/* Tab 1: Formula */}
            {activeTab === 'formula' && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                    <Award size={20} className="text-[#C8102E]" />
                    <span>{t('لماذا اختارت THG 4 Pharma هذه التركيبة الألمانية؟', 'Why THG Selected This German Formula')}</span>
                  </h3>
                  <div className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-3">
                    <p>{lang === 'ar' ? product.longDesc_ar : product.longDesc_en}</p>
                  </div>
                </div>

                {/* Declared Nutrients Table */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-slate-900">
                      {t('جدول المكونات الفعالة المعلنة صيدلانياً بكل شفافية', 'Full Disclosed Nutritional Actives Table')}
                    </h3>
                    <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
                      {lang === 'ar' ? product.servingBasis_ar : product.servingBasis_en}
                    </span>
                  </div>

                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                    <table className="w-full text-xs sm:text-sm text-right rtl:text-right ltr:text-left">
                      <thead className="bg-[#0A1628] text-white">
                        <tr>
                          <th className="py-3.5 px-5 font-bold">{t('المكوّن الفعال', 'Active Nutrient')}</th>
                          <th className="py-3.5 px-5 font-bold text-center">{t('التركيز المعلن بالمليجرام', 'Declared Amount')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 bg-white">
                        {product.nutrients.map((nut, idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}>
                            <td className="py-3.5 px-5 font-semibold text-slate-800">
                              {lang === 'ar' ? nut.name_ar : nut.name_en}
                            </td>
                            <td className="py-3.5 px-5 font-black text-center text-[#C8102E]">
                              {nut.amount}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Benefits List */}
                <div>
                  <h3 className="text-base font-black text-slate-900 mb-4">
                    {t('الفوائد والنتائج الصحية المثبتة', 'Proven Health Benefits')}
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {product.benefits_ar.map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 bg-emerald-50/70 border border-emerald-200/80 p-3.5 rounded-2xl">
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                          {lang === 'ar' ? benefit : product.benefits_en[idx]}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Usage */}
            {activeTab === 'usage' && (
              <div className="space-y-6 animate-fade-in">
                <div className="p-5 sm:p-6 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2">
                  <h3 className="text-sm font-black text-blue-900 flex items-center gap-2">
                    <Clock size={18} />
                    <span>{t('طريقة الاستخدام المقررة من الشركة المصنعة (Queisser Pharma)', 'Prescribed Administration Method')}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-900 leading-relaxed font-medium">
                    {lang === 'ar' ? product.usage_ar : product.usage_en}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#C8102E]" />
                    <span>{t('بلد الصنع والتخزين الصيدلي السليم', 'Origin & Temperature Custody')}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700">
                    {lang === 'ar' ? product.origin_ar : product.origin_en}
                  </p>
                  <p className="text-xs text-slate-600 pt-2 border-t border-slate-200">
                    <span className="font-bold text-slate-800">{t('شروط التخزين: ', 'Storage Requirement: ')}</span>
                    {lang === 'ar' ? product.storage_ar : product.storage_en}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-amber-600" />
                    <span>{t('إرشادات وتحذيرات صيدلانية', 'Pharmaceutical Safety Notes')}</span>
                  </h3>
                  <ul className="space-y-2.5">
                    {product.warnings_ar.map((warn, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
                        <span className="text-amber-700 font-bold">•</span>
                        <span>{lang === 'ar' ? warn : product.warnings_en[idx]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab 3: FAQs */}
            {activeTab === 'faqs' && (
              <div className="space-y-3 animate-fade-in">
                {product.faqs.map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-2xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-right rtl:text-right ltr:text-left bg-slate-50 hover:bg-slate-100 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                      >
                        <span>{lang === 'ar' ? faq.question_ar : faq.question_en}</span>
                        <ChevronDown
                          size={18}
                          className={`transition-transform duration-200 shrink-0 text-slate-400 ${
                            isOpen ? 'rotate-180 text-[#C8102E]' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-700 bg-white border-t border-slate-200 leading-relaxed font-medium">
                          {lang === 'ar' ? faq.answer_ar : faq.answer_en}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Related German Products */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {t('مكملات ألمانية أخرى قد تهمك من THG', 'Explore More From Our German Line')}
            </h2>
            <Link
              to="/"
              className="text-xs sm:text-sm font-bold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              <span>{t('عرض كافة المكملات', 'View Catalog')}</span>
              <BackIcon size={14} className="rotate-180 rtl:rotate-0" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  navigate(`/product/${rel.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-center min-h-[160px] relative overflow-hidden">
                  <picture>
                    <source srcSet={rel.image} type="image/webp" />
                    <img
                      src={rel.image.replace('.webp', '.jpg')}
                      alt={lang === 'ar' ? rel.name_ar : rel.name_en}
                      className="h-28 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </picture>
                  {rel.badge_ar && (
                    <span className="absolute top-2 right-2 rtl:right-2 rtl:left-auto bg-[#C8102E] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {lang === 'ar' ? rel.badge_ar : rel.badge_en}
                    </span>
                  )}
                </div>

                <div className="pt-4 space-y-2">
                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-[#C8102E] transition-colors">
                    {lang === 'ar' ? rel.name_ar.split('—')[0] : rel.name_en.split('—')[0]}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {lang === 'ar' ? rel.tagline_ar : rel.tagline_en}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-150">
                    <span className="text-sm font-black text-slate-900">{formatEGP(rel.price, lang)}</span>
                    <span className="text-xs font-bold text-[#C8102E]">{t('تفاصيل المنتج ←', 'View Details →')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Mobile Sticky Checkout Bar for this Product */}
      {product.inStock && (
        <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_25px_rgba(0,0,0,0.1)] animate-slide-up">
          <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <img
                src={product.imageThumb || product.image}
                alt={product.name_en}
                className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200"
              />
              <div>
                <span className="text-xs font-black text-slate-900 block leading-tight">
                  {formatEGP(product.price, lang)}
                </span>
                <span className="text-[10px] text-emerald-600 font-bold block">
                  {t('شحن مجاني لكافة المحافظات', 'Free Shipping')}
                </span>
              </div>
            </div>

            <button
              onClick={() => buyNow(product, quantity)}
              className="flex-1 py-3 px-4 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-xs rounded-xl shadow-md shadow-red-900/25 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
            >
              <Zap size={15} className="fill-white" />
              <span>{t('شراء فوري (معاينة قبل الدفع) 🚚', 'Buy Now (COD) 🚚')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
