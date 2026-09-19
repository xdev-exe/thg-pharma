import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import {
  X,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  BellRing,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table,
  ChevronDown,
  Zap
} from 'lucide-react';

export const ProductModal: React.FC = () => {
  const { activeModal, closeModal, selectedProduct, lang, t, addToCart, buyNow, openRestockAlert } = useApp();
  const [activeTab, setActiveTab] = useState<'formula' | 'usage' | 'faqs'>('formula');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (activeModal !== 'product' || !selectedProduct) return null;

  const product = selectedProduct;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="relative p-6 sm:p-8 text-white shrink-0"
          style={{
            background: `linear-gradient(135deg, ${product.accentColor} 0%, #0A1628 100%)`,
          }}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 left-5 rtl:left-auto rtl:right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer z-10"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          <div className="grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="bg-white/20 px-3 py-1 rounded-full text-white backdrop-blur-md border border-white/30">
                  🇩🇪 {t('صيدلاني ألماني معتمد — THG 4 Pharma', 'Certified German Pharma — THG 4 Pharma')}
                </span>
                <span className="bg-[#D4A843] text-[#0A1628] px-3 py-1 rounded-full font-black">
                  {lang === 'ar' ? product.packSize_ar : product.packSize_en}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black leading-snug">
                {lang === 'ar' ? product.name_ar : product.name_en}
              </h2>

              <p className="text-slate-200 text-xs sm:text-sm max-w-xl leading-relaxed">
                {lang === 'ar' ? product.tagline_ar : product.tagline_en}
              </p>

              {/* Quick Metrics */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs pt-1">
                <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-100">
                  <Clock size={14} className="text-[#D4A843]" />
                  <span>{t(`تكفي ${product.supplyDays} يوماً`, `${product.supplyDays}-day supply`)}</span>
                </span>
                <span className="bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-slate-100">
                  <Sparkles size={14} className="text-emerald-400" />
                  <span>{lang === 'ar' ? product.servingBasis_ar : product.servingBasis_en}</span>
                </span>
              </div>
            </div>

            {/* Product Pack Photo */}
            <div className="sm:col-span-4 flex justify-center sm:justify-end">
              <div className="relative bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-lg">
                <picture>
                  <source srcSet={product.image} type="image/webp" />
                  <img
                    src={product.image.replace('.webp', '.jpg')}
                    alt={lang === 'ar' ? product.name_ar : product.name_en}
                    className="h-36 sm:h-44 w-auto object-contain rounded-xl drop-shadow-md"
                  />
                </picture>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 shrink-0">
          <button
            onClick={() => setActiveTab('formula')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'formula'
                ? 'border-[#C8102E] text-[#C8102E] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table size={16} />
            <span>{t('التركيبة والمليجرامات المعلنة', 'Declared Formulation')}</span>
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'usage'
                ? 'border-[#C8102E] text-[#C8102E] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock size={16} />
            <span>{t('طريقة الاستخدام والتخزين', 'Usage & Storage')}</span>
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`flex items-center gap-2 py-3 px-4 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'faqs'
                ? 'border-[#C8102E] text-[#C8102E] bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle size={16} />
            <span>{t('الأسئلة الصيدلانية الشائعة', 'Clinical FAQs')}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Tab 1: Formula & Nutrients */}
          {activeTab === 'formula' && (
            <div className="space-y-6 animate-fade-in">
              {/* Scientific Rationale / Long Description */}
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2">
                  {t('لماذا استوردت شركة THG هذه التركيبة الألمانية؟', 'Why THG Selected This German Formula')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {lang === 'ar' ? product.longDesc_ar : product.longDesc_en}
                </p>
              </div>

              {/* Declared Nutrients Table */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    {t('جدول المكونات الفعالة المعلنة بالمليجرام الدقيق', 'Declared Active Ingredients Table')}
                  </h4>
                  <span className="text-xs text-slate-500">
                    {lang === 'ar' ? product.servingBasis_ar : product.servingBasis_en}
                  </span>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                  <table className="w-full text-xs sm:text-sm text-right rtl:text-right ltr:text-left">
                    <thead className="bg-[#0A1628] text-white">
                      <tr>
                        <th className="py-3 px-4 font-bold">{t('المكوّن الفعال', 'Active Nutrient')}</th>
                        <th className="py-3 px-4 font-bold text-center">{t('الكمية الصريحة', 'Declared Amount')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {product.nutrients.map((nut, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="py-3 px-4 font-medium text-slate-800">
                            {lang === 'ar' ? nut.name_ar : nut.name_en}
                          </td>
                          <td className="py-3 px-4 font-extrabold text-center text-[#C8102E]">
                            {nut.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Benefits Checklist */}
              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3">
                  {t('المزايا والفوائد الحيوية', 'Core Health Benefits')}
                </h4>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {product.benefits_ar.map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-emerald-50/60 border border-emerald-200/70 p-3 rounded-xl">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs font-semibold text-slate-800 leading-snug">
                        {lang === 'ar' ? benefit : product.benefits_en[idx]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Usage, Storage & Warnings */}
          {activeTab === 'usage' && (
            <div className="space-y-6 animate-fade-in">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <h4 className="text-sm font-black text-blue-900 flex items-center gap-2 mb-2">
                  <Clock size={18} />
                  <span>{t('طريقة الاستخدام المقررة من الشركة المصنعة', 'Dosage & Administration')}</span>
                </h4>
                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                  {lang === 'ar' ? product.usage_ar : product.usage_en}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#C8102E]" />
                  <span>{t('بلد المنشأ والاستيراد الحصري', 'Country of Origin & Exclusive Import')}</span>
                </h4>
                <p className="text-xs text-slate-700">
                  {lang === 'ar' ? product.origin_ar : product.origin_en}
                </p>
                <p className="text-xs text-slate-500 pt-1 border-t border-slate-200">
                  {t('تعليمات التخزين: ', 'Storage: ')}
                  {lang === 'ar' ? product.storage_ar : product.storage_en}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlertCircle size={16} className="text-amber-500" />
                  <span>{t('ملاحظات وتحذيرات صيدلانية', 'Pharmaceutical Notes & Cautions')}</span>
                </h4>
                <ul className="space-y-2">
                  {product.warnings_ar.map((warn, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-xl border border-amber-200/60">
                      <span className="text-amber-600 font-bold">•</span>
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
                      className="w-full flex items-center justify-between p-4 text-right rtl:text-right ltr:text-left bg-slate-50 hover:bg-slate-100 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
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
                      <div className="p-4 text-xs sm:text-sm text-slate-700 bg-white border-t border-slate-200 leading-relaxed">
                        {lang === 'ar' ? faq.answer_ar : faq.answer_en}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sticky Modal Footer (Price + Add to Cart + Buy Now) */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="w-full sm:w-auto flex items-center justify-between sm:block">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">
              {t('السعر بالجنيه المصري (شحن مجاني)', 'Price (Free Delivery)')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900">
              {formatEGP(product.price, lang)}
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2 sm:gap-3">
            {product.inStock ? (
              <>
                <button
                  onClick={() => {
                    closeModal();
                    buyNow(product);
                  }}
                  className="flex-1 sm:flex-initial bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-xs sm:text-sm px-5 py-3 rounded-full shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Zap size={16} className="fill-white" />
                  <span>{t('شراء فوري (دفع عند الاستلام)', 'Buy Now (COD)')}</span>
                </button>

                <button
                  onClick={() => {
                    addToCart(product);
                    closeModal();
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs sm:text-sm px-4 py-3 rounded-full transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>{t('السلة', 'Bag')}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  closeModal();
                  openRestockAlert(product);
                }}
                className="w-full sm:w-auto bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <BellRing size={16} className="text-[#D4A843]" />
                <span>{t('إشعار فور وصول الشحنة', 'Alert When In Stock')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
