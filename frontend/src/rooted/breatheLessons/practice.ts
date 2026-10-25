import type { GlossaryTerm, Lesson, Myth } from "./types";
import type { Source } from "../pantryContent";

/* Sources. Every one was opened (abstract or page) or verified against Crossref. */
const doi = (text: string, id: string): Source => ({ text, url: `https://doi.org/${id}` });

const KOX = doi("Kox M et al. Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans. PNAS, 2014", "10.1073/pnas.1322174111");
const WHM_REVIEW = doi("Does the Wim Hof Method have a beneficial impact on physiological and psychological outcomes in healthy and non-healthy participants? A systematic review. PLoS ONE, 2024", "10.1371/journal.pone.0286933");
const WHM_RCT = doi("A randomized controlled clinical trial of a Wim Hof Method intervention in women with high depressive symptoms. Comprehensive Psychoneuroendocrinology, 2024", "10.1016/j.cpnec.2024.100272");
const COOPER = doi("Cooper S et al. Effect of two breathing exercises (Buteyko and pranayama) in asthma: a randomised controlled trial. Thorax, 2003", "10.1136/thorax.58.8.674");
const COCHRANE_ASTHMA = doi("Santino TA et al. Breathing exercises for adults with asthma. Cochrane Database of Systematic Reviews, 2020", "10.1002/14651858.CD001277.pub4");
const BUTEYKO_MA = doi("The effect of the Buteyko breathing technique on asthma control and quality of life: a systematic review and meta-analysis of randomized controlled trials. Explore, 2026", "10.1016/j.explore.2026.103414");
const ZACCARO = doi("Zaccaro A et al. How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 2018", "10.3389/fnhum.2018.00353");
const LABORDE = doi("Laborde S et al. Effects of voluntary slow breathing on heart rate and heart rate variability: a systematic review and a meta-analysis. Neuroscience & Biobehavioral Reviews, 2022", "10.1016/j.neubiorev.2022.104711");
const RUSSO = doi("Russo MA et al. The physiological effects of slow breathing in the healthy human. Breathe (European Respiratory Society), 2017", "10.1183/20734735.009817");
const LEHRER = doi("Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta-analysis. Appl Psychophysiol Biofeedback, 2020", "10.1007/s10484-020-09466-z");
const EQUAL55 = doi("Breathing at a rate of 5.5 breaths per minute with equal inhalation-to-exhalation ratio increases heart rate variability. Int J Psychophysiology, 2014", "10.1016/j.ijpsycho.2013.12.006");
const EI_2021 = doi("Increased exhalation to inhalation ratio during breathing enhances high-frequency heart rate variability in healthy adults. Psychophysiology, 2021", "10.1111/psyp.13905");
const EI_2014 = doi("Inhalation/exhalation ratio modulates the effect of slow breathing on heart rate variability and relaxation. Appl Psychophysiol Biofeedback, 2014", "10.1007/s10484-014-9253-x");
const PROLEX = doi("The effectiveness of combat tactical breathing as compared with prolonged exhalation. Appl Psychophysiol Biofeedback, 2021", "10.1007/s10484-020-09485-w");
const VIERRA = doi("Vierra J et al. Effects of sleep deprivation and 4-7-8 breathing control on heart rate variability, blood pressure, blood glucose, and endothelial function in healthy young adults. Physiological Reports, 2022", "10.14814/phy2.15389");
const EIDE = doi("Slow breathing techniques before bedtime and the effects on sleep: a systematic review. Sleep Medicine Reviews, 2026", "10.1016/j.smrv.2026.102284");
const MEURET08 = doi("Meuret AE et al. Feedback of end-tidal pCO2 as a therapeutic approach for panic disorder. Journal of Psychiatric Research, 2008", "10.1016/j.jpsychires.2007.06.005");
const MEURET17 = doi("A multisite benchmarking trial of capnometry guided respiratory intervention for panic disorder in naturalistic treatment settings. Appl Psychophysiol Biofeedback, 2017", "10.1007/s10484-017-9354-4");
const KLEIN = doi("Klein DF. False suffocation alarms, spontaneous panics, and related conditions: an integrative hypothesis. Archives of General Psychiatry, 1993", "10.1001/archpsyc.1993.01820160076009");
const LEY = doi("Ley R. The efficacy of breathing retraining and the centrality of hyperventilation in panic disorder: a reinterpretation. Behaviour Research and Therapy, 1991", "10.1016/0005-7967(91)90121-i");
const NHS_PANIC: Source = { text: "NHS: Panic disorder", url: "https://www.nhs.uk/conditions/panic-disorder/" };
const NCCIH_RELAX: Source = { text: "NCCIH (NIH): Relaxation techniques, what you need to know", url: "https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know" };
const NCCIH_DETOX: Source = { text: "NCCIH (NIH): Detoxes and cleanses, what you need to know", url: "https://www.nccih.nih.gov/health/detoxes-and-cleanses-what-you-need-to-know" };
const MEDLINE_OX: Source = { text: "MedlinePlus (NIH): Pulse oximetry", url: "https://medlineplus.gov/lab-tests/pulse-oximetry/" };
const COCHRANE_HVS = doi("Jones M et al. Breathing exercises for dysfunctional breathing/hyperventilation syndrome in adults. Cochrane Database of Systematic Reviews, 2013", "10.1002/14651858.CD009041.pub2");
const LAFFEY = doi("Laffey JG, Kavanagh BP. Hypocapnia. New England Journal of Medicine, 2002", "10.1056/NEJMra012457");
const DEBRECZENI = doi("Hypocapnia induced by involuntary hyperventilation during mental arithmetic reduces cerebral blood flow velocity. Tohoku J Exp Med, 2009", "10.1620/tjem.217.147");
const RLSS: Source = { text: "Royal Life Saving Society UK: Shallow water blackout, hyperventilation and breath holding (guidance statement GS005, 2020)", url: "https://www.rlss.org.uk/shallow-water-blackout-hyperventilation-and-breath-holding-gs005" };
const FREEDIVE = doi("Case studies in physiology: is blackout in breath-hold diving related to cardiac arrhythmias? Journal of Applied Physiology, 2023", "10.1152/japplphysiol.00708.2022");
const DALLAM = doi("Dallam G, Kies B. The effect of nasal breathing versus oral and oronasal breathing during exercise: a review. Journal of Sports Research, 2020", "10.18488/journal.90.2020.71.1.10");
const NHS_PREG_EX: Source = { text: "NHS: Exercise in pregnancy", url: "https://www.nhs.uk/pregnancy/keeping-well/exercise/" };
const NHS_PREECLAMPSIA: Source = { text: "NHS: Pre-eclampsia", url: "https://www.nhs.uk/conditions/pre-eclampsia/" };
const NHS_ASTHMA: Source = { text: "NHS: Asthma", url: "https://www.nhs.uk/conditions/asthma/living-with/" };
const SINGING = doi("Lewis A et al. Singing for Lung Health: a systematic review of the literature and consensus statement. npj Primary Care Respiratory Medicine, 2016", "10.1038/npjpcrm.2016.80");
const LIFT_BP = doi("Linsenbardt ST, Thomas TR, Madsen RW. Effect of breathing techniques on blood pressure response to resistance exercise. British Journal of Sports Medicine, 1992", "10.1136/bjsm.26.2.97");
const ISO_HTN = doi("Isometric exercise training and arterial hypertension: an updated review. Sports Medicine, 2024", "10.1007/s40279-024-02036-x");
const BP_META = doi("Effect of breathing exercises on blood pressure and heart rate: a systematic review and meta-analysis. IJC Cardiovascular Risk and Prevention, 2024", "10.1016/j.ijcrp.2023.200232");

