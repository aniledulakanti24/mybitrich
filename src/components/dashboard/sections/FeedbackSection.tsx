import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, Lightbulb, Rocket, Send } from 'lucide-react';
import { useAccount } from '../state/account';
import { SectionHeader, SpotlightCard, cx } from '../ui';
import { triggerBillionaireConfetti } from '../../../utils/confetti';

const MOODS = [
  { v: 1, e: '😞', l: 'Poor' },
  { v: 2, e: '😕', l: 'Meh' },
  { v: 3, e: '🙂', l: 'Okay' },
  { v: 4, e: '😀', l: 'Good' },
  { v: 5, e: '🤩', l: 'Love it' },
];
const TOPICS = ['Dashboard', 'Deposits', 'Withdrawals', 'Swap', 'Rewards', 'Team & referral', 'Support', 'Something else'];
const SHIPPED = [
  { t: 'TRC-20, BEP-20 and ERC-20 deposits', d: 'Pay by QR with live confirmation tracking' },
  { t: 'Light, dark and system themes', d: 'Pick yours in Settings → Preferences' },
  { t: 'Help center and support tickets', d: 'Search answers or chat with our team' },
  { t: 'Address book & withdrawal whitelist', d: 'Withdraw to saved addresses in one tap' },
];
const STATUS_CHIP = { Planned: 'd-chip-blue', 'In progress': 'd-chip-up', 'Under review': 'd-chip-gold' } as const;

export const FeedbackSection: React.FC = () => {
  const { account, submitFeedback, voteIdea, addIdea, toast } = useAccount();
  const [rating, setRating] = useState<number | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const [idea, setIdea] = useState('');
  const ideas = [...account.ideas].sort((a, b) => b.votes - a.votes);

  return (
    <div className="space-y-5">
      <SectionHeader title="Feedback" subtitle="Tell us what works, what doesn’t, and what you’d like next." />
      <div className="grid gap-5 lg:grid-cols-5">
        <SpotlightCard className="p-6 lg:col-span-3" beam>
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="thanks" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center py-10 text-center">
                <div className="text-5xl">{MOODS.find((m) => m.v === rating)?.e ?? '🙏'}</div>
                <h3 className="mt-4 font-display text-xl font-bold">Thank you!</h3>
                <p className="t-muted mt-1 max-w-sm text-sm">Every message is read by the product team. You’ve shared feedback {account.feedbackCount} time{account.feedbackCount === 1 ? '' : 's'}.</p>
                <button className="d-btn d-btn-ghost mt-5" onClick={() => { setSent(false); setRating(null); setTopics([]); setText(''); }}>Send more feedback</button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitFeedback();
                  setSent(true);
                  if ((rating ?? 0) >= 4) triggerBillionaireConfetti();
                }}
              >
                <div>
                  <h3 className="font-display text-lg font-bold">How’s your experience with MyBitRich?</h3>
                  <div className="mt-4 grid grid-cols-5 gap-2">
                    {MOODS.map((m) => (
                      <motion.button
                        type="button"
                        key={m.v}
                        whileHover={{ y: -4 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => setRating(m.v)}
                        aria-pressed={rating === m.v}
                        className={cx('flex flex-col items-center gap-1 rounded-2xl border py-3 transition-colors', rating === m.v ? 'border-[var(--d-gold)] bg-[rgba(226,181,76,0.08)]' : 'bg-surface-2 hover:border-[var(--d-line-strong)]')}
                      >
                        <span className={cx('text-2xl transition-transform sm:text-3xl', rating === m.v && 'scale-110')}>{m.e}</span>
                        <span className={cx('text-[11px] font-medium', rating === m.v ? 't-gold' : 't-muted')}>{m.l}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="t-muted mb-2 text-xs font-medium">What is it about? (pick any)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {TOPICS.map((t) => (
                      <button type="button" key={t} onClick={() => setTopics((x) => (x.includes(t) ? x.filter((y) => y !== t) : [...x, t]))} className={cx('d-chip !py-1 !text-xs', topics.includes(t) && 'd-chip-gold')}>{t}</button>
                    ))}
                  </div>
                </div>
                <label className="block">
                  <span className="t-muted mb-2 block text-xs font-medium">Your feedback</span>
                  <textarea className="d-input min-h-[120px] resize-y" maxLength={1500} placeholder="What should we improve or keep doing?" value={text} onChange={(e) => setText(e.target.value)} />
                  <span className="t-muted mt-1 block text-right text-[11px]">{text.length}/1500</span>
                </label>
                <button className="d-btn d-btn-primary w-full !py-3" disabled={!rating}><Send className="h-4 w-4" /> Send feedback</button>
              </motion.form>
            )}
          </AnimatePresence>
        </SpotlightCard>

        <div className="space-y-5 lg:col-span-2">
          <SpotlightCard className="p-5" delay={0.08}>
            <div className="flex items-center gap-2 text-sm font-semibold"><Lightbulb className="t-gold h-4 w-4" /> Feature ideas</div>
            <p className="t-muted mt-1 text-xs">Vote for what we should build next.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addIdea(idea.trim());
                setIdea('');
                toast('Idea added, thanks!');
              }}
            >
              <input className="d-input !py-2" maxLength={80} placeholder="Suggest an idea" value={idea} onChange={(e) => setIdea(e.target.value)} />
              <button className="d-btn d-btn-ghost" disabled={idea.trim().length < 6}>Add</button>
            </form>
            <ul className="mt-3 space-y-2">
              {ideas.map((i) => (
                <motion.li layout key={i.id} className="flex items-center gap-3 rounded-xl border p-2.5">
                  <button onClick={() => voteIdea(i.id)} aria-pressed={i.voted} aria-label={`Vote for ${i.title}`} className={cx('flex w-12 shrink-0 flex-col items-center rounded-lg border py-1 text-xs font-bold transition-colors', i.voted ? 'border-[var(--d-gold)] bg-[rgba(226,181,76,0.1)] t-gold' : 't-soft hover:border-[var(--d-line-strong)]')}>
                    <ChevronUp className="h-4 w-4" />
                    {i.votes}
                  </button>
                  <div className="min-w-0">
                    <div className="text-sm font-medium leading-snug">{i.title}</div>
                    <span className={cx('d-chip mt-1 !py-0 !text-[10px]', STATUS_CHIP[i.status])}>{i.status}</span>
                  </div>
                </motion.li>
              ))}
            </ul>
          </SpotlightCard>

          <SpotlightCard className="p-5" delay={0.16}>
            <div className="flex items-center gap-2 text-sm font-semibold"><Rocket className="t-gold h-4 w-4" /> Recently shipped</div>
            <ol className="relative mt-3 space-y-3 border-l pl-4">
              {SHIPPED.map((s) => (
                <li key={s.t} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--d-up)] ring-4 ring-[var(--d-surface)]" />
                  <div className="text-sm font-medium">{s.t}</div>
                  <div className="t-muted text-xs">{s.d}</div>
                </li>
              ))}
            </ol>
          </SpotlightCard>
        </div>
      </div>
    </div>
  );
};
