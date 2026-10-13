import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { analyze, bestChannel, filterSignal, findBeats, fingerOn, type HeartReading, type Sample } from "./ppg";
import { usePractice, useHearts } from "../store/practice";
import { Icon } from "../components/Icon";

type Stage = "intro" | "starting" | "measuring" | "result" | "error";
const SETTLE = 5;
const MEASURE = 30;

/** Fingertip-over-camera heart rate and HRV. Nothing is recorded or uploaded: frames are read and discarded on the device. */
export function HeartCheck() {
  const [stage, setStage] = useState<Stage>("intro");
  const [err, setErr] = useState("");
  const [covered, setCovered] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [live, setLive] = useState<number | null>(null);
  const [result, setResult] = useState<HeartReading | null>(null);
  const [torch, setTorch] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const samples = useRef<Sample[]>([]);
  const greens = useRef<Sample[]>([]);
  const signal = (from: number) => bestChannel(samples.current.filter((s) => s.t >= from), greens.current.filter((s) => s.t >= from));
  const stopRef = useRef(false);
  const add = usePractice((s) => s.addHeart);
  const history = useHearts();

  const stopCamera = () => {
    stopRef.current = true;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  };
  useEffect(() => () => stopCamera(), []);

  const start = async () => {
    setStage("starting");
    setResult(null);
    samples.current = [];
    greens.current = [];
    stopRef.current = false;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 320 }, height: { ideal: 240 }, frameRate: { ideal: 30 } }, audio: false });
      streamRef.current = stream;
      const track = stream.getVideoTracks()[0];
      const caps = (track.getCapabilities?.() ?? {}) as { torch?: boolean };
      if (caps.torch) {
        try {
          await track.applyConstraints({ advanced: [{ torch: true } as MediaTrackConstraintSet] });
          setTorch(true);
        } catch { /* no torch */ }
      }
      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();
      setStage("measuring");
      loop();
    } catch (e) {
      setErr((e as Error).name === "NotAllowedError" ? "Camera access was blocked. Allow camera access for this site in your browser settings, then try again." : "Couldn't open the camera on this device.");
      setStage("error");
    }
  };

  const loop = () => {
    const video = videoRef.current!;
    const c = document.createElement("canvas");
    c.width = 40;
    c.height = 30;
    const ctx = c.getContext("2d", { willReadFrequently: true })!;
    const t0 = performance.now();
    let lastLive = 0;
    let measureStart = -1;
    const frame = () => {
      if (stopRef.current) return;
      ctx.drawImage(video, 0, 0, 40, 30);
      const d = ctx.getImageData(10, 7, 20, 16).data;
      let r = 0, g = 0, b = 0;
      for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
      const n = d.length / 4;
      r /= n; g /= n; b /= n;
      const now = (performance.now() - t0) / 1000;
      const on = fingerOn(r, g, b);
      setCovered(on);
      if (!on) {
        // Lifting the finger restarts the clock.
        samples.current = [];
        greens.current = [];
        measureStart = -1;
        setElapsed(0);
        setLive(null);
      } else {
        if (measureStart < 0) measureStart = now;
        samples.current.push({ t: now, v: r });
        greens.current.push({ t: now, v: g });
        const el = now - measureStart;
        setElapsed(el);
        drawWave();
        if (el > SETTLE + 6 && now - lastLive > 1) {
          lastLive = now;
          const rr = analyze(findBeats(filterSignal(signal(now - 10))));
          if (rr) setLive(rr.bpm);
        }
        if (el >= SETTLE + MEASURE) {
          const res = analyze(findBeats(filterSignal(signal(measureStart + SETTLE))));
          stopCamera();
          setTorch(false);
          if (res && res.quality >= 0.6) {
            setResult(res);
            add({ bpm: res.bpm, rmssd: res.rmssd });
            setStage("result");
          } else {
            setErr("We couldn't get a clean reading. Keep your fingertip still and gently pressed over the camera (and flash, if your phone has one), and try in a bright room.");
            setStage("error");
          }
          return;
        }
      }
      const v = video as HTMLVideoElement & { requestVideoFrameCallback?: (cb: () => void) => number };
      if (v.requestVideoFrameCallback) v.requestVideoFrameCallback(frame);
      else requestAnimationFrame(frame);
    };
    frame();
  };

  const drawWave = () => {
    const cv = waveRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = (cv.width = cv.clientWidth * devicePixelRatio);
    const H = (cv.height = cv.clientHeight * devicePixelRatio);
    const s = samples.current;
    const now = s.length ? s[s.length - 1].t : 0;
    const f = filterSignal(signal(now - 6));
    if (f.length < 5) return;
    const vs = f.map((x) => x.v);
    const lo = Math.min(...vs), hi = Math.max(...vs);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#ff8a80";
    ctx.lineWidth = 2.5 * devicePixelRatio;
    ctx.lineJoin = "round";
    ctx.beginPath();
    f.forEach((p, i) => {
      const x = ((p.t - (now - 5)) / 5) * W;
      const y = H - ((p.v - lo) / (hi - lo || 1)) * H * 0.8 - H * 0.1;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    });
    ctx.stroke();
  };

  const pct = Math.min(1, Math.max(0, (elapsed - SETTLE) / MEASURE));
  const recent = history.slice(-4).reverse();

  return (
    <div className="heart">
      <div className="r-card heart__main">
        <video ref={videoRef} playsInline muted className="heart__video" aria-hidden="true" />
        <AnimatePresence mode="wait">
          {(stage === "intro" || stage === "error") && (
            <motion.div key="intro" className="heart__step" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <span className="heart__icon"><Icon name="heart" size={30} /></span>
              <h3>Heart check</h3>
              <p>Rest your fingertip gently over your phone's back camera, covering the flash too if you have one. Sit still for about 35 seconds. We'll read your pulse from tiny color changes in your fingertip.</p>
              {stage === "error" && <p className="for-you"><span>{err}</span></p>}
              <button className="btn btn--primary" onClick={start}><Icon name="play" size={18} /> {stage === "error" ? "Try again" : "Start"}</button>
              <p className="heart__fine">Works best on phones. Your camera feed stays on your device: nothing is recorded or uploaded. This is a wellness estimate, not a medical device. If you're worried about your heart rhythm, see a doctor.</p>
            </motion.div>
          )}
          {stage === "starting" && (
            <motion.div key="starting" className="heart__step heart__center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><p>Opening the camera…</p></motion.div>
          )}
          {stage === "measuring" && (
            <motion.div key="measuring" className="heart__step heart__center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="heart__ring">
                <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" pathLength="1" className="week-ring__bg" /><circle cx="50" cy="50" r="44" pathLength="1" className="heart__fill" style={{ strokeDasharray: `${pct} 1` }} /></svg>
                <motion.span className="heart__pulse" animate={covered && live ? { scale: [1, 1.15, 1] } : { scale: 1 }} transition={{ duration: live ? 60 / live : 1, repeat: Infinity }}><Icon name="heart" size={40} /></motion.span>
              </div>
              <strong className="heart__bpm">{covered ? (live ? `${live} bpm` : elapsed < SETTLE ? "Hold still…" : "Finding your pulse…") : "Cover the camera with your fingertip"}</strong>
              <canvas ref={waveRef} className="heart__wave" aria-hidden="true" />
              <span className="heart__hint">{torch ? "Flash on. " : ""}{covered ? `${Math.max(0, Math.ceil(SETTLE + MEASURE - elapsed))} seconds left` : "Press gently, not hard"}</span>
              <button className="welcome__skip" onClick={() => { stopCamera(); setStage("intro"); }}>Cancel</button>
            </motion.div>
          )}
          {stage === "result" && result && (
            <motion.div key="result" className="heart__step heart__center" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="heart__results">
                <div><span>Heart rate</span><strong>{result.bpm}</strong><small>beats per minute</small></div>
                <div><span>HRV (RMSSD)</span><strong>{result.rmssd}</strong><small>milliseconds</small></div>
              </div>
              <p>Higher HRV generally means your relaxation response is more active. It varies a lot between people and through the day, so compare yourself with yourself: try a check before and after 5 minutes of coherent breathing.</p>
              <button className="btn btn--secondary btn--small" onClick={() => setStage("intro")}>Done</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="r-card heart__history">
        <h3>Recent checks</h3>
        {recent.length ? (
          <ul>
            {recent.map((h) => (
              <li key={h.at}>
                <span>{new Date(h.at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
                <b>{h.bpm} <small>bpm</small></b>
                <b>{h.rmssd} <small>ms HRV</small></b>
              </li>
            ))}
          </ul>
        ) : <p className="rooted__lead">Your readings will appear here. Measure before and after a breathing session to see your body respond.</p>}
      </div>
    </div>
  );
}
