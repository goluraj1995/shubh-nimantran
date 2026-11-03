import React from 'react';

export type ButterflyAnimationStyle = 
  | 'natural_flying'
  | 'garden_butterflies'
  | 'gentle_floating'
  | 'butterfly_swarm'
  | 'colorful_wings'
  | 'romantic'
  | 'golden_garden'
  | 'card_border'
  | 'free_flying'
  | 'mixed';

export type ButterflyCountLevel = 'low' | 'medium' | 'high';
export type ButterflySizeLevel = 'small' | 'normal' | 'large';

interface ButterflyAnimationProps {
  enabled: boolean;
  styleType?: ButterflyAnimationStyle;
  countLevel?: ButterflyCountLevel;
  sizeLevel?: ButterflySizeLevel;
  isCard?: boolean;
  className?: string;
}

export const ButterflyAnimation: React.FC<ButterflyAnimationProps> = ({
  enabled,
  styleType = 'natural_flying',
  countLevel = 'medium',
  sizeLevel = 'normal',
  isCard = false,
  className = ''
}) => {
  if (!enabled) return null;

  let baseCount = 12;
  if (countLevel === 'low') baseCount = isCard ? 4 : 8;
  if (countLevel === 'medium') baseCount = isCard ? 6 : 12;
  if (countLevel === 'high') baseCount = isCard ? 10 : 16;

  let sizeMin = 45;
  let sizeMax = 75;
  if (sizeLevel === 'small') { sizeMin = 32; sizeMax = 50; }
  if (sizeLevel === 'large') { sizeMin = 70; sizeMax = 100; }
  if (isCard) { 
    sizeMin = Math.round(sizeMin * 0.75); 
    sizeMax = Math.round(sizeMax * 0.75); 
  }

  const butterflies = Array.from({ length: baseCount }).map((_, i) => {
    const id = i;
    const fileIndex = (i % 12) + 1;
    const assetUrl = './butterflies/' + fileIndex + '.png';

    // Distribute along edges/corners so center card text/photo remains clear and readable
    const isEdgeLeft = i % 2 === 0;
    const top = styleType === 'card_border' || isCard
      ? String(10 + (i * 14) % 80) + '%'
      : String(8 + (i * 13) % 78) + '%';
    
    const left = isEdgeLeft
      ? String(2 + (i * 7) % 18) + '%' 
      : String(80 + (i * 7) % 18) + '%';

    const size = sizeMin + (i * 4) % (sizeMax - sizeMin + 1);
    const duration = 16 + (i * 3) % 12;
    const delay = i * 1.2;
    
    // Unique flap duration and phase offset per butterfly to prevent synchronized robotic flapping
    const flapDuration = 0.28 + (i * 0.03) % 0.18; // 0.28s to 0.46s
    const flapDelay = (i * 0.15) % 0.5;

    const paths = ['animate-natural-drift', 'animate-glide-path-1', 'animate-glide-path-2', 'animate-glide-path-3'];
    const pathClass = paths[i % paths.length];

    return { id, assetUrl, top, left, size, duration, delay, pathClass, flapDuration, flapDelay };
  });

  return (
    <div className={'absolute inset-0 overflow-hidden pointer-events-none z-20 motion-reduce:hidden ' + className}>
      {butterflies.map((b) => (
        <div
          key={b.id}
          className={'absolute ' + b.pathClass}
          style={{
            top: b.top,
            left: b.left,
            animationDuration: b.duration + 's',
            animationDelay: b.delay + 's',
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            width: b.size + 'px',
            height: b.size + 'px'
          }}
        >
          <div 
            className="w-full h-full animate-wing-flap-3d filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.25)] origin-center select-none"
            style={{
              animationDuration: b.flapDuration + 's',
              animationDelay: b.flapDelay + 's'
            }}
          >
            <img
              src={b.assetUrl}
              alt={'Butterfly Specimen ' + String(b.id + 1)}
              className="w-full h-full object-contain pointer-events-none select-none"
              onError={(e) => {
                console.error('Failed to load butterfly image: ' + b.assetUrl);
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};