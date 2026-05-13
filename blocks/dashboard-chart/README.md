# Dashboard Chart Block

Renders a line chart using Chart.js for traffic/analytics data visualization.

## Purpose

Displays time-series data as a styled line chart with gradient fill, matching SaaS dashboard designs. Loads Chart.js from CDN on demand.

## Authoring

First row is the chart title, subsequent rows are label-value pairs:

| Dashboard Chart | |
|---|---|
| Traffic Trends | |
| Jan | 4000 |
| Feb | 3200 |
| Mar | 4800 |

## Behavior

- Chart.js loaded lazily from CDN only when block is rendered
- Responsive canvas that adjusts to container width
- Gradient fill under the line, styled data points
- Tooltips show formatted visitor counts
- "Last 7 days" badge in header
