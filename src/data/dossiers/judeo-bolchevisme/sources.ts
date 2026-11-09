import type { L, Source } from "../../types";

const l = (fr: string, en: string): L => ({ fr, en });
const CHECKED = "2026-11-09";

/**
 * Source library for the "Judeo-Bolshevism" dossier.
 * `url` only when the page was opened and its content checked; no quotations yet.
 */
export const sources: Source[] = [
  // ───────────────────────── Primary sources ─────────────────────────
  {
    id: "sovnarkom-1917",
    title: "Décret sur la formation du gouvernement ouvrier et paysan / Decree on the formation of the Workers' and Peasants' Government",
    author: "IIe Congrès des soviets de Russie / Second All-Russian Congress of Soviets",
    date: l("8 novembre 1917 (26 octobre, calendrier julien)", "8 November 1917 (26 October, Julian calendar)"),
    nature: "primary",
    type: l("Décret officiel", "Official decree"),
    language: l("Russe", "Russian"),
    edition: l(
      "Vtoroi vserossiiskii s\"ezd Sovetov… sbornik dokumentov (Moscou, 1957), p. 79–80 ; traduction anglaise : Decrees of the Soviet Government, vol. I (1957), p. 20–21, reprise par le projet Seventeen Moments in Soviet History.",
      "Vtoroi vserossiiskii s\"ezd Sovetov… sbornik dokumentov (Moscow, 1957), pp. 79–80; English translation: Decrees of the Soviet Government, vol. I (1957), pp. 20–21, reproduced by the Seventeen Moments in Soviet History project.",
    ),
    url: "https://soviethistory.msu.edu/1917/first-bolshevik-decrees/first-bolshevik-decrees-texts/soviet-of-peoples-commissars-sovnarkom/",
    description: l(
      "Le texte qui nomme le premier gouvernement bolchevik : Lénine à la présidence, puis Rykov, Milioutine, Chliapnikov, le comité de la Guerre (Antonov-Ovseïenko, Krylenko, Dybenko), Noguine, Lounatcharski, Skvortsov-Stepanov, Trotski, Lomov, Teodorovitch, Glebov-Avilov et Staline ; le poste des Chemins de fer reste vacant. Sur ces quinze hommes, un seul, Trotski (né Lev Bronstein), est d'origine juive.",
      "The text naming the first Bolshevik government: Lenin as chairman, then Rykov, Milyutin, Shlyapnikov, the War committee (Antonov-Ovseenko, Krylenko, Dybenko), Nogin, Lunacharsky, Skvortsov-Stepanov, Trotsky, Lomov, Teodorovich, Glebov-Avilov and Stalin; the Railways post is left vacant. Of these fifteen men, only one, Trotsky (born Lev Bronstein), was of Jewish origin.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Liste des commissaires, date et références d'édition vérifiées sur la traduction en ligne.", "List of commissars, date and edition references checked on the online translation."),
    },
  },
  {
    id: "jta-1926",
    title: "Jews constitute only 3.6% of Communist party membership in Russia",
    author: "Jewish Telegraphic Agency",
    date: l("28 octobre 1926", "28 October 1926"),
    nature: "primary",
    type: l("Dépêche d'agence (presse juive de l'époque)", "Wire report (contemporary Jewish press)"),
    language: l("Anglais", "English"),
    url: "https://www.jta.org/archive/jews-constitute-only-3-6-of-communist-party-membership-in-russia",
    description: l(
      "Rapporte les chiffres officiels : 19 562 membres juifs du parti en 1922, soit 5,2 % ; environ 37 000 début 1926, soit 3,6 %. Dans les villes d'Ukraine, 9 Juifs sur 1 000 sont communistes, contre 23 sur 1 000 parmi les non-Juifs.",
      "Reports the official figures: 19,562 Jewish party members in 1922, i.e. 5.2%; about 37,000 at the start of 1926, i.e. 3.6%. In Ukrainian towns, 9 Jews per 1,000 are Communists, against 23 per 1,000 among non-Jews.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Article consulté ; chiffres vérifiés. Ce sont des statistiques officielles soviétiques, relayées par la presse.", "Article read; figures checked. These are official Soviet statistics, relayed by the press."),
    },
  },
  {
    id: "census-1926",
    title: "Recensement de l'URSS de 1926 / 1926 Soviet census",
    author: "Administration statistique centrale de l'URSS / Central Statistical Administration of the USSR",
    date: l("1926", "1926"),
    nature: "primary",
    type: l("Recensement", "Census"),
    language: l("Russe", "Russian"),
    description: l(
      "Environ 2,6 à 2,7 millions de Juifs recensés, soit environ 1,8 % de la population de l'Union soviétique.",
      "About 2.6 to 2.7 million Jews counted, about 1.8% of the population of the Soviet Union.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l(
        "Chiffres recoupés dans des comptes rendus de la JTA et des études démographiques ; les totaux publiés varient légèrement (2 600 945 ou 2 672 000). Publication officielle à consulter.",
        "Figures cross-checked in JTA reports and demographic studies; published totals vary slightly (2,600,945 or 2,672,000). Official publication to be consulted.",
      ),
    },
  },
  {
    id: "churchill-1920",
    title: "Zionism versus Bolshevism: A Struggle for the Soul of the Jewish People",
    author: "Winston S. Churchill",
    date: l("8 février 1920", "8 February 1920"),
    nature: "primary",
    type: l("Article de presse (Illustrated Sunday Herald, Londres)", "Newspaper article (Illustrated Sunday Herald, London)"),
    language: l("Anglais", "English"),
    description: l(
      "Alors ministre de la Guerre, Churchill oppose les « bons » Juifs sionistes ou nationaux aux « Juifs internationaux » qu'il associe au bolchevisme. L'article montre que l'idée d'un bolchevisme juif circulait jusque dans les élites britanniques. Il prouve la diffusion de l'idée, pas sa justesse.",
      "Then Secretary of State for War, Churchill contrasts 'good' Zionist or national Jews with the 'international Jews' he associates with Bolshevism. The article shows that the idea of a Jewish Bolshevism circulated even among the British elite. It proves the spread of the idea, not its accuracy.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Titre, date et contexte recoupés par plusieurs sources, dont le Churchill Project (Hillsdale College). Texte original à consulter avant toute citation.", "Title, date and context cross-checked in several sources, including the Churchill Project (Hillsdale College). Original text to be read before quoting."),
    },
  },
  {
    id: "times-1921",
    title: "The Truth about 'The Protocols': A Literary Forgery",
    author: "Philip Graves, The Times (Londres / London)",
    date: l("16–18 août 1921", "16–18 August 1921"),
    nature: "primary",
    type: l("Série d'articles de presse", "Newspaper series"),
    language: l("Anglais", "English"),
    url: "https://encyclopedia.ushmm.org/content/en/artifact/the-times-august-17-1921",
    description: l(
      "Le correspondant du Times démontre que les « Protocoles des Sages de Sion » plagient un pamphlet de Maurice Joly (1864) qui ne parlait pas des Juifs. Ce faux, diffusé après 1917 comme « preuve » d'un complot juif derrière la révolution, est démasqué dès 1921 — et continue pourtant de circuler.",
      "The Times correspondent shows that the 'Protocols of the Elders of Zion' plagiarise a pamphlet by Maurice Joly (1864) that was not about Jews. This forgery, spread after 1917 as 'proof' of a Jewish plot behind the revolution, was exposed as early as 1921 — and still circulates.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Présentation de l'article vérifiée dans l'Encyclopédie de l'Holocauste (USHMM).", "Description of the article checked in the Holocaust Encyclopedia (USHMM)."),
    },
  },
  {
    id: "goebbels-1935",
    title: "Discours de Joseph Goebbels au congrès de Nuremberg / Joseph Goebbels's Nuremberg rally speech",
    author: "Joseph Goebbels",
    date: l("Septembre 1935", "September 1935"),
    nature: "primary",
    type: l("Discours filmé", "Filmed speech"),
    language: l("Allemand", "German"),
    description: l(
      "Le ministre de la Propagande assimile le bolchevisme à la « juiverie internationale » et dénonce un prétendu complot juif contre la civilisation occidentale. Exemple daté de l'usage du mythe au cœur de l'idéologie nazie.",
      "The Propaganda Minister equates Bolshevism with 'international Jewry' and denounces an alleged Jewish plot against Western civilisation. A dated example of the myth at the heart of Nazi ideology.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Contenu connu par la notice d'archives filmées de l'USHMM ; page non consultée directement.", "Content known from the USHMM film archive notice; page not read directly."),
    },
  },
  {
    id: "poster-1943",
    title: "« La Constitution de Staline ? » — affiche nazie / 'The Stalin Constitution?' — Nazi poster",
    author: "Propagande allemande en Ukraine occupée / German propaganda in occupied Ukraine",
    date: l("Octobre 1943", "October 1943"),
    nature: "primary",
    type: l("Affiche de propagande", "Propaganda poster"),
    holding: l("United States Holocaust Memorial Museum", "United States Holocaust Memorial Museum"),
    language: l("Ukrainien", "Ukrainian"),
    url: "https://encyclopedia.ushmm.org/content/en/artifact/nazi-propaganda-poster-titled-the-stalin-constitution",
    description: l(
      "Caricature de Staline affublée de symboles juifs, suggérant que le régime soviétique serait dirigé par les Juifs. Diffusée en Ukraine occupée alors que les nazis et leurs collaborateurs y avaient déjà assassiné la plupart des Juifs.",
      "Caricature of Stalin covered in Jewish symbols, suggesting the Soviet regime was run by Jews. Distributed in occupied Ukraine when the Nazis and their collaborators had already murdered most of its Jews.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Notice de l'objet vérifiée (USHMM). L'image n'est pas reproduite ici.", "Object notice checked (USHMM). The image is not reproduced here."),
    },
  },
  {
    id: "jta-1956",
    title: "Khrushchev says Stalin planned huge anti-Semitic plot in Russia",
    author: "Jewish Telegraphic Agency",
    date: l("19 mars 1956", "19 March 1956"),
    nature: "primary",
    type: l("Dépêche d'agence", "Wire report"),
    language: l("Anglais", "English"),
    url: "https://www.jta.org/archive/khrushchev-says-stalin-planned-huge-anti-semitic-plot-in-russia",
    description: l(
      "Rend compte du discours de Khrouchtchev au XXe Congrès : Staline voulait transformer le « complot des médecins juifs » de 1953 en grand procès antisémite ; il est aussi accusé d'avoir fait tuer les généraux juifs Iakir et Gamarnik. Après la mort de Staline, le complot est reconnu comme une fabrication et les médecins sont libérés.",
      "Reports Khrushchev's speech to the 20th Congress: Stalin meant to turn the 1953 'Jewish doctors' plot' into a great antisemitic trial; he is also accused of having the Jewish generals Yakir and Gamarnik killed. After Stalin's death the plot is acknowledged as a fabrication and the doctors are released.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Article consulté ; contenu vérifié.", "Article read; content checked."),
    },
  },
  {
    id: "jafc-archive",
    title: "Archives du Comité antifasciste juif / Records of the Jewish Anti-Fascist Committee",
    author: "Archives d'État de la Fédération de Russie (GARF) / State Archive of the Russian Federation",
    date: l("1942–1948", "1942–1948"),
    nature: "primary",
    type: l("Fonds d'archives", "Archival collection"),
    holding: l("GARF, fonds 8114, inventaire 1 (copie numérique à l'USHMM)", "GARF, fond 8114, opis 1 (digital copy at the USHMM)"),
    language: l("Russe, yiddish", "Russian, Yiddish"),
    description: l(
      "Archives du comité créé pendant la guerre pour mobiliser le soutien juif à l'URSS, dissous par le régime en 1948. Plusieurs de ses membres, dont des écrivains yiddish, sont exécutés le 12 août 1952.",
      "Records of the committee set up during the war to rally Jewish support for the USSR, dissolved by the regime in 1948. Several of its members, including Yiddish writers, were executed on 12 August 1952.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Cote et dépôt recoupés via le portail EHRI ; date des exécutions recoupée dans plusieurs synthèses.", "Shelfmark and holding cross-checked via the EHRI portal; date of the executions cross-checked in several overviews."),
    },
  },
  {
    id: "loc-antireligious",
    title: "Revelations from the Russian Archives — Anti-Religious Campaigns",
    author: "Library of Congress (exposition / exhibit)",
    date: l("1992 (exposition), miroir en ligne", "1992 (exhibit), online mirror"),
    nature: "reference",
    type: l("Exposition fondée sur des archives soviétiques", "Exhibit based on Soviet archives"),
    language: l("Anglais", "English"),
    url: "https://ibiblio.org/expo/soviet.exhibit/anti_rel.html",
    description: l(
      "Les campagnes antireligieuses visent toutes les religions : l'Église orthodoxe d'abord (en 1939, environ 500 églises restent ouvertes sur plus de 50 000), mais aussi les catholiques, les protestants, l'islam — et le judaïsme, attaqué sans relâche au point que sa pratique organisée devient presque impossible.",
      "Anti-religious campaigns target every religion: the Orthodox Church first (by 1939, about 500 of more than 50,000 churches remain open), but also Catholics, Protestants, Islam — and Judaism, attacked so relentlessly that its organised practice becomes nearly impossible.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Page consultée sur un miroir de l'exposition de la Library of Congress ; l'adresse d'origine (loc.gov) n'est plus en ligne.", "Page read on a mirror of the Library of Congress exhibit; the original loc.gov address is no longer online."),
    },
  },

  // ───────────────────────── Scholarship ─────────────────────────
  {
    id: "hanebrink-2018",
    title: "A Specter Haunting Europe: The Myth of Judeo-Bolshevism",
    author: "Paul Hanebrink",
    date: l("2018", "2018"),
    nature: "secondary",
    type: l("Monographie universitaire (Belknap Press / Harvard University Press)", "Academic monograph (Belknap Press / Harvard University Press)"),
    holding: l("ISBN 9780674047686", "ISBN 9780674047686"),
    language: l("Anglais", "English"),
    description: l(
      "Histoire de référence du mythe, des contre-révolutions de l'après-1918 (Hongrie, Pologne, Roumanie, Allemagne) à la Shoah, à la guerre froide et à aujourd'hui. Hanebrink traite le mythe comme un code culturel : il reconnaît que des Juifs ont rejoint les mouvements communistes, mais rejette l'idée que les Juifs aient créé le bolchevisme ou doivent en porter les crimes.",
      "The standard history of the myth, from the post-1918 counter-revolutions (Hungary, Poland, Romania, Germany) to the Holocaust, the Cold War and today. Hanebrink treats the myth as a cultural code: he acknowledges that some Jews joined communist movements, but rejects the idea that Jews created Bolshevism or should bear its crimes.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Titre, éditeur, année et ISBN recoupés (catalogues, comptes rendus) ; page éditeur non lisible par notre outil.", "Title, publisher, year and ISBN cross-checked (catalogues, reviews); publisher page not readable by our tool."),
    },
  },
  {
    id: "snyder-2011",
    title: "Hitler vs. Stalin: Who Killed More?",
    author: "Timothy Snyder",
    date: l("10 mars 2011", "10 March 2011"),
    nature: "secondary",
    type: l("Article (The New York Review of Books)", "Essay (The New York Review of Books)"),
    language: l("Anglais", "English"),
    url: "https://www.nybooks.com/articles/2011/03/10/hitler-vs-stalin-who-killed-more/",
    description: l(
      "Bilan fondé sur les archives soviétiques : environ 6 millions de civils tués délibérément sous Staline, environ 9 millions en incluant les morts prévisibles (déportations, faim, camps). Famines de 1930–1933 : plus de 5 millions de morts, dont environ 3,3 millions en Ukraine et 1,3 million au Kazakhstan. Grande Terreur : 682 691 exécutions. Les estimations de 20 millions ou plus dataient d'avant l'ouverture des archives.",
      "An archive-based assessment: about 6 million civilians deliberately killed under Stalin, about 9 million including foreseeable deaths (deportation, hunger, camps). Famines of 1930–1933: over 5 million dead, about 3.3 million of them in Ukraine and 1.3 million in Kazakhstan. Great Terror: 682,691 executions. Estimates of 20 million or more predated the opening of the archives.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Article consulté ; chiffres vérifiés.", "Article read; figures checked."),
    },
  },
  {
    id: "huri-famine",
    title: "Direct Famine Losses in Ukraine, 1932–1934 (MAPA: Digital Atlas of Ukraine)",
    author: "Harvard Ukrainian Research Institute, d'après / after Rudnytskyi, Levchuk, Wolowyna, Shevchuk et al.",
    date: l("2015–2019", "2015–2019"),
    nature: "secondary",
    type: l("Étude démographique et atlas", "Demographic study and atlas"),
    language: l("Anglais, ukrainien", "English, Ukrainian"),
    description: l(
      "Reconstruction démographique : environ 3,9 millions de pertes directes (décès en excès) en Ukraine soviétique pour 1932–1934, et 0,6 million de naissances perdues.",
      "Demographic reconstruction: about 3.9 million direct losses (excess deaths) in Soviet Ukraine for 1932–1934, plus 0.6 million lost births.",
    ),
    verification: {
      status: "partial",
      checkedOn: CHECKED,
      note: l("Chiffres recoupés dans plusieurs présentations du projet ; pages HURI non lisibles par notre outil.", "Figures cross-checked in several presentations of the project; HURI pages not readable by our tool."),
    },
  },
  {
    id: "lipes-2018",
    title: "Between the 'Whites' and the 'Reds': Who carried out pogroms against the Jews during the Civil War?",
    author: "Nadia Lipes (entretien avec / interview by Andriy Kobalia), Ukrainian Jewish Encounter",
    date: l("26 novembre 2018", "26 November 2018"),
    nature: "secondary",
    type: l("Entretien avec une historienne", "Interview with a historian"),
    language: l("Anglais (traduit de l'ukrainien)", "English (translated from Ukrainian)"),
    url: "https://ukrainianjewishencounter.org/en/between-the-whites-and-the-reds-who-carried-out-pogroms-against-the-jews-during-the-civil-war/",
    description: l(
      "Plus de 800 pogroms entre 1917 et 1920, 50 000 à 100 000 morts selon les estimations. Auteurs : unités armées ukrainiennes, bandes d'atamans, troupes blanches de Dénikine, et aussi certaines unités de l'Armée rouge. Le stéréotype du « Juif communiste » y sert de prétexte central.",
      "More than 800 pogroms between 1917 and 1920, 50,000 to 100,000 dead by various estimates. Perpetrators: Ukrainian armed units, otamans' bands, Denikin's White troops, and also some Red Army units. The 'Jewish communist' stereotype serves as a central pretext.",
    ),
    verification: {
      status: "verified",
      checkedOn: CHECKED,
      note: l("Entretien consulté ; chiffres et attributions vérifiés (qualitatifs, sans répartition chiffrée).", "Interview read; figures and attributions checked (qualitative, no numeric breakdown)."),
    },
  },
  {
    id: "slezkine-2004",
    title: "The Jewish Century",
    author: "Yuri Slezkine",
    date: l("2004", "2004"),
    nature: "secondary",
    type: l("Monographie (Princeton University Press)", "Monograph (Princeton University Press)"),
    language: l("Anglais", "English"),
    description: l(
      "Étude de la place des Juifs dans la modernité, notamment de leur surreprésentation dans les élites soviétiques des années 1920–1930, qu'il explique par l'urbanisation, l'instruction et l'exclusion subie sous le tsarisme. Son interprétation est discutée.",
      "A study of the place of Jews in modernity, notably their overrepresentation in the Soviet elites of the 1920s–1930s, which he explains by urbanisation, education and exclusion under tsarism. His interpretation is debated.",
    ),
    verification: {
      status: "to_verify",
      checkedOn: CHECKED,
      note: l("Référence bibliographique standard ; pages à préciser.", "Standard bibliographic reference; pages to be specified."),
    },
  },
];
