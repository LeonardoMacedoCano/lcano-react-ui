# SideNav

App-level navigation that renders as a persistent icon rail on wide screens and as a
hamburger + slide-out drawer on narrow ones — driven by a single breakpoint, so the two
never show at once. Same idea as `Table`'s `stackBelow`: one component, one prop deciding
its own layout, instead of the app picking between two separate components at a given
viewport width.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `SideNavItem[]` | yes | — | Primary destinations — rendered as icon buttons in the rail, as labeled rows in the drawer. |
| `compactBelow` | `string` | no | `'700px'` | Below this width: hamburger + drawer. At or above it: icon rail. |
| `drawerHeader` | `ReactNode` | no | — | Rendered at the top of the drawer, next to the close button (e.g. logo + app name). Rail has no equivalent slot — it's icon-only by design. |
| `railHeader` | `ReactNode` | no | — | Rendered above the icon list in the rail only (e.g. a badge). |
| `footer` | `ReactNode` | no | — | Rendered after the icons in the rail, and as a pinned bottom section in the drawer. Same content both times — if it needs to look different per layout, that's on the node you pass in. |
| `toggleLabel` | `string` | no | `'Menu'` | `aria-label`/`title` for the hamburger button. |
| `closeLabel` | `string` | no | `'Close menu'` | `aria-label`/`title` for the drawer's close button. |

### `SideNavItem`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | React key. |
| `icon` | `ReactNode` | yes | Shown in the rail button. |
| `label` | `string` | yes | Shown as text in the drawer row; used as the rail button's `title`/`aria-label`. |
| `active` | `boolean` | no | Highlights the current destination in both layouts. |
| `onClick` | `() => void` | yes | Called on click in either layout; the drawer also closes itself first. |

## Usage

```tsx
import { SideNav } from 'lcano-react-ui';

<SideNav
  drawerHeader={<AppLogo />}
  footer={<AccountMenu />}
  items={[
    { id: 'home', icon: '🏠', label: 'Home', active: screen === 'home', onClick: () => go('home') },
    { id: 'settings', icon: '⚙️', label: 'Settings', active: screen === 'settings', onClick: () => go('settings') },
  ]}
/>
```

## Notes

- Requires a styled-components `ThemeProvider` ancestor.
- Built from this library's own `IconButton` for the rail icons and the drawer's
  open/close controls.
- The drawer is marked `inert` while closed (not just visually hidden), so it can't be
  tabbed into by mistake.
- There's no per-layout content slot beyond `drawerHeader`/`railHeader`/`footer` — if your
  rail and drawer genuinely need different destinations (not just different presentation of
  the same ones), build that list difference into `items` yourself before passing it in.
