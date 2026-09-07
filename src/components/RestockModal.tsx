import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockApi } from '../lib/mockApi';
import {
  X,
  BellRing,
  CheckCircle2,
  PhoneCall,
  Loader2,
  ShieldCheck,
  Calendar
} from 'lucide-react';

export const RestockModal: React.FC = () => {
  const { activeModal, closeModal, selectedProduct, lang, t } = useApp();
  const [contact, setContact] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (activeModal !== 'restock' || !selectedProduct) return null;

  const product = selectedProduct;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    setLoading(true);
    try {
      await mockApi.subscribeRestock(product.id, contact.trim());
      setSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0A1628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D4A843] rounded-xl text-[#0A1628]">
              <BellRing size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {t('حجز أولوية الشحنة القادمة', 'Reserve Priority Notification')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('إشعار فوري عبر واتساب عند توفر المنتج بالمستودعات', 'Instant WhatsApp alert once restocked')}
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

        {/* Body */}
        <div className="p-6 space-y-5 text-slate-800">
          {submitted ? (
            <div className="py-6 text-center space-y-4 animate-fade-in">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">
                  {t('تم تسجيل اهتمامك في قائمة الأولوية بنجاح!', 'Priority Waitlist Confirmed!')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xs mx-auto leading-relaxed">
                  {t(
                    `سنقوم بإرسال رسالة مباشرة إلى (${contact}) فور وصول الشحنة الألمانية المبردة لمستودعات THG 4 Pharma في مصر.`,
                    `We will message (${contact}) the instant our German climate-controlled shipment clears customs in Egypt.`
                  )}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 flex items-center justify-center gap-2">
                <Calendar size={15} className="text-[#C8102E]" />
                <span>{t('الموعد المتوقع لوصول الشحنة: خلال أيام معدودة', 'Expected arrival: In a few days')}</span>
              </div>

              <button
                onClick={closeModal}
                className="w-full py-3 bg-[#0A1628] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                {t('تم، حسناً', 'Close')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product mini card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                <div className="w-12 h-14 rounded-xl shrink-0 bg-white p-1 border border-slate-200 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.imageThumb || product.image}
                    alt={lang === 'ar' ? product.name_ar : product.name_en}
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div>
                  <h5 className="font-extrabold text-xs sm:text-sm text-slate-900">
                    {lang === 'ar' ? product.name_ar : product.name_en}
                  </h5>
                  <span className="text-[11px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    {t('الدفعة الحالية نفدت مؤقتاً', 'Current batch sold out')}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {t(
                  'نظراً لطلب الصيدليات والأفراد المتزايد وحرصنا على معايير التبريد الشديدة للشحنات الألمانية، تنفد بعض الأصناف سريعاً. أدخل رقم هاتفك لنحجز لك عبوة من الشحنة القادمة فور تخليصها.',
                  'Due to high demand and uncompromising cold-chain import limits, batches sell out rapidly. Enter your mobile number to reserve priority allocation upon shipment arrival.'
                )}
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('رقم الهاتف المحمول أو واتساب *', 'Mobile / WhatsApp Number *')}
                </label>
                <div className="relative">
                  <PhoneCall size={16} className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto text-slate-400" />
                  <input
                    type="tel"
                    required
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="010XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pr-9 rtl:pr-9 rtl:pl-3 ltr:pl-9 ltr:pr-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 flex items-start gap-2">
                <ShieldCheck size={16} className="text-[#C8102E] shrink-0 mt-0.5" />
                <span>
                  {t(
                    'خصوصيتك محفوظة. لن نستخدم رقمك لأي إعلانات مزعجة، فقط رسالة تأكيد توافر المنتج.',
                    'Zero spam policy. Your contact is exclusively used for restock priority notification.'
                  )}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <span>{t('تأكيد حجز الإشعار المجاني', 'Confirm Priority Alert')}</span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
