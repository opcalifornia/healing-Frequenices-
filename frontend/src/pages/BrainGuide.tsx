import { useEffect, useState } from "react";
import { Chapter, Toc, useScrollSpy } from "../learn/GuideParts";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";
import { Footer, SafetyList } from "../components/Footer";
import { PlayButton } from "../components/TitleActions";
import { BrainLateral } from "../learn/diagrams/BrainLateral";
import { Hemispheres } from "../learn/diagrams/Hemispheres";
import { AuditoryPathway } from "../learn/diagrams/AuditoryPathway";
import { BeatLab } from "../learn/diagrams/BeatLab";
import { BandExplorer, PULSE_SECONDS } from "../learn/diagrams/BandExplorer";
import { BreathPacer, EvidenceTable, FrequencyLadder, Hypnogram } from "../learn/diagrams/BodyRhythms";
import { BANDS, REGIONS, SOURCES, type Region } from "../learn/brainContent";
import { useCatalog } from "../store/catalog";
import { BAND_LABEL } from "../format";
import "../components/Player.css";
import "./Build.css";
import "./BrainGuide.css";

const CHAPTERS = [
  { id: "map", n: 1, title: "Your brain, mapped" },
  { id: "hemispheres", n: 2, title: "Two hemispheres, one brain" },
  { id: "hearing", n: 3, title: "How two tones become one beat" },
  { id: "brainwaves", n: 4, title: "Brainwaves: the brain's rhythms" },
  { id: "sleep", n: 5, title: "A night in brainwaves" },
  { id: "body", n: 6, title: "The rhythms of your body" },
  { id: "evidence", n: 7, title: "What the research really says" },
  { id: "use", n: 8, title: "Using sessions well" },
];

function HeroBrain() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(2);
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(() => setI((x) => (x + 1) % BANDS.length), 3500);
    return () => window.clearInterval(t);
  }, [reduce]);
  const b = BANDS[i];
  return (
    <div className="guide__hero-brain">
      <BrainLateral highlight={b.regions} color={b.color} pulse={PULSE_SECONDS[b.band]} label={`${BAND_LABEL[b.band]} · ${b.range}`} title="Brain diagram cycling through the five brainwave bands" />
    </div>
  );
}

function LobeExplorer() {
  const [sel, setSel] = useState<Region>("temporal");
  const r = REGIONS[sel];
  return (
    <div className="diagram diagram--split">
      <div>
        <BrainLateral selected={sel} onSelect={setSel} color="#8b6cff" showLabels title="Interactive brain map: select a region" />
        <p className="band__caption">Tap a region. Left-side view, front of the head on the left.</p>
      </div>
      <div className="lobe">
        <div className="seg seg--wrap" role="tablist" aria-label="Brain regions">
          {(Object.keys(REGIONS) as Region[]).map((k) => (
            <button key={k} role="tab" aria-selected={sel === k} className={sel === k ? "is-on" : ""} onClick={() => setSel(k)}>
              {REGIONS[k].name.replace(" lobe", "")}
            </button>
          ))}
        </div>
        <h3>{r.name}</h3>
        <p>{r.does}</p>
        {r.hearing && <p className="lobe__hearing">{r.hearing}</p>}
      </div>
    </div>
  );
}

const CHAPTER_IDS = CHAPTERS.map((c) => c.id);

