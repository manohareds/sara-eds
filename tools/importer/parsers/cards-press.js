/* eslint-disable */
/* global WebImporter */

/**
 * Parser for cards-press variant.
 * Base block: cards
 * Source: https://www.ey.com/en_in
 * Selector: .up-linked-content.five-cell-grid
 * Generated: 2026-06-03
 *
 * UE Model fields per card item:
 *   - image (reference): Card image
 *   - text (richtext): Card text content (title, description, tagline)
 */
export default function parse(element, { document }) {
  const cells = [];

  // Featured cards: have image + title + description + tagline
  const featuredTeasers = element.querySelectorAll('.cmp-teaser.cmp-separator:not(.cmp-news-List)');
  featuredTeasers.forEach((teaser) => {
    // Extract image
    const img = teaser.querySelector('.cmp-teaser__image img');

    // Extract text content: title, description, tagline
    const title = teaser.querySelector('.cmp-teaser__title');
    const description = teaser.querySelector('.cmp-teaser__description > p');
    const tagline = teaser.querySelector('.cmp-teaser__tagline');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = img.closest('picture') || img;
      imageCell.appendChild(picture);
    }

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));
    if (title) textCell.appendChild(title);
    if (description) textCell.appendChild(description);
    if (tagline) textCell.appendChild(tagline);

    cells.push([imageCell, textCell]);
  });

  // News list cards: small cards with title + tagline only (no image)
  const newsListTeaser = element.querySelector('.cmp-teaser.cmp-news-List');
  if (newsListTeaser) {
    const newsItems = newsListTeaser.querySelectorAll('.cmp-teaser__content');
    newsItems.forEach((item) => {
      const title = item.querySelector('.cmp-teaser__title');
      const tagline = item.querySelector('.cmp-teaser__tagline');

      // Empty image cell (no image for news list items)
      const imageCell = document.createDocumentFragment();

      // Build text cell with field hint
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(' field:text '));
      if (title) textCell.appendChild(title);
      if (tagline) textCell.appendChild(tagline);

      cells.push([imageCell, textCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-press', cells });
  element.replaceWith(block);
}
