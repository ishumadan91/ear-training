/**
 * Scale / thaat definitions, keyboard layout, and session constants.
 *
 * Mirrors the "Ear Trainer Dashboard" design. Scales are defined as
 * **interval degrees above the tonic**, not as note names — a major scale is
 * `[0,2,4,5,7,9,11]` in every key. That removes a whole class of bug: spelling
 * a scale with note names forces a choice between sharps and flats, and the
 * keyboard can only be labelled one way.
 */

export type Notation = 'western' | 'indian';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Scale {
  key: string;
  label: string;
  /** Semitones above the tonic. */
  degrees: number[];
}

export const SCALES: Record<Notation, Scale[]> = {
  western: [
    { key: 'major', label: 'Major', degrees: [0, 2, 4, 5, 7, 9, 11] },
    { key: 'naturalMinor', label: 'Natural minor', degrees: [0, 2, 3, 5, 7, 8, 10] },
    { key: 'dorian', label: 'Dorian', degrees: [0, 2, 3, 5, 7, 9, 10] },
    { key: 'mixolydian', label: 'Mixolydian', degrees: [0, 2, 4, 5, 7, 9, 10] },
    { key: 'harmonicMinor', label: 'Harmonic minor', degrees: [0, 2, 3, 5, 7, 8, 11] },
    { key: 'majorPentatonic', label: 'Major pentatonic', degrees: [0, 2, 4, 7, 9] },
    { key: 'minorPentatonic', label: 'Minor pentatonic', degrees: [0, 3, 5, 7, 10] },
  ],
  indian: [
    { key: 'bilawal', label: 'Bilawal', degrees: [0, 2, 4, 5, 7, 9, 11] },
    { key: 'kalyan', label: 'Kalyan', degrees: [0, 2, 4, 6, 7, 9, 11] },
    { key: 'khamaj', label: 'Khamaj', degrees: [0, 2, 4, 5, 7, 9, 10] },
    { key: 'bhairav', label: 'Bhairav', degrees: [0, 1, 4, 5, 7, 8, 11] },
    { key: 'bhairavi', label: 'Bhairavi', degrees: [0, 1, 3, 5, 7, 8, 10] },
    { key: 'todi', label: 'Todi', degrees: [0, 1, 3, 6, 7, 8, 11] },
    { key: 'purvi', label: 'Purvi', degrees: [0, 1, 4, 6, 7, 8, 11] },
    { key: 'marwa', label: 'Marwa', degrees: [0, 1, 4, 6, 7, 9, 11] },
    { key: 'kafi', label: 'Kafi', degrees: [0, 2, 3, 5, 7, 9, 10] },
    { key: 'asavari', label: 'Asavari', degrees: [0, 2, 3, 5, 7, 8, 10] },
  ],
};

/** How many notes the generated tune holds at each difficulty. */
export const DIFFICULTY_LENGTH: Record<Difficulty, number> = {
  easy: 3,
  medium: 4,
  hard: 5,
};

/** Chromatic root notes offered in the root picker. */
export const ROOT_NOTES = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
] as const;

export const CHROMATIC_WESTERN = [
  'C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B',
];

export type Saptak = 'mandra' | 'madhya' | 'taar';

/**
 * Abbreviated sargam (Bhatkhande), by semitones above Sa.
 *
 * The accidental marks are kept as *data* rather than baked into the string
 * with combining characters: a combining low line under "N" lands wherever the
 * font decides, and a komal swara an octave down would need two marks stacked
 * below the same letter. Components draw them with CSS instead, which puts
 * them where they belong every time.
 */
export const SARGAM: { name: string; komal: boolean; tivra: boolean }[] = [
  { name: 'S', komal: false, tivra: false },
  { name: 'R', komal: true, tivra: false },
  { name: 'R', komal: false, tivra: false },
  { name: 'G', komal: true, tivra: false },
  { name: 'G', komal: false, tivra: false },
  { name: 'M', komal: false, tivra: false },
  { name: 'M', komal: false, tivra: true },
  { name: 'P', komal: false, tivra: false },
  { name: 'D', komal: true, tivra: false },
  { name: 'D', komal: false, tivra: false },
  { name: 'N', komal: true, tivra: false },
  { name: 'N', komal: false, tivra: false },
];

/** Semitone offsets within an octave that are rendered as black keys. */
export const BLACK_POSITIONS = new Set([1, 3, 6, 8, 10]);

/** The Western octave the root is placed in when it is C–F♯. */
export const ROOT_OCTAVE = 4;

export const WHITE_KEY_WIDTH = 46;
export const BLACK_KEY_WIDTH = 28;