export const PRACTICE_LESSONS: Lesson[] = [
  /* 1 ------------------------------------------------------------------ */
  {
    id: "fast-breathing-tingling",
    title: "Why fast breathing makes you tingle and dizzy",
    tagline: "Understand how breathing too much lowers carbon dioxide, and why that feels so strange.",
    minutes: 4, hue: 190, level: "Start here", evidence: "Moderate",
    blocks: [
      { type: "h", text: "It is a carbon dioxide story" },
      { type: "p", text: "Carbon dioxide (CO2) is the gas your cells make as waste. Each out-breath carries it away. If you breathe faster or deeper than your body needs, you blow off CO2 faster than you make it, and the level in your blood drops. Doctors call this hypocapnia." },
      { type: "p", text: "Oxygen is not the problem. A normal blood oxygen reading is 95 to 100 percent, so fast breathing has very little extra oxygen to add." },
      { type: "callout", tone: "key", text: "When you over-breathe, the shortage is CO2, not oxygen. That is why you can feel breathless while breathing a lot." },
      { type: "h", text: "What low CO2 does" },
      { type: "p", text: "Less CO2 makes the blood slightly more alkaline, which changes how nerves and muscles fire. It also narrows the small blood vessels in the brain." },
      { type: "p", text: "In one lab study, volunteers who deliberately over-breathed had a measurable drop in the speed of blood flow through a major brain artery. The same thing happened in people who breathed too fast without noticing while doing mental arithmetic." },
      { type: "h", text: "What it can feel like" },
      { type: "list", items: [
        "Tingling or pins and needles in the fingers, toes or around the mouth",
        "Light-headedness or dizziness",
        "Chest tightness and a sense you cannot get a full breath",
        "A floaty, unreal or detached feeling",
      ] },
      { type: "p", text: "These sensations are also listed by the NHS among the symptoms of a panic attack, which is one reason the two get tangled together. They are unpleasant, but in healthy people they usually fade once breathing returns to its usual pace." },
      { type: "callout", tone: "care", text: "Tingling, dizziness and breathlessness can also come from heart, lung and other medical problems. A first episode, chest pain, fainting, or anything that does not settle needs a clinician, not a breathing exercise." },
      { type: "h", text: "How to use this" },
      { type: "p", text: "If any pattern in this app makes you feel tingly or woozy, you are probably breathing bigger than you need to. Ease off, let the breath go back to ordinary, and sit or lie down. Never practise standing, driving, or near water." },
      { type: "callout", tone: "care", text: "How well breathing exercises help people who over-breathe is not settled. A Cochrane review of breathing exercises for hyperventilation syndrome in adults found only one small, poorly reported trial, so it could not say whether they work." },
      { type: "fact", stat: "1", label: "small, poorly reported trial met the bar for the Cochrane review of breathing exercises for hyperventilation syndrome in adults" },
      { type: "callout", tone: "try", text: "Try an even, quiet pace with no holds and small breaths. If it feels easy, you are in the right zone." },
    ],
    tryIt: { label: "Gentle even pace", technique: "equal" },
    sources: [MEDLINE_OX, DEBRECZENI, LAFFEY, NHS_PANIC, COCHRANE_HVS],
  },

  /* 2 ------------------------------------------------------------------ */
  {
    id: "panic-co2-breathing",
    title: "Panic, CO2 and the false alarm idea",
    tagline: "See what researchers think links breathing and panic, and what a clinician-led capnometry programme has shown.",
    minutes: 6, hue: 215, level: "Go deeper", evidence: "Mixed",
    blocks: [
      { type: "h", text: "What a panic attack is" },
      { type: "p", text: "A panic attack is a sudden surge of fear with strong body symptoms: racing heart, sweating, trembling, shortness of breath, dizziness, pins and needles. The NHS says most last between 5 and 20 minutes. Panic disorder means having them repeatedly, often with fear of the next one." },
      { type: "p", text: "The NHS names talking therapies based on CBT and medicine as the main care, and lists breathing exercises among things that may help with symptoms." },
      { type: "h", text: "Two ideas about breathing and panic" },
      { type: "p", text: "The first is the CO2 idea. Some people with panic disorder seem to breathe in a way that keeps CO2 on the low side. In a later study of a capnometry programme, end-tidal CO2 moved from a slightly low range to a normal range as people improved." },
      { type: "p", text: "The second is the false suffocation alarm idea, proposed by psychiatrist Donald Klein in 1993. It suggests the brain has a built-in suffocation monitor that is over-sensitive in some people, so a small rise in CO2 can set off sudden air hunger and panic." },
      { type: "callout", tone: "care", text: "Both are hypotheses. Other researchers have questioned how central over-breathing really is in panic disorder, and the debate has not been settled." },
      { type: "h", text: "What CART is" },
      { type: "p", text: "Capnometry-assisted respiratory training was developed by Alicia Meuret and colleagues. A clinician teaches a person to slow their breathing while a small device reads end-tidal CO2 (the CO2 at the end of each out-breath) and breathing rate. The person then practises at home with the device." },
      { type: "h", text: "What the evidence shows" },
      { type: "list", items: [
        "2008 randomised trial: 37 people with panic disorder, brief capnometry-assisted training versus a delayed-start control. Panic severity, avoidance and disability improved in the trained group and gains held at 12 months. The authors called the evidence preliminary.",
        "2017 study: 69 adults in four ordinary clinics got four weeks of a capnometry programme. 83 percent responded and 54 percent were in remission, with no control group.",
      ] },
      { type: "p", text: "That is promising, but small. The control in the first trial was a waiting list, not an alternative active approach, and most of the work comes from the group that developed the method." },
      { type: "callout", tone: "key", text: "CART is a structured programme led by a clinician for a diagnosed condition. It is not the same as doing slow breathing on your own, and this lesson is not a way to self-manage panic disorder." },
      { type: "fact", stat: "37", label: "people were randomised in the 2008 trial of capnometry-assisted breathing training for panic disorder" },
      { type: "callout", tone: "care", text: "Relaxation and breathing practices can occasionally bring on more anxiety or a fear of losing control, according to the US National Center for Complementary and Integrative Health. If a practice makes you more frightened, stop and tell a clinician." },
      { type: "callout", tone: "try", text: "If you want to explore gentle breathing, choose a slow, unforced pattern with no holds, and talk with your GP or therapist about panic that keeps returning." },
    ],
    tryIt: { label: "Slow, even, no holds", technique: "equal" },
    sources: [NHS_PANIC, MEURET08, MEURET17, KLEIN, LEY, NCCIH_RELAX],
  },

  /* 3 ------------------------------------------------------------------ */
  {
    id: "breath-holds-urge",
    title: "Breath holds, the urge to breathe and blackout",
    tagline: "Learn why the urge to breathe can fail as a warning, and how to read a BOLT-style test sensibly.",
    minutes: 6, hue: 250, level: "Go deeper", evidence: "Moderate",
    blocks: [
      { type: "h", text: "What happens in a hold" },
      { type: "p", text: "While you hold your breath, oxygen slowly falls and CO2 builds up. In healthy people it is mainly the rising CO2, not the falling oxygen, that produces the strong urge to breathe. That urge is your built-in alarm." },
      { type: "p", text: "Early on the urge is a comfortable nudge. Later it becomes harder to ignore. Its strength depends on how much CO2 has built up, which is exactly what fast breathing beforehand lowers." },
      { type: "h", text: "When the alarm fails" },
      { type: "p", text: "If someone breathes fast before a hold, their CO2 starts low. The alarm switches on late, and oxygen can fall below what the brain needs before they feel any urge. They can lose consciousness with little or no warning." },
      { type: "p", text: "The Royal Life Saving Society UK defines shallow water blackout as loss of consciousness caused by low oxygen to the brain following hyperventilation and breath-holding. It says swimmers may get no warning symptoms, that hard exercise can cause unintentional over-breathing, and that blackout can happen at any depth. Without rapid rescue and first aid, a drowning will occur." },
      { type: "callout", tone: "care", text: "Never do breath holds, or fast breathing before holds, in or near water, in a bath, while driving, or standing up. Trained freedivers can black out too: in one pool case study, a diver lost consciousness 12 seconds past his personal best and was pulled up by safety divers." },
      { type: "fact", stat: "25 m", label: "RLSS UK says lifeguards should step in when swimmers go further than 25 metres underwater, because of blackout risk" },
      { type: "h", text: "Reading a BOLT-style test" },
      { type: "p", text: "A BOLT-style test times a comfortable hold after a normal out-breath, stopping at the first clear desire to breathe. It is a snapshot of how your body is responding to rising CO2 right now." },
      { type: "list", items: [
        "It changes with mood, a blocked nose, caffeine, tiredness and how you breathed just before.",
        "We did not find good evidence that the number predicts lung health or disease, and we know of no verified cut-offs.",
        "The only sensible use is comparing with your own earlier readings under the same conditions.",
      ] },
      { type: "callout", tone: "key", text: "Stop at the first definite urge. A longer hold is not a better score if you had to strain to get it." },
      { type: "callout", tone: "care", text: "Do not use a hold time to diagnose anything. If you have lung, heart or blood pressure conditions, or you are pregnant, ask your clinician before you practise holds." },
    ],
    tryIt: { label: "Open the BOLT test", to: "#bolt" },
    sources: [RLSS, FREEDIVE, RUSSO, LAFFEY],
  },

  /* 4 ------------------------------------------------------------------ */
  {
    id: "fast-cycles-wim-hof",
    title: "Fast-breathing cycles: what the studies found",
    tagline: "Read the Kox 2014 study, the later reviews, and the risks of Wim Hof-style cycles with fresh eyes.",
    minutes: 8, hue: 20, level: "Expert", evidence: "Mixed",
    blocks: [
      { type: "h", text: "What the style is" },
      { type: "p", text: "Wim Hof-style breathing usually means rounds of about 30 deep, quick breaths, then a hold after breathing out, then a deep breath in and a short hold. The method is also sold with cold exposure and mindset training." },
      { type: "h", text: "The 2014 PNAS study" },
      { type: "p", text: "Dutch researchers led by Matthijs Kox randomised 24 healthy volunteers to two groups of 12. One group trained for 10 days in meditation, cycles of hyperventilation followed by breath retention, and cold exposure. The other group had no training. Everyone then received a small dose of bacterial endotoxin (2 ng per kilogram), which causes a short flu-like reaction." },
      { type: "list", items: [
        "During the breathing, the trained group had intermittent respiratory alkalosis (low CO2) and low oxygen, with a big rise in adrenaline.",
        "After endotoxin they made more of the anti-inflammatory signal IL-10, and less TNF-alpha, IL-6 and IL-8.",
        "They also reported fewer flu-like symptoms.",
      ] },
      { type: "fact", stat: "12 vs 12", label: "volunteers per group in the Kox 2014 study: trained versus untrained" },
      { type: "h", text: "What it cannot tell us" },
      { type: "list", items: [
        "The training bundled breathing, cold and meditation, so the study cannot say which part mattered.",
        "The comparison group did no practice, so there was no matched placebo activity.",
        "Twelve people per group is small, and the endotoxin test is a short laboratory model, not a real illness.",
        "It does not show that anyone gets sick less often.",
      ] },
      { type: "h", text: "Later work" },
      { type: "p", text: "A 2024 systematic review found nine papers from eight trials. It judged the inflammation findings promising, but results for exercise performance and breathing measures were mixed." },
      { type: "p", text: "A 2024 randomised trial in 84 women with high stress and depressive symptoms compared a Wim Hof programme with slow-paced breathing and warm showers. Both groups improved by similar amounts, and every dropout was from the Wim Hof group. Rumination after stressful days fell more with Wim Hof, a result the authors say needs replication." },
      { type: "callout", tone: "key", text: "There is a real physiological effect, since the cycles change blood gases and adrenaline. There is not yet strong proof of lasting health benefits." },
      { type: "h", text: "The risks" },
      { type: "p", text: "Deep over-breathing drops CO2 and can leave you tingling, light-headed, or faint, and a hold on top of that raises the stakes. The RLSS says hyperventilation should not be allowed before breath-holding, because blackout can come without warning." },
      { type: "callout", tone: "care", text: "Only ever practise seated or lying on a firm surface, never in or near water, a bath, or a vehicle. Reports of deaths in water exist, but they come largely from news coverage, and we found no study telling us how common they are. Skip it if you are pregnant or have heart, blood pressure, seizure or lung conditions, unless a clinician has said it is fine." },
    ],
    tryIt: { label: "Power breathing, with safety check", technique: "power" },
    sources: [KOX, WHM_REVIEW, WHM_RCT, RLSS, NCCIH_RELAX],
  },

  /* 5 ------------------------------------------------------------------ */
  {
    id: "buteyko-reduced-breathing",
    title: "Buteyko and reduced breathing in asthma",
    tagline: "See what the Cooper trial and the Cochrane review actually concluded, and where the limits are.",
    minutes: 6, hue: 150, level: "Go deeper", evidence: "Mixed",
    blocks: [
      { type: "h", text: "The idea" },
      { type: "p", text: "The Buteyko approach teaches gentle nose breathing, smaller breaths and short pauses. The thinking is that people with asthma tend to over-breathe, so retraining the pattern might ease symptoms. The key question is whether the trials back that up." },
      { type: "h", text: "The Cooper 2003 trial" },
      { type: "p", text: "In this Thorax study, 90 adults with asthma on inhaled steroids were randomly assigned to Buteyko breathing, a device that mimics yoga breathing, or a dummy device. They practised twice a day for six months, and 78 percent finished." },
      { type: "list", items: [
        "Symptom scores fell in the Buteyko group. The median change was -3, against -1 for the device and 0 for the dummy.",
        "Buteyko users needed about two fewer puffs of reliever a day.",
        "Lung function, airway sensitivity, flare-ups and the ability to cut steroid doses did not differ between groups.",
      ] },
      { type: "fact", stat: "2 puffs", label: "fewer reliever puffs per day at six months in the Buteyko group of the Cooper 2003 trial" },
      { type: "callout", tone: "key", text: "Buteyko changed how people felt and how much reliever they used. It did not change measured lung function." },
      { type: "h", text: "What Cochrane concluded" },
      { type: "p", text: "The 2020 Cochrane review of breathing exercises for adults with asthma pooled 22 studies with 2,880 people. Most were yoga studies. Only one tested Buteyko alone and one tested Buteyko with yoga breathing." },
      { type: "p", text: "Quality of life improved slightly at three months (0.42 points on a 7-point scale, moderate-certainty evidence). Asthma symptom scores were inconclusive. The authors wrote that breathing exercises may have some positive effects on quality of life, hyperventilation symptoms and lung function, but certainty ranged from moderate to very low." },
      { type: "p", text: "A 2026 meta-analysis of seven Buteyko trials found a small gain in asthma control and no overall quality-of-life benefit, and its authors also called the evidence limited." },
      { type: "callout", tone: "care", text: "Breathing exercises are an add-on, not a replacement. Never stop or lower a preventer inhaler on your own. If symptoms are getting worse or you need your reliever more often, see your GP, and follow your asthma action plan in an attack." },
      { type: "callout", tone: "try", text: "If you have asthma and are curious, take the idea to your asthma nurse or doctor first. Easy nose breathing at a gentle pace is a reasonable thing to ask about." },
    ],
    tryIt: { label: "Gentle belly breathing", technique: "belly" },
    sources: [COOPER, COCHRANE_ASTHMA, BUTEYKO_MA, NHS_ASTHMA],
  },

  /* 6 ------------------------------------------------------------------ */
  {
    id: "how-many-breaths",
    title: "How many breaths a minute is best?",
    tagline: "Learn what slow-breathing reviews show, and why six a minute became the popular number.",
    minutes: 5, hue: 170, level: "Start here", evidence: "Moderate",
    blocks: [
      { type: "h", text: "What we breathe at" },
      { type: "p", text: "Studies of slow breathing usually mean fewer than 10 breaths a minute, which is slower than most people breathe without thinking about it." },
      { type: "h", text: "What the reviews found" },
      { type: "p", text: "The 2018 Zaccaro review searched more than 2,400 abstracts and kept 15 studies of slow breathing in healthy people. Slow breathing was linked with higher heart rate variability, more alpha and less theta brain activity, and people reporting more comfort and less anxiety and anger." },
      { type: "p", text: "The 2022 Laborde meta-analysis pooled 223 studies. Heart rate variability that reflects the vagus nerve rose during slow breathing, right after one session, and after weeks of practice. The authors said few adverse effects would be expected." },
      { type: "fact", stat: "223", label: "studies in the 2022 Laborde meta-analysis of slow breathing and heart rate variability" },
      { type: "h", text: "Why six a minute?" },
      { type: "p", text: "Heart rate and blood pressure naturally rise and fall in a slow rhythm. Heart rate variability biofeedback researchers propose that breathing at about six breaths a minute lines up with that rhythm and boosts the swings. That is the resonance idea, and it is why 6 became a standard in studies." },
      { type: "p", text: "A study of 5.5 breaths a minute with equal in and out times also raised heart rate variability, so six is a landmark, not a magic number." },
      { type: "callout", tone: "key", text: "Slowing down seems to help many people. The best exact rate varies from person to person, and no study shows that six beats five or seven." },
      { type: "h", text: "Limits worth knowing" },
      { type: "list", items: [
        "Heart rate variability is a marker, not a health result in itself.",
        "Most studies were short and in healthy people. Zaccaro's review could include only 15.",
        "Feeling steadier is a real outcome, but it is not proof of long-term benefit.",
      ] },
      { type: "callout", tone: "try", text: "Find a pace where the breath feels smooth, with no strain and no air hunger. If it feels hard, go a little faster. Comfort matters more than the count." },
    ],
    tryIt: { label: "Find your pace", to: "#pace" },
    sources: [ZACCARO, LABORDE, RUSSO, LEHRER, EQUAL55],
  },

  /* 7 ------------------------------------------------------------------ */
  {
    id: "exhale-length",
    title: "Does a longer exhale help?",
    tagline: "Separate what small experiments show from the popular claim that a long exhale settles you.",
    minutes: 5, hue: 205, level: "Go deeper", evidence: "Weak",
    blocks: [
      { type: "h", text: "The popular claim" },
      { type: "p", text: "You will often hear that a longer out-breath switches on the body's rest mode. There is some support for part of that, mostly in short lab studies with healthy volunteers." },
      { type: "h", text: "What has been measured" },
      { type: "list", items: [
        "28 adults (16 young, 12 older) paced their own natural rate with exhale twice as long as inhale, or equal. Heart rate variability that tracks vagal activity was higher with the longer exhale, and stayed raised for about four minutes afterwards.",
        "30 people breathed at 6 or 12 breaths a minute with a short or long exhale. A long exhale went with more reported relaxation and stress reduction. Heart rate variability rose with the long exhale only at the slow rate.",
        "30 people did a stress task and then either military-style tactical breathing or prolonged exhalation. Feelings did not differ. Tactical breathing lowered body arousal more, while prolonged exhalation gave better task performance.",
      ] },
      { type: "fact", stat: "4 min", label: "how long raised vagal heart rate variability lasted after a longer-exhale block in a 28-person study" },
      { type: "h", text: "What we do not know" },
      { type: "list", items: [
        "Whether a longer exhale beats an equal in-and-out pace in daily life. Equal breathing at 5.5 a minute has raised heart rate variability too.",
        "Which ratio is best. Studies used different ones.",
        "Whether the effect comes from the exhale itself or from slowing down.",
        "Whether any of it lasts, or helps people with stress conditions. The studies were short.",
      ] },
      { type: "callout", tone: "key", text: "A gently longer exhale is safe to try and has a plausible mechanism. It is not yet proven to be better than other slow patterns." },
      { type: "callout", tone: "care", text: "Do not force the exhale or squeeze out every bit of air. If you feel light-headed or tense, shorten the out-breath and let it be easy." },
      { type: "callout", tone: "try", text: "Breathe in for 4 and out for 6 to 8, quietly, through the nose or soft lips. Stay with whichever ratio feels natural." },
    ],
    tryIt: { label: "Longer breath out", technique: "extended" },
    sources: [EI_2021, EI_2014, PROLEX, EQUAL55],
  },

  /* 8 ------------------------------------------------------------------ */
  {
    id: "breathing-for-sleep",
    title: "Breathing for sleep: 4-7-8 and slow breathing",
    tagline: "See what the research shows about 4-7-8 and other slow breathing near bedtime, and how strong it really is.",
    minutes: 6, hue: 265, level: "Go deeper", evidence: "Weak",
    blocks: [
      { type: "h", text: "4-7-8 in the lab" },
      { type: "p", text: "4-7-8 means breathing in for 4, holding for 7 and breathing out for 8. Dr. Andrew Weil made it popular, and the claim online is that it can put you to sleep in a minute or so. We found no study that tested that." },
      { type: "p", text: "The main published study is Vierra and colleagues in Physiological Reports (2022). It involved 43 healthy people aged 19 to 25, 22 of them sleep-deprived. They did six cycles three times with a minute of normal breathing between." },
      { type: "list", items: [
        "Heart rate and systolic blood pressure fell in both groups.",
        "In the rested group, a measure of vagal heart rate variability rose.",
        "In the sleep-deprived group, several other heart rate variability measures fell, a mixed result.",
      ] },
      { type: "callout", tone: "care", text: "That study did not measure sleep. Nobody was tested on falling asleep faster, and it was not followed over nights." },
      { type: "h", text: "Slow breathing before bed more broadly" },
      { type: "p", text: "A 2026 systematic review looked at slow breathing at 10 or fewer breaths a minute before bed. It found 9 studies with 457 people. Sleep duration and quality reported by participants improved." },
      { type: "p", text: "But objective measures were inconclusive: two studies with wrist devices and three with sleep-lab recordings. The authors asked for larger, longer, higher-quality trials." },
      { type: "fact", stat: "9 studies", label: "with 457 people in the 2026 review of slow breathing before bedtime; self-reported sleep improved, objective measures were inconclusive" },
      { type: "h", text: "A sensible reading" },
      { type: "list", items: [
        "Slow, easy breathing at bedtime is low-risk and may help you feel ready to sleep.",
        "Whether the 7-count hold adds anything is unknown. If it makes you uneasy, drop it or shorten the counts.",
        "Light-headedness means ease off. Do not practise anywhere you could fall.",
      ] },
      { type: "callout", tone: "care", text: "If you often cannot sleep, snore loudly, wake gasping or feel exhausted in the day, talk to your GP. Breathing exercises are not a substitute for checking for a sleep disorder." },
    ],
    tryIt: { label: "4-7-8 breathing", technique: "478" },
    sources: [VIERRA, EIDE, ZACCARO, NCCIH_RELAX],
  },

  /* 9 ------------------------------------------------------------------ */
  {
    id: "breathing-exercise-singing",
    title: "Breathing while you move, sing and talk",
    tagline: "Keep to the facts that are well supported about breathing during effort, singing and speaking.",
    minutes: 5, hue: 40, level: "Start here", evidence: "Moderate",
    blocks: [
      { type: "h", text: "During exercise: let it rise" },
      { type: "p", text: "When you move, your muscles make more CO2 and breathing speeds up to keep pace. That happens automatically. The NHS describes moderate activity as raising your heart rate and making you breathe faster." },
      { type: "p", text: "There is a simple check, the talk test. During moderate activity you should be able to talk but not sing. If you cannot say a short sentence, ease off." },
      { type: "fact", stat: "150 min", label: "of moderate activity a week is the NHS adult guideline, the same advice it gives in pregnancy" },
      { type: "h", text: "Nose or mouth?" },
      { type: "p", text: "A 2020 review of 30 studies found that nose-only breathing is workable for most people at moderate effort. It reported possible benefits such as less exercise-induced airway narrowing and better ventilatory efficiency, and said nose-only breathing may be reachable at harder efforts after a period of adaptation." },
      { type: "callout", tone: "key", text: "Using your mouth when you need more air is normal. Nose breathing is an option, not a rule, and the evidence so far is small." },
      { type: "h", text: "Lifting" },
      { type: "p", text: "When effort is heavy it is natural to hold your breath and strain. That spikes blood pressure, which is covered in the lesson on heart conditions. Keep breathing through the lift." },
      { type: "h", text: "Singing and speaking" },
      { type: "p", text: "Speaking and singing happen on the out-breath, so they naturally stretch your exhale. Teachers have many views about breath support, and we did not find strong research on any one method." },
      { type: "p", text: "A 2016 review of singing groups for people with lung conditions found six small studies. Singing showed potential to improve quality of life and anxiety without significant side effects. The authors noted a high risk of bias and asked for larger trials." },
      { type: "callout", tone: "care", text: "Stop and get medical advice if exercise causes chest pain, fainting or severe breathlessness. Do not try to push through it with a breathing technique." },
      { type: "callout", tone: "try", text: "If you get out of breath after effort, a few rounds of easy breathing out through soft lips is a gentle way to bring your rate down." },
    ],
    tryIt: { label: "Pursed-lip breathing", technique: "pursed" },
    sources: [NHS_PREG_EX, DALLAM, SINGING, LIFT_BP],
  },

  /* 10 ----------------------------------------------------------------- */
  {
    id: "breathing-pregnancy-heart",
    title: "Pregnancy, high blood pressure and heart conditions",
    tagline: "Learn which breathing habits to avoid, and why, when you are pregnant or have a heart or blood pressure condition.",
    minutes: 6, hue: 340, level: "Go deeper", evidence: "Mixed",
    blocks: [
      { type: "h", text: "Start with your clinician" },
      { type: "p", text: "This lesson is general information, not advice for your case. If you are pregnant, or have high blood pressure, a heart condition, lung disease, epilepsy or a history of trauma, check with your midwife, GP or specialist before trying new breathing practices." },
      { type: "p", text: "The US NCCIH says relaxation techniques are generally safe for healthy people. It also notes rare reports of problems in people with epilepsy or certain psychiatric conditions, or a history of abuse or trauma." },
      { type: "h", text: "Slow, easy breathing" },
      { type: "p", text: "A 2024 meta-analysis of 15 trials found breathing exercises were linked with small average drops in blood pressure: 7 mmHg systolic and 3 mmHg diastolic. The authors noted the studies carried a risk of bias." },
      { type: "callout", tone: "care", text: "That is not a replacement for blood pressure medicine. Keep taking prescribed medicines and keep your blood pressure checks." },
      { type: "h", text: "What to avoid, and why" },
      { type: "list", items: [
        "Strained breath holds. In a 1992 study of 20 novice lifters, holding the breath (the Valsalva manoeuvre) while lifting produced the highest blood pressure of the three breathing styles tested.",
        "Holding the breath during strength work. A 2024 review of isometric exercise for high blood pressure says clinicians should have people keep breathing through each effort, because holding the breath tends to happen without noticing and can push blood pressure up.",
        "Fast, forceful breathing. It lowers CO2 and can cause light-headedness or fainting, and a fall is a risk for anyone.",
        "Long holds in pregnancy. We found no authoritative guideline giving a safe hold length, so we give no number.",
      ] },
      { type: "fact", stat: "20", label: "novice lifters in a 1992 study: holding the breath while lifting gave the highest blood pressure response" },
      { type: "h", text: "Pregnancy notes" },
      { type: "p", text: "The NHS says exercise is safe in pregnancy and suggests you can talk but not sing at moderate effort. Late in pregnancy, avoid lying flat on your back for more than a few minutes because it can make you dizzy. If you feel unwell, stop." },
      { type: "p", text: "Ask your midwife which breathing practices suit you at each stage of pregnancy." },
      { type: "callout", tone: "care", text: "Severe headache, vision problems, pain below the ribs or sudden swelling in pregnancy can be signs of pre-eclampsia. The NHS says to get urgent medical help, not to try a breathing exercise." },
      { type: "callout", tone: "try", text: "If your clinician agrees, keep it simple: sit or lie on your side, breathe slowly, with no holds, and stop if you feel dizzy." },
    ],
    tryIt: { label: "Slow belly breathing, no holds", technique: "belly" },
    sources: [NCCIH_RELAX, BP_META, LIFT_BP, ISO_HTN, NHS_PREG_EX, NHS_PREECLAMPSIA],
  },
];

