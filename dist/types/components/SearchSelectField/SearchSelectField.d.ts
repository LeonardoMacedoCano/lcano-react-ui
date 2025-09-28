import React from 'react';
export interface OptionItem {
    key: string;
    value: string;
}
export interface SearchSelectFieldProps {
    label: string;
    placeholder?: string;
    fetchOptions: (query: string, page: number) => Promise<OptionItem[]>;
    onSelect: (selected?: OptionItem) => void;
    value?: OptionItem;
    loadAllOnFocus?: boolean;
}
declare const SearchSelectField: React.FC<SearchSelectFieldProps>;
export default SearchSelectField;
//# sourceMappingURL=SearchSelectField.d.ts.map