import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Tile } from "../components/Tile";
import { Icon } from "../components/Icon";
import { searchTitles, useCatalog, useCatalogStore } from "../store/catalog";
import { api } from "../api/client";
import type { Title } from "../types";
import "./Search.css";

const SUGGESTIONS = ["Deep Sync", "Delta", "Theta", "40 Hz", "Brown noise", "528", "Sleep", "Focus", "Coming soon"];
const BROWSE = [
  { label: "Sleep", to: "/collection/frequencies/goal-sleep", hue: 238 },
  { label: "Meditate", to: "/collection/frequencies/goal-meditate", hue: 282 },
  { label: "Focus", to: "/collection/frequencies/goal-focus", hue: 188 },
  { label: "Relax", to: "/collection/frequencies/goal-relax", hue: 152 },
  { label: "Energize", to: "/collection/frequencies/goal-energize", hue: 28 },
  { label: "Deep Sync", to: "/collection/frequencies/deep-sync", hue: 262 },
  { label: "Shows", to: "/shows", hue: 320 },
  { label: "Build Your Own", to: "/build", hue: 170 },
  { label: "Inside Your Brain", to: "/learn/brain", hue: 200 },
];

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const catalog = useCatalog();
  const source = useCatalogStore((s) => s.source);
  const input = useRef<HTMLInputElement>(null);
  const [remote, setRemote] = useState<Title[] | null>(null);

  useEffect(() => input.current?.focus(), []);

  // Keep the query in the URL so results are shareable and survive back/forward.
  useEffect(() => {
    const t = window.setTimeout(() => setParams(q ? { q } : {}, { replace: true }), 250);
    return () => window.clearTimeout(t);
  }, [q, setParams]);

  // When the catalog comes from the API, defer to server-side search.
  useEffect(() => {
    if (source !== "api" || !q.trim()) {
      setRemote(null);
      return;
    }
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      api<{ results: Title[] }>(`/search?q=${encodeURIComponent(q)}`, { signal: ctrl.signal })
        .then((r) => setRemote(r.results))
        .catch(() => setRemote(null));
    }, 200);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [q, source]);

  const local = useMemo(() => (catalog ? searchTitles(catalog, q) : []), [catalog, q]);
  const results = remote ?? local;
  const topIds = catalog?.sections.home.rails.find((r) => r.id === "top10")?.titleIds ?? [];

  return (
    <PageTransition padded>
      <div className="search__bar">
        <Icon name="search" size={28} />
        <label htmlFor="search-input" className="visually-hidden">Search</label>
        <input
          id="search-input"
          ref={input}
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search sessions, shows, bands or Hz"
          autoComplete="off"
          enterKeyHint="search"
        />
        {q && (
          <button className="icon-btn icon-btn--plain" aria-label="Clear search" onClick={() => { setQ(""); input.current?.focus(); }}>
            <Icon name="close" />
          </button>
        )}
      </div>

      <div className="search__chips" aria-label="Suggestions">
        {SUGGESTIONS.map((s) => (
          <button key={s} className={`chip ${q.toLowerCase() === s.toLowerCase() ? "is-on" : ""}`} onClick={() => setQ(s)}>{s}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {q.trim() ? (
          <motion.section key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} aria-live="polite">
            <h2 className="search__heading">{results.length ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q}”` : `No results for “${q}”`}</h2>
            {results.length ? (
              <div className="grid" role="list">
                {results.map((t, i) => <Tile key={t.id} title={t} shape="landscape" index={i} />)}
              </div>
            ) : (
              <p className="search__empty">Try a goal like “sleep”, a band like “theta”, or a number like “10 Hz”.</p>
            )}
          </motion.section>
        ) : (
          <motion.section key="browse" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h2 className="search__heading">Browse</h2>
            <div className="browse">
              {BROWSE.map((b) => (
                <Link key={b.label} to={b.to} className="browse__card" style={{ "--h": b.hue } as React.CSSProperties}>
                  {b.label}
                </Link>
              ))}
            </div>
            <h2 className="search__heading">Popular right now</h2>
            <div className="grid" role="list">
              {catalog && topIds.map((id, i) => <Tile key={id} title={catalog.titles[id]} shape="landscape" index={i} />)}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      <Footer />
    </PageTransition>
  );
}
