import type { Source } from "../pantryContent";
import type { GlossaryTerm, Lesson } from "./types";

// Every URL below was checked against Crossref (title, journal, year) or opened.
const SMITH_1991: Source = { text: "Smith JC, Ellenberger HH, Ballanyi K, Richter DW, Feldman JL. Pre-Bötzinger complex: a brainstem region that may generate respiratory rhythm in mammals. Science, 1991", url: "https://doi.org/10.1126/science.1683005" };
const DEL_NEGRO_2018: Source = { text: "Del Negro CA, Funk GD, Feldman JL. Breathing matters. Nature Reviews Neuroscience, 2018", url: "https://doi.org/10.1038/s41583-018-0003-6" };
const FELDMAN_2022: Source = { text: "Breathing Rhythm and Pattern and Their Influence on Emotion. Annual Review of Neuroscience, 2022", url: "https://doi.org/10.1146/annurev-neuro-090121-014424" };
const YACKLE_2017: Source = { text: "Yackle K et al. Breathing control center neurons that promote arousal in mice. Science, 2017", url: "https://doi.org/10.1126/science.aai7984" };
const ZELANO_2016: Source = { text: "Zelano C et al. Nasal respiration entrains human limbic oscillations and modulates cognitive function. Journal of Neuroscience, 2016", url: "https://doi.org/10.1523/JNEUROSCI.2586-16.2016" };
const HECK_2017: Source = { text: "Heck DH et al. Breathing as a fundamental rhythm of brain function. Frontiers in Neural Circuits, 2017", url: "https://doi.org/10.3389/fncir.2016.00115" };
const LEHRER_2014: Source = { text: "Lehrer PM, Gevirtz R. Heart rate variability biofeedback: how and why does it work? Frontiers in Psychology, 2014", url: "https://doi.org/10.3389/fpsyg.2014.00756" };
const LEHRER_2020: Source = { text: "Lehrer P et al. Heart rate variability biofeedback improves emotional and physical health and performance: a systematic review and meta-analysis. Applied Psychophysiology and Biofeedback, 2020", url: "https://doi.org/10.1007/s10484-020-09466-z" };
const LABORDE_2017: Source = { text: "Laborde S, Mosley E, Thayer JF. Heart rate variability and cardiac vagal tone in psychophysiological research. Frontiers in Psychology, 2017", url: "https://doi.org/10.3389/fpsyg.2017.00213" };
const ZACCARO_2018: Source = { text: "Zaccaro A et al. How breath-control can change your life: a systematic review on psycho-physiological correlates of slow breathing. Frontiers in Human Neuroscience, 2018", url: "https://doi.org/10.3389/fnhum.2018.00353" };
const BERNTSON_1991: Source = { text: "Berntson GG, Cacioppo JT, Quigley KS. Autonomic determinism: the modes of autonomic control, the doctrine of autonomic space, and the laws of autonomic constraint. Psychological Review, 1991", url: "https://doi.org/10.1037/0033-295x.98.4.459" };
const GROSSMAN_TAYLOR_2007: Source = { text: "Grossman P, Taylor EW. Toward understanding respiratory sinus arrhythmia: relations to cardiac vagal tone, evolution and biobehavioral functions. Biological Psychology, 2007", url: "https://doi.org/10.1016/j.biopsycho.2005.11.014" };
const GROSSMAN_2023: Source = { text: "Grossman P. Fundamental challenges and likely refutations of the five basic premises of the polyvagal theory. Biological Psychology, 2023", url: "https://doi.org/10.1016/j.biopsycho.2023.108589" };
const GARFINKEL_2015: Source = { text: "Garfinkel SN et al. Knowing your own heart: distinguishing interoceptive accuracy from interoceptive awareness. Biological Psychology, 2015", url: "https://doi.org/10.1016/j.biopsycho.2014.11.004" };
const GARFINKEL_2016: Source = { text: "Garfinkel SN et al. Interoceptive dimensions across cardiac and respiratory axes. Philosophical Transactions of the Royal Society B, 2016", url: "https://doi.org/10.1098/rstb.2016.0014" };
const KHALSA_2018: Source = { text: "Khalsa SS et al. Interoception and mental health: a roadmap. Biological Psychiatry: Cognitive Neuroscience and Neuroimaging, 2018", url: "https://doi.org/10.1016/j.bpsc.2017.12.004" };
const PAULUS_STEIN_2006: Source = { text: "Paulus MP, Stein MB. An insular view of anxiety. Biological Psychiatry, 2006", url: "https://doi.org/10.1016/j.biopsych.2006.03.042" };
const BALBAN_2023: Source = { text: "Balban MY et al. Brief structured respiration practices enhance mood and reduce physiological arousal. Cell Reports Medicine, 2023", url: "https://doi.org/10.1016/j.xcrm.2022.100895" };
const FINCHAM_2023: Source = { text: "Fincham GW et al. Effect of breathwork on stress and mental health: a meta-analysis of randomised-controlled trials. Scientific Reports, 2023", url: "https://doi.org/10.1038/s41598-022-27247-y" };
const TANG_2015: Source = { text: "Tang YY, Hölzel BK, Posner MI. The neuroscience of mindfulness meditation. Nature Reviews Neuroscience, 2015", url: "https://doi.org/10.1038/nrn3916" };
const HOLZEL_2011: Source = { text: "Hölzel BK et al. How does mindfulness meditation work? Proposing mechanisms of action from a conceptual and neural perspective. Perspectives on Psychological Science, 2011", url: "https://doi.org/10.1177/1745691611419671" };
const MELNYCHUK_2018: Source = { text: "Melnychuk MC et al. Coupling of respiration and attention via the locus coeruleus: effects of meditation and pranayama. Psychophysiology, 2018", url: "https://doi.org/10.1111/psyp.13091" };
const EIDE_2026: Source = { text: "Eide et al. Slow breathing techniques before bedtime and the effects on sleep: a systematic review. Sleep Medicine Reviews, 2026", url: "https://doi.org/10.1016/j.smrv.2026.102284" };

