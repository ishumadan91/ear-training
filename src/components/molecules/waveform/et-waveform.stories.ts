import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-waveform.js';

const meta: Meta = {
  title: 'Molecules/Waveform',
  component: 'et-waveform',
  tags: ['autodocs'],
  argTypes: { playing: { control: 'boolean' } },
  args: { playing: false },
  render: ({ playing }) => html`<et-waveform ?playing=${playing}></et-waveform>`,
};
export default meta;

type Story = StoryObj;

export const Resting: Story = { args: { playing: false } };
export const Playing: Story = { args: { playing: true } };
