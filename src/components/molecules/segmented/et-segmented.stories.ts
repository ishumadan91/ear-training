import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-segmented.js';

const meta: Meta = {
  title: 'Molecules/Segmented',
  component: 'et-segmented',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="min-width:320px">
      <et-segmented
        .options=${args.options}
        value=${args.value}
        @et-segment-change=${(e: CustomEvent) => console.log('change', e.detail)}
      ></et-segmented>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

const notation = [
  { value: 'western', label: 'Western (C D E)' },
  { value: 'indian', label: 'Indian (Sa Re Ga)' },
];

export const Western: Story = { args: { options: notation, value: 'western' } };
export const Indian: Story = { args: { options: notation, value: 'indian' } };
