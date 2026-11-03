import { HinduWeddingData, MuslimWeddingData, BirthdayData } from '../types/invitation';

export const defaultHinduWeddingData: HinduWeddingData = {
  category: 'hindu_wedding',
  id: 'draft-hindu-1',
  title: 'चि. कबीर एवं आयु. आर्या का शुभ विवाह',
  updatedAt: new Date().toISOString(),

  groomName: 'चि. कबीर',
  groomParents: 'सुपुत्र: श्रीमती सरोज एवं श्री राजेंद्र शर्मा',
  groomGrandparents: 'पौत्र: श्रीमती एवं स्व. श्री रामगोपाल शर्मा',
  groomCity: 'उदयपुर, राजस्थान',

  brideName: 'आयु. आर्या',
  brideParents: 'सुपुत्री: श्रीमती सुनीता एवं श्री विजय कपूर',
  brideGrandparents: 'पौत्री: श्रीमती एवं स्व. श्री दयाकिशन कपूर',
  brideCity: 'जयपुर, राजस्थान',

  headline: '॥ श्री गणेशाय नमः ॥',
  shloka: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
  mangalShloka: 'मांगल्यं तन्तुनानेन लोकजीवनहेतुना।\nकण्ठे बध्नामि सुभगे त्वं जीव शरदः शतम्॥',
  kuldeviBlessing: '॥ कुलदेवतायै नमः ॥ ॥ कुलदेवी प्रसन्ना ॥',

  weddingDateIso: '2027-03-20T19:15:00',
  weddingDateDisplay: 'शनिवार, 20 मार्च 2027',
  weddingMuhurat: 'शुभ लग्न एवं पाणिग्रहण: सायं 07:15 बजे (गोधूलि वेला)',

  venueName: 'राजमहल पैलेस एवं हेरिटेज वाटिका',
  venueAddress: 'लेक पिछोला रोड, हरदास जी की मगरी, उदयपुर, राजस्थान - 313001',
  googleMapsUrl: 'https://maps.google.com/?q=Lake+Pichola+Udaipur+Rajasthan',

  invitationGreeting: 'मान्यवर / आदरणीय स्वजन,',
  invitationMainText: 'परमपिता परमात्मा की असीम अनुकंपा एवं पूज्य पूर्वजों के शुभाशीर्वाद से हमारे प्रिय सुपुत्र चि. कबीर का पावन विवाह संस्कार आयु. आर्या (सुपुत्री श्रीमती सुनीता एवं श्री विजय कपूर) के साथ संपन्न होना निश्चित हुआ है।\n\nइस मांगलिक एवं पावन बेला पर आप सपरिवार पधारकर वर-वधू को अपने स्नेहिल आशीष एवं शुभकामनाओं से अनुगृहीत करें। आपकी गरिमामयी उपस्थिति हमारे इस आनंदोत्सव को द्विगुणित करेगी।',

  darshanabhilashi: 'समस्त शर्मा एवं कपूर परिवार के स्नेहीजन',
  swagatakankshi: 'चाचा-चाची, ताऊ-ताई, भाई-भाभी एवं समस्त सगे-संबंधी',
  balManuhar: 'मेरी चाचू की शादी में जलूल-जलूल आना! - नन्हे आरव, अन्या एवं काव्या',
  vinit: 'श्रीमती सरोज एवं श्री राजेंद्र शर्मा (मो. 98XXXXXXXX)',

  theme: 'royal_crimson',
  fontFamily: 'royal',
  musicUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',

  ceremonies: [
    {
      id: 'c-1',
      name: 'मातृका पूजन एवं गणेश स्थापना',
      subTitle: 'विघ्नहर्ता का पावन आह्वान',
      date: 'गुरुवार, 18 मार्च 2027',
      time: 'प्रातः 09:15 बजे',
      location: 'गृह परिसर / पूजा कक्ष',
      description: 'सर्वप्रथम भगवान श्री गणेश जी की प्रतिष्ठा एवं मातृका पूजन कर विवाह कार्य का निर्विघ्न शुभारंभ।',
      dressCode: 'पारंपरिक पीला/लाल कुर्ता-साड़ी',
      icon: 'ganesha',
      enabled: true
    },
    {
      id: 'c-2',
      name: 'हल्दी की रस्म',
      subTitle: 'उबटन, स्नेह एवं मंगलगान',
      date: 'शुक्रवार, 19 मार्च 2027',
      time: 'प्रातः 10:00 बजे',
      location: 'पूलसाइड लॉन, राजमहल वाटिका',
      description: 'चंदन-हल्दी का शुभ लेप, फूलों की पंखुड़ियों की वर्षा, ढोलक की थाप और मंगलमय हंसी-ठिठोली।',
      dressCode: 'पीतांबरी (हल्दी पीला परिधान)',
      icon: 'haldi',
      enabled: true
    },
    {
      id: 'c-3',
      name: 'मेहंदी उत्सव',
      subTitle: 'रंग गाढ़े प्यार के, धुन खुशियों की',
      date: 'शुक्रवार, 19 मार्च 2027',
      time: 'सायं 04:30 बजे',
      location: 'रॉयल गार्डेन लॉन',
      description: 'सुहाग की सलोनी मेहंदी, लाइव लोक संगीत, पारिवारिक नृत्य प्रस्तुतियां एवं स्वादिष्ट चाट-पकवान।',
      dressCode: 'हरा एवं फ्लोरल परिधान',
      icon: 'mehndi',
      enabled: true
    },
    {
      id: 'c-4',
      name: 'बारात प्रस्थान एवं स्वागत',
      subTitle: 'शाही ठाठ-बाट के साथ बारात आगमन',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'सायं 06:00 बजे',
      location: 'राजमहल पैलेस मुख्य द्वार',
      description: 'दूल्हे का सेहराबंदी, घोड़ी पर सवार होकर प्रस्थान एवं वधू पक्ष द्वारा पुष्पवर्षा व तोरण वंदन के साथ स्वागत।',
      dressCode: 'राजसी परिधान व साफा',
      icon: 'baraat',
      enabled: true
    },
    {
      id: 'c-5',
      name: 'वरमाला एवं जयमाला',
      subTitle: 'परस्पर वरण का मंगल क्षण',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'सायं 07:15 बजे',
      location: 'भव्य स्टेज, सेंट्रल कोर्टयार्ड',
      description: 'सुगंधित पुष्पों की वरमाला का आदान-प्रदान, आतिशबाजी एवं मंगल ध्वनि के बीच वर-वधू का स्वागत।',
      dressCode: 'शाही पारंपरिक परिधान',
      icon: 'varmala',
      enabled: true
    },
    {
      id: 'c-6',
      name: 'विवाह संस्कार एवं सात फेरे',
      subTitle: 'पवित्र अग्नि साक्षी सात जन्मों का पावन बंधन',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'रात्रि 08:30 बजे (शुभ लग्न)',
      location: 'पवित्र विवाह मंडप',
      description: 'वैदिक मंत्रोच्चार के मध्य कन्यादान, गठबंधन, पवित्र अग्नि के सम्मुख सात फेरे, सिंदूर दान व सप्तपदी।',
      dressCode: 'पवित्र पारंपरिक रेशमी वस्त्र',
      icon: 'phere',
      enabled: true
    },
    {
      id: 'c-7',
      name: 'भावभीनी विदाई',
      subTitle: 'आशीर्वाद एवं नयनों में स्नेहजल',
      date: 'रविवार, 21 मार्च 2027',
      time: 'प्रातःकाल (अरुणोदय वेला)',
      location: 'राजमहल पैलेस मुख्य द्वार',
      description: 'सजल नयनों और हृदयस्पर्शी आशीषों के साथ कुलवधू का ससुराल के लिए शुभ प्रस्थान।',
      dressCode: 'पारंपरिक वेशभूषा',
      icon: 'vidai',
      enabled: true
    }
  ],

  photos: [
    {
      id: 'p-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      caption: 'वर-वधू का स्नेहमयी रूप'
    },
    {
      id: 'p-2',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      caption: 'हल्दी व फूलों की रंगत'
    },
    {
      id: 'p-3',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      caption: 'सुहाग की सलोनी मेहंदी'
    }
  ],

  blessings: [
    {
      id: 'b-1',
      name: 'पं. रामेश्वर जी एवं परिवार',
      relation: 'पूज्य गुरुजन',
      message: 'वर-वधू को दाम्पत्य जीवन के इस मांगलिक अवसर पर अनंत शुभाशीर्वाद। भगवान श्री लक्ष्मीनारायण आपकी जोड़ी सदैव बनाए रखें!',
      timestamp: '2 घंटे पूर्व',
      attending: 'yes',
      guestsCount: 4
    }
  ]
};

