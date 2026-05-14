export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'card-grid-wrapper';

  const grid = document.createElement('div');
  grid.className = 'card-grid';

  rows.forEach((row) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'card-grid-item';

    const iconWrapper = document.createElement('div');
    iconWrapper.className = 'card-grid-icon-circle';

    const icon = cols[0]?.querySelector('.icon, img');
    if (icon) {
      iconWrapper.append(icon.cloneNode(true));
    } else {
      iconWrapper.innerHTML = '<span class="card-grid-icon-placeholder">i</span>';
    }

    const content = document.createElement('div');
    content.className = 'card-grid-content';

    if (cols[1]) {
      content.innerHTML = cols[1].innerHTML;
    }

    card.append(iconWrapper, content);
    grid.append(card);
  });

  wrapper.append(grid);
  block.replaceChildren(wrapper);
}
