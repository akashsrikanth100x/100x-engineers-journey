const test = require('node:test');
const assert = require('node:assert/strict');
const { Journey, metrics, pathX, station, transport, PATHS } = require('../dist/journey-engine.js');
const content = require('../dist/content.js');
function choose(j, path) { assert.equal(j.enter(3), true); j.arrive(); assert.equal(j.choosePath(path), true); j.exit(); j.resume(); }
test('the unchosen road stops at the pathway lodge, including direct jumps', () => {
  const j = new Journey(), m = metrics(1440, 900); j.ready(); j.move(99999, m);
  assert.equal(j.scroll + m.anchor, m.gateY); assert.ok(j.progress < .4); assert.equal(j.enter(4), false); assert.equal(j.enter(9), false);
  assert.equal(j.choosePath('career'), false); choose(j, 'career'); j.move(m.maxScroll, m); assert.equal(j.progress, 1);
});
test('both doors lead to all ten houses and a complete 100x journey', () => {
  for (const path of PATHS) {
    const j = new Journey(), m = metrics(390, 844); j.ready();
    for (let i = 0; i < 10; i++) {
      const stop = station(i, m, path); j.move(stop.scroll, m); assert.equal(j.enter(i), true); j.arrive();
      if (i === 3) assert.equal(j.choosePath(path), true);
      const saved = j.scroll; assert.equal(j.move(m.maxScroll, m), false); j.exit(); j.resume(); assert.equal(j.scroll, saved);
    }
    j.move(m.maxScroll, m); assert.equal(j.progress, 1); assert.equal(j.visitedCount(), 10);
    assert.equal(j.enter(99), false); assert.equal(j.enter(-1), false);
  }
});
test('switching roads retains shared visits and keeps branch visits separate', () => {
  const j = new Journey(); j.ready(); j.enter(0); j.arrive(); j.exit(); j.resume(); choose(j, 'career');
  j.enter(4); j.arrive(); j.exit(); j.resume(); assert.equal(j.visitedCount(), 3);
  choose(j, 'entrepreneurship'); assert.equal(j.visitedCount(), 2); assert.equal(j.hasVisited(0), true); assert.equal(j.hasVisited(4), false);
  assert.equal(j.enter(4, 'career'), false); j.enter(4); j.arrive(); j.exit(); j.resume();
  choose(j, 'career'); assert.equal(j.hasVisited(4), true); assert.equal(j.visitedCount(), 3);
});
test('pathway choice and execution choice are independent', () => {
  const j = new Journey(); j.ready(); choose(j, 'entrepreneurship'); assert.equal(j.chooseExecution('lowcode'), true);
  assert.equal(j.path, 'entrepreneurship'); choose(j, 'career'); assert.equal(j.execution, 'lowcode');
  assert.equal(j.chooseExecution('invalid'), false); assert.equal(j.enter(3), true); j.arrive(); assert.equal(j.choosePath('invalid'), false);
});
test('boat travel connects both shores without teleporting on desktop or mobile', () => {
  for (const [w, h] of [[360, 740], [390, 844], [768, 1024], [1440, 900]]) {
    const m = metrics(w, h);
    for (const path of PATHS) {
      for (const seam of [m.fork, m.forkOpen, m.boatStart, m.boatEnd]) assert.ok(Math.abs(pathX(seam - .01, m, path) - pathX(seam + .01, m, path)) < .1);
      assert.equal(transport(m.boatStart - 1), 'walk'); assert.equal(transport(m.boatStart), 'boat'); assert.equal(transport(m.boatEnd), 'boat'); assert.equal(transport(m.boatEnd + 1), 'walk');
      for (let y = m.fork; y < m.boatEnd + 10; y += 7) { const x = pathX(y, m, path); assert.ok(x > 50 && x < w - 50); }
      assert.equal(pathX(m.boatEnd, m, path), w / 2);
      for (let i = 0; i < 10; i++) { const p = station(i, m, path); assert.ok(p.scroll >= 0 && p.scroll <= m.maxScroll); assert.ok(Math.abs(p.y - p.scroll - m.anchor) < .1); }
    }
  }
});
test('room entry, exit and repeated interactions preserve a coherent state', () => {
  const j = new Journey(); assert.equal(j.enter(0), false); assert.equal(j.exit(), false); j.ready(); j.enter(0);
  assert.equal(j.enter(1), false); assert.equal(j.exit(), false); j.arrive(); assert.equal(j.arrive(), false); j.exit(); assert.equal(j.exit(), false); j.resume();
  j.enter(0); j.arrive(); assert.equal(j.visitedCount(), 1);
});
test('the ten-house content includes every brochure page and all 24 weeks', () => {
  assert.equal(content.HOUSES.length, 10); assert.equal(content.OVERVIEW.length, 10);
  assert.deepEqual(content.HOUSES.map(h => h.name), ['Welcome lodge','LaunchPad house','Creative studio','Pathway house','Build lab','Intelligence library','Agent observatory','Mentor guild','Launch house','Alumni library']);
  assert.deepEqual([...new Set(content.HOUSES.flatMap(h => h.pages))].sort((a,b) => a-b), Array.from({length:27},(_,i)=>i+1));
  const weeks = content.HOUSES.flatMap(h => h.weeks ? Array.from({length:h.weeks[1]-h.weeks[0]+1},(_,i)=>i+h.weeks[0]) : []);
  assert.deepEqual(weeks, Array.from({length:24},(_,i)=>i+1));
  for (const h of content.HOUSES.filter(h => h.kind === 'learning')) { assert.ok(h.goals.career && h.goals.entrepreneurship); assert.ok(h.compare.length >= 4); assert.ok(h.compare.every(r=>r.length===3 && r.every(Boolean))); }
  assert.ok(content.BOOKS.length >= 20); assert.ok(content.BOOKS.every(b => [19,20,21].includes(b.page) && b.name && b.body));
});
