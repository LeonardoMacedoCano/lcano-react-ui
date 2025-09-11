import React from 'react';
import styled from 'styled-components';
import { Tema } from '../../types/Tema';

export interface ThemeOption {
  title: string;
  colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    [key: string]: string;
  };
}

export interface ThemeSelectorProps {
  themes: Tema[];
  currentTheme?: number;
  onThemeChange: (id: number) => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes,
  currentTheme,
  onThemeChange,
}) => {
  return (
    <ThemeGrid>
      {themes.map((theme) => (
        <ThemeItem 
          key={theme.title}
          isSelected={theme.id === currentTheme}
          onClick={() => onThemeChange(theme.id)}
          borderColor={theme.quaternaryColor}
        >
          <ThemeName>{theme.title}</ThemeName>
          <ColorPalette>
            <ColorBlock color={theme.primaryColor} />
            <ColorBlock color={theme.secondaryColor} />
            <ColorBlock color={theme.tertiaryColor} />
            <ColorBlock color={theme.quaternaryColor} />
          </ColorPalette>
        </ThemeItem>
      ))}
    </ThemeGrid>
  );
};

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  width: 100%;
`;

interface ThemeItemProps {
  isSelected: boolean;
  borderColor: string;
}

const ThemeItem = styled.div<ThemeItemProps>`
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

const ThemeName = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: ${props => props.theme.colors.white};
`;

interface ColorBlockProps {
  color: string;
}

const ColorPalette = styled.div`
  display: flex;
  height: 30px;
`;

const ColorBlock = styled.div<ColorBlockProps>`
  flex: 1;
  height: 100%;
  background-color: ${props => props.color};
`;

export default ThemeSelector;