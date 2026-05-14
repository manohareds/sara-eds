import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cols = [...row.children];
  const container = document.createElement('div');
  container.className = 'panel-images';

  cols.forEach((col) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'panel-image';
    const pic = col.querySelector('picture');
    if (pic) {
      const img = pic.querySelector('img');
      if (img) {
        pic.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '600' }]));
      }
    }
    while (col.firstChild) wrapper.append(col.firstChild);
    container.append(wrapper);
  });

  block.replaceChildren(container);
}
