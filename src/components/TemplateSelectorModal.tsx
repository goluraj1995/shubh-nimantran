import React from 'react';
import { AnyInvitationData, CardCategory } from '../types/invitation';
import { X, Sparkles, Check, Palette } from 'lucide-react';

interface TemplateSelectorModalProps {
  currentCard: AnyInvitationData;
  onSelectTemplate: (themeId: string, category: CardCategory) => void;
  onClose: () => void;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  currentCard,
  onSelectTemplate,
  onClose
}) => {
  const templates = [
    { id: 'royal_rajwada', name: '1. Royal Rajwada (रॉयल राजवाड़ा)', category: 'hindu_wedding', desc: 'शाही मैरून, गहरा लाल और स्वर्ण, शाही बॉर्डर' },
    { id: 'floral_butterfly', name: '2. Floral Butterfly (फ्लोरल बटरफ्लाई)', category: 'hindu_wedding', desc: 'पेस्टल गुलाबी, क्रीम और हरे फूल व तितलियाँ' },
    { id: 'ganesh_mangalam', name: '3. Ganesh Mangalam (गणेश मंगलम)', category: 'hindu_wedding', desc: 'लाल, हाथीदांत और स्वर्ण, गणेश जी चित्र' },
    { id: 'peacock_elegance', name: '4. Peacock Elegance (मोरपंख एलिगेंस)', category: 'hindu_wedding', desc: 'मोरपंखी नीला, टील और स्वर्ण बॉर्डर' },
    { id: 'ivory_luxury', name: '5. Ivory Luxury (आइवरी लग्जरी)', category: 'hindu_wedding', desc: 'आइवरी, क्रीम और स्वर्ण, प्रीमियम लेआउट' },
    { id: 'pink_garden', name: '6. Pink Garden (पिंक गार्डन)', category: 'hindu_wedding', desc: 'रोज़ पिंक, हल्का पीच और बॉटनिकल पैटर्न' },
    { id: 'emerald_royal', name: '7. Emerald Royal (एमराल्ड रॉयल)', category: 'muslim_wedding', desc: 'पन्ना हरा और स्वर्ण, शाही इस्लामिक फ्रेम' },
    { id: 'mandap_utsav', name: '8. Mandap Utsav (मंडप उत्सव)', category: 'hindu_wedding', desc: 'लाल, केसरिया और स्वर्ण, मंडप प्रेरित डिज़ाइन' },
    { id: 'modern_pastel', name: '9. Modern Pastel (मॉडर्न पेस्टल)', category: 'birthday', desc: 'लैवेंडर, पीच और ऑफ-व्हाइट, मिनिमल उत्सव' },
    { id: 'midnight_floral', name: '10. Midnight Floral (मिडनाइट फ्लोरल)', category: 'muslim_wedding', desc: 'गहरा नेवी ब्लू, हाथीदांत और स्वर्ण आवरण' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#fffdfa] border-2 border-[#d4af37]/60 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative space-y-5 font-devanagari-serif">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#ffd700]/30 pb-4 bg-gradient-to-r from-[#87091f] via-[#a3122c] to-[#7a0c1e] -mx-6 -mt-6 p-6 rounded-t-2xl text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ffd700]/20 border border-[#ffd700] flex items-center justify-center text-[#ffd700]">
              <Palette className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-devanagari-royal font-bold text-[#ffd700]">
                🎨 निमंत्रण टेम्पलेट बदलें (Select Theme)
              </h3>
              <p className="text-xs text-[#fcebb6]">
                अपनी पसंद का पारंपरिक व आधुनिक डिज़ाइन चुनें
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-all"
            title="बंद करें"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {templates.map((tpl) => {
            const isSelected = currentCard.theme === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl.id, tpl.category as CardCategory)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative shadow-md hover:shadow-xl hover:-translate-y-1 ${
                  isSelected
                    ? 'border-[#87091f] bg-gradient-to-b from-[#fef9f0] to-[#fffdfa] ring-4 ring-[#87091f]/20'
                    : 'border-stone-200 bg-white hover:border-[#d4af37]'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 bg-[#87091f] text-[#ffd700] p-1.5 rounded-full shadow-md flex items-center gap-1 text-[10px] font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>सक्रिय</span>
                  </span>
                )}
                <div>
                  <h4 className="font-devanagari-royal font-bold text-base text-[#7a0c1e]">{tpl.name}</h4>
                  <p className="text-xs text-stone-600 mt-1.5 font-medium">{tpl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
