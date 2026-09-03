import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '../../atoms/swara/et-swara.js';
import { noteAria, type Note } from '../../../data/scales.js';

/**
 * et-note-list — a run of notes as drawn glyphs, comma separated.
 *
 * Used for the revealed answer. Spelling those notes as text would put
 * combining marks back on screen — the exact rendering that `et-swara` exists
 * to avoid — so the reveal draws them the same way the keys and slots do.
 */
@customElement('et-note-list')
export class EtNoteList extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0 var(--space-1);
    }
    .item {
      display: inline-flex;
      align-items: baseline;
    }
    et-swara {
      /* The glyph's own padding carries the marks; pull the run tight so it
         still sits on the line of surrounding text. */
      margin: -0.35em 0;
    }
  `;

  @property({ attribute: false }) notes: Note[] = [];

  render() {
    return html`${this.notes.map(
      (n, i) => html`<span class="item">
        <et-swara
          name=${n.name}
          ?komal=${n.komal}
          ?tivra=${n.tivra}
          .saptak=${n.saptak}
          .octaveLabel=${n.octaveLabel}
          aria-label=${noteAria(n)}
        ></et-swara>${i < this.notes.length - 1 ? ',' : ''}
      </span>`,
    )}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-note-list': EtNoteList;
  }
}
