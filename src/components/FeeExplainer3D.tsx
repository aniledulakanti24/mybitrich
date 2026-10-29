import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * High-Precision 3D Interactive Explainer for the 6% Buy / Sell Protocol Fee.
 *
 * Each cycle 50 coins (= 1,000 MBR) launch from the trade source:
 * - 47 coins (94% / 940 MBR) stream smoothly in a fluid golden parabolic cascade to the trader's wallet.
 * - 3 distinct 2% fee coins (Holders, Auto-Liquidity, Treasury) launch in high-altitude heroic arcs
 *   with radiant aura trails and celebratory impact shockwaves upon touchdown.
 */

type Side = 'buy' | 'sell';
type DestKey = 'wallet' | 'holders' | 'lp' | 'treasury';

const COINS_PER_TRADE = 50;
const MBR_PER_COIN = 20; // 50 coins represent 1,000 MBR
const COIN_T = 0.034; // Stack thickness per coin

interface Dest {
  key: DestKey;
  color: number;
  rimColor: number;
  css: string;
  badgeBg: string;
  pos: [number, number, number];
  share: number; // Coins per trade
  label: Record<Side, string>;
  note: string;
}

const DESTS: Dest[] = [
  {
    key: 'wallet',
    color: 0x102554,
    rimColor: 0x3b82f6,
    css: '#17306A',
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    pos: [2.3, 0, -1.2],
    share: 47,
    label: { buy: 'Your wallet', sell: 'You receive' },
    note: '94%',
  },
  {
    key: 'holders',
    color: 0xf59e0b,
    rimColor: 0xfbbf24,
    css: '#F59E0B',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    pos: [-0.65, 0, 1.7],
    share: 1,
    label: { buy: 'Holders', sell: 'Holders' },
    note: '2%',
  },
  {
    key: 'lp',
    color: 0x10b981,
    rimColor: 0x34d399,
    css: '#10B981',
    badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    pos: [0.95, 0, 2.05],
    share: 1,
    label: { buy: 'Auto-liquidity', sell: 'Auto-liquidity' },
    note: '2%',
  },
  {
    key: 'treasury',
    color: 0x2563eb,
    rimColor: 0x60a5fa,
    css: '#2563EB',
    badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    pos: [2.55, 0, 1.25],
    share: 1,
    label: { buy: 'Treasury', sell: 'Treasury' },
    note: '2%',
  },
];

const SOURCE: [number, number, number] = [-2.4, 0, -0.6];
const SOURCE_LABEL: Record<Side, string> = {
  buy: 'You buy 1,000 MBR',
  sell: 'You sell 1,000 MBR',
};

