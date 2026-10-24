"use client";

import React from "react";
import Timeline from "@/components/ui/timeline";

const settings = {
  textColor: "#ffffff",
  mutedTextColor: "#94a3b8",
  activeColor: "#f5c042",
  backgroundColor: "#040711",
  duration: 1.4,
};

export default function TimelineDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <main className="bg-[#040711] text-white min-h-screen">
      {/* Lead-in so the pinned timeline has somewhere to scroll in from */}
      <section className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-amber-400">
          Decade Execution Blueprint
        </p>
        <h1 className="max-w-[18ch] text-4xl font-extrabold font-display leading-tight tracking-tight sm:text-6xl text-white">
          Ten years, one continuous horizontal journey.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-slate-400 font-mono">
          Keep scrolling — the section pins, the track slides sideways, and each
          milestone draws its stem and reveals its copy as it reaches center.
        </p>
        <span className="mt-2 animate-bounce text-amber-400 text-2xl">&darr;</span>
      </section>

      {/* Realistic usage: custom copy, a branded accent, tuned reveal speed */}
      <Timeline
        title="Decade Roadmap"
        periodLabel="2025 — 2035"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        duration={s.duration}
      />

      <section className="flex h-screen items-center justify-center px-6 text-center text-sm font-mono text-slate-400">
        From our BNB Smart Chain genesis to the $2,000 global valuation.
      </section>
    </main>
  );
}
