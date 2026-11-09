import type { Assessment, GraphNode, L, Place } from "../../types";

const l = (fr: string, en: string): L => ({ fr, en });
const REVIEWED = "2026-11-09";

const place = (fr: string, en: string, lat: number, lon: number): Place => ({ name: l(fr, en), lat, lon });
const NORWICH = place("Norwich (Angleterre)", "Norwich (England)", 52.628, 1.297);
const TRENT = place("Trente (Italie)", "Trent (Italy)", 46.067, 11.121);

function initial(a: Omit<Assessment, "lastReviewed" | "history">, note: L): Assessment {
  return {
    ...a,
    lastReviewed: REVIEWED,
    history: [{ date: REVIEWED, status: a.status, note }],
  };
}
const FIRST = l("Première évaluation publiée (version 1 du dossier).", "First published assessment (dossier version 1).");

export const nodes: GraphNode[] = [
  // ═════════════════════════ Root ═════════════════════════
  {
    id: "q",
    kind: "concept",
    title: l(
      "Les Juifs pratiquaient-ils des rites impliquant le meurtre d'enfants ?",
      "Did Jews practise rites involving the murder of children?",
    ),
    short: l("Une accusation née en Angleterre au XIIe siècle", "An accusation born in twelfth-century England"),
    summary: l(
      "Non. Cette accusation apparaît à Norwich, en Angleterre, au milieu du XIIe siècle, puis se répand en Europe. Aucune des affaires étudiées n'apporte de preuve fiable d'un rite juif de ce type ; l'accusation a été rejetée dès le Moyen Âge par un empereur et par des papes, et elle contredit les règles religieuses juives documentées. Ce dossier montre d'où vient l'idée, sur quels documents elle repose et ce qu'ils prouvent réellement.",
      "No. The accusation appears in Norwich, England, in the mid-twelfth century and then spreads across Europe. None of the cases studied provides reliable evidence of any such Jewish rite; the accusation was already rejected in the Middle Ages by an emperor and by popes, and it contradicts documented Jewish religious rules. This dossier shows where the idea comes from, which documents it rests on and what they actually prove.",
    ),
    status: "refuted",
    assessment: initial(
      {
        status: "refuted",
        confidence: "high",
        favorable: [
          l(
            "Des récits médiévaux affirment de tels meurtres (Thomas de Monmouth vers 1150, puis d'autres affaires). Mais ces récits prouvent que l'accusation circulait, pas que les faits ont eu lieu.",
            "Medieval accounts assert such murders (Thomas of Monmouth c. 1150, then other cases). But these accounts prove that the accusation circulated, not that the events took place.",
          ),
          l(
            "Des aveux ont été obtenus, notamment à Trente en 1475 — sous la torture.",
            "Confessions were obtained, notably in Trent in 1475 — under torture.",
          ),
        ],
        contrary: [
          l(
            "La loi juive interdit expressément la consommation de sang (Lévitique 17).",
            "Jewish law expressly forbids consuming blood (Leviticus 17).",
          ),
          l(
            "En 1236, une enquête impériale menée auprès de Juifs convertis conclut qu'aucun rite juif ne requiert de sang ; en 1247, le pape Innocent IV condamne ces accusations.",
            "In 1236 an imperial inquiry among Jewish converts concludes that no Jewish rite requires blood; in 1247 Pope Innocent IV condemns these accusations.",
          ),
          l(
            "Dans chaque affaire examinée, on peut retracer comment l'accusation a été construite : récit hagiographique tardif, intérêts locaux, aveux sous la torture.",
            "In each case examined, one can trace how the accusation was built: late hagiography, local interests, confessions under torture.",
          ),
          l(
            "L'Église elle-même a aboli en 1965 le culte de Simon de Trente, fondé sur cette accusation.",
            "The Church itself abolished in 1965 the cult of Simon of Trent, founded on this accusation.",
          ),
        ],
        limits: [
          l(
            "Les circonstances exactes de la mort de Guillaume de Norwich restent inconnues : on ne sait pas qui l'a tué.",
            "The exact circumstances of William of Norwich's death remain unknown: we do not know who killed him.",
          ),
          l(
            "Ce dossier couvre en détail Norwich et Trente ; les autres affaires sont présentées plus brièvement.",
            "This dossier covers Norwich and Trent in detail; other cases are presented more briefly.",
          ),
        ],
        reasoning: l(
          "Le statut « Réfuté » ne repose pas sur une simple absence de preuve. Il repose sur des éléments positifs : l'interdit religieux du sang, les enquêtes médiévales qui ont conclu à l'innocence des accusés, et l'analyse de chaque dossier, qui montre la fabrication de l'accusation. Ne pas savoir qui a tué Guillaume ne rend pas plausible un rite que rien n'atteste et que tout contredit.",
          "The 'Refuted' status does not rest on a mere absence of evidence. It rests on positive elements: the religious ban on blood, the medieval inquiries that cleared the accused, and the analysis of each case, which shows how the accusation was manufactured. Not knowing who killed William does not make plausible a rite that nothing attests and everything contradicts.",
        ),
      },
      FIRST,
    ),
  },

  // ═════════════════════════ Branches ═════════════════════════
  {
    id: "b-origins",
    kind: "concept",
    parent: "q",
    title: l("Origines de l'accusation", "Origins of the accusation"),
    short: l("Norwich, 1144, et le moine qui en fit un récit", "Norwich, 1144, and the monk who wrote it up"),
    summary: l(
      "Tout commence par la mort d'un garçon de douze ans à Norwich en 1144. L'idée qu'il aurait été tué par des Juifs selon un rite ne prend forme que dans le récit d'un moine, Thomas de Monmouth, écrit plusieurs années plus tard.",
      "It all starts with the death of a twelve-year-old boy in Norwich in 1144. The idea that he was killed by Jews in a rite only takes shape in the account of a monk, Thomas of Monmouth, written several years later.",
    ),
  },
  {
    id: "b-events",
    kind: "concept",
    parent: "q",
    title: l("Événements historiques", "Historical events"),
    short: l("De Norwich (1144) à Trente (1475)", "From Norwich (1144) to Trent (1475)"),
    summary: l(
      "Après Norwich, des accusations semblables surgissent ailleurs en Angleterre, en France, dans l'Empire et en Italie. Elles provoquent arrestations, exécutions et massacres.",
      "After Norwich, similar accusations arise elsewhere in England, France, the Empire and Italy. They lead to arrests, executions and massacres.",
    ),
  },
  {
    id: "b-docs",
    kind: "concept",
    parent: "q",
    title: l("Documents et témoignages", "Documents and testimonies"),
    short: l("Ce que disent vraiment les sources", "What the sources really say"),
    summary: l(
      "Les documents d'époque et les études des historiens. Pour chacun : qui l'a écrit, quand, et de quelle autre source il dépend.",
      "Period documents and historians' studies. For each one: who wrote it, when, and which other source it depends on.",
    ),
  },
  {
    id: "b-claims",
    kind: "concept",
    parent: "q",
    title: l("Les affirmations, une à une", "The claims, one by one"),
    short: l("Preuves favorables et contradictoires", "Evidence for and against"),
    summary: l(
      "L'accusation mélange plusieurs affirmations qui n'ont pas le même statut. Qu'une accusation ait existé est un fait établi ; que les faits accusés aient eu lieu en est un tout autre. Chacune est évaluée séparément.",
      "The accusation mixes several claims that do not have the same status. That an accusation existed is an established fact; that the alleged acts took place is something else entirely. Each is assessed separately.",
    ),
  },
  {
    id: "b-eval",
    kind: "concept",
    parent: "q",
    title: l("Évaluations historiques", "Historical assessments"),
    short: l("Du Moyen Âge aux historiens d'aujourd'hui", "From the Middle Ages to today's historians"),
    summary: l(
      "L'accusation a été examinée dès le XIIIe siècle par un empereur et par des papes, puis par les historiens depuis la fin du XIXe siècle.",
      "The accusation was examined as early as the thirteenth century by an emperor and by popes, and by historians since the late nineteenth century.",
    ),
  },
  {
    id: "b-spread",
    kind: "concept",
    parent: "q",
    title: l("Évolution et propagation", "Evolution and spread"),
    short: l("Comment le récit s'est transformé", "How the story changed"),
    summary: l(
      "Le récit n'est pas resté le même : d'une prétendue « reproduction de la crucifixion » à Norwich, il devient au XIIIe siècle une accusation d'usage du sang, puis est réemployé jusqu'à l'époque contemporaine.",
      "The story did not stay the same: from an alleged 're-enactment of the crucifixion' at Norwich, it becomes in the thirteenth century an accusation of using blood, and is reused up to the present day.",
    ),
  },
  {
    id: "b-unknown",
    kind: "concept",
    parent: "q",
    title: l("Questions non résolues", "Unresolved questions"),
    short: l("Ce que l'on ne sait pas", "What we do not know"),
    summary: l(
      "Une enquête honnête dit aussi ce qu'elle ignore. Ces questions restent ouvertes — sans remettre en cause la conclusion principale.",
      "An honest investigation also says what it does not know. These questions remain open — without calling the main conclusion into question.",
    ),
  },

  // ═════════════════════════ Origins ═════════════════════════
  {
    id: "o-death",
    kind: "event",
    parent: "b-origins",
    title: l("Mort de Guillaume de Norwich", "Death of William of Norwich"),
    short: l("Mars 1144, bois de Thorpe", "March 1144, Thorpe Wood"),
    date: { label: l("Semaine sainte 1144", "Holy Week 1144"), year: 1144 },
    place: NORWICH,
    status: "established",
    summary: l(
      "Le corps de Guillaume, apprenti pelletier d'environ douze ans, est découvert le Samedi saint 1144 dans le bois de Thorpe, au nord de Norwich ; il porte les traces d'une mort violente. Il est d'abord enterré sur place, puis identifié par sa famille. Sa mort est un fait établi ; son auteur reste inconnu.",
      "The body of William, an apprentice skinner of about twelve, is found on Holy Saturday 1144 in Thorpe Wood, north of Norwich; it bears the marks of a violent death. He is first buried on the spot, then identified by his family. His death is an established fact; his killer remains unknown.",
    ),
  },
  {
    id: "o-william",
    kind: "person",
    parent: "b-origins",
    title: l("Guillaume de Norwich", "William of Norwich"),
    short: l("v. 1132 – 1144", "c. 1132 – 1144"),
    summary: l(
      "Garçon de Norwich placé en apprentissage chez un pelletier. Presque tout ce que l'on sait de lui vient de Thomas de Monmouth, qui écrit pour faire de lui un saint martyr. Son culte local reste modeste et disparaît au XVIe siècle.",
      "A Norwich boy apprenticed to a skinner. Almost everything we know about him comes from Thomas of Monmouth, who writes to make him a martyr saint. His local cult remains modest and fades away in the sixteenth century.",
    ),
  },
  {
    id: "o-sheriff",
    kind: "event",
    parent: "b-origins",
    title: l("Premières accusations et protection du shérif", "First accusations and the sheriff's protection"),
    short: l("1144, selon Thomas", "1144, according to Thomas"),
    date: { label: l("1144 (selon Thomas de Monmouth)", "1144 (according to Thomas of Monmouth)"), year: 1144 },
    place: NORWICH,
    status: "plausible",
    summary: l(
      "D'après Thomas, la famille de Guillaume — dont son oncle, le prêtre Godwin Sturt — accuse les Juifs et demande à l'évêque de les juger. Le shérif John de Chesney répond que le tribunal ecclésiastique n'a pas autorité sur eux et les met à l'abri au château. Ce récit n'est connu que par Thomas : plausible, mais invérifiable.",
      "According to Thomas, William's family — including his uncle, the priest Godwin Sturt — accuses the Jews and asks the bishop to try them. Sheriff John de Chesney replies that the church court has no authority over them and shelters them in the castle. This account is known only through Thomas: plausible, but unverifiable.",
    ),
  },
  {
    id: "o-thomas",
    kind: "person",
    parent: "b-origins",
    title: l("Thomas de Monmouth", "Thomas of Monmouth"),
    short: l("Moine, auteur du récit", "Monk, author of the account"),
    summary: l(
      "Moine bénédictin du prieuré cathédral de Norwich, arrivé dans la ville quelques années après la mort de Guillaume (avant 1150). Il recueille des témoignages, souvent tardifs et de seconde main, et compose la Vie et Passion de Guillaume pour promouvoir son culte. Il n'a été témoin de rien de ce qu'il raconte sur la mort.",
      "Benedictine monk of Norwich cathedral priory, who arrived in the city a few years after William's death (before 1150). He gathers testimonies, often late and second-hand, and composes the Life and Passion of William to promote his cult. He witnessed none of what he relates about the death.",
    ),
  },
  {
    id: "o-vita",
    kind: "source",
    parent: "b-origins",
    sourceId: "thomas-vita",
    title: l("La Vie et Passion de Guillaume", "The Life and Passion of William"),
    short: l("Le premier récit de « meurtre rituel »", "The first 'ritual murder' narrative"),
    summary: l(
      "Le texte fondateur de l'accusation. Il est authentique — c'est bien un manuscrit du XIIe siècle — mais c'est un plaidoyer pour un culte, rédigé des années après les faits par quelqu'un qui n'en a pas été témoin.",
      "The founding text of the accusation. It is authentic — it really is a twelfth-century manuscript — but it is a plea for a cult, written years after the events by someone who did not witness them.",
    ),
  },
  {
    id: "o-novers",
    kind: "event",
    parent: "b-origins",
    title: l("Le procès de Simon de Novers", "The trial of Simon de Novers"),
    short: l("Une dette, un banquier juif tué", "A debt, a Jewish banker killed"),
    date: { label: l("Vers 1150", "c. 1150"), year: 1150 },
    place: NORWICH,
    summary: l(
      "Un chevalier endetté, Simon de Novers, est accusé d'avoir fait tuer son banquier juif, Deulesalt. Selon l'historienne E. M. Rose, c'est dans le cadre de ce procès que l'histoire d'un enfant tué par les Juifs aurait été mise en avant, pour retourner l'accusation contre la communauté juive. Il s'agit d'une interprétation, discutée par les spécialistes.",
      "An indebted knight, Simon de Novers, is accused of having his Jewish banker, Deulesalt, killed. According to the historian E. M. Rose, it was in the context of this trial that the story of a child killed by Jews was put forward, to turn the accusation against the Jewish community. This is an interpretation, debated among specialists.",
    ),
  },
  {
    id: "o-context",
    kind: "concept",
    parent: "b-origins",
    title: l("Le contexte : Anarchie et croisade", "The context: Anarchy and crusade"),
    short: l("Angleterre, années 1140", "England, 1140s"),
    summary: l(
      "L'Angleterre traverse une guerre civile (l'« Anarchie », 1138–1153) et l'Europe se mobilise pour la deuxième croisade (1147–1149). Les communautés juives, arrivées en Angleterre après 1066, vivent sous la protection du roi et jouent un rôle de prêteurs — ce qui les expose aux ressentiments de débiteurs.",
      "England is going through a civil war (the 'Anarchy', 1138–1153) and Europe is mobilising for the Second Crusade (1147–1149). Jewish communities, which arrived in England after 1066, live under royal protection and act as lenders — which exposes them to the resentment of debtors.",
    ),
  },

  // ═════════════════════════ Events ═════════════════════════
  {
    id: "e-gloucester",
    kind: "event",
    parent: "b-events",
    title: l("Gloucester", "Gloucester"),
    short: l("1168", "1168"),
    date: { label: l("1168", "1168"), year: 1168 },
    place: place("Gloucester (Angleterre)", "Gloucester (England)", 51.864, -2.244),
    status: "established",
    summary: l(
      "Après la mort d'un garçon, Harold, les Juifs de Gloucester sont accusés à leur tour. C'est la deuxième accusation connue en Angleterre ; E. M. Rose y voit une influence directe du modèle norvicois.",
      "After the death of a boy, Harold, the Jews of Gloucester are accused in turn. It is the second known accusation in England; E. M. Rose sees a direct influence of the Norwich model.",
    ),
  },
  {
    id: "e-blois",
    kind: "event",
    parent: "b-events",
    title: l("Blois", "Blois"),
    short: l("1171 — environ 31 à 33 morts", "1171 — about 31 to 33 dead"),
    date: { label: l("29 mai 1171", "29 May 1171"), year: 1171 },
    place: place("Blois (France)", "Blois (France)", 47.586, 1.335),
    status: "established",
    summary: l(
      "Premier cas connu hors d'Angleterre. Un serviteur chrétien affirme avoir vu un Juif jeter le corps d'un enfant dans la Loire. Aucun corps n'est jamais retrouvé. Environ 31 à 33 Juifs, dont 17 femmes, sont brûlés.",
      "First known case outside England. A Christian servant claims to have seen a Jew throw a child's body into the Loire. No body is ever found. About 31 to 33 Jews, including 17 women, are burned.",
    ),
  },
  {
    id: "e-bury",
    kind: "event",
    parent: "b-events",
    title: l("Bury St Edmunds", "Bury St Edmunds"),
    short: l("1181", "1181"),
    date: { label: l("1181", "1181"), year: 1181 },
    place: place("Bury St Edmunds (Angleterre)", "Bury St Edmunds (England)", 52.246, 0.711),
    status: "established",
    summary: l(
      "Nouvelle accusation autour de la mort d'un enfant, Robert, dans une ville voisine de Norwich. Rose l'intègre à la diffusion du modèle norvicois.",
      "A new accusation around the death of a child, Robert, in a town near Norwich. Rose includes it in the spread of the Norwich model.",
    ),
  },
  {
    id: "e-winchester",
    kind: "event",
    parent: "b-events",
    title: l("Winchester", "Winchester"),
    short: l("v. 1232 — l'accusation entre au tribunal royal", "c. 1232 — the accusation reaches the royal court"),
    date: { label: l("Vers 1232", "c. 1232"), year: 1232 },
    place: place("Winchester (Angleterre)", "Winchester (England)", 51.063, -1.308),
    status: "established",
    summary: l(
      "Un enfant d'un an, Stephen, est retrouvé mort ; un jury désigne un Juif, Abraham Pinche. Selon les National Archives, ces accusations étaient très probablement inventées mais désormais prises au sérieux par la justice royale. Le shérif détient toute la communauté juive de la ville, puis la libère contre 20 marcs.",
      "A one-year-old child, Stephen, is found dead; a jury names a Jew, Abraham Pinche. According to The National Archives, these accusations were most likely made up but now taken seriously by royal justice. The sheriff detains the town's whole Jewish community, then releases it for 20 marks.",
    ),
  },
  {
    id: "e-fulda",
    kind: "event",
    parent: "b-events",
    title: l("Fulda", "Fulda"),
    short: l("Noël 1235 — l'accusation du sang", "Christmas 1235 — the blood accusation"),
    date: { label: l("Fin décembre 1235", "Late December 1235"), year: 1235 },
    place: place("Fulda (Saint-Empire)", "Fulda (Holy Roman Empire)", 50.555, 9.68),
    status: "established",
    summary: l(
      "Cinq enfants meurent ; des habitants accusent les Juifs de les avoir tués pour recueillir leur sang. 34 Juifs sont brûlés. C'est la première affaire connue où l'accusation porte explicitement sur l'usage du sang — un élément absent du récit de Norwich.",
      "Five children die; townspeople accuse the Jews of killing them to collect their blood. 34 Jews are burned. It is the first known case where the accusation explicitly concerns the use of blood — an element absent from the Norwich narrative.",
    ),
  },
  {
    id: "e-lincoln",
    kind: "event",
    parent: "b-events",
    title: l("Lincoln", "Lincoln"),
    short: l("1255 — le roi Henri III s'en mêle", "1255 — King Henry III steps in"),
    date: { label: l("1255", "1255"), year: 1255 },
    place: place("Lincoln (Angleterre)", "Lincoln (England)", 53.234, -0.538),
    status: "established",
    summary: l(
      "Le corps d'un garçon, Hugh, est retrouvé dans un puits. Un Juif nommé Copin « avoue » et est exécuté ; 91 Juifs sont envoyés à Londres et 18 y sont exécutés. Pour la première fois, la Couronne donne son crédit à une accusation de meurtre rituel.",
      "The body of a boy, Hugh, is found in a well. A Jew named Copin 'confesses' and is executed; 91 Jews are sent to London and 18 are executed there. For the first time, the Crown lends credit to a ritual-murder accusation.",
    ),
  },
  {
    id: "e-trent",
    kind: "event",
    parent: "b-events",
    title: l("Trente", "Trent"),
    short: l("1475 — aveux sous la torture", "1475 — confessions under torture"),
    date: { label: l("Mars 1475", "March 1475"), year: 1475 },
    place: TRENT,
    status: "established",
    summary: l(
      "Simon, un enfant de deux ans, disparaît le Jeudi saint 1475. Son corps est découvert le dimanche de Pâques dans l'eau, dans la cave d'une maison juive — et ce sont des Juifs qui signalent eux-mêmes la découverte aux autorités. Toute la communauté est arrêtée et torturée ; les hommes sont exécutés.",
      "Simon, a two-year-old child, disappears on Maundy Thursday 1475. His body is found on Easter Sunday in water, in the cellar of a Jewish house — and it is Jews who report the discovery to the authorities themselves. The entire community is arrested and tortured; the men are executed.",
    ),
  },
  {
    id: "t-trial",
    kind: "event",
    parent: "e-trent",
    title: l("Le procès et les exécutions", "The trial and the executions"),
    short: l("1475–1476", "1475–1476"),
    date: { label: l("1475–1476", "1475–1476"), year: 1475 },
    place: TRENT,
    status: "established",
    summary: l(
      "Sous la torture, les hommes « avouent » le meurtre rituel. Ils sont condamnés à mort et exécutés sur le bûcher ; les femmes, assignées à résidence, finissent par se convertir. Le dossier du procès est ensuite utilisé pour promouvoir le culte de Simon.",
      "Under torture, the men 'confess' to ritual murder. They are sentenced to death and burned at the stake; the women, held under house arrest, eventually convert. The trial record is then used to promote Simon's cult.",
    ),
  },
  {
    id: "t-hinderbach",
    kind: "person",
    parent: "e-trent",
    title: l("Johannes Hinderbach", "Johannes Hinderbach"),
    short: l("Prince-évêque de Trente", "Prince-bishop of Trent"),
    summary: l(
      "Prince-évêque de Trente, il conduit le procès et soutient activement le culte du « petit martyr Simon ».",
      "Prince-bishop of Trent, he oversees the trial and actively promotes the cult of 'little martyr Simon'.",
    ),
  },
  {
    id: "t-papal",
    kind: "event",
    parent: "e-trent",
    title: l("L'enquête pontificale", "The papal inquiry"),
    short: l("1475 – 1478", "1475 – 1478"),
    date: { label: l("1475 – 20 juin 1478", "1475 – 20 June 1478"), year: 1478 },
    status: "established",
    summary: l(
      "Le pape Sixte IV fait suspendre la procédure en août 1475 et envoie un commissaire, Battista dei Giudici, qui doute de la culpabilité des accusés. La bulle du 20 juin 1478 reconnaît que la procédure a été menée dans les formes, mais ne se prononce pas sur les faits et rappelle la protection due aux Juifs.",
      "Pope Sixtus IV has the proceedings suspended in August 1475 and sends a commissioner, Battista dei Giudici, who doubts the guilt of the accused. The bull of 20 June 1478 acknowledges that the procedure was formally lawful, but makes no finding on the facts and restates the protection owed to Jews.",
    ),
  },
  {
    id: "t-1965",
    kind: "event",
    parent: "e-trent",
    title: l("Abolition du culte de Simon", "Abolition of Simon's cult"),
    short: l("28 octobre 1965", "28 October 1965"),
    date: { label: l("28 octobre 1965", "28 October 1965"), year: 1965 },
    place: TRENT,
    sourceId: "trent-1965-decree",
    status: "established",
    summary: l(
      "L'archevêque de Trente abolit le culte de Simon et supprime la procession annuelle. Simon ne figure plus dans la nouvelle édition du Martyrologe romain.",
      "The archbishop of Trent abolishes Simon's cult and suppresses the yearly procession. Simon no longer appears in the new edition of the Roman Martyrology.",
    ),
  },

  // ═════════════════════════ Documents ═════════════════════════
  {
    id: "d-primary",
    kind: "concept",
    parent: "b-docs",
    title: l("Sources d'époque", "Period sources"),
    short: l("Écrites au moment des faits ou peu après", "Written at the time or shortly after"),
    summary: l(
      "Documents produits au Moyen Âge (ou textes normatifs anciens). Ils sont précieux, mais chacun doit être lu à trois niveaux : est-il authentique ? que dit-il exactement ? que prouve-t-il vraiment ?",
      "Documents produced in the Middle Ages (or ancient normative texts). They are precious, but each must be read at three levels: is it authentic? what exactly does it say? what does it really prove?",
    ),
  },
  { id: "d-vita", kind: "source", parent: "d-primary", sourceId: "thomas-vita", title: l("Thomas de Monmouth, Vie et Passion", "Thomas of Monmouth, Life and Passion"), short: l("v. 1150 · latin", "c. 1150 · Latin"), summary: l("Seul récit détaillé de l'affaire de Norwich, rédigé pour fonder un culte.", "The only detailed account of the Norwich case, written to found a cult.") },
  { id: "d-peterborough", kind: "source", parent: "d-primary", sourceId: "peterborough-chronicle", title: l("Chronique de Peterborough", "Peterborough Chronicle"), short: l("v. 1155", "c. 1155"), summary: l("Mention brève, hors de Norwich, quelques années après : le récit circule déjà.", "A brief mention, outside Norwich, a few years later: the story is already circulating.") },
  { id: "d-e401", kind: "source", parent: "d-primary", sourceId: "tna-e401-1565", title: l("Caricature de l'Échiquier", "Exchequer caricature"), short: l("1233 · E 401/1565", "1233 · E 401/1565"), summary: l("Les Juifs de Norwich dessinés parmi des démons, sur un rôle fiscal royal.", "The Jews of Norwich drawn among demons, on a royal tax roll.") },
  { id: "d-just1", kind: "source", parent: "d-primary", sourceId: "tna-just1-775", title: l("Rôle judiciaire de Winchester", "Winchester court roll"), short: l("v. 1232 · JUST 1/775", "c. 1232 · JUST 1/775"), summary: l("L'accusation de meurtre d'enfant devant la justice royale.", "The child-murder accusation before royal justice.") },
  { id: "d-frederick", kind: "source", parent: "d-primary", sourceId: "frederick-ii-1236", title: l("Déclaration de Frédéric II", "Declaration of Frederick II"), short: l("1236", "1236"), summary: l("Conclusion d'une enquête impériale : aucun rite juif ne requiert de sang.", "Conclusion of an imperial inquiry: no Jewish rite requires blood.") },
  { id: "d-innocent", kind: "source", parent: "d-primary", sourceId: "innocent-iv-1247", title: l("Lettre d'Innocent IV", "Letter of Innocent IV"), short: l("1247", "1247"), summary: l("Le pape condamne les accusations et les spoliations qui en découlent.", "The pope condemns the accusations and the resulting dispossessions.") },
  { id: "d-trent", kind: "source", parent: "d-primary", sourceId: "trent-trial-records", title: l("Actes du procès de Trente", "Trent trial records"), short: l("1475–1476", "1475–1476"), summary: l("Interrogatoires sous la torture, compilés par l'accusation.", "Interrogations under torture, compiled by the prosecution.") },
  { id: "d-leviticus", kind: "source", parent: "d-primary", sourceId: "leviticus-17", title: l("Lévitique 17 et Deutéronome 12", "Leviticus 17 and Deuteronomy 12"), short: l("L'interdit du sang", "The ban on blood"), summary: l("Les textes qui interdisent aux Juifs de consommer du sang.", "The texts forbidding Jews to consume blood.") },
  { id: "d-1965", kind: "source", parent: "d-primary", sourceId: "trent-1965-decree", title: l("Décision de 1965", "1965 decision"), short: l("Trente", "Trent"), summary: l("Abolition du culte de Simon de Trente.", "Abolition of the cult of Simon of Trent.") },

  {
    id: "d-secondary",
    kind: "concept",
    parent: "b-docs",
    title: l("Études et ouvrages de référence", "Studies and reference works"),
    short: l("Le travail des historiens", "The historians' work"),
    summary: l(
      "Éditions, traductions et analyses. Elles ne sont pas des témoins des faits : elles interprètent les sources d'époque, et leur valeur tient à la rigueur de leur méthode.",
      "Editions, translations and analyses. They are not witnesses to the events: they interpret the period sources, and their value lies in the rigour of their method.",
    ),
  },
  { id: "d-jessopp", kind: "source", parent: "d-secondary", sourceId: "jessopp-james-1896", title: l("Jessopp & James (1896)", "Jessopp & James (1896)"), short: l("Première édition", "First edition"), summary: l("Édition et traduction du manuscrit ; M. R. James y doute déjà de Thomas.", "Edition and translation of the manuscript; M. R. James already doubts Thomas.") },
  { id: "d-rubin", kind: "source", parent: "d-secondary", sourceId: "rubin-2014", title: l("Miri Rubin (2014)", "Miri Rubin (2014)"), short: l("Traduction moderne", "Modern translation"), summary: l("Traduction anglaise de référence de la Vie et Passion.", "Standard English translation of the Life and Passion.") },
  { id: "d-langmuir", kind: "source", parent: "d-secondary", sourceId: "langmuir-1984", title: l("Gavin Langmuir (1984)", "Gavin Langmuir (1984)"), short: l("« Thomas of Monmouth: Detector of Ritual Murder »", "'Thomas of Monmouth: Detector of Ritual Murder'"), summary: l("Comment Thomas a construit l'accusation.", "How Thomas constructed the accusation.") },
  { id: "d-rose", kind: "source", parent: "d-secondary", sourceId: "rose-2015", title: l("E. M. Rose (2015)", "E. M. Rose (2015)"), short: l("The Murder of William of Norwich", "The Murder of William of Norwich"), summary: l("Les origines de l'accusation et sa diffusion au XIIe siècle.", "The origins of the accusation and its spread in the twelfth century.") },
  { id: "d-hsia", kind: "source", parent: "d-secondary", sourceId: "hsia-trent", title: l("R. Po-chia Hsia, Trent 1475", "R. Po-chia Hsia, Trent 1475"), short: l("Yale University Press", "Yale University Press"), summary: l("L'histoire du procès de Trente, reconstituée à partir de ses archives.", "The history of the Trent trial, reconstructed from its records.") },
  { id: "d-trachtenberg", kind: "source", parent: "d-secondary", sourceId: "trachtenberg-1943", title: l("Joshua Trachtenberg (1943)", "Joshua Trachtenberg (1943)"), short: l("The Devil and the Jews", "The Devil and the Jews"), summary: l("L'association médiévale entre Juifs et diable.", "The medieval association between Jews and the devil.") },
  { id: "d-tna", kind: "source", parent: "d-secondary", sourceId: "tna-jews-england", title: l("The National Archives", "The National Archives"), short: l("Jews in England, 1216–1272", "Jews in England, 1216–1272"), summary: l("Ressource pédagogique fondée sur des archives royales.", "Teaching resource based on royal records.") },
  { id: "d-ushmm", kind: "source", parent: "d-secondary", sourceId: "ushmm-blood-libel", title: l("USHMM — « Blood Libel »", "USHMM — 'Blood Libel'"), short: l("Encyclopédie de l'Holocauste", "Holocaust Encyclopedia"), summary: l("Synthèse sur l'histoire de l'accusation.", "Overview of the history of the accusation.") },

  {
    id: "d-dependencies",
    kind: "concept",
    parent: "b-docs",
    title: l("Qui dépend de qui ?", "Who depends on whom?"),
    short: l("Plusieurs copies ne font pas plusieurs témoins", "Several copies are not several witnesses"),
    summary: l(
      "Presque tout ce que l'on raconte sur Norwich remonte à un seul texte : celui de Thomas de Monmouth. Les éditions, traductions et récits ultérieurs en dérivent ; la Chronique de Peterborough relaie l'histoire, sans être un témoin indépendant. Compter ces textes comme autant de preuves reviendrait à compter plusieurs fois le même témoignage.",
      "Almost everything told about Norwich goes back to a single text: Thomas of Monmouth's. Later editions, translations and retellings derive from it; the Peterborough Chronicle relays the story without being an independent witness. Counting these texts as so many proofs would mean counting the same testimony several times.",
    ),
  },

  // ═════════════════════════ Claims ═════════════════════════
  {
    id: "c-circulated",
    kind: "claim",
    parent: "b-claims",
    title: l(
      "Une accusation de meurtre d'enfant visait les Juifs de Norwich au milieu du XIIe siècle",
      "An accusation of child murder targeted the Jews of Norwich in the mid-twelfth century",
    ),
    short: l("L'accusation a bien existé", "The accusation did exist"),
    summary: l(
      "Il est établi que l'accusation existait : elle est attestée par le texte de Thomas (vers 1150) et par la Chronique de Peterborough (vers 1155). Cela prouve l'existence de l'accusation — pas sa vérité.",
      "It is established that the accusation existed: it is attested by Thomas's text (c. 1150) and by the Peterborough Chronicle (c. 1155). This proves the accusation existed — not that it was true.",
    ),
    status: "established",
    assessment: initial(
      {
        status: "established",
        confidence: "high",
        favorable: [
          l("Le manuscrit de Thomas de Monmouth, authentique, développe l'accusation vers 1150.", "Thomas of Monmouth's authentic manuscript develops the accusation around 1150."),
          l("La Chronique de Peterborough la mentionne vers 1155, hors de Norwich.", "The Peterborough Chronicle mentions it around 1155, outside Norwich."),
        ],
        contrary: [],
        limits: [
          l("Les deux textes ne sont pas pleinement indépendants : la chronique relaie un récit diffusé par le culte de Norwich.", "The two texts are not fully independent: the chronicle relays a story spread by the Norwich cult."),
        ],
        reasoning: l(
          "Deux documents authentiques, d'origine différente, attestent que l'histoire circulait au milieu du XIIe siècle. C'est le seul point du dossier qui relève du fait établi au sens strict — il porte sur l'accusation, non sur les faits accusés.",
          "Two authentic documents, of different origin, attest that the story circulated in the mid-twelfth century. It is the only point in the dossier that is an established fact in the strict sense — it concerns the accusation, not the alleged acts.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-vita",
    kind: "evidence",
    parent: "c-circulated",
    sourceId: "thomas-vita",
    title: l("Le récit de Thomas", "Thomas's narrative"),
    short: l("Authentique, tardif, partisan", "Authentic, late, partisan"),
    summary: l("Le manuscrit prouve qu'un moine soutenait cette accusation vers 1150.", "The manuscript proves that a monk was promoting this accusation around 1150."),
    reading: {
      authenticity: l("Authentique : manuscrit du XIIe siècle (Cambridge UL, MS Add. 3037).", "Authentic: twelfth-century manuscript (Cambridge UL, MS Add. 3037)."),
      content: l(
        "Thomas affirme que des Juifs ont tué Guillaume en imitant la Passion du Christ. Il écrit pour faire reconnaître Guillaume comme martyr et attirer des pèlerins.",
        "Thomas asserts that Jews killed William by imitating Christ's Passion. He writes to have William recognised as a martyr and to attract pilgrims.",
      ),
      probative: l(
        "Prouve que l'accusation circulait vers 1150. Ne prouve pas qu'un meurtre rituel a eu lieu : l'auteur n'a été témoin de rien et rassemble des témoignages tardifs.",
        "Proves that the accusation circulated around 1150. Does not prove that a ritual murder took place: the author witnessed nothing and gathers late testimonies.",
      ),
    },
  },
  {
    id: "x-peterborough",
    kind: "evidence",
    parent: "c-circulated",
    sourceId: "peterborough-chronicle",
    locator: l("Annale de l'année 1137", "Annal for the year 1137"),
    title: l("La mention de Peterborough", "The Peterborough mention"),
    short: l("Le récit a voyagé", "The story travelled"),
    summary: l("Une chronique d'une autre abbaye reprend l'histoire quelques années plus tard.", "A chronicle from another abbey repeats the story a few years later."),
    reading: {
      authenticity: l("Authentique : chronique monastique du XIIe siècle.", "Authentic: twelfth-century monastic chronicle."),
      content: l("Affirme brièvement que les Juifs de Norwich ont martyrisé un enfant avant Pâques.", "Briefly states that the Jews of Norwich martyred a child before Easter."),
      probative: l(
        "Prouve la diffusion du récit vers 1155. Ne constitue pas un témoignage indépendant sur les faits : le chroniqueur n'était pas à Norwich en 1144.",
        "Proves the story had spread by about 1155. Not an independent testimony about the events: the chronicler was not in Norwich in 1144.",
      ),
    },
  },

  {
    id: "c-accused-1144",
    kind: "claim",
    parent: "b-claims",
    title: l(
      "Des Juifs ont été accusés du meurtre de Guillaume dès 1144",
      "Jews were accused of William's murder as early as 1144",
    ),
    short: l("Accusation immédiate ou construite plus tard ?", "Immediate accusation, or built later?"),
    summary: l(
      "Thomas raconte que la famille de Guillaume a accusé les Juifs dès la découverte du corps. C'est plausible, mais on ne le sait que par lui, qui écrit six ans plus tard avec un objectif précis.",
      "Thomas relates that William's family accused the Jews as soon as the body was found. This is plausible, but we only know it from him, writing six years later with a specific aim.",
    ),
    status: "plausible",
    assessment: initial(
      {
        status: "plausible",
        confidence: "medium",
        favorable: [
          l(
            "Thomas décrit une accusation portée par la famille et un refus du shérif d'abandonner les Juifs à la justice de l'évêque — un détail qui ne sert pas sa thèse et a donc des chances d'être authentique.",
            "Thomas describes an accusation brought by the family and the sheriff's refusal to hand the Jews over to the bishop's court — a detail that does not serve his thesis and so may well be genuine.",
          ),
        ],
        contrary: [
          l(
            "Selon Thomas lui-même, l'accusation ne rencontre guère d'écho avant son arrivée ; le récit du meurtre rituel se développe vers 1150.",
            "According to Thomas himself, the accusation finds little echo before his arrival; the ritual-murder narrative develops around 1150.",
          ),
        ],
        limits: [l("Aucune source indépendante de Thomas ne documente les années 1144–1150.", "No source independent of Thomas documents the years 1144–1150.")],
        reasoning: l(
          "Une accusation locale dès 1144 est vraisemblable, mais la seule source est un auteur engagé. La forme élaborée de l'accusation (meurtre rituel, complot) date, elle, de la rédaction de Thomas.",
          "A local accusation as early as 1144 is likely, but the only source is a committed author. The elaborate form of the accusation (ritual murder, conspiracy) dates from Thomas's writing.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-sheriff",
    kind: "evidence",
    parent: "c-accused-1144",
    sourceId: "thomas-vita",
    title: l("Le refus du shérif", "The sheriff's refusal"),
    short: l("Un détail qui dessert Thomas", "A detail that works against Thomas"),
    summary: l("Les autorités royales protègent les Juifs accusés.", "Royal authorities protect the accused Jews."),
    reading: {
      authenticity: l("Même manuscrit authentique que le reste du récit.", "Same authentic manuscript as the rest of the narrative."),
      content: l(
        "Le shérif John de Chesney estime que les Juifs ne relèvent pas du tribunal de l'évêque et les met en sûreté au château de Norwich.",
        "Sheriff John de Chesney holds that the Jews do not fall under the bishop's court and puts them in safety in Norwich castle.",
      ),
      probative: l(
        "Suggère qu'une accusation a été formulée tôt, et qu'elle n'a pas convaincu les autorités royales. Ne dit rien de la culpabilité de quiconque.",
        "Suggests that an accusation was made early, and that it did not convince the royal authorities. Says nothing about anyone's guilt.",
      ),
    },
  },

  {
    id: "c-killed-by-jews",
    kind: "claim",
    parent: "b-claims",
    title: l("Guillaume a été tué par des Juifs", "William was killed by Jews"),
    short: l("Aucune preuve fiable", "No reliable evidence"),
    summary: l(
      "Aucun élément fiable ne désigne un ou des meurtriers juifs. Les « preuves » de Thomas sont des témoignages tardifs, de seconde main, recueillis pour soutenir une conclusion déjà fixée.",
      "No reliable element points to a Jewish killer or killers. Thomas's 'proofs' are late, second-hand testimonies, collected to support a conclusion already decided.",
    ),
    status: "not_demonstrated",
    assessment: initial(
      {
        status: "not_demonstrated",
        confidence: "high",
        favorable: [
          l(
            "Thomas rapporte le témoignage tardif d'une servante chrétienne et les propos d'un converti, Théobald de Cambridge.",
            "Thomas reports the late testimony of a Christian servant woman and the words of a convert, Theobald of Cambridge.",
          ),
        ],
        contrary: [
          l("Ces témoignages sont recueillis des années après les faits, par un auteur partisan.", "These testimonies are collected years after the events, by a partisan author."),
          l("Les autorités royales de l'époque n'ont poursuivi personne.", "The royal authorities of the time prosecuted no one."),
          l("Dès 1896, M. R. James juge ces témoignages inventés ou manipulés.", "As early as 1896, M. R. James judges these testimonies invented or manipulated."),
        ],
        limits: [l("On ne sait pas qui a tué Guillaume : d'autres hypothèses existent, aucune n'est démontrée.", "We do not know who killed William: other hypotheses exist, none is proven.")],
        reasoning: l(
          "L'accusation repose sur une seule source, partiale et tardive. Ce n'est pas une preuve d'innocence au sens strict (on ignore qui est le meurtrier), d'où « non démontré » plutôt que « réfuté » pour ce point précis.",
          "The accusation rests on a single source, biased and late. This is not proof of innocence in the strict sense (we do not know who the killer was), hence 'not demonstrated' rather than 'refuted' for this specific point.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-testimonies",
    kind: "evidence",
    parent: "c-killed-by-jews",
    sourceId: "thomas-vita",
    title: l("Les témoins de Thomas", "Thomas's witnesses"),
    short: l("Tardifs et de seconde main", "Late and second-hand"),
    summary: l("Les seuls « témoins » de l'accusation passent tous par Thomas.", "The accusation's only 'witnesses' all come through Thomas."),
    reading: {
      authenticity: l("Le manuscrit est authentique ; l'existence et les propos des témoins ne sont connus que par lui.", "The manuscript is authentic; the existence and words of the witnesses are known only through it."),
      content: l(
        "Une servante aurait aperçu l'enfant dans une maison juive ; un converti, Théobald, aurait affirmé que les Juifs choisissaient chaque année une victime.",
        "A servant woman allegedly glimpsed the child in a Jewish house; a convert, Theobald, allegedly claimed that Jews chose a victim every year.",
      ),
      probative: l(
        "Valeur probante très faible : témoignages rapportés, non contradictoires, recueillis des années après. Ils documentent la fabrication du récit plus que les faits.",
        "Very weak probative value: reported testimonies, never cross-examined, collected years later. They document the making of the story rather than the events.",
      ),
    },
  },

  {
    id: "c-crucifixion",
    kind: "claim",
    parent: "b-claims",
    title: l("Le meurtre aurait reproduit la crucifixion", "The murder allegedly re-enacted the crucifixion"),
    short: l("Un motif né du récit", "A motif born of the narrative"),
    summary: l(
      "L'idée d'une « reproduction de la Passion » vient du récit hagiographique de Thomas, qui calque la mort de Guillaume sur celle du Christ. Rien d'extérieur à ce récit ne l'atteste.",
      "The idea of a 're-enactment of the Passion' comes from Thomas's hagiographic narrative, which models William's death on Christ's. Nothing outside this narrative attests it.",
    ),
    status: "not_demonstrated",
    assessment: initial(
      {
        status: "not_demonstrated",
        confidence: "high",
        favorable: [l("Le récit de Thomas décrit des blessures qu'il interprète comme une imitation de la Passion.", "Thomas's narrative describes wounds that he interprets as an imitation of the Passion.")],
        contrary: [
          l("Le modèle de la Passion est un procédé classique de l'hagiographie : il sert à faire d'un mort un martyr.", "The Passion model is a standard device of hagiography: it serves to turn a dead person into a martyr."),
          l("Selon M. R. James, la dimension rituelle n'apparaît qu'après les déclarations de Théobald.", "According to M. R. James, the ritual dimension only appears after Theobald's statements."),
        ],
        limits: [l("L'état du corps n'est connu que par la description de Thomas, plusieurs années après.", "The state of the body is known only from Thomas's description, several years later.")],
        reasoning: l(
          "Le motif de la crucifixion est une interprétation de l'auteur, construite pour un culte. Il ne repose sur aucun constat indépendant.",
          "The crucifixion motif is the author's interpretation, built for a cult. It rests on no independent observation.",
        ),
      },
      FIRST,
    ),
  },

  {
    id: "c-blood",
    kind: "claim",
    parent: "b-claims",
    title: l("Les Juifs utilisaient du sang humain dans leurs rites", "Jews used human blood in their rites"),
    short: l("La « libelle du sang »", "The 'blood libel'"),
    summary: l(
      "C'est faux. Cette accusation apparaît en 1235 à Fulda — elle est absente du récit de Norwich — et elle contredit l'interdit du sang qui est au cœur de la loi alimentaire juive. Elle a été rejetée par une enquête impériale (1236) et par le pape (1247).",
      "This is false. The accusation appears in 1235 at Fulda — it is absent from the Norwich narrative — and it contradicts the ban on blood at the heart of Jewish dietary law. It was rejected by an imperial inquiry (1236) and by the pope (1247).",
    ),
    status: "refuted",
    assessment: initial(
      {
        status: "refuted",
        confidence: "high",
        favorable: [l("Des aveux en ce sens ont été obtenus, notamment à Trente — sous la torture.", "Confessions to this effect were obtained, notably at Trent — under torture.")],
        contrary: [
          l("La Bible hébraïque et la loi juive interdisent de consommer du sang (Lévitique 17, 10–14).", "The Hebrew Bible and Jewish law forbid consuming blood (Leviticus 17:10–14)."),
          l("Enquête de Frédéric II (1236) : aucun rite juif ne requiert de sang.", "Frederick II's inquiry (1236): no Jewish rite requires blood."),
          l("Lettre d'Innocent IV (1247) condamnant ces accusations.", "Innocent IV's letter (1247) condemning these accusations."),
          l("Le motif du sang est absent du premier récit (Norwich) : il apparaît près d'un siècle plus tard.", "The blood motif is absent from the first narrative (Norwich): it appears nearly a century later."),
        ],
        limits: [],
        reasoning: l(
          "Plusieurs éléments positifs et indépendants contredisent l'affirmation : une norme religieuse explicite, deux enquêtes médiévales, et l'histoire même de l'accusation, qui montre que ce motif a été ajouté tardivement.",
          "Several positive and independent elements contradict the claim: an explicit religious norm, two medieval inquiries, and the history of the accusation itself, which shows that this motif was added later.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-leviticus",
    kind: "evidence",
    parent: "c-blood",
    sourceId: "leviticus-17",
    locator: l("Lévitique 17, 10–14 ; Deutéronome 12, 16 et 23", "Leviticus 17:10–14; Deuteronomy 12:16, 23"),
    title: l("L'interdit du sang", "The ban on blood"),
    short: l("Au cœur de la loi juive", "At the heart of Jewish law"),
    summary: l("La consommation de sang, même animal, est interdite.", "Consuming blood, even animal blood, is forbidden."),
    reading: {
      authenticity: l("Texte normatif bien établi.", "Well-established normative text."),
      content: l("Interdit explicite de manger du sang ; la pratique de la cacheroute vise à retirer le sang de la viande.", "Explicit ban on eating blood; kashrut practice aims to remove blood from meat."),
      probative: l(
        "Contredit directement l'idée d'un rite juif utilisant du sang. Un tel rite serait contraire à une règle fondamentale du judaïsme.",
        "Directly contradicts the idea of a Jewish rite using blood. Such a rite would violate a fundamental rule of Judaism.",
      ),
    },
  },
  {
    id: "x-frederick",
    kind: "evidence",
    parent: "c-blood",
    sourceId: "frederick-ii-1236",
    title: l("L'enquête de Frédéric II", "Frederick II's inquiry"),
    short: l("1236 : non coupables", "1236: not guilty"),
    summary: l("Une enquête médiévale conclut à l'innocence des Juifs.", "A medieval inquiry concludes that the Jews are innocent."),
    reading: {
      authenticity: l("Acte impérial connu par l'édition des actes de Frédéric II (référence à vérifier).", "Imperial charter known through the edition of Frederick II's charters (reference to be checked)."),
      content: l(
        "Après consultation de convertis connaissant la loi juive, l'empereur déclare qu'aucun rite juif ne requiert de sang et interdit de répandre l'accusation.",
        "After consulting converts familiar with Jewish law, the emperor declares that no Jewish rite requires blood and forbids spreading the accusation.",
      ),
      probative: l(
        "Fort : une autorité chrétienne médiévale, sans intérêt à protéger les Juifs, enquête et rejette l'accusation. Arrive trop tard pour les victimes de Fulda.",
        "Strong: a medieval Christian authority, with no interest in shielding Jews, investigates and rejects the accusation. Comes too late for the victims of Fulda.",
      ),
    },
  },
  {
    id: "x-innocent",
    kind: "evidence",
    parent: "c-blood",
    sourceId: "innocent-iv-1247",
    title: l("La lettre d'Innocent IV", "Innocent IV's letter"),
    short: l("1247 : le pape condamne", "1247: the pope condemns"),
    summary: l("Le pape demande l'annulation des mesures prises contre des Juifs accusés.", "The pope orders measures against accused Jews to be annulled."),
    reading: {
      authenticity: l("Lettre pontificale conservée et éditée.", "Papal letter preserved and edited."),
      content: l(
        "Innocent IV dénonce les accusations de meurtre rituel et ceux qui s'en servent pour s'emparer des biens juifs.",
        "Innocent IV denounces ritual-murder accusations and those who use them to seize Jewish property.",
      ),
      probative: l(
        "Montre que la plus haute autorité de l'Église jugeait ces accusations infondées et intéressées.",
        "Shows that the highest authority of the Church judged these accusations unfounded and self-serving.",
      ),
    },
  },

  {
    id: "c-devil-images",
    kind: "claim",
    parent: "b-claims",
    title: l(
      "Des représentations chrétiennes médiévales associaient les Juifs au diable",
      "Medieval Christian imagery associated Jews with the devil",
    ),
    short: l("Les images existent bel et bien", "The images do exist"),
    summary: l(
      "C'est établi. Des documents authentiques, comme la caricature de 1233 sur un rôle de l'Échiquier, montrent des Juifs de Norwich entourés de démons. Ces images documentent un préjugé chrétien — pas une pratique juive.",
      "This is established. Authentic documents, such as the 1233 caricature on an Exchequer roll, show Jews of Norwich surrounded by demons. These images document a Christian prejudice — not a Jewish practice.",
    ),
    status: "established",
    assessment: initial(
      {
        status: "established",
        confidence: "high",
        favorable: [
          l("Caricature de l'Échiquier, 1233 (The National Archives, E 401/1565).", "Exchequer caricature, 1233 (The National Archives, E 401/1565)."),
          l("Études de synthèse, dont Trachtenberg, The Devil and the Jews (1943).", "Overview studies, including Trachtenberg, The Devil and the Jews (1943)."),
        ],
        contrary: [],
        limits: [l("Ces images reflètent le regard de leurs auteurs chrétiens, non la vie des communautés juives.", "These images reflect the gaze of their Christian makers, not the life of Jewish communities.")],
        reasoning: l(
          "Il faut distinguer deux affirmations : « il existait des images associant Juifs et diable » (établi, les documents existent) et « les Juifs avaient des pratiques sataniques » (contredit par les preuves).",
          "Two claims must be distinguished: 'there were images associating Jews with the devil' (established, the documents exist) and 'Jews had satanic practices' (contradicted by the evidence).",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-e401",
    kind: "evidence",
    parent: "c-devil-images",
    sourceId: "tna-e401-1565",
    title: l("La caricature de 1233", "The 1233 caricature"),
    short: l("Isaac de Norwich et le diable « Colbif »", "Isaac of Norwich and the devil 'Colbif'"),
    summary: l("Un dessin authentique, tracé par un clerc de l'administration royale.", "An authentic drawing, made by a clerk of the royal administration."),
    reading: {
      authenticity: l("Authentique : en marge d'un rôle fiscal de 1233 conservé aux National Archives.", "Authentic: on a 1233 tax roll kept at The National Archives."),
      content: l(
        "Isaac de Norwich, couronné, Mosse Mokke et Abigail, entourés de démons ; un diable nommé « Colbif » les désigne.",
        "Isaac of Norwich, crowned, Mosse Mokke and Abigail, surrounded by demons; a devil named 'Colbif' points at them.",
      ),
      probative: l(
        "Prouve que des chrétiens de l'administration royale associaient les Juifs au diable. Ne prouve rien sur les pratiques des Juifs représentés.",
        "Proves that Christians in the royal administration associated Jews with the devil. Proves nothing about the practices of the Jews depicted.",
      ),
    },
  },

  {
    id: "c-satanic",
    kind: "claim",
    parent: "b-claims",
    title: l("Les Juifs pratiquaient des rites sataniques", "Jews practised satanic rites"),
    short: l("Une projection, pas une observation", "A projection, not an observation"),
    summary: l(
      "Aucune source juive ni aucune observation directe n'atteste de tels rites. Cette idée provient uniquement de représentations chrétiennes hostiles, alors que les pratiques religieuses juives sont abondamment documentées par leurs propres textes.",
      "No Jewish source and no direct observation attests such rites. The idea comes solely from hostile Christian representations, whereas Jewish religious practice is extensively documented by its own texts.",
    ),
    status: "contradicted",
    assessment: initial(
      {
        status: "contradicted",
        confidence: "high",
        favorable: [l("Images et textes polémiques chrétiens associant Juifs et diable.", "Christian polemical images and texts associating Jews with the devil.")],
        contrary: [
          l("Ces documents expriment le regard de leurs auteurs, non une observation de pratiques juives.", "These documents express their authors' view, not an observation of Jewish practice."),
          l("Les pratiques religieuses juives médiévales sont connues par une abondante littérature juive (liturgie, droit, commentaires) qui ne contient rien de tel.", "Medieval Jewish religious practice is known through an abundant Jewish literature (liturgy, law, commentary) that contains nothing of the sort."),
        ],
        limits: [],
        reasoning: l(
          "Les seuls « éléments favorables » sont des représentations polémiques ; ils renseignent sur ceux qui les ont produites. Les sources sur la pratique juive réelle contredisent l'affirmation.",
          "The only 'favourable elements' are polemical representations; they tell us about those who produced them. The sources on actual Jewish practice contradict the claim.",
        ),
      },
      FIRST,
    ),
  },

  {
    id: "c-trent-confessions",
    kind: "claim",
    parent: "b-claims",
    title: l("Les aveux de Trente prouvent un meurtre rituel", "The Trent confessions prove a ritual murder"),
    short: l("Des aveux obtenus sous la torture", "Confessions obtained under torture"),
    summary: l(
      "Non. Les aveux ont été arrachés sous la torture ; ce sont des Juifs qui avaient signalé la découverte du corps ; l'envoyé du pape a douté de leur culpabilité ; et l'Église a aboli en 1965 le culte fondé sur ce procès.",
      "No. The confessions were extracted under torture; it was Jews who had reported the discovery of the body; the pope's envoy doubted their guilt; and the Church abolished in 1965 the cult founded on this trial.",
    ),
    status: "refuted",
    assessment: initial(
      {
        status: "refuted",
        confidence: "high",
        favorable: [l("Les procès-verbaux contiennent des aveux détaillés.", "The records contain detailed confessions.")],
        contrary: [
          l("Les aveux ont été obtenus sous la torture : ils reproduisent ce que les juges voulaient entendre.", "The confessions were obtained under torture: they echo what the judges wanted to hear."),
          l("Les Juifs ont eux-mêmes signalé la découverte du corps — un fait omis dans le résumé officiel de 1478–1479.", "The Jews themselves reported the discovery of the body — a fact left out of the official summary of 1478–1479."),
          l("Le commissaire pontifical doute ; la bulle de 1478 ne se prononce pas sur les faits.", "The papal commissioner has doubts; the 1478 bull makes no finding on the facts."),
          l("Abolition du culte de Simon en 1965.", "Abolition of Simon's cult in 1965."),
        ],
        limits: [l("La cause exacte de la mort de Simon n'est pas établie.", "The exact cause of Simon's death is not established.")],
        reasoning: l(
          "Un aveu obtenu sous la torture n'a pas de valeur probante. Les éléments indépendants du dossier de l'accusation (comportement des accusés, doutes du commissaire pontifical) vont tous dans le même sens.",
          "A confession obtained under torture has no probative value. The elements independent of the prosecution's record (the accused's conduct, the papal commissioner's doubts) all point the same way.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "x-torture",
    kind: "evidence",
    parent: "c-trent-confessions",
    sourceId: "trent-trial-records",
    title: l("Les procès-verbaux", "The trial records"),
    short: l("Aveux sous la torture", "Confessions under torture"),
    summary: l("Un document authentique qui prouve… la méthode des juges.", "An authentic document that proves… the judges' method."),
    reading: {
      authenticity: l("Authentique : actes produits par le tribunal en 1475–1476.", "Authentic: records produced by the court in 1475–1476."),
      content: l("Les accusés « avouent » un meurtre rituel au fil d'interrogatoires sous la torture.", "The accused 'confess' to ritual murder over interrogations under torture."),
      probative: l(
        "Prouve que les aveux ont été obtenus par la contrainte. Ne prouve pas les faits avoués ; le dossier a été compilé pour justifier les exécutions.",
        "Proves the confessions were obtained by coercion. Does not prove the confessed acts; the record was compiled to justify the executions.",
      ),
    },
  },
  {
    id: "x-report",
    kind: "evidence",
    parent: "c-trent-confessions",
    sourceId: "hsia-trent",
    title: l("Qui a signalé le corps ?", "Who reported the body?"),
    short: l("Les Juifs eux-mêmes", "The Jews themselves"),
    summary: l("Un comportement peu compatible avec la dissimulation d'un crime.", "Conduct hardly compatible with concealing a crime."),
    reading: {
      authenticity: l("Fait établi par l'étude des archives du procès.", "Fact established by study of the trial records."),
      content: l("Le corps est trouvé dans la cave de Samuel ; celui-ci et deux autres Juifs le signalent aux autorités.", "The body is found in Samuel's cellar; he and two other Jews report it to the authorities."),
      probative: l("Contredit le scénario d'un crime collectif dissimulé ; ce fait a été omis du récit officiel ultérieur.", "Contradicts the scenario of a concealed collective crime; this fact was omitted from the later official account."),
    },
  },

  {
    id: "c-spread",
    kind: "claim",
    parent: "b-claims",
    title: l("Ces accusations se sont propagées dans l'Europe médiévale", "These accusations spread across medieval Europe"),
    short: l("De l'Angleterre à l'Italie", "From England to Italy"),
    summary: l(
      "Établi. Après Norwich, des accusations similaires sont documentées en Angleterre, en France, dans l'Empire et en Italie, souvent avec des conséquences meurtrières.",
      "Established. After Norwich, similar accusations are documented in England, France, the Empire and Italy, often with deadly consequences.",
    ),
    status: "established",
    assessment: initial(
      {
        status: "established",
        confidence: "high",
        favorable: [
          l("Affaires documentées : Gloucester (1168), Blois (1171), Bury St Edmunds (1181), Winchester (v. 1232), Fulda (1235), Lincoln (1255), Trente (1475)…", "Documented cases: Gloucester (1168), Blois (1171), Bury St Edmunds (1181), Winchester (c. 1232), Fulda (1235), Lincoln (1255), Trent (1475)…"),
          l("Les National Archives indiquent que ces accusations atteignent les cours royales anglaises dans les années 1230.", "The National Archives state that these accusations reach the English royal courts in the 1230s."),
        ],
        contrary: [],
        limits: [
          l("La propagation de l'accusation est établie ; la transmission directe d'une affaire à l'autre ne l'est pas toujours.", "The spread of the accusation is established; direct transmission from one case to the next is not always."),
        ],
        reasoning: l(
          "La multiplication des affaires est solidement documentée. Attention : cela prouve la diffusion d'une croyance, pas la réalité des faits allégués.",
          "The multiplication of cases is solidly documented. Note: this proves the spread of a belief, not the reality of the alleged acts.",
        ),
      },
      FIRST,
    ),
  },
  {
    id: "c-filiation",
    kind: "claim",
    parent: "c-spread",
    title: l("Chaque nouvelle affaire découle directement de Norwich", "Each new case derives directly from Norwich"),
    short: l("Similitude ≠ filiation", "Similarity ≠ lineage"),
    summary: l(
      "Pour certaines affaires anglaises et pour Blois, des historiens (dont E. M. Rose) proposent une influence directe du modèle norvicois. Pour d'autres, on constate seulement une ressemblance de récit. La carte distingue les deux.",
      "For some English cases and for Blois, historians (including E. M. Rose) propose a direct influence of the Norwich model. For others, we only observe a similar narrative. The map distinguishes the two.",
    ),
    status: "plausible",
    assessment: initial(
      {
        status: "plausible",
        confidence: "medium",
        favorable: [l("Rose retrace des liens entre Norwich, Gloucester, Blois, Bury St Edmunds et Paris.", "Rose traces links between Norwich, Gloucester, Blois, Bury St Edmunds and Paris.")],
        contrary: [l("Pour Fulda, Lincoln ou Trente, aucune transmission directe depuis Norwich n'est documentée.", "For Fulda, Lincoln or Trent, no direct transmission from Norwich is documented.")],
        limits: [l("Les sources mentionnent rarement d'où les accusateurs tenaient leur modèle.", "The sources rarely say where the accusers got their model from.")],
        reasoning: l(
          "Une ressemblance entre deux récits ne prouve pas que l'un descende de l'autre. La filiation est proposée pour quelques cas proches dans le temps et l'espace ; elle n'est pas généralisable.",
          "A resemblance between two narratives does not prove that one descends from the other. Lineage is proposed for a few cases close in time and space; it cannot be generalised.",
        ),
      },
      FIRST,
    ),
  },

  // ═════════════════════════ Assessments ═════════════════════════
  {
    id: "v-frederick",
    kind: "event",
    parent: "b-eval",
    sourceId: "frederick-ii-1236",
    title: l("L'enquête impériale de Frédéric II", "Frederick II's imperial inquiry"),
    short: l("1236", "1236"),
    date: { label: l("1236", "1236"), year: 1236 },
    status: "established",
    summary: l(
      "Après Fulda, l'empereur fait examiner l'accusation par des Juifs convertis au christianisme. Conclusion : aucun rite juif ne requiert de sang. Il innocente les Juifs de l'Empire et interdit de répandre l'accusation.",
      "After Fulda, the emperor has the accusation examined by Jewish converts to Christianity. Conclusion: no Jewish rite requires blood. He clears the Jews of the Empire and forbids spreading the accusation.",
    ),
  },
  {
    id: "v-innocent",
    kind: "event",
    parent: "b-eval",
    sourceId: "innocent-iv-1247",
    title: l("La condamnation d'Innocent IV", "Innocent IV's condemnation"),
    short: l("5 juillet 1247", "5 July 1247"),
    date: { label: l("5 juillet 1247", "5 July 1247"), year: 1247 },
    place: place("Lyon (résidence pontificale)", "Lyon (papal residence)", 45.764, 4.836),
    status: "established",
    summary: l(
      "Le pape ordonne aux prélats d'Allemagne et de France d'annuler les mesures prises contre des Juifs sur la base d'accusations de meurtre rituel.",
      "The pope orders the prelates of Germany and France to annul measures taken against Jews on the basis of ritual-murder accusations.",
    ),
  },
  {
    id: "v-james",
    kind: "interpretation",
    parent: "b-eval",
    sourceId: "jessopp-james-1896",
    title: l("M. R. James : des témoignages fabriqués", "M. R. James: fabricated testimonies"),
    short: l("1896", "1896"),
    summary: l(
      "En éditant le manuscrit, M. R. James juge les témoignages de Thomas inventés, peu fiables ou manipulés, et estime que la dimension rituelle n'apparaît qu'après les déclarations du converti Théobald.",
      "Editing the manuscript, M. R. James judges Thomas's testimonies invented, unreliable or manipulated, and considers that the ritual dimension only appears after the statements of the convert Theobald.",
    ),
  },
  {
    id: "v-langmuir",
    kind: "interpretation",
    parent: "b-eval",
    sourceId: "langmuir-1984",
    title: l("Langmuir : Thomas « détecteur » de meurtre rituel", "Langmuir: Thomas, 'detector' of ritual murder"),
    short: l("1984", "1984"),
    summary: l(
      "Gavin Langmuir montre comment Thomas assemble rumeurs et témoignages pour produire, a posteriori, le premier récit de meurtre rituel juif — un fantasme promis à une longue postérité.",
      "Gavin Langmuir shows how Thomas pieces together rumours and testimonies to produce, after the fact, the first narrative of Jewish ritual murder — a fantasy destined for a long afterlife.",
    ),
  },
  {
    id: "v-rose",
    kind: "interpretation",
    parent: "b-eval",
    sourceId: "rose-2015",
    title: l("Rose : une accusation née d'un procès pour dette", "Rose: an accusation born of a debt trial"),
    short: l("2015", "2015"),
    summary: l(
      "E. M. Rose relie l'émergence de l'accusation au procès de Simon de Novers, chevalier accusé d'avoir tué son banquier juif. Une lecture influente, qui reste une interprétation et non un fait établi.",
      "E. M. Rose links the emergence of the accusation to the trial of Simon de Novers, a knight accused of killing his Jewish banker. An influential reading, which remains an interpretation rather than an established fact.",
    ),
  },
  {
    id: "v-consensus",
    kind: "conclusion",
    parent: "b-eval",
    title: l("L'état des connaissances", "The state of knowledge"),
    short: l("Consensus des historiens", "Historians' consensus"),
    status: "refuted",
    summary: l(
      "Les historiens s'accordent : aucune affaire de « meurtre rituel juif » n'a jamais été démontrée. Ils débattent en revanche des raisons pour lesquelles l'accusation est née et s'est diffusée (culte local, intérêts financiers, tensions religieuses, procédures judiciaires).",
      "Historians agree: no case of 'Jewish ritual murder' has ever been demonstrated. They do debate why the accusation arose and spread (local cults, financial interests, religious tensions, judicial procedures).",
    ),
  },

  // ═════════════════════════ Spread ═════════════════════════
  {
    id: "s-ritual",
    kind: "concept",
    parent: "b-spread",
    title: l("Le « meurtre rituel »", "'Ritual murder'"),
    short: l("XIIe siècle : imiter la crucifixion", "12th century: imitating the crucifixion"),
    date: { label: l("À partir de 1144–1150", "From 1144–1150"), year: 1150 },
    summary: l(
      "Première forme de l'accusation : des Juifs tueraient un enfant chrétien en reproduisant la Passion du Christ. Elle naît du récit de Norwich.",
      "First form of the accusation: Jews allegedly kill a Christian child by re-enacting Christ's Passion. It is born of the Norwich narrative.",
    ),
  },
  {
    id: "s-blood",
    kind: "concept",
    parent: "b-spread",
    title: l("La « libelle du sang »", "The 'blood libel'"),
    short: l("XIIIe siècle : l'usage du sang", "13th century: the use of blood"),
    date: { label: l("À partir de 1235", "From 1235"), year: 1235 },
    summary: l(
      "À Fulda en 1235 apparaît une variante : les Juifs tueraient pour recueillir le sang de leurs victimes. Plus tard, on prétendra qu'il servirait à la fabrication du pain azyme de Pâque.",
      "At Fulda in 1235 a variant appears: Jews allegedly kill to collect their victims' blood. Later, it will be claimed that the blood served to make Passover matzah.",
    ),
  },
  {
    id: "s-devil",
    kind: "concept",
    parent: "b-spread",
    title: l("Juifs et diable", "Jews and the devil"),
    short: l("Une image, un préjugé", "An image, a prejudice"),
    summary: l(
      "Dans l'imaginaire chrétien médiéval, les Juifs sont associés au diable (caricature de 1233, art religieux, prédication). Cette association nourrit et rend crédibles les accusations de crimes rituels.",
      "In the medieval Christian imagination, Jews are associated with the devil (the 1233 caricature, religious art, preaching). This association feeds and lends credibility to the ritual-crime accusations.",
    ),
  },
  {
    id: "s-modern",
    kind: "concept",
    parent: "b-spread",
    title: l("Réemplois modernes", "Modern reuses"),
    short: l("Une accusation qui ne disparaît pas", "An accusation that does not die"),
    summary: l(
      "L'accusation est reprise à l'époque contemporaine, notamment par la propagande antisémite et, récemment, par des théories du complot en ligne qui en recyclent les motifs. Ce dossier traitera ces réemplois dans une prochaine version.",
      "The accusation is revived in modern times, notably by antisemitic propaganda and, recently, by online conspiracy theories that recycle its motifs. This dossier will cover these reuses in a future version.",
    ),
  },

  // ═════════════════════════ Unknowns ═════════════════════════
  {
    id: "u-killer",
    kind: "question",
    parent: "b-unknown",
    title: l("Qui a tué Guillaume ?", "Who killed William?"),
    short: l("On ne sait pas", "We do not know"),
    status: "undetermined",
    summary: l(
      "Les historiens ont proposé plusieurs hypothèses — accident, crime d'un inconnu, crime à caractère sexuel, rôle d'un membre de l'entourage — sans qu'aucune ne soit démontrée. L'incertitude sur le meurtrier ne rend pas plausible l'accusation de meurtre rituel.",
      "Historians have proposed several hypotheses — accident, a crime by a stranger, a sexual crime, the involvement of someone close to him — none of them proven. Uncertainty about the killer does not make the ritual-murder accusation plausible.",
    ),
  },
  {
    id: "u-1144",
    kind: "question",
    parent: "b-unknown",
    title: l("L'accusation date-t-elle de 1144 ou de 1150 ?", "Does the accusation date from 1144 or 1150?"),
    short: l("Ce que l'on sait passe par Thomas", "What we know comes through Thomas"),
    status: "undetermined",
    summary: l(
      "Faute de sources indépendantes pour 1144–1150, on ne peut pas savoir précisément sous quelle forme l'accusation existait avant la rédaction de Thomas.",
      "For lack of independent sources for 1144–1150, we cannot know exactly in what form the accusation existed before Thomas wrote.",
    ),
  },
  {
    id: "u-thomas",
    kind: "question",
    parent: "b-unknown",
    title: l("Quelle part Thomas a-t-il inventée ?", "How much did Thomas invent?"),
    short: l("Recueil ou fabrication ?", "Collection or fabrication?"),
    status: "undetermined",
    summary: l(
      "Les historiens débattent : Thomas a-t-il rassemblé des rumeurs existantes, ou a-t-il lui-même façonné le récit ? Sans doute un peu des deux ; la part exacte reste discutée.",
      "Historians debate whether Thomas gathered existing rumours or shaped the narrative himself. Probably some of both; the exact share remains debated.",
    ),
  },
  {
    id: "u-transmission",
    kind: "question",
    parent: "b-unknown",
    title: l("Comment le récit a-t-il voyagé ?", "How did the story travel?"),
    short: l("Réseaux monastiques, prédication, rumeur ?", "Monastic networks, preaching, rumour?"),
    status: "undetermined",
    summary: l(
      "Les voies précises de transmission d'une affaire à l'autre sont rarement documentées. La carte distingue les liens proposés par les historiens des simples ressemblances.",
      "The precise routes of transmission from one case to another are rarely documented. The map distinguishes links proposed by historians from mere resemblances.",
    ),
  },
];
