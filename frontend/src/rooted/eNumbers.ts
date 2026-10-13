/**
 * What the common E-numbers ARE, for additives we haven't reviewed for health yet.
 * Only names, what each is for, and where it comes from. No health claims live here:
 * those need a source, and go in additivesContent.ts.
 *
 * Format per line: code | name | what it is for | note (optional; where it comes from) | also called (optional, comma separated)
 */
const TABLE = `
e100|Curcumin|Colour (yellow)|From turmeric|turmeric extract
e101|Riboflavin|Colour (yellow)|Vitamin B2|
e102|Tartrazine|Colour (yellow)||
e104|Quinoline yellow|Colour (yellow)||
e110|Sunset yellow FCF|Colour (orange)||
e120|Carmine|Colour (red)|Made from cochineal insects, so not vegetarian or vegan|cochineal, carminic acid
e122|Carmoisine|Colour (red)||azorubine
e123|Amaranth|Colour (red)||
e124|Ponceau 4R|Colour (red)||
e127|Erythrosine|Colour (red)||
e129|Allura red AC|Colour (red)||
e131|Patent blue V|Colour (blue)||
e132|Indigo carmine|Colour (blue)||indigotine
e133|Brilliant blue FCF|Colour (blue)||
e140|Chlorophylls|Colour (green)|From plants|chlorophyll
e141|Copper chlorophyllins|Colour (green)|From plants|chlorophyllin
e142|Green S|Colour (green)||
e150a|Plain caramel|Colour (brown)||
e153|Vegetable carbon|Colour (black)|From plant material|
e160a|Carotenes|Colour (orange)|From plants or made in a lab|beta-carotene
e160b|Annatto|Colour (orange)|From annatto seeds|annatto, bixin, norbixin
e160c|Paprika extract|Colour (red)|From peppers|paprika oleoresin, capsanthin
e160d|Lycopene|Colour (red)|From tomatoes|
e160e|Beta-apo-8'-carotenal|Colour (orange)||
e161b|Lutein|Colour (yellow)|From marigold|
e162|Beetroot red|Colour (red)|From beets|betanin
e163|Anthocyanins|Colour (red to purple)|From fruit and vegetables|
e170|Calcium carbonate|Colour (white), acidity regulator|From chalk or limestone|chalk
e171|Titanium dioxide|Colour (white)||
e172|Iron oxides|Colour (brown, red, black)||iron oxide
e200|Sorbic acid|Preservative||
e202|Potassium sorbate|Preservative||
e203|Calcium sorbate|Preservative||
e210|Benzoic acid|Preservative||
e211|Sodium benzoate|Preservative||
e212|Potassium benzoate|Preservative||
e220|Sulfur dioxide|Preservative and antioxidant||sulphur dioxide
e223|Sodium metabisulfite|Preservative and antioxidant||sodium metabisulphite
e224|Potassium metabisulfite|Preservative and antioxidant||
e234|Nisin|Preservative|Made by bacteria during fermentation|
e235|Natamycin|Preservative (antifungal)|Made by bacteria during fermentation|pimaricin
e249|Potassium nitrite|Preservative (curing)||
e250|Sodium nitrite|Preservative (curing)||
e251|Sodium nitrate|Preservative (curing)||
e252|Potassium nitrate|Preservative (curing)||saltpetre
e260|Acetic acid|Acidity regulator|The acid in vinegar|vinegar
e262|Sodium acetates|Preservative, acidity regulator||sodium diacetate
e270|Lactic acid|Acidity regulator||
e280|Propionic acid|Preservative||
e281|Sodium propionate|Preservative||
e282|Calcium propionate|Preservative (bread and baked goods)||
e290|Carbon dioxide|Gas (fizz)||carbonated
e296|Malic acid|Acidity regulator||
e297|Fumaric acid|Acidity regulator||
e300|Ascorbic acid|Antioxidant|Vitamin C|vitamin c
e301|Sodium ascorbate|Antioxidant|A form of vitamin C|
e306|Tocopherols|Antioxidant|Vitamin E|mixed tocopherols
e307|Alpha-tocopherol|Antioxidant|Vitamin E|
e315|Erythorbic acid|Antioxidant||isoascorbic acid
e316|Sodium erythorbate|Antioxidant||
e320|Butylated hydroxyanisole|Antioxidant (preservative)||bha
e321|Butylated hydroxytoluene|Antioxidant (preservative)||bht
e322|Lecithins|Emulsifier|From soy, sunflower or egg|lecithin, soy lecithin
e325|Sodium lactate|Acidity regulator, preservative||
e327|Calcium lactate|Acidity regulator||
e330|Citric acid|Acidity regulator||
e331|Sodium citrates|Acidity regulator||
e332|Potassium citrates|Acidity regulator||
e333|Calcium citrates|Acidity regulator||
e334|Tartaric acid|Acidity regulator||
e336|Potassium tartrates|Acidity regulator||cream of tartar
e338|Phosphoric acid|Acidity regulator||
e339|Sodium phosphates|Acidity regulator, emulsifier||
e340|Potassium phosphates|Acidity regulator, emulsifier||
e341|Calcium phosphates|Raising agent, anti-caking agent||
e385|Calcium disodium EDTA|Preservative, antioxidant||edta
e401|Sodium alginate|Thickener|From brown seaweed|alginate
e405|Propylene glycol alginate|Thickener, emulsifier|From brown seaweed|
e406|Agar|Gelling agent|From red seaweed|agar agar
e407|Carrageenan|Thickener, gelling agent|From red seaweed|
e407a|Processed eucheuma seaweed|Thickener, gelling agent|From red seaweed|
e410|Locust bean gum|Thickener|From carob seeds|carob gum
e412|Guar gum|Thickener|From guar beans|
e413|Tragacanth|Thickener|From a plant resin|
e414|Gum arabic|Thickener, emulsifier|From acacia trees|acacia gum
e415|Xanthan gum|Thickener|Made by fermenting sugar|
e416|Karaya gum|Thickener|From a tree resin|
e417|Tara gum|Thickener|From tara seeds|
e418|Gellan gum|Gelling agent|Made by fermentation|
e420|Sorbitol|Sweetener (sugar alcohol), humectant||
e421|Mannitol|Sweetener (sugar alcohol)||
e422|Glycerol|Humectant, sweetener|From plants or animal fat|glycerin, glycerine
e425|Konjac|Thickener|From the konjac plant|glucomannan
e426|Soybean hemicellulose|Thickener|From soy|
e440|Pectins|Gelling agent|From fruit|pectin
e441|Gelatine|Gelling agent|From animal skin and bones, so not vegetarian or vegan|gelatin
e450|Diphosphates|Raising agent, emulsifier||
e451|Triphosphates|Emulsifier, stabiliser||
e452|Polyphosphates|Emulsifier, stabiliser||
e460|Cellulose|Bulking agent, anti-caking agent|From plant fibre|microcrystalline cellulose
e461|Methylcellulose|Thickener, emulsifier|From plant fibre|
e463|Hydroxypropyl cellulose|Thickener, emulsifier|From plant fibre|
e464|Hydroxypropyl methylcellulose|Thickener, emulsifier|From plant fibre|hpmc
e466|Carboxymethylcellulose|Thickener, emulsifier|From plant fibre|cellulose gum, cmc
e471|Mono- and diglycerides of fatty acids|Emulsifier|From plant or animal fats|monoglycerides, diglycerides
e472a|Acetic acid esters of mono- and diglycerides|Emulsifier||
e472e|DATEM|Emulsifier (dough improver)||diacetyl tartaric acid esters
e473|Sucrose esters of fatty acids|Emulsifier||
e475|Polyglycerol esters of fatty acids|Emulsifier||
e476|Polyglycerol polyricinoleate|Emulsifier (chocolate)||pgpr
e481|Sodium stearoyl lactylate|Emulsifier (dough improver)||
e491|Sorbitan monostearate|Emulsifier||
e492|Sorbitan tristearate|Emulsifier||
e500|Sodium carbonates|Raising agent, acidity regulator||baking soda, sodium bicarbonate
e501|Potassium carbonates|Acidity regulator||
e503|Ammonium carbonates|Raising agent||
e504|Magnesium carbonates|Anti-caking agent||
e507|Hydrochloric acid|Acidity regulator||
e508|Potassium chloride|Salt substitute, gelling agent||
e509|Calcium chloride|Firming agent||
e511|Magnesium chloride|Firming agent||
e516|Calcium sulfate|Firming agent, flour treatment||
e524|Sodium hydroxide|Acidity regulator||
e551|Silicon dioxide|Anti-caking agent||silica
e553b|Talc|Anti-caking agent, glazing agent||
e570|Fatty acids|Anti-foaming agent, glazing agent||stearic acid
e575|Glucono delta-lactone|Acidity regulator, raising agent||gdl
e621|Monosodium glutamate|Flavour enhancer||msg
e627|Disodium guanylate|Flavour enhancer||
e631|Disodium inosinate|Flavour enhancer||
e635|Disodium 5'-ribonucleotides|Flavour enhancer||
e901|Beeswax|Glazing agent|Made by bees, so not vegan|
e903|Carnauba wax|Glazing agent|From palm leaves|
e904|Shellac|Glazing agent|A resin from lac insects, so not vegetarian or vegan|
e920|L-cysteine|Flour treatment agent|Can come from feathers, hair or be made in a lab|
e941|Nitrogen|Packaging gas||
e950|Acesulfame K|Sweetener|Made in a lab|acesulfame potassium, acesulfame
e951|Aspartame|Sweetener|Made in a lab|
e952|Cyclamic acid|Sweetener|Made in a lab|cyclamate
e953|Isomalt|Sweetener (sugar alcohol)||
e954|Saccharin|Sweetener|Made in a lab|
e955|Sucralose|Sweetener|Made from sugar|
e957|Thaumatin|Sweetener, flavour enhancer|From a fruit|
e959|Neohesperidine DC|Sweetener, flavour enhancer||
e960|Steviol glycosides|Sweetener|From stevia leaves|stevia
e961|Neotame|Sweetener|Made in a lab|
e965|Maltitol|Sweetener (sugar alcohol)||
e966|Lactitol|Sweetener (sugar alcohol)||
e967|Xylitol|Sweetener (sugar alcohol)||
e968|Erythritol|Sweetener (sugar alcohol)||
e969|Advantame|Sweetener|Made in a lab|
e999|Quillaia extract|Foaming agent|From a tree bark|
e1200|Polydextrose|Bulking agent, sweetener||
e1404|Oxidised starch|Thickener|Modified starch|
e1412|Distarch phosphate|Thickener|Modified starch|
e1414|Acetylated distarch phosphate|Thickener|Modified starch|
e1422|Acetylated distarch adipate|Thickener|Modified starch|
e1442|Hydroxypropyl distarch phosphate|Thickener|Modified starch|
e1450|Starch sodium octenyl succinate|Emulsifier, thickener|Modified starch|
e1520|Propylene glycol|Humectant, solvent||
`;

export interface ENumber {
  code: string;
  name: string;
  does: string;
  note?: string;
  aka: string[];
}

export const E_NUMBERS: ENumber[] = TABLE.trim()
  .split("\n")
  .map((line) => {
    const [code, name, does, note, aka] = line.split("|");
    return { code, name, does, note: note || undefined, aka: (aka ?? "").split(",").map((s) => s.trim()).filter(Boolean) };
  });

const BY_CODE = new Map(E_NUMBERS.map((e) => [e.code, e]));

/** What an E-number is. Returns undefined for numbers not in the table. */
export function eNumber(code: string): ENumber | undefined {
  return BY_CODE.get(code.toLowerCase());
}

/** Codes whose reviews we share with a close relative: EFSA looked at them together. */
export const SAME_REVIEW: Record<string, string> = { e407a: "e407" };
