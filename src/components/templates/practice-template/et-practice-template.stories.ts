import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-practice-template.js';
import { ROOT_NOTES, SCALES } from '../../../data/scales.js';

const rootOptions = ROOT_NOTES.map((n) => ({ value: n, label: n }));
const westernScales = SCALES.western.map((s) => ({ value: s.key, label: s.label }));

const badges = [
  { label: 'Round 3', variant: 'primary' as const },
  { label: 'Streak 8' },
  { label: 'Major scale' },
  { label: 'Root C' },
];

const meta: Meta = {
  title: 'Templates/Practice Template',
  component: 'et-practice-template',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: (args) => html`
    <div style="max-width:420px;height:844px;margin:0 auto;box-shadow:var(--shadow-md)">
      <et-practice-template
        heading="Name the notes"
        ?settingsOpen=${args.settingsOpen}
        notation="western"
        difficulty="medium"
        rootNote="C"
        scaleKey="major"
        instrument=${args.instrument ?? 'piano'}
        ?instrumentLocked=${args.instrumentLocked}
        .rootOptions=${rootOptions}
        .scaleOptions=${westernScales}
        .badges=${badges}
        .slots=${args.slots}
        score="8"
        streak="8"
        accuracy="89"
      ></et-practice-template>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {
  args: { settingsOpen: false, slots: [{}, {}, {}, {}] },
};

export const SettingsOpen: Story = {
  args: { settingsOpen: true, slots: [{}, {}, {}, {}] },
};
