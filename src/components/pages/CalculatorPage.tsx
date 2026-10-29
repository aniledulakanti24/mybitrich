import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  Sparkles,
  TrendingUp,
  DollarSign,
  Coins,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock,
  Percent,
  Layers,
  BarChart3,
  Check,
  Flame,
  ArrowUpRight,
  Wallet,
  RotateCcw,
} from 'lucide-react';
import { triggerBillionaireConfetti } from '../../utils/confetti';
import { Calculator3DStack } from '../3d/Calculator3DStack';
import { Disclaimer } from '../ui/Disclaimer';

interface CalculatorPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

// Preset Scenarios
interface PresetScenario {
  id: string;
  name: string;
  tag: string;
  investment: number;
  years: number;
  price: number;
  apy: number;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'believer',
    name: 'Early Believer',
    tag: 'Direct Fair Launch Pioneer',
    investment: 250,
    years: 10,
    price: 2000,
    apy: 16,
  },
  {
    id: 'sovereign',
    name: 'The Sovereign Billionaire',
    tag: '10-Year Generational Target',
    investment: 500,
    years: 10,
    price: 2000,
    apy: 16,
  },
  {
    id: 'whale',
    name: 'Strategic Whale',
    tag: '5-Year Accelerated Liquidity',
    investment: 2500,
    years: 5,
    price: 500,
    apy: 16,
  },
  {
    id: 'conservative',
    name: 'Conservative Holder',
    tag: 'Mid-Cap Tier-1 Adoption',
    investment: 1000,
    years: 3,
    price: 100,
    apy: 16,
  },
];

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
}) => {
  // Core parameters
  const [investmentUsd, setInvestmentUsd] = useState<number>(500);
  const [holdingYears, setHoldingYears] = useState<number>(10);
  const [annualApy, setAnnualApy] = useState<number>(16); // 16% compounded annual reflection yield
  const [targetPrice, setTargetPrice] = useState<number>(2000); // Target MBR price ($2,000)
  const [activeScenario, setActiveScenario] = useState<string>('sovereign');

  const currentPrice = 0.00248; // Base token launch price
  const initialTokens = Math.floor(investmentUsd / currentPrice);

  // Compounded reflection yield: (1 + APY)^years
  const compoundedMultiplier = Math.pow(1 + annualApy / 100, holdingYears);
  const projectedTokens = Math.floor(initialTokens * compoundedMultiplier);
  const reflectionTokensEarned = Math.max(0, projectedTokens - initialTokens);

  // USD Portfolio Value
  const totalValue = projectedTokens * targetPrice;
  const estReturns = Math.max(0, totalValue - investmentUsd);
  const returnMultiplier = Math.round(totalValue / (investmentUsd || 1));

  // Proportions
  const basePercentage = ((initialTokens / (projectedTokens || 1)) * 100).toFixed(1);
  const reflectionPercentage = ((reflectionTokensEarned / (projectedTokens || 1)) * 100).toFixed(1);
  const effectiveCostPerToken = (investmentUsd / (projectedTokens || 1)).toFixed(5);

  // Number formatting
  const formatCompact = (val: number) => {
    if (val >= 1_000_000_000_000) {
      return { num: (val / 1_000_000_000_000).toFixed(2), suffix: 'Trillion' };
    }
    if (val >= 1_000_000_000) {
      return { num: (val / 1_000_000_000).toFixed(2), suffix: 'Billion' };
    }
    if (val >= 1_000_000) {
      return { num: (val / 1_000_000).toFixed(2), suffix: 'Million' };
    }
    return { num: Math.round(val).toLocaleString(), suffix: 'USD' };
  };

  const formattedValue = formatCompact(totalValue);

  // Investor Tier
  const getTier = (val: number) => {
    if (val >= 1_000_000_000) {
      return {
        label: 'Generational Billionaire Club',
        icon: '💎',
        chipStyle: 'bg-amber-400/15 border-amber-400/40 text-amber-900',
        glow: 'shadow-[0_0_30px_rgba(245,192,66,0.35)]',
      };
    }
    if (val >= 100_000_000) {
      return {
        label: 'Centimillionaire Sovereign Tier',
        icon: '🏛️',
        chipStyle: 'bg-emerald-400/15 border-emerald-400/40 text-emerald-900',
        glow: 'shadow-[0_0_25px_rgba(16,185,129,0.3)]',
      };
    }
    if (val >= 10_000_000) {
      return {
        label: 'Multi-Decamillionaire',
        icon: '👑',
        chipStyle: 'bg-blue-400/15 border-blue-400/40 text-blue-900',
        glow: 'shadow-[0_0_20px_rgba(59,130,246,0.25)]',
      };
    }
    if (val >= 1_000_000) {
      return {
        label: 'Official Crypto Millionaire',
        icon: '🏆',
        chipStyle: 'bg-cyan-400/15 border-cyan-400/40 text-cyan-900',
        glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      };
    }
    return {
      label: 'High-Velocity Accumulator',
      icon: '🚀',
      chipStyle: 'bg-slate-100 border-slate-300 text-slate-800',
      glow: '',
    };
  };

  const currentTier = getTier(totalValue);

  // SVG Arch Gauge calculations (180 degree semi-circle, radius = 90)
  // Total arc length = PI * 90 = 282.74
  const ARC_LENGTH = Math.PI * 90;
  // Normalized ratio for token growth visualization
  const tokenRatio = Math.min(1, Math.max(0.05, initialTokens / (projectedTokens || 1)));
  const baseArc = tokenRatio * ARC_LENGTH;
  const yieldArc = (1 - tokenRatio) * ARC_LENGTH;

  // Apply Scenario
  const handleApplyScenario = (s: PresetScenario) => {
    setActiveScenario(s.id);
    setInvestmentUsd(s.investment);
    setHoldingYears(s.years);
    setTargetPrice(s.price);
    setAnnualApy(s.apy);
  };

  const handleCelebrate = () => {
    triggerBillionaireConfetti();
  };

  // Slider style helper
  const getTrackStyle = (val: number, min: number, max: number, startColor = '#F59E0B', endColor = '#D97706') => {
    const pct = ((val - min) / (max - min)) * 100;
    return {
      background: `linear-gradient(to right, ${startColor} 0%, ${endColor} ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`,
    };
  };

  return (
    <div className="pt-32 pb-20 sm:pt-40 sm:pb-28 relative overflow-hidden section-hero text-slate-800">
      {/* Ambient background glows */}
      <div className="absolute top-10 right-1/4 w-[750px] h-[550px] bg-amber-400/[0.08] rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[650px] h-[550px] bg-blue-500/[0.06] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* HERO SECTION: Split Layout with 3D Compounding Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-xs">
              <Calculator className="w-3.5 h-3.5 text-gold-600" />
              WEALTH ACCUMULATION TERMINAL
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
              Simulate Your <span className="text-gradient-gold">Billionaire Horizon</span> with 2% Holder Rewards
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Unlike typical tokens that require complex lockups, MyBitRich continuously reflects 2% of global volume straight into your wallet. When combined with mathematical scarcity (150M cap), compounding yield builds generational net worth.
            </p>

            {/* Quick Math Snapshot Cards */}
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 text-center shadow-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Initial Buy</div>
                <div className="text-base sm:text-lg font-bold font-mono text-slate-900 mt-0.5">{initialTokens.toLocaleString()}</div>
                <div className="text-[10px] text-slate-500 font-mono">MBR Base</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/90 border border-slate-200/90 text-center shadow-xs">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-semibold">2% Yield Bonus</div>
                <div className="text-base sm:text-lg font-bold font-mono text-emerald-600 mt-0.5">+{reflectionTokensEarned.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-mono">0 Gas Required</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-white border border-amber-300/80 text-center shadow-xs">
                <div className="text-[10px] font-mono text-amber-700 uppercase font-bold">Estimated Returns</div>
                <div className="text-base sm:text-lg font-extrabold font-mono text-amber-600 mt-0.5">{formattedValue.num} {formattedValue.suffix}</div>
                <div className="text-[10px] text-amber-700 font-mono font-semibold">{returnMultiplier.toLocaleString()}x Multiplier</div>
              </div>
            </div>
          </div>

          {/* Right: Interactive 3D Compounding Stack */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[480px] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <Calculator3DStack className="relative z-10" />
            </div>
            <div className="text-center mt-3 text-xs font-mono text-slate-500">
              Interactive 3D Compounding Wealth Stack & Coin Vault
            </div>
          </div>
        </div>

        {/* =========================================================================
            INNOVATIVE WEALTH ARCHITECTURE SIMULATION ENGINE
           ========================================================================= */}
        <motion.div {...sectionAnimation} className="space-y-6">
          
          {/* Preset Investor Profiles Scenarios Ribbon */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-semibold block">
                One-Click Scenarios
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Choose An Investor Profile
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:flex sm:items-center gap-2">
              {PRESET_SCENARIOS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleApplyScenario(s)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono transition-all text-left sm:text-center ${
                    activeScenario === s.id
                      ? 'bg-slate-900 text-white font-bold shadow-md scale-[1.02]'
                      : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div className="font-bold">{s.name}</div>
                  <div className="text-[10px] opacity-75">${s.investment} · {s.years}Y · ${s.price}</div>
                </button>
              ))}
            </div>
          </div>

          {/* MAIN WEALTH COCKPIT CARD */}
          <div className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl space-y-12">
            
            {/* Ambient decorative sheen */}
            <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            {/* ===================================================================
                STAGE 1: THE GRAND RESULT PODIUM (TOP HERO FOCUS)
               =================================================================== */}
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-8 border-b border-slate-100">
              
              {/* Left 7 Cols: Massive Hero Value & Tier Readout */}
              <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                
                {/* Dynamic Tier Chip */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono font-bold tracking-wide shadow-xs transition-all duration-300">
                  <span className="text-base">{currentTier.icon}</span>
                  <span className="uppercase text-slate-800">{currentTier.label}</span>
                </div>

                {/* Big Animated Typography Number */}
                <div className="space-y-1">
                  <div className="text-[11px] font-mono uppercase tracking-[0.2em] font-semibold text-slate-400">
                    Projected Portfolio Value (2025 – {2025 + holdingYears})
                  </div>
                  <div className="flex items-baseline justify-center lg:justify-start gap-3 flex-wrap">
                    <motion.span
                      key={formattedValue.num}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-5xl sm:text-7xl lg:text-8xl font-black font-display tracking-tight text-slate-900 drop-shadow-xs"
                    >
                      ${formattedValue.num}
                    </motion.span>
                    <span className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-gradient-gold">
                      {formattedValue.suffix}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-slate-500">
                    Exact Mathematical Projection:{' '}
                    <strong className="text-slate-800 font-semibold">${Math.round(totalValue).toLocaleString()} USD</strong>
                  </div>
                </div>

                {/* Return Multiplier & Token Count Pill */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 font-mono text-xs">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-800 font-bold">
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{returnMultiplier.toLocaleString()}x Total Return</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-700">
                    <Coins className="w-3.5 h-3.5 text-slate-500" />
                    <span>{projectedTokens.toLocaleString()} Total Tokens</span>
                  </span>
                </div>
              </div>

              {/* Right 5 Cols: Animated Compounding Spectrum Arc Gauge */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                
                <div className="relative w-64 h-36 sm:w-72 sm:h-40 flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 240 135">
                    <defs>
                      <linearGradient id="arcGoldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#F59E0B" />
                        <stop offset="50%" stopColor="#FBBF24" />
                        <stop offset="100%" stopColor="#D97706" />
                      </linearGradient>
                      <linearGradient id="arcBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#1E3A8A" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>

                    {/* Background Track (180 degree semi-circle arch) */}
                    <path
                      d="M 30,120 A 90,90 0 0,1 210,120"
                      fill="none"
                      stroke="#EEF2F6"
                      strokeWidth="20"
                      strokeLinecap="round"
                    />

                    {/* Base Capital Arc (Navy/Blue) */}
                    <path
                      d="M 30,120 A 90,90 0 0,1 210,120"
                      fill="none"
                      stroke="url(#arcBlueGrad)"
                      strokeWidth="20"
                      strokeDasharray={`${baseArc} ${ARC_LENGTH}`}
                      strokeDashoffset="0"
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />

                    {/* Passive Reflection Yield Arc (Gold Shimmer) */}
                    <path
                      d="M 30,120 A 90,90 0 0,1 210,120"
                      fill="none"
                      stroke="url(#arcGoldGrad)"
                      strokeWidth="20"
                      strokeDasharray={`${yieldArc} ${ARC_LENGTH}`}
                      strokeDashoffset={`-${baseArc}`}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Vault Token Emblem In Arc Center */}
                  <div className="absolute bottom-1 flex flex-col items-center justify-center text-center pointer-events-none">
                    <div className="w-11 h-11 flex items-center justify-center filter drop-shadow-sm">
                      <img src={`${import.meta.env.BASE_URL}assets/logo-mark.png`} alt="MBR" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-800 mt-1">
                      {reflectionPercentage}% Yield
                    </span>
                  </div>
                </div>

                {/* Arch Legend Badges */}
                <div className="flex items-center gap-4 text-xs font-mono pt-2">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Base Capital ({basePercentage}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>2% Reflection Yield ({reflectionPercentage}%)</span>
                  </div>
                </div>
              </div>

            </div>

            {/* ===================================================================
                STAGE 2: 3 MODULAR INTERACTIVE PARAMETER COCKPIT CARDS
               =================================================================== */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Card 1: Capital Investment */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-amber-300/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-300/40 flex items-center justify-center text-amber-600">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                      Initial Capital
                    </span>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-mono font-bold text-base shadow-2xs">
                    <span>$</span>
                    <input
                      type="number"
                      min="50"
                      max="50000"
                      step="50"
                      value={investmentUsd}
                      onChange={(e) => {
                        setActiveScenario('custom');
                        setInvestmentUsd(Math.max(0, parseFloat(e.target.value) || 0));
                      }}
                      className="w-16 bg-transparent text-right font-bold text-amber-950 outline-none"
                    />
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="50"
                  max="10000"
                  step="50"
                  value={investmentUsd}
                  onChange={(e) => {
                    setActiveScenario('custom');
                    setInvestmentUsd(parseFloat(e.target.value));
                  }}
                  style={getTrackStyle(investmentUsd, 50, 10000)}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-amber-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />

                {/* Quick Increment Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setActiveScenario('custom');
                        setInvestmentUsd(amt);
                      }}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-lg border transition-all ${
                        investmentUsd === amt
                          ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ${amt >= 1000 ? `${amt / 1000}k` : amt}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                  Buys ~<strong className="text-slate-700">{initialTokens.toLocaleString()} MBR</strong> at $0.00248 launch base
                </div>
              </div>

              {/* Card 2: Compounding Horizon & APY */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-blue-300/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-300/40 flex items-center justify-center text-blue-600">
                      <Clock className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                      Time Horizon
                    </span>
                  </div>

                  <div className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-mono font-bold text-base shadow-2xs">
                    {holdingYears} Yr ({2025 + holdingYears})
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={holdingYears}
                  onChange={(e) => {
                    setActiveScenario('custom');
                    setHoldingYears(parseInt(e.target.value));
                  }}
                  style={getTrackStyle(holdingYears, 1, 10, '#3B82F6', '#1E3A8A')}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />

                {/* Timeline Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { y: 1, label: '1 Yr' },
                    { y: 3, label: '3 Yr' },
                    { y: 5, label: '5 Yr' },
                    { y: 10, label: '10 Yr (2035)' },
                  ].map((item) => (
                    <button
                      key={item.y}
                      onClick={() => {
                        setActiveScenario('custom');
                        setHoldingYears(item.y);
                      }}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-lg border transition-all ${
                        holdingYears === item.y
                          ? 'bg-blue-600 text-white border-blue-600 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                  Compounding yield expands tokens by <strong className="text-blue-700">{compoundedMultiplier.toFixed(2)}x</strong>
                </div>
              </div>

              {/* Card 3: Target Price Milestone */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:border-emerald-300/80 transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-300/40 flex items-center justify-center text-emerald-600">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold text-slate-700">
                      Target Milestone
                    </span>
                  </div>

                  <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 font-mono font-bold text-base shadow-2xs">
                    <span>$</span>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      step="10"
                      value={targetPrice}
                      onChange={(e) => {
                        setActiveScenario('custom');
                        setTargetPrice(Math.max(1, parseFloat(e.target.value) || 1));
                      }}
                      className="w-16 bg-transparent text-right font-bold text-emerald-950 outline-none"
                    />
                    <span className="text-xs text-emerald-700 font-normal">/MBR</span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="10"
                  max="2000"
                  step="10"
                  value={targetPrice}
                  onChange={(e) => {
                    setActiveScenario('custom');
                    setTargetPrice(parseFloat(e.target.value));
                  }}
                  style={getTrackStyle(targetPrice, 10, 2000, '#10B981', '#047857')}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-emerald-600 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />

                {/* Price Milestone Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { p: 10, cap: '$1.5B' },
                    { p: 50, cap: '$7.5B' },
                    { p: 100, cap: '$15B' },
                    { p: 500, cap: '$75B' },
                    { p: 2000, cap: '$300B' },
                  ].map((item) => (
                    <button
                      key={item.p}
                      onClick={() => {
                        setActiveScenario('custom');
                        setTargetPrice(item.p);
                      }}
                      className={`px-2 py-0.5 text-[11px] font-mono rounded-lg border flex items-center gap-1 transition-all ${
                        targetPrice === item.p
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>${item.p}</span>
                      <span className={`text-[9px] ${targetPrice === item.p ? 'text-emerald-100' : 'text-slate-400'}`}>
                        ({item.cap})
                      </span>
                    </button>
                  ))}
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-100">
                  Target milestone based on <strong className="text-slate-700">150M capped total supply</strong>
                </div>
              </div>

            </div>

            {/* ===================================================================
                STAGE 3: BOTTOM DOCK & ACTION TERMINAL
               =================================================================== */}
            <div className="relative z-10 pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6">
              
              {/* 4 Summary Stat Cells */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1 font-mono">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Initial Buy</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">${investmentUsd.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{initialTokens.toLocaleString()} MBR</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
                  <div className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">2% Yield Bonus</div>
                  <div className="text-base font-bold text-emerald-700 mt-0.5">+{reflectionTokensEarned.toLocaleString()} MBR</div>
                  <div className="text-[10px] text-emerald-600">0 Gas · Autocompounded</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-blue-50/50 border border-blue-200/80">
                  <div className="text-[10px] uppercase tracking-wider text-blue-700 font-semibold">Effective Cost</div>
                  <div className="text-base font-bold text-blue-700 mt-0.5">${effectiveCostPerToken}</div>
                  <div className="text-[10px] text-blue-600">Per MBR token</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-300">
                  <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold">Total Valuation</div>
                  <div className="text-base font-black text-amber-700 mt-0.5">${Math.round(totalValue).toLocaleString()}</div>
                  <div className="text-[10px] text-amber-800 font-semibold">{returnMultiplier.toLocaleString()}x Trajectory</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 justify-end">
                <button
                  onClick={handleCelebrate}
                  className="px-5 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-xs hover:border-amber-300"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Celebrate Outcome</span>
                </button>

                <button
                  onClick={onOpenSwapModal}
                  className="btn-gold px-8 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-slate-950"
                >
                  <span>Acquire MBR on DEX</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>

            </div>

          </div>

        </motion.div>

        <Disclaimer topic="projection" className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
};
