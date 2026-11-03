import React from 'react';
import { HinduRitual } from '../types/wedding';
import { HinduCeremony } from '../types/invitation';
import { Calendar as CalendarIcon, Clock, MapPin, Sparkles, Flame, Flower2, HeartHandshake, Music2, Car, Heart } from 'lucide-react';
import { GaneshaIcon, MangalKalashIcon } from './GaneshaIcon';

interface HinduRitualsSectionProps {
  rituals?: HinduRitual[];
  ceremonies?: HinduCeremony[];
  groomName?: string;
  brideName?: string;
  weddingDateDisplay?: string;
}

export const HinduRitualsSection: React.FC<HinduRitualsSectionProps> = ({
  rituals,
  ceremonies,
  groomName = 'वर',
  brideName = 'वधू',
  weddingDateDisplay
}) => {
  const itemsList = ceremonies || rituals || [];
  // Only display enabled rituals
  const activeRituals = itemsList.filter((r) => r.enabled !== false);

  const getRitualIcon = (icon: HinduRitual['icon']) => {
    switch (icon) {
      case 'ganesha':
        return <GaneshaIcon size={26} variant="maroon" />;
      case 'mandap':
        return <MangalKalashIcon size={26} />;
      case 'haldi':
        return (
          <div className="w-8 h-8 rounded-full bg-amber-400 border border-amber-600 flex items-center justify-center text-amber-950 font-bold text-xs shadow-sm">
            हल्दी
          </div>
        );
      case 'mehndi':
        return <Flower2 className="w-6 h-6 text-emerald-700" />;
      case 'baraat':
        return <Music2 className="w-6 h-6 text-indigo-700" />;
      case 'varmala':
        return <Heart className="w-6 h-6 text-rose-600 fill-rose-600" />;
      case 'phere':
        return <Flame className="w-6 h-6 text-orange-600 fill-orange-500 animate-diya" />;
      case 'vidai':
        return <Car className="w-6 h-6 text-amber-800" />;
      case 'preetibhoj':
        return <HeartHandshake className="w-6 h-6 text-purple-700" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#b8860b]" />;
    }
  };

  const createRitualCalendarLink = (ritual: HinduRitual) => {
    const title = encodeURIComponent(`${ritual.name} - ${groomName} संग ${brideName}`);
    const details = encodeURIComponent(`${ritual.description}\nस्थान: ${ritual.location}\nसमय: ${ritual.time}`);
    const location = encodeURIComponent(ritual.location);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <section className="my-14">
      {/* Auspicious Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#fdf6e7] rounded-full border border-[#d4af37] shadow-sm mb-3">
          <span className="text-xs text-[#87091f]">卐</span>
          <span className="text-xs font-devanagari-royal font-bold uppercase tracking-wider text-[#87091f]">
            मांगलिक कार्यक्रम एवं वैदिक संस्कार
          </span>
          <span className="text-xs text-[#87091f]">卐</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-devanagari-royal text-[#630514] mb-2">
          हिंदू विवाह की पावन रस्में
        </h2>
        <p className="text-xs font-devanagari-serif text-stone-700 max-w-lg mx-auto">
          वैदिक परंपरा, मांगलिक रीति-रिवाजों और पारिवारिक उल्लास के साथ संपन्न होने वाले मुख्य कार्यक्रम
        </p>
      </div>

      {/* Rituals Timeline Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {activeRituals.map((ritual, idx) => (
          <div
            key={ritual.id}
            className="p-5 sm:p-6 bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl shadow-lg card-paper-traditional flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1"
          >
            {/* Top corner emblem */}
            <div className="absolute top-2 right-3 text-[#d4af37]/40 text-xs font-devanagari-royal">
              #{idx + 1}
            </div>

            <div>
              {/* Header with Icon, Time & Name */}
              <div className="flex items-start gap-3.5 mb-3">
                <div className="p-2.5 bg-[#fdf6e7] border border-[#d4af37] rounded-2xl shadow-inner flex items-center justify-center flex-shrink-0">
                  {getRitualIcon(ritual.icon)}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-devanagari-royal font-bold text-[#7a0c1e] leading-snug">
                    {ritual.name}
                  </h3>
                  {ritual.subTitle && (
                    <p className="text-xs font-devanagari-serif text-[#b8860b] font-semibold mt-0.5">
                      {ritual.subTitle}
                    </p>
                  )}
                </div>
              </div>

              {/* Date, Time & Venue Badges */}
              <div className="space-y-1.5 my-3 text-xs font-devanagari-serif text-stone-700 bg-[#fdf8ef] p-3 rounded-2xl border border-[#d4af37]/40">
                <div className="flex items-center gap-2 text-[#87091f] font-bold">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{ritual.date}</span>
                </div>
                <div className="flex items-center gap-2 text-[#b8860b] font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{ritual.time}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <MapPin className="w-3.5 h-3.5 text-[#87091f]" />
                  <span>स्थान: {ritual.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs font-devanagari-serif text-stone-700 leading-relaxed my-2">
                {ritual.description}
              </p>
            </div>

            {/* Bottom: Dress code & Add to Calendar */}
            <div className="mt-4 pt-3 border-t border-[#d4af37]/40 flex items-center justify-between gap-2 text-[11px] font-devanagari-serif">
              {ritual.dressCode ? (
                <div className="text-stone-600">
                  <span className="text-[#87091f] font-bold">परिधान: </span>
                  <span className="font-medium">{ritual.dressCode}</span>
                </div>
              ) : (
                <div></div>
              )}

              <a
                href={createRitualCalendarLink(ritual)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 bg-[#fdf6e7] hover:bg-[#faedd1] text-[#87091f] font-bold rounded-lg border border-[#d4af37]/60 flex items-center gap-1 transition-colors flex-shrink-0"
              >
                <Sparkles className="w-3 h-3 text-[#b8860b]" />
                <span>कैलेंडर में जोड़ें</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
