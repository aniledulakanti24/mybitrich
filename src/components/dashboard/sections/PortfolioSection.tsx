import React, { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useWallet } from '../state/WalletProvider';
import { usePortfolioHistory } from '../state/history';
import { DASH, fmtCompactUsd, fmtNum, fmtPct, fmtPrice, fmtUsd, type Asset } from '../config';
import { AnimatedTabs, NumberTicker, SectionHeader, SpotlightCard, TokenIcon, cx } from '../ui';
import type { OverviewActions } from './OverviewSection';

type Range = '7D' | '30D' | '90D';
const RANGE: Record<Range, { points: number; step: number }> = {
  '7D': { points: 7 * 6 + 1, step: 4 * 3_600_000 },
  '30D': { points: 31, step: 86_400_000 },
  '90D': { points: 88, step: 86_400_000 },
};

const tooltipStyle = { background: 'var(--d-surface-2)', border: '1px solid var(--d-line-strong)', borderRadius: 12, fontSize: 12, color: 'var(--d-text)' };

export const PortfolioSection: React.FC<Pick<OverviewActions, 'openFunds' | 'openSwap'>> = ({ openFunds, openSwap }) => {
  const { state, price, stats } = useWallet();
  const [range, setRange] = useState<Range>('30D');
  const hist = usePortfolioHistory(RANGE[range].points, RANGE[range].step);
  const mbrValue = state.mbr * price;
  const total = state.usdt + mbrValue;
  const start = hist[0]?.value ?? total;
  const rangeChange = start > 0 ? total / start - 1 : 0;

  // Cost basis: USDT that went into MBR (net of sells) vs current MBR value
  const avgEntry = state.boughtMbr > 0 ? state.spentUsdt / state.boughtMbr : 0;
  const netInvested = state.usdtDeposited - state.usdtWithdrawn;
  const pnl = total - netInvested - state.mbrDeposited * avgEntry + state.mbrWithdrawn * avgEntry;
  const earned = (state.holdingReward + state.referralReward) * price;

  const alloc = [
    { name: 'MBR', value: mbrValue, color: '#e2b54c' },
    { name: 'USDT', value: state.usdt, color: '#26A17B' },
  ];

  const holdings: { asset: Asset; balance: number; price: number; value: number; change: number }[] = [
    { asset: 'MBR', balance: state.mbr, price, value: mbrValue, change: stats.change24h },
    { asset: 'USDT', balance: state.usdt, price: 1, value: state.usdt, change: 0 },
  ];

  return (
    <div className="space-y-5">
      <SectionHeader title="Portfolio overview" subtitle="Balances, allocation and performance across USDT and MBR." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { k: 'Total value', v: <NumberTicker value={total} format={(x) => fmtUsd(x)} />, s: <span className={rangeChange >= 0 ? 't-up' : 't-down'}>{fmtPct(rangeChange)} in {range}</span> },
          { k: 'Net USDT invested', v: fmtUsd(netInvested), s: `${fmtUsd(state.usdtDeposited)} in · ${fmtUsd(state.usdtWithdrawn)} out` },
          { k: 'Profit / loss', v: <span className={pnl >= 0 ? 't-up' : 't-down'}>{pnl >= 0 ? '+' : '−'}{fmtUsd(Math.abs(pnl))}</span>, s: `vs. net USDT invested` },
          { k: 'Rewards earned', v: <span className="t-gold">{fmtUsd(earned)}</span>, s: `${fmtNum(state.holdingReward + state.referralReward)} MBR from holding + referrals` },
        ].map((m) => (
          <SpotlightCard key={m.k} className="p-4">
            <div className="t-muted text-xs">{m.k}</div>
            <div className="d-sensitive mt-1 font-display text-xl font-bold">{m.v}</div>
            <div className="t-muted mt-1 text-[11px]">{m.s}</div>
          </SpotlightCard>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        <SpotlightCard className="p-4 xl:col-span-2">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div className="text-sm font-semibold">Portfolio value</div>
            <AnimatedTabs layoutId="pf-range" size="sm" value={range} onChange={setRange} tabs={(['7D', '30D', '90D'] as Range[]).map((r) => ({ id: r, label: r }))} />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hist} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="pf-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e2b54c" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#e2b54c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
                <XAxis dataKey="t" tickFormatter={(t) => new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={40} />
                <YAxis tickFormatter={(v) => fmtCompactUsd(v)} tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} width={64} domain={['auto', 'auto']} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(t) => new Date(t as number).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  formatter={(v: number, name) => [fmtUsd(v), name === 'value' ? 'Total' : name]}
                />
                <Area type="monotone" dataKey="value" stroke="#e2b54c" strokeWidth={2} fill="url(#pf-fill)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        <SpotlightCard className="p-4">
          <div className="mb-2 text-sm font-semibold">Allocation</div>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={alloc} dataKey="value" innerRadius="68%" outerRadius="92%" paddingAngle={total > 0 && state.usdt > 0 && mbrValue > 0 ? 3 : 0} stroke="none" isAnimationActive={false}>
                  {alloc.map((a) => <Cell key={a.name} fill={a.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number, n) => [fmtUsd(v), n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <div className="t-muted text-[11px]">Total</div>
              <div className="font-display text-lg font-bold">{fmtCompactUsd(total)}</div>
            </div>
          </div>
          <ul className="mt-2 space-y-2">
            {alloc.map((a) => (
              <li key={a.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: a.color }} />{a.name}</span>
                <span className="t-soft">{fmtUsd(a.value)} · {total > 0 ? ((a.value / total) * 100).toFixed(1) : '0.0'}%</span>
              </li>
            ))}
          </ul>
        </SpotlightCard>
      </div>

      <SpotlightCard className="overflow-hidden">
        <div className="border-b px-4 py-3 text-sm font-semibold">Holdings</div>
        <div className="d-scroll overflow-x-auto">
          <table className="d-table w-full">
            <thead>
              <tr>
                <th>Asset</th>
                <th className="!text-right">Balance</th>
                <th className="!text-right">Price</th>
                <th className="!text-right">24h</th>
                <th className="!text-right">Value</th>
                <th className="!text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h) => (
                <tr key={h.asset}>
                  <td>
                    <span className="flex items-center gap-2.5">
                      <TokenIcon asset={h.asset} size={26} />
                      <span>
                        <span className="block font-semibold">{h.asset}</span>
                        <span className="t-muted text-[11px]">{h.asset === 'MBR' ? 'MyBitRich · BEP-20' : 'Tether USD · TRC-20 / BEP-20 / ERC-20'}</span>
                      </span>
                    </span>
                  </td>
                  <td className="!text-right font-semibold">{fmtNum(h.balance, 2)}</td>
                  <td className="t-soft !text-right">{h.asset === 'MBR' ? fmtPrice(h.price) : '1.00'}</td>
                  <td className={cx('!text-right', h.change > 0 ? 't-up' : h.change < 0 ? 't-down' : 't-muted')}>{h.asset === 'MBR' ? fmtPct(h.change) : '—'}</td>
                  <td className="!text-right font-semibold">{fmtUsd(h.value)}</td>
                  <td className="!text-right">
                    <span className="inline-flex gap-1.5">
                      <button className="d-btn d-btn-ghost !px-2.5 !py-1 text-xs" onClick={() => openFunds('deposit', h.asset)}>Deposit</button>
                      <button className="d-btn d-btn-ghost !px-2.5 !py-1 text-xs" onClick={() => openFunds('withdraw', h.asset)}>Withdraw</button>
                      <button className="d-btn d-btn-ghost !px-2.5 !py-1 text-xs" onClick={() => openSwap(h.asset)}>{h.asset === 'MBR' ? 'Sell' : 'Buy MBR'}</button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="t-muted grid gap-2 border-t px-4 py-3 text-[11px] sm:grid-cols-3">
          <span>Average MBR entry: <b className="t-soft">{avgEntry ? fmtPrice(avgEntry) : '—'} USDT</b></span>
          <span>Current price: <b className="t-soft">{fmtPrice(price)} USDT</b> {avgEntry > 0 && <span className={price >= avgEntry ? 't-up' : 't-down'}>({fmtPct(price / avgEntry - 1)})</span>}</span>
          <span>Share of {fmtNum(DASH.totalSupply / 1e6)}M supply: <b className="t-soft">{((state.mbr / DASH.totalSupply) * 100).toFixed(4)}%</b></span>
        </div>
      </SpotlightCard>
    </div>
  );
};
