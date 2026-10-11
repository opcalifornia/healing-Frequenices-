import { useParams } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { Tile } from "../components/Tile";
import { useSection } from "../store/catalog";
import NotFound from "./NotFound";

export default function Collection() {
  const { sectionId = "", railId = "" } = useParams();
  const { section, titles } = useSection(sectionId);
  if (!section) return <PageTransition padded><div /></PageTransition>;
  const rail = section.rails.find((r) => r.id === railId);
  if (!rail) return <NotFound />;
  return (
    <PageTransition padded>
      <h1 className="page-title">{rail.title}</h1>
      <div className={`grid ${rail.shape === "poster" ? "grid--poster" : ""}`} role="list">
        {rail.titleIds.map((id, i) => titles[id] && <Tile key={id} title={titles[id]} shape={rail.shape} index={i} />)}
      </div>
      <Footer />
    </PageTransition>
  );
}
