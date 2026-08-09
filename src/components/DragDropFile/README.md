# DragDropFile

A single-file drag-and-drop upload zone (built on
[`react-dropzone`](https://react-dropzone.js.org/)) with a preview of the selected file name
and actions to view or remove it.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `onFileChange` | `(file: File \| null) => void` | yes | — | Called with the dropped/selected file, or `null` after removal. |
| `acceptedFileFormats` | `string[]` | no | — | MIME types or extensions accepted by the dropzone (e.g. `['image/png', '.pdf']`). Unset accepts anything. |

## Usage

```tsx
import { DragDropFile } from 'lcano-react-ui';

<DragDropFile
  acceptedFileFormats={['image/png', 'image/jpeg']}
  onFileChange={(file) => setSelectedFile(file)}
/>
```

## Notes

- Single file only (`multiple: false` in the underlying dropzone) — a new drop replaces the
  current file.
- "View" opens the file via `URL.createObjectURL` in a new tab; the object URL is not
  revoked automatically, so very frequent view/remove cycles will leak blob URLs for the
  session's lifetime.
- Depends on `react-dropzone` and `react-icons`, both regular `dependencies` of this package
  (already installed transitively — no extra install needed in consumer projects).
