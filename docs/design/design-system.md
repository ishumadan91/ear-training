# Ear Training Design System

A component library built with **Lit web components**, organised by **Atomic
Design**, themed with **design tokens**, and documented in **Storybook**.

## Principles

- **Standards-first.** Every UI element is a real custom element (`<et-*>`),
  styled in its own Shadow DOM. No framework lock-in.
- **Tokens over hard-codes.** Colors, spacing, radius, and type all come from
  [`tokens.css`](../../src/styles/tokens.css). A component should contain no raw
  hex values. See [colors.md](./colors.md).
- **Atomic composition.** Small atoms compose into molecules, molecules into
  organisms, organisms into templates, templates into pages.

## Atomic layers

| Layer         | Folder                        | What lives here                                   | Examples                              |
| ------------- | ----------------------------- | ------------------------------------------------- | ------------------------------------- |
| **Atoms**     | `src/components/atoms`        | Indivisible primitives, one responsibility        | `et-icon`, `et-toggle`, `et-button`, `et-divider`, `et-input-slot` |
| **Molecules** | `src/components/molecules`    | A few atoms wired into a unit with one job        | `et-menu-segment`, `et-input-row`, `et-play-button` |
| **Organisms** | `src/components/organisms`    | Distinct, self-contained sections of an interface | `et-menu-bar`, `et-practice-content`  |
| **Templates** | `src/components/templates`    | Page-level layout with placeholder content        | `et-practice-template`                |
| **Pages**     | `src/components/pages`        | A template wired to real state/data               | `et-practice-page`                    |

## Naming & conventions

- Custom element tag: `et-<name>` (kebab-case), registered with
  `@customElement('et-<name>')`.
- Class name: `Et<Name>` (PascalCase).
- Public API: reactive `@property()` for inputs, `CustomEvent`s for outputs
  (e.g. `et-segment-click`). Events bubble + compose so they cross Shadow DOM.
- One component per file: `et-name.ts` + co-located `et-name.stories.ts`.
- Styles: a single `static styles = css\`…\`` block per component, tokens only.

## Naming the screens (from the Figma wireframes)

The source mobile wireframes live in Figma ("Mobile-wireframes"). The first
build target is the **Practice** screen:

- **Menu bar** (Figma "Top nav") — four tappable config segments:
  1. _Notation_ — "Western" + on/off toggle
  2. _Scale_ — "A major"
  3. _Tempo / Rhythm_ — "90 bpm · 5"
  4. _Range_ — "C3 → B4"
- **Content area** — keyboard, play control, answer input row, Check CTA,
  refresh. Built as labelled **placeholders** for now; the real piano comes
  later.

## Working in this repo

- `npm run dev` — Vite dev server (renders `et-practice-page`).
- `npm run storybook` — browse every atom/molecule/organism in isolation.
- `npm run typecheck` / `npm run build` — type-check and production build.
