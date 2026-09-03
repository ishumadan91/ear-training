import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { Saptak } from '../../../data/scales.js';

/**
 * et-swara — one note glyph with its Indian-notation marks.
 *
 * The marks are drawn with CSS rather than combining characters. A combining
 * low line under "N" lands wherever the font decides — visibly off-centre in
 * Open Sans — and a komal swara in the mandra saptak needs a line *and* a dot
 * stacked below the same letter, which combining marks collide on.
 *
 * Two placements are deliberate: the komal line rides high, close to the
 * letter, so the mandra dot below it has clear air; and the tivra stroke is
 * offset right of centre so it never lands on the centred taar dot.
 *
 * Western notes pass no marks and render as the bare name plus an octave
 * number beneath.
 */
@customElement('et-swara')
export class EtSwara extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      line-height: 1.1;
    }
    /* Shrink-wraps the letter, so the marks can be positioned against it. */
    .glyph {
      position: relative;
      display: inline-block;
      padding: 0.5em 0 0.55em;
    }
    .letter {
      display: block;
      line-height: 1;
    }
    .mark {
      position: absolute;
      background: currentColor;
    }
    .dot {
      left: 50%;
      transform: translateX(-50%);
      width: 0.16em;
      height: 0.16em;
      min-width: 2px;
      min-height: 2px;
      border-radius: 50%;
    }
    .dot.taar {
      top: 0.08em;
    }
    .dot.mandra {
      bottom: 0.06em;
    }
    /* Komal — a line under the letter, auto-width via the inset edges. It sits
       high, close to the letter, to leave clear air above the mandra dot;
       hanging it off the letter's inline box put the two on top of each other. */
    .komal-line {
      left: 8%;
      right: 8%;
      bottom: 0.4em;
      height: 1px;
    }
    /* Tivra — offset right of centre so it never collides with the taar dot,
       which stays centred. */
    .tivra {
      left: calc(50% + 0.26em);
      transform: translateX(-50%);
      top: 0.1em;
      width: 1px;
      height: 0.3em;
    }
    .octave {
      font-size: 0.62em;
      font-weight: var(--font-weight-semibold);
      opacity: 0.65;
    }
  `;

  @property({ type: String }) name = '';
  @property({ type: Boolean }) komal = false;
  @property({ type: Boolean }) tivra = false;
  @property({ type: String }) saptak: Saptak | null = null;
  /** Western octave number, shown beneath the name. Null for Indian. */
  @property({ type: Number }) octaveLabel: number | null = null;

  render() {
    return html`
      <span class="glyph">
        ${this.tivra ? html`<span class="mark tivra"></span>` : nothing}
        ${this.saptak === 'taar'
          ? html`<span class="mark dot taar"></span>`
          : nothing}
        <span class="letter">${this.name}</span>
        ${this.komal ? html`<span class="mark komal-line"></span>` : nothing}
        ${this.saptak === 'mandra'
          ? html`<span class="mark dot mandra"></span>`
          : nothing}
      </span>
      ${this.octaveLabel !== null
        ? html`<span class="octave">${this.octaveLabel}</span>`
        : nothing}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-swara': EtSwara;
  }
}
