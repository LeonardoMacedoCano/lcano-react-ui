import React, { FC, ChangeEvent, KeyboardEventHandler } from 'react';
import styled, { css } from 'styled-components';
import { SelectValue } from '../../types';
import {
  formatDateToYMString,
  formatDateToYMDString,
  parseDateStringToDate,
  getVariantColor,
  VariantColor,
} from '../../utils';

type FieldValueType = 'string' | 'number' | 'boolean' | 'date' | 'month' | 'select';

export type FieldValueProps = {
  type: FieldValueType;
  value?: string | number | boolean | SelectValue;
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
  options?: SelectValue[];
  icon?: React.ReactNode;
  padding?: string;
  placeholder?: string;
  maxDecimalPlaces?: number;
  maxIntegerDigits?: number;
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
  onUpdate,
  onKeyDown,
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!onUpdate) return;
    let val: any = event.target.value;

    switch (type) {
      case 'number':
        val = enforceNumeric(val);
        break;
      case 'boolean':
        val = val === 'true';
        break;
      case 'date':
        val = parseDateStringToDate(val);
        break;
    }

    onUpdate(val);
  };

  const enforceNumeric = (val: string) => {
    const [integerPart, decimalPart] = val.split('.');
    let newVal = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? `.${decimalPart.slice(0, maxDecimalPlaces)}` : '');
    if (minValue !== undefined && parseFloat(newVal) < minValue) newVal = String(minValue);
    if (maxValue !== undefined && parseFloat(newVal) > maxValue) newVal = String(maxValue);
    return newVal;
  };

  const formattedValue = () => {
    if (type === 'number' || type === 'string') return String(value);
    if (type === 'boolean') return value ? 'true' : 'false';
    if (type === 'date') return formatDateToYMDString(value as Date);
    if (type === 'month') return formatDateToYMString(value as Date);
    if (type === 'select') return (value as SelectValue)?.key ?? '';
    return '';
  };

  return (
    <FieldWrapper width={width} maxWidth={maxWidth} maxHeight={maxHeight} inline={inline} padding={padding}>
      {description && <Label title={hint}>{description}</Label>}

      {type === 'select' || type === 'boolean' ? (
        <StyledSelect
          value={formattedValue()}
          onChange={handleChange}
          disabled={!editable}
          inputWidth={inputWidth}
          inline={inline}
          variant={variant}
        >
          {type === 'select' && <option value="">{placeholder || 'Selecione...'}</option>}
          {type === 'select'
            ? options?.map(opt => <option key={opt.key} value={opt.key}>{opt.value}</option>)
            : (
              <>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </>
            )
          }
        </StyledSelect>
      ) : (
        <>
          {icon && <Icon>{icon}</Icon>}
          <StyledInput
            type={editable ? type : 'string'}
            readOnly={!editable}
            value={formattedValue()}
            onChange={handleChange}
            onKeyDown={onKeyDown}
            inputWidth={inputWidth}
            inline={inline}
            placeholder={placeholder}
            variant={variant}
          />
        </>
      )}
    </FieldWrapper>
  );
};

export default FieldValue;

interface StyledProps {
  width?: string;
  maxWidth?: string;
  maxHeight?: string;
  inline?: boolean;
  padding?: string;
  inputWidth?: string;
  readOnly?: boolean;
  variant?: VariantColor;
}

const FieldWrapper = styled.div<StyledProps>`
  width: ${({ width }) => width || '100%'};
  max-width: ${({ maxWidth }) => maxWidth || 'none'};
  max-height: ${({ maxHeight }) => maxHeight || 'none'};
  height: 100%;
  padding: ${({ padding }) => padding || '5px'};
  display: flex;
  flex-direction: ${({ inline }) => (inline ? 'row' : 'column')};
  align-items: ${({ inline }) => (inline ? 'center' : 'stretch')};
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
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : '0')};
  cursor: ${({ readOnly }) => (readOnly ? 'not-allowed' : 'pointer')};

  &::-webkit-calendar-picker-indicator {
    filter: invert(100%);
  }

  ${({ variant, theme }) =>
    variant &&
    css`
      color: ${getVariantColor(theme, variant)};
    `}
`;

const StyledSelect = styled.select<StyledProps>`
  width: ${({ inputWidth }) => inputWidth || '100%'};
  font-size: 15px;
  height: 100%;
  outline: none;
  background-color: transparent;
  margin-left: ${({ inline }) => (inline ? '5px' : '0')};

  ${({ variant, theme }) =>
    variant &&
    css`
      color: ${getVariantColor(theme, variant)};
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
