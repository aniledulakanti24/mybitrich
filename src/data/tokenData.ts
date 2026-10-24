export interface TokenStat {
  label: string;
  value: string;
  subtext: string;
  change?: string;
  isPositive?: boolean;
}

export interface ComparisonCoin {
  name: string;
  symbol: string;
  logo: string;
  accentColor: string;
  passiveYield: string;
  hasYield: boolean;
  yieldScore: number; // 0-10
  txSpeed: string;
  speedScore: number; // 0-10
  gasFee: string;
  feeScore: number; // 0-10 (higher is better/cheaper)
  supplyModel: string;
  isDeflationary: boolean;
  referralModel: string;
  hasReferral: boolean;
  liquiditySecurity: string;
  isLocked: boolean;
  target2035: string;
  summary: string;
}

export const TOKEN_INFO = {
  name: "MyBitRich",
  symbol: "MBR",
  standard: "BEP-20",
  network: "BNB Smart Chain (BSC)",
  chainId: 56,
  rpcUrl: "https://bsc-dataseed.binance.org",
  // Real Verified Contract Addresses from mybitrich.com
  contractAddress: "0x1aAdfcC9D173a67Cbf1957a1d196fEfd430dC449",
  swapProxyAddress: "0xfDb2A6659423aD750a4017E2D9792f96a755fEf8",
  pancakeRouter: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
  usdtAddress: "0x55d398326f99059fF775485246999027B3197955",
  pancakeSwapUrl: "https://pancakeswap.finance/swap?outputCurrency=0x1aAdfcC9D173a67Cbf1957a1d196fEfd430dC449",
  bscScanUrl: "https://bscscan.com/token/0x1aAdfcC9D173a67Cbf1957a1d196fEfd430dC449",
  
  // Real Tokenomics Parameters from mybitrich.com
  totalSupply: 150000000,
  formattedSupply: "150,000,000 MBR",
  decimals: 18,
  
  // Target Valuation Parameters (Df in source)
  targetYear: 2035,
  targetPriceUsd: 2000,
  impliedMarketCapUsd: 300000000000, // $300B
  
  // Current Live Market Estimates
  currentPrice: "$0.00248",
  marketCap: "$372,000",
  holders: "4,850+",
  liquidityLockedYears: 5,
  lpLockLockers: ["Unicrypt", "PinkLock", "Streamflow"],
  recommendedSlippage: "7% – 8%",
  
  // Tagline & Slogans
  kicker: "Earn · Trade · Hold through 2035",
  slogan: "Hold with conviction.",
  motto: "Buy and hold, you will be a billionaire one day.",
};

export const TOKEN_STATS: TokenStat[] = [
  { label: "Token Price", value: "$0.00248", subtext: "+18.4% 24h", change: "+18.4%", isPositive: true },
  { label: "Total Supply", value: "150M MBR", subtext: "Fixed BEP-20 Supply", isPositive: true },
  { label: "Liquidity Lock", value: "5 Years", subtext: "100% locked until 2030–31", isPositive: true },
  { label: "2035 Target", value: "$2,000", subtext: "$300B Implied Cap", change: "800,000x Target", isPositive: true },
];

// The 3 Core Pillars from mybitrich.com (Sge in source)
export const CORE_PILLARS = [
  {
    title: "Zero locking restrictions",
    body: "Buy, trade, and sell your tokens at any time with complete liquidity access. No vesting delays, lockup periods, or withdrawal penalties on your assets.",
    tag: "100% Liquid",
    icon: "Unlock"
  },
  {
    title: "100% locked liquidity pool",
    body: "Initial liquidity is locked securely for 5 years in smart-contract lockers (Unicrypt / PinkLock / Streamflow), ensuring long-term price stability and rug-pull protection.",
    tag: "5-Year Lock",
    icon: "ShieldCheck"
  },
  {
    title: "Automated yield rewards",
    body: "Earn passive token rewards on every taxed DEX transfer — no manual claiming or gas-expensive staking required to participate in the holder allocation.",
    tag: "Frictionless Yield",
    icon: "Coins"
  }
];

