import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-chip.js';

const meta: Meta = {
  title: 'Atoms/Chip',
  component: 'et-chip',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
  },
  args: { label: 'Medium · 4 notes', selected: false },
  render: ({ label, selected }) =>
    html`<et-chip label=${label} ?selected=${selected}></et-chip>`,
};
export default meta;

type Story = StoryObj;

export const Unselected: Story = { args: { selected: false } };
export const Selected: Story = { args: { selected: true } };

export const DifficultyGroup: Story = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <et-chip value="easy" label="Easy · 3 notes"></et-chip>
      <et-chip value="medium" label="Medium · 4 notes" selected></et-chip>
      <et-chip value="hard" label="Hard · 5 notes"></et-chip>
    </div>
  `,
};
