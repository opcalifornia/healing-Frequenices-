import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Tile, TileArt } from "../components/Tile";
import { Icon } from "../components/Icon";
import { useCatalog } from "../store/catalog";
import { useActiveProfile, useLibrary, useUser } from "../store/user";
import { usePlayer } from "../store/player";
import { customToTitle } from "../custom";
import { formatClock, formatHz } from "../format";
import "./MyStuff.css";

function Empty({ icon, title, body, cta }: { icon: "bookmark" | "play" | "sliders" | "bell"; title: string; body: string; cta?: { to: string; label: string } }) {
  return (
    <div className="empty">
      <Icon name={icon} size={30} />
      <div>
        <strong>{title}</strong>
        <p>{body}</p>
      </div>
      {cta && <Link to={cta.to} className="btn btn--secondary btn--small">{cta.label}</Link>}
    </div>
  );
}

export default function MyStuff() {
  const catalog = useCatalog();
  const lib = useLibrary();
  const profile = useActiveProfile();
  const removeContinue = useUser((s) => s.removeContinue);
  const deleteCustom = useUser((s) => s.deleteCustom);
  const playTitle = usePlayer((s) => s.playTitle);

  const favorites = useMemo(() => lib.favorites.map((id) => catalog?.titles[id]).filter((t) => t && !t.comingSoon), [lib.favorites, catalog]);
  const reminders = useMemo(() => lib.favorites.map((id) => catalog?.titles[id]).filter((t) => t?.comingSoon), [lib.favorites, catalog]);
  const cont = lib.continue.filter((c) => catalog?.titles[c.titleId]);

  return (
    <PageTransition padded>
      <h1 className="page-title">My Stuff</h1>
      {profile && <p className="mystuff__sub">Saved for {profile.name}</p>}

      <section className="mystuff__section" aria-labelledby="ms-continue">
        <h2 id="ms-continue" className="rail__title">Continue Listening</h2>
        {cont.length ? (
          <div className="grid" role="list">
            {cont.map((c, i) => {
              const t = catalog!.titles[c.titleId];
              return (
                <div key={c.titleId} className="mystuff__item">
                  <Tile title={t} shape="landscape" index={i} progress={c.duration ? c.position / c.duration : 0} />
                  <div className="mystuff__row">
                    <span>{formatClock(c.position)} of {formatClock(c.duration)}</span>
                    <button className="icon-btn icon-btn--small icon-btn--plain" onClick={() => playTitle(t, c.position)} aria-label={`Resume ${t.name}`}><Icon name="play" size={16} /></button>
                    <button className="icon-btn icon-btn--small icon-btn--plain" onClick={() => removeContinue(c.titleId)} aria-label={`Remove ${t.name} from Continue Listening`}><Icon name="close" size={16} /></button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Empty icon="play" title="Nothing in progress" body="Sessions you start appear here so you can pick up where you left off." cta={{ to: "/frequencies", label: "Browse frequencies" }} />
        )}
      </section>

      <section className="mystuff__section" aria-labelledby="ms-list">
        <h2 id="ms-list" className="rail__title">My List</h2>
        {favorites.length ? (
          <div className="grid" role="list">
            {favorites.map((t, i) => <Tile key={t!.id} title={t!} shape="landscape" index={i} />)}
          </div>
        ) : (
          <Empty icon="bookmark" title="Your list is empty" body="Tap + on any session to save it here." cta={{ to: "/", label: "Find something" }} />
        )}
      </section>

      <section className="mystuff__section" aria-labelledby="ms-custom">
        <h2 id="ms-custom" className="rail__title">My Sessions</h2>
        <div className="grid" role="list">
          <div className="tile tile--landscape" role="listitem">
            <Link to="/build" className="tile__link build-cta" data-tile-index={0}>
              <span className="build-cta__icon"><Icon name="sliders" size={30} /></span>
              <span className="build-cta__title">Build Your Own</span>
              <span className="build-cta__sub">Carrier 100–400 Hz · beat 0.5–40 Hz</span>
            </Link>
          </div>
          {lib.custom.map((c, i) => {
            const t = customToTitle(c);
            return (
              <motion.div key={c.id} className="mystuff__item" layout>
                <button className="tile__link" onClick={() => playTitle(t)} aria-label={`Play ${c.name}`} data-tile-index={i + 1} style={{ width: "100%", textAlign: "left" }}>
                  <TileArt title={t} shape="landscape" />
                  <span className="tile__name">{c.name}</span>
                </button>
                <div className="mystuff__row">
                  <span>{formatHz(c.carrier)} · {formatHz(c.beat)} beat</span>
                  <button className="icon-btn icon-btn--small icon-btn--plain" onClick={() => deleteCustom(c.id)} aria-label={`Delete ${c.name}`}><Icon name="trash" size={16} /></button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="mystuff__section" aria-labelledby="ms-remind">
        <h2 id="ms-remind" className="rail__title">Reminders</h2>
        {reminders.length ? (
          <div className="grid grid--poster" role="list">
            {reminders.map((t, i) => <Tile key={t!.id} title={t!} shape="poster" index={i} />)}
          </div>
        ) : (
          <Empty icon="bell" title="No reminders yet" body="Tap the bell on a coming-soon show to keep it here." cta={{ to: "/shows", label: "See shows" }} />
        )}
      </section>
      <Footer />
    </PageTransition>
  );
}
