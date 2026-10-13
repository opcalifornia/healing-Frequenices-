import type { Strength } from "../learn/brainContent";
import type { Source } from "./pantryContent";

/**
 * Earth & Give Back: why giving and nature help wellbeing, vetted places to give,
 * small footprint habits, and local ways to help.
 *
 * Rules for this file:
 * - Observational findings are labelled as associations, not proof.
 * - No invented charity ratings. We point people to Charity Navigator and GiveWell.
 * - Footprint habits get honest, relative impact framing ("bigger", "smaller")
 *   instead of precise numbers we can't stand behind for every household.
 */

export interface WhyFinding {
  id: string;
  title: string;
  body: string;
  doThis: string;
  rating: Strength;
  hue: number;
  source?: Source;
}

export const WHY: WhyFinding[] = [
  {
    id: "volunteer", title: "Volunteering and long-term health", rating: "Mixed", hue: 130,
    body: "In large observational studies, people who volunteer report less depression, higher life satisfaction, and have lower mortality than people who don't. But healthier, wealthier people are also more likely to volunteer, and the few randomized trials haven't clearly shown the same benefits. So: a real, consistent association, with cause and effect still uncertain.",
    doThis: "Pick something you'd enjoy doing anyway, with people you like. Regular, modest commitments (an hour or two a week) are the pattern most studies looked at.",
    source: { text: "Jenkinson CE et al. Is volunteering a public health intervention? A systematic review and meta-analysis. BMC Public Health, 2013", url: "https://doi.org/10.1186/1471-2458-13-773" },
  },
  {
    id: "prosocial", title: "Spending on others", rating: "Moderate", hue: 45,
    body: "In a well-known set of studies, people who were randomly asked to spend a small amount of money on someone else were happier by the end of the day than those asked to spend it on themselves. The effect has been seen across many countries, though later replications suggest it's smaller than first reported.",
    doThis: "Small, personal and visible works best: buy a coffee for a friend, or give to a cause where you can see what your gift does.",
    source: { text: "Dunn EW, Aknin LB, Norton MI. Spending money on others promotes happiness. Science, 2008", url: "https://doi.org/10.1126/science.1150952" },
  },
  {
    id: "nature-time", title: "Time in nature", rating: "Moderate", hue: 160,
    body: "In a study of nearly 20,000 people in England, those who spent at least 120 minutes a week in nature were more likely to report good health and wellbeing. It didn't matter whether that came in one visit or several short ones. This is an association, not proof, but it fits a wide body of research on green space and mood.",
    doThis: "Aim for about two hours a week outdoors in green or blue space: a park, a trail, a beach, a tree-lined street.",
    source: { text: "White MP et al. Spending at least 120 minutes a week in nature is associated with good health and wellbeing. Scientific Reports, 2019", url: "https://doi.org/10.1038/s41598-019-44097-3" },
  },
  {
    id: "connected", title: "Feeling connected to nature", rating: "Moderate", hue: 190,
    body: "A meta-analysis found that people who feel more connected to the natural world tend to be happier. The link is small but consistent. People who feel connected to nature also tend to take more care of it.",
    doThis: "Notice it on purpose: the birds near your home, the season's first blossoms, the phase of the moon. Citizen science apps make noticing a habit.",
    source: { text: "Capaldi CA, Dopko RL, Zelenski JM. The relationship between nature connectedness and happiness: a meta-analysis. Frontiers in Psychology, 2014", url: "https://doi.org/10.3389/fpsyg.2014.00976" },
  },
  {
    id: "action", title: "Action as an antidote to worry", rating: "Weak", hue: 100,
    body: "Many people feel anxious about climate and the environment. Early research suggests that taking concrete action, especially together with others, may help people cope better than worrying alone. The evidence here is still young.",
    doThis: "Turn worry into one small, regular action, and do it with others when you can. If worry is overwhelming your days, talk to someone you trust or a professional.",
  },
];

/* ---------------------------------------------------------------- give */

export type Cause = "wildlife" | "oceans" | "trees" | "water" | "mental" | "food" | "poverty";

export const CAUSE_LABEL: Record<Cause, string> = {
  wildlife: "Wildlife & habitat",
  oceans: "Oceans",
  trees: "Trees & forests",
  water: "Clean water",
  mental: "Mental health",
  food: "Food security",
  poverty: "Direct giving",
};

