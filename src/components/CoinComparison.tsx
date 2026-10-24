import React, { useState } from 'react';
import { COMPARISON_DATA } from '../data/tokenData';
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  DollarSign, 
  Trophy 
} from 'lucide-react';
import { Disclaimer } from './ui/Disclaimer';

export const CoinComparison: React.FC = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>('DOGE');
  const [viewMode, setViewMode] = useState<'duel' | 'matrix'>('duel');

  const competitor = COMPARISON_DATA.find((c) => c.symbol === selectedCoin) || COMPARISON_DATA[2];

  return (
    <section id="coin-comparison" className="py-24 relative overflow-hidden section-cream border-t border-slate-200">
      {/* Subtle Ambient Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[500px] bg-amber-400/[0.07] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-md">
            <Trophy className="w-3.5 h-3.5 text-gold-600" />
            BENCHMARK & METRICS
          </div>

          <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
            How <span className="text-gradient-gold">MyBitRich</span> Compares
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Standard cryptocurrencies rely purely on speculative hype and generate zero passive yield. See how the <strong className="text-gold-600 font-semibold">“Buy & Hold to Billionaire”</strong> protocol performs side-by-side.
          </p>

          {/* Mode Switcher */}
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setViewMode('duel')}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                viewMode === 'duel'
                  ? 'btn-gold shadow-md shadow-slate-900/10'
                  : 'btn-glass text-slate-600 hover:text-slate-900'
              }`}
            >
              Head-to-Head Duel
            </button>
            <button
              onClick={() => setViewMode('matrix')}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                viewMode === 'matrix'
                  ? 'btn-gold shadow-md shadow-slate-900/10'
                  : 'btn-glass text-slate-600 hover:text-slate-900'
              }`}
            >
              Full Comparison Table
            </button>
          </div>
        </div>

        {/* DUEL VIEW */}
        {viewMode === 'duel' ? (
          <div className="space-y-8">
            
            {/* Competitor Selector Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-xs font-mono text-slate-500 mr-2 uppercase tracking-wider hidden sm:inline">Compare with:</span>
              {COMPARISON_DATA.slice(1).map((coin) => (
                <button
                  key={coin.symbol}
                  onClick={() => setSelectedCoin(coin.symbol)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                    selectedCoin === coin.symbol
                      ? 'bg-gold-100 text-gold-600 border border-amber-400 shadow-md font-bold'
                      : 'bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <span className="text-sm">{coin.logo}</span>
                  <span>{coin.name} ({coin.symbol})</span>
                </button>
              ))}
            </div>

            {/* Duel Arena */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* MyBitRich Card */}
              <div className="luxe-card p-8 border-2 border-amber-400/80 shadow-2xl shadow-slate-900/10 relative overflow-hidden bg-gradient-to-b from-[#0F182E] to-[#0A101F]">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-gold-400 to-gold-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl shadow-md">
                  👑 PROTOCOL WINNER
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gold-100 border border-gold-400/60 flex items-center justify-center text-3xl shadow-md shadow-slate-900/10">
                    👑
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-display text-slate-900">
                      MyBitRich <span className="text-gold-600">(MBR)</span>
                    </h3>
                    <p className="text-xs font-mono text-gold-600">
                      Motto: Buy & Hold You Will Be Billionaire One Day
                    </p>
                  </div>
                </div>

                {/* Metric Bars */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono font-semibold">
                      <span className="text-gold-600 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" /> Passive Reflection Yield
                      </span>
                      <span className="text-emerald-600 font-bold">2% on Every DEX Trade</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Distributed automatically to all holder balances with zero claiming fees or lock delays.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono font-semibold">
                      <span className="text-slate-600">Locked Liquidity</span>
                      <span className="text-emerald-600 font-bold">5 Years (PinkLock / Streamflow)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-emerald-500 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      100% of initial LP locked until 2030–31 for rug-pull protection and long-term price stability.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono font-semibold">
                      <span className="text-slate-600">Capped Supply Scarcity</span>
                      <span className="text-gold-600 font-bold">150M MBR fixed supply</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[95%] h-full bg-amber-400 rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Fixed total supply of 150,000,000 MBR (15 Cr).
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-mono font-semibold">
                      <span className="text-slate-600">3-Tier Referral Rewards</span>
                      <span className="text-blue-600 font-bold">2.0% Total Bonus (1.0/0.6/0.4)</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-[90%] h-full bg-[#0071E3] rounded-full" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Multi-tier on-chain rewards for community builders and active holders.
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">2035 Target Milestone:</span>
                  <span className="text-gold-600 font-bold text-sm">$2,000 / Token ($300B Target)</span>
                </div>
              </div>

              {/* Competitor Card */}
              <div className="luxe-card p-8 border border-slate-200 relative overflow-hidden bg-gradient-to-b from-white to-slate-50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-3xl shadow-sm">
                      {competitor.logo}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold font-display text-slate-900">
                        {competitor.name} <span className="text-slate-500">({competitor.symbol})</span>
                      </h3>
                      <p className="text-xs font-mono text-slate-500">
                        Market Category: {competitor.summary}
                      </p>
                    </div>
                  </div>

                  {/* Competitor Metrics */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono font-semibold">
                        <span className="text-slate-500">Passive Reflection Yield</span>
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> None (0%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[5%] h-full bg-slate-300 rounded-full" />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Holders receive zero yield unless executing risky third-party staking or lending.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono font-semibold">
                        <span className="text-slate-500">Liquidity Lock</span>
                        <span className="text-slate-500 font-medium">Unlocked / Variable Pool</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[30%] h-full bg-slate-300 rounded-full" />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Market-maker liquidity can be pulled or relocated at any time by major whales.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono font-semibold">
                        <span className="text-slate-500">Supply Inflation Mechanics</span>
                        <span className="text-slate-500 font-medium">{competitor.supplyModel}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[20%] h-full bg-slate-300 rounded-full" />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Trillions to infinite circulating tokens diluting individual purchasing power.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono font-semibold">
                        <span className="text-slate-500">Referral Incentives</span>
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> None (0%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="w-[0%] h-full bg-slate-300 rounded-full" />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        No built-in protocol referral mechanism rewarding community advocates.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Growth Multiplier:</span>
                  <span className="text-slate-500 font-medium">Saturated Market Cap</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* MATRIX VIEW */
          <div className="luxe-card overflow-hidden border border-slate-200 bg-white/90 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Metric</th>
                    <th className="py-4 px-6 text-gold-600 font-bold bg-gold-50">MyBitRich (MBR)</th>
                    <th className="py-4 px-6 font-semibold">Bitcoin (BTC)</th>
                    <th className="py-4 px-6 font-semibold">Dogecoin (DOGE)</th>
                    <th className="py-4 px-6 font-semibold">Shiba Inu (SHIB)</th>
                    <th className="py-4 px-6 font-semibold">Pepe (PEPE)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Holder Reflection Yield</td>
                    <td className="py-4 px-6 bg-gold-50 font-bold text-emerald-600">2% on Every Trade</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Total Supply Scarcity</td>
                    <td className="py-4 px-6 bg-gold-50 font-bold text-gold-600">150,000,000 (Fixed)</td>
                    <td className="py-4 px-6">21,000,000</td>
                    <td className="py-4 px-6 text-rose-600">Infinite (140B+)</td>
                    <td className="py-4 px-6 text-rose-600">589 Trillion</td>
                    <td className="py-4 px-6 text-rose-600">420 Trillion</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">Liquidity Lock Period</td>
                    <td className="py-4 px-6 bg-gold-50 font-bold text-emerald-600">5 Years (100% initial LP)</td>
                    <td className="py-4 px-6 text-slate-500">Variable / None</td>
                    <td className="py-4 px-6 text-slate-500">Variable / None</td>
                    <td className="py-4 px-6 text-slate-500">Variable / None</td>
                    <td className="py-4 px-6 text-slate-500">Variable / None</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">3-Tier Referral Module</td>
                    <td className="py-4 px-6 bg-gold-50 font-bold text-blue-600">2.0% Total Bonus</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                    <td className="py-4 px-6 text-slate-500">0%</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">2035 Target Valuation</td>
                    <td className="py-4 px-6 bg-gold-50 font-bold text-gold-600 text-sm">$2,000 Milestone</td>
                    <td className="py-4 px-6">$1,000,000</td>
                    <td className="py-4 px-6">$1.00</td>
                    <td className="py-4 px-6">$0.001</td>
                    <td className="py-4 px-6">$0.0001</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}


        <Disclaimer topic="comparison" className="mx-auto mt-10 max-w-4xl" />
      </div>
    </section>
  );
};
