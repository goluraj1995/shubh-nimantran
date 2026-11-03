export type CardCategory = 'hindu_wedding' | 'muslim_wedding' | 'birthday';

export interface CardPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface GuestBlessingOrWish {
  id: string;
  name: string;
  relation?: string;
  message: string;
  timestamp: string;
  attending?: 'yes' | 'no';
  guestsCount?: number;
}

export interface PhotoTransform {
  zoom: number; // 0.5 to 3.0
  panX: number; // -100 to 100 (%)
  panY: number; // -100 to 100 (%)
  fitMode: 'cover' | 'contain';
  rotation: number; // 0, 90, 180, 270
  brightness: number; // 50 to 150
  contrast: number; // 50 to 150
}

export type BackgroundType = 
  | 'default'
  | 'blackboard'
  | 'chalkboard'
  | 'floral'
  | 'traditional_wedding'
  | 'birthday'
  | 'plain_color'
  | 'custom_image';

export interface BackgroundSettings {
  bgType: BackgroundType;
  customBgUrl?: string;
  plainColor?: string;
  overlayOpacity?: number;
}

export interface TextFormatSettings {
  fontFamily: string;
  fontSizeScale: 'sm' | 'md' | 'lg' | 'xl';
  textColor: string;
  accentColor: string;
  textAlignment: 'center' | 'left' | 'right';
  textShadow: boolean;
  textOutline: boolean;
}

export interface MusicSettings {
  mode: 'default' | 'custom' | 'none'; // default melody, custom uploaded audio, or silent
  audioUrl?: string; // Data URL or object URL
  audioFileName?: string;
  isStoredPermanently?: boolean; // true if saved in localStorage (<= 2.5MB)
  fileSizeBytes?: number;
  volume?: number; // 0 to 1
  isMuted?: boolean;
}

export interface DesignSettings {
  photoTransform: PhotoTransform;
  background: BackgroundSettings;
  typography: TextFormatSettings;
}

// 1. Hindu Wedding Ceremony
export interface HinduCeremony {
  id: string;
  name: string; // हल्दी, मेहंदी, बारात, वरमाला, विवाह संस्कार, सात फेरे, विदाई, आदि
  subTitle?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  dressCode?: string;
  icon: 'ganesha' | 'haldi' | 'mehndi' | 'mandap' | 'baraat' | 'varmala' | 'phere' | 'vidai' | 'preetibhoj' | 'sparkles';
  enabled: boolean;
}

export interface HinduWeddingData {
  category: 'hindu_wedding';
  id: string;
  title: string;
  updatedAt: string;
  personalGuestName?: string;
  isReadOnly?: boolean;
  isPublicGuest?: boolean;
  isSharedMode?: boolean;

  // Couple & Family
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;
  groomGrandparents?: string;
  brideGrandparents?: string;
  groomCity?: string;
  brideCity?: string;

  // Sacred Invocations
  headline: string; // ॥ श्री गणेशाय नमः ॥
  shloka: string;
  mangalShloka: string;
  kuldeviBlessing?: string;

  // Date, Time & Venue
  weddingDateIso: string;
  weddingDateDisplay: string;
  weddingMuhurat: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;

  // Message & Traditional Pillars
  invitationGreeting: string;
  invitationMainText: string;
  darshanabhilashi: string;
  swagatakankshi: string;
  balManuhar: string;
  vinit: string;

  // Theme & Media
  theme: 'royal_crimson' | 'marigold_gold' | 'sandalwood_cream';
  fontFamily: 'royal' | 'classic' | 'serif';
  envelopeStyle?: string;
  musicUrl?: string;
  musicSettings?: MusicSettings;
  heroImageUrl: string;
  originalHeroImageUrl?: string;
  design?: DesignSettings;

  // Ceremonies
  ceremonies: HinduCeremony[];
  photos: CardPhoto[];
  blessings: GuestBlessingOrWish[];
}

