import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectSuccess: (address: string) => void;
}

export const ConnectWalletModal: React.FC<ConnectWalletModalProps> = ({
  isOpen,
  onClose,
  onConnectSuccess,
}) => {
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const walletOptions = [
    {
      id: 'metamask',
      name: 'MetaMask',
      icon: '🦊',
      desc: 'Browser extension & mobile dApp wallet',
      popular: true,
    },
    {
      id: 'trustwallet',
      name: 'Trust Wallet',
      icon: '🛡️',
      desc: 'Official Binance mobile Web3 wallet',
      popular: true,
    },
    {
      id: 'binance',
      name: 'Binance Web3 Wallet',
      icon: '🟡',
      desc: 'Seamless Binance exchange integration',
      popular: false,
    },
    {
      id: 'rabby',
      name: 'Rabby Wallet',
      icon: '🐰',
      desc: 'Multi-chain security & simulation',
      popular: false,
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗',
      desc: 'Scan QR code with any mobile wallet',
      popular: false,
    },
  ];

  const handleSelectWallet = (walletId: string) => {
    setConnectingWallet(walletId);

    setTimeout(() => {
      const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
      const mockAddress = `0x71C${randomHex.toUpperCase()}F820bE9871D2a3C9b8417`;
      
      setConnectingWallet(null);
      onConnectSuccess(mockAddress);
      onClose();
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md luxe-card p-6 sm:p-7 rounded-3xl border border-slate-300 bg-white/95 shadow-2xl text-slate-800 backdrop-blur-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900">
              Connect Web3 Wallet
            </h3>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              Select your BNB Smart Chain compatible wallet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wallets List */}
        <div className="space-y-2.5 pt-4">
          {walletOptions.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => handleSelectWallet(wallet.id)}
              disabled={connectingWallet !== null}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-white hover:bg-[#0D1529] border border-slate-200 hover:border-gold-400/60 transition-all group text-left relative overflow-hidden shadow-sm"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-2xl">{wallet.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-gold-600 transition-colors">
                      {wallet.name}
                    </span>
                    {wallet.popular && (
                      <span className="text-[10px] font-mono uppercase bg-gold-50 text-gold-600 px-2 py-0.5 rounded-full border border-gold-300/50">
                        Popular
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 block mt-0.5">
                    {wallet.desc}
                  </span>
                </div>
              </div>

              {connectingWallet === wallet.id ? (
                <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
              ) : (
                <span className="text-xs font-mono text-slate-500 group-hover:text-gold-600 transition-colors">
                  Connect ➜
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Security Assurance */}
        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2.5 text-xs text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Non-custodial connection. We will never ask for your private key or seed phrase.</span>
        </div>

      </div>
    </div>
  );
};
