import React, { useState } from 'react';
import { HinduWeddingData, GuestBlessingOrWish, AnyInvitationData } from '../types/invitation';
import { ScratchCard } from './ScratchCard';
import { SaveTheDateCalendar } from './SaveTheDateCalendar';
import { CountdownTimer } from './CountdownTimer';
import { HinduRitualsSection } from './HinduRitualsSection';
import { PhotoGallery } from './PhotoGallery';
import { cardAudio } from '../utils/audio';
import { GaneshaIcon, MangalKalashIcon } from './GaneshaIcon';
import { computeCardStyles } from '../utils/cardStyleHelper';
import { exportCardAsImage, exportCardAsPdf } from '../utils/exportCard';
import { generatePublicShareUrl, getWhatsAppShareMessage, checkIsPublicGuest } from '../utils/shareInvitation';
import { ShareInvitationModal } from './ShareInvitationModal';
import { ButterflyAnimation } from './ButterflyAnimation';
import {
  Volume2, VolumeX, Edit3, Share2, MapPin,
  Navigation, Check, Copy, Flame, ArrowLeft, Download, Printer
} from 'lucide-react';

interface HinduCardViewProps {
  data: HinduWeddingData;
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

export const HinduCardView: React.FC<HinduCardViewProps> = ({
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
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const handleOpenShare = () => {
    if (isPublicGuest) return;
    setIsShareModalOpen(true);
  };

  const styles = computeCardStyles(data.design, 'hindu_wedding', data.theme, data.fontFamily);

  const { url: publicShareUrl } = generatePublicShareUrl(data);
  const whatsAppShareText = getWhatsAppShareMessage(data, publicShareUrl);
  const whatsAppShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppShareText)}`;

  const audioUrlToPlay = data.musicSettings?.mode === 'none'
    ? undefined
    : (data.musicSettings?.audioUrl || data.musicUrl);

  const toggleAudio = () => {
    if (data.musicSettings?.mode === 'none') return;
    const playing = cardAudio.toggle('hindu_wedding', audioUrlToPlay);
    setIsPlayingMusic(playing);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCardImage = async () => {
    setIsExporting(true);
    try {
      await exportCardAsImage('card-render-container', `shubh_vivah_${data.groomName}_${data.brideName}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCardPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportCardAsPdf('card-render-container', `shubh_vivah_${data.groomName}_${data.brideName}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div
      style={styles.containerStyle}
      className="min-w-full min-h-screen bg-mandap-texture pb-24 selection:bg-[#ffd700]/30 selection:text-[#520814]"
    >
      {/* Toran Header Banner */}
      <div className="sticky top-0 z-40 bg-[#7a0c1e] border-b-2 border-[#d4af37] shadow-lg">
        <div className="h-3 w-full bg-gradient-to-r from-[#ffd700] via-[#ff9933] to-[#ffd700] flex items-center justify-around overflow-hidden opacity-90">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="text-[#630514] text-[9px]">❖</span>
          ))}
        </div>

        {/* Top Navbar */}
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between text-[#fdf6e7]">
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
            <GaneshaIcon size={26} />
            <div>
              <span className="font-devanagari-royal font-bold text-sm sm:text-base text-[#ffd700] block leading-tight">
                {data.groomName} संग {data.brideName}
              </span>
              <span className="text-[10px] text-[#fcebb6] hidden sm:inline-block">
                शुभ विवाह: {data.weddingDateDisplay}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={handleExportCardImage}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#ffd700] bg-[#064e3b] border border-[#d4af37] rounded-full shadow-sm hover:bg-[#022c22] transition-all"
              title="कार्ड की फ़ोटो (Image) डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{isExporting ? 'इमेज बन रही है...' : 'इमेज'}</span>
            </button>

            <button
              onClick={handleExportCardPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-stone-800 border border-stone-500 rounded-full shadow-sm hover:bg-black transition-all disabled:opacity-50"
              title="कार्ड का PDF डाउनलोड करें"
            >
              <Printer className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">{isExportingPdf ? 'PDF...' : 'PDF'}</span>
              <span className="sm:hidden">{isExportingPdf ? '...' : 'PDF'}</span>
            </button>

            <button
              onClick={toggleAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37]/70 bg-[#4a020a]/80 hover:bg-[#380107] text-[#ffd700] text-xs transition-colors shadow-sm active:scale-95"
              title="शहनाई संगीत चालू / बंद"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                  <span className="hidden sm:inline">शहनाई चालू</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-300" />
                  <span className="hidden sm:inline">शहनाई सुनें</span>
                </>
              )}
            </button>

            <button
              onClick={onReopenEnvelope}
              className="px-2.5 py-1.5 text-xs text-[#fdf6e7] bg-[#54030f] hover:bg-[#3e020a] border border-[#d4af37]/60 rounded-full transition-colors hidden md:inline-flex"
            >
              लिफाफा
            </button>

            {!isPublicGuest && (
              <button
                onClick={handleOpenShare}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-devanagari-royal font-bold text-[#ffd700] bg-[#87091f] border border-[#d4af37] rounded-full shadow-sm hover:bg-[#630514] transition-all active:scale-95"
                title="कार्ड अलग से शेयर करें (WhatsApp, लिंक, इमेज)"
              >
                <Share2 className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>शेयर</span>
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-devanagari-royal font-bold text-[#ffd700] bg-gradient-to-r from-[#87091f] to-[#b22222] border border-[#d4af37] rounded-full shadow-md hover:from-[#630514] hover:to-[#87091f] transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>एडिटर (Edit)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Traditional Card Body */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        <div
          id="card-render-container"
          style={styles.cardPaperStyle}
          className="border-3 border-[#d4af37] rounded-3xl p-5 sm:p-10 shadow-2xl card-paper-traditional relative overflow-visible"
        >
          <ButterflyAnimation
            enabled={cardButterflyEnabled}
            styleType={butterflyStyle}
            countLevel={butterflyCount}
            sizeLevel={butterflySize}
            isCard={true}
          />
          <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-[#b8860b]/40 rounded-2xl pointer-events-none"></div>

          {/* Guest Personalization Banner */}
          {data.personalGuestName && (
            <div className="my-4 p-3 bg-gradient-to-r from-[#ffd700]/20 via-[#ffd700]/30 to-[#ffd700]/20 border-2 border-[#d4af37] rounded-2xl text-center shadow-md">
              <p className="text-[11px] font-devanagari-royal tracking-widest text-[#87091f] font-bold">॥ सादर सप्रेम निमंत्रण ॥</p>
              <p className="text-base sm:text-lg font-devanagari-royal font-bold text-[#87091f] mt-0.5">
                आदरणीय {data.personalGuestName.trim().endsWith('जी') || data.personalGuestName.trim().endsWith('जी सपरिवार') ? data.personalGuestName.trim() : `${data.personalGuestName.trim()} जी`}
              </p>
              <p className="text-xs text-stone-700 font-devanagari-serif font-medium">आप सपरिवार सादर आमंत्रित हैं</p>
            </div>
          )}

          {/* Ganesha & Headline */}
          <div className={`relative ${styles.textAlignmentClass} my-3`}>
            <div className="flex flex-col items-center justify-center">
              <GaneshaIcon size={76} className="mb-2" />
              <h2
                style={{
                  color: styles.textColorStyle,
                  textShadow: styles.textShadowStyle,
                  filter: styles.textOutlineStyle
                }}
                className="font-devanagari-royal text-xl sm:text-2xl font-bold tracking-wider drop-shadow-sm"
              >
                {data.headline}
              </h2>
              {data.kuldeviBlessing && (
                <p
                  style={{ color: styles.accentColorStyle }}
                  className="text-xs font-devanagari-serif font-bold mt-0.5"
                >
                  {data.kuldeviBlessing}
                </p>
              )}
            </div>

            <div className="my-3 max-w-lg mx-auto bg-[#fdf6e7]/90 border border-[#d4af37] rounded-2xl p-3 shadow-inner text-[#630514]">
              <p className="text-xs sm:text-sm font-devanagari-serif font-bold italic leading-relaxed whitespace-pre-line">
                "{data.shloka}"
              </p>
            </div>
          </div>

          {/* Sadar Aamantran */}
          <div className={`${styles.textAlignmentClass} my-6`}>
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
              <span
                style={{ color: styles.textColorStyle }}
                className="font-devanagari-royal text-base sm:text-xl font-bold px-3 py-1 bg-[#fdf6e7] border border-[#d4af37] rounded-full shadow-sm"
              >
                ॥ सादर आमंत्रण ॥
              </span>
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
            </div>
            <p className="text-xs font-devanagari-serif text-stone-700 mt-2 font-medium">
              मांगलिक परिणय संस्कार में आपकी स्नेहमयी उपस्थिति सादर प्रार्थनीय है
            </p>
          </div>

          {/* Couple & Family Details */}
          <div className={`my-8 ${styles.textAlignmentClass} space-y-6`}>
            {/* Groom Details */}
            <div className="p-4 bg-gradient-to-b from-[#fff6e6] to-[#fef0d7] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span
                style={{ color: styles.accentColorStyle }}
                className="text-[11px] font-devanagari-serif font-bold uppercase tracking-wider block"
              >
                वर (आयुष्मान्)
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
              <p className="text-xs sm:text-sm font-devanagari-serif text-[#630514] font-bold">
                {data.groomParents}
              </p>
              {data.groomGrandparents && (
                <p className="text-xs font-devanagari-serif text-stone-600 mt-0.5">
                  {data.groomGrandparents}
                </p>
              )}
            </div>

            {/* Sang Badge */}
            <div className="flex items-center justify-center gap-3">
              <span className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#87091f]"></span>
              <div
                style={{ backgroundColor: styles.textColorStyle }}
                className="w-12 h-12 rounded-full border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] font-devanagari-royal font-bold text-lg shadow-md animate-sacred-seal"
              >
                संग
              </div>
              <span className="w-16 h-[2px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#87091f]"></span>
            </div>

            {/* Bride Details */}
            <div className="p-4 bg-gradient-to-b from-[#fff6e6] to-[#fef0d7] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span
                style={{ color: styles.accentColorStyle }}
                className="text-[11px] font-devanagari-serif font-bold uppercase tracking-wider block"
              >
                वधू (आयुष्मती)
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
              <p className="text-xs sm:text-sm font-devanagari-serif text-[#630514] font-bold">
                {data.brideParents}
              </p>
              {data.brideGrandparents && (
                <p className="text-xs font-devanagari-serif text-stone-600 mt-0.5">
                  {data.brideGrandparents}
                </p>
              )}
            </div>
          </div>

          {/* Mangal Shloka */}
          <div className="my-6 p-4 bg-[#fdf8ef] border border-[#d4af37] rounded-2xl text-center space-y-1">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500 mx-auto animate-diya" />
            <p className="text-xs sm:text-sm font-devanagari-serif font-bold text-[#87091f] italic leading-relaxed whitespace-pre-line">
              "{data.mangalShloka}"
            </p>
          </div>

          {/* Invitation Message */}
          <div className={`my-8 p-5 sm:p-6 bg-gradient-to-b from-[#fdf6e7] to-[#fbf0da] border-2 border-[#d4af37] rounded-2xl ${styles.textAlignmentClass} space-y-3 shadow-inner`}>
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

          {/* Hero Portrait Photo with Real-Time Transform Controls */}
          {data.heroImageUrl && (
            <div className="my-8 max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden border-3 border-[#d4af37] shadow-xl relative group bg-stone-900">
              <img
                src={data.heroImageUrl}
                alt="वर एवं वधू"
                style={styles.photoTransformStyle}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-center p-4 pointer-events-none">
                <span className="text-[#ffd700] text-xs font-devanagari-royal tracking-wider bg-[#3a0208]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#d4af37]">
                  शुभ विवाह: {data.weddingDateDisplay}
                </span>
              </div>
            </div>
          )}

          {/* Scratch Card for Muhurat */}
          <ScratchCard
            revealedText={data.venueName}
            subText={data.weddingDateDisplay}
            muhuratText={data.weddingMuhurat}
          />

          {/* Live Countdown Timer */}
          <CountdownTimer
            targetDateIso={data.weddingDateIso}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Save The Date Calendar */}
          <SaveTheDateCalendar
            weddingDateIso={data.weddingDateIso}
            brideName={data.brideName}
            groomName={data.groomName}
            venueName={data.venueName}
            venueAddress={data.venueAddress}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Hindu Rituals Section (Only Selected Ceremonies) */}
          <HinduRitualsSection
            ceremonies={data.ceremonies.filter((c) => c.enabled !== false)}
            groomName={data.groomName}
            brideName={data.brideName}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Traditional Pillars (दर्शनाभिलाषी, स्वागताकांक्षी, बाल मनुहार, विनीत) */}
          <div className="my-10 space-y-4">
            <div className="text-center">
              <h3 className="font-devanagari-royal font-bold text-base text-[#87091f]">
                ॥ शुभाशीर्वाद एवं स्नेहीजन ॥
              </h3>
              <div className="w-16 h-0.5 bg-[#d4af37] mx-auto mt-1 mb-4"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              <div className="p-3.5 bg-[#fdf6e7] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#87091f] text-xs block mb-1">दर्शनाभिलाषी:</span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {data.darshanabhilashi}
                </p>
              </div>

              <div className="p-3.5 bg-[#fdf6e7] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#87091f] text-xs block mb-1">स्वागताकांक्षी:</span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {data.swagatakankshi}
                </p>
              </div>

              <div className="p-3.5 bg-[#fdf6e7] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#87091f] text-xs block mb-1">बाल मनुहार:</span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed italic">
                  "{data.balManuhar}"
                </p>
              </div>

              <div className="p-3.5 bg-[#fdf6e7] border border-[#d4af37] rounded-xl shadow-xs">
                <span className="font-bold text-[#87091f] text-xs block mb-1">विनीत:</span>
                <p className="text-xs text-stone-700 whitespace-pre-line leading-relaxed">
                  {data.vinit}
                </p>
              </div>
            </div>
          </div>

          {/* Venue & Google Maps Section */}
          <div className="my-10 p-5 bg-gradient-to-b from-[#fdf6e7] to-[#fbf0da] border-2 border-[#d4af37] rounded-2xl text-center space-y-3 shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#87091f] text-[#ffd700] mx-auto flex items-center justify-center shadow">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-devanagari-royal font-bold text-lg text-[#87091f]">
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
                className="px-5 py-2.5 bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] font-bold text-xs rounded-xl shadow hover:from-[#630514] hover:to-[#87091f] transition-all flex items-center gap-2 active:scale-95"
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
                  className="px-5 py-2.5 bg-[#064e3b] text-[#ffd700] font-bold text-xs rounded-xl shadow hover:bg-[#022c22] transition-all flex items-center gap-2 active:scale-95"
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
            <MangalKalashIcon size={40} className="mx-auto mb-2" />
            <p className="text-xs font-devanagari-royal text-stone-600 font-bold">
              आपकी गरिमामयी उपस्थिति की सादर प्रतीक्षा में
            </p>
            <p
              style={{ color: styles.textColorStyle }}
              className="text-2xl sm:text-3xl font-devanagari-royal font-bold mt-1"
            >
              {data.groomName} संग {data.brideName}
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto sm:hidden">
        <div className="bg-[#54030f]/95 border-2 border-[#d4af37] backdrop-blur-md rounded-2xl px-3 py-2 shadow-2xl flex items-center justify-around text-[#ffd700] font-devanagari-serif">
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
            {isPlayingMusic ? <Volume2 className="w-4 h-4 text-[#ffd700] animate-pulse" /> : <VolumeX className="w-4 h-4 text-stone-400" />}
            <span>शहनाई</span>
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
