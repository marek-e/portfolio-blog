import type { ImageMetadata } from 'astro';

/**
 * Pre-loaded asset images using import.meta.glob
 * Images must be in src/assets/ directory (any subdirectory)
 * Frontmatter should use paths like: /projects/my-image.png or /logo.svg
 */
const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,svg,avif}',
  { eager: true }
);

/**
 * Get an asset image by its path from frontmatter
 * @param imagePath - Path from frontmatter (e.g., '/projects/my-image.png' or '/logo.svg')
 * @returns ImageMetadata for use with Astro's Image component
 * @throws Error if image not found
 */
export function getProjectImage(imagePath: string): ImageMetadata {
  const fullPath = `/src/assets${imagePath}`;
  const imageModule = assetImages[fullPath];

  if (!imageModule) {
    throw new Error(
      `Image not found: ${imagePath}\n` +
        `Expected file at: src/assets${imagePath}\n` +
        `Available images: ${Object.keys(assetImages).join(', ')}`
    );
  }

  return imageModule.default;
}

/**
 * Safely get a project image, returning undefined if not found
 * Useful for optional images or graceful degradation
 */
export function getProjectImageSafe(imagePath: string | undefined): ImageMetadata | undefined {
  if (!imagePath) return undefined;

  try {
    return getProjectImage(imagePath);
  } catch {
    console.warn(`Image not found: ${imagePath}`);
    return undefined;
  }
}
