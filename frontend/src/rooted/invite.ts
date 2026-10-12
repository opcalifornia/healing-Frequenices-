import { appLink } from "./calendarIcs";

/**
 * "Join me" invite links. A link carries only what's needed to welcome a
 * friend: which program, an optional first name, and an optional invite code
 * so sign-ups can be counted. No health data ever goes in a link.
 */

export interface Invite {
  /** Program id to join, if any. */
  p?: string;
  /** Inviter's first name, only if they chose to include it. */
  from?: string;
  /** Inviter's account invite code, for counting sign-ups. */
  ref?: string;
}

const KEY = "rooted-invite";
const SAFE = /^[A-Za-z0-9_-]{1,40}$/;

/** Clean an invite read from a URL or storage: drop anything unexpected. */
export function cleanInvite(raw: Record<string, unknown>): Invite {
  const out: Invite = {};
  if (typeof raw.p === "string" && SAFE.test(raw.p)) out.p = raw.p;
  if (typeof raw.ref === "string" && /^[A-Za-z0-9_-]{4,16}$/.test(raw.ref)) out.ref = raw.ref;
  if (typeof raw.from === "string") {
    const name = raw.from.replace(/[^\p{L}\p{M} .'-]/gu, "").trim().slice(0, 24);
    if (name) out.from = name;
  }
  return out;
}

export function invitePath(inv: Invite): string {
  const q = new URLSearchParams();
  if (inv.p) q.set("p", inv.p);
  if (inv.from) q.set("from", inv.from);
  if (inv.ref) q.set("ref", inv.ref);
  const qs = q.toString();
  return `/join${qs ? `?${qs}` : ""}`;
}

export function inviteLink(inv: Invite): string {
  return appLink(invitePath(inv));
}

export function savePendingInvite(inv: Invite) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...inv, at: Date.now() }));
  } catch {
    /* storage blocked: the invite still works on this page */
  }
}

/** The invite someone arrived with, if it's less than 30 days old. */
export function pendingInvite(): Invite | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!raw || Date.now() - (raw.at ?? 0) > 30 * 864e5) return null;
    return cleanInvite(raw);
  } catch {
    return null;
  }
}

export function clearPendingInvite() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export function inviteMessage(programTitle: string | undefined, link: string): string {
  return programTitle
    ? `Want to do ${programTitle} with me on Rooted? A few minutes a day. ${link}`
    : `I've been using Rooted for small, proven habits for body and mind. Join me: ${link}`;
}
