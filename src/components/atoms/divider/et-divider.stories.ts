import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-divider.js';

const meta: Meta = {
  title: 'Atoms/Divider',
  component: 'et-divider',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const Horizontal: Story = {
  render: () => html`<div style="width:240px"><et-divider orientation="horizontal"></et-divider></div>`,
};

export const Vertical: Story = {
  render: () =>
    html`<div style="height:60px;display:flex"><et-divider orientation="vertical"></et-divider></div>`,
};
