import type { LearnData } from "../BreatheLearnHub";
import { BRAIN_GLOSSARY, BRAIN_LESSONS } from "./brain";
import { EXPERTS, SOCIETIES } from "./experts";
import { LUNG_GLOSSARY, LUNG_LESSONS } from "./lungs";
import { BREATH_MYTHS, PRACTICE_GLOSSARY, PRACTICE_LESSONS } from "./practice";

/** Reading order: start with the lungs, then the brain, then putting it into practice. Within each, easiest first. */
const ORDER = { "Start here": 0, "Go deeper": 1, Expert: 2 } as const;
const sorted = (xs: typeof LUNG_LESSONS) => [...xs].sort((a, b) => ORDER[a.level] - ORDER[b.level]);

export const LEARN_DATA: LearnData = {
  lessons: [...sorted(LUNG_LESSONS), ...sorted(BRAIN_LESSONS), ...sorted(PRACTICE_LESSONS)],
  experts: EXPERTS,
  societies: SOCIETIES,
  myths: BREATH_MYTHS,
  glossary: [...LUNG_GLOSSARY, ...BRAIN_GLOSSARY, ...PRACTICE_GLOSSARY].filter((g, i, a) => a.findIndex((x) => x.term.toLowerCase() === g.term.toLowerCase()) === i),
};
