import type { Dossier, L, NarrationStep, Relation, SpreadLink } from "../../types";
import { nodes } from "./nodes";
import { sources } from "./sources";

const l = (fr: string, en: string): L => ({ fr, en });

let n = 0;
const rel = (from: string, type: Relation["type"], to: string, justification: L, sourceIds: string[]): Relation => ({
  id: `r${++n}`,
  from,
  to,
  type,
  justification,
  sourceIds,
});

const relations: Relation[] = [
  // Origins
  rel("s-ritual", "ORIGINATED_FROM", "o-death", l("La forme « meurtre rituel » de l'accusation naît du récit construit autour de cette mort.", "The 'ritual murder' form of the accusation is born of the narrative built around this death."), ["langmuir-1984", "rose-2015"]),
  rel("o-vita", "DOCUMENTS", "o-death", l("La Vie et Passion est le seul récit détaillé de la mort de Guillaume.", "The Life and Passion is the only detailed account of William's death."), ["thomas-vita"]),
  rel("o-thomas", "REFERS_TO", "o-vita", l("Thomas de Monmouth est l'auteur du texte.", "Thomas of Monmouth is the author of the text."), ["thomas-vita"]),
  rel("o-vita", "DOCUMENTS", "o-sheriff", l("L'épisode n'est connu que par le récit de Thomas.", "The episode is known only through Thomas's account."), ["thomas-vita"]),
  rel("o-novers", "CONTEXTUALIZES", "c-accused-1144", l("Selon Rose, l'accusation prend forme dans le cadre de ce procès.", "According to Rose, the accusation takes shape in the context of this trial."), ["rose-2015"]),
  rel("o-context", "CONTEXTUALIZES", "o-death", l("Guerre civile, croisade et endettement forment l'arrière-plan de l'affaire.", "Civil war, crusade and debt form the background of the case."), ["rose-2015"]),
  rel("o-william", "REFERS_TO", "o-death", l("Guillaume est la victime.", "William is the victim."), ["thomas-vita"]),

  // Evidence → claims
  rel("x-vita", "SUPPORTS", "c-circulated", l("Le manuscrit atteste l'existence de l'accusation vers 1150.", "The manuscript attests the accusation existed around 1150."), ["thomas-vita"]),
  rel("x-peterborough", "SUPPORTS", "c-circulated", l("La chronique atteste la diffusion du récit vers 1155.", "The chronicle attests the story had spread by c. 1155."), ["peterborough-chronicle"]),
  rel("x-vita", "SUPPORTS", "c-killed-by-jews", l("Thomas l'affirme — mais c'est une affirmation partisane et tardive, pas une preuve.", "Thomas asserts it — but this is a partisan and late assertion, not proof."), ["thomas-vita"]),
  rel("x-sheriff", "SUPPORTS", "c-accused-1144", l("Le refus du shérif suppose qu'une accusation avait été portée.", "The sheriff's refusal implies that an accusation had been made."), ["thomas-vita"]),
  rel("x-testimonies", "SUPPORTS", "c-killed-by-jews", l("Seuls éléments avancés à l'appui, de très faible valeur probante.", "The only elements put forward in support, of very weak probative value."), ["thomas-vita"]),
  rel("v-james", "CONTRADICTS", "c-killed-by-jews", l("M. R. James juge les témoignages de Thomas fabriqués ou manipulés.", "M. R. James judges Thomas's testimonies fabricated or manipulated."), ["jessopp-james-1896"]),
  rel("v-james", "CONTRADICTS", "c-crucifixion", l("Pour James, la dimension rituelle n'apparaît qu'après les propos de Théobald.", "For James, the ritual dimension only appears after Theobald's statements."), ["jessopp-james-1896"]),
  rel("v-langmuir", "CONTRADICTS", "c-crucifixion", l("Langmuir montre que le motif rituel est une construction de Thomas.", "Langmuir shows the ritual motif is Thomas's construction."), ["langmuir-1984"]),
  rel("x-leviticus", "CONTRADICTS", "c-blood", l("Un rite utilisant du sang violerait un interdit fondamental du judaïsme.", "A rite using blood would violate a fundamental prohibition of Judaism."), ["leviticus-17"]),
  rel("x-frederick", "CONTRADICTS", "c-blood", l("L'enquête impériale conclut qu'aucun rite juif ne requiert de sang.", "The imperial inquiry concludes no Jewish rite requires blood."), ["frederick-ii-1236"]),
  rel("x-innocent", "CONTRADICTS", "c-blood", l("Le pape condamne ces accusations.", "The pope condemns these accusations."), ["innocent-iv-1247"]),
  rel("e-fulda", "REFERS_TO", "c-blood", l("Première affaire connue où l'accusation porte sur le sang.", "First known case in which the accusation concerns blood."), ["ushmm-blood-libel"]),
  rel("x-e401", "SUPPORTS", "c-devil-images", l("Le dessin associe explicitement des Juifs de Norwich à des démons.", "The drawing explicitly associates Jews of Norwich with demons."), ["tna-e401-1565"]),
  rel("x-e401", "CONTEXTUALIZES", "c-satanic", l("L'image renseigne sur le regard chrétien, pas sur des pratiques juives.", "The image informs us about the Christian gaze, not about Jewish practice."), ["tna-e401-1565", "trachtenberg-1943"]),
  rel("c-devil-images", "CONTEXTUALIZES", "c-satanic", l("Ne pas confondre l'existence d'images hostiles avec la réalité de ce qu'elles prétendent montrer.", "Do not confuse the existence of hostile images with the reality of what they claim to show."), ["trachtenberg-1943"]),
  rel("x-torture", "CONTRADICTS", "c-trent-confessions", l("Des aveux sous la torture n'ont pas de valeur probante.", "Confessions under torture have no probative value."), ["trent-trial-records", "hsia-trent"]),
  rel("x-report", "CONTRADICTS", "c-trent-confessions", l("Les accusés ont eux-mêmes signalé le corps.", "The accused themselves reported the body."), ["hsia-trent"]),
  rel("t-papal", "CONTRADICTS", "c-trent-confessions", l("Le commissaire pontifical doute ; la bulle ne conclut pas sur les faits.", "The papal commissioner doubts; the bull makes no finding on the facts."), ["hsia-trent"]),
  rel("t-1965", "CONTRADICTS", "c-trent-confessions", l("L'Église abolit le culte fondé sur le procès.", "The Church abolishes the cult founded on the trial."), ["trent-1965-decree", "ushmm-blood-libel"]),
  rel("t-trial", "REFERS_TO", "c-trent-confessions", l("Le procès a produit les aveux.", "The trial produced the confessions."), ["trent-trial-records"]),
  rel("x-torture", "DOCUMENTS", "t-trial", l("Les procès-verbaux enregistrent les interrogatoires.", "The records register the interrogations."), ["trent-trial-records"]),
  rel("c-spread", "REFERS_TO", "e-gloucester", l("Une des affaires attestant la diffusion.", "One of the cases attesting the spread."), ["ushmm-blood-libel", "rose-2015"]),
  rel("c-spread", "REFERS_TO", "e-blois", l("Premier cas connu hors d'Angleterre.", "First known case outside England."), ["ushmm-blood-libel", "rose-2015"]),
  rel("c-spread", "REFERS_TO", "e-lincoln", l("Le roi d'Angleterre donne crédit à l'accusation.", "The King of England lends credit to the accusation."), ["ushmm-blood-libel"]),
  rel("c-spread", "REFERS_TO", "e-trent", l("L'affaire la plus documentée du XVe siècle.", "The best-documented fifteenth-century case."), ["hsia-trent"]),
  rel("d-just1", "DOCUMENTS", "e-winchester", l("Le rôle judiciaire enregistre l'affaire.", "The court roll records the case."), ["tna-just1-775"]),

  // Assessments
  rel("v-frederick", "REFERS_TO", "e-fulda", l("L'enquête fait suite au massacre de Fulda.", "The inquiry follows the Fulda massacre."), ["frederick-ii-1236"]),
  rel("v-james", "REINTERPRETS", "o-vita", l("Première lecture critique du texte de Thomas.", "First critical reading of Thomas's text."), ["jessopp-james-1896"]),
  rel("v-langmuir", "REINTERPRETS", "o-vita", l("Analyse du texte comme construction d'une accusation.", "Analysis of the text as the construction of an accusation."), ["langmuir-1984"]),
  rel("v-rose", "REINTERPRETS", "o-vita", l("Relecture du texte à la lumière du procès de Simon de Novers.", "Rereading of the text in light of the trial of Simon de Novers."), ["rose-2015"]),
  rel("v-rose", "REFERS_TO", "o-novers", l("Le procès est au centre de la thèse de Rose.", "The trial is at the heart of Rose's thesis."), ["rose-2015"]),
  rel("v-consensus", "DERIVED_FROM", "v-langmuir", l("Le consensus s'appuie notamment sur ces travaux.", "The consensus draws notably on this work."), ["langmuir-1984"]),
  rel("v-consensus", "DERIVED_FROM", "v-rose", l("Le consensus s'appuie notamment sur ces travaux.", "The consensus draws notably on this work."), ["rose-2015"]),
  rel("v-consensus", "DERIVED_FROM", "v-frederick", l("Les autorités médiévales elles-mêmes avaient rejeté l'accusation.", "Medieval authorities themselves had rejected the accusation."), ["frederick-ii-1236"]),

  // Evolution
  rel("s-ritual", "EVOLVED_INTO", "s-blood", l("Au XIIIe siècle, l'accusation se transforme : le motif du sang s'ajoute.", "In the thirteenth century the accusation changes: the blood motif is added."), ["ushmm-blood-libel"]),
  rel("s-blood", "EVOLVED_INTO", "s-modern", l("Les motifs de l'accusation sont réemployés à l'époque contemporaine.", "The accusation's motifs are reused in modern times."), ["ushmm-blood-libel"]),
  rel("s-devil", "CONTEXTUALIZES", "s-ritual", l("L'association des Juifs au diable rend l'accusation crédible aux yeux de ses contemporains.", "The association of Jews with the devil made the accusation credible to contemporaries."), ["trachtenberg-1943"]),
  rel("x-e401", "DOCUMENTS", "s-devil", l("Exemple daté et authentique de cette association.", "A dated, authentic example of this association."), ["tna-e401-1565"]),

  // Source dependencies (never count copies as independent witnesses)
  rel("d-jessopp", "DERIVED_FROM", "d-vita", l("Édition du manuscrit unique.", "Edition of the unique manuscript."), ["jessopp-james-1896"]),
  rel("d-rubin", "DERIVED_FROM", "d-vita", l("Traduction du même manuscrit.", "Translation of the same manuscript."), ["rubin-2014"]),
  rel("d-peterborough", "DERIVED_FROM", "d-vita", l("Probablement dépendante du récit diffusé par le culte de Norwich (indépendance non établie).", "Probably dependent on the story spread by the Norwich cult (independence not established)."), ["peterborough-chronicle"]),
  rel("d-hsia", "DERIVED_FROM", "d-trent", l("Reconstitution fondée sur les actes du procès.", "Reconstruction based on the trial records."), ["hsia-trent"]),
  rel("d-tna", "DERIVED_FROM", "d-e401", l("La ressource présente et commente ce document.", "The resource presents and comments on this document."), ["tna-jews-england"]),

  // Unknowns
  rel("u-killer", "REFERS_TO", "o-death", l("Le meurtrier reste inconnu.", "The killer remains unknown."), ["jessopp-james-1896"]),
  rel("u-1144", "REFERS_TO", "c-accused-1144", l("Même question, vue sous l'angle de l'incertitude.", "The same question, seen from the angle of uncertainty."), ["thomas-vita"]),
  rel("u-thomas", "REFERS_TO", "o-thomas", l("Rôle de l'auteur dans la construction du récit.", "The author's role in building the story."), ["langmuir-1984"]),
  rel("u-transmission", "REFERS_TO", "c-filiation", l("Les voies de transmission restent mal connues.", "The routes of transmission remain poorly known."), ["rose-2015"]),
];

