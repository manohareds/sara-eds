/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EY section breaks and section metadata.
 * Inserts <hr> section dividers and Section Metadata blocks based on template sections.
 * All selectors from captured DOM (migration-work/cleaned.html):
 *   section-2: .rich-text.aem-GridColumn--default--7 (style: dark)
 *   section-3: .hero-v2 (style: null)
 *   section-4: .up-content-grid (style: null)
 *   section-5: .cmp-container--theme-light-grey (style: grey)
 *   section-6: .link-area (style: null)
 *   section-7: .cmp-container--theme-dark (style: dark)
 *   section-8: .cmp-container--theme-dark-accented (style: dark)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload || {};
    if (!template || !template.sections || template.sections.length < 2) return;

    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
    const sections = template.sections;

    // Process sections in reverse order to preserve DOM positions
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      if (!section.selector) continue;

      // Find the first element matching this section's selector
      const sectionEl = element.querySelector(section.selector);
      if (!sectionEl) continue;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const metaBlock = WebImporter.Blocks.createBlock(document, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(metaBlock);
      }

      // Insert <hr> before every section except the first one
      if (i > 0) {
        const hr = document.createElement('hr');
        sectionEl.before(hr);
      }
    }
  }
}
