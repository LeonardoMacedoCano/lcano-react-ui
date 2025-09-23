import React, { useEffect } from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import { DEFAULT_THEME_SYSTEM } from '../../styles';

export interface ThemeFaviconProps {
  renderSvg?: (theme: DefaultTheme) => string;
}

const defaultRenderSvg = (theme: DefaultTheme) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
    <circle cx="256" cy="256" r="256" fill="${theme.colors.quaternary}" />
  </svg>
`;

const ThemeFavicon: React.FC<ThemeFaviconProps> = ({ renderSvg }) => {
  const theme = useTheme() || DEFAULT_THEME_SYSTEM;

  const svgContent = renderSvg ? renderSvg(theme) : defaultRenderSvg(theme);

  useEffect(() => {
    let faviconLink = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;

    if (!faviconLink) {
      faviconLink = document.createElement('link');
      faviconLink.rel = 'icon';
      document.head.appendChild(faviconLink);
    }

    faviconLink.href = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
  }, [svgContent]);

  return null;
};

export default ThemeFavicon;
