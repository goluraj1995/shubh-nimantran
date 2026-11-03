import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, FastForward, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingAudio } from '../utils/audio';
import { GaneshaIcon, MangalKalashIcon } from './GaneshaIcon';

interface EnvelopeIntroProps {
  groomName: string;
  brideName: string;
  weddingDateDisplay: string;
  headline?: string;
  musicUrl?: string;
  onOpen: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({
  groomName,
  brideName,
  weddingDateDisplay,
  headline = '॥ श्री गणेशाय नमः ॥',
  musicUrl,
  onOpen
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Play auspicious opening flourish and start Shehnai melody
    weddingAudio.playEnvelopeOpenSound();
    weddingAudio.play(musicUrl);
    setIsPlayingMusic(true);

    // Auspicious Marigold & Gold Petals Confetti
    confetti({
      particleCount: 90,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#d4af37', '#ff9933', '#ffd700', '#b22222', '#ff4d4d', '#ffffff']
    });

    // Wait for envelope unfolding animation before entering full card
    setTimeout(() => {
      onOpen();
    }, 2400);
  };

  const handleSkipIntro = () => {
    weddingAudio.play(musicUrl);
    setIsPlayingMusic(true);
    onOpen();
  };

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    const playing = weddingAudio.toggle(musicUrl);
    setIsPlayingMusic(playing);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-royal-maroon p-4 select-none overflow-hidden text-[#fdf6e7]">
      {/* Decorative Traditional Toran at Top */}
      <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-r from-[#b8860b] via-[#ffd700] to-[#b8860b] opacity-80 shadow-md flex items-center justify-around overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span key={i} className="text-[#630514] text-[10px]">❖</span>
        ))}
      </div>

