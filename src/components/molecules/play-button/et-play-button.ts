import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon/et-icon.js';

/**
 * et-play-button — the large circular transport control: a filled teal disc
 * with a white glyph. Teal is the "make sound" colour, and this is the one
 * affordance on the screen that produces audio.
 *
 * Shows a play glyph, or a pause glyph while `playing`.
 *
 * @fires et-play-toggle - CustomEvent<{ playing: boolean }>
 */
@customElement('et-play-button')
export class EtPlayButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }
    button {
      all: unset;
      box-sizing: border-box;
      width: var(--et-play-size, 72px);
      height: var(--et-play-size, 72px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--color-primary);
      color: var(--color-primary-contrast);
      box-shadow: var(--shadow-pop);
      cursor: pointer;
      transition:
        background 0.15s ease,
        transform 0.05s ease;
    }
    button:hover {
      background: var(--color-teal-600);
    }
    button:active {
      transform: scale(0.96);
    }
    button:focus-visible {
      outline: 2px solid var(--color-navy);
      outline-offset: 3px;
    }
    button[disabled] {
      background: var(--color-muted);
      cursor: not-allowed;
      box-shadow: none;
    }
  `;

  @property({ type: Boolean, reflect: true }) playing = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) size = 72;

  private _onClick() {
    if (this.disabled) return;
    this.playing = !this.playing;
    this.dispatchEvent(
      new CustomEvent('et-play-toggle', {
        detail: { playing: this.playing },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    this.style.setProperty('--et-play-size', `${this.size}px`);
    return html`
      <button
        ?disabled=${this.disabled}
        @click=${this._onClick}
        aria-label=${this.playing ? 'Pause' : 'Play'}
        aria-pressed=${this.playing ? 'true' : 'false'}
      >
        <et-icon
          name=${this.playing ? 'pause' : 'play'}
          size=${Math.round(this.size * 0.36)}
        ></et-icon>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-play-button': EtPlayButton;
  }
}