/** Index of a root note within `ROOT_NOTES`, i.e. its semitone above C. */
export function rootIndexOf(rootNote: string): number {
  const i = (ROOT_NOTES as readonly string[]).indexOf(rootNote);
  return i === -1 ? 0 : i;
}

/**
 * Western octave the tonic sits in. Roots from G upward drop to octave 3, so
 * the keyboard's range stays in a comfortable register instead of drifting
 * shrill — which is why the root picker shows the octave explicitly.
 */
export function rootOctaveOf(rootIndex: number): number {
  return ROOT_OCTAVE - (rootIndex >= 7 ? 1 : 0);
}

/** Absolute pitch of the tonic. */
export function rootAbsOf(rootIndex: number): number {
  return rootOctaveOf(rootIndex) * 12 + rootIndex;
}

/** The root as shown in the picker, e.g. `C4` or `G3`. */
export function rootLabel(rootNote: string): string {
  const i = rootIndexOf(rootNote);
  return `${ROOT_NOTES[i]}${rootOctaveOf(i)}`;
}

/** Absolute pitch, so notes across octaves can be compared and ordered. */
export function absPitch(note: { octave: number; semitone: number }): number {
  return note.octave * 12 + note.semitone;
}

export interface PitchRange {
  low: number;
  high: number;
}

/**
 * The span of keys shown for a given root: a fifth below the tonic up to a
 * twelfth above, which keeps the tonic well inside the keyboard rather than
 * pinned to its left edge.
 */
export function computeRange(rootIndex: number): PitchRange {
  const rootAbs = rootAbsOf(rootIndex);
  return { low: rootAbs - 7, high: rootAbs + 19 };
}

/**
 * Which saptak a pitch falls in, measured **from the tonic** — not from C.
 *
 * Sa *is* the octave boundary in Indian notation: with the root at G3, the
 * madhya saptak runs G3–F♯4, so F♯3 takes a dot below and G4 a dot above.
 * Keying this off Western octave numbers (as an earlier version did) puts the
 * dots at C, which is unrelated to where Sa sits.
 */
export function saptakOf(abs: number, rootAbs: number): Saptak {
  if (abs < rootAbs) return 'mandra';
  if (abs >= rootAbs + 12) return 'taar';
  return 'madhya';
}

/** A single pitch on the keyboard. */
export interface Note {
  /** Base letter: `C`/`F♯` for Western, a bare sargam letter for Indian. */
  name: string;
  octave: number;
  /** Semitone within the octave, 0–11. */
  semitone: number;
  /** Octave number shown beneath the name; null for Indian. */
  octaveLabel: number | null;
  /** Indian only — komal swara, drawn as a line under the letter. */
  komal: boolean;
  /** Indian only — tivra Ma, drawn as a stroke above the letter. */
  tivra: boolean;
  /** Indian only — which saptak, drawn as a dot above/below. */
  saptak: Saptak | null;
}

/**
 * The name a key carries.
 *
 * Western names are **absolute**: C is C whatever the root is. Sargam is
 * **relative** — Sa *is* the tonic — so the syllables rotate onto the root.
 * Neither changes what a key sounds: a key always plays its own pitch.
 */
export function noteName(
  notation: Notation,
  rootIndex: number,
  semitone: number,
): string {
  if (notation === 'indian') {
    return SARGAM[(((semitone - rootIndex) % 12) + 12) % 12].name;
  }
  return CHROMATIC_WESTERN[((semitone % 12) + 12) % 12];
}

/** Build one note from an absolute pitch. */
export function noteAt(
  notation: Notation,
  rootIndex: number,
  abs: number,
): Note {
  const octave = Math.floor(abs / 12);
  const semitone = ((abs % 12) + 12) % 12;

  if (notation === 'western') {
    return {
      name: CHROMATIC_WESTERN[semitone],
      octave,
      semitone,
      octaveLabel: octave,
      komal: false,
      tivra: false,
      saptak: null,
    };
  }

  const swara = SARGAM[(((semitone - rootIndex) % 12) + 12) % 12];
  return {
    name: swara.name,
    octave,
    semitone,
    octaveLabel: null,
    komal: swara.komal,
    tivra: swara.tivra,
    saptak: saptakOf(abs, rootAbsOf(rootIndex)),
  };
}

export interface KeyboardKey extends Note {
  width: number;
  /** Only set for black keys — their absolute offset within the track. */
  left?: number;
  inScale: boolean;
}

export interface KeyboardLayout {
  whiteKeys: KeyboardKey[];
  blackKeys: KeyboardKey[];
  width: number;
}

/** The pitch classes the scale occupies at the given root. */
export function scalePitchClasses(degrees: number[], rootIndex: number): Set<number> {
  return new Set(degrees.map((d) => (((rootIndex + d) % 12) + 12) % 12));
}

