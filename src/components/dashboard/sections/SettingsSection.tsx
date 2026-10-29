import React, { useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import {
  Bell,
  BookUser,
  KeyRound,
  Laptop,
  Lock,
  Mail,
  Plus,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Trash2,
  User,
} from 'lucide-react';
import type { UserProfile } from '../../../types/auth';
import { useAccount, type Settings } from '../state/account';
import { useWallet } from '../state/WalletProvider';
import { NETWORKS, isAddressFor, networksFor, shortAddr, timeAgo, type NetworkId } from '../config';
import { CopyButton, Modal, SectionHeader, SpotlightCard, cx } from '../ui';
import { ThemeSwitcher } from '../theme';

type Tab = 'profile' | 'security' | 'notifications' | 'addresses' | 'preferences';

const TABS: { id: Tab; label: string; icon: React.ElementType; blurb: string }[] = [
  { id: 'profile', label: 'Profile', icon: User, blurb: 'Name and contact details' },
  { id: 'security', label: 'Security', icon: ShieldCheck, blurb: '2FA, password, sessions' },
  { id: 'notifications', label: 'Notifications', icon: Bell, blurb: 'What we alert you about' },
  { id: 'addresses', label: 'Address book', icon: BookUser, blurb: 'Saved withdrawal addresses' },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal, blurb: 'Theme, defaults, privacy' },
];

export const Switch: React.FC<{ checked: boolean; onChange: (v: boolean) => void; label: string }> = ({ checked, onChange, label }) => (
  <button role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)} className={cx('relative h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-[var(--d-up)]' : 'bg-surface-3')}>
    <motion.span className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" animate={{ left: checked ? 22 : 2 }} transition={{ type: 'spring', stiffness: 500, damping: 32 }} />
  </button>
);

const Row: React.FC<{ title: string; desc?: string; children: React.ReactNode; icon?: React.ElementType }> = ({ title, desc, children, icon: Icon }) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="flex min-w-0 items-start gap-3">
      {Icon && <span className="t-muted mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-2"><Icon className="h-4 w-4" /></span>}
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        {desc && <div className="t-muted mt-0.5 text-xs leading-relaxed">{desc}</div>}
      </div>
    </div>
    {children}
  </div>
);

const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
  <label className="block">
    <span className="t-muted mb-1.5 block text-xs font-medium">{label}</span>
    {children}
    {hint && <span className="t-muted mt-1 block text-[11px]">{hint}</span>}
  </label>
);

