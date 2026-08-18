# ToastStack

An app-wide, stacking, auto-dismissing notification queue — richer than
[`ToastNotification`](../ToastNotification/README.md) (icon + eyebrow + title + description,
click-to-activate, multiple toasts stack instead of overlapping). Built for "something just
happened, here's what" moments — an unlocked achievement, a completed background job, an
incoming invite — where you want more than a one-line message.

## Setup

`ToastStackProvider` holds the queue; `useToastStack()` pushes to it from anywhere in the
tree; `ToastStack` renders the fixed-position stack. Mount the provider near the root and the
stack wherever you want it rendered (it's `position: fixed`, so placement in the tree doesn't
affect layout):

```tsx
import { ToastStackProvider, ToastStack } from 'lcano-react-ui';

<ToastStackProvider>
  <App />
  <ToastStack locale="en" onItemClick={(item) => navigate('/inbox')} />
</ToastStackProvider>
```

```tsx
import { useToastStack } from 'lcano-react-ui';

function SomeDeepComponent() {
  const { notify } = useToastStack();

  const handleUnlock = (unlocked: { name: string; description: string; icon: string }[]) => {
    notify(
      unlocked.map((a) => ({
        icon: a.icon,
        eyebrow: 'Achievement unlocked',
        title: a.name,
        description: a.description,
      }))
    );
  };
}
```

## Props

### `ToastStackItem`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | Rendered at ~1.8em — an emoji string works, so does an icon component. |
| `title` | `string` | yes | Main line. |
| `description` | `string` | no | Secondary line below the title. |
| `eyebrow` | `string` | no | Small uppercase label above the title (e.g. `"Achievement unlocked"`). Omit for a plainer toast. |

`notify(items: ToastStackItem[])` (from `useToastStack()`) assigns each item an internal `id`
and appends it to the queue — call it with as many items as unlocked at once.

### `ToastStack`

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `onItemClick` | `(item: ToastStackItem) => void` | no | — | Called when a toast is clicked/activated (Enter/Space); the toast also dismisses itself. Omit to make toasts non-interactive (close button still works). |
| `autoDismissMs` | `number` | no | `6000` | Time before a toast dismisses itself. |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | `'pt'` | Language for the close button's `aria-label` (`"Descartar"`/`"Dismiss"`) — the only built-in string, since `title`/`description`/`eyebrow` are always yours. |

## Notes

- Fixed position, top-right (`top: 20px; right: 20px; z-index: 1100`), stacks vertically with
  a slide-in animation — designed to coexist with `ToastNotification`/`useMessage` toasts as
  long as you keep the z-indexes and positions from colliding (this one sits above
  `ContextMessageProvider`'s default, which doesn't set an explicit position).
- `ToastStackContainer`, `ToastStackCardContainer`, `ToastStackIcon`, `ToastStackBody`,
  `ToastStackEyebrow`, `ToastStackTitle`, `ToastStackDescription`, `ToastStackCloseButton` are
  also exported individually, in case you need to compose a custom variant.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
