import React, { useState } from 'react';
import { BirthdayData, GuestBlessingOrWish, AnyInvitationData } from '../types/invitation';
import { CountdownTimer } from './CountdownTimer';
import { PhotoGallery } from './PhotoGallery';
import { cardAudio } from '../utils/audio';
import { BirthdayCakeIcon, BalloonsClusterIcon } from './BirthdayMotifs';
import { computeCardStyles } from '../utils/cardStyleHelper';
import { exportCardAsImage, exportCardAsPdf } from '../utils/exportCard';
import { generatePublicShareUrl, getWhatsAppShareMessage, checkIsPublicGuest } from '../utils/shareInvitation';
import { ShareInvitationModal } from './ShareInvitationModal';
import { ButterflyAnimation } from './ButterflyAnimation';
import {
  Volume2, VolumeX, Edit3, Share2, MapPin,
  Navigation, Check, Copy, ArrowLeft, Clock, Calendar, Heart, Send, CheckCircle2, Gift, Sparkles, Download, Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BirthdayCardViewProps {
  data: BirthdayData;
  isReadOnly?: boolean;
  onOpenEdit: () => void;
  onAddWish: (wish: GuestBlessingOrWish) => void;
  onReopenEnvelope: () => void;
  onBackToHome: () => void;
  onCardUpdated?: (card: AnyInvitationData) => void;
  cardButterflyEnabled?: boolean;
  butterflyStyle?: any;
  butterflyCount?: any;
  butterflySize?: any;
}

export const BirthdayCardView: React.FC<BirthdayCardViewProps> = ({
  data,
  onOpenEdit,
  onAddWish,
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

  // Wishes Form States
  const [guestName, setGuestName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const styles = computeCardStyles(data.design, 'birthday', data.theme);

  const { url: publicShareUrl } = generatePublicShareUrl(data);
  const whatsAppShareText = getWhatsAppShareMessage(data, publicShareUrl);
  const whatsAppShareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppShareText)}`;

  const audioUrlToPlay = data.musicSettings?.mode === 'none'
    ? undefined
    : (data.musicSettings?.audioUrl || data.musicUrl);

  const toggleAudio = () => {
    if (data.musicSettings?.mode === 'none') return;
    const playing = cardAudio.toggle('birthday', audioUrlToPlay);
    setIsPlayingMusic(playing);
  };

  const activeActivities = data.activities.filter((a) => a.enabled !== false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleExportCardImage = async () => {
    setIsExporting(true);
    try {
      await exportCardAsImage('card-render-container', `birthday_card_${data.celebrantName}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCardPdf = async () => {
    setIsExportingPdf(true);
    try {
      await exportCardAsPdf('card-render-container', `birthday_card_${data.celebrantName}.pdf`);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    const newWish: GuestBlessingOrWish = {
      id: `b-wish-${Date.now()}`,
      name: guestName.trim(),
      relation: relation.trim() || 'मित्र / पारिवारिक स्नेही',
      message: message.trim() || `हैप्पी बर्थडे ${data.celebrantName}! ढेर सारा प्यार व शुभकामनाएं! 🎂🎁`,
      timestamp: 'अभी-अभी'
    };

    onAddWish(newWish);
    setIsSubmitted(true);

    confetti({
      particleCount: 110,
      spread: 120,
      origin: { y: 0.7 },
      colors: ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#8b5cf6', '#ffffff']
    });
  };

  return (
    <div
      style={styles.containerStyle}
      className="min-w-full min-h-screen bg-birthday-party pb-24 text-[#2c1810] font-birthday selection:bg-[#ec4899]/30 selection:text-[#831843]"
    >
      {/* Top Navbar */}
      <div className="sticky top-0 z-40 bg-gradient-to-r from-[#ec4899] via-[#8b5cf6] to-[#3b82f6] border-b-2 border-white/40 shadow-lg text-white">
        <div className="h-2.5 w-full bg-white/20 flex items-center justify-around overflow-hidden">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="text-[9px]">🎈</span>
          ))}
        </div>

        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!isPublicGuest && (
              <button
                onClick={onBackToHome}
                className="p-1.5 rounded-full hover:bg-black/20 text-white transition-colors"
                title="मुख्य स्क्रीन पर वापस जाएँ"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <BalloonsClusterIcon size={26} />
            <div>
              <span className="font-bold text-sm sm:text-base block leading-tight">
                {data.celebrantName} {data.age ? `(${data.age})` : ''}
              </span>
              <span className="text-[10px] text-pink-100 hidden sm:inline-block">
                {data.partyDateDisplay}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Download Image Button */}
            <button
              onClick={handleExportCardImage}
              disabled={isExporting}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-black/40 hover:bg-black/60 border border-white/60 rounded-full shadow-sm transition-all"
              title="कार्ड की फ़ोटो (Image) डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden md:inline">{isExporting ? 'लोडिंग...' : 'इमेज'}</span>
            </button>

            {/* Print PDF */}
            <button
              onClick={handleExportCardPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-white bg-stone-800 border border-stone-400 rounded-full shadow-sm hover:bg-black transition-all disabled:opacity-50"
              title="PDF डाउनलोड करें"
            >
              <Printer className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">{isExportingPdf ? 'PDF...' : 'PDF'}</span>
              <span className="sm:hidden">{isExportingPdf ? '...' : 'PDF'}</span>
            </button>

            <button
              onClick={toggleAudio}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/60 bg-black/30 hover:bg-black/50 text-white text-xs transition-colors shadow-sm active:scale-95"
              title="पार्टी म्यूजिक चालू / बंद"
            >
              {isPlayingMusic ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                  <span className="hidden sm:inline">पार्टी धुन</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-200" />
                  <span className="hidden sm:inline">म्यूजिक सुनें</span>
                </>
              )}
            </button>

            <button
              onClick={onReopenEnvelope}
              className="px-2.5 py-1.5 text-xs text-white bg-white/20 hover:bg-white/30 border border-white/60 rounded-full transition-colors hidden md:inline-flex"
            >
              गिफ़्ट बॉक्स खोलें
            </button>

            {!isPublicGuest && (
              <button
                onClick={handleOpenShare}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-black/40 hover:bg-black/60 border border-white/60 rounded-full shadow-sm transition-all active:scale-95"
                title="कार्ड अलग से शेयर करें (WhatsApp, लिंक, इमेज)"
              >
                <Share2 className="w-3.5 h-3.5 text-yellow-300" />
                <span>शेयर</span>
              </button>
            )}

            {!isPublicGuest && (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold text-white bg-[#f59e0b] hover:bg-[#d97706] border border-white/80 rounded-full shadow-md transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>एडिटर (Edit)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Birthday Card Body */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        <div
          id="card-render-container"
          style={styles.cardPaperStyle}
          className="border-3 border-[#f472b6] rounded-3xl p-5 sm:p-10 shadow-2xl card-paper-birthday relative overflow-visible"
        >
          <ButterflyAnimation 
            enabled={cardButterflyEnabled} 
            styleType={butterflyStyle}
            countLevel={butterflyCount}
            sizeLevel={butterflySize}
            isCard={true} 
          />
          {/* Inner Dashed Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-[#f472b6]/40 rounded-2xl pointer-events-none"></div>

          {/* Birthday Header Graphics */}
          <div className={`relative ${styles.textAlignmentClass} my-3`}>
            <div className="flex items-center justify-center gap-2 mb-2">
              {data.personalGuestName && (
              <div className="my-3 p-3 bg-gradient-to-r from-pink-100/60 via-amber-100/70 to-pink-100/60 border-2 border-pink-300 rounded-2xl text-center shadow-md w-full">
                <p className="text-[11px] font-bold tracking-widest text-pink-700 uppercase">🎉 Special Birthday Invitation 🎉</p>
                <p className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
                  Dear {data.personalGuestName}
                </p>
                <p className="text-xs text-stone-700 font-medium">You are warmly invited to celebrate with us!</p>
              </div>
            )}
            <BalloonsClusterIcon size={48} className="animate-float" />
              <BirthdayCakeIcon size={64} />
              <BalloonsClusterIcon size={48} className="animate-float" />
            </div>

            <p
              style={{ color: styles.accentColorStyle }}
              className="text-xs uppercase tracking-widest font-bold bg-pink-50 border border-pink-200 px-3 py-1 rounded-full inline-block"
            >
              🎉 It's Birthday Celebration Time! 🎂
            </p>

            <h1
              style={{
                color: styles.textColorStyle,
                textShadow: styles.textShadowStyle,
                filter: styles.textOutlineStyle
              }}
              className="text-3xl sm:text-5xl font-script-fun my-2 drop-shadow"
            >
              {data.celebrantName}
            </h1>

            {data.age && (
              <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#f472b6] to-[#8b5cf6] text-white font-bold text-sm sm:text-base rounded-full shadow-md my-1">
                ⭐ {data.age} ⭐
              </div>
            )}

            {data.celebrantBio && (
              <p className="text-xs text-stone-600 font-medium max-w-md mx-auto mt-2 italic">
                "{data.celebrantBio}"
              </p>
            )}
          </div>

          {/* Invitation Message Box */}
          <div className={`my-8 p-5 sm:p-6 bg-gradient-to-b from-[#fff1f2] to-[#fce7f3] border-2 border-[#f472b6] rounded-2xl ${styles.textAlignmentClass} space-y-3 shadow-inner`}>
            <h3
              style={{ color: styles.textColorStyle }}
              className="font-bold text-base"
            >
              {data.invitationGreeting}
            </h3>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line font-devanagari-serif">
              {data.invitationMainText}
            </p>
          </div>

          {/* Portrait Photo with Transform */}
          {data.heroImageUrl && (
            <div className="my-8 max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden border-3 border-[#ec4899] shadow-xl relative group bg-stone-900">
              <img
                src={data.heroImageUrl}
                alt="बर्थडे फोटो"
                style={styles.photoTransformStyle}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-center p-4 pointer-events-none">
                <span className="text-white text-xs font-bold tracking-wider bg-pink-600/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/40">
                  पार्टी तारीख: {data.partyDateDisplay}
                </span>
              </div>
            </div>
          )}

          {/* Countdown to Birthday */}
          <CountdownTimer
            targetDateIso={data.partyDateIso}
            weddingDateDisplay={data.partyDateDisplay}
          />

          {/* Party Highlights / Activities (Show ONLY selected ones!) */}
          <section className="my-14">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-pink-100 rounded-full border border-pink-300 shadow-sm mb-2">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-pink-700">
                  पार्टी के मुख्य आकर्षण
                </span>
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#8b5cf6]">
                पार्टी शेड्यूल व मस्ती
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-5 bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] border-2 border-[#f97316]/50 rounded-2xl shadow-sm flex flex-col justify-between space-y-2 text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-base text-[#c2410c]">{act.title}</span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-amber-200 text-amber-900 rounded-full">
                        {act.time}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed font-devanagari-serif">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Party Venue & Map Details */}
          <section className="my-12 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-3xl shadow-sm space-y-4 text-center">
            <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 block">
                पार्टी वेन्यू (स्थल)
              </span>
              <h3 className="text-2xl font-bold text-stone-800 mt-1">
                {data.venueName}
              </h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto mt-1 font-devanagari-serif">
                {data.venueAddress}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
              >
                <Navigation className="w-4 h-4 text-yellow-300" />
                <span>Google Maps पर रास्ता देखें</span>
              </a>

              {!isPublicGuest && (
                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="px-5 py-2.5 bg-[#25d366] hover:bg-[#1faa53] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 text-center"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर निमंत्रण भेजें</span>
                </button>
              )}

              {!isPublicGuest && (
                <button
                  type="button"
                  onClick={handleOpenShare}
                  className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-yellow-300" />
                  <span>शेयरिंग हब (लिंक व इमेज)</span>
                </button>
              )}
            </div>
          </section>

          {/* Hosts & Dress Code Information */}
          <div className="my-10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            <div className="p-4 bg-pink-50 border border-pink-200 rounded-2xl shadow-xs">
              <span className="text-xs font-bold text-pink-700 block mb-1">पार्टी होस्ट / माता-पिता:</span>
              <p className="text-xs text-stone-800 font-bold">{data.hostsName}</p>
              {data.rsvpContact && (
                <p className="text-[11px] text-stone-600 mt-1">RSVP / संपर्क: {data.rsvpContact}</p>
              )}
            </div>

            {data.dressCode && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl shadow-xs">
                <span className="text-xs font-bold text-purple-700 block mb-1">ड्रेस कोड (Dress Code):</span>
                <p className="text-xs text-stone-800 font-bold">{data.dressCode}</p>
              </div>
            )}
          </div>

          {/* Photo Gallery */}
          <PhotoGallery photos={data.photos} />

          {/* Wishes Section */}
          <section className="my-12 p-6 bg-white border-2 border-pink-300 rounded-3xl shadow-md space-y-6 text-left">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 p-1.5 px-3 rounded-full bg-pink-100 text-pink-800 text-xs font-bold mb-2">
                <Gift className="w-4 h-4 text-pink-600" />
                <span>बर्थडे शुभकामनाएं (Birthday Wishes)</span>
              </div>
              <h3 className="text-xl font-bold text-stone-800">
                {data.celebrantName} को अपनी प्यारी बधाई भेजें
              </h3>
            </div>

            {isSubmitted ? (
              <div className="p-5 bg-pink-50 border border-pink-300 rounded-2xl text-center text-pink-900 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-pink-600 mx-auto" />
                <h4 className="font-bold text-sm">धन्यवाद! आपकी शुभकामना दर्ज कर ली गई है! 🎉</h4>
                <p className="text-xs">पार्टी में आपसे मिलने का बेसब्री से इंतज़ार रहेगा।</p>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3.5 max-w-md mx-auto text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">आपका नाम *</label>
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="उदा. राहुल, स्नेहा, या शर्मा परिवार"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">संबंध / रिश्ता</label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="उदा. क्लासमेट, कजिन, पारिवारिक मित्र"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:border-pink-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">बर्थडे संदेश / विश</label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy Birthday! ढेर सारी खुशियां..."
                    className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 focus:border-pink-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>शुभकामना भेजें</span>
                </button>
              </form>
            )}

            {/* Wishes Feed */}
            <div className="pt-4 border-t border-pink-200 space-y-2">
              <span className="font-bold text-stone-700 text-xs block">
                दोस्तों व स्नेहीजनों की शुभकामनाएं ({data.wishes.length}):
              </span>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {data.wishes.map((w) => (
                  <div key={w.id} className="p-3 bg-pink-50/70 rounded-xl border border-pink-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 text-xs">{w.name}</span>
                      <span className="text-[10px] text-stone-400">{w.timestamp}</span>
                    </div>
                    {w.relation && (
                      <span className="text-[10px] text-pink-700 block font-medium">({w.relation})</span>
                    )}
                    <p className="text-xs text-stone-700 italic">"{w.message}"</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Share Invitation Bar (Owner Mode Only) */}
          {!isPublicGuest && (
            <section className="my-10 p-5 bg-gradient-to-r from-pink-100 to-purple-100 border border-pink-300 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-sm text-stone-800">
                  क्या आप दोस्तों व परिवार को यह निमंत्रण भेजना चाहते हैं?
                </h4>
                <p className="text-xs text-stone-600">
                  व्हाट्सएप या सोशल मीडिया पर सीधे कार्ड का लिंक शेयर करें।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={whatsAppShareLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#25d366] hover:bg-[#1faa53] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-sm active:scale-95 text-center"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-stone-600" />}
                  <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'कार्ड लिंक कॉपी करें'}</span>
                </button>
              </div>
            </section>
          )}

          {/* Footer Signature */}
          <div className="text-center mt-12 pt-6 border-t-2 border-pink-200">
            <BirthdayCakeIcon size={40} className="mx-auto mb-2" />
            <p className="text-xs text-stone-600 font-bold">
              पार्टी में आपकी मस्ती और उपस्थिति की प्रतीक्षा में!
            </p>
            <p
              style={{ color: styles.textColorStyle }}
              className="text-2xl sm:text-3xl font-script-fun font-bold mt-1"
            >
              {data.celebrantName}
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto sm:hidden">
        <div className="bg-purple-900/95 border-2 border-pink-300 backdrop-blur-md rounded-2xl px-3 py-2 shadow-2xl flex items-center justify-around text-white">
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
              <Share2 className="w-4 h-4 text-yellow-300" />
              <span>शेयर</span>
            </button>
          )}
          <a href={data.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            <Navigation className="w-4 h-4 text-yellow-300" />
            <span>रास्ता देखें</span>
          </a>
          <button onClick={handleExportCardImage} disabled={isExporting} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            <Download className="w-4 h-4 text-yellow-300" />
            <span>इमेज</span>
          </button>
          <button onClick={handleExportCardPdf} disabled={isExportingPdf} className="flex flex-col items-center gap-0.5 text-[10px] font-bold" title="PDF डाउनलोड करें">
            <Printer className="w-4 h-4 text-yellow-300" />
            <span>{isExportingPdf ? '...' : 'PDF'}</span>
          </button>
          <button onClick={toggleAudio} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
            {isPlayingMusic ? <Volume2 className="w-4 h-4 text-yellow-300 animate-pulse" /> : <VolumeX className="w-4 h-4 text-stone-300" />}
            <span>म्यूजिक</span>
          </button>
          {!isPublicGuest && (
            <button onClick={onOpenEdit} className="flex flex-col items-center gap-0.5 text-[10px] font-bold">
              <Edit3 className="w-4 h-4 text-yellow-300" />
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
