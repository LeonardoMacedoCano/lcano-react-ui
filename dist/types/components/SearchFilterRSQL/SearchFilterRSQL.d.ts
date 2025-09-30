import React, { ReactNode } from 'react';
import { CSSProperties } from 'styled-components';
import { Field } from '../../types';
export type SearchFilterRSQLProps = {
    fields: Field[];
    onSearch: (rsql: string) => void;
    title?: ReactNode;
    width?: string;
    maxWidth?: string;
    padding?: string;
    transparent?: boolean;
    style?: CSSProperties;
};
declare const SearchFilterRSQL: React.FC<SearchFilterRSQLProps>;
export default SearchFilterRSQL;
//# sourceMappingURL=SearchFilterRSQL.d.ts.map