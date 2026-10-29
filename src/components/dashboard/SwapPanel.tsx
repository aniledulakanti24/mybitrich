import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDownUp, CheckCircle2, Info, Loader2, Settings2 } from 'lucide-react';
import { swapQuote, useWallet, type LedgerTx } from './state/WalletProvider';
import { DASH, TOTAL_TAX, fmtNum, fmtPct, fmtPrice, fmtUsd, shortAddr, type Asset } from './config';
import { TokenIcon, cx } from './ui';
import { triggerBillionaireConfetti } from '../../utils/confetti';

export const SwapPanel: React.FC<{ initialFrom?: Asset; className?: string; onDone?: () => void }> = ({ initialFrom = 'USDT', className, onDone }) => {
  const { state, price, executeSwap } = useWallet();
  const [from, setFrom] = useState<Asset>(initialFrom);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState<number>(DASH.defaultSlippage);
  const [showSettings, setShowSettings] = useState(false);
  const [review, setReview] = useState<{ amountIn: number; out: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<LedgerTx | null>(null);

  const to: Asset = from === 'USDT' ? 'MBR' : 'USDT';
  const balance = from === 'USDT' ? state.usdt : state.mbr;
  const n = parseFloat(amount) || 0;
  const q = useMemo(() => (n > 0 ? swapQuote(from, n, price) : null), [from, n, price]);
  const insufficient = n > balance + 1e-9;
  const tooSmall = from === 'USDT' && n > 0 && n < 1;

  const setPct = (p: number) => {
    const v = balance * p;
    setAmount(from === 'USDT' ? (Math.floor(v * 100) / 100).toString() : Math.floor(v).toString());
    setError(null);
  };

  const confirm = () => {
    if (!review) return;
    setBusy(true);
    setError(null);
    // Simulated network round-trip before the swap settles.
    setTimeout(() => {
      const r = executeSwap(from, review.amountIn, slippage, review.out);
      setBusy(false);
      setReview(null);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      setDone(r.tx);
      setAmount('');
      if (r.tx.asset === 'USDT') triggerBillionaireConfetti();
    }, 1100);
  };

  if (done) {
    return (
      <div className={cx('flex flex-col items-center justify-center gap-3 py-6 text-center', className)}>
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }}>
          <CheckCircle2 className="t-up h-12 w-12" />
        </motion.div>
        <div className="font-display text-lg font-bold">Swap complete</div>
        <div className="t-soft text-sm">
          {fmtNum(done.amount, done.asset === 'USDT' ? 2 : 0)} {done.asset} → <span className="t-gold font-semibold">{fmtNum(done.toAmount!, done.toAsset === 'USDT' ? 2 : 0)} {done.toAsset}</span>
        </div>
        <div className="t-muted font-code text-[11px]">Tx {shortAddr(done.hash, 10, 8)}</div>
        <div className="mt-2 flex gap-2">
          <button className="d-btn d-btn-ghost" onClick={() => setDone(null)}>New swap</button>
          {onDone && <button className="d-btn d-btn-primary" onClick={onDone}>Done</button>}
        </div>
      </div>
    );
  }

  return (
    <div className={cx('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Swap</div>
        <button onClick={() => setShowSettings((s) => !s)} className="t-muted flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] hover:bg-surface-3 hover:text-[var(--d-text)]">
          <Settings2 className="h-3.5 w-3.5" /> Slippage {slippage}%
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showSettings && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="rounded-xl border bg-surface-2 p-3">
              <div className="t-muted mb-2 text-[11px]">Slippage tolerance — 7–8% covers the 6% MBR transfer tax</div>
              <div className="flex gap-1.5">
                {DASH.slippageOptions.map((s) => (
                  <button key={s} onClick={() => setSlippage(s)} className={cx('d-btn flex-1 !py-1.5', slippage === s ? 'd-btn-primary' : 'd-btn-ghost')}>
                    {s}%
                  </button>
                ))}
                <input
                  type="number"
                  min={0.1}
                  max={49}
                  step={0.1}
                  value={slippage}
                  onChange={(e) => setSlippage(Math.min(49, Math.max(0.1, parseFloat(e.target.value) || 0.1)))}
                  className="d-input !w-20 !py-1.5 text-center"
                  aria-label="Custom slippage"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* From */}
      <div className="rounded-xl border bg-surface-2 p-3.5">
        <div className="t-muted mb-2 flex justify-between text-[11px]">
          <span>You pay</span>
          <span>
            Balance: <span className="t-soft">{fmtNum(balance, from === 'USDT' ? 2 : 0)}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            inputMode="decimal"
            type="number"
            min={0}
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setError(null);
            }}
            aria-invalid={insufficient}
            className="w-full min-w-0 bg-transparent font-display text-2xl font-bold outline-none placeholder:text-[var(--d-placeholder)]"
          />
          <span className="flex shrink-0 items-center gap-2 rounded-full border bg-surface-3 py-1 pl-1 pr-3 text-sm font-semibold">
            <TokenIcon asset={from} size={24} /> {from}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="t-muted text-[11px]">{q ? `≈ ${fmtUsd(q.usd)}` : ' '}</span>
          <div className="flex gap-1">
            {[0.25, 0.5, 0.75, 1].map((p) => (
              <button key={p} onClick={() => setPct(p)} className="t-muted rounded-md border px-1.5 py-0.5 text-[10px] font-semibold hover:border-[var(--d-gold)] hover:text-[var(--d-gold)]">
                {p === 1 ? 'MAX' : `${p * 100}%`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 -my-1.5 flex justify-center">
        <motion.button
          whileTap={{ rotate: 180 }}
          onClick={() => {
            setFrom(to);
            setAmount('');
            setError(null);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-xl border-4 border-[var(--d-surface)] bg-surface-3 t-gold hover:text-[var(--d-text)]"
          aria-label="Switch direction"
        >
          <ArrowDownUp className="h-4 w-4" />
        </motion.button>
      </div>

      {/* To */}
      <div className="rounded-xl border bg-surface-2 p-3.5">
        <div className="t-muted mb-2 flex justify-between text-[11px]">
          <span>You receive (est.)</span>
          <span>after 6% tax</span>
        </div>
        <div className="flex items-center gap-3">
          <div className={cx('w-full truncate font-display text-2xl font-bold', q ? 't-gold' : 'text-[var(--d-placeholder)]')}>{q ? fmtNum(q.out, to === 'USDT' ? 2 : 0) : '0.00'}</div>
          <span className="flex shrink-0 items-center gap-2 rounded-full border bg-surface-3 py-1 pl-1 pr-3 text-sm font-semibold">
            <TokenIcon asset={to} size={24} /> {to}
          </span>
        </div>
      </div>

      {q && (
        <div className="space-y-1.5 rounded-xl border px-3.5 py-3 text-[11px]">
          <Row k="Rate" v={`1 MBR = ${fmtPrice(price)} USDT`} />
          <Row k="Price impact" v={<span className={q.impact > 0.03 ? 't-down' : 't-soft'}>{(q.impact * 100).toFixed(2)}%</span>} />
          <Row k={`Swap tax (${(TOTAL_TAX * 100).toFixed(0)}%)`} v={`${fmtNum(q.tax, 0)} MBR`} />
          <div className="t-muted grid grid-cols-3 gap-1 pl-2 text-[10px]">
            <span>2% holders</span>
            <span>2% liquidity</span>
            <span>2% treasury</span>
          </div>
          <Row k="Minimum received" v={`${fmtNum(q.out * (1 - slippage / 100), to === 'USDT' ? 2 : 0)} ${to}`} />
        </div>
      )}

      {error && <div className="rounded-xl border border-[rgba(240,97,109,0.35)] bg-[rgba(240,97,109,0.08)] px-3 py-2 text-xs t-down">{error}</div>}

      {review ? (
        <div className="space-y-2 rounded-xl border border-[rgba(226,181,76,0.35)] bg-[rgba(226,181,76,0.06)] p-3">
          <div className="text-xs">
            Confirm swap of <b>{fmtNum(review.amountIn, from === 'USDT' ? 2 : 0)} {from}</b> for about <b className="t-gold">{fmtNum(review.out, to === 'USDT' ? 2 : 0)} {to}</b>. The trade reverts if you would get less than{' '}
            {fmtNum(review.out * (1 - slippage / 100), to === 'USDT' ? 2 : 0)} {to}.
          </div>
          <div className="flex gap-2">
            <button disabled={busy} className="d-btn d-btn-ghost flex-1" onClick={() => setReview(null)}>Back</button>
            <button disabled={busy} className="d-btn d-btn-primary flex-1" onClick={confirm}>
              {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Swapping…</> : 'Confirm swap'}
            </button>
          </div>
        </div>
      ) : (
        <button
          disabled={!q || insufficient || tooSmall}
          onClick={() => q && setReview({ amountIn: n, out: q.out })}
          className={cx('d-btn w-full !py-3 text-sm', from === 'USDT' ? 'd-btn-up' : 'd-btn-down')}
        >
          {!q ? 'Enter an amount' : insufficient ? `Insufficient ${from}` : tooSmall ? 'Minimum 1 USDT' : from === 'USDT' ? 'Buy MBR' : 'Sell MBR for USDT'}
        </button>
      )}
      <p className="t-muted flex items-start gap-1.5 text-[10px] leading-relaxed">
        <Info className="mt-px h-3 w-3 shrink-0" />
        {from === 'USDT'
          ? 'Every buy pays 2% to all MBR holders as holding reward and credits your upline’s referral reward.'
          : 'Sold MBR settles to your USDT balance. Withdraw USDT to Binance and cash out through P2P.'}
      </p>
    </div>
  );
};

const Row: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex justify-between gap-3">
    <span className="t-muted">{k}</span>
    <span className="t-soft text-right">{v}</span>
  </div>
);
