import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-settings-panel.js';

const meta: Meta = {
  title: 'Organisms/Settings Panel',
  component: 'et-settings-panel',
  tags: ['autodocs'],
  render: (args) => html`
    <div style="width:360px">
      <et-settings-panel
        notation=${args.notation}
        difficulty=${args.difficulty}
        instrument=${args.instrument ?? 'piano'}
        ?settingsLocked=${args.settingsLocked}
        @et-notation-change=${(e: CustomEvent) => console.log('notation', e.detail)}
        @et-difficulty-change=${(e: CustomEvent) => console.log('difficulty', e.detail)}
        @et-instrument-change=${(e: CustomEvent) => console.log('instrument', e.detail)}
      ></et-settings-panel>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

/**
 * Scale and root are no longer here — they live on the practice screen as
 * pill selects, since they change between rounds.
 */
export const Western: Story = {
  args: { notation: 'western', difficulty: 'medium' },
};

export const Indian: Story = {
  args: { notation: 'indian', difficulty: 'hard' },
};

/**
 * Once the tune has been played, root, scale and instrument are all fixed for
 * the round — here the instrument control disables and the hint says so.
 */
export const SettingsLocked: Story = {
  args: {
    notation: 'western',
    difficulty: 'medium',
    instrument: 'guitar',
    settingsLocked: true,
  },
};
