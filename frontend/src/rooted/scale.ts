/**
 * Scale recipe amounts and find timers in steps.
 * Amounts are free text ("2 tbsp", "1/2 cup", "1 ½ cups", "400 g (14 oz)", "to taste"), so anything we
 * can't read confidently is left exactly as written rather than guessed.
 */

const VULGAR: Record<string, number> = { "½": 0.5, "⅓": 1 / 3, "⅔": 2 / 3, "¼": 0.25, "¾": 0.75, "⅛": 0.125 };
const NICE: Array<[number, string]> = [[0.125, "⅛"], [0.25, "¼"], [1 / 3, "⅓"], [0.5, "½"], [2 / 3, "⅔"], [0.75, "¾"]];

function fmt(n: number): string {
  if (n >= 10) return String(Math.round(n));
  const whole = Math.floor(n + 1e-9);
  const frac = n - whole;
  if (frac < 0.06) return String(whole || 0);
  const near = NICE.find(([v]) => Math.abs(v - frac) < 0.04);
  if (near) return `${whole ? whole + " " : ""}${near[1]}`;
  if (frac > 0.94) return String(whole + 1);
  return String(Math.round(n * 10) / 10);
}

const NUM = /(\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?\s?[½⅓⅔¼¾⅛]|[½⅓⅔¼¾⅛]|\d+(?:\.\d+)?)/;

function parseNum(s: string): number | null {
  s = s.trim();
  let m = s.match(/^(\d+)\s+(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) + Number(m[2]) / Number(m[3]);
  m = s.match(/^(\d+)\/(\d+)$/);
  if (m) return Number(m[1]) / Number(m[2]);
  m = s.match(/^(\d+(?:\.\d+)?)\s?([½⅓⅔¼¾⅛])$/);
  if (m) return Number(m[1]) + VULGAR[m[2]];
  if (VULGAR[s] != null) return VULGAR[s];
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

/** "2 tbsp" x 1.5 = "3 tbsp". Only the quantities before any "(" or "," are scaled; a ranges like "2-3" scale both ends. */
export function scaleAmount(amount: string, factor: number): string {
  if (factor === 1 || !Number.isFinite(factor) || factor <= 0) return amount;
  const cut = amount.search(/[(,;]/);
  const head = cut < 0 ? amount : amount.slice(0, cut);
  const tail = cut < 0 ? "" : amount.slice(cut);
  const re = new RegExp(NUM.source, "g");
  if (!re.test(head)) return amount;
  const out = head.replace(new RegExp(NUM.source, "g"), (tok) => {
    const v = parseNum(tok);
    return v == null ? tok : fmt(v * factor);
  });
  // The parenthesised metric/imperial part is scaled too so the two stay in step.
  const scaledTail = tail.replace(new RegExp(NUM.source, "g"), (tok) => {
    const v = parseNum(tok);
    return v == null ? tok : fmt(v * factor);
  });
  return out + scaledTail;
}

export const SERVING_FACTORS = [0.5, 1, 1.5, 2, 3] as const;

export function scaledServes(serves: number, factor: number): number {
  return Math.max(1, Math.round(serves * factor));
}

export interface StepTimer {
  /** Seconds to count down. For a range ("10 to 12 minutes") the shorter time. */
  seconds: number;
  label: string;
}

/** Timers mentioned in a step: "simmer 10 minutes", "rest for 5 to 10 min", "30 seconds", "1 hour". */
export function stepTimers(step: string): StepTimer[] {
  const out: StepTimer[] = [];
  const re = /(\d+(?:\.\d+)?)(?:\s?(?:-|–|to)\s?(\d+(?:\.\d+)?))?\s*(seconds?|secs?|minutes?|mins?|hours?|hrs?)\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(step))) {
    const lo = Number(m[1]);
    const unit = m[3].toLowerCase();
    const mult = unit.startsWith("h") ? 3600 : unit.startsWith("m") ? 60 : 1;
    const seconds = Math.round(lo * mult);
    if (seconds < 20 || seconds > 4 * 3600) continue;
    out.push({ seconds, label: m[0] });
  }
  return out;
}

export function clock(total: number): string {
  const t = Math.max(0, Math.round(total));
  const h = Math.floor(t / 3600), mm = Math.floor((t % 3600) / 60), s = t % 60;
  return h ? `${h}:${String(mm).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${mm}:${String(s).padStart(2, "0")}`;
}
