import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import type { UserProfile } from '../../../types/auth';
import { DASH, NETWORKS, TOTAL_TAX, Asset, NetworkId, dayKey, depositAddressFor, isAddressFor, isTxHashFor, randomHex, transferRules } from '../config';
import { MarketFeed, MarketStats, gauss, mulberry32 } from './market';

// ---------------------------------------------------------------------------
// Ledger model. Every balance change is a LedgerTx, so portfolio history can be
// replayed from the ledger. The reducer is the single place balances change.
// ---------------------------------------------------------------------------

export type TxKind = 'deposit' | 'withdraw' | 'swap' | 'holding_reward' | 'referral_reward';
export type TxStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type Level = 1 | 2 | 3;

export interface LedgerTx {
  id: string;
  kind: TxKind;
  asset: Asset;
  amount: number;
  toAsset?: Asset;
  toAmount?: number;
  price?: number;
  tax?: number; // in the input asset
  fee?: number;
  address?: string;
  level?: Level;
  from?: string;
  status: TxStatus;
  confirmations?: number;
  required?: number;
  network?: NetworkId;
  hash: string;
  createdAt: number;
}

export interface TeamMember {
  id: string;
  handle: string;
  wallet: string;
  level: Level;
  sponsor?: string;
  joinedAt: number;
  lastBuyAt: number;
  volumeUsdt: number;
  earnedMbr: number;
}

export interface WalletState {
  v: 2;
  userId: string;
  usdt: number;
  mbr: number;
  usdtDeposited: number;
  usdtWithdrawn: number;
  mbrDeposited: number;
  mbrWithdrawn: number;
  boughtMbr: number;
  spentUsdt: number;
  soldMbr: number;
  receivedUsdt: number;
  holdingReward: number;
  referralReward: number;
  referralByLevel: [number, number, number];
  rewardDays: Record<string, { holding: number; referral: number }>;
  pendingHolding: number;
  lastHoldingFlush: number;
  txs: LedgerTx[];
  team: TeamMember[];
  depositAddress: string;
}

const txId = () => `tx_${Date.now().toString(36)}${randomHex(4)}`;
const txHash = (rng?: () => number) => `0x${randomHex(64, rng)}`;
const round = (v: number, d = 6) => Math.round(v * 10 ** d) / 10 ** d;

export function swapQuote(from: Asset, amountIn: number, price: number) {
  const usd = from === 'USDT' ? amountIn : amountIn * price;
  const impact = Math.min(0.25, usd / DASH.poolLiquidityUsd);
  if (from === 'USDT') {
    const gross = (amountIn / price) * (1 - impact);
    const tax = gross * TOTAL_TAX;
    return { out: gross - tax, tax, taxAsset: 'MBR' as Asset, impact, usd, execPrice: amountIn / (gross - tax || 1) };
  }
  const tax = amountIn * TOTAL_TAX;
  const out = (amountIn - tax) * price * (1 - impact);
  return { out, tax, taxAsset: 'MBR' as Asset, impact, usd, execPrice: out / (amountIn || 1) };
}

/** Balance change a tx causes (used by both the reducer and history replay). */
export function txDelta(tx: LedgerTx): { usdt: number; mbr: number } {
  const d = { usdt: 0, mbr: 0 };
  const add = (a: Asset, v: number) => (a === 'USDT' ? (d.usdt += v) : (d.mbr += v));
  if (tx.status === 'failed') return d;
  switch (tx.kind) {
    case 'deposit':
      if (tx.status === 'completed') add(tx.asset, tx.amount);
      break;
    case 'withdraw':
      add(tx.asset, -(tx.amount + (tx.fee ?? 0)));
      break;
    case 'swap':
      add(tx.asset, -tx.amount);
      add(tx.toAsset!, tx.toAmount!);
      break;
    default:
      add('MBR', tx.amount);
  }
  return d;
}

