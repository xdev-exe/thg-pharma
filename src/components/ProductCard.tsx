import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import { ShoppingBag, BellRing, Check, Info, ShieldCheck, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { lang, t, addToCart, buyNow, openProductDetails, openRestockAlert } = useApp();

  return (
    <div className="group relative flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-200 overflow-hidden card-hover">
      {/* Product Image Showcase Area */}
      <div className="relative bg-gradient-to-b from-slate-50 to-slate-100/70 p-6 flex flex-col items-center justify-center border-b border-slate-150 overflow-hidden min-h-[260px] sm:min-h-[280px]">
        {/* Badges Overlay */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2 z-10">
          <span className="bg-[#0A1628]/90 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <span>🇩🇪</span>
            <span>{t('ألماني صيدلاني', 'German GMP')}</span>
          </span>

          {product.badge_ar && (
            <span className="bg-[#C8102E] text-white px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black shadow-xs">
              {lang === 'ar' ? product.badge_ar : product.badge_en}
            </span>
          )}
        </div>

        {/* Ambient colored glow behind product */}
        <div
          className="absolute w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none group-hover:opacity-35 transition-opacity"
          style={{ backgroundColor: product.accentColor }}
        />

        {/* Product Box Image */}
        <button
          onClick={() => openProductDetails(product)}
          className="relative z-10 w-full flex items-center justify-center pt-6 pb-2 cursor-pointer focus:outline-none"
          title={t('عرض التفاصيل الكاملة', 'View Details')}
        >
          <picture>
            <source srcSet={product.image} type="image/webp" />
            <img
              src={product.image.replace('.webp', '.jpg')}
              alt={lang === 'ar' ? product.name_ar : product.name_en}
              className="h-44 sm:h-52 w-auto object-contain drop-shadow-[0_12px_20px_rgba(0,0,0,0.14)] group-hover:scale-105 transition-transform duration-200"
              loading="lazy"
            />
          </picture>
        </button>

        {/* Bottom Pill on Image: Pack Size */}
        <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px]">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-2.5 py-0.5 rounded-md font-bold shadow-2xs border border-slate-200/80">
            {lang === 'ar' ? product.packSize_ar : product.packSize_en} •{' '}
            {t(`تكفي ${product.supplyDays} يوماً`, `${product.supplyDays}d supply`)}
          </span>

          <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
            THG 4 PHARMA
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          {/* Product Title */}
          <div>
            <span className="text-[10px] tracking-wider uppercase font-black text-[#C8102E] block">
              {t('مستورد صيدلاني معتمد', 'Certified Pharma Import')}
            </span>
            <h3
              onClick={() => openProductDetails(product)}
              className="text-lg sm:text-xl font-black text-slate-900 mt-0.5 leading-snug cursor-pointer hover:text-[#C8102E] transition-colors"
            >
              {lang === 'ar' ? product.name_ar.split('—')[0] : product.name_en.split('—')[0]}
            </h3>
            <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
              {lang === 'ar' ? product.name_ar.split('—')[1] : product.name_en.split('—')[1]}
            </p>
          </div>

          {/* Tagline / Main Differentiator */}
          <p className="text-xs font-semibold text-slate-700 leading-relaxed line-clamp-2">
            {lang === 'ar' ? product.tagline_ar : product.tagline_en}
          </p>

          {/* Key Declared Nutrients Matrix (Highlights) */}
          <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-150 space-y-1.5">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              {t('أبرز العناصر المعلنة بالمليجرام:', 'Declared Actives Breakdown:')}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {product.nutrients.slice(0, 4).map((nut, idx) => (
                <div key={idx} className="flex items-center justify-between text-[11px] bg-white px-2 py-1 rounded-md border border-slate-200/80">
                  <span className="text-slate-600 truncate max-w-[85px]">
                    {lang === 'ar' ? nut.name_ar.split('(')[0] : nut.name_en.split('(')[0]}
                  </span>
                  <span className="font-black text-[#0A1628] shrink-0 text-[10px] sm:text-[11px]">{nut.amount}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bullet points benefits */}
          <ul className="space-y-1 text-xs text-slate-600">
            {product.benefits_ar.slice(0, 2).map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <Check size={13} className="text-[#C8102E] shrink-0 mt-0.5" />
                <span className="line-clamp-1">{lang === 'ar' ? benefit : product.benefits_en[idx]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom Pricing & Action Buttons */}
        <div className="pt-3 border-t border-slate-150 space-y-3">
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
                  <Zap size={15} className="fill-white" />
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
