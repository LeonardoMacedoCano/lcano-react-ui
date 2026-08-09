# Table

A data table with a JSX `<Column>` declaration API (similar to PrimeReact/AntD), built-in
pagination (accepts either a plain array or a `PagedResponse`), hover-reveal row actions
(view/edit/delete/custom), and automatic responsive stacking into cards on narrow screens.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `values` | `T[] \| PagedResponse<T>` | yes | — | Row data. Pass a `PagedResponse` (see [`SearchPagination`](../SearchPagination/README.md#pagedresponset)) to get built-in pagination controls. |
| `columns` | `ReactNode[]` | yes | — | A list of `<Column .../>` elements (see below). Any other element is ignored. |
| `keyExtractor` | `(item: T, index?: number) => string \| number` | yes | — | React key per row. |
| `messageEmpty` | `string` | no | — | Message shown when there's no data. |
| `onClickRow` | `(item: T, index?: number) => void` | no | — | Row click handler. |
| `rowSelected` | `(item: T) => boolean` | no | — | Marks a row as selected (colored left accent bar). |
| `loadPage` | `(pageIndex: number, pageSize: number) => void` | no | — | Enables pagination controls; only rendered when `values` is a `PagedResponse` with `totalElements > 0`. |
| `onView` / `onEdit` / `onDelete` | `(item: T) => void` | no | — | Each adds its own hover-revealed action button on the row. |
| `customActions` | `(item: T) => ReactNode` | no | — | Extra action content rendered before view/edit/delete. |
| `viewHint` | `string` | no | `'Visualizar'` | Tooltip on the view action button. Defaults to Portuguese — pass your own if the consuming app isn't in Portuguese. `onEdit`/`onDelete` buttons have no tooltip at all (not just a PT default). |
| `rowHeight` | `string` | no | `'35px'` | Row height (desktop layout only). |
| `clickableRows` | `boolean` | no | `false` | Shows a pointer cursor and `rowClickHint` tooltip on rows. |
| `rowClickHint` | `string` | no | — | Tooltip shown on rows when `clickableRows` is `true`. |
| `stackBelow` | `string` | no | `'700px'` | Viewport width below which the table switches from a `<table>` layout to stacked cards (one per row, `data-label` prefixes per cell). |

### `<Column>`

Declared as JSX children of `columns`, one per column — `Column` itself renders nothing, it's
read via `column.props`:

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `header` | `ReactNode` | yes | — | Column header content. |
| `value` | `(value: T, index: number) => ReactNode` | yes | — | Cell renderer for each row. |
| `width` | `string` | no | `'auto'` | Column width (desktop layout). |
| `align` | `'left' \| 'center' \| 'right'` | no | `'left'` | Cell text alignment. |
| `titleAlign` | `'left' \| 'center' \| 'right'` | no | `'center'` | Header text alignment. |
| `wrap` | `boolean` | no | `false` | Allows the cell content to wrap instead of being truncated with an ellipsis. |
| `stackLabel` | `string` | no | `header` (if it's a string) | Label prefix used in the stacked (mobile) layout instead of `header`. |

## Usage

```tsx
import { Table, Column } from 'lcano-react-ui';

<Table<User>
  values={users}
  keyExtractor={(user) => user.id}
  messageEmpty="No users found."
  onView={(user) => openDetails(user)}
  onEdit={(user) => openEdit(user)}
  onDelete={(user) => confirmDelete(user)}
  columns={[
    <Column key="name" header="Name" value={(user) => user.name} />,
    <Column key="email" header="Email" value={(user) => user.email} wrap />,
    <Column key="status" header="Status" align="center" value={(user) => user.status} />,
  ]}
/>

// With server-side pagination:
<Table<User>
  values={pagedUsers}
  loadPage={(pageIndex, pageSize) => fetchUsers(pageIndex, pageSize)}
  keyExtractor={(user) => user.id}
  columns={[/* ... */]}
/>
```

## Notes

- `columns` is a plain array, not real React children rendering — elements that aren't a
  valid `<Column>` element are silently skipped, so conditional columns work fine
  (`someFlag && <Column ... />` inside the array).
- Action buttons only become visible on row hover on desktop; on the stacked (mobile) layout
  below `stackBelow`, they're always visible instead (there's no hover on touch).
- `stackLabel` only matters below `stackBelow` — above it, `header` is what's shown in the
  `<thead>` regardless.
