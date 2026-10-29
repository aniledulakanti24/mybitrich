import React, { useMemo, useState } from 'react';
import { ArrowDownToLine, ArrowDownUp, ArrowUpFromLine, Download, ExternalLink, Gift, Search, Sparkles } from 'lucide-react';
import { useWallet, type LedgerTx, type TxKind, type TxStatus } from '../state/WalletProvider';
import { NETWORKS, fmtDateTime, fmtNum, fmtUsd, shortAddr, timeAgo } from '../config';
import { AnimatedTabs, SectionHeader, SpotlightCard, StatusBadge, cx } from '../ui';

const KIND_META: Record<TxKind, { label: string; icon: React.ElementType; tone: string }> = {
  deposit: { label: 'Deposit', icon: ArrowDownToLine, tone: 't-up' },
  withdraw: { label: 'Withdrawal', icon: ArrowUpFromLine, tone: 't-down' },
  swap: { label: 'Swap', icon: ArrowDownUp, tone: 't-blue' },
  holding_reward: { label: 'Holding reward', icon: Sparkles, tone: 't-up' },
  referral_reward: { label: 'Referral reward', icon: Gift, tone: 't-gold' },
};

const dp = (a: string) => (a === 'USDT' ? 2 : 2);

export function txTitle(t: LedgerTx) {
  if (t.kind === 'swap') return `Swap ${t.asset} → ${t.toAsset}`;
  if (t.kind === 'referral_reward') return `Level ${t.level} referral · ${t.from}`;
  if (t.kind === 'deposit') return `${t.asset} deposit`;
  if (t.kind === 'withdraw') return `${t.asset} withdrawal`;
  return 'Holding reward (2% reflection)';
}

export function txAmount(t: LedgerTx): { text: string; tone: string } {
  if (t.kind === 'swap') return { text: `+${fmtNum(t.toAmount!, dp(t.toAsset!))} ${t.toAsset}`, tone: 't-up' };
  if (t.kind === 'withdraw') return { text: `−${fmtNum(t.amount, dp(t.asset))} ${t.asset}`, tone: 't-down' };
  return { text: `+${fmtNum(t.amount, t.amount < 1 ? 4 : dp(t.asset))} ${t.asset}`, tone: 't-up' };
}

export const TxRow: React.FC<{ tx: LedgerTx; compact?: boolean }> = ({ tx, compact }) => {
  const meta = KIND_META[tx.kind];
  const Icon = meta.icon;
  const amt = txAmount(tx);
  return (
    <li className="flex items-center gap-3 py-2.5">
      <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-surface-2', meta.tone)}>
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{txTitle(tx)}</div>
        <div className="t-muted text-[11px]">
          {timeAgo(tx.createdAt)}
          {tx.kind === 'swap' && ` · −${fmtNum(tx.amount, 2)} ${tx.asset}`}
        </div>
      </div>
      <div className="text-right">
        <div className={cx('text-sm font-semibold', amt.tone)}>{amt.text}</div>
        {!compact || tx.status !== 'completed' ? <StatusBadge status={tx.status} confirmations={tx.confirmations} required={tx.required} /> : null}
      </div>
    </li>
  );
};

type Filter = 'all' | 'funding' | 'swap' | 'rewards';

