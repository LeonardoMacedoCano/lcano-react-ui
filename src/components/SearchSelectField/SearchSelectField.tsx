import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { FieldValue } from '../FieldValue';

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

const SearchSelectField: React.FC<SearchSelectFieldProps> = ({
  label,
  placeholder,
  fetchOptions,
  onSelect,
  value,
  loadAllOnFocus = true,
}) => {
  const [query, setQuery] = useState(value?.value || '');
  const [options, setOptions] = useState<OptionItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<OptionItem | null>(value || null);

  useEffect(() => {
    selectedRef.current = value || null;
    setQuery(value?.value || '');
  }, [value]);

  const loadOptions = useCallback(async (searchQuery: string) => {
    setLoading(true);
    try {
      const result = await fetchOptions(searchQuery, 0);
      setOptions(result);
    } catch {
      setOptions([]);
    } finally {
      setLoading(false);
    }
  }, [fetchOptions]);

  useEffect(() => {
    if (!showDropdown) return;
    const timeout = setTimeout(() => {
      if (query || loadAllOnFocus) loadOptions(query);
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, showDropdown, loadAllOnFocus, loadOptions]);

  const handleFocus = () => {
    setShowDropdown(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      const selectedKeyNum = Number(selectedRef.current?.key || 0);
      if (!selectedRef.current || selectedKeyNum <= 0) {
        clearSelection();
      } else {
        setShowDropdown(false);
      }
    }
  };

  const handleSelect = (option: OptionItem) => {
    setQuery(option.value);
    selectedRef.current = option;
    onSelect(option);
    setShowDropdown(false);
  };

  const clearSelection = () => {
    setQuery('');
    selectedRef.current = null;
    onSelect(undefined);
    setOptions([]);
    setShowDropdown(false);
  };

  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (selectedRef.current && val !== selectedRef.current.value) {
      selectedRef.current = null;
    }
  };

  const renderIcon = () => {
    if (loading) return <Spinner />;
    if (selectedRef.current)
      return (
        <ClearIcon
          onClick={(e) => {
            e.stopPropagation();
            clearSelection();
          }}
        >
          <FaTimes />
        </ClearIcon>
      );
    return <SearchIcon><FaSearch /></SearchIcon>;
  };

  return (
    <Wrapper ref={containerRef} tabIndex={-1} onBlur={handleBlur}>
      <FieldWrapper onClick={handleFocus}>
        <FieldValue
          description={label}
          type="STRING"
          value={query}
          placeholder={placeholder || 'Digite para pesquisar...'}
          editable
          onUpdate={handleQueryChange}
        />
        <IconWrapper>{renderIcon()}</IconWrapper>
      </FieldWrapper>

      {showDropdown && (
        <Dropdown>
          {loading ? (
            <DropdownItem disabled><Spinner /></DropdownItem>
          ) : options.length > 0 ? (
            options.map(option => (
              <DropdownItem key={option.key} onClick={() => handleSelect(option)}>
                {option.value}
              </DropdownItem>
            ))
          ) : (
            <DropdownItem disabled>Nenhum resultado</DropdownItem>
          )}
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default SearchSelectField;

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  outline: none;
`;

const FieldWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: text;
`;

const IconWrapper = styled.div`
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  color: ${({ theme }) => theme.colors.white};
  font-size: 14px;
`;

const ClearIcon = styled.div`
  color: ${({ theme }) => theme.colors.tertiary};
  font-size: 14px;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.red};
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-top: 2px solid ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  width: 14px;
  height: 14px;
  animation: ${spin} 1s linear infinite;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
  background-color: ${({ theme }) => theme.colors.secondary};
  border: 1px solid ${({ theme }) => theme.colors.quaternary};
  border-radius: 4px;
  margin-top: 4px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  max-height: 250px;
  overflow-y: auto;
`;

const DropdownItem = styled.div<{ disabled?: boolean }>`
  padding: 10px;
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  background-color: ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.tertiary};
  &:hover {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colors.secondary : theme.colors.tertiary};
  }
`;
