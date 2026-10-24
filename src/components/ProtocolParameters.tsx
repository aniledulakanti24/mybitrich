import React from 'react';
import { motion } from 'framer-motion';
import { Coins, Percent, Users, Lock, Target, TrendingUp } from 'lucide-react';
import { TOKEN_INFO, REFERRAL_TIERS } from '../data/tokenData';
import { NumberTicker } from './ui/motion-primitives';
import { Disclaimer } from './ui/Disclaimer';

/** "At a glance" strip — the six protocol parameters from the official site, each with a tiny animated visual. */

const EASE = [0.16, 1, 0.3, 1] as const;
const inView = { once: true, margin: '-60px' } as const;

// Share of the 2025 → mid-2030 lock period that has elapsed
const LOCK_ELAPSED = Math.min(1, Math.max(0.03, (new Date().getFullYear() + new Date().getMonth() / 12 - 2025) / 5.5));
const lockPct = `${(LOCK_ELAPSED * 100).toFixed(0)}%`;

const Bar: React.FC<{ width: string; className: string; delay?: number }> = ({ width, className, delay = 0 }) => (
  <motion.div
    className={`h-full rounded-full ${className}`}
    initial={{ width: 0 }}
    whileInView={{ width }}
    viewport={inView}
    transition={{ duration: 1, delay: 0.3 + delay, ease: EASE }}
  />
);

const SupplyVisual = () => (
  <div>
    <div className="h-1.5 overflow-hidden rounded-full bg-gold-100">
      <Bar width="100%" className="bg-gradient-to-r from-gold-300 to-gold-500" />
    </div>
    <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
      <span>Fixed</span>
      <span>150,000,000</span>
    </div>
  </div>
);

const TaxVisual = () => (
  <div>
    <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-slate-100">
      <Bar width="33%" className="bg-amber-400" />
      <Bar width="33%" className="bg-emerald-400" delay={0.15} />
      <Bar width="33%" className="bg-blue-500" delay={0.3} />
    </div>
    <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
      <span>2% · 2% · 2%</span>
      <span>each side</span>
    </div>
  </div>
);

const ReferralVisual = () => (
  <div className="flex h-7 items-end gap-1.5">
    {REFERRAL_TIERS.map((t, i) => (
      <motion.div
        key={t.level}
        className="flex-1 rounded-t-md bg-gradient-to-t from-sky-500 to-sky-300"
        initial={{ height: 0 }}
        whileInView={{ height: `${(t.pct / 1) * 100}%` }}
        viewport={inView}
        transition={{ duration: 0.8, delay: 0.3 + i * 0.12, ease: EASE }}
        title={`Level ${t.level}: ${t.pct}%`}
      />
    ))}
  </div>
);

const LockVisual = () => (
  <div>
    <div className="relative h-1.5 rounded-full bg-emerald-100">
      <Bar width={lockPct} className="bg-gradient-to-r from-emerald-500 to-emerald-400" />
      <motion.span
        className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500 shadow"
        initial={{ left: '0%' }}
        whileInView={{ left: `calc(${lockPct} - 6px)` }}
        viewport={inView}
        transition={{ duration: 1, delay: 0.3, ease: EASE }}
      />
    </div>
    <div className="mt-1.5 flex justify-between text-[10px] text-slate-400">
      <span>2025</span>
      <span>2030–31</span>
    </div>
  </div>
);

const PriceVisual = () => (
  <svg viewBox="0 0 120 28" className="h-7 w-full overflow-visible">
    <motion.path
      d="M2 25 C 30 24, 45 20, 62 15 S 95 6, 118 3"
      fill="none"
      stroke="url(#price-grad)"
      strokeWidth="2.2"
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={inView}
      transition={{ duration: 1.4, delay: 0.3, ease: 'easeInOut' }}
    />
    <motion.circle
      cx="118"
      cy="3"
      r="3"
      fill="#C08F1E"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={inView}
      transition={{ delay: 1.6, type: 'spring', stiffness: 300 }}
    />
    <defs>
      <linearGradient id="price-grad" x1="0" x2="1">
        <stop offset="0%" stopColor="#E5C46B" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#C08F1E" />
      </linearGradient>
    </defs>
  </svg>
);

