import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-input-row.js';

const meta: Meta = {
  title: 'Molecules/Input Row',
  component: 'et-input-row',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Empty: Story = {
  render: () => html`<et-input-row .count=${4}></et-input-row>`,
};

export const PartiallyFilled: Story = {
  render: () => html`
    <et-input-row
      .slots=${[
        { value: 'C', state: 'filled', octave: 4 },
        { value: 'E', state: 'filled', octave: 3 },
        { value: '', state: 'empty' },
        { value: '', state: 'empty' },
      ]}
    ></et-input-row>
  `,
};

export const Graded: Story = {
  render: () => html`
    <et-input-row
      .slots=${[
        { value: 'C', state: 'correct', octave: 4 },
        { value: 'E', state: 'correct', octave: 4 },
        { value: 'F', state: 'octave', octave: 3 },
        { value: 'A', state: 'incorrect', octave: 4 },
      ]}
    ></et-input-row>
  `,
};