export const SettingsSection: React.FC<{ user: UserProfile; initialTab?: Tab }> = ({ user, initialTab = 'profile' }) => {
  const [tab, setTab] = useState<Tab>(initialTab);
  return (
    <div className="space-y-5">
      <SectionHeader title="Settings" subtitle="Manage your profile, security and how the dashboard works for you." />
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <SpotlightCard className="h-fit p-2">
          <nav className="d-scroll flex gap-1 overflow-x-auto lg:flex-col">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = tab === t.id;
              return (
                <button key={t.id} onClick={() => setTab(t.id)} className={cx('relative flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', active ? 'text-[var(--d-text)]' : 't-muted hover:bg-surface-2 hover:text-[var(--d-text)]')}>
                  {active && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-xl border border-[rgba(226,181,76,0.25)] bg-[rgba(226,181,76,0.08)]" />}
                  <Icon className={cx('relative h-4 w-4', active && 't-gold')} />
                  <span className="relative">
                    <span className="block text-sm font-medium">{t.label}</span>
                    <span className="t-muted hidden text-[11px] lg:block">{t.blurb}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </SpotlightCard>
        <SpotlightCard key={tab} className="p-5 sm:p-6">
          {tab === 'profile' && <ProfileTab user={user} />}
          {tab === 'security' && <SecurityTab email={user.email} />}
          {tab === 'notifications' && <NotificationsTab />}
          {tab === 'addresses' && <AddressBookTab />}
          {tab === 'preferences' && <PreferencesTab />}
        </SpotlightCard>
      </div>
    </div>
  );
};

const ProfileTab: React.FC<{ user: UserProfile }> = ({ user }) => {
  const { account, updateSettings, toast } = useAccount();
  const [draft, setDraft] = useState({ displayName: account.settings.displayName, phone: account.settings.phone, country: account.settings.country });
  const dirty = draft.displayName !== account.settings.displayName || draft.phone !== account.settings.phone || draft.country !== account.settings.country;
  return (
    <div>
      <h3 className="font-display text-lg font-bold">Profile</h3>
      <p className="t-muted text-sm">This is how support and your team see you.</p>
      <div className="mt-5 flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#e2b54c] to-[#4f8bff] font-display text-2xl font-bold text-[#1a1204]">{(draft.displayName || 'U').slice(0, 1).toUpperCase()}</span>
        <div className="text-sm">
          <div className="font-semibold">{draft.displayName || 'Unnamed'}</div>
          <div className="t-muted text-xs">Member since {user.joinedDate} · Referral code {user.referralCode}</div>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="Display name"><input className="d-input" value={draft.displayName} onChange={(e) => setDraft({ ...draft, displayName: e.target.value })} /></Field>
        <Field label="Email" hint="Contact support to change your login email."><input className="d-input opacity-70" value={user.email} readOnly /></Field>
        <Field label="Phone (for withdrawal alerts)"><input className="d-input" inputMode="tel" placeholder="+91 98765 43210" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></Field>
        <Field label="Country">
          <select className="d-input" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })}>
            {['India', 'United Arab Emirates', 'United States', 'United Kingdom', 'Singapore', 'Nigeria', 'Philippines', 'Other'].map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Wallet address"><div className="flex gap-2"><input className="d-input font-code !text-xs opacity-70" value={user.walletAddress} readOnly /><CopyButton text={user.walletAddress} /></div></Field>
      </div>
      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
        <button className="d-btn d-btn-ghost" disabled={!dirty} onClick={() => setDraft({ displayName: account.settings.displayName, phone: account.settings.phone, country: account.settings.country })}>Cancel</button>
        <button className="d-btn d-btn-primary" disabled={!dirty || !draft.displayName.trim()} onClick={() => { updateSettings((s) => ({ ...s, ...draft, displayName: draft.displayName.trim() })); toast('Profile saved'); }}>Save changes</button>
      </div>
    </div>
  );
};

function passwordStrength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) s++;
  if (/\d/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return Math.min(4, s);
}

