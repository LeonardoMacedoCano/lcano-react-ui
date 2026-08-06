import React, { ReactNode, useState, FC, useMemo } from 'react';
import styled from 'styled-components';
import { FaEdit, FaEye, FaTrash } from 'react-icons/fa';
import { PagedResponse } from '../../types';
import { SearchPagination } from '../SearchPagination';
import { Button } from '../Button';
import { Container } from '../Container';

export type ColumnProps<T> = {
  header: ReactNode;
  value(value: T, index: number): ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  titleAlign?: 'left' | 'center' | 'right';
  wrap?: boolean;
  stackLabel?: string;
};

const DEFAULT_STACK_BELOW = '700px';

const stackLabelFor = <T extends any>(column: ColumnProps<T>): string | undefined =>
  column.stackLabel ?? (typeof column.header === 'string' ? column.header : undefined);

export const Column = <T extends any>({}: ColumnProps<T>) => null;

export interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: () => ReactNode;
  visible: boolean;
  stackBelow?: string;
}

const COMMON_BUTTON_STYLES = {
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  height: '25px',
  width: '25px',
} as const;

const TableActions: FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
  visible,
  customActions,
  stackBelow = DEFAULT_STACK_BELOW,
}) => (
  <ActionsContainer>
    <ActionsWrapper $visible={visible} $stackBelow={stackBelow}>
      {customActions && (
        <CustomActionWrapper>
          {customActions()}
        </CustomActionWrapper>
      )}

      {onView && (
        <Button
          onClick={onView}
          variant="success"
          icon={<FaEye />}
          hint="Visualizar"
          style={COMMON_BUTTON_STYLES}
        />
      )}
      
      {onEdit && (
        <Button
          variant="info"
          icon={<FaEdit />}
          onClick={onEdit}
          style={COMMON_BUTTON_STYLES}
        />
      )}
      
      {onDelete && (
        <Button
          variant="warning"
          icon={<FaTrash />}
          onClick={onDelete}
          style={COMMON_BUTTON_STYLES}
        />
      )}
    </ActionsWrapper>
  </ActionsContainer>
);

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
  rowHeight?: string;
  clickableRows?: boolean;
  rowClickHint?: string;
  stackBelow?: string;
}

const isPagedResponse = <T,>(values: T[] | PagedResponse<T>): values is PagedResponse<T> => 
  typeof values === 'object' && values !== null && 'content' in values;

const getTableData = <T,>(values: T[] | PagedResponse<T>): T[] => 
  isPagedResponse(values) ? values.content || [] : values;

const TableHeader: FC<{ columns: ReactNode[]; stackBelow: string }> = ({ columns, stackBelow }) => (
  <thead>
    <TableHeadRow $stackBelow={stackBelow}>
      {columns.map((column, index) => {
        if (!React.isValidElement(column)) return null;

        const { header, titleAlign = 'center' } = column.props as ColumnProps<any>;

        return (
          <TableHeadColumn key={index}>
            <TableColumnTitle align={titleAlign}>
              {header}
            </TableColumnTitle>
          </TableHeadColumn>
        );
      })}
    </TableHeadRow>
  </thead>
);

interface TableBodyProps<T> {
  data: T[];
  columns: ReactNode[];
  messageEmpty?: string;
  keyExtractor: (item: T, index?: number) => string | number;
  onClickRow?: (item: T, index?: number) => void;
  rowSelected?: (item: T) => boolean;
  onView?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  customActions?: (item: T) => ReactNode;
  hoveredRowIndex: number | null;
  onRowHover: (index: number | null) => void;
  rowHeight?: string;
  clickableRows?: boolean;
  rowClickHint?: string;
  stackBelow: string;
}

const TableBody = <T,>({
  data,
  columns,
  messageEmpty,
  keyExtractor,
  onClickRow,
  rowSelected,
  onView,
  onEdit,
  onDelete,
  customActions,
  hoveredRowIndex,
  onRowHover,
  rowHeight,
  clickableRows,
  rowClickHint,
  stackBelow,
}: TableBodyProps<T>) => {
  if (data.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columns.length + 1}>
            <EmptyMessage>{messageEmpty}</EmptyMessage>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {data.map((item, index) => (
        <TableRow
          key={keyExtractor(item, index)}
          onClick={() => onClickRow?.(item, index)}
          onMouseEnter={() => onRowHover(index)}
          onMouseLeave={() => onRowHover(null)}
          $clickable={!!clickableRows}
          $stackBelow={stackBelow}
          title={clickableRows ? rowClickHint : undefined}
        >
          {columns.map((column, columnIndex) => {
            if (!React.isValidElement(column)) return null;

            const columnProps = column.props as ColumnProps<T>;
            const { value, width, align, wrap } = columnProps;
            const isSelected = rowSelected?.(item) ?? false;

            return (
              <TableColumn
                key={columnIndex}
                $isSelected={isSelected}
                $width={width}
                $align={align}
                $rowHeight={rowHeight}
                $wrap={wrap}
                $stackBelow={stackBelow}
                data-label={stackLabelFor(columnProps)}
              >
                <TruncatedContent $wrap={wrap}>
                  {value(item, index)}
                </TruncatedContent>
              </TableColumn>
            );
          })}

          <ActionColumn $stackBelow={stackBelow}>
            <TableActions
              onView={onView ? () => onView(item) : undefined}
              onEdit={onEdit ? () => onEdit(item) : undefined}
              onDelete={onDelete ? () => onDelete(item) : undefined}
              visible={hoveredRowIndex === index}
              customActions={customActions ? () => customActions(item) : undefined}
              stackBelow={stackBelow}
            />
          </ActionColumn>
        </TableRow>
      ))}
    </tbody>
  );
};

