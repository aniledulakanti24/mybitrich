import React, { useState } from 'react';
import { TOKEN_INFO } from '../data/tokenData';
import { copyToClipboard } from '../utils/confetti';
import { Copy, Check, Send, Globe, Hexagon, Repeat, ShieldCheck, Lock, Waves, Search } from 'lucide-react';
import { DOCUMENTATION_NOTICE, OFFICIAL_DISCLAIMER, RISK_NOTICE } from './ui/Disclaimer';

interface FooterProps {
  onNavigatePage?: (page: string) => void;
}

const PARTNERS = [
  { name: 'BNB Smart Chain', role: 'Network', icon: Hexagon, tone: 'bg-amber-50 text-amber-500' },
  { name: 'PancakeSwap', role: 'DEX router', icon: Repeat, tone: 'bg-cyan-50 text-cyan-600' },
  { name: 'PinkLock', role: 'LP locker', icon: ShieldCheck, tone: 'bg-pink-50 text-pink-500' },
  { name: 'Unicrypt', role: 'LP locker', icon: Lock, tone: 'bg-indigo-50 text-indigo-600' },
  { name: 'Streamflow', role: 'Token lock', icon: Waves, tone: 'bg-blue-50 text-blue-600' },
  { name: 'BscScan', role: 'Explorer', icon: Search, tone: 'bg-slate-100 text-slate-700' },
];

export const Footer: React.FC<FooterProps> = ({ onNavigatePage }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(TOKEN_INFO.contractAddress);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNav = (page: string, e: React.MouseEvent) => {
    if (onNavigatePage) {
      e.preventDefault();
      onNavigatePage(page);
    }
  };

  return (
    <footer className="border-t border-slate-200 section-footer relative overflow-hidden pb-24 text-slate-500 text-xs md:pb-0">
      {/* Infrastructure & lock partners — slow marquee of icon badges */}
      <div className="border-b border-slate-200 bg-white/70 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
            Infrastructure &amp; liquidity lock partners
          </div>
          <div className="mask-fade-x overflow-hidden">
            <div className="flex w-max gap-4 animate-marquee [animation-duration:40s] hover:[animation-play-state:paused]">
              {[...PARTNERS, ...PARTNERS].map((partner, i) => {
                const Icon = partner.icon;
                return (
                  <div
                    key={i}
                    className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${partner.tone} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="leading-tight">
                      <span className="block text-sm font-semibold text-slate-800">{partner.name}</span>
                      <span className="block text-[11px] text-slate-500">{partner.role}</span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column (2 Cols) */}
          <div className="lg:col-span-2 space-y-5">
            <a href="#" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-gold-300/50 flex items-center justify-center p-1.5 shadow-sm">
                <img
                  src="/assets/logo.png"
                  alt="MyBitRich"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xl font-bold font-display tracking-tight text-slate-900">
                My<span className="text-gradient-gold">BitRich</span>
              </span>
            </a>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
              MyBitRich (MBR) on BNB Smart Chain. 150 Million fixed supply, 5-year locked liquidity, and 2% automated reflection yield on every DEX trade.
            </p>

            <div className="text-gold-600 font-mono text-xs font-semibold">
              “Buy and hold, you will be a billionaire one day.”
            </div>

            {/* Socials */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-gold-400/60 hover:text-gold-600 text-slate-600 flex items-center justify-center transition-all shadow-sm"
                title="X (Twitter)"
              >
                <span className="font-bold text-xs">𝕏</span>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-gold-400/60 hover:text-gold-600 text-slate-600 flex items-center justify-center transition-all shadow-sm"
                title="Telegram Group"
              >
                <Send className="w-4 h-4" />
              </a>
              <a
                href={TOKEN_INFO.bscScanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 hover:border-gold-400/60 hover:text-gold-600 text-slate-600 flex items-center justify-center transition-all shadow-sm"
                title="BscScan Explorer"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Protocol Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900">
              Protocol & Vision
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#/vision" onClick={(e) => handleNav('vision', e)} className="text-gold-600 font-semibold hover:text-slate-900 transition-colors">Vision & Mission (2035)</a></li>
              <li><a href="#/tokenomics" onClick={(e) => handleNav('tokenomics', e)} className="text-slate-500 hover:text-gold-600 transition-colors">Tokenomics & 6% Tax</a></li>
              <li><a href="#/roadmap" onClick={(e) => handleNav('roadmap', e)} className="text-slate-500 hover:text-gold-600 transition-colors">Decade Roadmap (2025-2035)</a></li>
              <li><a href="#/calculator" onClick={(e) => handleNav('calculator', e)} className="text-slate-500 hover:text-gold-600 transition-colors">Billionaire Simulator</a></li>
              <li><a href="#/contracts" onClick={(e) => handleNav('contracts', e)} className="text-slate-500 hover:text-gold-600 transition-colors">Contracts & 5-Yr Lock</a></li>
            </ul>
          </div>

          {/* Roadmap & Setup */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-900">
              Trading & Network
            </h4>
            <ul className="space-y-2.5">
              <li><a href="#/home" onClick={(e) => handleNav('home', e)} className="text-slate-500 hover:text-gold-600 transition-colors">Home / Overview</a></li>
              <li><a href={TOKEN_INFO.pancakeSwapUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-gold-600 transition-colors">PancakeSwap V3 Trading</a></li>
              <li><a href={TOKEN_INFO.bscScanUrl} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-gold-600 transition-colors">BscScan Explorer</a></li>
              <li><a href="https://bsc-dataseed.binance.org" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-gold-600 transition-colors">BNB Chain RPC (ID: 56)</a></li>
            </ul>
          </div>

          {/* Smart Contract Quick Box */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 font-mono">
              MBR Smart Contract
            </h4>
            <p className="text-[11px] text-slate-500">
              BEP-20 token on BNB Smart Chain.
            </p>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-md">
              <div className="font-code text-[11px] text-gold-600 break-all select-all font-semibold">
                {TOKEN_INFO.contractAddress}
              </div>
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-mono font-semibold bg-gold-50 hover:bg-gold-100 text-gold-600 border border-gold-300/50 transition-all active:scale-95 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-gold-600" />}
                <span>{copied ? 'Copied Contract!' : 'Copy Contract'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Disclaimer & Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-200 space-y-4">
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-5xl">
            <strong className="text-slate-600">Official Disclaimer:</strong> {DOCUMENTATION_NOTICE} {OFFICIAL_DISCLAIMER} {RISK_NOTICE}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-mono">
            <div>
              © 2025–2026 MyBitRich (MBR). All rights reserved.
            </div>
            <div className="text-gold-600 font-semibold">
              Hold with conviction through 2035
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
