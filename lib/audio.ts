"use client";

let ctx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let sfxGain: GainNode | null = null;
let enabled = false;

let volume = 0.7;
if (typeof window !== "undefined") {
  try {
    const saved = parseFloat(localStorage.getItem("dfp_volume") || "");
    if (!isNaN(saved) && saved >= 0 && saved <= 1) volume = saved;
  } catch {}
}

function ensureCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 1.0;
    masterGain.connect(ctx.destination);

    sfxGain = ctx.createGain();
    sfxGain.gain.value = volume;
    sfxGain.connect(masterGain);
  }
  if (ctx.state === "suspended") ctx.resume();
}

let noiseBuf: AudioBuffer | null = null;
function noiseBuffer(): AudioBuffer {
  if (noiseBuf) return noiseBuf;
  ensureCtx();
  const len = ctx!.sampleRate * 0.6;
  noiseBuf = ctx!.createBuffer(1, len, ctx!.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

interface NoiseHitOpts {
  filterFreq?: number;
  q?: number;
  dur?: number;
  vol?: number;
  filterType?: BiquadFilterType;
  decay?: number;
}

function noiseHit({ filterFreq = 1200, q = 4, dur = 0.11, vol = 0.25, filterType = "bandpass", decay = 0.08 }: NoiseHitOpts = {}) {
  if (!enabled) return;
  ensureCtx();
  const t = ctx!.currentTime;
  const src = ctx!.createBufferSource();
  src.buffer = noiseBuffer();
  const f = ctx!.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = filterFreq;
  f.Q.value = q;
  const g = ctx!.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.002);
  g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  src.connect(f); f.connect(g); g.connect(sfxGain!);
  src.start(t);
  src.stop(t + dur + 0.02);
}

interface ToneOpts {
  freq?: number;
  dur?: number;
  type?: OscillatorType;
  vol?: number;
  attack?: number;
  decay?: number;
  filterFreq?: number;
}

function tone({ freq = 220, dur = 0.18, type = "sine", vol = 0.18, attack = 0.003, decay = 0.14, filterFreq = 1400 }: ToneOpts = {}) {
  if (!enabled) return;
  ensureCtx();
  const t = ctx!.currentTime;
  const osc = ctx!.createOscillator();
  const f = ctx!.createBiquadFilter();
  f.type = "lowpass";
  f.frequency.value = filterFreq;
  f.Q.value = 2;
  const g = ctx!.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(f); f.connect(g); g.connect(sfxGain!);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  osc.start(t);
  osc.stop(t + attack + decay + 0.02);
}

const sfx = {
  move: () => {
    noiseHit({ filterFreq: 3200, q: 1.8, dur: 0.05, decay: 0.035, vol: 0.10, filterType: "highpass" });
  },
  select: () => {
    ensureCtx();
    const t = ctx!.currentTime;
    {
      const src = ctx!.createBufferSource();
      src.buffer = noiseBuffer();
      const f = ctx!.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 900; f.Q.value = 2.5;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.85, t + 0.002);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      src.connect(f); f.connect(g); g.connect(sfxGain!);
      src.start(t); src.stop(t + 0.09);
    }
    {
      const src = ctx!.createBufferSource();
      src.buffer = noiseBuffer();
      const f = ctx!.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 220; f.Q.value = 16;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.75, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
      src.connect(f); f.connect(g); g.connect(sfxGain!);
      src.start(t); src.stop(t + 0.38);
    }
    {
      const src = ctx!.createBufferSource();
      src.buffer = noiseBuffer();
      const f = ctx!.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 520; f.Q.value = 11;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.45, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      src.connect(f); f.connect(g); g.connect(sfxGain!);
      src.start(t); src.stop(t + 0.26);
    }
    tone({ freq: 78, type: "sine", vol: 0.75, decay: 0.28, filterFreq: 320 });
    tone({ freq: 135, type: "triangle", vol: 0.48, decay: 0.20, filterFreq: 500 });
    tone({ freq: 54, type: "sine", vol: 0.55, decay: 0.24, filterFreq: 220 });
  },
  back: () => {
    noiseHit({ filterFreq: 500, q: 5, dur: 0.16, decay: 0.12, vol: 0.22 });
    tone({ freq: 140, type: "triangle", vol: 0.12, decay: 0.25, filterFreq: 700 });
  },
  open: () => {
    noiseHit({ filterFreq: 300, q: 3, dur: 0.3, decay: 0.25, vol: 0.22 });
    setTimeout(() => {
      tone({ freq: 220, type: "sine", vol: 0.08, decay: 0.4, filterFreq: 1800 });
      tone({ freq: 330, type: "sine", vol: 0.05, decay: 0.45, filterFreq: 2200 });
    }, 50);
  },
  error: () => {
    noiseHit({ filterFreq: 260, q: 4, dur: 0.12, decay: 0.09, vol: 0.22 });
    tone({ freq: 95, type: "triangle", vol: 0.10, decay: 0.14, filterFreq: 500 });
  },
  start: () => {
    ensureCtx();
    const t = ctx!.currentTime;

    const tailIn = ctx!.createGain();
    tailIn.gain.value = 1.0;

    function makeDelayLine(dt: number, fb: number, cutoff: number) {
      const d = ctx!.createDelay(3.0);
      d.delayTime.value = dt;
      const lp = ctx!.createBiquadFilter();
      lp.type = "lowpass"; lp.frequency.value = cutoff;
      const fbGain = ctx!.createGain();
      fbGain.gain.value = fb;
      tailIn.connect(d); d.connect(lp); lp.connect(fbGain); fbGain.connect(d);
      return lp;
    }
    const line1 = makeDelayLine(0.37, 0.62, 1100);
    const line2 = makeDelayLine(0.51, 0.58, 800);

    const tailOut = ctx!.createGain();
    tailOut.gain.value = 0.85;
    line1.connect(tailOut); line2.connect(tailOut);
    tailOut.connect(sfxGain!);

    function sendToTail(node: AudioNode, wet: number) {
      const s = ctx!.createGain();
      s.gain.value = wet;
      node.connect(s); s.connect(tailIn);
    }

    {
      const src = ctx!.createBufferSource();
      src.buffer = noiseBuffer();
      const bp = ctx!.createBiquadFilter();
      bp.type = "bandpass"; bp.frequency.value = 280; bp.Q.value = 3.5;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.55, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      src.connect(bp); bp.connect(g); g.connect(sfxGain!);
      sendToTail(g, 0.6);
      src.start(t); src.stop(t + 0.22);
    }

    {
      const osc = ctx!.createOscillator();
      osc.type = "sine"; osc.frequency.value = 58;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.52, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.8);
      osc.connect(g); g.connect(sfxGain!);
      sendToTail(g, 0.7);
      osc.start(t); osc.stop(t + 4);
    }

    {
      const osc = ctx!.createOscillator();
      osc.type = "sine"; osc.frequency.value = 87;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.32, t + 0.025);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.4);
      osc.connect(g); g.connect(sfxGain!);
      sendToTail(g, 0.7);
      osc.start(t); osc.stop(t + 3.6);
    }

    const partials = [
      { f: 142, vol: 0.22, dec: 2.6 },
      { f: 203, vol: 0.16, dec: 2.2 },
      { f: 291, vol: 0.12, dec: 1.8 },
      { f: 407, vol: 0.08, dec: 1.4 },
      { f: 553, vol: 0.05, dec: 1.0 },
    ];
    for (const p of partials) {
      const osc = ctx!.createOscillator();
      osc.type = "sine"; osc.frequency.value = p.f;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(p.vol, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + p.dec);
      osc.connect(g); g.connect(sfxGain!);
      sendToTail(g, 0.75);
      osc.start(t); osc.stop(t + p.dec + 0.05);
    }

    {
      const osc = ctx!.createOscillator();
      osc.type = "sine"; osc.frequency.value = 59.4;
      const g = ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.28, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 3.6);
      osc.connect(g); g.connect(sfxGain!);
      sendToTail(g, 0.65);
      osc.start(t); osc.stop(t + 3.8);
    }
  },
};

