import type { Expert } from "./types";

/**
 * People who study breathing, and a few who write or teach about it.
 * Each entry was checked against an institutional page or a paper's author
 * affiliation. Free links are pages that opened when researched. Roles can
 * change, so re-check before relying on a title.
 */
export const EXPERTS: Expert[] = [
  {
    id: "jack-feldman",
    name: "Jack Feldman",
    role: "Professor of Neurobiology (Department of Neurobiology)",
    institution: "University of California, Los Angeles (UCLA)",
    known:
      "His lab named and studies the preBötzinger complex, a small cluster of brainstem neurons that helps generate the rhythm of each breath.",
    teaches:
      "Breathing is produced by a specific brain circuit, not just by the lungs and muscles. The same circuit also produces sighs and connects to other parts of the brain.",
    free: [
      { text: "Feldman Lab website", url: "https://feldmanlab.org" },
      {
        text: "UCLA Health news: how the brain creates each breath's rhythm",
        url: "https://www.uclahealth.org/news/release/how-our-brains-create-breathing-rhythm-is-unique-to-every-breath",
      },
      {
        text: "Open paper: Sigh generation in preBötzinger complex (eLife, 2025)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12187131/",
      },
    ],
    caution:
      "Most of the work is in mice and brain slices. It explains how breathing is generated, not how to breathe better.",
  },
  {
    id: "christopher-del-negro",
    name: "Christopher Del Negro",
    role: "Faculty member, Department of Applied Science",
    institution: "William & Mary",
    known:
      "Studies which neurons in the brainstem make the breathing rhythm, and has questioned older models that relied on a few special pacemaker cells.",
    teaches:
      "How researchers test which cells are essential for breathing, and why the field still debates how the rhythm arises.",
    free: [
      {
        text: "Open paper: Dbx1 preBötzinger interneurons and the core breathing oscillator (eNeuro, 2018)",
        url: "https://doi.org/10.1523/ENEURO.0130-18.2018",
      },
      {
        text: "Open paper: rhythm cessation after deleting preBötzinger neurons (eNeuro, 2015)",
        url: "https://www.eneuro.org/content/2/4/eneuro.0031-15.2015.abstract",
      },
    ],
    caution:
      "Basic animal research. Experts in this field disagree with each other on the details of the mechanism.",
  },
  {
    id: "kevin-yackle",
    name: "Kevin Yackle",
    role: "Physician-scientist, faculty member",
    institution: "University of California, San Francisco (UCSF); the 2017 work was done at Stanford",
    known:
      "Lead author of a 2017 Science paper, with Mark Krasnow and Jack Feldman, that found a small group of breathing-center neurons linked to arousal in mice.",
    teaches:
      "The breathing circuit is wired to brain areas involved in alertness. This gives one possible biological reason why slow breathing might feel calming.",
    free: [
      {
        text: "Paper: Breathing control center neurons that promote arousal in mice (Science, 2017; free author manuscript)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5505554/",
      },
    ],
    caution:
      "A mouse study. The link to calm in people is an interpretation, not a tested result. The UCSF position came from a UCSF listing that would not load for us, so check it.",
  },
  {
    id: "christina-zelano",
    name: "Christina Zelano",
    role: "Neurology researcher (Department of Neurology at the time of the study)",
    institution: "Northwestern University Feinberg School of Medicine",
    known:
      "Led a 2016 study showing that brain activity in memory and emotion areas follows the breathing cycle, using electrodes in people with epilepsy.",
    teaches:
      "Brain rhythms can be tied to the phase of the breath, and nose breathing may matter for how this happens.",
    free: [
      {
        text: "Paper: Nasal Respiration Entrains Human Limbic Oscillations (J Neuroscience, 2016; free author manuscript)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5148230/",
      },
      {
        text: "ScienceDaily summary of the study",
        url: "https://www.sciencedaily.com/releases/2016/12/161207093034.htm",
      },
    ],
    caution:
      "The study had few participants, all with epilepsy. Faster recognition of fearful faces during inhaling does not show that a breathing exercise changes mood or memory in daily life. Her current title was not checked on a university page.",
  },
  {
    id: "paul-lehrer",
    name: "Paul Lehrer",
    role: "Researcher in psychiatry (Rutgers department, as listed on the paper)",
    institution: "Rutgers Robert Wood Johnson Medical School",
    known:
      "A leading researcher on heart rate variability (HRV) biofeedback, where people breathe at a personal slow rate while watching their heart-rate rhythm.",
    teaches:
      "What HRV biofeedback is, the proposed explanation (training the baroreflex, a blood-pressure reflex), and how the technique grew from earlier work.",
    free: [
      {
        text: "Open review with Richard Gevirtz: Heart rate variability biofeedback, how and why does it work? (Frontiers in Psychology, 2014)",
        url: "https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00756/full",
      },
    ],
    caution:
      "The mechanism is a hypothesis. Trial results are mixed in size and quality. Richard Gevirtz (Alliant International University), his co-author, works in the same area. This is a training method, not a treatment you should start in place of care.",
  },
  {
    id: "alicia-meuret",
    name: "Alicia Meuret",
    role: "Professor of Psychology",
    institution: "Southern Methodist University (SMU)",
    known:
      "Developed and tested capnometry-assisted respiratory training, in which people see their exhaled carbon dioxide while practising breathing, mainly in panic disorder.",
    teaches:
      "Why researchers study carbon dioxide and breathing in anxiety, and how breathing training is tested against standard talk therapy.",
    free: [
      {
        text: "SMU profile",
        url: "https://www.smu.edu/dedman/academics/departments/psychology/people/faculty/meureta",
      },
      {
        text: "SMU news: new treatment for panic and anxiety (2010)",
        url: "https://www.smu.edu/news/archives/2010/alicia-meuret-physorg-20dec2010",
      },
      {
        text: "Paper: Feedback of end-tidal pCO2 as a therapeutic approach for panic disorder (2008; free author manuscript)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2890048/",
      },
    ],
    caution:
      "The trials are small to moderate and run in clinics with equipment. In the 2010 SMU-reported trial the breathing treatment and standard therapy worked about equally well. Not a self-help claim.",
  },
  {
    id: "thomas-ritz",
    name: "Thomas Ritz",
    role: "University Distinguished Professor of Psychology",
    institution: "Southern Methodist University (SMU)",
    known:
      "Studies the psychology and physiology of breathing, including how emotions and stress affect breathing in asthma. Editor-in-Chief of the journal Biological Psychology.",
    teaches:
      "That breathing patterns and carbon dioxide levels differ between people, and that slow breathing and other breathing training can be tested in randomized trials.",
    free: [
      {
        text: "SMU faculty profile",
        url: "https://www.smu.edu/dedman/academics/departments/psychology/people/faculty/ritzt",
      },
      {
        text: "Paper: Capnometry-assisted training vs slow breathing in asthma, a randomized trial (Chest, 2014; free author manuscript)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4219339/",
      },
    ],
    caution:
      "Asthma research is for people with asthma and should be done with their doctor. Do not read it as advice to change breathing in lung disease.",
  },
  {
    id: "sarah-garfinkel",
    name: "Sarah Garfinkel",
    role: "Professor of Neuroscience and Psychiatry",
    institution: "University College London (per Wikipedia); the University of Sussex staff page still lists her at Sussex, so check the current post",
    known:
      "Studies interoception, the sense of signals from inside the body such as the heartbeat, and how it relates to emotion, anxiety and memory.",
    teaches:
      "Accuracy in sensing your heartbeat is different from how confident you feel about it, and both can matter for anxiety.",
    free: [
      {
        text: "University of Sussex staff profile",
        url: "https://www.sussex.ac.uk/profiles/103603",
      },
      {
        text: "Open paper: Interoception and Mental Health, a Roadmap (2018, many authors including Garfinkel and Critchley)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6054486/",
      },
    ],
    caution:
      "Interoception tests (such as heartbeat counting) are debated, and findings in lab groups do not show that training interoception treats a condition.",
  },
  {
    id: "hugo-critchley",
    name: "Hugo Critchley",
    role: "Chair of Psychiatry",
    institution: "Brighton and Sussex Medical School, University of Sussex",
    known:
      "A psychiatrist and neuroscientist who studies how the brain represents the body's internal state, and how this relates to emotion and mental health.",
    teaches:
      "Why feelings and body signals such as heart rate are studied together, and where the evidence is still thin.",
    free: [
      {
        text: "BSMS staff profile",
        url: "https://www.bsms.ac.uk/about/contact-us/staff/professor-hugo-d-critchley.aspx",
      },
      {
        text: "Open paper: Interoception and Mental Health, a Roadmap (2018)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6054486/",
      },
    ],
    caution:
      "Interoception is a broad research field. Much of it is about the heart and gut, not breathing specifically.",
  },
  {
    id: "eddie-weitzberg",
    name: "Eddie Weitzberg",
    role: "Professor, Department of Physiology and Pharmacology",
    institution: "Karolinska Institutet, Sweden",
    known:
      "Studies nitric oxide in the body, including the nitrate-nitrite-nitric oxide pathway. With Jon Lundberg he published on nitric oxide made in the nose and sinuses, including the effect of humming.",
    teaches:
      "Nitric oxide is a real signalling molecule made in the nose and by the body from dietary nitrate, and it is measured in labs.",
    free: [
      { text: "Karolinska Institutet profile", url: "https://ki.se/en/people/eddie-weitzberg" },
      {
        text: "Open paper: Physiological role for nitrate-reducing oral bacteria in blood pressure control (2013)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3605573/",
      },
    ],
    caution:
      "Most of the nitrate work is about diet and mouth bacteria, not breathing. The idea that nose breathing delivers meaningful nitric oxide to the lungs is a hypothesis in popular articles, not an established benefit.",
  },
  {
    id: "jon-lundberg",
    name: "Jon Lundberg",
    role: "Professor, Department of Physiology and Pharmacology",
    institution: "Karolinska Institutet, Sweden",
    known:
      "A nitric oxide researcher whose 1994 paper reported that most nitric oxide in exhaled air comes from the nose, and who has studied the nitrate-nitrite-nitric oxide pathway.",
    teaches:
      "Where nitric oxide in breath comes from and why it is used as a measurement in airway research.",
    free: [
      { text: "Karolinska Institutet profile", url: "https://ki.se/en/people/jon-lundberg" },
      {
        text: "Open paper: Nasal nitric oxide in man (Thorax, 1999)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC1745376/",
      },
      {
        text: "Karolinska news: nitric oxide research and its clinical use (2022)",
        url: "https://news.ki.se/nitrogen-oxide-research-has-resulted-in-surprisingly-few-new-clinical-methods-and-treatments",
      },
    ],
    caution:
      "Lundberg's own 2022 interview notes that this research led to few new treatments. Nasal nitric oxide measurement is not the same as proof that a breathing habit improves health.",
  },
  {
    id: "stephen-porges",
    name: "Stephen Porges",
    role: "Distinguished University Scientist; originator of polyvagal theory",
    institution: "Kinsey Institute, Indiana University",
    known:
      "Proposed polyvagal theory, an account of how the vagus nerve and the autonomic nervous system relate to safety, threat and social connection. It is widely used in therapy and wellness.",
    teaches:
      "Where the language of 'safe', 'fight or flight' and 'shutdown' states in many wellness programs comes from, and why it is worth reading critically.",
    free: [
      { text: "Stephen Porges website", url: "https://www.stephenporges.com" },
      {
        text: "Open paper by Porges: The vagal paradox, a polyvagal solution (2023)",
        url: "https://doi.org/10.1016/j.cpnec.2023.100200",
      },
    ],
    caution:
      "Polyvagal theory is contested. A 2026 paper led by Paul Grossman, co-signed by a large group of autonomic physiologists, argues it does not fit current evidence on the vagus nerve and evolution. Porges is also linked to trainings and devices sold through his own organizations. Treat 'polyvagal' claims in apps as theory, not fact.",
  },
  {
    id: "paul-grossman",
    name: "Paul Grossman",
    role: "Emeritus Research Director, Department of Psychosomatic Medicine",
    institution: "University Hospital Basel, Switzerland",
    known:
      "A psychophysiologist who has published on breathing, heart rate variability and mindfulness, and has long been a critic of polyvagal theory.",
    teaches:
      "How scientists criticize a popular theory, and what the objections to polyvagal claims are.",
    free: [
      {
        text: "Open paper: Why the Polyvagal Theory Is Untenable (Clinical Neuropsychiatry, 2026)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12937499/",
      },
    ],
    caution:
      "Read this alongside Porges's own papers to see both sides. The 2026 critique was written by invitation to experts and is itself a position paper.",
  },
  {
    id: "david-spiegel",
    name: "David Spiegel",
    role: "Willson Professor and Associate Chair of Psychiatry and Behavioral Sciences",
    institution: "Stanford University School of Medicine",
    known:
      "A psychiatrist who studies stress, pain and hypnosis. Senior psychiatry author of a 2023 randomized study comparing short daily breathing practices with mindfulness meditation.",
    teaches:
      "Five minutes a day of one structured breathing practice, cyclic sighing, improved reported mood a little more than mindfulness meditation in that study.",
    free: [
      {
        text: "Stanford Wu Tsai Neurosciences profile",
        url: "https://neuroscience.stanford.edu/people/david-spiegel",
      },
      {
        text: "Open paper: Brief structured respiration practices enhance mood and reduce physiological arousal (Cell Reports Medicine, 2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/",
      },
    ],
    caution:
      "It was a remote, one-month trial in volunteers, so mood was self-reported, and the effects were modest. It does not show a treatment for any condition.",
  },
  {
    id: "andrew-huberman",
    name: "Andrew Huberman",
    role: "Professor of Neurobiology and Ophthalmology; podcast host",
    institution: "Stanford University School of Medicine",
    known:
      "A vision neuroscientist who hosts the Huberman Lab podcast and co-authored the 2023 cyclic-sighing study with David Spiegel's group.",
    teaches:
      "A free long-form audience for how breathing studies are explained to the public, including how the cyclic-sighing paper came about.",
    free: [
      {
        text: "Podcast episode: How to breathe correctly for optimal health, mood, learning and performance (with transcript)",
        url: "https://hubermanlab.com/how-to-breathe-correctly-for-optimal-health-mood-learning-and-performance",
      },
      {
        text: "Open paper he co-authored (Cell Reports Medicine, 2023)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/",
      },
    ],
    caution:
      "His research is on vision, not breathing. The podcast is a commercial media business with sponsors, and he states it is separate from his Stanford role. Podcast claims are broader than the study evidence.",
  },
  {
    id: "james-nestor",
    name: "James Nestor",
    role: "Author and journalist (not a scientist)",
    institution: "Independent",
    known:
      "Wrote the bestseller Breath: The New Science of a Lost Art (2020). Describes himself as an author and journalist and has a self-experiment with nose and mouth breathing described in the book.",
    teaches:
      "Introduces a wide audience to the idea that how we breathe matters, and points to many researchers and ideas to follow up.",
    free: [
      { text: "James Nestor, about page", url: "https://www.mrjamesnestor.com/about" },
      {
        text: "NPR interview transcript: the 'lost art' of breathing",
        url: "https://www.npr.org/transcripts/862963172",
      },
    ],
    caution:
      "A journalist, not a researcher. The book mixes solid science with anecdote and a small self-experiment, and some claims go beyond the evidence. He also sells retreats and audio. Use his book as a reading list, not as proof.",
  },
  {
    id: "patrick-mckeown",
    name: "Patrick McKeown",
    role: "Breathing educator, author, founder of Oxygen Advantage and Buteyko Clinic International",
    institution: "Independent; Buteyko Clinic International and Oxygen Advantage",
    known:
      "Teaches the Buteyko method, a set of breathing exercises that aim to reduce overbreathing, and is author of The Oxygen Advantage.",
    teaches:
      "A popular, nose-focused approach to breathing practice and the BOLT breath-hold test used in his courses.",
    free: [
      { text: "Buteyko Clinic International, about", url: "https://buteykoclinic.com/about" },
      { text: "Oxygen Advantage", url: "https://oxygenadvantage.com" },
    ],
    caution:
      "His qualifications are described by his own organization: he says he trained in Moscow with Konstantin Buteyko. He is not a clinician or a university researcher. He sells courses and certification. Evidence for Buteyko is limited and mostly small asthma trials, so do not use it as a substitute for asthma care.",
  },
  {
    id: "inna-khazan",
    name: "Inna Khazan",
    role: "Clinical psychologist and biofeedback clinician; faculty member",
    institution: "Harvard Medical School (Department of Psychiatry, Cambridge Health Alliance)",
    known:
      "A biofeedback clinician and teacher who works with HRV biofeedback and mindfulness, and co-authors research papers on HRV biofeedback.",
    teaches:
      "How HRV biofeedback is taught in practice and how it compares with mindfulness in a workplace-stress trial.",
    free: [
      {
        text: "Open paper: Comparing HRV-biofeedback and mindfulness for workplace stress reduction (2020)",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7644531/",
      },
    ],
    caution:
      "Her Harvard link is a teaching and supervision role, not a lab. She also writes books and gives paid trainings. We could not open a personal or Harvard profile page, so the role is based on paper affiliations and a search result.",
  },
];