      {/* Top Floating Controls */}
      <div className="absolute top-5 left-4 right-4 z-50 flex items-center justify-between max-w-xl mx-auto">
        <button
          onClick={handleSkipIntro}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-devanagari-serif font-medium text-[#ffd700] bg-[#3a0208]/90 hover:bg-[#2b0105] border border-[#d4af37]/60 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-95"
        >
          <FastForward className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>सीधे निमंत्रण देखें</span>
        </button>

        <button
          onClick={toggleMusic}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-devanagari-serif font-medium text-[#ffd700] bg-[#3a0208]/90 hover:bg-[#2b0105] border border-[#d4af37]/60 rounded-full backdrop-blur-md transition-all shadow-lg active:scale-95"
        >
          {isPlayingMusic ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
              <span>शहनाई संगीत चालू</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5 text-amber-200/70" />
              <span>शहनाई संगीत सुनें</span>
            </>
          )}
        </button>
      </div>

      {/* Main Red & Gold Wedding Envelope */}
      <div className="relative w-full max-w-sm sm:max-w-md aspect-[3/4.2] flex items-center justify-center mt-6">
        {/* Sacred Aura Glow */}
        <div className="absolute -inset-6 bg-gradient-to-tr from-[#ffd700]/20 via-[#ff9933]/25 to-transparent rounded-3xl blur-2xl opacity-75 pointer-events-none"></div>

        {/* Outer Crimson & Gold Envelope Sleeve */}
        <motion.div
          onClick={handleOpen}
          initial={{ scale: 0.92, opacity: 0, y: 25 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative w-full h-full cursor-pointer group rounded-2xl bg-[#7a0c1e] border-4 border-[#d4af37] shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col justify-between p-6 sm:p-7"
          style={{ perspective: '1200px' }}
        >
          {/* Inner Ornate Gold Border Frame */}
          <div className="absolute inset-2 border-2 border-dashed border-[#ffd700]/60 rounded-xl pointer-events-none"></div>
          
          {/* Corner Floral Motifs */}
          <span className="absolute top-3 left-3 text-[#ffd700] text-sm pointer-events-none">卐</span>
          <span className="absolute top-3 right-3 text-[#ffd700] text-sm pointer-events-none">卐</span>
          <span className="absolute bottom-3 left-3 text-[#ffd700] text-sm pointer-events-none">ॐ</span>
          <span className="absolute bottom-3 right-3 text-[#ffd700] text-sm pointer-events-none">ॐ</span>

          {/* Envelope Top Header on Outside */}
          <div className="relative z-10 text-center pt-2 pointer-events-none">
            <p className="font-devanagari-royal text-sm sm:text-base text-[#ffd700] tracking-widest drop-shadow">
              {headline}
            </p>
            <p className="text-[11px] font-devanagari-serif text-[#fdf6e7]/80 mt-0.5 tracking-wider">
              मांगलिक परिणय निमंत्रण
            </p>
          </div>

          {/* Card Preview that slides out on Opening */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ y: 0, opacity: 0.85, scale: 0.95 }}
                animate={{ y: -290, opacity: 1, scale: 1.04 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="absolute inset-x-3 top-10 z-30 rounded-xl bg-[#fffdf9] p-5 border-2 border-[#d4af37] shadow-2xl text-center text-[#520814]"
              >
                <div className="border border-[#b8860b]/40 p-4 rounded-lg bg-[#fdf6e7]">
                  <GaneshaIcon size={38} className="mx-auto mb-1" />
                  <p className="text-[11px] font-devanagari-serif text-[#b8860b] font-bold">॥ श्री गणेशाय नमः ॥</p>
                  <h3 className="text-xl sm:text-2xl font-devanagari-royal text-[#7a0c1e] my-1">
                    शुभ विवाह
                  </h3>
                  <div className="text-lg font-devanagari-royal text-[#800020] font-bold">
                    {groomName} <span className="text-[#b8860b] text-base font-normal">संग</span> {brideName}
                  </div>
                  <p className="text-xs font-devanagari-serif text-[#87091f] mt-1 font-semibold">{weddingDateDisplay}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Envelope Top Flap */}
          <motion.div
            initial={{ rotateX: 0 }}
            animate={isOpen ? { rotateX: -160 } : { rotateX: 0 }}
            transition={{ duration: 0.85, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top center' }}
            className="absolute top-0 inset-x-0 h-1/2 z-20 bg-gradient-to-b from-[#8b0f24] to-[#6d091a] border-b-2 border-[#ffd700]/70 shadow-lg rounded-t-2xl flex items-center justify-center"
          >
            {/* Traditional paisley motif */}
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffd700_1.5px,transparent_1.5px)] [background-size:14px_14px]"></div>
          </motion.div>

          {/* Envelope Left & Right Triangular Flaps */}
          <div className="absolute inset-y-0 left-0 w-1/2 z-10 bg-gradient-to-r from-[#8b0f24] to-[#630514] border-r border-[#ffd700]/30 pointer-events-none opacity-90"></div>
          <div className="absolute inset-y-0 right-0 w-1/2 z-10 bg-gradient-to-l from-[#8b0f24] to-[#630514] border-l border-[#ffd700]/30 pointer-events-none opacity-90"></div>

          {/* Center Auspicious Golden Wax Seal with "शुभ विवाह" & Ganesha */}
          <motion.div
            animate={isOpen ? { scale: 1.3, opacity: 0 } : { scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center"
          >
            {/* Traditional Gold & Red Royal Wax Seal */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#8f6b15] via-[#ffd700] to-[#fff3b0] border-3 border-[#ffd700] shadow-[0_0_35px_rgba(212,175,55,0.7)] flex items-center justify-center animate-sacred-seal cursor-pointer group-hover:scale-105 transition-transform">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#87091f] to-[#4a020a] border-2 border-[#ffd700] flex flex-col items-center justify-center text-center shadow-inner p-1">
                <GaneshaIcon size={34} className="mb-0.5" />
                <span className="font-devanagari-royal text-xs sm:text-sm font-bold text-[#ffd700] tracking-wide drop-shadow">
                  शुभ विवाह
                </span>
              </div>
            </div>

            {/* Tap instruction badge in Hindi */}
            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#3d0208]/95 border border-[#ffd700]/70 backdrop-blur-sm shadow-xl flex items-center gap-1.5 animate-bounce">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="text-xs font-devanagari-serif font-bold text-[#ffd700] tracking-wide">
                खोलने के लिए सील पर टैप करें
              </span>
            </div>
          </motion.div>

          {/* Bottom Envelope Footer */}
          <div className="relative z-10 mt-auto text-center pointer-events-none pb-1">
            <h2 className="text-2xl sm:text-3xl font-devanagari-royal text-[#ffd700] drop-shadow">
              {groomName} <span className="text-base text-[#fdf6e7]">संग</span> {brideName}
            </h2>
            <p className="text-xs font-devanagari-serif text-[#fcebb6] mt-1">
              {weddingDateDisplay}
            </p>
          </div>
        </motion.div>
      </div>

      <p className="mt-5 text-xs text-[#fcebb6]/80 font-devanagari-serif text-center flex items-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
        पारंपरिक हिंदू डिजिटल विवाह निमंत्रण पत्रिका
      </p>
    </div>
  );
};
