async function loadChart() {
  if (!window.Chart) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
}

export default async function decorate(block) {
  const rows = [...block.children];

  let title = 'Traffic Trends';
  const labels = [];
  const values = [];

  rows.forEach((row, index) => {
    const cols = [...row.children];
    if (index === 0 && cols.length === 1) {
      title = cols[0].textContent.trim();
    } else if (cols.length >= 2) {
      labels.push(cols[0].textContent.trim());
      values.push(parseFloat(cols[1].textContent.trim().replace(/,/g, '')) || 0);
    }
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'chart-wrapper';

  const header = document.createElement('div');
  header.className = 'chart-header';

  const heading = document.createElement('h4');
  heading.className = 'chart-title';
  heading.textContent = title;

  const badge = document.createElement('span');
  badge.className = 'chart-badge';
  badge.textContent = 'Last 7 days';

  header.append(heading, badge);

  const canvasContainer = document.createElement('div');
  canvasContainer.className = 'chart-canvas-container';

  const canvas = document.createElement('canvas');
  canvas.id = `chart-${Date.now()}`;
  canvasContainer.append(canvas);

  wrapper.append(header, canvasContainer);
  block.replaceChildren(wrapper);

  await loadChart();

  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(37, 99, 235, 0.15)');
  gradient.addColorStop(1, 'rgba(37, 99, 235, 0.01)');

  /* eslint-disable no-new */
  new window.Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data: values,
        borderColor: '#2563eb',
        backgroundColor: gradient,
        borderWidth: 2,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#2563eb',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 10,
          cornerRadius: 6,
          callbacks: {
            label: (context) => `${context.parsed.y.toLocaleString()} visitors`,
          },
        },
      },
      scales: {
        x: {
          grid: { color: '#f1f5f9' },
          ticks: { color: '#94a3b8', font: { size: 12 } },
        },
        y: {
          grid: { color: '#f1f5f9' },
          ticks: {
            color: '#94a3b8',
            font: { size: 12 },
            callback: (val) => val.toLocaleString(),
          },
          beginAtZero: true,
        },
      },
    },
  });
}
