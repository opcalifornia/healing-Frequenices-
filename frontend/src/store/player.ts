import { create } from "zustand";
import { persist } from "zustand/middleware";
import { BinauralEngine, DEFAULT_MIX, type EngineSettings } from "../audio/engine";
import { fadeOutSeconds, STAGE_GLIDE, stageIndexAt } from "../audio/program";
import { useUser } from "./user";
import type { LayerMix, NoiseColor, Title } from "../types";

/**
 * The one player store, mounted at the app root. Audio keeps playing while the
 * user navigates because nothing here is tied to a page component.
 */

export type PlayerStatus = "idle" | "playing" | "paused" | "ending";
export type TimerChoice = number | null; // minutes; null = session length

interface PlayerState {
  current: Title | null;
  status: PlayerStatus;
  elapsed: number;
  /** Seconds until the session ends (from the timer or the title's duration). */
  endAt: number;
  timer: TimerChoice;
  volume: number;
  mix: LayerMix;
  noise: NoiseColor | null;
  solfeggio: number | null;
  isochronic: boolean;
  carrier: number;
  beat: number;
  stageIndex: number;
  expanded: boolean;
  pending: { title: Title; resume?: number } | null;
  testing: "left" | "right" | null;
  calmVisuals: boolean;

  playTitle(title: Title, resume?: number): void;
  confirmSafety(): void;
  cancelSafety(): void;
  togglePlay(): void;
  stop(): void;
  seek(seconds: number): void;
  setVolume(v: number): void;
  setMix(patch: Partial<LayerMix>): void;
  setNoise(c: NoiseColor | null): void;
  setSolfeggio(hz: number | null): void;
  setIsochronic(on: boolean): void;
  setTimer(t: TimerChoice): void;
  retune(carrier: number, beat: number): void;
  setExpanded(open: boolean): void;
  channelTest(side: "left" | "right"): void;
  setCalmVisuals(on: boolean): void;
}

export const audioElement: HTMLAudioElement | null =
  typeof document !== "undefined" ? Object.assign(document.createElement("audio"), { autoplay: false }) : null;
if (audioElement) audioElement.setAttribute("playsinline", "");

export const engine = new BinauralEngine(undefined, { mediaElement: audioElement });

let clock: number | undefined;
let lastTick = 0;
let lastSaved = 0;

function durationFor(t: Title, timer: TimerChoice): number {
  const session = (t.durationMin ?? 30) * 60;
  return timer ? timer * 60 : session;
}

function isCatalogTitle(t: Title) {
  return !t.id.startsWith("c-");
}

