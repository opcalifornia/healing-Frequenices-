import Foundation
import Capacitor
import HealthKit
import WatchConnectivity

/// Bridges the Rooted web app to the Rooted Apple Watch app.
///
/// Web -> watch: start or stop a breathing workout on the watch, and send a haptic cue for each breath phase.
/// Watch -> web: a "heartSample" event with the live heart rate (beats per minute) and a "watchState" event.
///
/// Heart rate comes from a workout session running on the watch (HKWorkoutSession), which is the only way to get
/// readings every few seconds. Health data stays on the devices; nothing here uploads anything.
@objc(RootedHeartPlugin)
public class RootedHeartPlugin: CAPPlugin, CAPBridgedPlugin, WCSessionDelegate {
    public let identifier = "RootedHeartPlugin"
    public let jsName = "RootedHeart"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "startWatchSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "stopWatchSession", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "cue", returnType: CAPPluginReturnPromise)
    ]

    private let health = HKHealthStore()
    private var wc: WCSession? { WCSession.isSupported() ? WCSession.default : nil }

    override public func load() {
        guard let s = wc else { return }
        s.delegate = self
        s.activate()
    }

    // MARK: Methods called from JavaScript

    @objc func status(_ call: CAPPluginCall) {
        call.resolve(statusDictionary())
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        guard HKHealthStore.isHealthDataAvailable(), let heart = HKQuantityType.quantityType(forIdentifier: .heartRate) else {
            call.reject("Health data isn't available on this device.")
            return
        }
        let read: Set<HKObjectType> = [heart]
        let share: Set<HKSampleType> = [HKObjectType.workoutType()]
        health.requestAuthorization(toShare: share, read: read) { granted, error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve(["granted": granted]) }
        }
    }

    @objc func startWatchSession(_ call: CAPPluginCall) {
        guard let s = wc, s.isPaired, s.isWatchAppInstalled else {
            call.reject("Pair an Apple Watch and install the Rooted Watch app first.")
            return
        }
        let config = HKWorkoutConfiguration()
        config.activityType = .mindAndBody
        config.locationType = .indoor
        // Launches (or wakes) the Rooted Watch app, which starts the workout in WKApplicationDelegate.handle(_:).
        health.startWatchApp(with: config) { started, error in
            if let error = error { call.reject(error.localizedDescription) } else { call.resolve(["started": started]) }
        }
    }

    @objc func stopWatchSession(_ call: CAPPluginCall) {
        send(["type": "stop"])
        call.resolve()
    }

    /// kind: "in", "top", "hold", "out" or "rest". The watch taps your wrist for each one.
    @objc func cue(_ call: CAPPluginCall) {
        send(["type": "cue", "kind": call.getString("kind") ?? "in"])
        call.resolve()
    }

    // MARK: Helpers

    private func statusDictionary() -> [String: Any] {
        let s = wc
        return [
            "healthAvailable": HKHealthStore.isHealthDataAvailable(),
            "watchSupported": WCSession.isSupported(),
            "paired": s?.isPaired ?? false,
            "appInstalled": s?.isWatchAppInstalled ?? false,
            "reachable": s?.isReachable ?? false
        ]
    }

    private func send(_ message: [String: Any]) {
        guard let s = wc, s.activationState == .activated, s.isReachable else { return }
        s.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    private func handle(_ message: [String: Any]) {
        switch message["type"] as? String {
        case "hr":
            if let bpm = message["bpm"] as? Double { notifyListeners("heartSample", data: ["bpm": bpm]) }
        case "state":
            var data = statusDictionary()
            if let running = message["running"] as? Bool { data["running"] = running }
            notifyListeners("watchState", data: data)
        default:
            break
        }
    }

    // MARK: WCSessionDelegate

    public func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {
        notifyListeners("watchState", data: statusDictionary())
    }

    public func sessionDidBecomeInactive(_ session: WCSession) {}

    public func sessionDidDeactivate(_ session: WCSession) {
        session.activate()
    }

    public func sessionReachabilityDidChange(_ session: WCSession) {
        notifyListeners("watchState", data: statusDictionary())
    }

    public func sessionWatchStateDidChange(_ session: WCSession) {
        notifyListeners("watchState", data: statusDictionary())
    }

    public func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        handle(message)
    }

    public func session(_ session: WCSession, didReceiveMessage message: [String: Any], replyHandler: @escaping ([String: Any]) -> Void) {
        handle(message)
        replyHandler([:])
    }
}
