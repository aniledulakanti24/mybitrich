import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Search, Send, Share2, UserPlus, Users } from 'lucide-react';
import { useWallet, type Level } from '../state/WalletProvider';
import { DASH, fmtNum, fmtUsd, shortAddr, timeAgo } from '../config';
import { AnimatedTabs, CopyButton, HeroBanner, SpotlightCard, cx } from '../ui';
import { TeamIllustration } from '../illustrations';

const LEVEL_COLORS = ['#e2b54c', '#c084fc', '#38bdf8'];
const ACTIVE_MS = 30 * 86_400_000;
const tooltipStyle = { background: 'var(--d-surface-2)', border: '1px solid var(--d-line-strong)', borderRadius: 12, fontSize: 12, color: 'var(--d-text)' };

export const TeamSection: React.FC<{ referralCode: string }> = ({ referralCode }) => {
  const { state, price } = useWallet();
  const [level, setLevel] = useState<'all' | '1' | '2' | '3'>('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<'volume' | 'joined' | 'earned'>('volume');
  const link = `https://mybitrich.com/?ref=${referralCode}`;
  const now = Date.now();

  const levels = ([1, 2, 3] as Level[]).map((l) => {
    const members = state.team.filter((m) => m.level === l);
    return {
      level: l,
      count: members.length,
      active: members.filter((m) => now - m.lastBuyAt < ACTIVE_MS).length,
      volume: members.reduce((a, m) => a + m.volumeUsdt, 0),
      earned: state.referralByLevel[l - 1],
    };
  });
  const teamVolume = levels.reduce((a, l) => a + l.volume, 0);

  const growth = useMemo(() => {
    const weeks = 12;
    const start = now - weeks * 7 * 86_400_000;
    const buckets = Array.from({ length: weeks }, (_, i) => ({ week: new Date(start + i * 7 * 86_400_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), L1: 0, L2: 0, L3: 0 }));
    state.team.forEach((m) => {
      const i = Math.floor((m.joinedAt - start) / (7 * 86_400_000));
      if (i >= 0 && i < weeks) buckets[i][`L${m.level}` as 'L1' | 'L2' | 'L3']++;
    });
    return buckets;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.team.length]);

  const members = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = state.team.filter((m) => (level === 'all' || m.level === Number(level)) && (!term || m.handle.includes(term) || m.wallet.toLowerCase().includes(term)));
    const key = { volume: (m: typeof list[0]) => m.volumeUsdt, joined: (m: typeof list[0]) => m.joinedAt, earned: (m: typeof list[0]) => m.earnedMbr }[sort];
    return [...list].sort((a, b) => key(b) - key(a));
  }, [state.team, level, q, sort]);
  const sponsorName = (id?: string) => state.team.find((m) => m.id === id)?.handle ?? 'You';

  const shareText = encodeURIComponent(`Join me on MyBitRich (MBR). Buy with USDT and earn holding rewards: ${link}`);

  return (
    <div className="space-y-5">
      <HeroBanner
        title="Grow your team, grow your rewards"
        subtitle="Every MBR buy by someone you invited pays you up to 2%: 1% from direct invites, 0.6% from their invites and 0.4% from the level after."
        art={<TeamIllustration className="h-full w-auto" />}
      >
        <span className="d-chip d-chip-gold">{state.team.length} members</span>
        <span className="d-chip d-chip-up">{fmtNum(state.referralReward)} MBR earned</span>
      </HeroBanner>

      <div className="grid gap-5 xl:grid-cols-3">
        <SpotlightCard className="p-5 xl:col-span-2" beam>
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="shrink-0 self-center rounded-xl bg-white p-2.5">
              <QRCodeSVG value={link} size={120} level="M" />
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold"><UserPlus className="t-gold h-4 w-4" /> Invite & earn up to 2% on every buy</div>
                <p className="t-muted mt-1 text-xs">When someone joins with your link and buys MBR, you earn 1% of their MBR. Their invites earn you 0.6%, and the next level 0.4%.</p>
              </div>
              <div className="flex items-center gap-2 rounded-xl border bg-surface-2 p-1.5 pl-3">
                <span className="font-code min-w-0 flex-1 truncate text-xs t-gold">{link}</span>
                <CopyButton text={link} label="Copy link" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="d-chip">Code <b className="ml-1 text-[var(--d-text)]">{referralCode}</b></span>
                <CopyButton text={referralCode} />
                <a className="d-btn d-btn-ghost !py-1.5 text-xs" href={`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${shareText}`} target="_blank" rel="noopener noreferrer"><Send className="h-3.5 w-3.5" /> Telegram</a>
                <a className="d-btn d-btn-ghost !py-1.5 text-xs" href={`https://wa.me/?text=${shareText}`} target="_blank" rel="noopener noreferrer"><Share2 className="h-3.5 w-3.5" /> WhatsApp</a>
                <a className="d-btn d-btn-ghost !py-1.5 text-xs" href={`https://twitter.com/intent/tweet?text=${shareText}`} target="_blank" rel="noopener noreferrer">𝕏 Post</a>
              </div>
            </div>
          </div>
        </SpotlightCard>
        <SpotlightCard className="grid grid-cols-2 gap-3 p-5">
          {[
            ['Team members', fmtNum(state.team.length)],
            ['Active (30d)', fmtNum(levels.reduce((a, l) => a + l.active, 0))],
            ['Team buy volume', fmtUsd(teamVolume)],
            ['Referral reward', <span className="t-gold">{fmtNum(state.referralReward)} MBR</span>],
          ].map(([k, v]) => (
            <div key={k as string}>
              <div className="t-muted text-[11px]">{k}</div>
              <div className="mt-0.5 font-display text-lg font-bold">{v}</div>
            </div>
          ))}
          <div className="t-muted col-span-2 text-[11px]">≈ {fmtUsd(state.referralReward * price)} at current price</div>
        </SpotlightCard>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {levels.map((l) => (
          <SpotlightCard key={l.level} className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-2 text-sm font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: LEVEL_COLORS[l.level - 1] }} />Level {l.level} {l.level === 1 ? '· Direct' : l.level === 2 ? '· Network' : '· Community'}</span>
              <span className="d-chip" style={{ color: LEVEL_COLORS[l.level - 1] }}>{DASH.referralRates[l.level - 1] * 100}%</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div><div className="t-muted text-[11px]">Members</div><div className="font-display text-lg font-bold">{l.count}</div></div>
              <div><div className="t-muted text-[11px]">Active</div><div className="font-display text-lg font-bold">{l.active}</div></div>
              <div><div className="t-muted text-[11px]">Volume</div><div className="font-display text-lg font-bold">${fmtNum(l.volume)}</div></div>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-lg bg-surface-2 px-3 py-2 text-xs">
              <span className="t-muted">Earned from level</span>
              <span className="t-gold font-semibold">{fmtNum(l.earned)} MBR</span>
            </div>
          </SpotlightCard>
        ))}
      </div>

      <SpotlightCard className="p-4">
        <div className="mb-3 text-sm font-semibold">Team growth · new members per week</div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={growth} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid stroke="rgba(148,163,184,0.16)" vertical={false} />
              <XAxis dataKey="week" tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#7d8aa3', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              {(['L1', 'L2', 'L3'] as const).map((k, i) => <Bar key={k} dataKey={k} name={`Level ${i + 1}`} stackId="a" fill={LEVEL_COLORS[i]} radius={i === 2 ? [4, 4, 0, 0] : 0} />)}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </SpotlightCard>

      <SpotlightCard className="overflow-hidden">
        <div className="flex flex-col gap-3 border-b p-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2 px-1 text-sm font-semibold"><Users className="h-4 w-4 t-gold" /> Team members</div>
          <div className="flex flex-wrap gap-2">
            <AnimatedTabs layoutId="team-level" size="sm" value={level} onChange={setLevel} tabs={[{ id: 'all', label: 'All' }, { id: '1', label: 'L1' }, { id: '2', label: 'L2' }, { id: '3', label: 'L3' }]} />
            <select value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} className="d-input !w-auto !py-1.5 text-xs">
              <option value="volume">Top volume</option>
              <option value="earned">Top earned</option>
              <option value="joined">Newest</option>
            </select>
            <label className="relative">
              <Search className="t-muted absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search member" className="d-input !w-44 !py-1.5 pl-8 text-xs" />
            </label>
          </div>
        </div>
        {state.team.length === 0 ? (
          <div className="py-14 text-center">
            <TeamIllustration className="mx-auto mb-3 h-36 w-auto" />
            <div className="font-semibold">No team members yet</div>
            <div className="t-muted mt-1 text-sm">Share your referral link above. Every buy by your team earns you MBR.</div>
          </div>
        ) : (
          <div className="d-scroll max-h-[480px] overflow-auto" data-lenis-prevent>
            <table className="d-table w-full">
              <thead className="sticky top-0 bg-surface">
                <tr>
                  <th>Member</th>
                  <th>Level</th>
                  <th>Invited by</th>
                  <th>Joined</th>
                  <th className="!text-right">Buy volume</th>
                  <th className="!text-right">Your reward</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => {
                  const active = now - m.lastBuyAt < ACTIVE_MS;
                  return (
                    <tr key={m.id}>
                      <td>
                        <div className="font-medium">{m.handle}</div>
                        <div className="t-muted font-code text-[11px]">{shortAddr(m.wallet)}</div>
                      </td>
                      <td><span className="d-chip" style={{ color: LEVEL_COLORS[m.level - 1] }}>L{m.level}</span></td>
                      <td className="t-soft">{sponsorName(m.sponsor)}</td>
                      <td className="t-muted">{timeAgo(m.joinedAt)}</td>
                      <td className="!text-right">{fmtUsd(m.volumeUsdt)}</td>
                      <td className="t-gold !text-right font-semibold">+{fmtNum(m.earnedMbr)} MBR</td>
                      <td><span className={cx('d-chip', active ? 'd-chip-up' : '')}>{active ? 'Active' : 'Idle'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!members.length && <div className="t-muted py-10 text-center text-sm">No members match.</div>}
          </div>
        )}
      </SpotlightCard>
    </div>
  );
};
