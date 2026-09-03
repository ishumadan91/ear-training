import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../templates/practice-template/et-practice-template.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import {
  DIFFICULTY_LENGTH,
  noteAria,
  ROOT_NOTES,
  SCALES,
  absPitch,
  findScale,
  newTune,
  rootIndexOf,
  rootLabel,
  scalePool,
  type Difficulty,
  type Notation,
  type Note,
} from '../../../data/scales.js';
import {
  inputInstrument,
  playNote,
  playSequence,
  type Instrument,
} from '../../../audio/audio-engine.js';
import {
  hasSeenAbout,
  loadPreferences,
  markAboutSeen,
  savePreferences,
} from '../../../data/preferences.js';

/** How a graded round turned out. */
type Feedback = 'correct' | 'octave' | 'transposed' | 'wrong';

/**
 * et-practice-page — the Practice screen wired to state. Owns the session
 * model (notation, scale, root, difficulty, instrument, the generated tune,
 * the learner's answers and the running score), plays the audio, and reacts to
 * events bubbling up from the template.
 */
@customElement('et-practice-page')
export class EtPracticePage extends LitElement {
  // The page renders into light DOM so the page-level styles in global.css
  // (the centered mobile frame) apply to its host.
  createRenderRoot() {
    return this;
  }

  // Seeded from stored preferences; progress below always starts fresh.
  // These mirror DEFAULT_PREFERENCES for the pre-load frame.
  @state() private notation: Notation = 'indian';
  @state() private scaleKey = 'bilawal';
  @state() private rootNote = 'C';
  @state() private difficulty: Difficulty = 'medium';
  @state() private settingsOpen = false;
  @state() private aboutOpen = false;
  @state() private playing = false;

  /** The instrument the *tune* plays on. Taps answer on the other one. */
  @state() private instrument: Instrument = 'piano';
  /**
   * Set once the tune has been played, cleared when a new tune is dealt.
   *
   * Root, scale and instrument are all fixed for the rest of the round: the
   * learner has heard a tune in a particular key on a particular instrument,
   * and changing any of those underneath a half-entered answer is confusing.
   */
  @state() private settingsLocked = false;

  @state() private round = 1;
  @state() private score = 0;
  @state() private correctCount = 0;
  @state() private totalCount = 0;

  @state() private tune: Note[] = [];
  @state() private answers: (Note | null)[] = [];
  @state() private feedback: Feedback | null = null;
  /** Semitone shift detected when the whole tune was played in the wrong key. */
  @state() private feedbackOffset = 0;

  connectedCallback() {
    super.connectedCallback();
    const prefs = loadPreferences();
    this.notation = prefs.notation;
    this.scaleKey = prefs.scaleKey;
    this.rootNote = prefs.rootNote;
    this.difficulty = prefs.difficulty;
    this.instrument = prefs.instrument;

    // First visit: open the explainer once, and record it immediately rather
    // than on dismiss. Marking on dismiss would replay onboarding forever for
    // anyone who reloads without closing it.
    if (!hasSeenAbout()) {
      this.aboutOpen = true;
      markAboutSeen();
    }

    // Deal only after the preferences land, so the first tune already uses the
    // restored scale and difficulty rather than the defaults.
    this._dealTune();
  }

  /** Persist the current settings. Progress is intentionally not stored. */
  private _savePreferences() {
    savePreferences({
      notation: this.notation,
      scaleKey: this.scaleKey,
      rootNote: this.rootNote,
      difficulty: this.difficulty,
      instrument: this.instrument,
    });
  }

  /* ---------- derived ---------- */

  /**
   * Semitone the selected root sits on.
   *
   * This selects *which keys belong to the scale*, where Sa sits for Indian
   * notation, and which stretch of the keyboard is shown. It is never added to
   * a pitch before playing: a key must sound the note it is labelled with, or
   * the keyboard is lying.
   */
  private get _rootIndex(): number {
    return rootIndexOf(this.rootNote);
  }

  private get _feedbackTone(): AlertTone | null {
    if (this.feedback === 'correct') return 'success';
    if (this.feedback === 'octave' || this.feedback === 'transposed') return 'warning';
    if (this.feedback === 'wrong') return 'error';
    return null;
  }

  private get _feedbackText(): string {
    switch (this.feedback) {
      case 'correct':
        return 'Correct! Well played.';
      case 'octave':
        return 'Right notes, wrong octave in places — half credit.';
      case 'transposed': {
        const n = Math.abs(this.feedbackOffset);
        return `Right shape, wrong key — you shifted the whole tune by ${n} semitone${n === 1 ? '' : 's'}.`;
      }
      case 'wrong':
        return 'Not quite right.';
      default:
        return '';
    }
  }

