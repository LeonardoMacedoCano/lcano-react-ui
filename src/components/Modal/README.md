# Modal

A generic centered modal dialog with a colored header (icon + title), scrollable content
area, and an optional actions row. [`ConfirmModal`](../ConfirmModal/README.md) is a
preconfigured confirm/cancel variant built on top of this.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | yes | — | Whether the modal is rendered at all (renders `null` when `false`). |
| `title` | `string` | yes | — | Header title. |
| `content` | `React.ReactNode` | yes | — | Body content. |
| `onClose` | `() => void` | yes | — | Called on overlay click and on the close button click. |
| `variant` | `VariantColor` | no | `'warning'` | Header background color from the theme. |
| `actions` | `React.ReactNode` | no | — | Rendered in a footer row (e.g. buttons), right-aligned. |
| `showCloseButton` | `boolean` | no | `true` | Shows/hides the "×" button in the header. |
| `closeButtonSize` | `string` | no | `'20px'` | Width/height of the close button. |
| `closeButtonHint` | `string` | no | `'Fechar'` | Tooltip on the close button. Defaults to Portuguese — pass your own if the consuming app isn't in Portuguese. |
| `modalWidth` | `string` | no | `'500px'` | CSS width of the modal box. |
| `maxWidth` | `string` | no | `'90%'` | CSS max-width of the modal box. |
| `modalHeight` | `string` | no | `'auto'` | CSS height of the modal box. |
| `icon` | `React.ReactNode` | no | `<FaExclamationTriangle />` | Icon rendered before the title. |

## Usage

```tsx
import { Modal, Button } from 'lcano-react-ui';

<Modal
  isOpen={isOpen}
  variant="info"
  title="Details"
  content={<p>Some content.</p>}
  onClose={() => setIsOpen(false)}
  actions={<Button description="Close" onClick={() => setIsOpen(false)} />}
/>
```

## Notes

- Clicking the overlay (outside the modal box) calls `onClose` — clicks inside the box are
  stopped from propagating.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
