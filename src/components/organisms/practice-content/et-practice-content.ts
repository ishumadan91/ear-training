import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/button/et-button.js';
import '../../atoms/select/et-select.js';
import '../../atoms/alert/et-alert.js';
import '../../molecules/field/et-field.js';
import '../piano/et-piano.js';
import '../practice-card/et-practice-card.js';
import '../stats-bar/et-stats-bar.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import type { Notation } from '../../../data/scales.js';
import type { SelectOption } from '../../atoms/select/et-select.js';

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
    .pickers {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
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
  `;

  @property({ attribute: false }) scaleOptions: SelectOption[] = [];
  @property({ attribute: false }) rootOptions: SelectOption[] = [];
  @property({ type: String }) rootNote = 'C';
  /** Root and scale are fixed once the round's tune has been played. */
  @property({ type: Boolean }) settingsLocked = false;
  @property({ type: Boolean }) canBackspace = false;
  @property({ type: Boolean }) playing = false;
  @property({ attribute: false }) slots: SlotData[] | null = null;
  @property({ type: String }) notation: Notation = 'western';
  @property({ type: Number }) rootOffset = 0;
  @property({ type: String }) scaleKey = '';
  @property({ type: String }) feedbackTone: AlertTone | null = null;
  @property({ type: String }) feedbackText = '';
  /** Second line inside the feedback banner — the revealed answer. */
  @property({ type: String }) feedbackDetail = '';
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
        <et-select
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
          rootOffset=${this.rootOffset}
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
            detail=${this.feedbackDetail}
          ></et-alert>`
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