export const usePlayer = create<PlayerState>()(
  persist(
    (set, get) => {
      const saveProgress = () => {
        const { current, elapsed } = get();
        if (!current || !isCatalogTitle(current)) return;
        useUser.getState().recordProgress(current.id, Math.floor(elapsed), (current.durationMin ?? 30) * 60);
        lastSaved = elapsed;
      };

      const settingsFor = (t: Title): EngineSettings => {
        const s = get();
        return {
          carrier: t.carrier ?? 200,
          beat: t.stages?.[0]?.beat ?? t.beat ?? 10,
          noise: s.noise,
          solfeggio: s.solfeggio,
          isochronic: s.isochronic,
          mix: s.mix,
          volume: s.volume,
        };
      };

      /** Move a Deep Sync program to the stage for the current time. */
      const syncStage = (immediate: boolean) => {
        const { current, elapsed, stageIndex } = get();
        const stages = current?.stages;
        if (!current || !stages?.length) return;
        const idx = stageIndexAt(stages, elapsed);
        if (idx === stageIndex && !immediate) return;
        const st = stages[idx];
        const carrier = st.carrier ?? current.carrier ?? 200;
        engine.setCarrierBeat(carrier, st.beat, immediate ? 0.5 : STAGE_GLIDE);
        set({ stageIndex: idx, carrier, beat: st.beat });
      };

      const tick = () => {
        const s = get();
        if (s.status !== "playing" && s.status !== "ending") return;
        const now = performance.now();
        const dt = (now - lastTick) / 1000;
        lastTick = now;
        const elapsed = s.elapsed + dt;
        set({ elapsed });
        syncStage(false);

        const fade = fadeOutSeconds(s.endAt);
        if (s.status === "playing" && elapsed >= s.endAt - fade) {
          engine.fadeTo(0, Math.max(0.5, s.endAt - elapsed));
          set({ status: "ending" });
        }
        if (elapsed >= s.endAt) {
          saveProgress();
          finish();
          return;
        }
        if (elapsed - lastSaved >= 15) saveProgress();
      };

      const startClock = () => {
        window.clearInterval(clock);
        lastTick = performance.now();
        clock = window.setInterval(tick, 250);
      };
      const stopClock = () => window.clearInterval(clock);

      const finish = () => {
        stopClock();
        engine.stop(0.3);
        set({ status: "idle", current: null, elapsed: 0, expanded: false });
      };

      const begin = (title: Title, resume?: number) => {
        const s = get();
        if (s.current && s.current.id !== title.id) saveProgress();
        const layers = {
          noise: title.noise ?? null,
          solfeggio: title.solfeggio ?? null,
          isochronic: !!title.isochronic,
          mix: { ...DEFAULT_MIX, ...title.mix },
        };
        set(layers);
        const endAt = durationFor(title, s.timer);
        const elapsed = resume && resume < endAt - 30 ? resume : 0;
        const settings = settingsFor(title);
        engine.start(settings);
        set({
          current: title,
          status: "playing",
          elapsed,
          endAt,
          carrier: settings.carrier,
          beat: settings.beat,
          stageIndex: -1,
        });
        lastSaved = elapsed;
        syncStage(true);
        startClock();
      };

      return {
        current: null,
        status: "idle",
        elapsed: 0,
        endAt: 0,
        timer: null,
        volume: 0.5,
        mix: DEFAULT_MIX,
        noise: null,
        solfeggio: null,
        isochronic: false,
        carrier: 200,
        beat: 10,
        stageIndex: 0,
        expanded: false,
        pending: null,
        testing: null,
        calmVisuals: false,

        playTitle(title, resume) {
          if (title.comingSoon) return;
          if (!useUser.getState().safetyAcknowledged) {
            set({ pending: { title, resume } });
            return;
          }
          // Same title already loaded: just toggle.
          const s = get();
          if (s.current?.id === title.id && s.status !== "idle") {
            if (s.status === "paused") get().togglePlay();
            return;
          }
          begin(title, resume);
        },

        confirmSafety() {
          const p = get().pending;
          useUser.getState().acknowledgeSafety();
          set({ pending: null });
          if (p) begin(p.title, p.resume);
        },

        cancelSafety() {
          set({ pending: null });
        },

        togglePlay() {
          const s = get();
          if (!s.current) return;
          if (s.status === "paused") {
            engine.resume();
            set({ status: "playing" });
            startClock();
          } else {
            stopClock();
            set({ status: "paused" });
            saveProgress();
            engine.pause();
          }
        },

        stop() {
          saveProgress();
          stopClock();
          engine.stop(1.2);
          set({ status: "idle", current: null, elapsed: 0, expanded: false });
        },

        seek(seconds) {
          const s = get();
          if (!s.current) return;
          const elapsed = Math.max(0, Math.min(s.endAt - 1, seconds));
          set({ elapsed });
          if (s.status === "ending" && elapsed < s.endAt - fadeOutSeconds(s.endAt)) {
            engine.fadeTo(1, 1);
            set({ status: "playing" });
          }
          syncStage(true);
        },

        setVolume(v) {
          set({ volume: v });
          engine.setVolume(v);
        },

        setMix(patch) {
          const mix = { ...get().mix, ...patch };
          set({ mix });
          engine.setMix(mix);
        },

        setNoise(c) {
          set({ noise: c });
          engine.setLayers({ noise: c });
        },

        setSolfeggio(hz) {
          set({ solfeggio: hz });
          engine.setLayers({ solfeggio: hz });
        },

        setIsochronic(on) {
          set({ isochronic: on });
          engine.setLayers({ isochronic: on });
        },

        setTimer(timer) {
          const s = get();
          set({ timer });
          if (!s.current) return;
          const endAt = Math.max(s.elapsed + 15, durationFor(s.current, timer));
          if (s.status === "ending") engine.fadeTo(1, 1);
          set({ endAt, status: s.status === "ending" ? "playing" : s.status });
        },

        retune(carrier, beat) {
          set({ carrier, beat });
          engine.setCarrierBeat(carrier, beat, 0.06);
        },

        setExpanded(open) {
          set({ expanded: open });
        },

        async channelTest(side) {
          const wasPaused = get().status === "paused";
          set({ testing: side });
          await engine.channelTest(side);
          set({ testing: null });
          if (wasPaused && get().status === "paused") engine.pause(0.01);
        },

        setCalmVisuals(on) {
          set({ calmVisuals: on });
        },
      };
    },
    {
      name: "hf-player",
      version: 1,
      partialize: (s) => ({ volume: s.volume, timer: s.timer, calmVisuals: s.calmVisuals }),
    },
  ),
);

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", () => {
    const s = usePlayer.getState();
    if (s.current && isCatalogTitle(s.current)) {
      useUser.getState().recordProgress(s.current.id, Math.floor(s.elapsed), (s.current.durationMin ?? 30) * 60);
    }
  });
}
