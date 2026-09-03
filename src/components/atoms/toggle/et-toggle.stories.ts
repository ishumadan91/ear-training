import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-toggle.js';

const meta: Meta = {
  title: 'Atoms/Toggle',
  component: 'et-toggle',
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { checked: false, disabled: false },
  render: ({ checked, disabled }) =>
    html`<et-toggle
      ?checked=${checked}
      ?disabled=${disabled}
      @et-toggle-change=${(e: CustomEvent) => console.log('toggle', e.detail)}
    ></et-toggle>`,
};
export default meta;

type Story = StoryObj;

export const Off: Story = {};
export const On: Story = { args: { checked: true } };
export const Disabled: Story = { args: { disabled: true } };
