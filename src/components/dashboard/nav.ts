import {
  CandlestickChart,
  Gift,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  MessageSquareHeart,
  PieChart,
  ReceiptText,
  Settings as SettingsIcon,
  Users,
} from 'lucide-react';
import type React from 'react';

export type SectionId = 'overview' | 'trade' | 'portfolio' | 'team' | 'rewards' | 'transactions' | 'settings' | 'help' | 'support' | 'feedback';
export type SettingsTab = 'profile' | 'security' | 'notifications' | 'addresses' | 'preferences';

export interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ElementType;
  desc: string;
  /** false = reachable from the More panel / search only, not listed in the rail */
  rail?: boolean;
}

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Wallet',
    items: [
      { id: 'overview', label: 'Overview', icon: LayoutDashboard, desc: 'Your balances, rewards and the live MBR market' },
      { id: 'trade', label: 'Trade MBR', icon: CandlestickChart, desc: 'Live chart with indicators, drawings and alerts' },
      { id: 'portfolio', label: 'Portfolio', icon: PieChart, desc: 'Allocation, performance and holdings' },
      { id: 'transactions', label: 'Transactions', icon: ReceiptText, desc: 'Every deposit, withdrawal, swap and reward' },
    ],
  },
  {
    title: 'Earn',
    items: [
      { id: 'team', label: 'Team', icon: Users, desc: 'Invite friends and track your 3-level network' },
      { id: 'rewards', label: 'Rewards', icon: Gift, desc: 'Holding and referral rewards over time' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help center', icon: HelpCircle, desc: 'Guides and answers to common questions' },
      { id: 'support', label: 'Support tickets', icon: LifeBuoy, desc: 'Chat with our team about any issue' },
      { id: 'feedback', label: 'Feedback', icon: MessageSquareHeart, desc: 'Rate the app and vote on new features', rail: false },
      { id: 'settings', label: 'Settings', icon: SettingsIcon, desc: 'Profile, security, notifications and preferences', rail: false },
    ],
  },
];

export const NAV = NAV_GROUPS.flatMap((g) => g.items);
