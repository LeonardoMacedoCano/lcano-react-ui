# ActionButton

A floating action button (FAB) fixed to the bottom-right corner of the viewport. Hovering
over it reveals a stack of secondary `options`, each rendered as its own circular button —
useful for a page-level "quick actions" menu.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `React.ReactNode` | yes | — | Icon rendered inside the main button. |
| `hint` | `string` | no | — | Tooltip (`title`/`aria-label`) for the main button. |
| `onClick` | `() => void` | no | — | Click handler for the main button. |
| `options` | `ActionOption[]` | no | — | Secondary actions shown on hover, stacked above the main button. |
| `disabled` | `boolean` | no | `false` | Disables the main button. |

### `ActionOption`

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `icon` | `React.ReactNode` | yes | Icon for the option button. |
| `hint` | `string` | yes | Tooltip for the option button. |
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

## Notes

- Positioning is fixed (`position: fixed; bottom: 20px; right: 20px`) — only render one
  `ActionButton` per screen.
- Colors come from the active theme (`theme.colors.tertiary`/`white`) — requires a
  styled-components `ThemeProvider` ancestor, see the [main README](../../../README.md#theming).
