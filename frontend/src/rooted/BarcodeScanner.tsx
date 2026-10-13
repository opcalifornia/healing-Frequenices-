import { useEffect, useRef, useState } from "react";
import { Sheet } from "./ui";
import { Icon } from "../components/Icon";
import "./BarcodeScanner.css";

interface Detector {
  detect(source: HTMLVideoElement): Promise<Array<{ rawValue: string }>>;
}
type DetectorCtor = new (opts: { formats: string[] }) => Detector;

const FORMATS = ["ean_13", "ean_8", "upc_a"];

/**
 * Reads a product barcode with the camera. Uses the browser's built-in detector where
 * there is one, and a small decoder library (loaded only when needed) everywhere else.
 * The video never leaves the device: it is read frame by frame in the page.
 */
export function BarcodeScanner({ open, onCode, onClose }: { open: boolean; onCode(code: string): void; onClose(): void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOk, setTorchOk] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [dark, setDark] = useState(false);
  const track = useRef<MediaStreamTrack | null>(null);

  const toggleTorch = async () => {
    const t = track.current;
    if (!t) return;
    const next = !torchOn;
    try {
      await t.applyConstraints({ advanced: [{ torch: next } as MediaTrackConstraintSet] });
      setTorchOn(next);
    } catch {
      setTorchOk(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTorchOk(false);
    setTorchOn(false);
    setDark(false);
    let stopped = false;
    let found = false;
    let stream: MediaStream | null = null;
    let stopZxing: (() => void) | null = null;
    let timer = 0;
    let darkTimer = 0;

    // Once the camera is running: find out whether it has a light, and watch for a dark picture.
    const watch = (el: HTMLVideoElement) => {
      const media = el.srcObject as MediaStream | null;
      const t = media?.getVideoTracks()[0] ?? null;
      track.current = t;
      const caps = (t?.getCapabilities?.() ?? {}) as { torch?: boolean };
      setTorchOk(!!caps.torch);
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 24;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      darkTimer = window.setInterval(() => {
        if (!ctx || el.videoWidth === 0) return;
        ctx.drawImage(el, 0, 0, 32, 24);
        const px = ctx.getImageData(0, 0, 32, 24).data;
        let sum = 0;
        for (let i = 0; i < px.length; i += 4) sum += 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
        setDark(sum / (px.length / 4) < 45);
      }, 1000);
    };

    const hit = (code: string) => {
      if (found || stopped) return;
      found = true;
      onCode(code);
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("no camera api");
        const el = video.current;
        if (!el) return;
        const Native = (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;
        if (Native) {
          stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
          if (stopped) return;
          el.srcObject = stream;
          await el.play();
          watch(el);
          const detector = new Native({ formats: FORMATS });
          const tick = async () => {
            if (stopped || found) return;
            try {
              const codes = await detector.detect(el);
              if (codes[0]?.rawValue) return hit(codes[0].rawValue);
            } catch {
              /* a frame that can't be read is fine, try the next one */
            }
            timer = window.setTimeout(tick, 200);
          };
          void tick();
        } else {
          const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([import("@zxing/browser"), import("@zxing/library")]);
          if (stopped) return;
          const hints = new Map<number, unknown>([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A]]]);
          const reader = new BrowserMultiFormatReader(hints as never);
          const controls = await reader.decodeFromConstraints({ video: { facingMode: { ideal: "environment" } }, audio: false }, el, (result) => {
            if (result) hit(result.getText());
          });
          if (stopped) controls.stop();
          else {
            stopZxing = () => controls.stop();
            watch(el);
          }
        }
      } catch {
        if (!stopped) setError("The camera isn't available here. You can type the number under the barcode instead.");
      }
    })();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      window.clearInterval(darkTimer);
      track.current = null;
      stopZxing?.();
      stream?.getTracks().forEach((t) => t.stop());
      if (video.current) video.current.srcObject = null;
    };
  }, [open, onCode]);

  return (
    <Sheet open={open} onClose={onClose} label="Scan a barcode">
      <div className="bscan">
        <h2>Scan a barcode</h2>
        <p className="bscan__lede">Hold the barcode inside the frame, in good light.</p>
        <div className="bscan__view">
          <video ref={video} muted playsInline aria-label="Camera view" />
          <span className="bscan__frame" aria-hidden="true" />
        </div>
        {!error && torchOk && (
          <button className={`btn ${dark && !torchOn ? "btn--primary" : "btn--secondary"}`} onClick={toggleTorch} aria-pressed={torchOn}>
            <Icon name="sun" size={20} /> {torchOn ? "Turn the light off" : dark ? "It looks dark. Turn on the light" : "Turn on the light"}
          </button>
        )}
        {!error && dark && !torchOk && <p className="bscan__tip" role="status">It looks dark. Move closer to a lamp or a window, or type the number under the barcode instead.</p>}
        {error && <p className="bscan__error" role="alert">{error}</p>}
        <button className="btn btn--secondary" onClick={onClose}>Type the number instead</button>
      </div>
    </Sheet>
  );
}
