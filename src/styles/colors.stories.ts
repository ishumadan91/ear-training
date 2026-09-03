import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './tokens.css';

const meta: Meta = {
  title: 'Design/Colors',
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj;

interface Swatch {
  name: string;
  hex: string;
  token: string;
  role: string;
  contrast?: string;
}

const palette: Swatch[] = [
  { name: 'Bright Teal', hex: '#008080', token: '--color-teal', role: 'Primary brand, logo, active', contrast: '#fff' },
  { name: 'Warm Coral', hex: '#FF6F61', token: '--color-coral', role: 'Buttons, accents, CTA', contrast: '#fff' },
  { name: 'Light Sand', hex: '#F4F1DE', token: '--color-sand', role: 'Background', contrast: '#2E2E2E' },
  { name: 'Navy Blue', hex: '#003049', token: '--color-navy', role: 'Headings, subheadings', contrast: '#fff' },
  { name: 'Dark Slate', hex: '#2E2E2E', token: '--color-slate', role: 'Body text', contrast: '#fff' },
];

const card = (s: Swatch) => html`
  <div style="border:1px solid var(--color-border);border-radius:12px;overflow:hidden;font-family:var(--font-family-base)">
    <div style="background:${s.hex};color:${s.contrast ?? '#fff'};height:96px;display:flex;align-items:flex-end;padding:12px;font-weight:600">
      ${s.name}
    </div>
    <div style="padding:12px;background:#fff">
      <div style="font-family:monospace;font-size:13px;color:var(--color-slate)">${s.hex}</div>
      <div style="font-family:monospace;font-size:12px;color:var(--color-muted)">var(${s.token})</div>
      <div style="margin-top:6px;font-size:13px;color:var(--color-navy)">${s.role}</div>
    </div>
  </div>
`;

export const Palette: Story = {
  render: () => html`
    <h2 style="font-family:var(--font-family-base);color:var(--color-navy)">Brand palette</h2>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px">
      ${palette.map(card)}
    </div>
    <p style="font-family:var(--font-family-base);color:var(--color-slate);margin-top:24px">
      Full documentation: <code>docs/design/colors.md</code>
    </p>
  `,
};
