import React from 'react';
import { Target, Compass, CheckCircle2, Shield } from 'lucide-react';

export const VisionMission: React.FC = () => {
  return (
    <section className="py-24 relative overflow-hidden section-ice border-t border-slate-200">
      {/* Subtle Ambient Depth Glows */}
      <div className="absolute top-1/2 left-1/4 w-[700px] h-[500px] bg-amber-400/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[450px] bg-[#0071E3]/[0.07] rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/35 text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider shadow-[0_0_15px_rgba(0,113,227,0.15)]">
            <Target className="w-3.5 h-3.5 text-blue-600" />
            PROTOCOL VISION & MISSION
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Strategic Roadmap to <span className="text-gradient-gold">Generational Wealth</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            MyBitRich is built to outlast market cycles. We are creating a sustainable wealth flywheel through automated transaction yield, capped scarcity, and permanent liquidity engineering.
          </p>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* OUR VISION */}
          <div className="luxe-card p-8 sm:p-10 rounded-3xl border border-slate-200 flex flex-col justify-between relative overflow-hidden hover:border-gold-400/60 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-300/50 flex items-center justify-center text-gold-600 shadow-sm">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-gold-50 text-gold-600 border border-gold-300/50">
                  Target: 2035 Horizon
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  Our Long-Term Vision
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-normal mt-2">
                  To build an internationally recognized wealth preservation asset that empowers everyday holders to break free from inflation, currency debasement, and predatory market volatility.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-gold-600 font-semibold block mb-0.5">$2,000 Milestone Target by 2035</strong>
                    A $300B implied market valuation milestone supported by a capped 150M MBR supply and continuous liquidity depth.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900 font-semibold block mb-0.5">Sovereign Layer-1 / Layer-2 Migration</strong>
                    Transitioning from a BEP-20 token to a native high-throughput blockchain ecosystem with dedicated validators.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900 font-semibold block mb-0.5">Real World Asset (RWA) Integration</strong>
                    Backing protocol reserves with tokenized institutional assets and sovereign yield instruments.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Motto: Hold with Conviction</span>
              <span className="text-gold-600 font-semibold">150M Capped Supply</span>
            </div>
          </div>

          {/* OUR MISSION */}
          <div className="luxe-card p-8 sm:p-10 rounded-3xl border border-slate-200 flex flex-col justify-between relative overflow-hidden hover:border-emerald-400/40 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-600 shadow-sm">
                  <Shield className="w-6 h-6" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-600 border border-emerald-500/30">
                  Execution Standard
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  Our Strategic Mission
                </h3>
                <p className="text-base text-slate-600 leading-relaxed font-normal mt-2">
                  To engineer an unruggable, high-speed economic system that rewards patience over panic selling, distributes automated daily yields without complex staking, and protects capital with 5-year locked liquidity.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-emerald-600 font-semibold block mb-0.5">Frictionless 2% Reflection Yield</strong>
                    Delivering 2% of every DEX buy and sell directly into holder balances with 0 gas cost to claim.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900 font-semibold block mb-0.5">5-Year Liquidity Lock</strong>
                    100% of initial LP securely locked in Unicrypt, PinkLock, and Streamflow smart contracts until 2030–2031.
                  </p>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600">
                    <strong className="text-slate-900 font-semibold block mb-0.5">Zero Locking Restrictions on Assets</strong>
                    Complete freedom to buy, trade, and sell anytime without lockup delays or withdrawal penalties.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Security: 5-Yr Verified Lock</span>
              <span className="text-emerald-600 font-semibold">Audited Smart Contracts</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
