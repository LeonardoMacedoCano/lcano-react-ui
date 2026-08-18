import React, { FC, ChangeEvent, KeyboardEventHandler, useState } from 'react';
import styled, { css } from 'styled-components';
import { FieldValueType, Locale, Option, VariantColor } from '../../types';
import { formatFieldValueToString, formatGroupedNumber, getVariantColor, parseDateStringToDate, sanitizeNumericInput } from '../../utils';

export type NumberFormatStyle = 'grouped' | 'plain';

export type FieldValueProps = {
  type: FieldValueType;
  value?: string | number | boolean | Option;
  variant?: VariantColor;
  description?: string;
  hint?: string;
  editable?: boolean;
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  minValue?: number;
  maxValue?: number;
  inputWidth?: string;
  inline?: boolean;
  options?: Option[];
  icon?: React.ReactNode;
  padding?: string;
  placeholder?: string;
  maxDecimalPlaces?: number;
  maxIntegerDigits?: number;
  locale?: Locale;
  numberFormat?: NumberFormatStyle;
  onUpdate?: (value: any) => void;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

const FieldValue: FC<FieldValueProps> = ({
  type,
  value = '',
  variant,
  description,
  hint,
  editable = true,
  width,
  maxWidth,
  maxHeight,
  minValue,
  maxValue,
  inputWidth,
  inline,
  options,
  icon,
  padding,
  placeholder,
  maxDecimalPlaces = 2,
  maxIntegerDigits = 8,
  locale = 'pt',
  numberFormat = 'grouped',
  onUpdate,
  onKeyDown,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const rawValue = formatFieldValueToString(type, value);
  const isGroupedNumber = type === 'NUMBER' && numberFormat === 'grouped';
  const displayValue = isGroupedNumber && !isFocused
    ? formatGroupedNumber(rawValue, locale, maxDecimalPlaces)
    : rawValue;

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!onUpdate) return;
    let val: any = event.target.value;

    switch (type) {
      case 'NUMBER':
        val = sanitizeNumericInput(val, maxIntegerDigits, maxDecimalPlaces, minValue, maxValue);
        break;
      case 'BOOLEAN':
        val = val === 'true';
        break;
      case 'DATE':
        val = parseDateStringToDate(val);
        break;
    }

    onUpdate(val);
  };

  const renderInput = () => (
    <>
      {icon && <Icon>{icon}</Icon>}
      <StyledInput
        type={editable ? (type === 'NUMBER' ? 'text' : type) : 'string'}
        inputMode={type === 'NUMBER' ? 'decimal' : undefined}
        readOnly={!editable}
        disabled={!editable}
        value={displayValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        $inputWidth={inputWidth}
        $inline={inline}
        $variant={variant}
        $editable={editable}
      />
    </>
  );

  const renderSelect = () => (
    <StyledSelect
      value={displayValue}
      onChange={handleChange}
      disabled={!editable}
      $inputWidth={inputWidth}
      $inline={inline}
      $variant={variant}
      $editable={editable}
    >
      {type === 'SELECT' && <option value="">{placeholder || 'Selecione...'}</option>}
      {type === 'SELECT'
        ? options?.map(opt => <option key={opt.key} value={opt.key}>{opt.value}</option>)
        : (
          <>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </>
        )}
    </StyledSelect>
  );

  return (
    <FieldWrapper $width={width} $maxWidth={maxWidth} $maxHeight={maxHeight} $inline={inline} $padding={padding}>
      {description && <Label title={hint}>{description}</Label>}
      {type === 'SELECT' || type === 'BOOLEAN' ? renderSelect() : renderInput()}
    </FieldWrapper>
  );
};

export default FieldValue;

interface StyledProps {
  $width?: string;
  $maxWidth?: string;
  $maxHeight?: string;
  $inline?: boolean;
  $padding?: string;
  $inputWidth?: string;
  $readOnly?: boolean;
  $editable?: boolean;
  $variant?: VariantColor;
}

const FieldWrapper = styled.div<StyledProps>`
  box-sizing: border-box;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth || '100%'};
  max-height: ${({ $maxHeight }) => $maxHeight || 'none'};
  height: 100%;
  min-height: 36px;
  padding: ${({ $padding }) => $padding || '5px'};
  display: flex;
  flex-direction: ${({ $inline }) => ($inline ? 'row' : 'column')};
  align-items: ${({ $inline }) => ($inline ? 'center' : 'stretch')};
`;

const Label = styled.span`
  color: ${({ theme }) => theme.colors.quaternary};
  font-weight: bold;
  font-size: 15px;
  height: 100%;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<StyledProps>`
  box-sizing: border-box;
  width: ${({ $inputWidth }) => $inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  min-height: 26px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'pointer')};

  &[type=number]::-webkit-outer-spin-button,
  &[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::-webkit-calendar-picker-indicator {
    filter: invert(100%);
  }

  ${({ $variant, theme }) =>
    $variant &&
    css`
      color: ${getVariantColor(theme, $variant)};
    `}
`;

const StyledSelect = styled.select<StyledProps>`
  width: ${({ $inputWidth }) => $inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  min-height: 26px;
  outline: none;
  background-color: transparent;
  margin-left: ${({ $inline }) => ($inline ? '5px' : '0')};
  cursor: ${({ $editable }) => ($editable === false ? 'not-allowed' : 'pointer')};

  ${({ $variant, theme }) =>
    $variant &&
    css`
      color: ${getVariantColor(theme, $variant)};
    `}

  option {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Icon = styled.div`
  height: 100%;
  width: auto;
`;
