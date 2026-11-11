// Proves del generador del pla i de les dades. Sense dependències.
// Ús: node tests/plan.test.mjs
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
const ctx = { module: { exports: {} } };
vm.createContext(ctx);
vm.runInContext(read('data.js') + '\n' + read('plan.js') + '\n;this.__d = { REGIONS, SUBJECTS, BANK, VERIFIED_AT };', ctx);
const { generatePlan, studentSubjects, addDays, diffDays } = ctx.module.exports;
const { REGIONS, SUBJECTS, BANK } = ctx.__d;

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log('  ✓ ' + name); }
  catch (e) { failed++; console.log('  ✗ ' + name + '\n    ' + e.message); }
}

const base = (extra) => Object.assign({
  region: 'cat', level: 'batx', modSubject: 'mat', foreign: 'eng', histOrFil: 'his',
  admission: ['fis', 'qui'], ratings: {}, minutes: 120,
  days: [true, true, true, true, true, true, false], planStart: '2026-11-16'
}, extra);

console.log('Dades');
test('Les comunitats pendents no tenen data inventada', () => {
  REGIONS.filter((r) => r.status === 'pendent').forEach((r) => assert.equal(r.first, null, r.name));
});
test('Les comunitats amb data tenen un format AAAA-MM-DD vàlid', () => {
  REGIONS.filter((r) => r.first).forEach((r) => assert.match(r.first, /^\d{4}-\d{2}-\d{2}$/, r.name));
});
test('Totes les preguntes del banc tenen el format correcte', () => {
  Object.entries(BANK).forEach(([id, qs]) => {
    assert.ok(SUBJECTS[id], 'matèria inexistent: ' + id);
    qs.forEach((q) => {
      assert.equal(q.length, 4, q[0]);
      assert.ok(Number.isInteger(q[2]) && q[2] >= 0 && q[2] < q[1].length, q[0]);
      assert.equal(new Set(q[1]).size, q[1].length, 'opcions repetides: ' + q[0]);
    });
  });
});

console.log('Matèries i pesos');
test('Catalunya (llengua cooficial): 5 exàmens de fase d’accés', () => {
  assert.equal(studentSubjects(base()).filter((s) => s.role === 'access').length, 5);
});
test('Madrid: 4 exàmens de fase d’accés', () => {
  assert.equal(studentSubjects(base({ region: 'mad' })).filter((s) => s.role === 'access').length, 4);
});
test('Navarra: el basc només hi és si l’ha cursat', () => {
  assert.equal(studentSubjects(base({ region: 'nav' })).filter((s) => s.role === 'access').length, 4);
  assert.equal(studentSubjects(base({ region: 'nav', coLangOn: true })).filter((s) => s.role === 'access').length, 5);
});
test('Pesos: accés 1,0 · modalitat 1,25 · admissió 0,85, per valoració', () => {
  const subs = studentSubjects(base({ ratings: { cas: 1, mat: 3, fis: 2 } }));
  const w = (id) => subs.find((s) => s.id === id).weight;
  assert.ok(Math.abs(w('cas') - 1.45) < 1e-9);
  assert.ok(Math.abs(w('mat') - 1.25) < 1e-9);
  assert.ok(Math.abs(w('fis') - 0.85 * 1.2) < 1e-9);
});
test('Importància: pondera 0,2 (×1,2) i estrella (×1,2) se sumen a la dificultat', () => {
  const subs = studentSubjects(base({ ratings: { fis: 1, qui: 3 }, ponder: { fis: 0.2, qui: 0.1 }, stars: { fis: true } }));
  const w = (id) => subs.find((s) => s.id === id).weight;
  assert.ok(Math.abs(w('fis') - 0.85 * 1.45 * 1.2 * 1.2) < 1e-9);
  assert.ok(Math.abs(w('qui') - 0.85) < 1e-9, 'ponderar 0,1 no suma');
});
test('Una matèria important i difícil rep més temps al pla', () => {
  const imp = generatePlan(base({ ratings: { fis: 1 }, ponder: { fis: 0.2 }, stars: { fis: true } }));
  const nor = generatePlan(base());
  const count = (p) => p.days.flatMap((d) => d.items).filter((i) => i.subj === 'fis' && (i.type === 'teoria' || i.type === 'exercicis')).length;
  assert.ok(count(imp) > count(nor), count(imp) + ' vs ' + count(nor));
});
test('Menys d’un 60% d’encerts multiplica el pes per 1,15', () => {
  const subs = studentSubjects(base({ ratings: { cas: 3 } }), { cas: { total: 10, correct: 5 } });
  assert.ok(Math.abs(subs.find((s) => s.id === 'cas').weight - 1.15) < 1e-9);
});

