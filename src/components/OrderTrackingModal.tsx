import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { mockApi, SavedOrder } from '../lib/mockApi';
import { formatEGP } from '../lib/utils';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  PhoneCall,
  Loader2,
  PackageCheck,
  AlertCircle
} from 'lucide-react';

export const OrderTrackingModal: React.FC = () => {
  const { activeModal, closeModal, lang, t } = useApp();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [error, setError] = useState('');

  if (activeModal !== 'tracking') return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const res = await mockApi.getOrder(query);
      if (res) {
        setOrder(res);
      } else {
        setError(
          t(
            'لم يتم العثور على طلب بهذا الرقم أو الهاتف. يرجى التأكد من الرقم والمحاولة مجدداً.',
            'No order found with this tracking code or phone number. Please check and retry.'
          )
        );
      }
    } catch {
      setError(t('حدث خطأ أثناء الاستعلام، يرجى المحاولة مجدداً', 'Lookup error, please try again'));
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      id: 'confirmed',
      title_ar: 'طلبك اتأكد وبقى في أيدي أمينة',
      title_en: 'Order Confirmed',
      desc_ar: 'راجعنا بياناتك وحجزنالك العلبة الأصلية من المخزن',
      desc_en: 'Details verified and registered in system',
      done: true,
    },
    {
      id: 'packed',
      title_ar: 'التجهيز والتغليف المبرد',
      title_en: 'Cold-Chain Pharma Prep',
      desc_ar: 'بنجهز طلبك من مستودع التبريد الصيدلي تحت 25° م',
      desc_en: 'Packaged from climate-controlled warehouse',
      done: true,
    },
    {
      id: 'transit',
      title_ar: 'في السكة مع مندوب الشحن',
      title_en: 'In Transit with Courier',
      desc_ar: 'الشحنة حالياً مع شركة الشحن السريع في طريقها لمحافظتك',
      desc_en: 'Handed over to express courier in your area',
      done: order ? order.status !== 'confirmed' : false,
    },
    {
      id: 'delivered',
      title_ar: 'وصلت.. افتح وعاين وادفع براحتك',
      title_en: 'Delivered & Inspected',
      desc_ar: 'المندوب هيستناك تفحص علبتك وتتأكد منها وتسدد قيمتها',
      desc_en: 'Final handover and payment upon pack inspection',
      done: order ? order.status === 'delivered' : false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#0A1628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C8102E] rounded-xl text-white">
              <Truck size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {t('شحنتك فين دلوقتي؟ تتبع طلبك في ثواني', 'Track THG 4 Pharma Delivery')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('اكتب رقم تتبع شحنتك (زي THG-EG-XXXXXX) أو رقم الموبايل اللي سجلت بيه', 'Enter tracking code or your mobile number')}
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
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={18} className="absolute top-3.5 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('اكتب رقم التتبع أو رقم موبايلك هنا...', 'Enter tracking code or mobile number...')}
                  className="w-full bg-slate-50 border border-slate-300 rounded-2xl pr-10 rtl:pr-10 rtl:pl-3 ltr:pl-10 ltr:pr-3 py-3 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#C8102E]"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-bold text-xs sm:text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <span>{t('تتبع الشحنة', 'Track')}</span>}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-center gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 text-[#C8102E]" />
              <span>{error}</span>
            </div>
          )}

          {/* Result View */}
          {order && (
            <div className="space-y-6 animate-fade-in">
              {/* Status Header */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    {t('رقم الشحنة', 'Tracking Code')}
                  </span>
                  <div className="text-base sm:text-lg font-black text-[#0A1628]">
                    {order.trackingNumber}
                  </div>
                </div>
                <div className="text-right rtl:text-left">
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
                    <CheckCircle2 size={13} />
                    <span>{t('الشحنة في طريقها إليك', 'Express In Transit')}</span>
                  </span>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div className="space-y-4">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {t('خطوات توصيل شحنتك المبردة', 'Transit Milestones')}
                </h4>

                <div className="relative border-r-2 rtl:border-r-2 rtl:border-l-0 ltr:border-l-2 ltr:border-r-0 border-slate-200 space-y-6 mr-3 rtl:mr-3 rtl:ml-0 ltr:ml-3 ltr:mr-0 pr-6 rtl:pr-6 rtl:pl-0 ltr:pl-6 ltr:pr-0">
                  {steps.map((step, idx) => (
                    <div key={idx} className="relative">
                      {/* Step Circle Indicator */}
                      <div
                        className={`absolute -right-[31px] rtl:-right-[31px] rtl:left-auto ltr:-left-[31px] ltr:right-auto top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ${
                          step.done ? 'bg-[#C8102E]' : 'bg-slate-300'
                        }`}
                      >
                        {step.done ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      </div>

                      <div className="space-y-0.5">
                        <div className="text-xs sm:text-sm font-bold text-slate-900">
                          {t(step.title_ar, step.title_en)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {t(step.desc_ar, step.desc_en)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Details Details Box */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{t('المستلم:', 'Recipient:')}</span>
                  <span className="font-bold text-slate-900">{order.customerName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{t('المحافظة:', 'Governorate:')}</span>
                  <span className="font-bold text-slate-900">{order.governorate}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">{t('الميعاد المتوقع لوصول المندوب:', 'Estimated Window:')}</span>
                  <span className="font-bold text-emerald-700">{order.estimatedDelivery}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-slate-500">{t('المبلغ المطلوب عند الاستلام:', 'Total COD Due:')}</span>
                  <span className="font-black text-sm text-[#C8102E]">{formatEGP(order.total, lang)}</span>
                </div>
              </div>

              {/* Customer Service Support CTA */}
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-blue-900">
                  <PhoneCall size={16} className="text-[#C8102E]" />
                  <span>{t('محتاج تغير الميعاد أو تعدل العنوان؟', 'Need to change delivery time or address?')}</span>
                </div>
                <a
                  href={`https://wa.me/201210527717?text=${encodeURIComponent(`أهلاً THG 4 Pharma، حابب أستفسر بخصوص شحنتي رقم ${order.trackingNumber}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#0A1628] text-white font-bold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  {t('كلمنا واتساب', 'Chat on WhatsApp')}
                </a>
              </div>
            </div>
          )}

          {/* Initial Helper View when no order searched yet */}
          {!order && !loading && !error && (
            <div className="py-6 text-center space-y-3 text-slate-500">
              <PackageCheck size={36} className="mx-auto text-slate-300" />
              <p className="text-xs leading-relaxed max-w-sm mx-auto">
                {t(
                  'أول ما شحنتك بتتحرك من مستودعات التبريد الصيدلي لـ THG في القاهرة، بيانات التتبع بتتحدث تلقائياً والمندوب بيتواصل معاك يرتب ميعاد وصوله.',
                  'Live tracking updates immediately once dispatched from THG temperature-controlled hub.'
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
