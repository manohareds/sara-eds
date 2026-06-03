/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-article
 * Base block: cards
 * Source: https://www.ey.com/en_in/services/ai
 * Selector: .up-content-grid
 * Generated: 2026-06-03
 *
 * Container block: each article card becomes one row with 2 columns (image | text).
 * UE model fields per card: image (reference), imageAlt (collapsed), text (richtext).
 */
export default function parse(element, { document }) {
  // Extract all card items from the content grid
  const cardItems = element.querySelectorAll('.up-content-grid__list-item');
  const cells = [];

  cardItems.forEach((item) => {
    // Skip pagination or non-article items
    if (item.classList.contains('up-content-grid__pagination')) return;

    // --- Column 1: Image ---
    const image = item.querySelector('.up-content-grid__list-item-image');

    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (image) {
      // Clone image to preserve src and alt (alt is the collapsed imageAlt field)
      const img = image.cloneNode(true);
      imageCell.appendChild(img);
    }

    // --- Column 2: Text (richtext) ---
    const titleLink = item.querySelector('.up-content-grid__list-item-title-link');
    const description = item.querySelector('.up-content-grid__list-item-description');
    const publishDate = item.querySelector('.up-content-grid__list-item-tagline-publish-date');
    const authorLink = item.querySelector('.up-content-grid__list-item-tagline-author-link');

    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (titleLink) {
      // Create a heading-level link for the title
      const h3 = document.createElement('h3');
      const link = titleLink.cloneNode(true);
      h3.appendChild(link);
      textCell.appendChild(h3);
    }

    if (description) {
      const p = description.cloneNode(true);
      textCell.appendChild(p);
    }

    if (publishDate || authorLink) {
      const tagline = document.createElement('p');
      if (publishDate) {
        const dateSpan = document.createElement('em');
        dateSpan.textContent = publishDate.textContent.trim();
        tagline.appendChild(dateSpan);
      }
      if (publishDate && authorLink) {
        tagline.appendChild(document.createTextNode(' | '));
      }
      if (authorLink) {
        const author = authorLink.cloneNode(true);
        tagline.appendChild(author);
      }
      textCell.appendChild(tagline);
    }

    // Each card is one row with two columns: [image, text]
    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
