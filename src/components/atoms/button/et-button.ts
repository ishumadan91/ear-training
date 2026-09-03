import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * et-button — the design system's button atom.
 *
 *   - `primary`   → Bright Teal fill, white text. The main action (Check answer).
 *   - `secondary` → neutral fill, dark text. Paired secondary action (Clear).
 *   - `accent`    → Warm Coral fill, white text. Reserved for standout CTAs.
 *   - `ghost`     → transparent with a tinted border.
 *
 * The inner button fills the host, so a parent can size it with flex
 * (e.g. `flex: 2`) and the button follows.
 *
 * Renders its light-DOM children as the label (use `label` for plain text).
 *
 * @fires click (native)
 */
@customElement('et-button')
export class EtButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      width: 100%;
      font-family: var(--font-family-base);
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-2);
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      padding: var(--space-3) var(--space-4);
      cursor: pointer;
      transition:
        background 0.15s ease,
        box-shadow 0.15s ease,
        transform 0.05s ease;
    }
    button:active {
      transform: translateY(1px);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: 2px;
    }
    button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }
    :host([size='sm']) button {
      font-size: var(--font-size-sm);
      padding: var(--space-1) var(--space-2);
    }
    :host([size='lg']) button {
      font-size: var(--font-size-xl);
      padding: var(--space-3) var(--space-6);
    }
    :host([variant='primary']) button {
      background: var(--color-primary);
      color: var(--color-primary-contrast);
    }
    :host([variant='primary']) button:hover:not([disabled]) {
      background: var(--color-teal-600);
    }
    :host([variant='secondary']) button {
      background: var(--color-neutral-100);
      color: var(--color-neutral-800);
    }
    :host([variant='secondary']) button:hover:not([disabled]) {
      background: var(--color-neutral-200);
    }
    :host([variant='accent']) button {
      background: var(--color-accent);
      color: var(--color-accent-contrast);
      box-shadow: var(--shadow-sm);
    }
    :host([variant='accent']) button:hover:not([disabled]) {
      background: var(--color-coral-600);
    }
    :host([variant='ghost']) button {
      background: transparent;
      color: var(--color-heading);
      border-color: var(--color-border);
    }
    :host([variant='ghost']) button:hover:not([disabled]) {
      background: var(--color-sand-200);
    }
  `;

  @property({ type: String, reflect: true }) variant: ButtonVariant = 'primary';
  @property({ type: String, reflect: true }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: String }) label = '';
  @property({ type: String }) type: 'button' | 'submit' = 'button';

  render() {
    return html`
      <button type=${this.type} ?disabled=${this.disabled}>
        ${this.label || html`<slot></slot>`}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-button': EtButton;
  }
}
