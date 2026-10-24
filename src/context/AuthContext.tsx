import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, ActivityItem } from '../types/auth';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  signupWithEmail: (name: string, email: string, pass: string, refCode?: string) => Promise<boolean>;
  loginWithWallet: (walletAddress: string) => Promise<boolean>;
  logout: () => void;
  updateBalance: (mbrDelta: number, bnbDelta: number) => void;
  activities: ActivityItem[];
  addActivity: (activity: Omit<ActivityItem, 'id' | 'timestamp' | 'status'>) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr-882194',
  name: 'Alex Thorne',
  email: 'investor@mybitrich.com',
  walletAddress: '0x71C8A932E14620F820bE9871D2a3C9b8417',
  mbrBalance: 345000,
  bnbBalance: 3.85,
  totalEarnedYield: 14850,
  referralCode: 'MBR-71C8A9',
  tier1Count: 14,
  tier2Count: 29,
  tier3Count: 68,
  referralEarningsMbr: 42300,
  referralEarningsUsdt: 104.90,
  joinedDate: 'Jan 2025',
};

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'yield',
    title: 'Automated 2% Reflection Yield',
    amount: '+24.50 MBR',
    amountUsd: '+$0.06',
    timestamp: '2 mins ago',
    txHash: '0x3a8f...91bc',
    status: 'completed',
  },
  {
    id: 'act-2',
    type: 'referral',
    title: 'Tier 1 Referral Bonus (1.0%)',
    amount: '+450.00 MBR',
    amountUsd: '+$1.12',
    timestamp: '42 mins ago',
    txHash: '0x992b...fa10',
    status: 'completed',
  },
  {
    id: 'act-3',
    type: 'swap',
    title: 'PancakeSwap Purchase (0.5 BNB)',
    amount: '+112,629 MBR',
    amountUsd: '+$279.32',
    timestamp: '5 hours ago',
    txHash: '0x4d11...bb72',
    status: 'completed',
  },
  {
    id: 'act-4',
    type: 'yield',
    title: 'Automated 2% Reflection Yield',
    amount: '+18.20 MBR',
    amountUsd: '+$0.05',
    timestamp: '8 hours ago',
    txHash: '0x812e...cc90',
    status: 'completed',
  },
  {
    id: 'act-5',
    type: 'referral',
    title: 'Tier 2 Referral Bonus (0.6%)',
    amount: '+180.00 MBR',
    amountUsd: '+$0.45',
    timestamp: '1 day ago',
    txHash: '0x17fa...33d4',
    status: 'completed',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('mbr_user_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    const saved = localStorage.getItem('mbr_user_activities');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ACTIVITIES;
      }
    }
    return INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('mbr_user_session', JSON.stringify(user));
    } else {
      localStorage.removeItem('mbr_user_session');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('mbr_user_activities', JSON.stringify(activities));
  }, [activities]);

  // Live passive micro-yield simulator when user is logged in
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      // Simulate random micro-yield from global trading volume
      const microYield = parseFloat((Math.random() * 0.85 + 0.15).toFixed(2));
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          mbrBalance: Math.round((prev.mbrBalance + microYield) * 100) / 100,
          totalEarnedYield: Math.round((prev.totalEarnedYield + microYield) * 100) / 100,
        };
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [user]);

  const loginWithEmail = async (email: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 800));
    const loggedUser: UserProfile = {
      ...DEFAULT_USER,
      email: email || DEFAULT_USER.email,
      name: email.split('@')[0] || DEFAULT_USER.name,
    };
    setUser(loggedUser);
    return true;
  };

  const signupWithEmail = async (name: string, email: string, _pass: string, refCode?: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 900));
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    const newUser: UserProfile = {
      id: `usr-${Math.floor(Math.random() * 899999 + 100000)}`,
      name: name || 'New Investor',
      email: email || 'investor@mybitrich.com',
      walletAddress: `0x71C${randomHex}F820bE9871D2a3C9b8417`,
      mbrBalance: refCode ? 500 : 0, // 500 MBR signup bonus if referred!
      bnbBalance: 1.5,
      totalEarnedYield: 0,
      referralCode: `MBR-${randomHex.slice(0, 6)}`,
      tier1Count: 0,
      tier2Count: 0,
      tier3Count: 0,
      referralEarningsMbr: 0,
      referralEarningsUsdt: 0,
      joinedDate: 'Oct 2026',
    };
    setUser(newUser);
    return true;
  };

  const loginWithWallet = async (walletAddress: string): Promise<boolean> => {
    await new Promise(res => setTimeout(res, 600));
    const walletUser: UserProfile = {
      ...DEFAULT_USER,
      walletAddress,
      name: `Holder (${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)})`,
      email: `${walletAddress.slice(2, 8).toLowerCase()}@web3.mybitrich.com`,
    };
    setUser(walletUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateBalance = (mbrDelta: number, bnbDelta: number) => {
    setUser(prev => {
      if (!prev) return null;
      return {
        ...prev,
        mbrBalance: Math.max(0, Math.round((prev.mbrBalance + mbrDelta) * 100) / 100),
        bnbBalance: Math.max(0, Math.round((prev.bnbBalance + bnbDelta) * 1000) / 1000),
      };
    });
  };

  const addActivity = (act: Omit<ActivityItem, 'id' | 'timestamp' | 'status'>) => {
    const newAct: ActivityItem = {
      ...act,
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      status: 'completed',
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithEmail,
        signupWithEmail,
        loginWithWallet,
        logout,
        updateBalance,
        activities,
        addActivity,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
