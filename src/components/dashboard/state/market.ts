// Simulated MBR/USDT market feed. History is generated once at 1-minute resolution, kept
// at 1m for the last 24h and as 5m bars before that; live ticks update the newest 1m bar.
// Swap this module for a websocket/REST feed (same Candle shape) when the indexer is ready.

export interface Candle {
  time: number; // unix seconds, bar open
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // USD
}

export type Timeframe = '1m' | '5m' | '15m' | '1H' | '4H' | '1D';

export const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1H', '4H', '1D'];

export const TF_SECONDS: Record<Timeframe, number> = {
  '1m': 60,
  '5m': 300,
  '15m': 900,
  '1H': 3600,
  '4H': 14400,
  '1D': 86400,
};

export interface MarketStats {
  price: number;
  open24h: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  change24h: number;
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gauss(rng: () => number) {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function aggregate(candles: Candle[], tfSec: number): Candle[] {
  const out: Candle[] = [];
  for (const c of candles) {
    const t = Math.floor(c.time / tfSec) * tfSec;
    const last = out[out.length - 1];
    if (last && last.time === t) {
      last.high = Math.max(last.high, c.high);
      last.low = Math.min(last.low, c.low);
      last.close = c.close;
      last.volume += c.volume;
    } else {
      out.push({ ...c, time: t });
    }
  }
  return out;
}

const HISTORY_DAYS = 90;
const START_PRICE = 0.00142;
const SIGMA_1M = 0.0011;

export class MarketFeed {
  private m5Old: Candle[] = [];
  private m1: Candle[] = [];
  private rng = mulberry32((Date.now() & 0xffff) ^ 0x5bd1);

  constructor(endPrice: number) {
    const rng = mulberry32(2035);
    const nowMin = Math.floor(Date.now() / 60000) * 60;
    const total = HISTORY_DAYS * 1440;
    const startT = nowMin - (total - 1) * 60;

    // Random walk in log space with a slow regime component, then bent so it lands on endPrice.
    const steps = new Float64Array(total);
    let regime = 0;
    let cum = 0;
    for (let i = 1; i < total; i++) {
      if (i % 720 === 0) regime = gauss(rng) * 0.00012;
      cum += regime + gauss(rng) * SIGMA_1M;
      steps[i] = cum;
    }
    const drift = Math.log(endPrice / START_PRICE) - steps[total - 1];

    const all: Candle[] = [];
    let prev = START_PRICE;
    for (let i = 0; i < total; i++) {
      const close = START_PRICE * Math.exp(steps[i] + (drift * i) / (total - 1));
      const open = prev;
      const wick = Math.abs(gauss(rng)) * SIGMA_1M * 0.6;
      const ret = Math.abs(Math.log(close / open)) / SIGMA_1M;
      all.push({
        time: startT + i * 60,
        open,
        close,
        high: Math.max(open, close) * (1 + wick),
        low: Math.min(open, close) * (1 - wick),
        volume: 8 * Math.exp(gauss(rng) * 0.8) * (1 + ret * 0.6),
      });
      prev = close;
    }
    this.m1 = all.slice(-1440);
    this.m5Old = aggregate(all.slice(0, -1440), 300);
  }

  get price() {
    return this.m1[this.m1.length - 1].close;
  }

  /** One live tick: random-walk the price and occasionally print a trade into the current bar. */
  tick(): { price: number; tickVolume: number } {
    const now = Math.floor(Date.now() / 1000);
    const minute = Math.floor(now / 60) * 60;
    let bar = this.m1[this.m1.length - 1];
    if (minute > bar.time) {
      bar = { time: minute, open: bar.close, high: bar.close, low: bar.close, close: bar.close, volume: 0 };
      this.m1.push(bar);
    }
    const p = bar.close * Math.exp(gauss(this.rng) * SIGMA_1M * 0.45);
    const tickVolume = this.rng() < 0.38 ? 0.75 * Math.exp(gauss(this.rng) * 0.9) : 0;
    bar.close = p;
    bar.high = Math.max(bar.high, p);
    bar.low = Math.min(bar.low, p);
    bar.volume += tickVolume;
    return { price: p, tickVolume };
  }

  /** Reflect a user trade in the live bar: price moves by half the price impact. */
  applyTrade(usd: number, side: 'buy' | 'sell', impact: number) {
    const bar = this.m1[this.m1.length - 1];
    const p = bar.close * (side === 'buy' ? 1 + impact / 2 : 1 - impact / 2);
    bar.close = p;
    bar.high = Math.max(bar.high, p);
    bar.low = Math.min(bar.low, p);
    bar.volume += usd;
  }

  candles(tf: Timeframe): Candle[] {
    if (tf === '1m') return this.m1.map((c) => ({ ...c }));
    const base5 = [...this.m5Old.map((c) => ({ ...c })), ...aggregate(this.m1, 300)];
    return tf === '5m' ? base5 : aggregate(base5, TF_SECONDS[tf]);
  }

  /** The bar that the newest tick belongs to, at the given timeframe. */
  lastBar(tf: Timeframe): Candle {
    const sec = TF_SECONDS[tf];
    const last = this.m1[this.m1.length - 1];
    const start = Math.floor(last.time / sec) * sec;
    if (start < this.m1[0].time) {
      const all = this.candles(tf);
      return all[all.length - 1];
    }
    let i = this.m1.length - 1;
    while (i > 0 && this.m1[i - 1].time >= start) i--;
    return aggregate(this.m1.slice(i), sec)[0];
  }

  /** Close price of the bar covering `ms` (for pricing seeded history). */
  priceAt(ms: number): number {
    const t = Math.floor(ms / 1000);
    const series = t >= this.m1[0].time ? this.m1 : this.m5Old;
    let lo = 0;
    let hi = series.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (series[mid].time <= t) lo = mid;
      else hi = mid - 1;
    }
    return series[lo].close;
  }

  stats(): MarketStats {
    const now = this.m1[this.m1.length - 1].time;
    let i = this.m1.length - 1;
    while (i > 0 && this.m1[i - 1].time > now - 86400) i--;
    let high = 0;
    let low = Infinity;
    let volume = 0;
    for (let j = i; j < this.m1.length; j++) {
      high = Math.max(high, this.m1[j].high);
      low = Math.min(low, this.m1[j].low);
      volume += this.m1[j].volume;
    }
    const open24h = this.m1[i].open;
    const price = this.price;
    return { price, open24h, high24h: high, low24h: low, volume24h: volume, change24h: price / open24h - 1 };
  }

  /** Daily USD volume for the day containing `ms` (used for seeded holding rewards). */
  dailyVolume(ms: number): number {
    const day = Math.floor(ms / 86_400_000) * 86400;
    let v = 0;
    for (const c of this.m5Old) if (c.time >= day && c.time < day + 86400) v += c.volume;
    for (const c of this.m1) if (c.time >= day && c.time < day + 86400) v += c.volume;
    return v;
  }
}
