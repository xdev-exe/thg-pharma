import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Snowflake, Truck, Headphones } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const { t } = useApp();

  const pillars = [
    {
      icon: ShieldCheck,
      color: 'text-[#C8102E]',
      bg: 'bg-red-50',
      border: 'border-red-100',
      title_ar: 'استيراد رسمي 100% يريّح بالك',
      title_en: '100% Certified German Import',
      desc_ar: 'مش بنجيب أي حاجة وخلاص؛ بنستورد مباشرة بتراخيص رسمية وتشغيلات أوروبية متسجلة.',
      desc_en: 'Direct exclusive import with full European pharmaceutical verification.',
    },
    {
      icon: Snowflake,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-100',
      title_ar: 'تبريد وحفظ صيدلي يحمي الجودة',
      title_en: 'Cold-Chain Pharma Custody',
      desc_ar: 'المكملات حساسة لحرارة الجو، عشان كده مخازننا وشحناتنا مكيفة تحت 25° م عشان تستفيد بكل مليجرام.',
      desc_en: 'Climate-controlled below 25°C protecting delicate bio-actives from heat.',
    },
    {
      icon: Truck,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      title_ar: 'شحن مجاني ومعاينة قبل ما تدفع',
      title_en: 'Free Shipping & Inspection First',
      desc_ar: 'طلبك يوصلك لباب بيتك في أي مكان بمصر، افتح علبتك وطابقها وبعدين ادفع براحتك للمندوب.',
      desc_en: 'Zero shipping fees to all 27 governorates. Open and inspect your box before paying.',
    },
    {
      icon: Headphones,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      title_ar: 'فريق صيادلة جنبك في أي وقت',
      title_en: 'Pharmacist Advisory Care',
      desc_ar: 'متحتارش.. ابعتلنا على واتساب وهيرد عليك صيدلي متخصص يشرحلك الجرعة والأنسب ليك ولعيلتك.',
      desc_en: 'Dedicated clinical team available via WhatsApp for dosage and routine guidance.',
    },
  ];

  return (
    <section className="bg-white border-b border-slate-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/70 border border-slate-150 hover:bg-white hover:shadow-md transition-all duration-300"
              >
                <div className={`p-3 rounded-xl ${pillar.bg} ${pillar.color} ${pillar.border} border shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {t(pillar.title_ar, pillar.title_en)}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {t(pillar.desc_ar, pillar.desc_en)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
