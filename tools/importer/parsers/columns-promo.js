/* eslint-disable */
/* global WebImporter */

/**
 * Parser for columns-promo
 * Base block: columns
 * Source: https://www.ey.com/en_in/services/ai
 * Generated: 2026-05-12
 *
 * Extracts side-by-side promotional banners into a Columns (promo) block.
 * Each column contains: heading, description paragraph, and CTA button link.
 *
 * Source selectors (validated against source HTML):
 * - .up-promotional-banner--promo-side-by-side  (each promo banner item)
 * - .up-promotional-banner__content-heading      (heading paragraph)
 * - .up-promotional-banner__content-description p (description text)
 * - a.up-button                                   (CTA link)
 */
export default function parse(element, { document }) {
  // The element is one of the matched .up-promotional-banner--promo-side-by-side items.
  // We need to collect all sibling promo banners from the parent container to build
  // the full columns block with one cell per column.

  // Navigate to parent container that holds all promo banners
  const parentContainer = element.closest('.cmp-container') || element.parentElement;

  // Guard: if this parent was already processed by a previous call,
  // remove this element (it was already folded into the block) and skip
  if (parentContainer.dataset.columnsParsed) {
    element.remove();
    return;
  }
  parentContainer.dataset.columnsParsed = 'true';

  // Collect all promotional banner items within the container
  const promoBanners = parentContainer.querySelectorAll('.up-promotional-banner--promo-side-by-side');

  // If no banners found, skip
  if (!promoBanners || promoBanners.length === 0) return;

  // Build one cell per promo banner (all in a single row for side-by-side columns)
  const row = [];

  promoBanners.forEach((banner) => {
    const cellContent = [];

    // Extract heading: p.up-promotional-banner__content-heading
    const heading = banner.querySelector('.up-promotional-banner__content-heading');
    if (heading) {
      // Convert the <p> heading to a strong/bold element to match library example format
      const strong = document.createElement('strong');
      strong.textContent = heading.textContent.trim();
      cellContent.push(strong);
    }

    // Extract description: .up-promotional-banner__content-description p
    const descP = banner.querySelector('.up-promotional-banner__content-description p');
    if (descP) {
      const p = document.createElement('p');
      p.textContent = descP.textContent.trim();
      cellContent.push(p);
    } else {
      // Fallback: use the description container text directly
      const descDiv = banner.querySelector('.up-promotional-banner__content-description');
      if (descDiv) {
        const p = document.createElement('p');
        p.textContent = descDiv.textContent.trim();
        cellContent.push(p);
      }
    }

    // Extract CTA link: a.up-button or a.cmp-button
    const ctaLink = banner.querySelector('a.up-button, a.cmp-button, .up-promotional-banner__content-buttons a');
    if (ctaLink) {
      // Create a clean link element preserving href and text
      const link = document.createElement('a');
      link.href = ctaLink.href;
      link.textContent = ctaLink.textContent.trim();
      cellContent.push(link);
    }

    row.push(cellContent);
  });

  // Build cells: single row with N columns (one per promo banner)
  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-promo', cells });
  element.replaceWith(block);
}