/**
 * Lay out the keyboard across the root's range. White keys flow in a row;
 * black keys are positioned absolutely, straddling the seam between the white
 * keys either side of them.
 */
export function buildKeyboard(
  notation: Notation,
  rootIndex: number,
  degrees: number[],
  range: PitchRange = computeRange(rootIndex),
): KeyboardLayout {
  const inScale = scalePitchClasses(degrees, rootIndex);
  const whiteKeys: KeyboardKey[] = [];
  const blackKeys: KeyboardKey[] = [];
  let whiteCount = 0;

  for (let abs = range.low; abs <= range.high; abs++) {
    const note = noteAt(notation, rootIndex, abs);
    const entry = { ...note, inScale: inScale.has(note.semitone) };
    if (BLACK_POSITIONS.has(note.semitone)) {
      blackKeys.push({
        ...entry,
        width: BLACK_KEY_WIDTH,
        left: whiteCount * WHITE_KEY_WIDTH - BLACK_KEY_WIDTH / 2,
      });
    } else {
      whiteKeys.push({ ...entry, width: WHITE_KEY_WIDTH });
      whiteCount++;
    }
  }

  return { whiteKeys, blackKeys, width: whiteCount * WHITE_KEY_WIDTH };
}

/**
 * The notes a tune may be drawn from: every pitch in the keyboard's range
 * whose interval above the root belongs to the scale. Derived from the same
 * range the keyboard uses, so every tune note is guaranteed to be tappable.
 */
export function scalePool(
  notation: Notation,
  rootIndex: number,
  degrees: number[],
  range: PitchRange = computeRange(rootIndex),
): Note[] {
  const inScale = scalePitchClasses(degrees, rootIndex);
  const pool: Note[] = [];
  for (let abs = range.low; abs <= range.high; abs++) {
    const note = noteAt(notation, rootIndex, abs);
    if (inScale.has(note.semitone)) pool.push(note);
  }
  return pool;
}

/** Look up a scale by key, falling back to the notation's first entry. */
export function findScale(notation: Notation, key: string): Scale {
  const list = SCALES[notation];
  return list.find((s) => s.key === key) ?? list[0];
}

/**
 * Widest leap allowed between consecutive tune notes, in semitones — a perfect
 * fifth. The pool spans over two octaves, so drawing every note independently
 * produced tunes that jumped G3 to G5 between beats: hard to hold in your head
 * and nothing like a melody. Steps are capped instead, which keeps a tune
 * singable while still letting it roam the whole range across several notes.
 */
export const MAX_LEAP = 7;

/**
 * Random tune of `length` notes drawn from the given pool, with each note
 * within `maxLeap` semitones of the one before it. The pool is assumed sorted
 * by pitch (as `scalePool` builds it), but nothing here depends on that.
 */
export function newTune(length: number, pool: Note[], maxLeap = MAX_LEAP): Note[] {
  if (pool.length === 0) return [];
  const tune: Note[] = [];
  for (let i = 0; i < length; i++) {
    const prev: Note | undefined = tune[i - 1];
    const reachable: Note[] = prev
      ? pool.filter((n) => Math.abs(absPitch(n) - absPitch(prev)) <= maxLeap)
      : pool;
    // Fall back to the whole pool if the cap leaves nothing reachable, so a
    // narrow scale or a tight range can never deal an empty round.
    const choices = reachable.length > 0 ? reachable : pool;
    tune.push(choices[Math.floor(Math.random() * choices.length)]);
  }
  return tune;
}

/** Full sargam names, for anything spoken rather than drawn. */
const SWARA_SPOKEN: Record<string, string> = {
  S: 'Sa', R: 'Re', G: 'Ga', M: 'Ma', P: 'Pa', D: 'Dha', N: 'Ni',
};

/**
 * How a note is *spoken* — for aria-labels.
 *
 * Never used for anything visible. Indian notation is drawn by `et-swara`;
 * spelling it with combining marks reads as mojibake to a screen reader (and
 * rendered badly on screen, which is why the marks became CSS in the first
 * place). This spells the marks out instead: "komal Ni, mandra saptak".
 */
export function noteAria(note: Note): string {
  if (note.octaveLabel !== null) return `${note.name}${note.octave}`;
  const swara = SWARA_SPOKEN[note.name] ?? note.name;
  const prefix = note.komal ? 'komal ' : note.tivra ? 'tivra ' : '';
  const saptak =
    note.saptak === 'mandra'
      ? ', mandra saptak'
      : note.saptak === 'taar'
        ? ', taar saptak'
        : '';
  return `${prefix}${swara}${saptak}`;
}
