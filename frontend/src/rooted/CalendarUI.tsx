import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sheet, useToast } from "./ui";
import { Icon } from "../components/Icon";
import { saveTextFile } from "./download";
import { track } from "./metrics";
import { appLink, eventsIcs, googleLink } from "./calendarIcs";
import { todayKey } from "../store/nourish";
import { addDays, findFreeSlot, parseDay, toMin, useBusy, useCalendar, useEvents, type EventKind, type HealthEvent, type Repeat } from "../store/calendar";

/** How each kind of event looks. Colors follow the section accents. */
export const KINDS: Record<EventKind, { label: string; color: string }> = {
  breathe: { label: "Breathe", color: "#6ec6ff" },
  move: { label: "Move", color: "#ff8a65" },
  nourish: { label: "Nourish", color: "#9ccc65" },
  light: { label: "Light", color: "#ffd54f" },
  spirit: { label: "Spirit", color: "#b39ddb" },
  healing: { label: "Sound", color: "#8b6cff" },
  program: { label: "Program", color: "#4db6ac" },
  sleep: { label: "Sleep", color: "#7986cb" },
  appointment: { label: "Appointment", color: "#f06292" },
  other: { label: "Other", color: "#e8d5b0" },
};

export type Draft = Omit<HealthEvent, "id" | "date" | "time"> & { date?: string; time?: string };

/** One-tap starting points. Times are suggestions; the free-slot finder nudges them around busy time. */
export const TEMPLATES: Array<Draft & { emoji: string }> = [
  { emoji: "🌬️", title: "Breathe: one-minute settle-in", kind: "breathe", minutes: 2, repeat: "daily", to: "/breathe", time: "15:00" },
  { emoji: "🚶", title: "Walk after lunch", kind: "move", minutes: 10, repeat: "weekdays", to: "/move", time: "12:45" },
  { emoji: "🧘", title: "Gentle yoga flow", kind: "move", minutes: 10, repeat: "daily", to: "/move", time: "19:00" },
  { emoji: "☀️", title: "Morning light outside", kind: "light", minutes: 10, repeat: "daily", to: "/light", time: "07:00" },
  { emoji: "🪷", title: "Sit quietly", kind: "spirit", minutes: 5, repeat: "daily", to: "/spirit#sit", time: "07:15" },
  { emoji: "💧", title: "Drink a glass of water", kind: "nourish", minutes: 1, repeat: "daily", to: "/nourish#water", time: "10:00" },
  { emoji: "🛒", title: "Grocery run", kind: "nourish", minutes: 45, repeat: "weekly", to: "/nourish#pantry", time: "10:00" },
  { emoji: "🎧", title: "Focus session", kind: "healing", minutes: 25, repeat: "weekdays", to: "/frequencies", time: "09:30" },
  { emoji: "🌙", title: "Wind down for sleep", kind: "sleep", minutes: 30, repeat: "daily", to: "/bedtime", time: "22:00" },
  { emoji: "🩺", title: "Appointment", kind: "appointment", minutes: 60, repeat: "none", time: "10:00", note: "Therapist, massage, acupuncture, doctor…" },
];

const REPEATS: Array<{ id: Repeat; label: string }> = [
  { id: "none", label: "Once" },
  { id: "daily", label: "Every day" },
  { id: "weekdays", label: "Weekdays" },
  { id: "weekly", label: "Weekly" },
];

export const niceDay = (d: string) => parseDay(d).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
export const niceTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
};

