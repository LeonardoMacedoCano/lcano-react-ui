import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { SearchPagination } from '../SearchPagination';
import { Stack } from '../Stack';
import { paginateClientSide } from '../../utils';

const GRID_GAP_PX = 10;
const DEFAULT_ROWS_PER_PAGE = 3;
const DEFAULT_MIN_ITEM_WIDTH = '240px';

type ColumnBasis = { unit: 'px'; value: number } | { unit: 'percent'; value: number };

function parseColumnBasis(minItemWidth: string): ColumnBasis {
  const trimmed = minItemWidth.trim();
  if (trimmed.endsWith('%')) {
    return { unit: 'percent', value: parseFloat(trimmed) || 100 };
  }
  return { unit: 'px', value: parseInt(trimmed, 10) || 240 };
}

function useColumnCount(basis: ColumnBasis): [(element: HTMLDivElement | null) => void, number] {
  const [columns, setColumns] = useState(() => (basis.unit === 'percent' ? Math.max(1, Math.floor(100 / basis.value)) : 1));
  const observerRef = useRef<ResizeObserver | null>(null);

  const setContainer = useCallback(
    (element: HTMLDivElement | null) => {
      observerRef.current?.disconnect();
      observerRef.current = null;

      if (basis.unit === 'percent') {
        setColumns(Math.max(1, Math.floor(100 / basis.value)));
        return;
      }

      if (!element) return;

      function updateColumns() {
        const width = element!.clientWidth;
        const computed = Math.floor((width + GRID_GAP_PX) / ((basis as { unit: 'px'; value: number }).value + GRID_GAP_PX));
        setColumns(Math.max(1, computed));
      }

      updateColumns();
      const observer = new ResizeObserver(updateColumns);
      observer.observe(element);
      observerRef.current = observer;
    },
    [basis.unit, basis.value]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return [setContainer, columns];
}

export interface PaginatedGridProps<T> {
  items: T[];
  keyExtractor: (item: T) => string | number;
  renderItem: (item: T) => ReactNode;
  emptyMessage: string;
  rowsPerPage?: number;
  minItemWidth?: string;
}

const PaginatedGrid = <T,>({
  items,
  keyExtractor,
  renderItem,
  emptyMessage,
  rowsPerPage = DEFAULT_ROWS_PER_PAGE,
  minItemWidth = DEFAULT_MIN_ITEM_WIDTH,
}: PaginatedGridProps<T>) => {
  const [containerRef, columns] = useColumnCount(parseColumnBasis(minItemWidth));
  const pageSize = columns * rowsPerPage;
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex(0);
  }, [items, pageSize]);

  if (items.length === 0) return <PaginatedGridEmpty>{emptyMessage}</PaginatedGridEmpty>;

  const page = paginateClientSide(items, pageIndex, pageSize);

  return (
    <Stack direction="column" gap="10px">
      <PaginatedGridContainer ref={containerRef} $minItemWidth={minItemWidth}>
        {page.content.map((item) => (
          <div key={keyExtractor(item)}>{renderItem(item)}</div>
        ))}
      </PaginatedGridContainer>
      {page.totalPages > 1 && <SearchPagination page={page} loadPage={(nextPageIndex) => setPageIndex(nextPageIndex)} />}
    </Stack>
  );
};

export default PaginatedGrid;

export const PaginatedGridContainer = styled.div<{ $minItemWidth: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(${({ $minItemWidth }) => $minItemWidth}, 1fr));
  gap: ${GRID_GAP_PX}px;
`;

export const PaginatedGridEmpty = styled.div`
  opacity: 0.6;
  padding: 8px 0;
`;
