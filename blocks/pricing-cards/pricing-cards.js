export default function decorate(block) {
  const rows = [...block.children];
  const grid = document.createElement('div');
  grid.className = 'pricing-grid';

  rows.forEach((row, index) => {
    const cols = [...row.children];
    const card = document.createElement('div');
    card.className = 'pricing-card';
    if (index === 1) card.classList.add('pricing-card-featured');

    const header = document.createElement('div');
    header.className = 'pricing-card-header';

    const body = document.createElement('div');
    body.className = 'pricing-card-body';

    const footer = document.createElement('div');
    footer.className = 'pricing-card-footer';

    if (cols[0]) {
      header.innerHTML = cols[0].innerHTML;
    }

    if (cols[1]) {
      body.innerHTML = cols[1].innerHTML;
    }

    if (cols[2]) {
      footer.innerHTML = cols[2].innerHTML;
    }

    card.append(header, body, footer);
    grid.append(card);
  });

  block.replaceChildren(grid);
}
