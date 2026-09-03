import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-menu-segment.js';
import '../../atoms/toggle/et-toggle.js';
import '../../atoms/icon/et-icon.js';

const meta: Meta = {
  title: 'Molecules/Menu Segment',
  component: 'et-menu-segment',
  tags: ['autodocs'],
  argTypes: {
    heading: { control: 'text' },
    suffix: { control: 'text' },
    active: { control: 'boolean' },
  },
  args: { heading: 'A', suffix: 'major', active: false },
  render: ({ heading, suffix, active }) => html`
    <div style="width:120px;background:#fff;border:1px solid var(--color-border)">
      <et-menu-segment
        heading=${heading}
        suffix=${suffix}
        ?active=${active}
        @et-segment-click=${(e: CustomEvent) => console.log('segment', e.detail)}
      >
        <et-icon name="scale" size="18" style="color:var(--color-primary)"></et-icon>
      </et-menu-segment>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const ScaleSegment: Story = {};

export const NotationWithToggle: Story = {
  render: () => html`
    <div style="width:120px;background:#fff;border:1px solid var(--color-border)">
      <et-menu-segment key="notation" heading="Western">
        <et-toggle></et-toggle>
      </et-menu-segment>
    </div>
  `,
};

export const RangeSegment: Story = {
  render: () => html`
    <div style="width:120px;background:#fff;border:1px solid var(--color-border)">
      <et-menu-segment key="range" heading="C3 → B4">
        <et-icon name="range" size="26" style="color:var(--color-primary)"></et-icon>
      </et-menu-segment>
    </div>
  `,
};
