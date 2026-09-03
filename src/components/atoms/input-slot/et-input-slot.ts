import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../swara/et-swara.js';
import type { Saptak } from '../../../data/scales.js';

export type SlotState = 'empty' | 'filled' | 'correct' | 'octave' | 'incorrect';

/**
 * et-input-slot — one answer cell in the input row. Holds a note name with its
 * octave beneath, and reflects a grading state:
 *
 *   empty → dashed neutral outline · filled → teal tint · correct → green
 *   octave → amber (right pitch class, wrong octave) · incorrect → red
 *
 * A filled slot is a button: tapping it replays the note that was entered
 * there, so a learner can re-hear their own answer note by note.
 *
 * @fires et-slot-press - CustomEvent<void>, only from a filled slot
 */
@customElement('et-input-slot')
export class EtInputSlot extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }
    button.slot {
      font: inherit;
      color: inherit;
      cursor: pointer;
      transition:
        transform 0.05s ease,
        box-shadow 0.15s ease;
    }
    button.slot:hover {
      box-shadow: var(--shadow-sm);
    }
    button.slot:active {
      transform: scale(0.94);
    }
    button.slot:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: 2px;
    }
    .slot {
      box-sizing: border-box;
      width: 52px;
      height: 52px;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1.1;
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-bold);
      border-radius: var(--radius-md);
      border: 2px dashed var(--color-neutral-300);
      color: var(--color-heading);
    }

    :host([state='filled']) .slot {
      border-style: solid;
      border-color: var(--color-primary);
      background: color-mix(in oklab, var(--color-primary) 10%, transparent);
    }
    :host([state='correct']) .slot {
      border-style: solid;
      border-color: var(--color-success);
      background: var(--color-success-bg);
      color: var(--color-success);
    }
    :host([state='octave']) .slot {
      border-style: solid;
      border-color: var(--color-warning);
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }
    :host([state='incorrect']) .slot {
      border-style: solid;
      border-color: var(--color-error);
      background: var(--color-error-bg);
      color: var(--color-error);
    }
  `;

  @property({ type: String, reflect: true }) state: SlotState = 'empty';
  @property({ type: String }) value = '';
  /** Octave number shown beneath the note name. Null for Indian notation. */
  @property({ type: Number }) octave: number | null = null;
  @property({ type: Boolean }) komal = false;
  @property({ type: Boolean }) tivra = false;
  @property({ type: String }) saptak: Saptak | null = null;
  /** Accessible name for the replay button, e.g. "Replay Sa". */
  @property({ type: String }) label = '';

  private _press() {
    this.dispatchEvent(
      new CustomEvent('et-slot-press', { bubbles: true, composed: true }),
    );
  }

  render() {
    const glyph = html`<et-swara
      name=${this.value}
      ?komal=${this.komal}
      ?tivra=${this.tivra}
      .saptak=${this.saptak}
      .octaveLabel=${this.octave}
    ></et-swara>`;

    // Empty slots stay inert — there is nothing to replay.
    if (!this.value) return html`<span class="slot"></span>`;

    return html`<button
      class="slot"
      type="button"
      aria-label=${this.label || `Replay ${this.value}`}
      @click=${this._press}
    >
      ${glyph}
    </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-input-slot': EtInputSlot;
  }
}
