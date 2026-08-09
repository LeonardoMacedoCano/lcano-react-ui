# SearchPagination

Pagination controls (first/previous/next/last + "page X / Y") for a Spring-style
`PagedResponse`. Used internally by [`Table`](../Table/README.md) when its `values` prop is
paged, but usable standalone too.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `page` | `PagedResponse<any>` | yes | — | Current page metadata (`number`, `totalPages`, `size`, ...). |
| `loadPage` | `(pageIndex: number, pageSize: number) => void` | yes | — | Called with the target 0-based page index and the current page size when a control is clicked. |
| `height` | `string` | no | — | CSS height. |
| `width` | `string` | no | — | CSS width. |

### `PagedResponse<T>`

```ts
interface PagedResponse<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  first: boolean;
  number: number; // current page index, 0-based
  numberOfElements: number;
}
```

## Usage

```tsx
import { SearchPagination } from 'lcano-react-ui';

<SearchPagination
  page={pagedResponse}
  loadPage={(pageIndex, pageSize) => fetchPage(pageIndex, pageSize)}
/>
```

## Notes

- First/previous controls are disabled (dimmed, `cursor: not-allowed`) on the first page;
  next/last are disabled on the last page — `loadPage` is a no-op if you click a disabled
  control regardless, this is just visual.
- `page.number` is treated as the source of truth and re-synced via `useEffect` whenever the
  `page` prop changes — safe to control the current page entirely from the parent's fetch
  response.
