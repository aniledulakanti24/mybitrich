import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { ArrowDownToLine, LayoutGrid, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { OFFICIAL_DISCLAIMER } from '../ui/Disclaimer';
import { WalletProvider } from './state/WalletProvider';
import { AccountProvider, useAccount } from './state/account';
import type { Asset } from './config';
import { Modal, SpotlightCard, cx } from './ui';
import { FundsModal, type FundsMode } from './FundsModal';
import { SwapPanel } from './SwapPanel';
import { TradingChart } from './TradingChart';
import { OverviewSection } from './sections/OverviewSection';
import { PortfolioSection } from './sections/PortfolioSection';
import { TeamSection } from './sections/TeamSection';
import { RewardsSection } from './sections/RewardsSection';
import { TransactionsSection } from './sections/TransactionsSection';
import { SettingsSection } from './sections/SettingsSection';
import { HelpSection } from './sections/HelpSection';
import { SupportSection } from './sections/SupportSection';
import { FeedbackSection } from './sections/FeedbackSection';
import { CommandPalette, NotificationsMenu, PriceTicker, Toaster } from './chrome';
import { MorePanel, RAIL_COLLAPSED, RAIL_EXPANDED, SideRail } from './rail';
import { NAV, type SectionId, type SettingsTab } from './nav';
import { ThemeProvider, useTheme } from './theme';
import './dashboard.css';

export type { SectionId } from './nav';

const MOBILE_TABS: SectionId[] = ['overview', 'trade', 'portfolio', 'team'];
const SECTION_KEY = 'mbr_dash_section';
const PIN_KEY = 'mbr_rail_pinned';

interface DashboardPageProps {
  onNavigateHome: () => void;
  onOpenConnectModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = (props) => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <WalletProvider key={user.id} user={user}>
      <AccountProvider user={user}>
        <ThemeProvider>
          <DashboardShell {...props} />
        </ThemeProvider>
      </AccountProvider>
    </WalletProvider>
  );
};

const readPinned = () => {
  try {
    return localStorage.getItem(PIN_KEY) === '1';
  } catch {
    return false;
  }
};

