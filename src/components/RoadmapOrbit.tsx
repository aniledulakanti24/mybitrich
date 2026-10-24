import React from 'react';
import { motion } from 'framer-motion';
import { ROADMAP_PHASES, TOKEN_INFO } from '../data/tokenData';

/**
 * Gauge-style roadmap visual: the 2025 → 2035 decade sweeps 270° around a ring,
 * phases sit at their start years, and a gold arc fills up to today.
 */

const SIZE = 440;
const C = SIZE / 2;
const R = 150;
const START = 135; // degrees, bottom-left
const SWEEP = 270; // ends bottom-right
const FIRST_YEAR = 2025;
const LAST_YEAR = 2035;

const now = new Date();
const NOW_FRACTION = Math.min(1, Math.max(0, (now.getFullYear() + now.getMonth() / 12 - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR)));

const toXY = (fraction: number, radius = R) => {
  const a = ((START + fraction * SWEEP) * Math.PI) / 180;
  return { x: C + radius * Math.cos(a), y: C + radius * Math.sin(a) };
};

const arcPath = (from: number, to: number, radius = R) => {
  const p0 = toXY(from, radius);
  const p1 = toXY(to, radius);
  const large = (to - from) * SWEEP > 180 ? 1 : 0;
  return `M ${p0.x} ${p0.y} A ${radius} ${radius} 0 ${large} 1 ${p1.x} ${p1.y}`;
};

const phaseFraction = (years: string) => (parseInt(years, 10) - FIRST_YEAR) / (LAST_YEAR - FIRST_YEAR);

const SHORT = ['Launch', 'Utility', 'Expansion', 'Layer-1'];

export const RoadmapOrbit: React.FC<{ className?: string }> = ({ className = '' }) => {
  const nodes = ROADMAP_PHASES.map((p, i) => ({ ...p, f: phaseFraction(p.years), short: SHORT[i] }));
  const head = toXY(NOW_FRACTION);
  const end = toXY(1);
  const currentIdx = nodes.reduce((acc, n, i) => (NOW_FRACTION >= n.f ? i : acc), 0);

  return (
    <div className={`relative mx-auto aspect-square w-full max-w-[480px] ${className}`}>
      {/* soft backdrop */}
      <div className="absolute inset-[8%] rounded-full bg-gradient-to-br from-white via-blue-50/60 to-gold-50/70 shadow-[inset_0_2px_20px_rgba(15,35,73,0.06),0_30px_60px_-30px_rgba(15,35,73,0.35)]" />

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative h-full w-full overflow-visible" role="img" aria-label="Roadmap progress from 2025 to 2035">
        <defs>
          <linearGradient id="orbit-progress" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#E5C46B" />
            <stop offset="100%" stopColor="#B07E1E" />
          </linearGradient>
          <radialGradient id="orbit-head" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF4D0" />
            <stop offset="100%" stopColor="#F5C042" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* rotating dashed outer ring */}
        <motion.circle
          cx={C}
          cy={C}
          r={R + 46}
          fill="none"
          stroke="#CBD5E1"
          strokeWidth={1}
          strokeDasharray="2 8"
          style={{ originX: '50%', originY: '50%' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />

        {/* year ticks */}
        {Array.from({ length: LAST_YEAR - FIRST_YEAR + 1 }, (_, i) => {
          const f = i / (LAST_YEAR - FIRST_YEAR);
          const a = toXY(f, R + 14);
          const b = toXY(f, R + 22);
          return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#94A3B8" strokeWidth={1.2} strokeLinecap="round" />;
        })}

        {/* track */}
        <path d={arcPath(0, 1)} fill="none" stroke="#E2E8F0" strokeWidth={12} strokeLinecap="round" />

        {/* travelling light along the whole track */}
        <circle r={4} fill="#F5C042" opacity={0.7}>
          <animateMotion dur="9s" repeatCount="indefinite" path={arcPath(0, 1)} />
        </circle>

        {/* progress to today */}
        <motion.path
          d={arcPath(0, NOW_FRACTION)}
          fill="none"
          stroke="url(#orbit-progress)"
          strokeWidth={12}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* "now" head */}
        <motion.circle
          cx={head.x}
          cy={head.y}
          r={18}
          fill="url(#orbit-head)"
          animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.3, 0.9] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          style={{ originX: `${head.x}px`, originY: `${head.y}px` }}
        />
        <circle cx={head.x} cy={head.y} r={5} fill="#fff" stroke="#C08F1E" strokeWidth={3} />

        {/* phase nodes + labels */}
        {nodes.map((n, i) => {
          const p = toXY(n.f);
          const label = toXY(n.f, R + 62);
          const done = i < currentIdx;
          const current = i === currentIdx;
          const anchor = Math.abs(label.x - C) < 20 ? 'middle' : label.x < C ? 'end' : 'start';
          return (
            <motion.g
              key={n.phase}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ originX: `${p.x}px`, originY: `${p.y}px` }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={15}
                fill={current || done ? '#C08F1E' : '#FFFFFF'}
                stroke={current || done ? '#FFFFFF' : '#CBD5E1'}
                strokeWidth={3}
              />
              <text
                x={p.x}
                y={p.y + 4.5}
                textAnchor="middle"
                fontSize="12"
                fontWeight="700"
                fill={current || done ? '#FFFFFF' : '#64748B'}
                fontFamily="Plus Jakarta Sans, Inter, sans-serif"
              >
                {n.phase}
              </text>
              <text x={label.x} y={label.y - 4} textAnchor={anchor} fontSize="12" fontWeight="700" fill="#0B1B33" fontFamily="Plus Jakarta Sans, Inter, sans-serif">
                {n.short}
              </text>
              <text x={label.x} y={label.y + 11} textAnchor={anchor} fontSize="10.5" fill="#64748B" fontFamily="Inter, sans-serif">
                {n.years}
              </text>
            </motion.g>
          );
        })}

        {/* 2035 end marker */}
        <g>
          <circle cx={end.x} cy={end.y} r={11} fill="#0F2349" />
          <path
            d={`M ${end.x} ${end.y - 5.5} L ${end.x + 1.6} ${end.y - 1.6} L ${end.x + 5.5} ${end.y - 1.2} L ${end.x + 2.5} ${end.y + 1.6} L ${end.x + 3.4} ${end.y + 5.5} L ${end.x} ${end.y + 3.4} L ${end.x - 3.4} ${end.y + 5.5} L ${end.x - 2.5} ${end.y + 1.6} L ${end.x - 5.5} ${end.y - 1.2} L ${end.x - 1.6} ${end.y - 1.6} Z`}
            fill="#F5C042"
          />
        </g>
      </svg>

      {/* centre readout */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="rounded-full bg-gold-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold-700">
          Phase {nodes[currentIdx].phase} · in progress
        </span>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-3 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl"
        >
          ${TOKEN_INFO.targetPriceUsd.toLocaleString()}
        </motion.div>
        <div className="mt-1 text-xs font-medium text-slate-500">{TOKEN_INFO.targetYear} target per MBR</div>
        <div className="mt-0.5 text-[11px] text-slate-400">$300B market cap goal</div>
      </div>
    </div>
  );
};

export default RoadmapOrbit;