const SecurityTab: React.FC<{ email: string }> = ({ email }) => {
  const { account, updateSettings, revokeSession, toast } = useAccount();
  const sec = account.settings.security;
  const setSec = (patch: Partial<Settings['security']>) => updateSettings((s) => ({ ...s, security: { ...s.security, ...patch } }));
  const [setup, setSetup] = useState<{ secret: string } | null>(null);
  const [code, setCode] = useState('');
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [phish, setPhish] = useState(sec.antiPhishing);
  const strength = passwordStrength(pw.next);
  const pwAge = Math.floor((Date.now() - sec.passwordChangedAt) / 86_400_000);

  const checks = [
    { ok: sec.twoFA, label: 'Two-factor authentication' },
    { ok: !!sec.antiPhishing, label: 'Anti-phishing code' },
    { ok: sec.whitelistOnly, label: 'Withdrawal whitelist' },
    { ok: pwAge < 90, label: 'Password changed in last 90 days' },
    { ok: sec.loginAlerts, label: 'Login alerts' },
  ];
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100);
  const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

  return (
    <div>
      <h3 className="font-display text-lg font-bold">Security</h3>
      <div className="mt-4 rounded-2xl border bg-surface-2 p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Security score</div>
          <div className={cx('font-display text-xl font-bold', score >= 80 ? 't-up' : score >= 40 ? 't-gold' : 't-down')}>{score}%</div>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-3">
          <motion.div className="h-full rounded-full" style={{ background: score >= 80 ? 'var(--d-up)' : score >= 40 ? 'var(--d-gold)' : 'var(--d-down)' }} initial={{ width: 0 }} animate={{ width: `${score}%` }} />
        </div>
        <ul className="mt-3 grid gap-1.5 text-xs sm:grid-cols-2">
          {checks.map((c) => <li key={c.label} className={c.ok ? 't-up' : 't-muted'}>{c.ok ? '✓' : '○'} {c.label}</li>)}
        </ul>
      </div>

      <div className="mt-2 divide-y divide-[var(--d-line)]">
        <Row icon={Smartphone} title="Authenticator app (2FA)" desc="Ask for a 6-digit code from Google Authenticator or Authy at sign-in and before withdrawals.">
          <Switch
            label="Two-factor authentication"
            checked={sec.twoFA}
            onChange={(v) => {
              if (v) setSetup({ secret: Array.from({ length: 16 }, () => B32[Math.floor(Math.random() * 32)]).join('') });
              else if (window.confirm('Turn off two-factor authentication? Your account will be less secure.')) { setSec({ twoFA: false }); toast('2FA turned off', 'down'); }
            }}
          />
        </Row>
        <Row icon={Mail} title="Anti-phishing code" desc="Shown in every genuine email from us, so you can spot fakes.">
          <div className="flex gap-2">
            <input className="d-input !w-36 !py-1.5" maxLength={20} placeholder="e.g. GOLDEN-OWL" value={phish} onChange={(e) => setPhish(e.target.value)} />
            <button className="d-btn d-btn-ghost !py-1.5" disabled={phish === sec.antiPhishing} onClick={() => { setSec({ antiPhishing: phish.trim() }); toast('Anti-phishing code saved'); }}>Save</button>
          </div>
        </Row>
        <Row icon={Lock} title="Withdrawal whitelist" desc="Only allow withdrawals to addresses saved in your address book.">
          <Switch label="Withdrawal whitelist" checked={sec.whitelistOnly} onChange={(v) => { setSec({ whitelistOnly: v }); toast(v ? 'Whitelist on: only saved addresses allowed' : 'Whitelist off', v ? 'up' : 'gold'); }} />
        </Row>
        <Row icon={Bell} title="Login alerts" desc="Email me when my account signs in from a new device.">
          <Switch label="Login alerts" checked={sec.loginAlerts} onChange={(v) => setSec({ loginAlerts: v })} />
        </Row>
      </div>

      <div className="mt-4 rounded-2xl border p-4">
        <div className="flex items-center gap-2 text-sm font-semibold"><KeyRound className="t-gold h-4 w-4" /> Change password <span className="t-muted text-xs font-normal">· last changed {pwAge} days ago</span></div>
        <form
          className="mt-3 grid gap-3 sm:grid-cols-3"
          onSubmit={(e) => {
            e.preventDefault();
            setSec({ passwordChangedAt: Date.now() });
            setPw({ current: '', next: '', confirm: '' });
            toast('Password updated');
          }}
        >
          <input className="d-input" type="password" autoComplete="current-password" placeholder="Current password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} />
          <div>
            <input className="d-input" type="password" autoComplete="new-password" placeholder="New password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} />
            {pw.next && (
              <div className="mt-1.5 flex gap-1">
                {[0, 1, 2, 3].map((i) => <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < strength ? ['#f0616d', '#e2b54c', '#4f8bff', '#22c08a'][strength - 1] : 'var(--d-surface-3)' }} />)}
              </div>
            )}
          </div>
          <input className="d-input" type="password" autoComplete="new-password" placeholder="Confirm new password" aria-invalid={!!pw.confirm && pw.confirm !== pw.next} value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} />
          <div className="t-muted text-[11px] sm:col-span-2">Use 12+ characters with upper and lower case, a number and a symbol.</div>
          <button className="d-btn d-btn-primary" disabled={!pw.current || strength < 3 || pw.next !== pw.confirm}>Update password</button>
        </form>
      </div>

      <div className="mt-4">
        <div className="mb-2 text-sm font-semibold">Active sessions</div>
        <ul className="divide-y divide-[var(--d-line)] rounded-2xl border">
          {account.sessions.map((s) => (
            <li key={s.id} className="flex items-center gap-3 px-4 py-3">
              <span className="t-muted flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2">{s.device.includes('iPhone') ? <Smartphone className="h-4 w-4" /> : <Laptop className="h-4 w-4" />}</span>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium">{s.device} {s.current && <span className="d-chip d-chip-up ml-1 !py-0 !text-[10px]">This device</span>}</div>
                <div className="t-muted text-xs">{s.location} · {s.current ? 'Active now' : `Last active ${timeAgo(s.lastActive)}`}</div>
              </div>
              {!s.current && <button className="d-btn d-btn-ghost !py-1.5 text-xs text-[var(--d-down)]" onClick={() => { revokeSession(s.id); toast(`Signed out ${s.device}`); }}>Sign out</button>}
            </li>
          ))}
        </ul>
      </div>

      <Modal open={!!setup} onClose={() => { setSetup(null); setCode(''); }} title="Set up authenticator" subtitle="Scan with Google Authenticator, Authy or 1Password" width="max-w-sm">
        {setup && (
          <div className="space-y-4 text-center">
            <div className="mx-auto w-fit rounded-xl bg-white p-3"><QRCodeSVG value={`otpauth://totp/MyBitRich:${email}?secret=${setup.secret}&issuer=MyBitRich`} size={160} /></div>
            <div>
              <div className="t-muted text-xs">Or enter this key manually</div>
              <div className="mt-1 flex items-center justify-center gap-2"><span className="font-code text-sm tracking-wider">{setup.secret.match(/.{4}/g)?.join(' ')}</span><CopyButton text={setup.secret} /></div>
            </div>
            <input className="d-input text-center font-code !text-lg tracking-[0.5em]" inputMode="numeric" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))} aria-label="6-digit code" />
            <button className="d-btn d-btn-primary w-full !py-3" disabled={code.length !== 6} onClick={() => { setSec({ twoFA: true }); setSetup(null); setCode(''); toast('Two-factor authentication is on'); }}>Verify and turn on</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

