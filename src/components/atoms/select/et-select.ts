import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface SelectOption {
  value: string;
  label: string;
}

/**
 * et-select — a styled native `<select>`. Used for root note, scale/thaat and
 * instrument in the settings panel. Native on purpose: it gets the platform
 * picker on mobile for free.
 *
 * @fires et-select-change - CustomEvent<{ value: string }>
 */
@customElement('et-select')
export class EtSelect extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    select {
      box-sizing: border-box;
      width: 100%;
      height: 40px;
      padding: 0 var(--space-8) 0 var(--space-4);
      border: 1px solid var(--color-neutral-300);
      border-radius: var(--radius-md);
      background: var(--color-surface);
      color: var(--color-text);
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      line-height: 1;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right var(--space-3) center;
      background-size: 16px 16px;
    }
    select:focus {
      outline: none;
      box-shadow: 0 0 0 2px var(--color-primary);
    }
    select[disabled] {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  @property({ attribute: false }) options: SelectOption[] = [];
  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _onChange(e: Event) {
    const value = (e.target as HTMLSelectElement).value;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('et-select-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <select
        aria-label=${this.label}
        ?disabled=${this.disabled}
        .value=${this.value}
        @change=${this._onChange}
      >
        ${this.options.map(
          (o) => html`<option value=${o.value} ?selected=${o.value === this.value}>
            ${o.label}
          </option>`,
        )}
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-select': EtSelect;
  }
}
