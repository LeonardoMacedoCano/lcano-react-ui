# PaginatedGrid

A CSS-grid layout that paginates itself by **rows**, not a fixed item count: it measures its
own container width with a `ResizeObserver`, works out how many columns currently fit, and
sets the page size to `columns * rowsPerPage` — so resizing the window from 3 columns down to
1 also reduces the page size, instead of leaving a page with three empty slots per row.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `T[]` | yes | — | Full (unpaginated) item list — pagination happens entirely client-side. |
| `keyExtractor` | `(item: T) => string \| number` | yes | — | React key per item. |
| `renderItem` | `(item: T) => ReactNode` | yes | — | Renders one grid cell. |
| `emptyMessage` | `string` | yes | — | Shown instead of the grid when `items` is empty. |
| `rowsPerPage` | `number` | no | `3` | How many full rows make up one page, at the current column count. |
| `minItemWidth` | `string` | no | `'240px'` | Minimum width per grid cell (`grid-template-columns: repeat(auto-fill, minmax(minItemWidth, 1fr))`) — also what column-count measurement is based on. |

## Usage

```tsx
import { PaginatedGrid, SummaryCard } from 'lcano-react-ui';

<PaginatedGrid
  items={products}
  keyExtractor={(p) => p.id}
  minItemWidth="260px"
  rowsPerPage={2}
  emptyMessage="No products yet."
  renderItem={(p) => <SummaryCard title={p.name} value={p.price} />}
/>
```

## Notes

- Pagination controls ([`SearchPagination`](../SearchPagination/README.md)) only render when
  there's more than one page; with few enough items to fit on one page, you just get the grid.
- The page resets to `0` whenever `items` or the computed page size changes (e.g. filtering
  the list, or resizing across a column-count breakpoint).
- `emptyMessage` has no default and no `locale` prop — pass your own translated string.
- `PaginatedGridContainer`, `PaginatedGridEmpty` are also exported individually.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
