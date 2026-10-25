import { useEffect, useMemo, useRef } from "react";
import { Icon } from "../components/Icon";
import { useHeartLive } from "../store/heartLive";
import { useHrSessions, useMyHrSessions } from "../store/heartSessions";
import { pointers, summarize, type Pt } from "./hrInsights";
import "./HeartLive.css";

/** A line of heart rate over time, with the first-30-second and last-30-second averages marked when known. */
export function HrGraph({ pts, start, end, height = 120 }: { pts: Pt[]; start?: number; end?: number; height?: number }) {
  if (pts.length < 2) return <div className="hl-graph hl-graph--empty" style={{ height }}>Waiting for readings…</div>;
  const W = 600;
  const lo = Math.min(...pts.map((p) => p.bpm), start ?? 999, end ?? 999) - 4;
  const hi = Math.max(...pts.map((p) => p.bpm), start ?? 0, end ?? 0) + 4;
  const t1 = pts[pts.length - 1].s || 1;
  const x = (s: number) => (s / t1) * W;
  const y = (b: number) => height - ((b - lo) / Math.max(1, hi - lo)) * (height - 10) - 5;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${x(p.s).toFixed(1)} ${y(p.bpm).toFixed(1)}`).join(" ");
  return (
    <svg className="hl-graph" viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" role="img" aria-label={`Heart rate from ${Math.min(...pts.map((p) => p.bpm))} to ${Math.max(...pts.map((p) => p.bpm))} beats a minute`} style={{ height }}>
      {start !== undefined && <line x1="0" x2={W} y1={y(start)} y2={y(start)} className="hl-graph__ref" />}
      {end !== undefined && <line x1="0" x2={W} y1={y(end)} y2={y(end)} className="hl-graph__ref hl-graph__ref--end" />}
      <path d={`${d} L${W} ${height} L0 ${height}Z`} className="hl-graph__fill" />
      <path d={d} className="hl-graph__line" />
    </svg>
  );
}

/** Live number and a moving graph of the last minute, shown during a session. */
export function HeartLiveStrip({ since }: { since: number }) {
  const status = useHeartLive((s) => s.status);
  const bpm = useHeartLive((s) => s.bpm);
  const demo = useHeartLive((s) => s.demo);
  const samples = useHeartLive((s) => s.samples);
  const now = useRef(0);
  now.current = samples.length ? samples[samples.length - 1].t : since;
  const pts = useMemo<Pt[]>(() => samples.filter((x) => x.t >= Math.max(since, now.current - 60000)).map((x) => ({ s: (x.t - Math.max(since, now.current - 60000)) / 1000, bpm: x.bpm })), [samples, since]);
  if (status !== "live") return null;
  return (
    <div className="hl-strip" aria-live="off">
      <div className="hl-strip__n"><Icon name="heart" size={18} filled /> <b>{bpm ?? "…"}</b> <span>bpm{demo ? " · demo" : ""}</span></div>
      <HrGraph pts={pts} height={64} />
    </div>
  );
}

/** After a session: the whole-session graph, what changed, and plain pointers. Real sessions are saved as a summary. */
export function HeartSummary({ pts, technique, minutes, cycleSecs }: { pts: Pt[]; technique: string; minutes: number; cycleSecs?: number }) {
  const demo = useHeartLive((s) => s.demo);
  const add = useHrSessions((s) => s.add);
  const sum = useMemo(() => summarize(pts, cycleSecs), [pts, cycleSecs]);
  const saved = useRef(false);
  useEffect(() => {
    if (saved.current || demo || !sum?.enough) return;
    saved.current = true;
    add({ technique, minutes, start: sum.start, end: sum.end, delta: sum.delta, hrvStart: sum.hrvStart, hrvEnd: sum.hrvEnd, swing: sum.swing });
  }, [sum, demo, add, technique, minutes]);
  if (!sum) return null;
  return (
    <section className="hl-sum" aria-label="Heart rate during this session">
      <h3><Icon name="heart" size={18} filled /> Your heart during this session{demo ? " (demo)" : ""}</h3>
      <HrGraph pts={pts} start={sum.enough ? sum.start : undefined} end={sum.enough ? sum.end : undefined} height={130} />
      {sum.enough && (
        <div className="hl-sum__stats">
          <div><b>{sum.start}</b><span>start bpm</span></div>
          <div><b>{sum.end}</b><span>end bpm</span></div>
          <div><b>{sum.delta > 0 ? `+${sum.delta}` : sum.delta}</b><span>change</span></div>
          {sum.hrvStart && sum.hrvEnd && <div><b>{sum.hrvStart} to {sum.hrvEnd}</b><span>HRV (RMSSD, ms)</span></div>}
          {sum.swing !== null && <div><b>{sum.swing}</b><span>swing per breath</span></div>}
        </div>
      )}
      <ul className="hl-sum__tips">{pointers(sum, demo).map((t) => <li key={t}>{t}</li>)}</ul>
    </section>
  );
}

/** Connect a monitor, try the demo, and see how recent sessions went. Sits in the Breathe Tools section. */
export function HeartConnect() {
  const { status, name, demo, error, supported, bpm } = useHeartLive();
  const connect = useHeartLive((s) => s.connect);
  const startDemo = useHeartLive((s) => s.startDemoFeed);
  const disconnect = useHeartLive((s) => s.disconnect);
  const history = useMyHrSessions().slice(-6).reverse();
  return (
    <div className="r-card hl-connect">
      <div className="hl-connect__head">
        <div>
          <span className="rooted__eyebrow">Live heart rate</span>
          <h3>See your heart as you breathe</h3>
          <p>Connect a heart monitor and your sessions show a live graph, then a plain summary of whether your heart rate settled. Readings stay on this device.</p>
        </div>
        <div className="hl-connect__state" aria-live="polite">
          {status === "live" ? <><span className="hl-dot" /> <b>{bpm ?? "…"}</b> bpm<small>{name}{demo ? " (demo)" : ""}</small></> : status === "connecting" ? "Connecting…" : "Not connected"}
        </div>
      </div>
      <div className="hl-connect__actions">
        {status === "live" ? <button className="btn btn--secondary" onClick={disconnect}>Disconnect</button> : (
          <>
            {supported && <button className="btn btn--primary" onClick={() => void connect()} disabled={status === "connecting"}><Icon name="heart" size={18} /> Connect a heart monitor</button>}
            <button className="btn btn--secondary" onClick={startDemo}>Try with demo data</button>
          </>
        )}
      </div>
      {error && <p className="hl-err" role="alert">{error}</p>}
      <details className="hl-compat">
        <summary>What works with this?</summary>
        <ul>
          <li><b>Works now, in Chrome or Edge on Android, Windows, Mac or Chromebook:</b> Bluetooth chest straps (Polar, Wahoo and similar) and wearables set to broadcast heart rate, such as many Garmin watches. Chest straps also give beat-to-beat timing, so we can show heart rate variability.</li>
          <li><b>iPhone and Apple Watch:</b> Safari on iPhone can't connect to Bluetooth devices, and the Apple Watch doesn't broadcast a standard heart-rate signal on its own. Live Apple Watch heart rate needs the Rooted iPhone app with a small Watch companion, which is planned. Until then you can use a chest strap with a computer or Android phone.</li>
          <li><b>Demo data</b> is made up. It is clearly labelled and never saved to your history.</li>
        </ul>
      </details>
      {history.length > 0 && (
        <div className="hl-history">
          <h4>Recent sessions with a monitor</h4>
          <ul>{history.map((h) => <li key={h.at}><span>{h.day} · {h.technique} · {h.minutes} min</span><b className={h.delta <= -5 ? "down" : ""}>{h.start} → {h.end} bpm</b></li>)}</ul>
        </div>
      )}
    </div>
  );
}
