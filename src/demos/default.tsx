// src/demos/default.tsx
import { ParallaxComponent } from '@/components/ui/parallax-scrolling';

export default function ParallaxDemo() {
  return (
    <div className="w-full bg-[#040711] text-white min-h-screen">
      <ParallaxComponent 
        title="MyBitRich"
        subtitle="Buy and hold, you will be a billionaire one day"
      />
      <div className="py-8 text-center border-t border-white/10 text-xs text-slate-400 font-mono">
        <p>
          MyBitRich Layered Depth Parallax Engine · Powered by GSAP & Lenis · Targeting $2,000 by 2035
        </p>
      </div>
    </div>
  );
}
