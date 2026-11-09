import type { Dossier, L, NarrationStep, Relation, SpreadLink } from "../../types";
import { nodes } from "./nodes";
import { sources } from "./sources";

const l = (fr: string, en: string): L => ({ fr, en });

let n = 0;
const rel = (from: string, type: Relation["type"], to: string, justification: L, sourceIds: string[]): Relation => ({ id: `r${++n}`, from, to, type, justification, sourceIds });

const relations: Relation[] = [
  // Who governed
  rel("x-decree", "CONTRADICTS", "c-half", l("Un seul commissaire d'origine juive sur quinze.", "A single commissar of Jewish origin out of fifteen."), ["sovnarkom-1917"]),
  rel("x-census", "CONTRADICTS", "c-half", l("5,2 % de membres juifs en 1922 : loin de la moitié.", "5.2% Jewish members in 1922: far from half."), ["jta-1926"]),
  rel("x-census", "SUPPORTS", "c-overrep", l("5,2 % du parti pour environ 1,8 % de la population.", "5.2% of the party for about 1.8% of the population."), ["jta-1926", "census-1926"]),
  rel("p-leaders", "SUPPORTS", "c-overrep", l("Plusieurs dirigeants majeurs étaient d'origine juive.", "Several major leaders were of Jewish origin."), ["hanebrink-2018"]),
  rel("p-sovnarkom", "DOCUMENTS", "p-october", l("Le décret forme le gouvernement issu de la prise du pouvoir.", "The decree forms the government born of the seizure of power."), ["sovnarkom-1917"]),
  rel("p-why", "CONTEXTUALIZES", "c-overrep", l("Explications historiques de la surreprésentation.", "Historical explanations for the overrepresentation."), ["slezkine-2004"]),
  rel("p-party", "SUPPORTS", "c-overrep", l("Statistiques officielles du parti.", "Official party statistics."), ["jta-1926"]),

  // Jews as a people
  rel("x-towns", "CONTRADICTS", "c-jewish", l("Les Juifs des villes ukrainiennes étaient moins souvent communistes que leurs voisins.", "Jews in Ukrainian towns were less often Communists than their neighbours."), ["jta-1926"]),
  rel("x-stalin", "CONTRADICTS", "c-jewish", l("Le pouvoir soviétique a persécuté des Juifs en tant que tels.", "Soviet power persecuted Jews as Jews."), ["jta-1956"]),
  rel("j-religion", "CONTRADICTS", "c-jewish", l("Le régime combat le judaïsme.", "The regime fights Judaism."), ["loc-antireligious"]),
  rel("j-purge", "CONTRADICTS", "c-jewish", l("Staline élimine les dirigeants d'origine juive.", "Stalin eliminates the leaders of Jewish origin."), ["jta-1956"]),
  rel("j-jafc", "CONTRADICTS", "c-jewish", l("Exécution d'écrivains et de responsables juifs en 1952.", "Execution of Jewish writers and officials in 1952."), ["jafc-archive"]),
  rel("j-doctors", "CONTRADICTS", "c-jewish", l("Campagne antisémite de 1953.", "The 1953 antisemitic campaign."), ["jta-1956"]),
  rel("c-overrep", "CONTEXTUALIZES", "c-jewish", l("Une surreprésentation d'individus n'est pas l'action d'un peuple.", "Overrepresentation of individuals is not the action of a people."), ["hanebrink-2018"]),

  // Deaths
  rel("x-snyder", "SUPPORTS", "c-millions", l("Environ 6 à 9 millions de morts sous Staline.", "About 6 to 9 million dead under Stalin."), ["snyder-2011"]),
  rel("x-snyder", "CONTRADICTS", "c-tens", l("Les bilans fondés sur les archives sont inférieurs à « des dizaines de millions ».", "Archive-based totals are below 'tens of millions'."), ["snyder-2011"]),
  rel("v-terror", "SUPPORTS", "c-millions", l("682 691 exécutions en 1937–1938.", "682,691 executions in 1937–1938."), ["snyder-2011"]),
  rel("v-ukraine", "SUPPORTS", "c-millions", l("Plusieurs millions de morts de la famine en Ukraine.", "Several million famine deaths in Ukraine."), ["snyder-2011", "huri-famine"]),
  rel("v-total", "DOCUMENTS", "c-tens", l("Ordres de grandeur actuels des bilans.", "Current orders of magnitude of the tolls."), ["snyder-2011"]),
  rel("x-kazakh", "CONTRADICTS", "c-christians", l("Des victimes majoritairement musulmanes.", "Mostly Muslim victims."), ["snyder-2011"]),
  rel("v-terror", "CONTRADICTS", "c-christians", l("Cibles définies par la classe et la nationalité.", "Targets defined by class and nationality."), ["snyder-2011"]),
  rel("x-churches", "SUPPORTS", "c-church", l("Fermeture de la quasi-totalité des églises orthodoxes.", "Closure of nearly all Orthodox churches."), ["loc-antireligious"]),
  rel("x-churches", "CONTEXTUALIZES", "c-christians", l("Toutes les religions sont persécutées, pas seulement le christianisme.", "All religions are persecuted, not only Christianity."), ["loc-antireligious"]),
  rel("v-churches", "DOCUMENTS", "c-church", l("Les campagnes antireligieuses des années 1920–1930.", "The anti-religious campaigns of the 1920s–1930s."), ["loc-antireligious"]),

  // Myth
  rel("x-pogroms", "SUPPORTS", "c-myth-kills", l("Le « Juif communiste » comme prétexte des pogroms.", "The 'Jewish communist' as pretext for pogroms."), ["lipes-2018"]),
  rel("x-poster", "SUPPORTS", "c-myth-kills", l("Propagande nazie pendant le génocide.", "Nazi propaganda during the genocide."), ["poster-1943"]),
  rel("m-myth", "ORIGINATED_FROM", "p-october", l("Le mythe naît en réaction à la révolution, pendant la guerre civile.", "The myth arises in reaction to the revolution, during the Civil War."), ["hanebrink-2018"]),
  rel("m-myth", "EVOLVED_INTO", "m-nazi", l("Le mythe devient un pilier de l'idéologie nazie.", "The myth becomes a pillar of Nazi ideology."), ["hanebrink-2018", "goebbels-1935"]),
  rel("m-nazi", "EVOLVED_INTO", "m-today", l("Le mythe survit après 1945.", "The myth survives after 1945."), ["hanebrink-2018"]),
  rel("m-protocols", "CONTRADICTS", "m-myth", l("La principale « preuve » du complot est un faux.", "The main 'proof' of the plot is a forgery."), ["times-1921"]),
  rel("m-goebbels", "REFERS_TO", "m-myth", l("Exemple daté de l'usage nazi.", "A dated example of Nazi use."), ["goebbels-1935"]),
  rel("m-churchill", "REFERS_TO", "m-myth", l("Le mythe dans les élites britanniques.", "The myth among the British elite."), ["churchill-1920"]),
  rel("k-consensus", "DERIVED_FROM", "m-myth", l("Synthèse de l'historiographie.", "Synthesis of the historiography."), ["hanebrink-2018"]),

  // Source dependencies
  rel("doc-jta26", "DERIVED_FROM", "doc-census", l("La presse relaie des statistiques officielles.", "The press relays official statistics."), ["jta-1926"]),

  // Open questions
  rel("u-toll", "REFERS_TO", "c-tens", l("Le total dépend du périmètre.", "The total depends on scope."), ["snyder-2011"]),
  rel("u-famine", "REFERS_TO", "v-ukraine", l("Débat sur l'intention.", "Debate on intent."), ["snyder-2011", "huri-famine"]),
  rel("u-why", "REFERS_TO", "p-why", l("Explications discutées.", "Debated explanations."), ["slezkine-2004"]),
  rel("u-pogroms", "REFERS_TO", "m-pogroms", l("Estimations variables.", "Varying estimates."), ["lipes-2018"]),
];

