import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-menu-segment — one tappable cell of the menu bar (Figma "Top nav").
 *
 * Layout: a heading line (with optional smaller suffix) on top, and a slot
 * underneath for the segment's control/indicator (a toggle, note icons, the
 * range glyph, …). Tapping the segment emits `et-segment-click`.
 *
 * @prop {string} key      - identifier emitted on click (e.g. "scale")
 * @prop {string} heading  - primary label, e.g. "A"
 * @prop {string} suffix   - smaller trailing text, e.g. "major"
 * @prop {boolean} active  - highlights the segment (e.g. currently editing)
 * @fires et-segment-click - CustomEvent<{ key: string }>
 */
@customElement('et-menu-segment')
export class EtMenuSegment extends LitElement {
  static styles = css`
    :host {
      display: block;
      flex: 1 1 0;
      min-width: 0;
    }
    button {
      all: unset;
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      padding: var(--space-2) var(--space-1);
      cursor: pointer;
      text-align: center;
      transition: background 0.15s ease;
    }
    button:hover {
      background: var(--color-sand-200);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: -2px;
    }
    :host([active]) button {
      background: var(--color-teal-100);
    }
    .heading {
      display: flex;
      align-items: baseline;
      gap: 4px;
      max-width: 100%;
      color: var(--color-heading);
      font-weight: var(--font-weight-medium);
      font-size: var(--font-size-lg);
      line-height: 1.1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .suffix {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-regular);
      color: var(--color-text);
    }
    .control {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      min-height: 22px;
      color: var(--color-primary);
    }
  `;

  @property({ type: String }) key = '';
  @property({ type: String }) heading = '';
  @property({ type: String }) suffix = '';
  @property({ type: Boolean, reflect: true }) active = false;

  private _onClick() {
    this.dispatchEvent(
      new CustomEvent('et-segment-click', {
        detail: { key: this.key },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <button @click=${this._onClick} aria-label=${this.heading || this.key}>
        <span class="heading">
          <span class="title">${this.heading}</span>
          ${this.suffix ? html`<span class="suffix">${this.suffix}</span>` : nothing}
        </span>
        <span class="control"><slot></slot></span>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-menu-segment': EtMenuSegment;
  }
}
