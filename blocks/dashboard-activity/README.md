# Dashboard Activity Block

Displays recent page activity data in a styled table format.

## Purpose

Shows a data table with page analytics (visitors, conversions, rates) for a SaaS dashboard.

## Authoring

First row is the table header, subsequent rows are data:

| Page | Visitors | Conversions | Rate |
|------|----------|-------------|------|
| /landing | 12,453 | 234 | 1.88% |

## Behavior

- First row becomes table headers
- Rate column is color-coded: green (≥5%), amber (≥2%), red (<2%)
- Table scrolls horizontally on mobile
