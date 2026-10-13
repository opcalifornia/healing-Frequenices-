import { useState } from "react";
import { motion } from "framer-motion";
import { Sheet } from "./ui";
import { Icon } from "../components/Icon";
import { saveTextFile } from "./download";
import { TASK_HELP, TASK_LABEL, addDays, careIcs, dueItems, dueWords, nextDue, reminderItems, reminderText, resolvePlant, tasksOf, type DueItem } from "./gardenCare";
import { showGardenReminder } from "./gardenReminder";
import { daysSince, useGarden, useGardenPrefs, useMyCustomPlants, useMyGarden, type CustomPlant, type Planting, type TaskKind } from "../store/garden";
import { todayKey } from "../store/nourish";

/** Today's care: what to check, feed or water, with Done and Not yet. */
export function TodayCard({ onOpen }: { onOpen(plantId: string): void }) {
  const mine = useMyGarden();
  const custom = useMyCustomPlants();
  const { complete, snooze } = useGarden();
  const today = todayKey();
  const due = dueItems(mine, custom, today);
  if (!mine.length) return null;
  const doAll = (list: DueItem[]) => list.forEach((d) => complete(d.plantId, d.task.kind, today));
  return (
    <div className="r-card today">
      <div className="today__head">
        <div>
          <h3>Today in your garden</h3>
          <p>{due.length ? `${due.length} thing${due.length === 1 ? "" : "s"} to look at.` : "All caught up. Nothing is due today."}</p>
        </div>
        {due.length > 1 && <button className="btn btn--secondary btn--small" onClick={() => doAll(due)}><Icon name="check" size={16} /> Mark all done</button>}
      </div>
      {due.length > 0 && (
        <ul className="today__list">
          {due.map((d) => (
            <li key={`${d.plantId}-${d.task.kind}`} style={{ "--h": d.hue } as React.CSSProperties}>
              <button className="today__name" onClick={() => onOpen(d.plantId)}>
                <strong>{d.name}</strong>
                <small>{TASK_LABEL[d.task.kind]}{d.late > 0 ? ` · ${dueWords(d.due, today)}` : ""}</small>
              </button>
              <span className="today__actions">
                <button className="btn btn--primary btn--small" onClick={() => complete(d.plantId, d.task.kind, today)} aria-label={`${TASK_LABEL[d.task.kind]} ${d.name}: done`}>Done</button>
                <button className="btn btn--secondary btn--small" onClick={() => snooze(d.plantId, d.task.kind, addDays(today, 1))} aria-label={`${d.name}: not yet, ask tomorrow`}>Not yet</button>
              </span>
            </li>
          ))}
        </ul>
      )}
      {due.length > 0 && <p className="today__hint">{TASK_HELP.water}</p>}
    </div>
  );
}

const TIMES: Array<[string, string]> = [["07:30", "Morning"], ["12:30", "Midday"], ["18:00", "Evening"]];

function notifyState(): "unsupported" | "default" | "granted" | "denied" {
  return typeof Notification === "undefined" ? "unsupported" : Notification.permission;
}

/**
 * Set up garden reminders in one place: what for, how often, what time, and where. Two ways to be reminded, and
 * either or both: repeating alarms in the phone's calendar (work even when Rooted is closed), or Rooted's own
 * reminder (a banner when the app is open, and a system notification where the browser allows it).
 */
