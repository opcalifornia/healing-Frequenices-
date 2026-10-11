import { useState } from "react";
import { motion } from "framer-motion";
import { remindersIcs, type Reminder } from "./reminders";
import { saveTextFile } from "./download";
import { Icon } from "../components/Icon";

const PRESETS: Array<Reminder & { id: string; label: string }> = [
  { id: "morning", label: "Morning", time: "07:30", title: "Breathe: 1 minute to start the day", note: "Calm down pattern, 4 in and 6 out." },
  { id: "midday", label: "Midday", time: "13:00", title: "Breathe: midday reset", note: "Two physiological sighs, or box breathing before your next task." },
  { id: "evening", label: "Evening", time: "21:30", title: "Breathe: wind down", note: "4-7-8 or coherent breathing before bed." },
];

/** Pick when to be nudged; adds repeating calendar alarms. */
export function ReminderCard() {
  const [on, setOn] = useState<Record<string, boolean>>({ morning: true, midday: false, evening: true });
  const [times, setTimes] = useState<Record<string, string>>(Object.fromEntries(PRESETS.map((p) => [p.id, p.time])));
  const [saved, setSaved] = useState(false);
  const chosen = PRESETS.filter((p) => on[p.id]).map((p) => ({ ...p, time: times[p.id] }));
  const url = `${location.origin}${location.pathname.includes("/breathe") ? location.pathname : "/breathe"}`;

  return (
    <div className="r-card remind">
      <div className="remind__head">
        <span className="heart__icon remind__icon"><Icon name="bell" size={26} /></span>
        <div>
          <h3>Daily reminders</h3>
          <p>Pick when you'd like a nudge. We'll add repeating alarms to your phone's calendar, so they work even when Rooted is closed.</p>
        </div>
      </div>
      <div className="remind__rows">
        {PRESETS.map((p) => (
          <label key={p.id} className={`remind__row ${on[p.id] ? "is-on" : ""}`}>
            <input type="checkbox" checked={on[p.id]} onChange={(e) => setOn({ ...on, [p.id]: e.target.checked })} />
            <span className="slist__check">{on[p.id] && <Icon name="check" size={16} />}</span>
            <span className="remind__label"><strong>{p.label}</strong><small>{p.title.replace("Breathe: ", "")}</small></span>
            <input type="time" value={times[p.id]} onChange={(e) => setTimes({ ...times, [p.id]: e.target.value })} aria-label={`${p.label} reminder time`} />
          </label>
        ))}
      </div>
      <div className="remind__actions">
        <motion.button whileTap={{ scale: 0.96 }} className="btn btn--primary" disabled={!chosen.length} onClick={() => { void saveTextFile("rooted-breathe-reminders.ics", remindersIcs(chosen, url), "text/calendar"); setSaved(true); }}>
          <Icon name="bell" size={18} /> Add {chosen.length} reminder{chosen.length === 1 ? "" : "s"} to my calendar
        </motion.button>
        {saved && <span className="slist__note">Open the downloaded file to add the alarms.</span>}
      </div>
    </div>
  );
}
