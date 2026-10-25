import { useMemo, useState, type CSSProperties } from "react";
import { Icon } from "../components/Icon";
import { Evidence, Sheet, SourceLink } from "./ui";
import type { Block, Expert, GlossaryTerm, Lesson, Level, Myth } from "./breatheLessons/types";
import { useLessons, useReadLessons } from "../store/lessons";
import "./BreatheLearnHub.css";

export interface LearnData {
  lessons: Lesson[];
  experts: Expert[];
  societies: Array<{ name: string; blurb: string; url: string }>;
  myths: Myth[];
  glossary: GlossaryTerm[];
}

type View = "lessons" | "people" | "myths" | "glossary";
const LEVELS: Array<"All" | Level> = ["All", "Start here", "Go deeper", "Expert"];

function BlockView({ b }: { b: Block }) {
  switch (b.type) {
    case "h": return <h3 className="bl-h">{b.text}</h3>;
    case "p": return <p>{b.text}</p>;
    case "list": return <ul className="bl-list">{b.items.map((i) => <li key={i}>{i}</li>)}</ul>;
    case "fact": return <div className="bl-fact"><b>{b.stat}</b><span>{b.label}</span></div>;
    case "callout": return <p className={`bl-callout bl-callout--${b.tone}`}><strong>{{ key: "Remember", try: "Try it", care: "Keep in mind" }[b.tone]}</strong> {b.text}</p>;
  }
}

function Reader({ lesson, all, experts, onOpen, onTry }: { lesson: Lesson; all: Lesson[]; experts: Expert[]; onOpen(l: Lesson): void; onTry(l: Lesson): void }) {
  const read = useReadLessons();
  const mark = useLessons((s) => s.mark);
  const done = read.includes(lesson.id);
  const idx = all.findIndex((l) => l.id === lesson.id);
  const next = all[idx + 1];
  const people = (lesson.people ?? []).map((id) => experts.find((e) => e.id === id)).filter((e): e is Expert => !!e);
  return (
    <article className="bl-reader" style={{ "--h": lesson.hue } as CSSProperties}>
      <header className="bl-reader__head">
        <span className="bl-reader__meta">{lesson.level} · {lesson.minutes} min read</span>
        <h2>{lesson.title}</h2>
        <p className="bl-reader__tag">{lesson.tagline}</p>
        <Evidence s={lesson.evidence} />
      </header>
      <div className="bl-reader__body">
        {lesson.blocks.map((b, i) => <BlockView key={i} b={b} />)}
        {lesson.tryIt && <button className="btn btn--primary" onClick={() => onTry(lesson)}><Icon name="play" size={18} /> {lesson.tryIt.label}</button>}
        {people.length > 0 && (
          <section className="bl-people">
            <h3 className="bl-h">Who studies this</h3>
            <ul>{people.map((p) => <li key={p.id}><b>{p.name}</b> <span>{p.role}, {p.institution}</span></li>)}</ul>
          </section>
        )}
        <section className="bl-src">
          <h3 className="bl-h">Sources</h3>
          <ul>{lesson.sources.map((s) => <li key={s.url}><SourceLink s={s} /></li>)}</ul>
          <p className="bl-fine">General education, not medical advice. Ask your clinician about your own health.</p>
        </section>
        <div className="bl-reader__foot">
          <button className={`btn ${done ? "btn--primary" : "btn--secondary"}`} aria-pressed={done} onClick={() => mark(lesson.id, !done)}><Icon name="check" size={18} /> {done ? "Marked as read" : "Mark as read"}</button>
          {next && <button className="btn btn--secondary" onClick={() => { mark(lesson.id); onOpen(next); }}>Next: {next.title}</button>}
        </div>
      </div>
    </article>
  );
}

