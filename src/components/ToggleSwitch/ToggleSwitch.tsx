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
  width?: string;
  maxWidth?: string;
  onChange: (value: T) => void;
}

const ToggleSwitch = <T extends string,>({ optionA, optionB, value, width, maxWidth, onChange }: ToggleSwitchProps<T>) => (
  <ToggleSwitchContainer $width={width} $maxWidth={maxWidth}>
    {[optionA, optionB].map((opt) => (
      <ToggleButtonStyled
        key={opt.value}
        type="button"
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
}

const ToggleSwitchContainer = styled.div<StyledProps>`
  box-sizing: border-box;
  display: inline-flex;
  width: ${({ $width }) => $width || "auto"};
  max-width: ${({ $maxWidth }) => $maxWidth || "100%"};
  gap: 2px;
  padding: 3px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.primary};
`;

const ToggleButtonStyled = styled.button<{ $active: boolean }>`
  box-sizing: border-box;
  cursor: pointer;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ theme, $active }) => ($active ? theme.colors.white : theme.colors.tertiary)};
  background-color: ${({ theme, $active }) => ($active ? getVariantColor(theme, "quaternary") : "transparent")};
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme, $active }) => ($active ? getVariantColor(theme, "quaternary") : theme.colors.secondary)};
  }
`;
