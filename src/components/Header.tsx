import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full overflow-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-[#0A1628] text-white text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 font-medium truncate">
            <span className="inline-flex items-center justify-center p-0.5 sm:p-1 bg-[#C8102E] rounded-full text-white text-[10px] shrink-0">
              <Truck size={11} />
            </span>
            <span className="truncate">
              {t(
                'شحن مجاني لكل محافظات مصر الـ 27 • عاين طلبيتك وادفع براحتك عند الاستلام 🇪🇬',
                'Free Express Shipping across all 27 Egyptian Governorates with COD 🇪🇬'
              )}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-slate-300 text-xs shrink-0">
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
              <span>{t('المساعد الذكي (طلب وتتبع): 01210527717', 'WhatsApp AI Agent: +20 121 052 7717')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="glass border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#C8102E] rounded-lg shrink-0"
          >
            <Logo size="md" />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-semibold text-slate-700">
            <button
              onClick={() => scrollToSection('products')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E] cursor-pointer"
            >
              {t('مكملاتنا الألمانية', 'German Supplements')}
            </button>
            <button
              onClick={() => openModal('quiz')}
              className="flex items-center gap-1.5 text-[#C8102E] bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all border border-red-200/60 shadow-xs hover:scale-105 cursor-pointer"
            >
              <Sparkles size={14} className="animate-pulse" />
              <span>{t('محتار؟ نساعدك تختار', 'Supplement Diagnostic')}</span>
            </button>
            <button
              onClick={() => scrollToSection('heritage')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E] cursor-pointer"
            >
              {t('حكايتنا في THG', 'About THG Standards')}
            </button>
            <button
              onClick={() => openModal('tracking')}
              className="hover:text-[#C8102E] transition-colors py-2 border-b-2 border-transparent hover:border-[#C8102E] cursor-pointer"
            >
              {t('شحنتك فين؟ تتبع طلبك', 'Track Order')}
            </button>
          </nav>

          {/* Action Buttons: Search, Language, Cart, Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Search Input (Desktop) */}
            <div className="relative hidden sm:block">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-sm w-48 sm:w-60 animate-scale-in">
                  <Search size={15} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('ابحث عن مكمل...', 'Search supplement...')}
                    className="w-full bg-transparent border-none text-xs px-2 focus:outline-none text-slate-800"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchOpen(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                  >
                    <X size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-slate-600 hover:text-[#0A1628] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                  title={t('بحث', 'Search')}
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="sm:hidden p-2 text-slate-600 hover:text-[#0A1628] hover:bg-slate-100 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Search"
            >
              <Search size={17} />
            </button>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors border border-slate-200 cursor-pointer shrink-0"
              title={t('Switch to English', 'تغيير اللغة للعربية')}
            >
              <Globe size={13} className="text-[#C8102E] shrink-0" />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={() => openModal('cart')}
              className="relative flex items-center gap-1.5 bg-[#C8102E] hover:bg-[#9B0D24] text-white p-2 sm:px-3.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={17} />
              <span className="hidden md:inline">{t('السلة', 'Bag')}</span>
              {cartCount > 0 && (
                <span className="bg-white text-[#C8102E] font-black text-[10px] sm:text-xs h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Overlay when expanded on small screen */}
        {isSearchOpen && (
          <div className="sm:hidden px-3 py-2 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 animate-slide-down">
            <div className="flex-1 flex items-center bg-white border border-slate-300 rounded-full px-3 py-1.5 shadow-xs">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('ابحث عن مكمل ألماني...', 'Search German supplement...')}
                className="w-full bg-transparent border-none text-xs px-2 focus:outline-none text-slate-800"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X size={13} />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="text-xs font-bold text-slate-600 px-2 py-1"
            >
              {t('إلغاء', 'Cancel')}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden glass border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-slide-down">
          <button
            onClick={() => scrollToSection('products')}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-xl text-slate-800 font-semibold hover:bg-red-50 hover:text-[#C8102E] flex items-center justify-between"
          >
            <span>{t('المكملات الألمانية', 'German Supplements')}</span>
            <span className="text-xs text-slate-400">6 {t('منتجات', 'Products')}</span>
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('quiz');
            }}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-xl text-[#C8102E] bg-red-50 font-bold flex items-center gap-2"
          >
            <Sparkles size={16} />
            <span>{t('اختبار اختيار المكمل المناسب', 'Supplement Diagnostic')}</span>
          </button>
          <button
            onClick={() => scrollToSection('heritage')}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-xl text-slate-800 font-semibold hover:bg-slate-50"
          >
            {t('عن شركة THG 4 Pharma', 'About THG 4 Pharma')}
          </button>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              openModal('tracking');
            }}
            className="w-full text-right rtl:text-right ltr:text-left py-2.5 px-3 rounded-xl text-slate-800 font-semibold hover:bg-slate-50 flex items-center gap-2"
          >
            <Truck size={16} className="text-[#0A1628]" />
            <span>{t('تتبع طلبك', 'Track Your Order')}</span>
          </button>
        </div>
      )}
    </header>
  );
};
