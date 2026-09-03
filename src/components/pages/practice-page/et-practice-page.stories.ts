import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-practice-page.js';
import '../../../styles/global.css';

const meta: Meta = {
  title: 'Pages/Practice Page',
  component: 'et-practice-page',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  render: () => html`<et-practice-page></et-practice-page>`,
};
export default meta;

type Story = StoryObj;

/**
 * The fully wired Practice screen. Open the gear to switch notation
 * (Western scales / Indian thaats), difficulty, root and scale; tap keys on the
 * piano to fill the answer slots; Check grades the round against the generated
 * tune and advances the score, streak and accuracy. Audio is not connected yet
 * — the play control only drives the transport state.
 */
export const Live: Story = {};
