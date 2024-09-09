/* eslint-disable react/jsx-no-bind */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery, VehicleProduct } from '../../queryAPI/queryAPI';
import useOnResize from '../../hooks/useOnResize';

import Select from '../Select/Select';
import FilterBlock from '../FilterBlock/FilterBlock';
import LeftSideMenu from '../LeftSideMenu/LeftSideMenu';
import ProductCard from '../ProductCard/ProductCard';
import Button from '../Button/Button';

import containerCls from '../../scss/_container.module.scss';
import mainCls from './Main.module.scss';

import FilterIcon from './images/filter.svg';
import Line from './images/oblique.svg';

export interface Filters {
  [index: string]: string[]
}

export interface AppliedParameters {
  sortBy?: string,
  filters: Filters,
  minPrice?: number,
  maxPrice?: number,
}

export const uninterestingProps = ['category', 'description', 'id', 'images', 'meta', 'price', 'rating',
  'reviews', 'sku', 'stock', 'tags', 'thumbnail', 'title', 'dimensions'];

export const formattedFilterNames: { [index: string]: string } = {
  availabilityStatus: 'availability',
  discountPercentage: 'discount percentage',
  minimumOrderQuantity: 'minimum order quantity',
  returnPolicy: 'return policy',
  shippingInformation: 'shipping',
  warrantyInformation: 'warranty',
};

