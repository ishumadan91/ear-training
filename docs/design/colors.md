# Color Scheme

The Ear Training palette. Five core brand colors, each with a defined role.
These are the single source of truth — implemented as CSS custom properties in
[`src/styles/tokens.css`](../../src/styles/tokens.css) and mirrored for TS in
[`src/styles/tokens.ts`](../../src/styles/tokens.ts).

## Core palette

| Swatch | Name        | Hex       | Token            | Role                                         |
| ------ | ----------- | --------- | ---------------- | -------------------------------------------- |
| 🟢     | Bright Teal | `#008080` | `--color-teal`   | Primary brand color, main logo, active state |
| 🔴     | Warm Coral  | `#FF6F61` | `--color-coral`  | Buttons, accents, call-to-action             |
| 🟡     | Light Sand  | `#F4F1DE` | `--color-sand`   | Background                                    |
| 🔵     | Navy Blue   | `#003049` | `--color-navy`   | Headings, subheadings                        |
| ⚫     | Dark Slate  | `#2E2E2E` | `--color-slate`  | Body text                                    |

## Semantic roles

Components should reference semantic tokens, not raw palette tokens, so themes
can be re-mapped in one place.

| Semantic token              | Maps to         | Used for                          |
| --------------------------- | --------------- | --------------------------------- |
| `--color-bg`                | Light Sand      | App / surface background          |
| `--color-text`              | Dark Slate      | Body copy, labels                 |
| `--color-heading`           | Navy Blue       | Headings, segment titles          |
| `--color-primary`           | Bright Teal     | Primary actions, play, toggles    |
| `--color-primary-contrast`  | White           | Text/icons on teal                |
| `--color-accent`            | Warm Coral      | CTA buttons (Check), highlights   |
| `--color-accent-contrast`   | White           | Text/icons on coral               |

## Derived tints & shades

Generated for hover, pressed, fills, and borders. See `tokens.css` for the full
list (`--color-teal-600`, `--color-coral-100`, `--color-sand-200`, etc.).

## Usage rules

1. **Background is always Light Sand.** Surfaces that need to lift off the
   background use `--color-surface` (white) with `--shadow-sm`.
2. **Teal = "the app is doing music."** Play controls, active toggles, selected
   keys, and the logo. One primary per view.
3. **Coral = "your move."** Reserved for the single most important call-to-action
   on screen (e.g. **Check**). Avoid more than one coral button per view.
4. **Navy for hierarchy, Slate for reading.** Titles and segment labels in Navy;
   running text and secondary labels in Slate.
5. **Accessibility:** Teal-on-white and Navy-on-Sand both clear WCAG AA for
   normal text. Coral is used as a *fill* with white text, not as text on Sand.
