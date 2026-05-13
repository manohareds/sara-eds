/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-featured
 * Base block: hero
 * Source: https://www.ey.com/en_in/services/ai
 * Selector: .cmp-hero.hero-featured
 * Generated: 2026-05-12
 *
 * Target table structure (from library-example.md):
 *   Row 1: Background image
 *   Row 2: Bold label text (e.g. "Featured Thinking")
 *   Row 3: Linked article title
 *   Row 4: Author name and date
 */
export default function parse(element, { document }) {
  // --- Extract from source DOM (selectors validated against source.html) ---

  // Row 1: Background image
  // Source: img.cmp-image__image (line 28 of source.html)
  const image = element.querySelector('img.cmp-image__image, img[class*="cmp-image"], .up-hero-banner-image__img img');

  // Row 2: Label / category text (bold in output)
  // Source: span.up-hero-banner-image__content-title (line 9 of source.html)
  const labelEl = element.querySelector('span.up-hero-banner-image__content-title, [class*="content-title"]');

  // Row 3: Linked article title heading
  // Source: .up-hero-banner-image__richText__article-title h3 > a (lines 12-14 of source.html)
  const titleLink = element.querySelector('.up-hero-banner-image__richText__article-title a, .up-hero-banner-image__richText__article-title h3 a, h3 a, h2 a');

  // Row 4: Author name and date
  // Source: span.up-hero-banner-image__richText__name (line 17 of source.html)
  const authorEl = element.querySelector('span.up-hero-banner-image__richText__name, [class*="richText__name"]');
  // Source: span.up-hero-banner-image__richText__featured-date (line 18 of source.html)
  const dateEl = element.querySelector('span.up-hero-banner-image__richText__featured-date, [class*="featured-date"]');

  // --- Build cells array to match library-example.md structure ---
  const cells = [];

  // Row 1: background image
  if (image) {
    cells.push([image]);
  }

  // Row 2: bold label text
  if (labelEl) {
    const bold = document.createElement('strong');
    bold.textContent = labelEl.textContent.trim();
    cells.push([bold]);
  }

  // Row 3: linked article title
  if (titleLink) {
    const link = document.createElement('a');
    link.href = titleLink.href;
    link.textContent = titleLink.textContent.trim();
    cells.push([link]);
  }

  // Row 4: author name and date combined
  const metaParts = [];
  if (authorEl) {
    metaParts.push(authorEl.textContent.trim());
  }
  if (dateEl) {
    metaParts.push(dateEl.textContent.trim());
  }
  if (metaParts.length > 0) {
    const metaText = document.createTextNode(metaParts.join(' · '));
    cells.push([metaText]);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-featured', cells });
  element.replaceWith(block);
}
