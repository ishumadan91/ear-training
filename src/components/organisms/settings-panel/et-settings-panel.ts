import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/card/et-card.js';
import '../../atoms/chip/et-chip.js';
import '../../atoms/select/et-select.js';
import '../../molecules/field/et-field.js';
import '../../molecules/segmented/et-segmented.js';
import type { Difficulty, Notation } from '../../../data/scales.js';
import { DIFFICULTY_LENGTH } from '../../../data/scales.js';
import {
  INSTRUMENT_LABEL,
  inputInstrument,
  type Instrument,
} from '../../../audio/audio-engine.js';

const NOTATION_OPTIONS = [
  { value: 'western', label: 'Western (C D E)' },
  { value: 'indian', label: 'Indian (Sa Re Ga)' },
];

const DIFFICULTIES: Difficulty[] = ['easy', 'medium', 'hard'];
const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

/**
 * et-settings-panel — the collapsible practice settings sheet: notation,
 * difficulty and instrument.
 *
 * Scale and root deliberately live on the practice screen instead (see
 * `et-practice-content`) — they change between rounds, so burying them behind
 * a settings toggle would cost two taps every time.
 *
 * Presentational — it reports every change upward and holds no state itself.
 *
 * @fires et-notation-change   - CustomEvent<{ value: Notation }>
 * @fires et-difficulty-change - CustomEvent<{ value: Difficulty }>
 * @fires et-instrument-change - CustomEvent<{ value: string }>
 */
@customElement('et-settings-panel')
export class EtSettingsPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .stack {
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    .chips {
      display: flex;
      gap: var(--space-2);
      flex-wrap: wrap;
    }
    .hint {
      margin-top: var(--space-1);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
  `;

  @property({ type: String }) notation: Notation = 'western';
  @property({ type: String }) difficulty: Difficulty = 'medium';
  @property({ type: String }) instrument: Instrument = 'piano';
  /**
   * Set once the current tune has been played. Root, scale and instrument are
   * all fixed for the rest of the round — the learner has heard a tune in a
   * given key, and moving it underneath a half-entered answer is confusing.
   */
  @property({ type: Boolean }) settingsLocked = false;

  private _emit(name: string, value: string) {
    this.dispatchEvent(
      new CustomEvent(name, { detail: { value }, bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <et-card padding="sm">
        <div class="stack">
          <et-field label="Notation">
            <et-segmented
              .options=${NOTATION_OPTIONS}
              value=${this.notation}
              @et-segment-change=${(e: CustomEvent<{ value: string }>) =>
                this._emit('et-notation-change', e.detail.value)}
            ></et-segmented>
          </et-field>

          <et-field label="Difficulty">
            <div class="chips">
              ${DIFFICULTIES.map(
                (d) => html`
                  <et-chip
                    value=${d}
                    label=${`${DIFFICULTY_LABEL[d]} · ${DIFFICULTY_LENGTH[d]} notes`}
                    ?selected=${this.difficulty === d}
                    @et-chip-select=${(e: CustomEvent<{ value: string }>) =>
                      this._emit('et-difficulty-change', e.detail.value)}
                  ></et-chip>
                `,
              )}
            </div>
          </et-field>

          <et-field label="Instrument">
            <et-select
              label="Instrument"
              .options=${[
                { value: 'piano', label: 'Piano' },
                { value: 'guitar', label: 'Guitar' },
              ]}
              value=${this.instrument}
              ?disabled=${this.settingsLocked}
              @et-select-change=${(e: CustomEvent<{ value: string }>) =>
                this._emit('et-instrument-change', e.detail.value)}
            ></et-select>
            <p class="hint">
              The tune plays on ${INSTRUMENT_LABEL[this.instrument]} — your taps
              sound like ${INSTRUMENT_LABEL[inputInstrument(this.instrument)]}.
              ${this.settingsLocked
                ? 'Root, scale and instrument are locked until the next tune.'
                : ''}
            </p>
          </et-field>
        </div>
      </et-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-settings-panel': EtSettingsPanel;
  }
}
