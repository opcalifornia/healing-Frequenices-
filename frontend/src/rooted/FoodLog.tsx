import { useState } from "react";
import { Icon } from "../components/Icon";
import { Evidence, SourceLink } from "./ui";
import { FOOD_GROUPS, PLANT_SOURCES, groupCount, lastDays, mealsLogged, uniquePlants } from "./foodLog";
import { keyOf, recipeById } from "./mealPlan";
import { SLOTS, SLOT_LABEL, useMyPlan, type Slot } from "../store/mealPlan";
import { useFoodLog, useMyLog } from "../store/foodLog";
import { useAbout } from "../store/wellness";

const PLANT_IDEAS = ["Spinach", "Oats", "Lentils", "Blueberries", "Chickpeas", "Almonds", "Broccoli", "Carrot", "Garlic", "Brown rice"];

/**
 * Today's food log. It is about what showed up, not how much: tick the meals you had, the food groups, and the
 * plants. No calories, portions or targets, and a gentler view for anyone who has told us they have a history of disordered eating.
 */
export function FoodLogToday() {
  const logs = useMyLog();
  const plan = useMyPlan();
  const about = useAbout();
  const gentle = about.considerations.includes("eating");
  const { toggleEaten, addExtra, removeExtra, toggleGroup, addPlant, removePlant } = useFoodLog.getState();

  const [back, setBack] = useState(0); // days before today, 0 to 6
  const today = new Date();
  const dayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - back);
  const day = keyOf(dayDate);
  const log = logs[day] ?? {};
  const [text, setText] = useState<Partial<Record<Slot, string>>>({});
  const [plant, setPlant] = useState("");

  const week = lastDays(today);
  const weekPlants = uniquePlants(logs, week);
  const groups = groupCount(log);
  const heading = back === 0 ? "Today" : back === 1 ? "Yesterday" : dayDate.toLocaleDateString(undefined, { weekday: "long" });

  const add = (slot: Slot) => {
    const t = (text[slot] ?? "").trim();
    if (!t) return;
    addExtra(day, slot, t);
    setText((x) => ({ ...x, [slot]: "" }));
  };

  return (
    <div className="fl">
      <div className="mp__bar">
        <button className="mp__nav" onClick={() => setBack((b) => Math.min(6, b + 1))} disabled={back >= 6} aria-label="Earlier day"><Icon name="chevronLeft" size={20} /></button>
        <div className="mp__week">
          <strong>{heading}</strong>
          <small>{dayDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })} · {mealsLogged(log)} meal{mealsLogged(log) === 1 ? "" : "s"} logged</small>
        </div>
        <button className="mp__nav" onClick={() => setBack((b) => Math.max(0, b - 1))} disabled={back === 0} aria-label="Later day"><Icon name="chevronRight" size={20} /></button>
      </div>

      <ul className="fl__meals">
        {SLOTS.map((s) => {
          const planned = recipeById(plan[day]?.[s]?.recipeId);
          const note = plan[day]?.[s]?.text;
          const eaten = log.eaten?.includes(s);
          const extras = (log.extras ?? []).filter((e) => e.slot === s);
          return (
            <li key={s} className="r-card fl__meal">
              <header><strong>{SLOT_LABEL[s]}</strong></header>
              {(planned || note) && (
                <button className={`rdetail__check ${eaten ? "is-done" : ""}`} aria-pressed={!!eaten} onClick={() => toggleEaten(day, s)} aria-label={`${planned?.title ?? note}: ${eaten ? "eaten" : "mark as eaten"}`}>
                  <span className="slist__check">{eaten && <Icon name="check" size={16} />}</span>
                  <span className="rdetail__name">{planned?.title ?? note}</span>
                  <span className="rdetail__amt">planned</span>
                </button>
              )}
              {extras.map((e) => (
                <div key={e.id} className="fl__extra"><span>{e.text}</span><button className="icon-btn" onClick={() => removeExtra(day, e.id)} aria-label={`Remove ${e.text}`}><Icon name="close" size={16} /></button></div>
              ))}
              <form className="fl__add" onSubmit={(e) => { e.preventDefault(); add(s); }}>
                <input value={text[s] ?? ""} onChange={(e) => setText((x) => ({ ...x, [s]: e.target.value }))} placeholder={planned || note ? "Something else you had" : "What did you have?"} maxLength={80} autoComplete="off" aria-label={`${SLOT_LABEL[s]}: what did you have`} />
                <button className="btn btn--secondary btn--small" type="submit" disabled={!(text[s] ?? "").trim()}>Add</button>
              </form>
            </li>
          );
        })}
      </ul>

      <div className="r-card fl__groups">
        <h3>Which food groups showed up?</h3>
        <p className="mp__hint">Tap what you've had. It's a nudge toward variety, not something to complete.</p>
        <div className="recipes__chips fl__chips" role="group" aria-label="Food groups">
          {FOOD_GROUPS.map((g) => (
            <button key={g.id} className={`chip ${log.groups?.includes(g.id) ? "is-on" : ""}`} aria-pressed={!!log.groups?.includes(g.id)} onClick={() => toggleGroup(day, g.id)}>{g.emoji} {g.label}</button>
          ))}
        </div>
        {!gentle && <p className="fl__count">{groups === 0 ? "Nothing ticked yet." : `${groups} of ${FOOD_GROUPS.length} groups ${back === 0 ? "so far today" : "that day"}.`}</p>}
      </div>

      {!gentle && (
        <div className="r-card fl__plants">
          <h3>Different plants this week <span className="fl__total">{weekPlants.length}</span></h3>
          <form className="fl__add" onSubmit={(e) => { e.preventDefault(); if (plant.trim()) { addPlant(day, plant); setPlant(""); } }}>
            <input value={plant} onChange={(e) => setPlant(e.target.value)} placeholder="A plant you ate (spinach, oats…)" maxLength={40} autoComplete="off" aria-label="Add a plant you ate" list="plant-ideas" />
            <datalist id="plant-ideas">{PLANT_IDEAS.map((p) => <option key={p} value={p} />)}</datalist>
            <button className="btn btn--secondary btn--small" type="submit" disabled={!plant.trim()}>Add</button>
          </form>
          {(log.plants?.length ?? 0) > 0 && (
            <div className="recipes__chips fl__chips" aria-label={`Plants on ${heading}`}>
              {log.plants!.map((p) => <button key={p} className="chip is-on" onClick={() => removePlant(day, p)} aria-label={`Remove ${p}`}>{p} ✕</button>)}
            </div>
          )}
          <p className="mp__hint">Counts each plant once across the last seven days. Fruit, vegetables, grains, beans, nuts, seeds, herbs and spices all count.</p>
          <details className="fl__why">
            <summary>Why variety? <Evidence s={PLANT_SOURCES.evidence} short /></summary>
            <p>{PLANT_SOURCES.summary}</p>
            <p className="nourish__src">{PLANT_SOURCES.sources.map((s) => <SourceLink key={s.url} s={s} />)}</p>
          </details>
        </div>
      )}

      {!gentle && (
        <div className="r-card fl__week">
          <h3>The last seven days</h3>
          <ul className="fl__dots">
            {week.map((d) => {
              const n = groupCount(logs[d]);
              const date = new Date(`${d}T12:00:00`);
              return (
                <li key={d} aria-label={`${date.toLocaleDateString(undefined, { weekday: "long" })}: ${n} food groups, ${mealsLogged(logs[d])} meals logged`}>
                  <span className="fl__bar"><i style={{ height: `${(n / FOOD_GROUPS.length) * 100}%` }} /></span>
                  <small>{date.toLocaleDateString(undefined, { weekday: "narrow" })}</small>
                </li>
              );
            })}
          </ul>
          <p className="mp__hint">Taller bars mean more food groups that day. Quiet days are normal.</p>
        </div>
      )}
      {gentle && <p className="for-you"><span><strong>Based on your profile:</strong> this log leaves out counts and weekly charts. It's just a place to jot down what you ate, and skipping it is always fine.</span></p>}
    </div>
  );
}
