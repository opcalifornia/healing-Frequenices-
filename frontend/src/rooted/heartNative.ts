import { registerPlugin, type PluginListenerHandle } from "@capacitor/core";
import { isNative } from "./native";
import type { FeedHandle, HeartSample } from "./heartFeed";

/**
 * Apple Watch live heart rate, through the Rooted iPhone app. The native plugin (frontend/plugins/rooted-heart) talks
 * to the Rooted Watch app (frontend/ios/WatchApp). In a browser none of this exists, so everything here is a safe
 * no-op and `watchSupported()` is false.
 */

export interface WatchStatus {
  healthAvailable: boolean;
  watchSupported: boolean;
  paired: boolean;
  appInstalled: boolean;
  reachable: boolean;
  running?: boolean;
}

export interface RootedHeartPlugin {
  status(): Promise<WatchStatus>;
  requestAuthorization(): Promise<{ granted: boolean }>;
  startWatchSession(): Promise<{ started: boolean }>;
  stopWatchSession(): Promise<void>;
  cue(options: { kind: string }): Promise<void>;
  addListener(event: "heartSample", cb: (d: { bpm: number }) => void): Promise<PluginListenerHandle>;
  addListener(event: "watchState", cb: (d: WatchStatus) => void): Promise<PluginListenerHandle>;
}

const unavailable = () => Promise.reject(new Error("Apple Watch isn't available here. Use the Rooted iPhone app."));
export const RootedHeart = registerPlugin<RootedHeartPlugin>("RootedHeart", {
  web: () => ({
    status: () => Promise.resolve({ healthAvailable: false, watchSupported: false, paired: false, appInstalled: false, reachable: false }),
    requestAuthorization: unavailable,
    startWatchSession: unavailable,
    stopWatchSession: () => Promise.resolve(),
    cue: () => Promise.resolve(),
    addListener: () => Promise.resolve({ remove: () => Promise.resolve() }),
  }) as unknown as RootedHeartPlugin,
});

export const watchSupported = (): boolean => isNative();

/** Plain-English reason a watch can't be used right now, or null when it can. */
export function watchProblem(s: WatchStatus): string | null {
  if (!s.healthAvailable) return "Health data isn't available on this iPhone.";
  if (!s.watchSupported || !s.paired) return "No Apple Watch is paired with this iPhone. Pair one in the Watch app first.";
  if (!s.appInstalled) return "The Rooted Watch app isn't installed on your watch yet. Open the Watch app on your iPhone, find Rooted, and turn on Show App on Apple Watch.";
  return null;
}

/** Start a breathing workout on the watch and stream its heart rate. Must be called from a tap. */
export async function connectAppleWatch(onSample: (s: HeartSample) => void, onEnd: () => void, plugin: RootedHeartPlugin = RootedHeart): Promise<FeedHandle> {
  const status = await plugin.status();
  const problem = watchProblem(status);
  if (problem) throw Object.assign(new Error(problem), { name: "WatchUnavailable" });
  const auth = await plugin.requestAuthorization();
  if (!auth.granted) throw Object.assign(new Error("Allow Health access for Rooted, then try again."), { name: "WatchUnavailable" });
  const handles: PluginListenerHandle[] = [];
  handles.push(await plugin.addListener("heartSample", (d) => { if (d.bpm > 0) onSample({ t: performance.now(), bpm: Math.round(d.bpm) }); }));
  handles.push(await plugin.addListener("watchState", (d) => { if (d.running === false) onEnd(); }));
  await plugin.startWatchSession();
  return {
    name: "Apple Watch",
    demo: false,
    stop() {
      void plugin.stopWatchSession().catch(() => undefined);
      handles.forEach((h) => void h.remove());
    },
  };
}

/** A tap on the wrist for a breath phase. Does nothing unless a watch is connected. */
export function cueWatch(kind: string, plugin: RootedHeartPlugin = RootedHeart): void {
  void plugin.cue({ kind }).catch(() => undefined);
}