export const BRAIN_LESSONS: Lesson[] = [
  {
    id: "brain-pacemaker",
    title: "The pacemaker in your brainstem",
    tagline: "See where your breathing rhythm is born, and why you never have to remember to breathe.",
    minutes: 5, hue: 200, level: "Start here", evidence: "Moderate",
    blocks: [
      { type: "p", text: "You breathe about 20,000 times a day without deciding to. The rhythm is generated deep in the brainstem, at the base of your brain, by networks of nerve cells that fire in a repeating pattern." },
      { type: "h", text: "A small region with a big job" },
      { type: "p", text: "In 1991, a team led by Jeffrey Feldman and Diethelm Richter cut thin slices of newborn rat brainstem. They found that a limited patch of the lower brainstem, which they named the preBötzinger complex, kept producing breathing-like bursts on its own. Remove that patch and the rhythm stopped." },
      { type: "fact", stat: "1991", label: "The year the preBötzinger complex was first described as a region needed to generate breathing rhythm (in newborn rats)" },
      { type: "p", text: "Later work in adult animals supports the same picture: the preBötzinger complex drives the in-breath, and other brainstem groups help shape the out-breath and the pauses." },
      { type: "h", text: "Not a simple clock" },
      { type: "p", text: "Reviews of this field describe the rhythm as an emergent property of a network, not one cell ticking like a metronome. Cells fire together, then fall quiet, and the network can speed up, slow down or change pattern quickly." },
      { type: "p", text: "That flexibility matters. The same circuit takes in signals from the whole brain, which is why a startle, a laugh, a sigh or a sense of dread all change how you breathe within a second." },
      { type: "callout", tone: "key", text: "Breathing is automatic, but it is not locked. Higher brain areas can take over the controls for a while, and that is what a breathing practice does." },
      { type: "callout", tone: "care", text: "The founding experiments were in newborn rat tissue. Human evidence is more indirect, from patients, imaging and clinical cases. The overall picture is well accepted, but details are still debated." },
      { type: "callout", tone: "try", text: "Breathe in your usual way for ten seconds without changing anything. Then slow it down on purpose. Notice the moment you switch from automatic to chosen." },
    ],
    tryIt: { label: "Practise choosing your pace", technique: "calm" },
    sources: [SMITH_1991, DEL_NEGRO_2018, FELDMAN_2022],
  },
  {
    id: "brain-arousal-mice",
    title: "Do breathing neurons set your mood?",
    tagline: "Learn what a famous mouse study found about breathing and arousal, and what it cannot tell us about you.",
    minutes: 6, hue: 215, level: "Go deeper", evidence: "Weak",
    blocks: [
      { type: "p", text: "In 2017, Kevin Yackle and colleagues in Mark Krasnow's lab at Stanford, working with Jack Feldman's group at UCLA, reported a small group of neurons that seem to link breathing to how aroused an animal is. The work was in mice." },
      { type: "fact", stat: "~175", label: "Neurons in the mouse preBötzinger complex the team identified as linking breathing to arousal" },
      { type: "h", text: "What they found" },
      { type: "list", items: [
        "They found a subgroup of preBötzinger neurons, defined by two genes, that talk to the locus coeruleus, a brainstem hub involved in alertness and attention.",
        "When the team removed this subgroup in adult mice, the animals kept breathing normally.",
        "But the mice spent more time in relaxed behaviours and less in aroused ones, such as active sniffing and exploring.",
      ] },
      { type: "p", text: "The idea is that the breathing centre does not only supply air. It may also send a signal upward that helps set how alert the brain is." },
      { type: "h", text: "What it does not mean" },
      { type: "p", text: "Nobody has shown that people have the same cells, or that slowing your breath switches them off. The study removed cells permanently. It did not test a person changing their breathing pace." },
      { type: "callout", tone: "care", text: "Animal-only evidence. In mice, this circuit links breathing to arousal. It is a promising lead for how a slow breath could settle the mind, not proof that it does in people." },
      { type: "callout", tone: "key", text: "A good way to hold it: the brain and breath talk to each other in both directions, and one pathway for that has now been mapped in mice." },
      { type: "p", text: "Human trials of slow breathing, covered in other lessons, are what tell us whether practice helps people. This study offers a possible why." },
    ],
    tryIt: { label: "Try a slow, steady pace", technique: "extended" },
    sources: [YACKLE_2017, FELDMAN_2022, DEL_NEGRO_2018],
  },
  {
    id: "brain-breath-rhythm-memory",
    title: "Your breath and your brain waves",
    tagline: "Find out how each breath is linked to electrical activity in memory and emotion areas, and how far that finding goes.",
    minutes: 6, hue: 190, level: "Go deeper", evidence: "Mixed",
    blocks: [
      { type: "p", text: "Your brain generates rhythmic electrical activity, often called brain waves. In animals, these rhythms are known to follow the breathing cycle. In 2016, a Northwestern team led by Christina Zelano asked whether the same holds in people." },
      { type: "h", text: "Looking inside the brain" },
      { type: "p", text: "They recorded from electrodes placed inside the brains of patients with epilepsy who were being assessed for surgery. This is a rare chance to measure deep areas directly." },
      { type: "p", text: "Activity in the olfactory (smell) cortex, the amygdala and the hippocampus rose and fell in step with breathing. It was strongest during the in-breath, and it faded when the person breathed through the mouth instead of the nose." },
      { type: "fact", stat: "0.16 to 0.33 Hz", label: "The breathing rhythm range (about 10 to 20 breaths a minute) at which the team found limbic activity following the breath" },
      { type: "h", text: "Memory and fear" },
      { type: "p", text: "In separate experiments with healthy volunteers, people recognised fearful faces faster and recalled more when the information arrived during an in-breath than during an out-breath. Nose breathing, not mouth breathing, showed the effect." },
      { type: "p", text: "A 2017 review by Detlef Heck and colleagues argued that breathing may act as a basic rhythm that helps coordinate activity across the brain. It is a framework, and much of the evidence it builds on is from animals." },
      { type: "callout", tone: "care", text: "The intracranial recordings came from a small number of patients with epilepsy, so brains may differ from yours. The memory and fear effects were small and measured over milliseconds. No one has shown that breathing in a certain way will sharpen memory in daily life." },
      { type: "callout", tone: "key", text: "Every breath leaves a rhythmic footprint in brain areas tied to smell, emotion and memory. What that footprint is for is still being worked out." },
      { type: "callout", tone: "try", text: "For one minute, breathe in and out through your nose only. Notice whether the air feels cooler on the way in. Smell is the sense most directly tied to this breath-brain link." },
    ],
    tryIt: { label: "Nasal, even breathing", technique: "equal" },
    sources: [ZELANO_2016, HECK_2017, FELDMAN_2022],
  },
  {
    id: "brain-vagus-hrv",
    title: "The vagus nerve and heart rate variability",
    tagline: "Understand why your heartbeat speeds up when you breathe in, and why about six breaths a minute is special.",
    minutes: 7, hue: 160, level: "Go deeper", evidence: "Moderate",
    blocks: [
      { type: "p", text: "The vagus nerve is a long pair of nerves running from the brainstem to the heart, lungs and gut. About the heart, it works like a brake: more vagal activity slows the beat." },
      { type: "h", text: "Your heart follows your breath" },
      { type: "p", text: "Breathe in and your heart rate rises a little. Breathe out and it falls. This normal rhythm is called respiratory sinus arrhythmia, and it is one major part of heart rate variability (HRV), the small beat-to-beat changes in timing." },
      { type: "h", text: "Why about six a minute" },
      { type: "p", text: "In their 2014 paper, Paul Lehrer and Richard Gevirtz explain that the heart and blood pressure system has a natural rhythm. When you breathe near that rhythm, the swings in heart rate grow very large. This is resonance, like pushing a swing at just the right pace." },
      { type: "fact", stat: "~5.5 to 6", label: "Breaths per minute where heart rate swings with breathing tend to be largest in healthy adults (about 0.09 to 0.1 Hz)" },
      { type: "p", text: "The best pace varies from person to person. Taller people and men tend to have slightly slower resonance rates." },
      { type: "p", text: "Their leading explanation is the baroreflex, the body's blood pressure feedback loop, and they also suggest a role for vagal signals travelling up to the brain. They are clear that the mechanism is not settled." },
      { type: "callout", tone: "key", text: "Slow, even breathing reliably raises HRV during the practice. That is a solid physiological finding." },
      { type: "callout", tone: "care", text: "Higher HRV is a marker, not a goal in itself. A meta-analysis of HRV biofeedback found benefits for stress, anxiety and mood on average, but trial quality varies, and a higher number on a wearable is not a health score." },
      { type: "callout", tone: "try", text: "Breathe in for five, out for five, for three minutes. If you wear a heart monitor, watch the rate rise on the in-breath and fall on the out-breath." },
    ],
    tryIt: { label: "Find your pace on the heart tool", to: "#heart" },
    sources: [LEHRER_2014, LEHRER_2020, LABORDE_2017, ZACCARO_2018],
  },
  {
    id: "brain-autonomic",
    title: "Gas pedal and brake: the autonomic system",
    tagline: "Learn how your two body-wide control systems really work together, and why a simple on/off picture falls short.",
    minutes: 7, hue: 255, level: "Go deeper", evidence: "Moderate",
    blocks: [
      { type: "p", text: "The autonomic nervous system runs things you do not consciously steer: heart rate, digestion, pupil size, sweat. It has two main branches, the sympathetic (ready to act) and the parasympathetic (rest and digest)." },
      { type: "fact", stat: "1991", label: "The year Berntson and colleagues showed the two branches do not simply trade off like a seesaw" },
      { type: "h", text: "More than a seesaw" },
      { type: "p", text: "A common picture is a seesaw: one goes up, the other goes down. In 1991, Gary Berntson and colleagues showed that this is too simple. The two branches can rise together, fall together, or change independently, so the same heart rate can come from different mixes." },
      { type: "list", items: [
        "Sympathetic activity prepares the body for effort: faster heart, wider airways, more alertness.",
        "Parasympathetic activity, much of it through the vagus nerve, slows the heart and supports recovery.",
        "Most of the time both are active, in a shifting balance.",
      ] },
      { type: "h", text: "Where breathing fits" },
      { type: "p", text: "Breathing is unusual because it is both automatic and under your control. It is one of the few handles that reaches into this system. Slower, longer out-breaths tend to increase the vagal part of heart control, which shows up as more HRV." },
      { type: "h", text: "A fair note on polyvagal theory" },
      { type: "p", text: "Polyvagal theory, introduced by Stephen Porges, is very popular in therapy and wellness circles. It proposes that the vagus nerve has distinct evolutionary layers tied to social engagement, fight-or-flight and shutdown." },
      { type: "p", text: "Many physiologists disagree. Paul Grossman, who has questioned it since 2007, published a detailed 2023 critique arguing that its main premises conflict with the anatomy and evolutionary evidence. Porges and supporters dispute this." },
      { type: "callout", tone: "care", text: "You do not need polyvagal theory to benefit from slow breathing, and the theory's contested claims, such as three neat vagal states, are not established science. Treat it as a metaphor some people find helpful, not a map of your nerves." },
      { type: "callout", tone: "key", text: "Say 'my body shifted toward recovery', not 'I switched off my stress response'. The system is a blend, and breathing nudges the blend." },
    ],
    tryIt: { label: "Longer out-breath", technique: "extended" },
    sources: [BERNTSON_1991, GROSSMAN_TAYLOR_2007, GROSSMAN_2023, LABORDE_2017],
  },
  {
    id: "brain-interoception",
    title: "Sensing your own breath and heartbeat",
    tagline: "Learn what interoception is, why people differ, and how it relates to anxiety.",
    minutes: 6, hue: 330, level: "Start here", evidence: "Mixed",
    blocks: [
      { type: "p", text: "Interoception is the sense of what is happening inside your body: your heartbeat, your breathing, your hunger, the tightness in your chest. Researchers treat it as a sense in its own right." },
      { type: "h", text: "Three different things" },
      { type: "p", text: "In 2015, Sarah Garfinkel, Hugo Critchley and colleagues showed that 'how well you sense your heart' is not one thing. They separated three dimensions:" },
      { type: "list", items: [
        "Accuracy: how well you actually detect your heartbeat in a test.",
        "Sensibility: how good you believe you are at it.",
        "Awareness: how well your confidence matches your accuracy.",
      ] },
      { type: "fact", stat: "3", label: "Separate dimensions of interoception (accuracy, sensibility, awareness), found to be distinct in a sample of 80 people" },
      { type: "p", text: "The three do not always agree. Someone can feel highly sensitive to their body and be inaccurate, or the other way round." },
      { type: "h", text: "Anxiety and the body" },
      { type: "p", text: "Reviews, including Paulus and Stein's 'insular view of anxiety', propose that anxious people may over-weight signals from the body, with the insula (a brain area that maps body states) playing a central role. The same team has also looked at breathing, not only heartbeats." },
      { type: "callout", tone: "care", text: "The links between interoception and anxiety are real in many studies but are correlations, and results differ by how interoception is measured. Feeling your pulse quicken is not a sign of a disorder." },
      { type: "callout", tone: "key", text: "Noticing the breath is a gentle way to practise interoception. Accurate noticing, with a kind, unhurried interpretation, is the aim. Anxious over-monitoring is not." },
      { type: "callout", tone: "try", text: "Sit quietly. Without touching your wrist, guess your pulse for 20 seconds. Then try feeling where the breath moves most: chest, ribs or belly. There is no right answer." },
    ],
    tryIt: { label: "Belly breathing to feel the breath", technique: "belly" },
    sources: [GARFINKEL_2015, GARFINKEL_2016, KHALSA_2018, PAULUS_STEIN_2006],
  },
  {
    id: "brain-stress-evidence",
    title: "Stress, anxiety and slow breathing: what trials show",
    tagline: "Read the best human evidence on breathwork for stress, including its limits.",
    minutes: 8, hue: 175, level: "Go deeper", evidence: "Moderate",
    blocks: [
      { type: "p", text: "Here is how two recent pieces of work, a trial and a meta-analysis, line up, in plain language." },
      { type: "h", text: "The Stanford cyclic sighing trial" },
      { type: "p", text: "Melis Balban and colleagues, including Andrew Huberman, ran a remote randomised trial in 2023. Healthy adults did one of three breathwork routines, or mindfulness meditation, for five minutes a day over 28 days." },
      { type: "list", items: [
        "Cyclic sighing (a double inhale through the nose, then a long slow exhale) led to bigger improvements in positive mood than meditation did.",
        "It also lowered breathing rate more.",
        "State anxiety and negative mood dropped after each session in every group, and the groups did not differ from each other on those.",
      ] },
      { type: "fact", stat: "5 min", label: "Daily practice for 28 days in the Balban trial" },
      { type: "h", text: "The Fincham meta-analysis" },
      { type: "p", text: "In 2023, Fincham and colleagues pooled randomised trials of breathwork against comparison conditions." },
      { type: "fact", stat: "g = -0.35", label: "Average effect on self-reported stress across 12 trials and 785 adults (a small to medium effect)" },
      { type: "p", text: "Anxiety and depression symptoms showed similar small to medium improvements, across more trials. Most studies were at moderate risk of bias, and the authors warned about a gap between hype and evidence." },
      { type: "callout", tone: "care", text: "Findings come mostly from healthy volunteers, short trials, self-reported outcomes and no way to hide from participants that they are breathing differently. Results do not show that breathwork is a substitute for professional care." },
      { type: "callout", tone: "key", text: "Reasonable summary: slow, exhale-led breathing probably helps many people feel a little better, a little faster, and does so about as well as other simple practices." },
    ],
    tryIt: { label: "Try cyclic sighing", technique: "sigh" },
    sources: [BALBAN_2023, FINCHAM_2023, ZACCARO_2018, LEHRER_2020],
  },
  {
    id: "brain-attention-meditation",
    title: "Breath-focused attention and the brain",
    tagline: "See what is well supported about paying attention to the breath, and what is still a hypothesis.",
    minutes: 6, hue: 280, level: "Go deeper", evidence: "Mixed",
    blocks: [
      { type: "p", text: "Many meditation practices start with the breath: notice it, wander off, come back. This simple loop is the core skill, and it has been studied with brain imaging for two decades." },
      { type: "h", text: "A model of how it might work" },
      { type: "p", text: "A widely cited 2011 review by Britta Hölzel and colleagues proposed that mindfulness may work through four linked processes: regulating attention, body awareness, regulating emotion, and a shift in how you view yourself." },
      { type: "fact", stat: "4", label: "Components of mindfulness proposed by Hölzel and colleagues (attention, body awareness, emotion regulation, change in perspective on self)" },
      { type: "p", text: "A 2015 review in Nature Reviews Neuroscience by Yi-Yuan Tang, Hölzel and Michael Posner concluded that research broadly supports benefits for health and thinking skills, and that imaging has begun to reveal the networks involved." },
      { type: "h", text: "The honest limits" },
      { type: "p", text: "The same review states plainly that the underlying neural mechanisms remain unclear and that more rigorous studies are needed. Many imaging studies are small, compare experienced meditators with others, and cannot show that meditation caused the differences." },
      { type: "callout", tone: "care", text: "Be wary of claims that breath meditation 'rewires' your brain or thickens an area in a set number of weeks. Findings are inconsistent between studies, and effects on daily life are modest." },
      { type: "callout", tone: "key", text: "What is well supported: practising attention on the breath is a trainable skill, and it tends to be linked with better focus and emotional steadiness when done regularly." },
      { type: "callout", tone: "try", text: "Set a timer for three minutes. Follow the breath at the nostrils. Each time your mind wanders and you notice, that noticing is the exercise, not a failure." },
    ],
    tryIt: { label: "Even, simple breathing", technique: "coherent" },
    sources: [TANG_2015, HOLZEL_2011, ZACCARO_2018],
  },
  {
    id: "brain-locus-coeruleus",
    title: "The locus coeruleus, noradrenaline and breath",
    tagline: "Explore a proposed link between breathing, a small alertness hub and sustained attention.",
    minutes: 8, hue: 245, level: "Expert", evidence: "Weak",
    blocks: [
      { type: "p", text: "The locus coeruleus is a tiny cluster of cells in the brainstem. It releases noradrenaline across the brain and helps set alertness, attention and readiness. It is where the mouse arousal neurons from another lesson send their signals." },
      { type: "h", text: "A model, not a finding" },
      { type: "p", text: "In 2018, Melnychuk and colleagues in Dublin (Psychophysiology) published a theoretical paper. They propose that the locus coeruleus acts as a hub that couples breathing and attention. Locus coeruleus cells are sensitive to carbon dioxide, which changes with each breath, so their activity may rise and fall at the breathing rhythm." },
      { type: "list", items: [
        "In their model, faster, more irregular breathing makes locus coeruleus activity less steady, which may make attention less stable.",
        "Slow, regular breathing, as in some meditation and pranayama styles, would steady it.",
        "They cite imaging and pupil-size work as hints, since pupil size follows locus coeruleus activity indirectly.",
      ] },
      { type: "callout", tone: "care", text: "This is a hypothesis paper, and its main link is inferred. Pupil size is only an indirect marker, and the locus coeruleus is hard to measure in people. A later thesis from the same group tested part of the model, but that work is not peer-reviewed and was not read in full." },
      { type: "h", text: "Why it is interesting" },
      { type: "p", text: "It offers one concrete route by which a slow, steady breath could steady attention: by evening out noradrenaline signalling. It also fits the mouse finding that preBötzinger neurons feed the locus coeruleus." },
      { type: "fact", stat: "2018", label: "Year Melnychuk and colleagues proposed the breath-locus coeruleus-attention model" },
      { type: "callout", tone: "key", text: "Read this as a promising map. It may point to real mechanisms, and it needs direct tests in people before anyone can say breathing 'tunes' this system." },
    ],
    tryIt: { label: "Steady pace for focus", technique: "resonance" },
    sources: [MELNYCHUK_2018, YACKLE_2017, FELDMAN_2022],
  },
  {
    id: "brain-sleep-onset",
    title: "Slow breathing and falling asleep",
    tagline: "See how far the evidence goes on bedtime breathing, and where it runs out.",
    minutes: 5, hue: 250, level: "Expert", evidence: "Mixed",
    blocks: [
      { type: "p", text: "Sleep onset needs the body to move toward lower arousal: slower heart, quieter mind. Slow breathing pushes physiology in that direction, so it is natural to ask if it helps people fall asleep." },
      { type: "h", text: "What the review found" },
      { type: "p", text: "A 2026 systematic review in Sleep Medicine Reviews (Eide and colleagues) looked at studies of slow breathing before bedtime. It followed a structured search method, and it reported the following in its abstract." },
      { type: "list", items: [
        "People tended to report better sleep quality and duration after bedtime slow breathing.",
        "Results from objective measures, such as wrist sensors and sleep-lab recordings, were inconclusive.",
        "The authors asked for higher-quality studies with longer follow-up.",
      ] },
      { type: "fact", stat: "9", label: "Studies included in the 2026 systematic review of bedtime slow breathing (as reported in its abstract listing)" },
      { type: "h", text: "Reading it fairly" },
      { type: "p", text: "Feeling that you slept better is a real outcome, and it counts. But it is also easier to influence than a sleep-lab measurement, and people know when they have done an exercise." },
      { type: "callout", tone: "care", text: "Evidence for faster sleep onset is limited and not consistent. Long breath holds can feel unpleasant and keep some people awake, so keep a bedtime practice gentle." },
      { type: "callout", tone: "care", text: "Ongoing trouble sleeping deserves a conversation with a clinician. Breathing practice is not a replacement for that." },
      { type: "callout", tone: "try", text: "In bed, breathe in for four and out for six or eight, through the nose, for about five minutes. Skip breath holds. Stop if you feel light-headed." },
    ],
    tryIt: { label: "Longer breath out for bedtime", technique: "extended" },
    sources: [EIDE_2026, ZACCARO_2018, LEHRER_2020],
  },
];

