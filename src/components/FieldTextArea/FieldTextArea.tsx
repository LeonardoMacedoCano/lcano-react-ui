import React, { ChangeEvent, useRef, useEffect, memo } from 'react';
import styled, { css } from 'styled-components';
import { VariantColor } from '../../types';
import { getVariantColor } from '../../utils';

export type FieldTextAreaProps = {
  value?: string;
  variant?: VariantColor;
  description?: string;
  hint?: string;
  editable?: boolean;
  width?: string;
  maxWidth?: string;
  maxLength?: number;
  minRows?: number;
  inline?: boolean;
  padding?: string;
  placeholder?: string;
  onUpdate?: (value: string) => void;
};

const FieldTextArea: React.FC<FieldTextAreaProps> = memo(({
  value = '',
  variant,
  description,
  hint,
  editable = true,
  width,
  maxWidth,
  maxLength = 500,
  minRows = 2,
  inline,
  padding,
  placeholder,
  onUpdate,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (!onUpdate) return;
    onUpdate(event.target.value);
  };

  return (
    <FieldWrapper $width={width} $maxWidth={maxWidth} $inline={inline} $padding={padding}>
      {description && <Label title={hint}>{description}</Label>}
      <StyledTextArea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        readOnly={!editable}
        disabled={!editable}
        maxLength={maxLength}
        placeholder={placeholder}
        rows={minRows}
        $variant={variant}
        $editable={editable}
        $inline={inline}
      />
    </FieldWrapper>
  );
});

export default FieldTextArea;

interface StyledProps {
  $width?: string;
  $maxWidth?: string;
  $inline?: boolean;
  $padding?: string;
  $editable?: boolean;
  $variant?: VariantColor;
}

const FieldWrapper = styled.div<StyledProps>`
  box-sizing: border-box;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  height: auto;
  padding: ${({ $padding }) => $padding || '5px'};
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  align-items: ${({ $inline }) => ($inline ? 'flex-start' : 'stretch')};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  display: flex;
  align-items: center;
  white-space: nowrap;
  margin-right: 5px;
`;

const StyledTextArea = styled.textarea<StyledProps>`
  box-sizing: border-box;
  width: 100%;
  font-size: 15px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'text')};
  resize: ${({ $editable }) => ($editable === false ? 'none' : 'vertical')};
  overflow: hidden;
  min-height: 25px;
  line-height: 1.4;
  font-family: inherit;
  padding: 4px;

  ${({ $variant, theme }) =>
    $variant &&
    css`
      color: ${getVariantColor(theme, $variant)};
    `}
`;
