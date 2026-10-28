import SwiftUI
import HealthKit
import WatchKit

@main
struct RootedWatchApp: App {
    @WKApplicationDelegateAdaptor(AppDelegate.self) private var delegate

    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(WorkoutManager.shared)
        }
    }
}

/// The iPhone app launches this app with a workout configuration (HKHealthStore.startWatchApp), and we start the session.
final class AppDelegate: NSObject, WKApplicationDelegate {
    func applicationDidFinishLaunching() {
        PhoneLink.shared.activate()
    }

    func handle(_ workoutConfiguration: HKWorkoutConfiguration) {
        WorkoutManager.shared.start(configuration: workoutConfiguration)
    }
}
