import { WeddingData } from '../types/wedding';

export const defaultWeddingData: WeddingData = {
  headline: '॥ श्री गणेशाय नमः ॥',
  shloka: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
  mangalShloka: 'मांगल्यं तन्तुनानेन लोकजीवनहेतुना।\nकण्ठे बध्नामि सुभगे त्वं जीव शरदः शतम्॥',
  kuldeviBlessing: '॥ कुलदेवतायै नमः ॥ ॥ कुलदेवी प्रसन्ना ॥',

  // Groom Details (वर)
  groomName: 'चि. कबीर',
  groomParents: 'सुपुत्र: श्रीमती सरोज एवं श्री राजेंद्र शर्मा',
  groomGrandparents: 'पौत्र: श्रीमती एवं स्व. श्री रामगोपाल शर्मा',
  groomCity: 'उदयपुर, राजस्थान',

  // Bride Details (वधू)
  brideName: 'आयु. आर्या',
  brideParents: 'सुपुत्री: श्रीमती सुनीता एवं श्री विजय कपूर',
  brideGrandparents: 'पौत्री: श्रीमती एवं स्व. श्री दयाकिशन कपूर',
  brideCity: 'जयपुर, राजस्थान',

  // Wedding Date, Muhurat & Venue
  weddingDateIso: '2027-03-20T19:15:00',
  weddingDateDisplay: 'शनिवार, 20 मार्च 2027',
  weddingMuhurat: 'शुभ लग्न एवं पाणिग्रहण: सायं 07:15 बजे (गोधूलि वेला)',

  venueName: 'राजमहल पैलेस एवं हेरिटेज वाटिका',
  venueAddress: 'लेक पिछोला रोड, हरदास जी की मगरी, उदयपुर, राजस्थान - 313001',
  googleMapsUrl: 'https://maps.google.com/?q=Lake+Pichola+Udaipur+Rajasthan',
  googleMapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14511.956667500593!2d73.6766441!3d24.5753556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e56550e50f3b%3A0xe5a3c9e6e4f323a!2sLake%20Pichola!5e0!3m2!1sen!2sin!4v1700000000000',

  invitationGreeting: 'मान्यवर / आदरणीय स्वजन,',
  invitationMainText: 'परमपिता परमात्मा की असीम अनुकंपा एवं पूज्य पूर्वजों के शुभाशीर्वाद से हमारे प्रिय सुपुत्र चि. कबीर का पावन विवाह संस्कार आयु. आर्या (सुपुत्री श्रीमती सुनीता एवं श्री विजय कपूर) के साथ संपन्न होना निश्चित हुआ है।\n\nइस मांगलिक एवं पावन बेला पर आप सपरिवार पधारकर वर-वधू को अपने स्नेहिल आशीष एवं शुभकामनाओं से अनुगृहीत करें। आपकी गरिमामयी उपस्थिति हमारे इस आनंदोत्सव को द्विगुणित करेगी।',

  darshanabhilashi: 'समस्त शर्मा एवं कपूर परिवार के स्नेहीजन',
  swagatakankshi: 'चाचा-चाची, ताऊ-ताई, भाई-भाभी एवं समस्त सगे-संबंधी',
  balManuhar: 'मेरी चाचू की शादी में जलूल-जलूल आना! - नन्हे आरव, अन्या एवं काव्या',
  vinit: 'श्रीमती सरोज एवं श्री राजेंद्र शर्मा (मो. 98XXXXXXXX)',

  musicUrl: '', // Uses the Indian Shehnai & Sitar synthesizer by default
  heroImageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1200&auto=format&fit=crop',

  rituals: [
    {
      id: 'r-1',
      name: 'गणेश स्थापना एवं मातृका पूजन',
      subTitle: 'विघ्नहर्ता का पावन आह्वान',
      date: 'गुरुवार, 18 मार्च 2027',
      time: 'प्रातः 09:15 बजे',
      location: 'गृह परिसर / पूजा कक्ष',
      description: 'सर्वप्रथम भगवान श्री गणेश जी की प्रतिष्ठा, कुलदेवी व मातृका पूजन कर विवाह कार्य का निर्विघ्न शुभारंभ।',
      dressCode: 'पारंपरिक पीला या लाल कुर्ता/साड़ी',
      icon: 'ganesha',
      enabled: true
    },
    {
      id: 'r-2',
      name: 'मंडप रोपण एवं भात (मायरा)',
      subTitle: 'मातृपक्ष का स्नेह व मान-सम्मान',
      date: 'गुरुवार, 18 मार्च 2027',
      time: 'दोपहर 01:00 बजे',
      location: 'निवास स्थान प्रांगण',
      description: 'नानिहाल पक्ष का भव्य स्वागत, मायरा/भात अर्पण एवं मंडप की शुभ स्थापना।',
      dressCode: 'पारंपरिक चुनरी व राजस्थानी साफा',
      icon: 'mandap',
      enabled: true
    },
    {
      id: 'r-3',
      name: 'हल्दी की रस्म (उबटन एवं मंगलगान)',
      subTitle: 'सौंदर्य, स्नेह और मंगल गीतों का संगम',
      date: 'शुक्रवार, 19 मार्च 2027',
      time: 'प्रातः 10:00 बजे',
      location: 'पूलसाइड लॉन, राजमहल वाटिका',
      description: 'चंदन-हल्दी का शुभ लेप, फूलों की पंखुड़ियों की वर्षा, ढोलक की थाप और मंगलमय हंसी-ठिठोली।',
      dressCode: 'पीतांबरी (हल्दी पीला परिधान)',
      icon: 'haldi',
      enabled: true
    },
    {
      id: 'r-4',
      name: 'मेहंदी उत्सव एवं महिला संगीत',
      subTitle: 'रंग गाढ़े प्यार के, धुन खुशियों की',
      date: 'शुक्रवार, 19 मार्च 2027',
      time: 'सायं 04:30 बजे से',
      location: 'रॉयल गार्डेन लॉन',
      description: 'सुहाग की सलोनी मेहंदी, लाइव लोक संगीत, पारिवारिक नृत्य प्रस्तुतियां एवं स्वादिष्ट चाट-पकवान।',
      dressCode: 'हरा, पेस्टल एवं फ्लोरल परिधान',
      icon: 'mehndi',
      enabled: true
    },
    {
      id: 'r-5',
      name: 'निकासी एवं बारात प्रस्थान',
      subTitle: 'शाही ठाठ-बाट के साथ प्रस्थान',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'सायं 04:00 बजे',
      location: 'शर्मा निवास से प्रस्थान',
      description: 'दूल्हे का सेहराबंदी संस्कार, घोड़ी पर सवार होकर बारात का शाही अंदाज में प्रस्थान।',
      dressCode: 'रंगीन साफा एवं शेरवानी',
      icon: 'baraat',
      enabled: true
    },
    {
      id: 'r-6',
      name: 'बारात स्वागत, द्वारचार एवं तोरण',
      subTitle: 'सत्कार एवं सम्मुख मिलन',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'सायं 06:15 बजे',
      location: 'मुख्य प्रवेश द्वार, राजमहल पैलेस',
      description: 'वधू पक्ष द्वारा बारात का पुष्पवर्षा, इत्र एवं आरती के साथ आदरपूर्वक सत्कार व तोरण वंदन।',
      dressCode: 'राजसी परिधान',
      icon: 'baraat',
      enabled: true
    },
    {
      id: 'r-7',
      name: 'वरमाला एवं जयमाला समारोह',
      subTitle: 'परस्पर वरण का मंगल क्षण',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'सायं 07:00 बजे',
      location: 'भव्य स्टेज, सेंट्रल कोर्टयार्ड',
      description: 'सुगंधित पुष्पों की वरमाला का आदान-प्रदान, आतिशबाजी एवं तालियों की गूंज के बीच वर-वधू का स्वागत।',
      dressCode: 'शाही पारंपरिक परिधान',
      icon: 'varmala',
      enabled: true
    },
    {
      id: 'r-8',
      name: 'हस्तमिलाप एवं पाणिग्रहण संस्कार (सात फेरे)',
      subTitle: 'अग्नि साक्षी सात जन्मों का पावन बंधन',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'रात्रि 08:30 बजे (शुभ लग्न)',
      location: 'पवित्र विवाह मंडप',
      description: 'वैदिक मंत्रोच्चार के मध्य कन्यादान, गठबंधन, पवित्र अग्नि के सम्मुख सात फेरे, सिंदूर दान व सप्तपदी।',
      dressCode: 'पवित्र पारंपरिक रेशमी वस्त्र',
      icon: 'phere',
      enabled: true
    },
    {
      id: 'r-9',
      name: 'प्रीतिभोज (स्वागत भोज)',
      subTitle: 'अमृतमयी व्यंजनों का रसस्वादन',
      date: 'शनिवार, 20 मार्च 2027',
      time: 'रात्रि 08:00 बजे से निरंतर',
      location: 'रॉयल डाइनिंग एरिना',
      description: 'विशिष्ट पारंपरिक एवं आधुनिक शाही व्यंजनों का भव्य सामूहिक भोज।',
      dressCode: 'सुरुचिपूर्ण उत्सव परिधान',
      icon: 'preetibhoj',
      enabled: true
    },
    {
      id: 'r-10',
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

  gallery: [
    {
      id: 'g-1',
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800&auto=format&fit=crop',
      caption: 'वर-वधू का स्नेहमयी रूप',
      category: 'couple'
    },
    {
      id: 'g-2',
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
      caption: 'हल्दी व फूलों की रंगत',
      category: 'rituals'
    },
    {
      id: 'g-3',
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      caption: 'सुहाग की सलोनी मेहंदी',
      category: 'rituals'
    },
    {
      id: 'g-4',
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop',
      caption: 'पावन परिणय सूत्र एवं मंगल मुद्रिका',
      category: 'couple'
    },
    {
      id: 'g-5',
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
      caption: 'सपरिवार हंसी-खुशी के सुनहरे पल',
      category: 'family'
    },
    {
      id: 'g-6',
      url: 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?q=80&w=800&auto=format&fit=crop',
      caption: 'मंडप की जगमगाहट व उत्सव छटा',
      category: 'rituals'
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
    },
    {
      id: 'b-2',
      name: 'सतीश चंद्र शर्मा (मामा जी)',
      relation: 'मामा जी (जयपुर)',
      message: 'चि. कबीर और आयु. आर्या को विवाह की हार्दिक बधाई। पूरा ननिहाल परिवार मायरा और बारात में सम्मिलित होने को अति उत्साहित है!',
      timestamp: 'कल',
      attending: 'yes',
      guestsCount: 5
    },
    {
      id: 'b-3',
      name: 'डॉ. आलोक एवं सीमा वर्मा',
      relation: 'पारिवारिक मित्र',
      message: 'शर्मा परिवार को विवाह की कोटि-कोटि बधाई। नवदम्पति का जीवन सुख, शांति व आरोग्य से परिपूर्ण रहे।',
      timestamp: '3 दिन पूर्व',
      attending: 'yes',
      guestsCount: 2
    }
  ]
};
