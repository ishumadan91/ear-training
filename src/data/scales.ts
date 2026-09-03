/**
 * Scale / thaat definitions, keyboard layout, and session constants.
 *
 * Mirrors the note pools and keyboard geometry authored in the "Ear Trainer
 * Dashboard" design so the app and the design stay in lockstep. Western scales
 * use sharp/flat glyphs (♯ ♭); Indian thaats use sargam syllables, where a
 * lowercase syllable marks the komal (flattened) swara and `Ma♯` marks tivra Ma.
 */

export type Notation = 'western' | 'indian';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Scale {
  key: string;
  label: string;
  notes: string[];
}

/** A single pitch: a note name, the octave it sounds in, and its pitch class. */
export interface Note {
  name: string;
  octave: number;
  /** Semitone within the octave, 0–11. */
  semitone: number;
}

export const SCALES: Record<Notation, Scale[]> = {
  western: [
    { key: 'major', label: 'Major', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] },
    { key: 'naturalMinor', label: 'Natural minor', notes: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B♭'] },
    { key: 'dorian', label: 'Dorian', notes: ['C', 'D', 'E♭', 'F', 'G', 'A', 'B♭'] },
    { key: 'mixolydian', label: 'Mixolydian', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B♭'] },
    { key: 'harmonicMinor', label: 'Harmonic minor', notes: ['C', 'D', 'E♭', 'F', 'G', 'A♭', 'B'] },
    { key: 'majorPentatonic', label: 'Major pentatonic', notes: ['C', 'D', 'E', 'G', 'A'] },
    { key: 'minorPentatonic', label: 'Minor pentatonic', notes: ['C', 'E♭', 'F', 'G', 'B♭'] },
  ],
  indian: [
    { key: 'bilawal', label: 'Bilawal', notes: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'] },
    { key: 'kalyan', label: 'Kalyan', notes: ['Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni'] },
    { key: 'khamaj', label: 'Khamaj', notes: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'ni'] },
    { key: 'bhairav', label: 'Bhairav', notes: ['Sa', 're', 'Ga', 'Ma', 'Pa', 'dha', 'Ni'] },
    { key: 'bhairavi', label: 'Bhairavi', notes: ['Sa', 're', 'ga', 'Ma', 'Pa', 'dha', 'ni'] },
    { key: 'todi', label: 'Todi', notes: ['Sa', 're', 'ga', 'Ma♯', 'Pa', 'dha', 'Ni'] },
    { key: 'purvi', label: 'Purvi', notes: ['Sa', 're', 'Ga', 'Ma♯', 'Pa', 'dha', 'Ni'] },
    { key: 'marwa', label: 'Marwa', notes: ['Sa', 're', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni'] },
    { key: 'kafi', label: 'Kafi', notes: ['Sa', 'Re', 'ga', 'Ma', 'Pa', 'Dha', 'ni'] },
    { key: 'asavari', label: 'Asavari', notes: ['Sa', 'Re', 'ga', 'Ma', 'Pa', 'dha', 'ni'] },
  ],
};

/** How many notes the generated tune holds at each difficulty. */
export const DIFFICULTY_LENGTH: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
};

/** Chromatic root notes offered in the settings panel. */
export const ROOT_NOTES = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
] as const;

/** The twelve keyboard labels of one octave, in semitone order. */
export const CHROMATIC: Record<Notation, string[]> = {
  western: ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'],
  indian: ['Sa', 're', 'Re', 'ga', 'Ga', 'Ma', 'Ma♯', 'Pa', 'dha', 'Dha', 'ni', 'Ni'],
};

/** Semitone offsets within an octave that are rendered as black keys. */
export const BLACK_POSITIONS = new Set([1, 3, 6, 8, 10]);

/** The octaves the keyboard spans, by their real octave numbers. */
export const OCTAVES = [3, 4];

export const WHITE_KEY_WIDTH = 46;
export const BLACK_KEY_WIDTH = 28;

/**
 * Every note label the app can produce, mapped to its semitone offset from the
 * tonic. Covers both keyboard spellings (sharps, sargam) and the flat
 * spellings the Western scale pools use — `E♭` and `D♯` are the same pitch, so
 * they must resolve to the same number for grading to be fair.
 */
const SEMITONES: Record<string, number> = {
  // Western — sharps (keyboard spelling)
  C: 0, 'C♯': 1, D: 2, 'D♯': 3, E: 4, F: 5,
  'F♯': 6, G: 7, 'G♯': 8, A: 9, 'A♯': 10, B: 11,
  // Western — flats (scale-pool spelling)
  'D♭': 1, 'E♭': 3, 'G♭': 6, 'A♭': 8, 'B♭': 10,
  // Indian sargam — lowercase = komal, Ma♯ = tivra
  Sa: 0, re: 1, Re: 2, ga: 3, Ga: 4, Ma: 5,
  'Ma♯': 6, Pa: 7, dha: 8, Dha: 9, ni: 10, Ni: 11,
};

/** Semitone offset for a note label, or -1 when the label is unknown. */
export function semitoneOf(label: string): number {
  return SEMITONES[label] ?? -1;
}

/** True when two labels name the same pitch class (D♯ and E♭ both count). */
export function isSamePitch(a: string, b: string): boolean {
  const sa = semitoneOf(a);
  return sa !== -1 && sa === semitoneOf(b);
}

/** Absolute pitch, so notes across octaves can be compared and ordered. */
export function absPitch(note: Note): number {
  return note.octave * 12 + note.semitone;
}

export interface KeyboardKey extends Note {
  width: number;
  /** Only set for black keys — their absolute offset within the track. */
  left?: number;
}

export interface KeyboardLayout {
  whiteKeys: KeyboardKey[];
  blackKeys: KeyboardKey[];
  width: number;
}

/**
 * The label a key carries, which depends on how the notation names pitches.
 *
 * Western names are **absolute**: C is C whatever the root is. Sargam names
 * are **relative** — Sa *is* the tonic — so the syllables rotate to put Sa on
 * the selected root. At root A♯, the A♯ key reads "Sa" and the C key reads
 * "Re".
 *
 * Neither case changes what a key *sounds*: a key always plays its own pitch.
 */
export function keyLabel(
  notation: Notation,
  semitone: number,
  rootOffset = 0,
): string {
  if (notation === 'indian') {
    return CHROMATIC.indian[(((semitone - rootOffset) % 12) + 12) % 12];
  }
  return CHROMATIC.western[((semitone % 12) + 12) % 12];
}

/**
 * Lay out the chromatic keyboard across `octaves`. White keys flow in a row;
 * black keys are positioned absolutely, straddling the seam between the white
 * keys either side of them.
 */
export function buildKeyboard(
  notation: Notation,
  rootOffset = 0,
  octaves: number[] = OCTAVES,
): KeyboardLayout {
  const whiteKeys: KeyboardKey[] = [];
  const blackKeys: KeyboardKey[] = [];
  let whiteCount = 0;

  for (const octave of octaves) {
    for (let semitone = 0; semitone < 12; semitone++) {
      const note: Note = {
        name: keyLabel(notation, semitone, rootOffset),
        octave,
        semitone,
      };
      if (BLACK_POSITIONS.has(semitone)) {
        blackKeys.push({
          ...note,
          width: BLACK_KEY_WIDTH,
          left: whiteCount * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
        });
      } else {
        whiteKeys.push({ ...note, width: WHITE_KEY_WIDTH });
        whiteCount++;
      }
    }
  }

  return { whiteKeys, blackKeys, width: whiteCount * WHITE_KEY_WIDTH };
}

/** Every key on the keyboard, low to high. */
export function allKeys(
  notation: Notation,
  rootOffset = 0,
  octaves: number[] = OCTAVES,
): KeyboardKey[] {
  const { whiteKeys, blackKeys } = buildKeyboard(notation, rootOffset, octaves);
  return [...whiteKeys, ...blackKeys].sort((a, b) => absPitch(a) - absPitch(b));
}

/**
 * The scale's intervals above its tonic, in semitones — `[0, 2, 4, 5, 7, 9, 11]`
 * for a major scale. The scale tables are written from C / Sa, so a note's own
 * semitone *is* its degree.
 */
export function scaleDegrees(notation: Notation, scaleKey: string): number[] {
  return findScale(notation, scaleKey).notes.map(semitoneOf);
}

/**
 * The pitch classes (0–11, absolute) the scale occupies at the given root.
 *
 * Used both to draw the tune pool and to dim the keys that fall outside the
 * scale — the two must agree, so they share this one source.
 */
export function scalePitchClasses(
  notation: Notation,
  scaleKey: string,
  rootOffset = 0,
): Set<number> {
  return new Set(
    scaleDegrees(notation, scaleKey).map((d) => (((d + rootOffset) % 12) + 12) % 12),
  );
}

/**
 * The notes a tune may be drawn from: every key on the keyboard whose interval
 * above the root belongs to the scale.
 *
 * Deriving the pool from the keyboard rather than from the scale table has two
 * consequences that matter. Every pool note is guaranteed to be tappable — a
 * pitch computed independently could land outside the keyboard's range once
 * the root shifts it. And each note carries the label of the key that plays
 * it, so what the learner reads always matches what they hear.
 */
export function scalePool(
  notation: Notation,
  scaleKey: string,
  rootOffset = 0,
  octaves: number[] = OCTAVES,
): Note[] {
  const inScale = scalePitchClasses(notation, scaleKey, rootOffset);
  return allKeys(notation, rootOffset, octaves)
    .filter((k) => inScale.has(k.semitone))
    .map(({ name, octave, semitone }) => ({ name, octave, semitone }));
}

/** Look up a scale by key, falling back to the notation's first entry. */
export function findScale(notation: Notation, key: string): Scale {
  const list = SCALES[notation];
  return list.find((s) => s.key === key) ?? list[0];
}

/** Random tune of `length` notes drawn from the given pool. */
export function newTune(length: number, pool: Note[]): Note[] {
  return Array.from({ length }, () => pool[Math.floor(Math.random() * pool.length)]);
}
