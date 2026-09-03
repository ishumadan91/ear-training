/**
 * Audio engine — synthesises the practice tones with the Web Audio API.
 *
 * Nothing is sampled: both instruments are generated at runtime, so the app
 * ships no audio assets and works offline.
 *
 *   - **Piano** — additive synthesis. A triangle fundamental plus four sine
 *     partials at falling gain, through a lowpass that closes as the note
 *     decays. That darkening is what reads as "struck string" rather than
 *     "organ".
 *   - **Guitar** — Karplus-Strong plucked string. A short noise burst is
 *     filtered in a feedback loop whose delay length sets the pitch; the
 *     result is rendered into an AudioBuffer and played back. It gives a
 *     genuine pluck with none of the cost of a sample library.
 *
 * Browsers block audio until a user gesture, so `resume()` must be called from
 * a click handler before the first note.
 */

export type Instrument = 'piano' | 'guitar';

/** Human-readable names, for the settings hint. */
export const INSTRUMENT_LABEL: Record<Instrument, string> = {
  piano: 'Piano',
  guitar: 'Guitar',
};

/**
 * The instrument the learner's own taps sound in.
 *
 * The tune plays on the chosen instrument and taps answer back on the other
 * one, so timbre can never be used as a crutch — the learner has to match
 * pitch, not tone colour.
 */
export function inputInstrument(playback: Instrument): Instrument {
  return playback === 'piano' ? 'guitar' : 'piano';
}

/** Frequency of C4 — the reference the whole scale is derived from. */
const C4_FREQUENCY = 261.6256;

/** Absolute pitch of C4, i.e. `octave 4 × 12 + semitone 0`. */
const C4_PITCH = 48;

/** Seconds between successive notes when a tune plays back. */
const SEQUENCE_STEP = 0.55;

const NOTE_DURATION: Record<Instrument, number> = {
  piano: 1.4,
  guitar: 1.6,
};

let context: AudioContext | null = null;
let master: GainNode | null = null;

function ensureContext(): AudioContext | null {
  if (context) return context;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null; // No Web Audio (very old browser, or a test DOM).
  context = new Ctor();
  master = context.createGain();
  // Headroom so overlapping notes in a sequence never clip.
  master.gain.value = 0.25;
  master.connect(context.destination);
  return context;
}

/** True when this environment can produce sound at all. */
export function isSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    !!(
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: unknown }).webkitAudioContext
    )
  );
}

/**
 * Resume the audio context. Must be called from a user gesture.
 *
 * A rejected resume (Safari does this when it decides the call wasn't
 * gesture-initiated) must not abort playback — the notes are still scheduled,
 * and the context usually starts on the next real interaction.
 */
export async function resume(): Promise<void> {
  const ctx = ensureContext();
  if (!ctx || ctx.state !== 'suspended') return;
  try {
    await ctx.resume();
  } catch {
    /* stay suspended; scheduling still proceeds */
  }
}

/**
 * Frequency for an absolute pitch (`octave × 12 + semitone`), so C4 → 261.63 Hz
 * and C3 an octave below it.
 */
export function frequencyOf(pitch: number): number {
  return C4_FREQUENCY * Math.pow(2, (pitch - C4_PITCH) / 12);
}

/* ---------------------------------------------------------------- piano --- */

const PARTIAL_GAINS = [1, 0.45, 0.22, 0.12, 0.06];

function playPiano(ctx: AudioContext, freq: number, at: number, dur: number) {
  const voice = ctx.createGain();
  voice.gain.setValueAtTime(0.0001, at);
  voice.gain.linearRampToValueAtTime(1, at + 0.006); // hammer strike
  voice.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  const tone = ctx.createBiquadFilter();
  tone.type = 'lowpass';
  tone.frequency.setValueAtTime(Math.min(freq * 8, 9000), at);
  tone.frequency.exponentialRampToValueAtTime(Math.max(freq * 2, 320), at + dur);

  voice.connect(tone);
  tone.connect(master!);

  PARTIAL_GAINS.forEach((gain, i) => {
    const osc = ctx.createOscillator();
    osc.type = i === 0 ? 'triangle' : 'sine';
    osc.frequency.value = freq * (i + 1);
    const level = ctx.createGain();
    level.gain.value = gain;
    osc.connect(level);
    level.connect(voice);
    osc.start(at);
    osc.stop(at + dur + 0.05);
  });
}

