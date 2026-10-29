// Original flat line-art illustrations (navy outlines, blue accents, soft circle backdrop).
// Colours come from --ill-* tokens in dashboard.css so they work in light and dark themes.
import React, { useId } from 'react';
import { motion } from 'framer-motion';

type Hair = 'short' | 'curly' | 'long' | 'bun';
type Shirt = 'ink' | 'blue' | 'gold';

const float = (delay = 0, dist = 4) => ({
  animate: { y: [0, -dist, 0] },
  transition: { duration: 4.5, repeat: Infinity, ease: 'easeInOut' as const, delay },
});

/** Head-and-shoulders figure. (x, y) is the centre of the head. */
const Person: React.FC<{ x: number; y: number; s?: number; hair: Hair; shirt: Shirt; glasses?: 'round' | 'square'; look?: number; delay?: number }> = ({
  x,
  y,
  s = 1,
  hair,
  shirt,
  glasses,
  look = 0,
  delay = 0,
}) => (
  <motion.g {...float(delay, 3)}>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {hair === 'long' && <path className="ill-ink" d="M-26,-6 C-31,28 -34,52 -18,64 L18,64 C34,52 31,28 26,-6 Z" />}
      <path className={`ill-${shirt} ill-line`} strokeWidth={2.5} d="M-60,130 C-60,74 -38,48 0,48 C38,48 60,74 60,130 Z" />
      {shirt === 'blue' && <path className="ill-stroke" strokeWidth={2.5} d="M-13,48 L0,64 L13,48" />}
      {shirt !== 'blue' && <path className="ill-stroke-soft" strokeWidth={2} d="M-30,72 C-26,88 -26,104 -28,126 M30,72 C26,88 26,104 28,126" />}
      <path className="ill-skin ill-line" strokeWidth={2.5} d="M-9,16 L-9,50 Q0,56 9,50 L9,16 Z" />
      <ellipse className="ill-skin ill-line" strokeWidth={2.5} cx={20} cy={4} rx={4.5} ry={6.5} />
      <ellipse className="ill-skin ill-line" strokeWidth={2.5} cx={0} cy={0} rx={21} ry={24} />
      {hair === 'short' && <path className="ill-ink" d="M-23,3 C-28,-22 -12,-35 4,-31 C17,-37 31,-24 24,-1 C20,-12 12,-16 4,-15 C-6,-21 -16,-12 -23,3 Z" />}
      {hair === 'curly' && (
        <g className="ill-ink">
          <circle cx={-15} cy={-15} r={11} />
          <circle cx={-2} cy={-24} r={12} />
          <circle cx={12} cy={-21} r={11} />
          <circle cx={21} cy={-9} r={8} />
          <circle cx={-22} cy={-3} r={7} />
        </g>
      )}
      {hair === 'long' && <path className="ill-ink" d="M-23,2 C-25,-26 -6,-35 8,-31 C23,-28 29,-12 23,3 C13,-7 -5,-15 -23,2 Z" />}
      {hair === 'bun' && (
        <g className="ill-ink">
          <circle cx={2} cy={-33} r={10} />
          <path d="M-22,0 C-25,-24 -8,-31 4,-29 C18,-30 27,-18 22,0 C14,-12 -6,-16 -22,0 Z" />
        </g>
      )}
      <circle className="ill-ink" cx={-7 + look * 2} cy={2} r={2.2} />
      <circle className="ill-ink" cx={7 + look * 2} cy={2} r={2.2} />
      <path className="ill-stroke" strokeWidth={2} d={`M${1 + look},5 Q${4 + look},9 ${look},10`} />
      <path className="ill-stroke" strokeWidth={2.2} d="M-6,13 Q0,18 6,13" />
      {glasses === 'round' && (
        <g className="ill-glass" strokeWidth={2.2}>
          <circle cx={-8} cy={2} r={7} />
          <circle cx={8} cy={2} r={7} />
          <path d="M-1,2 L1,2 M15,1 L21,-1" />
        </g>
      )}
      {glasses === 'square' && (
        <g className="ill-stroke" strokeWidth={2.4}>
          <rect x={-15} y={-3} width={13} height={10} rx={2} />
          <rect x={2} y={-3} width={13} height={10} rx={2} />
          <path d="M-2,1 L2,1 M15,0 L21,-1" />
        </g>
      )}
    </g>
  </motion.g>
);

