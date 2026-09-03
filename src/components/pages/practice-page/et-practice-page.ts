import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '../../templates/practice-template/et-practice-template.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { BadgeData } from '../../organisms/practice-content/et-practice-content.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import {
  DIFFICULTY_LENGTH,
  ROOT_NOTES,
  SCALES,
  absPitch,
  findScale,
  newTune,
  scalePool,
  semitoneOf,
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
import { loadPreferences, savePreferences } from '../../../data/preferences.js';

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
  @state() private notation: Notation = 'western';
  @state() private scaleKey = 'major';
  @state() private rootNote = 'C';
  @state() private difficulty: Difficulty = 'medium';
  @state() private settingsOpen = false;
  @state() private playing = false;

  /** The instrument the *tune* plays on. Taps answer on the other one. */
  @state() private instrument: Instrument = 'piano';
  /** Set once the tune has been played; cleared when a new tune is dealt. */
  @state() private instrumentLocked = false;

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

  private get _scale() {
    return findScale(this.notation, this.scaleKey);
  }

  /** Semitone the selected root sits on, used to transpose playback. */
  private get _rootOffset(): number {
    const offset = semitoneOf(this.rootNote);
    return offset === -1 ? 0 : offset;
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
    if (!this.feedback || this.feedback === 'correct') return '';
    const answer = this.tune.map((n) => `${n.name}${n.octave}`).join(', ');
    return `Correct answer: ${answer}`;
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
      return { state, value: answer.name, octave: answer.octave };
    });
  }

  private get _badges(): BadgeData[] {
    const unit = this.notation === 'western' ? 'scale' : 'thaat';
    return [
      { label: `Round ${this.round}`, variant: 'primary' },
      { label: `Streak ${this.correctCount}` },
      { label: `${this._scale.label} ${unit}` },
      { label: `Root ${this.rootNote}` },
    ];
  }

  /** Null until a round has been graded — see `et-stats-bar.accuracy`. */
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
    this.tune = newTune(length, scalePool(this.notation, this.scaleKey));
    this.answers = new Array(length).fill(null);
    this.feedback = null;
    this.feedbackOffset = 0;
    this.instrumentLocked = false;
    this.playing = false;
  }

  /* ---------- settings ---------- */

  private _onSettingsToggle = () => {
    this.settingsOpen = !this.settingsOpen;
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
    this.scaleKey = e.detail.value;
    this._savePreferences();
    this._dealTune();
  };

  private _onRootChange = (e: CustomEvent<{ value: string }>) => {
    this.rootNote = e.detail.value;
    this._savePreferences();
  };

  private _onInstrumentChange = (e: CustomEvent<{ value: string }>) => {
    // Ignored while locked; the control is disabled, so this is belt-and-braces
    // against a programmatic change mid-round.
    if (this.instrumentLocked) return;
    this.instrument = e.detail.value as Instrument;
    this._savePreferences();
  };

  /* ---------- practice ---------- */

  private _pitchOf(note: Note): number {
    return absPitch(note) + this._rootOffset;
  }

  private _onPlayToggle = async (e: CustomEvent<{ playing: boolean }>) => {
    if (!e.detail.playing) {
      this.playing = false;
      return;
    }
    // Playing the tune fixes the instrument for the rest of the round.
    this.instrumentLocked = true;
    this.playing = true;
    await playSequence(this.tune.map((n) => this._pitchOf(n)), this.instrument);
    this.playing = false;
  };

  private _onNotePress = (e: CustomEvent<Note & { pitch: number }>) => {
    const { name, octave, semitone, pitch } = e.detail;
    // Taps answer in the *other* instrument, so timbre is never a crutch.
    playNote(pitch + this._rootOffset, inputInstrument(this.instrument));

    if (this.feedback) return; // round is graded; keys are audition-only
    const next = this.answers.slice();
    const emptyPos = next.findIndex((a) => a === null);
    if (emptyPos === -1) return; // every slot filled — just sound the note
    next[emptyPos] = { name, octave, semitone };
    this.answers = next;
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
    const rootOptions = ROOT_NOTES.map((n) => ({ value: n, label: n }));

    return html`
      <et-practice-template
        heading="Name the notes"
        ?settingsOpen=${this.settingsOpen}
        notation=${this.notation}
        difficulty=${this.difficulty}
        rootNote=${this.rootNote}
        scaleKey=${this.scaleKey}
        instrument=${this.instrument}
        ?instrumentLocked=${this.instrumentLocked}
        .rootOptions=${rootOptions}
        .scaleOptions=${scaleOptions}
        .badges=${this._badges}
        ?playing=${this.playing}
        .slots=${this._slots}
        .feedbackTone=${this._feedbackTone}
        feedbackText=${this._feedbackText}
        feedbackDetail=${this._feedbackDetail}
        ?graded=${this.feedback !== null}
        score=${this.score}
        streak=${this.correctCount}
        .accuracy=${this._accuracy}
        @et-icon-button-click=${this._onSettingsToggle}
        @et-notation-change=${this._onNotationChange}
        @et-difficulty-change=${this._onDifficultyChange}
        @et-scale-change=${this._onScaleChange}
        @et-root-change=${this._onRootChange}
        @et-instrument-change=${this._onInstrumentChange}
        @et-play-toggle=${this._onPlayToggle}
        @et-note-press=${this._onNotePress}
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
