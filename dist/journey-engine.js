(function (root) {
  'use strict';
  const PATHS = ['entrepreneurship', 'career'];
  const HOUSE_Y = [860, 1650, 2440, 3350, 4300, 5160, 6020, 8250, 9040, 9830];
  const FORK = 3520, FORK_OPEN = 4000, BOAT_START = 6620, BOAT_END = 7280;
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  const mix = (a, b, t) => a + (b - a) * t;
  const smooth = t => t * t * (3 - 2 * t);
  function metrics(width, height) {
    return { width, height, worldHeight: 11100, anchor: clamp(height * .54, 280, 540),
      maxScroll: Math.max(1, 11100 - height), amplitude: Math.min(width * .13, 185),
      fork: FORK, forkOpen: FORK_OPEN, riverTop: 6500, riverHeight: 900,
      boatStart: BOAT_START, boatEnd: BOAT_END, gateY: HOUSE_Y[3] + 100 };
  }
  function commonX(y, m) {
    if (y <= FORK) {
      const wave = Math.sin((y - 310) / 560) * m.amplitude;
      return m.width * .5 + wave * (1 - smooth(clamp((y - 2800) / (FORK - 2800), 0, 1)));
    }
    return m.width * .5 + Math.sin((y - BOAT_END) / 600) * m.amplitude;
  }
  function branchX(y, m, path) {
    const sign = path === 'career' ? 1 : -1;
    return m.width * (.5 + sign * .20) + Math.sin((y - FORK_OPEN) / 490) * Math.min(m.width * .032, 45);
  }
  function pathX(y, m, path) {
    if (y <= FORK || y >= BOAT_END) return commonX(y, m);
    if (!PATHS.includes(path)) return m.width * .5;
    if (y < FORK_OPEN) return mix(m.width * .5, branchX(y, m, path), smooth((y - FORK) / (FORK_OPEN - FORK)));
    if (y <= BOAT_START) return branchX(y, m, path);
    return mix(branchX(BOAT_START, m, path), m.width * .5, smooth((y - BOAT_START) / (BOAT_END - BOAT_START)));
  }
  function isBranch(index) { return index >= 4 && index <= 6; }
  function station(index, m, path) {
    const y = HOUSE_Y[index];
    let x;
    if (index === 3) x = m.width * .5;
    else if (isBranch(index)) x = path === 'career' ? m.width - Math.max(64, m.width * .12) : Math.max(64, m.width * .12);
    else x = m.width * (index % 2 === 0 ? .19 : .81);
    return { y, x, path: isBranch(index) ? path : null, scroll: clamp(y - m.anchor, 0, m.maxScroll) };
  }
  function transport(y) { return y >= BOAT_START && y <= BOAT_END ? 'boat' : 'walk'; }
  class Journey {
    constructor(count = 10) { this.count = count; this.phase = 'boot'; this.progress = 0; this.house = null; this.path = null; this.execution = 'code'; this.visited = new Set(); this.earnedVisits = new Set(); this.discoveries = new Set(); this.scroll = 0; }
    ready() { if (this.phase !== 'boot') return false; this.phase = 'road'; return true; }
    move(scroll, m) {
      if (this.phase !== 'road') return false;
      const limit = this.path ? m.maxScroll : Math.max(0, m.gateY - m.anchor);
      this.scroll = clamp(scroll, 0, limit); this.progress = this.scroll / m.maxScroll; return true;
    }
    enter(index, path = this.path) {
      if (this.phase !== 'road' || !Number.isInteger(index) || index < 0 || index >= this.count) return false;
      if (index > 3 && !this.path) return false;
      if (isBranch(index) && path !== this.path) return false;
      this.phase = 'entering'; this.house = index; return true;
    }
    arrive() {
      if (this.phase !== 'entering') return false;
      this.phase = 'room'; this.visited.add(this.key(this.house)); this.earnedVisits.add(this.house); return true;
    }
    choosePath(path) {
      if (this.phase !== 'room' || this.house !== 3 || !PATHS.includes(path)) return false;
      this.path = path; return true;
    }
    chooseExecution(path) { if (!['code', 'lowcode'].includes(path)) return false; this.execution = path; return true; }
    key(index, path = this.path) { return isBranch(index) ? `${index}:${path}` : String(index); }
    hasVisited(index, path = this.path) { return this.visited.has(this.key(index, path)); }
    visitedCount() { return Array.from({ length: this.count }, (_, i) => this.hasVisited(i)).filter(Boolean).length; }
    discover(id) {
      if (this.phase !== 'room' || !['overview', 'work', 'support'].includes(id)) return 0;
      const key = `${this.house}:${id}`; if (this.discoveries.has(key)) return 0;
      this.discoveries.add(key); return 2;
    }
    hasDiscovered(index, id) { return this.discoveries.has(`${index}:${id}`); }
    houseScore(index) { return (this.earnedVisits.has(index) ? 4 : 0) + ['overview', 'work', 'support'].filter(id => this.hasDiscovered(index, id)).length * 2; }
    explorationScore() { return Math.min(100, this.earnedVisits.size * 4 + this.discoveries.size * 2); }
    gear() { const score = this.explorationScore(); return [{ id: 'toolkit', label: 'Builder toolkit', at: 20 }, { id: 'backpack', label: 'Explorer backpack', at: 50 }, { id: 'badge', label: '100x explorer badge', at: 100 }].filter(item => score >= item.at); }
    exit() { if (this.phase !== 'room') return false; this.phase = 'exiting'; return true; }
    resume() { if (this.phase !== 'exiting') return false; this.phase = 'road'; this.house = null; return true; }
  }
  const api = { PATHS, HOUSE_Y, clamp, metrics, commonX, pathX, station, isBranch, transport, Journey };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.JourneyEngine = api;
})(typeof window !== 'undefined' ? window : this);
