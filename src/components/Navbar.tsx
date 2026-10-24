import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface NavbarProps {
  currentPage: string;
  onNavigatePage: (page: string) => void;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onOpenDashboard?: () => void;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'vision', label: 'Vision' },
  { id: 'tokenomics', label: 'Tokenomics' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'contracts', label: 'Contracts' },
];

const NAV_PROBE_Y = 36; // vertical point (px) where the bar sits, used to read what is underneath

/**
 * Tracks scroll to (a) hide the bar while scrolling down and reveal it on scroll up,
 * and (b) switch to light text whenever a `data-nav-theme="dark"` section sits under the bar.
 */
function useNavScroll(currentPage: string) {
  const [hidden, setHidden] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const [atTop, setAtTop] = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < 80) setHidden(false);
      else if (delta > 6) setHidden(true);
      else if (delta < -6) setHidden(false);
      if (Math.abs(delta) > 6 || y < 80) lastY = y;
      setAtTop(y < 12);

      const dark = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-theme="dark"]')).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= NAV_PROBE_Y && r.bottom >= NAV_PROBE_Y;
      });
      setOnDark(dark);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    // re-check after page transitions mount new sections
    const settle = [150, 600, 1200].map((ms) => window.setTimeout(update, ms));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      settle.forEach((t) => window.clearTimeout(t));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentPage]);

  return { hidden, onDark, atTop };
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigatePage,
  onOpenAuth,
  onOpenDashboard,
  onLogout,
  isAuthenticated = false,
}) => {
  const { hidden, onDark, atTop } = useNavScroll(currentPage);

  const text = onDark ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-slate-900';
  const activeText = onDark ? 'text-white' : 'text-slate-900';
  const ghostBtn = onDark ? 'text-white/85 hover:bg-white/10 hover:text-white' : 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900';

  return (
    <>
      {/* Top bar — transparent, slides away on scroll down and back on scroll up */}
      <motion.header
        initial={false}
        animate={{ y: hidden ? '-130%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
      >
        <div
          className={`mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 rounded-2xl px-2 transition-[backdrop-filter] duration-300 sm:px-3 md:h-16 [&_button]:whitespace-nowrap ${
            atTop ? '' : 'backdrop-blur-md'
          }`}
        >
          {/* Brand */}
          <button onClick={() => onNavigatePage('home')} className="group flex items-center gap-2.5 text-left" title="Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-700 p-[2px] transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-white p-1">
                <img src="/assets/logo.png" alt="MyBitRich" className="h-full w-full object-contain" />
              </div>
            </div>
            <span className={`font-display text-base font-bold tracking-tight sm:text-lg ${onDark ? 'text-white' : 'text-slate-900'}`}>
              My<span className={onDark ? 'text-gradient-gold-bright' : 'text-gradient-gold'}>BitRich</span>
            </span>
          </button>

          {/* Links (tablet / desktop) */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigatePage(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`relative px-3.5 py-2 text-sm font-medium transition-colors ${active ? activeText : text}`}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account */}
          <div className="flex items-center gap-1.5">
            {isAuthenticated ? (
              <>
                <button
                  onClick={onOpenDashboard}
                  className="rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-2 text-xs font-semibold text-[#1F1503] shadow-[0_6px_20px_-8px_rgba(245,192,66,0.7)] transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Dashboard
                </button>
                {onLogout && (
                  <button onClick={onLogout} className={`hidden rounded-full px-3 py-2 text-xs font-medium transition-colors sm:block ${ghostBtn}`}>
                    Sign out
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('signin')}
                  className={`hidden rounded-full px-3.5 py-2 text-xs font-medium transition-colors sm:block ${ghostBtn}`}
                >
                  Sign in
                </button>
                <button
                  onClick={() => onOpenAuth('signup')}
                  className="rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-4 py-2 text-xs font-semibold text-[#1F1503] shadow-[0_6px_20px_-8px_rgba(245,192,66,0.7)] transition-transform hover:-translate-y-0.5 active:scale-95"
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Bottom tab bar (phones) — same hide/show behaviour */}
      <motion.nav
        aria-label="Primary mobile"
        initial={false}
        animate={{ y: hidden ? '140%' : '0%' }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-x-0 bottom-3 z-50 flex justify-center px-3 md:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex w-full max-w-md items-center justify-between rounded-2xl border border-white/15 bg-slate-900/40 px-1 py-1 backdrop-blur-md">
          {NAV_ITEMS.map((item) => {
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigatePage(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`relative flex-1 rounded-xl px-1 py-2.5 text-[11px] font-medium transition-colors ${
                  active ? 'text-white' : 'text-white/65'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-underline-mobile"
                    className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-gradient-to-r from-amber-300 to-amber-500"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {item.label}
              </button>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
};
