import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../icon/et-icon.js';
import type { IconName } from '../icon/icon-registry.js';

/**
 * et-icon-button — a circular, outlined icon control. Used for the settings
 * gear in the practice header.
 *
 * @fires et-icon-button-click - CustomEvent<void>
 */
@customElement('et-icon-button')
export class EtIconButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-pill);
      border: 1px solid var(--color-border);
      background: var(--color-surface);
      color: var(--color-heading);
      cursor: pointer;
      transition:
        background 0.15s ease,
        border-color 0.15s ease;
    }
    button:hover {
      background: var(--color-surface-muted);
      border-color: var(--color-primary);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: 2px;
    }
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.4;
    }
    button[disabled]:hover {
      background: var(--color-surface);
      border-color: var(--color-border);
    }
    :host([active]) button {
      background: var(--color-teal-100);
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
  `;

  @property({ type: String }) name: IconName = 'settings';
  @property({ type: String }) label = '';
  @property({ type: Number }) size = 18;
  @property({ type: Boolean, reflect: true }) active = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _onClick() {
    if (this.disabled) return;
    this.dispatchEvent(
      new CustomEvent('et-icon-button-click', { bubbles: true, composed: true }),
    );
  }

  render() {
    return html`
      <button
        aria-label=${this.label}
        aria-pressed=${this.active ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <et-icon name=${this.name} size=${this.size}></et-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-icon-button': EtIconButton;
  }
}
