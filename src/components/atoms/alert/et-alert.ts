import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type AlertTone = 'success' | 'warning' | 'error';

/**
 * et-alert — the round feedback banner shown after checking an answer.
 * `warning` marks a partially-right answer (right notes, wrong octave or key).
 */
@customElement('et-alert')
export class EtAlert extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .alert {
      padding: var(--space-3) var(--space-4);
      border-radius: var(--radius-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-medium);
      text-align: center;
    }
    .detail {
      margin-top: var(--space-1);
      font-weight: var(--font-weight-semibold);
    }
    :host([tone='success']) .alert {
      background: var(--color-success-bg);
      color: var(--color-success);
    }
    :host([tone='warning']) .alert {
      background: var(--color-warning-bg);
      color: var(--color-warning);
    }
    :host([tone='error']) .alert {
      background: var(--color-error-bg);
      color: var(--color-error);
    }
  `;

  @property({ type: String, reflect: true }) tone: AlertTone = 'success';
  @property({ type: String }) message = '';
  /** Optional second line, e.g. revealing the answer after a missed round. */
  @property({ type: String }) detail = '';

  render() {
    return html`<div class="alert" role="status">
      ${this.message || html`<slot></slot>`}
      ${this.detail ? html`<div class="detail">${this.detail}</div>` : nothing}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-alert': EtAlert;
  }
}
