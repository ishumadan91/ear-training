import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-icon.js';
import { icons, type IconName } from './icon-registry.js';

const iconNames = Object.keys(icons) as IconName[];

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'et-icon',
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: iconNames },
    size: { control: { type: 'range', min: 12, max: 96, step: 2 } },
    color: { control: 'color' },
  },
  args: { name: 'play', size: 32, color: '#003049' },
  render: ({ name, size, color }) =>
    html`<et-icon name=${name} size=${size} style="color:${color}"></et-icon>`,
};
export default meta;

type Story = StoryObj;

export const Playground: Story = {};

export const AllIcons: Story = {
  render: () => html`
    <div
      style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;color:var(--color-navy);text-align:center;font:14px var(--font-family-base)"
    >
      ${iconNames.map(
        (n) => html`
          <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
            <et-icon name=${n} size="32"></et-icon>
            <code style="font-size:12px;color:var(--color-slate)">${n}</code>
          </div>
        `,
      )}
    </div>
  `,
};

export const Colored: Story = {
  render: () => html`
    <div style="display:flex;gap:24px;align-items:center">
      <et-icon name="play-circle" size="40" style="color:var(--color-teal)"></et-icon>
      <et-icon name="check" size="40" style="color:var(--color-coral)"></et-icon>
      <et-icon name="range" size="40" style="color:var(--color-navy)"></et-icon>
      <et-icon name="info" size="40" style="color:var(--color-slate)"></et-icon>
    </div>
  `,
};
