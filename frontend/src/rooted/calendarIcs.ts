import type { BusyBlock, HealthEvent, Repeat } from "../store/calendar";
import { fromMin, toMin } from "../store/calendar";

/**
 * Calendar files and links. Export health events to Apple, Google or Outlook
 * (.ics or a Google "add event" link), and read a work calendar's .ics so busy
 * time shows next to health time.
 */

const pad = (n: number) => String(n).padStart(2, "0");
const compactDay = (d: string) => d.replace(/-/g, "");
const compactTime = (t: string) => t.replace(":", "") + "00";

/** Escape text for an iCalendar property value. */
export const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");

/** Fold lines longer than 75 octets, as the spec asks. */
function fold(line: string): string {
  if (line.length <= 74) return line;
  const parts: string[] = [];
  for (let i = 0; i < line.length; i += 73) parts.push((i ? " " : "") + line.slice(i, i + 73));
  return parts.join("\r\n");
}

export function rrule(r: Repeat): string | null {
  if (r === "daily") return "FREQ=DAILY";
  if (r === "weekdays") return "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR";
  if (r === "weekly") return "FREQ=WEEKLY";
  return null;
}

/** Start and end as floating local times (YYYYMMDDTHHMMSS), so 7am stays 7am wherever you are. */
function span(e: HealthEvent): [string, string] {
  const start = toMin(e.time);
  const endMin = start + Math.max(e.minutes, 5);
  const endDay = endMin >= 24 * 60 ? nextDay(e.date) : e.date;
  return [`${compactDay(e.date)}T${compactTime(e.time)}`, `${compactDay(endDay)}T${compactTime(fromMin(endMin % (24 * 60)))}`];
}

function nextDay(d: string) {
  const [y, m, dd] = d.split("-").map(Number);
  const x = new Date(y, m - 1, dd + 1);
  return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
}

/** Builds an absolute link into the app for an in-app path. */
export type LinkFn = (to?: string) => string;

/** A link that works for both the normal site and the single-file (hash-routed) build. */
export const appLink: LinkFn = (to = "/") => {
  const { origin, pathname } = window.location;
  return import.meta.env.VITE_HASH_ROUTER ? `${origin}${pathname}#${to}` : `${origin}${to}`;
};

function describe(e: HealthEvent, link: LinkFn): string {
  return [e.note, `Open in Rooted: ${link(e.to)}`].filter(Boolean).join("\n");
}

function vevent(e: HealthEvent, link: LinkFn, stamp: string, alarmMin: number | null): string[] {
  const [s, en] = span(e);
  const rule = rrule(e.repeat);
  const ex = Object.keys(e.skip ?? {}).sort().map((d) => `EXDATE:${compactDay(d)}T${compactTime(e.time)}`);
  return [
    "BEGIN:VEVENT",
    `UID:${e.id}@rooted`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${s}`,
    `DTEND:${en}`,
    ...(rule ? [`RRULE:${rule}`] : []),
    ...ex,
    `SUMMARY:${icsText(e.title)}`,
    `DESCRIPTION:${icsText(describe(e, link))}`,
    `CATEGORIES:Rooted,${e.kind}`,
    ...(alarmMin === null
      ? []
      : ["BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${icsText(e.title)}`, `TRIGGER:-PT${alarmMin}M`, "END:VALARM"]),
    "END:VEVENT",
  ];
}

