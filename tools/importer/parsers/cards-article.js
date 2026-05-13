/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-article variant.
 * Base block: cards
 * Source: https://www.ey.com/en_in/services/ai
 * Selector: .up-content-grid
 * Generated: 2026-05-12
 *
 * Extracts article cards from an EY content grid.
 * Each card has: image, linked title, description, date, and author/duration metadata.
 * Target table: 2 columns per row — image | title + description + metadata.
 */
export default function parse(element, { document }) {
  // Find all card items within the content grid list
  const cardItems = element.querySelectorAll('.up-content-grid__list-item');

  const cells = [];

  cardItems.forEach((card) => {
    // Column 1: Card image
    const image = card.querySelector('img.up-content-grid__list-item-image');

    // Column 2: Content — title, description, metadata
    const contentElements = [];

    // Title as a bold link (matches library example: **[Article Title](link)**)
    const titleLink = card.querySelector('a.up-content-grid__list-item-title-link');
    if (titleLink) {
      const strong = document.createElement('strong');
      const link = document.createElement('a');
      link.href = titleLink.href;
      link.textContent = titleLink.textContent.trim();
      strong.appendChild(link);
      const titleP = document.createElement('p');
      titleP.appendChild(strong);
      contentElements.push(titleP);
    }

    // Description paragraph
    const description = card.querySelector('p.up-content-grid__list-item-description');
    if (description) {
      const descP = document.createElement('p');
      descP.textContent = description.textContent.trim();
      contentElements.push(descP);
    }

    // Metadata line: date + author or duration (e.g., "29 Apr 2026 · EY India")
    const dateEl = card.querySelector('span.up-content-grid__list-item-tagline-publish-date');
    const authorLink = card.querySelector('a.up-content-grid__list-item-tagline-author-link');
    const durationEl = card.querySelector('span.up-content-grid__list-item-tagline-duration');

    if (dateEl || authorLink || durationEl) {
      const metaP = document.createElement('p');
      const parts = [];

      if (dateEl) {
        parts.push(dateEl.textContent.trim());
      }
      if (authorLink) {
        parts.push(authorLink.textContent.trim());
      } else if (durationEl) {
        parts.push(durationEl.textContent.trim());
      }

      metaP.textContent = parts.join(' · ');
      contentElements.push(metaP);
    }

    // Only add a row if we have at minimum an image or content
    if (image || contentElements.length > 0) {
      cells.push([
        image || '',
        contentElements,
      ]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
