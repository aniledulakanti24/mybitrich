import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { triggerBillionaireConfetti } from '../../utils/confetti';
import { ArrowLeft, ArrowRight, Eye, EyeOff, Wallet, Sparkles, ShieldCheck } from 'lucide-react';
import { DOCUMENTATION_NOTICE, OFFICIAL_DISCLAIMER } from '../ui/Disclaimer';
import { AuthWorldMap } from './AuthWorldMap';
import { HeroCoin } from '../HeroCoin';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onNavigateHome: () => void;
  onAuthSuccess: () => void;
}

type Mode = 'signin' | 'signup';
const EASE = [0.16, 1, 0.3, 1] as const;

const COPY: Record<Mode, { title: string; subtitle: string; submit: string; switchText: string; switchCta: string }> = {
  signin: {
    title: 'Welcome back',
    subtitle: 'Sign in to your MBR console',
    submit: 'Sign in',
    switchText: "Don't have an account?",
    switchCta: 'Sign up',
  },
  signup: {
    title: 'Create your account',
    subtitle: 'Track your MBR, holder rewards and referrals',
    submit: 'Create account',
    switchText: 'Already have an account?',
    switchCta: 'Sign in',
  },
};

/** Labeled input with the required marker and a focus ring, matching the reference form. */
const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: React.ReactNode;
  children: React.ReactNode;
}> = ({ label, required, hint, children }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -6 }}
    transition={{ duration: 0.35, ease: EASE }}
    className="space-y-1.5"
  >
    <div className="flex items-center justify-between">
      <label className="text-sm font-semibold text-slate-800">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {hint}
    </div>
    {children}
  </motion.div>
);

const inputClass =
  'w-full rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-[#17306A] focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100';

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin', onNavigateHome, onAuthSuccess }) => {
  const { loginWithEmail, signupWithEmail, loginWithWallet } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = COPY[mode];

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password || (mode === 'signup' && !name)) {
      setError(mode === 'signin' ? 'Please enter your email and password.' : 'Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'signin') await loginWithEmail(email, password);
      else await signupWithEmail(name, email, password, referralCode);
      triggerBillionaireConfetti();
      onAuthSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    await loginWithEmail('investor@mybitrich.com', 'demo123');
    triggerBillionaireConfetti();
    setLoading(false);
    onAuthSuccess();
  };

  const handleWeb3Connect = async () => {
    setLoading(true);
    const randomHex = Math.floor(Math.random() * 0xffffff).toString(16).toUpperCase().padStart(6, '0');
    await loginWithWallet(`0x71C${randomHex}F820bE9871D2a3C9b8417`);
    triggerBillionaireConfetti();
    setLoading(false);
    onAuthSuccess();
  };

  return (
    <div className="section-hero relative flex min-h-screen flex-col overflow-hidden font-sans text-slate-800">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-60" />

      {/* top bar */}
      <header className="relative z-10 mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <button
          onClick={onNavigateHome}
          className="group flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to site
        </button>
        <div className="flex items-center gap-2.5">
          <img src="/assets/logo.png" alt="" className="h-8 w-8 rounded-full bg-white object-contain p-1 shadow-sm ring-1 ring-gold-300/60" />
          <span className="font-display text-base font-bold tracking-tight text-slate-900">
            My<span className="text-gradient-gold">BitRich</span>
          </span>
        </div>
      </header>

      {/* split card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-6 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_40px_100px_-40px_rgba(15,35,73,0.45)] lg:grid-cols-2"
        >
          {/* visual panel */}
          <div className="relative hidden min-h-[600px] overflow-hidden bg-[radial-gradient(ellipse_at_30%_20%,#18306A_0%,#0B1631_55%,#060B1C_100%)] lg:block">
            <div className="absolute inset-x-0 top-[18%] h-[52%] opacity-90">
              <AuthWorldMap />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-10">
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7, ease: EASE }}>
                <div className="mb-5 origin-left scale-75">
                  <HeroCoin />
                </div>
                <h2 className="font-display text-3xl font-extrabold leading-tight !text-white">
                  Hold with <span className="text-gradient-gold-bright">conviction.</span>
                </h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-300">
                  Your MBR balance, holder rewards and 3-tier referrals — in one place, through 2035.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {['150M fixed supply', '6% buy / sell', '5-yr LP lock'].map((chip) => (
                    <span key={chip} className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
                      {chip}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* form panel */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <h1 className="font-display text-3xl font-extrabold tracking-tight text-slate-900">{copy.title}</h1>
                <p className="mt-1.5 text-sm text-slate-500">{copy.subtitle}</p>
              </motion.div>
            </AnimatePresence>

            {/* wallet option (in place of the reference's Google button) */}
            <button
              type="button"
              onClick={handleWeb3Connect}
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:opacity-60"
            >
              <Wallet className="h-4 w-4 text-gold-600" />
              Continue with wallet
              <span className="text-xs font-normal text-slate-400">MetaMask · Trust</span>
            </button>

            <div className="my-6 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 border-t border-dashed border-slate-300" />
              or
              <span className="h-px flex-1 border-t border-dashed border-slate-300" />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  key={error}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: [0, -8, 8, -5, 5, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45 }}
                  className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs font-medium text-rose-600"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form layout onSubmit={handleSubmit} className="space-y-4" transition={{ duration: 0.35, ease: EASE }}>
              <AnimatePresence initial={false}>
                {mode === 'signup' && (
                  <Field key="name" label="Full name" required>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className={inputClass} autoComplete="name" />
                  </Field>
                )}
              </AnimatePresence>

              <Field label="Email" required>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className={inputClass} autoComplete="email" />
              </Field>

              <Field
                label="Password"
                required
                hint={
                  mode === 'signin' ? (
                    <button
                      type="button"
                      onClick={() => alert('Password reset is handled from the official console.')}
                      className="text-xs font-semibold text-blue-700 hover:underline"
                    >
                      Forgot password?
                    </button>
                  ) : undefined
                }
              >
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={`${inputClass} pr-11`}
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition-colors hover:text-slate-700"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </Field>

              <AnimatePresence initial={false}>
                {mode === 'signup' && (
                  <Field key="ref" label="Referral code" hint={<span className="text-xs text-slate-400">Optional</span>}>
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="e.g. MBR-71C8A9"
                      className={`${inputClass} font-code uppercase`}
                    />
                  </Field>
                )}
              </AnimatePresence>

              <motion.button
                layout
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-b from-[#17306A] to-[#0F2349] py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_-12px_rgba(15,35,73,0.7)] transition-shadow hover:shadow-[0_16px_36px_-12px_rgba(15,35,73,0.8)] disabled:opacity-70"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-[420%]" />
                {loading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {copy.submit}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </motion.form>

            <motion.div layout className="mt-6 space-y-3 text-center text-sm">
              <p className="text-slate-500">
                {copy.switchText}{' '}
                <button type="button" onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')} className="font-semibold text-blue-700 hover:underline">
                  {copy.switchCta}
                </button>
              </p>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 transition-colors hover:text-gold-700"
              >
                <Sparkles className="h-3.5 w-3.5" /> Try the demo account
              </button>
              <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Non-custodial — your keys stay in your wallet
              </div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      <footer className="relative z-10 px-4 py-6 text-center text-[11px] text-slate-500">
        <p>© 2025–2026 MyBitRich (MBR). {DOCUMENTATION_NOTICE}</p>
        <p className="mx-auto mt-1 max-w-2xl">{OFFICIAL_DISCLAIMER}</p>
      </footer>
    </div>
  );
};
