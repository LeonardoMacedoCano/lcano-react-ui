# GoogleSignInButton

Renders Google's own "Sign in with Google" button via Google Identity Services (GIS) — lazily
injects `https://accounts.google.com/gsi/client` into `<head>` (deduped across mounts, even
across multiple instances with different `locale`s), then calls
`google.accounts.id.initialize` + `renderButton` once the script is ready.

## Props

| Prop | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `clientId` | `string` | yes | — | Your Google OAuth client ID. |
| `onCredential` | `(credential: string) => void` | yes | — | Called with the signed JWT credential once the user completes sign-in. Verify it server-side — this component only hands you the raw token. |
| `locale` | `Locale` (`'pt' \| 'en'`) | no | browser default | Sets the GIS script's `hl` query param (`'pt'` → `pt-BR`, `'en'` → `en`), which controls the language of Google's own button/consent text. Omit to let Google infer it from the browser. |

## Usage

```tsx
import { GoogleSignInButton } from 'lcano-react-ui';

<GoogleSignInButton
  clientId={googleClientId}
  locale="en"
  onCredential={(credential) => loginWithGoogle(credential)}
/>
```

## Notes

- This is an integration wrapper around a third-party global (`window.google`), not a themed
  UI primitive — the button's look is entirely controlled by Google (rendered as
  `theme: 'outline', size: 'large'`, width capped to the container's width up to 260px), it
  does not read from your styled-components theme.
- Renders into an empty `<div>` until the script loads and Google mounts its own button
  inside — leave room for a brief blank state.
- Requires network access to `accounts.google.com` and a valid OAuth client ID configured for
  the origin the app is served from.
