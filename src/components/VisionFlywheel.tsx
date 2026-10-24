import React from 'react';
import { motion } from 'framer-motion';
import { HeroCoin } from './HeroCoin';

/**
 * 6% fee flywheel for the Vision page: the three 2% fee streams turn around the MBR coin,
 * particles flow along the ring, and an outer band carries the fixed supply and lock facts.
 */

const SIZE = 440;
const C = SIZE / 2;
const R = 140; // fee ring radius
const GAP = 6; // degrees between segments

const SEGMENTS = [
  { label: 'Holders', note: '2% to holders', color: '#F5B82E', soft: 'bg-amber-50 text-amber-700 ring-amber-200' },
  { label: 'Auto-liquidity', note: '2% to LP', color: '#10B981', soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  { label: 'Treasury', note: '2% marketing', color: '#2563EB', soft: 'bg-blue-50 text-blue-700 ring-blue-200' },
];

const polar = (deg: number, radius: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
};

const arc = (from: number, to: number, radius: number) => {
  const p0 = polar(from, radius);
  const p1 = polar(to, radius);
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${to - from > 180 ? 1 : 0} 1 ${p1.x} ${p1.y}`;
};

const ringPath = (radius: number) =>
  `M ${C} ${C - radius} A ${radius} ${radius} 0 1 1 ${C - 0.01} ${C - radius} Z`;

const BAND_TEXT = '150,000,000 MBR · FIXED SUPPLY · 6% BUY / 6% SELL · 100% INITIAL LP LOCKED · HOLD THROUGH 2035 · ';

export const VisionFlywheel: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative mx-auto w-full max-w-[480px] ${className}`}>
    <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-white via-[#F4F7FD] to-gold-50/70 shadow-[0_40px_80px_-40px_rgba(15,35,73,0.45)]">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-60" />

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute inset-0 h-full w-full" role="img" aria-label="6% fee flywheel: 2% holders, 2% auto-liquidity, 2% treasury">
        <defs>
          <path id="flywheel-band" d={ringPath(188)} />
          <filter id="flywheel-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* outer facts band, slowly rotating */}
        <motion.g style={{ originX: '50%', originY: '50%' }} animate={{ rotate: -360 }} transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}>
          <text fontSize="11" fontWeight="700" letterSpacing="2.6" fill="#94A3B8" fontFamily="Inter, sans-serif">
            <textPath href="#flywheel-band">{BAND_TEXT + BAND_TEXT}</textPath>
          </text>
        </motion.g>

        {/* inner guide rings */}
        <circle cx={C} cy={C} r={R + 24} fill="none" stroke="#E2E8F0" strokeWidth={1} />
        <motion.circle
          cx={C}
          cy={C}
          r={R - 34}
          fill="none"
          stroke="#CBD5E1"
          strokeWidth={1}
          strokeDasharray="3 7"
          style={{ originX: '50%', originY: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
        />

        {/* the three fee streams, turning as one wheel */}
        <motion.g style={{ originX: '50%', originY: '50%' }} animate={{ rotate: 360 }} transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}>
          {SEGMENTS.map((seg, i) => {
            const from = i * 120 + GAP / 2;
            const to = (i + 1) * 120 - GAP / 2;
            return (
              <g key={seg.label}>
                <path d={arc(from, to, R)} fill="none" stroke={seg.color} strokeOpacity={0.25} strokeWidth={30} filter="url(#flywheel-glow)" />
                <motion.path
                  d={arc(from, to, R)}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={20}
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.25, ease: [0.16, 1, 0.3, 1] }}
                />
                <text
                  x={polar((from + to) / 2, R).x}
                  y={polar((from + to) / 2, R).y + 4}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="800"
                  fill="#fff"
                  fontFamily="Plus Jakarta Sans, Inter, sans-serif"
                >
                  2%
                </text>
              </g>
            );
          })}
        </motion.g>

        {/* value particles flowing round the ring */}
        {SEGMENTS.map((seg, i) => (
          <circle key={seg.label} r={4} fill={seg.color}>
            <animateMotion dur="6s" begin={`${i * 2}s`} repeatCount="indefinite" path={ringPath(R + 24)} />
          </circle>
        ))}
      </svg>

      {/* animated MBR coin at the hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-white/80 shadow-[inset_0_2px_12px_rgba(15,35,73,0.08),0_20px_40px_-20px_rgba(15,35,73,0.4)] backdrop-blur">
          <div className="scale-110">
            <HeroCoin />
          </div>
        </div>
      </div>

      <div className="absolute left-4 top-4 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-600 backdrop-blur">
        6% fee flywheel
      </div>
    </div>

    {/* legend */}
    <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
      {SEGMENTS.map((seg, i) => (
        <motion.span
          key={seg.label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 + i * 0.1 }}
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${seg.soft}`}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: seg.color }} />
          {seg.label} · {seg.note}
        </motion.span>
      ))}
    </div>
  </div>
);

export default VisionFlywheel;
