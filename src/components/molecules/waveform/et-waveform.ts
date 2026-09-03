import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/** The resting bar heights (px) shown under the play control. */
const DEFAULT_BARS = [8, 16, 22, 12, 20, 24, 14, 18, 10, 22, 16, 8, 20, 12];

/**
 * et-waveform — a compact teal bar visualiser sitting under the play button.
 * Purely decorative: it signals "this is the sound" without implying a real
 * spectrum. When `playing` is set the bars animate.
 */
@customElement('et-waveform')
export class EtWaveform extends LitElement {
  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-1);
      height: 24px;
    }
    .bar {
      width: 4px;
      border-radius: 2px;
      background: var(--color-primary);
      transform-origin: center;
    }
    :host([playing]) .bar {
      animation: pulse 0.9s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        transform: scaleY(0.6);
      }
      50% {
        transform: scaleY(1.15);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      :host([playing]) .bar {
        animation: none;
      }
    }
  `;

  @property({ attribute: false }) bars: number[] = DEFAULT_BARS;
  @property({ type: Boolean, reflect: true }) playing = false;

  render() {
    return html`
      ${this.bars.map(
        (h, i) =>
          html`<span
            class="bar"
            style="height:${h}px;animation-delay:${(i * 0.06).toFixed(2)}s"
          ></span>`,
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-waveform': EtWaveform;
  }
}
