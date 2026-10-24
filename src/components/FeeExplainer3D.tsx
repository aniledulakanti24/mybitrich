import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 3D explainer for the 6% buy / sell fee.
 * Each cycle 50 coins (= 1,000 MBR) leave the trade: 47 land in the wallet (94%)
 * and one each goes to holders, auto-liquidity and treasury (2% + 2% + 2%).
 */

type Side = 'buy' | 'sell';
type DestKey = 'wallet' | 'holders' | 'lp' | 'treasury';

const COINS_PER_TRADE = 50;
const MBR_PER_COIN = 20; // 50 coins represent 1,000 MBR

interface Dest {
  key: DestKey;
  color: number;
  css: string;
  pos: [number, number, number];
  share: number; // coins per trade
  label: Record<Side, string>;
  note: string;
}

const DESTS: Dest[] = [
  { key: 'wallet', color: 0x0f2349, css: '#0F2349', pos: [2.3, 0, -1.2], share: 47, label: { buy: 'Your wallet', sell: 'You receive' }, note: '94%' },
  { key: 'holders', color: 0xf5b82e, css: '#F5B82E', pos: [-0.6, 0, 1.7], share: 1, label: { buy: 'Holders', sell: 'Holders' }, note: '2%' },
  { key: 'lp', color: 0x10b981, css: '#10B981', pos: [0.95, 0, 2.05], share: 1, label: { buy: 'Auto-liquidity', sell: 'Auto-liquidity' }, note: '2%' },
  { key: 'treasury', color: 0x2563eb, css: '#2563EB', pos: [2.55, 0, 1.25], share: 1, label: { buy: 'Treasury', sell: 'Treasury' }, note: '2%' },
];
const SOURCE: [number, number, number] = [-2.4, 0, -0.6];
const SOURCE_LABEL: Record<Side, string> = { buy: 'You buy 1,000 MBR', sell: 'You sell 1,000 MBR' };

const COIN_T = 0.035; // stack thickness per coin

function coinFaceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(90, 80, 10, 128, 128, 128);
  g.addColorStop(0, '#FFF1C1');
  g.addColorStop(0.5, '#E2B54C');
  g.addColorStop(1, '#9C6F17');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  ctx.strokeStyle = 'rgba(92,62,6,0.6)';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(128, 128, 104, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = '800 72px "Plus Jakarta Sans", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(70,46,4,0.7)';
  ctx.fillText('MBR', 130, 134);
  ctx.fillStyle = '#F7DA8A';
  ctx.fillText('MBR', 128, 130);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function shadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(15,35,73,0.28)');
  g.addColorStop(1, 'rgba(15,35,73,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const zeroCounts = (): Record<DestKey, number> => ({ wallet: 0, holders: 0, lp: 0, treasury: 0 });

export const FeeExplainer3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [side, setSide] = useState<Side>('buy');
  const [counts, setCounts] = useState<Record<DestKey, number>>(zeroCounts);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    const target = new THREE.Vector3(0.1, 0.35, 0.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(-3, 6, 5);
    scene.add(key);

    const fit = () => {
      // frame the stage by its real extents: ~3.4 units either side, ~2.3 up/down once tilted
      const vHalf = Math.tan((camera.fov * Math.PI) / 360);
      const hHalf = vHalf * camera.aspect;
      const dist = Math.max(3.4 / hHalf, 2.3 / vHalf) + 0.6;
      const dir = new THREE.Vector3(0, 0.62, 0.78).normalize();
      camera.position.copy(target).addScaledVector(dir, dist);
      camera.lookAt(target);
    };
    fit();

    const faceTex = coinFaceTexture();
    const glowTex = glowTexture();
    const shadowTex = shadowTexture();
    const gold = new THREE.MeshStandardMaterial({ color: 0xd9a63c, metalness: 1, roughness: 0.28 });
    const face = new THREE.MeshStandardMaterial({ map: faceTex, metalness: 0.9, roughness: 0.3 });
    const coinMats = [gold, face, face];

    // pedestals with a coloured rim, a soft contact shadow and a coin stack
    const pedestalGeo = new THREE.CylinderGeometry(0.62, 0.68, 0.18, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.1, roughness: 0.45 });
    const rimGeo = new THREE.TorusGeometry(0.64, 0.035, 12, 64);
    const stackGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 40);
    stackGeo.translate(0, 0.5, 0); // grow upward from the base

    const makePedestal = (pos: [number, number, number], color: number) => {
      const g = new THREE.Group();
      g.position.set(...pos);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.2, 2.2),
        new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.09;
      g.add(shadow);
      g.add(new THREE.Mesh(pedestalGeo, pedestalMat));
      const rim = new THREE.Mesh(
        rimGeo,
        new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.6, metalness: 0.4, roughness: 0.3 }),
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.09;
      g.add(rim);
      const stack = new THREE.Mesh(stackGeo, coinMats);
      stack.position.y = 0.09;
      stack.scale.set(1, 0.0001, 1);
      g.add(stack);
      // arrival flash ring
      const flash = new THREE.Mesh(
        new THREE.RingGeometry(0.7, 0.82, 48),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }),
      );
      flash.rotation.x = -Math.PI / 2;
      flash.position.y = 0.1;
      g.add(flash);
      scene.add(g);
      return { group: g, stack, flash, rim };
    };

    const source = makePedestal(SOURCE, 0xc08f1e);
    const dests = DESTS.map((d) => ({ ...d, ...makePedestal(d.pos, d.color), count: 0, flashT: 0 }));

    // flying coins
    const coinGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.035, 32);
    interface Flyer {
      mesh: THREE.Mesh;
      glow: THREE.Sprite | null;
      dest: (typeof dests)[number];
      launch: number;
      duration: number;
      curve: THREE.QuadraticBezierCurve3 | null;
      done: boolean;
      fee: boolean;
    }
    const flyers: Flyer[] = [];

    // schedule: wallet coins stream steadily; the three fee coins launch spaced out and fly slower
    const schedule: { dest: DestKey; t: number; fee: boolean }[] = [];
    for (let i = 0; i < 47; i++) schedule.push({ dest: 'wallet', t: 0.25 + i * 0.045, fee: false });
    schedule.push({ dest: 'holders', t: 0.55, fee: true }, { dest: 'lp', t: 1.15, fee: true }, { dest: 'treasury', t: 1.75, fee: true });
    schedule.sort((a, b) => a.t - b.t);

    schedule.forEach((s) => {
      const dest = dests.find((d) => d.key === s.dest)!;
      const mesh = new THREE.Mesh(coinGeo, s.fee ? [new THREE.MeshStandardMaterial({ color: dest.color, metalness: 0.6, roughness: 0.3, emissive: dest.color, emissiveIntensity: 0.25 }), face, face] : coinMats);
      mesh.visible = false;
      if (s.fee) mesh.scale.setScalar(1.35);
      scene.add(mesh);
      let glow: THREE.Sprite | null = null;
      if (s.fee) {
        glow = new THREE.Sprite(
          new THREE.SpriteMaterial({ map: glowTex, color: dest.color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }),
        );
        glow.scale.setScalar(0.9);
        glow.visible = false;
        scene.add(glow);
      }
      flyers.push({ mesh, glow, dest, launch: s.t, duration: s.fee ? 1.5 : 0.95, curve: null, done: false, fee: s.fee });
    });

    const CYCLE = 5.6; // seconds: ~3.3s of flights + hold + reset
    let cycleStart = performance.now() / 1000;

    const resetCycle = () => {
      dests.forEach((d) => (d.count = 0));
      flyers.forEach((f) => {
        f.done = false;
        f.curve = null;
        f.mesh.visible = false;
        if (f.glow) f.glow.visible = false;
      });
      setCounts(zeroCounts());
    };

    const tmp = new THREE.Vector3();
    const project = (x: number, y: number, z: number) => {
      tmp.set(x, y, z).project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    };

    let raf = 0;
    let visible = true;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;
      const now = performance.now() / 1000;
      let t = now - cycleStart;
      if (t > CYCLE) {
        cycleStart = now;
        t = 0;
        resetCycle();
      }

      // remaining coins on the source stack
      const launched = flyers.filter((f) => t >= f.launch).length;
      const remaining = COINS_PER_TRADE - launched;
      const sourceH = Math.max(0.0001, remaining * COIN_T);
      source.stack.scale.y += (sourceH - source.stack.scale.y) * 0.3;

      for (const f of flyers) {
        if (t < f.launch) continue;
        const p = (t - f.launch) / f.duration;
        if (!f.curve) {
          const from = new THREE.Vector3(SOURCE[0], 0.15 + sourceH, SOURCE[2]);
          const to = new THREE.Vector3(f.dest.pos[0], 0.15 + f.dest.count * COIN_T + 0.05, f.dest.pos[2]);
          const mid = from.clone().lerp(to, 0.5);
          mid.y += f.fee ? 2.4 : 1.7;
          f.curve = new THREE.QuadraticBezierCurve3(from, mid, to);
        }
        if (p >= 1) {
          if (!f.done) {
            f.done = true;
            f.mesh.visible = false;
            if (f.glow) f.glow.visible = false;
            f.dest.count += 1;
            f.dest.flashT = now;
            const key = f.dest.key;
            setCounts((c) => ({ ...c, [key]: c[key] + 1 }));
          }
          continue;
        }
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        f.curve.getPoint(e, f.mesh.position);
        f.mesh.visible = true;
        f.mesh.rotation.set(Math.PI / 2 - 0.4, 0, now * 6 + f.launch * 10);
        if (f.glow) {
          f.glow.visible = true;
          f.glow.position.copy(f.mesh.position);
        }
      }

      // stacks grow, arrival flashes fade
      for (const d of dests) {
        const h = Math.max(0.0001, d.count * COIN_T * (d.key === 'wallet' ? 1 : 3));
        d.stack.scale.y += (h - d.stack.scale.y) * 0.25;
        const k = (now - d.flashT) / 0.7;
        const flashMat = d.flash.material as THREE.MeshBasicMaterial;
        if (k >= 0 && k < 1) {
          flashMat.opacity = 0.7 * (1 - k);
          d.flash.scale.setScalar(1 + k * 0.8);
        } else flashMat.opacity = 0;
      }

      // move HTML labels to sit above their pedestals
      const place = (id: string, x: number, y: number, z: number) => {
        const el = labelRefs.current[id];
        if (!el) return;
        const s = project(x, y, z);
        el.style.transform = `translate(-50%, -100%) translate(${s.x}px, ${s.y}px)`;
      };
      place('source', SOURCE[0], 0.4 + sourceH, SOURCE[2]);
      dests.forEach((d) => place(d.key, d.pos[0], 0.35 + d.stack.scale.y, d.pos[2]));

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      fit();
    };
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      io.disconnect();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      [faceTex, glowTex, shadowTex, env].forEach((x) => x.dispose());
      pmrem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const mbr = (n: number) => (n * MBR_PER_COIN).toLocaleString();
  const feeTotal = counts.holders + counts.lp + counts.treasury;

  return (
    <div className={`relative mx-auto w-full max-w-[520px] ${className}`}>
      <div className="overflow-hidden rounded-[2rem] border border-white/80 bg-gradient-to-br from-white via-[#F4F7FD] to-gold-50/70 shadow-[0_40px_80px_-40px_rgba(15,35,73,0.45)]">
        {/* header with buy / sell switch */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-600">How the fee works</div>
            <div className="font-display text-xl font-extrabold text-slate-900">
              6% on every {side === 'buy' ? 'buy' : 'sell'}
            </div>
          </div>
          <div className="relative flex rounded-full border border-slate-200 bg-white p-1 text-xs font-semibold">
            {(['buy', 'sell'] as Side[]).map((s) => (
              <button
                key={s}
                onClick={() => setSide(s)}
                className={`relative rounded-full px-4 py-1.5 capitalize transition-colors ${side === s ? 'text-white' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {side === s && (
                  <motion.span
                    layoutId="fee-side"
                    className="absolute inset-0 rounded-full bg-gradient-to-b from-[#17306A] to-[#0F2349]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{s}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3D stage with projected labels */}
        <div className="relative aspect-[5/4] w-full">
          <div ref={mountRef} className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-0">
            <div ref={(el) => (labelRefs.current.source = el)} className="absolute left-0 top-0 whitespace-nowrap">
              <div className="rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-md">{SOURCE_LABEL[side]}</div>
            </div>
            {DESTS.map((d) => (
              <div key={d.key} ref={(el) => (labelRefs.current[d.key] = el)} className="absolute left-0 top-0 whitespace-nowrap">
                <div className="flex items-center gap-1.5 rounded-full border border-white bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-slate-700 shadow-md backdrop-blur">
                  <span className="h-2 w-2 rounded-full" style={{ background: d.css }} />
                  {d.label[side]}
                  <span className="font-bold" style={{ color: d.css }}>
                    {d.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* live tally */}
        <div className="grid grid-cols-2 gap-2 border-t border-slate-200/80 bg-white/70 p-4 sm:grid-cols-4">
          {DESTS.map((d) => (
            <div key={d.key} className="rounded-xl border border-slate-100 bg-white px-3 py-2">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.css }} />
                {d.key === 'wallet' ? (side === 'buy' ? 'You get' : 'Proceeds') : d.label.buy}
              </div>
              <div className="mt-0.5 font-display text-base font-bold tabular-nums text-slate-900">
                {mbr(counts[d.key])}
                <span className="ml-1 text-[11px] font-semibold text-slate-400">/ {mbr(d.share)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 px-5 pb-4 text-[11px] text-slate-500">
          <AnimatePresence mode="wait">
            <motion.span key={side} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
              {side === 'buy'
                ? 'Buy 1,000 MBR → 940 MBR to your wallet, 60 MBR (6%) split three ways.'
                : 'Sell 1,000 MBR → 940 MBR is swapped for you, 60 MBR (6%) split three ways.'}
            </motion.span>
          </AnimatePresence>
          <span className="shrink-0 font-semibold text-gold-600 tabular-nums">Fee {mbr(feeTotal)} / 60</span>
        </div>
      </div>
    </div>
  );
};

export default FeeExplainer3D;
