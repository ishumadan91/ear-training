import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-card — the white rounded surface that groups related content (the
 * practice panel, the settings sheet, the stats strip). Padding is adjustable
 * via the `padding` attribute so cards can sit tight or roomy.
 */
@customElement('et-card')
export class EtCard extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-card);
      padding: var(--space-5);
    }
    :host([padding='sm']) {
      padding: var(--space-4);
    }
    :host([padding='tight']) {
      padding: var(--space-4) var(--space-5);
    }
  `;

  @property({ type: String, reflect: true }) padding: 'md' | 'sm' | 'tight' = 'md';

  render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-card': EtCard;
  }
}
