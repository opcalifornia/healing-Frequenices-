/**
 * Share cards: a branded image of someone's week or a finished program, drawn
 * on a canvas so it works offline and never leaves the device unless the
 * person shares it. Private details (mood, stress) are opt-in.
 */

export type CardFormat = "post" | "story";
export const CARD_SIZE: Record<CardFormat, [number, number]> = { post: [1080, 1350], story: [1080, 1920] };

export interface WeekCardData {
  kind: "week";
  minutes: number;
  activeDays: number;
  streak: number;
  /** Minutes per day, oldest first, 7 values. */
  perDay: number[];
  dayLabels: string[];
  /** Only drawn when the person opts in. */
  stressDrop?: number;
  topArea?: string;
}

export interface ProgramCardData {
  kind: "program";
  id?: string;
  title: string;
  days: number;
  section: string;
  hue: number;
}

export type CardData = WeekCardData | ProgramCardData;

/** The words on the card, kept separate from drawing so they're easy to test. */
export function cardText(d: CardData): { eyebrow: string; headline: string[]; stats: Array<[string, string]>; footer: string } {
  if (d.kind === "program") {
    return {
      eyebrow: `${d.section} program · complete`,
      headline: wrapWords(`I finished ${d.title}`, 18),
      stats: [[String(d.days), d.days === 1 ? "day" : "days"], ["100%", "of lessons done"]],
      footer: "rooted · small, proven habits for body and mind",
    };
  }
  const stats: Array<[string, string]> = [
    [String(d.minutes), "minutes"],
    [`${d.activeDays}/7`, "days active"],
  ];
  if (d.streak >= 2) stats.push([String(d.streak), "day streak"]);
  if (d.stressDrop !== undefined && d.stressDrop > 0) stats.push([`−${d.stressDrop}`, "stress, avg"]);
  const headline = d.minutes > 0 ? `${d.minutes} minutes for me this week` : "Showing up for myself this week";
  return { eyebrow: d.topArea ? `My week · mostly ${d.topArea.toLowerCase()}` : "My week", headline: wrapWords(headline, 16), stats: stats.slice(0, 4), footer: "rooted · small, proven habits for body and mind" };
}

