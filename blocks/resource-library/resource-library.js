export default function decorate(block) {
  const rows = [...block.children];
  const resources = [];

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length >= 2) {
      const imgEl = cols[0].querySelector('img');
      const meta = cols[1];
      const title = meta.querySelector('strong')?.textContent || '';
      const desc = meta.querySelectorAll('p');
      const text = meta.textContent || '';
      let type = 'Guides';
      if (text.includes('Webinar')) type = 'Webinars';
      else if (text.includes('Template')) type = 'Templates';
      const tags = desc[0]?.textContent.split('·').map((t) => t.trim()).filter((t) => t) || [];
      resources.push({
        img: imgEl ? imgEl.src : '',
        alt: imgEl ? imgEl.alt : title,
        title,
        description: desc[2]?.textContent || '',
        type,
        tags: tags.slice(0, 2),
        duration: desc[3]?.textContent || '',
      });
    }
  });

  const tabs = ['All', 'Guides', 'Templates', 'Webinars'];
  let activeTab = 'All';

  function render() {
    const filtered = activeTab === 'All' ? resources : resources.filter((r) => r.type === activeTab);

    block.innerHTML = `
      <div class="rl-header">
        <div class="rl-tabs">
          ${tabs.map((t) => `<button class="rl-tab ${t === activeTab ? 'rl-tab-active' : ''}" data-tab="${t}">${t}</button>`).join('')}
        </div>
        <div class="rl-search">
          <input type="text" placeholder="Search resources..." class="rl-search-input">
        </div>
      </div>
      <div class="rl-grid">
        ${filtered.map((r) => `
          <div class="rl-card">
            <div class="rl-card-img">
              ${r.img ? `<img src="${r.img}" alt="${r.alt}" loading="lazy">` : ''}
              <span class="rl-card-type">${(() => { if (r.type === 'Guides') return '📖 Guide'; if (r.type === 'Templates') return '📄 Template'; return '🎥 Webinar'; })()}</span>
            </div>
            <div class="rl-card-body">
              <div class="rl-card-tags">${r.tags.map((t) => `<span class="rl-tag">${t}</span>`).join('')}</div>
              <p class="rl-card-title">${r.title}</p>
              <p class="rl-card-desc">${r.description}</p>
              <div class="rl-card-footer">
                <span class="rl-card-duration">${r.duration}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    block.querySelectorAll('.rl-tab').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        render();
      });
    });
  }

  render();
}
