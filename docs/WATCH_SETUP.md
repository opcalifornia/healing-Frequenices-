# Apple Watch: build and connect (Mac with Xcode)

What's already written (in this repo, not yet built or tested on a real watch):
- **iPhone plugin:** `frontend/plugins/rooted-heart/` (Swift). Added to the iPhone project automatically by `npx cap sync ios`.
- **Watch app source:** `frontend/ios/WatchApp/` (SwiftUI). You add it to Xcode as a new Watch target (steps below).
- **Web side:** `frontend/src/rooted/heartNative.ts`, `store/heartLive.ts`, and a **Connect Apple Watch** button in Breathe, Tools. It only appears inside the iPhone app.

How it works: the web app asks the iPhone plugin to start a watch session. The plugin launches the Rooted Watch app (`HKHealthStore.startWatchApp`), which runs a mind-and-body workout, reads heart rate live, and sends each reading back over WatchConnectivity. The watch also taps your wrist for every in and out breath.

## You need
- A Mac with **Xcode 15 or newer** (free from the App Store) and Node 22 (see `MAC_SETUP.md`).
- An iPhone running iOS 15 or newer, **paired with an Apple Watch running watchOS 9 or newer**, both with Developer Mode on (Settings, Privacy and Security, Developer Mode).
- An **Apple ID**. A free one can install to your own devices (the app expires after 7 days). TestFlight and the App Store need the Apple Developer Program, 99 USD a year.

## 1. Build the web app into the iPhone project
```
cd healing-Frequenices-/frontend
npm install
npm run cap:sync          # builds the web app and syncs it and the plugins to iOS
npm run cap:ios           # opens Xcode (or open ios/App/App.xcodeproj)
```

## 2. Set up the iPhone app target
1. In Xcode, click the blue **App** project, then the **App** target.
2. **Signing and Capabilities:** tick *Automatically manage signing* and choose your Team.
3. Click **+ Capability** and add **HealthKit**.
4. If Xcode says the bundle id `app.rooted.health` is taken, change it to something unique, like `app.rooted.health.yourname`, and use the same pattern for the watch (step 3).

## 3. Add the Watch app target
1. **File, New, Target, watchOS, App** (named "Watch App"). Product name: `Rooted Watch App`. Interface: SwiftUI. Choose **Watch App for Existing iOS App** and pick **App** as the companion.
2. Xcode creates a few starter Swift files for it. **Delete them** (Move to Trash).
3. Drag the four files from `frontend/ios/WatchApp/` (`RootedWatchApp.swift`, `WorkoutManager.swift`, `PhoneLink.swift`, `ContentView.swift`) into the new Watch group. Tick **Copy items if needed** off, and tick the **Rooted Watch App** target.
4. Select the Watch target, then **Signing and Capabilities**: choose your Team, add **HealthKit**, and add **Background Modes** with **Workout processing** ticked.
5. In the Watch target's **Info** tab add two rows: `Privacy - Health Share Usage Description` and `Privacy - Health Update Usage Description`, each with a short sentence such as "Rooted reads your heart rate during breathing sessions."
6. Set the Watch target's minimum deployment to **watchOS 9.0**.

## 4. Run it
1. Plug in your iPhone (trust the computer). In Xcode choose the **App** scheme and your iPhone as the destination, then press **Run**. Xcode installs the iPhone app and the Watch app.
2. On the iPhone open the **Watch** app, find **Rooted**, and make sure **Show App on Apple Watch** is on.
3. Open Rooted on the iPhone, then **Breathe**, then scroll to **Tools**, then **Connect Apple Watch**. Allow Health access on the iPhone and on the watch when asked.
4. The watch opens Rooted and shows your heart rate. Start any breathing session. You'll see the live graph on the phone and feel a tap on your wrist for each breath. After the session you get the summary.

## If something doesn't work
- **No Connect Apple Watch button:** you're in a browser. It only shows in the iPhone app.
- **"Rooted Watch app isn't installed":** check step 4.2, and that the watch is unlocked and on your wrist.
- **Plugin "not implemented":** run `npm run cap:sync` again, then Product, Clean Build Folder in Xcode, and run again.
- **Heart rate stays at `--`:** sit still with the watch snug. The first reading can take 5 to 10 seconds. Check Health access for Rooted on both devices (Health app, Sharing, Apps).
- **Build errors:** paste the first red error to Claude; small fixes are likely because the Swift was written without compiling on a Mac.

## Privacy
Readings go from the watch to the iPhone app and the web view, in memory only. Nothing is uploaded. By default the workout is **discarded** when you finish, so Rooted adds nothing to Apple Health (change `saveWorkoutsToHealth` in `WorkoutManager.swift` to keep sessions). Before an App Store release the privacy policy needs a health-data section.