// The 6% Tax Breakdown from mybitrich.com (DH in source)
export const TAX_MECHANICS = [
  {
    component: "Holders redistribution",
    rate: "2% buy / 2% sell",
    benefit: "Automated passive yield: every market buy and sell allocates 2% toward holders. Your position is designed to benefit as trading volume grows.",
    color: "#F5C042"
  },
  {
    component: "Auto-liquidity injection",
    rate: "2% buy / 2% sell",
    benefit: "Sustained price floor: 2% automates liquidity growth on every swap. Higher depth reduces volatility, lowers slippage, and supports larger trades.",
    color: "#3DFF9A"
  },
  {
    component: "Marketing & treasury",
    rate: "2% buy / 2% sell",
    benefit: "Continuous project expansion: funding for exchange listings, global partnerships, smart contract audits, and platform development.",
    color: "#38BDF8"
  }
];

// 3-Tier Buy Referral Module from mybitrich.com (Iy in source)
export const REFERRAL_TIERS = [
  { level: 1, pct: 1.0, label: "Level 1 Direct", desc: "1% of the post-tax MBR received by buyers you invite directly." },
  { level: 2, pct: 0.6, label: "Level 2 Network", desc: "0.6% of the post-tax MBR received by second-level buyers." },
  { level: 3, pct: 0.4, label: "Level 3 Community", desc: "0.4% of the post-tax MBR received by third-level buyers." },
];

// The 4 Roadmap Phases from mybitrich.com (LH in source)
export const ROADMAP_PHASES = [
  {
    phase: 1,
    title: "Token Launch & Liquidity Foundation",
    years: "2025 – 2026",
    status: "Active",
    progress: 80,
    items: [
      "Deploy smart contract with 6% buy/sell tax and 3-tier buy referral module.",
      "Execute 5-year liquidity lock (100% initial LP locked until 2030–2031).",
      "Launch web dApp and complete third-party smart contract audits.",
      "Submit CoinGecko / CoinMarketCap listings.",
      "Grow community through referral competitions and X/Telegram marketing."
    ]
  },
  {
    phase: 2,
    title: "Utility Integration & Staking Ecosystem",
    years: "2027 – 2028",
    status: "Upcoming",
    progress: 20,
    items: [
      "Launch native dApp staking with boosted yield pools.",
      "Integrate zero-tax P2P trading and automated reward analytics.",
      "Add cross-chain bridge support across major EVM chains and Solana.",
      "Gradually lower transaction taxes as organic volume grows."
    ]
  },
  {
    phase: 3,
    title: "Ecosystem Expansion & RWA Integration",
    years: "2029 – 2031",
    status: "Planned",
    progress: 0,
    items: [
      "Review and extend 5-year liquidity locks for additional multi-year terms.",
      "Introduce DeFi lending and borrowing utility.",
      "Partner with payment processors for global e-commerce token payments.",
      "Transition governance to a fully decentralized DAO."
    ]
  },
  {
    phase: 4,
    title: "Sovereign Blockchain & Ecosystem Maturity",
    years: "2032 – 2035",
    status: "Target 2035",
    progress: 0,
    items: [
      "Migration from token to native coin on a proprietary high-speed Layer-1 / Layer-2.",
      "Target Tier-1 CEX listings (Binance, Coinbase, OKX).",
      "Expand institutional liquidity and enterprise adoption.",
      "Long-term valuation growth toward $2,000 USD per token ($300B market cap)."
    ]
  }
];

