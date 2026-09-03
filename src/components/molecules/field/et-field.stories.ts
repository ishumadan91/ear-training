import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-field.js';
import '../../atoms/select/et-select.js';
import '../../atoms/chip/et-chip.js';

const meta: Meta = {
  title: 'Molecules/Field',
  component: 'et-field',
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj;

export const WithSelect: Story = {
  render: () => html`
    <div style="min-width:300px">
      <et-field label="Root note">
        <et-select
          .options=${[
            { value: 'C', label: 'C' },
            { value: 'D', label: 'D' },
          ]}
          value="C"
        ></et-select>
      </et-field>
    </div>
  `,
};

export const WithChips: Story = {
  render: () => html`
    <div style="min-width:300px">
      <et-field label="Difficulty">
        <div style="display:flex;gap:8px">
          <et-chip label="Easy · 3 notes"></et-chip>
          <et-chip label="Medium · 4 notes" selected></et-chip>
        </div>
      </et-field>
    </div>
  `,
};
