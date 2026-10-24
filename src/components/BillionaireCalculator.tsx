import React, { useState, useMemo } from 'react';
import { Calculator, Sparkles, TrendingUp, DollarSign, Award, Trophy } from 'lucide-react';
import { triggerBillionaireConfetti } from '../utils/confetti';
import { Disclaimer } from './ui/Disclaimer';

export const BillionaireCalculator: React.FC = () => {
  const [tokensHeld, setTokensHeld] = useState<number>(500000);
  const [selectedTargetPrice, setSelectedTargetPrice] = useState<number>(2000);
  const [holdMonths, setHoldMonths] = useState<number>(60);

  const annualCompoundingYield = 0.16;
  const compoundedTokens = useMemo(() => {
    const years = holdMonths / 12;
    return tokensHeld * Math.pow(1 + annualCompoundingYield, years);
  }, [tokensHeld, holdMonths]);

  const earnedTokens = Math.max(0, compoundedTokens - tokensHeld);
  const totalProjectedValue = compoundedTokens * selectedTargetPrice;
  const initialCostUsd = tokensHeld * 0.00248;
  const roiMultiplier = initialCostUsd > 0 ? totalProjectedValue / initialCostUsd : 0;
  const isBillionaire = totalProjectedValue >= 1000000000;
  const isMillionaire = totalProjectedValue >= 1000000;

  const targetPrices = [
    { label: 'Initial DEX', price: 0.10, text: '$0.10' },
    { label: 'CEX Listing', price: 1.00, text: '$1.00' },
    { label: 'Tier-1 Target', price: 10.00, text: '$10.00' },
    { label: 'Bridge Expansion', price: 100.00, text: '$100.00' },
    { label: '2035 Target Goal', price: 2000, text: '$2,000', isCrown: true },
  ];

  const presets = [
    { label: '50K MBR', value: 50000 },
    { label: '250K MBR', value: 250000 },
    { label: '500K MBR', value: 500000 },
    { label: '1M MBR', value: 1000000 },
    { label: '5M MBR (Whale)', value: 5000000 },
  ];

  const handleCelebrate = () => {
    triggerBillionaireConfetti();
  };

  return (
    <section id="calculator" className="py-24 relative overflow-hidden section-ice border-t border-slate-200">
      {/* Background Ambient Lighting */}
      <div className="absolute top-1/2 left-1/4 w-[700px] h-[500px] bg-amber-500/[0.08] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[600px] h-[450px] bg-emerald-500/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-md">
            <Calculator className="w-3.5 h-3.5 text-gold-600" />
            ROI & WEALTH SIMULATOR
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
            The <span className="text-gradient-gold">Billionaire</span> ROI Simulator
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            “Buy and hold, you will be a billionaire one day.” Project your passive 2% DEX reflection compounding toward the 2035 milestone of $2,000.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls (7 Cols) */}
          <div className="lg:col-span-7 luxe-card p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white to-[#0A101F] border border-slate-200 shadow-xl space-y-7">
            
            {/* Tokens Held Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 uppercase tracking-wider">Your MBR Holdings</span>
                <span className="text-gold-600 font-bold">150M Max Capped Supply</span>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 focus-within:border-gold-400/60 transition-colors">
                <input
                  type="number"
                  min="1000"
                  step="10000"
                  value={tokensHeld}
                  onChange={(e) => setTokensHeld(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full bg-transparent text-2xl font-bold font-mono text-slate-900 focus:outline-none"
                />
                <span className="text-xs font-mono font-bold text-gold-600 bg-gold-50 border border-gold-300/50 px-3 py-1.5 rounded-xl shrink-0">
                  MBR
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 pt-1">
                {presets.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => setTokensHeld(preset.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all ${
                      tokensHeld === preset.value
                        ? 'bg-navy-800 text-white font-bold shadow-md shadow-slate-900/10'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Price Milestones */}
            <div className="space-y-3">
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                Select Valuation Target Milestone
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {targetPrices.map((target) => (
                  <button
                    key={target.text}
                    onClick={() => setSelectedTargetPrice(target.price)}
                    className={`p-3 rounded-2xl text-center border transition-all ${
                      selectedTargetPrice === target.price
                        ? 'bg-gold-100 border-amber-400 shadow-lg shadow-slate-900/10'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-slate-500 uppercase">{target.label}</div>
                    <div className={`text-lg font-bold font-mono mt-1 ${selectedTargetPrice === target.price ? 'text-gold-600' : 'text-slate-900'}`}>
                      {target.text}
                    </div>
                    {target.isCrown && (
                      <span className="text-[9px] font-mono font-bold text-gold-600 block mt-0.5">
                        👑 2035 Goal
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Hold Duration Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500 uppercase tracking-wider">Holding Horizon</span>
                <span className="text-gold-600 font-bold">{(holdMonths / 12).toFixed(1)} Years ({holdMonths} Months)</span>
              </div>

              <input
                type="range"
                min="6"
                max="120"
                step="6"
                value={holdMonths}
                onChange={(e) => setHoldMonths(parseInt(e.target.value))}
                className="gold-range"
              />

              <div className="flex justify-between text-[10px] font-mono text-slate-500">
                <span>6 Months</span>
                <span>2.5 Years</span>
                <span>5 Years (LP Unlock)</span>
                <span>10 Years (2035 Target)</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Estimated Initial Acquisition Cost:</span>
              <span className="text-slate-900 font-bold">${initialCostUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>

          </div>

          {/* Results Summary Card (5 Cols) */}
          <div className="lg:col-span-5 luxe-card p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#111C38] via-[#0E162D] to-[#080D1A] border-2 border-gold-400/60 shadow-2xl relative overflow-hidden space-y-6">
            
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold-100 rounded-full blur-[80px] pointer-events-none" />

            {/* Status Pill */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                PROJECTED PORTFOLIO VALUE
              </span>
              {isBillionaire ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-navy-800 text-white shadow-lg shadow-slate-900/10 flex items-center gap-1">
                  <Trophy className="w-3 h-3 text-black" />
                  BILLIONAIRE STATUS 👑
                </span>
              ) : isMillionaire ? (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-600 border border-emerald-500/30 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  MILLIONAIRE CLUB
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/20 text-blue-600 border border-blue-500/30">
                  GROWTH TRAJECTORY
                </span>
              )}
            </div>

            {/* Giant Valuation Number */}
            <div className="space-y-1">
              <div className="text-3xl sm:text-5xl font-black font-display text-gradient-gold tracking-tight">
                ${totalProjectedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <div className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>ROI Multiplier: {roiMultiplier.toLocaleString(undefined, { maximumFractionDigits: 0 })}x</span>
              </div>
            </div>

            {/* Breakdown Grid */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Compounded Tokens:</span>
                <span className="text-slate-900 font-bold">{Math.round(compoundedTokens).toLocaleString()} MBR</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Passive Reflection Earned:</span>
                <span className="text-emerald-600 font-bold">+{Math.round(earnedTokens).toLocaleString()} MBR</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs font-mono">
                <span className="text-slate-500">Target Valuation Per MBR:</span>
                <span className="text-gold-600 font-bold">${selectedTargetPrice.toLocaleString()}</span>
              </div>
            </div>

            {/* Celebrate / Action Button */}
            <div className="pt-2">
              <button
                onClick={handleCelebrate}
                className="w-full btn-gold py-4 text-xs font-extrabold uppercase tracking-wider text-black rounded-full shadow-lg shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-95"
              >
                🎉 Celebrate Billionaire Projection
              </button>
            </div>

          </div>

        </div>


        <Disclaimer topic="projection" className="mx-auto mt-10 max-w-4xl" />
      </div>
    </section>
  );
};
