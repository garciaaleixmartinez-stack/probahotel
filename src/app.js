/* ============================================================
   PAUta · Aplicació
   ============================================================ */
(function () {
'use strict';

/* ---------- Utilitats ---------- */
const $ = (s) => document.querySelector(s);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const today = () => isoDate(new Date());
const num = (v) => { const n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isNaN(n) ? null : n; };
const fmt = (n, d) => (n == null ? '—' : n.toFixed(d == null ? 3 : d).replace('.', ','));
const DOW = ['Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds', 'Dg'];
const DOW_LONG = ['dilluns', 'dimarts', 'dimecres', 'dijous', 'divendres', 'dissabte', 'diumenge'];
const MONTHS = ['de gener', 'de febrer', 'de març', 'd’abril', 'de maig', 'de juny', 'de juliol', 'd’agost', 'de setembre', 'd’octubre', 'de novembre', 'de desembre'];
function longDate(iso) { const d = parseIso(iso); return DOW_LONG[weekdayMon(iso)] + ', ' + d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function shortDate(iso) { const d = parseIso(iso); return d.getDate() + ' ' + MONTHS[d.getMonth()]; }
function nm() { return S.profile && S.profile.name ? esc(S.profile.name) : ''; }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><line x1="9" y1="7" x2="15" y2="7"/><line x1="9" y1="12" x2="9.01" y2="12"/><line x1="12" y1="12" x2="12.01" y2="12"/><line x1="15" y1="12" x2="15.01" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/>',
  cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/>',
  cards: '<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M7 3h12a2 2 0 0 1 2 2v12"/>',
  chart: '<line x1="6" y1="20" x2="6" y2="12"/><line x1="12" y1="20" x2="12" y2="6"/><line x1="18" y1="20" x2="18" y2="14"/>',
  back: '<polyline points="15 6 9 12 15 18"/>',
  chevron: '<polyline points="9 6 15 12 9 18"/>',
  check: '<polyline points="20 6 9 17 4 12"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  book: '<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
  pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/><line x1="13.5" y1="6.5" x2="17.5" y2="10.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 14"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/>',
  repeat: '<polyline points="17 2 21 6 17 10"/><path d="M3 12V9a3 3 0 0 1 3-3h15"/><polyline points="7 22 3 18 7 14"/><path d="M21 12v3a3 3 0 0 1-3 3H3"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  flame: '<path d="M12 2.5c.8 3.2 4.5 5 4.5 10a4.5 4.5 0 0 1-9 0c0-2.2 1-3.7 2.4-4.8.1 1.6.9 2.6 2.1 3C11.5 8.5 11 5.5 12 2.5z"/>',
  shield: '<path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6z"/>',
  scroll: '<rect x="6" y="7" width="12" height="14" rx="2.5"/><path d="M8 4h8"/><path d="M12 11v4"/><polyline points="10 13 12 11 14 13"/>',
  spark: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>'
};
function icon(name, size, stroke) {
  return '<svg aria-hidden="true" width="' + (size || 24) + '" height="' + (size || 24) + '" viewBox="0 0 24 24" fill="none" stroke="' + (stroke || 'currentColor') + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + ICONS[name] + '</svg>';
}

/* ---------- Estat i persistència ---------- */
const KEY = 'pauta.v1';
function freshState() {
  return { v: 1, updatedAt: 0, profile: null, grades: { base: '', fg: '', adm: {} }, done: {}, topicsDone: {}, log: {}, quiz: {}, cards: {}, act: {}, milestones: [] };
}
let S = freshState();
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(freshState(), JSON.parse(raw)); } catch (e) {}

let cloud = null; // {ref}
let cloudTimer = null;
function save() {
  S.updatedAt = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
  if (cloud) {
    clearTimeout(cloudTimer);
    cloudTimer = setTimeout(() => {
      cloud.ref.set({ json: JSON.stringify(S), updatedAt: S.updatedAt }).catch(() => {});
    }, 1500);
  }
}
async function initCloud() {
  try {
    if (!window.claude || typeof window.claude.use !== 'function') return;
    const user = await window.claude.use('user');
    const db = await window.claude.use('db');
    if (!user || !db) return;
    const id = await user.id();
    if (!id) return;
    const ref = db.doc('data/users/' + id + '/app');
    const snap = await ref.get();
    cloud = { ref };
    if (snap.exists) {
      const d = snap.data();
      if (d && d.json && (d.updatedAt || 0) > (S.updatedAt || 0)) {
        S = Object.assign(freshState(), JSON.parse(d.json));
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
        planCache = null; render();
      } else if (S.profile) { save(); }
    } else if (S.profile) { save(); }
  } catch (e) { cloud = null; }
}

/* ---------- UI state (no persistent) ---------- */
const U = {
  view: S.profile ? 'home' : 'onb',
  step: 0,
  draft: null,
  planDay: null,
  sheet: null, // {type:'session', id} | {type:'confirm'...}
  practiceSubj: null,
  practiceMode: 'test',
  quiz: null,
  flash: null,
  timer: { running: false, left: 0, total: 0, handle: null, id: null },
  toast: null
};

let planCache = null; let planKey = '';
function getPlan() {
  if (!S.profile) return null;
  const k = JSON.stringify([S.profile, S.quiz]);
  if (planCache && k === planKey) return planCache;
  planKey = k;
  planCache = generatePlan(S.profile, { quizStats: S.quiz });
  return planCache;
}
function findItem(id) {
  const p = getPlan(); if (!p) return null;
  const date = id.split('#')[0];
  const d = p.days.find((x) => x.date === date);
  return d ? d.items.find((i) => i.id === id) : null;
}

function toast(msg) {
  U.toast = msg; render();
  setTimeout(() => { if (U.toast === msg) { U.toast = null; render(); } }, 2200);
}

/* ---------- Onboarding ---------- */
const ONB_STEPS = 8; // 0..7
function newDraft() {
  const p = S.profile ? JSON.parse(JSON.stringify(S.profile)) : null;
  return p || { name: '', region: null, level: 'batx', modality: null, modSubject: null, histOrFil: 'his', foreign: 'eng', coLangOn: true, admission: [], ratings: {}, stars: {}, ponder: {}, degree: '', cut: '', uni: null, minutes: 60, days: [true, true, true, true, true, false, false] };
}
// Matèries que poden ponderar a la fase d'admissió (modalitat + admissió)
function draftPonderable(d) {
  const ids = [];
  if (d.level !== 'cfgs' && d.modSubject) ids.push(d.modSubject);
  (d.admission || []).forEach((x) => { if (!ids.includes(x)) ids.push(x); });
  return ids;
}
function draftSubjects(d) {
  return studentSubjects(Object.assign({}, d, { ratings: {} }), {}).map((s) => s.id);
}
function onbCanContinue() {
  const d = U.draft;
  switch (U.step) {
    case 1: return !!d.name.trim();
    case 2: return !!d.region;
    case 4: return d.level === 'cfgs' ? d.admission.length > 0 : !!(d.modality && d.modSubject);
    case 7: return d.days.some(Boolean);
    default: return true;
  }
}

function regionCard(r) {
  if (!r) return '';
  const st = STATUS[r.status];
  const n = r.coLang ? (r.coOptional ? '4 (5 amb basc)' : '5 exàmens') : '4 exàmens';
  const lang = r.coLang ? SUBJECTS[CO_LANG_SUBJECT[r.coLang]].short : 'No';
  return '<div class="card dark stack" style="gap:14px">' +
    '<div class="between"><span style="font-size:17px;font-weight:700">PAU 2027 · ' + esc(r.name) + '</span><span class="badge ' + st.cls + '">' + st.label + '</span></div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
    kv('Ordinària', r.ord) + kv('Extraordinària', r.ext) + kv('Fase d’accés', n) + kv('Llengua cooficial', lang) +
    '</div>' + (r.note ? '<span class="small" style="color:#E5E5EA">' + esc(r.note) + '</span>' : '') +
    '<span class="small" style="font-size:12px">Font: ' + esc(r.organ) + ' · Verificat el ' + VERIFIED_AT + '</span></div>';
  function kv(k, v) { return '<div class="stack" style="gap:2px"><span style="font-size:12px;font-weight:600;color:#AEAEB2">' + k + '</span><span style="font-size:15px;font-weight:600">' + esc(v) + '</span></div>'; }
}

function viewOnboarding() {
  const d = U.draft || (U.draft = newDraft());
  const st = U.step;
  let body = '';
  if (st === 0) {
    const feats = [
      ['pin', 'Adaptada a la teva comunitat', 'Dates, exàmens i ponderacions oficials de la PAU on et presentes.'],
      ['cal', 'Un pla fet com un professor', 'Fases, repàs espaiat i simulacres fins al dia de l’examen.'],
      ['cards', 'Scroll per aprendre', 'Llisca targetes de preguntes i flashcards, una darrere l’altra.']
    ];
    body = '<div style="padding-top:40px;display:flex;flex-direction:column;align-items:center;gap:40px">' +
      '<div class="stack" style="align-items:center;text-align:center;gap:18px"><div aria-hidden="true" style="width:88px;height:88px;border-radius:22px;background:#1D1D1F;display:flex;align-items:center;justify-content:center"><svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V5a1 1 0 0 1 1-1h7a5 5 0 0 1 0 10H4"/><circle cx="18.5" cy="18.5" r="1.8" fill="#0A84FF" stroke="none"/></svg></div>' +
      '<h1 class="large">Et donem la benvinguda a PAUta</h1></div>' +
      '<div class="stack" style="gap:24px;width:100%">' + feats.map((f) => '<div class="row" style="align-items:flex-start;gap:16px"><span style="color:var(--accent);width:40px;display:flex;justify-content:center">' + icon(f[0], 30) + '</span><span class="stack" style="gap:2px"><span style="font-size:16px;font-weight:700">' + f[1] + '</span><span class="sub" style="font-size:15px">' + f[2] + '</span></span></div>').join('') + '</div></div>';
  } else if (st === 1) {
    body = head('Com et dius?', 'Farem servir el teu nom per personalitzar el pla.') +
      '<div class="field"><label for="f-name">Nom</label><input id="f-name" data-bind="draft.name" autocomplete="given-name" value="' + esc(d.name) + '" placeholder="Escriu el teu nom"></div>';
  } else if (st === 2) {
    const r = getRegion(d.region);
    body = head((d.name.trim() ? esc(d.name.trim()) + ', on' : 'On') + ' faràs la PAU?', 'Cada comunitat fixa les seves dates, exàmens i ponderacions. Adaptarem l’app a la teva.') +
      regionCard(r) +
      '<div class="list gray" role="radiogroup" aria-label="Comunitat autònoma">' + REGIONS.map((g) => '<button class="li" role="radio" aria-checked="' + (d.region === g.id) + '" data-act="setRegion" data-arg="' + g.id + '"><span class="grow"><span class="t" style="font-weight:' + (d.region === g.id ? 700 : 500) + '">' + esc(g.name) + '</span></span>' + (d.region === g.id ? '<span style="color:var(--accent)">' + icon('check', 20) + '</span>' : '') + '</button>').join('') + '</div>';
  } else if (st === 3) {
    const L = [['batx', '2n de Batxillerat', 'Fase d’accés + fase d’admissió'], ['cfgs', 'Cicle formatiu de grau superior', 'Accés amb la nota del cicle; pots pujar nota amb la fase d’admissió'], ['millora', 'Ja tinc el títol', 'Em torno a presentar per millorar la nota']];
    body = head('Què estudies ara?', 'Així sabem de què t’has d’examinar i com es calcula la teva nota.') +
      '<div class="stack" style="gap:12px">' + L.map((l) => '<button class="opt" aria-pressed="' + (d.level === l[0]) + '" data-act="setLevel" data-arg="' + l[0] + '"><span class="grow"><span class="t">' + l[1] + '</span><span class="d">' + l[2] + '</span></span><span class="radio">' + icon('check', 13, '#fff') + '</span></button>').join('') + '</div>';
  } else if (st === 4) {
    const r = getRegion(d.region);
    let html = head('De què t’examines?', d.level === 'cfgs' ? 'Tria fins a 3 matèries de la fase d’admissió per pujar nota.' : 'Tria la modalitat i les matèries. La fase d’accés ja la calculem segons la teva comunitat.');
    if (d.level !== 'cfgs') {
      const access = [SUBJECTS.cas.short];
      if (r && r.coLang) access.push(SUBJECTS[CO_LANG_SUBJECT[r.coLang]].short + (r.coOptional ? ' (si l’has cursat)' : ''));
      access.push('Anglès', 'Història o Filosofia', 'Matèria de modalitat');
      html += '<div class="card stack" style="gap:6px"><span class="eyebrow">Fase d’accés a ' + esc(r ? r.name : '') + '</span><span style="font-size:15px;line-height:1.5">' + access.map(esc).join(' · ') + '</span></div>';
      html += section('Modalitat de batxillerat') + '<div class="chips">' + MODALITIES.map((m) => chip(m.name, d.modality === m.id, 'setModality', m.id)).join('') + '</div>';
      const mod = MODALITIES.find((m) => m.id === d.modality);
      if (mod && mod.options.length > 1) html += section('Matèria obligatòria de modalitat') + '<div class="chips">' + mod.options.map((o) => chip(SUBJECTS[o].name, d.modSubject === o, 'setModSubject', o)).join('') + '</div>';
      html += section('Història d’Espanya o Història de la Filosofia') + '<div class="seg">' + segBtn('Història d’Espanya', d.histOrFil === 'his', 'setHist', 'his') + segBtn('Filosofia', d.histOrFil === 'fil', 'setHist', 'fil') + '</div>';
      if (r && r.coOptional) html += '<button class="list li" role="switch" aria-checked="' + !!d.coLangOn + '" data-act="toggleCo" style="border-radius:16px"><span class="grow"><span class="t">M’examino de basc</span><span class="d">Només si l’has cursat al batxillerat</span></span><span class="switch"><i></i></span></button>';
      html += '<span class="small">Llengua estrangera: de moment l’app inclou l’anglès.</span>';
    }
    const taken = d.level === 'cfgs' ? [] : [d.modSubject, d.histOrFil];
    html += section('Fase d’admissió (opcional · fins a 3)') + '<div class="chips">' + ADMISSION_OPTIONS.filter((o) => !taken.includes(o)).map((o) => {
      const on = d.admission.includes(o);
      return '<button class="chip" aria-pressed="' + on + '" data-act="toggleAdm" data-arg="' + o + '"' + (!on && d.admission.length >= 3 ? ' disabled' : '') + '>' + esc(SUBJECTS[o].name) + '</button>';
    }).join('') + '</div>';
    body = html;
  } else if (st === 5) {
    const ids = draftSubjects(d);
    body = head('Com portes cada matèria?', 'Sigues sincer: el pla dedicarà més temps a les que et costen més. Marca amb l’estrella les que són clau per a la teva carrera.') +
      '<div class="list">' + ids.map((id) => {
        const v = d.ratings[id] || 2; const st = !!(d.stars && d.stars[id]);
        return '<div class="li" style="flex-direction:column;align-items:stretch;gap:10px"><span class="row"><span class="dot" style="background:' + SUBJECTS[id].color + '"></span><span class="t" style="flex:1">' + esc(SUBJECTS[id].name) + '</span>' +
          '<button class="star-btn" aria-pressed="' + st + '" aria-label="' + (st ? 'Treu de les clau: ' : 'Marca com a clau: ') + esc(SUBJECTS[id].short) + '" data-act="toggleStar" data-arg="' + id + '"><svg width="22" height="22" viewBox="0 0 24 24" fill="' + (st ? 'currentColor' : 'none') + '" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg></button></span><div class="seg">' +
          segBtn('Em costa', v === 1, 'rate', id + ':1') + segBtn('Regular', v === 2, 'rate', id + ':2') + segBtn('Bé', v === 3, 'rate', id + ':3') + '</div></div>';
      }).join('') + '</div>' +
      '<span class="small">Les que et costen reben fins a un 45% més de temps, i les clau, un 20% més.</span>';
  } else if (st === 6) {
    const r = getRegion(d.region);
    body = head('On vols entrar?', 'Et direm quanta nota et falta. Ho pots deixar en blanc.') +
      '<div class="list"><div class="field"><label for="f-deg">Grau universitari</label><input id="f-deg" data-bind="draft.degree" value="' + esc(d.degree) + '" placeholder="p. ex. Publicitat i Relacions Públiques"></div>' +
      '<div class="field"><label for="f-cut">Nota de tall de l’últim any (5–14)</label><input id="f-cut" type="number" inputmode="decimal" step="0.001" min="5" max="14" data-bind="draft.cut" value="' + esc(d.cut) + '" placeholder="p. ex. 10,5"></div></div>' +
      section('Universitats públiques · ' + esc(r ? r.name : '')) + '<div class="chips">' + (r ? r.unis : []).concat(['Una altra']).map((u) => chip(u, d.uni === u, 'setUni', u)).join('') + '</div>';
    const pIds = draftPonderable(d);
    if (pIds.length) {
      body += section('Ponderació per al teu grau') + '<div class="list">' + pIds.map((id) => {
        const w = d.ponder && d.ponder[id];
        return '<div class="inline-field"><span style="flex:1">' + esc(SUBJECTS[id].short) + '</span><div class="seg" style="width:200px;flex:0 0 auto;grid-template-columns:1.5fr 1fr 1fr">' +
          segBtn('No ho sé', !w, 'setPonder', id + ':0') + segBtn('×0,1', w === 0.1, 'setPonder', id + ':0.1') + segBtn('×0,2', w === 0.2, 'setPonder', id + ':0.2') + '</div></div>';
      }).join('') + '</div><span class="small">Les que ponderen ×0,2 sumen més nota d’admissió: el pla els dona un 20% més de temps.</span>';
    }
    body += '<span class="small">Les notes de tall i les ponderacions oficials les publica ' + esc(r ? r.organ : 'la teva comunitat') + '.</span>';
  } else if (st === 7) {
    const ex = examDateFor(d);
    const left = diffDays(today(), ex.date);
    body = head('Quan pots estudiar?', ex.estimated ? 'La teva comunitat encara no ha publicat dates. Planificarem cap a l’1 de juny i ho ajustarem quan surtin.' : 'Queden ' + left + ' dies per a la PAU. Repartirem el temari amb el temps que tinguis.') +
      section('Temps al dia') + '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px">' + [[30, '30 min'], [60, '1 h'], [120, '2 h'], [180, '3 h']].map((t) => '<button class="chip" style="border-radius:14px;min-height:52px" aria-pressed="' + (d.minutes === t[0]) + '" data-act="setMinutes" data-arg="' + t[0] + '">' + t[1] + '</button>').join('') + '</div>' +
      section('Dies') + '<div style="display:grid;grid-template-columns:repeat(7,1fr);gap:6px">' + DOW.map((w, i) => '<button class="chip" style="padding:0;min-height:44px" aria-pressed="' + !!d.days[i] + '" aria-label="' + DOW_LONG[i] + '" data-act="toggleDay" data-arg="' + i + '">' + w + '</button>').join('') + '</div>' +
      '<div class="card" style="background:var(--accent-soft)"><span class="small" style="color:#00386B">Consell de professor: deixa almenys un dia de descans a la setmana. Descansar també consolida el que has après.</span></div>';
  }

  const segs = ONB_STEPS - 1;
  const top = st > 0 ? '<div class="topbar"><button class="icon-btn" aria-label="Enrere" data-act="onbBack">' + icon('back', 22) + '</button><div class="progress-seg" style="grid-template-columns:repeat(' + segs + ',1fr);padding-right:44px" role="progressbar" aria-valuemin="1" aria-valuemax="' + segs + '" aria-valuenow="' + st + '">' + Array.from({ length: segs }, (_, i) => '<i class="' + (i < st ? 'on' : '') + '"></i>').join('') + '</div></div>' : '';
  const can = onbCanContinue();
  const last = st === ONB_STEPS - 1;
  const footer = '<div class="footer white">' +
    '<button class="btn block" data-act="' + (last ? 'onbFinish' : 'onbNext') + '"' + (can ? '' : ' disabled') + '>' + (st === 0 ? 'Comença' : last ? (S.profile ? 'Desa i replanifica' : 'Crea el meu pla') : 'Continua') + '</button>' +
    (st === 6 ? '<button class="btn ghost" data-act="onbNext">Omet de moment</button>' : '') +
    (st === 0 && S.profile ? '<button class="btn ghost" data-act="go" data-arg="home">Torna a l’app</button>' : '') + '</div>';
  return '<div class="app white">' + top + '<div class="scroll white">' + body + '</div>' + footer + '</div>';

  function head(t, s) { return '<div class="stack" style="gap:8px;margin-top:8px"><h1 class="title">' + t + '</h1><p class="sub">' + s + '</p></div>'; }
  function section(t) { return '<span class="eyebrow" style="margin-top:4px">' + t + '</span>'; }
  function chip(label, on, act, arg) { return '<button class="chip" aria-pressed="' + on + '" data-act="' + act + '" data-arg="' + esc(arg) + '">' + esc(label) + '</button>'; }
}
function segBtn(label, on, act, arg) { return '<button aria-pressed="' + on + '" data-act="' + act + '" data-arg="' + esc(arg) + '">' + esc(label) + '</button>'; }

/* ---------- Pantalles principals ---------- */
function tabbar() {
  const tabs = [['home', 'home', 'Inici'], ['nota', 'calc', 'Nota'], ['pla', 'cal', 'Pla'], ['practica', 'scroll', 'Scroll'], ['progres', 'chart', 'Progrés']];
  return '<nav class="tabbar" aria-label="Navegació principal">' + tabs.map((t) => '<button data-act="go" data-arg="' + t[0] + '"' + (U.view === t[0] ? ' aria-current="page"' : '') + '>' + icon(t[1], 24) + t[2] + '</button>').join('') + '</nav>';
}

function sessionRow(it, showCheck) {
  const subj = it.subj ? SUBJECTS[it.subj] : null;
  const done = !!S.done[it.id];
  const m = METHOD[it.type];
  return '<div class="session' + (done ? ' done' : '') + '"><div class="box">' +
    (showCheck ? '<button class="check" role="checkbox" aria-checked="' + done + '" aria-label="Marcar com a feta: ' + esc(it.title) + '" data-act="toggleDone" data-arg="' + it.id + '">' + icon('check', 15, '#fff') + '</button>' : '') +
    '<span class="stripe" style="background:' + (subj ? subj.color : '#C7C7CC') + '"></span>' +
    '<button class="grow" style="border:none;background:transparent;padding:0;text-align:left" data-act="openSession" data-arg="' + it.id + '">' +
    '<span style="font-size:12px;font-weight:700;color:' + (subj ? subj.color : 'var(--muted)') + '">' + esc(subj ? subj.short : 'Totes') + ' · ' + m.label + '</span>' +
    '<span class="t" style="font-size:16px;font-weight:600">' + esc(it.title) + '</span>' +
    '<span class="small">' + it.min + ' min</span></button>' +
    '<span style="color:#C7C7CC">' + icon('chevron', 18) + '</span></div></div>';
}

function viewHome() {
  const p = getPlan(); const pr = S.profile; const r = getRegion(pr.region);
  const t = today();
  const left = diffDays(t, p.exam);
  const phase = p.phases.find((x) => t >= x.from && t < x.to);
  const todayPlan = p.days.find((d) => d.date === t);
  const next = p.days.find((d) => d.date > t);
  const due = dueCards().length;
  const totalPast = p.days.filter((d) => d.date <= t).reduce((a, d) => a + d.items.length, 0);
  const donePast = p.days.filter((d) => d.date <= t).reduce((a, d) => a + d.items.filter((i) => S.done[i.id]).length, 0);
  let html = '<div class="between"><div class="stack" style="gap:2px"><span class="eyebrow">' + esc(cap(longDate(t))) + '</span><h1 class="large">Hola, ' + esc(pr.name) + '</h1></div><div class="row" style="gap:8px"><button class="row" style="gap:3px;border:none;background:' + (streakInfo().current ? '#FFF4E5' : 'var(--soft)') + ';color:' + (streakInfo().current ? '#B25000' : 'var(--muted)') + ';border-radius:22px;height:44px;padding:0 12px;font-size:16px;font-weight:800" aria-label="Ratxa: ' + streakInfo().current + ' dies" data-act="go" data-arg="progres">' + icon('flame', 20) + streakInfo().current + '</button><button class="avatar" aria-label="Perfil" data-act="go" data-arg="perfil">' + esc(pr.name.charAt(0).toUpperCase()) + '</button></div></div>';
  html += '<div class="card dark stack" style="gap:12px"><span class="eyebrow">' + nm() + ', et queden</span>' +
    '<div class="row" style="align-items:baseline;gap:8px"><span style="font-size:60px;font-weight:800;letter-spacing:-2px;line-height:1">' + Math.max(0, left) + '</span><span style="font-size:20px;font-weight:600;color:#E5E5EA">dies per a la PAU</span></div>' +
    '<span class="small">' + (p.estimated ? 'Data estimada (1 de juny). ' + esc(r.name) + ' encara no ha publicat el calendari.' : esc(r.name) + ' · ordinària: ' + esc(r.ord) + '.') + (phase ? ' Fase actual: <b style="color:#fff">' + phase.name + '</b>.' : '') + '</span></div>';
  html += streakCard();
  html += '<div class="stack"><div class="between"><h2>El teu dia, ' + nm() + '</h2><button class="btn ghost" style="padding:0" data-act="go" data-arg="pla">Veure el pla</button></div>';
  if (todayPlan) {
    const pend = todayPlan.items.filter((i) => !S.done[i.id]);
    const first = pend[0];
    html += '<span class="small" style="margin-top:-4px;font-size:15px">' + (pend.length ? nm() + ', avui et toquen ' + pend.length + (pend.length === 1 ? ' bloc' : ' blocs') + ' (' + pend.reduce((a, i) => a + i.min, 0) + ' min).' + (first && first.subj ? ' Comença per ' + esc(SUBJECTS[first.subj].short) + '.' : '') : 'Ho has fet tot, ' + nm() + '. Avui ja pots descansar.') + '</span>';
    html += '<div class="stack">' + todayPlan.items.map((i) => sessionRow(i, true)).join('') + '</div>';
    if (todayPlan.reviews.length) html += '<div class="card stack" style="gap:8px"><span class="row" style="gap:8px;color:#4F46E5">' + icon('repeat', 18) + '<b style="font-size:15px;color:var(--ink)">Repàs espaiat d’avui</b></span>' + todayPlan.reviews.slice(0, 6).map((rv) => '<span class="row" style="gap:8px;font-size:14px"><span class="dot" style="background:' + SUBJECTS[rv.subj].color + '"></span>' + esc(SUBJECTS[rv.subj].short) + ': ' + esc(rv.topic) + '</span>').join('') + '<span class="small">Fes-ho durant el bloc de repàs actiu: intenta recordar abans de mirar els apunts.</span></div>';
  } else {
    html += '<div class="card empty">Avui descansa, ' + nm() + '. ' + (next ? 'La pròxima sessió és ' + esc(longDate(next.date)) + '.' : '') + '</div>';
  }
  html += '</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">' +
    '<button class="card stack" style="border:none;text-align:left;gap:8px" data-act="go" data-arg="practica"><span style="width:36px;height:36px;border-radius:10px;background:var(--accent-soft);display:flex;align-items:center;justify-content:center;color:var(--accent)">' + icon('scroll', 20) + '</span><b style="font-size:16px">Scroll</b><span class="small">' + (due ? due + ' targetes per repassar' : 'Llisca i practica') + '</span></button>' +
    '<button class="card stack" style="border:none;text-align:left;gap:8px" data-act="go" data-arg="progres"><span style="width:36px;height:36px;border-radius:10px;background:var(--ok-soft);display:flex;align-items:center;justify-content:center;color:var(--ok)">' + icon('chart', 20) + '</span><b style="font-size:16px">Compliment</b><span class="small">' + (totalPast ? Math.round((donePast / totalPast) * 100) + '% del pla fet fins avui' : 'Encara no hi ha sessions') + '</span></button></div>';
  return html;
}

function viewPla() {
  const p = getPlan(); const t = today();
  if (!U.planDay) U.planDay = t;
  const sel = U.planDay;
  const monday = addDays(sel, -weekdayMon(sel));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const day = p.days.find((d) => d.date === sel);
  const dayHas = (iso) => p.days.some((d) => d.date === iso);
  const phaseNow = p.phases.findIndex((x) => sel >= x.from && sel < x.to);
  let html = '<div class="between"><div class="stack" style="gap:2px"><span class="eyebrow">' + esc(cap(MONTHS[parseIso(sel).getMonth()].replace(/^d(e |’)/, ''))) + ' ' + parseIso(sel).getFullYear() + '</span><h1 class="large">Pla d’estudi</h1></div></div>';
  html += '<div class="card stack" style="gap:10px"><div class="phase-line" style="grid-template-columns:repeat(' + p.phases.length + ',1fr)">' + p.phases.map((ph, i) => '<i class="' + (i < phaseNow ? 'past' : i === phaseNow ? 'now' : '') + '"></i>').join('') + '</div>' +
    (phaseNow >= 0 ? '<div class="between"><b style="font-size:16px">' + p.phases[phaseNow].name + '</b><span class="small">fins al ' + shortDate(addDays(p.phases[phaseNow].to, -1)) + '</span></div><span class="small">' + p.phases[phaseNow].desc + '.</span>' : '<span class="small">Fora del període del pla.</span>') + '</div>';
  html += '<div class="between"><button class="icon-btn" aria-label="Setmana anterior" data-act="weekShift" data-arg="-7">' + icon('back', 22) + '</button><span style="font-size:15px;font-weight:600">' + shortDate(week[0]) + ' – ' + shortDate(week[6]) + '</span><button class="icon-btn" aria-label="Setmana següent" data-act="weekShift" data-arg="7">' + icon('chevron', 22) + '</button></div>';
  html += '<div class="week">' + week.map((iso, i) => '<button aria-pressed="' + (iso === sel) + '" class="' + (dayHas(iso) ? 'has ' : '') + (iso === t ? 'today' : '') + '" aria-label="' + DOW_LONG[i] + ' ' + parseIso(iso).getDate() + '" data-act="pickDay" data-arg="' + iso + '"><span class="w">' + DOW[i] + '</span><span class="n">' + parseIso(iso).getDate() + '</span><span class="p"></span></button>').join('') + '</div>';
  html += '<h2>' + esc(cap(longDate(sel))) + '</h2>';
  if (day) {
    const mins = day.items.reduce((a, i) => a + i.min, 0);
    html += '<span class="small" style="margin-top:-10px">' + mins + ' minuts · ' + day.items.length + ' blocs amb 5 min de descans entre blocs</span>';
    html += '<div class="stack">' + day.items.map((i) => sessionRow(i, sel <= t)).join('') + '</div>';
    if (day.reviews.length) html += '<div class="card stack" style="gap:6px"><b style="font-size:15px">Repàs espaiat</b>' + day.reviews.map((rv) => '<span class="row" style="gap:8px;font-size:14px"><span class="dot" style="background:' + SUBJECTS[rv.subj].color + '"></span>' + esc(SUBJECTS[rv.subj].short) + ': ' + esc(rv.topic) + '</span>').join('') + '</div>';
  } else if (sel >= p.exam) {
    html += '<div class="card empty">' + (sel === p.exam ? 'Avui comença la PAU. Molta sort!' : 'El pla acaba amb la PAU.') + '</div>';
  } else {
    html += '<div class="card empty">Dia de descans.</div>';
  }
  html += '<button class="btn secondary block" data-act="replan">Replanifica des d’avui</button><span class="small" style="text-align:center">Si t’has endarrerit, el pla reparteix el temari que et queda fins a la PAU.</span>';
  return html;
}

/* ---------- Calculadora ---------- */
function admSubjects() {
  const pr = S.profile; const ids = [];
  if (pr.level !== 'cfgs' && pr.modSubject) ids.push(pr.modSubject);
  (pr.admission || []).forEach((x) => { if (!ids.includes(x)) ids.push(x); });
  return ids;
}
function calc() {
  const pr = S.profile; const g = S.grades; const r = getRegion(pr.region);
  const base = num(g.base); const fg = num(g.fg);
  let acces = null; let warn = '';
  if (pr.level === 'cfgs') acces = base;
  else if (base != null && fg != null) {
    if (fg < 4) warn = 'Cal un 4 o més de mitjana a la fase d’accés.';
    else acces = 0.6 * base + 0.4 * fg;
  }
  if (acces != null && acces < 5) warn = warn || 'La nota d’accés ha de ser 5 o més per superar la PAU.';
  const items = admSubjects().map((id) => {
    const a = g.adm[id] || {}; const n = num(a.grade); const w = a.w || 0.1;
    return { id, grade: n, w, val: n != null && n >= 5 ? n * w : 0 };
  }).filter((x) => x.val > 0).sort((a, b) => b.val - a.val);
  let picked = [];
  for (const it of items) {
    if (picked.length >= 2) break;
    if (r && r.rule === 'and-math' && it.w === 0.2 && (it.id === 'mat' || it.id === 'macs') && picked.some((p) => (p.id === 'mat' || p.id === 'macs') && p.w === 0.2)) continue;
    picked.push(it);
  }
  const extra = picked.reduce((a, b) => a + b.val, 0);
  const adm = acces != null && acces >= 5 ? acces + extra : null;
  return { acces, adm, extra, picked, warn };
}
function viewNota() {
  const pr = S.profile; const g = S.grades; const c = calc(); const cut = num(pr.cut);
  let gap = '';
  if (c.adm != null && cut != null) {
    const dlt = c.adm - cut;
    gap = '<span class="badge" style="font-size:14px;padding:6px 12px;margin-top:10px;background:' + (dlt >= 0 ? 'var(--ok-soft);color:var(--ok)' : 'var(--warn-soft);color:var(--warn)') + '">' + (dlt >= 0 ? 'Superes la nota de tall per ' + fmt(dlt) : 'Et falten ' + fmt(-dlt) + ' punts') + '</span>';
  }
  let html = '<div class="stack" style="gap:2px"><span class="eyebrow">' + nm() + '</span><h1 class="large">La meva nota</h1></div>';
  html += '<div class="card stack" style="align-items:center;gap:4px;text-align:center"><span class="eyebrow">Nota d’admissió</span><span id="o-adm" style="font-size:58px;font-weight:800;letter-spacing:-2px;color:var(--accent);line-height:1.05">' + fmt(c.adm) + '</span><span class="small">sobre 14 · nota d’accés <span id="o-acc">' + fmt(c.acces) + '</span></span><span id="o-gap">' + gap + '</span><span id="o-warn" class="small" style="color:var(--warn)">' + esc(c.warn) + '</span></div>';
  html += '<span class="eyebrow">' + (pr.level === 'cfgs' ? 'Accés des del cicle' : 'Fase d’accés') + '</span><div class="list">' +
    numField(pr.level === 'cfgs' ? 'Nota mitjana del cicle' : 'Nota mitjana de batxillerat', 'grades.base', g.base, 5, 10) +
    (pr.level === 'cfgs' ? '' : numField('Fase d’accés de la PAU (mitjana)', 'grades.fg', g.fg, 0, 10)) + '</div>' +
    '<span class="small">' + (pr.level === 'cfgs' ? 'Des d’un CFGS, la nota d’accés és la mitjana del cicle.' : 'Nota d’accés = 60% batxillerat + 40% fase d’accés. Només compta si és 5 o més.') + '</span>';
  html += '<span class="eyebrow">Fase d’admissió · les 2 millors</span><div class="list">' + admSubjects().map((id) => {
    const a = g.adm[id] || {}; const w = a.w || 0.1;
    return '<div class="inline-field"><label for="g-' + id + '" style="flex:1">' + esc(SUBJECTS[id].short) + '</label><input id="g-' + id + '" type="number" inputmode="decimal" step="0.01" min="0" max="10" data-bind="adm.' + id + '" value="' + esc(a.grade || '') + '" placeholder="—"><div class="seg" style="width:116px">' + segBtn('×0,1', w === 0.1, 'setW', id + ':0.1') + segBtn('×0,2', w === 0.2, 'setW', id + ':0.2') + '</div></div>';
  }).join('') + '</div>';
  const r = getRegion(pr.region);
  html += '<span class="small">Només compten les matèries amb un 5 o més. La ponderació (0,1 o 0,2) depèn del grau: consulta la taula oficial de ' + esc(r.organ) + '.' + (r.rule === 'and-math' ? ' A ' + esc(r.name) + ', les dues Matemàtiques no poden ponderar a 0,2 alhora.' : '') + '</span>';
  html += '<span class="eyebrow">Objectiu</span><div class="list">' + numField('Nota de tall' + (pr.degree ? ' · ' + pr.degree : ''), 'profile.cut', pr.cut, 5, 14) + '</div>';
  return html;
  function numField(label, bind, val, min, max) { const id = 'n-' + bind.replace('.', '-'); return '<div class="inline-field"><label for="' + id + '" style="flex:1">' + esc(label) + '</label><input id="' + id + '" type="number" inputmode="decimal" step="0.01" min="' + min + '" max="' + max + '" data-bind="' + bind + '" value="' + esc(val || '') + '" placeholder="—"></div>'; }
}
function refreshCalc() {
  const c = calc(); const cut = num(S.profile.cut);
  const a = $('#o-adm'); if (!a) return;
  a.textContent = fmt(c.adm); $('#o-acc').textContent = fmt(c.acces); $('#o-warn').textContent = c.warn;
  let gap = '';
  if (c.adm != null && cut != null) { const d = c.adm - cut; gap = '<span class="badge" style="font-size:14px;padding:6px 12px;margin-top:10px;background:' + (d >= 0 ? 'var(--ok-soft);color:var(--ok)' : 'var(--warn-soft);color:var(--warn)') + '">' + (d >= 0 ? 'Superes la nota de tall per ' + fmt(d) : 'Et falten ' + fmt(-d) + ' punts') + '</span>'; }
  $('#o-gap').innerHTML = gap;
}

/* ---------- Pràctica ---------- */
const BOX_DAYS = [1, 2, 4, 8, 16, 32];
function practiceSubjects() { return getPlan().subjects.map((s) => s.id).filter((id) => BANK[id]); }
function allCards(subj) { return (BANK[subj] || []).map((q, i) => ({ key: subj + ':' + i, subj, i, q })); }
function dueCards(subj) {
  const t = today(); const ids = subj ? [subj] : practiceSubjects();
  const out = [];
  ids.forEach((s) => allCards(s).forEach((c) => { const st = S.cards[c.key]; if (st && st.due <= t) out.push(c); }));
  return out;
}
function newCards(subj) { return allCards(subj).filter((c) => !S.cards[c.key]); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function grade(key, ok) {
  const st = S.cards[key] || { box: 0 };
  const box = ok ? Math.min(BOX_DAYS.length, (st.box || 0) + 1) : 1;
  S.cards[key] = { box, due: addDays(today(), ok ? BOX_DAYS[box - 1] : 1) };
}
function logQuiz(subj, ok) {
  const q = S.quiz[subj] || { total: 0, correct: 0 };
  q.total++; if (ok) q.correct++;
  S.quiz[subj] = q;
}

function viewPractica() {
  const subs = practiceSubjects();
  const all = getPlan().subjects.map((s) => s.id);
  if (!U.practiceSubj || !subs.includes(U.practiceSubj)) U.practiceSubj = subs[0] || null;
  let html = '<div class="stack" style="gap:2px"><span class="eyebrow">' + nm() + ', posa’t a prova</span><h1 class="large">Practica</h1></div>';
  html += '<div class="seg">' + segBtn('Test', U.practiceMode === 'test', 'pMode', 'test') + segBtn('Flashcards', U.practiceMode === 'flash', 'pMode', 'flash') + '</div>';
  html += '<div class="chips">' + subs.map((id) => '<button class="chip" aria-pressed="' + (U.practiceSubj === id) + '" data-act="pSubj" data-arg="' + id + '">' + esc(SUBJECTS[id].short) + '</button>').join('') + '</div>';
  const missing = all.filter((id) => !BANK[id]);
  if (!U.practiceSubj) return html + '<div class="card empty">Encara no tenim preguntes verificades de les teves matèries.</div>';
  const s = U.practiceSubj;
  if (U.practiceMode === 'test') {
    const st = S.quiz[s];
    html += '<div class="card stack"><b style="font-size:18px">' + esc(SUBJECTS[s].name) + '</b><span class="small">' + BANK[s].length + ' preguntes verificades · ' + (st ? 'portes un ' + Math.round((st.correct / st.total) * 100) + '% d’encerts en ' + st.total + ' respostes' : 'encara no has fet cap test') + '</span><button class="btn block" data-act="startQuiz">Comença el test</button></div>';
  } else {
    const due = dueCards(s).length; const nw = newCards(s).length;
    html += '<div class="card stack"><b style="font-size:18px">' + esc(SUBJECTS[s].name) + '</b><span class="small">' + due + ' per repassar avui · ' + nw + ' noves. Repetició espaiada: cada encert allarga l’interval (1, 2, 4, 8, 16 i 32 dies).</span><button class="btn block" data-act="startFlash"' + (due + nw ? '' : ' disabled') + '>' + (due + nw ? 'Comença' : 'Tot al dia') + '</button></div>';
  }
  if (missing.length) html += '<span class="small">Encara sense banc verificat: ' + missing.map((id) => esc(SUBJECTS[id].short)).join(', ') + '. Fes servir els exàmens oficials de la teva comunitat.</span>';
  return html;
}
function viewQuiz() {
  const z = U.quiz; const it = z.items[z.i];
  if (z.i >= z.items.length) {
    const pct = Math.round((z.score / z.items.length) * 100);
    return '<div class="app">' + topClose('Resultat') + '<div class="scroll"><div class="card stack" style="align-items:center;text-align:center;gap:8px;padding:32px 18px"><span class="eyebrow">' + esc(SUBJECTS[z.subj].short) + '</span><span style="font-size:64px;font-weight:800;letter-spacing:-2px;color:var(--accent)">' + z.score + '/' + z.items.length + '</span><span class="sub">' + (pct >= 80 ? 'Molt bé, ' + nm() + '! Aquest bloc el domines.' : pct >= 60 ? 'Bé, ' + nm() + ', però repassa les que has fallat.' : nm() + ', cal reforçar-ho: el pla et donarà més temps per a aquesta matèria.') + '</span></div><button class="btn block" data-act="startQuiz">Un altre test</button><button class="btn ghost block" data-act="closeOverlay">Tornar</button></div></div>';
  }
  const q = it.q; const ans = z.answer;
  return '<div class="app">' + topClose('Pregunta ' + (z.i + 1) + ' de ' + z.items.length) + '<div class="scroll">' +
    '<div class="bar"><i style="width:' + ((z.i + (ans != null ? 1 : 0)) / z.items.length) * 100 + '%"></i></div>' +
    '<div class="card"><p style="margin:0;font-size:21px;font-weight:700;line-height:1.3;letter-spacing:-.3px">' + esc(q[0]) + '</p></div>' +
    '<div class="stack">' + it.order.map((oi) => {
      let cls = ''; let mark = '';
      if (ans != null) { if (oi === q[2]) { cls = 'right'; mark = 'Correcta'; } else if (oi === ans) { cls = 'wrong'; mark = 'Incorrecta'; } }
      return '<button class="q-opt ' + cls + '" data-act="answer" data-arg="' + oi + '"' + (ans != null ? ' aria-disabled="true"' : '') + '><span>' + esc(q[1][oi]) + '</span><span style="font-size:13px">' + mark + '</span></button>';
    }).join('') + '</div>' +
    (ans != null ? '<div class="card stack"><span style="font-size:15px;line-height:1.5;color:var(--ink2)">' + esc(q[3]) + '</span><button class="btn block" data-act="nextQ">' + (z.i + 1 < z.items.length ? 'Següent' : 'Veure resultat') + '</button></div>' : '') +
    '</div></div>';
}
function viewFlash() {
  const f = U.flash;
  if (f.i >= f.items.length) {
    return '<div class="app">' + topClose('Flashcards') + '<div class="scroll"><div class="card stack" style="align-items:center;text-align:center;padding:32px 18px"><span style="font-size:48px;font-weight:800;color:var(--accent)">' + f.known + '/' + f.items.length + '</span><span class="sub">Sessió acabada, ' + nm() + '. Les que no sabies tornaran demà.</span></div><button class="btn block" data-act="closeOverlay">Tornar</button></div></div>';
  }
  const c = f.items[f.i]; const q = c.q;
  return '<div class="app">' + topClose((f.i + 1) + ' de ' + f.items.length) + '<div class="scroll">' +
    '<button class="flash' + (f.flipped ? ' back' : '') + '" data-act="flip" aria-label="Girar la targeta"><span class="eyebrow" style="color:inherit;opacity:.75">' + (f.flipped ? 'Resposta' : esc(SUBJECTS[c.subj].short)) + '</span><span class="big">' + esc(f.flipped ? q[1][q[2]] : q[0]) + '</span><span style="font-size:14px;opacity:.85;line-height:1.45">' + (f.flipped ? esc(q[3]) : 'Pensa la resposta i toca per girar') + '</span></button>' +
    (f.flipped ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn danger" data-act="flashGrade" data-arg="0">No la sabia</button><button class="btn" style="background:var(--ok-soft);color:var(--ok)" data-act="flashGrade" data-arg="1">La sabia</button></div>' : '') +
    '</div></div>';
}
function topClose(title) { return '<div class="topbar" style="justify-content:space-between;padding-right:12px"><button class="icon-btn" aria-label="Tancar" data-act="closeOverlay">' + icon('close', 22) + '</button><b style="font-size:16px">' + esc(title) + '</b><span style="width:44px"></span></div>'; }


/* ---------- Ratxa ---------- */
const MILESTONES = [3, 7, 14, 30, 50, 75, 100, 150, 200];
function isActive(iso) { return (S.log[iso] || 0) > 0 || (S.act && S.act[iso] || 0) >= 5; }
function isRestDay(iso) { const d = S.profile && S.profile.days; return !!d && !d[weekdayMon(iso)]; }
// Recorregut cronològic: els dies de descans del teu horari no trenquen la ratxa;
// cada 7 dies seguits guanyes un protector (màx. 2) que salva un dia d’estudi perdut.
function streakInfo() {
  const t = today();
  const days = Object.keys(S.log).filter((k) => S.log[k] > 0).concat(Object.keys(S.act || {}).filter((k) => S.act[k] >= 5)).sort();
  const res = { current: 0, best: 0, freezes: 0, todayDone: isActive(t), status: {} };
  if (!days.length) return res;
  let d = days[0]; let cur = 0; let fz = 0; let best = 0;
  while (d <= t) {
    if (isActive(d)) { cur++; res.status[d] = 'done'; if (cur % 7 === 0) fz = Math.min(2, fz + 1); }
    else if (d === t) { res.status[d] = isRestDay(d) ? 'rest' : 'pending'; }
    else if (isRestDay(d)) { res.status[d] = 'rest'; }
    else if (fz > 0 && cur > 0) { fz--; res.status[d] = 'frozen'; }
    else { if (cur > 0) res.status[d] = 'missed'; cur = 0; }
    best = Math.max(best, cur);
    d = addDays(d, 1);
  }
  res.current = cur; res.best = best; res.freezes = fz;
  return res;
}
function streakMessage(si) {
  if (si.todayDone) return 'Molt bé, ' + nm() + ': avui ja has estudiat i la ratxa està assegurada.';
  if (isRestDay(today())) return 'Avui és el teu dia de descans, ' + nm() + ': la ratxa no es trenca.';
  if (si.current > 0) return nm() + ', fes una sessió o 5 preguntes per no perdre la ratxa.';
  return nm() + ', fes una sessió o 5 preguntes avui per començar una ratxa.';
}
function streakCard() {
  const si = streakInfo(); const t = today();
  const monday = addDays(t, -weekdayMon(t));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const hot = si.current > 0;
  const cell = (iso, i) => {
    const st = si.status[iso] || (iso > t ? (isRestDay(iso) ? 'rest' : 'future') : (isRestDay(iso) ? 'rest' : 'none'));
    const map = {
      done: ['#FF9500', '#fff', icon('check', 14, '#fff'), 'fet'],
      frozen: ['#5AC8FA', '#fff', icon('shield', 14, '#fff'), 'protegit'],
      missed: ['#F0F0F2', '#A33A00', '<span style="font-size:13px;font-weight:700">×</span>', 'perdut'],
      pending: ['#FFF4E5', '#B25000', '<span style="width:8px;height:8px;border-radius:4px;background:#FF9500"></span>', 'pendent'],
      rest: ['transparent', '#8E8E93', '<span style="width:10px;height:2px;border-radius:1px;background:#C7C7CC"></span>', 'descans'],
      future: ['#F0F0F2', '#8E8E93', '', 'per fer'],
      none: ['#F0F0F2', '#8E8E93', '', 'sense activitat']
    }[st];
    return '<div class="stack" style="align-items:center;gap:6px"><span style="font-size:12px;font-weight:600;color:' + (iso === t ? 'var(--ink)' : 'var(--muted)') + '">' + DOW[i] + '</span><span aria-label="' + DOW_LONG[i] + ': ' + map[3] + '" role="img" style="width:34px;height:34px;border-radius:17px;background:' + map[0] + ';color:' + map[1] + ';display:flex;align-items:center;justify-content:center;' + (st === 'rest' ? 'border:1.5px dashed #D1D1D6;' : '') + '">' + map[2] + '</span></div>';
  };
  return '<div class="card stack" style="gap:14px">' +
    '<div class="between"><div class="row" style="gap:12px"><span style="width:48px;height:48px;border-radius:14px;background:' + (hot ? 'linear-gradient(160deg,#FFB340,#FF6B00)' : '#F0F0F2') + ';display:flex;align-items:center;justify-content:center;color:' + (hot ? '#fff' : '#8E8E93') + '">' + icon('flame', 28) + '</span>' +
    '<span class="stack" style="gap:0"><span style="font-size:28px;font-weight:800;letter-spacing:-.6px;line-height:1.1">' + si.current + (si.current === 1 ? ' dia' : ' dies') + '</span><span class="small">de ratxa · rècord ' + si.best + '</span></span></div>' +
    '<span class="row" style="gap:4px;color:#0A84C2;font-size:14px;font-weight:700" aria-label="' + si.freezes + ' protectors de ratxa">' + icon('shield', 18) + si.freezes + '</span></div>' +
    '<div style="display:grid;grid-template-columns:repeat(7,1fr)">' + week.map(cell).join('') + '</div>' +
    '<span class="small">' + streakMessage(si) + (si.current > 0 ? ' Cada 7 dies seguits guanyes un protector (màx. 2) que salva un dia que no puguis estudiar.' : '') + '</span></div>';
}
function afterActivity(wasActive, before) {
  const t = today();
  if (wasActive || !isActive(t)) return;
  const si = streakInfo();
  const reached = MILESTONES.filter((x) => si.current >= x && !S.milestones.includes(x));
  const m = reached[reached.length - 1];
  if (m) { S.milestones.push(...reached); save(); U.sheet = { type: 'milestone', n: si.current }; return; }
  const gained = si.freezes > before.freezes;
  toast('Bona feina, ' + S.profile.name + '! Ratxa de ' + si.current + (si.current === 1 ? ' dia' : ' dies') + (gained ? ' · has guanyat un protector' : ''));
}
function withActivity(fn) {
  const was = isActive(today()); const before = streakInfo();
  fn();
  afterActivity(was, before);
}
function sheetMilestone() {
  const n = U.sheet.n;
  return '<div class="sheet-bg" data-act="closeSheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="Nova fita de ratxa" data-stop="1" style="align-items:center;text-align:center;padding-top:28px">' +
    '<span style="width:96px;height:96px;border-radius:28px;background:linear-gradient(160deg,#FFB340,#FF6B00);display:flex;align-items:center;justify-content:center;color:#fff">' + icon('flame', 56) + '</span>' +
    '<span style="font-size:56px;font-weight:800;letter-spacing:-2px;line-height:1">' + n + '</span><h2>dies seguits estudiant</h2>' +
    '<p class="sub">' + nm() + ', la constància és el que més pesa a la PAU. Segueix així!</p>' +
    '<button class="btn block" data-act="closeSheet" style="align-self:stretch">Continua</button></div></div>';
}


/* ---------- Scroll (feed de targetes) ---------- */
function buildBatch(filter) {
  const subs = filter ? [filter] : practiceSubjects();
  if (!subs.length) return [];
  const due = shuffle(dueCards(filter || null).filter((c) => subs.includes(c.subj))).map((c) => ({ kind: 'flash', c }));
  const pools = {};
  const weights = {};
  const plan = getPlan();
  subs.forEach((s) => {
    pools[s] = shuffle(allCards(s));
    const ps = plan.subjects.find((x) => x.id === s);
    weights[s] = ps ? ps.weight : 1;
  });
  const out = due.slice(0, 8);
  const credit = {}; subs.forEach((s) => (credit[s] = 0));
  let last = out.length ? out[out.length - 1].c.subj : null;
  while (out.length < 24 && subs.some((s) => pools[s].length)) {
    const live = subs.filter((s) => pools[s].length);
    const tot = live.reduce((a, s) => a + weights[s], 0);
    live.forEach((s) => (credit[s] += weights[s]));
    let cands = live.filter((s) => s !== last); if (!cands.length) cands = live;
    cands.sort((a, b) => credit[b] - credit[a]);
    const s = cands[0]; credit[s] -= tot; last = s;
    const c = pools[s].shift();
    const st = S.cards[c.key];
    out.push({ kind: st && st.box >= 2 && Math.random() < 0.5 ? 'flash' : 'quiz', c, order: shuffle(c.q[1].map((_, i) => i)) });
  }
  return out;
}
function ensureFeed() {
  if (!U.feed || U.feed.filter !== (U.feedFilter || null)) U.feed = { filter: U.feedFilter || null, items: buildBatch(U.feedFilter), state: {} };
  return U.feed;
}
function answeredToday() { return (S.act && S.act[today()]) || 0; }
function feedCard(it, idx, total) {
  const c = it.c; const q = c.q; const subj = SUBJECTS[c.subj]; const st = U.feed.state[idx] || {};
  let inner = '';
  const head = '<div class="between"><span class="pill" style="color:' + subj.color + ';background:' + subj.color + '14">' + esc(subj.short) + '</span><span class="small" style="font-weight:600">' + (it.kind === 'quiz' ? 'Pregunta' : 'Flashcard') + '</span></div>';
  if (it.kind === 'quiz') {
    const ans = st.answer;
    inner = head + '<p class="fq">' + esc(q[0]) + '</p><div class="stack" style="gap:10px">' + it.order.map((oi) => {
      let cls = ''; let mark = '';
      if (ans != null) { if (oi === q[2]) { cls = 'right'; mark = icon('check', 18); } else if (oi === ans) { cls = 'wrong'; mark = icon('close', 18); } }
      return '<button class="q-opt soft ' + cls + '" data-act="feedAnswer" data-arg="' + idx + ':' + oi + '"' + (ans != null ? ' aria-disabled="true"' : '') + '><span>' + esc(q[1][oi]) + '</span>' + mark + '</button>';
    }).join('') + '</div>' +
    (ans != null ? '<div class="explain"><b>' + (ans === q[2] ? 'Correcte, ' + nm() + '!' : 'No és aquesta.') + '</b> ' + esc(q[3]) + '</div>' : '');
  } else {
    const fl = !!st.flipped;
    inner = head + '<button class="fflip' + (fl ? ' back' : '') + '" style="' + (fl ? 'background:#1D1D1F' : '') + '" data-act="feedFlip" data-arg="' + idx + '" aria-label="Girar la targeta"><span class="eyebrow" style="color:inherit;opacity:.75">' + (fl ? 'Resposta' : 'Pensa la resposta') + '</span><span class="fq" style="margin:0;color:inherit">' + esc(fl ? q[1][q[2]] : q[0]) + '</span><span style="font-size:14px;opacity:.85;line-height:1.45">' + (fl ? esc(q[3]) : 'Toca per girar') + '</span></button>' +
      (fl && st.graded == null ? '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn danger" data-act="feedGrade" data-arg="' + idx + ':0">No la sabia</button><button class="btn" style="background:var(--ok-soft);color:var(--ok)" data-act="feedGrade" data-arg="' + idx + ':1">La sabia</button></div>' : '') +
      (st.graded != null ? '<div class="explain">' + (st.graded ? 'Perfecte. La tornaràs a veure d’aquí uns dies.' : 'Cap problema: demà la tornaràs a veure.') + '</div>' : '');
  }
  const done = st.answer != null || st.graded != null;
  return '<section class="fwrap" aria-label="Targeta ' + (idx + 1) + '"><article class="fcard" style="--c:' + subj.color + '">' + inner +
    '<div class="fhint' + (done ? ' on' : '') + '">' + (done ? icon('back', 16) + ' Llisca cap amunt per a la següent' : (idx + 1) + ' · llisca per saltar') + '</div></article></section>';
}
function viewScroll() {
  const subs = practiceSubjects();
  if (U.feedFilter && !subs.includes(U.feedFilter)) U.feedFilter = null;
  const head = '<div class="feed-head"><div class="between"><div class="stack" style="gap:0"><span class="eyebrow">' + nm() + ' · ' + answeredToday() + ' respostes avui</span><h1 class="large" style="font-size:30px">Scroll</h1></div>' +
    '<span class="row" style="gap:4px;color:#B25000;font-weight:800;font-size:16px;background:#FFF4E5;border-radius:20px;padding:8px 12px">' + icon('flame', 18) + streakInfo().current + '</span></div>' +
    '<div class="chips nowrap"><button class="chip sm" aria-pressed="' + !U.feedFilter + '" data-act="feedFilter" data-arg="">Totes</button>' + subs.map((id) => '<button class="chip sm" aria-pressed="' + (U.feedFilter === id) + '" data-act="feedFilter" data-arg="' + id + '">' + esc(SUBJECTS[id].short) + '</button>').join('') + '</div></div>';
  if (!subs.length) return { head, body: '<div class="card empty" style="margin:16px">Encara no tenim preguntes verificades de les teves matèries.</div>' };
  const f = ensureFeed();
  const body = f.items.map((it, i) => feedCard(it, i, f.items.length)).join('') +
    '<section class="fwrap"><div class="fcard" style="align-items:center;justify-content:center;text-align:center;gap:12px"><span style="color:var(--accent)">' + icon('repeat', 36) + '</span><b style="font-size:20px">Carregant més targetes…</b></div></section>';
  return { head, body };
}
function feedMore() {
  const f = U.feed; if (!f) return;
  f.items = f.items.concat(buildBatch(f.filter));
}

/* ---------- Progrés ---------- */
function viewProgres() {
  const p = getPlan(); const t = today();
  const monday = addDays(t, -weekdayMon(t));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  const mins = week.map((d) => S.log[d] || 0);
  const max = Math.max(60, ...mins);
  const totalMin = Object.values(S.log).reduce((a, b) => a + b, 0);
  const streak = streakInfo().current;
  const past = p.days.filter((x) => x.date <= t);
  const tot = past.reduce((a, x) => a + x.items.length, 0);
  const dn = past.reduce((a, x) => a + x.items.filter((i) => S.done[i.id]).length, 0);
  const hours = (m) => (m >= 60 ? fmt(m / 60, 1) + ' h' : m + ' min');
  let html = '<div class="stack" style="gap:2px"><span class="eyebrow">El teu progrés, ' + nm() + '</span><h1 class="large">Progrés</h1></div>' + streakCard();
  html += '<div class="kpis"><div class="kpi"><span class="l">Aquesta setmana</span><span class="v">' + hours(mins.reduce((a, b) => a + b, 0)) + '</span></div><div class="kpi"><span class="l">Ratxa</span><span class="v">' + streak + (streak === 1 ? ' dia' : ' dies') + '</span></div><div class="kpi"><span class="l">Pla fet</span><span class="v">' + (tot ? Math.round((dn / tot) * 100) : 0) + '%</span></div></div>';
  html += '<div class="card stack" style="gap:14px"><div class="between"><b style="font-size:16px">Minuts d’estudi</b><span class="small">Total: ' + hours(totalMin) + '</span></div><div class="chart" role="img" aria-label="Minuts d’estudi aquesta setmana: ' + week.map((x, i) => DOW_LONG[i] + ' ' + mins[i]).join(', ') + '">' +
    mins.map((m, i) => '<div class="col"><i class="' + (week[i] === t ? 'hi' : '') + '" style="height:' + Math.round((m / max) * 118) + 'px"></i><span>' + DOW[i] + '</span></div>').join('') + '</div><span class="small">Els minuts es compten quan marques una sessió com a feta.</span></div>';
  const subs = p.subjects.map((s) => s.id);
  html += '<div class="card stack" style="gap:14px"><b style="font-size:16px">Encerts als tests</b>';
  const withData = subs.filter((id) => S.quiz[id] && S.quiz[id].total);
  if (!withData.length) html += '<span class="small">Respon targetes a Scroll i aquí veuràs el percentatge per matèria.</span>';
  withData.forEach((id) => { const q = S.quiz[id]; const pc = Math.round((q.correct / q.total) * 100); html += '<div class="stack" style="gap:6px"><div class="between" style="font-size:14px"><b>' + esc(SUBJECTS[id].short) + '</b><span>' + pc + '% · ' + q.total + ' resp.</span></div><div class="bar"><i style="width:' + pc + '%;background:' + SUBJECTS[id].color + '"></i></div></div>'; });
  html += '</div>';
  html += '<div class="card stack" style="gap:14px"><b style="font-size:16px">Temari après</b>' + subs.map((id) => { const n = SUBJECTS[id].topics.length; const dd = Math.min(n, S.topicsDone[id] || 0); return '<div class="stack" style="gap:6px"><div class="between" style="font-size:14px"><b>' + esc(SUBJECTS[id].short) + '</b><span>' + dd + ' de ' + n + ' temes</span></div><div class="bar"><i style="width:' + (dd / n) * 100 + '%;background:' + SUBJECTS[id].color + '"></i></div></div>'; }).join('') + '</div>';
  const weak = withData.filter((id) => S.quiz[id].total >= 8).sort((a, b) => S.quiz[a].correct / S.quiz[a].total - S.quiz[b].correct / S.quiz[b].total)[0];
  if (weak && S.quiz[weak].correct / S.quiz[weak].total < 0.7) html += '<button class="card row" style="border:none;text-align:left" data-act="pSubjGo" data-arg="' + weak + '"><span style="width:36px;height:36px;border-radius:10px;background:var(--warn-soft);color:var(--warn);display:flex;align-items:center;justify-content:center;flex:0 0 auto">' + icon('target', 20) + '</span><span class="grow stack" style="gap:2px;flex:1"><b style="font-size:15px">Punt feble: ' + esc(SUBJECTS[weak].short) + '</b><span class="small">El pla ja li dedica més temps. Practica-la ara.</span></span>' + icon('chevron', 16) + '</button>';
  return html;
}

/* ---------- Perfil ---------- */
function viewPerfil() {
  const pr = S.profile; const r = getRegion(pr.region); const p = getPlan();
  let html = '<div class="row" style="gap:6px;margin-left:-12px"><button class="icon-btn" aria-label="Enrere" data-act="go" data-arg="home">' + icon('back', 22) + '</button></div><h1 class="large" style="margin-top:-8px">' + esc(pr.name) + '</h1>';
  html += regionCard(r);
  const lvl = { batx: '2n de Batxillerat', cfgs: 'CFGS', millora: 'Millora de nota' }[pr.level];
  html += '<div class="list">' + li('Estudis', lvl) + li('Matèries', p.subjects.map((s) => SUBJECTS[s.id].short).join(', ')) + li('Objectiu', (pr.degree || '—') + (pr.cut ? ' · ' + pr.cut : '') + (pr.uni ? ' · ' + pr.uni : '')) + li('Disponibilitat', ({ 30: '30 min', 60: '1 h', 120: '2 h', 180: '3 h' }[pr.minutes]) + ' al dia · ' + pr.days.map((v, i) => (v ? DOW[i] : null)).filter(Boolean).join(' ')) + '</div>';
  html += '<button class="btn secondary block" data-act="editProfile">Edita les meves dades</button>';
  html += '<span class="eyebrow">Les teves dades</span><div class="list">' +
    '<div class="li"><span class="grow"><span class="t">Sincronització</span><span class="d">' + (cloud ? 'Desades al teu compte de Claude' : 'Desades en aquest navegador') + '</span></span></div>' +
    '<button class="li" data-act="copyData"><span class="grow"><span class="t" style="color:var(--accent)">Copia una còpia de seguretat</span><span class="d">Les teves dades en format JSON</span></span></button>' +
    '<button class="li" data-act="askReset"><span class="grow"><span class="t" style="color:var(--warn)">Esborra-ho tot i torna a començar</span></span></button></div>';
  html += '<span class="eyebrow">Fonts oficials</span><div class="card stack" style="gap:8px"><span class="small">Estructura de la PAU: Reial Decret 534/2024. Temari: blocs orientatius del currículum de batxillerat (Reial Decret 243/2022); consulta les orientacions de ' + esc(r.organ) + ' per al detall de cada matèria. Dates verificades el ' + VERIFIED_AT + '.</span>' +
    '<a href="https://www.boe.es/buscar/act.php?id=BOE-A-2024-11878" target="_blank" rel="noopener">Reial Decret 534/2024 (BOE)</a></div>';
  return html;
  function li(k, v) { return '<div class="li"><span class="grow"><span class="d">' + k + '</span><span class="t" style="font-size:15px">' + esc(v) + '</span></span></div>'; }
}

/* ---------- Fulls (sheets) ---------- */
function sheetSession() {
  const it = findItem(U.sheet.id); if (!it) return '';
  const subj = it.subj ? SUBJECTS[it.subj] : null; const m = METHOD[it.type]; const done = !!S.done[it.id];
  const T = U.timer.id === it.id ? U.timer : { running: false, left: it.min * 60, total: it.min * 60 };
  const mm = String(Math.floor(T.left / 60)).padStart(2, '0'); const ss = String(T.left % 60).padStart(2, '0');
  return '<div class="sheet-bg" data-act="closeSheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="' + esc(it.title) + '" data-stop="1"><div class="grabber"></div>' +
    '<div class="stack" style="gap:6px"><span style="font-size:13px;font-weight:700;color:' + (subj ? subj.color : 'var(--muted)') + '">' + esc(subj ? subj.name : 'Totes les matèries') + '</span><h2 style="font-size:24px">' + esc(it.title) + '</h2><span class="small">' + esc(cap(longDate(it.id.split('#')[0]))) + ' · ' + it.min + ' min · ' + m.label + '</span></div>' +
    '<div class="card" style="background:var(--bg)"><div class="row" style="align-items:flex-start;gap:12px"><span style="color:var(--accent)">' + icon(m.icon, 22) + '</span><span class="stack" style="gap:4px"><b style="font-size:15px">Com fer-ho</b><span style="font-size:15px;line-height:1.5;color:var(--ink2)">' + esc(m.tip) + '</span></span></div></div>' +
    '<div class="timer" aria-live="polite">' + mm + ':' + ss + '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><button class="btn secondary" data-act="timerToggle" data-arg="' + it.id + '">' + (T.running ? 'Pausa' : T.left < T.total ? 'Continua' : 'Inicia') + '</button><button class="btn secondary" data-act="timerReset" data-arg="' + it.id + '">Reinicia</button></div>' +
    '<button class="btn block" data-act="toggleDone" data-arg="' + it.id + '">' + (done ? 'Desmarca' : 'Marcar com a feta') + '</button>' +
    (it.subj && BANK[it.subj] ? '<button class="btn ghost block" data-act="pSubjGo" data-arg="' + it.subj + '">Fes Scroll de ' + esc(subj.short) + '</button>' : '') +
    '</div></div>';
}
function sheetConfirm() {
  return '<div class="sheet-bg" data-act="closeSheet"><div class="sheet" role="dialog" aria-modal="true" aria-label="Esborrar dades" data-stop="1"><div class="grabber"></div><h2>Vols esborrar-ho tot?</h2><p class="sub">Perdràs el pla, el progrés i les flashcards. No es pot desfer.</p><button class="btn danger block" data-act="doReset">Esborra-ho tot</button><button class="btn ghost block" data-act="closeSheet">Cancel·la</button></div></div>';
}

/* ---------- Render ---------- */
function render() {
  const root = $('#root');
  const active = document.activeElement; const focusId = active && active.id; const selStart = active && active.selectionStart;
  const screenKey = [U.view, U.step, !!U.quiz, !!U.flash, U.quiz && U.quiz.i, U.flash && U.flash.i].join('|');
  const oldScroll = root.querySelector('.scroll'); const oldTop = oldScroll ? oldScroll.scrollTop : 0;
  const keepScroll = render.lastKey === screenKey; render.lastKey = screenKey;
  let html;
  if (U.view === 'onb' || !S.profile) html = viewOnboarding();
  else if (U.quiz) html = viewQuiz();
  else if (U.flash) html = viewFlash();
  else if (U.view === 'practica') {
    const v = viewScroll();
    html = '<div class="app">' + v.head + '<main class="scroll feed" id="main">' + v.body + '</main>' + tabbar() + '</div>';
  }
  else {
    const body = { home: viewHome, nota: viewNota, pla: viewPla, practica: viewPractica, progres: viewProgres, perfil: viewPerfil }[U.view]();
    html = '<div class="app"><main class="scroll" id="main">' + body + '</main>' + (U.view === 'perfil' ? '' : tabbar()) +
      (U.sheet && U.sheet.type === 'session' ? sheetSession() : '') + (U.sheet && U.sheet.type === 'confirm' ? sheetConfirm() : '') + '</div>';
  }
  if (U.sheet && U.sheet.type === 'milestone' && S.profile && U.view !== 'onb') {
    html = html.replace(/<\/div>$/, sheetMilestone() + '</div>');
  }
  if (U.toast) html = html.replace(/<\/div>$/, '<div class="toast" role="status">' + esc(U.toast) + '</div></div>');
  root.innerHTML = html;
  if (keepScroll) { const sc = root.querySelector('.scroll'); if (sc) sc.scrollTop = oldTop; }
  if (focusId) { const el = document.getElementById(focusId); if (el) { el.focus(); try { if (selStart != null) el.setSelectionRange(selStart, selStart); } catch (e) {} } }
}

/* ---------- Accions ---------- */
function markDone(id) {
  const it = findItem(id); if (!it) return;
  const date = id.split('#')[0];
  if (S.done[id]) {
    delete S.done[id];
    S.log[date] = Math.max(0, (S.log[date] || 0) - it.min);
  } else {
    S.done[id] = true;
    S.log[date] = (S.log[date] || 0) + it.min;
    if (it.type === 'teoria' && it.lastPart) S.topicsDone[it.subj] = Math.max(S.topicsDone[it.subj] || 0, it.topicIdx + 1);
  }
  save();
}
function stopTimer() { clearInterval(U.timer.handle); U.timer.handle = null; U.timer.running = false; }

const ACT = {
  go(a) { U.view = a; U.sheet = null; if (a === 'pla') U.planDay = today(); render(); $('#main') && ($('#main').scrollTop = 0); },
  onbNext() { if (!onbCanContinue()) return; U.step = Math.min(ONB_STEPS - 1, U.step + 1); render(); },
  onbBack() { U.step = Math.max(0, U.step - 1); render(); },
  setRegion(a) { U.draft.region = a; U.draft.uni = null; render(); },
  setLevel(a) { U.draft.level = a; render(); },
  setModality(a) { const m = MODALITIES.find((x) => x.id === a); U.draft.modality = a; U.draft.modSubject = m.options.length === 1 ? m.options[0] : (m.options.includes(U.draft.modSubject) ? U.draft.modSubject : null); U.draft.admission = U.draft.admission.filter((x) => x !== U.draft.modSubject); render(); },
  setModSubject(a) { U.draft.modSubject = a; U.draft.admission = U.draft.admission.filter((x) => x !== a); render(); },
  setHist(a) { U.draft.histOrFil = a; U.draft.admission = U.draft.admission.filter((x) => x !== a); render(); },
  toggleCo() { U.draft.coLangOn = !U.draft.coLangOn; render(); },
  toggleAdm(a) { const d = U.draft; d.admission = d.admission.includes(a) ? d.admission.filter((x) => x !== a) : d.admission.concat(a).slice(0, 3); render(); },
  rate(a) { const [id, v] = a.split(':'); U.draft.ratings[id] = +v; render(); },
  toggleStar(a) { const d = U.draft; d.stars = d.stars || {}; if (d.stars[a]) delete d.stars[a]; else d.stars[a] = true; render(); },
  setPonder(a) { const [id, w] = a.split(':'); const d = U.draft; d.ponder = d.ponder || {}; if (+w) d.ponder[id] = +w; else delete d.ponder[id]; render(); },
  setUni(a) { U.draft.uni = U.draft.uni === a ? null : a; render(); },
  setMinutes(a) { U.draft.minutes = +a; render(); },
  toggleDay(a) { U.draft.days[+a] = !U.draft.days[+a]; render(); },
  onbFinish() {
    if (!onbCanContinue()) return;
    const d = U.draft; d.name = d.name.trim();
    const keep = draftSubjects(d); Object.keys(d.ratings).forEach((k) => { if (!keep.includes(k)) delete d.ratings[k]; });
    d.stars = d.stars || {}; Object.keys(d.stars).forEach((k) => { if (!keep.includes(k)) delete d.stars[k]; });
    const pk = draftPonderable(d); d.ponder = d.ponder || {}; Object.keys(d.ponder).forEach((k) => { if (!pk.includes(k)) delete d.ponder[k]; });
    // La calculadora de Nota parteix de la mateixa ponderació
    Object.keys(d.ponder).forEach((k) => { S.grades.adm[k] = Object.assign({}, S.grades.adm[k], { w: d.ponder[k] }); });
    d.planStart = today(); d.topicsDoneAtStart = Object.assign({}, S.topicsDone);
    S.profile = d; U.draft = null; U.view = 'home'; U.step = 0; planCache = null; save(); render();
  },
  editProfile() { U.draft = newDraft(); U.step = 1; U.view = 'onb'; render(); },
  toggleDone(a) { withActivity(() => markDone(a)); render(); },
  openSession(a) { U.sheet = { type: 'session', id: a }; render(); },
  closeSheet(a, ev) { if (ev && ev.target.closest('[data-stop]') && !ev.target.closest('[data-act="closeSheet"]:not(.sheet-bg)') && ev.target.closest('.sheet')) return; U.sheet = null; render(); },
  timerToggle(a) {
    const it = findItem(a);
    if (U.timer.id !== a) { stopTimer(); U.timer = { running: false, left: it.min * 60, total: it.min * 60, handle: null, id: a }; }
    if (U.timer.running) { stopTimer(); render(); return; }
    U.timer.running = true;
    U.timer.handle = setInterval(() => {
      U.timer.left--;
      if (U.timer.left <= 0) { stopTimer(); U.timer.left = 0; if (!S.done[a]) withActivity(() => markDone(a)); toast('Sessió acabada, ' + S.profile.name + '. Fes 5 minuts de descans.'); }
      if (U.sheet && U.sheet.id === a) { const el = document.querySelector('.timer'); if (el) el.textContent = String(Math.floor(U.timer.left / 60)).padStart(2, '0') + ':' + String(U.timer.left % 60).padStart(2, '0'); }
    }, 1000);
    render();
  },
  timerReset(a) { const it = findItem(a); stopTimer(); U.timer = { running: false, left: it.min * 60, total: it.min * 60, handle: null, id: a }; render(); },
  pickDay(a) { U.planDay = a; render(); },
  weekShift(a) { U.planDay = addDays(U.planDay || today(), +a); render(); },
  replan() {
    S.profile.planStart = today(); S.profile.topicsDoneAtStart = Object.assign({}, S.topicsDone);
    planCache = null; save(); U.planDay = today(); toast('Pla refet des d’avui amb el temari que et queda'); },
  feedFilter(a) { U.feedFilter = a || null; U.feed = null; render(); const m = $('#main'); if (m) m.scrollTop = 0; },
  feedAnswer(a) {
    const [i, oi] = a.split(':').map(Number); const st = U.feed.state[i] = U.feed.state[i] || {};
    if (st.answer != null) return;
    const it = U.feed.items[i]; const ok = oi === it.c.q[2];
    st.answer = oi;
    withActivity(() => { logQuiz(it.c.subj, ok); S.act[today()] = (S.act[today()] || 0) + 1; grade(it.c.key, ok); save(); });
    render();
  },
  feedFlip(a) { const st = U.feed.state[+a] = U.feed.state[+a] || {}; st.flipped = !st.flipped; render(); },
  feedGrade(a) {
    const [i, ok] = a.split(':').map(Number); const st = U.feed.state[i] = U.feed.state[i] || {};
    if (st.graded != null) return;
    const it = U.feed.items[i]; st.graded = !!ok;
    withActivity(() => { grade(it.c.key, !!ok); S.act[today()] = (S.act[today()] || 0) + 1; save(); });
    render();
  },
  pMode(a) { U.practiceMode = a; render(); },
  pSubj(a) { U.practiceSubj = a; render(); },
  pSubjGo(a) { U.feedFilter = a; U.feed = null; U.view = 'practica'; U.sheet = null; render(); },
  startQuiz() {
    const s = U.practiceSubj; const bank = BANK[s];
    const items = shuffle(bank.map((q, i) => ({ q, i }))).slice(0, Math.min(10, bank.length)).map((x) => ({ q: x.q, i: x.i, order: shuffle([0, 1, 2, 3].slice(0, x.q[1].length)) }));
    U.quiz = { subj: s, items, i: 0, answer: null, score: 0 }; render();
  },
  answer(a) {
    const z = U.quiz; if (z.answer != null) return;
    const it = z.items[z.i]; const ok = +a === it.q[2];
    z.answer = +a; if (ok) z.score++;
    withActivity(() => { logQuiz(z.subj, ok); S.act[today()] = (S.act[today()] || 0) + 1; grade(z.subj + ':' + it.i, ok); save(); }); render();
  },
  nextQ() { U.quiz.i++; U.quiz.answer = null; render(); },
  startFlash() {
    const s = U.practiceSubj;
    const items = dueCards(s).concat(shuffle(newCards(s))).slice(0, 15);
    U.flash = { items, i: 0, flipped: false, known: 0 }; render();
  },
  flip() { U.flash.flipped = !U.flash.flipped; render(); },
  flashGrade(a) { const f = U.flash; const c = f.items[f.i]; const ok = a === '1'; withActivity(() => { grade(c.key, ok); S.act[today()] = (S.act[today()] || 0) + 1; save(); }); if (ok) f.known++; f.i++; f.flipped = false; render(); },
  closeOverlay() { U.quiz = null; U.flash = null; render(); },
  setW(a) {
    const [id, w] = a.split(':'); S.grades.adm[id] = Object.assign({}, S.grades.adm[id], { w: +w });
    // Mantén el pla al dia: les que ponderen 0,2 hi reben més temps
    S.profile.ponder = Object.assign({}, S.profile.ponder, { [id]: +w });
    save(); render();
  },
  async copyData() { try { await navigator.clipboard.writeText(JSON.stringify(S)); toast('Còpia de seguretat copiada'); } catch (e) { toast('No s’ha pogut copiar en aquest navegador'); } },
  askReset() { U.sheet = { type: 'confirm' }; render(); },
  doReset() { stopTimer(); S = freshState(); save(); U.view = 'onb'; U.step = 0; U.draft = null; U.sheet = null; planCache = null; render(); }
};

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const act = el.getAttribute('data-act');
  if (act === 'closeSheet' && el.classList.contains('sheet-bg') && ev.target.closest('.sheet')) return;
  if (ACT[act]) ACT[act](el.getAttribute('data-arg'), ev);
});
document.addEventListener('input', (ev) => {
  const el = ev.target; const b = el.getAttribute && el.getAttribute('data-bind'); if (!b) return;
  const [scope, key] = b.split('.');
  if (scope === 'draft') { U.draft[key] = el.value; const btn = document.querySelector('.footer .btn'); if (btn) btn.disabled = !onbCanContinue(); return; }
  if (scope === 'grades') S.grades[key] = el.value;
  else if (scope === 'adm') S.grades.adm[key] = Object.assign({ w: 0.1 }, S.grades.adm[key], { grade: el.value });
  else if (scope === 'profile') { S.profile[key] = el.value; }
  save(); refreshCalc();
});
document.addEventListener('scroll', (ev) => {
  const el = ev.target;
  if (!el.classList || !el.classList.contains('feed') || !U.feed) return;
  if (el.scrollTop + el.clientHeight * 3 >= el.scrollHeight) { feedMore(); render(); }
}, true);
document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape' && U.sheet) { U.sheet = null; render(); } });

render();
initCloud();
})();