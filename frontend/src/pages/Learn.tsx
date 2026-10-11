import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Rail } from "../components/Rail";
import { TileArt } from "../components/Tile";
import { useCatalog } from "../store/catalog";
import { BAND_LABEL, BAND_RANGE } from "../format";
import type { Article, Band, Title } from "../types";
import { BrainLateral } from "../learn/diagrams/BrainLateral";
import "./Learn.css";
import "./BrainGuide.css";
import "./SleepGuide.css";

const BANDS: Array<[Band, string]> = [
  ["delta", "Deep sleep"],
  ["theta", "Drowsy, meditative"],
  ["alpha", "Relaxed, awake"],
  ["beta", "Active thinking"],
  ["gamma", "High-level processing"],
];

/** Articles reuse the tile painter, so they get matching procedural covers. */
export function articleArt(a: Article): Title {
  return { id: `article-${a.slug}`, kind: "session", name: a.title, tagline: a.dek, description: "", tags: [], year: 2026, art: { hue: a.hue, pattern: "wave" } };
}

export default function Learn() {
  const catalog = useCatalog();
  const [lead, ...rest] = catalog?.articles ?? [];
  const showsRail = catalog?.sections.shows.rails.find((r) => r.id === "cat-science");

  return (
    <PageTransition padded>
      <header className="learn__head">
        <h1 className="page-title" style={{ padding: 0, marginBottom: 6 }}>Learn</h1>
        <p>How binaural beats work, what the brainwave bands mean, and what the research does and doesn't show.</p>
      </header>

      <Link to="/learn/brain" className="guide-card">
        <div className="guide-card__text">
          <span className="hero__eyebrow">New · Interactive guide · 8 chapters</span>
          <h2>Inside Your Brain</h2>
          <p>
            The two hemispheres, how two tones become one beat in your brainstem, what each brainwave band looks like and
            where it shows up, a night of sleep, and the rhythms of your body. With diagrams and the research behind them.
          </p>
          <span className="btn btn--primary btn--small">Start the guide</span>
        </div>
        <BrainLateral highlight={["occipital", "parietal"]} color="#19e3c4" pulse={2.4} label="Alpha · 8–13 Hz" title="Brain diagram with the alpha band highlighted at the back of the head" />
      </Link>

      <Link to="/learn/sleep" className="guide-card learn-sleep-card">
        <div className="guide-card__text">
          <span className="hero__eyebrow">New · Guide · 8 chapters</span>
          <h2>Better Sleep</h2>
          <p>
            Morning light, evening light and blue light, caffeine timing, temperature, naps and deep rest, with an evidence rating on every
            tip and a day planned around your bedtime.
          </p>
          <span className="btn btn--primary btn--small">Read the guide</span>
        </div>
        <div className="learn-sleep-art" aria-hidden="true"><span /></div>
      </Link>

      {lead && (
        <Link to={`/learn/${lead.slug}`} className="learn__lead">
          <TileArt title={articleArt(lead)} shape="landscape" eager />
          <div className="learn__lead-text">
            <span className="hero__eyebrow">Start here · {lead.readMin} min read</span>
            <h2>{lead.title}</h2>
            <p>{lead.dek}</p>
          </div>
        </Link>
      )}

      <section className="bands" aria-labelledby="bands-title">
        <h2 id="bands-title" className="rail__title">The five bands at a glance</h2>
        <ol className="bands__list">
          {BANDS.map(([b, desc], i) => (
            <motion.li key={b} className={`bands__item band-${b}`} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <Link to={`/collection/frequencies/band-${b}`}>
                <span className="bands__bar" />
                <strong>{BAND_LABEL[b]}</strong>
                <span className="bands__hz">{BAND_RANGE[b]}</span>
                <span className="bands__desc">{desc}</span>
              </Link>
            </motion.li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="articles-title" className="learn__grid-wrap">
        <h2 id="articles-title" className="rail__title">Articles</h2>
        <div className="learn__grid">
          {rest.map((a, i) => (
            <motion.div key={a.slug} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
              <Link to={`/learn/${a.slug}`} className="article-card">
                <TileArt title={articleArt(a)} shape="landscape" />
                <span className="article-card__meta">{a.readMin} min read</span>
                <h3>{a.title}</h3>
                <p>{a.dek}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {showsRail && catalog && <Rail rail={{ ...showsRail, title: "Coming soon: watch and learn" }} titles={catalog.titles} sectionId="learn" />}
      <Footer />
    </PageTransition>
  );
}
