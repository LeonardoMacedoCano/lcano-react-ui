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
export declare const STRING_OPERATORS: Operator[];
export declare const NUMBER_OPERATORS: Operator[];
export declare const DATE_OPERATORS: Operator[];
export declare const SELECT_OPERATORS: Operator[];
export declare const BOOLEAN_OPERATORS: Operator[];
export declare const OPERATORS: Record<FieldValueType, Operator[]>;
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
export declare const PAGE_SIZE_DEFAULT = 10;
export declare const PAGE_SIZE_COMPACT = 5;
//# sourceMappingURL=Filters.d.ts.map