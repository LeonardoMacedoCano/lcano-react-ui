# lcano-react-ui

A React UI component library for personal projects — built to standardize design and speed
up interface development across multiple apps (Portuguese and English).

## Requirements

Peer dependencies — install these in your project, they aren't bundled:

- `react >= 16.8.0`
- `react-dom >= 16.8.0`
- `styled-components >= 5.0.0`

## Installation

```bash
npm install lcano-react-ui
```

```bash
yarn add lcano-react-ui
```

Ships ESM (`dist/esm`), CommonJS (`dist/cjs`), and TypeScript types (`dist/types`) — no
extra bundler configuration needed.

## Theming

Most components read colors from a styled-components theme shaped like `AppTheme`. Wrap
your app in a `ThemeProvider` with the library's default theme, or your own:

```tsx
import { ThemeProvider } from 'styled-components';
import { DEFAULT_THEME_SYSTEM } from 'lcano-react-ui';

<ThemeProvider theme={DEFAULT_THEME_SYSTEM}>
  <App />
</ThemeProvider>
```

```ts
interface AppTheme {
  title?: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    white: string;
    // + black, gray, success, info, warning, and any custom keys
    [key: string]: string;
  };
}
```

Components with a `variant`/`variantColor` prop (`VariantColor` = `'primary' | 'secondary' |
'tertiary' | 'quaternary' | 'success' | 'info' | 'warning'`) resolve it against `theme.colors`
at render time — any theme object with those keys works, including one built by your own app
(see [`ThemeSelector`](src/components/ThemeSelector/README.md) for switching between several
themes at runtime).

## Quick start

```tsx
import { ThemeProvider } from 'styled-components';
import { DEFAULT_THEME_SYSTEM, Button, Panel } from 'lcano-react-ui';

function App() {
  return (
    <ThemeProvider theme={DEFAULT_THEME_SYSTEM}>
      <Panel title="Welcome">
        <Button variant="success" description="Get started" onClick={() => {}} />
      </Panel>
    </ThemeProvider>
  );
}
```

## Components

Each component has its own README with the full prop table, usage examples, and notes on
gotchas/dependencies.

| Component | Description |
| --- | --- |
| [AccountSummary](src/components/AccountSummary/README.md) | Signed-in user row: avatar, name, log-out button |
| [ActionButton](src/components/ActionButton/README.md) | Floating action button with a hover-out options menu |
| [BadgeCard](src/components/BadgeCard/README.md) | Icon-tile list card for achievements/badges/collectibles |
| [Breadcrumb](src/components/Breadcrumb/README.md) | Scrollable breadcrumb trail |
| [Button](src/components/Button/README.md) | Themed icon/label button |
| [ConfirmModal](src/components/ConfirmModal/README.md) | Preconfigured confirm/cancel modal |
| [Container](src/components/Container/README.md) | Generic themed `<div>` layout primitive |
| [DragDropFile](src/components/DragDropFile/README.md) | Single-file drag-and-drop upload zone |
| [FieldTextArea](src/components/FieldTextArea/README.md) | Labeled auto-growing textarea |
| [FieldValue](src/components/FieldValue/README.md) | Labeled input adapting to string/number/boolean/date/select |
| [GoogleSignInButton](src/components/GoogleSignInButton/README.md) | Google Identity Services sign-in button |
| [HighlightBox](src/components/HighlightBox/README.md) | Centered pill badge colored by variant |
| [IconButton](src/components/IconButton/README.md) | Circular icon-only button |
| [ImagePicker](src/components/ImagePicker/README.md) | Circular avatar with a file-picker overlay |
| [Loading](src/components/Loading/README.md) | Fullscreen spinner overlay |
| [Modal](src/components/Modal/README.md) | Generic centered modal dialog |
| [OptionGrid](src/components/OptionGrid/README.md) | Grid of selectable option cards, optional color swatch |
| [PaginatedGrid](src/components/PaginatedGrid/README.md) | CSS grid that paginates itself by row count |
| [Panel](src/components/Panel/README.md) | Titled content card with header/body/footer |
| [QrCode](src/components/QrCode/README.md) | Inline SVG QR code |
| [SearchFilterRSQL](src/components/SearchFilterRSQL/README.md) | RSQL filter builder |
| [SearchPagination](src/components/SearchPagination/README.md) | Pagination controls for a `PagedResponse` |
| [SearchSelectField](src/components/SearchSelectField/README.md) | Async debounced search combobox |
| [SideNav](src/components/SideNav/README.md) | App nav: icon rail on wide screens, hamburger + drawer on narrow ones |
| [Stack](src/components/Stack/README.md) | Flexbox row/column layout with dividers |
| [SummaryCard](src/components/SummaryCard/README.md) | Small KPI/metric card |
| [Table](src/components/Table/README.md) | Data table with columns, pagination, row actions, responsive stacking |
| [Tabs](src/components/Tabs/README.md) | Uncontrolled tab bar |
| [ThemeFavicon](src/components/ThemeFavicon/README.md) | Favicon that follows the active theme |
| [ThemeSelector](src/components/ThemeSelector/README.md) | Theme picker grid |
| [ToastNotification](src/components/ToastNotification/README.md) | Single toast card |
| [ToastStack](src/components/ToastStack/README.md) | Stacking, auto-dismissing notification queue |
| [ToggleSwitch](src/components/ToggleSwitch/README.md) | Two-option segmented control |

## Hooks & contexts

- [`useConfirmModal`, `useCopyFeedback`, `useFullscreen`, `useMediaQuery`,
  `useSyncedPreference`](src/hooks/README.md) — imperative helpers for `ConfirmModal` and
  clipboard copy feedback, fullscreen toggling, media-query matching, and a local-first
  preference synced with a server endpoint.
- [`ContextMessageProvider` / `useMessage`](src/contexts/README.md) — app-wide toast queue.

## Development

```bash
npm install
npm run build   # rm -rf dist && rollup -c → dist/esm, dist/cjs, dist/types
```

`dist/` is build output and is **not** committed to this repo (see `.gitignore`) — it's
generated by CI and published to npm on every `v*` tag push
(`.github/workflows/publish.yml`). To cut a release:

```bash
npm version patch   # or minor / major
git push --follow-tags
```

A separate `ci.yml` workflow runs `npm run build` on every push/PR to `main` to catch a
broken build before merge.

## License

MIT
