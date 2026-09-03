/**
 * Type-safe mirror of the CSS custom properties in tokens.css.
 * Use these when you need token values in TS (Storybook controls, canvas
 * drawing, computed styles). CSS components should reference var(--token).
 */
export const colors = {
  teal: '#008080',
  coral: '#ff6f61',
  sand: '#f4f1de',
  navy: '#003049',
  slate: '#2e2e2e',
} as const;

export const semanticColors = {
  bg: 'var(--color-bg)',
  text: 'var(--color-text)',
  heading: 'var(--color-heading)',
  primary: 'var(--color-primary)',
  accent: 'var(--color-accent)',
} as const;

export const space = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
} as const;

export const radius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  pill: '999px',
} as const;

export type ColorName = keyof typeof colors;
