// Header chrome: command palette (Ctrl/⌘ K), notifications, privacy toggle, profile menu, toasts.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowDownToLine,
  ArrowDownUp,
  ArrowUpFromLine,
  Bell,
  BellOff,
  CheckCheck,
  CheckCircle2,
  Copy,
  CornerDownLeft,
  EyeOff,
  Gift,
  Globe,
  HelpCircle,
  LifeBuoy,
  LogOut,
  Megaphone,
  Moon,
  Search,
  Settings as SettingsIcon,
  ShieldCheck,
  Sparkles,
  Sun,
  XCircle,
} from 'lucide-react';
import { useWallet, type LedgerTx } from './state/WalletProvider';
import { useAccount } from './state/account';
import { useTheme } from './theme';
import { FAQ } from './helpData';
import { NETWORKS, fmtNum, fmtPrice, shortAddr, timeAgo, type Asset } from './config';
import { FlashValue, cx } from './ui';
import type { SectionId } from './DashboardPage';

// ---------------------------------------------------------------------------
// Popover shell
// ---------------------------------------------------------------------------
const usePopover = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
};

const Panel: React.FC<{ open: boolean; children: React.ReactNode; className?: string }> = ({ open, children, className }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -6, scale: 0.98 }}
        transition={{ duration: 0.16 }}
        data-lenis-prevent
        className={cx('absolute right-0 top-full z-50 mt-2 origin-top-right rounded-2xl border bg-surface shadow-2xl', className)}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export const IconButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }>(({ className, active, ...rest }, ref) => (
  <button
    ref={ref}
    {...rest}
    className={cx('relative flex h-9 w-9 items-center justify-center rounded-full border bg-surface-2 transition-colors hover:border-[var(--d-line-strong)] hover:text-[var(--d-text)]', active ? 't-gold' : 't-soft', className)}
  />
));

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
interface Notice {
  id: string;
  icon: React.ElementType;
  tone: string;
  title: string;
  body: string;
  at: number;
  go: SectionId;
}

const ANNOUNCEMENTS: Notice[] = [
  { id: 'ann-networks', icon: Megaphone, tone: 't-blue', title: 'TRC-20 and ERC-20 deposits are live', body: 'Deposit and withdraw USDT on Tron, BNB Smart Chain or Ethereum.', at: Date.parse('2026-10-27T10:00:00Z'), go: 'overview' },
  { id: 'ann-help', icon: LifeBuoy, tone: 't-gold', title: 'New: Help center and support tickets', body: 'Search answers or open a ticket from the sidebar.', at: Date.parse('2026-10-28T08:00:00Z'), go: 'help' },
];

function txNotice(t: LedgerTx): Notice | null {
  const net = t.network ? ` via ${NETWORKS[t.network].label}` : '';
  const amt = `${fmtNum(t.amount, t.asset === 'USDT' ? 2 : 0)} ${t.asset}`;
  switch (t.kind) {
    case 'deposit':
      return t.status === 'completed'
        ? { id: t.id, icon: ArrowDownToLine, tone: 't-up', title: 'Deposit confirmed', body: `${amt} credited${net}`, at: t.createdAt, go: 'transactions' }
        : { id: t.id, icon: ArrowDownToLine, tone: 't-gold', title: 'Deposit processing', body: `${amt}${net} · ${t.confirmations ?? 0}/${t.required} confirmations`, at: t.createdAt, go: 'transactions' };
    case 'withdraw':
      return { id: t.id, icon: ArrowUpFromLine, tone: t.status === 'completed' ? 't-up' : 't-gold', title: t.status === 'completed' ? 'Withdrawal sent' : 'Withdrawal processing', body: `${amt} to ${shortAddr(t.address ?? '')}`, at: t.createdAt, go: 'transactions' };
    case 'swap':
      return { id: t.id, icon: ArrowDownUp, tone: 't-blue', title: 'Swap completed', body: `${amt} → ${fmtNum(t.toAmount ?? 0, t.toAsset === 'USDT' ? 2 : 0)} ${t.toAsset}`, at: t.createdAt, go: 'transactions' };
    case 'referral_reward':
      return { id: t.id, icon: Gift, tone: 't-gold', title: `Level ${t.level} referral reward`, body: `+${fmtNum(t.amount, 2)} MBR from ${t.from}`, at: t.createdAt, go: 'team' };
    case 'holding_reward':
      return { id: t.id, icon: Sparkles, tone: 't-up', title: 'Holding reward', body: `+${fmtNum(t.amount, 2)} MBR`, at: t.createdAt, go: 'rewards' };
  }
}