// Coin Comparison Data
export const COMPARISON_DATA: ComparisonCoin[] = [
  {
    name: "MyBitRich",
    symbol: "MBR",
    logo: "👑",
    accentColor: "#F5C042",
    passiveYield: "2% Automated DEX reflection directly to holder balances",
    hasYield: true,
    yieldScore: 10,
    txSpeed: "~3 Seconds (BNB Smart Chain)",
    speedScore: 9.8,
    gasFee: "< $0.05",
    feeScore: 9.8,
    supplyModel: "Fixed 150 Million MBR with 2% auto-liquidity depth",
    isDeflationary: true,
    referralModel: "3-Tier Buy Referral (2.0% total)",
    hasReferral: true,
    liquiditySecurity: "100% Locked for 5 Years (Unicrypt/PinkLock/Streamflow)",
    isLocked: true,
    target2035: "$2,000 / token ($300B Market Cap)",
    summary: "Engineered for long-term compound wealth through automated transaction yield and permanent liquidity backing."
  },
  {
    name: "Bitcoin",
    symbol: "BTC",
    logo: "₿",
    accentColor: "#F7931A",
    passiveYield: "0% (Zero reflection or passive yield without custody lending)",
    hasYield: false,
    yieldScore: 0,
    txSpeed: "10 – 60 Minutes",
    speedScore: 2.5,
    gasFee: "$4.00 – $35.00+",
    feeScore: 2.0,
    supplyModel: "21M Capped (Halving mining schedule)",
    isDeflationary: false,
    referralModel: "None",
    hasReferral: false,
    liquiditySecurity: "Decentralized PoW Network",
    isLocked: false,
    target2035: "2x – 3x (Market saturated over $1.3T+)",
    summary: "Macro digital gold, but yields 0 new coins for holding and suffers from slow block confirmations."
  },
  {
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "Ð",
    accentColor: "#C2A633",
    passiveYield: "0% (Zero yield mechanism)",
    hasYield: false,
    yieldScore: 0,
    txSpeed: "1 – 2 Minutes",
    speedScore: 6.0,
    gasFee: "$0.30 – $1.20",
    feeScore: 6.5,
    supplyModel: "Infinite (+5 Billion new coins minted every single year)",
    isDeflationary: false,
    referralModel: "None",
    hasReferral: false,
    liquiditySecurity: "None (Decentralized PoW)",
    isLocked: false,
    target2035: "Speculative Meme Cycle Dependent",
    summary: "Infinite inflationary supply consistently dilutes long-term holders with zero reflections."
  },
  {
    name: "Shiba Inu",
    symbol: "SHIB",
    logo: "🐕",
    accentColor: "#E84142",
    passiveYield: "0% (Manual staking on Ethereum with high gas)",
    hasYield: false,
    yieldScore: 2.0,
    txSpeed: "15 – 30 Seconds",
    speedScore: 7.0,
    gasFee: "$5.00 – $30.00 (Ethereum Layer 1)",
    feeScore: 3.0,
    supplyModel: "589 Trillion supply with sporadic manual burns",
    isDeflationary: false,
    referralModel: "None",
    hasReferral: false,
    liquiditySecurity: "Community LP",
    isLocked: false,
    target2035: "High supply ceiling dampens growth",
    summary: "High gas fees on Ethereum eat into small balances, with no native automated DEX reflection."
  },
  {
    name: "Pepe Coin",
    symbol: "PEPE",
    logo: "🐸",
    accentColor: "#00BA54",
    passiveYield: "0% (Pure speculative meme token)",
    hasYield: false,
    yieldScore: 0,
    txSpeed: "15 – 30 Seconds",
    speedScore: 7.0,
    gasFee: "$4.00 – $22.00",
    feeScore: 3.5,
    supplyModel: "Fixed 420 Trillion supply without reflection",
    isDeflationary: false,
    referralModel: "None",
    hasReferral: false,
    liquiditySecurity: "Uniswap LP",
    isLocked: false,
    target2035: "Meme cycle volatility",
    summary: "High volatility meme asset with zero built-in yield or structured institutional liquidity roadmap."
  }
];

