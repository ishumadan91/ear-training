import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type BadgeVariant = 'primary' | 'secondary' | 'muted';

/**
 * et-badge — a small pill label used for session status (round, streak, the
 * active scale and root). `primary` is a filled teal pill; `secondary` is an
 * outlined neutral pill.
 */
@customElement('et-badge')
export class EtBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    .badge {
      display: inline-block;
      padding: var(--space-1) var(--space-2);
      border-radius: var(--radius-pill);
      border: 1px solid transparent;
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      line-height: 1.4;
      white-space: nowrap;
    }
    :host([variant='primary']) .badge {
      background: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    :host([variant='secondary']) .badge {
      background: var(--color-surface-muted);
      color: var(--color-text);
      border-color: var(--color-border);
    }
    :host([variant='muted']) .badge {
      background: var(--color-border);
      color: var(--color-text-muted);
    }
  `;

  @property({ type: String, reflect: true }) variant: BadgeVariant = 'secondary';
  @property({ type: String }) label = '';

  render() {
    return html`<span class="badge">${this.label || html`<slot></slot>`}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-badge': EtBadge;
  }
}