const McapVisual = () => (
  <div className="flex h-7 items-end gap-1">
    {[18, 26, 34, 46, 60, 78, 100].map((h, i) => (
      <motion.div
        key={h}
        className="flex-1 rounded-t-sm bg-gradient-to-t from-indigo-500 to-indigo-300"
        style={{ opacity: 0.35 + i * 0.1 }}
        initial={{ height: 0 }}
        whileInView={{ height: `${h}%` }}
        viewport={inView}
        transition={{ duration: 0.7, delay: 0.3 + i * 0.07, ease: EASE }}
      />
    ))}
  </div>
);

interface Param {
  label: string;
  value: React.ReactNode;
  note: string;
  icon: React.ElementType;
  tone: string;
  glow: string;
  visual: React.ReactNode;
}

const PARAMS: Param[] = [
  {
    label: 'Total supply',
    value: <NumberTicker value={150} suffix="M" />,
    note: '15 Cr MBR',
    icon: Coins,
    tone: 'text-gold-600 bg-gold-50 ring-gold-100',
    glow: 'from-gold-100/80',
    visual: <SupplyVisual />,
  },
  {
    label: 'Buy / sell tax',
    value: (
      <>
        <NumberTicker value={6} suffix="%" /> / <NumberTicker value={6} suffix="%" />
      </>
    ),
    note: 'Holders · LP · Marketing',
    icon: Percent,
    tone: 'text-blue-700 bg-blue-50 ring-blue-100',
    glow: 'from-blue-100/80',
    visual: <TaxVisual />,
  },
  {
    label: 'Buy referral',
    value: <NumberTicker value={2} suffix="%" />,
    note: REFERRAL_TIERS.map((t) => `L${t.level} ${t.pct}%`).join(' · '),
    icon: Users,
    tone: 'text-sky-700 bg-sky-50 ring-sky-100',
    glow: 'from-sky-100/80',
    visual: <ReferralVisual />,
  },
  {
    label: 'LP lock',
    value: <NumberTicker value={TOKEN_INFO.liquidityLockedYears} suffix=" yrs" />,
    note: 'Until 2030–31',
    icon: Lock,
    tone: 'text-emerald-700 bg-emerald-50 ring-emerald-100',
    glow: 'from-emerald-100/80',
    visual: <LockVisual />,
  },
  {
    label: `${TOKEN_INFO.targetYear} price`,
    value: <NumberTicker value={TOKEN_INFO.targetPriceUsd} prefix="$" />,
    note: 'USD per token',
    icon: Target,
    tone: 'text-gold-600 bg-gold-50 ring-gold-100',
    glow: 'from-gold-100/80',
    visual: <PriceVisual />,
  },
  {
    label: `${TOKEN_INFO.targetYear} mcap`,
    value: <NumberTicker value={300} prefix="$" suffix="B" />,
    note: 'USD target',
    icon: TrendingUp,
    tone: 'text-indigo-700 bg-indigo-50 ring-indigo-100',
    glow: 'from-indigo-100/80',
    visual: <McapVisual />,
  },
];

export const ProtocolParameters: React.FC = () => (
  <section className="section-cream relative overflow-hidden border-b border-slate-200 py-16 sm:py-20">
    <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-50" />
    <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">At a glance</div>
          <h2 className="mt-1 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Protocol parameters</h2>
        </motion.div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white/80 px-3 py-1">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Trading is live
          </span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">MBR · BNB Smart Chain</span>
          <span className="rounded-full border border-slate-200 bg-white/80 px-3 py-1">100% initial LP locked</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6">
        {PARAMS.map((p, i) => {
          const Icon = p.icon;
          return (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 22, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
              viewport={inView}
              transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
              className="luxe-card group flex flex-col overflow-hidden p-4 sm:p-5"
            >
              {/* soft tinted wash that brightens on hover */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${p.glow} to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100`}
              />
              <div
                className={`relative mb-4 flex h-9 w-9 items-center justify-center rounded-xl ring-4 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${p.tone}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="relative text-[11px] font-semibold uppercase tracking-wider text-slate-500">{p.label}</div>
              <div className="relative mt-1 whitespace-nowrap font-display text-2xl font-extrabold tabular-nums text-slate-900 sm:text-[26px]">{p.value}</div>
              <div className="relative mt-0.5 text-xs text-slate-500">{p.note}</div>
              <div className="relative mt-auto pt-4">{p.visual}</div>
            </motion.div>
          );
        })}
      </div>

      <Disclaimer topic="target" compact className="mt-8" />
    </div>
  </section>
);

export default ProtocolParameters;
