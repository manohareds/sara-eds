export default function decorate(block) {
  const rows = [...block.children];
  const assets = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const imgEl = cols[0].querySelector('img');
      const meta = cols[1];
      const title = meta.querySelector('strong')?.textContent || '';
      const text = meta.textContent || '';
      let type = 'Images';
      if (text.includes('Video')) type = 'Videos';
      else if (text.includes('Document')) type = 'Documents';
      let status = 'Draft';
      if (text.includes('Approved')) status = 'Approved';
      else if (text.includes('Review')) status = 'Review';
      assets.push({
        img: imgEl ? imgEl.src : '',
        alt: imgEl ? imgEl.alt : title,
        title,
        type,
        size: text.match(/[\d.]+\s*[KMGT]?B/)?.[0] || '',
        date: text.match(/\d+\s*(days?|weeks?|months?)\s*ago/)?.[0] || '',
        status,
      });
    }
  });

  const types = ['Images', 'Videos', 'Documents', 'Audio'];
  const counts = {
    Images: 1243,
    Videos: 432,
    Documents: 876,
    Audio: 123,
  };
  const activeFilters = new Set(['Images']);

  function render() {
    const filtered = assets.filter((a) => activeFilters.size === 0 || activeFilters.has(a.type));

    block.innerHTML = `
      <div class="ab-layout">
        <aside class="ab-sidebar">
          <h4>Filters</h4>
          <label class="ab-search-label">Search
            <input type="text" placeholder="Search assets..." class="ab-search-input">
          </label>
          <div class="ab-filter-group">
            <p class="ab-filter-title">Asset Type</p>
            ${types.map((t) => `
              <label class="ab-checkbox">
                <input type="checkbox" value="${t}" ${activeFilters.has(t) ? 'checked' : ''}>
                <span>${t}</span>
                <span class="ab-count">${counts[t]}</span>
              </label>
            `).join('')}
          </div>
          <div class="ab-filter-group">
            <p class="ab-filter-title">Approval Status</p>
            <span class="ab-badge-approved">Approved only</span>
          </div>
          <div class="ab-actions">
            <button class="ab-btn-reset">Reset</button>
            <button class="ab-btn-apply">Apply</button>
          </div>
        </aside>
        <div class="ab-main">
          <p class="ab-results-count">Showing 1-${filtered.length} of ${filtered.length} results</p>
          <div class="ab-grid">
            ${filtered.map((a) => `
              <div class="ab-card">
                <div class="ab-card-img">
                  ${a.img ? `<img src="${a.img}" alt="${a.alt}" loading="lazy">` : '<div class="ab-placeholder"></div>'}
                </div>
                <div class="ab-card-info">
                  <p class="ab-card-title">${a.title}</p>
                  <div class="ab-card-meta">
                    <span>${a.type}</span>
                    <span>${a.size}</span>
                  </div>
                  <div class="ab-card-footer">
                    <span>${a.date}</span>
                    <span class="ab-status ab-status-${a.status.toLowerCase()}">${a.status}</span>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    block.querySelectorAll('.ab-checkbox input').forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) activeFilters.add(cb.value);
        else activeFilters.delete(cb.value);
        render();
      });
    });

    const resetBtn = block.querySelector('.ab-btn-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        activeFilters.clear();
        render();
      });
    }
  }

  render();
}
