import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Animated MBR emblem for the hero:
 * Outer golden orbit circle with traveling spark,
 * and a fully-covered edge-to-edge inner logo with periodic 3D flip.
 */
export const HeroCoin: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reduce = useReducedMotion();

  return (
    <div className={`relative h-20 w-20 sm:h-24 sm:w-24 ${className}`} style={{ perspective: 600 }}>
      {/* Soft ambient glow */}
      <motion.span
        className="pointer-events-none absolute -inset-4 rounded-full bg-emerald-500/15 blur-2xl"
        animate={reduce ? undefined : { opacity: [0.3, 0.7, 0.3], scale: [0.94, 1.06, 0.94] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* The outer circle with traveling spark */}
      <div className="pointer-events-none absolute -inset-3 sm:-inset-3.5 flex items-center justify-center">
        <motion.div
          className="relative h-full w-full rounded-full border border-amber-300/40 shadow-[0_0_12px_rgba(245,192,66,0.3)]"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
        >
          {/* Traveling orbital spark */}
          <span className="absolute -top-[3.5px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-200 shadow-[0_0_12px_#fde68a,0_0_4px_#ffffff]" />
        </motion.div>
      </div>

      {/* The emblem — fully covered edge-to-edge, rests then flips on vertical axis */}
      <motion.div
        className="relative h-full w-full flex items-center justify-center"
        style={{ transformStyle: 'preserve-3d' }}
        animate={reduce ? undefined : { rotateY: [0, 0, 360] }}
        transition={{ duration: 6, times: [0, 0.72, 1], repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(0,0,0,0.3)]">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo-320.png`}
            alt="MyBitRich Emblem"
            className="h-full w-full object-contain scale-[1.01]"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default HeroCoin;
