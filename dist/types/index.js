import { jsx, jsxs } from 'react/jsx-runtime';
import styled, { css } from 'styled-components';

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

const Panel = ({ title, children, footer, width, maxWidth, padding, actionButton, style, transparent = false }) => {
    return (jsxs(Container, { width: width || '100%', maxWidth: maxWidth, padding: padding, margin: "auto", backgroundColor: "transparent", style: style, children: [(title || actionButton) && (jsxs(Title, { children: [jsx("h3", { children: title }), actionButton && jsx(ActionContainer, { children: actionButton })] })), jsxs(Container, { width: "100%", variantColor: transparent ? undefined : "secondary", backgroundColor: transparent ? "transparent" : undefined, margin: "20px 0 0 0", style: transparent ?
                    {} :
                    {
                        boxShadow: '0 0 2px',
                        borderRadius: '5px',
                    }, children: [jsx(Body, { children: children }), footer && jsx(Footer, { children: footer })] })] }));
};
const Title = styled.div `
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gray};
  h3 {
    color: ${({ theme }) => theme.colors.white};
  }
`;
const ActionContainer = styled.div `
  margin-left: auto;
  display: flex;
  align-items: center;
`;
const BaseBox = styled.div `
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Body = styled(BaseBox) `
  justify-content: space-between;
`;
const Footer = styled(BaseBox) `
  height: 35px;
  justify-content: center;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
`;

const Stack = ({ children, direction = 'row', divider, gap, ...rest }) => {
    return (jsx(StackContainer, { direction: direction, divider: divider, gap: gap, ...rest, children: children }));
};
const StackContainer = styled.div `
  display: flex;
  flex-direction: ${({ direction }) => direction};
  width: ${({ width }) => width || '100%'};
  height: ${({ height }) => height || 'auto'};

  ${({ alignCenter }) => alignCenter && 'align-items: center;'}
  ${({ alignRight }) => alignRight && 'align-items: flex-end;'}
  ${({ justifyCenter }) => justifyCenter && 'justify-content: center;'}
  ${({ justifyBetween }) => justifyBetween && 'justify-content: space-between;'}

  ${({ gap }) => gap && `gap: ${gap};`}

  ${({ divider, direction, theme }) => divider &&
    css `
      > * + * {
        ${(() => {
        const color = theme.colors.gray;
        if (direction === 'row') {
            if (divider === 'left' || divider === 'x')
                return `border-left: 1px solid ${color};`;
            if (divider === 'right')
                return `border-right: 1px solid ${color};`;
        }
        if (direction === 'column') {
            if (divider === 'top' || divider === 'y')
                return `border-top: 1px solid ${color};`;
            if (divider === 'bottom')
                return `border-bottom: 1px solid ${color};`;
        }
        return '';
    })()}
      }
    `}
`;

export { Container, Panel, Stack, ThemeSelector, convertReactStyleToCSSObject, getVariantColor };
