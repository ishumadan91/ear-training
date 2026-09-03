import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-field — a labelled form row: a small navy label above whatever control is
 * slotted in (a select, a segmented control, a chip group).
 */
@customElement('et-field')
export class EtField extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .label {
      display: block;
      margin-bottom: var(--space-1);
      font-family: var(--font-family-base);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: var(--color-heading);
    }
  `;

  @property({ type: String }) label = '';

  render() {
    return html`
      <span class="label">${this.label}</span>
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-field': EtField;
  }
}
