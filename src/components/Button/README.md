# Button

A themed button that works both as an icon-only button and as an icon+label button. Extends
`React.ButtonHTMLAttributes<HTMLButtonElement>`, so any native `<button>` prop (`onClick`,
`type`, `disabled`, ...) is accepted too.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `variant` | `VariantColor` | no | — | Background color from the theme (`primary`, `secondary`, `tertiary`, `quaternary`, `success`, `info`, `warning`). Unset = transparent background. |
| `width` | `string` | no | `'auto'` | CSS width. |
| `height` | `string` | no | `'auto'` | CSS height. |
| `icon` | `React.ReactNode` | no | — | Icon rendered before the label. |
| `description` | `string` | no | — | Label text. When set, the button also gets padding and a border. |
| `hint` | `string` | no | — | Tooltip (`title`). |
| `disabledHover` | `boolean` | no | `false` | When `true`, suppresses the opacity change on hover (useful for a button that looks disabled but must stay clickable/focusable). |
| `style` | `React.CSSProperties` | no | — | Extra inline styles, merged in after the variant styles. |
| ...rest | `ButtonHTMLAttributes<HTMLButtonElement>` | no | — | Forwarded to the native `<button>` (`onClick`, `disabled`, `type`, ...). |

## Usage

```tsx
import { Button } from 'lcano-react-ui';
import { FaSave } from 'react-icons/fa';

// Icon-only
<Button icon={<FaSave />} hint="Save" onClick={handleSave} />

// Icon + label, themed
<Button
  variant="success"
  icon={<FaSave />}
  description="Save"
  width="120px"
  height="36px"
  onClick={handleSave}
/>
```

## Notes

- `VariantColor` is shared across the library (`Button`, `Container`, `Modal`,
  `HighlightBox`, `FieldValue`, `FieldTextArea`, ...) — it always maps to
  `theme.colors.<variant>`.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
