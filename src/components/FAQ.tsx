import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/tokenData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-24 relative overflow-hidden section-cream border-t border-slate-200">
      {/* Subtle Ambient Depth Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-[#0071E3]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[350px] bg-amber-400/[0.05] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/35 text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider shadow-[0_0_15px_rgba(0,113,227,0.15)]">
            <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
            FREQUENTLY ASKED QUESTIONS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Everything You Need <span className="text-gradient-gold">To Know</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal">
            Clear answers on token economics, liquidity locks, 2% reflection yield, and our journey to the $2,000 target.
          </p>
        </div>

        {/* Accordion list */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`luxe-card rounded-2xl overflow-hidden transition-all duration-300 border ${
                  isOpen
                    ? 'border-gold-400/60 bg-white/95 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className={`text-base sm:text-lg font-bold font-display transition-colors ${
                    isOpen ? 'text-gold-600' : 'text-slate-900'
                  }`}>
                    {item.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-gradient-to-r from-gold-400 to-gold-500 text-white rotate-180 shadow-md shadow-slate-900/10'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed font-sans border-t border-slate-200 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
