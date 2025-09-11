'use strict';

var jsxRuntime = require('react/jsx-runtime');
var styled = require('styled-components');

const ThemeSelector = ({ themes, currentTheme, onThemeChange, }) => {
    return (jsxRuntime.jsx(ThemeGrid, { children: themes.map((theme) => (jsxRuntime.jsxs(ThemeItem, { isSelected: theme.id === currentTheme, onClick: () => onThemeChange(theme.id), borderColor: theme.quaternaryColor, children: [jsxRuntime.jsx(ThemeName, { children: theme.title }), jsxRuntime.jsxs(ColorPalette, { children: [jsxRuntime.jsx(ColorBlock, { color: theme.primaryColor }), jsxRuntime.jsx(ColorBlock, { color: theme.secondaryColor }), jsxRuntime.jsx(ColorBlock, { color: theme.tertiaryColor }), jsxRuntime.jsx(ColorBlock, { color: theme.quaternaryColor })] })] }, theme.title))) }));
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

exports.ThemeSelector = ThemeSelector;
//# sourceMappingURL=index.js.map
