# BadgeCard

A horizontal card for a list of unlockable/collectible things: a square icon tile on the
left, title + description + optional meta on the right, dimmed when `active={false}`. Built
for achievement/badge/trophy grids, but generic enough for anything with an
icon-title-description-status shape (a perk list, a plan comparison card, a checklist item).

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `ReactNode` | yes | — | Rendered large (2.6rem) and centered in the left tile. An emoji string works, so does an icon component — pass your own "locked" icon when `active` is `false`, this component doesn't swap it for you. |
| `title` | `string` | yes | — | Single line, ellipsized if it overflows. |
| `description` | `ReactNode` | yes | — | Clamped to 2 lines. |
| `meta` | `ReactNode` | no | — | Small text under the description (e.g. an unlock date, a percentage, a price) — render as many lines/spans as you need, this is a free slot. |
| `active` | `boolean` | no | `true` | `false` dims the whole card to `opacity: 0.55` — use for a locked/unavailable state. |
| `onClick` | `() => void` | no | — | Makes the card clickable (cursor + hover border); omit for a static card. |
| `height` | `string` | no | `'150px'` | Fixed card height, so cards line up in a grid regardless of description length. |

## Usage

```tsx
import { BadgeCard } from 'lcano-react-ui';

<BadgeCard
  icon={achievement.unlocked ? achievement.icon : '🔒'}
  title={achievement.name}
  description={achievement.description}
  active={achievement.unlocked}
  onClick={() => setSelected(achievement)}
  meta={
    <>
      {achievement.unlocked && <span>Unlocked {new Date(achievement.unlockedAt).toLocaleString()}</span>}
      <span>{achievement.globalUnlockPercent}% of players</span>
    </>
  }
/>
```

Pairs well with [`PaginatedGrid`](../PaginatedGrid/README.md) for the grid layout and
[`Modal`](../Modal/README.md) for a click-to-expand detail view.

## Notes

- No built-in lock icon or "locked" copy — pass whatever `icon`/`meta` fits your domain
  through the `active` state yourself.
- `BadgeCardContainer`, `BadgeCardIcon`, `BadgeCardBody`, `BadgeCardTitle`,
  `BadgeCardDescription`, `BadgeCardMeta` are also exported individually for a custom layout.
- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