export function exportOne(e: HealthEvent) {
  const name = e.title.replace(/[^\w]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "event";
  return saveTextFile(`rooted-${name}.ics`, eventsIcs([e], appLink), "text/calendar");
}

/** Buttons that send one event to Apple, Google or Outlook. */
export function SendButtons({ e, onDone }: { e: HealthEvent; onDone?(m: string): void }) {
  return (
    <div className="cal-send">
      <button className="btn btn--secondary btn--small" onClick={() => exportOne(e).then(() => onDone?.("Saved. Open the file to add it to Apple Calendar"))}>
        <Icon name="plus" size={16} /> Apple Calendar
      </button>
      <a className="btn btn--secondary btn--small" href={googleLink(e, appLink)} target="_blank" rel="noreferrer">
        <Icon name="plus" size={16} /> Google Calendar
      </a>
      <button className="btn btn--secondary btn--small" onClick={() => exportOne(e).then(() => onDone?.("Saved. Open the file to add it to Outlook"))}>
        <Icon name="plus" size={16} /> Outlook
      </button>
    </div>
  );
}

/** The add / edit form. Prefills from a draft and suggests a time that's actually free. */
export function ScheduleSheet({ open, onClose, draft, editing, onSaved }: { open: boolean; onClose(): void; draft?: Draft | null; editing?: HealthEvent | null; onSaved?(e: HealthEvent): void }) {
  const events = useEvents();
  const busy = useBusy();
  const add = useCalendar((s) => s.add);
  const update = useCalendar((s) => s.update);
  const [form, setForm] = useState<Omit<HealthEvent, "id">>(blank());
  const [picking, setPicking] = useState(false);
  const [saved, setSaved] = useState<HealthEvent | null>(null);
  const toast = useToast();

  useEffect(() => {
    if (!open) return;
    setSaved(null);
    if (editing) {
      setForm({ ...editing });
      setPicking(false);
    } else if (draft) {
      setForm(fill(draft));
      setPicking(false);
    } else {
      setForm(blank());
      setPicking(true);
    }
    // Only reset when the sheet opens; callers often pass a fresh draft object each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function fill(d: Draft): Omit<HealthEvent, "id"> {
    // No day given and the time has already passed today? Start tomorrow.
    const now = new Date();
    const late = !d.date && d.time && toMin(d.time) < now.getHours() * 60 + now.getMinutes();
    const date = d.date ?? (late ? addDays(todayKey(), 1) : todayKey());
    const others = events.filter((e) => e.id !== editing?.id);
    const time = findFreeSlot(others, busy, date, d.time ?? "09:00", d.minutes);
    return { ...d, date, time };
  }

  const set = (p: Partial<typeof form>) => setForm((f) => ({ ...f, ...p }));
  const suggest = () => set({ time: findFreeSlot(events.filter((e) => e.id !== editing?.id), busy, form.date, form.time, form.minutes) });

  const save = () => {
    if (!form.title.trim()) return;
    let ev: HealthEvent;
    if (editing) {
      update(editing.id, form);
      ev = { ...editing, ...form };
    } else {
      ev = add({ ...form, title: form.title.trim() });
      track("calendar_event_added");
    }
    setSaved(ev);
    onSaved?.(ev);
  };

  return (
    <Sheet open={open} onClose={onClose} label={editing ? "Edit event" : "Add to your calendar"}>
      <div className="cal-form">
        {saved ? (
          <div className="cal-saved">
            <span className="cal-saved__tick"><Icon name="check" size={28} /></span>
            <h2>On your health calendar</h2>
            <p>
              {saved.title} · {niceDay(saved.date)} at {niceTime(saved.time)}
              {saved.repeat !== "none" && `, ${REPEATS.find((r) => r.id === saved.repeat)!.label.toLowerCase()}`}
            </p>
            <p className="cal-form__hint">Want it next to your work meetings too? Send it to the calendar you already use:</p>
            <SendButtons e={saved} onDone={toast.show} />
            <div className="cal-saved__row">
              <Link to="/calendar" className="btn btn--primary btn--small" onClick={onClose}>See my calendar</Link>
              <button className="btn btn--secondary btn--small" onClick={onClose}>Done</button>
            </div>
          </div>
        ) : picking ? (
          <>
            <h2>What would you like to schedule?</h2>
            <p className="cal-form__hint">Pick one to start. You can change anything next.</p>
            <div className="cal-templates">
              {TEMPLATES.map((t) => (
                <button key={t.title} className="cal-template" style={{ ["--k" as string]: KINDS[t.kind].color }} onClick={() => { setForm(fill(t)); setPicking(false); }}>
                  <span className="cal-template__emoji" aria-hidden="true">{t.emoji}</span>
                  <b>{t.title}</b>
                  <small>{t.minutes} min · {REPEATS.find((r) => r.id === t.repeat)!.label}</small>
                </button>
              ))}
              <button className="cal-template" onClick={() => { setForm(fill({ title: "", kind: "other", minutes: 15, repeat: "none" })); setPicking(false); }}>
                <span className="cal-template__emoji" aria-hidden="true">✏️</span>
                <b>Something else</b>
                <small>Your own event</small>
              </button>
            </div>
          </>
        ) : (
          <>
            <h2>{editing ? "Edit" : "Schedule it"}</h2>
            <label className="cal-field">
              <span>What</span>
              <input value={form.title} onChange={(e) => set({ title: e.target.value })} placeholder="e.g. Acupuncture with Dr. Lee" autoFocus={!form.title} />
            </label>
            <div className="cal-field" role="group" aria-label="Type">
              <span aria-hidden="true">Type</span>
              <div className="cal-kinds">
                {(Object.keys(KINDS) as EventKind[]).map((k) => (
                  <button key={k} aria-pressed={form.kind === k} className={`chip ${form.kind === k ? "is-on" : ""}`} style={{ ["--k" as string]: KINDS[k].color }} onClick={() => set({ kind: k })}>
                    <i className="cal-dot" aria-hidden="true" /> {KINDS[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="cal-row">
              <label className="cal-field">
                <span>Day</span>
                <input type="date" value={form.date} onChange={(e) => e.target.value && set({ date: e.target.value })} />
              </label>
              <label className="cal-field">
                <span>Time</span>
                <input type="time" value={form.time} onChange={(e) => e.target.value && set({ time: e.target.value })} />
              </label>
              <label className="cal-field">
                <span>Minutes</span>
                <input type="number" min={1} max={600} value={form.minutes} onChange={(e) => set({ minutes: Math.max(1, Math.min(600, +e.target.value || 1)) })} />
              </label>
            </div>
            <button className="cal-suggest" onClick={suggest}>
              <Icon name="sparkle" size={16} /> Find a free time near this
            </button>
            <div className="cal-field" role="group" aria-label="Repeat">
              <span aria-hidden="true">Repeat</span>
              <div className="cal-kinds">
                {REPEATS.map((r) => (
                  <button key={r.id} aria-pressed={form.repeat === r.id} className={`chip ${form.repeat === r.id ? "is-on" : ""}`} onClick={() => set({ repeat: r.id })}>{r.label}</button>
                ))}
              </div>
            </div>
            <label className="cal-field">
              <span>Note (optional)</span>
              <textarea rows={2} value={form.note ?? ""} onChange={(e) => set({ note: e.target.value })} placeholder="Address, what to bring, how you want to feel…" />
            </label>
            <div className="cal-saved__row">
              <button className="btn btn--primary" onClick={save} disabled={!form.title.trim()}>
                <Icon name="check" size={18} /> {editing ? "Save changes" : "Add to calendar"}
              </button>
              {!editing && <button className="btn btn--secondary" onClick={() => setPicking(true)}>Back</button>}
            </div>
          </>
        )}
      </div>
      {toast.node}
    </Sheet>
  );
}

function blank(): Omit<HealthEvent, "id"> {
  return { title: "", kind: "other", date: todayKey(), time: "09:00", minutes: 15, repeat: "none" };
}

/** A small "Add to calendar" button that opens the scheduler prefilled. Drop it anywhere in the app. */
export function ScheduleButton({ draft, label = "Add to calendar", className = "btn btn--secondary btn--small" }: { draft: Draft; label?: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={className} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}>
        <Icon name="bell" size={16} /> {label}
      </button>
      <ScheduleSheet open={open} onClose={() => setOpen(false)} draft={draft} />
    </>
  );
}
