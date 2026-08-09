# Tabs

A simple uncontrolled tab bar: renders a row of tab buttons and the content of whichever one
is active.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `tabs` | `{ label: string; content: React.ReactNode }[]` | yes | — | Tab list, in order. The first tab (index `0`) is active initially. |

## Usage

```tsx
import { Tabs } from 'lcano-react-ui';

<Tabs
  tabs={[
    { label: 'Profile', content: <ProfileForm /> },
    { label: 'Security', content: <SecurityForm /> },
    { label: 'Billing', content: <BillingForm /> },
  ]}
/>
```

## Notes

- Active tab state is internal (`useState`) — there's no controlled variant (no `activeTab`/
  `onChange` props). If you need to control the active tab from outside, use
  [`ToggleSwitch`](../ToggleSwitch/README.md) or your own tab bar instead.
- All tab content mounts/unmounts on switch (only the active tab's `content` is rendered) —
  don't rely on inactive tabs keeping local state.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
