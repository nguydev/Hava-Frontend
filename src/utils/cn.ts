/**
 * Lightweight className combiner for NativeWind.
 * Filters falsy values and joins with spaces. Later classes win in NativeWind,
 * so conditional overrides should be placed after their base classes.
 */
export type ClassValue = string | false | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
