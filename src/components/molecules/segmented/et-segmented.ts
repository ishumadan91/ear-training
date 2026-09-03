import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface SegmentOption {
  value: string;
  label: string;
}

/**
 * et-segmented — a two-or-more option segmented control on a pill track.
 * Drives the Western / Indian notation choice, which sits inline with the
 * scale and root pickers above the listening card.
 *
 * @fires et-segment-change - CustomEvent<{ value: string }>
 */
@customElement('et-segmented')
export class EtSegmented extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .track {
      box-sizing: border-box;
      display: inline-flex;
      align-items: stretch;
      height: var(--control-height-pill);
      gap: 2px;
      padding: 2px;
      border-radius: var(--radius-pill);
      background: var(--color-neutral-100);
    }
    button {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 0 var(--space-3);
      border-radius: var(--radius-pill);
      white-space: nowrap;
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
      cursor: pointer;
      transition:
        background 0.15s ease,
        color 0.15s ease;
    }
    button:hover {
      color: var(--color-heading);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: -2px;
    }
    button.active {
      background: var(--color-surface);
      color: var(--color-primary);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
    }
  `;

  @property({ attribute: false }) options: SegmentOption[] = [];
  @property({ type: String }) value = '';

  private _select(value: string) {
    if (value === this.value) return;
    this.value = value;
    this.dispatchEvent(
      new CustomEvent('et-segment-change', {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <div class="track" role="tablist">
        ${this.options.map(
          (o) => html`
            <button
              role="tab"
              class=${o.value === this.value ? 'active' : ''}
              aria-selected=${o.value === this.value ? 'true' : 'false'}
              @click=${() => this._select(o.value)}
            >
              ${o.label}
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-segmented': EtSegmented;
  }
}
