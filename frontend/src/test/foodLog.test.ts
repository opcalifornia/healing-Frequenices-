import { beforeEach, describe, expect, it } from "vitest";
import { FOOD_GROUPS, groupCount, lastDays, mealsLogged, uniquePlants } from "../rooted/foodLog";
import { useFoodLog } from "../store/foodLog";
import { useUser } from "../store/user";

describe("food log logic", () => {
  it("lists the last seven days oldest first, across a month end", () => {
    const days = lastDays(new Date(2026, 10, 2));
    expect(days).toHaveLength(7);
    expect(days[0]).toBe("2026-10-27");
    expect(days[6]).toBe("2026-11-02");
  });
  it("counts different plants once, ignoring case, across days", () => {
    const logs = { a: { plants: ["Spinach", "Oats"] }, b: { plants: ["spinach", "Lentils"] } };
    expect(uniquePlants(logs, ["a", "b"]).sort()).toEqual(["Lentils", "Oats", "Spinach"]);
    expect(uniquePlants(logs, ["a"])).toEqual(["Spinach", "Oats"]);
  });
  it("counts known food groups only", () => {
    expect(groupCount({ groups: ["veg", "fruit", "made-up"] })).toBe(2);
    expect(groupCount(undefined)).toBe(0);
    expect(FOOD_GROUPS).toHaveLength(8);
  });
  it("counts planned meals eaten and extras together", () => {
    expect(mealsLogged({ eaten: ["lunch"], extras: [{ id: "1", slot: "dinner", text: "Soup" }] })).toBe(2);
  });
});

describe("food log store", () => {
  beforeEach(() => {
    useUser.setState({ activeProfileId: "t1" } as never);
    useFoodLog.setState({ logs: {} });
  });
  it("toggles eaten meals, groups and plants for a day, without duplicates", () => {
    const s = useFoodLog.getState();
    s.toggleEaten("2026-10-20", "lunch");
    s.toggleGroup("2026-10-20", "veg");
    s.addPlant("2026-10-20", "Kale");
    s.addPlant("2026-10-20", " kale ");
    s.addPlant("2026-10-20", "");
    s.addExtra("2026-10-20", "dinner", "  Toast  ");
    const d = useFoodLog.getState().logs.t1["2026-10-20"];
    expect(d.eaten).toEqual(["lunch"]);
    expect(d.groups).toEqual(["veg"]);
    expect(d.plants).toEqual(["Kale"]);
    expect(d.extras?.[0].text).toBe("Toast");
    s.toggleEaten("2026-10-20", "lunch");
    s.toggleGroup("2026-10-20", "veg");
    s.removePlant("2026-10-20", "Kale");
    s.removeExtra("2026-10-20", d.extras![0].id);
    expect(useFoodLog.getState().logs.t1["2026-10-20"]).toEqual({ eaten: [], groups: [], plants: [], extras: [] });
  });
  it("keeps each profile's log separate", () => {
    useFoodLog.getState().toggleGroup("2026-10-20", "fruit");
    useUser.setState({ activeProfileId: "t2" } as never);
    expect(useFoodLog.getState().logs.t2).toBeUndefined();
  });
});
