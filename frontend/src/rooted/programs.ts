import type { Strength } from "../learn/brainContent";
import type { flags } from "../store/wellness";

/**
 * Programs: multi-day courses made of short lessons. This is the format
 * Rooted Pros will author in; the first programs are written in-house.
 */

export type Block =
  | { type: "read"; title: string; body: string[]; diagram?: "breathing-body" | "heart-rhythm" | "digestive" | "fiber" | "glucose" | "light-clock" }
  | { type: "breath"; technique: string; minutes: number }
  | { type: "move"; routine: string; minutes?: number }
  | { type: "shop"; title: string; body: string; items: string[] }
  | { type: "water" }
  | { type: "ground" }
  | { type: "quiz"; question: string; options: string[]; answer: number; explain: string }
  | { type: "reflect"; prompt: string; lines: number }
  | { type: "action"; title: string; body: string };

export interface ProgramDay {
  title: string;
  blocks: Block[];
}

export interface Program {
  id: string;
  section: "breathe" | "move" | "nourish" | "spirit";
  title: string;
  tagline: string;
  about: string;
  author: { name: string; role: string; verified: boolean };
  hue: number;
  hue2: number;
  evidence: Strength;
  days: ProgramDay[];
  live: boolean;
}

export const PROGRAMS: Program[] = [
  {
    id: "relax-7", section: "breathe", title: "7 Days to Relax", tagline: "A few minutes a day to retrain how you respond to stress",
    about: "One short lesson a day. You'll learn why slow breathing works, practice the five most useful techniques, and finish knowing which one works best for you. About 5 minutes a day.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 195, hue2: 160, evidence: "Moderate", live: true,
    days: [
      {
        title: "Your breath is a remote control",
        blocks: [
          { type: "read", title: "The only automatic system you can steer", body: ["Your heartbeat, digestion and stress response run on autopilot. Breathing does too, but you can take the wheel any time.", "When you slow your breathing, especially your exhale, you signal safety to your nervous system. Your heart slows, and your body shifts toward rest-and-digest."], diagram: "breathing-body" },
          { type: "breath", technique: "calm", minutes: 2 },
          { type: "quiz", question: "Which part of the breath most slows your heart?", options: ["Breathing in", "Breathing out", "Holding your breath"], answer: 1, explain: "Your heart naturally slows a little on every exhale. Making the exhale longer than the inhale strengthens that relaxing effect." },
        ],
      },
      {
        title: "The fastest reset: the physiological sigh",
        blocks: [
          { type: "read", title: "Two breaths in, one long breath out", body: ["When you're stressed, tiny air sacs in your lungs can partly collapse. A second, short top-up inhale reopens them, and a long exhale offloads carbon dioxide.", "In a Stanford study, five minutes a day of cyclic sighing for a month improved mood and lowered breathing rate more than mindfulness meditation."] },
          { type: "breath", technique: "sigh", minutes: 2 },
          { type: "action", title: "Use it today", body: "The next time you feel your shoulders creep up, a tough email, traffic, a hard conversation, do just one or two sighs. Notice what changes." },
        ],
      },
      {
        title: "Find your rhythm: resonance breathing",
        blocks: [
          { type: "read", title: "Six breaths a minute", body: ["At around six breaths a minute, your breathing and heart rate fall into step. Heart rate rises on each inhale and falls on each exhale, and the swings get much bigger.", "Bigger swings mean higher heart rate variability, a sign your relaxation response is engaged. Switch the chart between normal and slow breathing to see it."], diagram: "heart-rhythm" },
          { type: "breath", technique: "coherent", minutes: 5 },
          { type: "quiz", question: "About how many breaths a minute is resonance breathing?", options: ["About 15", "About 10", "About 6"], answer: 2, explain: "Around 5.5 to 6 breaths a minute, or about 5 seconds in and 5 seconds out, is the pace where breathing and heart rhythm line up for most adults." },
        ],
      },
      {
        title: "Box breathing for pressure",
        blocks: [
          { type: "read", title: "Steady under stress", body: ["Box breathing, four equal counts of in, hold, out, hold, is used by first responders and athletes to stay steady before high-pressure moments.", "The holds give your mind something simple to count, which crowds out racing thoughts. Follow the dot around the square."] },
          { type: "breath", technique: "box", minutes: 2 },
          { type: "action", title: "Before your next big moment", body: "Before a meeting, a call, or walking into a room, do four slow boxes. It takes about a minute." },
        ],
      },
      {
        title: "Grounding when anxiety spikes",
        blocks: [
          { type: "read", title: "Back to the room", body: ["Anxiety pulls your attention into the future: what might go wrong. Grounding pulls it back to right now, through your senses.", "Pair it with a slow exhale and you work on both your body and your mind."] },
          { type: "ground" },
          { type: "reflect", prompt: "What situations make you most tense?", lines: 2 },
        ],
      },
      {
        title: "Breathing for sleep",
        blocks: [
          { type: "read", title: "A long exhale in bed", body: ["At night, a very slow breath with a long exhale helps quiet a busy mind. 4-7-8 breathing slows you down to about three breaths a minute.", "If it makes you light-headed, keep the hold shorter. There's no need to force it."] },
          { type: "breath", technique: "478", minutes: 2 },
          { type: "action", title: "Tonight", body: "Once you're in bed with the lights off, do four rounds of 4-7-8, then let your breath return to normal. If you're still awake, do four more." },
        ],
      },
      {
        title: "Make it yours",
        blocks: [
          { type: "read", title: "What worked for you?", body: ["You've practiced five techniques this week. The best one is the one you'll actually use.", "Check Your results on the Breathe page: if you rated your stress before and after, it shows which technique lowered it most for you."] },
          { type: "breath", technique: "calm", minutes: 5 },
          { type: "reflect", prompt: "Which technique will you keep using, and when?", lines: 2 },
        ],
      },
    ],
  },
  {
    id: "mornings-5", section: "move", title: "5 Gentle Mornings", tagline: "Wake up your body in about 10 minutes a day",
    about: "Five mornings, five ways to start the day: daylight, water, gentle movement and breath. No equipment, no gym, nothing strenuous. About 10 minutes each.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 40, hue2: 15, evidence: "Moderate", live: true,
    days: [
      {
        title: "Light, water, stretch",
        blocks: [
          { type: "read", title: "The three-minute head start", body: ["Morning daylight is the strongest signal for your body clock: it helps you feel alert now and sleepy at the right time tonight.", "You also wake up a little dehydrated after a night without water. Light, a glass of water and a gentle stretch is a simple, proven way to start."], diagram: "light-clock" },
          { type: "action", title: "Get some daylight", body: "Open the curtains or step outside for a few minutes. Outdoor light is far brighter than indoor light, even on a cloudy day." },
          { type: "water" },
          { type: "move", routine: "wake" },
        ],
      },
      {
        title: "Move, then breathe",
        blocks: [
          { type: "read", title: "Movement wakes the body; breath steadies the mind", body: ["A few minutes of stretching gets blood moving and loosens stiffness from sleep.", "Following it with slow breathing helps you start the day steady instead of rushed."] },
          { type: "move", routine: "wake" },
          { type: "breath", technique: "calm", minutes: 1 },
          { type: "quiz", question: "What's the strongest signal that sets your body clock in the morning?", options: ["Your alarm", "Coffee", "Daylight"], answer: 2, explain: "Light reaching special cells in your eyes is the main signal your master clock uses. Getting outside soon after waking helps you feel alert in the day and sleepy at night." },
        ],
      },
      {
        title: "Qigong: the Eight Brocades",
        blocks: [
          { type: "read", title: "A centuries-old morning practice", body: ["Ba Duan Jin, the Eight Brocades, is a set of slow, flowing movements practiced in parks across China every morning.", "Studies suggest qigong may help with balance, flexibility and stress. Today you'll learn the first four. Move slowly, and breathe with each movement."] },
          { type: "move", routine: "brocades" },
          { type: "reflect", prompt: "How does your body feel compared with when you woke up?", lines: 1 },
        ],
      },
      {
        title: "Tai chi for balance",
        blocks: [
          { type: "read", title: "Slow is the point", body: ["Tai chi is moving meditation. A Cochrane review found it reduced falls in older adults by about a fifth, and it's gentle enough for almost anyone.", "Shift your weight slowly, keep your knees soft, and let your breath set the pace."] },
          { type: "move", routine: "taichi" },
          { type: "action", title: "Take it with you", body: "Today, while you wait for the kettle or the elevator, do a few slow weight shifts from foot to foot." },
        ],
      },
      {
        title: "Gentle yoga and a plan",
        blocks: [
          { type: "read", title: "Ten minutes on the floor", body: ["Today's flow brings everything together: breath, stretching and a few gentle strength moves like bridge.", "The American College of Physicians recommends yoga and tai chi as first options for chronic low back pain. Use the easier option on any move."] },
          { type: "move", routine: "yoga" },
          { type: "reflect", prompt: "Which morning routine will you keep, and on which days?", lines: 2 },
        ],
      },
    ],
  },
  {
    id: "fiber-7", section: "nourish", title: "7 Days to More Fiber", tagline: "Small swaps toward 25 to 29 grams a day",
    about: "Most adults eat about half the fiber linked to the biggest health benefits. One small, tasty swap a day, the science behind it, and a shopping list that builds itself.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 90, hue2: 45, evidence: "Strong", live: true,
    days: [
      {
        title: "Why fiber matters",
        blocks: [
          { type: "read", title: "The nutrient most of us are missing", body: ["A WHO-commissioned review of 185 studies and 58 trials found that people eating 25 to 29 grams of fiber a day had 15 to 30% lower risk of death, heart disease, stroke, type 2 diabetes and colorectal cancer than people eating the least.", "Most adults get around 15 grams. Fiber comes in two kinds, and each works differently. Switch between them below."], diagram: "fiber" },
          { type: "quiz", question: "How much fiber a day is linked to the biggest benefits?", options: ["About 10 grams", "About 25 to 29 grams", "About 60 grams"], answer: 1, explain: "25 to 29 grams a day, and studies found even more was better. Increase slowly and drink water as you do, to avoid bloating." },
        ],
      },
      {
        title: "Swap your breakfast",
        blocks: [
          { type: "read", title: "Oats: the cholesterol-lowering grain", body: ["Oats contain beta-glucan, a soluble fiber that lowers LDL cholesterol. It's one of the few foods with an FDA-authorized heart health claim.", "A bowl of oatmeal with berries and a spoon of chia gets you about a third of the way to your daily fiber."] },
          { type: "shop", title: "For tomorrow's breakfast", body: "Steel-cut or rolled oats, berries (frozen is great) and chia seeds.", items: ["oats", "blueberries", "chia"] },
          { type: "action", title: "Tomorrow morning", body: "Make overnight oats tonight: half a cup of oats, a spoon of chia, milk or yogurt, and berries. Into the fridge, ready when you wake up." },
        ],
      },
      {
        title: "Beans, lentils and chickpeas",
        blocks: [
          { type: "read", title: "The Blue Zones staple", body: ["Beans, lentils and chickpeas are packed with fiber and protein, and a daily serving lowered LDL cholesterol in a meta-analysis of trials.", "They're a daily food in every Blue Zone, the regions where people live longest. Canned is fine: just rinse them."] },
          { type: "shop", title: "Stock your pantry", body: "Pick any you like. Red lentils cook in 20 minutes; canned chickpeas and black beans are ready now.", items: ["lentils", "chickpeas", "black-beans"] },
          { type: "quiz", question: "What does soluble fiber do to sugar from a meal?", options: ["Speeds it into your blood", "Slows how fast it reaches your blood", "Nothing"], answer: 1, explain: "Soluble fiber forms a gel in your gut that slows digestion, so sugar enters your blood more gradually and you stay full longer." },
        ],
      },
      {
        title: "Walk after you eat",
        blocks: [
          { type: "read", title: "Two minutes that change the curve", body: ["Fiber slows sugar from the inside; a short walk after eating helps your muscles use it up. A review of seven studies found even 2 to 5 minutes of light walking after a meal lowered blood sugar compared with sitting.", "Drag across the chart to compare."], diagram: "glucose" },
          { type: "move", routine: "walk", minutes: 5 },
        ],
      },
      {
        title: "Feed your gut microbes",
        blocks: [
          { type: "read", title: "Fermented foods", body: ["Your large intestine is home to tens of trillions of microbes that ferment fiber into compounds that feed your gut lining.", "In a Stanford trial, eating more fermented foods for 10 weeks increased microbiome diversity and lowered 19 inflammation markers. Follow a bite through your body below."], diagram: "digestive" },
          { type: "shop", title: "Pick one or two", body: "Plain yogurt or kefir with breakfast, and kimchi or sauerkraut with dinner. Look for 'live cultures' and the refrigerated kind.", items: ["yogurt", "kefir", "kimchi", "sauerkraut"] },
        ],
      },
      {
        title: "Seeds and nuts",
        blocks: [
          { type: "read", title: "A spoonful at a time", body: ["Ground flaxseed, chia, walnuts and pumpkin seeds add fiber, plant omega-3s and magnesium with almost no effort.", "In PREDIMED, a daily handful of nuts as part of a Mediterranean diet cut major heart events by about 30%."] },
          { type: "shop", title: "Sprinkle-ready", body: "Buy flaxseed ground (whole seeds pass straight through) and keep it in the fridge.", items: ["flaxseed", "walnuts", "pumpkin-seeds"] },
          { type: "action", title: "Today", body: "Add a spoonful of seeds or a small handful of nuts to one meal or snack." },
        ],
      },
      {
        title: "Put it on your plate",
        blocks: [
          { type: "read", title: "Your fiber week, together", body: ["Oats and berries in the morning, beans or lentils at lunch, vegetables filling half your plate, a fermented food, a spoon of seeds, and a short walk after eating.", "As fiber goes up, water should too: it helps fiber do its job."] },
          { type: "water" },
          { type: "reflect", prompt: "Which swaps will you keep?", lines: 2 },
        ],
      },
    ],
  },
  {
    id: "sleep-7", section: "breathe", title: "7 Nights of Better Sleep", tagline: "Light, timing and a more relaxed wind-down, one habit a night",
    about: "Seven short lessons on the habits most linked to better sleep: morning light, a caffeine cutoff, a wind-down routine, slow breathing in bed, a cool dark bedroom, parking your worries, and what sleep researchers teach about using your bed for sleep. This is education, not treatment. About 5 to 8 minutes a day.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 245, hue2: 205, evidence: "Moderate", live: true,
    days: [
      {
        title: "Sleep starts in the morning",
        blocks: [
          { type: "read", title: "Set your clock with daylight", body: ["Your body clock decides when you feel sleepy, and morning light is the strongest signal it uses. Bright light soon after waking helps you feel alert in the day and may help you feel sleepy earlier at night.", "Bright light late in the evening does the opposite and can push sleepiness later. Try to wake at roughly the same time every day, weekends included: a steady wake time anchors everything else."], diagram: "light-clock" },
          { type: "action", title: "Tomorrow morning", body: "Within an hour of waking, spend 5 to 10 minutes outside or by a bright window. Outdoor light is far brighter than indoor light, even when it's cloudy. Pick a wake time you can keep all week." },
          { type: "quiz", question: "Which habit does the most to anchor your body clock?", options: ["Going to bed at the same time", "Waking at the same time and getting morning light", "Sleeping in on weekends"], answer: 1, explain: "A steady wake time plus morning light sets the clock. Bedtime is harder to control, and sleeping in shifts your clock later, a bit like jet lag." },
          { type: "breath", technique: "calm", minutes: 3 },
        ],
      },
      {
        title: "Your caffeine curfew",
        blocks: [
          { type: "read", title: "Caffeine lingers longer than you think", body: ["Caffeine blocks adenosine, the chemical that builds sleep pressure through the day. Its half-life is around five hours, so half of an afternoon coffee can still be in your system at bedtime.", "In one study, 400 mg of caffeine taken even six hours before bed cut total sleep by about an hour, often without people noticing. Many sleep experts suggest stopping caffeine about eight hours before bed."] },
          { type: "quiz", question: "If you go to bed at 10:30 pm, about when is a sensible caffeine cutoff?", options: ["Around 2 pm", "Around 6 pm", "Around 9 pm"], answer: 0, explain: "About eight hours before bed gives most of the caffeine time to clear. Some people are more sensitive and do better stopping earlier." },
          { type: "shop", title: "An evening swap", body: "Chamomile tea is caffeine-free and a warm, relaxing ritual. Studies of chamomile for sleep are small and mixed, so think of it as a wind-down cue, not a sleep aid. Check with your pharmacist if you take blood thinners.", items: ["chamomile"] },
          { type: "action", title: "Today", body: "Set a caffeine curfew about eight hours before your usual bedtime. Remember tea, cola, energy drinks and dark chocolate count too." },
          { type: "breath", technique: "calm", minutes: 3 },
        ],
      },
      {
        title: "Build a wind-down hour",
        blocks: [
          { type: "read", title: "Give your brain a runway", body: ["You can't go from busy to asleep in a minute. A consistent routine in the last hour before bed tells your body what's coming.", "Dim the lights, put screens away or turn them down, and do the same few relaxing things each night: a shower, a book, gentle stretching. Tonight, try the bedtime stretch."] },
          { type: "move", routine: "bedtime" },
          { type: "action", title: "Tonight", body: "Set an alarm for one hour before bed. When it goes off, dim the lights, plug your phone in outside the bedroom if you can, and start your wind-down." },
        ],
      },
      {
        title: "Slow breathing in bed",
        blocks: [
          { type: "read", title: "A longer exhale to settle", body: ["Slow breathing with a long exhale shifts your nervous system toward rest, which may help a busy mind settle. 4-7-8 breathing slows you to about three breaths a minute.", "If you're pregnant, or have a heart condition or epilepsy, the app gives you relaxed breathing instead, with no breath holds. Anyone who feels light-headed should shorten the hold or skip it."] },
          { type: "breath", technique: "478", minutes: 3 },
          { type: "quiz", question: "What should you do if 4-7-8 makes you light-headed?", options: ["Push through it", "Hold your breath longer", "Shorten the hold or switch to relaxed breathing"], answer: 2, explain: "There's no benefit to forcing it. A gentle 4-in, 6-out breath without a hold works well too." },
          { type: "action", title: "Tonight", body: "Lights off, lying comfortably: do four rounds, then let your breath return to normal." },
        ],
      },
      {
        title: "Cool, dark and quiet",
        blocks: [
          { type: "read", title: "Set up your bedroom for sleep", body: ["Your core temperature drops as you fall asleep, and a cool room helps. Many sleep experts suggest around 16 to 19 °C (60 to 67 °F), adjusted to what feels comfortable.", "Darkness matters too: even dim light at night can affect sleep. Blackout curtains or an eye mask, and earplugs or steady background sound, are cheap fixes."] },
          { type: "quiz", question: "Which bedroom is set up best for sleep?", options: ["Warm, with the TV on low", "Cool, dark and quiet", "Bright, so you wake easily"], answer: 1, explain: "Cool, dark and quiet is the classic recipe. Save brightness for the morning, when it helps set your clock." },
          { type: "action", title: "One change tonight", body: "Pick one: lower the thermostat or open a window, cover a glowing light, add an eye mask, or move the phone out of reach." },
          { type: "breath", technique: "coherent", minutes: 3 },
        ],
      },
      {
        title: "Park your worries",
        blocks: [
          { type: "read", title: "Get it out of your head and onto paper", body: ["Lying awake running through tomorrow's to-do list is common. In a small study, people who spent five minutes writing a specific to-do list before bed fell asleep faster than people who wrote about what they'd already done.", "Do it earlier in the evening, not in bed, so your bed doesn't become the place you plan and worry."] },
          { type: "reflect", prompt: "What's on your mind tonight? Write down each worry or task.", lines: 4 },
          { type: "reflect", prompt: "For one of them, what's the next small step, and when will you do it?", lines: 2 },
          { type: "ground" },
          { type: "breath", technique: "calm", minutes: 3 },
        ],
      },
      {
        title: "Your bed is for sleep",
        blocks: [
          { type: "read", title: "What sleep researchers teach", body: ["Cognitive behavioral therapy for insomnia (CBT-I) is the first-choice treatment for chronic insomnia in major guidelines, with strong evidence, ahead of sleeping pills. One of its parts is called stimulus control: retraining your brain to link bed with sleep.", "The basic ideas: go to bed only when sleepy, use the bed only for sleep and sex, and if you can't sleep after what feels like about 20 minutes, get up and do something relaxing in dim light until you feel sleepy again."] },
          { type: "read", title: "This is not CBT-I", body: ["This lesson explains one idea from CBT-I. It isn't therapy and can't replace a trained clinician or a structured CBT-I program, which adjusts the plan to you.", "If you've had trouble sleeping at least three nights a week for three months, or you snore loudly, gasp at night or feel very sleepy in the day, talk to a doctor. Those can be signs of insomnia or sleep apnea, and both are treatable."] },
          { type: "quiz", question: "If you've been lying awake for a long time, what does stimulus control suggest?", options: ["Stay in bed and try harder", "Get up, do something relaxing in dim light, and return when sleepy", "Check your phone until you're tired"], answer: 1, explain: "Getting up breaks the link between bed and frustration. Keep the light dim and the activity boring, then go back when you feel sleepy." },
          { type: "reflect", prompt: "Which two sleep habits from this week will you keep?", lines: 2 },
          { type: "breath", technique: "calm", minutes: 3 },
        ],
      },
    ],
  },
  {
    id: "move-10", section: "move", title: "10 Days of Yoga & Stretch", tagline: "Gentle mobility basics, about 10 minutes a day",
    about: "Ten short sessions to loosen up and build an easy daily habit: morning stretches, gentle yoga, a desk reset, tai chi, qigong and a bedtime stretch. Nothing strenuous. If you've told us you have limited mobility, every routine switches to a seated version. About 7 to 10 minutes a day.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 280, hue2: 330, evidence: "Moderate", live: true,
    days: [
      {
        title: "Start where you are",
        blocks: [
          { type: "read", title: "Gentle is the goal", body: ["Stretching and gentle yoga may help with stiffness, flexibility and stress. You don't need to be flexible to start: that's what practice is for.", "Move slowly, breathe through every position, and stop anything that causes sharp or worsening pain. Mild stretch is good; pain is a signal to ease off. If you have limited mobility, the app gives you a seated routine instead."] },
          { type: "move", routine: "wake" },
          { type: "breath", technique: "calm", minutes: 2 },
          { type: "reflect", prompt: "Where in your body do you feel stiff or tight most days?", lines: 1 },
        ],
      },
      {
        title: "Your first yoga flow",
        blocks: [
          { type: "read", title: "Breath first, shapes second", body: ["Yoga links movement with breath. Let each move follow an inhale or an exhale rather than rushing to the next pose.", "Trials suggest yoga can ease chronic low back pain about as well as other exercise. Take the easier option on any move whenever you like."] },
          { type: "move", routine: "yoga" },
          { type: "action", title: "Notice", body: "Later today, check in: is anything looser than yesterday? Small changes count." },
        ],
      },
      {
        title: "Undo the desk",
        blocks: [
          { type: "read", title: "Sitting still is the problem, not sitting", body: ["Long stretches without moving can leave your neck, shoulders and hips stiff. Short breaks to stand and stretch, every 30 to 60 minutes, are an easy habit with real payoff.", "Today's desk reset takes about three minutes and works sitting or standing."] },
          { type: "move", routine: "desk" },
          { type: "breath", technique: "sigh", minutes: 2 },
          { type: "action", title: "Set a nudge", body: "Set a gentle reminder to stand and stretch once every hour of desk time today." },
        ],
      },
      {
        title: "Stretch to wind down",
        blocks: [
          { type: "read", title: "Evening is for slow", body: ["Slow stretching in the evening, paired with a long exhale, may help you shift out of a busy day. Hold each stretch, don't bounce, and keep it comfortable.", "Try this one in the hour before bed."] },
          { type: "move", routine: "bedtime" },
          { type: "breath", technique: "calm", minutes: 2 },
        ],
      },
      {
        title: "Balance with tai chi",
        blocks: [
          { type: "read", title: "Slow weight shifts", body: ["Tai chi is slow, flowing movement. A Cochrane review found it reduced falls in older adults by about a fifth, and it's gentle on joints.", "Keep your knees soft and shift your weight slowly. Stand near a wall or chair for support if you like."] },
          { type: "move", routine: "taichi" },
          { type: "quiz", question: "What should a good stretch feel like?", options: ["Sharp pain that you push through", "A mild, comfortable pull", "Nothing at all"], answer: 1, explain: "A gentle pull is what you're after. Sharp, pinching or worsening pain means ease off or skip that move." },
        ],
      },
      {
        title: "Qigong: the Eight Brocades",
        blocks: [
          { type: "read", title: "Flowing, steady, relaxed", body: ["The Eight Brocades is a centuries-old qigong set of slow movements matched to the breath.", "Small studies suggest qigong may help balance, flexibility and stress, though the research is still limited."] },
          { type: "move", routine: "brocades" },
          { type: "reflect", prompt: "Which style has felt best so far: yoga, stretching, tai chi or qigong?", lines: 1 },
        ],
      },
      {
        title: "Go a little deeper",
        blocks: [
          { type: "read", title: "Same flow, more ease", body: ["Repeat the yoga flow from day two. This time, stay in each position for one or two extra slow breaths.", "Flexibility improves gradually with regular practice, not by forcing it on any single day."] },
          { type: "move", routine: "yoga" },
          { type: "breath", technique: "coherent", minutes: 3 },
        ],
      },
      {
        title: "Walk it out",
        blocks: [
          { type: "read", title: "Walking is mobility too", body: ["An easy walk moves your hips, ankles and spine, and a short walk after eating may also help steady blood sugar.", "Keep the pace easy enough that you could chat."] },
          { type: "move", routine: "walk", minutes: 5 },
          { type: "quiz", question: "How often do you need to stretch to see changes?", options: ["Once a month, very hard", "A little, most days", "Only when you're sore"], answer: 1, explain: "Regular, gentle practice works better than occasional big sessions. A few minutes most days adds up." },
          { type: "action", title: "Stretch after", body: "When you get back, do two of your favorite stretches from this week." },
        ],
      },
      {
        title: "Mix and match",
        blocks: [
          { type: "read", title: "Build a short sequence", body: ["You now have several routines. Try tai chi today, then think about which ones fit your mornings, workdays and evenings."] },
          { type: "move", routine: "taichi" },
          { type: "breath", technique: "calm", minutes: 2 },
          { type: "action", title: "Plan it", body: "Pick one routine for mornings and one for evenings. Each takes 3 to 10 minutes." },
        ],
      },
      {
        title: "Your routine from here",
        blocks: [
          { type: "read", title: "Ten days done", body: ["Finish with the full yoga flow and notice how it compares with day two.", "The best routine is the one you'll keep doing. All of these stay on the Move page whenever you want them."] },
          { type: "move", routine: "yoga" },
          { type: "reflect", prompt: "What's your plan: which routine, which days, and what time?", lines: 2 },
          { type: "quiz", question: "If a move hurts your knee, what should you do?", options: ["Push harder so it adapts", "Use an easier option or skip it", "Hold your breath and keep going"], answer: 1, explain: "Pain is a cue to modify. Every routine has easier options, and if pain keeps coming back, check with a doctor or physical therapist." },
        ],
      },
    ],
  },
  {
    id: "gratitude-5", section: "spirit", title: "5 Days of Gratitude", tagline: "Notice the good and reach out to the people who matter",
    about: "Five short practices from positive psychology: three good things, savoring, a thank-you to someone in your life, a loving-kindness meditation, and a plan to keep it going. The research suggests modest benefits for mood. About 5 to 7 minutes a day.",
    author: { name: "Rooted Team", role: "Written from published research", verified: true }, hue: 35, hue2: 330, evidence: "Mixed", live: true,
    days: [
      {
        title: "Three good things",
        blocks: [
          { type: "read", title: "Train your attention toward what went well", body: ["Our brains are quick to notice problems and slow to notice good moments. In a randomized online study, people who wrote down three things that went well each night for a week reported being happier for months afterward.", "Later reviews find gratitude practices may help mood, though the effects are modest. It takes a few minutes, so it's worth a try."] },
          { type: "reflect", prompt: "Write three things that went well today, big or small.", lines: 3 },
          { type: "reflect", prompt: "For one of them, why did it go well?", lines: 1 },
          { type: "breath", technique: "calm", minutes: 3 },
          { type: "quiz", question: "In the 'three good things' exercise, what else do you write?", options: ["Why each thing went well", "Three things that went badly", "Nothing else"], answer: 0, explain: "Noting why it happened helps you notice your part in it and the people around you, which seems to be part of why it helps." },
        ],
      },
      {
        title: "Savor a moment",
        blocks: [
          { type: "read", title: "Slow down the good parts", body: ["Savoring means lingering on a pleasant moment instead of rushing past it: your morning coffee, sunlight, a song.", "Grounding through your senses is a simple way to practice. Try it now, then notice one moment today to savor."] },
          { type: "ground" },
          { type: "reflect", prompt: "What's one small thing you'd like to savor today?", lines: 1 },
          { type: "breath", technique: "coherent", minutes: 2 },
        ],
      },
      {
        title: "Say thank you",
        blocks: [
          { type: "read", title: "Gratitude grows when it's shared", body: ["In the same research, writing and delivering a thank-you letter to someone who'd never been properly thanked gave one of the biggest short-term boosts in mood.", "People also tend to underestimate how much their thanks will mean to the person receiving it."] },
          { type: "reflect", prompt: "Who has helped you that you've never fully thanked? What would you say to them?", lines: 4 },
          { type: "action", title: "Reach out", body: "Send that person a message, call, or letter today. A few honest sentences are enough. If they're no longer in your life, writing it down still counts." },
          { type: "breath", technique: "calm", minutes: 3 },
        ],
      },
      {
        title: "Loving-kindness",
        blocks: [
          { type: "read", title: "Wishing others well", body: ["Loving-kindness is a meditation from Buddhist tradition. You silently repeat kind wishes, first for yourself, then for someone you love, someone neutral, and eventually everyone.", "Small studies suggest it may increase feelings of warmth and connection."] },
          { type: "read", title: "Try it with your breath", body: ["As you breathe slowly, repeat on each exhale: 'May you be well. May you be happy. May you be at ease.'", "Start with someone easy to love. If your mind wanders, gently come back to the words."] },
          { type: "breath", technique: "calm", minutes: 3 },
          { type: "action", title: "Optional: a sound bath", body: "If you'd like to go longer, try a singing bowl session from Spirit & Ritual. Evidence is limited, but lying down to rest and listen may feel relaxing." },
          { type: "reflect", prompt: "How did it feel to wish someone well?", lines: 1 },
        ],
      },
      {
        title: "Keep it going",
        blocks: [
          { type: "read", title: "Make it a small ritual", body: ["Gratitude works best as a light, regular habit, not a chore. Some people find once or a few times a week feels fresher than every night.", "Tie it to something you already do: dinner, brushing your teeth, or your evening wind-down."] },
          { type: "reflect", prompt: "When and where will you practice gratitude from now on?", lines: 1 },
          { type: "action", title: "Connection", body: "Plan one small moment of connection this week: a walk with a friend, a call to family, or a meal with someone." },
          { type: "breath", technique: "sigh", minutes: 2 },
          { type: "ground" },
          { type: "quiz", question: "What does the research say about gratitude practices?", options: ["They cure depression", "They may modestly improve mood", "They have no effect at all"], answer: 1, explain: "Effects are real but modest. Gratitude can be a pleasant boost, not a replacement for support or treatment when you're struggling." },
        ],
      },
    ],
  },
];

export const programById = (id: string) => PROGRAMS.find((p) => p.id === id);

/** Swap techniques that aren't advised for someone's profile. */
export function safeTechnique(id: string, f: ReturnType<typeof flags>): string {
  if (id === "power" && f.noPowerBreathing) return "calm";
  if ((id === "478" || id === "box") && f.breathHoldCare) return "calm";
  return id;
}

/** Move routines that need a seated alternative for limited mobility. */
export function safeRoutine(id: string, f: ReturnType<typeof flags>): string {
  return f.seated && id !== "desk" ? "desk" : id;
}

export const dayMinutes = (d: ProgramDay) =>
  Math.max(2, Math.round(d.blocks.reduce((a, b) => a + (b.type === "breath" ? b.minutes : b.type === "ground" ? 2 : b.type === "move" ? 6 : b.type === "read" ? 1 : 0.5), 0)));
