'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { ShieldCheck, TrendingUp, Sparkles, Lock, Coins, ArrowRight, Globe } from 'lucide-react';
import { TOKEN_INFO } from '../../data/tokenData';
import { motion } from 'framer-motion';
import { ParallaxGlobe } from '../3d/ParallaxGlobe';
import { HeroDataPanels, HeroDataGrid } from '../HeroDataPanels';
import { HeroCoin } from '../HeroCoin';
import { ProtocolParameters } from '../ProtocolParameters';
import { Disclaimer } from './Disclaimer';

const heroRise = (delay: number) => ({
  initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } },
  transition: { duration: 0.9, delay: 0.15 + delay, ease: [0.16, 1, 0.3, 1] as const },
});

export interface ParallaxComponentProps {
  title?: string;
  subtitle?: string;
  tagline?: string;
  onOpenSwapModal?: () => void;
}

export function ParallaxComponent({
  title = "MyBitRich",
  subtitle = "“Buy and hold, you will be a billionaire one day.”",
  tagline = "EARN · TRADE · HOLD THROUGH 2035",
  onOpenSwapModal,
}: ParallaxComponentProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      // Background depth layers drift at different speeds while the hero scrolls away:
      // Layer 1 (starfield & nebula) 30%, Layer 4 (foreground gold dust) 6%
      const layers = [
        { layer: "1", yPercent: 30 },
        { layer: "4", yPercent: 6 }
      ];

      layers.forEach((layerObj, idx) => {
        tl.to(
          triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`),
          {
            yPercent: layerObj.yPercent,
            ease: "none"
          },
          idx === 0 ? undefined : "<"
        );
      });
    }

    // Connect with Lenis smooth scroll without duplicate conflicts
    let localLenis: Lenis | null = null;
    let tickerCallback: ((time: number) => void) | null = null;
    if (!(window as any).__lenisGlobal) {
      localLenis = new Lenis();
      localLenis.on('scroll', ScrollTrigger.update);
      tickerCallback = (time: number) => { localLenis?.raf(time * 1000); };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (triggerElement) gsap.killTweensOf(triggerElement);
      if (tickerCallback) gsap.ticker.remove(tickerCallback);
      localLenis?.destroy();
    };
  }, []);

  return (
    <div className="parallax relative w-full overflow-hidden bg-[#030610] text-slate-900" ref={parallaxRef}>
      
      {/* Hero — deep space backdrop, headline, then the full rotating Earth */}
      <section data-nav-theme="dark" className="parallax__header relative w-full overflow-hidden bg-[#030610]">
        <div data-parallax-layers className="parallax__layers relative w-full">

            {/* LAYER 1: Deep cosmic space & ambient nebula (60% scrub) */}
            <div
              data-parallax-layer="1"
              className="parallax__layer-img absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,#0E1C3D_0%,#060B1C_45%,#030610_100%)]" />
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[520px] bg-gradient-to-tr from-amber-500/[0.12] via-blue-600/[0.10] to-transparent rounded-full blur-[150px]" />
              <div className="absolute bottom-10 right-10 w-[550px] h-[450px] bg-amber-400/[0.06] rounded-full blur-[140px]" />

              {/* Starfield */}
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: `
                    radial-gradient(1px 1px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 120px 160px, #f5c042, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 240px 90px, #93c5fd, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 360px 280px, #ffffff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 430px 40px, #ffffff, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 500px 140px, #f5c042, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 640px 340px, #ffffff, rgba(0,0,0,0)),
                    radial-gradient(1.5px 1.5px at 780px 220px, #93c5fd, rgba(0,0,0,0)),
                    radial-gradient(2px 2px at 940px 100px, #f5c042, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 1020px 420px, #ffffff, rgba(0,0,0,0)),
                    radial-gradient(1px 1px at 1120px 300px, #ffffff, rgba(0,0,0,0))
                  `,
                  backgroundSize: '550px 550px'
                }}
              />
            </div>

            {/* LAYER 4: Foreground golden cosmic dust (6% scrub) */}
            <div
              data-parallax-layer="4"
              className="parallax__layer-img absolute inset-0 pointer-events-none select-none z-20 overflow-hidden"
            >
              <div className="absolute top-1/4 left-[16%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_12px_#f5c042] animate-pulse" />
              <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_#ffffff] animate-ping" />
              <div className="absolute top-1/2 left-1/3 w-2.5 h-2.5 rounded-full bg-amber-400/80 shadow-[0_0_15px_#f5c042] animate-pulse" />
              <div className="absolute top-2/3 right-[16%] w-2 h-2 rounded-full bg-amber-200 shadow-[0_0_10px_#f5c042]" />
              <div className="absolute bottom-1/4 left-1/5 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_10px_#38bdf8] animate-pulse" />
            </div>

          {/* Brand emblem, motto and calls to action */}
          <div className="parallax__layer-title relative z-20 mx-auto flex max-w-4xl flex-col items-center px-4 pt-32 text-center select-none sm:pt-40">
            <motion.div {...heroRise(0)} className="mb-6">
              <HeroCoin />
            </motion.div>

            <motion.div {...heroRise(0.1)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-xl border border-amber-300/30 text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-200 mb-4">
              <Globe className="w-3.5 h-3.5 text-amber-300" />
              <span>{tagline}</span>
            </motion.div>

            <motion.h1 {...heroRise(0.2)} className="parallax__title text-6xl sm:text-7xl lg:text-[104px] lg:leading-[0.95] font-extrabold font-display tracking-[-0.04em] !text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              My<span className="text-gradient-gold-bright">BitRich</span>
            </motion.h1>

            <motion.p {...heroRise(0.35)} className="text-xl sm:text-2xl lg:text-3xl font-semibold font-display text-white/90 mt-4 max-w-3xl mx-auto leading-tight">
              {subtitle}
            </motion.p>

            {/* 4 Core Pillars Highlight Strip for Customers */}
            <motion.div {...heroRise(0.48)} className="mt-6 flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto pointer-events-auto">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Zero ICO · 100% Direct Fair Launch
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Tx-Driven Growth · 2% Reflection / Trade
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Rolling 5-Yr Lock From Purchase Date
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/15 text-[11px] font-mono text-slate-200 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
                150M Cap · Demand &amp; Supply Release
              </span>
            </motion.div>

            <motion.div {...heroRise(0.65)} className="mt-8 flex flex-wrap items-center justify-center gap-3 pointer-events-auto">
              <a
                href={TOKEN_INFO.pancakeSwapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-amber-300 to-amber-500 px-7 py-3.5 text-sm font-semibold text-[#1F1503] shadow-[0_8px_30px_-6px_rgba(245,192,66,0.55)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_-6px_rgba(245,192,66,0.7)] active:scale-95"
              >
                <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer-slide" />
                <Coins className="relative h-4 w-4" />
                <span className="relative">Trade on PancakeSwap</span>
                <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              {onOpenSwapModal && (
                <button
                  onClick={onOpenSwapModal}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.07] px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/[0.12] active:scale-95"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  Instant Swap dApp
                </button>
              )}
            </motion.div>
          </div>

          {/* Full Earth with live MBR transfers, flanked by token data cards */}
          <div className="relative -mt-2">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 mx-auto h-[380px] w-full max-w-[1100px] sm:h-[520px] lg:h-[600px]"
            >
              <ParallaxGlobe />
            </motion.div>
            <HeroDataPanels />
          </div>
          <HeroDataGrid />
          <div className="hidden h-12 lg:block" />
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-b from-transparent to-[#030610]/80" />
      </section>

      <ProtocolParameters />

    </div>
  );
}

export default ParallaxComponent;