export function CareReminderCard() {
  const mine = useMyGarden();
  const custom = useMyCustomPlants();
  const prefs = useGardenPrefs();
  const setPrefs = useGarden((s) => s.setPrefs);
  const [saved, setSaved] = useState(false);
  const [perm, setPerm] = useState(notifyState());
  if (!mine.length) return null;
  const today = todayKey();
  const url = `${location.origin}${location.pathname}#/garden`;
  const kinds = (prefs.water ? 1 : 0) + (prefs.feed ? 1 : 0);
  const items = reminderItems(mine, custom, prefs, today);
  const count = prefs.mode === "daily" ? (kinds ? 1 : 0) : mine.reduce((n, pl) => { const rp = resolvePlant(pl.plantId, custom); return n + (rp ? tasksOf(pl, rp).filter((t) => (t.kind === "water" ? prefs.water : prefs.feed)).length : 0); }, 0);

  const toggleApp = async () => {
    if (prefs.app) return setPrefs({ app: false });
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try { setPerm(await Notification.requestPermission()); } catch { /* the browser said no */ }
    }
    setPerm(notifyState());
    setPrefs({ app: true, lastShown: undefined });
  };
  const sendTest = () => {
    const t = reminderText(items.length ? items : [{ name: "Your plants", kinds: ["water"] }]);
    showGardenReminder(t.title, t.body);
  };

  return (
    <div className="r-card remind">
      <div className="remind__head">
        <span className="heart__icon remind__icon"><Icon name="bell" size={26} /></span>
        <div>
          <h3>Reminders</h3>
          <p>Set it up once. Choose what to be reminded about, how often, and where.</p>
        </div>
      </div>

      <div className="rsetup">
        <p className="rsetup__q"><span>1</span> What for?</p>
        <div className="ndetail__chips">
          <button className={`chip ${prefs.water ? "is-on" : ""}`} aria-pressed={prefs.water} onClick={() => setPrefs({ water: !prefs.water })}>Watering</button>
          <button className={`chip ${prefs.feed ? "is-on" : ""}`} aria-pressed={prefs.feed} onClick={() => setPrefs({ feed: !prefs.feed })}>Nutrients and feeding</button>
        </div>

        <p className="rsetup__q"><span>2</span> How often?</p>
        <div className="ndetail__chips" role="radiogroup" aria-label="How often">
          <button role="radio" aria-checked={prefs.mode === "daily"} className={`chip ${prefs.mode === "daily" ? "is-on" : ""}`} onClick={() => setPrefs({ mode: "daily" })}>Every day</button>
          <button role="radio" aria-checked={prefs.mode === "rhythm"} className={`chip ${prefs.mode === "rhythm" ? "is-on" : ""}`} onClick={() => setPrefs({ mode: "rhythm" })}>When each plant needs it</button>
        </div>
        <p className="care__hint">{prefs.mode === "daily" ? "One reminder every day to look over your garden." : "Each plant on its own schedule, which you can adjust under Care. Recommended."}</p>

        <p className="rsetup__q"><span>3</span> What time?</p>
        <div className="ndetail__chips">
          {TIMES.map(([t, l]) => <button key={t} className={`chip ${prefs.time === t ? "is-on" : ""}`} aria-pressed={prefs.time === t} onClick={() => setPrefs({ time: t })}>{l}</button>)}
          <input className="rsetup__time" type="time" value={prefs.time} onChange={(e) => e.target.value && setPrefs({ time: e.target.value })} aria-label="Reminder time" />
        </div>

        <p className="rsetup__q"><span>4</span> Where?</p>
        <div className="rsetup__ways">
          <div className="rsetup__way">
            <strong>On your phone's calendar</strong>
            <small>Repeating alarms that work even when Rooted is closed.</small>
            <motion.button whileTap={{ scale: 0.96 }} className="btn btn--primary btn--small" disabled={!kinds} onClick={() => { void saveTextFile("rooted-garden-reminders.ics", careIcs(mine, custom, prefs, url, today), "text/calendar"); setSaved(true); }}>
              <Icon name="bell" size={16} /> Add {count} reminder{count === 1 ? "" : "s"}
            </motion.button>
            {saved && <small className="slist__note">Open the downloaded file to add the alarms. Planting something new, or changing a time? Add them again.</small>}
          </div>
          <div className="rsetup__way">
            <strong>In Rooted</strong>
            <small>A reminder when you open the app at or after your time{perm === "granted" ? ", plus a notification when the browser allows it" : ""}.</small>
            <button className={`btn btn--small ${prefs.app ? "btn--secondary" : "btn--primary"}`} disabled={!kinds} aria-pressed={prefs.app} onClick={() => void toggleApp()}>
              <Icon name={prefs.app ? "check" : "bell"} size={16} /> {prefs.app ? "On: tap to turn off" : "Turn on"}
            </button>
            {prefs.app && <button className="scan__link" onClick={sendTest}>Send me a test</button>}
            {prefs.app && perm === "denied" && <small className="slist__note">Notifications are blocked in your browser settings, so you'll see the reminder inside Rooted only.</small>}
            {prefs.app && perm === "unsupported" && <small className="slist__note">This browser can't show notifications. You'll see the reminder inside Rooted. For alerts when the app is closed, use the calendar.</small>}
          </div>
        </div>
        <p className="care__hint">Every reminder says "check", so test the soil with a finger before you water. For alerts while Rooted is fully closed, the calendar option is the most reliable on iPhone until the app has its own native notifications.</p>
      </div>
    </div>
  );
}

