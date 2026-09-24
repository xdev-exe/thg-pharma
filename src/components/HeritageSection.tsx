import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Snowflake, CheckCircle2, FlaskConical } from 'lucide-react';

export const HeritageSection: React.FC = () => {
  const { t } = useApp();

  return (
    <section id="heritage" className="py-16 sm:py-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Story & Philosophy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-red-50 text-[#C8102E] border border-red-200/80 px-3.5 py-1 rounded-full text-xs font-black">
              <span>THG 4 PHARMA • TRUE HEALTH GOALS</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {t('إحنا مين؟ حكايتنا في', 'Who We Are: Our Story at')}{' '}
              <span className="text-[#C8102E]">
                {t('THG 4 Pharma في مصر', 'THG 4 Pharma Egypt')}
              </span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {t(
                'إحنا صيادلة قبل ما نكون شركة. بدأنا THG علشان نغير فكرة شراء المكملات في مصر: زهقنا من العلب المجهولة، والمنتجات اللي بتتسرب في ظروف تخزين غلط في حرارة الصيف وتبوظ مفعولها. قررنا نكون إحنا المستورد المعتمد اللي يجيبلك أنضف مكملات أصلية من ألمانيا لحد باب بيتك في مصر بحفظ وتبريد صيدلي سليم، وبأرقام واضحة على العلبة من غير أي فذلكة أو مبالغة.',
                'We are clinical pharmacists first. We built THG to transform how families in Egypt source nutritional supplements: eliminating mystery imports and poorly stored parallel goods that degrade in summer heat. We act as your certified bridge to authentic German formulations with strict cold-chain preservation and fully transparent dosing.'
              )}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="p-2 bg-[#C8102E] text-white rounded-xl shrink-0 mt-0.5">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {t('استيراد رسمي وتشغيلات موثقة بالكامل', 'Direct Licensed Batch Releases')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t(
                      'بنستورد مباشرة بتراخيص رسمية وتشغيلات أوروبية مسجلة، وكل علبة بتوصلك مضمونة ومختومة من المصنع.',
                      'Direct importation from certified German manufacturing sites with fully verifiable batch audit trails.'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="p-2 bg-[#0A1628] text-white rounded-xl shrink-0 mt-0.5">
                  <Snowflake size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {t('تبريد وحفظ صيدلي يحافظ على كل كبسولة', 'Pharmaceutical Cold-Chain Custody')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t(
                      'الزيوت الحيوية زي الأوميجا 3 والفيتامينات بتفسد بسرعة لو اتعرضت للشمس والحرارة. شحناتنا ومخازننا مكيفة دايماً تحت 25° م.',
                      'Bio-active oils (Omega-3) and sensitive vitamins degrade under heat. Our custody is strictly maintained below 25°C.'
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <div className="p-2 bg-[#D4A843] text-[#0A1628] rounded-xl shrink-0 mt-0.5">
                  <FlaskConical size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    {t('الوضوح التام في المكونات بالأرقام', 'Radical Ingredient Transparency')}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {t(
                      'مبنكتبش كلام عام، بنكتبلك بالمليجرام الصريح كام EPA وكام DHA وكام كولاجين وسيبيتك تقارن بنفسك وتختار الأفضل.',
                      'Every product explicitly discloses milligrams of active ingredients — because health is measured in numbers, not adjectives.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Infographic Card */}
          <div className="lg:col-span-6">
            <div className="relative bg-gradient-to-br from-[#0A1628] to-[#1B2D4A] rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-slate-800">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="text-xs font-bold text-[#D4A843] uppercase tracking-wider">
                    {t('وعدنا ليك في THG 4 Pharma مصر', 'Our Promise to You at THG 4 Pharma')}
                  </div>
                  <span className="text-xs text-slate-400">🇪🇬 / 🇩🇪</span>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">
                      {t('كل علبة مطابقة لأعلى معايير الجودة الصيدلانية الألمانية والأوروبية', '100% compliant with European Good Manufacturing Practices')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">
                      {t('معاينة العبوة ومطابقتها بنفسك قبل ما تدفع أي جنيه للمندوب', 'Full client parcel inspection permitted prior to payment')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">
                      {t('ضمان الاستبدال أو الاسترجاع الفوري لو العبوة فيها أي ملاحظة', 'Instant replacement guarantee for any transit damages')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200">
                      {t('صيدلي متخصص معاك خطوة بخطوة عشان يطمنك ويشرحلك الجرعة', 'Clinical pharmacists on standby for dosage and drug interaction checks')}
                    </span>
                  </div>
                </div>

                {/* Direct contact box */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <div className="text-slate-400 text-[11px]">{t('المستودعات والمقر الرئيسي', 'Headquarters & Logistics')}</div>
                    <div className="font-bold text-white mt-0.5">{t('القاهرة، مصر • مستودعات التبريد الدوائي', 'Cairo, Egypt • Cold-Chain Logistics Hub')}</div>
                  </div>
                  <a
                    href="https://wa.me/201210527717"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#C8102E] hover:bg-[#9B0D24] text-white font-bold rounded-xl transition-colors"
                  >
                    {t('المساعد الذكي واتساب', 'WhatsApp AI Agent')}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
