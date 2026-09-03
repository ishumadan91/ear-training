import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-practice-card.js';

const meta: Meta = {
  title: 'Organisms/Practice Card',
  component: 'et-practice-card',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="width:360px">
      <et-practice-card
        ?playing=${args.playing}
        .slots=${args.slots}
        @et-play-toggle=${(e: CustomEvent) => console.log('play', e.detail)}
      ></et-practice-card>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Empty: Story = {
  args: { playing: false, slots: [{}, {}, {}, {}] },
};

export const PartiallyAnswered: Story = {
  args: {
    slots: [
      { value: 'C', state: 'filled', octave: 4 },
      { value: 'E', state: 'filled', octave: 3 },
      {},
      {},
    ],
  },
};

export const Graded: Story = {
  args: {
    slots: [
      { value: 'C', state: 'correct', octave: 4 },
      { value: 'E', state: 'correct', octave: 4 },
      { value: 'F', state: 'octave', octave: 3 },
      { value: 'A', state: 'incorrect', octave: 4 },
    ],
  },
};

export const Playing: Story = {
  args: { playing: true, slots: [{}, {}, {}, {}] },
};
