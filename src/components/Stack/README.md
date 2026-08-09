# Stack

A flexbox layout primitive for arranging children in a row or column, with optional
alignment shortcuts, gap, wrapping, and dividers between items.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `children` | `ReactNode` | yes | — | Items to lay out. |
| `direction` | `'row' \| 'column'` | no | `'row'` | Flex direction. |
| `width` | `string` | no | `'100%'` | CSS width. |
| `height` | `string` | no | `'auto'` | CSS height. |
| `gap` | `string` | no | — | CSS `gap` between items. |
| `wrap` | `boolean` | no | `false` | Allows wrapping (`row` direction only). |
| `alignCenter` | `boolean` | no | `false` | `align-items: center`. |
| `alignRight` | `boolean` | no | `false` | `align-items: flex-end`. |
| `justifyCenter` | `boolean` | no | `false` | `justify-content: center`. |
| `justifyBetween` | `boolean` | no | `false` | `justify-content: space-between`. |
| `divider` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'x' \| 'y'` | no | — | Draws a 1px divider between items; see Notes for how the value maps to direction. |
| `style` | `CSSProperties` | no | — | Extra inline styles. |

## Usage

```tsx
import { Stack } from 'lcano-react-ui';

<Stack direction="row" gap="12px" alignCenter justifyBetween>
  <span>Left</span>
  <span>Right</span>
</Stack>

<Stack direction="column" divider="top" gap="8px">
  <Row1 />
  <Row2 />
  <Row3 />
</Stack>
```

## Notes

- `divider` only draws a line when it's compatible with `direction`: `'left'`/`'right'`/`'x'`
  apply in a `row` stack, `'top'`/`'bottom'`/`'y'` apply in a `column` stack. `'x'` in a row
  stack switches to CSS grid internally (`grid-auto-flow: column`) instead of flexbox, so
  every item gets equal width (`1fr`) — that's different from `'left'`/`'right'`, which stay
  flex and don't equalize widths.
- Divider color is fixed to `theme.colors.gray` — requires a styled-components
  `ThemeProvider` ancestor when `divider` is used, see the
  [main README](../../../README.md#theming).
