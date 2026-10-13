import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PROGRAMS, type Program } from "./programs";
import { nextDay, useEnrollments } from "../store/programs";
import { TiltCard } from "./motion";

/** Program cards for a section, with progress. */
export function ProgramRail({ section }: { section?: Program["section"] }) {
  const enrolled = useEnrollments();
  const list = PROGRAMS.filter((p) => !section || p.section === section || !p.live);
  return (
    <div className="prog-rail">
      {list.map((p, i) => {
        const e = enrolled[p.id];
        const done = e ? Object.keys(e.done).length : 0;
        const nd = nextDay(e, p.days.length || 1);
        const card = (
          <TiltCard className={`prog ${p.live ? "" : "is-soon"}`} style={{ "--h": p.hue, "--h2": p.hue2 } as React.CSSProperties} max={5}>
            <span className="tech__short">{p.live ? `${p.days.length} days` : "Coming soon"} · {p.section}</span>
            <h3>{p.title}</h3>
            <p>{p.tagline}</p>
            {p.live && (
              <div className="prog__progress">
                <span className="prog__dots">{p.days.map((_, k) => <i key={k} className={e?.done[k] ? "on" : ""} />)}</span>
                <small>{nd.finished ? "Completed" : e ? `Next: day ${nd.index + 1}` : "Start today"}</small>
              </div>
            )}
            <span className="prog__by">By {p.author.name}</span>
          </TiltCard>
        );
        return (
          <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
            {p.live ? <Link to={`/program/${p.id}`} className="tilt-link" aria-label={`${p.title}${done ? `, ${done} of ${p.days.length} days done` : ""}`}>{card}</Link> : card}
          </motion.div>
        );
      })}
      <div className="prog prog--pro">
        <span className="tech__short">For professionals</span>
        <h3>Teach on Rooted</h3>
        <p>Yoga teachers, dietitians, breathwork coaches and therapists: build programs for your clients here.</p>
        <span className="prog__by">Coming soon</span>
      </div>
    </div>
  );
}
