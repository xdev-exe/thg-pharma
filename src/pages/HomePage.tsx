import React from 'react';
import { useApp } from '../context/AppContext';
import { Hero } from '../components/Hero';
import { TrustStrip } from '../components/TrustStrip';
import { CategoryFilter } from '../components/CategoryFilter';
import { ProductCard } from '../components/ProductCard';
import { HeritageSection } from '../components/HeritageSection';
import { StickyBottomBar } from '../components/StickyBottomBar';
import { useSEO } from '../hooks/useSEO';
import { Sparkles, Info, ShieldCheck } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { filteredProducts, t } = useApp();

  // Reset to root SEO metadata
  useSEO({ product: null });

  return (
    <div className="flex-1 space-y-0">
      {/* Hero Section */}
      <Hero />

      {/* 4 Value Pillars of THG Imports */}
      <TrustStrip />

      {/* Product Catalog Section */}
      <section id="products" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-red-50 text-[#C8102E] border border-red-200/80 px-3.5 py-1 rounded-full text-xs font-black">
            <Sparkles size={14} />
            <span>{t('مختارات THG 4 Pharma بعناية', 'Handpicked THG 4 Pharma Selections')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('مكملات بنقف وراها ونضمنها.. لأن صحتك أمانة', 'Formulas We Stand Behind — Your Health is Our Trust')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t(
              'كل علبة هنا وراها تصنيع ألماني صيدلاني دقيق ونسب واضحة بالأرقام. مشحونة في تبريد صيدلي سليم، وبنوصلها لحد باب بيتك في أي مكان بمصر مع الشحن المجاني والمعاينة قبل الدفع.',
              'Every pack here reflects meticulous German pharmaceutical craft with explicitly declared active potencies. Delivered in cold-chain custody across Egypt with free shipping and payment after inspection.'
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
              {t('ملقناش مكملات بالاسم ده', 'No matching supplements found')}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {t(
                'جرب تكتب اسم العنصر زي (أوميجا، كولاجين، حديد) أو اختار من الأقسام اللي فوق.',
                'Try searching for an ingredient like (omega, collagen, iron) or pick from the categories above.'
              )}
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
                {t('حقك تعاين وتطمن بنفسك قبل ما تدفع أي جنيه', 'Inspect Your Pack Before Paying')}
              </span>
              <span className="text-slate-500">
                {t(
                  'المندوب بيستناك تفتح العلبة وتتأكد إنها أصلية وسليمة ومطابقة لطلبك قبل ما تدفع.',
                  'The courier waits while you inspect the sealed authentic box before handing over payment.'
                )}
              </span>
            </div>
          </div>
          <a
            href="https://wa.me/201220722034"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 px-5 py-2.5 bg-[#0A1628] hover:bg-slate-800 text-white font-bold rounded-xl transition-all"
          >
            {t('صيدلي THG معاك على واتساب', 'Chat with THG Pharmacist')}
          </a>
        </div>
      </section>

      {/* THG Corporate & Import Heritage */}
      <HeritageSection />

      {/* Cart Bottom Bar for Home Page */}
      <StickyBottomBar />
    </div>
  );
};