export const BREATH_MYTHS: Myth[] = [
  {
    myth: "Deep breathing floods your body with oxygen.",
    truth: "Healthy blood is already 95 to 100 percent saturated with oxygen, so there is little extra to add. Breathing hard mostly blows off CO2.",
    evidence: "Strong",
    source: MEDLINE_OX,
  },
  {
    myth: "When you hyperventilate, you are not getting enough oxygen.",
    truth: "The shortage is CO2. Low CO2 narrows brain blood vessels and changes how nerves fire, which is why you feel tingly and light-headed.",
    evidence: "Strong",
    source: DEBRECZENI,
  },
  {
    myth: "More oxygen is always better.",
    truth: "In healthy people, breathing more than you need lowers CO2 and slows blood flow in the brain. It does not make you more oxygenated.",
    evidence: "Moderate",
    source: LAFFEY,
  },
  {
    myth: "We only use a fraction of our lungs.",
    truth: "At rest you use only what you need. Heavy effort uses much more of the available capacity. That spare room is reserve, not waste.",
    evidence: "Moderate",
  },
  {
    myth: "Mouth breathing always harms you.",
    truth: "Breathing through the mouth is normal when you need more air. Nose breathing works for most people at moderate exercise, but the evidence for it being superior is small.",
    evidence: "Mixed",
    source: DALLAM,
  },
  {
    myth: "You can detox by breathing.",
    truth: "Your lungs already clear CO2 on every out-breath. NIH's NCCIH found no compelling research that detox programmes remove toxins, and we found no trial showing breathing does.",
    evidence: "None",
    source: NCCIH_DETOX,
  },
  {
    myth: "Holding your breath longer means healthier lungs.",
    truth: "Hold time reflects practice, CO2 sensitivity, mood and congestion. We found no good evidence it predicts lung health, and pushing for longer carries a blackout risk.",
    evidence: "None",
    source: RLSS,
  },
  {
    myth: "Breathing fast before a hold lets you stay under longer, safely.",
    truth: "Over-breathing lowers CO2 and delays the urge to breathe, so oxygen can run out before you feel any warning. This is the cause of shallow water blackout.",
    evidence: "Strong",
    source: RLSS,
  },
  {
    myth: "Breathwork can replace professional care for anxiety disorders.",
    truth: "Slow breathing eases arousal in healthy people, and a clinician-led capnometry programme shows promise for panic disorder. The NHS names CBT and medicine as the main care.",
    evidence: "Mixed",
    source: NHS_PANIC,
  },
  {
    myth: "Panic attacks are just over-breathing.",
    truth: "Some researchers link panic to low CO2 or an over-sensitive suffocation alarm, while others question how central over-breathing is. The question is open.",
    evidence: "Mixed",
    source: LEY,
  },
  {
    myth: "Wim Hof breathing is proven to boost your immune system.",
    truth: "In a 2014 study of 12 trained versus 12 untrained volunteers, the trained group had a smaller reaction to a lab endotoxin test. Reviews call this promising, and no study shows fewer real infections.",
    evidence: "Weak",
    source: KOX,
  },
  {
    myth: "Buteyko breathing can replace asthma medicines.",
    truth: "In the Cooper trial, Buteyko eased symptoms and reliever use but did not change lung function or steroid dose. Cochrane rated the overall evidence moderate to very low.",
    evidence: "Mixed",
    source: COOPER,
  },
  {
    myth: "Six breaths a minute is the one magic rate.",
    truth: "Six is a convenient landmark from heart rate variability research. Other slow rates, such as 5.5, also work, and the best rate varies between people.",
    evidence: "Mixed",
    source: LABORDE,
  },
  {
    myth: "A longer exhale always settles you more than an even breath.",
    truth: "Some small lab studies found a longer exhale raised vagal heart rate variability, but an equal 5.5 a minute pace did too. The extra benefit of a long exhale is unproven.",
    evidence: "Weak",
    source: EI_2021,
  },
  {
    myth: "4-7-8 puts you to sleep in about a minute.",
    truth: "The main study measured heart rate and blood pressure in 43 healthy young adults and did not test sleep at all.",
    evidence: "Weak",
    source: VIERRA,
  },
  {
    myth: "Holding your breath while lifting is harmless.",
    truth: "In 20 novice lifters, holding the breath produced the highest blood pressure response. A 2024 review of exercise for high blood pressure says to keep breathing through each effort.",
    evidence: "Moderate",
    source: LIFT_BP,
  },
  {
    myth: "Slow breathing is risk-free for everyone.",
    truth: "It is low-risk for most people, but NCCIH notes occasional anxiety or fear of losing control, and rare problems in epilepsy, some psychiatric conditions, and trauma histories.",
    evidence: "Moderate",
    source: NCCIH_RELAX,
  },
];

