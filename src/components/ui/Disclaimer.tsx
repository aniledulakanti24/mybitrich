import React from 'react';
import { Info } from 'lucide-react';

/**
 * Official disclaimer, reused wherever the site shows price targets, projections,
 * yields, comparisons or trading actions. The base sentences mirror mybitrich.com.
 */

export const OFFICIAL_DISCLAIMER =
  'The 2035 valuation target is not a guarantee or financial advice. You interact with contracts through your own wallet.';

export const DOCUMENTATION_NOTICE = 'Non-custodial protocol on BNB Smart Chain. This site is documentation only.';

export const RISK_NOTICE =
  'Cryptocurrency prices are volatile and you could lose some or all of the money you put in. Do your own research (DYOR) before buying or selling.';

export type DisclaimerTopic = 'target' | 'projection' | 'rewards' | 'comparison' | 'trade' | 'market' | 'roadmap';

const TOPIC_NOTES: Record<DisclaimerTopic, string> = {
  target: 'Prices and market-cap figures for 2035 are long-term goals, not forecasts.',
  projection:
    'Results are hypothetical illustrations based on the values you enter and the 2035 target. They are not predictions of future returns.',
  rewards:
    'Holder rewards come from the 2% fee on taxed buys and sells, so the amount you receive depends on trading volume and is not fixed.',
  comparison:
    'This comparison is for information only. Figures for other projects are simplified, may be out of date, and are not a recommendation to buy or sell any asset.',
  trade:
    'Swaps execute on-chain through PancakeSwap and cannot be reversed. A 6% tax applies to buys and sells, and prices can move before your transaction confirms.',
  market: 'Market figures shown are indicative and may be delayed.',
  roadmap: 'Roadmap items and timelines may change as the market and the project develop.',
};

interface DisclaimerProps {
  topic?: DisclaimerTopic;
  /** light (default) for white sections, dark for the space hero / dark surfaces */
  tone?: 'light' | 'dark';
  /** compact drops the risk sentence for tight spaces such as modals */
  compact?: boolean;
  className?: string;
}

export const Disclaimer: React.FC<DisclaimerProps> = ({ topic, tone = 'light', compact = false, className = '' }) => {
  const dark = tone === 'dark';
  return (
    <aside
      role="note"
      aria-label="Official disclaimer"
      className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 text-left text-xs leading-relaxed ${
        dark ? 'border-white/10 bg-white/[0.04] text-slate-400' : 'border-slate-200 bg-white/70 text-slate-500'
      } ${className}`}
    >
      <Info className={`mt-0.5 h-4 w-4 shrink-0 ${dark ? 'text-amber-300/80' : 'text-gold-500'}`} />
      <p>
        <strong className={dark ? 'text-slate-200' : 'text-slate-700'}>Official disclaimer: </strong>
        {topic && <>{TOPIC_NOTES[topic]} </>}
        {OFFICIAL_DISCLAIMER}
        {!compact && <> {RISK_NOTICE}</>}
      </p>
    </aside>
  );
};

export default Disclaimer;
