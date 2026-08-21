# OptionGrid

A grid of selectable option cards — label + optional description + optional color swatch
strip, with a border highlight and "Selected" badge on the active one. For single-choice
settings shown as a grid instead of a dropdown: a graphics-quality picker, a visual-effect
picker, a plan tier picker. Distinct from [`ThemeSelector`](../ThemeSelector/README.md), which
is purpose-built for swatch-forward theme picking (bigger color blocks, no description/badge) —
`OptionGrid` is the general-purpose version of the same "grid of selectable cards" pattern, and
also works fine for a theme picker if you want description text or a badge on cards.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `options` | `OptionGridOption<T>[]` | yes | — | See below. |
| `value` | `T` | yes | — | The currently selected option's `id`. |
| `onChange` | `(id: T) => void` | yes | — | Called with the clicked option's `id`. |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | `'pt'` | Language for the "Selected" badge text (`"Selecionado"`/`"Selected"`) — the only built-in string. |
| `minItemWidth` | `string` | no | `'160px'` | Minimum card width (`grid-template-columns: repeat(auto-fill, minmax(minItemWidth, 1fr))`). |

### `OptionGridOption<T>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `T extends string` | yes | Unique, matched against `value`. |
| `label` | `string` | yes | Card title. |
| `description` | `string` | no | Smaller text under the label. |
| `swatch` | `string[]` | no | CSS colors, rendered as equal-width slices in a strip above the label — omit for a plain text card. |

## Usage

```tsx
import { OptionGrid } from 'lcano-react-ui';

type GraphicsQuality = 'low' | 'medium' | 'high';

<OptionGrid<GraphicsQuality>
  value={quality}
  onChange={setQuality}
  locale="en"
  minItemWidth="200px"
  options={[
    { id: 'low', label: 'Low', description: 'Best for older or budget phones.' },
    { id: 'medium', label: 'Medium', description: 'Default, tuned to stay smooth.' },
    { id: 'high', label: 'High', description: 'Best for high-end phones and desktops.' },
  ]}
/>
```

With swatches (e.g. a theme palette picker):

```tsx
<OptionGrid
  value={themeId}
  onChange={setThemeId}
  options={themes.map((t) => ({ id: t.id, label: t.label, description: t.description, swatch: t.colors }))}
/>
```

## Notes

- All cards are the same generic `<button>` shape — there's no per-card custom content slot;
  if you need something richer than label/description/swatch, compose your own grid instead.
- `OptionGridContainer`, `OptionGridCard`, `OptionGridSwatch`, `OptionGridSwatchSlice`,
  `OptionGridLabel`, `OptionGridDescription`, `OptionGridBadge` are also exported individually.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
