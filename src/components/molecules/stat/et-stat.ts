import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-stat — one figure in the session stats strip: a large navy value over a
 * small muted caption.
 */
@customElement('et-stat')
export class EtStat extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
    }
    .value {
      font-family: var(--font-family-base);
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      line-height: 1.2;
      color: var(--color-heading);
    }
    .caption {
      font-family: var(--font-family-base);
      font-size: var(--font-size-xs);
      color: var(--color-text-muted);
    }
  `;

  @property({ type: String }) value = '';
  @property({ type: String }) caption = '';

  render() {
    return html`
      <div class="value">${this.value}</div>
      <div class="caption">${this.caption}</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-stat': EtStat;
  }
}
