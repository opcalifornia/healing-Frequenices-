import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api, apiEnabled } from "../api/client";
import { useActiveProfile, useUser } from "../store/user";
import { Icon } from "../components/Icon";
import { useToast } from "./ui";
import { clearPendingInvite, inviteLink, pendingInvite } from "./invite";
import { track } from "./metrics";
import type { Program } from "./programs";

/**
 * Circles: do a program together with a few friends or family. Members see
 * first names, days completed and cheers. Nothing else is shared.
 */

interface Member { id: string; name: string; daysDone: number; cheersToday: number; you: boolean }
interface Circle { id: string; name: string; programId: string; code: string; members: Member[] }

const realName = (n?: string) => (n && !["listener", "guest"].includes(n.toLowerCase()) ? n : "");

export function CirclePanel({ program }: { program: Program }) {
  const profile = useActiveProfile();
  const account = useUser((s) => s.account);
  const [circle, setCircle] = useState<Circle | null | undefined>(undefined);
  const [mode, setMode] = useState<"idle" | "create" | "join">("idle");
  const [name, setName] = useState(`${program.title} crew`);
  const [me, setMe] = useState(realName(profile?.name));
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cheered, setCheered] = useState<Record<string, true>>({});
  const toast = useToast();
  const signedIn = apiEnabled && !!account && !!profile;
  const pending = pendingInvite();
  const pendingCode = pending?.c && pending.p === program.id ? pending.c : undefined;

  const load = useCallback(async () => {
    if (!signedIn || !profile) return;
    try {
      const list = await api<Circle[]>(`/profiles/${profile.id}/circles`);
      setCircle(list.find((c) => c.programId === program.id) ?? null);
    } catch {
      setCircle(null);
    }
  }, [signedIn, profile, program.id]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { if (pendingCode) { setCode(pendingCode); setMode("join"); } }, [pendingCode]);

  const run = async (fn: () => Promise<Circle>) => {
    setBusy(true);
    setError(null);
    try {
      setCircle(await fn());
      setMode("idle");
      clearPendingInvite();
    } catch (e) {
      setError((e as Error).message || "Something went wrong. Try again.");
    }
    setBusy(false);
  };
  const create = () => run(() => api<Circle>(`/profiles/${profile!.id}/circles`, { method: "POST", body: { programId: program.id, name: name.trim(), displayName: me.trim() } }));
  const join = () => run(() => api<Circle>(`/profiles/${profile!.id}/circles/join`, { method: "POST", body: { code: code.trim().toLowerCase(), displayName: me.trim() } }));

  const cheer = async (m: Member) => {
    if (!circle || cheered[m.id]) return;
    setCheered((c) => ({ ...c, [m.id]: true }));
    await api(`/profiles/${profile!.id}/circles/${circle.id}/cheer`, { method: "POST", body: { to: m.id } }).catch(() => undefined);
    toast.show(`Cheer sent to ${m.name}`);
  };
  const leave = async () => {
    if (!circle || !confirm(`Leave ${circle.name}? You can rejoin with the code.`)) return;
    await api(`/profiles/${profile!.id}/circles/${circle.id}`, { method: "DELETE" }).catch(() => undefined);
    setCircle(null);
  };
  const share = async () => {
    if (!circle) return;
    const link = inviteLink({ p: program.id, c: circle.code, from: realName(profile?.name) || undefined });
    const text = `Join my circle for ${program.title} on Rooted. We'll do it together, a few minutes a day. ${link}`;
    track("invite_sent");
    if (navigator.share) {
      try { await navigator.share({ title: circle.name, text: text.replace(link, "").trim(), url: link }); return; } catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    try { await navigator.clipboard.writeText(text); toast.show("Invite copied"); } catch { toast.show(`Code: ${circle.code}`); }
  };

  return (
    <section className="r-card circle" aria-labelledby="circle-h">
      <div className="circle__head">
        <span className="circle__icon"><Icon name="user" size={22} /></span>
        <div>
          <h2 id="circle-h">{circle ? circle.name : "Do it together"}</h2>
          <p>{circle ? `${circle.members.length} of 12 · code ${circle.code}` : "Start a small private circle. Friends see your first name, days done and cheers. Nothing else."}</p>
        </div>
      </div>

      {!signedIn ? (
        <p className="circle__hint">
          {apiEnabled ? <><Link to="/account">Sign in</Link> to start or join a circle. Circles need an account so friends can see each other's progress.</> : "Circles arrive with accounts when Rooted is live."}
        </p>
      ) : circle === undefined ? (
        <p className="circle__hint">Loading…</p>
      ) : circle ? (
        <>
          <ul className="circle__members">
            {[...circle.members].sort((a, b) => b.daysDone - a.daysDone).map((m, i) => (
              <motion.li key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                <span className="circle__avatar" aria-hidden="true">{m.name.slice(0, 1).toUpperCase()}</span>
                <span className="circle__who">
                  <b>{m.name}{m.you ? " (you)" : ""}</b>
                  <span className="circle__track" aria-label={`${m.daysDone} of ${program.days.length} days`}>
                    {program.days.map((_, d) => <i key={d} className={d < m.daysDone ? "is-done" : ""} />)}
                  </span>
                </span>
                <span className="circle__side">
                  {m.cheersToday > 0 && <span className="circle__cheers">{m.cheersToday} 🙌</span>}
                  {!m.you && (
                    <button className="circle__cheer" onClick={() => void cheer(m)} disabled={!!cheered[m.id]} aria-label={`Cheer ${m.name} on`}>
                      {cheered[m.id] ? "Sent" : "Cheer"}
                    </button>
                  )}
                </span>
              </motion.li>
            ))}
          </ul>
          <div className="circle__actions">
            <button className="btn btn--primary btn--small" onClick={() => void share()}><Icon name="plus" size={16} /> Invite to circle</button>
            <button className="circle__leave" onClick={() => void leave()}>Leave circle</button>
          </div>
        </>
      ) : mode === "idle" ? (
        <div className="circle__actions">
          <button className="btn btn--primary btn--small" onClick={() => setMode("create")}><Icon name="plus" size={16} /> Start a circle</button>
          <button className="btn btn--secondary btn--small" onClick={() => setMode("join")}>I have a code</button>
        </div>
      ) : (
        <form className="circle__form" onSubmit={(e) => { e.preventDefault(); void (mode === "create" ? create() : join()); }}>
          {pendingCode && mode === "join" && <p className="circle__hint">You were invited to a circle. Choose the name your friends will see, then join.</p>}
          {mode === "create" && (
            <label><span>Circle name</span><input value={name} maxLength={40} onChange={(e) => setName(e.target.value)} required /></label>
          )}
          {mode === "join" && (
            <label><span>Circle code</span><input value={code} maxLength={8} onChange={(e) => setCode(e.target.value)} placeholder="8 letters and numbers" required autoCapitalize="none" /></label>
          )}
          <label><span>Your name in the circle</span><input value={me} maxLength={24} onChange={(e) => setMe(e.target.value)} placeholder="First name or nickname" required /></label>
          {error && <p className="circle__error" role="alert">{error}</p>}
          <div className="circle__actions">
            <button className="btn btn--primary btn--small" disabled={busy || !me.trim() || (mode === "join" ? code.trim().length !== 8 : !name.trim())}>{busy ? "One moment…" : mode === "create" ? "Create circle" : "Join circle"}</button>
            <button type="button" className="btn btn--secondary btn--small" onClick={() => { setMode("idle"); setError(null); }}>Cancel</button>
          </div>
        </form>
      )}
      {toast.node}
    </section>
  );
}