// 2. Muslim Wedding (Nikah & Walima)
export interface MuslimEvent {
  id: string;
  name: string; // निकाह, दावत-ए-वलीमा, रस्म-ए-हिना / मेहंदी, बारात व इस्तकबाल, रुखसती
  nameUrdu?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  enabled: boolean;
}

export interface MuslimWeddingData {
  category: 'muslim_wedding';
  id: string;
  title: string;
  updatedAt: string;
  personalGuestName?: string;
  isReadOnly?: boolean;
  isPublicGuest?: boolean;
  isSharedMode?: boolean;

  // Couple & Family
  groomName: string; // दूल्हा
  brideName: string; // दुल्हन
  groomParents: string; // वालिदैन (दूल्हा)
  brideParents: string; // वालिदैन (दुल्हन)
  groomFamily: string; // खानदान / सरपरस्त
  brideFamily: string;

  // Religious Invocations
  bismillahText: string; // بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
  quranAyat: string; // وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا
  quranAyatTranslation: string; // "और उसने तुम्हारे ही बीच से तुम्हारे जोड़े बनाए ताकि तुम्हें सुकून मिले..."
  dawatHeading: string; // निकाह व दावत-ए-वलीमा / Nikaah & Dawat-e-Walima

  // Language & Direction
  languageMode: 'hindi' | 'urdu' | 'english';

  // Date, Time & Venue
  weddingDateIso: string;
  weddingDateDisplay: string;
  nikahTimeDisplay: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;

  // Message & Family
  invitationGreeting: string;
  invitationMainText: string;
  chashmeBaraah: string; // चश्म-ए-बराह (इंतजार में)
  daawatan: string; // दावतीन / मुंतज़मीन
  contactPhone?: string;

  // Theme & Media
  theme: 'emerald_gold' | 'royal_sapphire' | 'ivory_gold';
  envelopeStyle?: string;
  musicUrl?: string;
  musicSettings?: MusicSettings;
  heroImageUrl: string;
  originalHeroImageUrl?: string;
  design?: DesignSettings;

  // Events
  events: MuslimEvent[];
  photos: CardPhoto[];
  blessings: GuestBlessingOrWish[];
}

// 3. Birthday Invitation
export interface BirthdayActivity {
  id: string;
  title: string; // केक कटिंग, गेम्स व मस्ती, मैजिक शो, डांस, डिनर
  time: string;
  description: string;
  enabled: boolean;
}

export interface BirthdayData {
  category: 'birthday';
  id: string;
  title: string;
  updatedAt: string;
  personalGuestName?: string;
  isReadOnly?: boolean;
  isPublicGuest?: boolean;
  isSharedMode?: boolean;

  // Person Details
  celebrantName: string; // जिसका जन्मदिन है
  age?: string; // उदा. 1st, 5वां, 18वां, 25वां, 50वां या खाली
  celebrantBio?: string; // छोटी सी प्यारी लाइन

  // Theme & Audience
  birthdayType: 'kid' | 'teen_adult' | 'golden_milestone';
  theme: 'colorful_balloons' | 'pink_princess' | 'royal_gold_midnight' | 'neon_fun';

  // Date, Time & Venue
  partyDateIso: string;
  partyDateDisplay: string;
  partyTimeDisplay: string;
  venueName: string;
  venueAddress: string;
  googleMapsUrl: string;

  // Message & Party Info
  invitationGreeting: string;
  invitationMainText: string;
  dressCode?: string; // उदा. सुपरहीरो / फैंसी ड्रेस / स्मार्ट कैजुअल
  hostsName: string; // माता-पिता / पार्टी होस्ट्स
  rsvpContact: string; // RSVP फोन नंबर

  // Media
  envelopeStyle?: string;
  musicUrl?: string;
  musicSettings?: MusicSettings;
  heroImageUrl: string;
  originalHeroImageUrl?: string;
  design?: DesignSettings;

  // Activities & Photos
  activities: BirthdayActivity[];
  photos: CardPhoto[];
  wishes: GuestBlessingOrWish[];
}

export type AnyInvitationData = HinduWeddingData | MuslimWeddingData | BirthdayData;
