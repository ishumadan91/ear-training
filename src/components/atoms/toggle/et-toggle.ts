import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-toggle — an on/off switch (used by the "Western / Indian" notation
 * segment in the menu bar). Teal when on, neutral when off.
 *
 * @fires et-toggle-change - CustomEvent<{ checked: boolean }> on user toggle
 * @prop {boolean} checked
 * @prop {boolean} disabled
 */
@customElement('et-toggle')
export class EtToggle extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      width: 38px;
      height: 22px;
      padding: 2px;
      border-radius: var(--radius-pill);
      background: var(--color-muted);
      cursor: pointer;
      transition: background 0.18s ease;
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: 2px;
    }
    button[aria-pressed='true'] {
      background: var(--color-primary);
    }
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .thumb {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #fff;
      box-shadow: var(--shadow-sm);
      transition: transform 0.18s ease;
    }
    button[aria-pressed='true'] .thumb {
      transform: translateX(16px);
    }
  `;

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = 'Toggle';

  private _onClick() {
    if (this.disabled) return;
    this.checked = !this.checked;
    this.dispatchEvent(
      new CustomEvent('et-toggle-change', {
        detail: { checked: this.checked },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button
        role="switch"
        aria-pressed=${this.checked ? 'true' : 'false'}
        aria-label=${this.label}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <span class="thumb"></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-toggle': EtToggle;
  }
}