// ---------------------------------------------------------------------------
// Seeding: a demo account gets 90 days of plausible history priced off the same
// market feed the chart shows; a fresh sign-up starts empty.
// ---------------------------------------------------------------------------

const HANDLES = ['nova', 'atlas', 'kite', 'orbit', 'zen', 'pixel', 'ember', 'sable', 'onyx', 'lumen', 'echo', 'drift', 'flux', 'ivory', 'jade', 'koda', 'mira', 'nori', 'quill', 'rune'];

function emptyState(userId: string, rng: () => number): WalletState {
  return {
    v: 2,
    userId,
    usdt: 0,
    mbr: 0,
    usdtDeposited: 0,
    usdtWithdrawn: 0,
    mbrDeposited: 0,
    mbrWithdrawn: 0,
    boughtMbr: 0,
    spentUsdt: 0,
    soldMbr: 0,
    receivedUsdt: 0,
    holdingReward: 0,
    referralReward: 0,
    referralByLevel: [0, 0, 0],
    rewardDays: {},
    pendingHolding: 0,
    lastHoldingFlush: Date.now(),
    txs: [],
    team: [],
    depositAddress: `0x${randomHex(40, rng)}`,
  };
}

function applyTx(s: WalletState, tx: LedgerTx): WalletState {
  const d = txDelta(tx);
  const next: WalletState = { ...s, usdt: round(s.usdt + d.usdt), mbr: round(s.mbr + d.mbr) };
  const day = dayKey(tx.createdAt);
  const bucket = { ...(next.rewardDays[day] ?? { holding: 0, referral: 0 }) };
  if (tx.kind === 'deposit' && tx.status === 'completed') {
    if (tx.asset === 'USDT') next.usdtDeposited += tx.amount;
    else next.mbrDeposited += tx.amount;
  } else if (tx.kind === 'withdraw' && tx.status === 'completed') {
    if (tx.asset === 'USDT') next.usdtWithdrawn += tx.amount;
    else next.mbrWithdrawn += tx.amount;
  } else if (tx.kind === 'swap') {
    if (tx.asset === 'USDT') {
      next.spentUsdt += tx.amount;
      next.boughtMbr += tx.toAmount!;
    } else {
      next.soldMbr += tx.amount;
      next.receivedUsdt += tx.toAmount!;
    }
  } else if (tx.kind === 'holding_reward') {
    next.holdingReward += tx.amount;
    bucket.holding += tx.amount;
    next.rewardDays = { ...next.rewardDays, [day]: bucket };
  } else if (tx.kind === 'referral_reward') {
    next.referralReward += tx.amount;
    const byLevel = [...next.referralByLevel] as [number, number, number];
    byLevel[(tx.level ?? 1) - 1] += tx.amount;
    next.referralByLevel = byLevel;
    bucket.referral += tx.amount;
    next.rewardDays = { ...next.rewardDays, [day]: bucket };
  }
  next.txs = [tx, ...s.txs];
  return next;
}

