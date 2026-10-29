import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cx } from './ui';

export type ThemePref = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

const KEY = 'mbr_dash_theme';
const query = () => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null);

interface ThemeCtx {
  pref: ThemePref;
  theme: ResolvedTheme;
  setPref: (p: ThemePref) => void;
}

const Ctx = createContext<ThemeCtx>({ pref: 'dark', theme: 'dark', setPref: () => {} });

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pref, setPrefState] = useState<ThemePref>(() => {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'light' || v === 'system' || v === 'dark' ? v : 'dark';
    } catch {
      return 'dark';
    }
  });
  const [systemLight, setSystemLight] = useState(() => query()?.matches ?? false);

  // Follow OS changes live while "System" is selected
  useEffect(() => {
    const mq = query();
    if (!mq) return;
    const on = (e: MediaQueryListEvent) => setSystemLight(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  const setPref = (p: ThemePref) => {
    setPrefState(p);
    try {
      localStorage.setItem(KEY, p);
    } catch {
      /* ignore */
    }
  };

  const theme: ResolvedTheme = pref === 'system' ? (systemLight ? 'light' : 'dark') : pref;
  const value = useMemo(() => ({ pref, theme, setPref }), [pref, theme]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useTheme = () => useContext(Ctx);

const OPTIONS: { id: ThemePref; label: string; icon: React.ElementType }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

/** Segmented Light / Dark / System control. `withLabels` shows text next to the icons. */
export const ThemeSwitcher: React.FC<{ withLabels?: boolean; layoutId: string }> = ({ withLabels, layoutId }) => {
  const { pref, setPref } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className={cx('inline-flex items-center rounded-full border bg-surface-2 p-0.5', withLabels && 'w-full')}>
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = pref === o.id;
        return (
          <button
            key={o.id}
            role="radio"
            aria-checked={active}
            title={`${o.label} theme`}
            onClick={() => setPref(o.id)}
            className={cx('relative flex items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold transition-colors', withLabels ? 'flex-1 px-2 py-1.5' : 'h-7 w-7', active ? 't-gold' : 't-muted hover:text-[var(--d-text)]')}
          >
            {active && <motion.span layoutId={layoutId} className="absolute inset-0 rounded-full border border-[var(--d-line-strong)] bg-surface shadow-sm" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <Icon className="relative h-3.5 w-3.5" />
            {withLabels && <span className="relative">{o.label}</span>}
          </button>
        );
      })}
    </div>
  );
};