/** How the myth travelled. All links are "proposed" (traced by historians), none "documented" by a single period source. */
const spread: SpreadLink[] = [
  { from: "p-october", to: "m-pogroms", kind: "proposed", note: l("Pendant la guerre civile, l'assimilation des Juifs aux bolcheviks sert de prétexte aux pogroms.", "During the Civil War, equating Jews with Bolsheviks serves as a pretext for pogroms."), sourceIds: ["lipes-2018", "hanebrink-2018"] },
  { from: "p-october", to: "m-budapest", kind: "proposed", note: l("Le mythe structure la contre-révolution hongroise de 1919.", "The myth shapes the 1919 Hungarian counter-revolution."), sourceIds: ["hanebrink-2018"] },
  { from: "p-october", to: "m-warsaw", kind: "proposed", note: l("Diffusion du stéréotype en Pologne pendant la guerre de 1920.", "Spread of the stereotype in Poland during the 1920 war."), sourceIds: ["hanebrink-2018"] },
  { from: "p-october", to: "m-churchill", kind: "proposed", note: l("Le mythe atteint les élites britanniques dès 1920.", "The myth reaches the British elite by 1920."), sourceIds: ["churchill-1920", "hanebrink-2018"] },
  { from: "p-october", to: "m-goebbels", kind: "proposed", note: l("Les émigrés et les « Protocoles » portent le mythe en Allemagne, où les nazis s'en emparent.", "Émigrés and the 'Protocols' carry the myth to Germany, where the Nazis seize on it."), sourceIds: ["hanebrink-2018"] },
];

