const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { Journey, metrics, HOUSE_Y, PATHS } = require('../dist/journey-engine.js');
const { META, STAGES, atPosition } = require('../dist/exploration.js');
const { HOUSES } = require('../dist/content.js');
const ids = ['overview', 'work', 'support'];
function visit(j, i, discoveries = ids, route) {
  assert.equal(j.enter(i), true); j.arrive();
  discoveries.forEach(id => j.discover(id));
  if (i === 3) j.choosePath(route || 'career');
  j.exit(); j.resume();
}
test('scrolling and the loading screen earn no exploration points', () => {
  const j = new Journey(), m = metrics(390, 844);
  assert.equal(j.explorationScore(), 0); assert.equal(j.discover('overview'), 0);
  j.ready(); j.move(m.maxScroll, m); assert.equal(j.explorationScore(), 0);
  visit(j, 3, [], 'career'); const earned = j.explorationScore();
  j.move(m.maxScroll, m); assert.equal(j.progress, 1); assert.equal(j.explorationScore(), earned);
});
test('each hut awards four on arrival and two per first discovery, with state guards', () => {
  const j = new Journey(); j.ready(); j.enter(0);
  assert.equal(j.explorationScore(), 0); assert.equal(j.discover('work'), 0);
  j.arrive(); assert.equal(j.explorationScore(), 4);
  assert.equal(j.discover('unknown'), 0);
  for (const id of ids) { assert.equal(j.discover(id), 2); assert.equal(j.discover(id), 0); }
  assert.equal(j.houseScore(0), 10); assert.equal(j.explorationScore(), 10);
  j.exit(); assert.equal(j.discover('support'), 0); j.resume();
  visit(j, 0); assert.equal(j.explorationScore(), 10);
});
test('either complete route earns 100x and gear unlocks at the stated thresholds', () => {
  for (const route of PATHS) {
    const j = new Journey(); j.ready();
    for (let i = 0; i < 10; i++) {
      visit(j, i, ids, route); assert.equal(j.explorationScore(), (i + 1) * 10);
      assert.deepEqual(j.gear().map(g => g.id), i < 1 ? [] : i < 4 ? ['toolkit'] : i < 9 ? ['toolkit', 'backpack'] : ['toolkit', 'backpack', 'badge']);
    }
    for (let i = 0; i < 10; i++) visit(j, i, ids, route);
    assert.equal(j.explorationScore(), 100);
  }
});
test('changing roads cannot farm points or remove previous discoveries', () => {
  const j = new Journey(); j.ready(); visit(j, 3, ids, 'career'); visit(j, 4);
  const earned = j.explorationScore(); visit(j, 3, ids, 'entrepreneurship');
  assert.equal(j.explorationScore(), earned); assert.equal(j.hasVisited(4), false);
  assert.equal(j.hasDiscovered(4, 'overview'), true); visit(j, 4);
  assert.equal(j.explorationScore(), earned); assert.equal(j.hasVisited(4), true);
});
test('the timeline and discovery objects cover all ten houses with real assets', () => {
  assert.equal(META.length, HOUSES.length); assert.equal(STAGES.length, 4);
  assert.equal(new Set(META.map(h => h.asset)).size, 10);
  const files = new Set(['gear-toolkit', 'gear-backpack', 'gear-badge']);
  META.forEach((h, i) => {
    assert.ok(h.phase >= 0 && h.phase < 4 && h.when && h.focus && h.outcome);
    assert.deepEqual(h.objects.map(o => o[0]), ids);
    assert.ok(h.objects.every(o => o.length === 4 && o.every(Boolean)));
    files.add(h.asset); h.objects.forEach(o => files.add(o[1]));
    assert.equal(atPosition(HOUSE_Y[i], HOUSE_Y), i);
  });
  for (const f of files) assert.ok(fs.statSync(path.join(__dirname, '../dist/assets', f + '.webp')).size > 1000, f);
  assert.equal(META[0].phase, 0); assert.equal(META[1].phase, 1); assert.equal(META[9].phase, 3);
  assert.match(META[7].when, /Throughout months 1–6/);
});
