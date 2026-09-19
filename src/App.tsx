import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { RoutineQuizModal } from './components/RoutineQuizModal';
import { RestockModal } from './components/RestockModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  const { toasts } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] w-full max-w-full overflow-x-hidden relative">
      <ScrollToTop />

      {/* Sticky Global Navigation */}
      <Header />

      {/* Main Content Flow Handled By Router */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:slugOrId" element={<ProductPage />} />
          <Route path="/products/:slugOrId" element={<ProductPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Concierge */}
      <WhatsAppButton />

      {/* Global Interactive Modals */}
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
