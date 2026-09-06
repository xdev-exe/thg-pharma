import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Sparkles, ArrowRight, ArrowLeft, Award, CheckCircle2, FlaskConical } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, lang, openModal } = useApp();
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden bg-[#0A1628] text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8102E]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-start rtl:lg:text-right ltr:lg:text-left">
            {/* Regulatory Certification Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-ping" />
              <ShieldCheck size={14} className="text-[#D4A843]" />
              <span>{t('المستورد الرسمي المعتمد في مصر — THG 4 Pharma', 'Official Certified Importer in Egypt — THG 4 Pharma')}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              {t('الصحة الحقيقية تبدأ بـ', 'True Health Demands')}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-[#D4A843]">
                {t('النقاء الألماني الصيدلاني', 'Pure German Precision')}
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t(
                'نحن في THG (True Health Goals) نلغي الغموض من سوق المكملات في مصر: نوفر لك التركيبات الألمانية الأصلية ذات التركيزات المعلنة بالأرقام الصريحة، مع ضمان سلاسل التبريد والتخزين الصيدلاني حتى باب منزلك.',
                'At THG (True Health Goals), we remove ambiguity from the Egyptian supplement market: bringing you certified German formulations with fully declared active potencies, preserved under strict climate-controlled pharmaceutical custody.'
              )}
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={scrollToProducts}
                className="w-full sm:w-auto bg-[#C8102E] hover:bg-[#9B0D24] text-white font-bold text-base px-8 py-4 rounded-full shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all flex items-center justify-center gap-3 active:scale-95 group"
              >
                <span>{t('تسوق المكملات المتاحة الآن', 'Shop In-Stock Formulas')}</span>
                <ArrowIcon size={18} className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </button>

              <button
                onClick={() => openModal('quiz')}
                className="w-full sm:w-auto bg-slate-800/90 hover:bg-slate-750 text-slate-100 hover:text-white border border-slate-700 font-semibold text-base px-6 py-4 rounded-full transition-all flex items-center justify-center gap-2 hover:border-[#D4A843] active:scale-95"
              >
                <Sparkles size={18} className="text-[#D4A843]" />
                <span>{t('اختبار اختيار المكمل المناسب', 'Find Your Routine Quiz')}</span>
              </button>
            </div>

            {/* Micro Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-center">
              <div>
                <div className="text-2xl lg:text-3xl font-black text-white">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">{t('صيدلاني ألماني أصلي', 'Authentic German GMP')}</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-black text-[#D4A843]">0 ج.م</div>
                <div className="text-xs text-slate-400 mt-0.5">{t('شحن مجاني لكل مصر', 'Free Nationwide Delivery')}</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-black text-white">27</div>
                <div className="text-xs text-slate-400 mt-0.5">{t('محافظة مغطاة بالدفع عند الاستلام', 'Governorates with COD')}</div>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl backdrop-blur-xl">
              {/* Highlight ribbon */}
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#C8102E] to-rose-600 text-white text-xs font-black px-4 py-1 rounded-full shadow-md">
                {t('معيار النقاء الأوروبي', 'European Purity Standard')}
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-red-950/60 text-[#E8354D] rounded-2xl border border-red-800/50">
                    <FlaskConical size={26} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">{t('فحص الشحنات المخبرية', 'Batch Lab Verification')}</div>
                    <div className="text-base font-bold text-white">{t('شهادة استيراد رسمية لكل تشغيلة', 'Certified Lot Import Release')}</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {t(
                    'نحن لا نبيع مكملات مجهولة المصدر أو مخزنة بطرق عشوائية. كل علبة تأتي مشحونة في حاويات مبردة لضمان سلامة الفيتامينات والزيوت الحساسة من حرارة الجو.',
                    'We strictly avoid unverified parallel channels. Every pack is freighted in temperature-controlled chambers preserving delicate bio-actives from Egyptian climate exposure.'
                  )}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{t('تركيزات معلنة بالمليجرام الدقيق — لا غموض', 'Precise milligram declarations on every pack')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{t('معاينة العبوة ومطابقتها قبل الدفع عند الاستلام', 'Inspect pack upon arrival before cash payment')}</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>{t('خدمة عملاء صيدلانية متخصصة عبر واتساب', 'Specialist pharmacist support on WhatsApp')}</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    onClick={scrollToProducts}
                    className="w-full py-3 bg-white hover:bg-slate-100 text-[#0A1628] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Award size={16} className="text-[#C8102E]" />
                    <span>{t('تصفح الـ 6 مكملات المعتمدة', 'Browse All 6 Verified Formulas')}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
