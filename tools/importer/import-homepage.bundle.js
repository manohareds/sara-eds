/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document }) {
    const slides = element.querySelectorAll(".swiper-slide.up-hero-carousel__slide:not(.swiper-slide-duplicate)");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".up-hero-carousel__image-wrapper img.cmp-image__image, .cmp-image img");
      const contentCopy = slide.querySelector(".up-hero-carousel__content-copy");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:media_image "));
      if (img) {
        const clonedImg = img.cloneNode(true);
        imageCell.appendChild(clonedImg);
      }
      const contentCell = document.createDocumentFragment();
      contentCell.appendChild(document.createComment(" field:content_text "));
      if (contentCopy) {
        const preTitle = contentCopy.querySelector(".up-hero-carousel__pre-title p");
        if (preTitle) {
          const p = document.createElement("p");
          p.textContent = preTitle.textContent.trim();
          contentCell.appendChild(p);
        }
        const titleLink = contentCopy.querySelector("a.up-hero-carousel__title-href");
        if (titleLink) {
          const a = document.createElement("a");
          a.href = titleLink.href || titleLink.getAttribute("href");
          const titleEl = titleLink.querySelector(".up-hero-carousel__title");
          a.textContent = titleEl ? titleEl.textContent.trim() : titleLink.textContent.trim();
          const heading = document.createElement("h2");
          heading.appendChild(a);
          contentCell.appendChild(heading);
        }
        const description = contentCopy.querySelector(".up-hero-carousel__description p");
        if (description) {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          contentCell.appendChild(p);
        }
      }
      cells.push([imageCell, contentCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-trending.js
  function parse2(element, { document }) {
    const cardItems = element.querySelectorAll(".up-content-cards__list-item");
    const cells = [];
    cardItems.forEach((card) => {
      var _a;
      const img = card.querySelector(".up-content-cards__list-item-image, img");
      const title = card.querySelector(".up-content-cards__list-item-title, .up-content-cards__list-item-details p:first-child");
      const description = card.querySelector(".up-content-cards__list-item-description, .up-content-cards__list-item-details p:last-child");
      const href = card.getAttribute("href") || ((_a = card.closest("a")) == null ? void 0 : _a.getAttribute("href")) || "";
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.setAttribute("src", img.getAttribute("src") || "");
        imgEl.setAttribute("alt", img.getAttribute("alt") || "");
        picture.appendChild(imgEl);
        imageCell.appendChild(picture);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) {
        const heading = document.createElement("p");
        heading.textContent = title.textContent.trim();
        if (href) {
          const link = document.createElement("a");
          link.setAttribute("href", href);
          link.textContent = title.textContent.trim();
          heading.textContent = "";
          heading.appendChild(link);
        }
        textCell.appendChild(heading);
      }
      if (description) {
        const desc = document.createElement("p");
        desc.textContent = description.textContent.trim();
        textCell.appendChild(desc);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-trending", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse3(element, { document }) {
    const cardItems = element.querySelectorAll(".up-content-grid__list-item");
    const cells = [];
    cardItems.forEach((item) => {
      if (item.classList.contains("up-content-grid__pagination")) return;
      const image = item.querySelector(".up-content-grid__list-item-image");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (image) {
        const img = image.cloneNode(true);
        imageCell.appendChild(img);
      }
      const titleLink = item.querySelector(".up-content-grid__list-item-title-link");
      const description = item.querySelector(".up-content-grid__list-item-description");
      const publishDate = item.querySelector(".up-content-grid__list-item-tagline-publish-date");
      const authorLink = item.querySelector(".up-content-grid__list-item-tagline-author-link");
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (titleLink) {
        const h3 = document.createElement("h3");
        const link = titleLink.cloneNode(true);
        h3.appendChild(link);
        textCell.appendChild(h3);
      }
      if (description) {
        const p = description.cloneNode(true);
        textCell.appendChild(p);
      }
      if (publishDate || authorLink) {
        const tagline = document.createElement("p");
        if (publishDate) {
          const dateSpan = document.createElement("em");
          dateSpan.textContent = publishDate.textContent.trim();
          tagline.appendChild(dateSpan);
        }
        if (publishDate && authorLink) {
          tagline.appendChild(document.createTextNode(" | "));
        }
        if (authorLink) {
          const author = authorLink.cloneNode(true);
          tagline.appendChild(author);
        }
        textCell.appendChild(tagline);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-casestudy.js
  function parse4(element, { document }) {
    const slides = Array.from(
      element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate) .up-case-study-product")
    );
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector(".cmp-image__image, .up-case-study-product__image img");
      const link = slide.closest("a.up-case-study-product") || slide.querySelector("a.up-case-study-product");
      const href = link ? link.getAttribute("href") : "";
      const preTitle = slide.querySelector(".up-case-study-product__pre-title");
      const title = slide.querySelector(".up-case-study-product__title");
      const description = slide.querySelector(".up-case-study-product__description");
      const ctaText = slide.querySelector(".up-case-study-product__cta");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:backgroundImage "));
      if (img) {
        const picture = document.createElement("picture");
        const imgEl = document.createElement("img");
        imgEl.src = img.src || img.getAttribute("src");
        imgEl.alt = img.alt || img.getAttribute("alt") || "";
        picture.appendChild(imgEl);
        imageCell.appendChild(picture);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (preTitle) {
        const p = document.createElement("p");
        p.textContent = preTitle.textContent.trim();
        textCell.appendChild(p);
      }
      if (title) {
        const h3 = document.createElement("h3");
        h3.textContent = title.textContent.trim();
        textCell.appendChild(h3);
      }
      if (description) {
        const p = document.createElement("p");
        p.textContent = description.textContent.trim();
        textCell.appendChild(p);
      }
      if (href) {
        const a = document.createElement("a");
        a.href = href;
        a.textContent = ctaText ? ctaText.textContent.trim() : "Read more";
        textCell.appendChild(a);
      }
      cells.push([imageCell, textCell]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-casestudy", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-press.js
  function parse5(element, { document }) {
    const cells = [];
    const featuredTeasers = element.querySelectorAll(".cmp-teaser.cmp-separator:not(.cmp-news-List)");
    featuredTeasers.forEach((teaser) => {
      const img = teaser.querySelector(".cmp-teaser__image img");
      const title = teaser.querySelector(".cmp-teaser__title");
      const description = teaser.querySelector(".cmp-teaser__description > p");
      const tagline = teaser.querySelector(".cmp-teaser__tagline");
      const imageCell = document.createDocumentFragment();
      imageCell.appendChild(document.createComment(" field:image "));
      if (img) {
        const picture = img.closest("picture") || img;
        imageCell.appendChild(picture);
      }
      const textCell = document.createDocumentFragment();
      textCell.appendChild(document.createComment(" field:text "));
      if (title) textCell.appendChild(title);
      if (description) textCell.appendChild(description);
      if (tagline) textCell.appendChild(tagline);
      cells.push([imageCell, textCell]);
    });
    const newsListTeaser = element.querySelector(".cmp-teaser.cmp-news-List");
    if (newsListTeaser) {
      const newsItems = newsListTeaser.querySelectorAll(".cmp-teaser__content");
      newsItems.forEach((item) => {
        const title = item.querySelector(".cmp-teaser__title");
        const tagline = item.querySelector(".cmp-teaser__tagline");
        const imageCell = document.createDocumentFragment();
        const textCell = document.createDocumentFragment();
        textCell.appendChild(document.createComment(" field:text "));
        if (title) textCell.appendChild(title);
        if (tagline) textCell.appendChild(tagline);
        cells.push([imageCell, textCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-press", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/ey-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#cookie-modal",
        ".skip-content-wrapper",
        ".rich-text__read-more-btn",
        ".rich-text__read-less-btn",
        ".hidden-iframe"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        ".cmp-experiencefragment--header",
        ".cmp-experiencefragment--footer",
        "nav.cmp-navigation",
        '[id^="sitenav-sub-wrapper"]',
        "#sitenav-top",
        ".up-instant-search",
        ".global-search",
        "#search-result-mobile-view",
        "#search-result",
        ".pagemetadata-core",
        ".page-metadata-content",
        ".up-button_modal-container",
        ".unified-header__accessibility-text",
        ".up-instant-accessibility-hidden",
        "iframe",
        "noscript",
        "link"
      ]);
      element.querySelectorAll("[data-cmp-data-layer-enabled]").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-enabled");
      });
      element.querySelectorAll("[onclick]").forEach((el) => {
        el.removeAttribute("onclick");
      });
    }
  }

  // tools/importer/transformers/ey-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload || {};
      if (!template || !template.sections || template.sections.length < 2) return;
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document };
      const sections = template.sections;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (!section.selector) continue;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionEl = null;
        for (const sel of selectors) {
          sectionEl = element.querySelector(sel);
          if (sectionEl) break;
        }
        if (!sectionEl) continue;
        if (section.style) {
          const metaBlock = WebImporter.Blocks.createBlock(document, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(metaBlock);
        }
        if (i > 0) {
          const hr = document.createElement("hr");
          sectionEl.before(hr);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var PAGE_TEMPLATE = {
    name: "homepage",
    urls: [
      "https://www.ey.com/en_in"
    ],
    description: "EY India homepage with hero, featured content, service highlights, and promotional sections",
    blocks: [
      {
        name: "carousel-hero",
        instances: [".up-hero-carousel"]
      },
      {
        name: "cards-trending",
        instances: [".up-content-cards.up-content-cards__grid"]
      },
      {
        name: "cards-article",
        instances: [".up-content-grid"]
      },
      {
        name: "carousel-casestudy",
        instances: [".upCarousel .up-carousel"]
      },
      {
        name: "cards-press",
        instances: [".up-linked-content.five-cell-grid"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Carousel",
        selector: ".hero-v2",
        style: null,
        blocks: ["carousel-hero"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "Trending Now",
        selector: ".upContentCard.up-content-cards--dotted",
        style: "dark",
        blocks: ["cards-trending"],
        defaultContent: [".up-content-cards__title"]
      },
      {
        id: "section-3",
        name: "LinkedIn Banner",
        selector: ".upImage.component",
        style: "dark",
        blocks: [],
        defaultContent: [".cmp-image__link"]
      },
      {
        id: "section-4",
        name: "Our Latest Thinking",
        selector: ".upContentGrid.component",
        style: null,
        blocks: ["cards-article"],
        defaultContent: [".up-content-grid__title"]
      },
      {
        id: "section-5",
        name: "C-Suite Roles",
        selector: ".cmp-container--theme-dark-accented",
        style: "dark",
        blocks: [],
        defaultContent: ["h3", "h3 + p", ".up-button"]
      },
      {
        id: "section-6",
        name: "Featured Case Studies",
        selector: [".cmp-container--theme-dark-accented:nth-of-type(2)", ".up-carousel"],
        style: "dark",
        blocks: ["carousel-casestudy"],
        defaultContent: ["h3"]
      },
      {
        id: "section-7",
        name: "Newsletter Subscription",
        selector: ".cmp-container--theme-accented",
        style: "highlight",
        blocks: [],
        defaultContent: [".cmp-subscribe__title", ".cmp-subscribe__subtitle", ".cmp-subscribe__button"]
      },
      {
        id: "section-8",
        name: "Featured Press Releases",
        selector: ".up-linked-content.five-cell-grid",
        style: "dark",
        blocks: ["cards-press"],
        defaultContent: ["h3", ".up-button"]
      },
      {
        id: "section-9",
        name: "Discover More",
        selector: ".cmp-index-search-banner",
        style: "dark",
        blocks: [],
        defaultContent: [".cmp-index-search-banner__title", ".cmp-index-search-banner__searchButtons", ".cmp-index-search-banner__relatedTopicWrapper"]
      }
    ]
  };
  var parsers = {
    "carousel-hero": parse,
    "cards-trending": parse2,
    "cards-article": parse3,
    "carousel-casestudy": parse4,
    "cards-press": parse5
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
