import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-piano.js';

const meta: Meta = {
  title: 'Organisms/Piano',
  component: 'et-piano',
  tags: ['autodocs'],
  argTypes: {
    notation: { control: 'inline-radio', options: ['western', 'indian'] },
    rootNote: { control: 'text' },
    scaleKey: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    notation: 'western',
    rootNote: 'C',
    scaleKey: 'major',
    disabled: false,
  },
  render: ({ notation, rootNote, scaleKey, disabled }) => html`
    <div style="width:360px">
      <et-piano
        notation=${notation}
        rootNote=${rootNote}
        scaleKey=${scaleKey}
        ?disabled=${disabled}
        @et-note-press=${(e: CustomEvent) => console.log('note', e.detail)}
      ></et-piano>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

/** Western keys around C — wider than the frame, so it scrolls. */
export const Western: Story = {};

/** The same keyboard labelled with sargam; lowercase = komal swara. */
export const Indian: Story = { args: { notation: 'indian' } };

export const Disabled: Story = { args: { disabled: true } };

/**
 * Western names are absolute — changing the root leaves every label alone.
 * Only which keys belong to the scale changes, which the piano doesn't show.
 */
export const WesternAtRootASharp: Story = {
  args: { notation: 'western', rootNote: 'A♯' },
};

/**
 * Sargam is relative: Sa *is* the tonic. At root A♯ the syllables rotate so
 * "Sa" sits on the A♯ key — but each key still sounds its own pitch.
 */
export const IndianAtRootASharp: Story = {
  args: { notation: 'indian', rootNote: 'A♯' },
};

/**
 * With a scale set, keys outside it dim — a hint, not a rail. They stay
 * tappable, because tapping a wrong note is how the exercise tests you.
 */
export const OutOfScaleDimmed: Story = {
  args: { notation: 'western', scaleKey: 'major', rootNote: 'C' },
};

/** The dimming follows the root: at A♯ major, A♯/C/D/D♯/F/G/A stay lit. */
export const OutOfScaleAtRootASharp: Story = {
  args: { notation: 'western', scaleKey: 'major', rootNote: 'A♯' },
};

/** A pentatonic leaves most of the keyboard dimmed. */
export const PentatonicDimmed: Story = {
  args: { notation: 'western', scaleKey: 'minorPentatonic', rootNote: 'C' },
};

/** Sargam labels rotate to the root while the thaat's notes stay lit. */
export const IndianThaatDimmed: Story = {
  args: { notation: 'indian', scaleKey: 'bhairav', rootNote: 'A♯' },
};
