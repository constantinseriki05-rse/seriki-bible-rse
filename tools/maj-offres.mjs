// SERIKI BIBLE RSE — robot des offres RSE (toutes les heures).
// Source : API Offres d'emploi v2 de France Travail (offres France Travail et sites partenaires).
// Clés gratuites sur francetravail.io, à enregistrer comme secrets GitHub FT_CLIENT_ID et FT_CLIENT_SECRET.
// Test sans clé : FT_MOCK=chemin/vers/reponse.json node tools/maj-offres.mjs
import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const F = join(RACINE, 'data', 'offres.json');
const MOTS = ['RSE', 'responsabilité sociétale', 'développement durable', 'CSRD', 'ESG', 'bilan carbone', 'transition écologique', 'achats responsables', 'finance durable', 'économie circulaire', 'reporting extra-financier', 'décarbonation', 'biodiversité'];
const PERTINENT = /\b(rse|csr|csrd|esrs|esg|durable|durabilit|sustainab|carbone|climat|d[ée]carbon|transition [ée]cologique|environnement|[ée]conomie circulaire|biodiversit|extra-financ|soci[ée]tal|qhse|hse)\b/i;
const GARDER_JOURS = 14, MAX = 800;

export function classer(o){
  const t = [o.typeContrat, o.typeContratLibelle, o.natureContrat, o.intitule].join(' ').toLowerCase();
  if (/profession/.test(t)) return 'pro';
  if (/apprenti|alternan/.test(t)) return 'alternance';
  if (/\bstage|stagiaire/.test(t) && o.typeContrat !== 'CDI') return 'stage';
  if (o.typeContrat === 'MIS' || /int[ée]rim/.test(t)) return 'interim';
  if (['LIB', 'FRA'].includes(o.typeContrat) || /freelance|ind[ée]pendant/.test(t)) return 'freelance';
  return 'emploi';
}
const court = (s, n) => { s = String(s || '').replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n).replace(/\s\S*$/, '') + '…' : s; };
export function normaliser(o, mot){
  return { id: 'ft-' + o.id, titre: court(o.intitule, 140), entreprise: (o.entreprise && o.entreprise.nom) || '', lieu: (o.lieuTravail && o.lieuTravail.libelle) || '',
    type: classer(o), contrat: court([o.typeContratLibelle, o.natureContrat].filter(Boolean).join(' · '), 80), date: o.dateCreation || new Date().toISOString(),
    url: 'https://candidat.francetravail.fr/offres/recherche/detail/' + o.id, source: o.origineOffre && o.origineOffre.partenaires && o.origineOffre.partenaires[0] ? 'France Travail · ' + o.origineOffre.partenaires[0].nom : 'France Travail',
    extrait: court(o.description, 260), mot };
}
async function jeton(){
  const r = await fetch('https://entreprise.francetravail.fr/connexion/oauth2/access_token?realm=%2Fpartenaire', { method: 'POST', headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: new URLSearchParams({grant_type: 'client_credentials', client_id: process.env.FT_CLIENT_ID, client_secret: process.env.FT_CLIENT_SECRET, scope: 'api_offresdemploiv2 o2dsoffre'}) });
  if (!r.ok) throw new Error('authentification refusée (HTTP ' + r.status + ')');
  return (await r.json()).access_token;
}
const pause = ms => new Promise(r => setTimeout(r, ms));
async function chercher(tok, mot){
  if (process.env.FT_MOCK) return JSON.parse(await readFile(process.env.FT_MOCK, 'utf8')).resultats || [];
  const iso = d => d.toISOString().replace(/\.\d{3}Z$/, 'Z');
  const u = new URL('https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search');
  u.searchParams.set('motsCles', mot); u.searchParams.set('sort', '1'); u.searchParams.set('range', '0-149');
  u.searchParams.set('minCreationDate', iso(new Date(Date.now() - 3 * 864e5))); u.searchParams.set('maxCreationDate', iso(new Date()));
  const r = await fetch(u, { headers: { Authorization: 'Bearer ' + tok, Accept: 'application/json' } });
  if (r.status === 204) return [];
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return (await r.json()).resultats || [];
}
async function main(){
  if (!process.env.FT_MOCK && !(process.env.FT_CLIENT_ID && process.env.FT_CLIENT_SECRET)) { console.log('Clés France Travail absentes (secrets FT_CLIENT_ID et FT_CLIENT_SECRET) : rien à faire.'); return; }
  let base; try { base = JSON.parse(await readFile(F, 'utf8')); } catch(e) { base = {offres: []}; }
  const connus = new Set(base.offres.map(o => o.id));
  const tok = process.env.FT_MOCK ? '' : await jeton();
  const nouveaux = [];
  for (const mot of MOTS) {
    try {
      const L = await chercher(tok, mot); let n = 0;
      for (const o of L) { const x = normaliser(o, mot); if (connus.has(x.id)) continue; if (!PERTINENT.test(x.titre + ' ' + (o.description || ''))) continue; connus.add(x.id); nouveaux.push(x); n++; }
      console.log('✓', mot, ':', L.length, 'lues,', n, 'nouvelles');
    } catch(e) { console.log('✗', mot, ':', e.message); }
    await pause(250);
  }
  const limite = new Date(Date.now() - GARDER_JOURS * 864e5).toISOString();
  base.offres = [...nouveaux, ...base.offres].filter(o => String(o.date) >= limite).sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, MAX);
  base.maj = new Date().toISOString();
  base.note = 'Offres France Travail et partenaires contenant des mots-clés RSE, mises à jour chaque heure.';
  await writeFile(F, JSON.stringify(base, null, 1) + '\n');
  console.log(nouveaux.length + ' nouvelle(s) offre(s). Total : ' + base.offres.length + '.');
}
if (import.meta.url === 'file://' + process.argv[1]) main().catch(e => { console.error(e.message); process.exit(1); });