export const TransactionsSection: React.FC = () => {
  const { state, price } = useWallet();
  const [filter, setFilter] = useState<Filter>('all');
  const [status, setStatus] = useState<TxStatus | 'any'>('any');
  const [q, setQ] = useState('');
  const [limit, setLimit] = useState(50);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return state.txs.filter((t) => {
      if (filter === 'funding' && t.kind !== 'deposit' && t.kind !== 'withdraw') return false;
      if (filter === 'swap' && t.kind !== 'swap') return false;
      if (filter === 'rewards' && t.kind !== 'holding_reward' && t.kind !== 'referral_reward') return false;
      if (status !== 'any' && t.status !== status) return false;
      if (term && !`${t.hash} ${txTitle(t)} ${t.address ?? ''}`.toLowerCase().includes(term)) return false;
      return true;
    });
  }, [state.txs, filter, status, q]);

  const exportCsv = () => {
    const head = ['date', 'type', 'asset', 'amount', 'to_asset', 'to_amount', 'fee', 'price_usdt', 'status', 'tx_hash', 'address'];
    const lines = rows.map((t) =>
      [new Date(t.createdAt).toISOString(), t.kind, t.asset, t.amount, t.toAsset ?? '', t.toAmount ?? '', t.fee ?? '', t.price ?? '', t.status, t.hash, t.address ?? ''].join(','),
    );
    const blob = new Blob([[head.join(','), ...lines].join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mybitrich-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Transactions"
        subtitle="Every deposit, withdrawal, swap and reward credited to your account."
        right={<button className="d-btn d-btn-ghost" onClick={exportCsv} disabled={!rows.length}><Download className="h-3.5 w-3.5" /> Export CSV</button>}
      />
      <SpotlightCard className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-3 lg:flex-row lg:items-center">
          <div className="d-scroll overflow-x-auto">
            <AnimatedTabs
              layoutId="tx-filter"
              size="sm"
              value={filter}
              onChange={setFilter}
              tabs={[
                { id: 'all', label: 'All' },
                { id: 'funding', label: 'Deposits & withdrawals' },
                { id: 'swap', label: 'Swaps' },
                { id: 'rewards', label: 'Rewards' },
              ]}
            />
          </div>
          <div className="flex flex-1 gap-2 lg:justify-end">
            <select value={status} onChange={(e) => setStatus(e.target.value as TxStatus | 'any')} className="d-input !w-auto !py-1.5 text-xs">
              <option value="any">Any status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
            </select>
            <label className="relative flex-1 lg:max-w-xs">
              <Search className="t-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search hash, address, member" className="d-input !py-1.5 pl-8 text-xs" />
            </label>
          </div>
        </div>
        <div className="d-scroll overflow-x-auto" data-lenis-prevent>
          <table className="d-table w-full">
            <thead>
              <tr>
                <th>Type</th>
                <th>Details</th>
                <th className="!text-right">Amount</th>
                <th className="!text-right">Value</th>
                <th>Status</th>
                <th>Date</th>
                <th>Tx hash</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, limit).map((t) => {
                const meta = KIND_META[t.kind];
                const Icon = meta.icon;
                const amt = txAmount(t);
                const usd = t.kind === 'swap' ? (t.asset === 'USDT' ? t.amount : t.toAmount!) : t.asset === 'USDT' ? t.amount : t.amount * (t.price ?? price);
                return (
                  <tr key={t.id}>
                    <td>
                      <span className={cx('flex items-center gap-2 font-medium', meta.tone)}><Icon className="h-3.5 w-3.5" />{meta.label}</span>
                    </td>
                    <td className="t-soft">
                      {t.kind === 'swap' && `${fmtNum(t.amount, 2)} ${t.asset} @ ${t.price?.toFixed(6)}`}
                      {t.kind === 'referral_reward' && `L${t.level} · ${t.from}`}
                      {t.kind === 'withdraw' && <span className="font-code text-xs">{NETWORKS[t.network ?? 'BEP20'].label} · to {shortAddr(t.address ?? '')} · fee {t.fee}</span>}
                      {t.kind === 'deposit' && `via ${NETWORKS[t.network ?? 'BEP20'].label}`}
                      {t.kind === 'holding_reward' && '2% of trade volume'}
                    </td>
                    <td className={cx('!text-right font-semibold', amt.tone)}>{amt.text}</td>
                    <td className="t-muted !text-right">{fmtUsd(usd)}</td>
                    <td><StatusBadge status={t.status} confirmations={t.confirmations} required={t.required} /></td>
                    <td className="t-muted">{fmtDateTime(t.createdAt)}</td>
                    <td>
                      <a href={`${NETWORKS[t.network ?? 'BEP20'].explorerTx}${t.hash}`} target="_blank" rel="noopener noreferrer" className="t-muted font-code inline-flex items-center gap-1 text-xs hover:text-[var(--d-text)]">
                        {shortAddr(t.hash, 8, 6)} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!rows.length && <div className="t-muted py-12 text-center text-sm">No transactions match these filters.</div>}
        </div>
        {rows.length > limit && (
          <div className="border-t p-3 text-center">
            <button className="d-btn d-btn-ghost" onClick={() => setLimit((l) => l + 50)}>Show more ({rows.length - limit} left)</button>
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