// Procedural high-detail embossed MBR coin face texture
function createCoinFaceTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 512;
  const ctx = c.getContext('2d')!;

  // Multi-tier radial gold gradient
  const g = ctx.createRadialGradient(180, 150, 20, 256, 256, 256);
  g.addColorStop(0, '#FFF6CC');
  g.addColorStop(0.35, '#F5CB60');
  g.addColorStop(0.7, '#D49B23');
  g.addColorStop(1, '#825708');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Outer bevel ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.arc(256, 256, 240, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(92, 58, 6, 0.65)';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(256, 256, 226, 0, Math.PI * 2);
  ctx.stroke();

  // Luxury beaded rim (dots around the coin rim)
  const numDots = 42;
  for (let i = 0; i < numDots; i++) {
    const angle = (i / numDots) * Math.PI * 2;
    const r = 214;
    const x = 256 + Math.cos(angle) * r;
    const y = 256 + Math.sin(angle) * r;
    ctx.fillStyle = '#FFEAA7';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(70, 45, 4, 0.6)';
    ctx.beginPath();
    ctx.arc(x + 1, y + 1, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner decorative ring
  ctx.strokeStyle = 'rgba(247, 218, 138, 0.85)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 186, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle interior currency lattice
  ctx.save();
  ctx.beginPath();
  ctx.arc(256, 256, 180, 0, Math.PI * 2);
  ctx.clip();
  ctx.strokeStyle = 'rgba(180, 130, 20, 0.16)';
  ctx.lineWidth = 2;
  for (let rad = 30; rad <= 160; rad += 26) {
    ctx.beginPath();
    ctx.ellipse(256, 256, rad, rad * 0.45, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();

  // Embossed MBR Monogram with 3D drop & light highlights
  ctx.font = '900 132px "Plus Jakarta Sans", "Inter", Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Deep shadow
  ctx.fillStyle = 'rgba(56, 36, 4, 0.9)';
  ctx.fillText('MBR', 260, 266);

  // Midtone bevel
  ctx.fillStyle = '#B8860B';
  ctx.fillText('MBR', 258, 260);

  // Brilliant face highlight
  ctx.fillStyle = '#FFF9DB';
  ctx.fillText('MBR', 255, 253);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Procedural reeded coin edge texture for individual stacked coins
function createStackEdgeTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  const bands = 8;
  const h = c.height / bands;
  for (let i = 0; i < bands; i++) {
    const y = i * h;
    // Specular highlight top rim
    ctx.fillStyle = '#FFF3B3';
    ctx.fillRect(0, y, c.width, h * 0.22);
    // Satin metallic coin body
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, '#E5BA44');
    g.addColorStop(0.5, '#C6931D');
    g.addColorStop(1, '#8F630E');
    ctx.fillStyle = g;
    ctx.fillRect(0, y + h * 0.22, c.width, h * 0.58);
    // Dark recessed groove between stacked coins
    ctx.fillStyle = '#3E2402';
    ctx.fillRect(0, y + h * 0.8, c.width, h * 0.2);
  }

  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// Luminous radial glow sprite texture
function createGlowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255, 255, 255, 1)');
  g.addColorStop(0.25, 'rgba(255, 230, 140, 0.7)');
  g.addColorStop(0.6, 'rgba(245, 180, 40, 0.2)');
  g.addColorStop(1, 'rgba(245, 180, 40, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// Star flare particle texture for touchdown sparks
function createSparkleTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;

  const rg = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(255, 255, 255, 1)');
  rg.addColorStop(0.2, 'rgba(255, 235, 160, 0.8)');
  rg.addColorStop(0.5, 'rgba(245, 184, 46, 0.25)');
  rg.addColorStop(1, 'rgba(245, 184, 46, 0)');
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, 128, 128);

  // 4-point flare star
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(64, 12);
  ctx.quadraticCurveTo(64, 64, 12, 64);
  ctx.quadraticCurveTo(64, 64, 64, 116);
  ctx.quadraticCurveTo(64, 64, 116, 64);
  ctx.quadraticCurveTo(64, 64, 64, 12);
  ctx.fill();

  return new THREE.CanvasTexture(c);
}

// Soft contact ambient occlusion shadow
function createShadowTexture(): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = 128;
  c.height = 128;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(15, 35, 73, 0.32)');
  g.addColorStop(0.35, 'rgba(15, 35, 73, 0.16)');
  g.addColorStop(0.75, 'rgba(15, 35, 73, 0.03)');
  g.addColorStop(1, 'rgba(15, 35, 73, 0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

const zeroCounts = (): Record<DestKey, number> => ({
  wallet: 0,
  holders: 0,
  lp: 0,
  treasury: 0,
});

export const FeeExplainer3D: React.FC<{ className?: string }> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [side, setSide] = useState<Side>('buy');
  const [counts, setCounts] = useState<Record<DestKey, number>>(zeroCounts);
  const [isSettled, setIsSettled] = useState(false);
  const replayTriggerRef = useRef<(() => void) | null>(null);

  const handleReplay = useCallback(() => {
    if (replayTriggerRef.current) {
      replayTriggerRef.current();
    }
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    const target = new THREE.Vector3(0.1, 0.35, 0.3);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;

    // Studio Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.45);
    keyLight.position.set(-3, 6, 5);
    scene.add(keyLight);

    // Warm metallic rim light for golden coin edge gleam
    const rimLight = new THREE.DirectionalLight(0xffe8a3, 0.85);
    rimLight.position.set(4, 3.5, -4);
    scene.add(rimLight);

    // Subtle cool fill light
    const fillLight = new THREE.DirectionalLight(0xa5c4f5, 0.3);
    fillLight.position.set(0, -2, 4);
    scene.add(fillLight);

    const fit = () => {
      const vHalf = Math.tan((camera.fov * Math.PI) / 360);
      const hHalf = vHalf * camera.aspect;
      const dist = Math.max(3.4 / hHalf, 2.3 / vHalf) + 0.6;
      const dir = new THREE.Vector3(0, 0.62, 0.78).normalize();
      camera.position.copy(target).addScaledVector(dir, dist);
      camera.lookAt(target);
    };
    fit();

    // Shared Textures & Materials
    const faceTex = createCoinFaceTexture();
    const stackEdgeTex = createStackEdgeTexture();
    const glowTex = createGlowTexture();
    const sparkleTex = createSparkleTexture();
    const shadowTex = createShadowTexture();

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd9a63c,
      metalness: 0.95,
      roughness: 0.26,
    });
    const faceMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      metalness: 0.9,
      roughness: 0.28,
    });
    const coinMats = [goldMat, faceMat, faceMat];

    const stackSideMat = new THREE.MeshStandardMaterial({
      map: stackEdgeTex,
      metalness: 0.9,
      roughness: 0.28,
    });
    const stackMats = [stackSideMat, faceMat, faceMat];

    // Pedestals
    const pedestalGeo = new THREE.CylinderGeometry(0.62, 0.68, 0.18, 56);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.1,
      roughness: 0.42,
    });
    const rimGeo = new THREE.TorusGeometry(0.64, 0.038, 16, 64);
    const stackGeo = new THREE.CylinderGeometry(0.3, 0.3, 1, 48);
    stackGeo.translate(0, 0.5, 0); // Grow upwards from the pedestal top

    // Pedestal Creator
    const makePedestal = (pos: [number, number, number], color: number, rimColor: number) => {
      const g = new THREE.Group();
      g.position.set(...pos);

      // Contact shadow
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 2.3),
        new THREE.MeshBasicMaterial({
          map: shadowTex,
          transparent: true,
          depthWrite: false,
        }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.09;
      g.add(shadow);

      // Pedestal base
      g.add(new THREE.Mesh(pedestalGeo, pedestalMat));

      // Metallic illuminated colored rim
      const rim = new THREE.Mesh(
        rimGeo,
        new THREE.MeshStandardMaterial({
          color: rimColor,
          emissive: rimColor,
          emissiveIntensity: 0.7,
          metalness: 0.5,
          roughness: 0.25,
        }),
      );
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.09;
      g.add(rim);

      // Pedestal underglow ring
      const underglow = new THREE.Mesh(
        new THREE.RingGeometry(0.62, 0.88, 56),
        new THREE.MeshBasicMaterial({
          color: rimColor,
          transparent: true,
          opacity: 0.16,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      underglow.rotation.x = -Math.PI / 2;
      underglow.position.y = 0.01;
      g.add(underglow);

      // The coin stack
      const stack = new THREE.Mesh(stackGeo, stackMats);
      stack.position.y = 0.09;
      stack.scale.set(1, 0.0001, 1);
      g.add(stack);

      // Arrival shockwave expanding flash ring
      const flash = new THREE.Mesh(
        new THREE.RingGeometry(0.66, 0.84, 56),
        new THREE.MeshBasicMaterial({
          color: rimColor,
          transparent: true,
          opacity: 0,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      flash.rotation.x = -Math.PI / 2;
      flash.position.y = 0.1;
      g.add(flash);

      scene.add(g);
      return {
        group: g,
        stack,
        flash,
        rim,
        underglow,
        bounceY: 0,
        bounceVel: 0,
        flashT: 0,
      };
    };

    const source = makePedestal(SOURCE, 0xc08f1e, 0xf59e0b);
    const dests = DESTS.map((d) => ({
      ...d,
      ...makePedestal(d.pos, d.color, d.rimColor),
      count: 0,
    }));

    // Sparkle Particle Pool for Touchdown Impacts
    interface SparkParticle {
      sprite: THREE.Sprite;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
      active: boolean;
    }
    const sparkles: SparkParticle[] = [];
    const sparkMat = new THREE.SpriteMaterial({
      map: sparkleTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    for (let i = 0; i < 24; i++) {
      const s = new THREE.Sprite(sparkMat.clone());
      s.visible = false;
      scene.add(s);
      sparkles.push({ sprite: s, vx: 0, vy: 0, vz: 0, life: 0, maxLife: 0.35, active: false });
    }

    const spawnImpactSparkles = (pos: THREE.Vector3, color: number, count = 3) => {
      let spawned = 0;
      for (const sp of sparkles) {
        if (!sp.active) {
          sp.active = true;
          sp.sprite.visible = true;
          sp.sprite.position.copy(pos);
          sp.sprite.position.y += 0.08;
          sp.sprite.material.color.setHex(color);
          sp.vx = (Math.random() - 0.5) * 0.9;
          sp.vy = 1.1 + Math.random() * 0.8;
          sp.vz = (Math.random() - 0.5) * 0.9;
          sp.life = 0.32 + Math.random() * 0.12;
          sp.maxLife = sp.life;
          sp.sprite.scale.setScalar(0.35);
          spawned++;
          if (spawned >= count) break;
        }
      }
    };

    // Flying Coins
    const coinGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.035, 36);

    interface Flyer {
      mesh: THREE.Mesh;
      glow: THREE.Sprite | null;
      dest: (typeof dests)[number];
      launch: number;
      duration: number;
      curve: THREE.CubicBezierCurve3 | null;
      done: boolean;
      fee: boolean;
      lateralSpread: number;
      apexHeight: number;
      spinSpeed: number;
      tumbleAxis: THREE.Vector3;
    }

    const flyers: Flyer[] = [];

    // Schedule:
    // Wallet coins stream in a rhythmic wave (47 coins)
    // Fee coins launch at key milestones along high, majestic looping arcs
    const schedule: { dest: DestKey; t: number; fee: boolean; index: number }[] = [];
    for (let i = 0; i < 47; i++) {
      // Natural organic wave spacing
      const waveT = 0.28 + i * 0.046 + Math.sin(i * 0.4) * 0.012;
      schedule.push({ dest: 'wallet', t: waveT, fee: false, index: i });
    }
    // Strategic fee coin launches
    schedule.push(
      { dest: 'holders', t: 0.65, fee: true, index: 47 },
      { dest: 'lp', t: 1.35, fee: true, index: 48 },
      { dest: 'treasury', t: 2.05, fee: true, index: 49 },
    );
    schedule.sort((a, b) => a.t - b.t);

    schedule.forEach((s) => {
      const dest = dests.find((d) => d.key === s.dest)!;
      let meshMat = coinMats;
      if (s.fee) {
        meshMat = [
          new THREE.MeshStandardMaterial({
            color: dest.rimColor,
            metalness: 0.7,
            roughness: 0.25,
            emissive: dest.rimColor,
            emissiveIntensity: 0.35,
          }),
          faceMat,
          faceMat,
        ];
      }
      const mesh = new THREE.Mesh(coinGeo, meshMat);
      mesh.visible = false;
      if (s.fee) mesh.scale.setScalar(1.42); // Heroic enlarged size for the 2% fee coins
      scene.add(mesh);

      let glow: THREE.Sprite | null = null;
      if (s.fee) {
        glow = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: dest.rimColor,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        glow.scale.setScalar(1.1);
        glow.visible = false;
        scene.add(glow);
      }

      // Organic lateral spread and natural tumbling physics
      const lateralSpread = s.fee
        ? (Math.random() - 0.5) * 0.08
        : Math.sin(s.index * 1.6) * 0.18 + Math.cos(s.index * 0.8) * 0.07;
      const apexHeight = s.fee ? 2.65 : 1.85 + Math.sin(s.index * 1.9) * 0.12;
      const spinSpeed = 9 + Math.random() * 4;
      const tumbleAxis = new THREE.Vector3(
        0.3 + Math.random() * 0.4,
        0.8 + Math.random() * 0.4,
        0.2 + Math.random() * 0.3,
      ).normalize();

      flyers.push({
        mesh,
        glow,
        dest,
        launch: s.t,
        duration: s.fee ? 1.48 : 0.98,
        curve: null,
        done: false,
        fee: s.fee,
        lateralSpread,
        apexHeight,
        spinSpeed,
        tumbleAxis,
      });
    });

    const CYCLE = 5.8; // Seconds: ~3.4s flights + 1.2s celebration hold + 1.2s vault absorb & reload
    let cycleStart = performance.now() / 1000;
    let localCounts = zeroCounts();
    let lastUiSync = 0;

    const resetCycle = () => {
      dests.forEach((d) => {
        d.count = 0;
        d.stack.scale.set(1, 0.0001, 1);
        d.stack.position.y = 0.09;
        d.flashT = 0;
      });
      flyers.forEach((f) => {
        f.done = false;
        f.curve = null;
        f.mesh.visible = false;
        if (f.glow) f.glow.visible = false;
      });
      source.stack.scale.y = COINS_PER_TRADE * COIN_T;
      source.stack.position.y = 0.09;
      localCounts = zeroCounts();
      setCounts(zeroCounts());
      setIsSettled(false);
    };

    replayTriggerRef.current = () => {
      cycleStart = performance.now() / 1000;
      resetCycle();
    };

    // Helper: Build Smooth Cubic Bézier Ballistic Flight Arc
    const createBallisticPath = (
      from: THREE.Vector3,
      to: THREE.Vector3,
      apex: number,
      lateralOffset: number,
    ): THREE.CubicBezierCurve3 => {
      const dist = from.distanceTo(to);
      const forward = to.clone().sub(from).normalize();
      const lateral = new THREE.Vector3(-forward.z, 0, forward.x).normalize();

      // Launch control point (steep initial liftoff out of the source stack)
      const p1 = from.clone();
      p1.y += apex * 0.96;
      p1.addScaledVector(forward, dist * 0.24);
      p1.addScaledVector(lateral, lateralOffset * 0.85);

      // Landing control point (smooth parabolic descent onto target pedestal top)
      const p2 = to.clone();
      p2.y += apex * 0.86;
      p2.addScaledVector(forward, -dist * 0.22);
      p2.addScaledVector(lateral, lateralOffset * 0.35);

      return new THREE.CubicBezierCurve3(from, p1, p2, to);
    };

    const tmp = new THREE.Vector3();
    const project = (x: number, y: number, z: number) => {
      tmp.set(x, y, z).project(camera);
      return { x: (tmp.x * 0.5 + 0.5) * width, y: (-tmp.y * 0.5 + 0.5) * height };
    };

    let raf = 0;
    let visible = true;
    let lastFrameTime = performance.now() / 1000;

    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!visible) return;

      const now = performance.now() / 1000;
      const dt = Math.min(0.05, Math.max(0.001, now - lastFrameTime));
      lastFrameTime = now;

      let t = now - cycleStart;
      if (t > CYCLE) {
        cycleStart = now;
        t = 0;
        resetCycle();
      }

      // Check settlement completion
      if (t >= 3.4 && !isSettled) {
        setIsSettled(true);
      }

      // Phase 4: Smooth Vault Absorption & Restock (between 4.5s and 5.5s)
      const isAbsorbing = t >= 4.5 && t < 5.6;
      const absorbK = isAbsorbing ? (t - 4.5) / 1.0 : 0;

      // Source Stack Height
      const launched = flyers.filter((f) => t >= f.launch).length;
      const remaining = COINS_PER_TRADE - launched;
      let targetSourceH = Math.max(0.0001, remaining * COIN_T);

      if (isAbsorbing) {
        // Smoothly reload source stack from below ready for next order
        targetSourceH = (COINS_PER_TRADE * COIN_T) * Math.min(1, absorbK * 1.25);
      }
      source.stack.scale.y += (targetSourceH - source.stack.scale.y) * 0.28;

      // Update Flying Coins
      for (const f of flyers) {
        if (t < f.launch) continue;
        const p = (t - f.launch) / f.duration;

        if (!f.curve) {
          const from = new THREE.Vector3(SOURCE[0], 0.15 + source.stack.scale.y, SOURCE[2]);
          const to = new THREE.Vector3(
            f.dest.pos[0],
            0.15 + f.dest.count * COIN_T * (f.dest.key === 'wallet' ? 1 : 3) + 0.05,
            f.dest.pos[2],
          );
          f.curve = createBallisticPath(from, to, f.apexHeight, f.lateralSpread);
        }

        if (p >= 1) {
          if (!f.done) {
            f.done = true;
            f.mesh.visible = false;
            if (f.glow) f.glow.visible = false;
            f.dest.count += 1;
            f.dest.flashT = now;
            f.dest.bounceVel = f.fee ? -0.045 : -0.018;

            // Touchdown micro-impact sparkles & shockwave
            const impactPos = new THREE.Vector3(
              f.dest.pos[0],
              0.16 + f.dest.stack.scale.y,
              f.dest.pos[2],
            );
            spawnImpactSparkles(impactPos, f.dest.rimColor, f.fee ? 5 : 2);

            localCounts[f.dest.key] += 1;
          }
          continue;
        }

        // Parabolic fluid easing: fast launch, gentle apex float, dynamic descent
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        f.curve.getPoint(e, f.mesh.position);
        f.mesh.visible = true;

        // Dynamic 3D tumbling & settling physics
        // As the coin approaches touchdown (p > 0.82), smoothly level out flat to land flush on stack
        const touchdownSettle = Math.max(0, Math.min(1, (p - 0.82) / 0.18));
        const settleSmooth = touchdownSettle * touchdownSettle * (3 - 2 * touchdownSettle);

        const spin = (now * f.spinSpeed + f.launch * 12) * (1 - settleSmooth * 0.85);
        const pitch = (Math.PI / 2 - 0.35) * (1 - settleSmooth);
        const roll = Math.sin(now * 8 + f.launch * 6) * 0.3 * (1 - settleSmooth);

        f.mesh.rotation.set(pitch, roll, spin);

        if (f.glow) {
          f.glow.visible = true;
          f.glow.position.copy(f.mesh.position);
          const pulse = 1 + Math.sin(now * 14) * 0.12;
          f.glow.scale.setScalar(1.15 * pulse);
        }
      }

      // Throttle React State Updates for 60/120 FPS Silkiness
      if (now - lastUiSync > 0.055 || t >= 3.4) {
        lastUiSync = now;
        setCounts({ ...localCounts });
      }

      // Update Pedestal Stacks, Rims, Shockwaves & Spring Physics
      for (const d of dests) {
        // Pedestal spring recoil bounce
        const springK = 180;
        const springDamp = 14;
        const force = -springK * d.bounceY - springDamp * d.bounceVel;
        d.bounceVel += force * dt;
        d.bounceY += d.bounceVel * dt;
        d.group.position.y = d.bounceY;

        // Destination stack target height
        let targetH = Math.max(0.0001, d.count * COIN_T * (d.key === 'wallet' ? 1 : 3));
        if (isAbsorbing) {
          // Vault absorption: stacks smoothly descend into the pedestal
          targetH = targetH * Math.max(0.0001, 1 - absorbK);
        }
        d.stack.scale.y += (targetH - d.stack.scale.y) * 0.28;

        // Dynamic stack side texture repeating for crisp visible coin edges
        stackEdgeTex.repeat.set(1, Math.max(1, Math.round(d.count * 1.2)));

        // Micro-impact squash on arrival
        const bouncePulse = Math.abs(d.bounceY) * 2.2;
        d.stack.scale.x = 1.0 + bouncePulse * 0.08;
        d.stack.scale.z = 1.0 + bouncePulse * 0.08;

        // Arrival shockwave ring animation
        const k = (now - d.flashT) / 0.65;
        const flashMat = d.flash.material as THREE.MeshBasicMaterial;
        if (k >= 0 && k < 1) {
          flashMat.opacity = 0.85 * (1 - k * k);
          d.flash.scale.setScalar(1 + k * 1.15);
        } else {
          flashMat.opacity = 0;
        }

        // Underglow completion pulse
        const underglowMat = d.underglow.material as THREE.MeshBasicMaterial;
        if (isSettled) {
          underglowMat.opacity = 0.25 + Math.sin(now * 5) * 0.12;
        } else {
          underglowMat.opacity = 0.16;
        }
      }

      // Update Sparkle Particles
      for (const sp of sparkles) {
        if (sp.active) {
          sp.vy -= 4.2 * dt; // Gravity
          sp.sprite.position.x += sp.vx * dt;
          sp.sprite.position.y += sp.vy * dt;
          sp.sprite.position.z += sp.vz * dt;
          sp.life -= dt;
          const lifeProgress = sp.life / sp.maxLife;
          sp.sprite.material.opacity = Math.max(0, lifeProgress * 0.95);
          sp.sprite.scale.setScalar(0.32 * lifeProgress);
          if (sp.life <= 0) {
            sp.active = false;
            sp.sprite.visible = false;
          }
        }
      }

      // Smoothly Move HTML Projected Labels Above Pedestals
      const place = (id: string, x: number, y: number, z: number) => {
        const el = labelRefs.current[id];
        if (!el) return;
        const s = project(x, y, z);
        el.style.transform = `translate(-50%, -100%) translate(${s.x}px, ${s.y}px)`;
      };
      place('source', SOURCE[0], 0.38 + source.stack.scale.y, SOURCE[2]);
      dests.forEach((d) =>
        place(d.key, d.pos[0], 0.35 + d.stack.scale.y * (d.key === 'wallet' ? 0.98 : 1.1), d.pos[2]),
      );

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
      [faceTex, stackEdgeTex, glowTex, sparkleTex, shadowTex, env].forEach((x) => x.dispose());
      pmrem.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  const mbr = (n: number) => (n * MBR_PER_COIN).toLocaleString();
  const feeTotal = counts.holders + counts.lp + counts.treasury;

  return (
    <div className={`relative mx-auto w-full max-w-[530px] ${className}`}>
      {/* Ambient Outer Aura */}
      <div className="pointer-events-none absolute -inset-1 rounded-[2.5rem] bg-gradient-to-r from-gold-400/20 via-blue-500/10 to-amber-400/20 blur-xl opacity-75" />

      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/90 bg-gradient-to-br from-white via-[#F7FAFE] to-gold-50/60 shadow-[0_35px_80px_-25px_rgba(15,35,73,0.35)] backdrop-blur-sm">
        {/* Header with Title & Buy / Sell Mode Switcher */}
        <div className="flex items-center justify-between gap-3 px-5 pt-5 pb-2">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600">
              <Sparkles className="h-3.5 w-3.5 text-gold-600 animate-pulse" />
              How the Fee Works
            </div>
            <div className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              6% on every {side === 'buy' ? 'buy' : 'sell'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Replay Button */}
            <button
              onClick={handleReplay}
              title="Replay Transaction Animation"
              aria-label="Replay transaction animation"
              className="group flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-gold-300 hover:text-gold-600 hover:shadow-sm transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 transition-transform group-hover:-rotate-90 duration-300" />
            </button>

            {/* Buy / Sell Toggle Switch */}
            <div className="relative flex rounded-full border border-slate-200 bg-slate-100/80 p-1 text-xs font-semibold shadow-inner">
              {(['buy', 'sell'] as Side[]).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setSide(s);
                    handleReplay();
                  }}
                  className={`relative rounded-full px-4 py-1.5 capitalize transition-colors duration-200 ${
                    side === s ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {side === s && (
                    <motion.span
                      layoutId="fee-side"
                      className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1E3A8A] via-[#17306A] to-[#0F2349] shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 34 }}
                    />
                  )}
                  <span className="relative z-10 font-bold">{s}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 3D WebGL Stage with Projected Floating Labels */}
        <div className="relative aspect-[5/4] w-full">
          <div ref={mountRef} className="absolute inset-0" />

          {/* Floating Billboards Aligned to 3D Pedestals */}
          <div className="pointer-events-none absolute inset-0 select-none">
            {/* Source Pedestal Label */}
            <div
              ref={(el) => (labelRefs.current.source = el)}
              className="absolute left-0 top-0 whitespace-nowrap transition-transform duration-75 ease-out"
            >
              <div className="rounded-full bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 px-3 py-1 text-[11px] font-extrabold text-white shadow-lg shadow-gold-500/25 border border-white/60">
                {SOURCE_LABEL[side]}
              </div>
            </div>

            {/* Destination Pedestal Labels */}
            {DESTS.map((d) => (
              <div
                key={d.key}
                ref={(el) => (labelRefs.current[d.key] = el)}
                className="absolute left-0 top-0 whitespace-nowrap transition-transform duration-75 ease-out"
              >
                <div className="flex items-center gap-1.5 rounded-full border border-white/90 bg-white/95 px-2.5 py-1 text-[10px] font-bold text-slate-800 shadow-md backdrop-blur-md">
                  <span
                    className="h-2 w-2 rounded-full ring-2 ring-white shadow-xs"
                    style={{ background: d.css }}
                  />
                  {d.label[side]}
                  <span
                    className="font-extrabold px-1.5 py-0.5 rounded-md text-[9px]"
                    style={{ background: `${d.css}15`, color: d.css }}
                  >
                    {d.note}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-time Tally Cards with Micro Progress Bars */}
        <div className="grid grid-cols-2 gap-2.5 border-t border-slate-200/80 bg-white/80 p-4 sm:grid-cols-4 backdrop-blur-sm">
          {DESTS.map((d) => {
            const isFull = counts[d.key] >= d.share;
            const pct = Math.min(100, (counts[d.key] / d.share) * 100);
            return (
              <div
                key={d.key}
                className={`relative overflow-hidden rounded-xl border p-2.5 transition-all duration-300 ${
                  isFull
                    ? 'border-emerald-300/60 bg-gradient-to-b from-white to-emerald-50/20 shadow-xs'
                    : 'border-slate-200/70 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: d.css }} />
                    <span className="truncate">
                      {d.key === 'wallet' ? (side === 'buy' ? 'You get' : 'Proceeds') : d.label.buy}
                    </span>
                  </div>
                  {isFull && <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 ml-1" />}
                </div>

                <div className="mt-1 font-display text-base font-extrabold tabular-nums text-slate-900 flex items-baseline">
                  {mbr(counts[d.key])}
                  <span className="ml-1 text-[10px] font-semibold text-slate-400">
                    / {mbr(d.share)}
                  </span>
                </div>

                {/* Micro Progress Bar */}
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-150 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: d.css,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 text-[11px] text-slate-600">
          <AnimatePresence mode="wait">
            <motion.span
              key={side}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              className="leading-snug font-medium"
            >
              {side === 'buy'
                ? 'Buy 1,000 MBR → 940 MBR direct to your wallet, 60 MBR (6%) split three ways.'
                : 'Sell 1,000 MBR → 940 MBR swapped to your wallet, 60 MBR (6%) split three ways.'}
            </motion.span>
          </AnimatePresence>

          <div className="shrink-0 flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 border border-amber-500/20 font-bold text-amber-700 tabular-nums text-[10px]">
            <span>Fee</span>
            <span>{mbr(feeTotal)} / 60 MBR</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeExplainer3D;
