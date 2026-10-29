import React, { useState, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { Footer } from './components/Footer';
import { SwapModal } from './components/SwapModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { AuthPage } from './components/auth/AuthPage';
import { DashboardPage } from './components/dashboard/DashboardPage';

// Multi-Page Dedicated Views with 3D Canvas Elements
import { HomePage } from './components/pages/HomePage';
import { VisionMissionPage } from './components/pages/VisionMissionPage';
import { TokenomicsPage } from './components/pages/TokenomicsPage';
import { RoadmapPage } from './components/pages/RoadmapPage';
import { CalculatorPage } from './components/pages/CalculatorPage';
import { ContractsPage } from './components/pages/ContractsPage';

type PageType = 'home' | 'vision' | 'tokenomics' | 'roadmap' | 'calculator' | 'contracts';

const MainAppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();

  const [currentView, setCurrentView] = useState<'app' | 'auth' | 'dashboard'>('app');
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState<boolean>(false);
  const [isSwapModalOpen, setIsSwapModalOpen] = useState<boolean>(false);

  const lenisRef = useRef<Lenis | null>(null);

  // Per-view browser tab titles (and what bookmarks/history show)
  useEffect(() => {
    const PAGE_TITLES: Record<PageType, string> = {
      home: 'MyBitRich (MBR) — BNB Smart Chain token',
      vision: 'Vision & Mission · MyBitRich',
      tokenomics: 'Tokenomics · MyBitRich',
      roadmap: 'Roadmap · MyBitRich',
      calculator: 'ROI Calculator · MyBitRich',
      contracts: 'Contracts · MyBitRich',
    };
    if (currentView === 'dashboard') return; // the dashboard titles itself per section
    document.title =
      currentView === 'auth' ? (authMode === 'signup' ? 'Create account · MyBitRich' : 'Sign in · MyBitRich') : PAGE_TITLES[currentPage];
  }, [currentView, currentPage, authMode]);

  // Initialize Buttery-Smooth Inertial Momentum Scrolling (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth Apple-style exponential ease out
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.6,
    });
    lenisRef.current = lenis;
    if (typeof window !== 'undefined') {
      (window as any).__lenisGlobal = lenis;
    }

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const reqId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(reqId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Cursor-following spotlight for every card surface (consumed by .luxe-card::before in index.css)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const card = (e.target as HTMLElement | null)?.closest?.('.luxe-card, .ton-card, .apple-card') as HTMLElement | null;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  // Smooth Scroll Progress Indicator
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const scrollToTop = () => {
    const lenis = (window as any).__lenisGlobal as Lenis | undefined;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo({ top: 0 });
  };

  // Sync with URL Hash (#/vision, #/tokenomics, #/roadmap, #/calculator, #/contracts, #dashboard, #signin, #signup)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      
      if (hash === '#dashboard' || hash === '#/dashboard') {
        if (isAuthenticated) {
          setCurrentView('dashboard');
        } else {
          setAuthMode('signin');
          setCurrentView('auth');
        }
      } else if (hash === '#signin' || hash === '#login' || hash === '#/signin') {
        setAuthMode('signin');
        setCurrentView('auth');
      } else if (hash === '#signup' || hash === '#register' || hash === '#/signup') {
        setAuthMode('signup');
        setCurrentView('auth');
      } else if (hash.includes('vision') || hash.includes('mission')) {
        setCurrentView('app');
        setCurrentPage('vision');
        scrollToTop();
      } else if (hash.includes('tokenomics')) {
        setCurrentView('app');
        setCurrentPage('tokenomics');
        scrollToTop();
      } else if (hash.includes('roadmap')) {
        setCurrentView('app');
        setCurrentPage('roadmap');
        scrollToTop();
      } else if (hash.includes('calculator') || hash.includes('simulator')) {
        setCurrentView('app');
        setCurrentPage('calculator');
        scrollToTop();
      } else if (hash.includes('contract')) {
        setCurrentView('app');
        setCurrentPage('contracts');
        scrollToTop();
      } else {
        // Default Home
        setCurrentView('app');
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isAuthenticated]);

  const handleNavigatePage = (pageId: string) => {
    setCurrentView('app');
    setCurrentPage(pageId as PageType);
    window.location.hash = `#/${pageId}`;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleConnectSuccess = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnectWallet = () => {
    setWalletAddress(null);
    logout();
  };

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setCurrentView('auth');
    window.location.hash = `#/${mode}`;
  };

  const handleOpenDashboard = () => {
    if (isAuthenticated) {
      setCurrentView('dashboard');
      window.location.hash = '#/dashboard';
    } else {
      handleOpenAuth('signin');
    }
  };

  const handleNavigateHome = () => {
    setCurrentView('app');
    setCurrentPage('home');
    window.location.hash = '';
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 0.8 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // View: Auth Page (Sign In / Sign Up)
  if (currentView === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onNavigateHome={handleNavigateHome}
        onAuthSuccess={() => {
          setCurrentView('dashboard');
          window.location.hash = '#/dashboard';
        }}
      />
    );
  }

  // View: Member / Investor Dashboard
  if (currentView === 'dashboard') {
    return (
      <DashboardPage
        onNavigateHome={handleNavigateHome}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />
    );
  }

  // View: Main Public Multi-Page Platform
  return (
    <div className="min-h-screen bg-canvas text-slate-700 flex flex-col selection:bg-blue-600 selection:text-white font-sans antialiased relative overflow-x-hidden">

      {/* Scroll Progress Indicator Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-navy-800 via-blue-600 to-gold-400 origin-left z-[9999] pointer-events-none"
        style={{ scaleX }}
      />

      {/* Top Navigation Bar with Unique Navigation Items */}
      <Navbar
        currentPage={currentPage}
        onNavigatePage={handleNavigatePage}
        onOpenAuth={handleOpenAuth}
        onOpenDashboard={handleOpenDashboard}
        onLogout={logout}
        isAuthenticated={isAuthenticated}
      />

      {/* Real-time Crypto Price Marquee */}
      <div className="absolute inset-x-0 top-[72px] z-40 sm:top-[84px]">
        <LiveTicker />
      </div>

      {/* Main Dynamic View: Dedicated Pages */}
      <main className="flex-1 relative z-10">
        <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 12, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
          exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
        {currentPage === 'home' && (
          <HomePage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
            onNavigatePage={handleNavigatePage}
          />
        )}

        {currentPage === 'vision' && (
          <VisionMissionPage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {currentPage === 'tokenomics' && (
          <TokenomicsPage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {currentPage === 'roadmap' && (
          <RoadmapPage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {currentPage === 'calculator' && (
          <CalculatorPage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}

        {currentPage === 'contracts' && (
          <ContractsPage
            onOpenSwapModal={() => setIsSwapModalOpen(true)}
            onOpenConnectModal={() => setIsConnectModalOpen(true)}
          />
        )}
        </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Footer with Navigation & Contracts */}
      <Footer onNavigatePage={handleNavigatePage} />

      {/* Instant Swap Terminal Modal */}
      <SwapModal
        isOpen={isSwapModalOpen}
        onClose={() => setIsSwapModalOpen(false)}
        walletAddress={walletAddress}
        onOpenConnectModal={() => setIsConnectModalOpen(true)}
      />

      {/* Web3 Wallet Connect Modal */}
      <ConnectWalletModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onConnectSuccess={handleConnectSuccess}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <MainAppContent />
    </AuthProvider>
  );
};

export default App;