export const NotificationsMenu: React.FC<{ go: (s: SectionId) => void }> = ({ go }) => {
  const { state } = useWallet();
  const { account, markNotificationsRead } = useAccount();
  const { open, setOpen, ref } = usePopover();
  const n = account.settings.notify;

  const items = useMemo(() => {
    const allow: Record<LedgerTx['kind'], boolean> = { deposit: n.deposits, withdraw: n.withdrawals, swap: n.swaps, referral_reward: n.referral, holding_reward: n.holding };
    const since = Date.now() - 14 * 86_400_000;
    const fromTx = state.txs.filter((t) => allow[t.kind] && t.createdAt > since).slice(0, 25).map(txNotice).filter(Boolean) as Notice[];
    return [...fromTx, ...(n.announcements ? ANNOUNCEMENTS : [])].sort((a, b) => b.at - a.at).slice(0, 25);
  }, [state.txs, n]);
  const unread = items.filter((i) => i.at > account.notifReadAt).length;

  return (
    <div ref={ref} className="relative">
      <IconButton aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`} title="Notifications" onClick={() => setOpen((o) => !o)} active={open}>
        <motion.span animate={unread ? { rotate: [0, -14, 12, -8, 0] } : {}} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 6 }}>
          <Bell className="h-4 w-4" />
        </motion.span>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--d-down)] px-1 text-[10px] font-bold text-white ring-2 ring-[var(--d-bg)]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </IconButton>
      <Panel open={open} className="w-[min(92vw,380px)]">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="text-sm font-semibold">Notifications</div>
          <button disabled={!unread} onClick={markNotificationsRead} className="t-gold flex items-center gap-1 text-xs font-semibold disabled:opacity-40">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        </div>
        <ul className="d-scroll max-h-[420px] overflow-y-auto py-1">
          {items.length === 0 && (
            <li className="t-muted flex flex-col items-center gap-2 py-10 text-sm"><BellOff className="h-6 w-6" /> You’re all caught up</li>
          )}
          {items.map((it) => {
            const Icon = it.icon;
            const isNew = it.at > account.notifReadAt;
            return (
              <li key={it.id}>
                <button onClick={() => { go(it.go); setOpen(false); }} className="flex w-full gap-3 px-4 py-2.5 text-left transition-colors hover:bg-surface-2">
                  <span className={cx('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2', it.tone)}><Icon className="h-4 w-4" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2 text-sm font-medium">{it.title}{isNew && <span className="h-1.5 w-1.5 rounded-full bg-[var(--d-gold)]" />}</span>
                    <span className="t-muted block truncate text-xs">{it.body}</span>
                  </span>
                  <span className="t-muted shrink-0 text-[11px]">{timeAgo(it.at)}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button onClick={() => { go('settings'); setOpen(false); }} className="t-muted flex w-full items-center justify-center gap-1.5 border-t py-2.5 text-xs hover:text-[var(--d-text)]">
          <SettingsIcon className="h-3.5 w-3.5" /> Notification settings
        </button>
      </Panel>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Live MBR price ticker (header)
// ---------------------------------------------------------------------------
export const PriceTicker: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { stats, market } = useWallet();
  const minute = Math.floor(Date.now() / 60_000);
  // 24 hourly closes for the sparkline; recomputed once a minute, live price appended
  const closes = useMemo(() => market.candles('1H').slice(-24).map((c) => c.close), [market, minute]);
  const pts = [...closes.slice(0, -1), stats.price];
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const W = 64;
  const H = 26;
  const path = pts.map((p, i) => `${i ? 'L' : 'M'}${((i / (pts.length - 1)) * W).toFixed(1)},${(H - 2 - ((p - min) / (max - min || 1)) * (H - 4)).toFixed(1)}`).join('');
  const up = stats.change24h >= 0;
  const color = up ? 'var(--d-up)' : 'var(--d-down)';
  return (
    <button onClick={onClick} title="Open the MBR chart" className="group hidden items-center gap-3 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-surface-2 xl:flex">
      <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" className="h-7 w-7 rounded-full bg-[#0b2155] object-contain p-0.5" />
      <span className="text-left leading-tight">
        <span className="t-muted block text-[10px] font-semibold tracking-wide">MBR / USDT</span>
        <FlashValue value={stats.price} className="font-display text-sm font-bold">{fmtPrice(stats.price)}</FlashValue>
      </span>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="tk-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={up ? '#22c08a' : '#f0616d'} stopOpacity={0.25} />
            <stop offset="100%" stopColor={up ? '#22c08a' : '#f0616d'} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`${path}L${W},${H}L0,${H}Z`} fill="url(#tk-fill)" />
        <path d={path} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
      <span className={cx('flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold', up ? 'bg-[rgba(34,192,138,0.12)] t-up' : 'bg-[rgba(240,97,109,0.12)] t-down')}>
        {up ? '▲' : '▼'} {Math.abs(stats.change24h * 100).toFixed(2)}%
      </span>
    </button>
  );
};

// ---------------------------------------------------------------------------
// Command palette
// ---------------------------------------------------------------------------
interface Cmd {
  id: string;
  group: 'Go to' | 'Actions' | 'Help';
  label: string;
  hint?: string;
  icon: React.ElementType;
  run: () => void;
}

export const CommandPalette: React.FC<{
  nav: { id: SectionId; label: string; icon: React.ElementType }[];
  go: (s: SectionId) => void;
  openFunds: (mode: 'deposit' | 'withdraw', asset: Asset) => void;
  openSwap: (from: Asset) => void;
  referralLink: string;
  onHelpArticle: (id: string) => void;
}> = ({ nav, go, openFunds, openSwap, referralLink, onHelpArticle }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const { toast, updateSettings } = useAccount();
  const { theme, setPref } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === '/' && !(e.target as HTMLElement)?.closest('input,textarea,select,[contenteditable]')) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const all = useMemo<Cmd[]>(
    () => [
      ...nav.map((n) => ({ id: `go-${n.id}`, group: 'Go to' as const, label: n.label, icon: n.icon, run: () => go(n.id) })),
      { id: 'a-dep', group: 'Actions', label: 'Deposit USDT', hint: 'TRC-20 · BEP-20 · ERC-20', icon: ArrowDownToLine, run: () => openFunds('deposit', 'USDT') },
      { id: 'a-wd', group: 'Actions', label: 'Withdraw USDT', icon: ArrowUpFromLine, run: () => openFunds('withdraw', 'USDT') },
      { id: 'a-buy', group: 'Actions', label: 'Buy MBR with USDT', icon: ArrowDownUp, run: () => openSwap('USDT') },
      { id: 'a-sell', group: 'Actions', label: 'Sell MBR for USDT', icon: ArrowDownUp, run: () => openSwap('MBR') },
      { id: 'a-depm', group: 'Actions', label: 'Deposit MBR', icon: ArrowDownToLine, run: () => openFunds('deposit', 'MBR') },
      { id: 'a-ticket', group: 'Actions', label: 'Open a support ticket', icon: LifeBuoy, run: () => go('support') },
      {
        id: 'a-ref', group: 'Actions', label: 'Copy referral link', icon: Copy,
        run: async () => {
          try {
            await navigator.clipboard.writeText(referralLink);
            toast('Referral link copied');
          } catch {
            toast('Copy failed: clipboard blocked', 'down');
          }
        },
      },
      { id: 'a-theme', group: 'Actions', label: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', icon: theme === 'dark' ? Sun : Moon, run: () => setPref(theme === 'dark' ? 'light' : 'dark') },
      { id: 'a-hide', group: 'Actions', label: 'Hide / show balances', icon: EyeOff, run: () => updateSettings((s) => ({ ...s, prefs: { ...s.prefs, hideBalances: !s.prefs.hideBalances } })) },
      ...FAQ.map((f) => ({ id: `h-${f.id}`, group: 'Help' as const, label: f.q, hint: f.category, icon: HelpCircle, run: () => onHelpArticle(f.id) })),
    ],
    [nav, go, openFunds, openSwap, referralLink, toast, theme, setPref, updateSettings, onHelpArticle],
  );

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return all.filter((c) => c.group !== 'Help').concat(all.filter((c) => c.group === 'Help').slice(0, 3));
    return all.filter((c) => `${c.label} ${c.hint ?? ''}`.toLowerCase().includes(term)).slice(0, 14);
  }, [all, q]);

  const run = (c: Cmd) => {
    setOpen(false);
    c.run();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="t-muted flex h-9 items-center gap-2 rounded-full border bg-surface-2 px-3 text-xs transition-colors hover:border-[var(--d-line-strong)] hover:text-[var(--d-text)] xl:w-60"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
        <span className="hidden flex-1 text-left xl:inline">Search or jump to…</span>
        <kbd className="hidden rounded border bg-surface px-1.5 font-sans text-[10px] xl:inline">Ctrl K</kbd>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[90] flex items-start justify-center bg-[var(--d-overlay)] p-4 pt-[12vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
            <motion.div initial={{ y: -12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} exit={{ y: -12, scale: 0.98 }} className="d-card w-full max-w-xl overflow-hidden" role="dialog" aria-label="Command palette">
              <div className="flex items-center gap-3 border-b px-4">
                <Search className="t-muted h-4 w-4" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setIdx(0); }}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, results.length - 1)); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)); }
                    else if (e.key === 'Enter' && results[idx]) run(results[idx]);
                    else if (e.key === 'Escape') setOpen(false);
                  }}
                  placeholder="Search pages, actions and help…"
                  className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-[var(--d-placeholder)]"
                />
                <kbd className="t-muted rounded border px-1.5 text-[10px]">Esc</kbd>
              </div>
              <ul className="d-scroll max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
                {results.length === 0 && <li className="t-muted py-10 text-center text-sm">No results for “{q}”</li>}
                {results.map((c, i) => {
                  const Icon = c.icon;
                  const header = i === 0 || results[i - 1].group !== c.group;
                  return (
                    <React.Fragment key={c.id}>
                      {header && <li className="t-muted px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider">{c.group}</li>}
                      <li>
                        <button onMouseEnter={() => setIdx(i)} onClick={() => run(c)} className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm', i === idx ? 'bg-surface-2 text-[var(--d-text)]' : 't-soft')}>
                          <Icon className={cx('h-4 w-4 shrink-0', i === idx && 't-gold')} />
                          <span className="min-w-0 flex-1 truncate">{c.label}</span>
                          {c.hint && <span className="t-muted shrink-0 text-[11px]">{c.hint}</span>}
                          {i === idx && <CornerDownLeft className="t-muted h-3.5 w-3.5 shrink-0" />}
                        </button>
                      </li>
                    </React.Fragment>
                  );
                })}
              </ul>
              <div className="t-muted flex gap-4 border-t px-4 py-2 text-[11px]">
                <span>↑↓ to move</span><span>Enter to open</span><span>Ctrl K or / to toggle</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ---------------------------------------------------------------------------
// Toasts
// ---------------------------------------------------------------------------
export const Toaster: React.FC = () => {
  const { toasts } = useAccount();
  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[95] flex flex-col items-end gap-2 lg:bottom-6">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 20 }} className="d-card flex items-center gap-2 px-4 py-3 text-sm font-medium shadow-2xl">
            {t.tone === 'down' ? <XCircle className="t-down h-4 w-4" /> : <CheckCircle2 className={cx('h-4 w-4', t.tone === 'gold' ? 't-gold' : 't-up')} />}
            {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
