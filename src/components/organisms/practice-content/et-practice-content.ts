import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/button/et-button.js';
import '../../atoms/select/et-select.js';
import '../../molecules/segmented/et-segmented.js';
import '../../molecules/note-list/et-note-list.js';
import '../../atoms/alert/et-alert.js';
import '../../molecules/field/et-field.js';
import '../piano/et-piano.js';
import '../practice-card/et-practice-card.js';
import '../stats-bar/et-stats-bar.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import type { Notation, Note } from '../../../data/scales.js';
import type { SelectOption } from '../../atoms/select/et-select.js';

const NOTATION_OPTIONS = [
  { value: 'western', label: 'Western' },
  { value: 'indian', label: 'Indian' },
];

/**
 * et-practice-content — the scrollable practice body: the scale and root
 * pickers, the listening card, the note keyboard, the Clear / Check actions,
 * answer feedback, and the session stats.
 *
 * Scale and root sit here rather than in Settings — they are the two knobs a
 * learner reaches for between rounds, so they stay one tap away.
 *
 * Presentational; every interaction leaves as an event.
 *
 * @fires et-note-press (bubbles from the piano)
 * @fires et-play-toggle (bubbles from the practice card)
 * @fires et-clear - CustomEvent<void>
 * @fires et-check - CustomEvent<void>
 * @fires et-next  - CustomEvent<void>
 * @fires et-slot-select (bubbles from the answer row) — replay one note
 */
@customElement('et-practice-content')
export class EtPracticeContent extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
      padding: 0 var(--space-5) var(--space-5);
    }
    /* Stays put while the body scrolls, so the notation / scale / root
       controls are always reachable without scrolling back up. */
    .pickers {
      position: sticky;
      top: 0;
      z-index: 5;
      display: flex;
      align-items: center;
      gap: var(--space-2);
      flex-wrap: wrap;
      padding: var(--space-2) 0;
      background: var(--color-bg);
    }
    /* Pinned so the pill keeps one width whichever notation is active. */
    .pickers .scale {
      --et-select-width: var(--scale-select-width);
    }
    .actions {
      display: flex;
      gap: var(--space-3);
    }
    .actions .clear {
      flex: 1;
    }
    .actions .check {
      flex: 2;
    }
    .next {
      display: block;
    }
    .reveal {
      display: inline-flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0 var(--space-1);
    }
  `;

  @property({ attribute: false }) scaleOptions: SelectOption[] = [];
  @property({ attribute: false }) rootOptions: SelectOption[] = [];
  /** Root and scale are fixed once the round's tune has been played. */
  @property({ type: Boolean }) settingsLocked = false;
  @property({ type: Boolean }) canBackspace = false;
  @property({ type: Boolean }) playing = false;
  @property({ attribute: false }) slots: SlotData[] | null = null;
  @property({ type: String }) notation: Notation = 'western';
  @property({ type: String }) rootNote = 'C';
  @property({ type: String }) scaleKey = '';
  @property({ type: String }) feedbackTone: AlertTone | null = null;
  @property({ type: String }) feedbackText = '';
  /** Prefix for the revealed answer, e.g. "Correct answer:". */
  @property({ type: String }) feedbackDetail = '';
  /** The tune, revealed as glyphs when the round was not fully correct. */
  @property({ attribute: false }) answerNotes: Note[] = [];
  /**
   * Once the round is graded the Clear / Check pair is replaced by a single
   * "Next tune" action — there is nothing left to check, and re-checking a
   * graded round would double-count it.
   */
  @property({ type: Boolean }) graded = false;
  @property({ type: Number }) score = 0;
  @property({ type: Number }) streak = 0;
  @property({ type: Number }) accuracy: number | null = null;

  private _emit(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  private _emitValue(name: string, value: string) {
    this.dispatchEvent(
      new CustomEvent(name, { detail: { value }, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <div class="pickers">
        <et-segmented
          .options=${NOTATION_OPTIONS}
          value=${this.notation}
          @et-segment-change=${(e: CustomEvent<{ value: string }>) =>
            this._emitValue('et-notation-change', e.detail.value)}
        ></et-segmented>
        <et-select
          class="scale"
          variant="badge"
          label=${this.notation === 'western' ? 'Scale' : 'Thaat'}
          .options=${this.scaleOptions}
          value=${this.scaleKey}
          ?disabled=${this.settingsLocked}
          @et-select-change=${(e: CustomEvent<{ value: string }>) =>
            this._emitValue('et-scale-change', e.detail.value)}
        ></et-select>
        <et-select
          variant="badge"
          label="Root note"
          .options=${this.rootOptions}
          value=${this.rootNote}
          ?disabled=${this.settingsLocked}
          @et-select-change=${(e: CustomEvent<{ value: string }>) =>
            this._emitValue('et-root-change', e.detail.value)}
        ></et-select>
      </div>

      <et-practice-card
        ?playing=${this.playing}
        .slots=${this.slots}
        ?canBackspace=${this.canBackspace}
      ></et-practice-card>

      <et-field label="Tap the notes">
        <et-piano
          notation=${this.notation}
          rootNote=${this.rootNote}
          scaleKey=${this.scaleKey}
        ></et-piano>
      </et-field>

      ${this.graded
        ? html`<et-button
            class="next"
            variant="primary"
            label="Next tune"
            @click=${() => this._emit('et-next')}
          ></et-button>`
        : html`<div class="actions">
            <et-button
              class="clear"
              variant="secondary"
              label="Clear"
              @click=${() => this._emit('et-clear')}
            ></et-button>
            <et-button
              class="check"
              variant="primary"
              label="Check answer"
              @click=${() => this._emit('et-check')}
            ></et-button>
          </div>`}

      ${this.feedbackTone
        ? html`<et-alert
            tone=${this.feedbackTone}
            message=${this.feedbackText}
            ?hasDetail=${this.answerNotes.length > 0}
          >
            ${this.answerNotes.length
              ? html`<span slot="detail" class="reveal">
                  ${this.feedbackDetail}
                  <et-note-list .notes=${this.answerNotes}></et-note-list>
                </span>`
              : nothing}
          </et-alert>`
        : nothing}

      <et-stats-bar
        score=${this.score}
        streak=${this.streak}
        .accuracy=${this.accuracy}
      ></et-stats-bar>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-practice-content': EtPracticeContent;
  }
}