export const GETTING_STARTED_STEPS = [
  {
    step: "01",
    title: "Choose your wallet",
    description: "A wallet is necessary for people wanting to use, trade, or hold MyBitRich. You can pick a Web3 wallet compatible with BNB Smart Chain.",
    subtext: "MetaMask, Trust Wallet, Binance Web3 Wallet, or Rabby.",
    points: [
      "MetaMask — Industry gold standard for Chrome, Brave & Mobile",
      "Trust Wallet — Official Binance mobile wallet with dApp browser",
      "Binance Web3 Wallet — Seamless exchange wallet integration",
      "Rabby Wallet — Multi-chain security with built-in transaction simulation"
    ]
  },
  {
    step: "02",
    title: "Configure your wallet",
    description: "After downloading, configure your wallet according to our BNB Smart Chain network settings and import the verified MBR smart contract.",
    subtext: "Chain ID: 56 · Symbol: BNB · Decimals: 18",
    points: [
      "Network: BNB Smart Chain Mainnet",
      "RPC URL: https://bsc-dataseed.binance.org",
      "Chain ID: 56 | Symbol: BNB",
      "Contract: 0x1aAdfcC9D173a67Cbf1957a1d196fEfd430dC449",
      "Token Symbol: MBR | Decimals: 18"
    ]
  },
  {
    step: "03",
    title: "Get some MyBitRich",
    description: "There’s lots of ways to get your hands on some MyBitRich. Swap BNB or USDT directly on PancakeSwap or use our integrated instant swap portal.",
    subtext: "Slippage 7% – 8% covers reflection & liquidity tax",
    points: [
      "Deposit BNB or USDT (BEP-20) into your configured wallet",
      "Connect to PancakeSwap or our built-in instant swap widget",
      "Set Slippage to 7% – 8% to accommodate the 6% transaction tax",
      "Confirm Swap & Hold: your balance increases as global volume flows"
    ]
  }
];

export const FAQ_ITEMS = [
  {
    q: "What is MyBitRich (MBR) and how does it create wealth?",
    a: "MyBitRich is an automated wealth-compounding crypto protocol built on BNB Smart Chain. Its foundational motto is 'Buy and hold, you will be a billionaire one day.' Every market trade has a 6% tax: 2% is automatically distributed back to all token holders, 2% is injected into locked liquidity to raise the price floor, and 2% funds marketing and treasury. As trading volume grows globally, your token balance multiplies automatically without manual staking."
  },
  {
    q: "How does the 2% automated holders redistribution work?",
    a: "Unlike traditional staking which requires locking your tokens in risky smart contracts and paying gas to claim, MyBitRich reflection rewards are completely frictionless. The smart contract automatically credits your wallet balance on every DEX transaction in proportion to your holdings."
  },
  {
    q: "What is the 2035 target of $2,000 per token?",
    a: "MyBitRich outlines a strategic decade trajectory targeting $2,000 per token by 2035, representing a $300B implied market cap based on the fixed 150 Million MBR total supply. This is achieved through multi-phase expansion: staking pools, RWA backing, DAO transition, and eventual migration to a sovereign high-speed Layer-1 blockchain."
  },
  {
    q: "Is the liquidity pool locked?",
    a: "Yes. 100% of the initial liquidity pool is securely locked for 5 years through smart-contract lockers (Unicrypt, PinkLock, and Streamflow) until 2030–2031. Phase 3 of the roadmap plans to review and extend these locks for additional multi-year terms."
  },
  {
    q: "What slippage should I use on PancakeSwap?",
    a: "Because MyBitRich has a 6% transaction tax (2% holder yield + 2% auto-liquidity + 2% treasury), we recommend setting your slippage tolerance to 7% – 8% on PancakeSwap to ensure smooth order execution."
  },
  {
    q: "How does the 3-tier buy referral module work?",
    a: "When you refer new holders through the dApp referral engine, you earn instant commissions across 3 tiers: Level 1 pays 1.0%, Level 2 pays 0.6%, and Level 3 pays 0.4%, totalling 2.0% in rewards paid directly to your wallet."
  }
];
