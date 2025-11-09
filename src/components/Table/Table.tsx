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
};

export const Column = <T extends any>({}: ColumnProps<T>) => null;

export interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  customActions?: () => ReactNode;
  visible: boolean;
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
  customActions 
}) => (
  <ActionsContainer>
    <ActionsWrapper visible={visible}>
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
}

const isPagedResponse = <T,>(values: T[] | PagedResponse<T>): values is PagedResponse<T> => 
  typeof values === 'object' && values !== null && 'content' in values;

const getTableData = <T,>(values: T[] | PagedResponse<T>): T[] => 
  isPagedResponse(values) ? values.content || [] : values;

const TableHeader: FC<{ columns: ReactNode[] }> = ({ columns }) => (
  <thead>
    <TableHeadRow>
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
        >
          {columns.map((column, columnIndex) => {
            if (!React.isValidElement(column)) return null;
            
            const { value, width, align } = column.props as ColumnProps<T>;
            const isSelected = rowSelected?.(item) ?? false;
            
            return (
              <TableColumn
                key={columnIndex}
                isSelected={isSelected}
                width={width}
                align={align}
              >
                <TruncatedContent>
                  {value(item, index)}
                </TruncatedContent>
              </TableColumn>
            );
          })}
          
          <ActionColumn>
            <TableActions
              onView={onView ? () => onView(item) : undefined}
              onEdit={onEdit ? () => onEdit(item) : undefined}
              onDelete={onDelete ? () => onDelete(item) : undefined}
              visible={hoveredRowIndex === index}
              customActions={customActions ? () => customActions(item) : undefined}
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
          <TableHeader columns={columns} />
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
          />
        </StyledTable>
      </TableContainer>
      
      <TablePagination values={values} loadPage={loadPage} />
    </Container>
  );
};

const TableContainer = styled.div`
  width: 100%;
  overflow: hidden;
  table-layout: fixed;
`;

const EmptyMessage = styled.div`
  padding: 10px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeadRow = styled.tr`
  border-bottom: 2px solid ${({ theme }) => theme.colors.quaternary};
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
  isSelected?: boolean; 
  width?: string; 
  align?: string;
}>`
  font-size: 13px;
  height: 35px;
  text-align: ${({ align }) => align || 'left'};
  border-left: 1px solid ${({ theme }) => theme.colors.gray};
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${({ width }) => width || 'auto'};
  width: ${({ width }) => width || 'auto'};
  padding: 0 5px;
  display: table-cell;

  &:first-child::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 5px;
    background-color: ${({ theme, isSelected }) => 
      isSelected ? theme.colors.quaternary : 'transparent'
    };
  }

  &:first-child {
    border-left: none;
  }
`;

const TruncatedContent = styled.div`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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

const TableRow = styled.tr<{ isSelected?: boolean }>`
  background-color: ${({ theme }) => theme.colors.secondary};
  position: relative;

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.tertiary};
  }

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  }
`;

const ActionColumn = styled.td`
  position: sticky;
  right: 0;
  padding: 2px;
  z-index: 2;
`;

const ActionsContainer = styled.div`
  position: relative;
  height: 100%;
`;

const ActionsWrapper = styled.div<{ visible: boolean }>`
  position: sticky;
  top: 0;
  right: 5px;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  opacity: ${({ visible }) => visible ? 1 : 0};
  pointer-events: ${({ visible }) => visible ? 'auto' : 'none'};
  transition: opacity 0.2s ease-in-out;
`;

const CustomActionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  gap: 8px;
  align-items: center;
`;

export default Table;