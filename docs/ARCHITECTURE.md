# Architecture

```
src/
  data/                     ← données historiques (aucune dépendance UI)
    types.ts                  modèle générique : nœuds, relations, statuts, sources, versions
    index.ts                  registre des dossiers + index du graphe (pur, serveur et client)
    dossiers/norwich-1144/    nodes.ts · sources.ts · index.ts (relations, carte, narration)
    data.test.ts              règles éditoriales vérifiées automatiquement
  lib/
    i18n.ts                   dictionnaires FR/EN (EN typé sur la forme de FR)
    layout.ts                 mise en page « fractale » + nœuds visibles selon le focus
    theme.ts                  couleurs par statut / type / relation (variables CSS)
  components/
    explorer/                 carte mentale, panneau, frise, carte, narration, recherche, contribution
  app/[lang]/                 pages (FR/EN) : accueil, dossier/[slug]/[[...node]], sources/[sourceId], methode
  proxy.ts                    redirection / → /fr ou /en selon Accept-Language
```

Les six responsabilités demandées restent séparées :

| Responsabilité | Où |
|---|---|
| Interface et navigation | `components/explorer`, `app/` |
| Données historiques | `data/dossiers/*` |
| Graphe de connaissances | `data/types.ts`, `data/index.ts`, `lib/layout.ts` |
| Analyse IA des sources | phase 2 : route serveur `app/api/analyze` (jamais de clé côté navigateur) |
| Validation éditoriale | phase 2 : modèles `Contribution`, `Review` (voir `phase2-schema.prisma`) |
| Historique des versions | `Assessment.history` dès maintenant ; table `AssessmentVersion` en phase 2 |

## Modèle

- **Nœuds** : `concept`, `claim`, `event`, `source`, `evidence`, `person`, `interpretation`, `conclusion`, `question`. Chaque nœud a un `parent` dans l'arbre d'exploration ; les autres liens passent par des relations.
- **Relations** : `ORIGINATED_FROM`, `EVOLVED_INTO`, `SUPPORTS`, `CONTRADICTS`, `DOCUMENTS`, `REFERS_TO`, `REINTERPRETS`, `DERIVED_FROM`, `CONTEXTUALIZES`. Chacune porte une justification et au moins une source (vérifié par les tests).
- **Sources** : fiche complète, `verification` (statut et date), `derivedFrom` pour la dépendance entre sources. Le champ `quote` n'est autorisé que sur une source vérifiée (test).
- **Évaluation** : `status`, `confidence`, éléments favorables / contraires, limites, raisonnement, `lastReviewed`, `history[]`.
- **Carte** : `SpreadLink.kind` vaut `documented`, `proposed` ou `similarity`. Une filiation `documented` exige une source primaire (test).

Rien n'est propre à l'antisémitisme : un nouveau dossier est un dossier `src/data/dossiers/<slug>` ajouté au registre.

## Rendu

Next.js 16 (App Router, Cache Components). Toutes les URLs de nœuds et de sources sont prérendues via `generateStaticParams`. La navigation dans la carte met l'URL à jour par `history.pushState`, donc chaque état est partageable et le bouton Retour fonctionne.

La carte mentale utilise React Flow, avec des positions fixes calculées par `computeLayout`. Les tests vérifient qu'aucune carte visible n'en chevauche une autre, quel que soit le nœud focalisé.
