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

export const STRING_OPERATORS: Operator[] = [
  { name: 'Contém', symbol: 'LIKE' },
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' },
];

export const NUMBER_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' },
  { name: 'Maior', symbol: '>' },
  { name: 'Menor', symbol: '<' },
  { name: 'Maior ou igual', symbol: '>=' },
  { name: 'Menor ou igual', symbol: '<=' },
];

export const DATE_OPERATORS: Operator[] = [...NUMBER_OPERATORS];

export const SELECT_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
  { name: 'Diferente', symbol: '!=' },
];

export const BOOLEAN_OPERATORS: Operator[] = [
  { name: 'Igual', symbol: '==' },
];

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
