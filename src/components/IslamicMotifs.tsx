import React from 'react';

export const CrescentStarIcon: React.FC<{ size?: number; className?: string; color?: string }> = ({
  size = 48,
  className = '',
  color = '#d4af37'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    <defs>
      <linearGradient id="islamicGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#927018" />
      </linearGradient>
    </defs>
    {/* Crescent Moon */}
    <path
      d="M50 15 C30.67 15 15 30.67 15 50 C15 69.33 30.67 85 50 85 C61.85 85 72.18 79.11 78.43 70.08 C64.67 71.85 51.5 61.26 51.5 47.3 C51.5 35.8 59.43 25.8 70.4 22.36 C64.3 17.72 57.38 15 50 15 Z"
      fill="url(#islamicGold)"
    />
    {/* 5-pointed Star */}
    <polygon
      points="74,32 77,41 86,41 79,47 81,56 74,51 67,56 69,47 62,41 71,41"
      fill="url(#islamicGold)"
    />
  </svg>
);

export const BismillahCalligraphy: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const textSize = size === 'lg' ? 'text-2xl sm:text-4xl' : size === 'sm' ? 'text-lg sm:text-xl' : 'text-xl sm:text-3xl';
  return (
    <div className={`text-center select-none ${className}`}>
      <p className={`font-urdu font-bold text-[#d4af37] tracking-wider leading-relaxed ${textSize}`} dir="rtl">
        بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
      </p>
      <p className="text-[11px] font-devanagari-serif text-[#047857] font-semibold mt-0.5">
        बा-इस्म-ए-ताला (अल्लाह के नाम से जो निहायत मेहरबान और रहम करने वाला है)
      </p>
    </div>
  );
};

export const IslamicArchFrame: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => (
  <div className={`relative p-5 sm:p-8 rounded-3xl bg-[#fffefb] border-2 border-[#d4af37] shadow-xl card-paper-islamic overflow-hidden ${className}`}>
    {/* Top Moroccan Arch border pattern */}
    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-[#064e3b] via-[#d4af37] to-[#064e3b] opacity-80 flex items-center justify-around overflow-hidden">
      {Array.from({ length: 24 }).map((_, i) => (
        <span key={i} className="text-[#ffd700] text-[10px]">✦</span>
      ))}
    </div>
    {children}
  </div>
);
