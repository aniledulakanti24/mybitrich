import React, { useState } from 'react';
import { 
  Download, 
  Check, 
  Copy, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Zap 
} from 'lucide-react';
import { TOKEN_INFO } from '../data/tokenData';
import { copyToClipboard } from '../utils/confetti';

interface GettingStartedProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
}

export const GettingStarted: React.FC<GettingStartedProps> = ({ onOpenSwapModal, onOpenConnectModal }) => {
  const [copiedContract, setCopiedContract] = useState(false);
  const [copiedRpc, setCopiedRpc] = useState(false);

  const handleCopyContract = async () => {
    const success = await copyToClipboard(TOKEN_INFO.contractAddress);
    if (success) {
      setCopiedContract(true);
      setTimeout(() => setCopiedContract(false), 2500);
    }
  };

  const handleCopyRpc = async () => {
    const rpcText = `Network: BNB Smart Chain Mainnet\nRPC URL: https://bsc-dataseed.binance.org\nChain ID: 56\nSymbol: BNB\nDecimals: 18\nContract: ${TOKEN_INFO.contractAddress}`;
    const success = await copyToClipboard(rpcText);
    if (success) {
      setCopiedRpc(true);
      setTimeout(() => setCopiedRpc(false), 2500);
    }
  };

  const wallets = [
    { name: 'MetaMask', desc: 'Browser & Mobile', icon: '🦊', url: 'https://metamask.io/download/' },
    { name: 'Trust Wallet', desc: 'Official Binance Mobile Wallet', icon: '🛡️', url: 'https://trustwallet.com/download' },
    { name: 'Binance Web3', desc: 'Integrated Exchange dApp Wallet', icon: '🟡', url: 'https://www.binance.com/en/web3wallet' },
    { name: 'Rabby Wallet', desc: 'Multi-chain Security & Simulation', icon: '🐰', url: 'https://rabby.io/' },
  ];

  return (
    <section id="getting-started" className="py-24 relative overflow-hidden section-ice border-t border-slate-200">
      {/* Subtle Ambient Depth Glows */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[500px] bg-[#0071E3]/[0.08] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-[#F5C042]/[0.06] rounded-full blur-[150px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0071E3]/15 border border-[#0071E3]/35 text-xs font-mono font-semibold text-blue-600 uppercase tracking-widest shadow-[0_0_15px_rgba(0,113,227,0.15)]">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            ONBOARDING GUIDE
          </div>

          <h2 className="text-3xl sm:text-5xl font-bold font-display text-slate-900 tracking-tight">
            Getting Started in <span className="text-gradient-gold">3 Steps</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed">
            Follow our clean walkthrough to set up your wallet, configure the BNB Smart Chain network, and start accumulating MBR tokens.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* STEP 01 */}
          <div className="luxe-card p-8 flex flex-col justify-between relative group hover:border-gold-400/60 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-extrabold font-mono text-slate-300 group-hover:text-gold-600 transition-colors">
                  01
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                  Choose your wallet
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                Choose your wallet
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                A wallet is necessary for people wanting to use, trade, or hold <strong className="text-gold-600">MyBitRich</strong>. You can pick any secure Web3 wallet compatible with BNB Smart Chain.
              </p>

              {/* Wallet Options */}
              <div className="space-y-2.5">
                {wallets.map((w) => (
                  <a
                    key={w.name}
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white hover:bg-[#101A2F] border border-slate-200 hover:border-gold-400/60 transition-all group/item shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{w.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 group-hover/item:text-amber-300 transition-colors">
                          {w.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {w.desc}
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-slate-500 group-hover/item:text-amber-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Step 1 of 3</span>
              <button
                onClick={onOpenConnectModal}
                className="text-xs font-semibold text-gold-600 hover:text-gold-600 flex items-center gap-1 transition-colors"
              >
                Connect Wallet Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* STEP 02 */}
          <div className="luxe-card p-8 flex flex-col justify-between relative group hover:border-[#0071E3]/50 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-extrabold font-mono text-slate-300 group-hover:text-blue-600 transition-colors">
                  02
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                  Configure your wallet
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                Configure your wallet
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                After downloading, configure your wallet to connect to <strong className="text-slate-900">BNB Smart Chain Mainnet</strong> and import the verified MBR smart contract.
              </p>

              {/* RPC Details Box */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs font-mono shadow-sm">
                <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
                  <span>Network:</span>
                  <span className="text-slate-900 font-bold">BNB Smart Chain</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
                  <span>Chain ID:</span>
                  <span className="text-slate-900 font-bold">56</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 pb-1 border-b border-slate-100">
                  <span>Symbol:</span>
                  <span className="text-slate-900 font-bold">BNB</span>
                </div>
                <div className="flex justify-between items-center text-slate-500">
                  <span>Decimals:</span>
                  <span className="text-slate-900 font-bold">18</span>
                </div>
              </div>

              {/* Token Contract Copy Box */}
              <div className="mt-4 p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="text-[10px] font-code text-slate-500 uppercase tracking-wider">Token Contract (MBR)</div>
                <div className="text-xs font-code text-gold-600 font-semibold truncate select-all">
                  {TOKEN_INFO.contractAddress}
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleCopyContract}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-800 hover:text-slate-900 text-xs font-mono font-semibold border border-slate-200 hover:border-gold-400/60 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    {copiedContract ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gold-600" />}
                    <span>{copiedContract ? 'Copied Contract' : 'Copy Contract'}</span>
                  </button>
                  <button
                    onClick={handleCopyRpc}
                    className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-800 hover:text-slate-900 text-xs font-mono font-semibold border border-slate-200 hover:border-[#0071E3]/50 transition-all shadow-sm"
                    title="Copy full RPC parameters"
                  >
                    {copiedRpc ? '✓ RPC' : 'Copy RPC'}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Step 2 of 3</span>
              <a
                href={TOKEN_INFO.bscScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1 transition-colors"
              >
                Verify on BscScan <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* STEP 03 */}
          <div className="luxe-card p-8 flex flex-col justify-between relative group hover:border-emerald-400/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-4xl font-extrabold font-mono text-slate-300 group-hover:text-emerald-600 transition-colors">
                  03
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-200">
                  Get some MyBitRich
                </span>
              </div>

              <h3 className="text-2xl font-bold font-display text-slate-900 mb-2">
                Get some MyBitRich
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
                There are lots of ways to get your hands on <strong className="text-gold-600">MyBitRich (MBR)</strong>. Swap BNB or USDT directly on PancakeSwap or use our instant swap terminal.
              </p>

              {/* Action Buttons Box */}
              <div className="space-y-3">
                <a
                  href={TOKEN_INFO.pancakeSwapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full py-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Swap on PancakeSwap</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={onOpenSwapModal}
                  className="btn-glass w-full py-3 text-xs font-semibold flex items-center justify-center gap-2 text-slate-900 hover:border-gold-400/60 transition-colors"
                >
                  <Zap className="w-4 h-4 text-gold-600" />
                  <span>Instant Swap Terminal</span>
                </button>
              </div>

              {/* Slippage & Tax Reminder */}
              <div className="mt-5 p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-600 space-y-1 shadow-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Recommended Slippage:</span>
                  <span className="text-slate-900 font-bold">7% – 8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Transaction Tax:</span>
                  <span className="text-emerald-600 font-bold">6% Total (2/2/2)</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500">Step 3 of 3</span>
              <span className="text-xs font-mono font-semibold text-emerald-600">
                Hold & Compounded ➜ 2035
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
