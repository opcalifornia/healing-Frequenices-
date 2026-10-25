import { create } from "zustand";
import { bluetoothSupported, connectBluetooth, startDemo, type FeedHandle, type HeartSample } from "../rooted/heartFeed";

/**
 * The one live heart-rate connection for the whole app. Connect once (from the Tools section or a session) and every
 * screen shows the same feed. Readings live in memory only; nothing is uploaded.
 */
interface State {
  status: "off" | "connecting" | "live" | "error";
  name: string;
  demo: boolean;
  error: string | null;
  bpm: number | null;
  samples: HeartSample[];
  supported: boolean;
  connect(): Promise<void>;
  startDemoFeed(): void;
  disconnect(): void;
}

let handle: FeedHandle | null = null;
const MAX = 60 * 60; // an hour of one-per-second readings

export const useHeartLive = create<State>()((set, get) => {
  const push = (s: HeartSample) => set((st) => ({ bpm: s.bpm, samples: st.samples.length >= MAX ? [...st.samples.slice(-MAX + 1), s] : [...st.samples, s] }));
  const ended = () => { handle = null; set({ status: "off", bpm: null }); };
  return {
    status: "off", name: "", demo: false, error: null, bpm: null, samples: [], supported: bluetoothSupported(),
    async connect() {
      get().disconnect();
      set({ status: "connecting", error: null, samples: [] });
      try {
        handle = await connectBluetooth(push, ended);
        set({ status: "live", name: handle.name, demo: false });
      } catch (e) {
        const n = (e as { name?: string }).name;
        set({ status: n === "NotFoundError" ? "off" : "error", error: n === "NotFoundError" ? null : "Couldn't connect. Make sure the monitor is on, nearby and not connected to another app, then try again." });
      }
    },
    startDemoFeed() {
      get().disconnect();
      handle = startDemo(push);
      set({ status: "live", name: handle.name, demo: true, error: null, samples: [] });
    },
    disconnect() {
      handle?.stop();
      handle = null;
      set({ status: "off", bpm: null });
    },
  };
});
