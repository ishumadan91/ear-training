import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-badge.js';

const meta: Meta = {
  title: 'Atoms/Badge',
  component: 'et-badge',
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'muted'] },
    label: { control: 'text' },
  },
  args: { variant: 'secondary', label: 'Streak 8' },
  render: ({ variant, label }) =>
    html`<et-badge variant=${variant} label=${label}></et-badge>`,
};
export default meta;

type Story = StoryObj;

export const Primary: Story = { args: { variant: 'primary', label: 'Round 3' } };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Major scale' } };
export const Muted: Story = { args: { variant: 'muted', label: 'Paused' } };

export const StatusRow: Story = {
  render: () => html`
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <et-badge variant="primary" label="Round 3"></et-badge>
      <et-badge variant="secondary" label="Streak 8"></et-badge>
      <et-badge variant="secondary" label="Major scale"></et-badge>
      <et-badge variant="secondary" label="Root C"></et-badge>
    </div>
  `,
};
