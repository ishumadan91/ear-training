import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-about-sheet.js';

const meta: Meta = {
  title: 'Organisms/About Sheet',
  component: 'et-about-sheet',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: { open: { control: 'boolean' } },
  args: { open: true },
  // The scrim is absolute, so the story supplies the frame it fills.
  render: ({ open }) => html`
    <div
      style="position:relative;width:390px;height:640px;margin:0 auto;overflow:hidden;background:var(--color-bg)"
    >
      <p style="padding:20px;color:var(--color-text-muted)">
        Page content behind the sheet.
      </p>
      <et-about-sheet
        ?open=${open}
        @et-about-close=${() => console.log('close')}
      ></et-about-sheet>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

/** Dismisses on the scrim, on Escape, and on "Got it". */
export const Open: Story = { args: { open: true } };

export const Closed: Story = { args: { open: false } };
