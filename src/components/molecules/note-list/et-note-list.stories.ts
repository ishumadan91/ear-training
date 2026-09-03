import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-note-list.js';
import { buildKeyboard, findScale, rootIndexOf } from '../../../data/scales.js';

/** A few real notes straight out of the keyboard builder. */
const pick = (notation: 'western' | 'indian', root: string, at: number[]) => {
  const ri = rootIndexOf(root);
  const kb = buildKeyboard(notation, ri, findScale(notation, notation === 'western' ? 'major' : 'bilawal').degrees);
  const keys = [...kb.whiteKeys, ...kb.blackKeys].sort(
    (a, b) => a.octave * 12 + a.semitone - (b.octave * 12 + b.semitone),
  );
  return at.map((i) => keys[i]);
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
 * on screen, which is what `et-swara` exists to avoid.
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
