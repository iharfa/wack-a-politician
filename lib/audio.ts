// Tiny WebAudio-generated sound effects — no audio files needed.
let ctx: AudioContext | null = null;

function tone(freq: number, dur = 0.08, type: OscillatorType = "square", vol = 0.15, delay = 0) {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    const t = ctx.currentTime + delay;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur);
  } catch {
    // audio unavailable — stay silent
  }
}

export const sfx = {
  hit: () => {
    tone(520, 0.06);
    tone(780, 0.08, "square", 0.12, 0.05);
  },
  miss: () => tone(160, 0.15, "sawtooth", 0.12),
  powerup: () => {
    tone(660, 0.08);
    tone(880, 0.08, "square", 0.15, 0.08);
    tone(1100, 0.12, "square", 0.15, 0.16);
  },
  ko: () => {
    tone(200, 0.1, "sawtooth", 0.2);
    tone(400, 0.15, "square", 0.2, 0.08);
    tone(600, 0.2, "square", 0.18, 0.18);
  },
  end: () => {
    tone(520, 0.15, "triangle", 0.2);
    tone(390, 0.15, "triangle", 0.2, 0.15);
    tone(260, 0.3, "triangle", 0.2, 0.3);
  },
};
