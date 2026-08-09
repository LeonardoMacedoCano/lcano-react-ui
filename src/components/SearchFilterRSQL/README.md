# SearchFilterRSQL

A filter builder: pick a field, an operator (offered per field type), and a value, then add
it as a chip; every add/remove emits the whole filter set as an
[RSQL](https://github.com/jirutka/rsql-parser)-style query string via `onSearch`. Built for
backends that accept RSQL/FIQL filter syntax on list endpoints.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `fields` | `Field[]` | yes | — | Filterable fields. Each field's `type` decides both the value input (via [`FieldValue`](../FieldValue/README.md)) and which operators are offered. |
| `onSearch` | `(rsql: string) => void` | yes | — | Called with the full RSQL string every time a filter is added or removed (e.g. `"name=ilike=john;age>=18"`). |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | `'pt'` | Language for the built-in UI strings ("Selecione..."/"Select...", "Adicionar"/"Add") and operator labels ("Contém"/"Contains", "Igual"/"Equal", ...). |

### `Field`

A discriminated union on `type`, all sharing `name: string` and `label: string`:

| `type` | Extra props | Operators offered |
| --- | --- | --- |
| `'STRING'` | — | Contains (`LIKE`), Equal, Different |
| `'NUMBER'` | — | Equal, Different, Greater, Less, Greater-or-equal, Less-or-equal |
| `'DATE'` | — | same as `NUMBER` |
| `'BOOLEAN'` | — | Equal |
| `'SELECT'` | `options: { key: string; value: string }[]` | Equal, Different |

## Usage

```tsx
import { SearchFilterRSQL, Field } from 'lcano-react-ui';

const fields: Field[] = [
  { name: 'name', label: 'Name', type: 'STRING' },
  { name: 'age', label: 'Age', type: 'NUMBER' },
  {
    name: 'status',
    label: 'Status',
    type: 'SELECT',
    options: [
      { key: 'active', value: 'Active' },
      { key: 'inactive', value: 'Inactive' },
    ],
  },
];

<SearchFilterRSQL fields={fields} locale="en" onSearch={(rsql) => fetchList(rsql)} />
```

## Notes

- `LIKE` is emitted as the RSQL `=ilike=` operator (case-insensitive contains) — this is a
  non-standard RSQL extension some backends support (e.g. Spring `rsql-jpa` forks); confirm
  your backend understands `=ilike=` before relying on it.
- Duplicate filters (same field + operator + value) are silently ignored instead of added
  twice.
- The operator dropdown resets whenever the selected field changes.
- `locale` also controls how `BOOLEAN` filter chips are displayed (`Sim`/`Não` for `'pt'`,
  `Yes`/`No` for `'en'`), not just the field/operator picker text.