function seedDemo(user: UserProfile, market: MarketFeed): WalletState {
  const rng = mulberry32(parseInt(user.id.replace(/\D/g, '') || '7', 10) || 7);
  const DAY = 86_400_000;
  const now = Date.now();
  const start = now - 88 * DAY;
  const at = (d: number, h = 12) => start + d * DAY + h * 3_600_000 + Math.floor(rng() * 3_000_000);
  const completed = (p: Partial<LedgerTx> & Pick<LedgerTx, 'kind' | 'asset' | 'amount' | 'createdAt'>): LedgerTx => ({
    id: `seed_${randomHex(10, rng)}`,
    status: 'completed',
    hash: txHash(rng),
    ...p,
  });

  // Team: three levels, each L2/L3 member sponsored by someone a level above.
  const team: TeamMember[] = [];
  const counts = [user.tier1Count, user.tier2Count, user.tier3Count];
  counts.forEach((n, li) => {
    const level = (li + 1) as Level;
    const sponsors = team.filter((m) => m.level === li);
    for (let i = 0; i < n; i++) {
      const sponsor = sponsors.length ? sponsors[Math.floor(rng() * sponsors.length)] : undefined;
      const joinedAt = Math.max(sponsor?.joinedAt ?? start, start + Math.floor(rng() * 80 * DAY) * (li ? 0.6 + li * 0.15 : 1));
      team.push({
        id: `m_${randomHex(8, rng)}`,
        handle: `${HANDLES[Math.floor(rng() * HANDLES.length)]}_${randomHex(3, rng)}`,
        wallet: `0x${randomHex(40, rng)}`,
        level,
        sponsor: sponsor?.id,
        joinedAt,
        lastBuyAt: joinedAt,
        volumeUsdt: 0,
        earnedMbr: 0,
      });
    }
  });

  // User's own funding flow: USDT in -> swap to MBR, with an MBR deposit and a partial exit.
  type Ev = { t: number; make: (s: WalletState) => LedgerTx | null };
  const events: Ev[] = [];
  const deposit = (d: number, asset: Asset, amount: number) =>
    events.push({ t: at(d, 9), make: () => completed({ kind: 'deposit', asset, amount, createdAt: at(d, 9), confirmations: 15, required: 15, from: `0x${randomHex(40, rng)}` }) });
  const swap = (d: number, from: Asset, share: number) =>
    events.push({
      t: at(d, 11),
      make: (s) => {
        const amount = round(from === 'USDT' ? s.usdt * share : s.mbr * share, from === 'USDT' ? 2 : 0);
        if (amount <= 0) return null;
        const t = at(d, 11);
        const price = market.priceAt(t);
        const q = swapQuote(from, amount, price);
        return completed({ kind: 'swap', asset: from, amount, toAsset: from === 'USDT' ? 'MBR' : 'USDT', toAmount: round(q.out, 2), price, tax: q.tax, createdAt: t });
      },
    });
  const withdraw = (d: number, asset: Asset, amount: number) =>
    events.push({
      t: at(d, 15),
      make: () => completed({ kind: 'withdraw', asset, amount, fee: DASH.assets[asset].withdrawFee, createdAt: at(d, 15), address: `0x${randomHex(40, rng)}`, confirmations: 15, required: 15 }),
    });

  deposit(1, 'USDT', 500);
  swap(1, 'USDT', 0.96);
  deposit(14, 'USDT', 250);
  swap(14, 'USDT', 0.9);
  deposit(31, 'MBR', 20_000);
  deposit(47, 'USDT', 200);
  swap(48, 'USDT', 0.75);
  swap(66, 'MBR', 0.08);
  withdraw(67, 'USDT', 40);
  deposit(80, 'USDT', 150);
  swap(81, 'USDT', 0.5);

  // Team purchases generate referral rewards for this account.
  for (const m of team) {
    const buys = 1 + Math.floor(rng() * 3);
    for (let b = 0; b < buys; b++) {
      const t = m.joinedAt + Math.floor(rng() * Math.max(DAY, now - m.joinedAt - DAY));
      const usd = round(Math.min(900, 25 * Math.exp(Math.abs(gauss(rng)) * 1.3)), 2);
      events.push({
        t,
        make: () => {
          const price = market.priceAt(t);
          const mbrBought = (usd / price) * (1 - TOTAL_TAX);
          const reward = round(mbrBought * DASH.referralRates[m.level - 1], 2);
          m.volumeUsdt += usd;
          m.earnedMbr += reward;
          m.lastBuyAt = Math.max(m.lastBuyAt, t);
          return completed({ kind: 'referral_reward', asset: 'MBR', amount: reward, level: m.level, from: m.handle, price, createdAt: t });
        },
      });
    }
  }

  events.sort((a, b) => a.t - b.t);
  let s = emptyState(user.id, rng);
  let ei = 0;
  const today = Math.floor(now / DAY) * DAY;
  for (let dayStart = Math.floor(start / DAY) * DAY; dayStart < today; dayStart += DAY) {
    while (ei < events.length && events[ei].t < dayStart + DAY) {
      const tx = events[ei++].make(s);
      if (tx) s = applyTx(s, tx);
    }
    if (s.mbr > 0) {
      const reward = round((DASH.tax.holders * market.dailyVolume(dayStart) * s.mbr) / DASH.totalSupply / market.priceAt(dayStart + DAY - 1), 2);
      if (reward > 0) s = applyTx(s, completed({ kind: 'holding_reward', asset: 'MBR', amount: reward, createdAt: dayStart + DAY - 60_000 }));
    }
  }
  while (ei < events.length && events[ei].t <= now) {
    const tx = events[ei++].make(s);
    if (tx) s = applyTx(s, tx);
  }
  return { ...s, team, lastHoldingFlush: now };
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

type Action =
  | { type: 'reset'; state: WalletState }
  | { type: 'tick'; price: number; tickVolume: number; now: number }
  | { type: 'tx'; tx: LedgerTx }
  | { type: 'team_buy'; memberId: string; usd: number; price: number; hash: string };

function reducer(s: WalletState, a: Action): WalletState {
  switch (a.type) {
    case 'reset':
      return a.state;
    case 'tx':
      return applyTx(s, a.tx);
    case 'team_buy': {
      const m = s.team.find((x) => x.id === a.memberId);
      if (!m) return s;
      const reward = round(((a.usd / a.price) * (1 - TOTAL_TAX)) * DASH.referralRates[m.level - 1], 2);
      const team = s.team.map((x) =>
        x.id === m.id ? { ...x, volumeUsdt: x.volumeUsdt + a.usd, earnedMbr: x.earnedMbr + reward, lastBuyAt: Date.now() } : x,
      );
      return applyTx({ ...s, team }, {
        id: txId(), kind: 'referral_reward', asset: 'MBR', amount: reward, level: m.level, from: m.handle,
        price: a.price, status: 'completed', hash: a.hash, createdAt: Date.now(),
      });
    }
    case 'tick': {
      let next = s;
      // Holding reward: 2% of every trade is split pro-rata across all MBR holders.
      if (a.tickVolume > 0 && s.mbr > 0) {
        const r = (DASH.tax.holders * a.tickVolume * s.mbr) / DASH.totalSupply / a.price;
        next = { ...next, mbr: next.mbr + r, holdingReward: next.holdingReward + r, pendingHolding: next.pendingHolding + r };
        const day = dayKey(a.now);
        const b = next.rewardDays[day] ?? { holding: 0, referral: 0 };
        next.rewardDays = { ...next.rewardDays, [day]: { ...b, holding: b.holding + r } };
      }
      // Roll accrued holding reward into the ledger once a minute (balance is already credited).
      if (next.pendingHolding > 0 && a.now - next.lastHoldingFlush > 60_000) {
        const tx: LedgerTx = { id: txId(), kind: 'holding_reward', asset: 'MBR', amount: round(next.pendingHolding, 4), status: 'completed', hash: txHash(), createdAt: a.now };
        next = { ...next, txs: [tx, ...next.txs], pendingHolding: 0, lastHoldingFlush: a.now };
      }
      // Advance confirmations on in-flight deposits and withdrawals.
      if (next.txs.some((t) => t.status === 'pending' || t.status === 'processing')) {
        const credited = { ...next };
        const txs = next.txs.map((t) => {
          if (t.status !== 'pending' && t.status !== 'processing') return t;
          const confirmations = Math.min((t.confirmations ?? 0) + Math.max(1, Math.round((t.required ?? 15) / 10)), t.required ?? 15);
          const done = confirmations >= (t.required ?? 15);
          const nt: LedgerTx = { ...t, confirmations, status: done ? 'completed' : confirmations > 3 ? 'processing' : 'pending' };
          if (done && t.kind === 'deposit') {
            if (t.asset === 'USDT') credited.usdt = round(credited.usdt + t.amount);
            else credited.mbr = round(credited.mbr + t.amount);
            credited[t.asset === 'USDT' ? 'usdtDeposited' : 'mbrDeposited'] += t.amount;
          }
          if (done && t.kind === 'withdraw') credited[t.asset === 'USDT' ? 'usdtWithdrawn' : 'mbrWithdrawn'] += t.amount;
          return nt;
        });
        next = { ...credited, txs };
      }
      return next;
    }
  }
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export type ActionResult = { ok: true; tx: LedgerTx } | { ok: false; error: string };

interface WalletCtx {
  state: WalletState;
  market: MarketFeed;
  stats: MarketStats;
  price: number;
  marketVersion: number;
  submitDeposit: (asset: Asset, amount: number, network: NetworkId, sourceTxHash?: string) => ActionResult;
  submitWithdraw: (asset: Asset, amount: number, address: string, network: NetworkId) => ActionResult;
  executeSwap: (from: Asset, amountIn: number, slippagePct: number, quotedOut: number) => ActionResult;
  resetDemo: () => void;
}

const Ctx = createContext<WalletCtx | null>(null);

const storageKey = (id: string) => `mbr_wallet_${id}`;

function load(user: UserProfile, market: MarketFeed): WalletState {
  try {
    const raw = localStorage.getItem(storageKey(user.id));
    if (raw) {
      const s = JSON.parse(raw) as WalletState;
      if (s.v === 2 && s.userId === user.id) return { ...s, lastHoldingFlush: Date.now() };
    }
  } catch {
    /* ignore corrupt or blocked storage */
  }
  const isDemo = user.tier1Count > 0 || user.mbrBalance > 1000;
  return isDemo ? seedDemo(user, market) : emptyState(user.id, Math.random);
}

export const WalletProvider: React.FC<{ user: UserProfile; children: React.ReactNode }> = ({ user, children }) => {
  const market = useMemo(() => new MarketFeed(0.00248), []);
  const [state, dispatch] = useReducer(reducer, undefined, () => load(user, market));
  const [stats, setStats] = useState<MarketStats>(() => market.stats());
  const [marketVersion, setMarketVersion] = useState(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Live market + reward engine
  useEffect(() => {
    let lastReferralRoll = Date.now();
    const id = window.setInterval(() => {
      const { price, tickVolume } = market.tick();
      const now = Date.now();
      dispatch({ type: 'tick', price, tickVolume, now });
      if (now - lastReferralRoll > 60_000) {
        lastReferralRoll = now;
        const team = stateRef.current.team;
        if (team.length && Math.random() < 0.15) {
          const m = team[Math.floor(Math.random() * team.length)];
          const usd = Math.round(20 + Math.random() * 380);
          market.applyTrade(usd, 'buy', usd / DASH.poolLiquidityUsd);
          dispatch({ type: 'team_buy', memberId: m.id, usd, price, hash: txHash() });
        }
      }
      setStats(market.stats());
      setMarketVersion((v) => v + 1);
    }, 1500);
    return () => window.clearInterval(id);
  }, [market]);

  // Debounced persistence
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey(state.userId), JSON.stringify(state));
      } catch {
        /* storage full or blocked: state stays in memory */
      }
    }, 2000);
    return () => window.clearTimeout(id);
  }, [state]);

  const submitDeposit = useCallback<WalletCtx['submitDeposit']>((asset, amount, network, sourceTxHash) => {
    const cfg = transferRules(asset, network);
    if (!(amount >= cfg.minDeposit)) return { ok: false, error: `Minimum deposit on ${NETWORKS[network].label} is ${cfg.minDeposit.toLocaleString()} ${asset}` };
    if (sourceTxHash && !isTxHashFor(network, sourceTxHash)) return { ok: false, error: `That is not a valid ${NETWORKS[network].chain} transaction hash` };
    const tx: LedgerTx = {
      id: txId(), kind: 'deposit', asset, amount, status: 'pending', confirmations: 0, required: cfg.confirmations,
      hash: sourceTxHash?.trim() || (network === 'TRC20' ? randomHex(64) : txHash()), createdAt: Date.now(), address: depositAddressFor(network, stateRef.current.depositAddress), network,
    };
    dispatch({ type: 'tx', tx });
    return { ok: true, tx };
  }, []);

  const submitWithdraw = useCallback<WalletCtx['submitWithdraw']>((asset, amount, address, network) => {
    const cfg = transferRules(asset, network);
    const bal = asset === 'USDT' ? stateRef.current.usdt : stateRef.current.mbr;
    if (!isAddressFor(network, address)) return { ok: false, error: `Enter a valid ${NETWORKS[network].label} address (${NETWORKS[network].addressHint})` };
    if (!(amount >= cfg.minWithdraw)) return { ok: false, error: `Minimum withdrawal is ${cfg.minWithdraw.toLocaleString()} ${asset}` };
    if (amount + cfg.withdrawFee > bal + 1e-9) return { ok: false, error: `Insufficient ${asset}: amount plus ${cfg.withdrawFee} ${asset} fee exceeds your balance` };
    const tx: LedgerTx = {
      id: txId(), kind: 'withdraw', asset, amount, fee: cfg.withdrawFee, address: address.trim(), status: 'pending',
      confirmations: 0, required: cfg.confirmations, hash: network === 'TRC20' ? randomHex(64) : txHash(), createdAt: Date.now(), network,
    };
    dispatch({ type: 'tx', tx });
    return { ok: true, tx };
  }, []);

  const executeSwap = useCallback<WalletCtx['executeSwap']>((from, amountIn, slippagePct, quotedOut) => {
    const bal = from === 'USDT' ? stateRef.current.usdt : stateRef.current.mbr;
    if (!(amountIn > 0)) return { ok: false, error: 'Enter an amount' };
    if (amountIn > bal + 1e-9) return { ok: false, error: `Insufficient ${from} balance` };
    const price = market.price;
    const q = swapQuote(from, amountIn, price);
    if (from === 'USDT' && amountIn < 1) return { ok: false, error: 'Minimum swap is 1 USDT' };
    if (q.out < quotedOut * (1 - slippagePct / 100)) return { ok: false, error: 'Price moved beyond your slippage tolerance. Review the new quote and try again.' };
    market.applyTrade(q.usd, from === 'USDT' ? 'buy' : 'sell', q.impact);
    const tx: LedgerTx = {
      id: txId(), kind: 'swap', asset: from, amount: amountIn, toAsset: from === 'USDT' ? 'MBR' : 'USDT',
      toAmount: round(q.out, from === 'USDT' ? 2 : 4), price, tax: q.tax, status: 'completed', hash: txHash(), createdAt: Date.now(),
    };
    dispatch({ type: 'tx', tx });
    setStats(market.stats());
    setMarketVersion((v) => v + 1);
    return { ok: true, tx };
  }, [market]);

  const resetDemo = useCallback(() => {
    try {
      localStorage.removeItem(storageKey(user.id));
    } catch {
      /* ignore */
    }
    dispatch({ type: 'reset', state: user.tier1Count > 0 || user.mbrBalance > 1000 ? seedDemo(user, market) : emptyState(user.id, Math.random) });
  }, [user, market]);

  const value = useMemo<WalletCtx>(
    () => ({ state, market, stats, price: stats.price, marketVersion, submitDeposit, submitWithdraw, executeSwap, resetDemo }),
    [state, market, stats, marketVersion, submitDeposit, submitWithdraw, executeSwap, resetDemo],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useWallet = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useWallet must be used inside WalletProvider');
  return c;
};
