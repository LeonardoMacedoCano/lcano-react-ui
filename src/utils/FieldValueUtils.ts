import { FieldValueType } from "../types";
import { formatDateToYMDString, formatDateToYMString } from "./DateUtils";

export const formatFieldValueToString = (type: FieldValueType, value: any): string => {
  if (value === null || value === undefined) return '';

  switch (type) {
    case 'DATE':
      return value instanceof Date ? formatDateToYMDString(value) : String(value);
    case 'MONTH':
      return value instanceof Date ? formatDateToYMString(value) : String(value);
    case 'BOOLEAN':
      if (typeof value === 'boolean') return value ? 'true' : 'false';
      if (typeof value === 'string') return value.toLowerCase() === 'true' ? 'true' : 'false';
      return 'false';
    case 'NUMBER':
      return typeof value === 'number' ? String(value) : value ?? '';
    case 'SELECT':
      return typeof value === 'object' && value !== null ? value.key : String(value);
    default:
      return String(value);
  }
};

export const formatNumericInputWithLimits = (
  val: string,
  maxIntegerDigits: number,
  maxDecimalPlaces: number,
  minValue?: number,
  maxValue?: number
): string => {
  const [integerPart, decimalPart] = val.split('.');
  let newVal = integerPart.slice(0, maxIntegerDigits) + (decimalPart ? `.${decimalPart.slice(0, maxDecimalPlaces)}` : '');
  if (minValue !== undefined && parseFloat(newVal) < minValue) newVal = String(minValue);
  if (maxValue !== undefined && parseFloat(newVal) > maxValue) newVal = String(maxValue);
  return newVal;
};