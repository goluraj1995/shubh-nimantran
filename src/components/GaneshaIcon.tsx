import React from 'react';

interface GaneshaIconProps {
  className?: string;
  size?: number;
  variant?: 'gold' | 'maroon' | 'kumkum';
}

export const GaneshaIcon: React.FC<GaneshaIconProps> = ({
  className = '',
  size = 64,
  variant = 'gold'
}) => {
  const strokeColor = variant === 'maroon' ? '#800020' : variant === 'kumkum' ? '#b22222' : '#d4af37';
  const fillColor = variant === 'maroon' ? '#800020' : variant === 'kumkum' ? '#b22222' : '#d4af37';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block drop-shadow-md transition-transform hover:scale-105 ${className}`}
    >
      <defs>
        <linearGradient id="goldGradientGanesha" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f7d070" />
          <stop offset="40%" stopColor="#d4af37" />
          <stop offset="70%" stopColor="#ffd700" />
          <stop offset="100%" stopColor="#996515" />
        </linearGradient>
        <radialGradient id="tilakGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="100%" stopColor="#b22222" />
        </radialGradient>
      </defs>

      {/* Halo / Aura behind Ganesha */}
      <circle cx="50" cy="50" r="46" stroke="url(#goldGradientGanesha)" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
      <circle cx="50" cy="50" r="43" stroke="url(#goldGradientGanesha)" strokeWidth="0.8" opacity="0.4" />

      {/* Auspicious Ganesha Calligraphic Silhouette */}
      {/* Crown (Mukut) */}
      <path
        d="M50 12 L56 24 L44 24 Z"
        fill="url(#goldGradientGanesha)"
      />
      <circle cx="50" cy="12" r="2.5" fill="#e65100" />
      <path
        d="M40 24 Q50 18 60 24 Q50 22 40 24"
        fill="url(#goldGradientGanesha)"
      />

      {/* Head, Ear and Trunk in traditional Om / Ganesha calligraphic stroke */}
      {/* Left Ear */}
      <path
        d="M44 26 C32 26 26 34 27 44 C28 50 34 52 40 50 C36 44 38 34 44 30 Z"
        fill="url(#goldGradientGanesha)"
      />
      
      {/* Sacred Tilak (Trishul / Chandan & Kumkum) */}
      <path
        d="M47 27 Q50 25 53 27 L52 35 Q50 36 48 35 Z"
        fill="#ffebd0"
      />
      <circle cx="50" cy="31" r="2" fill="url(#tilakGradient)" />

      {/* Trunk (Sund) flowing to the left/modak */}
      <path
        d="M50 32 C58 32 64 38 63 48 C62 58 52 64 45 68 C38 72 37 77 41 81 C45 84 51 83 54 79 C57 75 58 68 66 61 C72 55 74 42 70 34 C67 29 60 26 50 26"
        fill="none"
        stroke="url(#goldGradientGanesha)"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Modak in Trunk */}
      <circle cx="43" cy="80" r="4" fill="#ffd700" stroke="#b8860b" strokeWidth="1" />
      <circle cx="43" cy="80" r="1.5" fill="#ff4d4d" />

      {/* Right Tusk (Ekdanta) */}
      <path
        d="M55 46 L60 48"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Sacred Swastika / Shubh Labh dots */}
      <circle cx="28" cy="20" r="1.5" fill="#b22222" />
      <circle cx="72" cy="20" r="1.5" fill="#b22222" />
    </svg>
  );
};

export const MangalKalashIcon: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="kalashGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fcebb6" />
        <stop offset="50%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#927018" />
      </linearGradient>
    </defs>
    {/* Coconut on top */}
    <ellipse cx="50" cy="35" rx="14" ry="16" fill="#8d5524" stroke="#5c3818" strokeWidth="2" />
    {/* Mango Leaves */}
    <path d="M50 35 Q30 20 22 28 Q35 38 48 36" fill="#2e7d32" />
    <path d="M50 35 Q70 20 78 28 Q65 38 52 36" fill="#2e7d32" />
    <path d="M50 35 Q50 12 50 8 Q55 20 50 35" fill="#388e3c" />
    {/* Kalash Pot */}
    <path d="M36 46 L64 46 L68 52 C72 65 70 82 50 84 C30 82 28 65 32 52 Z" fill="url(#kalashGold)" stroke="#b8860b" strokeWidth="2" />
    {/* Swastika on Kalash */}
    <path d="M46 62 H54 M50 58 V66 M54 58 H54 V62 M46 66 H46 V62 M50 58 H46 M50 66 H54" stroke="#b22222" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
