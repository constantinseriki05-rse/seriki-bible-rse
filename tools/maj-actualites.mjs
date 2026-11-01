// SERIKI BIBLE RSE — robot de mise à jour quotidienne des actualités.
// Lit les flux RSS/Atom de data/sources-actualites.json, garde les articles qui parlent de RSE,
// les fusionne avec data/actualites.json (les articles « curated » ne sont jamais supprimés)
// et réécrit le fichier. Aucune dépendance : Node 18 ou plus (fetch intégré).
// Usage : node tools/maj-actualites.mjs            (flux réels)
//         node tools/maj-actualites.mjs --dossier=tests/flux   (fichiers XML locaux, pour tester)
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const RACINE = join(dirname(fileURLToPath(import.meta.url)), '..');
const F_ACTU = join(RACINE, 'data', 'actualites.json');
const F_SRC = join(RACINE, 'data', 'sources-actualites.json');
const argDossier = (process.argv.find(a => a.startsWith('--dossier=')) || '').split('=')[1];
const AUJ = process.env.AUJOURDHUI || new Date().toISOString().slice(0, 10);

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', rsquo: '’', lsquo: '‘', laquo: '«', raquo: '»', eacute: 'é', egrave: 'è', agrave: 'à', ccedil: 'ç', ecirc: 'ê', ocirc: 'ô', hellip: '…', ndash: '–', mdash: '—' };
const decode = s => String(s || '')
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(+d))
  .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
const sansBalises = s => decode(decode(s).replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const tag = (bloc, nom) => { const m = bloc.match(new RegExp('<' + nom + '(?:\\s[^>]*)?>([\\s\\S]*?)</' + nom + '>', 'i')); return m ? m[1] : ''; };
const lienAtom = bloc => { const m = bloc.match(/<link[^>]*href="([^"]+)"/i); return m ? m[1] : ''; };

export function lireFlux(xml){
  const items = [];
  const blocs = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocs) {
    const titre = sansBalises(tag(b, 'title'));
    const url = sansBalises(tag(b, 'link')) || lienAtom(b);
    const brut = tag(b, 'pubDate') || tag(b, 'dc:date') || tag(b, 'published') || tag(b, 'updated');
    const d = new Date(sansBalises(brut));
    const resume = sansBalises(tag(b, 'description') || tag(b, 'summary') || tag(b, 'content'));
    if (titre && url) items.push({ titre, url, date: isNaN(d) ? AUJ : d.toISOString().slice(0, 10), resume });
  }
  return items;
}

