import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Logo } from './Logo';
import {
  ShoppingBag,
  Search,
  Truck,
  Sparkles,
  ShieldCheck,
  Menu,
  X,
  Globe,
  PhoneCall
} from 'lucide-react';

export const Header: React.FC = () => {
  const { lang, toggleLang, t, cartCount, openModal, searchQuery, setSearchQuery } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Top Announcement Bar */}
      <div className="bg-[#0A1628] text-white text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <span className="inline-flex items-center justify-center p-1 bg-[#C8102E] rounded-full text-white text-[10px]">
              <Truck size={12} />
            </span>
            <span>
              {t(
                'شحن مجاني لكافة محافظات مصر الـ 27 مع الدفع عند الاستلام 🇪🇬',
                'Free Express Shipping across all 27 Egyptian Governorates with COD 🇪🇬'
              )}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4 text-slate-300 text-xs">
            <div className="flex items-center gap-1">
              <ShieldCheck size={13} className="text-[#D4A843]" />
              <span>{t('مستورد صيدلاني معتمد', 'Certified Pharma Importer')}</span>
            </div>
            <span>•</span>
            <a
              href="https://wa.me/201210527717"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <PhoneCall size={12} className="text-emerald-400" />
              <span>01210527717</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#C8102E] rounded-lg p-1"
          >
            <Logo size="md" />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('products')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E]"
            >
              {t('تشكيلة المكملات الألمانية', 'German Supplements')}
            </button>
            <button
              onClick={() => openModal('quiz')}
              className="flex items-center gap-1.5 text-[#C8102E] bg-red-50 hover:bg-red-100 px-3.5 py-1.5 rounded-full transition-all border border-red-200/60 shadow-xs hover:scale-105"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>{t('اختبر روتينك الصحي', 'Routine Diagnostic')}</span>
            </button>
            <button
              onClick={() => scrollToSection('heritage')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E]"
            >
              {t('عن THG والمعايير', 'About THG Standards')}
            </button>
            <button
              onClick={() => openModal('tracking')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E]"
            >
              {t('تتبع طلبك', 'Track Order')}
            </button>
          </nav>

          {/* Action Buttons: Search, Language, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Toggle / Input */}
            <div className="relative">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-sm w-44 sm:w-64 animate-scale-in">
                  <Search size={16} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('ابحث عن مكمل...', 'Search supplement...')}
                    className="w-full bg-transparent border-none text-xs sm:text-sm px-2 focus:outline-none text-slate-800"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 text-slate-600 hover:text-[#0A1628] hover:bg-slate-100 rounded-full transition-colors"
                  title={t('بحث', 'Search')}
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200"
              title={t('تغيير اللغة إلى الإنجليزية', 'Switch to Arabic')}
            >
              <Globe size={14} className="text-[#C8102E]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => openModal('cart')}
              className="relative flex items-center gap-2 bg-[#C8102E] hover:bg-[#9B0D24] text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag size={18} />
              <span className="hidden sm:inline">{t('السلة', 'Bag')}</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#C8102E] font-black text-xs h-5 min-w-[20px] px-1.5 rounded-full flex items-center justify-center shadow-xs animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-slide-down">
          <button
            onClick={() => scrollToSection('products')}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg text-slate-800 font-semibold hover:bg-red-50 hover:text-[#C8102E] flex items-center justify-between"
          >
            <span>{t('المكملات الألمانية', 'German Supplements')}</span>
            <span className="text-xs text-slate-400">6 {t('منتجات', 'Products')}</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('quiz');
            }}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg text-[#C8102E] bg-red-50 font-bold flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{t('اختبر روتينك الصحي (تشخيص مجاني)', 'Routine Diagnostic (Free)')}</span>
          </button>
          <button
            onClick={() => scrollToSection('heritage')}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg text-slate-800 font-semibold hover:bg-slate-50"
          >
            {t('عن شركة THG 4 Pharma', 'About THG 4 Pharma')}
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('tracking');
            }}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-lg text-slate-800 font-semibold hover:bg-slate-50 flex items-center gap-2"
          >
            <Truck size={16} className="text-[#0A1628]" />
            <span>{t('تتبع طلبك', 'Track Your Order')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
