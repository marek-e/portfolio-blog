// World audio (PRD §10) — fully synthesized with WebAudio instead of shipped audio files.
// Deviation from the PRD's "royalty-free loop" sourcing, for the better on every axis it
// cared about: zero licensing/attribution burden, zero bytes downloaded (music can never
// blow the budget), and it still starts only after the explicit entry click, which is the
// AudioContext unlock gesture. The generative loop: a slow warm chord pad cycle, a soft
// filtered-noise "shore" bed, and sparse pentatonic plucks with echo.

export type SfxId =
  'interact' | 'card-open' | 'card-close' | 'discovery' | 'confetti' | 'door' | 'footstep';

const CHORDS: number[][] = [
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [220.0, 261.63, 329.63, 392.0], // Am7
  [146.83, 174.61, 220.0, 261.63], // Dm7
  [196.0, 246.94, 293.66, 349.23], // G7-ish
];
const CHORD_SECONDS = 8;
const PENTATONIC = [349.23, 392.0, 440.0, 523.25, 587.33]; // F G A C D

export function createWorldAudio(initiallyMuted: boolean) {
  const ctx = new AudioContext();
  const master = ctx.createGain();
  master.gain.value = initiallyMuted ? 0 : 1;
  master.connect(ctx.destination);

  const musicBus = ctx.createGain();
  musicBus.gain.value = 0;
  musicBus.connect(master);

  const sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.5;
  sfxBus.connect(master);

  // --- music: shore noise bed -------------------------------------------------------------
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const channel = noiseBuffer.getChannelData(0);
  for (let i = 0; i < channel.length; i++) channel[i] = Math.random() * 2 - 1;

  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.value = 900;
  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.03;
  // slow swell like waves
  const waveLfo = ctx.createOscillator();
  waveLfo.frequency.value = 1 / 9;
  const waveDepth = ctx.createGain();
  waveDepth.gain.value = 0.018;
  waveLfo.connect(waveDepth).connect(noiseGain.gain);
  noise.connect(noiseFilter).connect(noiseGain).connect(musicBus);
  noise.start();
  waveLfo.start();

  // --- music: chord pad + plucks, scheduled ahead ------------------------------------------
  const padFilter = ctx.createBiquadFilter();
  padFilter.type = 'lowpass';
  padFilter.frequency.value = 850;
  padFilter.connect(musicBus);

  const echo = ctx.createDelay(1.2);
  echo.delayTime.value = 0.42;
  const echoFeedback = ctx.createGain();
  echoFeedback.gain.value = 0.32;
  const echoLevel = ctx.createGain();
  echoLevel.gain.value = 0.5;
  echo.connect(echoFeedback).connect(echo);
  echo.connect(echoLevel).connect(padFilter);

  let chordIndex = 0;
  let nextChordAt = ctx.currentTime + 0.3;
  let nextPluckAt = ctx.currentTime + 5;

  function schedulePad(startAt: number, frequencies: number[]) {
    for (const [i, frequency] of frequencies.entries()) {
      const osc = ctx.createOscillator();
      osc.type = i % 2 ? 'triangle' : 'sine';
      osc.frequency.value = frequency * (i % 2 ? 1.001 : 1);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, startAt);
      gain.gain.linearRampToValueAtTime(0.045, startAt + 2.2);
      gain.gain.setValueAtTime(0.045, startAt + CHORD_SECONDS - 2.5);
      gain.gain.linearRampToValueAtTime(0, startAt + CHORD_SECONDS + 0.4);
      osc.connect(gain).connect(padFilter);
      osc.start(startAt);
      osc.stop(startAt + CHORD_SECONDS + 0.6);
    }
  }

  function schedulePluck(startAt: number) {
    const frequency = PENTATONIC[Math.floor(Math.random() * PENTATONIC.length)];
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = frequency * 2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, startAt);
    gain.gain.exponentialRampToValueAtTime(0.0005, startAt + 1.4);
    osc.connect(gain);
    gain.connect(padFilter);
    gain.connect(echo);
    osc.start(startAt);
    osc.stop(startAt + 1.5);
  }

  const scheduler = window.setInterval(() => {
    const horizon = ctx.currentTime + 2;
    while (nextChordAt < horizon) {
      schedulePad(nextChordAt, CHORDS[chordIndex]);
      chordIndex = (chordIndex + 1) % CHORDS.length;
      nextChordAt += CHORD_SECONDS;
    }
    while (nextPluckAt < horizon) {
      schedulePluck(nextPluckAt);
      nextPluckAt += 3.5 + Math.random() * 5;
    }
  }, 1000);

  // gentle music fade-in after entry (PRD §10)
  musicBus.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 3);

  // --- SFX ----------------------------------------------------------------------------------
  function tone(
    frequencyFrom: number,
    frequencyTo: number,
    duration: number,
    peak = 0.14,
    type: OscillatorType = 'triangle'
  ) {
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(frequencyFrom, t);
    osc.frequency.exponentialRampToValueAtTime(frequencyTo, t + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(sfxBus);
    osc.start(t);
    osc.stop(t + duration + 0.05);
  }

  function noiseBurst(duration: number, filterFrom: number, filterTo: number, peak = 0.12) {
    const t = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFrom, t);
    filter.frequency.exponentialRampToValueAtTime(filterTo, t + duration);
    filter.Q.value = 1.2;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(peak, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    source.connect(filter).connect(gain).connect(sfxBus);
    source.start(t);
    source.stop(t + duration + 0.05);
  }

  let footAlternate = false;

  const sfx: Record<SfxId, () => void> = {
    interact: () => tone(440, 690, 0.09),
    'card-open': () => {
      tone(392, 620, 0.12);
      tone(590, 930, 0.14, 0.08);
    },
    'card-close': () => tone(520, 330, 0.11),
    discovery: () => {
      tone(659.26, 659.26, 0.5, 0.1, 'sine');
      window.setTimeout(() => tone(880, 880, 0.7, 0.1, 'sine'), 130);
    },
    confetti: () => {
      noiseBurst(0.25, 500, 2500, 0.2);
      tone(240, 480, 0.18, 0.12, 'square');
    },
    door: () => noiseBurst(0.4, 300, 1400, 0.09),
    footstep: () => {
      footAlternate = !footAlternate;
      noiseBurst(0.05, footAlternate ? 260 : 210, 140, 0.05);
    },
  };

  return {
    playSfx(id: SfxId): void {
      if (ctx.state !== 'running') return;
      sfx[id]();
    },

    setMuted(muted: boolean): void {
      master.gain.linearRampToValueAtTime(muted ? 0 : 1, ctx.currentTime + 0.1);
    },

    /** Fade music out when the tab hides, back in on return (PRD §6.11). */
    setBackgrounded(hidden: boolean): void {
      musicBus.gain.cancelScheduledValues(ctx.currentTime);
      musicBus.gain.setValueAtTime(musicBus.gain.value, ctx.currentTime);
      musicBus.gain.linearRampToValueAtTime(hidden ? 0 : 0.9, ctx.currentTime + 0.8);
    },

    destroy(): void {
      window.clearInterval(scheduler);
      void ctx.close();
    },
  };
}

export type WorldAudio = ReturnType<typeof createWorldAudio>;
