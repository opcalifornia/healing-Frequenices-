# Phase: Native app (iPhone, Apple Watch, widgets, notifications)

**Status:** planned. The web app is built so this is a wrap-and-extend job,
not a rewrite.

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
| Widgets | WidgetKit (iOS), Glance (Android) | "1-minute calm" quick-start, streak, today's plan, current program day |
| Push notifications | APNs and Firebase Cloud Messaging through the back end | Breathing reminders, program day nudges, bedtime wind-down. Replaces today's calendar reminders |
| Siri and Shortcuts | App Intents | "Hey Siri, start Calm down in Rooted" |
| Better heart check | Native camera with torch control | Steadier readings than the web camera |
| Android | Health Connect, Wear OS tile, Glance widgets | The same set of features |

**The Apple Watch app:**
- A haptic breathing pacer on the wrist: taps for inhale and exhale, so you
  can breathe with your eyes closed anywhere.
- Live heart rate during a session.
- A complication that starts a 1-minute calm.
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
