import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowDownToLine,
  BookUser,
  Clock3,
  Eye,
  EyeOff,
  LifeBuoy,
  ShieldAlert,
  ArrowDownUp,
  ArrowRight,
  ArrowUpFromLine,
  Coins,
  Gift,
  Landmark,
  PieChart,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { useWallet } from '../state/WalletProvider';
import { usePortfolioHistory } from '../state/history';
import { DASH, dayKey, fmtCompactUsd, fmtNum, fmtPct, fmtUsd, type Asset } from '../config';
import { NumberTicker, Reveal, Sparkline, SpotlightCard, cx } from '../ui';
import { EmptyIllustration, GrowthIllustration } from '../illustrations';
import { TradingChart } from '../TradingChart';
import { SwapPanel } from '../SwapPanel';
import { TxRow } from './TransactionsSection';
import type { FundsMode } from '../FundsModal';
import type { SectionId, SettingsTab } from '../nav';
import { useAccount } from '../state/account';

export interface OverviewActions {
  openFunds: (mode: FundsMode, asset: Asset) => void;
  openSwap: (from?: Asset) => void;
  go: (s: SectionId) => void;
  openSettings?: (t: SettingsTab) => void;
}

const usd2 = (v: number) => fmtUsd(v);
const mbr0 = (v: number) => fmtNum(v, 0);
const mbr2 = (v: number) => fmtNum(v, 2);
const LEVEL_COLORS = ['#e2b54c', '#c084fc', '#38bdf8'];

/** One quiet, uniform KPI tile: label, value, one line of context, one footer visual. Whole tile is the action. */
const StatCard: React.FC<{
  label: string;
  icon: React.ElementType;
  value: React.ReactNode;
  sub: React.ReactNode;
  footer: React.ReactNode;
  onClick: () => void;
  hint: string;
  tone?: string;
  delay?: number;
  accent: string;
}> = ({ label, icon: Icon, value, sub, footer, onClick, hint, tone, delay, accent }) => (
  <SpotlightCard className="group h-full" hover delay={delay}>
    <button onClick={onClick} title={hint} className="flex h-full w-full flex-col p-5 text-left">
      <div className="flex items-center justify-between">
        <span className="t-muted text-[13px] font-medium">{label}</span>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105" style={{ background: `${accent}1f`, color: accent }}>
          <Icon className="d-icon-tilt h-[18px] w-[18px]" />
        </span>
      </div>
      <div className={cx('d-sensitive mt-3 truncate font-display text-[26px] font-bold leading-tight tracking-tight', tone)}>{value}</div>
      <div className="d-sensitive t-muted mt-1 truncate text-xs">{sub}</div>
      <div className="mt-auto pt-4">{footer}</div>
    </button>
  </SpotlightCard>
);

/** Two inline figures separated by a hairline: used for in/out style footers. */
const Pair: React.FC<{ a: [string, React.ReactNode]; b: [string, React.ReactNode] }> = ({ a, b }) => (
  <div className="flex h-10 items-center border-t pt-3 text-xs">
    {[a, b].map(([k, v], i) => (
      <div key={k} className={cx('flex-1', i === 1 && 'border-l pl-3')}>
        <span className="t-muted">{k}</span> <span className="font-semibold">{v}</span>
      </div>
    ))}
  </div>
);