interface TablePaginationProps {
  values: any[] | PagedResponse<any>;
  loadPage?: (pageIndex: number, pageSize: number) => void;
}

const TablePagination: FC<TablePaginationProps> = ({ values, loadPage }) => {
  if (!loadPage || !isPagedResponse(values) || values.totalElements <= 0) {
    return null;
  }

  return (
    <SearchPagination 
      height="35px" 
      page={values} 
      loadPage={loadPage} 
    />
  );
};

export const Table = <T extends any>({
  values,
  columns,
  messageEmpty,
  keyExtractor,
  onClickRow,
  rowSelected,
  loadPage,
  onView,
  onEdit,
  onDelete,
  customActions,
  rowHeight,
  clickableRows,
  rowClickHint,
  stackBelow = DEFAULT_STACK_BELOW,
}: TableProps<T>) => {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const tableData = useMemo(() => getTableData(values), [values]);

  const isEmpty = tableData.length === 0;

  if (isEmpty) {
    return (
      <Container backgroundColor="transparent" width="100%">
        <EmptyMessage>{messageEmpty}</EmptyMessage>
      </Container>
    );
  }

  return (
    <Container backgroundColor="transparent" width="100%">
      <TableContainer>
        <StyledTable>
          <TableHeader columns={columns} stackBelow={stackBelow} />
          <TableBody
            data={tableData}
            columns={columns}
            messageEmpty={messageEmpty}
            keyExtractor={keyExtractor}
            onClickRow={onClickRow}
            rowSelected={rowSelected}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            customActions={customActions}
            hoveredRowIndex={hoveredRowIndex}
            onRowHover={setHoveredRowIndex}
            rowHeight={rowHeight}
            clickableRows={clickableRows}
            rowClickHint={rowClickHint}
            stackBelow={stackBelow}
          />
        </StyledTable>
      </TableContainer>
      
      <TablePagination values={values} loadPage={loadPage} />
    </Container>
  );
};

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const EmptyMessage = styled.div`
  padding: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeadRow = styled.tr<{ $stackBelow: string }>`
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: none;
  }
`;

const TableHeadColumn = styled.th`
  padding: 0 3px;
  text-align: left;
  background-color: transparent;
  border-left: 1px solid ${({ theme }) => theme.colors.gray};

  &:first-child {
    border-left: none;
  }
`;

const TableColumn = styled.td<{
  $isSelected?: boolean;
  $width?: string;
  $align?: string;
  $rowHeight?: string;
  $wrap?: boolean;
  $stackBelow: string;
}>`
  font-size: 13px;
  height: ${({ $rowHeight }) => $rowHeight || '35px'};
  text-align: ${({ $align }) => $align || 'left'};
  vertical-align: middle;
  border-left: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  overflow: hidden;
  text-overflow: ${({ $wrap }) => ($wrap ? 'clip' : 'ellipsis')};
  max-width: ${({ $width }) => $width || 'auto'};
  width: ${({ $width }) => $width || 'auto'};
  padding: 0 5px;
  display: table-cell;

  &:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.quaternary : 'transparent'
    };
  }

  &:first-child {
    border-left: none;
  }

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
    max-width: 100%;
    height: auto;
    white-space: normal;
    text-overflow: clip;
    border-left: none;
    padding: 4px 12px;

    &[data-label]::before,
    &:first-child[data-label]::before {
      content: attr(data-label);
      position: static;
      width: auto;
      background: none;
      display: block;
      font-size: 11px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: ${({ theme }) => theme.colors.quaternary};
    }
  }
`;

const TruncatedContent = styled.div<{ $wrap?: boolean }>`
  white-space: ${({ $wrap }) => ($wrap ? 'normal' : 'nowrap')};
  overflow: hidden;
  text-overflow: ${({ $wrap }) => ($wrap ? 'clip' : 'ellipsis')};
  display: block;
  width: 100%;
`;

const TableColumnTitle = styled.div<{ align?: string }>`
  font-size: 14px;
  height: 40px;
  text-align: ${({ align }) => align};
  display: flex;
  align-items: center;
  justify-content: ${({ align }) =>
    align === 'left' ? 'flex-start' : 
    align === 'right' ? 'flex-end' : 'center'
  };
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.quaternary};
`;

const TableRow = styled.tr<{ isSelected?: boolean; $clickable?: boolean; $stackBelow: string }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  }

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    display: flex;
    flex-direction: column;
    gap: 2px;
    border-radius: 8px;
    margin-bottom: 10px;

    &:last-child {
      border-bottom: none;
    }
  }
`;

const ActionColumn = styled.td<{ $stackBelow: string }>`
  position: sticky;
  right: 0;
  padding: 2px;
  z-index: 2;

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    position: static;
    display: block;
    width: 100%;
  }
`;

const ActionsContainer = styled.div`
  position: relative;
  height: 100%;
`;

const ActionsWrapper = styled.div<{ $visible: boolean; $stackBelow: string }>`
  position: sticky;
  top: 0;
  right: 5px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  opacity: ${({ $visible }) => $visible ? 1 : 0};
  pointer-events: ${({ $visible }) => $visible ? 'auto' : 'none'};
  transition: opacity 0.2s ease-in-out;

  @media (max-width: ${({ $stackBelow }) => $stackBelow}) {
    position: static;
    justify-content: flex-start;
    opacity: 1;
    pointer-events: auto;
  }
`;

const CustomActionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
`;

export default Table;