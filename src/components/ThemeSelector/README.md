# ThemeSelector

A grid of theme swatches — each item shows a title and a 4-color palette preview, and
highlights the currently selected one. Typically used in a settings/appearance screen.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `themes` | `Tema[]` | yes | — | Available themes to choose from. |
| `currentTheme` | `number` | no | — | `id` of the currently selected theme (matched against each `Tema.id`). |
| `onThemeChange` | `(id: number) => void` | yes | — | Called with the clicked theme's `id`. |

### `Tema`

```ts
type Tema = {
  id: number;
  title: string;
  primaryColor: string;
  secondaryColor: string;
  tertiaryColor: string;
  quaternaryColor: string;
  whiteColor: string;
  blackColor: string;
  grayColor: string;
  successColor: string;
  infoColor: string;
  warningColor: string;
};
```

## Usage

```tsx
import { ThemeSelector, Tema } from 'lcano-react-ui';

const themes: Tema[] = [
  { id: 1, title: 'Dark', primaryColor: '#282a36', secondaryColor: '#44475a', tertiaryColor: '#6272a4', quaternaryColor: '#bd93f9', whiteColor: '#f8f8f2', blackColor: '#000000', grayColor: '#999999', successColor: '#32cd80', infoColor: '#5ad4e6', warningColor: '#ff944d' },
  // ...more themes
];

<ThemeSelector themes={themes} currentTheme={activeThemeId} onThemeChange={setActiveThemeId} />
```

## Notes

- This component only renders the *picker UI* — applying the chosen theme (e.g. feeding it
  into your styled-components `ThemeProvider` as an `AppTheme`) is up to the consuming app.
  `Tema` and `AppTheme`/`DEFAULT_THEME_SYSTEM` (see the [main README](../../../README.md#theming))
  are separate shapes; you're expected to map between them.
- The selected item's border color always comes from that theme's own `quaternaryColor`, not
  from the app's currently active theme.
- Card background/text colors (`ThemeItem`, `ThemeName`) do come from the app's active theme
  via styled-components — requires a `ThemeProvider` ancestor.
