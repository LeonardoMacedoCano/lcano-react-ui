import { jsx, jsxs } from 'react/jsx-runtime';
import styled from 'styled-components';

const convertReactStyleToCSSObject = (style) => {
    return Object.fromEntries(Object.entries(style).map(([key, value]) => [key, value]));
};
const getVariantColor = (theme, variant) => {
    const colors = theme.colors;
    const validVariant = variant || 'info';
    switch (validVariant) {
        case 'primary':
        case 'secondary':
        case 'tertiary':
        case 'quaternary':
        case 'success':
        case 'info':
        case 'warning':
            return colors[validVariant];
        default:
            return colors.defaultColor;
    }
};

const ThemeSelector = ({ themes, currentTheme, onThemeChange, }) => {
    return (jsx(ThemeGrid, { children: themes.map((theme) => (jsxs(ThemeItem, { isSelected: theme.id === currentTheme, onClick: () => onThemeChange(theme.id), borderColor: theme.quaternaryColor, children: [jsx(ThemeName, { children: theme.title }), jsxs(ColorPalette, { children: [jsx(ColorBlock, { color: theme.primaryColor }), jsx(ColorBlock, { color: theme.secondaryColor }), jsx(ColorBlock, { color: theme.tertiaryColor }), jsx(ColorBlock, { color: theme.quaternaryColor })] })] }, theme.title))) }));
};
const ThemeGrid = styled.div `
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  width: 100%;
`;
const ThemeItem = styled.div `
  background-color: ${props => props.theme.colors.primary};
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease;
  border: 2px solid ${props => props.isSelected ? props.borderColor : 'transparent'};

  &:hover {
    transform: translateY(-3px);
  }
`;
const ThemeName = styled.div `
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
`;
const ColorPalette = styled.div `
  display: flex;
  height: 30px;
`;
const ColorBlock = styled.div `
  flex: 1;
  height: 100%;
  background-color: ${props => props.color};
`;

const Container = ({ children, height, width, maxWidth, margin, padding, backgroundColor, variantColor, style }) => (jsx(StyledContainer, { height: height, width: width, margin: margin, padding: padding, backgroundColor: backgroundColor, variantColor: variantColor, style: style, maxWidth: maxWidth, children: children }));
const StyledContainer = styled.div `
  height: ${({ height }) => height || 'auto'};
  width: ${({ width }) => width || 'auto'};
  margin: ${({ margin }) => margin || '0'};
  padding: ${({ padding }) => padding || '0'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  background-color: ${({ backgroundColor, theme, variantColor }) => variantColor && theme.colors[variantColor] || backgroundColor};
`;

export { Container, ThemeSelector, convertReactStyleToCSSObject, getVariantColor };
