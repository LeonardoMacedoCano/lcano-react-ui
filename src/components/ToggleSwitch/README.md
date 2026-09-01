# ToggleSwitch

A two-option segmented control (like an iOS-style toggle with labels instead of an on/off
switch). Generic over the option value type.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `optionA` | `ToggleSwitchOption<T>` (`{ label: string; value: T }`) | yes | — | First option. |
| `optionB` | `ToggleSwitchOption<T>` | yes | — | Second option. |
| `value` | `T` | yes | — | Currently selected value (must match `optionA.value` or `optionB.value`). |
| `onChange` | `(value: T) => void` | yes | — | Called with the clicked option's value. |
| `width` | `string` | no | `'auto'` | CSS width. |
| `maxWidth` | `string` | no | `'100%'` | CSS max-width. |
| `bordered` | `boolean` | no | `true` | When `false`, drops the container border. |
| `transparent` | `boolean` | no | `false` | When `true`, makes the container background transparent instead of `theme.colors.primary`. |

## Usage

```tsx
import { ToggleSwitch } from 'lcano-react-ui';

type Unit = 'metric' | 'imperial';
const [unit, setUnit] = useState<Unit>('metric');

<ToggleSwitch<Unit>
  optionA={{ label: 'Metric', value: 'metric' }}
  optionB={{ label: 'Imperial', value: 'imperial' }}
  value={unit}
  onChange={setUnit}
/>
```

## Notes

- Exactly two options by design (`optionA`/`optionB`) — for more than two, use
  [`Tabs`](../Tabs/README.md) or build a custom control instead.
- The two options always split the control's width evenly, so giving `width` (or letting a
  parent stretch it) grows the buttons rather than leaving empty space.
- `T` is constrained to `extends string` — numeric or object values aren't supported directly
  (stringify them if needed).
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