interface IntroHandle {
  stop: () => void;
}

let introHandle: IntroHandle | null = null;

function startIntro({ duration = 9.0 } = {}): IntroHandle | null {
  if (!enabled) return null;
  ensureCtx();
  if (introHandle) { try { introHandle.stop(); } catch {} introHandle = null; }

  const t0 = ctx!.currentTime;
  const stopAt = t0 + duration;
  const fadeIn = 1.6;
  const fadeOut = 2.4;

  const bus = ctx!.createGain();
  bus.gain.setValueAtTime(0.0001, t0);
  bus.gain.exponentialRampToValueAtTime(0.9, t0 + fadeIn);
  bus.gain.setValueAtTime(0.9, stopAt - fadeOut);
  bus.gain.exponentialRampToValueAtTime(0.0001, stopAt);
  bus.connect(sfxGain!);

  const oscs: OscillatorNode[] = [];

  {
    bus.disconnect();
    const breath = ctx!.createGain();
    breath.gain.value = 0;
    bus.connect(breath);
    breath.connect(sfxGain!);

    const lfo = ctx!.createOscillator();
    lfo.type = "sine"; lfo.frequency.value = 1 / 5.5;
    const lfoGain = ctx!.createGain();
    lfoGain.gain.value = 0.18;
    const lfoOffset = ctx!.createConstantSource();
    lfoOffset.offset.value = 1.0;

    lfoOffset.connect(breath.gain);
    lfo.connect(lfoGain);
    lfoGain.connect(breath.gain);

    lfo.start(t0); lfoOffset.start(t0);
    lfo.stop(stopAt + 0.1); lfoOffset.stop(stopAt + 0.1);
  }

  const tailIn = ctx!.createGain();
  tailIn.gain.value = 1.0;
  function makeDelayLine(dt: number, fb: number, cutoff: number) {
    const d = ctx!.createDelay(4.0);
    d.delayTime.value = dt;
    const lp = ctx!.createBiquadFilter();
    lp.type = "lowpass"; lp.frequency.value = cutoff;
    const fbG = ctx!.createGain(); fbG.gain.value = fb;
    tailIn.connect(d); d.connect(lp); lp.connect(fbG); fbG.connect(d);
    return lp;
  }
  const l1 = makeDelayLine(0.43, 0.66, 1400);
  const l2 = makeDelayLine(0.61, 0.62, 900);
  const l3 = makeDelayLine(0.83, 0.55, 650);
  const tailOut = ctx!.createGain();
  tailOut.gain.value = 0.55;
  l1.connect(tailOut); l2.connect(tailOut); l3.connect(tailOut);
  tailOut.connect(bus);

  function sendToTail(node: AudioNode, wet: number) {
    const s = ctx!.createGain();
    s.gain.value = wet;
    node.connect(s); s.connect(tailIn);
  }

  function addOsc(type: OscillatorType, freq: number, detune = 0) {
    const o = ctx!.createOscillator();
    o.type = type; o.frequency.value = freq;
    if (detune) o.detune.value = detune;
    o.start(t0); o.stop(stopAt + 0.2);
    oscs.push(o);
    return o;
  }

  {
    const o = addOsc("sine", 36.71);
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.55, t0 + 2.2);
    g.gain.setValueAtTime(0.55, stopAt - fadeOut);
    g.gain.exponentialRampToValueAtTime(0.0001, stopAt);
    o.connect(g); g.connect(bus);
    sendToTail(g, 0.25);
  }

  const padNotes = [73.42, 110.0, 174.61, 220.0, 293.66];
  padNotes.forEach((f, i) => {
    const noteGain = ctx!.createGain();
    noteGain.gain.setValueAtTime(0.0001, t0);
    const enter = t0 + 0.4 + i * 0.35;
    const target = [0.16, 0.13, 0.11, 0.10, 0.09][i];
    noteGain.gain.exponentialRampToValueAtTime(target, enter + 2.0);
    noteGain.gain.setValueAtTime(target, stopAt - fadeOut);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    const lp = ctx!.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900 + i * 220;
    lp.Q.value = 0.7;

    lp.frequency.setValueAtTime(lp.frequency.value, t0);
    lp.frequency.linearRampToValueAtTime(lp.frequency.value * 1.5, t0 + duration * 0.5);
    lp.frequency.linearRampToValueAtTime(lp.frequency.value * 0.9, stopAt);

    [-12, 0, 9].forEach(cents => {
      const o = addOsc("sawtooth", f, cents);
      const og = ctx!.createGain();
      og.gain.value = 0.33;
      o.connect(og); og.connect(lp);
    });
    lp.connect(noteGain);
    noteGain.connect(bus);
    sendToTail(noteGain, 0.55);
  });

  {
    const choirSum = ctx!.createGain();
    choirSum.gain.setValueAtTime(0.0001, t0);
    choirSum.gain.exponentialRampToValueAtTime(0.085, t0 + 3.5);
    choirSum.gain.setValueAtTime(0.085, stopAt - fadeOut);
    choirSum.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    const trem = ctx!.createOscillator();
    trem.type = "sine"; trem.frequency.value = 0.33;
    const tremDepth = ctx!.createGain(); tremDepth.gain.value = 0.35;
    const tremOffset = ctx!.createConstantSource(); tremOffset.offset.value = 0.65;
    const tremBus = ctx!.createGain(); tremBus.gain.value = 0;
    tremOffset.connect(tremBus.gain);
    trem.connect(tremDepth); tremDepth.connect(tremBus.gain);
    trem.start(t0); tremOffset.start(t0);
    trem.stop(stopAt + 0.1); tremOffset.stop(stopAt + 0.1);

    function formant(freq: number, q: number) {
      const f = ctx!.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = freq; f.Q.value = q;
      return f;
    }
    const f1 = formant(720, 8);
    const f2 = formant(1180, 10);
    const f3 = formant(2400, 14);
    const fSum = ctx!.createGain();
    const fSum2 = ctx!.createGain(); fSum2.gain.value = 0.7;
    const fSum3 = ctx!.createGain(); fSum3.gain.value = 0.25;
    f1.connect(fSum);
    f2.connect(fSum2); fSum2.connect(fSum);
    f3.connect(fSum3); fSum3.connect(fSum);

    const choirNotes = [146.83, 220.0, 293.66, 349.23];
    choirNotes.forEach(f => {
      [-7, 5].forEach(cents => {
        const o = addOsc("triangle", f, cents);
        const og = ctx!.createGain(); og.gain.value = 0.18;
        o.connect(og); og.connect(f1); og.connect(f2); og.connect(f3);
      });
    });

    fSum.connect(tremBus);
    tremBus.connect(choirSum);
    choirSum.connect(bus);
    sendToTail(choirSum, 0.85);
  }

  const chimePitches = [587.33, 880.0, 1174.66, 1318.51];
  const numChimes = 5;
  for (let i = 0; i < numChimes; i++) {
    const when = t0 + 1.2 + Math.random() * (duration - 3.0);
    const pitch = chimePitches[Math.floor(Math.random() * chimePitches.length)];
    const o = ctx!.createOscillator();
    o.type = "sine"; o.frequency.value = pitch;
    const og = ctx!.createGain();
    const peak = 0.04 + Math.random() * 0.03;
    og.gain.setValueAtTime(0.0001, when);
    og.gain.exponentialRampToValueAtTime(peak, when + 0.08);
    og.gain.exponentialRampToValueAtTime(0.0001, when + 1.6 + Math.random() * 0.8);
    o.connect(og); og.connect(bus);
    sendToTail(og, 0.95);
    o.start(when); o.stop(when + 2.6);
  }

  const shimmerCount = 14;
  for (let i = 0; i < shimmerCount; i++) {
    const when = t0 + 0.8 + Math.random() * (duration - 2.5);
    const base = 1100 + Math.random() * 2400;
    const o = ctx!.createOscillator();
    o.type = "sine"; o.frequency.value = base;
    const og = ctx!.createGain();
    const peak = 0.012 + Math.random() * 0.018;
    const dur = 0.6 + Math.random() * 1.4;
    og.gain.setValueAtTime(0.0001, when);
    og.gain.exponentialRampToValueAtTime(peak, when + 0.04 + Math.random() * 0.1);
    og.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(og); og.connect(bus);
    sendToTail(og, 1.0);
    o.start(when); o.stop(when + dur + 0.05);
  }

  {
    const src = ctx!.createBufferSource();
    const len = Math.ceil(ctx!.sampleRate * 2.0);
    const buf = ctx!.createBuffer(1, len, ctx!.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let n = 0; n < len; n++) {
      const w = Math.random() * 2 - 1;
      last = 0.97 * last + 0.03 * w;
      d[n] = last * 8;
    }
    src.buffer = buf; src.loop = true;

    const bp = ctx!.createBiquadFilter();
    bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.5;
    const g = ctx!.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 3.0);
    g.gain.setValueAtTime(0.05, stopAt - fadeOut);
    g.gain.exponentialRampToValueAtTime(0.0001, stopAt);

    src.connect(bp); bp.connect(g); g.connect(bus);
    sendToTail(g, 0.4);
    src.start(t0); src.stop(stopAt + 0.2);
  }

  introHandle = {
    stop() {
      const now = ctx!.currentTime;
      try {
        bus.gain.cancelScheduledValues(now);
        bus.gain.setValueAtTime(Math.max(0.0001, bus.gain.value), now);
        bus.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      } catch {}
      for (const o of oscs) {
        try { o.stop(now + 0.7); } catch {}
      }
    }
  };
  return introHandle;
}

function stopIntro() {
  if (introHandle) {
    try { introHandle.stop(); } catch {}
    introHandle = null;
  }
}

export const Audio$ = {
  enable() {
    enabled = true;
    ensureCtx();
  },
  disable() {
    enabled = false;
    stopIntro();
  },
  intro: (opts?: { duration?: number }) => startIntro(opts),
  stopIntro: () => stopIntro(),
  isEnabled() { return enabled; },
  getVolume() { return volume; },
  setVolume(v: number) {
    volume = Math.max(0, Math.min(1, v));
    try { localStorage.setItem("dfp_volume", String(volume)); } catch {}
    if (sfxGain && ctx) sfxGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
  },
  move: () => sfx.move(),
  select: () => sfx.select(),
  back: () => sfx.select(),
  open: () => sfx.open(),
  error: () => sfx.error(),
  start: () => sfx.start(),
  preview: () => sfx.move(),
};
