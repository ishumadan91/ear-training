import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-stats-bar.js';

const meta: Meta = {
  title: 'Organisms/Stats Bar',
  component: 'et-stats-bar',
  tags: ['autodocs'],
  args: { score: 12, streak: 8, accuracy: 89 },
  render: ({ score, streak, accuracy }) => html`
    <div style="width:360px">
      <et-stats-bar
        score=${score}
        streak=${streak}
        .accuracy=${accuracy}
      ></et-stats-bar>
    </div>
  `,
};
export default meta;

type Story = StoryObj;

export const Default: Story = {};

/**
 * Before any round has been graded there is no accuracy to report, so the
 * figure reads "–" rather than claiming a perfect 100%.
 */
export const FreshSession: Story = {
  args: { score: 0, streak: 0, accuracy: null },
};
