import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { metaParts } from "../format";
import { usePreview } from "../store/preview";
import type { ArtShape, Title } from "../types";
import "./Tile.css";

const HOVER_DELAY = 450;
const canHover = typeof window !== "undefined" && window.matchMedia?.("(hover: hover) and (pointer: fine)").matches;

/** Lazily paints art when the tile scrolls near the viewport. */
function useNearViewport<T extends Element>() {
  const ref = useRef<T>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || near) return;
    if (!("IntersectionObserver" in window)) {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 600px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [near]);
  return [ref, near] as const;
}

export function TileArt({ title, shape, eager = false }: { title: Title; shape: ArtShape; eager?: boolean }) {
  const [ref, near] = useNearViewport<HTMLDivElement>();
  const url = useArt(specForTitle(title), shape, eager || near);
  return (
    <div ref={ref} className={`tile__art ${url ? "is-loaded" : "skeleton"}`}>
      {url && <img src={url} alt="" draggable={false} />}
    </div>
  );
}

export function TileBadge({ title }: { title: Title }) {
  if (title.comingSoon) return <span className="badge badge--soon tile__badge">Coming soon</span>;
  if (title.isNew) return <span className="badge badge--new tile__badge">New</span>;
  if (title.kind === "program") return <span className="badge tile__badge">Deep Sync</span>;
  return null;
}

interface TileProps {
  title: Title;
  shape: ArtShape;
  progress?: number;
  index?: number;
}

export const Tile = memo(function Tile({ title, shape, progress, index = 0 }: TileProps) {
  const timer = useRef<number>();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const show = usePreview((s) => s.show);

  const onEnter = () => {
    if (!canHover) return;
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = linkRef.current;
      if (el && el.matches(":hover")) show(title, el.getBoundingClientRect());
    }, HOVER_DELAY);
  };
  const onLeave = () => window.clearTimeout(timer.current);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const label = `${title.name}. ${metaParts(title).join(", ")}${title.comingSoon ? ". Coming soon" : ""}`;

  return (
    <div className={`tile tile--${shape}`} role="listitem">
      <Link
        ref={linkRef}
        to={`/title/${title.id}`}
        className="tile__link"
        aria-label={label}
        data-tile-index={index}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onFocus={() => usePreview.getState().hide()}
      >
        <TileArt title={title} shape={shape} />
        <TileBadge title={title} />
        <span className="tile__name" aria-hidden="true">{title.name}</span>
        {progress !== undefined && (
          <span className="tile__progress" aria-hidden="true">
            <span style={{ width: `${Math.min(100, Math.max(3, progress * 100))}%` }} />
          </span>
        )}
      </Link>
    </div>
  );
});

export function Top10Tile({ title, rank, index }: { title: Title; rank: number; index: number }) {
  return (
    <div className="top10" role="listitem">
      <svg className="top10__num" viewBox="0 0 120 160" aria-hidden="true">
        <text x={rank === 10 ? 112 : 116} y="150" textAnchor="end">{rank}</text>
      </svg>
      <div className="top10__poster">
        <Tile title={title} shape="poster" index={index} />
      </div>
    </div>
  );
}
