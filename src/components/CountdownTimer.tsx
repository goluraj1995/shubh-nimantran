import React, { useState, useEffect } from 'react';
import { Clock, Sparkles } from 'lucide-react';

interface CountdownTimerProps {
  targetDateIso: string;
  weddingDateDisplay: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDateIso,
  weddingDateDisplay
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
    progressPercent: 45
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateIso).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isPassed: true,
          progressPercent: 100
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Estimate progress
      const startDate = new Date(2025, 0, 1).getTime();
      const totalTime = target - startDate;
      const elapsedTime = now - startDate;
      let pct = Math.round((elapsedTime / totalTime) * 100);
      if (isNaN(pct) || pct < 15) pct = 45;
      if (pct > 99) pct = 99;

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isPassed: false,
        progressPercent: pct
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [targetDateIso]);

  return (
    <div className="w-full max-w-xl mx-auto my-10 p-6 sm:p-8 bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl shadow-xl card-paper-traditional text-center relative overflow-hidden">
      {/* Auspicious Corner Emblems */}
      <div className="absolute top-2 left-3 text-[#d4af37] text-base font-devanagari-royal">卐</div>
      <div className="absolute top-2 right-3 text-[#d4af37] text-base font-devanagari-royal">卐</div>
      <div className="absolute bottom-2 left-3 text-[#d4af37] text-base font-devanagari-royal">ॐ</div>
      <div className="absolute bottom-2 right-3 text-[#d4af37] text-base font-devanagari-royal">ॐ</div>

      <div className="flex items-center justify-center gap-1.5 mb-2">
        <Clock className="w-4 h-4 text-[#87091f]" />
        <span className="text-xs font-devanagari-royal font-bold text-[#87091f] tracking-wider uppercase">
          शुभ विवाह में शेष समय (लाइव काउंटडाउन)
        </span>
      </div>

      <h3 className="text-2xl sm:text-3xl font-devanagari-royal text-[#630514] mb-5">
        {weddingDateDisplay}
      </h3>

      {timeLeft.isPassed ? (
        <div className="p-4 bg-[#fdf6e7] rounded-2xl border border-[#d4af37]">
          <p className="text-xl font-bold font-devanagari-royal text-[#87091f]">
            🎉 आज ही शुभ विवाह का पावन दिवस है! 🎉
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto mb-6">
          <div className="flex flex-col items-center justify-center p-3 bg-[#fdf6e7] border border-[#d4af37]/60 rounded-2xl shadow-sm">
            <span className="text-2xl sm:text-4xl font-bold font-devanagari-royal text-[#7a0c1e]">
              {timeLeft.days}
            </span>
            <span className="text-xs font-devanagari-serif text-stone-700 font-bold mt-1">
              दिन
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-[#fdf6e7] border border-[#d4af37]/60 rounded-2xl shadow-sm">
            <span className="text-2xl sm:text-4xl font-bold font-devanagari-royal text-[#7a0c1e]">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-xs font-devanagari-serif text-stone-700 font-bold mt-1">
              घंटे
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-[#fdf6e7] border border-[#d4af37]/60 rounded-2xl shadow-sm">
            <span className="text-2xl sm:text-4xl font-bold font-devanagari-royal text-[#7a0c1e]">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs font-devanagari-serif text-stone-700 font-bold mt-1">
              मिनट
            </span>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-[#fdf6e7] border border-[#d4af37]/60 rounded-2xl shadow-sm">
            <span className="text-2xl sm:text-4xl font-bold font-devanagari-royal text-[#b8860b]">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-devanagari-serif text-stone-700 font-bold mt-1">
              सेकंड
            </span>
          </div>
        </div>
      )}

      {/* Auspicious Progress Bar */}
      <div className="max-w-sm mx-auto">
        <div className="flex justify-between items-center text-xs text-stone-700 mb-1.5 font-devanagari-serif">
          <span>विवाह मुहूर्त की पावन प्रतीक्षा</span>
          <span className="flex items-center gap-1 text-[#87091f] font-bold">
            शुभ लग्न वेला <Sparkles className="w-3.5 h-3.5 text-[#ffd700] fill-[#ffd700]" />
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#f5e5c3] rounded-full overflow-hidden border border-[#b8860b]/40 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-[#87091f] via-[#b22222] to-[#ffd700] rounded-full transition-all duration-500"
            style={{ width: `${timeLeft.progressPercent}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};
