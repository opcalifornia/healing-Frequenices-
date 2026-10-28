import Foundation
import HealthKit

/// Runs a mind-and-body workout session so the watch reports heart rate every few seconds, and forwards each
/// reading to the iPhone. By default the finished workout is discarded, so Rooted adds nothing to Apple Health.
final class WorkoutManager: NSObject, ObservableObject {
    static let shared = WorkoutManager()

    /// Set to true to keep each session as a workout in Apple Health.
    static let saveWorkoutsToHealth = false

    private let store = HKHealthStore()
    private var session: HKWorkoutSession?
    private var builder: HKLiveWorkoutBuilder?

    @Published var running = false
    @Published var bpm = 0
    @Published var message = "Open Rooted on your iPhone, then tap Connect Apple Watch."

    func authorize(_ done: @escaping (Bool) -> Void) {
        guard let heart = HKQuantityType.quantityType(forIdentifier: .heartRate) else { done(false); return }
        let read: Set<HKObjectType> = [heart]
        let share: Set<HKSampleType> = [HKObjectType.workoutType()]
        store.requestAuthorization(toShare: share, read: read) { ok, _ in
            DispatchQueue.main.async { done(ok) }
        }
    }

    func start(configuration: HKWorkoutConfiguration? = nil) {
        guard !running else { return }
        authorize { ok in
            guard ok else { self.message = "Allow Health access for Rooted in the Health settings."; return }
            let config = configuration ?? {
                let c = HKWorkoutConfiguration()
                c.activityType = .mindAndBody
                c.locationType = .indoor
                return c
            }()
            do {
                let s = try HKWorkoutSession(healthStore: self.store, configuration: config)
                let b = s.associatedWorkoutBuilder()
                b.dataSource = HKLiveWorkoutDataSource(healthStore: self.store, workoutConfiguration: config)
                s.delegate = self
                b.delegate = self
                self.session = s
                self.builder = b
                let now = Date()
                s.startActivity(with: now)
                b.beginCollection(withStart: now) { _, _ in }
                self.running = true
                self.message = "Breathing session"
                PhoneLink.shared.send(["type": "state", "running": true])
            } catch {
                self.message = "Couldn't start: \(error.localizedDescription)"
            }
        }
    }

    func stop() {
        guard running else { return }
        session?.end()
    }
}

extension WorkoutManager: HKWorkoutSessionDelegate {
    func workoutSession(_ workoutSession: HKWorkoutSession, didChangeTo toState: HKWorkoutSessionState, from fromState: HKWorkoutSessionState, date: Date) {
        DispatchQueue.main.async { self.running = (toState == .running) }
        guard toState == .ended else { return }
        builder?.endCollection(withEnd: date) { _, _ in
            if WorkoutManager.saveWorkoutsToHealth {
                self.builder?.finishWorkout { _, _ in }
            } else {
                self.builder?.discardWorkout()
            }
            DispatchQueue.main.async {
                self.running = false
                self.bpm = 0
                self.message = "Session ended"
            }
            PhoneLink.shared.send(["type": "state", "running": false])
            self.session = nil
            self.builder = nil
        }
    }

    func workoutSession(_ workoutSession: HKWorkoutSession, didFailWithError error: Error) {
        DispatchQueue.main.async { self.message = "Workout problem: \(error.localizedDescription)" }
    }
}

extension WorkoutManager: HKLiveWorkoutBuilderDelegate {
    func workoutBuilderDidCollectEvent(_ workoutBuilder: HKLiveWorkoutBuilder) {}

    func workoutBuilder(_ workoutBuilder: HKLiveWorkoutBuilder, didCollectDataOf collectedTypes: Set<HKSampleType>) {
        guard let heart = HKQuantityType.quantityType(forIdentifier: .heartRate),
              collectedTypes.contains(heart),
              let stats = workoutBuilder.statistics(for: heart),
              let quantity = stats.mostRecentQuantity() else { return }
        let bpm = quantity.doubleValue(for: HKUnit.count().unitDivided(by: HKUnit.minute()))
        DispatchQueue.main.async { self.bpm = Int(bpm.rounded()) }
        PhoneLink.shared.send(["type": "hr", "bpm": bpm])
    }
}
