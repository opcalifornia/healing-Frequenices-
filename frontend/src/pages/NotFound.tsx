import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";

export default function NotFound() {
  return (
    <PageTransition padded>
      <div style={{ padding: "12vh var(--gutter)", display: "grid", gap: 18, justifyItems: "start" }}>
        <h1 className="page-title" style={{ padding: 0 }}>We couldn't find that page.</h1>
        <p style={{ color: "var(--text-2)" }}>It may have moved, or the link might be wrong.</p>
        <Link to="/" className="btn btn--primary">Back to Home</Link>
      </div>
    </PageTransition>
  );
}
