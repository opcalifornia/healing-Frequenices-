import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer, SafetyList } from "../components/Footer";
import { useCatalog } from "../store/catalog";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { articleArt } from "./Learn";
import NotFound from "./NotFound";
import { TileArt } from "../components/Tile";
import { LiveWaves } from "../components/LiveWaves";
import "./Learn.css";

export default function Article() {
  const { slug } = useParams();
  const catalog = useCatalog();
  const article = catalog?.articles.find((a) => a.slug === slug);
  const art = useArt(article ? specForTitle(articleArt(article)) : null, "hero");
  if (!catalog) return <PageTransition><div className="article__hero skeleton" /></PageTransition>;
  if (!article) return <NotFound />;
  const more = catalog.articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  return (
    <PageTransition>
      <header className="article__hero">
        {art && <img className="art-drift" src={art} alt="" />}
        {art && <LiveWaves seed={`article-${article.slug}`} hue={article.hue} baseline={0.62} />}
        <div className="article__scrim" />
        <motion.div className="article__head" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/learn" className="article__crumb">Learn</Link>
          <h1>{article.title}</h1>
          <p className="article__dek">{article.dek}</p>
          <span className="article__meta">{article.readMin} min read</span>
        </motion.div>
      </header>
      <article className="article__body">
        {article.body.map((p, i) => (p.startsWith("## ") ? <h2 key={i}>{p.slice(3)}</h2> : <p key={i}>{p}</p>))}
        <aside className="article__note">
          <strong>Listening safely</strong>
          <SafetyList />
          <p>Sessions may support relaxation, focus, or sleep. They do not treat or cure any condition, and research on binaural beats is mixed.</p>
        </aside>
      </article>
      <section className="learn__grid-wrap">
        <h2 className="rail__title">Keep reading</h2>
        <div className="learn__grid">
          {more.map((a) => (
            <Link key={a.slug} to={`/learn/${a.slug}`} className="article-card">
              <TileArt title={articleArt(a)} shape="landscape" />
              <span className="article-card__meta">{a.readMin} min read</span>
              <h3>{a.title}</h3>
              <p>{a.dek}</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </PageTransition>
  );
}
