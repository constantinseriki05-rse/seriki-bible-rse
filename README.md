# SERIKI BIBLE RSE

*Apprendre. Maîtriser. Agir. Réussir.*

Application web de référence sur la RSE et le développement durable, avec un espace « Mes cours » pour le Master Manager de la Stratégie Durable et RSE. Elle fonctionne en ligne, sur PC et sur Android, sans dépendre de Claude ni d'aucun service d'IA.

## Structure du dossier

| Élément | Rôle |
|---|---|
| `index.html` | Page de l'application |
| `css/app.css` | Mise en forme |
| `js/app.js` | Fonctionnement (navigation, recherche, outils, quiz, cours) |
| `data/bible.json` | Tout le contenu de la Bible (réglementation, secteurs, méthodes, modèles, glossaire…) |
| `data/metiers.json` | 12 compétences et 14 fiches métiers |
| `data/labo.json` | 11 cas pratiques du laboratoire |
| `data/terrain.json` | 11 guides opérationnels « Sur le terrain » |
| `data/offres.json`, `tools/maj-offres.mjs`, `.github/workflows/offres.yml` | Fil d'offres RSE (API France Travail), robot horaire |
| `data/entreprises.json` | Moteur de l'annuaire : 20 profils sectoriels, libellés NAF, recherches prêtes à l'emploi |
| `data/actualites.json` | Actualités et agenda (COP, salons, colloques), complété chaque jour par le robot |
| `data/sources-actualites.json` | Flux d'information lus par le robot et mots-clés RSE |
| `tools/maj-actualites.mjs` | Robot de veille (Node 18+, sans dépendance) |
| `.github/workflows/actualites.yml` | Lancement quotidien du robot sur GitHub |
| `data/cours/exemple-csrd.json` | Matière d'exemple que chacun peut ajouter à son espace |
| `lib/` | Lecteurs de fichiers PDF, Word et PowerPoint |
| `manifest.webmanifest`, `sw.js`, `icons/` | Installation comme une application sur PC et Android |

## Mettre en ligne

Le plus simple : glisser le dossier `seriki-bible-rse` sur https://app.netlify.com/drop. Autre option gratuite : GitHub Pages. Voir le guide de mise en ligne (Word et PDF) pour le pas-à-pas.

L'application doit être ouverte depuis une adresse web : un double-clic sur `index.html` ne charge pas les fichiers de contenu.

## Mon espace cours (privé)

Chaque utilisateur crée ses matières (libres ou à partir de 12 modèles de matières RSE), écrit ses cours, joint ses fichiers, crée ses notions (fiches mémo à répétition espacée) et ses questions de quiz. Tout est enregistré dans le navigateur de l'appareil (IndexedDB) : rien n'est envoyé sur un serveur. Les boutons « Sauvegarder mon espace » et « Restaurer une sauvegarde » permettent de changer d'appareil.

Les lecteurs PDF, Word et PowerPoint sont inclus dans `lib/` (pdf.js, mammoth, JSZip, licences jointes) : l'application ne dépend d'aucun service extérieur.

## Parcours

Cinq rubriques : Accueil (tableau de bord), Apprendre, Pratiquer (laboratoire de cas), Carrière (fiches métiers) et Profil (compétences et portfolio). Profil, compétences et cas pratiques sont enregistrés sur l'appareil et inclus dans la sauvegarde.

## Sur le terrain et carrière

Guides opérationnels (30 premiers jours, bilan carbone avec calculatrice, sensibilisation, entretien, collecte de données, plan d'action, EcoVadis, plan de vigilance, audit ISO 14001, achats responsables, index de l'égalité avec calculatrice), suivi des candidatures, analyse d'offre par mots-clés, simulateur d'entretien et examen blanc chronométré. Aucune IA : tout fonctionne dans le navigateur.

## CV et ATS

CV standard (saisi ou importé), score ATS simulé face à une offre, CV adapté avec validation des mots-clés par l'utilisateur, export Word et PDF, lettre de motivation pré-remplie.

## Actualités, agenda et notifications

Page « Actualités et agenda » : actualité RSE en France, dans l'UE et dans le monde, filtres par zone, thème et mot-clé, encadré « Ce que ça change pour votre métier », agenda des COP, salons et colloques avec export vers l'agenda du téléphone. « À la une » sur le tableau de bord.

