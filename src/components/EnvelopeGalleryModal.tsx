import React from 'react';
import { X, Sparkles, Check, Mail } from 'lucide-react';
import { ENVELOPE_STYLES, EnvelopeStyleConfig } from '../utils/envelopeStyles';

interface EnvelopeGalleryModalProps {
  currentStyleId?: string;
  onSelectStyle: (styleId: string) => void;
  onClose: () => void;
}

export const EnvelopeGalleryModal: React.FC<EnvelopeGalleryModalProps> = ({
  currentStyleId = 'royal_red_gold',
  onSelectStyle,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#fffdfa] rounded-3xl shadow-2xl border-2 border-[#d4af37]/60 overflow-hidden font-devanagari-serif flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#87091f] via-[#a3122c] to-[#7a0c1e] p-4 sm:p-5 text-white flex items-center justify-between border-b border-[#ffd700]/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#ffd700]/20 border border-[#ffd700] flex items-center justify-center text-[#ffd700]">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-devanagari-royal text-[#ffd700]">
                सुंदर लिफाफा चुनें (Choose Envelope Design)
              </h3>
              <p className="text-xs text-[#fcebb6]">
                अपनी पसंद का शाही लिफाफा चुनें जो निमंत्रण खोलने के अनुभव को खास बनाएगा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 transition-all text-white/80 hover:text-white"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Grid of 20 Envelopes */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ENVELOPE_STYLES.map((env: EnvelopeStyleConfig) => {
            const isSelected = (currentStyleId === env.id);
            return (
              <div
                key={env.id}
                onClick={() => {
                  onSelectStyle(env.id);
                  onClose();
                }}
                className={`relative group cursor-pointer rounded-2xl p-4 border-2 transition-all duration-300 flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? 'border-[#87091f] bg-gradient-to-b from-[#fef9f0] to-[#fffdfa] ring-4 ring-[#87091f]/20'
                    : 'border-stone-200 bg-white hover:border-[#d4af37]'
                }`}
              >
                {/* Selected Badge */}
                {isSelected && (
                  <div className="absolute top-3 right-3 z-10 bg-[#87091f] text-[#ffd700] p-1 rounded-full shadow-md flex items-center gap-1 text-[10px] font-bold px-2">
                    <Check className="w-3.5 h-3.5" />
                    <span>सक्रिय</span>
                  </div>
                )}
                {/* Mini Envelope Preview Graphic */}
                <div className={`w-full h-32 rounded-xl ${env.bgGradient} ${env.borderClass} relative overflow-hidden flex items-center justify-center shadow-inner my-2 group-hover:scale-[1.02] transition-transform`}>
                  {/* Flap preview line */}
                  <div className={`absolute top-0 inset-x-0 h-1/2 ${env.topFlapBg} opacity-90 rounded-t-lg flex items-center justify-center`}>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-tr ${env.sealGradient} border border-amber-300/80 shadow-md flex items-center justify-center`}>
                      <Sparkles className={`w-4 h-4 ${env.sealText}`} />
                    </div>
                  </div>
                </div>
                {/* Envelope Details */}
                <div className="mt-2 text-center">
                  <h4 className="text-sm sm:text-base font-bold font-devanagari-royal text-[#7a0c1e]">
                    {env.nameHindi}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-sans tracking-wide">
                    {env.nameEnglish}
                  </p>
                </div>
                {/* Action button */}
                <button
                  type="button"
                  className={`mt-3 w-full py-2 rounded-xl text-xs font-bold font-devanagari-royal transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#87091f] text-[#ffd700] shadow'
                      : 'bg-stone-100 hover:bg-[#87091f] hover:text-[#ffd700] text-stone-700 border border-stone-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'यह लिफाफा चुना गया है' : 'यह लिफाफा चुनें'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600 shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#b8860b]" />
            कुल 20 शाही डिज़ाइन उपलब्ध हैं। कभी भी बदला जा सकता है।
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-black text-[#ffd700] rounded-xl font-bold transition-all shadow-sm"
          >
            बंद करें
          </button>
        </div>
      </div>
    </div>
  );
};