const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const contient = (txt, mot) => new RegExp('(^|[^a-z0-9])' + norm(mot).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(txt);

const THEMES = [
  ['Reporting', ['csrd', 'esrs', 'reporting', 'efrag', 'issb', 'vsme', 'omnibus']],
  ['Finance durable', ['sfdr', 'taxonomie', 'taxonomy', 'finance durable', 'sustainable finance', 'green bond', 'investisseur']],
  ['Vigilance', ['vigilance', 'csddd', 'due diligence', 'droits humains', 'human rights']],
  ['Greenwashing', ['greenwashing', 'ecoblanchiment', 'allegation']],
  ['COP et négociations', ['cop31', 'cop32', 'cop17', 'cop ', 'cnucc', 'unfccc', 'negociations climatiques']],
  ['Biodiversité', ['biodiversite', 'biodiversity', 'especes', 'ocean', 'foret', 'deforestation']],
  ['Énergie', ['energie', 'energy', 'renouvelable', 'renewable', 'nucleaire', 'electricite', 'solaire', 'eolien']],
  ['Social', ['salari', 'egalite', 'transparence salariale', 'travail', 'syndicat', 'diversite']],
  ['Économie circulaire', ['circulaire', 'circular', 'recyclage', 'dechets', 'waste', 'reemploi']],
  ['Climat', ['climat', 'climate', 'carbone', 'carbon', 'emissions', 'giec', 'ipcc', 'rechauffement', 'net zero']]
];
const ZONES_UE = ['commission europeenne', 'parlement europeen', 'union europeenne', 'bruxelles', 'european commission', 'european parliament', ' eu ', 'efrag', 'csrd', 'csddd', 'sfdr', 'omnibus'];
const ZONES_FR = ['france', 'francais', 'gouvernement', 'assemblee nationale', 'senat', 'ademe', 'amf', 'paris'];

export function classer(a, src, conf){
  const t = ' ' + norm(a.titre + ' ' + a.resume) + ' ';
  const score = conf.motsCles.filter(m => contient(t, m)).length;
  if (!score) return null;
  const fort = conf.motsForts.some(m => contient(t, m));
  const theme = (THEMES.find(([, mots]) => mots.some(m => t.includes(m))) || ['Actualité RSE'])[0];
  let zone = src.zone || 'Monde';
  if (ZONES_UE.some(m => t.includes(m))) zone = 'UE';
  else if (ZONES_FR.some(m => t.includes(m))) zone = 'France';
  return { theme, zone, importance: fort || score >= 3 ? 'haute' : 'normale' };
}

const cle = s => norm(s).replace(/[^a-z0-9]/g, '').slice(0, 60);
const idDe = a => 'auto-' + a.date + '-' + cle(a.titre).slice(0, 40);

async function charger(src){
  if (argDossier) {
    const fichiers = await readdir(argDossier);
    const f = fichiers.find(x => x.startsWith(src.nom.toLowerCase().replace(/[^a-z0-9]+/g, '-')));
    if (!f) throw new Error('pas de fichier de test');
    return readFile(join(argDossier, f), 'utf8');
  }
  const ctl = new AbortController(); const minuterie = setTimeout(() => ctl.abort(), 20000);
  try {
    const r = await fetch(src.url, { signal: ctl.signal, headers: { 'user-agent': 'SERIKI-BIBLE-RSE/1.0 (veille RSE)' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.text();
  } finally { clearTimeout(minuterie); }
}

async function main(){
  const conf = JSON.parse(await readFile(F_SRC, 'utf8'));
  const base = JSON.parse(await readFile(F_ACTU, 'utf8'));
  const deja = new Set(base.articles.flatMap(a => [a.url, cle(a.titre)]));
  const nouveaux = [];
  for (const src of conf.flux) {
    try {
      const items = lireFlux(await charger(src));
      let n = 0;
      for (const it of items) {
        if (n >= (conf.maxParFlux || 8)) break;
        if (deja.has(it.url) || deja.has(cle(it.titre))) continue;
        const c = classer(it, src, conf); if (!c) continue;
        const a = { id: idDe(it), date: it.date, titre: it.titre, resume: it.resume.slice(0, 420) + (it.resume.length > 420 ? '…' : ''), zone: c.zone, theme: c.theme, importance: c.importance, source: src.nom, url: it.url, impact: '', curated: false, ajoute: AUJ };
        nouveaux.push(a); deja.add(it.url); deja.add(cle(it.titre)); n++;
      }
      console.log('✓', src.nom, ':', items.length, 'articles lus,', n, 'retenus');
    } catch (e) { console.log('✗', src.nom, ': ignoré (' + e.message + ')'); }
  }
  const limite = new Date(new Date(AUJ).getTime() - (conf.garderJours || 60) * 864e5).toISOString().slice(0, 10);
  const garde = base.articles.filter(a => a.curated || a.date >= limite);
  base.articles = [...nouveaux, ...garde].sort((a, b) => b.date.localeCompare(a.date) || (b.curated ? 1 : 0) - (a.curated ? 1 : 0));
  base.maj = AUJ;
  await writeFile(F_ACTU, JSON.stringify(base, null, 1) + '\n');
  console.log(nouveaux.length + ' nouvel(s) article(s). Total : ' + base.articles.length + '.');
}
if (import.meta.url === 'file://' + process.argv[1]) main().catch(e => { console.error(e); process.exit(1); });
