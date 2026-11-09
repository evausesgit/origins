# ORIGINES

**Retrouver l'origine d'une idée. Consulter les preuves. Se faire son propre jugement.**
*Trace an idea back to its origin. Read the evidence. Make up your own mind.*

ORIGINES est une plateforme d'exploration historique, bilingue (français / anglais). Au centre d'une carte mentale animée : une affirmation. Autour : ses origines, les événements, les documents, les preuves pour et contre, les évaluations des historiens et ce qui reste inconnu. On zoome progressivement jusqu'aux sources.

Premier dossier : **Norwich 1144** — l'accusation de « meurtre rituel » portée contre les Juifs, de Norwich (1144) à Trente (1475).

## Lancer le site

Node 20+ (testé avec Node 22).

```bash
npm install
npm run dev          # http://localhost:3000  → redirige vers /fr ou /en selon le navigateur
```

Vérifications :

```bash
npm run check        # typecheck + lint + tests (intégrité du jeu de données, i18n, mise en page)
npm run build && npm start
```

## Ce qui est en place (phase 1, plus une partie de la phase 3)

- **Carte mentale** (React Flow) : une question au centre, 7 branches. Chaque niveau est dessiné plus petit que le précédent, si bien que zoomer revient à descendre d'un niveau. Un seul chemin est ouvert à la fois, ce qui évite de surcharger l'écran. Les nœuds apparaissent en glissant depuis leur parent ; la caméra suit avec des transitions animées. On peut aussi zoomer et se déplacer librement (souris, trackpad, pincement).
- **Panneau de détail** : statut expliqué, éléments favorables / contradictoires, limites des sources, raisonnement, niveau de confiance, date de réévaluation, historique des versions. Chaque preuve est lue à trois niveaux : A authenticité, B contenu, C force probante. Les liens typés (soutient, contredit, dépend de…) sont justifiés, et chacun cite au moins une source.
- **Statuts qualitatifs**, sans pourcentages : Établi, Fortement étayé, Plausible mais incertain, Non démontré, Contredit par les preuves, Réfuté, Indéterminé. Chacun a son propre glyphe, pour ne pas dépendre de la couleur seule.
- **Narration « Comprendre en 3 minutes »** : 6 étapes de 30 s, avec pause, retour et sortie vers l'exploration libre.
- **Frise chronologique** avec curseur temporel animé, et bandes « meurtre rituel » (1150→) / « libelle du sang » (1235→).
- **Carte géographique** (d3-geo) de la propagation. Elle distingue les influences *proposées par les historiens* des *simples similitudes*. Aucun lien n'est marqué « filiation documentée », faute de source d'époque qui l'atteste.
- **Bibliothèque** : 16 fiches sources, chacune avec son statut de vérification et sa date, la dépendance entre sources (« dépend de » / « repris par ») et les affirmations liées. Aucune citation ni image n'est affichée tant qu'elle n'a pas été vérifiée.
- **Recherche** (`/` ou Ctrl/⌘+K), **navigation clavier** (← → frères, ↓/Entrée explorer, ↑ remonter, Échap vue d'ensemble), **plein écran** (`f`).
- **Téléphone** : la carte radiale devient un « zoom par cartes » : le nœud choisi monte en tête et ses enfants se déploient dessous. Le panneau s'ouvre en tiroir par le bas.
- **Partage** : une URL par nœud (`/fr/dossier/norwich-1144/c-blood`) et par source, toutes prérendues (213 pages). Métadonnées Open Graph et image OG générée.
- **Accessibilité** : `prefers-reduced-motion` respecté (aucune animation de caméra ni d'apparition), annonces ARIA du chemin courant, focus visible.
- **« Apporter une source »** : le formulaire et le processus (préanalyse IA → validation humaine → historique) sont présentés, mais l'envoi est désactivé jusqu'à la phase 2.

## Limites actuelles

- Données locales en TypeScript (`src/data/dossiers/…`) : pas de base de données, de compte ni de contribution réelle.
- Pas encore d'analyse IA des sources ni d'interface de modération (phase 2).
- Aucune citation exacte : elles seront ajoutées une par une après vérification sur une édition, avec localisation précise. Plusieurs sources sont marquées « partiellement vérifiée » ou « à vérifier » (voir chaque fiche et la page Méthode).
- Pas d'images de manuscrits : les droits et une numérisation vérifiée doivent d'abord être confirmés.
- Un seul dossier. Les réemplois modernes de l'accusation sont seulement esquissés.

## Prochaines étapes

1. **Relecture par un·e historien·ne** du dossier Norwich, puis ajout des citations vérifiées (édition Jessopp & James, traduction Rubin).
2. **Phase 2** : PostgreSQL + Prisma (schéma proposé dans [`docs/phase2-schema.prisma`](docs/phase2-schema.prisma)), comptes, téléversement S3, préanalyse par LLM côté serveur, file de modération, versions des conclusions.
3. **Phase 3** : autres dossiers, recherche globale entre dossiers, comparaison de sources côte à côte, liens entre croyances.

Détails techniques : [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Mettre en ligne

### Vercel

1. Pousser le dépôt sur GitHub, puis « Add New Project » dans Vercel et importer le dépôt (préréglage Next.js détecté automatiquement).
2. Variable d'environnement : `NEXT_PUBLIC_SITE_URL=https://votre-domaine` (sert aux URLs canoniques et Open Graph).
3. Déployer. Aucune autre configuration n'est nécessaire en phase 1 : pas de base, pas de secret.

### Coolify (production actuelle : https://origines.ia-do-it.com)

- Build pack **Dockerfile** (`/Dockerfile`, Node 22, sortie `standalone`, port 3000, utilisateur non-root, healthcheck).
- `NEXT_PUBLIC_SITE_URL` vaut `https://origines.ia-do-it.com` par défaut (`ARG` du Dockerfile). Si le domaine change, passer la variable **au build** : elle est intégrée aux pages prérendues.
- Redéployer : `POST /api/v1/applications/{uuid}/start` sur l'API Coolify (pas de webhook automatique).
