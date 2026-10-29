// Dark-blue navigation rail (collapses to icons, expands on hover, can be kept open)
// and the account panel. Every destination lives in exactly one of the two:
// the rail holds the pages you move between; the panel holds account, sharing and exit.
import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bell,
  BookUser,
  ChevronRight,
  Globe,
  LogOut,
  MessageSquareHeart,
  PanelLeftClose,
  PanelLeftOpen,
  Settings as SettingsIcon,
  ShieldCheck,
  X,
} from 'lucide-react';
import { NAV_GROUPS, type SectionId, type SettingsTab } from './nav';
import { useAccount } from './state/account';
import { cx } from './ui';

export const RAIL_COLLAPSED = 76;
export const RAIL_EXPANDED = 256;
const RAIL_BG = 'linear-gradient(180deg, #0f2d6b 0%, #0b2155 45%, #081a44 100%)';
const RAIL_GROUPS = NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.rail !== false) })).filter((g) => g.items.length);

const Logo: React.FC = () => (
  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-md">
    <img src={`${import.meta.env.BASE_URL}assets/logo-mark.png`} alt="" className="h-7 w-7 object-contain" />
  </span>
);

const initials = (name: string) => name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

export const SideRail: React.FC<{
  section: SectionId;
  go: (s: SectionId) => void;
  badge: (id: SectionId) => { count?: number; dot?: boolean } | null;
  pinned: boolean;
  onPin: (v: boolean) => void;
  onAccount: () => void;
  accountOpen: boolean;
  accountAlert: boolean;
  onHome: () => void;
  name: string;
  mobile?: boolean;
  onClose?: () => void;
}> = ({ section, go, badge, pinned, onPin, onAccount, accountOpen, accountAlert, onHome, name, mobile, onClose }) => {
  const [hover, setHover] = useState(false);
  const timer = useRef<number>();
  const expanded = mobile || pinned || hover;
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <motion.aside
      onMouseEnter={() => {
        if (mobile) return;
        timer.current = window.setTimeout(() => setHover(true), 110);
      }}
      onMouseLeave={() => {
        window.clearTimeout(timer.current);
        setHover(false);
      }}
      initial={mobile ? { x: -300, width: 280 } : false}
      animate={{ x: 0, width: mobile ? 280 : expanded ? RAIL_EXPANDED : RAIL_COLLAPSED }}
      exit={mobile ? { x: -300 } : undefined}
      transition={{ type: 'spring', stiffness: 380, damping: 36 }}
      className={cx('d-rail fixed inset-y-0 left-0 flex flex-col overflow-hidden text-white', mobile ? 'z-50 lg:hidden' : 'z-40 hidden lg:flex', hover && !pinned && !mobile && 'shadow-[12px_0_40px_-12px_rgba(8,26,68,0.55)]')}
      style={{ background: RAIL_BG }}
      aria-label="Main navigation"
    >
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center gap-3 px-[18px]">
        <button onClick={onHome} title="Public website" className="shrink-0"><Logo /></button>
        {expanded && (
          <motion.div initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="truncate font-display text-[15px] font-bold leading-tight">MyBitRich</div>
              <div className="truncate text-[11px] text-white/60">Member portal</div>
            </div>
            {mobile ? (
              <button onClick={onClose} aria-label="Close menu" className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 hover:bg-white/10 hover:text-white"><X className="h-4 w-4" /></button>
            ) : (
              <button
                onClick={() => onPin(!pinned)}
                title={pinned ? 'Collapse sidebar' : 'Keep sidebar open'}
                aria-label={pinned ? 'Collapse sidebar' : 'Keep sidebar open'}
                aria-pressed={pinned}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                {pinned ? <PanelLeftClose className="h-[18px] w-[18px]" /> : <PanelLeftOpen className="h-[18px] w-[18px]" />}
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Pages */}
      <nav className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2" data-lenis-prevent>
        {RAIL_GROUPS.map((g, gi) => (
          <div key={g.title} className={gi ? 'mt-1' : ''}>
            <div className="flex h-6 items-center px-3">
              {expanded ? (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">{g.title}</motion.span>
              ) : (
                gi > 0 && <span className="mx-auto h-px w-8 bg-white/15" />
              )}
            </div>
            <div className="space-y-0.5">
              {g.items.map((n) => {
                const Icon = n.icon;
                const active = section === n.id;
                const b = badge(n.id);
                return (
                  <button
                    key={n.id}
                    onClick={() => go(n.id)}
                    title={expanded ? undefined : n.label}
                    aria-current={active ? 'page' : undefined}
                    className={cx('group relative flex h-10 w-full items-center gap-3 rounded-xl px-[15px] text-sm font-medium transition-colors', active ? 'text-[#0b2155]' : 'text-white/75 hover:bg-white/10 hover:text-white')}
                  >
                    {active && <motion.span layoutId={mobile ? 'rail-active-m' : 'rail-active'} className="absolute inset-0 rounded-xl bg-white shadow-[0_6px_18px_-6px_rgba(0,0,0,0.45)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                    <span className="relative">
                      <Icon className="d-icon-tilt h-5 w-5" />
                      {!expanded && b && <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-[#f5b544] ring-2 ring-[#0b2155]" />}
                    </span>
                    {expanded && (
                      <motion.span initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="relative flex flex-1 items-center justify-between whitespace-nowrap">
                        {n.label}
                        {b?.count ? <span className="rounded-full bg-[#f5b544] px-1.5 text-[10px] font-bold text-[#1a1204]">{b.count}</span> : null}
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Account: one entry point for profile, settings, feedback and sign-out */}
      <div className="shrink-0 border-t border-white/10 p-3">
        <button
          onClick={onAccount}
          title={expanded ? undefined : 'Account & settings'}
          aria-expanded={accountOpen}
          className={cx('flex h-12 w-full items-center gap-3 rounded-xl px-[10px] text-left transition-colors', accountOpen ? 'bg-white/15' : 'hover:bg-white/10')}
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f5d37c] to-[#d9a83a] text-[11px] font-bold text-[#1a1204]">
            {initials(name)}
            {accountAlert && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#f87171] ring-2 ring-[#081a44]" />}
          </span>
          {expanded && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold">{name}</span>
                <span className="block truncate text-[11px] text-white/60">Account & settings</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-white/60" />
            </motion.span>
          )}
        </button>
      </div>
    </motion.aside>
  );
};

/** Account panel: profile card, account settings, then feedback/site/sign-out — each destination appears once. */
export const MorePanel: React.FC<{
  open: boolean;
  left: number;
  onClose: () => void;
  name: string;
  email: string;
  joined: string;
  go: (s: SectionId) => void;
  openSettings: (t: SettingsTab) => void;
  onPublicSite: () => void;
  onLogout: () => void;
}> = ({ open, left, onClose, name, email, joined, go, openSettings, onPublicSite, onLogout }) => {
  const { account } = useAccount();
  const twoFA = account.settings.security.twoFA;
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  const Row: React.FC<{ icon: React.ElementType; label: string; onClick: () => void; extra?: React.ReactNode }> = ({ icon: Icon, label, onClick, extra }) => (
    <button onClick={() => { onClick(); onClose(); }} className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface-2">
      <Icon className="t-soft h-[18px] w-[18px] group-hover:text-[var(--d-gold)]" />
      <span className="flex-1 font-medium">{label}</span>
      {extra}
      <ChevronRight className="t-muted h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </button>
  );
  const Group: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border-t py-3">
      <div className="t-muted px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em]">{title}</div>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div className="fixed inset-0 z-[44] bg-[var(--d-overlay)] backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            role="dialog"
            aria-label="Account and settings"
            className="fixed inset-y-0 z-[45] flex w-[min(100vw,340px)] flex-col border-r bg-surface shadow-2xl"
            style={{ left }}
            initial={{ x: -24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 38 }}
          >
            <div className="flex items-start justify-between px-5 pb-3 pt-5">
              <div>
                <h2 className="font-display text-xl font-bold">Account</h2>
                <p className="t-muted text-sm">Profile, settings & more</p>
              </div>
              <button onClick={onClose} className="t-muted rounded-lg p-1.5 hover:bg-surface-2 hover:text-[var(--d-text)]" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="no-scrollbar flex-1 overflow-y-auto px-3 pb-4" data-lenis-prevent>
              <button
                onClick={() => { openSettings('profile'); onClose(); }}
                className="group mx-2 mb-3 block w-[calc(100%-1rem)] rounded-2xl border bg-[linear-gradient(135deg,rgba(15,45,107,0.08),rgba(226,181,76,0.08))] p-4 text-left transition-colors hover:border-[var(--d-line-strong)]"
              >
                <div className="flex items-center gap-3">
                  <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0b2155] font-display text-lg font-bold text-white">
                    {initials(name)}
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-[#22c08a] ring-2 ring-[var(--d-surface)]" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold">{name}</div>
                    <div className="t-muted truncate text-xs">{email}</div>
                    <div className="t-muted mt-0.5 text-[11px]">Member since {joined} · <span className="t-gold font-semibold group-hover:underline">View profile</span></div>
                  </div>
                  <ChevronRight className="t-muted h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </div>
              </button>

              <Group title="Account">
                <Row icon={ShieldCheck} label="Security" onClick={() => openSettings('security')} extra={!twoFA && <span className="d-chip d-chip-down !py-0 !text-[10px]">Turn on 2FA</span>} />
                <Row icon={BookUser} label="Address book" onClick={() => openSettings('addresses')} extra={<span className="t-muted text-xs">{account.addresses.length}</span>} />
                <Row icon={Bell} label="Notifications" onClick={() => openSettings('notifications')} />
                <Row icon={SettingsIcon} label="Preferences" onClick={() => openSettings('preferences')} extra={<span className="t-muted text-xs">Theme, network</span>} />
              </Group>
              <Group title="More">
                <Row icon={MessageSquareHeart} label="Send feedback" onClick={() => go('feedback')} />
                <Row icon={Globe} label="Public website" onClick={onPublicSite} />
                <button onClick={() => { onClose(); onLogout(); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[var(--d-down)] hover:bg-[rgba(240,97,109,0.08)]">
                  <LogOut className="h-[18px] w-[18px]" /> Sign out
                </button>
              </Group>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
