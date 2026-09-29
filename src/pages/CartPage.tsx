import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { formatEGP } from '../lib/utils';
import { pixelInitiateCheckout } from '../lib/pixel';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Truck,
  Tag,
  ShieldCheck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    subtotal,
    discount,
    promoCode,
    applyPromo,
    removePromo,
    total,
    removeFromCart,
    updateQuantity,
    lang,
    t,
  } = useApp();

  const navigate = useNavigate();
  const [inputCode, setInputCode] = useState('');
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      applyPromo(inputCode);
      setInputCode('');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-[#C8102E] text-white rounded-xl">
            <ShoppingBag size={22} />
          </div>
          <div>
            <h1 className="font-extrabold text-slate-900 text-xl">
              {t('سلة مشترياتك في THG', 'Your Shopping Bag')}
            </h1>
            <span className="text-sm text-slate-500 font-medium">
              {cartCount} {t('مكملات مختارة', 'items')}
            </span>
          </div>
        </div>

        {/* Free Shipping Banner */}
        <div className="bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 flex items-center gap-2.5 text-xs text-emerald-800 font-bold mb-4">
          <Truck size={16} className="text-emerald-600 shrink-0" />
          <span>
            {t(
              'طلبك مؤهل للشحن السريع المجاني لكل محافظات مصر 🎉',
              'Your order qualifies for Free Express Nationwide Delivery 🎉'
            )}
          </span>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-4">
          {cart.length === 0 ? (
            <div className="py-20 text-center space-y-4 px-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <ShoppingBag size={36} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  {t('سلتك لسه فاضية', 'Your bag is empty')}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {t(
                    'نقي المكمل الألماني اللي يناسب روتينك اليومي، وإحنا هنوصلهولك متبرد ومحمي لحد باب بيتك.',
                    'Pick the German formula that matches your routine, and we will deliver it safely.'
                  )}
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="mt-2 px-6 py-2.5 bg-[#0A1628] hover:bg-slate-800 text-white text-xs font-bold rounded-full transition-all cursor-pointer"
              >
                {t('شوف المكملات المتاحة', 'Explore Supplements')}
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 px-5">
              {cart.map((item) => (
                <div key={item.product.id} className="py-5 flex gap-3.5 items-center">
                  {/* Product Thumbnail */}
                  <div className="w-16 h-16 rounded-xl shrink-0 bg-slate-50 p-1 border border-slate-200 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.product.imageThumb || item.product.image}
                      alt={lang === 'ar' ? item.product.name_ar : item.product.name_en}
                      className="h-full w-auto object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {lang === 'ar' ? item.product.name_ar : item.product.name_en}
                    </h4>
                    <span className="text-[11px] text-slate-500 block">
                      {lang === 'ar' ? item.product.packSize_ar : item.product.packSize_en}
                    </span>
                    <div className="font-black text-slate-900 text-sm mt-1">
                      {formatEGP(item.product.price, lang)}
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title={t('تقليل', 'Decrease')}
                    >
                      <Minus size={13} />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 select-none">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                      title={t('زيادة', 'Increase')}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    title={t('حذف من السلة', 'Remove item')}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: Promo + Summary + CTA */}
        {cart.length > 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 space-y-5">
            {/* Promo Code */}
            <div>
              {promoCode ? (
                <div className="flex items-center justify-between bg-red-50 border border-red-200 p-3 rounded-xl text-xs">
                  <div className="flex items-center gap-1.5 text-red-700 font-bold">
                    <Tag size={14} />
                    <span>{t(`كود الخصم مفعّل: ${promoCode} (10% خصم)`, `Promo active: ${promoCode} (10% off)`)}</span>
                  </div>
                  <button
                    onClick={removePromo}
                    className="text-red-700 hover:text-red-900 font-bold underline cursor-pointer"
                  >
                    {t('إلغاء', 'Remove')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder={t('لديك كود خصم؟ (جرّب THG10)', 'Promo code? (Try THG10)')}
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs uppercase font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    {t('تطبيق', 'Apply')}
                  </button>
                </form>
              )}
            </div>

            {/* Price Summary */}
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                <span className="font-bold text-slate-900">{formatEGP(subtotal, lang)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-[#C8102E] font-bold">
                  <span>{t('قيمة الخصم', 'Discount')}</span>
                  <span>-{formatEGP(discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-emerald-700 font-bold">
                <span>{t('مصاريف الشحن والتوصيل', 'Shipping')}</span>
                <span>{t('مجاني (0 ج.م)', 'Free (0 EGP)')}</span>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between text-base font-black text-slate-900">
                <span>{t('المجموع الإجمالي', 'Total')}</span>
                <span className="text-lg text-[#C8102E]">{formatEGP(total, lang)}</span>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 font-medium">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>{t('معاينة العبوة ومطابقتها قبل ما تدفع أي جنيه للمندوب', 'Cash on Delivery after full pack inspection')}</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={() => {
                pixelInitiateCheckout({
                  content_ids: cart.map((item) => item.product.id),
                  num_items: cartCount,
                  value: total,
                });
                navigate('/checkout');
              }}
              className="w-full py-4 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>{t('كمّل طلبك دلوقتي (الدفع عند الاستلام)', 'Proceed to Secure Checkout')}</span>
              <ArrowIcon size={18} />
            </button>

            {/* Back to store */}
            <button
              onClick={() => navigate('/')}
              className="w-full py-3 text-slate-600 hover:text-slate-900 font-medium text-xs transition-colors cursor-pointer"
            >
              {t('← ارجع للمتجر', '← Continue Shopping')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
