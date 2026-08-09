# Panel

A titled content card: header (title + optional action button), a bordered/shadowed body,
and an optional footer. Built on top of [`Container`](../Container/README.md).

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `title` | `React.ReactNode` | no | — | Header title. Header only renders if `title` or `actionButton` is set. |
| `children` | `React.ReactNode` | yes | — | Body content. |
| `footer` | `React.ReactNode` | no | — | Footer content, in its own bordered row. |
| `width` | `string` | no | `'100%'` | CSS width. |
| `maxWidth` | `string` | no | — | CSS max-width. |
| `padding` | `string` | no | — | CSS padding of the outer container. |
| `transparent` | `boolean` | no | `false` | Removes the body's background/shadow/border-radius (keeps just the title). |
| `actionButton` | `React.ReactNode` | no | — | Rendered right-aligned in the header, next to the title. |
| `style` | `React.CSSProperties` | no | — | Extra inline styles on the outer container. |

## Usage

```tsx
import { Panel, Button } from 'lcano-react-ui';
import { FaPlus } from 'react-icons/fa';

<Panel
  title="Users"
  actionButton={<Button icon={<FaPlus />} hint="Add" onClick={openAddUser} />}
  footer={<span>3 users</span>}
>
  <UserList />
</Panel>
```

## Notes

- Requires a styled-components `ThemeProvider` ancestor, see the
  [main README](../../../README.md#theming).
