import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-chip — a selectable pill. Used for the difficulty choices in the settings
 * panel. Teal fill when selected, outlined when not.
 *
 * @fires et-chip-select - CustomEvent<{ value: string }>
 */
@customElement('et-chip')
export class EtChip extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-1) var(--space-3);
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-text-muted);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition:
        background 0.15s ease,
        color 0.15s ease,
        border-color 0.15s ease;
    }
    button:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: 2px;
    }
    :host([selected]) button {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    :host([selected]) button:hover {
      background: var(--color-teal-600);
      border-color: var(--color-teal-600);
      color: var(--color-primary-contrast);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) label = '';
  @property({ type: Boolean, reflect: true }) selected = false;

  private _onClick() {
    this.dispatchEvent(
      new CustomEvent('et-chip-select', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button aria-pressed=${this.selected ? 'true' : 'false'} @click=${this._onClick}>
        ${this.label || html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-chip': EtChip;
  }
}
