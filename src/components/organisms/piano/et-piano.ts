import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import {
  CHROMATIC,
  OCTAVES,
  absPitch,
  buildKeyboard,
  type KeyboardKey,
  type Notation,
} from '../../../data/scales.js';

/**
 * et-piano — the interactive chromatic keyboard.
 *
 * Two octaves of real piano layout: white keys in a row, black keys positioned
 * absolutely over the seams between them. The track is wider than a phone, so
 * it scrolls horizontally inside its own container.
 *
 * The keyboard is chromatic rather than scale-filtered, which means a learner
 * can tap notes outside the current scale — that's deliberate, and it's what
 * makes the exercise a real test.
 *
 * Key labels follow the notation: `C D E …` for Western, sargam for Indian.
 *
 * @fires et-note-press - CustomEvent<{ name, octave, semitone, pitch }>
 *   `semitone` is the pitch class (0–11); `pitch` is absolute, so the two C
 *   keys on the keyboard are distinguishable.
 */
@customElement('et-piano')
export class EtPiano extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .scroll {
      overflow-x: auto;
      border-radius: var(--radius-md);
      background: var(--color-heading);
      box-shadow: var(--shadow-card);
      padding: 2px;
      -webkit-overflow-scrolling: touch;
    }
    .track {
      position: relative;
      display: flex;
      gap: 1px;
    }
    button {
      all: unset;
      box-sizing: border-box;
      cursor: pointer;
      font-family: var(--font-family-base);
      font-weight: var(--font-weight-bold);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      gap: 1px;
      line-height: 1.1;
    }
    .octave {
      font-size: 9px;
      font-weight: var(--font-weight-semibold);
      opacity: 0.65;
    }
    .white {
      flex-shrink: 0;
      height: 104px;
      background: var(--color-surface);
      border-right: 1px solid var(--color-border);
      border-radius: 0 0 var(--radius-md) var(--radius-md);
      padding-bottom: 6px;
      font-size: var(--font-size-xs);
      color: var(--color-heading);
    }
    .white:hover {
      background: var(--color-surface-muted);
    }
    .white:active {
      background: color-mix(in oklab, var(--color-primary) 15%, white);
    }
    .black {
      position: absolute;
      top: 0;
      height: 64px;
      background: var(--color-heading);
      border-radius: 0 0 6px 6px;
      padding-bottom: 5px;
      font-size: 10px;
      color: var(--color-surface);
      z-index: 2;
    }
    .black:hover {
      background: color-mix(in oklab, var(--color-primary) 40%, var(--color-heading));
    }
    .black:active {
      background: var(--color-primary);
    }
    button:focus-visible {
      outline: 2px solid var(--color-primary);
      outline-offset: -2px;
    }
    :host([disabled]) button {
      cursor: not-allowed;
      opacity: 0.55;
    }
  `;

  /** Which note vocabulary to label the keys with. */
  @property({ type: String }) notation: Notation = 'western';
  /** Which octaves to span, by real octave number. */
  @property({ attribute: false }) octaves: number[] = OCTAVES;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _press(key: KeyboardKey) {
    if (this.disabled) return;
    const { name, octave, semitone } = key;
    this.dispatchEvent(
      new CustomEvent('et-note-press', {
        detail: { name, octave, semitone, pitch: absPitch(key) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const names = CHROMATIC[this.notation] ?? CHROMATIC.western;
    const { whiteKeys, blackKeys, width } = buildKeyboard(names, this.octaves);

    return html`
      <div class="scroll">
        <div
          class="track"
          style="width:${width}px"
          role="group"
          aria-label="Note keyboard"
        >
          ${whiteKeys.map(
            (k) => html`
              <button
                class="white"
                style="width:${k.width}px"
                ?disabled=${this.disabled}
                aria-label=${`${k.name} ${k.octave}`}
                @click=${() => this._press(k)}
              >
                ${k.name}<small class="octave">${k.octave}</small>
              </button>
            `,
          )}
          ${blackKeys.map(
            (k) => html`
              <button
                class="black"
                style="left:${k.left}px;width:${k.width}px"
                ?disabled=${this.disabled}
                aria-label=${`${k.name} ${k.octave}`}
                @click=${() => this._press(k)}
              >
                ${k.name}<small class="octave">${k.octave}</small>
              </button>
            `,
          )}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-piano': EtPiano;
  }
}
