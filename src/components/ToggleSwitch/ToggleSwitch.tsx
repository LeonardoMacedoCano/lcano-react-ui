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

const ToggleSwitchContainer = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
`;

const ToggleButtonStyled = styled.button<{ $active: boolean }>`
  padding: 6px 16px;
  cursor: pointer;
  border: none;
  background: ${({ theme, $active }) =>
    $active ? getVariantColor(theme, 'primary') : theme.colors.primary};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.white : theme.colors.tertiary};
  font-size: 14px;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => getVariantColor(theme, 'primary')};
    color: ${({ theme }) => theme.colors.white};
  }
`;