import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
  compactOnMobile?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'color',
  compactOnMobile = true,
}) => {
  const heightClasses = {
    sm: 'h-8 sm:h-10',
    md: 'h-9 sm:h-12 md:h-14',
    lg: 'h-12 sm:h-16 md:h-20',
  }[size];

  return (
    <div className={`flex items-center gap-2 sm:gap-3 select-none shrink-0 ${className}`}>
      {/* Real THG 4 Pharma logo from official brand asset */}
      <div
        className={`relative inline-flex items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 shrink-0 ${
          variant === 'light'
            ? 'bg-white/95 p-1 shadow-sm ring-1 ring-white/30'
            : 'p-0.5'
        }`}
      >
        <img
          src="/thg-logo.png"
          alt="THG 4 Pharma"
          className={`${heightClasses} w-auto object-contain shrink-0`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand Typography */}
      <div className={`flex flex-col justify-center leading-none ${compactOnMobile ? 'hidden xs:flex sm:flex' : 'flex'}`}>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span
            className={`font-black tracking-tight text-[11px] sm:text-xs uppercase whitespace-nowrap ${
              variant === 'light' ? 'text-white' : 'text-[#0A1628]'
            }`}
          >
            THG 4 PHARMA
          </span>
          <span className="text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded bg-[#C8102E] text-white font-extrabold tracking-wide uppercase shrink-0">
            EG
          </span>
        </div>
        <span
          className={`hidden sm:inline-block text-[9px] sm:text-[10px] font-medium tracking-normal mt-0.5 whitespace-nowrap ${
            variant === 'light' ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          True Health Goals • مستورد رسمي
        </span>
      </div>
    </div>
  );
};