export const defaultMuslimWeddingData: MuslimWeddingData = {
  category: 'muslim_wedding',
  id: 'draft-muslim-1',
  title: 'मोहम्मद ज़ैद संग आयशा सिद्दीकी - निकाह व वलीमा',
  updatedAt: new Date().toISOString(),

  groomName: 'मोहम्मद ज़ैद',
  brideName: 'आयशा सिद्दीकी',
  groomParents: 'फ़रज़ंद-ए-अज़ीज़: मोहतरमा परवीन एवं जनाब मोहम्मद रफ़ीक़ ख़ान',
  brideParents: 'दुख़्तर-ए-नेकअख्तर: मोहतरमा शबाना एवं जनाब तारिक़ सिद्दीकी',
  groomFamily: 'ख़ानदान: ख़ान व पठान परिवार (लखनऊ)',
  brideFamily: 'ख़ानदान: सिद्दीकी परिवार (दिल्ली)',

  bismillahText: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ',
  quranAyat: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  quranAyatTranslation: '“और उसकी निशानियों में से है कि उसने तुम्हारे लिए तुम्हारी ही जिन्स से जोड़े बनाए ताकि तुम्हें उनसे सुकून हासिल हो और तुम्हारे दरमियान मोहब्बत और रहमत पैदा की।” (सूरह अर-रूम: 21)',
  dawatHeading: 'दावत-ए-निकाह व वलीमा (Nikaah & Walima)',

  languageMode: 'hindi',

  weddingDateIso: '2027-04-11T19:30:00',
  weddingDateDisplay: 'रविवार, 11 अप्रैल 2027 (29 शव्वाल 1448 हिजरी)',
  nikahTimeDisplay: 'निकाह: शाम 07:30 बजे | दावत-ए-वलीमा: रात 08:30 बजे से',

  venueName: 'शाही नूर-महल बैंक्वेट्स',
  venueAddress: 'हज़रतगंज मेन रोड, विक्टोरिया स्ट्रीट के पास, लखनऊ, उत्तर प्रदेश - 226001',
  googleMapsUrl: 'https://maps.google.com/?q=Hazratganj+Lucknow',

  invitationGreeting: 'बा-अदब सलाम-ए-मसनून,',
  invitationMainText: 'अल्लाह तआला के फ़ज़्ल-ओ-करम से हमारे अज़ीज़ फ़र्जंद मोहम्मद ज़ैद का अक़्द-ए-निकाह मोहतरमा आयशा सिद्दीकी के साथ ब-खुश-ओ-खूबी तय पाया है।\n\nआप तमाम अज़ीज़ों, दोस्तों और अहबाब से पुरखुलूस गुज़ारिश है कि इस बा-बरकत तक़रीब में शिरकत फ़रमाकर दूल्हा और दुल्हन को अपनी दुआओं से नवाज़ें। आपकी आमद हमारे लिए बाइस-ए-मुसर्रत होगी।',

  chashmeBaraah: 'चश्म-ए-बराह (मुंतज़िर): ख़ानदान-ए-ख़ान व सिद्दीकी',
  daawatan: 'दावतीन: जनाब मोहम्मद रफ़ीक़ ख़ान व अहले ख़ाना',
  contactPhone: '+91 98765 43210',

  theme: 'emerald_gold',
  musicUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=1200&auto=format&fit=crop',

  events: [
    {
      id: 'me-1',
      name: 'रस्म-ए-हिना (मेंहदी)',
      nameUrdu: 'رسمِ حنا',
      date: 'शुक्रवार, 9 अप्रैल 2027',
      time: 'शाम 05:00 बजे',
      location: 'दौलत-कदा (निवास स्थान)',
      description: 'पारंपरिक मेंहदी, कव्वाली के तराने और ख़वातीन की जानिब से मुबारकबादी व दुआएं।',
      enabled: true
    },
    {
      id: 'me-2',
      name: 'बारात व इस्तकबाल',
      nameUrdu: 'بارات و استقبال',
      date: 'शनिवार, 10 अप्रैल 2027',
      time: 'शाम 06:30 बजे',
      location: 'शाही नूर-महल, लखनऊ',
      description: 'दूल्हा का बारात लेकर आमद और दुल्हन के ख़ानदान की तरफ से पुरजोश खैरमक़दम (इस्तकबाल)।',
      enabled: true
    },
    {
      id: 'me-3',
      name: 'अक़्द-ए-निकाह',
      nameUrdu: 'عقدِ نکاح',
      date: 'शनिवार, 10 अप्रैल 2027',
      time: 'शाम 07:45 बजे (बाद नमाज़-ए-मग़रिब)',
      location: 'नूर-महल सेंट्रल हॉल',
      description: 'उलेमा-ए-किराम की मौजूदगी में ईजाब-ओ-क़बूल और खुतबा-ए-निकाह की पाकीज़ा रस्म।',
      enabled: true
    },
    {
      id: 'me-4',
      name: 'रुख़सती',
      nameUrdu: 'رخصتی',
      date: 'शनिवार, 10 अप्रैल 2027',
      time: 'रात 11:00 बजे',
      location: 'शाही नूर-महल',
      description: 'दुआओं के साए में और नम आँखों से दुल्हन की नए घर के लिए रुख़सती।',
      enabled: true
    },
    {
      id: 'me-5',
      name: 'दावत-ए-वलीमा',
      nameUrdu: 'دعوتِ ولیمہ',
      date: 'रविवार, 11 अप्रैल 2027',
      time: 'रात 08:00 बजे से निरंतर',
      location: 'ग्रैंड रॉयल कोर्ट, लखनऊ',
      description: 'सुन्नते-रसूल के मुताबिक़ मेहमानों के लिए लज़ीज़ व शाही पकवानों की दावत-ए-वलीमा।',
      enabled: true
    }
  ],

  photos: [
    {
      id: 'mp-1',
      url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=800&auto=format&fit=crop',
      caption: 'अक़्द-ए-निकाह की हसीन यादगार'
    },
    {
      id: 'mp-2',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      caption: 'रस्म-ए-हिना के खूबसूरत रंग'
    }
  ],

  blessings: [
    {
      id: 'mb-1',
      name: 'जनाब हाफ़िज़ अहमद साहब',
      relation: 'अहबाब',
      message: 'माशाअल्लाह! अल्लाह तआला इस नए जोड़े की ज़िंदगी में बरकत, मोहब्बत और सुकून अता फ़रमाए। आमीन!',
      timestamp: '1 घंटा पूर्व',
      attending: 'yes',
      guestsCount: 3
    }
  ]
};

