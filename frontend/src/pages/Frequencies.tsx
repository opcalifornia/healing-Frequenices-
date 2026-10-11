import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";

export default function Frequencies() {
  return (
    <PageTransition padded>
      <h1 className="page-title">Frequencies</h1>
      <div style={{ padding: "0 var(--gutter)", display: "grid", gridTemplateColumns: "repeat(var(--per-view), 1fr)", gap: "var(--rail-gap)" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="skeleton" style={{ aspectRatio: "16 / 9" }} />
        ))}
      </div>
      <Footer />
    </PageTransition>
  );
}
