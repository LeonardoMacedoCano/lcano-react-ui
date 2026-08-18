import { useEffect, useRef } from 'react';
import { Locale } from '../../types';

interface GoogleAccountsId {
  initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const LOCALE_TO_HL: Record<Locale, string> = { pt: 'pt-BR', en: 'en' };

const gisScriptPromises = new Map<string, Promise<void>>();

function loadGisScript(hl?: string): Promise<void> {
  const src = hl ? `${GIS_SCRIPT_SRC}?hl=${hl}` : GIS_SCRIPT_SRC;
  let promise = gisScriptPromises.get(src);
  if (!promise) {
    promise = new Promise((resolvePromise, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolvePromise();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.defer = true;
      script.onload = () => resolvePromise();
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });
    gisScriptPromises.set(src, promise);
  }
  return promise;
}

export interface GoogleSignInButtonProps {
  clientId: string;
  onCredential: (credential: string) => void;
  locale?: Locale;
}

const GoogleSignInButton = ({ clientId, onCredential, locale }: GoogleSignInButtonProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const hl = locale ? LOCALE_TO_HL[locale] : undefined;

    loadGisScript(hl).then(() => {
      if (cancelled || !containerRef.current || !window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onCredential(response.credential),
      });
      const width = Math.min(260, containerRef.current.clientWidth);
      window.google.accounts.id.renderButton(containerRef.current, { theme: 'outline', size: 'large', width });
    });

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, locale]);

  return <div ref={containerRef} />;
};

export default GoogleSignInButton;
