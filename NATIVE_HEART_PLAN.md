> **Update:** the Apple Watch part is now written. See `docs/WATCH_SETUP.md` for the Xcode steps. The rest of this file is the original plan.

# Live heart rate in Rooted: what works now, and the Apple Watch plan

## What works today (web, no install)
- **Any Bluetooth LE heart monitor that uses the standard Heart Rate service** (GATT service `heart_rate`, characteristic `heart_rate_measurement`, 0x2A37). Chest straps (Polar, Wahoo and similar), and wearables set to broadcast heart rate (many Garmin watches: Settings > Watch Sensors > Wrist Heart Rate > Broadcast Heart Rate).
- Needs **Chrome or Edge on Android, Windows, Mac or Chromebook**. Safari on iPhone has no Web Bluetooth. (Third-party browsers such as Bluefy add it on iOS, but we shouldn't rely on that.)
- Chest straps send **RR intervals**, so we show real **RMSSD**. Wrist sensors usually don't, or are less accurate.
- Code: `src/rooted/heartFeed.ts` (decoder + Bluetooth + demo), `src/store/heartLive.ts` (one shared connection), `src/rooted/hrInsights.ts` (summary and plain pointers), `src/rooted/HeartLive.tsx` (graph, live strip, summary, connect card), `src/store/heartSessions.ts` (summaries only, never raw readings). Tests: `src/test/heart.test.ts`.
- Readings stay in memory and on the device. Demo data is labelled and never saved.

## Apple Watch: why it needs the iPhone app
- Safari on iPhone can't talk to Bluetooth devices.
- The Apple Watch doesn't broadcast a standard Bluetooth heart-rate signal by itself. Apps such as HR Broadcast, HeartCast and ECHO run a Watch app and relay the signal through the iPhone.
- HealthKit is only available to native apps. Live readings during a session come from a **workout session on the Watch** (`HKWorkoutSession` with `HKLiveWorkoutBuilder`), not from reading Health afterwards (Health data from the Watch arrives in batches and is too slow for a live graph).

## The plan (needs a Mac with Xcode and an Apple Developer account, about 99 USD a year)
1. **Wrap the web app** with Capacitor (`NativeBridge.tsx` and `native.ts` already exist as the bridge).
2. **watchOS companion app** (SwiftUI). On "Start session" from the phone:
   - request HealthKit authorization for heart rate (and HRV if wanted) with clear usage text (`NSHealthShareUsageDescription`, `NSHealthUpdateUsageDescription`);
   - start an `HKWorkoutSession` (activity type mind and body) with an `HKLiveWorkoutBuilder`;
   - on every new heart-rate sample send `{ t, bpm }` to the phone with `WCSession.sendMessage` (low latency while the phone is reachable) and fall back to `transferUserInfo`.
3. **iPhone Capacitor plugin** (Swift): receive the messages and emit a JS event `heartSample` with the same shape as `HeartSample` in `heartFeed.ts`. Also expose `startWatchSession()` and `stopWatchSession()`.
4. **Web side:** add a third feed in `heartFeed.ts`, `connectAppleWatch(onSample, onEnd)`, that listens for `heartSample`. Everything else (store, graph, summary, pointers) already works unchanged.
5. **Also in the native app:** CoreBluetooth for chest straps (iOS can't use Web Bluetooth), through a Capacitor BLE plugin, feeding the same `HeartSample`.
6. **Privacy and review:** write a clear health-data section in the privacy policy (data stays on device; no upload without consent; no ads or data sale); only request the HealthKit types we use; explain why in the App Review notes. Our wording stays wellness-only. We never diagnose.

## Honest limits to tell users
- Wrist heart rate is less accurate than a chest strap, especially for variability.
- A drop in heart rate during slow breathing is common but not guaranteed, and it is not a measure of health or anxiety.
- Not a medical device. If you're worried about your heart, ask a clinician.

## Possible next steps once a Watch or strap is available
- Compare techniques by how much your heart rate settled (a personal chart in Your results).
- Use real HRV from a chest strap to improve the resonance pace finder (a true resonance-frequency test, in place of the current by-feel version).
- Show breathing-linked heart swing live as a "coherence" ring.
