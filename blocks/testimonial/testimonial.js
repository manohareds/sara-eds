export default function decorate(block) {
  const rows = [...block.children];
  const card = document.createElement('div');
  card.className = 'testimonial-card';

  rows.forEach((row) => {
    const cols = [...row.children];
    const item = document.createElement('div');

    if (cols[0]) {
      const text = cols[0].textContent.trim();
      if (text.startsWith('"') || text.length > 100) {
        item.className = 'testimonial-quote';
        item.innerHTML = `<span class="testimonial-icon">“</span>${cols[0].innerHTML}`;
      } else {
        item.className = 'testimonial-meta';
        item.innerHTML = cols[0].innerHTML;
      }
    }
    card.append(item);
  });

  block.replaceChildren(card);
}
