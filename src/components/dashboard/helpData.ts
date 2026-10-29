// Help-center content shared by the Help section and the command palette search.
export type HelpCategory = 'Getting started' | 'Deposits' | 'Withdrawals' | 'Swap & tax' | 'Rewards' | 'Referral' | 'Security';

export interface FaqItem {
  id: string;
  category: HelpCategory;
  q: string;
  a: string;
}

export const HELP_CATEGORIES: { id: HelpCategory; blurb: string }[] = [
  { id: 'Getting started', blurb: 'Your first MBR in 3 steps' },
  { id: 'Deposits', blurb: 'Networks, addresses, timing' },
  { id: 'Withdrawals', blurb: 'Fees, limits, cashing out' },
  { id: 'Swap & tax', blurb: 'The 6% tax and slippage' },
  { id: 'Rewards', blurb: 'How holding reward grows' },
  { id: 'Referral', blurb: 'Levels and payouts' },
  { id: 'Security', blurb: '2FA, sessions, safe addresses' },
];

export const FAQ: FaqItem[] = [
  { id: 'gs1', category: 'Getting started', q: 'How do I buy MBR?', a: 'Buy USDT on Binance (Spot or P2P) or any exchange, deposit it here on TRC-20, BEP-20 or ERC-20, then use Swap to convert USDT into MBR. The MBR lands in your dashboard balance instantly.' },
  { id: 'gs2', category: 'Getting started', q: 'Do I need my own crypto wallet?', a: 'No. Your dashboard holds your USDT and MBR balances. You only need a wallet or exchange account to send USDT in, or to receive it when you withdraw.' },
  { id: 'dp1', category: 'Deposits', q: 'Which network should I use to deposit USDT?', a: 'TRC-20 (Tron) usually has the lowest network fee from exchanges, BEP-20 (BNB Smart Chain) is fast and cheap, and ERC-20 (Ethereum) works too but costs more. Always choose the same network on the sending side.' },
  { id: 'dp2', category: 'Deposits', q: 'I sent USDT on the wrong network. Can I get it back?', a: 'Funds sent on a network other than the one you selected usually cannot be recovered. Open a support ticket with the transaction ID right away and we will check whether recovery is possible.' },
  { id: 'dp3', category: 'Deposits', q: 'How long does a deposit take?', a: 'About 1 minute on BEP-20, 2 minutes on TRC-20 and 4 minutes on ERC-20 once the network confirms it. You can close the payment window; the deposit keeps processing.' },
  { id: 'wd1', category: 'Withdrawals', q: 'How do I cash out to my bank?', a: 'Swap MBR to USDT, withdraw USDT to your Binance deposit address on the matching network, then sell it in Binance P2P (Trade → P2P → Sell) for your local currency.' },
  { id: 'wd2', category: 'Withdrawals', q: 'What are the withdrawal fees?', a: 'USDT network fee is 1.5 USDT on TRC-20, 1 USDT on BEP-20 and 5 USDT on ERC-20. MBR withdrawals on BEP-20 cost 250 MBR. The fee is shown before you confirm.' },
  { id: 'wd3', category: 'Withdrawals', q: 'Can I save addresses I use often?', a: 'Yes. Go to Settings → Address book to save labelled addresses per network, and pick them with one tap when withdrawing. You can also allow withdrawals only to saved addresses.' },
  { id: 'sw1', category: 'Swap & tax', q: 'Why is there a 6% tax on swaps?', a: '2% goes to every MBR holder as holding reward, 2% is added to locked liquidity and 2% funds the treasury and marketing. The tax applies to every MBR buy and sell.' },
  { id: 'sw2', category: 'Swap & tax', q: 'What slippage should I set?', a: '7% to 8% covers the 6% tax plus small price movements. If the price moves beyond your tolerance the swap is cancelled and nothing is charged.' },
  { id: 'rw1', category: 'Rewards', q: 'How is my holding reward calculated?', a: 'Every trade sends 2% of its value to holders. Your share equals your MBR divided by the 150M total supply. The reward is added to your MBR balance automatically.' },
  { id: 'rw2', category: 'Rewards', q: 'Do I need to stake or claim rewards?', a: 'No. Holding rewards are credited continuously without staking, locking or claiming.' },
  { id: 'rf1', category: 'Referral', q: 'How much do I earn from referrals?', a: 'You earn 1% of the MBR your direct invites receive on each buy, 0.6% from their invites (Level 2) and 0.4% from Level 3, paid in MBR.' },
  { id: 'rf2', category: 'Referral', q: 'Where is my referral link?', a: 'Open Team in the sidebar. You can copy your link or code, show a QR code, or share it straight to Telegram, WhatsApp or X.' },
  { id: 'sc1', category: 'Security', q: 'How do I protect my account?', a: 'Turn on two-factor authentication, set an anti-phishing code, enable withdrawal whitelist, and sign out of sessions you don’t recognise. All of this is under Settings → Security.' },
  { id: 'sc2', category: 'Security', q: 'Will MyBitRich ever ask for my password or seed phrase?', a: 'Never. Support will never ask for your password, 2FA codes or wallet seed phrase. Our emails always include your anti-phishing code once you set one.' },
];
