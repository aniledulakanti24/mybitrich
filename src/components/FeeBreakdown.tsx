import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Droplets, Megaphone, ArrowRight, Wallet } from 'lucide-react';
import { NumberTicker } from './ui/motion-primitives';

/**
 * Interactive explainer for the 6% buy / sell fee: pick a side and a trade size,
 * see 94% reach the trader and the 6% fan out into its three 2% streams.
 */

type Side = 'buy' | 'sell';
const EASE = [0.16, 1, 0.3, 1] as const;
const SIZES = [1_000, 10_000, 100_000];

const STREAMS = [
  {
    key: 'holders',
    title: 'Holders redistribution',
    pct: 2,
    icon: Users,
    bar: 'from-amber-300 to-amber-500',
    dot: 'bg-amber-400',
    tint: 'bg-amber-50 text-amber-700 ring-amber-200',
    body: 'Every market buy and sell allocates 2% to holders — passive rewards that grow with trading volume, with no staking or claiming.',
  },
  {
    key: 'lp',
    title: 'Auto-liquidity injection',
    pct: 2,
    icon: Droplets,
    bar: 'from-emerald-300 to-emerald-500',
    dot: 'bg-emerald-400',
    tint: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    body: 'A sustained price floor: liquidity deepens on every swap, which reduces volatility, lowers slippage, and supports larger trades.',
  },
  {
    key: 'treasury',
    title: 'Marketing & treasury',
    pct: 2,
    icon: Megaphone,
    bar: 'from-blue-400 to-blue-600',
    dot: 'bg-blue-500',
    tint: 'bg-blue-50 text-blue-700 ring-blue-200',
    body: 'Funds exchange listings, global partnerships, smart contract audits, and platform development.',
  },
];

const fmt = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 0 });

export const FeeBreakdown: React.FC = () => {
  const [side, setSide] = useState<Side>('buy');
  const [size, setSize] = useState(SIZES[1]);
  const youGet = size * 0.94;
  const fee = size * 0.06;

  return (
    <div className="luxe-card relative overflow-hidden p-6 sm:p-10">
      {/* ambient */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-100/70 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-72 w-72 rounded-full bg-blue-100/70 blur-[90px]" />

      <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* copy */}
        <div className="space-y-4 lg:col-span-7">
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
            <TrendingUp className="h-4 w-4" />
            The billionaire compound curve
          </span>
          <h3 className="font-display text-2xl font-extrabold leading-tight text-slate-900 sm:text-4xl">
            Why buying &amp; holding beats speculative trading
          </h3>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Every buy and every sell carries a <strong className="text-slate-900">6% fee</strong>, split evenly three ways:{' '}
            <strong className="text-amber-700">2% to holders</strong>, <strong className="text-emerald-700">2% to liquidity</strong>, and{' '}
            <strong className="text-blue-700">2% to marketing &amp; treasury</strong>. Holders earn from other people&rsquo;s trades — the longer
            you hold, the more volume you collect from.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <a href="#/calculator" className="btn-gold group inline-flex items-center gap-2 px-6 py-3 text-sm">
              Simulate wealth ROI <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a href="#/tokenomics" className="btn-glass inline-flex items-center px-6 py-3 text-sm">
              Full tokenomics
            </a>
          </div>
        </div>

        {/* controls */}
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur lg:col-span-5">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Try a trade</span>
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              {(['buy', 'sell'] as Side[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setSide(s)}
                  className={`relative rounded-full px-4 py-1.5 capitalize transition-colors ${side === s ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {side === s && (
                    <motion.span layoutId="fee-breakdown-side" className="absolute inset-0 rounded-full bg-gradient-to-b from-[#17306A] to-[#0F2349]" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />
                  )}
                  <span className="relative">{s}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`rounded-xl border px-2 py-2 text-xs font-semibold tabular-nums transition-all ${
                  size === s ? 'border-gold-400 bg-gold-50 text-gold-700 shadow-sm' : 'border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                {fmt(s)} MBR
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <Wallet className="h-3.5 w-3.5" /> {side === 'buy' ? 'You receive' : 'Swapped for you'}
              </div>
              <div className="font-display text-3xl font-extrabold tabular-nums text-slate-900">
                <NumberTicker value={youGet} />
                <span className="ml-1 text-sm font-semibold text-slate-400">MBR</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">6% fee</div>
              <div className="font-display text-xl font-bold tabular-nums text-gold-600">
                <NumberTicker value={fee} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* zoom bar: 94 / 6, with the 6% fanning out into 2 / 2 / 2 */}
      <div className="relative mt-10">
        <div className="flex h-11 overflow-hidden rounded-2xl ring-1 ring-slate-200">
          <motion.div
            className="flex items-center bg-gradient-to-r from-[#17306A] to-[#0F2349] px-4 text-xs font-semibold text-white"
            initial={{ width: '0%' }}
            whileInView={{ width: '94%' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <span className="whitespace-nowrap">94% · {side === 'buy' ? 'to your wallet' : 'swapped for you'}</span>
          </motion.div>
          <motion.div
            className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-r from-amber-400 via-emerald-400 to-blue-500 text-xs font-bold text-white"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.9 }}
          >
            <span className="relative z-10">6%</span>
            <span className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slide" />
          </motion.div>
        </div>

        {/* fan-out connector from the 6% slice to the full-width split */}
        <svg className="h-10 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id="fan" x1="0" x2="1">
              <stop offset="0%" stopColor="#F5B82E" stopOpacity="0.25" />
              <stop offset="50%" stopColor="#10B981" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.25" />
            </linearGradient>
          </defs>
          <motion.polygon
            points="94,0 100,0 100,10 0,10"
            fill="url(#fan)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.6 }}
          />
        </svg>

        <div className="grid grid-cols-3 gap-1.5 overflow-hidden rounded-2xl">
          {STREAMS.map((s, i) => (
            <motion.div
              key={s.key}
              className={`flex h-9 items-center justify-center bg-gradient-to-r ${s.bar} text-xs font-bold text-white`}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.3 + i * 0.15, duration: 0.6, ease: EASE }}
              style={{ originX: 0 }}
            >
              2%
            </motion.div>
          ))}
        </div>
      </div>

      {/* stream cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        {STREAMS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EASE }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_18px_40px_-20px_rgba(15,35,73,0.35)]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ring-4 transition-transform duration-300 group-hover:scale-110 ${s.tint}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-bold tabular-nums text-slate-900">
                    +<NumberTicker value={(size * s.pct) / 100} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">MBR from this {side}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${s.dot}`} />
                <span className="font-display text-base font-bold text-slate-900">
                  {s.pct}% · {s.title}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{s.body}</p>
            </motion.div>
          );
        })}
      </div>

      <p className="relative mt-5 text-center text-[11px] text-slate-400">
        Same 6% on buys and sells · applied automatically on-chain · example amounts in MBR
      </p>
    </div>
  );
};

export default FeeBreakdown;
