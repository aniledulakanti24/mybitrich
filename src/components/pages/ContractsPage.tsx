import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCode2, ShieldCheck, Copy, Check, ExternalLink, Server, Lock, CheckCircle2, ArrowRight, Zap, Globe2, FileText, Coins, Layers, Hash, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { TOKEN_INFO } from '../../data/tokenData';
import { copyToClipboard } from '../../utils/confetti';
import { Contracts3DShield } from '../3d/Contracts3DShield';

interface ContractsPageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

const sectionAnimation = {
  initial: { opacity: 0, y: 35 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.75, ease: 'easeOut' as const },
};

const TOKEN_PARAMS = [
  { label: 'Network', value: 'BNB Smart Chain (56)', icon: Globe2, tone: 'bg-amber-50 text-amber-600' },
  { label: 'Standard', value: TOKEN_INFO.standard, icon: FileText, tone: 'bg-blue-50 text-blue-700' },
  { label: 'Token', value: `${TOKEN_INFO.name} (${TOKEN_INFO.symbol})`, icon: Coins, tone: 'bg-gold-50 text-gold-600' },
  { label: 'Hard cap', value: '150M MBR (D&S Release)', icon: Layers, tone: 'bg-indigo-50 text-indigo-700' },
  { label: 'Launch type', value: 'Direct Fair Launch · Zero ICO', icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Buy fee', value: '6% (2% Reflection / 2% LP / 2% Mkt)', icon: ArrowDownLeft, tone: 'bg-emerald-50 text-emerald-700' },
  { label: 'Sell fee', value: '6% (2% Reflection / 2% LP / 2% Mkt)', icon: ArrowUpRight, tone: 'bg-rose-50 text-rose-600' },
  { label: 'Lock commitment', value: 'Rolling 5-Year Lock from purchase date', icon: Lock, tone: 'bg-amber-50 text-amber-700' },
];

export const ContractsPage: React.FC<ContractsPageProps> = ({
  onOpenSwapModal,
  onOpenConnectModal,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedRpc, setCopiedRpc] = useState(false);

  const handleCopy = async (key: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const handleCopyRpc = async () => {
    const rpcText = `Network: BNB Smart Chain Mainnet\nRPC URL: ${TOKEN_INFO.rpcUrl}\nChain ID: 56\nSymbol: BNB\nDecimals: 18\nContract: ${TOKEN_INFO.contractAddress}`;
    const success = await copyToClipboard(rpcText);
    if (success) {
      setCopiedRpc(true);
      setTimeout(() => setCopiedRpc(false), 2500);
    }
  };

  const contractList = [
    {
      key: 'token',
      label: 'MBR Token Contract',
      address: TOKEN_INFO.contractAddress,
      subtext: 'BEP-20 · 18 decimals · 150,000,000 MBR total supply',
      explorer: `https://bscscan.com/token/${TOKEN_INFO.contractAddress}`,
    },
    {
      key: 'swap',
      label: 'MBR_SWAP Proxy Contract',
      address: TOKEN_INFO.swapProxyAddress,
      subtext: 'Swap proxy used by the MyBitRich console for MBR trades',
      explorer: `https://bscscan.com/address/${TOKEN_INFO.swapProxyAddress}`,
    },
    {
      key: 'pancake',
      label: 'Router (PancakeSwap)',
      address: TOKEN_INFO.pancakeRouter,
      subtext: 'PancakeSwap router on BNB Smart Chain',
      explorer: `https://bscscan.com/address/${TOKEN_INFO.pancakeRouter}`,
    },
    {
      key: 'usdt',
      label: 'Binance-Peg BSC USDT',
      address: TOKEN_INFO.usdtAddress,
      subtext: 'Quote asset for the MBR / USDT price',
      explorer: `https://bscscan.com/token/${TOKEN_INFO.usdtAddress}`,
    },
  ];

  return (
    <div className="pt-32 pb-12 sm:pt-40 sm:pb-20 relative overflow-hidden section-hero text-slate-800">
      {/* Ambient Depth Glows */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[500px] bg-emerald-500/[0.08] rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[600px] h-[500px] bg-[#0071E3]/[0.08] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* HERO SECTION: Split Layout with 3D Shield */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-xs font-mono font-semibold text-emerald-600 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              ON-CHAIN · CONTRACT INFORMATION
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display text-slate-900 tracking-tight leading-[1.1]">
              Contract information on <span className="text-gradient-cyan">BNB Smart Chain</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              Public addresses for the MBR token and its swap infrastructure. MBR is a BEP-20 token with a fixed 150,000,000 supply and a 6% buy / 6% sell fee, and 100% of the initial liquidity is locked for 5 years. Trading and claims live in the console.
            </p>

            {/* Security Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <div className="text-xs font-mono text-emerald-600 uppercase font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  5-Year Liquidity Lock
                </div>
                <div className="text-sm font-bold text-slate-900">Locked until 2030–31</div>
                <div className="text-xs text-slate-500">Lockers: Unicrypt, PinkLock, Streamflow.</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1">
                <div className="text-xs font-mono text-blue-600 uppercase font-semibold flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5" />
                  BNB Smart Chain (BEP-20)
                </div>
                <div className="text-sm font-bold text-slate-900">Chain ID: 56 · Standard</div>
                <div className="text-xs text-slate-500">Add MBR to any BNB Smart Chain wallet with the token address below.</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={TOKEN_INFO.bscScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm text-black"
              >
                <span>View on BscScan</span>
                <ExternalLink className="w-4 h-4 text-black" />
              </a>

              <button
                onClick={handleCopyRpc}
                className="btn-glass px-7 py-3.5 text-xs font-semibold text-slate-900 hover:border-gold-400/60"
              >
                <span>{copiedRpc ? '✓ RPC Parameters Copied' : 'Copy Network RPC'}</span>
              </button>
            </div>
          </div>

          {/* Right: Interactive 3D Cryptographic Hex-Shield */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[480px] relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-sky-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
              <Contracts3DShield className="relative z-10" />
            </div>
            <div className="text-center mt-3 text-xs font-mono text-slate-500">
              Interactive 3D vault · 5-year liquidity lock
            </div>
          </div>

        </div>

        {/* TOKEN PARAMETERS (mirrors the official contract page) */}
        <motion.div {...sectionAnimation} className="luxe-card overflow-hidden p-0">
          <div className="relative flex flex-col gap-3 overflow-hidden border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-gold-50 via-white to-blue-50/70" />
            <div className="relative flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#17306A] to-[#0F2349] text-amber-300 shadow-md">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <div className="font-display text-base font-bold text-slate-900">Token parameters</div>
                <div className="text-xs text-slate-500">
                  RPC <span className="font-code text-slate-600">{TOKEN_INFO.rpcUrl}</span>
                </div>
              </div>
            </div>
            <div className="relative flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" /> Trading live
              </span>
              <a
                href={TOKEN_INFO.bscScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-semibold text-blue-700 transition-colors hover:border-blue-300"
              >
                BscScan <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-slate-200/70 sm:grid-cols-4">
            {TOKEN_PARAMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  className="group relative flex items-start gap-3 bg-white px-5 py-5 transition-colors hover:bg-slate-50/80"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${item.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{item.label}</dt>
                    <dd className="mt-0.5 truncate font-display text-base font-bold text-slate-900">{item.value}</dd>
                  </div>
                  <button
                    onClick={() => handleCopy(`param-${item.label}`, item.value)}
                    className="absolute right-3 top-3 rounded-md p-1 text-slate-300 opacity-0 transition-all hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
                    title={`Copy ${item.label}`}
                    aria-label={`Copy ${item.label}`}
                  >
                    {copiedKey === `param-${item.label}` ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </motion.div>
              );
            })}
          </dl>
        </motion.div>

        {/* VERIFIED CONTRACTS GRID */}
        <motion.div {...sectionAnimation} className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 text-xs font-mono uppercase font-semibold">
              <FileCode2 className="w-3.5 h-3.5" />
              ON-CHAIN TRANSPARENCY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900">
              Contract addresses
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Public addresses — copy any of them or open it on BscScan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contractList.map((item) => (
              <div
                key={item.key}
                className="luxe-card p-7 rounded-3xl border border-slate-200 hover:border-gold-400/60 flex flex-col justify-between space-y-5 transition-all duration-300 shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">{item.label}</span>
                    <a
                      href={item.explorer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-500 flex items-center gap-1 transition-colors"
                    >
                      <span>Explorer</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-1">{item.subtext}</div>
                </div>

                <div className="flex items-center justify-between gap-2 p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs font-code text-gold-600 truncate max-w-[280px]">
                    {item.address}
                  </span>

                  <button
                    onClick={() => handleCopy(item.key, item.address)}
                    className="flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-100 text-slate-800 hover:text-slate-900 border border-slate-200 hover:border-gold-400/60 transition-all active:scale-95 shrink-0 shadow-sm"
                  >
                    {copiedKey === item.key ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-gold-600" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 5-YEAR LOCK VERIFICATION PROOF */}
        <motion.div {...sectionAnimation} className="luxe-card p-8 sm:p-10 rounded-3xl border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                5-year LP lock · until 2030–31
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                100% of initial LP tokens are locked for 5 years — rug-pull protection and long-term price stability.
              </p>
            </div>
            <div className="text-xs font-mono px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 font-semibold self-start sm:self-auto">
              100% of initial LP
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-mono text-xs font-bold">
                <span>🛡️</span> PinkLock Locker
              </div>
              <div className="text-xs text-slate-600">
                Token and LP locker widely used on BNB Smart Chain.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-slate-600 font-mono text-xs font-bold">
                <span>🔒</span> Unicrypt
              </div>
              <div className="text-xs text-slate-600">
                Liquidity locker on BNB Smart Chain.
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-blue-600 font-mono text-xs font-bold">
                <span>🌊</span> Streamflow
              </div>
              <div className="text-xs text-slate-600">
                Time-based lock and vesting platform for the remaining LP tokens.
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
