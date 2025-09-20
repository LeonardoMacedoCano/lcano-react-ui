import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { 
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaAngleLeft,
  FaAngleRight
} from 'react-icons/fa';
import Container from '../Container';
import Stack from '../Stack';
import { PagedResponse } from '../../types';

export interface SearchPaginationProps {
  page: PagedResponse<any>;
  height?: string;
  width?: string;
  loadPage: (pageIndex: number, pageSize: number) => void;
}

interface NavigationHandlers {
  goToFirst: () => void;
  goToPrevious: () => void;
  goToNext: () => void;
  goToLast: () => void;
}

interface PaginationState {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

const usePaginationState = (page: PagedResponse<any>): PaginationState => {
  const [currentPageIndex, setCurrentPageIndex] = useState(page.number);

  useEffect(() => {
    setCurrentPageIndex(page.number);
  }, [page.number]);

  return useMemo(() => ({
    isFirstPage: currentPageIndex === 0,
    isLastPage: currentPageIndex === page.totalPages - 1,
    currentPage: currentPageIndex,
    totalPages: page.totalPages,
    pageSize: page.size,
  }), [currentPageIndex, page.totalPages, page.size]);
};

const useNavigationHandlers = (
  loadPage: (pageIndex: number, pageSize: number) => void,
  state: PaginationState
): NavigationHandlers => {
  const { currentPage, totalPages, pageSize } = state;

  return useMemo(() => ({
    goToFirst: () => {
      if (!state.isFirstPage) {
        loadPage(0, pageSize);
      }
    },
    goToPrevious: () => {
      if (currentPage > 0) {
        loadPage(currentPage - 1, pageSize);
      }
    },
    goToNext: () => {
      if (currentPage < totalPages - 1) {
        loadPage(currentPage + 1, pageSize);
      }
    },
    goToLast: () => {
      if (!state.isLastPage) {
        loadPage(totalPages - 1, pageSize);
      }
    },
  }), [loadPage, currentPage, totalPages, pageSize, state.isFirstPage, state.isLastPage]);
};

interface PaginationControlsProps {
  state: PaginationState;
  handlers: NavigationHandlers;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ state, handlers }) => {
  const { isFirstPage, isLastPage, currentPage, totalPages } = state;
  const { goToFirst, goToPrevious, goToNext, goToLast } = handlers;

  return (
    <StyledPaginationControls>
      <ControlItem onClick={goToFirst} disabled={isFirstPage}>
        <FaAngleDoubleLeft />
      </ControlItem>
      
      <ControlItem onClick={goToPrevious} disabled={isFirstPage}>
        <FaAngleLeft />
      </ControlItem>

      <PageIndicator>
        {currentPage + 1} / {totalPages}
      </PageIndicator>

      <ControlItem onClick={goToNext} disabled={isLastPage}>
        <FaAngleRight />
      </ControlItem>
      
      <ControlItem onClick={goToLast} disabled={isLastPage}>
        <FaAngleDoubleRight />
      </ControlItem>
    </StyledPaginationControls>
  );
};

const SearchPagination: React.FC<SearchPaginationProps> = ({ 
  page, 
  height, 
  width, 
  loadPage 
}) => {
  const state = usePaginationState(page);
  const handlers = useNavigationHandlers(loadPage, state);

  return (
    <Container
      height={height} 
      width={width}
      backgroundColor="transparent"
    >
      <Stack direction="row" alignCenter justifyCenter gap="10px">
        <PaginationControls state={state} handlers={handlers} />
      </Stack>
    </Container>
  );
};

export default SearchPagination;

const StyledPaginationControls = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.quaternary};
`;

interface ControlItemProps {
  disabled?: boolean;
}

const ControlItem = styled.li<ControlItemProps>`
  width: 35px;
  height: 35px;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  opacity: ${({ disabled }) => disabled ? '0.2' : '1'};

  &:hover {
    color: ${({ theme, disabled }) => 
      disabled ? theme.colors.white : theme.colors.gray
    };
  }
`;

const PageIndicator = styled.span`
  margin: 0 8px;
  user-select: none;
`;