import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/input-slot/et-input-slot.js';
import type { SlotState } from '../../atoms/input-slot/et-input-slot.js';

export interface SlotData {
  value?: string;
  state?: SlotState;
  octave?: number | null;
  komal?: boolean;
  tivra?: boolean;
  saptak?: 'mandra' | 'madhya' | 'taar' | null;
  /** Accessible name for the slot's replay button. */
  label?: string;
}

/**
 * et-input-row — the row of answer slots beneath the play control. Renders one
 * et-input-slot per entry; defaults to five empty slots.
 *
 * @fires et-slot-select - CustomEvent<{ index: number }> when a filled slot is
 *   tapped, so the page can replay that note.
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
        (s, i) =>
          html`<et-input-slot
            state=${s.state ?? 'empty'}
            value=${s.value ?? ''}
            .octave=${s.octave ?? null}
            ?komal=${s.komal ?? false}
            ?tivra=${s.tivra ?? false}
            .saptak=${s.saptak ?? null}
            label=${s.label ?? ''}
            @et-slot-press=${() =>
              this.dispatchEvent(
                new CustomEvent('et-slot-select', {
                  detail: { index: i },
                  bubbles: true,
                  composed: true,
                }),
              )}
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
