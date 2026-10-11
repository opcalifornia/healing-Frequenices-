import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import { Tile, Top10Tile } from "./Tile";
import type { ArtShape, Rail as RailData, Title } from "../types";
import "./Rail.css";

/**
 * Arrow-key navigation: left/right moves within a rail, up/down jumps to the
 * nearest tile in the neighbouring rail, like a TV remote.
 */
function onRailKeyDown(e: KeyboardEvent<HTMLDivElement>) {
  const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
  if (!keys.includes(e.key)) return;
  const target = e.target as HTMLElement;
  const track = e.currentTarget;
  const items = Array.from(track.querySelectorAll<HTMLElement>("[data-tile-index]"));
  const i = items.indexOf(target);
  if (i < 0) return;

  let next: HTMLElement | undefined;
  if (e.key === "ArrowRight") next = items[i + 1];
  else if (e.key === "ArrowLeft") next = items[i - 1];
  else if (e.key === "Home") next = items[0];
  else if (e.key === "End") next = items[items.length - 1];
  else {
    const rails = Array.from(document.querySelectorAll<HTMLElement>(".rail__track"));
    const r = rails.indexOf(track);
    const other = rails[e.key === "ArrowDown" ? r + 1 : r - 1];
    if (other) {
      const x = target.getBoundingClientRect().left;
      const candidates = Array.from(other.querySelectorAll<HTMLElement>("[data-tile-index]"));
      next = candidates.reduce<HTMLElement | undefined>((best, el) => {
        const d = Math.abs(el.getBoundingClientRect().left - x);
        return !best || d < Math.abs(best.getBoundingClientRect().left - x) ? el : best;
      }, undefined);
    }
  }
  if (next) {
    e.preventDefault();
    next.focus({ preventScroll: true });
    next.scrollIntoView({ block: "nearest", inline: "nearest", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
}

interface RailFrameProps {
  id: string;
  title: string;
  seeAll?: string;
  children: ReactNode;
}

/** Rail chrome: heading, edge arrows that page the track, hidden scrollbar. */
export function RailFrame({ id, title, seeAll, children }: RailFrameProps) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
  }, []);

  useEffect(() => {
    measure();
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth - 80), behavior: "smooth" });
  };

  const headingId = `rail-${id}`;
  return (
    <section className="rail" aria-labelledby={headingId}>
      <header className="rail__head">
        <h2 id={headingId} className="rail__title">
          {seeAll ? (
            <Link to={seeAll} className="rail__title-link">
              {title}
              <Icon name="chevronRight" size={20} className="rail__chev" />
            </Link>
          ) : (
            title
          )}
        </h2>
      </header>
      <div className="rail__viewport">
        <button className="rail__arrow rail__arrow--prev" aria-label={`Scroll ${title} left`} hidden={edges.start} onClick={() => page(-1)} tabIndex={-1}>
          <Icon name="chevronLeft" size={34} />
        </button>
        <div ref={track} className="rail__track" role="list" onScroll={measure} onKeyDown={onRailKeyDown}>
          {children}
        </div>
        <button className="rail__arrow rail__arrow--next" aria-label={`Scroll ${title} right`} hidden={edges.end} onClick={() => page(1)} tabIndex={-1}>
          <Icon name="chevronRight" size={34} />
        </button>
      </div>
    </section>
  );
}

export function Rail({ rail, titles, sectionId, progress }: { rail: RailData; titles: Record<string, Title>; sectionId: string; progress?: Record<string, number> }) {
  const items = rail.titleIds.map((id) => titles[id]).filter(Boolean);
  if (!items.length) return null;
  const shape: ArtShape = rail.shape;
  return (
    <RailFrame id={`${sectionId}-${rail.id}`} title={rail.title} seeAll={rail.type === "standard" && items.length > 6 ? `/collection/${sectionId}/${rail.id}` : undefined}>
      {rail.type === "top10"
        ? items.map((t, i) => <Top10Tile key={t.id} title={t} rank={i + 1} index={i} />)
        : items.map((t, i) => <Tile key={t.id} title={t} shape={shape} index={i} progress={progress?.[t.id]} />)}
    </RailFrame>
  );
}

export function RailSkeleton({ shape = "landscape" }: { shape?: ArtShape }) {
  return (
    <section className="rail" aria-hidden="true">
      <div className="rail__head"><div className="skeleton" style={{ width: 220, height: 22 }} /></div>
      <div className="rail__viewport">
        <div className="rail__track">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={`tile tile--${shape}`}>
              <div className="skeleton" style={{ aspectRatio: shape === "poster" ? "2 / 3" : "16 / 9" }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
