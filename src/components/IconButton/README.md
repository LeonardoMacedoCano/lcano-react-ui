# IconButton

A small circular icon-only button — for nav rails, toolbars, and floating toggles. Distinct
from [`Button`](../Button/README.md), which is rectangular and built around an optional label
(`description`) with theme `variant` colors; `IconButton` is icon-only, fixed 44×44px, with a
simple two-state (`active`/inactive) background instead of a variant palette.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | — | Centered at ~1.15em. |
| `label` | `string` | yes | — | Used as both `title` (tooltip) and `aria-label` — there's no visible text, so this is the only accessible name. |
| `onClick` | `() => void` | yes | — | Click handler. |
| `active` | `boolean` | no | `false` | Switches the background to the theme's `quaternary` color, e.g. for a toggled/selected state. |

## Usage

```tsx
import { IconButton } from 'lcano-react-ui';
import { FaBell } from 'react-icons/fa';

<IconButton icon={<FaBell />} label="Notifications" active={panelOpen} onClick={() => setPanelOpen((v) => !v)} />
```

## Notes

- Fixed 44×44px circle — not resizable via props; compose your own styled wrapper if you need
  a different size.
- `IconButtonContainer` is also exported individually.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
