import React from 'react';
import { motion } from 'framer-motion';
import { WhatIsMyBitRich } from '../WhatIsMyBitRich';
import { CoinComparison } from '../CoinComparison';
import { GettingStarted } from '../GettingStarted';
import { FAQ } from '../FAQ';
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';
import { PieChart, MapPin, ShieldCheck, Calculator, ArrowRight } from 'lucide-react';

interface HomePageProps {
  onOpenSwapModal: () => void;
  onOpenConnectModal: () => void;
  onNavigatePage: (page: string) => void;
}

const EASE = [0.16, 1, 0.3, 1] as const;

const sectionAnimation = {
  initial: { opacity: 0, y: 28, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.85, ease: EASE },
};

// One card per deeper page — the home page summarises, these pages explain
const EXPLORE = [
  {
    page: 'tokenomics',
    title: 'Tokenomics',
    body: 'The 6% buy / sell fee, the 3-tier referral ladder, and the 5-year liquidity lock in detail.',
    icon: PieChart,
    tone: 'bg-gold-50 text-gold-600',
  },
  {
    page: 'roadmap',
    title: 'Roadmap',
    body: 'Four phases from the 2025 launch to a native Layer-1 / Layer-2 coin and the 2035 target.',
    icon: MapPin,
    tone: 'bg-blue-50 text-blue-700',
  },
  {
    page: 'calculator',
    title: 'ROI calculator',
    body: 'Enter a holding and see what it would be worth at different price milestones.',
    icon: Calculator,
    tone: 'bg-indigo-50 text-indigo-700',
  },
  {
    page: 'contracts',
    title: 'Contracts',
    body: 'Token, swap-proxy and router addresses on BNB Smart Chain, ready to copy or open on BscScan.',
    icon: ShieldCheck,
    tone: 'bg-emerald-50 text-emerald-700',
  },
];

export const HomePage: React.FC<HomePageProps> = ({ onOpenSwapModal, onOpenConnectModal, onNavigatePage }) => (
  <div>
    {/* 1. Hero + protocol parameters at a glance */}
    <ParallaxComponent subtitle="“Buy and hold, you will be a billionaire one day.”" onOpenSwapModal={onOpenSwapModal} />

    {/* 2. Why MBR: the three holder benefits and how the 6% fee works */}
    <motion.div {...sectionAnimation}>
      <WhatIsMyBitRich />
    </motion.div>

    {/* 3. How MBR compares */}
    <motion.div {...sectionAnimation}>
      <CoinComparison />
    </motion.div>

    {/* 4. Explore the rest of the site */}
    <motion.section {...sectionAnimation} className="section-cream border-t border-slate-200 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">Go deeper</div>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900 sm:text-4xl">Explore MyBitRich</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EXPLORE.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.page}
                onClick={() => onNavigatePage(item.page)}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                className="luxe-card group flex flex-col p-6 text-left"
              >
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${item.tone}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="mt-4 font-display text-lg font-bold text-slate-900">{item.title}</span>
                <span className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{item.body}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700">
                  Open <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.section>

    {/* 5. How to buy */}
    <motion.div {...sectionAnimation}>
      <GettingStarted onOpenSwapModal={onOpenSwapModal} onOpenConnectModal={onOpenConnectModal} />
    </motion.div>

    {/* 6. FAQ */}
    <motion.div {...sectionAnimation}>
      <FAQ />
    </motion.div>
  </div>
);