  /**
   * The tune spelled out, revealed after any round that wasn't fully correct.
   * Uses the scale's own spelling (`E♭4`), which is the musically correct name
   * even though the learner taps the key labelled `D♯4`.
   */
  private get _feedbackDetail(): string {
    return this._answerNotes.length ? 'Correct answer:' : '';
  }

  /**
   * The tune, revealed after any round that wasn't fully correct. Passed as
   * notes rather than text so the banner can draw the same glyphs the keys
   * use — spelling them out would put combining marks back on screen.
   */
  private get _answerNotes(): Note[] {
    if (!this.feedback || this.feedback === 'correct') return [];
    return this.tune;
  }

  private get _slots(): SlotData[] {
    return this.tune.map((expected, i) => {
      const answer = this.answers[i];
      if (!answer) return { state: 'empty', value: '', octave: null };
      let state: SlotData['state'] = 'filled';
      if (this.feedback) {
        const samePitch = answer.semitone === expected.semitone;
        const sameOctave = answer.octave === expected.octave;
        state = samePitch && sameOctave ? 'correct' : samePitch ? 'octave' : 'incorrect';
      }
      return {
        state,
        value: answer.name,
        octave: answer.octaveLabel,
        komal: answer.komal,
        tivra: answer.tivra,
        saptak: answer.saptak,
        label: `Replay ${noteAria(answer)}`,
      };
    });
  }

  private get _accuracy(): number | null {
    if (this.totalCount === 0) return null;
    return Math.round((this.correctCount / this.totalCount) * 100);
  }

  /* ---------- round lifecycle ---------- */

  /**
   * Deal a fresh tune for the current scale + difficulty, and release the
   * instrument lock — a new tune is the point at which a pending instrument
   * change becomes effective.
   */
  private _dealTune() {
    const length = DIFFICULTY_LENGTH[this.difficulty];
    this.tune = newTune(
      length,
      scalePool(
        this.notation,
        this._rootIndex,
        findScale(this.notation, this.scaleKey).degrees,
      ),
    );
    this.answers = new Array(length).fill(null);
    this.feedback = null;
    this.feedbackOffset = 0;
    this.settingsLocked = false;
    this.playing = false;
  }

  /* ---------- settings ---------- */

  private _onSettingsToggle = () => {
    this.settingsOpen = !this.settingsOpen;
  };

  private _onAboutToggle = () => {
    this.aboutOpen = !this.aboutOpen;
  };

  private _onNotationChange = (e: CustomEvent<{ value: string }>) => {
    const notation = e.detail.value as Notation;
    if (notation === this.notation) return;
    this.notation = notation;
    // Each notation has its own scale list, so fall back to its first entry.
    this.scaleKey = SCALES[notation][0].key;
    this._savePreferences();
    this._dealTune();
  };

  private _onDifficultyChange = (e: CustomEvent<{ value: string }>) => {
    this.difficulty = e.detail.value as Difficulty;
    this._savePreferences();
    this._dealTune();
  };

  private _onScaleChange = (e: CustomEvent<{ value: string }>) => {
    if (this.settingsLocked) return;
    this.scaleKey = e.detail.value;
    this._savePreferences();
    this._dealTune();
  };

  private _onRootChange = (e: CustomEvent<{ value: string }>) => {
    if (this.settingsLocked) return;
    this.rootNote = e.detail.value;
    this._savePreferences();
    // The root decides which keys are in scale, so the pool — and with it the
    // tune — has to be rebuilt rather than left pointing at the old key.
    this._dealTune();
  };

  private _onInstrumentChange = (e: CustomEvent<{ value: string }>) => {
    // Ignored while locked; the control is disabled, so this is belt-and-braces
    // against a programmatic change mid-round.
    if (this.settingsLocked) return;
    this.instrument = e.detail.value as Instrument;
    this._savePreferences();
  };

  /* ---------- practice ---------- */

  private _onPlayToggle = async (e: CustomEvent<{ playing: boolean }>) => {
    if (!e.detail.playing) {
      this.playing = false;
      return;
    }
    // Playing the tune fixes root, scale and instrument for the rest of the round.
    this.settingsLocked = true;
    this.playing = true;
    await playSequence(this.tune.map(absPitch), this.instrument);
    this.playing = false;
  };

