import React from 'react';
import { Field, Locale } from '../../types';
export type SearchFilterRSQLProps = {
    fields: Field[];
    onSearch: (rsql: string) => void;
    /** Defaults to 'pt', matching every existing consumer that never set this. */
    locale?: Locale;
};
declare const SearchFilterRSQL: React.FC<SearchFilterRSQLProps>;
export default SearchFilterRSQL;
//# sourceMappingURL=SearchFilterRSQL.d.ts.map