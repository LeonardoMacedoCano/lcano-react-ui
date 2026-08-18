# AccountSummary

A signed-in user row: avatar + name (+ optional email), a log-out [`Button`](../Button/README.md)
on the right. Built from the library's own `Stack`/`Button`, for the "who's logged in" header
in an account menu, popover, or settings page.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `user` | `{ name: string; email?: string; avatarUrl?: string }` | yes | — | `avatarUrl` renders a 40×40 circular `<img>`; omit it to show just the name. |
| `onLogout` | `() => void` | yes | — | Called when the log-out button is clicked. |
| `showEmail` | `boolean` | no | `false` | Show `user.email` under the name (only if `user.email` is set). |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | `'pt'` | Language for the log-out button's label (`"Sair"`/`"Log out"`) — the only built-in string. |

## Usage

```tsx
import { AccountSummary } from 'lcano-react-ui';

<AccountSummary
  user={{ name: currentUser.name, email: currentUser.email, avatarUrl: currentUser.avatarUrl }}
  showEmail
  locale="en"
  onLogout={logout}
/>
```

## Notes

- Name and email are ellipsized with `white-space: nowrap` if they overflow — give the
  container a bounded width.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
