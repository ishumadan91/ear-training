/**
 * Practice preferences persisted across sessions.
 *
 * Only *settings* are stored — notation, scale, root, difficulty and
 * instrument. Progress (score, streak, accuracy, round) is deliberately not
 * persisted: each visit starts a fresh session, so a stale streak can never be
 * mistaken for one the learner just earned.
 */

import {
  DIFFICULTY_LENGTH,
  ROOT_NOTES,
  SCALES,
  type Difficulty,
  type Notation,
} from './scales.js';
import type { Instrument } from '../audio/audio-engine.js';

const STORAGE_KEY = 'ear-training:preferences';

/**
 * Whether the explainer has been shown. Kept under its own key rather than
 * inside Preferences: it is not something the learner chose, and resetting
 * their settings shouldn't replay onboarding (or vice versa).
 */
const ABOUT_SEEN_KEY = 'ear-training:about-seen';

export interface Preferences {
  notation: Notation;
  scaleKey: string;
  rootNote: string;
  difficulty: Difficulty;
  instrument: Instrument;
}

/**
 * First-run defaults. Indian notation leads, with Bilawal as its first thaat —
 * a returning user's stored choice always wins over this.
 */
export const DEFAULT_PREFERENCES: Preferences = {
  notation: 'indian',
  scaleKey: 'bilawal',
  rootNote: 'C',
  difficulty: 'medium',
  instrument: 'piano',
};

/**
 * localStorage throws rather than returning null in some browsers — Safari in
 * private mode is the classic case — so every access is guarded. Losing
 * persistence is acceptable; taking the app down with it is not.
 */
function readRaw(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRaw(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full, disabled, or blocked — the session still works */
  }
}

function isNotation(v: unknown): v is Notation {
  return v === 'western' || v === 'indian';
}

function isDifficulty(v: unknown): v is Difficulty {
  return typeof v === 'string' && v in DIFFICULTY_LENGTH;
}

function isInstrument(v: unknown): v is Instrument {
  return v === 'piano' || v === 'guitar';
}

/**
 * Read stored preferences, validating every field.
 *
 * Stored values are untrusted: a user can edit them, and a build can change
 * the option lists underneath them. Anything unrecognised falls back to its
 * default rather than being handed to the app — a stale `scaleKey` would
 * otherwise resolve to a scale that no longer exists.
 */
export function loadPreferences(): Preferences {
  const raw = readRaw(STORAGE_KEY);
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PREFERENCES };
  const stored = raw as Partial<Record<keyof Preferences, unknown>>;

  const notation = isNotation(stored.notation)
    ? stored.notation
    : DEFAULT_PREFERENCES.notation;

  // A scale only means anything within its own notation — Bhairav is not a
  // Western scale — so it is validated against the notation resolved above.
  const scaleKey =
    typeof stored.scaleKey === 'string' &&
    SCALES[notation].some((s) => s.key === stored.scaleKey)
      ? stored.scaleKey
      : SCALES[notation][0].key;

  const rootNote =
    typeof stored.rootNote === 'string' &&
    (ROOT_NOTES as readonly string[]).includes(stored.rootNote)
      ? stored.rootNote
      : DEFAULT_PREFERENCES.rootNote;

  return {
    notation,
    scaleKey,
    rootNote,
    difficulty: isDifficulty(stored.difficulty)
      ? stored.difficulty
      : DEFAULT_PREFERENCES.difficulty,
    instrument: isInstrument(stored.instrument)
      ? stored.instrument
      : DEFAULT_PREFERENCES.instrument,
  };
}

/** Persist preferences. Silently a no-op where storage is unavailable. */
export function savePreferences(preferences: Preferences): void {
  writeRaw(STORAGE_KEY, preferences);
}

/**
 * True once the About sheet has been shown, so it only ever opens itself on a
 * first visit.
 *
 * Where storage is unavailable this stays false and the explainer opens every
 * launch. That is the right way to fail: a returning user seeing the help
 * again is a small annoyance, a first-time user never seeing it is not.
 */
export function hasSeenAbout(): boolean {
  return readRaw(ABOUT_SEEN_KEY) === true;
}

/** Record that the explainer has been shown. */
export function markAboutSeen(): void {
  writeRaw(ABOUT_SEEN_KEY, true);
}

/** Forget stored preferences, returning the app to its defaults. */
export function clearPreferences(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* nothing to do */
  }
}

/** Forget that the explainer was shown, so it opens again on the next visit. */
export function clearAboutSeen(): void {
  try {
    localStorage.removeItem(ABOUT_SEEN_KEY);
  } catch {
    /* nothing to do */
  }
}
