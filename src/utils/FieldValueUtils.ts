import { FieldValueType, Locale } from "../types";
import { formatDateToYMDString, formatDateToYMString } from "./DateUtils";

const NUMBER_LOCALE_TAG: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
};

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

export const sanitizeNumericInput = (
  val: string,
  maxIntegerDigits: number,
  maxDecimalPlaces: number,
  minValue?: number,
  maxValue?: number
): string => {
  let cleaned = val.replace(/[^\d.,]/g, '').replace(',', '.');
  const firstDot = cleaned.indexOf('.');
  if (firstDot !== -1) {
    cleaned = cleaned.slice(0, firstDot + 1) + cleaned.slice(firstDot + 1).replace(/\./g, '');
  }
  return formatNumericInputWithLimits(cleaned, maxIntegerDigits, maxDecimalPlaces, minValue, maxValue);
};

export const formatGroupedNumber = (
  val: string | number,
  locale: Locale = 'pt',
  maxDecimalPlaces: number = 2
): string => {
  if (val === '' || val === null || val === undefined) return '';
  const n = typeof val === 'number' ? val : parseFloat(val);
  if (Number.isNaN(n)) return String(val);
  return n.toLocaleString(NUMBER_LOCALE_TAG[locale], {
    minimumFractionDigits: Math.min(2, maxDecimalPlaces),
    maximumFractionDigits: maxDecimalPlaces,
  });
};