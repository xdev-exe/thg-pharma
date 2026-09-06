import React from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { lang, t } = useApp();

  const defaultMessage =
    lang === 'ar'
      ? 'مرحباً THG 4 Pharma، أود الاستفسار عن تشكيلة المكملات الألمانية وتفاصيل التوصيل.'
      : 'Hello THG 4 Pharma, I would like to inquire about the German supplements and delivery options.';

  const whatsappUrl = `https://wa.me/201210527717?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-40 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group"
      aria-label="Contact THG Pharma Pharmacist on WhatsApp"
    >
      <div className="relative">
        <MessageCircle size={22} className="fill-white" />
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#D4A843] rounded-full ring-2 ring-emerald-600 animate-pulse" />
      </div>
      <span className="text-xs sm:text-sm font-black hidden sm:inline">
        {t('استشر صيدلي THG عبر واتساب', 'Ask a THG Pharmacist')}
      </span>
    </a>
  );
};
