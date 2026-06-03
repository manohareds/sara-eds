/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-casestudy
 * Base block: carousel
 * Source: https://www.ey.com/en_in
 * Generated: 2026-06-03
 *
 * Extracts case study carousel slides from EY swiper carousel.
 * Each slide has an image and text content (pre-title, title, description, CTA link).
 * Deduplicates swiper cloned slides.
 */
export default function parse(element, { document }) {
  // Select only non-duplicate swiper slides to avoid cloned entries
  const slides = Array.from(
    element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate) .up-case-study-product')
  );

  const cells = [];

  slides.forEach((slide) => {
    // Extract image
    const img = slide.querySelector('.cmp-image__image, .up-case-study-product__image img');

    // Extract link href from the wrapping anchor
    const link = slide.closest('a.up-case-study-product') || slide.querySelector('a.up-case-study-product');
    const href = link ? link.getAttribute('href') : '';

    // Extract text content elements
    const preTitle = slide.querySelector('.up-case-study-product__pre-title');
    const title = slide.querySelector('.up-case-study-product__title');
    const description = slide.querySelector('.up-case-study-product__description');
    const ctaText = slide.querySelector('.up-case-study-product__cta');

    // Build image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:backgroundImage '));
    if (img) {
      const picture = document.createElement('picture');
      const imgEl = document.createElement('img');
      imgEl.src = img.src || img.getAttribute('src');
      imgEl.alt = img.alt || img.getAttribute('alt') || '';
      picture.appendChild(imgEl);
      imageCell.appendChild(picture);
    }

    // Build text cell with field hint
    const textCell = document.createDocumentFragment();
    textCell.appendChild(document.createComment(' field:text '));

    if (preTitle) {
      const p = document.createElement('p');
      p.textContent = preTitle.textContent.trim();
      textCell.appendChild(p);
    }

    if (title) {
      const h3 = document.createElement('h3');
      h3.textContent = title.textContent.trim();
      textCell.appendChild(h3);
    }

    if (description) {
      const p = document.createElement('p');
      p.textContent = description.textContent.trim();
      textCell.appendChild(p);
    }

    // CTA as a linked element
    if (href) {
      const a = document.createElement('a');
      a.href = href;
      a.textContent = ctaText ? ctaText.textContent.trim() : 'Read more';
      textCell.appendChild(a);
    }

    cells.push([imageCell, textCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-casestudy', cells });
  element.replaceWith(block);
}
