import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import appliedFiltersCls from './AppliedFiltersBlock.module.scss';
import Cross from './images/cross.svg';

export default function AppliedFiltersBlock() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filteredSearchParams = Array.from(searchParams).filter(([name]) => (
    name !== 'page' && name !== 'perView' && name !== 'sortBy' && name !== 'minPrice' && name !== 'maxPrice'
  ));

  const isThereAnyFilters = filteredSearchParams.length || searchParams.has('minPrice');

  let priceButton;

  if (searchParams.has('minPrice')) {
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    priceButton = (
      <button
        type="button"
        className={appliedFiltersCls.button}
        aria-label="Delete price filter"
        onClick={() => {
          searchParams.delete('minPrice');
          searchParams.delete('maxPrice');
          setSearchParams(searchParams);
        }}
      >
        <Cross className={appliedFiltersCls.icon} />
        {`${minPrice} - ${maxPrice}`}
      </button>
    );
  }

  const buttons = filteredSearchParams.map(([name, value]) => (
    <button
      key={`${name}-${value}`}
      type="button"
      className={appliedFiltersCls.button}
      aria-label={`Delete ${name} filter with ${value} value`}
      onClick={() => {
        const newSearchParams = Array.from(searchParams).filter(([oldName, oldValue]) => (
          !(oldName === name && oldValue === value)
        ));
        setSearchParams(newSearchParams);
      }}
    >
      <Cross className={appliedFiltersCls.icon} />
      {value}
    </button>
  ));

  const deleteAllButton = (
    <button
      type="button"
      className={classNames(
        appliedFiltersCls.button,
        appliedFiltersCls.button_grey,
      )}
      aria-label="Delete all filters"
      onClick={() => {
        const newSearchParams = Array.from(searchParams).filter(([name]) => (
          name === 'perView' || name === 'sortBy'
        ));
        setSearchParams(newSearchParams);
      }}
    >
      <Cross className={appliedFiltersCls.icon} />
      Delete all
    </button>
  );

  return (
    <div className={classNames(
      appliedFiltersCls.filtersBlock,
      isThereAnyFilters && appliedFiltersCls.filtersBlock_active,
    )}
    >
      {priceButton}
      {buttons}
      {deleteAllButton}
    </div>
  );
}
