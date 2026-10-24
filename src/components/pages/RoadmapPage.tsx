import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { MapPin, CheckCircle2, Circle, Zap, Flag, Target } from 'lucide-react';
import { ROADMAP_PHASES, TOKEN_INFO } from '../../data/tokenData';
import { RoadmapOrbit } from '../RoadmapOrbit';
import { Disclaimer } from '../ui/Disclaimer';

interface RoadmapPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

// Short theme for each phase, used in the hero summary row
const PHASE_THEMES = ['Launch & LP lock', 'Staking & utility', 'DeFi & RWA', 'Layer-1 / Layer-2'];

const isCurrent = (idx: number) => idx === 0;

const PhaseCard: React.FC<{ idx: number }> = ({ idx }) => {
  const phase = ROADMAP_PHASES[idx];
  const current = isCurrent(idx);
  return (
    <div
      className={`luxe-card p-6 sm:p-7 text-left ${current ? 'border-gold-300 shadow-[0_18px_40px_-20px_rgba(192,143,30,0.45)]' : ''}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`text-[11px] font-semibold uppercase tracking-[0.14em] ${current ? 'text-gold-600' : 'text-slate-500'}`}>
          Phase {phase.phase} · {phase.years}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
            current ? 'bg-gold-100 text-gold-700' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {current ? 'In progress' : phase.status}
        </span>
      </div>
      <h3 className="mt-3 font-display text-xl font-bold text-slate-900 sm:text-2xl">{phase.title}</h3>
      <ul className="mt-4 space-y-2.5">
        {phase.items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600">
            {current ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
            ) : (
              <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300" />
            )}
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ onOpenSwapModal, onOpenConnectModal }) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ['start 70%', 'end 60%'] });
  const lineFill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div className="relative overflow-hidden">
      {/* HERO */}
      <section className="section-hero relative pb-12 pt-32 sm:pb-20 sm:pt-40">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700">
              <MapPin className="h-3.5 w-3.5" />
              Strategic roadmap · 2025 – 2035
            </div>

            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Four phases to the <span className="text-gradient-gold">$2,000 target</span>
            </h1>

            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              A ten-year plan that starts with the token launch and a 5-year liquidity lock on BNB Smart Chain, and builds
              toward a native Layer-1 / Layer-2 coin, Tier-1 exchange listings, and a long-term target of $
              {TOKEN_INFO.targetPriceUsd.toLocaleString()} per token ($300B market cap).
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-4">
              {ROADMAP_PHASES.map((phase, idx) => (
                <div
                  key={phase.phase}
                  className={`rounded-2xl border bg-white p-3.5 text-center ${isCurrent(idx) ? 'border-gold-300' : 'border-slate-200'}`}
                >
                  <div className={`text-[10px] font-semibold uppercase ${isCurrent(idx) ? 'text-gold-600' : 'text-slate-500'}`}>
                    Phase {phase.phase}
                    {isCurrent(idx) ? ' · Now' : ''}
                  </div>
                  <div className="mt-0.5 text-sm font-bold text-slate-900">{phase.years}</div>
                  <div className="text-[11px] text-slate-500">{PHASE_THEMES[idx]}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button onClick={onOpenSwapModal} className="btn-gold flex items-center gap-2 px-7 py-3.5 text-sm">
                <Zap className="h-4 w-4" />
                <span>Join Phase 1</span>
              </button>
              <button onClick={onOpenConnectModal} className="btn-glass px-7 py-3.5 text-sm">
                Connect Wallet
              </button>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center">
            <RoadmapOrbit />
            <div className="mt-2 text-center text-xs text-slate-500">2025 – 2035 · gold arc shows progress to today</div>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="section-ice relative border-t border-slate-200 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-600">
              <Flag className="h-3.5 w-3.5" />
              2025 – 2035
            </div>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Phase-by-phase milestones</h2>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              Four phases toward $2,000 per token and a $300B market cap.
            </p>
          </div>

          <div ref={timelineRef} className="relative mt-16">
            {/* centre rail (left rail on mobile) with scroll-linked fill */}
            <div className="absolute bottom-0 left-4 top-0 w-px bg-slate-300/70 md:left-1/2 md:-translate-x-1/2" />
            <motion.div
              className="absolute left-4 top-0 h-full w-px origin-top bg-gradient-to-b from-gold-400 via-gold-500 to-blue-600 md:left-1/2 md:-translate-x-1/2"
              style={{ scaleY: lineFill }}
            />

            <div>
              {ROADMAP_PHASES.map((phase, idx) => {
                const left = idx % 2 === 0;
                return (
                  <div key={phase.phase} className={`relative grid grid-cols-1 md:grid-cols-2 md:gap-16 ${idx > 0 ? 'mt-10 md:-mt-10' : ''}`}>
                    {/* node */}
                    <motion.div
                      initial={{ scale: 0.4, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true, margin: '-120px' }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className={`absolute left-4 top-6 z-10 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#EEF3FB] font-display text-sm font-bold md:left-1/2 ${
                        isCurrent(idx) ? 'bg-gold-500 text-white shadow-[0_0_0_6px_rgba(212,167,58,0.18)]' : 'bg-white text-slate-500 ring-1 ring-slate-200'
                      }`}
                    >
                      {phase.phase}
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: left ? -28 : 28, filter: 'blur(8px)' }}
                      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
                      viewport={{ once: true, margin: '-100px' }}
                      transition={{ duration: 0.8, ease: EASE }}
                      className={`pl-12 md:pl-0 ${left ? 'md:col-start-1 md:pr-4' : 'md:col-start-2 md:pl-4'}`}
                    >
                      <PhaseCard idx={idx} />
                    </motion.div>
                  </div>
                );
              })}

              {/* end marker */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.8, ease: EASE }}
                className="relative mt-12 pl-12 pt-14 md:mt-16 md:pl-0"
              >
                <div className="absolute left-4 top-0 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-navy-800 text-white shadow-lg md:left-1/2">
                  <Target className="h-4 w-4" />
                </div>
                <div className="mx-auto max-w-md rounded-2xl border border-gold-300 bg-white px-6 py-5 text-center shadow-sm">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-600">{TOKEN_INFO.targetYear} target</div>
                  <div className="mt-1 font-display text-2xl font-extrabold text-slate-900">
                    ${TOKEN_INFO.targetPriceUsd.toLocaleString()} per MBR
                  </div>
                  <div className="text-sm text-slate-500">$300B implied market cap</div>
                </div>
              </motion.div>
            </div>
          </div>

          <Disclaimer topic="roadmap" className="mx-auto mt-20 max-w-3xl" />
        </div>
      </section>
    </div>
  );
};