export function wrapWords(text: string, max: number): string[] {
  const lines: string[] = [];
  let cur = "";
  for (const w of text.split(/\s+/)) {
    if (cur && (cur + " " + w).length > max) {
      lines.push(cur);
      cur = w;
    } else cur = cur ? `${cur} ${w}` : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

const SAGE = "#9cc59a";
const SAND = "#e8d5b0";
const CLAY = "#e3a57a";
const BAR = "#6fa83a";

/** Draw a card onto a canvas. Returns the canvas for convenience. */
export async function drawCard(canvas: HTMLCanvasElement, d: CardData, format: CardFormat): Promise<HTMLCanvasElement> {
  const [W, H] = CARD_SIZE[format];
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  await document.fonts?.ready?.catch(() => undefined);
  const font = getComputedStyle(document.body).fontFamily || "system-ui, sans-serif";
  const t = cardText(d);
  const accent = d.kind === "program" ? `hsl(${d.hue} 60% 62%)` : SAGE;

  // Background: deep earth with two soft glows.
  ctx.fillStyle = "#0b0d0a";
  ctx.fillRect(0, 0, W, H);
  glow(ctx, W * 0.15, H * 0.12, W * 0.75, d.kind === "program" ? `hsla(${d.hue}, 60%, 45%, 0.45)` : "rgba(111, 168, 58, 0.38)");
  glow(ctx, W * 0.95, H * 0.55, W * 0.6, "rgba(110, 198, 255, 0.22)");
  glow(ctx, W * 0.3, H * 1.02, W * 0.7, "rgba(227, 165, 122, 0.22)");

  const pad = 96;
  const top = format === "story" ? 300 : 120;

  // Logo.
  drawSprout(ctx, pad, top - 40, 2.2);
  ctx.fillStyle = SAND;
  ctx.font = `800 52px ${font}`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText("rooted", pad + 74, top + 6);

  // Eyebrow and headline.
  let y = top + (format === "story" ? 220 : 150);
  ctx.fillStyle = accent;
  ctx.font = `800 34px ${font}`;
  spaced(ctx, t.eyebrow.toUpperCase(), pad, y, 4);
  y += 40;
  ctx.fillStyle = "#ffffff";
  ctx.font = `900 108px ${font}`;
  for (const line of t.headline) {
    y += 112;
    ctx.fillText(line, pad, y);
  }

  // Chart (week) or badge (program).
  y += format === "story" ? 140 : 90;
  if (d.kind === "week") {
    const chartH = format === "story" ? 480 : 300;
    drawBars(ctx, d, pad, y, W - pad * 2, chartH, font);
    y += chartH + 90;
  } else {
    const r = format === "story" ? 200 : 140;
    y += 50;
    drawBadge(ctx, W / 2, y + r, r, d.hue, font);
    y += r * 2 + 110;
  }

  // Stats row.
  const cols = t.stats.length;
  const colW = (W - pad * 2) / cols;
  t.stats.forEach(([v, label], i) => {
    const x = pad + i * colW;
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 92px ${font}`;
    ctx.fillText(v, x, y + 80);
    ctx.fillStyle = "rgba(240, 232, 214, 0.75)";
    ctx.font = `700 32px ${font}`;
    ctx.fillText(label, x, y + 130);
  });

  // Footer.
  ctx.fillStyle = "rgba(240, 232, 214, 0.62)";
  ctx.font = `700 30px ${font}`;
  ctx.fillText(t.footer, pad, H - (format === "story" ? 200 : 90));
  return canvas;
}

function glow(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function spaced(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, gap: number) {
  for (const ch of text) {
    ctx.fillText(ch, x, y);
    x += ctx.measureText(ch).width + gap;
  }
}

/** The Rooted sprout mark, from the 28x32 logo artwork, scaled. */
function drawSprout(ctx: CanvasRenderingContext2D, x: number, y: number, s: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#a9cf8c";
  ctx.lineWidth = 2.4;
  ctx.beginPath(); ctx.moveTo(14, 15); ctx.lineTo(14, 7); ctx.stroke();
  ctx.fillStyle = "#b5d68f";
  ctx.fill(new Path2D("M14 9c-1-4.5-4.6-6.6-9-6 .2 4.4 3.6 7 9 6Z"));
  ctx.globalAlpha = 0.85;
  ctx.fill(new Path2D("M14 11c1.2-4 4.6-5.9 8.6-5.2-.4 4-3.6 6.2-8.6 5.2Z"));
  ctx.globalAlpha = 0.7;
  ctx.strokeStyle = SAND; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(3, 15.5); ctx.lineTo(25, 15.5); ctx.stroke();
  ctx.globalAlpha = 0.8;
  ctx.strokeStyle = CLAY;
  ctx.stroke(new Path2D("M14 16v8m0-5c-2 1.6-4.5 2-6.5 5.5M14 19c2.2 1.4 4.6 2.4 6 5.8M14 23c-1 2-2.4 3-3.6 6M14 22c1.4 1.6 2.2 3.6 2.6 7"));
  ctx.restore();
}

function drawBars(ctx: CanvasRenderingContext2D, d: WeekCardData, x: number, y: number, w: number, h: number, font: string) {
  const max = Math.max(10, ...d.perDay);
  const slot = w / 7;
  const bw = slot * 0.56;
  const base = y + h - 50;
  ctx.strokeStyle = "rgba(232, 213, 176, 0.25)";
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, base); ctx.lineTo(x + w, base); ctx.stroke();
  d.perDay.forEach((m, i) => {
    const bh = (m / max) * (h - 70);
    const bx = x + i * slot + (slot - bw) / 2;
    if (bh > 0) {
      ctx.fillStyle = BAR;
      roundTop(ctx, bx, base, bw, bh, 14);
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.beginPath(); ctx.arc(bx + bw / 2, base - 10, 6, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(240, 232, 214, 0.75)";
    ctx.font = `700 30px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(d.dayLabels[i] ?? "", bx + bw / 2, base + 44);
    ctx.textAlign = "left";
  });
}

function roundTop(ctx: CanvasRenderingContext2D, x: number, base: number, w: number, h: number, r: number) {
  r = Math.min(r, h, w / 2);
  const y = base - h;
  ctx.beginPath();
  ctx.moveTo(x, base);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, base);
  ctx.closePath();
  ctx.fill();
}

function drawBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hue: number, font: string) {
  for (let i = 3; i >= 1; i--) {
    ctx.strokeStyle = `hsla(${hue}, 60%, 62%, ${0.12 * i})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, r + i * 18, 0, Math.PI * 2); ctx.stroke();
  }
  const g = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  g.addColorStop(0, `hsl(${hue} 55% 42%)`);
  g.addColorStop(1, `hsl(${hue + 40} 55% 30%)`);
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = r * 0.09;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(cx - r * 0.38, cy + r * 0.02);
  ctx.lineTo(cx - r * 0.1, cy + r * 0.3);
  ctx.lineTo(cx + r * 0.42, cy - r * 0.28);
  ctx.stroke();
  void font;
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}
