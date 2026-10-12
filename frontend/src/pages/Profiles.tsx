import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiEnabled } from "../api/client";
import { Avatar } from "../components/Avatar";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { useUser } from "../store/user";
import { SYMBOLS } from "../rooted/symbols";
import { processPhoto } from "../rooted/photo";
import type { Profile } from "../types";
import "./Profiles.css";

const HUES = [262, 300, 330, 12, 38, 140, 168, 196, 224];

interface Draft {
  id?: string;
  name: string;
  hue: number;
  symbol?: string | null;
  kids?: boolean;
  /** undefined = unchanged, null = remove, string = new photo. */
  photo?: string | null;
}

export default function Profiles() {
  const profiles = useUser((s) => s.profiles);
  const account = useUser((s) => s.account);
  const { selectProfile, addProfile, updateProfile, removeProfile } = useUser.getState();
  const [managing, setManaging] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const photos = useUser((s) => s.photos);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const choose = (p: Profile) => {
    if (managing) {
      setDraft({ id: p.id, name: p.name, hue: p.hue, symbol: p.symbol ?? null, kids: p.kids });
      setPhotoError(null);
      return;
    }
    selectProfile(p.id);
    navigate(from, { replace: true });
  };

  const save = async () => {
    if (!draft || !draft.name.trim()) return;
    const { setPhoto } = useUser.getState();
    let id = draft.id;
    if (id) await updateProfile(id, { name: draft.name.trim(), hue: draft.hue, symbol: draft.symbol ?? null });
    else id = await addProfile(draft.name.trim(), draft.hue, false, draft.symbol ?? null);
    if (draft.photo !== undefined && id) setPhoto(id, draft.kids ? null : draft.photo);
    setDraft(null);
    setPhotoError(null);
  };

  return (
    <motion.main id="main" tabIndex={-1} className="profiles" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="profiles__logo"><Logo /></div>
      <motion.h1
        className="profiles__title"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
      >
        {managing ? "Manage Profiles" : "Who's Healing?"}
      </motion.h1>
      <ul className="profiles__grid">
        {profiles.map((p, i) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
          >
            <button className={`profiles__card ${managing ? "is-managing" : ""}`} onClick={() => choose(p)}>
              <span className="profiles__avatar">
                <Avatar profile={p} size={140} />
                {managing && (
                  <span className="profiles__edit"><Icon name="edit" size={34} /></span>
                )}
              </span>
              <span className="profiles__name">{p.name}</span>
            </button>
          </motion.li>
        ))}
        {profiles.length < 6 && (
          <motion.li initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + profiles.length * 0.05 }}>
            <button className="profiles__card" onClick={() => { setDraft({ name: "", hue: HUES[profiles.length % HUES.length], symbol: null }); setPhotoError(null); }}>
              <span className="profiles__avatar profiles__add"><Icon name="plus" size={48} /></span>
              <span className="profiles__name">Add Profile</span>
            </button>
          </motion.li>
        )}
      </ul>
      <div className="profiles__actions">
        <button className="btn btn--secondary" onClick={() => setManaging((m) => !m)}>
          {managing ? "Done" : "Manage Profiles"}
        </button>
        {apiEnabled && (
          <Link to="/account" className="btn btn--secondary">{account ? account.email : "Sign in to sync"}</Link>
        )}
      </div>

      <AnimatePresence>
        {draft && (
          <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDraft(null)}>
            <motion.div
              className="dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="profile-dialog-title"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === "Escape" && setDraft(null)}
            >
              <h2 id="profile-dialog-title">{draft.id ? "Edit Profile" : "Add Profile"}</h2>
              <div className="dialog__avatar"><Avatar profile={{ name: draft.name || "?", hue: draft.hue, symbol: draft.symbol }} photo={draft.photo === undefined ? (draft.id ? photos[draft.id] : null) : draft.photo} size={96} /></div>
              <div className="field">
                <label htmlFor="profile-name">Name</label>
                <input
                  id="profile-name"
                  autoFocus
                  maxLength={20}
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  onKeyDown={(e) => e.key === "Enter" && save()}
                />
              </div>
              <div className="dialog__swatches" role="radiogroup" aria-label="Avatar color">
                {HUES.map((h) => (
                  <button
                    key={h}
                    role="radio"
                    aria-checked={draft.hue === h}
                    aria-label={`Color ${h}`}
                    className={`swatch ${draft.hue === h ? "is-on" : ""}`}
                    style={{ background: `hsl(${h} 80% 55%)` }}
                    onClick={() => setDraft({ ...draft, hue: h })}
                  />
                ))}
              </div>
              <div className="dialog__label" id="symbol-label">Healing symbol</div>
              <div className="symbols" role="radiogroup" aria-labelledby="symbol-label">
                <button role="radio" aria-checked={!draft.symbol} aria-label="No symbol, use my initial" className={`symbols__btn symbols__btn--none ${!draft.symbol ? "is-on" : ""}`} onClick={() => setDraft({ ...draft, symbol: null })}>Aa</button>
                {SYMBOLS.map((s) => (
                  <button key={s.id} role="radio" aria-checked={draft.symbol === s.id} aria-label={s.label} title={s.label} className={`symbols__btn ${draft.symbol === s.id ? "is-on" : ""}`} onClick={() => setDraft({ ...draft, symbol: s.id })}>
                    <svg viewBox="0 0 100 100" aria-hidden="true">{s.art}</svg>
                  </button>
                ))}
              </div>
              {!draft.kids && (
                <>
                  <div className="dialog__label">Photo (optional)</div>
                  <div className="photo-row">
                    <input
                      ref={fileInput}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
                      hidden
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (!file) return;
                        try {
                          const photo = await processPhoto(file);
                          setDraft((d) => (d ? { ...d, photo } : d));
                          setPhotoError(null);
                        } catch (err) {
                          setPhotoError((err as Error).message);
                        }
                      }}
                    />
                    <button className="btn btn--secondary btn--small" onClick={() => fileInput.current?.click()}><Icon name="plus" size={16} /> {(draft.photo ?? (draft.id ? photos[draft.id] : null)) ? "Change photo" : "Choose a photo"}</button>
                    {(draft.photo ?? (draft.id ? photos[draft.id] : null)) && <button className="btn btn--secondary btn--small" onClick={() => setDraft({ ...draft, photo: null })}><Icon name="trash" size={16} /> Remove</button>}
                  </div>
                  {photoError && <p className="photo-error" role="alert">{photoError}</p>}
                  <p className="photo-note">Your photo stays on this device. It isn't uploaded or shown to friends in circles.</p>
                </>
              )}
              <div className="dialog__actions">
                <button className="btn btn--primary" onClick={save} disabled={!draft.name.trim()}>Save</button>
                <button className="btn btn--secondary" onClick={() => setDraft(null)}>Cancel</button>
                {draft.id && profiles.length > 1 && (
                  <button
                    className="btn btn--secondary"
                    onClick={() => {
                      removeProfile(draft.id!);
                      setDraft(null);
                    }}
                  >
                    <Icon name="trash" size={18} /> Delete
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
  );
}
