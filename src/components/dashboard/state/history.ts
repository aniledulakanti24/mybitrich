import { useMemo } from 'react';
import { txDelta, useWallet, type LedgerTx } from './WalletProvider';
import type { MarketFeed } from './market';

export interface HistoryPoint {
  t: number;
  usdt: number;
  mbr: number;
  price: number;
  value: number;
}

/** Rebuild balances at evenly spaced points by undoing ledger entries newest-first. */
export function replayHistory(txs: LedgerTx[], usdt: number, mbr: number, market: MarketFeed, points: number, stepMs: number, now = Date.now()): HistoryPoint[] {
  const sorted = [...txs].sort((a, b) => b.createdAt - a.createdAt);
  const out: HistoryPoint[] = [];
  let u = usdt;
  let m = mbr;
  let i = 0;
  for (let k = 0; k < points; k++) {
    const t = now - k * stepMs;
    while (i < sorted.length && sorted[i].createdAt > t) {
      const d = txDelta(sorted[i]);
      u -= d.usdt;
      m -= d.mbr;
      i++;
    }
    const price = k === 0 ? market.price : market.priceAt(t);
    const uu = Math.max(0, u);
    const mm = Math.max(0, m);
    out.push({ t, usdt: uu, mbr: mm, price, value: uu + mm * price });
  }
  return out.reverse();
}

/** Daily (or custom step) portfolio history; recomputed when the ledger or the minute changes. */
export function usePortfolioHistory(points = 30, stepMs = 86_400_000) {
  const { state, market, price } = useWallet();
  const minute = Math.floor(Date.now() / 60_000);
  const base = useMemo(
    () => replayHistory(state.txs, state.usdt, state.mbr, market, points, stepMs),
    // balances move every tick via holding reward; the ledger and minute are enough for the curve shape
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.txs, market, points, stepMs, minute],
  );
  // Keep the newest point live
  return useMemo(() => {
    if (!base.length) return base;
    const last = { ...base[base.length - 1], usdt: state.usdt, mbr: state.mbr, price, value: state.usdt + state.mbr * price };
    return [...base.slice(0, -1), last];
  }, [base, state.usdt, state.mbr, price]);
}
