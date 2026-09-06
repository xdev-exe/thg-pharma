import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import { ShoppingBag, BellRing, Sparkles, Check, Info, ShieldCheck, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { lang, t, addToCart, buyNow, openProductDetails, openRestockAlert } = useApp();

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden card-hover">
      {/* Top Banner / Visual Header */}
      <div
        className="relative p-6 pb-8 text-white overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${product.accentColor} 0%, #0A1628 100%)`,
        }}
      >
        {/* Subtle decorative circle */}
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />

        {/* Top Badges: Stock Status + Highlight */}
        <div className="flex items-center justify-between gap-2 text-xs font-bold mb-4">
          <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full border border-white/30 text-[11px] flex items-center gap-1">
            <span>🇩🇪</span>
            <span>{t('ألماني صيدلاني أصلي', 'German GMP')}</span>
          </span>

          {product.badge_ar && (
            <span className="bg-[#D4A843] text-[#0A1628] px-2.5 py-0.5 rounded-full text-[11px] font-black shadow-xs">
              {lang === 'ar' ? product.badge_ar : product.badge_en}
            </span>
          )}
        </div>

        {/* Product SKU Header Graphic / Pack Size Indicator */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-[10px] tracking-wider uppercase font-extrabold text-white/70 block">
              {t('مستورد حصري THG 4 Pharma', 'Exclusive Import by THG')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-1 leading-snug">
              {lang === 'ar' ? product.name_ar.split('—')[0] : product.name_en.split('—')[0]}
            </h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              {lang === 'ar' ? product.name_ar.split('—')[1] : product.name_en.split('—')[1]}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            <Sparkles size={24} className="text-[#D4A843]" />
          </div>
        </div>

        {/* Supply Days Pill */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[11px] bg-black/30 backdrop-blur-sm text-slate-100 px-2.5 py-1 rounded-md font-semibold">
            {lang === 'ar' ? product.packSize_ar : product.packSize_en} •{' '}
            {t(`تكفي ${product.supplyDays} يوماً`, `${product.supplyDays}-day supply`)}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-4">
          {/* Tagline / Main Differentiator */}
          <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-relaxed">
            {lang === 'ar' ? product.tagline_ar : product.tagline_en}
          </p>

          {/* Key Declared Nutrients Matrix (Highlights) */}
          <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 space-y-1.5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
              {t('أبرز العناصر المعلنة بالمليجرام:', 'Declared Actives Breakdown:')}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {product.nutrients.slice(0, 4).map((nut, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200">
                  <span className="text-slate-600 truncate max-w-[90px]">
                    {lang === 'ar' ? nut.name_ar.split('(')[0] : nut.name_en.split('(')[0]}
                  </span>
                  <span className="font-extrabold text-[#0A1628] shrink-0">{nut.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet points benefits */}
          <ul className="space-y-1.5 text-xs text-slate-600">
            {product.benefits_ar.slice(0, 2).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check size={14} className="text-[#C8102E] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{lang === 'ar' ? benefit : product.benefits_en[idx]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Pricing & Action Buttons */}
        <div className="pt-4 border-t border-slate-150 space-y-3">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block uppercase">
                {t('السعر الرسمي المعتمد', 'Authorized Price')}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {formatEGP(product.price, lang)}
              </div>
            </div>

            <div className="text-right rtl:text-left">
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck size={12} />
                <span>{t('شحن مجاني', 'Free Delivery')}</span>
              </span>
            </div>
          </div>

          {/* Fast Checkout CTA Hierarchy */}
          <div className="space-y-2">
            {product.inStock ? (
              <>
                {/* Instant Checkout / Buy Now */}
                <button
                  onClick={() => buyNow(product)}
                  className="w-full py-3 px-4 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-red-900/20 hover:shadow-red-900/35 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
                >
                  <Zap size={16} className="fill-white" />
                  <span>{t('شراء فوري (الدفع عند الاستلام)', 'Buy Now (Cash on Delivery)')}</span>
                </button>

                {/* Secondary Row: Add to Bag + Details */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag size={14} />
                    <span>{t('إضافة للسلة', 'Add to Bag')}</span>
                  </button>

                  <button
                    onClick={() => openProductDetails(product)}
                    className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Info size={14} />
                    <span>{t('التفاصيل', 'Details')}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => openRestockAlert(product)}
                  className="w-full py-3 px-3 bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <BellRing size={14} className="text-[#D4A843]" />
                  <span>{t('حجز الشحنة القادمة', 'Join Waitlist')}</span>
                </button>

                <button
                  onClick={() => openProductDetails(product)}
                  className="w-full py-3 px-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Info size={14} />
                  <span>{t('التفاصيل', 'Details')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
