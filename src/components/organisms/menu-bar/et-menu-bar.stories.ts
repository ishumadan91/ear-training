import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-menu-bar.js';

const meta: Meta = {
  title: 'Organisms/Menu Bar',
  component: 'et-menu-bar',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    notation: { control: 'text' },
    scaleRoot: { control: 'text' },
    scaleQuality: { control: 'text' },
    tempo: { control: 'text' },
    range: { control: 'text' },
    activeSegment: {
      control: 'inline-radio',
      options: ['', 'notation', 'scale', 'tempo', 'range'],
    },
  },
  args: {
    notation: 'Western',
    scaleRoot: 'A',
    scaleQuality: 'major',
    tempo: '90 bpm · 5',
    range: 'C3 → B4',
    activeSegment: '',
  },
  render: (args) => html`
    <div style="max-width:420px;margin:0 auto">
      <et-menu-bar
        notation=${args.notation}
        scaleRoot=${args.scaleRoot}
        scaleQuality=${args.scaleQuality}
        tempo=${args.tempo}
        range=${args.range}
        activeSegment=${args.activeSegment}
        @et-menu-select=${(e: CustomEvent) => console.log('select', e.detail)}
        @et-notation-change=${(e: CustomEvent) => console.log('notation', e.detail)}
      ></et-menu-bar>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};
export const ScaleActive: Story = { args: { activeSegment: 'scale' } };
export const Indian: Story = {
  args: { notation: 'Indian', scaleRoot: 'Sa', scaleQuality: 'major' },
};
