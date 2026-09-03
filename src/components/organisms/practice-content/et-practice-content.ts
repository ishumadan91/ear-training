import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/badge/et-badge.js';
import '../../atoms/button/et-button.js';
import '../../atoms/alert/et-alert.js';
import '../../molecules/field/et-field.js';
import '../piano/et-piano.js';
import '../practice-card/et-practice-card.js';
import '../stats-bar/et-stats-bar.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import type { Notation } from '../../../data/scales.js';

export interface BadgeData {
  label: string;
  variant?: 'primary' | 'secondary';
}

/**
 * et-practice-content — the scrollable practice body: status badges, the
 * listening card, the note keyboard, the Clear / Check actions, answer
 * feedback, and the session stats.
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
    .badges {
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

  @property({ attribute: false }) badges: BadgeData[] = [];
  @property({ type: Boolean }) playing = false;
  @property({ attribute: false }) slots: SlotData[] | null = null;
  @property({ type: String }) notation: Notation = 'western';
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

  render() {
    return html`
      <div class="badges">
        ${this.badges.map(
          (b) =>
            html`<et-badge variant=${b.variant ?? 'secondary'} label=${b.label}></et-badge>`,
        )}
      </div>

      <et-practice-card
        ?playing=${this.playing}
        .slots=${this.slots}
      ></et-practice-card>

      <et-field label="Tap the notes">
        <et-piano notation=${this.notation}></et-piano>
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
