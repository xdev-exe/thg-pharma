import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCategory } from '../types';
import { Sparkles, Heart, Activity, Zap, Layers } from 'lucide-react';

export const CategoryFilter: React.FC = () => {
  const { selectedCategory, setSelectedCategory, t, filteredProducts, searchQuery, setSearchQuery } = useApp();

  const categories: Array<{ id: ProductCategory; label_ar: string; label_en: string; icon: React.ElementType }> = [
    { id: 'all', label_ar: 'كافة المكملات', label_en: 'All Supplements', icon: Layers },
    { id: 'omega3', label_ar: 'أوميجا 3 نقي', label_en: 'Pure Omega-3', icon: Heart },
    { id: 'beauty', label_ar: 'الكولاجين والبشرة والسيليكون', label_en: 'Collagen & Beauty Matrix', icon: Sparkles },
    { id: 'vitamins', label_ar: 'الحديد والمعادن الحيوية', label_en: 'Iron & Vital Minerals', icon: Zap },
    { id: 'women', label_ar: 'تغذية وصحة الأم', label_en: "Maternal Health", icon: Activity },
  ];

  return (
    <div className="space-y-6">
      {/* Category Pills Header */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#0A1628] text-white shadow-md shadow-slate-900/20 ring-2 ring-[#C8102E]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              <Icon size={16} className={isSelected ? 'text-[#D4A843]' : 'text-slate-400'} />
              <span>{t(cat.label_ar, cat.label_en)}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Stats & Search Feedback */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-200 pb-3">
        <div>
          {t('عرض', 'Showing')}{' '}
          <span className="font-bold text-slate-900">{filteredProducts.length}</span>{' '}
          {t('مكملات ألمانية معتمدة', 'certified German supplements')}
          {searchQuery && (
            <span className="ml-2 rtl:mr-2 text-[#C8102E] font-medium">
              (نتائج البحث عن: "{searchQuery}")
            </span>
          )}
        </div>

        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-[#C8102E] hover:underline font-semibold cursor-pointer"
          >
            {t('مسح البحث', 'Clear search')}
          </button>
        )}
      </div>
    </div>
  );
};
