# ActionButton

A floating action button (FAB) fixed to the bottom-right corner of the viewport. Tapping or
hovering it reveals a stack of secondary `options`, each rendered as its own circular
button — useful for a page-level "quick actions" menu.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `React.ReactNode` | yes | — | Icon rendered inside the main button. |
| `hint` | `string` | no | — | Tooltip (`title`/`aria-label`) for the main button. |
| `onClick` | `() => void` | no | — | Called when the main button is clicked/tapped. When `options` is set, the same interaction also toggles the options menu. |
| `options` | `ActionOption[]` | no | — | Secondary actions, stacked above the main button. |
| `disabled` | `boolean` | no | `false` | Disables the main button (no click, no menu). |

### `ActionOption`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | yes | Icon for the option button. |
| `hint` | `string` | yes | Tooltip for the option button. Also used as the React key, so keep it unique within one `ActionButton`. |
| `action` | `() => void` | yes | Called on click; also closes the options menu. |
| `disabled` | `boolean` | no | Disables this specific option. |

## Usage

```tsx
import { ActionButton } from 'lcano-react-ui';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

<ActionButton
  icon={<FaPlus />}
  hint="Actions"
  options={[
    { icon: <FaEdit />, hint: 'Edit', action: () => console.log('edit') },
    { icon: <FaTrash />, hint: 'Delete', action: () => console.log('delete') },
  ]}
/>
```

## Behaviour

The interaction model is chosen per device via `matchMedia('(hover: hover) and (pointer: fine)')`:

- **Pointer devices (mouse):** the menu opens on hover and closes when the pointer leaves
  the FAB. Clicking the main button only runs `onClick`.
- **Touch devices:** the menu toggles on tap of the main button (debounced ~300ms to
  ignore ghost/duplicate taps), and closes on: picking an option, tapping outside, or
  `Escape`. Hover handlers are not wired, so the emulated `mouseenter`+`click` pair a tap
  produces can't open-then-close the menu.

Hover styling is gated behind `@media (hover: hover)`; both buttons are `type="button"`
and use `touch-action: manipulation`.

## Notes

- Positioning is fixed (`position: fixed; bottom: 20px; right: 20px`) — only render one
  `ActionButton` per screen.
- To keep it clear of fixed app chrome (e.g. a bottom tab bar), set the
  `--lcano-action-button-inset-bottom` CSS custom property on any ancestor. Its value is
  added to the default `20px` bottom offset; it defaults to `0px`, so the position is
  unchanged when unset.
- Colors come from the active theme (`theme.colors.tertiary`/`white`) — requires a
  styled-components `ThemeProvider` ancestor, see the [main README](../../../README.md#theming).