export const CAUSE_HUE: Record<Cause, number> = { wildlife: 120, oceans: 200, trees: 140, water: 190, mental: 270, food: 30, poverty: 50 };

export interface Org {
  id: string;
  name: string;
  cause: Cause;
  url: string;
  what: string;
}

/** Well-known, long-standing nonprofits. Ratings change, so we link to the raters rather than quote numbers. */
export const ORGS: Org[] = [
  { id: "tnc", name: "The Nature Conservancy", cause: "wildlife", url: "https://www.nature.org/", what: "Protects land and water around the world, working with communities, governments and landowners." },
  { id: "wwf", name: "World Wildlife Fund (WWF)", cause: "wildlife", url: "https://www.worldwildlife.org/", what: "Conservation of wildlife and the habitats they depend on, in around 100 countries." },
  { id: "rainforest-trust", name: "Rainforest Trust", cause: "wildlife", url: "https://www.rainforesttrust.org/", what: "Buys and protects threatened tropical forest, working through local partner organizations." },
  { id: "ocean-conservancy", name: "Ocean Conservancy", cause: "oceans", url: "https://oceanconservancy.org/", what: "Ocean protection and trash-free seas. Runs the International Coastal Cleanup each year." },
  { id: "oceana", name: "Oceana", cause: "oceans", url: "https://oceana.org/", what: "Campaigns for policies that protect and restore ocean life and fisheries." },
  { id: "arbor-day", name: "Arbor Day Foundation", cause: "trees", url: "https://www.arborday.org/", what: "Plants trees in forests and communities, and supports urban tree programs." },
  { id: "one-tree", name: "One Tree Planted", cause: "trees", url: "https://onetreeplanted.org/", what: "Funds reforestation projects with partners around the world." },
  { id: "charity-water", name: "charity: water", cause: "water", url: "https://www.charitywater.org/", what: "Funds clean water projects in low-income countries and reports back on each project." },
  { id: "water-org", name: "Water.org", cause: "water", url: "https://water.org/", what: "Helps families get access to safe water and sanitation through small, affordable loans." },
  { id: "nami", name: "NAMI", cause: "mental", url: "https://www.nami.org/", what: "The National Alliance on Mental Illness: education, support groups and advocacy across the US." },
  { id: "crisis-text-line", name: "Crisis Text Line", cause: "mental", url: "https://www.crisistextline.org/", what: "Free, 24/7 text support for people in crisis. You can also train to volunteer as a crisis counselor." },
  { id: "afsp", name: "American Foundation for Suicide Prevention", cause: "mental", url: "https://afsp.org/", what: "Research, education and support for people affected by suicide." },
  { id: "feeding-america", name: "Feeding America", cause: "food", url: "https://www.feedingamerica.org/", what: "A national network of food banks. You can find and volunteer at your local one." },
  { id: "wfp-usa", name: "World Food Program USA", cause: "food", url: "https://www.wfpusa.org/", what: "Supports the UN World Food Programme's emergency food aid around the world." },
  { id: "givedirectly", name: "GiveDirectly", cause: "poverty", url: "https://www.givedirectly.org/", what: "Sends cash directly to people living in poverty, who decide what they need most. Widely studied in randomized trials." },
];

export const RATERS: Source[] = [
  { text: "Charity Navigator: look up ratings and financials", url: "https://www.charitynavigator.org/" },
  { text: "GiveWell: in-depth research on cost-effective charities", url: "https://www.givewell.org/" },
];

export const GIVE_TIPS = [
  "Check a charity's current rating and financials on Charity Navigator before giving. Ratings change over time.",
  "If you want the most measurable impact per dollar, GiveWell publishes detailed research on its top charities.",
  "Give directly through the organization's own website, and be wary of unsolicited calls, texts or social posts asking for donations.",
  "Time counts too. Many of these organizations have local volunteer programs.",
];

/* ---------------------------------------------------------------- habits */

export type Impact = "Bigger" | "Medium" | "Smaller";

export interface Habit {
  id: string;
  name: string;
  short: string;
  impact: Impact;
  hue: number;
  why: string;
  start: string;
  bonus?: string;
  source?: Source;
}

/**
 * Impact is relative and rough. It depends hugely on where you live and what you
 * do now. "Bigger" means research consistently puts it among the more meaningful
 * personal choices; "Smaller" means helpful, but not a big climate lever on its own.
 */
