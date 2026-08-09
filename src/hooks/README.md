# Hooks

Two imperative helpers, each pairing a hook with the component it renders internally.

## `useConfirmModal`

Wraps [`ConfirmModal`](../components/ConfirmModal/README.md) so you can `await` a
confirmation instead of managing `isOpen`/`title`/`content` state yourself.

```ts
function useConfirmModal(): {
  confirm: (title: string, content: React.ReactNode) => Promise<boolean>;
  ConfirmModalComponent: JSX.Element;
};
```

- `confirm(title, content)` opens the modal and resolves to `true`/`false` depending on
  which button the user clicks.
- `ConfirmModalComponent` must be rendered somewhere in your tree (once) for the modal to
  actually appear.

```tsx
import { useConfirmModal } from 'lcano-react-ui';

const { confirm, ConfirmModalComponent } = useConfirmModal();

const handleDelete = async () => {
  const ok = await confirm('Delete item', 'This action cannot be undone.');
  if (ok) deleteItem();
};

return (
  <>
    <button onClick={handleDelete}>Delete</button>
    {ConfirmModalComponent}
  </>
);
```

## `useCopyFeedback`

Wraps `copyToClipboard` (a `utils` export) with a single auto-dismissing
[`ToastNotification`](../components/ToastNotification/README.md) reporting success/failure.

```ts
function useCopyFeedback(options?: {
  successMessage?: string; // default: 'Copiado!'
  errorMessage?: string;   // default: 'Falha ao copiar'
  durationMs?: number;     // default: 2500
}): {
  copy: (text: string) => Promise<boolean>;
  CopyFeedbackToast: JSX.Element | null;
};
```

```tsx
import { useCopyFeedback } from 'lcano-react-ui';

const { copy, CopyFeedbackToast } = useCopyFeedback({
  successMessage: 'Copied!',
  errorMessage: 'Could not copy',
});

return (
  <>
    <button onClick={() => copy(inviteLink)}>Copy link</button>
    {CopyFeedbackToast}
  </>
);
```

### Notes

- Default messages (`useConfirmModal`'s modal title/body, `useCopyFeedback`'s
  success/error messages) are in Portuguese — always pass your own strings if the consuming
  app isn't in Portuguese.
- Both hooks only manage **one** confirmation/toast at a time — calling `confirm()` again
  before the previous one resolves reuses the same modal instance.
