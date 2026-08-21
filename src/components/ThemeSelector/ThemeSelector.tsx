import styled from 'styled-components';

export interface ThemeSelectorOption<T extends string | number = string> {
  id: T;
  title: string;
  swatch: string[];
  accentColor?: string;
}

export interface ThemeSelectorProps<T extends string | number = string> {
  options: ThemeSelectorOption<T>[];
  value: T;
  onChange: (id: T) => void;
}

const ThemeSelector = <T extends string | number = string>({ options, value, onChange }: ThemeSelectorProps<T>) => {
  return (
    <ThemeGrid>
      {options.map((option) => {
        const accentColor = option.accentColor ?? option.swatch[option.swatch.length - 1];
        return (
          <ThemeItem
            key={option.id}
            type="button"
            $isSelected={option.id === value}
            $borderColor={accentColor}
            onClick={() => onChange(option.id)}
          >
            <ThemeName>{option.title}</ThemeName>
            <ColorPalette>
              {option.swatch.map((color, i) => (
                <ColorBlock key={i} $color={color} />
              ))}
            </ColorPalette>
          </ThemeItem>
        );
      })}
    </ThemeGrid>
  );
};

export default ThemeSelector;

const ThemeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  width: 100%;
`;

interface ThemeItemProps {
  $isSelected: boolean;
  $borderColor: string;
}

const ThemeItem = styled.button<ThemeItemProps>`
  background-color: ${(props) => props.theme.colors.primary};
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  padding: 0;
  text-align: left;
  transition: transform 0.2s ease;
  border: 2px solid ${(props) => (props.$isSelected ? props.$borderColor : 'transparent')};

  &:hover {
    transform: translateY(-3px);
  }
`;

const ThemeName = styled.div`
  padding: 10px;
  text-align: center;
  font-weight: 600;
  color: ${(props) => props.theme.colors.white};
`;

const ColorPalette = styled.div`
  display: flex;
  height: 30px;
`;

interface ColorBlockProps {
  $color: string;
}

const ColorBlock = styled.div<ColorBlockProps>`
  flex: 1;
  height: 100%;
  background-color: ${(props) => props.$color};
`;
