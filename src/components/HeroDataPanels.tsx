import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users } from 'lucide-react';
import { TOKEN_INFO, REFERRAL_TIERS } from '../data/tokenData';
import { NumberTicker } from './ui/motion-primitives';

/**
 * Glass data cards that flank the hero globe on large screens,
 * collapsing to a compact stat grid below it on smaller ones.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

// Illustrative 7-day trend for the sparkline (rises toward the current +18.4% day)
const SPARK = [18, 22, 19, 26, 24, 31, 29, 35, 33, 41, 38, 47, 52, 49, 58, 63];
const sparkPath = (() => {
  const w = 200;
  const h = 44;
  const max = Math.max(...SPARK);
  const min = Math.min(...SPARK);
  return SPARK.map((v, i) => {
    const x = (i / (SPARK.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * (h - 4) - 2;
    return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ');
})();

const Card: React.FC<{
  children: React.ReactNode;
  side: 'left' | 'right';
  delay: number;
  floatDelay: number;
  className?: string;
}> = ({ children, side, delay, floatDelay, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, x: side === 'left' ? -30 : 30, filter: 'blur(8px)' }}
    animate={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
    transition={{ duration: 1, delay, ease: EASE }}
    className={`relative ${className}`}
  >
    <div className="animate-float-slow" style={{ animationDelay: `${floatDelay}s` }}>
      <div className="relative w-[230px] rounded-2xl border border-white/10 bg-[#0A1430]/70 p-4 text-left shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl xl:w-[268px]">
        {/* connector pointing toward the globe */}
        <span
          className={`pointer-events-none absolute top-1/2 hidden h-px w-14 xl:block ${
            side === 'left' ? '-right-14 bg-gradient-to-r from-white/25 to-transparent' : '-left-14 bg-gradient-to-l from-white/25 to-transparent'
          }`}
        />
        <span
          className={`pointer-events-none absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-amber-300 shadow-[0_0_8px_#f5c042] xl:block ${
            side === 'left' ? '-right-[58px]' : '-left-[58px]'
          }`}
        />
        {children}
      </div>
    </div>
  </motion.div>
);

const Label: React.FC<{ icon: React.ElementType; children: React.ReactNode; tone?: string }> = ({ icon: Icon, children, tone = 'text-amber-300' }) => (
  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
    <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
      <Icon className={`h-3.5 w-3.5 ${tone}`} />
    </span>
    {children}
  </div>
);

const MarketCard: React.FC = () => (
  <>
    <div className="flex items-center justify-between">
      <Label icon={TrendingUp} tone="text-emerald-400">MBR / USDT</Label>
      <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
      </span>
    </div>
    <div className="mt-3 flex items-end justify-between">
      <div className="font-display text-2xl font-bold text-white">{TOKEN_INFO.currentPrice}</div>
      <div className="text-xs font-semibold text-emerald-400">+18.4% · 24h</div>
    </div>
    <svg viewBox="0 0 200 44" className="mt-2 h-11 w-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={`${sparkPath} L200 44 L0 44 Z`}
        fill="url(#spark-fill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
      />
      <motion.path
        d={sparkPath}
        fill="none"
        stroke="#34D399"
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 1.6, ease: 'easeInOut' }}
      />
    </svg>
    <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">Market cap</div>
        <div className="text-sm font-semibold text-white">{TOKEN_INFO.marketCap}</div>
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-slate-500">24h volume</div>
        <div className="text-sm font-semibold text-white">$840,000</div>
      </div>
    </div>
  </>
);

const HoldersCard: React.FC = () => (
  <>
    <Label icon={Users} tone="text-sky-300">Community</Label>
    <div className="mt-3 flex items-baseline gap-2">
      <NumberTicker value={parseInt(TOKEN_INFO.holders.replace(/\D/g, ''), 10)} suffix="+" className="font-display text-2xl font-bold text-white" />
      <span className="text-xs text-slate-400">holders</span>
    </div>
    <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
      <div className="text-[10px] uppercase tracking-wider text-slate-500">3-tier referral rewards</div>
      <div className="flex gap-1.5">
        {REFERRAL_TIERS.map((t) => (
          <div key={t.level} className="flex-1 rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1.5 text-center">
            <div className="text-[9px] text-slate-500">L{t.level}</div>
            <div className="text-xs font-semibold text-amber-200">{t.pct.toFixed(1)}%</div>
          </div>
        ))}
      </div>
    </div>
  </>
);

/** Absolutely positioned side columns — render inside a `relative` stage. */
export const HeroDataPanels: React.FC = () => (
  <div className="pointer-events-none absolute inset-0 z-20 mx-auto hidden max-w-[1320px] items-center justify-between px-4 lg:flex xl:px-8">
    <div className="pointer-events-auto">
      <Card side="left" delay={0.9} floatDelay={0}>
        <MarketCard />
      </Card>
    </div>
    <div className="pointer-events-auto">
      <Card side="right" delay={1.05} floatDelay={1.4}>
        <HoldersCard />
      </Card>
    </div>
  </div>
);

/** Compact grid shown under the globe on phones and tablets. */
export const HeroDataGrid: React.FC = () => {
  const items = [
    { label: 'Price', value: TOKEN_INFO.currentPrice, note: '+18.4% · 24h', tone: 'text-emerald-400' },
    { label: 'Holders', value: TOKEN_INFO.holders, note: '3-tier referrals', tone: 'text-sky-300' },
  ];
  return (
    <div className="relative z-20 mx-auto grid max-w-xl grid-cols-2 gap-3 px-4 pb-12 lg:hidden">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + i * 0.08, duration: 0.7, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-[#0A1430]/70 p-3.5 backdrop-blur-xl"
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">{it.label}</div>
          <div className="mt-1 font-display text-lg font-bold text-white">{it.value}</div>
          <div className={`text-[11px] font-medium ${it.tone}`}>{it.note}</div>
        </motion.div>
      ))}
    </div>
  );
};
