import React from 'react';
import styled, { css } from 'styled-components';
import { convertReactStyleToCSSObject, getVariantColor } from '../../utils';
import { VariantColor } from '../../types';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: VariantColor;
  width?: string;
  height?: string;
  icon?: React.ReactNode;
  description?: string;
  hint?: string;
  disabledHover?: boolean;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  variant,
  description,
  width,
  height,
  icon,
  hint,
  disabled,
  disabledHover,
  style,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $width={width}
      $height={height}
      $hasDescription={!!description}
      $customStyle={style}
      title={hint}
      disabled={disabled}
      $disabledHover={disabledHover}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {description && <Description>{description}</Description>}
    </StyledButton>
  );
};

export default Button;

interface StyledButtonProps {
  $variant?: VariantColor;
  $width?: string;
  $height?: string;
  $hasDescription?: boolean;
  $disabledHover?: boolean;
  $customStyle?: React.CSSProperties;
}

const getButtonVariantStyles = (variant: StyledButtonProps['$variant'], theme: any) => {
  if (!variant) return '';
  return css`
    background-color: ${getVariantColor(theme, variant)};
    color: ${theme.colors.white};
  `;
};

const StyledButton = styled.button<StyledButtonProps>`
  box-sizing: border-box;
  border: ${({ $hasDescription, theme }) => ($hasDescription ? `1px solid ${theme.colors.gray}` : 'none')};
  border-radius: 6px;
  padding: ${({ $hasDescription }) => ($hasDescription ? '8px 16px' : '0')};
  font-size: 0.95em;
  font-weight: 600;
  cursor: ${props => (props.disabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: background-color 0.3s ease, opacity 0.3s ease;
  opacity: ${props => (props.disabled ? '0.3' : '1')};
  width: ${props => props.$width || 'auto'};
  height: ${props => props.$height || 'auto'};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: ${props => (props.$disabledHover ? '1' : '0.85')};
  }

  ${({ $variant, theme }) => getButtonVariantStyles($variant, theme)}

  ${props => props.$customStyle && css`${convertReactStyleToCSSObject(props.$customStyle)}`}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Description = styled.span`
  margin-left: 8px;
`;
