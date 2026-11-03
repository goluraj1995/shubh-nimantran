import React from 'react';

export const BirthdayCakeIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 54,
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    {/* Candles */}
    <rect x="36" y="22" width="4" height="18" rx="2" fill="#38bdf8" />
    <rect x="48" y="18" width="4" height="22" rx="2" fill="#ec4899" />
    <rect x="60" y="22" width="4" height="18" rx="2" fill="#eab308" />

    {/* Candle Flames */}
    <path d="M38 12 Q40 18 38 22 Q36 18 38 12 Z" fill="#f97316" className="animate-diya" />
    <path d="M50 8 Q52 14 50 18 Q48 14 50 8 Z" fill="#facc15" className="animate-diya" />
    <path d="M62 12 Q64 18 62 22 Q60 18 62 12 Z" fill="#f97316" className="animate-diya" />

    {/* Cake Tier 1 (Top) */}
    <rect x="30" y="40" width="40" height="20" rx="4" fill="#f472b6" />
    <path d="M30 46 Q35 50 40 46 Q45 50 50 46 Q55 50 60 46 Q65 50 70 46" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" />

    {/* Cake Tier 2 (Bottom) */}
    <rect x="20" y="60" width="60" height="26" rx="5" fill="#a855f7" />
    <path d="M20 68 Q27 74 35 68 Q42 74 50 68 Q57 74 65 68 Q72 74 80 68" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" />

    {/* Cake Plate */}
    <ellipse cx="50" cy="88" rx="38" ry="5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
    {/* Sprinkles */}
    <circle cx="26" cy="76" r="2" fill="#fde047" />
    <circle cx="45" cy="80" r="2" fill="#38bdf8" />
    <circle cx="62" cy="78" r="2" fill="#4ade80" />
    <circle cx="73" cy="74" r="2" fill="#f43f5e" />
  </svg>
);

export const BalloonsClusterIcon: React.FC<{ size?: number; className?: string }> = ({
  size = 54,
  className = ''
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block drop-shadow-md ${className}`}
  >
    {/* Left Balloon */}
    <ellipse cx="36" cy="38" rx="16" ry="20" fill="#38bdf8" />
    {/* Middle Balloon */}
    <ellipse cx="50" cy="30" rx="18" ry="22" fill="#ec4899" />
    {/* Right Balloon */}
    <ellipse cx="64" cy="38" rx="16" ry="20" fill="#facc15" />

    {/* Highlights */}
    <ellipse cx="32" cy="32" rx="4" ry="7" fill="#ffffff" opacity="0.6" />
    <ellipse cx="46" cy="24" rx="4" ry="8" fill="#ffffff" opacity="0.6" />
    <ellipse cx="60" cy="32" rx="4" ry="7" fill="#ffffff" opacity="0.6" />

    {/* Strings */}
    <path d="M36 58 Q42 70 50 88" stroke="#94a3b8" strokeWidth="1.5" fill="none" />
    <path d="M50 52 L50 88" stroke="#64748b" strokeWidth="1.5" fill="none" />
    <path d="M64 58 Q58 70 50 88" stroke="#94a3b8" strokeWidth="1.5" fill="none" />

    {/* Ribbon Knot */}
    <circle cx="50" cy="88" r="3" fill="#e11d48" />
  </svg>
);
