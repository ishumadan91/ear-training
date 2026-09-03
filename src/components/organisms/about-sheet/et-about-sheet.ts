import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/badge/et-badge.js';
import '../../atoms/button/et-button.js';

interface Step {
  text: string;
}

/**
 * The five things a newcomer needs to know, in the order they'll meet them.
 *
 * Step 2 says root, scale *and* instrument lock — this app fixes all three
 * once the tune has been played, so the help text has to say so or it lies to
 * the reader.
 */
const STEPS: Step[] = [
  {
    text: 'Pick your notation, scale or thaat, root note, difficulty, and instrument in Settings.',
  },
  {
    text: 'Tap the play button to hear the tune. Once played, the root, scale and instrument are locked for that round.',
  },
  {
    text: 'Tap notes on the keyboard, in order, to fill the answer slots. Each key shows its note and octave.',
  },
  {
    text: 'Tap Check answer. Getting the octave wrong gets half credit; shifting the whole tune to a different key gets partial credit for the relative pitch.',
  },
  { text: 'Tap Next tune to generate a new one and keep your streak going.' },
];

/**
 * et-about-sheet — the explainer, as a bottom sheet over a scrim.
 *
 * Dismisses on the scrim, on Escape, and on "Got it"; taps inside the sheet
 * don't fall through to the scrim.
 *
 * @fires et-about-close - CustomEvent<void>
 */
@customElement('et-about-sheet')
export class EtAboutSheet extends LitElement {
  static styles = css`
    :host {
      display: contents;
    }
    .scrim {
      position: absolute;
      inset: 0;
      z-index: 10;
      display: flex;
      align-items: flex-end;
      background: rgba(0, 48, 73, 0.5);
    }
    .sheet {
      box-sizing: border-box;
      width: 100%;
      max-height: 78%;
      overflow-y: auto;
      padding: var(--space-6) var(--space-5) var(--space-8);
      background: var(--color-surface);
      border-radius: var(--radius-xl) var(--radius-xl) 0 0;
      box-shadow: var(--shadow-pop);
      font-family: var(--font-family-base);
    }
    .grabber {
      width: 40px;
      height: 4px;
      margin: 0 auto var(--space-4);
      border-radius: 2px;
      background: var(--color-neutral-300);
    }
    h2 {
      margin: 0 0 var(--space-2);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--color-heading);
    }
    p {
      margin: 0;
      color: var(--color-text);
      font-size: var(--font-size-md);
      line-height: var(--line-height-base);
    }
    .intro {
      margin-bottom: var(--space-4);
    }
    .label {
      display: block;
      margin-bottom: var(--space-2);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      color: var(--color-heading);
    }
    ol {
      list-style: none;
      margin: 0 0 var(--space-5);
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--space-3);
    }
    li {
      display: flex;
      gap: var(--space-3);
    }
    li et-badge {
      flex-shrink: 0;
    }
    et-button {
      display: block;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    window.removeEventListener('keydown', this._onKeydown);
    super.disconnectedCallback();
  }

  private _onKeydown = (e: KeyboardEvent) => {
    if (this.open && e.key === 'Escape') this._close();
  };

  private _close() {
    this.dispatchEvent(
      new CustomEvent('et-about-close', { bubbles: true, composed: true }),
    );
  }

  render() {
    if (!this.open) return nothing;
    return html`
      <div class="scrim" @click=${this._close}>
        <div
          class="sheet"
          role="dialog"
          aria-modal="true"
          aria-label="About Ear Trainer"
          @click=${(e: Event) => e.stopPropagation()}
        >
          <div class="grabber"></div>
          <h2>About Ear Trainer</h2>
          <p class="intro">
            Ear Trainer helps you practice recognizing notes by ear. Listen to a
            short randomly generated tune, then tap the notes you heard on the
            keyboard — in Western (C D E) or Indian (Sa Re Ga) notation.
          </p>

          <span class="label">How it works</span>
          <ol>
            ${STEPS.map(
              (step, i) => html`
                <li>
                  <et-badge variant="primary" label=${String(i + 1)}></et-badge>
                  <p>${step.text}</p>
                </li>
              `,
            )}
          </ol>

          <et-button
            variant="primary"
            label="Got it"
            @click=${this._close}
          ></et-button>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-about-sheet': EtAboutSheet;
  }
}
