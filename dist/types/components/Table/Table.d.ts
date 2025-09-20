import { ReactNode } from 'react';
import { PagedResponse } from '../../types';
export type ColumnProps<T> = {
    header: ReactNode;
    value(value: T, index: number): ReactNode;
    width?: string;
    align?: 'left' | 'center' | 'right';
    titleAlign?: 'left' | 'center' | 'right';
};
export declare const Column: <T extends any>({}: ColumnProps<T>) => any;
export interface TableActionsProps {
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
    customActions?: () => ReactNode;
    visible: boolean;
}
interface TableProps<T> {
    values: T[] | PagedResponse<T>;
    columns: ReactNode[];
    messageEmpty?: string;
    keyExtractor(item: T, index?: number): string | number;
    onClickRow?(item: T, index?: number): void;
    rowSelected?(item: T): boolean;
    loadPage?: (pageIndex: number, pageSize: number) => void;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
    customActions?: (item: T) => ReactNode;
}
export declare const Table: <T extends any>({ values, columns, messageEmpty, keyExtractor, onClickRow, rowSelected, loadPage, onView, onEdit, onDelete, customActions, }: TableProps<T>) => import("react/jsx-runtime").JSX.Element;
export default Table;
//# sourceMappingURL=Table.d.ts.map