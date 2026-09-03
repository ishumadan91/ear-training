import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/card/et-card.js';
import '../../molecules/play-button/et-play-button.js';
import '../../molecules/waveform/et-waveform.js';
import '../../molecules/input-row/et-input-row.js';
import '../../atoms/icon-button/et-icon-button.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';

/**
 * et-practice-card — the listening panel: the prompt, the play control, the
 * waveform, and the row of answer slots the learner fills in.
 *
 * @fires et-play-toggle (bubbles from the play button)
 * @fires et-backspace - CustomEvent<void> — remove the last entered note
 */
@customElement('et-practice-card')
export class EtPracticeCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .stack {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-4);
    }
    .answer {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    .prompt {
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      text-align: center;
    }
    .hint {
      font-family: var(--font-family-base);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
      text-align: center;
    }
  `;

  @property({ type: String }) prompt =
    'Listen to the tune, then tap the notes you hear';
  @property({ type: Boolean }) playing = false;
  @property({ attribute: false }) slots: SlotData[] | null = null;
  @property({ type: String }) hint = 'Tap a key — includes octave';
  /** Whether there is anything to undo — greys the backspace when there isn't. */
  @property({ type: Boolean }) canBackspace = false;

  render() {
    return html`
      <et-card>
        <div class="stack">
          <p class="prompt">${this.prompt}</p>
          <et-play-button ?playing=${this.playing}></et-play-button>
          <et-waveform ?playing=${this.playing}></et-waveform>
          <div class="answer">
            <et-input-row .slots=${this.slots}></et-input-row>
            <et-icon-button
              name="backspace"
              label="Delete last note"
              size="16"
              ?disabled=${!this.canBackspace}
              @et-icon-button-click=${() =>
                this.dispatchEvent(
                  new CustomEvent('et-backspace', { bubbles: true, composed: true }),
                )}
            ></et-icon-button>
          </div>
          <p class="hint">${this.hint}</p>
        </div>
      </et-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-practice-card': EtPracticeCard;
  }
}