Robot quotidien : sur GitHub, `.github/workflows/actualites.yml` lance chaque matin `node tools/maj-actualites.mjs`, qui lit les flux de `data/sources-actualites.json`, filtre par mots-clés RSE, dédoublonne et met à jour `data/actualites.json`. Activer « Read and write permissions » dans Settings → Actions → General. Test local : `node tools/maj-actualites.mjs --dossier=chemin/vers/flux-xml`.

Alertes : pastille du nombre de nouveautés, message à l'ouverture, notifications de l'appareil sur demande (vérification à l'ouverture puis toutes les 30 minutes). Une notification avec l'application totalement fermée nécessiterait un serveur d'envoi : non inclus.

## Annuaire RSE des entreprises

Recherche en direct dans toutes les entreprises françaises via l'API publique Recherche d'entreprises (https://recherche-entreprises.api.gouv.fr, sans clé, 7 appels par seconde), avec filtres département, secteur, taille et signaux RSE (société à mission, ESS, index égalité, bilan GES, RGE, bio). Fiche : signaux publics, obligations probables selon la taille, enjeux sectoriels, besoins, missions, message de candidature, liens de recherche, notes. Entreprises cibles stockées dans IndexedDB (`kv` / `cibles`, incluses dans la sauvegarde). Entreprises hors de France : saisie manuelle et même analyse.

## Offres et alertes RSE

Recherches préremplies (offres récentes d'abord) vers LinkedIn, Indeed, France Travail, Welcome to the Jungle, HelloWork, APEC, Talent.com, Google Emplois, La bonne alternance, 1jeune1solution, JobTeaser, Jobs That Make Sense, Emploi-Environnement, Birdeo, EURES, VIE, publications LinkedIn et Facebook, Google Alertes ; guide de création des alertes natives ; fil d'offres officielles mis à jour chaque heure par `tools/maj-offres.mjs` (API Offres d'emploi v2 de France Travail, secrets GitHub `FT_CLIENT_ID` et `FT_CLIENT_SECRET`). Test : `FT_MOCK=reponse.json node tools/maj-offres.mjs`. LinkedIn, Indeed, WTTJ et Facebook n'offrent pas d'accès autorisé à leurs offres : liens et alertes natives uniquement.

## Version 12

Autodiagnostic RSE PME (`#diagnostic`, stockage `kv/diag`), agenda unifié avec export .ics (`#agenda`, `kv/agenda`), « L'essentiel en 3 points » et schémas SVG (scopes, double matérialité), date de vérification sur chaque fiche, 20 profils sectoriels dans « Secteur par secteur », modèles en Word et PDF, lecture à voix haute (Web Speech API), CV mis en page avec photo (`#cv`), page À propos, mentions légales, confidentialité et conditions (`#infos`, champs entre crochets à compléter).

## Version 13

Design v2 (écran d'ouverture, découverte, couleur par espace via `body[data-esp]`, bandeaux `.phero` générés, menu par espaces, animations, stories de l'accueil), espace entreprise `#pilotage` (indicateurs, graphiques SVG, import/export Excel via `lib/xlsx.full.min.js` (SheetJS, Apache-2.0, chargé à la demande), CSV Power BI, plan d'action, feuille de route, aides), `#comprendre` (8 notions développées), annuaire « explorer sans nom » (département mémorisé `dep`), téléchargements via la capacité `downloads` dans l'aperçu Claude.


## Version 14

- **Atelier CSRD et vigilance** (`#atelier`) : double matérialité (cotation ESRS, matrice, export Excel et Word), suivi de la collecte par site et filiale, cartographie des risques fournisseurs et cinq mesures du plan de vigilance, rétroplanning et liste de préparation à l'audit, CSDDD et décarbonation industrielle.
- **Espace public et associatif** (`#public`) : obligations selon la structure (BEGES, PCAET, rapport DD, critère environnemental dans les marchés depuis le 22 août 2026, SPASER, décret tertiaire), clauses d'achats responsables, BEGES et PCAET, mesure de l'impact social avec note Word.
- Profil « Équipe RSE d'un grand groupe », parcours du profil public, autodiagnostic adapté à la taille, suppression de la mention « PME » là où les outils servent à tous.
- Données enregistrées dans IndexedDB (`kv` : `atelier`, `public`).
- Logo officiel : écran d'ouverture, menu, favicon et icônes d'installation (dossier `icons`).

## Version 15

- **Démarrer la RSE de zéro** (`#demarrer`) : parcours en 12 étapes adapté à la taille, modèles Word (lettre d'engagement, mission du référent et comité, parties prenantes, politique RSE ISO 26000), dossier de structuration complet en Word ou PDF.
- **Cabinets et prestataires RSE** (`#prestataires`) : recherche par ville et spécialité (registre officiel, codes NAF du conseil, de l'ingénierie et de la formation), annuaires professionnels, 8 missions de conseil détaillées, fiche cabinet exportable et demande de référencement (adresse à définir dans `window.SERIKI_CONTACT`).
- **S'engager : associations et bénévolat** (`#engager`) : associations par ville et thème (API Recherche d'entreprises avec `est_association`, communes via geo.api.gouv.fr), grands réseaux, plateformes de bénévolat, conseils.

## Version 16

- **Audit et vérification** (`#audit`) : six étapes pour l'entreprise auditée avec exemples et modèles (Word et Excel) ; espace auditeur (programme par type de mission, feuilles de test avec seuil de signification, tirage d'échantillon, constats, exports) ; techniques d'audit ; cadre légal (CAC ou OTI accrédité COFRAC inscrit à la H2A).
- **Méthodes** : mode opératoire et exemple pour chacune des 55 étapes (`METH_DET`).
- Corrections d'affichage : listes « Livrable / Piège » alignées, signes + et – des sous-éléments dépliables.

## Version 17

- **Les 12 domaines de la RSE** (`#domaines`, `#domaines--<id>`) : 4 pôles, fiche par domaine (sujets, enjeux, indicateurs, référentiels, liens vers contenus, outils, cas et métiers, premiers pas), spécialité enregistrée (`localStorage` `specialite`) affichée sur l'accueil, parcours en 6 étapes, compétences transversales, tableau des référentiels par nature.
- Impression : tous les boutons « Imprimer » passent par `printHtml()` ; dans l'aperçu Claude (impression bloquée), une fenêtre propose le téléchargement en Word.
- Exports : PDF et Word (.docx) générés dans le navigateur (`pdfBlob`, `docxBlob` avec JSZip), choix PDF / Word / Imprimer via `choixExport()` ; bibliothèque Excel ré-encodée en UTF-8 sans caractères de contrôle.

## Version 18

- **Boîte à outils projet** (`#boite`) : projets (Gantt SVG, RACI, budget), registre des risques ESG avec carte de chaleur, SWOT, incidents et actions correctives, comparaison de scénarios. Données IndexedDB `kv` `boite`.
- **Qualité des données** : fiche par indicateur (`kpi[].q`) et historique des modifications (`kpi[].hist`), feuille Excel « Qualité des données ».
- Cahier des charges fonctionnel maître : `Cahier-des-charges-SERIKI-BIBLE-RSE.docx` et `.pdf`.

## Version 19

- **Quiz et révisions** (`#quiz`, `#quiz--<domaine>`) : 96 questions (`QZ`), séries de révision (`localStorage` `quizErr`), historique (`quizHist`), fiches de révision PDF/Word.
- **Mes données** (`#donnees`) : sauvegarde globale (IndexedDB + localStorage, format 2) et restauration avec redémarrage.
- **Hors ligne** : `sw.js` en « réseau d'abord » avec réserve (`seriki-v19`) ; changer `CACHE` à chaque version publiée. Badge `#netBadge`.
- Contrôles de cohérence des indicateurs (`kpiControles`), action reliée à un indicateur (`actions[].kpi`), exports datés.
- Tests d'acceptation V1 : 10 critères validés (scénario Playwright).

## Version 20

- **Parcours métiers** (`#pcours`, `#pcours--<id>`, `#pcours--<id>-<leçon>`) : données `PCOURS` (projet, budget, decarbonation, circulaire), modèles `PTPL`, progression `localStorage` `pcDone`.
- **Ateliers climat et ressources** (`#ateliers--trajectoire|scope3|finance|flux|ecoconception|agec`) : IndexedDB `kv` `ateliers`.
- `sw.js` : passer `CACHE` à `seriki-v20` à la publication.

## Version 21

- Douze nouveaux parcours métiers (16 au total, 74 leçons partagées, suivi global par leçon) et quatorze nouveaux modèles Word ou PDF.
- Couche visuelle : schémas animés (cycles, pyramides, matrices, scopes, barres, anneaux, jauges, formules, comparaisons), frises d'étapes, chiffres animés, cartes illustrées, « À retenir », quiz éclair.
- Mode diaporama plein écran (lecture automatique, voix française, plein écran, clavier et glissement) pour les leçons, les parcours, les notions, les domaines et les guides de terrain.
- Outils métiers (#outilsm) : chiffrage de mission, notation ESG, évaluation fournisseurs, taxonomie, biodiversité, indicateurs sociaux et enquête QVCT, registre réglementaire et analyse environnementale.
- Animations d'apparition au défilement et d'ouverture, désactivées si « réduire les animations » est demandé.
- Correction : conflit de nom qui empêchait le quiz de « Mon espace cours ».
- Cache du service worker : seriki-v21.

## Version 22

- Mise en ligne gratuite sur GitHub Pages : https://constantinseriki05-rse.github.io/seriki-bible-rse/
- Mentions légales (éditeur, contact seriki.bible.rse@gmail.com, hébergeur GitHub) ; `window.SERIKI_CONTACT`.
- Cache du service worker : seriki-v22.

## Version 23

- Dix nouveaux parcours issus de 33 offres réelles (26 parcours, 158 leçons) : `agro`, `envindus`, `territoires`, `etudesenv`, `dechets`, `btp`, `energie`, `qse`, `comimpact`, `alternant`, et des leçons ajoutées aux parcours existants.
- Dix nouvelles fiches dans `data/metiers.json` (24 métiers) et seize modèles `PTPL`.
- Six outils métiers : `#outilsm--dechets|auditsite|iso26030|label|procedures|tertiaire` (données dans `kv` `outilsm`).
- Analyse d'offre : `window.SERIKI_OF_LEC` (expressions → leçons) affiche les leçons à travailler et les parcours les plus proches.
- Cache du service worker : seriki-v23.

## Version 24

- Page `#besoins` « Que voulez-vous faire ? » (`BESOINS`, 27 besoins) et bandeau sur l'accueil ; menu Agir réordonné, examen blanc dans Apprendre.
- Icônes animées `AIC` (SVG + CSS, coupées si « réduire les animations »).
- Nouveaux blocs de leçon : `['cas', {n, t, sect, ic, c, sit, data, ana, sol, res, liv}]` et `['doc', titre, [[rubrique, valeur]], note]`, rendus, exportés (PDF, Word) et en diaporama.
- 30 leçons de dossiers pratiques (188 leçons) : `sdp*`, `ddp*`, `rdp*`, `egp*`, `qsp*`, `acp*`, `dcp*`, `cip`, `btp9`, `vdp`, `qdp`, `cmp`, `agp`, `enp`, `esp`, `pjp`.
- Exemplaires remplis dans tous les parcours (`btd`, `vdd`, `qdd`, `cmd`, `agd`, `end`, `esd`, `pjd`, `ied`, `vgd`) et cas `stp`, `alp`, `csp` : 201 leçons.
- Sommaire général `#sommaire` et sommaire de leçon `lecSommaire()` (ancres `#lb-<n>`).
- Cache du service worker : seriki-v24.

## Version 25

- Simulateur `#simrse` (`SIM_SC`, `SIM_ACT`, `SIM_DEFIS` ; données `kv` `simrse`) : enjeux, indicateurs, actions annuelles, événements, comité, score, défis `#simrse--defis`, historique `#simrse--histo`.
- Passeport `#passeport` : `passPreuves()` (leçons `pcDone`, quiz `quizHist`, simulations, travaux des outils, tableau de bord, boîte à outils, autodiagnostic) et `passNiveau()`.
- Prochaine action : `prochainesActions()` / `blocProchaine()` sur l'accueil.
- Outil `#outilsm--impact` (prévu, estimé, mesuré ; `OM.d.imp`).
- Cache du service worker : seriki-v25.
