# ImagePicker

A circular avatar image with a small camera/edit button overlay that opens the native file
picker. Purely presentational — actual upload/persistence of the picked file is up to the
caller.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `icon` | `React.ReactNode` | yes | — | Icon rendered inside the camera button. |
| `imageUrl` | `string` | no | `'/default-profile-image.png'` | Current avatar image URL. |
| `onChange` | `(file: File) => void` | no | — | Called with the newly picked file. |
| `size` | `string` | no | `'150px'` | Avatar diameter (width and height). |
| `borderColor` | `string` | no | `theme.colors.quaternary` | Raw CSS color for the avatar border and the camera button background. |
| `isLoading` | `boolean` | no | `false` | Shows a spinner overlay and disables the camera button. |

## Usage

```tsx
import { ImagePicker } from 'lcano-react-ui';
import { FaCamera } from 'react-icons/fa';

<ImagePicker
  icon={<FaCamera />}
  imageUrl={user.avatarUrl}
  isLoading={isUploading}
  onChange={(file) => uploadAvatar(file)}
/>
```

## Notes

- The default placeholder image is served from `/default-profile-image.png` — the
  **consuming app** must provide this static asset (the library ships no image), or always
  pass `imageUrl`.
- No client-side validation of file type/size happens here (the native input accepts
  `image/*`) — validate `onChange`'s `File` yourself if you need to enforce limits.
