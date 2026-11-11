/* ============================================================
   PAUta · Generador del pla d'estudi
   Principis que aplica (els d'un professor de batxillerat):
   1. Fases: fonaments → consolidació amb exercicis PAU → simulacres
      cronometrats → repàs final sense temari nou.
   2. Pràctica intercalada: no es repeteix matèria en blocs seguits.
   3. Repàs espaiat: cada tema es repassa 1, 7 i 21 dies després.
   4. Més temps a les matèries que pesen més o on vas més fluix.
   5. Blocs curts amb descans i una sessió de recuperació activa diària.
   6. Correcció l'endemà de cada simulacre.
   ============================================================ */

const DAY = 86400000;

function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), dd = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}
function parseIso(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(iso, n) { const d = parseIso(iso); d.setDate(d.getDate() + n); return isoDate(d); }
function diffDays(a, b) { return Math.round((parseIso(b) - parseIso(a)) / DAY); }
// 0 = dilluns … 6 = diumenge
function weekdayMon(iso) { return (parseIso(iso).getDay() + 6) % 7; }

function getRegion(id) { return REGIONS.find((r) => r.id === id) || null; }

function examDateFor(profile) {
  const r = getRegion(profile.region);
  return { date: (r && r.first) || DEFAULT_EXAM, estimated: !(r && r.first) };
}

/* Matèries de l'estudiant amb el seu pes */
function studentSubjects(profile, quizStats) {
  const r = getRegion(profile.region);
  const list = [];
  const add = (id, role, base) => {
    if (!id || !SUBJECTS[id] || list.some((x) => x.id === id)) return;
    const rating = (profile.ratings && profile.ratings[id]) || 2;
    let w = base * ({ 1: 1.45, 2: 1.2, 3: 1.0 }[rating] || 1.2);
    const st = quizStats && quizStats[id];
    if (st && st.total >= 8 && st.correct / st.total < 0.6) w *= 1.15;
    list.push({ id, role, weight: w, rating });
  };
  if (profile.level !== 'cfgs') {
    add('cas', 'access', 1.0);
    if (r && r.coLang && (!r.coOptional || profile.coLangOn)) add(CO_LANG_SUBJECT[r.coLang], 'access', 1.0);
    add(profile.foreign || 'eng', 'access', 1.0);
    add(profile.histOrFil || 'his', 'access', 1.0);
    add(profile.modSubject, 'access', 1.15);
  }
  (profile.admission || []).forEach((id) => add(id, 'admission', profile.level === 'cfgs' ? 1.0 : 0.85));
  return list;
}

function blockLayout(minutes) {
  if (minutes <= 30) return { main: [30], repas: 0 };
  if (minutes <= 60) return { main: [25, 25], repas: 10 };
  if (minutes <= 120) return { main: [35, 35, 35], repas: 15 };
  return { main: [40, 40, 40, 40], repas: 20 };
}

/* Selecció ponderada intercalada (smooth weighted round-robin) */
function makePicker(subjects) {
  const credit = {};
  subjects.forEach((s) => (credit[s.id] = 0));
  return function pick(available, avoid) {
    const pool = subjects.filter((s) => available(s.id));
    if (!pool.length) return null;
    const total = pool.reduce((a, s) => a + s.weight, 0);
    pool.forEach((s) => (credit[s.id] += s.weight));
    let cands = pool.filter((s) => !avoid.includes(s.id));
    if (!cands.length) cands = pool;
    cands.sort((a, b) => credit[b.id] - credit[a.id]);
    const best = cands[0];
    credit[best.id] -= total;
    return best.id;
  };
}

function generatePlan(profile, opts) {
  opts = opts || {};
  const quizStats = opts.quizStats || {};
  const start = profile.planStart || isoDate(new Date());
  const exam = examDateFor(profile);
  const subjects = studentSubjects(profile, quizStats);
  const layout = blockLayout(profile.minutes || 60);
  const days = profile.days || [true, true, true, true, true, false, false];
  const result = { start, exam: exam.date, estimated: exam.estimated, subjects, days: [], phases: [] };
  if (!subjects.length) return result;

  const span = diffDays(start, exam.date);
  if (span <= 0) return result;

  // Fases segons el temps disponible
  const finalDays = Math.min(7, Math.max(2, Math.round(span * 0.1)));
  const simDays = span >= 70 ? 35 : Math.max(0, Math.round(span * 0.25));
  const consDays = Math.max(0, Math.round((span - finalDays - simDays) * 0.3));
  const fonDays = Math.max(0, span - finalDays - simDays - consDays);
  const bounds = {
    fon: [start, addDays(start, fonDays)],
    cons: [addDays(start, fonDays), addDays(start, fonDays + consDays)],
    sim: [addDays(start, fonDays + consDays), addDays(exam.date, -finalDays)],
    final: [addDays(exam.date, -finalDays), exam.date]
  };
  result.phases = [
    { id: 'fon', name: 'Fonaments', desc: 'Aprendre tot el temari tema a tema', from: bounds.fon[0], to: bounds.fon[1] },
    { id: 'cons', name: 'Consolidació', desc: 'Exercicis tipus PAU per blocs', from: bounds.cons[0], to: bounds.cons[1] },
    { id: 'sim', name: 'Simulacres', desc: 'Exàmens complets cronometrats', from: bounds.sim[0], to: bounds.sim[1] },
    { id: 'final', name: 'Repàs final', desc: 'Sense temari nou: repàs i descans', from: bounds.final[0], to: bounds.final[1] }
  ].filter((p) => p.from < p.to);
  const phaseOf = (iso) => (iso < bounds.fon[1] ? 'fon' : iso < bounds.cons[1] ? 'cons' : iso < bounds.sim[1] ? 'sim' : 'final');

  // Dates d'estudi
  const dates = [];
  for (let i = 0; i < span; i++) {
    const iso = addDays(start, i);
    if (days[weekdayMon(iso)] || iso === addDays(exam.date, -1)) dates.push(iso);
  }
  const mainPerDay = layout.main.length;

  // Cua de teoria: sessions per tema segons pes
  const fonBlocks = dates.filter((d) => phaseOf(d) === 'fon').length * mainPerDay;
  const done0 = profile.topicsDoneAtStart || {};
  const remainingTopics = {};
  subjects.forEach((s) => (remainingTopics[s.id] = SUBJECTS[s.id].topics.slice(done0[s.id] || 0).map((t, k) => ({ topic: t, idx: (done0[s.id] || 0) + k }))));
  const demand = subjects.reduce((a, s) => a + s.weight * remainingTopics[s.id].length, 0) || 1;
  const queue = {};
  subjects.forEach((s) => {
    const topics = remainingTopics[s.id];
    const sess = Math.max(topics.length, Math.round((fonBlocks * s.weight * topics.length) / demand));
    const per = topics.length ? sess / topics.length : 0;
    queue[s.id] = [];
    let acc = 0;
    topics.forEach((t) => {
      const before = Math.round(acc); acc += per; const n = Math.max(1, Math.round(acc) - before);
      for (let p = 1; p <= n; p++) queue[s.id].push({ topic: t.topic, idx: t.idx, part: p, parts: n });
    });
  });

  const pick = makePicker(subjects);
  const reviews = {}; // data -> [{subj, topic}]
  const addReview = (iso, subj, topic) => { (reviews[iso] = reviews[iso] || []).push({ subj, topic }); };
  const consIdx = {}; subjects.forEach((s) => (consIdx[s.id] = 0));
  const consCount = {}; subjects.forEach((s) => (consCount[s.id] = 0));
  const simQueue = []; let simWeek = -1; let pendingCorrection = []; let simInProgress = null;
  const finalIdx = { i: 0 };
  let studyDayCounter = 0;

  dates.forEach((iso) => {
    const phase = phaseOf(iso);
    const items = [];
    const used = [];
    const isEve = iso === addDays(exam.date, -1);
    studyDayCounter++;
    const push = (o) => { o.id = iso + '#' + items.length; items.push(o); if (o.subj) used.push(o.subj); };

    if (isEve) {
      push({ type: 'final', subj: null, title: 'Repàs lleuger i descans', detail: 'Mira només esquemes i flashcards. Prepara el material i el DNI. Dorm 8 hores.', min: 30 });
      result.days.push({ date: iso, phase, items, reviews: [] });
      return;
    }

    // 30 min/dia: cada 4t dia d'estudi és de repàs actiu
    const shortRepasDay = layout.repas === 0 && studyDayCounter % 4 === 0 && phase !== 'final';

    if (phase === 'sim') {
      const wk = Math.floor(diffDays(bounds.sim[0], iso) / 7);
      if (wk !== simWeek) {
        simWeek = wk;
        subjects.slice().sort((a, b) => b.weight - a.weight).forEach((s) => { if (!simQueue.includes(s.id)) simQueue.push(s.id); });
      }
    }

    let blocks = layout.main.slice();
    if (shortRepasDay) {
      push({ type: 'repas', subj: null, title: 'Repàs actiu', detail: 'Flashcards pendents i repàs espaiat dels temes recents.', min: blocks[0] });
      blocks = [];
    }

    // Correcció del simulacre d'ahir
    if (phase === 'sim' && pendingCorrection.length && blocks.length) {
      const s = pendingCorrection.shift();
      push({ type: 'correccio', subj: s, title: 'Correcció del simulacre', detail: 'Corregeix amb els criteris oficials i apunta els errors.', min: blocks.shift() });
    }

    // Simulacre (90 min; si el dia és curt, en parts consecutives)
    if (phase === 'sim' && blocks.length && (simInProgress || simQueue.length)) {
      const sum = blocks.reduce((a, b) => a + b, 0);
      if (simInProgress) {
        const sp = simInProgress;
        sp.part++;
        push({ type: 'simulacre', subj: sp.s, title: 'Simulacre (part ' + sp.part + ' de ' + sp.parts + ')', detail: 'Continua l’examen amb el cronòmetre en marxa.', min: sum });
        blocks = [];
        if (sp.part >= sp.parts) { pendingCorrection.push(sp.s); simInProgress = null; }
      } else if (sum >= 90) {
        const s = simQueue.shift();
        let acc = 0; let n = 0;
        while (acc < 90 && n < blocks.length) { acc += blocks[n]; n++; }
        blocks.splice(0, n);
        push({ type: 'simulacre', subj: s, title: 'Simulacre complet', detail: 'Examen oficial d’un any anterior, 90 minuts cronometrats.', min: 90 });
        pendingCorrection.push(s);
      } else if (studyDayCounter % 2 === 0) {
        // Dies curts: simulacre en parts cada dos dies d’estudi
        const s = simQueue.shift();
        const parts = Math.ceil(90 / sum);
        push({ type: 'simulacre', subj: s, title: 'Simulacre (part 1 de ' + parts + ')', detail: 'Fes l’examen per parts amb el cronòmetre en marxa.', min: sum });
        blocks = [];
        if (parts > 1) simInProgress = { s, part: 1, parts }; else pendingCorrection.push(s);
      }
    }

    blocks.forEach((len) => {
      // Teoria només si hi ha una matèria diferent de la del bloc anterior (pràctica intercalada)
      const last = used[used.length - 1];
      const theoryOk = (id) => queue[id].length > 0 && id !== last;
      if ((phase === 'fon' || phase === 'cons') && Object.keys(queue).some(theoryOk)) {
        const s = pick(theoryOk, []);
        if (s) {
          const q = queue[s].shift();
          const title = q.parts > 1 ? q.topic + ' (' + q.part + '/' + q.parts + ')' : q.topic;
          push({ type: 'teoria', subj: s, topic: q.topic, topicIdx: q.idx, lastPart: q.part === q.parts, title, detail: 'Estudia el tema i fes-ne l’esquema.', min: len });
          if (q.part === q.parts) { addReview(addDays(iso, 1), s, q.topic); addReview(addDays(iso, 7), s, q.topic); addReview(addDays(iso, 21), s, q.topic); }
          return;
        }
      }
      if (phase === 'final') {
        const s = subjects[finalIdx.i++ % subjects.length].id;
        push({ type: 'final', subj: s, title: 'Repàs final', detail: 'Esquemes, fórmules i flashcards. Res de temari nou.', min: len });
        return;
      }
      // Consolidació (i blocs lliures dels simulacres): exercicis per tema
      const s = pick(() => true, used.slice(-1));
      consCount[s]++;
      if (consCount[s] % 4 === 0) {
        push({ type: 'correccio', subj: s, title: 'Llista d’errors', detail: 'Torna a fer els exercicis que vas fallar.', min: len });
      } else {
        const topics = SUBJECTS[s].topics;
        const t = topics[consIdx[s]++ % topics.length];
        push({ type: 'exercicis', subj: s, topic: t, title: 'Exercicis PAU: ' + t, detail: 'Exercicis d’exàmens oficials d’aquest bloc.', min: len });
      }
    });

    if (layout.repas && !shortRepasDay) {
      push({ type: 'repas', subj: null, title: 'Repàs actiu', detail: 'Flashcards pendents i repàs espaiat.', min: layout.repas });
    }
    result.days.push({ date: iso, phase, items, reviews: [] });
  });

  // Assigna repassos espaiats al dia d'estudi següent disponible
  const dayIndex = {}; result.days.forEach((d, i) => (dayIndex[d.date] = i));
  Object.keys(reviews).sort().forEach((iso) => {
    let target = result.days.find((d) => d.date >= iso && d.date < addDays(exam.date, -1));
    if (target) target.reviews.push(...reviews[iso]);
  });
  return result;
}

if (typeof module !== 'undefined') module.exports = { generatePlan, studentSubjects, isoDate, addDays, diffDays, examDateFor, getRegion, blockLayout };