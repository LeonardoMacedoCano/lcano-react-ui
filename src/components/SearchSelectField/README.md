# SearchSelectField

An async, debounced search-as-you-type combobox: renders a [`FieldValue`](../FieldValue/README.md)
that opens a dropdown of remotely-fetched options as the user types (or on focus).

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | yes | — | Field label, forwarded to the underlying `FieldValue`. |
| `placeholder` | `string` | no | `'Digite para pesquisar...'` | Input placeholder. |
| `fetchOptions` | `(query: string, page: number) => Promise<OptionItem[]>` | yes | — | Called (debounced, 300ms) whenever the query changes while the dropdown is open. `page` is currently always called with `0` by this component itself. |
| `onSelect` | `(selected?: OptionItem) => void` | yes | — | Called with the picked option, or `undefined` when the selection is cleared. |
| `value` | `OptionItem` (`{ key: string; value: string }`) | no | — | Controlled current selection. |
| `loadAllOnFocus` | `boolean` | no | `true` | When `true`, opening the dropdown with an empty query still calls `fetchOptions('', 0)`. When `false`, the dropdown stays empty until the user types something. |
| `disabled` | `boolean` | no | `false` | Disables the field entirely. |

## Usage

```tsx
import { SearchSelectField, OptionItem } from 'lcano-react-ui';

const fetchUsers = async (query: string): Promise<OptionItem[]> => {
  const users = await api.searchUsers(query);
  return users.map((u) => ({ key: String(u.id), value: u.name }));
};

<SearchSelectField
  label="Assignee"
  fetchOptions={fetchUsers}
  value={selectedUser}
  onSelect={setSelectedUser}
/>
```

## Adapting a typed domain object

`buildSearchSelectAdapter` bridges a strongly-typed search function (returning your own `T`,
not `OptionItem`) to the `fetchOptions`/`onSelect`/`value` shape this component expects:

```tsx
import { SearchSelectField, buildSearchSelectAdapter } from 'lcano-react-ui';

const { fetchOptions, onSelect, optionValue } = buildSearchSelectAdapter<User>({
  searchOptions: (query, page, pageSize) => api.searchUsers(query, page, pageSize),
  mapToOption: (user) => ({ key: String(user.id), value: user.name }),
  mapFromOption: (option) => users.find((u) => String(u.id) === option.key)!,
  value: selectedUser,
  onUpdate: setSelectedUser,
  pageSize: 10, // default is also 10
});

<SearchSelectField label="Assignee" fetchOptions={fetchOptions} onSelect={onSelect} value={optionValue} />
```

## Notes

- If `fetchOptions` throws, the dropdown just shows "no results" — errors aren't surfaced to
  the caller; catch/log inside your own `fetchOptions` if you need visibility.
- Clicking outside the field while nothing valid is selected (or the selection's `key` is
  `<= 0`) clears the query back to empty; clicking outside with a valid selection just
  closes the dropdown and keeps the selection.
- `buildSearchSelectAdapter`'s `fetchOptions` always requests `page` `0` from your
  `searchOptions` — pagination beyond the first page of results isn't wired up by this
  component (there's no "load more" on scroll).