/* --------------------------------------------------------------- guitar --- */

/**
 * Render one plucked-string note with the Karplus-Strong algorithm.
 *
 * The delay line's length sets the pitch, but a whole number of samples can
 * only express certain frequencies — at 440 Hz a 44.1 kHz line rounds 100.2
 * samples to 100 and lands ~26 cents sharp. That is audible, and unacceptable
 * in an app whose whole purpose is training pitch. So the read is interpolated
 * between two taps, which expresses the fractional part exactly.
 */
function pluckBuffer(ctx: AudioContext, freq: number, dur: number): AudioBuffer {
  const rate = ctx.sampleRate;
  const frames = Math.max(1, Math.floor(rate * dur));
  const buffer = ctx.createBuffer(1, frames, rate);
  const out = buffer.getChannelData(0);

  // The damping filter below averages two samples, which itself delays the
  // loop by half a sample — so aim the delay line half a sample short.
  const target = Math.max(2, rate / freq - 0.5);
  const taps = Math.floor(target);
  const fraction = target - taps;

  const size = taps + 2;
  const line = new Float32Array(size);
  for (let i = 0; i < size; i++) line[i] = Math.random() * 2 - 1;

  // Soften the excitation so the attack is plucky, not fizzy.
  let smoothed = 0;
  for (let i = 0; i < size; i++) {
    line[i] = (line[i] + smoothed) * 0.5;
    smoothed = line[i];
  }

  const decay = 0.996;
  let write = 0;
  let previous = 0;
  for (let i = 0; i < frames; i++) {
    const near = (write - taps + size * 2) % size;
    const far = (write - taps - 1 + size * 2) % size;
    const read = line[near] * (1 - fraction) + line[far] * fraction;
    // Averaging neighbours is the lowpass that makes high partials die first.
    const value = (read + previous) * 0.5;
    previous = read;
    out[i] = value;
    line[write] = value * decay;
    write = (write + 1) % size;
  }
  return buffer;
}

function playGuitar(ctx: AudioContext, freq: number, at: number, dur: number) {
  const source = ctx.createBufferSource();
  source.buffer = pluckBuffer(ctx, freq, dur);

  const voice = ctx.createGain();
  voice.gain.setValueAtTime(1, at);
  voice.gain.setValueAtTime(1, at + dur * 0.75);
  voice.gain.exponentialRampToValueAtTime(0.0001, at + dur);

  const body = ctx.createBiquadFilter();
  body.type = 'lowpass';
  body.frequency.value = Math.min(freq * 10, 7000);

  source.connect(voice);
  voice.connect(body);
  body.connect(master!);
  source.start(at);
  source.stop(at + dur);
}

/* ---------------------------------------------------------------- public -- */

function schedule(pitch: number, instrument: Instrument, at: number) {
  const ctx = ensureContext();
  if (!ctx || !master) return;
  const freq = frequencyOf(pitch);
  const dur = NOTE_DURATION[instrument];
  if (instrument === 'guitar') playGuitar(ctx, freq, at, dur);
  else playPiano(ctx, freq, at, dur);
}

/**
 * Play a single note immediately — used when a key is tapped.
 * `pitch` is absolute (`octave × 12 + semitone`).
 */
export function playNote(pitch: number, instrument: Instrument): void {
  const ctx = ensureContext();
  if (!ctx) return;
  void resume();
  schedule(pitch, instrument, ctx.currentTime);
}

/**
 * Play a sequence of semitones back to back. Resolves once the last note has
 * been struck, so the caller can drop the transport out of its playing state.
 */
export async function playSequence(
  pitches: number[],
  instrument: Instrument,
): Promise<void> {
  const ctx = ensureContext();
  if (!ctx || pitches.length === 0) return;
  await resume();

  const start = ctx.currentTime + 0.08; // brief lead-in so note 1 isn't clipped
  pitches.forEach((pitch, i) => {
    schedule(pitch, instrument, start + i * SEQUENCE_STEP);
  });

  const total = (pitches.length - 1) * SEQUENCE_STEP + NOTE_DURATION[instrument] * 0.5;
  await new Promise((done) => setTimeout(done, total * 1000));
}
