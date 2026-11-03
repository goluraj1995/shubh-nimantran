import React, { useState } from 'react';
import { WeddingData, GuestBlessing } from '../types/wedding';
import { ScratchCard } from './ScratchCard';
import { SaveTheDateCalendar } from './SaveTheDateCalendar';
import { CountdownTimer } from './CountdownTimer';
import { HinduRitualsSection } from './HinduRitualsSection';
import { PhotoGallery } from './PhotoGallery';
import { weddingAudio } from '../utils/audio';
import { checkIsPublicGuest } from '../utils/shareInvitation';
import { GaneshaIcon, MangalKalashIcon } from './GaneshaIcon';
import {
  Volume2, VolumeX, Edit3, Share2, MapPin,
  Sparkles, Navigation, Check, Copy, Flame, Heart
} from 'lucide-react';

interface WeddingCardProps {
  data: WeddingData;
  onOpenEdit: () => void;
  onAddBlessing: (blessing: GuestBlessing) => void;
  onReopenEnvelope: () => void;
}

export const WeddingCard: React.FC<WeddingCardProps> = ({
  data,
  onOpenEdit,
  onAddBlessing,
  onReopenEnvelope
}) => {
  const isPublicGuest = checkIsPublicGuest(false, data);
  const [isPlayingMusic, setIsPlayingMusic] = useState(weddingAudio.isPlaying());
  const [copiedLink, setCopiedLink] = useState(false);

  const toggleAudio = () => {
    const playing = weddingAudio.toggle(data.musicUrl);
    setIsPlayingMusic(playing);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🚩 *॥ श्री गणेशाय नमः ॥* 🚩\n\n` +
      `*सादर आमंत्रण - शुभ विवाह*\n\n` +
      `परमपिता परमात्मा के असीम आशीर्वाद से हमारे प्रिय:\n` +
      `*${data.groomName}*\n` +
      `(${data.groomParents})\n` +
      `     संग\n` +
      `*${data.brideName}*\n` +
      `(${data.brideParents})\n\n` +
      `का पावन विवाह संस्कार संपन्न होना निश्चित हुआ है।\n\n` +
      `📅 *विवाह तिथि:* ${data.weddingDateDisplay}\n` +
      `⏰ *शुभ मुहूर्त:* ${data.weddingMuhurat}\n` +
      `📍 *विवाह स्थल:* ${data.venueName}\n` +
      `${data.venueAddress}\n\n` +
      `आप सपरिवार पधारकर वर-वधू को अपना स्नेहमयी शुभाशीर्वाद प्रदान करें।\n\n` +
      `👉 *डिजिटल विवाह निमंत्रण पत्रिका व कार्यक्रम यहाँ देखें:*\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-w-full min-h-screen bg-mandap-texture pb-24 text-[#3d0c15] font-devanagari-serif selection:bg-[#ffd700]/30 selection:text-[#520814]">
      {/* Mango Leaves & Marigold Auspicious Toran Top Border */}
      <div className="sticky top-0 z-40 bg-[#7a0c1e] border-b-2 border-[#d4af37] shadow-lg">
        {/* Festive Toran Garland Graphic Banner */}
        <div className="h-3 w-full bg-gradient-to-r from-[#ffd700] via-[#ff9933] to-[#ffd700] flex items-center justify-around overflow-hidden opacity-90">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="text-[#630514] text-[9px]">❖</span>
          ))}
        </div>

        {/* Top Navbar */}
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between text-[#fdf6e7]">
          {/* Couple Badge */}
          <div className="flex items-center gap-2">
            <GaneshaIcon size={28} />
            <div>
              <span className="font-devanagari-royal font-bold text-sm sm:text-base text-[#ffd700] block leading-tight">
                {data.groomName} संग {data.brideName}
              </span>
              <span className="text-[10px] text-[#fcebb6] hidden sm:inline-block">
                शुभ विवाह: {data.weddingDateDisplay}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Audio Toggle (पारंपरिक शहनाई संगीत) */}
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

            {/* Reopen Envelope */}
            <button
              onClick={onReopenEnvelope}
              className="px-2.5 py-1.5 text-xs text-[#fdf6e7] bg-[#54030f] hover:bg-[#3e020a] border border-[#d4af37]/60 rounded-full transition-colors hidden md:inline-flex"
              title="लिफाफा पुनः देखें"
            >
              लिफाफा देखें
            </button>

            {/* Customize / Edit Button */}
            {!isPublicGuest && (
              <button
                onClick={onOpenEdit}
                className="flex items-center gap-1 px-3.5 py-1.5 text-xs font-devanagari-royal font-bold text-[#ffd700] bg-gradient-to-r from-[#87091f] to-[#b22222] border border-[#d4af37] rounded-full shadow-md hover:from-[#630514] hover:to-[#87091f] transition-all active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>बदलें (Customize)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Traditional Card Body */}
      <main className="max-w-3xl mx-auto px-3 sm:px-6 pt-6 sm:pt-10">
        <div className="bg-[#fffdf9] border-3 border-[#d4af37] rounded-3xl p-5 sm:p-10 shadow-2xl card-paper-traditional relative overflow-hidden">
          {/* Inner Dashed Gold Border */}
          <div className="absolute inset-2 sm:inset-3 border-2 border-dashed border-[#b8860b]/40 rounded-2xl pointer-events-none"></div>

          {/* Traditional Mangal Kalash & Ganesha Header */}
          <div className="relative text-center my-3">
            {/* Top Ganesha Icon with Aura */}
            <div className="flex flex-col items-center justify-center">
              <GaneshaIcon size={76} className="mb-2" />
              <h2 className="font-devanagari-royal text-xl sm:text-2xl text-[#87091f] font-bold tracking-wider drop-shadow-sm">
                {data.headline}
              </h2>
              {data.kuldeviBlessing && (
                <p className="text-xs font-devanagari-serif text-[#b8860b] font-bold mt-0.5">
                  {data.kuldeviBlessing}
                </p>
              )}
            </div>

            {/* Ganesh Shloka */}
            <div className="my-3 max-w-lg mx-auto bg-[#fdf6e7] border border-[#d4af37] rounded-2xl p-3 shadow-inner text-[#630514]">
              <p className="text-xs sm:text-sm font-devanagari-serif font-bold italic leading-relaxed whitespace-pre-line">
                "{data.shloka}"
              </p>
            </div>
          </div>

          {/* Mangal Parinay & Floral Divider */}
          <div className="text-center my-6">
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
              <span className="font-devanagari-royal text-base sm:text-xl text-[#87091f] font-bold px-3 py-1 bg-[#fdf6e7] border border-[#d4af37] rounded-full shadow-sm">
                ॥ सादर आमंत्रण ॥
              </span>
              <span className="w-12 sm:w-20 h-[1.5px] bg-[#d4af37]"></span>
            </div>
            <p className="text-xs font-devanagari-serif text-stone-700 mt-2 font-medium">
              मांगलिक परिणय संस्कार में आपकी स्नेहमयी उपस्थिति सादर प्रार्थनीय है
            </p>
          </div>

          {/* Couple Names & Family Details (वर एवं वधू) */}
          <div className="my-8 text-center space-y-6">
            {/* Groom Details (वर पक्ष) */}
            <div className="p-4 bg-gradient-to-b from-[#fff6e6] to-[#fef0d7] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span className="text-[11px] font-devanagari-serif font-bold text-[#b8860b] uppercase tracking-wider block">
                वर (आयुष्मान्)
              </span>
              <h1 className="text-3xl sm:text-5xl font-devanagari-royal text-[#7a0c1e] font-bold my-1 drop-shadow">
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
              {data.groomCity && (
                <p className="text-[11px] font-devanagari-serif text-stone-500 mt-0.5">
                  ({data.groomCity})
                </p>
              )}
            </div>

            {/* Sacred "संग" Badge with Floral Diya */}
            <div className="flex items-center justify-center gap-3">
              <span className="w-16 h-[2px] bg-gradient-to-r from-transparent via-[#d4af37] to-[#87091f]"></span>
              <div className="w-12 h-12 rounded-full bg-[#87091f] border-2 border-[#ffd700] flex items-center justify-center text-[#ffd700] font-devanagari-royal font-bold text-lg shadow-md animate-sacred-seal">
                संग
              </div>
              <span className="w-16 h-[2px] bg-gradient-to-l from-transparent via-[#d4af37] to-[#87091f]"></span>
            </div>

            {/* Bride Details (वधू पक्ष) */}
            <div className="p-4 bg-gradient-to-b from-[#fff6e6] to-[#fef0d7] border-2 border-[#d4af37] rounded-2xl shadow-sm">
              <span className="text-[11px] font-devanagari-serif font-bold text-[#b8860b] uppercase tracking-wider block">
                वधू (आयुष्मती)
              </span>
              <h1 className="text-3xl sm:text-5xl font-devanagari-royal text-[#7a0c1e] font-bold my-1 drop-shadow">
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
              {data.brideCity && (
                <p className="text-[11px] font-devanagari-serif text-stone-500 mt-0.5">
                  ({data.brideCity})
                </p>
              )}
            </div>
          </div>

          {/* Mangal Shloka Card */}
          <div className="my-6 p-4 bg-[#fdf8ef] border border-[#d4af37] rounded-2xl text-center space-y-1">
            <Flame className="w-5 h-5 text-amber-600 fill-amber-500 mx-auto animate-diya" />
            <p className="text-xs sm:text-sm font-devanagari-serif font-bold text-[#87091f] italic leading-relaxed whitespace-pre-line">
              "{data.mangalShloka}"
            </p>
          </div>

          {/* Main Invitation Message to Relatives & Friends */}
          <div className="my-8 p-5 sm:p-6 bg-gradient-to-b from-[#fdf6e7] to-[#fbf0da] border-2 border-[#d4af37] rounded-2xl text-left sm:text-center space-y-3 shadow-inner">
            <h3 className="font-devanagari-royal font-bold text-base text-[#87091f]">
              {data.invitationGreeting}
            </h3>
            <p className="text-xs sm:text-sm font-devanagari-serif text-stone-800 leading-relaxed whitespace-pre-line">
              {data.invitationMainText}
            </p>
          </div>

          {/* Hero Portrait Photo with Royal Frame */}
          <div className="my-8 max-w-md mx-auto aspect-[4/3] rounded-3xl overflow-hidden border-3 border-[#d4af37] shadow-xl relative group">
            <img
              src={data.heroImageUrl}
              alt="वर एवं वधू"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end justify-center p-4">
              <span className="text-[#ffd700] text-xs font-devanagari-royal tracking-wider bg-[#3a0208]/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[#d4af37]">
                शुभ विवाह: {data.weddingDateDisplay}
              </span>
            </div>
          </div>

          {/* Interactive Scratch-to-Reveal Muhurat Card */}
          <ScratchCard
            revealedText={data.venueName}
            subText={data.weddingDateDisplay}
            muhuratText={data.weddingMuhurat}
          />

          {/* Save The Date Calendar in Hindi */}
          <SaveTheDateCalendar
            weddingDateIso={data.weddingDateIso}
            groomName={data.groomName}
            brideName={data.brideName}
            venueName={data.venueName}
            venueAddress={data.venueAddress}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Live Wedding Countdown */}
          <CountdownTimer
            targetDateIso={data.weddingDateIso}
            weddingDateDisplay={data.weddingDateDisplay}
          />

          {/* Hindu Wedding Rituals Dedicated Section */}
          <HinduRitualsSection
            rituals={data.rituals}
            groomName={data.groomName}
            brideName={data.brideName}
          />

          {/* Photo Gallery */}
          <PhotoGallery photos={data.gallery} />

          {/* Venue & Google Maps Section */}
          <section className="my-14 p-6 sm:p-8 bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl shadow-xl card-paper-traditional text-center space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-[#fdf6e7] rounded-full border border-[#d4af37]">
              <MapPin className="w-4 h-4 text-[#87091f]" />
              <span className="text-xs font-devanagari-royal font-bold text-[#87091f]">
                विवाह समारोह स्थल (वेन्यू)
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-devanagari-royal font-bold text-[#630514]">
              {data.venueName}
            </h3>
            <p className="text-xs font-devanagari-serif text-stone-700 max-w-md mx-auto">
              {data.venueAddress}
            </p>

            {/* Embedded Google Map Preview */}
            <div className="w-full h-56 sm:h-64 rounded-2xl overflow-hidden border-2 border-[#d4af37]/60 shadow-md">
              <iframe
                title="Venue Map"
                src={data.googleMapsEmbedUrl || "https://maps.google.com/maps?q=Udaipur+Rajasthan&t=&z=13&ie=UTF8&iwloc=&output=embed"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>

            {/* Google Maps Directions Button in Hindi */}
            <div className="pt-2">
              <a
                href={data.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#87091f] via-[#b22222] to-[#7a0c1e] text-[#ffd700] font-devanagari-royal font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:from-[#630514] hover:to-[#54030f] transition-all"
              >
                <Navigation className="w-4 h-4 text-[#ffd700]" />
                <span>विवाह स्थल का रास्ता (Google Maps पर खोलें)</span>
              </a>
            </div>
          </section>

          {/* Traditional Family Pillars (दर्शनाभिलाषी, स्वागताकांक्षी, बाल मनुहार, विनीत) */}
          <section className="my-12 p-6 bg-[#fdf8ef] border-2 border-[#d4af37] rounded-3xl space-y-4 text-center">
            <h4 className="font-devanagari-royal font-bold text-lg text-[#87091f]">
              ॥ शुभेच्छु एवं सत्कार ॥
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left sm:text-center text-xs font-devanagari-serif">
              <div className="p-3 bg-white border border-[#d4af37]/50 rounded-xl">
                <span className="font-bold text-[#87091f] block mb-0.5">दर्शनाभिलाषी:</span>
                <span className="text-stone-800">{data.darshanabhilashi}</span>
              </div>

              <div className="p-3 bg-white border border-[#d4af37]/50 rounded-xl">
                <span className="font-bold text-[#87091f] block mb-0.5">स्वागताकांक्षी:</span>
                <span className="text-stone-800">{data.swagatakankshi}</span>
              </div>

              <div className="p-3 bg-white border border-[#d4af37]/50 rounded-xl">
                <span className="font-bold text-[#87091f] block mb-0.5">बाल मनुहार:</span>
                <span className="text-[#b8860b] font-bold">"{data.balManuhar}"</span>
              </div>

              <div className="p-3 bg-white border border-[#d4af37]/50 rounded-xl">
                <span className="font-bold text-[#87091f] block mb-0.5">विनीत (प्रेषक):</span>
                <span className="text-stone-800 font-semibold">{data.vinit}</span>
              </div>
            </div>
          </section>

          {/* Footer / Share spacer */}

          {/* WhatsApp Share Section in Hindi (Owner Mode Only) */}
          {!isPublicGuest && (
            <section className="my-10 p-6 bg-gradient-to-r from-[#25d366]/15 via-[#128c7e]/10 to-[#ffd700]/10 border-2 border-[#25d366]/40 rounded-3xl text-center space-y-3">
              <h3 className="text-xl font-devanagari-royal font-bold text-[#630514]">
                मित्रों व रिश्तेदारों को WhatsApp पर निमंत्रण भेजें
              </h3>
              <p className="text-xs font-devanagari-serif text-stone-700 max-w-md mx-auto">
                यह डिजिटल विवाह पत्रिका शुभ संदेश के साथ एक क्लिक में अपने प्रियजनों को भेजें।
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-5 py-2.5 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-devanagari-royal font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp पर निमंत्रण शेयर करें</span>
                </button>

                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-devanagari-serif font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4 text-stone-600" />}
                  <span>{copiedLink ? 'लिंक कॉपी हो गया!' : 'वेबसाइट लिंक कॉपी करें'}</span>
                </button>
              </div>
            </section>
          )}

          {/* Card Footer Signature */}
          <div className="text-center mt-12 pt-6 border-t-2 border-[#d4af37]/40">
            <MangalKalashIcon size={40} className="mx-auto mb-2" />
            <p className="text-xs font-devanagari-royal text-stone-600 font-bold">
              आपकी गरिमामयी उपस्थिति की सादर प्रतीक्षा में
            </p>
            <p className="text-2xl sm:text-3xl font-devanagari-royal text-[#7a0c1e] font-bold mt-1">
              {data.groomName} संग {data.brideName}
            </p>
            <p className="text-[11px] font-devanagari-serif text-stone-500 mt-1">
              ॥ सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः ॥
            </p>
          </div>
        </div>
      </main>

      {/* Floating Bottom Quick Action Bar on Mobile */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-md mx-auto sm:hidden">
        <div className="bg-[#54030f]/95 border-2 border-[#d4af37] backdrop-blur-md rounded-2xl px-3 py-2 shadow-2xl flex items-center justify-around text-[#ffd700] font-devanagari-serif">
          {!isPublicGuest && (
            <button
              onClick={handleShareWhatsApp}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold"
            >
              <Share2 className="w-4 h-4 text-[#25d366]" />
              <span>व्हाट्सएप</span>
            </button>
          )}

          <a
            href={data.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold"
          >
            <Navigation className="w-4 h-4 text-[#ffd700]" />
            <span>रास्ता देखें</span>
          </a>

          <button
            onClick={toggleAudio}
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold"
          >
            {isPlayingMusic ? (
              <Volume2 className="w-4 h-4 text-[#ffd700] animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-stone-400" />
            )}
            <span>शहनाई</span>
          </button>

          {!isPublicGuest && (
            <button
              onClick={onOpenEdit}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold"
            >
              <Edit3 className="w-4 h-4 text-[#ffd700]" />
              <span>संपादित करें</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
