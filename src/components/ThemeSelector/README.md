# ThemeSelector

A grid of theme swatches — each item shows a title and a color palette preview, and
highlights the currently selected one with a border in that theme's own accent color.
Typically used in a settings/appearance screen. Distinct from
[`OptionGrid`](../OptionGrid/README.md), which is the general-purpose "grid of selectable
cards" (label + description + badge); `ThemeSelector` is purpose-built for swatch-forward
picking — no description, bigger color blocks, hover-lift affordance.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `options` | `ThemeSelectorOption<T>[]` | yes | — | Available themes to choose from. |
| `value` | `T` | yes | — | The currently selected option's `id`. |
| `onChange` | `(id: T) => void` | yes | — | Called with the clicked option's `id`. |

### `ThemeSelectorOption<T>`

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `T extends string \| number` | yes | Unique, matched against `value`. |
| `title` | `string` | yes | Card title. |
| `swatch` | `string[]` | yes | CSS colors, rendered as equal-width blocks. |
| `accentColor` | `string` | no | Border color when selected. Defaults to the last entry in `swatch` (by convention, the theme's most saturated/accent color). |

## Usage

```tsx
import { ThemeSelector } from 'lcano-react-ui';

type ThemeId = 'midnight' | 'forest';

<ThemeSelector<ThemeId>
  value={themeId}
  onChange={setThemeId}
  options={[
    { id: 'midnight', title: 'Midnight', swatch: ['#0f0f1a', '#1a1a2e', '#2d2d4e', '#a78bfa'] },
    { id: 'forest', title: 'Forest', swatch: ['#0d1512', '#16221c', '#24352c', '#4ade80'] },
  ]}
/>
```

If your app already has its own theme catalog shape, map it at the call site:

```tsx
<ThemeSelector
  value={themeId}
  onChange={setThemeId}
  options={myThemes.map((t) => ({
    id: t.id,
    title: t.title,
    swatch: [t.primaryColor, t.secondaryColor, t.tertiaryColor, t.quaternaryColor],
  }))}
/>
```

## Notes

- This component only renders the *picker UI* — applying the chosen theme (e.g. feeding it
  into your styled-components `ThemeProvider` as an `AppTheme`) is up to the consuming app.
- Card background/text colors (`ThemeItem`, `ThemeName`) come from the app's active theme
  via styled-components — requires a `ThemeProvider` ancestor.
- Prior to 2.0.0 this component took a fixed `Tema[]` shape (`themes`/`currentTheme`/
  `onThemeChange` props). It's now generic like `OptionGrid`, decoupled from any specific
  theme type — update call sites to the `options`/`value`/`onChange` shape above.
