import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/card/et-card.js';
import '../../molecules/play-button/et-play-button.js';
import '../../molecules/waveform/et-waveform.js';
import '../../molecules/input-row/et-input-row.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';

/**
 * et-practice-card — the listening panel: the prompt, the play control, the
 * waveform, and the row of answer slots the learner fills in.
 *
 * @fires et-play-toggle (bubbles from the play button)
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

  render() {
    return html`
      <et-card>
        <div class="stack">
          <p class="prompt">${this.prompt}</p>
          <et-play-button ?playing=${this.playing}></et-play-button>
          <et-waveform ?playing=${this.playing}></et-waveform>
          <et-input-row .slots=${this.slots}></et-input-row>
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
