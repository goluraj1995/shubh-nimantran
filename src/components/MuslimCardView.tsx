import React, { useState } from 'react';
import { MuslimWeddingData, GuestBlessingOrWish, AnyInvitationData } from '../types/invitation';
import { CountdownTimer } from './CountdownTimer';
import { PhotoGallery } from './PhotoGallery';
import { cardAudio } from '../utils/audio';
import { CrescentStarIcon, BismillahCalligraphy } from './IslamicMotifs';
import { computeCardStyles } from '../utils/cardStyleHelper';
import { exportCardAsImage, exportCardAsPdf } from '../utils/exportCard';
import { generatePublicShareUrl, getWhatsAppShareMessage, checkIsPublicGuest } from '../utils/shareInvitation';
import { ShareInvitationModal } from './ShareInvitationModal';
import { ButterflyAnimation } from './ButterflyAnimation';
import {
  Volume2, VolumeX, Edit3, Share2, MapPin,
  Navigation, Check, Copy, ArrowLeft, Clock, Calendar, Heart, Send, CheckCircle2, MessageSquare, Download, Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MuslimCardViewProps {
  data: MuslimWeddingData;
  isReadOnly?: boolean;
  onOpenEdit: () => void;
  onAddBlessing: (blessing: GuestBlessingOrWish) => void;
  onReopenEnvelope: () => void;
  onBackToHome: () => void;
  onCardUpdated?: (card: AnyInvitationData) => void;
  cardButterflyEnabled?: boolean;
  butterflyStyle?: any;
  butterflyCount?: any;
  butterflySize?: any;
}

export const MuslimCardView: React.FC<MuslimCardViewProps> = ({
  data,
  onOpenEdit,
  onAddBlessing,
  onReopenEnvelope,
  onBackToHome,
  onCardUpdated,
  isReadOnly = false,
  cardButterflyEnabled = true,
  butterflyStyle = 'natural_flying',
  butterflyCount = 'medium',
  butterflySize = 'normal'
}) => {
  const isPublicGuest = checkIsPublicGuest(isReadOnly, data);

  const [isPlayingMusic, setIsPlayingMusic] = useState(cardAudio.isPlaying());
  const [language, setLanguage] = useState<'hindi' | 'urdu' | 'english'>(data.languageMode || 'hindi');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShare = () => {
    if (isPublicGuest) return;
    setIsShareModalOpen(true);
  };

  // Wishes Form States
  const [guestName, setGuestName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const styles = computeCardStyles(data.design, 'muslim_wedding', data.theme);

  const { url: publicShareUrl } = generatePublicShareUrl(data);
  const whatsAppShareText = getWhatsAppShareMessage(data, publicShareUrl);
  const whatsAppShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppShareText)}`;

  const audioUrlToPlay = data.musicSettings?.mode === 'none'
    ? undefined
    : (data.musicSettings?.audioUrl || data.musicUrl);

  const toggleAudio = () => {
    if (data.musicSettings?.mode === 'none') return;
    const playing = cardAudio.toggle('muslim_wedding', audioUrlToPlay);
    setIsPlayingMusic(playing);
  };

  const activeEvents = data.events.filter((e) => e.enabled !== false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCardImage = async () => {
    setIsExporting(true);
    try {
      await exportCardAsImage('card-render-container', `nikah_card_${data.groomName}_${data.brideName}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCardPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportCardAsPdf('card-render-container', `nikah_card_${data.groomName}_${data.brideName}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newBlessing: GuestBlessingOrWish = {
      id: `m-blessing-${Date.now()}`,
      name: guestName.trim(),
      relation: relation.trim() || 'अहबाब / शुभचिंतक',
      message: message.trim() || 'माशाअल्लाह! अल्लाह तआला इस जोड़े को खुशियों व बरकतों से नवाज़े। आमीन!',
      timestamp: 'अभी-अभी'
    };

    onAddBlessing(newBlessing);
    setIsSubmitted(true);

    confetti({
      particleCount: 85,
      spread: 100,
      origin: { y: 0.7 },
      colors: ['#059669', '#10b981', '#d4af37', '#fef08a', '#ffffff']
    });
  };

  const isRtl = language === 'urdu' || styles.isUrdu;

  return (
    <div
      style={styles.containerStyle}
      className="min-w-full min-h-screen bg-islamic-pattern pb-24 text-[#064e3b] font-devanagari-serif selection:bg-[#d4af37]/40 selection:text-[#064e3b]"
    >
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 bg-[#064e3b] border-b-2 border-[#d4af37] shadow-lg">
        {/* Moroccan Geometric Ribbon */}
        <div className="h-3 w-full bg-gradient-to-r from-[#d4af37] via-[#10b981] to-[#d4af37] flex items-center justify-around overflow-hidden opacity-90">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="text-[#064e3b] text-[9px]">✦</span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between text-[#fdfbf7]">
          <div className="flex items-center gap-2">
            {!isPublicGuest && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-full hover:bg-black/30 text-[#ffd700] transition-colors"
                title="मुख्य स्क्रीन पर वापस जाएँ"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <CrescentStarIcon size={24} />
            <div>
              <span className="font-devanagari-royal font-bold text-sm sm:text-base text-[#ffd700] block leading-tight">
                {data.groomName} संग {data.brideName}
              </span>
              <span className="text-[10px] text-emerald-200 hidden sm:inline-block">
                निकाह: {data.weddingDateDisplay}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Download Image Button */}
            <button
              onClick={handleExportCardImage}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#ffd700] bg-[#022c22] border border-[#d4af37] rounded-full shadow-sm hover:bg-[#064e3b] transition-all"
              title="कार्ड की फ़ोटो (Image) डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isExporting ? 'लोडिंग...' : 'इमेज'}</span>
            </button>

            {/* Print PDF */}
            <button
              onClick={handleExportCardPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-stone-800 border border-stone-500 rounded-full shadow-sm hover:bg-black transition-all disabled:opacity-50"
              title="PDF डाउनलोड करें"
            >
              <Printer className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">{isExportingPdf ? 'PDF...' : 'PDF'}</span>
              <span className="sm:hidden">{isExportingPdf ? '...' : 'PDF'}</span>
            </button>

            {/* Language Switcher (हिंदी / اُردُو / English) */}
            <div className="flex items-center bg-[#022c22] rounded-full border border-[#d4af37]/60 p-0.5 text-xs font-bold text-[#fef08a]">
              <button
                onClick={() => setLanguage('hindi')}
                className={`px-2 py-1 rounded-full transition-all ${language === 'hindi' ? 'bg-[#059669] text-white shadow' : 'hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                onClick={() => setLanguage('urdu')}
                className={`px-2 py-1 rounded-full font-urdu transition-all ${language === 'urdu' ? 'bg-[#059669] text-white shadow' : 'hover:text-white'}`}
              >
                اُردُو
              </button>
              <button
                onClick={() => setLanguage('english')}
                className={`px-2 py-1 rounded-full transition-all ${language === 'english' ? 'bg-[#059669] text-white shadow' : 'hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Audio Toggle (Sufi Melody) */}
            <button
              onClick={toggleAudio}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#d4af37]/70 bg-[#022c22]/90 hover:bg-[#064e3b] text-[#ffd700] text-xs transition-colors shadow-sm active:scale-95"
              title="सूफ़ी संगीत चालू / बंद"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                  <span className="hidden sm:inline">सूफ़ी धुन चालू</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">सूफ़ी धुन सुनें</span>
                </>
              )}
            </button>

            <button
              onClick={onReopenEnvelope}
              className="px-2.5 py-1.5 text-xs text-[#fdfbf7] bg-[#047857] hover:bg-[#065f46] border border-[#d4af37]/60 rounded-full transition-colors hidden md:inline-flex"
            >
              लिफाफा
            </button>

            {!isPublicGuest && (
              <button
                onClick={handleOpenShare}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-devanagari-royal font-bold text-[#ffd700] bg-[#022c22] border border-[#d4af37] rounded-full shadow-sm hover:bg-[#064e3b] transition-all active:scale-95"
                title="कार्ड अलग से शेयर करें (WhatsApp, लिंक, इमेज)"
              >
                <Share2 className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>शेयर</span>
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-devanagari-royal font-bold text-[#ffd700] bg-gradient-to-r from-[#047857] to-[#065f46] border border-[#d4af37] rounded-full shadow-md hover:from-[#064e3b] hover:to-[#047857] transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>एडिटर (Edit)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Islamic Card Body */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        <div
          id="card-render-container"
          dir={isRtl ? 'rtl' : 'ltr'}
          style={styles.cardPaperStyle}
          className={`border-3 border-[#d4af37] rounded-3xl p-5 sm:p-10 shadow-2xl card-paper-islamic relative overflow-visible ${
            isRtl ? 'font-urdu' : 'font-devanagari-serif'
          }`}
        >
          <ButterflyAnimation
            enabled={cardButterflyEnabled}
            styleType={butterflyStyle}
            countLevel={butterflyCount}
            sizeLevel={butterflySize}
            isCard={true}
          />
          {/* Inner Geometric Gold Arch Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-[#d4af37]/50 rounded-2xl pointer-events-none"></div>

          {/* Bismillah & Crescent Star */}
          <div className="relative text-center my-3">
            <CrescentStarIcon size={64} className="mx-auto mb-2 animate-sacred-seal" />
            <BismillahCalligraphy size="lg" className="my-2" />

            {/* Quranic Ayat Box */}
            <div className="my-4 max-w-xl mx-auto bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37]/60 rounded-2xl p-4 shadow-inner text-center">
              <p className="font-urdu text-base sm:text-xl text-[#064e3b] font-bold leading-relaxed mb-1" dir="rtl">
                {data.quranAyat}
              </p>
              <p className="text-xs font-devanagari-serif text-emerald-900 italic mt-1 font-medium">
                {data.quranAyatTranslation}
              </p>
            </div>
          </div>

          {/* Guest Personalization Banner */}
          {data.personalGuestName && (
            <div className="my-4 p-3 bg-gradient-to-r from-emerald-100/50 via-emerald-100/70 to-emerald-100/50 border-2 border-[#d4af37] rounded-2xl text-center shadow-md">
              <p className="text-[11px] font-devanagari-royal tracking-widest text-[#064e3b] font-bold">✦ दावत-ए-खास / सादर आमंत्रण ✦</p>
              <p className="text-base sm:text-lg font-devanagari-royal font-bold text-[#064e3b] mt-0.5">
                मोहतरम {data.personalGuestName} साहब / साहिबा
              </p>
              <p className="text-xs text-emerald-950 font-devanagari-serif font-medium">तशरीफ़ लाकर बाइस-ए-मसर्रत फरमाएं</p>
            </div>
          )}

          {/* Dawat-e-Nikaah Heading */}
          <div className={`${styles.textAlignmentClass} my-6`}>
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
              <span
                style={{ color: styles.textColorStyle }}
                className="font-devanagari-royal text-base sm:text-xl font-bold px-4 py-1.5 bg-[#f0fdf4] border-2 border-[#d4af37] rounded-full shadow-sm"
              >
                ✦ {data.dawatHeading} ✦
              </span>
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
            </div>
            <p className="text-xs font-devanagari-serif text-emerald-800 mt-2 font-medium">
              بِسْمِ اللهِ – निकाह के इस पुरमसर्रत मौके पर आपकी तशरीफ़आवरी हमारे लिए बाइस-ए-मुसर्रत होगी
            </p>
          </div>

          {/* Bride & Groom Details */}
          <div className={`my-8 ${styles.textAlignmentClass} space-y-6`}>
            {/* Groom (दूल्हा) */}
            <div className="p-4 bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span
                style={{ color: styles.accentColorStyle }}
                className="text-[11px] font-devanagari-serif font-bold uppercase tracking-wider block"
              >
                दूल्हा (फ़रज़ंद-ए-अज़ीज़)
              </span>
              <h1
                style={{
                  color: styles.textColorStyle,
                  textShadow: styles.textShadowStyle,
                  filter: styles.textOutlineStyle
                }}
                className="text-3xl sm:text-5xl font-devanagari-royal font-bold my-1 drop-shadow"
              >
                {data.groomName}
              </h1>
              <p className="text-xs sm:text-sm font-devanagari-serif text-emerald-900 font-bold">
                {data.groomParents}
              </p>
              {data.groomFamily && (
                <p className="text-xs font-devanagari-serif text-stone-600 mt-0.5">
                  {data.groomFamily}
                </p>
              )}
            </div>

            {/* Hamrah / Sang */}
            <div className="flex items-center justify-center gap-3">
              <span className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#059669]"></span>
              <div
                style={{ backgroundColor: styles.textColorStyle }}
                className="w-12 h-12 rounded-full border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] font-devanagari-royal font-bold text-sm shadow-md animate-islamic-seal"
              >
                हमराह
              </div>
              <span className="w-16 h-[2px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#059669]"></span>
            </div>

            {/* Bride (दुल्हन) */}
            <div className="p-4 bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span
                style={{ color: styles.accentColorStyle }}
                className="text-[11px] font-devanagari-serif font-bold uppercase tracking-wider block"
              >
                दुल्हन (दुख़्तर-ए-नेकअख्तर)
              </span>
              <h1
                style={{
                  color: styles.textColorStyle,
                  textShadow: styles.textShadowStyle,
                  filter: styles.textOutlineStyle
                }}
                className="text-3xl sm:text-5xl font-devanagari-royal font-bold my-1 drop-shadow"
              >
                {data.brideName}
              </h1>
              <p className="text-xs sm:text-sm font-devanagari-serif text-emerald-900 font-bold">
                {data.brideParents}
              </p>
              {data.brideFamily && (
                <p className="text-xs font-devanagari-serif text-stone-600 mt-0.5">
                  {data.brideFamily}
                </p>
              )}
            </div>
          </div>

          {/* Invitation Message */}
          <div className={`my-8 p-5 sm:p-6 bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37] rounded-2xl ${styles.textAlignmentClass} space-y-3 shadow-inner`}>
            <h3
              style={{ color: styles.textColorStyle }}
              className="font-devanagari-royal font-bold text-base"
            >
              {data.invitationGreeting}
            </h3>
            <p className="text-xs sm:text-sm font-devanagari-serif text-stone-800 leading-relaxed whitespace-pre-line">
              {data.invitationMainText}
            </p>
          </div>

          {/* Portrait Photo with Transform */}
          {data.heroImageUrl && (
            <div className="my-8 max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden border-3 border-[#d4af37] shadow-xl relative group bg-stone-900">
              <img
                src={data.heroImageUrl}
                alt="दूल्हा व दुल्हन"
                style={styles.photoTransformStyle}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-center p-4 pointer-events-none">
                <span className="text-[#ffd700] text-xs font-devanagari-royal tracking-wider bg-[#064e3b]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#d4af37]">
                  निकाह: {data.weddingDateDisplay}
                </span>
              </div>
            </div>
          )}

          {/* Live Countdown */}
          <CountdownTimer
            targetDateIso={data.weddingDateIso}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Wedding Events Section (Nikah & Walima - Only Selected Events) */}
          <section className="my-10 space-y-5">
            <div className="text-center">
              <h3 className="font-devanagari-royal font-bold text-lg text-[#064e3b]">
                ✦ तक़ारीब-ए-निकाह व वलीमा शेड्यूल ✦
              </h3>
              <p className="text-xs text-stone-600 mt-0.5">
                मुबारक रस्मों व दावत का मुकम्मल प्रोग्राम
              </p>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-2"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37]/70 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-2 text-left"
                >
                  <div className="flex items-center justify-between border-b border-[#d4af37]/40 pb-2">
                    <div>
                      <h4 className="font-devanagari-royal font-bold text-sm text-[#064e3b]">
                        {evt.name}
                      </h4>
                      {evt.nameUrdu && (
                        <span className="font-urdu text-xs text-[#059669] block" dir="rtl">
                          {evt.nameUrdu}
                        </span>
                      )}
                    </div>
                    <span className="p-1 bg-[#064e3b] text-[#ffd700] rounded-full text-xs">
                      ✦
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-stone-700">
                    <p className="flex items-center gap-1.5 font-bold text-emerald-900">
                      <Calendar className="w-3.5 h-3.5 text-[#059669]" />
                      <span>{evt.date}</span>
                    </p>
                    <p className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <Clock className="w-3.5 h-3.5 text-[#059669]" />
                      <span>{evt.time}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-stone-600">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>{evt.location}</span>
                    </p>
                  </div>

                  {evt.description && (
                    <p className="text-[11px] text-stone-600 italic bg-white/70 p-2 rounded-xl border border-stone-200">
                      {evt.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Family Pillars (चश्म-ए-बराह, दावतीन) */}
          <div className="my-10 space-y-4">
            <div className="text-center">
              <h3 className="font-devanagari-royal font-bold text-base text-[#064e3b]">
                ✦ चश्म-ए-बराह व दावतीन ✦
              </h3>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-1 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3.5 bg-[#f0fdf4] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#064e3b] text-xs block mb-1">
                  चश्म-ए-बराह (इंतजार में):
                </span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {data.chashmeBaraah}
                </p>
              </div>

              <div className="p-3.5 bg-[#f0fdf4] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#064e3b] text-xs block mb-1">
                  दावतीन / मुंतज़मीन (इंतज़ामिया):
                </span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {data.daawatan}
                </p>
                {data.contactPhone && (
                  <p className="text-[11px] text-emerald-800 font-bold mt-2">
                    राबता (Phone): {data.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Venue & Directions */}
          <div className="my-10 p-5 bg-gradient-to-b from-[#f0fdf4] to-[#e6f4ea] border-2 border-[#d4af37] rounded-2xl text-center space-y-3 shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#064e3b] text-[#ffd700] mx-auto flex items-center justify-center shadow">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-devanagari-royal font-bold text-lg text-[#064e3b]">
              {data.venueName}
            </h3>
            <p className="text-xs sm:text-sm font-devanagari-serif text-stone-700 max-w-md mx-auto">
              {data.venueAddress}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-[#064e3b] to-[#047857] text-[#ffd700] font-bold text-xs rounded-xl shadow hover:from-[#022c22] hover:to-[#064e3b] transition-all flex items-center gap-2 active:scale-95"
              >
                <Navigation className="w-4 h-4 text-[#ffd700]" />
                <span>Google Maps पर रास्ता देखें</span>
              </a>

              {!isPublicGuest && (
                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="px-5 py-2.5 bg-[#25d366] text-white font-bold text-xs rounded-xl shadow hover:bg-[#1faa53] transition-all flex items-center gap-2 active:scale-95 text-center"
                >
                  <Share2 className="w-4 h-4" />
                  <span>व्हाट्सएप पर शेयर करें</span>
                </button>
              )}

              {!isPublicGuest && (
                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="px-5 py-2.5 bg-[#022c22] text-[#ffd700] font-bold text-xs rounded-xl shadow hover:bg-[#064e3b] transition-all flex items-center gap-2 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>शेयरिंग हब (लिंक व इमेज)</span>
                </button>
              )}
            </div>
          </div>

          {/* Photo Gallery */}
          <PhotoGallery photos={data.photos} />

          {/* Footer Signature */}
          <div className="text-center mt-12 pt-6 border-t-2 border-[#d4af37]/40">
            <CrescentStarIcon size={36} className="mx-auto mb-2" />
            <p className="text-xs font-devanagari-royal text-stone-600 font-bold">
              आपकी आमद के मुंतज़िर
            </p>
            <p
              style={{ color: styles.textColorStyle }}
              className="text-2xl sm:text-3xl font-devanagari-royal font-bold mt-1"
            >
              {data.groomName} हमराह {data.brideName}
            </p>
            <p className="text-[11px] font-devanagari-serif text-stone-500 mt-1">
              بارک اللہ لکما وبارک علیکما وجمع بینکما فی خیر
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto sm:hidden">
        <div className="bg-[#022c22]/95 border-2 border-[#d4af37] backdrop-blur-md rounded-2xl px-3 py-2 shadow-2xl flex items-center justify-around text-[#ffd700] font-devanagari-serif">
          {!isPublicGuest && (
            <button
              onClick={handleOpenShare}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold"
            >
              <Share2 className="w-4 h-4 text-[#25d366]" />
              <span>व्हाट्सएप</span>
            </button>
          )}
          {!isPublicGuest && (
            <button onClick={handleOpenShare} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
              <Share2 className="w-4 h-4 text-[#ffd700]" />
              <span>शेयर</span>
            </button>
          )}
          <a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            <Navigation className="w-4 h-4 text-[#ffd700]" />
            <span>रास्ता देखें</span>
          </a>
          <button onClick={handleExportCardImage} disabled={isExporting} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            <Download className="w-4 h-4 text-[#ffd700]" />
            <span>इमेज</span>
          </button>
          <button onClick={handleExportCardPdf} disabled={isExportingPdf} className="flex flex-col items-center gap-0.5 text-[10px] font-bold" title="PDF डाउनलोड करें">
            <Printer className="w-4 h-4 text-[#ffd700]" />
            <span>{isExportingPdf ? '...' : 'PDF'}</span>
          </button>
          <button onClick={toggleAudio} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            {isPlayingMusic ? <Volume2 className="w-4 h-4 text-[#ffd700] animate-pulse" /> : <VolumeX className="w-4 h-4 text-emerald-300" />}
            <span>सूफ़ी धुन</span>
          </button>
          {!isPublicGuest && (
            <button onClick={onOpenEdit} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
              <Edit3 className="w-4 h-4 text-[#ffd700]" />
              <span>संपादित</span>
            </button>
          )}
        </div>
      </div>

      {/* Share Invitation Modal (Owner Mode Only) */}
      {!isPublicGuest && isShareModalOpen && (
        <ShareInvitationModal
          card={data}
          onClose={() => setIsShareModalOpen(false)}
          onCardUpdated={onCardUpdated}
        />
      )}
    </div>
  );
};
