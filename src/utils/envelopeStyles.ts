export interface EnvelopeStyleConfig {
  id: string;
  nameHindi: string;
  nameEnglish: string;
  bgGradient: string;
  borderClass: string;
  topFlapBg: string;
  sealGradient: string;
  sealInner: string;
  sealText: string;
  patternType: 'mandala' | 'geometric' | 'floral' | 'stripes' | 'minimal';
  previewColor: string;
}

export const ENVELOPE_STYLES: EnvelopeStyleConfig[] = [
  {
    id: 'royal_red_gold',
    nameHindi: 'लाल और सुनहरी शाही शैली',
    nameEnglish: 'Royal Red & Gold',
    bgGradient: 'bg-gradient-to-br from-[#87091f] via-[#630514] to-[#3a0108]',
    borderClass: 'border-4 border-[#ffd700]',
    topFlapBg: 'bg-gradient-to-b from-[#a3122c] to-[#7a0c1e] border-b-2 border-[#ffd700]/70',
    sealGradient: 'from-[#ffd700] via-[#f59e0b] to-[#b8860b]',
    sealInner: 'from-[#630514] to-[#3d0208]',
    sealText: 'text-[#ffd700]',
    patternType: 'mandala',
    previewColor: '#87091f'
  },
  {
    id: 'premium_golden',
    nameHindi: 'सुनहरी प्रीमियम शैली',
    nameEnglish: 'Premium Golden',
    bgGradient: 'bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#ca8a04]',
    borderClass: 'border-4 border-[#fffbeb]',
    topFlapBg: 'bg-gradient-to-b from-[#fde047] to-[#ca8a04] border-b-2 border-[#fffbeb]',
    sealGradient: 'from-[#78350f] via-[#92400e] to-[#451a03]',
    sealInner: 'from-[#fef08a] to-[#eab308]',
    sealText: 'text-[#451a03]',
    patternType: 'minimal',
    previewColor: '#eab308'
  },
  {
    id: 'floral_wedding',
    nameHindi: 'फूलों से सजा विवाह लिफाफा',
    nameEnglish: 'Floral Wedding',
    bgGradient: 'bg-gradient-to-br from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
    borderClass: 'border-4 border-[#f43f5e]',
    topFlapBg: 'bg-gradient-to-b from-[#fb7185] to-[#f43f5e] border-b-2 border-[#fff1f2]',
    sealGradient: 'from-[#f43f5e] via-[#e11d48] to-[#9f1239]',
    sealInner: 'from-[#fff1f2] to-[#ffe4e6]',
    sealText: 'text-[#9f1239]',
    patternType: 'floral',
    previewColor: '#f43f5e'
  },
  {
    id: 'traditional_indian',
    nameHindi: 'पारंपरिक भारतीय डिज़ाइन',
    nameEnglish: 'Traditional Indian',
    bgGradient: 'bg-gradient-to-br from-[#991b1b] via-[#7f1d1d] to-[#450a0a]',
    borderClass: 'border-4 border-[#fbbf24]',
    topFlapBg: 'bg-gradient-to-b from-[#b91c1c] to-[#991b1b] border-b-2 border-[#fbbf24]',
    sealGradient: 'from-[#fbbf24] via-[#f59e0b] to-[#b45309]',
    sealInner: 'from-[#7f1d1d] to-[#450a0a]',
    sealText: 'text-[#fef3c7]',
    patternType: 'mandala',
    previewColor: '#991b1b'
  },
  {
    id: 'elegant_cream',
    nameHindi: 'क्रीम और गोल्ड बॉर्डर',
    nameEnglish: 'Elegant Cream',
    bgGradient: 'bg-gradient-to-br from-[#fffdf9] via-[#fef3c7] to-[#fde68a]',
    borderClass: 'border-4 border-[#b8860b]',
    topFlapBg: 'bg-gradient-to-b from-[#fef9c3] to-[#fde68a] border-b-2 border-[#b8860b]',
    sealGradient: 'from-[#b8860b] via-[#92400e] to-[#78350f]',
    sealInner: 'from-[#fffdf9] to-[#fef3c7]',
    sealText: 'text-[#fef3c7]',
    patternType: 'stripes',
    previewColor: '#d4af37'
  },
  {
    id: 'royal_maroon',
    nameHindi: 'मैरून और सुनहरी सजावट',
    nameEnglish: 'Royal Maroon',
    bgGradient: 'bg-gradient-to-br from-[#581c87] via-[#4c1d95] to-[#2e1065]',
    borderClass: 'border-4 border-[#fde047]',
    topFlapBg: 'bg-gradient-to-b from-[#6b21a8] to-[#581c87] border-b-2 border-[#fde047]',
    sealGradient: 'from-[#fde047] via-[#eab308] to-[#ca8a04]',
    sealInner: 'from-[#4c1d95] to-[#2e1065]',
    sealText: 'text-[#fde047]',
    patternType: 'geometric',
    previewColor: '#581c87'
  },
  {
    id: 'pastel_floral',
    nameHindi: 'हल्के रंगों वाले फूल',
    nameEnglish: 'Pastel Floral',
    bgGradient: 'bg-gradient-to-br from-[#f0fdf4] via-[#dcfce7] to-[#bbf7d0]',
    borderClass: 'border-4 border-[#16a34a]',
    topFlapBg: 'bg-gradient-to-b from-[#22c55e] to-[#16a34a] border-b-2 border-[#bbf7d0]',
    sealGradient: 'from-[#16a34a] via-[#15803d] to-[#166534]',
    sealInner: 'from-[#f0fdf4] to-[#dcfce7]',
    sealText: 'text-[#f0fdf4]',
    patternType: 'floral',
    previewColor: '#16a34a'
  },
  {
    id: 'luxury_velvet',
    nameHindi: 'गहरे रंग और शानदार सजावट',
    nameEnglish: 'Luxury Velvet',
    bgGradient: 'bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#020617]',
    borderClass: 'border-4 border-[#38bdf8]',
    topFlapBg: 'bg-gradient-to-b from-[#1e1b4b] to-[#0f172a] border-b-2 border-[#38bdf8]',
    sealGradient: 'from-[#38bdf8] via-[#0ea5e9] to-[#0284c7]',
    sealInner: 'from-[#0f172a] to-[#1e1b4b]',
    sealText: 'text-[#e0f2fe]',
    patternType: 'geometric',
    previewColor: '#0f172a'
  },
  {
    id: 'islamic_geometric',
    nameHindi: 'सुंदर ज्यामितीय पैटर्न और उपयुक्त मेहराब',
    nameEnglish: 'Islamic Geometric',
    bgGradient: 'bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#021c17]',
    borderClass: 'border-4 border-[#34d399]',
    topFlapBg: 'bg-gradient-to-b from-[#047857] to-[#064e3b] border-b-2 border-[#34d399]',
    sealGradient: 'from-[#34d399] via-[#10b981] to-[#059669]',
    sealInner: 'from-[#064e3b] to-[#022c22]',
    sealText: 'text-[#ecfdf5]',
    patternType: 'geometric',
    previewColor: '#064e3b'
  },
  {
    id: 'modern_minimal',
    nameHindi: 'साफ-सुथरा आधुनिक डिज़ाइन',
    nameEnglish: 'Modern Minimal',
    bgGradient: 'bg-gradient-to-br from-[#f8fafc] via-[#e2e8f0] to-[#cbd5e1]',
    borderClass: 'border-4 border-[#475569]',
    topFlapBg: 'bg-gradient-to-b from-[#cbd5e1] to-[#94a3b8] border-b-2 border-[#475569]',
    sealGradient: 'from-[#475569] via-[#334155] to-[#1e293b]',
    sealInner: 'from-[#f8fafc] to-[#e2e8f0]',
    sealText: 'text-[#f8fafc]',
    patternType: 'minimal',
    previewColor: '#64748b'
  },
  {
    id: 'royal_peacock_blue',
    nameHindi: 'शाही मोर पंख नीला और स्वर्ण',
    nameEnglish: 'Royal Peacock Blue & Gold',
    bgGradient: 'bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#090d16]',
    borderClass: 'border-4 border-[#38bdf8]',
    topFlapBg: 'bg-gradient-to-b from-[#1e40af] to-[#1e3a8a] border-b-2 border-[#38bdf8]',
    sealGradient: 'from-[#38bdf8] via-[#0284c7] to-[#0369a1]',
    sealInner: 'from-[#0f172a] to-[#090d16]',
    sealText: 'text-[#e0f2fe]',
    patternType: 'geometric',
    previewColor: '#1e3a8a'
  },
  {
    id: 'emerald_green_gold',
    nameHindi: 'पन्ना हरा और स्वर्ण',
    nameEnglish: 'Emerald Green & Gold',
    bgGradient: 'bg-gradient-to-br from-[#065f46] via-[#047857] to-[#022c22]',
    borderClass: 'border-4 border-[#fbbf24]',
    topFlapBg: 'bg-gradient-to-b from-[#059669] to-[#047857] border-b-2 border-[#fbbf24]',
    sealGradient: 'from-[#fbbf24] via-[#f59e0b] to-[#d97706]',
    sealInner: 'from-[#065f46] to-[#022c22]',
    sealText: 'text-[#fef3c7]',
    patternType: 'mandala',
    previewColor: '#047857'
  },
  {
    id: 'rose_pink_floral',
    nameHindi: 'गुलाब गुलाबी फ्लोरल',
    nameEnglish: 'Rose Pink Floral',
    bgGradient: 'bg-gradient-to-br from-[#fda4af] via-[#f43f5e] to-[#9f1239]',
    borderClass: 'border-4 border-[#ffe4e6]',
    topFlapBg: 'bg-gradient-to-b from-[#fb7185] to-[#f43f5e] border-b-2 border-[#ffe4e6]',
    sealGradient: 'from-[#fff1f2] via-[#ffe4e6] to-[#fecdd3]',
    sealInner: 'from-[#9f1239] to-[#881337]',
    sealText: 'text-[#9f1239]',
    patternType: 'floral',
    previewColor: '#f43f5e'
  },
  {
    id: 'lavender_silver',
    nameHindi: 'लैवेंडर और चांदी',
    nameEnglish: 'Lavender Silver Wedding',
    bgGradient: 'bg-gradient-to-br from-[#ede9fe] via-[#c4b5fd] to-[#7c3aed]',
    borderClass: 'border-4 border-[#ffffff]',
    topFlapBg: 'bg-gradient-to-b from-[#ddd6fe] to-[#a78bfa] border-b-2 border-[#ffffff]',
    sealGradient: 'from-[#f1f5f9] via-[#cbd5e1] to-[#64748b]',
    sealInner: 'from-[#5b21b6] to-[#4c1d95]',
    sealText: 'text-[#f8fafc]',
    patternType: 'minimal',
    previewColor: '#8b5cf6'
  },
  {
    id: 'ivory_pearl_champagne',
    nameHindi: 'आइवरी पर्ल और शैंपेन गोल्ड',
    nameEnglish: 'Ivory Pearl & Champagne Gold',
    bgGradient: 'bg-gradient-to-br from-[#fdfbf7] via-[#f4ebd0] to-[#e6d5b8]',
    borderClass: 'border-4 border-[#d4af37]',
    topFlapBg: 'bg-gradient-to-b from-[#faf5eb] to-[#e6d5b8] border-b-2 border-[#d4af37]',
    sealGradient: 'from-[#d4af37] via-[#aa771c] to-[#78520f]',
    sealInner: 'from-[#fdfbf7] to-[#f4ebd0]',
    sealText: 'text-[#78520f]',
    patternType: 'stripes',
    previewColor: '#f4ebd0'
  },
  {
    id: 'midnight_navy_gold',
    nameHindi: 'मिडनाइट नेवी और स्वर्ण',
    nameEnglish: 'Midnight Navy & Gold',
    bgGradient: 'bg-gradient-to-br from-[#020617] via-[#1e293b] to-[#0f172a]',
    borderClass: 'border-4 border-[#fbbf24]',
    topFlapBg: 'bg-gradient-to-b from-[#334155] to-[#1e293b] border-b-2 border-[#fbbf24]',
    sealGradient: 'from-[#fbbf24] via-[#f59e0b] to-[#d97706]',
    sealInner: 'from-[#020617] to-[#0f172a]',
    sealText: 'text-[#fef3c7]',
    patternType: 'geometric',
    previewColor: '#1e293b'
  },
  {
    id: 'terracotta_traditional',
    nameHindi: 'टेराकोटा पारंपरिक',
    nameEnglish: 'Terracotta Traditional',
    bgGradient: 'bg-gradient-to-br from-[#9a3412] via-[#c2410c] to-[#7c2d12]',
    borderClass: 'border-4 border-[#fed7aa]',
    topFlapBg: 'bg-gradient-to-b from-[#ea580c] to-[#c2410c] border-b-2 border-[#fed7aa]',
    sealGradient: 'from-[#fed7aa] via-[#fdba74] to-[#f97316]',
    sealInner: 'from-[#7c2d12] to-[#431407]',
    sealText: 'text-[#431407]',
    patternType: 'mandala',
    previewColor: '#c2410c'
  },
  {
    id: 'pastel_mint_wedding',
    nameHindi: 'पेस्टल मिंट विवाह',
    nameEnglish: 'Pastel Mint Wedding',
    bgGradient: 'bg-gradient-to-br from-[#ecfdf5] via-[#a7f3d0] to-[#6ee7b7]',
    borderClass: 'border-4 border-[#047857]',
    topFlapBg: 'bg-gradient-to-b from-[#d1fae5] to-[#34d399] border-b-2 border-[#047857]',
    sealGradient: 'from-[#047857] via-[#065f46] to-[#064e3b]',
    sealInner: 'from-[#ecfdf5] to-[#a7f3d0]',
    sealText: 'text-[#ecfdf5]',
    patternType: 'floral',
    previewColor: '#34d399'
  },
  {
    id: 'ruby_red_floral',
    nameHindi: 'रूबी लाल फ्लोरल सील',
    nameEnglish: 'Ruby Red Floral Seal',
    bgGradient: 'bg-gradient-to-br from-[#881337] via-[#9f1239] to-[#4c0519]',
    borderClass: 'border-4 border-[#fbcfe8]',
    topFlapBg: 'bg-gradient-to-b from-[#be123c] to-[#9f1239] border-b-2 border-[#fbcfe8]',
    sealGradient: 'from-[#fbcfe8] via-[#f472b6] to-[#db2777]',
    sealInner: 'from-[#4c0519] to-[#881337]',
    sealText: 'text-[#4c0519]',
    patternType: 'floral',
    previewColor: '#9f1239'
  },
  {
    id: 'black_antique_gold',
    nameHindi: 'काला और प्राचीन स्वर्ण लग्जरी',
    nameEnglish: 'Black & Antique Gold Luxury',
    bgGradient: 'bg-gradient-to-br from-[#000000] via-[#18181b] to-[#27272a]',
    borderClass: 'border-4 border-[#d4af37]',
    topFlapBg: 'bg-gradient-to-b from-[#27272a] to-[#18181b] border-b-2 border-[#d4af37]',
    sealGradient: 'from-[#d4af37] via-[#f59e0b] to-[#b8860b]',
    sealInner: 'from-[#000000] to-[#18181b]',
    sealText: 'text-[#d4af37]',
    patternType: 'geometric',
    previewColor: '#18181b'
  }
];

export const getEnvelopeConfig = (styleId?: string, category?: string) => {
  const found = ENVELOPE_STYLES.find(e => e.id === styleId);
  if (found) return found;

  if (category === 'muslim_wedding') {
    return ENVELOPE_STYLES.find(e => e.id === 'islamic_geometric') || ENVELOPE_STYLES[0];
  }
  if (category === 'birthday') {
    return ENVELOPE_STYLES.find(e => e.id === 'floral_wedding') || ENVELOPE_STYLES[0];
  }
  return ENVELOPE_STYLES[0];
};
