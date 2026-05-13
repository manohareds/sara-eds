export default function decorate(block) {
  const cards = [...block.children];
  const container = document.createElement('div');
  container.className = 'stats-grid';

  cards.forEach((row) => {
    const card = document.createElement('div');
    card.className = 'stat-card';

    const cols = [...row.children];
    if (cols.length >= 1) {
      const label = document.createElement('div');
      label.className = 'stat-label';
      const value = document.createElement('div');
      value.className = 'stat-value';
      const change = document.createElement('div');

      const lines = cols[0].innerHTML.split('<br>').map((l) => l.trim()).filter(Boolean);
      if (lines[0]) label.textContent = lines[0].replace(/<[^>]*>/g, '');
      if (lines[1]) value.textContent = lines[1].replace(/<[^>]*>/g, '');
      if (lines[2]) {
        const text = lines[2].replace(/<[^>]*>/g, '');
        change.textContent = text;
        change.className = text.startsWith('↑') ? 'stat-change positive' : 'stat-change negative';
      }

      const icon = document.createElement('div');
      icon.className = 'stat-icon';
      if (cols[1]) {
        icon.innerHTML = cols[1].innerHTML;
      }

      const header = document.createElement('div');
      header.className = 'stat-header';
      header.append(label, icon);

      card.append(header, value, change);
    }
    container.append(card);
  });

  block.replaceChildren(container);
}
