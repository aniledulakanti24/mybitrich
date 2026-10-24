import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useSpring, type Variants } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1] as const;

/* BlurFade — content rises in from a soft blur when scrolled into view */
interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: 'div' | 'section';
}

export const BlurFade: React.FC<BlurFadeProps> = ({ children, className, delay = 0, y = 18, as = 'div' }) => {
  const Comp = as === 'section' ? motion.section : motion.div;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </Comp>
  );
};

/* WordReveal — staggers each word of a headline in from below with blur */
const wordContainer: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
};
const wordItem: Variants = {
  hidden: { opacity: 0, y: '0.45em', filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE }, transitionEnd: { filter: 'none' } },
};

interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: (word: string, index: number) => string | undefined;
  stagger?: number;
  delay?: number;
}

export const WordReveal: React.FC<WordRevealProps> = ({ text, className, wordClassName, stagger = 0.06, delay = 0 }) => (
  <motion.span
    className={className}
    variants={wordContainer}
    custom={stagger}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    transition={{ delayChildren: delay }}
    style={{ display: 'inline-block' }}
  >
    {text.split(' ').map((word, i) => (
      <motion.span key={`${word}-${i}`} variants={wordItem} className={wordClassName?.(word, i)} style={{ display: 'inline-block', whiteSpace: 'pre' }}>
        {word}{i < text.split(' ').length - 1 ? ' ' : ''}
      </motion.span>
    ))}
  </motion.span>
);

/* NumberTicker — springs a number up from zero once visible */
interface NumberTickerProps {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({ value, decimals = 0, prefix = '', suffix = '', className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 40, stiffness: 90 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);

  useEffect(() => spring.on('change', (v) => setDisplay(v)), [spring]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}
      {suffix}
    </span>
  );
};

/* AnimatedBadge — pill with a sliding sheen, used for section eyebrows */
export const AnimatedBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span
    className={`relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-slate-200 bg-white px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-sm ${className}`}
  >
    <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-gold-100/80 to-transparent animate-shimmer-slide" />
    <span className="relative inline-flex items-center gap-2">{children}</span>
  </span>
);
