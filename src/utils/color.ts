/** Applies an alpha channel to a #RRGGBB hex color, returning rgba(). */
export function withAlpha(hex: string | undefined | null, alpha: number): string {
  if (!hex || typeof hex !== 'string') return `rgba(128, 128, 128, ${alpha})`;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return hex;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
