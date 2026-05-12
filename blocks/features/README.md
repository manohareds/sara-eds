# Features Block

A responsive card grid block for showcasing product or service features.

## Purpose

Displays feature highlights in a visually appealing grid layout. Each card supports an image (or icon) paired with a heading and description.

## Authoring

Authors create a table with "Features" as the header. Each row represents a card with two columns:

| Column 1 | Column 2 |
|-----------|----------|
| Image or Icon | Heading + description text |

## Configuration

- **Default variant**: 3-column grid on desktop, 2 on tablet, 1 on mobile
- Cards support images (`picture` elements) or SVG icons (`span.icon`)

## Behavior

- Block transforms authored rows into a semantic `ul`/`li` list
- Images are optimized via `createOptimizedPicture`
- Cards have a subtle hover shadow effect
- Fully responsive with CSS Grid and `min-width` breakpoints at 600px and 900px
