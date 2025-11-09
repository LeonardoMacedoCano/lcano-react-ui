import React, { useState, useEffect, ReactNode } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { Field, FilterDTO, Operator, OPERATORS } from '../../types';
import { formatBooleanToSimNao, formatDateToYMDString, formatIsoDateToBrDate, getCurrentDate, parseDateStringToDate } from '../../utils';
import { Panel } from '../Panel';
import { Stack } from '../Stack';
import { FieldValue } from '../FieldValue';
import { Button } from '../Button';

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

const SearchFilterRSQL: React.FC<SearchFilterRSQLProps> = ({
  fields,
  onSearch,
  title,
  width,
  maxWidth,
  padding,
  transparent,
  style
}) => {
  const [selectedField, setSelectedField] = useState<Field | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [searchValue, setSearchValue] = useState<string | number | boolean | null>(null);
  const [filters, setFilters] = useState<FilterDTO[]>([]);

  useEffect(() => {
    if (!searchValue && selectedField) {
      const type = selectedField.type.toUpperCase();
      if (type === 'DATE') setSearchValue(formatDateToYMDString(getCurrentDate()));
      if (type === 'BOOLEAN') setSearchValue('true');
    }
  }, [selectedField]);

  const resetState = () => {
    setSelectedField(null);
    setSelectedOperator(null);
    setSearchValue(null);
  };

  const formatDate = (value: any): string => {
    if (value instanceof Date) return formatDateToYMDString(value);
    const parsed = parseDateStringToDate(value);
    return parsed ? formatDateToYMDString(parsed) : '';
  };

  const getFormattedValue = (f: FilterDTO): string => {
    const field = fields.find(fd => fd.name === f.field);
    if (!field) return f.value;

    switch (f.type) {
      case 'BOOLEAN':
        return formatBooleanToSimNao(f.value);
      case 'SELECT':
        return field.type === 'SELECT'
          ? field.options.find(opt => opt.key === f.value)?.value || f.value
          : f.value;
      case 'DATE':
        return formatIsoDateToBrDate(f.value);
      default:
        return f.value;
    }
  };

  const buildRsqlString = (filters: FilterDTO[]): string =>
    filters
      .map(({ field, operator, value }) => {
        let formattedOperator = operator;
        if (formattedOperator === 'LIKE') formattedOperator = '=ilike=';
        else if (!formattedOperator.includes('=')) formattedOperator = `=${formattedOperator}=`;
        return `${field}${formattedOperator}${value}`;
      })
      .join(';');

  const handleFieldChange = (fieldName: string) => {
    const field = fields.find(f => f.name === fieldName);
    if (!field) return resetState();
    setSelectedField(field);
    setSelectedOperator(OPERATORS[field.type][0]);
    setSearchValue(null);
  };

  const isDuplicateFilter = (newFilter: FilterDTO) => 
    filters.some(f => f.field === newFilter.field && f.operator === newFilter.operator && f.value === newFilter.value);

  const handleAdd = () => {
    if (!selectedField || !selectedOperator || searchValue === null) return;

    const valueFormatted = selectedField.type === 'DATE' ? formatDate(searchValue) : String(searchValue);

    const newFilter: FilterDTO = {
      field: selectedField.name,
      operator: selectedOperator.symbol,
      operadorDescr: selectedOperator.name,
      value: valueFormatted,
      type: selectedField.type
    };

    if (isDuplicateFilter(newFilter)) {
      resetState();
      return;
    }

    const updatedFilters = [...filters, newFilter];
    setFilters(updatedFilters);
    onSearch(buildRsqlString(updatedFilters));
    resetState();
  };

  const handleRemove = (index: number) => {
    const updated = filters.filter((_, i) => i !== index);
    setFilters(updated);
    onSearch(buildRsqlString(updated));
  };

  const isAddButtonDisabled = (): boolean => {
    if (!selectedField || !selectedOperator) return true;

    if (selectedField.type === 'DATE') {
      if (!searchValue) return true;
      const date = parseDateStringToDate(String(searchValue));
      return !date || isNaN(date.getTime());
    }

    return searchValue === null || searchValue === '';
  };

  return (
    <Panel
      title={title}
      width={width}
      maxWidth={maxWidth}
      padding={padding}
      transparent={transparent}
      style={style}
    >
      <Stack direction="column" divider="top">
        <Stack direction="row" divider="left">
          <FieldValue
            type="SELECT"
            value={selectedField?.name || ''}
            options={fields.map(({ name, label }) => ({ key: name, value: label }))}
            onUpdate={handleFieldChange}
            editable
          />

          <FieldValue
            type="SELECT"
            value={selectedOperator?.name || ''}
            options={
              selectedField
                ? OPERATORS[selectedField.type].map(({ name }) => ({ key: name, value: name }))
                : []
            }
            onUpdate={(val) => {
              const op = selectedField && OPERATORS[selectedField.type].find(o => o.name === val);
              if (op) setSelectedOperator(op);
            }}
            editable={!!selectedField}
          />

          <FieldValue
            type={selectedField?.type || 'STRING'}
            value={searchValue || ''}
            onUpdate={setSearchValue}
            editable={!!selectedOperator}
            options={selectedField?.type === 'SELECT' ? selectedField.options : undefined}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />

          <Button
            icon={<FaPlus />}
            onClick={handleAdd}
            hint="Adicionar"
            variant="success"
            width="100px"
            disabled={isAddButtonDisabled()}
            style={{ borderRadius: '0 5px 0 0' }}
          />
        </Stack>

        {filters.length > 0 && (
          <Tags>
            {filters.map((f, i) => (
              <Tag key={i}>
                <span>
                  {fields.find(fd => fd.name === f.field)?.label} {f.operadorDescr} {getFormattedValue(f)}
                </span>
                <Button
                  icon={<FaTimes />}
                  onClick={() => handleRemove(i)}
                  variant="warning"
                  height="20px"
                  width="20px"
                  style={{
                    borderRadius: '50%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex'
                  }}
                />
              </Tag>
            ))}
          </Tags>
        )}
      </Stack>
    </Panel>
  );
};

export default SearchFilterRSQL;

const Tags = styled.div`
  background-color: ${({ theme }) => theme.colors.tertiary};
  padding: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.div`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: 5px 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;
