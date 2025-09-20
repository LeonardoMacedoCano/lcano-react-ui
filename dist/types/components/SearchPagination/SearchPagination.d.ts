import React from 'react';
import { PagedResponse } from '../../types';
export interface SearchPaginationProps {
    page: PagedResponse<any>;
    height?: string;
    width?: string;
    loadPage: (pageIndex: number, pageSize: number) => void;
}
declare const SearchPagination: React.FC<SearchPaginationProps>;
export default SearchPagination;
//# sourceMappingURL=SearchPagination.d.ts.map