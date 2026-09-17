import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@chordialguy/keyboard';
import type { NoteEventDetail } from '@chordialguy/keyboard';
import {
  absPitch,
  computeRange,
  findScale,
  fromMidi,
  noteAt,
  rootAbsOf,
  rootIndexOf,
  toMidi,
  type Notation,
} from '../../../data/scales.js';

/**
 * et-piano — the answer keyboard: the shared `cg-keyboard`, configured for
 * this exercise and translated into this app's vocabulary.
 *
 * The span follows the root — a fifth below the tonic to a twelfth above — so
 * the tonic sits inside the keyboard rather than at its left edge.
 *
 * Keys outside the scale are dimmed rather than disabled: a hint, not a rail.
 * Tapping a note outside the scale has to be possible, or the exercise stops
 * being a test.
 *
 * Western labels are absolute; sargam rotates so Sa sits on the root. A key
 * sounds its own pitch either way — on `instrument`, straight from
 * pointer-down.
 *
 * @fires et-note-press - CustomEvent<Note & { pitch }>, on a completed tap.
 *   `semitone` is the pitch class (0–11); `pitch` is absolute in this app's
 *   numbering (`octave × 12 + semitone`), so the two C keys are distinct.
 */
@customElement('et-piano')
export class EtPiano extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    /* The keyboard's look, from this app's tokens. */
    cg-keyboard {
      --cg-font-family: var(--font-family-base);
      --cg-keyboard-height: 104px;
      --cg-key-min-width: 46px;
      --cg-key-gap: 1px;
      --cg-key-radius: var(--radius-md);
      --cg-keyboard-background: var(--color-heading);
      --cg-keyboard-padding: 2px;
      --cg-keyboard-radius: var(--radius-md);
      --cg-keyboard-shadow: var(--shadow-card);
      --cg-black-key-height: 64px;
      --cg-black-key-ratio: 0.61;

      --cg-white-key: var(--color-surface);
      --cg-white-key-text: var(--color-heading);
      --cg-white-key-border: transparent;
      --cg-white-key-hover: var(--color-surface-muted);
      --cg-white-key-pressed: color-mix(in oklab, var(--color-primary) 15%, white);
      --cg-white-key-dim: var(--color-neutral-200);
      --cg-white-key-dim-text: var(--color-text-muted);
      --cg-white-key-dim-hover: var(--color-neutral-300);

      --cg-black-key: var(--color-heading);
      --cg-black-key-text: var(--color-surface);
      --cg-black-key-hover: color-mix(in oklab, var(--color-primary) 40%, var(--color-heading));
      --cg-key-pressed: var(--color-primary);
      --cg-black-key-dim: var(--color-neutral-500);
      --cg-black-key-dim-hover: var(--color-neutral-600);

      --cg-key-label-size: var(--font-size-xs);
      --cg-focus-ring: var(--color-primary);
      --cg-swara-octave-weight: var(--font-weight-semibold);
    }
  `;

  /** Which note vocabulary to label the keys with. */
  @property({ type: String }) notation: Notation = 'western';
  /** Root note, e.g. "C" or "A♯". Places Sa, and centres the key range. */
  @property({ type: String }) rootNote = 'C';
  /** Scale whose notes stay full-strength; the rest are dimmed. */
  @property({ type: String }) scaleKey = '';
  /** The instrument a tapped key sounds on. */
  @property({ type: String }) instrument = 'piano';
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _press(e: CustomEvent<NoteEventDetail>) {
    // Re-issued below in this app's vocabulary; one event per tap is enough.
    e.stopPropagation();
    const note = noteAt(this.notation, rootIndexOf(this.rootNote), fromMidi(e.detail.pitch));
    this.dispatchEvent(
      new CustomEvent('et-note-press', {
        detail: { ...note, pitch: absPitch(note) },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    const rootIndex = rootIndexOf(this.rootNote);
    const range = computeRange(rootIndex);
    return html`
      <cg-keyboard
        label="Note keyboard"
        notation=${this.notation}
        from=${toMidi(range.low)}
        to=${toMidi(range.high)}
        tonic=${toMidi(rootAbsOf(rootIndex))}
        .degrees=${findScale(this.notation, this.scaleKey).degrees}
        outside="dim"
        instrument=${this.instrument}
        ?disabled=${this.disabled}
        @cg-note-press=${this._press}
      ></cg-keyboard>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-piano': EtPiano;
  }
}
