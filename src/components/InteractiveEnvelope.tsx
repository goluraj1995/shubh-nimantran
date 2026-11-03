import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Palette, FastForward, Sparkles, Gift } from 'lucide-react';
import { GaneshaIcon } from './GaneshaIcon';
import { CrescentStarIcon } from './IslamicMotifs';
import { getEnvelopeConfig } from '../utils/envelopeStyles';
import { CardCategory, MusicSettings } from '../types/invitation';
import { cardAudio } from '../utils/audio';

interface InteractiveEnvelopeProps {
  category: CardCategory;
  primaryTitle: string;
  guestName?: string;
  subTitle?: string;
  dateDisplay?: string;
  musicUrl?: string;
  musicSettings?: MusicSettings;
  envelopeStyle?: string;
  onOpenEnvelopeGallery?: () => void;
  onOpen: () => void;
}

export const InteractiveEnvelope: React.FC<InteractiveEnvelopeProps> = ({
  category,
  primaryTitle,
  guestName,
  subTitle,
  dateDisplay,
  musicUrl,
  musicSettings,
  envelopeStyle = 'royal_red_gold',
  onOpenEnvelopeGallery,
  onOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const envelopeConfig = getEnvelopeConfig(envelopeStyle, category);

  useEffect(() => {
    if (musicUrl && musicSettings?.mode !== 'none') {
      try {
        cardAudio.play(category, musicUrl);
        setIsPlayingMusic(true);
      } catch (err) {
        console.warn('Envelope background audio autoplay hindered:', err);
      }
    }
    return () => {
      cardAudio.pause();
    };
  }, [category, musicUrl, musicSettings]);

  const toggleMusic = () => {
    if (isPlayingMusic) {
      cardAudio.pause();
      setIsPlayingMusic(false);
    } else {
      cardAudio.play(category, musicUrl);
      setIsPlayingMusic(true);
    }
  };

  const handleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      cardAudio.playEnvelopeOpenSound(category);
      setTimeout(() => {
        onOpen();
      }, 1400);
    }
  };

  const handleSkipIntro = () => {
    setIsOpen(true);
    onOpen();
  };

  return (
    <div className="min-h-screen bg-mandap-texture flex flex-col items-center justify-center relative p-4 font-devanagari-serif overflow-hidden select-none">
      {/* Top Floating Controls */}
      <div className="absolute top-4 inset-x-4 max-w-2xl mx-auto flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          {musicUrl && (
            <button
              onClick={toggleMusic}
              className="px-3.5 py-1.5 bg-black/50 backdrop-blur-md border border-[#d4af37]/50 rounded-full text-[#ffd700] text-xs font-medium flex items-center gap-1.5 shadow-lg hover:bg-black/70 transition-all cursor-pointer"
              title={isPlayingMusic ? "संगीत बंद करें" : "संगीत चलाएं"}
            >
              {isPlayingMusic ? <Volume2 className="w-3.5 h-3.5 animate-pulse text-[#ffd700]" /> : <VolumeX className="w-3.5 h-3.5 text-white/70 text-xs" />}
              <span>{isPlayingMusic ? 'संगीत चालू है' : 'संगीत बंद है'}</span>
            </button>
          )}
          {onOpenEnvelopeGallery && (
            <button
              onClick={onOpenEnvelopeGallery}
              className="px-3 py-1.5 bg-black/50 backdrop-blur-md border border-[#ffd700]/50 rounded-full text-[#ffd700] text-xs font-medium flex items-center gap-1.5 shadow-lg hover:bg-black/70 transition-all cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>लिफाफा बदलें</span>
            </button>
          )}
        </div>
        <button
          onClick={handleSkipIntro}
          className="ml-auto px-4 py-1.5 bg-black/50 backdrop-blur-md border border-[#ffd700]/50 rounded-full text-[#ffd700] text-xs font-medium flex items-center gap-1.5 shadow-lg hover:bg-black/70 transition-all cursor-pointer"
        >
          <span>सीधे निमंत्रण देखें</span>
          <FastForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Envelope Container */}
      <div className="w-full max-w-lg relative z-20 my-auto py-10">
        <div className="text-center mb-6 space-y-2">
          <span className="inline-block px-4 py-1 rounded-full bg-black/40 backdrop-blur-md border border-[#ffd700]/50 text-[#ffd700] text-xs font-semibold tracking-widest uppercase shadow-md">
            {category === 'muslim_wedding' ? '✨ दावत-ए-निकाह ✨' : category === 'birthday' ? '🎂 जन्मदिन उत्सव 🎂' : '🪔 मांगलिक परिणय निमंत्रण 🪔'}
          </span>
          <div className="pt-1">
            <h1 className="text-2xl sm:text-3xl font-devanagari-royal font-bold text-[#641C32] bg-[#fffdfa]/95 px-6 py-2.5 rounded-2xl border-2 border-[#d4af37] shadow-xl inline-block drop-shadow-sm">
              {primaryTitle}
            </h1>
          </div>
        </div>

        {/* Envelope Body */}
        <motion.div
          onClick={handleOpen}
          className={`relative w-full aspect-[4/3] rounded-3xl ${envelopeConfig.borderClass} shadow-2xl cursor-pointer overflow-hidden transition-transform duration-300 hover:scale-[1.01] ${envelopeConfig.bgGradient}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          {/* Inner envelope shadow/texture */}
          <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

          {/* Letter Card Sliding Out */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 0, scale: 0.9, opacity: 0 }}
                animate={{ y: -120, scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-x-6 top-6 bottom-6 bg-[#fffdf9] rounded-2xl p-6 shadow-2xl border-2 border-[#ffd700] flex flex-col items-center justify-between z-10 text-center"
              >
                <div className="w-full border-b border-[#d4af37]/30 pb-3">
                  <p className="text-xs uppercase tracking-widest text-[#87091f] font-bold">
                    {category === 'muslim_wedding' ? 'Nikah Invitation' : category === 'birthday' ? 'Birthday Celebration' : 'Wedding Invitation'}
                  </p>
                  <h3 className="text-lg sm:text-xl font-devanagari-royal font-bold text-[#5c0614] mt-1">
                    {primaryTitle}
                  </h3>
                </div>
                <div className="my-auto py-4">
                  {guestName && (
                    <div className="mb-2">
                      <span className="text-xs text-stone-500 block">सादर आमंत्रण हेतु:</span>
                      <span className="text-sm font-bold text-[#87091f]">{guestName}</span>
                    </div>
                  )}
                  <p className="text-xs font-medium text-stone-700">{dateDisplay}</p>
                </div>
                <div className="w-full pt-2 border-t border-[#d4af37]/30 flex items-center justify-center gap-2 text-xs font-bold text-[#87091f]">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>निमंत्रण पत्र खुल रहा है...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Flap (Triangle Opening) */}
          <motion.div
            className={`absolute top-0 inset-x-0 h-1/2 origin-top z-20 pointer-events-none ${envelopeConfig.topFlapBg}`}
            style={{
              clipPath: 'polygon(0 0, 50% 100%, 100% 0)'
            }}
            animate={isOpen ? { rotateX: 180, opacity: 0 } : { rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          ></motion.div>

          {/* Left Flap */}
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-black/10 pointer-events-none"
            style={{ clipPath: 'polygon(0 0, 0 100%, 100% 50%)' }}
          ></div>

          {/* Right Flap */}
          <div
            className="absolute inset-y-0 right-0 w-1/2 bg-black/10 pointer-events-none"
            style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }}
          ></div>

          {/* Bottom Flap Shadow/Overlay */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 bg-black/15 pointer-events-none"
            style={{ clipPath: 'polygon(0 100%, 50% 0, 100% 100%)' }}
          ></div>

          {/* Center Wax Seal / Embellishment Badge */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
            <motion.div
              className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${envelopeConfig.sealGradient} border-4 border-[#ffd700] shadow-2xl flex flex-col items-center justify-center text-center p-2 relative`}
              animate={isOpen ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className={`absolute inset-1.5 rounded-full border border-[#ffd700]/60 bg-gradient-to-br ${envelopeConfig.sealInner} flex flex-col items-center justify-center shadow-inner`}>
                {category === 'muslim_wedding' ? (
                  <CrescentStarIcon className="w-8 h-8 text-[#ffd700] mb-0.5 animate-pulse" />
                ) : category === 'birthday' ? (
                  <Gift className="w-8 h-8 text-[#ffd700] mb-0.5 animate-pulse" />
                ) : (
                  <GaneshaIcon className="w-8 h-8 text-[#ffd700] mb-0.5 animate-pulse" />
                )}
                <span className={`text-[9px] sm:text-[10px] font-devanagari-royal font-bold ${envelopeConfig.sealText} tracking-wider`}>
                  {category === 'muslim_wedding' ? 'निकाह' : category === 'birthday' ? 'उत्सव' : 'शुभ विवाह'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Click to Open Instruction Overlay at Bottom */}
          <div className="absolute bottom-4 inset-x-0 text-center z-30 pointer-events-none">
            <span className="inline-block px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-[#ffd700] border border-[#ffd700]/40 text-xs font-semibold tracking-wider shadow-lg animate-pulse">
              💌 लिफाफा खोलने के लिए यहाँ क्लिक करें 💌
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer Branding / Instruction */}
      <div className="mt-auto text-center text-xs text-white/70 relative z-20 pb-2">
        <p>शुभ निमंत्रण • डिजिटल शादी और उत्सव कार्ड प्लेटफ़ॉर्म</p>
      </div>
    </div>
  );
};