/**
 * Map links. Never invent a historical transmission:
 * - "proposed": a direct influence argued by historians (here E. M. Rose);
 * - "similarity": the stories resemble each other, no documented lineage.
 * No link is marked "documented" yet: none is attested by a period source in this dossier.
 */
const spread: SpreadLink[] = [
  { from: "o-death", to: "e-gloucester", kind: "proposed", note: l("Influence du modèle norvicois proposée par E. M. Rose.", "Influence of the Norwich model proposed by E. M. Rose."), sourceIds: ["rose-2015"] },
  { from: "o-death", to: "e-blois", kind: "proposed", note: l("Lien proposé par E. M. Rose.", "Link proposed by E. M. Rose."), sourceIds: ["rose-2015"] },
  { from: "o-death", to: "e-bury", kind: "proposed", note: l("Lien proposé par E. M. Rose.", "Link proposed by E. M. Rose."), sourceIds: ["rose-2015"] },
  { from: "o-death", to: "e-winchester", kind: "similarity", note: l("Récit similaire ; pas de filiation documentée dans ce dossier.", "Similar narrative; no lineage documented in this dossier."), sourceIds: ["tna-jews-england"] },
  { from: "o-death", to: "e-fulda", kind: "similarity", note: l("Ressemblance, avec un élément nouveau (le sang) ; pas de filiation documentée.", "Resemblance, with a new element (blood); no documented lineage."), sourceIds: ["ushmm-blood-libel"] },
  { from: "o-death", to: "e-lincoln", kind: "similarity", note: l("Récit similaire ; pas de filiation documentée dans ce dossier.", "Similar narrative; no lineage documented in this dossier."), sourceIds: ["ushmm-blood-libel"] },
  { from: "e-fulda", to: "e-trent", kind: "similarity", note: l("Même motif du sang ; pas de filiation documentée.", "Same blood motif; no documented lineage."), sourceIds: ["hsia-trent", "ushmm-blood-libel"] },
];

