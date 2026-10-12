import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Logo } from "../components/Logo";
import { useUser } from "../store/user";
import { apiEnabled } from "../api/client";
import "./Profiles.css";
import "./Account.css";

export default function Account() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const signIn = useUser((s) => s.signIn);
  const account = useUser((s) => s.account);
  const signOut = useUser((s) => s.signOut);
  const navigate = useNavigate();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(email, password, mode);
      navigate("/profiles", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.main id="main" tabIndex={-1} className="profiles account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Link to="/" className="profiles__logo" aria-label="Home"><Logo /></Link>
      <div className="account__card">
        {!apiEnabled ? (
          <>
            <h1>Accounts</h1>
            <p className="account__muted">
              This build runs in local mode: your profiles, My Stuff and saved sessions are stored in this browser.
              Set <code>VITE_API_URL</code> to enable accounts and sync.
            </p>
            <Link to="/profiles" className="btn btn--primary">Continue</Link>
          </>
        ) : account ? (
          <>
            <h1>Signed in</h1>
            <p className="account__muted">{account.email}</p>
            <div className="dialog__actions">
              <Link to="/profiles" className="btn btn--primary">Choose profile</Link>
              <button className="btn btn--secondary" onClick={signOut}>Sign out</button>
            </div>
          </>
        ) : (
          <form onSubmit={submit} noValidate>
            <h1>{mode === "login" ? "Sign in" : "Create your account"}</h1>
            <p className="account__muted">Sync profiles, My Stuff, Continue Listening and your custom sessions across devices.</p>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {mode === "register" && <small className="account__muted">At least 8 characters.</small>}
            </div>
            {error && <p className="account__error" role="alert">{error}</p>}
            {mode === "register" && (
              <p className="account__muted account__legal">
                By creating an account you agree to the <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy policy</Link>. We never sell your data.
              </p>
            )}
            <button className="btn btn--primary account__submit" disabled={busy || !email || password.length < 8}>
              {busy ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
            </button>
            <p className="account__switch">
              {mode === "login" ? "New here?" : "Already have an account?"}{" "}
              <button type="button" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}>
                {mode === "login" ? "Create an account" : "Sign in"}
              </button>
            </p>
            <Link to="/profiles" className="account__skip">Continue without an account</Link>
          </form>
        )}
      </div>
    </motion.main>
  );
}
