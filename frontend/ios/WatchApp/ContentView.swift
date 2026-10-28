import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var workout: WorkoutManager

    var body: some View {
        VStack(spacing: 8) {
            Text("Rooted").font(.headline).foregroundStyle(.green)
            if workout.running {
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Image(systemName: "heart.fill").foregroundStyle(.pink)
                    Text(workout.bpm > 0 ? "\(workout.bpm)" : "--")
                        .font(.system(size: 44, weight: .bold, design: .rounded))
                        .monospacedDigit()
                    Text("bpm").font(.footnote).foregroundStyle(.secondary)
                }
                Button("End session") { workout.stop() }
            } else {
                Text(workout.message)
                    .font(.footnote)
                    .multilineTextAlignment(.center)
                    .foregroundStyle(.secondary)
                Button("Start") { workout.start() }
            }
        }
        .padding()
    }
}