/** The big Learn area: lessons, the people who study breathing, myths and a glossary. */
export function LearnHub({ data, onTry }: { data: LearnData; onTry(l: Lesson): void }) {
  const [view, setView] = useState<View>("lessons");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<Lesson | null>(null);
  const read = useReadLessons();
  const lessons = useMemo(() => {
    const w = q.toLowerCase().split(/\s+/).filter(Boolean);
    return data.lessons.filter((l) => (level === "All" || l.level === level) && w.every((x) => `${l.title} ${l.tagline} ${l.blocks.map((b) => ("text" in b ? b.text : "items" in b ? b.items.join(" ") : "")).join(" ")}`.toLowerCase().includes(x)));
  }, [data.lessons, level, q]);
  const glossary = useMemo(() => [...data.glossary].sort((a, b) => a.term.localeCompare(b.term)), [data.glossary]);
  const total = data.lessons.length;
  const minutes = data.lessons.reduce((a, l) => a + l.minutes, 0);
  const first = data.lessons.find((l) => !read.includes(l.id));

  return (
    <div className="bl">
      <div className="bl-top">
        <div className="bl-prog"><b>{read.filter((id) => data.lessons.some((l) => l.id === id)).length}</b> of {total} lessons read <i style={{ "--p": `${(read.filter((id) => data.lessons.some((l) => l.id === id)).length / Math.max(1, total)) * 100}%` } as CSSProperties} /></div>
        <p>{total} lessons, about {Math.round(minutes / 60 * 10) / 10} hours of reading. Lungs, brain, heart and how they work together.</p>
        {first && <button className="btn btn--primary" onClick={() => setOpen(first)}>{read.length ? "Continue" : "Start"} with {first.title}</button>}
      </div>
      <div className="bl-tabs" role="tablist" aria-label="Learn sections">
        {([["lessons", "Lessons"], ["people", "Who studies this"], ["myths", "Myths vs facts"], ["glossary", "Glossary"]] as Array<[View, string]>).map(([id, label]) => (
          <button key={id} role="tab" aria-selected={view === id} className={view === id ? "is-on" : ""} onClick={() => setView(id)}>{label}</button>
        ))}
      </div>

      {view === "lessons" && (
        <>
          <div className="bl-filters">
            <input type="search" aria-label="Search lessons" placeholder="Search lessons" value={q} onChange={(e) => setQ(e.target.value)} />
            <div role="group" aria-label="Level">{LEVELS.map((l) => <button key={l} className={`chip ${level === l ? "is-on" : ""}`} aria-pressed={level === l} onClick={() => setLevel(l)}>{l}</button>)}</div>
          </div>
          {lessons.length === 0 && <p className="bl-empty">No lessons match. Try a different word.</p>}
          <ul className="bl-grid">
            {lessons.map((l) => (
              <li key={l.id}>
                <button className="bl-card" style={{ "--h": l.hue } as CSSProperties} onClick={() => setOpen(l)}>
                  <span className="bl-card__a" aria-hidden="true"><i /><i /></span>
                  <span className="bl-card__k">{l.level} · {l.minutes} min{read.includes(l.id) ? " · Read" : ""}</span>
                  <strong>{l.title}</strong>
                  <span className="bl-card__t">{l.tagline}</span>
                  <span className="bl-card__f"><Evidence s={l.evidence} short /></span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {view === "people" && (
        <div className="bl-people-grid">
          <p className="bl-lede">Real researchers and clinicians who study breathing, the brain and the heart. We link only to what we opened and checked. Their work is a starting point, and any one person can be wrong.</p>
          {data.experts.map((e) => (
            <article key={e.id} className="r-card bl-expert">
              <h3>{e.name}</h3>
              <span className="bl-expert__role">{e.role} · {e.institution}</span>
              <p><b>Known for.</b> {e.known}</p>
              <p><b>What to learn from them.</b> {e.teaches}</p>
              {e.caution && <p className="bl-callout bl-callout--care"><strong>Keep in mind</strong> {e.caution}</p>}
              {e.free.length > 0 && <ul>{e.free.map((s) => <li key={s.url}><SourceLink s={s} /></li>)}</ul>}
            </article>
          ))}
          {data.societies.length > 0 && (
            <section className="r-card bl-expert">
              <h3>Professional societies with free patient pages</h3>
              <ul>{data.societies.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer"><b>{s.name}</b></a>. {s.blurb}</li>)}</ul>
            </section>
          )}
        </div>
      )}

      {view === "myths" && (
        <ul className="bl-myths">
          {data.myths.map((m) => (
            <li key={m.myth} className="r-card">
              <p className="bl-myth"><span>Myth</span> {m.myth}</p>
              <p className="bl-truth"><span>What research shows</span> {m.truth} <Evidence s={m.evidence} short /></p>
              {m.source && <SourceLink s={m.source} />}
            </li>
          ))}
        </ul>
      )}

      {view === "glossary" && (
        <dl className="bl-gloss">
          {glossary.map((g) => <div key={g.term}><dt>{g.term}</dt><dd>{g.plain}</dd></div>)}
        </dl>
      )}

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.title ?? "Lesson"} wide>
        {open && <Reader lesson={open} all={data.lessons} experts={data.experts} onOpen={(l) => setOpen(l)} onTry={onTry} />}
      </Sheet>
    </div>
  );
}