const narration: NarrationStep[] = [
  {
    focus: "q",
    title: l("1. L'accusation", "1. The accusation"),
    text: l(
      "« Les bolcheviks : un gouvernement à moitié juif, responsable de dizaines de millions de morts chrétiens. » Cette phrase circule encore. Elle contient du vrai et du faux. Démêlons-les.",
      "'The Bolsheviks: a half-Jewish government, responsible for tens of millions of Christian deaths.' This sentence still circulates. It contains truths and falsehoods. Let us untangle them.",
    ),
  },
  {
    focus: "b-power",
    title: l("2. Qui gouvernait ?", "2. Who governed?"),
    text: l(
      "Le 8 novembre 1917, le décret qui forme le premier gouvernement nomme quinze hommes. Un seul est d'origine juive : Trotski. En 1922, les Juifs représentent 5,2 % du parti — plus que leur part de la population (1,8 %), mais très loin de la moitié.",
      "On 8 November 1917, the decree forming the first government names fifteen men. Only one is of Jewish origin: Trotsky. In 1922, Jews make up 5.2% of the party — more than their share of the population (1.8%), but very far from half.",
    ),
  },
  {
    focus: "p-why",
    title: l("3. Une surreprésentation réelle", "3. A real overrepresentation"),
    text: l(
      "Plusieurs dirigeants majeurs étaient d'origine juive. Discriminés sous les tsars, urbains et instruits, des jeunes Juifs ont rejoint les mouvements révolutionnaires. Mais ces militants athées avaient rompu avec le judaïsme, et la grande majorité des Juifs n'étaient pas bolcheviks.",
      "Several major leaders were of Jewish origin. Discriminated against under the tsars, urban and educated, some young Jews joined revolutionary movements. But these atheist militants had broken with Judaism, and the vast majority of Jews were not Bolsheviks.",
    ),
  },
  {
    focus: "b-victims",
    title: l("4. Les victimes", "4. The victims"),
    text: l(
      "Le régime soviétique a tué des millions de personnes : environ 6 à 9 millions sous Staline selon les archives — pas des dizaines de millions. Les victimes étaient de toutes confessions : paysans ukrainiens, Kazakhs musulmans, Polonais, prêtres orthodoxes, rabbins.",
      "The Soviet regime killed millions: about 6 to 9 million under Stalin according to the archives — not tens of millions. The victims were of every faith: Ukrainian peasants, Muslim Kazakhs, Poles, Orthodox priests, rabbis.",
    ),
  },
  {
    focus: "b-jews",
    title: l("5. Les Juifs aussi persécutés", "5. Jews persecuted too"),
    text: l(
      "Le régime combat le judaïsme. Staline fait exécuter Zinoviev et Kamenev, assassiner Trotski, fusiller des écrivains yiddish en 1952, et invente en 1953 un « complot des médecins juifs ». Le « gouvernement juif » de l'accusation n'a jamais existé.",
      "The regime fights Judaism. Stalin has Zinoviev and Kamenev shot, Trotsky assassinated, Yiddish writers executed in 1952, and in 1953 invents a 'Jewish doctors' plot'. The accusation's 'Jewish government' never existed.",
    ),
  },
  {
    focus: "b-myth",
    title: l("6. Un mythe meurtrier", "6. A deadly myth"),
    text: l(
      "Né dans la propagande blanche en 1918, le mythe du « judéo-bolchevisme » justifie des pogroms qui tuent des dizaines de milliers de Juifs, puis devient un pilier de la propagande nazie et de la Shoah. Il circule encore aujourd'hui — sous la forme même de la phrase de départ.",
      "Born in White propaganda in 1918, the myth of 'Judeo-Bolshevism' justifies pogroms that kill tens of thousands of Jews, then becomes a pillar of Nazi propaganda and of the Holocaust. It still circulates today — in the very form of the opening sentence.",
    ),
  },
];

export const judeoBolchevisme: Dossier = {
  slug: "judeo-bolchevisme",
  rootId: "q",
  title: l("Bolcheviks, 1917", "Bolsheviks, 1917"),
  period: l("1917 – 1953", "1917 – 1953"),
  timeline: { min: 1915, max: 1956, ticks: [1917, 1920, 1925, 1930, 1935, 1940, 1945, 1950, 1955] },
  accusation: l(
    "« Les bolcheviks : un gouvernement à moitié juif, un mouvement politique responsable de dizaines de millions de morts chrétiens. »",
    "'The Bolsheviks: a half-Jewish government, a political movement responsible for tens of millions of Christian deaths.'",
  ),
  intro: l(
    "Deuxième dossier d'ORIGINES : ce que disent vraiment les sources sur le pouvoir bolchevik, ses victimes, et le mythe du « judéo-bolchevisme ».",
    "ORIGINES' second dossier: what the sources actually say about Bolshevik power, its victims, and the myth of 'Judeo-Bolshevism'.",
  ),
  updated: "2026-11-09",
  nodes,
  relations,
  sources,
  spread,
  narration,
};
