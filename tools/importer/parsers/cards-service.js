/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-service
 * Base block: cards
 * Source: https://www.ey.com/en_in/services/ai
 * Generated: 2026-05-12
 *
 * Extracts service listing cards from the source link-area component.
 * Each card has a linked title, description paragraph, and "Read more" link.
 * Target structure: 1 column, 1 row per card (no images variant).
 *
 * Validated selectors from source HTML:
 *   - li.cmp-link-area__item — each service card item
 *   - p.cmp-link-area__item--title — title paragraph containing link
 *   - p.cmp-link-area__item__paragraph — description text
 *   - a.cmp-link-area__item__readmore — "Read more" CTA link
 */
export default function parse(element, { document }) {
  // Select all service card items from the list
  const items = element.querySelectorAll('li.cmp-link-area__item, li[class*="link-area__item"]');

  const cells = [];

  items.forEach((item) => {
    // Build a single container div for all card content so it stays in one cell.
    // Library example: | **[Service Title](link)** Description text. [Read more](link) |
    const container = document.createElement('div');

    // Extract the title link — the <a> inside the title paragraph
    const titleParagraph = item.querySelector('p.cmp-link-area__item--title, p[class*="item--title"]');
    if (titleParagraph) {
      const titleLink = titleParagraph.querySelector('a');
      if (titleLink) {
        // Create a bold paragraph with the link to match: **[Title](link)**
        const p = document.createElement('p');
        const strong = document.createElement('strong');
        strong.appendChild(titleLink.cloneNode(true));
        p.appendChild(strong);
        container.appendChild(p);
      }
    }

    // Extract the description paragraph
    const description = item.querySelector('p.cmp-link-area__item__paragraph, p[class*="item__paragraph"]');
    if (description) {
      container.appendChild(description.cloneNode(true));
    }

    // Extract the "Read more" CTA link
    const readMore = item.querySelector('a.cmp-link-area__item__readmore, a[class*="readmore"]');
    if (readMore) {
      const p = document.createElement('p');
      p.appendChild(readMore.cloneNode(true));
      container.appendChild(p);
    }

    // Only add row if we extracted content
    if (container.children.length > 0) {
      cells.push([container]);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-service', cells });
  element.replaceWith(block);
}
