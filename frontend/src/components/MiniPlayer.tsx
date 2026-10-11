import { AnimatePresence, motion } from "framer-motion";
import { usePlayer } from "../store/player";
import { useArt } from "../art/useArt";
import { specForTitle } from "../art/painter";
import { formatClock, formatHz } from "../format";
import { Icon } from "./Icon";
import "./Player.css";

export function MiniPlayer() {
  const current = usePlayer((s) => s.current);
  const status = usePlayer((s) => s.status);
  const elapsed = usePlayer((s) => s.elapsed);
  const endAt = usePlayer((s) => s.endAt);
  const beat = usePlayer((s) => s.beat);
  const stageIndex = usePlayer((s) => s.stageIndex);
  const volume = usePlayer((s) => s.volume);
  const { togglePlay, stop, setExpanded, setVolume } = usePlayer.getState();
  const art = useArt(current ? specForTitle(current) : null, "landscape");
  const stage = current?.stages?.[stageIndex];

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          className="mini"
          role="region"
          aria-label="Now playing"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          exit={{ y: "110%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
        >
          <div className="mini__progress" aria-hidden="true">
            <span style={{ transform: `scaleX(${endAt ? Math.min(1, elapsed / endAt) : 0})` }} />
          </div>
          <button className="mini__info" onClick={() => setExpanded(true)} aria-label={`Open player: ${current.name}`}>
            <span className="mini__art">{art && <img src={art} alt="" />}</span>
            <span className="mini__text">
              <span className="mini__title">{current.name}</span>
              <span className="mini__sub">
                {stage ? `${stage.label} · ` : ""}
                {formatHz(beat)} beat · {formatClock(elapsed)} / {formatClock(endAt)}
                {status === "ending" && " · fading out"}
              </span>
            </span>
          </button>
          <div className="mini__controls">
            <button className="icon-btn icon-btn--plain" onClick={togglePlay} aria-label={status === "paused" ? "Play" : "Pause"}>
              <Icon name={status === "paused" ? "play" : "pause"} size={26} />
            </button>
            <button className="icon-btn icon-btn--plain mini__hide-sm" onClick={stop} aria-label="Stop">
              <Icon name="stop" size={22} />
            </button>
            <label className="mini__volume mini__hide-sm">
              <Icon name={volume === 0 ? "mute" : "volume"} size={20} />
              <span className="visually-hidden">Volume</span>
              <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(+e.target.value)} />
            </label>
            <button className="icon-btn icon-btn--plain" onClick={() => setExpanded(true)} aria-label="Open full player">
              <Icon name="expand" size={22} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
