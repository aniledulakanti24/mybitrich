import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated MBR coin emblem for the hero: turning gold rim, periodic 3D flip,
 * light sweep across the face, breathing glow and an orbiting spark.
 */
export const HeroCoin: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reduce = useReducedMotion();

  return (
    <div className={`relative h-20 w-20 sm:h-24 sm:w-24 ${className}`} style={{ perspective: 600 }}>
      {/* breathing glow */}
      <motion.span
        className="pointer-events-none absolute -inset-4 rounded-full bg-amber-400/30 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.35, 0.85, 0.35], scale: [0.92, 1.08, 0.92] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* orbit track with a travelling spark */}
      <motion.span
        className="pointer-events-none absolute -inset-3 rounded-full border border-amber-300/20"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
      >
        <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_10px_#fcd34d]" />
      </motion.span>

      {/* the coin — rests, then flips once on its vertical axis */}
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduce ? undefined : { rotateY: [0, 0, 360] }}
        transition={{ duration: 6, times: [0, 0.72, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      >
        {/* turning gold rim */}
        <motion.span
          className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(245,192,66,0.35)]"
          style={{ background: 'conic-gradient(from 0deg, #FDE68A, #D97706, #FFF3C4, #B45309, #F5C042, #FDE68A)' }}
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
        />
        {/* face */}
        <div className="absolute inset-[4px] overflow-hidden rounded-full bg-white p-2.5 shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]">
          <img src="/assets/logo.png" alt="MyBitRich Gold Coin" className="h-full w-full object-contain" />
          {/* light sweep */}
          <motion.span
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/80 to-transparent"
            style={{ skewX: -20 }}
            animate={reduce ? undefined : { x: ['0%', '400%'] }}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut', delay: 0.8 }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroCoin;
