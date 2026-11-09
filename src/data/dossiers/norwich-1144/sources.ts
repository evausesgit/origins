import type { L, Source } from "../../types";

const l = (fr: string, en: string): L => ({ fr, en });
const CHECKED = "2026-11-09";

/**
 * Source library for the Norwich 1144 dossier.
 *
 * Rules applied here:
 * - `url` only when the link was opened and its metadata checked (verification.status = "verified").
 * - No `quote` is filled: exact quotations will be added only after checking them
 *   against an edition, with their precise location.
 */
export const sources: Source[] = [
  // ───────────────────────── Primary sources ─────────────────────────
  {
    id: "thomas-vita",
    title: "Vita et passio sancti Willelmi martyris Norwicensis (The Life and Passion of William of Norwich)",
    author: "Thomas de Monmouth / Thomas of Monmouth",
    date: l(
      "Rédaction commencée vers 1150, quelques années après la mort de Guillaume ; les derniers livres sont plus tardifs (datation fine à confirmer).",
      "Writing begun around 1150, several years after William's death; the last books are later (precise dating to be confirmed).",
    ),
    nature: "primary",
    type: l("Hagiographie (vie de saint et recueil de miracles)", "Hagiography (saint's life and collection of miracles)"),
    provenance: l(
      "Manuscrit unique, provenant de la bibliothèque paroissiale de Brent Eleigh (Suffolk), acquis ensuite par la bibliothèque universitaire de Cambridge.",
      "Unique manuscript, from the parish library of Brent Eleigh (Suffolk), later acquired by Cambridge University Library.",
    ),
    holding: l("Cambridge University Library, MS Add. 3037", "Cambridge University Library, MS Add. 3037"),
    language: l("Latin", "Latin"),
    edition: l(
      "Éditions consultables : Jessopp & James (1896) ; traduction anglaise de Miri Rubin (2014).",
      "Usable editions: Jessopp & James (1896); English translation by Miri Rubin (2014).",
    ),
    description: l(
      "Seul récit détaillé de l'affaire. Thomas, moine du prieuré cathédral de Norwich arrivé après les faits, y présente la mort de Guillaume comme un meurtre rituel commis par des Juifs, afin de promouvoir le culte du garçon comme martyr. C'est la source de presque tout ce que l'on croit savoir de l'affaire — y compris des éléments qui contredisent sa propre thèse.",
      "The only detailed account of the case. Thomas, a monk of Norwich cathedral priory who arrived after the events, presents William's death as a ritual murder committed by Jews in order to promote the boy's cult as a martyr. It is the source of nearly everything we think we know about the case — including elements that contradict its own thesis.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l(
        "Cote du manuscrit et provenance confirmées par plusieurs notices. Pas de lien vers une numérisation : aucune n'a pu être vérifiée à ce jour.",
        "Shelfmark and provenance confirmed by several catalogue records. No link to a digitisation: none could be verified yet.",
      ),
    },
  },
  {
    id: "jessopp-james-1896",
    title: "The Life and Miracles of St William of Norwich by Thomas of Monmouth",
    author: "Augustus Jessopp & M. R. James (éd. et trad. / eds. and trans.)",
    date: l("1896", "1896"),
    nature: "secondary",
    type: l("Édition critique et traduction anglaise", "Critical edition and English translation"),
    holding: l("Cambridge University Press (réédition numérique)", "Cambridge University Press (digital reissue)"),
    language: l("Latin et anglais", "Latin and English"),
    url: "https://www.cambridge.org/core/books/life-and-miracles-of-st-william-of-norwich-by-thomas-of-monmouth/9B1E8D7DA0FF61A88BEEA2027178E649",
    description: l(
      "Première édition du manuscrit de Cambridge. Dans son introduction, M. R. James juge déjà les témoignages rassemblés par Thomas peu fiables, voire fabriqués, et n'exclut pas d'autres causes de la mort.",
      "First edition of the Cambridge manuscript. In the introduction, M. R. James already judges the testimonies collected by Thomas unreliable or even fabricated, and does not rule out other causes of death.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l(
        "Notice de l'éditeur repérée ; la pagination de l'introduction reste à vérifier avant toute citation.",
        "Publisher record located; the introduction's pagination must be checked before any quotation.",
      ),
    },
    derivedFrom: ["thomas-vita"],
  },
  {
    id: "rubin-2014",
    title: "The Life and Passion of William of Norwich",
    author: "Thomas of Monmouth, trad. / trans. Miri Rubin",
    date: l("2014", "2014"),
    nature: "secondary",
    type: l("Traduction anglaise commentée", "Annotated English translation"),
    holding: l("Penguin Classics", "Penguin Classics"),
    language: l("Anglais (traduction du latin)", "English (translated from Latin)"),
    description: l(
      "Traduction moderne de référence, avec une introduction historique. Recommandée pour lire Thomas dans le texte.",
      "Standard modern translation, with a historical introduction. Recommended for reading Thomas directly.",
    ),
    verification: {
      status: "to_verify",
      checkedOn: CHECKED,
      note: l("Métadonnées connues par la littérature secondaire ; lien éditeur à ajouter.", "Metadata known from the secondary literature; publisher link to be added."),
    },
    derivedFrom: ["thomas-vita"],
  },
  {
    id: "peterborough-chronicle",
    title: "Peterborough Chronicle (Anglo-Saxon Chronicle, manuscrit E / manuscript E)",
    author: "Moines de l'abbaye de Peterborough / Monks of Peterborough Abbey",
    date: l(
      "Annale rédigée vers 1155 (placée sous l'année 1137, dans le récit du règne d'Étienne).",
      "Annal written around 1155 (placed under the year 1137, within the account of Stephen's reign).",
    ),
    nature: "primary",
    type: l("Chronique monastique", "Monastic chronicle"),
    holding: l("Bodleian Library, Oxford, MS Laud Misc. 636", "Bodleian Library, Oxford, MS Laud Misc. 636"),
    language: l("Vieil anglais tardif / moyen anglais primitif", "Late Old English / early Middle English"),
    description: l(
      "Mentionne brièvement que les Juifs de Norwich auraient martyrisé un enfant chrétien. Elle montre que le récit circulait hors de Norwich au milieu du XIIe siècle, mais elle n'est pas un témoin indépendant des faits : elle relaie une histoire déjà diffusée par le culte norvicois.",
      "Briefly states that the Jews of Norwich allegedly martyred a Christian child. It shows that the story circulated beyond Norwich by the mid-twelfth century, but it is not an independent witness of the events: it relays a story already spread by the Norwich cult.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l(
        "Datation de l'annale (vers 1155) recoupée ; cote et texte exact à vérifier sur une édition avant citation.",
        "Dating of the annal (c. 1155) cross-checked; shelfmark and exact wording to be checked on an edition before quoting.",
      ),
    },
    derivedFrom: [],
  },
  {
    id: "tna-e401-1565",
    title: "Exchequer receipt roll, Hilary term 1233 — caricature des Juifs de Norwich / caricature of the Jews of Norwich",
    author: "Scribe anonyme de l'Échiquier / Anonymous Exchequer clerk",
    date: l("Vers 1233", "c. 1233"),
    nature: "primary",
    type: l("Dessin satirique en tête d'un rôle fiscal", "Satirical drawing at the head of a tax roll"),
    holding: l("The National Archives (Kew), E 401/1565", "The National Archives (Kew), E 401/1565"),
    language: l("Latin (annotations)", "Latin (captions)"),
    url: "https://www.nationalarchives.gov.uk/education/teaching-resources/jews-in-england-1216-1272/",
    description: l(
      "Dessin authentique, tracé sur un rôle enregistrant les impôts payés au roi par les Juifs de Norwich. On y voit Isaac de Norwich, le plus riche financier juif de la ville, ainsi que Mosse Mokke et Abigail (Avegay), entourés de figures démoniaques ; un diable nommé « Colbif » désigne Mosse et Abigail. Document essentiel pour montrer l'association visuelle entre Juifs et diable — pas pour établir quoi que ce soit sur les pratiques juives.",
      "Authentic drawing on a roll recording taxes paid to the king by the Jews of Norwich. It shows Isaac of Norwich, the city's richest Jewish financier, together with Mosse Mokke and Abigail (Avegay), surrounded by demonic figures; a devil named 'Colbif' points at Mosse and Abigail. A key document for the visual association between Jews and the devil — not for establishing anything about Jewish practice.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l(
        "Cote, datation et description vérifiées sur la ressource pédagogique des National Archives (source 2).",
        "Shelfmark, dating and description checked on The National Archives teaching resource (source 2).",
      ),
    },
  },
  {
    id: "tna-just1-775",
    title: "Hampshire eyre roll — affaire de Winchester / Winchester case (JUST 1/775, m. 20)",
    author: "Cour royale itinérante / Royal eyre court",
    date: l("Vers 1232", "c. 1232"),
    nature: "primary",
    type: l("Rôle judiciaire", "Court roll"),
    holding: l("The National Archives (Kew), JUST 1/775, m. 20", "The National Archives (Kew), JUST 1/775, m. 20"),
    language: l("Latin", "Latin"),
    url: "https://www.nationalarchives.gov.uk/education/teaching-resources/jews-in-england-1216-1272/",
    description: l(
      "Procès concernant la mort d'un enfant d'un an, Stephen, à Winchester : un jury désigne un Juif, Abraham Pinche. Les National Archives soulignent que ces accusations étaient très probablement inventées, mais désormais prises au sérieux par la justice royale.",
      "Proceedings about the death of a one-year-old child, Stephen, in Winchester: a jury names a Jew, Abraham Pinche. The National Archives stress that such accusations were most likely made up, but were now being taken seriously by royal justice.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Cote et résumé vérifiés sur la ressource des National Archives (source 3).", "Shelfmark and summary checked on The National Archives resource (source 3)."),
    },
  },
  {
    id: "trent-trial-records",
    title: "Actes du procès de Trente / Trent trial records (1475–1476)",
    author: "Tribunal du prince-évêque de Trente / Court of the prince-bishop of Trent",
    date: l("1475–1476", "1475–1476"),
    nature: "primary",
    type: l("Procès-verbaux d'interrogatoires (obtenus sous la torture)", "Interrogation records (obtained under torture)"),
    holding: l(
      "Plusieurs copies ; Hsia s'appuie principalement sur le « manuscrit Yeshiva » (lieu de conservation à préciser).",
      "Several copies; Hsia relies mainly on the 'Yeshiva Manuscript' (holding institution to be specified).",
    ),
    language: l("Latin", "Latin"),
    description: l(
      "Dossier produit par les accusateurs pour justifier les exécutions et appuyer le culte du petit Simon. Il prouve ce que les juges ont fait dire aux accusés, pas ce que les accusés ont fait.",
      "Records produced by the accusers to justify the executions and support the cult of little Simon. They prove what the judges made the defendants say, not what the defendants did.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Nature du document confirmée par la présentation de l'ouvrage de Hsia.", "Nature of the document confirmed by the publisher's description of Hsia's book."),
    },
  },
  {
    id: "innocent-iv-1247",
    title: "Lettre du pape Innocent IV aux prélats d'Allemagne et de France / Letter of Pope Innocent IV to the prelates of Germany and France (5 juillet / July 1247)",
    author: "Innocent IV",
    date: l("5 juillet 1247", "5 July 1247"),
    nature: "primary",
    type: l("Lettre pontificale", "Papal letter"),
    language: l("Latin", "Latin"),
    edition: l(
      "Éditée notamment dans S. Grayzel, The Church and the Jews in the XIIIth Century (édition à vérifier).",
      "Edited notably in S. Grayzel, The Church and the Jews in the XIIIth Century (edition to be checked).",
    ),
    description: l(
      "Le pape ordonne d'annuler les mesures prises contre des Juifs sur la base d'accusations de meurtre rituel et condamne ceux qui s'en servent pour saisir leurs biens.",
      "The pope orders measures taken against Jews on the basis of ritual-murder accusations to be annulled, and condemns those who use them to seize Jewish property.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Date et contenu recoupés dans la littérature de référence ; texte latin à consulter.", "Date and content cross-checked in reference works; Latin text to be consulted."),
    },
  },
  {
    id: "frederick-ii-1236",
    title: "Déclaration de l'empereur Frédéric II après l'affaire de Fulda / Declaration of Emperor Frederick II after the Fulda case (1236)",
    author: "Frédéric II de Hohenstaufen / Frederick II of Hohenstaufen",
    date: l("Printemps 1236 (selon l'Encyclopaedia Judaica)", "Spring 1236 (according to the Encyclopaedia Judaica)"),
    nature: "primary",
    type: l("Acte impérial", "Imperial charter"),
    language: l("Latin", "Latin"),
    edition: l("Die Urkunden Friedrichs II. (MGH) — référence exacte à vérifier.", "Die Urkunden Friedrichs II. (MGH) — exact reference to be checked."),
    url: "https://www.encyclopedia.com/religion/encyclopedias-almanacs-transcripts-and-maps/frederick-ii-hohenstaufendeg",
    description: l(
      "Après Fulda, l'empereur consulte des Juifs convertis au christianisme, réputés connaître de l'intérieur la loi juive. Leur conclusion : aucun rite juif ne requiert de sang, et la consommation de sang est expressément interdite. L'empereur innocente les Juifs d'Allemagne et interdit de répandre l'accusation.",
      "After Fulda, the emperor consults Jewish converts to Christianity, deemed to know Jewish law from the inside. Their conclusion: no Jewish rite requires blood, and consuming blood is expressly forbidden. The emperor clears the Jews of Germany and forbids spreading the accusation.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l(
        "Contenu vérifié dans l'Encyclopaedia Judaica (lien) ; l'acte lui-même reste à consulter dans l'édition critique.",
        "Content checked in the Encyclopaedia Judaica (link); the charter itself still has to be read in the critical edition.",
      ),
    },
  },
  {
    id: "leviticus-17",
    title: "Lévitique 17, 10–14 ; Deutéronome 12, 16 et 23 / Leviticus 17:10–14; Deuteronomy 12:16, 23",
    author: "Bible hébraïque / Hebrew Bible",
    date: l("Antiquité", "Antiquity"),
    nature: "primary",
    type: l("Texte religieux normatif", "Normative religious text"),
    language: l("Hébreu", "Hebrew"),
    description: l(
      "Interdiction explicite de consommer du sang, reprise par la loi juive (cacheroute : la viande est salée pour en retirer le sang). Une accusation d'usage rituel du sang contredit donc frontalement les normes religieuses juives documentées.",
      "Explicit prohibition on consuming blood, taken up by Jewish law (kashrut: meat is salted to remove blood). An accusation of ritual use of blood therefore runs directly against documented Jewish religious norms.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Références bibliques standard.", "Standard biblical references."),
    },
  },
  {
    id: "trent-1965-decree",
    title: "Abolition du culte de Simon de Trente / Abolition of the cult of Simon of Trent (28 octobre / October 1965)",
    author: "Mgr Alessandro Maria Gottardi, archevêque de Trente / Archbishop of Trent",
    date: l("28 octobre 1965", "28 October 1965"),
    nature: "primary",
    type: l("Décision ecclésiastique", "Ecclesiastical decision"),
    language: l("Italien", "Italian"),
    description: l(
      "L'archevêché de Trente abolit le culte de Simon et supprime la procession, reconnaissant implicitement que l'accusation fondatrice était fausse.",
      "The archdiocese of Trent abolishes Simon's cult and suppresses the procession, implicitly acknowledging that the founding accusation was false.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Date recoupée (USHMM et littérature) ; texte du décret à consulter.", "Date cross-checked (USHMM and literature); text of the decree to be consulted."),
    },
  },

  // ───────────────────────── Scholarship ─────────────────────────
  {
    id: "rose-2015",
    title: "The Murder of William of Norwich: The Origins of the Blood Libel in Medieval Europe",
    author: "E. M. Rose",
    date: l("2015", "2015"),
    nature: "secondary",
    type: l("Monographie universitaire", "Academic monograph"),
    holding: l("Oxford University Press — DOI 10.1093/acprof:oso/9780190219628.001.0001", "Oxford University Press — DOI 10.1093/acprof:oso/9780190219628.001.0001"),
    language: l("Anglais", "English"),
    url: "https://academic.oup.com/book/1457",
    description: l(
      "Rattache l'accusation au procès de Simon de Novers, chevalier endetté accusé d'avoir tué son banquier juif, Deulesalt : le récit du meurtre rituel aurait servi la défense du chevalier, soutenu par l'évêque. Suit ensuite la diffusion de l'accusation à Gloucester (1168), Blois (1171), Bury St Edmunds (1181) et Paris.",
      "Links the accusation to the trial of Simon de Novers, an indebted knight accused of killing his Jewish banker, Deulesalt: the ritual-murder story allegedly served the knight's defence, backed by the bishop. Then follows the spread of the accusation to Gloucester (1168), Blois (1171), Bury St Edmunds (1181) and Paris.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Auteur, titre, éditeur, année (2015), DOI et résumé vérifiés sur Oxford Academic.", "Author, title, publisher, year (2015), DOI and abstract checked on Oxford Academic."),
    },
    derivedFrom: ["thomas-vita"],
  },
  {
    id: "hsia-trent",
    title: "Trent 1475: Stories of a Ritual Murder Trial",
    author: "R. Po-chia Hsia",
    date: l("1992 (1re éd.) ; édition de poche 1996", "1992 (1st ed.); paperback 1996"),
    nature: "secondary",
    type: l("Monographie universitaire", "Academic monograph"),
    holding: l("Yale University Press — ISBN 9780300068726 (poche, 1996)", "Yale University Press — ISBN 9780300068726 (paperback, 1996)"),
    language: l("Anglais", "English"),
    url: "https://yalebooks.yale.edu/book/9780300068726/trent-1475/",
    description: l(
      "Reconstitue le procès de Trente principalement à partir du « manuscrit Yeshiva », le dossier produit par les autorités pour justifier les exécutions et appuyer la canonisation du « petit martyr Simon ». Étudie victimes, accusateurs, témoins hostiles et les rares voisins qui ont tenté d'aider.",
      "Reconstructs the Trent trial mainly from the 'Yeshiva Manuscript', the record produced by the authorities to justify the executions and support the canonisation of 'Little Martyr Simon'. Studies the victims, prosecutors, hostile witnesses and the few neighbours who tried to help.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l(
        "Titre, auteur, éditeur, ISBN et date de l'édition de poche (25 sept. 1996) vérifiés chez Yale University Press. Date de la 1re édition (1992) d'après la littérature.",
        "Title, author, publisher, ISBN and paperback date (25 Sept 1996) checked at Yale University Press. First-edition date (1992) from the literature.",
      ),
    },
    derivedFrom: ["trent-trial-records"],
  },
  {
    id: "langmuir-1984",
    title: "Thomas of Monmouth: Detector of Ritual Murder",
    author: "Gavin I. Langmuir",
    date: l("1984", "1984"),
    nature: "secondary",
    type: l("Article scientifique (Speculum, vol. 59, n° 4)", "Journal article (Speculum, vol. 59, no. 4)"),
    language: l("Anglais", "English"),
    description: l(
      "Article fondateur : montre comment Thomas de Monmouth a construit, plusieurs années après les faits, le récit d'un meurtre rituel, et fait de Norwich la première accusation de ce type connue.",
      "Foundational article: shows how Thomas of Monmouth constructed, years after the events, the story of a ritual murder, and identifies Norwich as the first known accusation of this kind.",
    ),
    verification: {
      status: "to_verify",
      checkedOn: CHECKED,
      note: l("Référence bibliographique standard ; pagination et lien stable à vérifier.", "Standard bibliographic reference; pagination and stable link to be checked."),
    },
    derivedFrom: ["thomas-vita"],
  },
  {
    id: "trachtenberg-1943",
    title: "The Devil and the Jews: The Medieval Conception of the Jew and Its Relation to Modern Antisemitism",
    author: "Joshua Trachtenberg",
    date: l("1943", "1943"),
    nature: "secondary",
    type: l("Monographie (Yale University Press)", "Monograph (Yale University Press)"),
    language: l("Anglais", "English"),
    description: l(
      "Étude classique de la manière dont la culture chrétienne médiévale a associé les Juifs au diable, à la sorcellerie et au meurtre rituel.",
      "Classic study of how medieval Christian culture associated Jews with the devil, sorcery and ritual murder.",
    ),
    verification: {
      status: "to_verify",
      checkedOn: CHECKED,
      note: l("Référence bibliographique standard ; lien à ajouter.", "Standard bibliographic reference; link to be added."),
    },
  },
  {
    id: "tna-jews-england",
    title: "Jews in England, 1216–1272",
    author: "The National Archives (UK)",
    date: l("Ressource en ligne", "Online resource"),
    nature: "reference",
    type: l("Ressource pédagogique fondée sur des archives", "Archive-based teaching resource"),
    language: l("Anglais", "English"),
    url: "https://www.nationalarchives.gov.uk/education/teaching-resources/jews-in-england-1216-1272/",
    description: l(
      "Quatre documents d'archives (rôles fiscaux, caricature de Norwich, procès de Winchester, Statut de la Juiverie de 1253) pour étudier les relations entre chrétiens et Juifs. Indique que les accusations de violence juive contre des enfants circulent depuis les années 1140 et atteignent les cours royales dans les années 1230.",
      "Four archival documents (tax rolls, the Norwich caricature, the Winchester case, the 1253 Statute of Jewry) to study relations between Christians and Jews. States that accusations of Jewish violence against children had circulated since the 1140s and reached the royal courts in the 1230s.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Page consultée ; contenu et cotes vérifiés.", "Page read; content and shelfmarks checked."),
    },
    derivedFrom: ["tna-e401-1565", "tna-just1-775"],
  },
  {
    id: "ushmm-blood-libel",
    title: "Blood Libel",
    author: "United States Holocaust Memorial Museum — Holocaust Encyclopedia",
    date: l("Article en ligne", "Online article"),
    nature: "reference",
    type: l("Article d'encyclopédie", "Encyclopedia article"),
    language: l("Anglais", "English"),
    url: "https://encyclopedia.ushmm.org/content/en/article/blood-libel",
    description: l(
      "Synthèse de référence : présente Norwich (1144) comme le premier cas médiéval, énumère les affaires suivantes (Gloucester 1168, Blois 1171, Saragosse 1182, Bristol 1183, Fulda 1235, Lincoln 1255, Munich 1286), rappelle les aveux obtenus sous la torture à Trente (1475) et l'abolition du culte de Simon en 1965.",
      "Reference overview: presents Norwich (1144) as the first medieval case, lists later cases (Gloucester 1168, Blois 1171, Saragossa 1182, Bristol 1183, Fulda 1235, Lincoln 1255, Munich 1286), recalls the confessions obtained under torture at Trent (1475) and the abolition of Simon's cult in 1965.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Article consulté ; contenu résumé vérifié.", "Article read; summarised content checked."),
    },
  },
];
