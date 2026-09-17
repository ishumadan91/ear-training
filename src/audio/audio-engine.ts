/**
 * Audio engine — this app's view of the shared synth in `@chordialguy/keyboard`.
 *
 * The voices themselves (a harmonic-series piano, a Karplus-Strong guitar)
 * live in the library, so the keyboard here and the LWCG song player sound the
 * same. What stays here is what is particular to ear training: which
 * instruments are offered, the swap between tune and taps, and the pacing of a
 * played-back tune.
 *
 * Pitches in this module are this app's absolute pitch (`octave × 12 +
 * semitone`), converted to MIDI on the way out.
 */
import {
  audioContext,
  isSupported as synthSupported,
  playNote as synthNote,
  resume as synthResume,
} from '@chordialguy/keyboard';
import { toMidi } from '../data/scales.js';

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

/** Seconds between successive notes when a tune plays back. */
const SEQUENCE_STEP = 0.55;

/** How long each note of a tune is held. Long enough to ring into the next. */
const NOTE_DURATION: Record<Instrument, number> = {
  piano: 1.4,
  guitar: 1.6,
};

/** True when this environment can produce sound at all. */
export const isSupported = synthSupported;

/** Resume the audio context. Must be called from a user gesture. */
export const resume = synthResume;

/** Play a single note immediately. `pitch` is absolute (`octave × 12 + semitone`). */
export function playNote(pitch: number, instrument: Instrument): void {
  synthNote(toMidi(pitch), { instrument });
}

/**
 * Play a sequence of pitches back to back. Resolves once the last note has
 * been struck, so the caller can drop the transport out of its playing state.
 */
export async function playSequence(pitches: number[], instrument: Instrument): Promise<void> {
  const ctx = audioContext();
  if (!ctx || pitches.length === 0) return;
  await resume();

  const start = ctx.currentTime + 0.08; // brief lead-in so note 1 isn't clipped
  pitches.forEach((pitch, i) => {
    synthNote(toMidi(pitch), {
      instrument,
      at: start + i * SEQUENCE_STEP,
      duration: NOTE_DURATION[instrument],
    });
  });

  const total = (pitches.length - 1) * SEQUENCE_STEP + NOTE_DURATION[instrument] * 0.5;
  await new Promise((done) => setTimeout(done, total * 1000));
}
