# ThemeFavicon

A renderless component that sets the page's `<link rel="icon">` to an inline SVG colored
from the current styled-components theme — so the favicon follows the app's active theme
without a static image asset per theme.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `renderSvg` | `(theme: DefaultTheme) => string` | no | a filled circle in `theme.colors.quaternary` | Returns the SVG markup (as a string) to use as the favicon. Receives the active theme. |

## Usage

```tsx
import { ThemeFavicon } from 'lcano-react-ui';

// Default circle favicon, colored by the active theme
<ThemeFavicon />

// Custom favicon shape
<ThemeFavicon
  renderSvg={(theme) => `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="${theme.colors.quaternary}" />
    </svg>
  `}
/>
```

## Notes

- Renders `null` — mount it anywhere inside your app tree (once), it has no visual output of
  its own.
- Falls back to `DEFAULT_THEME_SYSTEM` (from `lcano-react-ui`) if there's no
  `ThemeProvider` ancestor, but you should still wrap your app in one — see the
  [main README](../../../README.md#theming).
- Updates the favicon via a direct DOM mutation (`document.querySelector("link[rel='icon']")`)
  whenever the resolved SVG string changes, reusing the existing `<link>` tag if the page
  already has one (e.g. from `index.html`) or creating one otherwise.
