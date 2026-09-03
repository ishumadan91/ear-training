import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-divider — a 1px rule. `orientation="vertical"` separates the menu-bar
 * segments; `horizontal` separates stacked content sections.
 */
@customElement('et-divider')
export class EtDivider extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--color-border);
    }
    :host([orientation='vertical']) {
      width: 1px;
      height: 100%;
      align-self: stretch;
    }
    :host([orientation='horizontal']) {
      width: 100%;
      height: 1px;
    }
  `;

  @property({ type: String, reflect: true }) orientation: 'horizontal' | 'vertical' =
    'horizontal';

  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-divider': EtDivider;
  }
}
