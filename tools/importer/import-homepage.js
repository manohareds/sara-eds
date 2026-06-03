/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import cardsTrendingParser from './parsers/cards-trending.js';
import cardsArticleParser from './parsers/cards-article.js';
import carouselCasestudyParser from './parsers/carousel-casestudy.js';
import cardsPressParser from './parsers/cards-press.js';

// TRANSFORMER IMPORTS
import eyCleanupTransformer from './transformers/ey-cleanup.js';
import eySectionsTransformer from './transformers/ey-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  urls: [
    'https://www.ey.com/en_in'
  ],
  description: 'EY India homepage with hero, featured content, service highlights, and promotional sections',
  blocks: [
    {
      name: 'carousel-hero',
      instances: ['.up-hero-carousel']
    },
    {
      name: 'cards-trending',
      instances: ['.up-content-cards.up-content-cards__grid']
    },
    {
      name: 'cards-article',
      instances: ['.up-content-grid']
    },
    {
      name: 'carousel-casestudy',
      instances: ['.upCarousel .up-carousel']
    },
    {
      name: 'cards-press',
      instances: ['.up-linked-content.five-cell-grid']
    }
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Carousel',
      selector: '.hero-v2',
      style: null,
      blocks: ['carousel-hero'],
      defaultContent: []
    },
    {
      id: 'section-2',
      name: 'Trending Now',
      selector: '.upContentCard.up-content-cards--dotted',
      style: 'dark',
      blocks: ['cards-trending'],
      defaultContent: ['.up-content-cards__title']
    },
    {
      id: 'section-3',
      name: 'LinkedIn Banner',
      selector: '.upImage.component',
      style: 'dark',
      blocks: [],
      defaultContent: ['.cmp-image__link']
    },
    {
      id: 'section-4',
      name: 'Our Latest Thinking',
      selector: '.upContentGrid.component',
      style: null,
      blocks: ['cards-article'],
      defaultContent: ['.up-content-grid__title']
    },
    {
      id: 'section-5',
      name: 'C-Suite Roles',
      selector: '.cmp-container--theme-dark-accented',
      style: 'dark',
      blocks: [],
      defaultContent: ['h3', 'h3 + p', '.up-button']
    },
    {
      id: 'section-6',
      name: 'Featured Case Studies',
      selector: ['.cmp-container--theme-dark-accented:nth-of-type(2)', '.up-carousel'],
      style: 'dark',
      blocks: ['carousel-casestudy'],
      defaultContent: ['h3']
    },
    {
      id: 'section-7',
      name: 'Newsletter Subscription',
      selector: '.cmp-container--theme-accented',
      style: 'highlight',
      blocks: [],
      defaultContent: ['.cmp-subscribe__title', '.cmp-subscribe__subtitle', '.cmp-subscribe__button']
    },
    {
      id: 'section-8',
      name: 'Featured Press Releases',
      selector: '.up-linked-content.five-cell-grid',
      style: 'dark',
      blocks: ['cards-press'],
      defaultContent: ['h3', '.up-button']
    },
    {
      id: 'section-9',
      name: 'Discover More',
      selector: '.cmp-index-search-banner',
      style: 'dark',
      blocks: [],
      defaultContent: ['.cmp-index-search-banner__title', '.cmp-index-search-banner__searchButtons', '.cmp-index-search-banner__relatedTopicWrapper']
    }
  ]
};

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'cards-trending': cardsTrendingParser,
  'cards-article': cardsArticleParser,
  'carousel-casestudy': carouselCasestudyParser,
  'cards-press': cardsPressParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  eyCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [eySectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (section breaks + metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '')
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      }
    }];
  }
};
