import styled from "styled-components";
import { getVariantColor } from "../../utils";

export interface ToggleSwitchOption<T extends string> {
  label: string;
  value: T;
}

export interface ToggleSwitchProps<T extends string> {
  optionA: ToggleSwitchOption<T>;
  optionB: ToggleSwitchOption<T>;
  value: T;
  $width?: string;
  $maxWidth?: string;
  onChange: (value: T) => void;
}

const ToggleSwitch = <T extends string,>({ optionA, optionB, value, onChange }: ToggleSwitchProps<T>) => (
  <ToggleSwitchContainer>
    {[optionA, optionB].map((opt) => (
      <ToggleButtonStyled
        key={opt.value}
        $active={value === opt.value}
        onClick={() => onChange(opt.value)}
      >
        {opt.label}
      </ToggleButtonStyled>
    ))}
  </ToggleSwitchContainer>
);

export default ToggleSwitch;

interface StyledProps {
  $width?: string;
  $maxWidth?: string;
  $maxHeight?: string;
  $padding?: string;
}

const ToggleSwitchContainer = styled.div<StyledProps>`
  box-sizing: border-box;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  max-height: ${({ $maxHeight }) => $maxHeight || 'none'};
  height: 100%;
  padding: ${({ $padding }) => $padding || '5px'};
  display: flex;
`;

const ToggleButtonStyled = styled.button<{ $active: boolean }>`
  cursor: pointer;
  border: none;
  width: 100%;
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.tertiary};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => getVariantColor(theme, 'primary')};
    color: ${({ theme }) => theme.colors.white};
  }
`;