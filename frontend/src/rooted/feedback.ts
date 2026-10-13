/**
 * Feedback from inside the app. With the API it posts one short message
 * (kind, text, the screen's route, and a reply address only if the person
 * types one). Nothing identifies the account or device. Without the API (the
 * shareable preview) the message goes through the phone's share sheet, so it
 * can be texted or emailed to whoever shared the link.
 */
import { create } from "zustand";
import { api, apiEnabled } from "../api/client";
import { APP_NAME } from "../brand";

export const FEEDBACK_KINDS = [
  { id: "confusing", label: "Something confused me" },
  { id: "bug", label: "Something didn't work" },
  { id: "idea", label: "I have an idea" },
  { id: "love", label: "I loved something" },
  { id: "rating", label: "A scanner rating looks wrong" },
] as const;
export type FeedbackKind = (typeof FEEDBACK_KINDS)[number]["id"];

export const MAX_FEEDBACK = 2000;

export interface FeedbackPrefill {
  kind?: FeedbackKind;
  message?: string;
}

export const useFeedback = create<{ open: boolean; prefill: FeedbackPrefill | null; show(prefill?: FeedbackPrefill): void; hide(): void }>((set) => ({
  open: false,
  prefill: null,
  show: (prefill) => set({ open: true, prefill: prefill ?? null }),
  hide: () => set({ open: false }),
}));

export interface FeedbackInput {
  kind: FeedbackKind;
  message: string;
  page: string;
  contact?: string;
}

export type FeedbackResult = "sent" | "shared" | "copied" | "failed";

export function composeText(f: FeedbackInput): string {
  const label = FEEDBACK_KINDS.find((k) => k.id === f.kind)?.label ?? f.kind;
  return `${APP_NAME} feedback: ${label}\n\n${f.message.trim()}\n\nScreen: ${f.page || "/"}`;
}

export async function sendFeedback(f: FeedbackInput): Promise<FeedbackResult> {
  const message = f.message.trim().slice(0, MAX_FEEDBACK);
  if (!message) return "failed";
  if (apiEnabled) {
    try {
      await api("/feedback", { method: "POST", body: { kind: f.kind, message, page: f.page.split("?")[0].slice(0, 120), contact: f.contact?.trim() || undefined } });
      return "sent";
    } catch {
      return "failed";
    }
  }
  const text = composeText({ ...f, message });
  try {
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      await navigator.share({ text });
      return "shared";
    }
  } catch (e) {
    // The person closed the share sheet: nothing was sent, and that's fine.
    if ((e as { name?: string })?.name === "AbortError") return "failed";
  }
  try {
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed";
  }
}