const WATER_CHOICES = [1, 2, 3, 4, 5, 7, 10, 14];
const FEED_CHOICES = [0, 14, 21, 30];

/** Everything about one planting: its rhythm, notes, harvests, and removing it. */
export function PlantingSheet({ plantId, onClose }: { plantId: string | null; onClose(): void }) {
  const mine = useMyGarden();
  const custom = useMyCustomPlants();
  const { setEvery, addEntry, complete, remove, removeCustom } = useGarden();
  const [note, setNote] = useState("");
  const pl = mine.find((m) => m.plantId === plantId);
  const plant = plantId ? resolvePlant(plantId, custom) : undefined;
  const today = todayKey();
  const body = pl && plant ? (
    <article className="tdetail" style={{ "--h": plant.hue } as React.CSSProperties}>
      <div className="tdetail__top routine-detail__top">
        <span className="rooted__eyebrow">Day {daysSince(pl.planted)} · planted {pl.planted}</span>
        <h2>{plant.name}</h2>
      </div>
      <div className="tdetail__body">
        <section>
          <h3>Care rhythm</h3>
          <ul className="care__list">
            {tasksOf(pl, plant).map((t) => (
              <li key={t.kind}>
                <div><strong>{TASK_LABEL[t.kind]}</strong> <small>every {t.everyDays} day{t.everyDays === 1 ? "" : "s"} · next {dueWords(nextDue(pl, t), today).toLowerCase()}</small></div>
                <button className="btn btn--secondary btn--small" onClick={() => complete(pl.plantId, t.kind, today)}>Done today</button>
              </li>
            ))}
          </ul>
          <p className="care__label">Check water every</p>
          <div className="ndetail__chips" role="radiogroup" aria-label="Check water every">
            {WATER_CHOICES.map((d) => {
              const cur = tasksOf(pl, plant)[0].everyDays;
              return <button key={d} role="radio" aria-checked={cur === d} className={`chip ${cur === d ? "is-on" : ""}`} onClick={() => setEvery(pl.plantId, "water", d)}>{d === 1 ? "Daily" : `${d} days`}</button>;
            })}
          </div>
          <p className="care__label">Feed every</p>
          <div className="ndetail__chips" role="radiogroup" aria-label="Feed every">
            {FEED_CHOICES.map((d) => {
              const cur = tasksOf(pl, plant).find((t) => t.kind === "feed")?.everyDays ?? 0;
              return <button key={d} role="radio" aria-checked={cur === d} className={`chip ${cur === d ? "is-on" : ""}`} onClick={() => (d === 0 ? setEvery(pl.plantId, "feed", 0) : setEvery(pl.plantId, "feed", d))}>{d === 0 ? "Don't feed" : `${d} days`}</button>;
            })}
          </div>
          <p className="care__hint">These are typical rhythms for plants in pots. Weather, pot size and season change what a plant needs, so let the soil decide.</p>
        </section>
        <section>
          <h3>Journal</h3>
          <form className="care__note" onSubmit={(e) => { e.preventDefault(); addEntry(pl.plantId, "note", note); setNote(""); }}>
            <input value={note} maxLength={500} onChange={(e) => setNote(e.target.value)} placeholder="A note: first flowers, pests, a good spot…" aria-label="Add a note" />
            <button className="btn btn--secondary btn--small" disabled={!note.trim()}>Add</button>
          </form>
          <button className="btn btn--primary btn--small" onClick={() => addEntry(pl.plantId, "harvest", note.trim())}><Icon name="leaf" size={16} /> I harvested</button>
          {(pl.journal ?? []).length > 0 && (
            <ul className="care__journal">
              {pl.journal!.map((j, i) => <li key={`${j.date}-${i}`}><small>{j.date}{j.kind === "harvest" ? " · harvest" : ""}</small><span>{j.text || (j.kind === "harvest" ? "Harvested" : "")}</span></li>)}
            </ul>
          )}
        </section>
        <button className="btn btn--secondary btn--small" onClick={() => { plant.custom ? removeCustom(pl.plantId) : remove(pl.plantId); onClose(); }}><Icon name="trash" size={16} /> Stop tracking {plant.name}</button>
      </div>
    </article>
  ) : null;
  return <Sheet open={!!body} onClose={onClose} label={plant?.name ?? ""}>{body}</Sheet>;
}

