import React from 'react';
import { CORE_PILLARS } from '../data/tokenData';
import { FeeBreakdown } from './FeeBreakdown';
import { Unlock, ShieldCheck, Coins, Sparkles, TrendingUp, ShieldAlert, Award } from 'lucide-react';

export const WhatIsMyBitRich: React.FC = () => {
  const pillarIcons = [Unlock, ShieldCheck, Coins];

  return (
    <section id="what-is-mybitrich" className="py-24 relative overflow-hidden section-ice border-t border-slate-200">
      {/* Ambient Sapphire & Gold Lighting */}
      <div className="absolute top-1/4 -left-20 w-[600px] h-[500px] bg-blue-500/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[550px] h-[450px] bg-amber-500/[0.07] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-gold-600" />
            PROTOCOL ARCHITECTURE
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
            Why <span className="text-gradient-gold">MyBitRich (MBR)</span>?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Engineered around the motto <em className="text-gold-600 font-semibold not-italic">“Buy and hold, you will be a billionaire one day”</em>, MyBitRich combines frictionless transaction reflections, permanent liquidity locks, and complete decentralized liquidity on BNB Smart Chain.
          </p>
        </div>

        {/* 3 Core Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-14">
          {CORE_PILLARS.map((pillar, idx) => {
            const Icon = pillarIcons[idx];
            return (
              <div
                key={pillar.title}
                className="luxe-card p-8 flex flex-col justify-between relative group border border-slate-200 hover:border-gold-400/60 transition-all duration-300"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-13 h-13 rounded-2xl bg-gold-50 border border-gold-300/50 flex items-center justify-center group-hover:border-gold-400/60 group-hover:bg-gold-100 transition-all shadow-md">
                      <Icon className="w-6 h-6 text-gold-600" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-50 text-gold-600 border border-slate-200">
                      {pillar.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-gold-600 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mt-3 font-normal">
                      {pillar.body}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Pillar 0{idx + 1}</span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified BEP-20
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive 6% buy / sell fee breakdown */}
        <FeeBreakdown />

      </div>
    </section>
  );
};
