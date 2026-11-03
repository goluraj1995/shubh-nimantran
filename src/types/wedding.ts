export interface HinduRitual {
  id: string;
  name: string; // e.g. "हल्दी की रस्म", "मेहंदी उत्सव", "मातृका पूजन", "बारात प्रस्थान", "वरमाला", "सात फेरे"
  subTitle?: string; // e.g. "उबटन एवं मंगलगान", "सप्तपदी एवं सिंदूर दान"
  date: string; // e.g. "गुरुवार, 18 मार्च 2027"
  time: string; // e.g. "प्रातः 10:15 बजे"
  location: string; // e.g. "निवास स्थान / वाटिका"
  description: string; // Auspicious description
  dressCode?: string; // e.g. "पीत वस्त्र (हल्दी पीला)", "पारंपरिक परिधान"
  icon: 'ganesha' | 'haldi' | 'mehndi' | 'mandap' | 'baraat' | 'varmala' | 'phere' | 'vidai' | 'preetibhoj' | 'music' | 'sparkles';
  enabled: boolean; // allow family to toggle rituals on/off
}

export interface GalleryPhoto {
  id: string;
  url: string;
  caption: string;
  category: 'all' | 'couple' | 'rituals' | 'family';
}

export interface GuestBlessing {
  id: string;
  name: string;
  relation?: string; // e.g. "मामा जी", "मित्र", "चाचा जी", "शुभचिंतक"
  message: string;
  timestamp: string;
  attending?: 'yes' | 'no';
  guestsCount?: number;
}

export interface WeddingData {
  isReadOnly?: boolean;
  isPublicGuest?: boolean;
  isSharedMode?: boolean;
  // Sacred invocations
  headline: string; // "॥ श्री गणेशाय नमः ॥"
  shloka: string; // Ganesh Shloka
  mangalShloka: string; // Mangal Parinay Shloka
  kuldeviBlessing?: string; // "॥ कुलदेवतायै नमः ॥ ॥ कुलदेवी प्रसन्ना ॥"

  // Groom Details (वर पक्ष)
  groomName: string; // "चि. कबीर"
  groomParents: string; // "सुपुत्र: श्रीमती सरोज एवं श्री राजेंद्र शर्मा"
  groomGrandparents: string; // "पौत्र: श्रीमती एवं स्व. श्री रामगोपाल शर्मा"
  groomCity?: string; // "उदयपुर, राजस्थान"

  // Bride Details (वधू पक्ष)
  brideName: string; // "आयु. आर्या"
  brideParents: string; // "सुपुत्री: श्रीमती सुनीता एवं श्री विजय कपूर"
  brideGrandparents: string; // "पौत्री: श्रीमती एवं स्व. श्री दयाकिशन कपूर"
  brideCity?: string; // "जयपुर, राजस्थान"

  // Wedding Date, Muhurat & Venue
  weddingDateIso: string; // "2027-03-20T19:15:00"
  weddingDateDisplay: string; // "शनिवार, 20 मार्च 2027"
  weddingMuhurat: string; // "शुभ लग्न एवं पाणिग्रहण: सायं 07:15 बजे (गोधूलि वेला)"
  
  venueName: string; // "राजमहल पैलेस एवं हेरिटेज वाटिका"
  venueAddress: string; // "लेक पिछोला रोड, उदयपुर, राजस्थान - 313001"
  googleMapsUrl: string;
  googleMapsEmbedUrl?: string;

  // Traditional Invitation Wording
  invitationGreeting: string; // "मान्यवर / आदरणीय स्वजन,"
  invitationMainText: string; // Detailed heartfelt Hindi invite text
  
  // Traditional Family Pillars
  darshanabhilashi: string; // "समस्त शर्मा एवं कपूर परिवार"
  swagatakankshi: string; // "चाचा-चाची, ताऊ-ताई, भाई-भाभी"
  balManuhar: string; // "मेरी चाचू की शादी में जलूल-जलूल आना! - नन्हे आरव व अन्या"
  vinit: string; // "श्रीमती सरोज एवं श्री राजेंद्र शर्मा"

  // Media & Music
  musicUrl?: string;
  heroImageUrl: string;

  // Hindu Rituals & Programs
  rituals: HinduRitual[];
  gallery: GalleryPhoto[];
  blessings: GuestBlessing[];
}
