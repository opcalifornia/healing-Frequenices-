# Phase: Native app (iPhone, Apple Watch, widgets, notifications)

**Status:** in progress (step 2, Capacitor iPhone app, started; see
[Status](#status) below). The web app is built so this is a wrap-and-extend
job, not a rewrite.

## Why native

A website can't do these, on any browser:
- read or write Apple Health (heart rate, HRV, sleep, workouts, mindful
  minutes)
- run on Apple Watch, or offer home-screen widgets and Siri shortcuts
- send reliable push notifications to everyone (installed web apps on
  iPhone get push only from iOS 16.4, and only once added to the Home
  Screen)

## Approach

Wrap the existing React app with **Capacitor**: same code, a real App Store
app. Add native pieces where the web can't reach.

| Feature | How | What it unlocks |
|---|---|---|
| Apple Health | HealthKit via a Capacitor plugin | Read sleep, steps, resting HR, HRV, workouts. Write mindful minutes from Breathe and workouts from Move |
| Apple Watch app | A small native watchOS app in SwiftUI | See below |
| Widgets | WidgetKit (iOS), Glance (Android) | "1-minute settle-in" quick-start, streak, today's plan, current program day |
| Push notifications | APNs and Firebase Cloud Messaging through the back end | Breathing reminders, program day nudges, bedtime wind-down. Replaces today's calendar reminders |
| Siri and Shortcuts | App Intents | "Hey Siri, start Settle in on Rooted" |
| Better heart check | Native camera with torch control | Steadier readings than the web camera |
| Android | Health Connect, Wear OS tile, Glance widgets | The same set of features |

**The Apple Watch app:**
- A haptic breathing pacer on the wrist: taps for inhale and exhale, so you
  can breathe with your eyes closed anywhere.
- Live heart rate during a session.
- A complication that starts a 1-minute settle-in.
- Logs mindful minutes to Apple Health.

## What already exists to plug in

| Existing piece | Native use |
|---|---|
| Breath plans (`rooted/breathPlan.ts`) | Same timings drive the watch haptics |
| Practice log and check-ins (`store/practice.ts`) | Synced to accounts, written to HealthKit as mindful sessions |
| Camera heart check (`rooted/ppg.ts`) | Replaced or cross-checked by watch heart rate when available |
| Reminders (`rooted/reminders.ts`) | Become push notifications |
| Daily plan (`rooted/plan.ts`) | Adapts to Health data (for example, a gentler day after short sleep) |
| AI Coach phase | Uses Health data to tailor the routine |

## Requirements and costs

- **Apple Developer Program:** $99 a year. Needed for TestFlight, the App
  Store, HealthKit and push.
- **Google Play Console:** a one-time $25 fee.
- **A Mac with Xcode** to build the iOS and watch apps, or a cloud build
  service.
- **Test devices:** an iPhone and any recent Apple Watch.
- **App Store review:** HealthKit apps need a clear privacy policy. They
  must not use Health data for advertising.

## Build order

1. **Accounts and sync:** profiles, logs, lists and plans move from the
   device to the back end, so they follow you across devices.
2. **Capacitor iPhone app:** TestFlight build of the current app,
   HealthKit read (sleep, HR, HRV) and write (mindful minutes).
3. **Push notifications:** reminders and program nudges.
4. **Widgets and Siri:** quick-start and today's plan.
5. **Apple Watch app:** haptic pacer, live heart rate, complication.
6. **Android:** Health Connect, widgets, Wear OS tile.

## Status

### Done (on Linux, no Xcode needed)

- **Capacitor 8 installed** in `frontend/`: `@capacitor/core`,
  `@capacitor/haptics`, `@capacitor/local-notifications` (dependencies) and
  `@capacitor/cli`, `@capacitor/ios` (dev dependencies), pinned exact.
- **`frontend/capacitor.config.ts`**: app id `app.rooted.health`, name
  "Rooted", web assets from `dist`, iOS `contentInset: "always"`, background
  `#0b0d0a`, local notification accent `#9cc59a`.
  The app id is a placeholder bundle id. It can change freely until the
  first upload to App Store Connect, then it is permanent; pick the final one
  (it must match the id registered in the Apple Developer account) before
  the first TestFlight build.
- **`frontend/ios/`** generated with `npx cap add ios`. Capacitor 8 uses
  Swift Package Manager, so no CocoaPods was needed. Build output, the copied
  web assets (`ios/App/App/public`) and generated config are git-ignored by
  `ios/.gitignore`; re-create them with `npm run cap:sync`.
- **npm scripts:** `npm run cap:sync` (web build, then copy into the native
  project and update plugins) and `npm run cap:ios` (open in Xcode).
- **`frontend/src/rooted/native.ts`**: `isNative()`, `haptic(kind)`,
  `scheduleEventNotifications(events)` and `onNotificationTap(cb)`. All are
  no-ops in the browser and the artifact build.
  - Calendar events become local notifications 5 minutes before each
    occurrence, for the next 14 days, capped at 60 (iOS keeps at most 64
    pending). Skipped and done dates are left out. Ids are stable 31-bit
    hashes of event id + date, and earlier Rooted notifications are
    cancelled before rescheduling.
  - Tapping a notification opens the event's in-app link (`extra.to`,
    falling back to `/calendar`).
  - The pure scheduling logic, `upcomingOccurrences()`, is tested in
    `src/test/native.test.ts`.
- **`frontend/src/rooted/NativeBridge.tsx`**: `<NativeBridge />` reschedules
  notifications (debounced 1s) whenever the active profile's calendar
  changes and routes notification taps with react-router. Mount it once
  inside the router in `App.tsx`.
- **Haptics:** the breathing player gives a light tap on each phase change
  (inhale, hold, exhale) in the native app. `navigator.vibrate` stays for
  Android browsers; iOS Safari has no vibration API.

### Next, on a Mac

1. Install **Xcode** (App Store) and open it once to accept the licence and
   install the iOS platform. Then `xcode-select --install`.
   CocoaPods is not needed for Capacitor 8 (Swift Package Manager). Install
   it (`brew install cocoapods`) only if a later plugin asks for it.
2. Install Node 20+ and dependencies:
   ```sh
   cd frontend
   npm ci
   ```
3. Build the web app, copy it into the iOS project and open Xcode:
   ```sh
   npm run cap:sync
   # only if frontend/ios/ is missing:  npx cap add ios
   npm run cap:ios
   ```
4. In Xcode, select the **App** target, open **Signing & Capabilities**, tick
   *Automatically manage signing* and choose your **Team** (needs the Apple
   Developer Program for TestFlight; a free Apple ID works for running on
   your own phone). Change the **Bundle Identifier** here and in
   `capacitor.config.ts` if `app.rooted.health` is not the final id.
5. **Run on a device:** plug in the iPhone, enable Developer Mode
   (Settings, Privacy & Security), pick it as the run destination and press
   Run. Check: breathing taps, adding a calendar event 6+ minutes ahead
   prompts for notification permission and fires 5 minutes before, tapping
   the notification opens the event's screen.
6. **TestFlight:** set the version and build number, choose *Any iOS
   Device (arm64)*, Product > Archive, then *Distribute App* > App Store
   Connect > Upload. In App Store Connect, create the app record (same
   bundle id) and add testers under TestFlight.
7. After every web change: `npm run cap:sync`, then Run again in Xcode.

Still to do in this step: app icon and launch screen assets
(`@capacitor/assets` can generate them), HealthKit read and write, and a
privacy policy URL for App Store review.
