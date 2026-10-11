import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

/** Shared layout for long-form interactive guides (sticky chapter list + chapters). */

export interface ChapterInfo {
  id: string;
  n: number;
  title: string;
}

export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive(vis[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids]);
  return active;
}

export function Toc({ chapters, active }: { chapters: ChapterInfo[]; active: string }) {
  // On narrow screens the list is a horizontal chip bar: keep the active chip visible.
  useEffect(() => {
    const list = document.querySelector<HTMLElement>(".toc ol");
    const chip = list?.querySelector<HTMLElement>("a.is-on");
    if (!list || !chip || list.scrollWidth <= list.clientWidth) return;
    list.scrollTo({ left: chip.offsetLeft - list.clientWidth / 2 + chip.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav className="toc" aria-label="Chapters">
      <ol>
        {chapters.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              className={active === c.id ? "is-on" : ""}
              aria-current={active === c.id ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(c.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <span>{c.n}</span> {c.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Chapter({ id, n, title, lead, children }: { id: string; n: number; title: string; lead: string; children: ReactNode }) {
  return (
    <motion.section
      id={id}
      className="chapter"
      aria-labelledby={`${id}-h`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <span className="chapter__num">Chapter {n}</span>
      <h2 id={`${id}-h`} className="chapter__title">{title}</h2>
      <p className="chapter__lead">{lead}</p>
      {children}
    </motion.section>
  );
}
