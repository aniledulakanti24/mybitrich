import React, { useState } from 'react';
import { useMarketData } from '../../hooks/useMarketData';
import { motion } from 'framer-motion';
import {
  PieChart,
  Coins,
  Lock,
  Flame,
  Users,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  Check,
  TrendingUp,
  Minus,
  Plus,
  ExternalLink,
  Award,
  Globe2,
} from 'lucide-react';
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
  const { mbr, coins } = useMarketData();
  const bnbPriceUsd = coins.find((c) => c.symbol === 'BNB')?.priceUsd ?? 594.3;
  const mbrPriceUsd = mbr.priceUsd;
  const usd = (bnb: number) => `~${Math.round(bnb * bnbPriceUsd).toLocaleString('en-US')} USD`;
  const simUsd = simBnb * bnbPriceUsd;
  const simMbr = simUsd / mbrPriceUsd;

  const tier1Bnb = simBnb * 0.01;
  const tier2Bnb = simBnb * 0.006;
  const tier3Bnb = simBnb * 0.004;
  const totalRewardBnb = simBnb * 0.02;

  const tier1Usd = tier1Bnb * bnbPriceUsd;
  const tier2Usd = tier2Bnb * bnbPriceUsd;
  const tier3Usd = tier3Bnb * bnbPriceUsd;
  const totalRewardUsd = totalRewardBnb * bnbPriceUsd;

  const tier1Mbr = tier1Usd / mbrPriceUsd;
  const tier2Mbr = tier2Usd / mbrPriceUsd;
  const tier3Mbr = tier3Usd / mbrPriceUsd;
  const totalRewardMbr = totalRewardUsd / mbrPriceUsd;

  const PRESET_VOLUMES = [1, 5, 10, 25, 50];
  const fillPercent = Math.min(100, Math.max(0, ((simBnb - 0.5) / (50 - 0.5)) * 100));

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
              100% DIRECT FAIR LAUNCH · D&amp;S DISTRIBUTION
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
              Strictly Capped at <span className="text-gradient-gold">150 Million</span> MBR. Demand &amp; Supply Release.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Zero ICO, zero presale, and no premarket insider allocations. The 150,000,000 MBR supply is not dumped into the market at once — it is auto-distributed dynamically based on real-time market Demand &amp; Supply (D&amp;S). Every purchase initiates an automated rolling 5-year lock commitment, and your token balance multiplies with every live market transaction.
            </p>

            {/* Quick 4 Stats Pods */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Max Supply</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">150M</div>
                <div className="text-[10px] font-mono text-gold-600">D&amp;S Auto-Release</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Rolling Lock</div>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">5 Years</div>
                <div className="text-[10px] font-mono text-emerald-600">From purchase date</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Launch Model</div>
                <div className="text-lg font-bold font-mono text-gold-600 mt-0.5">Zero ICO</div>
                <div className="text-[10px] font-mono text-slate-500">100% Direct Fair Launch</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Growth Engine</div>
                <div className="text-lg font-bold font-mono text-blue-600 mt-0.5">Tx-Driven</div>
                <div className="text-[10px] font-mono text-blue-600">2% Reflection / Trade</div>
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

        {/* 4 CORE PROTOCOL FOUNDATION RULES FOR CLIENTS */}
        <motion.div {...sectionAnimation} className="rounded-3xl border border-amber-300/80 bg-gradient-to-br from-amber-500/[0.08] via-white to-amber-500/[0.04] p-8 sm:p-10 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/70 pb-5">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                CLIENT ASSURANCE &amp; PROTOCOL GOVERNANCE
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                The Four Non-Negotiable Pillars of MyBitRich
              </h3>
            </div>
            <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/70 self-start sm:self-auto">
              100% Enforced On-Chain
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Zero ICO */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 hover:border-purple-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200">01 · ZERO ICO</span>
                <Zap className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">100% Direct Fair Launch</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Strictly zero ICO, zero IDO, zero presale, and zero pre-market insider allocations. 100% direct fair launch on PancakeSwap with transparent, equal execution for all participants.
              </p>
            </div>

            {/* 2. Tx-Driven Growth */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 hover:border-blue-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">02 · GROWTH</span>
                <TrendingUp className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Transaction-Driven Yield</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Growth depends directly on live market transactions. 2% of every buy and sell automatically reflects into holders’ wallets and 2% deepens liquidity — your tokens increase with transaction velocity.
              </p>
            </div>

            {/* 3. Rolling 5-Year Lock */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">03 · ROLLING LOCK</span>
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">5-Yr Lock From Purchase</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                No single fixed calendar cliff date. Every purchase begins its automated 5-year rolling lock commitment from the exact date of acquisition (buy today = 5 years starting today).
              </p>
            </div>

            {/* 4. Demand & Supply Release */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5 hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">04 · 150M CAP</span>
                <Coins className="w-4 h-4 text-emerald-600" />
              </div>
              <h4 className="font-display font-bold text-base text-slate-900">Demand &amp; Supply Release</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                The 150 Million hard cap is not released into circulation all at once. Tokens are auto-distributed algorithmically based strictly on real-time market demand and supply dynamics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 3-TIER BUY REFERRAL ARCHITECTURE & REDESIGNED SIMULATOR */}
        <motion.div {...sectionAnimation} className="luxe-card p-6 sm:p-10 rounded-3xl border border-slate-200/90 space-y-10 shadow-xl bg-white">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-gold-600 font-mono text-xs font-semibold uppercase shadow-2xs">
                <Users className="w-3.5 h-3.5 text-gold-600" />
                DECENTRALIZED PARTNER COMMISSIONS
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
                3-Tier On-Chain Referral System
              </h2>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                A 3-tier buy ladder totalling 2%: when someone buys MBR through your referral link, you earn a share of the post-tax MBR they receive — 1% at level 1, 0.6% at level 2, and 0.4% at level 3. Paid directly to your wallet in real time.
              </p>
            </div>

            <div className="shrink-0 bg-gradient-to-br from-amber-50 to-white px-8 py-5 rounded-2xl border border-gold-300/70 shadow-md text-left lg:text-right">
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
              <div key={tier.level} className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-gold-400/60 transition-all space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-600 uppercase tracking-wider">{tier.label}</span>
                  <span className="text-2xl font-bold font-mono text-gold-600">{tier.pct}%</span>
                </div>
                <div className="text-xs text-slate-600 leading-relaxed font-normal">{tier.desc}</div>
              </div>
            ))}
          </div>

          {/* Upgraded Interactive Referral Earnings Simulator */}
          <div className="rounded-3xl border border-slate-200/90 bg-slate-50/70 p-6 sm:p-8 space-y-7 shadow-xs">
            
            {/* Header with Badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
                    Live Referral Commission Calculator
                  </h4>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Simulate instantaneous multi-generational earnings generated by your invited network volume.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300/70 shadow-2xs">
                  ⚡ Instant BNB Distribution
                </div>
                <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300/70 shadow-2xs">
                  2.0% Cumulative Yield
                </div>
              </div>
            </div>

            {/* Quick-Select Presets Ribbon */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                Quick-Select Volume Presets:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_VOLUMES.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSimBnb(preset)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      simBnb === preset
                        ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500'
                        : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {preset} BNB
                  </button>
                ))}
              </div>
            </div>

            {/* Volume Control Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs font-mono text-slate-500 uppercase font-semibold">
                  Simulated Network Purchase Volume:
                </div>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {simBnb.toFixed(1)} <span className="text-amber-600 text-lg">BNB</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    (≈ ${simUsd.toLocaleString('en-US', { maximumFractionDigits: 0 })} USD)
                  </span>
                  <span className="text-xs font-mono text-emerald-600 font-semibold hidden md:inline">
                    · ≈ {Math.round(simMbr).toLocaleString('en-US')} MBR Volume
                  </span>
                </div>
              </div>

              {/* Range Slider with Fine-Tune Steppers */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSimBnb((v) => Math.max(0.5, parseFloat((v - 0.5).toFixed(1))))}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold transition-colors shadow-2xs shrink-0"
                  title="Decrease 0.5 BNB"
                  aria-label="Decrease by 0.5 BNB"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="relative flex-1 flex items-center">
                  <input
                    type="range"
                    min="0.5"
                    max="50"
                    step="0.5"
                    value={simBnb}
                    onChange={(e) => setSimBnb(parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(to right, #F59E0B 0%, #FBBF24 ${fillPercent}%, #E2E8F0 ${fillPercent}%, #E2E8F0 100%)`,
                    }}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer accent-amber-500 outline-none transition-all"
                  />
                </div>

                <button
                  onClick={() => setSimBnb((v) => Math.min(50, parseFloat((v + 0.5).toFixed(1))))}
                  className="w-9 h-9 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold transition-colors shadow-2xs shrink-0"
                  title="Increase 0.5 BNB"
                  aria-label="Increase by 0.5 BNB"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0.5 BNB ({usd(0.5)})</span>
                <span>25.0 BNB ({usd(25)})</span>
                <span>50.0 BNB ({usd(50)})</span>
              </div>
            </div>

            {/* Proportional 3-Tier Split Visual Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-500 font-semibold">
                <span>Commission Distribution Split (2.0% Total)</span>
                <span>50% L1 · 30% L2 · 20% L3</span>
              </div>
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-200 gap-1 p-0.5 shadow-inner">
                <div style={{ width: '50%' }} className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500" title="Tier 1 Direct (50% of 2% = 1.0%)" />
                <div style={{ width: '30%' }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600" title="Tier 2 Network (30% of 2% = 0.6%)" />
                <div style={{ width: '20%' }} className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500" title="Tier 3 Community (20% of 2% = 0.4%)" />
              </div>
            </div>

            {/* 4 Upgraded Luxury Pods */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {/* Pod 1: Tier 1 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-amber-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                    Tier 1 (1.0%)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">50% share</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-amber-600">
                    +{tier1Bnb.toFixed(3)} BNB
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    ≈ ${tier1Usd.toFixed(2)} USD
                  </div>
                  <div className="text-[11px] font-mono text-amber-700 mt-1 font-semibold">
                    +{Math.round(tier1Mbr).toLocaleString('en-US')} MBR
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
                  Earned directly from members who buy via your personal invite link.
                </p>
              </div>

              {/* Pod 2: Tier 2 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-blue-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                    Tier 2 (0.6%)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">30% share</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-blue-600">
                    +{tier2Bnb.toFixed(3)} BNB
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    ≈ ${tier2Usd.toFixed(2)} USD
                  </div>
                  <div className="text-[11px] font-mono text-blue-700 mt-1 font-semibold">
                    +{Math.round(tier2Mbr).toLocaleString('en-US')} MBR
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
                  Earned from second-generation buyers invited by your Tier 1 friends.
                </p>
              </div>

              {/* Pod 3: Tier 3 */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-3 hover:border-emerald-300 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
                    Tier 3 (0.4%)
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">20% share</span>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-extrabold font-mono text-emerald-600">
                    +{tier3Bnb.toFixed(3)} BNB
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5">
                    ≈ ${tier3Usd.toFixed(2)} USD
                  </div>
                  <div className="text-[11px] font-mono text-emerald-700 mt-1 font-semibold">
                    +{Math.round(tier3Mbr).toLocaleString('en-US')} MBR
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 border-t border-slate-100 pt-2 leading-relaxed">
                  Earned from community buyers invited across your Tier 2 network.
                </p>
              </div>

              {/* Pod 4: Total Cumulative Payout Card */}
              <div className="p-5 rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-500/15 via-amber-400/20 to-amber-500/10 shadow-md space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-2xs">
                      ★ TOTAL PAYOUT (2.0%)
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="mt-2.5">
                    <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950">
                      +{totalRewardBnb.toFixed(3)} BNB
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-900 mt-0.5">
                      ≈ ${totalRewardUsd.toFixed(2)} USD
                    </div>
                    <div className="text-xs font-mono text-slate-900 mt-1 font-bold">
                      +{Math.round(totalRewardMbr).toLocaleString('en-US')} MBR
                    </div>
                  </div>
                </div>

                <a
                  href="#/dashboard"
                  className="mt-2 w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Get Referral Link</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </motion.div>


        <Disclaimer topic="rewards" className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
};
