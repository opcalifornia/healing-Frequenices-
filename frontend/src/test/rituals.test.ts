import { describe, expect, it, vi } from "vitest";
import { RITUALS, RITUAL_DISCLAIMER, PLAYER_WARNING } from "../rooted/rituals";
import { arcLength, circadianArcs, computeSchedule, lastSeven, ritualNow, sessionAt, sessionIsConsistent, shiftDay, streak, toMin, type RitualLog } from "../rooted/ritualLogic";

describe("ritual content", () => {
  it("has the three rituals in order", () => {
    expect(RITUALS.map((r) => r.id)).toEqual(["revive", "calm", "unwind"]);
    expect(RITUALS.map((r) => r.timeOfDay)).toEqual(["morning", "afternoon", "night"]);
  });
  it("has the exact required hertz values", () => {
    const [rev, calm, unw] = RITUALS.map((r) => r.session);
    expect([rev.beatHz.start, rev.beatHz.end, rev.leftHz, rev.rightHz.start, rev.rightHz.end]).toEqual([18, 40, 200, 218, 240]);
    expect([calm.beatHz.start, calm.beatHz.end, calm.leftHz, calm.rightHz.start]).toEqual([10, 10, 200, 210]);
    expect([unw.beatHz.start, unw.beatHz.end, unw.leftHz, unw.rightHz.start, unw.rightHz.end, unw.fadeOutMin]).toEqual([6, 2, 150, 156, 152, 5]);
    for (const r of RITUALS) expect(sessionIsConsistent(r.session), r.id).toBe(true);
  });
  it("keeps session lengths inside the stated ranges", () => {
    for (const r of RITUALS) {
      expect(r.session.durationOptions).toContain(r.session.durationMin);
      for (const d of r.session.durationOptions) expect(d).toBeGreaterThan(r.session.fadeOutMin);
    }
    expect(Math.min(...RITUALS[0].session.durationOptions)).toBe(15);
    expect(Math.max(...RITUALS[2].session.durationOptions)).toBe(45);
  });
  it("only pairs ingredients with other ingredients in the same recipe", () => {
    for (const r of RITUALS) {
      const names = new Set(r.recipe.ingredients.map((i) => i.name));
      for (const i of r.recipe.ingredients) {
        expect(i.pairsWith.length, `${r.id}/${i.name}`).toBeGreaterThan(0);
        for (const p of i.pairsWith) {
          expect(names.has(p.name), `${r.id}/${i.name} pairs with unknown "${p.name}"`).toBe(true);
          expect(p.name).not.toBe(i.name);
          expect(p.why.length).toBeGreaterThan(10);
        }
      }
    }
  });
  it("lists the required cautions", () => {
    const text = (id: string) => RITUALS.find((r) => r.id === id)!.cautions.join(" ").toLowerCase();
    expect(text("revive")).toMatch(/ginseng[^.]*interact/);
    expect(text("revive")).toMatch(/caffeine/);
    expect(text("revive")).toMatch(/dilute/);
    expect(text("unwind")).toMatch(/valerian[\s\S]*alcohol/);
    expect(text("unwind")).toMatch(/driv/);
    expect(text("unwind")).toMatch(/passionflower[^.]*pregnan/);
    expect(text("unwind")).toMatch(/ragweed/);
  });
  it("uses wellness language only and shows the required disclaimers", () => {
    const all = JSON.stringify(RITUALS) + RITUAL_DISCLAIMER + PLAYER_WARNING;
    for (const bad of ["cures", "treats", "heals", "diagnose and", "miracle", "detox", "guarantee", "anxiety disorder", "insomnia"]) expect(all.toLowerCase(), bad).not.toContain(bad);
    expect(RITUAL_DISCLAIMER).toContain("have not been evaluated by the FDA");
    expect(RITUAL_DISCLAIMER).toContain("pregnant, nursing, on medication");
    expect(PLAYER_WARNING).toMatch(/driving/);
    expect(PLAYER_WARNING).toMatch(/seizure/);
    for (const r of RITUALS) for (const s of r.sources) expect(s.url).toMatch(/^https:\/\//);
  });
});

describe("schedule", () => {
  it("derives the three times from wake and bed", () => {
    expect(computeSchedule("07:00", "23:00")).toEqual({ revive: "07:00", calm: "13:30", unwind: "21:45" });
    expect(computeSchedule("06:00", "22:00").calm).toBe("12:30");
  });
  it("handles a bedtime after midnight and keeps Calm in the afternoon", () => {
    expect(computeSchedule("10:00", "01:00").unwind).toBe("23:45");
    expect(computeSchedule("10:00", "01:00").calm).toBe("16:00");
    expect(computeSchedule("04:00", "20:00").calm).toBe("12:00");
  });
  it("highlights the ritual that fits the time of day", () => {
    const t = computeSchedule("07:00", "23:00");
    expect(ritualNow(toMin("07:30"), t)).toBe("revive");
    expect(ritualNow(toMin("11:00"), t)).toBe("revive");
    expect(ritualNow(toMin("13:00"), t)).toBe("calm");
    expect(ritualNow(toMin("16:00"), t)).toBe("calm");
    expect(ritualNow(toMin("21:30"), t)).toBe("unwind");
    expect(ritualNow(toMin("23:30"), t)).toBe("unwind");
    expect(ritualNow(toMin("02:00"), t)).toBe("unwind");
  });
});

describe("session ramp", () => {
  it("moves the beat and the right ear in a straight line", () => {
    const rev = RITUALS[0].session;
    expect(sessionAt(rev, 0)).toEqual({ beat: 18, left: 200, right: 218 });
    expect(sessionAt(rev, 0.5)).toEqual({ beat: 29, left: 200, right: 229 });
    expect(sessionAt(rev, 1)).toEqual({ beat: 40, left: 200, right: 240 });
    const unw = RITUALS[2].session;
    expect(sessionAt(unw, 1)).toEqual({ beat: 2, left: 150, right: 152 });
    expect(sessionAt(unw, 2).beat).toBe(2);
  });
});

describe("tracking", () => {
  const today = "2026-10-22";
  it("counts a streak and does not break it until a whole day is missed", () => {
    const log: RitualLog = {
      [shiftDay(today, -1)]: { revive: { drink: true } },
      [shiftDay(today, -2)]: { unwind: { session: true } },
      [shiftDay(today, -4)]: { revive: { drink: true } },
    };
    expect(streak(log, today)).toBe(2);
    log[today] = { calm: { session: true } };
    expect(streak(log, today)).toBe(3);
    expect(streak({}, today)).toBe(0);
    expect(streak({ [shiftDay(today, -2)]: { revive: { drink: true } } }, today)).toBe(0);
  });
  it("builds a seven-day history ending today", () => {
    const h = lastSeven({ [today]: { revive: { drink: true, session: true } } }, today, ["revive", "calm", "unwind"]);
    expect(h).toHaveLength(7);
    expect(h[6].day).toBe(today);
    expect(h[0].day).toBe(shiftDay(today, -6));
    expect(h[6].rituals.revive).toEqual({ drink: true, session: true });
    expect(h[3].rituals.calm).toEqual({});
  });
});

describe("circadian clock", () => {
  it("gives every arc a sensible length and covers the required phases", () => {
    const arcs = circadianArcs("07:00", "23:00");
    for (const a of arcs) {
      expect(arcLength(a), a.id).toBeGreaterThan(0);
      expect(arcLength(a), a.id).toBeLessThan(1440);
    }
    expect(arcs.map((a) => a.id)).toEqual(expect.arrayContaining(["cortisol", "peak", "dip", "melatonin", "deep", "rem"]));
    expect(arcs.find((a) => a.id === "melatonin")!.start).toBe(toMin("21:00"));
  });
});

import { BinauralEngine } from "../audio/engine";
import { RitualAudio } from "../rooted/ritualAudio";
import { FakeContext, FakeGain, FakeNode, FakeOscillator } from "./fakeAudio";

describe("ritual audio", () => {
  function run(id: string, minutes: number) {
    const ritual = RITUALS.find((r) => r.id === id)!;
    const ctx = new FakeContext();
    const engine = new BinauralEngine(() => ctx as unknown as BaseAudioContext);
    const a = new RitualAudio(ritual, minutes * 60, ritual.session.fadeOutMin * 60, engine);
    a.start("pink", 0.6);
    return { ctx, engine, a, ritual };
  }
  const earOf = (osc: FakeOscillator): number | null => {
    let node: FakeNode = osc;
    for (let i = 0; i < 4; i++) {
      const c = node.connections[0];
      if (!c) return null;
      if (c.to instanceof FakeNode && c.to.kind === "merger") return c.input;
      if (!(c.to instanceof FakeGain)) return null;
      node = c.to;
    }
    return null;
  };

  it("sends the left carrier to the left ear and the right carrier to the right ear, and glides the right tone over the session", () => {
    const { ctx } = run("revive", 20);
    const ears = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && earOf(n) !== null);
    const left = ears.find((o) => earOf(o) === 0)!;
    const right = ears.find((o) => earOf(o) === 1)!;
    expect(left.frequency.target).toBe(200);
    expect(right.frequency.events[0]?.value ?? right.frequency.value).toBeDefined();
    expect(right.frequency.target).toBe(240);
    const last = right.frequency.events[right.frequency.events.length - 1];
    expect(last.type).toBe("ramp");
    expect(last.time).toBeCloseTo(20 * 60, 0);
  });
  it("glides Unwind down from 156 to 152 Hz in the right ear while the left stays at 150", () => {
    const { ctx } = run("unwind", 40);
    const ears = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && earOf(n) !== null);
    expect(ears.find((o) => earOf(o) === 0)!.frequency.target).toBe(150);
    expect(ears.find((o) => earOf(o) === 1)!.frequency.target).toBe(152);
  });
  it("keeps Calm steady at 200 and 210 Hz with no ramp over the session", () => {
    const { ctx } = run("calm", 20);
    const ears = ctx.nodes.filter((n): n is FakeOscillator => n instanceof FakeOscillator && earOf(n) !== null);
    const right = ears.find((o) => earOf(o) === 1)!;
    expect(right.frequency.target).toBe(210);
    expect(right.frequency.events.some((e) => e.type === "ramp" && e.time > 100)).toBe(false);
  });
  it("only starts the closing fade inside the fade window, following the time left", () => {
    const { a, engine } = run("unwind", 40);
    const fade = vi.spyOn(engine, "fadeTo");
    a.tick(40 * 60 - 10);
    expect(fade).not.toHaveBeenCalled();
    a.tick(150);
    expect(fade).toHaveBeenLastCalledWith(0.5, 1);
    a.tick(0);
    expect(fade).toHaveBeenLastCalledWith(0, 1);
  });
});
