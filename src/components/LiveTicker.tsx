import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react';
import { fmtChange, fmtCompact, fmtUsdPrice, useMarketData } from '../hooks/useMarketData';

export const LiveTicker: React.FC = () => {
  // Fade out once the page scrolls so the ticker never slides under the floating navbar
  const [faded, setFaded] = useState(false);
  useEffect(() => {
    const onScroll = () => setFaded(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const { mbr, coins, coinsLive } = useMarketData();
  const tickerItems: { symbol: string; price: string; change: string | null; isPositive: boolean; isHero?: boolean; tag?: string }[] = [
    {
      symbol: 'MBR / USDT',
      price: fmtUsdPrice(mbr.priceUsd),
      change: mbr.change24h !== null ? fmtChange(mbr.change24h) : null,
      isPositive: (mbr.change24h ?? 0) >= 0,
      isHero: true,
      tag: mbr.live ? undefined : 'Reference',
    },
    ...coins.map((c) => ({ symbol: `${c.symbol} / USD`, price: fmtUsdPrice(c.priceUsd), change: fmtChange(c.change24h), isPositive: c.change24h >= 0 })),
    ...(mbr.live && mbr.volume24h !== null ? [{ symbol: 'MBR 24H VOL', price: fmtCompact(mbr.volume24h), change: null, isPositive: true, isHero: true }] : []),
  ];


  return (
    // No bar background: frosted pills float over whatever section sits beneath
    <div
      className={`relative z-20 mx-auto flex max-w-6xl select-none items-center gap-3 px-3 transition-all duration-300 sm:px-6 ${
        faded ? 'pointer-events-none -translate-y-2 opacity-0' : 'opacity-100'
      }`}
    >
      {/* Pinned market label */}
      <div className="glass-pill hidden shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-bold text-amber-300 sm:flex">
        <span className={`h-2 w-2 rounded-full ${coinsLive ? 'animate-pulse bg-emerald-400' : 'bg-slate-400'}`} />
        <span className="tracking-wider">{coinsLive ? 'LIVE MARKETS' : 'MARKETS'}</span>
      </div>

      <div className="mask-fade-x min-w-0 flex-1 overflow-hidden py-1.5">
      <div className="flex w-max gap-3 whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div
            key={idx}
            className={`glass-pill flex items-center gap-2 rounded-full px-3 py-1 text-xs font-mono transition-colors duration-200 ${
              item.isHero ? 'border-amber-300/40 text-amber-300 font-bold' : 'text-white/70'
            }`}
          >
            {item.isHero && <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-400/40" />}
            <span className={item.isHero ? 'text-amber-200 font-bold' : 'text-white/85 font-semibold'}>{item.symbol}</span>
            <span className="text-white font-mono font-medium">{item.price}</span>
            {item.tag && <span className="rounded-full bg-amber-300/15 px-1.5 text-[9px] font-semibold uppercase tracking-wide text-amber-200">{item.tag}</span>}
            {item.change !== null && <span
              className={`flex items-center text-[11px] font-semibold ${
                item.isPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {item.change}
              {item.isPositive ? (
                <ArrowUpRight className="w-3 h-3 ml-0.5" />
              ) : (
                <ArrowDownRight className="w-3 h-3 ml-0.5" />
              )}
            </span>}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};
