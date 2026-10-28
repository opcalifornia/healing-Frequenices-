import Foundation
import WatchConnectivity
import WatchKit

/// Talks to the Rooted iPhone app: sends heart rate and state, and receives start, stop and breathing cues.
final class PhoneLink: NSObject, WCSessionDelegate {
    static let shared = PhoneLink()
    private override init() { super.init() }

    func activate() {
        guard WCSession.isSupported() else { return }
        WCSession.default.delegate = self
        WCSession.default.activate()
    }

    func send(_ message: [String: Any]) {
        let s = WCSession.default
        guard s.activationState == .activated, s.isReachable else { return }
        s.sendMessage(message, replyHandler: nil, errorHandler: nil)
    }

    func session(_ session: WCSession, activationDidCompleteWith activationState: WCSessionActivationState, error: Error?) {}

    func session(_ session: WCSession, didReceiveMessage message: [String: Any]) {
        DispatchQueue.main.async {
            switch message["type"] as? String {
            case "start": WorkoutManager.shared.start()
            case "stop": WorkoutManager.shared.stop()
            case "cue": WristPacer.play(message["kind"] as? String ?? "in")
            default: break
            }
        }
    }
}

/// A tap on the wrist for each breath phase, so you can breathe with your eyes closed.
enum WristPacer {
    static func play(_ kind: String) {
        let device = WKInterfaceDevice.current()
        switch kind {
        case "in", "top": device.play(.directionUp)
        case "out": device.play(.directionDown)
        default: device.play(.click)
        }
    }
}
