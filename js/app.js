/* SERIKI BIBLE RSE : code de l'application. Le contenu est dans data/bible.json et data/cours/. */
(async function(){
'use strict';
let D;
try { D = await (await fetch('data/bible.json', {cache: 'no-cache'})).json(); }
catch(e) { document.getElementById('content').innerHTML = '<div class="callout"><strong>Contenu indisponible</strong>Le fichier data/bible.json n\'a pas pu être chargé. Ouvrez l\'application depuis son adresse web (et non en double-cliquant sur le fichier).</div>'; return; }
const FAITS = D.faits;
const FONDA = D.fondamentaux;
const ISO = D.iso26000;
const ODD = D.odd;
const TL = D.timeline;
const EU = D.europe;
const FR = D.france;
const ESRS = D.esrs;
const DM = D.doubleMaterialite;
const CSRDR = D.csrdRegles;
const TXO = D.taxoObjectifs;
const KPI = D.kpi;
const NORMS = D.normes;
const SECT = D.secteurs;
const ATT = D.attentes;
const SKL = D.competences;
const INT = D.entretien;
const CK = D.checklist;
const METH = D.methodes;
const TPL = D.modeles;
const GLO = D.glossaire;
const SRC = D.sources;
/* ---------------- NAVIGATION ---------------- */
const NAV = [
  ["Accueil", [["accueil","Tableau de bord"],["profil","Profil et compétences"],["donnees","Mes données et sauvegarde"]]],
  ["Apprendre", [["comprendre","Comprendre en profondeur"],["domaines","Les 12 domaines de la RSE"],["quiz","Quiz et révisions"],["pcours","Parcours métiers"],["cours","Mon espace cours"],["fondamentaux","Fondamentaux"],["histoire","Histoire"],["europe","Réglementation UE"],["france","Réglementation France"],["csrd","CSRD et ESRS"],["taxonomie","Taxonomie verte"],["reporting","Reporting et carbone"],["normes","Normes et labels"],["secteurs","Secteur par secteur"],["glossaire","Glossaire"],["sources","Sources officielles"]]],
  ["Agir", [["demarrer","Démarrer la RSE de zéro"],["pilotage","Espace entreprise"],["boite","Boîte à outils projet"],["ateliers","Ateliers climat et ressources"],["outilsm","Outils métiers"],["diagnostic","Autodiagnostic RSE"],["atelier","Atelier CSRD et vigilance"],["audit","Audit et vérification"],["public","Espace public et associatif"],["prestataires","Cabinets et prestataires RSE"],["terrain","Sur le terrain"],["labo","Laboratoire de cas"],["examen","Examen blanc"],["methodes","Méthodes"],["modeles","Modèles de rédaction"],["outils","Suis-je concerné ?"]]],
  ["Carrière", [["offres","Offres et alertes"],["entreprises","Annuaire des entreprises"],["engager","S'engager : associations"],["metiers","Fiches métiers"],["cv","Mon CV et score ATS"],["candidatures","Mes candidatures"],["offre","Analyser une offre"],["simulateur","Simulateur d'entretien"],["metier","Entretien et premiers pas"]]],
  ["Veille", [["veille","Vue d'ensemble"],["actualites","Actualités"],["agenda","Mon agenda"]]]
];
const navEl = document.getElementById('nav');
const ESPKEY = {'Accueil': 'accueil', 'Apprendre': 'apprendre', 'Agir': 'pratiquer', 'Carrière': 'carriere', 'Veille': 'veille'};
const ESPHUB = {apprendre: 'apprendre', pratiquer: 'pratiquer', carriere: 'carriere'};
const ESPICO = {accueil: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>', apprendre: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/>', pratiquer: '<path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/>', carriere: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>', veille: '<circle cx="12" cy="12" r="9"/><path d="M12 12l5-3"/><circle cx="12" cy="12" r="1.5"/>'};
NAV.forEach(([g, items]) => {
  const k = ESPKEY[g] || 'accueil';
  const grp = document.createElement('div'); grp.className = 'ngrp esp-' + k; grp.dataset.g = k;
  const hb = document.createElement('button'); hb.className = 'ngh'; hb.type = 'button'; hb.setAttribute('aria-expanded', 'false');
  hb.innerHTML = '<span class="ngi"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ESPICO[k] + '</svg></span><span class="ngt">' + g + '</span><span class="ngc" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>';
  hb.addEventListener('click', () => { const o = grp.classList.toggle('open'); hb.setAttribute('aria-expanded', String(o)); });
  const list = document.createElement('div'); list.className = 'ngl';
  const all = ESPHUB[k] && !items.some(x => x[0] === ESPHUB[k]) ? [[ESPHUB[k], 'Vue d\'ensemble']].concat(items) : items;
  all.forEach(([id, label]) => { const a = document.createElement('a'); a.href = '#' + id; a.dataset.id = id; a.innerHTML = '<span>' + label + '</span>'; list.appendChild(a); });
  grp.appendChild(hb); grp.appendChild(list); navEl.appendChild(grp);
});
const route = () => { const h = (location.hash.slice(1) || 'accueil').split('--'); return {base: h[0] || 'accueil', sub: h[1] || null}; };
function show(id){
  id = String(id || '').split('--')[0];
  if(!document.getElementById(id)) id = 'accueil';
  document.querySelectorAll('section.view').forEach(s => s.classList.toggle('on', s.id === id));
  document.querySelectorAll('#nav a').forEach(a => a.classList.toggle('active', a.dataset.id === id));
  let esp = 'accueil'; try { esp = GROUPE[id] || 'accueil'; } catch(e) {}
  document.body.dataset.esp = esp;
  document.querySelectorAll('#nav .ngrp').forEach(gr => { const act = !!gr.querySelector('a.active'); gr.classList.toggle('open', act); gr.querySelector('.ngh').setAttribute('aria-expanded', String(act)); gr.classList.toggle('cur', act); });
  const sec = document.getElementById(id); if (sec) { sec.classList.remove('anim'); void sec.offsetWidth; sec.classList.add('anim'); clearTimeout(sec._an); sec._an = setTimeout(() => sec.classList.remove('anim'), 1400); }
  closeMenu();
}
window.addEventListener('hashchange', () => { show(location.hash.slice(1)); window.scrollTo(0,0); });
function openMenu(){ document.getElementById('side').classList.add('open'); document.body.classList.add('menu-open'); document.getElementById('menuBtn').setAttribute('aria-expanded', 'true'); }
function closeMenu(){ document.getElementById('side').classList.remove('open'); document.body.classList.remove('menu-open'); document.getElementById('menuBtn').setAttribute('aria-expanded', 'false'); }
document.getElementById('menuBtn').addEventListener('click', () => document.getElementById('side').classList.contains('open') ? closeMenu() : openMenu());
document.getElementById('backdrop').addEventListener('click', closeMenu);
document.getElementById('closeMenu').addEventListener('click', closeMenu);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('side').classList.contains('open')) closeMenu(); });
/* Historique : boutons Retour et Suivant */
let navDepth = 0;
try { if (history.state && typeof history.state.d === 'number') navDepth = history.state.d; else history.replaceState({d: 0}, ''); } catch(e) {}
window.addEventListener('hashchange', () => { try { if (history.state && typeof history.state.d === 'number') navDepth = history.state.d; else { navDepth++; history.replaceState({d: navDepth}, ''); } } catch(e) {} updNavBtns(); });
function updNavBtns(){ const b = document.getElementById('btnBack'); if (b) b.classList.toggle('dim', navDepth <= 0 && route().base === 'accueil' && !route().sub); }
document.getElementById('btnBack').addEventListener('click', () => { if (navDepth > 0) history.back(); else { const r = route(); location.hash = r.sub ? r.base : 'accueil'; } });
document.getElementById('btnFwd').addEventListener('click', () => history.forward());
updNavBtns();

const LS = {get: k => { try { return localStorage.getItem(k); } catch(e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch(e) {} }};
(function(){ const t = LS.get('theme'); if (t) document.documentElement.dataset.theme = t; const b = document.getElementById('themeBtn'); if (b) b.addEventListener('click', () => { const dark = document.documentElement.dataset.theme === 'dark' || (!document.documentElement.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches); const n = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = n; LS.set('theme', n); toast(n === 'dark' ? 'Mode sombre' : 'Mode clair'); }); })();
document.addEventListener('click', e => { const j = e.target.closest('[data-jump]'); if (!j) return; setTimeout(() => { const t = document.getElementById(j.dataset.jump); if (t) t.scrollIntoView({behavior: 'smooth', block: 'start'}); }, 80); });
const IN_PREVIEW = (() => { try { return !!window.claude || /claude\.ai|claudeusercontent/.test(location.hostname); } catch(e) { return false; } })();
async function saveBlob(blob, filename){
  if (IN_PREVIEW && window.claude && window.claude.use) {
    try { const dl = await window.claude.use('downloads'); if (dl) { await dl.save({filename, data: blob}); return true; } } catch(e) { if (e && /declin|cancel|reject/i.test(String(e.message || e))) return false; }
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 60000); return true;
}
const nomFichier = (n, ext) => (String(n).replace(/[’']/g, ' ').replace(/[^\p{L}\p{N} ._-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 120) || 'document') + ext;
const esc = s => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
let toastT; function toast(msg, ms){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),ms||1800); }

/* ---------------- ACCUEIL ---------------- */

document.getElementById('faits').innerHTML = FAITS.map(f => '<div class="card" data-s="1"><div class="meta"><span class="pill '+(f[2]==='FR'?'o':'b')+'">'+(f[2]==='FR'?'France':'Union européenne')+'</span></div><h4>'+f[0]+'</h4><p>'+f[1]+'</p></div>').join('');

/* ---------------- FONDAMENTAUX ---------------- */

document.getElementById('fondaGrid').innerHTML = FONDA.map(f => '<div class="card" data-s="1"><h4>'+f[0]+'</h4><p>'+f[1]+'</p></div>').join('');

document.getElementById('iso26000').innerHTML = ISO.map(r => '<tr><td><strong>'+r[0]+'</strong></td><td>'+r[1]+'</td></tr>').join('');

document.getElementById('oddList').innerHTML = ODD.map((o,i)=>'<span class="chip" style="cursor:default">'+(i+1)+'. '+o+'</span>').join('');

/* ---------------- HISTOIRE ---------------- */

function renderTL(f){
  document.getElementById('timeline').innerHTML = TL.filter(t => f==='all' || t[1]===f).map(t => '<div class="tl '+t[1]+'" data-s="1"><div class="y">'+t[0]+' · '+({monde:'Monde',ue:'UE',fr:'France'})[t[1]]+'</div><h4>'+t[2]+'</h4><p>'+t[3]+'</p></div>').join('');
}
renderTL('all');
document.querySelectorAll('#tlFilters .chip').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('#tlFilters .chip').forEach(x => x.classList.toggle('on', x===b)); renderTL(b.dataset.f);
}));

/* ---------------- FICHES RÉGLEMENTAIRES ---------------- */
function regCard(r){
  return '<div class="card" data-s="1"><div class="meta">'+r.tags.map(t=>'<span class="pill '+(t[1]||'')+'">'+t[0]+'</span>').join('')+'</div><h4>'+r.n+'</h4><p>'+r.d+'</p><dl class="kv"><dt>Qui</dt><dd>'+r.qui+'</dd><dt>Quand</dt><dd>'+r.quand+'</dd><dt>Votre rôle</dt><dd>'+r.role+'</dd><dt>Texte</dt><dd>'+r.ref+'</dd></dl></div>';
}

document.getElementById('euGrid').innerHTML = EU.map(regCard).join('');


document.getElementById('frGrid').innerHTML = FR.map(regCard).join('');

/* ---------------- ESRS ---------------- */

document.getElementById('esrsTable').innerHTML = ESRS.map(r=>'<tr><td><strong>'+r[0]+'</strong></td><td>'+r[1]+'</td><td>'+r[2]+'</td></tr>').join('');

document.getElementById('dmSteps').innerHTML = DM.map(s=>'<li>'+s+'</li>').join('');

document.getElementById('csrdRules').innerHTML = CSRDR.map(r=>'<div class="card" data-s="1"><h4>'+r[0]+'</h4><p>'+r[1]+'</p></div>').join('');

/* ---------------- TAXONOMIE ---------------- */

document.getElementById('taxoObj').innerHTML = TXO.map((t,i)=>'<div class="tile"><div class="big">'+(i+1)+'</div><div class="lbl">'+t+'</div></div>').join('');
function pct(a,b){ return b>0 ? Math.min(100, a/b*100) : 0; }
function fmt(x){ return x.toLocaleString('fr-FR',{maximumFractionDigits:1}) + ' %'; }
function taxo(){
  const v = id => Math.max(0, parseFloat(document.getElementById(id).value)||0);
  const rows = [["Chiffre d'affaires", v('tx_ca'), v('tx_cae'), v('tx_caa')], ["CapEx", v('tx_cx'), v('tx_cxe'), v('tx_cxa')]];
  let warn = '';
  rows.forEach(r => { if (r[3] > r[2]) warn = '<div class="callout" style="margin-top:12px"><strong>Incohérence</strong>Le montant aligné ne peut pas dépasser le montant éligible : une activité alignée est forcément éligible.</div>'; });
  document.getElementById('taxoOut').innerHTML = '<div class="tablewrap"><table><thead><tr><th>Indicateur</th><th>Part éligible</th><th>Part alignée</th><th>Taux de conversion éligible → aligné</th></tr></thead><tbody>' + rows.map(r => {
    const e = pct(r[2], r[1]), a = pct(r[3], r[1]), c = pct(r[3], r[2]);
    return '<tr><td><strong>'+r[0]+'</strong></td><td class="num">'+fmt(e)+'<div class="bar"><span style="width:'+e+'%;background:var(--info)"></span></div></td><td class="num">'+fmt(a)+'<div class="bar"><span style="width:'+a+'%"></span></div></td><td class="num">'+fmt(c)+'</td></tr>';
  }).join('') + '</tbody></table></div>' + warn + '<p style="font-size:14px;color:var(--muted)">Lecture : un écart important entre éligible et aligné signale souvent un DNSH non documenté (étude de vulnérabilité climatique manquante, par exemple) plutôt qu\'une activité non conforme.</p>';
}
document.getElementById('taxoForm').addEventListener('input', taxo); taxo();

/* ---------------- KPI ---------------- */

document.getElementById('kpiGrid').innerHTML = KPI.map(k=>'<div class="card" data-s="1"><div class="meta"><span class="'+k[1]+'">'+k[0]+'</span></div><ul style="margin:0;padding-left:18px">'+k[2].map(x=>'<li>'+x+'</li>').join('')+'</ul></div>').join('');

/* ---------------- NORMES ---------------- */

const NCAT = ["Tous","Management","Carbone","Reporting","Notation","Label"];
function renderNorms(c){
  document.getElementById('normTable').innerHTML = NORMS.filter(n=>c==='Tous'||n[4]===c).map(n=>'<tr data-s="1"><td><strong>'+n[0]+'</strong></td><td>'+n[1]+'</td><td>'+n[2]+'</td><td>'+n[3]+'</td></tr>').join('');
}
document.getElementById('normFilters').innerHTML = NCAT.map((c,i)=>'<button class="chip'+(i?'':' on')+'" data-c="'+c+'">'+c+'</button>').join('');
document.querySelectorAll('#normFilters .chip').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('#normFilters .chip').forEach(x=>x.classList.toggle('on',x===b));renderNorms(b.dataset.c);}));
renderNorms('Tous');

/* ---------------- SECTEURS ---------------- */

document.getElementById('sectorList').innerHTML = SECT.map(s=>'<details data-s="1"><summary>'+s[0]+'</summary><div class="inner"><div class="grid two"><div><h4>Enjeux matériels typiques</h4><ul>'+s[1].map(x=>'<li>'+x+'</li>').join('')+'</ul></div><div><h4>Indicateurs attendus</h4><ul>'+s[3].map(x=>'<li>'+x+'</li>').join('')+'</ul></div></div><dl class="kv"><dt>Textes</dt><dd>'+s[2][0]+'</dd><dt>Référentiels</dt><dd>'+s[2][1]+'</dd><dt>Levier fort</dt><dd>'+s[4]+'</dd></dl></div></details>').join('');

/* ---------------- MÉTIER ---------------- */

document.getElementById('attentes').innerHTML = ATT.map(a=>'<div class="card" data-s="1"><h4>'+a[0]+'</h4><p>'+a[1]+'</p></div>').join('');

document.getElementById('skills').innerHTML = SKL.map(s=>'<div class="card" data-s="1"><div class="meta"><span class="'+s[1]+'">'+s[0]+'</span></div><ul style="margin:0;padding-left:18px">'+s[2].map(x=>'<li>'+x+'</li>').join('')+'</ul></div>').join('');

document.getElementById('interview').innerHTML = INT.map(q=>'<details data-s="1"><summary>'+q[0]+'</summary><div class="inner"><p>'+q[1]+'</p></div></details>').join('');

const CKKEY = 'seriki_checklist';
let ckState = {};
try { ckState = JSON.parse(localStorage.getItem(CKKEY) || '{}'); } catch(e) { ckState = {}; }
function renderCK(){
  document.getElementById('checklist').innerHTML = CK.map((c,i)=>'<label><input type="checkbox" data-i="'+i+'"'+(ckState[i]?' checked':'')+'> <span>'+c+'</span></label>').join('');
  updCK();
  document.querySelectorAll('#checklist input').forEach(inp=>inp.addEventListener('change',()=>{
    ckState[inp.dataset.i] = inp.checked; try { localStorage.setItem(CKKEY, JSON.stringify(ckState)); } catch(e){} updCK();
  }));
}
function updCK(){ const n = CK.filter((_,i)=>ckState[i]).length; document.getElementById('ckProgress').textContent = n + ' / ' + CK.length + ' compétences acquises'; document.getElementById('ckBar').style.width = (n/CK.length*100)+'%'; }
renderCK();

/* ---------------- MÉTHODES ---------------- */

document.getElementById('methodList').innerHTML = METH.map(m=>'<details data-s="1"><summary>'+m[0]+'</summary><div class="inner"><ol class="steps">'+m[1].map(s=>'<li>'+s+'</li>').join('')+'</ol><dl class="kv"><dt>Livrable</dt><dd>'+m[2]+'</dd><dt>Piège</dt><dd>'+m[3]+'</dd></dl></div></details>').join('');

/* ---------------- MODÈLES ---------------- */

document.getElementById('tplList').innerHTML = TPL.map((t,i)=>'<details data-s="1"><summary>'+t[0]+'</summary><div class="inner"><div class="ctool"><button class="btn" data-copy="'+i+'">Copier le modèle</button><button class="btn ghost" data-tdoc="'+i+'">Télécharger en Word</button><button class="btn ghost" data-tpdf="'+i+'">Enregistrer en PDF</button></div><div class="tpl" id="tpl'+i+'">'+esc(t[1])+'</div></div></details>').join('');
document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click', async ()=>{
  const t = TPL[b.dataset.copy][1];
  try { await navigator.clipboard.writeText(t); toast('Modèle copié'); }
  catch(e){ const r=document.createRange(); r.selectNodeContents(document.getElementById('tpl'+b.dataset.copy)); const s=getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texte sélectionné : Ctrl+C pour copier'); }
}));

const tplHtml = i => '<h1>' + esc(TPL[i][0]) + '</h1>' + esc(TPL[i][1]).split(/\n{2,}/).map(p => '<p style="text-align:justify">' + p.replace(/\n/g, '<br>') + '</p>').join('');
document.getElementById('tplList').addEventListener('click', e => { const w = e.target.closest('[data-tdoc]'), f = e.target.closest('[data-tpdf]'); if (w) { downloadDoc(tplHtml(+w.dataset.tdoc), TPL[+w.dataset.tdoc][0]); toast('Modèle téléchargé en Word'); } else if (f) printHtml(tplHtml(+f.dataset.tpdf)); });
/* ---------------- VÉRIFICATEUR ---------------- */
function check(){
  const n = id => Math.max(0, parseFloat(document.getElementById(id).value)||0);
  const b = id => document.getElementById(id).checked;
  const eff=n('c_eff'), effFr=n('c_effFr'), ca=n('c_ca'), siege=b('c_siege'), cote=b('c_cote'), fin=b('c_fin'), tert=b('c_tert'), ao=b('c_ao'), site=b('c_site');
  const V = [];
  const add = (cls,tag,t,p) => V.push([cls,tag,t,p]);
  if (eff>1000 && ca>450) add('yes','Concernée','CSRD : rapport de durabilité','Premier rapport sur l\'exercice 2027 (publication 2028) selon les ESRS 2026, sauf si l\'entreprise publie déjà en vague 1. Taxonomie applicable. Calendrier exact à confirmer par la loi française de transposition.');
  else add('no','Non soumise','CSRD : pas d\'obligation légale','Reporting volontaire recommandé avec le VSME, surtout si de grands clients le demandent. Si l\'effectif est inférieur à 1 000, les clients soumis à la CSRD ne peuvent pas exiger davantage que la norme volontaire.');
  if (eff>5000 && ca>1500) add('yes','Concernée','CSDDD : devoir de vigilance européen','Application à partir du 26 juillet 2029. Préparer dès maintenant la cartographie des risques de la chaîne d\'activités.');
  if (siege && (effFr>=5000 || eff>=10000)) add('yes','Concernée','Devoir de vigilance français (loi de 2017)','Plan de vigilance annuel en cinq mesures, contrôlable par le juge (tribunal judiciaire de Paris). Le climat doit y être traité.');
  else if (siege && eff>=3000) add('maybe','À surveiller','Devoir de vigilance français','Proche des seuils : vérifier le calcul des effectifs avec les filiales directes et indirectes.');
  if (effFr>500) add('yes','Concernée','BEGES réglementaire','Bilan des scopes 1, 2 et 3 significatif tous les 4 ans, avec plan de transition, publié sur la plateforme de l\'ADEME. Amende jusqu\'à 50 000 €.');
  else add('no','Non soumise','BEGES','Pas d\'obligation au titre de l\'effectif, mais un bilan volontaire est souvent exigé par les clients et les banques.');
  if (effFr>=500 && ca>100) add('yes','Concernée','Loi Sapin II : programme anticorruption','Huit mesures, dont la cartographie des risques et l\'évaluation des tiers.');
  if (effFr>=1000) add('yes','Concernée','Loi Rixain : femmes dirigeantes','Au moins 30 % de femmes parmi les cadres dirigeants et membres des instances dirigeantes depuis mars 2026, 40 % en 2029 (si le seuil est atteint trois années de suite).');
  if (effFr>=50) add('yes','Concernée','Index de l\'égalité professionnelle et BDESE environnementale','Publication de l\'index au plus tard le 1er mars ; volet environnemental de la BDESE et information du CSE. À adapter lors de la transposition de la directive sur la transparence salariale.');
  if (effFr>=20) add('yes','Concernée','Obligation d\'emploi de travailleurs handicapés','Objectif de 6 % de l\'effectif, déclaration via la DSN.');
  if (site) add('yes','Concernée','Mobilité domicile-travail (loi LOM)','Thème de la négociation annuelle ou plan de mobilité employeur.');
  if (tert) add('yes','Concernée','Décret tertiaire','Déclaration annuelle sur OPERAT et trajectoire –40 % en 2030.');
  if (ao) add('yes','Concernée','Marchés publics','Critère environnemental obligatoire dans l\'analyse des offres depuis le 22 août 2026 : préparer un mémoire environnemental type.');
  if (fin) add('yes','Concernée','Finance durable','SFDR et, selon la taille, article 29 de la loi Énergie-Climat ; taxonomie avec indicateurs propres aux établissements financiers.');
  if (cote && !(eff>1000 && ca>450)) add('maybe','À vérifier','Société cotée sous les seuils','Les PME cotées sont sorties de la CSRD, mais les investisseurs et l\'AMF attendent une information ESG claire.');
  add('maybe','Pour tous','Communication et produits','Directive ECGT (allégations environnementales) depuis le 27 septembre 2026 ; AGEC et PPWR pour les produits et emballages.');
  const order={yes:0,maybe:1,no:2};
  V.sort((a,b)=>order[a[0]]-order[b[0]]);
  document.getElementById('verdicts').innerHTML = '<p class="progress">'+V.filter(v=>v[0]==='yes').length+' obligations identifiées</p>' + V.map(v=>'<div class="verdict '+v[0]+'"><span class="tag">'+v[1]+'</span><div><strong>'+v[2]+'</strong><p>'+v[3]+'</p></div></div>').join('');
}
document.getElementById('chkForm').addEventListener('input', check);
document.getElementById('chkForm').addEventListener('change', check);
check();

/* ---------------- GLOSSAIRE ---------------- */

function renderGlo(f){
  const q=(f||'').toLowerCase();
  document.getElementById('glossary').innerHTML = GLO.filter(g=>!q||(g[0]+' '+g[1]).toLowerCase().includes(q)).map(g=>'<div class="glo" data-s="1"><dt>'+g[0]+'</dt><dd>'+g[1]+'</dd></div>').join('') || '<p>Aucun terme ne correspond. Essayez la recherche générale en haut de page.</p>';
}
renderGlo(''); document.getElementById('gq').addEventListener('input',e=>renderGlo(e.target.value));

/* ---------------- SOURCES ---------------- */

document.getElementById('srcGrid').innerHTML = SRC.map(s=>'<div class="card" data-s="1"><h4>'+s[0]+'</h4><p>'+s[2]+'</p><a href="'+s[1]+'" target="_blank" rel="noopener">'+s[1].replace('https://','')+'</a></div>').join('');

/* ---------------- RECHERCHE GLOBALE ---------------- */
let INDEX = [];
function buildIndex(){
  INDEX = [];
  document.querySelectorAll('section.view').forEach(sec => {
    sec.querySelectorAll('[data-s], .card, details, tr, .tl, .glo, ol.steps li').forEach(el => {
      const t = (el.querySelector('h4, summary, dt, td strong')||{}).textContent || '';
      const txt = el.textContent.replace(/\s+/g,' ').trim();
      if (txt.length > 20) INDEX.push({sec: sec.id, secT: sec.dataset.title, title: t.trim() || txt.slice(0,70), txt, el});
    });
  });
}
const norm = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const qEl = document.getElementById('q'), rEl = document.getElementById('results');
qEl.addEventListener('input', () => {
  const q = norm(qEl.value.trim());
  if (q.length < 2) { rEl.classList.remove('open'); return; }
  const terms = q.split(/\s+/);
  const seen = new Set();
  const hits = INDEX.filter(i => { const n = norm(i.txt); return terms.every(t => n.includes(t)); })
    .filter(i => { const k = i.sec + i.title; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 25);
  rEl.innerHTML = hits.length ? hits.map((h,k) => {
    const n = norm(h.txt), p = Math.max(0, n.indexOf(terms[0]) - 50);
    return '<button data-k="'+k+'"><div class="rs">'+esc(h.secT)+'</div><div class="rt">'+esc(h.title)+'</div><div class="rs">…'+esc(h.txt.slice(p, p+130))+'…</div></button>';
  }).join('') : '<button disabled><div class="rt">Aucun résultat</div><div class="rs">Essayez un sigle (CSRD, DNSH) ou un mot simple (carbone, achats).</div></button>';
  rEl.classList.add('open');
  rEl.querySelectorAll('button[data-k]').forEach(b => b.addEventListener('click', () => go(hits[b.dataset.k])));
});
function go(h){
  rEl.classList.remove('open'); qEl.value='';
  location.hash = h.sec; show(h.sec);
  let el = h.el; const d = el.closest('details'); if (d) d.open = true;
  const target = el.closest('.card, details, .tl, .glo, tr') || el;
  setTimeout(() => { target.scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'center'}); target.classList.add('flash'); setTimeout(()=>target.classList.remove('flash'), 1600); }, 60);
}
document.addEventListener('click', e => { if (!e.target.closest('.search')) rEl.classList.remove('open'); });
qEl.addEventListener('keydown', e => { if (e.key==='Escape') rEl.classList.remove('open'); if (e.key==='Enter') { const f = rEl.querySelector('button[data-k]'); if (f) f.click(); } });

/* =====================================================================
   MON ESPACE COURS : espace privé de chaque utilisateur.
   Tout est enregistré sur l'appareil (IndexedDB) : aucune IA, aucun compte, aucun serveur.
   ===================================================================== */
const E = {matieres: [], cours: [], fichiers: [], notions: [], questions: [], cur: null, tab: 'cours', curCours: null, quiz: null, revue: null, q: '', ready: false};
const cRoot = document.getElementById('coursRoot');
const arr = x => Array.isArray(x) ? x : [];
const uid = () => (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
const COLORS = [['#1d6a50','Forêt'],['#2a5b86','Bleu'],['#a2701c','Ocre'],['#8a3b6b','Prune'],['#a33a2c','Brique'],['#4b5d67','Ardoise'],['#5b6b2f','Olive'],['#2f6f73','Lagon']];
const STORES = ['matieres','cours','fichiers','blobs','notions','questions','kv','travaux','candidatures'];
const LEITNER = [0, 1, 3, 7, 14, 30];
const DAY = 86400000;

/* ---------- Catalogue des matières types d'un master RSE ---------- */
const MODELES = [
  {id:'fondamentaux',nom:'Fondamentaux de la RSE et du développement durable',couleur:'#1d6a50',chap:['Histoire et grands concepts','ISO 26000 et les 7 questions centrales','Parties prenantes et dialogue','Objectifs de développement durable','RSE et stratégie d\'entreprise'],liens:[['fondamentaux','Fondamentaux'],['histoire','Histoire']]},
  {id:'reporting',nom:'Reporting extra-financier et CSRD',couleur:'#2a5b86',chap:['CSRD et Omnibus','Les normes ESRS','Double matérialité','Collecte et contrôle des données','Audit et assurance'],liens:[['csrd','CSRD et ESRS'],['reporting','Reporting et carbone']]},
  {id:'finance',nom:'Taxonomie et finance durable',couleur:'#2f6f73',chap:['La taxonomie européenne','SFDR et produits financiers','ISR et labels','Notation ESG','Investissement à impact'],liens:[['taxonomie','Taxonomie verte'],['europe','Réglementation UE']]},
  {id:'carbone',nom:'Stratégie climat et bilan carbone',couleur:'#a2701c',chap:['Gaz à effet de serre et scopes','Bilan carbone et BEGES','Trajectoires et SBTi','Plan de transition','Adaptation au changement climatique'],liens:[['reporting','Reporting et carbone'],['methodes','Méthodes']]},
  {id:'droit',nom:'Droit de l\'environnement et conformité RSE',couleur:'#4b5d67',chap:['Sources du droit de l\'environnement','Installations classées (ICPE)','Responsabilité environnementale','Devoir de vigilance','Contentieux climatiques'],liens:[['france','Réglementation France'],['europe','Réglementation UE']]},
  {id:'achats',nom:'Achats responsables et chaîne de valeur',couleur:'#5b6b2f',chap:['ISO 20400 et politique achats','Cartographie des risques fournisseurs','Évaluation et audit des fournisseurs','CSDDD et vigilance','EUDR, MACF et traçabilité'],liens:[['methodes','Méthodes'],['europe','Réglementation UE']]},
  {id:'circulaire',nom:'Économie circulaire et écoconception',couleur:'#2f6f73',chap:['Loi AGEC','Analyse de cycle de vie','Écoconception','Filières REP','Règlements PPWR et ESPR'],liens:[['france','Réglementation France'],['secteurs','Secteur par secteur']]},
  {id:'gouvernance',nom:'Gouvernance, éthique et conformité',couleur:'#8a3b6b',chap:['Gouvernance d\'entreprise','Loi Sapin II et anticorruption','Raison d\'être et société à mission','Lanceurs d\'alerte','Conduite des affaires (ESRS G1)'],liens:[['france','Réglementation France'],['csrd','CSRD et ESRS']]},
  {id:'social',nom:'Social, droits humains et qualité de vie au travail',couleur:'#a33a2c',chap:['Égalité professionnelle et transparence salariale','Diversité et handicap','Santé et sécurité au travail','Dialogue social','Droits humains dans la chaîne de valeur'],liens:[['france','Réglementation France'],['normes','Normes et labels']]},
  {id:'biodiversite',nom:'Biodiversité et ressources naturelles',couleur:'#5b6b2f',chap:['Limites planétaires','Biodiversité et entreprise','Cadre TNFD','Eau et sols','ESRS E3 et E4'],liens:[['fondamentaux','Fondamentaux'],['csrd','CSRD et ESRS']]},
  {id:'projet',nom:'Pilotage de projet et conduite du changement RSE',couleur:'#2a5b86',chap:['Gestion de projet RSE','Feuille de route et indicateurs','Conduite du changement','Sensibilisation et formation','Communication interne'],liens:[['methodes','Méthodes'],['metier','Le métier']]},
  {id:'communication',nom:'Communication responsable et lutte contre le greenwashing',couleur:'#a2701c',chap:['Directive ECGT','Allégations environnementales','Labels et preuves','Rapports et communication financière','Récit et communication responsable'],liens:[['modeles','Modèles de rédaction'],['europe','Réglementation UE']]}
];

/* ---------- Base de données locale ---------- */
const IDB = {
  db: null,
  open(){ return new Promise((res, rej) => {
    if (!window.indexedDB) return rej(new Error('indexedDB indisponible'));
    const r = indexedDB.open('seriki-espace', 3);
    r.onupgradeneeded = () => { const d = r.result; STORES.forEach(s => { if (!d.objectStoreNames.contains(s)) d.createObjectStore(s, {keyPath: 'id'}); }); };
    r.onsuccess = () => { IDB.db = r.result; res(); };
    r.onerror = () => rej(r.error);
  }); },
  req(store, mode, fn){ return new Promise((res, rej) => { const t = IDB.db.transaction(store, mode); const q = fn(t.objectStore(store)); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error); }); },
  all(s){ return IDB.req(s, 'readonly', o => o.getAll()); },
  get(s, id){ return IDB.req(s, 'readonly', o => o.get(id)); },
  put(s, v){ return IDB.req(s, 'readwrite', o => o.put(v)); },
  del(s, id){ return IDB.req(s, 'readwrite', o => o.delete(id)); }
};
async function save(store, obj){ obj.updatedAt = Date.now(); await IDB.put(store, obj); const list = E[store]; if (list) { const i = list.findIndex(x => x.id === obj.id); if (i >= 0) list[i] = obj; else list.push(obj); } return obj; }
async function remove(store, id){ await IDB.del(store, id); if (E[store]) E[store] = E[store].filter(x => x.id !== id); }

async function initEspace(){
  cRoot.innerHTML = '<p class="progress"><span class="spin"></span> Ouverture de votre espace…</p>';
  try {
    await IDB.open();
    for (const s of ['matieres','cours','fichiers','notions','questions']) E[s] = await IDB.all(s);
    E.ready = true;
    if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
  } catch(e) {
    document.getElementById('coursStatus').innerHTML = '<div class="callout"><strong>Espace personnel indisponible</strong>Ce navigateur ne permet pas d\'enregistrer des données (navigation privée, ou stockage désactivé). Ouvrez l\'application dans une fenêtre normale.</div>';
  }
  render();
}

/* ---------- Utilitaires ---------- */
const matOf = id => E.matieres.find(m => m.id === id);
const ofMat = (s, mid) => E[s].filter(x => x.matiereId === mid);
const coursOf = mid => ofMat('cours', mid).sort((a, b) => (a.ordre || 0) - (b.ordre || 0) || (a.createdAt || 0) - (b.createdAt || 0));
const txt = html => { const d = document.createElement('div'); d.innerHTML = html || ''; return d.textContent || ''; };
const textToHtml = t => String(t || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map(p => '<p>' + esc(p.replace(/([^.:;!?])\n(?=[a-zà-ÿ0-9(«"'])/g, '$1 ')).replace(/\n/g, '<br>') + '</p>').join('');
function sizeFmt(b){ if (!b) return ''; return b > 1048576 ? (b / 1048576).toFixed(1).replace('.', ',') + ' Mo' : Math.max(1, Math.round(b / 1024)) + ' Ko'; }
function cleanHtml(html){
  const t = document.createElement('template'); t.innerHTML = html || '';
  const ok = {P:1,BR:1,B:1,STRONG:1,I:1,EM:1,U:1,H3:1,H4:1,UL:1,OL:1,LI:1,BLOCKQUOTE:1,DIV:1};
  const kill = {SCRIPT:1,STYLE:1,IFRAME:1,OBJECT:1,EMBED:1,LINK:1,META:1,svg:1,SVG:1,IMG:1,VIDEO:1,AUDIO:1,FORM:1,INPUT:1,BUTTON:1};
  (function walk(n){ Array.from(n.childNodes).forEach(c => {
    if (c.nodeType === 1) {
      if (kill[c.tagName]) { c.remove(); return; }
      walk(c);
      if (!ok[c.tagName]) { c.replaceWith(...Array.from(c.childNodes)); return; }
      Array.from(c.attributes).forEach(a => c.removeAttribute(a.name));
    } else if (c.nodeType !== 3) c.remove();
  }); })(t.content);
  return t.innerHTML;
}

/* ---------- Modale ---------- */
function modal(title, body, okLabel, onOk, danger, onOpen){
  const m = document.getElementById('modal');
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalBody').innerHTML = body;
  const ok = document.getElementById('modalOk');
  ok.textContent = okLabel || 'Valider'; ok.className = 'btn' + (danger ? ' danger' : ''); ok.style.display = onOk ? '' : 'none';
  m.hidden = false; if (onOpen) onOpen();
  const first = m.querySelector('input:not([type=radio]):not([type=checkbox]),textarea,select'); (first || ok).focus();
  const close = () => { m.hidden = true; ok.onclick = null; };
  ok.onclick = async () => { ok.disabled = true; try { const r = await onOk(); if (r !== false) close(); } finally { ok.disabled = false; } };
  document.getElementById('modalCancel').onclick = close;
  m.onkeydown = e => { if (e.key === 'Escape') close(); };
  m.onclick = e => { if (e.target === m) close(); };
}

/* ---------- Lecture du texte des fichiers (bibliothèques incluses dans lib/) ---------- */
function loadScript(src){ return new Promise((res, rej) => { if (document.querySelector('script[src="' + src + '"]')) return res(); const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('Lecteur de fichiers introuvable (' + src + ').')); document.head.appendChild(s); }); }
async function extractText(file){
  const n = (file.name || '').toLowerCase();
  if (n.endsWith('.pdf')) {
    await loadScript('lib/pdf.min.js'); await loadScript('lib/pdf.worker.min.js');
    const lib = window.pdfjsLib; lib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
    const pdf = await lib.getDocument({data: new Uint8Array(await file.arrayBuffer())}).promise;
    const out = [];
    for (let i = 1; i <= pdf.numPages; i++) { const pg = await pdf.getPage(i); const c = await pg.getTextContent(); out.push(c.items.map(x => x.str + (x.hasEOL ? '\n' : ' ')).join('')); }
    return {text: out.join('\n\n'), pages: pdf.numPages};
  }
  if (n.endsWith('.docx')) { await loadScript('lib/mammoth.browser.min.js'); const r = await window.mammoth.extractRawText({arrayBuffer: await file.arrayBuffer()}); return {text: r.value}; }
  if (n.endsWith('.pptx')) {
    await loadScript('lib/jszip.min.js');
    const zip = await window.JSZip.loadAsync(await file.arrayBuffer());
    const slides = Object.keys(zip.files).filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).sort((a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]));
    const dec = s => s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'").replace(/&amp;/g,'&');
    const out = [];
    for (let i = 0; i < slides.length; i++) { const xml = await zip.file(slides[i]).async('string'); const paras = xml.split(/<\/a:p>/).map(p => (p.match(/<a:t>([\s\S]*?)<\/a:t>/g) || []).map(t => dec(t.replace(/<\/?a:t>/g, ''))).join('')).filter(Boolean); out.push('Diapositive ' + (i + 1) + '\n' + paras.join('\n')); }
    return {text: out.join('\n\n'), pages: slides.length};
  }
  if (n.endsWith('.txt') || n.endsWith('.md')) return {text: await file.text()};
  return {text: ''};
}
const tidy = t => String(t || '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

async function addFile(file, mid, coursId){
  if (file.size > 50 * 1048576) { toast(file.name + ' dépasse 50 Mo'); return null; }
  let ex = {text: ''};
  try { ex = await extractText(file); } catch(e) { ex = {text: ''}; }
  const id = uid();
  await IDB.put('blobs', {id, blob: file});
  return save('fichiers', {id, matiereId: mid, coursId: coursId || null, nom: file.name, type: (file.name.split('.').pop() || '').toLowerCase(), mime: file.type || '', taille: file.size, pages: ex.pages || null, texte: tidy(ex.text), createdAt: Date.now()});
}
async function openFile(fid){
  const b = await IDB.get('blobs', fid), f = E.fichiers.find(x => x.id === fid);
  if (!b || !b.blob) { toast('Fichier introuvable sur cet appareil'); return; }
  const url = URL.createObjectURL(b.blob);
  const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
  if (!/pdf|image|text/.test(b.blob.type || '') || IN_PREVIEW) { setTimeout(() => URL.revokeObjectURL(url), 1000); saveBlob(b.blob, (f && f.nom) || 'fichier'); return; }
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/* ---------- Rendu ---------- */
function render(){ if (E.cur && !matOf(E.cur)) E.cur = null; if (!E.cur) renderList(); else renderMat(); }

function renderList(){
  const nm = E.matieres.length, nc = E.cours.length, nn = E.notions.length, nq = E.questions.length;
  const due = E.notions.filter(n => (n.next || 0) <= Date.now()).length;
  let h = '<div class="eyebrow">MON ESPACE · PRIVÉ</div><h2>Mon espace cours</h2>';
  h += '<p class="lead">Créez vos matières, rangez-y vos cours, vos fichiers, vos notions et vos questions de révision. Tout reste privé, enregistré uniquement sur cet appareil.</p>';
  if (!E.ready) { cRoot.innerHTML = h; return; }
  h += '<div class="tiles"><div class="tile"><div class="big">' + nm + '</div><div class="lbl">matière' + (nm > 1 ? 's' : '') + '</div></div><div class="tile"><div class="big">' + nc + '</div><div class="lbl">cours</div></div><div class="tile"><div class="big">' + nn + '</div><div class="lbl">notions' + (due ? ', dont ' + due + ' à réviser' : '') + '</div></div><div class="tile"><div class="big">' + nq + '</div><div class="lbl">questions de quiz</div></div></div>';
  h += '<div class="ctool"><button class="btn" data-act="newMat">+ Nouvelle matière</button>' + (E.matieres.some(m => m.exemple) ? '' : '<button class="btn ghost" data-act="addExemple">Ajouter la matière d\'exemple</button>') + '<button class="btn ghost" data-act="backup">Sauvegarder mon espace</button><label class="btn ghost" for="restoreIn" tabindex="0">Restaurer une sauvegarde<input type="file" id="restoreIn" accept=".json,application/json" hidden></label></div>';
  if (nm) h += '<input class="inp" id="espaceQ" type="search" placeholder="Rechercher dans mes cours, notions et questions" aria-label="Rechercher dans mon espace" value="' + esc(E.q) + '" style="max-width:480px;margin-bottom:12px"><div id="espaceRes"></div>';
  if (nm) h += '<div class="grid">' + E.matieres.slice().sort((a, b) => (a.ordre || 0) - (b.ordre || 0)).map(m => {
    const c = ofMat('cours', m.id).length, n = ofMat('notions', m.id).length, q = ofMat('questions', m.id).length, f = ofMat('fichiers', m.id).length;
    return '<button class="card mat" data-act="open" data-id="' + esc(m.id) + '" style="--mc:' + esc(m.couleur || '#1d6a50') + '"><h4>' + esc(m.nom) + (m.exemple ? '<span class="badge-ex">Exemple</span>' : '') + '</h4>' + (m.description ? '<span class="sub">' + esc(m.description) + '</span>' : '') + '<span class="stats"><span class="pill g">' + c + ' cours</span>' + (f ? '<span class="pill g">' + f + ' fichier' + (f > 1 ? 's' : '') + '</span>' : '') + (n ? '<span class="pill">' + n + ' notions</span>' : '') + (q ? '<span class="pill b">' + q + ' questions</span>' : '') + (m.best != null ? '<span class="pill o">Quiz : ' + m.best + ' %</span>' : '') + '</span></button>';
  }).join('') + '</div>';
  else h += '<div class="callout g"><strong>Votre espace est vide</strong>Créez votre première matière : partez d\'un modèle (Reporting et CSRD, Stratégie climat, Achats responsables…) qui propose déjà les chapitres, ou d\'une matière libre. Vous pouvez aussi ajouter la matière d\'exemple pour découvrir toutes les fonctions.</div>';
  h += '<div class="callout b" style="margin-top:22px"><strong>Vos données vous appartiennent</strong>Elles sont enregistrées dans ce navigateur, sur cet appareil, et ne sont envoyées nulle part. Pour les retrouver sur un autre appareil ou les mettre à l\'abri, utilisez « Sauvegarder mon espace », puis « Restaurer une sauvegarde » sur l\'autre appareil.</div>';
  cRoot.innerHTML = h;
  if (nm) { renderSearch(); document.getElementById('espaceQ').addEventListener('input', e => { E.q = e.target.value; renderSearch(); }); }
}
function renderSearch(){
  const box = document.getElementById('espaceRes'); if (!box) return;
  const q = norm(E.q.trim()); if (q.length < 2) { box.innerHTML = ''; return; }
  const hits = [];
  E.cours.forEach(c => { const t = norm((c.titre || '') + ' ' + txt(c.contenu)); if (t.includes(q)) hits.push(['Cours', c.titre || 'Sans titre', c.matiereId, 'cours', c.id]); });
  E.notions.forEach(n => { if (norm(n.terme + ' ' + n.definition).includes(q)) hits.push(['Notion', n.terme, n.matiereId, 'notions', null]); });
  E.questions.forEach(x => { if (norm(x.question + ' ' + (x.reponse || '') + ' ' + arr(x.choix).join(' ')).includes(q)) hits.push(['Question', x.question, x.matiereId, 'quiz', null]); });
  E.fichiers.forEach(f => { if (norm(f.nom + ' ' + (f.texte || '')).includes(q)) hits.push(['Fichier', f.nom, f.matiereId, 'fichiers', null]); });
  box.innerHTML = hits.length ? '<div class="card" style="margin-bottom:14px;padding:6px 0">' + hits.slice(0, 30).map(h => '<button class="frow" style="width:100%;border:0;border-bottom:1px solid var(--line);border-radius:0;margin:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer" data-act="goto" data-m="' + esc(h[2]) + '" data-t="' + h[3] + '" data-c="' + esc(h[4] || '') + '"><div><span class="pill g">' + h[0] + '</span> <strong>' + esc(h[1]) + '</strong><div class="progress">' + esc((matOf(h[2]) || {}).nom || '') + '</div></div></button>').join('') + '</div>' : '<p class="progress">Aucun résultat dans votre espace.</p>';
}

const TABS = [['cours','Cours'],['fichiers','Fichiers'],['notions','Notions et fiches mémo'],['quiz','Quiz'],['ressources','Ressources']];
function renderMat(){
  const m = matOf(E.cur);
  cRoot.style.setProperty('--mc', m.couleur || '#1d6a50');
  const cnt = {cours: ofMat('cours', m.id).length, fichiers: ofMat('fichiers', m.id).length, notions: ofMat('notions', m.id).length, quiz: ofMat('questions', m.id).length};
  cRoot.innerHTML = '<div class="chead"><div><button class="linkbtn" data-act="back">← Mon espace</button><h2>' + esc(m.nom) + (m.exemple ? '<span class="badge-ex">Exemple</span>' : '') + '</h2><div style="color:var(--muted)">' + esc(m.description || '') + '</div></div><div class="ctool" style="margin:0"><button class="btn ghost sm" data-act="editMat">Modifier</button><button class="btn danger sm" data-act="delMat">Supprimer</button></div></div>'
    + '<div class="ctabs" role="tablist">' + TABS.map(t => '<button class="ctab' + (E.tab === t[0] ? ' on' : '') + '" role="tab" aria-selected="' + (E.tab === t[0]) + '" data-act="tab" data-t="' + t[0] + '">' + t[1] + (cnt[t[0]] ? '<span class="cnt">' + cnt[t[0]] + '</span>' : '') + '</button>').join('') + '</div><div id="cBody"></div>';
  const body = document.getElementById('cBody');
  ({cours: tabCours, fichiers: tabFichiers, notions: tabNotions, quiz: tabQuiz, ressources: tabRessources})[E.tab](m, body);
}

/* ---------- Onglet Cours (éditeur) ---------- */
function tabCours(m, el){
  const cs = coursOf(m.id);
  if (E.curCours && !cs.find(c => c.id === E.curCours)) E.curCours = null;
  if (!E.curCours && cs.length) E.curCours = cs[0].id;
  const c = cs.find(x => x.id === E.curCours);
  let h = '<div class="cgrid"><div class="clist"><button class="btn sm" data-act="newCours" style="width:100%">+ Nouveau cours</button>' + cs.map((x, i) => '<button class="citem' + (x.id === E.curCours ? ' on' : '') + '" data-act="pickCours" data-id="' + esc(x.id) + '"><span class="ci-n">' + (i + 1) + '</span><span>' + esc(x.titre || 'Sans titre') + (x.date ? '<span class="ci-d">' + esc(new Date(x.date).toLocaleDateString('fr-FR')) + '</span>' : '') + '</span></button>').join('') + '</div><div class="cedit">';
  if (!c) h += '<div class="callout g"><strong>Aucun cours pour l\'instant</strong>Créez un cours, donnez-lui un titre et écrivez ou collez son contenu. Vous pouvez aussi importer le texte d\'un PDF, d\'un Word ou d\'un PowerPoint.</div>';
  else {
    const atts = E.fichiers.filter(f => f.coursId === c.id);
    h += '<div class="crow"><input class="inp ctitle" id="cTitre" value="' + esc(c.titre || '') + '" placeholder="Titre du cours" aria-label="Titre du cours"><input class="inp" type="date" id="cDate" value="' + esc(c.date || '') + '" aria-label="Date du cours" style="max-width:170px"></div>'
      + '<div class="tb" role="toolbar" aria-label="Mise en forme">'
      + [['formatBlock:h3','Titre'],['formatBlock:h4','Sous-titre'],['bold','<b>G</b>'],['italic','<i>I</i>'],['underline','<u>S</u>'],['insertUnorderedList','• Liste'],['insertOrderedList','1. Liste'],['formatBlock:blockquote','Citation'],['formatBlock:p','Normal']].map(b => '<button type="button" data-cmd="' + b[0] + '" title="' + b[0] + '">' + b[1] + '</button>').join('')
      + '</div><div class="editor" id="cEditor" contenteditable="true" spellcheck="true" aria-label="Contenu du cours" data-ph="Écrivez ou collez ici le contenu du cours…">' + cleanHtml(c.contenu || '') + '</div>'
      + '<div class="ctool"><span class="progress" id="saveState">Enregistrement automatique</span></div>'
      + '<div class="ctool"><label class="btn ghost sm" for="importIn" tabindex="0">Importer le texte d\'un fichier<input type="file" id="importIn" accept=".pdf,.docx,.pptx,.txt,.md" hidden></label><label class="btn ghost sm" for="attachIn" tabindex="0">Joindre un fichier<input type="file" id="attachIn" multiple hidden></label><button class="btn ghost sm" data-act="notionSel">Créer une notion avec la sélection</button><button class="btn ghost sm" data-act="printCours">Imprimer</button><button class="btn danger sm" data-act="delCours">Supprimer ce cours</button></div>'
      + (atts.length ? '<h4 style="margin-top:14px">Fichiers joints</h4>' + atts.map(f => fileRow(f)).join('') : '');
  }
  h += '</div></div>';
  el.innerHTML = h;
  if (c) bindEditor(c);
}
function fileRow(f, withMake){
  return '<div class="frow"><div><div class="fn">' + esc(f.nom) + '</div><div class="meta" style="margin:6px 0 0"><span class="pill g">' + esc((f.type || '').toUpperCase()) + '</span><span class="pill g">' + sizeFmt(f.taille) + '</span>' + (f.pages ? '<span class="pill g">' + f.pages + ' pages</span>' : '') + (f.texte ? '<span class="pill">Texte lu</span>' : '') + '</div></div><div class="acts"><button class="btn ghost sm" data-act="openFile" data-id="' + esc(f.id) + '">Ouvrir</button>' + (withMake && f.texte ? '<button class="btn ghost sm" data-act="fileToCours" data-id="' + esc(f.id) + '">Créer un cours avec ce texte</button>' : '') + '<button class="btn danger sm" data-act="delFile" data-id="' + esc(f.id) + '">Supprimer</button></div></div>';
}
function bindEditor(c){
  const ed = document.getElementById('cEditor'), ti = document.getElementById('cTitre'), da = document.getElementById('cDate'), st = document.getElementById('saveState');
  let t = null;
  const queue = () => { st.textContent = 'Modifications en cours…'; clearTimeout(t); t = setTimeout(async () => {
    c.titre = ti.value.trim(); c.date = da.value; c.contenu = cleanHtml(ed.innerHTML);
    try { await save('cours', c); st.textContent = 'Enregistré à ' + new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}); const it = cRoot.querySelector('.citem.on span:last-child'); if (it) it.firstChild.textContent = c.titre || 'Sans titre'; }
    catch(e) { st.textContent = 'Échec de l\'enregistrement : espace de stockage plein ?'; }
  }, 700); };
  ed.addEventListener('input', queue); ti.addEventListener('input', queue); da.addEventListener('change', queue);
  ed.addEventListener('paste', e => { const cd = e.clipboardData; if (!cd) return; e.preventDefault(); const html = cd.getData('text/html'); if (html) document.execCommand('insertHTML', false, cleanHtml(html)); else document.execCommand('insertText', false, cd.getData('text/plain')); });
  cRoot.querySelectorAll('.tb button').forEach(b => b.addEventListener('mousedown', e => { e.preventDefault(); const [cmd, val] = b.dataset.cmd.split(':'); ed.focus(); document.execCommand(cmd, false, val ? '<' + val + '>' : null); queue(); }));
  document.getElementById('importIn').addEventListener('change', async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return; st.textContent = 'Lecture du fichier…'; const fr = await addFile(f, c.matiereId, c.id); if (fr && fr.texte) { ed.focus(); const sel = window.getSelection(); if (!ed.contains(sel.anchorNode)) { const r = document.createRange(); r.selectNodeContents(ed); r.collapse(false); sel.removeAllRanges(); sel.addRange(r); } document.execCommand('insertHTML', false, textToHtml(fr.texte)); if (!ti.value.trim()) ti.value = f.name.replace(/\.[^.]+$/, ''); queue(); toast('Texte importé et fichier joint'); } else { toast('Aucun texte lisible : le fichier a été joint au cours'); renderMat(); } });
  document.getElementById('attachIn').addEventListener('change', async e => { const fs = Array.from(e.target.files); e.target.value = ''; for (const f of fs) await addFile(f, c.matiereId, c.id); toast(fs.length > 1 ? 'Fichiers joints' : 'Fichier joint'); renderMat(); });
}

/* ---------- Onglet Fichiers ---------- */
function tabFichiers(m, el){
  const fs = ofMat('fichiers', m.id).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  el.innerHTML = '<label class="drop" for="fileIn" data-drop="1"><strong>Déposez vos supports de cours ici</strong><span>ou cliquez pour les choisir · PDF, Word, PowerPoint, images, texte · 50 Mo maximum par fichier. Le texte des PDF, Word et PowerPoint est lu pour la recherche et peut devenir un cours.</span><input type="file" id="fileIn" multiple hidden></label>'
    + (fs.length ? fs.map(f => fileRow(f, true)).join('') : '<p class="progress" style="margin-top:14px">Aucun fichier dans cette matière.</p>');
}
async function handleDrop(list){ const m = matOf(E.cur); if (!m) return; const fs = Array.from(list); toast('Enregistrement de ' + fs.length + ' fichier' + (fs.length > 1 ? 's' : '') + '…'); for (const f of fs) { try { await addFile(f, m.id, null); } catch(e) { toast('Échec : ' + f.name); } } renderMat(); }

/* ---------- Onglet Notions et fiches mémo ---------- */
function tabNotions(m, el){
  if (E.revue && E.revue.mid === m.id) return renderRevue(el);
  const ns = ofMat('notions', m.id).sort((a, b) => String(a.terme).localeCompare(String(b.terme), 'fr'));
  const due = ns.filter(n => (n.next || 0) <= Date.now()).length;
  const known = ns.filter(n => (n.boite || 1) >= 4).length;
  el.innerHTML = '<div class="grid two"><div class="card"><h4>Ajouter une notion</h4><div class="row"><label for="nT">Notion</label><input class="inp" id="nT" placeholder="Ex. Double matérialité"></div><div class="row"><label for="nD">Définition</label><textarea class="ta" id="nD" placeholder="La définition à retenir"></textarea></div><button class="btn" data-act="addNotion">Ajouter</button></div>'
    + '<div class="card"><div class="meta"><span class="pill">Fiches mémo</span></div><h4>Réviser par répétition espacée</h4><p>Chaque notion est révisée de plus en plus rarement quand vous la connaissez : 1, 3, 7, 14 puis 30 jours.</p><p><strong>' + due + '</strong> à réviser maintenant · <strong>' + known + '</strong> bien acquise' + (known > 1 ? 's' : '') + ' sur ' + ns.length + '</p><div class="ctool"><button class="btn" data-act="revue" data-all="0"' + (due ? '' : ' disabled') + '>Réviser les notions du jour</button><button class="btn ghost" data-act="revue" data-all="1"' + (ns.length ? '' : ' disabled') + '>Tout réviser</button></div></div></div>'
    + (ns.length ? '<h3>Mes notions <span class="progress">(' + ns.length + ')</span></h3><div class="tablewrap"><table><thead><tr><th>Notion</th><th>Définition</th><th>Niveau</th><th></th></tr></thead><tbody>' + ns.map(n => '<tr><td><strong>' + esc(n.terme) + '</strong></td><td>' + esc(n.definition) + '</td><td><span class="pill ' + ((n.boite || 1) >= 4 ? '' : (n.boite || 1) >= 2 ? 'o' : 'g') + '">' + ['', 'Nouvelle', 'En cours', 'En cours', 'Acquise', 'Maîtrisée'][Math.min(5, n.boite || 1)] + '</span></td><td style="white-space:nowrap"><button class="linkbtn" data-act="editNotion" data-id="' + esc(n.id) + '">Modifier</button> · <button class="linkbtn" style="color:var(--danger)" data-act="delNotion" data-id="' + esc(n.id) + '">Supprimer</button></td></tr>').join('') + '</tbody></table></div>' : '');
  const nD = document.getElementById('nD'); nD.addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) cRoot.querySelector('[data-act=addNotion]').click(); });
}
function renderRevue(el){
  const R = E.revue;
  if (R.i >= R.cards.length) { el.innerHTML = '<div class="card flashcard"><div class="meta"><span class="pill">Révision terminée</span></div><h4>' + R.ok + ' sur ' + R.cards.length + ' notions connues</h4><p>Les notions à revoir reviendront dès la prochaine séance.</p><div class="ctool"><button class="btn" data-act="revueEnd">Terminer</button></div></div>'; return; }
  const n = R.cards[R.i];
  el.innerHTML = '<div class="card flashcard"><div class="meta"><span class="pill">Fiche ' + (R.i + 1) + ' / ' + R.cards.length + '</span></div><div class="bar"><span style="width:' + (R.i / R.cards.length * 100) + '%"></span></div><div class="fc-term">' + esc(n.terme) + '</div>' + (R.shown ? '<div class="fc-def">' + esc(n.definition) + '</div><div class="ctool" style="justify-content:center"><button class="btn danger" data-act="fcNo">À revoir</button><button class="btn" data-act="fcYes">Je savais</button></div>' : '<div class="ctool" style="justify-content:center"><button class="btn" data-act="fcShow">Afficher la définition</button></div>') + '<div class="ctool" style="justify-content:center"><button class="linkbtn" data-act="revueEnd">Arrêter la révision</button></div></div>';
}

/* ---------- Onglet Quiz ---------- */
function genQuestions(mid){
  const ns = ofMat('notions', mid).filter(n => n.terme && n.definition);
  if (ns.length < 4) return [];
  return ns.map(n => { const others = ns.filter(x => x.id !== n.id).sort(() => Math.random() - .5).slice(0, 3).map(x => x.terme); const choix = others.concat([n.terme]).sort(() => Math.random() - .5); return {auto: true, type: 'qcm', question: 'Quelle notion correspond à cette définition : « ' + n.definition + ' » ?', choix, bonne: choix.indexOf(n.terme), explication: n.terme + ' : ' + n.definition}; });
}
function tabQuiz(m, el){
  if (E.quiz && E.quiz.mid === m.id) return renderQuiz(el);
  const qs = ofMat('questions', m.id), auto = genQuestions(m.id);
  el.innerHTML = '<div class="grid two"><div class="card quiz"><div class="meta"><span class="pill">Quiz</span>' + (m.best != null ? '<span class="pill o">Meilleur score : ' + m.best + ' %</span>' : '') + '</div><h4>S\'entraîner</h4><p>' + qs.length + ' question' + (qs.length > 1 ? 's' : '') + ' créée' + (qs.length > 1 ? 's' : '') + ' par vous' + (auto.length ? ' et ' + auto.length + ' générée' + (auto.length > 1 ? 's' : '') + ' automatiquement à partir de vos notions' : '') + '. Chaque quiz en tire jusqu\'à 10 au hasard.</p>' + (!auto.length && ofMat('notions', m.id).length < 4 ? '<p class="progress">Ajoutez au moins 4 notions pour obtenir des questions automatiques.</p>' : '') + '<button class="btn" data-act="quizStart"' + (qs.length + auto.length ? '' : ' disabled') + '>Lancer un quiz</button></div>'
    + '<div class="card"><h4>Créer une question</h4><div class="row"><label for="qType">Type</label><select class="inp" id="qType"><option value="qcm">Choix multiple</option><option value="ouverte">Question ouverte</option></select></div><div class="row"><label for="qQ">Question</label><textarea class="ta" id="qQ" style="min-height:60px"></textarea></div><div id="qFields"></div><button class="btn" data-act="addQuestion">Ajouter la question</button></div></div>'
    + (qs.length ? '<h3>Mes questions <span class="progress">(' + qs.length + ')</span></h3>' + qs.map(q => '<details><summary>' + esc(q.question) + '</summary><div class="inner">' + (q.type === 'qcm' ? '<ol type="A">' + arr(q.choix).map((c, i) => '<li' + (i === q.bonne ? ' style="font-weight:700;color:var(--accent)"' : '') + '>' + esc(c) + '</li>').join('') + '</ol>' : '<p><strong>Réponse attendue :</strong> ' + esc(q.reponse || '') + '</p>') + (q.explication ? '<p class="progress">' + esc(q.explication) + '</p>' : '') + '<button class="btn danger sm" data-act="delQuestion" data-id="' + esc(q.id) + '">Supprimer</button></div></details>').join('') : '');
  const ty = document.getElementById('qType'), qf = document.getElementById('qFields');
  const draw = () => { qf.innerHTML = ty.value === 'qcm' ? [0,1,2,3].map(i => '<div class="row" style="flex-direction:row;align-items:center;gap:8px"><input type="radio" name="qB" value="' + i + '"' + (i ? '' : ' checked') + ' aria-label="Bonne réponse ' + String.fromCharCode(65 + i) + '"><input class="inp" id="qC' + i + '" placeholder="Réponse ' + String.fromCharCode(65 + i) + (i < 2 ? '' : ' (facultative)') + '"></div>').join('') + '<p class="progress">Cochez la bonne réponse.</p><div class="row"><label for="qE">Explication (facultative)</label><input class="inp" id="qE"></div>' : '<div class="row"><label for="qR">Réponse attendue</label><textarea class="ta" id="qR" style="min-height:70px"></textarea></div>'; };
  ty.addEventListener('change', draw); draw();
}
function quizStart(){
  const m = matOf(E.cur);
  const all = ofMat('questions', m.id).concat(genQuestions(m.id)).sort(() => Math.random() - .5).slice(0, 10);
  E.quiz = {mid: m.id, qs: all, i: 0, score: 0, picked: null, shown: false};
  renderQuiz(document.getElementById('cBody'));
}
function renderQuiz(el){
  const Q = E.quiz;
  if (Q.i >= Q.qs.length) {
    const pc = Math.round(Q.score / Q.qs.length * 100), m = matOf(Q.mid);
    if (m && (m.best == null || pc > m.best)) { m.best = pc; save('matieres', m); }
    el.innerHTML = '<div class="card quiz"><div class="meta"><span class="pill">Résultat</span></div><div style="font-family:var(--font-display);font-size:34px;font-weight:600">' + Q.score + ' / ' + Q.qs.length + '</div><div class="progress">' + pc + ' % de bonnes réponses</div><div class="bar" style="margin:12px 0"><span style="width:' + pc + '%"></span></div><p>' + (pc >= 80 ? 'Très bon niveau.' : pc >= 50 ? 'Bonne base : revoyez les notions des questions manquées.' : 'Relisez vos cours et vos notions, puis recommencez.') + '</p><div class="ctool"><button class="btn" data-act="quizStart">Nouveau quiz</button><button class="btn ghost" data-act="quizEnd">Retour</button></div></div>';
    return;
  }
  const q = Q.qs[Q.i];
  let h = '<div class="card quiz"><div class="meta"><span class="pill">Question ' + (Q.i + 1) + ' / ' + Q.qs.length + '</span><span class="pill g">Score : ' + Q.score + '</span>' + (q.auto ? '<span class="pill b">Générée depuis vos notions</span>' : '') + '</div><div class="bar"><span style="width:' + (Q.i / Q.qs.length * 100) + '%"></span></div><h4 style="font-size:18px;margin-top:14px">' + esc(q.question) + '</h4>';
  if (q.type === 'qcm') {
    const ans = Number(q.bonne);
    h += arr(q.choix).map((c, i) => { let cls = 'opt'; if (Q.picked != null) { if (i === ans) cls += ' ok'; else if (i === Q.picked) cls += ' ko'; } return '<button class="' + cls + '" data-act="quizAns" data-i="' + i + '"' + (Q.picked != null ? ' disabled' : '') + '>' + String.fromCharCode(65 + i) + '. ' + esc(c) + '</button>'; }).join('');
    if (Q.picked != null) h += '<div class="callout ' + (Q.picked === ans ? 'g' : '') + '"><strong>' + (Q.picked === ans ? 'Bonne réponse.' : 'La bonne réponse était ' + String.fromCharCode(65 + ans) + '.') + '</strong>' + esc(q.explication || '') + '</div><button class="btn" data-act="quizNext">' + (Q.i + 1 < Q.qs.length ? 'Question suivante' : 'Voir mon résultat') + '</button>';
  } else {
    h += Q.shown ? '<div class="callout g"><strong>Réponse attendue</strong>' + esc(q.reponse || '') + '</div><p>Votre réponse était-elle juste ?</p><div class="ctool"><button class="btn" data-act="openOk">Oui, j\'avais juste</button><button class="btn danger" data-act="openKo">Non, à revoir</button></div>' : '<textarea class="ta" placeholder="Répondez ici pour vous entraîner (facultatif)" aria-label="Votre réponse"></textarea><div class="ctool"><button class="btn" data-act="openShow">Voir la réponse</button></div>';
  }
  h += ' <div class="ctool"><button class="btn ghost sm" data-act="quizEnd">Arrêter</button></div></div>';
  el.innerHTML = h;
}

/* ---------- Onglet Ressources ---------- */
function tabRessources(m, el){
  const mod = MODELES.find(x => x.id === m.modele);
  let h = '';
  if (mod) h += '<div class="card"><div class="meta"><span class="pill o">Modèle : ' + esc(mod.nom) + '</span></div><h4>Chapitres habituels de cette matière</h4><ol>' + mod.chap.map(c => '<li>' + esc(c) + '</li>').join('') + '</ol><div class="ctool"><button class="btn ghost sm" data-act="addChapitres">Créer les chapitres manquants comme cours</button></div></div><h3>Dans la Bible de la RSE</h3><div class="grid">' + mod.liens.map(l => '<a class="card" href="#' + l[0] + '" style="text-decoration:none;color:inherit"><h4>' + esc(l[1]) + ' →</h4><p>Le contenu de référence lié à cette matière.</p></a>').join('') + '</div>';
  h += '<h3>Toute la Bible de la RSE</h3><div class="filters">' + NAV.filter(g => g[0] === 'Apprendre').flatMap(g => g[1]).filter(x => x[0] !== 'cours').map(([id, label]) => '<a class="chip" href="#' + id + '" style="text-decoration:none">' + esc(label) + '</a>').join('') + '</div>';
  el.innerHTML = h;
}

/* ---------- Matières ---------- */
function matForm(m){
  m = m || {}; const col = m.couleur || COLORS[E.matieres.length % COLORS.length][0];
  return (m.id ? '' : '<div class="row"><label for="fMod">Partir d\'un modèle</label><select class="inp" id="fMod"><option value="">Matière libre (vide)</option>' + MODELES.map(x => '<option value="' + x.id + '">' + esc(x.nom) + '</option>').join('') + '</select></div>')
    + '<div class="row"><label for="fNom">Nom de la matière</label><input class="inp" id="fNom" value="' + esc(m.nom || '') + '" placeholder="Ex. Reporting extra-financier"></div>'
    + '<div class="row"><label for="fDesc">Description</label><input class="inp" id="fDesc" value="' + esc(m.description || '') + '" placeholder="Ex. Semestre 1 · intervenant, volume horaire…"></div>'
    + (m.id ? '' : '<label class="row" style="flex-direction:row;align-items:center;gap:8px;font-weight:500"><input type="checkbox" id="fChap" checked> Créer les chapitres du modèle comme cours vides</label>')
    + '<div class="row"><span>Couleur</span><div class="swatches">' + COLORS.map(c => '<label><input type="radio" name="fCol" value="' + c[0] + '"' + (c[0] === col ? ' checked' : '') + '><span class="sw" style="background:' + c[0] + '"></span>' + c[1] + '</label>').join('') + '</div></div>';
}
function newMat(){
  modal('Nouvelle matière', matForm(), 'Créer la matière', async () => {
    const nom = document.getElementById('fNom').value.trim(); if (!nom) { toast('Indiquez le nom de la matière'); document.getElementById('fNom').focus(); return false; }
    const modId = document.getElementById('fMod').value, mod = MODELES.find(x => x.id === modId), c = document.querySelector('input[name="fCol"]:checked');
    const m = await save('matieres', {id: uid(), nom: nom.slice(0, 140), description: document.getElementById('fDesc').value.trim().slice(0, 240), couleur: c ? c.value : COLORS[0][0], modele: modId || null, ordre: Date.now(), createdAt: Date.now()});
    if (mod && document.getElementById('fChap').checked) { let i = 0; for (const t of mod.chap) await save('cours', {id: uid(), matiereId: m.id, titre: t, contenu: '', ordre: ++i, createdAt: Date.now() + i}); }
    E.nextTab = 'cours'; E.nextCours = null; location.hash = 'cours--' + m.id;
  }, false, () => {
    const s = document.getElementById('fMod'), n = document.getElementById('fNom');
    s.addEventListener('change', () => { const mod = MODELES.find(x => x.id === s.value); if (mod) { n.value = mod.nom; const r = document.querySelector('input[name="fCol"][value="' + mod.couleur + '"]'); if (r) r.checked = true; } });
  });
}
function editMat(){
  const m = matOf(E.cur);
  modal('Modifier la matière', matForm(m), 'Enregistrer', async () => {
    const nom = document.getElementById('fNom').value.trim(); if (!nom) { toast('Indiquez le nom de la matière'); return false; }
    const c = document.querySelector('input[name="fCol"]:checked');
    m.nom = nom.slice(0, 140); m.description = document.getElementById('fDesc').value.trim().slice(0, 240); m.couleur = c ? c.value : m.couleur;
    await save('matieres', m); render();
  });
}
function delMat(){
  const m = matOf(E.cur);
  modal('Supprimer « ' + m.nom + ' » ?', '<p>La matière et tout son contenu (' + ofMat('cours', m.id).length + ' cours, ' + ofMat('fichiers', m.id).length + ' fichiers, ' + ofMat('notions', m.id).length + ' notions, ' + ofMat('questions', m.id).length + ' questions) seront supprimés de cet appareil. Pensez à sauvegarder votre espace avant si besoin.</p>', 'Supprimer définitivement', async () => {
    for (const s of ['cours','notions','questions']) for (const x of ofMat(s, m.id)) await remove(s, x.id);
    for (const f of ofMat('fichiers', m.id)) { await IDB.del('blobs', f.id); await remove('fichiers', f.id); }
    await remove('matieres', m.id); E.cur = null; location.hash = 'cours'; render();
  }, true);
}

/* ---------- Matière d'exemple ---------- */
async function addExemple(){
  let pack;
  try { pack = await (await fetch('data/cours/exemple-csrd.json', {cache: 'no-cache'})).json(); } catch(e) { toast('Matière d\'exemple introuvable'); return; }
  const m = await save('matieres', {id: uid(), nom: 'Exemple : Reporting de durabilité (CSRD)', description: 'Matière de démonstration. Vous pouvez la modifier ou la supprimer.', couleur: '#1d6a50', modele: 'reporting', exemple: true, ordre: Date.now(), createdAt: Date.now()});
  let i = 0;
  const S = pack.synthese;
  if (S) await save('cours', {id: uid(), matiereId: m.id, ordre: ++i, createdAt: Date.now(), titre: 'Fiche de synthèse de la matière', contenu: cleanHtml('<p>' + esc(S.essentiel) + '</p><h3>À retenir</h3><ul>' + arr(S.a_retenir).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h3>Pièges fréquents</h3><ul>' + arr(S.pieges).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h3>Sujets d\'examen probables</h3><ul>' + arr(S.sujets).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>')});
  for (const c of arr(pack.cours)) {
    await save('cours', {id: uid(), matiereId: m.id, ordre: ++i, createdAt: Date.now() + i, titre: c.titre, contenu: cleanHtml('<p>' + esc(c.resume) + '</p>' + (arr(c.plan).length ? '<h3>Plan</h3><ol>' + arr(c.plan).map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' : '') + (arr(c.points_cles).length ? '<h3>Idées clés</h3><ul>' + arr(c.points_cles).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '') + (arr(c.chiffres).length ? '<h3>Chiffres</h3><ul>' + arr(c.chiffres).map(x => '<li><b>' + esc(x.valeur) + '</b> : ' + esc(x.contexte) + '</li>').join('') + '</ul>' : '') + (arr(c.liens_rse).length ? '<blockquote>' + arr(c.liens_rse).map(esc).join(' ') + '</blockquote>' : ''))});
    for (const n of arr(c.notions)) await save('notions', {id: uid(), matiereId: m.id, terme: n.terme, definition: n.definition, boite: 1, next: 0, createdAt: Date.now()});
    for (const q of arr(c.qcm)) await save('questions', {id: uid(), matiereId: m.id, type: 'qcm', question: q.question, choix: arr(q.choix), bonne: q.bonne, explication: q.explication || '', createdAt: Date.now()});
    for (const x of arr(c.exercices)) await save('questions', {id: uid(), matiereId: m.id, type: 'ouverte', question: x.enonce, reponse: x.corrige, explication: x.indice || '', createdAt: Date.now()});
  }
  toast('Matière d\'exemple ajoutée'); E.nextTab = 'cours'; E.nextCours = null; location.hash = 'cours--' + m.id;
}

/* ---------- Sauvegarde et restauration ---------- */
const blobToData = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
async function backup(){
  toast('Préparation de la sauvegarde…');
  const out = {application: 'SERIKI BIBLE RSE', format: 2, date: new Date().toISOString(), ls: {}};
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); out.ls[k] = localStorage.getItem(k); } } catch(e) {}
  for (const s of ['matieres','cours','fichiers','notions','questions','kv','travaux','candidatures']) out[s] = await IDB.all(s);
  out.blobs = [];
  for (const b of await IDB.all('blobs')) { try { out.blobs.push({id: b.id, data: await blobToData(b.blob)}); } catch(e) {} }
  const blob = new Blob([JSON.stringify(out)], {type: 'application/json'});
  const ok = await saveBlob(blob, 'seriki-sauvegarde-' + new Date().toISOString().slice(0, 10) + '.json');
  if (ok !== false) { try { localStorage.setItem('lastBackup', new Date().toISOString()); } catch(e) {} toast('Sauvegarde téléchargée'); }
}
async function restore(file){
  let data; try { data = JSON.parse(await file.text()); } catch(e) { toast('Fichier de sauvegarde illisible'); return; }
  if (!data || data.application !== 'SERIKI BIBLE RSE') { toast('Ce fichier n\'est pas une sauvegarde SERIKI BIBLE RSE'); return; }
  modal('Restaurer cette sauvegarde ?', '<p>Sauvegarde du ' + esc(new Date(data.date).toLocaleString('fr-FR')) + ' : ' + arr(data.matieres).length + ' matières, ' + arr(data.cours).length + ' cours, ' + arr(data.fichiers).length + ' fichiers. Son contenu sera ajouté à votre espace ; les éléments identiques seront remplacés par leur version sauvegardée.</p>', 'Restaurer', async () => {
    for (const s of ['matieres','cours','fichiers','notions','questions','kv','travaux','candidatures']) for (const x of arr(data[s])) if (x && x.id) { if (s === 'cours') x.contenu = cleanHtml(x.contenu); await IDB.put(s, x); }
    for (const b of arr(data.blobs)) { try { const blob = await (await fetch(b.data)).blob(); await IDB.put('blobs', {id: b.id, blob}); } catch(e) {} }
    for (const s of ['matieres','cours','fichiers','notions','questions']) E[s] = await IDB.all(s);
    P.profil = (await IDB.get('kv', 'profil')) || null; P.travaux = {}; (await IDB.all('travaux')).forEach(t => P.travaux[t.id] = t);
    try { Object.entries(data.ls || {}).forEach(([k, v]) => localStorage.setItem(k, v)); } catch(e) {}
    toast('Sauvegarde restaurée : redémarrage…'); setTimeout(() => location.reload(), 900);
  });
}

/* ---------- Événements ---------- */
cRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act, m = matOf(E.cur);
  if (a === 'open') { E.nextTab = 'cours'; E.nextCours = null; location.hash = 'cours--' + b.dataset.id; }
  else if (a === 'goto') { E.nextTab = b.dataset.t; E.nextCours = b.dataset.c || null; if (E.cur === b.dataset.m) { E.cur = null; } location.hash = 'cours--' + b.dataset.m; }
  else if (a === 'back') { location.hash = 'cours'; }
  else if (a === 'tab') { E.tab = b.dataset.t; E.quiz = null; E.revue = null; render(); }
  else if (a === 'newMat') newMat();
  else if (a === 'editMat') editMat();
  else if (a === 'delMat') delMat();
  else if (a === 'addExemple') addExemple();
  else if (a === 'backup') backup();
  else if (a === 'newCours') { const n = coursOf(m.id).length; const c = await save('cours', {id: uid(), matiereId: m.id, titre: '', contenu: '', ordre: n + 1, createdAt: Date.now()}); E.curCours = c.id; render(); const t = document.getElementById('cTitre'); if (t) t.focus(); }
  else if (a === 'pickCours') { E.curCours = b.dataset.id; render(); }
  else if (a === 'delCours') { const c = E.cours.find(x => x.id === E.curCours); modal('Supprimer ce cours ?', '<p>« ' + esc(c.titre || 'Sans titre') + ' » sera supprimé. Ses fichiers joints restent dans l\'onglet Fichiers.</p>', 'Supprimer', async () => { for (const f of E.fichiers.filter(f => f.coursId === c.id)) { f.coursId = null; await save('fichiers', f); } await remove('cours', c.id); E.curCours = null; render(); }, true); }
  else if (a === 'printCours') { const c = E.cours.find(x => x.id === E.curCours); printHtml('<h1>' + esc(c.titre || '') + '</h1><p><em>' + esc(m.nom) + '</em></p>' + cleanHtml(c.contenu)); }
  else if (a === 'notionSel') { const sel = String(window.getSelection() || '').trim(); const parts = sel.split(/\s*[:–—]\s+/); const terme = parts.length > 1 ? parts[0] : ''; const def = parts.length > 1 ? parts.slice(1).join(' : ') : sel; modal('Nouvelle notion', '<div class="row"><label for="mT">Notion</label><input class="inp" id="mT" value="' + esc(terme.slice(0, 120)) + '"></div><div class="row"><label for="mD">Définition</label><textarea class="ta" id="mD">' + esc(def) + '</textarea></div>' + (sel ? '' : '<p class="progress">Astuce : sélectionnez un passage du cours avant de cliquer, il sera repris comme définition.</p>'), 'Ajouter la notion', async () => { const t = document.getElementById('mT').value.trim(), d = document.getElementById('mD').value.trim(); if (!t || !d) { toast('Notion et définition sont nécessaires'); return false; } await save('notions', {id: uid(), matiereId: m.id, terme: t, definition: d, boite: 1, next: 0, createdAt: Date.now()}); toast('Notion ajoutée'); }); }
  else if (a === 'openFile') openFile(b.dataset.id);
  else if (a === 'delFile') { const f = E.fichiers.find(x => x.id === b.dataset.id); modal('Supprimer ce fichier ?', '<p>« ' + esc(f.nom) + ' » sera supprimé de cet appareil.</p>', 'Supprimer', async () => { await IDB.del('blobs', f.id); await remove('fichiers', f.id); render(); }, true); }
  else if (a === 'fileToCours') { const f = E.fichiers.find(x => x.id === b.dataset.id); const c = await save('cours', {id: uid(), matiereId: m.id, titre: f.nom.replace(/\.[^.]+$/, ''), contenu: textToHtml(f.texte), ordre: coursOf(m.id).length + 1, createdAt: Date.now()}); f.coursId = c.id; await save('fichiers', f); E.tab = 'cours'; E.curCours = c.id; render(); toast('Cours créé à partir du fichier'); }
  else if (a === 'addNotion') { const t = document.getElementById('nT').value.trim(), d = document.getElementById('nD').value.trim(); if (!t || !d) { toast('Indiquez la notion et sa définition'); return; } await save('notions', {id: uid(), matiereId: m.id, terme: t, definition: d, boite: 1, next: 0, createdAt: Date.now()}); render(); const n = document.getElementById('nT'); if (n) n.focus(); }
  else if (a === 'editNotion') { const n = E.notions.find(x => x.id === b.dataset.id); modal('Modifier la notion', '<div class="row"><label for="mT">Notion</label><input class="inp" id="mT" value="' + esc(n.terme) + '"></div><div class="row"><label for="mD">Définition</label><textarea class="ta" id="mD">' + esc(n.definition) + '</textarea></div>', 'Enregistrer', async () => { n.terme = document.getElementById('mT').value.trim() || n.terme; n.definition = document.getElementById('mD').value.trim() || n.definition; await save('notions', n); render(); }); }
  else if (a === 'delNotion') { await remove('notions', b.dataset.id); render(); }
  else if (a === 'revue') { const ns = ofMat('notions', m.id).filter(n => b.dataset.all === '1' || (n.next || 0) <= Date.now()).sort(() => Math.random() - .5); E.revue = {mid: m.id, cards: ns, i: 0, ok: 0, shown: false}; renderRevue(document.getElementById('cBody')); }
  else if (a === 'fcShow') { E.revue.shown = true; renderRevue(document.getElementById('cBody')); }
  else if (a === 'fcYes' || a === 'fcNo') { const R = E.revue, n = R.cards[R.i]; if (a === 'fcYes') { R.ok++; n.boite = Math.min(5, (n.boite || 1) + 1); } else n.boite = 1; n.next = Date.now() + LEITNER[n.boite] * DAY - (a === 'fcNo' ? 0 : 3600000); await save('notions', n); R.i++; R.shown = false; renderRevue(document.getElementById('cBody')); }
  else if (a === 'revueEnd') { E.revue = null; render(); }
  else if (a === 'addQuestion') {
    const type = document.getElementById('qType').value, q = document.getElementById('qQ').value.trim(); if (!q) { toast('Écrivez la question'); return; }
    if (type === 'qcm') { const raw = [0,1,2,3].map(i => document.getElementById('qC' + i).value.trim()); const picked = +document.querySelector('input[name="qB"]:checked').value; if (!raw[picked]) { toast('La bonne réponse cochée est vide'); return; } const choix = [], map = {}; raw.forEach((c, i) => { if (c) { map[i] = choix.length; choix.push(c); } }); if (choix.length < 2) { toast('Indiquez au moins deux réponses'); return; } await save('questions', {id: uid(), matiereId: m.id, type, question: q, choix, bonne: map[picked], explication: document.getElementById('qE').value.trim(), createdAt: Date.now()}); }
    else { const r = document.getElementById('qR').value.trim(); if (!r) { toast('Indiquez la réponse attendue'); return; } await save('questions', {id: uid(), matiereId: m.id, type, question: q, reponse: r, createdAt: Date.now()}); }
    toast('Question ajoutée'); render();
  }
  else if (a === 'delQuestion') { await remove('questions', b.dataset.id); render(); }
  else if (a === 'quizStart') quizStart();
  else if (a === 'quizAns') { const Q = E.quiz; if (Q.picked != null) return; Q.picked = +b.dataset.i; if (Q.picked === Number(Q.qs[Q.i].bonne)) Q.score++; renderQuiz(document.getElementById('cBody')); }
  else if (a === 'openShow') { E.quiz.shown = true; renderQuiz(document.getElementById('cBody')); }
  else if (a === 'openOk' || a === 'openKo' || a === 'quizNext') { const Q = E.quiz; if (a === 'openOk') Q.score++; Q.i++; Q.picked = null; Q.shown = false; renderQuiz(document.getElementById('cBody')); }
  else if (a === 'quizEnd') { E.quiz = null; render(); }
  else if (a === 'addChapitres') { const mod = MODELES.find(x => x.id === m.modele); const have = new Set(coursOf(m.id).map(c => norm(c.titre || ''))); let n = coursOf(m.id).length, k = 0; for (const t of mod.chap) if (!have.has(norm(t))) { await save('cours', {id: uid(), matiereId: m.id, titre: t, contenu: '', ordre: ++n, createdAt: Date.now() + n}); k++; } toast(k ? k + ' chapitre' + (k > 1 ? 's' : '') + ' ajouté' + (k > 1 ? 's' : '') : 'Tous les chapitres existent déjà'); }
});
cRoot.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('label.btn[tabindex]')) { e.preventDefault(); e.target.click(); } });
cRoot.addEventListener('change', e => {
  if (e.target.id === 'fileIn' && e.target.files.length) { handleDrop(e.target.files); e.target.value = ''; }
  else if (e.target.id === 'restoreIn' && e.target.files.length) { restore(e.target.files[0]); e.target.value = ''; }
});
cRoot.addEventListener('dragover', e => { const d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); d.classList.add('over'); } });
cRoot.addEventListener('dragleave', e => { const d = e.target.closest('[data-drop]'); if (d) d.classList.remove('over'); });
cRoot.addEventListener('drop', e => { const d = e.target.closest('[data-drop]'); if (d) { e.preventDefault(); d.classList.remove('over'); if (e.dataTransfer.files.length) handleDrop(e.dataTransfer.files); } });
const espaceReady = initEspace();
/* =====================================================================
   PARCOURS : profil, tableau de bord, fiches métiers, laboratoire de cas,
   compétences et portfolio. Données dans data/metiers.json et data/labo.json,
   progression enregistrée sur l'appareil (IndexedDB).
   ===================================================================== */
const P = {comp: [], metiers: [], cas: [], avert: '', profil: null, travaux: {}, curCas: null, famille: 'Toutes'};
const SITUATIONS = ['Étudiant', 'Alternant', 'Stagiaire', 'Demandeur d\'emploi', 'Professionnel en poste', 'Professionnel en reconversion'];
const NIV = ['Non évaluée', 'Débutant', 'Intermédiaire', 'Avancé'];
const compName = id => (P.comp.find(c => c.id === id) || {}).nom || id;
const metier = id => P.metiers.find(m => m.id === id);
const casById = id => P.cas.find(c => c.id === id);
const done = id => P.travaux[id] && P.travaux[id].statut === 'termine';
const goTo = h => { if (location.hash === '#' + h) { show(h); pRefresh(h.split('--')[0]); applySub(); } else location.hash = h; window.scrollTo(0, 0); };

async function pInit(){
  try {
    const [m, l] = await Promise.all([fetch('data/metiers.json', {cache: 'no-cache'}).then(r => r.json()), fetch('data/labo.json', {cache: 'no-cache'}).then(r => r.json())]);
    P.comp = arr(m.competences); P.metiers = arr(m.metiers); P.cas = arr(l.cas); P.avert = l.avertissement || '';
  } catch(e) { toast('Contenus carrière indisponibles'); }
  await espaceReady;
  if (IDB.db) {
    try { P.profil = (await IDB.get('kv', 'profil')) || null; } catch(e) {}
    try { (await IDB.all('travaux')).forEach(t => P.travaux[t.id] = t); } catch(e) {}
  }
  renderMetiers(); renderLabo(); renderHubs(); renderProfil(); renderDash(); buildIndex();
}
function pRefresh(id){ if (id === 'accueil') renderDash(); else if (id === 'profil') renderProfil(); else if (id === 'labo') renderLabo(); else if (id === 'metiers') renderMetiers(); }
window.addEventListener('hashchange', () => pRefresh(route().base));
async function saveProfil(){ P.profil.id = 'profil'; P.profil.updatedAt = Date.now(); await IDB.put('kv', P.profil); }
async function saveTravail(t){ t.updatedAt = Date.now(); P.travaux[t.id] = t; await IDB.put('travaux', t); }
function compLevel(id){ return (P.profil && P.profil.competences && P.profil.competences[id]) || 0; }
function compWorked(id){ return P.cas.filter(c => done(c.id) && arr(c.competences).includes(id)).length; }

/* ---------- Tableau de bord ---------- */
const PUBLICS = [['etudiant', 'Étudiant', 'Je découvre la RSE ou je suis une formation.'], ['alternant', 'Alternant ou contrat pro', 'Je suis en formation et en entreprise.'], ['salarie', 'Salarié ou en recherche d\'emploi', 'Je travaille ou je cherche un poste dans la RSE.'], ['dirigeant', 'Dirigeant d\'entreprise', 'TPE, PME ou ETI : je veux savoir ce que mon entreprise doit faire.'], ['grande', 'Équipe RSE d\'un grand groupe', 'CSRD, vigilance, audit : je pilote le reporting d\'une grande structure.'], ['public', 'Secteur public ou association', 'Collectivité, ministère, établissement, association.']];
const ICO = {
  bag: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
  book: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 21V5"/></svg>',
  doc: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 3h7l5 5v13H7z"/><path d="M14 3v5h5"/><path d="M10 13h6M10 17h6"/></svg>',
  chart: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 20h18"/><path d="M6 20V10"/><path d="M11 20V6"/><path d="M16 20v-7"/></svg>',
  flag: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4"/><path d="M5 4h11l-2 4 2 4H5"/></svg>',
  tool: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4l6 6-9 9H5v-6z"/><path d="M12 6l6 6"/></svg>',
  cal: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  radar: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 12l5-3"/><circle cx="12" cy="12" r="1.5"/></svg>'
};
function choisirPublic(){
  const cur = LS.get('public') || '';
  modal('Qui êtes-vous ?', '<p>L\'accueil, les parcours et les raccourcis s\'adaptent à votre situation. Vous pourrez changer à tout moment.</p><div class="pubs">' + PUBLICS.map(([id, t, d]) => '<label class="pub"><input type="radio" name="pub" value="' + id + '"' + (cur === id ? ' checked' : '') + '><span><strong>' + esc(t) + '</strong><span>' + esc(d) + '</span></span></label>').join('') + '</div>', 'C\'est parti', () => {
    const v = document.querySelector('input[name="pub"]:checked'); if (!v) { toast('Choisissez une situation'); return false; }
    LS.set('public', v.value); renderDash(); toast('Accueil personnalisé');
  });
}
function renderDash(){
  const el = document.getElementById('dash'); if (!el) return;
  const pr = P.profil, now = Date.now();
  const due = E.notions.filter(n => (n.next || 0) <= now).length;
  const nDone = P.cas.filter(c => done(c.id)).length;
  const bests = E.matieres.filter(m => m.best != null).map(m => m.best);
  const avgQuiz = bests.length ? Math.round(bests.reduce((a, b) => a + b, 0) / bests.length) : null;
  const evaluated = P.comp.filter(c => compLevel(c.id) > 0).length;
  const last = E.cours.slice().sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
  const obj = pr && metier(pr.objectif);
  let h = '';
  const jour = new Date().toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
  const pub = PUBLICS.find(x => x[0] === LS.get('public')) || null;
  const ini = pr && pr.prenom ? (pr.prenom[0] + ((pr.nom || '')[0] || '')).toUpperCase() : '';
  let nOff = 0, nAct = 0, evt = null;
  try { nOff = O.nouv.size; } catch(e) {}
  try { nAct = A.nouveaux.size; const t = ajd(); evt = A.agenda.find(x => (x.fin || x.debut) >= t) || null; } catch(e) {}
  const rel = arr(T.cands).filter(aRelancer);
  h += '<div class="dhead"><div><div class="eyebrow">' + esc(jour) + (pub ? ' · ' + esc(pub[1]) : '') + '</div><h2 class="hello">' + (pr && pr.prenom ? 'Bonjour, <em>' + esc(pr.prenom) + '.</em>' : 'Bienvenue <em>dans votre Bible RSE.</em>') + '</h2></div>'
    + '<button class="avatar" data-go="profil" aria-label="Mon profil">' + (ini ? esc(ini) : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>') + '</button></div>';
  h += storiesBar();
  h += '<button class="dsearch" data-act="dsearch"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg><span>Rechercher partout : CSRD, scope 3, vigilance, glossaire…</span></button>';
  const row = (n, txt, go) => '<button class="drow" data-go="' + go + '"><span class="dn">' + n + '</span><span class="dt">' + txt + '</span><span aria-hidden="true">→</span></button>';
  h += '<div class="dday"><div class="ddh"><strong>Votre journée RSE</strong><span>' + (pr && pr.prenom ? 'pour ' + esc(pr.prenom) : 'en un coup d\'œil') + '</span></div>'
    + row(nOff, nOff > 1 ? 'nouvelles offres pour vous' : nOff === 1 ? 'nouvelle offre pour vous' : 'nouvelle offre : ouvrez les plateformes', 'offres')
    + row(due, 'notion' + (due > 1 ? 's' : '') + ' à réviser aujourd\'hui', 'cours')
    + (rel.length ? row(rel.length, 'candidature' + (rel.length > 1 ? 's' : '') + ' à relancer', 'candidatures') : row(nAct, 'actualité' + (nAct > 1 ? 's' : '') + ' depuis votre dernière visite', 'actualites'))
    + (evt ? '<button class="drow" data-go="agenda"><span class="dn dcal">' + ICO.cal + '</span><span class="dt"><strong>' + esc(evt.titre) + '</strong><br><span class="dsub">' + esc(etatEvt(evt).txt) + ' · ' + esc(evt.lieu || '') + '</span></span><span aria-hidden="true">→</span></button>' : '')
    + '</div>';
  const PARC = {
    etudiant: [['Trouver une alternance', 'offres', 'bag', 'c'], ['Réviser mon examen', 'examen', 'book', 'g'], ['Comprendre les notions clés', 'comprendre', 'doc', 'b'], ['M\'engager dans une association', 'engager', 'flag', 'v']],
    alternant: [['Mes 30 premiers jours', 'terrain--premiers-jours', 'flag', 'v'], ['Structurer la RSE de mon entreprise', 'demarrer', 'chart', 'c'], ['Préparer la CSRD', 'csrd', 'doc', 'b'], ['Réviser mon examen', 'examen', 'book', 'g']],
    salarie: [['Piloter mes indicateurs RSE', 'pilotage--kpi', 'chart', 'v'], ['Suivre mon plan d\'action', 'pilotage--plan', 'flag', 'c'], ['Répondre à EcoVadis', 'terrain--ecovadis', 'doc', 'b'], ['Trouver un nouveau poste', 'offres', 'bag', 'g']],
    dirigeant: [['Faire mon autodiagnostic RSE', 'diagnostic', 'doc', 'b'], ['Mon tableau de bord RSE', 'pilotage--kpi', 'chart', 'v'], ['Financer ma transition', 'pilotage--aides', 'flag', 'c'], ['Démarrer la RSE de zéro', 'demarrer', 'bag', 'g']],
    grande: [['Ma double matérialité', 'atelier--dma', 'chart', 'v'], ['Suivre la collecte des données', 'atelier--collecte', 'doc', 'b'], ['Cartographier mes fournisseurs', 'atelier--vigilance', 'flag', 'c'], ['Préparer l\'audit', 'audit--prep', 'bag', 'g']],
    public: [['Mes obligations', 'public--oblig', 'flag', 'v'], ['Achats responsables', 'public--achats', 'bag', 'c'], ['Bilan carbone et plan climat', 'public--climat', 'chart', 'b'], ['Mesurer mon impact social', 'public--impact', 'doc', 'g']],
  };
  const parc = PARC[pub ? pub[0] : 'etudiant'];
  h += '<div class="dsec"><h3>Je veux…</h3>' + '<button class="linkbtn" data-act="public">' + (pub ? 'Changer de profil' : 'Personnaliser') + '</button>' + '</div><div class="dparc">' + parc.map(([l, go, ic, c]) => '<button class="dp dp-' + c + '" data-go="' + go + '">' + ICO[ic] + '<span>' + esc(l) + '</span></button>').join('') + '</div>';
  { const sp = LS.get('specialite'), D0 = (window.SERIKI_DOMS || []).find(x => x.id === sp); h += D0 ? '<a class="card specbar" href="#domaines--' + D0.id + '" style="--dc:' + D0.c + '"><span class="note">Ma spécialité</span><strong>' + esc(D0.n) + '</strong><span>Continuer mon parcours →</span></a>' : '<a class="card specbar" href="#domaines" style="--dc:#0F5B3E"><span class="note">Les 12 domaines de la RSE</span><strong>Choisir ma spécialité</strong><span>Découvrir →</span></a>'; }
  h += '<h3>Vos quatre espaces</h3><div class="desp">'
    + [['apprendre', 'Apprendre', 'La Bible, mes cours, fiches mémo', 'book'], ['pratiquer', 'Agir', 'Terrain, calculateurs, modèles', 'tool'], ['carriere', 'Carrière', 'Offres, entreprises, CV', 'bag'], ['veille', 'Veille', 'Actualités, agenda, COP', 'radar']].map(([id, t, d, ic]) => '<button class="de de-' + id + '" data-go="' + id + '"><span class="dei">' + ICO[ic] + '</span><strong>' + t + '</strong><span>' + d + '</span></button>').join('') + '</div>';
  const tot = P.comp.length + P.cas.length, pct = tot ? Math.round(100 * (evaluated + nDone) / tot) : 0, dash = Math.round(188.5 * pct / 100);
  h += '<button class="dprog" data-go="profil"><svg width="72" height="72" viewBox="0 0 72 72" role="img" aria-label="Progression : ' + pct + ' %"><circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent-soft)" stroke-width="8"/><circle cx="36" cy="36" r="30" fill="none" stroke="var(--accent)" stroke-width="8" stroke-linecap="round" stroke-dasharray="' + dash + ' 189" transform="rotate(-90 36 36)"/><text x="36" y="41" text-anchor="middle" font-weight="800" font-size="16" fill="currentColor">' + pct + ' %</text></svg><span><strong>Ma progression</strong><span>' + evaluated + ' compétence' + (evaluated > 1 ? 's' : '') + ' sur ' + P.comp.length + ' évaluée' + (evaluated > 1 ? 's' : '') + ' · ' + nDone + ' cas pratique' + (nDone > 1 ? 's' : '') + ' terminé' + (nDone > 1 ? 's' : '') + (avgQuiz != null ? ' · quiz : ' + avgQuiz + ' %' : '') + '</span>' + (obj ? '<span class="pill">Objectif : ' + esc(obj.titre) + '</span>' : (!pr || !pr.prenom ? '<span class="pill o">Créer mon profil (2 minutes)</span>' : '')) + '</span></button>';
  const recos = [];
  if (last) recos.push(['Reprendre', esc(last.titre || 'Cours sans titre'), esc((matOf(last.matiereId) || {}).nom || ''), 'resume', last.id]);
  if (due) recos.push(['Réviser', due + ' notion' + (due > 1 ? 's' : '') + ' en fiches mémo', 'Répétition espacée', 'cours', '']);
  const casReco = (obj ? arr(obj.cas) : ['bilan-carbone', 'double-materialite', 'reporting-esg']).filter(id => casById(id) && !done(id)).slice(0, 2);
  casReco.forEach(id => { const c = casById(id); recos.push(['Pratiquer', esc(c.titre), esc(c.niveau + ' · ' + c.duree), 'cas', id]); });
  if (obj) arr(obj.competences).filter(id => compLevel(id) < 2).slice(0, 2).forEach(id => recos.push(['Progresser', esc(compName(id)), 'Compétence clé pour ' + esc(obj.titre), 'profil', '']));
  if (rel.length) recos.unshift(['Relancer', rel.length + ' candidature' + (rel.length > 1 ? 's' : '') + ' à relancer', esc(rel.map(c => c.entreprise).join(', ')), 'candidatures', '']);
  if (recos.length) h += '<h3>Mes prochaines étapes</h3><div class="grid">' + recos.map(r => '<button class="card reco" data-reco="' + r[3] + '" data-id="' + esc(r[4]) + '"><span class="pill ' + ({Reprendre: 'b', 'Réviser': 'o', Pratiquer: '', Progresser: 'g', Relancer: 'r'})[r[0]] + '">' + r[0] + '</span><h4>' + r[1] + '</h4><span class="sub">' + r[2] + '</span></button>').join('') + '</div>';
  el.innerHTML = h;
}
document.getElementById('dash').addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a && a.dataset.act === 'dsearch') { const q = document.getElementById('q'); window.scrollTo(0, 0); q.focus(); return; }
  if (a && a.dataset.act === 'public') return choisirPublic();
  const g = e.target.closest('[data-go]'); if (g) return goTo(g.dataset.go);
  const r = e.target.closest('[data-reco]'); if (!r) return;
  const k = r.dataset.reco;
  if (k === 'resume') { const c = E.cours.find(x => x.id === r.dataset.id); if (c) { E.nextTab = 'cours'; E.nextCours = c.id; if (E.cur === c.matiereId) E.cur = null; goTo('cours--' + c.matiereId); } else goTo('cours'); }
  else if (k === 'cas') { goTo('labo--' + r.dataset.id); }
  else goTo(k);
});

/* ---------- Profil, compétences et portfolio ---------- */
function renderProfil(){
  const el = document.getElementById('profilRoot'); if (!el) return;
  const pr = P.profil || {};
  const field = (id, label, val, ph) => '<div class="row"><label for="' + id + '">' + label + '</label><input class="inp" id="' + id + '" value="' + esc(val || '') + '" placeholder="' + esc(ph || '') + '"></div>';
  let h = '<div class="eyebrow">MON PROFIL · PRIVÉ</div><h2>Profil, compétences et portfolio</h2><p class="lead">Ces informations restent sur cet appareil. Elles servent à personnaliser votre tableau de bord et vos recommandations.</p>';
  h += '<div class="grid two"><div class="card"><h4>Qui suis-je</h4><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px">' + field('pPrenom', 'Prénom', pr.prenom) + field('pNom', 'Nom', pr.nom) + '</div>'
    + '<div class="row"><label for="pSit">Situation</label><select class="inp" id="pSit"><option value="">Choisir</option>' + SITUATIONS.map(s => '<option' + (pr.situation === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></div>'
    + field('pForm', 'Formation actuelle', pr.formation, 'Ex. Master Manager de la Stratégie Durable et RSE') + field('pEtab', 'Établissement', pr.etablissement) + field('pAnnee', 'Année universitaire', pr.annee, 'Ex. 2026-2027')
    + '<div class="row"><label for="pExp">Expérience et compétences déjà acquises</label><textarea class="ta" id="pExp" style="min-height:80px">' + esc(pr.experience || '') + '</textarea></div></div>'
    + '<div class="card"><h4>Mon objectif professionnel</h4><div class="row"><label for="pObj">Métier visé</label><select class="inp" id="pObj"><option value="">Choisir un métier</option>' + P.metiers.map(m => '<option value="' + m.id + '"' + (pr.objectif === m.id ? ' selected' : '') + '>' + esc(m.titre) + '</option>').join('') + '</select></div><div id="pObjInfo"></div><div class="ctool"><button class="btn" data-pact="saveProfil">Enregistrer mon profil</button></div></div></div>';
  h += '<h3>Ma carte des compétences</h3><p class="prose">Distinguez ce que vous déclarez savoir faire et ce que vous avez réellement travaillé dans le laboratoire de cas pratiques. Une compétence travaillée ici n\'est pas une certification officielle.</p>';
  h += '<div class="tablewrap"><table><thead><tr><th>Compétence</th><th>Mon niveau déclaré</th><th>Travaillée</th><th>Prochain palier</th></tr></thead><tbody>' + P.comp.map(c => {
    const lv = compLevel(c.id), w = compWorked(c.id), key = obj => obj && arr(obj.competences).includes(c.id);
    return '<tr><td><strong>' + esc(c.nom) + '</strong>' + (key(metier(pr.objectif)) ? ' <span class="pill o">clé pour mon objectif</span>' : '') + '<div class="bar"><span style="width:' + (lv / 3 * 100) + '%"></span></div></td><td><select class="inp" data-comp="' + c.id + '" aria-label="Niveau pour ' + esc(c.nom) + '">' + NIV.map((n, i) => '<option value="' + i + '"' + (i === lv ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></td><td>' + (w ? '<span class="pill">' + w + ' cas terminé' + (w > 1 ? 's' : '') + '</span>' : '<span class="pill g">Pas encore</span>') + '</td><td style="font-size:13.5px">' + esc(lv >= 3 ? 'Niveau avancé atteint : visez la transmission et la preuve (portfolio).' : c.niveaux[lv]) + '</td></tr>';
  }).join('') + '</tbody></table></div>';
  const fin = P.cas.filter(c => done(c.id));
  h += '<h3>Mon portfolio</h3>' + (fin.length ? '<p class="prose">Vos cas pratiques terminés. Ce sont des simulations : présentez-les comme des exercices de méthode, pas comme des missions réalisées en entreprise.</p>' + fin.map(c => '<div class="frow"><div><div class="fn">' + esc(c.titre) + '</div><div class="meta" style="margin:6px 0 0"><span class="pill">Auto-évaluation : ' + (P.travaux[c.id].score || 0) + ' %</span>' + arr(c.competences).map(x => '<span class="pill g">' + esc(compName(x)) + '</span>').join('') + '</div></div><div class="acts"><button class="btn ghost sm" data-pact="openCas" data-id="' + c.id + '">Ouvrir</button><button class="btn ghost sm" data-pact="printCas" data-id="' + c.id + '">Imprimer</button></div></div>').join('') : '<div class="callout b"><strong>Votre portfolio est vide</strong>Terminez un cas pratique du laboratoire : il apparaîtra ici, prêt à imprimer pour un entretien.</div>');
  h += '<h3>Mes données</h3><p class="prose">Le profil, les compétences, les cas pratiques et votre espace cours sont inclus dans la sauvegarde de « Mon espace cours ».</p><div class="ctool"><button class="btn ghost" data-pact="backup">Sauvegarder toutes mes données</button></div>';
  el.innerHTML = h;
  const sel = document.getElementById('pObj'), info = document.getElementById('pObjInfo');
  const drawObj = () => { const m = metier(sel.value); info.innerHTML = m ? '<p>' + esc(m.mission) + '</p><p class="progress">Compétences clés : ' + arr(m.competences).map(compName).map(esc).join(', ') + '</p><button class="linkbtn" data-pact="voirMetier" data-id="' + m.id + '">Voir la fiche métier →</button>' : '<p class="progress">Choisissez un métier pour recevoir des recommandations adaptées.</p>'; };
  sel.addEventListener('change', drawObj); drawObj();
}
document.getElementById('profilRoot').addEventListener('change', async e => {
  const s = e.target.closest('[data-comp]'); if (!s) return;
  P.profil = P.profil || {}; P.profil.competences = P.profil.competences || {}; P.profil.competences[s.dataset.comp] = +s.value;
  await saveProfil(); toast('Niveau enregistré'); renderProfil();
});
document.getElementById('profilRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-pact]'); if (!b) return;
  const a = b.dataset.pact;
  if (a === 'saveProfil') {
    const v = id => document.getElementById(id).value.trim();
    if (!v('pPrenom')) { toast('Indiquez au moins votre prénom'); document.getElementById('pPrenom').focus(); return; }
    P.profil = Object.assign(P.profil || {}, {prenom: v('pPrenom'), nom: v('pNom'), situation: v('pSit'), formation: v('pForm'), etablissement: v('pEtab'), annee: v('pAnnee'), experience: v('pExp'), objectif: v('pObj')});
    await saveProfil(); toast('Profil enregistré'); renderProfil();
  }
  else if (a === 'voirMetier') { P.openMetier = b.dataset.id; goTo('metiers'); }
  else if (a === 'openCas') { goTo('labo--' + b.dataset.id); }
  else if (a === 'printCas') printCas(b.dataset.id);
  else if (a === 'backup') backup();
});

/* ---------- Fiches métiers ---------- */
function renderMetiers(){
  const el = document.getElementById('metiersRoot'); if (!el) return;
  const fams = ['Toutes'].concat([...new Set(P.metiers.map(m => m.famille))]);
  const obj = P.profil && P.profil.objectif;
  const list = P.metiers.filter(m => P.famille === 'Toutes' || m.famille === P.famille);
  el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Les fiches métiers de la RSE</h2><p class="lead">' + P.metiers.length + ' métiers de la transition : missions, compétences, livrables, outils, évolutions, et les cas pratiques pour vous y préparer.</p>'
    + '<div class="filters">' + fams.map(f => '<button class="chip' + (f === P.famille ? ' on' : '') + '" data-fam="' + esc(f) + '">' + esc(f) + '</button>').join('') + '</div>'
    + list.map(m => '<details data-s="1" id="m-' + m.id + '"' + (P.openMetier === m.id ? ' open' : '') + '><summary><span>' + esc(m.titre) + (obj === m.id ? ' <span class="pill o">Mon objectif</span>' : '') + ' <span class="pill g">' + esc(m.famille) + '</span></span></summary><div class="inner"><p style="font-size:16px">' + esc(m.mission) + '</p><div class="grid two"><div><h4>Missions habituelles</h4><ul>' + arr(m.missions).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h4>Livrables</h4><ul>' + arr(m.livrables).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div><h4>Compétences techniques</h4><ul>' + arr(m.competences).map(id => '<li>' + esc(compName(id)) + ' <span class="pill ' + (compLevel(id) >= 2 ? '' : 'g') + '">' + NIV[compLevel(id)] + '</span></li>').join('') + '</ul><h4>Compétences comportementales</h4><p>' + arr(m.soft).map(esc).join(' · ') + '</p><h4>Outils</h4><p>' + arr(m.outils).map(esc).join(' · ') + '</p><h4>Évolution</h4><p>' + esc(m.evolution) + '</p></div></div><h4>Se préparer avec le laboratoire</h4><div class="filters">' + arr(m.cas).filter(casById).map(id => '<button class="chip" data-cas="' + id + '">' + (done(id) ? '✓ ' : '') + esc(casById(id).titre) + '</button>').join('') + '</div><div class="ctool">' + ((typeof PCOURS !== 'undefined' && Object.values(PCOURS).find(x => x.metier === m.id)) ? '<a class="btn sm" href="#pcours--' + Object.values(PCOURS).find(x => x.metier === m.id).id + '">Suivre le parcours complet du métier</a>' : '') + (obj === m.id ? '<span class="pill o">C\'est votre objectif actuel</span>' : '<button class="btn sm" data-objectif="' + m.id + '">Choisir comme objectif</button>') + '</div></div></details>').join('');
  P.openMetier = null;
}
document.getElementById('metiersRoot').addEventListener('click', async e => {
  const f = e.target.closest('[data-fam]'); if (f) { P.famille = f.dataset.fam; renderMetiers(); return; }
  const c = e.target.closest('[data-cas]'); if (c) { goTo('labo--' + c.dataset.cas); return; }
  const o = e.target.closest('[data-objectif]'); if (o) { P.profil = P.profil || {}; P.profil.objectif = o.dataset.objectif; await saveProfil(); toast('Objectif enregistré'); P.openMetier = o.dataset.objectif; renderMetiers(); }
});

/* ---------- Laboratoire de cas pratiques ---------- */
function renderLabo(){
  const el = document.getElementById('laboRoot'); if (!el) return;
  if (P.curCas && casById(P.curCas)) return renderCas(el, casById(P.curCas));
  const st = c => done(c.id) ? '<span class="pill">Terminé · ' + (P.travaux[c.id].score || 0) + ' %</span>' : P.travaux[c.id] ? '<span class="pill o">En cours</span>' : '<span class="pill g">À faire</span>';
  el.innerHTML = '<div class="eyebrow">PRATIQUER</div><h2>Le laboratoire de cas pratiques</h2><p class="lead">Mettez-vous dans la peau d\'un chargé de projet RSE : une entreprise, des données, une demande de la direction. Vous rédigez vos réponses, vous vous auto-évaluez avec une grille, puis vous comparez avec les éléments de corrigé.</p>'
    + '<div class="grid">' + P.cas.map(c => '<button class="card mat" data-ouvrir="' + c.id + '" style="--mc:' + ({'Débutant': '#1d6a50', 'Intermédiaire': '#a2701c', 'Avancé': '#a33a2c'})[c.niveau] + '"><h4>' + esc(c.titre) + '</h4><span class="sub">' + esc(c.entreprise) + '</span><span class="stats"><span class="pill b">' + esc(c.niveau) + '</span><span class="pill g">' + esc(c.duree) + '</span>' + st(c) + '</span></button>').join('') + '</div>';
}
function renderCas(el, c){
  const t = P.travaux[c.id] || {id: c.id, reponses: {}, grille: {}, statut: 'en_cours'};
  const nOk = arr(c.grille).filter((_, i) => t.grille[i]).length;
  let h = '<div class="chead" style="--mc:' + ({'Débutant': '#1d6a50', 'Intermédiaire': '#a2701c', 'Avancé': '#a33a2c'})[c.niveau] + '"><div><button class="linkbtn" data-lab="back">← Tous les cas pratiques</button><h2>' + esc(c.titre) + '</h2><div class="meta"><span class="pill b">' + esc(c.niveau) + '</span><span class="pill g">' + esc(c.duree) + '</span>' + arr(c.competences).map(x => '<span class="pill">' + esc(compName(x)) + '</span>').join('') + '</div></div><div class="ctool" style="margin:0"><button class="btn ghost sm" data-lab="print">Imprimer</button></div></div>';
  h += '<div class="callout"><strong>Simulation</strong>' + esc(P.avert) + '</div>';
  h += '<div class="card"><h4>L\'entreprise</h4><p>' + esc(c.entreprise) + '</p><h4>La demande</h4><p>' + esc(c.contexte) + '</p></div>';
  if (c.id === 'bilan-carbone') h += '<div class="callout g"><strong>Besoin de la méthode détaillée ?</strong>Le guide « Calculer un bilan carbone, pas à pas » (rubrique Sur le terrain) explique chaque étape et contient une calculatrice. <a href="#terrain--bilan-carbone">Ouvrir le guide</a></div>';
  if (c.donnees) h += '<h3>' + esc(c.donnees.titre) + '</h3><div class="tablewrap"><table><thead><tr>' + c.donnees.entetes.map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + c.donnees.lignes.map(r => '<tr>' + r.map((x, i) => '<td' + (i ? ' class="num"' : '') + '>' + esc(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  h += '<h3>Votre travail</h3>' + arr(c.etapes).map((s, i) => '<div class="card step"><div class="meta"><span class="pill">Étape ' + (i + 1) + '</span></div><h4>' + esc(s.titre) + '</h4><p>' + esc(s.consigne) + '</p><textarea class="ta" data-rep="' + i + '" aria-label="Réponse à l\'étape ' + (i + 1) + '" placeholder="Votre réponse…">' + esc(t.reponses[i] || '') + '</textarea></div>').join('');
  h += '<p class="progress" id="casSave">Vos réponses sont enregistrées automatiquement sur cet appareil.</p>';
  h += '<h3>Auto-évaluation</h3><div class="card"><p>Livrable attendu : <strong>' + esc(c.livrable) + '</strong>. Cochez honnêtement ce que votre travail contient.</p><div class="checklist">' + arr(c.grille).map((g, i) => '<label><input type="checkbox" data-gr="' + i + '"' + (t.grille[i] ? ' checked' : '') + '> <span>' + esc(g) + '</span></label>').join('') + '</div><p class="progress" id="casScore" style="margin-top:10px">' + nOk + ' critère' + (nOk > 1 ? 's' : '') + ' sur ' + arr(c.grille).length + ' · ' + Math.round(nOk / Math.max(1, arr(c.grille).length) * 100) + ' %</p></div>';
  h += '<details><summary>Voir les éléments de corrigé</summary><div class="inner"><p class="progress">Consultez-les après avoir rédigé votre réponse : ce sont des éléments attendus, pas la seule bonne réponse.</p><ul>' + arr(c.elements).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></details>';
  h += '<div class="ctool">' + (done(c.id) ? '<span class="pill">Terminé et ajouté au portfolio</span><button class="btn ghost" data-lab="reopen">Reprendre l\'exercice</button>' : '<button class="btn" data-lab="finish">Terminer et ajouter à mon portfolio</button>') + '</div>';
  el.innerHTML = h;
}
let casTimer = null;
document.getElementById('laboRoot').addEventListener('input', e => {
  const r = e.target.closest('[data-rep]'); if (!r) return;
  const c = casById(P.curCas); const t = P.travaux[c.id] || {id: c.id, reponses: {}, grille: {}, statut: 'en_cours'}; P.travaux[c.id] = t;
  t.reponses[r.dataset.rep] = r.value; document.getElementById('casSave').textContent = 'Modifications en cours…';
  clearTimeout(casTimer); casTimer = setTimeout(async () => { await saveTravail(t); const s = document.getElementById('casSave'); if (s) s.textContent = 'Enregistré à ' + new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'}); }, 700);
});
document.getElementById('laboRoot').addEventListener('change', async e => {
  const g = e.target.closest('[data-gr]'); if (!g) return;
  const c = casById(P.curCas); const t = P.travaux[c.id] || {id: c.id, reponses: {}, grille: {}, statut: 'en_cours'};
  t.grille[g.dataset.gr] = g.checked; const n = arr(c.grille).filter((_, i) => t.grille[i]).length; t.score = Math.round(n / arr(c.grille).length * 100);
  await saveTravail(t); document.getElementById('casScore').textContent = n + ' critère' + (n > 1 ? 's' : '') + ' sur ' + arr(c.grille).length + ' · ' + t.score + ' %';
});
document.getElementById('laboRoot').addEventListener('click', async e => {
  const o = e.target.closest('[data-ouvrir]'); if (o) { location.hash = 'labo--' + o.dataset.ouvrir; return; }
  const b = e.target.closest('[data-lab]'); if (!b) return;
  const a = b.dataset.lab, c = casById(P.curCas);
  if (a === 'back') { location.hash = 'labo'; }
  else if (a === 'print') printCas(c.id);
  else if (a === 'finish' || a === 'reopen') {
    const t = P.travaux[c.id] || {id: c.id, reponses: {}, grille: {}};
    if (a === 'finish' && !Object.values(t.reponses || {}).some(v => String(v).trim())) { toast('Rédigez au moins une réponse avant de terminer'); return; }
    t.statut = a === 'finish' ? 'termine' : 'en_cours'; t.score = Math.round(arr(c.grille).filter((_, i) => (t.grille || {})[i]).length / arr(c.grille).length * 100);
    await saveTravail(t); toast(a === 'finish' ? 'Cas terminé : ajouté à votre portfolio' : 'Exercice rouvert'); renderLabo();
  }
});
function printCas(id){
  const c = casById(id), t = P.travaux[id] || {reponses: {}};
  const html = '<h1>' + esc(c.titre) + '</h1><p><em>Cas pratique de simulation réalisé dans SERIKI BIBLE RSE' + (P.profil && P.profil.prenom ? ' par ' + esc([P.profil.prenom, P.profil.nom].filter(Boolean).join(' ')) : '') + '. Entreprise et données fictives.</em></p><p><strong>Entreprise :</strong> ' + esc(c.entreprise) + '</p><p><strong>Demande :</strong> ' + esc(c.contexte) + '</p>' + arr(c.etapes).map((s, i) => '<h2>' + (i + 1) + '. ' + esc(s.titre) + '</h2><p><em>' + esc(s.consigne) + '</em></p><p style="white-space:pre-wrap">' + esc(t.reponses[i] || '') + '</p>').join('');
  printHtml(html);
}

/* ---------- Pages rubriques (mobile) ---------- */
function renderHubs(){
  const card = ([id, label, desc]) => '<a class="card hubcard" href="#' + id + '"><h4>' + esc(label) + ' →</h4><p>' + esc(desc) + '</p></a>';
  const H = {
    apprendre: ['Apprendre', 'Vos cours personnels et toute la Bible de la RSE.', [['domaines', 'Les 12 domaines de la RSE', 'Environnement, climat, social, éthique, reporting, économie circulaire, achats, territoires, droits humains, finance, communication, numérique : sujets, indicateurs, référentiels, outils, cas et métiers, avec un parcours de spécialisation.'], ['pcours', 'Parcours métiers et formations', 'Gestion de projet, gestion budgétaire, chargé de mission décarbonation, chargé d\'économie circulaire : leçons pas à pas avec exemples chiffrés, outils, modèles de livrables, cas et autoévaluation.'], ['quiz', 'Quiz et révisions', '96 questions sur les 12 domaines, corrigées et expliquées, séries de révision des erreurs, suivi des progrès et fiches de révision à télécharger.'], ['comprendre', 'Comprendre en profondeur', 'Les 8 notions clés développées : définition, enjeux, fonctionnement, exemple concret, erreurs à éviter.'], ['cours', 'Mon espace cours', 'Vos matières, cours, fichiers, notions, fiches mémo et quiz.'], ['fondamentaux', 'Fondamentaux', 'RSE, ESG, ISO 26000, ODD, double matérialité.'], ['histoire', 'Histoire', 'De Stockholm à l\'Omnibus.'], ['europe', 'Réglementation UE', 'CSRD, CSDDD, taxonomie, SFDR, ECGT…'], ['france', 'Réglementation France', 'Vigilance, BEGES, AGEC, Climat et Résilience…'], ['csrd', 'CSRD et ESRS', 'Calendrier, normes, double matérialité.'], ['taxonomie', 'Taxonomie verte', 'Éligibilité, alignement, calculateur.'], ['reporting', 'Reporting et carbone', 'Scopes, indicateurs, cycle de reporting.'], ['normes', 'Normes et labels', 'ISO, GHG Protocol, SBTi, EcoVadis, B Corp…'], ['secteurs', 'Secteur par secteur', 'Enjeux, besoins et missions de 20 secteurs.'], ['glossaire', 'Glossaire', 'Les sigles et termes du métier.'], ['sources', 'Sources officielles', 'Où trouver les textes.']]],
    pratiquer: ['Agir', 'Les guides de terrain, les calculateurs et les modèles pour passer de la connaissance à l\'action.', [['demarrer', 'Démarrer la RSE de zéro', 'Pour une entreprise de toute taille qui n\'a encore rien mis en place : 12 étapes guidées, des modèles Word prêts à remplir et le dossier complet de structuration RSE.'], ['outilsm', 'Outils métiers', 'Chiffrer une mission de conseil, noter une entreprise (ESG), évaluer un fournisseur, calculer les ratios de la taxonomie, diagnostiquer la biodiversité d\'un site, calculer les indicateurs sociaux et analyser une enquête QVCT, tenir un registre réglementaire et coter les aspects environnementaux.'], ['ateliers', 'Ateliers climat et ressources', 'Trajectoire de réduction, engagement des fournisseurs sur le scope 3, rentabilité et coût par tonne évitée, diagnostic des flux, fiche d\'écoconception, obligations AGEC et emballages.'], ['boite', 'Boîte à outils projet', 'Projets avec diagramme de Gantt, matrice RACI et budget ; registre des risques ESG avec carte de chaleur ; analyse SWOT ; incidents et actions correctives ; comparaison de scénarios.'], ['pilotage', 'Espace entreprise : piloter la RSE', 'Tableau de bord d\'indicateurs avec graphiques, import et export Excel et Power BI, plan d\'action, feuille de route en 10 étapes, aides et financements.'], ['diagnostic', 'Autodiagnostic RSE', 'Pour toute entreprise, de la TPE au grand groupe : maturité sur 6 piliers, obligations selon la taille, plan d\'action priorisé.'], ['atelier', 'Atelier CSRD et vigilance', 'Grandes entreprises et ETI : double matérialité et sa matrice, collecte des données entre sites, cartographie des risques fournisseurs, préparation de l\'audit, CSDDD.'], ['public', 'Espace public et associatif', 'Collectivités, établissements publics et associations : obligations selon la structure, achats responsables, BEGES et PCAET, mesure de l\'impact social.'], ['audit', 'Audit et vérification', 'Se préparer à l\'audit en six étapes avec exemples et modèles, et pour les auditeurs : programme de travail, feuilles de test, échantillonnage, constats et papiers de travail.'], ['prestataires', 'Cabinets et prestataires RSE', 'Trouver un cabinet par ville et spécialité, comprendre chaque mission de conseil, et pour les cabinets : présenter ses services.'], ['terrain', 'Sur le terrain', '11 guides opérationnels : premiers jours, bilan carbone, sensibilisation, EcoVadis, vigilance, ISO 14001, achats responsables, index de l\'égalité…'], ['examen', 'Examen blanc', 'Questions chronométrées, note sur 20 et notions à revoir.'], ['labo', 'Laboratoire de cas pratiques', P.cas.length + ' simulations guidées avec auto-évaluation.'], ['methodes', 'Méthodes', '10 démarches pas à pas.'], ['modeles', 'Modèles de rédaction', 'Politique RSE, note au CODIR, questionnaire fournisseur…'], ['outils', 'Suis-je concerné ?', 'Les obligations d\'une entreprise en un instant.']]],
    veille: ['Veille', 'L\'actualité de la RSE, les COP, les salons et la réglementation à suivre.', [['actualites', 'Actualités', 'France, Union européenne et monde, avec ce que chaque information change pour votre métier.'], ['agenda', 'Mon agenda', 'COP, échéances réglementaires, relances et révisions dans un seul calendrier exportable.'], ['actualites--agenda', 'Événements RSE', 'COP, salons, colloques et conférences à venir.'], ['europe', 'Réglementation européenne', 'CSRD, CSDDD, taxonomie, SFDR, ECGT…'], ['france', 'Réglementation française', 'Vigilance, BEGES, AGEC, Climat et Résilience…'], ['sources', 'Sources officielles', 'Où trouver et vérifier les textes.']]],
    carriere: ['Carrière', 'Les métiers de la transition et la préparation à l\'emploi.', [['offres', 'Offres et alertes', 'Emploi, alternance, stage, intérim : toutes les plateformes en un clic, alertes et offres du jour.'], ['engager', 'S\'engager : associations et bénévolat', 'Les associations de l\'environnement, du climat et de la RSE près de chez vous, partout en France, les grands réseaux et les plateformes de bénévolat.'], ['entreprises', 'Annuaire RSE des entreprises', 'Toutes les entreprises françaises : signaux RSE, obligations, besoins, et un message de candidature adapté.'], ['metiers', 'Fiches métiers', P.metiers.length + ' métiers détaillés.'], ['cv', 'Mon CV et score ATS', 'CV standard, score face aux logiciels de tri, CV adapté à chaque offre.'], ['candidatures', 'Mes candidatures', 'Suivi, relances et modèles de messages.'], ['offre', 'Analyser une offre', 'Compétences demandées, écarts et plan de préparation.'], ['simulateur', 'Simulateur d\'entretien', 'Questions chronométrées et réponses modèles.'], ['metier', 'Entretien et premiers pas', 'Attentes des recruteurs, 90 premiers jours, questions d\'entretien.'], ['profil', 'Compétences et portfolio', 'Votre carte des compétences et vos réalisations.']]]
  };
  Object.entries(H).forEach(([id, [t, d, items]]) => { const el = document.getElementById(id + 'Root'); if (el) el.innerHTML = '<div class="eyebrow">' + t.toUpperCase() + '</div><h2>' + t + '</h2><p class="lead">' + d + '</p><div class="grid hubgrid esp-' + id + '">' + items.map(card).join('') + '</div>'; });
}

/* ---------- Barre de navigation mobile ---------- */
const GROUPE = {accueil: 'accueil', comprendre: 'apprendre', domaines: 'apprendre', quiz: 'apprendre', pcours: 'apprendre', ateliers: 'pratiquer', outilsm: 'pratiquer', pilotage: 'pratiquer', diagnostic: 'pratiquer', atelier: 'pratiquer', public: 'pratiquer', demarrer: 'pratiquer', boite: 'pratiquer', audit: 'pratiquer', prestataires: 'pratiquer', engager: 'carriere', offres: 'carriere', entreprises: 'carriere', actualites: 'veille', veille: 'veille', agenda: 'veille', infos: 'accueil', donnees: 'accueil', apprendre: 'apprendre', cours: 'apprendre', fondamentaux: 'apprendre', histoire: 'apprendre', europe: 'apprendre', france: 'apprendre', csrd: 'apprendre', taxonomie: 'apprendre', reporting: 'apprendre', normes: 'apprendre', secteurs: 'apprendre', glossaire: 'apprendre', sources: 'apprendre', pratiquer: 'pratiquer', labo: 'pratiquer', terrain: 'pratiquer', examen: 'pratiquer', candidatures: 'carriere', offre: 'carriere', cv: 'carriere', simulateur: 'carriere', methodes: 'pratiquer', modeles: 'pratiquer', outils: 'pratiquer', carriere: 'carriere', metiers: 'carriere', metier: 'carriere', profil: 'accueil'};
function markBottom(){ const g = GROUPE[route().base] || 'accueil'; document.querySelectorAll('#bottomnav a').forEach(a => a.classList.toggle('on', a.dataset.g === g)); }
window.addEventListener('hashchange', markBottom); markBottom();
const pReady = pInit();
/* =====================================================================
   SUR LE TERRAIN (guides opérationnels + calculatrice carbone)
   et OUTILS CARRIÈRE (candidatures, analyse d'offre, simulateur
   d'entretien, examen blanc). Aucune IA : tout fonctionne sur l'appareil.
   ===================================================================== */
const T = {guides: [], cur: null, calc: null, cands: [], sim: null, exam: null};

/* ---------- Guides opérationnels ---------- */
function renderBloc(b, gi){
  const list = (tag, x) => '<' + tag + '>' + arr(x).map(i => '<li>' + esc(i) + '</li>').join('') + '</' + tag + '>';
  switch (b.t) {
    case 'h': return '<h3>' + esc(b.x) + '</h3>';
    case 'p': return '<p class="prose">' + esc(b.x) + '</p>';
    case 'ul': return '<div class="prose">' + list('ul', b.x) + '</div>';
    case 'ol': return '<div class="prose">' + list('ol', b.x) + '</div>';
    case 'steps': return '<ol class="steps">' + arr(b.x).map(i => '<li>' + esc(i) + '</li>').join('') + '</ol>';
    case 'table': return '<div class="tablewrap"><table><thead><tr>' + arr(b.h).map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + arr(b.r).map(r => '<tr>' + r.map((x, i) => '<td>' + (i ? '' : '<strong>') + esc(x) + (i ? '' : '</strong>') + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
    case 'callout': return '<div class="callout ' + (b.k === 'o' ? '' : b.k) + '"><strong>' + esc(b.titre || '') + '</strong>' + esc(b.x) + '</div>';
    case 'script': return '<div class="card scriptcard"><div class="sc-head"><span class="pill o">À utiliser tel quel</span><h4>' + esc(b.titre || '') + '</h4><button class="btn ghost sm" data-copytxt="' + gi + '">Copier</button></div><div class="tpl">' + esc(b.x) + '</div></div>';
    case 'qa': return arr(b.x).map(q => '<details><summary>' + esc(q.q) + '</summary><div class="inner"><p>' + esc(q.r) + '</p></div></details>').join('');
    case 'calc': return '<div id="calcBox"></div>';
    case 'calcIndex': return '<div id="idxBox"></div>';
  }
  return '';
}
function renderTerrain(){
  const el = document.getElementById('terrainRoot'); if (!el) return;
  const g = T.guides.find(x => x.id === T.cur);
  if (!g) {
    el.innerHTML = '<div class="eyebrow">PRATIQUER · OPÉRATIONNEL</div><h2>Sur le terrain</h2><p class="lead">Des guides pour agir dès votre arrivée en entreprise : quoi faire, comment le faire, avec quels mots, et quel résultat obtenir. Chaque guide contient des exemples chiffrés complets et des textes prêts à l\'emploi.</p><div class="grid">'
      + T.guides.map(x => '<button class="card mat" data-guide="' + x.id + '"><h4>' + esc(x.titre) + '</h4><span class="sub">' + esc(x.resume) + '</span><span class="stats"><span class="pill b">' + esc(x.pour) + '</span><span class="pill g">' + esc(x.duree) + '</span>' + (arr(x.blocs).some(b => b.t === 'calc' || b.t === 'calcIndex') ? '<span class="pill o">Calculatrice</span>' : '') + '</span></button>').join('') + '</div>';
    return;
  }
  T.scripts = [];
  el.innerHTML = '<div class="chead"><div><button class="linkbtn" data-guide="">← Tous les guides</button><h2>' + esc(g.titre) + '</h2><div class="meta"><span class="pill b">' + esc(g.pour) + '</span><span class="pill g">' + esc(g.duree) + '</span></div></div><div class="ctool" style="margin:0"><button class="btn sm diabtn" data-diadom="terrainRoot" data-t="' + esc(g.titre) + '">' + '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>' + ' Diaporama</button><button class="btn ghost sm" data-printguide="1">Imprimer</button></div></div><p class="lead">' + esc(g.resume) + '</p>'
    + arr(g.blocs).map(b => { if (b.t === 'script') { T.scripts.push(b.x); return renderBloc(b, T.scripts.length - 1); } return renderBloc(b); }).join('');
  if (document.getElementById('calcBox')) renderCalc();
  if (document.getElementById('idxBox')) renderCalcIndex();
}
/* ---------- Calculatrice de l'index de l'égalité ---------- */
const BAREME1 = [[0, 40], [1, 39], [2, 38], [3, 37], [4, 36], [5, 35], [6, 34], [7, 33], [8, 31], [9, 29], [10, 27], [11, 25], [12, 23], [13, 21], [14, 19], [15, 17], [16, 14], [17, 11], [18, 8], [19, 5], [20, 2]];
function ptsEcart(e){ e = Math.abs(Math.round(Number(e) * 10) / 10); if (e === 0) return 40; for (const [max, pts] of BAREME1) if (e <= max && max > 0) return pts; return 0; }
function ptsPalier(e, p){ e = Math.abs(Number(e)); return e <= 2 ? p[0] : e <= 5 ? p[1] : e <= 10 ? p[2] : 0; }
function renderCalcIndex(){
  const box = document.getElementById('idxBox'); if (!box) return;
  box.innerHTML = '<div class="card calc"><form class="tool" id="idxForm" onsubmit="return false">'
    + '<label for="ixT">Effectif<select class="inp" id="ixT"><option value="petit">50 à 250 salariés</option><option value="grand">Plus de 250 salariés</option></select></label>'
    + '<label for="ix1">1. Écart de rémunération (%)<input class="inp" type="number" step="0.1" id="ix1" value="2.3"></label>'
    + '<label for="ix2">2. Écart d\'augmentations (points de %)<input class="inp" type="number" step="0.1" id="ix2" value="3"></label>'
    + '<label for="ix3" id="ix3l">3. Écart de promotions (points de %)<input class="inp" type="number" step="0.1" id="ix3" value="1"></label>'
    + '<label for="ix4">4. Retour de congé maternité<select class="inp" id="ix4"><option value="100">Toutes augmentées</option><option value="0">Pas toutes augmentées</option><option value="nc">Incalculable (aucun cas)</option></select></label>'
    + '<label for="ix5">5. Sexe sous-représenté parmi les 10 plus hautes rémunérations<input class="inp" type="number" min="0" max="5" id="ix5" value="3"></label>'
    + '</form><div id="idxRes"></div><p class="progress">Calcul indicatif selon le décret n° 2019-15. La déclaration officielle se fait sur Egapro, qui fait foi.</p></div>';
  const f = document.getElementById('idxForm'); f.addEventListener('input', drawIdx); f.addEventListener('change', drawIdx); drawIdx();
}
function drawIdx(){
  const g = document.getElementById('ixT').value === 'grand', v = id => document.getElementById(id).value;
  document.getElementById('ix3l').style.display = g ? '' : 'none';
  const rows = [['Écart de rémunération', ptsEcart(v('ix1')), 40]];
  if (g) { rows.push(['Écart d\'augmentations', ptsPalier(v('ix2'), [20, 10, 5]), 20]); rows.push(['Écart de promotions', ptsPalier(v('ix3'), [15, 10, 5]), 15]); }
  else rows.push(['Écart d\'augmentations (promotions incluses)', ptsPalier(v('ix2'), [35, 25, 15]), 35]);
  if (v('ix4') !== 'nc') rows.push(['Retour de congé maternité', v('ix4') === '100' ? 15 : 0, 15]);
  const n5 = Math.max(0, Math.min(5, +v('ix5') || 0)); rows.push(['Dix plus hautes rémunérations', n5 >= 4 ? 10 : n5 >= 2 ? 5 : 0, 10]);
  const pts = rows.reduce((a, r) => a + r[1], 0), max = rows.reduce((a, r) => a + r[2], 0);
  const note = max >= 75 ? Math.round(pts / max * 100) : null;
  const msg = note == null ? '<div class="callout"><strong>Index non calculable</strong>Moins de 75 points sont calculables : la note ne peut pas être déterminée pour cette année, mais les indicateurs calculables doivent être communiqués.</div>' : note >= 85 ? '<div class="callout g"><strong>' + note + ' / 100 : publication seulement</strong>Publiez la note et le détail des indicateurs avant le 1er mars.</div>' : note >= 75 ? '<div class="callout"><strong>' + note + ' / 100 : objectifs de progression obligatoires</strong>Fixez et publiez un objectif pour chaque indicateur où la note maximale n\'est pas atteinte.</div>' : '<div class="callout" style="border-color:var(--danger);background:var(--danger-soft)"><strong>' + note + ' / 100 : mesures de correction obligatoires</strong>Mesures de rattrapage salarial à négocier ou décider après consultation du CSE ; trois ans pour atteindre 75 points.</div>';
  document.getElementById('idxRes').innerHTML = '<div class="tablewrap"><table><thead><tr><th>Indicateur</th><th>Points</th><th>Maximum</th></tr></thead><tbody>' + rows.map(r => '<tr><td>' + r[0] + '</td><td class="num"><strong>' + r[1] + '</strong></td><td class="num">' + r[2] + '</td></tr>').join('') + '<tr><td><strong>Total</strong></td><td class="num"><strong>' + pts + '</strong></td><td class="num">' + max + (max < 100 ? ' (ramené sur 100)' : '') + '</td></tr></tbody></table></div>' + msg;
}

document.getElementById('terrainRoot').addEventListener('click', async e => {
  const g = e.target.closest('[data-guide]'); if (g) { location.hash = g.dataset.guide ? 'terrain--' + g.dataset.guide : 'terrain'; return; }
  const c = e.target.closest('[data-copytxt]'); if (c) { try { await navigator.clipboard.writeText(T.scripts[+c.dataset.copytxt]); toast('Texte copié'); } catch(err) { const t = c.closest('.scriptcard').querySelector('.tpl'); const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texte sélectionné : Ctrl+C pour copier'); } return; }
  if (e.target.closest('[data-printguide]')) { const z = document.getElementById('terrainRoot').cloneNode(true); z.querySelectorAll('button, .ctool, input, select, textarea').forEach(x => x.remove()); printHtml(z.innerHTML); }
});

/* ---------- Calculatrice de bilan carbone ---------- */
const FE_TYPES = [
  ['Électricité (réseau français)', 2, 'kWh', 0.052], ['Gaz naturel', 1, 'kWh PCS', 0.205], ['Fioul domestique', 1, 'litres', 3.2], ['Gazole des véhicules', 1, 'litres', 3.1], ['Essence des véhicules', 1, 'litres', 2.8], ['Fuite de fluide R410A', 1, 'kg', 2088], ['Véhicules de l\'entreprise', 1, 'km', 0.2],
  ['Voiture (déplacements, domicile-travail)', 3, 'km', 0.2], ['Train à grande vitesse', 3, 'passager.km', 0.003], ['Avion court-courrier', 3, 'passager.km', 0.25], ['Transport routier de marchandises', 3, 'tonne.km', 0.1], ['Ordinateurs portables achetés', 3, 'unités', 200], ['Achats (ratio monétaire, hypothèse)', 3, '€ HT', 0.1], ['Autre poste', 3, 'unité', 0]
];
const CALC_DEMO = [['Gaz naturel', 1, 180000, 'kWh PCS', 0.205], ['Fuite de climatisation (R410A)', 1, 3, 'kg', 2088], ['Véhicules de service', 1, 72000, 'km', 0.2], ['Électricité', 2, 210000, 'kWh', 0.052], ['Avion', 3, 120000, 'passager.km', 0.25], ['Train', 3, 80000, 'passager.km', 0.003], ['Domicile-travail en voiture', 3, 216000, 'km', 0.2], ['Ordinateurs achetés', 3, 25, 'unités', 200], ['Achats de services', 3, 900000, '€ HT', 0.1]].map(r => ({poste: r[0], scope: r[1], qte: r[2], unite: r[3], fe: r[4]}));
const fmtN = (x, d) => Number(x || 0).toLocaleString('fr-FR', {maximumFractionDigits: d == null ? 1 : d});
async function loadCalc(){ if (T.calc) return; let v = null; try { v = IDB.db ? await IDB.get('kv', 'calc') : null; } catch(e) {} T.calc = v && arr(v.lignes).length ? v : {id: 'calc', nom: 'Exemple : société de services, 60 salariés', effectif: 60, lignes: CALC_DEMO.map(x => Object.assign({}, x))}; }
let calcTimer = null;
function saveCalc(){ clearTimeout(calcTimer); calcTimer = setTimeout(() => { if (IDB.db) IDB.put('kv', T.calc).catch(() => {}); }, 600); }
function calcTotals(){ const s = {1: 0, 2: 0, 3: 0}; T.calc.lignes.forEach(l => { s[l.scope] = (s[l.scope] || 0) + (Number(l.qte) || 0) * (Number(l.fe) || 0) / 1000; }); return s; }
async function renderCalc(){
  await loadCalc();
  const box = document.getElementById('calcBox'); if (!box) return;
  box.innerHTML = '<div class="card calc"><div class="crow" style="align-items:flex-end"><div class="row" style="flex:1;min-width:220px;margin:0"><label for="calcNom">Organisation</label><input class="inp" id="calcNom" value="' + esc(T.calc.nom || '') + '"></div><div class="row" style="width:150px;margin:0"><label for="calcEff">Effectif</label><input class="inp" type="number" min="0" id="calcEff" value="' + esc(T.calc.effectif || '') + '"></div></div>'
    + '<div class="tablewrap"><table class="calct"><thead><tr><th>Poste</th><th>Scope</th><th>Quantité</th><th>Unité</th><th>Facteur (kgCO₂e/unité)</th><th>Résultat</th><th></th></tr></thead><tbody id="calcBody"></tbody></table></div>'
    + '<div class="ctool"><select class="inp" id="calcAdd" style="max-width:320px" aria-label="Ajouter un poste"><option value="">+ Ajouter un poste…</option>' + FE_TYPES.map((f, i) => '<option value="' + i + '">' + esc(f[0]) + '</option>').join('') + '</select><button class="btn ghost sm" data-calc="copy">Copier le tableau (Excel)</button><button class="btn ghost sm" data-calc="demo">Recharger l\'exemple</button><button class="btn danger sm" data-calc="clear">Tout effacer</button></div>'
    + '<div id="calcRes"></div><p class="progress">Facteurs pré-remplis : ordres de grandeur pour s\'entraîner. Pour un bilan officiel, remplacez-les par les valeurs à jour de la Base Empreinte de l\'ADEME. Vos saisies sont enregistrées sur cet appareil.</p></div>';
  drawCalcRows(); drawCalcRes();
}
function drawCalcRows(){
  document.getElementById('calcBody').innerHTML = T.calc.lignes.map((l, i) => '<tr><td><input class="inp" data-cl="' + i + '" data-f="poste" value="' + esc(l.poste) + '" aria-label="Poste"></td><td><select class="inp" data-cl="' + i + '" data-f="scope" aria-label="Scope">' + [1, 2, 3].map(s => '<option' + (s === Number(l.scope) ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td><input class="inp num" type="number" min="0" step="any" data-cl="' + i + '" data-f="qte" value="' + esc(l.qte) + '" aria-label="Quantité"></td><td><input class="inp" data-cl="' + i + '" data-f="unite" value="' + esc(l.unite) + '" aria-label="Unité" style="min-width:90px"></td><td><input class="inp num" type="number" min="0" step="any" data-cl="' + i + '" data-f="fe" value="' + esc(l.fe) + '" aria-label="Facteur d\'émission"></td><td class="num" id="cr' + i + '"><strong>' + fmtN((Number(l.qte) || 0) * (Number(l.fe) || 0) / 1000) + ' t</strong></td><td><button class="linkbtn" style="color:var(--danger)" data-calc="del" data-i="' + i + '" aria-label="Supprimer la ligne">✕</button></td></tr>').join('');
}
function drawCalcRes(){
  const s = calcTotals(), tot = s[1] + s[2] + s[3], eff = Number(T.calc.effectif) || 0;
  const rows = T.calc.lignes.map(l => ({p: l.poste, v: (Number(l.qte) || 0) * (Number(l.fe) || 0) / 1000, s: l.scope})).filter(x => x.v > 0).sort((a, b) => b.v - a.v);
  const max = rows.length ? rows[0].v : 1;
  document.getElementById('calcRes').innerHTML = '<div class="tiles"><div class="tile"><div class="big">' + fmtN(tot) + ' t</div><div class="lbl">total CO₂e' + (eff ? ' · ' + fmtN(tot / eff) + ' t par salarié' : '') + '</div></div>' + [1, 2, 3].map(k => '<div class="tile"><div class="big">' + fmtN(s[k]) + ' t</div><div class="lbl">scope ' + k + (tot ? ' · ' + fmtN(s[k] / tot * 100, 0) + ' %' : '') + '</div></div>').join('') + '</div>'
    + (rows.length ? '<h4>Postes du plus grand au plus petit</h4><div class="legend"><span><i class="s1"></i>Scope 1</span><span><i class="s2"></i>Scope 2</span><span><i class="s3"></i>Scope 3</span></div><div class="hbars">' + rows.map(r => '<div class="hb"><span class="hb-l">' + esc(r.p) + '</span><span class="hb-b"><span class="s' + r.s + '" style="width:' + Math.max(1, r.v / max * 100) + '%"></span></span><span class="hb-v">' + fmtN(r.v) + ' t</span></div>').join('') + '</div><p class="progress">Les ' + Math.min(3, rows.length) + ' premiers postes représentent ' + fmtN(rows.slice(0, 3).reduce((a, r) => a + r.v, 0) / tot * 100, 0) + ' % du total.</p>' : '');
}
document.getElementById('terrainRoot').addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.cl != null) { const l = T.calc.lignes[+t.dataset.cl]; l[t.dataset.f] = t.dataset.f === 'scope' ? +t.value : (t.type === 'number' ? t.value : t.value); const c = document.getElementById('cr' + t.dataset.cl); if (c) c.innerHTML = '<strong>' + fmtN((Number(l.qte) || 0) * (Number(l.fe) || 0) / 1000) + ' t</strong>'; drawCalcRes(); saveCalc(); }
  else if (t.id === 'calcNom') { T.calc.nom = t.value; saveCalc(); }
  else if (t.id === 'calcEff') { T.calc.effectif = t.value; drawCalcRes(); saveCalc(); }
});
document.getElementById('terrainRoot').addEventListener('change', e => {
  if (e.target.dataset.f === 'scope') { T.calc.lignes[+e.target.dataset.cl].scope = +e.target.value; drawCalcRes(); saveCalc(); }
  if (e.target.id === 'calcAdd' && e.target.value !== '') { const f = FE_TYPES[+e.target.value]; T.calc.lignes.push({poste: f[0], scope: f[1], qte: 0, unite: f[2], fe: f[3]}); e.target.value = ''; drawCalcRows(); drawCalcRes(); saveCalc(); const ins = document.querySelectorAll('#calcBody input[data-f="qte"]'); if (ins.length) ins[ins.length - 1].focus(); }
});
document.getElementById('terrainRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-calc]'); if (!b) return;
  const a = b.dataset.calc;
  if (a === 'del') { T.calc.lignes.splice(+b.dataset.i, 1); drawCalcRows(); drawCalcRes(); saveCalc(); }
  else if (a === 'demo') { T.calc = {id: 'calc', nom: 'Exemple : société de services, 60 salariés', effectif: 60, lignes: CALC_DEMO.map(x => Object.assign({}, x))}; saveCalc(); renderCalc(); }
  else if (a === 'clear') { T.calc = {id: 'calc', nom: '', effectif: '', lignes: []}; saveCalc(); renderCalc(); }
  else if (a === 'copy') {
    const s = calcTotals();
    const tsv = ['Poste\tScope\tQuantité\tUnité\tFacteur (kgCO2e/unité)\tRésultat (tCO2e)'].concat(T.calc.lignes.map(l => [l.poste, l.scope, l.qte, l.unite, l.fe, ((Number(l.qte) || 0) * (Number(l.fe) || 0) / 1000).toFixed(2)].join('\t'))).concat(['', 'Scope 1\t\t\t\t\t' + s[1].toFixed(2), 'Scope 2\t\t\t\t\t' + s[2].toFixed(2), 'Scope 3\t\t\t\t\t' + s[3].toFixed(2), 'Total\t\t\t\t\t' + (s[1] + s[2] + s[3]).toFixed(2)]).join('\n');
    try { await navigator.clipboard.writeText(tsv); toast('Tableau copié : collez-le dans Excel'); } catch(err) { toast('Copie impossible dans ce navigateur'); }
  }
});

/* ---------- Mes candidatures ---------- */
const STATUTS = ['À envoyer', 'Envoyée', 'Relancée', 'Entretien', 'Offre reçue', 'Acceptée', 'Refusée'];
const CONTRATS = ['Alternance (apprentissage)', 'Contrat de professionnalisation', 'Stage', 'CDD', 'CDI', 'Freelance'];
const today = () => new Date().toISOString().slice(0, 10);
async function loadCands(){ try { T.cands = IDB.db ? await IDB.all('candidatures') : []; } catch(e) { T.cands = []; } }
const aRelancer = c => ['Envoyée', 'Relancée'].includes(c.statut) && c.relance && c.relance <= today();
function renderCands(){
  const el = document.getElementById('candRoot'); if (!el) return;
  const L = T.cands.slice().sort((a, b) => (b.dateEnvoi || '').localeCompare(a.dateEnvoi || '') || (b.createdAt || 0) - (a.createdAt || 0));
  const n = s => T.cands.filter(c => c.statut === s).length;
  const rel = T.cands.filter(aRelancer);
  el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Mes candidatures</h2><p class="lead">Suivez chaque candidature, ses relances et ses entretiens. Tout reste sur cet appareil.</p>'
    + '<div class="tiles"><div class="tile"><div class="big">' + T.cands.length + '</div><div class="lbl">candidatures</div></div><div class="tile"><div class="big">' + (n('Envoyée') + n('Relancée')) + '</div><div class="lbl">en attente de réponse</div></div><div class="tile"><div class="big">' + n('Entretien') + '</div><div class="lbl">entretiens</div></div><div class="tile"><div class="big">' + rel.length + '</div><div class="lbl">à relancer aujourd\'hui</div></div></div>'
    + (rel.length ? '<div class="callout"><strong>À relancer</strong>' + rel.map(c => esc(c.entreprise) + ' (' + esc(c.poste) + ')').join(', ') + '. Un modèle de relance est disponible ci-dessous.</div>' : '')
    + '<div class="ctool"><button class="btn" data-cand="new">+ Nouvelle candidature</button><a class="btn ghost" href="#offre">Analyser une offre d\'abord</a></div>'
    + (L.length ? '<div class="tablewrap"><table><thead><tr><th>Entreprise</th><th>Poste</th><th>Contrat</th><th>Envoi</th><th>Statut</th><th>Prochaine action</th><th></th></tr></thead><tbody>' + L.map(c => '<tr' + (aRelancer(c) ? ' class="hl"' : '') + '><td><strong>' + esc(c.entreprise) + '</strong></td><td>' + esc(c.poste) + '</td><td>' + esc(c.contrat || '') + '</td><td class="num">' + (c.dateEnvoi ? esc(new Date(c.dateEnvoi).toLocaleDateString('fr-FR')) : '—') + '</td><td><select class="inp" data-cstat="' + esc(c.id) + '" aria-label="Statut">' + STATUTS.map(s => '<option' + (s === c.statut ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td>' + esc(c.action || '') + (c.relance ? '<div class="progress">relance le ' + esc(new Date(c.relance).toLocaleDateString('fr-FR')) + '</div>' : '') + '</td><td style="white-space:nowrap"><button class="linkbtn" data-cand="edit" data-id="' + esc(c.id) + '">Modifier</button> · <button class="linkbtn" style="color:var(--danger)" data-cand="del" data-id="' + esc(c.id) + '">Supprimer</button></td></tr>').join('') + '</tbody></table></div>' : '<div class="callout b"><strong>Aucune candidature pour l\'instant</strong>Ajoutez votre première candidature, ou analysez d\'abord une offre pour préparer votre dossier.</div>')
    + '<h3>Modèles de messages</h3>'
    + '<div class="card scriptcard"><div class="sc-head"><span class="pill o">À utiliser tel quel</span><h4>Relance après 8 à 10 jours sans réponse</h4></div><div class="tpl">Objet : Candidature au poste de [poste] – [Prénom Nom]\n\nBonjour [Madame / Monsieur Nom],\n\nJe me permets de revenir vers vous au sujet de ma candidature au poste de [poste], envoyée le [date].\n\nVotre démarche [élément précis : votre premier rapport de durabilité, votre engagement sur les achats responsables] correspond exactement à ce sur quoi je souhaite contribuer, notamment [mission de l\'offre].\n\nJe reste à votre disposition pour un échange, même court, à votre convenance.\n\nBien cordialement,\n[Prénom Nom]\n[Téléphone]</div></div>'
    + '<div class="card scriptcard"><div class="sc-head"><span class="pill o">À utiliser tel quel</span><h4>Remerciement après un entretien (le jour même)</h4></div><div class="tpl">Objet : Merci pour notre échange – [poste]\n\nBonjour [Madame / Monsieur Nom],\n\nMerci pour le temps que vous m\'avez consacré aujourd\'hui. Notre échange sur [sujet abordé : la collecte des données, le bilan carbone] a renforcé mon envie de rejoindre [entreprise].\n\nComme évoqué, je pourrais rapidement contribuer à [mission précise], en m\'appuyant sur [compétence ou expérience].\n\nJe reste à votre disposition pour tout complément.\n\nBien cordialement,\n[Prénom Nom]</div></div>';
}
function candForm(c){
  c = c || {};
  const f = (id, l, v, type) => '<div class="row"><label for="' + id + '">' + l + '</label><input class="inp" id="' + id + '" type="' + (type || 'text') + '" value="' + esc(v || '') + '"></div>';
  return f('cEnt', 'Entreprise', c.entreprise) + f('cPoste', 'Poste', c.poste) + '<div class="row"><label for="cContrat">Contrat</label><select class="inp" id="cContrat">' + CONTRATS.map(x => '<option' + (x === c.contrat ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px">' + f('cEnvoi', 'Date d\'envoi', c.dateEnvoi, 'date') + f('cRel', 'Date de relance', c.relance, 'date') + '</div><div class="row"><label for="cStat">Statut</label><select class="inp" id="cStat">' + STATUTS.map(x => '<option' + (x === (c.statut || 'À envoyer') ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div>' + f('cAct', 'Prochaine action', c.action) + f('cLien', 'Lien de l\'offre ou contact', c.lien) + '<div class="row"><label for="cNotes">Notes</label><textarea class="ta" id="cNotes" style="min-height:70px">' + esc(c.notes || '') + '</textarea></div>';
}
function candModal(c){
  modal(c && c.id ? 'Modifier la candidature' : 'Nouvelle candidature', candForm(c), 'Enregistrer', async () => {
    const v = id => document.getElementById(id).value.trim();
    if (!v('cEnt') || !v('cPoste')) { toast('Indiquez au moins l\'entreprise et le poste'); return false; }
    const env = v('cEnvoi'); let rel = v('cRel');
    if (env && !rel && ['Envoyée'].includes(v('cStat'))) { const d = new Date(env); d.setDate(d.getDate() + 10); rel = d.toISOString().slice(0, 10); }
    const o = Object.assign(c && c.id ? c : {id: uid(), createdAt: Date.now()}, {entreprise: v('cEnt'), poste: v('cPoste'), contrat: v('cContrat'), dateEnvoi: env, relance: rel, statut: v('cStat'), action: v('cAct'), lien: v('cLien'), notes: v('cNotes'), updatedAt: Date.now()});
    await IDB.put('candidatures', o); await loadCands(); renderCands(); toast('Candidature enregistrée');
  });
}
document.getElementById('candRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-cand]'); if (!b) return;
  const a = b.dataset.cand, c = T.cands.find(x => x.id === b.dataset.id);
  if (a === 'new') candModal(T.prefill || null), T.prefill = null;
  else if (a === 'edit') candModal(c);
  else if (a === 'del') modal('Supprimer cette candidature ?', '<p>' + esc(c.entreprise) + ' · ' + esc(c.poste) + '</p>', 'Supprimer', async () => { await IDB.del('candidatures', c.id); await loadCands(); renderCands(); }, true);
});
document.getElementById('candRoot').addEventListener('change', async e => {
  const s = e.target.closest('[data-cstat]'); if (!s) return;
  const c = T.cands.find(x => x.id === s.dataset.cstat); c.statut = s.value; c.updatedAt = Date.now();
  if (s.value === 'Envoyée' && !c.dateEnvoi) { c.dateEnvoi = today(); const d = new Date(); d.setDate(d.getDate() + 10); c.relance = d.toISOString().slice(0, 10); }
  if (s.value === 'Relancée') { const d = new Date(); d.setDate(d.getDate() + 10); c.relance = d.toISOString().slice(0, 10); }
  await IDB.put('candidatures', c); await loadCands(); renderCands();
});

/* ---------- Analyse d'une offre ---------- */
const MOTS = {
  reg: ['csrd', 'esrs', 'reporting', 'extra-financier', 'extra financier', 'dpef', 'reglementation', 'reglementaire', 'conformite', 'veille', 'rapport de durabilite', 'vsme', 'vigilance', 'csddd'],
  carbone: ['carbone', 'ges', 'gaz a effet de serre', 'beges', 'scope', 'decarbonation', 'climat', 'sbti', 'trajectoire', 'bas carbone', 'plan de transition', 'emissions'],
  dm: ['materialite', 'double materialite', 'parties prenantes', 'cartographie des enjeux', 'analyse des risques', 'iro'],
  projet: ['gestion de projet', 'pilotage', 'piloter', 'coordonner', 'coordination', 'planning', 'feuille de route', 'plan d\'action', 'comite', 'animer'],
  indicateurs: ['indicateurs', 'kpi', 'tableau de bord', 'tableaux de bord', 'esg', 'donnees', 'collecte', 'excel', 'power bi', 'data'],
  envi: ['environnement', 'environnemental', 'iso 14001', 'energie', 'eau', 'dechets', 'icpe', 'qhse', 'hse', 'acv', 'analyse de cycle de vie'],
  achats: ['achats', 'fournisseurs', 'supply chain', 'chaine d\'approvisionnement', 'ecovadis', 'iso 20400', 'chaine de valeur', 'sous-traitants'],
  circulaire: ['economie circulaire', 'ecoconception', 'eco-conception', 'recyclage', 'reemploi', 'agec', 'emballages', 'rep'],
  social: ['qvct', 'qualite de vie', 'egalite', 'diversite', 'inclusion', 'handicap', 'sante securite', 'droits humains', 'social', 'rh'],
  finance: ['taxonomie', 'finance durable', 'sfdr', 'isr', 'investissement responsable', 'notation', 'analyste esg', 'green bonds'],
  budget: ['budget', 'budgetaire', 'roi', 'retour sur investissement', 'couts', 'financier', 'business case'],
  comm: ['sensibilisation', 'sensibiliser', 'communication', 'formation', 'animer', 'ateliers', 'conduite du changement', 'pedagogie', 'mobiliser', 'embarquer']
};
const REFS = ['CSRD', 'ESRS', 'VSME', 'GRI', 'ISO 26000', 'ISO 14001', 'ISO 45001', 'ISO 50001', 'ISO 20400', 'GHG Protocol', 'Bilan Carbone', 'BEGES', 'SBTi', 'EcoVadis', 'CDP', 'Taxonomie', 'SFDR', 'CSDDD', 'B Corp', 'Fresque du Climat', 'Excel', 'Power BI', 'SAP', 'Sweep', 'Greenly', 'Python', 'PowerPoint', 'Anglais'];
const QPAR = {reg: 'Quelles obligations RSE s\'appliquent à notre entreprise ?', carbone: 'Comment calculeriez-vous notre bilan carbone ?', dm: 'Qu\'est-ce que la double matérialité ?', projet: 'Vous arrivez demain : que faites-vous les trois premiers mois ?', indicateurs: 'Comment mesureriez-vous le succès de votre mission ?', comm: 'Comment convaincriez-vous un directeur de production réticent ?', envi: 'Comment calculeriez-vous notre bilan carbone ?', achats: 'Comment convaincriez-vous un directeur de production réticent ?', circulaire: 'Vous arrivez demain : que faites-vous les trois premiers mois ?', social: 'Comment mesureriez-vous le succès de votre mission ?', finance: 'Qu\'est-ce que la double matérialité ?', budget: 'Comment mesureriez-vous le succès de votre mission ?'};
function analyseOffre(text){
  const n = ' ' + norm(text).replace(/[^a-z0-9'+ -]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const has = k => n.includes(' ' + k + ' ') || n.includes(' ' + k + 's ') || (k.length > 6 && n.includes(k));
  const comps = P.comp.map(c => ({c, hits: arr(MOTS[c.id]).filter(has)})).filter(x => x.hits.length).sort((a, b) => b.hits.length - a.hits.length);
  const refs = REFS.filter(r => has(norm(r)));
  const contrat = /alternance|apprenti/.test(n) ? 'Alternance' : /professionnalisation/.test(n) ? 'Contrat de professionnalisation' : /stage|stagiaire/.test(n) ? 'Stage' : /\bcdi\b/.test(n) ? 'CDI' : /\bcdd\b/.test(n) ? 'CDD' : 'Non précisé';
  const ids = comps.map(x => x.c.id);
  const titre = norm((String(text).split('\n').map(x => x.trim()).find(Boolean) || ''));
  const met = P.metiers.map(m => ({m, s: arr(m.competences).filter(id => ids.includes(id)).length + (titre.includes(norm(m.titre)) ? 6 : 0)})).sort((a, b) => b.s - a.s)[0];
  return {comps, refs, contrat, metier: met && met.s ? met.m : null};
}
function renderOffre(){
  const el = document.getElementById('offreRoot'); if (!el) return;
  el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Analyser une offre et adapter mon CV</h2><p class="lead">Collez le texte d\'une offre. L\'application repère les compétences demandées et les compare à votre profil (étape 1), calcule le score de votre CV face aux logiciels de tri des recruteurs (étape 2), produit un CV adapté à l\'offre (étape 3) et une lettre de motivation (étape 4).</p><textarea class="ta big" id="offreTxt" placeholder="Collez ici le texte complet de l\'offre (missions, profil recherché…)" aria-label="Texte de l\'offre" style="min-height:220px">' + esc(T.offreTxt || '') + '</textarea><div class="ctool"><button class="btn" data-off="go">Analyser l\'offre</button><button class="btn ghost" data-off="ex">Essayer avec un exemple</button></div><div id="offreRes"></div><p class="progress">L\'analyse repose sur des mots-clés : elle aide à préparer, sans remplacer votre lecture attentive de l\'offre. Ne mettez dans votre CV que des compétences que vous possédez réellement.</p>';
  if (T.offreRes) drawOffre();
}
function drawOffre(){
  const r = T.offreRes, box = document.getElementById('offreRes'); if (!box) return;
  if (!r.comps.length) { box.innerHTML = '<div class="callout"><strong>Peu de compétences RSE détectées</strong>Vérifiez que vous avez collé le texte complet de l\'offre, avec les missions et le profil recherché.</div>'; return; }
  const gaps = r.comps.filter(x => compLevel(x.c.id) < 2);
  const cas = [...new Set(gaps.flatMap(x => P.cas.filter(c => arr(c.competences).includes(x.c.id)).map(c => c.id)))].slice(0, 4);
  const qs = [...new Set(r.comps.map(x => QPAR[x.c.id]).filter(Boolean))].slice(0, 5);
  box.innerHTML = '<h3>Étape 1 : ce que demande l\'offre</h3><div class="tiles"><div class="tile"><div class="big" style="font-size:20px">' + esc(r.metier ? r.metier.titre : 'Poste RSE') + '</div><div class="lbl">métier le plus proche</div></div><div class="tile"><div class="big">' + r.comps.length + '</div><div class="lbl">compétences demandées</div></div><div class="tile"><div class="big">' + gaps.length + '</div><div class="lbl">à renforcer selon votre profil</div></div><div class="tile"><div class="big" style="font-size:20px">' + esc(r.contrat) + '</div><div class="lbl">type de contrat</div></div></div>'
    + '<div class="tablewrap"><table><thead><tr><th>Compétence demandée</th><th>Mots repérés dans l\'offre</th><th>Votre niveau</th><th>Écart</th></tr></thead><tbody>' + r.comps.map(x => { const lv = compLevel(x.c.id); return '<tr><td><strong>' + esc(x.c.nom) + '</strong></td><td style="font-size:13px">' + x.hits.map(esc).join(', ') + '</td><td>' + NIV[lv] + '</td><td>' + (lv >= 2 ? '<span class="pill">Prêt</span>' : lv === 1 ? '<span class="pill o">À renforcer</span>' : '<span class="pill r">À travailler</span>') + '</td></tr>'; }).join('') + '</tbody></table></div>'
    + (r.refs.length ? '<h4>Référentiels et outils cités</h4><div class="filters">' + r.refs.map(x => '<span class="chip" style="cursor:default">' + esc(x) + '</span>').join('') + '</div><p class="progress">Vous devez pouvoir expliquer chacun d\'eux en deux phrases et dire si vous l\'avez déjà utilisé.</p>' : '')
    + '<h3>Votre plan de préparation</h3><div class="grid two"><div class="card"><h4>Cas pratiques à faire</h4>' + (cas.length ? '<ul>' + cas.map(id => '<li><button class="linkbtn" data-off="cas" data-id="' + id + '">' + esc(casById(id).titre) + '</button>' + (done(id) ? ' ✓' : '') + '</li>').join('') + '</ul>' : '<p>Vos niveaux couvrent déjà les compétences demandées : préparez des exemples concrets.</p>') + '</div><div class="card"><h4>Questions d\'entretien probables</h4><ol>' + qs.map(q => '<li>' + esc(q) + '</li>').join('') + '</ol><a class="linkbtn" href="#simulateur">S\'entraîner avec le simulateur →</a></div></div>'
    + '<div class="ctool"><button class="btn" data-off="save">Ajouter à mes candidatures</button></div><div id="offreSuite"></div>';
  drawSuite();
}
const OFFRE_EX = 'Alternance – Chargé de mission RSE (H/F) – Lyon\n\nRattaché(e) à la Responsable RSE, vous participez au déploiement de notre stratégie RSE. Vos missions :\n- Collecter et fiabiliser les données ESG des sites et construire les tableaux de bord\n- Participer au reporting extra-financier (CSRD, ESRS) et à l\'analyse de double matérialité\n- Contribuer à la mise à jour de notre bilan carbone (BEGES) et au plan de décarbonation\n- Répondre aux questionnaires clients (EcoVadis, CDP)\n- Animer des actions de sensibilisation auprès des collaborateurs\n- Accompagner la direction des achats dans l\'évaluation des fournisseurs\n\nProfil : Master en RSE ou développement durable, maîtrise d\'Excel, aisance rédactionnelle, rigueur, goût pour la gestion de projet. Anglais apprécié.';
document.getElementById('offreRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-off]'); if (!b) return;
  const a = b.dataset.off;
  if (a === 'ex') { document.getElementById('offreTxt').value = OFFRE_EX; }
  if (a === 'go' || a === 'ex') { T.offreTxt = document.getElementById('offreTxt').value; T.offreRes = analyseOffre(T.offreTxt); drawOffre(); document.getElementById('offreRes').scrollIntoView({behavior: 'smooth', block: 'start'}); }
  else if (a === 'cas') { goTo('labo--' + b.dataset.id); }
  else if (a === 'save') { const first = (T.offreTxt || '').split('\n').map(x => x.trim()).find(Boolean) || ''; T.prefill = {poste: first.slice(0, 120), contrat: T.offreRes.contrat === 'Alternance' ? CONTRATS[0] : CONTRATS.find(c => c.startsWith(T.offreRes.contrat)) || '', statut: 'À envoyer', notes: 'Compétences demandées : ' + T.offreRes.comps.map(x => x.c.nom).join(', ')}; goTo('candidatures'); setTimeout(() => candModal(T.prefill), 300); }
});

/* ---------- Simulateur d'entretien ---------- */
const CHECK_REP = ['J\'ai répondu à la question posée, dès la première phrase', 'J\'ai donné un exemple concret (situation, action, résultat)', 'J\'ai cité au moins un chiffre ou un fait précis', 'J\'ai relié ma réponse à l\'entreprise ou au poste', 'Ma réponse tenait en moins de 2 minutes'];
function simBank(mid){
  const g = T.guides.find(x => x.id === 'entretien'); const qa = g ? arr(g.blocs).filter(b => b.t === 'qa').flatMap(b => arr(b.x)) : [];
  const out = qa.map(x => ({q: x.q, r: x.r}));
  const m = metier(mid);
  if (m) arr(m.missions).slice(0, 4).forEach(ms => out.push({q: 'Le poste de ' + m.titre.toLowerCase() + ' implique de : « ' + ms.charAt(0).toLowerCase() + ms.slice(1) + ' ». Comment vous y prendriez-vous concrètement ?', r: 'Une bonne réponse suit quatre temps : 1) ce que vous clarifiez d\'abord (objectif, interlocuteurs, données existantes) ; 2) les étapes que vous suivriez, dans l\'ordre ; 3) les outils ou livrables (' + arr(m.livrables).slice(0, 2).join(', ').toLowerCase() + ') ; 4) comment vous mesurez le résultat. Appuyez-vous sur un cas pratique du laboratoire ou une expérience réelle.'}));
  return out;
}
function renderSim(){
  const el = document.getElementById('simRoot'); if (!el) return;
  const S = T.sim;
  if (!S) {
    const obj = P.profil && P.profil.objectif;
    el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Simulateur d\'entretien</h2><p class="lead">Répondez à des questions de recruteur dans le temps imparti, puis comparez avec une réponse modèle et évaluez-vous. Entraînez-vous à voix haute : c\'est ainsi qu\'on progresse.</p><div class="card"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0 16px"><div class="row"><label for="simMet">Poste visé</label><select class="inp" id="simMet"><option value="">Poste RSE général</option>' + P.metiers.map(m => '<option value="' + m.id + '"' + (m.id === obj ? ' selected' : '') + '>' + esc(m.titre) + '</option>').join('') + '</select></div><div class="row"><label for="simN">Nombre de questions</label><select class="inp" id="simN"><option>3</option><option selected>5</option><option>8</option></select></div><div class="row"><label for="simT">Temps par question</label><select class="inp" id="simT"><option value="60">1 minute</option><option value="120" selected>2 minutes</option><option value="180">3 minutes</option></select></div></div><button class="btn" data-sim="start">Commencer l\'entretien</button></div><div class="callout b"><strong>Conseil</strong>Lisez d\'abord le guide « Réussir son entretien » dans Sur le terrain : pitch, méthode STAR et réponses modèles.</div>';
    return;
  }
  if (S.i >= S.qs.length) {
    const tot = S.scores.reduce((a, b) => a + b, 0), max = S.qs.length * CHECK_REP.length;
    el.innerHTML = '<div class="card"><div class="meta"><span class="pill">Entretien terminé</span></div><h2 style="margin-top:6px">' + Math.round(tot / max * 100) + ' % des critères remplis</h2><p>' + (tot / max >= .75 ? 'Très bonne préparation. Entraînez-vous maintenant à voix haute devant quelqu\'un.' : 'Reprenez les réponses modèles et retravaillez surtout vos exemples chiffrés.') + '</p><div class="ctool"><button class="btn" data-sim="again">Nouvel entretien</button><button class="btn ghost" data-sim="copy">Copier mes réponses</button></div></div>' + S.qs.map((q, i) => '<details><summary>' + esc(q.q) + '</summary><div class="inner"><h4>Ma réponse</h4><p style="white-space:pre-wrap">' + esc(S.reps[i] || '(pas de réponse écrite)') + '</p><h4>Réponse modèle</h4><p>' + esc(q.r) + '</p></div></details>').join('');
    return;
  }
  const q = S.qs[S.i];
  el.innerHTML = '<div class="card"><div class="meta"><span class="pill">Question ' + (S.i + 1) + ' / ' + S.qs.length + '</span><span class="pill o" id="simClock">' + Math.floor(S.left / 60) + ':' + String(S.left % 60).padStart(2, '0') + '</span></div><h3 style="margin-top:8px">« ' + esc(q.q) + ' »</h3>' + (S.reveal ? '<h4>Votre réponse</h4><p style="white-space:pre-wrap">' + esc(S.reps[S.i] || '(réponse orale)') + '</p><div class="callout g"><strong>Réponse modèle</strong>' + esc(q.r) + '</div><h4>Auto-évaluation</h4><div class="checklist">' + CHECK_REP.map((c, k) => '<label><input type="checkbox" data-simck="' + k + '"> <span>' + esc(c) + '</span></label>').join('') + '</div><div class="ctool"><button class="btn" data-sim="next">' + (S.i + 1 < S.qs.length ? 'Question suivante' : 'Voir le bilan') + '</button></div>' : '<textarea class="ta big" id="simRep" placeholder="Rédigez ou résumez votre réponse (ou répondez à voix haute, puis notez les points clés)" aria-label="Votre réponse" style="min-height:180px">' + esc(S.reps[S.i] || '') + '</textarea><div class="ctool"><button class="btn" data-sim="reveal">J\'ai répondu : voir la réponse modèle</button></div>') + '</div>';
  if (!S.reveal) tick();
}
function tick(){ clearInterval(T.simTimer); T.simTimer = setInterval(() => { const S = T.sim; if (!S || S.reveal || location.hash !== '#simulateur') { clearInterval(T.simTimer); return; } S.left = Math.max(0, S.left - 1); const c = document.getElementById('simClock'); if (c) { c.textContent = Math.floor(S.left / 60) + ':' + String(S.left % 60).padStart(2, '0'); if (S.left <= 15) c.className = 'pill r'; } if (S.left === 0) { clearInterval(T.simTimer); toast('Temps écoulé'); } }, 1000); }
document.getElementById('simRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-sim]'); if (!b) return;
  const a = b.dataset.sim;
  if (a === 'start') { const bank = simBank(document.getElementById('simMet').value).sort(() => Math.random() - .5); const n = +document.getElementById('simN').value, t = +document.getElementById('simT').value; T.sim = {qs: bank.slice(0, n), i: 0, reps: [], scores: [], t, left: t, reveal: false}; renderSim(); }
  else if (a === 'reveal') { const r = document.getElementById('simRep'); T.sim.reps[T.sim.i] = r ? r.value : ''; T.sim.reveal = true; clearInterval(T.simTimer); renderSim(); }
  else if (a === 'next') { T.sim.scores[T.sim.i] = document.querySelectorAll('[data-simck]:checked').length; T.sim.i++; T.sim.reveal = false; T.sim.left = T.sim.t; renderSim(); window.scrollTo(0, 0); }
  else if (a === 'again') { T.sim = null; renderSim(); }
  else if (a === 'copy') { const t = T.sim.qs.map((q, i) => 'Question : ' + q.q + '\nMa réponse : ' + (T.sim.reps[i] || '')).join('\n\n'); try { await navigator.clipboard.writeText(t); toast('Réponses copiées'); } catch(err) { toast('Copie impossible'); } }
});

/* ---------- Examen blanc chronométré ---------- */
function examBank(src){
  if (src === 'bible') { const G = GLO.filter(g => g[1] && g[1].length < 260); return G.map(g => { const others = G.filter(x => x !== g).sort(() => Math.random() - .5).slice(0, 3).map(x => x[0]); const choix = others.concat([g[0]]).sort(() => Math.random() - .5); return {question: 'Quel terme correspond à cette définition : « ' + g[1] + ' » ?', choix, bonne: choix.indexOf(g[0]), explication: g[0] + ' : ' + g[1], lien: 'glossaire'}; }); }
  const m = matOf(src); if (!m) return [];
  return ofMat('questions', m.id).filter(q => q.type === 'qcm').concat(genQuestions(m.id));
}
function renderExam(){
  const el = document.getElementById('examRoot'); if (!el) return;
  const X = T.exam;
  if (!X) {
    let best = {}; try { best = JSON.parse(localStorage.getItem('seriki_exam') || '{}'); } catch(e) {}
    el.innerHTML = '<div class="eyebrow">PRATIQUER</div><h2>Examen blanc chronométré</h2><p class="lead">Mettez-vous en conditions d\'examen : un nombre de questions fixe, un temps limité, pas de correction avant la fin. Vous obtenez ensuite votre note sur 20 et la liste des notions à revoir.</p><div class="card"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:0 16px"><div class="row"><label for="exSrc">Sujet</label><select class="inp" id="exSrc"><option value="bible">Vocabulaire et notions de la RSE (glossaire)</option>' + E.matieres.filter(m => ofMat('questions', m.id).length + ofMat('notions', m.id).length >= 4).map(m => '<option value="' + m.id + '">Ma matière : ' + esc(m.nom) + '</option>').join('') + '</select></div><div class="row"><label for="exN">Format</label><select class="inp" id="exN"><option value="10|10">10 questions · 10 minutes</option><option value="20|20" selected>20 questions · 20 minutes</option><option value="30|30">30 questions · 30 minutes</option></select></div></div><button class="btn" data-ex="start">Commencer l\'examen</button>' + (best.bible != null ? '<p class="progress">Meilleure note au vocabulaire RSE : ' + best.bible + ' / 20</p>' : '') + '</div><p class="progress">Pour un examen sur vos propres cours, ajoutez des questions ou au moins 4 notions dans une matière de votre espace.</p>';
    return;
  }
  if (X.fini) {
    const ok = X.qs.filter((q, i) => X.rep[i] === Number(q.bonne)).length, note = Math.round(ok / X.qs.length * 200) / 10;
    let best = {}; try { best = JSON.parse(localStorage.getItem('seriki_exam') || '{}'); if (best[X.src] == null || note > best[X.src]) { best[X.src] = note; localStorage.setItem('seriki_exam', JSON.stringify(best)); } } catch(e) {}
    const faux = X.qs.map((q, i) => ({q, i})).filter(x => X.rep[x.i] !== Number(x.q.bonne));
    el.innerHTML = '<div class="card"><div class="meta"><span class="pill">Examen terminé</span>' + (X.timeout ? '<span class="pill r">Temps écoulé</span>' : '') + '</div><div style="font-family:var(--font-display);font-size:44px;font-weight:600">' + fmtN(note) + ' / 20</div><p>' + ok + ' bonnes réponses sur ' + X.qs.length + '.</p><div class="ctool"><button class="btn" data-ex="again">Nouvel examen</button></div></div>' + (faux.length ? '<h3>À revoir (' + faux.length + ')</h3>' + faux.map(x => '<details><summary>' + esc(x.q.question) + '</summary><div class="inner"><p>Votre réponse : ' + (X.rep[x.i] != null ? esc(x.q.choix[X.rep[x.i]]) : 'aucune') + '</p><p><strong>Bonne réponse : ' + esc(x.q.choix[x.q.bonne]) + '</strong></p><p class="progress">' + esc(x.q.explication || '') + '</p></div></details>').join('') : '<div class="callout g"><strong>Sans faute</strong>Passez au format supérieur.</div>');
    return;
  }
  const q = X.qs[X.i];
  el.innerHTML = '<div class="card quiz"><div class="meta"><span class="pill">Question ' + (X.i + 1) + ' / ' + X.qs.length + '</span><span class="pill o" id="exClock"></span><span class="pill g">' + Object.keys(X.rep).length + ' réponses données</span></div><div class="bar"><span style="width:' + (X.i / X.qs.length * 100) + '%"></span></div><h4 style="font-size:18px;margin-top:14px">' + esc(q.question) + '</h4>' + arr(q.choix).map((c, i) => '<button class="opt' + (X.rep[X.i] === i ? ' sel' : '') + '" data-ex="ans" data-i="' + i + '">' + String.fromCharCode(65 + i) + '. ' + esc(c) + '</button>').join('') + '<div class="ctool"><button class="btn ghost" data-ex="prev"' + (X.i ? '' : ' disabled') + '>Précédente</button><button class="btn" data-ex="nextq">' + (X.i + 1 < X.qs.length ? 'Suivante' : 'Terminer') + '</button><button class="btn danger sm" data-ex="end">Rendre la copie</button></div></div>';
  clockExam();
}
function clockExam(){ clearInterval(T.exTimer); const upd = () => { const X = T.exam; if (!X || X.fini) { clearInterval(T.exTimer); return; } const left = Math.max(0, Math.round((X.fin - Date.now()) / 1000)); const c = document.getElementById('exClock'); if (c) { c.textContent = Math.floor(left / 60) + ':' + String(left % 60).padStart(2, '0'); if (left <= 60) c.className = 'pill r'; } if (!left) { X.fini = true; X.timeout = true; clearInterval(T.exTimer); renderExam(); } }; upd(); T.exTimer = setInterval(upd, 1000); }
document.getElementById('examRoot').addEventListener('click', e => {
  const b = e.target.closest('[data-ex]'); if (!b) return;
  const a = b.dataset.ex, X = T.exam;
  if (a === 'start') { const src = document.getElementById('exSrc').value, [n, min] = document.getElementById('exN').value.split('|').map(Number); const qs = examBank(src).sort(() => Math.random() - .5).slice(0, n); if (qs.length < 4) { toast('Pas assez de questions pour cet examen'); return; } T.exam = {src, qs, i: 0, rep: {}, fin: Date.now() + min * 60000}; renderExam(); }
  else if (a === 'ans') { X.rep[X.i] = +b.dataset.i; renderExam(); }
  else if (a === 'nextq') { if (X.i + 1 < X.qs.length) { X.i++; renderExam(); } else { X.fini = true; renderExam(); } }
  else if (a === 'prev') { X.i = Math.max(0, X.i - 1); renderExam(); }
  else if (a === 'end') modal('Rendre la copie ?', '<p>' + Object.keys(X.rep).length + ' réponses données sur ' + X.qs.length + '. Les questions sans réponse comptent comme fausses.</p>', 'Rendre la copie', () => { X.fini = true; renderExam(); });
  else if (a === 'again') { T.exam = null; renderExam(); }
});

/* ---------- Initialisation ---------- */
async function tInit(){
  try { const d = await fetch('data/terrain.json', {cache: 'no-cache'}).then(r => r.json()); T.guides = arr(d.guides); } catch(e) { toast('Guides indisponibles'); }
  await pReady; await loadCands();
  renderTerrain(); renderCands(); renderOffre(); renderSim(); renderExam(); renderHubs(); renderDash(); buildIndex(); applySub();
  setTimeout(() => { if (!LS.get('decouverte')) decouverte(); else if (!LS.get('public')) choisirPublic(); }, 2500);
}
window.addEventListener('hashchange', () => { const h = location.hash.slice(1); if (h === 'candidatures') { loadCands().then(renderCands); } else if (h === 'examen' && !T.exam) renderExam(); else if (h === 'simulateur' && !T.sim) renderSim(); });
function applySub(){
  const {base, sub} = route();
  if (base === 'terrain') { const v = sub && T.guides.some(g => g.id === sub) ? sub : null; if (T.cur !== v) { T.cur = v; renderTerrain(); } }
  else if (base === 'labo') { const v = sub && casById(sub) ? sub : null; if (P.curCas !== v) { P.curCas = v; renderLabo(); } }
  else if (base === 'cours') { const v = sub && matOf(sub) ? sub : null; if (E.cur !== v) { E.cur = v; E.quiz = null; E.revue = null; if (v) { E.tab = E.nextTab || 'cours'; E.curCours = E.nextCours || null; } E.nextTab = null; E.nextCours = null; render(); } }
}
window.addEventListener('hashchange', () => { applySub(); window.scrollTo(0, 0); });
tInit();

/* =====================================================================
   MON CV, SCORE ATS, CV ADAPTÉ À L'OFFRE ET LETTRE DE MOTIVATION
   Tout est calculé sur l'appareil, sans IA.
   ===================================================================== */
const CV = {data: null, conf: {}, adapte: null, lettre: ''};
const STOP = new Set('les des une pour avec dans sur par aux est sont vous nous votre vos notre nos leur leurs ses son sa ces cette cet qui que quoi dont ainsi plus moins tres bien etre avoir fait faire afin entre chez sous tout tous toute toutes mais donc car comme aussi deja selon dont lors entre egalement notamment niveau poste profil missions mission recherche recherchons rejoindre equipe sein cadre seront serez ayant souhaite souhaitez travail travailler entreprise societe groupe annee annees mois jours semaine contrat temps plein partiel date debut lieu salaire selon experience experiences formation diplome bac minimum idealement apprecie appreciee souhaitee souhaite capacite capacites qualites aisance sens gout bonne bonnes excellente excellentes maitrise connaissance connaissances etc. vous-meme candidat candidate candidature cv lettre motivation description offre'.split(' '));
const VERBES_FAIBLES = [['participation a', 'Participé à → précisez votre rôle : « Coordonné », « Réalisé », « Piloté »'], ['aide a', '« Aide à » → « Contribué à… en réalisant… »'], ['j\'ai', 'Commencez par un verbe d\'action, sans « j\'ai »'], ['responsable de', '« Responsable de » → « Piloté… », « Géré… »'], ['en charge de', '« En charge de » → un verbe d\'action et un résultat']];

async function loadCV(){ await espaceReady; if (CV.data) return; try { CV.data = IDB.db ? await IDB.get('kv', 'cv') : null; } catch(e) {} CV.data = CV.data || {id: 'cv', nom: '', titre: '', email: '', tel: '', ville: '', lien: '', accroche: '', competences: '', outils: '', langues: '', interets: '', experiences: [], formations: [], brut: ''}; }
async function saveCV(){ CV.data.updatedAt = Date.now(); if (IDB.db) await IDB.put('kv', CV.data); }
const lines = t => String(t || '').split('\n').map(x => x.replace(/^[-•·*\s]+/, '').trim()).filter(Boolean);
function cvText(c){
  c = c || CV.data; if (!c) return '';
  const st = [c.nom, c.titre, [c.email, c.tel, c.ville, c.lien].filter(Boolean).join(' | '), c.accroche ? 'PROFIL\n' + c.accroche : '', lines(c.competences).length ? 'COMPÉTENCES\n' + lines(c.competences).join('\n') : '', lines(c.outils).length ? 'OUTILS\n' + lines(c.outils).join(', ') : '',
    arr(c.experiences).length ? 'EXPÉRIENCE PROFESSIONNELLE\n' + arr(c.experiences).map(x => [x.poste, [x.entreprise, x.lieu, x.dates].filter(Boolean).join(' – ')].filter(Boolean).join('\n') + '\n' + lines(x.missions).map(m => '- ' + m).join('\n')).join('\n\n') : '',
    arr(c.formations).length ? 'FORMATION\n' + arr(c.formations).map(x => [x.diplome, x.ecole, x.dates].filter(Boolean).join(' – ')).join('\n') : '', c.langues ? 'LANGUES\n' + c.langues : '', c.interets ? 'CENTRES D\'INTÉRÊT\n' + c.interets : ''].filter(Boolean).join('\n\n');
  return st.trim().length > 40 ? st : (c.brut || st);
}

/* ---------- Mots-clés d'une offre ---------- */
function offreTitre(text){ const t = (String(text).split('\n').map(x => x.trim()).find(Boolean) || ''); return t.replace(/\(?\s*[HhFf]\s*\/\s*[HhFf]\s*\)?/g, '').replace(/^(alternance|stage|cdi|cdd|apprentissage|contrat de professionnalisation)\s*[-–:]\s*/i, '').split(/\s[-–]\s/)[0].trim(); }
function motsCles(text){
  const raw = String(text || ''); const n = ' ' + norm(raw).replace(/[^a-z0-9'+ -]/g, ' ').replace(/\s+/g, ' ') + ' ';
  const K = new Map(); const add = (label, key, poids) => { key = key || norm(label); if (!K.has(key)) K.set(key, {label, key, poids}); };
  REFS.forEach(r => { if (n.includes(' ' + norm(r) + ' ') || n.includes(' ' + norm(r) + 's ')) add(r, norm(r), 3); });
  Object.values(MOTS).flat().forEach(m => { if (n.includes(' ' + m + ' ') || n.includes(' ' + m + 's ')) add(m, m, 2); });
  (raw.match(/\b[A-Z][A-Z0-9]{1,6}\b/g) || []).forEach(a => { if (!['H', 'F', 'HF'].includes(a)) add(a, norm(a), 2); });
  const words = n.trim().split(' ').filter(w => w.length >= 5 && !STOP.has(w) && !/^\d+$/.test(w)); const cnt = {};
  words.forEach(w => cnt[w] = (cnt[w] || 0) + 1);
  Object.entries(cnt).filter(([w, c]) => c >= 2).sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([w]) => { if (![...K.keys()].some(k => k.includes(w))) add(w, w, 1); });
  const toks = raw.split(/[^A-Za-zÀ-ÿ0-9'+-]+/).filter(Boolean);
  K.forEach(k => { const w = k.key.split(' ').length; for (let i = 0; i + w <= toks.length; i++) { const cand = toks.slice(i, i + w).join(' '); const nc = norm(cand); if (nc === k.key || nc === k.key + 's') { k.label = REFS.find(r => norm(r) === k.key) || (cand.length > 1 && cand === cand.toUpperCase() ? cand : cand.charAt(0).toLowerCase() + cand.slice(1)); break; } } });
  return [...K.values()].sort((a, b) => b.poids - a.poids).slice(0, 30);
}
const inTxt = (key, t) => { const n = ' ' + norm(t).replace(/[^a-z0-9'+ -]/g, ' ').replace(/\s+/g, ' ') + ' '; return n.includes(' ' + key + ' ') || n.includes(' ' + key + 's ') || (key.length > 6 && n.includes(key)); };

/* ---------- Score ATS ---------- */
function scoreATS(cvTxt, offreTxt){
  const K = motsCles(offreTxt), titre = offreTitre(offreTxt), n = norm(cvTxt);
  const ok = K.filter(k => inTxt(k.key, cvTxt)), manque = K.filter(k => !inTxt(k.key, cvTxt));
  const pk = K.length ? K.reduce((a, k) => a + (inTxt(k.key, cvTxt) ? k.poids : 0), 0) / K.reduce((a, k) => a + k.poids, 0) : 0;
  const motsTitre = norm(titre).split(/\s+/).filter(w => w.length > 2 && !STOP.has(w));
  const tHit = titre && n.includes(norm(titre)) ? 1 : motsTitre.length ? motsTitre.filter(w => n.includes(w)).length / motsTitre.length * 0.6 : 0;
  const sections = [['Expérience', /exp[ée]rience/i], ['Formation', /formation|dipl[oô]me|[ée]tudes/i], ['Compétences', /comp[ée]tences|skills/i]].map(([l, r]) => [l, r.test(cvTxt)]);
  const mail = /[\w.+-]+@[\w-]+\.[\w.]+/.test(cvTxt), tel = /(\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}/.test(cvTxt);
  const nbMots = cvTxt.trim().split(/\s+/).filter(Boolean).length;
  const det = [
    ['Mots-clés de l\'offre présents', Math.round(pk * 55), 55],
    ['Intitulé du poste repris', Math.round(tHit * 15), 15],
    ['Rubriques standard reconnues', Math.round(sections.filter(s => s[1]).length / 3 * 10), 10],
    ['Coordonnées lisibles (courriel et téléphone)', (mail ? 5 : 0) + (tel ? 5 : 0), 10],
    ['Longueur adaptée (250 à 900 mots)', nbMots >= 250 && nbMots <= 900 ? 10 : nbMots >= 150 && nbMots <= 1200 ? 5 : 0, 10]
  ];
  return {score: det.reduce((a, d) => a + d[1], 0), det, ok, manque, titre, sections, mail, tel, nbMots, K};
}
function drawATS(r, titre){
  const col = r.score >= 75 ? '' : r.score >= 55 ? 'o' : 'r';
  return '<div class="card"><div class="meta"><span class="pill ' + col + '">' + esc(titre || 'Score ATS') + '</span></div><div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap"><div style="font-family:var(--font-display);font-size:44px;font-weight:600">' + r.score + ' / 100</div><div class="progress">' + (r.score >= 75 ? 'Bonne correspondance : le CV a de bonnes chances de passer le premier tri.' : r.score >= 55 ? 'Correspondance moyenne : ajoutez les mots-clés manquants que vous maîtrisez réellement.' : 'Correspondance faible : le CV risque d\'être écarté par un tri automatique.') + '</div></div><div class="bar" style="margin:8px 0 14px"><span style="width:' + r.score + '%"></span></div>'
    + '<div class="tablewrap"><table><tbody>' + r.det.map(d => '<tr><td>' + esc(d[0]) + '</td><td class="num"><strong>' + d[1] + '</strong> / ' + d[2] + '</td></tr>').join('') + '</tbody></table></div>'
    + '<div class="grid two"><div><h4>Mots-clés présents (' + r.ok.length + ')</h4><div class="filters">' + (r.ok.map(k => '<span class="chip kw-ok">' + esc(k.label) + '</span>').join('') || '<span class="progress">Aucun</span>') + '</div></div><div><h4>Mots-clés absents (' + r.manque.length + ')</h4><div class="filters">' + (r.manque.map(k => '<span class="chip kw-no">' + esc(k.label) + '</span>').join('') || '<span class="progress">Aucun</span>') + '</div></div></div>'
    + (!r.mail || !r.tel ? '<p class="progress">' + (!r.mail ? 'Adresse électronique non détectée. ' : '') + (!r.tel ? 'Numéro de téléphone non détecté.' : '') + '</p>' : '') + '</div>';
}

/* ---------- Écran « Mon CV » ---------- */
async function renderCV(){
  const el = document.getElementById('cvRoot'); if (!el) return;
  await loadCV(); const c = CV.data;
  const f = (id, l, v, ph) => '<div class="row"><label for="' + id + '">' + l + '</label><input class="inp" id="' + id + '" data-cvf="' + id.slice(2) + '" value="' + esc(v || '') + '" placeholder="' + esc(ph || '') + '"></div>';
  const ta = (id, l, v, ph, h) => '<div class="row"><label for="' + id + '">' + l + '</label><textarea class="ta" id="' + id + '" data-cvf="' + id.slice(2) + '" style="min-height:' + (h || 80) + 'px" placeholder="' + esc(ph || '') + '">' + esc(v || '') + '</textarea></div>';
  el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Mon CV standard</h2><p class="lead">Saisissez votre CV une seule fois. Il sert ensuite à calculer votre score ATS et à produire un CV adapté à chaque offre. Il reste sur cet appareil.</p>'
    + '<div class="callout b"><strong>Qu\'est-ce qu\'un ATS ?</strong>Un logiciel de suivi des candidatures (Applicant Tracking System) utilisé par les recruteurs. Il lit le texte des CV, cherche les mots-clés de l\'offre et classe les candidatures. Un CV clair, sur une colonne, avec des rubriques classiques et les bons mots-clés, passe mieux ce premier tri.</div>'
    + '<div class="ctool"><label class="btn ghost" for="cvImport" tabindex="0">Importer mon CV (PDF ou Word)<input type="file" id="cvImport" accept=".pdf,.docx,.txt" hidden></label><a class="btn ghost" href="#offre">Analyser une offre avec ce CV →</a><span class="progress" id="cvState">' + (c.updatedAt ? 'Enregistré' : '') + '</span></div>'
    + '<div class="grid two"><div class="card"><h4>Identité</h4>' + f('cvnom', 'Prénom et nom', c.nom) + f('cvtitre', 'Titre du CV', c.titre, 'Ex. Chargé de mission RSE en alternance') + '<div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px">' + f('cvemail', 'Courriel', c.email) + f('cvtel', 'Téléphone', c.tel) + f('cvville', 'Ville', c.ville) + f('cvlien', 'LinkedIn ou site', c.lien) + '</div>' + ta('cvaccroche', 'Accroche (3 à 4 lignes)', c.accroche, 'Qui vous êtes, ce que vous apportez, ce que vous cherchez', 90) + '</div>'
    + '<div class="card"><h4>Compétences</h4>' + ta('cvcompetences', 'Compétences (une par ligne)', c.competences, 'Bilan carbone (méthode Bilan Carbone, GHG Protocol)\nAnalyse de double matérialité\nGestion de projet', 120) + ta('cvoutils', 'Outils (un par ligne)', c.outils, 'Excel\nPower BI', 70) + f('cvlangues', 'Langues', c.langues, 'Français (langue maternelle), anglais (B2)') + f('cvinterets', 'Centres d\'intérêt', c.interets) + '</div></div>'
    + '<h3>Expériences</h3><div id="cvExps">' + arr(c.experiences).map((x, i) => expBlock(x, i)).join('') + '</div><button class="btn ghost sm" data-cv="addExp">+ Ajouter une expérience</button>'
    + '<h3>Formations</h3><div id="cvForms">' + arr(c.formations).map((x, i) => '<div class="card cvblock"><div class="grid" style="grid-template-columns:2fr 2fr 1fr auto;gap:0 10px;align-items:end"><div class="row"><label>Diplôme</label><input class="inp" data-fo="' + i + '" data-k="diplome" value="' + esc(x.diplome || '') + '"></div><div class="row"><label>École</label><input class="inp" data-fo="' + i + '" data-k="ecole" value="' + esc(x.ecole || '') + '"></div><div class="row"><label>Dates</label><input class="inp" data-fo="' + i + '" data-k="dates" value="' + esc(x.dates || '') + '"></div><button class="linkbtn" style="color:var(--danger);margin-bottom:18px" data-cv="delForm" data-i="' + i + '">Retirer</button></div></div>').join('') + '</div><button class="btn ghost sm" data-cv="addForm">+ Ajouter une formation</button>'
    + '<details style="margin-top:22px"' + (c.brut && !c.experiences.length ? ' open' : '') + '><summary>Texte brut importé</summary><div class="inner"><p class="progress">Le texte de votre CV importé. Recopiez-en les éléments dans les rubriques ci-dessus : c\'est ce qui permet d\'adapter votre CV. Tant que les rubriques sont vides, le score ATS utilise ce texte.</p><textarea class="ta big" data-cvf="brut">' + esc(c.brut || '') + '</textarea></div></details>'
    + '<h3>Aperçu ATS de votre CV</h3><p class="progress">Voici le texte qu\'un logiciel de tri lit dans votre CV.</p><div class="tpl" id="cvPreview">' + esc(cvText()) + '</div>'
    + '<h3>Mon CV mis en page, avec photo</h3><p class="prose">La version à envoyer à un recruteur ou à imprimer : une page, deux colonnes, votre photo et la couleur de votre choix. Elle reprend automatiquement le contenu saisi ci-dessus. Pour les dépôts sur les sites d\'emploi et les logiciels de tri, gardez la version standard ci-dessus, plus lisible par les ATS.</p>'
    + '<div class="ctool cvdtools"><label class="btn ghost" for="cvPhoto" tabindex="0">' + (c.photo ? 'Changer la photo' : 'Ajouter ma photo') + '<input type="file" id="cvPhoto" accept="image/*" hidden></label>' + (c.photo ? '<button class="btn ghost" data-cv="delPhoto">Retirer la photo</button>' : '') + '<span class="cvcols">' + CVCOLS.map(([v, l]) => '<button class="cvcol' + ((c.couleur || CVCOLS[0][0]) === v ? ' on' : '') + '" style="background:' + v + '" data-cv="col" data-v="' + v + '" aria-label="Couleur ' + l + '" title="' + l + '"></button>').join('') + '</span><button class="btn" data-cv="pdfD">Enregistrer en PDF</button><button class="btn ghost" data-cv="docD">Télécharger en Word</button></div>'
    + '<div class="cvdwrap"><div id="cvDesign">' + cvDesign(c) + '</div></div>';
}
const CVCOLS = [['#0F5B3E', 'Vert'], ['#2357A6', 'Bleu'], ['#12241C', 'Noir'], ['#A8621A', 'Ocre'], ['#7A3E5B', 'Prune']];
function cvDesign(c){
  const col = c.couleur || CVCOLS[0][0], L = lines;
  const ini = String(c.nom || '').split(/\s+/).filter(Boolean).map(x => x[0]).slice(0, 2).join('').toUpperCase() || 'CV';
  const side = (t, body) => body ? '<div class="cvd-sb"><div class="cvd-st">' + t + '</div>' + body + '</div>' : '';
  return '<div class="cvd" style="--cvc:' + col + '"><div class="cvd-side">'
    + (c.photo ? '<img class="cvd-photo" src="' + c.photo + '" alt="Photo de ' + esc(c.nom || '') + '">' : '<div class="cvd-photo cvd-ini">' + esc(ini) + '</div>')
    + side('Contact', [c.email, c.tel, c.ville, c.lien].filter(Boolean).map(x => '<p>' + esc(x) + '</p>').join(''))
    + side('Compétences', L(c.competences).length ? '<ul>' + L(c.competences).map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '')
    + side('Outils', L(c.outils).length ? '<p>' + L(c.outils).map(esc).join(' · ') + '</p>' : '')
    + side('Langues', c.langues ? '<p>' + esc(c.langues) + '</p>' : '')
    + side('Centres d\'intérêt', c.interets ? '<p>' + esc(c.interets) + '</p>' : '')
    + '</div><div class="cvd-main"><h1>' + esc(c.nom || 'Prénom NOM') + '</h1><div class="cvd-t">' + esc(c.titre || 'Titre du CV') + '</div>'
    + (c.accroche ? '<div class="cvd-h">Profil</div><p class="cvd-p">' + esc(c.accroche) + '</p>' : '')
    + (arr(c.experiences).length ? '<div class="cvd-h">Expérience professionnelle</div>' + arr(c.experiences).map(x => '<div class="cvd-e"><div class="cvd-eh"><strong>' + esc(x.poste || '') + '</strong><span>' + esc(x.dates || '') + '</span></div><div class="cvd-em">' + esc([x.entreprise, x.lieu].filter(Boolean).join(' · ')) + '</div>' + (L(x.missions).length ? '<ul>' + L(x.missions).map(m => '<li>' + esc(m) + '</li>').join('') + '</ul>' : '') + '</div>').join('') : '')
    + (arr(c.formations).length ? '<div class="cvd-h">Formation</div>' + arr(c.formations).map(x => '<div class="cvd-e"><div class="cvd-eh"><strong>' + esc(x.diplome || '') + '</strong><span>' + esc(x.dates || '') + '</span></div><div class="cvd-em">' + esc(x.ecole || '') + '</div></div>').join('') : '')
    + '</div></div>';
}
function cvDesignWord(c){
  const col = c.couleur || CVCOLS[0][0], L = lines;
  const sb = (t, b) => b ? '<p style="color:#fff;font-weight:bold;text-transform:uppercase;font-size:9pt;margin:12pt 0 3pt;border-bottom:1px solid #fff">' + t + '</p>' + b : '';
  const side = (c.photo ? '<p style="text-align:center"><img src="' + c.photo + '" width="110" height="110"></p>' : '')
    + sb('Contact', [c.email, c.tel, c.ville, c.lien].filter(Boolean).map(x => '<p style="color:#fff;margin:0">' + esc(x) + '</p>').join(''))
    + sb('Compétences', L(c.competences).map(x => '<p style="color:#fff;margin:0 0 2pt">• ' + esc(x) + '</p>').join(''))
    + sb('Outils', L(c.outils).length ? '<p style="color:#fff;margin:0">' + L(c.outils).map(esc).join(' · ') + '</p>' : '')
    + sb('Langues', c.langues ? '<p style="color:#fff;margin:0">' + esc(c.langues) + '</p>' : '') + sb('Centres d\'intérêt', c.interets ? '<p style="color:#fff;margin:0">' + esc(c.interets) + '</p>' : '');
  const h = t => '<p style="color:' + col + ';font-weight:bold;text-transform:uppercase;font-size:10pt;margin:12pt 0 4pt;border-bottom:1px solid ' + col + '">' + t + '</p>';
  const main = '<p style="font-size:22pt;font-weight:bold;margin:0">' + esc(c.nom || '') + '</p><p style="color:' + col + ';font-size:13pt;font-weight:bold;margin:0 0 6pt">' + esc(c.titre || '') + '</p>'
    + (c.accroche ? h('Profil') + '<p style="text-align:justify">' + esc(c.accroche) + '</p>' : '')
    + (arr(c.experiences).length ? h('Expérience professionnelle') + arr(c.experiences).map(x => '<p style="margin:6pt 0 0"><b>' + esc(x.poste || '') + '</b> – ' + esc([x.entreprise, x.lieu, x.dates].filter(Boolean).join(' – ')) + '</p>' + L(x.missions).map(m => '<p style="margin:0 0 0 10pt;text-align:justify">• ' + esc(m) + '</p>').join('')).join('') : '')
    + (arr(c.formations).length ? h('Formation') + arr(c.formations).map(x => '<p style="margin:3pt 0"><b>' + esc(x.diplome || '') + '</b> – ' + esc([x.ecole, x.dates].filter(Boolean).join(' – ')) + '</p>').join('') : '');
  return '<table width="100%" cellspacing="0" cellpadding="12" style="border-collapse:collapse"><tr><td width="32%" valign="top" style="background:' + col + '">' + side + '</td><td valign="top">' + main + '</td></tr></table>';
}
function photoReduite(file){ return new Promise((res, rej) => { const img = new Image(); const u = URL.createObjectURL(file); img.onload = () => { const k = 360, sc = Math.max(k / img.width, k / img.height), w = img.width * sc, h = img.height * sc; const cv = document.createElement('canvas'); cv.width = k; cv.height = k; const x = cv.getContext('2d'); x.drawImage(img, (k - w) / 2, (k - h) / 2, w, h); URL.revokeObjectURL(u); res(cv.toDataURL('image/jpeg', 0.86)); }; img.onerror = () => { URL.revokeObjectURL(u); rej(new Error('image')); }; img.src = u; }); }
function expBlock(x, i){ return '<div class="card cvblock"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:0 10px"><div class="row"><label>Poste</label><input class="inp" data-ex="' + i + '" data-k="poste" value="' + esc(x.poste || '') + '"></div><div class="row"><label>Entreprise</label><input class="inp" data-ex="' + i + '" data-k="entreprise" value="' + esc(x.entreprise || '') + '"></div><div class="row"><label>Lieu</label><input class="inp" data-ex="' + i + '" data-k="lieu" value="' + esc(x.lieu || '') + '"></div><div class="row"><label>Dates</label><input class="inp" data-ex="' + i + '" data-k="dates" value="' + esc(x.dates || '') + '" placeholder="Ex. 2022 – 2024"></div></div><div class="row"><label>Missions et résultats (une par ligne, commencez par un verbe)</label><textarea class="ta" data-ex="' + i + '" data-k="missions" style="min-height:100px">' + esc(x.missions || '') + '</textarea></div><button class="linkbtn" style="color:var(--danger)" data-cv="delExp" data-i="' + i + '">Retirer cette expérience</button></div>'; }
let cvTimer = null;
let cvdT; document.getElementById('cvRoot').addEventListener('input', () => { clearTimeout(cvdT); cvdT = setTimeout(() => { const d = document.getElementById('cvDesign'); if (d && CV.data) d.innerHTML = cvDesign(CV.data); }, 400); });
function cvChanged(){ document.getElementById('cvState').textContent = 'Modifications en cours…'; clearTimeout(cvTimer); cvTimer = setTimeout(async () => { await saveCV(); const s = document.getElementById('cvState'); if (s) s.textContent = 'Enregistré'; const pv = document.getElementById('cvPreview'); if (pv) pv.textContent = cvText(); CV.adapte = null; }, 600); }
document.getElementById('cvRoot').addEventListener('input', e => {
  const t = e.target, c = CV.data;
  if (t.dataset.cvf) c[t.dataset.cvf] = t.value;
  else if (t.dataset.ex != null) c.experiences[+t.dataset.ex][t.dataset.k] = t.value;
  else if (t.dataset.fo != null) c.formations[+t.dataset.fo][t.dataset.k] = t.value;
  else return;
  cvChanged();
});
document.getElementById('cvRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-cv]'); if (!b) return;
  const a = b.dataset.cv, c = CV.data;
  if (a === 'pdfD') { printHtml(cvDesign(c)); return; }
  if (a === 'docD') { if (IN_PREVIEW) downloadDoc(cvDesignWord(c), 'CV ' + (c.nom || '')); else { downloadDocLegacy(cvDesignWord(c), 'CV ' + (c.nom || '')); toast('CV téléchargé en Word'); } return; }
  if (a === 'col') c.couleur = b.dataset.v;
  else if (a === 'delPhoto') c.photo = '';
  else if (a === 'addExp') c.experiences.push({poste: '', entreprise: '', lieu: '', dates: '', missions: ''});
  else if (a === 'delExp') c.experiences.splice(+b.dataset.i, 1);
  else if (a === 'addForm') c.formations.push({diplome: '', ecole: '', dates: ''});
  else if (a === 'delForm') c.formations.splice(+b.dataset.i, 1);
  await saveCV(); renderCV();
});
document.getElementById('cvRoot').addEventListener('change', async e => {
  if (e.target.id === 'cvPhoto' && e.target.files.length) { try { CV.data.photo = await photoReduite(e.target.files[0]); await saveCV(); renderCV(); toast('Photo ajoutée'); } catch(err) { toast('Image illisible'); } e.target.value = ''; return; }
  if (e.target.id !== 'cvImport' || !e.target.files.length) return;
  const f = e.target.files[0]; e.target.value = '';
  try { const ex = await extractText(f); CV.data.brut = tidy(ex.text); const m = CV.data.brut.match(/[\w.+-]+@[\w-]+\.[\w.]+/); if (m && !CV.data.email) CV.data.email = m[0]; const tl = CV.data.brut.match(/(\+33|0)\s?[1-9](?:[\s.-]?\d{2}){4}/); if (tl && !CV.data.tel) CV.data.tel = tl[0]; await saveCV(); toast(CV.data.brut ? 'Texte du CV importé' : 'Aucun texte lisible dans ce fichier'); renderCV(); }
  catch(err) { toast('Lecture du fichier impossible'); }
});

/* ---------- Étapes après l'analyse d'une offre ---------- */
async function drawSuite(){
  const box = document.getElementById('offreSuite'); if (!box || !T.offreRes) return;
  await loadCV();
  const txt = cvText();
  if (txt.trim().length < 80) { box.innerHTML = '<h3>Étape 2 : passer mon CV au crible ATS</h3><div class="callout b"><strong>Votre CV n\'est pas encore enregistré</strong>Saisissez ou importez votre CV standard une fois : l\'application calculera son score face à chaque offre et vous proposera une version adaptée. <a href="#cv">Saisir mon CV →</a></div>'; return; }
  const r = scoreATS(txt, T.offreTxt);
  r.K.forEach(k => { if (CV.conf[k.key] == null) CV.conf[k.key] = inTxt(k.key, txt); });
  box.innerHTML = '<h3>Étape 2 : mon CV passé au crible ATS</h3>' + drawATS(r, 'CV standard face à cette offre')
    + '<h3>Étape 3 : adapter mon CV à l\'offre</h3><div class="card"><h4>Quels mots-clés correspondent vraiment à votre profil ?</h4><p>Cochez uniquement ce que vous savez réellement faire ou avez réellement pratiqué (formation, stage, projet, expérience). Les éléments cochés seront intégrés à votre titre, votre accroche et vos compétences. Les autres restent à développer : <strong>n\'inventez jamais une compétence</strong>, l\'entretien le révélerait.</p><div class="kwgrid">' + r.K.map(k => '<label class="kwc"><input type="checkbox" data-conf="' + esc(k.key) + '"' + (CV.conf[k.key] ? ' checked' : '') + '> ' + esc(k.label) + (inTxt(k.key, txt) ? ' <span class="pill">déjà dans le CV</span>' : '') + '</label>').join('') + '</div><div class="ctool"><button class="btn" data-suite="adapt">Générer mon CV adapté</button></div></div><div id="cvAdapte"></div>';
  if (CV.adapte) drawAdapte();
}
function genAdapte(){
  const c = JSON.parse(JSON.stringify(CV.data)), K = motsCles(T.offreTxt), conf = K.filter(k => CV.conf[k.key]);
  const titre = offreTitre(T.offreTxt) || c.titre;
  const ent = (T.offreTxt.match(/(?:chez|rejoignez|rejoindre)\s+([A-Z][\w&'-]+(?:\s[A-Z][\w&'-]+){0,3})/) || [])[1] || '';
  const top = conf.filter(k => k.poids >= 2).slice(0, 4).map(k => k.label);
  const ac = c.accroche && c.accroche.trim();
  c.titre = titre + (/(alternance|apprenti)/i.test(T.offreTxt) && !/alternance/i.test(titre) ? ' en alternance' : '');
  c.accroche = (ac ? ac.replace(/\s+$/, '') + ' ' : '') + (top.length ? 'Compétences mobilisables pour ce poste : ' + top.join(', ') + '.' : '') + (ent ? ' Motivé(e) pour contribuer à la démarche de ' + ent + '.' : '');
  const comps = lines(c.competences);
  const prio = comps.filter(x => conf.some(k => inTxt(k.key, x))), rest = comps.filter(x => !prio.includes(x));
  const ajout = conf.filter(k => !comps.some(x => inTxt(k.key, x)) && !lines(c.outils).some(x => inTxt(k.key, x)) && k.poids >= 2).map(k => k.label.charAt(0).toUpperCase() + k.label.slice(1));
  c.competences = prio.concat(ajout, rest).join('\n');
  c.experiences = arr(c.experiences).map(x => { const ms = lines(x.missions); const sc = m => conf.filter(k => inTxt(k.key, m)).length; return Object.assign({}, x, {missions: ms.slice().sort((a, b) => sc(b) - sc(a)).join('\n')}); });
  const conseils = [];
  arr(CV.data.experiences).forEach(x => lines(x.missions).forEach(m => { const nm = norm(m); VERBES_FAIBLES.forEach(([v, t]) => { if (nm.startsWith(v)) conseils.push('« ' + m + ' » : ' + t); }); if (!/\d/.test(m)) {} }));
  const sansChiffre = arr(CV.data.experiences).flatMap(x => lines(x.missions)).filter(m => !/\d/.test(m)).length;
  CV.adapte = {cv: c, ajout, conseils, sansChiffre, ent};
}
function cvHtml(c, kws){
  const hl = s => { let h = esc(s); arr(kws).forEach(k => { if (k.label.length > 2) h = h.replace(new RegExp('(' + k.label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<b>$1</b>'); }); return h; };
  return '<div class="cvdoc"><h1>' + esc(c.nom || 'Prénom NOM') + '</h1><div class="cvt">' + esc(c.titre || '') + '</div><div class="cvc">' + esc([c.email, c.tel, c.ville, c.lien].filter(Boolean).join(' · ')) + '</div>'
    + (c.accroche ? '<h2>Profil</h2><p>' + hl(c.accroche) + '</p>' : '')
    + (lines(c.competences).length ? '<h2>Compétences</h2><ul>' + lines(c.competences).map(x => '<li>' + hl(x) + '</li>').join('') + '</ul>' : '')
    + (lines(c.outils).length ? '<p><strong>Outils :</strong> ' + lines(c.outils).map(esc).join(', ') + '</p>' : '')
    + (arr(c.experiences).length ? '<h2>Expérience professionnelle</h2>' + arr(c.experiences).map(x => '<h3>' + esc(x.poste || '') + '</h3><div class="cvm">' + esc([x.entreprise, x.lieu, x.dates].filter(Boolean).join(' – ')) + '</div><ul>' + lines(x.missions).map(m => '<li>' + hl(m) + '</li>').join('') + '</ul>').join('') : '')
    + (arr(c.formations).length ? '<h2>Formation</h2>' + arr(c.formations).map(x => '<p><strong>' + esc(x.diplome || '') + '</strong> – ' + esc([x.ecole, x.dates].filter(Boolean).join(' – ')) + '</p>').join('') : '')
    + (c.langues ? '<h2>Langues</h2><p>' + esc(c.langues) + '</p>' : '') + (c.interets ? '<h2>Centres d\'intérêt</h2><p>' + esc(c.interets) + '</p>' : '') + '</div>';
}
function drawAdapte(){
  const box = document.getElementById('cvAdapte'); if (!box || !CV.adapte) return;
  const A = CV.adapte, avant = scoreATS(cvText(), T.offreTxt), apres = scoreATS(cvText(A.cv), T.offreTxt), K = motsCles(T.offreTxt).filter(k => CV.conf[k.key]);
  const nonConf = motsCles(T.offreTxt).filter(k => !CV.conf[k.key]);
  box.innerHTML = '<div class="tiles"><div class="tile"><div class="big">' + avant.score + '</div><div class="lbl">score ATS du CV standard</div></div><div class="tile"><div class="big" style="color:var(--accent)">' + apres.score + '</div><div class="lbl">score ATS du CV adapté</div></div><div class="tile"><div class="big">' + A.ajout.length + '</div><div class="lbl">compétences ajoutées (validées par vous)</div></div></div>'
    + '<div class="ctool"><button class="btn" data-suite="word">Télécharger en Word</button><button class="btn ghost" data-suite="pdf">Imprimer ou enregistrer en PDF</button><button class="btn ghost" data-suite="copy">Copier le texte</button></div>'
    + '<div class="card cvwrap">' + cvHtml(A.cv, K) + '</div>'
    + (A.conseils.length || A.sansChiffre ? '<div class="callout"><strong>Pour aller plus loin, à faire vous-même</strong>' + (A.sansChiffre ? A.sansChiffre + ' mission' + (A.sansChiffre > 1 ? 's' : '') + ' sans aucun chiffre : ajoutez un résultat mesurable (nombre de personnes, budget, pourcentage, délai) quand c\'est possible.<br>' : '') + A.conseils.slice(0, 6).map(esc).join('<br>') + '</div>' : '')
    + (nonConf.length ? '<div class="callout b"><strong>Compétences demandées à développer</strong>' + nonConf.map(k => esc(k.label)).join(', ') + '. Préparez-vous avec les cas pratiques et les guides, et mentionnez-les en entretien comme des axes de progression.</div>' : '')
    + '<h3>Étape 4 : ma lettre de motivation adaptée</h3><div class="card"><p class="progress">Une base à personnaliser : complétez les crochets et relisez-la à voix haute.</p><textarea class="ta big" id="lettreTa" style="min-height:360px">' + esc(CV.lettre || genLettre()) + '</textarea><div class="ctool"><button class="btn" data-suite="lettreWord">Télécharger la lettre en Word</button><button class="btn ghost" data-suite="lettreCopy">Copier</button><button class="btn ghost" data-suite="lettreReset">Régénérer</button></div></div>';
  document.getElementById('lettreTa').addEventListener('input', e => { CV.lettre = e.target.value; });
}
function genLettre(){
  const c = CV.adapte.cv, K = motsCles(T.offreTxt).filter(k => CV.conf[k.key] && k.poids >= 2).slice(0, 3).map(k => k.label);
  const exp = arr(CV.data.experiences)[0], m1 = exp ? lines(exp.missions)[0] : '';
  const ent = CV.adapte.ent || '[nom de l\'entreprise]', poste = offreTitre(T.offreTxt) || '[intitulé du poste]';
  return (c.nom || '[Prénom NOM]') + '\n' + [c.ville, c.email, c.tel].filter(Boolean).join(' – ') + '\n\n' + ent + '\n[Adresse]\n\n[Ville], le ' + new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) + '\n\nObjet : Candidature au poste de ' + poste + '\n\nMadame, Monsieur,\n\n'
    + 'Votre offre de ' + poste + ' a retenu toute mon attention, car elle correspond précisément au métier auquel je me forme et que je souhaite exercer. [Une phrase sur ce qui vous attire chez ' + ent + ' : une démarche, un engagement, une actualité précise.]\n\n'
    + (exp ? 'Lors de mon expérience de ' + (exp.poste || '[poste]') + (exp.entreprise ? ' chez ' + exp.entreprise : '') + ', j\'ai ' + (m1 ? m1.charAt(0).toLowerCase() + m1.slice(1).replace(/\.$/, '') : '[réalisation concrète avec un résultat]') + '. ' : '[Votre expérience la plus pertinente, avec un résultat chiffré.] ')
    + (K.length ? 'Je peux mettre ces acquis au service de vos missions, notamment sur ' + K.join(', ') + '. ' : '') + '[Une réalisation de formation ou de projet en lien direct avec l\'offre : par exemple un bilan carbone ou une analyse de double matérialité.]\n\n'
    + 'Rigoureux(se) et à l\'aise pour fédérer des équipes autour de projets transverses, je souhaite contribuer concrètement à [objectif de l\'entreprise ou du poste]. ' + (/alternance|apprenti/i.test(T.offreTxt) ? 'Mon rythme d\'alternance est le suivant : [rythme école / entreprise].' : '') + '\n\n'
    + 'Je serais heureux(se) de vous présenter ma motivation lors d\'un entretien.\n\nJe vous prie d\'agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.\n\n' + (c.nom || '[Prénom NOM]');
}
function downloadDocLegacy(html, name){
  const doc = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>' + esc(name) + '</title><style>body{font-family:Calibri,Arial,sans-serif;font-size:11pt;line-height:1.35}h1{font-size:20pt;text-align:center;margin:0}.cvt{text-align:center;font-size:13pt;color:#1d6a50;font-weight:bold}.cvc{text-align:center;color:#555;margin-bottom:8pt}h2{font-size:12pt;color:#1d6a50;border-bottom:1px solid #1d6a50;margin:12pt 0 4pt;text-transform:uppercase}h3{font-size:11pt;margin:8pt 0 0}.cvm{color:#555;font-style:italic}p,li{text-align:justify}</style></head><body>' + html + '</body></html>';
  saveBlob(new Blob(['\ufeff', doc], {type: 'application/msword'}), nomFichier(name, '.doc'));
}
function downloadDoc(html, name){ return telechargerWord(html, name); }
function printHtml(html, nom){ choixExport(html, nom); }
document.getElementById('offreRoot').addEventListener('change', e => { const c = e.target.closest('[data-conf]'); if (c) { CV.conf[c.dataset.conf] = c.checked; } });
document.getElementById('offreRoot').addEventListener('click', async e => {
  const b = e.target.closest('[data-suite]'); if (!b) return;
  const a = b.dataset.suite, fname = 'CV ' + ((CV.data && CV.data.nom) || '') + ' - ' + (offreTitre(T.offreTxt) || 'offre');
  if (a === 'adapt') { genAdapte(); CV.lettre = ''; drawAdapte(); document.getElementById('cvAdapte').scrollIntoView({behavior: 'smooth', block: 'start'}); }
  else if (a === 'word') downloadDoc(cvHtml(CV.adapte.cv, []), fname.trim());
  else if (a === 'pdf') printHtml(cvHtml(CV.adapte.cv, []));
  else if (a === 'copy') { try { await navigator.clipboard.writeText(cvText(CV.adapte.cv)); toast('CV copié'); } catch(err) { toast('Copie impossible'); } }
  else if (a === 'lettreWord') downloadDoc('<div>' + esc(document.getElementById('lettreTa').value).split('\n').map(l => '<p>' + (l || '&nbsp;') + '</p>').join('') + '</div>', 'Lettre de motivation - ' + (offreTitre(T.offreTxt) || 'offre'));
  else if (a === 'lettreCopy') { try { await navigator.clipboard.writeText(document.getElementById('lettreTa').value); toast('Lettre copiée'); } catch(err) { toast('Copie impossible'); } }
  else if (a === 'lettreReset') { CV.lettre = ''; document.getElementById('lettreTa').value = genLettre(); }
});
window.addEventListener('hashchange', () => { if (location.hash === '#cv') renderCV(); else if (location.hash === '#offre') drawSuite(); });
loadCV().then(() => { renderCV(); });
buildIndex();
show(location.hash.slice(1) || 'accueil');


/* =====================================================================
   ACTUALITÉS ET AGENDA RSE
   data/actualites.json est complété chaque jour par le robot GitHub
   (tools/maj-actualites.mjs). L'application le relit à l'ouverture,
   puis toutes les 30 minutes tant qu'elle reste ouverte.
   ===================================================================== */
const A = {arts: [], agenda: [], maj: '', zone: 'Tous', theme: 'Tous', q: '', tab: 'actus', ag: 'avenir', nouveaux: new Set(), charge: false};
const ZONES = ['Tous', 'France', 'UE', 'Monde'];
const ZLAB = {France: 'France', UE: 'Union européenne', Monde: 'Monde'};
const ZCOL = {France: 'o', UE: 'b', Monde: ''};
const MOIS = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
const dFr = iso => { const [y, m, d] = String(iso).split('-').map(Number); return d + ' ' + MOIS[m - 1] + ' ' + y; };
const ajd = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const jours = (a, b) => Math.round((Date.parse(b) - Date.parse(a)) / 864e5);
const cleVu = a => (a.ajoute || a.date) + '|' + a.id;
const safeUrl = u => /^https?:\/\//i.test(u || '') ? u : '';

async function chargerActus(silencieux){
  try {
    const d = await fetch('data/actualites.json', {cache: 'no-cache'}).then(r => r.json());
    A.arts = arr(d.articles).slice().sort((a, b) => b.date.localeCompare(a.date));
    A.agenda = arr(d.agenda).slice().sort((a, b) => a.debut.localeCompare(b.debut));
    A.maj = d.maj || '';
    A.charge = true;
  } catch(e) { if (!silencieux) toast('Actualités indisponibles pour le moment'); return; }
  let vu = LS.get('actu-vu');
  if (!vu) { const d = new Date(Date.now() - 7 * 864e5); vu = d.toISOString().slice(0, 10); }
  A.nouveaux = new Set(A.arts.filter(a => cleVu(a) > vu).map(a => a.id));
  badgeActus(); renderActus(); renderDashActu(); notifierActus();
}
function marquerVu(){ if (!A.arts.length) return; const max = A.arts.map(cleVu).sort().pop(); LS.set('actu-vu', max); badgeActus(0); }
function badgeActus(force){
  const n = force === 0 ? 0 : A.nouveaux.size;
  const a = document.querySelector('#nav a[data-id="actualites"]');
  if (a) { let b = a.querySelector('.nbadge'); if (n) { if (!b) { b = document.createElement('span'); b.className = 'nbadge'; a.appendChild(b); } b.textContent = n; } else if (b) b.remove(); }
  const h = document.querySelector('#bottomnav a[data-g="veille"]'); if (h) h.classList.toggle('dot', !!n); try { renderDash(); } catch(e) {}
}

/* ---------- Notifications ---------- */
const notifOK = () => 'Notification' in window;
async function activerNotifs(){
  if (!notifOK()) { modal('Notifications non prises en charge', '<p>Ce navigateur ne permet pas les notifications. Sur Android, utilisez Chrome et installez l\'application (menu ⋮ puis « Ajouter à l\'écran d\'accueil »). Sur iPhone, les notifications web ne fonctionnent qu\'après installation sur l\'écran d\'accueil (iOS 16.4 ou plus).</p>', 'Compris', () => {}); return; }
  const p = await Notification.requestPermission();
  if (p === 'granted') { LS.set('actu-notif', '1'); toast('Notifications activées'); envoyerNotif('SERIKI BIBLE RSE', 'Les notifications sont activées. Vous serez prévenu des actualités importantes.', 'test'); }
  else { LS.set('actu-notif', '0'); toast('Notifications refusées : modifiable dans les réglages du navigateur'); }
  renderActus();
}
function desactiverNotifs(){ LS.set('actu-notif', '0'); toast('Notifications désactivées'); renderActus(); }
const notifActives = () => notifOK() && Notification.permission === 'granted' && LS.get('actu-notif') === '1';
async function envoyerNotif(titre, corps, tag){
  const opt = {body: corps, tag: tag, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', data: {url: '#actualites'}};
  try { const reg = navigator.serviceWorker && await navigator.serviceWorker.getRegistration(); if (reg && reg.showNotification) { await reg.showNotification(titre, opt); return; } } catch(e) {}
  try { const n = new Notification(titre, opt); n.onclick = () => { window.focus(); location.hash = 'actualites'; }; } catch(e) {}
}
function notifierActus(){
  const nouv = A.arts.filter(a => A.nouveaux.has(a.id));
  if (!nouv.length) return;
  const deja = new Set((LS.get('actu-notifies') || '').split(',').filter(Boolean));
  const aNotifier = nouv.filter(a => !deja.has(a.id));
  if (!aNotifier.length) return;
  const fortes = aNotifier.filter(a => a.importance === 'haute');
  if (route().base !== 'actualites') toast(aNotifier.length + ' nouvelle' + (aNotifier.length > 1 ? 's' : '') + ' actualité' + (aNotifier.length > 1 ? 's' : '') + ' RSE · voir Actualités', 4500);
  if (notifActives() && fortes.length) {
    if (fortes.length === 1) envoyerNotif('Actualité RSE · ' + (ZLAB[fortes[0].zone] || fortes[0].zone), fortes[0].titre, fortes[0].id);
    else envoyerNotif(fortes.length + ' actualités RSE importantes', fortes.slice(0, 3).map(a => '• ' + a.titre).join('\n'), 'lot-' + ajd());
  }
  aNotifier.forEach(a => deja.add(a.id));
  LS.set('actu-notifies', [...deja].slice(-300).join(','));
}

/* ---------- Agenda ---------- */
function etatEvt(e){
  const t = ajd(), fin = e.fin || e.debut;
  if (fin < t) return {cl: 'g', txt: 'Terminé'};
  if (e.debut <= t) return {cl: '', txt: 'En cours'};
  const j = jours(t, e.debut);
  return {cl: j <= 14 ? 'o' : 'b', txt: j === 1 ? 'Demain' : 'Dans ' + j + ' jours'};
}
const periode = e => e.fin && e.fin !== e.debut ? (e.debut.slice(0, 7) === e.fin.slice(0, 7) ? Number(e.debut.slice(8)) + ' au ' + dFr(e.fin) : dFr(e.debut) + ' au ' + dFr(e.fin)) : dFr(e.debut);
function icsFile(evts, nom){
  const d = s => s.replace(/-/g, '');
  const txt = s => String(s || '').replace(/[,;\\]/g, m => '\\' + m).replace(/\n/g, '\\n');
  const st = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z';
  const L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SERIKI BIBLE RSE//FR'];
  evts.forEach((e, k) => { const fin = new Date(Date.parse(e.fin || e.debut) + 864e5).toISOString().slice(0, 10); L.push('BEGIN:VEVENT', 'UID:' + d(e.debut) + '-' + k + '-' + String(e.titre).length + '@seriki-bible-rse', 'DTSTAMP:' + st, 'DTSTART;VALUE=DATE:' + d(e.debut), 'DTEND;VALUE=DATE:' + d(fin), 'SUMMARY:' + txt(e.titre), 'LOCATION:' + txt(e.lieu), 'DESCRIPTION:' + txt((e.resume || '') + (e.url ? ' ' + e.url : '')), 'END:VEVENT'); });
  L.push('END:VCALENDAR');
  saveBlob(new Blob([L.join('\r\n')], {type: 'text/calendar'}), String(nom).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '') + '.ics');
}
function ics(e){ icsFile([e], e.titre); }
const evtCard = (e, i) => { const s = etatEvt(e); const u = safeUrl(e.url); return '<div class="card evt"><div class="meta"><span class="pill ' + s.cl + '">' + s.txt + '</span><span class="pill ' + (ZCOL[e.zone] || '') + '">' + esc(ZLAB[e.zone] || e.zone) + '</span><span class="pill g">' + esc(e.type || 'Événement') + '</span></div><h4>' + esc(e.titre) + '</h4><div class="evt-q">' + esc(periode(e)) + ' · ' + esc(e.lieu || '') + '</div>' + (e.resume ? '<p>' + esc(e.resume) + '</p>' : '') + '<div class="ctool">' + (s.txt !== 'Terminé' ? '<button class="btn ghost sm" data-act="ics" data-i="' + i + '">Ajouter à mon agenda</button>' : '') + (u ? '<a class="linkbtn" href="' + esc(u) + '" target="_blank" rel="noopener">Site officiel →</a>' : '') + '</div></div>'; };

/* ---------- Page Actualités ---------- */
function filtreActus(){
  const q = norm(A.q.trim());
  return A.arts.filter(a => (A.zone === 'Tous' || a.zone === A.zone) && (A.theme === 'Tous' || a.theme === A.theme) && (!q || norm(a.titre + ' ' + a.resume + ' ' + (a.impact || '') + ' ' + a.source).includes(q)));
}
function artCard(a){
  const u = safeUrl(a.url), nv = A.nouveaux.has(a.id);
  return '<article class="card actu' + (a.importance === 'haute' ? ' fort' : '') + '"><div class="meta">' + (nv ? '<span class="pill r">Nouveau</span>' : '') + '<span class="pill ' + (ZCOL[a.zone] || '') + '">' + esc(ZLAB[a.zone] || a.zone) + '</span><span class="pill g">' + esc(a.theme) + '</span>' + (a.importance === 'haute' ? '<span class="pill o">Important</span>' : '') + '<span class="actu-d">' + dFr(a.date) + '</span></div>'
    + '<h4>' + esc(a.titre) + '</h4><p>' + esc(a.resume) + '</p>'
    + (a.impact ? '<div class="callout g"><strong>Ce que ça change pour votre métier</strong>' + esc(a.impact) + '</div>' : '')
    + '<div class="actu-src">Source : ' + esc(a.source) + (a.curated === false ? ' · <em>veille automatique, à vérifier à la source</em>' : '') + (u ? ' · <a href="' + esc(u) + '" target="_blank" rel="noopener">Lire l\'article →</a>' : '') + '</div></article>';
}
function renderActus(){
  const el = document.getElementById('actuRoot'); if (!el) return;
  if (!A.charge) { el.innerHTML = '<div class="eyebrow">VEILLE</div><h2>Actualités et agenda RSE</h2><p class="lead">Chargement…</p>'; return; }
  const themes = ['Tous', ...new Set(A.arts.map(a => a.theme))];
  const t = ajd();
  const avenir = A.agenda.filter(e => (e.fin || e.debut) >= t), passes = A.agenda.filter(e => (e.fin || e.debut) < t).reverse();
  const nb = A.nouveaux.size;
  let h = '<div class="eyebrow">VEILLE · MISE À JOUR DU ' + (A.maj ? dFr(A.maj).toUpperCase() : '—') + '</div><h2>Actualités et agenda RSE</h2>'
    + '<p class="lead">L\'actualité de la RSE, du climat et de la finance durable en France, dans l\'Union européenne et dans le monde, avec pour chaque information importante ce qu\'elle change concrètement pour votre métier. Les COP, salons et colloques à venir sont dans l\'agenda.</p>';
  const on = notifActives();
  h += '<div class="notifbar"><div><strong>' + (on ? 'Notifications activées' : 'Être prévenu des actualités importantes') + '</strong><span>' + (on ? 'Vous recevrez une notification sur cet appareil lorsqu\'une actualité importante arrive, à l\'ouverture de l\'application ou tant qu\'elle reste ouverte.' : 'Recevez une notification sur cet appareil lorsqu\'une actualité importante est publiée.') + '</span></div>' + (on ? '<button class="btn ghost sm" data-act="notifOff">Désactiver</button>' : '<button class="btn sm" data-act="notifOn">Activer les notifications</button>') + '</div>';
  h += '<div class="ctabs" role="tablist"><button class="ctab' + (A.tab === 'actus' ? ' on' : '') + '" data-act="tab" data-t="actus">Actualités' + (nb ? '<span class="cnt">' + nb + ' nouv.</span>' : '') + '</button><button class="ctab' + (A.tab === 'agenda' ? ' on' : '') + '" data-act="tab" data-t="agenda">Agenda<span class="cnt">' + avenir.length + '</span></button></div>';
  if (A.tab === 'actus') {
    const L = filtreActus();
    h += '<div class="filters">' + ZONES.map(z => '<button class="chip' + (A.zone === z ? ' on' : '') + '" data-act="zone" data-z="' + z + '">' + (z === 'Tous' ? 'Tout' : ZLAB[z]) + '</button>').join('') + '</div>'
      + '<div class="actu-f"><select class="inp" id="actuTheme" aria-label="Thème">' + themes.map(x => '<option' + (A.theme === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select><input class="inp" id="actuQ" type="search" placeholder="Chercher dans l\'actualité : CSRD, COP31, vigilance…" value="' + esc(A.q) + '"></div>'
      + '<div class="progress">' + L.length + ' actualité' + (L.length > 1 ? 's' : '') + '</div>'
      + (L.length ? L.map(artCard).join('') : '<p class="lead">Aucune actualité ne correspond à ces filtres.</p>');
  } else {
    h += '<div class="filters"><button class="chip' + (A.ag === 'avenir' ? ' on' : '') + '" data-act="ag" data-a="avenir">À venir (' + avenir.length + ')</button><button class="chip' + (A.ag === 'passes' ? ' on' : '') + '" data-act="ag" data-a="passes">Passés (' + passes.length + ')</button></div>';
    const L = A.ag === 'avenir' ? avenir : passes;
    h += '<div class="grid two">' + L.map(e => evtCard(e, A.agenda.indexOf(e))).join('') + '</div>';
  }
  h += '<div class="callout b"><strong>Comment cette page se met à jour</strong>Les actualités marquées d\'un encadré « Ce que ça change pour votre métier » sont rédigées et vérifiées. Les autres sont ajoutées chaque matin par un robot de veille qui lit les flux de médias spécialisés et d\'institutions : vérifiez-les toujours à la source avant de les citer.</div>';
  el.innerHTML = h;
}
function renderDashActu(){
  const el = document.getElementById('dashActu'); if (!el || !A.charge) return;
  const t = ajd();
  const prochain = A.agenda.find(e => (e.fin || e.debut) >= t);
  const une = A.arts.filter(a => a.importance === 'haute').slice(0, 3);
  const nb = A.nouveaux.size;
  let h = '<h3 class="dash-h">À la une' + (nb ? ' <span class="pill r">' + nb + ' nouvelle' + (nb > 1 ? 's' : '') + '</span>' : '') + '</h3><div class="grid two">';
  h += une.map(a => '<a class="card hubcard" href="#actualites"><div class="meta"><span class="pill ' + (ZCOL[a.zone] || '') + '">' + esc(ZLAB[a.zone] || a.zone) + '</span><span class="actu-d">' + dFr(a.date) + '</span></div><h4>' + esc(a.titre) + '</h4></a>').join('');
  if (prochain) { const s = etatEvt(prochain); h += '<a class="card hubcard" href="#actualites--agenda"><div class="meta"><span class="pill ' + s.cl + '">' + s.txt + '</span><span class="pill g">Agenda</span></div><h4>' + esc(prochain.titre) + '</h4><p>' + esc(periode(prochain)) + ' · ' + esc(prochain.lieu || '') + '</p></a>'; }
  h += '</div><p style="text-align:center"><a class="btn ghost" href="#actualites">Toute l\'actualité et l\'agenda</a></p>';
  el.innerHTML = h;
}
document.getElementById('actuRoot').addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'tab') { location.hash = b.dataset.t === 'agenda' ? 'actualites--agenda' : 'actualites'; }
  else if (a === 'zone') { A.zone = b.dataset.z; renderActus(); }
  else if (a === 'ag') { A.ag = b.dataset.a; renderActus(); }
  else if (a === 'ics') ics(A.agenda[+b.dataset.i]);
  else if (a === 'notifOn') activerNotifs();
  else if (a === 'notifOff') desactiverNotifs();
});
document.getElementById('actuRoot').addEventListener('change', e => { if (e.target.id === 'actuTheme') { A.theme = e.target.value; renderActus(); } });
document.getElementById('actuRoot').addEventListener('input', e => { if (e.target.id === 'actuQ') { A.q = e.target.value; const pos = e.target.selectionStart; renderActus(); const i = document.getElementById('actuQ'); i.focus(); try { i.setSelectionRange(pos, pos); } catch(x) {} } });
function routeActus(){
  const {base, sub} = route();
  if (base !== 'actualites') return;
  const t = sub === 'agenda' ? 'agenda' : 'actus';
  if (A.tab !== t) { A.tab = t; }
  renderActus();
  marquerVu();
}
window.addEventListener('hashchange', routeActus);
chargerActus().then(routeActus);
setInterval(() => chargerActus(true).then(() => { if (route().base === 'actualites') marquerVu(); }), 30 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && A.charge && Date.now() - (A.dern || 0) > 10 * 60 * 1000) { A.dern = Date.now(); chargerActus(true); } });


/* =====================================================================
   ANNUAIRE RSE DES ENTREPRISES
   Données officielles en direct : API Recherche d'entreprises (État, DINUM),
   toutes les entreprises françaises, sans clé. Analyse RSE calculée sur
   l'appareil à partir du secteur, de la taille et des signaux publics.
   ===================================================================== */
const N = {ref: null, res: [], total: 0, page: 1, f: {q: '', departement: '', section: '', cat: '', sig: {}}, busy: false, err: '', cache: {}, cibles: [], tab: 'chercher', cur: null, mode: 'alternance', prof: {}};
const API_ENT = 'https://recherche-entreprises.api.gouv.fr/search';
const TRANCHES = {'00': [0, '0 salarié'], '01': [1, '1 ou 2 salariés'], '02': [3, '3 à 5 salariés'], '03': [6, '6 à 9 salariés'], '11': [10, '10 à 19 salariés'], '12': [20, '20 à 49 salariés'], '21': [50, '50 à 99 salariés'], '22': [100, '100 à 199 salariés'], '31': [200, '200 à 249 salariés'], '32': [250, '250 à 499 salariés'], '41': [500, '500 à 999 salariés'], '42': [1000, '1 000 à 1 999 salariés'], '51': [2000, '2 000 à 4 999 salariés'], '52': [5000, '5 000 à 9 999 salariés'], '53': [10000, '10 000 salariés et plus']};
const SIGNAUX = [
  ['est_societe_mission', 'Société à mission', 'Raison d\'être et objectifs sociaux et environnementaux inscrits dans les statuts, contrôlés par un organisme tiers indépendant.'],
  ['est_ess', 'Économie sociale et solidaire', 'Entreprise de l\'ESS (association, coopérative, mutuelle, fondation ou société commerciale de l\'ESS).'],
  ['egapro_renseignee', 'Index de l\'égalité déclaré', 'L\'entreprise a déclaré son index de l\'égalité professionnelle femmes-hommes.'],
  ['bilan_ges_renseigne', 'Bilan GES publié', 'Un bilan des émissions de gaz à effet de serre a été déposé sur la plateforme de l\'ADEME.'],
  ['est_achats_responsables', 'Label achats responsables', 'Labellisée pour ses relations fournisseurs et ses achats responsables.'],
  ['est_rge', 'RGE', 'Reconnu garant de l\'environnement : qualification pour les travaux de rénovation énergétique.'],
  ['est_bio', 'Certifiée bio', 'Au moins un établissement certifié en agriculture biologique.'],
  ['est_siae', 'Insertion par l\'activité économique', 'Structure d\'insertion qui emploie des personnes éloignées de l\'emploi.'],
  ['est_patrimoine_vivant', 'Entreprise du patrimoine vivant', 'Label d\'État des savoir-faire artisanaux et industriels d\'excellence.']
];
const FILTRES_SIG = ['est_societe_mission', 'est_ess', 'egapro_renseignee', 'bilan_ges_renseigne', 'est_rge', 'est_bio'];
const lc = s => s ? s.charAt(0).toLowerCase() + s.slice(1) : '';
const fmtEur = v => v == null ? '' : (Math.abs(v) >= 1e9 ? (v / 1e9).toLocaleString('fr-FR', {maximumFractionDigits: 1}) + ' Md€' : Math.abs(v) >= 1e6 ? (v / 1e6).toLocaleString('fr-FR', {maximumFractionDigits: 1}) + ' M€' : Math.round(v).toLocaleString('fr-FR') + ' €');

async function nInit(){
  try { N.ref = await fetch('data/entreprises.json', {cache: 'no-cache'}).then(r => r.json()); } catch(e) { N.ref = null; }
  try { const k = IDB.db && await IDB.get('kv', 'cibles'); N.cibles = k ? arr(k.liste) : []; } catch(e) { N.cibles = []; }
  renderEnt(); nRoute();
  try { renderSecteurs(); renderDiag(); } catch(e) {}
}
async function saveCibles(){ try { await IDB.put('kv', {id: 'cibles', liste: N.cibles, updatedAt: Date.now()}); } catch(e) { toast('Enregistrement impossible sur cet appareil'); } }
const profilDe = id => N.ref && N.ref.profils.find(p => p.id === id);
const profilNaf = naf => { const d = String(naf || '').slice(0, 2); return N.ref && (N.ref.profils.find(p => p.div.includes(d)) || N.ref.profils.find(p => p.id === 'conseil')); };

/* ---------- Normalisation d'un résultat officiel ---------- */
function normEnt(r){
  const s = r.siege || {}, c = r.complements || {}, t = TRANCHES[r.tranche_effectif_salarie] || null;
  const fin = r.finances && typeof r.finances === 'object' ? Object.entries(r.finances).filter(([, v]) => v && v.ca != null).sort((a, b) => b[0].localeCompare(a[0]))[0] : null;
  const sig = {}; SIGNAUX.forEach(([k]) => { sig[k] = !!c[k]; });
  return {type: 'fr', id: r.siren, siren: r.siren, nom: r.nom_complet || r.nom_raison_sociale || 'Entreprise', naf: r.activite_principale || s.activite_principale || '', section: r.section_activite_principale || '',
    cat: r.categorie_entreprise || '', eff: t ? t[0] : null, effLabel: t ? t[1] : 'Effectif non communiqué', effAnnee: r.annee_tranche_effectif_salarie || '',
    ville: s.libelle_commune || '', cp: s.code_postal || '', dep: s.departement || '', adresse: s.adresse || '', creation: r.date_creation || '',
    etabs: r.nombre_etablissements_ouverts || r.nombre_etablissements || null, ca: fin ? fin[1].ca : null, rn: fin ? fin[1].resultat_net : null, caAnnee: fin ? fin[0] : '',
    actif: r.etat_administratif !== 'C', sig, pays: 'France'};
}
async function chercherEnt(page){
  const f = N.f, u = new URL(API_ENT);
  if (f.q.trim()) u.searchParams.set('q', f.q.trim());
  if (f.departement.trim()) u.searchParams.set('departement', f.departement.trim().toUpperCase());
  if (f.section) u.searchParams.set('section_activite_principale', f.section);
  if (f.cat) u.searchParams.set('categorie_entreprise', f.cat);
  FILTRES_SIG.forEach(k => { if (f.sig[k]) u.searchParams.set(k, 'true'); });
  u.searchParams.set('etat_administratif', 'A'); u.searchParams.set('per_page', '20'); u.searchParams.set('page', String(page || 1));
  if (![...u.searchParams.keys()].some(k => !['etat_administratif', 'per_page', 'page'].includes(k))) { N.err = 'Indiquez un nom, un numéro SIREN ou au moins un filtre.'; renderEnt(); return; }
  N.busy = true; N.err = ''; renderEnt();
  try {
    let r = await fetch(u);
    if (r.status === 400 && f.sig.bilan_ges_renseigne) { u.searchParams.delete('bilan_ges_renseigne'); r = await fetch(u); N.filtreLocal = true; } else N.filtreLocal = false;
    if (r.status === 429) throw new Error('Trop de recherches en peu de temps : patientez quelques secondes.');
    if (!r.ok) throw new Error(r.status === 400 ? 'Recherche trop courte ou filtre non accepté : précisez le nom (3 lettres minimum) ou changez de filtre.' : 'Le service public de recherche ne répond pas (code ' + r.status + '). Réessayez dans un instant.');
    const d = await r.json();
    let L = arr(d.results).map(normEnt); L.forEach(e => N.cache[e.siren] = e);
    if (N.filtreLocal) L = L.filter(e => e.sig.bilan_ges_renseigne);
    N.res = page > 1 ? N.res.concat(L) : L; N.total = d.total_results || L.length; N.page = page || 1;
  } catch(e) { N.err = IN_PREVIEW ? 'Dans l\'aperçu Claude, les connexions vers d\'autres sites sont bloquées par sécurité. La recherche dans le registre officiel des entreprises fonctionnera dès que l\'application sera en ligne.' : e.message && !/fetch/i.test(e.message) ? e.message : 'Connexion impossible au service public de recherche des entreprises. Vérifiez votre connexion Internet.'; }
  N.busy = false; renderEnt();
}
async function chargerFiche(siren){
  if (N.cache[siren]) return N.cache[siren];
  const u = new URL(API_ENT); u.searchParams.set('q', siren); u.searchParams.set('per_page', '1');
  const r = await fetch(u); if (!r.ok) throw new Error('code ' + r.status);
  const d = await r.json(); const x = arr(d.results).find(z => z.siren === siren) || arr(d.results)[0];
  if (!x) throw new Error('introuvable'); const e = normEnt(x); N.cache[siren] = e; return e;
}

/* ---------- Moteur d'analyse RSE ---------- */
function obligations(e){
  const fr = e.pays === 'France', eff = e.eff, ca = e.ca, L = [];
  const add = (nom, etat, detail) => L.push({nom, etat, detail});
  const inconnu = eff == null;
  if (fr) {
    add('Index de l\'égalité professionnelle', inconnu ? '?' : eff >= 50 ? (e.sig.egapro_renseignee ? 'ok' : 'oui') : 'non', eff >= 50 ? 'Publication annuelle de l\'index (à partir de 50 salariés), appelé à être remplacé par les indicateurs de la loi sur la transparence salariale.' + (e.sig.egapro_renseignee ? ' Déclaration trouvée.' : ' Aucune déclaration trouvée dans les données publiques : à vérifier.') : 'Concerne les entreprises d\'au moins 50 salariés.');
    add('Bilan des émissions de gaz à effet de serre (BEGES)', inconnu ? '?' : eff >= 500 ? (e.sig.bilan_ges_renseigne ? 'ok' : 'oui') : 'non', eff >= 500 ? 'Bilan tous les 4 ans avec plan de transition, publié sur la plateforme de l\'ADEME (plus de 500 salariés en métropole).' + (e.sig.bilan_ges_renseigne ? ' Bilan trouvé.' : ' Aucun bilan trouvé dans les données publiques : besoin probable de mise en conformité.') : 'Obligatoire à partir de 500 salariés (250 en outre-mer). En dessous, les clients et les banques le demandent souvent.');
    add('Emploi des travailleurs handicapés (6 %)', inconnu ? '?' : eff >= 20 ? 'oui' : 'non', 'Obligation d\'emploi à partir de 20 salariés ; référent handicap obligatoire à partir de 250.');
    add('Informations environnementales au CSE', inconnu ? '?' : eff >= 50 ? 'oui' : 'non', 'À partir de 50 salariés, le CSE est informé des conséquences environnementales de l\'activité (base de données économiques, sociales et environnementales).');
    add('Mobilité domicile-travail', inconnu ? '?' : eff >= 50 ? 'oui' : 'non', 'Sujet à négocier avec les représentants du personnel sur les sites de 50 salariés et plus ; à défaut d\'accord, plan de mobilité employeur.');
    add('Devoir de vigilance (loi française)', inconnu ? '?' : eff >= 5000 ? 'oui' : 'non', 'Plan de vigilance pour les sociétés employant, avec leurs filiales, au moins 5 000 salariés en France ou 10 000 dans le monde. L\'effectif affiché ici est celui de la seule société : à vérifier au niveau du groupe.');
  }
  const csrd = !inconnu && eff >= 1000 && (ca == null || ca > 450e6);
  add('Rapport de durabilité (CSRD et ESRS)', inconnu ? '?' : csrd ? (ca == null ? '?' : 'oui') : 'non', csrd ? 'Depuis l\'Omnibus I : plus de 1 000 salariés et plus de 450 M€ de chiffre d\'affaires. ' + (ca == null ? 'Chiffre d\'affaires non publié ici : à vérifier, souvent au niveau du groupe.' : 'Seuils dépassés pour cette société.') : 'Hors du champ obligatoire. La norme volontaire européenne (dérivée du VSME) sert à répondre aux banques et aux grands clients.');
  add('Devoir de vigilance européen (CSDDD)', inconnu ? '?' : eff >= 5000 ? '?' : 'non', 'Plus de 5 000 salariés et 1,5 Md€ de chiffre d\'affaires, application en 2029. À vérifier au niveau du groupe.');
  if (['industrie', 'chimie', 'transport-equip', 'agroalim', 'energie', 'eau-dechets'].includes(e.profil) || (!inconnu && eff >= 250)) add('Audit énergétique ou système de management de l\'énergie', '?', 'Selon la consommation d\'énergie : audit énergétique au-delà d\'environ 2,75 GWh par an, système de management de l\'énergie (type ISO 50001) au-delà d\'environ 23,6 GWh.');
  if (['commerce', 'immobilier', 'sante', 'public', 'tourisme', 'conseil', 'finance', 'numerique'].includes(e.profil)) add('Décret tertiaire', '?', 'Si l\'entreprise occupe des bâtiments tertiaires de 1 000 m² ou plus : réduction de la consommation d\'énergie de 40 % en 2030 (par rapport à une année de référence), déclaration annuelle sur OPERAT.');
  return L;
}
function besoins(e, P){
  const L = [], eff = e.eff;
  if (e.sig.est_societe_mission) L.push(['Faire vivre la mission', 'Suivre les objectifs statutaires, collecter les preuves et préparer la vérification de l\'organisme tiers indépendant et le rapport du comité de mission.']);
  if (e.sig.est_ess) L.push(['Mesurer son impact social', 'Construire des indicateurs d\'impact et les présenter aux financeurs et aux partenaires.']);
  if (e.sig.est_rge) L.push(['Valoriser sa qualification RGE', 'Démontrer la performance des chantiers (carbone, déchets) dans les appels d\'offres.']);
  if (e.sig.est_bio) L.push(['Valoriser la certification bio', 'Relier la certification à une démarche plus large : carbone, emballages, achats locaux.']);
  if (eff != null && eff >= 500 && !e.sig.bilan_ges_renseigne && e.pays === 'France') L.push(['Se mettre en conformité carbone', 'Aucun bilan GES trouvé dans les données publiques alors que la taille l\'impose : bilan, plan de transition et publication.']);
  if (eff != null && eff >= 50 && !e.sig.egapro_renseignee && e.pays === 'France') L.push(['Sécuriser l\'égalité professionnelle', 'Aucune déclaration d\'index trouvée : vérifier la publication et préparer la transparence salariale.']);
  if (eff != null && eff >= 1000) L.push(['Piloter le reporting de durabilité', 'Collecte des données auprès des sites et des filiales, double matérialité, contrôle interne avant l\'audit.']);
  else if (eff != null && eff >= 50) L.push(['Répondre aux demandes des clients et des banques', 'Questionnaires EcoVadis ou CDP, norme volontaire européenne, critères RSE des appels d\'offres.']);
  else L.push(['Poser les premières bases', 'Bilan carbone simplifié, plan d\'action réaliste, premières réponses aux demandes des clients.']);
  if (P) P.besoins.forEach(b => L.push(['Enjeu du secteur', b]));
  return L;
}
function pitch(e, P){
  const pr = P_profil(), nom = (pr.prenom || '[Prénom]') + ' ' + (pr.nom || '[Nom]');
  const pourquoi = e.sig.est_societe_mission ? 'votre engagement de société à mission' : e.sig.est_ess ? 'votre ancrage dans l\'économie sociale et solidaire' : 'vos activités dans le secteur ' + lc(P ? P.nom : 'qui est le vôtre');
  const enj = P ? P.enjeux.slice(0, 2).map(x => lc(x.replace(/\s*\([^)]*\)/g, ''))) : [];
  const PH = [['Rapport de durabilité', 'publier un rapport de durabilité'], ['Devoir de vigilance (loi', 'établir un plan de vigilance'], ['Bilan des émissions', 'publier son bilan de gaz à effet de serre'], ['Index de l\'égalité', 'publier son index de l\'égalité professionnelle']];
  const obl = obligations(e).filter(o => o.etat === 'oui' || o.etat === 'ok').map(o => o.nom);
  const ob = PH.filter(([k]) => obl.some(n => n.startsWith(k))).map(x => x[1]).slice(0, 2);
  const mis = P ? P.missions.slice(0, 3) : ['Réaliser un premier diagnostic RSE', 'Construire un plan d\'action chiffré', 'Préparer les réponses aux questionnaires des clients'];
  const alt = N.mode === 'alternance';
  return 'Objet : ' + (alt ? 'Candidature en alternance' : 'Candidature') + ' – Chargé(e) de mission RSE – ' + nom + '\n\nBonjour Madame, Monsieur,\n\n'
    + (alt ? 'Étudiant(e) en ' + (pr.formation || '[formation]') + ', je recherche une alternance en RSE et développement durable. ' : 'Je souhaite mettre mes compétences en RSE et développement durable au service de votre entreprise. ')
    + 'Je m\'intéresse particulièrement à ' + e.nom + ' pour ' + pourquoi + '.\n\n'
    + (enj.length ? 'Dans votre secteur, ' + enj.join(' et ') + ' sont des sujets majeurs' + (ob.length ? ', et une entreprise de votre taille doit notamment ' + ob.join(' et ') : '') + '.\n\n' : '')
    + 'Je peux apporter un appui concret à votre équipe, par exemple pour :\n' + mis.map(m => '– ' + lc(m)).join('\n') + '\n\n'
    + (alt ? 'Mon rythme d\'alternance : [à compléter, par exemple 1 semaine en formation et 2 semaines en entreprise], à partir de [date].\n\n' : '')
    + 'Je serais heureux(se) d\'échanger avec vous pour comprendre vos priorités et voir comment y contribuer. Vous trouverez mon CV en pièce jointe.\n\nCordialement,\n' + nom;
}
const P_profil = () => (typeof P !== 'undefined' && P.profil) || {};

/* ---------- Rendu ---------- */
const sigPills = e => SIGNAUX.filter(([k]) => e.sig[k]).map(([, l]) => '<span class="pill">' + esc(l) + '</span>').join('');
const nafLib = naf => { const d = String(naf || '').slice(0, 2); return (N.ref && N.ref.naf[d]) || ''; };
const EXSECT = [['C', 'Industrie', '#2357A6'], ['F', 'Construction', '#A8621A'], ['G', 'Commerce', '#C2532A'], ['H', 'Transport et logistique', '#1F6F73'], ['J', 'Numérique et télécoms', '#6B4BA1'], ['K', 'Banque et assurance', '#0F5B3E'], ['M', 'Conseil et ingénierie', '#7A3E5B'], ['D', 'Énergie', '#B8860B'], ['E', 'Eau et déchets', '#2F7F8F'], ['I', 'Hôtellerie et restauration', '#C2532A'], ['Q', 'Santé et médico-social', '#2357A6'], ['A', 'Agriculture', '#0F5B3E']];
const EXTAIL = [['GE', 'Grandes entreprises'], ['ETI', 'ETI'], ['PME', 'PME'], ['', 'Toutes tailles']];
function explorer(){
  const dep = LS.get('dep') || '', t = LS.get('ex-taille') ?? 'GE';
  return '<div class="explo"><h3>Explorer sans connaître de nom</h3><p class="prose">Choisissez votre département, une taille et un secteur : l\'application affiche les entreprises correspondantes avec, pour chacune, ses obligations et ses besoins probables en RSE.</p>'
    + '<div class="exrow"><label class="exdep">Mon département<input class="inp" id="exDep" value="' + esc(dep) + '" placeholder="Ex. : 69" maxlength="3" inputmode="numeric"></label><div class="filters">' + EXTAIL.map(([k, l]) => '<button class="chip' + (t === k ? ' on' : '') + '" data-en="extaille" data-v="' + k + '">' + l + '</button>').join('') + '</div></div>'
    + '<div class="exgrid">' + EXSECT.map(([k, l, c]) => '<button class="exs" style="--xc:' + c + '" data-en="exsec" data-v="' + k + '"><span>' + l + '</span><em>Voir →</em></button>').join('') + '</div>'
    + '<h3>Entreprises engagées</h3><div class="exgrid exeng">' + [['est_societe_mission', 'Sociétés à mission'], ['est_ess', 'Économie sociale et solidaire'], ['egapro_renseignee', 'Index de l\'égalité publié'], ['bilan_ges_renseigne', 'Bilan carbone publié']].map(([k, l]) => '<button class="exs" style="--xc:#0F5B3E" data-en="exsig" data-v="' + k + '"><span>' + l + '</span><em>' + (dep ? 'dans le ' + esc(dep) : 'en France') + ' →</em></button>').join('') + '</div></div>';
}
function lancerExplo(f){ const dep = (document.getElementById('exDep') || {}).value || LS.get('dep') || ''; if (dep) LS.set('dep', dep.trim()); const t = LS.get('ex-taille') ?? 'GE'; N.f = Object.assign({q: '', departement: dep.trim(), section: '', cat: t, sig: {}}, f); N.res = []; chercherEnt(1); }
function apercuBesoins(e){ try { const pid = (profilNaf(e.naf) || {}).id; const x = Object.assign({}, e, {profil: pid}); const ob = obligations(x).filter(o => o.etat === 'oui' || o.etat === 'ok').length; const b = besoins(x, null).filter(z => z[0] !== 'Enjeu du secteur')[0]; return '<p class="entb"><strong>' + ob + ' obligation' + (ob > 1 ? 's' : '') + '</strong>' + (b ? ' · Besoin probable : ' + esc(lc(b[0])) : '') + '</p>'; } catch(err) { return ''; } }
function resCard(e){
  const cible = N.cibles.some(c => c.id === e.id);
  return '<a class="card hubcard entc" href="#entreprises--' + esc(e.id) + '"><div class="meta">' + (e.cat ? '<span class="pill b">' + esc(e.cat) + '</span>' : '') + '<span class="pill g">' + esc(e.effLabel) + '</span>' + (cible ? '<span class="pill o">Dans mes cibles</span>' : '') + '</div><h4>' + esc(e.nom) + '</h4><p>' + esc(nafLib(e.naf) || e.secteurLibre || '') + (e.ville ? ' · ' + esc(e.ville) + (e.cp ? ' (' + esc(e.cp.slice(0, 2)) + ')' : '') : e.paysLib ? ' · ' + esc(e.paysLib) : '') + '</p>' + (sigPills(e) ? '<div class="meta">' + sigPills(e) + '</div>' : '') + (e.pays === 'France' ? apercuBesoins(e) : '') + '</a>';
}
function renderEnt(){
  const el = document.getElementById('entRoot'); if (!el) return;
  if (route().sub && route().base === 'entreprises') return renderFiche();
  if (!N.ref) { el.innerHTML = '<div class="eyebrow">CARRIÈRE</div><h2>Annuaire RSE des entreprises</h2><p class="lead">Chargement…</p>'; return; }
  const f = N.f;
  let h = '<div class="eyebrow">CARRIÈRE · ENTREPRISES</div><h2>Annuaire RSE des entreprises</h2>'
    + '<p class="lead">Toutes les entreprises françaises, en direct depuis le registre officiel de l\'État. Pour chacune : ses signaux RSE publics, ses obligations probables, les enjeux de son secteur, ses besoins en RSE, ce que vous pouvez lui apporter et un message de candidature prêt à adapter.</p>'
    + '<div class="ctabs" role="tablist"><button class="ctab' + (N.tab === 'chercher' ? ' on' : '') + '" data-en="tab" data-t="chercher">Rechercher</button><button class="ctab' + (N.tab === 'cibles' ? ' on' : '') + '" data-en="tab" data-t="cibles">Mes entreprises cibles<span class="cnt">' + N.cibles.length + '</span></button><button class="ctab' + (N.tab === 'ajout' ? ' on' : '') + '" data-en="tab" data-t="ajout">Entreprise hors de France</button></div>';
  if (N.tab === 'chercher') {
    if (!N.res.length && !N.busy && !N.err) h += explorer() + '<h3>Ou chercher une entreprise précise</h3>';
    h += '<form id="entForm" class="card entform" autocomplete="off"><div class="entgrid"><label>Nom, marque ou SIREN<input class="inp" id="eQ" type="search" value="' + esc(f.q) + '" placeholder="Ex. : Danone, bioMérieux, 552032534"></label>'
      + '<label>Département<input class="inp" id="eDep" value="' + esc(f.departement) + '" placeholder="Ex. : 69" maxlength="3"></label>'
      + '<label>Secteur<select class="inp" id="eSec"><option value="">Tous les secteurs</option>' + Object.entries(N.ref.sections).map(([k, v]) => '<option value="' + k + '"' + (f.section === k ? ' selected' : '') + '>' + esc(v) + '</option>').join('') + '</select></label>'
      + '<label>Taille<select class="inp" id="eCat"><option value="">Toutes</option><option value="PME"' + (f.cat === 'PME' ? ' selected' : '') + '>PME (moins de 250 salariés)</option><option value="ETI"' + (f.cat === 'ETI' ? ' selected' : '') + '>ETI (250 à 4 999)</option><option value="GE"' + (f.cat === 'GE' ? ' selected' : '') + '>Grande entreprise</option></select></label></div>'
      + '<div class="entsig"><span>Signaux RSE :</span>' + FILTRES_SIG.map(k => { const s = SIGNAUX.find(x => x[0] === k); return '<label class="chk"><input type="checkbox" data-sig="' + k + '"' + (f.sig[k] ? ' checked' : '') + '> ' + esc(s[1]) + '</label>'; }).join('') + '</div>'
      + '<div class="ctool"><button class="btn" type="submit">Rechercher</button>' + (f.q || f.departement || f.section || f.cat || Object.values(f.sig).some(Boolean) ? '<button class="btn ghost" type="button" data-en="reset">Effacer</button>' : '') + '</div></form>'
      + '<div class="filters">' + N.ref.presets.map((p, i) => '<button class="chip" data-en="preset" data-i="' + i + '">' + esc(p.titre) + '</button>').join('') + '</div>';
    if (N.err) h += '<div class="callout"><strong>Recherche impossible</strong>' + esc(N.err) + '</div>';
    if (N.busy && !N.res.length) h += '<p class="progress">Recherche en cours…</p>';
    if (N.res.length) {
      h += '<p class="progress">' + N.total.toLocaleString('fr-FR') + ' entreprise' + (N.total > 1 ? 's' : '') + ' trouvée' + (N.total > 1 ? 's' : '') + (N.filtreLocal ? ' (filtre « bilan GES » appliqué sur les résultats affichés)' : '') + '</p><div class="grid two">' + N.res.map(resCard).join('') + '</div>';
      if (N.res.length < N.total && N.res.length < 400) h += '<p style="text-align:center"><button class="btn ghost" data-en="plus"' + (N.busy ? ' disabled' : '') + '>' + (N.busy ? 'Chargement…' : 'Voir plus de résultats') + '</button></p>';
    }
    h += '<p class="foot">Source : API Recherche d\'entreprises (Annuaire des entreprises, data.gouv.fr), données Sirene, RNE et partenaires, mises à jour quotidiennement. L\'analyse RSE est une estimation construite à partir du secteur et de la taille : elle se vérifie dans les documents publiés par l\'entreprise.</p>';
  } else if (N.tab === 'cibles') {
    h += N.cibles.length ? '<div class="grid two">' + N.cibles.map(c => resCard(c)).join('') + '</div><p class="progress" style="margin-top:12px">Vos entreprises cibles et vos notes restent sur cet appareil ; elles sont incluses dans la sauvegarde de votre espace.</p>' : '<div class="callout b"><strong>Aucune entreprise cible pour l\'instant</strong>Ouvrez la fiche d\'une entreprise et touchez « Ajouter à mes cibles » pour la suivre et prendre des notes.</div>';
  } else {
    h += '<p class="prose">Le registre officiel utilisé ici ne couvre que la France. Pour une entreprise d\'un autre pays (ou une filiale étrangère), indiquez ses caractéristiques : l\'application produit la même analyse à partir de son secteur et de sa taille. Beaucoup de groupes européens ont aussi une filiale française, que vous pouvez chercher dans l\'onglet Rechercher.</p>'
      + '<form id="entAjout" class="card entform"><div class="entgrid"><label>Nom de l\'entreprise<input class="inp" id="aNom" required></label><label>Pays<input class="inp" id="aPays" placeholder="Ex. : Allemagne"></label>'
      + '<label>Secteur<select class="inp" id="aProf">' + N.ref.profils.map(p => '<option value="' + p.id + '">' + esc(p.nom) + '</option>').join('') + '</select></label>'
      + '<label>Nombre de salariés (environ)<input class="inp" id="aEff" type="number" min="0" placeholder="Ex. : 1200"></label><label>Chiffre d\'affaires en M€ (si connu)<input class="inp" id="aCa" type="number" min="0"></label><label>Site web (facultatif)<input class="inp" id="aWeb" placeholder="https://"></label></div>'
      + '<div class="ctool"><button class="btn" type="submit">Créer la fiche</button></div></form>';
  }
  el.innerHTML = h;
}
function lienRech(e){
  const n = encodeURIComponent('"' + e.nom + '"'), g = q => 'https://www.google.com/search?q=' + encodeURIComponent(q);
  const L = [
    [g('"' + e.nom + '" rapport de durabilité OR "rapport RSE" OR "déclaration de performance extra-financière" OR "sustainability report"'), 'Son rapport RSE ou de durabilité'],
    [g('"' + e.nom + '" engagements climat OR SBTi OR "bilan carbone"'), 'Ses engagements climat'],
    [g('"' + e.nom + '" EcoVadis OR "B Corp" OR "label Lucie" OR "label RSE"'), 'Ses notations et labels RSE'],
    ['https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(e.nom + ' RSE'), 'Son équipe RSE sur LinkedIn'],
    [g('"' + e.nom + '" alternance RSE OR "développement durable" OR "chargé de mission"'), 'Ses offres RSE et alternance'],
    ['https://www.welcometothejungle.com/fr/jobs?query=' + encodeURIComponent(e.nom), 'Ses offres sur Welcome to the Jungle']
  ];
  if (e.siren) L.unshift(['https://annuaire-entreprises.data.gouv.fr/entreprise/' + e.siren, 'Sa fiche officielle (Annuaire des entreprises)']);
  if (e.web && safeUrl(e.web)) L.unshift([e.web, 'Son site web']);
  return L;
}
const NOTES = [['objectifs', 'Objectifs climat publiés (année, %, SBTi ?)'], ['enjeux', 'Enjeux prioritaires qu\'elle déclare'], ['labels', 'Notations et labels (EcoVadis, B Corp, Lucie…)'], ['equipe', 'Équipe RSE : qui, combien, rattachée à qui'], ['projets', 'Projets en cours ou annoncés'], ['vigilance', 'Controverses ou points de vigilance'], ['contact', 'Contact identifié et prochaine action']];
function renderFiche(){
  const el = document.getElementById('entRoot'), id = route().sub;
  let e = N.cibles.find(c => c.id === id) || N.cache[id];
  if (!e) {
    if (/^\d{9}$/.test(id)) { el.innerHTML = '<p class="lead">Chargement de la fiche…</p>'; chargerFiche(id).then(() => { if (route().sub === id) renderFiche(); }).catch(() => { el.innerHTML = '<div class="callout"><strong>Fiche indisponible</strong>Impossible de charger cette entreprise depuis le registre officiel. Vérifiez votre connexion.</div><p><a class="btn ghost" href="#entreprises">Retour à l\'annuaire</a></p>'; }); }
    else el.innerHTML = '<div class="callout"><strong>Entreprise introuvable</strong>Elle a peut-être été retirée de vos cibles.</div><p><a class="btn ghost" href="#entreprises">Retour à l\'annuaire</a></p>';
    return;
  }
  const cible = N.cibles.find(c => c.id === e.id);
  const pid = (cible && cible.profil) || N.prof[e.id] || e.profil || (profilNaf(e.naf) || {}).id;
  const Pf = profilDe(pid); e = Object.assign({}, e, {profil: pid});
  const ob = obligations(e), be = besoins(e, Pf);
  const ET = {oui: ['r', 'Concernée'], ok: ['', 'Concernée · publié'], non: ['g', 'Non concernée'], '?': ['o', 'À vérifier']};
  let h = '<p><a class="linkbtn" href="#entreprises">← Annuaire des entreprises</a></p><div class="eyebrow">FICHE ENTREPRISE · ' + esc(e.pays === 'France' ? 'FRANCE' : (e.paysLib || 'HORS DE FRANCE').toUpperCase()) + '</div><h2>' + esc(e.nom) + '</h2>'
    + '<div class="meta entmeta">' + (e.cat ? '<span class="pill b">' + esc(e.cat) + '</span>' : '') + '<span class="pill g">' + esc(e.effLabel) + (e.effAnnee ? ' (' + esc(e.effAnnee) + ')' : '') + '</span>' + (e.ca != null ? '<span class="pill g">CA ' + fmtEur(e.ca) + (e.caAnnee ? ' (' + esc(e.caAnnee) + ')' : '') + '</span>' : '') + (e.ville ? '<span class="pill g">' + esc(e.ville) + '</span>' : '') + (e.siren ? '<span class="pill g">SIREN ' + esc(e.siren) + '</span>' : '') + '</div>'
    + '<p class="prose">' + (e.naf ? 'Activité principale : <strong>' + esc(nafLib(e.naf) || '') + '</strong> (code ' + esc(e.naf) + ').' : '') + (e.adresse ? ' Siège : ' + esc(e.adresse) + '.' : '') + (e.creation ? ' Créée le ' + esc(new Date(e.creation).toLocaleDateString('fr-FR')) + '.' : '') + (e.etabs ? ' ' + e.etabs + ' établissement' + (e.etabs > 1 ? 's' : '') + ' ouvert' + (e.etabs > 1 ? 's' : '') + '.' : '') + '</p>'
    + '<div class="frow entsect"><div><strong>Secteur utilisé pour l\'analyse</strong><span class="progress">' + (String(e.naf).startsWith('70') ? 'Société de tête ou siège de groupe : choisissez le secteur réel de ses activités.' : 'Déduit de l\'activité officielle ; modifiable si l\'activité réelle est différente.') + '</span></div><select class="inp" id="entProf">' + N.ref.profils.map(p => '<option value="' + p.id + '"' + (p.id === pid ? ' selected' : '') + '>' + esc(p.nom) + '</option>').join('') + '</select></div>'
    + '<div class="ctool"><button class="btn" data-en="cible">' + (cible ? 'Retirer de mes cibles' : '+ Ajouter à mes cibles') + '</button><button class="btn ghost" data-en="cand">Créer une candidature</button><a class="btn ghost" href="#offre">Analyser une de ses offres</a></div>';
  if (e.pays === 'France') {
    h += '<h3>1. Ses signaux RSE publics</h3><p class="prose">Informations issues des registres officiels. L\'absence d\'un signal ne veut pas dire absence de démarche : beaucoup d\'entreprises agissent sans label.</p><div class="sigs">' + SIGNAUX.map(([k, l, d]) => '<div class="sig' + (e.sig[k] ? ' on' : '') + '"><span class="dotc">' + (e.sig[k] ? '✓' : '–') + '</span><div><strong>' + esc(l) + '</strong><span>' + esc(d) + '</span></div></div>').join('') + '</div>';
  }
  h += '<h3>' + (e.pays === 'France' ? '2' : '1') + '. Ses obligations probables selon sa taille</h3><div class="tablewrap"><table><thead><tr><th>Obligation</th><th>Situation</th><th>Ce que cela implique</th></tr></thead><tbody>' + ob.map(o => '<tr><td><strong>' + esc(o.nom) + '</strong></td><td><span class="pill ' + ET[o.etat][0] + '">' + ET[o.etat][1] + '</span></td><td>' + esc(o.detail) + '</td></tr>').join('') + '</tbody></table></div>'
    + (e.pays !== 'France' ? '<p class="progress">Hors de France, les obligations nationales diffèrent (par exemple, en Allemagne, la loi sur le devoir de vigilance vise les entreprises d\'au moins 1 000 salariés). Seules les règles européennes sont analysées ici.</p>' : '');
  const n0 = e.pays === 'France' ? 2 : 1;
  if (Pf) h += '<h3>' + (n0 + 1) + '. Les enjeux RSE de son secteur : ' + esc(lc(Pf.nom)) + '</h3><div class="grid two"><div class="card"><h4>Enjeux majeurs</h4><ul>' + Pf.enjeux.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="card"><h4>Indicateurs suivis</h4><ul>' + Pf.indicateurs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h4 style="margin-top:12px">Normes ESRS souvent matérielles</h4><div class="meta">' + Pf.esrs.map(x => '<span class="pill">' + x + '</span>').join('') + '</div></div><div class="card"><h4>Textes et référentiels</h4><ul>' + Pf.referentiels.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="card"><h4>Questions à lui poser</h4><ul>' + Pf.questions.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>';
  h += '<h3>' + (n0 + 2) + '. Ses besoins probables en RSE</h3><div class="grid two">' + be.map(([t, d]) => '<div class="card"><h4>' + esc(t) + '</h4><p>' + esc(d) + '</p></div>').join('') + '</div>';
  if (Pf) h += '<h3>' + (n0 + 3) + '. Ce que vous pouvez apporter à son équipe</h3><p class="prose">Des missions réalistes pour un alternant ou un chargé de mission RSE dans ce type d\'entreprise. Reliez chacune à un cas pratique ou à un guide de l\'application que vous avez déjà travaillé : c\'est votre preuve en entretien.</p><ol class="steps">' + Pf.missions.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>';
  h += '<h3>' + (n0 + 4) + '. L\'approcher</h3><div class="filters"><button class="chip' + (N.mode === 'alternance' ? ' on' : '') + '" data-en="mode" data-m="alternance">Je cherche une alternance</button><button class="chip' + (N.mode === 'emploi' ? ' on' : '') + '" data-en="mode" data-m="emploi">Je cherche un emploi</button></div>'
    + '<div class="card scriptcard"><div class="sc-head"><span class="pill o">À personnaliser</span><h4>Message de candidature spontanée</h4></div><div class="tpl" id="entPitch">' + esc(pitch(e, Pf)) + '</div><div class="ctool"><button class="btn ghost sm" data-en="copy">Copier le message</button></div></div>'
    + '<p class="prose">Avant d\'envoyer : lisez son rapport RSE et remplacez une phrase générique par un fait précis (un objectif, un projet, un chiffre). C\'est ce qui fait la différence pour le recruteur.</p>'
    + '<div class="grid two">' + lienRech(e).map(([u, l]) => '<a class="card hubcard" href="' + esc(u) + '" target="_blank" rel="noopener"><h4>' + esc(l) + ' →</h4></a>').join('') + '</div>';
  h += '<h3>' + (n0 + 5) + '. Mes notes de recherche</h3><p class="prose">La grille de lecture d\'un rapport RSE en 20 minutes. ' + (cible ? 'Vos notes sont enregistrées automatiquement.' : 'Saisir une note ajoute l\'entreprise à vos cibles.') + '</p><div class="entnotes">' + NOTES.map(([k, l]) => '<label>' + esc(l) + '<textarea class="ta" data-note="' + k + '">' + esc(((cible && cible.notes) || {})[k] || '') + '</textarea></label>').join('') + '</div>';
  el.innerHTML = h;
}
function entCourante(){ const id = route().sub; const c = N.cibles.find(x => x.id === id) || N.cache[id]; if (!c) return null; return Object.assign({}, c, {profil: (N.cibles.find(x => x.id === id) || {}).profil || N.prof[id] || c.profil || (profilNaf(c.naf) || {}).id}); }
async function toggleCible(force){
  const e = entCourante(); if (!e) return;
  const i = N.cibles.findIndex(c => c.id === e.id);
  if (i >= 0 && !force) { N.cibles.splice(i, 1); toast('Retirée de vos cibles'); }
  else if (i < 0) { N.cibles.unshift(Object.assign({}, e, {ajoute: Date.now(), notes: {}})); if (!force) toast('Ajoutée à vos cibles'); }
  await saveCibles();
}
const entRoot = document.getElementById('entRoot');
entRoot.addEventListener('submit', async ev => {
  ev.preventDefault();
  if (ev.target.id === 'entForm') {
    N.f.q = document.getElementById('eQ').value; N.f.departement = document.getElementById('eDep').value; if (N.f.departement.trim()) LS.set('dep', N.f.departement.trim()); N.f.section = document.getElementById('eSec').value; N.f.cat = document.getElementById('eCat').value;
    entRoot.querySelectorAll('[data-sig]').forEach(c => N.f.sig[c.dataset.sig] = c.checked);
    N.res = []; chercherEnt(1);
  } else if (ev.target.id === 'entAjout') {
    const v = id => document.getElementById(id).value.trim();
    if (!v('aNom')) return;
    const eff = v('aEff') ? +v('aEff') : null, t = eff == null ? null : Object.values(TRANCHES).filter(x => x[0] <= eff).pop();
    const P0 = profilDe(v('aProf'));
    const e = {type: 'x', id: 'x' + uid().replace(/-/g, '').slice(0, 10), nom: v('aNom'), pays: 'Autre', paysLib: v('aPays') || 'Hors de France', profil: v('aProf'), secteurLibre: P0 ? P0.nom : '', eff, effLabel: eff == null ? 'Effectif non renseigné' : 'environ ' + eff.toLocaleString('fr-FR') + ' salariés', cat: eff == null ? '' : eff >= 5000 ? 'GE' : eff >= 250 ? 'ETI' : 'PME', ca: v('aCa') ? +v('aCa') * 1e6 : null, web: v('aWeb'), sig: {}, ajoute: Date.now(), notes: {}};
    void t; N.cibles.unshift(e); await saveCibles(); location.hash = 'entreprises--' + e.id;
  }
});
entRoot.addEventListener('click', async ev => {
  const b = ev.target.closest('[data-en]'); if (!b) return;
  const a = b.dataset.en;
  if (a === 'tab') { N.tab = b.dataset.t; renderEnt(); }
  else if (a === 'preset') { const p = N.ref.presets[+b.dataset.i]; N.f = {q: '', departement: p.f.departement || '', section: p.f.section_activite_principale || '', cat: p.f.categorie_entreprise || '', sig: {}}; FILTRES_SIG.forEach(k => { if (p.f[k]) N.f.sig[k] = true; }); N.res = []; chercherEnt(1); }
  else if (a === 'reset') { N.f = {q: '', departement: '', section: '', cat: '', sig: {}}; N.res = []; N.err = ''; renderEnt(); }
  else if (a === 'plus') chercherEnt(N.page + 1);
  else if (a === 'extaille') { LS.set('ex-taille', b.dataset.v); renderEnt(); }
  else if (a === 'exsec') lancerExplo({section: b.dataset.v});
  else if (a === 'exsig') { const sg = {}; sg[b.dataset.v] = true; lancerExplo({sig: sg, cat: ''}); }
  else if (a === 'cible') { await toggleCible(); renderFiche(); }
  else if (a === 'mode') { N.mode = b.dataset.m; renderFiche(); }
  else if (a === 'copy') { const t = document.getElementById('entPitch').textContent; try { await navigator.clipboard.writeText(t); toast('Message copié'); } catch(e) { const r = document.createRange(); r.selectNodeContents(document.getElementById('entPitch')); const s = getSelection(); s.removeAllRanges(); s.addRange(r); toast('Texte sélectionné : Ctrl+C pour copier'); } }
  else if (a === 'cand') { const e = entCourante(); if (!e) return; await toggleCible(true); candModal({entreprise: e.nom, poste: N.mode === 'alternance' ? 'Alternant(e) chargé(e) de mission RSE' : 'Chargé(e) de mission RSE', contrat: N.mode === 'alternance' ? 'Alternance (apprentissage)' : 'CDI', statut: 'À envoyer', notes: 'Fiche annuaire : ' + location.href}); }
});
entRoot.addEventListener('change', async ev => {
  if (ev.target.id === 'entProf') { const id = route().sub; N.prof[id] = ev.target.value; const c = N.cibles.find(x => x.id === id); if (c) { c.profil = ev.target.value; await saveCibles(); } renderFiche(); }
});
let noteT;
entRoot.addEventListener('input', ev => {
  const k = ev.target.dataset && ev.target.dataset.note; if (!k) return;
  clearTimeout(noteT); const val = ev.target.value;
  noteT = setTimeout(async () => { const id = route().sub; let c = N.cibles.find(x => x.id === id); if (!c) { await toggleCible(true); c = N.cibles.find(x => x.id === id); const btn = entRoot.querySelector('[data-en="cible"]'); if (btn) btn.textContent = 'Retirer de mes cibles'; } if (!c) return; c.notes = c.notes || {}; c.notes[k] = val; c.updatedAt = Date.now(); await saveCibles(); }, 500);
});
function nRoute(){ if (route().base !== 'entreprises') return; renderEnt(); try { if (!route().sub && !N.res.length && !N.busy && !N.auto && LS.get('dep') && N.ref && !IN_PREVIEW) { N.auto = true; lancerExplo({}); } } catch(e) {} }
window.addEventListener('hashchange', nRoute);
(typeof espaceReady !== 'undefined' ? espaceReady : Promise.resolve()).then(nInit, nInit);


/* =====================================================================
   OFFRES ET ALERTES RSE
   1) Liens préremplis vers toutes les plateformes (les plus récentes d'abord).
   2) Création des alertes natives de chaque plateforme (notifications instantanées).
   3) Fil d'offres officielles (France Travail et partenaires), mis à jour
      chaque heure par le robot tools/maj-offres.mjs.
   ===================================================================== */
const OTYPES = [['emploi', 'Emploi (CDI, CDD)'], ['alternance', 'Alternance (apprentissage)'], ['pro', 'Contrat de professionnalisation'], ['stage', 'Stage'], ['interim', 'Intérim'], ['freelance', 'Freelance et missions'], ['international', 'International (VIE, Europe)']];
const OMOTS = ['RSE', 'développement durable', 'CSRD', 'ESG', 'bilan carbone', 'transition écologique', 'QHSE', 'achats responsables', 'finance durable', 'économie circulaire', 'biodiversité', 'énergie climat'];
const OTMOT = {emploi: '', alternance: 'alternance', pro: 'contrat de professionnalisation', stage: 'stage', interim: 'intérim', freelance: 'freelance', international: 'VIE'};
const OFRAICH = [['r3600', 'Dernière heure', 1], ['r86400', 'Dernières 24 h', 1], ['r604800', '7 derniers jours', 7]];
const O = {prefs: null, offres: [], maj: '', note: '', charge: false, nouv: new Set(), voir: 'tout'};
function oPrefs(){ if (!O.prefs) { try { O.prefs = JSON.parse(LS.get('offres-prefs') || 'null'); } catch(e) {} O.prefs = Object.assign({types: ['alternance', 'emploi'], mots: ['RSE', 'développement durable', 'CSRD'], lieu: 'France', fraich: 'r86400', autre: '', faits: {}}, O.prefs || {}); } return O.prefs; }
const oSave = () => LS.set('offres-prefs', JSON.stringify(O.prefs));
function oMots(){ const p = oPrefs(); const L = p.mots.slice(); p.autre.split(',').map(s => s.trim()).filter(Boolean).forEach(s => L.push(s)); return L.length ? L : ['RSE']; }
const quote = s => /\s/.test(s) ? '"' + s + '"' : s;
function oLiens(type){
  const p = oPrefs(), mots = oMots(), t = OTMOT[type] || '', loc = type === 'international' ? 'Union européenne' : (p.lieu || 'France');
  const qOr = '(' + mots.map(quote).join(' OR ') + ')' + (t ? ' ' + t : '');
  const k = mots[0] + (t ? ' ' + t : ''), e = encodeURIComponent, fr = OFRAICH.find(x => x[0] === p.fraich) || OFRAICH[1];
  const jt = {emploi: '&f_JT=F%2CC', stage: '&f_JT=I', interim: '&f_JT=T', freelance: '&f_JT=C'}[type] || '';
  const alt = type === 'alternance' || type === 'pro';
  return [
    ['Grandes plateformes', [
      ['LinkedIn · offres', 'https://www.linkedin.com/jobs/search/?keywords=' + e(qOr) + '&location=' + e(loc) + '&f_TPR=' + fr[0] + '&sortBy=DD' + jt, 'Triées de la plus récente à la plus ancienne, publiées ' + lc(fr[1]) + '.'],
      ['Indeed', 'https://fr.indeed.com/jobs?q=' + e(qOr) + '&l=' + e(loc === 'Union européenne' ? 'France' : loc) + '&sort=date&fromage=' + fr[2], 'Triées par date.'],
      ['France Travail', 'https://candidat.francetravail.fr/offres/recherche?motsCles=' + e(k) + '&offresPartenaires=true&tri=1', 'Avec les offres des sites partenaires.'],
      ['Welcome to the Jungle', 'https://www.welcometothejungle.com/fr/jobs?query=' + e(k), 'Start-up, PME et grands groupes.'],
      ['HelloWork', 'https://www.hellowork.com/fr-fr/emploi/recherche.html?k=' + e(k) + '&l=' + e(loc), 'Fort sur l\'alternance et les régions.'],
      ['APEC', 'https://www.apec.fr/candidat/recherche-emploi.html/emploi?motsCles=' + e(k), 'Postes cadres et jeunes diplômés.'],
      ['Talent.com', 'https://fr.talent.com/jobs?k=' + e(k) + '&l=' + e(loc), 'Agrégateur de nombreux sites.'],
      ['Google Emplois', 'https://www.google.com/search?q=' + e(k + ' offre') + '&ibp=htl;jobs', 'Regroupe les offres publiées sur les sites des entreprises.']
    ]],
    ['Alternance, stages et jeunes', [
      ['La bonne alternance', 'https://labonnealternance.apprentissage.beta.gouv.fr/', 'Service public : offres et entreprises qui recrutent en alternance' + (alt ? '' : ' (utile aussi pour les stages)') + '.'],
      ['1jeune1solution', 'https://www.1jeune1solution.gouv.fr/', 'Service public pour les moins de 30 ans : alternance, stages, emploi.'],
      ['JobTeaser', 'https://www.jobteaser.com/fr/job-offers?query=' + e(k), 'Via le compte de votre école.'],
      ['Service civique', 'https://www.service-civique.gouv.fr/', 'Missions environnement et solidarité, idéales pour une première expérience.']
    ]],
    ['Spécialistes RSE et impact', [
      ['Jobs That Make Sense', 'https://jobs.makesense.org/', 'Emplois et stages à impact social et environnemental.'],
      ['Emploi-Environnement', 'https://www.emploi-environnement.com/', 'Offres du site Actu-Environnement.'],
      ['Birdeo', 'https://www.birdeo.com/', 'Cabinet de recrutement spécialisé RSE et développement durable.']
    ]],
    ['Réseaux sociaux : offres hors des sites d\'emploi', [
      ['LinkedIn · publications « je recrute »', 'https://www.linkedin.com/search/results/content/?keywords=' + e(k + ' recrute') + '&sortBy=%22date_posted%22', 'Les recruteurs et managers annoncent souvent un poste dans un post avant de le publier.'],
      ['Facebook · groupes emploi', 'https://www.facebook.com/search/groups/?q=' + e(mots[0] + ' emploi'), 'Rejoignez les groupes emploi et alternance RSE de votre région.'],
      ['Facebook · publications', 'https://www.facebook.com/search/posts/?q=' + e(k + ' recrute'), 'Annonces publiées directement par des entreprises et des associations.'],
      ['Google Alertes', 'https://www.google.com/alerts?q=' + e('"' + mots[0] + '" ' + (t || 'offre') + ' recrute'), 'Choisissez « Au fur et à mesure » : un courriel dès qu\'une page contenant ces mots est publiée.']
    ]],
    ['Europe et international', [
      ['EURES', 'https://eures.europa.eu/', 'Portail européen de l\'emploi des services publics.'],
      ['Mon VIE (Business France)', 'https://mon-vie-via.businessfrance.fr/', 'Volontariat international en entreprise, de 6 à 24 mois.'],
      ['LinkedIn · Europe', 'https://www.linkedin.com/jobs/search/?keywords=' + e('(' + ['CSR', 'sustainability', 'ESG'].concat(mots.slice(0, 2)).map(quote).join(' OR ') + ')') + '&location=' + e('European Union') + '&f_TPR=' + fr[0] + '&sortBy=DD', 'Recherche en anglais : CSR, sustainability, ESG.']
    ]]
  ];
}
const OALERTES = [
  ['linkedin', 'LinkedIn', ['Ouvrez « LinkedIn · offres » ci-dessus, connecté à votre compte.', 'En haut des résultats, activez l\'interrupteur « Alerte emploi ».', 'Dans l\'application LinkedIn du téléphone, autorisez les notifications : chaque nouvelle offre correspondante vous est signalée.']],
  ['indeed', 'Indeed', ['Ouvrez « Indeed » ci-dessus.', 'Cliquez sur « Recevoir les nouvelles offres » ou sur la cloche, puis indiquez votre adresse.', 'Installez l\'application Indeed et autorisez les notifications.']],
  ['ft', 'France Travail', ['Connectez-vous à votre espace France Travail.', 'Lancez la recherche « France Travail » ci-dessus puis créez une alerte sur cette recherche.', 'L\'application France Travail vous prévient des nouvelles offres.']],
  ['wttj', 'Welcome to the Jungle', ['Ouvrez « Welcome to the Jungle » ci-dessus et connectez-vous.', 'Affinez par type de contrat, puis cliquez sur « Créer une alerte ».']],
  ['hw', 'HelloWork', ['Ouvrez « HelloWork » ci-dessus.', 'Cliquez sur « Créer une alerte » et choisissez la fréquence.']],
  ['apec', 'APEC', ['Créez un compte APEC, lancez la recherche ci-dessus.', 'Enregistrez-la en alerte pour recevoir les nouvelles offres.']],
  ['galerte', 'Google Alertes', ['Ouvrez « Google Alertes » ci-dessus, connecté à votre compte Google.', 'Dans les options, choisissez « Au fur et à mesure » et « Toutes les régions » ou « France ».', 'Créez une alerte par mot-clé important (par exemple « alternance RSE » et « alternance CSRD »).']],
  ['reseaux', 'Réseaux sociaux', ['Sur LinkedIn, suivez les pages des entreprises de vos cibles et activez la cloche sur les profils des responsables RSE.', 'Sur Facebook, rejoignez 3 à 5 groupes emploi RSE ou développement durable de votre région et activez les notifications de publication.']]
];

async function chargerOffres(silencieux){
  try { const d = await fetch('data/offres.json', {cache: 'no-cache'}).then(r => r.json()); O.offres = arr(d.offres).sort((a, b) => String(b.date).localeCompare(String(a.date))); O.maj = d.maj || ''; O.note = d.note || ''; O.charge = true; }
  catch(e) { O.charge = true; if (!silencieux) {} }
  const vu = LS.get('offres-vu') || new Date(Date.now() - 864e5).toISOString();
  const types = oPrefs().types;
  O.nouv = new Set(O.offres.filter(o => String(o.date) > vu && (!types.length || types.includes(o.type))).map(o => o.id));
  badgeOffres(); notifierOffres(); if (route().base === "offres") renderOffres();
}
function badgeOffres(force){
  const n = force === 0 ? 0 : O.nouv.size, a = document.querySelector('#nav a[data-id="offres"]');
  if (a) { let b = a.querySelector('.nbadge'); if (n) { if (!b) { b = document.createElement('span'); b.className = 'nbadge'; a.appendChild(b); } b.textContent = n > 99 ? '99+' : n; } else if (b) b.remove(); }
  const c = document.querySelector('#bottomnav a[data-g="carriere"]'); if (c) c.classList.toggle('dot', !!n); try { renderDash(); } catch(e) {}
}
function marquerOffresVues(){ const max = O.offres.map(o => String(o.date)).sort().pop(); if (max) LS.set('offres-vu', max); badgeOffres(0); }
function notifierOffres(){
  const nouv = O.offres.filter(o => O.nouv.has(o.id)); if (!nouv.length) return;
  const deja = new Set((LS.get('offres-notifiees') || '').split(',').filter(Boolean));
  const L = nouv.filter(o => !deja.has(o.id)); if (!L.length) return;
  if (route().base !== 'offres') toast(L.length + ' nouvelle' + (L.length > 1 ? 's' : '') + ' offre' + (L.length > 1 ? 's' : '') + ' RSE · voir Offres et alertes', 4500);
  if (notifActives()) {
    if (L.length === 1) envoyerNotif('Nouvelle offre RSE · ' + (OTYPES.find(t => t[0] === L[0].type) || ['', ''])[1], L[0].titre + (L[0].entreprise ? ' – ' + L[0].entreprise : '') + (L[0].lieu ? ' (' + L[0].lieu + ')' : ''), 'offre-' + L[0].id);
    else envoyerNotif(L.length + ' nouvelles offres RSE', L.slice(0, 3).map(o => '• ' + o.titre).join('\n'), 'offres-' + Date.now());
  }
  L.forEach(o => deja.add(o.id)); LS.set('offres-notifiees', [...deja].slice(-800).join(','));
}
const oDate = s => { const d = new Date(s); if (isNaN(d)) return ''; const m = Math.round((Date.now() - d) / 6e4); return m < 60 ? 'il y a ' + Math.max(1, m) + ' min' : m < 1440 ? 'il y a ' + Math.round(m / 60) + ' h' : d.toLocaleDateString('fr-FR'); };
function renderOffres(){
  const el = document.getElementById('offRoot'); if (!el) return;
  const p = oPrefs(), on = notifActives();
  let h = '<div class="eyebrow">CARRIÈRE · OFFRES</div><h2>Offres et alertes RSE</h2><p class="lead">Toutes les offres RSE, développement durable, ESG et CSRD : emploi, alternance, contrat de professionnalisation, stage, intérim et missions. Réglez votre recherche une fois, ouvrez toutes les plateformes en un clic, activez les alertes et soyez parmi les premiers à postuler.</p>';
  h += '<div class="card"><h3 style="margin-top:0">1. Ce que je cherche</h3><div class="filters">' + OTYPES.map(([id, l]) => '<button class="chip' + (p.types.includes(id) ? ' on' : '') + '" data-of="type" data-v="' + id + '">' + esc(l) + '</button>').join('') + '</div>'
    + '<div class="progress">Mots-clés</div><div class="filters">' + OMOTS.map(m => '<button class="chip' + (p.mots.includes(m) ? ' on' : '') + '" data-of="mot" data-v="' + esc(m) + '">' + esc(m) + '</button>').join('') + '</div>'
    + '<div class="entgrid ofgrid"><label>Autres mots-clés (séparés par des virgules)<input class="inp" id="ofAutre" value="' + esc(p.autre) + '" placeholder="Ex. : reporting extra-financier, ISO 14001"></label><label>Lieu<input class="inp" id="ofLieu" value="' + esc(p.lieu) + '" placeholder="France, Lyon, Rhône…"></label><label>Publiées<select class="inp" id="ofFr">' + OFRAICH.map(([v, l]) => '<option value="' + v + '"' + (p.fraich === v ? ' selected' : '') + '>' + l + '</option>').join('') + '</select></label></div></div>';
  h += '<h3>2. Ouvrir les offres maintenant</h3><p class="prose">Chaque bouton ouvre la plateforme avec votre recherche déjà remplie, les offres les plus récentes en premier.</p>';
  const types = p.types.length ? p.types : ['emploi'];
  h += types.map(t => '<details class="ofbloc"' + (types.length === 1 || t === types[0] ? ' open' : '') + '><summary>' + esc((OTYPES.find(x => x[0] === t) || ['', t])[1]) + '</summary>' + oLiens(t).map(([g, L]) => '<div class="progress ofg">' + esc(g) + '</div><div class="oflinks">' + L.map(([n, u, d]) => '<a class="oflink" href="' + esc(u) + '" target="_blank" rel="noopener"><strong>' + esc(n) + ' →</strong><span>' + esc(d) + '</span></a>').join('') + '</div>').join('') + '</details>').join('');
  const nb = OALERTES.filter(a => p.faits[a[0]]).length;
  h += '<h3>3. Mes alertes en temps réel <span class="pill' + (nb === OALERTES.length ? '' : ' o') + '">' + nb + ' / ' + OALERTES.length + ' activées</span></h3><p class="prose">Pour être prévenu à la minute, il faut l\'alerte de chaque plateforme : ce sont leurs propres notifications qui arrivent sur votre téléphone dès qu\'une offre est publiée. Créez-les une fois, puis cochez-les ici.</p><div class="grid two">'
    + OALERTES.map(([id, n, steps]) => '<div class="card ofal' + (p.faits[id] ? ' ok' : '') + '"><label class="chk ofchk"><input type="checkbox" data-of="fait" data-v="' + id + '"' + (p.faits[id] ? ' checked' : '') + '> <strong>' + esc(n) + '</strong></label><ol>' + steps.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol></div>').join('') + '</div>';
  const L = O.offres.filter(o => (O.voir === 'tout' ? (!p.types.length || p.types.includes(o.type)) : o.type === O.voir));
  h += '<h3>4. Les offres du jour dans l\'application' + (O.nouv.size ? ' <span class="pill r">' + O.nouv.size + ' nouvelle' + (O.nouv.size > 1 ? 's' : '') + '</span>' : '') + '</h3>'
    + '<div class="notifbar"><div><strong>' + (on ? 'Notifications activées' : 'Être prévenu des nouvelles offres') + '</strong><span>' + (on ? 'Une notification arrive pour chaque nouvelle offre correspondant à vos types de contrat, à l\'ouverture de l\'application et toutes les 10 minutes tant qu\'elle est ouverte.' : 'Recevez une notification sur cet appareil quand le robot trouve une nouvelle offre correspondant à votre recherche.') + '</span></div>' + (on ? '<button class="btn ghost sm" data-act2="notifOff">Désactiver</button>' : '<button class="btn sm" data-act2="notifOn">Activer les notifications</button>') + '</div>';
  if (!O.offres.length) h += '<div class="callout b"><strong>Le fil d\'offres n\'est pas encore activé</strong>Il se remplit automatiquement chaque heure dès que le robot des offres est mis en route sur GitHub avec une clé gratuite de France Travail (voir le guide, partie 11). En attendant, utilisez les boutons et les alertes ci-dessus : ils fonctionnent tout de suite.</div>';
  else {
    h += '<div class="filters"><button class="chip' + (O.voir === 'tout' ? ' on' : '') + '" data-of="voir" data-v="tout">Mes types de contrat</button>' + OTYPES.filter(([id]) => O.offres.some(o => o.type === id)).map(([id, l]) => '<button class="chip' + (O.voir === id ? ' on' : '') + '" data-of="voir" data-v="' + id + '">' + esc(l) + ' (' + O.offres.filter(o => o.type === id).length + ')</button>').join('') + '</div>'
      + '<p class="progress">' + L.length + ' offre' + (L.length > 1 ? 's' : '') + (O.maj ? ' · mise à jour ' + oDate(O.maj) : '') + '</p>'
      + L.slice(0, 120).map(o => '<div class="card ofcard"><div class="meta">' + (O.nouv.has(o.id) ? '<span class="pill r">Nouveau</span>' : '') + '<span class="pill">' + esc((OTYPES.find(t => t[0] === o.type) || ['', o.contrat || ''])[1]) + '</span>' + (o.contrat ? '<span class="pill g">' + esc(o.contrat) + '</span>' : '') + '<span class="actu-d">' + esc(oDate(o.date)) + '</span></div><h4>' + esc(o.titre) + '</h4><p class="ofent">' + esc([o.entreprise, o.lieu].filter(Boolean).join(' · ')) + '</p>' + (o.extrait ? '<p>' + esc(o.extrait) + '</p>' : '') + '<div class="ctool">' + (safeUrl(o.url) ? '<a class="btn sm" href="' + esc(o.url) + '" target="_blank" rel="noopener">Voir et postuler →</a>' : '') + '<button class="btn ghost sm" data-of="suivre" data-v="' + esc(o.id) + '">Suivre dans mes candidatures</button>' + (o.entreprise ? '<button class="linkbtn" data-of="ent" data-v="' + esc(o.entreprise) + '">Fiche RSE de l\'entreprise</button>' : '') + '</div><div class="actu-src">Source : ' + esc(o.source || 'France Travail') + '</div></div>').join('');
  }
  h += '<div class="callout"><strong>Ce que l\'application peut et ne peut pas faire</strong>LinkedIn, Indeed, Welcome to the Jungle et Facebook ne permettent pas à une autre application de lire leurs offres : leurs conditions l\'interdisent. C\'est pourquoi l\'application ouvre leurs recherches toutes prêtes et vous fait activer leurs propres alertes, qui sont les plus rapides. Le fil intégré, lui, reprend les offres officielles de France Travail, qui incluent celles de nombreux sites partenaires.</div>';
  el.innerHTML = h;
}
const offRoot = document.getElementById('offRoot');
offRoot.addEventListener('click', async ev => {
  const n = ev.target.closest('[data-act2]'); if (n) { if (n.dataset.act2 === 'notifOn') { await activerNotifs(); } else desactiverNotifs(); renderOffres(); return; }
  const b = ev.target.closest('[data-of]'); if (!b) return;
  const p = oPrefs(), a = b.dataset.of, v = b.dataset.v, tog = (L, x) => L.includes(x) ? L.filter(y => y !== x) : L.concat(x);
  if (a === 'type') { p.types = tog(p.types, v); oSave(); chargerOffres(true); renderOffres(); }
  else if (a === 'mot') { p.mots = tog(p.mots, v); oSave(); renderOffres(); }
  else if (a === 'voir') { O.voir = v; renderOffres(); }
  else if (a === 'fait') { p.faits[v] = b.checked; oSave(); renderOffres(); }
  else if (a === 'ent') { N.f = {q: v, departement: '', section: '', cat: '', sig: {}}; N.tab = 'chercher'; N.res = []; location.hash = 'entreprises'; chercherEnt(1); }
  else if (a === 'suivre') { const o = O.offres.find(x => x.id === v); if (o) candModal({entreprise: o.entreprise || '', poste: o.titre, contrat: {alternance: 'Alternance (apprentissage)', pro: 'Contrat de professionnalisation', stage: 'Stage', freelance: 'Freelance'}[o.type] || (/CDI/.test(o.contrat || '') ? 'CDI' : 'CDD'), statut: 'À envoyer', lien: o.url, notes: (o.lieu || '') + ' · trouvée le ' + new Date().toLocaleDateString('fr-FR')}); }
});
offRoot.addEventListener('change', ev => {
  const p = oPrefs();
  if (ev.target.id === 'ofAutre') { p.autre = ev.target.value; oSave(); renderOffres(); }
  else if (ev.target.id === 'ofLieu') { p.lieu = ev.target.value.trim() || 'France'; oSave(); renderOffres(); }
  else if (ev.target.id === 'ofFr') { p.fraich = ev.target.value; oSave(); renderOffres(); }
});
function oRoute(){ if (route().base !== 'offres') return; renderOffres(); marquerOffresVues(); }
window.addEventListener('hashchange', oRoute);
chargerOffres(true).then(oRoute);
setInterval(() => chargerOffres(true).then(() => { if (route().base === 'offres') marquerOffresVues(); }), 10 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') chargerOffres(true); });


/* =====================================================================
   DATES DE VÉRIFICATION, LECTURE À VOIX HAUTE, AGENDA UNIFIÉ
   ===================================================================== */
const VERIF = '1er novembre 2026';
['fondamentaux', 'histoire', 'europe', 'france', 'csrd', 'taxonomie', 'reporting', 'normes', 'secteurs', 'metier', 'methodes', 'modeles', 'outils', 'glossaire', 'sources'].forEach(id => {
  const sec = document.getElementById(id); if (!sec) return; const h = sec.querySelector('h2'); if (!h || sec.querySelector('.verif')) return;
  const d = document.createElement('div'); d.className = 'verif'; d.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg> Contenu vérifié le ' + VERIF + ' · <a href="#sources">sources officielles</a>';
  h.insertAdjacentElement('afterend', d);
});

/* ---------- Écouter la page ---------- */
const VOIX = {on: false, q: []};
function voixFr(){ const L = (window.speechSynthesis && speechSynthesis.getVoices()) || []; return L.find(v => /^fr(-|_)FR/i.test(v.lang) && /google|natural|premium|enhanced/i.test(v.name)) || L.find(v => /^fr(-|_)FR/i.test(v.lang)) || L.find(v => /^fr/i.test(v.lang)) || null; }
function texteAEcouter(){
  const sec = document.querySelector('section.view.on'); if (!sec) return '';
  const c = sec.cloneNode(true); c.querySelectorAll('button, .ctool, .filters, select, input, textarea, svg, .verif, .tablewrap, nav, .foot').forEach(x => x.remove());
  c.querySelectorAll('details').forEach(d => { if (!d.open) { const s = d.querySelector('summary'); d.innerHTML = ''; if (s) d.appendChild(s); } });
  return c.innerText.replace(/[→•·]/g, ' ').replace(/\s*\n\s*/g, '. ').replace(/\.\s*\./g, '.').replace(/\s+/g, ' ').trim();
}
function majBtnVoix(){ const b = document.getElementById('voixBtn'); if (b) { b.classList.toggle('on', VOIX.on); b.setAttribute('aria-label', VOIX.on ? 'Arrêter la lecture' : 'Écouter cette page'); b.title = VOIX.on ? 'Arrêter la lecture' : 'Écouter cette page'; } }
function stopVoix(){ VOIX.on = false; VOIX.q = []; try { speechSynthesis.cancel(); } catch(e) {} majBtnVoix(); }
function lireSuite(){
  if (!VOIX.on) return; const t = VOIX.q.shift(); if (!t) { stopVoix(); return; }
  const u = new SpeechSynthesisUtterance(t); const v = voixFr(); if (v) u.voice = v; u.lang = v ? v.lang : 'fr-FR'; u.rate = +(LS.get('voix-vitesse') || 0.95); u.pitch = 1;
  u.onend = lireSuite; u.onerror = () => stopVoix(); speechSynthesis.speak(u);
}
function ecouter(){
  if (!('speechSynthesis' in window)) { toast('La lecture à voix haute n\'est pas disponible sur ce navigateur'); return; }
  if (VOIX.on) { stopVoix(); return; }
  const t = texteAEcouter(); if (!t) { toast('Rien à lire sur cette page'); return; }
  VOIX.q = (t.match(/[^.!?;:]+[.!?;:]*/g) || [t]).reduce((acc, ph) => { const l = acc[acc.length - 1]; if (l && (l + ph).length < 220) acc[acc.length - 1] = l + ph; else acc.push(ph.trim()); return acc; }, []).filter(Boolean);
  VOIX.on = true; majBtnVoix(); speechSynthesis.cancel(); lireSuite(); toast('Lecture de la page… touchez à nouveau pour arrêter', 3000);
}
const voixBtn = document.getElementById('voixBtn'); if (voixBtn) voixBtn.addEventListener('click', ecouter);
if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
window.addEventListener('hashchange', () => { if (VOIX.on) stopVoix(); });

/* ---------- Agenda unifié ---------- */
const ECHEANCES = [
  {debut: '2027-01-01', titre: 'ESRS révisés obligatoires', resume: 'Les ESRS révisés (règlement délégué (UE) 2026/1563) s\'appliquent aux exercices ouverts à partir du 1er janvier 2027.', lieu: 'Union européenne', url: ''},
  {debut: '2027-03-01', titre: 'Publication de l\'index de l\'égalité professionnelle', resume: 'Chaque année au plus tard le 1er mars, pour les entreprises d\'au moins 50 salariés (dispositif appelé à évoluer avec la loi sur la transparence salariale).', lieu: 'France', url: ''},
  {debut: '2027-03-19', titre: 'Date limite de transposition de l\'Omnibus I', resume: 'La France doit avoir transposé la directive (UE) 2026/470 qui réduit le champ de la CSRD.', lieu: 'France', url: ''},
  {debut: '2027-09-30', titre: 'Déclaration OPERAT (décret tertiaire)', resume: 'Déclaration annuelle des consommations d\'énergie des bâtiments tertiaires de 1 000 m² ou plus, avant le 30 septembre.', lieu: 'France', url: 'https://operat.ademe.fr/'},
  {debut: '2029-07-26', titre: 'Application de la CSDDD (devoir de vigilance européen)', resume: 'Pour les entreprises de plus de 5 000 salariés et 1,5 Md€ de chiffre d\'affaires.', lieu: 'Union européenne', url: ''}
];
const AG = {perso: [], f: 'tout'};
async function agInit(){ try { const k = IDB.db && await IDB.get('kv', 'agenda'); AG.perso = k ? arr(k.liste) : []; } catch(e) { AG.perso = []; } renderAgenda(); }
const agSave = () => IDB.put('kv', {id: 'agenda', liste: AG.perso, updatedAt: Date.now()}).catch(() => toast('Enregistrement impossible'));
function agItems(){
  const t = ajd(), L = [];
  try { arr(A.agenda).forEach(e => L.push(Object.assign({cat: 'evt', catL: e.type || 'Événement'}, e))); } catch(e) {}
  ECHEANCES.forEach(e => L.push(Object.assign({cat: 'reg', catL: 'Échéance réglementaire'}, e)));
  arr(T.cands).filter(c => c.relance && ['Envoyée', 'Relancée'].includes(c.statut)).forEach(c => L.push({cat: 'cand', catL: 'Relance de candidature', debut: c.relance, titre: 'Relancer ' + c.entreprise, resume: c.poste, lieu: '', go: 'candidatures'}));
  try { const due = E.notions.filter(n => (n.next || 0) <= Date.now()).length; if (due) L.push({cat: 'rev', catL: 'Révisions', debut: t, titre: due + ' notion' + (due > 1 ? 's' : '') + ' à réviser', resume: 'Fiches mémo de votre espace cours', go: 'cours'}); } catch(e) {}
  AG.perso.forEach(e => L.push(Object.assign({cat: 'perso', catL: 'Personnel'}, e)));
  return L.filter(e => (e.fin || e.debut) >= t).sort((a, b) => a.debut.localeCompare(b.debut));
}
const AGCAT = [['tout', 'Tout'], ['evt', 'COP et événements'], ['reg', 'Échéances réglementaires'], ['cand', 'Candidatures'], ['rev', 'Révisions'], ['perso', 'Personnel']];
const AGCOL = {evt: '#A8621A', reg: '#2357A6', cand: '#C2532A', rev: '#0F5B3E', perso: '#6B4BA1'};
function renderAgenda(){
  const el = document.getElementById('agendaRoot'); if (!el) return;
  const all = agItems(), L = AG.f === 'tout' ? all : all.filter(e => e.cat === AG.f);
  let h = '<div class="eyebrow">VEILLE · MON AGENDA</div><h2>Mon agenda RSE</h2><p class="lead">Tout ce qui compte au même endroit : les COP et salons, les échéances réglementaires, vos relances de candidatures, vos révisions et vos propres rendez-vous. Exportez-le en un clic vers l\'agenda de votre téléphone ou d\'Outlook.</p>'
    + '<div class="ctool"><button class="btn" data-ag="add">+ Ajouter un rendez-vous</button><button class="btn ghost" data-ag="export">Tout exporter vers mon agenda</button></div>'
    + '<div class="filters">' + AGCAT.map(([k, l]) => '<button class="chip' + (AG.f === k ? ' on' : '') + '" data-ag="f" data-k="' + k + '">' + l + (k !== 'tout' ? ' (' + all.filter(e => e.cat === k).length + ')' : '') + '</button>').join('') + '</div>';
  if (!L.length) h += '<div class="callout b"><strong>Rien de prévu dans cette catégorie</strong>Ajoutez un rendez-vous ou choisissez une autre catégorie.</div>';
  let mois = '';
  L.forEach(e => {
    const m = e.debut.slice(0, 7); if (m !== mois) { mois = m; const [y, mm] = m.split('-').map(Number); h += '<h3 class="agm">' + ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'][mm - 1] + ' ' + y + '</h3>'; }
    const d = new Date(e.debut + 'T12:00:00'), s = etatEvt(e);
    h += '<div class="agi" style="--agc:' + AGCOL[e.cat] + '"><div class="agd"><span>' + d.getDate() + '</span><small>' + MOIS[d.getMonth()] + '</small></div><div class="agb"><div class="meta"><span class="pill" style="background:color-mix(in srgb,' + AGCOL[e.cat] + ' 14%,transparent);color:' + AGCOL[e.cat] + '">' + esc(e.catL) + '</span><span class="pill g">' + esc(s.txt) + '</span></div><h4>' + esc(e.titre) + '</h4>' + (e.fin && e.fin !== e.debut ? '<div class="progress">' + esc(periode(e)) + '</div>' : '') + (e.resume || e.lieu ? '<p>' + esc([e.lieu, e.resume].filter(Boolean).join(' · ')) + '</p>' : '') + '<div class="ctool">' + (e.go ? '<a class="btn ghost sm" href="#' + e.go + '">Ouvrir</a>' : '') + '<button class="btn ghost sm" data-ag="ics" data-k="' + esc(e.cat + '|' + e.debut + '|' + e.titre) + '">Ajouter à mon agenda</button>' + (safeUrl(e.url) ? '<a class="linkbtn" href="' + esc(e.url) + '" target="_blank" rel="noopener">Site officiel →</a>' : '') + (e.cat === 'perso' ? '<button class="linkbtn" style="color:var(--danger)" data-ag="del" data-k="' + esc(e.id) + '">Supprimer</button>' : '') + '</div></div></div>';
  });
  el.innerHTML = h;
}
document.getElementById('agendaRoot').addEventListener('click', e => {
  const b = e.target.closest('[data-ag]'); if (!b) return; const a = b.dataset.ag;
  if (a === 'f') { AG.f = b.dataset.k; renderAgenda(); }
  else if (a === 'export') { const L = agItems(); if (!L.length) return toast('Agenda vide'); icsFile(L, 'Agenda SERIKI BIBLE RSE'); toast(L.length + ' rendez-vous exportés'); }
  else if (a === 'ics') { const ev = agItems().find(x => (x.cat + '|' + x.debut + '|' + x.titre) === b.dataset.k); if (ev) icsFile([ev], ev.titre); }
  else if (a === 'del') { AG.perso = AG.perso.filter(x => x.id !== b.dataset.k); agSave(); renderAgenda(); toast('Rendez-vous supprimé'); }
  else if (a === 'add') modal('Nouveau rendez-vous', '<div class="row"><label for="agT">Titre</label><input class="inp" id="agT" placeholder="Ex. : Entretien chez…, partiel, colloque"></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label for="agD">Date</label><input class="inp" id="agD" type="date" value="' + ajd() + '"></div><div class="row"><label for="agF">Fin (facultatif)</label><input class="inp" id="agF" type="date"></div></div><div class="row"><label for="agL">Lieu</label><input class="inp" id="agL"></div><div class="row"><label for="agN">Note</label><input class="inp" id="agN"></div>', 'Ajouter', async () => {
    const v = id => document.getElementById(id).value.trim(); if (!v('agT') || !v('agD')) { toast('Indiquez au moins un titre et une date'); return false; }
    AG.perso.push({id: uid(), titre: v('agT'), debut: v('agD'), fin: v('agF') && v('agF') >= v('agD') ? v('agF') : '', lieu: v('agL'), resume: v('agN')}); await agSave(); renderAgenda(); toast('Rendez-vous ajouté');
  });
});
window.addEventListener('hashchange', () => { if (route().base === 'agenda') renderAgenda(); });
(typeof espaceReady !== 'undefined' ? espaceReady : Promise.resolve()).then(agInit, agInit);


/* =====================================================================
   L'ESSENTIEL EN 3 POINTS, SCHÉMAS, SECTEURS HARMONISÉS
   ===================================================================== */
const ESSENTIEL = {
  fondamentaux: ['La RSE est la responsabilité des entreprises à l\'égard des effets qu\'elles exercent sur la société et l\'environnement.', 'L\'ESG regroupe les critères environnementaux, sociaux et de gouvernance qu\'utilisent les investisseurs et les banques pour évaluer une entreprise.', 'La double matérialité croise deux regards : les impacts de l\'entreprise sur le monde, et les risques et opportunités que le monde fait peser sur ses finances.'],
  histoire: ['1987 : le rapport Brundtland définit le développement durable ; 2015 : Accord de Paris et Objectifs de développement durable.', '2019-2024 : le Pacte vert européen crée la CSRD, la taxonomie, la CSDDD et l\'ECGT.', '2025-2026 : le paquet Omnibus simplifie et réduit fortement le nombre d\'entreprises soumises.'],
  europe: ['La CSRD fixe le reporting de durabilité, les ESRS en donnent le contenu, la taxonomie classe les activités durables.', 'La CSDDD impose un devoir de vigilance sur la chaîne de valeur, la SFDR informe les investisseurs, l\'ECGT encadre les allégations environnementales.', 'Depuis l\'Omnibus I (en vigueur le 18 mars 2026), la CSRD vise les entreprises de plus de 1 000 salariés et 450 M€ de chiffre d\'affaires.'],
  france: ['Le devoir de vigilance (2017) s\'impose dès 5 000 salariés en France, filiales comprises.', 'Le bilan de gaz à effet de serre (BEGES) est obligatoire dès 500 salariés, tous les 4 ans, avec un plan de transition.', 'Les lois AGEC et Climat et Résilience, l\'index de l\'égalité (dès 50 salariés) et le décret tertiaire complètent le socle français.'],
  csrd: ['Qui : les entreprises au-dessus des seuils de l\'Omnibus ; les autres peuvent utiliser la norme volontaire européenne.', 'Quoi : une analyse de double matérialité, puis les informations des normes ESRS jugées matérielles.', 'Quand : les ESRS révisés sont obligatoires pour les exercices ouverts à partir du 1er janvier 2027, avec une vérification par un auditeur.'],
  taxonomie: ['La taxonomie classe les activités économiques qui contribuent à six objectifs environnementaux.', 'Une activité est alignée si elle contribue substantiellement à un objectif, ne nuit significativement à aucun autre (DNSH) et respecte des garanties sociales minimales.', 'On publie la part alignée du chiffre d\'affaires, des investissements (CapEx) et des dépenses d\'exploitation (OpEx).'],
  reporting: ['Scope 1 : émissions directes ; scope 2 : énergie achetée ; scope 3 : toute la chaîne de valeur, souvent la plus grosse part.', 'Chaque poste se calcule ainsi : donnée d\'activité × facteur d\'émission (Base Empreinte de l\'ADEME en France).', 'Un bon reporting suit un cycle : définir, collecter, contrôler, consolider, publier, avec une piste d\'audit.'],
  normes: ['ISO 26000 donne des lignes directrices RSE mais ne se certifie pas ; ISO 14001, 45001 et 50001 se certifient.', 'Le GHG Protocol et la méthode Bilan Carbone servent à mesurer les émissions ; la SBTi valide les trajectoires de réduction.', 'EcoVadis, B Corp et le label Lucie évaluent ou labellisent une démarche RSE globale.'],
  secteurs: ['Les enjeux matériels changent fortement d\'un secteur à l\'autre : c\'est le point de départ de toute analyse.', 'Agroalimentaire : l\'amont agricole ; industrie : l\'énergie ; finance : les émissions financées ; numérique : les équipements.', 'Chaque fiche donne les indicateurs suivis, les textes, les besoins des entreprises et les missions possibles.'],
  metier: ['Le chargé de mission RSE pilote une transformation : il mesure, convainc et fait avancer des projets transverses.', 'Les compétences clés : réglementation, carbone, gestion de projet, communication et maîtrise des données.', 'Les premiers mois : écouter, diagnostiquer, obtenir des résultats rapides, puis bâtir une feuille de route.']
};
Object.entries(ESSENTIEL).forEach(([id, pts]) => {
  const sec = document.getElementById(id); if (!sec) return; const anc = sec.querySelector('.verif') || sec.querySelector('h2'); if (!anc || sec.querySelector('.essentiel')) return;
  const d = document.createElement('div'); d.className = 'essentiel';
  d.innerHTML = '<div class="ess-t">L\'essentiel en 3 points</div><ol>' + pts.map(p => '<li>' + esc(p) + '</li>').join('') + '</ol>';
  anc.insertAdjacentElement('afterend', d);
});
const SCHEMAS = {
  scopes: '<figure class="schema" aria-label="Schéma des trois scopes d\'émissions"><svg viewBox="0 0 760 300" role="img" aria-label="Scope 3 amont, scopes 1 et 2 de l\'entreprise, scope 3 aval"><rect x="10" y="40" width="210" height="220" rx="18" fill="#DCE5F4"/><text x="115" y="72" text-anchor="middle" font-weight="800" font-size="17" fill="#1D4C92">Scope 3 amont</text><text x="115" y="104" text-anchor="middle" font-size="13.5" fill="#12241C">Achats de biens</text><text x="115" y="128" text-anchor="middle" font-size="13.5" fill="#12241C">et de services</text><text x="115" y="158" text-anchor="middle" font-size="13.5" fill="#12241C">Transport amont</text><text x="115" y="188" text-anchor="middle" font-size="13.5" fill="#12241C">Déplacements</text><text x="115" y="212" text-anchor="middle" font-size="13.5" fill="#12241C">des salariés</text><rect x="275" y="20" width="210" height="260" rx="18" fill="#0F5B3E"/><text x="380" y="52" text-anchor="middle" font-weight="800" font-size="17" fill="#FFFFFF">L\'entreprise</text><rect x="295" y="72" width="170" height="86" rx="12" fill="#FFFFFF"/><text x="380" y="102" text-anchor="middle" font-weight="800" font-size="15" fill="#0F5B3E">Scope 1</text><text x="380" y="124" text-anchor="middle" font-size="13" fill="#12241C">Chaudières, fours,</text><text x="380" y="144" text-anchor="middle" font-size="13" fill="#12241C">véhicules, fuites</text><rect x="295" y="172" width="170" height="86" rx="12" fill="#DCEBDF"/><text x="380" y="202" text-anchor="middle" font-weight="800" font-size="15" fill="#0F5B3E">Scope 2</text><text x="380" y="224" text-anchor="middle" font-size="13" fill="#12241C">Électricité, chaleur</text><text x="380" y="244" text-anchor="middle" font-size="13" fill="#12241C">et froid achetés</text><rect x="540" y="40" width="210" height="220" rx="18" fill="#F3E8D2"/><text x="645" y="72" text-anchor="middle" font-weight="800" font-size="17" fill="#8A4F12">Scope 3 aval</text><text x="645" y="104" text-anchor="middle" font-size="13.5" fill="#12241C">Transport aval</text><text x="645" y="134" text-anchor="middle" font-size="13.5" fill="#12241C">Utilisation des</text><text x="645" y="158" text-anchor="middle" font-size="13.5" fill="#12241C">produits vendus</text><text x="645" y="188" text-anchor="middle" font-size="13.5" fill="#12241C">Fin de vie</text><text x="645" y="212" text-anchor="middle" font-size="13.5" fill="#12241C">Investissements</text><path d="M224 150h46" stroke="#4A5D53" stroke-width="2.5" marker-end="url(#fl)"/><path d="M489 150h46" stroke="#4A5D53" stroke-width="2.5" marker-end="url(#fl)"/><defs><marker id="fl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="#4A5D53"/></marker></defs></svg><figcaption>Le scope 3 représente souvent la plus grande part du bilan : c\'est là que se jouent les achats, les fournisseurs et l\'usage des produits.</figcaption></figure>',
  materialite: '<figure class="schema" aria-label="Schéma de la double matérialité"><svg viewBox="0 0 760 300" role="img" aria-label="Matérialité d\'impact et matérialité financière se croisent"><circle cx="290" cy="150" r="130" fill="#0F5B3E" fill-opacity="0.16" stroke="#0F5B3E" stroke-width="2"/><circle cx="470" cy="150" r="130" fill="#2357A6" fill-opacity="0.16" stroke="#2357A6" stroke-width="2"/><text x="225" y="120" text-anchor="middle" font-weight="800" font-size="17" fill="#0F5B3E">Matérialité</text><text x="225" y="142" text-anchor="middle" font-weight="800" font-size="17" fill="#0F5B3E">d\'impact</text><text x="225" y="172" text-anchor="middle" font-size="13" fill="#12241C">L\'entreprise agit</text><text x="225" y="190" text-anchor="middle" font-size="13" fill="#12241C">sur le monde</text><text x="535" y="120" text-anchor="middle" font-weight="800" font-size="17" fill="#1D4C92">Matérialité</text><text x="535" y="142" text-anchor="middle" font-weight="800" font-size="17" fill="#1D4C92">financière</text><text x="535" y="172" text-anchor="middle" font-size="13" fill="#12241C">Le monde agit sur</text><text x="535" y="190" text-anchor="middle" font-size="13" fill="#12241C">les finances</text><text x="380" y="146" text-anchor="middle" font-weight="800" font-size="15" fill="#12241C">Enjeu</text><text x="380" y="166" text-anchor="middle" font-weight="800" font-size="15" fill="#12241C">matériel</text></svg><figcaption>Un enjeu est matériel dès qu\'il l\'est sous l\'un des deux angles ; il est alors traité dans le rapport de durabilité.</figcaption></figure>'
};
[['reporting', 'Les 3 scopes du GHG Protocol', 'scopes'], ['csrd', 'La double matérialité, pas à pas', 'materialite']].forEach(([id, titre, k]) => {
  const sec = document.getElementById(id); if (!sec) return; const h = [...sec.querySelectorAll('h3')].find(x => x.textContent.trim() === titre); if (!h) return;
  h.insertAdjacentHTML('afterend', SCHEMAS[k]);
});
function renderSecteurs(){
  const el = document.getElementById('sectorList'); if (!el || !N.ref) return;
  el.innerHTML = '<p class="prose">' + N.ref.profils.length + ' profils sectoriels, les mêmes que ceux de l\'annuaire des entreprises : chaque fiche d\'entreprise s\'appuie sur le profil de son secteur.</p>' + N.ref.profils.map(p => '<details data-s="1"><summary>' + esc(p.nom) + '</summary><div class="inner"><div class="grid two"><div><h4>Enjeux matériels typiques</h4><ul>' + p.enjeux.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div><h4>Indicateurs suivis</h4><ul>' + p.indicateurs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h4>Normes ESRS souvent matérielles</h4><div class="meta">' + p.esrs.map(x => '<span class="pill">' + x + '</span>').join('') + '</div></div><div><h4>Textes et référentiels</h4><ul>' + p.referentiels.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div><h4>Besoins fréquents des entreprises</h4><ul>' + p.besoins.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div><h4>Missions possibles pour un alternant ou un chargé de mission</h4><ol class="steps">' + p.missions.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><p><a class="btn ghost sm" href="#entreprises">Trouver des entreprises de ce secteur →</a></p></div></details>').join('');
  try { buildIndex(); } catch(e) {}
}

/* =====================================================================
   AUTODIAGNOSTIC RSE POUR TOUTES LES ENTREPRISES
   ===================================================================== */
const DIAG_PILIERS = [
  ['gouv', 'Gouvernance et stratégie', '#0F5B3E', [
    ['La direction a formalisé des engagements RSE (politique, raison d\'être ou feuille de route) ?', 'Rédiger une politique RSE d\'une page, signée par la direction, avec 3 à 5 engagements datés.', 3],
    ['Une personne est clairement chargée de la RSE, avec du temps et un budget ?', 'Nommer un référent RSE, lui donner du temps dédié et un budget annuel, même modeste.', 3],
    ['Les enjeux prioritaires de l\'entreprise ont été identifiés avec les parties prenantes (salariés, clients, fournisseurs) ?', 'Mener un diagnostic des enjeux prioritaires (analyse de matérialité simplifiée) avec quelques parties prenantes.', 2],
    ['Des indicateurs RSE sont suivis et présentés au moins une fois par an en comité de direction ?', 'Construire un tableau de bord de 8 à 12 indicateurs et le présenter chaque année en comité de direction.', 2]]],
  ['climat', 'Climat et énergie', '#2357A6', [
    ['L\'entreprise a mesuré ses émissions de gaz à effet de serre (au moins scopes 1 et 2) ?', 'Réaliser un premier bilan carbone (scopes 1 et 2, puis les principaux postes du scope 3).', 3],
    ['Les consommations d\'énergie sont suivies par site, au moins chaque mois ?', 'Mettre en place un suivi mensuel des consommations d\'énergie par site et repérer les gros postes.', 2],
    ['Un plan de réduction chiffré existe (actions, coûts, gains, échéances) ?', 'Construire un plan de réduction chiffré avec 5 à 10 actions, leur coût et leurs gains.', 3],
    ['Les risques climatiques (chaleur, inondations, sécheresse) sur les sites et l\'activité ont été évalués ?', 'Évaluer l\'exposition des sites et des fournisseurs clés aux risques climatiques.', 1]]],
  ['ress', 'Ressources et déchets', '#A8621A', [
    ['Les déchets sont triés et les quantités suivies par type ?', 'Organiser le tri à la source et suivre les tonnages par flux de déchets.', 2],
    ['L\'entreprise réduit ses emballages ou ses matières premières, ou les remplace par du recyclé ?', 'Lancer un projet de réduction des emballages ou d\'intégration de matières recyclées.', 2],
    ['La consommation d\'eau est suivie et des actions de réduction sont engagées ?', 'Suivre la consommation d\'eau et traiter les fuites et les usages les plus importants.', 1],
    ['L\'écoconception, la réparation ou le réemploi sont pris en compte dans les produits ou services ?', 'Intégrer un critère d\'écoconception ou de durabilité dans le développement des produits.', 1]]],
  ['social', 'Social et conditions de travail', '#C2532A', [
    ['Les risques professionnels sont évalués et le document unique est à jour ?', 'Mettre à jour le document unique d\'évaluation des risques et son plan de prévention.', 3],
    ['L\'égalité femmes-hommes est mesurée (écarts de salaire, accès aux promotions) ?', 'Mesurer les écarts de rémunération par catégorie d\'emploi et corriger les écarts injustifiés.', 2],
    ['Chaque salarié a un entretien et un plan de formation au moins une fois par an ?', 'Généraliser l\'entretien annuel et un plan de développement des compétences.', 2],
    ['La qualité de vie au travail est mesurée (enquête, absentéisme, rotation du personnel) ?', 'Suivre l\'absentéisme et la rotation, et réaliser une courte enquête annuelle auprès des salariés.', 2]]],
  ['achats', 'Achats et chaîne de valeur', '#6B4BA1', [
    ['Les fournisseurs principaux ont été identifiés selon leurs risques sociaux et environnementaux ?', 'Cartographier les fournisseurs principaux selon leurs risques (pays, secteur, volume).', 2],
    ['Une charte ou des clauses RSE figurent dans les contrats ou les appels d\'offres ?', 'Rédiger une charte achats responsables et l\'intégrer aux contrats des fournisseurs clés.', 2],
    ['Les délais de paiement des fournisseurs sont respectés ?', 'Suivre les délais de paiement et viser le respect strict des délais légaux.', 2],
    ['L\'entreprise privilégie, à qualité égale, des fournisseurs locaux, inclusifs ou labellisés ?', 'Fixer un objectif de part d\'achats locaux, inclusifs (secteur adapté et protégé, insertion) ou labellisés.', 1]]],
  ['clients', 'Clients, éthique et territoire', '#1F6F73', [
    ['Les allégations environnementales (site, emballages, publicité) sont précises et prouvées ?', 'Relire toutes les allégations environnementales et retirer celles qui ne sont pas démontrées (directive ECGT).', 3],
    ['Des règles d\'éthique existent (cadeaux, conflits d\'intérêts, corruption) et sont connues des salariés ?', 'Rédiger un code de conduite court et le présenter à tous les salariés.', 2],
    ['Les données personnelles des clients et des salariés sont protégées (RGPD) ?', 'Tenir le registre des traitements RGPD et vérifier les accès aux données sensibles.', 2],
    ['L\'entreprise s\'engage sur son territoire (emploi local, associations, écoles, alternance) ?', 'Formaliser un engagement local : accueil d\'alternants, partenariats avec des écoles ou des associations.', 1]]]
];
const DIAG_REP = [['Non', 0], ['En partie', 1], ['Oui', 2], ['Oui, mesuré et suivi', 3]];
const DG = {d: null};
async function diagInit(){ try { const k = IDB.db && await IDB.get('kv', 'diag'); DG.d = k || null; } catch(e) {} if (!DG.d) DG.d = {id: 'diag', nom: '', eff: '', ca: '', profil: '', rep: {}}; renderDiag(); }
const diagSave = () => { DG.d.updatedAt = Date.now(); return IDB.put('kv', DG.d).catch(() => {}); };
function diagScores(){
  const r = DG.d.rep; const P = DIAG_PILIERS.map(([id, nom, col, qs]) => { const vals = qs.map((q, i) => r[id + i]); const rep = vals.filter(v => v != null).length; const sc = vals.reduce((a, v) => a + (v || 0), 0); return {id, nom, col, rep, total: qs.length, pct: Math.round(100 * sc / (qs.length * 3))}; });
  const nRep = P.reduce((a, p) => a + p.rep, 0), nTot = P.reduce((a, p) => a + p.total, 0);
  const glob = Math.round(P.reduce((a, p) => a + p.pct, 0) / P.length);
  const niv = glob >= 75 ? ['Avancé', 'Votre démarche est structurée et suivie : visez la reconnaissance (label, notation) et l\'amélioration continue.'] : glob >= 50 ? ['Structuré', 'Les bases sont là : il reste à mesurer plus finement et à formaliser un plan d\'action chiffré.'] : glob >= 25 ? ['En progression', 'Des actions existent mais restent ponctuelles : il faut les organiser et les mesurer.'] : ['Premiers pas', 'Tout reste à construire : commencez par quelques actions simples et visibles.'];
  return {P, nRep, nTot, glob, niv};
}
function radar(P){
  const cx = 170, cy = 160, R = 120, n = P.length, pt = (i, r) => { const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; };
  let g = '';
  [0.25, 0.5, 0.75, 1].forEach(k => { g += '<polygon points="' + P.map((p, i) => pt(i, R * k).join(',')).join(' ') + '" fill="none" stroke="var(--line)" stroke-width="1"/>'; });
  P.forEach((p, i) => { const [x, y] = pt(i, R); g += '<line x1="' + cx + '" y1="' + cy + '" x2="' + x + '" y2="' + y + '" stroke="var(--line)"/>'; const [lx, ly] = pt(i, R + 26); g += '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" font-size="11.5" font-weight="700" fill="currentColor">' + esc(p.nom.split(/[ ,]/)[0]) + '</text>'; });
  g += '<polygon points="' + P.map((p, i) => pt(i, R * Math.max(p.pct, 3) / 100).join(',')).join(' ') + '" fill="var(--accent)" fill-opacity=".22" stroke="var(--accent)" stroke-width="2.5"/>';
  P.forEach((p, i) => { const [x, y] = pt(i, R * Math.max(p.pct, 3) / 100); g += '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + p.col + '"/>'; });
  return '<svg viewBox="0 0 340 330" class="radar" role="img" aria-label="Radar des scores par pilier">' + g + '</svg>';
}
function diagPlan(){
  const r = DG.d.rep, L = [];
  DIAG_PILIERS.forEach(([id, nom, col, qs]) => qs.forEach((q, i) => { const v = r[id + i]; if (v == null || v >= 2) return; L.push({pilier: nom, col, action: q[1], prio: q[2] * (2 - v) + (v === 0 ? 1 : 0)}); }));
  L.sort((a, b) => b.prio - a.prio);
  return [['Dans les 3 mois', L.slice(0, 4)], ['Dans les 12 mois', L.slice(4, 9)], ['Dans les 24 mois', L.slice(9)]].filter(x => x[1].length);
}
function diagEnt(){ const eff = DG.d.eff === '' ? null : +DG.d.eff; return {pays: 'France', eff, effLabel: '', ca: DG.d.ca === '' ? null : +DG.d.ca * 1e6, sig: {}, profil: DG.d.profil || 'conseil', nom: DG.d.nom}; }
function renderDiag(){
  const el = document.getElementById('diagRoot'); if (!el || !DG.d) return;
  const d = DG.d, S = diagScores(), fini = S.nRep === S.nTot;
  let h = '<div class="eyebrow">AGIR · TOUTES LES ENTREPRISES</div><h2>Autodiagnostic RSE de mon entreprise</h2><p class="lead">24 questions, une quinzaine de minutes. Vous obtenez le niveau de maturité de votre entreprise sur six piliers, ses obligations probables selon sa taille, les enjeux de son secteur et un plan d\'action priorisé à présenter en comité de direction.</p>';
  h += '<div class="card"><h3 style="margin-top:0">1. Mon entreprise</h3><div class="entgrid diaggrid"><label>Nom<input class="inp" data-dg="nom" value="' + esc(d.nom) + '" placeholder="Nom de l\'entreprise"></label><label>Nombre de salariés<input class="inp" type="number" min="0" data-dg="eff" value="' + esc(d.eff) + '" placeholder="Ex. : 85"></label><label>Chiffre d\'affaires (M€)<input class="inp" type="number" min="0" data-dg="ca" value="' + esc(d.ca) + '" placeholder="Ex. : 12"></label><label>Secteur<select class="inp" data-dg="profil"><option value="">Choisir…</option>' + ((N.ref && N.ref.profils) || []).map(p => '<option value="' + p.id + '"' + (d.profil === p.id ? ' selected' : '') + '>' + esc(p.nom) + '</option>').join('') + '</select></label></div></div>';
  { const ef = d.eff === '' ? null : +d.eff; if (ef != null) h += ef >= 250 ? '<div class="callout g"><strong>' + (ef >= 1000 ? 'Grande entreprise' : 'Grande entreprise ou ETI') + '</strong>Ce diagnostic donne une vue d\'ensemble. Pour aller plus loin, l\'Atelier CSRD et vigilance vous aide à conduire la double matérialité, à suivre la collecte des données entre vos sites et filiales, à cartographier vos fournisseurs et à préparer l\'audit. <a href="#atelier">Ouvrir l\'Atelier</a></div>' : ef >= 50 ? '<div class="callout b"><strong>PME</strong>Vos clients et vos banques vous interrogeront de plus en plus sur vos pratiques. Ce diagnostic et l\'Espace entreprise suffisent pour structurer la démarche ; pensez aux aides publiques. <a href="#pilotage--aides">Voir les aides</a></div>' : '<div class="callout b"><strong>Très petite entreprise</strong>Concentrez-vous sur quelques actions simples et visibles : énergie, déchets, conditions de travail, ancrage local. <a href="#pilotage--route">Feuille de route en 10 étapes</a></div>'; }
  h += '<p class="progress">Vous êtes une collectivité, un établissement public ou une association ? <a href="#public">Votre espace dédié</a></p>';
  h += '<h3>2. Les questions <span class="pill' + (fini ? '' : ' o') + '">' + S.nRep + ' / ' + S.nTot + '</span></h3>';
  DIAG_PILIERS.forEach(([id, nom, col, qs]) => {
    h += '<details class="dgp" style="--pc:' + col + '"' + (qs.some((q, i) => d.rep[id + i] == null) && !h.includes('dgp" style="--pc') ? ' open' : '') + '><summary><span class="dgdot"></span>' + esc(nom) + '<span class="progress">' + qs.filter((q, i) => d.rep[id + i] != null).length + ' / ' + qs.length + '</span></summary><div class="inner">'
      + qs.map((q, i) => '<div class="dgq"><p>' + esc(q[0]) + '</p><div class="dgr" role="radiogroup" aria-label="' + esc(q[0]) + '">' + DIAG_REP.map(([l, v]) => '<button class="chip' + (d.rep[id + i] === v ? ' on' : '') + '" role="radio" aria-checked="' + (d.rep[id + i] === v) + '" data-dq="' + id + i + '" data-v="' + v + '">' + l + '</button>').join('') + '</div></div>').join('') + '</div></details>';
  });
  if (S.nRep >= 6) {
    const e = diagEnt(), ob = obligations(e).filter(o => o.etat !== 'non'), Pf = profilDe(e.profil), plan = diagPlan();
    h += '<h3>3. Mes résultats' + (fini ? '' : ' <span class="pill o">provisoires</span>') + '</h3><div class="dgres"><div class="card dgscore"><div class="dgbig">' + S.glob + '<small>/100</small></div><div class="pill">' + S.niv[0] + '</div><p>' + esc(S.niv[1]) + '</p></div><div class="card">' + radar(S.P) + '</div><div class="card"><h4>Score par pilier</h4>' + S.P.map(p => '<div class="dgbar"><span>' + esc(p.nom) + '</span><div><i style="width:' + p.pct + '%;background:' + p.col + '"></i></div><b>' + p.pct + ' %</b></div>').join('') + '</div></div>';
    if (plan.length) h += '<h3>4. Mon plan d\'action priorisé</h3>' + plan.map(([t, L]) => '<div class="card"><h4>' + t + '</h4><ol class="steps">' + L.map(a => '<li>' + esc(a.action) + ' <span class="pill" style="background:color-mix(in srgb,' + a.col + ' 14%,transparent);color:' + a.col + '">' + esc(a.pilier) + '</span></li>').join('') + '</ol></div>').join('');
    if (d.eff !== '') h += '<h3>5. Mes obligations probables</h3><div class="tablewrap"><table><thead><tr><th>Obligation</th><th>Ce que cela implique</th></tr></thead><tbody>' + ob.map(o => '<tr><td><strong>' + esc(o.nom) + '</strong>' + (o.etat === '?' ? ' <span class="pill o">à vérifier</span>' : '') + '</td><td>' + esc(o.detail) + '</td></tr>').join('') + '</tbody></table></div>';
    if (Pf) h += '<h3>6. Les enjeux de mon secteur</h3><div class="grid two"><div class="card"><h4>' + esc(Pf.nom) + '</h4><ul>' + Pf.enjeux.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="card"><h4>Indicateurs à suivre</h4><ul>' + Pf.indicateurs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>';
    h += '<div class="ctool"><button class="btn" data-dga="doc">Télécharger le rapport en Word</button><button class="btn ghost" data-dga="pdf">Enregistrer en PDF</button><button class="btn ghost" data-dga="reset">Recommencer</button></div><p class="foot">Autodiagnostic indicatif, calculé sur l\'appareil. Il ne remplace ni un audit ni une notation externe (EcoVadis, label).</p>';
  } else h += '<div class="callout b"><strong>Vos résultats apparaîtront ici</strong>Répondez à au moins 6 questions pour voir un premier score ; le plan d\'action se précise à chaque réponse.</div>';
  el.innerHTML = h;
}
function diagRapport(){
  const d = DG.d, S = diagScores(), e = diagEnt(), ob = obligations(e).filter(o => o.etat !== 'non'), Pf = profilDe(e.profil), plan = diagPlan();
  return '<h1>Autodiagnostic RSE' + (d.nom ? ' – ' + esc(d.nom) : '') + '</h1><p style="text-align:center">Réalisé le ' + new Date().toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) + ' avec SERIKI BIBLE RSE</p>'
    + '<h2>Résultat global : ' + S.glob + ' / 100 – ' + S.niv[0] + '</h2><p style="text-align:justify">' + esc(S.niv[1]) + '</p><table border="1" cellpadding="6" style="border-collapse:collapse;width:100%"><tr><th>Pilier</th><th>Score</th></tr>' + S.P.map(p => '<tr><td>' + esc(p.nom) + '</td><td>' + p.pct + ' %</td></tr>').join('') + '</table>'
    + '<h2>Plan d\'action priorisé</h2>' + plan.map(([t, L]) => '<h3>' + t + '</h3><ol>' + L.map(a => '<li>' + esc(a.action) + ' (' + esc(a.pilier) + ')</li>').join('') + '</ol>').join('')
    + (d.eff !== '' ? '<h2>Obligations probables</h2><ul>' + ob.map(o => '<li><b>' + esc(o.nom) + '</b> : ' + esc(o.detail) + '</li>').join('') + '</ul>' : '')
    + (Pf ? '<h2>Enjeux du secteur : ' + esc(Pf.nom) + '</h2><ul>' + Pf.enjeux.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '')
    + '<p style="font-size:9pt;color:#555">Autodiagnostic indicatif. Il ne remplace ni un audit ni une notation externe.</p>';
}
const diagRoot = document.getElementById('diagRoot');
diagRoot.addEventListener('click', async ev => {
  const q = ev.target.closest('[data-dq]');
  if (q) { const op = q.closest('details'); DG.d.rep[q.dataset.dq] = +q.dataset.v; await diagSave(); const y = window.scrollY; const openIds = [...diagRoot.querySelectorAll('details')].map(x => x.open); renderDiag(); diagRoot.querySelectorAll('details').forEach((x, i) => { x.open = openIds[i]; }); window.scrollTo(0, y); void op; return; }
  const a = ev.target.closest('[data-dga]'); if (!a) return;
  if (a.dataset.dga === 'doc') { downloadDoc(diagRapport(), 'Autodiagnostic RSE ' + (DG.d.nom || '')); toast('Rapport téléchargé'); }
  else if (a.dataset.dga === 'pdf') printHtml(diagRapport());
  else if (a.dataset.dga === 'reset') modal('Recommencer l\'autodiagnostic ?', '<p>Toutes les réponses seront effacées.</p>', 'Recommencer', async () => { DG.d.rep = {}; await diagSave(); renderDiag(); }, true);
});
diagRoot.addEventListener('change', async ev => { const k = ev.target.dataset && ev.target.dataset.dg; if (!k) return; DG.d[k] = ev.target.value.trim(); await diagSave(); renderDiag(); });
window.addEventListener('hashchange', () => { if (route().base === 'diagnostic') renderDiag(); });
(typeof espaceReady !== 'undefined' ? espaceReady : Promise.resolve()).then(diagInit, diagInit);


/* =====================================================================
   DESIGN V2 : bandeaux colorés, écran d'ouverture, découverte, stories
   ===================================================================== */
const PICO = {accueil: ESPICO.accueil, apprendre: ESPICO.apprendre, pratiquer: ESPICO.pratiquer, carriere: ESPICO.carriere, veille: ESPICO.veille};
function decorer(){
  const sec = document.querySelector('section.view.on'); if (!sec || sec.id === 'accueil') return;
  const ey = sec.querySelector(':scope > .eyebrow, :scope > div > .eyebrow'); if (!ey || ey.closest('.phero')) return;
  const h2 = ey.nextElementSibling; if (!h2 || h2.tagName !== 'H2') return;
  const w = document.createElement('div'); w.className = 'phero';
  ey.parentNode.insertBefore(w, ey);
  const take = [ey, h2]; let n = h2.nextElementSibling;
  while (n && (n.classList.contains('verif') || (n.tagName === 'P' && n.classList.contains('lead')))) { take.push(n); n = n.nextElementSibling; }
  if (n && n.classList.contains('essentiel') && n.nextElementSibling && n.nextElementSibling.tagName === 'P' && n.nextElementSibling.classList.contains('lead')) take.push(n.nextElementSibling);
  take.forEach(x => w.appendChild(x));
  const esp = document.body.dataset.esp || 'accueil';
  w.insertAdjacentHTML('beforeend', '<svg class="pico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (PICO[esp] || PICO.accueil) + '</svg>');
}
let decT = null;
const decObs = new MutationObserver(() => { if (decT) return; decT = requestAnimationFrame(() => { decT = null; decorer(); }); });
decObs.observe(document.getElementById('content'), {childList: true, subtree: true});
window.addEventListener('hashchange', () => setTimeout(decorer, 0));
setTimeout(decorer, 0);

/* ---------- Écran d'ouverture ---------- */
(function(){
  const sp = document.getElementById('splash'); if (!sp) return;
  const fin = () => { sp.classList.add('out'); setTimeout(() => sp.remove(), 650); try { sessionStorage.setItem('splash', '1'); } catch(e) {} };
  sp.addEventListener('click', fin);
  setTimeout(fin, matchMedia('(prefers-reduced-motion: reduce)').matches ? 400 : 2300);
})();

/* ---------- Découverte (premier lancement) ---------- */
const DECOUV = [
  ['accueil', 'Bienvenue dans votre Bible RSE', 'Tout ce qui touche à la RSE et au développement durable, au même endroit : apprendre, agir, trouver sa place dans le métier et suivre l\'actualité.', '#1F6F73'],
  ['apprendre', 'Apprendre', 'La réglementation française et européenne, la CSRD, la taxonomie, le carbone, les normes et 20 secteurs, expliqués simplement. Et votre propre espace de cours, avec fiches mémo et quiz.', '#0F5B3E'],
  ['pratiquer', 'Agir', 'Des guides de terrain pas à pas, des calculateurs, des modèles prêts à l\'emploi, un autodiagnostic et un tableau de bord pour piloter la RSE d\'une entreprise.', '#C2532A'],
  ['carriere', 'Carrière', 'Les offres RSE de toutes les plateformes, l\'annuaire des entreprises, votre CV, le score ATS, l\'analyse d\'offre et le simulateur d\'entretien.', '#2357A6'],
  ['veille', 'Veille', 'L\'actualité de la RSE en France, en Europe et dans le monde, les COP, les salons et votre agenda, avec des alertes quand quelque chose d\'important arrive.', '#8A5214']
];
function decouverte(){
  let i = 0; const ov = document.createElement('div'); ov.className = 'decouv'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Découvrir l\'application');
  const fin = () => { ov.classList.add('out'); setTimeout(() => ov.remove(), 400); LS.set('decouverte', '1'); if (!LS.get('public')) setTimeout(choisirPublic, 450); };
  const draw = () => {
    const [k, t, d, c] = DECOUV[i];
    ov.style.setProperty('--dc', c);
    ov.innerHTML = '<div class="dcbox"><button class="dcskip" data-dc="skip">Passer</button><div class="dcill" aria-hidden="true"><span class="dcr1"></span><span class="dcr2"></span><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + PICO[k] + '</svg></div><div class="dctxt"><div class="dcstep">' + (i + 1) + ' / ' + DECOUV.length + '</div><h2>' + t + '</h2><p>' + d + '</p></div><div class="dcdots">' + DECOUV.map((x, j) => '<span' + (j === i ? ' class="on"' : '') + '></span>').join('') + '</div><div class="dcnav">' + (i ? '<button class="btn ghost" data-dc="prev">Précédent</button>' : '<span></span>') + '<button class="btn" data-dc="next">' + (i === DECOUV.length - 1 ? 'Commencer' : 'Suivant') + '</button></div></div>';
  };
  ov.addEventListener('click', e => { const b = e.target.closest('[data-dc]'); if (!b) return; const a = b.dataset.dc; if (a === 'skip') fin(); else if (a === 'prev') { i--; draw(); } else if (i < DECOUV.length - 1) { i++; draw(); } else fin(); });
  let x0 = null; ov.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, {passive: true}); ov.addEventListener('touchend', e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (dx < -50 && i < DECOUV.length - 1) { i++; draw(); } else if (dx > 50 && i > 0) { i--; draw(); } x0 = null; });
  draw(); document.body.appendChild(ov);
}

/* ---------- Stories de l'accueil ---------- */
const CHIFFRES = [['+2,6 °C', 'Le réchauffement attendu d\'ici 2100 si tous les États tiennent leurs engagements, selon le rapport 2026 du PNUE.', 'actualites'], ['1 000 + 450 M€', 'Les seuils cumulés de la CSRD depuis l\'Omnibus I : plus de 1 000 salariés et plus de 450 M€ de chiffre d\'affaires.', 'csrd'], ['500 salariés', 'Le seuil à partir duquel le bilan de gaz à effet de serre (BEGES) est obligatoire en France, tous les 4 ans.', 'france'], ['≈ –61 %', 'La baisse des points de données obligatoires dans les ESRS révisés, publiés au Journal officiel le 21 septembre 2026.', 'csrd'], ['5 000 salariés', 'Le seuil du devoir de vigilance français, filiales comprises, en France.', 'france']];
const CONSEILS = [['Avant un entretien', 'Lisez le rapport RSE de l\'entreprise et citez un de ses objectifs chiffrés : c\'est ce qui distingue une candidature.', 'entreprises'], ['Bilan carbone', 'Commencez par les postes qui pèsent le plus : dans la plupart des entreprises, ce sont les achats et le transport, pas les bureaux.', 'terrain--bilan-carbone'], ['Sensibiliser', 'Un atelier d\'une heure avec un chiffre propre à l\'entreprise marque plus qu\'une affiche générale sur le climat.', 'terrain--sensibiliser'], ['Premier mois en poste', 'Rencontrez chaque direction avant de proposer quoi que ce soit : votre rapport d\'étonnement sera votre première victoire.', 'terrain--premiers-jours'], ['Allégations', 'Depuis le 27 septembre 2026, une allégation « écologique » sans preuve précise est interdite : relisez tout le marketing.', 'actualites']];
function storiesData(){
  const jour = Math.floor(Date.now() / 864e5), L = [];
  const ch = CHIFFRES[jour % CHIFFRES.length], co = CONSEILS[jour % CONSEILS.length];
  L.push({k: 'chiffre', t: 'Chiffre du jour', c: '#0F5B3E', big: ch[0], txt: ch[1], go: ch[2], cta: 'Comprendre'});
  L.push({k: 'conseil', t: 'Conseil du jour', c: '#C2532A', big: co[0], txt: co[1], go: co[2], cta: 'Passer à l\'action'});
  try { const a = A.arts.find(x => x.importance === 'haute'); if (a) L.push({k: 'une', t: 'À la une', c: '#2357A6', big: (ZLAB[a.zone] || a.zone), txt: a.titre, go: 'actualites', cta: 'Lire'}); } catch(e) {}
  try { const t = ajd(), ev = A.agenda.find(x => (x.fin || x.debut) >= t); if (ev) L.push({k: 'agenda', t: 'Agenda', c: '#8A5214', big: etatEvt(ev).txt, txt: ev.titre + ' · ' + (ev.lieu || ''), go: 'agenda', cta: 'Voir mon agenda'}); } catch(e) {}
  let no = 0; try { no = O.nouv.size; } catch(e) {}
  L.push({k: 'offres', t: 'Offres', c: '#1F6F73', big: no ? no + ' nouvelle' + (no > 1 ? 's' : '') : 'Vos alertes', txt: no ? 'offre' + (no > 1 ? 's' : '') + ' RSE correspondant à votre recherche.' : 'Ouvrez toutes les plateformes d\'emploi en un clic, avec votre recherche déjà remplie.', go: 'offres', cta: 'Voir les offres'});
  return L;
}
const SICO = {chiffre: ICO.chart, conseil: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/></svg>', une: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h13v16H6a2 2 0 0 1-2-2z"/><path d="M17 8h3v10a2 2 0 0 1-2 2"/><path d="M8 8h5M8 12h5M8 16h3"/></svg>', agenda: ICO.cal, offres: ICO.bag};
function storiesBar(){
  const vues = new Set((LS.get('stories-vues') || '').split(','));
  const jour = String(Math.floor(Date.now() / 864e5));
  return '<div class="stories" role="list">' + storiesData().map((s, i) => '<button class="story' + (vues.has(jour + s.k) ? ' vue' : '') + '" role="listitem" data-story="' + i + '" style="--sc:' + s.c + '"><span class="sring"><span class="sdot">' + (SICO[s.k] || '') + '</span></span><span class="slab">' + esc(s.t) + '</span></button>').join('') + '</div>';
}
function ouvrirStory(start){
  const L = storiesData(); let i = start, tm = null, t0 = 0; const D = 6000;
  const jour = String(Math.floor(Date.now() / 864e5));
  const ov = document.createElement('div'); ov.className = 'sview'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true');
  const vu = k => { const v = new Set((LS.get('stories-vues') || '').split(',').filter(Boolean)); v.add(jour + k); LS.set('stories-vues', [...v].slice(-40).join(',')); };
  const close = () => { clearTimeout(tm); ov.classList.add('out'); setTimeout(() => ov.remove(), 300); try { renderDash(); } catch(e) {} };
  const draw = () => {
    const s = L[i]; vu(s.k); ov.style.setProperty('--sc', s.c);
    ov.innerHTML = '<div class="sbox"><div class="sbars">' + L.map((x, j) => '<span><i class="' + (j < i ? 'full' : j === i ? 'run' : '') + '"></i></span>').join('') + '</div><div class="shead"><strong>' + esc(s.t) + '</strong><button class="sclose" aria-label="Fermer">✕</button></div><div class="sbody"><div class="sbig">' + esc(s.big) + '</div><p>' + esc(s.txt) + '</p><a class="scta" href="#' + s.go + '">' + esc(s.cta) + ' →</a></div><button class="sprev" aria-label="Précédent"></button><button class="snext" aria-label="Suivant"></button></div>';
    clearTimeout(tm); tm = setTimeout(next, D);
  };
  const next = () => { if (i < L.length - 1) { i++; draw(); } else close(); };
  ov.addEventListener('click', e => { if (e.target.closest('.sclose')) return close(); if (e.target.closest('.scta')) return close(); if (e.target.closest('.snext')) return next(); if (e.target.closest('.sprev')) { if (i > 0) { i--; draw(); } return; } if (e.target === ov) close(); });
  document.addEventListener('keydown', function k(e){ if (!document.body.contains(ov)) return document.removeEventListener('keydown', k); if (e.key === 'Escape') close(); if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft' && i > 0) { i--; draw(); } });
  draw(); document.body.appendChild(ov);
}
document.getElementById('dash').addEventListener('click', e => { const s = e.target.closest('[data-story]'); if (s) { e.stopPropagation(); ouvrirStory(+s.dataset.story); } }, true);


/* =====================================================================
   ESPACE ENTREPRISE : PILOTER LA RSE
   Tableau de bord d'indicateurs (Excel / Power BI), plan d'action,
   feuille de route, aides et financements.
   ===================================================================== */
const PKPI = [
  ['ges', 'Émissions totales de gaz à effet de serre', 'tCO₂e', 'baisse', 'Climat'],
  ['s12', 'Émissions scopes 1 et 2', 'tCO₂e', 'baisse', 'Climat'],
  ['ener', 'Consommation d\'énergie', 'MWh', 'baisse', 'Climat'],
  ['enr', 'Part d\'énergie renouvelable', '%', 'hausse', 'Climat'],
  ['dech', 'Déchets produits', 't', 'baisse', 'Ressources'],
  ['valo', 'Taux de valorisation des déchets', '%', 'hausse', 'Ressources'],
  ['eau', 'Consommation d\'eau', 'm³', 'baisse', 'Ressources'],
  ['tf', 'Taux de fréquence des accidents du travail', '', 'baisse', 'Social'],
  ['abs', 'Taux d\'absentéisme', '%', 'baisse', 'Social'],
  ['form', 'Heures de formation par salarié', 'h', 'hausse', 'Social'],
  ['egal', 'Index de l\'égalité professionnelle', '/100', 'hausse', 'Social'],
  ['achats', 'Part des achats auprès de fournisseurs évalués RSE', '%', 'hausse', 'Achats']
];
const PILC = {Climat: '#2357A6', Ressources: '#A8621A', Social: '#C2532A', Achats: '#6B4BA1', Autre: '#1F6F73'};
const PST = ['À faire', 'En cours', 'Fait'];
const ROUTE = [
  ['Faire l\'autodiagnostic', 'Mesurer la maturité de l\'entreprise sur les six piliers et repérer les priorités.', 'diagnostic'],
  ['Vérifier ses obligations', 'Lister ce que la loi impose selon la taille : BEGES, index de l\'égalité, vigilance, CSRD, décret tertiaire.', 'outils'],
  ['Nommer un référent et fixer un budget', 'Une personne responsable, du temps dédié, un budget annuel validé par la direction.', ''],
  ['Identifier les enjeux prioritaires', 'Une analyse de matérialité simplifiée avec les salariés, quelques clients et fournisseurs.', 'csrd'],
  ['Mesurer son bilan carbone', 'Scopes 1 et 2, puis les principaux postes du scope 3. Le Diag Décarbon\'Action en finance une partie.', 'terrain--bilan-carbone'],
  ['Construire un plan d\'action chiffré', 'Actions, responsables, budgets, échéances et gains attendus.', 'terrain--plan-action'],
  ['Suivre 8 à 12 indicateurs', 'Un tableau de bord annuel, avec des objectifs datés, présenté en comité de direction.', 'pilotage--kpi'],
  ['Embarquer les équipes', 'Ateliers de sensibilisation, ambassadeurs, communication interne régulière.', 'terrain--sensibiliser'],
  ['Rendre compte', 'Un rapport annuel simple selon la norme volontaire européenne, ou la CSRD si l\'entreprise y est soumise.', 'csrd'],
  ['Faire reconnaître sa démarche', 'Notation EcoVadis, label Lucie, B Corp ou société à mission, selon les attentes des clients.', 'terrain--ecovadis']
];
const AIDES = [
  ['Diag Décarbon\'Action', 'Bpifrance et ADEME', 'Un premier bilan carbone complet (scopes 1, 2 et 3) et un plan d\'action, réalisés par un prestataire référencé. Forfait de 10 000 € HT, dont 40 % pris en charge : 6 000 € HT restent à la charge de l\'entreprise.', 'PME et ETI de moins de 500 salariés', 'https://www.bpifrance.fr/catalogue-offres/transition-ecologique-et-energetique/diag-decarbonaction'],
  ['Diag Éco-Flux', 'Bpifrance et ADEME', 'Un accompagnement par un bureau d\'études pour réduire les consommations d\'énergie, d\'eau et de matières et les déchets, avec des économies chiffrées.', 'TPE et PME', 'https://agirpourlatransition.ademe.fr/entreprises/aides-financieres'],
  ['Diag Éco-conception', 'Bpifrance et ADEME', 'Un accompagnement pour réduire l\'impact environnemental d\'un produit, d\'un service ou d\'un procédé dès sa conception. Une large part du coût est subventionnée.', 'TPE et PME', 'https://agirpourlatransition.ademe.fr/entreprises/aides-financieres'],
  ['Prêt vert ADEME', 'Bpifrance', 'Un prêt de 10 000 € à 1 M€, sur 2 à 10 ans, pour financer les investissements recommandés par un Diag Éco-Flux ou un projet aidé par l\'ADEME.', 'PME ayant bénéficié d\'un Diag Éco-Flux ou d\'une aide ADEME dans les 3 dernières années', 'https://www.bpifrance.fr/'],
  ['Prêt vert', 'Bpifrance', 'Un prêt de 50 000 € à 5 M€, sur 2 à 10 ans, pour financer un projet de transition écologique et énergétique.', 'PME et ETI', 'https://www.economie.gouv.fr/cedef/fiches-pratiques/aides-entreprises-transition-ecologique'],
  ['Aides financières de l\'ADEME', 'ADEME', 'Le portail des aides de l\'ADEME : études, diagnostics, investissements en efficacité énergétique, chaleur renouvelable, économie circulaire. Les appels à projets évoluent au fil de l\'année.', 'Toutes les entreprises, selon le dispositif', 'https://agirpourlatransition.ademe.fr/entreprises/aides-financieres'],
  ['Certificats d\'économies d\'énergie (CEE)', 'Fournisseurs d\'énergie', 'Des primes versées pour des travaux d\'efficacité énergétique (isolation, chauffage, éclairage, moteurs). Le fournisseur d\'énergie indique le montant possible avant les travaux.', 'Toutes les entreprises', 'https://www.ecologie.gouv.fr/'],
  ['Aides régionales', 'Région et intercommunalité', 'Subventions et prêts locaux pour la rénovation, les énergies renouvelables, la mobilité et l\'économie circulaire. Le portail national recense les aides par territoire.', 'Selon le territoire', 'https://aides-entreprises.fr/']
];
const PL = {d: null, tab: 'kpi'};
const anneeCourante = new Date().getFullYear();
async function pilInit(){ try { const k = IDB.db && await IDB.get('kv', 'pilotage'); PL.d = k || null; } catch(e) {} if (!PL.d) PL.d = {id: 'pilotage', annees: [anneeCourante - 2, anneeCourante - 1, anneeCourante], kpi: PKPI.map(([id, nom, u, sens, pil]) => ({id, nom, u, sens, pil, v: {}, cible: '', an: ''})), actions: [], route: {}}; renderPilot(); }
const pilSave = () => { PL.d.updatedAt = Date.now(); return IDB.put('kv', PL.d).catch(() => toast('Enregistrement impossible')); };
const numK = v => { if (v === '' || v == null) return null; const n = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return isNaN(n) ? null : n; };
const fmtK = v => v == null ? '–' : (Math.abs(v) >= 100 ? Math.round(v).toLocaleString('fr-FR') : v.toLocaleString('fr-FR', {maximumFractionDigits: 1}));
function kpiStats(k){
  const ans = PL.d.annees, vals = ans.map(a => numK(k.v[a])), idx = vals.map((v, i) => v != null ? i : -1).filter(i => i >= 0);
  const last = idx.length ? vals[idx[idx.length - 1]] : null, prev = idx.length > 1 ? vals[idx[idx.length - 2]] : null;
  const delta = last != null && prev != null && prev !== 0 ? (last - prev) / Math.abs(prev) * 100 : null;
  const bon = delta == null ? null : (k.sens === 'baisse' ? delta < 0 : delta > 0);
  const c = numK(k.cible); let prog = null;
  if (c != null && last != null) { const base = idx.length ? vals[idx[0]] : last; if (base !== c) prog = Math.max(0, Math.min(100, Math.round((base - last) / (base - c) * 100))); else prog = 100; }
  return {vals, last, prev, delta, bon, cible: c, prog};
}
function sparkline(k, col){
  const s = kpiStats(k), pts = s.vals.map((v, i) => [i, v]).filter(p => p[1] != null); if (!pts.length) return '<div class="kspark vide">Saisissez des valeurs</div>';
  const all = pts.map(p => p[1]).concat(s.cible != null ? [s.cible] : []), mn = Math.min(...all), mx = Math.max(...all), W = 240, H = 70, n = Math.max(1, s.vals.length - 1);
  const X = i => 10 + i * (W - 20) / n, Y = v => mx === mn ? H / 2 : H - 10 - (v - mn) / (mx - mn) * (H - 20);
  let g = '';
  if (s.cible != null) g += '<line x1="6" x2="' + (W - 6) + '" y1="' + Y(s.cible) + '" y2="' + Y(s.cible) + '" stroke="' + col + '" stroke-dasharray="4 4" stroke-opacity=".6"/>';
  g += '<polyline points="' + pts.map(p => X(p[0]) + ',' + Y(p[1])).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';
  g += pts.map(p => '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4" fill="' + col + '"/>').join('');
  return '<svg class="kspark" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Évolution de ' + esc(k.nom) + '">' + g + '</svg>';
}
function renderPilot(){
  const el = document.getElementById('pilotRoot'); if (!el || !PL.d) return;
  const sub = route().base === 'pilotage' ? route().sub : null; if (sub && ['kpi', 'plan', 'route', 'aides'].includes(sub)) PL.tab = sub;
  const d = PL.d, nA = d.actions.filter(a => a.st !== 'Fait').length, nR = ROUTE.filter((r, i) => d.route[i]).length;
  let h = '<div class="eyebrow">AGIR · ESPACE ENTREPRISE</div><h2>Piloter la RSE de mon entreprise</h2><p class="lead">L\'espace des dirigeants, des responsables RSE et des équipes en poste : suivre ses indicateurs avec des graphiques, les échanger avec Excel ou Power BI, piloter son plan d\'action, avancer étape par étape et trouver les aides pour financer la transition.</p>';
  h += '<div class="ptabs">' + [['kpi', 'Tableau de bord', 'Indicateurs et graphiques', ICO.chart], ['plan', 'Plan d\'action', nA + ' action' + (nA > 1 ? 's' : '') + ' en cours', ICO.flag], ['route', 'Feuille de route', nR + ' / ' + ROUTE.length + ' étapes', ICO.doc], ['aides', 'Aides et financements', AIDES.length + ' dispositifs', ICO.bag]].map(([k, t, s, ic]) => '<a class="ptab' + (PL.tab === k ? ' on' : '') + '" href="#pilotage--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (PL.tab === 'kpi') {
    const rens = d.kpi.filter(k => kpiStats(k).last != null).length;
    h += '<div class="ctool"><button class="btn" data-pl="xlsx">Exporter vers Excel</button><label class="btn ghost" for="plImport" tabindex="0">Importer un fichier Excel<input type="file" id="plImport" accept=".xlsx,.xls,.csv" hidden></label><button class="btn ghost" data-pl="csv">Exporter pour Power BI (CSV)</button><button class="btn ghost" data-pl="addk">+ Ajouter un indicateur</button>' + (rens ? '' : '<button class="btn ghost" data-pl="demo">Voir avec des données d\'exemple</button>') + '</div>'
      + '<p class="progress">' + rens + ' indicateur' + (rens > 1 ? 's' : '') + ' renseigné' + (rens > 1 ? 's' : '') + ' sur ' + d.kpi.length + '. Saisissez les valeurs dans le tableau : les graphiques se mettent à jour. Le fichier Excel exporté se réimporte tel quel, et s\'ouvre dans Power BI (Obtenir des données › Excel).</p>';
    h += '<div class="kgrid">' + d.kpi.map(k => { const s = kpiStats(k), col = PILC[k.pil] || PILC.Autre; return '<div class="card kcard" style="--kc:' + col + '"><div class="kh"><span class="pill" style="background:color-mix(in srgb,' + col + ' 14%,transparent);color:' + col + '">' + esc(k.pil) + '</span>' + (s.delta != null ? '<span class="kdelta ' + (s.bon ? 'ok' : 'ko') + '">' + (s.delta > 0 ? '▲ +' : '▼ −') + fmtK(Math.abs(s.delta)) + ' %</span>' : '') + '</div><h4>' + esc(k.nom) + '</h4><div class="kval">' + fmtK(s.last) + ' <small>' + esc(k.u) + '</small></div>' + sparkline(k, col) + (s.cible != null ? '<div class="kprog"><span>Objectif ' + fmtK(s.cible) + ' ' + esc(k.u) + (k.an ? ' en ' + esc(k.an) : '') + '</span><div><i style="width:' + (s.prog || 0) + '%"></i></div><b>' + (s.prog != null ? s.prog + ' %' : '–') + '</b></div>' : '<div class="kprog vide">Pas d\'objectif fixé</div>') + '</div>'; }).join('') + '</div>';
    { const ctl = kpiControles(d); if (ctl.length) h += '<div class="callout o"><strong>Contrôles de cohérence : ' + ctl.length + ' point' + (ctl.length > 1 ? 's' : '') + ' à vérifier</strong><ul>' + ctl.slice(0, 12).map(x => '<li>' + x + '</li>').join('') + '</ul></div>'; else if (d.kpi.some(k => kpiStats(k).last != null)) h += '<div class="callout g"><strong>Contrôles de cohérence</strong>Aucune anomalie détectée : pas de variation brutale, de valeur négative ni de source manquante.</div>'; }
    h += '<h3>Saisie des valeurs</h3><div class="tablewrap"><table class="ktab"><thead><tr><th>Indicateur</th><th>Unité</th><th>Sens</th>' + d.annees.map((a, i) => '<th class="num"><input class="kin kan" data-an="' + i + '" value="' + a + '" aria-label="Année"></th>').join('') + '<th>Objectif</th><th>Année cible</th><th></th></tr></thead><tbody>'
      + d.kpi.map((k, i) => '<tr><td><input class="kin knom" data-k="' + i + '" data-f="nom" value="' + esc(k.nom) + '" aria-label="Nom de l\'indicateur"></td><td><input class="kin ku" data-k="' + i + '" data-f="u" value="' + esc(k.u) + '" aria-label="Unité"></td><td><select class="kin" data-k="' + i + '" data-f="sens" aria-label="Sens souhaité"><option value="baisse"' + (k.sens === 'baisse' ? ' selected' : '') + '>À baisser</option><option value="hausse"' + (k.sens === 'hausse' ? ' selected' : '') + '>À augmenter</option></select></td>' + d.annees.map(a => '<td><input class="kin kv" inputmode="decimal" data-k="' + i + '" data-a="' + a + '" value="' + esc(k.v[a] == null ? '' : k.v[a]) + '" aria-label="' + esc(k.nom) + ' ' + a + '"></td>').join('') + '<td><input class="kin kv" inputmode="decimal" data-k="' + i + '" data-f="cible" value="' + esc(k.cible) + '" aria-label="Objectif"></td><td><input class="kin kv" inputmode="numeric" data-k="' + i + '" data-f="an" value="' + esc(k.an) + '" aria-label="Année cible"></td><td class="kact2"><button class="kfi fi-' + (k.q && k.q.fiab ? ({'Mesurée': 'm', 'Calculée': 'c', 'Estimée': 'e'})[k.q.fiab] || 'n' : 'n') + '" data-pl="kfiche" data-i="' + i + '" title="Fiche qualité de la donnée">Fiche</button><button class="linkbtn" style="color:var(--danger)" data-pl="delk" data-i="' + i + '" aria-label="Supprimer l\'indicateur">✕</button></td></tr>').join('') + '</tbody></table></div><div class="ctool"><button class="btn ghost sm" data-pl="addan">+ Ajouter une année</button></div>';
  } else if (PL.tab === 'plan') {
    h += '<div class="ctool"><button class="btn" data-pl="adda">+ Nouvelle action</button><button class="btn ghost" data-pl="fromdiag">Importer les actions de mon autodiagnostic</button><button class="btn ghost" data-pl="xlsxa">Exporter vers Excel</button></div>';
    const tot = d.actions.reduce((a, x) => a + (numK(x.budget) || 0), 0);
    h += '<div class="tiles"><div class="tile"><div class="big">' + d.actions.length + '</div><div class="lbl">actions</div></div><div class="tile"><div class="big">' + d.actions.filter(a => a.st === 'Fait').length + '</div><div class="lbl">terminées</div></div><div class="tile"><div class="big">' + d.actions.filter(a => a.st !== 'Fait' && a.ech && a.ech < ajd()).length + '</div><div class="lbl">en retard</div></div><div class="tile"><div class="big">' + fmtK(tot) + ' €</div><div class="lbl">budget total</div></div></div>';
    h += '<div class="kanban">' + PST.map(st => '<div class="kcol"><div class="kch">' + st + ' <span class="pill g">' + d.actions.filter(a => a.st === st).length + '</span></div>' + d.actions.map((a, i) => [a, i]).filter(([a]) => a.st === st).map(([a, i]) => '<div class="card kact' + (a.st !== 'Fait' && a.ech && a.ech < ajd() ? ' late' : '') + '"><div class="meta"><span class="pill">' + esc(a.pil || 'Général') + '</span>' + (a.ech ? '<span class="pill g">' + esc(new Date(a.ech).toLocaleDateString('fr-FR')) + '</span>' : '') + '</div><h4>' + esc(a.titre) + '</h4><p class="progress">' + esc([a.resp, a.budget ? fmtK(numK(a.budget)) + ' €' : '', a.gain].filter(Boolean).join(' · ')) + '</p><div class="ctool">' + (st !== 'À faire' ? '<button class="btn ghost sm" data-pl="mv" data-i="' + i + '" data-d="-1" aria-label="Reculer">←</button>' : '') + (st !== 'Fait' ? '<button class="btn ghost sm" data-pl="mv" data-i="' + i + '" data-d="1">' + (st === 'À faire' ? 'Démarrer →' : 'Terminer ✓') + '</button>' : '') + '<button class="linkbtn" data-pl="edita" data-i="' + i + '">Modifier</button></div></div>').join('') + '</div>').join('') + '</div>';
    if (!d.actions.length) h += '<div class="callout b"><strong>Aucune action pour l\'instant</strong>Ajoutez vos actions une par une, ou importez celles proposées par votre autodiagnostic.</div>';
  } else if (PL.tab === 'route') {
    h += '<p class="prose">Les dix étapes pour structurer une démarche RSE solide, de la première mesure jusqu\'à la reconnaissance. Cochez chaque étape franchie ; chacune renvoie vers l\'outil de l\'application qui aide à la réaliser.</p><div class="rprog"><div><i style="width:' + Math.round(100 * nR / ROUTE.length) + '%"></i></div><b>' + nR + ' / ' + ROUTE.length + '</b></div><ol class="route">' + ROUTE.map(([t, dsc, go], i) => '<li class="' + (d.route[i] ? 'ok' : '') + '"><label class="rchk"><input type="checkbox" data-pl="route" data-i="' + i + '"' + (d.route[i] ? ' checked' : '') + '><span class="rnum">' + (i + 1) + '</span></label><div><h4>' + t + '</h4><p>' + dsc + '</p>' + (go ? '<a class="linkbtn" href="#' + go + '">Ouvrir l\'outil →</a>' : '') + '</div></li>').join('') + '</ol>';
  } else {
    h += '<p class="prose">Les principaux dispositifs publics pour financer un diagnostic, des études ou des investissements de transition. Les conditions et les montants évoluent au fil de l\'année : vérifiez-les toujours sur le site officiel avant de déposer un dossier.</p><div class="grid two">' + AIDES.map(([t, qui, dsc, pour, u]) => '<div class="card aide"><div class="meta"><span class="pill">' + esc(qui) + '</span></div><h4>' + esc(t) + '</h4><p>' + esc(dsc) + '</p><p class="progress"><strong>Pour qui :</strong> ' + esc(pour) + '</p><a class="btn ghost sm" href="' + esc(u) + '" target="_blank" rel="noopener">Site officiel →</a></div>').join('') + '</div><div class="callout b"><strong>Par où commencer ?</strong>Pour une PME qui n\'a jamais mesuré son empreinte, le Diag Décarbon\'Action est en général le premier pas : il finance le bilan carbone et le plan d\'action, qui ouvrent ensuite l\'accès aux prêts verts et aux aides à l\'investissement.</div>';
  }
  h += '<p class="foot">Vos données restent sur cet appareil. Sources des aides : Bpifrance, ADEME, ministère de l\'Économie, consultés le 1er novembre 2026.</p>';
  el.innerHTML = h;
}
function chargerXLSX(){
  if (window.XLSX) return Promise.resolve(window.XLSX);
  const load = src => new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = () => window.XLSX ? res(window.XLSX) : rej(new Error('xlsx')); s.onerror = () => rej(new Error('xlsx')); document.head.appendChild(s); });
  return load('lib/xlsx.full.min.js').catch(() => load('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'));
}
function kpiRows(){ const d = PL.d; return d.kpi.map(k => { const o = {Indicateur: k.nom, Pilier: k.pil, Unité: k.u, Sens: k.sens === 'baisse' ? 'À baisser' : 'À augmenter'}; d.annees.forEach(a => { o[String(a)] = numK(k.v[a]); }); o.Objectif = numK(k.cible); o['Année cible'] = numK(k.an); return o; }); }
async function exportXlsx(){
  const X = await chargerXLSX(), wb = X.utils.book_new();
  X.utils.book_append_sheet(wb, X.utils.json_to_sheet(kpiRows()), 'Indicateurs');
  const longue = []; PL.d.kpi.forEach(k => PL.d.annees.forEach(a => { const v = numK(k.v[a]); if (v != null) longue.push({Indicateur: k.nom, Pilier: k.pil, Unité: k.u, Année: a, Valeur: v}); }));
  X.utils.book_append_sheet(wb, X.utils.json_to_sheet(longue.length ? longue : [{Indicateur: '', Pilier: '', Unité: '', Année: '', Valeur: ''}]), 'Données Power BI');
  X.utils.book_append_sheet(wb, X.utils.json_to_sheet(PL.d.kpi.map(k => { const q = k.q || {}; return {Indicateur: k.nom, Unité: k.u, Définition: q.def || '', 'Méthode de calcul': q.meth || '', Périmètre: q.per || '', Source: q.src || '', Responsable: q.resp || '', Fréquence: q.freq || '', 'Date de collecte': q.dcol || '', 'Date de validation': q.dval || '', 'Validé par': q.valpar || '', Fiabilité: q.fiab || 'Non renseignée', Justificatifs: q.just || '', 'Modifications enregistrées': (k.hist || []).length}; })), 'Qualité des données');
  X.utils.book_append_sheet(wb, X.utils.json_to_sheet(PL.d.actions.map(a => ({Action: a.titre, Pilier: a.pil, Responsable: a.resp, Échéance: a.ech, Statut: a.st, 'Budget (€)': numK(a.budget), 'Gain attendu': a.gain}))), 'Plan d\'action');
  X.utils.book_append_sheet(wb, X.utils.aoa_to_sheet([['Tableau de bord RSE exporté depuis SERIKI BIBLE RSE le ' + new Date().toLocaleDateString('fr-FR')], [''], ['Feuille « Indicateurs » : modifiable, puis réimportable dans l\'application.'], ['Feuille « Données Power BI » : format long (une ligne par indicateur et par année), prêt pour Power BI ou un tableau croisé dynamique.'], ['Feuille « Plan d\'action » : la liste des actions et leur statut.']]), 'Lisez-moi');
  const buf = X.write(wb, {bookType: 'xlsx', type: 'array'});
  await saveBlob(new Blob([buf], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'Tableau de bord RSE.xlsx'); toast('Fichier Excel exporté');
}
async function importXlsx(file){
  const X = await chargerXLSX(), wb = X.read(await file.arrayBuffer(), {type: 'array'}), ws = wb.Sheets['Indicateurs'] || wb.Sheets[wb.SheetNames[0]];
  const rows = X.utils.sheet_to_json(ws, {defval: ''}); if (!rows.length) throw new Error('vide');
  const cols = Object.keys(rows[0]), ans = cols.filter(c => /^(19|20)\d{2}$/.test(String(c).trim())).map(Number).sort();
  const nomCol = cols.find(c => /indicateur|libell|nom/i.test(c)) || cols[0];
  if (ans.length) PL.d.annees = ans;
  rows.forEach(r => {
    const nom = String(r[nomCol] || '').trim(); if (!nom) return;
    let k = PL.d.kpi.find(x => norm(x.nom) === norm(nom));
    if (!k) { k = {id: uid(), nom, u: String(r['Unité'] || r.Unite || ''), sens: /augment|hausse/i.test(r.Sens || '') ? 'hausse' : 'baisse', pil: String(r.Pilier || 'Autre'), v: {}, cible: '', an: ''}; PL.d.kpi.push(k); }
    ans.forEach(a => { const v = r[a] ?? r[String(a)]; if (v !== '' && v != null) k.v[a] = v; });
    if (r.Objectif !== '' && r.Objectif != null) k.cible = r.Objectif; if (r['Année cible']) k.an = r['Année cible'];
  });
  await pilSave(); renderPilot(); toast(rows.length + ' lignes importées');
}
async function exportCsv(){
  const L = [['Indicateur', 'Pilier', 'Unité', 'Année', 'Valeur']]; PL.d.kpi.forEach(k => PL.d.annees.forEach(a => { const v = numK(k.v[a]); if (v != null) L.push([k.nom, k.pil, k.u, a, String(v).replace('.', ',')]); }));
  await saveBlob(new Blob(['﻿' + L.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(';')).join('\r\n')], {type: 'text/csv'}), 'Indicateurs RSE.csv'); toast('Fichier CSV exporté');
}
async function exportActions(){ const X = await chargerXLSX(), wb = X.utils.book_new(); X.utils.book_append_sheet(wb, X.utils.json_to_sheet(PL.d.actions.map(a => ({Action: a.titre, Pilier: a.pil, Responsable: a.resp, Échéance: a.ech, Statut: a.st, 'Budget (€)': numK(a.budget), 'Gain attendu': a.gain}))), 'Plan d\'action'); await saveBlob(new Blob([X.write(wb, {bookType: 'xlsx', type: 'array'})], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), 'Plan d\'action RSE.xlsx'); toast('Plan d\'action exporté'); }
function actionModal(i){
  const a = i != null ? PL.d.actions[i] : {titre: '', pil: 'Climat', resp: '', ech: '', st: 'À faire', budget: '', gain: ''};
  const f = (id, l, v, t) => '<div class="row"><label for="' + id + '">' + l + '</label><input class="inp" id="' + id + '" type="' + (t || 'text') + '" value="' + esc(v || '') + '"></div>';
  modal(i != null ? 'Modifier l\'action' : 'Nouvelle action', f('paT', 'Action', a.titre) + '<div class="row"><label for="paP">Pilier</label><select class="inp" id="paP">' + ['Gouvernance', 'Climat', 'Ressources', 'Social', 'Achats', 'Clients et éthique', 'Autre'].map(x => '<option' + (x === a.pil ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div><div class="row"><label for="paK">Indicateur suivi</label><select class="inp" id="paK"><option value="">Aucun</option>' + PL.d.kpi.map(k => '<option value="' + esc(k.id) + '"' + (a.kpi === k.id ? ' selected' : '') + '>' + esc(k.nom) + '</option>').join('') + '</select></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px">' + f('paR', 'Responsable', a.resp) + f('paE', 'Échéance', a.ech, 'date') + f('paB', 'Budget (€)', a.budget, 'number') + '<div class="row"><label for="paS">Statut</label><select class="inp" id="paS">' + PST.map(x => '<option' + (x === a.st ? ' selected' : '') + '>' + x + '</option>').join('') + '</select></div></div>' + f('paG', 'Gain attendu', a.gain) + (i != null ? '<p><button class="linkbtn" style="color:var(--danger)" id="paDel">Supprimer cette action</button></p>' : ''), 'Enregistrer', async () => {
    const v = id => document.getElementById(id).value.trim(); if (!v('paT')) { toast('Indiquez l\'action'); return false; }
    Object.assign(a, {kpi: v('paK'), titre: v('paT'), pil: v('paP'), resp: v('paR'), ech: v('paE'), budget: v('paB'), st: v('paS'), gain: v('paG')}); if (i == null) PL.d.actions.push(Object.assign({id: uid()}, a)); await pilSave(); renderPilot();
  }, false, () => { const del = document.getElementById('paDel'); if (del) del.onclick = async () => { PL.d.actions.splice(i, 1); await pilSave(); document.getElementById('modal').hidden = true; renderPilot(); toast('Action supprimée'); }; });
}


function kpiControles(d){
  const L = [];
  d.kpi.forEach(k => {
    const vals = d.annees.map(a => [a, numK(k.v[a])]).filter(x => x[1] != null);
    if (!vals.length) return;
    vals.forEach(([a, v]) => { if (v < 0) L.push('<strong>' + esc(k.nom) + '</strong> : valeur négative en ' + a + '.'); });
    for (let i = 1; i < vals.length; i++) { const [a0, v0] = vals[i - 1], [a1, v1] = vals[i]; if (v0 && Math.abs((v1 - v0) / v0) > .3) L.push('<strong>' + esc(k.nom) + '</strong> : variation de ' + (v1 > v0 ? '+' : '') + vf(Math.round((v1 - v0) / v0 * 1000) / 10) + ' % entre ' + a0 + ' et ' + a1 + ', à expliquer (changement de périmètre, de méthode, erreur de saisie ?).'); }
    const idx = d.annees.map(a => numK(k.v[a]) != null), f = idx.indexOf(true), l = idx.lastIndexOf(true); for (let i = f; i <= l; i++) if (!idx[i]) L.push('<strong>' + esc(k.nom) + '</strong> : valeur manquante en ' + d.annees[i] + '.');
    if (!k.q || !k.q.src) L.push('<strong>' + esc(k.nom) + '</strong> : source non renseignée (bouton « Fiche »).');
    else if (k.q.fiab === 'Estimée') L.push('<strong>' + esc(k.nom) + '</strong> : donnée estimée, à signaler comme telle dans tout rapport.');
  });
  return L;
}
const FIAB = [['Mesurée', 'Relevé direct : compteur, facture, logiciel de paie.'], ['Calculée', 'Calcul à partir de données mesurées et d\'un facteur documenté.'], ['Estimée', 'Extrapolation ou hypothèse : à signaler dans le rapport.'], ['Non vérifiée', 'Donnée reçue mais pas encore contrôlée.']];
function ficheKpi(i){
  const k = PL.d.kpi[i], q = k.q || {}, f = (id, l, ph, ta) => '<div class="row"><label>' + l + (ta ? '<textarea class="inp" rows="2" id="q_' + id + '" placeholder="' + (ph || '') + '">' + esc(q[id] || '') + '</textarea>' : '<input class="inp" id="q_' + id + '" value="' + esc(q[id] || '') + '" placeholder="' + (ph || '') + '">') + '</label></div>';
  const H = (k.hist || []).slice().reverse();
  modal('Fiche qualité : ' + k.nom, '<p class="note">Ce qui permet de retrouver d\'où vient le chiffre, qui l\'a produit et qui l\'a validé. C\'est ce que demandent un auditeur, un client ou un financeur.</p>'
    + f('def', 'Définition', 'Ce que mesure exactement l\'indicateur', true) + f('meth', 'Méthode de calcul et hypothèses', 'Ex. : kWh facturés × facteur d\'émission ADEME 2026', true) + f('per', 'Périmètre', 'Sites, sociétés et période couverts') + f('src', 'Source des données', 'Ex. : factures du fournisseur, logiciel de paie') + '<div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px">' + f('resp', 'Responsable de la donnée') + f('freq', 'Fréquence de collecte', 'Mensuelle, annuelle…') + f('dcol', 'Date de collecte', 'jj/mm/aaaa') + f('dval', 'Date de validation', 'jj/mm/aaaa') + '</div>' + f('valpar', 'Validé par') 
    + '<div class="row"><label>Niveau de fiabilité<select class="inp" id="q_fiab"><option value="">Non renseigné</option>' + FIAB.map(([a, b]) => '<option value="' + a + '"' + (q.fiab === a ? ' selected' : '') + '>' + a + ' : ' + b + '</option>').join('') + '</select></label></div>' + f('just', 'Justificatifs et où les trouver', 'Ex. : dossier partagé « Preuves 2026 / Énergie »', true)
    + '<h4 style="margin:14px 0 6px">Historique des modifications</h4>' + (H.length ? '<ul class="khist">' + H.map(h => '<li><b>' + new Date(h.d).toLocaleString('fr-FR', {dateStyle: 'short', timeStyle: 'short'}) + '</b> · ' + esc(h.an) + ' : ' + esc(h.old || 'vide') + ' → ' + esc(h.nv || 'vide') + '</li>').join('') + '</ul>' : '<p class="note">Aucune modification enregistrée pour l\'instant. Chaque changement de valeur sera noté ici.</p>'),
    'Enregistrer', async () => { const nq = {}; ['def', 'meth', 'per', 'src', 'resp', 'freq', 'dcol', 'dval', 'valpar', 'fiab', 'just'].forEach(id => { const el = document.getElementById('q_' + id); if (el) nq[id] = el.value.trim(); }); k.q = nq; await pilSave(); const y = window.scrollY; renderPilot(); window.scrollTo(0, y); toast('Fiche enregistrée'); });
}
const pilotRoot = document.getElementById('pilotRoot');
pilotRoot.addEventListener('click', async e => {
  const kf = e.target.closest('[data-pl="kfiche"]'); if (kf) { ficheKpi(+kf.dataset.i); return; }
  const b = e.target.closest('[data-pl]'); if (!b || b.tagName === 'INPUT') return; const a = b.dataset.pl, d = PL.d;
  try {
    if (a === 'xlsx') await exportXlsx(); else if (a === 'csv') await exportCsv(); else if (a === 'xlsxa') await exportActions();
    else if (a === 'demo') { const A3 = d.annees.slice(-3), ex = {ges: [1240, 1180, 1095, 800, 2030], s12: [310, 285, 260, 150, 2030], ener: [2150, 2040, 1960, 1500, 2030], enr: [18, 24, 31, 60, 2030], dech: [96, 91, 84, 70, 2028], valo: [52, 58, 66, 80, 2028], tf: [14.2, 12.8, 10.1, 6, 2028], form: [11, 13, 15, 20, 2028], egal: [82, 85, 88, 95, 2028], achats: [12, 25, 41, 80, 2028]}; d.kpi.forEach(k => { const e = ex[k.id]; if (!e) return; A3.forEach((an, j) => { k.v[an] = e[j]; }); k.cible = e[3]; k.an = e[4]; }); await pilSave(); renderPilot(); toast('Exemple chargé : remplacez les valeurs par les vôtres'); }
    else if (a === 'addk') { d.kpi.push({id: uid(), nom: 'Nouvel indicateur', u: '', sens: 'hausse', pil: 'Autre', v: {}, cible: '', an: ''}); await pilSave(); renderPilot(); }
    else if (a === 'delk') { d.kpi.splice(+b.dataset.i, 1); await pilSave(); renderPilot(); }
    else if (a === 'addan') { d.annees.push(Math.max(...d.annees) + 1); await pilSave(); renderPilot(); }
    else if (a === 'adda') actionModal(null);
    else if (a === 'edita') actionModal(+b.dataset.i);
    else if (a === 'mv') { const x = d.actions[+b.dataset.i]; x.st = PST[Math.max(0, Math.min(2, PST.indexOf(x.st) + (+b.dataset.d)))]; await pilSave(); renderPilot(); }
    else if (a === 'fromdiag') { if (!DG.d || !Object.keys(DG.d.rep || {}).length) { toast('Faites d\'abord l\'autodiagnostic'); location.hash = 'diagnostic'; return; } const plan = diagPlan(); let n = 0; const ech = {'Dans les 3 mois': 90, 'Dans les 12 mois': 365, 'Dans les 24 mois': 730}; plan.forEach(([t, L]) => L.forEach(x => { if (d.actions.some(y => y.titre === x.action)) return; d.actions.push({id: uid(), titre: x.action, pil: x.pilier, resp: '', ech: new Date(Date.now() + ech[t] * 864e5).toISOString().slice(0, 10), st: 'À faire', budget: '', gain: ''}); n++; })); await pilSave(); renderPilot(); toast(n + ' action' + (n > 1 ? 's' : '') + ' importée' + (n > 1 ? 's' : '')); }
  } catch(err) { toast('Opération impossible : ' + (err && err.message ? err.message : 'erreur')); }
});
pilotRoot.addEventListener('change', async e => {
  const t = e.target;
  if (t.id === 'plImport' && t.files.length) { try { await importXlsx(t.files[0]); } catch(err) { toast('Fichier illisible : utilisez le modèle exporté'); } t.value = ''; return; }
  if (t.dataset.pl === 'route') { PL.d.route[t.dataset.i] = t.checked; await pilSave(); renderPilot(); return; }
  if (t.dataset.an != null) { const v = parseInt(t.value, 10); if (v > 1900 && v < 2200) { const old = PL.d.annees[+t.dataset.an]; PL.d.annees[+t.dataset.an] = v; PL.d.kpi.forEach(k => { if (k.v[old] != null) { k.v[v] = k.v[old]; delete k.v[old]; } }); await pilSave(); renderPilot(); } return; }
  if (t.dataset.k != null) { const k = PL.d.kpi[+t.dataset.k]; if (t.dataset.a) { const old = k.v[t.dataset.a] == null ? '' : String(k.v[t.dataset.a]), nv = t.value.trim(); if (old !== nv) { k.hist = (k.hist || []).concat({d: new Date().toISOString(), an: t.dataset.a, old, nv}).slice(-60); } k.v[t.dataset.a] = nv; } else k[t.dataset.f] = t.value.trim(); await pilSave(); const y = window.scrollY; renderPilot(); window.scrollTo(0, y); }
});
window.addEventListener('hashchange', () => { if (route().base === 'pilotage') renderPilot(); });
(typeof espaceReady !== 'undefined' ? espaceReady : Promise.resolve()).then(pilInit, pilInit);


/* =====================================================================
   COMPRENDRE EN PROFONDEUR : les notions clés, développées
   ===================================================================== */
const NOTIONS = [
  {id: 'rse', t: 'La RSE', s: 'Responsabilité sociétale des entreprises', c: '#0F5B3E',
   def: 'La RSE est la façon dont une entreprise assume la responsabilité des effets de ses décisions et de ses activités sur la société et sur l\'environnement. La Commission européenne la définit ainsi depuis 2011, et la norme ISO 26000 en fixe les lignes directrices : un comportement transparent et éthique, qui contribue au développement durable, tient compte des attentes des parties prenantes et respecte les lois.',
   pourquoi: 'Pendant longtemps, la RSE a été vue comme une affaire de communication. Ce n\'est plus le cas : les clients l\'exigent dans leurs appels d\'offres, les banques l\'intègrent à leurs décisions de crédit, les salariés la regardent avant de rejoindre une entreprise, et la loi encadre de plus en plus ce qui est publié. Une entreprise qui ignore ses impacts s\'expose à des risques juridiques, financiers et d\'image.',
   comment: ['La RSE couvre sept questions centrales selon l\'ISO 26000 : la gouvernance, les droits de l\'Homme, les relations et conditions de travail, l\'environnement, la loyauté des pratiques, les questions relatives aux consommateurs, et l\'engagement auprès des communautés.', 'Une démarche RSE suit toujours le même cycle : identifier ses enjeux prioritaires, se fixer des objectifs mesurables, agir, mesurer les résultats et en rendre compte.', 'Elle concerne tous les métiers de l\'entreprise : achats, production, ressources humaines, finance, marketing, direction.'],
   exemple: 'Une PME de 80 salariés qui fabrique des emballages commence par un diagnostic : ses principaux enjeux sont l\'énergie de ses machines, la sécurité au travail et la recyclabilité de ses produits. Elle se fixe trois objectifs à trois ans (–20 % d\'énergie, taux d\'accidents divisé par deux, 100 % d\'emballages recyclables), nomme un référent, suit six indicateurs et publie chaque année une page de résultats pour ses clients.',
   erreurs: ['Confondre RSE et mécénat : financer une association ne remplace pas la réduction de ses propres impacts.', 'Lancer des actions visibles mais secondaires (gobelets, potager) en ignorant les vrais enjeux du métier.', 'Communiquer avant d\'avoir des résultats mesurés, au risque d\'être accusé d\'écoblanchiment.'],
   retenir: 'La RSE, c\'est gérer ses impacts réels, en priorité les plus importants, avec des objectifs mesurés et une gouvernance claire.',
   liens: [['fondamentaux', 'Fondamentaux'], ['diagnostic', 'Autodiagnostic RSE'], ['normes', 'ISO 26000 et normes']]},
  {id: 'dd', t: 'Le développement durable', s: 'Répondre aux besoins d\'aujourd\'hui sans compromettre ceux de demain', c: '#1F6F73',
   def: 'Le développement durable est un développement qui répond aux besoins du présent sans compromettre la capacité des générations futures à répondre aux leurs. Cette définition vient du rapport Brundtland de 1987. Elle repose sur trois piliers indissociables : l\'environnement, le social et l\'économie.',
   pourquoi: 'C\'est le cadre qui donne son sens à la RSE. En 2015, les Nations unies ont adopté 17 Objectifs de développement durable (ODD) à atteindre d\'ici 2030, et l\'Accord de Paris a fixé l\'objectif de limiter le réchauffement bien en dessous de 2 °C. Les entreprises sont appelées à y contribuer.',
   comment: ['Le pilier environnemental : climat, biodiversité, ressources, pollution.', 'Le pilier social : conditions de travail, santé, égalité, droits humains, accès aux biens essentiels.', 'Le pilier économique : une activité viable, qui crée de la valeur durablement et la partage équitablement.', 'Une activité n\'est durable que si elle tient sur les trois piliers à la fois : un projet rentable mais destructeur pour l\'environnement ne l\'est pas, un projet vertueux mais sans modèle économique non plus.'],
   exemple: 'Une coopérative agricole qui convertit une partie de ses surfaces en agriculture biologique améliore la qualité des sols et de l\'eau (environnement), garantit un prix plus stable à ses producteurs (social) et accède à des marchés mieux valorisés (économie).',
   erreurs: ['Réduire le développement durable à l\'écologie, en oubliant le social.', 'Citer les 17 ODD sans dire précisément auxquels l\'entreprise contribue, ni comment.'],
   retenir: 'Développement durable = environnement + social + économie, tenus ensemble, sur le long terme.',
   liens: [['histoire', 'Histoire de la RSE'], ['fondamentaux', 'Les ODD']]},
  {id: 'esg', t: 'L\'ESG', s: 'Environnement, social, gouvernance', c: '#2357A6',
   def: 'L\'ESG désigne les trois familles de critères extra-financiers qu\'utilisent les investisseurs, les banques et les agences de notation pour évaluer une entreprise : environnementaux (E), sociaux (S) et de gouvernance (G). Là où la RSE est la démarche de l\'entreprise, l\'ESG est la grille avec laquelle l\'extérieur la juge.',
   pourquoi: 'L\'accès au financement en dépend de plus en plus : les fonds d\'investissement classent leurs produits selon le règlement européen SFDR, les banques mesurent les émissions de leurs clients, et les notations ESG sont encadrées par un règlement européen applicable depuis le 2 juillet 2026.',
   comment: ['E : émissions de gaz à effet de serre, énergie, eau, déchets, biodiversité.', 'S : santé et sécurité, conditions de travail, égalité, formation, relations avec les fournisseurs et les communautés.', 'G : composition et indépendance du conseil, éthique, lutte contre la corruption, rémunération des dirigeants, transparence.', 'Les agences de notation et les questionnaires (EcoVadis, CDP) transforment ces informations en scores comparables.'],
   exemple: 'Une ETI qui veut obtenir un prêt reçoit de sa banque un questionnaire ESG : émissions des scopes 1 et 2, part des femmes dans l\'encadrement, existence d\'un code de conduite. Les réponses influencent le taux proposé et l\'éligibilité à un prêt vert.',
   erreurs: ['Penser que l\'ESG ne concerne que les entreprises cotées : les banques et les grands clients interrogent aussi les PME.', 'Répondre aux questionnaires sans preuves : un score ESG se fonde sur des documents.'],
   retenir: 'L\'ESG est la lecture financière de la RSE : c\'est elle qui conditionne l\'accès aux capitaux.',
   liens: [['europe', 'SFDR et finance durable'], ['terrain--ecovadis', 'Répondre à EcoVadis']]},
  {id: 'dm', t: 'La double matérialité', s: 'Deux regards sur chaque enjeu', c: '#6B4BA1',
   def: 'La double matérialité est le principe au cœur de la CSRD. Un enjeu de durabilité est « matériel », c\'est-à-dire important au point d\'être publié, s\'il l\'est sous au moins un des deux angles : la matérialité d\'impact (les effets de l\'entreprise sur les personnes et l\'environnement) ou la matérialité financière (les risques et opportunités que cet enjeu fait peser sur les résultats de l\'entreprise).',
   pourquoi: 'C\'est elle qui détermine le contenu du rapport de durabilité : seules les informations des ESRS liées aux enjeux matériels sont publiées. Une analyse bien faite évite de publier des centaines de données inutiles ; une analyse bâclée expose à des reproches de l\'auditeur.',
   comment: ['Comprendre le contexte : activités, chaîne de valeur, parties prenantes.', 'Dresser la liste des enjeux possibles à partir des ESRS et du secteur.', 'Pour chaque enjeu, identifier les impacts, risques et opportunités (les « IRO »).', 'Coter les impacts selon leur gravité (ampleur, étendue, caractère irrémédiable) et leur probabilité ; coter les risques financiers selon leur ampleur et leur probabilité.', 'Fixer des seuils, valider avec la direction, documenter chaque choix pour l\'auditeur.'],
   exemple: 'Pour un transporteur, le climat est matériel des deux côtés : ses camions émettent beaucoup (impact) et la hausse du prix du carbone menace ses marges (risque financier). La biodiversité, en revanche, peut n\'être matérielle sous aucun angle si l\'entreprise n\'a pas de sites sensibles.',
   erreurs: ['Ne regarder que les risques financiers et oublier les impacts.', 'Faire l\'exercice seul, sans consulter les parties prenantes ni les directions métier.', 'Ne pas documenter les seuils et les cotations.'],
   retenir: 'Un enjeu est publié s\'il compte pour le monde, pour l\'entreprise, ou pour les deux.',
   liens: [['csrd', 'CSRD : la double matérialité pas à pas'], ['labo', 'Cas pratique de double matérialité']]},
  {id: 'csrd', t: 'La CSRD', s: 'La directive européenne sur le reporting de durabilité', c: '#0F5B3E',
   def: 'La CSRD (Corporate Sustainability Reporting Directive) oblige certaines entreprises à publier chaque année un rapport de durabilité, intégré au rapport de gestion, établi selon les normes européennes ESRS et vérifié par un auditeur. Depuis l\'Omnibus I, en vigueur le 18 mars 2026, elle vise les entreprises de plus de 1 000 salariés réalisant plus de 450 M€ de chiffre d\'affaires.',
   pourquoi: 'Elle rend les informations de durabilité aussi fiables et comparables que les informations financières. Même les entreprises qui ne sont plus concernées en ressentent les effets : leurs grands clients et leurs banques leur demandent des données, dans la limite prévue par le plafond de la chaîne de valeur.',
   comment: ['Analyse de double matérialité pour choisir les enjeux.', 'Publication des informations des ESRS correspondantes : climat, pollution, eau, biodiversité, ressources, effectifs, chaîne de valeur, communautés, consommateurs, conduite des affaires.', 'Vérification par un commissaire aux comptes ou un organisme tiers (assurance limitée).', 'Les ESRS révisés, publiés au Journal officiel le 21 septembre 2026, sont obligatoires pour les exercices ouverts à partir du 1er janvier 2027.', 'Les entreprises hors champ peuvent utiliser la norme volontaire européenne, plus légère.'],
   exemple: 'Un groupe industriel de 3 000 salariés prépare son rapport 2027 : il met à jour sa double matérialité, organise la collecte des données auprès de ses 12 sites, met en place des contrôles internes et prévoit la revue de l\'auditeur avant l\'arrêté des comptes.',
   erreurs: ['Croire que la CSRD a disparu : elle est recentrée, pas supprimée.', 'Sous-estimer le temps de collecte des données : il faut compter plusieurs mois.'],
   retenir: 'CSRD = qui publie et comment c\'est contrôlé ; ESRS = ce qu\'on publie.',
   liens: [['csrd', 'CSRD et ESRS'], ['outils', 'Suis-je concerné ?']]},
  {id: 'taxo', t: 'La taxonomie verte', s: 'Le classement européen des activités durables', c: '#A8621A',
   def: 'La taxonomie européenne est un système de classification qui dit quelles activités économiques peuvent être considérées comme durables sur le plan environnemental. Elle sert de référence commune aux entreprises, aux investisseurs et aux autorités, pour éviter que chacun définisse « vert » à sa manière.',
   pourquoi: 'Les entreprises concernées publient la part de leur chiffre d\'affaires, de leurs investissements (CapEx) et de leurs dépenses d\'exploitation (OpEx) qui est alignée sur la taxonomie. Les banques s\'en servent pour orienter leurs financements et les fonds pour classer leurs produits.',
   comment: ['Six objectifs environnementaux : atténuation du changement climatique, adaptation, eau, économie circulaire, pollution, biodiversité.', 'Éligibilité : l\'activité figure-t-elle dans les actes délégués ?', 'Alignement : elle contribue substantiellement à au moins un objectif, ne cause de préjudice important à aucun autre (principe DNSH) et respecte des garanties sociales minimales.', 'Depuis la simplification, un seuil de 10 % permet d\'écarter les activités non significatives.'],
   exemple: 'Un promoteur immobilier construit un immeuble de bureaux. L\'activité est éligible ; elle est alignée si le bâtiment respecte les critères techniques de performance énergétique, si les risques climatiques ont été évalués (adaptation) et si les matériaux et déchets du chantier respectent les critères DNSH.',
   erreurs: ['Confondre éligible et aligné : une activité éligible n\'est pas forcément durable.', 'Oublier le DNSH, souvent le critère le plus exigeant à documenter.'],
   retenir: 'Éligible = l\'activité est dans la liste ; alignée = elle respecte tous les critères.',
   liens: [['taxonomie', 'Taxonomie et calculateur']]},
  {id: 'carbone', t: 'Le bilan carbone', s: 'Mesurer ses émissions de gaz à effet de serre', c: '#C2532A',
   def: 'Un bilan carbone mesure les émissions de gaz à effet de serre liées à l\'activité d\'une organisation, exprimées en tonnes d\'équivalent CO₂ (tCO₂e). Il suit le GHG Protocol au niveau international ou la méthode Bilan Carbone en France, et classe les émissions en trois scopes.',
   pourquoi: 'On ne réduit que ce que l\'on mesure. Le bilan identifie les postes qui pèsent le plus et permet de construire un plan de réduction crédible. En France, il est obligatoire à partir de 500 salariés (BEGES, tous les 4 ans), et de plus en plus demandé par les clients et les banques en dessous.',
   comment: ['Scope 1 : émissions directes (chaudières, fours, véhicules de l\'entreprise, fuites de fluides frigorigènes).', 'Scope 2 : émissions de l\'énergie achetée (électricité, chaleur, froid).', 'Scope 3 : toutes les autres émissions de la chaîne de valeur (achats, transport, déplacements, usage et fin de vie des produits). C\'est souvent la plus grosse part.', 'Pour chaque poste : donnée d\'activité × facteur d\'émission (Base Empreinte de l\'ADEME en France).', 'Le Diag Décarbon\'Action de Bpifrance et de l\'ADEME finance une partie du premier bilan des PME de moins de 500 salariés.'],
   exemple: 'Une entreprise de 60 salariés consomme 180 000 kWh d\'électricité par an. Avec un facteur d\'environ 0,05 kgCO₂e par kWh pour l\'électricité française, cela fait environ 9 tCO₂e en scope 2. Ses achats de matières, eux, représentent plusieurs centaines de tonnes : c\'est là que le plan d\'action doit se concentrer.',
   erreurs: ['S\'arrêter aux scopes 1 et 2, alors que l\'essentiel est souvent dans le scope 3.', 'Faire le bilan sans plan d\'action derrière.', 'Mélanger des années ou des périmètres différents d\'un bilan à l\'autre.'],
   retenir: 'Mesurer les trois scopes, repérer les gros postes, agir d\'abord sur eux.',
   liens: [['terrain--bilan-carbone', 'Guide pas à pas et calculatrice'], ['reporting', 'Reporting et carbone'], ['pilotage--aides', 'Financer son bilan']]},
  {id: 'vigilance', t: 'Le devoir de vigilance', s: 'Prévenir les atteintes graves dans la chaîne de valeur', c: '#7A3E5B',
   def: 'Le devoir de vigilance oblige les grandes entreprises à identifier et à prévenir les atteintes graves aux droits humains, à la santé et à la sécurité des personnes et à l\'environnement, causées par leurs activités, celles de leurs filiales, de leurs sous-traitants et de leurs fournisseurs. La France l\'a créé en 2017 ; l\'Union européenne a adopté la CSDDD, qui s\'appliquera à partir de 2029.',
   pourquoi: 'Après l\'effondrement du Rana Plaza au Bangladesh en 2013, il est apparu que les donneurs d\'ordre ne pouvaient pas se désintéresser des conditions de fabrication de leurs produits. La loi française s\'applique dès 5 000 salariés en France (filiales comprises) ou 10 000 dans le monde, et les tribunaux sanctionnent désormais les plans incomplets.',
   comment: ['Cinq mesures : une cartographie des risques, des procédures d\'évaluation des filiales et fournisseurs, des actions de prévention, un mécanisme d\'alerte, un dispositif de suivi.', 'Le plan est publié et un compte rendu annuel de sa mise en œuvre l\'accompagne.', 'Depuis la décision du 25 juin 2026 visant TotalEnergies (frappée d\'appel), les juges attendent que les impacts climatiques, y compris les émissions liées à l\'usage des produits, figurent dans la cartographie des risques.'],
   exemple: 'Une enseigne de textile cartographie ses 300 fournisseurs par pays et par risque, fait auditer les usines les plus exposées, impose une charte sociale, ouvre une ligne d\'alerte accessible aux ouvriers et publie chaque année les résultats des audits et les mesures correctives.',
   erreurs: ['Publier un plan générique, sans cartographie propre à l\'entreprise.', 'Se limiter aux fournisseurs directs alors que les risques sont souvent plus loin dans la chaîne.'],
   retenir: 'Cartographier, évaluer, prévenir, alerter, suivre, et le prouver chaque année.',
   liens: [['terrain--plan-vigilance', 'Établir un plan de vigilance'], ['france', 'Réglementation France']]}
];
function renderComprendre(){
  const el = document.getElementById('compRoot'); if (!el) return;
  const id = route().base === 'comprendre' ? route().sub : null, n = NOTIONS.find(x => x.id === id);
  if (!n) {
    el.innerHTML = '<div class="eyebrow">APPRENDRE · LES NOTIONS CLÉS</div><h2>Comprendre en profondeur</h2><p class="lead">Les huit notions qu\'il faut maîtriser pour travailler dans la RSE, expliquées pas à pas : une définition claire, pourquoi c\'est important, comment cela fonctionne, un exemple concret, les erreurs à éviter et l\'idée à retenir.</p><div class="ngrid">'
      + NOTIONS.map((x, i) => '<a class="ncard" href="#comprendre--' + x.id + '" style="--nc:' + x.c + '"><span class="nnum">' + String(i + 1).padStart(2, '0') + '</span><strong>' + esc(x.t) + '</strong><span>' + esc(x.s) + '</span><em>Lire la fiche →</em></a>').join('') + '</div>';
    return;
  }
  const i = NOTIONS.indexOf(n), prev = NOTIONS[i - 1], next = NOTIONS[i + 1];
  el.innerHTML = '<p><a class="linkbtn" href="#comprendre">← Toutes les notions</a></p><div class="nhero" style="--nc:' + n.c + '"><span class="nnum">' + String(i + 1).padStart(2, '0') + ' / ' + NOTIONS.length + '</span><h2>' + esc(n.t) + '</h2><p>' + esc(n.s) + '</p><button class="btn light diabtn" data-diadom="compRoot" data-t="' + esc(n.t) + '" data-c="' + n.c + '">' + '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg> Diaporama</button></div>'
    + '<div class="nsec"><div class="nlab">Définition</div><p>' + esc(n.def) + '</p></div>'
    + '<div class="nsec"><div class="nlab">Pourquoi c\'est important</div><p>' + esc(n.pourquoi) + '</p></div>'
    + '<div class="nsec"><div class="nlab">Comment ça fonctionne</div><ol class="steps">' + n.comment.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol></div>'
    + '<div class="nsec nex" style="--nc:' + n.c + '"><div class="nlab">Un exemple concret</div><p>' + esc(n.exemple) + '</p></div>'
    + '<div class="nsec"><div class="nlab">Les erreurs à éviter</div><ul class="nerr">' + n.erreurs.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>'
    + '<div class="nretenir" style="--nc:' + n.c + '"><span>À retenir</span><p>' + esc(n.retenir) + '</p></div>'
    + '<div class="nsec"><div class="nlab">Pour aller plus loin dans l\'application</div><div class="filters">' + n.liens.map(([h, l]) => '<a class="chip" href="#' + h + '">' + esc(l) + ' →</a>').join('') + '</div></div>'
    + '<div class="nnav">' + (prev ? '<a class="btn ghost" href="#comprendre--' + prev.id + '">← ' + esc(prev.t) + '</a>' : '<span></span>') + (next ? '<a class="btn" href="#comprendre--' + next.id + '">' + esc(next.t) + ' →</a>' : '<a class="btn" href="#examen">Me tester avec l\'examen blanc →</a>') + '</div>';
}
window.addEventListener('hashchange', () => { if (route().base === 'comprendre') { renderComprendre(); window.scrollTo(0, 0); } });
renderComprendre();


/* =====================================================================
   ATELIER GRANDES ENTREPRISES : CSRD, COLLECTE, VIGILANCE, AUDIT
   ===================================================================== */
const ESRS_T = [
  ['E1', 'Changement climatique', '#2357A6', ['Consommation d\'énergie (MWh)', 'Émissions scopes 1 et 2 (tCO₂e)', 'Émissions scope 3 (tCO₂e)']],
  ['E2', 'Pollution', '#6B4BA1', ['Rejets de polluants dans l\'air et l\'eau']],
  ['E3', 'Eau et ressources marines', '#1F6F73', ['Consommation d\'eau (m³)']],
  ['E4', 'Biodiversité et écosystèmes', '#0F5B3E', ['Sites dans ou près de zones sensibles']],
  ['E5', 'Ressources et économie circulaire', '#A8621A', ['Déchets produits et valorisés (t)', 'Matières recyclées utilisées (t)']],
  ['S1', 'Effectifs de l\'entreprise', '#C2532A', ['Effectif et répartition', 'Accidents du travail', 'Heures de formation', 'Écart de rémunération femmes-hommes']],
  ['S2', 'Travailleurs de la chaîne de valeur', '#B23A22', ['Fournisseurs évalués sur les droits humains']],
  ['S3', 'Communautés touchées', '#7A3E5B', ['Plaintes et dialogues avec les riverains']],
  ['S4', 'Consommateurs et utilisateurs finaux', '#2F7F8F', ['Incidents de sécurité des produits', 'Réclamations clients']],
  ['G1', 'Conduite des affaires', '#12241C', ['Salariés formés à l\'éthique', 'Délais de paiement des fournisseurs', 'Cas de corruption confirmés']]
];
const VIG_CAT = [['Textile et habillement', 5], ['Minerais et métaux', 5], ['Agriculture et alimentaire', 4], ['Électronique', 4], ['Chimie et plastiques', 4], ['Construction et sous-traitance de chantier', 4], ['Transport et logistique', 3], ['Emballages', 3], ['Fournitures de bureau', 2], ['Services informatiques', 2], ['Services intellectuels', 1]];
const VIG_ZONE = [['Faible', 1], ['Moyen', 3], ['Élevé', 5]];
const VIG_MES = ['Cartographie des risques, mise à jour au moins chaque année', 'Procédures d\'évaluation régulière des filiales, sous-traitants et fournisseurs', 'Actions d\'atténuation des risques et de prévention des atteintes graves', 'Mécanisme d\'alerte et de recueil des signalements, établi avec les syndicats', 'Dispositif de suivi des mesures et d\'évaluation de leur efficacité'];
const AUDIT_CHK = ['Analyse de double matérialité documentée (méthode, parties prenantes, seuils, résultats)', 'Périmètre de reporting défini et aligné sur le périmètre financier', 'Définitions et méthodes de calcul écrites pour chaque indicateur', 'Responsables de la donnée nommés dans chaque site et filiale', 'Contrôles internes : revue, rapprochements, validation par un second niveau', 'Piste d\'audit : chaque chiffre publié remonte à sa source', 'Calendrier convenu avec l\'auditeur, y compris une revue intermédiaire', 'Comité d\'audit informé et validation par la gouvernance'];
const AT = {d: null, tab: 'dma'};
async function atInit(){ try { const k = IDB.db && await IDB.get('kv', 'atelier'); AT.d = k || null; } catch(e) {} if (!AT.d) AT.d = {id: 'atelier', dma: {}, seuilI: 2.5, seuilF: 2.5, entites: ['Siège'], coll: {}, fourn: [], mes: {}, cloture: '', chk: {}}; renderAtelier(); }
const atSave = () => { AT.d.updatedAt = Date.now(); return IDB.put('kv', AT.d).catch(() => toast('Enregistrement impossible')); };
function dmaScore(code){ const x = AT.d.dma[code] || {}; const n = v => +v || 0; return {imp: Math.round(n(x.g) * n(x.p) / 5 * 10) / 10, fin: Math.round(n(x.a) * n(x.pf) / 5 * 10) / 10, rempli: x.g != null || x.a != null, x}; }
const vf = n => String(n).replace('.', ',');
const dmaMat = code => { const s = dmaScore(code); return s.rempli && (s.imp >= AT.d.seuilI || s.fin >= AT.d.seuilF); };
function dmaMatrice(){
  const W = 420, H = 420, P = 50, X = v => P + v / 5 * (W - P - 20), Y = v => H - P - v / 5 * (H - P - 20);
  let g = '<rect x="' + P + '" y="20" width="' + (W - P - 20) + '" height="' + (H - P - 20) + '" fill="var(--paper)" stroke="var(--line)"/>';
  g += '<rect x="' + X(AT.d.seuilF) + '" y="20" width="' + (X(5) - X(AT.d.seuilF)) + '" height="' + (H - P - 20) + '" fill="#2357A6" fill-opacity=".06"/><rect x="' + P + '" y="20" width="' + (W - P - 20) + '" height="' + (Y(AT.d.seuilI) - 20) + '" fill="#0F5B3E" fill-opacity=".06"/>';
  g += '<line x1="' + X(AT.d.seuilF) + '" x2="' + X(AT.d.seuilF) + '" y1="20" y2="' + (H - P) + '" stroke="#2357A6" stroke-dasharray="5 4"/><line x1="' + P + '" x2="' + (W - 20) + '" y1="' + Y(AT.d.seuilI) + '" y2="' + Y(AT.d.seuilI) + '" stroke="#0F5B3E" stroke-dasharray="5 4"/>';
  [0, 1, 2, 3, 4, 5].forEach(v => { g += '<text x="' + X(v) + '" y="' + (H - P + 18) + '" text-anchor="middle" font-size="11" fill="currentColor">' + v + '</text><text x="' + (P - 10) + '" y="' + (Y(v) + 4) + '" text-anchor="end" font-size="11" fill="currentColor">' + v + '</text>'; });
  g += '<text x="' + ((W + P) / 2) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2357A6">Matérialité financière →</text><text transform="translate(14 ' + ((H - P) / 2 + 10) + ') rotate(-90)" text-anchor="middle" font-size="12.5" font-weight="700" fill="#0F5B3E">Matérialité d\'impact →</text>';
  ESRS_T.forEach(([c, n, col]) => { const s = dmaScore(c); if (!s.rempli) return; g += '<circle cx="' + X(s.fin) + '" cy="' + Y(s.imp) + '" r="15" fill="' + col + '" fill-opacity="' + (dmaMat(c) ? 1 : .35) + '"/><text x="' + X(s.fin) + '" y="' + (Y(s.imp) + 4) + '" text-anchor="middle" font-size="10.5" font-weight="800" fill="#fff">' + c + '</text>'; });
  return '<svg class="dmasvg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Matrice de double matérialité">' + g + '</svg>';
}
function retroplanning(){
  const c = AT.d.cloture; if (!c) return [];
  const d0 = new Date(c + 'T12:00:00'), m = k => { const d = new Date(d0.getFullYear(), d0.getMonth() + k, 1, 12), last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); d.setDate(Math.min(d0.getDate(), last)); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  return [[m(-9), 'Mettre à jour l\'analyse de double matérialité'], [m(-7), 'Valider le périmètre, les définitions et les méthodes de calcul'], [m(-6), 'Lancer la campagne de collecte auprès des sites et filiales'], [m(-4), 'Revue intermédiaire avec l\'auditeur (processus et premières données)'], [m(0), 'Clôture de l\'exercice'], [m(1), 'Fin de la collecte annuelle, consolidation et contrôles internes'], [m(2), 'Revue de l\'auditeur sur les données définitives'], [m(3), 'Arrêté du rapport de gestion, avec le rapport de durabilité, par la gouvernance'], [m(6), 'Approbation des comptes et publication (au plus tard six mois après la clôture pour une société anonyme)']];
}
function renderAtelier(){
  const el = document.getElementById('atRoot'); if (!el || !AT.d) return;
  const sub = route().base === 'atelier' ? route().sub : null; if (sub && ['dma', 'collecte', 'vigilance', 'audit', 'csddd'].includes(sub)) AT.tab = sub;
  const d = AT.d, mats = ESRS_T.filter(([c]) => dmaMat(c));
  let h = '<div class="eyebrow">AGIR · GRANDES ENTREPRISES ET ETI</div><h2>Atelier CSRD et vigilance</h2><p class="lead">Les outils des équipes RSE des grandes structures : l\'analyse de double matérialité et sa matrice, le suivi de la collecte des données dans les sites et filiales, la cartographie des risques fournisseurs du plan de vigilance, le rétroplanning de l\'audit et la préparation à la CSDDD.</p>';
  h += '<div class="ptabs">' + [['dma', 'Double matérialité', mats.length + ' enjeu' + (mats.length > 1 ? 'x' : '') + ' matériel' + (mats.length > 1 ? 's' : ''), ICO.chart], ['collecte', 'Collecte des données', d.entites.length + ' entité' + (d.entites.length > 1 ? 's' : ''), ICO.doc], ['vigilance', 'Plan de vigilance', d.fourn.length + ' fournisseur' + (d.fourn.length > 1 ? 's' : ''), ICO.flag], ['audit', 'Audit et calendrier', AUDIT_CHK.filter((x, i) => d.chk[i]).length + ' / ' + AUDIT_CHK.length + ' prêts', ICO.cal], ['csddd', 'CSDDD et industrie', 'Ce qui arrive', ICO.radar]].map(([k, t, s, ic]) => '<a class="ptab' + (AT.tab === k ? ' on' : '') + '" href="#atelier--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (AT.tab === 'dma') {
    h += '<p class="prose">Pour chaque norme thématique des ESRS, cotez de 0 à 5 l\'impact (gravité et probabilité) et l\'enjeu financier (ampleur et probabilité). Le score de chaque angle est le produit des deux notes ramené sur 5. Un enjeu est matériel dès qu\'un des deux scores atteint son seuil. Notez la justification : c\'est ce que l\'auditeur demandera.</p>'
      + '<div class="dmagrid"><div class="card">' + dmaMatrice() + '<div class="seuils"><label>Seuil d\'impact<input class="inp" type="number" min="0" max="5" step="0.5" data-at="seuilI" value="' + d.seuilI + '"></label><label>Seuil financier<input class="inp" type="number" min="0" max="5" step="0.5" data-at="seuilF" value="' + d.seuilF + '"></label></div></div><div class="card"><h4>Enjeux matériels</h4>' + (mats.length ? '<ul class="matl">' + mats.map(([c, n, col]) => { const s = dmaScore(c); return '<li><span class="mcode" style="background:' + col + '">' + c + '</span><span>' + esc(n) + '<small>Impact ' + vf(s.imp) + ' · Financier ' + vf(s.fin) + '</small></span></li>'; }).join('') + '</ul>' : '<p class="note">Cotez les enjeux ci-dessous : la liste se construit au fur et à mesure.</p>') + '<div class="ctool"><button class="btn" data-at="dmaxlsx">Exporter vers Excel</button><button class="btn ghost" data-at="dmadoc">Note de synthèse en Word</button></div></div></div>'
      + '<div class="tablewrap"><table class="dmatab"><thead><tr><th>Norme</th><th>Gravité de l\'impact</th><th>Probabilité</th><th>Ampleur financière</th><th>Probabilité</th><th>Scores</th><th>Justification</th></tr></thead><tbody>'
      + ESRS_T.map(([c, n, col]) => { const s = dmaScore(c), x = s.x, sel = (k, v) => '<select class="kin" data-dma="' + c + '" data-k="' + k + '" aria-label="' + esc(n) + ' ' + k + '"><option value="">–</option>' + [0, 1, 2, 3, 4, 5].map(i => '<option' + (String(v) === String(i) ? ' selected' : '') + '>' + i + '</option>').join('') + '</select>'; return '<tr' + (dmaMat(c) ? ' class="mat-on"' : '') + '><td><span class="mcode" style="background:' + col + '">' + c + '</span> ' + esc(n) + '</td><td>' + sel('g', x.g) + '</td><td>' + sel('p', x.p) + '</td><td>' + sel('a', x.a) + '</td><td>' + sel('pf', x.pf) + '</td><td class="num">' + (s.rempli ? vf(s.imp) + ' / ' + vf(s.fin) : '–') + '</td><td><input class="kin" data-dma="' + c + '" data-k="j" value="' + esc(x.j || '') + '" placeholder="Pourquoi cette cotation ?"></td></tr>'; }).join('') + '</tbody></table></div>';
  } else if (AT.tab === 'collecte') {
    const dps = (mats.length ? mats : ESRS_T).flatMap(([c, n, col, L]) => L.map(x => [c, x, col]));
    const st = ['', 'Demandé', 'Reçu', 'Validé'], nb = (e) => dps.filter(([c, x]) => (d.coll[e + '|' + c + '|' + x] || 0) === 3).length;
    h += '<p class="prose">' + (mats.length ? 'Les données à collecter découlent de vos enjeux matériels.' : 'Faites d\'abord la double matérialité pour limiter la collecte aux enjeux matériels ; en attendant, toutes les normes sont listées.') + ' Touchez une case pour faire avancer son statut : demandé, reçu, puis validé.</p>'
      + '<div class="ctool"><button class="btn" data-at="addent">+ Ajouter un site ou une filiale</button><button class="btn ghost" data-at="collxlsx">Exporter vers Excel</button></div>'
      + '<div class="cprog">' + d.entites.map((e, i) => { const p = Math.round(100 * nb(e) / dps.length); return '<div class="card"><div class="kh"><strong>' + esc(e) + '</strong><button class="linkbtn" style="color:var(--danger)" data-at="delent" data-i="' + i + '" aria-label="Supprimer ' + esc(e) + '">✕</button></div><div class="rprog"><div><i style="width:' + p + '%"></i></div><b>' + p + ' %</b></div></div>'; }).join('') + '</div>'
      + '<div class="tablewrap"><table class="colltab"><thead><tr><th>Donnée</th>' + d.entites.map(e => '<th>' + esc(e) + '</th>').join('') + '</tr></thead><tbody>' + dps.map(([c, x, col]) => '<tr><td><span class="mcode" style="background:' + col + '">' + c + '</span> ' + esc(x) + '</td>' + d.entites.map(e => { const k = e + '|' + c + '|' + x, v = d.coll[k] || 0; return '<td><button class="cst cst' + v + '" data-at="cst" data-k="' + esc(k) + '">' + (st[v] || 'À demander') + '</button></td>'; }).join('') + '</tr>').join('') + '</tbody></table></div>';
  } else if (AT.tab === 'vigilance') {
    const sc = f => { const c = (VIG_CAT.find(x => x[0] === f.cat) || [0, 1])[1], z = (VIG_ZONE.find(x => x[0] === f.zone) || [0, 1])[1], v = +f.vol || 1; return {risque: c * z, prio: c * z * v}; };
    const L = d.fourn.map((f, i) => Object.assign({i}, f, sc(f))).sort((a, b) => b.prio - a.prio);
    h += '<p class="prose">La loi impose cinq mesures. Commencez par la cartographie : pour chaque fournisseur ou sous-traitant, indiquez sa catégorie d\'achat, le niveau de risque de son pays (droits humains, environnement) et votre dépendance. L\'application classe les priorités d\'évaluation et d\'audit.</p>'
      + '<div class="ctool"><button class="btn" data-at="addf">+ Ajouter un fournisseur</button><button class="btn ghost" data-at="vigxlsx">Exporter la cartographie</button></div>'
      + (L.length ? '<div class="tablewrap"><table><thead><tr><th>Fournisseur</th><th>Pays</th><th>Catégorie</th><th>Risque pays</th><th>Dépendance (1 à 5)</th><th>Risque</th><th>Priorité</th><th></th></tr></thead><tbody>' + L.map(f => '<tr><td><strong>' + esc(f.nom) + '</strong></td><td>' + esc(f.pays || '') + '</td><td>' + esc(f.cat) + '</td><td>' + esc(f.zone) + '</td><td class="num">' + esc(f.vol || 1) + '</td><td><span class="heat" style="--hv:' + f.risque / 25 + '">' + f.risque + ' / 25</span></td><td><span class="pill ' + (f.prio >= 60 ? 'r' : f.prio >= 25 ? 'o' : 'g') + '">' + (f.prio >= 60 ? 'Audit sur site' : f.prio >= 25 ? 'Questionnaire et preuves' : 'Engagement contractuel') + '</span></td><td><button class="linkbtn" style="color:var(--danger)" data-at="delf" data-i="' + f.i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '<div class="callout b"><strong>Aucun fournisseur pour l\'instant</strong>Ajoutez vos principaux fournisseurs et sous-traitants, en commençant par les plus gros volumes d\'achat.</div>')
      + '<h3>Les cinq mesures du plan</h3><div class="mes">' + VIG_MES.map((m, i) => '<label class="pub' + (d.mes[i] ? ' ok' : '') + '"><input type="checkbox" data-at="mes" data-i="' + i + '"' + (d.mes[i] ? ' checked' : '') + '><span><strong>' + (i + 1) + '. ' + esc(m) + '</strong></span></label>').join('') + '</div><p><a class="btn ghost sm" href="#terrain--plan-vigilance">Guide complet du plan de vigilance →</a></p>';
  } else if (AT.tab === 'audit') {
    const R = retroplanning();
    h += '<div class="grid two"><div class="card"><h4>Rétroplanning du rapport de durabilité</h4><div class="row"><label for="atClo">Date de clôture de l\'exercice</label><input class="inp" type="date" id="atClo" data-at="cloture" value="' + esc(d.cloture) + '"></div>' + (R.length ? '<ol class="route rsmall">' + R.map(([dt, t]) => '<li class="' + (dt < ajd() ? 'ok' : '') + '"><span class="rnum">' + new Date(dt + 'T12:00:00').toLocaleDateString('fr-FR', {month: 'short'}) + '</span><div><h4>' + esc(t) + '</h4><p>' + new Date(dt + 'T12:00:00').toLocaleDateString('fr-FR', {day: 'numeric', month: 'long', year: 'numeric'}) + '</p></div></li>').join('') + '</ol><div class="ctool"><button class="btn ghost sm" data-at="rics">Ajouter à mon agenda</button></div><p class="note">Calendrier indicatif, à ajuster avec votre auditeur et votre direction financière.</p>' : '<p class="note">Indiquez la date de clôture pour calculer les jalons.</p>') + '</div>'
      + '<div class="card"><h4>Prêt pour l\'audit ?</h4><p class="note">L\'auditeur vérifie le processus autant que les chiffres (assurance limitée).</p><div class="mes">' + AUDIT_CHK.map((m, i) => '<label class="pub' + (d.chk[i] ? ' ok' : '') + '"><input type="checkbox" data-at="chk" data-i="' + i + '"' + (d.chk[i] ? ' checked' : '') + '><span>' + esc(m) + '</span></label>').join('') + '</div></div></div>';
  } else {
    h += '<div class="grid two">'
      + '<div class="card"><h4>CSDDD : le devoir de vigilance européen</h4><p>La directive s\'appliquera à partir de 2029 aux entreprises de plus de 5 000 salariés réalisant plus de 1,5 Md€ de chiffre d\'affaires. Elle généralise à l\'échelle européenne la logique de la loi française : identifier, prévenir et faire cesser les atteintes graves aux droits humains et à l\'environnement dans la chaîne d\'activités. Depuis l\'Omnibus, l\'obligation d\'adopter un plan de transition climatique en a été retirée.</p><p><strong>Se préparer dès maintenant :</strong> cartographie des risques à jour, procédures d\'évaluation des partenaires, mécanisme de plainte, clauses contractuelles.</p></div>'
      + '<div class="card"><h4>Quotas carbone et MACF</h4><p>Les sites industriels les plus émetteurs relèvent du système européen d\'échange de quotas (SEQE-UE). Le mécanisme d\'ajustement carbone aux frontières (MACF) fait payer le carbone de certains produits importés (ciment, fer et acier, aluminium, engrais, hydrogène, électricité). Les directions achats et finance doivent l\'intégrer dans le coût des approvisionnements.</p></div>'
      + '<div class="card"><h4>Financer la décarbonation industrielle</h4><p>Au-delà de 500 salariés, le Diag Décarbon\'Action n\'est plus accessible. Les grandes entreprises mobilisent surtout les appels à projets de l\'ADEME pour la décarbonation de l\'industrie, le Fonds chaleur pour la chaleur renouvelable et la récupération de chaleur, les certificats d\'économies d\'énergie et les programmes de France 2030.</p><a class="btn ghost sm" href="https://agirpourlatransition.ademe.fr/entreprises/aides-financieres" target="_blank" rel="noopener">Aides de l\'ADEME →</a></div>'
      + '<div class="card"><h4>Les jalons à suivre</h4><ul><li>ESRS révisés obligatoires pour les exercices ouverts à partir du 1er janvier 2027.</li><li>Transposition française de l\'Omnibus attendue au plus tard le 19 mars 2027.</li><li>Révision de SFDR en trilogue : nouvelles demandes des investisseurs à prévoir.</li><li>CSDDD applicable à partir de 2029.</li></ul><a class="btn ghost sm" href="#agenda">Voir mon agenda →</a></div></div>';
  }
  h += '<p class="foot">Outil d\'aide à la préparation : il ne remplace ni la méthode documentée de l\'entreprise ni l\'avis de l\'auditeur. Vos données restent sur cet appareil.</p>';
  el.innerHTML = h;
}
async function atXlsx(nom, feuilles){ const X = await chargerXLSX(), wb = X.utils.book_new(); feuilles.forEach(([t, rows]) => X.utils.book_append_sheet(wb, X.utils.json_to_sheet(rows.length ? rows : [{}]), t)); await saveBlob(new Blob([X.write(wb, {bookType: 'xlsx', type: 'array'})], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}), nom + '.xlsx'); toast('Fichier Excel exporté'); }
const atRoot = document.getElementById('atRoot');
atRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-at]'); if (!b || b.tagName === 'INPUT' || b.tagName === 'SELECT') return; const a = b.dataset.at, d = AT.d;
  try {
    if (a === 'cst') { d.coll[b.dataset.k] = ((d.coll[b.dataset.k] || 0) + 1) % 4; await atSave(); const y = window.scrollY; renderAtelier(); window.scrollTo(0, y); }
    else if (a === 'addent') modal('Ajouter un site ou une filiale', '<div class="row"><label for="atE">Nom</label><input class="inp" id="atE" placeholder="Ex. : Usine de Lyon, Filiale Espagne"></div>', 'Ajouter', async () => { const v = document.getElementById('atE').value.trim(); if (!v) return false; if (!d.entites.includes(v)) d.entites.push(v); await atSave(); renderAtelier(); });
    else if (a === 'delent') { d.entites.splice(+b.dataset.i, 1); await atSave(); renderAtelier(); }
    else if (a === 'addf') modal('Ajouter un fournisseur', '<div class="row"><label for="fN">Nom</label><input class="inp" id="fN"></div><div class="row"><label for="fP">Pays</label><input class="inp" id="fP"></div><div class="row"><label for="fC">Catégorie d\'achat</label><select class="inp" id="fC">' + VIG_CAT.map(([c]) => '<option>' + c + '</option>').join('') + '</select></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label for="fZ">Risque du pays</label><select class="inp" id="fZ">' + VIG_ZONE.map(([z]) => '<option>' + z + '</option>').join('') + '</select></div><div class="row"><label for="fV">Dépendance (1 à 5)</label><select class="inp" id="fV">' + [1, 2, 3, 4, 5].map(i => '<option>' + i + '</option>').join('') + '</select></div></div><p class="note">Pour le risque pays, appuyez-vous sur des sources reconnues (indices de corruption, de droits humains, rapports d\'ONG) et documentez votre choix.</p>', 'Ajouter', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('fN')) return false; d.fourn.push({id: uid(), nom: v('fN'), pays: v('fP'), cat: v('fC'), zone: v('fZ'), vol: v('fV')}); await atSave(); renderAtelier(); });
    else if (a === 'delf') { d.fourn.splice(+b.dataset.i, 1); await atSave(); renderAtelier(); }
    else if (a === 'dmaxlsx') await atXlsx('Double materialite', [['Matérialité', ESRS_T.map(([c, n]) => { const s = dmaScore(c), x = s.x; return {Norme: c, Enjeu: n, 'Gravité impact': x.g ?? '', 'Probabilité impact': x.p ?? '', 'Score impact': s.rempli ? s.imp : '', 'Ampleur financière': x.a ?? '', 'Probabilité financière': x.pf ?? '', 'Score financier': s.rempli ? s.fin : '', Matériel: dmaMat(c) ? 'Oui' : 'Non', Justification: x.j || ''}; })]]);
    else if (a === 'dmadoc') { const mats = ESRS_T.filter(([c]) => dmaMat(c)); downloadDoc('<h1>Analyse de double matérialité</h1><p style="text-align:center">Note de synthèse du ' + new Date().toLocaleDateString('fr-FR') + '</p><h2>Méthode</h2><p style="text-align:justify">Chaque norme thématique des ESRS a été cotée de 0 à 5 sous l\'angle de l\'impact (gravité et probabilité) et sous l\'angle financier (ampleur et probabilité). Le score de chaque angle est le produit des deux notes ramené sur 5. Seuils retenus : ' + AT.d.seuilI + ' pour l\'impact et ' + AT.d.seuilF + ' pour l\'enjeu financier.</p><h2>Enjeux matériels</h2><ul>' + mats.map(([c, n]) => { const s = dmaScore(c); return '<li><b>' + c + ' – ' + esc(n) + '</b> : impact ' + vf(s.imp) + ', financier ' + vf(s.fin) + (s.x.j ? '. ' + esc(s.x.j) : '') + '</li>'; }).join('') + '</ul><h2>Enjeux non matériels</h2><ul>' + ESRS_T.filter(([c]) => !dmaMat(c)).map(([c, n]) => { const s = dmaScore(c); return '<li>' + c + ' – ' + esc(n) + (s.rempli ? ' (impact ' + vf(s.imp) + ', financier ' + vf(s.fin) + ')' : ' (non coté)') + (s.x.j ? ' : ' + esc(s.x.j) : '') + '</li>'; }).join('') + '</ul>', 'Double materialite'); toast('Note téléchargée'); }
    else if (a === 'collxlsx') { const dps = (ESRS_T.filter(([c]) => dmaMat(c)).length ? ESRS_T.filter(([c]) => dmaMat(c)) : ESRS_T).flatMap(([c, n, col, L]) => L.map(x => [c, x])); const st = ['À demander', 'Demandé', 'Reçu', 'Validé']; await atXlsx('Suivi de la collecte', [['Collecte', dps.map(([c, x]) => { const o = {Norme: c, Donnée: x}; d.entites.forEach(en => { o[en] = st[d.coll[en + '|' + c + '|' + x] || 0]; }); return o; })]]); }
    else if (a === 'vigxlsx') await atXlsx('Cartographie des risques fournisseurs', [['Cartographie', d.fourn.map(f => { const c = (VIG_CAT.find(x => x[0] === f.cat) || [0, 1])[1], z = (VIG_ZONE.find(x => x[0] === f.zone) || [0, 1])[1]; return {Fournisseur: f.nom, Pays: f.pays, Catégorie: f.cat, 'Risque pays': f.zone, Dépendance: +f.vol, 'Score de risque (sur 25)': c * z, 'Score de priorité': c * z * (+f.vol || 1)}; })]]);
    else if (a === 'rics') icsFile(retroplanning().map(([dt, t]) => ({debut: dt, titre: 'CSRD : ' + t, lieu: '', resume: 'Rétroplanning du rapport de durabilité'})), 'Retroplanning CSRD');
  } catch(err) { toast('Opération impossible'); }
});
atRoot.addEventListener('change', async e => {
  const t = e.target, d = AT.d;
  if (t.dataset.dma) { d.dma[t.dataset.dma] = d.dma[t.dataset.dma] || {}; const v = t.value; d.dma[t.dataset.dma][t.dataset.k] = t.dataset.k === 'j' ? v : (v === '' ? null : +v); await atSave(); const y = window.scrollY; renderAtelier(); window.scrollTo(0, y); return; }
  const a = t.dataset.at; if (!a) return;
  if (a === 'seuilI' || a === 'seuilF') d[a] = Math.max(0, Math.min(5, +t.value || 0));
  else if (a === 'mes') d.mes[t.dataset.i] = t.checked;
  else if (a === 'chk') d.chk[t.dataset.i] = t.checked;
  else if (a === 'cloture') d.cloture = t.value;
  await atSave(); const y = window.scrollY; renderAtelier(); window.scrollTo(0, y);
});
window.addEventListener('hashchange', () => { if (route().base === 'atelier') renderAtelier(); });
(typeof espaceReady !== 'undefined' ? espaceReady : Promise.resolve()).then(atInit, atInit);


/* =====================================================================
   ESPACE PUBLIC ET ASSOCIATIF : ACHATS, BILAN CARBONE, PLAN CLIMAT, IMPACT
   ===================================================================== */
const PU_TYPES = [['commune', 'Commune'], ['epci', 'Intercommunalité (EPCI)'], ['dep', 'Département ou région'], ['etab', 'Établissement public (hôpital, université, office…)'], ['etat', 'Service de l\'État'], ['asso', 'Association ou structure de l\'ESS']];
const PU_CLAUSES = [
  ['Critère environnemental d\'attribution', 'Exemple : « Performance environnementale de l\'offre (20 %) : le candidat présente les mesures prises pour réduire l\'empreinte carbone de la prestation (mode de livraison, matériaux, fin de vie) et les justificatifs associés. »'],
  ['Clause d\'exécution environnementale', 'Exemple : « Le titulaire utilise des produits d\'entretien porteurs d\'un écolabel ou équivalent et transmet chaque année le bilan des quantités utilisées. »'],
  ['Clause sociale d\'insertion', 'Exemple : « Le titulaire réserve au moins 5 % des heures travaillées à des personnes éloignées de l\'emploi, avec l\'appui du facilitateur local des clauses sociales. »'],
  ['Marché réservé', 'Certains marchés peuvent être réservés aux structures employant des travailleurs handicapés ou défavorisés (entreprises adaptées, ESAT, structures d\'insertion).'],
  ['Coût du cycle de vie', 'Plutôt que le seul prix d\'achat, comparez les offres sur le coût global : achat, énergie, maintenance, fin de vie. C\'est souvent décisif pour les véhicules, le matériel et les bâtiments.']
];
const IMPACT_DIM = [['Bénéficiaires', 'Combien de personnes accompagnées, et lesquelles ?'], ['Changements', 'Qu\'est-ce qui change pour elles (emploi, santé, lien social, compétences) ?'], ['Preuves', 'Comment le mesurez-vous (questionnaires, entretiens, données) ?'], ['Coûts évités', 'Quelles dépenses publiques sont évitées ou réduites grâce à vous ?'], ['Partenaires', 'Avec qui coopérez-vous sur le territoire ?']];
const PU = {d: null, tab: 'oblig'};
async function puInit(){ try { const k = IDB.db && await IDB.get('kv', 'public'); PU.d = k || null; } catch(e) {} if (!PU.d) PU.d = {id: 'public', type: '', hab: '', agents: '', achats: '', imp: {}, ind: []}; renderPublic(); }
const puSave = () => IDB.put('kv', PU.d).catch(() => toast('Enregistrement impossible'));
function puOblig(){
  const d = PU.d, t = d.type, hab = +d.hab || 0, ag = +d.agents || 0, ach = +d.achats || 0, L = [];
  if (!t) return L;
  const coll = ['commune', 'epci', 'dep'].includes(t);
  if (t === 'dep' || (coll && hab > 50000)) L.push(['oui', 'Bilan des émissions de gaz à effet de serre (BEGES)', 'Obligatoire pour les collectivités de plus de 50 000 habitants, à mettre à jour tous les trois ans, avec un plan de transition. Il se publie sur la plateforme de l\'ADEME.']);
  else if (t === 'etab' && ag > 250) L.push(['oui', 'Bilan des émissions de gaz à effet de serre (BEGES)', 'Obligatoire pour les établissements publics de plus de 250 agents, tous les trois ans, avec un plan de transition.']);
  else if (t === 'etat') L.push(['oui', 'Bilan des émissions de gaz à effet de serre (BEGES)', 'Obligatoire pour les services de l\'État, tous les trois ans, avec un plan de transition.']);
  else if (t !== 'asso') L.push(['non', 'BEGES réglementaire', 'Sous les seuils, le bilan n\'est pas obligatoire, mais il reste la base de toute démarche climat et conditionne certains financements.']);
  if (t === 'epci' && hab > 20000) L.push(['oui', 'Plan climat-air-énergie territorial (PCAET)', 'Obligatoire pour les intercommunalités de plus de 20 000 habitants. Il fixe une stratégie et un programme d\'actions sur six ans, avec un bilan à mi-parcours.']);
  if (coll && hab > 50000) L.push(['oui', 'Rapport sur la situation en matière de développement durable', 'Les collectivités de plus de 50 000 habitants présentent ce rapport à l\'assemblée délibérante avant le débat sur le projet de budget.']);
  if (t !== 'asso') {
    L.push(['oui', 'Critère environnemental dans les marchés publics', 'Pour les consultations lancées à partir du 22 août 2026, l\'attribution doit reposer sur au moins un critère tenant compte des caractéristiques environnementales de l\'offre. Le critère unique du prix n\'est plus possible.']);
    if (ach > 50) L.push(['oui', 'Schéma de promotion des achats socialement et écologiquement responsables (SPASER)', 'Obligatoire au-delà de 50 millions d\'euros hors taxes d\'achats par an : il fixe des objectifs d\'achats responsables, publiés et suivis chaque année.']);
    else if (ach) L.push(['non', 'SPASER', 'Sous 50 millions d\'euros d\'achats annuels, le schéma n\'est pas obligatoire mais reste une bonne pratique.']);
    L.push(['peut', 'Décret tertiaire', 'Si vous possédez ou occupez des bâtiments tertiaires de 1 000 m² ou plus (écoles, mairies, bureaux, gymnases), vous devez réduire leur consommation d\'énergie et la déclarer chaque année sur OPERAT.']);
  } else {
    L.push(['peut', 'Comptes et transparence', 'Au-delà de certains montants de subventions publiques ou de dons, l\'association publie ses comptes et peut devoir désigner un commissaire aux comptes.']);
    L.push(['peut', 'Décret tertiaire', 'Concerné si l\'association possède ou occupe 1 000 m² ou plus de locaux tertiaires.']);
    L.push(['non', 'CSRD', 'Les associations n\'y sont en principe pas soumises, mais leurs partenaires et financeurs soumis à la CSRD leur demanderont de plus en plus de données.']);
  }
  return L;
}
function renderPublic(){
  const el = document.getElementById('puRoot'); if (!el || !PU.d) return;
  const sub = route().base === 'public' ? route().sub : null; if (sub && ['oblig', 'achats', 'climat', 'impact'].includes(sub)) PU.tab = sub;
  const d = PU.d;
  let h = '<div class="eyebrow">AGIR · COLLECTIVITÉS, ÉTABLISSEMENTS PUBLICS ET ASSOCIATIONS</div><h2>Espace public et associatif</h2><p class="lead">La RSE ne concerne pas que les entreprises. Les acteurs publics ont leurs propres obligations : bilan carbone, plan climat, achats responsables, rapport de développement durable. Les associations, elles, doivent prouver leur impact social. Cet espace réunit leurs outils.</p>';
  h += '<div class="ptabs">' + [['oblig', 'Mes obligations', 'Selon ma structure', ICO.flag], ['achats', 'Achats responsables', 'Clauses et critères', ICO.doc], ['climat', 'Bilan carbone et plan climat', 'BEGES, PCAET', ICO.chart], ['impact', 'Impact social', 'Mesurer et prouver', ICO.radar]].map(([k, t, s, ic]) => '<a class="ptab' + (PU.tab === k ? ' on' : '') + '" href="#public--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (PU.tab === 'oblig') {
    const L = puOblig();
    h += '<div class="card"><h4>Votre structure</h4><div class="grid two" style="gap:0 14px"><div class="row"><label for="puT">Type</label><select class="inp" id="puT" data-pu="type"><option value="">Choisir…</option>' + PU_TYPES.map(([k, n]) => '<option value="' + k + '"' + (d.type === k ? ' selected' : '') + '>' + n + '</option>').join('') + '</select></div>'
      + (['commune', 'epci', 'dep'].includes(d.type) ? '<div class="row"><label for="puH">Nombre d\'habitants</label><input class="inp" type="number" min="0" id="puH" data-pu="hab" value="' + esc(d.hab) + '"></div>' : '')
      + (d.type === 'etab' ? '<div class="row"><label for="puA">Nombre d\'agents</label><input class="inp" type="number" min="0" id="puA" data-pu="agents" value="' + esc(d.agents) + '"></div>' : '')
      + (d.type && d.type !== 'asso' ? '<div class="row"><label for="puM">Achats annuels (millions d\'euros hors taxes)</label><input class="inp" type="number" min="0" step="0.1" id="puM" data-pu="achats" value="' + esc(d.achats) + '"></div>' : '') + '</div></div>';
    h += L.length ? '<div class="obl">' + L.map(([s, t, x]) => '<div class="oblc ' + s + '"><span class="pill ' + (s === 'oui' ? 'r' : s === 'peut' ? 'o' : 'g') + '">' + (s === 'oui' ? 'Obligatoire' : s === 'peut' ? 'À vérifier' : 'Non obligatoire') + '</span><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></div>').join('') + '</div><p class="note">Seuils vérifiés en novembre 2026 sur les textes en vigueur. Pour un cas particulier, consultez votre service juridique ou la préfecture.</p>' : '<div class="callout b"><strong>Choisissez votre type de structure</strong>L\'application affiche alors les obligations qui vous concernent.</div>';
  } else if (PU.tab === 'achats') {
    h += '<div class="grid two"><div class="card"><h4>Ce qui change en 2026</h4><p>La loi Climat et résilience généralise la commande publique responsable. Depuis le 22 août 2026, toute nouvelle consultation doit comporter au moins un critère environnemental d\'attribution, et les marchés au-delà des seuils européens doivent intégrer des considérations sociales dans leurs conditions d\'exécution, sauf exceptions justifiées.</p></div><div class="card"><h4>Méthode en quatre étapes</h4><ol><li>Identifier les familles d\'achats à fort impact (bâtiment, énergie, restauration, véhicules, numérique).</li><li>Sourcer les entreprises capables d\'y répondre, dont les structures de l\'économie sociale et solidaire.</li><li>Rédiger des critères mesurables et des preuves attendues.</li><li>Suivre l\'exécution : un critère non contrôlé n\'a pas d\'effet.</li></ol></div></div>'
      + '<h3>Clauses et critères types</h3><div class="mes">' + PU_CLAUSES.map(([t, x], i) => '<div class="card"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p><button class="btn ghost sm" data-pu="copie" data-i="' + i + '">Copier</button></div>').join('') + '</div>'
      + '<p><a class="btn ghost sm" href="https://www.ecologie.gouv.fr/politiques-publiques/achats-publics-durables" target="_blank" rel="noopener">Achats publics durables (ministère) →</a> <a class="btn ghost sm" href="https://rapidd.developpement-durable.gouv.fr/" target="_blank" rel="noopener">Plateforme RAPIDD →</a></p>';
  } else if (PU.tab === 'climat') {
    h += '<div class="grid two"><div class="card"><h4>Le BEGES des acteurs publics</h4><p>Il couvre les émissions directes et indirectes liées au patrimoine et aux compétences : bâtiments, éclairage public, flotte de véhicules, restauration collective, déplacements des agents, achats. Depuis 2023, le scope 3 est obligatoire. Il est accompagné d\'un plan de transition qui fixe les actions et les moyens pour réduire les émissions.</p><a class="btn ghost sm" href="https://bilans-ges.ademe.fr/" target="_blank" rel="noopener">Plateforme de publication de l\'ADEME →</a></div>'
      + '<div class="card"><h4>Le PCAET</h4><p>Il porte sur tout le territoire, pas seulement sur l\'administration : diagnostic des émissions et des consommations, qualité de l\'air, vulnérabilité au changement climatique, potentiel d\'énergies renouvelables. La stratégie et le programme d\'actions durent six ans, avec un bilan à mi-parcours et une concertation des habitants.</p><a class="btn ghost sm" href="https://territoireengagetransitionecologique.ademe.fr/" target="_blank" rel="noopener">Programme Territoire engagé →</a></div>'
      + '<div class="card"><h4>Les postes qui pèsent le plus</h4><ul><li>Chauffage des bâtiments et éclairage public</li><li>Achats de biens et de travaux (souvent le premier poste)</li><li>Restauration scolaire et collective</li><li>Déplacements des agents et des usagers</li></ul><a class="btn ghost sm" href="#terrain--bilan-carbone">Calculer un premier bilan →</a></div>'
      + '<div class="card"><h4>Financer la transition</h4><p>Fonds vert pour les collectivités, Fonds chaleur, certificats d\'économies d\'énergie, programme ACTEE pour la rénovation des bâtiments publics, prêts de la Banque des Territoires : vérifiez les appels en cours auprès de votre préfecture et de la direction régionale de l\'ADEME.</p></div></div>';
  } else {
    h += '<p class="prose">Mesurer l\'impact social sert à convaincre les financeurs, à piloter les projets et à rendre des comptes aux bénévoles et aux bénéficiaires. Répondez aux cinq questions ci-dessous, ajoutez vos indicateurs, puis téléchargez votre note d\'impact en Word.</p><div class="mes">' + IMPACT_DIM.map(([t, q], i) => '<div class="card"><h4>' + (i + 1) + '. ' + esc(t) + '</h4><p class="note">' + esc(q) + '</p><textarea class="inp" rows="3" data-pu="imp" data-i="' + i + '">' + esc(d.imp[i] || '') + '</textarea></div>').join('') + '</div>'
      + '<h3>Indicateurs suivis</h3>' + (d.ind.length ? '<div class="tablewrap"><table><thead><tr><th>Indicateur</th><th>Année précédente</th><th>Cette année</th><th>Évolution</th><th></th></tr></thead><tbody>' + d.ind.map((x, i) => { const a = +x.a, b = +x.b, ev = a ? Math.round((b - a) / a * 1000) / 10 : null; return '<tr><td>' + esc(x.n) + '</td><td class="num">' + esc(x.a) + '</td><td class="num">' + esc(x.b) + '</td><td class="num">' + (ev == null ? '–' : (ev > 0 ? '+' : '') + String(ev).replace('.', ',') + ' %') + '</td><td><button class="linkbtn" style="color:var(--danger)" data-pu="delind" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="note">Exemples : personnes accompagnées, taux de retour à l\'emploi, heures de bénévolat, satisfaction des bénéficiaires.</p>')
      + '<div class="ctool"><button class="btn ghost" data-pu="addind">+ Ajouter un indicateur</button><button class="btn" data-pu="note">Télécharger la note d\'impact (Word)</button></div><p><a class="btn ghost sm" href="https://www.avise.org/evaluation-impact-social" target="_blank" rel="noopener">Ressources de l\'Avise sur l\'impact social →</a></p>';
  }
  h += '<p class="foot">Informations générales, vérifiées sur les textes en vigueur. Vos réponses restent sur cet appareil.</p>';
  el.innerHTML = h;
}
const puRoot = document.getElementById('puRoot');
puRoot.addEventListener('change', async e => {
  const t = e.target, a = t.dataset.pu; if (!a) return; const d = PU.d;
  if (a === 'imp') { d.imp[t.dataset.i] = t.value; await puSave(); return; }
  d[a] = t.value; await puSave(); const y = window.scrollY; renderPublic(); window.scrollTo(0, y);
});
puRoot.addEventListener('click', async e => {
  const b = e.target.closest('button[data-pu]'); if (!b) return; const a = b.dataset.pu, d = PU.d;
  if (a === 'copie') { try { await navigator.clipboard.writeText(PU_CLAUSES[+b.dataset.i][1].replace(/^Exemple : /, '')); toast('Clause copiée'); } catch(err) { toast('Copie impossible : sélectionnez le texte'); } }
  else if (a === 'addind') modal('Ajouter un indicateur', '<div class="row"><label for="iN">Indicateur</label><input class="inp" id="iN" placeholder="Ex. : personnes accompagnées"></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label for="iA">Année précédente</label><input class="inp" type="number" id="iA"></div><div class="row"><label for="iB">Cette année</label><input class="inp" type="number" id="iB"></div></div>', 'Ajouter', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('iN')) return false; d.ind.push({n: v('iN'), a: v('iA'), b: v('iB')}); await puSave(); renderPublic(); });
  else if (a === 'delind') { d.ind.splice(+b.dataset.i, 1); await puSave(); renderPublic(); }
  else if (a === 'note') { downloadDoc('<h1>Note d\'impact social</h1><p style="text-align:center">' + new Date().toLocaleDateString('fr-FR', {month: 'long', year: 'numeric'}) + '</p>' + IMPACT_DIM.map(([t], i) => '<h2>' + t + '</h2><p>' + esc(d.imp[i] || 'À compléter.').replace(/\n/g, '<br>') + '</p>').join('') + (d.ind.length ? '<h2>Indicateurs</h2><table border="1" cellpadding="4" style="border-collapse:collapse;width:100%"><tr><th>Indicateur</th><th>Année précédente</th><th>Cette année</th></tr>' + d.ind.map(x => '<tr><td>' + esc(x.n) + '</td><td>' + esc(x.a) + '</td><td>' + esc(x.b) + '</td></tr>').join('') + '</table>' : ''), 'Note impact social'); toast('Note téléchargée'); }
});
window.addEventListener('hashchange', () => { if (route().base === 'public') renderPublic(); });
espaceReady.then(puInit, puInit);


/* =====================================================================
   RECHERCHE LOCALE PARTAGÉE (ville → codes postaux → registre officiel)
   ===================================================================== */
const GEO_API = 'https://geo.api.gouv.fr/communes';
async function villeCodes(nom){
  const v = String(nom || '').trim(); if (!v) throw new Error('Indiquez une ville.');
  if (/^\d{5}$/.test(v)) return {nom: v, cps: [v], dep: v.slice(0, 2)};
  const u = new URL(GEO_API); u.searchParams.set('nom', v); u.searchParams.set('fields', 'nom,code,codesPostaux,codeDepartement'); u.searchParams.set('boost', 'population'); u.searchParams.set('limit', '1');
  const r = await fetch(u); if (!r.ok) throw new Error('Le service des communes ne répond pas.');
  const c = (await r.json())[0]; if (!c) throw new Error('Ville introuvable : vérifiez l\'orthographe ou indiquez un code postal.');
  return {nom: c.nom, cps: arr(c.codesPostaux), dep: c.codeDepartement};
}
async function chercherLocal({q, cps, asso, naf}){
  const u = new URL(API_ENT);
  if (q) u.searchParams.set('q', q);
  u.searchParams.set('code_postal', cps.slice(0, 30).join(','));
  if (asso) u.searchParams.set('est_association', 'true');
  if (naf) u.searchParams.set('activite_principale', naf);
  u.searchParams.set('etat_administratif', 'A'); u.searchParams.set('per_page', '25');
  const r = await fetch(u);
  if (r.status === 429) throw new Error('Trop de recherches en peu de temps : patientez quelques secondes.');
  if (!r.ok) throw new Error('Le registre officiel ne répond pas (code ' + r.status + '). Réessayez dans un instant.');
  const d = await r.json();
  return {total: d.total_results || 0, L: arr(d.results).map(x => { const s = x.siege || {}, c = x.complements || {}; return {siren: x.siren, nom: x.nom_complet || x.nom_raison_sociale || 'Structure', naf: x.activite_principale || '', ville: s.libelle_commune || '', cp: s.code_postal || '', adresse: s.adresse || '', creation: x.date_creation || '', rna: c.identifiant_association || '', ess: !!c.est_ess, mission: !!c.est_societe_mission}; })};
}
const errLocal = e => IN_PREVIEW ? 'Dans l\'aperçu Claude, les connexions vers d\'autres sites sont bloquées par sécurité. La recherche par ville dans le registre officiel fonctionnera dès que l\'application sera en ligne. En attendant, les plateformes et réseaux ci-dessous restent accessibles.' : (e && e.message && !/fetch/i.test(e.message) ? e.message : 'Connexion impossible au registre officiel. Vérifiez votre connexion Internet.');
const gq = s => 'https://www.google.com/search?q=' + encodeURIComponent(s);
function carteLocale(x, extra){
  const an = x.creation ? new Date(x.creation).getFullYear() : '';
  return '<div class="card lcard"><div class="meta">' + (x.rna ? '<span class="pill">Association</span>' : '') + (x.ess ? '<span class="pill b">ESS</span>' : '') + (x.mission ? '<span class="pill o">Société à mission</span>' : '') + (an ? '<span class="pill g">Depuis ' + an + '</span>' : '') + '</div><h4>' + esc(x.nom) + '</h4><p class="note">' + esc(x.adresse || (x.cp + ' ' + x.ville)) + '</p>' + (extra || '') + '<div class="lact"><a class="btn sm" href="' + gq(x.nom + ' ' + x.ville) + '" target="_blank" rel="noopener">Site et contact</a><a class="btn ghost sm" href="https://annuaire-entreprises.data.gouv.fr/entreprise/' + esc(x.siren) + '" target="_blank" rel="noopener">Fiche officielle</a></div></div>';
}

/* =====================================================================
   S'ENGAGER : ASSOCIATIONS, ONG ET BÉNÉVOLAT POUR LA TRANSITION
   ===================================================================== */
const ENG_THEMES = [['environnement', 'Environnement'], ['climat', 'Climat'], ['nature', 'Nature et biodiversité'], ['ecologie', 'Écologie'], ['developpement durable', 'Développement durable'], ['dechets', 'Zéro déchet'], ['energie', 'Énergie'], ['transition', 'Transition'], ['solidaire', 'Économie solidaire'], ['jardin', 'Jardins partagés']];
const ENG_RESEAUX = [
  ['Agir pour la nature et le climat', [
    ['France Nature Environnement', 'La fédération des associations de protection de la nature, présente dans chaque région et département.', 'https://fne.asso.fr'],
    ['LPO', 'Protection des oiseaux et de la biodiversité ; groupes locaux et comptages ouverts à tous.', 'https://www.lpo.fr'],
    ['WWF France', 'Protection des espèces et des écosystèmes ; communauté de bénévoles en région.', 'https://www.wwf.fr'],
    ['Greenpeace France', 'Campagnes environnementales ; groupes locaux de bénévoles dans les grandes villes.', 'https://www.greenpeace.fr'],
    ['Les Amis de la Terre France', 'Justice climatique et sociale, groupes locaux.', 'https://www.amisdelaterre.org'],
    ['Zero Waste France', 'Réduction des déchets ; groupes locaux et défis familles.', 'https://www.zerowastefrance.org'],
    ['Surfrider Foundation Europe', 'Protection de l\'océan et des rivières, ramassages et sensibilisation.', 'https://surfrider.eu'],
    ['Alternatiba', 'Mobilisation citoyenne pour le climat, groupes dans de nombreuses villes.', 'https://alternatiba.eu'],
    ['Colibris', 'Groupes locaux d\'initiatives citoyennes pour la transition.', 'https://www.colibris-lemouvement.org'],
    ['Réseau Action Climat', 'Fédération d\'associations qui travaillent sur les politiques climatiques.', 'https://reseauactionclimat.org'],
    ['Fondation pour la Nature et l\'Homme', 'Propositions et actions pour la transition écologique.', 'https://www.fnh.org']]],
  ['Sensibiliser et former', [
    ['La Fresque du Climat', 'Devenez animateur bénévole de l\'atelier de sensibilisation au climat.', 'https://fresqueduclimat.org'],
    ['The Shifters', 'Les bénévoles qui soutiennent The Shift Project pour décarboner l\'économie.', 'https://www.theshifters.org'],
    ['makesense', 'Programmes et événements pour s\'engager dans des projets à impact.', 'https://www.makesense.org'],
    ['REFEDD', 'Réseau étudiant pour une société écologique et solidaire.', 'https://refedd.org'],
    ['Pour un réveil écologique', 'Étudiants et jeunes diplômés qui interpellent les employeurs.', gq('Pour un réveil écologique')]]],
  ['Réseaux des professionnels de la RSE', [
    ['ORSE', 'Observatoire de la RSE : publications et groupes de travail des entreprises.', 'https://www.orse.org'],
    ['Comité 21', 'Réseau d\'acteurs du développement durable (entreprises, collectivités, associations).', 'https://www.comite21.org'],
    ['Global Compact France', 'Réseau français du Pacte mondial des Nations unies.', 'https://www.globalcompact-france.org'],
    ['Mouvement Impact France', 'Entreprises engagées pour une économie sociale et écologique.', 'https://impactfrance.eu'],
    ['B Lab France', 'Communauté des entreprises certifiées B Corp.', 'https://bcorporation.fr'],
    ['C3D', 'Collège des directeurs du développement durable.', gq('Collège des directeurs du développement durable C3D')]]]
];
const ENG_PLATEF = [
  ['JeVeuxAider.gouv.fr', 'La plateforme publique du bénévolat : missions près de chez vous ou à distance, ouvertes dès 16 ans.', v => 'https://www.jeveuxaider.gouv.fr/domaines-action/protection-de-la-nature', v => v ? 'https://www.jeveuxaider.gouv.fr/villes/' + slug(v) : ''],
  ['France Bénévolat', 'Missions et 250 centres d\'orientation partout en France.', () => 'https://www.francebenevolat.org'],
  ['Tous Bénévoles', 'Moteur de recherche de missions avec un quiz pour trouver son type d\'engagement.', () => 'https://www.tousbenevoles.org'],
  ['Service civique', 'Missions indemnisées de 6 à 12 mois pour les 16-25 ans (30 ans en situation de handicap), dont beaucoup en environnement.', () => 'https://www.service-civique.gouv.fr'],
  ['Corps européen de solidarité', 'Volontariat en Europe pour les 18-30 ans, souvent sur des projets environnementaux.', () => 'https://youth.europa.eu/solidarity_fr'],
  ['Pro Bono Lab', 'Bénévolat de compétences : mettre son savoir-faire professionnel au service d\'une association.', () => 'https://www.probonolab.org'],
  ['HelloAsso', 'Trouver les associations et leurs événements près de chez soi, adhérer en ligne.', () => 'https://www.helloasso.com'],
  ['Diffuz', 'Défis solidaires ponctuels près de chez vous.', () => 'https://www.diffuz.com']
];
const slug = s => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const EG = {ville: LS.get('eng-ville') || '', theme: 'environnement', busy: false, err: '', res: null, total: 0, villeNom: '', tab: 'pres'};
async function engChercher(){
  EG.busy = true; EG.err = ''; renderEngager();
  try { const v = await villeCodes(EG.ville); EG.villeNom = v.nom; const r = await chercherLocal({q: EG.theme, cps: v.cps, asso: true}); EG.res = r.L; EG.total = r.total; }
  catch(e) { EG.err = errLocal(e); EG.res = null; }
  EG.busy = false; renderEngager();
}
function renderEngager(){
  const el = document.getElementById('engRoot'); if (!el) return;
  const sub = route().base === 'engager' ? route().sub : null; if (sub && ['pres', 'reseaux', 'plateformes', 'guide'].includes(sub)) EG.tab = sub;
  const v = EG.villeNom || EG.ville;
  let h = '<div class="eyebrow">CARRIÈRE · S\'ENGAGER</div><h2>Associations, ONG et bénévolat</h2><p class="lead">Rejoindre une association de l\'environnement, du climat ou de la RSE, comme bénévole, adhérent ou volontaire : c\'est une expérience reconnue par les recruteurs, un réseau et une façon d\'agir dès maintenant. Indiquez votre ville, partout en France, pour trouver les structures autour de vous.</p>';
  h += '<div class="ptabs">' + [['pres', 'Près de chez moi', 'Recherche par ville', ICO.flag], ['reseaux', 'Grands réseaux', '22 associations et réseaux', ICO.book], ['plateformes', 'Plateformes de bénévolat', 'Missions et volontariat', ICO.bag], ['guide', 'Bien s\'engager', 'Et le valoriser', ICO.doc]].map(([k, t, s, ic]) => '<a class="ptab' + (EG.tab === k ? ' on' : '') + '" href="#engager--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (EG.tab === 'pres') {
    h += '<div class="card"><div class="locform"><label>Ville ou code postal<input class="inp" id="egV" value="' + esc(EG.ville) + '" placeholder="Ex. : Lyon, Lille, 13001"></label><button class="btn" data-eg="go">' + (EG.busy ? 'Recherche…' : 'Rechercher') + '</button></div><div class="chips">' + ENG_THEMES.map(([k, l]) => '<button class="chip' + (EG.theme === k ? ' on' : '') + '" data-eg="th" data-k="' + k + '">' + l + '</button>').join('') + '</div><p class="note">Les associations sont recherchées dans le registre officiel de l\'État, d\'après les mots de leur nom. Les associations sans numéro SIREN n\'y figurent pas : complétez avec les plateformes et la maison des associations de votre ville.</p></div>';
    if (EG.err) h += '<div class="callout o"><strong>Recherche indisponible</strong>' + esc(EG.err) + '</div>';
    if (EG.res) h += '<h3>' + EG.total + ' structure' + (EG.total > 1 ? 's' : '') + ' « ' + esc((ENG_THEMES.find(t => t[0] === EG.theme) || [0, EG.theme])[1]) + ' » à ' + esc(EG.villeNom) + '</h3>' + (EG.res.length ? '<div class="lgrid">' + EG.res.map(x => carteLocale(x)).join('') + '</div>' + (EG.total > EG.res.length ? '<p class="note">Seules les 25 premières sont affichées : essayez un autre thème pour en voir d\'autres.</p>' : '') : '<p class="note">Aucune association trouvée avec ce mot à cet endroit : essayez un autre thème ou une ville voisine.</p>');
    if (v) h += '<h3>Ailleurs que dans le registre</h3><div class="lgrid">'
      + '<div class="card lcard"><h4>Missions de bénévolat à ' + esc(v) + '</h4><p>Les missions publiées par les associations et les collectivités sur la plateforme publique.</p><div class="lact"><a class="btn sm" href="https://www.jeveuxaider.gouv.fr/villes/' + slug(v) + '" target="_blank" rel="noopener">JeVeuxAider</a><a class="btn ghost sm" href="' + gq('bénévolat environnement ' + v) + '" target="_blank" rel="noopener">Recherche web</a></div></div>'
      + '<div class="card lcard"><h4>Maison des associations</h4><p>Elle connaît toutes les associations locales et organise le forum des associations, souvent en septembre.</p><div class="lact"><a class="btn sm" href="' + gq('maison des associations ' + v) + '" target="_blank" rel="noopener">La trouver</a></div></div>'
      + '<div class="card lcard"><h4>Groupes locaux des grands réseaux</h4><p>FNE, LPO, Greenpeace, Alternatiba, Zero Waste, Fresque du Climat : la plupart ont un groupe dans votre département.</p><div class="lact"><a class="btn sm" href="' + gq('groupe local association climat ' + v) + '" target="_blank" rel="noopener">Chercher</a><a class="btn ghost sm" href="#engager--reseaux">Voir les réseaux</a></div></div>'
      + '<div class="card lcard"><h4>Événements près de chez vous</h4><p>Ramassages, ateliers, conférences, fresques : idéal pour un premier contact.</p><div class="lact"><a class="btn sm" href="https://www.helloasso.com/e/recherche?query=' + encodeURIComponent('environnement ' + v) + '" target="_blank" rel="noopener">HelloAsso</a><a class="btn ghost sm" href="' + gq('événement climat écologie ' + v + ' ce mois-ci') + '" target="_blank" rel="noopener">Recherche web</a></div></div></div>';
  } else if (EG.tab === 'reseaux') {
    h += ENG_RESEAUX.map(([t, L]) => '<h3>' + t + '</h3><div class="lgrid">' + L.map(([n, d, u]) => '<div class="card lcard"><h4>' + esc(n) + '</h4><p>' + esc(d) + '</p><div class="lact"><a class="btn sm" href="' + u + '" target="_blank" rel="noopener">Site officiel</a>' + (v ? '<a class="btn ghost sm" href="' + gq(n + ' groupe local ' + v) + '" target="_blank" rel="noopener">À ' + esc(v) + '</a>' : '') + '</div></div>').join('') + '</div>').join('');
  } else if (EG.tab === 'plateformes') {
    h += '<div class="lgrid">' + ENG_PLATEF.map(([n, d, u, uv]) => { const lv = uv && v ? uv(v) : ''; return '<div class="card lcard"><h4>' + esc(n) + '</h4><p>' + esc(d) + '</p><div class="lact"><a class="btn sm" href="' + u(v) + '" target="_blank" rel="noopener">Ouvrir</a>' + (lv ? '<a class="btn ghost sm" href="' + lv + '" target="_blank" rel="noopener">À ' + esc(v) + '</a>' : '') + '</div></div>'; }).join('') + '</div>';
  } else {
    h += '<div class="grid two"><div class="card"><h4>Choisir son engagement</h4><ul><li><strong>Bénévole ponctuel :</strong> un ramassage, un stand, une fresque. Idéal pour découvrir.</li><li><strong>Bénévole régulier :</strong> quelques heures par semaine ou par mois sur une mission suivie.</li><li><strong>Bénévolat de compétences :</strong> votre savoir-faire (communication, bilan carbone, juridique, gestion de projet) au service d\'une association.</li><li><strong>Adhérent :</strong> une cotisation qui soutient l\'association et donne une voix en assemblée générale.</li><li><strong>Volontaire :</strong> service civique ou corps européen de solidarité, à temps plein et indemnisé.</li><li><strong>Administrateur :</strong> rejoindre le conseil d\'administration d\'une association, une vraie expérience de gouvernance.</li></ul></div>'
      + '<div class="card"><h4>Le valoriser dans sa carrière</h4><ul><li>Ajoutez une rubrique « Engagements » à votre CV, avec vos missions et leurs résultats chiffrés.</li><li>Parlez-en en entretien : c\'est une preuve concrète de votre motivation pour la RSE.</li><li>Le compte d\'engagement citoyen peut convertir certaines activités bénévoles en droits à la formation : renseignez-vous sur moncompteformation.gouv.fr.</li><li>Les réseaux associatifs sont aussi des lieux de recrutement : beaucoup de postes RSE se trouvent par le bouche-à-oreille.</li></ul><a class="btn ghost sm" href="#cv">Mettre à jour mon CV →</a></div>'
      + '<div class="card"><h4>Pour les entreprises</h4><p>Le mécénat de compétences permet à des salariés de s\'engager sur leur temps de travail auprès d\'une association. C\'est un levier RSE apprécié des équipes et valorisable dans le reporting social.</p></div>'
      + '<div class="card"><h4>Créer son association</h4><p>Aucune association ne couvre votre sujet ? Une association loi 1901 se crée avec au moins deux personnes, des statuts et une déclaration en ligne à la préfecture.</p><a class="btn ghost sm" href="https://www.service-public.fr/particuliers/vosdroits/F1119" target="_blank" rel="noopener">Créer une association (Service-public) →</a></div></div>';
  }
  el.innerHTML = h;
}
const engRoot = document.getElementById('engRoot');
engRoot.addEventListener('click', e => {
  const b = e.target.closest('[data-eg]'); if (!b) return;
  const vi = document.getElementById('egV'); if (vi) { EG.ville = vi.value.trim(); LS.set('eng-ville', EG.ville); }
  if (b.dataset.eg === 'th') { EG.theme = b.dataset.k; if (EG.ville) engChercher(); else renderEngager(); }
  else if (b.dataset.eg === 'go') { if (!EG.ville) { toast('Indiquez une ville'); return; } engChercher(); }
});
engRoot.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'egV') { EG.ville = e.target.value.trim(); LS.set('eng-ville', EG.ville); if (EG.ville) engChercher(); } });
window.addEventListener('hashchange', () => { if (route().base === 'engager') renderEngager(); });
renderEngager();

/* =====================================================================
   CABINETS ET PRESTATAIRES RSE
   ===================================================================== */
const PR_SPEC = [
  ['carbone', 'Bilan carbone et climat', 'carbone', 'Mesurer les émissions de gaz à effet de serre (scopes 1, 2 et 3), fixer une trajectoire et un plan de réduction.', ['Cadrage : périmètre organisationnel et opérationnel, année de référence, méthode (Bilan Carbone®, GHG Protocol, BEGES réglementaire).', 'Collecte des données d\'activité avec les services (énergie, achats, transport, déplacements, déchets, immobilisations).', 'Calcul avec les facteurs d\'émission de la Base Empreinte de l\'ADEME, analyse des incertitudes.', 'Restitution : principaux postes, comparaison sectorielle, leviers de réduction chiffrés.', 'Plan de transition : objectifs, actions, responsables, budget, indicateurs de suivi.'], 'Rapport de bilan, fichier de calcul, plan de transition, support de restitution.', 'Bilan Carbone® (formation de l\'ABC), GHG Protocol, ISO 14064-1, méthode ACT.'],
  ['csrd', 'CSRD, ESRS et reporting', 'durable', 'Préparer le rapport de durabilité ou un reporting volontaire (VSME pour les PME).', ['Analyse d\'écart entre les pratiques et les exigences des ESRS ou de la VSME.', 'Analyse de double matérialité avec les parties prenantes.', 'Liste des points de données, définitions, responsables et outils de collecte.', 'Rédaction du rapport et des politiques associées.', 'Préparation de l\'audit : piste d\'audit, contrôles internes, échanges avec l\'auditeur.'], 'Matrice de matérialité, référentiel d\'indicateurs, rapport de durabilité, dossier d\'audit.', 'ESRS, VSME, GRI, taxonomie verte.'],
  ['strategie', 'Stratégie et démarche RSE', 'RSE', 'Construire ou structurer la démarche RSE d\'une organisation.', ['Diagnostic de maturité selon l\'ISO 26000.', 'Cartographie et consultation des parties prenantes.', 'Définition des enjeux prioritaires, de la politique et des engagements.', 'Feuille de route, gouvernance (comité RSE, référents) et indicateurs.', 'Accompagnement du déploiement et revue annuelle.'], 'Diagnostic, politique RSE, feuille de route, tableau de bord.', 'ISO 26000, ODD, label Engagé RSE, B Corp.'],
  ['achats', 'Achats responsables et vigilance', 'achats', 'Intégrer la RSE dans les achats et maîtriser les risques de la chaîne de valeur.', ['Cartographie des risques par famille d\'achats et par pays.', 'Charte fournisseurs et clauses contractuelles.', 'Évaluation des fournisseurs (questionnaires, plateformes, audits).', 'Plans de progrès avec les fournisseurs à risque.', 'Plan de vigilance et mécanisme d\'alerte pour les entreprises concernées.'], 'Cartographie des risques, charte, grille d\'évaluation, plan de vigilance.', 'ISO 20400, loi sur le devoir de vigilance, CSDDD.'],
  ['labels', 'Labels, certifications et notations', 'certification', 'Préparer un label, une certification ou une notation extra-financière.', ['Choix du label adapté à la taille et au secteur.', 'Autoévaluation et analyse des écarts.', 'Constitution des preuves et des procédures.', 'Préparation de l\'évaluation ou de l\'audit.', 'Plan d\'amélioration après l\'évaluation.'], 'Dossier de preuves, plan d\'amélioration, préparation de l\'audit.', 'Engagé RSE, LUCIE 26000, B Corp, EcoVadis, ISO 14001, ISO 45001, ISO 50001.'],
  ['formation', 'Formation et sensibilisation', 'formation', 'Embarquer la direction et les équipes.', ['Analyse des besoins par public (direction, managers, métiers).', 'Ateliers de sensibilisation (fresques, conférences).', 'Formations métiers (achats, marketing, finance, production).', 'Création d\'un réseau d\'ambassadeurs.', 'Mesure de l\'impact des formations.'], 'Programme de formation, supports, évaluation.', 'Certification Qualiopi pour les formations finançables.'],
  ['energie', 'Énergie et bâtiment', 'energie', 'Réduire les consommations et respecter les obligations énergétiques.', ['Audit énergétique des sites.', 'Plan d\'économies et d\'investissements chiffrés.', 'Accompagnement du décret tertiaire (OPERAT).', 'Recherche de financements (certificats d\'économies d\'énergie, aides).', 'Suivi des consommations.'], 'Audit énergétique, plan d\'actions chiffré, déclarations.', 'ISO 50001, audit énergétique réglementaire.'],
  ['circulaire', 'Économie circulaire et éco-conception', 'circulaire', 'Réduire les déchets et l\'impact des produits.', ['Diagnostic des flux de matières et de déchets.', 'Analyse de cycle de vie des produits.', 'Éco-conception et réemploi.', 'Filières de valorisation et responsabilité élargie du producteur.', 'Indicateurs et communication environnementale.'], 'Diagnostic des flux, analyse de cycle de vie, plan d\'éco-conception.', 'ISO 14040 et 14044, ISO 14006, loi AGEC.']
];
const PR_ANNU = [
  ['Annuaire des prestataires de l\'ABC', 'Les cabinets formés à la méthode Bilan Carbone®, filtrables par région, secteur et habilitation.', 'https://abc-transitionbascarbone.fr/les-acteurs/annuaire-des-prestataires/'],
  ['Mission Transition Écologique', 'Le service public qui oriente les entreprises vers les aides et les accompagnements de la transition.', 'https://mission-transition-ecologique.beta.gouv.fr'],
  ['Bpifrance : Diag Décarbon\'Action', 'Un bilan carbone et un plan d\'action réalisés par un expert référencé, cofinancés pour les PME et ETI.', 'https://www.bpifrance.fr/catalogue-offres/diag-decarbonaction'],
  ['OPQIBI', 'Qualifications des bureaux d\'études (dont bilan des émissions et audit énergétique).', 'https://www.opqibi.com'],
  ['AFNOR', 'Formations, autodiagnostic et label Engagé RSE adossé à l\'ISO 26000.', 'https://www.afnor.org'],
  ['Votre CCI', 'Accompagnements RSE et transition, souvent à coût réduit pour les PME.', 'https://www.cci.fr']
];
const PR_QUEST = ['Quelles références dans mon secteur et pour une structure de ma taille ?', 'Qui réalisera la mission, avec quelles qualifications (formation Bilan Carbone®, OPQIBI, certification) ?', 'Quelle méthode, quel périmètre et quels livrables précis ?', 'Comment l\'équipe interne sera-t-elle formée pour reprendre la main ensuite ?', 'Quel planning et quel temps de mobilisation attendu de nos équipes ?', 'Le prix est-il forfaitaire ? Que comprend-il, et la mission est-elle éligible à une aide ?', 'Le cabinet vend-il aussi un logiciel ou des compensations carbone ? Ses recommandations sont-elles indépendantes ?'];
const PR = {tab: 'trouver', ville: LS.get('pr-ville') || '', spec: 'strategie', busy: false, err: '', res: null, total: 0, villeNom: '', cab: null};
async function prChercher(){
  PR.busy = true; PR.err = ''; renderPresta();
  try { const v = await villeCodes(PR.ville); PR.villeNom = v.nom; const sp = PR_SPEC.find(s => s[0] === PR.spec); const r = await chercherLocal({q: sp[2], cps: v.cps, naf: '70.22Z,71.12B,74.90B,85.59A,70.21Z'}); PR.res = r.L; PR.total = r.total; }
  catch(e) { PR.err = errLocal(e); PR.res = null; }
  PR.busy = false; renderPresta();
}
async function prInit(){ try { PR.cab = IDB.db && await IDB.get('kv', 'cabinet'); } catch(e) {} if (!PR.cab) PR.cab = {id: 'cabinet', nom: '', ville: '', zone: '', presentation: '', specs: [], quals: '', refs: '', tarifs: '', email: '', tel: '', site: ''}; renderPresta(); }
const prSave = () => IDB.put('kv', PR.cab).catch(() => {});
function cabHtml(c){
  const sp = PR_SPEC.filter(s => c.specs.includes(s[0]));
  return '<h1>' + esc(c.nom || 'Mon cabinet') + '</h1><p style="text-align:center">Conseil en RSE et développement durable' + (c.ville ? ' · ' + esc(c.ville) : '') + (c.zone ? ' · Intervient : ' + esc(c.zone) : '') + '</p>'
    + (c.presentation ? '<h2>Qui sommes-nous</h2><p>' + esc(c.presentation).replace(/\n/g, '<br>') + '</p>' : '')
    + (sp.length ? '<h2>Nos services</h2>' + sp.map(s => '<h3>' + s[1] + '</h3><p>' + s[3] + '</p><p><b>Notre démarche :</b></p><ol>' + s[4].map(x => '<li>' + x + '</li>').join('') + '</ol><p><b>Livrables :</b> ' + s[5] + '</p><p><b>Référentiels :</b> ' + s[6] + '</p>').join('') : '')
    + (c.quals ? '<h2>Qualifications et certifications</h2><p>' + esc(c.quals).replace(/\n/g, '<br>') + '</p>' : '')
    + (c.refs ? '<h2>Références</h2><p>' + esc(c.refs).replace(/\n/g, '<br>') + '</p>' : '')
    + (c.tarifs ? '<h2>Modalités et tarifs</h2><p>' + esc(c.tarifs).replace(/\n/g, '<br>') + '</p>' : '')
    + '<h2>Contact</h2><p>' + [c.email, c.tel, c.site].filter(Boolean).map(esc).join(' · ') + '</p>';
}
function renderPresta(){
  const el = document.getElementById('prRoot'); if (!el) return;
  const sub = route().base === 'prestataires' ? route().sub : null; if (sub && ['trouver', 'services', 'cabinet'].includes(sub)) PR.tab = sub;
  let h = '<div class="eyebrow">AGIR · CABINETS ET PRESTATAIRES</div><h2>Cabinets et prestataires RSE</h2><p class="lead">Les entreprises cherchent des cabinets pour leur bilan carbone, leur CSRD, leurs labels ; les cabinets cherchent des clients. Cet espace sert les deux : trouver un prestataire près de chez soi, comprendre ce que fait chaque type de mission et comment elle se déroule, et, pour les cabinets, présenter leurs services.</p>';
  h += '<div class="ptabs">' + [['trouver', 'Trouver un prestataire', 'Par ville et spécialité', ICO.flag], ['services', 'Les missions de conseil', PR_SPEC.length + ' spécialités expliquées', ICO.book], ['cabinet', 'Je suis un cabinet', 'Ma fiche de services', ICO.bag]].map(([k, t, s, ic]) => '<a class="ptab' + (PR.tab === k ? ' on' : '') + '" href="#prestataires--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (PR.tab === 'trouver') {
    h += '<div class="card"><div class="locform"><label>Ville ou code postal<input class="inp" id="prV" value="' + esc(PR.ville) + '" placeholder="Ex. : Lyon, Nantes, 31000"></label><button class="btn" data-pr="go">' + (PR.busy ? 'Recherche…' : 'Rechercher') + '</button></div><div class="chips">' + PR_SPEC.map(s => '<button class="chip' + (PR.spec === s[0] ? ' on' : '') + '" data-pr="sp" data-k="' + s[0] + '">' + s[1] + '</button>').join('') + '</div><p class="note">La recherche porte sur les cabinets de conseil, bureaux d\'études et organismes de formation du registre officiel dont le nom évoque la spécialité. Complétez toujours avec les annuaires professionnels ci-dessous.</p></div>';
    if (PR.err) h += '<div class="callout o"><strong>Recherche indisponible</strong>' + esc(PR.err) + '</div>';
    if (PR.res) h += '<h3>' + PR.total + ' structure' + (PR.total > 1 ? 's' : '') + ' à ' + esc(PR.villeNom) + '</h3>' + (PR.res.length ? '<div class="lgrid">' + PR.res.map(x => carteLocale(x, '<p class="note">' + esc(nafLib(x.naf) || '') + '</p>')).join('') + '</div>' : '<p class="note">Aucun résultat avec ce mot-clé à cet endroit : essayez une autre spécialité, une ville voisine, ou les annuaires ci-dessous.</p>');
    h += '<h3>Annuaires professionnels et services publics</h3><div class="lgrid">' + PR_ANNU.map(([n, d, u]) => '<div class="card lcard"><h4>' + esc(n) + '</h4><p>' + esc(d) + '</p><div class="lact"><a class="btn sm" href="' + u + '" target="_blank" rel="noopener">Ouvrir</a></div></div>').join('') + '</div>';
    h += '<div class="grid two"><div class="card"><h4>Les questions à poser avant de choisir</h4><ol>' + PR_QUEST.map(q => '<li>' + esc(q) + '</li>').join('') + '</ol></div><div class="card"><h4>Bon à savoir</h4><ul><li>Aucun titre légal n\'est exigé pour réaliser un bilan carbone, mais la formation à la méthode Bilan Carbone® est requise pour intervenir dans le Diag Décarbon\'Action.</li><li>Demandez au moins deux devis comparables, sur le même périmètre.</li><li>Un bon prestataire forme vos équipes pour que vous puissiez refaire le travail vous-mêmes l\'année suivante.</li><li>Méfiez-vous des promesses de « neutralité carbone » fondées surtout sur l\'achat de compensation.</li></ul><a class="btn ghost sm" href="#pilotage--aides">Les aides pour financer la mission →</a></div></div>';
  } else if (PR.tab === 'services') {
    h += '<p class="prose">Ce que recouvre chaque grande famille de missions de conseil en RSE : l\'objectif, la démarche pas à pas, les livrables et les référentiels utilisés. Utile pour un cabinet qui structure son offre, pour un consultant débutant, et pour une entreprise qui rédige son cahier des charges.</p><div class="svgrid">' + PR_SPEC.map(s => '<details class="card svc"><summary><h4>' + s[1] + '</h4><p>' + s[3] + '</p></summary><h5>La démarche</h5><ol>' + s[4].map(x => '<li>' + x + '</li>').join('') + '</ol><h5>Livrables</h5><p>' + s[5] + '</p><h5>Référentiels</h5><p>' + s[6] + '</p></details>').join('') + '</div>';
  } else {
    const c = PR.cab; if (!c) { el.innerHTML = h + '<p class="note">Chargement…</p>'; return; }
    h += '<div class="callout b"><strong>Présentez votre cabinet</strong>Remplissez votre fiche : elle se télécharge en plaquette Word à envoyer à vos prospects. Vous pouvez aussi demander à figurer dans l\'annuaire de l\'application ; chaque demande est vérifiée avant publication.</div>'
      + '<div class="grid two"><div class="card"><h4>Ma fiche</h4>'
      + [['nom', 'Nom du cabinet'], ['ville', 'Ville'], ['zone', 'Zone d\'intervention (ex. : Auvergne-Rhône-Alpes, France entière, à distance)']].map(([k, l]) => '<div class="row"><label>' + l + '<input class="inp" data-cab="' + k + '" value="' + esc(c[k]) + '"></label></div>').join('')
      + '<div class="row"><label>Présentation<textarea class="inp" rows="4" data-cab="presentation" placeholder="Votre histoire, votre équipe, votre approche">' + esc(c.presentation) + '</textarea></label></div>'
      + '<p class="lbl">Spécialités</p><div class="chips">' + PR_SPEC.map(s => '<button class="chip' + (c.specs.includes(s[0]) ? ' on' : '') + '" data-pr="cs" data-k="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>'
      + [['quals', 'Qualifications et certifications', 'Ex. : formation Bilan Carbone®, OPQIBI, Qualiopi, évaluateur ACT'], ['refs', 'Références clients', 'Secteurs, tailles d\'entreprises, missions réalisées'], ['tarifs', 'Modalités et tarifs (facultatif)', 'Forfaits, journées, éligibilité aux aides']].map(([k, l, ph]) => '<div class="row"><label>' + l + '<textarea class="inp" rows="3" data-cab="' + k + '" placeholder="' + ph + '">' + esc(c[k]) + '</textarea></label></div>').join('')
      + [['email', 'E-mail'], ['tel', 'Téléphone'], ['site', 'Site web']].map(([k, l]) => '<div class="row"><label>' + l + '<input class="inp" data-cab="' + k + '" value="' + esc(c[k]) + '"></label></div>').join('')
      + '</div><div class="card cabprev"><h4>Aperçu</h4><div class="cabdoc">' + cabHtml(c) + '</div><div class="ctool"><button class="btn" data-pr="doc">Plaquette Word</button><button class="btn ghost" data-pr="pdf">PDF</button><button class="btn ghost" data-pr="ref">Demander le référencement</button></div></div></div>';
  }
  el.innerHTML = h;
}
const prRoot = document.getElementById('prRoot');
prRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-pr]'); if (!b) return; const a = b.dataset.pr;
  const vi = document.getElementById('prV'); if (vi) { PR.ville = vi.value.trim(); LS.set('pr-ville', PR.ville); }
  if (a === 'sp') { PR.spec = b.dataset.k; if (PR.ville) prChercher(); else renderPresta(); }
  else if (a === 'go') { if (!PR.ville) { toast('Indiquez une ville'); return; } prChercher(); }
  else if (a === 'cs') { const s = PR.cab.specs, i = s.indexOf(b.dataset.k); if (i < 0) s.push(b.dataset.k); else s.splice(i, 1); await prSave(); const y = window.scrollY; renderPresta(); window.scrollTo(0, y); }
  else if (a === 'doc') { downloadDoc(cabHtml(PR.cab), (PR.cab.nom || 'Cabinet') + ' - plaquette'); toast('Plaquette téléchargée'); }
  else if (a === 'pdf') printHtml(cabHtml(PR.cab));
  else if (a === 'ref') {
    const c = PR.cab; if (!c.nom || !c.email || !c.specs.length) { toast('Indiquez au moins le nom, l\'e-mail et une spécialité'); return; }
    const txt = 'Demande de référencement dans SERIKI BIBLE RSE\n\nCabinet : ' + c.nom + '\nVille : ' + c.ville + '\nZone : ' + c.zone + '\nSpécialités : ' + PR_SPEC.filter(s => c.specs.includes(s[0])).map(s => s[1]).join(', ') + '\nQualifications : ' + c.quals + '\nContact : ' + [c.email, c.tel, c.site].filter(Boolean).join(' · ') + '\n\nPrésentation :\n' + c.presentation;
    const dest = (window.SERIKI_CONTACT || '').trim();
    modal('Demander le référencement', '<p>Votre demande est prête. ' + (dest ? 'Elle s\'ouvre dans votre messagerie, adressée à l\'équipe de l\'application.' : 'Copiez-la et envoyez-la à l\'adresse de contact indiquée dans la page « À propos ».') + '</p><textarea class="inp" rows="9" readonly>' + esc(txt) + '</textarea>', dest ? 'Ouvrir ma messagerie' : 'Copier', async () => { if (dest) location.href = 'mailto:' + dest + '?subject=' + encodeURIComponent('Référencement : ' + c.nom) + '&body=' + encodeURIComponent(txt); else { try { await navigator.clipboard.writeText(txt); toast('Demande copiée'); } catch(err) { toast('Sélectionnez le texte pour le copier'); return false; } } });
  }
});
prRoot.addEventListener('input', e => { const k = e.target.dataset.cab; if (!k) return; PR.cab[k] = e.target.value; clearTimeout(PR.t); PR.t = setTimeout(() => { prSave(); const p = prRoot.querySelector('.cabdoc'); if (p) p.innerHTML = cabHtml(PR.cab); }, 300); });
prRoot.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'prV') { PR.ville = e.target.value.trim(); LS.set('pr-ville', PR.ville); if (PR.ville) prChercher(); } });
window.addEventListener('hashchange', () => { if (route().base === 'prestataires') renderPresta(); });
espaceReady.then(prInit, prInit);

/* =====================================================================
   DÉMARRER LA RSE DE ZÉRO : STRUCTURER LA RSE D'UNE ENTREPRISE
   ===================================================================== */
const DZ_TAILLES = [
  ['tpe', 'Moins de 10 salariés', 'Le dirigeant porte lui-même la démarche, avec quelques heures par mois. On vise 5 à 10 actions simples, visibles et économes.', 'Le dirigeant, éventuellement épaulé par un salarié volontaire', 'Un point RSE trimestriel en réunion d\'équipe', 'Un label sectoriel ou territorial, Engagé RSE au premier niveau, évaluation EcoVadis si un client la demande'],
  ['pe', '10 à 49 salariés', 'Un référent RSE, souvent à temps partiel (qualité, RH, alternant), appuyé par la direction. La démarche se structure en un an.', 'Un référent RSE (10 à 30 % de son temps) rattaché à la direction', 'Un comité RSE de 4 à 6 personnes, tous les deux mois', 'Engagé RSE, LUCIE 26000, B Corp, EcoVadis'],
  ['me', '50 à 249 salariés', 'Un chargé de mission RSE dédié, un comité RSE et des correspondants dans les services. Les clients et les banques posent déjà des questions précises.', 'Un chargé de mission ou responsable RSE, rattaché à la direction générale', 'Un comité RSE mensuel et un réseau de correspondants par service', 'Engagé RSE, LUCIE 26000, B Corp, EcoVadis, ISO 14001 ou ISO 45001'],
  ['eti', '250 à 4 999 salariés', 'Une direction ou un service RSE, une gouvernance au comité de direction, des obligations réglementaires (bilan des émissions, éventuellement CSRD selon les seuils).', 'Une direction RSE membre ou rapportant au comité de direction', 'Un comité RSE au niveau de la direction générale, un comité opérationnel et des correspondants sur chaque site', 'Engagé RSE niveau confirmé ou exemplaire, ISO 14001, ISO 45001, ISO 50001, EcoVadis, société à mission'],
  ['ge', '5 000 salariés et plus', 'Une direction du développement durable, un comité du conseil d\'administration, un reporting de durabilité audité et un plan de vigilance.', 'Une direction du développement durable rattachée au président ou au directeur général', 'Un comité RSE du conseil, un comité exécutif dédié et un réseau international de correspondants', 'Notations extra-financières (EcoVadis, CDP, agences de notation), ISO 14001, ISO 45001, ISO 50001, société à mission']
];
const ISO7 = [['Gouvernance de l\'organisation', 'Comment les décisions sont prises et intègrent la RSE.'], ['Droits de l\'Homme', 'Respect des droits fondamentaux, y compris chez les fournisseurs.'], ['Relations et conditions de travail', 'Emploi, santé et sécurité, dialogue social, formation.'], ['Environnement', 'Pollution, ressources, climat, biodiversité.'], ['Loyauté des pratiques', 'Lutte contre la corruption, concurrence loyale, achats responsables.'], ['Questions relatives aux consommateurs', 'Information honnête, santé et sécurité, données personnelles.'], ['Communautés et développement local', 'Emploi local, partenariats, mécénat, ancrage territorial.']];
const DZ_ETAPES = [
  ['etat', 'Faire l\'état des lieux', 'Connaître l\'entreprise et ce qui existe déjà, avant de proposer quoi que ce soit.', 'Beaucoup d\'entreprises font déjà de la RSE sans le savoir (tri des déchets, prévention des risques, mécénat local). Les repérer donne des premiers résultats et rassure la direction.', ['Rencontrer la direction et chaque responsable de service (30 minutes chacun) : activité, clients, difficultés, projets.', 'Recenser les pratiques existantes : sécurité, formation, énergie, déchets, achats, actions locales.', 'Rassembler les documents utiles : document unique, factures d\'énergie, bilan social, questionnaires clients.', 'Faire l\'autodiagnostic RSE de l\'application pour situer la maturité sur six piliers.'], 'Un portrait de l\'entreprise et la liste des pratiques existantes.', [['activite', 'Activité et produits ou services', 'ta'], ['effectif', 'Effectif et sites', 'in'], ['existant', 'Ce qui existe déjà en matière de RSE', 'ta'], ['attentes', 'Ce que demandent les clients, banques ou donneurs d\'ordre', 'ta']], null, ['#diagnostic', 'Faire l\'autodiagnostic'], '2 à 4 semaines'],
  ['direction', 'Obtenir l\'engagement de la direction', 'Que la direction porte la démarche et la rende légitime.', 'Sans engagement visible de la direction, la RSE reste un projet de côté. Une lettre signée et un temps dédié en comité de direction changent tout.', ['Présenter en 15 minutes les enjeux pour l\'entreprise : obligations, attentes des clients, accès au financement, recrutement, économies.', 'Proposer une ambition réaliste pour la première année.', 'Faire signer une lettre d\'engagement et la diffuser aux salariés.', 'Obtenir un budget et du temps, même modestes.'], 'La lettre d\'engagement signée et diffusée.', [['dirigeant', 'Nom et fonction du dirigeant', 'in'], ['ambition', 'Ambition RSE de l\'entreprise (une ou deux phrases)', 'ta'], ['budget', 'Moyens accordés (temps, budget)', 'in']], 'lettre', ['#outils', 'Vérifier les obligations'], '1 mois'],
  ['gouv', 'Nommer un référent et créer la gouvernance', 'Désigner qui porte la RSE et comment les décisions sont prises.', 'Une démarche sans pilote s\'essouffle. Un référent identifié, un comité et un rythme de réunions installent la RSE dans le fonctionnement normal de l\'entreprise.', ['Rédiger la mission du référent RSE : rôle, rattachement, temps consacré.', 'Constituer un comité RSE avec des personnes de différents services.', 'Fixer un rythme de réunions et un ordre du jour type.', 'Identifier des volontaires ambassadeurs dans les équipes.'], 'La mission du référent et la composition du comité RSE.', [['referent', 'Référent RSE (nom, fonction)', 'in'], ['comite', 'Membres du comité RSE', 'ta'], ['rythme', 'Fréquence des réunions', 'in']], 'mission', null, '1 mois'],
  ['oblig', 'Identifier ses obligations', 'Savoir ce que la loi impose à l\'entreprise selon sa taille et son secteur.', 'Les obligations sont le socle non négociable : index de l\'égalité professionnelle, bilan des émissions, décret tertiaire, devoir de vigilance, CSRD selon les seuils.', ['Utiliser l\'outil « Suis-je concerné ? » avec l\'effectif, le chiffre d\'affaires et le bilan.', 'Vérifier les obligations propres au secteur (installations classées, emballages, responsabilité élargie du producteur).', 'Noter les échéances dans l\'agenda.'], 'La liste des obligations et leurs échéances.', [['obligations', 'Obligations identifiées et échéances', 'ta']], null, ['#outils', 'Suis-je concerné ?'], '1 semaine'],
  ['pp', 'Cartographier les parties prenantes', 'Savoir qui est concerné par l\'activité et ce qu\'ils attendent.', 'Salariés, clients, fournisseurs, banques, riverains, collectivités : leurs attentes orientent les priorités, et les associer donne de la crédibilité.', ['Lister les parties prenantes internes et externes.', 'Pour chacune : ses attentes, son influence, l\'impact de l\'entreprise sur elle.', 'Choisir un mode de dialogue (questionnaire, entretien, réunion).', 'Consulter les plus importantes.'], 'La cartographie des parties prenantes et la synthèse de leurs attentes.', [['pp', 'Parties prenantes et leurs attentes (une par ligne : nom – attentes – influence)', 'ta']], 'pp', ['#terrain', 'Guides de terrain'], '1 mois'],
  ['mat', 'Choisir ses enjeux prioritaires', 'Retenir les 5 à 10 sujets sur lesquels agir en priorité.', 'On ne peut pas tout faire. L\'analyse de matérialité croise l\'importance pour l\'entreprise et pour les parties prenantes. Pour une entreprise soumise à la CSRD, elle devient une double matérialité obligatoire.', ['Partir des sept questions centrales de l\'ISO 26000 et des enjeux du secteur.', 'Noter chaque enjeu avec le comité RSE et les retours des parties prenantes.', 'Retenir les enjeux prioritaires et les faire valider par la direction.', 'Pour une grande entreprise : conduire la double matérialité dans l\'Atelier CSRD.'], 'La liste des enjeux prioritaires validée.', [['enjeux', 'Enjeux prioritaires retenus', 'ta']], null, ['#atelier--dma', 'Outil de double matérialité'], '1 à 2 mois'],
  ['mesure', 'Mesurer le point de départ', 'Chiffrer la situation initiale pour pouvoir montrer les progrès.', 'Sans indicateur de départ, impossible de prouver une amélioration. Le bilan carbone est souvent la première mesure demandée.', ['Choisir 8 à 12 indicateurs liés aux enjeux prioritaires.', 'Collecter les valeurs de l\'année écoulée.', 'Réaliser un premier bilan carbone, au moins sur les scopes 1 et 2.', 'Saisir les valeurs dans le tableau de bord.'], 'Le tableau de bord initial et le premier bilan carbone.', [['indicateurs', 'Indicateurs suivis et valeurs de départ', 'ta']], null, ['#pilotage--kpi', 'Tableau de bord'], '2 à 3 mois'],
  ['politique', 'Écrire la politique RSE', 'Formaliser les engagements de l\'entreprise dans un document court et signé.', 'La politique RSE dit ce que l\'entreprise s\'engage à faire, sur quels sujets, avec quels objectifs. C\'est le document que demandent les clients, les labels et les appels d\'offres.', ['Reprendre l\'ambition, les enjeux prioritaires et les objectifs chiffrés.', 'Organiser le document selon les sept questions centrales de l\'ISO 26000.', 'Le faire signer par la direction, le diffuser et le publier sur le site.'], 'La politique RSE signée.', [['objectifs', 'Objectifs chiffrés (ex. : -20 % d\'énergie en 3 ans)', 'ta']], 'politique', null, '1 mois'],
  ['plan', 'Construire le plan d\'action', 'Traduire les engagements en actions concrètes, datées et suivies.', 'Le plan d\'action rend la politique réelle : qui fait quoi, quand, avec quel budget et quel résultat attendu. Commencez par des actions rapides et visibles.', ['Pour chaque enjeu prioritaire : 2 ou 3 actions.', 'Pour chaque action : responsable, échéance, budget, indicateur.', 'Mélanger actions rapides (moins de 3 mois) et chantiers de fond.', 'Suivre l\'avancement en comité RSE.'], 'Le plan d\'action sur un à trois ans.', [['actions', 'Premières actions (une par ligne)', 'ta']], null, ['#pilotage--plan', 'Plan d\'action'], '1 mois'],
  ['equipes', 'Embarquer les salariés', 'Faire de la RSE l\'affaire de tous, pas seulement du référent.', 'Les résultats viennent des équipes : achats, production, commerciaux, RH. Une démarche comprise et partagée avance plus vite et dure plus longtemps.', ['Organiser un atelier de sensibilisation pour tous (une fresque, par exemple).', 'Former les métiers clés (achats, production, commercial).', 'Recueillir les idées des salariés et en mettre en œuvre rapidement.', 'Communiquer régulièrement sur les progrès.'], 'Le plan de sensibilisation et de communication interne.', [['sensib', 'Actions de sensibilisation prévues', 'ta']], null, ['#terrain', 'Guide de sensibilisation'], 'En continu'],
  ['process', 'Intégrer la RSE dans les processus', 'Inscrire la RSE dans le fonctionnement quotidien.', 'Tant que la RSE reste un projet à part, elle dépend de la motivation de quelques personnes. Intégrée aux processus, elle devient automatique.', ['Achats : charte fournisseurs et critères RSE dans les choix.', 'RH : critères dans les recrutements, l\'intégration, les entretiens annuels.', 'Production et logistique : énergie, déchets, transport.', 'Commercial : arguments RSE et réponses aux questionnaires clients.', 'Finance : budget RSE et critères dans les investissements.', 'Pour aller plus loin : inscrire une raison d\'être dans les statuts, voire devenir société à mission.'], 'Les procédures modifiées.', [['processus', 'Processus modifiés', 'ta']], null, ['#modeles', 'Modèles de rédaction'], '6 à 12 mois'],
  ['reco', 'Rendre compte et faire reconnaître', 'Publier les résultats et obtenir une reconnaissance externe.', 'Rendre compte crée la confiance. Un label ou une notation apporte une preuve indépendante, très utile face aux clients et aux appels d\'offres.', ['Publier chaque année un bilan RSE, à partir de la norme volontaire VSME pour une PME.', 'Choisir une reconnaissance adaptée à la taille et aux clients.', 'Faire une revue annuelle de la démarche et ajuster les priorités.'], 'Le premier rapport RSE et le choix d\'un label.', [['label', 'Label ou évaluation visé', 'in']], null, ['#normes', 'Normes et labels'], '12 à 18 mois']
];
const DZ = {d: null};
async function dzInit(){ try { DZ.d = IDB.db && await IDB.get('kv', 'demarrer'); } catch(e) {} if (!DZ.d) DZ.d = {id: 'demarrer', taille: '', entreprise: '', ok: {}, f: {}, open: 'etat'}; renderDemarrer(); }
const dzSave = () => IDB.put('kv', DZ.d).catch(() => {});
const dzF = k => DZ.d.f[k] || '';
const dzT = () => DZ_TAILLES.find(t => t[0] === DZ.d.taille);
function dzModele(m){
  const E = esc(DZ.d.entreprise || '[Nom de l\'entreprise]'), br = s => esc(s).replace(/\n/g, '<br>');
  if (m === 'lettre') return '<h1>Lettre d\'engagement RSE de la direction</h1><p>' + E + ', le ' + new Date().toLocaleDateString('fr-FR') + '</p><p style="text-align:justify">Notre entreprise s\'engage dans une démarche de responsabilité sociétale. Nous voulons conduire nos activités en tenant compte de leurs effets sur nos salariés, nos clients, nos fournisseurs, notre territoire et l\'environnement, et en rendre compte de manière transparente.</p><p style="text-align:justify"><b>Notre ambition :</b> ' + br(dzF('ambition') || '[ambition de l\'entreprise]') + '</p><p style="text-align:justify">Pour y parvenir, nous nommons un référent RSE, nous créons un comité RSE réunissant différents services, et nous consacrons à cette démarche les moyens suivants : ' + br(dzF('budget') || '[moyens accordés]') + '.</p><p style="text-align:justify">Nous identifierons nos enjeux prioritaires avec nos parties prenantes, fixerons des objectifs mesurables et publierons chaque année nos résultats. Chaque salarié est invité à contribuer à cette démarche.</p><p style="text-align:right">' + br(dzF('dirigeant') || '[Nom et fonction du dirigeant]') + '<br>Signature</p>';
  if (m === 'mission') return '<h1>Mission du référent RSE et charte du comité RSE</h1><h2>Le référent RSE</h2><p>' + br(dzF('referent') || '[Nom, fonction]') + '</p><ul><li>Coordonner la démarche RSE et animer le comité RSE.</li><li>Suivre les obligations réglementaires et les échéances.</li><li>Construire et suivre le plan d\'action et le tableau de bord.</li><li>Répondre aux questionnaires RSE des clients et des partenaires.</li><li>Sensibiliser les équipes et animer le réseau d\'ambassadeurs.</li><li>Préparer le bilan RSE annuel.</li></ul><p>Rattachement : direction générale. Temps consacré : ' + br(dzT() ? dzT()[3] : '[à définir]') + '.</p><h2>Le comité RSE</h2><p><b>Membres :</b> ' + br(dzF('comite') || '[membres]') + '</p><p><b>Rythme :</b> ' + br(dzF('rythme') || (dzT() ? dzT()[4] : '[fréquence]')) + '</p><p><b>Rôle :</b> proposer les priorités, suivre le plan d\'action et les indicateurs, valider les communications RSE.</p><p><b>Ordre du jour type :</b> avancement du plan d\'action, indicateurs, nouvelles obligations et demandes des clients, idées des salariés, décisions.</p>';
  if (m === 'pp') return '<h1>Cartographie des parties prenantes</h1><p>' + E + '</p><table border="1" cellpadding="5" style="border-collapse:collapse;width:100%"><tr><th>Partie prenante</th><th>Attentes</th><th>Influence</th></tr>' + (dzF('pp') ? dzF('pp').split('\n').filter(Boolean).map(l => { const c = l.split(/\s+[–-]\s+/); return '<tr><td>' + esc(c[0] || '') + '</td><td>' + esc(c[1] || '') + '</td><td>' + esc(c[2] || '') + '</td></tr>'; }).join('') : ['Salariés', 'Clients', 'Fournisseurs', 'Banques et investisseurs', 'Collectivités et riverains', 'Associations'].map(n => '<tr><td>' + n + '</td><td></td><td></td></tr>').join('')) + '</table>';
  if (m === 'politique') return '<h1>Politique RSE</h1><p style="text-align:center">' + E + '</p><h2>Notre ambition</h2><p>' + br(dzF('ambition') || '[ambition]') + '</p><h2>Nos enjeux prioritaires</h2><p>' + br(dzF('enjeux') || '[enjeux prioritaires]') + '</p><h2>Nos engagements</h2>' + ISO7.map(([t, d]) => '<h3>' + t + '</h3><p><i>' + d + '</i></p><p>[Nos engagements sur ce thème]</p>').join('') + '<h2>Nos objectifs</h2><p>' + br(dzF('objectifs') || '[objectifs chiffrés]') + '</p><h2>Notre organisation</h2><p>Référent RSE : ' + br(dzF('referent') || '[nom]') + '. Comité RSE : ' + br(dzF('rythme') || '[fréquence]') + '. Bilan publié chaque année.</p><p style="text-align:right">' + br(dzF('dirigeant') || '[Dirigeant]') + '<br>Date et signature</p>';
  return '';
}
function dzDossier(){
  const t = dzT();
  return '<h1>Dossier de structuration RSE</h1><p style="text-align:center">' + esc(DZ.d.entreprise || 'Mon entreprise') + (t ? ' · ' + t[1] : '') + ' · ' + new Date().toLocaleDateString('fr-FR') + '</p>' + (t ? '<h2>Organisation adaptée à notre taille</h2><p>' + t[2] + '</p><ul><li><b>Pilotage :</b> ' + t[3] + '</li><li><b>Gouvernance :</b> ' + t[4] + '</li><li><b>Reconnaissances possibles :</b> ' + t[5] + '</li></ul>' : '')
    + DZ_ETAPES.map(([id, titre, obj, , , liv, ch], i) => '<h2>' + (i + 1) + '. ' + titre + (DZ.d.ok[id] ? ' (fait)' : '') + '</h2><p><i>' + obj + '</i></p><p><b>Livrable :</b> ' + liv + '</p>' + ch.filter(([k]) => dzF(k)).map(([k, l]) => '<p><b>' + l + ' :</b><br>' + esc(dzF(k)).replace(/\n/g, '<br>') + '</p>').join('')).join('');
}
function renderDemarrer(){
  const el = document.getElementById('dzRoot'); if (!el || !DZ.d) return;
  const d = DZ.d, t = dzT(), n = DZ_ETAPES.filter(x => d.ok[x[0]]).length, pct = Math.round(100 * n / DZ_ETAPES.length);
  let h = '<div class="eyebrow">AGIR · DÉMARRER</div><h2>Démarrer la RSE de zéro</h2><p class="lead">Votre entreprise n\'a encore ni démarche, ni référent, ni service RSE ? Ce parcours guide pas à pas la personne qui s\'en charge, qu\'elle soit dirigeante, salariée, alternante ou débutante : douze étapes, ce qu\'il faut faire, pourquoi, le document à produire et les modèles prêts à remplir. À la fin, vous obtenez le dossier complet de structuration RSE de l\'entreprise.</p>';
  h += '<div class="card dzhead"><div class="dzid"><label>Entreprise<input class="inp" data-dz="entreprise" value="' + esc(d.entreprise) + '" placeholder="Nom de l\'entreprise"></label><label>Taille<select class="inp" data-dz="taille"><option value="">Choisir…</option>' + DZ_TAILLES.map(x => '<option value="' + x[0] + '"' + (d.taille === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label></div><div class="rprog"><div><i style="width:' + pct + '%"></i></div><b>' + n + ' / ' + DZ_ETAPES.length + '</b></div><div class="ctool"><button class="btn" data-dz="dossier">Dossier complet en Word</button><button class="btn ghost" data-dz="dossierpdf">PDF</button></div></div>';
  if (t) h += '<div class="grid three dztaille"><div class="card"><h4>Qui pilote</h4><p>' + t[3] + '</p></div><div class="card"><h4>Quelle gouvernance</h4><p>' + t[4] + '</p></div><div class="card"><h4>Quelle reconnaissance</h4><p>' + t[5] + '</p></div></div><p class="prose">' + t[2] + '</p>';
  else h += '<div class="callout b"><strong>Indiquez la taille de l\'entreprise</strong>Le parcours adapte alors l\'organisation, la gouvernance et les reconnaissances conseillées.</div>';
  h += '<ol class="dzsteps">' + DZ_ETAPES.map(([id, titre, obj, pq, cm, liv, ch, mod, lien, duree], i) => {
    const ok = !!d.ok[id], op = d.open === id;
    return '<li class="dzs' + (ok ? ' ok' : '') + (op ? ' open' : '') + '"><button class="dzh" data-dz="open" data-k="' + id + '" aria-expanded="' + op + '"><span class="dzn">' + (ok ? '✓' : i + 1) + '</span><span class="dzt"><strong>' + titre + '</strong><small>' + obj + '</small></span><span class="pill g">' + duree + '</span></button>'
      + (op ? '<div class="dzb"><p class="prose"><strong>Pourquoi :</strong> ' + pq + '</p><h5>Comment faire</h5><ol>' + cm.map(x => '<li>' + x + '</li>').join('') + '</ol><p><strong>Livrable :</strong> ' + liv + '</p>'
        + ch.map(([k, l, ty]) => '<div class="row"><label>' + l + (ty === 'ta' ? '<textarea class="inp" rows="3" data-dzf="' + k + '">' + esc(dzF(k)) + '</textarea>' : '<input class="inp" data-dzf="' + k + '" value="' + esc(dzF(k)) + '">') + '</label></div>').join('')
        + (id === 'politique' ? '<details class="iso7"><summary>Les sept questions centrales de l\'ISO 26000</summary><ul>' + ISO7.map(([a, b]) => '<li><strong>' + a + ' :</strong> ' + b + '</li>').join('') + '</ul></details>' : '')
        + '<div class="ctool">' + (mod ? '<button class="btn" data-dz="mod" data-k="' + mod + '">Modèle prêt à remplir (Word)</button>' : '') + (lien ? '<a class="btn ghost" href="' + lien[0] + '">' + lien[1] + ' →</a>' : '') + '<button class="btn ' + (ok ? 'ghost' : '') + '" data-dz="ok" data-k="' + id + '">' + (ok ? 'Marquer à refaire' : 'Étape terminée') + '</button></div></div>' : '') + '</li>';
  }).join('') + '</ol>';
  h += '<h3>Vous débutez ? Les bons réflexes</h3><div class="grid two"><div class="card"><ul><li><strong>Commencez petit :</strong> trois actions réussies valent mieux que vingt promises.</li><li><strong>Parlez le langage de la direction :</strong> économies, risques évités, clients gagnés, recrutement.</li><li><strong>Partez de l\'existant :</strong> valorisez ce que l\'entreprise fait déjà.</li><li><strong>Faites valider :</strong> chaque document important doit être approuvé par la direction.</li></ul></div><div class="card"><ul><li><strong>Documentez tout :</strong> sources, calculs, décisions. C\'est ce que demandent les auditeurs et les labels.</li><li><strong>Entourez-vous :</strong> CCI, Mission Transition Écologique, réseaux professionnels, cabinets si besoin.</li><li><strong>Mesurez :</strong> un indicateur de départ, puis le même chaque année.</li><li><strong>Communiquez avec prudence :</strong> une allégation environnementale doit être prouvée.</li></ul><p><a class="btn ghost sm" href="https://mission-transition-ecologique.beta.gouv.fr" target="_blank" rel="noopener">Mission Transition Écologique →</a> <a class="btn ghost sm" href="#prestataires">Trouver un cabinet →</a></p></div></div>';
  el.innerHTML = h;
}
const dzRoot = document.getElementById('dzRoot');
dzRoot.addEventListener('click', async e => {
  const b = e.target.closest('button[data-dz]'); if (!b) return; const a = b.dataset.dz, d = DZ.d;
  if (a === 'open') { d.open = d.open === b.dataset.k ? '' : b.dataset.k; await dzSave(); renderDemarrer(); const li = dzRoot.querySelector('.dzs.open'); if (li) li.scrollIntoView({block: 'nearest', behavior: 'smooth'}); }
  else if (a === 'ok') { d.ok[b.dataset.k] = !d.ok[b.dataset.k]; if (d.ok[b.dataset.k]) { const i = DZ_ETAPES.findIndex(x => x[0] === b.dataset.k), nx = DZ_ETAPES.slice(i + 1).find(x => !d.ok[x[0]]); d.open = nx ? nx[0] : ''; toast('Étape terminée'); } await dzSave(); renderDemarrer(); }
  else if (a === 'mod') { const m = b.dataset.k, html = dzModele(m); downloadDoc(html, (html.match(/<h1>([^<]*)/) || [])[1] || 'Modèle'); toast('Modèle téléchargé'); }
  else if (a === 'dossier') { downloadDoc(dzDossier(), 'Dossier de structuration RSE'); toast('Dossier téléchargé'); }
  else if (a === 'dossierpdf') printHtml(dzDossier());
});
dzRoot.addEventListener('change', async e => { const k = e.target.dataset.dz; if (k === 'taille' || k === 'entreprise') { DZ.d[k] = e.target.value; await dzSave(); renderDemarrer(); } });
dzRoot.addEventListener('input', e => { const k = e.target.dataset.dzf; if (!k) return; DZ.d.f[k] = e.target.value; clearTimeout(DZ.t); DZ.t = setTimeout(dzSave, 400); });
window.addEventListener('hashchange', () => { if (route().base === 'demarrer') renderDemarrer(); });
espaceReady.then(dzInit, dzInit);


/* =====================================================================
   AUDIT ET VÉRIFICATION : SE PRÉPARER (ENTREPRISE) ET ESPACE AUDITEUR
   ===================================================================== */
const AU_PREP = [
  ['lancement', 'Désigner l\'auditeur et lancer la mission', 'Choisir le vérificateur, le faire nommer et tenir une réunion de lancement au moins six mois avant la clôture.',
    ['Vérifiez qui peut certifier : un commissaire aux comptes ou un organisme tiers indépendant accrédité par le COFRAC, inscrit sur la liste de la H2A (Haute autorité de l\'audit).', 'Demandez deux ou trois propositions : expérience de votre secteur, équipe, honoraires, calendrier, outils utilisés.', 'Faites nommer le vérificateur par l\'assemblée générale, pour la durée prévue par la résolution.', 'Signez la lettre de mission : périmètre (sociétés, sites), niveau d\'assurance (limitée), calendrier, documents à fournir, interlocuteurs.', 'Tenez la réunion de lancement avec la direction financière, l\'équipe RSE et les principaux contributeurs : présentez le périmètre, la matérialité, le calendrier, les points sensibles.'],
    'Une ETI de 900 salariés clôture au 31 décembre. En juin, elle consulte deux cabinets, retient un commissaire aux comptes déjà présent sur les comptes, le fait nommer à l\'assemblée générale de juin, et tient la réunion de lancement le 15 septembre. Elle y présente ses 9 enjeux matériels et ses 65 points de données, et convient d\'une revue intermédiaire en novembre.',
    'kickoff', 'Ordre du jour de la réunion de lancement (Word)'],
  ['protocole', 'Écrire et partager le protocole de reporting', 'Documenter, pour chaque indicateur, ce qu\'il mesure, comment il est calculé, d\'où viennent les données et qui les contrôle.',
    ['Rédigez une partie générale : périmètre de consolidation, période, règles d\'estimation, calendrier de collecte, outils.', 'Pour chaque indicateur, remplissez une fiche : définition, formule, unité, sources, périmètre, responsable de la donnée, contrôles, méthode en cas de donnée manquante.', 'Faites relire chaque fiche par le responsable métier (RH, achats, énergie) : c\'est lui qui connaît les pièges.', 'Faites valider le protocole par la direction et transmettez-le à l\'auditeur avec la documentation de la double matérialité.', 'Mettez-le à jour chaque année et gardez l\'historique des changements de méthode.'],
    'Fiche « Taux de fréquence des accidents du travail » : nombre d\'accidents avec arrêt d\'au moins un jour, multiplié par 1 000 000, divisé par le nombre d\'heures travaillées. Sources : déclarations d\'accident et logiciel de paie. Périmètre : salariés en contrat de travail, intérimaires suivis à part. Responsable : responsable santé-sécurité de chaque site. Contrôle : rapprochement trimestriel entre déclarations et registre des accidents.',
    'protocole', 'Protocole de reporting avec fiche indicateur exemple (Word)'],
  ['preuves', 'Constituer un dossier de preuve par indicateur', 'Pouvoir remonter de chaque chiffre publié jusqu\'à ses documents d\'origine, sans chercher.',
    ['Créez un dossier par indicateur, nommé avec le code ESRS (ex. : « E1-5 Énergie »).', 'Rangez-y cinq éléments : la fiche du protocole, les données sources (factures, extractions de logiciel), le fichier de calcul, les contrôles réalisés, la validation par le responsable.', 'Dans le fichier de calcul, gardez une ligne par source (une facture, un site, un mois) et un total qui correspond exactement au chiffre publié.', 'Expliquez toute variation de plus de 10 % par rapport à l\'année précédente.', 'Faites signer ou valider par courriel chaque indicateur par son responsable avant de le transmettre.'],
    'Indicateur « Consommation d\'électricité » : 3 sites × 12 factures = 36 lignes dans le fichier de calcul, total 4 812 MWh, égal au chiffre du rapport. Contrôle : comparaison avec l\'année précédente (4 950 MWh, soit -2,8 %, expliqué par le passage aux éclairages LED du site de Lyon). Validation : courriel du responsable des services généraux du 20 janvier.',
    'preuve', 'Dossier de preuve prêt à remplir, avec l\'exemple de l\'électricité (Excel)'],
  ['preaudit', 'Faire un pré-audit sur une période intermédiaire', 'Tester soi-même, à mi-année, les indicateurs les plus risqués, pour corriger les processus avant la clôture.',
    ['Choisissez 4 à 6 indicateurs à risque : nouveaux, calculés à la main, issus de nombreux sites, ou corrigés l\'an dernier.', 'Prenez les données arrêtées à fin juin (ou à fin septembre).', 'Pour chacun, faites les tests de l\'auditeur : recalcul complet, rapprochement de quelques lignes avec leurs pièces, comparaison avec l\'an dernier.', 'Notez chaque écart dans une fiche de test : ce qui était attendu, ce qui a été trouvé, la cause, la correction.', 'Corrigez le processus (pas seulement le chiffre) et partagez les résultats avec l\'auditeur lors de sa revue intermédiaire.'],
    'Test de l\'indicateur « Heures de formation » à fin juin : 2 140 heures dans le tableau RH. Rapprochement de 10 formations tirées au hasard avec les feuilles d\'émargement : 2 formations comptées deux fois (sessions reportées). Écart : 28 heures, soit 1,3 %. Correction : le logiciel de formation devient la seule source et les sessions reportées sont supprimées avant extraction.',
    'test', 'Fiche de test de pré-audit avec un exemple (Excel)'],
  ['revue', 'Accompagner les travaux de l\'auditeur', 'Répondre vite et bien pendant la revue intermédiaire et la revue finale.',
    ['Nommez un coordinateur unique qui reçoit les demandes et suit un tableau des demandes (date, demandeur, responsable, date de réponse).', 'Envoyez les dossiers de preuve complets plutôt que des pièces une à une.', 'Préparez les responsables métiers aux entretiens : ils doivent pouvoir expliquer leur méthode en cinq minutes.', 'Organisez les visites de sites demandées.', 'Faites un point hebdomadaire avec l\'auditeur pendant la revue finale.'],
    'Pendant la revue finale de trois semaines, le coordinateur reçoit 42 demandes ; 38 sont traitées en moins de 48 heures grâce aux dossiers de preuve déjà prêts. Les 4 autres concernent le scope 3 et donnent lieu à une réunion avec le responsable achats.',
    'demandes', 'Tableau de suivi des demandes de l\'auditeur (Excel)'],
  ['reco', 'Traiter les constats et conclure', 'Corriger ce qui doit l\'être, expliquer le reste, et améliorer le processus pour l\'année suivante.',
    ['Classez chaque constat de l\'auditeur : anomalie à corriger dans le rapport, faiblesse de contrôle interne, simple observation.', 'Pour chaque constat : cause, action corrective, responsable, échéance.', 'Corrigez les chiffres concernés et mettez à jour les dossiers de preuve.', 'Signez la lettre d\'affirmation demandée par l\'auditeur, dans laquelle la direction confirme avoir fourni toutes les informations.', 'Présentez les conclusions au comité d\'audit et intégrez les actions dans le plan de l\'année suivante.'],
    'Constat : « Les intérimaires ne sont pas inclus dans les heures travaillées utilisées pour le taux de fréquence. » Classement : anomalie. Action : intégrer les heures transmises par les agences d\'intérim. Responsable : responsable paie. Échéance : avant arrêté du rapport. Résultat : taux de fréquence corrigé de 12,4 à 11,8.',
    'suivi', 'Tableau de suivi des recommandations et lettre d\'affirmation (Excel et Word)']
];
const AU_TECH = [
  ['Entretien', 'Comprendre le processus et repérer les risques en interrogeant les personnes qui produisent les données.', 'Préparez 5 à 10 questions : d\'où vient la donnée, qui la saisit, qui la contrôle, ce qui a changé cette année, les difficultés rencontrées. Notez les réponses et les documents cités, puis vérifiez-les.', 'Au responsable des achats : « Comment identifiez-vous les fournisseurs évalués ? Montrez-moi la liste et deux évaluations. »'],
  ['Revue analytique', 'Repérer les chiffres anormaux en les comparant à l\'an dernier, aux budgets ou à d\'autres données.', 'Calculez la variation de chaque indicateur par rapport à l\'année précédente. Toute variation au-delà d\'un seuil fixé à l\'avance (par exemple 10 %) doit être expliquée et justifiée par un document. Comparez aussi des ratios entre eux (énergie par salarié, déchets par tonne produite).', 'Consommation d\'eau : +38 % alors que la production est stable. Explication obtenue : une fuite réparée en mars, attestée par la facture du plombier et les relevés mensuels.'],
  ['Recalcul', 'Refaire le calcul de manière indépendante pour vérifier le chiffre publié.', 'Repartez des données sources et de la formule du protocole. Comparez votre résultat avec le chiffre publié et calculez l\'écart en pourcentage. Si l\'écart dépasse le seuil de signification, c\'est une anomalie.', 'Scope 2 recalculé : 4 812 MWh × 0,052 kgCO₂e/kWh (facteur du protocole) = 250 tCO₂e. Chiffre publié : 251 tCO₂e. Écart de 0,4 % : conforme.'],
  ['Rapprochement avec les pièces', 'Vérifier que les données utilisées existent et sont exactes, en remontant jusqu\'aux documents d\'origine.', 'Dans les deux sens : partez de lignes du fichier de calcul et retrouvez la pièce (facture, déclaration, feuille d\'émargement) ; puis partez de pièces et vérifiez qu\'elles sont bien dans le fichier. Le second sens détecte les oublis.', 'Sur 15 factures d\'énergie tirées au hasard, 15 retrouvées et conformes. Sur 5 factures prises dans la comptabilité, 1 absente du fichier de calcul : un compteur d\'un entrepôt oublié.'],
  ['Échantillonnage', 'Tester une partie représentative d\'une population trop grande pour être vérifiée en entier.', 'Définissez la population (toutes les lignes du fichier), tirez les éléments au hasard avec l\'outil ci-dessous, et adaptez la taille au risque : plus le risque est élevé, plus l\'échantillon est grand. Conservez la liste tirée dans les papiers de travail.', 'Population : 860 lignes de déplacements professionnels. Risque moyen : 25 lignes tirées au hasard, 1 anomalie de faible montant.'],
  ['Observation et visite de site', 'Constater sur place que ce qui est déclaré existe.', 'Choisissez les sites selon leur poids et leur risque. Vérifiez les compteurs, les registres, les affichages, les équipements, et interrogez le personnel du site.', 'Visite de l\'usine principale : relevé du compteur de gaz comparé à la dernière facture, consultation du registre des déchets dangereux, entretien avec le responsable sécurité.'],
  ['Revue de la double matérialité', 'Vérifier que le processus qui a conduit à choisir les enjeux publiés est documenté et cohérent.', 'Contrôlez la méthode (critères, échelles, seuils), la consultation des parties prenantes, la cohérence avec le secteur et les risques connus, et la validation par la gouvernance. Cherchez les enjeux qui auraient dû être retenus.', 'Une entreprise de transport n\'a pas retenu la pollution de l\'air (E2) : l\'auditeur demande la justification, compte tenu de la flotte de camions diesel.']
];
const AU_TYPES = [
  ['csrd', 'Certification du rapport de durabilité (assurance limitée)', [['Acceptation', ['Vérifier l\'indépendance et l\'absence de mission de conseil incompatible', 'Signer la lettre de mission']], ['Prise de connaissance', ['Comprendre l\'activité, la chaîne de valeur et l\'organisation du reporting', 'Lire le protocole de reporting et le rapport de l\'an dernier']], ['Double matérialité', ['Revoir la méthode, les seuils et la consultation des parties prenantes', 'Vérifier la cohérence des enjeux retenus avec le secteur']], ['Évaluation des risques', ['Identifier les points de données les plus risqués', 'Fixer le seuil de signification et le plan d\'échantillonnage']], ['Procédures', ['Entretiens avec les contributeurs', 'Revue analytique de tous les indicateurs', 'Recalcul et rapprochement des indicateurs à risque', 'Visites de sites sélectionnés', 'Vérification de la taxonomie et des informations narratives']], ['Conclusion', ['Synthétiser les anomalies non corrigées', 'Obtenir la lettre d\'affirmation', 'Rédiger le rapport de certification']]]],
  ['interne', 'Audit interne de la démarche RSE', [['Préparation', ['Définir le périmètre et les objectifs', 'Rassembler politique, plan d\'action et indicateurs']], ['Gouvernance', ['Vérifier le rôle de la direction et du comité RSE', 'Revoir les comptes rendus et les décisions']], ['Processus', ['Tester la collecte des indicateurs', 'Vérifier l\'avancement réel des actions', 'Contrôler la gestion des obligations réglementaires']], ['Conclusion', ['Rédiger les constats et recommandations', 'Restituer à la direction']]]],
  ['label', 'Pré-audit d\'un label ou d\'une certification', [['Référentiel', ['Lister les exigences du label (Engagé RSE, B Corp, ISO 14001…)', 'Repérer les preuves attendues pour chacune']], ['Évaluation', ['Noter chaque exigence : satisfaite, partielle, absente', 'Rassembler les preuves existantes']], ['Plan', ['Prioriser les écarts', 'Établir le plan d\'action avant l\'audit officiel']]]],
  ['ges', 'Vérification d\'un bilan des émissions de gaz à effet de serre', [['Périmètre', ['Contrôler le périmètre organisationnel et opérationnel', 'Vérifier l\'année de référence']], ['Données', ['Rapprocher les données d\'activité avec les factures', 'Vérifier les facteurs d\'émission utilisés']], ['Calcul', ['Recalculer les postes principaux', 'Analyser les incertitudes et les exclusions']], ['Conclusion', ['Rédiger les constats', 'Vérifier le plan de transition associé']]]],
  ['fournisseur', 'Audit RSE d\'un fournisseur (vigilance)', [['Préparation', ['Envoyer le questionnaire préalable', 'Définir les thèmes : travail, santé-sécurité, environnement, éthique']], ['Sur site', ['Visiter les ateliers et les locaux sociaux', 'Interroger des salariés sans la direction', 'Vérifier registres, contrats, fiches de paie, autorisations']], ['Conclusion', ['Classer les non-conformités', 'Convenir d\'un plan d\'actions correctives et d\'une date de suivi']]]]
];
const AA = {d: null, tab: 'prep', open: 'lancement', ech: null};
async function auInit(){ try { AA.d = IDB.db && await IDB.get('kv', 'audit'); } catch(e) {} if (!AA.d) AA.d = {id: 'audit', type: 'csrd', client: '', exercice: String(new Date().getFullYear() - 1), seuil: 5, prog: {}, tests: [], constats: []}; renderAudit(); }
const auSave = () => IDB.put('kv', AA.d).catch(() => {});
const n2 = v => { const x = parseFloat(String(v).replace(/\s/g, '').replace(',', '.')); return isNaN(x) ? null : x; };
function auEcart(t){ const p = n2(t.pub), r = n2(t.rec); if (p == null || r == null || !p) return null; return Math.round((r - p) / Math.abs(p) * 1000) / 10; }
function auConcl(t){ const e = auEcart(t), an = +t.anom || 0; if (e == null && !t.ech) return ['', 'À compléter']; if ((e != null && Math.abs(e) > AA.d.seuil) || an >= 2) return ['r', 'Anomalie significative']; if ((e != null && Math.abs(e) > 0) || an === 1) return ['o', 'Écart non significatif']; return ['ok', 'Conforme']; }
async function auModele(m){
  if (m === 'kickoff') return downloadDoc('<h1>Réunion de lancement de l\'audit du rapport de durabilité</h1><p style="text-align:center">[Entreprise] · Exercice [année] · [date]</p><h2>Participants</h2><p>Direction financière, responsable RSE, coordinateur de l\'audit, responsables des principaux indicateurs (RH, achats, énergie, sites), équipe de l\'auditeur.</p><h2>Ordre du jour</h2><ol><li>Présentation des équipes et des interlocuteurs de chaque côté.</li><li>Périmètre : sociétés et sites inclus, changements depuis l\'an dernier.</li><li>Résultats de la double matérialité : enjeux retenus, méthode, seuils.</li><li>Liste des points de données publiés et indicateurs jugés sensibles.</li><li>Protocole de reporting : remise et questions.</li><li>Calendrier : revue intermédiaire, clôture, revue finale, arrêté du rapport.</li><li>Organisation des échanges : coordinateur, outil de partage, délai de réponse.</li><li>Visites de sites envisagées.</li><li>Points d\'attention de l\'auditeur et de l\'entreprise.</li></ol><h2>Points à vérifier dans la lettre de mission</h2><ul><li>Périmètre et niveau d\'assurance.</li><li>Calendrier et livrables.</li><li>Documents et accès à fournir.</li><li>Honoraires et conditions.</li></ul><h2>Décisions et actions</h2><table border="1" cellpadding="5" style="border-collapse:collapse;width:100%"><tr><th>Action</th><th>Responsable</th><th>Échéance</th></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>', 'Reunion de lancement audit');
  if (m === 'protocole') return downloadDoc('<h1>Protocole de reporting de durabilité</h1><p style="text-align:center">[Entreprise] · Exercice [année] · Version [n] du [date]</p><h2>1. Partie générale</h2><p><b>Périmètre :</b> [sociétés consolidées, sites, exclusions et justification].</p><p><b>Période :</b> du [date] au [date].</p><p><b>Organisation :</b> coordinateur [nom], contributeurs par site et par thème (voir annexe).</p><p><b>Calendrier :</b> collecte du [date] au [date], contrôles, validation, transmission à l\'auditeur.</p><p><b>Règles d\'estimation :</b> en cas de donnée manquante, [méthode, par exemple extrapolation à partir des mois connus], signalée dans le rapport.</p><p><b>Changements de méthode :</b> [décrire et chiffrer l\'effet].</p><h2>2. Fiches indicateurs</h2><h3>Exemple rempli : taux de fréquence des accidents du travail (ESRS S1-14)</h3><table border="1" cellpadding="5" style="border-collapse:collapse;width:100%"><tr><td><b>Définition</b></td><td>Nombre d\'accidents du travail avec arrêt d\'au moins un jour, rapporté au nombre d\'heures travaillées.</td></tr><tr><td><b>Formule</b></td><td>Accidents avec arrêt × 1 000 000 ÷ heures travaillées</td></tr><tr><td><b>Unité</b></td><td>Nombre par million d\'heures</td></tr><tr><td><b>Sources</b></td><td>Déclarations d\'accident du travail ; heures travaillées issues du logiciel de paie</td></tr><tr><td><b>Périmètre</b></td><td>Salariés en contrat de travail de toutes les sociétés consolidées ; intérimaires suivis séparément</td></tr><tr><td><b>Responsable</b></td><td>Responsable santé-sécurité de chaque site ; consolidation par la direction des ressources humaines</td></tr><tr><td><b>Contrôles</b></td><td>Rapprochement trimestriel entre déclarations et registre ; revue de la variation annuelle</td></tr><tr><td><b>Donnée manquante</b></td><td>Heures estimées à partir de l\'effectif moyen × durée contractuelle, signalé en note</td></tr></table><h3>Fiche à compléter</h3><table border="1" cellpadding="5" style="border-collapse:collapse;width:100%">' + ['Indicateur et code ESRS', 'Définition', 'Formule', 'Unité', 'Sources', 'Périmètre', 'Responsable', 'Contrôles', 'Donnée manquante'].map(x => '<tr><td><b>' + x + '</b></td><td></td></tr>').join('') + '</table>', 'Protocole de reporting');
  if (m === 'preuve') return atXlsx('Dossier de preuve - indicateur', [['Fiche indicateur', [{Rubrique: 'Indicateur', Contenu: 'Consommation d\'électricité (ESRS E1-5)'}, {Rubrique: 'Formule', Contenu: 'Somme des kWh facturés sur 12 mois, tous sites, convertie en MWh'}, {Rubrique: 'Sources', Contenu: 'Factures du fournisseur d\'électricité'}, {Rubrique: 'Responsable', Contenu: 'Responsable des services généraux'}, {Rubrique: 'Chiffre publié (MWh)', Contenu: 4812}]], ['Données sources', ['Lyon', 'Villeurbanne', 'Vénissieux'].flatMap((s, i) => ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'].map((mo, j) => ({Site: s, Mois: mo, 'N° de facture': 'F' + (i + 1) + String(j + 1).padStart(2, '0'), 'kWh facturés': [180000, 118000, 100000][i] + (j % 3) * 1000, 'Pièce rangée': 'Oui'})))], ['Calcul', [{Étape: 'Total des kWh (somme de l\'onglet Données sources)', Valeur: 4812000}, {Étape: 'Conversion en MWh (÷ 1 000)', Valeur: 4812}, {Étape: 'Chiffre publié', Valeur: 4812}, {Étape: 'Écart', Valeur: 0}]], ['Contrôles', [{Contrôle: 'Comparaison avec l\'année précédente', Résultat: 'N-1 : 4 950 MWh, soit -2,8 %', Commentaire: 'Passage aux éclairages LED à Lyon'}, {Contrôle: 'Exhaustivité : 12 factures par site', Résultat: '36 sur 36', Commentaire: ''}, {Contrôle: 'Rapprochement avec la comptabilité (compte 6061)', Résultat: 'Montants concordants', Commentaire: ''}]], ['Validation', [{Rôle: 'Responsable de la donnée', Nom: '', Date: '', Mode: 'Courriel ou signature'}, {Rôle: 'Coordinateur du reporting', Nom: '', Date: '', Mode: ''}]]]);
  if (m === 'test') return atXlsx('Fiche de test de pre-audit', [['Fiche de test', [{Rubrique: 'Indicateur testé', Contenu: 'Heures de formation (ESRS S1-13)'}, {Rubrique: 'Période', Contenu: '1er janvier au 30 juin'}, {Rubrique: 'Valeur testée', Contenu: 2140}, {Rubrique: 'Tests réalisés', Contenu: 'Recalcul ; rapprochement de 10 formations tirées au hasard avec les feuilles d\'émargement ; comparaison avec N-1'}, {Rubrique: 'Résultat', Contenu: '2 formations comptées deux fois (sessions reportées) : 28 heures'}, {Rubrique: 'Écart', Contenu: '1,3 %'}, {Rubrique: 'Cause', Contenu: 'Sessions reportées non supprimées dans le tableau RH'}, {Rubrique: 'Correction du processus', Contenu: 'Le logiciel de formation devient la seule source ; suppression des sessions reportées avant extraction'}, {Rubrique: 'Responsable et date', Contenu: ''}]], ['Échantillon', Array.from({length: 10}, (_, i) => ({'N°': i + 1, Formation: '', 'Heures déclarées': '', 'Heures selon émargement': '', Conforme: ''}))]]);
  if (m === 'demandes') return atXlsx('Suivi des demandes de l\'auditeur', [['Demandes', [{'N°': 1, Date: '', Demande: 'Dossier de preuve énergie, tous sites', Demandeur: '', 'Responsable interne': 'Services généraux', 'Date de réponse': '', Statut: 'Envoyé'}, {'N°': 2, Date: '', Demande: 'Entretien avec le responsable achats sur le scope 3', Demandeur: '', 'Responsable interne': 'Achats', 'Date de réponse': '', Statut: 'Planifié'}]]]);
  if (m === 'suivi') { await atXlsx('Suivi des recommandations', [['Recommandations', [{'N°': 1, Constat: 'Intérimaires exclus des heures travaillées du taux de fréquence', Type: 'Anomalie', Cause: 'Données des agences non collectées', 'Action corrective': 'Intégrer les heures transmises par les agences', Responsable: 'Responsable paie', Échéance: '', Statut: 'Fait'}, {'N°': 2, Constat: 'Pas de revue par un second niveau pour les déchets', Type: 'Faiblesse de contrôle', Cause: '', 'Action corrective': 'Validation par le responsable HSE avant consolidation', Responsable: '', Échéance: '', Statut: 'En cours'}]]]); return downloadDoc('<h1>Lettre d\'affirmation de la direction</h1><p style="text-align:center">Modèle indicatif : utilisez celui fourni par votre auditeur</p><p>[Lieu], le [date]</p><p>À l\'attention de [vérificateur]</p><p style="text-align:justify">Dans le cadre de votre mission de certification des informations en matière de durabilité de [entreprise] pour l\'exercice clos le [date], nous confirmons, à notre connaissance :</p><ul><li>que nous sommes responsables de l\'établissement des informations en matière de durabilité, y compris du processus de double matérialité ;</li><li>que nous vous avons fourni toutes les informations et tous les accès nécessaires ;</li><li>que les anomalies non corrigées que vous nous avez signalées sont, isolément ou cumulées, sans incidence significative ;</li><li>que nous vous avons informés de tout événement postérieur pouvant affecter les informations publiées.</li></ul><p style="text-align:right">[Nom et fonction du dirigeant]<br>Signature</p>', 'Lettre d affirmation');
  }
}
function tirage(N, n){ const s = new Set(); n = Math.min(n, N); while (s.size < n) s.add(1 + Math.floor(Math.random() * N)); return [...s].sort((a, b) => a - b); }
function renderAudit(){
  const el = document.getElementById('auRoot'); if (!el || !AA.d) return;
  const sub = route().base === 'audit' ? route().sub : null; if (sub && ['prep', 'auditeur', 'techniques', 'cadre'].includes(sub)) AA.tab = sub;
  const d = AA.d;
  let h = '<div class="eyebrow">AGIR · AUDIT ET VÉRIFICATION</div><h2>Audit et vérification</h2><p class="lead">Tout ce qu\'il faut pour réussir un audit RSE, des deux côtés de la table. L\'entreprise auditée y trouve chaque étape expliquée, avec un exemple concret et le modèle à remplir. L\'auditeur, qu\'il certifie un rapport de durabilité, conduise un audit interne ou un pré-audit de label, y trouve son programme de travail, ses feuilles de test, un outil d\'échantillonnage et le suivi de ses constats.</p>';
  h += '<div class="ptabs">' + [['prep', 'Je suis audité', '6 étapes et leurs modèles', ICO.doc], ['auditeur', 'Je suis auditeur', 'Ma mission pas à pas', ICO.radar], ['techniques', 'Techniques d\'audit', '7 techniques expliquées', ICO.book], ['cadre', 'Qui peut auditer ?', 'Le cadre légal', ICO.flag]].map(([k, t, s, ic]) => '<a class="ptab' + (AA.tab === k ? ' on' : '') + '" href="#audit--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (AA.tab === 'prep') {
    h += '<p class="prose">Suivez les étapes dans l\'ordre. Pour chacune : ce qu\'il faut faire, comment le faire, un exemple réel de résultat, et le modèle prêt à remplir.</p><ol class="dzsteps">' + AU_PREP.map(([id, t, obj, cm, ex, mod, ml], i) => { const op = AA.open === id; return '<li class="dzs' + (op ? ' open' : '') + '"><button class="dzh" data-au="open" data-k="' + id + '" aria-expanded="' + op + '"><span class="dzn">' + (i + 1) + '</span><span class="dzt"><strong>' + t + '</strong><small>' + obj + '</small></span></button>' + (op ? '<div class="dzb"><h5>Comment faire</h5><ol>' + cm.map(x => '<li>' + x + '</li>').join('') + '</ol><div class="exbox"><strong>Exemple</strong><p>' + ex + '</p></div><div class="ctool"><button class="btn" data-au="mod" data-k="' + mod + '">' + ml + '</button>' + (id === 'preaudit' ? '<a class="btn ghost" href="#audit--techniques">Les techniques de test →</a>' : '') + (id === 'protocole' ? '<a class="btn ghost" href="#atelier--collecte">Suivi de la collecte →</a>' : '') + '</div></div>' : '') + '</li>'; }).join('') + '</ol><p><a class="btn ghost sm" href="#atelier--audit">Rétroplanning et liste « Prêt pour l\'audit » →</a></p>';
  } else if (AA.tab === 'auditeur') {
    const T = AU_TYPES.find(x => x[0] === d.type) || AU_TYPES[0], tot = T[2].reduce((s, p) => s + p[1].length, 0), fait = T[2].reduce((s, p, i) => s + p[1].filter((x, j) => d.prog[d.type + i + '-' + j]).length, 0);
    h += '<div class="card"><h4>Ma mission</h4><div class="grid two" style="gap:0 14px"><div class="row"><label>Type de mission<select class="inp" data-auf="type">' + AU_TYPES.map(x => '<option value="' + x[0] + '"' + (d.type === x[0] ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select></label></div><div class="row"><label>Entité auditée<input class="inp" data-auf="client" value="' + esc(d.client) + '"></label></div><div class="row"><label>Exercice ou période<input class="inp" data-auf="exercice" value="' + esc(d.exercice) + '"></label></div><div class="row"><label>Seuil de signification (écart en %)<input class="inp" type="number" min="0" step="0.5" data-auf="seuil" value="' + d.seuil + '"></label></div></div><div class="ctool"><button class="btn" data-au="wp">Papiers de travail (Excel)</button><button class="btn ghost" data-au="synth">Note de synthèse (Word)</button><button class="btn ghost" data-au="rapport">Trame de rapport (Word)</button></div></div>';
    h += '<h3>1. Programme de travail <span class="pill">' + fait + ' / ' + tot + '</span></h3><div class="mes">' + T[2].map(([ph, L], i) => '<div class="card"><h4>' + ph + '</h4>' + L.map((x, j) => { const k = d.type + i + '-' + j; return '<label class="pub' + (d.prog[k] ? ' ok' : '') + '"><input type="checkbox" data-au="prog" data-k="' + k + '"' + (d.prog[k] ? ' checked' : '') + '><span>' + esc(x) + '</span></label>'; }).join('') + '</div>').join('') + '</div>';
    h += '<h3>2. Feuilles de test</h3><p class="prose">Une ligne par indicateur testé. Saisissez la valeur publiée et votre recalcul : l\'écart et la conclusion se calculent selon votre seuil de signification. Indiquez aussi le résultat de l\'échantillon.</p>' + (d.tests.length ? '<div class="tablewrap"><table class="autab"><thead><tr><th>Indicateur</th><th>Valeur publiée</th><th>Recalcul</th><th>Écart</th><th>Échantillon testé</th><th>Anomalies</th><th>Conclusion</th><th>Commentaire</th><th></th></tr></thead><tbody>' + d.tests.map((t, i) => { const e = auEcart(t), c = auConcl(t); return '<tr><td><input class="kin" data-aut="' + i + '" data-k="ind" value="' + esc(t.ind) + '"></td><td><input class="kin" data-aut="' + i + '" data-k="pub" value="' + esc(t.pub) + '"></td><td><input class="kin" data-aut="' + i + '" data-k="rec" value="' + esc(t.rec) + '"></td><td class="num">' + (e == null ? '–' : (e > 0 ? '+' : '') + vf(e) + ' %') + '</td><td><input class="kin" data-aut="' + i + '" data-k="ech" value="' + esc(t.ech) + '" placeholder="ex. 15"></td><td><input class="kin" data-aut="' + i + '" data-k="anom" value="' + esc(t.anom) + '" placeholder="0"></td><td><span class="pill ' + (c[0] === 'r' ? 'r' : c[0] === 'o' ? 'o' : c[0] === 'ok' ? '' : 'g') + '">' + c[1] + '</span></td><td><input class="kin" data-aut="' + i + '" data-k="com" value="' + esc(t.com) + '"></td><td><button class="linkbtn" style="color:var(--danger)" data-au="deltest" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>'; }).join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost" data-au="addtest">+ Ajouter un indicateur testé</button>' + (d.tests.length ? '' : '<button class="btn ghost" data-au="demo">Charger un exemple</button>') + '</div>';
    h += '<h3>3. Tirage d\'un échantillon</h3><div class="card"><div class="locform"><label>Nombre d\'éléments de la population<input class="inp" type="number" min="1" id="auN" placeholder="ex. 860"></label><label>Taille de l\'échantillon<input class="inp" type="number" min="1" id="auS" placeholder="ex. 25"></label><button class="btn" data-au="tirer">Tirer au hasard</button></div>' + (AA.ech ? '<p><strong>Lignes à tester :</strong> ' + AA.ech.join(', ') + '</p><button class="btn ghost sm" data-au="copyech">Copier la liste</button>' : '') + '<p class="note">Repères usuels, à ajuster selon votre jugement et votre méthodologie : risque faible, une dizaine d\'éléments ; risque moyen, une vingtaine ; risque élevé, 40 ou plus, ou un test complet si la population est petite.</p></div>';
    h += '<h3>4. Constats</h3>' + (d.constats.length ? '<div class="tablewrap"><table><thead><tr><th>Constat</th><th>Gravité</th><th>Recommandation</th><th>Réponse de l\'entité</th><th></th></tr></thead><tbody>' + d.constats.map((c, i) => '<tr><td>' + esc(c.c) + '</td><td><span class="pill ' + (c.g === 'Majeur' ? 'r' : c.g === 'Mineur' ? 'o' : 'g') + '">' + esc(c.g) + '</span></td><td>' + esc(c.r) + '</td><td>' + esc(c.rep || '') + '</td><td><button class="linkbtn" style="color:var(--danger)" data-au="delc" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '<p class="note">Aucun constat pour l\'instant.</p>') + '<div class="ctool"><button class="btn ghost" data-au="addc">+ Ajouter un constat</button></div>';
  } else if (AA.tab === 'techniques') {
    h += '<p class="prose">Les procédures qu\'utilise tout auditeur, et que l\'entreprise peut appliquer elle-même lors de son pré-audit. Pour chacune : à quoi elle sert, comment la conduire, un exemple.</p><div class="svgrid">' + AU_TECH.map(([t, a, c, ex]) => '<div class="card"><h4>' + t + '</h4><p class="note">' + a + '</p><h5 class="h5c">Comment faire</h5><p>' + c + '</p><div class="exbox"><strong>Exemple</strong><p>' + ex + '</p></div></div>').join('') + '</div>';
  } else {
    h += '<div class="grid two"><div class="card"><h4>Qui certifie le rapport de durabilité ?</h4><p>En France, la certification des informations en matière de durabilité est confiée soit à un commissaire aux comptes, soit à un organisme tiers indépendant accrédité par le COFRAC. Dans les deux cas, le professionnel doit être inscrit sur une liste tenue par la H2A (Haute autorité de l\'audit). Il est nommé par l\'assemblée générale.</p><p>La mission repose sur une assurance limitée : le vérificateur conclut qu\'il n\'a pas relevé d\'élément remettant en cause la conformité des informations. Une norme européenne d\'assurance limitée est attendue au plus tard le 1er juillet 2027 ; en attendant, les professionnels s\'appuient sur les lignes directrices de la H2A.</p><a class="btn ghost sm" href="https://h2a-france.org" target="_blank" rel="noopener">Site de la H2A →</a></div>'
      + '<div class="card"><h4>Devenir auditeur de durabilité</h4><ul><li><strong>Commissaire aux comptes :</strong> inscription auprès de la H2A et formation spécifique à la durabilité.</li><li><strong>Au sein d\'un organisme tiers indépendant :</strong> la structure doit être accréditée par le COFRAC selon la norme ISO/IEC 17029 ; l\'auditeur suit le parcours fixé par les textes, avec une épreuve sur la mission de certification.</li><li>Les autres audits RSE (audit interne, pré-audit de label, audit fournisseur, vérification d\'un bilan carbone volontaire) ne demandent pas d\'agrément particulier, mais une méthode rigoureuse et l\'indépendance vis-à-vis de ce qui est audité.</li></ul></div>'
      + '<div class="card"><h4>Les autres audits et vérifications</h4><ul><li><strong>Certifications ISO</strong> (14001, 45001, 50001) : audit par un organisme certificateur accrédité.</li><li><strong>Label Engagé RSE</strong> : évaluation sur site par AFNOR Certification.</li><li><strong>B Corp</strong> : vérification par B Lab.</li><li><strong>EcoVadis</strong> : analyse documentaire des preuves par des analystes.</li><li><strong>Audits fournisseurs</strong> : référentiels sectoriels (SMETA, amfori BSCI…) ou grille propre.</li></ul><a class="btn ghost sm" href="#terrain--audit-iso14001">Guide : réussir un audit ISO 14001 →</a></div>'
      + '<div class="card"><h4>Les qualités d\'un bon audit</h4><ul><li><strong>Indépendance :</strong> on n\'audite pas ce qu\'on a conseillé ou produit.</li><li><strong>Preuves :</strong> chaque conclusion repose sur un document conservé dans les papiers de travail.</li><li><strong>Scepticisme :</strong> une explication se vérifie.</li><li><strong>Traçabilité :</strong> un autre auditeur doit pouvoir refaire le travail à partir des papiers.</li></ul></div></div>';
  }
  el.innerHTML = h;
}
function auWpRows(){ const d = AA.d, T = AU_TYPES.find(x => x[0] === d.type) || AU_TYPES[0]; return [['Programme', T[2].flatMap(([ph, L], i) => L.map((x, j) => ({Phase: ph, Procédure: x, Réalisé: d.prog[d.type + i + '-' + j] ? 'Oui' : 'Non', Référence: '', Commentaire: ''})))], ['Tests', d.tests.map(t => ({Indicateur: t.ind, 'Valeur publiée': t.pub, Recalcul: t.rec, 'Écart (%)': auEcart(t) ?? '', 'Échantillon testé': t.ech, Anomalies: t.anom, Conclusion: auConcl(t)[1], Commentaire: t.com}))], ['Constats', d.constats.map((c, i) => ({'N°': i + 1, Constat: c.c, Gravité: c.g, Recommandation: c.r, 'Réponse de l\'entité': c.rep || ''}))], ['Mission', [{Rubrique: 'Type', Valeur: T[1]}, {Rubrique: 'Entité', Valeur: d.client}, {Rubrique: 'Exercice', Valeur: d.exercice}, {Rubrique: 'Seuil de signification (%)', Valeur: d.seuil}]]]; }
const auRoot = document.getElementById('auRoot');
auRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-au]'); if (!b || b.tagName === 'INPUT') return; const a = b.dataset.au, d = AA.d;
  try {
    if (a === 'open') { AA.open = AA.open === b.dataset.k ? '' : b.dataset.k; renderAudit(); const li = auRoot.querySelector('.dzs.open'); if (li) li.scrollIntoView({block: 'nearest', behavior: 'smooth'}); }
    else if (a === 'mod') { await auModele(b.dataset.k); toast('Modèle téléchargé'); }
    else if (a === 'addtest') { d.tests.push({ind: '', pub: '', rec: '', ech: '', anom: '', com: ''}); await auSave(); renderAudit(); }
    else if (a === 'demo') { d.tests = [{ind: 'Consommation d\'électricité (MWh)', pub: '4812', rec: '4806', ech: '15', anom: '0', com: 'Factures rapprochées'}, {ind: 'Taux de fréquence', pub: '12,4', rec: '11,8', ech: '20', anom: '2', com: 'Intérimaires exclus des heures'}, {ind: 'Heures de formation', pub: '4310', rec: '4282', ech: '10', anom: '1', com: 'Doublon de session'}]; d.constats = [{c: 'Les intérimaires ne sont pas inclus dans les heures travaillées du taux de fréquence.', g: 'Majeur', r: 'Intégrer les heures transmises par les agences d\'intérim.', rep: 'Corrigé avant arrêté du rapport.'}]; await auSave(); renderAudit(); }
    else if (a === 'deltest') { d.tests.splice(+b.dataset.i, 1); await auSave(); renderAudit(); }
    else if (a === 'tirer') { const N = parseInt(document.getElementById('auN').value), n = parseInt(document.getElementById('auS').value); if (!(N > 0 && n > 0)) { toast('Indiquez la population et la taille'); return; } AA.ech = tirage(N, n); renderAudit(); }
    else if (a === 'copyech') { try { await navigator.clipboard.writeText(AA.ech.join(', ')); toast('Liste copiée'); } catch(err) { toast('Sélectionnez la liste pour la copier'); } }
    else if (a === 'addc') modal('Ajouter un constat', '<div class="row"><label>Constat<textarea class="inp" rows="3" id="cC"></textarea></label></div><div class="row"><label>Gravité<select class="inp" id="cG"><option>Majeur</option><option>Mineur</option><option>Observation</option></select></label></div><div class="row"><label>Recommandation<textarea class="inp" rows="2" id="cR"></textarea></label></div><div class="row"><label>Réponse de l\'entité (facultatif)<textarea class="inp" rows="2" id="cP"></textarea></label></div>', 'Ajouter', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('cC')) return false; d.constats.push({c: v('cC'), g: v('cG'), r: v('cR'), rep: v('cP')}); await auSave(); renderAudit(); });
    else if (a === 'delc') { d.constats.splice(+b.dataset.i, 1); await auSave(); renderAudit(); }
    else if (a === 'wp') await atXlsx('Papiers de travail - ' + (d.client || 'mission'), auWpRows());
    else if (a === 'synth') { const T = AU_TYPES.find(x => x[0] === d.type); const sig = d.tests.filter(t => auConcl(t)[0] === 'r'); downloadDoc('<h1>Note de synthèse de mission</h1><p style="text-align:center">' + esc(T[1]) + ' · ' + esc(d.client || '[entité]') + ' · ' + esc(d.exercice) + '</p><h2>Travaux réalisés</h2><ul>' + T[2].map(([ph, L], i) => '<li><b>' + ph + ' :</b> ' + L.filter((x, j) => d.prog[d.type + i + '-' + j]).length + ' procédure(s) réalisée(s) sur ' + L.length + '.</li>').join('') + '</ul><h2>Tests sur les indicateurs</h2><p>' + d.tests.length + ' indicateur(s) testé(s), seuil de signification de ' + d.seuil + ' %. ' + sig.length + ' anomalie(s) significative(s).</p><table border="1" cellpadding="5" style="border-collapse:collapse;width:100%"><tr><th>Indicateur</th><th>Publié</th><th>Recalcul</th><th>Écart</th><th>Conclusion</th></tr>' + d.tests.map(t => '<tr><td>' + esc(t.ind) + '</td><td>' + esc(t.pub) + '</td><td>' + esc(t.rec) + '</td><td>' + (auEcart(t) == null ? '' : vf(auEcart(t)) + ' %') + '</td><td>' + auConcl(t)[1] + '</td></tr>').join('') + '</table><h2>Constats</h2><ol>' + d.constats.map(c => '<li><b>' + esc(c.g) + ' :</b> ' + esc(c.c) + ' <i>Recommandation :</i> ' + esc(c.r) + (c.rep ? ' <i>Réponse :</i> ' + esc(c.rep) : '') + '</li>').join('') + '</ol>', 'Note de synthese audit'); toast('Note téléchargée'); }
    else if (a === 'rapport') { downloadDoc('<h1>Trame de rapport d\'audit</h1><p style="text-align:center">Trame indicative à adapter au référentiel de la mission. Pour la certification d\'un rapport de durabilité, utilisez la formulation prévue par les textes et les lignes directrices de la H2A.</p><h2>1. Objet et périmètre</h2><p>[Entité, exercice, informations couvertes, référentiel (ESRS, label, norme).]</p><h2>2. Responsabilités</h2><p>[Responsabilité de la direction dans l\'établissement des informations ; responsabilité de l\'auditeur dans l\'expression de sa conclusion.]</p><h2>3. Indépendance</h2><p>[Déclaration d\'indépendance et absence de mission incompatible.]</p><h2>4. Nature et étendue des travaux</h2><p>[Procédures mises en œuvre : entretiens, revue analytique, recalculs, rapprochements, visites de sites, échantillons.]</p><h2>5. Conclusion</h2><p>[Conclusion selon le niveau d\'assurance retenu.]</p><h2>6. Observations</h2><p>[Points d\'attention sans incidence sur la conclusion.]</p><p style="text-align:right">[Lieu, date, signature]</p>', 'Trame de rapport d audit'); toast('Trame téléchargée'); }
  } catch(err) { toast('Opération impossible'); }
});
auRoot.addEventListener('change', async e => {
  const t = e.target, d = AA.d;
  if (t.dataset.auf) { d[t.dataset.auf] = t.dataset.auf === 'seuil' ? Math.max(0, +t.value || 0) : t.value; await auSave(); const y = window.scrollY; renderAudit(); window.scrollTo(0, y); }
  else if (t.dataset.aut != null) { d.tests[+t.dataset.aut][t.dataset.k] = t.value; await auSave(); const y = window.scrollY; renderAudit(); window.scrollTo(0, y); }
  else if (t.dataset.au === 'prog') { d.prog[t.dataset.k] = t.checked; await auSave(); const y = window.scrollY; renderAudit(); window.scrollTo(0, y); }
});
window.addEventListener('hashchange', () => { if (route().base === 'audit') renderAudit(); });
espaceReady.then(auInit, auInit);

/* =====================================================================
   MÉTHODES : MODE OPÉRATOIRE ET EXEMPLE POUR CHAQUE ÉTAPE
   ===================================================================== */
const METH_DET = [
  {outils: [['#diagnostic', 'Autodiagnostic RSE'], ['#outils', 'Suis-je concerné ?'], ['#demarrer', 'Démarrer la RSE de zéro']], d: [
    ['Ouvrez l\'outil « Suis-je concerné ? », saisissez l\'effectif, le chiffre d\'affaires et le total du bilan, puis notez chaque obligation avec son échéance dans un tableau à trois colonnes : obligation, échéance, état actuel.', 'Une PME de 120 salariés découvre qu\'elle doit publier son index de l\'égalité chaque 1er mars et qu\'elle est concernée par le décret tertiaire pour son siège de 1 400 m².'],
    ['Demandez à chaque service ses documents existants et rangez-les dans un dossier partagé par thème (social, environnement, achats, éthique). Faites la liste de ce qui existe et de ce qui manque.', 'Trouvés : document unique d\'évaluation des risques, contrats de reprise des déchets, deux questionnaires clients remplis l\'an dernier, une charte informatique. Manquants : politique RSE, bilan carbone, charte fournisseurs.'],
    ['Préparez une grille de 8 questions identique pour tous : missions du service, ce qui est déjà fait, difficultés, attentes des clients, idées. Prévoyez 30 à 45 minutes par entretien et rédigez une synthèse d\'une page.', 'Entretien avec le responsable logistique : 18 camions, aucun suivi de consommation de carburant ; idée de formation à l\'écoconduite ; un client demande les émissions de transport.'],
    ['Pour chacune des sept questions centrales, notez de 1 (rien) à 4 (démarche structurée et mesurée) en vous appuyant sur les preuves recueillies. Représentez les notes sur un radar.', 'Gouvernance 1, droits de l\'Homme 2, conditions de travail 3, environnement 2, loyauté des pratiques 2, consommateurs 3, communautés 2 : la priorité est la gouvernance de la démarche.'],
    ['Classez les écarts en deux listes : les risques juridiques (obligation non respectée) à traiter tout de suite, et les actions simples à fort effet (moins de trois mois, peu de budget).', 'Risque : index de l\'égalité non publié. Victoires rapides : passage à l\'électricité verte, tri des biodéchets de la cantine, publication de l\'index.']]},
  {outils: [['#demarrer', 'Démarrer la RSE de zéro (modèle de cartographie)']], d: [
    ['Faites un remue-méninges avec trois ou quatre collègues de services différents. Classez les parties prenantes en internes (salariés, représentants du personnel, actionnaires) et externes (clients, fournisseurs, banques, collectivités, riverains, associations, médias).', 'Liste de 14 parties prenantes pour un fabricant de meubles, dont les scieries fournisseuses, la communauté de communes et une association de protection des forêts.'],
    ['Pour chacune, notez de 1 à 3 son influence sur l\'entreprise et l\'impact de l\'entreprise sur elle. Placez-les sur une matrice à quatre cases.', 'Clients grands comptes : influence 3, impact 2 ; riverains de l\'usine : influence 1, impact 3. Les deux demandent une attention particulière, pour des raisons différentes.'],
    ['Associez un mode de dialogue à chaque case : informer les moins concernés, consulter, impliquer, et co-construire avec ceux qui ont à la fois une forte influence et un fort impact.', 'Salariés : co-construction en groupe de travail. Riverains : réunion publique annuelle. Banques : information par le rapport RSE.'],
    ['Planifiez les échanges sur l\'année et consignez les attentes exprimées dans un tableau : partie prenante, date, attentes, réponse de l\'entreprise.', 'Questionnaire envoyé aux 20 principaux clients : 14 réponses, 9 demandent le bilan carbone des produits.'],
    ['Envoyez une synthèse à ceux que vous avez consultés : ce que vous avez entendu, ce que vous retenez, ce que vous ne pouvez pas faire et pourquoi.', 'Courriel aux clients : « Vous avez été 9 sur 14 à demander l\'empreinte carbone de nos produits : nous la publierons pour nos cinq références principales en juin. »']]},
  {outils: [['#atelier--dma', 'Double matérialité'], ['#pilotage--plan', 'Plan d\'action'], ['#pilotage--route', 'Feuille de route']], d: [
    ['Reprenez la liste de vos enjeux prioritaires (issue de la matérialité) et la raison d\'être de l\'entreprise. Chaque engagement doit répondre à un enjeu prioritaire.', 'Enjeux prioritaires d\'une entreprise de transport : émissions de la flotte, sécurité des conducteurs, qualité de l\'air en ville.'],
    ['Pour chaque engagement : l\'indicateur, la valeur de l\'année de référence, la cible chiffrée, l\'année cible et le périmètre. Évitez les verbes vagues (« favoriser », « sensibiliser »).', '« Réduire de 30 % les émissions de CO₂ par tonne-kilomètre entre 2025 et 2030, sur l\'ensemble de la flotte détenue. »'],
    ['Découpez chaque objectif en actions avec un responsable, une échéance, un budget et un indicateur de suivi. Saisissez-les dans l\'outil de plan d\'action.', 'Action : remplacer 20 camions diesel par des camions au bioGNV d\'ici 2027 ; responsable : directeur de flotte ; budget : 2,4 M€ ; suivi : part de la flotte au bioGNV.'],
    ['Nommez un sponsor au comité de direction, réunissez un comité de pilotage chaque trimestre avec un ordre du jour fixe, et désignez un correspondant dans chaque service.', 'Le directeur général adjoint est sponsor ; le comité trimestriel examine l\'avancement des actions, les indicateurs et les nouvelles demandes clients.'],
    ['Proposez au comité de rémunération de lier une part du variable des dirigeants (souvent 10 à 20 %) à deux ou trois objectifs mesurables et vérifiables.', '15 % du variable du comité de direction lié à la baisse des émissions et au taux de fréquence des accidents.'],
    ['Publiez chaque année un tableau : objectif, valeur de départ, valeur de l\'année, cible. Expliquez les retards au lieu de les cacher.', 'Émissions par tonne-kilomètre : -8 % en deux ans pour une cible de -30 % ; retard dû au délai de livraison des camions, rattrapage prévu en 2027.']]},
  {outils: [['#terrain--bilan-carbone', 'Guide et calculatrice du bilan carbone'], ['#prestataires--services', 'Mission de bilan carbone détaillée']], d: [
    ['Choisissez l\'approche (contrôle opérationnel le plus souvent), listez les sociétés et sites inclus, et fixez l\'année de référence, celle à laquelle vous comparerez les progrès.', 'Approche : contrôle opérationnel ; périmètre : siège et deux entrepôts ; année de référence : 2025.'],
    ['Envoyez à chaque service une demande précise : quelles données, quel format, quelle date. Privilégiez les quantités physiques (kWh, litres, kilomètres, tonnes) aux montants en euros.', 'Énergie : 36 factures ; carburant : relevés des cartes carburant ; déplacements : export de l\'agence de voyages ; achats : grand livre comptable par compte.'],
    ['Multipliez chaque donnée par son facteur d\'émission pris dans la Base Empreinte de l\'ADEME. Si un fournisseur donne l\'empreinte réelle de son produit, utilisez-la.', '12 000 litres de gazole × 3,1 kgCO₂e par litre (ordre de grandeur, vérifiez le facteur exact dans la base) ≈ 37 tCO₂e.'],
    ['Classez les résultats par scope. Pour le scope 2, présentez les deux méthodes (selon le lieu, selon le contrat d\'électricité). Pour le scope 3, calculez les catégories significatives et estimez l\'incertitude.', 'Scope 1 : 120 t ; scope 2 : 45 t (lieu) ou 12 t (contrat) ; scope 3 : 2 300 t, dont 70 % d\'achats de marchandises ; incertitude globale de 25 %.'],
    ['Identifiez les trois à cinq postes qui pèsent le plus, et pour chacun des leviers de réduction chiffrés en tonnes et en euros.', 'Achats de marchandises : 1 600 t. Levier : référencer des produits à contenu recyclé, -200 t par an.'],
    ['Si l\'entreprise est assujettie (plus de 500 salariés en métropole), publiez le bilan et le plan de transition sur la plateforme de l\'ADEME, tous les quatre ans.', 'Dépôt sur bilans-ges.ademe.fr avec le plan de transition et les moyens associés.']]},
  {outils: [['#terrain--bilan-carbone', 'Bilan carbone'], ['#pilotage--plan', 'Plan d\'action'], ['#taxonomie', 'Taxonomie verte']], d: [
    ['Partez de votre année de référence et calculez la cible : par exemple -42 % sur les scopes 1 et 2 en dix ans, et une cible scope 3 si celui-ci dépasse 40 % du total. Vous pouvez faire valider la cible par la SBTi.', '2025 : 1 000 tCO₂e (scopes 1 et 2). Cible 2035 : 580 tCO₂e.'],
    ['Listez les leviers (efficacité énergétique, électrification, énergies renouvelables, fournisseurs, logistique) et estimez pour chacun les tonnes évitées. La somme doit atteindre la cible.', 'Pompe à chaleur : -180 t ; électrification de 30 véhicules : -150 t ; isolation : -90 t. Total : -420 t.'],
    ['Pour chaque levier, chiffrez l\'investissement (CapEx), les coûts ou économies annuels (OpEx) et le coût par tonne évitée.', 'Pompe à chaleur : 350 k€ d\'investissement, 40 k€ d\'économies par an, environ 190 € par tonne évitée sur la durée de vie.'],
    ['Vérifiez que les investissements figurent au budget pluriannuel et, si vous publiez selon la taxonomie, qu\'ils sont classés comme alignés.', 'Les 350 k€ sont inscrits au budget 2027 et déclarés en CapEx aligné (activité « installation de pompes à chaleur »).'],
    ['Fixez des jalons tous les deux ou trois ans, un responsable par levier et une revue annuelle par la direction.', 'Jalons : -15 % en 2028, -30 % en 2031, -42 % en 2035 ; revue chaque année en comité de direction.'],
    ['Dites clairement dans le rapport si votre trajectoire est compatible avec 1,5 °C, et sinon pourquoi et ce que vous prévoyez.', '« Notre trajectoire actuelle conduit à -35 % en 2035, en deçà d\'une trajectoire 1,5 °C ; l\'écart sera traité par l\'électrification de nos fours, à l\'étude. »']]},
  {outils: [['#atelier--vigilance', 'Cartographie des fournisseurs'], ['#terrain--achats-responsables', 'Guide des achats responsables'], ['#modeles', 'Modèles (charte fournisseurs)']], d: [
    ['Exportez les achats de l\'année par catégorie et par fournisseur. Pour chaque catégorie, notez le risque lié au pays, à la matière et au procédé. Croisez avec le montant dépensé.', 'Textile de travail fabriqué au Bangladesh : risque élevé, 300 k€. Fournitures de bureau en France : risque faible, 40 k€.'],
    ['Rédigez une charte de 2 pages (droits humains, santé-sécurité, environnement, éthique), faites-la signer et ajoutez une clause qui y renvoie dans vos contrats.', 'Clause : « Le fournisseur s\'engage à respecter la charte achats responsables annexée et à permettre un audit sur demande. »'],
    ['Envoyez un questionnaire ou demandez une évaluation (EcoVadis ou équivalent) aux fournisseurs à risque, et programmez des audits sur site pour les plus critiques.', '25 fournisseurs à risque évalués ; 3 audits sur site, dont un avec plan d\'actions correctives.'],
    ['Dans les appels d\'offres, ajoutez un critère RSE pondéré, avec des éléments de preuve attendus et une grille de notation connue des candidats.', 'Critère RSE à 20 % : empreinte carbone de la livraison (10 %), politique sociale (5 %), part de matières recyclées (5 %).'],
    ['Choisissez quelques fournisseurs stratégiques et construisez avec eux un plan de progrès sur deux ou trois ans.', 'Avec le transporteur principal : passage progressif à des camions au gaz, avec un engagement de volume sur trois ans.'],
    ['Suivez chaque trimestre la part des achats évalués et les délais de paiement réels, et présentez-les en comité RSE.', 'Part des achats évalués : 35 % en 2025, cible 60 % en 2027. Délai de paiement moyen : 52 jours, cible 45 jours.']]},
  {outils: [['#atelier--vigilance', 'Plan de vigilance'], ['#terrain--plan-vigilance', 'Guide complet']], d: [
    ['Croisez vos activités, vos pays d\'implantation et vos achats avec les grands risques (travail forcé, travail des enfants, santé-sécurité, pollution, climat). Notez gravité et probabilité.', 'Risque élevé identifié : sous-traitants de chantier (sécurité) et fournisseurs de coton (travail forcé).'],
    ['Mettez en place une évaluation régulière : questionnaire annuel pour tous, audit pour les partenaires à risque élevé.', 'Questionnaire envoyé à 400 fournisseurs ; audits pour les 15 dont le score de risque est le plus élevé.'],
    ['Pour chaque risque élevé, définissez une action concrète : formation, clause contractuelle, plan correctif, voire arrêt de la relation.', 'Sous-traitants de chantier : accueil sécurité obligatoire et contrôle hebdomadaire des équipements de protection.'],
    ['Créez avec les syndicats un canal d\'alerte accessible à tous (salariés, fournisseurs, riverains), confidentiel, avec une procédure de traitement.', 'Adresse de signalement et formulaire en ligne en quatre langues ; accusé de réception sous 7 jours.'],
    ['Définissez des indicateurs d\'efficacité (fournisseurs évalués, non-conformités corrigées, alertes traitées) et publiez un compte rendu avec le rapport de gestion.', '82 % des fournisseurs à risque évalués ; 23 non-conformités, dont 19 corrigées ; 6 alertes reçues, toutes traitées.'],
    ['Traitez explicitement le climat dans la cartographie, y compris les émissions de la chaîne de valeur si votre secteur est fortement émetteur.', 'Ajout d\'un volet climat : trajectoire de réduction du scope 3 et engagement des 50 principaux fournisseurs.']]},
  {outils: [['#terrain--sensibiliser', 'Guide de sensibilisation']], d: [
    ['Envoyez un questionnaire de 10 questions (connaissances et attentes) avant toute action, pour mesurer les progrès ensuite.', 'Résultat initial : 35 % des salariés savent ce qu\'est le scope 3 ; 70 % souhaitent agir dans leur métier.'],
    ['Commencez par une session dédiée au comité de direction, puis une session pour les managers, avant de déployer à tous.', 'Fresque du climat pour le comité de direction en janvier, managers en février, tous les salariés de mars à juin.'],
    ['Choisissez des ateliers participatifs de trois heures plutôt que des conférences, animés par des animateurs formés (internes ou externes).', '12 ateliers de la Fresque du climat animés par 4 salariés formés comme animateurs.'],
    ['Terminez chaque atelier par un temps où chaque équipe choisit une action concrète liée à son métier.', 'Le service comptabilité passe aux factures dématérialisées ; les commerciaux regroupent leurs visites clients.'],
    ['Racontez les initiatives réussies (journal interne, réunions) et refaites le questionnaire un an plus tard.', 'Un an après : 68 % connaissent le scope 3 ; 41 actions proposées par les équipes, dont 17 réalisées.']]},
  {outils: [['#modeles', 'Modèles de rédaction']], d: [
    ['Faites l\'inventaire de toutes les allégations environnementales publiées : site, emballages, catalogues, publicités, réseaux sociaux, réponses aux appels d\'offres.', '47 allégations trouvées, dont « éco-responsable », « neutre en carbone » et « 100 % recyclable ».'],
    ['Pour chacune, vérifiez qu\'il existe une preuve écrite, que le périmètre est précis (quel produit, quelle partie) et que la donnée est récente.', '« 100 % recyclable » : vrai pour la bouteille, faux pour le bouchon ; à reformuler.'],
    ['Supprimez les termes vagues (« vert », « éco-responsable », « respectueux de l\'environnement ») et toute promesse de neutralité carbone fondée sur la compensation, désormais interdite pour les produits.', 'Suppression de « produit neutre en carbone » sur toutes les étiquettes.'],
    ['Remplacez par un fait chiffré, daté et sourcé, sur un périmètre clair.', '« Bouteille fabriquée avec 50 % de plastique recyclé (attestation fournisseur 2026). »'],
    ['Instaurez une validation systématique par la RSE et le juridique avant toute publication, avec une grille de cinq questions.', 'Grille : la preuve existe-t-elle ? le périmètre est-il clair ? la donnée est-elle récente ? le terme est-il précis ? un label officiel est-il cité correctement ?']]},
  {outils: [['#audit--prep', 'Audit pas à pas, avec exemples et modèles'], ['#atelier--audit', 'Rétroplanning de l\'audit']], d: [
    ['Consultez deux ou trois vérificateurs inscrits à la H2A, faites nommer le retenu par l\'assemblée générale et tenez une réunion de lancement au moins six mois avant la clôture.', 'Voir l\'étape 1 de l\'espace « Audit et vérification », avec l\'ordre du jour de la réunion à télécharger.'],
    ['Remettez à l\'auditeur le protocole de reporting (une fiche par indicateur) et le dossier de la double matérialité (méthode, parties prenantes, seuils, résultats).', 'Voir l\'étape 2 : modèle de protocole avec la fiche du taux de fréquence entièrement remplie.'],
    ['À mi-année, testez vous-même 4 à 6 indicateurs à risque : recalcul, rapprochement avec les pièces, comparaison avec l\'an dernier. Corrigez les processus.', 'Voir l\'étape 4 : fiche de test sur les heures de formation, avec l\'écart trouvé et la correction.'],
    ['Pour chaque indicateur, un dossier avec cinq éléments : fiche du protocole, données sources, calcul, contrôles, validation.', 'Voir l\'étape 3 : dossier de preuve Excel de l\'électricité, 36 factures et un total égal au chiffre publié.'],
    ['Classez les constats, définissez une action par constat, corrigez les chiffres, signez la lettre d\'affirmation et présentez les conclusions au comité d\'audit.', 'Voir l\'étape 6 : tableau de suivi et lettre d\'affirmation à télécharger.']]}
];
function renderMethodes(){
  const el = document.getElementById('methodList'); if (!el) return;
  el.innerHTML = METH.map((m, mi) => { const D = METH_DET[mi] || {d: [], outils: []}; return '<details data-s="1"><summary>' + m[0] + '</summary><div class="inner"><p class="note">Touchez une étape pour voir comment la faire et un exemple concret.</p><ol class="msteps">' + m[1].map((s, i) => { const x = D.d[i]; return '<li>' + (x ? '<details class="mstep"><summary>' + s + '</summary><div class="msd"><h5 class="h5c">Comment faire</h5><p>' + x[0] + '</p><div class="exbox"><strong>Exemple</strong><p>' + x[1] + '</p></div></div></details>' : s) + '</li>'; }).join('') + '</ol><dl class="kv"><dt>Livrable</dt><dd>' + m[2] + '</dd><dt>Piège</dt><dd>' + m[3] + '</dd></dl>' + (D.outils.length ? '<div class="ctool">' + D.outils.map(([h, l]) => '<a class="btn ghost sm" href="' + h + '">' + l + ' →</a>').join('') + '</div>' : '') + '</div></details>'; }).join('');
}
renderMethodes();


/* =====================================================================
   DOMAINES D'INTERVENTION DE LA RSE : 12 DOMAINES, SPÉCIALISATION
   ===================================================================== */
const POLES = [['env', 'Environnement et climat', '#0F5B3E'], ['soc', 'Social, territoires et éthique', '#C2532A'], ['perf', 'Performance et conformité', '#2357A6'], ['strat', 'Stratégie et transformation', '#8A5214']];
const DOMS = [
  {id: 'environnement', n: 'Environnement et transition écologique', p: 'env', c: '#0F5B3E', b: 'Réduire les impacts des activités sur l\'eau, l\'air, les sols, la biodiversité et les ressources.',
   s: ['Prévention des pollutions', 'Gestion de l\'eau', 'Biodiversité', 'Déchets', 'Transition énergétique', 'Écoconception', 'Management environnemental'],
   y: 'C\'est le cœur historique de la RSE et le domaine le plus encadré par le droit : autorisations des installations classées, règles sur l\'eau et les rejets, obligations sur les déchets. Les normes européennes de reporting (ESRS E2 à E5) en font un volet complet du rapport de durabilité.',
   k: ['Consommation d\'eau (m³)', 'Déchets produits et part valorisée', 'Rejets de polluants', 'Sites situés en zone sensible pour la biodiversité', 'Non-conformités environnementales'],
   r: ['ISO 14001', 'ESRS E2 à E5', 'Code de l\'environnement', 'EMAS'],
   a: [['#comprendre--dd', 'Le développement durable'], ['#normes', 'Normes et labels'], ['#france', 'Réglementation France']],
   o: [['#terrain--audit-iso14001', 'Réussir un audit ISO 14001'], ['#pilotage--kpi', 'Tableau de bord des indicateurs']],
   cas: ['iso14001', 'biodiversite'], met: ['responsable-environnement', 'charge-biodiversite'], aut: 'Chef de projet transition écologique, ingénieur HSE',
   pas: ['Faire la liste des autorisations et obligations environnementales de chaque site.', 'Mesurer la consommation d\'eau et les déchets des douze derniers mois.', 'Repérer les trois impacts les plus importants et proposer une action pour chacun.']},
  {id: 'climat', n: 'Climat et décarbonation', p: 'env', c: '#2357A6', b: 'Mesurer les émissions de gaz à effet de serre, les réduire et s\'adapter au changement climatique.',
   s: ['Bilan carbone et BEGES', 'Scopes 1, 2 et 3', 'Stratégie de décarbonation', 'Efficacité énergétique', 'Mobilité durable', 'Énergies renouvelables', 'Adaptation au climat', 'Objectifs climatiques'],
   y: 'Les entreprises de plus de 500 salariés doivent publier un bilan des émissions avec un plan de transition tous les quatre ans ; les bâtiments tertiaires de plus de 1 000 m² doivent réduire leur consommation d\'énergie. Les clients, les banques et les appels d\'offres demandent de plus en plus l\'empreinte carbone.',
   k: ['Émissions des scopes 1, 2 et 3 (tCO₂e)', 'Intensité carbone (par salarié ou par chiffre d\'affaires)', 'Consommation d\'énergie (MWh)', 'Part d\'énergie renouvelable', 'Avancement vers l\'objectif de réduction'],
   r: ['Bilan Carbone®', 'GHG Protocol', 'ISO 14064-1', 'SBTi', 'ESRS E1', 'ISO 50001'],
   a: [['#comprendre--carbone', 'Le bilan carbone'], ['#reporting', 'Reporting et carbone']],
   o: [['#terrain--bilan-carbone', 'Calculatrice du bilan carbone'], ['#methodes', 'Méthodes : bilan carbone, plan de transition'], ['#pilotage--aides', 'Aides à la décarbonation']],
   cas: ['bilan-carbone', 'eclairage-roi'], met: ['charge-decarbonation', 'consultant-carbone'], aut: 'Chef de projet décarbonation, energy manager',
   pas: ['Rassembler les factures d\'énergie et de carburant de l\'année.', 'Calculer les scopes 1 et 2 avec la calculatrice de l\'application.', 'Identifier les trois postes les plus émetteurs et chiffrer un levier pour chacun.']},
  {id: 'social', n: 'Ressources humaines, social et qualité de vie au travail', p: 'soc', c: '#C2532A', b: 'Assurer la santé, la sécurité, l\'égalité et le développement des personnes qui travaillent dans l\'entreprise.',
   s: ['Santé et sécurité', 'Qualité de vie et des conditions de travail', 'Égalité professionnelle', 'Diversité et inclusion', 'Prévention du harcèlement', 'Formation', 'Dialogue social', 'Équilibre des temps de vie'],
   y: 'Le volet social est très encadré : document unique d\'évaluation des risques, index de l\'égalité professionnelle dès 50 salariés, obligation d\'emploi de 6 % de travailleurs handicapés dès 20 salariés, quotas de femmes dirigeantes dans les grandes entreprises. La directive européenne sur la transparence des rémunérations, en cours de transposition, renforcera ces exigences.',
   k: ['Taux de fréquence et de gravité des accidents', 'Taux d\'absentéisme', 'Taux de rotation du personnel', 'Heures de formation par salarié', 'Écart de rémunération femmes-hommes', 'Taux d\'emploi de travailleurs handicapés'],
   r: ['ISO 45001', 'ESRS S1', 'Code du travail', 'Index de l\'égalité professionnelle'],
   a: [['#france', 'Réglementation France'], ['#csrd', 'ESRS S1 : effectifs']],
   o: [['#terrain--index-egalite', 'Calculer l\'index de l\'égalité'], ['#pilotage--kpi', 'Indicateurs sociaux']],
   cas: ['qvct'], met: ['charge-qvct'], aut: 'Chargé de mission RSE sociale, chargé de diversité et inclusion, préventeur',
   pas: ['Relire le document unique d\'évaluation des risques et vérifier sa date de mise à jour.', 'Calculer le taux de fréquence et l\'absentéisme de l\'année.', 'Vérifier que l\'index de l\'égalité est publié et à jour.']},
  {id: 'ethique', n: 'Éthique, gouvernance et conformité', p: 'soc', c: '#7A3E5B', b: 'Diriger l\'entreprise de façon responsable, transparente et conforme à la loi.',
   s: ['Gouvernance responsable', 'Prévention de la corruption', 'Conflits d\'intérêts', 'Lanceurs d\'alerte', 'Devoir de vigilance', 'Prévention de la fraude', 'Protection des données'],
   y: 'La loi Sapin 2 impose un programme anticorruption aux entreprises de plus de 500 salariés et 100 M€ de chiffre d\'affaires ; un dispositif de recueil des alertes est obligatoire dès 50 salariés ; les plus grandes entreprises doivent établir un plan de vigilance. Les manquements exposent à des sanctions et à de lourds risques d\'image.',
   k: ['Salariés exposés formés à l\'anticorruption', 'Alertes reçues et traitées', 'Cas de corruption confirmés', 'Délais de paiement des fournisseurs', 'Indépendance et diversité du conseil'],
   r: ['Loi Sapin 2 et recommandations de l\'AFA', 'ESRS G1', 'Principes directeurs de l\'OCDE', 'ISO 37001', 'RGPD'],
   a: [['#comprendre--vigilance', 'Le devoir de vigilance'], ['#france', 'Réglementation France']],
   o: [['#atelier--vigilance', 'Cartographie des risques fournisseurs'], ['#terrain--plan-vigilance', 'Guide du plan de vigilance'], ['#audit', 'Audit et vérification']],
   cas: ['achats-responsables'], met: [], aut: 'Chargé de conformité, responsable éthique, consultant en gouvernance responsable',
   pas: ['Vérifier qu\'un canal d\'alerte existe et qu\'il est connu des salariés.', 'Lire le code de conduite de l\'entreprise ou en proposer un.', 'Faire la liste des fonctions exposées au risque de corruption.']},
  {id: 'reporting', n: 'Reporting extra-financier, ESG et performance durable', p: 'perf', c: '#2357A6', b: 'Mesurer, fiabiliser et publier les performances environnementales, sociales et de gouvernance.',
   s: ['Indicateurs ESG', 'CSRD et ESRS', 'Norme volontaire VSME', 'Double matérialité', 'Collecte et fiabilisation des données', 'Tableaux de bord', 'Notations extra-financières', 'Audit du rapport'],
   y: 'Depuis l\'Omnibus, la CSRD vise les entreprises de plus de 1 000 salariés et 450 M€ de chiffre d\'affaires, avec des ESRS simplifiés applicables aux exercices ouverts à partir de 2027. Les autres entreprises reçoivent des demandes de données de leurs clients, banques et investisseurs, auxquelles la norme volontaire VSME permet de répondre.',
   k: ['Points de données publiés et taux de couverture', 'Délai de production du rapport', 'Anomalies relevées par l\'auditeur', 'Note EcoVadis ou équivalente'],
   r: ['CSRD et ESRS', 'VSME', 'GRI', 'Taxonomie européenne', 'ISSB'],
   a: [['#csrd', 'CSRD et ESRS'], ['#comprendre--dm', 'La double matérialité'], ['#comprendre--csrd', 'La CSRD en profondeur']],
   o: [['#atelier', 'Atelier CSRD : matérialité et collecte'], ['#audit', 'Audit et vérification'], ['#pilotage--kpi', 'Tableau de bord, export Excel et Power BI']],
   cas: ['csrd-donnees', 'double-materialite', 'reporting-esg'], met: ['charge-reporting', 'analyste-esg'], aut: 'Responsable reporting de durabilité, contrôleur de gestion ESG',
   pas: ['Faire la liste des questionnaires RSE reçus des clients et des banques.', 'Choisir 10 indicateurs et rédiger une fiche pour chacun.', 'Construire le tableau de bord et le partager avec la direction.']},
  {id: 'circulaire', n: 'Économie circulaire et gestion des ressources', p: 'env', c: '#A8621A', b: 'Produire et consommer en limitant le gaspillage, du choix des matières à la fin de vie des produits.',
   s: ['Réduction des déchets', 'Réemploi et réparation', 'Recyclage et valorisation', 'Écoconception', 'Durée de vie des produits', 'Analyse du cycle de vie', 'Économie de la fonctionnalité', 'Écologie industrielle'],
   y: 'La loi anti-gaspillage pour une économie circulaire (AGEC) fixe des objectifs de réduction des emballages, interdit la destruction des invendus non alimentaires, étend la responsabilité élargie des producteurs et impose le tri des biodéchets. Les matières premières coûtent de plus en plus cher : chaque tonne évitée est une économie.',
   k: ['Déchets produits par unité produite', 'Taux de valorisation', 'Part de matières recyclées', 'Taux de réemploi des emballages'],
   r: ['Loi AGEC', 'ISO 14040 et 14044', 'ISO 14006', 'ESRS E5'],
   a: [['#comprendre--dd', 'Le développement durable'], ['#normes', 'Normes et labels']],
   o: [['#prestataires--services', 'Mission d\'économie circulaire détaillée'], ['#pilotage--kpi', 'Indicateurs déchets']],
   cas: ['economie-circulaire'], met: ['charge-circulaire'], aut: 'Consultant en écoconception, chargé de valorisation des déchets',
   pas: ['Peser ou estimer chaque flux de déchets sur un mois.', 'Vérifier le tri à la source et les contrats des prestataires.', 'Choisir un produit et chercher trois pistes d\'écoconception.']},
  {id: 'achats', n: 'Achats responsables et chaîne d\'approvisionnement', p: 'strat', c: '#5B6B2F', b: 'Prendre en compte les conséquences des achats et les pratiques des fournisseurs.',
   s: ['Évaluation des risques fournisseurs', 'Droits humains dans la chaîne de valeur', 'Travail forcé et travail des enfants', 'Traçabilité', 'Achats locaux et inclusifs', 'Clauses sociales et environnementales', 'Délais de paiement'],
   y: 'L\'essentiel des impacts d\'une entreprise se trouve souvent chez ses fournisseurs : la majeure partie des émissions (scope 3) et les principaux risques sur les droits humains. Le devoir de vigilance, le règlement européen contre la déforestation importée et l\'interdiction européenne des produits issus du travail forcé imposent de connaître sa chaîne d\'approvisionnement.',
   k: ['Part des achats évalués sur des critères RSE', 'Fournisseurs à risque audités', 'Délai de paiement moyen', 'Part d\'achats locaux ou inclusifs'],
   r: ['ISO 20400', 'Label Relations fournisseurs et achats responsables', 'Devoir de vigilance', 'ESRS S2 et G1'],
   a: [['#comprendre--vigilance', 'Le devoir de vigilance'], ['#europe', 'Réglementation UE']],
   o: [['#atelier--vigilance', 'Cartographie des risques fournisseurs'], ['#terrain--achats-responsables', 'Guide des achats responsables'], ['#public--achats', 'Achats publics responsables']],
   cas: ['achats-responsables'], met: ['acheteur-responsable'], aut: 'Responsable des risques fournisseurs, chargé de mission achats durables',
   pas: ['Exporter les achats de l\'année par catégorie et par fournisseur.', 'Classer les catégories selon leur risque et leur montant.', 'Rédiger une charte fournisseurs d\'une page.']},
  {id: 'territoire', n: 'Impact territorial et développement local', p: 'soc', c: '#1F6F73', b: 'Contribuer à la vie du territoire : emploi, insertion, partenariats, dialogue avec les habitants.',
   s: ['Emploi local', 'Insertion professionnelle', 'Relations avec les collectivités', 'Mécénat et partenariats associatifs', 'Achats auprès des structures d\'insertion et du handicap', 'Dialogue avec les riverains'],
   y: 'Une entreprise ancrée dans son territoire recrute plus facilement, obtient plus facilement ses autorisations et gagne la confiance des habitants. Le mécénat ouvre droit à une réduction d\'impôt, et les achats auprès des entreprises adaptées et des ESAT comptent dans l\'obligation d\'emploi des travailleurs handicapés.',
   k: ['Part des recrutements locaux', 'Heures d\'insertion réalisées', 'Achats auprès de structures inclusives', 'Budget de mécénat et heures de bénévolat de compétences'],
   r: ['ISO 26000 (communautés et développement local)', 'ESRS S3', 'Clauses sociales des marchés'],
   a: [['#comprendre--rse', 'La RSE']],
   o: [['#engager', 'Associations et bénévolat'], ['#public', 'Espace public et associatif']],
   cas: [], met: [], aut: 'Chargé de développement territorial, chef de projet impact social, responsable mécénat',
   pas: ['Recenser les partenariats locaux existants.', 'Contacter le facilitateur des clauses sociales du territoire.', 'Proposer une action de bénévolat de compétences avec une association locale.']},
  {id: 'droits', n: 'Droits humains, inclusion et impact social', p: 'soc', c: '#B23A22', b: 'Prévenir les atteintes aux droits fondamentaux et favoriser une contribution positive à la société.',
   s: ['Non-discrimination', 'Handicap', 'Égalité des chances', 'Insertion des publics éloignés de l\'emploi', 'Conditions de travail chez les fournisseurs', 'Accessibilité des produits et services', 'Mécanismes de réclamation'],
   y: 'Les principes directeurs des Nations unies et de l\'OCDE attendent des entreprises qu\'elles identifient et préviennent les atteintes aux droits humains liées à leurs activités. En Europe, les exigences d\'accessibilité s\'appliquent à de nombreux produits et services depuis 2025.',
   k: ['Salariés en situation de handicap', 'Plaintes et réclamations reçues et traitées', 'Fournisseurs évalués sur les droits humains', 'Personnes en insertion accueillies'],
   r: ['Principes directeurs des Nations unies', 'Principes directeurs de l\'OCDE', 'ESRS S1 à S4', 'ISO 26000'],
   a: [['#fondamentaux', 'Fondamentaux'], ['#comprendre--vigilance', 'Le devoir de vigilance']],
   o: [['#atelier--vigilance', 'Plan de vigilance'], ['#public--impact', 'Mesurer l\'impact social']],
   cas: ['qvct'], met: [], aut: 'Chargé de mission impact social, consultant en droits humains, responsable diversité et inclusion',
   pas: ['Faire la liste des publics affectés par l\'activité (salariés, sous-traitants, clients, riverains).', 'Vérifier qu\'un mécanisme de réclamation existe et est accessible.', 'Calculer le taux d\'emploi de travailleurs handicapés.']},
  {id: 'finance', n: 'Finance durable et investissement responsable', p: 'perf', c: '#2F6F73', b: 'Intégrer les enjeux de durabilité dans les décisions de financement et d\'investissement.',
   s: ['Investissement socialement responsable', 'Taxonomie européenne', 'Obligations vertes et sociales', 'Risques climatiques financiers', 'Intégration ESG', 'Greenwashing financier'],
   y: 'Les investisseurs et les banques doivent publier la durabilité de leurs produits et de leurs portefeuilles ; ils demandent donc des données aux entreprises qu\'ils financent. La taxonomie européenne classe les activités durables et conditionne l\'accès à certains financements verts.',
   k: ['Part du chiffre d\'affaires, des investissements et des dépenses alignés sur la taxonomie', 'Encours de financements verts', 'Exposition aux risques climatiques'],
   r: ['Taxonomie européenne', 'SFDR', 'Label ISR', 'Label Greenfin', 'Standard européen des obligations vertes'],
   a: [['#taxonomie', 'Taxonomie verte'], ['#comprendre--taxo', 'La taxonomie en profondeur'], ['#comprendre--esg', 'L\'ESG']],
   o: [['#pilotage--aides', 'Financer sa transition']],
   cas: ['taxonomie'], met: ['analyste-esg'], aut: 'Chargé de finance durable, consultant en investissement responsable',
   pas: ['Lister les activités de l\'entreprise et chercher si elles figurent dans la taxonomie.', 'Identifier les investissements de l\'année qui pourraient être alignés.', 'Lire la politique ESG de la banque principale de l\'entreprise.']},
  {id: 'communication', n: 'Communication responsable et marketing durable', p: 'strat', c: '#8A5214', b: 'Communiquer de façon honnête et vérifiable sur les engagements, les produits et les impacts.',
   s: ['Communication RSE', 'Prévention du greenwashing', 'Allégations environnementales', 'Publicité responsable', 'Emballages', 'Information des consommateurs'],
   y: 'Une allégation environnementale doit être précise et prouvée. Depuis le 27 septembre 2026, le droit européen interdit les allégations génériques (« vert », « éco-responsable ») sans performance reconnue et les promesses de neutralité carbone d\'un produit fondées sur la compensation. Le greenwashing est une pratique commerciale trompeuse lourdement sanctionnée.',
   k: ['Allégations vérifiées avant publication', 'Plaintes ou mises en cause pour greenwashing', 'Part des produits avec information environnementale'],
   r: ['Directive européenne sur les allégations environnementales (2024/825)', 'Loi Climat et résilience', 'Recommandations de l\'ARPP', 'ISO 14021'],
   a: [['#comprendre--rse', 'La RSE']],
   o: [['#methodes', 'Méthode : communiquer sans greenwashing'], ['#modeles', 'Modèles de rédaction']],
   cas: [], met: [], aut: 'Chargé de communication RSE, responsable marketing durable',
   pas: ['Faire l\'inventaire des allégations environnementales de l\'entreprise.', 'Vérifier la preuve de chacune.', 'Réécrire les trois allégations les plus fragiles avec des faits chiffrés.']},
  {id: 'numerique', n: 'Innovation durable, numérique responsable et transformation', p: 'strat', c: '#6B4BA1', b: 'Rendre plus durables les modèles économiques, les technologies et les façons de travailler.',
   s: ['Numérique responsable', 'Sobriété numérique', 'Écoconception de services numériques', 'Intelligence artificielle responsable', 'Modèles économiques durables', 'Conduite du changement'],
   y: 'Le numérique pèse quelques pour cent des émissions mondiales, surtout à cause de la fabrication des équipements. La loi REEN encadre la réduction de son empreinte, un référentiel public guide l\'écoconception des services numériques, et le règlement européen sur l\'intelligence artificielle s\'applique progressivement.',
   k: ['Durée de vie moyenne des équipements', 'Part d\'équipements reconditionnés', 'Empreinte des services numériques', 'Projets d\'innovation durable lancés'],
   r: ['Référentiel général d\'écoconception de services numériques (RGESN)', 'Loi REEN', 'Label Numérique responsable', 'Règlement européen sur l\'IA'],
   a: [['#comprendre--rse', 'La RSE']],
   o: [['#pilotage--plan', 'Plan d\'action'], ['#terrain--sensibiliser', 'Sensibiliser les équipes']],
   cas: [], met: ['consultant-strategie-durable'], aut: 'Consultant en numérique responsable, chef de projet innovation durable, responsable transformation durable',
   pas: ['Compter les équipements informatiques et leur âge moyen.', 'Proposer d\'allonger leur durée d\'usage et d\'acheter reconditionné.', 'Mesurer le poids des pages du site de l\'entreprise.']}
];
const TRANSV = [['Gestion de projet', 'Planifier, organiser et piloter les initiatives RSE.', '#pilotage--plan'], ['Analyse de données', 'Mesurer les impacts et interpréter les indicateurs.', '#pilotage--kpi'], ['Réglementation', 'Comprendre les obligations et les normes applicables.', '#outils'], ['Gestion des risques', 'Identifier et hiérarchiser les risques ESG.', '#atelier--vigilance'], ['Dialogue avec les parties prenantes', 'Comprendre les attentes des salariés, clients, fournisseurs et territoires.', '#methodes'], ['Conduite du changement', 'Faire évoluer les pratiques dans l\'organisation.', '#terrain--sensibiliser'], ['Gestion budgétaire', 'Estimer les coûts et les bénéfices des projets.', '#labo--eclairage-roi'], ['Audit et évaluation', 'Vérifier la conformité et l\'efficacité des actions.', '#audit'], ['Communication professionnelle', 'Présenter les résultats et mobiliser les équipes.', '#modeles'], ['Amélioration continue', 'Suivre les résultats et améliorer les dispositifs.', '#pilotage--route']];
window.SERIKI_DOMS = null;
const DREFS = [['ISO 26000', 'Lignes directrices', 'Responsabilité sociétale : 7 principes et 7 questions centrales. Non certifiable.'], ['ISO 14001', 'Norme de management certifiable', 'Management environnemental.'], ['ISO 50001', 'Norme de management certifiable', 'Management de l\'énergie.'], ['ISO 45001', 'Norme de management certifiable', 'Santé et sécurité au travail.'], ['CSRD et ESRS', 'Réglementation européenne', 'Rapport de durabilité obligatoire pour les entreprises concernées.'], ['VSME', 'Norme volontaire de reporting', 'Reporting simplifié pour les PME.'], ['GHG Protocol', 'Méthode de comptabilité', 'Comptabilisation des émissions de gaz à effet de serre.'], ['Taxonomie européenne', 'Réglementation européenne', 'Classification des activités économiques durables.'], ['GRI', 'Référentiel volontaire de reporting', 'Reporting des impacts sur l\'économie, l\'environnement et les personnes.'], ['Principes directeurs de l\'OCDE', 'Lignes directrices', 'Conduite responsable des entreprises.'], ['Objectifs de développement durable', 'Cadre international', 'Les 17 objectifs des Nations unies pour 2030.']];
const PARC6 = [['Comprendre', 'Les notions et les enjeux', 'a'], ['Se spécialiser', 'Choisir ce domaine', 'spec'], ['Maîtriser les méthodes', 'Méthodes, outils, référentiels', 'o'], ['Pratiquer', 'Cas du laboratoire', 'cas'], ['S\'évaluer', 'Quiz du domaine', 'quiz'], ['Préparer sa carrière', 'Métiers, CV, offres', 'met']];
function domPas(d){ return '<ol>' + d.pas.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>'; }
function renderDomaines(){
  const el = document.getElementById('domRoot'); if (!el) return;
  const sub = route().base === 'domaines' ? route().sub : null, spec = LS.get('specialite') || '';
  const d = sub ? DOMS.find(x => x.id === sub) : null;
  if (d) {
    const casL = d.cas.map(id => (typeof casById === 'function' ? casById(id) : null)).filter(Boolean), metL = (P.metiers || []).filter(m => d.met.includes(m.id)), i = DOMS.indexOf(d), prev = DOMS[i - 1], next = DOMS[i + 1];
    let h = '<div class="eyebrow">APPRENDRE · DOMAINE ' + (i + 1) + ' SUR 12</div><h2>' + esc(d.n) + '</h2><p class="lead">' + esc(d.b) + '</p>';
    h += '<div class="ctool"><button class="btn diabtn" data-diadom="domRoot" data-t="' + esc(d.n) + '" data-c="' + d.c + '">' + '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>' + ' Diaporama</button><button class="btn' + (spec === d.id ? ' ghost' : '') + '" data-dm="spec" data-k="' + d.id + '">' + (spec === d.id ? '✓ Ma spécialité' : 'En faire ma spécialité') + '</button><a class="btn ghost" href="#quiz--' + d.id + '">Faire le quiz' + (typeof qzBest === 'function' && qzBest(d.id) != null ? ' (' + qzBest(d.id) + ' %)' : '') + '</a><button class="btn ghost" data-dm="fiche" data-k="' + d.id + '">Fiche de révision</button><a class="btn ghost" href="#domaines">Les 12 domaines</a></div>';
    h += '<div class="dparc6">' + PARC6.map(([t, s, k], j) => { const href = k === 'a' ? (d.a[0] || ['#comprendre'])[0] : k === 'o' ? (d.o[0] || ['#methodes'])[0] : k === 'cas' ? (casL[0] ? '#labo--' + casL[0].id : '#labo') : k === 'met' ? '#metiers' : k === 'spec' ? '#domaines--' + d.id : k === 'quiz' ? '#quiz--' + d.id : k; return '<a class="p6" href="' + href + '"' + (k === 'spec' ? ' data-dm="spec" data-k="' + d.id + '"' : '') + ' style="--dc:' + d.c + '"><span>' + (j + 1) + '</span><strong>' + t + '</strong><small>' + s + '</small></a>'; }).join('') + '</div>';
    h += '<div class="dgrid"><div class="card dcard" style="--dc:' + d.c + '"><h4>Les sujets</h4><div class="dtags">' + d.s.map(x => '<span>' + esc(x) + '</span>').join('') + '</div></div><div class="card dcard" style="--dc:' + d.c + '"><h4>Pourquoi c\'est important</h4><p>' + esc(d.y) + '</p></div><div class="card dcard" style="--dc:' + d.c + '"><h4>Les indicateurs clés</h4><ul>' + d.k.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="card dcard" style="--dc:' + d.c + '"><h4>Les référentiels</h4><ul>' + d.r.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>';
    h += '<h3>Dans l\'application</h3><div class="grid three"><div class="card"><h4>Apprendre</h4><div class="dlinks">' + d.a.map(([hr, l]) => '<a href="' + hr + '">' + esc(l) + ' →</a>').join('') + '</div></div><div class="card"><h4>Les outils</h4><div class="dlinks">' + d.o.map(([hr, l]) => '<a href="' + hr + '">' + esc(l) + ' →</a>').join('') + '</div></div><div class="card"><h4>Pratiquer</h4><div class="dlinks">' + (casL.length ? casL.map(c => '<a href="#labo--' + c.id + '">Cas : ' + esc(c.titre) + ' →</a>').join('') : '<span class="note">Pas encore de cas dédié : utilisez les outils et les premiers pas ci-dessous.</span>') + '</div></div></div>';
    h += '<div class="grid two"><div class="card"><h4>Mes trois premiers pas dans une entreprise</h4>' + domPas(d) + '</div><div class="card"><h4>Les métiers</h4>' + (metL.length ? '<div class="dlinks">' + metL.map(m => '<button class="linkbtn" data-dm="met" data-k="' + m.id + '">' + esc(m.titre) + ' →</button>').join('') + '</div>' : '') + '<p class="note">Autres métiers du domaine : ' + esc(d.aut) + '.</p><p><a class="btn ghost sm" href="#offres">Voir les offres →</a></p></div></div>';
    h += '<div class="nnav">' + (prev ? '<a class="btn ghost" href="#domaines--' + prev.id + '">← ' + esc(prev.n) + '</a>' : '<span></span>') + (next ? '<a class="btn ghost" href="#domaines--' + next.id + '">' + esc(next.n) + ' →</a>' : '') + '</div>';
    el.innerHTML = h; return;
  }
  let h = '<div class="eyebrow">APPRENDRE · LES DOMAINES</div><h2>Les 12 domaines de la RSE</h2><p class="lead">La RSE ne se limite pas à l\'environnement : elle couvre aussi le social, l\'éthique, les achats, la finance, la communication et le numérique. Chaque domaine relie quatre choses : ce qu\'il faut savoir, les outils à maîtriser, les cas à pratiquer et les métiers accessibles. Choisissez votre spécialité pour suivre un parcours en six étapes.</p>';
  if (spec) { const s = DOMS.find(x => x.id === spec); if (s) h += '<a class="card specbar" href="#domaines--' + s.id + '" style="--dc:' + s.c + '"><span class="note">Ma spécialité</span><strong>' + esc(s.n) + '</strong><span>Continuer mon parcours →</span></a>'; }
  h += POLES.map(([pk, pn, pc]) => '<h3 style="--esp:' + pc + '">' + pn + '</h3><div class="domgrid">' + DOMS.filter(x => x.p === pk).map(x => '<a class="domcard' + (spec === x.id ? ' on' : '') + '" href="#domaines--' + x.id + '" style="--dc:' + x.c + '"><span class="dnum">' + String(DOMS.indexOf(x) + 1).padStart(2, '0') + '</span><h4>' + esc(x.n) + '</h4><p>' + esc(x.b) + '</p><span class="dmore">' + x.s.length + ' sujets · ' + x.o.length + ' outils' + (x.cas.length ? ' · ' + x.cas.length + ' cas pratique' + (x.cas.length > 1 ? 's' : '') : '') + '</span></a>').join('') + '</div>').join('');
  h += '<h3>Les compétences transversales</h3><p class="prose">Utiles dans tous les domaines, et recherchées par tous les recruteurs.</p><div class="domgrid">' + TRANSV.map(([t, x, hr]) => '<a class="card tvc" href="' + hr + '"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></a>').join('') + '</div>';
  h += '<h3>Les référentiels à connaître</h3><p class="prose">Ils n\'ont pas tous la même fonction : certains sont des normes de management certifiables, d\'autres des référentiels de reporting, des lignes directrices ou des textes obligatoires. Leur application dépend de la taille, du secteur et de la situation de l\'organisation.</p><div class="tablewrap"><table><thead><tr><th>Référentiel</th><th>Nature</th><th>À quoi il sert</th></tr></thead><tbody>' + DREFS.map(([a, b, c]) => '<tr><td><strong>' + esc(a) + '</strong></td><td><span class="pill ' + (/Réglementation/.test(b) ? 'r' : /certifiable/.test(b) ? 'b' : 'g') + '">' + esc(b) + '</span></td><td>' + esc(c) + '</td></tr>').join('') + '</tbody></table></div><p><a class="btn ghost sm" href="#normes">Toutes les normes et labels →</a></p>';
  el.innerHTML = h;
}
const domRoot = document.getElementById('domRoot');
domRoot.addEventListener('click', e => {
  const b = e.target.closest('[data-dm]'); if (!b) return;
  if (b.dataset.dm === 'spec') { e.preventDefault(); const k = b.dataset.k; if (LS.get('specialite') === k) { LS.set('specialite', ''); toast('Spécialité retirée'); } else { LS.set('specialite', k); toast('Spécialité enregistrée'); } renderDomaines(); try { renderDash(); } catch(err) {} }
  else if (b.dataset.dm === 'met') { P.openMetier = b.dataset.k; goTo('metiers'); }
  else if (b.dataset.dm === 'fiche') ficheRevision(b.dataset.k);
});
window.addEventListener('hashchange', () => { if (route().base === 'domaines') { renderDomaines(); window.scrollTo(0, 0); } });
(typeof pReady !== 'undefined' ? pReady : Promise.resolve()).then(renderDomaines, renderDomaines);
renderDomaines();
window.SERIKI_DOMS = DOMS; try { if (route().base === 'accueil') renderDash(); } catch(err) {}


/* =====================================================================
   EXPORTS RÉELS : WORD (.docx) ET PDF, SANS SERVEUR
   ===================================================================== */
const HW = {"Helvetica": [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 761, 556, 0, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0, 611, 0, 0, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 0, 500, 667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500], "Helvetica-Bold": [278, 333, 474, 556, 556, 889, 722, 238, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 333, 333, 584, 584, 584, 611, 975, 722, 722, 722, 722, 667, 611, 778, 722, 278, 556, 722, 611, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 333, 278, 333, 584, 556, 333, 556, 611, 556, 611, 556, 333, 611, 611, 278, 278, 556, 278, 889, 611, 611, 611, 611, 389, 556, 333, 611, 556, 778, 556, 556, 500, 389, 280, 389, 584, 761, 556, 0, 278, 556, 500, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0, 611, 0, 0, 278, 278, 500, 500, 350, 556, 1000, 333, 1000, 556, 333, 944, 0, 500, 667, 278, 333, 556, 556, 556, 556, 280, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 611, 556, 278, 333, 333, 365, 556, 834, 834, 834, 611, 722, 722, 722, 722, 722, 722, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 556, 556, 556, 556, 556, 278, 278, 278, 278, 611, 611, 611, 611, 611, 611, 611, 584, 611, 611, 611, 611, 611, 556, 611, 556], "Helvetica-Oblique": [278, 278, 355, 556, 556, 889, 667, 191, 333, 333, 389, 584, 278, 333, 278, 278, 556, 556, 556, 556, 556, 556, 556, 556, 556, 556, 278, 278, 584, 584, 584, 556, 1015, 667, 667, 722, 722, 667, 611, 778, 722, 278, 500, 667, 556, 833, 722, 778, 667, 778, 722, 667, 611, 722, 667, 944, 667, 667, 611, 278, 278, 278, 469, 556, 333, 556, 556, 500, 556, 556, 278, 556, 556, 222, 222, 500, 222, 833, 556, 556, 556, 556, 333, 500, 278, 556, 500, 722, 500, 500, 500, 334, 260, 334, 584, 761, 556, 0, 222, 556, 333, 1000, 556, 556, 333, 1000, 667, 333, 1000, 0, 611, 0, 0, 222, 222, 333, 333, 350, 556, 1000, 333, 1000, 500, 333, 944, 0, 500, 667, 278, 333, 556, 556, 556, 556, 260, 556, 333, 737, 370, 556, 584, 333, 737, 333, 400, 584, 333, 333, 333, 556, 537, 278, 333, 333, 365, 556, 834, 834, 834, 611, 667, 667, 667, 667, 667, 667, 1000, 722, 667, 667, 667, 667, 278, 278, 278, 278, 722, 722, 778, 778, 778, 778, 778, 584, 778, 722, 722, 722, 722, 667, 667, 611, 556, 556, 556, 556, 556, 556, 889, 500, 556, 556, 556, 556, 278, 278, 278, 278, 556, 556, 556, 556, 556, 556, 556, 584, 611, 556, 556, 556, 556, 500, 556, 500]};
function htmlBlocks(html){
  const doc = new DOMParser().parseFromString('<div>' + html + '</div>', 'text/html'), B = [];
  const alignOf = el => { const s = (el.getAttribute && el.getAttribute('style')) || ''; const m = s.match(/text-align\s*:\s*(center|right|justify|left)/i); return m ? m[1].toLowerCase() : (el.getAttribute && el.getAttribute('align')) || ''; };
  const runsOf = (el, st = {}) => { const R = []; el.childNodes.forEach(n => { if (n.nodeType === 3) { const t = n.textContent.replace(/\s+/g, ' '); if (t) R.push({t, b: !!st.b, i: !!st.i}); } else if (n.nodeType === 1) { const tg = n.tagName.toLowerCase(); if (tg === 'br') R.push({t: '\n'}); else if (['ul', 'ol', 'table', 'script', 'style', 'button', 'svg'].includes(tg)) {} else R.push(...runsOf(n, {b: st.b || ['b', 'strong', 'th'].includes(tg), i: st.i || ['i', 'em'].includes(tg)})); } }); return R; };
  const trim = R => { while (R.length && /^\s*$/.test(R[0].t)) R.shift(); while (R.length && /^\s*$/.test(R[R.length - 1].t)) R.pop(); if (R.length) { R[0].t = R[0].t.replace(/^\s+/, ''); R[R.length - 1].t = R[R.length - 1].t.replace(/\s+$/, ''); } return R; };
  const walk = (el, ctx) => { el.childNodes.forEach(n => {
    if (n.nodeType === 3) { if (n.textContent.trim()) B.push({k: 'p', r: [{t: n.textContent.trim()}], a: ctx.a}); return; }
    if (n.nodeType !== 1) return; const tg = n.tagName.toLowerCase(), a = alignOf(n) || ctx.a;
    if (['script', 'style', 'button', 'svg', 'img', 'input', 'select', 'textarea'].includes(tg)) return;
    if (/^h[1-6]$/.test(tg)) { const r = trim(runsOf(n, {b: true})); if (r.length) B.push({k: tg === 'h1' ? 'h1' : tg === 'h2' ? 'h2' : 'h3', r, a}); return; }
    if (tg === 'p' || tg === 'dt' || tg === 'dd' || tg === 'summary') { const r = trim(runsOf(n, {b: tg === 'dt'})); if (r.length) B.push({k: 'p', r, a}); return; }
    if (tg === 'ul' || tg === 'ol') { let i = 0; n.childNodes.forEach(li => { if (li.nodeType === 1 && li.tagName.toLowerCase() === 'li') { i++; const r = trim(runsOf(li)); if (r.length) B.push({k: 'li', r, n: tg === 'ol' ? i + '.' : '•', lvl: ctx.lvl || 0}); li.querySelectorAll(':scope > ul, :scope > ol').forEach(sub => walk({childNodes: [sub]}, Object.assign({}, ctx, {lvl: (ctx.lvl || 0) + 1}))); } }); return; }
    if (tg === 'table') { const rows = []; n.querySelectorAll('tr').forEach(tr => { const cells = [...tr.children].filter(c => /^t[dh]$/i.test(c.tagName)).map(c => ({r: trim(runsOf(c, {b: c.tagName.toLowerCase() === 'th'})), h: c.tagName.toLowerCase() === 'th'})); if (cells.length) rows.push(cells); }); if (rows.length) B.push({k: 'table', rows}); return; }
    if (tg === 'hr') { B.push({k: 'hr'}); return; }
    const hasBlock = [...n.children].some(c => /^(p|div|h[1-6]|ul|ol|table|section|article|details|dl|blockquote|hr)$/i.test(c.tagName));
    if (hasBlock) walk(n, {a, lvl: ctx.lvl}); else { const r = trim(runsOf(n)); if (r.length) B.push({k: 'p', r, a}); }
  }); };
  walk(doc.body.firstChild, {a: '', lvl: 0});
  return B;
}
/* ---------- Word (.docx) ---------- */
const xe = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
function docxRuns(R, size){ return R.map(x => x.t === '\n' ? '<w:r><w:br/></w:r>' : '<w:r><w:rPr>' + (x.b ? '<w:b/>' : '') + (x.i ? '<w:i/>' : '') + (size ? '<w:sz w:val="' + size + '"/>' : '') + '</w:rPr><w:t xml:space="preserve">' + xe(x.t) + '</w:t></w:r>').join(''); }
function docxXml(B){
  const jc = (a, d) => '<w:jc w:val="' + ({center: 'center', right: 'right', left: 'left', justify: 'both'}[a] || d) + '"/>';
  const body = B.map(b => {
    if (b.k === 'h1') return '<w:p><w:pPr><w:pStyle w:val="Heading1"/>' + jc(b.a, 'center') + '</w:pPr>' + docxRuns(b.r) + '</w:p>';
    if (b.k === 'h2') return '<w:p><w:pPr><w:pStyle w:val="Heading2"/>' + jc(b.a, 'left') + '</w:pPr>' + docxRuns(b.r) + '</w:p>';
    if (b.k === 'h3') return '<w:p><w:pPr><w:pStyle w:val="Heading3"/>' + jc(b.a, 'left') + '</w:pPr>' + docxRuns(b.r) + '</w:p>';
    if (b.k === 'li') { const ind = 360 + b.lvl * 360; return '<w:p><w:pPr><w:spacing w:after="60"/><w:ind w:left="' + (ind + 280) + '" w:hanging="280"/>' + jc('justify', 'both') + '</w:pPr><w:r><w:t xml:space="preserve">' + xe(b.n) + '\t</w:t></w:r>' + docxRuns(b.r) + '</w:p>'; }
    if (b.k === 'hr') return '<w:p><w:pPr><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="1" w:color="1D6A50"/></w:pBdr></w:pPr></w:p>';
    if (b.k === 'table') { const nc = Math.max(...b.rows.map(r => r.length)), w = Math.floor(9000 / nc); return '<w:tbl><w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblBorders>' + ['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(s => '<w:' + s + ' w:val="single" w:sz="4" w:color="B7C9C0"/>').join('') + '</w:tblBorders><w:tblCellMar><w:left w:w="90" w:type="dxa"/><w:right w:w="90" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>' + Array(nc).fill('<w:gridCol w:w="' + w + '"/>').join('') + '</w:tblGrid>' + b.rows.map(r => '<w:tr>' + r.map(c => '<w:tc><w:tcPr><w:tcW w:w="' + w + '" w:type="dxa"/>' + (c.h ? '<w:shd w:val="clear" w:color="auto" w:fill="E3EFE8"/>' : '') + '</w:tcPr><w:p><w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr>' + docxRuns(c.r, 20) + '</w:p></w:tc>').join('') + Array(nc - r.length).fill('<w:tc><w:tcPr><w:tcW w:w="' + w + '" w:type="dxa"/></w:tcPr><w:p/></w:tc>').join('') + '</w:tr>').join('') + '</w:tbl><w:p/>'; }
    return '<w:p><w:pPr>' + jc(b.a, 'both') + '</w:pPr>' + docxRuns(b.r) + '</w:p>';
  }).join('');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + body + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>';
}
const DOCX_STYLES = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:lang w:val="fr-FR"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="276" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="120" w:after="200"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:rFonts w:ascii="Georgia" w:hAnsi="Georgia"/><w:b/><w:color w:val="1D6A50"/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="240" w:after="100"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="1D6A50"/></w:pBdr><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:color w:val="1D6A50"/><w:sz w:val="26"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading3"><w:name w:val="heading 3"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="160" w:after="60"/><w:outlineLvl w:val="2"/></w:pPr><w:rPr><w:b/><w:sz w:val="23"/></w:rPr></w:style></w:styles>';
async function docxBlob(html){
  await loadScript('lib/jszip.min.js'); const z = new window.JSZip();
  z.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>');
  z.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>');
  z.file('word/_rels/document.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
  z.file('word/styles.xml', DOCX_STYLES); z.file('word/document.xml', docxXml(htmlBlocks(html)));
  return z.generateAsync({type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'});
}
/* ---------- PDF ---------- */
const PDF_SUB = {'₂': '2', '₃': '3', '²': '²', '→': '->', '←': '<-', '≤': '<=', '≥': '>=', '✓': 'v', '✕': 'x', '✗': 'x', ' ': ' ', ' ': ' ', ' ': ' ', '‑': '-', '−': '-', '≈': '~', '№': 'N°', '＋': '+', '－': '-'};
const CP = {'€': 128, '‚': 130, 'ƒ': 131, '„': 132, '…': 133, '†': 134, '‡': 135, 'ˆ': 136, '‰': 137, 'Š': 138, '‹': 139, 'Œ': 140, 'Ž': 142, '‘': 145, '’': 146, '“': 147, '”': 148, '•': 149, '–': 150, '—': 151, '˜': 152, '™': 153, 'š': 154, '›': 155, 'œ': 156, 'ž': 158, 'Ÿ': 159};
function pdfCodes(s){ const out = []; for (const ch0 of String(s)) { const ch = PDF_SUB[ch0] !== undefined ? PDF_SUB[ch0] : ch0; for (const ch2 of ch) { const c = ch2.charCodeAt(0); if (c >= 32 && c < 127) out.push(c); else if (c >= 160 && c < 256) out.push(c); else if (CP[ch2]) out.push(CP[ch2]); else if (c !== 10) out.push(63); } } return out; }
const PF = {F1: 'Helvetica', F2: 'Helvetica-Bold', F3: 'Helvetica-Oblique', F4: 'Helvetica-Bold'};
const fkey = x => x.b ? 'F2' : x.i ? 'F3' : 'F1';
const cw = (codes, f, sz) => codes.reduce((s, c) => s + (HW[PF[f]][c - 32] || 556), 0) * sz / 1000;
const hex = codes => '<' + codes.map(c => c.toString(16).padStart(2, '0')).join('') + '>';
function pdfBlob(html, titre){
  const B = htmlBlocks(html), W = 595.28, H = 841.89, M = 56, CWD = W - 2 * M, pages = []; let ops = [], y = H - M;
  const newPage = () => { if (ops.length) pages.push(ops); ops = []; y = H - M; };
  const need = h => { if (y - h < M + 20) newPage(); };
  const color = c => { const n = parseInt(c, 16); return ((n >> 16) / 255).toFixed(3) + ' ' + (((n >> 8) & 255) / 255).toFixed(3) + ' ' + ((n & 255) / 255).toFixed(3) + ' rg'; };
  const words = (R, sz, force) => { const L = []; R.forEach(x => { if (x.t === '\n') { L.push({br: true}); return; } const f = force || fkey(x); x.t.split(/(\s+)/).forEach(p => { if (!p) return; if (/^\s+$/.test(p)) L.push({sp: true}); else { const c = pdfCodes(p); L.push({c, f, w: cw(c, f, sz)}); } }); }); return L; };
  const lay = (L, width, sz) => { const lines = []; let cur = [], cw0 = 0, pend = false; const spw = cw([32], 'F1', sz); L.forEach(t => { if (t.br) { lines.push({w: cur, last: true}); cur = []; cw0 = 0; pend = false; return; } if (t.sp) { pend = cur.length > 0; return; } const add = (pend ? spw : 0) + t.w; if (cur.length && cw0 + add > width) { lines.push({w: cur, last: false}); cur = [Object.assign({gap: false}, t)]; cw0 = t.w; } else { cur.push(Object.assign({gap: pend}, t)); cw0 += add; } pend = false; }); if (cur.length) lines.push({w: cur, last: true}); return lines; };
  const draw = (lines, x0, width, sz, lead, align, col) => { lines.forEach(ln => { need(lead); y -= lead; const spw = cw([32], 'F1', sz), tot = ln.w.reduce((s, t) => s + t.w + (t.gap ? spw : 0), 0), gaps = ln.w.filter(t => t.gap).length; let x = x0, extra = 0; if (align === 'center') x = x0 + (width - tot) / 2; else if (align === 'right') x = x0 + width - tot; else if (align === 'justify' && !ln.last && gaps) extra = (width - tot) / gaps; ops.push(color(col || '1A2B24')); ln.w.forEach(t => { if (t.gap) x += spw + extra; ops.push('BT /' + t.f + ' ' + sz + ' Tf ' + x.toFixed(2) + ' ' + y.toFixed(2) + ' Td ' + hex(t.c) + ' Tj ET'); x += t.w; }); }); };
  B.forEach(b => {
    if (b.k === 'h1') { y -= 6; draw(lay(words(b.r, 17, 'F2'), CWD, 17), M, CWD, 17, 22, b.a || 'center', '1D6A50'); y -= 8; }
    else if (b.k === 'h2') { need(40); y -= 10; draw(lay(words(b.r, 13, 'F2'), CWD, 13), M, CWD, 13, 17, b.a || 'left', '1D6A50'); y -= 4; ops.push('0.114 0.416 0.314 RG 0.8 w ' + M + ' ' + y.toFixed(2) + ' m ' + (W - M) + ' ' + y.toFixed(2) + ' l S'); y -= 6; }
    else if (b.k === 'h3') { need(30); y -= 6; draw(lay(words(b.r, 11.5, 'F2'), CWD, 11.5), M, CWD, 11.5, 15, b.a || 'left'); y -= 2; }
    else if (b.k === 'li') { const ind = 16 + b.lvl * 16, L = lay(words(b.r, 10.5), CWD - ind - 12, 10.5); need(14); const yb = y - 14; ops.push('0 0 0 rg BT /F1 10.5 Tf ' + (M + ind) + ' ' + yb.toFixed(2) + ' Td ' + hex(pdfCodes(b.n)) + ' Tj ET'); draw(L, M + ind + 12, CWD - ind - 12, 10.5, 14, 'justify'); y -= 3; }
    else if (b.k === 'hr') { y -= 8; ops.push('0.114 0.416 0.314 RG 0.8 w ' + M + ' ' + y.toFixed(2) + ' m ' + (W - M) + ' ' + y.toFixed(2) + ' l S'); y -= 8; }
    else if (b.k === 'table') { const nc = Math.max(...b.rows.map(r => r.length)), colw = CWD / nc, pad = 4; y -= 4; b.rows.forEach(r => { const cells = Array.from({length: nc}, (_, i) => r[i] || {r: [], h: false}).map(c => ({c, L: lay(words(c.r, 9, c.h ? 'F2' : null), colw - 2 * pad, 9)})); const rh = Math.max(...cells.map(x => x.L.length), 1) * 12 + 2 * pad; need(rh); const top = y; cells.forEach((x, i) => { const cx = M + i * colw; if (x.c.h) ops.push('0.89 0.937 0.91 rg ' + cx.toFixed(2) + ' ' + (top - rh).toFixed(2) + ' ' + colw.toFixed(2) + ' ' + rh.toFixed(2) + ' re f'); ops.push('0.72 0.79 0.75 RG 0.5 w ' + cx.toFixed(2) + ' ' + (top - rh).toFixed(2) + ' ' + colw.toFixed(2) + ' ' + rh.toFixed(2) + ' re S'); y = top - pad + 2; draw(x.L, cx + pad, colw - 2 * pad, 9, 12, 'left'); }); y = top - rh; }); y -= 10; }
    else { const L = lay(words(b.r, 10.5), CWD, 10.5); draw(L, M, CWD, 10.5, 14.5, b.a || 'justify'); y -= 6; }
  });
  newPage(); if (!pages.length) pages.push([]);
  const objs = [], add = s => { objs.push(s); return objs.length; };
  const fontIds = Object.keys(PF).map(k => add('<< /Type /Font /Subtype /Type1 /BaseFont /' + PF[k] + ' /Encoding /WinAnsiEncoding >>'));
  const fontRes = '<< ' + Object.keys(PF).map((k, i) => '/' + k + ' ' + fontIds[i] + ' 0 R').join(' ') + ' >>';
  const pagesId = objs.length + 1; objs.push(null);
  const kids = [];
  pages.forEach((o, i) => { const foot = '0.45 0.5 0.48 rg BT /F1 8 Tf ' + M + ' 30 Td ' + hex(pdfCodes(String(titre || 'Document').slice(0, 60) + ' · SERIKI BIBLE RSE · généré le ' + new Date().toLocaleDateString('fr-FR'))) + ' Tj ET BT /F1 8 Tf ' + (W - M - 40) + ' 30 Td ' + hex(pdfCodes('Page ' + (i + 1) + ' / ' + pages.length)) + ' Tj ET'; const st = o.concat([foot]).join('\n'); const cid = add('<< /Length ' + st.length + ' >>\nstream\n' + st + '\nendstream'); kids.push(add('<< /Type /Page /Parent ' + pagesId + ' 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /Font ' + fontRes + ' >> /Contents ' + cid + ' 0 R >>')); });
  objs[pagesId - 1] = '<< /Type /Pages /Kids [' + kids.map(k => k + ' 0 R').join(' ') + '] /Count ' + kids.length + ' >>';
  const cat = add('<< /Type /Catalog /Pages ' + pagesId + ' 0 R >>'), info = add('<< /Title ' + hex([254, 255].concat(...[...String(titre || 'Document')].map(ch => { const c = ch.charCodeAt(0); return [c >> 8, c & 255]; }))) + ' /Producer (SERIKI BIBLE RSE) >>');
  let out = '%PDF-1.4\n%âãÏÓ\n'; const off = [];
  objs.forEach((o, i) => { off.push(out.length); out += (i + 1) + ' 0 obj\n' + o + '\nendobj\n'; });
  const xref = out.length; out += 'xref\n0 ' + (objs.length + 1) + '\n0000000000 65535 f \n' + off.map(o => String(o).padStart(10, '0') + ' 00000 n \n').join('') + 'trailer\n<< /Size ' + (objs.length + 1) + ' /Root ' + cat + ' 0 R /Info ' + info + ' 0 R >>\nstartxref\n' + xref + '\n%%EOF';
  const bytes = new Uint8Array(out.length); for (let i = 0; i < out.length; i++) bytes[i] = out.charCodeAt(i) & 255;
  return new Blob([bytes], {type: 'application/pdf'});
}
const titreDe = (html, nom) => nom || ((html.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/) || [])[1] || 'Document').replace(/<[^>]+>/g, '').trim();
const tampon = () => '<p style="text-align:right"><i>Document généré le ' + new Date().toLocaleDateString('fr-FR') + ' avec SERIKI BIBLE RSE. Données saisies par l\'utilisateur, à vérifier avant diffusion.</i></p>';
async function telechargerWord(html, nom){ try { const b = await docxBlob(html + tampon()); const ok = await saveBlob(b, nomFichier(titreDe(html, nom), '.docx')); if (ok !== false) toast('Document Word prêt'); } catch(e) { console.error(e); toast('Création du document Word impossible'); } }
async function telechargerPdf(html, nom){ try { const t = titreDe(html, nom), b = pdfBlob(html, t); const ok = await saveBlob(b, nomFichier(t, '.pdf')); if (ok !== false) toast('PDF prêt'); } catch(e) { console.error(e); toast('Création du PDF impossible'); } }
function choixExport(html, nom){
  modal('Enregistrer ce document', '<p>Choisissez le format.</p><div class="expch"><button class="btn" id="exPdf">' + ICO.doc + ' Télécharger en PDF</button><button class="btn ghost" id="exWord">' + ICO.doc + ' Télécharger en Word</button>' + (IN_PREVIEW ? '' : '<button class="btn ghost" id="exPrint">Imprimer</button>') + '</div>' + (IN_PREVIEW ? '<p class="note">Dans l\'aperçu Claude, l\'impression est bloquée ; le PDF et le Word fonctionnent. Une fois l\'application en ligne, le bouton Imprimer apparaît aussi ici.</p>' : '<p class="note">Le PDF et le Word reprennent les titres, les paragraphes justifiés, les listes et les tableaux. L\'impression garde la mise en page de l\'écran.</p>'), '', null, false, () => {
    const close = () => { document.getElementById('modal').hidden = true; };
    document.getElementById('exPdf').onclick = () => { close(); telechargerPdf(html, nom); };
    document.getElementById('exWord').onclick = () => { close(); telechargerWord(html, nom); };
    const p = document.getElementById('exPrint'); if (p) p.onclick = () => { close(); imprimerDirect(html); };
  });
}
function imprimerDirect(html){ const w = document.createElement('div'); w.className = 'printzone'; w.innerHTML = html; document.body.appendChild(w); document.body.classList.add('printing'); window.print(); setTimeout(() => { document.body.classList.remove('printing'); w.remove(); }, 500); }


/* =====================================================================
   BOÎTE À OUTILS PROJET : PROJETS (GANTT, RACI, BUDGET), RISQUES ESG,
   SWOT, INCIDENTS ET ACTIONS CORRECTIVES, SCÉNARIOS
   ===================================================================== */
const RK_CAT = ['Climatique physique (canicule, inondation, sécheresse)', 'Transition (réglementation, prix du carbone, marché)', 'Fournisseurs et chaîne de valeur', 'Pollution et environnement', 'Social et santé-sécurité', 'Droits humains', 'Non-conformité réglementaire', 'Réputation', 'Dépendance aux ressources naturelles', 'Éthique et corruption'];
const RACI = ['', 'R', 'A', 'C', 'I'];
const TB = {d: null, tab: 'projets', cur: null};
const pj0 = () => ({id: uid(), nom: 'Nouveau projet', dom: '', obj: '', ref: '', cible: '', chef: '', debut: ajd(), fin: '', budget: '', acteurs: ['Chef de projet', 'Direction', 'Services généraux', 'RH'], taches: [], raci: {}});
async function tbInit(){ try { TB.d = IDB.db && await IDB.get('kv', 'boite'); } catch(e) {} if (!TB.d) TB.d = {id: 'boite', projets: [], risques: [], swot: {f: '', fa: '', o: '', m: ''}, incidents: [], scen: [{nom: 'Scénario A', lev: []}, {nom: 'Scénario B', lev: []}]}; renderBoite(); }
const tbSave = () => IDB.put('kv', TB.d).catch(() => toast('Enregistrement impossible'));
const dnum = s => s ? Date.parse(s + 'T12:00:00') : NaN;
function pjStats(p){ const T = p.taches, n = T.length, av = n ? Math.round(T.reduce((s, t) => s + (+t.av || 0), 0) / n) : 0, prev = T.reduce((s, t) => s + (numK(t.bp) || 0), 0), reel = T.reduce((s, t) => s + (numK(t.br) || 0), 0), ret = T.filter(t => (+t.av || 0) < 100 && t.fin && t.fin < ajd()).length; return {n, av, prev, reel, ret}; }
function gantt(p){
  const T = p.taches.filter(t => t.deb && t.fin && dnum(t.fin) >= dnum(t.deb)); if (!T.length) return '<p class="note">Ajoutez des tâches avec une date de début et de fin pour voir le diagramme de Gantt.</p>';
  const t0 = Math.min(...T.map(t => dnum(t.deb))), t1 = Math.max(...T.map(t => dnum(t.fin))) + 864e5, span = t1 - t0, W = 760, L = 190, R = 10, row = 30, H = 34 + T.length * row, X = d => L + (d - t0) / span * (W - L - R);
  let g = '', m = new Date(t0); m.setDate(1);
  let lastX = -99; while (m.getTime() < t1) { const x = X(Math.max(m.getTime(), t0)); g += '<line x1="' + x + '" x2="' + x + '" y1="22" y2="' + H + '" stroke="var(--line)"/>'; if (x - lastX > 40) { g += '<text x="' + (x + 3) + '" y="15" font-size="10.5" fill="currentColor">' + m.toLocaleDateString('fr-FR', {month: 'short', year: '2-digit'}) + '</text>'; lastX = x; } m.setMonth(m.getMonth() + 1); }
  const today = Date.now(); if (today > t0 && today < t1) g += '<line x1="' + X(today) + '" x2="' + X(today) + '" y1="20" y2="' + H + '" stroke="#C2532A" stroke-dasharray="4 3"/>';
  T.forEach((t, i) => { const y = 30 + i * row, x1 = X(dnum(t.deb)), x2 = X(dnum(t.fin) + 864e5), w = Math.max(4, x2 - x1), av = Math.min(100, +t.av || 0), late = av < 100 && t.fin < ajd(); g += '<text x="4" y="' + (y + 13) + '" font-size="11.5" fill="currentColor">' + esc(String(t.nom).slice(0, 28)) + '</text><rect x="' + x1 + '" y="' + y + '" width="' + w + '" height="18" rx="5" fill="' + (late ? '#C2532A' : '#0F5B3E') + '" fill-opacity=".22"/><rect x="' + x1 + '" y="' + y + '" width="' + (w * av / 100) + '" height="18" rx="5" fill="' + (late ? '#C2532A' : '#0F5B3E') + '"/><text x="' + (x1 + w + 4) + '" y="' + (y + 13) + '" font-size="10.5" fill="currentColor">' + av + ' %</text>'; });
  return '<div class="gwrap"><svg class="gantt" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Diagramme de Gantt">' + g + '</svg></div>';
}
function heatmap(R){
  let h = '<div class="hm"><div class="hmy">Probabilité →</div><div class="hmg">';
  for (let p = 5; p >= 1; p--) for (let g = 1; g <= 5; g++) { const n = R.filter(r => +r.p === p && +r.g === g).length, sc = p * g; h += '<div class="hmc" style="--hv:' + (sc / 25) + '" title="Probabilité ' + p + ', gravité ' + g + '">' + (n ? '<b>' + n + '</b>' : '') + '</div>'; }
  return h + '</div><div class="hmx">Gravité →</div></div>';
}
function scenStats(s){ let inv = 0, gain = 0, t = 0, vie = 0; s.lev.forEach(l => { inv += numK(l.inv) || 0; gain += numK(l.gain) || 0; t += numK(l.t) || 0; vie = Math.max(vie, numK(l.vie) || 0); }); const duree = vie || 10, net = inv - gain * duree; return {inv, gain, t, roi: gain > 0 ? Math.round(inv / gain * 10) / 10 : null, ctonne: t > 0 ? Math.round(net / (t * duree)) : null, duree}; }
function renderBoite(){
  const el = document.getElementById('tbRoot'); if (!el || !TB.d) return;
  const sub = route().base === 'boite' ? route().sub : null; if (sub && ['projets', 'risques', 'swot', 'incidents', 'scenarios'].includes(sub)) TB.tab = sub;
  const d = TB.d;
  let h = '<div class="eyebrow">AGIR · BOÎTE À OUTILS</div><h2>Boîte à outils projet</h2><p class="lead">Les outils du quotidien d\'un chargé de mission RSE, réunis au même endroit : gérer ses projets avec un diagramme de Gantt, une matrice RACI et le suivi du budget ; tenir le registre des risques ESG ; faire une analyse SWOT ; suivre les incidents et leurs actions correctives ; comparer des scénarios selon leur coût et leurs résultats.</p>';
  h += '<div class="ptabs">' + [['projets', 'Projets', d.projets.length + ' projet' + (d.projets.length > 1 ? 's' : ''), ICO.flag], ['risques', 'Risques ESG', d.risques.length + ' risque' + (d.risques.length > 1 ? 's' : ''), ICO.radar], ['swot', 'SWOT durable', 'Forces, faiblesses…', ICO.chart], ['incidents', 'Incidents', d.incidents.filter(x => x.st !== 'Clos').length + ' ouvert' + (d.incidents.filter(x => x.st !== 'Clos').length > 1 ? 's' : ''), ICO.doc], ['scenarios', 'Scénarios', 'Coûts et résultats', ICO.bag]].map(([k, t, s, ic]) => '<a class="ptab' + (TB.tab === k ? ' on' : '') + '" href="#boite--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (TB.tab === 'projets') {
    const p = d.projets.find(x => x.id === TB.cur);
    if (!p) {
      const S = d.projets.map(pjStats), bud = S.reduce((a, s) => a + s.prev, 0), reel = S.reduce((a, s) => a + s.reel, 0);
      h += '<div class="tiles"><div class="tile"><div class="big">' + d.projets.length + '</div><div class="lbl">projets</div></div><div class="tile"><div class="big">' + (S.length ? Math.round(S.reduce((a, s) => a + s.av, 0) / S.length) : 0) + ' %</div><div class="lbl">avancement moyen</div></div><div class="tile"><div class="big">' + fmtK(reel) + ' €</div><div class="lbl">dépensés sur ' + fmtK(bud) + ' € prévus</div></div><div class="tile"><div class="big">' + S.reduce((a, s) => a + s.ret, 0) + '</div><div class="lbl">tâches en retard</div></div></div>';
      h += '<div class="ctool"><button class="btn" data-tb="newp">+ Nouveau projet</button>' + (d.projets.length ? '<button class="btn ghost" data-tb="xlsxp">Exporter tous les projets (Excel)</button>' : '<button class="btn ghost" data-tb="demop">Charger un exemple</button>') + '</div>';
      h += d.projets.length ? '<div class="lgrid">' + d.projets.map((x, i) => { const s = S[i]; return '<button class="card lcard pjc" data-tb="openp" data-k="' + x.id + '"><span class="pill">' + esc(x.dom || 'Projet RSE') + '</span><h4>' + esc(x.nom) + '</h4><p>' + esc(x.obj || 'Objectif à définir') + '</p><div class="rprog"><div><i style="width:' + s.av + '%"></i></div><b>' + s.av + ' %</b></div><p class="note">' + s.n + ' tâche' + (s.n > 1 ? 's' : '') + (s.ret ? ' · ' + s.ret + ' en retard' : '') + ' · ' + fmtK(s.reel) + ' € / ' + fmtK(s.prev) + ' €</p></button>'; }).join('') + '</div>' : '<div class="callout b"><strong>Aucun projet pour l\'instant</strong>Créez un projet (par exemple « Réduire de 20 % nos émissions d\'ici 2028 ») ou chargez l\'exemple.</div>';
    } else {
      const s = pjStats(p);
      h += '<button class="linkbtn" data-tb="backp">← Tous les projets</button><div class="card"><h4>Fiche projet</h4><div class="grid two" style="gap:0 14px">' + [['nom', 'Nom du projet'], ['dom', 'Domaine (climat, déchets, achats…)'], ['chef', 'Chef de projet'], ['budget', 'Budget global (€)']].map(([k, l]) => '<div class="row"><label>' + l + '<input class="inp" data-pj="' + k + '" value="' + esc(p[k]) + '"></label></div>').join('') + '<div class="row"><label>Début<input class="inp" type="date" data-pj="debut" value="' + esc(p.debut) + '"></label></div><div class="row"><label>Fin prévue<input class="inp" type="date" data-pj="fin" value="' + esc(p.fin) + '"></label></div></div>' + [['obj', 'Objectif chiffré', 'Ex. : réduire de 20 % les émissions des scopes 1 et 2 d\'ici fin 2028'], ['ref', 'Situation de référence', 'Ex. : 1 000 tCO₂e en 2025'], ['cible', 'Résultat attendu et indicateur de suivi', 'Ex. : 800 tCO₂e en 2028, suivi annuel']].map(([k, l, ph]) => '<div class="row"><label>' + l + '<textarea class="inp" rows="2" data-pj="' + k + '" placeholder="' + ph + '">' + esc(p[k]) + '</textarea></label></div>').join('') + '<div class="ctool"><button class="btn" data-tb="docp">Fiche projet (PDF ou Word)</button><button class="btn ghost" data-tb="xlsxp1">Exporter le projet (Excel)</button><button class="btn ghost" style="color:var(--danger)" data-tb="delp">Supprimer le projet</button></div></div>';
      h += '<div class="tiles"><div class="tile"><div class="big">' + s.av + ' %</div><div class="lbl">avancement</div></div><div class="tile"><div class="big">' + fmtK(s.reel) + ' €</div><div class="lbl">dépensés</div></div><div class="tile"><div class="big">' + fmtK(s.prev) + ' €</div><div class="lbl">prévus</div></div><div class="tile"><div class="big">' + s.ret + '</div><div class="lbl">tâches en retard</div></div></div>';
      h += '<h3>Tâches</h3>' + (p.taches.length ? '<div class="tablewrap"><table class="pjtab"><thead><tr><th>Tâche</th><th>Responsable</th><th>Début</th><th>Fin</th><th>Avancement</th><th>Budget prévu (€)</th><th>Dépensé (€)</th><th></th></tr></thead><tbody>' + p.taches.map((t, i) => '<tr' + ((+t.av || 0) < 100 && t.fin && t.fin < ajd() ? ' class="late"' : '') + '><td><input class="kin" data-tt="' + i + '" data-k="nom" value="' + esc(t.nom) + '"></td><td><input class="kin" data-tt="' + i + '" data-k="resp" value="' + esc(t.resp) + '"></td><td><input class="kin" type="date" data-tt="' + i + '" data-k="deb" value="' + esc(t.deb) + '"></td><td><input class="kin" type="date" data-tt="' + i + '" data-k="fin" value="' + esc(t.fin) + '"></td><td><select class="kin" data-tt="' + i + '" data-k="av">' + [0, 10, 25, 50, 75, 90, 100].map(v => '<option value="' + v + '"' + (+t.av === v ? ' selected' : '') + '>' + v + ' %</option>').join('') + '</select></td><td><input class="kin" inputmode="decimal" data-tt="' + i + '" data-k="bp" value="' + esc(t.bp) + '"></td><td><input class="kin" inputmode="decimal" data-tt="' + i + '" data-k="br" value="' + esc(t.br) + '"></td><td><button class="linkbtn" style="color:var(--danger)" data-tb="delt" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost" data-tb="addt">+ Ajouter une tâche</button></div>';
      h += '<h3>Diagramme de Gantt</h3>' + gantt(p);
      h += '<h3>Matrice RACI</h3><p class="prose">Pour chaque tâche : qui la <strong>R</strong>éalise, qui en est <strong>A</strong>utorité et rend des comptes (une seule personne), qui est <strong>C</strong>onsulté, qui est <strong>I</strong>nformé. Touchez une case pour changer la lettre.</p>' + (p.taches.length ? '<div class="tablewrap"><table class="racitab"><thead><tr><th>Tâche</th>' + p.acteurs.map((a, j) => '<th><input class="kin" data-acteur="' + j + '" value="' + esc(a) + '" aria-label="Acteur"></th>').join('') + '<th><button class="linkbtn" data-tb="adda">+ Acteur</button></th></tr></thead><tbody>' + p.taches.map((t, i) => { const nA = p.acteurs.filter((a, j) => (p.raci[t.id + '|' + j] || '') === 'A').length; return '<tr><td>' + esc(t.nom) + (nA !== 1 ? ' <span class="pill o">' + (nA ? nA + ' « A »' : 'aucun « A »') + '</span>' : '') + '</td>' + p.acteurs.map((a, j) => { const v = p.raci[t.id + '|' + j] || ''; return '<td><button class="rc rc' + (v || '0') + '" data-tb="raci" data-k="' + t.id + '|' + j + '">' + (v || '·') + '</button></td>'; }).join('') + '<td></td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="note">Ajoutez d\'abord des tâches.</p>');
    }
  } else if (TB.tab === 'risques') {
    const R = d.risques.map((r, i) => Object.assign({i, sc: (+r.p || 0) * (+r.g || 0), res: (+r.rp || 0) * (+r.rg || 0)}, r)).sort((a, b) => b.sc - a.sc);
    h += '<p class="prose">Le registre des risques liés à la durabilité. Pour chaque risque : probabilité et gravité de 1 à 5 (avant mesures), les mesures de prévention et d\'action, puis le risque résiduel (après mesures). La carte de chaleur montre où se concentrent les risques.</p><div class="ctool"><button class="btn" data-tb="addr">+ Ajouter un risque</button>' + (d.risques.length ? '<button class="btn ghost" data-tb="xlsxr">Exporter le registre (Excel)</button>' : '<button class="btn ghost" data-tb="demor">Charger un exemple</button>') + '</div>';
    if (R.length) h += '<div class="grid two"><div class="card"><h4>Carte de chaleur (avant mesures)</h4>' + heatmap(d.risques) + '</div><div class="card"><h4>Les plus critiques</h4><ol>' + R.slice(0, 5).map(r => '<li><strong>' + esc(r.desc) + '</strong> <span class="pill ' + (r.sc >= 15 ? 'r' : r.sc >= 8 ? 'o' : 'g') + '">' + r.sc + ' / 25</span>' + (r.rp && r.rg ? ' → résiduel <span class="pill ' + (r.res >= 15 ? 'r' : r.res >= 8 ? 'o' : 'g') + '">' + r.res + '</span>' : '') + '</li>').join('') + '</ol></div></div><div class="tablewrap"><table><thead><tr><th>Risque</th><th>Catégorie</th><th>Score</th><th>Prévention et actions</th><th>Responsable</th><th>Échéance</th><th>Résiduel</th><th></th></tr></thead><tbody>' + R.map(r => '<tr><td><strong>' + esc(r.desc) + '</strong>' + (r.qui ? '<br><small>' + esc(r.qui) + '</small>' : '') + '</td><td>' + esc(r.cat) + '</td><td><span class="heat" style="--hv:' + r.sc / 25 + '">' + r.sc + '</span></td><td>' + esc(r.prev || '') + (r.act ? '<br><small>' + esc(r.act) + '</small>' : '') + '</td><td>' + esc(r.resp || '') + '</td><td>' + esc(r.ech || '') + '</td><td>' + (r.rp && r.rg ? '<span class="heat" style="--hv:' + r.res / 25 + '">' + r.res + '</span>' : '–') + '</td><td><button class="linkbtn" data-tb="editr" data-i="' + r.i + '">Modifier</button> <button class="linkbtn" style="color:var(--danger)" data-tb="delr" data-i="' + r.i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>';
  } else if (TB.tab === 'swot') {
    const Q = [['f', 'Forces', 'Ce que l\'organisation fait déjà bien en matière de durabilité.', '#0F5B3E'], ['fa', 'Faiblesses', 'Ce qui manque ou freine en interne.', '#C2532A'], ['o', 'Opportunités', 'Ce que l\'extérieur offre : marchés, aides, attentes des clients.', '#2357A6'], ['m', 'Menaces', 'Ce que l\'extérieur fait peser : réglementation, climat, concurrence.', '#8A5214']];
    h += '<p class="prose">L\'analyse SWOT appliquée à la durabilité : une idée par ligne. Elle sert à préparer une stratégie RSE ou à présenter la situation à la direction.</p><div class="swot">' + Q.map(([k, t, x, c]) => '<div class="card swq" style="--dc:' + c + '"><h4>' + t + '</h4><p class="note">' + x + '</p><textarea class="inp" rows="7" data-sw="' + k + '" placeholder="Une idée par ligne">' + esc(d.swot[k] || '') + '</textarea></div>').join('') + '</div><div class="ctool"><button class="btn" data-tb="docswot">Télécharger (PDF ou Word)</button></div><div class="exbox"><strong>Exemple</strong><p>Forces : site certifié ISO 14001, équipe motivée. Faiblesses : aucun bilan carbone, données dispersées. Opportunités : clients qui demandent des produits bas carbone, aides de l\'ADEME. Menaces : hausse du prix de l\'énergie, nouvelles obligations de reporting des clients.</p></div>';
  } else if (TB.tab === 'incidents') {
    h += '<p class="prose">Le registre des incidents environnementaux, sociaux ou de conformité, et des actions correctives. C\'est une exigence des systèmes de management (ISO 14001, ISO 45001) et une preuve de sérieux en audit.</p><div class="ctool"><button class="btn" data-tb="addi">+ Déclarer un incident</button>' + (d.incidents.length ? '<button class="btn ghost" data-tb="xlsxi">Exporter (Excel)</button>' : '') + '</div>' + (d.incidents.length ? '<div class="tablewrap"><table><thead><tr><th>Date</th><th>Site</th><th>Type</th><th>Description</th><th>Gravité</th><th>Cause</th><th>Action corrective</th><th>Responsable</th><th>Échéance</th><th>Statut</th><th></th></tr></thead><tbody>' + d.incidents.map((x, i) => '<tr><td>' + esc(x.date) + '</td><td>' + esc(x.site) + '</td><td>' + esc(x.type) + '</td><td>' + esc(x.desc) + '</td><td><span class="pill ' + (x.grav === 'Majeure' ? 'r' : x.grav === 'Moyenne' ? 'o' : 'g') + '">' + esc(x.grav) + '</span></td><td>' + esc(x.cause) + '</td><td>' + esc(x.act) + '</td><td>' + esc(x.resp) + '</td><td>' + esc(x.ech) + '</td><td><select class="kin" data-inc="' + i + '">' + ['Ouvert', 'En cours', 'Clos'].map(v => '<option' + (x.st === v ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></td><td><button class="linkbtn" style="color:var(--danger)" data-tb="deli" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '<div class="callout b"><strong>Aucun incident enregistré</strong>Exemples : déversement d\'huile, dépassement d\'un seuil de rejet, accident sans arrêt, plainte de riverain, non-conformité relevée en audit.</div>');
  } else {
    h += '<p class="prose">Comparez deux ou trois scénarios d\'actions. Pour chaque levier : l\'investissement, le gain annuel (économies), les tonnes de CO₂e évitées par an et la durée de vie. L\'application calcule le temps de retour sur investissement et le coût par tonne évitée (négatif quand le levier rapporte plus qu\'il ne coûte).</p><div class="scgrid">' + d.scen.map((sc, si) => { const st = scenStats(sc); return '<div class="card"><input class="inp scn" data-scn="' + si + '" value="' + esc(sc.nom) + '"><div class="tablewrap"><table class="sctab"><thead><tr><th>Levier</th><th>Invest. (€)</th><th>Gain / an (€)</th><th>tCO₂e / an</th><th>Durée (ans)</th><th></th></tr></thead><tbody>' + sc.lev.map((l, li) => '<tr>' + ['nom', 'inv', 'gain', 't', 'vie'].map(k => '<td><input class="kin" data-sl="' + si + '|' + li + '" data-k="' + k + '" value="' + esc(l[k] || '') + '"></td>').join('') + '<td><button class="linkbtn" style="color:var(--danger)" data-tb="dell" data-k="' + si + '|' + li + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div><button class="btn ghost sm" data-tb="addl" data-k="' + si + '">+ Levier</button><div class="scres"><div><b>' + fmtK(st.inv) + ' €</b><small>investissement</small></div><div><b>' + fmtK(st.gain) + ' €</b><small>gain par an</small></div><div><b>' + fmtK(st.t) + ' t</b><small>CO₂e évitées par an</small></div><div><b>' + (st.roi == null ? '–' : vf(st.roi) + ' ans') + '</b><small>retour sur investissement</small></div><div><b>' + (st.ctonne == null ? '–' : fmtK(st.ctonne) + ' €') + '</b><small>par tonne évitée</small></div></div></div>'; }).join('') + '</div><div class="ctool">' + (d.scen.length < 3 ? '<button class="btn ghost" data-tb="adds">+ Scénario</button>' : '') + '<button class="btn ghost" data-tb="demos">Charger un exemple</button><button class="btn" data-tb="xlsxs">Exporter la comparaison (Excel)</button></div><p class="note">Calcul simplifié, sans actualisation ni inflation : il sert à comparer des options, pas à remplacer une étude financière.</p>';
  }
  h += '<p class="foot">Vos données restent sur cet appareil. Pensez à exporter régulièrement vos fichiers Excel pour les sauvegarder et les partager.</p>';
  el.innerHTML = h;
}
function riskModal(i){
  const r = i == null ? {} : TB.d.risques[i], o = (id, L, v) => '<select class="inp" id="' + id + '">' + L.map(x => '<option' + (String(v) === String(x) ? ' selected' : '') + '>' + x + '</option>').join('') + '</select>', n15 = [1, 2, 3, 4, 5];
  modal(i == null ? 'Ajouter un risque ESG' : 'Modifier le risque', '<div class="row"><label>Description du risque<textarea class="inp" rows="2" id="rD">' + esc(r.desc || '') + '</textarea></label></div><div class="row"><label>Catégorie' + o('rC', RK_CAT, r.cat) + '</label></div><div class="row"><label>Personnes ou activités concernées<input class="inp" id="rQ" value="' + esc(r.qui || '') + '"></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label>Probabilité (1 à 5)' + o('rP', n15, r.p || 3) + '</label></div><div class="row"><label>Gravité (1 à 5)' + o('rG', n15, r.g || 3) + '</label></div></div><div class="row"><label>Mesures de prévention<textarea class="inp" rows="2" id="rPr">' + esc(r.prev || '') + '</textarea></label></div><div class="row"><label>Actions correctives<textarea class="inp" rows="2" id="rA">' + esc(r.act || '') + '</textarea></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label>Responsable<input class="inp" id="rR" value="' + esc(r.resp || '') + '"></label></div><div class="row"><label>Échéance<input class="inp" type="date" id="rE" value="' + esc(r.ech || '') + '"></label></div><div class="row"><label>Probabilité résiduelle' + o('rRP', ['', ...n15], r.rp || '') + '</label></div><div class="row"><label>Gravité résiduelle' + o('rRG', ['', ...n15], r.rg || '') + '</label></div></div>', 'Enregistrer', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('rD')) return false; const x = {desc: v('rD'), cat: v('rC'), qui: v('rQ'), p: v('rP'), g: v('rG'), prev: v('rPr'), act: v('rA'), resp: v('rR'), ech: v('rE'), rp: v('rRP'), rg: v('rRG')}; if (i == null) TB.d.risques.push(x); else TB.d.risques[i] = x; await tbSave(); renderBoite(); });
}
function pjHtml(p){ const s = pjStats(p); return '<h1>Fiche projet : ' + esc(p.nom) + '</h1><p style="text-align:center">' + esc(p.dom || 'Projet RSE') + ' · Chef de projet : ' + esc(p.chef || '[à définir]') + ' · ' + esc(p.debut || '') + (p.fin ? ' → ' + esc(p.fin) : '') + '</p><h2>Objectif</h2><p>' + esc(p.obj || '[à définir]') + '</p><h2>Situation de référence</h2><p>' + esc(p.ref || '[à définir]') + '</p><h2>Résultat attendu et suivi</h2><p>' + esc(p.cible || '[à définir]') + '</p><h2>Avancement</h2><p>Avancement moyen : ' + s.av + ' %. Budget : ' + fmtK(s.reel) + ' € dépensés sur ' + fmtK(s.prev) + ' € prévus' + (p.budget ? ' (enveloppe globale : ' + esc(p.budget) + ' €)' : '') + '. Tâches en retard : ' + s.ret + '.</p><h2>Tâches</h2><table border="1"><tr><th>Tâche</th><th>Responsable</th><th>Début</th><th>Fin</th><th>Avancement</th><th>Budget prévu</th><th>Dépensé</th></tr>' + p.taches.map(t => '<tr><td>' + esc(t.nom) + '</td><td>' + esc(t.resp || '') + '</td><td>' + esc(t.deb || '') + '</td><td>' + esc(t.fin || '') + '</td><td>' + (+t.av || 0) + ' %</td><td>' + esc(t.bp || '') + '</td><td>' + esc(t.br || '') + '</td></tr>').join('') + '</table>' + (p.taches.length ? '<h2>Matrice RACI</h2><table border="1"><tr><th>Tâche</th>' + p.acteurs.map(a => '<th>' + esc(a) + '</th>').join('') + '</tr>' + p.taches.map(t => '<tr><td>' + esc(t.nom) + '</td>' + p.acteurs.map((a, j) => '<td>' + (p.raci[t.id + '|' + j] || '') + '</td>').join('') + '</tr>').join('') + '</table><p>R : réalise · A : autorité, rend des comptes · C : consulté · I : informé.</p>' : ''); }
const pjRows = p => p.taches.map(t => ({Projet: p.nom, Tâche: t.nom, Responsable: t.resp || '', Début: t.deb || '', Fin: t.fin || '', 'Avancement (%)': +t.av || 0, 'Budget prévu (€)': numK(t.bp) ?? '', 'Dépensé (€)': numK(t.br) ?? '', 'En retard': (+t.av || 0) < 100 && t.fin && t.fin < ajd() ? 'Oui' : 'Non'}));
const tbRoot = document.getElementById('tbRoot');
tbRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-tb]'); if (!b || b.tagName === 'INPUT' || b.tagName === 'SELECT') return; const a = b.dataset.tb, d = TB.d, p = d.projets.find(x => x.id === TB.cur);
  try {
    if (a === 'newp') { const x = pj0(); d.projets.push(x); TB.cur = x.id; await tbSave(); renderBoite(); }
    else if (a === 'openp') { TB.cur = b.dataset.k; renderBoite(); window.scrollTo(0, 0); }
    else if (a === 'backp') { TB.cur = null; renderBoite(); }
    else if (a === 'delp') modal('Supprimer ce projet ?', '<p>« ' + esc(p.nom) + ' » et toutes ses tâches seront supprimés.</p>', 'Supprimer', async () => { d.projets = d.projets.filter(x => x.id !== p.id); TB.cur = null; await tbSave(); renderBoite(); }, true);
    else if (a === 'demop') { const y = new Date().getFullYear(), x = Object.assign(pj0(), {nom: 'Réduire de 20 % nos émissions d\'ici 2028', dom: 'Climat', obj: 'Réduire de 20 % les émissions des scopes 1 et 2 entre 2025 et 2028.', ref: '1 000 tCO₂e en 2025 (bilan carbone de mars).', cible: '800 tCO₂e en 2028 ; suivi annuel dans le tableau de bord.', chef: 'Chargé de mission RSE', debut: y + '-01-15', fin: (y + 2) + '-12-31', budget: '420000', acteurs: ['Chargé RSE', 'Direction', 'Services généraux', 'Achats']}); x.taches = [['Bilan carbone détaillé', 'Chargé RSE', y + '-01-15', y + '-03-31', 100, '12000', '11500'], ['Audit énergétique des sites', 'Services généraux', y + '-03-01', y + '-05-31', 75, '15000', '9000'], ['Remplacement de la chaudière', 'Services généraux', y + '-06-01', y + '-10-31', 25, '350000', '80000'], ['Contrat d\'électricité renouvelable', 'Achats', y + '-04-01', y + '-06-30', 50, '0', '0'], ['Sensibilisation des équipes', 'Chargé RSE', y + '-02-01', y + '-12-15', 50, '8000', '3000']].map(([nom, resp, deb, fin, av, bp, br]) => ({id: uid(), nom, resp, deb, fin, av, bp, br})); x.taches.forEach((t, i) => { x.raci[t.id + '|1'] = 'A'; x.raci[t.id + '|' + (i === 3 ? 3 : i === 1 || i === 2 ? 2 : 0)] = 'R'; x.raci[t.id + '|0'] = x.raci[t.id + '|0'] || 'C'; }); d.projets.push(x); await tbSave(); renderBoite(); }
    else if (a === 'addt') { p.taches.push({id: uid(), nom: 'Nouvelle tâche', resp: '', deb: ajd(), fin: '', av: 0, bp: '', br: ''}); await tbSave(); renderBoite(); }
    else if (a === 'delt') { p.taches.splice(+b.dataset.i, 1); await tbSave(); renderBoite(); }
    else if (a === 'adda') { p.acteurs.push('Acteur ' + (p.acteurs.length + 1)); await tbSave(); renderBoite(); }
    else if (a === 'raci') { const v = p.raci[b.dataset.k] || ''; p.raci[b.dataset.k] = RACI[(RACI.indexOf(v) + 1) % RACI.length]; await tbSave(); const y = window.scrollY; renderBoite(); window.scrollTo(0, y); }
    else if (a === 'docp') printHtml(pjHtml(p), 'Fiche projet ' + p.nom);
    else if (a === 'xlsxp1') await atXlsx('Projet ' + p.nom, [['Tâches', pjRows(p)], ['Fiche', [{Rubrique: 'Objectif', Contenu: p.obj}, {Rubrique: 'Référence', Contenu: p.ref}, {Rubrique: 'Résultat attendu', Contenu: p.cible}, {Rubrique: 'Chef de projet', Contenu: p.chef}, {Rubrique: 'Budget global (€)', Contenu: p.budget}]]]);
    else if (a === 'xlsxp') await atXlsx('Portefeuille de projets RSE', [['Projets', d.projets.map(x => { const s = pjStats(x); return {Projet: x.nom, Domaine: x.dom, 'Chef de projet': x.chef, Début: x.debut, Fin: x.fin, 'Avancement (%)': s.av, 'Budget prévu (€)': s.prev, 'Dépensé (€)': s.reel, 'Tâches en retard': s.ret}; })], ['Tâches', d.projets.flatMap(pjRows)]]);
    else if (a === 'addr') riskModal(null);
    else if (a === 'editr') riskModal(+b.dataset.i);
    else if (a === 'delr') { d.risques.splice(+b.dataset.i, 1); await tbSave(); renderBoite(); }
    else if (a === 'demor') { d.risques = [{desc: 'Inondation du site principal situé en zone inondable', cat: RK_CAT[0], qui: 'Production, stocks', p: '3', g: '5', prev: 'Plan de continuité, stockage en hauteur', act: 'Étude de vulnérabilité', resp: 'Directeur de site', ech: '', rp: '2', rg: '4'}, {desc: 'Hausse du prix du carbone et de l\'énergie', cat: RK_CAT[1], qui: 'Finance, production', p: '4', g: '3', prev: 'Plan d\'efficacité énergétique', act: 'Contrat d\'énergie à prix fixe', resp: 'Directeur financier', ech: '', rp: '3', rg: '2'}, {desc: 'Travail forcé chez un fournisseur textile', cat: RK_CAT[2], qui: 'Salariés des fournisseurs', p: '2', g: '5', prev: 'Charte fournisseurs, audits sociaux', act: 'Plan correctif ou arrêt de la relation', resp: 'Responsable achats', ech: '', rp: '1', rg: '5'}, {desc: 'Accidents lors des manutentions', cat: RK_CAT[4], qui: 'Logistique', p: '4', g: '3', prev: 'Formation gestes et postures, chariots', act: 'Analyse de chaque accident', resp: 'Responsable sécurité', ech: '', rp: '2', rg: '3'}]; await tbSave(); renderBoite(); }
    else if (a === 'xlsxr') await atXlsx('Registre des risques ESG', [['Risques', d.risques.map(r => ({Risque: r.desc, Catégorie: r.cat, Concernés: r.qui, Probabilité: +r.p, Gravité: +r.g, Score: (+r.p) * (+r.g), Prévention: r.prev, 'Actions correctives': r.act, Responsable: r.resp, Échéance: r.ech, 'Probabilité résiduelle': r.rp, 'Gravité résiduelle': r.rg, 'Score résiduel': r.rp && r.rg ? (+r.rp) * (+r.rg) : ''}))]]);
    else if (a === 'docswot') { const L = k => (d.swot[k] || '').split('\n').filter(x => x.trim()).map(x => '<li>' + esc(x) + '</li>').join('') || '<li>À compléter</li>'; printHtml('<h1>Analyse SWOT de la durabilité</h1><p style="text-align:center">' + new Date().toLocaleDateString('fr-FR') + '</p><h2>Forces</h2><ul>' + L('f') + '</ul><h2>Faiblesses</h2><ul>' + L('fa') + '</ul><h2>Opportunités</h2><ul>' + L('o') + '</ul><h2>Menaces</h2><ul>' + L('m') + '</ul>', 'Analyse SWOT'); }
    else if (a === 'addi') modal('Déclarer un incident', '<div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label>Date<input class="inp" type="date" id="iD" value="' + ajd() + '"></label></div><div class="row"><label>Site<input class="inp" id="iS"></label></div><div class="row"><label>Type<select class="inp" id="iT"><option>Environnement</option><option>Santé et sécurité</option><option>Social</option><option>Conformité</option><option>Fournisseur</option></select></label></div><div class="row"><label>Gravité<select class="inp" id="iG"><option>Mineure</option><option>Moyenne</option><option>Majeure</option></select></label></div></div><div class="row"><label>Description<textarea class="inp" rows="2" id="iDe"></textarea></label></div><div class="row"><label>Cause identifiée<textarea class="inp" rows="2" id="iC"></textarea></label></div><div class="row"><label>Action corrective<textarea class="inp" rows="2" id="iA"></textarea></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label>Responsable<input class="inp" id="iR"></label></div><div class="row"><label>Échéance<input class="inp" type="date" id="iE"></label></div></div>', 'Enregistrer', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('iDe')) return false; d.incidents.unshift({date: v('iD'), site: v('iS'), type: v('iT'), grav: v('iG'), desc: v('iDe'), cause: v('iC'), act: v('iA'), resp: v('iR'), ech: v('iE'), st: 'Ouvert'}); await tbSave(); renderBoite(); });
    else if (a === 'deli') { d.incidents.splice(+b.dataset.i, 1); await tbSave(); renderBoite(); }
    else if (a === 'xlsxi') await atXlsx('Registre des incidents', [['Incidents', d.incidents.map(x => ({Date: x.date, Site: x.site, Type: x.type, Gravité: x.grav, Description: x.desc, Cause: x.cause, 'Action corrective': x.act, Responsable: x.resp, Échéance: x.ech, Statut: x.st}))]]);
    else if (a === 'adds') { d.scen.push({nom: 'Scénario ' + 'ABC'[d.scen.length], lev: []}); await tbSave(); renderBoite(); }
    else if (a === 'addl') { d.scen[+b.dataset.k].lev.push({nom: '', inv: '', gain: '', t: '', vie: ''}); await tbSave(); renderBoite(); }
    else if (a === 'dell') { const [si, li] = b.dataset.k.split('|').map(Number); d.scen[si].lev.splice(li, 1); await tbSave(); renderBoite(); }
    else if (a === 'demos') { d.scen = [{nom: 'Scénario A : sobriété', lev: [{nom: 'Éclairage LED', inv: '40000', gain: '12000', t: '6', vie: '15'}, {nom: 'Réglage du chauffage', inv: '5000', gain: '8000', t: '20', vie: '10'}]}, {nom: 'Scénario B : investissement', lev: [{nom: 'Pompe à chaleur', inv: '350000', gain: '40000', t: '180', vie: '20'}, {nom: 'Panneaux solaires', inv: '120000', gain: '14000', t: '8', vie: '25'}]}]; await tbSave(); renderBoite(); }
    else if (a === 'xlsxs') await atXlsx('Comparaison de scenarios', [['Synthèse', d.scen.map(sc => { const s = scenStats(sc); return {Scénario: sc.nom, 'Investissement (€)': s.inv, 'Gain annuel (€)': s.gain, 'tCO2e évitées par an': s.t, 'Retour sur investissement (ans)': s.roi ?? '', 'Coût par tonne évitée (€)': s.ctonne ?? ''}; })], ['Leviers', d.scen.flatMap(sc => sc.lev.map(l => ({Scénario: sc.nom, Levier: l.nom, 'Investissement (€)': numK(l.inv) ?? '', 'Gain annuel (€)': numK(l.gain) ?? '', 'tCO2e par an': numK(l.t) ?? '', 'Durée de vie (ans)': numK(l.vie) ?? ''})))]]);
  } catch(err) { toast('Opération impossible'); }
});
tbRoot.addEventListener('change', async e => {
  const t = e.target, d = TB.d, p = d.projets.find(x => x.id === TB.cur), keep = async () => { await tbSave(); const y = window.scrollY; renderBoite(); window.scrollTo(0, y); };
  if (t.dataset.pj) { p[t.dataset.pj] = t.value; await keep(); }
  else if (t.dataset.tt != null) { p.taches[+t.dataset.tt][t.dataset.k] = t.dataset.k === 'av' ? +t.value : t.value; await keep(); }
  else if (t.dataset.acteur != null && p) { p.acteurs[+t.dataset.acteur] = t.value; await keep(); }
  else if (t.dataset.sw) { d.swot[t.dataset.sw] = t.value; await tbSave(); }
  else if (t.dataset.inc != null) { d.incidents[+t.dataset.inc].st = t.value; await keep(); }
  else if (t.dataset.scn != null) { d.scen[+t.dataset.scn].nom = t.value; await keep(); }
  else if (t.dataset.sl) { const [si, li] = t.dataset.sl.split('|').map(Number); d.scen[si].lev[li][t.dataset.k] = t.value; await keep(); }
});
window.addEventListener('hashchange', () => { if (route().base === 'boite') renderBoite(); });
espaceReady.then(tbInit, tbInit);


const QZ = {
 environnement: [
  ['Quelle norme internationale encadre le management environnemental et peut être certifiée ?', ['ISO 26000', 'ISO 14001', 'ISO 45001', 'ISO 9001'], 1, 'L\'ISO 14001 est la norme certifiable du système de management environnemental. L\'ISO 26000 donne des lignes directrices non certifiables, l\'ISO 45001 porte sur la santé-sécurité, l\'ISO 9001 sur la qualité.'],
  ['Dans les normes européennes de reporting, quelles normes couvrent la pollution, l\'eau, la biodiversité et les ressources ?', ['ESRS S1 à S4', 'ESRS E2 à E5', 'ESRS G1', 'ESRS 1 et 2'], 1, 'E1 traite du climat ; E2 de la pollution, E3 de l\'eau, E4 de la biodiversité et E5 des ressources et de l\'économie circulaire.'],
  ['Une installation qui présente des risques pour l\'environnement relève en France du régime des :', ['ERP', 'ICPE', 'SPASER', 'OPERAT'], 1, 'Les installations classées pour la protection de l\'environnement (ICPE) sont soumises à déclaration, enregistrement ou autorisation selon leurs risques.'],
  ['Quelle démarche relève de l\'écoconception ?', ['Communiquer sur un produit vert', 'Réduire l\'impact d\'un produit dès sa conception, sur tout son cycle de vie', 'Compenser les émissions du produit', 'Recycler les invendus'], 1, 'L\'écoconception intègre l\'environnement dès la conception, en considérant toutes les étapes : matières, fabrication, transport, usage, fin de vie.'],
  ['Pour suivre la gestion de l\'eau d\'un site, l\'indicateur le plus direct est :', ['Le nombre de salariés', 'La consommation d\'eau en m³', 'Le chiffre d\'affaires', 'Le nombre de fournisseurs'], 1, 'La consommation (et les prélèvements) en m³, idéalement rapportée à la production, est l\'indicateur de base du volet eau.'],
  ['Le règlement européen EMAS est :', ['Une taxe sur les émissions', 'Un système volontaire de management et d\'audit environnemental', 'Une norme de reporting financier', 'Un label de produit'], 1, 'EMAS est un dispositif volontaire européen, plus exigeant que l\'ISO 14001 sur la transparence (déclaration environnementale publique).'],
  ['Dans une démarche ISO 14001, la première étape consiste généralement à :', ['Publier un rapport', 'Faire l\'analyse environnementale : aspects, impacts et obligations', 'Acheter des crédits carbone', 'Recruter un auditeur'], 1, 'L\'analyse environnementale identifie les aspects significatifs et les obligations de conformité, base de tout le système.'],
  ['Les « limites planétaires » désignent :', ['Les frontières des pays', 'Les seuils biophysiques au-delà desquels la stabilité de la Terre est menacée', 'Les quotas de pêche', 'Les zones protégées'], 1, 'Ce cadre scientifique identifie neuf processus (climat, biodiversité, cycles de l\'azote et du phosphore, eau douce…) dont plusieurs seuils sont déjà dépassés.']
 ],
 climat: [
  ['Le scope 1 correspond aux émissions :', ['De l\'électricité achetée', 'Directes, issues de sources possédées ou contrôlées', 'Des fournisseurs', 'De l\'usage des produits vendus'], 1, 'Scope 1 : émissions directes (chaudières, véhicules, procédés, fuites de fluides). Scope 2 : énergie achetée. Scope 3 : autres émissions indirectes de la chaîne de valeur.'],
  ['Les émissions liées à l\'électricité achetée relèvent du :', ['Scope 1', 'Scope 2', 'Scope 3', 'Aucun scope'], 1, 'L\'électricité, la chaleur ou la vapeur achetées sont en scope 2, présenté selon deux méthodes : localisation et marché (contrat).'],
  ['En France, une entreprise doit publier un bilan des émissions (BEGES) avec un plan de transition à partir de :', ['50 salariés', '250 salariés', '500 salariés en métropole', '5 000 salariés'], 2, 'Le BEGES réglementaire concerne les entreprises de plus de 500 salariés en métropole (250 outre-mer), tous les quatre ans.'],
  ['Où trouver les facteurs d\'émission de référence en France ?', ['Sur Wikipédia', 'Dans la Base Empreinte de l\'ADEME', 'Dans le Code du travail', 'Sur le site de l\'INSEE'], 1, 'La Base Empreinte de l\'ADEME regroupe les facteurs d\'émission officiels utilisés pour les bilans carbone.'],
  ['Chez la plupart des entreprises, le scope le plus important est souvent :', ['Le scope 1', 'Le scope 2', 'Le scope 3', 'Ils sont toujours égaux'], 2, 'Le scope 3 (achats, transport, usage des produits…) représente souvent la majorité des émissions, surtout hors industrie lourde.'],
  ['Le décret tertiaire impose aux bâtiments tertiaires de 1 000 m² ou plus :', ['Une isolation obligatoire', 'Une réduction progressive de la consommation d\'énergie, déclarée sur OPERAT', 'Des panneaux solaires', 'Un audit carbone'], 1, 'Objectifs de -40 % en 2030, -50 % en 2040 et -60 % en 2050 par rapport à une année de référence, avec déclaration annuelle sur OPERAT.'],
  ['L\'initiative SBTi sert à :', ['Noter les entreprises', 'Valider des objectifs de réduction des émissions alignés sur la science', 'Vendre des crédits carbone', 'Certifier les bilans carbone'], 1, 'La Science Based Targets initiative vérifie que les objectifs de réduction sont compatibles avec les trajectoires climatiques.'],
  ['L\'adaptation au changement climatique consiste à :', ['Réduire ses émissions', 'Se préparer aux effets du climat (canicules, inondations, sécheresses)', 'Acheter de la compensation', 'Changer de fournisseur d\'énergie'], 1, 'L\'atténuation réduit les émissions ; l\'adaptation réduit la vulnérabilité aux effets déjà inévitables du changement climatique.']
 ],
 social: [
  ['L\'index de l\'égalité professionnelle doit être publié par les entreprises d\'au moins :', ['11 salariés', '50 salariés', '250 salariés', '1 000 salariés'], 1, 'Toutes les entreprises de 50 salariés et plus calculent et publient leur index chaque année, au plus tard le 1er mars.'],
  ['Le taux d\'emploi obligatoire de travailleurs handicapés est de :', ['2 %', '4 %', '6 %', '10 %'], 2, 'L\'obligation d\'emploi des travailleurs handicapés (OETH) est de 6 % de l\'effectif, pour les entreprises d\'au moins 20 salariés.'],
  ['Le document unique d\'évaluation des risques professionnels (DUERP) est :', ['Facultatif', 'Obligatoire dès le premier salarié', 'Obligatoire à partir de 50 salariés', 'Réservé à l\'industrie'], 1, 'Tout employeur doit évaluer les risques et les consigner dans le DUERP, dès le premier salarié.'],
  ['Le taux de fréquence des accidents du travail se calcule ainsi :', ['Accidents ÷ effectif', 'Accidents avec arrêt × 1 000 000 ÷ heures travaillées', 'Jours d\'arrêt ÷ accidents', 'Accidents × 1 000 ÷ salariés'], 1, 'Le taux de fréquence rapporte le nombre d\'accidents avec arrêt au million d\'heures travaillées.'],
  ['QVCT signifie :', ['Qualité de vie et des conditions de travail', 'Quota de volontaires pour le climat au travail', 'Questionnaire de vigilance des conditions de travail', 'Qualité, valeurs, compétences, talents'], 0, 'La QVCT élargit l\'ancienne QVT aux conditions de travail : organisation, santé, sens du travail, équilibre des temps.'],
  ['Dans les ESRS, la norme consacrée aux effectifs de l\'entreprise est :', ['S1', 'S2', 'S3', 'G1'], 0, 'S1 : effectifs propres. S2 : travailleurs de la chaîne de valeur. S3 : communautés. S4 : consommateurs.'],
  ['La directive européenne sur la transparence des rémunérations vise surtout à :', ['Baisser les salaires', 'Réduire les écarts de rémunération entre femmes et hommes', 'Supprimer les primes', 'Harmoniser le SMIC'], 1, 'Elle renforce l\'information sur les salaires et l\'obligation d\'expliquer et de corriger les écarts injustifiés entre femmes et hommes.'],
  ['Parmi ces indicateurs, lequel mesure la fidélisation des salariés ?', ['Le taux de rotation (turnover)', 'Le taux de fréquence', 'L\'index de l\'égalité', 'Le bilan carbone'], 0, 'Le taux de rotation rapporte les départs (ou entrées et départs) à l\'effectif moyen.']
 ],
 ethique: [
  ['La loi Sapin 2 impose un programme anticorruption aux entreprises de :', ['50 salariés', 'Plus de 500 salariés et plus de 100 M€ de chiffre d\'affaires', 'Toutes les PME', 'Plus de 10 000 salariés'], 1, 'Le programme comprend notamment un code de conduite, une cartographie des risques, l\'évaluation des tiers et un dispositif d\'alerte interne.'],
  ['Un dispositif de recueil des signalements des lanceurs d\'alerte est obligatoire à partir de :', ['11 salariés', '50 salariés', '250 salariés', '1 000 salariés'], 1, 'Depuis la loi de 2022, les entreprises d\'au moins 50 salariés doivent mettre en place une procédure interne de recueil et de traitement des signalements.'],
  ['L\'autorité française chargée de contrôler les programmes anticorruption est :', ['La CNIL', 'L\'Agence française anticorruption (AFA)', 'L\'AMF', 'L\'ADEME'], 1, 'L\'AFA publie des recommandations et contrôle la mise en œuvre des mesures de la loi Sapin 2.'],
  ['Dans les ESRS, la conduite des affaires est traitée par :', ['E1', 'S1', 'G1', 'ESRS 2'], 2, 'G1 couvre la culture d\'entreprise, la lutte contre la corruption, la relation avec les fournisseurs (dont les délais de paiement) et le lobbying.'],
  ['Le devoir de vigilance français s\'applique aux sociétés qui emploient :', ['500 salariés', 'Au moins 5 000 salariés en France ou 10 000 dans le monde', '1 000 salariés', 'Toutes les sociétés cotées'], 1, 'La loi de 2017 vise les grandes sociétés : 5 000 salariés avec leurs filiales françaises, ou 10 000 avec leurs filiales dans le monde.'],
  ['Un conflit d\'intérêts apparaît lorsque :', ['Deux services sont en désaccord', 'Un intérêt personnel peut influencer une décision prise pour l\'entreprise', 'Un client conteste une facture', 'Deux concurrents fusionnent'], 1, 'Il doit être déclaré et géré, par exemple en écartant la personne concernée de la décision.'],
  ['La norme internationale des systèmes de management anticorruption est :', ['ISO 37001', 'ISO 14001', 'ISO 50001', 'ISO 20400'], 0, 'L\'ISO 37001 est certifiable et aide à structurer la prévention de la corruption.'],
  ['Le RGPD concerne principalement :', ['Les émissions de CO₂', 'La protection des données personnelles', 'Les délais de paiement', 'Les marchés publics'], 1, 'Le règlement général sur la protection des données encadre la collecte et l\'usage des données personnelles dans l\'Union européenne.']
 ],
 reporting: [
  ['Après l\'Omnibus, la CSRD vise les entreprises de plus de :', ['250 salariés', '500 salariés', '1 000 salariés et 450 M€ de chiffre d\'affaires', '5 000 salariés'], 2, 'Le périmètre a été fortement réduit : plus de 1 000 salariés et plus de 450 M€ de chiffre d\'affaires.'],
  ['La double matérialité combine :', ['Deux exercices comptables', 'L\'impact de l\'entreprise sur le monde et l\'impact des enjeux de durabilité sur l\'entreprise', 'Deux auditeurs', 'Le bilan et le compte de résultat'], 1, 'Matérialité d\'impact (vers l\'extérieur) et matérialité financière (vers l\'entreprise) : un enjeu est matériel s\'il l\'est sous l\'un des deux angles.'],
  ['La norme VSME est :', ['Une obligation pour toutes les PME', 'Une norme volontaire de reporting simplifié pour les PME', 'Un label', 'Un impôt'], 1, 'Élaborée par l\'EFRAG, elle permet aux PME de répondre de façon structurée aux demandes de données de leurs clients et banques.'],
  ['Le rapport de durabilité est certifié en France par :', ['L\'ADEME', 'Un commissaire aux comptes ou un organisme tiers indépendant accrédité', 'Le ministère de l\'Économie', 'L\'entreprise elle-même'], 1, 'Le vérificateur, inscrit auprès de la H2A, rend une conclusion d\'assurance limitée.'],
  ['Quel référentiel de reporting volontaire est le plus utilisé dans le monde ?', ['GRI', 'ISO 9001', 'SPASER', 'RGPD'], 0, 'Les standards GRI couvrent les impacts sur l\'économie, l\'environnement et les personnes.'],
  ['Une fiche indicateur doit au minimum préciser :', ['Le logo de l\'entreprise', 'La définition, l\'unité, la méthode de calcul, la source et le responsable', 'Le nom de l\'auditeur', 'Le prix de l\'outil'], 1, 'C\'est ce qui rend un chiffre traçable, comparable d\'une année sur l\'autre et vérifiable.'],
  ['Une note EcoVadis est :', ['Une obligation légale', 'Une évaluation RSE volontaire demandée par de nombreux clients', 'Une certification ISO', 'Une note financière'], 1, 'EcoVadis évalue les politiques, actions et résultats sur quatre thèmes : environnement, social, éthique, achats responsables.'],
  ['Le niveau d\'assurance exigé pour la certification du rapport de durabilité est :', ['Raisonnable', 'Limitée', 'Totale', 'Aucune'], 1, 'L\'assurance limitée conduit à une conclusion négative : rien n\'a été relevé qui remette en cause la conformité des informations.']
 ],
 circulaire: [
  ['La loi qui encadre l\'économie circulaire en France depuis 2020 est la loi :', ['Climat et résilience', 'AGEC', 'PACTE', 'Sapin 2'], 1, 'La loi anti-gaspillage pour une économie circulaire (AGEC) fixe des objectifs sur les emballages, le réemploi, la réparation et les invendus.'],
  ['La loi AGEC interdit notamment :', ['Le recyclage', 'La destruction des invendus non alimentaires', 'La vente en vrac', 'Le reconditionnement'], 1, 'Les invendus non alimentaires doivent être donnés, réemployés ou recyclés.'],
  ['La responsabilité élargie du producteur (REP) signifie que :', ['L\'État collecte les déchets', 'Le metteur sur le marché finance la fin de vie de ses produits', 'Le consommateur paie une amende', 'Le producteur recycle lui-même tout'], 1, 'Les producteurs financent, via des éco-organismes, la collecte et le traitement des déchets de leurs produits.'],
  ['L\'analyse de cycle de vie (ACV) est encadrée par les normes :', ['ISO 14040 et 14044', 'ISO 45001', 'ISO 26000', 'ISO 37001'], 0, 'L\'ACV évalue les impacts environnementaux d\'un produit de l\'extraction des matières à la fin de vie.'],
  ['Dans la hiérarchie des modes de traitement des déchets, la priorité est :', ['Le recyclage', 'La prévention', 'L\'incinération', 'L\'enfouissement'], 1, 'Ordre de priorité : prévention, réemploi, recyclage, autre valorisation (énergie), élimination.'],
  ['L\'économie de la fonctionnalité consiste à :', ['Vendre plus de produits', 'Vendre l\'usage d\'un bien plutôt que le bien lui-même', 'Supprimer les garanties', 'Fabriquer à l\'étranger'], 1, 'Exemple : louer un service d\'éclairage plutôt que vendre des ampoules ; le fabricant a intérêt à des produits durables.'],
  ['L\'indicateur le plus pertinent pour suivre les déchets d\'un site industriel est :', ['Le nombre de poubelles', 'Les tonnes de déchets par unité produite et le taux de valorisation', 'Le budget communication', 'L\'effectif'], 1, 'Rapporter les déchets à la production permet de comparer les années, et le taux de valorisation mesure la qualité du traitement.'],
  ['L\'écologie industrielle et territoriale consiste à :', ['Fermer les usines', 'Faire des déchets ou de la chaleur d\'une entreprise une ressource pour une autre', 'Planter des arbres', 'Délocaliser'], 1, 'C\'est la symbiose industrielle : échanges de flux de matières, d\'eau ou d\'énergie entre entreprises voisines.']
 ],
 achats: [
  ['La norme internationale des achats responsables est :', ['ISO 20400', 'ISO 14001', 'ISO 9001', 'ISO 50001'], 0, 'L\'ISO 20400 donne des lignes directrices pour intégrer la RSE dans la politique et les processus achats.'],
  ['En France, le délai de paiement maximal entre entreprises est en principe de :', ['30 jours', '60 jours à compter de la facture, ou 45 jours fin de mois', '90 jours', '120 jours'], 1, 'Le Code de commerce fixe 60 jours date de facture ou 45 jours fin de mois si le contrat le prévoit ; les retards sont sanctionnés.'],
  ['La première étape d\'une démarche d\'achats responsables est :', ['Auditer tous les fournisseurs', 'Cartographier les achats par catégorie et par risque', 'Changer tous les fournisseurs', 'Publier un rapport'], 1, 'La cartographie permet de concentrer les efforts sur les catégories et pays les plus risqués.'],
  ['Une charte fournisseurs sert à :', ['Fixer les prix', 'Formaliser les exigences sociales, environnementales et éthiques attendues des fournisseurs', 'Remplacer le contrat', 'Choisir le moins cher'], 1, 'Elle est signée par les fournisseurs et rattachée aux contrats par une clause.'],
  ['Dans un appel d\'offres, un critère RSE est en général pondéré à :', ['0 %', 'Entre 10 et 30 %', '80 %', '100 %'], 1, 'Une pondération de 10 à 30 % est courante ; le critère doit être mesurable et appuyé sur des preuves.'],
  ['Pour les marchés publics lancés depuis le 22 août 2026, il est obligatoire :', ['D\'acheter français', 'D\'avoir au moins un critère environnemental d\'attribution', 'D\'acheter le moins cher', 'De recourir à l\'ESS'], 1, 'La loi Climat et résilience interdit désormais d\'attribuer un marché sur le seul critère du prix sans critère environnemental.'],
  ['Le label français qui distingue les bonnes relations avec les fournisseurs est :', ['Label Relations fournisseurs et achats responsables', 'Label Bas Carbone', 'Label ISR', 'Label Greenfin'], 0, 'Adossé à l\'ISO 20400, il est attribué par l\'État avec le Conseil national des achats.'],
  ['Les émissions des produits achetés sont classées dans :', ['Le scope 1', 'Le scope 2', 'Le scope 3', 'Hors bilan'], 2, 'C\'est la catégorie « biens et services achetés » du scope 3, souvent la première source d\'émissions.']
 ],
 territoire: [
  ['Le mécénat d\'entreprise ouvre droit à une réduction d\'impôt de :', ['20 % des dons', '60 % des dons, dans certaines limites', '100 % des dons', 'Aucune réduction'], 1, 'La réduction est de 60 % des sommes versées (40 % au-delà de 2 M€), dans la limite de 20 000 € ou de 0,5 % du chiffre d\'affaires si ce montant est plus élevé.'],
  ['Une clause sociale d\'insertion dans un marché consiste à :', ['Imposer un prix bas', 'Réserver des heures de travail à des personnes éloignées de l\'emploi', 'Embaucher des stagiaires', 'Payer une taxe'], 1, 'Un facilitateur des clauses sociales aide souvent l\'acheteur et les entreprises à la mettre en œuvre.'],
  ['Les achats auprès des ESAT et entreprises adaptées :', ['Ne comptent pour rien', 'Peuvent être valorisés dans l\'obligation d\'emploi de travailleurs handicapés', 'Sont interdits', 'Sont réservés au public'], 1, 'Ils sont pris en compte dans le calcul de la contribution liée à l\'OETH, selon des règles précises.'],
  ['Dans l\'ISO 26000, la question centrale qui porte sur le territoire est :', ['Loyauté des pratiques', 'Communautés et développement local', 'Gouvernance', 'Environnement'], 1, 'Elle couvre l\'emploi local, le développement des compétences, l\'investissement social et le dialogue avec les communautés.'],
  ['Dans les ESRS, la norme consacrée aux communautés touchées est :', ['S1', 'S2', 'S3', 'S4'], 2, 'S3 porte sur les droits et intérêts des communautés locales affectées par les activités de l\'entreprise.'],
  ['Le mécénat de compétences consiste à :', ['Donner de l\'argent', 'Mettre des salariés à disposition d\'une association sur leur temps de travail', 'Former des étudiants', 'Sponsoriser un club'], 1, 'C\'est une forme de mécénat valorisée au coût de revient de la prestation.'],
  ['L\'économie sociale et solidaire (ESS) regroupe notamment :', ['Les sociétés cotées', 'Les associations, coopératives, mutuelles, fondations et entreprises agréées', 'Les administrations', 'Les multinationales'], 1, 'Elle est définie par la loi de 2014 : gouvernance démocratique, lucrativité limitée, utilité sociale.'],
  ['Un bon indicateur d\'ancrage territorial est :', ['La part des achats auprès de fournisseurs locaux', 'Le cours de Bourse', 'Le nombre de brevets', 'Le taux de change'], 0, 'Avec la part des recrutements locaux et les partenariats, il mesure la contribution au territoire.']
 ],
 droits: [
  ['Les principes directeurs des Nations unies relatifs aux entreprises et aux droits de l\'Homme datent de :', ['1948', '2011', '2017', '2024'], 1, 'Adoptés en 2011, ils reposent sur trois piliers : protéger (États), respecter (entreprises), réparer (accès aux recours).'],
  ['La « diligence raisonnable » en matière de droits humains consiste à :', ['Signer une charte', 'Identifier, prévenir, atténuer les atteintes et rendre compte', 'Faire un don', 'Publier une photo'], 1, 'C\'est le processus continu au cœur du devoir de vigilance et des principes de l\'OCDE.'],
  ['Un mécanisme de réclamation efficace doit être :', ['Réservé aux cadres', 'Accessible, connu, confidentiel et suivi d\'une réponse', 'Facultatif', 'Payant'], 1, 'Les principes des Nations unies décrivent ses critères d\'efficacité : légitimité, accessibilité, prévisibilité, équité, transparence.'],
  ['Le règlement européen adopté en 2024 interdit sur le marché de l\'Union :', ['Les produits importés', 'Les produits fabriqués avec du travail forcé', 'Les produits non recyclables', 'Les produits sans étiquette'], 1, 'Il s\'appliquera à partir de fin 2027 à tous les produits, importés ou fabriqués dans l\'Union.'],
  ['L\'accessibilité des produits et services numériques est imposée en Europe par :', ['L\'Acte européen sur l\'accessibilité', 'La CSRD', 'Le RGPD', 'La taxonomie'], 0, 'Applicable depuis juin 2025 à de nombreux produits et services : sites de commerce, banque, transport, livres numériques.'],
  ['Dans les ESRS, les travailleurs de la chaîne de valeur relèvent de :', ['S1', 'S2', 'S3', 'S4'], 1, 'S2 couvre les conditions de travail chez les fournisseurs et sous-traitants.'],
  ['Les principes directeurs de l\'OCDE à l\'intention des entreprises multinationales prévoient :', ['Des sanctions pénales', 'Des points de contact nationaux qui traitent les plaintes', 'Un impôt mondial', 'Une certification'], 1, 'En France, le point de contact national est rattaché au Trésor et peut être saisi en cas de manquement présumé.'],
  ['Lequel est un droit fondamental au travail selon l\'OIT ?', ['Le télétravail', 'L\'élimination du travail des enfants', 'Les tickets restaurant', 'La prime annuelle'], 1, 'Les principes fondamentaux de l\'OIT : liberté syndicale, élimination du travail forcé et du travail des enfants, non-discrimination, santé-sécurité.']
 ],
 finance: [
  ['La taxonomie européenne sert à :', ['Taxer les pollueurs', 'Classer les activités économiques durables selon des critères techniques', 'Noter les entreprises', 'Fixer les taux d\'intérêt'], 1, 'Une activité est durable si elle contribue à un objectif environnemental, ne nuit à aucun autre (DNSH) et respecte des garanties sociales minimales.'],
  ['La taxonomie compte combien d\'objectifs environnementaux ?', ['3', '6', '10', '17'], 1, 'Atténuation et adaptation au changement climatique, eau, économie circulaire, pollution, biodiversité.'],
  ['Le règlement SFDR concerne :', ['Les entreprises industrielles', 'La transparence des acteurs financiers sur la durabilité de leurs produits', 'Les PME', 'Les collectivités'], 1, 'Il classe notamment les fonds selon leurs caractéristiques ou objectifs de durabilité ; sa révision est en cours.'],
  ['DNSH signifie :', ['Do No Significant Harm : ne pas causer de préjudice important', 'Développement national soutenable', 'Donnée non soumise', 'Durabilité normalisée'], 0, 'C\'est le principe selon lequel une activité ne doit nuire significativement à aucun des autres objectifs environnementaux.'],
  ['Le label français pour les fonds verts finançant la transition est :', ['Greenfin', 'Bas Carbone', 'Lucie', 'Ecocert'], 0, 'Le label Greenfin, créé par l\'État, exclut notamment les fonds investis dans les énergies fossiles.'],
  ['Une obligation verte (green bond) est :', ['Un prêt sans intérêt', 'Un emprunt dont les fonds financent des projets environnementaux', 'Une action', 'Une subvention'], 1, 'Le standard européen des obligations vertes encadre l\'usage des fonds et leur vérification.'],
  ['Le « risque de transition » désigne :', ['Les dégâts d\'une tempête', 'Les pertes liées au passage à une économie bas carbone (réglementation, prix, technologie)', 'Le changement de dirigeant', 'Une fusion'], 1, 'À distinguer du risque physique, lié aux effets du climat lui-même.'],
  ['Les indicateurs de la taxonomie publiés par les entreprises concernées portent sur :', ['L\'effectif', 'La part du chiffre d\'affaires, des investissements (CapEx) et des dépenses (OpEx) alignés', 'Le cours de Bourse', 'Le nombre de clients'], 1, 'Ces trois ratios montrent dans quelle mesure l\'activité et les investissements sont durables au sens de la taxonomie.']
 ],
 communication: [
  ['Depuis le 27 septembre 2026, le droit européen interdit :', ['Toute publicité', 'Les allégations environnementales génériques non justifiées et la neutralité carbone d\'un produit fondée sur la compensation', 'Les labels', 'Les emballages'], 1, 'La directive 2024/825 renforce la protection des consommateurs contre l\'écoblanchiment.'],
  ['Le greenwashing est juridiquement :', ['Autorisé', 'Une pratique commerciale trompeuse', 'Une faute mineure sans sanction', 'Un délit de presse'], 1, 'Il peut être sanctionné par une amende pouvant atteindre une part importante du chiffre d\'affaires ou des dépenses publicitaires.'],
  ['Une allégation environnementale fiable doit être :', ['Générale et positive', 'Précise, prouvée, sur un périmètre clair et à jour', 'Accompagnée d\'une image verte', 'Validée par le marketing seul'], 1, 'Exemple : « Bouteille fabriquée avec 50 % de plastique recyclé » plutôt que « emballage écologique ».'],
  ['Quel terme est à éviter sans preuve d\'une performance reconnue ?', ['« 50 % de matière recyclée »', '« Éco-responsable »', '« Fabriqué à Lyon »', '« Consommation de 2 kWh »'], 1, 'Les termes vagues comme « vert », « éco-responsable », « respectueux de l\'environnement » sont désormais encadrés.'],
  ['L\'organisme d\'autorégulation de la publicité en France est :', ['L\'ARPP', 'L\'AMF', 'La CNIL', 'L\'ADEME'], 0, 'L\'Autorité de régulation professionnelle de la publicité publie une recommandation sur le développement durable.'],
  ['La norme ISO 14021 porte sur :', ['Les autodéclarations environnementales', 'La santé-sécurité', 'L\'énergie', 'La qualité'], 0, 'Elle fixe les règles des allégations environnementales faites par l\'entreprise elle-même (type II).'],
  ['Pour éviter le greenwashing, la meilleure pratique interne est :', ['Laisser chaque service communiquer', 'Une validation RSE et juridique avant chaque publication', 'Ne jamais communiquer', 'Copier les concurrents'], 1, 'Une grille de questions simples (preuve, périmètre, date, précision) suffit à éviter la plupart des erreurs.'],
  ['« Neutre en carbone » appliqué à un produit grâce à des crédits carbone est désormais :', ['Recommandé', 'Interdit dans l\'Union européenne', 'Obligatoire', 'Réservé aux grandes entreprises'], 1, 'L\'entreprise peut parler de sa contribution à des projets, mais pas présenter le produit comme neutre grâce à la compensation.']
 ],
 numerique: [
  ['L\'essentiel de l\'empreinte environnementale du numérique provient :', ['De l\'usage des réseaux', 'De la fabrication des équipements', 'Des courriels', 'Des centres de données uniquement'], 1, 'En France, la fabrication des terminaux (ordinateurs, téléphones, écrans) pèse la plus grande part ; allonger leur durée de vie est le premier levier.'],
  ['La loi REEN de 2021 vise à :', ['Réduire l\'empreinte environnementale du numérique', 'Taxer les GAFAM', 'Interdire les écrans', 'Développer la 5G'], 0, 'Elle impose notamment aux grandes collectivités une stratégie numérique responsable.'],
  ['Le RGESN est :', ['Un règlement fiscal', 'Le référentiel général d\'écoconception de services numériques', 'Un label de produit', 'Une directive européenne'], 1, 'Publié par les pouvoirs publics, il propose des critères pour concevoir des sites et applications plus sobres.'],
  ['Le geste le plus efficace pour réduire l\'empreinte numérique d\'une entreprise est :', ['Supprimer ses courriels', 'Allonger la durée d\'usage des équipements et acheter reconditionné', 'Changer de fond d\'écran', 'Éteindre le wifi la nuit'], 1, 'Garder un ordinateur cinq ans au lieu de trois réduit fortement l\'impact, puisque la fabrication domine.'],
  ['Le règlement européen sur l\'intelligence artificielle classe les systèmes d\'IA selon :', ['Leur prix', 'Leur niveau de risque', 'Leur langue', 'Leur pays d\'origine'], 1, 'Pratiques interdites, systèmes à haut risque soumis à obligations, obligations de transparence, risque minimal ; son application est progressive.'],
  ['La sobriété numérique consiste à :', ['Abandonner le numérique', 'Utiliser le numérique de façon utile et mesurée', 'Acheter les derniers modèles', 'Tout stocker dans le cloud'], 1, 'Exemple : limiter la vidéo en haute définition, éviter le renouvellement inutile, alléger les pages web.'],
  ['Un indicateur de numérique responsable pertinent est :', ['La durée de vie moyenne des équipements', 'Le nombre d\'abonnés', 'Le chiffre d\'affaires', 'Le nombre de réunions'], 0, 'Avec la part d\'équipements reconditionnés et le taux de réemploi en fin de vie.'],
  ['La transformation durable d\'un modèle économique peut passer par :', ['Vendre plus de volumes', 'L\'économie de la fonctionnalité, la réparation, le réemploi', 'La publicité', 'La délocalisation'], 1, 'Faire évoluer ce que l\'on vend (un service, un usage) plutôt que la seule quantité de produits.']
 ]
};
/* =====================================================================
   QUIZ PAR DOMAINE, SÉRIES DE RÉVISION, FICHES DE RÉVISION
   ===================================================================== */
const QS = {cur: null};
const qzHist = () => { try { return JSON.parse(LS.get('quizHist') || '{}'); } catch(e) { return {}; } };
const qzErr = () => { try { return JSON.parse(LS.get('quizErr') || '[]'); } catch(e) { return []; } };
const qzBest = id => { const H = qzHist()[id] || []; return H.length ? Math.max(...H.map(x => x.s)) : null; };
const domById = id => (window.SERIKI_DOMS || []).find(x => x.id === id);
function qzStart(dom){
  let items;
  if (dom === 'revision') items = qzErr().map(k => { const [d, i] = k.split('|'); return QZ[d] && QZ[d][+i] ? {d, i: +i} : null; }).filter(Boolean);
  else if (dom === 'mix') items = Object.keys(QZ).flatMap(d => QZ[d].map((_, i) => ({d, i}))).sort(() => Math.random() - .5).slice(0, 12);
  else items = QZ[dom].map((_, i) => ({d: dom, i}));
  if (!items.length) { toast('Aucune question à réviser : bravo !'); return; }
  items = items.sort(() => Math.random() - .5).map(x => { const q = QZ[x.d][x.i], ord = q[1].map((_, j) => j).sort(() => Math.random() - .5); return Object.assign(x, {ord}); });
  QS.cur = {dom, items, k: 0, rep: {}, done: false}; renderQz(); window.scrollTo(0, 0);
}
function qzFinish(){
  const C = QS.cur, ok = C.items.filter((x, k) => C.rep[k] === QZ[x.d][x.i][2]).length, s = Math.round(ok / C.items.length * 100);
  const H = qzHist(), key = C.dom; (H[key] = H[key] || []).push({t: Date.now(), s, n: C.items.length}); H[key] = H[key].slice(-20); LS.set('quizHist', JSON.stringify(H));
  let E = qzErr(); C.items.forEach((x, k) => { const id = x.d + '|' + x.i; if (C.rep[k] === QZ[x.d][x.i][2]) E = E.filter(e => e !== id); else if (!E.includes(id)) E.push(id); }); LS.set('quizErr', JSON.stringify(E));
  C.done = true; C.score = s; C.ok = ok;
}
function renderQz(){
  const el = document.getElementById('qzRoot'); if (!el) return;
  const C = QS.cur, D = window.SERIKI_DOMS || [];
  if (C && !C.done) {
    const x = C.items[C.k], q = QZ[x.d][x.i], r = C.rep[C.k], rep = r != null, dm = domById(x.d);
    let h = '<div class="eyebrow">APPRENDRE · QUIZ' + (dm ? ' · ' + esc(dm.n).toUpperCase() : '') + '</div><div class="card quiz qz"><div class="meta"><span class="pill">Question ' + (C.k + 1) + ' / ' + C.items.length + '</span>' + (C.dom === 'revision' ? '<span class="pill o">Série de révision</span>' : '') + '</div><div class="bar"><span style="width:' + Math.round(100 * C.k / C.items.length) + '%"></span></div><h3 class="qq">' + esc(q[0]) + '</h3><div class="qopts">' + x.ord.map(j => '<button class="qopt' + (rep ? (j === q[2] ? ' good' : j === r ? ' bad' : '') : '') + '" data-qz="ans" data-j="' + j + '"' + (rep ? ' disabled' : '') + '>' + esc(q[1][j]) + '</button>').join('') + '</div>';
    if (rep) h += '<div class="qexp ' + (r === q[2] ? 'ok' : 'ko') + '"><strong>' + (r === q[2] ? 'Bonne réponse' : 'Pas tout à fait') + '</strong><p>' + esc(q[3]) + '</p>' + (dm ? '<a href="#domaines--' + dm.id + '">Revoir le domaine « ' + esc(dm.n) + ' » →</a>' : '') + '</div><div class="ctool"><button class="btn" data-qz="next">' + (C.k + 1 < C.items.length ? 'Question suivante' : 'Voir mon résultat') + '</button></div>';
    h += '<button class="linkbtn" data-qz="quit">Abandonner le quiz</button></div>';
    el.innerHTML = h; return;
  }
  if (C && C.done) {
    const faux = C.items.map((x, k) => ({x, k})).filter(o => C.rep[o.k] !== QZ[o.x.d][o.x.i][2]), dm = domById(C.dom);
    let h = '<div class="eyebrow">APPRENDRE · RÉSULTAT DU QUIZ</div><div class="card qzres"><div class="qzscore ' + (C.score >= 75 ? 'ok' : C.score >= 50 ? 'mid' : 'ko') + '">' + C.score + ' %</div><div><h3>' + (C.score >= 75 ? 'Très bien maîtrisé' : C.score >= 50 ? 'Bases acquises, à consolider' : 'À retravailler') + '</h3><p>' + C.ok + ' bonne' + (C.ok > 1 ? 's' : '') + ' réponse' + (C.ok > 1 ? 's' : '') + ' sur ' + C.items.length + (dm ? ' · ' + esc(dm.n) : '') + '. Les questions manquées sont ajoutées à votre série de révision.</p></div></div>';
    if (faux.length) h += '<h3>Les points à revoir</h3>' + faux.map(o => { const q = QZ[o.x.d][o.x.i]; return '<div class="card qzf"><p><strong>' + esc(q[0]) + '</strong></p><p>Bonne réponse : <strong>' + esc(q[1][q[2]]) + '</strong></p><p class="note">' + esc(q[3]) + '</p></div>'; }).join('');
    h += '<div class="ctool"><button class="btn" data-qz="start" data-k="' + C.dom + '">Refaire ce quiz</button>' + (faux.length ? '<button class="btn ghost" data-qz="start" data-k="revision">Série de révision</button>' : '') + (dm ? '<a class="btn ghost" href="#domaines--' + dm.id + '">Revoir le domaine</a><button class="btn ghost" data-qz="fiche" data-k="' + dm.id + '">Fiche de révision</button>' : '') + '<button class="btn ghost" data-qz="home">Tous les quiz</button></div>';
    el.innerHTML = h; return;
  }
  const H = qzHist(), E = qzErr(), all = D.map(d => ({d, b: qzBest(d.id), n: (H[d.id] || []).length})), faits = all.filter(a => a.b != null), lac = faits.filter(a => a.b < 60).sort((a, b) => a.b - b.b), moy = faits.length ? Math.round(faits.reduce((s, a) => s + a.b, 0) / faits.length) : null;
  let h = '<div class="eyebrow">APPRENDRE · S\'ÉVALUER</div><h2>Quiz par domaine</h2><p class="lead">Huit questions par domaine, corrigées une à une avec l\'explication et un lien vers la notion. Les questions manquées alimentent votre série de révision, et vos résultats restent enregistrés pour suivre vos progrès. Ce sont des évaluations pédagogiques, pas une certification.</p>';
  h += '<div class="tiles"><div class="tile"><div class="big">' + faits.length + ' / ' + D.length + '</div><div class="lbl">domaines évalués</div></div><div class="tile"><div class="big">' + (moy == null ? '–' : moy + ' %') + '</div><div class="lbl">meilleur score moyen</div></div><div class="tile"><div class="big">' + E.length + '</div><div class="lbl">questions à réviser</div></div><div class="tile"><div class="big">' + Object.values(H).reduce((s, L) => s + L.length, 0) + '</div><div class="lbl">quiz réalisés</div></div></div>';
  h += '<div class="ctool"><button class="btn" data-qz="start" data-k="mix">Quiz mélangé (12 questions)</button>' + (E.length ? '<button class="btn ghost" data-qz="start" data-k="revision">Série de révision (' + E.length + ')</button>' : '') + '<a class="btn ghost" href="#examen">Examen blanc chronométré</a></div>';
  if (lac.length) h += '<div class="callout o"><strong>Vos lacunes</strong>À retravailler en priorité : ' + lac.map(a => '<a href="#domaines--' + a.d.id + '">' + esc(a.d.n) + ' (' + a.b + ' %)</a>').join(', ') + '.</div>';
  h += '<div class="domgrid">' + all.map(({d, b, n}) => '<div class="domcard qzcard" style="--dc:' + d.c + '"><span class="dnum">' + String(D.indexOf(d) + 1).padStart(2, '0') + '</span><h4>' + esc(d.n) + '</h4><div class="rprog"><div><i style="width:' + (b || 0) + '%"></i></div><b>' + (b == null ? '–' : b + ' %') + '</b></div><p class="note">' + (n ? n + ' essai' + (n > 1 ? 's' : '') + ' · meilleur score ' + b + ' %' : 'Pas encore évalué') + '</p><div class="lact"><button class="btn sm" data-qz="start" data-k="' + d.id + '">' + (n ? 'Refaire' : 'Commencer') + '</button><button class="btn ghost sm" data-qz="fiche" data-k="' + d.id + '">Fiche de révision</button></div></div>').join('') + '</div>';
  el.innerHTML = h;
}
function ficheRevision(id){
  const d = domById(id); if (!d) return;
  const html = '<h1>Fiche de révision : ' + esc(d.n) + '</h1><p style="text-align:center">SERIKI BIBLE RSE · ' + new Date().toLocaleDateString('fr-FR') + '</p><h2>En bref</h2><p>' + esc(d.b) + '</p><h2>Pourquoi c\'est important</h2><p>' + esc(d.y) + '</p><h2>Les sujets</h2><ul>' + d.s.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h2>Les indicateurs clés</h2><ul>' + d.k.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h2>Les référentiels</h2><ul>' + d.r.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul><h2>Les premiers pas en entreprise</h2><ol>' + d.pas.map(x => '<li>' + esc(x) + '</li>').join('') + '</ol><h2>À retenir : questions et réponses</h2><ol>' + (QZ[id] || []).map(q => '<li><b>' + esc(q[0]) + '</b><br>' + esc(q[1][q[2]]) + '. ' + esc(q[3]) + '</li>').join('') + '</ol><h2>Les métiers</h2><p>' + esc(d.aut) + '.</p>';
  printHtml(html, 'Fiche de révision ' + d.n);
}
const qzRoot = document.getElementById('qzRoot');
qzRoot.addEventListener('click', e => {
  const b = e.target.closest('[data-qz]'); if (!b) return; const a = b.dataset.qz, C = QS.cur;
  if (a === 'start') qzStart(b.dataset.k);
  else if (a === 'ans' && C && C.rep[C.k] == null) { C.rep[C.k] = +b.dataset.j; renderQz(); }
  else if (a === 'next') { if (C.k + 1 < C.items.length) { C.k++; renderQz(); } else { qzFinish(); renderQz(); } window.scrollTo(0, 0); }
  else if (a === 'quit' || a === 'home') { QS.cur = null; renderQz(); }
  else if (a === 'fiche') ficheRevision(b.dataset.k);
});
window.addEventListener('hashchange', () => { if (route().base === 'quiz') { const s = route().sub; if (s && QZ[s]) qzStart(s); else renderQz(); } });
renderQz();

/* ---------- Mes données : sauvegarde globale et état de connexion ---------- */
function renderDonnees(){
  const el = document.getElementById('donRoot'); if (!el) return;
  const lb = LS.get('lastBackup'), jours = lb ? Math.floor((Date.now() - Date.parse(lb)) / 864e5) : null;
  el.innerHTML = '<div class="eyebrow">ACCUEIL · MES DONNÉES</div><h2>Mes données et ma sauvegarde</h2><p class="lead">Tout ce que vous saisissez dans l\'application (profil, cours, cas pratiques, CV, candidatures, tableaux de bord, projets, risques, diagnostics, quiz, réglages) est enregistré sur cet appareil, dans ce navigateur. Rien n\'est envoyé sur Internet. Pour ne rien perdre et pour passer d\'un appareil à l\'autre, faites une sauvegarde.</p>'
   + '<div class="grid two"><div class="card"><h4>Sauvegarder</h4><p>Un seul fichier contient toutes vos données. Rangez-le dans un endroit sûr (clé USB, Google Drive, OneDrive).</p><p class="note">' + (lb ? 'Dernière sauvegarde : ' + new Date(lb).toLocaleDateString('fr-FR') + (jours > 30 ? ' (il y a plus d\'un mois)' : '') : 'Aucune sauvegarde pour l\'instant.') + '</p><button class="btn" data-dn="save">Télécharger ma sauvegarde</button></div>'
   + '<div class="card"><h4>Restaurer</h4><p>Sur un nouvel appareil ou après avoir effacé le navigateur, importez votre fichier de sauvegarde : toutes vos données reviennent.</p><label class="btn ghost" for="dnIn" tabindex="0">Importer une sauvegarde<input type="file" id="dnIn" accept=".json" hidden></label></div>'
   + '<div class="card"><h4>Ce qui fonctionne sans Internet</h4><ul><li>Tous les contenus déjà chargés : Bible, domaines, méthodes, guides, quiz.</li><li>Tous vos outils et vos données : tableaux de bord, projets, CV, cas pratiques, diagnostics.</li><li>Les exports PDF, Word et Excel.</li></ul></div>'
   + '<div class="card"><h4>Ce qui demande une connexion</h4><ul><li>Les recherches dans le registre officiel (annuaire des entreprises, associations, cabinets).</li><li>La mise à jour des actualités et des offres.</li><li>L\'ouverture des sites externes (plateformes, sources officielles).</li></ul></div></div>';
}
const donRoot = document.getElementById('donRoot');
donRoot.addEventListener('click', e => { if (e.target.closest('[data-dn="save"]')) backup().then(renderDonnees); });
donRoot.addEventListener('change', e => { if (e.target.id === 'dnIn' && e.target.files.length) { restore(e.target.files[0]); e.target.value = ''; } });
window.addEventListener('hashchange', () => { if (route().base === 'donnees') renderDonnees(); });
renderDonnees();
function etatReseau(){ const b = document.getElementById('netBadge'); if (b) b.hidden = navigator.onLine; }
window.addEventListener('online', () => { etatReseau(); toast('Connexion rétablie'); });
window.addEventListener('offline', () => { etatReseau(); toast('Hors ligne : vos outils et contenus restent disponibles'); });
etatReseau();


/* =====================================================================
   PARCOURS MÉTIERS : CONTENUS PÉDAGOGIQUES
   Blocs : ['p', texte] ['h', titre] ['ol', [..]] ['ul', [..]] ['ex', titre, texte]
           ['tab', [entêtes], [[lignes]]] ['tip', texte] ['outil', lien, libellé]
   ===================================================================== */
const PCOURS = {};
PCOURS.projet = {id: 'projet', titre: 'Gestion de projet RSE', c: '#2357A6', type: 'Formation commune', intro: 'Tout projet RSE (bilan carbone, label, plan d\'économie circulaire, reporting) se mène comme un projet : un objectif, un périmètre, une équipe, un planning, un budget, des risques. Cette formation donne la méthode complète, les documents à produire et des exemples selon la taille et le secteur.',
 comp: [['Gestion de projet', ['Comprendre les étapes d\'un projet', 'Planifier, répartir les rôles et suivre un projet', 'Piloter plusieurs projets, budgets et risques']]],
 lecons: [
  {id: 'p1', t: 'Qu\'est-ce qu\'un projet RSE ?', d: '15 min', b: [
   ['p', 'Un projet est un ensemble d\'activités limité dans le temps, qui vise un résultat précis avec des moyens définis. Il se distingue de l\'activité courante : il a un début, une fin et un livrable. Une démarche RSE est faite d\'une succession de projets (bilan carbone, label, collecte CSRD) et d\'activités récurrentes (suivi des indicateurs, sensibilisation).'],
   ['h', 'Le cycle de vie en cinq phases'],
   ['tab', ['Phase', 'Question', 'Document produit'], [['1. Cadrage', 'Pourquoi, quoi, pour qui, avec quels moyens ?', 'Note de cadrage validée'], ['2. Planification', 'Comment, qui, quand, combien ?', 'Découpage en tâches, planning, RACI, budget, registre des risques'], ['3. Réalisation', 'On fait', 'Livrables intermédiaires'], ['4. Pilotage', 'Où en est-on ? Que corriger ?', 'Tableau de bord, comptes rendus de comité'], ['5. Clôture', 'Qu\'a-t-on obtenu et appris ?', 'Bilan de projet et retour d\'expérience']]],
   ['h', 'Trois approches à connaître'],
   ['ul', ['Approche prédictive (cycle en V) : tout est planifié au départ ; adaptée aux projets réglementaires à échéance fixe (BEGES, rapport de durabilité).', 'Approche agile : on avance par courtes itérations de deux à quatre semaines, avec des ajustements fréquents ; adaptée aux projets d\'innovation (écoconception, nouveau service).', 'Roue de Deming (PDCA : planifier, faire, vérifier, agir) : la logique d\'amélioration continue des normes ISO 14001 et 45001 et de toute démarche RSE dans la durée.']],
   ['tip', 'Dans la pratique, on combine : un cadre prédictif pour les échéances et des itérations courtes pour les chantiers incertains.']]},
  {id: 'p2', t: 'Cadrer : la note de cadrage', d: '25 min', b: [
   ['p', 'Le cadrage est l\'étape la plus importante : la plupart des projets qui échouent étaient mal cadrés. La note de cadrage tient en deux à quatre pages et doit être validée par le commanditaire (souvent la direction) avant de commencer.'],
   ['h', 'Les dix rubriques'],
   ['ol', ['Contexte et enjeu : pourquoi ce projet maintenant (obligation, demande client, risque, opportunité).', 'Objectif SMART : spécifique, mesurable, atteignable, réaliste, temporel.', 'Périmètre : ce qui est inclus et, surtout, ce qui est exclu.', 'Livrables : les documents ou résultats concrets attendus.', 'Parties prenantes : commanditaire, équipe, contributeurs, personnes informées.', 'Contraintes : délai, budget, disponibilité des équipes, réglementation.', 'Hypothèses : ce que l\'on suppose vrai (accès aux données, budget voté).', 'Risques principaux et premières parades.', 'Budget et ressources estimés.', 'Planning macro et gouvernance : jalons, comités, fréquence.']],
   ['ex', 'Exemple d\'objectif SMART', '« Réaliser le premier bilan carbone (scopes 1, 2 et 3 significatifs) des deux sites de l\'entreprise sur l\'année 2025, le présenter au comité de direction le 30 juin 2026, avec un budget de 15 000 € et un plan de réduction de 5 actions chiffrées. » À éviter : « Réduire notre empreinte carbone. »'],
   ['outil', '#boite--projets', 'Créer la fiche projet dans la boîte à outils'], ['outil', 'tpl:cadrage', 'Télécharger le modèle de note de cadrage']]},
  {id: 'p3', t: 'Planifier : découpage, jalons, Gantt', d: '30 min', b: [
   ['p', 'Planifier, c\'est découper le projet en lots de travail puis en tâches, estimer leur durée, les ordonner et placer des jalons (moments de validation).'],
   ['h', 'Méthode pas à pas'],
   ['ol', ['Partir des livrables et les découper en lots, puis en tâches de quelques jours à quelques semaines (c\'est l\'organigramme des tâches).', 'Pour chaque tâche : durée, responsable, ressources, dépendances (ce qui doit être fini avant).', 'Identifier le chemin critique : la suite de tâches qui détermine la durée totale. Un retard sur une de ces tâches retarde tout le projet.', 'Placer les jalons : validation du périmètre, fin de collecte, restitution, décision.', 'Ajouter une marge de 15 à 20 % sur les tâches incertaines (collecte de données, réponses des fournisseurs).', 'Construire le diagramme de Gantt et le partager.']],
   ['ex', 'Exemple : bilan carbone d\'une PME de 120 salariés', 'Lot 1 cadrage (2 semaines) ; lot 2 collecte (6 semaines, chemin critique : les données d\'achats de la comptabilité) ; lot 3 calcul (2 semaines) ; lot 4 plan d\'action (3 semaines) ; lot 5 restitution (1 semaine). Jalons : note de méthode validée (S2), données complètes (S8), résultats présentés (S12), plan validé (S14).'],
   ['outil', '#boite--projets', 'Construire le Gantt de votre projet']]},
  {id: 'p4', t: 'Organiser : rôles, RACI, comités', d: '20 min', b: [
   ['p', 'Un projet réussit quand chacun sait ce qu\'il doit faire. La matrice RACI répartit les rôles pour chaque tâche : R réalise, A est l\'autorité qui valide et rend des comptes (une seule personne par tâche), C est consulté avant, I est informé après.'],
   ['h', 'La gouvernance type'],
   ['tab', ['Instance', 'Qui', 'Rythme', 'Rôle'], [['Comité de pilotage', 'Commanditaire, direction, chef de projet', 'Tous les 1 à 3 mois', 'Décide, arbitre, valide les jalons'], ['Comité de projet', 'Chef de projet et contributeurs', 'Chaque semaine ou tous les 15 jours', 'Avance, coordonne, remonte les problèmes'], ['Point individuel', 'Chef de projet et un contributeur', 'Selon besoin', 'Débloque une tâche']]],
   ['tip', 'Un chargé de mission RSE pilote souvent « sans autorité hiérarchique » : la RACI validée par la direction et un sponsor au comité de direction lui donnent la légitimité nécessaire.'],
   ['outil', '#boite--projets', 'Remplir la matrice RACI']]},
  {id: 'p5', t: 'Gérer les risques du projet', d: '15 min', b: [
   ['p', 'Un risque est un événement incertain qui, s\'il survient, affecte le projet. On les identifie au cadrage, puis on les revoit à chaque comité.'],
   ['ol', ['Lister les risques (remue-méninges avec l\'équipe).', 'Noter probabilité et impact de 1 à 5.', 'Choisir une réponse : éviter, réduire, transférer, accepter.', 'Nommer un responsable et suivre.']],
   ['ex', 'Risques fréquents des projets RSE', 'Données indisponibles ou de mauvaise qualité ; indisponibilité des contributeurs pendant la clôture comptable ; changement réglementaire en cours de projet ; manque de soutien de la direction ; dépendance à un prestataire. Parade type pour les données : demander les extractions dès le cadrage et prévoir des estimations documentées.'],
   ['outil', '#boite--risques', 'Utiliser le registre des risques']]},
  {id: 'p6', t: 'Piloter : suivi, météo, écarts', d: '20 min', b: [
   ['p', 'Piloter, c\'est comparer régulièrement le prévu et le réalisé (délais, budget, livrables) et décider des corrections.'],
   ['ul', ['Avancement : pourcentage par tâche, jalons atteints.', 'Budget : dépensé et engagé face au prévu.', 'Qualité : livrables validés.', 'Météo du projet : soleil (tout va bien), nuage (vigilance), orage (décision nécessaire).']],
   ['ex', 'Compte rendu de comité de pilotage en une page', 'Météo : nuage. Avancement : 60 %. Réalisé : collecte terminée sur 2 sites sur 3. Écart : données d\'achats en retard de 2 semaines. Décision demandée : utiliser une estimation monétaire pour le site 3 cette année. Prochain jalon : restitution le 30 juin.'],
   ['outil', 'tpl:copil', 'Télécharger le modèle de compte rendu de comité']]},
  {id: 'p7', t: 'Conduire le changement', d: '20 min', b: [
   ['p', 'Un projet RSE change des habitudes (achats, déplacements, procédés). Les résistances sont normales : peur de perdre du temps, de l\'argent ou du confort, scepticisme.'],
   ['ol', ['Expliquer le pourquoi avec des faits et l\'intérêt pour chacun.', 'Associer tôt les personnes concernées (ateliers, groupes de travail).', 'Former et outiller.', 'S\'appuyer sur des ambassadeurs volontaires.', 'Célébrer les premiers résultats.']],
   ['outil', '#terrain--sensibiliser', 'Guide : sensibiliser les salariés']]},
  {id: 'p8', t: 'Clôturer et capitaliser', d: '10 min', b: [
   ['p', 'Un projet se clôt formellement : livrables remis, bilan des écarts, retour d\'expérience, passage de relais à l\'activité courante (qui suit les indicateurs ensuite ?).'],
   ['ex', 'Questions du retour d\'expérience', 'Qu\'est-ce qui a bien fonctionné ? Qu\'est-ce qui a manqué ? Que referions-nous autrement ? Quelles données ou quels outils conserver pour l\'an prochain ?'],
   ['outil', 'tpl:rex', 'Télécharger le modèle de bilan et retour d\'expérience']]},
  {id: 'p9', t: 'Cas selon la taille et le secteur', d: '25 min', b: [
   ['p', 'La méthode reste la même, mais l\'organisation change beaucoup selon la structure.'],
   ['tab', ['Situation', 'Projet', 'Équipe et durée', 'Points d\'attention'], [['PME industrielle (150 salariés)', 'Premier bilan carbone et plan de réduction', 'Chargé RSE + directeur de site + comptable ; 3 à 4 mois', 'Données d\'achats et d\'énergie ; mobiliser la production'], ['Grand groupe multisite', 'Collecte des données CSRD', 'Équipe RSE centrale + correspondants dans chaque filiale ; 9 à 12 mois', 'Protocole commun, calendrier de clôture, contrôles'], ['Commerce et distribution', 'Réduction des emballages', 'Achats + marketing + logistique ; 6 à 12 mois', 'Fournisseurs, obligations sur les emballages, coût'], ['Collectivité', 'Plan climat (PCAET)', 'Service environnement + élus + bureau d\'études ; 18 à 24 mois', 'Concertation, délibérations, marchés publics'], ['Association', 'Mesure de l\'impact social', 'Direction + bénévoles ; 3 à 6 mois', 'Peu de moyens : commencer par 5 indicateurs'], ['Jeune entreprise du numérique', 'Numérique responsable', 'Fondateurs + développeurs ; itérations agiles', 'Mesurer avant d\'optimiser ; équipements']]],
   ['outil', '#labo', 'S\'entraîner sur un cas du laboratoire']]}
 ],
 outils: [['#boite--projets', 'Projets : fiche, tâches, Gantt, RACI, budget'], ['#boite--risques', 'Registre des risques'], ['#pilotage--plan', 'Plan d\'action'], ['#boite--swot', 'Analyse SWOT']],
 livrables: [['Note de cadrage', 'tpl:cadrage'], ['Planning (Gantt) et RACI', '#boite--projets'], ['Compte rendu de comité', 'tpl:copil'], ['Bilan et retour d\'expérience', 'tpl:rex']],
 cas: ['bilan-carbone', 'csrd-donnees'],
 auto: ['Je sais rédiger un objectif SMART', 'Je sais rédiger une note de cadrage', 'Je sais découper un projet et construire un Gantt', 'Je sais remplir une matrice RACI avec un seul « A » par tâche', 'Je sais tenir un registre des risques', 'Je sais animer un comité de pilotage et en faire le compte rendu', 'Je sais adapter la conduite du projet à la taille de l\'organisation', 'Je sais clôturer un projet et en tirer les leçons']};

PCOURS.budget = {id: 'budget', titre: 'Gestion budgétaire et arbitrage', c: '#8A5214', type: 'Formation commune', intro: 'Un projet RSE est adopté quand il est chiffré et comparé à d\'autres options. Cette formation apprend à lire un budget, à calculer la rentabilité d\'une action (temps de retour, valeur actuelle nette, taux de rendement interne), le coût par tonne de CO₂ évitée, et à défendre une décision devant une direction.',
 comp: [['Gestion budgétaire et arbitrage', ['Lire un budget', 'Calculer un retour sur investissement et suivre des dépenses', 'Comparer plusieurs scénarios et convaincre une direction']]],
 lecons: [
  {id: 'b1', t: 'Lire un budget : investissements et dépenses', d: '15 min', b: [
   ['p', 'On distingue les investissements (CapEx : achat d\'équipements durables, amortis sur plusieurs années) et les dépenses de fonctionnement (OpEx : énergie, maintenance, prestations, salaires). Un projet RSE a souvent un investissement au départ et des économies de fonctionnement ensuite.'],
   ['tab', ['Poste', 'Type', 'Exemple'], [['Pompe à chaleur', 'Investissement', '350 000 €'], ['Économie de gaz', 'Fonctionnement (gain)', '-40 000 € par an'], ['Maintenance', 'Fonctionnement', '+3 000 € par an'], ['Prestation de bilan carbone', 'Fonctionnement', '12 000 €']]],
   ['tip', 'Raisonnez toujours en coût complet sur la durée de vie : prix d\'achat, installation, énergie, maintenance, fin de vie. C\'est le coût global, souvent décisif pour les équipements économes.']]},
  {id: 'b2', t: 'Temps de retour, VAN et TRI', d: '30 min', b: [
   ['h', 'Le temps de retour sur investissement'],
   ['p', 'Temps de retour = investissement ÷ gain annuel net. Simple et parlant, mais il ignore ce qui se passe après et la valeur du temps.'],
   ['ex', 'Calcul', 'Éclairage LED : 40 000 € d\'investissement, 12 000 € d\'économies par an. Temps de retour = 40 000 ÷ 12 000 = 3,3 ans.'],
   ['h', 'La valeur actuelle nette (VAN)'],
   ['p', 'Un euro gagné dans cinq ans vaut moins qu\'un euro aujourd\'hui. La VAN additionne les gains futurs « actualisés » avec un taux (souvent 5 à 8 % en entreprise), moins l\'investissement. VAN = somme des flux de l\'année t ÷ (1 + taux) puissance t, moins l\'investissement. Une VAN positive signifie que le projet crée de la valeur.'],
   ['ex', 'Calcul', 'LED, 15 ans, taux 6 % : la somme actualisée de 12 000 € par an sur 15 ans vaut environ 116 500 €. VAN ≈ 116 500 - 40 000 = 76 500 € : très rentable.'],
   ['h', 'Le taux de rendement interne (TRI)'],
   ['p', 'C\'est le taux qui rend la VAN nulle. On le compare au taux exigé par l\'entreprise : si le TRI est supérieur, le projet est accepté. L\'outil de l\'application le calcule pour vous.'],
   ['outil', '#ateliers--finance', 'Calculer temps de retour, VAN et TRI']]},
  {id: 'b3', t: 'Le coût par tonne évitée et la courbe des coûts', d: '25 min', b: [
   ['p', 'Pour comparer des actions climat, on calcule le coût d\'abattement : (coût annualisé de l\'action - économies annuelles) ÷ tonnes de CO₂e évitées par an. Un coût négatif signifie que l\'action rapporte de l\'argent tout en réduisant les émissions : ce sont les premières à lancer.'],
   ['p', 'La courbe des coûts d\'abattement classe les actions du moins cher au plus cher, avec la largeur de chaque barre égale aux tonnes évitées. Elle montre d\'un coup d\'œil jusqu\'où aller pour atteindre l\'objectif et à quel coût.'],
   ['ex', 'Exemple (chargez-le dans l\'outil pour voir le détail)', 'Le réglage du chauffage et l\'éclairage LED ont un coût négatif : ils rapportent plus qu\'ils ne coûtent. La pompe à chaleur coûte environ 30 € par tonne évitée, les véhicules électriques environ 250 €, les panneaux solaires (avec un faible gain annuel) plus de 400 €. Pour éviter 200 tonnes par an, il faut aller jusqu\'à la pompe à chaleur : c\'est elle qui apporte le plus de tonnes.'],
   ['outil', '#ateliers--finance', 'Construire votre courbe des coûts d\'abattement']]},
  {id: 'b4', t: 'Financer : aides et prix interne du carbone', d: '15 min', b: [
   ['ul', ['Aides publiques : ADEME, Bpifrance (diagnostics, prêts verts), certificats d\'économies d\'énergie, aides régionales.', 'Prix interne du carbone : l\'entreprise ajoute un coût fictif par tonne (par exemple 100 € par tonne) dans ses calculs d\'investissement pour favoriser les options bas carbone.', 'Financements verts : prêts à impact dont le taux baisse si des objectifs RSE sont atteints.']],
   ['outil', '#pilotage--aides', 'Les aides et financements']]},
  {id: 'b5', t: 'Arbitrer et convaincre une direction', d: '20 min', b: [
   ['p', 'Une direction décide sur une page claire : le problème, les options, la recommandation, les chiffres, les risques.'],
   ['ol', ['Le problème en deux phrases (obligation, coût, risque, attente client).', 'Deux ou trois options comparées sur les mêmes critères : coût, gains, tonnes évitées, délai, risques.', 'Votre recommandation et pourquoi.', 'Ce que l\'on demande : budget, décision, date.', 'Les prochaines étapes.']],
   ['ex', 'Phrase d\'accroche efficace', '« Pour 120 000 € investis, nous économisons 38 000 € par an, nous réduisons nos émissions de 20 % et nous répondons à l\'exigence de notre premier client. Le retour sur investissement est de 3,2 ans. »'],
   ['outil', 'tpl:decision', 'Télécharger le modèle de note de décision'], ['outil', '#boite--scenarios', 'Comparer des scénarios']]}
 ],
 outils: [['#ateliers--finance', 'Calculateur financier et courbe des coûts d\'abattement'], ['#boite--scenarios', 'Comparaison de scénarios'], ['#pilotage--aides', 'Aides et financements']],
 livrables: [['Calcul de rentabilité', '#ateliers--finance'], ['Note de décision', 'tpl:decision']],
 cas: ['eclairage-roi', 'bilan-carbone'],
 auto: ['Je distingue investissement et dépense de fonctionnement', 'Je sais calculer un temps de retour', 'Je sais expliquer et calculer une VAN', 'Je sais calculer un coût par tonne évitée', 'Je sais lire une courbe des coûts d\'abattement', 'Je sais rédiger une note de décision d\'une page']};

PCOURS.decarbonation = {id: 'decarbonation', metier: 'charge-decarbonation', titre: 'Chargé de mission décarbonation', c: '#2357A6', type: 'Parcours métier', intro: 'Le chargé de mission décarbonation mesure les émissions de gaz à effet de serre, construit la trajectoire de réduction, chiffre et suit les actions, et engage les fournisseurs. Ce parcours apprend chaque mission pas à pas, avec des exemples chiffrés, et donne l\'outil pour produire chaque livrable : bilan GES, plan de transition, suivi des réductions.',
 comp: [['Bilan carbone et climat', ['Comprendre les scopes et les facteurs d\'émission', 'Calculer un bilan et identifier les postes majeurs', 'Construire une trajectoire et un plan de transition chiffré']], ['Gestion budgétaire et arbitrage', ['Lire un budget', 'Calculer un retour sur investissement', 'Comparer des scénarios et convaincre']], ['Gestion de projet', ['Comprendre les étapes', 'Planifier et suivre', 'Piloter plusieurs projets']]],
 lecons: [
  {id: 'd1', t: 'Les bases : gaz à effet de serre, CO₂e et scopes', d: '20 min', b: [
   ['p', 'Plusieurs gaz réchauffent l\'atmosphère : dioxyde de carbone (CO₂), méthane (CH₄), protoxyde d\'azote (N₂O), gaz fluorés. Pour les additionner, on les convertit en équivalent CO₂ (CO₂e) grâce à leur pouvoir de réchauffement global sur 100 ans : environ 28 à 30 pour le méthane, environ 265 à 273 pour le protoxyde d\'azote, de plusieurs centaines à plusieurs milliers pour les gaz fluorés des climatisations.'],
   ['tab', ['Scope', 'Contenu', 'Exemples'], [['1', 'Émissions directes des sources possédées ou contrôlées', 'Chaudières, fours, véhicules de l\'entreprise, fuites de fluides frigorigènes, procédés'], ['2', 'Émissions de l\'énergie achetée', 'Électricité, chaleur, vapeur, froid achetés'], ['3 amont', 'Émissions de la chaîne de valeur avant l\'entreprise', 'Achats de biens et services, immobilisations, transport amont, déchets, déplacements, trajets domicile-travail'], ['3 aval', 'Émissions après la vente', 'Transport aval, utilisation des produits vendus, fin de vie']]],
   ['tip', 'La formule de tout bilan : émissions = donnée d\'activité × facteur d\'émission. Le reste est de la méthode et de la rigueur.'],
   ['outil', '#comprendre--carbone', 'Notion approfondie : le bilan carbone']]},
  {id: 'd2', t: 'Les méthodes et les obligations', d: '20 min', b: [
   ['tab', ['Référentiel', 'Nature', 'Quand l\'utiliser'], [['BEGES réglementaire', 'Obligation française (plus de 500 salariés en métropole, collectivités, établissements publics)', 'Publication tous les 4 ans pour les entreprises, avec un plan de transition, sur la plateforme de l\'ADEME'], ['Bilan Carbone®', 'Méthode française portée par l\'ABC', 'Démarche complète de mesure et de réduction ; requise pour le Diag Décarbon\'Action'], ['GHG Protocol', 'Standard international', 'Groupes internationaux, réponses au CDP, reporting ESRS E1'], ['ISO 14064-1', 'Norme internationale', 'Bilan à faire vérifier par un tiers'], ['ESRS E1', 'Norme européenne de reporting', 'Entreprises soumises à la CSRD : émissions, cibles, plan de transition'], ['ACT', 'Méthode d\'évaluation de stratégie (ADEME et CDP)', 'Évaluer la crédibilité d\'une stratégie bas carbone']]],
   ['tip', 'Ces méthodes sont compatibles : un bilan bien fait selon le Bilan Carbone® se présente aussi selon le GHG Protocol et le BEGES. Notez toujours la méthode utilisée.'],
   ['outil', '#outils', 'Vérifier si une entreprise est soumise au BEGES']]},
  {id: 'd3', t: 'Utiliser la Base Empreinte de l\'ADEME', d: '25 min', b: [
   ['p', 'La Base Empreinte est la base publique et gratuite des facteurs d\'émission en France (elle intègre l\'ancienne Base Carbone). Elle se consulte en ligne après création d\'un compte, et ses données se téléchargent.'],
   ['h', 'Trouver le bon facteur, pas à pas'],
   ['ol', ['Chercher par mot-clé (« électricité », « gazole », « acier »).', 'Vérifier l\'unité : par kWh, par litre, par tonne, par euro. Elle doit correspondre à votre donnée.', 'Vérifier la zone géographique (France, Europe, monde) et l\'année.', 'Choisir un facteur au statut valide et noter son incertitude.', 'Préférer un facteur physique (par kWh, par tonne) à un facteur monétaire (par euro dépensé) chaque fois que la quantité est connue.', 'Noter dans le fichier de calcul : nom exact, identifiant, valeur, unité, version de la base, date de consultation.']],
   ['ex', 'Exemple', 'Pour 480 000 kWh d\'électricité consommés en France, on retient le facteur du mix moyen français pour l\'usage concerné (de l\'ordre de quelques dizaines de grammes de CO₂e par kWh ; prenez la valeur exacte et datée dans la base). Pour 12 000 litres de gazole, le facteur est d\'environ 3,1 kgCO₂e par litre, amont compris : environ 37 tCO₂e.'],
   ['tip', 'Les facteurs monétaires (kgCO₂e par euro d\'achat) servent pour un premier bilan des achats ; ils sont imprécis (souvent ± 50 %). Remplacez-les progressivement par des données physiques ou des données des fournisseurs.'],
   ['outil', 'https://base-empreinte.ademe.fr', 'Ouvrir la Base Empreinte']]},
  {id: 'd4', t: 'Réaliser le bilan GES pas à pas', d: '40 min', b: [
   ['ol', ['Définir le périmètre organisationnel (sites, filiales) et l\'année de référence ; rédiger une note de méthode.', 'Lister les postes du scope 1, 2 et 3 et identifier les données à collecter.', 'Envoyer les demandes de données aux services avec une date limite.', 'Appliquer les facteurs d\'émission et calculer chaque poste.', 'Estimer l\'incertitude et documenter les hypothèses.', 'Analyser : classer les postes, calculer l\'intensité (par salarié, par euro de chiffre d\'affaires, par unité produite).', 'Restituer à la direction et passer au plan de réduction.']],
   ['ex', 'Résultat type d\'une PME industrielle de 180 salariés', 'Scope 1 : 410 t (gaz des fours, flotte). Scope 2 : 90 t. Scope 3 : 4 600 t, dont achats d\'acier 3 100 t, transport 620 t, déplacements domicile-travail 310 t. Total 5 100 t. Le scope 3 pèse 90 % : les achats d\'acier sont la priorité absolue.'],
   ['outil', '#terrain--bilan-carbone', 'Guide complet et calculatrice du bilan carbone'], ['outil', '#methodes', 'Méthode détaillée : réaliser un bilan carbone']]},
  {id: 'd5', t: 'Construire la trajectoire de réduction', d: '30 min', b: [
   ['p', 'La trajectoire fixe où l\'on veut aller (cible), en combien de temps, et le chemin année par année. Elle part de l\'année de référence du bilan.'],
   ['h', 'Les repères de la science'],
   ['ul', ['Pour une trajectoire compatible avec 1,5 °C, la SBTi demande sur les scopes 1 et 2 une baisse linéaire d\'au moins 4,2 % par an (en pourcentage de l\'année de référence).', 'Pour le scope 3, quand il dépasse 40 % du total, une cible est attendue, avec une baisse d\'au moins 2,5 % par an ou un engagement des fournisseurs.', 'Les standards de la SBTi évoluent : vérifiez la version en vigueur sur son site avant de fixer une cible officielle.']],
   ['ex', 'Calcul', 'Scopes 1 et 2 en 2025 : 500 t. Cible 2030 à 1,5 °C : 500 × (1 - 0,042 × 5) = 395 t, soit -21 %. Chemin : 479 t en 2026, 458 t en 2027, 437 t en 2028, 416 t en 2029, 395 t en 2030.'],
   ['outil', '#ateliers--trajectoire', 'Construire votre trajectoire']]},
  {id: 'd6', t: 'Écrire le plan de transition', d: '30 min', b: [
   ['p', 'Le plan de transition explique comment l\'entreprise va atteindre sa cible. Il est obligatoire avec le BEGES et attendu dans le rapport de durabilité (ESRS E1) pour les entreprises concernées.'],
   ['ol', ['Les cibles : année de référence, objectifs intermédiaires et finaux, périmètre.', 'Les leviers de décarbonation, avec les tonnes évitées de chacun.', 'Les moyens : investissements (CapEx) et dépenses (OpEx), financements.', 'Le calendrier et les jalons.', 'La gouvernance : qui pilote, qui décide, comment on rend compte.', 'Les écarts : si la trajectoire n\'atteint pas la cible, le dire et expliquer.']],
   ['outil', 'tpl:transition', 'Télécharger le modèle de plan de transition'], ['outil', '#methodes', 'Méthode : bâtir un plan de transition climat']]},
  {id: 'd7', t: 'Chiffrer et suivre les actions', d: '25 min', b: [
   ['p', 'Chaque levier se chiffre : investissement, économies annuelles, tonnes évitées, coût par tonne. On lance d\'abord les actions rentables, puis on arbitre les autres.'],
   ['tab', ['Levier', 'Investissement', 'Économie par an', 'tCO₂e par an', 'Coût par tonne'], [['Réglage et régulation du chauffage', '5 000 €', '8 000 €', '20', 'négatif (rentable)'], ['Éclairage LED', '40 000 €', '12 000 €', '6', 'négatif (rentable)'], ['Pompe à chaleur', '350 000 €', '40 000 €', '180', 'légèrement positif'], ['Électrification de 30 véhicules', '450 000 €', '35 000 €', '150', 'positif']]],
   ['p', 'Le suivi : chaque année, refaire le bilan (au moins scopes 1 et 2), comparer à la trajectoire, expliquer les écarts (activité, périmètre, méthode, actions) et ajuster.'],
   ['outil', '#ateliers--finance', 'Courbe des coûts d\'abattement'], ['outil', '#pilotage--kpi', 'Suivre les émissions dans le tableau de bord'], ['outil', '#pcours--budget', 'Formation : gestion budgétaire et arbitrage']]},
  {id: 'd8', t: 'Engager les fournisseurs sur le scope 3', d: '30 min', b: [
   ['ol', ['Classer les fournisseurs par émissions estimées (montant d\'achats × facteur monétaire) : en général, 20 % des fournisseurs pèsent 80 % du scope 3 achats.', 'Commencer par les 10 à 30 plus importants.', 'Leur demander leurs données : bilan carbone, empreinte de leurs produits, cible de réduction.', 'Fixer des attentes progressives : bilan, puis cible, puis plan, puis résultats.', 'Intégrer un critère carbone dans les appels d\'offres et des clauses dans les contrats.', 'Accompagner les plus petits (webinaires, guides, outils simples) et suivre leurs progrès chaque année.']],
   ['ex', 'Exemple', 'Sur 400 fournisseurs, 25 représentent 78 % des émissions d\'achats. Après deux ans : 18 ont transmis leur bilan, 9 ont une cible de réduction, et l\'acier est acheté avec 40 % de matière recyclée, ce qui réduit de 900 t le scope 3.'],
   ['outil', '#ateliers--scope3', 'Outil : engagement des fournisseurs'], ['outil', '#methodes', 'Méthode : déployer les achats responsables']]},
  {id: 'd9', t: 'Les outils du métier', d: '15 min', b: [
   ['tab', ['Outil', 'À quoi il sert', 'Accès'], [['Tableur Bilan Carbone®', 'Tableur de calcul de la méthode Bilan Carbone®', 'Licence auprès de l\'ABC après formation'], ['Base Empreinte', 'Facteurs d\'émission officiels', 'Gratuit, en ligne'], ['Logiciels de comptabilité carbone', 'Plateformes en ligne : collecte des données, calcul, suivi pluriannuel, reporting', 'Abonnement ; choisir selon la taille, la méthode reconnue, l\'export des données, l\'accompagnement'], ['Plateforme bilans-ges.ademe.fr', 'Publication du BEGES réglementaire', 'Gratuit'], ['Diag Décarbon\'Action', 'Premier bilan et plan d\'action accompagnés pour les PME et ETI', 'Bpifrance et ADEME, cofinancé'], ['Calculatrice de l\'application', 'Premier bilan simplifié et apprentissage', 'Dans SERIKI BIBLE RSE']]],
   ['tip', 'Un logiciel ne remplace pas la méthode : c\'est la qualité des données et des hypothèses qui fait la qualité du bilan. Vérifiez qu\'il permet d\'exporter vos données, pour ne pas en dépendre.'],
   ['outil', '#prestataires--trouver', 'Trouver un cabinet ou un formateur Bilan Carbone®']]}
 ],
 outils: [['#terrain--bilan-carbone', 'Calculatrice du bilan carbone'], ['#ateliers--trajectoire', 'Trajectoire de réduction'], ['#ateliers--scope3', 'Engagement des fournisseurs (scope 3)'], ['#ateliers--finance', 'Calculateur financier et coûts d\'abattement'], ['#boite--scenarios', 'Comparaison de scénarios'], ['#pilotage--kpi', 'Tableau de bord des émissions']],
 livrables: [['Bilan GES', '#terrain--bilan-carbone'], ['Note de méthode du bilan', 'tpl:methode'], ['Trajectoire de réduction', '#ateliers--trajectoire'], ['Plan de transition', 'tpl:transition'], ['Suivi des réductions', '#pilotage--kpi']],
 cas: ['bilan-carbone', 'eclairage-roi'],
 auto: ['Je sais classer une source d\'émission dans le bon scope', 'Je sais trouver et documenter un facteur dans la Base Empreinte', 'Je sais calculer un bilan simple et estimer son incertitude', 'Je sais construire une trajectoire alignée sur 1,5 °C', 'Je sais rédiger un plan de transition', 'Je sais calculer un coût par tonne évitée et prioriser les actions', 'Je sais organiser l\'engagement des fournisseurs sur le scope 3', 'Je connais les obligations du BEGES et de l\'ESRS E1']};

PCOURS.circulaire = {id: 'circulaire', metier: 'charge-circulaire', titre: 'Chargé d\'économie circulaire', c: '#A8621A', type: 'Parcours métier', intro: 'Le chargé d\'économie circulaire réduit les déchets et la consommation de ressources : il analyse les flux de matières, propose réemploi et recyclage, accompagne l\'écoconception et veille aux obligations (loi AGEC, emballages). Ce parcours enseigne chaque mission avec des exemples chiffrés et fournit les outils de chaque livrable : diagnostic des flux, plan d\'économie circulaire, fiches d\'écoconception.',
 comp: [['Économie circulaire', ['Connaître les principes', 'Analyser des flux de matières et de déchets', 'Concevoir un plan d\'économie circulaire']], ['Analyse environnementale', ['Identifier les impacts d\'une activité', 'Réaliser un diagnostic', 'Proposer et chiffrer des améliorations']], ['Gestion de projet', ['Comprendre les étapes', 'Planifier et suivre', 'Piloter plusieurs projets']]],
 lecons: [
  {id: 'c1', t: 'Les principes de l\'économie circulaire', d: '20 min', b: [
   ['p', 'L\'économie linéaire extrait, fabrique, consomme et jette. L\'économie circulaire garde les ressources en usage le plus longtemps possible. L\'ADEME la décrit en sept piliers.'],
   ['tab', ['Pilier', 'Exemple en entreprise'], [['Approvisionnement durable', 'Matières recyclées, bois certifié'], ['Écoconception', 'Produit plus léger, démontable, réparable'], ['Écologie industrielle et territoriale', 'La chaleur perdue d\'une usine chauffe la voisine'], ['Économie de la fonctionnalité', 'Louer un service plutôt que vendre un produit'], ['Consommation responsable', 'Achats d\'occasion, vrac'], ['Allongement de la durée d\'usage', 'Réparation, reconditionnement, pièces détachées'], ['Recyclage', 'Tri à la source et filières de valorisation']]],
   ['h', 'La hiérarchie des modes de traitement'],
   ['ol', ['Prévention : ne pas produire le déchet.', 'Préparation au réemploi.', 'Recyclage.', 'Autre valorisation (énergie).', 'Élimination (enfouissement, incinération sans valorisation).']],
   ['tip', 'Le déchet le moins cher est celui qu\'on ne produit pas : un déchet coûte deux fois, à l\'achat de la matière perdue et à son élimination.']]},
  {id: 'c2', t: 'Les obligations : AGEC, tri, emballages', d: '35 min', b: [
   ['h', 'La loi AGEC (2020) et ses suites'],
   ['ul', ['Interdiction de détruire les invendus non alimentaires : don, réemploi ou recyclage obligatoires.', 'Fin progressive des emballages en plastique à usage unique d\'ici 2040, avec des objectifs fixés tous les cinq ans (décret « 3R » : réduction, réemploi, recyclage).', 'Extension de la responsabilité élargie du producteur (REP) à de nouvelles filières : le metteur sur le marché finance la fin de vie (emballages ménagers et professionnels, équipements électriques, meubles, textiles, jouets, articles de sport et de bricolage, matériaux de construction…).', 'Information du consommateur : consignes de tri, qualités et caractéristiques environnementales des produits, indice de réparabilité ou de durabilité pour certains appareils.']],
   ['h', 'Le tri des déchets en entreprise'],
   ['ul', ['Tri à la source du papier et carton, du métal, du plastique, du verre et du bois (« 5 flux »), plus la fraction minérale et le plâtre pour les déchets de chantier, et les textiles depuis 2025.', 'Tri à la source des biodéchets pour tous les professionnels depuis le 1er janvier 2024, quel que soit le volume.', 'Conserver les preuves : contrats, attestations de valorisation des prestataires, registre des déchets.']],
   ['h', 'Le règlement européen sur les emballages'],
   ['p', 'Le règlement (UE) 2025/40 sur les emballages et déchets d\'emballages s\'applique depuis le 12 août 2026, directement dans tous les États membres. Premières obligations : déclaration de conformité et documentation technique des emballages, emballages recyclables, restrictions sur les substances (PFAS dans les emballages alimentaires, métaux lourds). D\'autres exigences arrivent progressivement jusqu\'en 2040 : contenu recyclé minimal, réduction de l\'espace vide, objectifs de réemploi, étiquetage harmonisé.'],
   ['tip', 'Ces règles évoluent souvent et dépendent de l\'activité : vérifiez toujours le texte en vigueur et vos filières REP auprès de votre éco-organisme.'],
   ['outil', '#ateliers--agec', 'Vérifier vos obligations AGEC et emballages']]},
  {id: 'c3', t: 'Réaliser le diagnostic des flux', d: '35 min', b: [
   ['ol', ['Cartographier le procédé : étapes de fabrication ou de service, entrées et sorties de chacune.', 'Mesurer les entrées : matières premières, emballages reçus, eau, énergie (tonnes, m³, kWh et coût d\'achat).', 'Mesurer les sorties : produits vendus, chutes, rebuts, emballages, déchets par catégorie (pesées sur une période représentative, bordereaux des prestataires).', 'Identifier pour chaque déchet sa filière (réemploi, recyclage, valorisation énergétique, enfouissement) et son coût complet.', 'Calculer les indicateurs : taux de perte matière, taux de valorisation, coût total des déchets.', 'Repérer les trois à cinq flux prioritaires (les plus lourds, les plus coûteux, les plus mal valorisés).']],
   ['ex', 'Exemple : menuiserie de 40 salariés', 'Entrées : 820 t de bois par an (410 000 €). Sorties : 610 t de produits finis, 190 t de chutes et sciures, 14 t d\'emballages, 6 t de déchets dangereux (vernis). Taux de perte matière : 23 %. Coût caché : 190 t de bois acheté perdu (95 000 €) + 18 000 € d\'enlèvement. Pistes : optimiser la découpe (logiciel d\'imbrication, -30 % de chutes), vendre les sciures en granulés, réemployer les palettes avec les fournisseurs.'],
   ['outil', '#ateliers--flux', 'Outil : diagnostic des flux']]},
  {id: 'c4', t: 'Proposer réemploi et recyclage', d: '25 min', b: [
   ['tab', ['Flux', 'Solution', 'Gain type'], [['Palettes et caisses', 'Retour fournisseur, palettes consignées', 'Achat et déchet évités'], ['Emballages de livraison', 'Emballages réutilisables en boucle avec les clients', 'Moins d\'achats d\'emballages, image'], ['Chutes de production', 'Optimisation de découpe, réintégration dans le procédé, revente', 'Matière économisée'], ['Équipements informatiques', 'Reconditionnement, don, vente', 'Valeur récupérée, numérique responsable'], ['Biodéchets de restauration', 'Compostage ou méthanisation', 'Obligation respectée'], ['Invendus', 'Dons à des associations', 'Obligation AGEC, réduction d\'impôt possible']]],
   ['p', 'Chiffrez chaque solution : coût de mise en place, économies (achats évités, enlèvement évité, revente), tonnes évitées. Partenaires utiles : éco-organismes, recycleries, structures de l\'économie sociale et solidaire, plateformes de matières de seconde main, entreprises voisines (écologie industrielle).']]},
  {id: 'c5', t: 'Accompagner l\'écoconception', d: '35 min', b: [
   ['p', 'Écoconcevoir, c\'est réduire les impacts d\'un produit ou d\'un service sur tout son cycle de vie, dès la conception, sans dégrader sa fonction. On évite les transferts d\'impact (gagner sur une étape et perdre sur une autre).'],
   ['ol', ['Choisir un produit et définir sa fonction (l\'unité fonctionnelle : « emballer 1 kg de café pendant 12 mois »).', 'Évaluer ses impacts à chaque étape : matières, fabrication, transport, usage, fin de vie (analyse simplifiée ou analyse de cycle de vie).', 'Repérer l\'étape qui pèse le plus.', 'Chercher des leviers sur cette étape en priorité.', 'Comparer la nouvelle version à l\'ancienne avec les mêmes indicateurs.', 'Documenter dans une fiche d\'écoconception.']],
   ['tab', ['Étape', 'Leviers'], [['Matières', 'Moins de matière, matière recyclée ou biosourcée, moins de matériaux différents'], ['Fabrication', 'Moins d\'énergie, moins de chutes, procédés plus propres'], ['Distribution', 'Produit plus compact et plus léger, palettisation optimisée'], ['Usage', 'Moins de consommation, plus de durabilité, réparabilité'], ['Fin de vie', 'Démontable, monomatériau, recyclable dans les filières existantes']]],
   ['ex', 'Exemple', 'Une gourde : passer de l\'aluminium neuf à l\'aluminium recyclé divise fortement l\'impact de la matière ; rendre le bouchon remplaçable allonge la durée de vie ; supprimer l\'étui carton réduit l\'emballage. Norme de référence : ISO 14006.'],
   ['outil', '#ateliers--ecoconception', 'Remplir une fiche d\'écoconception']]},
  {id: 'c6', t: 'L\'analyse de cycle de vie (ACV)', d: '25 min', b: [
   ['p', 'L\'ACV, encadrée par les normes ISO 14040 et 14044, quantifie plusieurs impacts (climat, eau, ressources, toxicité…) sur tout le cycle de vie. Elle comporte quatre étapes.'],
   ['ol', ['Objectifs et champ de l\'étude : unité fonctionnelle, frontières du système.', 'Inventaire : toutes les entrées et sorties de matières et d\'énergie.', 'Évaluation des impacts : calcul des indicateurs.', 'Interprétation : conclusions, limites, recommandations.']],
   ['tip', 'Une ACV complète demande des logiciels et des bases de données spécialisés, et une revue critique si elle sert à communiquer. Pour commencer, une ACV simplifiée suffit à orienter l\'écoconception.']]},
  {id: 'c7', t: 'Construire le plan d\'économie circulaire', d: '25 min', b: [
   ['ol', ['Partir du diagnostic des flux et des obligations.', 'Fixer des objectifs chiffrés (taux de valorisation, tonnes de déchets par unité produite, part de matière recyclée).', 'Choisir les actions : prévention, réemploi, recyclage, écoconception, achats.', 'Chiffrer chaque action : coût, gains, tonnes évitées, délai.', 'Nommer les responsables et planifier.', 'Suivre les indicateurs chaque trimestre.']],
   ['ex', 'Objectifs de la menuiserie', 'Réduire les chutes de 30 % en 18 mois ; 100 % des sciures valorisées ; 80 % des palettes réemployées ; taux de valorisation global de 65 % à 90 %.'],
   ['outil', 'tpl:planec', 'Télécharger le modèle de plan d\'économie circulaire'], ['outil', '#pilotage--aides', 'Financer : Diag Éco-Flux et aides de l\'ADEME']]}
 ],
 outils: [['#ateliers--flux', 'Diagnostic des flux de matières et de déchets'], ['#ateliers--ecoconception', 'Fiche d\'écoconception'], ['#ateliers--agec', 'Obligations AGEC et emballages'], ['#ateliers--finance', 'Calculateur financier'], ['#boite--projets', 'Gestion de projet']],
 livrables: [['Diagnostic des flux', '#ateliers--flux'], ['Plan d\'économie circulaire', 'tpl:planec'], ['Fiches d\'écoconception', '#ateliers--ecoconception'], ['Vérification des obligations', '#ateliers--agec']],
 cas: ['economie-circulaire', 'iso14001'],
 auto: ['Je connais les sept piliers et la hiérarchie des déchets', 'Je connais les obligations AGEC, de tri et sur les emballages', 'Je sais réaliser un diagnostic des flux et calculer un taux de valorisation', 'Je sais proposer et chiffrer des solutions de réemploi et de recyclage', 'Je sais conduire une écoconception sur une étape prioritaire', 'Je sais expliquer les quatre étapes d\'une ACV', 'Je sais construire et suivre un plan d\'économie circulaire']};

/* ---------- Modèles des parcours ---------- */
const PTPL = {
 cadrage: ['Note de cadrage du projet', '<h1>Note de cadrage du projet</h1><p style="text-align:center">[Nom du projet] · Version [n] du [date] · Commanditaire : [nom]</p><h2>1. Contexte et enjeu</h2><p>[Pourquoi ce projet maintenant : obligation, demande client, risque, opportunité.]</p><h2>2. Objectif</h2><p>[Objectif SMART : spécifique, mesurable, atteignable, réaliste, daté.]</p><h2>3. Périmètre</h2><p><b>Inclus :</b> [sites, activités, scopes, période]</p><p><b>Exclu :</b> [ce qui ne sera pas traité]</p><h2>4. Livrables</h2><ul><li>[Livrable 1]</li><li>[Livrable 2]</li></ul><h2>5. Parties prenantes</h2><table border="1"><tr><th>Rôle</th><th>Nom</th><th>Implication</th></tr><tr><td>Commanditaire</td><td></td><td>Valide les jalons</td></tr><tr><td>Chef de projet</td><td></td><td>Pilote</td></tr><tr><td>Contributeurs</td><td></td><td>Fournissent les données</td></tr></table><h2>6. Contraintes et hypothèses</h2><p>[Délai, budget, disponibilité, accès aux données.]</p><h2>7. Risques principaux</h2><table border="1"><tr><th>Risque</th><th>Probabilité</th><th>Impact</th><th>Parade</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>8. Budget et ressources</h2><p>[Montant, temps interne, prestataires.]</p><h2>9. Planning et jalons</h2><table border="1"><tr><th>Jalon</th><th>Date</th></tr><tr><td>Validation du cadrage</td><td></td></tr><tr><td></td><td></td></tr></table><h2>10. Gouvernance</h2><p>[Comité de pilotage : membres, fréquence. Comité de projet : membres, fréquence.]</p><p style="text-align:right">Validé par [commanditaire], le [date]</p>'],
 copil: ['Compte rendu de comité de pilotage', '<h1>Compte rendu du comité de pilotage</h1><p style="text-align:center">[Projet] · [date] · Présents : [noms]</p><h2>Météo du projet</h2><p>[Soleil / Nuage / Orage] — [une phrase d\'explication]</p><h2>Avancement</h2><table border="1"><tr><th>Lot ou jalon</th><th>Prévu</th><th>Réalisé</th><th>Écart</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Budget</h2><p>Prévu : [ ] € · Dépensé et engagé : [ ] € · Écart : [ ] €</p><h2>Points d\'attention et risques</h2><ul><li></li></ul><h2>Décisions prises</h2><ol><li></li></ol><h2>Actions</h2><table border="1"><tr><th>Action</th><th>Responsable</th><th>Échéance</th></tr><tr><td></td><td></td><td></td></tr></table><p>Prochain comité : [date]</p>'],
 rex: ['Bilan de projet et retour d\'expérience', '<h1>Bilan de projet et retour d\'expérience</h1><p style="text-align:center">[Projet] · [date de clôture]</p><h2>Objectifs et résultats</h2><table border="1"><tr><th>Objectif</th><th>Résultat</th><th>Atteint ?</th></tr><tr><td></td><td></td><td></td></tr></table><h2>Délais et budget</h2><p>Durée prévue / réelle : [ ] · Budget prévu / réel : [ ]</p><h2>Ce qui a bien fonctionné</h2><ul><li></li></ul><h2>Ce qui a manqué</h2><ul><li></li></ul><h2>Ce que nous ferons autrement</h2><ul><li></li></ul><h2>Passage de relais</h2><p>[Qui suit les indicateurs et les actions après le projet ? Où sont rangés les fichiers ?]</p>'],
 decision: ['Note de décision', '<h1>Note de décision</h1><p style="text-align:center">Pour : [comité de direction] · De : [nom] · [date]</p><h2>Le problème</h2><p>[Deux phrases : obligation, coût, risque, attente client.]</p><h2>Les options</h2><table border="1"><tr><th>Critère</th><th>Option A</th><th>Option B</th><th>Option C</th></tr><tr><td>Investissement</td><td></td><td></td><td></td></tr><tr><td>Gains annuels</td><td></td><td></td><td></td></tr><tr><td>Temps de retour</td><td></td><td></td><td></td></tr><tr><td>tCO₂e évitées par an</td><td></td><td></td><td></td></tr><tr><td>Délai</td><td></td><td></td><td></td></tr><tr><td>Risques</td><td></td><td></td><td></td></tr></table><h2>Recommandation</h2><p>[Option retenue et pourquoi.]</p><h2>Décision demandée</h2><p>[Budget, validation, date.]</p><h2>Prochaines étapes</h2><ol><li></li></ol>'],
 transition: ['Plan de transition climat', '<h1>Plan de transition climat</h1><p style="text-align:center">[Entreprise] · Adopté le [date] par [instance]</p><h2>1. Point de départ</h2><p>Bilan des émissions de l\'année [référence] : scope 1 [ ] t, scope 2 [ ] t, scope 3 [ ] t. Méthode : [Bilan Carbone® / GHG Protocol]. Périmètre : [ ].</p><h2>2. Cibles</h2><table border="1"><tr><th>Périmètre</th><th>Référence</th><th>Cible intermédiaire</th><th>Cible finale</th><th>Alignement</th></tr><tr><td>Scopes 1 et 2</td><td></td><td></td><td></td><td>[1,5 °C ?]</td></tr><tr><td>Scope 3</td><td></td><td></td><td></td><td></td></tr></table><h2>3. Leviers de décarbonation</h2><table border="1"><tr><th>Levier</th><th>tCO₂e évitées par an</th><th>Investissement</th><th>Dépenses ou économies annuelles</th><th>Échéance</th><th>Responsable</th></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table><h2>4. Moyens et financement</h2><p>[Budget pluriannuel, aides, financements verts.]</p><h2>5. Gouvernance et suivi</h2><p>[Pilote, comité, fréquence de revue, indicateurs, publication.]</p><h2>6. Écarts et limites</h2><p>[Si la trajectoire n\'atteint pas la cible, l\'écart et les pistes pour le combler. Dépendances : technologies, fournisseurs, réglementation.]</p>'],
 methode: ['Note de méthode du bilan GES', '<h1>Note de méthode du bilan des émissions</h1><p style="text-align:center">[Entreprise] · Année [ ]</p><h2>Périmètre organisationnel</h2><p>Approche : [contrôle opérationnel / financier]. Entités et sites inclus : [ ]. Exclusions et raisons : [ ].</p><h2>Périmètre opérationnel</h2><p>Scope 1 : [postes]. Scope 2 : [postes, méthode localisation et marché]. Scope 3 : [catégories retenues et raisons des exclusions].</p><h2>Données et sources</h2><table border="1"><tr><th>Poste</th><th>Donnée</th><th>Unité</th><th>Source</th><th>Responsable</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Facteurs d\'émission</h2><table border="1"><tr><th>Poste</th><th>Facteur</th><th>Valeur et unité</th><th>Source, version et date</th><th>Incertitude</th></tr><tr><td></td><td></td><td></td><td>Base Empreinte, version [ ], consultée le [ ]</td><td></td></tr></table><h2>Hypothèses et estimations</h2><ul><li></li></ul><h2>Incertitude globale</h2><p>[ ] %</p><h2>Changements par rapport à l\'année précédente</h2><p>[Périmètre, méthode, facteurs.]</p>'],
 planec: ['Plan d\'économie circulaire', '<h1>Plan d\'économie circulaire</h1><p style="text-align:center">[Entreprise ou site] · [période]</p><h2>1. Diagnostic de départ</h2><p>Entrées de matières : [ ] t · Déchets : [ ] t · Taux de valorisation : [ ] % · Coût total des déchets : [ ] €</p><h2>2. Obligations à respecter</h2><ul><li>[Tri à la source, biodéchets, REP, invendus, emballages…]</li></ul><h2>3. Objectifs</h2><table border="1"><tr><th>Indicateur</th><th>Départ</th><th>Cible</th><th>Échéance</th></tr><tr><td>Taux de valorisation</td><td></td><td></td><td></td></tr><tr><td>Déchets par unité produite</td><td></td><td></td><td></td></tr><tr><td>Part de matière recyclée</td><td></td><td></td><td></td></tr></table><h2>4. Actions</h2><table border="1"><tr><th>Action</th><th>Type (prévention, réemploi, recyclage, écoconception)</th><th>Coût</th><th>Gains</th><th>Tonnes évitées</th><th>Responsable</th><th>Échéance</th></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table><h2>5. Partenaires</h2><p>[Prestataires, éco-organismes, recycleries, entreprises voisines.]</p><h2>6. Suivi</h2><p>[Indicateurs, fréquence, responsable.]</p>']
};

/* =====================================================================
   COUCHE VISUELLE : SCHÉMAS ANIMÉS, CHIFFRES, CARTES, QUIZ ÉCLAIR,
   DIAPORAMA PLEIN ÉCRAN (AUTOPLAY ET VOIX), APPARITIONS AU DÉFILEMENT
   ===================================================================== */
const VPAL = ['#2357A6', '#1F8A5B', '#C2532A', '#8A5214', '#6B3FA0', '#0E7C86', '#B03060', '#4C6A12'];
const vfNum = s => String(s).replace('.', ',');
const VZ = {
  flow: d => '<div class="vflow">' + d.map((x, i) => '<div class="vfi" style="--i:' + i + ';--c:' + VPAL[i % 8] + '"><span class="vfn">' + (i + 1) + '</span><b>' + esc(x[0]) + '</b>' + (x[1] ? '<small>' + esc(x[1]) + '</small>' : '') + '</div>').join('') + '</div>',
  pyramid: d => { const n = d.items.length; return '<div class="vpyr' + (d.inv ? ' inv' : '') + '">' + (d.top ? '<span class="vpl">' + esc(d.top) + '</span>' : '') + d.items.map((x, i) => { const w = d.inv ? 100 - i * (55 / Math.max(1, n - 1)) : 45 + i * (55 / Math.max(1, n - 1)); return '<div class="vpi" style="--w:' + w + '%;--i:' + i + ';--c:' + VPAL[i % 8] + '"><b>' + esc(x[0]) + '</b>' + (x[1] ? '<small>' + esc(x[1]) + '</small>' : '') + '</div>'; }).join('') + (d.bot ? '<span class="vpl">' + esc(d.bot) + '</span>' : '') + '</div>'; },
  cycle: d => { const n = d.items.length, R = 38; let ring = '<svg viewBox="0 0 100 100" class="vcyr" aria-hidden="true"><circle cx="50" cy="50" r="' + R + '" fill="none" stroke="var(--line)" stroke-width="1.2"/><circle class="vcyd" cx="50" cy="50" r="' + R + '" fill="none" stroke="var(--dc,#2357A6)" stroke-width="1.6" stroke-dasharray="4 3"/>'; for (let i = 0; i < n; i++) { const a = (2 * Math.PI * (i + .5)) / n - Math.PI / 2, x = 50 + R * Math.cos(a), y = 50 + R * Math.sin(a), r = a * 180 / Math.PI + 90; ring += '<path d="M -2 -2 L 1.6 0 L -2 2 z" fill="var(--dc,#2357A6)" transform="translate(' + x.toFixed(2) + ' ' + y.toFixed(2) + ') rotate(' + r.toFixed(1) + ')"/>'; } ring += '</svg>'; return '<div class="vcyc">' + ring + '<div class="vcyc-c">' + esc(d.center || '') + '</div>' + d.items.map((x, i) => { const a = (2 * Math.PI * i) / n - Math.PI / 2; return '<div class="vcn" style="left:' + (50 + R * Math.cos(a)).toFixed(1) + '%;top:' + (50 + R * Math.sin(a)).toFixed(1) + '%;--i:' + i + ';--c:' + VPAL[i % 8] + '"><b>' + esc(x[0]) + '</b>' + (x[1] ? '<small>' + esc(x[1]) + '</small>' : '') + '</div>'; }).join('') + '</div>'; },
  matrix: d => { const X = v => 50 + v / 5 * 320, Y = v => 290 - v / 5 * 260; let g = '<rect x="50" y="30" width="320" height="260" fill="var(--paper)"/>' + (d.or ? '<rect x="50" y="30" width="320" height="260" fill="var(--dc,#2357A6)" opacity=".13"/><rect x="50" y="' + Y(d.s || 3) + '" width="' + (X(d.s || 3) - 50) + '" height="' + (290 - Y(d.s || 3)) + '" fill="var(--paper)"/>' : '<rect x="' + X(d.s || 3) + '" y="30" width="' + (370 - X(d.s || 3)) + '" height="' + (Y(d.s || 3) - 30) + '" fill="var(--dc,#2357A6)" opacity=".13"/>') + '<line x1="' + X(d.s || 3) + '" y1="30" x2="' + X(d.s || 3) + '" y2="290" stroke="var(--muted)" stroke-dasharray="4 4"/><line x1="50" y1="' + Y(d.s || 3) + '" x2="370" y2="' + Y(d.s || 3) + '" stroke="var(--muted)" stroke-dasharray="4 4"/><line x1="50" y1="290" x2="372" y2="290" stroke="currentColor"/><line x1="50" y1="290" x2="50" y2="26" stroke="currentColor"/><text x="210" y="314" text-anchor="middle" font-size="12" fill="currentColor">' + esc(d.x) + ' →</text><text x="18" y="160" text-anchor="middle" font-size="12" fill="currentColor" transform="rotate(-90 18 160)">' + esc(d.y) + ' →</text><text x="366" y="46" text-anchor="end" font-size="11" font-weight="700" fill="var(--dc,#2357A6)">' + esc(d.zone || 'Enjeux matériels') + '</text>'; d.pts.forEach((p, i) => { g += '<g class="vmp" style="--i:' + i + '"><circle cx="' + X(p[1]) + '" cy="' + Y(p[2]) + '" r="9" fill="' + VPAL[i % 8] + '"/><text x="' + X(p[1]) + '" y="' + (Y(p[2]) + 4) + '" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">' + (i + 1) + '</text></g>'; }); return '<div class="vmat"><svg viewBox="0 0 380 322" role="img" aria-label="Matrice">' + g + '</svg><ol class="vleg">' + d.pts.map((p, i) => '<li style="--c:' + VPAL[i % 8] + '">' + esc(p[0]) + '</li>').join('') + '</ol></div>'; },
  scopes: d => { d = d || {}; const col = (c, t, s, L) => '<div class="vsc" style="--c:' + c + '"><b>' + t + '</b><small>' + s + '</small><ul>' + L.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>'; return '<div class="vscopes">' + col('#6B3FA0', 'Scope 3 amont', 'Indirect, chez les fournisseurs', d.amont || ['Achats de biens et services', 'Fret amont', 'Immobilisations', 'Déplacements et trajets des salariés']) + '<div class="vsc mid"><div class="vsc" style="--c:#C2532A"><b>Scope 1</b><small>Émissions directes</small><ul><li>Combustion de gaz, fioul</li><li>Carburant des véhicules</li><li>Fuites de fluides frigorigènes</li></ul></div><div class="vsc" style="--c:#8A5214"><b>Scope 2</b><small>Énergie achetée</small><ul><li>Électricité</li><li>Chaleur, vapeur, froid</li></ul></div><span class="vscl">' + esc(d.ent || 'Votre entreprise') + '</span></div>' + col('#0E7C86', 'Scope 3 aval', 'Indirect, chez les clients', d.aval || ['Transport des produits vendus', 'Utilisation des produits', 'Fin de vie des produits', 'Investissements']) + '</div>'; },
  bars: d => { const m = Math.max(...d.items.map(x => x[1])) || 1; return '<div class="vbars">' + d.items.map((x, i) => '<div class="vbr" style="--i:' + i + '"><span>' + esc(x[0]) + '</span><div><i style="--w:' + (100 * x[1] / m).toFixed(1) + '%;--c:' + (x[2] || VPAL[i % 8]) + '"></i></div><b>' + vfNum(x[1]) + (d.unit ? ' ' + esc(d.unit) : '') + '</b></div>').join('') + '</div>'; },
  donut: d => { const T = d.items.reduce((s, x) => s + x[1], 0) || 1, C = 2 * Math.PI * 40; let off = 0, g = ''; d.items.forEach((x, i) => { const L = C * x[1] / T; g += '<circle cx="60" cy="60" r="40" fill="none" stroke="' + VPAL[i % 8] + '" stroke-width="18" stroke-dasharray="' + L.toFixed(2) + ' ' + (C - L).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" style="--i:' + i + '" transform="rotate(-90 60 60)"/>'; off += L; }); return '<div class="vdon"><svg viewBox="0 0 120 120" role="img" aria-label="Répartition">' + g + '<text x="60" y="58" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor">' + esc(d.total || '') + '</text><text x="60" y="73" text-anchor="middle" font-size="7.5" fill="currentColor">' + esc(d.sub || '') + '</text></svg><ul class="vleg">' + d.items.map((x, i) => '<li style="--c:' + VPAL[i % 8] + '"><b>' + Math.round(100 * x[1] / T) + ' %</b> ' + esc(x[0]) + '</li>').join('') + '</ul></div>'; },
  versus: d => '<div class="vvs"><div class="vvn"><b>' + esc(d.a[0]) + '</b><ul>' + d.a[1].map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div><div class="vvy"><b>' + esc(d.b[0]) + '</b><ul>' + d.b[1].map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div></div>',
  formula: d => '<div class="vfor"><span class="vfl">' + esc(d[0]) + ' =</span>' + (d[2] ? '<span class="vfr"><span>' + esc(d[1]) + '</span><span>' + esc(d[2]) + '</span></span>' : '<span class="vfr1">' + esc(d[1]) + '</span>') + (d[3] ? '<span class="vfx">' + esc(d[3]) + '</span>' : '') + '</div>',
  gauge: d => '<div class="vgau">' + d.map((x, i) => { const p = Math.max(0, Math.min(100, x[1])); return '<div style="--i:' + i + '"><svg viewBox="0 0 120 70" aria-hidden="true"><path d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="var(--line)" stroke-width="12" stroke-linecap="round"/><path class="vga" d="M10 62 A50 50 0 0 1 110 62" fill="none" stroke="' + VPAL[i % 8] + '" stroke-width="12" stroke-linecap="round" pathLength="100" style="--p:' + p + '"/></svg><b>' + esc(x[2] || (vfNum(x[1]) + ' %')) + '</b><small>' + esc(x[0]) + '</small></div>'; }).join('') + '</div>',
  layers: d => '<div class="vlay">' + d.map((x, i) => '<div style="--i:' + i + ';--c:' + VPAL[i % 8] + '"><b>' + esc(x[0]) + '</b><span>' + esc(x[1]) + '</span></div>').join('') + '</div>'
};
const VICO = {chart: 'chart', flag: 'flag', bag: 'bag', radar: 'radar', tool: 'tool', doc: 'doc', cal: 'cal', book: 'book'};
function visBloc(b){
  const k = b[0];
  if (k === 'ol') return '<ol class="tl">' + b[1].map((x, i) => { const m = x.match(/^([^:()]{3,48}) : (.+)$/); return '<li style="--i:' + i + '"><span class="tln">' + (i + 1) + '</span><div>' + (m ? '<b>' + esc(m[1]) + ' :</b> ' + esc(m[2]) : esc(x)) + '</div></li>'; }).join('') + '</ol>';
  if (k === 'kpi') return '<div class="kpis">' + b[1].map((x, i) => { const n = parseFloat(String(x[0]).replace(/\s/g, '').replace(',', '.')); return '<div style="--i:' + i + ';--c:' + VPAL[i % 8] + '"><b' + (isFinite(n) ? ' data-cnt="' + n + '" data-dec="' + ((String(x[0]).split(',')[1] || '').length) + '"' : '') + '>' + esc(x[0]) + '</b><em>' + esc(x[1] || '') + '</em><small>' + esc(x[2]) + '</small></div>'; }).join('') + '</div>';
  if (k === 'cards') return '<div class="vcards">' + b[1].map((x, i) => '<div style="--i:' + i + ';--c:' + VPAL[i % 8] + '"><span class="vci">' + (ICO[x[0]] || esc(x[0])) + '</span><b>' + esc(x[1]) + '</b><p>' + esc(x[2]) + '</p></div>').join('') + '</div>';
  if (k === 'schema') { const f = VZ[b[1]]; return f ? '<figure class="vz vz-' + b[1] + '">' + f(b[2]) + (b[3] ? '<figcaption>' + esc(b[3]) + '</figcaption>' : '') + '</figure>' : ''; }
  if (k === 'key') return '<div class="vkey"><strong>À retenir</strong><ul>' + b[1].map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></div>';
  if (k === 'quiz') return '<div class="vquiz" data-ok="' + b[3] + '"><span class="vqh">Testez-vous</span><p>' + esc(b[1]) + '</p><div class="vqo">' + b[2].map((x, i) => '<button type="button" data-vq="' + i + '">' + esc(x) + '</button>').join('') + '</div><p class="vqe" hidden>' + esc(b[4] || '') + '</p></div>';
  return null;
}
/* texte brut d'un bloc (export Word et PDF, voix du diaporama) */
function blocTexte(b){
  const k = b[0];
  if (k === 'p' || k === 'h' || k === 'tip') return [b[1]];
  if (k === 'ol' || k === 'ul' || k === 'key') return b[1];
  if (k === 'ex') return [b[1] + '. ' + b[2]];
  if (k === 'kpi') return b[1].map(x => x[0] + ' ' + (x[1] || '') + ' : ' + x[2]);
  if (k === 'cards') return b[1].map(x => x[1] + ' : ' + x[2]);
  if (k === 'quiz') return [b[1]];
  if (k === 'schema') { const d = b[2]; if (b[1] === 'flow' || b[1] === 'layers') return d.map(x => x[0] + (x[1] ? ' : ' + x[1] : '')); if (b[1] === 'pyramid' || b[1] === 'cycle') return d.items.map(x => x[0] + (x[1] ? ' : ' + x[1] : '')); if (b[1] === 'bars' || b[1] === 'donut') return d.items.map(x => x[0] + ' : ' + vfNum(x[1]) + (d.unit ? ' ' + d.unit : '')); if (b[1] === 'matrix') return d.pts.map(p => p[0]); if (b[1] === 'versus') return [d.a[0] + ' : ' + d.a[1].join(' ; '), d.b[0] + ' : ' + d.b[1].join(' ; ')]; if (b[1] === 'formula') return [d[0] + ' = ' + d[1] + (d[2] ? ' ÷ ' + d[2] : '') + (d[3] ? ' (' + d[3] + ')' : '')]; if (b[1] === 'gauge') return d.map(x => x[0] + ' : ' + (x[2] || x[1] + ' %')); if (b[1] === 'scopes') return ['Scope 1 : émissions directes', 'Scope 2 : énergie achetée', 'Scope 3 : autres émissions indirectes, en amont et en aval']; }
  if (k === 'tab') return b[2].map(r => r.join(' ; '));
  return [];
}
/* version exportable (Word, PDF) des blocs visuels */
function visExport(b){
  const k = b[0], T = blocTexte(b);
  if (k === 'key') return '<h3>À retenir</h3><ul>' + T.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  if (k === 'quiz') return '<p><b>Testez-vous : ' + esc(b[1]) + '</b></p><ul>' + b[2].map((x, i) => '<li>' + esc(x) + (i === b[3] ? ' (bonne réponse)' : '') + '</li>').join('') + '</ul>' + (b[4] ? '<p><i>' + esc(b[4]) + '</i></p>' : '');
  if (k === 'schema') return (b[3] ? '<p><b>' + esc(b[3]) + '</b></p>' : '') + '<ul>' + T.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  if (k === 'kpi' || k === 'cards') return '<ul>' + T.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>';
  return null;
}
/* ---------- apparitions au défilement et compteurs ---------- */
const VREV = '.vz,.kpis,.tl,.vcards,.vkey,.vquiz,.exbox,.pclesson .tablewrap,.callout,.lhero,.pchero,.vflow';
const vio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { vIn(e.target); vio.unobserve(e.target); } }), {threshold: .12, rootMargin: '0px 0px -30px 0px'}) : null;
function vIn(el){ el.classList.add('in'); el.querySelectorAll('[data-cnt]').forEach(vCount); }
function vCount(b){ if (b._c) return; b._c = 1; const v = +b.dataset.cnt, dec = +b.dataset.dec || 0, t0 = performance.now(), D = 1300, f = t => { const p = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - p, 3); b.textContent = (v * e).toLocaleString('fr-FR', {minimumFractionDigits: dec, maximumFractionDigits: dec}); if (p < 1) requestAnimationFrame(f); }; if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; requestAnimationFrame(f); }
function vScan(root){ (root || document).querySelectorAll(VREV).forEach(el => { if (el._rv) return; el._rv = 1; el.classList.add('rv'); if (vio) vio.observe(el); else vIn(el); }); }
new MutationObserver(ms => { if (ms.some(m => m.addedNodes.length)) vScan(document.querySelector('main') || document.body); }).observe(document.querySelector('main') || document.body, {childList: true, subtree: true});
document.addEventListener('click', e => {
  const q = e.target.closest('[data-vq]'); if (!q) return; const box = q.closest('.vquiz'); if (box.classList.contains('done')) return; const ok = +box.dataset.ok, i = +q.dataset.vq;
  box.classList.add('done'); box.querySelectorAll('[data-vq]').forEach((x, j) => x.classList.add(j === ok ? 'ok' : (j === i ? 'ko' : 'off'))); const ex = box.querySelector('.vqe'); ex.hidden = false; ex.insertAdjacentHTML('afterbegin', '<b>' + (i === ok ? 'Bonne réponse. ' : 'Pas tout à fait. ') + '</b>');
});
/* ---------- diaporama plein écran ---------- */
const DIA = {s: [], i: 0, play: false, voix: false, t: null, el: null, x0: null, onEnd: null};
const voixOk = 'speechSynthesis' in window;
function diapo(slides, c, titre){
  diaFermer(); DIA.s = slides; DIA.i = 0; DIA.play = false;
  const el = document.createElement('div'); el.className = 'dia'; el.style.setProperty('--dc', c || '#2357A6'); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Diaporama : ' + titre);
  el.innerHTML = '<div class="diabg" aria-hidden="true"><i></i><i></i><i></i></div><div class="diabar">' + slides.map(() => '<span><i></i></span>').join('') + '</div><div class="diatop"><span class="diat">' + esc(titre) + '</span><span class="dian"></span>' + (voixOk ? '<button data-dia="voix" title="Lecture à voix haute" aria-label="Lecture à voix haute">' + '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9v6h4l5 4V5L8 9z"/><path class="vw" d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg></button>' : '') + '<button data-dia="play" title="Lecture automatique" aria-label="Lecture automatique"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path class="pl" d="M7 5l12 7-12 7z"/><path class="pa" d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg></button><button data-dia="fs" title="Plein écran" aria-label="Plein écran"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg></button><button data-dia="close" title="Fermer" aria-label="Fermer">✕</button></div><div class="diastage"></div><button class="dianav prev" data-dia="prev" aria-label="Précédent">‹</button><button class="dianav next" data-dia="next" aria-label="Suivant">›</button><div class="diahint">← → pour naviguer · Espace pour lecture automatique · Échap pour fermer</div>';
  document.body.appendChild(el); document.body.classList.add('diaon'); DIA.el = el;
  el.addEventListener('click', diaClic); el.addEventListener('touchstart', e => { DIA.x0 = e.touches[0].clientX; }, {passive: true}); el.addEventListener('touchend', e => { if (DIA.x0 == null) return; const dx = e.changedTouches[0].clientX - DIA.x0; DIA.x0 = null; if (Math.abs(dx) > 50) diaGo(DIA.i + (dx < 0 ? 1 : -1)); }, {passive: true});
  document.addEventListener('keydown', diaKey); diaShow(0, 1); setTimeout(() => el.classList.add('open'), 10);
  const fb = el.querySelector('[data-dia="close"]'); if (fb) fb.focus({preventScroll: true});
}
function diaKey(e){ if (!DIA.el) return; if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); diaGo(DIA.i + 1); } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); diaGo(DIA.i - 1); } else if (e.key === 'Escape') diaFermer(); else if (e.key === ' ' && !e.target.closest('button,a')) { e.preventDefault(); diaPlay(!DIA.play); } }
function diaClic(e){
  const b = e.target.closest('[data-dia]'); if (!b) { const a = e.target.closest('a[href^="#"]'); if (a) diaFermer(); return; }
  const a = b.dataset.dia;
  if (a === 'next') diaGo(DIA.i + 1); else if (a === 'prev') diaGo(DIA.i - 1); else if (a === 'close') diaFermer(); else if (a === 'play') diaPlay(!DIA.play);
  else if (a === 'voix') { DIA.voix = !DIA.voix; DIA.el.classList.toggle('voix', DIA.voix); if (DIA.voix) { if (!DIA.play) diaPlay(true); else diaShow(DIA.i, 0); } else { try { speechSynthesis.cancel(); } catch(x) {} diaTimer(); } }
  else if (a === 'fs') { try { if (document.fullscreenElement) document.exitFullscreen(); else DIA.el.requestFullscreen(); } catch(x) {} }
  else if (a === 'go') diaGo(+b.dataset.k);
  else if (a === 'act' && DIA.onAct) DIA.onAct(b.dataset.k, b);
}
function diaPlay(on){ DIA.play = on; DIA.el.classList.toggle('playing', on); if (!on) { clearTimeout(DIA.t); try { speechSynthesis.cancel(); } catch(x) {} } diaShow(DIA.i, 0); }
function diaGo(i){ if (!DIA.el) return; if (i < 0 || i >= DIA.s.length) { if (i >= DIA.s.length && DIA.play) diaPlay(false); return; } diaShow(i, i >= DIA.i ? 1 : -1); }
function diaDuree(s){ const w = (s.say || '').split(/\s+/).length; return Math.min(26000, Math.max(6500, w * 330)); }
function diaShow(i, dir){
  const st = DIA.el.querySelector('.diastage'), s = DIA.s[i], old = st.querySelector('.sl.on');
  clearTimeout(DIA.t); try { speechSynthesis.cancel(); } catch(x) {}
  if (dir !== 0 || !old) {
    const n = document.createElement('div'); n.className = 'sl ' + (s.cls || '') + (dir < 0 ? ' fromL' : ''); n.innerHTML = s.html; st.appendChild(n);
    if (old) { old.classList.remove('on'); old.classList.add(dir < 0 ? 'outR' : 'outL'); setTimeout(() => old.remove(), 700); }
    requestAnimationFrame(() => requestAnimationFrame(() => { n.classList.add('on'); vScan(n); n.querySelectorAll(VREV).forEach(vIn); }));
  }
  DIA.i = i; DIA.el.querySelector('.dian').textContent = (i + 1) + ' / ' + DIA.s.length;
  DIA.el.querySelectorAll('.diabar span').forEach((x, j) => { x.className = j < i ? 'done' : j === i ? 'cur' : ''; });
  DIA.el.querySelector('.prev').disabled = i === 0; DIA.el.querySelector('.next').disabled = i === DIA.s.length - 1;
  const D = diaDuree(s), bar = DIA.el.querySelector('.diabar .cur i'); if (bar) { bar.style.animationDuration = D + 'ms'; }
  if (DIA.play) { if (DIA.voix && voixOk && s.say) { const u = new SpeechSynthesisUtterance(s.say); u.lang = 'fr-FR'; u.rate = 1.02; const v = speechSynthesis.getVoices().find(x => /^fr/i.test(x.lang)); if (v) u.voice = v; u.onend = () => { if (DIA.play && DIA.i === i) DIA.t = setTimeout(() => diaGo(i + 1), 700); }; if (bar) bar.style.animationDuration = Math.max(D, s.say.length * 62) + 'ms'; speechSynthesis.speak(u); } else diaTimer(D); }
}
function diaTimer(D){ clearTimeout(DIA.t); if (DIA.play) DIA.t = setTimeout(() => diaGo(DIA.i + 1), D || diaDuree(DIA.s[DIA.i])); }
function diaFermer(){ if (!DIA.el) return; clearTimeout(DIA.t); try { speechSynthesis.cancel(); } catch(x) {} try { if (document.fullscreenElement) document.exitFullscreen(); } catch(x) {} document.removeEventListener('keydown', diaKey); const el = DIA.el; DIA.el = null; DIA.onAct = null; el.classList.remove('open'); el.classList.add('closing'); document.body.classList.remove('diaon'); setTimeout(() => el.remove(), 380); }
/* découpe une suite de blocs en diapositives */
function blocsEnDiapos(blocs, titre, rend){
  const W = b => { const k = b[0]; if (k === 'p') return b[1].length > 260 ? 2 : 1.2; if (k === 'ol') return Math.ceil(b[1].length / 2.5); if (k === 'ul') return Math.ceil(b[1].length / 3); if (k === 'tab') return Math.min(4, 1 + b[2].length / 2.5); if (k === 'cards') return Math.ceil(b[1].length / 2) + .5; return ({schema: 3.2, kpi: 2, ex: 1.6, tip: 1, key: 2.2, quiz: 3})[k] || 1; };
  const out = []; let cur = null, h = titre;
  const neu = () => { cur = {t: h, b: [], w: 0}; out.push(cur); };
  blocs.forEach(b => { if (b[0] === 'outil') return; if (b[0] === 'h') { h = b[1]; neu(); return; } const w = W(b); if (!cur || (cur.w > 1.3 && cur.w + w > 3.6)) neu(); cur.b.push(b); cur.w += w; });
  return out.filter(s => s.b.length).map((s, i, A) => ({html: '<div class="slh"><span class="sle">' + esc(titre) + '</span><h2>' + esc(s.t) + (A.filter(x => x.t === s.t).length > 1 ? ' <small>' + (A.filter(x => x.t === s.t).indexOf(s) + 1) + '/' + A.filter(x => x.t === s.t).length + '</small>' : '') + '</h2></div><div class="slb">' + s.b.map(rend).join('') + '</div>', say: s.t + '. ' + s.b.map(b => blocTexte(b).join('. ')).join('. ')}));
}
/* bouton diaporama générique pour les pages de lecture (cours, notions, domaines) */
function diapoDepuisDom(root, titre, c){
  const kids = [...root.children].filter(x => !x.matches('.ctool,.nnav,.eyebrow,script,.diabtn,button,.nhero,.chead,.dparc6') && !x.querySelector(':scope > a.linkbtn')); const S = []; let cur = null;
  const neu = t => { cur = {t, n: [], w: 0}; S.push(cur); };
  kids.forEach(k => { if (/^H[1-4]$/.test(k.tagName)) { neu(k.textContent.trim()); return; } const lab = k.querySelector(':scope > .nlab'); if (lab) { neu(lab.textContent.trim()); k = k.cloneNode(true); k.querySelector(':scope > .nlab').remove(); cur.n.push(k); cur.w += Math.max(1, k.textContent.trim().length / 380); return; } const txt = k.textContent.trim().length; if (!txt && !k.querySelector('svg,img')) return; const w = Math.max(1, txt / 380) + (k.querySelector('table,svg') ? 1.5 : 0); if (!cur || (cur.w > 0 && cur.w + w > 3.4)) neu(cur ? cur.t : titre); cur.n.push(k.cloneNode(true)); cur.w += w; });
  const sl = [{cls: 'cover', html: '<div class="slcover"><span class="sle">SERIKI BIBLE RSE</span><h1>' + esc(titre) + '</h1><p>' + S.length + ' diapositives</p></div>', say: titre}].concat(S.filter(s => s.n.length).map(s => { const d = document.createElement('div'); s.n.forEach(n => { n.querySelectorAll('details').forEach(x => x.open = true); d.appendChild(n); }); return {html: '<div class="slh"><span class="sle">' + esc(titre) + '</span><h2>' + esc(s.t) + '</h2></div><div class="slb">' + d.innerHTML + '</div>', say: s.t + '. ' + d.textContent.replace(/\s+/g, ' ').slice(0, 1400)}; }));
  diapo(sl, c, titre);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-diadom]'); if (!b) return; const r = document.getElementById(b.dataset.diadom); if (r) diapoDepuisDom(r, b.dataset.t || document.title, b.dataset.c); });


/* ---------- Leçons partagées entre les parcours ---------- */
const LECS = {};
const L_ = (id, t, d, b) => { LECS[id] = {id, t, d, b}; return id; };
/* Reporting */
L_('r1', 'Le paysage du reporting : CSRD, ESRS, VSME, GRI', '25 min', [
 ['p', 'Le reporting de durabilité rend compte des impacts, risques et opportunités liés à l\'environnement, au social et à la gouvernance. Plusieurs cadres coexistent ; il faut savoir lequel s\'applique.'],
 ['tab', ['Cadre', 'Nature', 'Pour qui'], [['CSRD et ESRS', 'Obligation européenne (normes ESRS révisées pour les exercices ouverts à partir de 2027)', 'Entreprises de plus de 1 000 salariés et 450 M€ de chiffre d\'affaires depuis l\'Omnibus'], ['VSME', 'Norme volontaire simplifiée de l\'EFRAG', 'PME qui répondent aux demandes de clients et de banques'], ['GRI', 'Référentiel volontaire mondial centré sur les impacts', 'Toute organisation, souvent en complément'], ['Taxonomie verte', 'Obligation pour les entreprises soumises à la CSRD', 'Part d\'activités durables (chiffre d\'affaires, investissements, dépenses)'], ['Questionnaires clients', 'EcoVadis, CDP, questionnaires sur mesure', 'Fournisseurs de grands comptes']]],
 ['p', 'Les ESRS comprennent deux normes générales (ESRS 1 : principes ; ESRS 2 : informations générales) et des normes thématiques : E1 à E5 (environnement), S1 à S4 (social), G1 (conduite des affaires). Seuls les enjeux jugés matériels par la double matérialité sont publiés, sauf les informations générales.'],
 ['outil', '#csrd', 'Fiche complète CSRD et ESRS']]);
L_('r2', 'Le protocole de reporting et la collecte', '30 min', [
 ['p', 'Le protocole de reporting est le mode d\'emploi du reporting : il fixe pour chaque indicateur la définition, la formule, l\'unité, les sources, le périmètre, le responsable et les contrôles. Il garantit qu\'on calcule la même chose chaque année et que l\'auditeur peut vérifier.'],
 ['ol', ['Partir de la liste des indicateurs à publier (ESRS matériels, VSME, questionnaires).', 'Rédiger une fiche par indicateur.', 'Nommer un contributeur par site et par thème.', 'Envoyer un calendrier de collecte avec des dates limites.', 'Centraliser dans un fichier ou un logiciel, avec l\'historique.', 'Relancer, contrôler, valider.']],
 ['ex', 'Calendrier de collecte d\'une ETI qui clôture au 31 décembre', 'Mi-novembre : envoi des fichiers et rappel des définitions. 15 janvier : remontée des données. Fin janvier : contrôles et questions aux contributeurs. Mi-février : consolidation et validation. Mars : revue de l\'auditeur et rédaction.'],
 ['outil', '#audit--prep', 'Modèle de protocole avec une fiche remplie'], ['outil', '#atelier--collecte', 'Suivi de la collecte par site']]);
L_('r3', 'Contrôler la qualité des données', '25 min', [
 ['ol', ['Exhaustivité : tous les sites et tous les mois sont-ils présents ?', 'Cohérence : la valeur est-elle plausible par rapport à l\'an dernier (écart de plus de 10 à 30 % à expliquer) et par rapport à d\'autres données (énergie par salarié, déchets par tonne produite) ?', 'Exactitude : quelques lignes sont-elles conformes aux pièces (factures, paie) ?', 'Unité et périmètre : kWh ou MWh, sites inclus, période.', 'Traçabilité : source, responsable, date, validation notés dans la fiche qualité.']],
 ['ex', 'Anomalie typique', 'La consommation d\'eau d\'un site passe de 12 000 à 120 m³ : en vérifiant, la donnée a été saisie en milliers de m³. Correction et ajout d\'un contrôle d\'unité dans le fichier de collecte.'],
 ['outil', '#pilotage--kpi', 'Contrôles de cohérence et fiches qualité du tableau de bord']]);
L_('r4', 'Rédiger un rapport ou un chapitre RSE', '30 min', [
 ['p', 'Un bon rapport dit ce que l\'entreprise fait, avec des chiffres, des objectifs et des preuves, sans exagérer. Il suit une structure stable d\'une année à l\'autre.'],
 ['ol', ['Le modèle d\'affaires et la chaîne de valeur.', 'La gouvernance de la durabilité.', 'La méthode de matérialité et les enjeux retenus.', 'Pour chaque enjeu : politique, actions, indicateurs, cibles et résultats.', 'La note méthodologique : périmètre, période, méthodes, changements.']],
 ['ul', ['Phrases courtes, chiffres précis, comparaison avec l\'année précédente.', 'Dire aussi ce qui ne progresse pas, et pourquoi.', 'Éviter les adjectifs vagues (« fortement engagé ») et les allégations non prouvées.']],
 ['outil', 'tpl:chapitre', 'Modèle de chapitre RSE']]);
L_('r5', 'Répondre aux questionnaires EcoVadis et CDP', '25 min', [
 ['p', 'Les grands clients demandent à leurs fournisseurs une évaluation EcoVadis (environnement, social et droits humains, éthique, achats responsables) ou une réponse au CDP (climat, eau, forêts). La note dépend surtout des preuves fournies.'],
 ['ol', ['Rassembler les politiques signées, les procédures, les rapports, les certificats.', 'Répondre question par question en joignant la preuve exacte demandée.', 'Préférer un document court et daté à un long rapport générique.', 'Lire le rapport de résultats et construire un plan de progrès sur les points faibles.']],
 ['outil', '#terrain--ecovadis', 'Guide complet : répondre à EcoVadis']]);
L_('r6', 'Calculer les indicateurs de la taxonomie', '30 min', [
 ['p', 'Trois ratios : la part du chiffre d\'affaires, des investissements (CapEx) et des dépenses d\'exploitation (OpEx) qui correspondent à des activités éligibles (listées dans les actes délégués), puis alignées (critères techniques respectés, absence de préjudice important, garanties sociales minimales).'],
 ['ol', ['Lister les activités de l\'entreprise et les rapprocher de la liste de la taxonomie (codes d\'activité).', 'Pour chaque activité éligible, vérifier les critères techniques de contribution substantielle.', 'Vérifier l\'absence de préjudice important aux cinq autres objectifs.', 'Vérifier les garanties sociales minimales au niveau de l\'entreprise.', 'Calculer les ratios à partir de la comptabilité, sans double comptage.']],
 ['ex', 'Calcul', 'Chiffre d\'affaires total 200 M€ ; activité « fabrication d\'équipements d\'efficacité énergétique » éligible 40 M€, dont 30 M€ alignés. Ratio d\'éligibilité 20 %, ratio d\'alignement 15 %.'],
 ['outil', '#outilsm--taxo', 'Calculateur des ratios de la taxonomie'], ['outil', '#taxonomie', 'Fiche Taxonomie verte']]);
L_('r7', 'Le balisage numérique et les logiciels de reporting', '15 min', [
 ['p', 'Le rapport de durabilité doit être publié dans un format électronique et, à terme, balisé numériquement (XBRL) selon la taxonomie numérique de l\'EFRAG, une fois celle-ci adoptée par la Commission : chaque donnée reçoit une étiquette lisible par machine. Les logiciels de reporting ESG gèrent la collecte, les contrôles, les validations et l\'export.'],
 ['tip', 'Choisir un logiciel : couverture des ESRS et de la VSME, gestion des droits par contributeur, piste d\'audit, export des données dans un format ouvert, coût et accompagnement.']]);
L_('r8', 'Travailler avec les auditeurs', '20 min', [
 ['p', 'L\'auditeur (commissaire aux comptes ou organisme tiers indépendant) vérifie la double matérialité, le processus de reporting et les chiffres par sondage. Une bonne préparation réduit les constats et le stress.'],
 ['outil', '#audit--prep', 'Audit et vérification : les six étapes et leurs modèles']]);
/* Stratégie et gouvernance */
L_('s1', 'Faire le diagnostic de maturité RSE', '25 min', [
 ['ol', ['Recenser les obligations applicables.', 'Recenser l\'existant : politiques, données, certifications, questionnaires clients.', 'Conduire des entretiens avec la direction et les services.', 'Noter la maturité sur les sept questions centrales de l\'ISO 26000 ou sur les piliers de l\'autodiagnostic.', 'Identifier les écarts critiques et les actions rapides.']],
 ['outil', '#diagnostic', 'Autodiagnostic RSE'], ['outil', '#methodes', 'Méthode détaillée : diagnostic RSE initial']]);
L_('s2', 'Conduire l\'analyse de double matérialité', '35 min', [
 ['p', 'La double matérialité identifie les enjeux sur lesquels l\'entreprise a un impact important (matérialité d\'impact) et ceux qui ont un effet financier important sur elle (matérialité financière).'],
 ['ol', ['Comprendre le contexte : activités, chaîne de valeur, implantations.', 'Dresser la liste des enjeux (point de départ : les sujets des ESRS).', 'Identifier pour chaque enjeu les impacts (positifs, négatifs, réels, potentiels), les risques et les opportunités.', 'Coter les impacts : gravité (ampleur, étendue, caractère irrémédiable) et probabilité.', 'Coter les risques et opportunités : ampleur financière et probabilité.', 'Fixer les seuils et retenir les enjeux matériels.', 'Consulter les parties prenantes et faire valider par la gouvernance.', 'Documenter toute la démarche pour l\'auditeur.']],
 ['ex', 'Exemple de cotation', 'Transporteur routier, enjeu « émissions de la flotte » : gravité 5, probabilité 5 (impact réel) ; risque financier : hausse du coût du carbone et exigences des clients, ampleur 4, probabilité 4. Matériel sous les deux angles.'],
 ['outil', '#atelier--dma', 'Outil de double matérialité et matrice']]);
L_('s3', 'Construire la stratégie et la feuille de route', '30 min', [
 ['ol', ['Partir des enjeux matériels, des obligations et de la raison d\'être.', 'Formuler 4 à 6 engagements, chacun avec un objectif chiffré et daté.', 'Décliner en programmes et actions avec responsables et budgets.', 'Organiser dans le temps : à 1 an, 3 ans, 5 ans.', 'Définir les indicateurs de suivi et la gouvernance.']],
 ['ex', 'Engagement bien formulé', '« Réduire de 30 % nos émissions des scopes 1 et 2 d\'ici 2030 par rapport à 2025, et obtenir que 70 % de nos fournisseurs stratégiques aient une cible climat d\'ici 2028. »'],
 ['outil', 'tpl:strategie', 'Modèle de stratégie RSE'], ['outil', '#pilotage--route', 'Feuille de route en dix étapes'], ['outil', '#methodes', 'Méthode : stratégie et feuille de route']]);
L_('s4', 'Animer la gouvernance et écrire au comité de direction', '25 min', [
 ['p', 'La RSE doit être portée au plus haut niveau : un sponsor au comité de direction, un comité RSE, un point régulier au conseil d\'administration pour les grandes entreprises. Le responsable RSE prépare les décisions.'],
 ['ul', ['Une note au comité de direction tient en une page : le sujet, les faits, les options, la recommandation, la décision attendue.', 'Le tableau de bord présenté chaque trimestre : 8 à 12 indicateurs, avec tendance et écart à l\'objectif.', 'Une revue annuelle de la stratégie.']],
 ['outil', 'tpl:codir', 'Modèle de note au comité de direction'], ['outil', 'tpl:decision', 'Modèle de note de décision']]);
L_('s5', 'Dialoguer avec les parties prenantes', '20 min', [
 ['p', 'Le responsable RSE représente l\'entreprise auprès des clients, investisseurs, associations, collectivités, médias, et organise le dialogue : cartographie, consultations, réponses aux sollicitations.'],
 ['outil', '#methodes', 'Méthode : cartographier les parties prenantes']]);
L_('s6', 'Animer un atelier', '25 min', [
 ['ol', ['Fixer un objectif clair et un livrable de sortie.', 'Choisir les participants (6 à 15) et préparer le matériel.', 'Ouvrir : objectif, règles, tour de table.', 'Faire produire : idées individuelles puis mise en commun (post-it, tableau blanc).', 'Faire converger : regroupement, priorisation par vote (chaque participant répartit 3 à 5 points).', 'Conclure : décisions, prochaines étapes, remerciements.', 'Envoyer le compte rendu sous 48 heures.']],
 ['ex', 'Atelier de matérialité de 2 heures', '20 min de contexte, 40 min de cotation en sous-groupes par enjeu, 30 min de mise en commun, 20 min de vote sur les priorités, 10 min de conclusion. Livrable : liste priorisée validée.']]);
L_('s7', 'Rédiger les livrables de conseil', '25 min', [
 ['p', 'Un livrable de conseil commence par la conclusion, puis la justifie : c\'est la logique « de la synthèse au détail ». Chaque page porte un titre-message qui dit ce qu\'il faut retenir.'],
 ['ol', ['Page de synthèse : les 3 à 5 messages clés et les recommandations.', 'Contexte et méthode, brièvement.', 'Constats, chiffrés et sourcés.', 'Recommandations priorisées, avec effort et effet.', 'Feuille de route et prochaines étapes.', 'Annexes : détails, données.']],
 ['ex', 'Titre-message', 'À éviter : « Résultats du bilan carbone ». Mieux : « Les achats d\'acier représentent 60 % des émissions : c\'est le premier levier ».'],
 ['outil', 'tpl:diagnostic', 'Modèle de rapport de diagnostic'], ['outil', 'tpl:restitution', 'Trame de présentation de restitution']]);
L_('s8', 'Construire une proposition commerciale', '25 min', [
 ['ol', ['Reformuler le besoin du client avec ses mots.', 'Proposer une démarche en phases, avec les livrables de chacune.', 'Estimer la charge en jours par phase et par profil.', 'Chiffrer : jours × taux journalier, plus frais éventuels.', 'Présenter l\'équipe et les références.', 'Indiquer le planning, les conditions et ce qui est attendu du client.']],
 ['ex', 'Chiffrage d\'un premier bilan carbone pour une PME', 'Cadrage 1 jour, collecte et accompagnement 3 jours, calcul 2 jours, plan d\'action 2 jours, restitution 1 jour : 9 jours. À comparer avec les forfaits des dispositifs aidés (Diag Décarbon\'Action).'],
 ['outil', '#outilsm--chiffrage', 'Outil de chiffrage d\'une mission'], ['outil', 'tpl:proposition', 'Modèle de proposition commerciale']]);
/* Sensibilisation et accompagnement */
L_('k1', 'Sensibiliser et accompagner les services', '25 min', [
 ['p', 'Le chargé de mission RSE n\'a pas d\'autorité sur les services : il les convainc et les outille. Il part de leurs contraintes et leur montre ce qu\'ils y gagnent.'],
 ['ul', ['Achats : charte, critères, questionnaires fournisseurs.', 'RH : indicateurs sociaux, égalité, formation.', 'Production et services généraux : énergie, déchets, eau.', 'Commercial : réponses aux questionnaires clients, arguments.', 'Finance : budget, taxonomie, données.']],
 ['outil', '#terrain--sensibiliser', 'Guide : sensibiliser les salariés (thèmes, formats, déroulés)'], ['outil', 'tpl:sensib', 'Trame d\'un support de sensibilisation']]);
L_('k2', 'Tenir le tableau de bord et le plan d\'action annuel', '25 min', [
 ['p', 'Le tableau de bord suit 10 à 15 indicateurs, avec leur évolution et leur objectif. Le plan d\'action annuel liste les actions de l\'année, avec un responsable, une échéance, un budget et l\'indicateur visé.'],
 ['outil', '#pilotage--kpi', 'Tableau de bord, Excel et Power BI'], ['outil', '#pilotage--plan', 'Plan d\'action'], ['outil', 'tpl:planannuel', 'Modèle de plan d\'action annuel']]);
/* Finance durable */
L_('e1', 'Les données ESG et leurs sources', '20 min', [
 ['ul', ['Publications des entreprises : rapport de durabilité, document d\'enregistrement universel, site.', 'Bases et fournisseurs de données ESG (notations, controverses, émissions).', 'Questionnaires envoyés aux entreprises et dialogue direct.', 'Sources publiques : registres, données d\'émissions, décisions de justice, ONG, presse.']],
 ['tip', 'Toujours noter la source, la date et le périmètre : les fournisseurs de données notent différemment la même entreprise, car leurs méthodes et leurs pondérations diffèrent.']]);
L_('e2', 'Noter une entreprise selon une méthode', '35 min', [
 ['ol', ['Choisir les critères par pilier (E, S, G) selon le secteur : les enjeux d\'une banque ne sont pas ceux d\'un cimentier.', 'Pondérer les critères selon leur matérialité sectorielle.', 'Noter chaque critère sur une échelle (0 à 10) à partir des politiques, des actions et des résultats.', 'Calculer les notes par pilier et la note globale pondérée.', 'Appliquer les ajustements liés aux controverses.', 'Rédiger la justification.']],
 ['ex', 'Calcul', 'Industriel : E pondéré 50 %, S 30 %, G 20 %. Notes : E 6, S 7, G 8. Note globale = 0,5 × 6 + 0,3 × 7 + 0,2 × 8 = 6,7 sur 10. Une controverse grave sur la sécurité retire 1 point : 5,7.'],
 ['outil', '#outilsm--esg', 'Outil de notation ESG']]);
L_('e3', 'Suivre les controverses', '20 min', [
 ['p', 'Une controverse est un événement qui met en cause l\'entreprise : accident, pollution, condamnation, atteinte aux droits humains, corruption. On l\'évalue selon sa gravité, son caractère répété, la réponse de l\'entreprise et son état (en cours, résolue).'],
 ['ex', 'Fiche de controverse', 'Date, faits, sources, gravité (1 à 5), réaction de l\'entreprise, mesures correctives, effet sur la note, date de revue.']]);
L_('e4', 'SFDR, taxonomie et produits financiers', '25 min', [
 ['ul', ['SFDR : les acteurs financiers publient comment ils intègrent les risques de durabilité ; les produits sont classés selon qu\'ils promeuvent des caractéristiques environnementales ou sociales (« article 8 ») ou ont un objectif d\'investissement durable (« article 9 »). Le règlement est en cours de révision.', 'Principales incidences négatives : indicateurs obligatoires (émissions, biodiversité, eau, déchets, social) suivis au niveau du portefeuille.', 'Taxonomie : part des investissements dans des activités alignées.', 'Labels : ISR, Greenfin.']],
 ['outil', '#comprendre--esg', 'Notion approfondie : l\'ESG'], ['outil', '#comprendre--taxo', 'Notion approfondie : la taxonomie']]);
L_('e5', 'Rédiger une note d\'analyse ESG', '20 min', [
 ['ol', ['Résumé : note, tendance, points forts, points faibles.', 'Profil de l\'entreprise et enjeux matériels de son secteur.', 'Analyse par pilier, avec chiffres et sources.', 'Controverses.', 'Alignement taxonomie et indicateurs d\'incidences négatives.', 'Conclusion et points de dialogue avec l\'entreprise.']],
 ['outil', 'tpl:noteesg', 'Modèle de note d\'analyse ESG']]);
/* Achats */
L_('a1', 'Cartographier les risques fournisseurs', '30 min', [
 ['ol', ['Extraire les achats par catégorie et par fournisseur (montant, pays).', 'Évaluer le risque de chaque catégorie : matière, procédé, pays (droits humains, corruption, environnement).', 'Croiser risque et montant (ou criticité) : matrice de priorité.', 'Identifier les fournisseurs à évaluer en priorité.']],
 ['outil', '#atelier--vigilance', 'Cartographie des risques fournisseurs'], ['outil', '#terrain--achats-responsables', 'Guide complet des achats responsables']]);
L_('a2', 'Rédiger la politique, la charte et les clauses', '25 min', [
 ['ul', ['La politique achats responsables fixe l\'ambition, les engagements, les objectifs et l\'organisation (ISO 20400).', 'La charte fournisseurs liste les exigences : droits humains, santé-sécurité, environnement, éthique, sous-traitance.', 'Les clauses contractuelles rendent la charte opposable : engagement, droit d\'audit, plan correctif, résiliation en cas de manquement grave.']],
 ['outil', 'tpl:politiqueachats', 'Modèle de politique achats responsables'], ['outil', '#modeles', 'Modèles de rédaction (charte fournisseurs)']]);
L_('a3', 'Évaluer et accompagner les fournisseurs', '30 min', [
 ['ol', ['Choisir l\'outil : questionnaire maison, plateforme d\'évaluation, audit sur site.', 'Construire une grille pondérée (environnement, social, éthique, achats) avec des preuves attendues.', 'Noter et classer : conforme, à améliorer, à risque.', 'Fixer un plan de progrès avec les fournisseurs à améliorer, et un suivi.', 'Décider pour les fournisseurs à risque : audit, plan correctif, voire arrêt.']],
 ['outil', '#outilsm--fournisseurs', 'Grille d\'évaluation des fournisseurs']]);
L_('a4', 'Vigilance et traçabilité', '25 min', [
 ['ul', ['Devoir de vigilance (grandes entreprises) : cartographie, évaluation, actions, alerte, suivi.', 'Directive européenne CSDDD, applicable à partir de 2029 aux plus grandes entreprises.', 'Règlement européen contre la déforestation importée : traçabilité de certains produits (bois, soja, cacao, café, huile de palme, caoutchouc, bovins).', 'Règlement européen interdisant les produits issus du travail forcé, applicable fin 2027.']],
 ['outil', '#atelier--vigilance', 'Plan de vigilance'], ['outil', '#terrain--plan-vigilance', 'Guide du plan de vigilance']]);
/* Biodiversité */
L_('v1', 'Comprendre la biodiversité et les pressions', '20 min', [
 ['p', 'La biodiversité, c\'est la diversité des espèces, des gènes et des écosystèmes. Selon l\'IPBES, cinq pressions principales la menacent : le changement d\'usage des terres et des mers, l\'exploitation directe des ressources, le changement climatique, les pollutions et les espèces exotiques envahissantes.'],
 ['p', 'Une entreprise a des impacts (artificialisation d\'un site, pollution, achats de matières agricoles) et des dépendances (eau, pollinisation, sols, régulation du climat).']]);
L_('v2', 'Diagnostiquer un site', '35 min', [
 ['ol', ['Situer le site : zonages de protection et d\'inventaire à proximité (Natura 2000, ZNIEFF, réserves), trame verte et bleue.', 'Recueillir les données naturalistes existantes (INPN, bases régionales, associations).', 'Faire un inventaire de terrain avec un écologue aux bonnes saisons.', 'Cartographier les habitats et les espèces protégées (SIG).', 'Identifier les pressions de l\'activité (éclairage nocturne, pesticides, imperméabilisation, rejets).', 'Évaluer les enjeux et proposer des mesures.']],
 ['ex', 'Site logistique de 12 hectares', 'Une haie ancienne et une mare abritent des espèces protégées ; 70 % du site est imperméabilisé ; éclairage toute la nuit. Mesures : gestion différenciée des espaces verts, extinction partielle la nuit, désimperméabilisation de 1 hectare, mare préservée.'],
 ['outil', '#outilsm--biodiv', 'Grille de diagnostic biodiversité']]);
L_('v3', 'Évaluer les dépendances aux services écosystémiques', '20 min', [
 ['p', 'Les services écosystémiques sont les bénéfices tirés de la nature : approvisionnement (eau, bois), régulation (climat, crues, pollinisation), culturels. Des outils publics comme ENCORE aident à repérer les dépendances et impacts typiques d\'un secteur.'],
 ['ex', 'Exemple', 'Une entreprise agroalimentaire dépend de l\'eau, de la pollinisation et de la qualité des sols chez ses fournisseurs agricoles : risque de baisse des rendements et de hausse des prix.']]);
L_('v4', 'La séquence éviter, réduire, compenser', '20 min', [
 ['ol', ['Éviter : renoncer à un impact (changer d\'emplacement, de calendrier, de procédé).', 'Réduire : limiter l\'impact qui ne peut être évité.', 'Compenser : en dernier recours, restaurer ailleurs une biodiversité équivalente, avec un objectif d\'absence de perte nette.']],
 ['tip', 'La compensation n\'autorise pas à détruire : elle ne vient qu\'après l\'évitement et la réduction, et doit être durable et suivie.']]);
L_('v5', 'Le reporting nature : ESRS E4 et TNFD', '20 min', [
 ['p', 'L\'ESRS E4 demande, si l\'enjeu est matériel, les impacts, dépendances, risques et opportunités liés à la biodiversité, les sites situés dans ou près de zones sensibles, les politiques, actions et cibles. La TNFD propose un cadre volontaire et une démarche en quatre étapes : localiser, évaluer, apprécier, préparer (LEAP).']]);
L_('v6', 'Construire le plan d\'action biodiversité', '20 min', [
 ['ol', ['Objectifs par site et pour la chaîne d\'approvisionnement.', 'Actions : gestion écologique, restauration, achats responsables, réduction des pressions.', 'Indicateurs : surfaces gérées écologiquement, surface désimperméabilisée, part de matières certifiées.', 'Partenaires : associations naturalistes, collectivités, écologues.']],
 ['outil', 'tpl:planbiodiv', 'Modèle de plan d\'action biodiversité']]);
/* QVCT */
L_('q1', 'Le cadre : santé, sécurité, QVCT et dialogue social', '25 min', [
 ['ul', ['L\'employeur a une obligation de prévention des risques professionnels, y compris psychosociaux, formalisée dans le document unique (DUERP).', 'La QVCT (qualité de vie et des conditions de travail) porte sur l\'organisation, le contenu du travail, les relations, la santé, l\'équilibre des temps.', 'Dans les entreprises avec délégués syndicaux, l\'égalité professionnelle et la qualité de vie au travail font l\'objet d\'une négociation périodique.', 'Le comité social et économique (CSE), dès 11 salariés, est consulté sur les conditions de travail.']]]);
L_('q2', 'Calculer les indicateurs sociaux', '30 min', [
 ['tab', ['Indicateur', 'Formule', 'Exemple'], [['Taux d\'absentéisme', 'Jours d\'absence ÷ jours théoriques travaillés × 100', '1 800 jours ÷ 45 000 jours = 4 %'], ['Taux de fréquence', 'Accidents avec arrêt × 1 000 000 ÷ heures travaillées', '6 × 1 000 000 ÷ 300 000 = 20'], ['Taux de gravité', 'Jours d\'arrêt × 1 000 ÷ heures travaillées', '150 × 1 000 ÷ 300 000 = 0,5'], ['Taux de rotation', '(Entrées + sorties) ÷ 2 ÷ effectif moyen × 100', '(30 + 24) ÷ 2 ÷ 180 = 15 %'], ['Heures de formation par salarié', 'Heures totales ÷ effectif moyen', '3 600 ÷ 180 = 20 heures']]],
 ['outil', '#outilsm--qvct', 'Calculateur des indicateurs sociaux']]);
L_('q3', 'Conduire une enquête auprès des salariés', '25 min', [
 ['ol', ['Définir les thèmes : charge, autonomie, reconnaissance, relations, sens, conditions matérielles, équilibre.', 'Rédiger 20 à 30 questions fermées (échelle de 1 à 5) et 2 ou 3 questions ouvertes.', 'Garantir l\'anonymat (pas de résultats pour des groupes de moins de 5 à 10 personnes).', 'Associer le CSE et communiquer avant, pendant, après.', 'Analyser : moyenne par thème, écarts entre services, verbatims.', 'Restituer à tous et co-construire le plan d\'action.']],
 ['outil', '#outilsm--qvct', 'Grille d\'analyse des résultats d\'enquête']]);
L_('q4', 'Construire le plan d\'amélioration', '20 min', [
 ['p', 'Le plan retient 3 à 5 priorités issues des indicateurs et de l\'enquête, avec des actions concrètes, des responsables et des indicateurs de suivi. Les actions les plus efficaces portent sur l\'organisation du travail, pas seulement sur des services ponctuels.'],
 ['outil', 'tpl:planqvct', 'Modèle de diagnostic et plan QVCT'], ['outil', '#labo', 'Cas : améliorer la qualité de vie au travail']]);
/* Environnement */
L_('n1', 'Assurer la veille et le registre réglementaire', '30 min', [
 ['p', 'Le registre réglementaire liste les exigences applicables au site, leur source, la preuve de conformité et le statut. C\'est une exigence de l\'ISO 14001 (« obligations de conformité »).'],
 ['ol', ['Identifier les textes applicables : arrêté préfectoral du site (ICPE), rubriques, Code de l\'environnement, textes sur l\'eau, l\'air, les déchets, le bruit, les produits chimiques.', 'Extraire les exigences précises (valeur limite, fréquence de contrôle, déclaration).', 'Évaluer la conformité avec preuve.', 'Planifier les actions en cas d\'écart.', 'Mettre à jour à chaque nouveau texte (sources : Légifrance, AIDA de l\'INERIS, lettres de veille).']],
 ['outil', '#outilsm--registre', 'Outil : registre réglementaire']]);
L_('n2', 'Piloter le système de management ISO 14001', '30 min', [
 ['tab', ['Chapitre', 'Contenu'], [['4 Contexte', 'Enjeux, parties intéressées, périmètre'], ['5 Leadership', 'Politique environnementale, rôles'], ['6 Planification', 'Aspects significatifs, obligations de conformité, risques, objectifs'], ['7 Support', 'Compétences, sensibilisation, communication, documents'], ['8 Réalisation', 'Maîtrise opérationnelle, situations d\'urgence'], ['9 Évaluation', 'Surveillance, audit interne, revue de direction'], ['10 Amélioration', 'Non-conformités, actions correctives, amélioration continue']]],
 ['outil', '#terrain--audit-iso14001', 'Guide : réussir un audit ISO 14001']]);
L_('n3', 'Réaliser l\'analyse environnementale', '30 min', [
 ['p', 'Pour chaque activité, on identifie les aspects (ce qui interagit avec l\'environnement : consommation, rejet, déchet, bruit) et les impacts associés, puis on les cote pour retenir les aspects significatifs.'],
 ['ex', 'Cotation', 'Aspect « rejet d\'eaux de lavage » : gravité 3 × fréquence 4 × maîtrise 2 = 24 ; seuil de significativité 20 : aspect significatif, à traiter en priorité.'],
 ['outil', '#outilsm--registre', 'Outil : analyse environnementale (aspects et impacts)']]);
L_('n4', 'Suivre consommations, rejets et déchets', '20 min', [
 ['ul', ['Relevés mensuels d\'énergie et d\'eau par compteur.', 'Autosurveillance des rejets prévue par l\'arrêté préfectoral, avec déclarations.', 'Registre chronologique des déchets ; suivi des déchets dangereux par bordereau électronique (Trackdéchets).', 'Indicateurs rapportés à la production.']],
 ['outil', '#pilotage--kpi', 'Tableau de bord'], ['outil', '#ateliers--flux', 'Diagnostic des flux']]);
L_('n5', 'Préparer les audits et les inspections', '20 min', [
 ['p', 'Inspection des installations classées par l\'inspection de l\'environnement, audit de certification ISO 14001, audits clients : les mêmes réflexes s\'appliquent. Dossier à jour, registre réglementaire, preuves classées, personnel préparé, actions correctives suivies.'],
 ['outil', '#boite--incidents', 'Registre des incidents et actions correctives'], ['outil', 'tpl:planenv', 'Modèle de plan d\'action environnemental']]);
/* Conseil carbone */
L_('cc1', 'Mener la collecte chez le client', '25 min', [
 ['ol', ['Réunion de lancement : périmètre, interlocuteurs, calendrier, liste des données.', 'Envoyer un fichier de collecte clair, par service, avec des exemples.', 'Organiser une visite de site.', 'Relancer et documenter chaque donnée et chaque hypothèse.', 'Former l\'équipe du client pour qu\'elle puisse refaire le bilan.']],
 ['outil', 'tpl:methode', 'Modèle de note de méthode']]);
L_('cc2', 'Restituer les résultats', '25 min', [
 ['ol', ['Message principal en une phrase.', 'Total et répartition par scope et par poste, avec comparaisons parlantes.', 'Incertitudes et limites.', 'Les leviers chiffrés.', 'Les décisions attendues et la suite.']],
 ['outil', 'tpl:rapportges', 'Trame du rapport de bilan GES'], ['outil', 'tpl:restitution', 'Trame de présentation de restitution']]);


/* ---------- Parcours des 12 autres métiers ---------- */
const PCx = (id, metier, titre, c, intro, comp, lecons, outils, livrables, cas, auto) => { PCOURS[id] = {id, metier, titre, c, type: 'Parcours métier', intro, comp, lecons, outils, livrables, cas, auto}; };
const C_ = {
 reg: ['Réglementation et reporting', ['Connaître les principaux textes', 'Identifier les obligations et organiser une collecte', 'Coordonner un reporting complet et préparer l\'audit']],
 ind: ['Indicateurs ESG et tableaux de bord', ['Comprendre les indicateurs E, S et G', 'Construire un tableau de bord avec des fiches indicateurs', 'Analyser la performance et recommander']],
 prj: ['Gestion de projet', ['Comprendre les étapes d\'un projet', 'Planifier, répartir les rôles et suivre', 'Piloter plusieurs projets, budgets et risques']],
 com: ['Communication et conduite du changement', ['Préparer un support clair', 'Présenter des résultats et animer un atelier', 'Convaincre une direction et embarquer les équipes']],
 dm: ['Double matérialité et analyse des enjeux', ['Expliquer les deux matérialités', 'Coter des impacts, risques et opportunités', 'Conduire l\'analyse complète et la faire valider']],
 bud: ['Gestion budgétaire et arbitrage', ['Lire un budget', 'Calculer un retour sur investissement', 'Comparer des scénarios et convaincre']],
 env: ['Analyse environnementale', ['Identifier les impacts d\'une activité', 'Réaliser un diagnostic environnemental', 'Proposer et chiffrer des améliorations']],
 fin: ['Finance durable et taxonomie', ['Distinguer activité éligible et alignée', 'Analyser l\'éligibilité d\'activités', 'Calculer et documenter les indicateurs']],
 ach: ['Achats responsables et chaîne de valeur', ['Connaître les risques fournisseurs', 'Construire une grille d\'évaluation', 'Piloter une politique d\'achats responsables']],
 soc: ['Social, droits humains et QVCT', ['Connaître les obligations sociales', 'Analyser des indicateurs sociaux', 'Construire un plan avec les partenaires sociaux']],
 car: ['Bilan carbone et climat', ['Comprendre les scopes et les facteurs', 'Calculer un bilan et identifier les postes majeurs', 'Construire une trajectoire et un plan de transition']]
};
PCx('missionrse', 'charge-mission-rse', 'Chargé de mission RSE', '#0F5B3E', 'Le chargé de mission RSE fait vivre la démarche au quotidien : il collecte les données environnementales et sociales, participe au reporting et aux questionnaires clients, suit les indicateurs, sensibilise et accompagne les services, prépare les audits et les supports pour la direction.',
 [C_.reg, C_.ind, C_.prj, C_.com], ['r1', 'r2', 'r3', 'k2', 'r5', 'r4', 'k1', 'r8', 'p2'],
 [['#pilotage--kpi', 'Tableau de bord, Excel et Power BI'], ['#atelier--collecte', 'Suivi de la collecte'], ['#pilotage--plan', 'Plan d\'action'], ['#terrain--ecovadis', 'Guide EcoVadis'], ['#audit--prep', 'Préparer l\'audit'], ['#terrain--sensibiliser', 'Sensibilisation']],
 [['Rapport ou chapitre RSE', 'tpl:chapitre'], ['Tableau de bord des indicateurs', '#pilotage--kpi'], ['Plan d\'action annuel', 'tpl:planannuel'], ['Supports de sensibilisation', 'tpl:sensib']],
 ['reporting-esg', 'csrd-donnees', 'double-materialite'],
 ['Je connais les cadres de reporting et ce qui s\'applique à mon entreprise', 'Je sais organiser une collecte avec un protocole', 'Je sais contrôler la cohérence des données', 'Je sais tenir un tableau de bord et un plan d\'action annuel', 'Je sais répondre à un questionnaire EcoVadis avec des preuves', 'Je sais rédiger un chapitre RSE factuel', 'Je sais animer une sensibilisation', 'Je sais préparer un audit']);
PCx('projetdd', 'charge-projet-dd', 'Chargé de projet développement durable', '#2357A6', 'Le chargé de projet développement durable cadre des projets (énergie, déchets, mobilité, biodiversité), planifie et coordonne les acteurs, suit le budget et les indicateurs, et rend compte à la direction.',
 [C_.prj, C_.env, C_.bud, C_.com], ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'b2', 'p7', 'p8', 'p9'],
 [['#boite--projets', 'Projets : Gantt, RACI, budget'], ['#boite--risques', 'Registre des risques'], ['#ateliers--finance', 'Rentabilité des actions'], ['#boite--scenarios', 'Scénarios']],
 [['Note de cadrage', 'tpl:cadrage'], ['Planning et matrice RACI', '#boite--projets'], ['Compte rendu de comité', 'tpl:copil'], ['Bilan de projet', 'tpl:rex']],
 ['economie-circulaire', 'iso14001', 'bilan-carbone'],
 ['Je sais cadrer un projet et fixer un objectif SMART', 'Je sais planifier avec un Gantt', 'Je sais répartir les rôles avec une RACI', 'Je sais suivre un budget et calculer une rentabilité', 'Je sais rendre compte en comité', 'Je sais clôturer et capitaliser']);
PCx('chefprojet', 'chef-projet-rse', 'Chef de projet RSE', '#7A3E5B', 'Le chef de projet RSE pilote un chantier structurant (matérialité, bilan carbone, label, achats responsables) avec plusieurs directions : budget, comité de pilotage, contributeurs, prestataires et mesure des résultats.',
 [C_.prj, C_.dm, C_.bud, C_.com], ['p2', 'p3', 'p4', 'p6', 's2', 's6', 'b5', 's3', 'p8'],
 [['#boite--projets', 'Projets'], ['#atelier--dma', 'Double matérialité'], ['#prestataires--trouver', 'Choisir un prestataire'], ['#pilotage--route', 'Feuille de route']],
 [['Feuille de route', 'tpl:strategie'], ['Comptes rendus de comité', 'tpl:copil'], ['Matrice de matérialité', '#atelier--dma'], ['Bilan du chantier', 'tpl:rex']],
 ['double-materialite', 'bilan-carbone', 'achats-responsables'],
 ['Je sais piloter un chantier et son budget', 'Je sais animer un comité de pilotage', 'Je sais conduire une double matérialité', 'Je sais animer un atelier de priorisation', 'Je sais choisir et piloter un prestataire', 'Je sais construire une feuille de route']);
PCx('resprse', 'responsable-rse', 'Responsable RSE', '#14507A', 'Le responsable RSE définit la stratégie et la feuille de route, arbitre les priorités et le budget, anime la gouvernance, supervise le reporting et la conformité, et représente l\'entreprise auprès des parties prenantes.',
 [C_.reg, C_.dm, C_.bud, C_.com, C_.ind], ['s1', 's2', 's3', 's4', 'b3', 'b5', 'r1', 'r8', 's5'],
 [['#diagnostic', 'Autodiagnostic'], ['#atelier', 'Atelier CSRD et vigilance'], ['#pilotage', 'Espace entreprise'], ['#audit', 'Audit'], ['#ateliers--finance', 'Rentabilité et coûts d\'abattement']],
 [['Stratégie RSE', 'tpl:strategie'], ['Rapport de durabilité', 'tpl:chapitre'], ['Notes au comité de direction', 'tpl:codir']],
 ['double-materialite', 'csrd-donnees', 'reporting-esg'],
 ['Je sais établir le diagnostic de maturité', 'Je sais conduire une double matérialité', 'Je sais construire une stratégie et une feuille de route chiffrées', 'Je sais animer la gouvernance RSE', 'Je sais arbitrer un budget avec des coûts par tonne', 'Je sais superviser un reporting et un audit', 'Je sais représenter l\'entreprise auprès des parties prenantes']);
PCx('consultstrat', 'consultant-strategie-durable', 'Consultant en stratégie durable', '#8A5214', 'Le consultant réalise des diagnostics et des analyses de matérialité, construit des stratégies et des feuilles de route, anime des ateliers, rédige les livrables et contribue aux propositions commerciales.',
 [C_.dm, C_.reg, C_.prj, C_.com], ['s1', 's2', 's6', 's3', 's7', 's8', 'r1', 'p2'],
 [['#diagnostic', 'Autodiagnostic'], ['#atelier--dma', 'Matrice de matérialité'], ['#outilsm--chiffrage', 'Chiffrage d\'une mission'], ['#prestataires--services', 'Les missions de conseil'], ['#prestataires--cabinet', 'Fiche cabinet']],
 [['Rapport de diagnostic', 'tpl:diagnostic'], ['Présentation de restitution', 'tpl:restitution'], ['Proposition commerciale', 'tpl:proposition']],
 ['double-materialite', 'bilan-carbone', 'taxonomie'],
 ['Je sais mener un diagnostic chez un client', 'Je sais conduire une double matérialité', 'Je sais animer un atelier', 'Je sais construire une stratégie', 'Je sais rédiger un livrable avec des titres-messages', 'Je sais chiffrer et rédiger une proposition commerciale']);
PCx('analysteesg', 'analyste-esg', 'Analyste ESG', '#2F6F73', 'L\'analyste ESG collecte et analyse les données extra-financières, note les entreprises selon une méthode, suit les controverses et contribue aux rapports réglementaires (SFDR, taxonomie).',
 [C_.fin, C_.ind, C_.reg], ['e1', 'e2', 'e3', 'e4', 'r6', 'e5', 'r1'],
 [['#outilsm--esg', 'Outil de notation ESG'], ['#outilsm--taxo', 'Ratios de la taxonomie'], ['#entreprises', 'Annuaire des entreprises']],
 [['Note d\'analyse', 'tpl:noteesg'], ['Base de données ESG', '#outilsm--esg'], ['Rapport d\'investissement responsable', 'tpl:noteesg']],
 ['taxonomie', 'reporting-esg'],
 ['Je connais les sources de données ESG et leurs limites', 'Je sais noter une entreprise avec une pondération sectorielle', 'Je sais évaluer une controverse', 'Je connais SFDR et les principales incidences négatives', 'Je sais calculer les ratios de la taxonomie', 'Je sais rédiger une note d\'analyse']);
PCx('reporting', 'charge-reporting', 'Chargé de reporting extra-financier', '#2357A6', 'Le chargé de reporting tient le protocole, collecte et contrôle les données, rédige les chapitres du rapport, travaille avec les auditeurs et calcule les indicateurs de la taxonomie.',
 [C_.reg, C_.ind, C_.fin], ['r1', 'r2', 'r3', 'r4', 'r6', 'r7', 'r8'],
 [['#audit--prep', 'Protocole et dossiers de preuve'], ['#atelier--collecte', 'Suivi de la collecte'], ['#pilotage--kpi', 'Fiches qualité et contrôles'], ['#outilsm--taxo', 'Ratios de la taxonomie']],
 [['Protocole de reporting', '#audit--prep'], ['Rapport de durabilité', 'tpl:chapitre'], ['Dossiers de preuves', '#audit--prep']],
 ['csrd-donnees', 'reporting-esg', 'taxonomie'],
 ['Je sais rédiger et tenir un protocole de reporting', 'Je sais organiser et relancer une collecte', 'Je sais contrôler la qualité des données', 'Je sais rédiger un chapitre du rapport', 'Je sais calculer les ratios de la taxonomie', 'Je sais constituer des dossiers de preuve et répondre à l\'auditeur']);
PCx('achats', 'acheteur-responsable', 'Responsable achats responsables', '#5B6B2F', 'Le responsable achats responsables cartographie les risques fournisseurs, rédige la charte et les clauses RSE, évalue et accompagne les fournisseurs, et suit les obligations de vigilance et de traçabilité.',
 [C_.ach, C_.reg, C_.com], ['a1', 'a2', 'a3', 'a4', 'd8'],
 [['#atelier--vigilance', 'Cartographie des risques'], ['#outilsm--fournisseurs', 'Grille d\'évaluation'], ['#ateliers--scope3', 'Scope 3 fournisseurs'], ['#public--achats', 'Achats publics responsables']],
 [['Politique achats responsables', 'tpl:politiqueachats'], ['Grille d\'évaluation fournisseurs', '#outilsm--fournisseurs'], ['Plan de vigilance (volet achats)', '#atelier--vigilance']],
 ['achats-responsables'],
 ['Je sais cartographier les risques par catégorie et pays', 'Je sais rédiger une politique, une charte et des clauses', 'Je sais construire une grille d\'évaluation pondérée', 'Je sais accompagner un fournisseur dans un plan de progrès', 'Je connais les obligations de vigilance et de traçabilité', 'Je sais engager les fournisseurs sur le climat']);
PCx('biodiv', 'charge-biodiversite', 'Chargé de mission biodiversité', '#0F5B3E', 'Le chargé de mission biodiversité diagnostique les sites et leurs enjeux écologiques, évalue les dépendances aux services écosystémiques, propose des mesures d\'évitement et de réduction, et contribue au reporting nature.',
 [C_.env, C_.reg, C_.com], ['v1', 'v2', 'v3', 'v4', 'v5', 'v6'],
 [['#outilsm--biodiv', 'Grille de diagnostic biodiversité'], ['#boite--projets', 'Gestion de projet'], ['#engager--reseaux', 'Associations naturalistes']],
 [['Diagnostic biodiversité', '#outilsm--biodiv'], ['Plan d\'action biodiversité', 'tpl:planbiodiv']],
 ['biodiversite'],
 ['Je connais les cinq pressions sur la biodiversité', 'Je sais diagnostiquer un site', 'Je sais identifier les dépendances aux services écosystémiques', 'Je sais appliquer la séquence éviter, réduire, compenser', 'Je connais l\'ESRS E4 et la démarche TNFD', 'Je sais construire un plan d\'action biodiversité']);
PCx('qvct', 'charge-qvct', 'Chargé de mission QVCT', '#C2532A', 'Le chargé de mission QVCT analyse les indicateurs sociaux, conduit des enquêtes auprès des salariés, construit et suit un plan d\'action, et anime le dialogue avec les représentants du personnel.',
 [C_.soc, C_.ind, C_.com], ['q1', 'q2', 'q3', 'q4', 's6'],
 [['#outilsm--qvct', 'Indicateurs sociaux et enquête'], ['#pilotage--kpi', 'Tableau de bord'], ['#terrain--index-egalite', 'Index de l\'égalité']],
 [['Diagnostic QVCT', 'tpl:planqvct'], ['Plan d\'amélioration', 'tpl:planqvct'], ['Indicateurs sociaux', '#outilsm--qvct']],
 ['qvct'],
 ['Je connais le cadre légal (prévention, DUERP, CSE, négociation)', 'Je sais calculer absentéisme, fréquence, gravité, rotation', 'Je sais construire et analyser une enquête anonyme', 'Je sais construire un plan d\'amélioration avec les représentants du personnel', 'Je sais animer un atelier de co-construction']);
PCx('environnement', 'responsable-environnement', 'Responsable environnement', '#1F6F73', 'Le responsable environnement assure la veille et la conformité réglementaire, pilote le système ISO 14001, suit les consommations, rejets et déchets, et prépare les audits et inspections.',
 [C_.env, C_.reg, C_.prj], ['n1', 'n2', 'n3', 'n4', 'n5', 'c2'],
 [['#outilsm--registre', 'Registre réglementaire et analyse environnementale'], ['#ateliers--flux', 'Diagnostic des flux'], ['#boite--incidents', 'Incidents et actions correctives'], ['#pilotage--kpi', 'Tableau de bord']],
 [['Analyse environnementale', '#outilsm--registre'], ['Registre réglementaire', '#outilsm--registre'], ['Plan d\'action environnemental', 'tpl:planenv']],
 ['iso14001', 'economie-circulaire', 'biodiversite'],
 ['Je sais tenir un registre réglementaire', 'Je connais la structure de l\'ISO 14001', 'Je sais réaliser et coter une analyse environnementale', 'Je sais suivre consommations, rejets et déchets', 'Je sais préparer un audit ou une inspection', 'Je connais les obligations de tri et de traçabilité des déchets']);
PCx('consultcarbone', 'consultant-carbone', 'Consultant en bilan carbone', '#2357A6', 'Le consultant en bilan carbone collecte les données chez le client, calcule les émissions et les incertitudes, restitue les résultats et propose des plans de réduction.',
 [C_.car, C_.com, C_.bud], ['d1', 'd2', 'd3', 'cc1', 'd4', 'cc2', 'd5', 'd6', 'd7', 's8'],
 [['#terrain--bilan-carbone', 'Calculatrice du bilan carbone'], ['#ateliers--trajectoire', 'Trajectoire'], ['#ateliers--finance', 'Coûts d\'abattement'], ['#outilsm--chiffrage', 'Chiffrage d\'une mission'], ['#prestataires--cabinet', 'Fiche cabinet']],
 [['Rapport de bilan GES', 'tpl:rapportges'], ['Plan de transition', 'tpl:transition'], ['Présentation de restitution', 'tpl:restitution']],
 ['bilan-carbone'],
 ['Je sais conduire la collecte chez un client', 'Je sais utiliser la Base Empreinte et documenter les facteurs', 'Je sais calculer un bilan et ses incertitudes', 'Je sais restituer avec des messages clairs', 'Je sais construire une trajectoire et un plan de transition', 'Je sais chiffrer une mission']);


Object.assign(PTPL, {
 chapitre: ['Chapitre RSE du rapport', '<h1>[Nom de l\'enjeu] : chapitre du rapport RSE</h1><p style="text-align:center">[Entreprise] · Exercice [année]</p><h2>Pourquoi c\'est un enjeu pour nous</h2><p>[Impacts, risques et opportunités ; résultat de la double matérialité.]</p><h2>Notre politique</h2><p>[Engagements, référence du document signé, périmètre.]</p><h2>Nos actions en [année]</h2><ul><li>[Action, date, résultat]</li></ul><h2>Nos indicateurs</h2><table border="1"><tr><th>Indicateur</th><th>[année - 1]</th><th>[année]</th><th>Évolution</th><th>Cible</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Ce qui reste à faire</h2><p>[Écarts, difficultés, prochaines étapes.]</p><h2>Note méthodologique</h2><p>[Périmètre, période, définitions, changements de méthode.]</p>'],
 planannuel: ['Plan d\'action RSE annuel', '<h1>Plan d\'action RSE [année]</h1><p style="text-align:center">[Entreprise] · Validé par [instance] le [date]</p><table border="1"><tr><th>Enjeu</th><th>Action</th><th>Responsable</th><th>Échéance</th><th>Budget</th><th>Indicateur visé</th><th>Statut</th></tr><tr><td>Climat</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Social</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Achats</td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td>Éthique</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Revue</h2><p>Point d\'avancement en comité RSE chaque [trimestre] ; bilan annuel en [mois].</p>'],
 sensib: ['Trame d\'un support de sensibilisation', '<h1>[Titre accrocheur : une question ou un chiffre]</h1><p style="text-align:center">Atelier de [durée] · [public]</p><h2>1. Le chiffre qui interpelle</h2><p>[Un chiffre de l\'entreprise ou du secteur, avec sa source.]</p><h2>2. Pourquoi ça nous concerne</h2><p>[Lien avec le métier des participants.]</p><h2>3. Ce que fait déjà l\'entreprise</h2><ul><li></li></ul><h2>4. À vous de jouer</h2><p>[Exercice en petits groupes : 15 minutes.]</p><h2>5. Trois gestes concrets dans votre métier</h2><ol><li></li><li></li><li></li></ol><h2>6. Votre engagement</h2><p>[Chaque équipe choisit une action et une date.]</p>'],
 strategie: ['Stratégie RSE et feuille de route', '<h1>Stratégie RSE [période]</h1><p style="text-align:center">[Entreprise]</p><h2>Notre ambition</h2><p>[Une phrase reliée à la raison d\'être.]</p><h2>Nos enjeux prioritaires</h2><p>[Issus de la double matérialité.]</p><h2>Nos engagements</h2><table border="1"><tr><th>Engagement</th><th>Indicateur</th><th>Référence</th><th>Cible et année</th><th>Pilote</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Feuille de route</h2><table border="1"><tr><th>Horizon</th><th>Programmes et actions</th><th>Budget</th></tr><tr><td>1 an</td><td></td><td></td></tr><tr><td>3 ans</td><td></td><td></td></tr><tr><td>5 ans</td><td></td><td></td></tr></table><h2>Gouvernance</h2><p>[Sponsor, comité RSE, fréquence, rendu de compte.]</p>'],
 codir: ['Note au comité de direction', '<h1>Note au comité de direction</h1><p style="text-align:center">Objet : [sujet] · [date] · De : [nom]</p><h2>En une phrase</h2><p>[Le message et la décision attendue.]</p><h2>Les faits</h2><ul><li>[Chiffre, obligation, demande client, risque]</li></ul><h2>Les options</h2><table border="1"><tr><th>Option</th><th>Coût</th><th>Effet</th><th>Risque</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Recommandation</h2><p></p><h2>Décision attendue</h2><p>[Quoi, quand, quel budget.]</p>'],
 diagnostic: ['Rapport de diagnostic RSE', '<h1>Diagnostic RSE de [entreprise]</h1><p style="text-align:center">[Cabinet] · [date]</p><h2>Synthèse : les messages clés</h2><ol><li>[Titre-message 1]</li><li>[Titre-message 2]</li><li>[Titre-message 3]</li></ol><h2>Contexte et méthode</h2><p>[Périmètre, entretiens, documents analysés, grille utilisée.]</p><h2>Obligations applicables</h2><table border="1"><tr><th>Obligation</th><th>Statut</th><th>Échéance</th></tr><tr><td></td><td></td><td></td></tr></table><h2>Maturité par thème</h2><table border="1"><tr><th>Thème</th><th>Note sur 4</th><th>Constat</th></tr><tr><td></td><td></td><td></td></tr></table><h2>Recommandations priorisées</h2><table border="1"><tr><th>Recommandation</th><th>Effort</th><th>Effet</th><th>Horizon</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Feuille de route proposée</h2><p></p>'],
 restitution: ['Trame de présentation de restitution', '<h1>Trame de présentation de restitution</h1><p style="text-align:center">Une diapositive = un message</p><ol><li><b>Titre</b> : le message principal en une phrase.</li><li><b>Rappel de la demande</b> et de la méthode (une diapositive).</li><li><b>Le chiffre clé</b> en grand, avec une comparaison parlante.</li><li><b>La répartition</b> : un graphique, trois postes principaux mis en avant.</li><li><b>Ce que cela signifie</b> pour l\'entreprise : risques et opportunités.</li><li><b>Les leviers</b> : tableau effort, effet, coût.</li><li><b>La feuille de route</b> : 3 horizons.</li><li><b>Les décisions attendues</b> aujourd\'hui.</li><li><b>Annexes</b> : méthode, incertitudes, détails.</li></ol>'],
 proposition: ['Proposition commerciale', '<h1>Proposition d\'accompagnement</h1><p style="text-align:center">Pour [client] · Par [cabinet] · [date]</p><h2>Votre besoin</h2><p>[Reformulation avec les mots du client.]</p><h2>Notre démarche</h2><table border="1"><tr><th>Phase</th><th>Contenu</th><th>Livrable</th><th>Jours</th></tr><tr><td>1. Cadrage</td><td></td><td></td><td></td></tr><tr><td>2. Diagnostic</td><td></td><td></td><td></td></tr><tr><td>3. Recommandations</td><td></td><td></td><td></td></tr><tr><td>4. Restitution</td><td></td><td></td><td></td></tr></table><h2>Équipe et références</h2><p></p><h2>Planning</h2><p></p><h2>Budget</h2><p>[Jours × taux journalier = montant HT ; frais ; éligibilité aux aides.]</p><h2>Ce que nous attendons de vous</h2><p>[Interlocuteur, accès aux données, disponibilité.]</p>'],
 noteesg: ['Note d\'analyse ESG', '<h1>Note d\'analyse ESG : [entreprise]</h1><p style="text-align:center">[Analyste] · [date] · Secteur : [ ]</p><h2>En bref</h2><p>Note : [ ] sur 10 · Tendance : [ ] · Points forts : [ ] · Points faibles : [ ]</p><h2>Enjeux matériels du secteur</h2><ul><li></li></ul><h2>Environnement</h2><p>[Analyse chiffrée et sources.]</p><h2>Social</h2><p></p><h2>Gouvernance</h2><p></p><h2>Controverses</h2><table border="1"><tr><th>Date</th><th>Faits</th><th>Gravité</th><th>Réponse de l\'entreprise</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Taxonomie et incidences négatives</h2><p></p><h2>Conclusion et points de dialogue</h2><p></p>'],
 politiqueachats: ['Politique achats responsables', '<h1>Politique achats responsables</h1><p style="text-align:center">[Entreprise] · Signée par [direction] le [date]</p><h2>Notre ambition</h2><p></p><h2>Nos engagements</h2><ol><li>Respect des droits humains et des conditions de travail dans notre chaîne d\'approvisionnement.</li><li>Réduction de l\'empreinte environnementale de nos achats.</li><li>Relations équilibrées avec nos fournisseurs, dont le respect des délais de paiement.</li><li>Éthique et prévention de la corruption.</li><li>Achats locaux et inclusifs quand c\'est pertinent.</li></ol><h2>Nos objectifs</h2><table border="1"><tr><th>Indicateur</th><th>Départ</th><th>Cible</th><th>Année</th></tr><tr><td>Part des achats évalués sur des critères RSE</td><td></td><td></td><td></td></tr><tr><td>Délai de paiement moyen</td><td></td><td></td><td></td></tr></table><h2>Notre organisation</h2><p>[Charte fournisseurs, clauses, évaluation, formation des acheteurs, gouvernance.]</p>'],
 planbiodiv: ['Plan d\'action biodiversité', '<h1>Plan d\'action biodiversité</h1><p style="text-align:center">[Site ou entreprise] · [période]</p><h2>Diagnostic</h2><p>[Enjeux écologiques, zonages, espèces, pressions, dépendances.]</p><h2>Objectifs</h2><ul><li></li></ul><h2>Actions</h2><table border="1"><tr><th>Action</th><th>Étape ERC (éviter, réduire, compenser)</th><th>Responsable</th><th>Échéance</th><th>Indicateur</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Partenaires</h2><p></p><h2>Suivi</h2><p>[Inventaires de suivi, fréquence, indicateurs.]</p>'],
 planqvct: ['Diagnostic et plan QVCT', '<h1>Diagnostic et plan d\'amélioration QVCT</h1><p style="text-align:center">[Entreprise] · [date] · Élaboré avec le CSE</p><h2>Les indicateurs</h2><table border="1"><tr><th>Indicateur</th><th>Valeur</th><th>Année précédente</th><th>Référence du secteur</th></tr><tr><td>Absentéisme</td><td></td><td></td><td></td></tr><tr><td>Taux de fréquence</td><td></td><td></td><td></td></tr><tr><td>Taux de rotation</td><td></td><td></td><td></td></tr></table><h2>Les résultats de l\'enquête</h2><p>[Taux de réponse, notes par thème, écarts entre services, verbatims.]</p><h2>Les priorités</h2><ol><li></li></ol><h2>Le plan d\'action</h2><table border="1"><tr><th>Action</th><th>Responsable</th><th>Échéance</th><th>Indicateur de suivi</th></tr><tr><td></td><td></td><td></td><td></td></tr></table>'],
 planenv: ['Plan d\'action environnemental', '<h1>Plan d\'action environnemental</h1><p style="text-align:center">[Site] · [année]</p><h2>Aspects significatifs</h2><ul><li></li></ul><h2>Écarts réglementaires</h2><ul><li></li></ul><h2>Objectifs</h2><table border="1"><tr><th>Objectif</th><th>Indicateur</th><th>Départ</th><th>Cible</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Actions</h2><table border="1"><tr><th>Action</th><th>Responsable</th><th>Échéance</th><th>Budget</th><th>Statut</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table>'],
 rapportges: ['Rapport de bilan GES', '<h1>Bilan des émissions de gaz à effet de serre</h1><p style="text-align:center">[Client] · Année [ ] · Réalisé par [cabinet]</p><h2>Synthèse</h2><p>Total : [ ] tCO₂e, soit [ ] t par salarié. Les trois premiers postes : [ ].</p><h2>Périmètre et méthode</h2><p>[Approche, sites, scopes, méthode, version de la Base Empreinte.]</p><h2>Résultats par scope et par poste</h2><table border="1"><tr><th>Scope</th><th>Poste</th><th>tCO₂e</th><th>Part</th><th>Incertitude</th></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></table><h2>Analyse</h2><p>[Comparaisons, intensité, postes majeurs.]</p><h2>Leviers de réduction</h2><table border="1"><tr><th>Levier</th><th>tCO₂e évitées</th><th>Coût</th><th>Délai</th></tr><tr><td></td><td></td><td></td><td></td></tr></table><h2>Limites et améliorations</h2><p></p>']
});


/* ---------- Leçons partagées : un seul suivi par leçon, quel que soit le parcours ---------- */
Object.values(PCOURS).forEach(p => p.lecons.forEach(l => { if (l && typeof l === 'object' && !LECS[l.id]) LECS[l.id] = l; }));
Object.values(PCOURS).forEach(p => { p.lecons = p.lecons.map(x => typeof x === 'string' ? LECS[x] : x).filter(Boolean); });

/* ---------- Enrichissement visuel des leçons : schémas, chiffres clés, cartes, quiz, à retenir ---------- */
(() => {
const K = (...a) => ['key', a], Q = (q, o, ok, ex) => ['quiz', q, o, ok, ex], S = (t, d, c) => ['schema', t, d, c], KP = a => ['kpi', a], CA = a => ['cards', a];
/* V(id, [[position, bloc], ...]) : position = indice dans la leçon d'origine, ou 'fin' (avant les outils) */
const V = (id, ins) => { const l = LECS[id]; if (!l) return; const f = l.b.findIndex(b => b[0] === 'outil'), fin = f < 0 ? l.b.length : f; ins.map(([p, b], i) => [p === 'fin' ? fin : p, b, i]).sort((a, b) => b[0] - a[0] || b[2] - a[2]).forEach(([p, b]) => l.b.splice(p, 0, b)); };
const FIN = (...b) => b.map(x => ['fin', x]);
/* Gestion de projet */
V('p1', [[3, S('cycle', {center: 'Projet RSE', items: [['Cadrage', 'Pourquoi, quoi'], ['Planification', 'Qui, quand, combien'], ['Réalisation', 'On fait'], ['Pilotage', 'On corrige'], ['Clôture', 'On capitalise']]}, 'Les cinq phases d\'un projet')], ...FIN(Q('Quel document doit être validé avant de lancer la réalisation ?', ['Le bilan de projet', 'La note de cadrage', 'Le compte rendu de comité'], 1, 'Le cadrage fixe l\'objectif, le périmètre, les moyens et le commanditaire : sans validation, le projet n\'a ni mandat ni limite.'), K('Un projet a un début, une fin, un livrable et des moyens définis.', 'Les cinq phases : cadrer, planifier, réaliser, piloter, clôturer.', 'Une démarche RSE alterne projets et activités récurrentes.'))]);
V('p2', FIN(K('La note de cadrage tient en deux à quatre pages et se fait valider par le commanditaire.', 'Un objectif SMART : spécifique, mesurable, atteignable, réaliste, daté.', 'Écrire ce qui est hors périmètre évite les malentendus.')));
V('p3', [[1, S('flow', [['Découper', 'Lots et tâches'], ['Estimer', 'Durée, charge'], ['Ordonner', 'Dépendances'], ['Jalonner', 'Dates clés'], ['Visualiser', 'Diagramme de Gantt']], 'De la liste de tâches au planning')], ...FIN(K('On découpe le projet en lots puis en tâches de quelques jours.', 'Les jalons sont des points de décision, pas des tâches.', 'Prévoir une marge sur les tâches qui dépendent d\'autres services.'))]);
V('p4', [[1, S('layers', [['R : réalise', 'Fait le travail ; il peut y en avoir plusieurs'], ['A : approuve', 'Valide et rend des comptes ; une seule personne par tâche'], ['C : consulté', 'Donne son avis avant la décision'], ['I : informé', 'Est tenu au courant après']], 'La matrice RACI')], ...FIN(Q('Combien de personnes « A » (autorité) faut-il par tâche ?', ['Une seule', 'Deux, pour se remplacer', 'Autant que de services concernés'], 0, 'Une seule personne rend des comptes : sinon personne ne tranche.'))]);
V('p5', [[2, S('matrix', {x: 'Probabilité', y: 'Impact', zone: 'Risques prioritaires', pts: [['Données fournisseurs en retard', 4.2, 3.4], ['Budget insuffisant', 3.2, 4.1], ['Départ du chef de projet', 1.8, 4.6], ['Refus de participer d\'un site', 2.4, 2.2], ['Changement de logiciel', 1.4, 1.6]]}, 'Exemple de matrice des risques d\'un projet de bilan carbone')], ...FIN(K('Criticité = probabilité × impact.', 'Chaque risque important a un responsable et une action de prévention.', 'Le registre des risques se revoit à chaque comité de projet.'))]);
V('p6', [[2, CA([['☀', 'Soleil', 'Délais, budget et qualité tenus : on informe.'], ['☁', 'Nuage', 'Un écart apparaît : vigilance et plan de rattrapage.'], ['⚡', 'Orage', 'Écart majeur : une décision du comité de pilotage est nécessaire.']])], ...FIN(K('Piloter, c\'est comparer le prévu et le réalisé, puis décider.', 'La météo résume l\'état du projet en un coup d\'œil.', 'Un compte rendu tient en une page et se termine par les décisions.'))]);
V('p7', [[1, S('flow', [['Conscience', 'Comprendre pourquoi changer'], ['Désir', 'Vouloir y participer'], ['Connaissance', 'Savoir comment faire'], ['Capacité', 'Pouvoir le faire au quotidien'], ['Renforcement', 'Ancrer dans la durée']], 'Le modèle ADKAR : les cinq étapes du changement individuel')], ...FIN(K('On ne change pas une organisation, on aide des personnes à changer.', 'Partir des contraintes de chacun et montrer le gain.', 'Célébrer les premiers résultats entretient l\'élan.'))]);
V('p8', FIN(K('Clôturer, c\'est vérifier les résultats, solder le budget et transmettre.', 'Le retour d\'expérience sert au prochain projet : ce qui a marché, ce qu\'il faut changer.')));
V('p9', FIN(K('Une PME a besoin d\'un projet léger, porté par la direction, avec des outils simples.', 'Un grand groupe a besoin de gouvernance, de relais par site et de consolidation.')));
/* Budget */
V('b1', [[2, S('formula', ['Coût global', 'investissement + coûts d\'exploitation sur la durée de vie − valuer résiduelle'.replace('valuer', 'valeur'), '', 'le bon critère pour comparer deux équipements'])], ...FIN(K('Investissement (CapEx) : amorti sur plusieurs années. Fonctionnement (OpEx) : dépenses de chaque année.', 'Un projet RSE coûte souvent au départ et rapporte ensuite.', 'Comparer en coût global, jamais au seul prix d\'achat.'))]);
V('b2', [[1, S('formula', ['Temps de retour', 'Investissement', 'Gain net annuel', '350 000 € ÷ 37 000 € par an ≈ 9,5 ans'])], ...FIN(Q('Une valeur actuelle nette (VAN) positive signifie :', ['Le projet rapporte plus qu\'il ne coûte, une fois les flux actualisés', 'Le temps de retour est inférieur à un an', 'Le projet est subventionné'], 0, 'La VAN additionne les gains et les coûts futurs ramenés à aujourd\'hui : positive, le projet crée de la valeur au taux choisi.'), K('Temps de retour : simple, mais ignore ce qui se passe après.', 'VAN : la valeur créée en euros d\'aujourd\'hui.', 'TRI : le taux de rentabilité du projet, à comparer au coût du capital.'))]);
V('b3', [[1, S('formula', ['Coût par tonne évitée', 'coût annualisé − économies annuelles', 'tonnes de CO₂e évitées par an', 'négatif : l\'action rapporte de l\'argent'])], ...FIN(K('La courbe des coûts classe les actions du moins cher au plus cher par tonne évitée.', 'Commencer par les actions à coût négatif : elles financent les suivantes.'))]);
V('b4', [[1, CA([['bag', 'Aides publiques', 'ADEME, Bpifrance, régions, certificats d\'économies d\'énergie : réduisent l\'investissement.'], ['chart', 'Prix interne du carbone', 'Un coût fictif par tonne ajouté aux calculs pour favoriser les options bas carbone.'], ['flag', 'Financement vert', 'Prêts et obligations à taux liés à des objectifs de durabilité.']])], ...FIN(K('Vérifier les aides avant de chiffrer : elles changent souvent la décision.', 'Le prix interne du carbone rend visible le coût futur des émissions.'))]);
V('b5', [[1, S('flow', [['Le problème', 'En deux phrases'], ['Les options', 'Deux ou trois'], ['Les chiffres', 'Coût, gain, CO₂e'], ['La recommandation', 'Une seule'], ['La décision', 'Quoi, quand, combien']], 'La structure d\'une note qui obtient une décision')], ...FIN(K('Une direction décide sur des options chiffrées, pas sur des intentions.', 'Toujours présenter le coût de l\'inaction.'))]);
/* Décarbonation */
V('d1', [[1, S('scopes', null, 'Les trois scopes d\'un bilan d\'émissions')], [2, KP([['1', '', 'pouvoir de réchauffement du CO₂, la référence'], ['30', '', 'environ, pour le méthane d\'origine fossile sur 100 ans (GIEC)'], ['273', '', 'pour le protoxyde d\'azote sur 100 ans (GIEC)'], ['70', '% et plus', 'souvent la part du scope 3 dans le total d\'une entreprise']])], ...FIN(Q('L\'électricité achetée par l\'entreprise relève du :', ['Scope 1', 'Scope 2', 'Scope 3'], 1, 'Le scope 2 couvre les émissions de production de l\'énergie achetée (électricité, chaleur, vapeur, froid).'), K('Toutes les émissions sont converties en tonnes équivalent CO₂ (tCO₂e).', 'Scope 1 : direct ; scope 2 : énergie achetée ; scope 3 : tout le reste de la chaîne de valeur.', 'Ignorer le scope 3, c\'est souvent ignorer l\'essentiel.'))]);
V('d2', FIN(K('Les méthodes sont compatibles : un bilan bien fait sert à plusieurs usages.', 'BEGES réglementaire : tous les 4 ans pour les entreprises concernées, avec un plan de transition.')));
V('d3', [[1, S('formula', ['Émissions', 'Donnée d\'activité × facteur d\'émission', '', 'exemple : litres de gazole × kgCO₂e par litre (Base Empreinte)'])], ...FIN(Q('Vous avez seulement le montant des achats de fournitures en euros. Que faire ?', ['Ne pas les compter', 'Utiliser un facteur monétaire (kgCO₂e par euro) et le signaler comme estimation', 'Inventer une quantité en kilos'], 1, 'Les facteurs monétaires donnent un ordre de grandeur ; on les remplace par des données physiques quand c\'est possible.'))]);
V('d4', [[2, S('donut', {total: '1 850', sub: 'tCO₂e', items: [['Achats de matières', 48], ['Fret', 17], ['Immobilisations', 10], ['Énergie des sites', 9], ['Déplacements', 8], ['Autres', 5], ['Déchets', 3]]}, 'Exemple illustratif de répartition pour une PME industrielle')], ...FIN(K('Collecter, convertir, consolider, analyser, restituer.', 'Noter chaque hypothèse et le niveau d\'incertitude.', 'Les trois premiers postes concentrent les leviers.'))]);
V('d5', [[1, KP([['4,2', '% par an', 'réduction linéaire minimale des scopes 1 et 2 pour une cible alignée sur 1,5 °C (SBTi)'], ['55', '%', 'réduction nette des émissions de l\'Union européenne en 2030 par rapport à 1990'], ['2050', '', 'neutralité carbone visée par la France et l\'Union européenne']])], [3, S('bars', {unit: 't', items: [['2025 (référence)', 1000], ['2027', 916], ['2030', 790], ['2035', 580]]}, 'Trajectoire linéaire de −4,2 % par an à partir de 1 000 tCO₂e')], ...FIN(K('Une trajectoire part d\'une année de référence et fixe des cibles intermédiaires.', 'Des cibles absolues, pas seulement en intensité.', 'La trajectoire guide le choix et le calendrier des actions.'))]);
V('d6', [[1, S('flow', [['Point de départ', 'Bilan de référence'], ['Cibles', '2030, 2050'], ['Leviers', 'Actions chiffrées'], ['Moyens', 'Investissements'], ['Gouvernance', 'Qui pilote'], ['Suivi', 'Indicateurs annuels']], 'Le contenu d\'un plan de transition')]]);
V('d7', FIN(K('Chaque action : tonnes évitées, coût, responsable, échéance.', 'Suivre chaque année le réalisé face à la trajectoire.')));
V('d8', [[1, S('pyramid', {inv: true, top: 'Tous les fournisseurs', bot: 'Fournisseurs stratégiques', items: [['Informer', 'Charte, attentes'], ['Collecter', 'Données d\'émissions'], ['Demander des cibles', 'Trajectoire du fournisseur'], ['Coconstruire', 'Actions communes'], ['Contractualiser', 'Clauses et suivi']]}, 'L\'engagement des fournisseurs, du plus large au plus approfondi')], ...FIN(K('Concentrer l\'effort sur les fournisseurs qui pèsent le plus dans le scope 3.', 'Remplacer peu à peu les facteurs monétaires par les données réelles des fournisseurs.'))]);
V('d9', FIN(K('Un tableur bien construit suffit pour un premier bilan ; un logiciel aide au suivi et à la consolidation.')));
/* Économie circulaire */
V('c1', [[2, S('cycle', {center: 'Économie circulaire', items: [['Approvisionnement'], ['Écoconception'], ['Écologie industrielle'], ['Fonctionnalité'], ['Consommation'], ['Durée d\'usage'], ['Recyclage']]}, 'Les sept piliers de l\'économie circulaire (ADEME)')], [4, S('pyramid', {inv: true, top: 'Le plus souhaitable', bot: 'En dernier recours', items: [['Prévention'], ['Réemploi'], ['Recyclage'], ['Valorisation énergétique'], ['Élimination']]}, 'La hiérarchie des modes de traitement des déchets')], ...FIN(Q('Quel mode de traitement passe en premier ?', ['Le recyclage', 'La prévention', 'La valorisation énergétique'], 1, 'Le meilleur déchet est celui qu\'on ne produit pas.'))]);
V('c2', [[1, KP([['7', 'flux', 'à trier à la source : papier-carton, métal, plastique, verre, bois, fractions minérales, plâtre'], ['2024', '', 'tri à la source des biodéchets généralisé'], ['2040', '', 'objectif de fin des emballages en plastique à usage unique (loi AGEC)']])], ...FIN(K('La loi AGEC fixe des obligations de tri, d\'interdiction et d\'information.', 'Garder les preuves : contrats, attestations de valorisation, registres.'))]);
V('c3', [[1, S('flow', [['Cartographier', 'Entrées et sorties'], ['Peser', 'Tonnes par flux'], ['Chiffrer', 'Coût complet'], ['Repérer', 'Gisements'], ['Prioriser', 'Gain et faisabilité']], 'Le diagnostic des flux en cinq temps')]]);
V('c4', FIN(K('Chaque solution se chiffre : coût, économies, tonnes évitées.', 'Les acteurs de l\'économie sociale et solidaire sont des partenaires du réemploi.')));
V('c5', [[1, S('cycle', {center: 'Cycle de vie', items: [['Matières'], ['Fabrication'], ['Distribution'], ['Usage'], ['Fin de vie']]}, 'Les étapes du cycle de vie d\'un produit')], ...FIN(K('Partir de la fonction rendue (l\'unité fonctionnelle).', 'Agir d\'abord sur l\'étape qui pèse le plus.', 'Vérifier qu\'on ne déplace pas l\'impact sur une autre étape.'))]);
V('c6', FIN(Q('À quoi sert l\'unité fonctionnelle ?', ['À comparer des produits rendant le même service', 'À fixer le prix du produit', 'À choisir le logiciel d\'ACV'], 0, 'Elle définit le service rendu (par exemple, emballer 1 kg de café pendant 12 mois) pour comparer des solutions équivalentes.')));
V('c7', FIN(K('Un plan d\'économie circulaire : diagnostic, obligations, objectifs, actions chiffrées, suivi.')));
/* Reporting */
V('r1', [[2, KP([['1 000', 'salariés', 'et 450 M€ de chiffre d\'affaires : seuils de la CSRD après l\'Omnibus'], ['12', 'normes', 'ESRS : 2 transversales et 10 thématiques (climat, pollution, eau, biodiversité, ressources, effectifs, chaîne de valeur, communautés, consommateurs, conduite des affaires)']])], ...FIN(K('Identifier d\'abord le cadre qui s\'applique : obligation ou demande d\'un client.', 'La VSME offre aux PME une réponse unique aux demandes de leurs partenaires.'))]);
V('r2', [[1, S('flow', [['Définir', 'Indicateurs et définitions'], ['Désigner', 'Contributeurs'], ['Collecter', 'Calendrier'], ['Contrôler', 'Cohérence'], ['Consolider', 'Groupe'], ['Valider', 'Direction']], 'Le processus de reporting')], ...FIN(K('Le protocole fixe pour chaque indicateur sa définition, sa source, son responsable et son mode de calcul.', 'Un calendrier clair évite la course de fin d\'année.'))]);
V('r3', [[0, CA([['radar', 'Exhaustivité', 'Tous les sites et toutes les périodes sont couverts.'], ['chart', 'Exactitude', 'Les valeurs correspondent aux justificatifs.'], ['flag', 'Cohérence', 'Les évolutions s\'expliquent d\'une année à l\'autre.'], ['doc', 'Traçabilité', 'Chaque chiffre renvoie à sa source.']])], ...FIN(K('Contrôler les écarts de plus de 10 à 20 % par rapport à l\'année précédente.', 'Toute correction se documente.'))]);
V('r4', [[2, S('versus', {a: ['À éviter', ['« Fortement engagé pour la planète »', '« Neutre en carbone » sans preuve', 'Un chiffre sans périmètre ni année']], b: ['À faire', ['« −12 % d\'émissions des scopes 1 et 2 par rapport à 2024 »', '« 87 % des sites certifiés ISO 14001 »', 'Expliquer ce qui ne progresse pas']]}, 'Écrire sans écoblanchiment')], ...FIN(K('Chaque enjeu : politique, actions, indicateurs, cibles, résultats.', 'La même structure d\'une année à l\'autre permet la comparaison.'))]);
V('r5', [[1, CA([['radar', 'Environnement', 'Énergie, émissions, déchets, produits.'], ['flag', 'Social et droits humains', 'Santé-sécurité, conditions de travail, diversité.'], ['doc', 'Éthique', 'Corruption, concurrence, données.'], ['bag', 'Achats responsables', 'Exigences et évaluation des fournisseurs.']])], ...FIN(Q('Qu\'est-ce qui fait le plus progresser une note EcoVadis ?', ['Un long rapport général', 'Des preuves précises : politiques signées, procédures, indicateurs', 'Des réponses « oui » partout'], 1, 'La note dépend des documents justificatifs fournis pour chaque question.'))]);
V('r6', [[2, S('formula', ['Ratio d\'alignement du chiffre d\'affaires', 'CA des activités alignées', 'CA total', '30 M€ ÷ 200 M€ = 15 %'])], [3, S('gauge', [['Chiffre d\'affaires éligible', 20], ['Chiffre d\'affaires aligné', 15]], 'Résultat de l\'exemple')], ...FIN(K('Éligible : l\'activité figure dans la liste. Aligné : elle respecte en plus les critères techniques, ne cause pas de préjudice important et respecte les garanties sociales.'))]);
V('r7', FIN(K('Préparer des données structurées dès la collecte facilite le balisage.')));
V('r8', [[1, S('flow', [['Planification', 'Risques, calendrier'], ['Revue du processus', 'Double matérialité, collecte'], ['Tests', 'Par sondage'], ['Constats', 'Écarts'], ['Avis', 'Assurance limitée']], 'Le déroulé d\'un audit du rapport de durabilité')], ...FIN(K('Préparer un dossier de preuves par indicateur.', 'Désigner un interlocuteur par thème pour répondre vite.'))]);
/* Stratégie et conseil */
V('s1', [[1, S('bars', {unit: '/ 4', items: [['Gouvernance', 3], ['Droits de l\'homme', 1], ['Relations et conditions de travail', 3], ['Environnement', 2], ['Loyauté des pratiques', 2], ['Consommateurs', 2], ['Communautés et développement local', 1]]}, 'Exemple de profil de maturité sur les sept questions centrales de l\'ISO 26000')], ...FIN(K('Un diagnostic part des obligations, de l\'existant et des entretiens.', 'Repérer les écarts critiques et les actions rapides.'))]);
V('s2', [[2, S('matrix', {x: 'Matérialité d\'impact', y: 'Matérialité financière', or: true, zone: 'Matériel si un seuil est dépassé', pts: [['Émissions de la flotte', 4.6, 4.1], ['Sécurité des conducteurs', 4.3, 3.5], ['Recrutement des conducteurs', 2.5, 4.3], ['Qualité de l\'air', 3.6, 2.2], ['Éthique des affaires', 2, 2.5], ['Biodiversité', 1.3, 1.2]]}, 'Double matérialité d\'un transporteur routier (exemple)')], ...FIN(Q('Un enjeu a un impact très important mais aucun effet financier. Est-il matériel ?', ['Non, il faut les deux', 'Oui : il suffit d\'une des deux matérialités', 'Seulement si un client le demande'], 1, 'Un enjeu est matériel dès qu\'il dépasse le seuil d\'impact ou le seuil financier.'), K('Deux regards : l\'impact de l\'entreprise sur le monde, l\'effet du monde sur l\'entreprise.', 'Documenter la méthode, les seuils et les résultats pour l\'auditeur.'))]);
V('s3', [[1, S('pyramid', {items: [['Raison d\'être', 'Pourquoi'], ['Engagements', '4 à 6, chiffrés et datés'], ['Programmes', 'Par enjeu'], ['Actions', 'Responsable, budget, échéance']]}, 'De la raison d\'être aux actions')], ...FIN(K('Un engagement = un indicateur, une valeur de départ, une cible, une date.', 'La feuille de route se lit à 1, 3 et 5 ans.'))]);
V('s4', [[1, CA([['flag', 'Conseil d\'administration', 'Supervise la stratégie de durabilité.'], ['bag', 'Comité de direction', 'Un sponsor porte les décisions.'], ['cal', 'Comité RSE', 'Suit le plan chaque trimestre.'], ['tool', 'Référents', 'Relais dans les sites et les services.']])]]);
V('s5', [[1, S('matrix', {x: 'Influence', y: 'Intérêt', zone: 'Associer étroitement', pts: [['Clients grands comptes', 4.5, 4.2], ['Salariés', 3.3, 4.6], ['Banques', 4, 3.3], ['Riverains', 1.6, 3.8], ['Fournisseurs', 2.6, 2.4], ['Médias', 3.8, 1.7]]}, 'Cartographie des parties prenantes (exemple)')], [1, CA([['flag', 'Associer', 'Influence et intérêt forts : coconstruire.'], ['bag', 'Satisfaire', 'Influence forte : consulter régulièrement.'], ['doc', 'Informer', 'Intérêt fort : tenir au courant.'], ['radar', 'Surveiller', 'Influence et intérêt faibles : veille.']])], ...FIN(K('Chaque partie prenante appelle un mode de dialogue adapté.'))]);
V('s6', [[1, S('bars', {unit: 'min', items: [['Contexte', 20], ['Cotation en sous-groupes', 40], ['Mise en commun', 30], ['Vote sur les priorités', 20], ['Conclusion', 10]]}, 'Déroulé d\'un atelier de matérialité de deux heures')], ...FIN(K('Un atelier a un objectif et un livrable de sortie.', 'Alterner travail individuel, sous-groupes et mise en commun.'))]);
V('s7', [[1, S('pyramid', {items: [['Le message clé', 'La conclusion d\'abord'], ['Trois arguments', 'Qui la justifient'], ['Les faits', 'Chiffres et sources']]}, 'La logique de la synthèse au détail')], [2, S('versus', {a: ['Titre neutre', ['« Résultats du bilan carbone »', '« Analyse des achats »']], b: ['Titre-message', ['« Les achats d\'acier pèsent 60 % : premier levier »', '« Trois fournisseurs concentrent la moitié du risque »']]})]]);
V('s8', [[1, S('bars', {unit: 'j', items: [['Cadrage', 1], ['Collecte et accompagnement', 3], ['Calcul', 2], ['Plan d\'action', 2], ['Restitution', 1]]}, 'Chiffrage d\'un premier bilan carbone de PME')], [2, S('formula', ['Prix', '9 jours × 800 € = 7 200 € HT', '', 'jours × taux journalier moyen'])], ...FIN(K('Reformuler le besoin avec les mots du client.', 'Chaque phase a un livrable et une charge en jours.'))]);
V('k1', [[1, S('flow', [['Écouter', 'Leurs contraintes'], ['Montrer le gain', 'Pour eux'], ['Outiller', 'Modèles, critères'], ['Valoriser', 'Leurs résultats']], 'Embarquer un service sans autorité hiérarchique')]]);
V('k2', [[1, S('gauge', [['Actions du plan réalisées', 64], ['Fournisseurs stratégiques évalués', 45], ['Salariés sensibilisés', 80]], 'Exemple de tableau de bord trimestriel')], ...FIN(K('10 à 15 indicateurs, chacun avec son évolution et son objectif.', 'Le plan annuel : action, responsable, échéance, budget, indicateur.'))]);
/* Finance durable */
V('e1', [[0, CA([['doc', 'Publications', 'Rapport de durabilité, document d\'enregistrement universel.'], ['chart', 'Fournisseurs de données', 'Notations, émissions, controverses.'], ['flag', 'Dialogue', 'Questionnaires et rencontres avec l\'entreprise.'], ['radar', 'Sources externes', 'ONG, presse, bases publiques.']])]]);
V('e2', [[1, S('donut', {total: 'E S G', sub: 'industriel', items: [['Environnement', 50], ['Social', 30], ['Gouvernance', 20]]}, 'Pondération des piliers pour un industriel')], [2, S('formula', ['Note globale', '0,5 × 6 + 0,3 × 7 + 0,2 × 8 = 6,7', '', 'puis −1 point pour une controverse grave : 5,7'])], ...FIN(Q('Pourquoi deux agences notent-elles différemment la même entreprise ?', ['L\'une des deux se trompe', 'Leurs critères, sources et pondérations diffèrent', 'Les entreprises paient pour être bien notées'], 1, 'Comprendre la méthode est indispensable avant d\'utiliser une note.'))]);
V('e3', [[1, CA([['radar', 'Gravité', 'De 1 (mineure) à 5 (très grave).'], ['cal', 'Répétition', 'Fait isolé ou récurrent.'], ['flag', 'Réponse', 'Mesures correctives de l\'entreprise.'], ['doc', 'Statut', 'En cours, résolue, à revoir.']])]]);
V('e4', [[1, CA([['doc', 'Article 6', 'Le produit ne revendique pas de caractéristique durable.'], ['flag', 'Article 8', 'Il promeut des caractéristiques environnementales ou sociales.'], ['radar', 'Article 9', 'Il a un objectif d\'investissement durable.']])], ...FIN(K('Le règlement SFDR est en cours de révision : vérifier la version applicable.'))]);
V('e5', FIN(K('Commencer par le résumé : note, tendance, forces, faiblesses.', 'Chaque affirmation est chiffrée et sourcée.')));
/* Achats */
V('a1', [[1, S('matrix', {x: 'Montant ou criticité', y: 'Risque RSE', zone: 'À évaluer en priorité', pts: [['Textile importé', 3.4, 4.6], ['Matières métalliques', 4.4, 3.7], ['Transport', 3.6, 2.6], ['Nettoyage', 1.8, 3.4], ['Prestations informatiques', 2.6, 1.6], ['Fournitures de bureau', 1.2, 1.3]]}, 'Matrice de priorisation des achats (exemple)')], ...FIN(K('Le risque dépend de la matière, du procédé et du pays.', 'On évalue d\'abord ce qui est à la fois risqué et important.'))]);
V('a2', [[1, S('layers', [['Politique', 'L\'ambition et les engagements de l\'entreprise'], ['Charte fournisseurs', 'Les exigences imposées aux fournisseurs'], ['Clauses contractuelles', 'Les obligations et sanctions dans le contrat'], ['Critères de sélection', 'Le poids de la RSE dans le choix']], 'Les quatre niveaux des achats responsables')]]);
V('a3', [[1, S('gauge', [['Conforme', 70, '70 et plus'], ['À améliorer', 55, '40 à 69'], ['À risque', 25, 'moins de 40']], 'Le classement des fournisseurs selon leur note sur 100')], ...FIN(Q('Un fournisseur obtient 45 sur 100. Que faire ?', ['L\'exclure immédiatement', 'Construire avec lui un plan de progrès suivi', 'Ne rien faire'], 1, 'On accompagne d\'abord ; on se sépare si le fournisseur refuse de progresser sur des points graves.'))]);
V('a4', [[1, KP([['5 000', 'salariés', 'en France, ou 10 000 avec les filiales étrangères : seuil du devoir de vigilance (loi de 2017)'], ['2029', '', 'première application de la directive européenne CSDDD aux plus grandes entreprises']])]]);
/* Biodiversité */
V('v1', [[1, KP([['1', 'million', 'd\'espèces menacées d\'extinction (IPBES, 2019)'], ['75', '%', 'des milieux terrestres fortement modifiés par les activités humaines (IPBES, 2019)']])], [1, CA([['radar', 'Usage des terres et des mers', 'Artificialisation, déforestation.'], ['bag', 'Exploitation directe', 'Pêche, chasse, prélèvements.'], ['chart', 'Changement climatique', 'Déplacement des espèces.'], ['tool', 'Pollutions', 'Pesticides, plastiques, lumière.'], ['flag', 'Espèces exotiques envahissantes', 'Concurrence avec les espèces locales.']])], ...FIN(K('Impacts et dépendances : la biodiversité est un enjeu de double matérialité.'))]);
V('v2', FIN(K('Situer, recueillir, inventorier, analyser, agir.', 'L\'inventaire se fait sur un cycle de saisons.')));
V('v3', [[1, CA([['bag', 'Approvisionnement', 'Eau, bois, fibres, nourriture.'], ['radar', 'Régulation', 'Climat, crues, pollinisation, qualité de l\'eau.'], ['book', 'Culturels', 'Loisirs, paysages, patrimoine.']])]]);
V('v4', [[1, S('pyramid', {inv: true, top: 'Priorité absolue', bot: 'En dernier recours', items: [['Éviter', 'Changer d\'emplacement, de période, de procédé'], ['Réduire', 'Limiter l\'impact qui reste'], ['Compenser', 'Restaurer ailleurs, sans perte nette']]}, 'La séquence éviter, réduire, compenser')], ...FIN(Q('Une entreprise propose de compenser dès le départ la destruction d\'une zone humide. Est-ce conforme ?', ['Oui, si la compensation est plus grande', 'Non : il faut d\'abord chercher à éviter puis réduire', 'Oui, la compensation remplace l\'évitement'], 1, 'La compensation n\'intervient qu\'en dernier recours.'))]);
V('v5', [[1, S('flow', [['Localiser', 'Interfaces avec la nature'], ['Évaluer', 'Dépendances et impacts'], ['Apprécier', 'Risques et opportunités'], ['Préparer', 'Réponse et reporting']], 'L\'approche LEAP de la TNFD')]]);
V('v6', FIN(K('Des objectifs par site et pour la chaîne d\'approvisionnement.', 'Des indicateurs simples, suivis chaque année.')));
/* QVCT */
V('q1', [[1, CA([['doc', 'Document unique', 'L\'évaluation des risques, y compris psychosociaux.'], ['flag', 'QVCT', 'Organisation, contenu du travail, relations, équilibre.'], ['bag', 'Négociation', 'Égalité professionnelle et qualité de vie.'], ['cal', 'CSE', 'Consulté sur les conditions de travail dès 11 salariés.']])]]);
V('q2', [[1, S('formula', ['Taux de fréquence', 'accidents avec arrêt × 1 000 000', 'heures travaillées', '6 × 1 000 000 ÷ 300 000 = 20'])], [1, KP([['4', '%', 'd\'absentéisme dans l\'exemple'], ['20', '', 'de taux de fréquence'], ['0,5', '', 'de taux de gravité'], ['15', '%', 'de taux de rotation']])], ...FIN(K('Comparer à l\'année précédente et aux références du secteur.', 'Un indicateur social se lit avec les équipes, pas seul.'))]);
V('q3', [[1, S('bars', {unit: '/ 5', items: [['Relations entre collègues', 4.1], ['Sens du travail', 3.9], ['Autonomie', 3.6], ['Hiérarchie', 3.4], ['Conditions matérielles', 3.2], ['Équilibre des temps', 2.9], ['Reconnaissance', 2.8], ['Charge de travail', 2.4]]}, 'Exemple de résultats d\'enquête : les priorités apparaissent en bas')]]);
V('q4', [[1, S('versus', {a: ['Effet limité', ['Corbeille de fruits', 'Séance de yoga ponctuelle', 'Affiche de prévention']], b: ['Effet durable', ['Revoir la répartition de la charge', 'Former les managers à l\'écoute', 'Clarifier les priorités et les rôles']]}, 'Agir sur l\'organisation du travail')]]);
/* Environnement */
V('n1', [[1, S('flow', [['Identifier', 'Les textes'], ['Évaluer', 'L\'applicabilité'], ['Traduire', 'En exigences'], ['Vérifier', 'La conformité'], ['Mettre à jour', 'Chaque trimestre']], 'Le cycle de la veille réglementaire')]]);
V('n2', [[1, S('cycle', {center: 'Amélioration continue', items: [['Planifier', 'Chap. 4 à 6'], ['Réaliser', 'Chap. 7 et 8'], ['Vérifier', 'Chap. 9'], ['Agir', 'Chap. 10']]}, 'La roue PDCA appliquée à l\'ISO 14001')]]);
V('n3', [[1, S('formula', ['Score d\'un aspect', 'gravité × fréquence × maîtrise', '', 'significatif au-delà de 20'])], [2, S('bars', {unit: '', items: [['Peinture : émissions de solvants', 27, '#B03060'], ['Lavage : rejets d\'eaux', 24, '#B03060'], ['Chaufferie : combustion de gaz', 12], ['Bureaux : papier', 3]]}, 'Résultat de l\'exemple : deux aspects significatifs')]]);
V('n4', [[1, CA([['radar', 'Énergie', 'MWh par site et par unité produite.'], ['tool', 'Eau', 'm³ prélevés et qualité des rejets.'], ['bag', 'Déchets', 'Tonnes et taux de valorisation.'], ['chart', 'Émissions', 'Air et gaz à effet de serre.']])]]);
V('n5', [[1, S('flow', [['Préparer', 'Documents et preuves'], ['Accueillir', 'Visite du site'], ['Répondre', 'Constats'], ['Corriger', 'Plan d\'actions'], ['Suivre', 'Clôture des écarts']], 'Avant, pendant et après une inspection')]]);
/* Conseil carbone */
V('cc1', [[1, CA([['doc', 'Données d\'activité', 'Factures, relevés, extractions comptables.'], ['chart', 'Facteurs d\'émission', 'Base Empreinte, données fournisseurs.'], ['flag', 'Hypothèses', 'Écrites et validées avec le client.'], ['radar', 'Incertitudes', 'Notées par poste.']])]]);
V('cc2', FIN(Q('Comment commencer une restitution de bilan carbone ?', ['Par la méthode de calcul', 'Par le chiffre clé et les trois premiers postes', 'Par la liste des facteurs d\'émission'], 1, 'Le client retient le message : total, postes majeurs, leviers. La méthode va en annexe.'), K('Un chiffre, une comparaison parlante, trois postes, trois leviers.')));
})();

/* ---------- Rendu des parcours ---------- */
const PCO = {cur: null, lec: null};
const pcDone = () => { let o = {}; try { o = JSON.parse(LS.get('pcDone') || '{}'); } catch(e) {} if (!o._v2) { Object.keys(o).forEach(k => { const m = k.match(/^([a-z]+):(.+)$/); if (m && m[1] !== 'L' && !/^auto\d+$/.test(m[2])) o['L:' + m[2]] = o['L:' + m[2]] || o[k]; }); o._v2 = 1; try { LS.set('pcDone', JSON.stringify(o)); } catch(e) {} } return o; };
const pcSet = o => LS.set('pcDone', JSON.stringify(o));
const lk = l => 'L:' + l.id;
function pcLien(href, label){ if (href.startsWith('tpl:')) return '<button class="btn ghost sm" data-pc="tpl" data-k="' + href.slice(4) + '">' + esc(label) + '</button>'; if (/^https?:/.test(href)) return '<a class="btn ghost sm" href="' + href + '" target="_blank" rel="noopener">' + esc(label) + ' →</a>'; return '<a class="btn ghost sm" href="' + href + '">' + esc(label) + ' →</a>'; }
function pcBloc(b){
  const [k] = b, v = visBloc(b); if (v != null) return v;
  if (k === 'p') return '<p>' + esc(b[1]) + '</p>';
  if (k === 'h') return '<h4 class="pch">' + esc(b[1]) + '</h4>';
  if (k === 'ul') return '<ul class="vul">' + b[1].map((x, i) => '<li style="--i:' + i + '">' + esc(x) + '</li>').join('') + '</ul>';
  if (k === 'ex') return '<div class="exbox"><span class="exl">Exemple</span><strong>' + esc(b[1]) + '</strong><p>' + esc(b[2]) + '</p></div>';
  if (k === 'tip') return '<div class="callout b"><strong>Bon à savoir</strong>' + esc(b[1]) + '</div>';
  if (k === 'tab') return '<div class="tablewrap"><table><thead><tr>' + b[1].map(x => '<th>' + esc(x) + '</th>').join('') + '</tr></thead><tbody>' + b[2].map(r => '<tr>' + r.map(x => '<td>' + esc(x) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  if (k === 'outil') return '<div class="pcout">' + pcLien(b[1], b[2]) + '</div>';
  return '';
}
const ring = (p, c) => '<svg class="pring" viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="7"/><circle cx="32" cy="32" r="26" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="' + (p ? 'round' : 'butt') + '" pathLength="100" stroke-dasharray="' + p + ' 100" transform="rotate(-90 32 32)"/><text x="32" y="37" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">' + p + '%</text></svg>';
const PLAYI = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 5l12 7-12 7z"/></svg>';
function lecSlides(pc, l, i, L){
  const D = pcDone(), outils = l.b.filter(b => b[0] === 'outil');
  const S = [{cls: 'cover', html: '<div class="slcover"><span class="sle">' + esc(pc.titre) + '</span><div class="slnum">' + String(i + 1).padStart(2, '0') + '</div><h1>' + esc(l.t) + '</h1><p>Leçon ' + (i + 1) + ' sur ' + L.length + ' · ' + esc(l.d) + '</p></div>', say: 'Leçon ' + (i + 1) + '. ' + l.t + '.'}].concat(blocsEnDiapos(l.b, l.t, pcBloc));
  S.push({cls: 'fin', html: '<div class="slcover"><span class="sle">Fin de la leçon</span><h1>Bravo, passez à la pratique</h1>' + (outils.length ? '<div class="slout">' + outils.map(b => pcBloc(b)).join('') + '</div>' : '') + '<div class="slout"><button class="btn" data-dia="act" data-k="done">' + (D[lk(l)] ? '✓ Leçon terminée' : 'Marquer la leçon comme terminée') + '</button>' + (L[i + 1] ? '<button class="btn ghost" data-dia="act" data-k="next">Leçon suivante : ' + esc(L[i + 1].t) + ' →</button>' : '') + '</div></div>', say: 'Fin de la leçon. Passez à la pratique avec les outils proposés.'});
  return S;
}
function pcSlides(pc){
  const L = pc.lecons, cut = (a, n) => { const r = []; for (let i = 0; i < a.length; i += n) r.push(a.slice(i, i + n)); return r; };
  const S = [{cls: 'cover', html: '<div class="slcover"><span class="sle">' + esc(pc.type) + '</span><h1>' + esc(pc.titre) + '</h1><p>' + L.length + ' leçons · ' + pc.outils.length + ' outils · ' + pc.livrables.length + ' livrables</p></div>', say: pc.titre + '. ' + pc.type + '.'},
    {html: '<div class="slh"><span class="sle">' + esc(pc.titre) + '</span><h2>Le métier en une diapositive</h2></div><div class="slb"><p class="slbig">' + esc(pc.intro) + '</p></div>', say: pc.intro},
    {html: '<div class="slh"><span class="sle">' + esc(pc.titre) + '</span><h2>Les compétences visées</h2></div><div class="slb"><div class="vcards">' + pc.comp.map((c, i) => '<div style="--i:' + i + ';--c:' + VPAL[i % 8] + '"><span class="vci">' + (i + 1) + '</span><b>' + esc(c[0]) + '</b><p>' + esc(c[1][2]) + '</p></div>').join('') + '</div></div>', say: 'Les compétences visées : ' + pc.comp.map(c => c[0]).join(', ') + '.'}]
    .concat(cut(L, 6).map((g, gi, G) => ({html: '<div class="slh"><span class="sle">' + esc(pc.titre) + '</span><h2>Le programme' + (G.length > 1 ? ' <small>' + (gi + 1) + '/' + G.length + '</small>' : '') + '</h2></div><div class="slb"><ol class="tl">' + g.map((l, j) => '<li style="--i:' + j + '"><span class="tln">' + (gi * 6 + j + 1) + '</span><div><b>' + esc(l.t) + '</b> <small>' + esc(l.d) + '</small></div></li>').join('') + '</ol></div>', say: 'Le programme : ' + g.map(l => l.t).join('. ') + '.'})))
    .concat([{html: '<div class="slh"><span class="sle">' + esc(pc.titre) + '</span><h2>Les outils et les livrables</h2></div><div class="slb"><div class="grid two"><div><h4>Pour pratiquer</h4><ul class="vul">' + pc.outils.map(([, lb], i) => '<li style="--i:' + i + '">' + esc(lb) + '</li>').join('') + '</ul></div><div><h4>À produire</h4><ul class="vul">' + pc.livrables.map(([n], i) => '<li style="--i:' + i + '">' + esc(n) + '</li>').join('') + '</ul></div></div></div>', say: 'Vous produirez : ' + pc.livrables.map(x => x[0]).join(', ') + '.'},
      {cls: 'fin', html: '<div class="slcover"><span class="sle">C\'est parti</span><h1>Commencer le parcours</h1><div class="slout"><a class="btn" href="#pcours--' + pc.id + '-' + L[0].id + '">Leçon 1 : ' + esc(L[0].t) + ' →</a></div></div>', say: 'C\'est parti. Commencez par la première leçon.'}]);
  return S;
}
function renderParcours(){
  const el = document.getElementById('pcRoot'); if (!el) return;
  const r = route(), sub = r.base === 'pcours' ? r.sub : null, D = pcDone();
  const pc = sub ? PCOURS[sub.split('-')[0]] : null;
  if (pc) {
    const lid = sub.includes('-') ? sub.split('-').slice(1).join('-') : null, L = pc.lecons, nDone = L.filter(l => D[lk(l)]).length, nAuto = pc.auto.filter((x, i) => D[pc.id + ':auto' + i]).length, pct = Math.round(100 * nDone / L.length);
    if (lid) {
      const i = L.findIndex(l => l.id === lid), l = L[i]; if (!l) { location.hash = 'pcours--' + pc.id; return; }
      const nv = l.b.filter(b => ['schema', 'kpi', 'cards', 'quiz'].includes(b[0])).length;
      el.innerHTML = '<p><a class="linkbtn" href="#pcours--' + pc.id + '">← ' + esc(pc.titre) + '</a></p><div class="lhero" style="--dc:' + pc.c + '"><div class="lhdeco" aria-hidden="true"><i></i><i></i><i></i></div><div class="lhnum">' + String(i + 1).padStart(2, '0') + '</div><div class="lhtxt"><span class="eyebrow">' + esc(pc.type) + ' · ' + esc(pc.titre) + '</span><h2>' + esc(l.t) + '</h2><div class="lhchips"><span>Leçon ' + (i + 1) + ' / ' + L.length + '</span><span>' + esc(l.d) + '</span>' + (nv ? '<span>' + nv + ' visuel' + (nv > 1 ? 's' : '') + ' interactif' + (nv > 1 ? 's' : '') + '</span>' : '') + (D[lk(l)] ? '<span class="okc">✓ Terminée</span>' : '') + '</div><div class="lhact"><button class="btn light" data-pc="dia">' + PLAYI + ' Regarder en diaporama</button><button class="btn ghost light2" data-pc="pdf" data-k="' + pc.id + '-' + l.id + '">Télécharger (PDF ou Word)</button></div></div><div class="lhprog"><i style="width:' + Math.round(100 * (i + 1) / L.length) + '%"></i></div></div><div class="pclesson" style="--dc:' + pc.c + '">' + l.b.map(pcBloc).join('') + '</div><div class="ctool"><button class="btn' + (D[lk(l)] ? ' ghost' : '') + '" data-pc="done" data-k="' + lk(l) + '">' + (D[lk(l)] ? '✓ Leçon terminée' : 'J\'ai compris : leçon terminée') + '</button></div><div class="nnav">' + (i > 0 ? '<a class="btn ghost" href="#pcours--' + pc.id + '-' + L[i - 1].id + '">← ' + esc(L[i - 1].t) + '</a>' : '<a class="btn ghost" href="#pcours--' + pc.id + '">← Le parcours</a>') + (i < L.length - 1 ? '<a class="btn ghost" href="#pcours--' + pc.id + '-' + L[i + 1].id + '">' + esc(L[i + 1].t) + ' →</a>' : '<a class="btn ghost" href="#pcours--' + pc.id + '">Retour au parcours →</a>') + '</div>';
      PCO.cur = pc; PCO.lec = i;
      return;
    }
    const casL = pc.cas.map(id => typeof casById === 'function' ? casById(id) : null).filter(Boolean);
    let h = '<p><a class="linkbtn" href="#pcours">← Tous les parcours</a></p><div class="pchero" style="--dc:' + pc.c + '"><div class="lhdeco" aria-hidden="true"><i></i><i></i><i></i></div><div class="lhtxt"><span class="eyebrow">' + esc(pc.type) + '</span><h2>' + esc(pc.titre) + '</h2><p>' + esc(pc.intro) + '</p><div class="lhact"><button class="btn light" data-pc="diapc">' + PLAYI + ' Présentation animée</button><a class="btn ghost light2" href="#pcours--' + pc.id + '-' + (L.find(l => !D[lk(l)]) || L[0]).id + '">' + (nDone ? 'Reprendre' : 'Commencer') + ' →</a></div></div>' + ring(pct) + '</div>';
    h += '<div class="kpis">' + [[nDone, '/ ' + L.length, 'leçons terminées'], [pc.outils.length, '', 'outils pratiques'], [pc.livrables.length, '', 'livrables à produire'], [nAuto, '/ ' + pc.auto.length, 'compétences validées']].map((x, i) => '<div style="--i:' + i + ';--c:' + VPAL[i] + '"><b data-cnt="' + x[0] + '">' + x[0] + '</b><em>' + x[1] + '</em><small>' + x[2] + '</small></div>').join('') + '</div>';
    h += '<h3>1. Les compétences visées</h3><div class="grid three">' + pc.comp.map(([n, N]) => '<div class="card"><h4>' + esc(n) + '</h4><ol class="niv">' + N.map((x, j) => '<li><span>Niveau ' + (j + 1) + '</span>' + esc(x) + '</li>').join('') + '</ol></div>').join('') + '</div>';
    h += '<h3>2. Les leçons, pas à pas</h3><ol class="pclist">' + L.map((l, j) => { const nv = l.b.filter(b => ['schema', 'kpi', 'cards', 'quiz'].includes(b[0])).length; return '<li><a href="#pcours--' + pc.id + '-' + l.id + '" class="' + (D[lk(l)] ? 'ok' : '') + '" style="--dc:' + pc.c + '"><span class="pcn">' + (D[lk(l)] ? '✓' : j + 1) + '</span><span><strong>' + esc(l.t) + '</strong><small>' + l.d + (nv ? ' · ' + nv + ' visuel' + (nv > 1 ? 's' : '') : '') + '</small></span></a></li>'; }).join('') + '</ol>';
    h += '<h3>3. Les outils pour pratiquer</h3><div class="ctool">' + pc.outils.map(([hr, lb]) => pcLien(hr, lb)).join('') + '</div>';
    h += '<h3>4. Les livrables et leurs modèles</h3><div class="tablewrap"><table><thead><tr><th>Livrable</th><th>Comment le produire</th></tr></thead><tbody>' + pc.livrables.map(([n, hr]) => '<tr><td><strong>' + esc(n) + '</strong></td><td>' + pcLien(hr, hr.startsWith('tpl:') ? 'Modèle Word ou PDF' : 'Ouvrir l\'outil') + '</td></tr>').join('') + '</tbody></table></div>';
    if (casL.length) h += '<h3>5. S\'entraîner sur un cas</h3><div class="ctool">' + casL.map(c => '<a class="btn ghost sm" href="#labo--' + c.id + '">Cas : ' + esc(c.titre) + ' →</a>').join('') + '</div>';
    h += '<h3>' + (casL.length ? 6 : 5) + '. Mon autoévaluation</h3><p class="prose">Cochez ce que vous savez faire. Soyez exigeant : pouvoir l\'expliquer à quelqu\'un et le refaire seul.</p><div class="mes">' + pc.auto.map((x, j) => '<label class="pub' + (D[pc.id + ':auto' + j] ? ' ok' : '') + '"><input type="checkbox" data-pc="auto" data-k="' + pc.id + ':auto' + j + '"' + (D[pc.id + ':auto' + j] ? ' checked' : '') + '><span>' + esc(x) + '</span></label>').join('') + '</div>';
    if (pc.metier) h += '<p><button class="btn ghost sm" data-pc="metier" data-k="' + pc.metier + '">Fiche métier →</button></p>';
    el.innerHTML = h; PCO.cur = pc; PCO.lec = null; return;
  }
  const P0 = Object.values(PCOURS), M = (P && P.metiers) || [], avec = new Set(P0.map(x => x.metier).filter(Boolean)), nL = Object.keys(LECS).length, nOk = Object.keys(LECS).filter(id => D['L:' + id]).length, nV = Object.values(LECS).reduce((s, l) => s + l.b.filter(b => ['schema', 'kpi', 'cards', 'quiz'].includes(b[0])).length, 0);
  let h = '<div class="eyebrow">APPRENDRE · PARCOURS</div><h2>Parcours métiers et formations</h2><p class="lead">Chaque parcours relie les compétences d\'un métier à des leçons pas à pas avec des exemples chiffrés, des schémas animés et un mode diaporama, aux outils pour pratiquer, aux modèles des livrables, à un cas d\'entraînement et à une autoévaluation. Objectif : être capable de faire le travail, pas seulement de le comprendre.</p>';
  h += '<div class="kpis">' + [[P0.length, '', 'parcours'], [nL, '', 'leçons'], [nV, '', 'schémas, chiffres clés et quiz'], [nOk, '/ ' + nL, 'leçons terminées']].map((x, i) => '<div style="--i:' + i + ';--c:' + VPAL[i] + '"><b data-cnt="' + x[0] + '">' + x[0] + '</b><em>' + x[1] + '</em><small>' + x[2] + '</small></div>').join('') + '</div>';
  h += '<h3>Les formations communes à tous les métiers</h3><div class="domgrid">' + P0.filter(x => !x.metier).map(pcCard).join('') + '</div>';
  h += '<h3>Les parcours métiers complets</h3><div class="domgrid">' + P0.filter(x => x.metier).map(pcCard).join('') + '</div>';
  const reste = M.filter(m => !avec.has(m.id));
  if (reste.length) h += '<h3>Les autres métiers</h3><p class="prose">Chaque fiche métier renvoie vers les contenus, les méthodes, les outils et les cas qui existent déjà.</p><div class="lgrid">' + reste.map(m => '<div class="card lcard"><h4>' + esc(m.titre) + '</h4><p class="note">' + esc(m.famille) + '</p><div class="lact"><button class="btn ghost sm" data-pc="metier" data-k="' + m.id + '">Fiche métier</button></div></div>').join('') + '</div>';
  el.innerHTML = h;
}
function pcCard(x){ const D = pcDone(), n = x.lecons.filter(l => D[lk(l)]).length, pct = Math.round(100 * n / x.lecons.length); return '<a class="domcard" href="#pcours--' + x.id + '" style="--dc:' + x.c + '"><span class="dnum">' + esc(x.type.toUpperCase()) + '</span><h4>' + esc(x.titre) + '</h4><p>' + esc(x.intro.slice(0, 150)) + '…</p><div class="rprog"><div><i style="width:' + pct + '%"></i></div><b>' + pct + ' %</b></div><span class="dmore">' + x.lecons.length + ' leçons · ' + x.outils.length + ' outils · ' + x.livrables.length + ' livrables</span></a>'; }
function lecHtml(pc, l){ return '<h1>' + esc(l.t) + '</h1><p style="text-align:center">' + esc(pc.titre) + ' · SERIKI BIBLE RSE</p>' + l.b.filter(b => b[0] !== 'outil').map(b => { const v = visExport(b); if (v != null) return v; return b[0] === 'h' ? '<h2>' + esc(b[1]) + '</h2>' : b[0] === 'ex' ? '<h3>' + esc(b[1]) + '</h3><p>' + esc(b[2]) + '</p>' : b[0] === 'tip' ? '<p><i>Bon à savoir : ' + esc(b[1]) + '</i></p>' : b[0] === 'tab' ? '<table border="1"><tr>' + b[1].map(x => '<th>' + esc(x) + '</th>').join('') + '</tr>' + b[2].map(r => '<tr>' + r.map(x => '<td>' + esc(x) + '</td>').join('') + '</tr>').join('') + '</table>' : b[0] === 'ol' ? '<ol>' + b[1].map(x => '<li>' + esc(x) + '</li>').join('') + '</ol>' : b[0] === 'ul' ? '<ul>' + b[1].map(x => '<li>' + esc(x) + '</li>').join('') + '</ul>' : '<p>' + esc(b[1]) + '</p>'; }).join(''); }
const pcRoot = document.getElementById('pcRoot');
function lancerDiaLecon(){ const pc = PCO.cur, i = PCO.lec; if (!pc || i == null) return; const L = pc.lecons, l = L[i]; DIA.onAct = null; diapo(lecSlides(pc, l, i, L), pc.c, l.t); DIA.onAct = (k, b) => { if (k === 'done') { const D = pcDone(); D[lk(l)] = true; pcSet(D); b.textContent = '✓ Leçon terminée'; toast('Leçon terminée'); renderParcours(); } else if (k === 'next' && L[i + 1]) { diaFermer(); location.hash = 'pcours--' + pc.id + '-' + L[i + 1].id; } }; }
pcRoot.addEventListener('click', e => {
  const b = e.target.closest('[data-pc]'); if (!b || b.tagName === 'INPUT') return; const a = b.dataset.pc, D = pcDone();
  if (a === 'done') { D[b.dataset.k] = !D[b.dataset.k]; pcSet(D); const y = window.scrollY; renderParcours(); window.scrollTo(0, y); if (D[b.dataset.k]) toast('Leçon terminée'); }
  else if (a === 'tpl') { const t = PTPL[b.dataset.k]; if (t) printHtml(t[1], t[0]); }
  else if (a === 'pdf') { const [pid, lid] = [b.dataset.k.split('-')[0], b.dataset.k.split('-').slice(1).join('-')], pc = PCOURS[pid], l = pc.lecons.find(x => x.id === lid); printHtml(lecHtml(pc, l), l.t); }
  else if (a === 'dia') lancerDiaLecon();
  else if (a === 'diapc' && PCO.cur) diapo(pcSlides(PCO.cur), PCO.cur.c, PCO.cur.titre);
  else if (a === 'metier') { P.openMetier = b.dataset.k; goTo('metiers'); }
});
document.addEventListener('click', e => { const b = e.target.closest('.dia [data-pc="tpl"]'); if (b) { const t = PTPL[b.dataset.k]; if (t) printHtml(t[1], t[0]); } });
pcRoot.addEventListener('change', e => { const t = e.target; if (t.dataset.pc === 'auto') { const D = pcDone(); D[t.dataset.k] = t.checked; pcSet(D); renderParcours(); } });
window.addEventListener('hashchange', () => { if (route().base === 'pcours') { renderParcours(); window.scrollTo(0, 0); } });
(typeof pReady !== 'undefined' ? pReady : Promise.resolve()).then(renderParcours, renderParcours);

/* =====================================================================
   ATELIERS MÉTIER : TRAJECTOIRE, SCOPE 3, FINANCE, FLUX, ÉCOCONCEPTION, AGEC
   ===================================================================== */
const AW = {d: null, tab: 'trajectoire'};
const FILIERES = ['Réemploi', 'Recyclage', 'Valorisation énergétique', 'Enfouissement ou élimination'];
const ECO_ETAPES = ['Matières', 'Fabrication', 'Distribution', 'Usage', 'Fin de vie'];
const ECO_LEV = {'Matières': ['Réduire la quantité de matière', 'Matière recyclée', 'Matière biosourcée ou renouvelable', 'Moins de matériaux différents', 'Supprimer les substances dangereuses'], 'Fabrication': ['Réduire l\'énergie consommée', 'Réduire les chutes et rebuts', 'Procédé plus propre', 'Énergie renouvelable'], 'Distribution': ['Produit plus compact ou plus léger', 'Moins d\'emballage', 'Emballage réutilisable', 'Transport moins émetteur'], 'Usage': ['Moins de consommation à l\'usage', 'Plus grande durabilité', 'Réparabilité, pièces détachées', 'Mises à jour plutôt que remplacement'], 'Fin de vie': ['Démontable', 'Monomatériau', 'Recyclable dans les filières existantes', 'Reprise ou consigne']};
const AGEC_Q = [
 ['emb', 'Vous mettez sur le marché des produits emballés (vente aux consommateurs ou aux professionnels)'],
 ['plast', 'Certains de vos emballages sont en plastique à usage unique'],
 ['rep', 'Vous fabriquez, importez ou vendez sous votre marque des produits d\'une filière REP (équipements électriques, meubles, textiles, jouets, articles de sport ou de bricolage, matériaux de construction…)'],
 ['inv', 'Vous avez des invendus de produits non alimentaires'],
 ['bio', 'Vous produisez des biodéchets (restauration, commerce alimentaire, espaces verts)'],
 ['chantier', 'Vous produisez des déchets de chantier'],
 ['conso', 'Vous vendez aux consommateurs des appareils électriques ou électroniques']];
async function awInit(){ try { AW.d = IDB.db && await IDB.get('kv', 'ateliers'); } catch(e) {} if (!AW.d) AW.d = {id: 'ateliers', traj: {an0: String(new Date().getFullYear() - 1), s12: '', s3: '', anC: '2030', taux12: '4.2', taux3: '2.5', lev: []}, s3f: [], fin: {taux: '6', proj: []}, flux: {entrees: [], dechets: []}, eco: [], agec: {}}; renderAteliers(); }
const awSave = () => IDB.put('kv', AW.d).catch(() => {});
const n0 = v => numK(v) || 0;
function trajCalc(){
  const t = AW.d.traj, a0 = +t.an0 || 2025, aC = +t.anC || 2030, s12 = n0(t.s12), s3 = n0(t.s3), r12 = n0(t.taux12) / 100, r3 = n0(t.taux3) / 100, Y = [];
  for (let y = a0; y <= aC; y++) { const k = y - a0, cible12 = Math.max(0, s12 * (1 - r12 * k)), cible3 = Math.max(0, s3 * (1 - r3 * k)), red = t.lev.filter(l => +l.an && +l.an <= y).reduce((s, l) => s + n0(l.t), 0); Y.push({y, cible: cible12 + cible3, plan: Math.max(0, s12 + s3 - red)}); }
  return Y;
}
function lineChart(Y){
  if (!Y.length) return ''; const W = 640, H = 260, L = 50, B = 30, max = Math.max(...Y.map(v => Math.max(v.cible, v.plan)), 1), X = i => L + i * (W - L - 20) / Math.max(1, Y.length - 1), Yp = v => H - B - v / max * (H - B - 20);
  const path = k => Y.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Yp(v[k]).toFixed(1)).join(' ');
  let g = [0, .25, .5, .75, 1].map(f => '<line x1="' + L + '" x2="' + (W - 20) + '" y1="' + Yp(max * f) + '" y2="' + Yp(max * f) + '" stroke="var(--line)"/><text x="' + (L - 6) + '" y="' + (Yp(max * f) + 4) + '" text-anchor="end" font-size="10.5" fill="currentColor">' + fmtK(Math.round(max * f)) + '</text>').join('');
  g += Y.map((v, i) => '<text x="' + X(i) + '" y="' + (H - 10) + '" text-anchor="middle" font-size="10.5" fill="currentColor">' + v.y + '</text>').join('');
  g += '<path d="' + path('cible') + '" fill="none" stroke="#0F5B3E" stroke-width="2.5" stroke-dasharray="6 4"/><path d="' + path('plan') + '" fill="none" stroke="#C2532A" stroke-width="3"/>';
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="awchart" role="img" aria-label="Trajectoire">' + g + '</svg><p class="note"><span style="color:#0F5B3E;font-weight:800">- - -</span> trajectoire cible · <span style="color:#C2532A;font-weight:800">——</span> émissions avec les leviers prévus</p>';
}
function van(inv, gain, n, taux){ let v = -inv; for (let t = 1; t <= n; t++) v += gain / Math.pow(1 + taux, t); return v; }
function tri(inv, gain, n){ if (gain <= 0 || n <= 0) return null; let lo = -0.99, hi = 10; for (let i = 0; i < 120; i++) { const m = (lo + hi) / 2; if (van(inv, gain, n, m) > 0) lo = m; else hi = m; } return (lo + hi) / 2; }
function finCalc(p, taux){ const inv = n0(p.inv), gain = n0(p.gain), n = n0(p.vie) || 10, t = n0(p.t); const v = van(inv, gain, n, taux), ann = inv * taux / (1 - Math.pow(1 + taux, -n)); return {inv, gain, n, t, van: v, tri: tri(inv, gain, n), retour: gain > 0 ? inv / gain : null, cout: t > 0 ? (ann - gain) / t : null}; }
function macc(P0, taux){
  const L = P0.map(p => Object.assign({nom: p.nom}, finCalc(p, taux))).filter(x => x.t > 0 && x.cout != null).sort((a, b) => a.cout - b.cout); if (!L.length) return '<p class="note">Ajoutez des actions avec des tonnes évitées pour voir la courbe.</p>';
  const W = 640, H = 240, L0 = 56, tot = L.reduce((s, x) => s + x.t, 0), mx = Math.sqrt(Math.max(...L.map(x => Math.abs(x.cout)), 1)), mid = H / 2, minW = 22, free = W - L0 - 10 - minW * L.length; let x = L0, cum = 0, g = '<line x1="' + L0 + '" x2="' + (W - 10) + '" y1="' + mid + '" y2="' + mid + '" stroke="currentColor"/>';
  L.forEach((a, i) => { const w = minW + Math.max(0, free) * a.t / tot, h = Math.max(3, Math.sqrt(Math.abs(a.cout)) / mx * (mid - 18)), y = a.cout < 0 ? mid : mid - h; cum += a.t; g += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + (w - 3).toFixed(1) + '" height="' + h.toFixed(1) + '" fill="' + (a.cout < 0 ? '#2E8B57' : '#C2532A') + '" rx="3"/><text x="' + (x + (w - 3) / 2).toFixed(1) + '" y="' + (a.cout < 0 ? mid - 6 : mid + 15) + '" text-anchor="middle" font-size="12" font-weight="800" fill="currentColor">' + (i + 1) + '</text>'; x += w; });
  g += '<text x="' + (L0 - 6) + '" y="20" text-anchor="end" font-size="10.5" fill="currentColor">coûte</text><text x="' + (L0 - 6) + '" y="' + (H - 8) + '" text-anchor="end" font-size="10.5" fill="currentColor">rapporte</text>';
  let c = 0;
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" class="awchart" role="img" aria-label="Courbe des coûts d\'abattement">' + g + '</svg><div class="tablewrap"><table><thead><tr><th>N°</th><th>Action</th><th>€ par tonne évitée</th><th>tCO₂e par an</th><th>Cumul</th></tr></thead><tbody>' + L.map((a, i) => { c += a.t; return '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + esc(a.nom) + '</td><td class="num" style="color:' + (a.cout < 0 ? 'var(--accent)' : 'var(--danger)') + '">' + fmtK(Math.round(a.cout)) + ' €</td><td class="num">' + fmtK(Math.round(a.t)) + '</td><td class="num">' + fmtK(Math.round(c)) + ' t</td></tr>'; }).join('') + '</tbody></table></div><p class="note">Les actions sont classées de la moins chère à la plus chère. Largeur : tonnes évitées par an ; hauteur : coût par tonne (vert, l\'action rapporte de l\'argent ; orange, elle coûte). On lance d\'abord les actions vertes, puis on avance vers la droite jusqu\'à atteindre l\'objectif de réduction.</p>';
}

function fluxCalc(){ const F = AW.d.flux, ent = F.entrees.reduce((s, x) => s + n0(x.t), 0), cEnt = F.entrees.reduce((s, x) => s + n0(x.c), 0), dech = F.dechets.reduce((s, x) => s + n0(x.t), 0), val = F.dechets.filter(x => x.f === 'Réemploi' || x.f === 'Recyclage').reduce((s, x) => s + n0(x.t), 0), cD = F.dechets.reduce((s, x) => s + n0(x.c), 0), perte = ent ? dech / ent : null, cMat = ent ? cEnt / ent * dech : 0; return {ent, cEnt, dech, val, taux: dech ? val / dech : null, cD, perte, cMat}; }
function agecRes(){
  const A = AW.d.agec, L = [];
  L.push(['Pour toutes les entreprises', 'Tri à la source du papier et carton, du métal, du plastique, du verre, du bois et des textiles, avec un prestataire qui en assure la valorisation ; tri des biodéchets depuis le 1er janvier 2024 si vous en produisez ; conservation des attestations de valorisation.']);
  if (A.emb) L.push(['Emballages : REP et règlement européen', 'Adhérer à l\'éco-organisme de la filière emballages (ménagers et, depuis 2025, professionnels) et déclarer les quantités mises sur le marché. Depuis le 12 août 2026, le règlement (UE) 2025/40 impose une déclaration de conformité et une documentation technique pour chaque emballage, des emballages recyclables et des restrictions de substances. Afficher les consignes de tri sur les emballages ménagers.']);
  if (A.plast) L.push(['Plastique à usage unique', 'Objectifs nationaux de réduction, de réemploi et de recyclage fixés tous les cinq ans (décret « 3R ») et fin des emballages en plastique à usage unique visée pour 2040 : faire l\'inventaire, réduire, passer au vrac ou au réemploi quand c\'est possible.']);
  if (A.rep) L.push(['Responsabilité élargie du producteur', 'Adhérer à l\'éco-organisme de chaque filière concernée, déclarer les quantités, payer l\'éco-contribution (modulée selon l\'écoconception), afficher le logo Triman et les consignes de tri.']);
  if (A.inv) L.push(['Invendus non alimentaires', 'Interdiction de les détruire : don (notamment aux associations), réemploi ou recyclage. Le don peut ouvrir droit à une réduction d\'impôt.']);
  if (A.bio) L.push(['Biodéchets', 'Tri à la source obligatoire quel que soit le volume : compostage sur place ou collecte séparée vers le compostage ou la méthanisation.']);
  if (A.chantier) L.push(['Déchets de chantier', 'Tri en plus de la fraction minérale et du plâtre ; reprise gratuite des déchets du bâtiment triés dans le cadre de la filière REP des produits et matériaux de construction.']);
  if (A.conso) L.push(['Information du consommateur', 'Indice de réparabilité ou indice de durabilité selon les catégories d\'appareils, disponibilité des pièces détachées, information sur les qualités et caractéristiques environnementales.']);
  return L;
}
function renderAteliers(){
  const el = document.getElementById('awRoot'); if (!el || !AW.d) return;
  const sub = route().base === 'ateliers' ? route().sub : null; if (sub && ['trajectoire', 'scope3', 'finance', 'flux', 'ecoconception', 'agec'].includes(sub)) AW.tab = sub;
  const d = AW.d;
  let h = '<div class="eyebrow">AGIR · ATELIERS MÉTIER</div><h2>Ateliers climat et ressources</h2><p class="lead">Les outils pour produire les livrables des métiers de la décarbonation et de l\'économie circulaire : trajectoire de réduction, engagement des fournisseurs, rentabilité et coût par tonne évitée, diagnostic des flux, fiche d\'écoconception, obligations AGEC et emballages. Chaque outil a un exemple et s\'exporte.</p>';
  h += '<div class="ptabs">' + [['trajectoire', 'Trajectoire', 'Cible et chemin', ICO.chart], ['scope3', 'Scope 3 fournisseurs', d.s3f.length + ' fournisseur' + (d.s3f.length > 1 ? 's' : ''), ICO.flag], ['finance', 'Rentabilité', 'VAN, TRI, coût par tonne', ICO.bag], ['flux', 'Diagnostic des flux', 'Matières et déchets', ICO.radar], ['ecoconception', 'Écoconception', d.eco.length + ' fiche' + (d.eco.length > 1 ? 's' : ''), ICO.tool], ['agec', 'AGEC et emballages', 'Mes obligations', ICO.doc]].map(([k, t, s, ic]) => '<a class="ptab' + (AW.tab === k ? ' on' : '') + '" href="#ateliers--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (AW.tab === 'trajectoire') {
    const t = d.traj, Y = trajCalc(), last = Y[Y.length - 1] || {}, ecart = last.plan != null ? last.plan - last.cible : 0;
    h += '<div class="card"><h4>1. Point de départ et cible</h4><div class="awgrid">' + [['an0', 'Année de référence'], ['s12', 'Scopes 1 et 2 (tCO₂e)'], ['s3', 'Scope 3 (tCO₂e)'], ['anC', 'Année cible'], ['taux12', 'Baisse par an, scopes 1 et 2 (%)'], ['taux3', 'Baisse par an, scope 3 (%)']].map(([k, l]) => '<label>' + l + '<input class="inp" data-tr="' + k + '" value="' + esc(t[k]) + '" inputmode="decimal"></label>').join('') + '</div><p class="note">Repères SBTi pour 1,5 °C : 4,2 % par an sur les scopes 1 et 2 ; au moins 2,5 % par an sur le scope 3 (à vérifier sur le site de la SBTi, les standards évoluent).</p></div>';
    h += '<div class="card"><h4>2. Les leviers prévus</h4>' + (t.lev.length ? '<div class="tablewrap"><table><thead><tr><th>Levier</th><th>tCO₂e évitées par an</th><th>Année de mise en œuvre</th><th></th></tr></thead><tbody>' + t.lev.map((l, i) => '<tr><td><input class="kin" data-trl="' + i + '" data-k="nom" value="' + esc(l.nom) + '"></td><td><input class="kin" data-trl="' + i + '" data-k="t" value="' + esc(l.t) + '"></td><td><input class="kin" data-trl="' + i + '" data-k="an" value="' + esc(l.an) + '"></td><td><button class="linkbtn" style="color:var(--danger)" data-aw="deltl" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost sm" data-aw="addtl">+ Levier</button>' + (!t.s12 ? '<button class="btn ghost sm" data-aw="demot">Charger un exemple</button>' : '') + '</div></div>';
    if (Y.length && (n0(t.s12) + n0(t.s3)) > 0) h += '<div class="card"><h4>3. Résultat</h4>' + lineChart(Y) + '<div class="scres"><div><b>' + fmtK(Math.round(n0(t.s12) + n0(t.s3))) + ' t</b><small>émissions ' + t.an0 + '</small></div><div><b>' + fmtK(Math.round(last.cible)) + ' t</b><small>cible ' + t.anC + '</small></div><div><b>' + fmtK(Math.round(last.plan)) + ' t</b><small>avec les leviers</small></div><div><b style="color:' + (ecart > 0 ? 'var(--danger)' : 'var(--accent)') + '">' + (ecart > 0 ? '+' + fmtK(Math.round(ecart)) + ' t' : 'Cible atteinte') + '</b><small>' + (ecart > 0 ? 'écart à combler' : 'avec ' + fmtK(Math.round(-ecart)) + ' t de marge') + '</small></div></div><div class="ctool"><button class="btn" data-aw="xlsxt">Exporter (Excel)</button><button class="btn ghost" data-aw="doct">Synthèse (PDF ou Word)</button></div></div>';
  } else if (AW.tab === 'scope3') {
    const tot = d.s3f.reduce((s, f) => s + n0(f.m) * n0(f.fe) / 1000, 0), L = d.s3f.map((f, i) => Object.assign({i, e: n0(f.m) * n0(f.fe) / 1000}, f)).sort((a, b) => b.e - a.e); let cum = 0;
    const ST = ['Non contacté', 'Contacté', 'Données reçues', 'Cible fixée', 'Plan en cours'];
    h += '<p class="prose">Estimez les émissions de chaque fournisseur (montant d\'achats × facteur monétaire en kgCO₂e par euro, à prendre dans la Base Empreinte pour la catégorie d\'achat), classez-les et suivez leur engagement. La colonne « cumul » montre les fournisseurs qui font 80 % du total : ce sont vos priorités.</p><div class="ctool"><button class="btn" data-aw="adds3">+ Fournisseur</button>' + (d.s3f.length ? '<button class="btn ghost" data-aw="xlsxs3">Exporter (Excel)</button>' : '<button class="btn ghost" data-aw="demos3">Charger un exemple</button>') + '</div>';
    if (L.length) h += '<div class="tablewrap"><table><thead><tr><th>Fournisseur</th><th>Catégorie</th><th>Achats (€)</th><th>Facteur (kgCO₂e/€)</th><th>tCO₂e estimées</th><th>Cumul</th><th>Engagement</th><th></th></tr></thead><tbody>' + L.map(f => { cum += f.e; const pc = tot ? cum / tot : 0; return '<tr' + (pc - f.e / tot < .8 ? ' class="prio"' : '') + '><td><strong>' + esc(f.nom) + '</strong></td><td>' + esc(f.cat || '') + '</td><td class="num">' + fmtK(n0(f.m)) + '</td><td class="num">' + vf(n0(f.fe)) + '</td><td class="num"><strong>' + fmtK(Math.round(f.e)) + '</strong></td><td class="num">' + Math.round(pc * 100) + ' %</td><td><select class="kin" data-s3st="' + f.i + '">' + ST.map(s => '<option' + (f.st === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td><button class="linkbtn" style="color:var(--danger)" data-aw="dels3" data-i="' + f.i + '" aria-label="Supprimer">✕</button></td></tr>'; }).join('') + '</tbody></table></div><div class="scres"><div><b>' + fmtK(Math.round(tot)) + ' t</b><small>scope 3 achats estimé</small></div><div><b>' + L.filter(f => f.st && f.st !== 'Non contacté').length + ' / ' + L.length + '</b><small>fournisseurs engagés</small></div><div><b>' + L.filter(f => f.st === 'Cible fixée' || f.st === 'Plan en cours').length + '</b><small>avec une cible</small></div></div>';
  } else if (AW.tab === 'finance') {
    const taux = n0(d.fin.taux) / 100;
    h += '<p class="prose">Pour chaque action : l\'investissement, le gain annuel net (économies moins coûts supplémentaires), la durée de vie et les tonnes de CO₂e évitées par an. L\'outil calcule le temps de retour, la valeur actuelle nette (VAN), le taux de rendement interne (TRI) et le coût par tonne évitée.</p><div class="card"><label class="awinline">Taux d\'actualisation (%)<input class="inp" data-fin="taux" value="' + esc(d.fin.taux) + '"></label></div>';
    h += (d.fin.proj.length ? '<div class="tablewrap"><table class="awfin"><thead><tr><th>Action</th><th>Investissement (€)</th><th>Gain net / an (€)</th><th>Durée (ans)</th><th>tCO₂e / an</th><th>Retour</th><th>VAN</th><th>TRI</th><th>€ par tonne</th><th></th></tr></thead><tbody>' + d.fin.proj.map((p, i) => { const r = finCalc(p, taux); return '<tr>' + ['nom', 'inv', 'gain', 'vie', 't'].map(k => '<td><input class="kin" data-fp="' + i + '" data-k="' + k + '" value="' + esc(p[k] || '') + '"></td>').join('') + '<td class="num">' + (r.retour == null ? '–' : vf(Math.round(r.retour * 10) / 10) + ' ans') + '</td><td class="num" style="color:' + (r.van >= 0 ? 'var(--accent)' : 'var(--danger)') + '">' + fmtK(Math.round(r.van)) + ' €</td><td class="num">' + (r.tri == null ? '–' : vf(Math.round(r.tri * 1000) / 10) + ' %') + '</td><td class="num">' + (r.cout == null ? '–' : fmtK(Math.round(r.cout)) + ' €') + '</td><td><button class="linkbtn" style="color:var(--danger)" data-aw="delfp" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>'; }).join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost" data-aw="addfp">+ Action</button>' + (d.fin.proj.length ? '<button class="btn ghost" data-aw="xlsxf">Exporter (Excel)</button>' : '<button class="btn ghost" data-aw="demof">Charger un exemple</button>') + '</div>';
    if (d.fin.proj.length) h += '<div class="card"><h4>Courbe des coûts d\'abattement</h4>' + macc(d.fin.proj, taux) + '</div>';
  } else if (AW.tab === 'flux') {
    const F = d.flux, s = fluxCalc();
    h += '<p class="prose">Saisissez les matières qui entrent (sur un an) et les déchets qui sortent, avec leur filière et leur coût d\'enlèvement. L\'outil calcule le taux de perte matière, le taux de valorisation et le coût caché des déchets (matière achetée puis jetée).</p>';
    h += '<div class="grid two"><div class="card"><h4>Entrées de matières</h4>' + (F.entrees.length ? '<div class="tablewrap"><table><thead><tr><th>Matière</th><th>Tonnes / an</th><th>Coût d\'achat (€)</th><th></th></tr></thead><tbody>' + F.entrees.map((x, i) => '<tr>' + ['nom', 't', 'c'].map(k => '<td><input class="kin" data-fe="' + i + '" data-k="' + k + '" value="' + esc(x[k] || '') + '"></td>').join('') + '<td><button class="linkbtn" style="color:var(--danger)" data-aw="delfe" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<button class="btn ghost sm" data-aw="addfe">+ Matière</button></div>'
      + '<div class="card"><h4>Déchets</h4>' + (F.dechets.length ? '<div class="tablewrap"><table><thead><tr><th>Déchet</th><th>Tonnes / an</th><th>Filière</th><th>Coût d\'enlèvement (€)</th><th></th></tr></thead><tbody>' + F.dechets.map((x, i) => '<tr><td><input class="kin" data-fd="' + i + '" data-k="nom" value="' + esc(x.nom || '') + '"></td><td><input class="kin" data-fd="' + i + '" data-k="t" value="' + esc(x.t || '') + '"></td><td><select class="kin" data-fd="' + i + '" data-k="f">' + FILIERES.map(f => '<option' + (x.f === f ? ' selected' : '') + '>' + f + '</option>').join('') + '</select></td><td><input class="kin" data-fd="' + i + '" data-k="c" value="' + esc(x.c || '') + '"></td><td><button class="linkbtn" style="color:var(--danger)" data-aw="delfd" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<button class="btn ghost sm" data-aw="addfd">+ Déchet</button></div></div>';
    if (!F.entrees.length && !F.dechets.length) h += '<div class="ctool"><button class="btn ghost" data-aw="demofl">Charger l\'exemple de la menuiserie</button></div>';
    if (s.dech) h += '<div class="card"><h4>Résultats</h4><div class="scres"><div><b>' + fmtK(Math.round(s.dech)) + ' t</b><small>déchets par an</small></div><div><b>' + (s.perte == null ? '–' : vf(Math.round(s.perte * 1000) / 10) + ' %') + '</b><small>taux de perte matière</small></div><div><b>' + (s.taux == null ? '–' : vf(Math.round(s.taux * 1000) / 10) + ' %') + '</b><small>réemployés ou recyclés</small></div><div><b>' + fmtK(Math.round(s.cD)) + ' €</b><small>coût d\'enlèvement</small></div><div><b>' + fmtK(Math.round(s.cMat)) + ' €</b><small>matière achetée puis jetée (estimation)</small></div></div><h4 style="margin-top:16px">Répartition par filière</h4><div class="filbar">' + FILIERES.map((f, i) => { const tt = F.dechets.filter(x => x.f === f).reduce((a, x) => a + n0(x.t), 0), p = tt / s.dech * 100; return p ? '<span style="width:' + p + '%;background:' + ['#2E8B57', '#3FA37A', '#E0A84F', '#C2532A'][i] + '" title="' + f + ' : ' + Math.round(p) + ' %">' + (p > 12 ? Math.round(p) + ' %' : '') + '</span>' : ''; }).join('') + '</div><p class="note">' + FILIERES.map((f, i) => '<span style="color:' + ['#2E8B57', '#3FA37A', '#B07A1E', '#C2532A'][i] + ';font-weight:700">■</span> ' + f).join(' · ') + '</p><h4>Priorités suggérées</h4><ol>' + F.dechets.slice().sort((a, b) => n0(b.t) - n0(a.t)).slice(0, 3).map(x => '<li><strong>' + esc(x.nom) + '</strong> (' + fmtK(n0(x.t)) + ' t, ' + esc(x.f) + ') : ' + (x.f === 'Enfouissement ou élimination' ? 'chercher d\'abord une filière de recyclage ou de valorisation, puis réduire à la source.' : x.f === 'Valorisation énergétique' ? 'viser le recyclage ou le réemploi, et réduire à la source.' : 'réduire à la source : c\'est de la matière achetée.') + '</li>').join('') + '</ol><div class="ctool"><button class="btn" data-aw="xlsxfl">Exporter le diagnostic (Excel)</button><button class="btn ghost" data-aw="docfl">Synthèse (PDF ou Word)</button><a class="btn ghost" href="#pcours--circulaire-c7">Construire le plan d\'économie circulaire →</a></div></div>';
  } else if (AW.tab === 'ecoconception') {
    h += '<p class="prose">Une fiche par produit ou service : sa fonction, l\'impact estimé de chaque étape du cycle de vie (de 1 faible à 5 fort), les leviers retenus et les résultats. Elle se télécharge pour être partagée avec le bureau d\'études, les achats et le marketing.</p><div class="ctool"><button class="btn" data-aw="addeco">+ Nouvelle fiche</button>' + (d.eco.length ? '' : '<button class="btn ghost" data-aw="demoeco">Charger un exemple</button>') + '</div>';
    h += d.eco.map((f, i) => '<div class="card ecof"><div class="awgrid"><label>Produit ou service<input class="inp" data-eco="' + i + '" data-k="nom" value="' + esc(f.nom) + '"></label><label>Unité fonctionnelle<input class="inp" data-eco="' + i + '" data-k="uf" value="' + esc(f.uf || '') + '" placeholder="Ex. : contenir 75 cl d\'eau pendant 5 ans"></label></div><div class="tablewrap"><table><thead><tr><th>Étape</th><th>Impact (1 à 5)</th><th>Leviers retenus</th><th>Résultat attendu</th></tr></thead><tbody>' + ECO_ETAPES.map(et => { const x = (f.et || {})[et] || {}; return '<tr><td><strong>' + et + '</strong></td><td><select class="kin" data-eco="' + i + '" data-et="' + et + '" data-k="imp">' + ['', 1, 2, 3, 4, 5].map(v => '<option' + (String(x.imp || '') === String(v) ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></td><td><div class="ecolev">' + ECO_LEV[et].map(lv => '<label><input type="checkbox" data-eco="' + i + '" data-et="' + et + '" data-lev="' + esc(lv) + '"' + ((x.lev || []).includes(lv) ? ' checked' : '') + '> ' + esc(lv) + '</label>').join('') + '</div></td><td><input class="kin" data-eco="' + i + '" data-et="' + et + '" data-k="res" value="' + esc(x.res || '') + '"></td></tr>'; }).join('') + '</tbody></table></div><div class="ctool"><button class="btn ghost sm" data-aw="doceco" data-i="' + i + '">Télécharger la fiche</button><button class="btn ghost sm" style="color:var(--danger)" data-aw="deleco" data-i="' + i + '">Supprimer</button></div></div>').join('');
  } else {
    const R = agecRes();
    h += '<div class="card"><h4>Votre situation</h4><div class="mes">' + AGEC_Q.map(([k, q]) => '<label class="pub' + (d.agec[k] ? ' ok' : '') + '"><input type="checkbox" data-agec="' + k + '"' + (d.agec[k] ? ' checked' : '') + '><span>' + esc(q) + '</span></label>').join('') + '</div></div><h3>Vos obligations</h3><div class="obl">' + R.map(([t, x]) => '<div class="oblc oui"><h4>' + esc(t) + '</h4><p>' + esc(x) + '</p></div>').join('') + '</div><p class="note">Synthèse indicative au 1er novembre 2026. Les règles évoluent et dépendent de l\'activité : vérifiez le texte en vigueur, les décrets d\'application et vos filières auprès de vos éco-organismes.</p><div class="ctool"><button class="btn" data-aw="docagec">Télécharger la synthèse</button><a class="btn ghost" href="#pcours--circulaire-c2">Leçon : les obligations en détail →</a></div>';
  }
  h += '<p class="foot">Vos données restent sur cet appareil. Calculs indicatifs, à valider avec vos données réelles et, si besoin, un expert.</p>';
  el.innerHTML = h;
}
const awRoot = document.getElementById('awRoot');
awRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-aw]'); if (!b || b.tagName === 'INPUT') return; const a = b.dataset.aw, d = AW.d, re = async () => { await awSave(); const y = window.scrollY; renderAteliers(); window.scrollTo(0, y); };
  try {
    if (a === 'addtl') { d.traj.lev.push({nom: '', t: '', an: ''}); await re(); }
    else if (a === 'deltl') { d.traj.lev.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demot') { d.traj = {an0: '2025', s12: '500', s3: '4600', anC: '2030', taux12: '4.2', taux3: '2.5', lev: [{nom: 'Réglage du chauffage', t: '20', an: '2026'}, {nom: 'Électricité renouvelable', t: '60', an: '2026'}, {nom: 'Pompe à chaleur', t: '180', an: '2027'}, {nom: 'Acier à 40 % recyclé', t: '900', an: '2028'}]}; await re(); }
    else if (a === 'xlsxt') await atXlsx('Trajectoire de reduction', [['Trajectoire', trajCalc().map(v => ({Année: v.y, 'Cible (tCO2e)': Math.round(v.cible), 'Avec les leviers (tCO2e)': Math.round(v.plan)}))], ['Leviers', d.traj.lev.map(l => ({Levier: l.nom, 'tCO2e évitées par an': n0(l.t), Année: l.an}))]]);
    else if (a === 'doct') { const Y = trajCalc(), t = d.traj, l = Y[Y.length - 1]; printHtml('<h1>Trajectoire de réduction des émissions</h1><p style="text-align:center">Référence ' + esc(t.an0) + ' · Cible ' + esc(t.anC) + '</p><h2>Point de départ</h2><p>Scopes 1 et 2 : ' + fmtK(n0(t.s12)) + ' tCO₂e. Scope 3 : ' + fmtK(n0(t.s3)) + ' tCO₂e.</p><h2>Cible</h2><p>Baisse de ' + vf(n0(t.taux12)) + ' % par an sur les scopes 1 et 2 et de ' + vf(n0(t.taux3)) + ' % par an sur le scope 3, soit ' + fmtK(Math.round(l.cible)) + ' tCO₂e en ' + esc(t.anC) + '.</p><h2>Leviers</h2><table border="1"><tr><th>Levier</th><th>tCO₂e évitées par an</th><th>Année</th></tr>' + t.lev.map(x => '<tr><td>' + esc(x.nom) + '</td><td>' + esc(x.t) + '</td><td>' + esc(x.an) + '</td></tr>').join('') + '</table><h2>Trajectoire année par année</h2><table border="1"><tr><th>Année</th><th>Cible</th><th>Avec les leviers</th></tr>' + Y.map(v => '<tr><td>' + v.y + '</td><td>' + fmtK(Math.round(v.cible)) + '</td><td>' + fmtK(Math.round(v.plan)) + '</td></tr>').join('') + '</table><h2>Écart</h2><p>' + (l.plan > l.cible ? 'Il manque ' + fmtK(Math.round(l.plan - l.cible)) + ' tCO₂e pour atteindre la cible : de nouveaux leviers sont nécessaires.' : 'Les leviers prévus permettent d\'atteindre la cible.') + '</p>', 'Trajectoire de réduction'); }
    else if (a === 'adds3') modal('Ajouter un fournisseur', '<div class="row"><label>Nom<input class="inp" id="s3n"></label></div><div class="row"><label>Catégorie d\'achat<input class="inp" id="s3c" placeholder="Ex. : acier, transport, services informatiques"></label></div><div class="grid" style="grid-template-columns:1fr 1fr;gap:0 12px"><div class="row"><label>Achats annuels (€ HT)<input class="inp" id="s3m" inputmode="decimal"></label></div><div class="row"><label>Facteur (kgCO₂e par €)<input class="inp" id="s3f" inputmode="decimal" placeholder="Base Empreinte"></label></div></div>', 'Ajouter', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('s3n')) return false; d.s3f.push({nom: v('s3n'), cat: v('s3c'), m: v('s3m'), fe: v('s3f'), st: 'Non contacté'}); await re(); });
    else if (a === 'dels3') { d.s3f.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demos3') { d.s3f = [['Aciérie A', 'Acier', 1800000, 1.2, 'Données reçues'], ['Transports B', 'Transport routier', 420000, 0.9, 'Contacté'], ['Peintures C', 'Chimie', 260000, 0.8, 'Non contacté'], ['Emballages D', 'Carton', 150000, 0.6, 'Cible fixée'], ['Informatique E', 'Services informatiques', 120000, 0.15, 'Non contacté'], ['Nettoyage F', 'Services', 60000, 0.1, 'Non contacté']].map(([nom, cat, m, fe, st]) => ({nom, cat, m: String(m), fe: String(fe), st})); await re(); toast('Facteurs d\'exemple : prenez les vôtres dans la Base Empreinte'); }
    else if (a === 'xlsxs3') await atXlsx('Engagement fournisseurs scope 3', [['Fournisseurs', d.s3f.map(f => ({Fournisseur: f.nom, Catégorie: f.cat, 'Achats (€)': n0(f.m), 'Facteur (kgCO2e/€)': n0(f.fe), 'tCO2e estimées': Math.round(n0(f.m) * n0(f.fe) / 1000), Engagement: f.st}))]]);
    else if (a === 'addfp') { d.fin.proj.push({nom: '', inv: '', gain: '', vie: '10', t: ''}); await re(); }
    else if (a === 'delfp') { d.fin.proj.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demof') { d.fin.proj = [['Réglage du chauffage', 5000, 8000, 10, 20], ['Éclairage LED', 40000, 12000, 15, 6], ['Pompe à chaleur', 350000, 25000, 20, 180], ['Panneaux solaires', 120000, 6000, 25, 8], ['Véhicules électriques', 450000, 35000, 8, 150]].map(([nom, inv, gain, vie, t]) => ({nom, inv: String(inv), gain: String(gain), vie: String(vie), t: String(t)})); await re(); }
    else if (a === 'xlsxf') { const taux = n0(d.fin.taux) / 100; await atXlsx('Rentabilite des actions', [['Actions', d.fin.proj.map(p => { const r = finCalc(p, taux); return {Action: p.nom, 'Investissement (€)': r.inv, 'Gain net annuel (€)': r.gain, 'Durée (ans)': r.n, 'tCO2e par an': r.t, 'Temps de retour (ans)': r.retour == null ? '' : Math.round(r.retour * 10) / 10, 'VAN (€)': Math.round(r.van), 'TRI (%)': r.tri == null ? '' : Math.round(r.tri * 1000) / 10, '€ par tonne évitée': r.cout == null ? '' : Math.round(r.cout)}; })]]); }
    else if (a === 'addfe') { d.flux.entrees.push({nom: '', t: '', c: ''}); await re(); }
    else if (a === 'delfe') { d.flux.entrees.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'addfd') { d.flux.dechets.push({nom: '', t: '', f: 'Recyclage', c: ''}); await re(); }
    else if (a === 'delfd') { d.flux.dechets.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demofl') { d.flux = {entrees: [{nom: 'Bois massif et panneaux', t: '820', c: '410000'}, {nom: 'Vernis et colles', t: '18', c: '54000'}, {nom: 'Emballages reçus', t: '14', c: '0'}], dechets: [{nom: 'Chutes et sciures', t: '190', f: 'Valorisation énergétique', c: '9000'}, {nom: 'Palettes et emballages', t: '14', f: 'Recyclage', c: '2500'}, {nom: 'Déchets dangereux (vernis)', t: '6', f: 'Enfouissement ou élimination', c: '6500'}, {nom: 'Déchets en mélange', t: '9', f: 'Enfouissement ou élimination', c: '3000'}]}; await re(); }
    else if (a === 'xlsxfl') await atXlsx('Diagnostic des flux', [['Entrées', d.flux.entrees.map(x => ({Matière: x.nom, 'Tonnes par an': n0(x.t), 'Coût (€)': n0(x.c)}))], ['Déchets', d.flux.dechets.map(x => ({Déchet: x.nom, 'Tonnes par an': n0(x.t), Filière: x.f, 'Coût d\'enlèvement (€)': n0(x.c)}))], ['Indicateurs', (s => [{Indicateur: 'Déchets (t)', Valeur: s.dech}, {Indicateur: 'Taux de perte matière (%)', Valeur: s.perte == null ? '' : Math.round(s.perte * 1000) / 10}, {Indicateur: 'Taux de réemploi et recyclage (%)', Valeur: s.taux == null ? '' : Math.round(s.taux * 1000) / 10}, {Indicateur: 'Coût d\'enlèvement (€)', Valeur: s.cD}, {Indicateur: 'Matière achetée puis jetée (€, estimation)', Valeur: Math.round(s.cMat)}])(fluxCalc())]]);
    else if (a === 'docfl') { const s = fluxCalc(); printHtml('<h1>Diagnostic des flux de matières et de déchets</h1><p style="text-align:center">' + new Date().toLocaleDateString('fr-FR') + '</p><h2>Entrées</h2><table border="1"><tr><th>Matière</th><th>Tonnes</th><th>Coût (€)</th></tr>' + d.flux.entrees.map(x => '<tr><td>' + esc(x.nom) + '</td><td>' + esc(x.t) + '</td><td>' + esc(x.c) + '</td></tr>').join('') + '</table><h2>Déchets</h2><table border="1"><tr><th>Déchet</th><th>Tonnes</th><th>Filière</th><th>Coût (€)</th></tr>' + d.flux.dechets.map(x => '<tr><td>' + esc(x.nom) + '</td><td>' + esc(x.t) + '</td><td>' + esc(x.f) + '</td><td>' + esc(x.c) + '</td></tr>').join('') + '</table><h2>Indicateurs</h2><ul><li>Déchets : ' + fmtK(Math.round(s.dech)) + ' t par an</li><li>Taux de perte matière : ' + (s.perte == null ? '–' : vf(Math.round(s.perte * 1000) / 10) + ' %') + '</li><li>Taux de réemploi et recyclage : ' + (s.taux == null ? '–' : vf(Math.round(s.taux * 1000) / 10) + ' %') + '</li><li>Coût d\'enlèvement : ' + fmtK(s.cD) + ' €</li><li>Matière achetée puis jetée : environ ' + fmtK(Math.round(s.cMat)) + ' €</li></ul>', 'Diagnostic des flux'); }
    else if (a === 'addeco') { d.eco.push({nom: 'Nouveau produit', uf: '', et: {}}); await re(); }
    else if (a === 'deleco') { d.eco.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demoeco') { d.eco.push({nom: 'Gourde en aluminium 75 cl', uf: 'Contenir 75 cl de boisson, 5 ans d\'usage', et: {'Matières': {imp: '5', lev: ['Matière recyclée'], res: 'Aluminium 100 % recyclé'}, 'Fabrication': {imp: '3', lev: ['Réduire l\'énergie consommée'], res: ''}, 'Distribution': {imp: '2', lev: ['Moins d\'emballage'], res: 'Suppression de l\'étui carton'}, 'Usage': {imp: '1', lev: ['Réparabilité, pièces détachées'], res: 'Bouchon remplaçable vendu à part'}, 'Fin de vie': {imp: '2', lev: ['Monomatériau', 'Recyclable dans les filières existantes'], res: ''}}}); await re(); }
    else if (a === 'doceco') { const f = d.eco[+b.dataset.i]; printHtml('<h1>Fiche d\'écoconception : ' + esc(f.nom) + '</h1><p style="text-align:center">Unité fonctionnelle : ' + esc(f.uf || '[à définir]') + '</p><table border="1"><tr><th>Étape</th><th>Impact (1 à 5)</th><th>Leviers retenus</th><th>Résultat attendu</th></tr>' + ECO_ETAPES.map(et => { const x = (f.et || {})[et] || {}; return '<tr><td>' + et + '</td><td>' + esc(x.imp || '') + '</td><td>' + esc((x.lev || []).join(', ')) + '</td><td>' + esc(x.res || '') + '</td></tr>'; }).join('') + '</table><h2>Étape prioritaire</h2><p>' + (ECO_ETAPES.slice().sort((a2, b2) => n0(((f.et || {})[b2] || {}).imp) - n0(((f.et || {})[a2] || {}).imp))[0]) + '</p><h2>Points de vigilance</h2><p>Vérifier l\'absence de transfert d\'impact d\'une étape à l\'autre ; comparer l\'ancienne et la nouvelle version avec les mêmes indicateurs ; ne communiquer que sur des gains prouvés.</p>', 'Fiche ecoconception ' + f.nom); }
    else if (a === 'docagec') printHtml('<h1>Mes obligations : économie circulaire et emballages</h1><p style="text-align:center">Synthèse indicative au ' + new Date().toLocaleDateString('fr-FR') + '</p>' + agecRes().map(([t, x]) => '<h2>' + esc(t) + '</h2><p>' + esc(x) + '</p>').join('') + '<p><i>À vérifier : textes en vigueur, décrets d\'application et éco-organismes de vos filières.</i></p>', 'Obligations AGEC et emballages');
  } catch(err) { toast('Opération impossible'); }
});
awRoot.addEventListener('change', async e => {
  const t = e.target, d = AW.d, re = async () => { await awSave(); const y = window.scrollY; renderAteliers(); window.scrollTo(0, y); };
  if (t.dataset.tr) { d.traj[t.dataset.tr] = t.value; await re(); }
  else if (t.dataset.trl != null) { d.traj.lev[+t.dataset.trl][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.s3st != null) { d.s3f[+t.dataset.s3st].st = t.value; await re(); }
  else if (t.dataset.fin) { d.fin[t.dataset.fin] = t.value; await re(); }
  else if (t.dataset.fp != null) { d.fin.proj[+t.dataset.fp][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.fe != null) { d.flux.entrees[+t.dataset.fe][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.fd != null) { d.flux.dechets[+t.dataset.fd][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.eco != null) { const f = d.eco[+t.dataset.eco]; if (t.dataset.et) { f.et = f.et || {}; const x = f.et[t.dataset.et] = f.et[t.dataset.et] || {}; if (t.dataset.lev) { x.lev = x.lev || []; const i = x.lev.indexOf(t.dataset.lev); if (t.checked && i < 0) x.lev.push(t.dataset.lev); if (!t.checked && i >= 0) x.lev.splice(i, 1); } else x[t.dataset.k] = t.value; } else f[t.dataset.k] = t.value; await awSave(); }
  else if (t.dataset.agec) { d.agec[t.dataset.agec] = t.checked; await re(); }
});
window.addEventListener('hashchange', () => { if (route().base === 'ateliers') renderAteliers(); });
espaceReady.then(awInit, awInit);

/* =====================================================================
   OUTILS MÉTIERS : CHIFFRAGE, NOTATION ESG, FOURNISSEURS, TAXONOMIE,
   BIODIVERSITÉ, QVCT, REGISTRE RÉGLEMENTAIRE ET ANALYSE ENVIRONNEMENTALE
   ===================================================================== */
const OM = {d: null, tab: 'chiffrage'};
const ESG_CRIT = {E: ['Émissions et trajectoire climat', 'Énergie', 'Eau et pollution', 'Biodiversité', 'Ressources et déchets'], S: ['Santé et sécurité', 'Conditions de travail et rémunération', 'Diversité et égalité', 'Droits humains dans la chaîne de valeur', 'Clients et produits'], G: ['Indépendance et compétence du conseil', 'Éthique et anticorruption', 'Rémunération des dirigeants liée à la durabilité', 'Transparence et reporting']};
const FG_CRIT = [['Environnement', 30, ['Politique environnementale signée', 'Bilan carbone réalisé', 'Certification ISO 14001 ou équivalent', 'Objectifs de réduction']], ['Social et droits humains', 30, ['Politique santé-sécurité et indicateurs', 'Respect des conventions de l\'OIT', 'Audit social récent', 'Maîtrise de la sous-traitance']], ['Éthique', 20, ['Code de conduite', 'Dispositif anticorruption', 'Canal d\'alerte']], ['Achats responsables', 20, ['Charte imposée à ses propres fournisseurs', 'Évaluation de ses fournisseurs']]];
const BIO_Q = [['Le site est-il dans ou à proximité (moins de 1 km) d\'une zone protégée ou d\'inventaire (Natura 2000, ZNIEFF, réserve) ?', 3], ['Des espèces protégées ont-elles été observées sur le site ou à proximité ?', 3], ['Plus de 50 % du site est-il imperméabilisé ?', 2], ['Le site est-il éclairé toute la nuit ?', 1], ['Des produits phytosanitaires sont-ils utilisés sur les espaces verts ?', 2], ['Le site rejette-t-il des eaux dans un milieu naturel ?', 2], ['L\'activité dépend-elle fortement de l\'eau ou de matières agricoles, forestières ou marines ?', 2], ['Un projet d\'extension ou de construction est-il prévu ?', 3]];
const QV_THEMES = ['Charge et organisation du travail', 'Autonomie et marges de manœuvre', 'Reconnaissance', 'Relations avec la hiérarchie', 'Relations entre collègues', 'Sens du travail', 'Conditions matérielles', 'Équilibre vie professionnelle et personnelle'];
const TAXO_OBJ = ['Atténuation du changement climatique', 'Adaptation au changement climatique', 'Eau et ressources marines', 'Économie circulaire', 'Prévention de la pollution', 'Biodiversité et écosystèmes'];
async function omInit(){ try { OM.d = IDB.db && await IDB.get('kv', 'outilsm'); } catch(e) {} if (!OM.d) OM.d = {id: 'outilsm', ch: {tjm: '800', phases: []}, esg: [], fg: [], taxo: {ca: '', capex: '', opex: '', act: []}, bio: {}, qv: {jabs: '', jth: '', acc: '', jarr: '', heures: '', entrees: '', sorties: '', eff: '', hform: '', notes: {}}, reg: [], asp: []}; renderOutilsM(); }
const omSave = () => IDB.put('kv', OM.d).catch(() => {});
const omPct = (a, b) => b ? Math.round(a / b * 1000) / 10 : null;
function renderOutilsM(){
  const el = document.getElementById('omRoot'); if (!el || !OM.d) return;
  const sub = route().base === 'outilsm' ? route().sub : null; if (sub && ['chiffrage', 'esg', 'fournisseurs', 'taxo', 'biodiv', 'qvct', 'registre'].includes(sub)) OM.tab = sub;
  const d = OM.d;
  let h = '<div class="eyebrow">AGIR · OUTILS MÉTIERS</div><h2>Outils métiers</h2><p class="lead">Les outils des métiers du conseil, de la finance durable, des achats, de la biodiversité, du social et de l\'environnement : chiffrer une mission, noter une entreprise, évaluer un fournisseur, calculer la taxonomie, diagnostiquer un site, calculer les indicateurs sociaux, tenir un registre réglementaire.</p>';
  h += '<div class="ptabs">' + [['chiffrage', 'Chiffrer une mission', 'Jours et budget', ICO.bag], ['esg', 'Notation ESG', d.esg.length + ' entreprise' + (d.esg.length > 1 ? 's' : ''), ICO.chart], ['fournisseurs', 'Évaluer un fournisseur', d.fg.length + ' évaluation' + (d.fg.length > 1 ? 's' : ''), ICO.flag], ['taxo', 'Taxonomie', 'Ratios CA, CapEx, OpEx', ICO.radar], ['biodiv', 'Biodiversité', 'Diagnostic de site', ICO.tool], ['qvct', 'Indicateurs sociaux', 'Et enquête QVCT', ICO.doc], ['registre', 'Registre et aspects', 'Environnement', ICO.cal]].map(([k, t, s, ic]) => '<a class="ptab' + (OM.tab === k ? ' on' : '') + '" href="#outilsm--' + k + '"><span class="pti">' + ic + '</span><span><strong>' + t + '</strong><small>' + s + '</small></span></a>').join('') + '</div>';
  if (OM.tab === 'chiffrage') {
    const tot = d.ch.phases.reduce((s, p) => s + n0(p.j), 0), tjm = n0(d.ch.tjm);
    h += '<div class="card"><label class="awinline">Taux journalier moyen (€ HT)<input class="inp" data-om="tjm" value="' + esc(d.ch.tjm) + '"></label></div>' + (d.ch.phases.length ? '<div class="tablewrap"><table class="awfin"><thead><tr><th>Phase</th><th>Livrable</th><th>Jours</th><th>Montant (€ HT)</th><th></th></tr></thead><tbody>' + d.ch.phases.map((p, i) => '<tr><td><input class="kin" data-chp="' + i + '" data-k="nom" value="' + esc(p.nom) + '"></td><td><input class="kin" data-chp="' + i + '" data-k="liv" value="' + esc(p.liv || '') + '"></td><td><input class="kin" data-chp="' + i + '" data-k="j" value="' + esc(p.j || '') + '"></td><td class="num">' + fmtK(n0(p.j) * tjm) + '</td><td><button class="linkbtn" style="color:var(--danger)" data-omb="delch" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost" data-omb="addch">+ Phase</button>' + (d.ch.phases.length ? '' : '<button class="btn ghost" data-omb="democh">Exemple : premier bilan carbone d\'une PME</button>') + '</div>' + (tot ? '<figure class="vz">' + VZ.bars({unit: 'j', items: d.ch.phases.filter(p => n0(p.j)).map(p => [p.nom || 'Phase', n0(p.j)])}) + '<figcaption>Charge par phase</figcaption></figure><div class="scres"><div><b>' + vf(tot) + ' jours</b><small>charge totale</small></div><div><b>' + fmtK(tot * tjm) + ' €</b><small>montant HT</small></div><div><b>' + fmtK(Math.round(tot * tjm * 1.2)) + ' €</b><small>montant TTC</small></div></div><div class="ctool"><button class="btn" data-omb="docch">Proposition chiffrée (PDF ou Word)</button></div>' : '');
  } else if (OM.tab === 'esg') {
    h += '<p class="prose">Notez chaque critère de 0 à 10, réglez la pondération des piliers selon le secteur, appliquez une éventuelle pénalité de controverse. L\'outil calcule les notes par pilier et la note globale.</p><div class="ctool"><button class="btn" data-omb="addesg">+ Entreprise</button>' + (d.esg.length ? '<button class="btn ghost" data-omb="xlsxesg">Exporter la base (Excel)</button>' : '') + '</div>' + d.esg.map((x, i) => { const P = {E: 0, S: 0, G: 0}; ['E', 'S', 'G'].forEach(k => { const v = ESG_CRIT[k].map((c, j) => n0((x.n || {})[k + j])); P[k] = v.length ? v.reduce((a, b) => a + b, 0) / v.length : 0; }); const w = {E: n0(x.wE), S: n0(x.wS), G: n0(x.wG)}, ws = w.E + w.S + w.G || 1, glob = Math.max(0, (P.E * w.E + P.S * w.S + P.G * w.G) / ws - n0(x.contro)); return '<details class="card esgc"' + (i === d.esg.length - 1 ? ' open' : '') + '><summary><strong>' + esc(x.nom) + '</strong> <span class="pill">' + vf(Math.round(glob * 10) / 10) + ' / 10</span></summary><div class="awgrid"><label>Entreprise<input class="inp" data-esg="' + i + '" data-k="nom" value="' + esc(x.nom) + '"></label><label>Poids E (%)<input class="inp" data-esg="' + i + '" data-k="wE" value="' + esc(x.wE) + '"></label><label>Poids S (%)<input class="inp" data-esg="' + i + '" data-k="wS" value="' + esc(x.wS) + '"></label><label>Poids G (%)<input class="inp" data-esg="' + i + '" data-k="wG" value="' + esc(x.wG) + '"></label><label>Pénalité controverse (points)<input class="inp" data-esg="' + i + '" data-k="contro" value="' + esc(x.contro || '0') + '"></label></div><div class="esggrid">' + ['E', 'S', 'G'].map(k => '<div><h4>' + ({E: 'Environnement', S: 'Social', G: 'Gouvernance'})[k] + ' <span class="pill">' + vf(Math.round(P[k] * 10) / 10) + '</span></h4>' + ESG_CRIT[k].map((c, j) => '<label class="esgl"><span>' + esc(c) + '</span><input type="range" min="0" max="10" step="1" data-esgn="' + i + '" data-k="' + k + j + '" value="' + n0((x.n || {})[k + j]) + '"><b>' + n0((x.n || {})[k + j]) + '</b></label>').join('') + '</div>').join('') + '</div><figure class="vz">' + VZ.gauge([['Environnement', P.E * 10, vf(Math.round(P.E * 10) / 10) + ' / 10'], ['Social', P.S * 10, vf(Math.round(P.S * 10) / 10) + ' / 10'], ['Gouvernance', P.G * 10, vf(Math.round(P.G * 10) / 10) + ' / 10'], ['Note globale', glob * 10, vf(Math.round(glob * 10) / 10) + ' / 10']]) + '</figure><div class="ctool"><button class="btn ghost sm" data-omb="docesg" data-i="' + i + '">Note d\'analyse (PDF ou Word)</button><button class="btn ghost sm" style="color:var(--danger)" data-omb="delesg" data-i="' + i + '">Supprimer</button></div></details>'; }).join('');
  } else if (OM.tab === 'fournisseurs') {
    h += '<p class="prose">Grille pondérée : pour chaque critère, la preuve est-elle fournie (oui, en partie, non) ? L\'outil calcule une note sur 100 et un classement : conforme (70 et plus), à améliorer (40 à 69), à risque (moins de 40).</p><div class="ctool"><button class="btn" data-omb="addfg">+ Évaluer un fournisseur</button>' + (d.fg.length ? '<button class="btn ghost" data-omb="xlsxfg">Exporter (Excel)</button>' : '') + '</div>' + d.fg.map((f, i) => { let tot = 0; FG_CRIT.forEach(([n, w, L], ci) => { const s = L.reduce((a, c, j) => a + ({oui: 1, partiel: .5}[(f.r || {})[ci + '-' + j]] || 0), 0) / L.length; tot += s * w; }); const cl = tot >= 70 ? ['', 'Conforme'] : tot >= 40 ? ['o', 'À améliorer'] : ['r', 'À risque']; return '<details class="card"' + (i === d.fg.length - 1 ? ' open' : '') + '><summary><strong>' + esc(f.nom) + '</strong> <span class="pill ' + cl[0] + '">' + Math.round(tot) + ' / 100 · ' + cl[1] + '</span></summary><figure class="vz">' + VZ.gauge([['Note globale', tot, Math.round(tot) + ' / 100']].concat(FG_CRIT.map(([n, w, L], ci) => [n, 100 * L.reduce((a, c, j) => a + ({oui: 1, partiel: .5}[(f.r || {})[ci + '-' + j]] || 0), 0) / L.length]))) + '</figure>' + FG_CRIT.map(([n, w, L], ci) => '<h4>' + n + ' <small class="note">(' + w + ' %)</small></h4>' + L.map((c, j) => { const v = (f.r || {})[ci + '-' + j] || ''; return '<div class="fgrow"><span>' + esc(c) + '</span><div class="seg">' + [['oui', 'Oui'], ['partiel', 'En partie'], ['non', 'Non']].map(([k, l]) => '<button class="' + (v === k ? 'on ' + k : '') + '" data-omb="fgr" data-i="' + i + '" data-k="' + ci + '-' + j + '" data-v="' + k + '">' + l + '</button>').join('') + '</div></div>'; }).join('')).join('') + '<div class="ctool"><button class="btn ghost sm" style="color:var(--danger)" data-omb="delfg" data-i="' + i + '">Supprimer</button></div></details>'; }).join('');
  } else if (OM.tab === 'taxo') {
    const T = d.taxo, sums = k => T.act.reduce((s, a) => s + n0(a[k]), 0), sumsA = k => T.act.filter(a => a.al).reduce((s, a) => s + n0(a[k]), 0);
    h += '<p class="prose">Saisissez les totaux de l\'entreprise, puis chaque activité éligible avec son montant de chiffre d\'affaires, d\'investissements et de dépenses d\'exploitation, et cochez « alignée » si les critères techniques, l\'absence de préjudice important et les garanties sociales sont vérifiés.</p><div class="card"><div class="awgrid">' + [['ca', 'Chiffre d\'affaires total (€)'], ['capex', 'Investissements totaux (CapEx, €)'], ['opex', 'Dépenses d\'exploitation retenues (OpEx, €)']].map(([k, l]) => '<label>' + l + '<input class="inp" data-tx="' + k + '" value="' + esc(T[k]) + '"></label>').join('') + '</div></div>' + (T.act.length ? '<div class="tablewrap"><table class="awfin"><thead><tr><th>Activité</th><th>Objectif</th><th>CA (€)</th><th>CapEx (€)</th><th>OpEx (€)</th><th>Alignée</th><th></th></tr></thead><tbody>' + T.act.map((a, i) => '<tr><td><input class="kin" data-txa="' + i + '" data-k="nom" value="' + esc(a.nom) + '"></td><td><select class="kin" data-txa="' + i + '" data-k="obj">' + TAXO_OBJ.map(o => '<option' + (a.obj === o ? ' selected' : '') + '>' + o + '</option>').join('') + '</select></td>' + ['ca', 'capex', 'opex'].map(k => '<td><input class="kin" data-txa="' + i + '" data-k="' + k + '" value="' + esc(a[k] || '') + '"></td>').join('') + '<td><input type="checkbox" data-txal="' + i + '"' + (a.al ? ' checked' : '') + '></td><td><button class="linkbtn" style="color:var(--danger)" data-omb="deltx" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div>' : '') + '<div class="ctool"><button class="btn ghost" data-omb="addtx">+ Activité éligible</button>' + (T.act.length ? '' : '<button class="btn ghost" data-omb="demotx">Charger un exemple</button>') + '</div>';
    if (n0(T.ca) || n0(T.capex)) h += '<div class="card"><h4>Résultats</h4><div class="taxres">' + [['ca', 'Chiffre d\'affaires'], ['capex', 'Investissements'], ['opex', 'Dépenses']].map(([k, l]) => { const e = omPct(sums(k), n0(T[k])), a = omPct(sumsA(k), n0(T[k])); return '<div><h5>' + l + '</h5><div class="tbar"><span class="el" style="width:' + (e || 0) + '%"></span><span class="al" style="width:' + (a || 0) + '%"></span></div><p><b>' + (e == null ? '–' : vf(e) + ' %') + '</b> éligible · <b>' + (a == null ? '–' : vf(a) + ' %') + '</b> aligné</p></div>'; }).join('') + '</div><div class="ctool"><button class="btn" data-omb="xlsxtx">Exporter (Excel)</button></div></div>';
  } else if (OM.tab === 'biodiv') {
    const sc = BIO_Q.reduce((s, [q, w], i) => s + (d.bio[i] ? w : 0), 0), max = BIO_Q.reduce((s, [, w]) => s + w, 0), niv = sc >= 10 ? ['r', 'Enjeux forts : diagnostic écologique approfondi nécessaire'] : sc >= 5 ? ['o', 'Enjeux moyens : inventaire et mesures de réduction'] : ['', 'Enjeux faibles : gestion écologique courante'];
    h += '<p class="prose">Un premier filtre pour savoir si un site présente des enjeux de biodiversité et quelles mesures envisager. Il ne remplace pas un inventaire réalisé par un écologue.</p><div class="mes">' + BIO_Q.map(([q, w], i) => '<label class="pub' + (d.bio[i] ? ' ok' : '') + '"><input type="checkbox" data-bio="' + i + '"' + (d.bio[i] ? ' checked' : '') + '><span>' + esc(q) + '</span></label>').join('') + '</div><div class="card"><div class="gauge"><div style="width:' + Math.round(100 * sc / max) + '%"></div></div><p><span class="pill ' + niv[0] + '">' + sc + ' / ' + max + '</span> ' + niv[1] + '</p><h4>Mesures à envisager</h4><ul>' + [d.bio[0] || d.bio[1] ? 'Faire réaliser un inventaire faune-flore sur un cycle de saisons et consulter les données de l\'INPN.' : '', d.bio[2] ? 'Désimperméabiliser et végétaliser une partie des surfaces (parkings, cours).' : '', d.bio[3] ? 'Réduire l\'éclairage nocturne (extinction, détecteurs, lumière orientée vers le sol).' : '', d.bio[4] ? 'Passer à une gestion différenciée sans pesticides.' : '', d.bio[5] ? 'Contrôler la qualité des rejets et protéger les berges.' : '', d.bio[6] ? 'Évaluer les dépendances de la chaîne d\'approvisionnement (outil ENCORE) et favoriser des matières certifiées.' : '', d.bio[7] ? 'Appliquer la séquence éviter, réduire, compenser dès la conception du projet.' : '', 'Associer une association naturaliste locale et suivre des indicateurs simples (surfaces gérées écologiquement, espèces observées).'].filter(Boolean).map(x => '<li>' + x + '</li>').join('') + '</ul><div class="ctool"><button class="btn" data-omb="docbio">Diagnostic (PDF ou Word)</button><a class="btn ghost" href="#pcours--biodiv">Parcours biodiversité →</a></div></div>';
  } else if (OM.tab === 'qvct') {
    const q = d.qv, abs = omPct(n0(q.jabs), n0(q.jth)), tf = n0(q.heures) ? Math.round(n0(q.acc) * 1e6 / n0(q.heures) * 10) / 10 : null, tg = n0(q.heures) ? Math.round(n0(q.jarr) * 1000 / n0(q.heures) * 100) / 100 : null, rot = n0(q.eff) ? Math.round((n0(q.entrees) + n0(q.sorties)) / 2 / n0(q.eff) * 1000) / 10 : null, hf = n0(q.eff) ? Math.round(n0(q.hform) / n0(q.eff) * 10) / 10 : null;
    h += '<div class="grid two"><div class="card"><h4>Données de l\'année</h4><div class="awgrid">' + [['jabs', 'Jours d\'absence'], ['jth', 'Jours théoriques travaillés'], ['acc', 'Accidents avec arrêt'], ['jarr', 'Jours d\'arrêt (accidents)'], ['heures', 'Heures travaillées'], ['eff', 'Effectif moyen'], ['entrees', 'Entrées'], ['sorties', 'Sorties'], ['hform', 'Heures de formation']].map(([k, l]) => '<label>' + l + '<input class="inp" data-qv="' + k + '" value="' + esc(q[k]) + '" inputmode="decimal"></label>').join('') + '</div>' + (!q.jth ? '<button class="btn ghost sm" data-omb="demoqv">Charger un exemple</button>' : '') + '</div><div class="card"><h4>Indicateurs</h4><div class="scres">' + [['Absentéisme', abs == null ? '–' : vf(abs) + ' %'], ['Taux de fréquence', tf == null ? '–' : vf(tf)], ['Taux de gravité', tg == null ? '–' : vf(tg)], ['Taux de rotation', rot == null ? '–' : vf(rot) + ' %'], ['Formation par salarié', hf == null ? '–' : vf(hf) + ' h']].map(([l, v]) => '<div><b>' + v + '</b><small>' + l + '</small></div>').join('') + '</div></div></div>';
    h += '<h3>Résultats de l\'enquête QVCT</h3><p class="prose">Saisissez la note moyenne obtenue pour chaque thème (de 1 à 5). Le radar montre les points forts et les priorités.</p><div class="grid two"><div class="card">' + QV_THEMES.map((t, i) => '<label class="esgl"><span>' + esc(t) + '</span><input type="range" min="1" max="5" step="0.1" data-qvn="' + i + '" value="' + (q.notes[i] || 3) + '"><b>' + vf(q.notes[i] || 3) + '</b></label>').join('') + '</div><div class="card">' + radarQV(QV_THEMES.map((t, i) => +(q.notes[i] || 3))) + '<p class="note">Priorités : ' + QV_THEMES.map((t, i) => [t, +(q.notes[i] || 3)]).sort((a, b) => a[1] - b[1]).slice(0, 3).map(x => '<strong>' + esc(x[0]) + '</strong> (' + vf(x[1]) + ')').join(', ') + '.</p></div></div><div class="ctool"><button class="btn" data-omb="docqv">Diagnostic QVCT (PDF ou Word)</button></div>';
  } else {
    h += '<h3>Registre réglementaire</h3><div class="ctool"><button class="btn" data-omb="addreg">+ Exigence</button>' + (d.reg.length ? '<button class="btn ghost" data-omb="xlsxreg">Exporter (Excel)</button>' : '<button class="btn ghost" data-omb="demoreg">Charger un exemple</button>') + '</div>' + (d.reg.length ? '<div class="tablewrap"><table><thead><tr><th>Thème</th><th>Exigence</th><th>Source</th><th>Preuve</th><th>Statut</th><th></th></tr></thead><tbody>' + d.reg.map((r, i) => '<tr><td>' + esc(r.th) + '</td><td>' + esc(r.ex) + '</td><td>' + esc(r.src) + '</td><td>' + esc(r.pr) + '</td><td><select class="kin" data-regst="' + i + '">' + ['Conforme', 'À vérifier', 'Non conforme'].map(s => '<option' + (r.st === s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td><button class="linkbtn" style="color:var(--danger)" data-omb="delreg" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>').join('') + '</tbody></table></div><figure class="vz">' + VZ.donut({total: String(d.reg.length), sub: 'exigences', items: ['Conforme', 'À vérifier', 'Non conforme'].map(s => [s, d.reg.filter(r => r.st === s).length]).filter(x => x[1])}) + '</figure>' : '');
    h += '<h3>Analyse environnementale : aspects et impacts</h3><p class="prose">Cotation : gravité (1 à 4) × fréquence (1 à 4) × maîtrise (1 bien maîtrisé à 4 non maîtrisé). Au-delà de 20, l\'aspect est significatif.</p><div class="ctool"><button class="btn" data-omb="addasp">+ Aspect</button>' + (d.asp.length ? '<button class="btn ghost" data-omb="xlsxasp">Exporter (Excel)</button>' : '<button class="btn ghost" data-omb="demoasp">Charger un exemple</button>') + '</div>' + (d.asp.length ? '<div class="tablewrap"><table class="awfin"><thead><tr><th>Activité</th><th>Aspect</th><th>Impact</th><th>Gravité</th><th>Fréquence</th><th>Maîtrise</th><th>Score</th><th></th></tr></thead><tbody>' + d.asp.map((a, i) => { const s = n0(a.g) * n0(a.f) * n0(a.m); return '<tr>' + ['act', 'asp', 'imp'].map(k => '<td><input class="kin" data-asp="' + i + '" data-k="' + k + '" value="' + esc(a[k] || '') + '"></td>').join('') + ['g', 'f', 'm'].map(k => '<td><select class="kin" data-asp="' + i + '" data-k="' + k + '">' + [1, 2, 3, 4].map(v => '<option' + (String(a[k]) === String(v) ? ' selected' : '') + '>' + v + '</option>').join('') + '</select></td>').join('') + '<td><span class="pill ' + (s > 20 ? 'r' : s > 10 ? 'o' : 'g') + '">' + s + (s > 20 ? ' · significatif' : '') + '</span></td><td><button class="linkbtn" style="color:var(--danger)" data-omb="delasp" data-i="' + i + '" aria-label="Supprimer">✕</button></td></tr>'; }).join('') + '</tbody></table></div>' : '');
  }
  h += '<p class="foot">Vos données restent sur cet appareil. Outils d\'aide, à compléter par votre jugement professionnel et les textes en vigueur.</p>';
  el.innerHTML = h;
}
function radarQV(v){ const n = v.length, cx = 160, cy = 150, R = 110, pt = (i, r) => [cx + r * Math.sin(2 * Math.PI * i / n), cy - r * Math.cos(2 * Math.PI * i / n)]; let g = ''; [1, 2, 3, 4, 5].forEach(k => { g += '<polygon points="' + v.map((x, i) => pt(i, R * k / 5).join(',')).join(' ') + '" fill="none" stroke="var(--line)"/>'; }); v.forEach((x, i) => { const [a, b] = pt(i, R + 14); g += '<text x="' + a + '" y="' + b + '" font-size="9.5" text-anchor="middle" fill="currentColor">' + (i + 1) + '</text>'; }); g += '<polygon points="' + v.map((x, i) => pt(i, R * x / 5).join(',')).join(' ') + '" fill="#C2532A" fill-opacity=".25" stroke="#C2532A" stroke-width="2.5"/>'; return '<svg viewBox="0 0 320 300" class="awchart" role="img" aria-label="Radar QVCT">' + g + '</svg><p class="note">' + QV_THEMES.map((t, i) => (i + 1) + '. ' + t).join(' · ') + '</p>'; }
const omRoot = document.getElementById('omRoot');
omRoot.addEventListener('click', async e => {
  const b = e.target.closest('[data-omb]'); if (!b) return; const a = b.dataset.omb, d = OM.d, re = async () => { await omSave(); const y = window.scrollY; renderOutilsM(); window.scrollTo(0, y); };
  try {
    if (a === 'addch') { d.ch.phases.push({nom: '', liv: '', j: ''}); await re(); }
    else if (a === 'delch') { d.ch.phases.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'democh') { d.ch.phases = [['Cadrage', 'Note de méthode', 1], ['Collecte et accompagnement', 'Fichier de données', 3], ['Calcul et analyse', 'Résultats par poste', 2], ['Plan de réduction', 'Plan d\'action chiffré', 2], ['Restitution', 'Rapport et présentation', 1]].map(([nom, liv, j]) => ({nom, liv, j: String(j)})); await re(); }
    else if (a === 'docch') { const tjm = n0(d.ch.tjm), tot = d.ch.phases.reduce((s, p) => s + n0(p.j), 0); printHtml(PTPL.proposition[1].replace('<tr><td>1. Cadrage</td><td></td><td></td><td></td></tr><tr><td>2. Diagnostic</td><td></td><td></td><td></td></tr><tr><td>3. Recommandations</td><td></td><td></td><td></td></tr><tr><td>4. Restitution</td><td></td><td></td><td></td></tr>', d.ch.phases.map((p, i) => '<tr><td>' + (i + 1) + '. ' + esc(p.nom) + '</td><td></td><td>' + esc(p.liv || '') + '</td><td>' + esc(p.j) + '</td></tr>').join('')).replace('[Jours × taux journalier = montant HT ; frais ; éligibilité aux aides.]', vf(tot) + ' jours × ' + fmtK(tjm) + ' € = ' + fmtK(tot * tjm) + ' € HT (' + fmtK(Math.round(tot * tjm * 1.2)) + ' € TTC).'), 'Proposition chiffree'); }
    else if (a === 'addesg') { const n = {}; ['E', 'S', 'G'].forEach(k => ESG_CRIT[k].forEach((c, j) => { n[k + j] = 5; })); d.esg.push({nom: 'Nouvelle entreprise', wE: '40', wS: '35', wG: '25', contro: '0', n}); await re(); }
    else if (a === 'delesg') { d.esg.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'xlsxesg') await atXlsx('Base ESG', [['Notations', d.esg.map(x => { const o = {Entreprise: x.nom}; ['E', 'S', 'G'].forEach(k => ESG_CRIT[k].forEach((c, j) => { o[k + ' · ' + c] = n0((x.n || {})[k + j]); })); o['Pénalité controverse'] = n0(x.contro); return o; })]]);
    else if (a === 'docesg') { const x = d.esg[+b.dataset.i]; printHtml('<h1>Note d\'analyse ESG : ' + esc(x.nom) + '</h1><p style="text-align:center">' + new Date().toLocaleDateString('fr-FR') + '</p>' + ['E', 'S', 'G'].map(k => '<h2>' + ({E: 'Environnement', S: 'Social', G: 'Gouvernance'})[k] + '</h2><table border="1"><tr><th>Critère</th><th>Note sur 10</th></tr>' + ESG_CRIT[k].map((c, j) => '<tr><td>' + c + '</td><td>' + n0((x.n || {})[k + j]) + '</td></tr>').join('') + '</table>').join('') + '<h2>Pondération</h2><p>E ' + esc(x.wE) + ' %, S ' + esc(x.wS) + ' %, G ' + esc(x.wG) + ' % ; pénalité de controverse : ' + esc(x.contro || '0') + ' point(s).</p><h2>Analyse et points de dialogue</h2><p>[À compléter]</p>', 'Note ESG ' + x.nom); }
    else if (a === 'addfg') modal('Évaluer un fournisseur', '<div class="row"><label>Nom du fournisseur<input class="inp" id="fgN"></label></div>', 'Commencer', async () => { const v = document.getElementById('fgN').value.trim(); if (!v) return false; d.fg.push({nom: v, r: {}}); await re(); });
    else if (a === 'fgr') { const f = d.fg[+b.dataset.i]; f.r = f.r || {}; f.r[b.dataset.k] = b.dataset.v; await re(); }
    else if (a === 'delfg') { d.fg.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'xlsxfg') await atXlsx('Evaluation fournisseurs', [['Évaluations', d.fg.map(f => { const o = {Fournisseur: f.nom}; let tot = 0; FG_CRIT.forEach(([n, w, L], ci) => { L.forEach((c, j) => { o[c] = (f.r || {})[ci + '-' + j] || ''; }); tot += L.reduce((s, c, j) => s + ({oui: 1, partiel: .5}[(f.r || {})[ci + '-' + j]] || 0), 0) / L.length * w; }); o['Note sur 100'] = Math.round(tot); return o; })]]);
    else if (a === 'addtx') { d.taxo.act.push({nom: '', obj: TAXO_OBJ[0], ca: '', capex: '', opex: '', al: false}); await re(); }
    else if (a === 'deltx') { d.taxo.act.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demotx') { d.taxo = {ca: '200000000', capex: '18000000', opex: '6000000', act: [{nom: 'Fabrication d\'équipements d\'efficacité énergétique', obj: TAXO_OBJ[0], ca: '40000000', capex: '5000000', opex: '1200000', al: true}, {nom: 'Installation de bornes de recharge', obj: TAXO_OBJ[0], ca: '8000000', capex: '1500000', opex: '300000', al: false}]}; await re(); }
    else if (a === 'xlsxtx') { const T = d.taxo; await atXlsx('Ratios taxonomie', [['Activités', T.act.map(x => ({Activité: x.nom, Objectif: x.obj, 'CA (€)': n0(x.ca), 'CapEx (€)': n0(x.capex), 'OpEx (€)': n0(x.opex), Alignée: x.al ? 'Oui' : 'Non'}))], ['Ratios', ['ca', 'capex', 'opex'].map(k => ({Indicateur: k.toUpperCase(), Total: n0(T[k]), 'Éligible (%)': omPct(T.act.reduce((s, x) => s + n0(x[k]), 0), n0(T[k])), 'Aligné (%)': omPct(T.act.filter(x => x.al).reduce((s, x) => s + n0(x[k]), 0), n0(T[k]))}))]]); }
    else if (a === 'docbio') printHtml('<h1>Diagnostic biodiversité du site</h1><p style="text-align:center">' + new Date().toLocaleDateString('fr-FR') + '</p><table border="1"><tr><th>Question</th><th>Réponse</th></tr>' + BIO_Q.map(([q], i) => '<tr><td>' + esc(q) + '</td><td>' + (d.bio[i] ? 'Oui' : 'Non') + '</td></tr>').join('') + '</table><p><i>Premier filtre indicatif, à compléter par un inventaire écologique.</i></p>', 'Diagnostic biodiversite');
    else if (a === 'demoqv') { d.qv = Object.assign(d.qv, {jabs: '1800', jth: '45000', acc: '6', jarr: '150', heures: '300000', eff: '180', entrees: '30', sorties: '24', hform: '3600', notes: {0: 2.4, 1: 3.6, 2: 2.8, 3: 3.4, 4: 4.1, 5: 3.9, 6: 3.2, 7: 2.9}}); await re(); }
    else if (a === 'docqv') { const q = d.qv; printHtml(PTPL.planqvct[1].replace('<tr><td>Absentéisme</td><td></td>', '<tr><td>Absentéisme</td><td>' + (omPct(n0(q.jabs), n0(q.jth)) ?? '') + ' %</td>').replace('[Taux de réponse, notes par thème, écarts entre services, verbatims.]', QV_THEMES.map((t, i) => t + ' : ' + vf(q.notes[i] || 3) + ' / 5').join(' ; ') + '.'), 'Diagnostic QVCT'); }
    else if (a === 'addreg') modal('Ajouter une exigence', '<div class="row"><label>Thème<select class="inp" id="rgT"><option>Eau</option><option>Air</option><option>Déchets</option><option>Bruit</option><option>Produits chimiques</option><option>Énergie</option><option>Sols</option><option>Autre</option></select></label></div><div class="row"><label>Exigence<textarea class="inp" rows="2" id="rgE"></textarea></label></div><div class="row"><label>Source (texte, article)<input class="inp" id="rgS"></label></div><div class="row"><label>Preuve de conformité<input class="inp" id="rgP"></label></div>', 'Ajouter', async () => { const v = id => document.getElementById(id).value.trim(); if (!v('rgE')) return false; d.reg.push({th: v('rgT'), ex: v('rgE'), src: v('rgS'), pr: v('rgP'), st: 'À vérifier'}); await re(); });
    else if (a === 'delreg') { d.reg.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demoreg') { d.reg = [{th: 'Eau', ex: 'Autosurveillance trimestrielle des rejets (pH, DCO, MES)', src: 'Arrêté préfectoral du site, article 4.3', pr: 'Rapports du laboratoire', st: 'Conforme'}, {th: 'Déchets', ex: 'Tri à la source des papiers, cartons, plastiques, métaux, verre, bois et biodéchets', src: 'Code de l\'environnement', pr: 'Contrats et attestations de valorisation', st: 'À vérifier'}, {th: 'Déchets', ex: 'Suivi des déchets dangereux par bordereau électronique', src: 'Code de l\'environnement (Trackdéchets)', pr: 'Bordereaux Trackdéchets', st: 'Conforme'}, {th: 'Énergie', ex: 'Déclaration annuelle des consommations des bâtiments tertiaires', src: 'Décret tertiaire', pr: 'Attestation OPERAT', st: 'Non conforme'}]; await re(); }
    else if (a === 'xlsxreg') await atXlsx('Registre reglementaire', [['Registre', d.reg.map(r => ({Thème: r.th, Exigence: r.ex, Source: r.src, Preuve: r.pr, Statut: r.st}))]]);
    else if (a === 'addasp') { d.asp.push({act: '', asp: '', imp: '', g: '2', f: '2', m: '2'}); await re(); }
    else if (a === 'delasp') { d.asp.splice(+b.dataset.i, 1); await re(); }
    else if (a === 'demoasp') { d.asp = [{act: 'Lavage des pièces', asp: 'Rejet d\'eaux de lavage', imp: 'Pollution de l\'eau', g: '3', f: '4', m: '2'}, {act: 'Chaufferie', asp: 'Combustion de gaz', imp: 'Émissions de CO₂', g: '3', f: '4', m: '1'}, {act: 'Peinture', asp: 'Émissions de solvants', imp: 'Pollution de l\'air', g: '3', f: '3', m: '3'}, {act: 'Bureaux', asp: 'Consommation de papier', imp: 'Ressources', g: '1', f: '3', m: '1'}]; await re(); }
    else if (a === 'xlsxasp') await atXlsx('Analyse environnementale', [['Aspects', d.asp.map(x => ({Activité: x.act, Aspect: x.asp, Impact: x.imp, Gravité: +x.g, Fréquence: +x.f, Maîtrise: +x.m, Score: n0(x.g) * n0(x.f) * n0(x.m), Significatif: n0(x.g) * n0(x.f) * n0(x.m) > 20 ? 'Oui' : 'Non'}))]]);
  } catch(err) { toast('Opération impossible'); }
});
omRoot.addEventListener('input', e => { const t = e.target; if (t.type === 'range') { const s = t.parentNode.querySelector('b'); if (s) s.textContent = vf(t.value); } });
omRoot.addEventListener('change', async e => {
  const t = e.target, d = OM.d, re = async () => { await omSave(); const y = window.scrollY; renderOutilsM(); window.scrollTo(0, y); };
  if (t.dataset.om === 'tjm') { d.ch.tjm = t.value; await re(); }
  else if (t.dataset.chp != null) { d.ch.phases[+t.dataset.chp][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.esg != null) { d.esg[+t.dataset.esg][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.esgn != null) { const x = d.esg[+t.dataset.esgn]; x.n = x.n || {}; x.n[t.dataset.k] = +t.value; await re(); }
  else if (t.dataset.tx) { d.taxo[t.dataset.tx] = t.value; await re(); }
  else if (t.dataset.txa != null) { d.taxo.act[+t.dataset.txa][t.dataset.k] = t.value; await re(); }
  else if (t.dataset.txal != null) { d.taxo.act[+t.dataset.txal].al = t.checked; await re(); }
  else if (t.dataset.bio != null) { d.bio[t.dataset.bio] = t.checked; await re(); }
  else if (t.dataset.qv) { d.qv[t.dataset.qv] = t.value; await re(); }
  else if (t.dataset.qvn != null) { d.qv.notes[t.dataset.qvn] = +t.value; await re(); }
  else if (t.dataset.regst != null) { d.reg[+t.dataset.regst].st = t.value; await re(); }
  else if (t.dataset.asp != null) { d.asp[+t.dataset.asp][t.dataset.k] = t.value; await re(); }
});
window.addEventListener('hashchange', () => { if (route().base === 'outilsm') renderOutilsM(); });
espaceReady.then(omInit, omInit);


})();
