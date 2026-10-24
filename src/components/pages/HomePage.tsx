import React from 'react';
import { motion } from 'framer-motion';
import { WhatIsMyBitRich } from '../WhatIsMyBitRich';
import { CoinComparison } from '../CoinComparison';
import { BillionaireCalculator } from '../BillionaireCalculator';
import { GettingStarted } from '../GettingStarted';
import { FAQ } from '../FAQ';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { Target, PieChart, MapPin, ShieldCheck, ArrowRight, Sparkles, Zap, Award } from 'lucide-react';

interface HomePageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
  onNavigatePage: (page: string) => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
};

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
  onNavigatePage,
}) => {
  return (
    <div className="space-y-0">
      
      {/* 1. Hero: cosmic parallax with the 3D Earth and flying MBR coins */}
      <ParallaxComponent
        title="MyBitRich"
        subtitle="“Buy and hold, you will be a billionaire one day.”"
        onOpenSwapModal={onOpenSwapModal}
      />

      {/* 2. Core Pillars / What is MyBitRich */}
      <motion.div {...sectionAnimation}>
        <WhatIsMyBitRich />
      </motion.div>

      {/* 3. PROMINENT MISSION & VISION SPOTLIGHT BANNER */}
      <motion.section 
        {...sectionAnimation}
        className="py-16 relative overflow-hidden section-cream border-t border-slate-200"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-amber-400/[0.06] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="luxe-card border-beam p-8 sm:p-12 rounded-3xl border border-gold-300/50 bg-gradient-to-r from-white via-gold-50/40 to-white shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-50 text-gold-600 text-xs font-mono font-semibold uppercase tracking-wider border border-gold-300/50">
                <Target className="w-3.5 h-3.5 text-gold-600" />
                ADVANCED STRATEGIC BLUEPRINT · 2025 – 2035
              </div>
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-slate-900">
                The Roadmap to Generational Wealth & <span className="text-gradient-gold">$2,000 by 2035</span>
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Four phases from the 2025 token launch and 5-year LP lock to staking, DeFi and RWA utility, a native Layer-1 / Layer-2 coin, and a long-term target of $2,000 per token ($300B market cap).
              </p>
            </div>

            <button
              onClick={() => onNavigatePage('vision')}
              className="btn-gold px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shrink-0 shadow-lg shadow-slate-900/10 text-black hover:-translate-y-0.5 transition-all"
            >
              <span>Explore Advanced Blueprint</span>
              <ArrowRight className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 5. Head-to-Head Coin Benchmark Matrix */}
      <motion.div {...sectionAnimation}>
        <CoinComparison />
      </motion.div>

      {/* 5. Interactive Billionaire ROI Simulator */}
      <motion.div {...sectionAnimation}>
        <BillionaireCalculator />
      </motion.div>

      {/* 5. 3 FEATURED DEEP-DIVE CARDS (Tokenomics, Roadmap, Wealth Simulator) */}
      <motion.section 
        {...sectionAnimation}
        className="py-20 relative overflow-hidden section-cream border-t border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 font-semibold uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              EXPLORE PROTOCOL ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              Tokenomics, Roadmap & Contracts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Explore dedicated deep-dive sections with interactive 3D simulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tokenomics Card */}
            <div className="luxe-card p-8 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-6 hover:border-gold-400/60 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-300/50 flex items-center justify-center text-gold-600 group-hover:scale-105 transition-transform">
                  <PieChart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gold-600 font-bold">150M Supply · 6% Tax</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1">Tokenomics & Referrals</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strictly capped at 150M MBR with 2% reflection yield, 2% auto-liquidity, 2% treasury, and a 3-tier buy referral architecture.
                </p>
              </div>

              <button
                onClick={() => onNavigatePage('tokenomics')}
                className="flex items-center gap-2 text-xs font-semibold text-gold-600 hover:text-gold-600 group-hover:translate-x-1 transition-all pt-4 border-t border-slate-200"
              >
                <span>View Full Tokenomics & 3D Flywheel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Roadmap Card */}
            <div className="luxe-card p-8 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-6 hover:border-[#38BDF8]/40 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#0071E3]/15 border border-[#0071E3]/35 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-blue-600 font-bold">2025 – 2035 Decade</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1">The Decade Roadmap</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Four phases from the 2025 launch and liquidity lock through staking, DeFi and a native Layer-1 / Layer-2 coin, toward $2,000 per token by 2035.
                </p>
              </div>

              <button
                onClick={() => onNavigatePage('roadmap')}
                className="flex items-center gap-2 text-xs font-semibold text-blue-600 hover:text-blue-500 group-hover:translate-x-1 transition-all pt-4 border-t border-slate-200"
              >
                <span>Explore Roadmap & 3D Space Warp</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Verified Contracts & Security Card */}
            <div className="luxe-card p-8 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-6 hover:border-emerald-400/40 transition-all duration-300 group">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 font-bold">5-Yr LP Lock · BEP-20</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 mt-1">Contracts & Security</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Public token, swap-proxy and router addresses on BNB Smart Chain, with 100% of initial LP locked for 5 years via Unicrypt, PinkLock and Streamflow.
                </p>
              </div>

              <button
                onClick={() => onNavigatePage('contracts')}
                className="flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:text-emerald-600 group-hover:translate-x-1 transition-all pt-4 border-t border-slate-200"
              >
                <span>Inspect Contracts & 3D Shield</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </motion.section>

      {/* 6. Guided 3-Step Getting Started */}
      <motion.div {...sectionAnimation}>
        <GettingStarted
          onOpenSwapModal={onOpenSwapModal}
          onOpenConnectModal={onOpenConnectModal}
        />
      </motion.div>

      {/* 7. Frequently Asked Questions */}
      <motion.div {...sectionAnimation}>
        <FAQ />
      </motion.div>

    </div>
  );
};
