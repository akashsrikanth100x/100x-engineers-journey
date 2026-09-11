/* Original hut jazz, synthesized locally. The rest of the village is silent. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VillageAudio = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const hz = midi => 440 * 2 ** ((midi - 69) / 12);
  function mixFor(state) {
    const audible = state.enabled && state.phase === 'room' && !state.hidden && !state.overlay;
    return { master: audible ? .58 : 0, jazz: audible ? .38 : 0 };
  }
  class Soundscape {
    constructor(options = {}) {
      this.Context = options.Context || globalThis.AudioContext || globalThis.webkitAudioContext;
      this.onChange = options.onChange || (() => {});
      this.state = { enabled: false, hidden: false, overlay: false, phase: 'boot' };
      this.ctx = null; this.buses = {}; this.tickTimer = null; this.suspendTimer = null; this.outputConnected = false;
      this.musicStep = 0; this.nextNote = 0; this.pending = false;
      this.seed = 731;
    }
    random() { this.seed = (this.seed * 1664525 + 1013904223) >>> 0; return this.seed / 4294967296; }
    notify(message = '') { this.onChange({ enabled: this.state.enabled, supported: !!this.Context, pending: this.pending, message }); }
    init() {
      if (this.ctx) return;
      this.ctx = new this.Context(); const c = this.ctx;
      this.master = c.createGain(); this.master.gain.value = 0;
      const limiter = c.createDynamicsCompressor(); limiter.threshold.value = -12; limiter.knee.value = 14; limiter.ratio.value = 5; limiter.attack.value = .008; limiter.release.value = .25;
      this.output = limiter; limiter.connect(c.destination);
      const jazz = c.createGain(); jazz.gain.value = 0; jazz.connect(this.master); this.buses.jazz = jazz;
      this.noise = c.createBuffer(2, c.sampleRate * 4, c.sampleRate);
      for (let channel = 0; channel < 2; channel++) { const data = this.noise.getChannelData(channel); for (let i = 0; i < data.length; i++) data[i] = this.random() * 2 - 1; }
      // A short, dark room tail gives the original electric-piano voicings warmth.
      const impulse = c.createBuffer(2, Math.floor(c.sampleRate * 1.15), c.sampleRate);
      for (let channel = 0; channel < 2; channel++) { const data = impulse.getChannelData(channel); for (let i = 0; i < data.length; i++) data[i] = (this.random() * 2 - 1) * (1 - i / data.length) ** 3 * .35; }
      this.reverb = c.createConvolver(); this.reverb.buffer = impulse; const wet = c.createGain(); wet.gain.value = .2; this.reverb.connect(wet); wet.connect(this.buses.jazz);
    }
    ramp(param, value, seconds = .28) {
      const now = this.ctx.currentTime; param.cancelScheduledValues(now); param.setTargetAtTime(value, now, seconds);
    }
    apply() {
      if (!this.ctx) return;
      const mix = mixFor(this.state);
      if (!mix.master) {
        // Disconnect the output rather than relying on an asymptotic fade to zero.
        // This also cuts scheduled notes and reverb immediately on hut exit.
        this.stopClock();
        for (const gain of [this.master.gain, this.buses.jazz.gain]) {
          gain.cancelScheduledValues(this.ctx.currentTime);
          gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.outputConnected) { this.master.disconnect(); this.outputConnected = false; }
        return;
      }
      if (!this.outputConnected) { this.master.connect(this.output); this.outputConnected = true; }
      this.ramp(this.master.gain, mix.master, .04);
      this.ramp(this.buses.jazz.gain, mix.jazz, .2);
      if (!this.tickTimer) this.startClock();
    }
    async toggle() {
      if (this.pending) return;
      if (!this.Context) { this.notify('Jazz is unavailable in this browser.'); return; }
      if (this.state.enabled) {
        this.state.enabled = false; this.apply(); this.stopClock(); this.notify();
        this.suspendTimer = setTimeout(() => { if (!this.state.enabled) this.ctx?.suspend().catch(() => {}); }, 220);
        return;
      }
      this.pending = true; this.notify(); clearTimeout(this.suspendTimer);
      try {
        this.init(); await this.ctx.resume();
        if (this.ctx.state !== 'running') throw new Error('Audio paused');
        this.state.enabled = true; this.nextNote = this.ctx.currentTime + .08; this.musicStep = 0; this.apply(); this.startClock();
      } catch (_) { this.state.enabled = false; this.notify('Tap Jazz again to start music.'); }
      finally { this.pending = false; this.notify(); }
    }
    setScene(values) {
      const wasRoom = this.state.phase === 'room'; Object.assign(this.state, values);
      if (this.ctx && !wasRoom && this.state.phase === 'room') { this.musicStep = 0; this.nextNote = this.ctx.currentTime + .08; }
      this.apply();
    }
    async setHidden(hidden) {
      this.state.hidden = hidden; this.apply();
      if (!this.ctx || !this.state.enabled) return;
      if (hidden) { this.stopClock(); await this.ctx.suspend().catch(() => {}); }
      else {
        try { await this.ctx.resume(); if (this.ctx.state !== 'running') throw new Error('Audio paused'); this.nextNote = this.ctx.currentTime + .08; this.apply(); this.startClock(); }
        catch (_) { this.state.enabled = false; this.apply(); this.notify('Tap Jazz to resume.'); }
      }
    }
    startClock() {
      this.stopClock();
      if (!this.ctx || this.ctx.state !== 'running' || !mixFor(this.state).master) return;
      this.tickTimer = setInterval(() => this.tick(), 90); this.tick();
    }
    stopClock() { clearInterval(this.tickTimer); this.tickTimer = null; }
    noiseHit(bus, time, duration, volume, frequency, type = 'bandpass', pan = 0) {
      const c = this.ctx, s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), p = c.createStereoPanner();
      s.buffer = this.noise; f.type = type; f.frequency.value = frequency; f.Q.value = .6; p.pan.value = pan;
      g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(volume, time + .008); g.gain.exponentialRampToValueAtTime(.0001, time + duration);
      s.connect(f); f.connect(g); g.connect(p); p.connect(this.buses[bus]); s.start(time, this.random() * 2); s.stop(time + duration + .03);
      s.onended = () => { s.disconnect(); f.disconnect(); g.disconnect(); p.disconnect(); };
    }
    tone(bus, time, frequency, duration, volume, type = 'sine', endFrequency = frequency, pan = 0) {
      const c = this.ctx, o = c.createOscillator(), g = c.createGain(), p = c.createStereoPanner(); o.type = type; p.pan.value = pan;
      o.frequency.setValueAtTime(frequency, time); o.frequency.exponentialRampToValueAtTime(endFrequency, time + duration);
      g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(volume, time + .012); g.gain.exponentialRampToValueAtTime(.0001, time + duration);
      o.connect(g); g.connect(p); p.connect(this.buses[bus]); o.start(time); o.stop(time + duration + .04);
      o.onended = () => { o.disconnect(); g.disconnect(); p.disconnect(); };
    }
    piano(time, midi, volume, duration = 1.7) {
      const c = this.ctx, g = c.createGain(), p = c.createStereoPanner(); p.pan.value = clamp((midi - 63) / 35, -.6, .6);
      g.gain.setValueAtTime(0, time); g.gain.linearRampToValueAtTime(volume, time + .012); g.gain.exponentialRampToValueAtTime(volume * .36, time + .22); g.gain.exponentialRampToValueAtTime(.0001, time + duration);
      g.connect(p); p.connect(this.buses.jazz); g.connect(this.reverb);
      let remaining = 3;
      [[1, 1], [2, .24], [3, .07]].forEach(([harmonic, level]) => {
        const o = c.createOscillator(), part = c.createGain(); o.type = 'sine'; o.frequency.value = hz(midi) * harmonic; part.gain.value = level; o.connect(part); part.connect(g); o.start(time); o.stop(time + duration + .04);
        o.onended = () => { o.disconnect(); part.disconnect(); if (!--remaining) { g.disconnect(); p.disconnect(); } };
      });
    }
    jazzStep(step, time) {
      const chords = [[53,57,60,64], [53,57,59,64], [52,55,59,62], [49,55,58,64], [53,57,60,64], [53,57,59,64], [52,55,59,62], [52,55,57,61]];
      const roots = [38,43,36,45,38,43,36,45], bar = Math.floor(step / 8) % 8, half = step % 8;
      if (half === 0 || half === 5) chords[bar].forEach((midi, i) => this.piano(time + i * .012, midi, half === 0 ? .08 : .052));
      if (half % 2 === 0) {
        const walkingBass = [0, 7, 12, 7][half / 2];
        this.tone('jazz', time, hz(roots[bar] + walkingBass), .48, .18, 'sine');
        this.tone('jazz', time, hz(roots[bar] + walkingBass) * 2, .18, .035, 'triangle');
      }
      this.noiseHit('jazz', time, half % 2 ? .045 : .075, half % 2 ? .019 : .028, 6200, 'highpass', .3);
      if (half === 2 || half === 6) this.noiseHit('jazz', time, .19, .075, 2000, 'bandpass', -.22);
      if (half === 0 || half === 4) this.tone('jazz', time, 68, .12, .08, 'sine', 40);
      const phrase = [[76,74], [71,69], [67,71], [73,70], [72,69], [71,74], [76,74], [73,69]][bar];
      if (half === 3 || half === 7) this.piano(time, phrase[half === 3 ? 0 : 1], .045, .9);
    }
    tick() {
      if (!this.ctx || !this.state.enabled || this.state.hidden || this.state.overlay || this.ctx.state !== 'running') return;
      const now = this.ctx.currentTime;
      if (this.state.phase === 'room') {
        if (this.nextNote < now - .3) this.nextNote = now + .025;
        const beat = 60 / 78;
        while (this.nextNote < now + .2) { this.jazzStep(this.musicStep, this.nextNote); this.nextNote += beat * (this.musicStep % 2 ? .4 : .6); this.musicStep++; }
      }
    }
  }
  return { Soundscape, mixFor };
});