export const BRAIN_GLOSSARY: GlossaryTerm[] = [
  { term: "Brainstem", plain: "The stalk at the base of your brain that connects it to the spinal cord and runs automatic functions like breathing and heart rate." },
  { term: "preBötzinger complex", plain: "A small brainstem region found in 1991 that is central to generating the in-breath rhythm." },
  { term: "Central pattern generator", plain: "A group of nerve cells that produces a repeating rhythm on its own, such as the one behind breathing." },
  { term: "Locus coeruleus", plain: "A tiny brainstem hub that releases noradrenaline and helps set alertness and attention." },
  { term: "Noradrenaline", plain: "A chemical messenger that raises alertness and readiness. Also called norepinephrine." },
  { term: "Vagus nerve", plain: "A long nerve from the brainstem to the heart, lungs and gut. Its activity slows the heart." },
  { term: "Autonomic nervous system", plain: "The body's automatic control system for things like heart rate and digestion." },
  { term: "Sympathetic", plain: "The branch of the autonomic system that prepares the body for action and effort." },
  { term: "Parasympathetic", plain: "The branch that supports recovery and rest, with much of its signalling carried by the vagus nerve." },
  { term: "Heart rate variability (HRV)", plain: "The small changes in time between heartbeats. It reflects how flexibly your body regulates itself." },
  { term: "Respiratory sinus arrhythmia", plain: "The normal speeding of the heart on the in-breath and slowing on the out-breath." },
  { term: "Baroreflex", plain: "A feedback loop that adjusts heart rate to keep blood pressure steady." },
  { term: "Resonance", plain: "When a system swings most strongly at one rhythm. For heart rate and breathing, this is near six breaths a minute." },
  { term: "Interoception", plain: "Your sense of the inner state of your body, such as heartbeat, breath and hunger." },
  { term: "Insula", plain: "A brain area that maps body signals and feelings. It is often linked to interoception." },
  { term: "Polyvagal theory", plain: "A popular but contested theory about layers of the vagus nerve and safety. Many physiologists question its main claims." },
  { term: "Limbic system", plain: "Brain areas, including the amygdala and hippocampus, involved in emotion and memory." },
  { term: "Meta-analysis", plain: "A study that pools results from many trials to estimate an overall effect." },
];