export const HABITS: Habit[] = [
  {
    id: "plants", name: "Eat more plants", short: "Swap some meat, especially beef, for beans, lentils and grains", impact: "Bigger", hue: 110,
    why: "Food is a large share of global emissions, and beef and lamb have by far the largest footprints per gram of protein. Project Drawdown ranks plant-rich diets among the most impactful climate solutions, and the IPCC notes diet shifts as a meaningful demand-side option.",
    start: "Try one or two plant-based dinners a week, or swap beef for chicken, beans or lentils in a favorite recipe.",
    bonus: "Diets rich in vegetables, legumes and whole grains are linked with better heart health.",
    source: { text: "Poore J, Nemecek T. Reducing food's environmental impacts through producers and consumers. Science, 2018", url: "https://doi.org/10.1126/science.aaq0216" },
  },
  {
    id: "waste", name: "Waste less food", short: "Plan meals, use leftovers, freeze extras", impact: "Bigger", hue: 35,
    why: "Food that's grown, shipped and then thrown away wastes all the energy, water and land that went into it, and rotting food in landfills releases methane. The UN Environment Programme estimates food loss and waste is linked to roughly 8 to 10% of global greenhouse gas emissions. Project Drawdown ranks reducing food waste among its top solutions.",
    start: "Shop with a list, eat the oldest food first, and freeze bread, fruit and leftovers before they turn.",
    bonus: "It saves money, too.",
    source: { text: "Project Drawdown: Reduced food waste", url: "https://drawdown.org/solutions/reduced-food-waste" },
  },
  {
    id: "trips", name: "Walk or bike short trips", short: "Leave the car for trips under a mile or two", impact: "Medium", hue: 190,
    why: "Transportation is the largest source of greenhouse gas emissions in the US, according to the EPA, and most of that comes from cars and trucks. Short car trips are also the least efficient, because engines run cold.",
    start: "Pick one regular short trip, like the corner shop, school drop-off or a coffee run, and walk or bike it.",
    bonus: "It's exercise you don't have to schedule. See the Move section.",
    source: { text: "US EPA: Sources of Greenhouse Gas Emissions", url: "https://www.epa.gov/ghgemissions/sources-greenhouse-gas-emissions" },
  },
  {
    id: "fly", name: "Fly a little less", short: "Choose a train, a closer trip, or a video call when you can", impact: "Bigger", hue: 220,
    why: "For people who fly, flights are often one of the largest single parts of their personal footprint. One long-haul round trip can outweigh many small everyday habits.",
    start: "Next time, consider a train for shorter distances, or one longer trip instead of several short ones.",
  },
  {
    id: "energy", name: "Tune your home energy", short: "LED bulbs, a degree or two on the thermostat, seal drafts", impact: "Medium", hue: 50,
    why: "Heating, cooling and electricity at home are a meaningful share of household emissions. LED bulbs use far less energy than incandescent ones, and small thermostat changes add up over a season.",
    start: "Swap your most-used bulbs to LED, and set the thermostat a little cooler in winter and warmer in summer.",
    source: { text: "ENERGY STAR (EPA): Save energy at home", url: "https://www.energystar.gov/" },
  },
  {
    id: "line-dry", name: "Line-dry laundry", short: "Air-dry some loads instead of using the dryer", impact: "Smaller", hue: 200,
    why: "Clothes dryers are among the more energy-hungry appliances in many homes. Air-drying saves that energy and is gentler on fabrics, so clothes last longer.",
    start: "Air-dry one load a week on a rack or line. Towels and sheets are the easiest start.",
  },
  {
    id: "cold-wash", name: "Wash in cold water", short: "Use cold for everyday loads", impact: "Smaller", hue: 210,
    why: "Most of the energy a washing machine uses goes to heating the water. Modern detergents clean well in cold water for everyday loads.",
    start: "Switch the default setting to cold. Save hot water for heavily soiled or sanitizing loads.",
  },
  {
    id: "keep", name: "Buy less, keep things longer", short: "Repair, borrow, buy secondhand", impact: "Medium", hue: 25,
    why: "Making new things, especially electronics and clothing, takes energy and materials. Using what you already own for longer is one of the simplest ways to cut that.",
    start: "Before buying something new, ask: can I repair, borrow or buy it secondhand?",
  },
  {
    id: "reuse", name: "Carry a bottle and bag", short: "Reusables instead of single-use plastic", impact: "Smaller", hue: 175,
    why: "Honestly, the climate effect is small. But it does cut plastic litter, which harms wildlife and waterways, and it's an easy daily reminder that your choices matter.",
    start: "Keep a bottle and a folded bag by the door or in your car.",
  },
];

