import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-stat.js';

const meta: Meta = {
  title: 'Molecules/Stat',
  component: 'et-stat',
  tags: ['autodocs'],
  argTypes: { value: { control: 'text' }, caption: { control: 'text' } },
  args: { value: '12', caption: 'Score' },
  render: ({ value, caption }) =>
    html`<et-stat value=${value} caption=${caption}></et-stat>`,
};
export default meta;

type Story = StoryObj;

export const Score: Story = {};
export const Accuracy: Story = { args: { value: '89%', caption: 'Accuracy' } };

export const Row: Story = {
  render: () => html`
    <div style="display:flex;gap:32px">
      <et-stat value="12" caption="Score"></et-stat>
      <et-stat value="8" caption="Streak"></et-stat>
      <et-stat value="89%" caption="Accuracy"></et-stat>
    </div>
  `,
};
