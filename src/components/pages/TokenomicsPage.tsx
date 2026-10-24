import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Coins, Lock, Flame, Users, ArrowRight, ShieldCheck, Zap, Sparkles, Check } from 'lucide-react';
import { TAX_MECHANICS, REFERRAL_TIERS, TOKEN_INFO } from '../../data/tokenData';
import { Tokenomics3DFlywheel } from '../3d/Tokenomics3DFlywheel';
import { Disclaimer } from '../ui/Disclaimer';

interface TokenomicsPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

export const TokenomicsPage: React.FC<TokenomicsPageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
}) => {
  // Interactive Referral Simulation State
  const [simBnb, setSimBnb] = useState<number>(5);
  const tier1Reward = (simBnb * 0.01).toFixed(3);
  const tier2Reward = (simBnb * 0.006).toFixed(3);
  const tier3Reward = (simBnb * 0.004).toFixed(3);
  const totalRewardBnb = (simBnb * 0.02).toFixed(3);

  return (
    <div className="pt-32 pb-12 sm:pt-40 sm:pb-20 relative overflow-hidden section-hero text-slate-800">
      {/* Ambient Depth Glows */}
      <div className="absolute top-10 left-1/3 w-[700px] h-[500px] bg-amber-400/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[500px] bg-[#0071E3]/[0.08] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* HERO SECTION: Split Layout with 3D Flywheel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-sm">
              <PieChart className="w-3.5 h-3.5 text-gold-600" />
              MATHEMATICAL SCARCITY & 6% TAX FLYWHEEL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
              Strictly Capped at <span className="text-gradient-gold">150 Million</span> MBR. 6% Buy / 6% Sell.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Unlike inflationary fiat currencies or meme tokens minted in trillions, MyBitRich has a strictly fixed 150,000,000 token cap. Every trade automatically funds holder yields, perpetual liquidity depth, and ecosystem expansion.
            </p>

            {/* Quick 4 Stats Pods */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Max Supply</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">150M</div>
                <div className="text-[10px] font-mono text-gold-600">15 Cr MBR</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">LP Lock</div>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">5 Years</div>
                <div className="text-[10px] font-mono text-emerald-600">Until 2030–31</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Total Tax</div>
                <div className="text-lg font-bold font-mono text-gold-600 mt-0.5">6% Total</div>
                <div className="text-[10px] font-mono text-slate-500">2% / 2% / 2%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Referrals</div>
                <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">2.0%</div>
                <div className="text-[10px] font-mono text-blue-600">3-Tier Instant</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenSwapModal}
                className="btn-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm text-black"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>Trade MBR on PancakeSwap</span>
              </button>

              <button
                onClick={onOpenConnectModal}
                className="btn-glass px-7 py-3.5 text-xs font-semibold text-slate-900 hover:border-gold-400/60"
              >
                <span>Connect Wallet</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive 3D Flywheel */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[480px] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-gold-500/10 to-sky-500/10 rounded-full blur-3xl pointer-events-none" />
              <Tokenomics3DFlywheel className="relative z-10" />
            </div>
            <div className="text-center mt-3 text-xs font-mono text-slate-500">
              Interactive 3D MBR Coin Treasury Vault · Minted Bullion & Circulating Flow
            </div>
          </div>

        </div>

        {/* 6% TAX ARCHITECTURE BREAKDOWN */}
        <motion.div {...sectionAnimation} className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 text-xs font-mono uppercase font-semibold">
              <Zap className="w-3.5 h-3.5 text-gold-600" />
              ON-CHAIN SMART CONTRACT ROUTING
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              The 6% Transaction Architecture
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Every buy and sell is subject to a strict 6% protocol fee, engineered to protect capital and fuel exponential growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TAX_MECHANICS.map((tax, i) => (
              <div
                key={tax.component}
                className={`luxe-card p-8 rounded-3xl space-y-6 border transition-all duration-300 ${
                  i === 0 
                    ? 'border-emerald-500/25 hover:border-emerald-400/60 shadow-[0_10px_35px_rgba(16,185,129,0.12)]'
                    : i === 1 
                    ? 'border-blue-500/25 hover:border-[#0071E3]/70 shadow-[0_10px_35px_rgba(0,113,227,0.12)]' 
                    : 'border-gold-300/50 hover:border-gold-400/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
                    Component 0{i + 1}
                  </span>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                    i === 0 
                      ? 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30'
                      : i === 1
                      ? 'bg-[#0071E3]/15 text-blue-600 border-[#0071E3]/35'
                      : 'bg-gold-100 text-gold-600 border-amber-400/35'
                  }`}>
                    {tax.rate}
                  </span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
                    {i === 0 && <Coins className="w-6 h-6 text-emerald-600" />}
                    {i === 1 && <Lock className="w-6 h-6 text-blue-600" />}
                    {i === 2 && <Flame className="w-6 h-6 text-gold-600" />}
                    {tax.component}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {tax.benefit}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Routing</span>
                  <span className={`font-semibold ${
                    i === 0 ? 'text-emerald-600' : i === 1 ? 'text-blue-600' : 'text-gold-600'
                  }`}>
                    Smart Contract Auto
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 3-TIER BUY REFERRAL ARCHITECTURE & SIMULATOR */}
        <motion.div {...sectionAnimation} className="luxe-card p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-10 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300/50 text-gold-600 font-mono text-xs font-semibold uppercase">
                <Users className="w-3.5 h-3.5 text-gold-600" />
                DECENTRALIZED PARTNER COMMISSIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
                3-Tier On-Chain Referral System
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                A 3-tier buy ladder totalling 2%: when someone buys MBR through your referral link, you earn a share of the post-tax MBR they receive — 1% at level 1, 0.6% at level 2, and 0.4% at level 3.
              </p>
            </div>

            <div className="shrink-0 bg-white px-8 py-5 rounded-2xl border border-gold-300/50 shadow-md text-left lg:text-right">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-gold-600">
                2.0% Total
              </div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-1">
                Instant On-Chain Payout
              </div>
            </div>
          </div>

          {/* 3 Tier Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REFERRAL_TIERS.map((tier) => (
              <div key={tier.level} className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-gold-400/60 transition-all space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">{tier.label}</span>
                  <span className="text-2xl font-bold font-mono text-gold-600">{tier.pct}%</span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">{tier.desc}</div>
              </div>
            ))}
          </div>

          {/* Interactive Referral Earnings Calculator */}
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-lg font-bold font-display text-slate-900">
                  Live Referral Commission Calculator
                </h4>
                <p className="text-xs text-slate-500">
                  Simulate instantaneous earnings based on your invited network volume.
                </p>
              </div>
              <div className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 font-semibold self-start sm:self-auto">
                Instant BNB Distribution
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-500">Simulated Network Purchase Volume:</span>
                <span className="text-gold-600 font-bold">{simBnb} BNB (~${(simBnb * 594.30).toFixed(0)} USD)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="50"
                step="0.5"
                value={simBnb}
                onChange={(e) => setSimBnb(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Tier 1 (1.0%)</div>
                <div className="text-lg font-bold font-mono text-gold-600 mt-1">+{tier1Reward} BNB</div>
                <div className="text-[10px] text-slate-500 mt-0.5">≈ ${(parseFloat(tier1Reward) * 594.30).toFixed(2)} USD</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Tier 2 (0.6%)</div>
                <div className="text-lg font-bold font-mono text-blue-600 mt-1">+{tier2Reward} BNB</div>
                <div className="text-[10px] text-slate-500 mt-0.5">≈ ${(parseFloat(tier2Reward) * 594.30).toFixed(2)} USD</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-100 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Tier 3 (0.4%)</div>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-1">+{tier3Reward} BNB</div>
                <div className="text-[10px] text-slate-500 mt-0.5">≈ ${(parseFloat(tier3Reward) * 594.30).toFixed(2)} USD</div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gold-400/60 text-center bg-gradient-to-b from-white to-slate-50">
                <div className="text-[10px] font-mono text-gold-600 uppercase font-bold">Total Payout (2.0%)</div>
                <div className="text-lg font-extrabold font-mono text-gold-600 mt-1">+{totalRewardBnb} BNB</div>
                <div className="text-[10px] text-gold-600 font-semibold mt-0.5">≈ ${(parseFloat(totalRewardBnb) * 594.30).toFixed(2)} USD</div>
              </div>
            </div>
          </div>
        </motion.div>


        <Disclaimer topic="rewards" className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
};
