// 21st.dev / Magic UI–style building blocks, adapted to the dashboard's dark theme:
// SpotlightCard, NumberTicker, AnimatedTabs, Sparkline, Modal, CopyButton, StatusBadge.
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { Check, Copy, X } from 'lucide-react';
import type { TxStatus } from './state/WalletProvider';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export { cx };

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Card with cursor spotlight that fades, rises and un-blurs as it scrolls into view. */
export const SpotlightCard: React.FC<{
  className?: string;
  beam?: boolean;
  hover?: boolean;
  delay?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ className, beam, hover, delay = 0, style, children }) => (
  <motion.div
    style={style}
    onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
      e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
    }}
    initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
    viewport={{ once: true, amount: 0.12 }}
    transition={{ duration: 0.65, ease: EASE_OUT, delay }}
    whileHover={hover ? { y: -5, transition: { type: 'spring', stiffness: 320, damping: 22 } } : undefined}
    className={cx('d-card d-spot', beam && 'border-beam', className)}
  >
    {children}
  </motion.div>
);

/** Scroll-into-view wrapper for blocks that aren't SpotlightCards (e.g. the chart). */
export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string; y?: number }> = ({ children, delay = 0, className, y = 28 }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.1 }}
    transition={{ duration: 0.7, ease: EASE_OUT, delay }}
  >
    {children}
  </motion.div>
);

/** Spring-animated number that eases toward each new value (Magic UI NumberTicker). */
export const NumberTicker: React.FC<{ value: number; format: (v: number) => string; className?: string }> = ({ value, format, className }) => {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 22, mass: 0.6 });
  const [text, setText] = useState(() => format(value));
  const fmtRef = useRef(format);
  fmtRef.current = format;
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  useEffect(() => spring.on('change', (v) => setText(fmtRef.current(v))), [spring]);
  useEffect(() => setText(fmtRef.current(spring.get())), [format, spring]);
  return <span className={className}>{text}</span>;
};

/** Text that briefly flashes green/red when a number moves. */
export const FlashValue: React.FC<{ value: number; children: React.ReactNode; className?: string }> = ({ value, children, className }) => {
  const prev = useRef(value);
  const [dir, setDir] = useState<'up' | 'down' | null>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (value !== prev.current) {
      setDir(value > prev.current ? 'up' : 'down');
      setN((x) => x + 1);
      prev.current = value;
    }
  }, [value]);
  return (
    <span key={n} className={cx(className, dir === 'up' && 'd-flash-up', dir === 'down' && 'd-flash-down')}>
      {children}
    </span>
  );
};

export function AnimatedTabs<T extends string>({
  tabs,
  value,
  onChange,
  layoutId,
  size = 'md',
}: {
  tabs: { id: T; label: React.ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  layoutId: string;
  size?: 'sm' | 'md';
}) {
  return (
    <div role="tablist" className="inline-flex items-center gap-0.5 rounded-xl border bg-surface-2 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cx(
            'relative rounded-lg font-semibold transition-colors',
            size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs',
            value === t.id ? 'text-[#1a1204]' : 't-muted hover:text-[var(--d-text)]',
          )}
        >
          {value === t.id && (
            <motion.span
              layoutId={layoutId}
              className="absolute inset-0 rounded-lg"
              style={{ background: 'linear-gradient(180deg,#f3d27a,#d9a83a)' }}
              transition={{ type: 'spring', stiffness: 420, damping: 34 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export const Sparkline: React.FC<{ data: number[]; color: string; id: string; height?: number }> = ({ data, color, id, height = 44 }) => (
  <div style={{ height }} className="w-full">
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={`spark-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={['dataMin', 'dataMax']} />
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.6} fill={`url(#spark-${id})`} isAnimationActive={false} dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export const Modal: React.FC<{ open: boolean; onClose: () => void; title: React.ReactNode; subtitle?: React.ReactNode; children: React.ReactNode; width?: string }> = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  width = 'max-w-lg',
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-[var(--d-overlay)] backdrop-blur-sm sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            className={cx('d-card d-scroll max-h-[92vh] w-full overflow-y-auto rounded-b-none sm:rounded-2xl', width)}
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
          >
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-surface px-5 py-4">
              <div>
                <h3 className="font-display text-base font-bold">{title}</h3>
                {subtitle && <p className="t-muted mt-0.5 text-xs">{subtitle}</p>}
              </div>
              <button onClick={onClose} className="d-btn d-btn-ghost !p-1.5" aria-label="Close">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const CopyButton: React.FC<{ text: string; label?: string; className?: string }> = ({ text, label, className }) => {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        setDone(true);
        setTimeout(() => setDone(false), 1800);
      }}
      className={cx('d-btn d-btn-ghost', label ? '' : '!p-2', className)}
      aria-label={label ?? 'Copy'}
    >
      {done ? <Check className="t-up h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label && <span>{done ? 'Copied' : label}</span>}
    </button>
  );
};

const STATUS_STYLE: Record<TxStatus, string> = {
  completed: 'd-chip-up',
  pending: 'd-chip-gold',
  processing: 'd-chip-blue',
  failed: 'd-chip-down',
};

export const StatusBadge: React.FC<{ status: TxStatus; confirmations?: number; required?: number }> = ({ status, confirmations, required }) => (
  <span className={cx('d-chip capitalize', STATUS_STYLE[status])}>
    {status !== 'completed' && status !== 'failed' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />}
    {status}
    {status !== 'completed' && required ? ` ${confirmations ?? 0}/${required}` : ''}
  </span>
);

export const SectionHeader: React.FC<{ title: string; subtitle?: string; right?: React.ReactNode }> = ({ title, subtitle, right }) => (
  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
    <div>
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
      {subtitle && <p className="t-muted mt-1 text-sm">{subtitle}</p>}
    </div>
    {right}
  </div>
);

export const TokenIcon: React.FC<{ asset: 'USDT' | 'MBR'; size?: number }> = ({ asset, size = 28 }) =>
  asset === 'USDT' ? (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, background: '#26A17B', fontSize: size * 0.5 }}
      aria-hidden
    >
      ₮
    </span>
  ) : (
    <img src={`${import.meta.env.BASE_URL}assets/logo-mark.png`} alt="" className="shrink-0 rounded-full bg-[#1a1204] object-contain" style={{ width: size, height: size }} />
  );

/** Section banner: title + copy + optional chips on the left, illustration on the right. */
export const HeroBanner: React.FC<{ title: string; subtitle: string; art: React.ReactNode; children?: React.ReactNode }> = ({ title, subtitle, art, children }) => (
  <SpotlightCard className="overflow-hidden" beam>
    <span className="d-aurora d-aurora-1" />
    <span className="d-aurora d-aurora-2" />
    <div className="relative flex items-center justify-between gap-6 p-6">
      <div className="max-w-xl">
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>
        <p className="t-muted mt-2 text-sm leading-relaxed">{subtitle}</p>
        {children && <div className="mt-4 flex flex-wrap gap-2">{children}</div>}
      </div>
      <div className="hidden h-40 shrink-0 sm:block lg:h-48">{art}</div>
    </div>
  </SpotlightCard>
);
