import { FieldValueType, Option } from "./FieldValue";

export type Operator = {
  name: string;
  symbol: string;
};

export type SelectField = {
  name: string;
  label: string;
  type: 'SELECT';
  options: Option[];
};

export type NumberField = {
  name: string;
  label: string;
  type: 'NUMBER';
};

export type StringField = {
  name: string;
  label: string;
  type: 'STRING';
};

export type DateField = {
  name: string;
  label: string;
  type: 'DATE';
};

export type BooleanField = {
  name: string;
  label: string;
  type: 'BOOLEAN';
};

export type Field = SelectField | NumberField | StringField | DateField | BooleanField;

export type Locale = 'pt' | 'en';

type OperatorSymbol = '==' | '!=' | 'LIKE' | '>' | '<' | '>=' | '<=';

const OPERATOR_LABELS: Record<OperatorSymbol, Record<Locale, string>> = {
  LIKE: { pt: 'Contém', en: 'Contains' },
  '==': { pt: 'Igual', en: 'Equal' },
  '!=': { pt: 'Diferente', en: 'Different' },
  '>': { pt: 'Maior', en: 'Greater' },
  '<': { pt: 'Menor', en: 'Less' },
  '>=': { pt: 'Maior ou igual', en: 'Greater or equal' },
  '<=': { pt: 'Menor ou igual', en: 'Less or equal' },
};

const OPERATOR_SYMBOLS_BY_TYPE: Record<FieldValueType, OperatorSymbol[]> = {
  STRING: ['LIKE', '==', '!='],
  NUMBER: ['==', '!=', '>', '<', '>=', '<='],
  DATE: ['==', '!=', '>', '<', '>=', '<='],
  SELECT: ['==', '!='],
  BOOLEAN: ['=='],
  MONTH: ['==', '!=', '>', '<', '>=', '<='],
};

export function getOperators(fieldType: FieldValueType, locale: Locale = 'pt'): Operator[] {
  return OPERATOR_SYMBOLS_BY_TYPE[fieldType].map((symbol) => ({
    name: OPERATOR_LABELS[symbol][locale],
    symbol,
  }));
}

export const STRING_OPERATORS: Operator[] = getOperators('STRING');
export const NUMBER_OPERATORS: Operator[] = getOperators('NUMBER');
export const DATE_OPERATORS: Operator[] = getOperators('DATE');
export const SELECT_OPERATORS: Operator[] = getOperators('SELECT');
export const BOOLEAN_OPERATORS: Operator[] = getOperators('BOOLEAN');

export const OPERATORS: Record<FieldValueType, Operator[]> = {
  STRING: STRING_OPERATORS,
  NUMBER: NUMBER_OPERATORS,
  DATE: DATE_OPERATORS,
  SELECT: SELECT_OPERATORS,
  BOOLEAN: BOOLEAN_OPERATORS,
  MONTH: NUMBER_OPERATORS,
};

export type FilterItem = {
  value: any;
  operator: Operator;
  field: Field;
};

export type Filters = Record<string, FilterItem>;

export interface FilterDTO {
  field: string;
  operator: string;
  operadorDescr: string;
  value: string;
  type: FieldValueType;
}

export const PAGE_SIZE_DEFAULT = 10;
export const PAGE_SIZE_COMPACT = 5;
