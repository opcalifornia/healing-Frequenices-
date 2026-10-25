/**
 * Live heart-rate feeds.
 *
 * Today: any Bluetooth LE heart-rate monitor that uses the standard Heart Rate service (chest straps such as Polar and
 * Wahoo, and wearables set to broadcast heart rate, for example some Garmin watches), through the browser's Web
 * Bluetooth. That works in Chrome and Edge on Android and desktop. It does NOT work in Safari on iPhone, which has no
 * Web Bluetooth. Apple Watch needs the native iPhone app (see NATIVE_HEART_PLAN.md).
 *
 * A demo feed makes simulated numbers so the screens can be tried without a device. Demo data is always labelled and
 * never saved to your history.
 */

export interface HeartSample {
  /** performance.now() in milliseconds when the reading arrived. */
  t: number;
  bpm: number;
  /** Beat-to-beat intervals in milliseconds, when the device sends them (chest straps usually do). */
  rr?: number[];
}

/** Decode a Heart Rate Measurement (Bluetooth characteristic 0x2A37). */
export function parseHeartRate(dv: DataView): { bpm: number; rr: number[]; contact: boolean | null } {
  const flags = dv.getUint8(0);
  const wide = (flags & 0x01) !== 0;
  const contactSupported = (flags & 0x04) !== 0;
  const contact = contactSupported ? (flags & 0x02) !== 0 : null;
  const energy = (flags & 0x08) !== 0;
  const hasRR = (flags & 0x10) !== 0;
  let i = 1;
  const bpm = wide ? dv.getUint16(i, true) : dv.getUint8(i);
  i += wide ? 2 : 1;
  if (energy) i += 2;
  const rr: number[] = [];
  if (hasRR) for (; i + 1 < dv.byteLength; i += 2) rr.push(Math.round((dv.getUint16(i, true) / 1024) * 1000));
  return { bpm, rr, contact };
}

export const bluetoothSupported = () => typeof navigator !== "undefined" && "bluetooth" in navigator;

export interface FeedHandle {
  name: string;
  demo: boolean;
  stop(): void;
}

interface BtDevice { name?: string; gatt?: { connect(): Promise<BtServer>; disconnect(): void }; addEventListener(t: string, cb: () => void): void }
interface BtServer { getPrimaryService(s: string): Promise<{ getCharacteristic(c: string): Promise<BtChar> }> }
interface BtChar { startNotifications(): Promise<BtChar>; stopNotifications(): Promise<BtChar>; addEventListener(t: string, cb: (e: { target: { value: DataView } }) => void): void; removeEventListener(t: string, cb: unknown): void }

/** Ask the person to pick a monitor, connect, and stream readings. Must be called from a tap. */
export async function connectBluetooth(onSample: (s: HeartSample) => void, onEnd: () => void): Promise<FeedHandle> {
  const bt = (navigator as unknown as { bluetooth: { requestDevice(o: unknown): Promise<BtDevice> } }).bluetooth;
  const device = await bt.requestDevice({ filters: [{ services: ["heart_rate"] }] });
  const server = await device.gatt!.connect();
  const service = await server.getPrimaryService("heart_rate");
  const ch = await service.getCharacteristic("heart_rate_measurement");
  const handler = (e: { target: { value: DataView } }) => {
    const r = parseHeartRate(e.target.value);
    if (r.bpm > 0 && r.contact !== false) onSample({ t: performance.now(), bpm: r.bpm, rr: r.rr.length ? r.rr : undefined });
  };
  ch.addEventListener("characteristicvaluechanged", handler);
  await ch.startNotifications();
  device.addEventListener("gattserverdisconnected", onEnd);
  return {
    name: device.name || "Heart monitor",
    demo: false,
    stop() {
      try { ch.removeEventListener("characteristicvaluechanged", handler); void ch.stopNotifications(); device.gatt?.disconnect(); } catch { /* already gone */ }
    },
  };
}

/** Simulated readings: a resting rate that drifts down slowly and swells with each breath. Labelled as demo everywhere. */
export function startDemo(onSample: (s: HeartSample) => void, breathSecs = 10): FeedHandle {
  const t0 = performance.now();
  const id = window.setInterval(() => {
    const t = performance.now();
    const sec = (t - t0) / 1000;
    const drift = 78 - Math.min(9, sec / 20);
    const rsa = 4.5 * Math.sin((2 * Math.PI * sec) / breathSecs);
    const noise = (Math.random() - 0.5) * 1.2;
    const bpm = Math.round(drift + rsa + noise);
    onSample({ t, bpm, rr: [Math.round(60000 / bpm + (Math.random() - 0.5) * 20)] });
  }, 1000);
  return { name: "Demo data", demo: true, stop: () => window.clearInterval(id) };
}