export default function BrainGuide() {
  const active = useScrollSpy(CHAPTER_IDS);

  const catalog = useCatalog();
  const t = (id: string) => catalog?.titles[id];

  return (
    <PageTransition>
      <header className="guide__hero">
        <div className="guide__hero-text">
          <Link to="/learn" className="article__crumb">Learn · Interactive guide</Link>
          <h1>Inside Your Brain</h1>
          <p>
            How your brain is built, why it has two halves, how two tones in your headphones become one beat, and the
            rhythms your brain and body run on every day. With diagrams, plain-language science, and honest notes on what
            the research does and doesn't show.
          </p>
          <span className="article__meta">8 chapters · about 20 min</span>
        </div>
        <HeroBrain />
      </header>

      <div className="guide">
        <Toc chapters={CHAPTERS} active={active} />

        <div className="guide__body">
          <Chapter id="map" n={1} title="Your brain, mapped" lead="About 86 billion neurons, 1.3 kg, roughly 2% of your body weight, yet it uses around a fifth of your energy at rest.">
            <LobeExplorer />
            <div className="prose">
              <p>
                The wrinkled outer layer, the <strong>cortex</strong>, is only 2–4 mm thick but is folded so it fits inside
                your skull. Neuroscientists divide it into four lobes, each with its own specialties, though almost
                everything you do uses many areas at once.
              </p>
              <p>
                Neurons talk with tiny electrical pulses. When millions of them in the cortex fire in step, their combined
                activity is strong enough to measure through the scalp. Those measurable rhythms are the "brainwaves" you
                will meet in chapter 4.
              </p>
            </div>
          </Chapter>

          <Chapter id="hemispheres" n={2} title="Two hemispheres, one brain" lead="Your brain is two near-mirror halves joined by a thick cable of nerve fibres. Here is how they share the work, and where the popular ideas go wrong.">
            <Hemispheres />
            <div className="prose">
              <h3>What split-brain research taught us</h3>
              <p>
                In the 1960s, some people with severe epilepsy had their corpus callosum cut to stop seizures spreading.
                Studies by Roger Sperry and Michael Gazzaniga showed that each half could perceive and respond on its own:
                an object shown only to the right hemisphere could be picked out by the left hand, yet the patient
                couldn't name it, because speech usually lives on the left. Sperry shared the 1981 Nobel Prize for this
                work.
              </p>
              <h3>The left-brain / right-brain myth</h3>
              <p>
                That research grew into the pop idea that logical people are "left-brained" and creative people
                "right-brained". A 2013 University of Utah study of more than 1,000 brain scans found no sign of people
                favouring one whole hemisphere. Specific functions lean to one side; whole personalities don't.
              </p>
              <h3>Where "hemispheric synchronization" comes from</h3>
              <p>
                In the 1970s, audio programs marketed binaural beats as a way to make the two hemispheres work in step.
                The beat is real, but it is created in the brainstem, below both hemispheres, and then relayed up to
                both sides. Whether that makes the hemispheres more synchronized is a separate claim, and the few studies
                that tested it disagree.
              </p>
            </div>
          </Chapter>

          <Chapter id="hearing" n={3} title="How two tones become one beat" lead="No beat is played in the headphones. Each ear gets one steady tone, and your brainstem creates the third rhythm by comparing the two.">
            <AuditoryPathway />
            <h3 className="chapter__sub">Beat Lab</h3>
            <p className="chapter__subtext">Move the sliders to see the relationship. Put headphones on to hear it.</p>
            <BeatLab />
            <div className="prose">
              <h3>Why it only works in headphones</h3>
              <p>
                Through speakers, both tones reach both ears and physically mix in the air, so you hear an ordinary
                acoustic beat: the sound itself gets louder and quieter. With headphones, each ear hears only one perfectly
                steady tone. The pulsing you notice is built by your own auditory system.
              </p>
              <h3>The limits</h3>
              <p>
                Binaural beats are clearest with carriers below about 1,000 Hz, because nerve fibres can only lock to each
                cycle of lower tones. Differences beyond about 30 Hz stop sounding like a beat and turn into roughness or
                two separate tones. That is why our sessions use 100–400 Hz carriers and 0.5–40 Hz beats.
              </p>
            </div>
          </Chapter>

          <Chapter id="brainwaves" n={4} title="Brainwaves: the brain's rhythms" lead="An EEG records the summed electrical activity of millions of cortical neurons through the scalp, measured in millionths of a volt. Those signals contain rhythms, grouped into five bands.">
            <BandExplorer />
            <div className="prose">
              <p>
                German psychiatrist <strong>Hans Berger</strong> recorded the first human EEG in 1924 and published it in
                1929. The first rhythm he saw, a steady 10-per-second wave that vanished when the subject opened their eyes,
                is still called the Berger rhythm, or alpha.
              </p>
              <p>
                Important: your brain never runs in just one band. Every band is present all the time, and the mix shifts
                with what you are doing and where on the head you measure. "Being in alpha" means alpha is relatively
                strong, not that everything else has stopped.
              </p>
            </div>
          </Chapter>

          <Chapter id="sleep" n={5} title="A night in brainwaves" lead="Sleep is not one state. Every night you cycle through stages, each with its own brainwave signature, roughly every 90 minutes.">
            <Hypnogram />
            <div className="prose">
              <p>
                Deep N3 sleep, full of large delta waves, is concentrated in the first few hours. REM sleep, with its
                vivid dreams, grows longer toward morning. Our delta sessions are designed for the wind-down that leads
                into this cycle; they don't control which stage you are in.
              </p>
            </div>
            <div className="try-row">
              {t("deep-sync-5") && <PlayButton title={t("deep-sync-5")!} small label="Try Night Descent" />}
              {t("deep-rest") && <PlayButton title={t("deep-rest")!} small label="Try Deep Rest" />}
            </div>
          </Chapter>

          <Chapter id="body" n={6} title="The rhythms of your body" lead="Brainwaves are just one layer. Your body keeps time on scales from once a day to hundreds of times a second, and the app's frequencies sit inside that range.">
            <FrequencyLadder />
            <h3 className="chapter__sub">Heart and breath</h3>
            <BreathPacer />
            <div className="prose">
              <p>
                Your heart doesn't tick like a metronome: it speeds up slightly as you breathe in and slows as you breathe
                out. That variation, <strong>heart-rate variability (HRV)</strong>, is a sign of a flexible nervous system.
                Slow breathing near six breaths a minute makes those swings largest, which is why it is used in HRV
                biofeedback. It pairs naturally with an alpha session.
              </p>
            </div>
            <div className="try-row">
              {t("alpha-shore") && <PlayButton title={t("alpha-shore")!} small label="Breathe along with Alpha Shore" />}
            </div>
          </Chapter>

          <Chapter id="evidence" n={7} title="What the research really says" lead="Binaural beats are real; what they do to your brain beyond the beat itself is still being worked out. Here is the evidence, claim by claim.">
            <EvidenceTable />
            <div className="prose">
              <p>
                Why are results so mixed? Many studies are small, use different frequencies, durations and noise beds,
                and are hard to blind, because people know what they're listening to. Expectation and simply resting with
                headphones on can genuinely help on their own. That is why we say sessions <em>may support</em>
                relaxation, focus, or sleep, and never that they treat anything.
              </p>
            </div>
          </Chapter>

          <Chapter id="use" n={8} title="Using sessions well" lead="Practical habits that match the science.">
            <ol className="tips">
              <li><strong>Use headphones and check left/right.</strong> The player's L/R test takes five seconds.</li>
              <li><strong>Keep it quiet.</strong> The tones should sit just above the threshold of hearing. Louder is not stronger.</li>
              <li><strong>Pick the band for the job.</strong> Delta and theta to wind down, alpha to relax, beta to focus, gamma in short bursts.</li>
              <li><strong>Give it 15–30 minutes.</strong> Most studies used sessions in this range. Deep Sync programs ease you through bands gradually.</li>
              <li><strong>Pair it with a routine.</strong> Same time, same place, slow breathing. Habits do much of the work.</li>
              <li><strong>Notice, don't force.</strong> If a session makes you uncomfortable, anxious or dizzy, stop.</li>
            </ol>
            <div className="guide__safety">
              <SafetyList />
            </div>
            <div className="try-row">
              {t("deep-sync-1") && <PlayButton title={t("deep-sync-1")!} small label="Start with Deep Sync I" />}
              <Link to="/build" className="btn btn--secondary btn--small">Build your own</Link>
              <Link to="/frequencies" className="btn btn--secondary btn--small">Browse by band</Link>
            </div>
            <details className="sources">
              <summary>Sources and further reading</summary>
              <ol>{SOURCES.map((s) => <li key={s}>{s}</li>)}</ol>
            </details>
          </Chapter>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}
