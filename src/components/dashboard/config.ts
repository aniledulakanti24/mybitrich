// Dashboard-wide parameters. Protocol values (tax, referral rates, supply, target) mirror
// the public tokenomics; platform values (fees, minimums, confirmations) are placeholders
// to be replaced by the backend once the custody/ledger API is live.
export const DASH = {
  pair: 'MBR/USDT',
  network: 'BNB Smart Chain (BEP-20)',
  totalSupply: 150_000_000,
  targetPrice: 2000,
  targetYear: 2035,
  // 6% swap tax: 2% to holders (holding reward), 2% auto-liquidity, 2% treasury
  tax: { holders: 0.02, liquidity: 0.02, treasury: 0.02 },
  referralRates: [0.01, 0.006, 0.004] as const,
  poolLiquidityUsd: 92_000,
  slippageOptions: [7, 7.5, 8],
  defaultSlippage: 7.5,
  assets: {
    USDT: { minDeposit: 10, minWithdraw: 20, withdrawFee: 1, confirmations: 15, decimals: 2 },
    MBR: { minDeposit: 1_000, minWithdraw: 5_000, withdrawFee: 250, confirmations: 15, decimals: 0 },
  },
} as const;

export const TOTAL_TAX = DASH.tax.holders + DASH.tax.liquidity + DASH.tax.treasury;

export type Asset = 'USDT' | 'MBR';

// Transfer networks. USDT moves on all three; MBR is a BEP-20 token so it only uses BEP20.
// Fees, minimums and confirmation counts are placeholders for the custody provider's real values.
export type NetworkId = 'BEP20' | 'TRC20' | 'ERC20';

export interface NetworkInfo {
  id: NetworkId;
  label: string;
  chain: string;
  minDeposit: number;
  minWithdraw: number;
  withdrawFee: number;
  confirmations: number;
  eta: string;
  addressHint: string;
  explorerTx: string;
  color: string;
}

export const NETWORKS: Record<NetworkId, NetworkInfo> = {
  BEP20: { id: 'BEP20', label: 'BEP-20', chain: 'BNB Smart Chain', minDeposit: 10, minWithdraw: 20, withdrawFee: 1, confirmations: 15, eta: '≈ 1 min', addressHint: 'Starts with 0x', explorerTx: 'https://bscscan.com/tx/', color: '#F0B90B' },
  TRC20: { id: 'TRC20', label: 'TRC-20', chain: 'Tron', minDeposit: 10, minWithdraw: 20, withdrawFee: 1.5, confirmations: 20, eta: '≈ 2 min', addressHint: 'Starts with T', explorerTx: 'https://tronscan.org/#/transaction/', color: '#EF0027' },
  ERC20: { id: 'ERC20', label: 'ERC-20', chain: 'Ethereum', minDeposit: 20, minWithdraw: 50, withdrawFee: 5, confirmations: 12, eta: '≈ 4 min', addressHint: 'Starts with 0x', explorerTx: 'https://etherscan.io/tx/', color: '#627EEA' },
};

export const networksFor = (asset: Asset): NetworkInfo[] => (asset === 'USDT' ? [NETWORKS.TRC20, NETWORKS.BEP20, NETWORKS.ERC20] : [NETWORKS.BEP20]);

/** Network-specific rules for an asset (MBR keeps its own token minimums and fee). */
export const transferRules = (asset: Asset, network: NetworkId) => {
  const n = NETWORKS[network];
  return asset === 'USDT'
    ? { minDeposit: n.minDeposit, minWithdraw: n.minWithdraw, withdrawFee: n.withdrawFee, confirmations: n.confirmations }
    : { ...DASH.assets.MBR, confirmations: n.confirmations };
};

export const isAddressFor = (network: NetworkId, a: string) =>
  network === 'TRC20' ? /^T[1-9A-HJ-NP-Za-km-z]{33}$/.test(a.trim()) : /^0x[a-fA-F0-9]{40}$/.test(a.trim());

export const isTxHashFor = (network: NetworkId, h: string) => (network === 'TRC20' ? /^(0x)?[a-fA-F0-9]{64}$/ : /^0x[a-fA-F0-9]{64}$/).test(h.trim());

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
/** Deterministic Tron-format deposit address derived from the account's EVM deposit address. */
export const tronAddressFrom = (evm: string) => {
  let h = 2166136261;
  let out = 'T';
  for (let i = 0; i < 33; i++) {
    h = Math.imul(h ^ evm.charCodeAt((i * 7) % evm.length) ^ i, 16777619) >>> 0;
    out += B58[h % 58];
  }
  return out;
};

export const depositAddressFor = (network: NetworkId, evm: string) => (network === 'TRC20' ? tronAddressFrom(evm) : evm);

export const fmtUsd = (v: number, digits = 2) =>
  `$${v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })}`;

export const fmtCompactUsd = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (abs >= 1e4) return `$${(v / 1e3).toFixed(1)}K`;
  return fmtUsd(v);
};

export const fmtNum = (v: number, digits = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });

export const fmtAsset = (v: number, asset: Asset) =>
  `${fmtNum(v, asset === 'USDT' ? 2 : v < 100 ? 2 : 0)} ${asset}`;

export const fmtPrice = (v: number) => v.toFixed(6);

export const fmtPct = (v: number, digits = 2) => `${v >= 0 ? '+' : ''}${(v * 100).toFixed(digits)}%`;

export const shortAddr = (a: string, head = 6, tail = 4) => (a.length > head + tail ? `${a.slice(0, head)}…${a.slice(-tail)}` : a);

export const isEvmAddress = (a: string) => /^0x[a-fA-F0-9]{40}$/.test(a.trim());

export const randomHex = (len: number, rng: () => number = Math.random) =>
  Array.from({ length: len }, () => Math.floor(rng() * 16).toString(16)).join('');

export const timeAgo = (ms: number) => {
  const s = Math.max(0, Math.floor((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
};

export const fmtDateTime = (ms: number) =>
  new Date(ms).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

export const dayKey = (ms: number) => new Date(ms).toISOString().slice(0, 10);
