import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  Compass, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Award, 
  Globe, 
  Layers, 
  Lock, 
  Cpu, 
  Database, 
  TrendingUp, 
  BarChart3, 
  Activity, 
  Check, 
  ChevronRight,
  Coins
} from 'lucide-react';
import { FeeExplainer3D } from '../FeeExplainer3D';
import { TOKEN_INFO } from '../../data/tokenData';
import { Disclaimer } from '../ui/Disclaimer';

interface VisionMissionPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

type VisionTab = 'scarcity' | 'reflection' | 'citadel' | 'sovereign';

const PILLAR_TABS: { id: VisionTab; numeral: string; label: string; icon: React.ElementType }[] = [
  { id: 'scarcity', numeral: 'I', label: 'Fixed supply', icon: Target },
  { id: 'reflection', numeral: 'II', label: 'Holder rewards', icon: Coins },
  { id: 'citadel', numeral: 'III', label: '5-yr LP lock', icon: Lock },
  { id: 'sovereign', numeral: 'IV', label: 'Layer-1 & RWA', icon: Globe },
];

interface ValuationScenario {
  id: string;
  phase: string;
  year: string;
  price: string;
  rawPrice: number;
  marketCap: string;
  status: string;
  headline: string;
  description: string;
  scarcityRatio: string;
  catalysts: string[];
}

const VALUATION_SCENARIOS: ValuationScenario[] = [
  {
    id: 'launch',
    phase: 'Phase 1',
    year: '2025 – 2026',
    price: '$0.00248',
    rawPrice: 0.00248,
    marketCap: 'Current price · trading is live',
    status: 'In progress',
    headline: 'Token Launch & Liquidity Foundation',
    description: 'MBR launches on BNB Smart Chain with a 6% buy / 6% sell tax and a 3-tier buy referral, and 100% of the initial liquidity is locked for 5 years.',
    scarcityRatio: '150M total supply',
    catalysts: [
      'Deploy smart contract with 6% buy/sell tax and 3-tier buy referral module.',
      'Execute 5-year liquidity lock (100% initial LP locked until 2030–2031).',
      'Launch web dApp and complete third-party smart contract audits.',
      'Submit CoinGecko / CoinMarketCap listings.',
      'Grow community through referral competitions and X/Telegram marketing.',
    ],
  },
  {
    id: 'cex',
    phase: 'Phase 2',
    year: '2027 – 2028',
    price: 'Utility',
    rawPrice: 0,
    marketCap: 'Staking ecosystem',
    status: 'Upcoming',
    headline: 'Utility Integration & Staking Ecosystem',
    description: 'Native staking, zero-tax P2P trading and cross-chain bridges add everyday utility, while transaction taxes are lowered as organic volume grows.',
    scarcityRatio: 'Staking & bridges',
    catalysts: [
      'Launch native dApp staking with boosted yield pools.',
      'Integrate zero-tax P2P trading and automated reward analytics.',
      'Add cross-chain bridge support across major EVM chains and Solana.',
      'Gradually lower transaction taxes as organic volume grows.',
    ],
  },
  {
    id: 'layer1',
    phase: 'Phase 3',
    year: '2029 – 2031',
    price: 'Expansion',
    rawPrice: 0,
    marketCap: 'DeFi, RWA & DAO',
    status: 'Planned',
    headline: 'Ecosystem Expansion & RWA Integration',
    description: 'DeFi lending and borrowing, payment-processor partnerships for e-commerce, longer liquidity locks and a move to fully decentralized DAO governance.',
    scarcityRatio: 'DeFi & payments',
    catalysts: [
      'Review and extend 5-year liquidity locks for additional multi-year terms.',
      'Introduce DeFi lending and borrowing utility.',
      'Partner with payment processors for global e-commerce token payments.',
      'Transition governance to a fully decentralized DAO.',
    ],
  },
  {
    id: 'horizon',
    phase: 'Phase 4',
    year: '2032 – 2035',
    price: '$2,000.00',
    rawPrice: 2000,
    marketCap: '$300B market cap target',
    status: 'Target 2035',
    headline: 'Sovereign Blockchain & Ecosystem Maturity',
    description: 'MBR migrates from a token to a native coin on its own high-speed Layer-1 / Layer-2, targets Tier-1 exchange listings, and works toward the long-term goal of $2,000 per token.',
    scarcityRatio: '$300B implied cap',
    catalysts: [
      'Migration from token to native coin on a proprietary high-speed Layer-1 / Layer-2.',
      'Target Tier-1 CEX listings (Binance, Coinbase, OKX).',
      'Expand institutional liquidity and enterprise adoption.',
      'Long-term valuation growth toward $2,000 USD per token ($300B market cap).',
    ],
  },
];

