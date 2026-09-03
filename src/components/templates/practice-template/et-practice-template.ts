import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/icon-button/et-icon-button.js';
import '../../organisms/settings-panel/et-settings-panel.js';
import '../../organisms/about-sheet/et-about-sheet.js';
import '../../organisms/practice-content/et-practice-content.js';
import type { SlotData } from '../../molecules/input-row/et-input-row.js';
import type { SelectOption } from '../../atoms/select/et-select.js';
import type { AlertTone } from '../../atoms/alert/et-alert.js';
import type { Difficulty, Notation, Note } from '../../../data/scales.js';

/**
 * et-practice-template — the Practice screen's layout: a title row with the
 * settings toggle, the settings sheet when open, and the scrollable practice
 * body beneath. Presentation only; it forwards data in and lets events bubble
 * out. The page component owns state.
 */
@customElement('et-practice-template')
export class EtPracticeTemplate extends LitElement {
  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 100%;
      background: var(--color-bg);
      font-family: var(--font-family-base);
      overflow: hidden;
      /* the About sheet's scrim is absolute against this frame */
      position: relative;
    }
    .actions {
      display: flex;
      gap: var(--space-2);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-4) var(--space-5) var(--space-3);
      flex-shrink: 0;
    }
    .title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--color-text-muted);
    }
    et-settings-panel {
      margin: 0 var(--space-5) var(--space-3);
      flex-shrink: 0;
    }
    .body {
      flex: 1 1 auto;
      overflow-y: auto;
    }
  `;

  @property({ type: String }) heading = 'Name the notes';
  @property({ type: Boolean }) settingsOpen = false;
  @property({ type: Boolean }) aboutOpen = false;

  /* settings */
  @property({ type: String }) notation: Notation = 'western';
  @property({ type: String }) difficulty: Difficulty = 'medium';
  @property({ type: String }) rootNote = 'C';
  @property({ type: String }) scaleKey = 'major';
  @property({ type: String }) instrument = 'piano';
  @property({ type: Boolean }) settingsLocked = false;
  @property({ attribute: false }) rootOptions: SelectOption[] = [];
  @property({ attribute: false }) scaleOptions: SelectOption[] = [];

  /* practice */
  @property({ type: Boolean }) canBackspace = false;
  @property({ type: Boolean }) playing = false;
  @property({ attribute: false }) slots: SlotData[] | null = null;
  /* the piano labels its keys from the notation, declared above */
  @property({ type: String }) feedbackTone: AlertTone | null = null;
  @property({ type: String }) feedbackText = '';
  @property({ type: String }) feedbackDetail = '';
  @property({ attribute: false }) answerNotes: Note[] = [];
  @property({ type: Boolean }) graded = false;
  @property({ type: Number }) score = 0;
  @property({ type: Number }) streak = 0;
  @property({ type: Number }) accuracy: number | null = null;

  /** Both header buttons fire the same event, so name the intent here. */
  private _emit(name: string) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true }));
  }

  render() {
    return html`
      <div class="header">
        <span class="title">${this.heading}</span>
        <div class="actions">
          <et-icon-button
            name="about"
            label="About"
            size="16"
            ?active=${this.aboutOpen}
            @et-icon-button-click=${() => this._emit('et-about-toggle')}
          ></et-icon-button>
          <et-icon-button
            name="settings"
            label="Settings"
            ?active=${this.settingsOpen}
            @et-icon-button-click=${() => this._emit('et-settings-toggle')}
          ></et-icon-button>
        </div>
      </div>

      <et-about-sheet ?open=${this.aboutOpen}></et-about-sheet>

      ${this.settingsOpen
        ? html`<et-settings-panel
            difficulty=${this.difficulty}
            instrument=${this.instrument}
            ?settingsLocked=${this.settingsLocked}
          ></et-settings-panel>`
        : nothing}

      <et-practice-content
        class="body"
        .scaleOptions=${this.scaleOptions}
        .rootOptions=${this.rootOptions}
        rootNote=${this.rootNote}
        ?settingsLocked=${this.settingsLocked}
        ?canBackspace=${this.canBackspace}
        ?playing=${this.playing}
        .slots=${this.slots}
        notation=${this.notation}
        scaleKey=${this.scaleKey}
        .feedbackTone=${this.feedbackTone}
        feedbackText=${this.feedbackText}
        feedbackDetail=${this.feedbackDetail}
        .answerNotes=${this.answerNotes}
        ?graded=${this.graded}
        score=${this.score}
        streak=${this.streak}
        .accuracy=${this.accuracy}
      ></et-practice-content>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-practice-template': EtPracticeTemplate;
  }
}
