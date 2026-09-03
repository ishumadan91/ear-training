import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-piano.js';

const meta: Meta = {
  title: 'Organisms/Piano',
  component: 'et-piano',
  tags: ['autodocs'],
  argTypes: {
    notation: { control: 'inline-radio', options: ['western', 'indian'] },
    rootOffset: { control: { type: 'range', min: 0, max: 11, step: 1 } },
    scaleKey: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    notation: 'western',
    octaves: [3, 4],
    rootOffset: 0,
    scaleKey: '',
    disabled: false,
  },
  render: ({ notation, octaves, rootOffset, scaleKey, disabled }) => html`
    <div style="width:360px">
      <et-piano
        notation=${notation}
        rootOffset=${rootOffset}
        scaleKey=${scaleKey}
        .octaves=${octaves}
        ?disabled=${disabled}
        @et-note-press=${(e: CustomEvent) => console.log('note', e.detail)}
      ></et-piano>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

/** Octaves 3–4 of Western keys — wider than the frame, so it scrolls. */
export const Western: Story = {};

/** The same keyboard labelled with sargam; lowercase = komal swara. */
export const Indian: Story = { args: { notation: 'indian' } };

export const SingleOctave: Story = { args: { octaves: [4] } };
export const Disabled: Story = { args: { disabled: true } };

/**
 * Western names are absolute — changing the root leaves every label alone.
 * Only which keys belong to the scale changes, which the piano doesn't show.
 */
export const WesternAtRootASharp: Story = {
  args: { notation: 'western', rootOffset: 10 },
};

/**
 * Sargam is relative: Sa *is* the tonic. At root A♯ the syllables rotate so
 * "Sa" sits on the A♯ key — but each key still sounds its own pitch.
 */
export const IndianAtRootASharp: Story = {
  args: { notation: 'indian', rootOffset: 10 },
};

/**
 * With a scale set, keys outside it dim — a hint, not a rail. They stay
 * tappable, because tapping a wrong note is how the exercise tests you.
 */
export const OutOfScaleDimmed: Story = {
  args: { notation: 'western', scaleKey: 'major', rootOffset: 0 },
};

/** The dimming follows the root: at A♯ major, A♯/C/D/D♯/F/G/A stay lit. */
export const OutOfScaleAtRootASharp: Story = {
  args: { notation: 'western', scaleKey: 'major', rootOffset: 10 },
};

/** A pentatonic leaves most of the keyboard dimmed. */
export const PentatonicDimmed: Story = {
  args: { notation: 'western', scaleKey: 'minorPentatonic', rootOffset: 0 },
};

/** Sargam labels rotate to the root while the thaat's notes stay lit. */
export const IndianThaatDimmed: Story = {
  args: { notation: 'indian', scaleKey: 'bhairav', rootOffset: 10 },
};
