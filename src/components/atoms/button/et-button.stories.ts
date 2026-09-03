import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-button.js';

const meta: Meta = {
  title: 'Atoms/Button',
  component: 'et-button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'accent', 'ghost'],
    },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: { variant: 'primary', size: 'md', disabled: false, label: 'Check answer' },
  render: ({ variant, size, disabled, label }) =>
    html`<et-button
      variant=${variant}
      size=${size}
      ?disabled=${disabled}
      label=${label}
    ></et-button>`,
};
export default meta;

type Story = StoryObj;

export const Primary: Story = { args: { variant: 'primary', label: 'Check answer' } };
export const Secondary: Story = { args: { variant: 'secondary', label: 'Clear' } };
export const Accent: Story = { args: { variant: 'accent', label: 'Start session' } };
export const Ghost: Story = { args: { variant: 'ghost', label: 'Reveal' } };

export const AllVariants: Story = {
  render: () => html`
    <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
      <et-button variant="accent" label="Check"></et-button>
      <et-button variant="primary" label="Play"></et-button>
      <et-button variant="ghost" label="Reveal"></et-button>
      <et-button variant="primary" size="sm" label="Small"></et-button>
      <et-button variant="accent" disabled label="Disabled"></et-button>
    </div>
  `,
};

export const ActionPair: Story = {
  render: () => html`
    <div style="display:flex;gap:12px;width:340px">
      <et-button style="flex:1" variant="secondary" label="Clear"></et-button>
      <et-button style="flex:2" variant="primary" label="Check answer"></et-button>
    </div>
  `,
};
