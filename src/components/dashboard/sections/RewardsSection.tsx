import React, { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Calculator, Gift, Sparkles } from 'lucide-react';
import { useWallet } from '../state/WalletProvider';
import { DASH, dayKey, fmtCompactUsd, fmtNum, fmtUsd } from '../config';
import { AnimatedTabs, HeroBanner, NumberTicker, SpotlightCard } from '../ui';
import { EmptyIllustration, RewardsIllustration } from '../illustrations';
import { TxRow } from './TransactionsSection';

const tooltipStyle = { background: 'var(--d-surface-2)', border: '1px solid var(--d-line-strong)', borderRadius: 12, fontSize: 12, color: 'var(--d-text)' };

export const RewardsSection: React.FC = () => {
  const { state, price, stats } = useWallet();
  const [days, setDays] = useState<'14' | '30' | '60'>('30');
  const [simVolume, setSimVolume] = useState(Math.round(stats.volume24h / 1000) * 1000 || 50_000);

  const daily = useMemo(() => {
    const n = Number(days);
    return Array.from({ length: n }, (_, i) => {
      const t = Date.now() - (n - 1 - i) * 86_400_000;
      const b = state.rewardDays[dayKey(t)] ?? { holding: 0, referral: 0 };
      return { day: new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), holding: +b.holding.toFixed(2), referral: +b.referral.toFixed(2) };
    });
  }, [state.rewardDays, days]);

  const share = state.mbr / DASH.totalSupply;
  const holderPoolUsd = stats.volume24h * DASH.tax.holders;
  const estDailyMbr = (holderPoolUsd * share) / price;
  const simDailyMbr = ((simVolume * DASH.tax.holders) * share) / price;
  const total = state.holdingReward + state.referralReward;
  const rewardTxs = state.txs.filter((t) => t.kind === 'holding_reward' || t.kind === 'referral_reward').slice(0, 12);

  return (
    <div className="space-y-5">
      <HeroBanner
        title="Your rewards keep growing"
        subtitle="2% of every MBR trade is shared with holders, so your balance grows without staking. Your team's buys add referral reward on top."
        art={<RewardsIllustration className="h-full w-auto" />}
      >
        <span className="d-chip d-chip-up"><span className="d-pulse-dot" /> Accruing live</span>
        <span className="d-chip">est. {fmtNum(estDailyMbr, 1)} MBR / day</span>
      </HeroBanner>

      <div className="grid gap-4 md:grid-cols-3">
        <SpotlightCard className="p-4" beam>
          <div className="t-muted text-xs">Total rewards</div>
          <div className="mt-1 font-display text-2xl font-bold t-gold"><NumberTicker value={total} format={(v) => fmtNum(v, 2)} /> MBR</div>
          <div className="t-muted text-[11px]">≈ {fmtUsd(total * price)}</div>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <div className="t-muted flex items-center gap-1.5 text-xs"><Sparkles className="t-up h-3.5 w-3.5" /> Holding reward</div>
          <div className="mt-1 font-display text-2xl font-bold t-up"><NumberTicker value={state.holdingReward} format={(v) => fmtNum(v, 2)} /> MBR</div>
          <div className="t-muted text-[11px]">{total > 0 ? ((state.holdingReward / total) * 100).toFixed(1) : 0}% of rewards · est. {fmtNum(estDailyMbr, 1)} MBR/day</div>
        </SpotlightCard>
        <SpotlightCard className="p-4">
          <div className="t-muted flex items-center gap-1.5 text-xs"><Gift className="t-gold h-3.5 w-3.5" /> Referral reward</div>
          <div className="mt-1 font-display text-2xl font-bold">{fmtNum(state.referralReward, 2)} MBR</div>
          <div className="t-muted text-[11px]">L1 {fmtNum(state.referralByLevel[0])} · L2 {fmtNum(state.referralByLevel[1])} · L3 {fmtNum(state.referralByLevel[2])}</div>
        </SpotlightCard>
      </div>

      <SpotlightCard className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold">Daily rewards (MBR)</div>
          <AnimatedTabs layoutId="rw-days" size="sm" value={days} onChange={setDays} tabs={[{ id: '14', label: '14D' }, { id: '30', label: '30D' }, { id: '60', label: '60D' }]} />
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={daily} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} minTickGap={24} />
              <YAxis tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} width={56} tickFormatter={(v) => fmtNum(v)} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={(v: number) => `${fmtNum(v, 2)} MBR`} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#b4bfd2' }} />
              <Bar dataKey="holding" name="Holding" stackId="r" fill="#22c08a" />
              <Bar dataKey="referral" name="Referral" stackId="r" fill="#e2b54c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SpotlightCard className="p-5">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold"><Calculator className="t-gold h-4 w-4" /> How your holding reward is calculated</div>
          <p className="t-muted mb-4 text-xs leading-relaxed">Each buy or sell sends 2% of the trade to holders. Your cut is that pool × your share of the {fmtNum(DASH.totalSupply / 1e6)}M supply. More trading volume means more reward, without staking.</p>
          <div className="space-y-2 rounded-xl border bg-surface-2 p-3 text-xs">
            <Line k="24h trade volume" v={fmtCompactUsd(stats.volume24h)} />
            <Line k="Holder pool (2%)" v={fmtUsd(holderPoolUsd)} />
            <Line k="Your MBR / supply" v={`${fmtNum(state.mbr)} / ${fmtNum(DASH.totalSupply)} = ${(share * 100).toFixed(4)}%`} />
            <div className="border-t pt-2"><Line k="Est. reward today" v={<b className="t-up">{fmtNum(estDailyMbr, 2)} MBR ≈ {fmtUsd(estDailyMbr * price)}</b>} /></div>
          </div>
          <label className="mt-4 block">
            <span className="t-muted flex justify-between text-[11px]"><span>What if daily volume were</span><b className="t-soft">{fmtCompactUsd(simVolume)}</b></span>
            <input type="range" min={10_000} max={5_000_000} step={10_000} value={simVolume} onChange={(e) => setSimVolume(Number(e.target.value))} className="mt-2 w-full accent-[#e2b54c]" />
          </label>
          <div className="mt-2 text-xs">Daily ≈ <b className="t-up">{fmtNum(simDailyMbr, 1)} MBR</b> · Monthly ≈ <b className="t-up">{fmtNum(simDailyMbr * 30)} MBR</b></div>
        </SpotlightCard>

        <SpotlightCard className="p-5">
          <div className="mb-2 text-sm font-semibold">Latest reward credits</div>
          {rewardTxs.length ? (
            <ul className="divide-y divide-[var(--d-line)]">{rewardTxs.map((t) => <TxRow key={t.id} tx={t} compact />)}</ul>
          ) : (
            <div className="t-muted py-6 text-center text-sm"><EmptyIllustration className="mx-auto mb-2 h-28 w-auto" />Hold MBR to start earning holding reward.</div>
          )}
        </SpotlightCard>
      </div>
    </div>
  );
};

const Line: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex justify-between gap-3"><span className="t-muted">{k}</span><span className="t-soft text-right">{v}</span></div>
);
