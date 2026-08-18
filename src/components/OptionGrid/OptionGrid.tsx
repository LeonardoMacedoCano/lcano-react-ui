import styled from 'styled-components';
import { Locale } from '../../types';

export interface OptionGridOption<T extends string> {
  id: T;
  label: string;
  description?: string;
  swatch?: string[];
}

export interface OptionGridProps<T extends string> {
  options: OptionGridOption<T>[];
  value: T;
  onChange: (id: T) => void;
  locale?: Locale;
  minItemWidth?: string;
}

const UI_TEXT: Record<Locale, { selectedLabel: string }> = {
  pt: { selectedLabel: 'Selecionado' },
  en: { selectedLabel: 'Selected' },
};

const OptionGrid = <T extends string>({ options, value, onChange, locale = 'pt', minItemWidth = '160px' }: OptionGridProps<T>) => {
  const text = UI_TEXT[locale];

  return (
    <OptionGridContainer $minItemWidth={minItemWidth}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <OptionGridCard key={option.id} type="button" $active={active} onClick={() => onChange(option.id)}>
            {option.swatch && (
              <OptionGridSwatch>
                {option.swatch.map((color, i) => (
                  <OptionGridSwatchSlice key={i} style={{ backgroundColor: color }} />
                ))}
              </OptionGridSwatch>
            )}
            <OptionGridLabel>{option.label}</OptionGridLabel>
            {option.description && <OptionGridDescription>{option.description}</OptionGridDescription>}
            {active && <OptionGridBadge>{text.selectedLabel}</OptionGridBadge>}
          </OptionGridCard>
        );
      })}
    </OptionGridContainer>
  );
};

export default OptionGrid;

export const OptionGridContainer = styled.div<{ $minItemWidth: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $minItemWidth }) => $minItemWidth}, 1fr));
  gap: 12px;
`;

export const OptionGridCard = styled.button<{ $active: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border-radius: 8px;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 2px solid ${({ theme, $active }) => ($active ? theme.colors.quaternary : theme.colors.gray)};
  cursor: pointer;
`;

export const OptionGridSwatch = styled.div`
  display: flex;
  height: 32px;
  border-radius: 6px;
  overflow: hidden;
`;

export const OptionGridSwatchSlice = styled.div`
  flex: 1;
`;

export const OptionGridLabel = styled.span`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

export const OptionGridDescription = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.colors.tertiary};
`;

export const OptionGridBadge = styled.span`
  align-self: flex-start;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7em;
  font-weight: bold;
  text-transform: uppercase;
  background-color: ${({ theme }) => theme.colors.quaternary};
  color: ${({ theme }) => theme.colors.white};
`;
