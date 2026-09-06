import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { formatEGP } from '../lib/utils';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  ShoppingBag,
  RotateCcw,
  Zap,
  Heart,
  Activity,
  Feather
} from 'lucide-react';

export const RoutineQuizModal: React.FC = () => {
  const { activeModal, closeModal, lang, t, addToCart, openProductDetails } = useApp();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    format: '',
    preference: '',
  });

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  if (activeModal !== 'quiz') return null;

  const handleSelectGoal = (goal: string) => {
    setAnswers((prev) => ({ ...prev, goal }));
    setStep(2);
  };

  const handleSelectFormat = (format: string) => {
    setAnswers((prev) => ({ ...prev, format }));
    setStep(3);
  };

  const handleSelectPreference = (preference: string) => {
    setAnswers((prev) => ({ ...prev, preference }));
    setStep(4);
  };

  const resetQuiz = () => {
    setStep(1);
    setAnswers({ goal: '', format: '', preference: '' });
  };

  // Diagnostic recommendation logic
  const getRecommendedProducts = (): Product[] => {
    if (answers.goal === 'hair_beauty') {
      return PRODUCTS.filter((p) => p.id === 'belle-hairnakin' || p.id === 'collagen-1000');
    }
    if (answers.goal === 'energy_anemia') {
      return PRODUCTS.filter((p) => p.id === 'iron-direct' || p.id === 'pure-3');
    }
    if (answers.goal === 'omega_heart') {
      return PRODUCTS.filter((p) => p.id === 'pure-3');
    }
    if (answers.goal === 'maternal') {
      return PRODUCTS.filter((p) => p.id === 'vital-materna-plus' || p.id === 'pure-3');
    }
    return [PRODUCTS[0], PRODUCTS[3]]; // Pure-3 + Iron Direct
  };

  const recommendations = getRecommendedProducts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0A1628] via-[#1B2D4A] to-[#0A1628] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C8102E] rounded-xl text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black leading-tight">
                {t('التشخيص الصيدلاني لاختيار المكمل المناسب — THG 4 Pharma', 'Clinical Supplement Selector — THG 4 Pharma')}
              </h3>
              <p className="text-xs text-slate-300">
                {t('3 خطوات بسيطة لاكتشاف التركيبة الألمانية الأنسب لاحتياجك الفعلي', '3 quick steps to match your biological goals with the right German formula')}
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

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5 shrink-0">
          <div
            className="bg-[#C8102E] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800">
          {/* Step 1: Primary Goal */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs font-bold text-[#C8102E] tracking-wider uppercase">
                  {t('الخطوة 1 من 3', 'Step 1 of 3')}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {t('ما هو هدفك الصحي الأساسي في هذه الفترة؟', 'What is your primary wellness goal right now?')}
                </h4>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => handleSelectGoal('hair_beauty')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 group-hover:scale-110 transition-transform">
                    <Feather size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('كثافة الشعر ونضارة البشرة والأظافر', 'Hair Density, Skin Elasticity & Nails')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('علاج التساقط، تحفيز الكولاجين، والسيليكون', 'Fortifying roots, collagen rebuilding & silicon')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectGoal('energy_anemia')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-red-50 text-[#C8102E] group-hover:scale-110 transition-transform">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('التغلب على الخمول ونقص الحديد والأنيميا', 'Overcoming Fatigue, Anemia & Iron Lack')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('رفع مخزون الحديد بدون إمساك أو مشاكل معدة', 'Restoring ferritin with zero stomach upset')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectGoal('omega_heart')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-blue-50 text-[#00438E] group-hover:scale-110 transition-transform">
                    <Heart size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('التركيز الذهني وصحة القلب والشرايين', 'Brain Clarity, Focus & Cardiovascular')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('أوميجا 3 نقي عالي التركيز بدون طعم سمك', 'Ultra-pure EPA/DHA without fishy burps')}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleSelectGoal('maternal')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-start gap-3 cursor-pointer group"
                >
                  <div className="p-2.5 rounded-xl bg-rose-50 text-rose-700 group-hover:scale-110 transition-transform">
                    <Activity size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('التخطيط للحمل، فترة الحمل، أو الرضاعة', 'Pre-Conception, Pregnancy or Nursing')}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {t('مصفوفة متكاملة من 20 عنصراً تشمل DHA وفوليك', '20-nutrient matrix with DHA & Folic acid')}
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Ingestion Format Preference */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs font-bold text-[#C8102E] tracking-wider uppercase">
                  {t('الخطوة 2 من 3', 'Step 2 of 3')}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {t('ما هي طريقة التناول الأسهل لك يومياً؟', 'Which intake format fits your daily lifestyle?')}
                </h4>
              </div>

              <div className="grid gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={() => handleSelectFormat('melt_tongue')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('حبيبات تذوب على اللسان مباشرة دون ماء (أكياس سريعة)', 'Fast-melting pellets on tongue (no water)')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('طعم توت بري لذيذ أثناء التنقل أو العمل', 'Delicious wild berry on-the-go convenience')}
                    </div>
                  </div>
                  <ArrowIcon size={18} className="text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleSelectFormat('tablets')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('أقراص أو كبسولات جيلاتينية مع وجبة الطعام الرئيسية', 'Tablets or softgels with main daily meal')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('جرعة واحدة مريحة تدوم فعاليتها طوال اليوم', 'Consistent once-daily routine with water')}
                    </div>
                  </div>
                  <ArrowIcon size={18} className="text-slate-400 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Priority Preference */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center max-w-md mx-auto">
                <span className="text-xs font-bold text-[#C8102E] tracking-wider uppercase">
                  {t('الخطوة 3 من 3', 'Step 3 of 3')}
                </span>
                <h4 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
                  {t('ما الذي تبحث عنه أولاً في المكمل الغذائي؟', 'What quality matters most to you?')}
                </h4>
              </div>

              <div className="grid gap-3 max-w-md mx-auto pt-2">
                <button
                  onClick={() => handleSelectPreference('zero_side_effects')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('راحة تامة للمعدة وبدون أي أعراض جانبية أو طعم منفر', 'Total digestive comfort with zero nausea or bad taste')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('نقاء ألماني صيدلاني خالي من الشوائب', 'German pure grade eliminating side effects')}
                    </div>
                  </div>
                  <ArrowIcon size={18} className="text-slate-400 shrink-0" />
                </button>

                <button
                  onClick={() => handleSelectPreference('highest_potency')}
                  className="p-4 rounded-2xl border-2 border-slate-200 hover:border-[#C8102E] hover:bg-red-50/40 transition-all text-right rtl:text-right ltr:text-left flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      {t('أعلى تركيز حيوي ممكن معلن بالأرقام الصريحة', 'Maximum active potency explicitly stated in milligrams')}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t('أرقام حقيقية معلنة على العبوة دون غموض', 'Exact figures on pack rather than vague words')}
                    </div>
                  </div>
                  <ArrowIcon size={18} className="text-slate-400 shrink-0" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Results & Recommended Products */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full mb-2">
                  <Check size={14} />
                  <span>{t('اكتمل التشخيص الصيدلاني بنجاح', 'Diagnostic Complete')}</span>
                </div>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900">
                  {t('روتينك الألماني الموصى به من THG 4 Pharma', 'Your Recommended THG German Protocol')}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  {t(
                    'بناءً على أهدافك الصحية، هذه هي التركيبات الألمانية الأنسب لضمان النتائج المرجوة بنقاء صيدلاني تام.',
                    'Based on your goals, these German formulations provide the targeted nutritional synergy you need.'
                  )}
                </p>
              </div>

              {/* Recommended Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {recommendations.map((product) => (
                  <div
                    key={product.id}
                    className="p-4 rounded-2xl border-2 border-slate-200 bg-slate-50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>🇩🇪 {t('ألماني صيدلاني', 'German Pharma')}</span>
                        <span className="text-[#C8102E]">{formatEGP(product.price, lang)}</span>
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900">
                        {lang === 'ar' ? product.name_ar : product.name_en}
                      </h5>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                        {lang === 'ar' ? product.tagline_ar : product.tagline_en}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => {
                          closeModal();
                          openProductDetails(product);
                        }}
                        className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
                      >
                        {t('التفاصيل', 'Details')}
                      </button>
                      {product.inStock && (
                        <button
                          onClick={() => addToCart(product)}
                          className="flex-1 py-2 bg-[#C8102E] hover:bg-[#9B0D24] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                        >
                          <ShoppingBag size={13} />
                          <span>{t('إضافة للسلة', 'Add')}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset action */}
              <div className="text-center pt-2">
                <button
                  onClick={resetQuiz}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer"
                >
                  <RotateCcw size={14} />
                  <span>{t('إعادة الاختبار من البداية', 'Retake Diagnostic')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
