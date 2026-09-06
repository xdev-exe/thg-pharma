import React from 'react';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustStrip } from './components/TrustStrip';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RoutineQuizModal } from './components/RoutineQuizModal';
import { RestockModal } from './components/RestockModal';
import { HeritageSection } from './components/HeritageSection';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { Sparkles, CheckCircle, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export const App: React.FC = () => {
  const { filteredProducts, t, toasts } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Sticky Global Navigation */}
      <Header />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* 4 Value Pillars of THG Imports */}
        <TrustStrip />

        {/* Product Catalog Section */}
        <section id="products" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#C8102E] border border-red-200/80 px-3.5 py-1 rounded-full text-xs font-black">
              <Sparkles size={14} />
              <span>{t('التشكيلة الصيدلانية المعتمدة في مصر', 'Certified German Formulations in Egypt')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('مكملات ألمانية بتركيزات صريحة ومعلنة', 'German Supplements with Declared Potencies')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {t(
                'اختر مكمّلك من تشكيلة THG 4 Pharma الأصلية. جميع المنتجات مشحونة ومخزنة تحت درجات حرارة صيدلانية مبردة لحماية جودة وفاعلية العناصر الغذائية.',
                'Select from THG 4 Pharma certified imports. Every pack is cold-chain freighted and warehoused below 25°C to preserve bio-potency.'
              )}
            </p>
          </div>

          {/* Interactive Category Selector & Search */}
          <CategoryFilter />

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Info size={30} />
              </div>
              <h3 className="font-bold text-slate-800 text-base">
                {t('لم نجد مكملات تطابق بحثك', 'No matching supplements found')}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {t('جرب البحث بكلمات أخرى أو اختر فئة مختلفة من القائمة أعلاه.', 'Try searching with different terms or select another category.')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Quality Reassurance Strip */}
          <div className="p-6 bg-gradient-to-r from-red-50/70 via-slate-50 to-blue-50/70 rounded-3xl border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="p-2 bg-[#C8102E] text-white rounded-xl shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <span className="font-bold text-slate-900 block text-sm">
                  {t('ضمان الاستيراد والمعاينة قبل الدفع', 'Genuine Importation & Inspection Guarantee')}
                </span>
                <span className="text-slate-500">
                  {t(
                    'يحق لك فتح الشحنة ومطابقة العبوة قبل دفع أي مبلغ لمندوب التوصيل.',
                    'You are fully entitled to inspect the sealed pack prior to handing payment to the courier.'
                  )}
                </span>
              </div>
            </div>
            <a
              href="https://wa.me/201210527717"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 bg-[#0A1628] hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
            >
              {t('تواصل مع صيدلي THG', 'Consult Pharmacist')}
            </a>
          </div>
        </section>

        {/* THG Corporate & Import Heritage */}
        <HeritageSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppButton />

      {/* Interactive Modals */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <RoutineQuizModal />
      <RestockModal />

      {/* Floating Notification Toasts */}
      <div className="fixed bottom-6 left-6 rtl:left-6 rtl:right-auto z-50 flex flex-col gap-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 pointer-events-auto animate-slide-up ${
              toast.type === 'success'
                ? 'bg-[#0A1628] text-white border-slate-700'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-700'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {toast.type === 'success' && <CheckCircle size={16} className="text-emerald-400 shrink-0" />}
            {toast.type === 'error' && <AlertCircle size={16} className="text-red-400 shrink-0" />}
            {toast.type === 'info' && <Info size={16} className="text-blue-400 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
