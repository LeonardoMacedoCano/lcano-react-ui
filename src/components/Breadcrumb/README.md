# Breadcrumb

A horizontally scrollable breadcrumb trail. Every item renders as plain text except the
last one is always bold (current page), and earlier items become links when both a `path`
and a `LinkComponent` are provided.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `BreadcrumbItem[]` | yes | — | Trail items, in order. Renders nothing if empty. |
| `LinkComponent` | `React.ElementType \| null` | no | `null` | Component used to render non-last items that have a `path` (e.g. your router's `Link`). Receives a `to` prop. Without it, every item renders as plain text. |

### `BreadcrumbItem`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `string` | yes | Text shown for the item. |
| `path` | `string` | no | Target route. Only used when `LinkComponent` is set and the item isn't the last one. |

## Usage

```tsx
import { Breadcrumb } from 'lcano-react-ui';
import { Link } from 'react-router-dom';

<Breadcrumb
  LinkComponent={Link}
  items={[
    { label: 'Home', path: '/' },
    { label: 'Settings', path: '/settings' },
    { label: 'Profile' },
  ]}
/>
```

## Notes

- Each item's label is truncated with an ellipsis past `160px`; the whole trail scrolls
  horizontally instead of wrapping.
- `LinkComponent` is generic on purpose — the library has no hard dependency on any router.
