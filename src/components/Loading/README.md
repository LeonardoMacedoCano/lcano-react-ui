# Loading

A fullscreen spinner overlay (an inline animated SVG logo) shown while `isLoading` is
`true`.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `isLoading` | `boolean` | yes | — | Whether the overlay is shown. |

## Usage

```tsx
import { Loading } from 'lcano-react-ui';

<Loading isLoading={isFetching} />
```

## Notes

- Renders `null` immediately when `isLoading` becomes `false`, but waits **100ms** before
  actually showing the overlay when it becomes `true` — this avoids a flash for requests
  that resolve almost instantly.
- Fixed, fullscreen (`position: fixed; inset: 0`), `z-index: 9999` — only render one
  `Loading` per screen, and don't nest it inside a scrollable/positioned ancestor that would
  clip it.
- The spin animation color comes from `theme.colors.quaternary` — requires a
  styled-components `ThemeProvider` ancestor, see the [main README](../../../README.md#theming).
