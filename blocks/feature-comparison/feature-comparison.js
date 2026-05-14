export default function decorate(block) {
  const rows = [...block.children];
  const table = document.createElement('table');
  table.className = 'comparison-table';

  rows.forEach((row, index) => {
    const tr = document.createElement('tr');
    const cells = [...row.children];

    cells.forEach((cell) => {
      const el = document.createElement(index === 0 ? 'th' : 'td');
      const text = cell.textContent.trim();
      el.textContent = text;

      if (text === '✓') el.classList.add('check');
      else if (text === '✗') el.classList.add('cross');

      tr.append(el);
    });

    if (index === 0) {
      const thead = document.createElement('thead');
      thead.append(tr);
      table.append(thead);
    } else {
      let tbody = table.querySelector('tbody');
      if (!tbody) {
        tbody = document.createElement('tbody');
        table.append(tbody);
      }
      tbody.append(tr);
    }
  });

  block.replaceChildren(table);
}
