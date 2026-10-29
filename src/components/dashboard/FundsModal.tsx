import React, { useEffect, useMemo, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDownToLine,
  ArrowLeft,
  ArrowUpFromLine,
  Check,
  Clipboard,
  Clock,
  ExternalLink,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import { useWallet, type LedgerTx } from './state/WalletProvider';
import { useAccount } from './state/account';
import {
  NETWORKS,
  depositAddressFor,
  fmtDateTime,
  fmtNum,
  isAddressFor,
  networksFor,
  shortAddr,
  timeAgo,
  transferRules,
  type Asset,
  type NetworkId,
} from './config';
import { AnimatedTabs, CopyButton, Modal, StatusBadge, cx } from './ui';

export type FundsMode = 'deposit' | 'withdraw';

const PAY_WINDOW_MS = 30 * 60_000;

/** Each step of a flow starts at the top of the dialog, like a new screen. */
const useScrollTopOn = (step: string) =>
  useEffect(() => {
    document.querySelector('[role="dialog"]')?.scrollTo({ top: 0 });
  }, [step]);
const dp = (a: Asset) => (a === 'USDT' ? 2 : 0);

export const FundsModal: React.FC<{
  open: boolean;
  onClose: () => void;
  mode: FundsMode;
  asset: Asset;
  onSwap?: (from: Asset) => void;
}> = ({ open, onClose, mode: initialMode, asset, onSwap }) => {
  const [mode, setMode] = useState<FundsMode>(initialMode);
  const [session, setSession] = useState(0);
  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setSession((s) => s + 1);
    }
  }, [open, initialMode]);

  const tabs = (
    <AnimatedTabs
      layoutId="funds-mode"
      value={mode}
      onChange={setMode}
      tabs={[
        { id: 'deposit', label: <><ArrowDownToLine className="h-3.5 w-3.5" /> Deposit</> },
        { id: 'withdraw', label: <><ArrowUpFromLine className="h-3.5 w-3.5" /> Withdraw</> },
      ]}
    />
  );

  return (
    <Modal open={open} onClose={onClose} title={`${mode === 'deposit' ? 'Deposit' : 'Withdraw'} ${asset}`} subtitle={mode === 'deposit' ? 'Pay by QR code or wallet address' : 'Send to any wallet or exchange'} width="max-w-md">
      {mode === 'deposit' ? (
        <DepositFlow key={`d-${session}-${asset}`} asset={asset} tabs={tabs} onClose={onClose} onSwap={onSwap} />
      ) : (
        <WithdrawFlow key={`w-${session}-${asset}`} asset={asset} tabs={tabs} onClose={onClose} />
      )}
    </Modal>
  );
};

// ---------------------------------------------------------------------------
// Shared pieces
// ---------------------------------------------------------------------------

