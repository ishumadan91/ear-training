import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-alert.js';

const meta: Meta = {
  title: 'Atoms/Alert',
  component: 'et-alert',
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'inline-radio', options: ['success', 'warning', 'error'] },
    message: { control: 'text' },
    detail: { control: 'text' },
  },
  args: { tone: 'success', message: 'Correct! Well played.', detail: '' },
  render: ({ tone, message, detail }) =>
    html`<div style="min-width:320px">
      <et-alert tone=${tone} message=${message} detail=${detail}></et-alert>
    </div>`,
};
export default meta;

type Story = StoryObj;

export const Success: Story = { args: { tone: 'success', message: 'Correct! Well played.' } };
export const Warning: Story = {
  args: {
    tone: 'warning',
    message: 'Right notes, wrong octave in places — half credit.',
    detail: 'Correct answer: C4, E4, G3, D4',
  },
};
export const Error: Story = {
  args: {
    tone: 'error',
    message: 'Not quite right.',
    detail: 'Correct answer: C4, E4, G3, D4',
  },
};

/** Every outcome but a fully correct one reveals the tune. */
export const WithRevealedAnswer: Story = {
  render: () => html`
    <div style="min-width:320px;display:flex;flex-direction:column;gap:12px">
      <et-alert tone="success" message="Correct! Well played."></et-alert>
      <et-alert
        tone="warning"
        message="Right notes, wrong octave in places — half credit."
        detail="Correct answer: C4, E4, G3, D4"
      ></et-alert>
      <et-alert
        tone="error"
        message="Not quite right."
        detail="Correct answer: C4, E4, G3, D4"
      ></et-alert>
    </div>
  `,
};

/**
 * The detail line also accepts slotted content, which is how the practice
 * screen reveals the answer as drawn glyphs rather than text.
 */
export const SlottedDetail: Story = {
  render: () => html`
    <div style="min-width:320px">
      <et-alert tone="error" message="Not quite right." hasDetail>
        <span slot="detail">Correct answer: <strong>C4, E4, G3, D4</strong></span>
      </et-alert>
    </div>
  `,
};