export const SOCIETIES: Array<{ name: string; blurb: string; url: string }> = [
  {
    name: "European Respiratory Society (ERS)",
    blurb:
      "Europe's largest scientific and clinical society in respiratory medicine. The site is aimed at professionals. Its public-facing arm is the European Lung Foundation.",
    url: "https://www.ersnet.org/the-society/",
  },
  {
    name: "American Thoracic Society (ATS)",
    blurb:
      "Professional society for lung, critical care and sleep medicine. Its patient resources page links free fact sheets, including one on breathlessness.",
    url: "https://www.thoracic.org/patients/patient-resources/",
  },
  {
    name: "American Lung Association",
    blurb:
      "US nonprofit with plain-language lung health pages, including breathing exercises such as pursed-lip and belly breathing for people with lung disease.",
    url: "https://www.lung.org/lung-health-diseases/wellness/breathing-exercises",
  },
  {
    name: "NHLBI (US National Heart, Lung, and Blood Institute, NIH)",
    blurb:
      "US government research institute. Free health topic pages for the public, including asthma, COPD and sleep apnea.",
    url: "https://www.nhlbi.nih.gov/health-topics",
  },
  {
    name: "Asthma + Lung UK",
    blurb:
      "UK charity with free information on breathlessness and lung conditions, including how thoughts and breathing interact.",
    url: "https://www.asthmaandlung.org.uk/symptoms-tests-treatments/symptoms/breathlessness",
  },
  {
    name: "Biofeedback Certification International Alliance (BCIA)",
    blurb:
      "Certifies biofeedback practitioners, including in HRV biofeedback, and has a find-a-practitioner tool. Useful for checking someone's credentials.",
    url: "https://www.bcia.org/",
  },
];