console.log('Pla d’estudi');
const plan = generatePlan(base());
const all = plan.days.flatMap((d) => d.items.map((it) => Object.assign({ date: d.date, phase: d.phase }, it)));
test('El pla acaba abans de l’examen', () => {
  assert.ok(plan.days.length > 0);
  plan.days.forEach((d) => assert.ok(d.date < plan.exam));
});
test('Inclou les quatre fases en ordre', () => {
  assert.equal(plan.phases.map((p) => p.id).join(','), 'fon,cons,sim,final');
});
test('Repàs final: cap tema nou els últims dies', () => {
  all.filter((it) => it.phase === 'final').forEach((it) => assert.notEqual(it.type, 'teoria', it.date));
  assert.ok(diffDays(plan.phases.at(-1).from, plan.exam) <= 7);
});
test('Pràctica intercalada: mai la mateixa matèria en dos blocs seguits', () => {
  plan.days.forEach((d) => {
    const s = d.items.filter((it) => it.type === 'teoria' || it.type === 'exercicis');
    for (let i = 1; i < s.length; i++) assert.notEqual(s[i].subj, s[i - 1].subj, d.date);
  });
});
test('Es fan simulacres i se’n fa la correcció', () => {
  assert.ok(all.some((it) => it.type === 'simulacre'));
  assert.ok(all.some((it) => it.type === 'correccio' && it.title === 'Correcció del simulacre'));
});
test('Es veu tot el temari de cada matèria', () => {
  plan.subjects.forEach((s) => {
    const seen = new Set(all.filter((it) => it.type === 'teoria' && it.subj === s.id).map((it) => it.topic));
    assert.equal(seen.size, SUBJECTS[s.id].topics.length, s.id);
  });
});
test('Repàs espaiat: cada tema acabat es repassa després', () => {
  const t = all.find((it) => it.type === 'teoria' && it.lastPart);
  const r = plan.days.filter((d) => d.reviews.some((x) => x.subj === t.subj && x.topic === t.topic)).map((d) => d.date);
  assert.ok(r.length >= 3, 'repassos: ' + r.length);
  assert.ok(r[0] >= addDays(t.date, 1) && r[1] >= addDays(t.date, 7) && r[2] >= addDays(t.date, 21));
});
test('Els identificadors de sessió són estables i únics', () => {
  const ids = all.map((it) => it.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.deepEqual(generatePlan(base()).days.flatMap((d) => d.items.map((it) => it.id)), ids);
  ids.forEach((id) => assert.match(id, /^\d{4}-\d{2}-\d{2}#\d+$/));
});
test('Replanificar parteix dels temes ja fets', () => {
  const p = generatePlan(base({ topicsDoneAtStart: { mat: 3 } }));
  const mt = p.days.flatMap((d) => d.items).filter((it) => it.type === 'teoria' && it.subj === 'mat');
  assert.ok(mt.every((it) => it.topicIdx >= 3));
});
test('Dies curts (30 min) també generen un pla vàlid', () => {
  const p = generatePlan(base({ minutes: 30 }));
  assert.ok(p.days.length > 0);
  assert.ok(p.days.flatMap((d) => d.items).some((it) => it.type === 'repas'));
});
test('Si l’examen ja ha passat, el pla és buit', () => {
  assert.equal(generatePlan(base({ planStart: '2027-07-01' })).days.length, 0);
});

console.log('\n' + passed + ' proves correctes, ' + failed + ' fallides');
if (failed) process.exit(1);
