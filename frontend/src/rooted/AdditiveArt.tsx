import type { ReactNode } from "react";

/**
 * Small line icons for the additive pages: one for what an additive is for, and one for
 * each kind of research concern. Drawn on a 24 x 24 grid, stroke only, so they follow the
 * text colour.
 */
const P = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

const ICONS: Record<string, ReactNode> = {
  colour: (<><circle cx="9" cy="9" r="5" /><circle cx="15" cy="9" r="5" /><circle cx="12" cy="15" r="5" /></>),
  preservative: (<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></>),
  sweetener: (<><path d="M12 3l8 4v8l-8 4-8-4V7l8-4Z" /><path d="M4 7l8 4 8-4M12 11v8" /></>),
  emulsifier: (<><path d="M8 3c2 3 4 5 4 8a4 4 0 0 1-8 0c0-3 2-5 4-8Z" /><path d="M16 9c1.6 2.4 3 4 3 6.2a3 3 0 0 1-6 0c0-2.2 1.4-3.8 3-6.2Z" /></>),
  thickener: (<><path d="M3 8c3-3 6 3 9 0s6 3 9 0" /><path d="M3 13c3-3 6 3 9 0s6 3 9 0" /><path d="M3 18c3-3 6 3 9 0s6 3 9 0" /></>),
  antioxidant: (<><path d="M5 19c0-8 4-13 14-14 0 10-5 14-13 14" /><path d="M5 19c2-5 5-8 9-10" /></>),
  acid: (<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /><path d="M8 15h8" /></>),
  flavour: (<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" /><path d="M18 17l.8 2.2L21 20l-2.2.8L18 23l-.8-2.2L15 20l2.2-.8L18 17Z" /></>),
  raising: (<><circle cx="8" cy="15" r="3" /><circle cx="15" cy="17" r="2" /><circle cx="14" cy="9" r="3" /><circle cx="8" cy="6" r="1.5" /></>),
  anticaking: (<><circle cx="7" cy="8" r="1.4" /><circle cx="12" cy="6" r="1.4" /><circle cx="17" cy="8" r="1.4" /><circle cx="9" cy="13" r="1.4" /><circle cx="15" cy="13" r="1.4" /><circle cx="7" cy="18" r="1.4" /><circle cx="12" cy="17" r="1.4" /><circle cx="17" cy="18" r="1.4" /></>),
  glaze: (<><path d="M4 15c2-6 6-9 12-9 2 0 4 .5 4 .5S19 16 12 18c-3 1-6 .5-8-3Z" /><path d="M9 11c1.5-1.5 3-2 5-2" /></>),
  flour: (<><path d="M12 21V8M12 12c-3 0-4-2-4-4 3 0 4 2 4 4ZM12 12c3 0 4-2 4-4-3 0-4 2-4 4ZM12 17c-3 0-4-2-4-4 3 0 4 2 4 4ZM12 17c3 0 4-2 4-4-3 0-4 2-4 4ZM12 8c-1.5-1-1.5-3 0-5 1.5 2 1.5 4 0 5Z" /></>),
  gas: (<><circle cx="8" cy="15" r="3.5" /><circle cx="16" cy="9" r="3" /><circle cx="15" cy="17" r="2" /><circle cx="7" cy="6" r="1.5" /></>),
  bulk: (<><path d="M4 9l8-4 8 4-8 4-8-4Z" /><path d="M4 9v6l8 4 8-4V9M12 13v6" /></>),
  default: (<><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 1.8 3h10.4a2 2 0 0 0 1.8-3l-5-9V3" /></>),
  fat: (<><path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11Z" /><path d="M9 15a3 3 0 0 0 3 3" /></>),
  gap: (<><circle cx="12" cy="12" r="9" strokeDasharray="3 3" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>),
  // concerns
  dna: (<><path d="M7 3c0 6 10 6 10 12s-10 6-10 6M17 3c0 6-10 6-10 12" /><path d="M8 7h8M8 17h8" /></>),
  immune: (<><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" /><circle cx="12" cy="11" r="2.6" /><path d="M12 6.5v1.4M12 14.1v1.4M7.5 11h1.4M15.1 11h1.4" /></>),
  child: (<><circle cx="12" cy="12" r="9" /><path d="M9 10h.01M15 10h.01M9 15c1.2 1.2 4.8 1.2 6 0" /></>),
  heart: (<><path d="M12 20s-8-4.8-8-10.4A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8 2.6C20 15.2 12 20 12 20Z" /></>),
  gut: (<><path d="M8 4c-3 0-3 5 0 5h8c4 0 4 6 0 6H9c-3 0-3 5 1 5h5" /></>),
  breath: (<><path d="M4 9h9a2.5 2.5 0 1 0-2.5-2.5M4 14h13a2.5 2.5 0 1 1-2.5 2.5M4 19h6" /></>),
  flag: (<><path d="M6 21V4M6 5h11l-2 4 2 4H6" /></>),
  benzene: (<><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9L12 3Z" /><path d="M12 8l3.8 2.2v4.4L12 16.8l-3.8-2.2v-4.4L12 8Z" /></>),
  gauge: (<><path d="M4 17a8 8 0 1 1 16 0" /><path d="M12 17l4-6" /><circle cx="12" cy="17" r="1" /></>),
  kidney: (<><path d="M9 4c-4 0-5 5-5 8s2 8 6 8c3 0 3-3 2-4-1-2 1-3 2-4 1-2-1-3-2-4-1-2-1-4-3-4Z" /></>),
  alert: (<><path d="M12 3l10 18H2L12 3Z" /><path d="M12 10v5M12 18h.01" /></>),
  info: (<><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>),
  check: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.7 2.7L16 9.5" /></>),
};

const icon = (k: string) => ICONS[k] ?? ICONS.default;

/** What an additive is for, in plain words, from its "kind" label. */
const FUNCTIONS: Array<{ re: RegExp; key: string; does: string }> = [
  { re: /colou?r/i, key: "colour", does: "Adds colour, or brings back colour that is lost in making or storing the food." },
  { re: /sweeten/i, key: "sweetener", does: "Makes food taste sweet, usually with less sugar or fewer calories." },
  { re: /emulsif/i, key: "emulsifier", does: "Keeps ingredients that normally separate, like oil and water, mixed together." },
  { re: /antioxid/i, key: "antioxidant", does: "Slows the changes that make fats and oils go off, so food keeps longer." },
  { re: /preserv/i, key: "preservative", does: "Slows spoilage from bacteria, yeast and mould, so food keeps longer." },
  { re: /thicken|gelling|stabili/i, key: "thickener", does: "Thickens, gels or steadies the texture so a food stays smooth." },
  { re: /acid/i, key: "acid", does: "Adjusts how sour or acidic a food is, which affects taste and keeping time." },
  { re: /flavour/i, key: "flavour", does: "Boosts the savoury or other flavours already in the food." },
  { re: /raising/i, key: "raising", does: "Releases gas as food bakes, so breads and cakes rise." },
  { re: /glaz|foam/i, key: "glaze", does: "Gives food a shiny, protective coating, or stops foam forming while it is made." },
  { re: /flour|dough/i, key: "flour", does: "Improves how dough rises and holds together, so bread and baked goods turn out the same every time." },
  { re: /gas|propellant/i, key: "gas", does: "A gas that pushes food out of a can, or protects food inside its packaging." },
  { re: /\bfat\b|\boil\b/i, key: "fat", does: "A cooking fat or oil used for texture, frying and keeping qualities." },
  { re: /bulking|carrier|solvent|humectant|chewing gum|firming|alkali|coating|binding|clarif/i, key: "bulk", does: "Adds body or bulk, carries other ingredients, or helps keep food moist." },
  { re: /anti-?caking/i, key: "anticaking", does: "Keeps powders and granules free-flowing instead of clumping." },
];

export function functionInfo(kind: string): { key: string; label: string; does: string } {
  const f = FUNCTIONS.find((x) => x.re.test(kind));
  return { key: f?.key ?? "default", label: kind, does: f?.does ?? "Used in food for a technical purpose, such as texture, shelf life or appearance." };
}

export function FunctionIcon({ kind }: { kind: string }) {
  return <P>{icon(functionInfo(kind).key)}</P>;
}

/** Pick the icon for a concern tag by what it is about. */
const RISKS: Array<[RegExp, string]> = [
  [/dna|genotox|carcinogen|cancer/i, "dna"],
  [/immune/i, "immune"],
  [/child|behaviou?r|label warning/i, "child"],
  [/heart|cardio/i, "heart"],
  [/gut|inflam/i, "gut"],
  [/sensitiv|allerg|asthma/i, "breath"],
  [/benzene/i, "benzene"],
  [/regulator|withdrawn|removed|restrict|revoked|lower safe/i, "flag"],
  [/intake|guideline|limit|exceed|margin/i, "gauge"],
  [/kidney/i, "kidney"],
  [/pku|phenyl/i, "alert"],
  [/diabet|blood sugar|weight|glucose/i, "gauge"],
  [/digest|bowel|laxative|stool/i, "gut"],
  [/uric|gout/i, "kidney"],
  [/tumou?r|lung|liver|nitrosamine/i, "dna"],
  [/dog|hormone|thyroid|reproduc|testis|choking|aluminium|aluminum|build-up/i, "alert"],
  [/infant/i, "child"],
  [/nitrite|sorbate|cell damage|lab test/i, "dna"],
  [/emulsifier/i, "gut"],
  [/clotting/i, "heart"],
  [/allergen/i, "breath"],
  [/glutamate|contaminant|3-mcpd/i, "alert"],
  [/data gap|gaps|could not be assessed|not established|impurit|nano|different substance|limited/i, "gap"],
];

export function riskKey(topic: string): string {
  return RISKS.find(([re]) => re.test(topic))?.[1] ?? "info";
}

export function RiskIcon({ topic }: { topic: string }) {
  return <P>{icon(riskKey(topic))}</P>;
}

export function CheckIcon() {
  return <P>{icon("check")}</P>;
}