const NotificationsTab: React.FC = () => {
  const { account, updateSettings } = useAccount();
  const n = account.settings.notify;
  const set = (k: keyof Settings['notify'], v: boolean) => updateSettings((s) => ({ ...s, notify: { ...s.notify, [k]: v } }));
  const events: { k: keyof Settings['notify']; t: string; d: string }[] = [
    { k: 'deposits', t: 'Deposits', d: 'When a deposit is detected and when it is credited' },
    { k: 'withdrawals', t: 'Withdrawals', d: 'When a withdrawal is processing and when it is sent' },
    { k: 'swaps', t: 'Swaps', d: 'Confirmation of every USDT ⇄ MBR swap' },
    { k: 'referral', t: 'Referral rewards', d: 'When your team’s buys earn you MBR' },
    { k: 'holding', t: 'Holding rewards', d: 'Each time holding reward is added (frequent)' },
    { k: 'announcements', t: 'Announcements', d: 'New features, network updates and maintenance' },
  ];
  return (
    <div>
      <h3 className="font-display text-lg font-bold">Notifications</h3>
      <p className="t-muted text-sm">Choose what appears in the bell menu and how we reach you.</p>
      <div className="mt-3 divide-y divide-[var(--d-line)]">
        {events.map((e) => <Row key={e.k} title={e.t} desc={e.d}><Switch label={e.t} checked={n[e.k]} onChange={(v) => set(e.k, v)} /></Row>)}
      </div>
      <div className="t-muted mt-5 text-xs font-semibold uppercase tracking-wider">Channels</div>
      <div className="divide-y divide-[var(--d-line)]">
        <Row icon={Mail} title="Email" desc="Sent to your login email"><Switch label="Email notifications" checked={n.email} onChange={(v) => set('email', v)} /></Row>
        <Row icon={Smartphone} title="Browser push" desc="Pop-up alerts while the dashboard is open in a tab">
          <Switch
            label="Push notifications"
            checked={n.push}
            onChange={async (v) => {
              if (v && 'Notification' in window && Notification.permission !== 'granted') {
                const p = await Notification.requestPermission();
                if (p !== 'granted') return;
              }
              set('push', v);
            }}
          />
        </Row>
      </div>
    </div>
  );
};

