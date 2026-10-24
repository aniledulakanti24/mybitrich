import React, { useState } from 'react';
import { TOKEN_INFO } from '../data/tokenData';
import { copyToClipboard } from '../utils/confetti';
import { ShieldCheck, Copy, Check, ExternalLink, Server, FileCode2 } from 'lucide-react';

export const Contracts: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (key: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const contractList = [
    {
      key: 'token',
      label: 'MBR Token Contract',
      address: TOKEN_INFO.contractAddress,
      subtext: 'Official BEP-20 Smart Contract (18 Decimals · Capped 150M Supply)',
      explorer: `https://bscscan.com/token/${TOKEN_INFO.contractAddress}`,
    },
    {
      key: 'swap',
      label: 'MBR_SWAP Proxy Contract',
      address: TOKEN_INFO.swapProxyAddress,
      subtext: 'Decentralized liquidity routing and swap interface on BNB Chain',
      explorer: `https://bscscan.com/address/${TOKEN_INFO.swapProxyAddress}`,
    },
    {
      key: 'pancake',
      label: 'PancakeSwap V2 / V3 Router',
      address: TOKEN_INFO.pancakeRouter,
      subtext: 'Decentralized automated market maker on BNB Smart Chain',
      explorer: `https://bscscan.com/address/${TOKEN_INFO.pancakeRouter}`,
    },
    {
      key: 'usdt',
      label: 'Binance-Peg BSC USDT',
      address: TOKEN_INFO.usdtAddress,
      subtext: 'BEP-20 Tether USD base quote pair',
      explorer: `https://bscscan.com/token/${TOKEN_INFO.usdtAddress}`,
    },
  ];

  return (
    <section id="contracts" className="py-24 relative overflow-hidden section-ice border-t border-slate-200">
      {/* Subtle Security Ambient Depth Glows */}
      <div className="absolute top-1/2 right-1/4 w-[650px] h-[450px] bg-emerald-500/[0.06] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-[550px] h-[450px] bg-[#0071E3]/[0.07] rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/35 text-xs font-mono font-semibold text-blue-600 uppercase tracking-wider shadow-[0_0_15px_rgba(0,113,227,0.15)]">
            <FileCode2 className="w-3.5 h-3.5 text-blue-600" />
            VERIFIED ON-CHAIN CONTRACTS
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 tracking-tight">
            Smart Contracts & <span className="text-gradient-gold">Architecture</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            All smart contracts are publicly verified on BscScan. Non-custodial, open-source, and secured with 5-year locked liquidity.
          </p>
        </div>

        {/* Network Specs Banner */}
        <div className="luxe-card p-6 rounded-2xl border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gold-50 border border-gold-300/50 flex items-center justify-center text-gold-600 shadow-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">BNB Smart Chain Mainnet</div>
              <div className="text-xs font-mono text-slate-500">Chain ID: 56 · RPC: {TOKEN_INFO.rpcUrl}</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 bg-emerald-500/15 px-4 py-2 rounded-full border border-emerald-500/30 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Audited & Verified BEP-20 Standard</span>
          </div>
        </div>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {contractList.map((item) => (
            <div
              key={item.key}
              className="luxe-card p-6 rounded-2xl border border-slate-200 hover:border-gold-400/60 flex flex-col justify-between space-y-4 transition-all duration-300 shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-slate-900">{item.label}</span>
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

              <div className="flex items-center justify-between gap-2 p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
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

      </div>
    </section>
  );
};
