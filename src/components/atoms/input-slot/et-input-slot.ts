import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type SlotState = 'empty' | 'filled' | 'correct' | 'octave' | 'incorrect';

/**
 * et-input-slot — one answer cell in the input row. Holds a note name with its
 * octave beneath, and reflects a grading state:
 *
 *   empty → dashed neutral outline · filled → teal tint · correct → green
 *   octave → amber (right pitch class, wrong octave) · incorrect → red
 */
@customElement('et-input-slot')
export class EtInputSlot extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      flex-shrink: 0;
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
    .octave {
      display: block;
      font-size: 9px;
      font-weight: var(--font-weight-semibold);
      opacity: 0.75;
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
  /** Octave number shown beneath the note name. */
  @property({ type: Number }) octave: number | null = null;

  render() {
    return html`<span class="slot">
      ${this.value}
      ${this.octave !== null && this.value
        ? html`<small class="octave">${this.octave}</small>`
        : nothing}
    </span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-input-slot': EtInputSlot;
  }
}
