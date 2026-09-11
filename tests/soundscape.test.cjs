const test = require('node:test');
const assert = require('node:assert/strict');
const { Soundscape, mixFor } = require('../dist/audio.js');

// Exercise scheduling and lifecycle without a browser or speaker side effects.
class Param {
  constructor(value = 0) { this.value = value; }
  cancelScheduledValues() {}
  setValueAtTime(v) { assert.ok(Number.isFinite(v)); this.value = v; }
  setTargetAtTime(v) { this.setValueAtTime(v); }
  linearRampToValueAtTime(v) { this.setValueAtTime(v); }
  exponentialRampToValueAtTime(v) { assert.ok(v > 0); this.setValueAtTime(v); }
}
class Node {
  constructor() { for (const key of ['gain', 'frequency', 'Q', 'pan', 'threshold', 'knee', 'ratio', 'attack', 'release']) this[key] = new Param(); }
  connect() {}
  disconnect() {}
  start(time = 0, offset = 0) { assert.ok(time >= 0 && offset >= 0); }
  stop(time) { assert.ok(Number.isFinite(time)); }
}
class Context {
  constructor() { this.state = 'suspended'; this.currentTime = 0; this.sampleRate = 8000; this.destination = new Node(); }
  createGain() { return new Node(); }
  createDynamicsCompressor() { return new Node(); }
  createBufferSource() { return new Node(); }
  createBiquadFilter() { return new Node(); }
  createOscillator() { return new Node(); }
  createConvolver() { return new Node(); }
  createStereoPanner() { return new Node(); }
  createBuffer(channels, length) { const data = Array.from({ length: channels }, () => new Float32Array(length)); return { getChannelData: n => data[n] }; }
  async resume() { this.state = 'running'; }
  async suspend() { this.state = 'suspended'; }
}
const road = { enabled: true, hidden: false, phase: 'road', river: 0, boat: false, map: false };

test('jazz is the only audio bus and the world is silent outside huts', async () => {
  for (const phase of ['boot', 'road', 'entering', 'exiting']) assert.deepEqual(mixFor({ ...road, phase }), { master: 0, jazz: 0 });
  assert.ok(mixFor({ ...road, phase: 'room' }).jazz > 0);
  for (const change of [{ enabled: false }, { hidden: true }, { overlay: true }]) assert.deepEqual(mixFor({ ...road, phase: 'room', ...change }), { master: 0, jazz: 0 });
  const audio = new Soundscape({ Context }); await audio.toggle(); audio.stopClock();
  assert.deepEqual(Object.keys(audio.buses), ['jazz']);
  audio.setScene({ phase: 'road' }); audio.tick(); assert.equal(audio.musicStep, 0); assert.equal(audio.outputConnected, false); assert.equal(audio.tickTimer, null);
  audio.setScene({ phase: 'room' }); audio.tick(); assert.ok(audio.musicStep > 0); assert.equal(audio.outputConnected, true);
  audio.setScene({ phase: 'exiting' }); assert.equal(audio.master.gain.value, 0); assert.equal(audio.buses.jazz.gain.value, 0); assert.equal(audio.outputConnected, false); assert.equal(audio.tickTimer, null);
  await audio.toggle(); clearTimeout(audio.suspendTimer);
});

test('all eight jazz bars schedule successfully; music restarts on each entry', async () => {
  const audio = new Soundscape({ Context }); await audio.toggle(); audio.stopClock();
  audio.setScene({ phase: 'room' });
  for (let step = 0; step < 64; step++) audio.jazzStep(step, step * .4);
  audio.tick(); assert.ok(audio.musicStep > 0);
  audio.setScene({ phase: 'road' }); audio.musicStep = 23; audio.ctx.currentTime = 10;
  audio.setScene({ phase: 'room' }); assert.equal(audio.musicStep, 1); assert.ok(audio.nextNote >= 10);
  await audio.toggle(); clearTimeout(audio.suspendTimer);
});

test('tab hiding suspends audio; return resumes only when enabled; mute stays muted', async () => {
  const audio = new Soundscape({ Context }); await audio.toggle(); audio.setScene({ phase: 'room' });
  await audio.setHidden(true); assert.equal(audio.ctx.state, 'suspended'); assert.equal(audio.tickTimer, null);
  await audio.setHidden(false); assert.equal(audio.ctx.state, 'running'); assert.ok(audio.tickTimer);
  await audio.toggle(); assert.equal(audio.state.enabled, false); assert.equal(audio.master.gain.value, 0); assert.equal(audio.tickTimer, null);
  clearTimeout(audio.suspendTimer); await audio.ctx.suspend();
  await audio.setHidden(true); await audio.setHidden(false); assert.equal(audio.ctx.state, 'suspended');
});

test('autoplay rejection is recoverable without changing journey state', async () => {
  class Blocked extends Context { async resume() { throw new Error('NotAllowedError'); } }
  const audio = new Soundscape({ Context: Blocked }); audio.setScene({ phase: 'road' });
  await audio.toggle(); assert.equal(audio.state.enabled, false); assert.equal(audio.pending, false); assert.equal(audio.state.phase, 'road'); assert.equal(audio.tickTimer, null);
});
