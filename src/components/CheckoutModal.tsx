import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EGYPT_GOVERNORATES } from '../data/governorates';
import { formatEGP, isValidEgyptianPhone, normalizeEgyptianPhone } from '../lib/utils';
import { mockApi } from '../lib/mockApi';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  Truck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Loader2,
  PackageCheck
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    cart,
    subtotal,
    discount,
    total,
    clearCart,
    lang,
    t,
    openModal,
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: 'cairo',
    address: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'card_delivery'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState<any | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);

  if (activeModal !== 'checkout') return null;

  const selectedGov = EGYPT_GOVERNORATES.find((g) => g.id === formData.governorate) || EGYPT_GOVERNORATES[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name.trim()) {
      setErrorMessage(t('يرجى إدخال اسم المستلم بالكامل', 'Please enter full recipient name'));
      return;
    }

    if (!isValidEgyptianPhone(formData.phone)) {
      setErrorMessage(
        t(
          'يرجى إدخال رقم هاتف مصري صحيح يبدأ بـ 010 أو 011 أو 012 أو 015',
          'Please enter a valid Egyptian mobile number (010, 011, 012, 015)'
        )
      );
      return;
    }

    if (!formData.address.trim() || formData.address.trim().length < 8) {
      setErrorMessage(
        t('يرجى كتابة العنوان التفصيلي (المنطقة، الشارع، رقم العمارة)', 'Please provide full detailed delivery address')
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const normalizedPhone = normalizeEgyptianPhone(formData.phone);
      const res = await mockApi.createOrder(
        {
          ...formData,
          phone: normalizedPhone,
          governorate: lang === 'ar' ? selectedGov.name_ar : selectedGov.name_en,
        },
        cart,
        subtotal,
        0,
        total
      );

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C8102E', '#0A1628', '#D4A843'],
      });

      setOrderCompleted(res);
      clearCart();
    } catch (err) {
      setErrorMessage(t('حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مجدداً', 'Error placing order, please try again'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0A1628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C8102E] rounded-xl text-white">
              <PackageCheck size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {orderCompleted
                  ? t('ألف مبروك! طلبك اتأكد وبقى في أيدي أمينة 🎉', 'Order Confirmed Successfully 🎉')
                  : t('خطوة بسيطة وطلبك يوصلك لحد باب بيتك 🚚', 'Checkout — Free Nationwide Express')}
              </h3>
              <p className="text-xs text-slate-300">
                {orderCompleted
                  ? t('مندوب THG 4 Pharma هيتواصل معاك تليفونياً لترتيب وقت التسليم اللي يناسبك', 'THG dispatch will call you shortly to arrange delivery at your convenience')
                  : t('شحن مجاني لكل محافظات مصر • الدفع عند الاستلام بعد ما تفتح وتطمن', 'Free shipping across Egypt • Pay upon inspecting your sealed box')}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {orderCompleted ? (
            /* Order Success View */
            <div className="py-6 text-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={38} />
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t('شكراً لثقتك في عيلة THG 4 Pharma ❤️', 'Thank You for Trusting THG 4 Pharma')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                  {t(
                    'طلبك اتسجل وبنجهزهولك حالياً من مستودعات التبريد الصيدلي بكل عناية. مندوب الشحن هيكلمك قبل ما يوصلك علشان يرتب معاك الميعاد اللي يريحك.',
                    'Your order is safely registered and being prepared with care in our pharmaceutical cold custody. Our courier will call you before arrival.'
                  )}
                </p>
              </div>

              {/* Tracking Code Box */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-300 p-4 rounded-2xl max-w-sm mx-auto space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  {t('رقم تتبع شحنتك الخاص', 'Your Tracking Reference')}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xl sm:text-2xl font-black tracking-wider text-[#C8102E]">
                    {orderCompleted.trackingNumber}
                  </span>
                  <button
                    onClick={() => copyToClipboard(orderCompleted.trackingNumber)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    title={t('نسخ رقم التتبع', 'Copy tracking number')}
                  >
                    <Copy size={16} />
                  </button>
                </div>
                {copiedTracking && (
                  <span className="text-xs text-emerald-600 font-bold block animate-fade-in">
                    {t('تم نسخ الرقم بنجاح!', 'Copied to clipboard!')}
                  </span>
                )}
              </div>

              {/* Delivery Window */}
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-2xl max-w-md mx-auto text-xs text-blue-900 space-y-1">
                <div className="font-bold flex items-center justify-center gap-1.5">
                  <Truck size={16} className="text-blue-700" />
                  <span>{t('الميعاد المتوقع لوصول المندوب:', 'Estimated Delivery Window:')}</span>
                </div>
                <div>{orderCompleted.estimatedDelivery}</div>
                <div className="text-blue-700 font-medium pt-1 border-t border-blue-200/60">
                  {t('المطلوب سداده للمندوب عند الاستلام:', 'Total Due at Delivery:')}{' '}
                  <span className="font-extrabold text-sm">{formatEGP(orderCompleted.total, lang)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    closeModal();
                    openModal('tracking');
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  {t('تتبع شحنتك من هنا', 'Track Delivery Progress')}
                </button>
                <button
                  onClick={closeModal}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  {t('ارجع للمتجر', 'Back to Store')}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form View */
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0 text-[#C8102E]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('بيانات التوصيل (مصر)', 'Delivery Details (Egypt)')}
                </h4>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('الاسم بالكامل (عشان المندوب يعرفك) *', 'Full Name *')}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder={t('مثال: د. أحمد الشناوي', 'e.g., Ahmed El-Shenawy')}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('رقم الموبايل (للتواصل والتنسيق) *', 'Mobile Number (Egypt) *')}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="010XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('المحافظة (شحن مجاني لكل مصر) *', 'Governorate (Free Shipping) *')}
                    </label>
                    <select
                      value={formData.governorate}
                      onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-slate-900 cursor-pointer"
                    >
                      {EGYPT_GOVERNORATES.map((gov) => (
                        <option key={gov.id} value={gov.id}>
                          {lang === 'ar' ? gov.name_ar : gov.name_en} ({t(gov.deliveryDays_ar, gov.deliveryDays_en)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {t('الميعاد المتوقع لوصول الطلب', 'Estimated Delivery')}
                    </label>
                    <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 font-bold flex items-center gap-1.5">
                      <Truck size={14} className="text-[#C8102E]" />
                      <span>{t(selectedGov.deliveryDays_ar, selectedGov.deliveryDays_en)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('العنوان بالتفصيل (المنطقة، الشارع، رقم العمارة والشقة) *', 'Detailed Address (Area, Street, Building & Apt) *')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder={t('مثال: المعادي، شارع النصر، عمارة 14، الدور الثالث شقة 5', 'e.g. Maadi, El-Nasr St, Building 14')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('أي ملاحظة تحب تقولها لمندوب الشحن؟ (اختياري)', 'Notes for courier (Optional)')}
                  </label>
                  <input
                    type="text"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder={t('مثال: رن عليا قبل ما توصل بساعة', 'e.g. Please call 1 hour before arrival')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-[#C8102E] text-slate-900"
                  />
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('طريقة الدفع اللي تريحك عند الاستلام', 'Payment Method')}
                </h4>

                <div className="grid sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#C8102E] bg-red-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="mt-1 text-[#C8102E] focus:ring-[#C8102E]"
                    />
                    <div>
                      <div className="font-black text-xs sm:text-sm text-slate-900">
                        {t('كاش عند الاستلام (COD)', 'Cash on Delivery (COD)')}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {t('افتح علبتك الألمانية واتأكد بنفسك إنها سليمة ومختومة، وبعدها ادفع براحتك', 'Inspect your sealed German pack before paying')}
                      </div>
                    </div>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('card_delivery')}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                      paymentMethod === 'card_delivery'
                        ? 'border-[#C8102E] bg-red-50/50'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'card_delivery'}
                      onChange={() => setPaymentMethod('card_delivery')}
                      className="mt-1 text-[#C8102E] focus:ring-[#C8102E]"
                    />
                    <div>
                      <div className="font-black text-xs sm:text-sm text-slate-900">
                        {t('كارت مع المندوب (POS)', 'Card on Delivery (POS)')}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {t('المندوب معاه ماكينة دفع إلكتروني تقدر تدفع بيها بالفيزا أو ميزة', 'Courier carries a mobile POS terminal for card payments')}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Summary Strip */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>{t('ملخص طلبك', 'Order Summary')}</span>
                  <span>({cart.length} {t('مكملات', 'items')})</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{t('المجموع الفرعي', 'Subtotal')}</span>
                  <span>{formatEGP(subtotal, lang)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#C8102E] font-bold">
                    <span>{t('الخصم المطبق', 'Discount')}</span>
                    <span>-{formatEGP(discount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>{t('مصاريف الشحن والتوصيل', 'Shipping')}</span>
                  <span>{t('مجاني بالكامل (0 ج.م)', 'FREE (0 EGP)')}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm sm:text-base font-black text-slate-900">
                  <span>{t('المبلغ النهائي المطلوب دفعه عند الاستلام', 'Total Due at Delivery')}</span>
                  <span className="text-[#C8102E]">{formatEGP(total, lang)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-black text-sm rounded-2xl shadow-lg shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 active:scale-95"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{t('بنجهز ونأكد طلبك حالا...', 'Confirming Order & Reserving Pack...')}</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>{t(`أكّد طلبي دلوقتي (${formatEGP(total, lang)})`, `Confirm Order Now (${formatEGP(total, lang)})`)}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
