import { useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Aurora, ZoomPage } from "../rooted/motion";
import { Evidence } from "../rooted/ui";
import { programById, dayMinutes } from "../rooted/programs";
import { cleanInvite, clearPendingInvite, pendingInvite, savePendingInvite } from "../rooted/invite";
import { usePrograms } from "../store/programs";
import { useActiveProfile } from "../store/user";
import { Icon } from "../components/Icon";
import "../rooted/rooted.css";
import "./Join.css";

/** The page a friend lands on from a "Join me" link. Works before they have a profile. */
export default function Join() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const profile = useActiveProfile();
  const fromUrl = useMemo(() => cleanInvite(Object.fromEntries(params.entries())), [params]);
  const invite = Object.keys(fromUrl).length ? fromUrl : pendingInvite() ?? {};
  const program = invite.p ? programById(invite.p) : undefined;

  // Remember the invite so it survives choosing a profile or creating an account.
  useEffect(() => {
    if (Object.keys(fromUrl).length) savePendingInvite(fromUrl);
  }, [fromUrl]);

  const start = () => {
    if (!profile) {
      navigate("/profiles", { state: { from: "/join" } });
      return;
    }
    if (program) {
      usePrograms.getState().enroll(program.id);
      clearPendingInvite();
      navigate(`/program/${program.id}`);
    } else {
      clearPendingInvite();
      navigate("/welcome");
    }
  };

  const who = invite.from ? invite.from : "A friend";
  const avgMin = program ? Math.round(program.days.reduce((a, d) => a + dayMinutes(d), 0) / program.days.length) : 0;

  return (
    <ZoomPage className="rooted join">
      <div className="join__inner" style={program ? ({ "--h": program.hue, "--h2": program.hue2 } as React.CSSProperties) : undefined}>
      <header className="sec-hero join__hero">
        <Aurora />
        <div className="sec-hero__text">
          <motion.span className="rooted__eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            {who} invited you
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            {program ? <>Do <em>{program.title}</em> together.</> : "Small, proven habits for body and mind."}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            {program
              ? `${program.tagline.replace(/[.!?]?$/, ".")} ${program.days.length} days, about ${avgMin} minutes a day.`
              : "Breathing, movement, food, sleep and calm, with the evidence shown on every one. Free to start."}
          </motion.p>
          <motion.div className="join__cta" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <button className="btn btn--primary btn--big" onClick={start}>
              <Icon name="play" size={22} /> {program ? "Start day 1" : "Get started"}
            </button>
            {!profile && <span className="join__note">Takes a few seconds. No account needed to try it.</span>}
          </motion.div>
        </div>
      </header>

      {program && (
        <section className="sec-block join__preview">
          <div className="r-card join__card">
            <div className="join__meta">
              <span><strong>{program.days.length}</strong> days</span>
              <span><strong>~{avgMin}</strong> min a day</span>
              <Evidence s={program.evidence} />
            </div>
            <p>{program.about}</p>
            <ol className="join__days">
              {program.days.slice(0, 4).map((d, i) => (
                <li key={d.title}><span>{i + 1}</span>{d.title}</li>
              ))}
              {program.days.length > 4 && <li className="join__more">and {program.days.length - 4} more</li>}
            </ol>
            <p className="join__by">By {program.author.name} · {program.author.role}</p>
          </div>
        </section>
      )}

      <section className="sec-block join__why">
        <div className="join__points">
          <div><Icon name="check" size={20} /><span><strong>Honest.</strong> Every claim shows how strong the evidence is.</span></div>
          <div><Icon name="check" size={20} /><span><strong>Private.</strong> Your data stays on your device unless you choose to sync it.</span></div>
          <div><Icon name="check" size={20} /><span><strong>Small.</strong> A few minutes a day, built around your schedule.</span></div>
        </div>
        <p className="join__fine">Wellness education, not medical advice. <Link to="/disclaimer">Health disclaimer</Link> · <Link to="/privacy">Privacy</Link></p>
      </section>
      </div>
    </ZoomPage>
  );
}