const NetworkPicker: React.FC<{ asset: Asset; value: NetworkId; onChange: (n: NetworkId) => void; kind: FundsMode }> = ({ asset, value, onChange, kind }) => (
  <div>
    <div className="t-muted mb-2 text-xs font-medium">Select network</div>
    <div role="radiogroup" className="grid gap-2">
      {networksFor(asset).map((n) => {
        const r = transferRules(asset, n.id);
        const active = value === n.id;
        return (
          <button
            key={n.id}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(n.id)}
            className={cx(
              'flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors',
              active ? 'border-[var(--d-gold)] bg-[rgba(226,181,76,0.07)]' : 'bg-surface-2 hover:border-[var(--d-line-strong)]',
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: n.color }}>
              {n.label.split('-')[0]}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{n.label} <span className="t-muted font-normal">· {n.chain}</span></span>
              <span className="t-muted block text-[11px]">
                {kind === 'deposit' ? `Min ${fmtNum(r.minDeposit)} ${asset}` : `Fee ${fmtNum(r.withdrawFee, asset === 'USDT' ? 1 : 0)} ${asset}`} · Arrives {n.eta}
              </span>
            </span>
            <span className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', active ? 'border-[var(--d-gold)] bg-[var(--d-gold)]' : 'border-[var(--d-line-strong)]')}>
              {active && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);

const NetworkChip: React.FC<{ network: NetworkId }> = ({ network }) => {
  const n = NETWORKS[network];
  return (
    <span className="d-chip">
      <span className="h-2 w-2 rounded-full" style={{ background: n.color }} />
      {n.label} · {n.chain}
    </span>
  );
};

const BackButton: React.FC<{ onClick: () => void; label?: string }> = ({ onClick, label = 'Back' }) => (
  <button onClick={onClick} className="t-muted -ml-1 mb-3 flex items-center gap-1 text-xs font-medium hover:text-[var(--d-text)]">
    <ArrowLeft className="h-3.5 w-3.5" /> {label}
  </button>
);

const ReceiptRow: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex items-center justify-between gap-4 py-2 text-sm">
    <span className="t-muted">{k}</span>
    <span className="min-w-0 truncate text-right font-medium">{v}</span>
  </div>
);

/** Circular progress + 3-stage timeline, then an animated success receipt once the tx completes. */
const TxProgress: React.FC<{ tx: LedgerTx; kind: FundsMode; footer: (done: boolean) => React.ReactNode }> = ({ tx, kind, footer }) => {
  const net = NETWORKS[tx.network ?? 'BEP20'];
  const required = tx.required ?? 15;
  const conf = tx.confirmations ?? 0;
  const pct = Math.round((conf / required) * 100);
  const done = tx.status === 'completed';
  const R = 44;
  const C = 2 * Math.PI * R;
  const stages =
    kind === 'deposit'
      ? ['Payment detected', `Confirming on ${net.chain}`, 'Credited to your balance']
      : ['Request approved', `Broadcast on ${net.chain}`, 'Delivered to address'];
  const stage = done ? 3 : conf > 0 ? 1 : 0;

  return (
    <AnimatePresence mode="wait">
      {!done ? (
        <motion.div key="proc" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="py-2 text-center">
          <div className="relative mx-auto h-28 w-28">
            <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
              <circle cx="50" cy="50" r={R} fill="none" stroke="var(--d-surface-3)" strokeWidth="6" />
              <motion.circle cx="50" cy="50" r={R} fill="none" stroke="var(--d-gold)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} animate={{ strokeDashoffset: C * (1 - Math.max(0.04, pct / 100)) }} transition={{ duration: 0.6 }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold">{pct}%</span>
              <span className="t-muted text-[10px]">{conf}/{required}</span>
            </div>
          </div>
          <div className="mt-4 font-display text-lg font-bold">{kind === 'deposit' ? 'Processing payment' : 'Processing withdrawal'}</div>
          <p className="t-muted mt-1 text-sm">
            {fmtNum(tx.amount, dp(tx.asset))} {tx.asset} · waiting for {required} confirmations on {net.label}
          </p>
          <ol className="mx-auto mt-5 max-w-xs space-y-3 text-left">
            {stages.map((s, i) => {
              const state = i < stage ? 'done' : i === stage ? 'active' : 'todo';
              return (
                <li key={s} className="flex items-center gap-3 text-sm">
                  <span className={cx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2', state === 'done' && 'border-[var(--d-up)] bg-[var(--d-up)]', state === 'active' && 'border-[var(--d-gold)]', state === 'todo' && 'border-[var(--d-line-strong)]')}>
                    {state === 'done' && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                    {state === 'active' && <Loader2 className="t-gold h-3.5 w-3.5 animate-spin" />}
                  </span>
                  <span className={state === 'todo' ? 't-muted' : ''}>{s}</span>
                </li>
              );
            })}
          </ol>
          <p className="t-muted mt-5 text-xs">You can close this window. We’ll keep processing in the background.</p>
        </motion.div>
      ) : (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
            <motion.span className="absolute inset-0 rounded-full bg-[var(--d-up)]" initial={{ scale: 0.6, opacity: 0.35 }} animate={{ scale: 1.5, opacity: 0 }} transition={{ duration: 1.1, repeat: 1 }} />
            <motion.span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[var(--d-up)] shadow-lg" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 15 }}>
              <motion.svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25, duration: 0.4 }} />
              </motion.svg>
            </motion.span>
          </div>
          <div className="t-up mt-4 text-sm font-semibold">{kind === 'deposit' ? 'Payment confirmed' : 'Withdrawal completed'}</div>
          <div className="mt-1 font-display text-3xl font-bold">
            {kind === 'deposit' ? '+' : '−'}
            {fmtNum(tx.amount, dp(tx.asset))} <span className="text-lg">{tx.asset}</span>
          </div>
          <div className="mt-5 divide-y divide-[var(--d-line)] rounded-xl border bg-surface-2 px-4 text-left">
            <ReceiptRow k="Network" v={<NetworkChip network={tx.network ?? 'BEP20'} />} />
            {kind === 'withdraw' && <ReceiptRow k="To" v={<span className="font-code text-xs">{shortAddr(tx.address ?? '', 8, 6)}</span>} />}
            {kind === 'withdraw' && <ReceiptRow k="Network fee" v={`${fmtNum(tx.fee ?? 0, 2)} ${tx.asset}`} />}
            <ReceiptRow k="Date" v={fmtDateTime(tx.createdAt)} />
            <ReceiptRow
              k="Transaction ID"
              v={
                <a href={`${net.explorerTx}${tx.hash}`} target="_blank" rel="noopener noreferrer" className="font-code inline-flex items-center gap-1 text-xs hover:underline">
                  {shortAddr(tx.hash, 8, 6)} <ExternalLink className="h-3 w-3" />
                </a>
              }
            />
          </div>
          {footer(true)}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const RecentList: React.FC<{ asset: Asset; kind: FundsMode }> = ({ asset, kind }) => {
  const { state } = useWallet();
  const rows = state.txs.filter((t) => t.kind === kind && t.asset === asset).slice(0, 3);
  if (!rows.length) return null;
  return (
    <div className="mt-6 border-t pt-4">
      <div className="t-muted mb-2 text-xs font-medium">Recent {kind}s</div>
      <ul className="space-y-1.5">
        {rows.map((t) => (
          <li key={t.id} className="flex items-center justify-between gap-3 rounded-lg bg-surface-2 px-3 py-2 text-xs">
            <span className="font-semibold">{fmtNum(t.amount, dp(asset))} {asset}</span>
            <span className="t-muted">{NETWORKS[t.network ?? 'BEP20'].label} · {timeAgo(t.createdAt)}</span>
            <StatusBadge status={t.status} confirmations={t.confirmations} required={t.required} />
          </li>
        ))}
      </ul>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Deposit: network + amount → pay (QR, timer) → processing → confirmed
// ---------------------------------------------------------------------------

const DepositFlow: React.FC<{ asset: Asset; tabs: React.ReactNode; onClose: () => void; onSwap?: (from: Asset) => void }> = ({ asset, tabs, onClose, onSwap }) => {
  const { state, submitDeposit } = useWallet();
  const { account } = useAccount();
  const [step, setStep] = useState<'form' | 'pay' | 'track'>('form');
  const [network, setNetwork] = useState<NetworkId>(asset === 'USDT' ? account.settings.prefs.defaultNetwork : 'BEP20');
  const [amount, setAmount] = useState('');
  const [hash, setHash] = useState('');
  const [showHash, setShowHash] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState(0);
  const [now, setNow] = useState(Date.now());
  const rules = transferRules(asset, network);
  const net = NETWORKS[network];
  const address = depositAddressFor(network, state.depositAddress);
  const n = parseFloat(amount) || 0;
  const tracked = trackId ? state.txs.find((t) => t.id === trackId) : null;
  useScrollTopOn(step);

  useEffect(() => {
    if (step !== 'pay') return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [step]);
  const left = Math.max(0, expiresAt - now);
  const expired = step === 'pay' && left === 0;

  if (step === 'track' && tracked) {
    return (
      <TxProgress
        tx={tracked}
        kind="deposit"
        footer={() => (
          <div className="mt-5 grid grid-cols-2 gap-2">
            {asset === 'USDT' && onSwap ? (
              <button className="d-btn d-btn-ghost !py-3" onClick={() => onSwap('USDT')}>Swap to MBR</button>
            ) : (
              <button className="d-btn d-btn-ghost !py-3" onClick={() => { setStep('form'); setAmount(''); setTrackId(null); }}>New deposit</button>
            )}
            <button className="d-btn d-btn-primary !py-3" onClick={onClose}>Done</button>
          </div>
        )}
      />
    );
  }

  if (step === 'pay') {
    return (
      <div>
        <BackButton onClick={() => setStep('form')} label="Change amount or network" />
        <div className="text-center">
          <div className="t-muted text-xs">Amount to pay</div>
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="font-display text-3xl font-bold">{fmtNum(n, dp(asset))} {asset}</span>
            <CopyButton text={String(n)} />
          </div>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <NetworkChip network={network} />
            <span className={cx('d-chip', left < 5 * 60_000 ? 'd-chip-down' : 'd-chip-gold')}>
              <Clock className="h-3 w-3" />
              {expired ? 'Expired' : `${String(Math.floor(left / 60000)).padStart(2, '0')}:${String(Math.floor((left % 60000) / 1000)).padStart(2, '0')}`}
            </span>
          </div>
        </div>

        <div className={cx('mx-auto mt-5 w-fit rounded-2xl border bg-white p-3 shadow-sm transition-opacity', expired && 'opacity-30')}>
          <QRCodeSVG
            value={address}
            size={188}
            level="H"
            imageSettings={{ src: `${import.meta.env.BASE_URL}assets/logo-mark.png`, height: 36, width: 36, excavate: true }}
          />
        </div>

        <div className="mt-4 rounded-xl border bg-surface-2 p-3">
          <div className="t-muted mb-1 text-[11px]">{net.label} deposit address</div>
          <div className="flex items-center gap-2">
            <span className="font-code min-w-0 flex-1 break-all text-xs leading-relaxed">{address}</span>
            <CopyButton text={address} />
          </div>
        </div>

        <div className="mt-3 flex gap-2 rounded-xl border border-[rgba(226,181,76,0.3)] bg-[rgba(226,181,76,0.06)] p-3 text-xs leading-relaxed">
          <AlertTriangle className="t-gold mt-px h-4 w-4 shrink-0" />
          <span className="t-soft">
            Send only <b>{asset}</b> on <b>{net.label} ({net.chain})</b>. Funds sent on another network will be lost.
          </span>
        </div>

        {expired ? (
          <button className="d-btn d-btn-primary mt-5 w-full !py-3" onClick={() => { setExpiresAt(Date.now() + PAY_WINDOW_MS); setNow(Date.now()); }}>
            Generate new payment window
          </button>
        ) : (
          <>
            <div className="t-muted mt-5 flex items-center justify-center gap-2 text-xs">
              <span className="d-pulse-dot" /> Waiting for your payment…
            </div>
            <button className="t-muted mx-auto mt-3 block text-xs underline-offset-2 hover:text-[var(--d-text)] hover:underline" onClick={() => setShowHash((s) => !s)}>
              {showHash ? 'Hide transaction ID' : 'Add transaction ID (optional, speeds up matching)'}
            </button>
            {showHash && (
              <input className="d-input font-code mt-2 !text-xs" placeholder={network === 'TRC20' ? '64-character Tron tx ID' : '0x…'} value={hash} onChange={(e) => { setHash(e.target.value); setError(null); }} />
            )}
            {error && <div className="t-down mt-2 text-xs">{error}</div>}
            <button
              className="d-btn d-btn-primary mt-4 w-full !py-3 text-sm"
              onClick={() => {
                const r = submitDeposit(asset, n, network, hash || undefined);
                if (!r.ok) return setError(r.error);
                setTrackId(r.tx.id);
                setStep('track');
              }}
            >
              I’ve completed the payment
            </button>
            <button className="d-btn mt-2 w-full t-muted hover:text-[var(--d-text)]" onClick={onClose}>Cancel</button>
          </>
        )}
      </div>
    );
  }

  const tooLow = n > 0 && n < rules.minDeposit;
  return (
    <div className="space-y-5">
      {tabs}
      <NetworkPicker asset={asset} value={network} onChange={(v) => { setNetwork(v); setError(null); }} kind="deposit" />
      <div>
        <label className="t-muted mb-2 block text-xs font-medium" htmlFor="dep-amt">Amount</label>
        <div className="relative">
          <input id="dep-amt" className="d-input !py-3 pr-16 !text-lg font-semibold" type="number" min={0} step="any" inputMode="decimal" placeholder={`Min ${fmtNum(rules.minDeposit)}`} value={amount} aria-invalid={tooLow} onChange={(e) => { setAmount(e.target.value); setError(null); }} />
          <span className="t-muted absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold">{asset}</span>
        </div>
        <div className="mt-2 flex gap-1.5">
          {(asset === 'USDT' ? [50, 100, 500, 1000] : [5000, 10000, 50000, 100000]).map((v) => (
            <button key={v} onClick={() => setAmount(String(v))} className={cx('flex-1 rounded-lg border py-1.5 text-xs font-semibold transition-colors', n === v ? 'border-[var(--d-gold)] t-gold' : 't-soft hover:border-[var(--d-line-strong)]')}>
              {fmtNum(v)}
            </button>
          ))}
        </div>
        {tooLow && <div className="t-down mt-2 text-xs">Minimum deposit on {net.label} is {fmtNum(rules.minDeposit)} {asset}</div>}
      </div>
      <button
        className="d-btn d-btn-primary w-full !py-3 text-sm"
        disabled={!n || tooLow}
        onClick={() => {
          setExpiresAt(Date.now() + PAY_WINDOW_MS);
          setNow(Date.now());
          setStep('pay');
        }}
      >
        Continue to payment
      </button>
      <p className="t-muted flex items-center justify-center gap-1.5 text-[11px]"><ShieldCheck className="h-3.5 w-3.5" /> Credited after {rules.confirmations} network confirmations</p>
      <RecentList asset={asset} kind="deposit" />
    </div>
  );
};

// ---------------------------------------------------------------------------
// Withdraw: network + address + amount → review → processing → completed
// ---------------------------------------------------------------------------

const WithdrawFlow: React.FC<{ asset: Asset; tabs: React.ReactNode; onClose: () => void }> = ({ asset, tabs, onClose }) => {
  const { state, submitWithdraw } = useWallet();
  const { account } = useAccount();
  const [step, setStep] = useState<'form' | 'review' | 'track'>('form');
  const [network, setNetwork] = useState<NetworkId>(asset === 'USDT' ? account.settings.prefs.defaultNetwork : 'BEP20');
  const saved = account.addresses.filter((a) => a.network === network);
  const whitelistOnly = account.settings.security.whitelistOnly;
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [ack, setAck] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trackId, setTrackId] = useState<string | null>(null);
  const addrRef = useRef<HTMLInputElement>(null);
  const rules = transferRules(asset, network);
  const net = NETWORKS[network];
  const balance = asset === 'USDT' ? state.usdt : state.mbr;
  const n = parseFloat(amount) || 0;
  const maxAmount = Math.max(0, balance - rules.withdrawFee);
  const addrBad = address.length > 0 && !isAddressFor(network, address);
  const tracked = trackId ? state.txs.find((t) => t.id === trackId) : null;
  useScrollTopOn(step);

  const problem = useMemo(() => {
    if (!address) return 'Enter a destination address';
    if (addrBad) return `Not a valid ${net.label} address`;
    if (whitelistOnly && !saved.some((a) => a.address === address)) return 'Whitelist is on: pick a saved address';
    if (!n) return 'Enter an amount';
    if (n < rules.minWithdraw) return `Minimum withdrawal is ${fmtNum(rules.minWithdraw)} ${asset}`;
    if (n + rules.withdrawFee > balance + 1e-9) return `Not enough ${asset} for amount plus ${rules.withdrawFee} ${asset} fee`;
    return null;
  }, [address, addrBad, n, rules, balance, asset, net.label, whitelistOnly, saved]);

  if (step === 'track' && tracked) {
    return (
      <TxProgress
        tx={tracked}
        kind="withdraw"
        footer={() => (
          <>
            {asset === 'USDT' && <p className="t-muted mt-4 text-xs leading-relaxed">Sent to an exchange like Binance? Sell it in <b>P2P → Sell USDT</b> to receive your local currency.</p>}
            <button className="d-btn d-btn-primary mt-5 w-full !py-3" onClick={onClose}>Done</button>
          </>
        )}
      />
    );
  }

  if (step === 'review') {
    return (
      <div>
        <BackButton onClick={() => setStep('form')} label="Edit details" />
        <div className="text-center">
          <div className="t-muted text-xs">You are withdrawing</div>
          <div className="mt-1 font-display text-3xl font-bold">{fmtNum(n, dp(asset))} {asset}</div>
          <div className="mt-2"><NetworkChip network={network} /></div>
        </div>
        <div className="mt-5 divide-y divide-[var(--d-line)] rounded-xl border bg-surface-2 px-4">
          <ReceiptRow k="To address" v={<span className="font-code text-xs">{shortAddr(address, 10, 8)}</span>} />
          <ReceiptRow k="Network fee" v={`${fmtNum(rules.withdrawFee, 2)} ${asset}`} />
          <ReceiptRow k="Total deducted" v={`${fmtNum(n + rules.withdrawFee, dp(asset))} ${asset}`} />
          <ReceiptRow k="Recipient gets" v={<span className="t-gold font-semibold">{fmtNum(n, dp(asset))} {asset}</span>} />
          <ReceiptRow k="Estimated arrival" v={net.eta} />
        </div>
        <label className="t-soft mt-4 flex cursor-pointer items-start gap-2.5 text-xs leading-relaxed">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#d9a83a]" />
          I’ve checked this address accepts {asset} on {net.label} ({net.chain}). Withdrawals to a wrong address or network cannot be reversed.
        </label>
        {error && <div className="t-down mt-3 text-xs">{error}</div>}
        <button
          className="d-btn d-btn-primary mt-5 w-full !py-3 text-sm"
          disabled={!ack || busy}
          onClick={() => {
            setBusy(true);
            setTimeout(() => {
              const r = submitWithdraw(asset, n, address, network);
              setBusy(false);
              if (!r.ok) return setError(r.error);
              setTrackId(r.tx.id);
              setStep('track');
            }, 700);
          }}
        >
          {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Submitting…</> : 'Confirm withdrawal'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {tabs}
      <NetworkPicker asset={asset} value={network} onChange={(v) => { setNetwork(v); setError(null); }} kind="withdraw" />
      <div>
        <label className="t-muted mb-2 block text-xs font-medium" htmlFor="wd-addr">Destination address</label>
        <div className="relative">
          <input ref={addrRef} id="wd-addr" className="d-input font-code pr-20 !text-xs" placeholder={`${net.label} address · ${net.addressHint}`} value={address} aria-invalid={addrBad} onChange={(e) => setAddress(e.target.value.trim())} />
          <button
            type="button"
            onClick={async () => {
              try {
                setAddress((await navigator.clipboard.readText()).trim());
              } catch {
                addrRef.current?.focus();
              }
            }}
            className="t-gold absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold hover:bg-surface-3"
          >
            <Clipboard className="h-3 w-3" /> Paste
          </button>
        </div>
        {addrBad && <div className="t-down mt-1.5 text-xs">That isn’t a {net.label} address. {net.addressHint}.</div>}
        {saved.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {saved.map((a) => (
              <button key={a.id} type="button" onClick={() => setAddress(a.address)} className={cx('d-chip !py-1 !text-xs', address === a.address && 'd-chip-gold')} title={a.address}>
                {a.label} · {shortAddr(a.address, 4, 4)}
              </button>
            ))}
          </div>
        )}
        {whitelistOnly && <div className="t-muted mt-1.5 text-[11px]">Withdrawal whitelist is on. Manage saved addresses in Settings → Address book.</div>}
      </div>
      <div>
        <label className="t-muted mb-2 flex justify-between text-xs font-medium" htmlFor="wd-amt">
          <span>Amount</span>
          <span>Available {fmtNum(balance, dp(asset))} {asset}</span>
        </label>
        <div className="relative">
          <input id="wd-amt" className="d-input !py-3 pr-24 !text-lg font-semibold" type="number" min={0} step="any" inputMode="decimal" placeholder={`Min ${fmtNum(rules.minWithdraw)}`} value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
            <button type="button" onClick={() => setAmount(String(asset === 'USDT' ? Math.floor(maxAmount * 100) / 100 : Math.floor(maxAmount)))} className="t-gold rounded-md px-1.5 py-0.5 text-[11px] font-bold hover:bg-surface-3">MAX</button>
            <span className="t-muted text-sm font-semibold">{asset}</span>
          </div>
        </div>
        <div className="t-muted mt-2 flex justify-between text-xs">
          <span>Fee {fmtNum(rules.withdrawFee, 2)} {asset}</span>
          <span>Recipient gets <b className="t-soft">{fmtNum(n, dp(asset))} {asset}</b></span>
        </div>
      </div>
      <button className="d-btn d-btn-primary w-full !py-3 text-sm" disabled={!!problem} onClick={() => { setAck(false); setError(null); setStep('review'); }}>
        {problem && (address || n) ? problem : 'Continue'}
      </button>
      <RecentList asset={asset} kind="withdraw" />
    </div>
  );
};
