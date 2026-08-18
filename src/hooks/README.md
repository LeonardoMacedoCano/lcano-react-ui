# Hooks

Two imperative helpers, each pairing a hook with the component it renders internally, plus
two standalone hooks with no rendered UI of their own.

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

## `useFullscreen`

Wraps the Fullscreen API (`document.documentElement.requestFullscreen`/`exitFullscreen`) with
React state that stays in sync even when fullscreen is exited some other way (e.g. the
browser's own Esc handling), by listening for `fullscreenchange`.

```ts
function useFullscreen(): {
  isFullscreen: boolean;
  toggle: () => void;
  isSupported: boolean;
};
```

```tsx
import { useFullscreen } from 'lcano-react-ui';

const { isFullscreen, toggle, isSupported } = useFullscreen();

return isSupported ? <button onClick={toggle}>{isFullscreen ? 'Exit' : 'Enter'} fullscreen</button> : null;
```

- `toggle()` and the effect listener are both no-ops when `isSupported` is `false` (e.g. iOS
  Safari) — always gate any fullscreen UI on `isSupported` rather than assuming it works.

## `useMediaQuery`

A thin `window.matchMedia` wrapper: returns whether a CSS media query currently matches, and
re-renders when it changes.

```ts
function useMediaQuery(query: string): boolean;
```

```tsx
import { useMediaQuery } from 'lcano-react-ui';

const isNarrow = useMediaQuery('(max-width: 640px)');
```

- Returns `false` during server-side rendering (no `window`) instead of throwing.
