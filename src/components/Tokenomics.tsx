import React from 'react';
import { TAX_MECHANICS, REFERRAL_TIERS } from '../data/tokenData';
import { PieChart, Users, Coins, Lock, Flame } from 'lucide-react';

export const Tokenomics: React.FC = () => {
  return (
    <section id="tokenomics" className="py-24 relative overflow-hidden section-cream border-t border-slate-200">
      {/* Multi-Color Ambient Depth */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[500px] bg-amber-400/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[650px] h-[500px] bg-[#0071E3]/[0.08] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-wider shadow-sm">
            <PieChart className="w-3.5 h-3.5 text-gold-600" />
            TOKENOMICS & TAX ARCHITECTURE
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Built for <span className="text-gradient-gold">Exponential Growth</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Strictly capped at 150 Million MBR with 100% of initial LP locked for 5 years. Every trade powers automatic holder yield, perpetual liquidity depth, and ecosystem expansion.
          </p>
        </div>

        {/* 4 Key Numbers Header Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <div className="luxe-card p-6 rounded-2xl text-center hover:border-gold-400/60 transition-all duration-300">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Total Supply</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">150,000,000</div>
            <div className="text-xs font-mono text-gold-600 font-medium mt-1">Fixed 150M MBR · 15 Cr</div>
          </div>

          <div className="luxe-card p-6 rounded-2xl text-center hover:border-emerald-400/40 transition-all duration-300">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">LP Lock Period</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-600 mt-1">5 Years</div>
            <div className="text-xs font-mono text-emerald-600 font-medium mt-1">Unicrypt / PinkLock / Streamflow</div>
          </div>

          <div className="luxe-card p-6 rounded-2xl text-center hover:border-gold-400/60 transition-all duration-300">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Transaction Tax</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-gold-600 mt-1">6% Total</div>
            <div className="text-xs font-mono text-slate-600 font-medium mt-1">2% Yield · 2% LP · 2% Treasury</div>
          </div>

          <div className="luxe-card p-6 rounded-2xl text-center hover:border-[#0071E3]/50 transition-all duration-300">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-wider">Network Standard</div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-blue-600 mt-1">BNB Chain</div>
            <div className="text-xs font-mono text-slate-500 font-medium mt-1">BEP-20 Standard · Chain 56</div>
          </div>
        </div>

        {/* 6% Tax Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {TAX_MECHANICS.map((tax, i) => (
            <div
              key={tax.component}
              className={`luxe-card p-7 sm:p-8 rounded-3xl space-y-5 transition-all duration-300 ${
                i === 0 
                  ? 'hover:border-emerald-400/50 hover:shadow-[0_10px_35px_rgba(16,185,129,0.15)]'
                  : i === 1 
                  ? 'hover:border-[#0071E3]/60 hover:shadow-[0_10px_35px_rgba(0,113,227,0.15)]' 
                  : 'hover:border-gold-400/60 hover:shadow-sm'
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

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
                  {i === 0 && <Coins className="w-5 h-5 text-emerald-600" />}
                  {i === 1 && <Lock className="w-5 h-5 text-blue-600" />}
                  {i === 2 && <Flame className="w-5 h-5 text-gold-600" />}
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

        {/* 3-Tier Buy Referral Banner */}
        <div className="luxe-card p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 pb-8 border-b border-slate-200">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300/50 text-gold-600 font-mono text-xs font-semibold uppercase">
                <Users className="w-3.5 h-3.5 text-gold-600" />
                On-Chain Referral Rewards
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                3-Tier Buy Referral Architecture
              </h3>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                Integrated directly into the smart contract. A total of 2.0% in rewards distributed directly to your wallet in real-time when new buyers acquire MBR using your referral address.
              </p>
            </div>

            <div className="shrink-0 text-left lg:text-right bg-white px-6 py-4 rounded-2xl border border-gold-300/50 shadow-md">
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-gold-600">
                2.0% Total
              </div>
              <div className="text-xs font-mono text-slate-500 uppercase tracking-wider mt-0.5">
                Instant On-Chain Payout
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {REFERRAL_TIERS.map((tier) => (
              <div key={tier.level} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-gold-400/60 transition-all space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-600">{tier.label}</span>
                  <span className="text-xl font-bold font-mono text-gold-600">{tier.pct}%</span>
                </div>
                <div className="text-xs text-slate-500 leading-relaxed">{tier.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
