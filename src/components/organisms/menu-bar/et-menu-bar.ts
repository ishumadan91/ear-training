import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '../../atoms/divider/et-divider.js';
import '../../atoms/toggle/et-toggle.js';
import '../../atoms/icon/et-icon.js';
import '../../molecules/menu-segment/et-menu-segment.js';

/**
 * et-menu-bar — the app's top configuration bar (Figma "Top nav").
 *
 * Four segments — Notation, Scale, Tempo/Rhythm, Range — separated by vertical
 * dividers. Each segment is tappable and surfaces its identity through
 * `et-menu-select`. The Notation segment additionally hosts the Western/Indian
 * toggle, which emits `et-notation-change`.
 *
 * @fires et-menu-select     - CustomEvent<{ key: string }> when a segment is tapped
 * @fires et-notation-change - CustomEvent<{ checked: boolean }> from the toggle
 */
@customElement('et-menu-bar')
export class EtMenuBar extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--color-surface);
      border-bottom: 1px solid var(--color-navy);
      box-shadow: var(--shadow-sm);
    }
    .bar {
      display: flex;
      align-items: stretch;
      height: var(--menu-bar-height);
    }
    et-divider {
      flex: 0 0 auto;
    }
    .scale-icons,
    .rhythm-icons {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
  `;

  /** Notation system label shown in the first segment. */
  @property({ type: String }) notation = 'Western';
  /** Whether the notation toggle is on (e.g. Indian instead of Western). */
  @property({ type: Boolean }) notationOn = false;
  /** Root note + quality, e.g. "A" / "major". */
  @property({ type: String }) scaleRoot = 'A';
  @property({ type: String }) scaleQuality = 'major';
  /** Tempo / count summary, e.g. "90 bpm · 5". */
  @property({ type: String }) tempo = '90 bpm · 5';
  /** Pitch range summary, e.g. "C3 → B4". */
  @property({ type: String }) range = 'C3 → B4';
  /** Key of the currently-active (editing) segment, if any. */
  @property({ type: String }) activeSegment = '';

  @state() private _notationChecked = false;

  connectedCallback() {
    super.connectedCallback();
    this._notationChecked = this.notationOn;
  }

  private _onSegmentClick = (e: Event) => {
    const { key } = (e as CustomEvent<{ key: string }>).detail;
    this.dispatchEvent(
      new CustomEvent('et-menu-select', {
        detail: { key },
        bubbles: true,
        composed: true,
      }),
    );
  };

  private _onNotationToggle = (e: Event) => {
    e.stopPropagation();
    const { checked } = (e as CustomEvent<{ checked: boolean }>).detail;
    this._notationChecked = checked;
    this.dispatchEvent(
      new CustomEvent('et-notation-change', {
        detail: { checked },
        bubbles: true,
        composed: true,
      }),
    );
  };

  render() {
    return html`
      <div class="bar" @et-segment-click=${this._onSegmentClick}>
        <et-menu-segment
          key="notation"
          heading=${this.notation}
          ?active=${this.activeSegment === 'notation'}
        >
          <et-toggle
            label="Notation system"
            ?checked=${this._notationChecked}
            @et-toggle-change=${this._onNotationToggle}
            @click=${(e: Event) => e.stopPropagation()}
          ></et-toggle>
        </et-menu-segment>

        <et-divider orientation="vertical"></et-divider>

        <et-menu-segment
          key="scale"
          heading=${this.scaleRoot}
          suffix=${this.scaleQuality}
          ?active=${this.activeSegment === 'scale'}
        >
          <span class="scale-icons">
            <et-icon name="scale" size="18"></et-icon>
          </span>
        </et-menu-segment>

        <et-divider orientation="vertical"></et-divider>

        <et-menu-segment
          key="tempo"
          heading=${this.tempo}
          ?active=${this.activeSegment === 'tempo'}
        >
          <span class="rhythm-icons">
            <et-icon name="rhythm" size="22"></et-icon>
          </span>
        </et-menu-segment>

        <et-divider orientation="vertical"></et-divider>

        <et-menu-segment
          key="range"
          heading=${this.range}
          ?active=${this.activeSegment === 'range'}
        >
          <et-icon name="range" size="26"></et-icon>
        </et-menu-segment>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-menu-bar': EtMenuBar;
  }
}
