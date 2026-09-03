import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/card/et-card.js';
import '../../atoms/chip/et-chip.js';
import '../../atoms/select/et-select.js';
import '../../molecules/field/et-field.js';
import '../../molecules/segmented/et-segmented.js';
import type { SelectOption } from '../../atoms/select/et-select.js';
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
 * difficulty, root note, scale/thaat and instrument.
 *
 * Presentational — it reports every change upward and holds no state itself.
 *
 * @fires et-notation-change   - CustomEvent<{ value: Notation }>
 * @fires et-difficulty-change - CustomEvent<{ value: Difficulty }>
 * @fires et-root-change       - CustomEvent<{ value: string }>
 * @fires et-scale-change      - CustomEvent<{ value: string }>
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
  @property({ type: String }) rootNote = 'C';
  @property({ type: String }) scaleKey = 'major';
  @property({ type: String }) instrument: Instrument = 'piano';
  /**
   * Set once the current tune has been played — the instrument is fixed for
   * the rest of the round so the pairing can't be swapped mid-answer.
   */
  @property({ type: Boolean }) instrumentLocked = false;
  @property({ attribute: false }) rootOptions: SelectOption[] = [];
  @property({ attribute: false }) scaleOptions: SelectOption[] = [];

  private _emit(name: string, value: string) {
    this.dispatchEvent(
      new CustomEvent(name, { detail: { value }, bubbles: true, composed: true }),
    );
  }

  render() {
    const scaleLabel = this.notation === 'western' ? 'Scale' : 'Thaat';
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

          <et-field label="Root note">
            <et-select
              label="Root note"
              .options=${this.rootOptions}
              value=${this.rootNote}
              @et-select-change=${(e: CustomEvent<{ value: string }>) =>
                this._emit('et-root-change', e.detail.value)}
            ></et-select>
          </et-field>

          <et-field label=${scaleLabel}>
            <et-select
              label=${scaleLabel}
              .options=${this.scaleOptions}
              value=${this.scaleKey}
              @et-select-change=${(e: CustomEvent<{ value: string }>) =>
                this._emit('et-scale-change', e.detail.value)}
            ></et-select>
          </et-field>

          <et-field label="Instrument">
            <et-select
              label="Instrument"
              .options=${[
                { value: 'piano', label: 'Piano' },
                { value: 'guitar', label: 'Guitar' },
              ]}
              value=${this.instrument}
              ?disabled=${this.instrumentLocked}
              @et-select-change=${(e: CustomEvent<{ value: string }>) =>
                this._emit('et-instrument-change', e.detail.value)}
            ></et-select>
            <p class="hint">
              The tune plays on ${INSTRUMENT_LABEL[this.instrument]} — your taps
              sound like ${INSTRUMENT_LABEL[inputInstrument(this.instrument)]}.
              ${this.instrumentLocked ? 'Locked until the next tune.' : ''}
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
