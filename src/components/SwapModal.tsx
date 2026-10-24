import React, { useState } from 'react';
import { X, ArrowDownUp, ExternalLink, Sparkles, Check } from 'lucide-react';
import { TOKEN_INFO } from '../data/tokenData';
import { triggerBillionaireConfetti } from '../utils/confetti';
import { Disclaimer } from './ui/Disclaimer';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string | null;
  onOpenConnectModal: () => void;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  isOpen,
  onClose,
  walletAddress,
  onOpenConnectModal,
}) => {
  const [bnbAmount, setBnbAmount] = useState<string>('0.5');
  const [slippage, setSlippage] = useState<number>(7.5);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccess, setSwapSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const rateBnbToMbr = 239637;
  const numBnb = parseFloat(bnbAmount) || 0;
  const rawMbr = numBnb * rateBnbToMbr;
  const taxAmount = rawMbr * 0.06;
  const receiveMbr = rawMbr - taxAmount;

  const handleSwap = () => {
    setIsSwapping(true);
    setSwapSuccess(false);

    setTimeout(() => {
      setIsSwapping(false);
      setSwapSuccess(true);
      triggerBillionaireConfetti();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div data-lenis-prevent className="relative w-full max-w-md max-h-[calc(100dvh-2rem)] overflow-y-auto luxe-card p-6 sm:p-7 rounded-3xl border border-slate-300 bg-white/95 shadow-2xl text-slate-800 backdrop-blur-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-slate-50 border border-gold-300/50 flex items-center justify-center p-1 shadow-sm">
              <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="MBR" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900">
                Instant MBR Swap Terminal
              </h3>
              <p className="text-xs font-mono text-slate-500">
                PancakeSwap V3 Route · 6% Tax Applied
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Swap Form */}
        <div className="space-y-4 pt-4">
          
          {/* FROM Input (BNB) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 focus-within:border-gold-400/60 transition-colors shadow-sm">
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
              <span>You Pay:</span>
              <span>Balance: 2.45 BNB</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <input
                type="number"
                min="0"
                step="0.01"
                value={bnbAmount}
                onChange={(e) => setBnbAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold font-mono text-slate-900 focus:outline-none"
                placeholder="0.0"
              />
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 shrink-0 shadow-sm">
                <span className="text-lg">🟡</span>
                <span className="font-semibold font-mono text-xs text-slate-900">BNB</span>
              </div>
            </div>
          </div>

          {/* Swap Divider Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 text-white flex items-center justify-center shadow-lg shadow-slate-900/10">
              <ArrowDownUp className="w-4 h-4" />
            </div>
          </div>

          {/* TO Input (MBR) */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <div className="flex justify-between text-xs font-mono text-slate-500 mb-2">
              <span>You Receive (Est.):</span>
              <span className="text-gold-600 font-semibold">After 6% Tax</span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-2xl font-bold font-mono text-gold-600 truncate">
                {receiveMbr > 0 ? Math.round(receiveMbr).toLocaleString() : '0'}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-50 border border-gold-300/50 shrink-0 shadow-sm">
                <span className="text-sm">👑</span>
                <span className="font-semibold font-mono text-xs text-gold-600">MBR</span>
              </div>
            </div>
          </div>

          {/* Slippage & Route Details */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2.5 text-xs font-mono shadow-sm">
            <div className="flex justify-between items-center text-slate-500">
              <span>Slippage Tolerance:</span>
              <div className="flex items-center gap-1.5">
                {[7.0, 7.5, 8.0].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSlippage(s)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      slippage === s
                        ? 'bg-navy-800 text-white font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {s}%
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Automated Reflection (2%):</span>
              <span className="text-emerald-600 font-semibold">
                +{Math.round(rawMbr * 0.02).toLocaleString()} MBR to Holders
              </span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Auto-Liquidity (2%):</span>
              <span className="text-slate-800 font-medium">Permanently Locked</span>
            </div>

            <div className="flex justify-between text-slate-500">
              <span>Marketing & Treasury (2%):</span>
              <span className="text-blue-600 font-medium">Ecosystem Expansion</span>
            </div>
          </div>

          {/* Success Notification */}
          {swapSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-600 animate-fadeIn">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="block font-bold">Simulated Swap Executed!</strong>
                <span>You now hold {Math.round(receiveMbr).toLocaleString()} MBR. Hold with conviction through 2035!</span>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!walletAddress ? (
            <button
              onClick={() => {
                onClose();
                onOpenConnectModal();
              }}
              className="btn-gold w-full py-4 rounded-full text-xs uppercase tracking-wider font-extrabold shadow-sm"
            >
              Connect Wallet to Swap
            </button>
          ) : (
            <button
              onClick={handleSwap}
              disabled={isSwapping || numBnb <= 0}
              className={`btn-gold w-full py-4 rounded-full text-xs uppercase tracking-wider font-extrabold shadow-sm flex items-center justify-center gap-2 ${
                isSwapping ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSwapping ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Routing via BSC PancakeSwap...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Simulate Instant Swap (BNB ➜ MBR)</span>
                </>
              )}
            </button>
          )}

          <div className="text-center pt-1">
            <a
              href={TOKEN_INFO.pancakeSwapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-gold-600 transition-colors"
            >
              <span>Execute directly on official PancakeSwap</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <Disclaimer topic="trade" compact className="mt-4" />

        </div>

      </div>
    </div>
  );
};
