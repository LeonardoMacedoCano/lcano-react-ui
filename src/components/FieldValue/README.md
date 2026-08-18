# FieldValue

A single labeled input that adapts its rendering and value parsing to a `type` — text,
number (with digit limits), boolean/select dropdown, or date — instead of picking a
different component per data type. Used internally by
[`SearchFilterRSQL`](../SearchFilterRSQL/README.md) and
[`SearchSelectField`](../SearchSelectField/README.md).

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | `FieldValueType` (`'STRING' \| 'NUMBER' \| 'BOOLEAN' \| 'DATE' \| 'MONTH' \| 'SELECT'`) | yes | — | Controls both the rendered input and how `onUpdate` values are parsed. |
| `value` | `string \| number \| boolean \| Option` | no | `''` | Current value. |
| `variant` | `VariantColor` | no | — | Text color from the theme. |
| `description` | `string` | no | — | Label shown beside/above the input. |
| `hint` | `string` | no | — | Tooltip (`title`) on the label. |
| `editable` | `boolean` | no | `true` | When `false`, renders read-only/disabled. |
| `width` | `string` | no | `'100%'` | CSS width of the field wrapper. |
| `maxWidth` | `string` | no | `'100%'` | CSS max-width of the field wrapper. |
| `maxHeight` | `string` | no | `'none'` | CSS max-height of the field wrapper. |
| `minValue` / `maxValue` | `number` | no | — | Clamp for `type="NUMBER"`. |
| `inputWidth` | `string` | no | `'100%'` | CSS width of the input/select itself. |
| `inline` | `boolean` | no | `false` | Lays the label and the input out in a row instead of stacked. |
| `options` | `Option[]` (`{ key: string; value: string }[]`) | required for `type="SELECT"` | — | Options rendered in the `<select>`. |
| `icon` | `React.ReactNode` | no | — | Icon rendered before the input (text/number/date types only). |
| `padding` | `string` | no | `'5px'` | CSS padding of the field wrapper. |
| `placeholder` | `string` | no | — | Placeholder text, or the "select" prompt for `type="SELECT"`. |
| `maxDecimalPlaces` | `number` | no | `2` | Decimal digits allowed for `type="NUMBER"`. |
| `maxIntegerDigits` | `number` | no | `8` | Integer digits allowed for `type="NUMBER"`. |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | `'pt'` | Thousand/decimal separators used to display `type="NUMBER"` values (`1.234,56` for `pt`, `1,234.56` for `en`). |
| `numberFormat` | `NumberFormatStyle` (`'grouped' \| 'plain'`) | no | `'grouped'` | `'grouped'` shows the locale-formatted value while the field isn't focused; `'plain'` keeps the raw unformatted number (previous default behavior). |
| `onUpdate` | `(value: any) => void` | no | — | Called with the parsed value (`number` for `NUMBER`, `boolean` for `BOOLEAN`, `Date` for `DATE`, raw string otherwise). |
| `onKeyDown` | `React.KeyboardEventHandler<HTMLInputElement>` | no | — | Forwarded to the input (not applied to `SELECT`/`BOOLEAN`, which render a `<select>`). |

## Usage

```tsx
import { useState } from 'react';
import { FieldValue } from 'lcano-react-ui';

const [name, setName] = useState('');
const [age, setAge] = useState<number>();

<FieldValue type="STRING" description="Name" value={name} onUpdate={setName} />

<FieldValue
  type="NUMBER"
  description="Age"
  value={age}
  minValue={0}
  maxValue={120}
  onUpdate={setAge}
/>

<FieldValue
  type="SELECT"
  description="Status"
  value={{ key: 'active', value: 'Active' }}
  options={[
    { key: 'active', value: 'Active' },
    { key: 'inactive', value: 'Inactive' },
  ]}
  onUpdate={setStatus}
/>
```

## Notes

- `type="BOOLEAN"` renders a `<select>` with fixed "Sim"/"Não" options (Portuguese) — swap
  the value labels yourself if the consuming app isn't in Portuguese, e.g. by using
  `type="SELECT"` with your own `options` instead.
- `type="MONTH"` is accepted for parsing/formatting purposes but renders the same as
  `STRING`/`NUMBER`; there's no dedicated month picker UI.
- `type="NUMBER"` always renders as a text input (`inputMode="decimal"`) so it can display
  grouped values; while focused it shows the raw editable number, and reformats on blur.
  `onUpdate` still always receives a plain `"1234.56"`-style string regardless of `locale`.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
