/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: EY site cleanup.
 * Removes non-authorable content from EY pages.
 * All selectors from captured DOM (migration-work/cleaned.html).
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie consent banner (found: #onetrust-consent-sdk)
    // Cookie modal (found: #cookie-modal)
    // Skip to content link (found: .skip-content-wrapper)
    // Hidden read-more/read-less buttons (found: .rich-text__read-more-btn, .rich-text__read-less-btn)
    // Hidden iframes (found: .hidden-iframe)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#cookie-modal',
      '.skip-content-wrapper',
      '.rich-text__read-more-btn',
      '.rich-text__read-less-btn',
      '.hidden-iframe',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Header experience fragment (found: .cmp-experiencefragment--header)
    // Footer experience fragment (found: .cmp-experiencefragment--footer)
    // Navigation (found: nav.cmp-navigation)
    // Sub-navigation wrappers (found: [id^="sitenav-sub-wrapper"])
    // Top site navigation (found: #sitenav-top)
    // Search components (found: .up-instant-search, .global-search, #search-result-mobile-view, #search-result)
    // Page metadata components (found: .pagemetadata-core, .page-metadata-content)
    // Button modal containers (found: .up-button_modal-container)
    // Accessibility text (found: .unified-header__accessibility-text)
    // Instant accessibility hidden text (found: .up-instant-accessibility-hidden)
    // Iframes (found: iframe)
    // Noscript tags
    // Link tags
    WebImporter.DOMUtils.remove(element, [
      '.cmp-experiencefragment--header',
      '.cmp-experiencefragment--footer',
      'nav.cmp-navigation',
      '[id^="sitenav-sub-wrapper"]',
      '#sitenav-top',
      '.up-instant-search',
      '.global-search',
      '#search-result-mobile-view',
      '#search-result',
      '.pagemetadata-core',
      '.page-metadata-content',
      '.up-button_modal-container',
      '.unified-header__accessibility-text',
      '.up-instant-accessibility-hidden',
      'iframe',
      'noscript',
      'link',
    ]);

    // Remove data-tracking and onclick attributes from all elements
    element.querySelectorAll('[data-cmp-data-layer-enabled]').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-enabled');
    });
    element.querySelectorAll('[onclick]').forEach((el) => {
      el.removeAttribute('onclick');
    });
  }
}
