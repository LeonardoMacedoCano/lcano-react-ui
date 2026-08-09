# FieldTextArea

A labeled, auto-growing `<textarea>` — the multi-line counterpart to
[`FieldValue`](../FieldValue/README.md). Height adjusts to content automatically as the user
types.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | no | `''` | Current text. |
| `variant` | `VariantColor` | no | — | Text color from the theme. |
| `description` | `string` | no | — | Label shown above/beside the textarea. |
| `hint` | `string` | no | — | Tooltip (`title`) on the label. |
| `editable` | `boolean` | no | `true` | When `false`, the field is read-only and disabled. |
| `width` | `string` | no | `'100%'` | CSS width of the field wrapper. |
| `maxWidth` | `string` | no | `'100%'` | CSS max-width of the field wrapper. |
| `maxLength` | `number` | no | `500` | Max character count (native `maxLength`). |
| `minRows` | `number` | no | `1` | Initial `rows` before auto-grow kicks in. |
| `inline` | `boolean` | no | `false` | Lays the label and the textarea out in a row instead of stacked. |
| `padding` | `string` | no | `'5px'` | CSS padding of the field wrapper. |
| `placeholder` | `string` | no | — | Placeholder text. |
| `onUpdate` | `(value: string) => void` | no | — | Called on every change with the new text. |

## Usage

```tsx
import { useState } from 'react';
import { FieldTextArea } from 'lcano-react-ui';

const [notes, setNotes] = useState('');

<FieldTextArea
  description="Notes"
  value={notes}
  onUpdate={setNotes}
  maxLength={1000}
/>
```

## Notes

- The component is `React.memo`-wrapped; pass stable callbacks (e.g. via `useCallback`) if
  you notice it not re-rendering when expected from a prop other than `value`.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
