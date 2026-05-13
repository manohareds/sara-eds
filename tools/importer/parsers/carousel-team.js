/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-team variant.
 * Base block: carousel
 * Source: https://www.ey.com/en_in/services/ai
 * Selector: .upCarousel .up-carousel
 * Generated: 2026-05-12
 *
 * Extracts team member profiles from a Swiper-based carousel.
 * Each member has a headshot image (linked), name (linked), and job title.
 * Duplicate slides (.swiper-slide-duplicate) are skipped to avoid duplicates.
 *
 * Target table structure (from library-example.md):
 *   | Carousel (team) | |
 *   |---|---|
 *   | ![headshot](photo.jpg) | **[Name](link)** Job Title |
 */
export default function parse(element, { document }) {
  const cells = [];

  // Select all swiper slides, excluding duplicates created by Swiper for infinite loop
  const slides = element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)');

  slides.forEach((slide) => {
    // Each slide can contain multiple team member cards in a grid layout
    // Team members are in .aem-GridColumn--default--4 containers
    const memberContainers = slide.querySelectorAll('.container.responsivegrid.aem-GridColumn--default--4');

    memberContainers.forEach((container) => {
      // Extract headshot image
      const img = container.querySelector('.cmp-image__image, .up-image img');
      if (!img) return; // Skip containers without images

      // Extract the person link (from image wrapper or text)
      const imageLink = container.querySelector('.cmp-image__link, .cmp-image a');
      const personHref = imageLink ? imageLink.getAttribute('href') : null;

      // Extract name and job title from the rich text h5 element
      const h5 = container.querySelector('.up-rich-text__container-content h5, .cmp-text h5');
      if (!h5) return; // Skip if no text content

      // Extract name link from inside h5
      const nameLink = h5.querySelector('a');
      const nameText = nameLink ? nameLink.textContent.replace(/\s+/g, ' ').trim() : '';

      // Extract job title from span.yellow-text inside h5
      const titleSpan = h5.querySelector('span.yellow-text, span');
      const jobTitle = titleSpan ? titleSpan.textContent.trim() : '';

      // Build cell 1: headshot image
      const imgEl = img.cloneNode(true);

      // Build cell 2: bold linked name + job title
      const contentCell = [];

      if (nameText && personHref) {
        // Create bold linked name: **[Name](link)**
        const link = document.createElement('a');
        link.setAttribute('href', personHref);
        link.textContent = nameText;
        const strong = document.createElement('strong');
        strong.appendChild(link);
        contentCell.push(strong);
      } else if (nameText) {
        const strong = document.createElement('strong');
        strong.textContent = nameText;
        contentCell.push(strong);
      }

      if (jobTitle) {
        const titleNode = document.createTextNode(' ' + jobTitle);
        contentCell.push(titleNode);
      }

      // Only add row if we have meaningful content
      if (contentCell.length > 0) {
        cells.push([imgEl, contentCell]);
      }
    });
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-team', cells });
  element.replaceWith(block);
}
