import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-card.js';

const meta: Meta = {
  title: 'Atoms/Card',
  component: 'et-card',
  tags: ['autodocs'],
  argTypes: { padding: { control: 'inline-radio', options: ['md', 'sm', 'tight'] } },
  args: { padding: 'md' },
  render: ({ padding }) => html`
    <et-card padding=${padding} style="max-width:340px">
      <p style="margin:0;color:var(--color-text)">
        Listen to the tune, then tap the notes you hear.
      </p>
    </et-card>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const Small: Story = { args: { padding: 'sm' } };
export const Tight: Story = { args: { padding: 'tight' } };