const KINDS: Array<[CustomPlant["kind"], string]> = [["flower", "Flower"], ["herb", "Herb"], ["vegetable", "Vegetable"], ["fruit", "Fruit"], ["houseplant", "Houseplant"], ["tree", "Tree or shrub"], ["other", "Other"]];

/** Add any plant that isn't on our list: a rose, a fern, a lemon tree. */
export function AddPlantSheet({ open, onClose, onAdded }: { open: boolean; onClose(): void; onAdded(id: string): void }) {
  const { addCustom, plant } = useGarden();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<CustomPlant["kind"]>("flower");
  const [water, setWater] = useState(4);
  const [feed, setFeed] = useState(0);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const c = addCustom({ name, kind, waterDays: water, feedDays: feed || undefined });
    plant(c.id);
    setName("");
    onAdded(c.id);
    onClose();
  };
  return (
    <Sheet open={open} onClose={onClose} label="Add your own plant">
      <form className="addplant" onSubmit={submit}>
        <h2>Add your own plant</h2>
        <p className="rooted__lead">Anything you grow that isn't on our list. We'll set reminders at the rhythm you choose.</p>
        <label className="care__label" htmlFor="ap-name">Name</label>
        <input id="ap-name" value={name} maxLength={40} onChange={(e) => setName(e.target.value)} placeholder="Rose by the gate, Lemon tree, Fern…" autoFocus />
        <p className="care__label">What kind of plant?</p>
        <div className="ndetail__chips" role="radiogroup" aria-label="Kind of plant">{KINDS.map(([k, l]) => <button type="button" key={k} role="radio" aria-checked={kind === k} className={`chip ${kind === k ? "is-on" : ""}`} onClick={() => setKind(k)}>{l}</button>)}</div>
        <p className="care__label">Check water every</p>
        <div className="ndetail__chips" role="radiogroup" aria-label="Check water every">{WATER_CHOICES.map((d) => <button type="button" key={d} role="radio" aria-checked={water === d} className={`chip ${water === d ? "is-on" : ""}`} onClick={() => setWater(d)}>{d === 1 ? "Daily" : `${d} days`}</button>)}</div>
        <p className="care__label">Feed every</p>
        <div className="ndetail__chips" role="radiogroup" aria-label="Feed every">{FEED_CHOICES.map((d) => <button type="button" key={d} role="radio" aria-checked={feed === d} className={`chip ${feed === d ? "is-on" : ""}`} onClick={() => setFeed(d)}>{d === 0 ? "Don't feed" : `${d} days`}</button>)}</div>
        <p className="care__hint">Not sure? Check the plant's tag or an extension-service guide for how often it needs water. You can change this any time.</p>
        <button className="btn btn--primary" disabled={!name.trim()}><Icon name="plus" size={18} /> Add to My garden</button>
      </form>
    </Sheet>
  );
}

export type { Planting, TaskKind };
