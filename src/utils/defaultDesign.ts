import { CardCategory, DesignSettings, BackgroundType } from '../types/invitation';

export const PRESET_BACKGROUNDS: {
  id: BackgroundType;
  label: string;
  category: 'all' | 'wedding' | 'birthday' | 'chalk';
  previewColor: string;
  imageUrl?: string;
}[] = [
  {
    id: 'default',
    label: 'डिफ़ॉल्ट थीम पैटर्न (Default Texture)',
    category: 'all',
    previewColor: '#fdf6e7'
  },
  {
    id: 'blackboard',
    label: 'ब्लैकबोर्ड / स्लेट (Vintage Blackboard)',
    category: 'chalk',
    previewColor: '#1e293b',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'chalkboard',
    label: 'ग्रीन चाकबोर्ड (Green Chalkboard)',
    category: 'chalk',
    previewColor: '#064e3b',
    imageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'floral',
    label: 'शाही फ्लोरल (Royal Floral Roses & Gold)',
    category: 'wedding',
    previewColor: '#fce7f3',
    imageUrl: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'traditional_wedding',
    label: 'पारंपरिक मंडप व सिल्क (Mandap & Silk)',
    category: 'wedding',
    previewColor: '#fef08a',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'birthday',
    label: 'बर्थडे पार्टी कंफेटी (Balloons & Confetti)',
    category: 'birthday',
    previewColor: '#f472b6',
    imageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'plain_color',
    label: 'एकसमान रंग (Plain Solid Color)',
    category: 'all',
    previewColor: '#ffffff'
  },
  {
    id: 'custom_image',
    label: 'व्यक्तिगत इमेज / बैकग्राउंड अपलोड (Custom Image)',
    category: 'all',
    previewColor: '#d4af37'
  }
];

export const AVAILABLE_FONTS = [
  // Devanagari Hindi
  { id: 'rozha', name: 'रोज़ा वन (शाही देवनागरी)', family: "'Rozha One', serif", type: 'devanagari' },
  { id: 'yatra', name: 'यात्रा वन (पारंपरिक हेडिंग)', family: "'Yatra One', cursive", type: 'devanagari' },
  { id: 'noto_serif', name: 'नोटों सेरिफ़ (क्लासिक हिंदी)', family: "'Noto Serif Devanagari', serif", type: 'devanagari' },
  { id: 'kalam', name: 'कलम (हस्तलिखित / Chalk Style)', family: "'Kalam', cursive", type: 'devanagari' },
  { id: 'amita', name: 'अमिता (बोल्ड सुलेखन)', family: "'Amita', cursive", type: 'devanagari' },
  { id: 'tiro', name: 'तिरो देवनागरी (साहित्यिक)', family: "'Tiro Devanagari Hindi', serif", type: 'devanagari' },
  
  // Urdu / Arabic
  { id: 'amiri', name: 'अमीरी (खत-ए-नस्क़ उर्दू)', family: "'Amiri', serif", type: 'urdu' },
  { id: 'noto_arabic', name: 'नोटों अरबी / उर्दू', family: "'Noto Naskh Arabic', serif", type: 'urdu' },
  
  // English Calligraphy & Chalk
  { id: 'great_vibes', name: 'Great Vibes (शाही सुलेखन)', family: "'Great Vibes', cursive", type: 'calligraphy' },
  { id: 'cinzel', name: 'Cinzel (Royal Roman)', family: "'Cinzel', serif", type: 'english' },
  { id: 'cormorant', name: 'Cormorant (Luxury Serif)', family: "'Cormorant Garamond', serif", type: 'english' },
  { id: 'playfair', name: 'Playfair Display (Elegant)', family: "'Playfair Display', serif", type: 'english' },
  { id: 'cabin_sketch', name: 'Cabin Sketch (चाकबोर्ड / Chalk)', family: "'Cabin Sketch', cursive", type: 'chalk' },
  { id: 'caveat', name: 'Caveat (हैंडराइटिंग)', family: "'Caveat', cursive", type: 'handwritten' },
  { id: 'fredoka', name: 'Fredoka (बर्थडे फन / बबली)', family: "'Fredoka', sans-serif", type: 'birthday' },
  { id: 'pacifico', name: 'Pacifico (पार्टी स्क्रिप्ट)', family: "'Pacifico', cursive", type: 'birthday' }
];

export const getDefaultDesign = (category: CardCategory): DesignSettings => {
  if (category === 'muslim_wedding') {
    return {
      photoTransform: {
        zoom: 1,
        panX: 0,
        panY: 0,
        fitMode: 'cover',
        rotation: 0,
        brightness: 100,
        contrast: 100
      },
      background: {
        bgType: 'default',
        plainColor: '#f7faf7',
        overlayOpacity: 88
      },
      typography: {
        fontFamily: 'noto_serif',
        fontSizeScale: 'md',
        textColor: '#064e3b',
        accentColor: '#d4af37',
        textAlignment: 'center',
        textShadow: false,
        textOutline: false
      }
    };
  } else if (category === 'birthday') {
    return {
      photoTransform: {
        zoom: 1,
        panX: 0,
        panY: 0,
        fitMode: 'cover',
        rotation: 0,
        brightness: 100,
        contrast: 100
      },
      background: {
        bgType: 'birthday',
        plainColor: '#fff9f5',
        overlayOpacity: 80
      },
      typography: {
        fontFamily: 'fredoka',
        fontSizeScale: 'md',
        textColor: '#2c1810',
        accentColor: '#ec4899',
        textAlignment: 'center',
        textShadow: false,
        textOutline: false
      }
    };
  }

  // Default Hindu wedding
  return {
    photoTransform: {
      zoom: 1,
      panX: 0,
      panY: 0,
      fitMode: 'cover',
      rotation: 0,
      brightness: 100,
      contrast: 100
    },
    background: {
      bgType: 'default',
      plainColor: '#fffaf0',
      overlayOpacity: 90
    },
    typography: {
      fontFamily: 'rozha',
      fontSizeScale: 'md',
      textColor: '#3d0c15',
      accentColor: '#d4af37',
      textAlignment: 'center',
      textShadow: false,
      textOutline: false
    }
  };
};