const BalanceHero: React.FC<OverviewActions & { change: number; series: number[] }> = ({ change, series, ...actions }) => {
  const { state, price } = useWallet();
  const { account, updateSettings } = useAccount();
  const hidden = account.settings.prefs.hideBalances;
  const value = state.usdt + state.mbr * price;
  return (
    <SpotlightCard className="overflow-hidden" beam>
      <span className="d-aurora d-aurora-1" />
      <span className="d-aurora d-aurora-2" />
      <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 space-y-5">
          <div>
          <div className="t-muted flex items-center gap-1.5 text-sm font-medium">
            Total balance
            <button
              onClick={() => updateSettings((x) => ({ ...x, prefs: { ...x.prefs, hideBalances: !x.prefs.hideBalances } }))}
              title={hidden ? 'Show balances' : 'Hide balances'}
              aria-label={hidden ? 'Show balances' : 'Hide balances'}
              aria-pressed={hidden}
              className="flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-surface-2 hover:text-[var(--d-text)]"
            >
              {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <div className="mt-1 flex flex-wrap items-baseline gap-3">
            <NumberTicker value={value} format={usd2} className="d-sensitive font-display text-4xl font-bold tracking-tight sm:text-[44px]" />
            <span className={cx('d-chip', change >= 0 ? 'd-chip-up' : 'd-chip-down')}>{fmtPct(change)} 24h</span>
          </div>
          <div className="d-sensitive t-soft mt-2 text-sm">
            {fmtNum(state.usdt, 2)} <span className="t-muted">USDT</span>
            <span className="t-muted mx-2">·</span>
            {fmtNum(state.mbr, 0)} <span className="t-muted">MBR</span>
          </div>
          </div>
          <ActionRow {...actions} />
        </div>
        <GrowthIllustration className="hidden h-44 w-auto shrink-0 md:block lg:h-52" />
      </div>
      <div className="relative -mt-4 opacity-80">
        <Sparkline id="hero" data={series} color="#e2b54c" height={56} />
      </div>
    </SpotlightCard>
  );
};

/** Money actions as one compact row inside the balance card: always one tap away, never louder than the balance. */
const ACTIONS: { label: string; icon: React.ElementType; accent: string; primary?: boolean; run: (a: OverviewActions) => void }[] = [
  { label: 'Deposit', icon: ArrowDownToLine, accent: '#d9a83a', primary: true, run: (a) => a.openFunds('deposit', 'USDT') },
  { label: 'Buy MBR', icon: ArrowDownUp, accent: '#16a34a', run: (a) => a.openSwap('USDT') },
  { label: 'Sell MBR', icon: ArrowDownUp, accent: '#e11d48', run: (a) => a.openSwap('MBR') },
  { label: 'Withdraw', icon: ArrowUpFromLine, accent: '#2563eb', run: (a) => a.openFunds('withdraw', 'USDT') },
];

const ActionRow: React.FC<OverviewActions> = (actions) => (
  <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
    {ACTIONS.map((q) => {
      const Icon = q.icon;
      return q.primary ? (
        <button key={q.label} onClick={() => q.run(actions)} className="d-btn d-btn-primary !h-10 shrink-0 !rounded-full !pl-1.5 !pr-4">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/40"><Icon className="h-4 w-4" /></span>
          {q.label}
        </button>
      ) : (
        <button key={q.label} onClick={() => q.run(actions)} className="group flex h-10 shrink-0 items-center gap-2 rounded-full border bg-surface pl-1.5 pr-4 text-[13px] font-semibold transition-all hover:-translate-y-0.5 hover:border-[var(--d-line-strong)] hover:shadow-sm">
          <span className="flex h-7 w-7 items-center justify-center rounded-full transition-transform group-hover:scale-110" style={{ background: `${q.accent}1f`, color: q.accent }}><Icon className="h-4 w-4" /></span>
          {q.label}
        </button>
      );
    })}
  </div>
);

const greeting = () => {
  const h = new Date().getHours();
  return h < 5 ? 'Good evening' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
};

/** Greeting + a plain-language summary + chips for the things that need the user. */
const Greeting: React.FC<OverviewActions & { userName: string }> = ({ userName, go, openSwap, openSettings }) => {
  const { state } = useWallet();
  const { account } = useAccount();
  const hist = usePortfolioHistory(2);
  const today = state.rewardDays[dayKey(Date.now())] ?? { holding: 0, referral: 0 };
  const change = hist.length > 1 && hist[0].value > 0 ? hist[1].value / hist[0].value - 1 : 0;
  const processing = state.txs.filter((t) => t.status === 'pending' || t.status === 'processing').length;
  const awaiting = account.tickets.filter((t) => t.status === 'awaiting').length;
  const todos: { key: string; label: string; icon: React.ElementType; tone: string; run: () => void }[] = [];
  if (!account.settings.security.twoFA) todos.push({ key: '2fa', label: 'Turn on 2FA', icon: ShieldAlert, tone: 'd-chip-down', run: () => openSettings?.('security') });
  if (awaiting) todos.push({ key: 'tk', label: `Support replied to ${awaiting} ticket${awaiting > 1 ? 's' : ''}`, icon: LifeBuoy, tone: 'd-chip-gold', run: () => go('support') });
  if (processing) todos.push({ key: 'pr', label: `${processing} transfer${processing > 1 ? 's' : ''} processing`, icon: Clock3, tone: 'd-chip-blue', run: () => go('transactions') });
  if (state.usdt >= 5) todos.push({ key: 'idle', label: `${fmtUsd(state.usdt)} USDT ready to swap`, icon: ArrowDownUp, tone: 'd-chip-up', run: () => openSwap('USDT') });
  if (!account.addresses.length) todos.push({ key: 'ab', label: 'Save a withdrawal address', icon: BookUser, tone: '', run: () => openSettings?.('addresses') });
  const first = userName.split(' ')[0];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <h2 className="flex items-center gap-2 font-display text-2xl font-bold tracking-tight sm:text-[28px]">
          {greeting()}, {first}
          <motion.span className="inline-block origin-[70%_70%]" animate={{ rotate: [0, 16, -8, 14, -4, 10, 0] }} transition={{ duration: 1.6, delay: 0.4, repeat: Infinity, repeatDelay: 5 }}>👋</motion.span>
        </h2>
        <p className="t-soft mt-1 text-sm">
          Your balance is <b className={change >= 0 ? 't-up' : 't-down'}>{change >= 0 ? 'up' : 'down'} {fmtPct(Math.abs(change)).replace('+', '')}</b> today, you earned <b className="t-gold">{fmtNum(today.holding + today.referral, 0)} MBR</b> in rewards
          {todos.length ? <>, and <b>{todos.length} thing{todos.length > 1 ? 's' : ''}</b> need{todos.length > 1 ? '' : 's'} you.</> : '. You’re all set.'}
        </p>
      </div>
      {todos.length > 0 && (
        <div className="flex flex-wrap gap-2 lg:justify-end">
          {todos.map((t, i) => (
            <motion.button key={t.key} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} whileHover={{ y: -2 }} onClick={t.run} className={cx('d-chip !px-3 !py-1.5 !text-xs', t.tone)}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export const OverviewCards: React.FC<OverviewActions> = ({ openFunds, openSwap, go }) => {
  const { state, price } = useWallet();
  const hist = usePortfolioHistory(30);
  const value = state.usdt + state.mbr * price;
  const dayAgo = hist.length > 1 ? hist[hist.length - 2].value : value;
  const change = dayAgo > 0 ? value / dayAgo - 1 : 0;
  const pending = (a: Asset) => state.txs.filter((t) => t.asset === a && (t.status === 'pending' || t.status === 'processing')).length;
  const today = state.rewardDays[dayKey(Date.now())] ?? { holding: 0, referral: 0 };
  const share = state.mbr / DASH.totalSupply;
  const refTotal = state.referralByLevel.reduce((a, b) => a + b, 0) || 1;
  const pendingNote = (a: Asset) => (pending(a) ? <span className="t-gold"> · {pending(a)} pending</span> : null);

  return (
    <div className="space-y-5">
      <BalanceHero openFunds={openFunds} openSwap={openSwap} go={go} change={change} series={hist.map((h) => h.value)} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          delay={0.00}
          accent="#2563eb"
          label="USDT Deposit / Withdrawal"
          icon={Landmark}
          hint="Deposit or withdraw USDT"
          onClick={() => openFunds('deposit', 'USDT')}
          value={<NumberTicker value={state.usdt} format={usd2} />}
          sub={<>Available to swap{pendingNote('USDT')}</>}
          footer={<Pair a={['In', <span className="t-up">{fmtCompactUsd(state.usdtDeposited)}</span>]} b={['Out', <span className="t-down">{fmtCompactUsd(state.usdtWithdrawn)}</span>]} />}
        />
        <StatCard
          delay={0.07}
          accent="#0ea5a4"
          label="Swap"
          icon={ArrowDownUp}
          hint="Swap USDT and MBR"
          onClick={() => openSwap('USDT')}
          value={<NumberTicker value={state.spentUsdt + state.receivedUsdt} format={usd2} />}
          sub="Lifetime USDT ⇄ MBR volume"
          footer={<Pair a={['Bought', <span className="t-up">{fmtNum(state.boughtMbr)}</span>]} b={['Sold', <span className="t-down">{fmtNum(state.soldMbr)}</span>]} />}
        />
        <StatCard
          delay={0.14}
          accent="#7c3aed"
          label="MBR Deposit / Withdrawal"
          icon={Wallet}
          hint="Deposit or withdraw MBR"
          onClick={() => openFunds('deposit', 'MBR')}
          value={<>{fmtNum(state.mbrDeposited - state.mbrWithdrawn)} <span className="t-muted text-base font-semibold">MBR</span></>}
          sub={<>Net transfers with outside wallets{pendingNote('MBR')}</>}
          footer={<Pair a={['In', <span className="t-up">{fmtNum(state.mbrDeposited)}</span>]} b={['Out', <span className="t-down">{fmtNum(state.mbrWithdrawn)}</span>]} />}
        />
        <StatCard
          delay={0.21}
          accent="#d9a83a"
          label="MBR Balance"
          icon={Coins}
          hint="Open portfolio"
          onClick={() => go('portfolio')}
          value={<NumberTicker value={state.mbr} format={mbr2} />}
          sub={<>≈ <NumberTicker value={state.mbr * price} format={usd2} /></>}
          footer={<Sparkline id="mbr" data={hist.map((h) => h.mbr)} color="#e2b54c" height={40} />}
        />
        <StatCard
          delay={0.28}
          accent="#4f8bff"
          label="Portfolio Value"
          icon={PieChart}
          hint="Open portfolio"
          onClick={() => go('portfolio')}
          value={<NumberTicker value={value} format={usd2} />}
          sub={<span className={change >= 0 ? 't-up' : 't-down'}>{fmtPct(change)} last 24h</span>}
          footer={<Sparkline id="pv" data={hist.map((h) => h.value)} color="#4f8bff" height={40} />}
        />
        <StatCard
          delay={0.35}
          accent="#16a34a"
          label="Holding Reward"
          icon={Sparkles}
          hint="Open rewards"
          onClick={() => go('rewards')}
          value={<span className="t-up">+<NumberTicker value={state.holdingReward} format={mbr2} /></span>}
          sub={<>MBR · ≈ {fmtUsd(state.holdingReward * price)}</>}
          footer={
            <div className="flex h-10 items-center justify-between border-t pt-3 text-xs">
              <span className="t-up flex items-center gap-2"><span className="d-pulse-dot" /> +{fmtNum(today.holding, 2)} today</span>
              <span className="t-muted">{(share * 100).toFixed(3)}% pool</span>
            </div>
          }
        />
        <StatCard
          delay={0.42}
          accent="#c084fc"
          label="Referral Reward"
          icon={Gift}
          hint="Open team overview"
          onClick={() => go('team')}
          value={<span className="t-gold">+<NumberTicker value={state.referralReward} format={mbr0} /></span>}
          sub={<>MBR from {state.team.length} team members</>}
          footer={
            <div className="flex h-10 flex-col justify-center gap-2 border-t pt-3">
              <div className="flex h-1.5 overflow-hidden rounded-full bg-surface-3">
                {state.referralByLevel.map((v, i) => <div key={i} style={{ width: `${(v / refTotal) * 100}%`, background: LEVEL_COLORS[i] }} />)}
              </div>
              <div className="t-muted flex justify-between text-[11px]">
                {DASH.referralRates.map((r, i) => <span key={i}><span style={{ color: LEVEL_COLORS[i] }}>●</span> L{i + 1} {r * 100}%</span>)}
              </div>
            </div>
          }
        />
        <StatCard
          delay={0.49}
          accent="#e11d48"
          label={`Target Valuation · ${DASH.targetYear}`}
          icon={Target}
          hint="Your MBR at the roadmap target price"
          onClick={() => go('portfolio')}
          value={<span className="t-gold"><NumberTicker value={state.mbr * DASH.targetPrice} format={fmtCompactUsd} /></span>}
          sub={`Your MBR × $${fmtNum(DASH.targetPrice)} target price`}
          footer={<div className="t-muted flex h-10 items-center border-t pt-3 text-[11px]">Roadmap target, not a guarantee</div>}
        />
      </div>
    </div>
  );
};

export const OverviewSection: React.FC<OverviewActions & { userName: string }> = ({ userName, ...actions }) => {
  const { state } = useWallet();
  return (
    <div className="space-y-6">
      <Greeting {...actions} userName={userName} />
      <OverviewCards {...actions} />

      <div className="grid gap-5 xl:grid-cols-12">
        <Reveal className="min-w-0 xl:col-span-8">
          <TradingChart />
        </Reveal>
        <SpotlightCard className="p-5 xl:col-span-4" delay={0.12}>
          <SwapPanel />
        </SpotlightCard>
      </div>

      <SpotlightCard className="p-5">
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recent activity</h3>
          <button onClick={() => actions.go('transactions')} className="t-muted flex items-center gap-1 text-xs hover:text-[var(--d-text)]">View all <ArrowRight className="h-3 w-3" /></button>
        </div>
        {state.txs.length ? (
          <ul className="divide-y divide-[var(--d-line)]">
            {state.txs.slice(0, 6).map((t) => <TxRow key={t.id} tx={t} compact />)}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <EmptyIllustration className="mx-auto mb-3 h-32 w-auto" />
            <div className="font-semibold">No activity yet</div>
            <p className="t-muted mt-1 text-sm">Buy USDT on Binance, deposit it here (TRC-20, BEP-20 or ERC-20), then swap to MBR.</p>
            <button className="d-btn d-btn-primary mt-4" onClick={() => actions.openFunds('deposit', 'USDT')}>Deposit USDT</button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