const Sparkle: React.FC<{ x: number; y: number; delay?: number; size?: number }> = ({ x, y, delay = 0, size = 1 }) => (
  <motion.g
    style={{ originX: `${x}px`, originY: `${y}px` }}
    animate={{ scale: [0.6, 1.1, 0.6], opacity: [0.4, 1, 0.4] }}
    transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
  >
    <path className="ill-gold" d={`M${x},${y - 7 * size} L${x + 2 * size},${y - 2 * size} L${x + 7 * size},${y} L${x + 2 * size},${y + 2 * size} L${x},${y + 7 * size} L${x - 2 * size},${y + 2 * size} L${x - 7 * size},${y} L${x - 2 * size},${y - 2 * size} Z`} />
  </motion.g>
);

const Coin: React.FC<{ x: number; y: number; r?: number; delay?: number }> = ({ x, y, r = 12, delay = 0 }) => (
  <motion.g {...float(delay, 5)}>
    <circle className="ill-gold ill-line" strokeWidth={2.5} cx={x} cy={y} r={r} />
    <circle className="ill-stroke-gold" strokeWidth={1.8} cx={x} cy={y} r={r * 0.62} />
    <text x={x} y={y + r * 0.32} textAnchor="middle" className="ill-coin-text" style={{ fontSize: r * 0.9 }}>$</text>
  </motion.g>
);

const Frame: React.FC<{ viewBox: string; ground: number; width: number; children: (clip: string) => React.ReactNode; className?: string; label: string }> = ({ viewBox, ground, width, children, className, label }) => {
  const id = useId().replace(/:/g, '');
  return (
    <svg viewBox={viewBox} className={className} role="img" aria-label={label}>
      <defs>
        <clipPath id={`c${id}`}>
          <rect x={0} y={0} width={width} height={ground} />
        </clipPath>
      </defs>
      {children(`url(#c${id})`)}
      <path className="ill-stroke" strokeWidth={2.5} d={`M${width * 0.06},${ground} L${width * 0.94},${ground}`} />
    </svg>
  );
};

