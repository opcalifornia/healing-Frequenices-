import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { MetaRow } from "../components/MetaRow";
import { LiveWaves } from "../components/LiveWaves";
import { FavoriteButton, PlayButton, RemindButton } from "../components/TitleActions";
import { Tile, TileArt } from "../components/Tile";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { useCatalog, useTitle } from "../store/catalog";
import { BAND_LABEL, BAND_RANGE, formatDuration, formatHz, GOAL_LABEL } from "../format";
import { bandFor } from "../custom";
import type { Stage, Title } from "../types";
import NotFound from "./NotFound";
import "./TitleDetail.css";

function StageTimeline({ stages, duration }: { stages: Stage[]; duration: number }) {
  const maxBeat = Math.max(...stages.map((s) => s.beat), 14);
  const logMax = Math.log2(maxBeat + 1);
  return (
    <figure className="stages">
      <figcaption className="stages__cap">Program timeline</figcaption>
      <div className="stages__bars">
        {stages.map((s, i) => {
          const end = stages[i + 1]?.at ?? duration;
          return (
            <div key={i} className={`stages__bar band-${bandFor(s.beat)}`} style={{ flexGrow: end - s.at }}>
              <div className="stages__fill" style={{ height: `${18 + (Math.log2(s.beat + 1) / logMax) * 82}%` }} />
              <span className="stages__label">{s.label}</span>
              <span className="stages__hz">{formatHz(s.beat)}</span>
            </div>
          );
        })}
      </div>
      <div className="stages__axis">
        <span>0:00</span>
        <span>{formatDuration(duration)}</span>
      </div>
    </figure>
  );
}

