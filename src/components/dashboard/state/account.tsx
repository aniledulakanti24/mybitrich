// Account-level state that isn't money: profile & preferences, security, notification
// settings, saved withdrawal addresses, support tickets and feedback. Persisted per user
// in localStorage until the account API exists.
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { UserProfile } from '../../../types/auth';
import type { NetworkId } from '../config';

export type TicketStatus = 'open' | 'awaiting' | 'resolved';
export type TicketCategory = 'Deposit' | 'Withdrawal' | 'Swap' | 'Rewards' | 'Referral' | 'Account & security' | 'Other';

export interface TicketMessage {
  id: string;
  from: 'user' | 'support';
  text: string;
  at: number;
  attachment?: string;
}

export interface Ticket {
  id: string;
  number: string;
  subject: string;
  category: TicketCategory;
  priority: 'low' | 'normal' | 'high';
  status: TicketStatus;
  txHash?: string;
  createdAt: number;
  updatedAt: number;
  messages: TicketMessage[];
}

export interface SavedAddress {
  id: string;
  label: string;
  network: NetworkId;
  address: string;
  createdAt: number;
}

export interface Idea {
  id: string;
  title: string;
  votes: number;
  voted: boolean;
  status: 'Planned' | 'In progress' | 'Under review';
}

export interface Settings {
  displayName: string;
  phone: string;
  country: string;
  notify: {
    deposits: boolean;
    withdrawals: boolean;
    swaps: boolean;
    referral: boolean;
    holding: boolean;
    announcements: boolean;
    email: boolean;
    push: boolean;
  };
  security: { twoFA: boolean; antiPhishing: string; whitelistOnly: boolean; loginAlerts: boolean; passwordChangedAt: number };
  prefs: { defaultNetwork: NetworkId; hideBalances: boolean; reduceMotion: boolean };
}

interface AccountState {
  v: 1;
  settings: Settings;
  addresses: SavedAddress[];
  tickets: Ticket[];
  ideas: Idea[];
  feedbackCount: number;
  notifReadAt: number;
  sessions: { id: string; device: string; location: string; lastActive: number; current: boolean }[];
}

const uid = () => Math.random().toString(36).slice(2, 10);
const DAY = 86_400_000;

function seed(user: UserProfile): AccountState {
  const now = Date.now();
  const demo = user.tier1Count > 0;
  return {
    v: 1,
    settings: {
      displayName: user.name,
      phone: '',
      country: 'India',
      notify: { deposits: true, withdrawals: true, swaps: true, referral: true, holding: false, announcements: true, email: true, push: false },
      security: { twoFA: false, antiPhishing: '', whitelistOnly: false, loginAlerts: true, passwordChangedAt: now - 64 * DAY },
      prefs: { defaultNetwork: 'TRC20', hideBalances: false, reduceMotion: false },
    },
    addresses: demo
      ? [{ id: uid(), label: 'Binance (TRC-20)', network: 'TRC20', address: 'TJRabPrwbZy45sbavfcjinPJC18kjpRTv8', createdAt: now - 30 * DAY }]
      : [],
    tickets: demo
      ? [
          {
            id: uid(), number: 'MBR-10482', subject: 'TRC-20 deposit taking longer than expected', category: 'Deposit', priority: 'normal', status: 'resolved',
            createdAt: now - 12 * DAY, updatedAt: now - 12 * DAY + 3 * 3_600_000,
            messages: [
              { id: uid(), from: 'user', text: 'I sent 150 USDT on TRC-20 about 20 minutes ago and it still shows processing.', at: now - 12 * DAY },
              { id: uid(), from: 'support', text: 'Thanks for waiting. Tron was congested for a short while. Your deposit has now been credited. Sorry for the delay!', at: now - 12 * DAY + 3 * 3_600_000 },
            ],
          },
          {
            id: uid(), number: 'MBR-10917', subject: 'How is my Level 2 referral reward calculated?', category: 'Referral', priority: 'low', status: 'awaiting',
            createdAt: now - 2 * DAY, updatedAt: now - DAY,
            messages: [
              { id: uid(), from: 'user', text: 'One of my Level 2 members bought 300 USDT of MBR. What exactly do I get?', at: now - 2 * DAY },
              { id: uid(), from: 'support', text: 'You receive 0.6% of the MBR they received after the 6% tax. Could you share their username so we can confirm the reward was credited?', at: now - DAY },
            ],
          },
        ]
      : [],
    ideas: [
      { id: uid(), title: 'Recurring buy: auto-swap USDT to MBR every week', votes: 214, voted: false, status: 'Planned' },
      { id: uid(), title: 'UPI / bank deposit directly in INR', votes: 388, voted: false, status: 'Under review' },
      { id: uid(), title: 'Mobile app with push notifications', votes: 301, voted: false, status: 'In progress' },
      { id: uid(), title: 'Export tax report (yearly P&L)', votes: 97, voted: false, status: 'Under review' },
    ],
    feedbackCount: 0,
    notifReadAt: now - 3 * DAY,
    sessions: [
      { id: 'this', device: 'Chrome on Windows', location: 'Hyderabad, IN', lastActive: now, current: true },
      { id: uid(), device: 'MBR on iPhone 15', location: 'Hyderabad, IN', lastActive: now - 2 * DAY, current: false },
      { id: uid(), device: 'Safari on macOS', location: 'Bengaluru, IN', lastActive: now - 9 * DAY, current: false },
    ],
  };
}

