# Container

A generic themed `<div>` — the layout primitive most other components in this library
(`Panel`, `Loading`, `Tabs`, `Table`, `SearchFilterRSQL`, `SearchPagination`) are built on
top of.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — | Content. |
| `height` | `string` | no | `'auto'` | CSS height. |
| `width` | `string` | no | `'100%'` | CSS width. |
| `maxWidth` | `string` | no | `'none'` | CSS max-width. |
| `margin` | `string` | no | `'0'` | CSS margin. |
| `padding` | `string` | no | `'0'` | CSS padding. |
| `backgroundColor` | `string` | no | — | Raw CSS color. Ignored when `variantColor` is set. |
| `variantColor` | `VariantColor` | no | — | Background color from the theme; takes priority over `backgroundColor`. |
| `style` | `React.CSSProperties` | no | — | Extra inline styles. |

## Usage

```tsx
import { Container } from 'lcano-react-ui';

<Container variantColor="secondary" padding="16px" maxWidth="600px">
  <p>Content</p>
</Container>
```

## Notes

- `variantColor` and `backgroundColor` are mutually exclusive in effect: when both are set,
  `variantColor` wins.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
