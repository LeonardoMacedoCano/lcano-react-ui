# RailTabsNav

App-level navigation that renders as a persistent icon rail wherever there's enough
*width* to spare — desktop, and landscape phones — and as a labeled bottom tab bar only
where width is actually tight (portrait phones). Unlike [`SideNav`](../SideNav/README.md),
which switches between rail and drawer purely by width, this one treats width and height
as separate questions: a landscape phone is exactly as narrow-on-height as a portrait one
is narrow-on-width, so it gets the rail (there's horizontal room for it) instead of losing
vertical space to a drawer toggle or a bottom bar. The rail then packs its own icons
tighter below a second, height-based breakpoint, so all items still fit without scrolling
on a short landscape screen.

Both forms render every item — CSS `display: none` swaps one for the other, nothing is
mounted/unmounted on resize.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `items` | `RailTabsNavItem[]` | yes | — | Primary destinations — rendered as icon-only buttons in the rail, as icon+label buttons in the tab bar. |
| `compactBelow` | `string` | no | `'700px'` | Below this **width**: bottom tab bar. At or above it: rail. Same name/meaning as `SideNav`'s prop of the same name. |
| `denseBelow` | `string` | no | `'500px'` | Below this **height**, the rail packs its icons tighter (smaller gaps/padding, icon size unchanged) — aimed at landscape phones, which land in the rail bucket on width but are short on height. Only affects the rail; the tab bar doesn't use it. |
| `ariaLabel` | `string` | no | `'Navigation'` | `aria-label` on both the rail `<nav>` and the tab bar `<nav>`. |

### `RailTabsNavItem`

Every item has `id` / `icon` / `label` / `active?`, plus **one of three shapes** depending
on whether it carries an action, a submenu, or both:

| Shape | Fields | Click behaviour |
| --- | --- | --- |
| **Action** (`RailTabsNavActionItem`) | `onClick` | Runs `onClick`. Closes any submenu that was open. |
| **Submenu** (`RailTabsNavSubmenuItem`) | `submenu` | Toggles this item's submenu open/closed. No action of its own. |
| **Action + submenu** (`RailTabsNavActionSubmenuItem`) | `onClick` + `submenu` | Opening click runs `onClick` **and** opens the submenu; the next click just closes it (the action does **not** re-fire on close). |

An item with neither `onClick` nor a non-empty `submenu` is a type error.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | React key. |
| `icon` | `ReactNode` | yes | Shown in both the rail button and the tab button. |
| `label` | `string` | yes | Text under the icon in the tab bar; the rail button's `title`/`aria-label`; also the heading shown at the top of this item's submenu. |
| `active` | `boolean` | no | Highlights the current destination in both layouts (`aria-current="page"` + background fill). |
| `onClick` | `() => void` | Action shapes only | Called as described above. |
| `submenu` | `RailTabsNavSubItem[]` | Submenu shapes only | Options shown in the popover. |

### `RailTabsNavSubItem`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `string` | yes | React key. |
| `label` | `string` | yes | Row text (one option per row). |
| `active` | `boolean` | no | Highlights the current option. |
| `onClick` | `() => void` | yes | Called on select; the submenu closes right after. |

The submenu is an overlay — `position: fixed`, above everything, and it reserves **no**
layout space. It renders as a flyout beside the rail (aligned to the item you clicked)
where the rail is visible, and as a sheet just above the tab bar on narrow screens. It
closes on: selecting an option, clicking outside it, pressing <kbd>Esc</kbd>, or a viewport
resize. The component owns this state — you only pass data.

While an item's submenu is open, that item's button carries the same filled highlight as
an `active` item, so opening a submenu looks like selecting any other item.

## Usage

```tsx
import { RailTabsNav } from 'lcano-react-ui';

<RailTabsNav
  items={[
    // action only
    { id: 'home', icon: '🏠', label: 'Home', active: screen === 'home', onClick: () => go('home') },
    // action + submenu: goes to the section overview, then shows its sub-pages
    {
      id: 'finance',
      icon: '💰',
      label: 'Finance',
      active: section === 'finance',
      onClick: () => go('finance'),
      submenu: [
        { id: 'overview', label: 'Overview', active: page === 'overview', onClick: () => go('finance/overview') },
        { id: 'entries', label: 'Entries', active: page === 'entries', onClick: () => go('finance/entries') },
      ],
    },
    // submenu only
    {
      id: 'reports',
      icon: '📊',
      label: 'Reports',
      submenu: [
        { id: 'monthly', label: 'Monthly', onClick: () => go('reports/monthly') },
        { id: 'yearly', label: 'Yearly', onClick: () => go('reports/yearly') },
      ],
    },
  ]}
/>
```

Both the rail (76px wide) and the tab bar (64px tall) are `position: fixed`, so your own
layout needs to reserve that space — typically with a responsive padding on your root
element, mirroring the same `compactBelow` breakpoint:

```css
.root {
  padding-bottom: 64px; /* tab bar, narrow screens */
}

@media (min-width: 700px) {
  .root {
    padding-left: 76px; /* rail, wide screens */
    padding-bottom: 0;
  }
}
```

## Notes

- Requires a styled-components `ThemeProvider` ancestor.
- Rail and tab bar are both plain rectangular buttons — no border, no circular shape;
  the active item gets a filled, slightly rounded background instead. If you want the
  rail to look like `SideNav`'s (circular, bordered `IconButton`s), use `SideNav` instead —
  the two aren't meant to be visually interchangeable.
- `compactBelow` deliberately reuses the name and meaning of `SideNav`'s prop ("below
  this width, show the compact/mobile form") so an app using both components can reason
  about them the same way.
- There's no drawer, header, or footer slot — this component is nav-only. Compose
  account/branding controls elsewhere in your own fixed-position elements, same as you
  would alongside `SideNav`'s rail.