/** A full calendar file for one or many events. Opens in Apple Calendar, Google Calendar and Outlook. */
export function eventsIcs(events: HealthEvent[], link: LinkFn, opts: { alarmMin?: number | null; name?: string; now?: Date } = {}): string {
  const now = opts.now ?? new Date();
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d+Z$/, "Z");
  const alarm = opts.alarmMin === undefined ? 5 : opts.alarmMin;
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Rooted//Health calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${icsText(opts.name ?? "Rooted health")}`,
    ...events.flatMap((e) => vevent(e, link, stamp, alarm)),
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/** A Google Calendar "add event" link, prefilled. Opens Google Calendar in a new tab. */
export function googleLink(e: HealthEvent, link: LinkFn): string {
  const [s, en] = span(e);
  const p = new URLSearchParams({ action: "TEMPLATE", text: e.title, dates: `${s}/${en}`, details: describe(e, link) });
  const rule = rrule(e.repeat);
  if (rule) p.set("recur", `RRULE:${rule}`);
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/* ------------------------------------------------------------------ */
/* Import: read busy time from a work calendar                         */
/* ------------------------------------------------------------------ */

const DAYS: Record<string, number> = { SU: 0, MO: 1, TU: 2, WE: 3, TH: 4, FR: 5, SA: 6 };

/** Turn an iCalendar date or date-time into local "YYYY-MM-DDTHH:MM". UTC times ("Z") convert to this device's zone. */
function localStamp(v: string): string | null {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})?(Z)?)?$/);
  if (!m) return null;
  const [, y, mo, d, h = "00", mi = "00", , z] = m;
  if (z) {
    const x = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi));
    return `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}T${pad(x.getHours())}:${pad(x.getMinutes())}`;
  }
  return `${y}-${mo}-${d}T${h}:${mi}`;
}

/**
 * Read the busy blocks from an .ics file. Keeps times and titles; supports
 * daily and weekly repeats (the common work patterns). Skips all-day events,
 * cancelled events and anything that ended before `since`.
 */
export function parseBusyIcs(text: string, since: string): BusyBlock[] {
  const lines = text.replace(/\r\n[ \t]/g, "").replace(/\n[ \t]/g, "").split(/\r?\n/);
  const out: BusyBlock[] = [];
  let cur: Record<string, string> | null = null;
  for (const raw of lines) {
    if (raw === "BEGIN:VEVENT") cur = {};
    else if (raw === "END:VEVENT" && cur) {
      const b = toBlock(cur, since);
      if (b) out.push(b);
      cur = null;
    } else if (cur) {
      const i = raw.indexOf(":");
      if (i < 0) continue;
      const key = raw.slice(0, i).split(";");
      const name = key[0].toUpperCase();
      if (key.some((k) => k.toUpperCase() === "VALUE=DATE")) cur[`${name}_ALLDAY`] = "1";
      if (!(name in cur)) cur[name] = raw.slice(i + 1);
    }
  }
  return out.sort((a, b) => a.start.localeCompare(b.start)).slice(0, 1000);
}

function toBlock(v: Record<string, string>, since: string): BusyBlock | null {
  if (!v.DTSTART || v.DTSTART_ALLDAY || v.STATUS === "CANCELLED" || v.TRANSP === "TRANSPARENT") return null;
  const start = localStamp(v.DTSTART.trim());
  if (!start) return null;
  let end = v.DTEND ? localStamp(v.DTEND.trim()) : null;
  if (!end) {
    const dur = v.DURATION?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
    const add = dur ? (+(dur[1] ?? 0)) * 60 + +(dur[2] ?? 0) : 60;
    const e = toMin(start.slice(11)) + add;
    end = `${start.slice(0, 10)}T${fromMin(Math.min(e, 24 * 60 - 1))}`;
  }
  const title = (v.SUMMARY ?? "Busy").replace(/\\([,;\\])/g, "$1").replace(/\\n/gi, " ").slice(0, 80);
  const block: BusyBlock = { start, end, title };
  const rule = v.RRULE;
  if (rule) {
    const parts = Object.fromEntries(rule.split(";").map((p) => p.split("=") as [string, string]));
    if (parts.FREQ === "DAILY") block.repeat = "daily";
    else if (parts.FREQ === "WEEKLY") {
      block.repeat = "weekly";
      if (parts.BYDAY) block.byDay = parts.BYDAY.split(",").map((d) => DAYS[d.slice(-2)]).filter((d) => d !== undefined);
    }
    if (parts.UNTIL) block.until = localStamp(parts.UNTIL)?.slice(0, 10);
  }
  const lastDay = block.repeat ? block.until ?? "9999-12-31" : end.slice(0, 10);
  if (lastDay < since) return null;
  return block;
}
