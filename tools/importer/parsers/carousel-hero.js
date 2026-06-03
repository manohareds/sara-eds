/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-hero variant.
 * Base block: carousel
 * Source: https://www.ey.com/en_in
 * Generated: 2026-06-03
 *
 * Extracts hero carousel slides from EY homepage.
 * Each slide has a background image and content (pre-title, linked title, description).
 * Filters out duplicate slides used for infinite Swiper loop.
 *
 * UE Model: carousel-hero-item
 * Fields: media_image (reference), media_imageAlt (collapsed), content_text (richtext)
 */
export default function parse(element, { document }) {
  // Select only non-duplicate slides
  const slides = element.querySelectorAll('.swiper-slide.up-hero-carousel__slide:not(.swiper-slide-duplicate)');

  const cells = [];

  slides.forEach((slide) => {
    // Extract image from the slide
    const img = slide.querySelector('.up-hero-carousel__image-wrapper img.cmp-image__image, .cmp-image img');

    // Extract content elements
    const contentCopy = slide.querySelector('.up-hero-carousel__content-copy');

    // Build the image cell with field hint
    const imageCell = document.createDocumentFragment();
    imageCell.appendChild(document.createComment(' field:media_image '));
    if (img) {
      const clonedImg = img.cloneNode(true);
      imageCell.appendChild(clonedImg);
    }

    // Build the content cell with field hint
    const contentCell = document.createDocumentFragment();
    contentCell.appendChild(document.createComment(' field:content_text '));

    if (contentCopy) {
      // Pre-title (e.g., "INSIGHTS")
      const preTitle = contentCopy.querySelector('.up-hero-carousel__pre-title p');
      if (preTitle) {
        const p = document.createElement('p');
        p.textContent = preTitle.textContent.trim();
        contentCell.appendChild(p);
      }

      // Title with link
      const titleLink = contentCopy.querySelector('a.up-hero-carousel__title-href');
      if (titleLink) {
        const a = document.createElement('a');
        a.href = titleLink.href || titleLink.getAttribute('href');
        const titleEl = titleLink.querySelector('.up-hero-carousel__title');
        a.textContent = titleEl ? titleEl.textContent.trim() : titleLink.textContent.trim();
        const heading = document.createElement('h2');
        heading.appendChild(a);
        contentCell.appendChild(heading);
      }

      // Description
      const description = contentCopy.querySelector('.up-hero-carousel__description p');
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        contentCell.appendChild(p);
      }
    }

    // Each slide is a row with two columns: image | content
    cells.push([imageCell, contentCell]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
