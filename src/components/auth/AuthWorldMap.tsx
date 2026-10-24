import React, { useEffect, useRef } from 'react';

/**
 * Flat dotted world map (sampled from the bundled land mask) with gold routes
 * that draw themselves between financial hubs — the visual half of the auth card.
 */

const HUBS: [number, number][] = [
  [40.7, -74.0], // New York
  [51.5, -0.1], // London
  [25.2, 55.3], // Dubai
  [19.1, 72.9], // Mumbai
  [1.35, 103.8], // Singapore
  [35.7, 139.7], // Tokyo
  [-33.9, 151.2], // Sydney
  [-23.5, -46.6], // São Paulo
  [6.5, 3.4], // Lagos
  [37.8, -122.4], // San Francisco
];

const ROUTES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 4],
  [4, 5],
  [7, 8],
  [9, 0],
  [3, 6],
  [8, 2],
];

export const AuthWorldMap: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let dots: { x: number; y: number }[] = [];
    let maskData: Uint8ClampedArray | null = null;
    const MW = 360;
    const MH = 180;

    // equirectangular projection, cropping the poles a little
    const project = (lat: number, lng: number) => ({
      x: ((lng + 180) / 360) * w,
      y: ((80 - lat) / 140) * h,
    });

    const buildDots = () => {
      if (!maskData) return;
      dots = [];
      const step = Math.max(7, Math.round(w / 70));
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          const lng = (x / w) * 360 - 180;
          const lat = 80 - (y / h) * 140;
          const mx = Math.floor(((lng + 180) / 360) * MW);
          const my = Math.floor(((90 - lat) / 180) * MH);
          if (maskData[(my * MW + mx) * 4] < 10) dots.push({ x, y });
        }
      }
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildDots();
    };

    const img = new Image();
    img.src = '/assets/world-map.png'; // land is pure black on a grey ocean
    img.onload = () => {
      const off = document.createElement('canvas');
      off.width = MW;
      off.height = MH;
      const octx = off.getContext('2d', { willReadFrequently: true });
      if (!octx) return;
      octx.drawImage(img, 0, 0, MW, MH);
      maskData = octx.getImageData(0, 0, MW, MH).data;
      buildDots();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const start = performance.now();
    let raf = 0;
    const DURATION = 2200;
    const STAGGER = 650;
    const CYCLE = ROUTES.length * STAGGER + DURATION + 1200;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }

      const t = reduce ? CYCLE : (now - start) % CYCLE;

      ROUTES.forEach(([a, b], i) => {
        const p0 = project(...HUBS[a]);
        const p1 = project(...HUBS[b]);
        const mid = { x: (p0.x + p1.x) / 2, y: Math.min(p0.y, p1.y) - Math.abs(p1.x - p0.x) * 0.22 - 18 };
        const k = Math.min(1, Math.max(0, (t - i * STAGGER) / DURATION));
        if (k <= 0) return;
        const ease = 1 - Math.pow(1 - k, 3);

        // draw the curve up to `ease`
        const steps = 48;
        const end = Math.max(1, Math.floor(steps * ease));
        const grad = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        grad.addColorStop(0, 'rgba(245, 192, 66, 0.15)');
        grad.addColorStop(1, 'rgba(245, 192, 66, 0.9)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        let hx = p0.x;
        let hy = p0.y;
        for (let s = 0; s <= end; s++) {
          const u = s / steps;
          hx = (1 - u) * (1 - u) * p0.x + 2 * (1 - u) * u * mid.x + u * u * p1.x;
          hy = (1 - u) * (1 - u) * p0.y + 2 * (1 - u) * u * mid.y + u * u * p1.y;
          if (s === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
        ctx.stroke();

        // glowing head while travelling, endpoint dots once landed
        if (k < 1) {
          const g = ctx.createRadialGradient(hx, hy, 0, hx, hy, 8);
          g.addColorStop(0, 'rgba(255, 236, 170, 1)');
          g.addColorStop(1, 'rgba(245, 192, 66, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(hx, hy, 8, 0, Math.PI * 2);
          ctx.fill();
        }
        [p0, ...(k >= 1 ? [p1] : [])].forEach((p) => {
          ctx.fillStyle = '#F5C042';
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(245, 192, 66, 0.35)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 5 + ((now / 400 + i) % 4), 0, Math.PI * 2);
          ctx.stroke();
        });
      });
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden />;
};

export default AuthWorldMap;
