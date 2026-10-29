import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  LineStyle,
  PriceScaleMode,
  type IChartApi,
  type IPriceLine,
  type ISeriesApi,
  type MouseEventParams,
  type SeriesType,
  type Time,
  type UTCTimestamp,
} from 'lightweight-charts';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  Bell,
  Camera,
  CandlestickChart,
  ChevronDown,
  Crosshair,
  Eraser,
  LineChart,
  Maximize2,
  Minimize2,
  Minus,
  RotateCcw,
  Settings2,
  Activity,
  AreaChart as AreaIcon,
} from 'lucide-react';
import { useWallet } from './state/WalletProvider';
import { TIMEFRAMES, type Candle, type Timeframe } from './state/market';
import { DASH, fmtCompactUsd, fmtPct, fmtPrice } from './config';
import { FlashValue, cx } from './ui';
import { useTheme } from './theme';

type ChartType = 'candles' | 'heikin' | 'bars' | 'line' | 'area';
type IndicatorId = 'ma7' | 'ma25' | 'ema99' | 'bb' | 'volume';

interface Prefs {
  tf: Timeframe;
  type: ChartType;
  indicators: Record<IndicatorId, boolean>;
  log: boolean;
  grid: boolean;
  magnet: boolean;
  upColor: string;
  downColor: string;
}

interface Drawing {
  id: string;
  price: number;
  kind: 'line' | 'alert';
  direction?: 'above' | 'below';
}

const PREFS_KEY = 'mbr_chart_prefs';
const DRAW_KEY = 'mbr_chart_drawings';

const DEFAULT_PREFS: Prefs = {
  tf: '15m',
  type: 'candles',
  indicators: { ma7: true, ma25: true, ema99: false, bb: false, volume: true },
  log: false,
  grid: true,
  magnet: true,
  upColor: '#22c08a',
  downColor: '#f0616d',
};

const COLOR_PRESETS: { name: string; up: string; down: string }[] = [
  { name: 'Classic', up: '#22c08a', down: '#f0616d' },
  { name: 'Gold / Blue', up: '#e2b54c', down: '#4f8bff' },
  { name: 'Mono', up: '#94a3b8', down: '#475569' },
];

const INDICATORS: { id: IndicatorId; label: string; color: string }[] = [
  { id: 'ma7', label: 'MA 7', color: '#f5d37c' },
  { id: 'ma25', label: 'MA 25', color: '#c084fc' },
  { id: 'ema99', label: 'EMA 99', color: '#38bdf8' },
  { id: 'bb', label: 'Bollinger (20, 2)', color: '#64748b' },
  { id: 'volume', label: 'Volume', color: '#7d8aa3' },
];

const CHART_TYPES: { id: ChartType; label: string; icon: React.ElementType }[] = [
  { id: 'candles', label: 'Candles', icon: CandlestickChart },
  { id: 'heikin', label: 'Heikin Ashi', icon: CandlestickChart },
  { id: 'bars', label: 'Bars', icon: BarChart3 },
  { id: 'line', label: 'Line', icon: LineChart },
  { id: 'area', label: 'Area', icon: AreaIcon },
];

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function writeJson(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* ignore */
  }
}

// ---- indicator math ------------------------------------------------------
const ts = (t: number) => t as UTCTimestamp;

