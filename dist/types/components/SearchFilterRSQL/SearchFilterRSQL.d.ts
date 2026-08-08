import React from 'react';
import { Field, Locale } from '../../types';
export type SearchFilterRSQLProps = {
    fields: Field[];
    onSearch: (rsql: string) => void;
    locale?: Locale;
};
declare const SearchFilterRSQL: React.FC<SearchFilterRSQLProps>;
export default SearchFilterRSQL;
//# sourceMappingURL=SearchFilterRSQL.d.ts.map