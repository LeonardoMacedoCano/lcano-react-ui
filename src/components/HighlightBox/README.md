# HighlightBox

A centered, pill-shaped box that colors its content by theme variant — typically used for a
status badge, a count, or a short highlighted label.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `variant` | `VariantColor` | no | `'info'` | Text (and optional border) color from the theme. |
| `width` | `string` | no | `'100%'` | CSS width. |
| `height` | `string` | no | `'100%'` | CSS height. |
| `bordered` | `boolean` | no | `false` | Adds a `1px solid` border in the variant color. |
| `style` | `React.CSSProperties` | no | — | Extra inline styles on the box itself. |
| `children` | `React.ReactNode` | no | — | Content. |

## Usage

```tsx
import { HighlightBox } from 'lcano-react-ui';

<HighlightBox variant="success" bordered width="80px" height="28px">
  Active
</HighlightBox>
```

## Notes

- The box has no background color by default (`background-color: transparent`) — it only
  colors text and, optionally, the border.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
