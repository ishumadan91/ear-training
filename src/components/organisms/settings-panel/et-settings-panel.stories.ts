import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-settings-panel.js';
import { ROOT_NOTES, SCALES } from '../../../data/scales.js';

const rootOptions = ROOT_NOTES.map((n) => ({ value: n, label: n }));
const westernScales = SCALES.western.map((s) => ({ value: s.key, label: s.label }));
const indianThaats = SCALES.indian.map((s) => ({ value: s.key, label: s.label }));

const meta: Meta = {
  title: 'Organisms/Settings Panel',
  component: 'et-settings-panel',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="width:360px">
      <et-settings-panel
        notation=${args.notation}
        difficulty=${args.difficulty}
        rootNote=${args.rootNote}
        scaleKey=${args.scaleKey}
        instrument=${args.instrument ?? 'piano'}
        ?instrumentLocked=${args.instrumentLocked}
        .rootOptions=${rootOptions}
        .scaleOptions=${args.scaleOptions}
        @et-notation-change=${(e: CustomEvent) => console.log('notation', e.detail)}
        @et-difficulty-change=${(e: CustomEvent) => console.log('difficulty', e.detail)}
        @et-scale-change=${(e: CustomEvent) => console.log('scale', e.detail)}
        @et-root-change=${(e: CustomEvent) => console.log('root', e.detail)}
      ></et-settings-panel>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Western: Story = {
  args: {
    notation: 'western',
    difficulty: 'medium',
    rootNote: 'C',
    scaleKey: 'major',
    scaleOptions: westernScales,
  },
};

export const Indian: Story = {
  args: {
    notation: 'indian',
    difficulty: 'hard',
    rootNote: 'D',
    scaleKey: 'bhairav',
    scaleOptions: indianThaats,
  },
};

/**
 * Once the tune has been played the instrument is fixed for the round — the
 * control disables and the hint says so. A change lands on the next tune.
 */
export const InstrumentLocked: Story = {
  args: {
    notation: 'western',
    difficulty: 'medium',
    rootNote: 'C',
    scaleKey: 'major',
    scaleOptions: westernScales,
    instrument: 'guitar',
    instrumentLocked: true,
  },
};
