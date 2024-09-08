import { memo, useMemo } from 'react';
import classNames from 'classnames';
import filterCls from './FilterBlock.module.scss';
import FilterForm from './FilterForm/FilterForm';
import FilterPriceForm from './FilterPriceForm/FilterPriceForm';
import ThreeDotsSpinnerBlock from '../ThreeDotsSpinnerBlock/ThreeDotsSpinnerBlock';
import { AppliedParameters, Filters } from '../Main/Main';

interface FilterBlockProps {
  filters: Filters | null,
  isLoading: boolean,
  setFilterParams: React.Dispatch<React.SetStateAction<AppliedParameters | null>>,
}

const FilterBlock = memo<FilterBlockProps>(({ filters, isLoading, setFilterParams }) => {
  const filterElems = useMemo(() => {
    if (!filters) return;

    return Object.entries(filters).map(([key, value], i) => (
      <FilterForm
        key={key}
        name={key}
        values={value}
        initIsClosed={i > 1}
        setFilterParams={setFilterParams}
      />
    ));
  }, [filters, setFilterParams]);

  return (
    <div className={classNames(
      filterCls.filterBlock,
      isLoading && filterCls.filterBlock_inactive,
    )}
    >
      <FilterPriceForm />
      {filterElems || <ThreeDotsSpinnerBlock />}
    </div>
  );
});

export default FilterBlock;