export default function Main() {
  const [searchParams, setSearchParams] = useSearchParams();

  const openFilterMenuBtnRef = useRef<HTMLButtonElement | null>(null);

  const [products, setProducts] = useState<VehicleProduct[] | null>(null);
  const [
    filteredAndSortedProducts, setFilteredAndSortedProducts,
  ] = useState<VehicleProduct[]>([]);
  const [filters, setFilters] = useState<Filters | null>(null);
  const [appliedParameters, setAppliedParameters] = useState<AppliedParameters | null>(null);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  function findFilters(productsArr: VehicleProduct[]) {
    const result: Filters = {};

    productsArr.forEach((p) => {
      Object.entries(p).forEach(([key, value]) => {
        if (uninterestingProps.includes(key)) return;

        const stringifiedValue = String(value);

        if (key in result) {
          if (!result[key].includes(stringifiedValue)) {
            result[key].push(stringifiedValue);
          }
        } else {
          result[key] = [stringifiedValue];
        }
      });
    });

    return result;
  }

  const getWindowWidth = useCallback(() => {
    setWindowWidth(window.innerWidth);
  }, []);

  useLayoutEffect(() => {
    getWindowWidth();
  }, [getWindowWidth]);

  useOnResize(getWindowWidth);

  const { data: fetchedData, isLoading } = useGetProductsQuery();

  if (fetchedData && fetchedData !== products) {
    setProducts(fetchedData);
    setFilteredAndSortedProducts(fetchedData);

    const newFilters = findFilters(fetchedData);
    setFilters(newFilters);
  }

  const onAppliedParametersChange = useCallback(() => {
    if (!appliedParameters || !products) return;

    const result: VehicleProduct[] = [];

    const { minPrice, maxPrice } = appliedParameters;
    const filtersToApply = Object.entries(appliedParameters.filters);
    const sortType = appliedParameters?.sortBy;

    products.forEach((p) => {
      let isSuitable = true;

      if (((minPrice !== undefined && maxPrice !== undefined)
        && (p.price >= minPrice && p.price <= maxPrice))
        || (minPrice === undefined && maxPrice === undefined)) {
        filtersToApply.forEach(([filterName, filterValues]) => {
          if (!filterValues.length) return;

          const productValue = String(p[filterName as keyof VehicleProduct]);
          const isConsist = filterValues.includes(productValue);

          if (!isConsist) isSuitable = false;
        });
      } else {
        isSuitable = false;
      }

      if (isSuitable) result.push(p);
    });

    switch (sortType) {
      case 'name-A-Z': {
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      }
      case 'name-Z-A': {
        result.sort((a, b) => -a.title.localeCompare(b.title));
        break;
      }
      case 'price-down': {
        result.sort((a, b) => +b.price - +a.price);
        break;
      }
      case 'price-up': {
        result.sort((a, b) => +a.price - +b.price);
        break;
      }
      case 'rate-down': {
        result.sort((a, b) => +b.rating - +a.rating);
        break;
      }
      case 'rate-up': {
        result.sort((a, b) => +a.rating - +b.rating);
        break;
      }
    }

    setFilteredAndSortedProducts(result);
  }, [appliedParameters, products]);

  useEffect(onAppliedParametersChange, [onAppliedParametersChange]);

  const productAmount = filteredAndSortedProducts?.length || 0;

  const productCards = useMemo(() => (
    filteredAndSortedProducts?.map((p) => (
      <ProductCard
        key={p.id}
        title={p.title}
        productId={(p.id).toString()}
        price={(p.price).toString()}
        rating={p.rating}
        src={p.thumbnail}
      />
    ))
  ), [filteredAndSortedProducts]);

  const noProductsBlock = useMemo(() => {
    function deleteAllFiltersBtnOnClick() {
      const newAppliedFilters: AppliedParameters = {
        sortBy: appliedParameters?.sortBy,
        filters: {},
      };

      setAppliedParameters(newAppliedFilters);

      const newSearchParams = Array.from(searchParams).filter(([name]) => (
        name === 'sortBy'
      ));
      setSearchParams(newSearchParams);
    }

    return (
      <div className={mainCls.noProductsBlock}>
        <div className={mainCls.noProductsContent}>
          <Line className={mainCls.noProductsLine} />
          <p className={mainCls.noProductsText}>
            Products haven&apos;t been found
          </p>
          <Button
            className={mainCls.resetButton}
            onClick={deleteAllFiltersBtnOnClick}
          >
            Delete filters
          </Button>
        </div>
      </div>
    );
  }, [appliedParameters, searchParams, setSearchParams]);

  const sortSelectOptions = useMemo(() => [
    {
      name: 'default',
      id: 'default',
    },
    {
      name: 'name (A - Z)',
      id: 'name-A-Z',
    },
    {
      name: 'name (Z - A)',
      id: 'name-Z-A',
    },
    {
      name: 'price (descending)',
      id: 'price-down',
    },
    {
      name: 'price (ascending)',
      id: 'price-up',
    },
    {
      name: 'rate (descending)',
      id: 'rate-down',
    },
    {
      name: 'rate (ascending)',
      id: 'rate-up',
    },
  ], []);

  return (
    <>
      <main className={classNames(containerCls.container, mainCls.main)}>
        <div className={mainCls.controlBlock}>
          <div className={mainCls.infoBlock}>
            {windowWidth <= 1024 && (
              <button
                ref={openFilterMenuBtnRef}
                type="button"
                className={mainCls.filterButton}
                aria-haspopup="dialog"
                aria-label="Open filter menu"
                onClick={() => setIsFilterMenuOpen(true)}
              >
                <FilterIcon className={mainCls.filterIcon} />
              </button>
            )}
            {windowWidth > 400 && (
              <p
                className={mainCls.productAmount}
                aria-atomic="true"
                aria-live="assertive"
              >
                Products found:
                <span>
                  {!isLoading ? productAmount : 'Loading ...'}
                </span>
              </p>
            )}
          </div>
          <div className={mainCls.sortAndAppearanceBlock}>
            <Select
              label="Sort by"
              options={sortSelectOptions}
              defaultSelectedOptionId="default"
              searchParamName="sortBy"
              setParams={setAppliedParameters}
            />
          </div>
        </div>
        <div className={mainCls.filtersAndProducts}>
          {windowWidth > 1024 && (
            <FilterBlock
              filters={filters}
              isLoading={isLoading}
              setFilterParams={setAppliedParameters}
            />
          )}
          <div className={mainCls.products}>
            {!isLoading && !productCards.length && noProductsBlock}
            {productCards}
          </div>
        </div>
      </main>
      {windowWidth <= 1024 && (
        <LeftSideMenu
          isMenuOpen={isFilterMenuOpen}
          setIsMenuOpen={setIsFilterMenuOpen}
          label="Filter Menu"
          openButton={openFilterMenuBtnRef.current}
          id="filterBlockMenu"
        >
          <div className={mainCls.filterBlockInMenu}>
            <FilterBlock
              filters={filters}
              isLoading={isLoading}
              setFilterParams={setAppliedParameters}
            />
          </div>
        </LeftSideMenu>
      )}
    </>
  );
}
