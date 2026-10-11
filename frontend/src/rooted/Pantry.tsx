import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CAT_LABEL, PANTRY, type PantryCat, type PantryItem } from "./pantryContent";
import { PantryArt } from "./PantryArt";
import { Evidence, Sheet, SourceLink, useToast } from "./ui";
import { TiltCard } from "./motion";
import { groupByAisle, listToText, useNourish, useShoppingList } from "../store/nourish";
import { Icon } from "../components/Icon";
import { APP_NAME } from "../brand";

const CATS = Object.keys(CAT_LABEL) as PantryCat[];

export function Pantry() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<PantryCat | "all">("all");
  const [open, setOpen] = useState<PantryItem | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const list = useShoppingList();
  const add = useNourish((s) => s.addItem);
  const remove = useNourish((s) => s.removeItem);
  const toast = useToast();
  const inList = useMemo(() => new Set(list.map((i) => i.id)), [list]);
  const toGet = list.filter((i) => !i.checked).length;

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return PANTRY.filter((p) => (cat === "all" || p.cat === cat) && (!term || `${p.name} ${p.also ?? ""} ${p.summary}`.toLowerCase().includes(term)));
  }, [q, cat]);

  const toggle = (p: PantryItem) => {
    if (inList.has(p.id)) {
      remove(p.id);
      toast.show(`Removed ${p.name}`);
    } else {
      add({ id: p.id, name: p.name, aisle: p.aisle });
      toast.show(`Added ${p.name} to your list`);
    }
  };

  return (
    <>
      <div className="pantry__bar">
        <label className="pantry__search">
          <Icon name="search" size={18} />
          <input type="search" placeholder="Search foods, herbs and teas" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the pantry" />
        </label>
        <div className="pantry__cats" role="group" aria-label="Filter by category">
          {(["all", ...CATS] as const).map((c) => (
            <button key={c} className={`chip ${cat === c ? "is-on" : ""}`} aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c === "all" ? "All" : CAT_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <motion.ul className="pantry__grid" layout>
        <AnimatePresence initial={false}>
          {shown.map((p) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.25 }}>
              <TiltCard className="pcard" max={5} onClick={() => setOpen(p)} label={`${p.name}: learn more`}>
                <PantryArt cat={p.cat} hue={p.hue} />
                <div className="pcard__text">
                  <strong>{p.name}</strong>
                  <span>{p.summary}</span>
                  <Evidence s={p.evidence} short />
                </div>
                {inList.has(p.id) && <span className="pcard__in" title="On your list"><Icon name="check" size={16} /></span>}
              </TiltCard>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown.length === 0 && <p className="rooted__lead">Nothing matches "{q}" yet. Add it to your list as a custom item from the list panel.</p>}

      <motion.button
        className="list-fab"
        onClick={() => setListOpen(true)}
        aria-label={`Open shopping list, ${toGet} to get`}
        initial={false}
        animate={{ scale: [1, 1.08, 1] }}
        key={list.length}
        transition={{ duration: 0.35 }}
      >
        <Icon name="bookmark" size={20} /> Shopping list <b>{toGet}</b>
      </motion.button>

      <Sheet open={!!open} onClose={() => setOpen(null)} label={open?.name ?? ""}>
        {open && <PantryDetail p={open} inList={inList.has(open.id)} onToggle={() => toggle(open)} />}
      </Sheet>
      <Sheet open={listOpen} onClose={() => setListOpen(false)} label="Shopping list">
        <ShoppingList onBrowse={() => setListOpen(false)} />
      </Sheet>
      {toast.node}
    </>
  );
}

function PantryDetail({ p, inList, onToggle }: { p: PantryItem; inList: boolean; onToggle(): void }) {
  return (
    <article className="pdetail">
      <div className="pdetail__art">
        <PantryArt cat={p.cat} hue={p.hue} className="pantry-art--big" />
        <div className="pdetail__head">
          <span className="rooted__eyebrow">{CAT_LABEL[p.cat]}</span>
          <h2>{p.name}</h2>
          {p.also && <span className="pdetail__also">Also called {p.also}</span>}
        </div>
      </div>
      <div className="pdetail__body">
        <p className="pdetail__summary">{p.summary}</p>
        <button className={`btn ${inList ? "btn--secondary" : "btn--primary"} pdetail__add`} onClick={onToggle}>
          <Icon name={inList ? "check" : "plus"} size={20} /> {inList ? "On your shopping list" : "Add to shopping list"}
        </button>

        <section>
          <h3>What the research says <Evidence s={p.evidence} /></h3>
          <ul className="pdetail__list">{p.benefits.map((b) => <li key={b}>{b}</li>)}</ul>
        </section>
        {p.tradition && (
          <section className="pdetail__trad">
            <h3>In tradition</h3>
            <p>{p.tradition} Traditional use tells you how people have used a plant; it isn't proof that it works.</p>
          </section>
        )}
        <section>
          <h3>How to use it</h3>
          <p>{p.use}</p>
        </section>
        <section className="pdetail__caution">
          <h3><Icon name="info" size={18} /> Before you use it</h3>
          <ul className="pdetail__list">{p.cautions.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>
        <section className="pdetail__find">
          <h3>Where to find it</h3>
          <p>{p.find}</p>
          <span className="pdetail__soon">Coming later: find stores near you that carry it.</span>
        </section>
        <section>
          <h3>Sources</h3>
          <ul className="pdetail__sources">{p.sources.map((s) => <li key={s.text}><SourceLink s={s} /></li>)}</ul>
        </section>
        <p className="pdetail__fine">General information, not medical advice.</p>
      </div>
    </article>
  );
}

type Saver = { save(o: { filename: string; data: string }): Promise<unknown> };
type ClaudeHost = { use?(n: string): Promise<Saver | null> };

/** Saves a text file. Inside the claude.ai preview, files go through the viewer's download prompt. */
async function download(name: string, text: string) {
  const host = (window as unknown as { claude?: ClaudeHost }).claude;
  if (host?.use) {
    const saver = await host.use("downloads").catch(() => null);
    if (saver) {
      await saver.save({ filename: name, data: text }).catch(() => undefined);
      return;
    }
  }
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function ShoppingList({ onBrowse }: { onBrowse?: () => void }) {
  const list = useShoppingList();
  const { toggleItem, removeItem, setQty, clearChecked, clearList, addItem } = useNourish();
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const groups = groupByAisle(list);
  const text = listToText(list, `${APP_NAME} shopping list · ${new Date().toLocaleDateString()}`);
  const done = list.filter((i) => i.checked).length;

  const flash = (m: string) => {
    setNote(m);
    setTimeout(() => setNote(null), 2000);
  };
  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Shopping list", text });
        return;
      } catch {
        /* cancelled */
        return;
      }
    }
    await copy();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      flash("Copied. Paste it into Notes or a message.");
    } catch {
      flash("Couldn't copy. Try Download instead.");
    }
  };

  return (
    <div className="slist">
      <header className="slist__head">
        <span className="rooted__eyebrow">Your list</span>
        <h2>Shopping list</h2>
        <p>{list.length ? `${list.length - done} to get · ${done} in the cart` : "Tap any item in the Pantry to learn about it, then add it here."}</p>
      </header>

      <form
        className="slist__add"
        onSubmit={(e) => {
          e.preventDefault();
          const name = custom.trim();
          if (!name) return;
          addItem({ id: `custom-${name.toLowerCase().replace(/\W+/g, "-")}`, name, aisle: "Other" });
          setCustom("");
        }}
      >
        <input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="Add something else, like lemons" aria-label="Add a custom item" />
        <button className="btn btn--secondary btn--small" type="submit">Add</button>
      </form>

      {groups.map(([aisle, items]) => (
        <section key={aisle} className="slist__group">
          <h3>{aisle}</h3>
          <ul>
            <AnimatePresence initial={false}>
              {items.map((i) => (
                <motion.li key={i.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30, height: 0 }} className={i.checked ? "is-done" : ""}>
                  <button className="slist__check" role="checkbox" aria-checked={i.checked} onClick={() => toggleItem(i.id)} aria-label={`${i.name}: ${i.checked ? "in the cart" : "to get"}`}>
                    {i.checked && <Icon name="check" size={16} />}
                  </button>
                  <span className="slist__name">{i.name}</span>
                  <input className="slist__qty" value={i.qty ?? ""} onChange={(e) => setQty(i.id, e.target.value)} placeholder="qty" aria-label={`Quantity of ${i.name}`} />
                  <button className="icon-btn slist__rm" onClick={() => removeItem(i.id)} aria-label={`Remove ${i.name}`}>
                    <Icon name="trash" size={18} />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </section>
      ))}

      {list.length > 0 ? (
        <>
          <div className="slist__actions">
            <button className="btn btn--primary btn--small" onClick={() => download("shopping-list.txt", text)}>Download</button>
            <button className="btn btn--secondary btn--small" onClick={share}>Share</button>
            <button className="btn btn--secondary btn--small" onClick={copy}>Copy</button>
            <a className="btn btn--secondary btn--small" href={`sms:?&body=${encodeURIComponent(text)}`}>Text it</a>
            <a className="btn btn--secondary btn--small" href={`mailto:?subject=${encodeURIComponent("Shopping list")}&body=${encodeURIComponent(text)}`}>Email</a>
          </div>
          <div className="slist__clear">
            {done > 0 && <button onClick={clearChecked}>Remove {done} checked</button>}
            <button onClick={() => confirm("Clear the whole list?") && clearList()}>Clear list</button>
          </div>
        </>
      ) : (
        onBrowse && <button className="btn btn--primary btn--small" onClick={onBrowse}>Browse the Pantry</button>
      )}
      <AnimatePresence>{note && <motion.p className="slist__note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status">{note}</motion.p>}</AnimatePresence>
    </div>
  );
}