function sma(c: Candle[], n: number, end = c.length) {
  const out: { time: UTCTimestamp; value: number }[] = [];
  let sum = 0;
  for (let i = 0; i < end; i++) {
    sum += c[i].close;
    if (i >= n) sum -= c[i - n].close;
    if (i >= n - 1) out.push({ time: ts(c[i].time), value: sum / n });
  }
  return out;
}
function ema(c: Candle[], n: number) {
  const out: { time: UTCTimestamp; value: number }[] = [];
  const k = 2 / (n + 1);
  let e = c[0]?.close ?? 0;
  c.forEach((b, i) => {
    e = i === 0 ? b.close : b.close * k + e * (1 - k);
    if (i >= n - 1) out.push({ time: ts(b.time), value: e });
  });
  return out;
}
function bollinger(c: Candle[], n = 20, mult = 2) {
  const upper: { time: UTCTimestamp; value: number }[] = [];
  const lower: { time: UTCTimestamp; value: number }[] = [];
  for (let i = n - 1; i < c.length; i++) {
    let s = 0;
    for (let j = i - n + 1; j <= i; j++) s += c[j].close;
    const m = s / n;
    let v = 0;
    for (let j = i - n + 1; j <= i; j++) v += (c[j].close - m) ** 2;
    const sd = Math.sqrt(v / n);
    upper.push({ time: ts(c[i].time), value: m + mult * sd });
    lower.push({ time: ts(c[i].time), value: m - mult * sd });
  }
  return { upper, lower };
}
function heikin(c: Candle[]): Candle[] {
  const out: Candle[] = [];
  c.forEach((b, i) => {
    const close = (b.open + b.high + b.low + b.close) / 4;
    const open = i === 0 ? (b.open + b.close) / 2 : (out[i - 1].open + out[i - 1].close) / 2;
    out.push({ time: b.time, open, close, high: Math.max(b.high, open, close), low: Math.min(b.low, open, close), volume: b.volume });
  });
  return out;
}

// ---- small dropdown -------------------------------------------------------
const Dropdown: React.FC<{ label: React.ReactNode; children: React.ReactNode; align?: 'left' | 'right'; title: string }> = ({ label, children, align = 'left', title }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button title={title} onClick={() => setOpen((o) => !o)} className={cx('flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition-colors', open ? 'bg-surface-3 text-[var(--d-text)]' : 't-soft hover:bg-surface-3 hover:text-[var(--d-text)]')}>
        {label}
        <ChevronDown className="h-3 w-3 opacity-60" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cx('absolute top-full z-30 mt-1 min-w-[200px] rounded-xl border bg-surface-2 p-1.5 shadow-2xl', align === 'right' ? 'right-0' : 'left-0')}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuItem: React.FC<{ active?: boolean; onClick: () => void; children: React.ReactNode; swatch?: string }> = ({ active, onClick, children, swatch }) => (
  <button onClick={onClick} className={cx('flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors', active ? 'bg-[rgba(226,181,76,0.12)] t-gold' : 't-soft hover:bg-surface-3 hover:text-[var(--d-text)]')}>
    {swatch && <span className="h-2.5 w-2.5 rounded-full" style={{ background: swatch }} />}
    <span className="flex-1">{children}</span>
    {active && <span className="text-[10px]">●</span>}
  </button>
);

