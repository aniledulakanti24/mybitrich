import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Sparkles, TrendingUp, DollarSign, Coins, Award, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { triggerBillionaireConfetti } from '../../utils/confetti';
import { Calculator3DStack } from '../3d/Calculator3DStack';
import { Disclaimer } from '../ui/Disclaimer';

interface CalculatorPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

export const CalculatorPage: React.FC<CalculatorPageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
}) => {
  const [investmentUsd, setInvestmentUsd] = useState<number>(500);
  const [holdingYears, setHoldingYears] = useState<number>(10);
  const [targetPrice, setTargetPrice] = useState<number>(2000); // 2035 Horizon Goal

  const currentPrice = 0.00248;
  const initialTokens = Math.floor(investmentUsd / currentPrice);

  // 16% estimated annual reflection yield APY
  const compoundedMultiplier = Math.pow(1.16, holdingYears);
  const projectedTokens = Math.floor(initialTokens * compoundedMultiplier);
  const reflectionTokensEarned = projectedTokens - initialTokens;

  // Projected portfolio at target price
  const projectedUsdValue = projectedTokens * targetPrice;
  const returnMultiplier = Math.round(projectedUsdValue / investmentUsd);

  const handleCelebrate = () => {
    triggerBillionaireConfetti();
  };

  return (
    <div className="pt-32 pb-12 sm:pt-40 sm:pb-20 relative overflow-hidden section-hero text-slate-800">
      {/* Ambient Depth Glows */}
      <div className="absolute top-10 right-1/4 w-[700px] h-[500px] bg-amber-400/[0.09] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-[600px] h-[500px] bg-emerald-500/[0.08] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* HERO SECTION: Split Layout with 3D Compounding Stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-sm">
              <Calculator className="w-3.5 h-3.5 text-gold-600" />
              WEALTH ACCUMULATION SIMULATOR
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
              Simulate Your <span className="text-gradient-gold">Billionaire Horizon</span> with 2% Holder Rewards
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Unlike typical tokens that require complex staking lockups, MyBitRich continuously reflects 2% of global volume straight into your wallet. When combined with mathematical scarcity (150M cap), compounding yield builds generational net worth.
            </p>

            {/* Quick Math Snapshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Initial Tokens</div>
                <div className="text-lg font-bold font-mono text-slate-900 mt-0.5">{initialTokens.toLocaleString()}</div>
                <div className="text-[10px] text-gold-600 font-mono">150M Capped Supply</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center">
                <div className="text-[10px] font-mono text-slate-500 uppercase">Yield Earned ({holdingYears} Yrs)</div>
                <div className="text-lg font-bold font-mono text-emerald-600 mt-0.5">+{reflectionTokensEarned.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-600 font-mono">0 Gas · Automated</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gold-400/60 text-center bg-gradient-to-b from-white to-slate-50">
                <div className="text-[10px] font-mono text-gold-600 uppercase font-bold">Projected Net Worth</div>
                <div className="text-xl font-extrabold font-mono text-gold-600 mt-0.5">${(projectedUsdValue / 1000000).toFixed(2)}M</div>
                <div className="text-[10px] text-gold-600 font-mono">{returnMultiplier.toLocaleString()}x Multiplier</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleCelebrate}
                className="btn-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm text-black"
              >
                <Sparkles className="w-4 h-4 text-black" />
                <span>Simulate Billionaire Goal</span>
              </button>

              <button
                onClick={onOpenSwapModal}
                className="btn-glass px-7 py-3.5 text-xs font-semibold text-slate-900 hover:border-gold-400/60"
              >
                <span>Acquire MBR on DEX</span>
              </button>
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

        {/* FULL INTERACTIVE SIMULATOR CONTROLS */}
        <motion.div {...sectionAnimation} className="luxe-card p-8 sm:p-12 rounded-3xl border border-slate-200 space-y-10 shadow-xl">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              Customize Your Wealth Simulation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Adjust your purchase amount, holding horizon, and target valuation milestone to calculate mathematical compounding outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Slider 1: Investment Amount */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 uppercase">Initial Investment:</span>
                <span className="text-gold-600 font-bold text-lg">${investmentUsd.toLocaleString()} USD</span>
              </div>
              <input
                type="range"
                min="50"
                max="10000"
                step="50"
                value={investmentUsd}
                onChange={(e) => setInvestmentUsd(parseFloat(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>$50 Min</span>
                <span>$1,000</span>
                <span>$5,000</span>
                <span>$10,000 Max</span>
              </div>
            </div>

            {/* Slider 2: Holding Duration */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 uppercase">Holding Horizon:</span>
                <span className="text-blue-600 font-bold text-lg">{holdingYears} Years ({2025 + holdingYears})</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={holdingYears}
                onChange={(e) => setHoldingYears(parseInt(e.target.value))}
                className="w-full accent-[#38BDF8] cursor-pointer h-2 bg-slate-100 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>1 Year</span>
                <span>3 Years</span>
                <span>5 Years</span>
                <span>10 Years (2035)</span>
              </div>
            </div>

            {/* Slider 3: Target Price Milestone */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 uppercase">Target Price Milestone:</span>
                <span className="text-emerald-600 font-bold text-lg">${targetPrice.toLocaleString()} / MBR</span>
              </div>
              <div className="flex gap-2">
                {[10, 100, 500, 2000].map((tp) => (
                  <button
                    key={tp}
                    onClick={() => setTargetPrice(tp)}
                    className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl transition-all ${
                      targetPrice === tp
                        ? 'btn-gold text-black shadow-sm'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    ${tp}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-slate-500 text-center">
                $2,000 Milestone = $300B Implied Valuation at 150M Cap
              </div>
            </div>

          </div>

          {/* Grand Projection Result Podium */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-white to-gold-50 border border-gold-400/60 text-center space-y-4 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 text-xs font-mono uppercase font-bold">
              <Award className="w-4 h-4 text-gold-600" />
              PROJECTED PORTFOLIO OUTCOME
            </div>

            <div className="text-4xl sm:text-6xl font-extrabold font-mono text-gold-600 tracking-tight">
              ${projectedUsdValue > 1000000 ? `${(projectedUsdValue / 1000000).toFixed(2)} Million USD` : projectedUsdValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>

            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Holding <strong className="text-slate-900">{projectedTokens.toLocaleString()} total MBR tokens</strong> (including {reflectionTokensEarned.toLocaleString()} earned passively through 2% reflections) valued at ${targetPrice.toLocaleString()} per token.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleCelebrate}
                className="btn-gold px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black shadow-lg shadow-slate-900/10"
              >
                🎉 Celebrate Billionaire Projection
              </button>
              <button
                onClick={onOpenSwapModal}
                className="btn-glass px-8 py-3.5 text-xs font-semibold text-slate-900 hover:border-gold-400/60"
              >
                Buy Now to Lock in Rate
              </button>
            </div>
          </div>

        </motion.div>


        <Disclaimer topic="projection" className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
};
