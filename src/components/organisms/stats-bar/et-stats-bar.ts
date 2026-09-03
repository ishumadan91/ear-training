import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/card/et-card.js';
import '../../molecules/stat/et-stat.js';

/**
 * et-stats-bar — the session summary strip: score, streak and accuracy spread
 * evenly across a card.
 */
@customElement('et-stats-bar')
export class EtStatsBar extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    .row {
      display: flex;
      justify-content: space-around;
    }
  `;

  @property({ type: Number }) score = 0;
  @property({ type: Number }) streak = 0;
  /**
   * Percentage correct, or `null` before any round has been graded — there is
   * no accuracy yet, and showing 100% would claim a perfect record the learner
   * has not earned.
   */
  @property({ type: Number }) accuracy: number | null = null;

  render() {
    return html`
      <et-card padding="tight">
        <div class="row">
          <et-stat value=${String(this.score)} caption="Score"></et-stat>
          <et-stat value=${String(this.streak)} caption="Streak"></et-stat>
          <et-stat
            value=${this.accuracy === null ? '–' : `${this.accuracy}%`}
            caption="Accuracy"
          ></et-stat>
        </div>
      </et-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-stats-bar': EtStatsBar;
  }
}
