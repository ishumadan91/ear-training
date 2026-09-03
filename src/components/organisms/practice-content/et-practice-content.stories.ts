import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-practice-content.js';

const badges = [
  { label: 'Round 3', variant: 'primary' as const },
  { label: 'Streak 8' },
  { label: 'Major scale' },
  { label: 'Root C' },
];

const meta: Meta = {
  title: 'Organisms/Practice Content',
  component: 'et-practice-content',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: (args) => html`
    <div style="max-width:420px;margin:0 auto;background:var(--color-bg);padding-top:16px">
      <et-practice-content
        .badges=${args.badges ?? badges}
        ?playing=${args.playing}
        .slots=${args.slots}
        notation=${args.notation ?? 'western'}
        .feedbackTone=${args.feedbackTone ?? null}
        ?graded=${args.graded}
        feedbackText=${args.feedbackText ?? ''}
        feedbackDetail=${args.feedbackDetail ?? ''}
        score=${args.score ?? 8}
        streak=${args.streak ?? 8}
        accuracy=${args.accuracy ?? 89}
        @et-check=${() => console.log('check')}
        @et-clear=${() => console.log('clear')}
        @et-next=${() => console.log('next')}
        @et-note-press=${(e: CustomEvent) => console.log('note', e.detail)}
        @et-play-toggle=${(e: CustomEvent) => console.log('play', e.detail)}
      ></et-practice-content>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Fresh: Story = {
  args: { playing: false, slots: [{}, {}, {}, {}], score: 0, streak: 0, accuracy: 100 },
};

export const Answering: Story = {
  args: {
    slots: [
      { value: 'C', state: 'filled', octave: 4 },
      { value: 'E', state: 'filled', octave: 3 },
      {},
      {},
    ],
  },
};

export const Correct: Story = {
  args: {
    slots: [
      { value: 'C', state: 'correct', octave: 4 },
      { value: 'E', state: 'correct', octave: 4 },
      { value: 'G', state: 'correct', octave: 3 },
      { value: 'D', state: 'correct', octave: 4 },
    ],
    feedbackTone: 'success',
    feedbackText: 'Correct! Well played.',
    graded: true,
  },
};

/** Right pitch classes, wrong octaves — amber slots and half credit. */
export const WrongOctave: Story = {
  args: {
    slots: [
      { value: 'C', state: 'correct', octave: 4 },
      { value: 'E', state: 'octave', octave: 3 },
      { value: 'G', state: 'octave', octave: 3 },
      { value: 'D', state: 'correct', octave: 4 },
    ],
    feedbackTone: 'warning',
    feedbackText: 'Right notes, wrong octave in places — half credit.',
    feedbackDetail: 'Correct answer: C4, E4, G4, D4',
    graded: true,
  },
};

/** The whole tune shifted by a constant interval — right shape, wrong key. */
export const Transposed: Story = {
  args: {
    slots: [
      { value: 'D', state: 'incorrect', octave: 4 },
      { value: 'F♯', state: 'incorrect', octave: 4 },
      { value: 'A', state: 'incorrect', octave: 3 },
      { value: 'E', state: 'incorrect', octave: 4 },
    ],
    feedbackTone: 'warning',
    feedbackText: 'Right shape, wrong key — you shifted the whole tune by 2 semitones.',
    feedbackDetail: 'Correct answer: C4, E4, G3, D4',
    graded: true,
  },
};

export const Wrong: Story = {
  args: {
    slots: [
      { value: 'C', state: 'correct', octave: 4 },
      { value: 'E', state: 'correct', octave: 4 },
      { value: 'F', state: 'incorrect', octave: 3 },
      { value: 'A', state: 'incorrect', octave: 4 },
    ],
    feedbackTone: 'error',
    feedbackText: 'Not quite right.',
    feedbackDetail: 'Correct answer: C4, E4, G3, D4',
    graded: true,
  },
};

/** Sargam labels on the keyboard, and a thaat badge instead of a scale badge. */
export const IndianNotation: Story = {
  args: {
    notation: 'indian',
    badges: [
      { label: 'Round 2', variant: 'primary' as const },
      { label: 'Streak 4' },
      { label: 'Bhairav thaat' },
      { label: 'Root D' },
    ],
    slots: [
      { value: 'Sa', state: 'filled', octave: 3 },
      { value: 'Ga', state: 'filled', octave: 4 },
      {},
      {},
    ],
  },
};
