import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-piano.js';

const meta: Meta = {
  title: 'Organisms/Piano',
  component: 'et-piano',
  tags: ['autodocs'],
  argTypes: {
    notation: { control: 'inline-radio', options: ['western', 'indian'] },
    disabled: { control: 'boolean' },
  },
  args: { notation: 'western', octaves: [3, 4], disabled: false },
  render: ({ notation, octaves, disabled }) => html`
    <div style="width:360px">
      <et-piano
        notation=${notation}
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
