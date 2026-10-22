import { useCalendar } from "../store/calendar";
import { useRituals, DEFAULT_PREFS } from "../store/rituals";
import { useUser } from "../store/user";
import { RITUALS } from "./rituals";
import { dayKey, niceTime, type RitualTimes } from "./ritualLogic";

/**
 * Reminders are daily repeating Calendar events, one per ritual. The iPhone app turns calendar events into local
 * notifications; on the web they appear in the Calendar and Home, and the Calendar can export them to your phone's
 * own calendar app. Call after wake, bed, a time or a toggle changes.
 */
export function syncRitualReminders(): void {
  const profile = useUser.getState().activeProfileId ?? "guest";
  const { prefs, eventIds, setEventId } = useRituals.getState();
  const p = { ...DEFAULT_PREFS, ...(prefs[profile] ?? {}) };
  const cal = useCalendar.getState();
  const existing = new Set((cal.events[profile] ?? []).map((e) => e.id));
  for (const r of RITUALS) {
    const key = r.id as keyof RitualTimes;
    const evId = eventIds[profile]?.[key];
    const has = !!evId && existing.has(evId);
    if (!p.enabled[key]) {
      if (has) cal.remove(evId!);
      if (evId) setEventId(key, null);
      continue;
    }
    const draft = {
      title: `${r.name} ritual`,
      kind: "healing" as const,
      time: p.times[key],
      minutes: r.session.durationMin,
      repeat: "daily" as const,
      to: `/rituals/${r.id}`,
      note: `${r.window}. ${r.tagline}. Starts ${niceTime(p.times[key])}.`,
    };
    if (has) cal.update(evId!, draft);
    else setEventId(key, cal.add({ ...draft, date: dayKey() }).id);
  }
}
