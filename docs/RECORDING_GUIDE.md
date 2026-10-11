# Recording Guide: Natural Frequencies

How to make your own binaural tracks and nature beds with real instruments and
microphones, keeping digital work to a minimum.

## The one rule that makes binaural beats work

A binaural beat is **two steady tones, one in each ear, a few hertz apart**.
So record **each tone on its own, in mono**, then put one hard left and one
hard right. Never record both tones together in one stereo take: each mic
would pick up both tones, and you would get an ordinary acoustic beat instead
of a binaural one.

The beat is the difference between the two tones:
`right tone - left tone = beat`.

## Instruments

| Instrument | Why | Notes |
|---|---|---|
| **Weighted tuning forks** | Purest, most stable tone; long sustain | Best choice. Buy one base fork and partners for each band (table below). Custom frequencies can be ordered. |
| **Singing bowl, rim-played** | Continuous tone when you rub the rim with the mallet | Measure each bowl's real pitch; pick pairs a few Hz apart. |
| **Shruti box or harmonium** | Endless reed drone | Easy to sustain; tune by ear against a tuner, fine-tune in edit. |
| **Humming or chanting (OM)** | Human, warm | Two takes, one per ear, a few Hz apart. Hard to hold exact pitch. |
| **Frame drum** | Natural rhythmic pulse, no headphones needed | 4–4.5 beats per second is the traditional steady drumming tempo (theta range). Use a metronome. |

### A simple tuning fork kit (128 Hz base)

| Band | Left fork | Right fork | Beat | Use |
|---|---|---|---|---|
| Delta | 128 Hz | 130 Hz | 2 Hz | Sleep |
| Theta | 128 Hz | 134 Hz | 6 Hz | Meditation |
| Alpha | 128 Hz | 138 Hz | 10 Hz | Relaxation |
| Beta | 128 Hz | 143 Hz | 15 Hz | Focus |
| Gamma | 256 Hz | 296 Hz | 40 Hz | Short sessions only |

128 Hz forks are common and inexpensive; the partners are custom orders.

## Shot list

Record everything at **48 kHz / 24-bit WAV**, peaking around **-12 dBFS**.

### Indoor tone sessions (night, quietest room)

Before you record, switch off the fridge, the air conditioning and anything
that hums. Hang blankets and put down rugs to kill echo.

1. **Room tone**: 2 minutes of silence with the mic set up exactly as for the tones. Used to clean noise later.
2. **Base fork, 128 Hz**: mono, small-diaphragm condenser 30–50 cm away. Strike with a rubber mallet, then touch the stem to a wooden box or table so it rings out. 15–20 strikes; let each fully decay.
3. **Each partner fork** (130, 134, 138, 143 Hz): the same setup and distance, 15–20 strikes each.
4. **Singing bowls, rim-played**: mono, 50 cm. Hold a steady tone for 1–3 minutes per take, 5 takes per bowl.
5. **Shruti box drone**: mono, 50 cm, from behind the bellows to avoid air noise. 3–5 minutes per take.
6. **Frame drum**: mono, 1 m, steady 4–4.5 beats per second with a click in your headphones. 10 minutes.

### Outdoor nature beds (stereo)

Use a stereo pair (XY or ORTF) with a furry windscreen. Record **15–20
uninterrupted minutes** per spot, and note time and place. Avoid roads and
flight paths, and stop recording when people talk.

7. **Waterfall**: 20–50 m back. Too close sounds like harsh hiss; distance rounds it into a roar.
8. **Mountain stream**: 1–2 m from a small drop over rocks, mics low and angled down.
9. **Rain**: under an eave or a tent. Try different surfaces (leaves, canvas, wood); soft surfaces sound calmer.
10. **Rainforest or woodland birds**: dawn chorus, about 30–60 minutes before sunrise, in still air.
11. **Ocean surf** (for Deep Sync): 30–100 m from the water, on a calm day with long, slow waves.

## Putting a track together

Use a free editor such as Audacity, or Reaper.

1. **Measure the pitch** of every fork or bowl take with a spectrum analyzer or tuner. Keep the steadiest takes.
2. **Make a sustained tone**: overlap fork strikes with 3–5 second crossfades so the tone never dies away. Bowls and drones are already sustained.
3. **Pan** the base tone **100% left** and the partner **100% right**.
4. **Check the beat**: the analyzer should show the two peaks exactly the target distance apart (for example 128 and 134 = 6 Hz). If a tone is slightly off, a tiny pitch correction is the only digital step you need.
5. **Add a nature bed** underneath, about 15–20 dB quieter than the tones.
6. **Make loops** 2–5 minutes long, with a crossfade at the loop point.
7. **Loudness**: about **-16 LUFS** with peaks below -1 dBTP. Keep it gentle.
8. **Export** a 48 kHz / 24-bit WAV master, plus a 256 kbps AAC or MP3 copy for the app.

## Getting them into the app

- **Nature beds**: put the file in `frontend/public/ambience/` and set `src`
  and `credit` on its entry in `frontend/src/audio/ambience.ts`. The app
  then plays the recording instead of the generated version.
- **Recorded tone sessions**: these will be hosted on Cloudflare R2 through
  the media endpoint that is already in the API. Send the files over when
  they are ready, and the app will be wired to play them.

## Voice cues for Breathe

The breathing player speaks cues ("Breathe in", "Hold", "Breathe out"). Until
you record your own, it uses the phone's built-in voice. To swap in your
voice:

1. **Room:** a quiet, soft room (a closet full of clothes is perfect). Mouth
   about a hand's width from the mic, slightly off to the side to avoid
   pops.
2. **Delivery:** slower and softer than normal speech, as if talking to
   someone falling asleep. Smile slightly; it warms the tone.
3. **Takes:** record each cue three or four times and keep the calmest.
   - "Breathe in"
   - "Sip in a little more"
   - "Hold"
   - "Breathe out"
   - "Hold" (a second, slightly lower take, for after the exhale)
   - "Well done. Let your breath return to normal."
4. **Edit:**
   - Trim to about 0.2 seconds of silence before each word, and cut tight
     at the end.
   - Normalize so all clips are the same loudness.
   - Export mono MP3 at 128 kbps.
5. **Install:** name the files `in.mp3`, `top.mp3`, `hold.mp3`, `out.mp3`,
   `rest.mp3` and `done.mp3`, and put them in `frontend/public/audio/voice/`.
   The app picks them up automatically.

## Safety

The same rules apply to recorded tracks: headphones for binaural content, low
volume, never while driving, and a doctor's check for anyone with epilepsy or
a seizure disorder. Describe tracks as "may support relaxation, focus, or
sleep", never as treatment.