function FrequencyFacts({ t }: { t: Title }) {
  const facts: Array<[string, string]> = [];
  if (t.carrier) facts.push(["Left ear (carrier)", formatHz(t.carrier)]);
  if (t.carrier && t.beat && !t.stages) facts.push(["Right ear", formatHz(+(t.carrier + t.beat).toFixed(2))]);
  if (t.beat && !t.stages) facts.push(["Binaural beat", formatHz(t.beat)]);
  if (t.band) facts.push(["Band", `${BAND_LABEL[t.band]} · ${BAND_RANGE[t.band]}`]);
  if (t.goal) facts.push(["Goal", GOAL_LABEL[t.goal]]);
  facts.push(["Noise bed", t.noise === "surf" ? "Ocean surf" : t.noise ? `${t.noise[0].toUpperCase()}${t.noise.slice(1)} noise` : "None"]);
  if (t.pairs?.length) facts.push(["Layered pairs", t.pairs.map((p) => `${formatHz(p.carrier)} + ${formatHz(p.beat)}`).join(" · ")]);
  if (t.solfeggio) facts.push(["Solfeggio tone", formatHz(t.solfeggio)]);
  if (t.isochronic) facts.push(["Isochronic pulse", "On"]);
  return (
    <dl className="facts">
      {facts.map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Episodes({ t }: { t: Title }) {
  const [season, setSeason] = useState(1);
  const s = t.seasons?.find((x) => x.number === season) ?? t.seasons?.[0];
  if (!s) return null;
  return (
    <div className="episodes">
      {(t.seasons?.length ?? 0) > 1 && (
        <div className="field episodes__season">
          <label htmlFor="season" className="visually-hidden">Season</label>
          <select id="season" value={season} onChange={(e) => setSeason(+e.target.value)}>
            {t.seasons!.map((x) => (
              <option key={x.number} value={x.number}>Season {x.number}</option>
            ))}
          </select>
        </div>
      )}
      <ol className="episodes__list">
        {s.episodes.map((ep, i) => (
          <motion.li key={ep.id} className="episode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <div className="episode__thumb">
              <TileArt title={{ ...t, id: ep.id, art: { ...t.art, hue: (t.art.hue + i * 9) % 360 } }} shape="landscape" />
              <span className="badge badge--soon">Coming soon</span>
            </div>
            <div className="episode__body">
              <h3>{ep.number}. {ep.name}</h3>
              <div className="meta-row"><span>S{s.number} E{ep.number}</span><span className="dot" /><span>{formatDuration(ep.durationMin)}</span></div>
              <p>{ep.description}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export default function TitleDetail() {
  const { id } = useParams();
  const t = useTitle(id);
  const catalog = useCatalog();
  const art = useArt(t ? specForTitle(t) : null, "hero");

  const similar = useMemo(() => {
    if (!t || !catalog) return [];
    return Object.values(catalog.titles)
      .filter((o) => o.id !== t.id && (t.kind === "show") === (o.kind === "show"))
      .map((o) => ({ o, score: (o.goal && o.goal === t.goal ? 2 : 0) + (o.band && o.band === t.band ? 2 : 0) + (o.category === t.category ? 2 : 0) + (o.kind === t.kind ? 1 : 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map(({ o }) => o);
  }, [t, catalog]);

  const tabs = t?.kind === "show" ? (["Episodes", "More Like This", "Details"] as const) : (["More Like This", "Details"] as const);
  const [tab, setTab] = useState<string>(tabs[0]);

  if (!catalog) return <PageTransition><div className="detail__hero skeleton" /></PageTransition>;
  if (!t) return <NotFound />;

  return (
    <PageTransition>
      <section className="detail__hero">
        {art ? <img className="detail__img art-drift" src={art} alt="" /> : <div className="detail__img skeleton" />}
        {art && <LiveWaves seed={t.id} hue={t.art.hue} beat={t.beat} />}
        <div className="detail__scrim" />
        <motion.div className="detail__content" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}>
          {t.comingSoon && <span className="badge badge--soon">Coming soon</span>}
          {t.kind === "program" && <span className="hero__eyebrow">Deep Sync original</span>}
          <h1 className="detail__title">{t.name}</h1>
          <MetaRow title={t} />
          <p className="detail__tagline">{t.tagline}</p>
          <p className="detail__desc">{t.description}</p>
          {t.host && <p className="detail__host">Hosted by {t.host}</p>}
          <div className="hero__actions">
            {t.comingSoon ? <RemindButton title={t} /> : <PlayButton title={t} />}
            {!t.comingSoon && <FavoriteButton title={t} />}
          </div>
          {!t.comingSoon && (
            <p className="detail__note">Headphones required. May support relaxation, focus, or sleep.</p>
          )}
        </motion.div>
      </section>

      <div className="detail__tabs" role="tablist" aria-label={`${t.name} sections`}>
        {tabs.map((name) => (
          <button key={name} role="tab" id={`tab-${name}`} aria-selected={tab === name} aria-controls={`panel-${name}`} className={`detail__tab ${tab === name ? "is-active" : ""}`} onClick={() => setTab(name)}>
            {name}
            {tab === name && <motion.span layoutId="tab-underline" className="detail__tab-line" />}
          </button>
        ))}
      </div>

      <div className="detail__panel" role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "Episodes" && <Episodes t={t} />}
        {tab === "More Like This" && (
          <div className="grid" role="list">
            {similar.map((o, i) => <Tile key={o.id} title={o} shape="landscape" index={i} />)}
          </div>
        )}
        {tab === "Details" && (
          <div className="detail__details">
            {t.stages && t.durationMin && <StageTimeline stages={t.stages} duration={t.durationMin} />}
            {t.kind !== "show" ? <FrequencyFacts t={t} /> : (
              <dl className="facts">
                <div><dt>Category</dt><dd>{t.category}</dd></div>
                <div><dt>Host</dt><dd>{t.host}</dd></div>
                <div><dt>Seasons</dt><dd>{t.seasons?.length}</dd></div>
                <div><dt>Episodes</dt><dd>{t.seasons?.reduce((n, s) => n + s.episodes.length, 0)}</dd></div>
                <div><dt>Status</dt><dd>Coming soon</dd></div>
              </dl>
            )}
            <div className="tags">{t.tags.map((tag) => <span key={tag} className="badge">{tag}</span>)}</div>
          </div>
        )}
      </div>
      <Footer />
    </PageTransition>
  );
}
