/**
 * Embed entry — the app as a component for another site to host.
 *
 * Registers `et-practice-page` and re-exports the types a host needs to type
 * its storage adapter. Deliberately no side effects beyond registration: no
 * tokens, no global.css. The host supplies the design tokens from its own
 * `:root` (custom properties pierce Shadow DOM) and sizes the element itself.
 *
 * Built by `npm run build:lib` to `dist-lib/ear-training.js`.
 */
import './components/pages/practice-page/et-practice-page.js';

export type { EtStorage } from './data/preferences.js';
export type { Preferences } from './data/preferences.js';