export const IMPACT_NOTE = "Impact labels are rough and relative. They depend on where you live and what you do now. \"Bigger\" means research consistently ranks it among the more meaningful personal choices. Systemic changes, like clean energy and better policy, matter most of all, so voting, speaking up and supporting good organizations count too.";

/* ---------------------------------------------------------------- local */

export interface LocalAction {
  id: string;
  title: string;
  body: string;
  hue: number;
  links: Source[];
}

export const LOCAL: LocalAction[] = [
  { id: "volunteer", title: "Volunteer near you", hue: 130, body: "Food banks, animal shelters, parks, libraries, tutoring. Search by cause and by how much time you have.", links: [{ text: "VolunteerMatch", url: "https://www.volunteermatch.org/" }, { text: "Find your local food bank", url: "https://www.feedingamerica.org/find-your-local-foodbank" }] },
  { id: "cleanup", title: "Join a cleanup", hue: 200, body: "Beach, river and park cleanups are a satisfying few hours outside. Bring gloves, a bag and a friend.", links: [{ text: "International Coastal Cleanup", url: "https://oceanconservancy.org/trash-free-seas/international-coastal-cleanup/" }, { text: "Keep America Beautiful", url: "https://kab.org/" }] },
  { id: "garden", title: "Grow with neighbors", hue: 100, body: "Community gardens share land, tools and know-how. Many donate part of their harvest to food pantries.", links: [{ text: "American Community Gardening Association", url: "https://www.communitygarden.org/" }] },
  { id: "inat", title: "Record the life around you", hue: 160, body: "Snap a photo of a plant, bug or bird and iNaturalist helps you identify it. Your sightings become data that scientists use.", links: [{ text: "iNaturalist", url: "https://www.inaturalist.org/" }] },
  { id: "ebird", title: "Count birds", hue: 50, body: "eBird, from the Cornell Lab of Ornithology, turns your birdwatching into data used for research and conservation. Even 10 minutes at a window counts.", links: [{ text: "eBird", url: "https://ebird.org/" }] },
  { id: "zooniverse", title: "Do science from your couch", hue: 260, body: "Help researchers classify wildlife camera photos, galaxies and more, right from your browser.", links: [{ text: "Zooniverse", url: "https://www.zooniverse.org/" }] },
];

/** Quick ideas for the good deeds journal. */
export const DEED_IDEAS = [
  "Picked up litter on my walk",
  "Checked in on a neighbor",
  "Cooked a plant-based dinner",
  "Donated to a cause I care about",
  "Logged a bird or plant sighting",
  "Walked instead of driving",
];

export const EARTH_SOURCES: Source[] = [
  { text: "Jenkinson CE et al. Volunteering systematic review. BMC Public Health, 2013", url: "https://doi.org/10.1186/1471-2458-13-773" },
  { text: "Dunn EW et al. Spending money on others promotes happiness. Science, 2008", url: "https://doi.org/10.1126/science.1150952" },
  { text: "White MP et al. 120 minutes a week in nature. Scientific Reports, 2019", url: "https://doi.org/10.1038/s41598-019-44097-3" },
  { text: "Capaldi CA et al. Nature connectedness and happiness. Frontiers in Psychology, 2014", url: "https://doi.org/10.3389/fpsyg.2014.00976" },
  { text: "Poore J, Nemecek T. Reducing food's environmental impacts. Science, 2018", url: "https://doi.org/10.1126/science.aaq0216" },
  { text: "Project Drawdown: Climate solutions", url: "https://drawdown.org/solutions" },
  { text: "IPCC Sixth Assessment Report, Working Group III: Mitigation", url: "https://www.ipcc.ch/report/ar6/wg3/" },
  { text: "US EPA: Sources of Greenhouse Gas Emissions", url: "https://www.epa.gov/ghgemissions/sources-greenhouse-gas-emissions" },
];
