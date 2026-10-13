import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDays, occursOn, parseDay, toMin, type HealthEvent } from "../store/calendar";
import { todayKey } from "../store/nourish";

/**
 * Native (Capacitor) bridge. Every export is a safe no-op on the web, so the
 * same bundle runs in the browser, the artifact preview and the iPhone app.
 * Plugin web fallbacks are only loaded if a plugin method is called, and we
 * never call one unless isNative() is true.
 */

export const isNative = (): boolean => {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
};

/* ------------------------------------------------------------------ */
/* Haptics                                                             */
/* ------------------------------------------------------------------ */

export type HapticKind = "light" | "medium" | "heavy" | "success" | "warning";

/** Fire-and-forget haptic. Light = a breathing phase change. */
export function haptic(kind: HapticKind = "light"): void {
  if (!isNative()) return;
  const run =
    kind === "success" ? Haptics.notification({ type: NotificationType.Success })
    : kind === "warning" ? Haptics.notification({ type: NotificationType.Warning })
    : Haptics.impact({ style: kind === "heavy" ? ImpactStyle.Heavy : kind === "medium" ? ImpactStyle.Medium : ImpactStyle.Light });
  void run.catch(() => undefined);
}

/* ------------------------------------------------------------------ */
/* Calendar notifications                                              */
/* ------------------------------------------------------------------ */

/** Minutes before an event that its notification fires. */
export const LEAD_MIN = 5;
/** iOS keeps at most 64 pending local notifications; leave headroom. */
export const MAX_NOTIFICATIONS = 60;
export const NOTIFY_DAYS = 14;
const BODY = "Starting in 5 minutes · open Rooted";
const SOURCE = "rooted-calendar";
const STORE_KEY = "rooted-native-notif-ids";

export interface Occurrence {
  id: number;
  event: HealthEvent;
  date: string;
  at: Date;
}

/** Stable positive 31-bit id (safe as an iOS id and an Android Java int) from event id + date. */
export function notificationId(eventId: string, date: string): number {
  let h = 0x811c9dc5; // FNV-1a
  const s = `${eventId}|${date}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0) % 0x7fffffff || 1;
}

/**
 * Pure: occurrences of `events` over `days` days starting at `fromDay`, each with
 * its notification time (LEAD_MIN before start). Sorted by time, capped at `cap`.
 * Skipped and already-done dates are left out, as are times at or before `now`.
 */
export function upcomingOccurrences(events: HealthEvent[], fromDay: string, days: number, cap: number, now?: Date): Occurrence[] {
  const out: Occurrence[] = [];
  for (let d = 0; d < days; d++) {
    const date = addDays(fromDay, d);
    for (const event of events) {
      if (!occursOn(event, date) || event.done?.[date]) continue;
      const at = parseDay(date);
      at.setMinutes(toMin(event.time) - LEAD_MIN);
      if (now && at.getTime() <= now.getTime()) continue;
      out.push({ id: notificationId(event.id, date), event, date, at });
    }
  }
  out.sort((a, b) => a.at.getTime() - b.at.getTime() || a.id - b.id);
  return out.slice(0, Math.max(0, cap));
}

function storedIds(): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((n) => Number.isInteger(n)) : [];
  } catch {
    return [];
  }
}
function storeIds(ids: number[]): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(ids));
  } catch {
    /* storage unavailable */
  }
}

/**
 * Replace Rooted's scheduled calendar notifications with the next 14 days of
 * occurrences, 5 minutes before each event. No-op on the web, or if the
 * person declines notification permission.
 */
export async function scheduleEventNotifications(events: HealthEvent[]): Promise<number> {
  if (!isNative()) return 0;
  try {
    let perm = await LocalNotifications.checkPermissions();
    if (perm.display === "prompt" || perm.display === "prompt-with-rationale") perm = await LocalNotifications.requestPermissions();
    if (perm.display !== "granted") return 0;

    // Cancel what we scheduled before (tracked ids + anything tagged as ours).
    const { notifications: pending } = await LocalNotifications.getPending();
    const ours = new Set(storedIds());
    for (const n of pending) if (n.extra?.source === SOURCE) ours.add(n.id);
    const cancel = pending.filter((n) => ours.has(n.id)).map((n) => ({ id: n.id }));
    if (cancel.length) await LocalNotifications.cancel({ notifications: cancel });

    const next = upcomingOccurrences(events, todayKey(), NOTIFY_DAYS, MAX_NOTIFICATIONS, new Date());
    if (next.length) {
      await LocalNotifications.schedule({
        notifications: next.map((o) => ({
          id: o.id,
          title: o.event.title,
          body: BODY,
          schedule: { at: o.at, allowWhileIdle: true },
          extra: { to: o.event.to ?? "/calendar", source: SOURCE, eventId: o.event.id, date: o.date },
        })),
      });
    }
    storeIds(next.map((o) => o.id));
    return next.length;
  } catch {
    return 0;
  }
}

/** Call `cb` with the in-app path when someone taps a Rooted notification. Returns an unsubscribe. */
export function onNotificationTap(cb: (to: string) => void): () => void {
  if (!isNative()) return () => undefined;
  const handle = LocalNotifications.addListener("localNotificationActionPerformed", (a) => {
    const to = a.notification.extra?.to;
    if (typeof to === "string" && to.startsWith("/")) cb(to);
  });
  return () => void handle.then((h) => h.remove()).catch(() => undefined);
}
