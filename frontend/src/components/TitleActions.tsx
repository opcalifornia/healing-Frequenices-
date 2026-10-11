import { useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { useLibrary, useUser } from "../store/user";
import { usePlayer } from "../store/player";
import type { Title } from "../types";

export function PlayButton({ title, small, label }: { title: Title; small?: boolean; label?: string }) {
  const playTitle = usePlayer((s) => s.playTitle);
  const resume = useLibrary().continue.find((c) => c.titleId === title.id);
  const navigate = useNavigate();
  if (title.comingSoon) {
    return (
      <button className={`btn btn--primary ${small ? "btn--small" : ""}`} onClick={() => navigate(`/title/${title.id}`)}>
        <Icon name="info" size={small ? 18 : 22} /> {small ? "Details" : "Episodes & Details"}
      </button>
    );
  }
  return (
    <button
      className={`btn btn--primary ${small ? "btn--small" : ""}`}
      onClick={() => playTitle(title, resume?.position)}
      aria-label={`${resume ? "Resume" : "Play"} ${title.name}`}
    >
      <Icon name="play" size={small ? 18 : 22} /> {label ?? (resume ? "Resume" : "Listen Now")}
    </button>
  );
}

export function FavoriteButton({ title, small }: { title: Title; small?: boolean }) {
  const has = useLibrary().favorites.includes(title.id);
  const toggle = useUser((s) => s.toggleFavorite);
  const verb = title.comingSoon ? "Remind me" : "My Stuff";
  return (
    <button
      className={`icon-btn ${small ? "icon-btn--small" : ""}`}
      aria-pressed={has}
      aria-label={has ? `Remove ${title.name} from My Stuff` : `Add ${title.name} to My Stuff`}
      title={has ? "Remove from My Stuff" : verb}
      onClick={() => toggle(title.id)}
    >
      <Icon name={has ? "check" : title.comingSoon ? "bell" : "plus"} size={small ? 18 : 22} />
    </button>
  );
}

export function RemindButton({ title }: { title: Title }) {
  const has = useLibrary().favorites.includes(title.id);
  const toggle = useUser((s) => s.toggleFavorite);
  return (
    <button className={`btn ${has ? "btn--secondary" : "btn--primary"}`} aria-pressed={has} onClick={() => toggle(title.id)}>
      <Icon name={has ? "check" : "bell"} size={22} /> {has ? "Reminder set" : "Remind Me"}
    </button>
  );
}