// ---- main component ---------------------------------------------------------
export const TradingChart: React.FC<{ height?: number }> = ({ height = 460 }) => {
  const { market, stats, marketVersion } = useWallet();
  const { theme } = useTheme();
  const ma7Color = theme === 'light' ? '#c58a12' : '#f5d37c';
  const [prefs, setPrefs] = useState<Prefs>(() => {
    const p = readJson(PREFS_KEY, DEFAULT_PREFS);
    return { ...p, indicators: { ...DEFAULT_PREFS.indicators, ...p.indicators } };
  });
  const [drawings, setDrawings] = useState<Drawing[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(DRAW_KEY) || '[]');
    } catch {
      return [];
    }
  });
  const [tool, setTool] = useState<'cursor' | 'hline' | 'alert'>('cursor');
  const [full, setFull] = useState(false);
  const [legend, setLegend] = useState<{ o: number; h: number; l: number; c: number; v: number; time: number } | null>(null);
  const [toasts, setToasts] = useState<{ id: string; text: string }[]>([]);
  const [drawingsVersion, setDrawingsVersion] = useState(0);

  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainRef = useRef<ISeriesApi<SeriesType> | null>(null);
  const volRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const indRef = useRef<Partial<Record<'ma7' | 'ma25' | 'ema99' | 'bbU' | 'bbL', ISeriesApi<'Line'>>>>({});
  const dataRef = useRef<Candle[]>([]);
  const linesRef = useRef<Map<string, IPriceLine>>(new Map());
  const toolRef = useRef(tool);
  toolRef.current = tool;
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const prevPriceRef = useRef(stats.price);

  useEffect(() => writeJson(PREFS_KEY, prefs), [prefs]);
  useEffect(() => writeJson(DRAW_KEY, drawings), [drawings]);

  const pushToast = useCallback((text: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  }, []);

  // Create chart once
  useEffect(() => {
    if (!hostRef.current) return;
    const chart = createChart(hostRef.current, {
      autoSize: true,
      layout: { background: { type: ColorType.Solid, color: 'transparent' }, textColor: '#7d8aa3', fontFamily: 'Inter, ui-sans-serif, system-ui', fontSize: 11 },
      grid: { vertLines: { color: 'rgba(148,163,184,0.06)' }, horzLines: { color: 'rgba(148,163,184,0.06)' } },
      rightPriceScale: { borderColor: 'rgba(148,163,184,0.14)' },
      timeScale: { borderColor: 'rgba(148,163,184,0.14)', timeVisible: true, secondsVisible: false, rightOffset: 6, barSpacing: 8 },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: { color: 'rgba(226,181,76,0.4)', labelBackgroundColor: '#15213a', style: LineStyle.Dashed },
        horzLine: { color: 'rgba(226,181,76,0.4)', labelBackgroundColor: '#15213a', style: LineStyle.Dashed },
      },
      watermark: { visible: true, text: 'MBR / USDT', color: 'rgba(148,163,184,0.06)', fontSize: 44, fontFamily: 'Plus Jakarta Sans, Inter' },
      localization: { priceFormatter: (p: number) => fmtPrice(p) },
    });
    chartRef.current = chart;

    const onMove = (param: MouseEventParams<Time>) => {
      const s = mainRef.current;
      if (!s || !param.time) {
        setLegend(null);
        return;
      }
      const d = param.seriesData.get(s) as { open?: number; high?: number; low?: number; close?: number; value?: number } | undefined;
      const raw = dataRef.current.find((c) => c.time === (param.time as number));
      if (!d || !raw) return;
      const c = d.close ?? d.value ?? raw.close;
      setLegend({ o: d.open ?? raw.open, h: d.high ?? raw.high, l: d.low ?? raw.low, c, v: raw.volume, time: raw.time });
    };
    const onClick = (param: MouseEventParams<Time>) => {
      const t = toolRef.current;
      if (t === 'cursor' || !param.point || !mainRef.current) return;
      const price = mainRef.current.coordinateToPrice(param.point.y);
      if (price == null || price <= 0) return;
      const current = dataRef.current[dataRef.current.length - 1]?.close ?? price;
      setDrawings((d) => [...d, { id: Math.random().toString(36).slice(2), price, kind: t === 'hline' ? 'line' : 'alert', direction: price >= current ? 'above' : 'below' }]);
      setTool('cursor');
    };
    chart.subscribeCrosshairMove(onMove);
    chart.subscribeClick(onClick);
    return () => {
      chart.unsubscribeCrosshairMove(onMove);
      chart.unsubscribeClick(onClick);
      chart.remove();
      chartRef.current = null;
      mainRef.current = null;
      volRef.current = null;
      indRef.current = {};
    };
  }, []);

  // Visual options that don't need series rebuilds
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const light = theme === 'light';
    const gridColor = prefs.grid ? (light ? 'rgba(15,35,73,0.06)' : 'rgba(148,163,184,0.06)') : 'transparent';
    const border = light ? 'rgba(15,35,73,0.12)' : 'rgba(148,163,184,0.14)';
    const labelBg = light ? '#0b1b33' : '#15213a';
    chart.applyOptions({
      layout: { textColor: light ? '#64748b' : '#7d8aa3' },
      grid: { vertLines: { color: gridColor }, horzLines: { color: gridColor } },
      crosshair: {
        mode: prefs.magnet ? CrosshairMode.Magnet : CrosshairMode.Normal,
        vertLine: { labelBackgroundColor: labelBg },
        horzLine: { labelBackgroundColor: labelBg },
      },
      rightPriceScale: { mode: prefs.log ? PriceScaleMode.Logarithmic : PriceScaleMode.Normal, borderColor: border },
      timeScale: { borderColor: border },
      watermark: { color: light ? 'rgba(15,35,73,0.05)' : 'rgba(148,163,184,0.06)' },
    });
  }, [prefs.grid, prefs.magnet, prefs.log, theme]);

  // (Re)build all series when timeframe, chart type, colors or indicators change
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    if (mainRef.current) chart.removeSeries(mainRef.current);
    if (volRef.current) chart.removeSeries(volRef.current);
    Object.values(indRef.current).forEach((s) => s && chart.removeSeries(s));
    indRef.current = {};
    volRef.current = null;
    linesRef.current.clear();

    const candles = market.candles(prefs.tf);
    dataRef.current = candles;
    const priceFormat = { type: 'price' as const, precision: 6, minMove: 0.000001 };
    const { upColor, downColor } = prefs;
    let main: ISeriesApi<SeriesType>;
    if (prefs.type === 'candles' || prefs.type === 'heikin') {
      main = chart.addCandlestickSeries({ upColor, downColor, wickUpColor: upColor, wickDownColor: downColor, borderVisible: false, priceFormat });
      const src = prefs.type === 'heikin' ? heikin(candles) : candles;
      main.setData(src.map((c) => ({ time: ts(c.time), open: c.open, high: c.high, low: c.low, close: c.close })));
    } else if (prefs.type === 'bars') {
      main = chart.addBarSeries({ upColor, downColor, thinBars: false, priceFormat });
      main.setData(candles.map((c) => ({ time: ts(c.time), open: c.open, high: c.high, low: c.low, close: c.close })));
    } else if (prefs.type === 'line') {
      main = chart.addLineSeries({ color: '#e2b54c', lineWidth: 2, priceFormat });
      main.setData(candles.map((c) => ({ time: ts(c.time), value: c.close })));
    } else {
      main = chart.addAreaSeries({ lineColor: '#e2b54c', topColor: 'rgba(226,181,76,0.28)', bottomColor: 'rgba(226,181,76,0)', lineWidth: 2, priceFormat });
      main.setData(candles.map((c) => ({ time: ts(c.time), value: c.close })));
    }
    mainRef.current = main;
    main.priceScale().applyOptions({ scaleMargins: { top: 0.08, bottom: prefs.indicators.volume ? 0.24 : 0.06 } });

    if (prefs.indicators.volume) {
      const vol = chart.addHistogramSeries({ priceFormat: { type: 'volume' }, priceScaleId: 'vol', lastValueVisible: false, priceLineVisible: false });
      chart.priceScale('vol').applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
      vol.setData(candles.map((c) => ({ time: ts(c.time), value: c.volume, color: c.close >= c.open ? `${upColor}55` : `${downColor}55` })));
      volRef.current = vol;
    }
    const line = (color: string, width: 1 | 2 = 1, style = LineStyle.Solid) =>
      chart.addLineSeries({ color, lineWidth: width, lineStyle: style, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false, priceFormat });
    if (prefs.indicators.ma7) (indRef.current.ma7 = line(ma7Color)).setData(sma(candles, 7));
    if (prefs.indicators.ma25) (indRef.current.ma25 = line('#c084fc')).setData(sma(candles, 25));
    if (prefs.indicators.ema99) (indRef.current.ema99 = line('#38bdf8')).setData(ema(candles, 99));
    if (prefs.indicators.bb) {
      const bb = bollinger(candles);
      (indRef.current.bbU = line('#64748b', 1, LineStyle.Dashed)).setData(bb.upper);
      (indRef.current.bbL = line('#64748b', 1, LineStyle.Dashed)).setData(bb.lower);
    }
    const visible = { '1m': 150, '5m': 160, '15m': 140, '1H': 140, '4H': 120, '1D': 90 }[prefs.tf];
    chart.timeScale().setVisibleLogicalRange({ from: candles.length - visible, to: candles.length + 6 });
    setDrawingsVersion((v) => v + 1);
  }, [market, prefs.tf, prefs.type, prefs.upColor, prefs.downColor, prefs.indicators, ma7Color]);

  // Price lines for drawings and alerts (re-attached whenever series are rebuilt)
  useEffect(() => {
    const s = mainRef.current;
    if (!s) return;
    linesRef.current.forEach((l) => {
      try {
        s.removePriceLine(l);
      } catch {
        /* line belonged to a removed series */
      }
    });
    linesRef.current.clear();
    drawings.forEach((d) => {
      linesRef.current.set(
        d.id,
        s.createPriceLine({
          price: d.price,
          color: d.kind === 'alert' ? '#4f8bff' : '#e2b54c',
          lineWidth: 1,
          lineStyle: d.kind === 'alert' ? LineStyle.Dotted : LineStyle.Dashed,
          axisLabelVisible: true,
          title: d.kind === 'alert' ? '🔔 Alert' : '',
        }),
      );
    });
  }, [drawings, drawingsVersion]);

  // Live updates
  useEffect(() => {
    const s = mainRef.current;
    if (!s || marketVersion === 0) return;
    const p = prefsRef.current;
    const bar = market.lastBar(p.tf);
    const data = dataRef.current;
    const last = data[data.length - 1];
    if (last && last.time === bar.time) data[data.length - 1] = bar;
    else data.push(bar);

    const t = ts(bar.time);
    if (p.type === 'line' || p.type === 'area') s.update({ time: t, value: bar.close });
    else if (p.type === 'heikin') {
      const prev = data.length > 1 ? heikin(data.slice(-30)).slice(-2)[0] : bar;
      const close = (bar.open + bar.high + bar.low + bar.close) / 4;
      const open = (prev.open + prev.close) / 2;
      s.update({ time: t, open, close, high: Math.max(bar.high, open, close), low: Math.min(bar.low, open, close) });
    } else s.update({ time: t, open: bar.open, high: bar.high, low: bar.low, close: bar.close });
    volRef.current?.update({ time: t, value: bar.volume, color: bar.close >= bar.open ? `${p.upColor}55` : `${p.downColor}55` });
    const lastOf = (arr: { time: UTCTimestamp; value: number }[]) => arr[arr.length - 1];
    const tail = data.slice(-120);
    if (indRef.current.ma7) indRef.current.ma7.update(lastOf(sma(tail, 7)));
    if (indRef.current.ma25) indRef.current.ma25.update(lastOf(sma(tail, 25)));
    if (indRef.current.ema99) indRef.current.ema99.update(lastOf(ema(data, 99)));
    if (indRef.current.bbU && indRef.current.bbL) {
      const bb = bollinger(data.slice(-20));
      indRef.current.bbU.update(lastOf(bb.upper));
      indRef.current.bbL.update(lastOf(bb.lower));
    }

    // Alerts
    const prev = prevPriceRef.current;
    const price = bar.close;
    prevPriceRef.current = price;
    const hit = drawings.filter((d) => d.kind === 'alert' && ((d.direction === 'above' && prev < d.price && price >= d.price) || (d.direction === 'below' && prev > d.price && price <= d.price)));
    if (hit.length) {
      hit.forEach((d) => pushToast(`MBR crossed ${d.direction} ${fmtPrice(d.price)} USDT`));
      setDrawings((all) => all.filter((d) => !hit.includes(d)));
    }
  }, [marketVersion, market, drawings, pushToast]);

  useEffect(() => {
    if (!full) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setFull(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [full]);

  const screenshot = () => {
    const canvas = chartRef.current?.takeScreenshot();
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = `MBR-USDT-${prefs.tf}-${new Date().toISOString().slice(0, 16).replace(':', '')}.png`;
    a.click();
  };

  const resetView = () => {
    const n = dataRef.current.length;
    chartRef.current?.timeScale().setVisibleLogicalRange({ from: n - 140, to: n + 6 });
    chartRef.current?.priceScale('right').applyOptions({ autoScale: true });
  };

  const setPref = <K extends keyof Prefs>(k: K, v: Prefs[K]) => setPrefs((p) => ({ ...p, [k]: v }));
  const toggleInd = (id: IndicatorId) => setPrefs((p) => ({ ...p, indicators: { ...p.indicators, [id]: !p.indicators[id] } }));

  const lastBar = dataRef.current[dataRef.current.length - 1];
  const shown = legend ?? (lastBar ? { o: lastBar.open, h: lastBar.high, l: lastBar.low, c: lastBar.close, v: lastBar.volume, time: lastBar.time } : null);
  const indicatorValues = useMemo(() => {
    const d = dataRef.current;
    if (!d.length) return {} as Record<string, number | undefined>;
    const idx = legend ? d.findIndex((c) => c.time === legend.time) : d.length - 1;
    const upto = d.slice(Math.max(0, idx - 120), idx + 1);
    const lastV = (arr: { value: number }[]) => arr[arr.length - 1]?.value;
    return {
      ma7: lastV(sma(upto, 7)),
      ma25: lastV(sma(upto, 25)),
      ema99: prefs.indicators.ema99 ? lastV(ema(d.slice(0, idx + 1), 99)) : undefined,
    };
    // marketVersion keeps the resting legend current
  }, [legend, marketVersion, prefs.indicators.ema99]);

  const up = stats.change24h >= 0;
  const typeMeta = CHART_TYPES.find((c) => c.id === prefs.type)!;
  const TypeIcon = typeMeta.icon;

  return (
    <div ref={wrapRef} className={cx('d-card flex min-w-0 flex-col overflow-hidden', full && 'd-chart-full bg-[var(--d-bg)]')}>
      {/* Market header */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b px-4 py-3">
        <div className="flex items-center gap-2.5">
          <img src={`${import.meta.env.BASE_URL}assets/logo.png`} alt="" className="h-7 w-7 rounded-full bg-[#1a1204] object-contain" />
          <div>
            <div className="flex items-center gap-2 font-display text-sm font-bold">
              {DASH.pair}
              <span className="d-chip !py-0 !text-[10px]">BEP-20</span>
            </div>
            <div className="t-muted text-[11px]">MyBitRich · PancakeSwap</div>
          </div>
        </div>
        <div>
          <FlashValue value={stats.price} className={cx('font-display text-xl font-bold', up ? 't-up' : 't-down')}>
            {fmtPrice(stats.price)}
          </FlashValue>
          <div className={cx('text-[11px] font-semibold', up ? 't-up' : 't-down')}>{fmtPct(stats.change24h)} 24h</div>
        </div>
        <dl className="flex flex-wrap gap-x-5 gap-y-1 text-[11px]">
          <div>
            <dt className="t-muted">24h High</dt>
            <dd className="font-semibold">{fmtPrice(stats.high24h)}</dd>
          </div>
          <div>
            <dt className="t-muted">24h Low</dt>
            <dd className="font-semibold">{fmtPrice(stats.low24h)}</dd>
          </div>
          <div>
            <dt className="t-muted">24h Volume</dt>
            <dd className="font-semibold">{fmtCompactUsd(stats.volume24h)}</dd>
          </div>
          <div className="hidden sm:block">
            <dt className="t-muted">Market Cap</dt>
            <dd className="font-semibold">{fmtCompactUsd(stats.price * DASH.totalSupply)}</dd>
          </div>
        </dl>
        <div className="ml-auto flex items-center gap-1.5 text-[11px]">
          <span className="d-pulse-dot" />
          <span className="t-muted">Live</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="d-scroll flex items-center gap-1 overflow-x-auto border-b px-2 py-1.5">
        <div className="flex items-center">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setPref('tf', tf)}
              className={cx('rounded-md px-2 py-1 text-xs font-semibold transition-colors', prefs.tf === tf ? 'bg-[rgba(226,181,76,0.14)] t-gold' : 't-muted hover:text-[var(--d-text)]')}
            >
              {tf}
            </button>
          ))}
        </div>
        <span className="mx-1 h-5 w-px bg-[var(--d-line)]" />
        <Dropdown title="Chart type" label={<><TypeIcon className="h-3.5 w-3.5" /><span className="hidden md:inline">{typeMeta.label}</span></>}>
          {CHART_TYPES.map((c) => (
            <MenuItem key={c.id} active={prefs.type === c.id} onClick={() => setPref('type', c.id)}>
              {c.label}
            </MenuItem>
          ))}
        </Dropdown>
        <Dropdown title="Indicators" label={<><Activity className="h-3.5 w-3.5" /><span className="hidden md:inline">Indicators</span></>}>
          {INDICATORS.map((i) => (
            <MenuItem key={i.id} active={prefs.indicators[i.id]} onClick={() => toggleInd(i.id)} swatch={i.color}>
              {i.label}
            </MenuItem>
          ))}
        </Dropdown>
        <span className="mx-1 h-5 w-px bg-[var(--d-line)]" />
        <button title="Draw horizontal line (click on chart)" onClick={() => setTool(tool === 'hline' ? 'cursor' : 'hline')} className={cx('rounded-lg p-1.5 transition-colors', tool === 'hline' ? 'bg-[rgba(226,181,76,0.14)] t-gold' : 't-soft hover:bg-surface-3 hover:text-[var(--d-text)]')}>
          <Minus className="h-4 w-4" />
        </button>
        <button title="Set price alert (click on chart)" onClick={() => setTool(tool === 'alert' ? 'cursor' : 'alert')} className={cx('rounded-lg p-1.5 transition-colors', tool === 'alert' ? 'bg-[rgba(79,139,255,0.16)] t-blue' : 't-soft hover:bg-surface-3 hover:text-[var(--d-text)]')}>
          <Bell className="h-4 w-4" />
        </button>
        <button title="Clear drawings and alerts" disabled={!drawings.length} onClick={() => setDrawings([])} className="t-soft rounded-lg p-1.5 transition-colors hover:bg-surface-3 hover:text-[var(--d-text)] disabled:opacity-30">
          <Eraser className="h-4 w-4" />
        </button>
        <div className="ml-auto flex items-center gap-0.5">
          <Dropdown title="Chart settings" align="right" label={<Settings2 className="h-3.5 w-3.5" />}>
            <MenuItem active={prefs.log} onClick={() => setPref('log', !prefs.log)}>Log scale</MenuItem>
            <MenuItem active={prefs.grid} onClick={() => setPref('grid', !prefs.grid)}>Grid lines</MenuItem>
            <MenuItem active={prefs.magnet} onClick={() => setPref('magnet', !prefs.magnet)}>
              <span className="flex items-center gap-1.5"><Crosshair className="h-3 w-3" /> Magnet crosshair</span>
            </MenuItem>
            <div className="t-muted mt-1.5 border-t px-2.5 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider">Candle colors</div>
            {COLOR_PRESETS.map((c) => (
              <MenuItem key={c.name} active={prefs.upColor === c.up && prefs.downColor === c.down} onClick={() => setPrefs((p) => ({ ...p, upColor: c.up, downColor: c.down }))}>
                <span className="flex items-center gap-2">
                  <span className="flex"><span className="h-2.5 w-2.5 rounded-l-full" style={{ background: c.up }} /><span className="h-2.5 w-2.5 rounded-r-full" style={{ background: c.down }} /></span>
                  {c.name}
                </span>
              </MenuItem>
            ))}
            <button onClick={() => { setPrefs(DEFAULT_PREFS); setDrawings([]); }} className="t-muted mt-1 w-full rounded-lg px-2.5 py-1.5 text-left text-xs hover:bg-surface-3 hover:text-[var(--d-text)]">
              Restore defaults
            </button>
          </Dropdown>
          <button title="Reset view" onClick={resetView} className="t-soft rounded-lg p-1.5 hover:bg-surface-3 hover:text-[var(--d-text)]"><RotateCcw className="h-4 w-4" /></button>
          <button title="Download chart image" onClick={screenshot} className="t-soft rounded-lg p-1.5 hover:bg-surface-3 hover:text-[var(--d-text)]"><Camera className="h-4 w-4" /></button>
          <button title={full ? 'Exit fullscreen (Esc)' : 'Fullscreen'} onClick={() => setFull((f) => !f)} className="t-soft rounded-lg p-1.5 hover:bg-surface-3 hover:text-[var(--d-text)]">
            {full ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className={cx('relative', full ? 'min-h-0 flex-1' : 'shrink-0')} style={full ? undefined : { height }}>
        {shown && (
          <div className="pointer-events-none absolute left-3 top-2 z-10 space-y-0.5 text-[11px]">
            <div className="flex flex-wrap gap-x-2.5">
              {(['o', 'h', 'l', 'c'] as const).map((k) => (
                <span key={k}>
                  <span className="t-muted uppercase">{k}</span>{' '}
                  <span className={shown.c >= shown.o ? 't-up' : 't-down'}>{fmtPrice(shown[k])}</span>
                </span>
              ))}
              <span className={shown.c >= shown.o ? 't-up' : 't-down'}>{fmtPct(shown.c / shown.o - 1)}</span>
            </div>
            <div className="flex flex-wrap gap-x-2.5">
              {prefs.indicators.ma7 && indicatorValues.ma7 && <span style={{ color: ma7Color }}>MA7 {fmtPrice(indicatorValues.ma7)}</span>}
              {prefs.indicators.ma25 && indicatorValues.ma25 && <span style={{ color: '#c084fc' }}>MA25 {fmtPrice(indicatorValues.ma25)}</span>}
              {prefs.indicators.ema99 && indicatorValues.ema99 && <span style={{ color: '#38bdf8' }}>EMA99 {fmtPrice(indicatorValues.ema99)}</span>}
              {prefs.indicators.volume && <span className="t-muted">Vol {fmtCompactUsd(shown.v)}</span>}
            </div>
          </div>
        )}
        {tool !== 'cursor' && (
          <div className="pointer-events-none absolute left-1/2 top-2 z-10 -translate-x-1/2 rounded-full border bg-surface-2 px-3 py-1 text-[11px] font-semibold t-gold">
            {tool === 'hline' ? 'Click the chart to place a line' : 'Click the chart to set an alert price'}
          </div>
        )}
        <div ref={hostRef} className={cx('absolute inset-0', tool !== 'cursor' && 'cursor-crosshair')} />
        <div className="pointer-events-none absolute bottom-10 right-16 z-20 flex flex-col items-end gap-2">
          <AnimatePresence>
            {toasts.map((t) => (
              <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-xl border border-[rgba(79,139,255,0.35)] bg-surface-2 px-3 py-2 text-xs font-semibold shadow-2xl">
                <Bell className="t-blue h-3.5 w-3.5" /> {t.text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {drawings.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 border-t px-3 py-2 text-[11px]">
          <span className="t-muted mr-1">On chart:</span>
          {drawings.map((d) => (
            <button key={d.id} onClick={() => setDrawings((all) => all.filter((x) => x.id !== d.id))} title="Remove" className={cx('d-chip hover:opacity-80', d.kind === 'alert' ? 'd-chip-blue' : 'd-chip-gold')}>
              {d.kind === 'alert' ? `🔔 ${d.direction} ` : '— '}
              {fmtPrice(d.price)} ✕
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
