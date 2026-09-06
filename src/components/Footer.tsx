import React from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, Truck, PhoneCall, MapPin, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, openModal } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0A1628] text-white border-t border-slate-800">
      {/* Upper Footer: Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {t(
                'شركة THG (True Health Goals 4 Pharma) — المستورد المعتمد للمكملات الغذائية الألمانية في مصر. نوفر المنتجات الصيدلانية بأعلى درجات النقاء وسلاسل التخزين المبرد.',
                'THG (True Health Goals 4 Pharma) — Certified importer of German premium wellness supplements in Egypt with direct pharmaceutical custody and cold-chain integrity.'
              )}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-[#D4A843] font-bold">
              <ShieldCheck size={16} />
              <span>{t('مرخص ومطابق لمعايير الجودة الصيدلانية الأوروبية', 'Certified Pharma Importation Standards')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('روابط سريعة', 'Quick Navigation')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#products" className="hover:text-white transition-colors">
                  {t('المكملات الألمانية المتاحة', 'German Supplements')}
                </a>
              </li>
              <li>
                <button
                  onClick={() => openModal('quiz')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t('اختبار اختيار الروتين الصحي', 'Find Your Routine Quiz')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => openModal('tracking')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t('تتبع حالة شحنتك', 'Track Delivery Progress')}
                </button>
              </li>
              <li>
                <a href="#heritage" className="hover:text-white transition-colors">
                  {t('عن شركة THG 4 Pharma', 'About THG Standards')}
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service & Delivery Coverage */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('خدمة العملاء والشحن السريع', 'Client Care & Coverage')}
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-[#C8102E] shrink-0" />
                <span>{t('شحن مجاني لكافة الـ 27 محافظة في جمهورية مصر العربية', 'Free nationwide shipping to all 27 Egyptian governorates')}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall size={16} className="text-[#D4A843] shrink-0" />
                <span>{t('الخط الساخن وواتساب: 01210527717 (مصر)', 'Hotline & WhatsApp: +20 121 052 7717')}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-blue-400 shrink-0" />
                <span>{t('المقر: القاهرة، مصر — مستودعات التبريد الدوائي المعتمدة', 'Cairo, Egypt — Certified Cold-Chain Logistics Hub')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimer (Mandatory for Pharma & Supplements) */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-4 rounded-2xl border">
          <p>
            {t(
              'تنويه قانوني وصيدلاني: المكملات الغذائية المعروضة ليست بديلاً عن نظام غذائي متوازن ومتنوع أو نمط حياة صحي. هذه المنتجات ليست أدوية لعلاج أو تشخيص أو منع الأمراض بشكل منفصل دون استشارة الطبيب المختص. في حال الحمل، الرضاعة، أو تناول أدوية مزمنة، يُنصح دائماً بمراجعة الطبيب المعالج أو الصيدلي.',
              'Regulatory & Medical Notice: The dietary supplements presented are not substitutes for a diverse, balanced diet or a healthy lifestyle. These products are not intended to diagnose, treat, cure, or prevent specific diseases without physician supervision. If pregnant, nursing, or taking prescription drugs, consult your physician or clinical pharmacist.'
            )}
          </p>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} THG 4 Pharma (True Health Goals). {t('جميع الحقوق محفوظة.', 'All Rights Reserved.')}
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-slate-300"
          >
            <span>{t('العودة إلى الأعلى', 'Back to top')}</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
