import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownToLine, ArrowDownUp, ArrowRight, ArrowUpFromLine, ChevronDown, LifeBuoy, MessageSquareText, Search, Wallet } from 'lucide-react';
import { FAQ, HELP_CATEGORIES, type HelpCategory } from '../helpData';
import { NETWORKS } from '../config';
import { SpotlightCard, cx } from '../ui';
import { EmptyIllustration } from '../illustrations';
import type { OverviewActions } from './OverviewSection';

const GUIDES = [
  {
    title: 'Buy MBR with USDT',
    icon: ArrowDownToLine,
    steps: ['Buy USDT on Binance (Spot or P2P)', 'Deposit USDT here on TRC-20, BEP-20 or ERC-20', 'Swap USDT → MBR and start earning'],
    cta: 'Deposit USDT',
    action: 'deposit' as const,
  },
  {
    title: 'Cash out to your bank',
    icon: ArrowUpFromLine,
    steps: ['Swap MBR → USDT', 'Withdraw USDT to your Binance address', 'Sell USDT on Binance P2P for cash'],
    cta: 'Sell MBR',
    action: 'sell' as const,
  },
];

export const HelpSection: React.FC<Pick<OverviewActions, 'openFunds' | 'openSwap' | 'go'> & { focusId?: string | null }> = ({ openFunds, openSwap, go, focusId }) => {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState<HelpCategory | 'All'>('All');
  const [openId, setOpenId] = useState<string | null>(focusId ?? null);

  useEffect(() => {
    if (!focusId) return;
    setOpenId(focusId);
    setCat('All');
    setQ('');
    setTimeout(() => document.getElementById(`faq-${focusId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250);
  }, [focusId]);

  const items = useMemo(() => {
    const t = q.trim().toLowerCase();
    return FAQ.filter((f) => (cat === 'All' || f.category === cat) && (!t || `${f.q} ${f.a}`.toLowerCase().includes(t)));
  }, [q, cat]);

  return (
    <div className="space-y-5">
      <SpotlightCard className="overflow-hidden" beam>
        <span className="d-aurora d-aurora-1" />
        <span className="d-aurora d-aurora-2" />
        <div className="relative px-6 py-8 text-center sm:py-10">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">How can we help?</h2>
          <p className="t-muted mt-2 text-sm">Search answers about deposits, swaps, rewards and your account.</p>
          <label className="relative mx-auto mt-5 block max-w-xl">
            <Search className="t-muted absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. TRC-20 deposit, withdrawal fee, referral" className="d-input !rounded-full !py-3.5 pl-11 !text-sm" />
          </label>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {['Wrong network', 'Withdrawal fee', 'Slippage', 'Referral'].map((s) => (
              <button key={s} onClick={() => setQ(s)} className="d-chip hover:border-[var(--d-gold)]">{s}</button>
            ))}
          </div>
        </div>
      </SpotlightCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        {HELP_CATEGORIES.map((c, i) => {
          const count = FAQ.filter((f) => f.category === c.id).length;
          const active = cat === c.id;
          return (
            <SpotlightCard key={c.id} hover delay={i * 0.04} className={cx('group', active && '!border-[var(--d-gold)]')}>
              <button onClick={() => setCat(active ? 'All' : c.id)} className="h-full w-full p-4 text-left">
                <div className="text-sm font-semibold">{c.id}</div>
                <div className="t-muted mt-1 text-xs">{c.blurb}</div>
                <div className="t-gold mt-2 text-[11px] font-semibold">{count} articles</div>
              </button>
            </SpotlightCard>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <SpotlightCard className="p-2 lg:col-span-2">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="text-sm font-semibold">{cat === 'All' ? 'Frequently asked' : cat} <span className="t-muted font-normal">· {items.length}</span></div>
            {(cat !== 'All' || q) && <button onClick={() => { setCat('All'); setQ(''); }} className="t-muted text-xs hover:text-[var(--d-text)]">Clear</button>}
          </div>
          {items.length === 0 ? (
            <div className="py-8 text-center">
              <EmptyIllustration className="mx-auto h-28 w-auto" />
              <div className="mt-2 font-semibold">No answers for “{q}”</div>
              <button className="d-btn d-btn-primary mt-4" onClick={() => go('support')}>Ask support instead</button>
            </div>
          ) : (
            <ul>
              {items.map((f) => {
                const open = openId === f.id;
                return (
                  <li key={f.id} id={`faq-${f.id}`} className="border-t first:border-t-0">
                    <button onClick={() => setOpenId(open ? null : f.id)} className="flex w-full items-center gap-3 px-3 py-3.5 text-left" aria-expanded={open}>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">{f.q}</span>
                        <span className="t-muted text-[11px]">{f.category}</span>
                      </span>
                      <ChevronDown className={cx('t-muted h-4 w-4 shrink-0 transition-transform', open && 'rotate-180')} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="t-soft px-3 pb-4 text-sm leading-relaxed">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          )}
        </SpotlightCard>

        <div className="space-y-5">
          {GUIDES.map((g, gi) => {
            const Icon = g.icon;
            return (
              <SpotlightCard key={g.title} className="p-5" delay={gi * 0.08}>
                <div className="flex items-center gap-2 text-sm font-semibold"><Icon className="t-gold h-4 w-4" /> {g.title}</div>
                <ol className="mt-3 space-y-2">
                  {g.steps.map((s, i) => (
                    <li key={s} className="flex items-start gap-2.5 text-xs t-soft">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[rgba(226,181,76,0.14)] text-[10px] font-bold t-gold">{i + 1}</span>
                      <span className="pt-0.5">{s}</span>
                    </li>
                  ))}
                </ol>
                <button onClick={() => (g.action === 'deposit' ? openFunds('deposit', 'USDT') : openSwap('MBR'))} className="t-gold mt-3 flex items-center gap-1 text-xs font-semibold hover:underline">
                  {g.cta} <ArrowRight className="h-3 w-3" />
                </button>
              </SpotlightCard>
            );
          })}

          <SpotlightCard className="p-5" delay={0.16}>
            <div className="text-sm font-semibold">System status</div>
            <ul className="mt-3 space-y-2 text-xs">
              {[
                ...Object.values(NETWORKS).map((n) => ({ k: `${n.label} deposits & withdrawals`, icon: Wallet })),
                { k: 'Swap engine (USDT ⇄ MBR)', icon: ArrowDownUp },
              ].map((s) => (
                <li key={s.k} className="flex items-center justify-between gap-2">
                  <span className="t-soft flex items-center gap-2"><s.icon className="t-muted h-3.5 w-3.5" />{s.k}</span>
                  <span className="t-up flex items-center gap-1.5 font-medium"><span className="d-pulse-dot" /> Operational</span>
                </li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-5" delay={0.24}>
            <div className="flex items-center gap-2 text-sm font-semibold"><LifeBuoy className="t-gold h-4 w-4" /> Still need help?</div>
            <p className="t-muted mt-1 text-xs">Our team usually replies within 2 hours.</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="d-btn d-btn-primary" onClick={() => go('support')}>Open a ticket</button>
              <button className="d-btn d-btn-ghost" onClick={() => go('feedback')}><MessageSquareText className="h-3.5 w-3.5" /> Feedback</button>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
