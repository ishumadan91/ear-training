import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/input-slot/et-input-slot.js';
import type { SlotState } from '../../atoms/input-slot/et-input-slot.js';

export interface SlotData {
  value?: string;
  state?: SlotState;
  octave?: number | null;
}

/**
 * et-input-row — the row of answer slots beneath the play control. Renders one
 * et-input-slot per entry; defaults to five empty slots.
 */
@customElement('et-input-row')
export class EtInputRow extends LitElement {
  static styles = css`
    :host {
      display: flex;
      gap: var(--space-2);
      align-items: center;
      justify-content: center;
    }
  `;

  /** When no `slots` are provided, render this many empty cells. */
  @property({ type: Number }) count = 5;
  @property({ attribute: false }) slots: SlotData[] | null = null;

  private get _data(): SlotData[] {
    if (this.slots && this.slots.length) return this.slots;
    return Array.from({ length: this.count }, () => ({}));
  }

  render() {
    return html`
      ${this._data.map(
        (s) =>
          html`<et-input-slot
            state=${s.state ?? 'empty'}
            value=${s.value ?? ''}
            .octave=${s.octave ?? null}
          ></et-input-slot>`,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-input-row': EtInputRow;
  }
}
