/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroFeaturedParser from './parsers/hero-featured.js';
import cardsArticleParser from './parsers/cards-article.js';
import cardsServiceParser from './parsers/cards-service.js';
import columnsPromoParser from './parsers/columns-promo.js';
import carouselTeamParser from './parsers/carousel-team.js';

// TRANSFORMER IMPORTS
import eyCleanupTransformer from './transformers/ey-cleanup.js';
import eySectionsTransformer from './transformers/ey-sections.js';

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'ai-services-page',
  description: 'EY AI services landing page with hero, service offerings, insights, and call-to-action sections',
  urls: [
    'https://www.ey.com/en_in/services/ai',
  ],
  blocks: [
    {
      name: 'hero-featured',
      instances: ['.cmp-hero.hero-featured'],
    },
    {
      name: 'cards-article',
      instances: ['.up-content-grid'],
    },
    {
      name: 'columns-promo',
      instances: ['.cmp-container--theme-light-grey .up-promotional-banner--promo-side-by-side'],
    },
    {
      name: 'cards-service',
      instances: ['.cmp-link-area--regular'],
    },
    {
      name: 'carousel-team',
      instances: ['.upCarousel .up-carousel'],
    },
  ],
  sections: [
    {
      id: 'section-2',
      name: 'AI Insights Hero Text',
      selector: '.rich-text.aem-GridColumn--default--7',
      style: 'dark',
      blocks: [],
      defaultContent: ['h1', 'h1 + p'],
    },
    {
      id: 'section-3',
      name: 'Featured Thinking',
      selector: '.hero-v2',
      style: null,
      blocks: ['hero-featured'],
      defaultContent: [],
    },
    {
      id: 'section-4',
      name: 'Our Latest Thinking',
      selector: '.up-content-grid',
      style: null,
      blocks: ['cards-article'],
      defaultContent: [],
    },
    {
      id: 'section-5',
      name: 'AI Case Studies and Use Cases',
      selector: '.cmp-container--theme-light-grey',
      style: 'grey',
      blocks: ['columns-promo'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'How EY Can Help',
      selector: '.link-area',
      style: null,
      blocks: ['cards-service'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'The Team',
      selector: '.cmp-container--theme-dark',
      style: 'dark',
      blocks: ['carousel-team'],
      defaultContent: ['h3'],
    },
    {
      id: 'section-8',
      name: 'Navigate Your AI Journey CTA',
      selector: '.cmp-container--theme-dark-accented',
      style: 'dark',
      blocks: [],
      defaultContent: ['p.up-promotional-banner__content-heading', '.up-promotional-banner__content-description', '.up-button'],
    },
  ],
};

// PARSER REGISTRY
const parsers = {
  'hero-featured': heroFeaturedParser,
  'cards-article': cardsArticleParser,
  'cards-service': cardsServiceParser,
  'columns-promo': columnsPromoParser,
  'carousel-team': carouselTeamParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  eyCleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [eySectionsTransformer] : []),
];

function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

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
          section: blockDef.section || null,
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
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
