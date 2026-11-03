export interface CardTheme {
  id: string;
  name: string;
  desc: string;
  textColor: string;
  accentColor: string;
  cardBgColor: string;
  borderColor: string;
  fontFamily: string;
  plainColor: string;
  previewGradient: string;
  hasGanesha?: boolean;
  animationEnabled?: boolean;
}

export const APP_THEMES: CardTheme[] = [
  {
    id: 'ganesh_mangalam',
    name: 'गणेश मंगलम (Ganesh Mangalam)',
    desc: 'Red and gold, traditional border, auspicious Ganesha illustration.',
    textColor: '#520814',
    accentColor: '#d4af37',
    cardBgColor: '#fffaf0',
    borderColor: '#d4af37',
    fontFamily: 'rozha',
    plainColor: '#fffaf0',
    previewGradient: 'from-[#7a0c1e] to-[#ffd700]',
    hasGanesha: true,
    animationEnabled: true
  },
  {
    id: 'ganesh_ashirwad',
    name: 'गणेश आशीर्वाद (Ganesh Ashirwad)',
    desc: 'Cream and gold, beautiful Ganesha illustration with gentle glow effect.',
    textColor: '#382e1c',
    accentColor: '#bc6c25',
    cardBgColor: '#fefae0',
    borderColor: '#dda15e',
    fontFamily: 'cormorant',
    plainColor: '#fefae0',
    previewGradient: 'from-[#fefae0] to-[#dda15e]',
    hasGanesha: true,
    animationEnabled: true
  },
  {
    id: 'royal_rajwada',
    name: 'रॉयल राजवाड़ा (Royal Rajwada)',
    desc: 'Maroon and gold, royal borders and traditional Indian pattern.',
    textColor: '#3d0c15',
    accentColor: '#d4af37',
    cardBgColor: '#fffaf0',
    borderColor: '#d4af37',
    fontFamily: 'rozha',
    plainColor: '#fffaf0',
    previewGradient: 'from-[#7a0c1e] to-[#ffd700]'
  },
  {
    id: 'radha_krishna',
    name: 'राधा-कृष्ण प्रेम (Radha Krishna Prem)',
    desc: 'Pink, purple and gold, divine floral decorations.',
    textColor: '#831843',
    accentColor: '#f43f5e',
    cardBgColor: '#fff1f2',
    borderColor: '#f43f5e',
    fontFamily: 'great_vibes',
    plainColor: '#fff1f2',
    previewGradient: 'from-[#be185d] to-[#f43f5e]'
  },
  {
    id: 'shubh_swarnim',
    name: 'शुभ स्वर्णिम (Shubh Swarnim)',
    desc: 'Ivory and gold, premium clean and elegant design.',
    textColor: '#382e1c',
    accentColor: '#bc6c25',
    cardBgColor: '#fefae0',
    borderColor: '#dda15e',
    fontFamily: 'cormorant',
    plainColor: '#fefae0',
    previewGradient: 'from-[#fefae0] to-[#dda15e]'
  },
  {
    id: 'morpankh_utsav',
    name: 'मोरपंख उत्सव (Morpankh Utsav)',
    desc: 'Peacock blue and green, traditional decorative pattern.',
    textColor: '#164e63',
    accentColor: '#06b6d4',
    cardBgColor: '#ecfeff',
    borderColor: '#06b6d4',
    fontFamily: 'playfair',
    plainColor: '#ecfeff',
    previewGradient: 'from-[#0e7490] to-[#22d3ee]'
  },
  {
    id: 'gulabi_pushp',
    name: 'गुलाबी पुष्प (Gulabi Pushp)',
    desc: 'Rose pink, flower and leaf botanical decorations.',
    textColor: '#500724',
    accentColor: '#db2777',
    cardBgColor: '#fdf2f8',
    borderColor: '#f472b6',
    fontFamily: 'fredoka',
    plainColor: '#fdf2f8',
    previewGradient: 'from-[#db2777] to-[#f472b6]'
  },
  {
    id: 'emerald_royal',
    name: 'एमराल्ड रॉयल (Emerald Royal)',
    desc: 'Deep green and gold, attractive royal design.',
    textColor: '#022c22',
    accentColor: '#d4af37',
    cardBgColor: '#f0fdf4',
    borderColor: '#059669',
    fontFamily: 'noto_serif',
    plainColor: '#f0fdf4',
    previewGradient: 'from-[#064e3b] to-[#ffd700]'
  },
  {
    id: 'mandap_utsav',
    name: 'मंडप उत्सव (Mandap Utsav)',
    desc: 'Red, saffron and gold, wedding mandap inspired decoration.',
    textColor: '#7c2d12',
    accentColor: '#ea580c',
    cardBgColor: '#fff7ed',
    borderColor: '#f97316',
    fontFamily: 'yatra',
    plainColor: '#fff7ed',
    previewGradient: 'from-[#c2410c] to-[#f97316]'
  },
  {
    id: 'modern_pastel',
    name: 'मॉडर्न पेस्टल (Modern Pastel)',
    desc: 'Peach, lavender and cream, modern and minimal design.',
    textColor: '#3b0764',
    accentColor: '#a855f7',
    cardBgColor: '#faf5ff',
    borderColor: '#a855f7',
    fontFamily: 'cinzel',
    plainColor: '#faf5ff',
    previewGradient: 'from-[#581c87] to-[#a855f7]'
  }
];

export const getThemeById = (themeId?: string): CardTheme => {
  if (!themeId) return APP_THEMES[0];
  
  // Backward compatibility mapping for old theme IDs
  const legacyMap: Record<string, string> = {
    royal_crimson: 'ganesh_mangalam',
    marigold_gold: 'mandap_utsav',
    sandalwood_cream: 'ganesh_ashirwad',
    emerald_gold: 'emerald_royal',
    royal_sapphire: 'morpankh_utsav',
    ivory_gold: 'shubh_swarnim',
    colorful_balloons: 'modern_pastel',
    pink_princess: 'gulabi_pushp',
    royal_gold_midnight: 'royal_rajwada',
    neon_fun: 'radha_krishna'
  };

  const resolvedId = legacyMap[themeId] || themeId;
  return APP_THEMES.find((t) => t.id === resolvedId) || APP_THEMES[0];
};
