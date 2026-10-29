import { useEffect, useState } from 'react';
import { TOKEN_INFO } from '../data/tokenData';

// Public market data for the marketing site.
// MBR comes from DexScreener (indexes every PancakeSwap pool); majors from CoinGecko.
// Until MBR has an indexed pool, `mbr.live` is false and the launch reference price is shown
// with a "Reference" label instead of being presented as live.

export interface CoinQuote {
  symbol: string;
  priceUsd: number;
  change24h: number;
}

export interface MbrQuote {
  live: boolean;
  priceUsd: number;
  change24h: number | null;
  volume24h: number | null;
  marketCap: number;
  pairUrl?: string;
}

export interface MarketData {
  mbr: MbrQuote;
  coins: CoinQuote[];
  coinsLive: boolean;
  updatedAt: number | null;
}

export const REFERENCE_PRICE = 0.00248;

const COINS: { id: string; symbol: string }[] = [
  { id: 'binancecoin', symbol: 'BNB' },
  { id: 'bitcoin', symbol: 'BTC' },
  { id: 'ethereum', symbol: 'ETH' },
  { id: 'solana', symbol: 'SOL' },
  { id: 'the-open-network', symbol: 'TON' },
];

const REFRESH_MS = 60_000;

let state: MarketData = {
  mbr: { live: false, priceUsd: REFERENCE_PRICE, change24h: null, volume24h: null, marketCap: REFERENCE_PRICE * TOKEN_INFO.totalSupply },
  coins: [],
  coinsLive: false,
  updatedAt: null,
};
const listeners = new Set<(s: MarketData) => void>();
let timer: number | undefined;
let inflight = false;

async function fetchMbr(): Promise<MbrQuote | null> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${TOKEN_INFO.contractAddress}`);
  if (!res.ok) return null;
  const json = await res.json();
  const pairs: any[] = (json.pairs ?? []).filter((p: any) => p.chainId === 'bsc' && p.baseToken?.address?.toLowerCase() === TOKEN_INFO.contractAddress.toLowerCase());
  if (!pairs.length) return null;
  // Deepest pool is the reference market
  const best = pairs.sort((a, b) => (b.liquidity?.usd ?? 0) - (a.liquidity?.usd ?? 0))[0];
  const price = parseFloat(best.priceUsd);
  if (!(price > 0)) return null;
  return {
    live: true,
    priceUsd: price,
    change24h: typeof best.priceChange?.h24 === 'number' ? best.priceChange.h24 / 100 : null,
    volume24h: pairs.reduce((s, p) => s + (p.volume?.h24 ?? 0), 0),
    marketCap: best.marketCap ?? best.fdv ?? price * TOKEN_INFO.totalSupply,
    pairUrl: best.url,
  };
}

async function fetchCoins(): Promise<CoinQuote[] | null> {
  const ids = COINS.map((c) => c.id).join(',');
  const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`);
  if (!res.ok) return null;
  const json = await res.json();
  const out = COINS.filter((c) => json[c.id]?.usd).map((c) => ({ symbol: c.symbol, priceUsd: json[c.id].usd, change24h: (json[c.id].usd_24h_change ?? 0) / 100 }));
  return out.length ? out : null;
}

async function refresh() {
  if (inflight) return;
  inflight = true;
  const [mbr, coins] = await Promise.all([fetchMbr().catch(() => null), fetchCoins().catch(() => null)]);
  inflight = false;
  state = {
    mbr: mbr ?? state.mbr,
    coins: coins ?? state.coins,
    coinsLive: coins ? true : state.coinsLive,
    updatedAt: Date.now(),
  };
  listeners.forEach((l) => l(state));
}

export function useMarketData(): MarketData {
  const [data, setData] = useState(state);
  useEffect(() => {
    listeners.add(setData);
    if (listeners.size === 1) {
      refresh();
      timer = window.setInterval(refresh, REFRESH_MS);
    }
    return () => {
      listeners.delete(setData);
      if (!listeners.size) window.clearInterval(timer);
    };
  }, []);
  return data;
}

export const fmtUsdPrice = (v: number) =>
  v >= 1000 ? `$${v.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}` : v >= 1 ? `$${v.toFixed(2)}` : `$${v.toPrecision(3)}`;

export const fmtCompact = (v: number) =>
  v >= 1e9 ? `$${(v / 1e9).toFixed(2)}B` : v >= 1e6 ? `$${(v / 1e6).toFixed(2)}M` : v >= 1e3 ? `$${(v / 1e3).toFixed(1)}K` : `$${v.toFixed(0)}`;

export const fmtChange = (v: number) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(2)}%`;
