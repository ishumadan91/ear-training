import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-icon-button.js';

const meta: Meta = {
  title: 'Atoms/Icon Button',
  component: 'et-icon-button',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: ['settings', 'info', 'reset', 'play'] },
    active: { control: 'boolean' },
  },
  args: { name: 'settings', label: 'Settings', active: false },
  render: ({ name, label, active }) =>
    html`<et-icon-button
      name=${name}
      label=${label}
      ?active=${active}
      @et-icon-button-click=${() => console.log('clicked')}
    ></et-icon-button>`,
};
export default meta;

type Story = StoryObj;

export const Settings: Story = {};
export const Active: Story = { args: { active: true } };
export const Reset: Story = { args: { name: 'reset', label: 'New set' } };