  private _onNotePress = (e: CustomEvent<Note & { pitch: number }>) => {
    const { name, octave, semitone, octaveLabel, komal, tivra, saptak, pitch } =
      e.detail;
    // Taps answer in the *other* instrument, so timbre is never a crutch.
    // The pitch is the key's own — never transposed by the root.
    playNote(pitch, inputInstrument(this.instrument));

    if (this.feedback) return; // round is graded; keys are audition-only
    const next = this.answers.slice();
    const emptyPos = next.findIndex((a) => a === null);
    if (emptyPos === -1) return; // every slot filled — just sound the note
    next[emptyPos] = { name, octave, semitone, octaveLabel, komal, tivra, saptak };
    this.answers = next;
  };

  /** Remove the last note entered, so a single mistap doesn't cost the row. */
  private _onBackspace = () => {
    const next = this.answers.slice();
    for (let i = next.length - 1; i >= 0; i--) {
      if (next[i] !== null) {
        next[i] = null;
        this.answers = next;
        this.feedback = null;
        return;
      }
    }
  };

  /**
   * Replay one entered note. Uses the input instrument, matching what the key
   * sounded like when it was tapped — the tune's own instrument is the other
   * one, and hearing it here would blur that distinction.
   */
  private _onSlotSelect = (e: CustomEvent<{ index: number }>) => {
    const answer = this.answers[e.detail.index];
    if (!answer) return;
    playNote(absPitch(answer), inputInstrument(this.instrument));
  };

  private _onClear = () => {
    this.answers = new Array(this.answers.length).fill(null);
    this.feedback = null;
    this.feedbackOffset = 0;
  };

  private _onNext = () => {
    this.round += 1;
    this._dealTune();
  };

  private _onCheck = () => {
    const answers = this.answers;
    if (answers.some((a) => a === null)) return;
    const given = answers as Note[];
    const tune = this.tune;

    const allExact = given.every(
      (a, i) => a.semitone === tune[i].semitone && a.octave === tune[i].octave,
    );
    const allSamePitchClass = given.every((a, i) => a.semitone === tune[i].semitone);

    // A consistent shift across every note means the shape was heard correctly
    // but anchored to the wrong starting pitch.
    const offset = absPitch(given[0]) - absPitch(tune[0]);
    const isTransposed =
      !allExact &&
      offset !== 0 &&
      tune.every((n, i) => absPitch(given[i]) - absPitch(n) === offset);

    this.totalCount += 1;

    if (allExact) {
      this.feedback = 'correct';
      this.score += tune.length;
      this.correctCount += 1;
    } else if (allSamePitchClass) {
      this.feedback = 'octave';
      this.score += Math.ceil(tune.length / 2);
    } else if (isTransposed) {
      this.feedback = 'transposed';
      this.feedbackOffset = offset;
      this.score += 1;
    } else {
      this.feedback = 'wrong';
    }
  };

  render() {
    const scaleOptions = SCALES[this.notation].map((s) => ({
      value: s.key,
      label: s.label,
    }));
    // The label carries the octave (C4, G3) because that is where the madhya
    // saptak begins — without it the dot placement looks arbitrary.
    const rootOptions = ROOT_NOTES.map((n) => ({ value: n, label: rootLabel(n) }));

    return html`
      <et-practice-template
        heading="Name the notes"
        ?settingsOpen=${this.settingsOpen}
        ?aboutOpen=${this.aboutOpen}
        notation=${this.notation}
        difficulty=${this.difficulty}
        rootNote=${this.rootNote}
        scaleKey=${this.scaleKey}
        instrument=${this.instrument}
        ?settingsLocked=${this.settingsLocked}
        .rootOptions=${rootOptions}
        .scaleOptions=${scaleOptions}
        ?canBackspace=${this.answers.some((a) => a !== null)}
        ?playing=${this.playing}
        .slots=${this._slots}
        .feedbackTone=${this._feedbackTone}
        feedbackText=${this._feedbackText}
        feedbackDetail=${this._feedbackDetail}
        .answerNotes=${this._answerNotes}
        ?graded=${this.feedback !== null}
        score=${this.score}
        streak=${this.correctCount}
        .accuracy=${this._accuracy}
        @et-settings-toggle=${this._onSettingsToggle}
        @et-about-toggle=${this._onAboutToggle}
        @et-about-close=${() => (this.aboutOpen = false)}
        @et-notation-change=${this._onNotationChange}
        @et-difficulty-change=${this._onDifficultyChange}
        @et-scale-change=${this._onScaleChange}
        @et-root-change=${this._onRootChange}
        @et-instrument-change=${this._onInstrumentChange}
        @et-play-toggle=${this._onPlayToggle}
        @et-note-press=${this._onNotePress}
        @et-slot-select=${this._onSlotSelect}
        @et-backspace=${this._onBackspace}
        @et-clear=${this._onClear}
        @et-check=${this._onCheck}
        @et-next=${this._onNext}
      ></et-practice-template>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-practice-page': EtPracticePage;
  }
}