export const PRACTICE_GLOSSARY: GlossaryTerm[] = [
  { term: "Hypocapnia", plain: "Low carbon dioxide in the blood, usually from breathing more than the body needs." },
  { term: "Hypercapnia", plain: "High carbon dioxide in the blood. A small rise is what drives the urge to breathe." },
  { term: "Hypoxia", plain: "Too little oxygen reaching the tissues, including the brain." },
  { term: "Respiratory alkalosis", plain: "The blood becoming slightly more alkaline because you blew off extra CO2." },
  { term: "Urge to breathe", plain: "The strong wish for a breath during a hold. It comes mostly from rising CO2, not falling oxygen." },
  { term: "Shallow water blackout", plain: "Loss of consciousness from low brain oxygen after over-breathing and breath-holding. It can come with no warning and at any depth." },
  { term: "Capnometry", plain: "Measuring CO2 in the breath, usually at the end of each out-breath, with a small device." },
  { term: "End-tidal CO2", plain: "The CO2 level at the very end of an out-breath, a close stand-in for CO2 in the blood." },
  { term: "CART", plain: "Capnometry-assisted respiratory training. A clinician-led programme that uses live CO2 feedback to teach slower breathing for panic disorder." },
  { term: "Valsalva manoeuvre", plain: "Holding the breath and straining against a closed airway, which briefly raises blood pressure." },
  { term: "Heart rate variability (HRV)", plain: "The small beat-to-beat changes in your heart rate. Often used as a marker of how flexibly the body is responding." },
  { term: "Resonance breathing", plain: "Breathing at about six breaths a minute, the rate that tends to line up with the heart's own slow rhythm." },
  { term: "Exhalation-to-inhalation ratio (E:I)", plain: "How long the out-breath lasts compared with the in-breath. A ratio of 2:1 means the exhale is twice as long." },
  { term: "Dysfunctional breathing", plain: "A pattern of breathing that does not match the body's needs, often fast or chest-led, and that can cause symptoms." },
];
