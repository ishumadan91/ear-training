import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { icons, type IconName } from './icon-registry.js';

/**
 * et-icon — renders a named glyph from the icon registry.
 *
 * The SVG fills with `currentColor`, so set the color via the `color` CSS
 * property (or the `color` attribute mapped to it). Size via the `size`
 * attribute (px) or the `--et-icon-size` custom property.
 *
 * @prop {IconName} name  - registry key, e.g. "play", "range", "check"
 * @prop {number}   size  - square size in px (default 24)
 * @prop {string}   label - accessible label; when set, role="img" is applied
 */
@customElement('et-icon')
export class EtIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      width: var(--et-icon-size, 24px);
      height: var(--et-icon-size, 24px);
      line-height: 0;
      color: inherit;
    }
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `;

  @property({ type: String }) name: IconName = 'play';
  @property({ type: Number }) size = 24;
  @property({ type: String }) label?: string;

  render() {
    const def = icons[this.name];
    if (!def) return nothing;
    this.style.setProperty('--et-icon-size', `${this.size}px`);
    return html`
      <svg
        viewBox=${def.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role=${this.label ? 'img' : 'presentation'}
        aria-label=${this.label ?? nothing}
        aria-hidden=${this.label ? nothing : 'true'}
      >
        ${def.render()}
      </svg>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-icon': EtIcon;
  }
}
