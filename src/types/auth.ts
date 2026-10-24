export interface UserProfile {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  mbrBalance: number;
  bnbBalance: number;
  totalEarnedYield: number;
  referralCode: string;
  tier1Count: number;
  tier2Count: number;
  tier3Count: number;
  referralEarningsMbr: number;
  referralEarningsUsdt: number;
  joinedDate: string;
}

export interface ActivityItem {
  id: string;
  type: 'yield' | 'referral' | 'swap' | 'transfer';
  title: string;
  amount: string;
  amountUsd: string;
  timestamp: string;
  txHash: string;
  status: 'completed' | 'pending';
}