export const VisionMissionPage: React.FC<VisionMissionPageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
}) => {
  const [activeTab, setActiveTab] = useState<VisionTab>('scarcity');
  const [selectedScenario, setSelectedScenario] = useState<ValuationScenario>(VALUATION_SCENARIOS[3]);

  return (
    <div className="pt-32 pb-12 sm:pt-40 sm:pb-20 relative overflow-hidden section-hero text-slate-800">
      
      {/* Dynamic Ambient Depth Lighting */}
      <div className="absolute top-10 left-1/4 w-[750px] h-[550px] bg-amber-400/[0.08] rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[700px] h-[500px] bg-[#0071E3]/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-[650px] h-[450px] bg-emerald-500/[0.06] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* ========================================================================= */}
        {/* 1. HERO ARENA: Split Layout with Advanced 3D Vision Orb & Global Flows */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Mission Thesis */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono font-semibold text-gold-600 uppercase tracking-widest shadow-sm">
              <Compass className="w-3.5 h-3.5 text-gold-600" />
              ADVANCED STRATEGIC BLUEPRINT · 2025 – 2035
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.08]">
              The Sovereign Path to <span className="text-gradient-gold">Generational Wealth</span> & The $2,000 Horizon
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              MyBitRich was engineered around a single mathematical reality: <strong className="text-slate-900 font-semibold">fiat currencies inflate by design, while MBR is strictly capped at 150 Million tokens forever.</strong> Pairing a fixed supply with a 2% holder reward on every taxed buy and sell and 100% of initial liquidity locked for 5 years, MBR is built as a ten-year position through 2035.
            </p>

            {/* Live On-Chain Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Hard Cap Supply</div>
                <div className="text-lg font-bold font-mono text-gold-600">150M MBR</div>
                <div className="text-[10px] text-emerald-600 font-medium">15 Cr MBR · fixed</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Liquidity Lock</div>
                <div className="text-lg font-bold font-mono text-emerald-600">5-Year Lock</div>
                <div className="text-[10px] text-slate-500">PinkLock / Unicrypt</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-sm">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Frictionless Yield</div>
                <div className="text-lg font-bold font-mono text-blue-600">2% Reflection</div>
                <div className="text-[10px] text-blue-600">Direct to Wallet</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-gold-300/50 space-y-1 shadow-sm bg-gradient-to-b from-white to-slate-50">
                <div className="text-[10px] font-mono text-gold-600 uppercase tracking-wider font-bold">2035 Horizon</div>
                <div className="text-lg font-extrabold font-mono text-gold-600">$2,000.00</div>
                <div className="text-[10px] text-gold-600 font-medium">$300B Target Cap</div>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={onOpenSwapModal}
                className="btn-gold px-8 py-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 shadow-sm text-black hover:-translate-y-0.5 transition-all"
              >
                <Zap className="w-4 h-4 text-black" />
                <span>Acquire MBR on PancakeSwap</span>
              </button>

              <button
                onClick={onOpenConnectModal}
                className="btn-glass px-8 py-4 text-xs font-semibold text-slate-900 hover:border-gold-400/60 hover:-translate-y-0.5 transition-all"
              >
                <span>Connect Web3 Wallet</span>
              </button>
            </div>

          </div>

          {/* Right Column: 3D explainer of the 6% buy / sell fee */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <FeeExplainer3D />
            </motion.div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 2. ADVANCED INTERACTIVE STRATEGIC PILLARS TERMINAL (4 ADVANCED MODES) */}
        {/* ========================================================================= */}
        <motion.div {...sectionAnimation} className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 uppercase tracking-widest font-semibold">
              <Cpu className="w-3.5 h-3.5 text-gold-600" />
              HOW MBR WORKS
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
              Four Pillars of <span className="text-gradient-gold">Perpetual Wealth</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              The four mechanisms behind MyBitRich, from supply and fees to liquidity and the long-term roadmap.
            </p>
          </div>

          {/* Tab selector — single-line segmented control with a sliding highlight */}
          <div className="flex justify-center">
            <div className="max-w-full overflow-x-auto rounded-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1.5 shadow-sm backdrop-blur">
                {PILLAR_TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5 ${
                        active ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="pillar-tab"
                          className="absolute inset-0 rounded-full bg-gradient-to-b from-[#17306A] to-[#0F2349] shadow-[0_8px_20px_-8px_rgba(15,35,73,0.6)]"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className={`relative text-[11px] font-bold ${active ? 'text-amber-300' : 'text-slate-400'}`}>{tab.numeral}</span>
                      <Icon className="relative h-4 w-4" />
                      <span className="relative">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Dynamic Tab Body */}
          <div className="luxe-card p-8 sm:p-12 rounded-3xl border border-slate-200 bg-white/90 shadow-2xl relative overflow-hidden">
            <AnimatePresence mode="wait">
              
              {activeTab === 'scarcity' && (
                <motion.div
                  key="scarcity"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-gold-600 uppercase font-bold">
                      <Target className="w-4 h-4 text-gold-600" />
                      PILLAR I: MATHEMATICAL SCARCITY & CURRENCY DEBASEMENT HEDGE
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                      Strictly Capped at 150 Million Tokens. Never Inflated.
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Every fiat currency in modern human history has lost more than 95% of its purchasing power due to unconstrained central bank printing. Meme cryptocurrencies routinely mint hundreds of trillions or quadrillions of tokens, diluting holders into oblivion.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      MyBitRich has a fixed total supply of <strong className="text-gold-600 font-mono">150,000,000 MBR</strong> (15 Cr). With supply capped, growth in demand is designed to support the long-term target of $2,000 per token by 2035.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Fixed Maximum Cap</div>
                        <div className="text-base font-bold font-mono text-gold-600 mt-0.5">150,000,000 MBR</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Mint Privilege</div>
                        <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">Permanently Disabled</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Contract Audit</div>
                        <div className="text-base font-bold font-mono text-blue-600 mt-0.5">Public on BscScan</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gold-300/50 space-y-4 shadow-xl">
                    <div className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider flex items-center justify-between">
                      <span>Comparative Supply Matrix</span>
                      <span className="text-[10px] text-slate-500 font-mono">Real-world Ratios</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-900">MyBitRich (MBR)</div>
                          <div className="text-[10px] font-mono text-gold-600">Strict Cap · Generational Yield</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-gold-600">150,000,000</div>
                          <div className="text-[10px] text-emerald-600 font-mono">100% Capped</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Bitcoin (BTC)</div>
                          <div className="text-[10px] font-mono text-slate-500">Digital Gold Benchmark</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-600">21,000,000</div>
                          <div className="text-[10px] text-slate-500 font-mono">0% Yield</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Dogecoin (DOGE)</div>
                          <div className="text-[10px] font-mono text-slate-500">Inflationary Meme Coin</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-rose-600">146,000,000,000+</div>
                          <div className="text-[10px] text-rose-600 font-mono">+5B Mined / Year</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 text-center pt-2">
                      ✦ MBR is 973× scarcer than Dogecoin, with built-in 2% holder reflections.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'reflection' && (
                <motion.div
                  key="reflection"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-600 uppercase font-bold">
                      <Coins className="w-4 h-4 text-emerald-600" />
                      PILLAR II: AUTOMATED 2% REFLECTION YIELD & NON-CUSTODIAL COMPOUNDING
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                      Your Wallet Balance Grows Every Block Without Staking
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Traditional staking protocols force you to hand over custody of your tokens, lock your capital for months, and pay exorbitant gas fees to claim rewards. If the staking validator gets hacked, your principal is destroyed.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      MyBitRich completely eliminates third-party risk. <strong className="text-emerald-600">2% of every taxed buy and sell</strong> is autonomously distributed on-chain directly to all existing holders in proportion to their balance. You retain 100% private-key non-custodial custody of your funds 24/7.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Estimated APR</div>
                        <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">~16.4% APY</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Custodial Risk</div>
                        <div className="text-base font-bold font-mono text-slate-900 mt-0.5">0% (Self-Custody)</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Claim Gas Fees</div>
                        <div className="text-base font-bold font-mono text-blue-600 mt-0.5">Zero (Automated)</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-emerald-400/25 space-y-4 shadow-xl">
                    <div className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                      Frictionless Yield Cycle
                    </div>
                    <div className="space-y-2.5 text-xs text-slate-600">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">1. Trade Occurs on DEX:</strong> A buyer or seller executes an MBR trade on PancakeSwap.
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">2. Smart Contract Routes 2%:</strong> The MBR BEP-20 contract intercepts the 2% fee instantaneously.
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900">3. Direct Balance Update:</strong> Tokens materialize in your Trust Wallet, MetaMask, or Binance Web3 wallet automatically.
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 text-center pt-1">
                      ✦ You earn while you sleep, without paying a single wei of gas.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'citadel' && (
                <motion.div
                  key="citadel"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-blue-600 uppercase font-bold">
                      <ShieldCheck className="w-4 h-4 text-blue-600" />
                      PILLAR III: CRYPTOGRAPHIC 5-YEAR MULTI-VAULT LIQUIDITY CITADEL
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                      100% Initial Liquidity Locked Until 2030–2031
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Sudden liquidity removal is one of the biggest risks in crypto. MyBitRich locks 100% of its initial LP tokens for 5 years to protect against rug-pulls.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      100% of our PancakeSwap LP tokens are verifiably locked for 5 full years across multiple decentralized lockers including PinkLock, Unicrypt, and Streamflow. No team member, developer, or whale has the ability to withdraw liquidity. You trade with complete institutional peace of mind.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Lock Duration</div>
                        <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">5 Full Years</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Locker Protocol</div>
                        <div className="text-base font-bold font-mono text-blue-600 mt-0.5">PinkLock & Unicrypt</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Withdrawal Penalty</div>
                        <div className="text-base font-bold font-mono text-slate-900 mt-0.5">0% (Sell Anytime)</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-blue-400/25 space-y-4 shadow-xl">
                    <div className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                      Triple Multi-Locker Redundancy
                    </div>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🛡️</span>
                          <span className="font-semibold text-slate-900">PinkLock Smart Locker</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Locked</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🔒</span>
                          <span className="font-semibold text-slate-900">Unicrypt Liquidity Vault</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Secured 2030</span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🌊</span>
                          <span className="font-semibold text-slate-900">Streamflow Time-Locker</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Non-Revocable</span>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 text-center pt-1">
                      ✦ 100% of initial LP locked until 2030–31 via smart-contract lockers.
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'sovereign' && (
                <motion.div
                  key="sovereign"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                >
                  <div className="lg:col-span-7 space-y-5">
                    <div className="inline-flex items-center gap-2 text-xs font-mono text-gold-600 uppercase font-bold">
                      <Globe className="w-4 h-4 text-gold-600" />
                      PILLAR IV: SOVEREIGN LAYER-1 MIGRATION & REAL-WORLD ASSET (RWA) TREASURY
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                      From BEP-20 Smart Contract to Sovereign Financial State
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      While our genesis begins on BNB Smart Chain for global liquidity access and sub-cent gas fees, our ultimate destiny is sovereign financial autonomy.
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      By Phase 3 (2029–2032), the protocol will migrate to an independent sovereign Layer-1 or Layer-2 network with zero-gas microtransactions, institutional validator nodes, and a tokenized Real-World Asset (RWA) reserve backing protocol treasury value with US Treasuries, commercial paper, and high-yield physical collateral.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Target Network</div>
                        <div className="text-base font-bold font-mono text-gold-600 mt-0.5">Sovereign L1 / L2</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Treasury Backing</div>
                        <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">Tokenized RWAs</div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-mono text-slate-500 uppercase">Valuation Horizon</div>
                        <div className="text-base font-bold font-mono text-blue-600 mt-0.5">$300B Milestone</div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-gold-300/50 space-y-4 shadow-xl">
                    <div className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider">
                      The Sovereign Horizon Architecture
                    </div>
                    <div className="space-y-3 text-xs text-slate-600">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-gold-600" />
                          Sub-Zero Gas Finality
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Microtransactions settled with sub-second deterministic finality, allowing instantaneous high-frequency commerce.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <Database className="w-3.5 h-3.5 text-emerald-600" />
                          Institutional Collateral Floor
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          The 2% marketing & treasury fee funds exchange listings, global partnerships, smart contract audits, and platform development.
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 text-center pt-1">
                      ✦ A decade-long architectural trajectory to a sovereign digital economy.
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </motion.div>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE 2025 – 2035 VALUATION SCENARIO TERMINAL */}
        {/* ========================================================================= */}
        <motion.div {...sectionAnimation} className="space-y-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-50 border border-gold-300/50 text-xs font-mono text-gold-600 uppercase tracking-widest font-semibold">
              <Award className="w-3.5 h-3.5 text-gold-600" />
              THE ROAD TO $2,000 / MBR
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display text-slate-900 tracking-tight">
              Explore the four phases (2025 – 2035)
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select a phase to see its goals and key milestones from the official roadmap.
            </p>
          </div>

          {/* 4 Interactive Phase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUATION_SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`p-6 rounded-3xl text-left border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-gradient-to-b from-white to-gold-50 border-gold-400 shadow-sm scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                        {sc.year}
                      </span>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                        sc.id === 'launch'
                          ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                          : sc.id === 'horizon'
                          ? 'bg-gold-100 text-gold-600 border border-gold-400/60'
                          : 'bg-slate-50 text-slate-600 border border-slate-200'
                      }`}>
                        {sc.status}
                      </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                      {sc.price}
                    </div>

                    <div className="text-xs font-mono text-gold-600 font-semibold">
                      {sc.marketCap}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs font-mono">
                    <span className={isSelected ? 'text-gold-600 font-bold' : 'text-slate-500'}>
                      {isSelected ? '✓ Selected Milestone' : 'Inspect Details'}
                    </span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-gold-600' : 'text-slate-500'}`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Deep-Dive Podium for the Selected Milestone */}
          <div className="luxe-card p-8 sm:p-10 rounded-3xl border border-gold-300/50 bg-gradient-to-r from-white via-slate-50 to-slate-50 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div>
                <div className="text-xs font-mono text-gold-600 uppercase tracking-widest font-bold">
                  {selectedScenario.phase} · {selectedScenario.year}
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 mt-1">
                  {selectedScenario.headline}
                </h3>
              </div>

              <div className="text-left md:text-right shrink-0 bg-white px-6 py-3 rounded-2xl border border-gold-300/50">
                <div className="text-2xl sm:text-3xl font-mono font-extrabold text-gold-600">
                  {selectedScenario.price}
                </div>
                <div className="text-[11px] font-mono text-slate-500">
                  {selectedScenario.marketCap}
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {selectedScenario.description}
            </p>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono uppercase tracking-wider text-gold-600 font-bold">
                Key milestones
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedScenario.catalysts.map((cat, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
                    <span>{cat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div className="text-xs font-mono text-slate-500">
                Mathematical Assumption: <span className="text-gold-600 font-semibold">150,000,000 Fixed Token Cap</span>
              </div>
              <button
                onClick={onOpenSwapModal}
                className="btn-gold px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-black shadow-md shadow-slate-900/10"
              >
                Acquire Tokens at Launch Valuation
              </button>
            </div>
          </div>

        </motion.div>

        {/* ========================================================================= */}
        {/* 4. FOUNDATIONAL PROTOCOL MOTTO & BILLIONAIRE PLEDGE */}
        {/* ========================================================================= */}
        <motion.div {...sectionAnimation} className="luxe-card p-8 sm:p-14 rounded-3xl border border-gold-400/60 bg-gradient-to-b from-white to-slate-50 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-400/[0.08] rounded-full blur-[140px] pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-100 border border-gold-300/50 text-gold-600 text-xs font-mono uppercase tracking-widest font-bold">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              THE FOUNDATIONAL MOTTO
            </div>

            <blockquote className="text-2xl sm:text-4xl lg:text-5xl font-black font-display text-slate-900 tracking-tight leading-tight">
              “Buy and hold, you will be a <span className="text-gradient-gold">billionaire one day</span>.”
            </blockquote>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Wealth is not created through panic-selling or chasing artificial volatility. It is accumulated by identifying mathematically scarce sovereign assets, locking in foundational liquidity, and holding with unwavering decennial conviction.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenSwapModal}
                className="btn-gold px-9 py-4 text-xs font-extrabold uppercase tracking-wider text-black shadow-xl shadow-slate-900/10 hover:-translate-y-0.5 transition-all"
              >
                Join the Decennial Movement
              </button>

              <a
                href={TOKEN_INFO.bscScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glass px-8 py-4 text-xs font-semibold text-slate-900 hover:border-gold-400/60 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Verify Smart Contract on BscScan</span>
                <ChevronRight className="w-3.5 h-3.5 text-gold-600" />
              </a>
            </div>
          </div>
        </motion.div>


        <Disclaimer topic="target" className="mx-auto max-w-4xl" />
      </div>
    </div>
  );
};
