import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { usePreview } from "../store/preview";
import { MetaRow } from "./MetaRow";
import { TileArt, TileBadge } from "./Tile";
import { FavoriteButton, PlayButton } from "./TitleActions";
import { Icon } from "./Icon";
import "./Tile.css";

const SCALE = 1.35;

/** Expanded card that grows out of a hovered tile, like the reference's hover reveal. */
export function HoverPreview() {
  const { title, rect, hide } = usePreview();

  useEffect(() => {
    if (!title) return;
    const onScroll = () => hide();
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [title, hide]);

  let style: React.CSSProperties = {};
  if (rect) {
    const width = Math.max(300, rect.width * SCALE);
    const artH = (width * 9) / 16;
    const tileArtCenter = rect.top + Math.min(rect.height, (rect.width * 9) / 16) / 2;
    let left = rect.left + rect.width / 2 - width / 2;
    left = Math.max(12, Math.min(window.innerWidth - width - 12, left));
    const top = Math.max(8, tileArtCenter - artH / 2) + window.scrollY;
    style = { left, top, width };
  }

  return createPortal(
    <AnimatePresence>
      {title && rect && (
        <motion.div
          key={title.id}
          className="preview"
          style={style}
          initial={{ opacity: 0, scale: 1 / SCALE }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1 / SCALE, transition: { duration: 0.15 } }}
          transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
          onMouseLeave={hide}
        >
          <Link to={`/title/${title.id}`} className="preview__art" onClick={hide} tabIndex={-1}>
            <TileArt title={title} shape="landscape" eager />
            <TileBadge title={title} />
            <span className="preview__name">{title.name}</span>
          </Link>
          <div className="preview__body">
            <div className="preview__actions">
              <PlayButton title={title} small />
              <FavoriteButton title={title} small />
              <span className="spacer" />
              <Link to={`/title/${title.id}`} className="icon-btn icon-btn--small" aria-label="More info" onClick={hide}>
                <Icon name="chevronDown" size={18} />
              </Link>
            </div>
            <MetaRow title={title} />
            <p className="preview__tagline">{title.tagline}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
