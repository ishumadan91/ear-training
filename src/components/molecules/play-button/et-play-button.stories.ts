import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-play-button.js';

const meta: Meta = {
  title: 'Molecules/Play Button',
  component: 'et-play-button',
  tags: ['autodocs'],
  argTypes: {
    playing: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: { type: 'range', min: 40, max: 96, step: 4 } },
  },
  args: { playing: false, disabled: false, size: 72 },
  render: ({ playing, disabled, size }) =>
    html`<et-play-button
      ?playing=${playing}
      ?disabled=${disabled}
      size=${size}
      @et-play-toggle=${(e: CustomEvent) => console.log('play', e.detail)}
    ></et-play-button>`,
};
export default meta;

type Story = StoryObj;

export const Idle: Story = {};
export const Playing: Story = { args: { playing: true } };
export const Disabled: Story = { args: { disabled: true } };
export const Small: Story = { args: { size: 48 } };
