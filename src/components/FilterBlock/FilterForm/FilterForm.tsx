import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import filterCls from './FilterForm.module.scss';
import ChevronUp from './images/chevronUp.svg';
import FilterCheckbox from './FilterCheckbox/FilterCheckbox';
import { AppliedParameters } from '../../Main/Main';

interface FilterFormProps {
  name: string,
  values: string[],
  initIsClosed: boolean,
  setFilterParams: React.Dispatch<React.SetStateAction<AppliedParameters | null>>,
}

const FilterForm: React.FC<FilterFormProps> = ({
  name, values, initIsClosed = false, setFilterParams,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isClosed, setIsClose] = useState<boolean>(initIsClosed);
  const [isAdditionalClosed, setIsAdditionalClosed] = useState<boolean>(true);
  const [params, setParams] = useState<string[]>([]);

  const isAdditionalAccordionNeeded = values.length >= 8;

  useEffect(() => {
    if (searchParams.has(name)) {
      setParams(searchParams.getAll(name));
    } else {
      setParams([]);
    }
  }, [searchParams, name]);

  const updateAppliedFilters = useCallback(() => {
    setFilterParams((p) => ({
      ...p as AppliedParameters,
      filters: {
        ...p?.filters,
        [name]: params,
      },
    }));
  }, [name, params, setFilterParams]);

  useEffect(updateAppliedFilters, [updateAppliedFilters]);

  const onSubmitHandler: React.FormEventHandler = (e) => {
    e.preventDefault();

    const URLParams = new URLSearchParams();
    params.forEach((p) => URLParams.append(name, p));

    Array.from(searchParams).forEach(([key, value]) => {
      if (key !== name) {
        URLParams.append(key, value);
      }
    });

    setSearchParams(URLParams);
  };

  const checkboxes = values.slice().sort().map((value, i) => (
    <li
      key={value}
      hidden={isAdditionalAccordionNeeded && isAdditionalClosed && i > 4}
    >
      <FilterCheckbox
        value={value}
        isChecked={params.includes(value)}
        updateParams={setParams}
      />
    </li>
  ));

  if (isAdditionalAccordionNeeded) {
    const additionalAccordionButton = (
      <li key="AccordionButton">
        <button
          className={filterCls.additionalButton}
          onClick={() => setIsAdditionalClosed((isAC) => !isAC)}
          type="button"
        >
          {isAdditionalClosed ? 'Show more' : 'Collapse'}
        </button>
      </li>
    );

    if (isAdditionalClosed) {
      checkboxes.splice(4, 1, additionalAccordionButton);
    } else {
      checkboxes.push(additionalAccordionButton);
    }
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className={filterCls.form}
    >
      <button
        type="button"
        className={filterCls.titleButton}
        onClick={() => setIsClose(!isClosed)}
        aria-label={isClosed ? `Open filter menu ${name}` : `Collapse filter menu ${name}`}
      >
        <p className={filterCls.title}>
          {name}
        </p>
        <ChevronUp className={classNames(
          filterCls.chevron,
          isClosed && filterCls.chevron_transformed,
        )}
        />
      </button>
      <ul
        ref={listRef}
        className={filterCls.checkboxList}
        style={{ display: isClosed ? 'none' : '' }}
      >
        {checkboxes}
      </ul>
    </form>
  );
};

export default FilterForm;
