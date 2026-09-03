import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-swara.js';

const meta: Meta = {
  title: 'Atoms/Swara',
  component: 'et-swara',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'text' },
    komal: { control: 'boolean' },
    tivra: { control: 'boolean' },
    saptak: { control: 'inline-radio', options: [null, 'mandra', 'madhya', 'taar'] },
    octaveLabel: { control: 'number' },
  },
  args: { name: 'N', komal: false, tivra: false, saptak: 'madhya', octaveLabel: null },
  render: ({ name, komal, tivra, saptak, octaveLabel }) => html`
    <span style="font-size:20px;font-weight:700;color:var(--color-heading)">
      <et-swara
        name=${name}
        ?komal=${komal}
        ?tivra=${tivra}
        .saptak=${saptak}
        .octaveLabel=${octaveLabel}
      ></et-swara>
    </span>
  `,
};
export default meta;

type Story = StoryObj;

/**
 * The marks are CSS, not combining characters — a combining low line lands
 * off-centre in Open Sans, and komal + mandra would collide below the letter.
 */
export const Marks: Story = {
  render: () => html`
    <div
      style="display:flex;gap:20px;font-size:20px;font-weight:700;color:var(--color-heading)"
    >
      <et-swara name="S" .saptak=${'madhya'}></et-swara>
      <et-swara name="N" komal .saptak=${'madhya'}></et-swara>
      <et-swara name="M" tivra .saptak=${'madhya'}></et-swara>
      <et-swara name="S" .saptak=${'taar'}></et-swara>
      <et-swara name="P" .saptak=${'mandra'}></et-swara>
      <et-swara name="D" komal .saptak=${'mandra'}></et-swara>
      <et-swara name="G" komal .saptak=${'taar'}></et-swara>
    </div>
  `,
};

/** Western notes carry no marks — just the name and its octave. */
export const Western: Story = {
  render: () => html`
    <div
      style="display:flex;gap:20px;font-size:20px;font-weight:700;color:var(--color-heading)"
    >
      <et-swara name="C" .octaveLabel=${4}></et-swara>
      <et-swara name="F♯" .octaveLabel=${3}></et-swara>
    </div>
  `,
};

/** On a dark key. */
export const OnDark: Story = {
  render: () => html`
    <div
      style="display:flex;gap:20px;padding:16px;background:var(--color-heading);color:#fff;font-size:16px;font-weight:700"
    >
      <et-swara name="R" komal .saptak=${'mandra'}></et-swara>
      <et-swara name="M" tivra .saptak=${'taar'}></et-swara>
    </div>
  `,
};
