import { OptionItem } from './SearchSelectField';

export interface SearchSelectAdapterParams<T> {
  searchOptions: (query: string, page: number, pageSize: number) => Promise<T[]>;
  mapToOption: (item: T) => OptionItem;
  mapFromOption: (option: OptionItem) => T;
  value?: T;
  onUpdate: (value?: T) => void;
  pageSize?: number;
}

export function buildSearchSelectAdapter<T>({
  searchOptions,
  mapToOption,
  mapFromOption,
  value,
  onUpdate,
  pageSize = 10,
}: SearchSelectAdapterParams<T>) {
  const fetchOptions = async (query: string, page: number) => {
    const data = await searchOptions(query, page, pageSize);
    return data.map(mapToOption);
  };

  const onSelect = (selected?: OptionItem) => {
    const newValue = selected ? mapFromOption(selected) : undefined;
    onUpdate(newValue);
  };

  const optionValue = value ? mapToOption(value) : undefined;

  return { fetchOptions, onSelect, optionValue };
}
