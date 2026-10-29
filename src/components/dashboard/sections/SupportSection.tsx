import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, Headset, Paperclip, Plus, RotateCcw, Send, Ticket as TicketIcon } from 'lucide-react';
import { useAccount, type Ticket, type TicketCategory, type TicketStatus } from '../state/account';
import { useWallet } from '../state/WalletProvider';
import { fmtDateTime, fmtNum, timeAgo } from '../config';
import { AnimatedTabs, SectionHeader, SpotlightCard, cx } from '../ui';
import { EmptyIllustration } from '../illustrations';
import { txTitle } from './TransactionsSection';

const STATUS: Record<TicketStatus, { label: string; chip: string }> = {
  open: { label: 'Open', chip: 'd-chip-blue' },
  awaiting: { label: 'Awaiting your reply', chip: 'd-chip-gold' },
  resolved: { label: 'Resolved', chip: 'd-chip-up' },
};
const CATEGORIES: TicketCategory[] = ['Deposit', 'Withdrawal', 'Swap', 'Rewards', 'Referral', 'Account & security', 'Other'];

export const SupportSection: React.FC = () => {
  const { account } = useAccount();
  const [filter, setFilter] = useState<'all' | TicketStatus>('all');
  const [view, setView] = useState<{ kind: 'new' } | { kind: 'ticket'; id: string } | null>(null);
  const list = account.tickets.filter((t) => filter === 'all' || t.status === filter);
  const counts = { open: 0, awaiting: 0, resolved: 0 } as Record<TicketStatus, number>;
  account.tickets.forEach((t) => counts[t.status]++);
  const current = view?.kind === 'ticket' ? account.tickets.find((t) => t.id === view.id) : undefined;

  // Desktop: show the newest ticket by default
  useEffect(() => {
    if (!view && account.tickets.length && window.matchMedia('(min-width: 1024px)').matches) {
      const first = account.tickets.find((t) => t.status === 'awaiting') ?? account.tickets.find((t) => t.status === 'open') ?? account.tickets[0];
      setView({ kind: 'ticket', id: first.id });
    }
  }, [view, account.tickets]);

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Support tickets"
        subtitle="Get help with a deposit, withdrawal, swap or your account."
        right={<button className="d-btn d-btn-primary" onClick={() => setView({ kind: 'new' })}><Plus className="h-4 w-4" /> New ticket</button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, k: 'Average first reply', v: 'Under 2 hours' },
          { icon: TicketIcon, k: 'Open tickets', v: String(counts.open + counts.awaiting) },
          { icon: CheckCircle2, k: 'Resolved', v: String(counts.resolved) },
        ].map((s, i) => (
          <SpotlightCard key={s.k} className="flex items-center gap-3 p-4" delay={i * 0.05}>
            <span className="t-gold flex h-10 w-10 items-center justify-center rounded-xl bg-surface-2"><s.icon className="h-5 w-5" /></span>
            <div><div className="t-muted text-xs">{s.k}</div><div className="font-display text-lg font-bold">{s.v}</div></div>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <SpotlightCard className={cx('overflow-hidden', view && 'hidden lg:block')}>
          <div className="d-scroll overflow-x-auto border-b p-3">
            <AnimatedTabs layoutId="ticket-filter" size="sm" value={filter} onChange={setFilter} tabs={[{ id: 'all', label: 'All' }, { id: 'open', label: `Open ${counts.open || ''}` }, { id: 'awaiting', label: `Your reply ${counts.awaiting || ''}` }, { id: 'resolved', label: 'Resolved' }]} />
          </div>
          {list.length === 0 ? (
            <div className="py-10 text-center">
              <EmptyIllustration className="mx-auto h-28 w-auto" />
              <div className="mt-2 text-sm font-semibold">No tickets here</div>
              <button className="d-btn d-btn-ghost mt-3" onClick={() => setView({ kind: 'new' })}>Create a ticket</button>
            </div>
          ) : (
            <ul className="d-scroll max-h-[560px] overflow-y-auto" data-lenis-prevent>
              {list.map((t) => {
                const active = view?.kind === 'ticket' && view.id === t.id;
                const last = t.messages[t.messages.length - 1];
                return (
                  <li key={t.id}>
                    <button onClick={() => setView({ kind: 'ticket', id: t.id })} className={cx('w-full border-b px-4 py-3 text-left transition-colors', active ? 'bg-[rgba(226,181,76,0.07)]' : 'hover:bg-surface-2')}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="t-muted font-code text-[11px]">{t.number}</span>
                        <span className={cx('d-chip !py-0 !text-[10px]', STATUS[t.status].chip)}>{STATUS[t.status].label}</span>
                      </div>
                      <div className="mt-1 truncate text-sm font-medium">{t.subject}</div>
                      <div className="t-muted mt-0.5 flex justify-between gap-2 text-xs">
                        <span className="truncate">{last.from === 'support' ? 'Support: ' : 'You: '}{last.text}</span>
                        <span className="shrink-0">{timeAgo(t.updatedAt)}</span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </SpotlightCard>

        <SpotlightCard className={cx('min-h-[420px] p-5', !view && 'hidden lg:block')}>
          {view?.kind === 'new' && <NewTicket onDone={(t) => setView({ kind: 'ticket', id: t.id })} onBack={() => setView(null)} />}
          {current && <Thread ticket={current} onBack={() => setView(null)} />}
          {!view && (
            <div className="flex h-full flex-col items-center justify-center py-10 text-center">
              <Headset className="t-gold h-10 w-10" />
              <div className="mt-3 font-semibold">Select a ticket or create a new one</div>
            </div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};

const NewTicket: React.FC<{ onDone: (t: Ticket) => void; onBack: () => void }> = ({ onDone, onBack }) => {
  const { createTicket, toast } = useAccount();
  const { state } = useWallet();
  const [category, setCategory] = useState<TicketCategory>('Deposit');
  const [subject, setSubject] = useState('');
  const [priority, setPriority] = useState<Ticket['priority']>('normal');
  const [txHash, setTxHash] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<string | undefined>();
  const recent = useMemo(() => state.txs.filter((t) => t.kind !== 'holding_reward').slice(0, 12), [state.txs]);

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const t = createTicket({ subject: subject.trim(), category, priority, text: text.trim(), txHash: txHash || undefined, attachment: file });
        toast(`Ticket ${t.number} created`);
        onDone(t);
      }}
    >
      <button type="button" onClick={onBack} className="t-muted flex items-center gap-1 text-xs hover:text-[var(--d-text)] lg:hidden"><ArrowLeft className="h-3.5 w-3.5" /> All tickets</button>
      <div>
        <h3 className="font-display text-lg font-bold">New support ticket</h3>
        <p className="t-muted text-sm">Include the transaction if your question is about a payment. We never ask for passwords or 2FA codes.</p>
      </div>
      <div>
        <div className="t-muted mb-1.5 text-xs font-medium">Topic</div>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button type="button" key={c} onClick={() => setCategory(c)} className={cx('d-chip !py-1 !text-xs', category === c && 'd-chip-gold')}>{c}</button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="t-muted mb-1.5 block text-xs font-medium">Subject</span>
        <input className="d-input" maxLength={90} placeholder="e.g. Deposit not credited after 30 minutes" value={subject} onChange={(e) => setSubject(e.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="t-muted mb-1.5 block text-xs font-medium">Related transaction (optional)</span>
          <select className="d-input" value={txHash} onChange={(e) => setTxHash(e.target.value)}>
            <option value="">None</option>
            {recent.map((t) => <option key={t.id} value={t.hash}>{txTitle(t)} · {fmtNum(t.amount, 2)} {t.asset} · {timeAgo(t.createdAt)}</option>)}
          </select>
        </label>
        <div>
          <span className="t-muted mb-1.5 block text-xs font-medium">Priority</span>
          <AnimatedTabs layoutId="ticket-priority" size="sm" value={priority} onChange={setPriority} tabs={[{ id: 'low', label: 'Low' }, { id: 'normal', label: 'Normal' }, { id: 'high', label: 'Urgent' }]} />
        </div>
      </div>
      <label className="block">
        <span className="t-muted mb-1.5 block text-xs font-medium">Describe the issue</span>
        <textarea className="d-input min-h-[120px] resize-y" maxLength={2000} placeholder="What happened, when, and what you expected" value={text} onChange={(e) => setText(e.target.value)} />
      </label>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="d-btn d-btn-ghost cursor-pointer">
          <Paperclip className="h-3.5 w-3.5" /> {file ? file : 'Attach screenshot'}
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0]?.name)} />
        </label>
        <button className="d-btn d-btn-primary" disabled={subject.trim().length < 5 || text.trim().length < 10}><Send className="h-4 w-4" /> Submit ticket</button>
      </div>
    </form>
  );
};

const Thread: React.FC<{ ticket: Ticket; onBack: () => void }> = ({ ticket, onBack }) => {
  const { replyTicket, setTicketStatus, toast } = useAccount();
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [ticket.messages.length]);
  const waitingForSupport = ticket.status !== 'resolved' && ticket.messages[ticket.messages.length - 1].from === 'user';

  return (
    <div className="flex h-full flex-col">
      <button onClick={onBack} className="t-muted mb-3 flex items-center gap-1 text-xs hover:text-[var(--d-text)] lg:hidden"><ArrowLeft className="h-3.5 w-3.5" /> All tickets</button>
      <div className="flex flex-wrap items-start justify-between gap-3 border-b pb-4">
        <div className="min-w-0">
          <div className="t-muted font-code text-xs">{ticket.number} · {ticket.category} · {ticket.priority === 'high' ? 'Urgent' : ticket.priority}</div>
          <h3 className="mt-1 font-display text-lg font-bold">{ticket.subject}</h3>
          <div className="t-muted text-xs">Opened {fmtDateTime(ticket.createdAt)}</div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cx('d-chip', STATUS[ticket.status].chip)}>{STATUS[ticket.status].label}</span>
          {ticket.status === 'resolved' ? (
            <button className="d-btn d-btn-ghost !py-1.5 text-xs" onClick={() => { setTicketStatus(ticket.id, 'open'); toast('Ticket reopened', 'gold'); }}><RotateCcw className="h-3.5 w-3.5" /> Reopen</button>
          ) : (
            <button className="d-btn d-btn-ghost !py-1.5 text-xs" onClick={() => { setTicketStatus(ticket.id, 'resolved'); toast('Marked as resolved'); }}><CheckCircle2 className="h-3.5 w-3.5" /> Resolve</button>
          )}
        </div>
      </div>
      <div className="d-scroll flex-1 space-y-3 overflow-y-auto py-4" data-lenis-prevent style={{ maxHeight: 420 }}>
        {ticket.txHash && <div className="t-muted rounded-lg bg-surface-2 px-3 py-2 font-code text-[11px]">Linked tx {ticket.txHash.slice(0, 18)}…</div>}
        {ticket.messages.map((m) => (
          <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={cx('flex gap-2', m.from === 'user' && 'flex-row-reverse')}>
            <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', m.from === 'user' ? 'bg-gradient-to-br from-[#e2b54c] to-[#4f8bff] text-[#1a1204]' : 'bg-surface-3 t-gold')}>
              {m.from === 'user' ? 'You' : <Headset className="h-4 w-4" />}
            </span>
            <div className={cx('max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed', m.from === 'user' ? 'rounded-tr-sm bg-[rgba(226,181,76,0.12)]' : 'rounded-tl-sm bg-surface-2')}>
              <div>{m.text}</div>
              {m.attachment && <div className="t-muted mt-1 flex items-center gap-1 text-xs"><Paperclip className="h-3 w-3" /> {m.attachment}</div>}
              <div className="t-muted mt-1 text-[10px]">{m.from === 'support' ? 'MyBitRich Support · ' : ''}{fmtDateTime(m.at)}</div>
            </div>
          </motion.div>
        ))}
        {waitingForSupport && (
          <div className="t-muted flex items-center gap-2 pl-10 text-xs">
            <span className="flex gap-1">{[0, 1, 2].map((i) => <motion.span key={i} className="h-1.5 w-1.5 rounded-full bg-current" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />)}</span>
            Support will reply here
          </div>
        )}
        <div ref={endRef} />
      </div>
      {ticket.status !== 'resolved' ? (
        <form
          className="flex items-end gap-2 border-t pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            replyTicket(ticket.id, text.trim());
            setText('');
          }}
        >
          <textarea
            className="d-input min-h-[44px] resize-none"
            rows={2}
            placeholder="Write a reply…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                (e.currentTarget.form as HTMLFormElement).requestSubmit();
              }
            }}
          />
          <button className="d-btn d-btn-primary !p-3" disabled={!text.trim()} aria-label="Send reply"><Send className="h-4 w-4" /></button>
        </form>
      ) : (
        <div className="t-muted border-t pt-4 text-center text-sm">This ticket is resolved. Reopen it if you need more help.</div>
      )}
    </div>
  );
};