const DashboardShell: React.FC<DashboardPageProps> = ({ onNavigateHome }) => {
  const { user, logout } = useAuth();
  const { account } = useAccount();
  const { theme } = useTheme();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [section, setSection] = useState<SectionId>(() => {
    try {
      const s = localStorage.getItem(SECTION_KEY) as SectionId | null;
      return s && NAV.some((n) => n.id === s) ? s : 'overview';
    } catch {
      return 'overview';
    }
  });
  const [settingsTab, setSettingsTab] = useState<{ tab: SettingsTab; n: number }>({ tab: 'profile', n: 0 });
  const [helpFocus, setHelpFocus] = useState<string | null>(null);
  const [navOpen, setNavOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [pinned, setPinned] = useState(readPinned);
  const [funds, setFunds] = useState<{ open: boolean; mode: FundsMode; asset: Asset }>({ open: false, mode: 'deposit', asset: 'USDT' });
  const [swap, setSwap] = useState<{ open: boolean; from: Asset }>({ open: false, from: 'USDT' });
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const on = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SECTION_KEY, section);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0 });
    setNavOpen(false);
  }, [section]);

  const setPin = (v: boolean) => {
    setPinned(v);
    try {
      localStorage.setItem(PIN_KEY, v ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const go = useCallback((s: SectionId) => {
    setSection(s);
    setMoreOpen(false);
  }, []);
  const openSettings = useCallback((tab: SettingsTab) => {
    setSettingsTab((p) => ({ tab, n: p.n + 1 }));
    setSection('settings');
  }, []);
  const openFunds = useCallback((mode: FundsMode, asset: Asset) => setFunds({ open: true, mode, asset }), []);
  const openSwap = useCallback((from: Asset = 'USDT') => setSwap({ open: true, from }), []);
  const openHelpArticle = useCallback((id: string) => {
    setHelpFocus(id);
    setSection('help');
  }, []);
  const actions = { openFunds, openSwap, go, openSettings };

  if (!user) return null;
  const current = NAV.find((n) => n.id === section)!;
  const displayName = account.settings.displayName || user.name;
  const awaitingReply = account.tickets.filter((t) => t.status === 'awaiting').length;
  const securityGap = !account.settings.security.twoFA;
  const prefs = account.settings.prefs;
  const referralLink = `https://mybitrich.com/?ref=${user.referralCode}`;
  const railWidth = pinned ? RAIL_EXPANDED : RAIL_COLLAPSED;

  const badge = (id: SectionId) => {
    if (id === 'support' && awaitingReply) return { count: awaitingReply };
    return null;
  };

  const rail = (mobile?: boolean) => (
    <SideRail
      section={section}
      go={go}
      badge={badge}
      pinned={pinned}
      onPin={setPin}
      onAccount={() => { setNavOpen(false); setMoreOpen((o) => !o); }}
      accountOpen={moreOpen}
      accountAlert={securityGap}
      onHome={onNavigateHome}
      name={displayName}
      mobile={mobile}
      onClose={() => setNavOpen(false)}
    />
  );

  return (
    <MotionConfig reducedMotion={prefs.reduceMotion ? 'always' : 'user'}>
      <div
        className={cx('dash relative min-h-screen overflow-x-clip font-sans', prefs.hideBalances && 'd-privacy', prefs.reduceMotion && 'd-calm')}
        data-theme={theme}
        style={{ ['--rail-w' as string]: `${railWidth}px` }}
      >
        <motion.div className="d-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-left" style={{ scaleX: progress, background: 'linear-gradient(90deg,#d9a83a,#f5d37c,#4f8bff)' }} />
        <div className="pointer-events-none fixed -top-40 left-1/3 h-[420px] w-[620px] rounded-full bg-[#e2b54c]/[0.05] blur-[140px]" />

        {rail()}

        {/* Mobile: full rail as a drawer */}
        <AnimatePresence>
          {navOpen && (
            <>
              <motion.div className="fixed inset-0 z-40 bg-[var(--d-overlay)] lg:hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setNavOpen(false)} />
              {rail(true)}
            </>
          )}
        </AnimatePresence>

        <MorePanel
          open={moreOpen}
          left={isDesktop ? railWidth : 0}
          onClose={() => setMoreOpen(false)}
          name={displayName}
          email={user.email}
          joined={user.joinedDate}
          go={go}
          openSettings={(t) => { openSettings(t); setMoreOpen(false); }}
          onPublicSite={onNavigateHome}
          onLogout={logout}
        />

        <div className="d-main relative">
          {/* Top bar */}
          <header className="sticky top-0 z-20 border-b bg-[var(--d-glass)] backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-[1440px] items-center gap-2 px-4 sm:gap-3 sm:px-6">
              <button onClick={() => setNavOpen(true)} className="d-btn d-btn-ghost !p-2 lg:hidden" aria-label="Open menu"><Menu className="h-4 w-4" /></button>
              <div className="flex min-w-0 items-center gap-3">
                <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0b2155] text-white shadow-sm sm:flex">
                  <current.icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-base font-bold leading-tight">{current.label}</h1>
                  <div className="t-muted hidden truncate text-xs xl:block">{current.desc}</div>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
                <CommandPalette nav={NAV} go={go} openFunds={openFunds} openSwap={openSwap} referralLink={referralLink} onHelpArticle={openHelpArticle} />
                <PriceTicker onClick={() => setSection('trade')} />
                <NotificationsMenu go={go} />
                {section !== 'overview' && (
                  <button onClick={() => openFunds('deposit', 'USDT')} className="d-btn d-btn-primary hidden !h-9 !py-0 text-xs sm:inline-flex">
                    <ArrowDownToLine className="h-3.5 w-3.5" /> Deposit
                  </button>
                )}
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1440px] px-4 py-6 pb-24 sm:px-6 lg:pb-10">
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              {section === 'overview' && <OverviewSection {...actions} userName={displayName} />}
              {section === 'trade' && (
                <div className="grid gap-5 xl:grid-cols-12">
                  <div className="min-w-0 xl:col-span-9"><TradingChart height={620} /></div>
                  <SpotlightCard className="p-4 xl:col-span-3"><SwapPanel /></SpotlightCard>
                </div>
              )}
              {section === 'portfolio' && <PortfolioSection openFunds={openFunds} openSwap={openSwap} />}
              {section === 'team' && <TeamSection referralCode={user.referralCode} />}
              {section === 'rewards' && <RewardsSection />}
              {section === 'transactions' && <TransactionsSection />}
              {section === 'settings' && <SettingsSection key={settingsTab.n} user={user} initialTab={settingsTab.tab} />}
              {section === 'help' && <HelpSection {...actions} focusId={helpFocus} />}
              {section === 'support' && <SupportSection />}
              {section === 'feedback' && <FeedbackSection />}
            </motion.div>
            <footer className="t-muted mt-10 flex flex-col items-center gap-2 border-t pt-4 text-center text-[11px] leading-relaxed">
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                <button className="hover:text-[var(--d-text)]" onClick={() => setSection('help')}>Help center</button>
                <button className="hover:text-[var(--d-text)]" onClick={() => setSection('support')}>Contact support</button>
                <button className="hover:text-[var(--d-text)]" onClick={() => setSection('feedback')}>Send feedback</button>
                <button className="hover:text-[var(--d-text)]" onClick={onNavigateHome}>Public website</button>
              </div>
              <p>Balances, prices and rewards shown here are simulated until the custody and market APIs are connected.</p>
              <p className="mx-auto max-w-3xl">{OFFICIAL_DISCLAIMER}</p>
            </footer>
          </main>

          {/* Mobile bottom nav */}
          <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-[var(--d-glass-strong)] backdrop-blur-xl lg:hidden">
            {MOBILE_TABS.map((id) => {
              const n = NAV.find((x) => x.id === id)!;
              const Icon = n.icon;
              const active = section === id;
              return (
                <button key={id} onClick={() => setSection(id)} className={cx('relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium', active ? 't-gold' : 't-muted')}>
                  {active && <motion.span layoutId="mobile-tab" className="absolute inset-x-4 top-0 h-0.5 rounded-full bg-[var(--d-gold)]" />}
                  <Icon className="h-[18px] w-[18px]" />
                  {n.label.split(' ')[0]}
                </button>
              );
            })}
            <button onClick={() => setMoreOpen(true)} className={cx('relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium', moreOpen || !MOBILE_TABS.includes(section) ? 't-gold' : 't-muted')}>
              <LayoutGrid className="h-[18px] w-[18px]" />
              More
              {(awaitingReply > 0 || securityGap) && <span className="absolute right-[30%] top-1.5 h-2 w-2 rounded-full bg-[var(--d-down)]" />}
            </button>
          </nav>
        </div>

        <FundsModal
          open={funds.open}
          mode={funds.mode}
          asset={funds.asset}
          onClose={() => setFunds((f) => ({ ...f, open: false }))}
          onSwap={(from) => {
            setFunds((f) => ({ ...f, open: false }));
            openSwap(from);
          }}
        />
        <Modal open={swap.open} onClose={() => setSwap((s) => ({ ...s, open: false }))} title="Swap USDT ⇄ MBR" subtitle="Settles instantly to your dashboard balance" width="max-w-md">
          <SwapPanel key={`${swap.from}-${swap.open}`} initialFrom={swap.from} onDone={() => setSwap((s) => ({ ...s, open: false }))} />
        </Modal>
        <Toaster />
      </div>
    </MotionConfig>
  );
};
