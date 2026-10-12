import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, Reveal, ZoomPage } from "../rooted/motion";
import { clearLocal, exportProfile, onMetaChange, pull, readMeta, setPrivateBackup, SLICES } from "../rooted/sync";
import { saveTextFile } from "../rooted/download";
import { api, apiEnabled } from "../api/client";
import { useActiveProfile, useUser } from "../store/user";
import { Footer } from "../components/Footer";
import { Icon } from "../components/Icon";
import { APP_NAME } from "../brand";
import "../rooted/rooted.css";
import "./Breathe.css";
import "./YourData.css";

const LABEL: Record<string, string> = {
  nourish: "Shopping list and water", practice: "Breathing, movement and heart checks", wellness: "Goals and health considerations", programs: "Program progress",
  garden: "Your garden", bedtime: "Bedtime routine", calendar: "Health calendar events", earth: "Pledges and good deeds", journal: "Reflections and gratitude", support: "Safety plan and mood check-ins",
};

export default function YourData() {
  const profile = useActiveProfile();
  const account = useUser((s) => s.account);
  const signOut = useUser((s) => s.signOut);
  const [meta, setMeta] = useState(readMeta());
  const [busy, setBusy] = useState("");
  useEffect(() => onMetaChange(() => setMeta(readMeta())), []);
  if (!profile) return null;
  const signedIn = apiEnabled && !!account;

  const syncNow = async () => { setBusy("sync"); await pull(profile.id).catch(() => undefined); setBusy(""); };
  const deleteServer = async () => {
    if (!confirm("Delete everything synced to your account for this profile? Data on this device stays.")) return;
    setBusy("delete"); await api(`/profiles/${profile.id}/state`, { method: "DELETE" }).catch(() => undefined); setBusy("");
  };
  const deleteAccount = async () => {
    if (!confirm(`Delete your ${APP_NAME} account (${account?.email}) and everything stored with it, for every profile? This can't be undone.`)) return;
    if (prompt('Type DELETE to confirm.')?.trim().toUpperCase() !== "DELETE") return;
    setBusy("account");
    try {
      await api("/me", { method: "DELETE" });
      signOut();
      alert("Your account and its data have been deleted. Data on this device stays until you delete it below.");
    } catch {
      alert("We couldn't delete your account just now. Please try again.");
    }
    setBusy("");
  };
  const deleteLocal = () => {
    if (!confirm(`Remove ${profile.name}'s ${APP_NAME} data from this device? This can't be undone${signedIn ? " (synced copies stay on your account)" : ""}.`)) return;
    clearLocal(profile.id);
  };

  return (
    <ZoomPage className="rooted yourdata">
      <header className="sec-hero yourdata__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Rooted · Your data</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>Your data is yours.</motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            See what {APP_NAME} keeps for {profile.name}, where it lives, and download or delete it any time. We never sell your data or use it for ads.
          </motion.p>
        </div>
      </header>

      <section className="sec-block">
        <div className="data-grid">
          <Reveal className="r-card data-card">
            <span className="data-card__icon"><Icon name="user" size={22} /></span>
            <h3>{signedIn ? "Syncing to your account" : "Stored on this device"}</h3>
            <p>
              {signedIn
                ? `Signed in as ${account!.email}. Your progress follows you to any device you sign in on. Newest changes win.`
                : apiEnabled
                  ? "Sign in to back up your progress and use it on your other devices."
                  : "Everything is saved on this device only."}
            </p>
            {signedIn ? (
              <div className="data-card__row">
                <button className="btn btn--secondary btn--small" onClick={syncNow} disabled={busy === "sync"}>{busy === "sync" ? "Syncing…" : "Sync now"}</button>
                {meta.lastSync && <span className="data-card__muted">Last synced {new Date(meta.lastSync).toLocaleString()}</span>}
              </div>
            ) : apiEnabled ? <Link to="/account" className="btn btn--primary btn--small">Sign in</Link> : null}
          </Reveal>

          {signedIn && (
            <Reveal delay={0.05} className="r-card data-card">
              <span className="data-card__icon"><Icon name="heart" size={22} /></span>
              <h3>Back up private notes</h3>
              <p>Your reflections, safety plan and mood check-ins stay on this device unless you turn this on. If you do, they're stored with your account so you don't lose them.</p>
              <label className="toggle">
                <input type="checkbox" checked={meta.privateBackup} onChange={(e) => { setPrivateBackup(e.target.checked); if (e.target.checked) void syncNow(); }} />
                <span className="toggle__track"><i /></span>
                <span>{meta.privateBackup ? "On" : "Off"}</span>
              </label>
            </Reveal>
          )}
        </div>

        <Reveal className="sec-block__head nourish__subhead"><h2>What's kept</h2></Reveal>
        <ul className="data-list">
          {SLICES.map((s) => (
            <li key={s.key}>
              <span>{LABEL[s.key]}</span>
              <em className={s.private ? "is-private" : ""}>{s.private ? (signedIn && meta.privateBackup ? "Device + account" : "This device only") : signedIn ? "Device + account" : "This device"}</em>
            </li>
          ))}
        </ul>

        <div className="data-actions">
          <button className="btn btn--primary" onClick={() => void saveTextFile(`rooted-${profile.name.toLowerCase()}-data.json`, exportProfile(profile.id), "application/json")}><Icon name="bookmark" size={18} /> Download my data</button>
          {signedIn && <button className="btn btn--secondary" onClick={deleteServer} disabled={busy === "delete"}>Delete synced copy</button>}
          <button className="btn btn--secondary" onClick={deleteLocal}><Icon name="trash" size={18} /> Delete from this device</button>
          {signedIn && <button className="btn btn--secondary data-actions__danger" onClick={deleteAccount} disabled={busy === "account"}><Icon name="trash" size={18} /> Delete my account</button>}
        </div>
      </section>
      <Footer />
    </ZoomPage>
  );
}
