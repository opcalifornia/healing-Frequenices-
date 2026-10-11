import { Link } from "react-router-dom";
import { PageTransition } from "../components/PageTransition";
import { Footer } from "../components/Footer";
import { PlayButton } from "../components/TitleActions";
import { StartWindDownButton } from "../components/Bedtime";
import { Chapter, Toc, useScrollSpy, type ChapterInfo } from "../learn/GuideParts";
import { BodyClock, CaffeineCalculator, DayTimeline, LightLevels, TipList } from "../learn/diagrams/SleepDiagrams";
import { SLEEP_SOURCES, SLEEP_TIPS } from "../learn/sleepContent";
import { usePlan } from "../store/bedtime";
import { useCatalog } from "../store/catalog";
import "../components/Player.css";
import "./Bedtime.css";
import "./BrainGuide.css";
import "./SleepGuide.css";

const CHAPTERS: ChapterInfo[] = [
  { id: "clock", n: 1, title: "Your body clock" },
  { id: "morning", n: 2, title: "Morning light" },
  { id: "evening", n: 3, title: "Evening light and blue light" },
  { id: "caffeine", n: 4, title: "Caffeine timing" },
  { id: "temperature", n: 5, title: "Temperature" },
  { id: "naps", n: 6, title: "Naps and deep rest" },
  { id: "habits", n: 7, title: "Habits that matter most" },
  { id: "day", n: 8, title: "Your day, timed" },
];
const IDS = CHAPTERS.map((c) => c.id);

export default function SleepGuide() {
  const active = useScrollSpy(IDS);
  const plan = usePlan();
  const catalog = useCatalog();
  const t = (id: string) => catalog?.titles[id];

  return (
    <PageTransition>
      <header className="sleep__hero">
        <div className="sleep__sun" aria-hidden="true" />
        <div className="guide__hero-text">
          <Link to="/learn" className="article__crumb">Learn · Guide</Link>
          <h1>Better Sleep</h1>
          <p>
            How light, temperature, caffeine and timing set your body clock, and simple habits that help you fall asleep faster
            and wake up sharper. Practical tools popularized by neuroscientist Andrew Huberman, checked against the research
            behind them.
          </p>
          <span className="article__meta">8 chapters · about 15 min · built around your bedtime of {plan.bedtime}</span>
        </div>
      </header>

      <div className="guide">
        <Toc chapters={CHAPTERS} active={active} />
        <div className="guide__body">
          <aside className="sleep__credit">
            <strong>About the sources.</strong> Many tips here come from the Huberman Lab podcast and newsletter by Andrew Huberman, PhD, a
            neuroscientist at Stanford School of Medicine. His advice mixes published research with his own practice, so we mark each tip
            with how strong the evidence is. Healing Frequencies is not affiliated with Huberman Lab. This guide is general information, not
            medical advice.
          </aside>

          <Chapter id="clock" n={1} title="Your body clock" lead="Deep in your brain, a cluster of about 20,000 neurons, the suprachiasmatic nucleus, keeps a roughly 24-hour rhythm that times your hormones, temperature and sleepiness.">
            <BodyClock plan={plan} />
            <div className="prose">
              <p>
                Your clock runs a little longer than 24 hours on its own, so it needs resetting every day. Its main input is light reaching
                your eyes. Special cells in the retina contain a pigment called <strong>melanopsin</strong>. They are most sensitive to
                blue-cyan light around 480 nm, the color that dominates the daytime sky, and they report straight to the clock.
              </p>
              <p>
                That is why the same light can help or hurt: bright light in the morning moves your clock earlier and wakes you up, while
                bright light late at night pushes it later and holds back melatonin.
              </p>
            </div>
          </Chapter>

          <Chapter id="morning" n={2} title="Morning light" lead="Blue-rich daylight is your best tool in the morning. It sets the clock, lifts alertness and makes it easier to fall asleep that night.">
            <LightLevels />
            <TipList tips={SLEEP_TIPS.morning} />
          </Chapter>

          <Chapter id="evening" n={3} title="Evening light and blue light" lead="At night, the goal is the opposite: less light, lower down, warmer. Overall brightness matters more than any filter.">
            <TipList tips={SLEEP_TIPS.evening} />
          </Chapter>

          <Chapter id="caffeine" n={4} title="Caffeine timing" lead="Caffeine works by blocking adenosine, the chemical that builds up sleep pressure through the day. It lingers far longer than most people think.">
            <CaffeineCalculator bedtime={plan.bedtime} />
            <TipList tips={SLEEP_TIPS.caffeine} />
          </Chapter>

          <Chapter id="temperature" n={5} title="Temperature" lead="Falling asleep is tied to a drop in core body temperature. Help it along.">
            <TipList tips={SLEEP_TIPS.temperature} />
          </Chapter>

          <Chapter id="naps" n={6} title="Naps and deep rest" lead="Short rest can restore you without costing your night.">
            <TipList tips={SLEEP_TIPS.naps} />
            <div className="try-row">
              {t("yoga-nidra-delta") && <PlayButton title={t("yoga-nidra-delta")!} small label="Try Yoga Nidra Delta" />}
              {t("power-nap") && <PlayButton title={t("power-nap")!} small label="Try Power Nap" />}
            </div>
          </Chapter>

          <Chapter id="habits" n={7} title="Habits that matter most" lead="The unglamorous basics have the strongest evidence of all.">
            <TipList tips={SLEEP_TIPS.habits} />
          </Chapter>

          <Chapter id="day" n={8} title="Your day, timed" lead={`Everything above, scheduled around your ${plan.wake} wake-up and ${plan.bedtime} lights out.`}>
            <DayTimeline plan={plan} />
            <div className="try-row">
              <StartWindDownButton small />
              <Link to="/bedtime" className="btn btn--secondary btn--small">Change my times</Link>
            </div>
            <details className="sources">
              <summary>Sources and further reading</summary>
              <ol>
                {SLEEP_SOURCES.map((s) => (
                  <li key={s.text}>
                    {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.text}</a> : s.text}
                  </li>
                ))}
              </ol>
            </details>
          </Chapter>
        </div>
      </div>
      <Footer />
    </PageTransition>
  );
}
