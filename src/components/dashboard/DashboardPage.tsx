import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { TOKEN_INFO } from '../../data/tokenData';
import { copyToClipboard, triggerBillionaireConfetti } from '../../utils/confetti';
import { 
  Wallet, 
  TrendingUp, 
  Coins, 
  Users, 
  ArrowDownUp, 
  Copy, 
  Check, 
  LogOut, 
  Globe, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  PieChart,
  DollarSign,
  QrCode,
  Award
} from 'lucide-react';
import { OFFICIAL_DISCLAIMER } from '../ui/Disclaimer';

interface DashboardPageProps {
  onNavigateHome: () => void;
  onOpenConnectModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ 
  onNavigateHome,
  onOpenConnectModal,
}) => {
  const { user, logout, updateBalance, activities, addActivity } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'swap' | 'yield' | 'activity'>('overview');
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Swap State
  const [swapBnb, setSwapBnb] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);

  if (!user) return null;

  const mbrPriceUsd = 0.00248;
  const portfolioUsd = user.mbrBalance * mbrPriceUsd;
  const bnbUsd = user.bnbBalance * 594.30;
  const totalNetWorthUsd = portfolioUsd + bnbUsd;
  const milestone2035TargetUsd = user.mbrBalance * 2000;

  const referralLink = `https://mybitrich.com/?ref=${user.referralCode}`;

  const handleCopyRef = async () => {
    const success = await copyToClipboard(referralLink);
    if (success) {
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2500);
    }
  };

  const handleCopyWallet = async () => {
    const success = await copyToClipboard(user.walletAddress);
    if (success) {
      setCopiedWallet(true);
      setTimeout(() => setCopiedWallet(false), 2500);
    }
  };

  const handleExecuteSwap = () => {
    const numBnb = parseFloat(swapBnb) || 0;
    if (numBnb <= 0 || numBnb > user.bnbBalance) return;

    setIsSwapping(true);
    setSwapSuccess(false);

    setTimeout(() => {
      const rate = 239637;
      const rawMbr = numBnb * rate;
      const receivedMbr = rawMbr * 0.94; // 6% tax

      updateBalance(receivedMbr, -numBnb);
      addActivity({
        type: 'swap',
        title: `PancakeSwap Purchase (${numBnb} BNB)`,
        amount: `+${Math.round(receivedMbr).toLocaleString()} MBR`,
        amountUsd: `+$${(numBnb * 594.30).toFixed(2)}`,
        txHash: `0x${Math.floor(Math.random() * 0xffffff).toString(16)}...${Math.floor(Math.random() * 0xffff).toString(16)}`,
      });

      setIsSwapping(false);
      setSwapSuccess(true);
      triggerBillionaireConfetti();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-800 flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* Background Multi-Color Ambient Glows */}
      <div className="fixed top-0 left-10 w-[600px] h-[600px] bg-[#0071E3]/[0.08] rounded-full blur-[160px] pointer-events-none -z-0" />
      <div className="fixed top-20 right-10 w-[650px] h-[650px] bg-[#F5C042]/[0.07] rounded-full blur-[170px] pointer-events-none -z-0" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-slate-50/90 backdrop-blur-xl shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[70px] flex items-center justify-between">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 group"
              title="Return to Public Website"
            >
              <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-50 border border-gold-300/50 flex items-center justify-center p-1.5 group-hover:border-amber-400 transition-colors shadow-sm">
                <img src="/assets/logo.png" alt="MBR" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-slate-900 font-display">
                    My<span className="text-gradient-gold">BitRich</span>
                  </span>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-full bg-gold-50 text-gold-600 border border-gold-300/50">
                    PORTAL
                  </span>
                </div>
              </div>
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span>BNB Smart Chain (56)</span>
            </div>
          </div>

          {/* Right User Bar: Connect Wallet, Exchange & User controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live MBR Ticker */}
            <div className="hidden xl:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-mono shadow-sm">
              <span className="text-slate-500">MBR:</span>
              <span className="text-slate-900 font-bold">$0.00248</span>
              <span className="text-emerald-600 font-bold">+18.4%</span>
            </div>

            {/* EXCHANGE Button in Dashboard */}
            <button
              onClick={() => setActiveTab('swap')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold transition-all shadow-sm ${
                activeTab === 'swap'
                  ? 'btn-gold text-black shadow-slate-900/10'
                  : 'bg-gold-50 hover:bg-gold-100 border border-gold-300/50 text-gold-600'
              }`}
              title="Open DEX Exchange & Swap"
            >
              <ArrowDownUp className="w-3.5 h-3.5 text-gold-600" />
              <span>Exchange</span>
            </button>

            {/* CONNECT WALLET Button in Dashboard */}
            {onOpenConnectModal ? (
              <button
                onClick={onOpenConnectModal}
                className="btn-gold flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold text-black uppercase tracking-wider transition-all shadow-sm shadow-slate-900/10 active:scale-95"
                title="Connect or Switch Web3 Wallet"
              >
                <Wallet className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Wallet</span>
              </button>
            ) : (
              <button
                onClick={handleCopyWallet}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono text-slate-800 transition-colors shadow-sm"
                title="Click to copy wallet address"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="text-slate-900 font-semibold">
                  {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                </span>
                {copiedWallet ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            )}

            {/* External PancakeSwap Exchange Icon */}
            <a
              href={TOKEN_INFO.pancakeSwapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 hover:text-gold-600 transition-colors shadow-sm"
              title="Trade on PancakeSwap V3"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Back to Site Button */}
            <button
              onClick={onNavigateHome}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
            >
              <Globe className="w-3.5 h-3.5 text-gold-600" />
              <span>Public Site</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="p-2 rounded-xl bg-slate-50 hover:bg-rose-500/20 border border-slate-200 hover:border-rose-500/30 text-slate-500 hover:text-rose-600 transition-colors shadow-sm"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Dashboard Sub-Nav Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto gap-2 py-2 border-t border-slate-200 bg-slate-50/95 no-scrollbar">
          {[
            { id: 'overview', label: 'Portfolio Overview', icon: PieChart },
            { id: 'referrals', label: '3-Tier Referrals', icon: Users },
            { id: 'swap', label: 'DEX Exchange & Swap', icon: ArrowDownUp },
            { id: 'yield', label: 'Reflection Yield', icon: Sparkles },
            { id: 'activity', label: 'Transaction History', icon: RefreshCw },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'btn-gold shadow-md text-black'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-black' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* ==================== TAB 1: OVERVIEW ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Live Passive Yield Alert Banner */}
            <div className="luxe-card p-4 sm:p-5 rounded-2xl border border-gold-300/50 bg-gold-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-gold-100 border border-gold-400/60 flex items-center justify-center text-gold-600 shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 animate-pulse text-gold-600" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-gold-600 uppercase tracking-wider flex items-center gap-2">
                    <span>LIVE 2% REFLECTION ENGINE ACTIVE</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Every DEX buy and sell automatically deposits reflection yield into your balance with 0 gas cost.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-slate-500">Holdings compounding:</span>
                <span className="text-sm font-mono font-bold text-emerald-600">
                  +{user.totalEarnedYield.toLocaleString()} MBR
                </span>
              </div>
            </div>

            {/* 4 Hero Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Total Portfolio Value */}
              <div className="luxe-card p-6 rounded-3xl border border-slate-200 space-y-2 shadow-sm hover:border-gold-400/60 transition-all">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 uppercase">
                  <span>Total Portfolio Value</span>
                  <DollarSign className="w-4 h-4 text-gold-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  ${totalNetWorthUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18.4% 24h Yield & Growth</span>
                </div>
              </div>

              {/* MBR Token Balance */}
              <div className="luxe-card p-6 rounded-3xl border border-slate-200 space-y-2 shadow-sm hover:border-gold-400/60 transition-all">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 uppercase">
                  <span>MBR Balance</span>
                  <Coins className="w-4 h-4 text-gold-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 truncate">
                  {Math.round(user.mbrBalance).toLocaleString()} <span className="text-sm font-mono text-gold-600">MBR</span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  ≈ ${(user.mbrBalance * mbrPriceUsd).toFixed(2)} USD (150M Max Capped)
                </div>
              </div>

              {/* 2% Passive Yield Earned */}
              <div className="luxe-card p-6 rounded-3xl border border-slate-200 space-y-2 shadow-sm hover:border-emerald-400/40 transition-all">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 uppercase">
                  <span>Passive Yield Earned</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-emerald-600 truncate">
                  +{Math.round(user.totalEarnedYield).toLocaleString()} <span className="text-sm font-mono">MBR</span>
                </div>
                <div className="text-xs font-mono text-slate-500">
                  0 Gas Claim · Direct Wallet Reflection
                </div>
              </div>

              {/* 2035 Target Milestone */}
              <div className="luxe-card p-6 rounded-3xl border border-slate-200 space-y-2 shadow-sm hover:border-gold-400/60 transition-all">
                <div className="flex justify-between items-center text-xs font-mono text-slate-500 uppercase">
                  <span>2035 Target Valuation</span>
                  <Award className="w-4 h-4 text-gold-600" />
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold font-display text-gold-600 truncate">
                  ${(milestone2035TargetUsd / 1000000).toFixed(1)}M <span className="text-xs font-mono text-slate-500">USD</span>
                </div>
                <div className="text-xs font-mono text-gold-600 font-semibold">
                  Target: $2,000 / MBR Milestone
                </div>
              </div>

            </div>

            {/* Billionaire Milestone Progress Bar */}
            <div className="luxe-card p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    2035 Billionaire Target Milestone Roadmap
                  </h3>
                  <p className="text-xs text-slate-600">
                    Tracking protocol milestones from DEX launch to $2,000 / MBR target ($300B implied valuation).
                  </p>
                </div>
                <div className="text-xs font-mono px-3 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-300/50 font-semibold shrink-0 self-start sm:self-auto shadow-sm">
                  Hold with Conviction
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>Current: $0.00248</span>
                  <span className="text-slate-900 font-bold">$10.00 Tier 1</span>
                  <span className="text-slate-900 font-bold">$100.00 Bridge</span>
                  <span className="text-gold-600 font-bold">$2,000 Goal</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 via-gold-500 to-[#38BDF8] rounded-full"
                    style={{ width: '18%' }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">BNB Balance</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">{user.bnbBalance.toFixed(3)} BNB</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Referral Network</div>
                  <div className="text-base font-bold font-mono text-gold-600 mt-0.5">{user.tier1Count + user.tier2Count + user.tier3Count} Partners</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Liquidity Lock</div>
                  <div className="text-base font-bold font-mono text-emerald-600 mt-0.5">5 Years · until 2030–31</div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-center shadow-sm">
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Withdrawal Penalty</div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-0.5">0% (Freedom)</div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Referral Snippet */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Quick Referral Invite Box */}
              <div className="luxe-card p-6 sm:p-7 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-300/50 text-xs font-mono font-semibold mb-3 shadow-sm">
                    <Users className="w-3.5 h-3.5" />
                    Your Referral Invite Link
                  </div>
                  <h4 className="text-lg font-bold font-display text-slate-900">
                    Earn 2.0% in Direct Rewards on Every Purchase
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Share your on-chain referral code. You earn 1.0% from Tier 1, 0.6% from Tier 2, and 0.4% from Tier 3 instant bonuses.
                  </p>
                </div>

                <div className="flex items-center gap-2 p-3 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <span className="text-xs font-mono text-gold-600 truncate flex-1">
                    {referralLink}
                  </span>
                  <button
                    onClick={handleCopyRef}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl btn-gold font-bold text-xs font-mono shrink-0 shadow-sm transition-all text-black"
                  >
                    {copiedRef ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Trade Swap Prompt */}
              <div className="luxe-card p-6 sm:p-7 rounded-3xl border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-xs font-mono font-semibold mb-3 shadow-sm">
                    <ArrowDownUp className="w-3.5 h-3.5" />
                    Instant DEX Trading
                  </div>
                  <h4 className="text-lg font-bold font-display text-slate-900">
                    Acquire More MBR on PancakeSwap
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Direct decentralized routing on BNB Smart Chain. 6% tax strictly enforced by smart contracts (2% yield, 2% LP, 2% treasury).
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveTab('swap')}
                    className="btn-gold flex-1 py-3 text-xs font-bold uppercase tracking-wider text-center text-black"
                  >
                    Launch In-dApp Swap
                  </button>
                  <a
                    href={TOKEN_INFO.pancakeSwapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-glass px-4 py-3 text-xs font-semibold flex items-center gap-1.5 shrink-0 text-slate-900 hover:border-gold-400/60"
                  >
                    <span>PancakeSwap</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gold-600" />
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================== TAB 2: 3-TIER REFERRALS ==================== */}
        {activeTab === 'referrals' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header Banner */}
            <div className="luxe-card p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-300/50 text-xs font-mono font-semibold uppercase shadow-sm">
                    <Users className="w-3.5 h-3.5 text-gold-600" />
                    3-TIER BUY REFERRAL ARCHITECTURE
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                    Decentralized Partner Network
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                    Earn up to 2.0% in instant crypto commissions paid straight into your wallet on every buy executed by your invited network.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-mono font-semibold text-slate-800 flex items-center gap-2 shadow-sm"
                  >
                    <QrCode className="w-4 h-4 text-gold-600" />
                    <span>Show QR Code</span>
                  </button>
                  <button
                    onClick={handleCopyRef}
                    className="btn-gold px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm text-black"
                  >
                    {copiedRef ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedRef ? 'Copied Link!' : 'Copy Referral Link'}</span>
                  </button>
                </div>
              </div>

              {/* 3 Tier Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
                
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-gold-400/60 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase font-semibold">Tier 1 (Direct)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-gold-100 text-gold-600 border border-gold-300/50 text-xs font-bold font-mono">
                      1.0%
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-900">
                    {user.tier1Count} <span className="text-xs font-mono text-slate-500 font-normal">Referrals</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Earns 1.0% on all primary invite buys
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-cyan-400/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase font-semibold">Tier 2 (Secondary)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/15 text-cyan-600 border border-cyan-400/30 text-xs font-bold font-mono">
                      0.6%
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-900">
                    {user.tier2Count} <span className="text-xs font-mono text-slate-500 font-normal">Referrals</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Earns 0.6% on secondary network buys
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-sm hover:border-emerald-400/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-500 uppercase font-semibold">Tier 3 (Tertiary)</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-600 border border-emerald-400/30 text-xs font-bold font-mono">
                      0.4%
                    </span>
                  </div>
                  <div className="text-2xl font-bold font-display text-slate-900">
                    {user.tier3Count} <span className="text-xs font-mono text-slate-500 font-normal">Referrals</span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Earns 0.4% on tertiary network buys
                  </div>
                </div>

              </div>
            </div>

            {/* Total Earnings Showcase */}
            <div className="luxe-card p-6 sm:p-8 rounded-3xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div>
                <div className="text-xs font-mono uppercase text-slate-500 font-semibold">Total Lifetime Referral Payout</div>
                <div className="text-3xl sm:text-4xl font-extrabold font-display text-gold-600 mt-1">
                  +{user.referralEarningsMbr.toLocaleString()} MBR
                </div>
                <div className="text-xs font-mono text-emerald-600 font-semibold mt-0.5">
                  ≈ ${user.referralEarningsUsdt.toFixed(2)} USDT value deposited on-chain
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-600 max-w-sm shadow-sm">
                <span className="text-gold-600 font-semibold block mb-1">On-Chain Automation:</span>
                Referral bonuses are routed natively through the MBR_SWAP proxy contract directly to your address on BNB Chain.
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 3: INSTANT DEX SWAP ==================== */}
        {activeTab === 'swap' && (
          <div className="max-w-md mx-auto space-y-6 animate-fadeIn">
            
            <div className="luxe-card p-7 sm:p-8 rounded-3xl border border-slate-300 bg-white/95 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Instant MBR DEX Terminal
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    PancakeSwap V3 Route · 6% Tax Applied
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-300/50 font-mono text-[10px] font-bold">
                  Slippage: 7.5%
                </div>
              </div>

              {/* Pay BNB Input */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>You Pay:</span>
                  <span>Available: {user.bnbBalance.toFixed(3)} BNB</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.05"
                    value={swapBnb}
                    onChange={(e) => setSwapBnb(e.target.value)}
                    className="w-full bg-transparent text-2xl font-bold font-mono text-slate-900 focus:outline-none"
                    placeholder="0.0"
                  />
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                    <span className="text-base">🟡</span>
                    <span className="font-semibold font-mono text-xs text-slate-900">BNB</span>
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex justify-center -my-2 relative z-10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-white flex items-center justify-center shadow-md shadow-slate-900/10">
                  <ArrowDownUp className="w-4 h-4" />
                </div>
              </div>

              {/* Receive MBR Input */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="flex justify-between text-xs font-mono text-slate-500">
                  <span>You Receive (Est.):</span>
                  <span className="text-gold-600 font-semibold">After 6% Tax</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <div className="text-2xl font-bold font-mono text-gold-600 truncate">
                    {parseFloat(swapBnb) > 0 ? Math.round(parseFloat(swapBnb) * 239637 * 0.94).toLocaleString() : '0'}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-50 border border-gold-300/50 shrink-0 shadow-sm">
                    <span className="text-sm">👑</span>
                    <span className="font-semibold font-mono text-xs text-gold-600">MBR</span>
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs font-mono text-slate-600 shadow-sm">
                <div className="flex justify-between">
                  <span>2% Reflection Yield:</span>
                  <span className="text-emerald-600 font-semibold">+Holders Direct</span>
                </div>
                <div className="flex justify-between">
                  <span>2% Auto-Liquidity:</span>
                  <span className="text-slate-800 font-medium">Locked 5 Years</span>
                </div>
                <div className="flex justify-between">
                  <span>2% Treasury / Marketing:</span>
                  <span className="text-gold-600 font-medium">2035 Horizon</span>
                </div>
              </div>

              {/* Success */}
              {swapSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-600 flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Swap executed successfully! Balance updated.</span>
                </div>
              )}

              {/* Action */}
              <button
                type="button"
                onClick={handleExecuteSwap}
                disabled={isSwapping || parseFloat(swapBnb) <= 0 || parseFloat(swapBnb) > user.bnbBalance}
                className="btn-gold w-full py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm text-black"
              >
                {isSwapping ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Routing Swap via BSC...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-black" />
                    <span>Execute Swap ({swapBnb} BNB ➜ MBR)</span>
                  </>
                )}
              </button>

            </div>

            {/* Direct PancakeSwap DEX Exchange Card */}
            <div className="luxe-card p-5 rounded-2xl border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 font-display">Official PancakeSwap V3 Pool</div>
                <div className="text-[11px] text-slate-500 font-mono">Direct non-custodial DEX exchange routing</div>
              </div>
              <a
                href={TOKEN_INFO.pancakeSwapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-4 py-2 rounded-full text-xs font-mono font-bold text-black flex items-center gap-1.5 shrink-0"
              >
                <span>Trade on DEX</span>
                <ExternalLink className="w-3.5 h-3.5 text-black" />
              </a>
            </div>

          </div>
        )}

        {/* ==================== TAB 4: REFLECTION YIELD ==================== */}
        {activeTab === 'yield' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="luxe-card p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 text-gold-600 border border-gold-300/50 text-xs font-mono font-semibold shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-gold-600" />
                  THE PASSIVE REWARD ENGINE
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900">
                  How the 2% Reflection Compounding Operates
                </h3>
                <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
                  Every time anyone buys or sells MyBitRich across the globe, 2% of the trade volume is automatically distributed proportionally among all token holders. You do not need to lock, stake, or pay gas to claim: tokens are reflected directly into your balance in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs font-mono text-slate-500 uppercase font-semibold">1 Year Projection (16% APY)</div>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    +{Math.round(user.mbrBalance * 0.16).toLocaleString()} MBR
                  </div>
                  <div className="text-xs text-slate-500">Estimated passive tokens earned in 12 months</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs font-mono text-slate-500 uppercase font-semibold">3 Year Compound Curve</div>
                  <div className="text-xl font-bold font-mono text-gold-600">
                    +{Math.round(user.mbrBalance * (Math.pow(1.16, 3) - 1)).toLocaleString()} MBR
                  </div>
                  <div className="text-xs text-slate-500">Compounded token balance without staking lock</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs font-mono text-slate-500 uppercase font-semibold">2035 Target Horizon (10 Years)</div>
                  <div className="text-xl font-bold font-mono text-emerald-600">
                    +{Math.round(user.mbrBalance * (Math.pow(1.16, 10) - 1)).toLocaleString()} MBR
                  </div>
                  <div className="text-xs text-slate-500">Total tokens multiplied by $2,000 target price</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 5: TRANSACTION HISTORY ==================== */}
        {activeTab === 'activity' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="luxe-card p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <h3 className="text-lg font-bold font-display text-slate-900">
                    Recent Activity & Reflection Deposits
                  </h3>
                  <p className="text-xs font-mono text-slate-500">
                    Live on-chain log of your wallet rewards and DEX swaps
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-600 font-semibold flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>Synchronized with BSC</span>
                </div>
              </div>

              <div className="space-y-3">
                {activities.map((act) => (
                  <div
                    key={act.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-gold-600 shadow-sm">
                        {act.type === 'yield' && <Sparkles className="w-4 h-4 text-emerald-600" />}
                        {act.type === 'referral' && <Users className="w-4 h-4 text-gold-600" />}
                        {act.type === 'swap' && <ArrowDownUp className="w-4 h-4 text-blue-600" />}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{act.title}</div>
                        <div className="text-xs font-code text-slate-500">{act.timestamp} · Tx: {act.txHash}</div>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-sm font-mono font-bold text-emerald-600">{act.amount}</div>
                      <div className="text-xs font-mono text-slate-500">{act.amountUsd}</div>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* QR Code Modal for Referral */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
          <div className="luxe-card p-7 rounded-3xl border border-slate-300 bg-white/95 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <h4 className="text-lg font-bold text-slate-900 font-display">Your Referral QR Code</h4>
            <div className="p-4 bg-white border border-slate-200 rounded-2xl inline-block mx-auto shadow-sm">
              <div className="w-48 h-48 bg-white flex flex-col items-center justify-center text-slate-900 text-xs font-mono p-4 rounded-xl border border-slate-200">
                <span className="text-2xl mb-2">📱</span>
                <span className="font-bold text-gold-600">Scan to Buy MBR</span>
                <span className="text-[10px] text-slate-500 mt-1 break-all">{user.referralCode}</span>
              </div>
            </div>
            <p className="text-xs text-slate-600">
              Scan with mobile camera or Trust Wallet dApp browser to apply your 3-tier commission code.
            </p>
            <button
              onClick={() => setShowQrModal(false)}
              className="btn-gold w-full py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-black"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 py-4 bg-white text-center text-xs font-code text-slate-500">
        <p>MyBitRich Investor Portal · Connected to BEP-20 Contract: {TOKEN_INFO.contractAddress.slice(0, 10)}...</p>
        <p className="mx-auto mt-1 max-w-2xl px-4 font-sans">{OFFICIAL_DISCLAIMER}</p>
      </footer>
    </div>
  );
};
