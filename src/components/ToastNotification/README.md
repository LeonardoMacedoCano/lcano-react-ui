# ToastNotification

A single fixed-position toast card (icon + message + close button), colored by `type`. For
managing a queue of toasts app-wide instead of rendering one manually, see
[`ContextMessageProvider`/`useMessage`](../../contexts/README.md#contextmessageprovider--usemessage).

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `type` | `ToastType` (`'error' \| 'success' \| 'info'`) | yes | — | Determines the icon and color: `error` → warning icon/color, `success` → success icon/color, `info` → info icon/color. |
| `message` | `string` | yes | — | Toast text. |
| `onClose` | `() => void` | yes | — | Called when the close ("×") button is clicked. |

## Usage

```tsx
import { ToastNotification } from 'lcano-react-ui';

<ToastNotification
  type="success"
  message="Saved successfully."
  onClose={() => setToast(null)}
/>
```

## Notes

- Fixed position (`top: 20px; right: 20px`), no built-in auto-dismiss timer or stacking of
  multiple toasts — rendering more than one `ToastNotification` at the same time will make
  them overlap. Use `useCopyFeedback` (auto-dismiss, single toast) or
  `ContextMessageProvider`/`useMessage` (queue, auto-dismiss, stacking) for that behavior.
- `type="error"` visually uses the theme's `warning` color/icon (there's no separate "error"
  color in the theme) — this is intentional, not a typo.
- `ToastContainer`, `ToastCard`, `ToastIcon`, `ToastMessage`, `CloseButton` are also exported
  individually, in case you need to compose a custom toast-like layout.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
