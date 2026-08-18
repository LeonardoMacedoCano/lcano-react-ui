# Hooks

Two imperative helpers, each pairing a hook with the component it renders internally, plus
three standalone hooks with no rendered UI of their own.

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

## `useSyncedPreference`

A local-first preference: reads its initial value synchronously from a getter you provide
(e.g. `localStorage`), then — if `enabled` — fetches a JSON settings blob from `endpoint` and
adopts `field` from it, unless a local change already raced ahead in the meantime. Every
update writes the new value locally right away and, if `enabled`, `PUT`s (or `POST`s) it to
`endpoint` in the background.

```ts
function useSyncedPreference<T>(options: {
  field: string;
  get: () => T;
  set: (value: T) => void;
  toPayload: (value: T) => unknown;
  fromPayload: (raw: unknown) => T;
  endpoint: string;
  enabled: boolean;
  cacheKey?: string;              // dedupes the GET across hook instances sharing the same endpoint; default ''
  method?: 'PUT' | 'POST';        // default 'PUT'
  onSaved?: (response: Record<string, unknown>) => void; // called with the parsed response after a successful save
}): { value: T; updateValue: (next: T) => void };
```

```tsx
import { useSyncedPreference } from 'lcano-react-ui';

const { value: quality, updateValue: setQuality } = useSyncedPreference<GraphicsQuality>({
  field: 'graphicsQuality',
  get: getStoredGraphicsQuality,
  set: setStoredGraphicsQuality,
  toPayload: (v) => v,
  fromPayload: (raw) => (isGraphicsQuality(raw) ? raw : DEFAULT_GRAPHICS_QUALITY),
  endpoint: '/api/settings/me',
  enabled: !!currentUser,
  cacheKey: currentUser?.id,
  onSaved: (response) => {
    if (Array.isArray(response.unlockedAchievements)) notifyUnlocks(response.unlockedAchievements);
  },
});
```

- The GET to `endpoint` is deduped across every hook instance that shares the same
  `endpoint`+`cacheKey` pair (e.g. several fields all read from one settings blob) — it fires
  once, not once per field.
- `field` is a plain `string`, not constrained to keys of some fixed response type — the hook
  doesn't know or care about the shape of your settings blob beyond `response[field]`.
- Only `updateValue`'s local `set(next)` runs when `enabled` is `false` — no network request is
  made, so this is safe to use before a user is authenticated (flip `enabled` to `true` later
  and the next mount's effect will fetch and reconcile).
- `onSaved` is your hook into "the server responded with something extra" (like newly
  unlocked achievements) — there's no built-in notification mechanism, wire it to your own
  toast/queue.
