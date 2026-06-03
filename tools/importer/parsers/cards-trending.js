/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-trending
 * Base block: cards
 * Source: https://www.ey.com/en_in
 * Selector: .up-content-cards.up-content-cards__grid
 * Generated: 2026-06-03
 *
 * Extracts trending content cards from EY homepage.
 * Each card has an image, title, and description wrapped in a link.
 * Target structure: container block with rows of [image | text] per card item.
 */
export default function parse(element, { document }) {
  // Extract all card items from the list
  const cardItems = element.querySelectorAll('.up-content-cards__list-item');

  const cells = [];

  cardItems.forEach((card) => {
    // Extract image
    const img = card.querySelector('.up-content-cards__list-item-image, img');

    // Extract title and description
    const title = card.querySelector('.up-content-cards__list-item-title, .up-content-cards__list-item-details p:first-child');
    const description = card.querySelector('.up-content-cards__list-item-description, .up-content-cards__list-item-details p:last-child');

    // Get the link href from the card anchor
    const href = card.getAttribute('href') || card.closest('a')?.getAttribute('href') || '';

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:image '));
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.setAttribute('src', img.getAttribute('src') || '');
      imgEl.setAttribute('alt', img.getAttribute('alt') || '');
      picture.appendChild(imgEl);
      imageCell.appendChild(picture);
    }

    // Build text cell with field hint (title + description wrapped in link)
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (title) {
      const heading = document.createElement('p');
      heading.textContent = title.textContent.trim();
      if (href) {
        const link = document.createElement('a');
        link.setAttribute('href', href);
        link.textContent = title.textContent.trim();
        heading.textContent = '';
        heading.appendChild(link);
      }
      textCell.appendChild(heading);
    }

    if (description) {
      const desc = document.createElement('p');
      desc.textContent = description.textContent.trim();
      textCell.appendChild(desc);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-trending', cells });
  element.replaceWith(block);
}
