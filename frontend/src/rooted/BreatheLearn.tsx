import { Evidence } from "./ui";
import { BREATH_SAFETY, LEARN_MORE } from "./breathContent";
import { Icon } from "../components/Icon";

/** Safety first, then free sources worth reading. We link out and summarize in our own words. */
export function BreatheLearn() {
  return (
    <div className="lm">
      <section className="r-card lm__safety" aria-labelledby="lm-safety">
        <h3 id="lm-safety"><Icon name="info" size={18} /> Before any practice</h3>
        <ul>{BREATH_SAFETY.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>
      {LEARN_MORE.map((l) => (
        <a key={l.url} className="r-card lm__item" href={l.url} target="_blank" rel="noopener noreferrer">
          <span className="lm__kind">{l.kind}</span>
          <h3>{l.title}</h3>
          <span className="lm__by">{l.by}</span>
          <p>{l.text} {l.evidence && <Evidence s={l.evidence} />}</p>
        </a>
      ))}
      <p className="lm__note">These are free, public sources. We describe them in our own words and link to the originals rather than copying them. We rate how strong the evidence is for each technique; podcasts and books are good places to start, not proof. Breathing exercises are general wellness information, not medical advice.</p>
    </div>
  );
}
