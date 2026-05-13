export default function decorate(block) {
  const rows = [...block.children];
  const wrapper = document.createElement('div');
  wrapper.className = 'activity-wrapper';

  const title = document.createElement('h4');
  title.className = 'activity-title';
  title.textContent = 'Recent Activity';

  const table = document.createElement('table');
  table.className = 'activity-table';

  rows.forEach((row, index) => {
    const cells = [...row.children];
    const tr = document.createElement('tr');

    cells.forEach((cell) => {
      const el = document.createElement(index === 0 ? 'th' : 'td');
      el.textContent = cell.textContent.trim();

      if (index > 0 && cells.indexOf(cell) === cells.length - 1) {
        const val = parseFloat(el.textContent);
        if (val >= 5) el.classList.add('rate-high');
        else if (val >= 2) el.classList.add('rate-mid');
        else el.classList.add('rate-low');
      }

      tr.append(el);
    });

    table.append(tr);
  });

  wrapper.append(title, table);
  block.replaceChildren(wrapper);
}
