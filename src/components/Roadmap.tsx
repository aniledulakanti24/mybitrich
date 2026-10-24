import React from 'react';
import { ROADMAP_PHASES } from '../data/tokenData';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';

export const Roadmap: React.FC = () => {
  return (
    <section id="roadmap" className="py-24 relative overflow-hidden section-cream border-t border-slate-200">
      {/* Subtle Ambient Depth Glows */}
      <div className="absolute top-1/3 -left-20 w-[600px] h-[500px] bg-[#0071E3]/[0.07] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-amber-400/[0.06] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/35 text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider shadow-[0_0_15px_rgba(0,113,227,0.15)]">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            STRATEGIC PHASES (2025 – 2035)
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            The Decade <span className="text-gradient-gold">Roadmap</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            From our BNB Smart Chain liquidity foundation to a sovereign Layer-1 / Layer-2 blockchain ecosystem and the $2,000 USD valuation milestone ($300B market cap).
          </p>
        </div>

        {/* 4 Phase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROADMAP_PHASES.map((phase, idx) => (
            <div
              key={phase.phase}
              className={`luxe-card p-7 rounded-3xl border flex flex-col justify-between relative transition-all duration-300 ${
                idx === 0
                  ? 'border-gold-400/60 shadow-sm bg-white/90'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                    idx === 0 ? 'text-gold-600' : 'text-slate-500'
                  }`}>
                    Phase {phase.phase}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold uppercase ${
                      idx === 0
                        ? 'bg-gold-100 text-gold-600 border border-gold-300/50'
                        : 'bg-slate-50 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {phase.status}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-500 mb-1">
                  {phase.years}
                </div>

                <h3 className="text-lg font-bold font-display text-slate-900 mb-4">
                  {phase.title}
                </h3>

                {/* Progress bar for Phase 1 */}
                {idx === 0 && (
                  <div className="mb-5 space-y-1.5 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="flex justify-between text-[11px] font-mono text-slate-600">
                      <span>Phase Progress</span>
                      <span className="text-gold-600 font-bold">{phase.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full"
                        style={{ width: `${phase.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Items */}
                <ul className="space-y-2.5 text-xs">
                  {phase.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2">
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                          idx === 0 ? 'text-gold-600' : 'text-slate-500'
                        }`}
                      />
                      <span className={`leading-relaxed ${idx === 0 ? 'text-slate-800' : 'text-slate-500'}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bottom Target Highlight */}
              <div className="pt-5 mt-6 border-t border-slate-200 text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>Phase Target</span>
                {idx === 3 ? (
                  <span className="text-gold-600 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold-600" /> $2,000 / MBR
                  </span>
                ) : (
                  <span className="text-slate-800 font-semibold">{phase.years}</span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
