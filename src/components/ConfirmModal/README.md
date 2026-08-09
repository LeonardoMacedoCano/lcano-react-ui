# ConfirmModal

A [`Modal`](../Modal/README.md) preconfigured as a confirm/cancel dialog, with a cancel
button and a confirm button wired up automatically. For imperative usage (`await confirm(...)`
instead of managing `isOpen` yourself), see the [`useConfirmModal`](../../hooks/README.md#useconfirmmodal)
hook.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `isOpen` | `boolean` | yes | — | Whether the modal is visible. |
| `title` | `string` | yes | — | Modal title. |
| `content` | `React.ReactNode` | yes | — | Modal body. |
| `onClose` | `() => void` | yes | — | Called when cancelling (also called right after confirming). |
| `onConfirm` | `() => void` | yes | — | Called when confirming, before `onClose`. |
| `modalWidth` | `string` | no | `'400px'` | Modal width, forwarded to `Modal`. |
| `variantPrimary` | `VariantColor` | no | `'warning'` | Variant for the modal header and the confirm button. |
| `variantSecondary` | `VariantColor` | no | `'secondary'` | Variant for the cancel button. |
| `confirmLabel` | `string` | no | `'ACEITAR'` | Confirm button label. |
| `cancelLabel` | `string` | no | `'CANCELAR'` | Cancel button label. |
| `confirmButtonProps` | `React.ComponentProps<typeof Button>` | no | — | Extra props merged into the confirm `Button`. |
| `cancelButtonProps` | `React.ComponentProps<typeof Button>` | no | — | Extra props merged into the cancel `Button`. |

## Usage

```tsx
import { useState } from 'react';
import { ConfirmModal } from 'lcano-react-ui';

const [isOpen, setIsOpen] = useState(false);

<ConfirmModal
  isOpen={isOpen}
  title="Delete item"
  content={<p>This action cannot be undone.</p>}
  confirmLabel="Delete"
  cancelLabel="Cancel"
  variantPrimary="warning"
  onClose={() => setIsOpen(false)}
  onConfirm={() => deleteItem()}
/>
```

## Notes

- `confirmLabel`/`cancelLabel` default to Portuguese strings (`'ACEITAR'`/`'CANCELAR'`) —
  always pass your own labels if the consuming app isn't in Portuguese.
- `showCloseButton` on the underlying `Modal` is forced to `false` (no "×" button) — closing
  only happens via the cancel/confirm buttons or `onClose`.