interface AccountCtx {
  account: AccountState;
  updateSettings: (fn: (s: Settings) => Settings) => void;
  addAddress: (a: Omit<SavedAddress, 'id' | 'createdAt'>) => void;
  removeAddress: (id: string) => void;
  createTicket: (t: { subject: string; category: TicketCategory; priority: Ticket['priority']; text: string; txHash?: string; attachment?: string }) => Ticket;
  replyTicket: (id: string, text: string) => void;
  setTicketStatus: (id: string, status: TicketStatus) => void;
  voteIdea: (id: string) => void;
  addIdea: (title: string) => void;
  submitFeedback: () => void;
  markNotificationsRead: () => void;
  revokeSession: (id: string) => void;
  toast: (text: string, tone?: 'up' | 'down' | 'gold') => void;
  toasts: { id: string; text: string; tone: 'up' | 'down' | 'gold' }[];
}

const Ctx = createContext<AccountCtx | null>(null);

export const AccountProvider: React.FC<{ user: UserProfile; children: React.ReactNode }> = ({ user, children }) => {
  const key = `mbr_account_${user.id}`;
  const [account, setAccount] = useState<AccountState>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const s = JSON.parse(raw) as AccountState;
        if (s.v === 1) return s;
      }
    } catch {
      /* ignore */
    }
    return seed(user);
  });
  const [toasts, setToasts] = useState<AccountCtx['toasts']>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(account));
    } catch {
      /* ignore */
    }
  }, [account, key]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const toast = useCallback<AccountCtx['toast']>((text, tone = 'up') => {
    const id = uid();
    setToasts((t) => [...t, { id, text, tone }]);
    timers.current.push(window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800));
  }, []);

  const firstName = (account.settings.displayName || user.name).split(' ')[0];

  const api = useMemo<Omit<AccountCtx, 'account' | 'toasts'>>(
    () => ({
      toast,
      updateSettings: (fn) => setAccount((a) => ({ ...a, settings: fn(a.settings) })),
      addAddress: (x) => setAccount((a) => ({ ...a, addresses: [{ ...x, id: uid(), createdAt: Date.now() }, ...a.addresses] })),
      removeAddress: (id) => setAccount((a) => ({ ...a, addresses: a.addresses.filter((x) => x.id !== id) })),
      createTicket: ({ subject, category, priority, text, txHash, attachment }) => {
        const now = Date.now();
        const t: Ticket = {
          id: uid(), number: `MBR-${11000 + Math.floor(Math.random() * 8999)}`, subject, category, priority, status: 'open', txHash,
          createdAt: now, updatedAt: now, messages: [{ id: uid(), from: 'user', text, at: now, attachment }],
        };
        setAccount((a) => ({ ...a, tickets: [t, ...a.tickets] }));
        // Simulated acknowledgement from the support desk
        timers.current.push(
          window.setTimeout(() => {
            setAccount((a) => ({
              ...a,
              tickets: a.tickets.map((x) =>
                x.id === t.id
                  ? { ...x, updatedAt: Date.now(), messages: [...x.messages, { id: uid(), from: 'support', at: Date.now(), text: `Hi ${firstName}, thanks for contacting MyBitRich support. We've received ticket ${t.number} and an agent will reply within 2 hours.` }] }
                  : x,
              ),
            }));
          }, 5000),
        );
        return t;
      },
      replyTicket: (id, text) =>
        setAccount((a) => ({
          ...a,
          tickets: a.tickets.map((x) => (x.id === id ? { ...x, status: 'open', updatedAt: Date.now(), messages: [...x.messages, { id: uid(), from: 'user', text, at: Date.now() }] } : x)),
        })),
      setTicketStatus: (id, status) => setAccount((a) => ({ ...a, tickets: a.tickets.map((x) => (x.id === id ? { ...x, status, updatedAt: Date.now() } : x)) })),
      voteIdea: (id) => setAccount((a) => ({ ...a, ideas: a.ideas.map((i) => (i.id === id ? { ...i, voted: !i.voted, votes: i.votes + (i.voted ? -1 : 1) } : i)) })),
      addIdea: (title) => setAccount((a) => ({ ...a, ideas: [{ id: uid(), title, votes: 1, voted: true, status: 'Under review' }, ...a.ideas] })),
      submitFeedback: () => setAccount((a) => ({ ...a, feedbackCount: a.feedbackCount + 1 })),
      markNotificationsRead: () => setAccount((a) => ({ ...a, notifReadAt: Date.now() })),
      revokeSession: (id) => setAccount((a) => ({ ...a, sessions: a.sessions.filter((s) => s.id !== id || s.current) })),
    }),
    [toast, firstName],
  );

  const value = useMemo(() => ({ account, toasts, ...api }), [account, toasts, api]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useAccount = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAccount must be used inside AccountProvider');
  return c;
};
