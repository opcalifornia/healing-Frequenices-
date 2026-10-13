/**
 * People sometimes search with words the app avoids showing back to them.
 * "calm down" is often something people are told when they're upset, so we
 * never repeat it. We quietly search for relaxing content instead.
 */
const SOFT_TRIGGERS = /\b(calm(?:ing|er|est|ly|ness)?(?:\s+down)?|chill(?:\s+out)?|settle\s+down|cool\s+off)\b/gi;

export interface SearchTerm {
  /** What to actually search for. */
  query: string;
  /** True when we swapped a word, so the page shouldn't echo what was typed. */
  softened: boolean;
}

export function effectiveSearch(raw: string): SearchTerm {
  const q = raw.trim();
  if (!q || !SOFT_TRIGGERS.test(q)) {
    SOFT_TRIGGERS.lastIndex = 0;
    return { query: q, softened: false };
  }
  SOFT_TRIGGERS.lastIndex = 0;
  const swapped = q.replace(SOFT_TRIGGERS, "relax").replace(/\s+/g, " ").trim();
  return { query: swapped, softened: true };
}
