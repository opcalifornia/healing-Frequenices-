import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Hero } from "./Hero";
import { Rail, RailFrame, RailSkeleton } from "./Rail";
import { TileArt } from "./Tile";
import { Footer } from "./Footer";
import { Icon } from "./Icon";
import { PageTransition } from "./PageTransition";
import { useSection } from "../store/catalog";
import { useLibrary } from "../store/user";
import { usePlayer } from "../store/player";
import { customToTitle } from "../custom";
import { formatHz } from "../format";
import type { Rail as RailData, Title } from "../types";

function ContinueRail({ titles, sectionId }: { titles: Record<string, Title>; sectionId: string }) {
  const lib = useLibrary();
  const rail: RailData = useMemo(
    () => ({ id: "continue", title: "Continue Listening", type: "standard", shape: "landscape", titleIds: lib.continue.map((c) => c.titleId).filter((id) => titles[id]) }),
    [lib.continue, titles],
  );
  const progress = useMemo(() => Object.fromEntries(lib.continue.map((c) => [c.titleId, c.duration ? c.position / c.duration : 0])), [lib.continue]);
  return <Rail rail={{ ...rail, type: "continue" }} titles={titles} sectionId={sectionId} progress={progress} />;
}

function BuildRail() {
  const custom = useLibrary().custom;
  const playTitle = usePlayer((s) => s.playTitle);
  return (
    <RailFrame id="build" title="Build Your Own">
      <div className="tile tile--landscape" role="listitem">
        <Link to="/build" className="tile__link build-cta" data-tile-index={0}>
          <span className="build-cta__icon"><Icon name="sliders" size={30} /></span>
          <span className="build-cta__title">Build Your Own</span>
          <span className="build-cta__sub">Pick a carrier and beat, save it to My Stuff</span>
        </Link>
      </div>
      {custom.map((c, i) => {
        const t = customToTitle(c);
        return (
          <div className="tile tile--landscape" role="listitem" key={c.id}>
            <button className="tile__link" data-tile-index={i + 1} onClick={() => playTitle(t)} aria-label={`Play ${c.name}`} style={{ width: "100%", textAlign: "left" }}>
              <TileArt title={t} shape="landscape" />
              <span className="tile__name">{c.name}<br /><small style={{ fontWeight: 600, opacity: 0.8 }}>{formatHz(c.carrier)} · {formatHz(c.beat)} beat</small></span>
            </button>
          </div>
        );
      })}
    </RailFrame>
  );
}

export function SectionPage({ sectionId, children }: { sectionId: string; children?: React.ReactNode }) {
  const { section, titles } = useSection(sectionId);
  const hero = useMemo(() => section?.heroIds.map((id) => titles[id]).filter(Boolean) ?? [], [section, titles]);

  return (
    <PageTransition>
      {section ? <Hero titles={hero} /> : <div className="hero hero--skeleton skeleton" />}
      <div className="rails">
        {children}
        {section
          ? section.rails.map((rail) => {
              if (rail.type === "continue") return <ContinueRail key={rail.id} titles={titles} sectionId={sectionId} />;
              if (rail.type === "build") return <BuildRail key={rail.id} />;
              return <Rail key={rail.id} rail={rail} titles={titles} sectionId={sectionId} />;
            })
          : Array.from({ length: 4 }, (_, i) => <RailSkeleton key={i} shape={i % 2 ? "poster" : "landscape"} />)}
      </div>
      <Footer />
    </PageTransition>
  );
}
