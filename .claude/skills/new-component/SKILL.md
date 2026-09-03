---
name: new-component
description: Scaffold a new Lit web component in this design system following Atomic Design conventions. Use when the user asks to create/add a new atom, molecule, organism, template, or page (any et-* component), or to add a component to Storybook. Generates the et-<name>.ts component + co-located et-<name>.stories.ts in the correct atomic layer, wired to design tokens.
---

# Scaffold a new atomic component

Create a token-styled Lit component plus its Storybook story, placed in the
correct atomic layer. Follow the existing conventions exactly — read
[`CLAUDE.md`](../../../CLAUDE.md) and [`docs/design/design-system.md`](../../../docs/design/design-system.md) first.

## Steps

1. **Pick the layer.** atom (indivisible) · molecule (a few atoms) · organism
   (a section) · template (layout, no state) · page (state + wiring). When
   unsure, choose the lowest layer that fits and compose upward.

2. **Names.** Tag `et-<name>` (kebab-case), class `Et<Name>` (PascalCase),
   folder `src/components/<layer>/<name>/`, files `et-<name>.ts` +
   `et-<name>.stories.ts`.

3. **Write the component** from the template below. Rules:
   - Styles use **tokens only** (`var(--color-*)`, `var(--space-*)`,
     `var(--radius-*)`, `var(--font-*)`). Never hard-code a hex or color px.
   - Inputs are `@property()`; document each with a JSDoc line.
   - Outputs are `CustomEvent`s dispatched with `{ bubbles: true, composed: true }`,
     named `et-<something>`. Document with `@fires`.
   - Import child components via side-effect imports of their `.js` path.
   - Add the `HTMLElementTagNameMap` declaration.

4. **Write the story** covering the meaningful states (default + variants +
   disabled/active/graded as applicable). `title` is `<Layer>/<Human Name>`.

5. **Verify:** `npm run typecheck`, and open in `npm run storybook`.

## Component template

```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * et-<name> — <one-line purpose>.
 *
 * @prop  {Type}  <prop>  - <description>
 * @fires et-<event> - CustomEvent<<detail>> when <trigger>
 */
@customElement('et-<name>')
export class Et<Name> extends LitElement {
  static styles = css`
    :host { display: block; }
    /* tokens only */
  `;

  @property({ type: String }) value = '';

  render() {
    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'et-<name>': Et<Name>;
  }
}
```

## Story template

```ts
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './et-<name>.js';

const meta: Meta = {
  title: '<Layer>/<Human Name>',
  component: 'et-<name>',
  tags: ['autodocs'],
  argTypes: { /* controls */ },
  args: { /* defaults */ },
  render: (args) => html`<et-<name> .value=${args.value}></et-<name>>`,
};
export default meta;

type Story = StoryObj;
export const Default: Story = {};
```