const AddressBookTab: React.FC = () => {
  const { account, addAddress, removeAddress, toast } = useAccount();
  const [label, setLabel] = useState('');
  const [network, setNetwork] = useState<NetworkId>('TRC20');
  const [address, setAddress] = useState('');
  const bad = address.length > 0 && !isAddressFor(network, address);
  return (
    <div>
      <h3 className="font-display text-lg font-bold">Address book</h3>
      <p className="t-muted text-sm">Save addresses you withdraw to often, then pick them in one tap.{account.settings.security.whitelistOnly && ' Whitelist is on: withdrawals are limited to these addresses.'}</p>
      <form
        className="mt-5 grid gap-3 rounded-2xl border bg-surface-2 p-4 sm:grid-cols-[1fr_140px] lg:grid-cols-[180px_140px_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault();
          addAddress({ label: label.trim(), network, address: address.trim() });
          toast(`Saved “${label.trim()}”`);
          setLabel('');
          setAddress('');
        }}
      >
        <input className="d-input" placeholder="Label, e.g. My Binance" value={label} onChange={(e) => setLabel(e.target.value)} maxLength={32} />
        <select className="d-input" value={network} onChange={(e) => setNetwork(e.target.value as NetworkId)}>
          {networksFor('USDT').map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
        <input className="d-input font-code !text-xs sm:col-span-2 lg:col-span-1" placeholder={`${NETWORKS[network].label} address · ${NETWORKS[network].addressHint}`} aria-invalid={bad} value={address} onChange={(e) => setAddress(e.target.value.trim())} />
        <button className="d-btn d-btn-primary sm:col-span-2 lg:col-span-1" disabled={!label.trim() || !address || bad}><Plus className="h-4 w-4" /> Save</button>
        {bad && <div className="t-down text-xs sm:col-span-2 lg:col-span-4">Not a valid {NETWORKS[network].label} address. {NETWORKS[network].addressHint}.</div>}
      </form>
      <ul className="mt-4 space-y-2">
        {account.addresses.length === 0 && <li className="t-muted rounded-2xl border border-dashed py-8 text-center text-sm">No saved addresses yet</li>}
        {account.addresses.map((a) => (
          <li key={a.id} className="flex items-center gap-3 rounded-2xl border px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white" style={{ background: NETWORKS[a.network].color }}>{NETWORKS[a.network].label.split('-')[0]}</span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{a.label}</div>
              <div className="t-muted font-code truncate text-xs">{shortAddr(a.address, 10, 8)} · {NETWORKS[a.network].label}</div>
            </div>
            <CopyButton text={a.address} />
            <button className="d-btn d-btn-ghost !p-2 hover:text-[var(--d-down)]" aria-label={`Delete ${a.label}`} onClick={() => { removeAddress(a.id); toast(`Removed “${a.label}”`, 'gold'); }}><Trash2 className="h-3.5 w-3.5" /></button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PreferencesTab: React.FC = () => {
  const { account, updateSettings } = useAccount();
  const { resetDemo } = useWallet();
  const p = account.settings.prefs;
  const set = (patch: Partial<Settings['prefs']>) => updateSettings((s) => ({ ...s, prefs: { ...s.prefs, ...patch } }));
  const opts = useMemo(() => networksFor('USDT'), []);
  return (
    <div>
      <h3 className="font-display text-lg font-bold">Preferences</h3>
      <div className="mt-3 divide-y divide-[var(--d-line)]">
        <Row title="Theme" desc="Light, dark, or follow your device"><ThemeSwitcher withLabels layoutId="theme-settings" /></Row>
        <Row title="Default USDT network" desc="Pre-selected when you deposit or withdraw">
          <select className="d-input !w-auto !py-1.5" value={p.defaultNetwork} onChange={(e) => set({ defaultNetwork: e.target.value as NetworkId })}>
            {opts.map((n) => <option key={n.id} value={n.id}>{n.label} · {n.chain}</option>)}
          </select>
        </Row>
        <Row title="Hide balances" desc="Blur amounts on screen. Handy in public places. Also the eye icon next to Total balance."><Switch label="Hide balances" checked={p.hideBalances} onChange={(v) => set({ hideBalances: v })} /></Row>
        <Row title="Reduce motion" desc="Turn off scroll and decorative animations"><Switch label="Reduce motion" checked={p.reduceMotion} onChange={(v) => set({ reduceMotion: v })} /></Row>
        <Row title="Reset demo data" desc="Restore the sample balances, history and team (demo only)">
          <button className="d-btn d-btn-ghost text-[var(--d-down)]" onClick={() => window.confirm('Reset demo balances and history for this account?') && resetDemo()}>Reset</button>
        </Row>
      </div>
    </div>
  );
};