/** Overview hero: an investor next to a rising bar chart with coins. */
export const GrowthIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <Frame viewBox="0 0 320 220" ground={204} width={320} className={className} label="Investor watching their MBR grow">
    {(clip) => (
      <>
        <circle className="ill-bg" cx={172} cy={112} r={96} />
        <g clipPath={clip}>
          {[{ x: 176, h: 46 }, { x: 206, h: 72 }, { x: 236, h: 98 }, { x: 266, h: 130 }].map((b, i) => (
            <motion.rect
              key={b.x}
              className={i === 3 ? 'ill-blue ill-line' : 'ill-panel ill-line'}
              strokeWidth={2.5}
              x={b.x}
              width={22}
              rx={4}
              initial={{ y: 204, height: 0 }}
              animate={{ y: 204 - b.h, height: b.h }}
              transition={{ delay: 0.2 + i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          <motion.path
            className="ill-stroke-gold"
            strokeWidth={3}
            strokeLinecap="round"
            d="M168,150 L198,128 L226,112 L252,88 L284,58"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, duration: 0.9 }}
          />
          <motion.path className="ill-stroke-gold" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" d="M272,56 L285,57 L283,70" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} />
          <Person x={100} y={104} s={0.95} hair="short" shirt="blue" glasses="square" look={1} />
        </g>
        <Coin x={292} y={30} r={13} delay={0.4} />
        <Coin x={150} y={40} r={9} delay={1.2} />
        <Sparkle x={58} y={58} delay={0.3} />
        <Sparkle x={248} y={34} delay={1.1} size={0.8} />
      </>
    )}
  </Frame>
);

/** Team: three members linked as a referral network. */
export const TeamIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <Frame viewBox="0 0 320 220" ground={204} width={320} className={className} label="Your referral team">
    {(clip) => (
      <>
        <circle className="ill-bg" cx={160} cy={118} r={94} />
        <motion.path
          className="ill-dash"
          strokeWidth={2}
          d="M78,58 Q160,4 242,58"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
        />
        <g clipPath={clip}>
          <Person x={160} y={88} s={0.92} hair="curly" shirt="blue" look={0} delay={0.6} />
          <Person x={78} y={122} s={0.88} hair="long" shirt="ink" glasses="round" look={1} delay={0} />
          <Person x={242} y={122} s={0.88} hair="bun" shirt="gold" look={-1} delay={1.2} />
        </g>
        <Coin x={160} y={18} r={10} delay={0.2} />
        <Sparkle x={112} y={40} delay={0.5} size={0.8} />
        <Sparkle x={210} y={40} delay={1.4} size={0.8} />
      </>
    )}
  </Frame>
);

/** Rewards: a coin plant growing beside a happy holder. */
export const RewardsIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <Frame viewBox="0 0 320 220" ground={204} width={320} className={className} label="Holding rewards growing">
    {(clip) => (
      <>
        <circle className="ill-bg" cx={160} cy={116} r={94} />
        <g clipPath={clip}>
          <Person x={110} y={108} s={0.95} hair="bun" shirt="ink" glasses="round" look={1} />
          <path className="ill-blue ill-line" strokeWidth={2.5} d="M204,204 L198,166 L262,166 L256,204 Z" />
          <motion.path
            className="ill-stroke"
            strokeWidth={3}
            strokeLinecap="round"
            d="M230,166 C230,140 226,120 232,92"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9 }}
          />
          <motion.path className="ill-leaf ill-line" strokeWidth={2} d="M230,140 C214,138 206,128 206,118 C220,118 230,126 230,140 Z" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} style={{ originX: '230px', originY: '140px' }} />
          <motion.path className="ill-leaf ill-line" strokeWidth={2} d="M231,120 C246,118 254,108 254,98 C240,98 231,106 231,120 Z" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }} style={{ originX: '231px', originY: '120px' }} />
        </g>
        <Coin x={232} y={78} r={15} delay={0} />
        <Coin x={268} y={112} r={9} delay={0.8} />
        <Coin x={196} y={96} r={8} delay={1.4} />
        <Sparkle x={262} y={56} delay={0.2} />
        <Sparkle x={62} y={60} delay={1} size={0.8} />
      </>
    )}
  </Frame>
);

/** Empty states: an open box with sparkles. */
export const EmptyIllustration: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 200 150" className={className} role="img" aria-label="Nothing here yet">
    <circle className="ill-bg" cx={100} cy={78} r={62} />
    <motion.g {...float(0, 4)}>
      <path className="ill-panel ill-line" strokeWidth={2.5} d="M58,74 L100,58 L142,74 L142,118 L100,134 L58,118 Z" />
      <path className="ill-blue ill-line" strokeWidth={2.5} d="M58,74 L100,90 L142,74 L100,58 Z" />
      <path className="ill-stroke" strokeWidth={2.5} d="M100,90 L100,134" />
      <path className="ill-panel ill-line" strokeWidth={2.5} d="M58,74 L44,60 L86,44 L100,58 Z M142,74 L156,60 L114,44 L100,58 Z" />
    </motion.g>
    <Sparkle x={70} y={30} delay={0.2} />
    <Sparkle x={138} y={26} delay={1} size={0.8} />
    <Coin x={100} y={24} r={9} delay={0.5} />
  </svg>
);
