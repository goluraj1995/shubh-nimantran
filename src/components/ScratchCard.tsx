import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MangalKalashIcon } from './GaneshaIcon';

interface ScratchCardProps {
  revealedText: string;
  subText?: string;
  muhuratText?: string;
  onRevealed?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({
  revealedText,
  subText = 'शनिवार, 20 मार्च 2027',
  muhuratText = 'शुभ मुहूर्त: सायं 07:15 बजे (गोधूलि वेला)',
  onRevealed
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const isDrawingRef = useRef(false);

  // Initialize Canvas Overlay in Royal Kumkum & Gold
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill with sacred crimson and gold gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#87091f');
    gradient.addColorStop(0.5, '#b22222');
    gradient.addColorStop(1, '#630514');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Decorative inner gold border
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Auspicious Hindi text overlay
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 15px "Noto Serif Devanagari", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('शुभ मुहूर्त जानने हेतु स्क्रैच करें', width / 2, height / 2 - 10);

    ctx.fillStyle = '#fffdf9';
    ctx.font = '12px "Noto Serif Devanagari", sans-serif';
    ctx.fillText('✨ यहाँ अपनी उंगली फिराएँ ✨', width / 2, height / 2 + 14);
  }, []);

  useEffect(() => {
    initCanvas();
  }, [initCanvas]);

  const checkScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparentCount = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const pct = Math.round((transparentCount / (pixels.length / 4)) * 100);
    setScratchPercent(pct);

    if (pct > 30 && !isRevealed) {
      setIsRevealed(true);
      if (onRevealed) onRevealed();
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff9933', '#b22222', '#ffffff']
      });
    }
  };

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 24, 0, Math.PI * 2);
    ctx.fill();

    checkScratchPercentage();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    isDrawingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDrawingRef.current = true;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    if (e.touches[0]) {
      scratch(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleQuickReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsRevealed(true);
    if (onRevealed) onRevealed();
    confetti({
      particleCount: 60,
      spread: 80,
      colors: ['#ffd700', '#ff9933', '#b22222', '#ffffff']
    });
  };

  return (
    <div className="flex flex-col items-center justify-center my-8">
      <div className="relative flex flex-col items-center justify-center p-6 bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl shadow-xl w-full max-w-sm text-center card-paper-traditional">
        <div className="flex items-center gap-1.5 mb-1 text-[#87091f]">
          <span className="text-sm">卐</span>
          <p className="text-xs font-devanagari-royal font-bold text-[#87091f] tracking-wider">
            शुभ विवाह एवं पावन लग्न मुहूर्त
          </p>
          <span className="text-sm">卐</span>
        </div>

        {/* Outer Card Container */}
        <div className="relative w-72 h-44 flex items-center justify-center my-2.5">
          {/* Content revealed underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#fff6e6] to-[#feeacc] border-2 border-[#b8860b] rounded-2xl shadow-inner text-center">
            <MangalKalashIcon size={36} className="mb-1" />
            <span className="text-[11px] font-devanagari-serif text-[#87091f] font-bold">सादर आमंत्रण</span>
            <p className="text-lg font-devanagari-royal text-[#630514] font-bold my-0.5">{subText}</p>
            <p className="text-xs font-devanagari-serif text-[#b8860b] font-bold">{muhuratText}</p>
            <p className="text-[11px] font-devanagari-serif text-stone-700 mt-1">{revealedText}</p>
          </div>

          {/* Canvas Scratchable layer */}
          {!isRevealed && (
            <canvas
              ref={canvasRef}
              width={288}
              height={176}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleMouseUp}
              className="absolute inset-0 z-10 rounded-2xl cursor-pointer touch-none shadow-md"
            />
          )}
        </div>

        {/* Buttons / Controls */}
        {isRevealed ? (
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-devanagari-serif font-bold bg-emerald-100 px-3.5 py-1 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>शुभ मुहूर्त प्रकट हुआ!</span>
          </div>
        ) : (
          <button
            onClick={handleQuickReveal}
            className="flex items-center gap-1 text-xs font-devanagari-serif font-semibold text-[#87091f] hover:text-[#b22222] underline underline-offset-4 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
            <span>यहाँ क्लिक करके सीधे देखें ({scratchPercent}% खुला)</span>
          </button>
        )}
      </div>
    </div>
  );
};
