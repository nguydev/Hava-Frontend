/**
 * GOODR brand/lifestyle artwork (client-supplied). Wide landscape scenes — use
 * them as hero banners and marketing imagery, not as the app icon/splash
 * (those stay on the clean logo mark).
 */
export const BRAND_IMAGES = {
  /** Billboard "One team. Three brands." + Daikin/Goodman/Amana + checklist. */
  hero: require('../../assets/images/E810BC52-7F5F-4E67-A896-105C13FD7C4A.png'),
  /** Crane truck lifting a Daikin RTU with the brand yard sign. */
  delivery: require('../../assets/images/D5C149A7-B058-4FE1-9BE7-8048DA1BC156.png'),
  /** Team unloading a rooftop unit — "Heavy load, teamwork makes it easy". */
  team: require('../../assets/images/4B8A5CCA-FD4C-4586-BB22-0D914776D43E.png'),
} as const;

export type BrandImageKey = keyof typeof BRAND_IMAGES;
