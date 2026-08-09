# Contexts

## `ContextMessageProvider` / `useMessage`

An app-wide toast queue: mount the provider once, then call `useMessage()` from anywhere in
the tree to show a [`ToastNotification`](../components/ToastNotification/README.md) without
managing its state yourself. Multiple toasts stack (each auto-dismisses after 5s), unlike
using `ToastNotification` directly.

```ts
function useMessage(): {
  showError: (message: string) => void;
  showErrorWithLog: (message: string, error: any) => void; // also console.error(message, error)
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
};
```

## Usage

```tsx
import { ContextMessageProvider, useMessage } from 'lcano-react-ui';

// once, near the root of the app
<ContextMessageProvider>
  <App />
</ContextMessageProvider>

// anywhere inside <App />
function SaveButton() {
  const { showSuccess, showErrorWithLog } = useMessage();

  const handleSave = async () => {
    try {
      await save();
      showSuccess('Saved.');
    } catch (error) {
      showErrorWithLog('Failed to save.', error);
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

## Notes

- `useMessage()` throws if called outside a `ContextMessageProvider` — make sure the
  provider wraps every component that calls it.
- Toasts auto-dismiss after a fixed 5 seconds; there's no per-call override (unlike
  `useCopyFeedback`'s `durationMs`, see [hooks](../hooks/README.md#usecopyfeedback)).
- `showErrorWithLog` appends a fixed Portuguese suffix ("Consulte o log para mais
  detalhes!") to the shown message — if the consuming app isn't in Portuguese, prefer
  `showError` and log separately yourself.
- Requires a styled-components `ThemeProvider` ancestor (for the rendered toasts), see the
  [main README](../../README.md#theming).
