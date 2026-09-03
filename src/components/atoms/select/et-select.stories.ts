import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-select.js';
import { ROOT_NOTES, SCALES } from '../../../data/scales.js';

const meta: Meta = {
  title: 'Atoms/Select',
  component: 'et-select',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="min-width:280px">
      <et-select
        label=${args.label}
        .options=${args.options}
        value=${args.value}
        ?disabled=${args.disabled}
        @et-select-change=${(e: CustomEvent) => console.log('change', e.detail)}
      ></et-select>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const RootNote: Story = {
  args: {
    label: 'Root note',
    value: 'C',
    options: ROOT_NOTES.map((n) => ({ value: n, label: n })),
  },
};

export const WesternScale: Story = {
  args: {
    label: 'Scale',
    value: 'major',
    options: SCALES.western.map((s) => ({ value: s.key, label: s.label })),
  },
};

export const IndianThaat: Story = {
  args: {
    label: 'Thaat',
    value: 'bhairav',
    options: SCALES.indian.map((s) => ({ value: s.key, label: s.label })),
  },
};

export const Disabled: Story = {
  args: {
    label: 'Instrument',
    value: 'piano',
    disabled: true,
    options: [{ value: 'piano', label: 'Piano' }],
  },
};