export const defaultBirthdayData: BirthdayData = {
  category: 'birthday',
  id: 'draft-birthday-1',
  title: 'आरव का 5वां जन्मदिन उत्सव!',
  updatedAt: new Date().toISOString(),

  celebrantName: 'आरव शर्मा',
  age: '5वां जन्मदिन',
  celebrantBio: 'हमारा नन्हा राजकुमार अब 5 साल का होने जा रहा है!',

  birthdayType: 'kid',
  theme: 'colorful_balloons',

  partyDateIso: '2027-05-15T17:30:00',
  partyDateDisplay: 'शनिवार, 15 मई 2027',
  partyTimeDisplay: 'शाम 05:30 बजे से रात 09:30 बजे तक',

  venueName: 'वंडरलैंड किड्स प्ले ज़ोन एवं पार्टी क्लब',
  venueAddress: 'प्लॉट 42, पार्क स्ट्रीट, सिटी मॉल के सामने, नई दिल्ली - 110001',
  googleMapsUrl: 'https://maps.google.com/?q=Connaught+Place+New+Delhi',

  invitationGreeting: 'प्यारे दोस्तों एवं परिवारजनों,',
  invitationMainText: 'हमारे लाडले आरव के 5वें जन्मदिन के खास मौके पर हम एक धमाकेदार पार्टी आयोजित कर रहे हैं! 🎈🎂\n\nआप सभी सादर आमंत्रित हैं। आइए, ढेर सारे गेम्स, मैजिक शो, स्वादिष्ट स्नैक्स, केक कटिंग और मस्ती से भरे इस दिन को यादगार बनाएं!',

  dressCode: 'कलरफुल व पार्टी वेयर (सुपरहीरो / कार्टून थीम स्वागत योग्य)',
  hostsName: 'नेहा एवं रोहित शर्मा (माता-पिता)',
  rsvpContact: 'रोहित: 98765 XXXXX | नेहा: 98123 XXXXX',

  musicUrl: '',
  heroImageUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=1200&auto=format&fit=crop',

  activities: [
    {
      id: 'ba-1',
      title: 'स्वागत एवं फन गेम्स',
      time: 'शाम 05:30 बजे',
      description: 'टैटू मेकिंग, म्यूजिकल चेयर, बैलून ट्विस्टिंग और बच्चों के मजेदार खेल।',
      enabled: true
    },
    {
      id: 'ba-2',
      title: 'जादू का खेल (मैजिक शो)',
      time: 'शाम 06:30 बजे',
      description: 'मशहूर मैजिशियन द्वारा बच्चों और बड़ों के लिए रोमांचक मैजिक परफॉर्मेंस।',
      enabled: true
    },
    {
      id: 'ba-3',
      title: 'केक कटिंग समारोह',
      time: 'शाम 07:30 बजे',
      description: 'बर्थडे सॉन्ग, कैंडल ब्लोइंग और केक कटिंग के साथ आरव को जन्मदिन की बधाई!',
      enabled: true
    },
    {
      id: 'ba-4',
      title: 'डीजे डांस एवं डिनर',
      time: 'रात 08:15 बजे से',
      description: 'बच्चों व पैरेंट्स के लिए डांस फ्लोर और स्वादिष्ट पार्टी बुफे डिनर।',
      enabled: true
    }
  ],

  photos: [
    {
      id: 'bp-1',
      url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop',
      caption: 'गुब्बारों की रंगीन दुनिया'
    },
    {
      id: 'bp-2',
      url: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
      caption: 'पार्टी सेलिब्रेशन और केक'
    }
  ],

  wishes: [
    {
      id: 'bw-1',
      name: 'चाचू एवं चाची (अमित व प्रिया)',
      relation: 'चाचा-चाची',
      message: 'हैप्पी बर्थडे लिटिल चैंप आरव! तुम्हें दुनिया की सारी खुशियां और खिलौने मिलें! 🎂🎁🚀',
      timestamp: '3 घंटे पूर्व',
      attending: 'yes',
      guestsCount: 2
    }
  ]
};
