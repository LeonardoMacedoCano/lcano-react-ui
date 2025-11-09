import { OptionItem } from './SearchSelectField';
export interface SearchSelectAdapterParams<T> {
    searchOptions: (query: string, page: number, pageSize: number) => Promise<T[]>;
    mapToOption: (item: T) => OptionItem;
    mapFromOption: (option: OptionItem) => T;
    value?: T;
    onUpdate: (value?: T) => void;
    pageSize?: number;
}
export declare function buildSearchSelectAdapter<T>({ searchOptions, mapToOption, mapFromOption, value, onUpdate, pageSize, }: SearchSelectAdapterParams<T>): {
    fetchOptions: (query: string, page: number) => Promise<OptionItem[]>;
    onSelect: (selected?: OptionItem) => void;
    optionValue: OptionItem;
};
//# sourceMappingURL=SearchSelectFieldUtils.d.ts.map