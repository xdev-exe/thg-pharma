import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark' | 'color';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'color',
}) => {
  const heightClasses = {
    sm: 'h-10',
    md: 'h-12 sm:h-14',
    lg: 'h-16 sm:h-20',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Real THG 4 Pharma logo from official brand asset */}
      <div
        className={`relative inline-flex items-center justify-center rounded-xl transition-transform duration-200 hover:scale-105 ${
          variant === 'light'
            ? 'bg-white/95 p-1.5 shadow-sm ring-1 ring-white/30'
            : 'p-0.5'
        }`}
      >
        <img
          src="/thg-logo.png"
          alt="THG 4 Pharma — True Health Goals"
          className={`${heightClasses} w-auto object-contain shrink-0`}
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Brand Subtitle Indicator */}
      <div className="flex flex-col justify-center leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-xs uppercase ${
              variant === 'light' ? 'text-white' : 'text-[#0A1628]'
            }`}
          >
            THG 4 PHARMA
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#C8102E] text-white font-extrabold tracking-wide uppercase">
            EGYPT
          </span>
        </div>
        <span
          className={`text-[10px] font-medium tracking-normal mt-0.5 ${
            variant === 'light' ? 'text-slate-300' : 'text-slate-500'
          }`}
        >
          True Health Goals • مستورد رسمي
        </span>
      </div>
    </div>
  );
};
