import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-input-slot.js';

const meta: Meta = {
  title: 'Atoms/Input Slot',
  component: 'et-input-slot',
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['empty', 'filled', 'correct', 'octave', 'incorrect'],
    },
    value: { control: 'text' },
    octave: { control: { type: 'range', min: 2, max: 6, step: 1 } },
  },
  args: { state: 'filled', value: 'C', octave: 4 },
  render: ({ state, value, octave }) =>
    html`<et-input-slot state=${state} value=${value} .octave=${octave}></et-input-slot>`,
};
export default meta;

type Story = StoryObj;

/** `octave` (amber) means the right pitch class in the wrong octave. */
export const States: Story = {
  render: () => html`
    <div style="display:flex;gap:12px">
      <et-input-slot state="empty"></et-input-slot>
      <et-input-slot state="filled" value="C" .octave=${4}></et-input-slot>
      <et-input-slot state="correct" value="E" .octave=${4}></et-input-slot>
      <et-input-slot state="octave" value="G" .octave=${3}></et-input-slot>
      <et-input-slot state="incorrect" value="A" .octave=${4}></et-input-slot>
    </div>
  `,
};

/** Sargam names are longer — the cell has to hold three characters. */
export const Sargam: Story = {
  render: () => html`
    <div style="display:flex;gap:12px">
      <et-input-slot state="filled" value="Sa" .octave=${3}></et-input-slot>
      <et-input-slot state="correct" value="Dha" .octave=${4}></et-input-slot>
      <et-input-slot state="octave" value="Ma♯" .octave=${3}></et-input-slot>
    </div>
  `,
};
