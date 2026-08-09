# SummaryCard

A small metric card: a label, a large value, and a left accent border colored by theme
variant. Typically used in a row of KPI/summary cards at the top of a dashboard page.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | Small uppercase label above the value. |
| `value` | `React.ReactNode` | yes | — | The metric itself (usually a number or short string). |
| `variant` | `VariantColor` | yes | — | Accent color for the left border and the value text. |

## Usage

```tsx
import { SummaryCard } from 'lcano-react-ui';
import { Stack } from 'lcano-react-ui';

<Stack direction="row" gap="16px" wrap>
  <SummaryCard label="Total users" value={1234} variant="info" />
  <SummaryCard label="Active today" value={87} variant="success" />
  <SummaryCard label="Errors" value={3} variant="warning" />
</Stack>
```

## Notes

- Has `flex: 1; min-width: 180px` built in — designed to sit inside a wrapping flex row (e.g.
  [`Stack`](../Stack/README.md) with `wrap`), not to be used standalone at an arbitrary size.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