const narration: NarrationStep[] = [
  {
    focus: "q",
    title: l("1. L'accusation", "1. The accusation"),
    text: l(
      "Une idée a traversé neuf siècles : des Juifs tueraient des enfants chrétiens lors de rites secrets. D'où vient-elle ? Sur quoi repose-t-elle ? Remontons à sa source.",
      "An idea has travelled across nine centuries: Jews allegedly kill Christian children in secret rites. Where does it come from? What does it rest on? Let us go back to its source.",
    ),
  },
  {
    focus: "b-origins",
    title: l("2. Le premier récit", "2. The first narrative"),
    text: l(
      "Norwich, 1144 : un garçon de douze ans, Guillaume, est retrouvé mort dans un bois. Quelques années plus tard, un moine, Thomas de Monmouth, écrit que des Juifs l'ont tué en imitant la crucifixion. C'est le premier récit connu de « meurtre rituel ».",
      "Norwich, 1144: a twelve-year-old boy, William, is found dead in a wood. A few years later, a monk, Thomas of Monmouth, writes that Jews killed him by imitating the crucifixion. It is the first known narrative of 'ritual murder'.",
    ),
  },
  {
    focus: "o-context",
    title: l("3. Le contexte", "3. The context"),
    text: l(
      "L'Angleterre est en guerre civile ; les Juifs, protégés du roi, prêtent de l'argent ; un chevalier endetté est jugé pour le meurtre de son banquier juif. Thomas, lui, veut faire de Guillaume un saint qui attire les pèlerins.",
      "England is in civil war; Jews, under royal protection, lend money; an indebted knight is tried for the murder of his Jewish banker. Thomas, for his part, wants to make William a saint who attracts pilgrims.",
    ),
  },
  {
    focus: "b-docs",
    title: l("4. Les documents", "4. The documents"),
    text: l(
      "Presque tout repose sur un seul manuscrit, celui de Thomas. Il est authentique : il prouve que l'accusation existait vers 1150. Mais son auteur n'a rien vu, et ses témoins sont tardifs et indirects.",
      "Almost everything rests on a single manuscript, Thomas's. It is authentic: it proves that the accusation existed around 1150. But its author saw nothing, and his witnesses are late and indirect.",
    ),
  },
  {
    focus: "b-claims",
    title: l("5. Confronter les preuves", "5. Weighing the evidence"),
    text: l(
      "Que des Juifs aient été accusés : établi. Qu'ils aient tué Guillaume : non démontré. Qu'ils utilisent du sang : réfuté — la loi juive l'interdit, et un empereur comme un pape l'ont reconnu au XIIIe siècle. À Trente, en 1475, les « aveux » sont obtenus sous la torture.",
      "That Jews were accused: established. That they killed William: not demonstrated. That they used blood: refuted — Jewish law forbids it, and both an emperor and a pope acknowledged as much in the thirteenth century. At Trent in 1475, the 'confessions' were obtained under torture.",
    ),
  },
  {
    focus: "b-unknown",
    title: l("6. Conclusion et incertitudes", "6. Conclusion and uncertainties"),
    text: l(
      "Aucun meurtre rituel juif n'a jamais été démontré. Il reste pourtant des inconnues — qui a tué Guillaume, comment le récit a voyagé. Les reconnaître n'affaiblit pas la conclusion : on peut ignorer le nom d'un meurtrier et savoir qu'une accusation est fausse.",
      "No Jewish ritual murder has ever been demonstrated. Some unknowns remain — who killed William, how the story travelled. Acknowledging them does not weaken the conclusion: one can be unsure who the killer was and still know an accusation is false.",
    ),
  },
];

export const norwich1144: Dossier = {
  slug: "norwich-1144",
  rootId: "q",
  title: l("Norwich, 1144", "Norwich, 1144"),
  period: l("1144 – 1475", "1144 – 1475"),
  timeline: { min: 1130, break: 1500, max: 1980, ticks: [1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1965] },
  accusation: l(
    "« Les Juifs pratiquaient des rites sataniques impliquant le meurtre d'enfants. »",
    "'Jews practised satanic rites involving the murder of children.'",
  ),
  intro: l(
    "Premier dossier d'ORIGINES : comment une accusation née à Norwich en 1144 s'est répandue en Europe, et ce que les documents permettent réellement d'en dire.",
    "ORIGINES' first dossier: how an accusation born in Norwich in 1144 spread across Europe, and what the documents really allow us to say about it.",
  ),
  updated: "2026-11-09",
  nodes,
  relations,
  sources,
  spread,
  narration,
};
