import React from 'react';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

export const StickyBottomBar: React.FC = () => {
  const { cartCount, total, activeModal, openModal, lang, t } = useApp();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  // Don't show if cart is empty or if any modal is already open
  if (cartCount === 0 || activeModal !== null) return null;

  return (
    <div className="sm:hidden fixed bottom-0 inset-x-0 z-30 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] animate-slide-up">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        {/* Cart Item count & Total summary */}
        <button
          onClick={() => openModal('cart')}
          className="flex items-center gap-2 text-right rtl:text-right ltr:text-left cursor-pointer"
        >
          <div className="relative p-2 bg-slate-100 rounded-xl text-slate-800 shrink-0">
            <ShoppingBag size={18} />
            <span className="absolute -top-1 -right-1 bg-[#C8102E] text-white text-[10px] font-black h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold block uppercase leading-none">
              {t('إجمالي طلبك', 'Cart Total')}
            </span>
            <span className="text-sm font-black text-slate-900 leading-tight">
              {formatEGP(total, lang)}
            </span>
          </div>
        </button>

        {/* Big Checkout Direct Action Button */}
        <button
          onClick={() => openModal('checkout')}
          className="flex-1 py-3 px-4 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-xs rounded-xl shadow-md shadow-red-900/20 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
        >
          <span>{t('كمّل طلبك (معاينة قبل الدفع) 🚚', 'Checkout (COD Inspection) 🚚')}</span>
          <ArrowIcon size={15} />
        </button>
      </div>
    </div>
  );
};
