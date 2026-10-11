/**
 * Canonical color tokens — GOODR design system.
 *
 * The brand accent scale is intentionally still named `heat*` so every existing
 * call site (icon tints, gradients, `text-heat`, active tabs, badges…) recolors
 * automatically to the new electric blue → cyan brand without touching call
 * sites. `brandBlue` / `brandCyan` are the explicit gradient anchors.
 *
 * Mirrors tailwind.config.js so imperative code shares one source of truth with
 * NativeWind className styling.
 */
export const colors = {
  // Surfaces — deep, cool, near-black with a slate undertone (matches the
  // diagonal background gradient from the brand reference).
  bg: '#080B12',
  surface: '#0D1420',
  card: '#131C2B',
  card2: '#1B2740',
  hair: '#25344B',
  overlay: 'rgba(4,8,16,0.74)',

  // Brand accent scale (electric blue → cyan). Names kept for compatibility.
  heat: '#2E90FA', // primary blue — links, active states, solid accents
  heatDark: '#1E6FE0', // deep blue
  heatLight: '#38D6F0', // cyan — gradient end + glow
  heatSoft: 'rgba(46,144,250,0.14)',
  amber: '#F5A524',

  // Explicit brand gradient anchors
  brandBlue: '#2E90FA',
  brandCyan: '#22D3EE',
  brandIndigo: '#3B6FF5',

  // Semantic status
  ok: '#22C55E',
  alert: '#F04452',
  info: '#38BDF8',
  warn: '#F5A524',
  steel: '#60A5FA',

  // Text scale (cool blue-grays)
  ink0: '#F5F9FF',
  ink1: '#DCE6F7',
  ink2: '#93A4C1',
  ink3: '#5D6E8C',

  light: '#F8FAFC',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorToken = keyof typeof colors;
