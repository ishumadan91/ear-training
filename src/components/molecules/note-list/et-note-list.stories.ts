import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-note-list.js';
import { computeRange, noteAt, rootIndexOf } from '../../../data/scales.js';

/** A few real notes from the keyboard's range, counted chromatically from its lowest key. */
const pick = (notation: 'western' | 'indian', root: string, at: number[]) => {
  const ri = rootIndexOf(root);
  const { low } = computeRange(ri);
  return at.map((i) => noteAt(notation, ri, low + i));
};

const meta: Meta = {
  title: 'Molecules/Note List',
  component: 'et-note-list',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

/**
 * Drawn glyphs, not text — spelling these out would put combining marks back
 * on screen, which is what `cg-swara` exists to avoid.
 */
export const Indian: Story = {
  render: () => html`
    <p style="font-size:15px;font-weight:600;color:var(--color-error)">
      Correct answer:
      <et-note-list .notes=${pick('indian', 'C', [1, 8, 15, 22])}></et-note-list>
    </p>
  `,
};

export const Western: Story = {
  render: () => html`
    <p style="font-size:15px;font-weight:600;color:var(--color-heading)">
      Correct answer:
      <et-note-list .notes=${pick('western', 'C', [0, 5, 12, 19])}></et-note-list>
    </p>
  `,
};
