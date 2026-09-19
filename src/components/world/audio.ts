export function createWorldAudio(initialMuted: boolean) {
  let muted = initialMuted;
  let entered = false;
  let disposed = false;
  let context: AudioContext | undefined;
  let gain: GainNode | undefined;
  let fade: ReturnType<typeof setInterval> | undefined;
  const buffers = new Map<string, AudioBuffer>();
  const music = new Audio();
  music.loop = true;
  music.preload = 'none';
  music.volume = 0;
  const abort = new AbortController();

  function volume() {
    if (fade) clearInterval(fade);
    const target = entered && !muted && !document.hidden ? 0.22 : 0;
    if (target > 0 && music.paused) void music.play().catch(() => undefined);
    if (gain && context) gain.gain.setTargetAtTime(target > 0 ? 0.3 : 0, context.currentTime, 0.06);
    fade = setInterval(() => {
      music.volume = Math.max(
        0,
        Math.min(
          1,
          music.volume +
            Math.sign(target - music.volume) * Math.min(0.025, Math.abs(target - music.volume))
        )
      );
      if (Math.abs(music.volume - target) < 0.001) {
        clearInterval(fade);
        if (target === 0) music.pause();
      }
    }, 40);
  }

  document.addEventListener('visibilitychange', volume);
  return {
    async prepare() {
      try {
        context = new AudioContext();
        gain = context.createGain();
        gain.gain.value = 0;
        gain.connect(context.destination);
        await Promise.all(
          ['step', 'interact', 'open', 'close', 'discovery', 'celebrate', 'door'].map(
            async (name) => {
              const response = await fetch(`/world/${name}-v1.wav`, { signal: abort.signal });
              if (!response.ok) throw new Error('Sound unavailable');
              const buffer = await context!.decodeAudioData(await response.arrayBuffer());
              if (!disposed) buffers.set(name, buffer);
            }
          )
        );
      } catch {
        buffers.clear();
      }
    },
    enter() {
      entered = true;
      if (context?.state === 'suspended') void context.resume().catch(() => undefined);
      music.src = '/world/music-v1.mp3';
      if (!muted) void music.play().catch(() => undefined);
      volume();
    },
    setMuted(value: boolean) {
      muted = value;
      if (!value && context?.state === 'suspended') void context.resume().catch(() => undefined);
      volume();
    },
    play(name: string) {
      const buffer = buffers.get(name);
      if (!entered || muted || document.hidden || !context || !gain || !buffer) return;
      const source = context.createBufferSource();
      source.buffer = buffer;
      source.connect(gain);
      source.start();
    },
    destroy() {
      disposed = true;
      abort.abort();
      clearInterval(fade);
      document.removeEventListener('visibilitychange', volume);
      music.pause();
      music.removeAttribute('src');
      music.load();
      if (context && context.state !== 'closed') void context.close().catch(() => undefined);
    },
  };
}

export type WorldAudio = ReturnType<typeof createWorldAudio>;
