import { useEffect, useRef, useState } from "react";
import { Sheet } from "./ui";
import { Icon } from "../components/Icon";
import { isValidBarcode } from "./foodLookup";
import "./BarcodeScanner.css";

interface Detector {
  detect(source: HTMLVideoElement | ImageBitmap): Promise<Array<{ rawValue: string }>>;
}
type DetectorCtor = new (opts: { formats: string[] }) => Detector;

const FORMATS = ["ean_13", "ean_8", "upc_a"];
/** A sharper picture helps a lot with thin barcode lines. */
const VIDEO: MediaTrackConstraints = { facingMode: { ideal: "environment" }, width: { ideal: 1920 }, height: { ideal: 1080 } };

const native = () => (window as unknown as { BarcodeDetector?: DetectorCtor }).BarcodeDetector;

async function loadZxing() {
  const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([import("@zxing/browser"), import("@zxing/library")]);
  const hints = new Map<number, unknown>([
    [DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.UPC_A]],
    [DecodeHintType.TRY_HARDER, true],
  ]);
  return { BrowserMultiFormatReader, hints };
}

/** Read a barcode out of a photo, for example one taken with the phone's own camera app. */
export async function decodeImageFile(file: File): Promise<string | null> {
  try {
    const Native = native();
    if (Native && typeof createImageBitmap === "function") {
      const bmp = await createImageBitmap(file);
      const codes = await new Native({ formats: FORMATS }).detect(bmp);
      if (codes[0]?.rawValue) return codes[0].rawValue;
    }
  } catch {
    /* fall through to the decoder library */
  }
  const url = URL.createObjectURL(file);
  try {
    const { BrowserMultiFormatReader, hints } = await loadZxing();
    const result = await new BrowserMultiFormatReader(hints as never).decodeFromImageUrl(url);
    return result.getText();
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function cameraMessage(e: unknown): string {
  const name = (e as { name?: string } | null)?.name;
  if (name === "NotAllowedError" || name === "SecurityError") return "Camera access is turned off for this page. Allow the camera in your browser's settings, or take a photo of the barcode instead.";
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No camera was found. You can take a photo of the barcode, or type the number.";
  if (name === "NotReadableError") return "The camera is busy in another app. Close it and try again, or take a photo of the barcode instead.";
  return "The camera isn't available here. You can take a photo of the barcode, or type the number under it.";
}

/**
 * Reads a product barcode with the camera. Uses the browser's built-in detector where
 * there is one, and a small decoder library (loaded only when needed) everywhere else.
 * Photos taken with the phone's own camera app work too, which is often the most reliable way.
 * Nothing leaves the device: images are read in the page.
 */
export function BarcodeScanner({ open, onCode, onClose }: { open: boolean; onCode(code: string): void; onClose(): void }) {
  const video = useRef<HTMLVideoElement>(null);
  const photo = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [torchOk, setTorchOk] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [dark, setDark] = useState(false);
  const [slow, setSlow] = useState(false);
  const [reading, setReading] = useState(false);
  const [photoFail, setPhotoFail] = useState(false);
  const [locked, setLocked] = useState(false);
  const [zoom, setZoom] = useState<{ min: number; max: number; step: number; value: number } | null>(null);
  const track = useRef<MediaStreamTrack | null>(null);
  // Keep the latest callback without restarting the camera when the page re-renders.
  const cb = useRef(onCode);
  cb.current = onCode;

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

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setReading(true);
    setPhotoFail(false);
    const code = await decodeImageFile(file);
    setReading(false);
    if (code) cb.current(code);
    else setPhotoFail(true);
  };

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTorchOk(false);
    setTorchOn(false);
    setDark(false);
    setSlow(false);
    setPhotoFail(false);
    setLocked(false);
    setZoom(null);
    let stopped = false;
    let found = false;
    let stream: MediaStream | null = null;
    let timer = 0;
    let darkTimer = 0;
    const slowTimer = window.setTimeout(() => setSlow(true), 8000);

    // Once the camera is running: ask for continuous focus, find out whether it has a light, and watch for a dark picture.
    const watch = (el: HTMLVideoElement) => {
      const media = el.srcObject as MediaStream | null;
      const t = media?.getVideoTracks()[0] ?? null;
      track.current = t;
      const caps = (t?.getCapabilities?.() ?? {}) as { torch?: boolean; focusMode?: string[]; zoom?: { min: number; max: number; step?: number } };
      if (caps.zoom && caps.zoom.max > caps.zoom.min) setZoom({ min: caps.zoom.min, max: caps.zoom.max, step: caps.zoom.step || 0.1, value: caps.zoom.min });
      setTorchOk(!!caps.torch);
      if (t && caps.focusMode?.includes("continuous")) void t.applyConstraints({ advanced: [{ focusMode: "continuous" } as MediaTrackConstraintSet] }).catch(() => undefined);
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

    // Every frame: cut out the middle of the picture (where the frame is), enlarge it, and read it.
    // A code only counts when its check digit is right and two reads in a row agree, so a bad read never gets through.
    let last = "";
    const lock = (code: string) => {
      found = true;
      setLocked(true);
      try { navigator.vibrate?.(40); } catch { /* not every device can buzz */ }
      window.setTimeout(() => { if (!stopped) cb.current(code); }, 380);
    };

    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("no camera api");
        const el = video.current;
        if (!el) return;
        stream = await navigator.mediaDevices.getUserMedia({ video: VIDEO, audio: false });
        if (stopped) return;
        el.srcObject = stream;
        await el.play();
        watch(el);
        const Native = native();
        const detector = Native ? new Native({ formats: FORMATS }) : null;
        const zx = detector ? null : await loadZxing();
        const reader = zx ? new zx.BrowserMultiFormatReader(zx.hints as never) : null;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const tick = async () => {
          if (stopped || found) return;
          let code = "";
          try {
            if (el.videoWidth > 0 && ctx) {
              const vw = el.videoWidth, vh = el.videoHeight;
              const sw = Math.round(vw * 0.9), sh = Math.round(vh * 0.6);
              const scale = Math.min(1.5, 1280 / sw);
              canvas.width = Math.round(sw * scale);
              canvas.height = Math.round(sh * scale);
              ctx.drawImage(el, Math.round((vw - sw) / 2), Math.round((vh - sh) / 2), sw, sh, 0, 0, canvas.width, canvas.height);
              if (detector) code = (await detector.detect(canvas as unknown as ImageBitmap))[0]?.rawValue ?? "";
              else if (reader) code = reader.decodeFromCanvas(canvas).getText();
            }
          } catch {
            /* nothing readable in this frame, try the next one */
          }
          if (code && isValidBarcode(code)) {
            if (code === last) return lock(code);
            last = code;
          } else if (!code) last = "";
          timer = window.setTimeout(tick, 80);
        };
        void tick();
      } catch (e) {
        if (!stopped) setError(cameraMessage(e));
      }
    })();

    return () => {
      stopped = true;
      window.clearTimeout(timer);
      window.clearTimeout(slowTimer);
      window.clearInterval(darkTimer);
      track.current = null;
      stream?.getTracks().forEach((t) => t.stop());
      if (video.current) video.current.srcObject = null;
    };
  }, [open]);

  return (
    <Sheet open={open} onClose={onClose} label="Scan a barcode">
      <div className="bscan">
        <h2>Scan a barcode</h2>
        <p className="bscan__lede">Hold the barcode flat inside the frame, about a hand's length away, in good light. When it locks, the frame turns green.</p>
        <div className={`bscan__view${locked ? " bscan__view--lock" : ""}`}>
          <video ref={video} muted playsInline aria-label="Camera view" />
          <span className="bscan__frame" aria-hidden="true" />
        </div>
        {!error && zoom && (
          <label className="bscan__zoom">Zoom
            <input type="range" min={zoom.min} max={zoom.max} step={zoom.step} value={zoom.value} onChange={(e) => { const v = Number(e.target.value); setZoom({ ...zoom, value: v }); void track.current?.applyConstraints({ advanced: [{ zoom: v } as MediaTrackConstraintSet] }).catch(() => undefined); }} />
          </label>
        )}
        {!error && torchOk && (
          <button className={`btn ${dark && !torchOn ? "btn--primary" : "btn--secondary"}`} onClick={toggleTorch} aria-pressed={torchOn}>
            <Icon name="sun" size={20} /> {torchOn ? "Turn the light off" : dark ? "It looks dark. Turn on the light" : "Turn on the light"}
          </button>
        )}
        {!error && dark && !torchOk && <p className="bscan__tip" role="status">It looks dark. Move closer to a lamp or a window, or take a photo with your camera's flash.</p>}
        {!error && slow && !dark && <p className="bscan__tip" role="status">Still looking. Hold steady with the whole barcode in the frame, or take a photo instead.</p>}
        {error && <p className="bscan__error" role="alert">{error}</p>}
        {photoFail && <p className="bscan__error" role="alert">We couldn't read a barcode in that photo. Try again closer, with the barcode flat and well lit, or type the number.</p>}
        <input ref={photo} type="file" accept="image/*" capture="environment" className="visually-hidden" aria-label="Take a photo of the barcode" onChange={onPhoto} />
        <button className="btn btn--primary" onClick={() => photo.current?.click()} disabled={reading}>{reading ? "Reading the photo…" : "Take a photo of the barcode"}</button>
        <button className="btn btn--secondary" onClick={onClose}>Type the number instead</button>
      </div>
    </Sheet>
  );
}
