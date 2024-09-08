import React, {
  FormEvent,
  FormEventHandler,
  KeyboardEventHandler,
  PointerEventHandler,
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import { useGetProductsQuery } from '../../../queryAPI/queryAPI';
import useOnResize from '../../../hooks/useOnResize';
import filterCls from './FilterPriceForm.module.scss';
import ChevronUp from './images/chevronUp.svg';

const FilterPriceForm: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isClosed, setIsClose] = useState<boolean>(false);
  const [prevSearchParams, setPrevSearchParams] = useState<URLSearchParams | null>(null);

  const [fetchedMinPrice, setFetchedMinPrice] = useState<number>(0);
  const [fetchedMaxPrice, setFetchedMaxPrice] = useState<number>(0);
  const [currentMinPrice, setCurrentMinPrice] = useState<number>(0);
  const [currentMaxPrice, setCurrentMaxPrice] = useState<number>(0);
  const [minInputValue, setMinInputValue] = useState<string>('0');
  const [maxInputValue, setMaxInputValue] = useState<string>('0');
  const [minButtonLeft, setMinButtonLeft] = useState<number>(0);
  const [maxButtonLeft, setMaxButtonLeft] = useState<number>(0);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const mainLineRef = useRef<HTMLSpanElement | null>(null);
  const activeLineRef = useRef<HTMLSpanElement | null>(null);
  const minButtonRef = useRef<HTMLButtonElement | null>(null);
  const maxButtonRef = useRef<HTMLButtonElement | null>(null);

  // fetcher functions

  const { data: fetcherData } = useGetProductsQuery();

  const setupMinMaxPrice = useCallback(() => {
    if (!fetcherData) return;

    const prices = fetcherData.map((p) => p.price).sort((a, b) => a - b);

    const minPrice = Number(prices[0].toFixed(0));
    const maxPrice = Number(prices[prices.length - 1].toFixed(0));

    setFetchedMinPrice(minPrice);
    setFetchedMaxPrice(maxPrice);
    setCurrentMinPrice(minPrice);
    setMinInputValue(String(minPrice));
    setCurrentMaxPrice(maxPrice);
    setMaxInputValue(String(maxPrice));
  }, [fetcherData]);

  useEffect(setupMinMaxPrice, [setupMinMaxPrice]);

  if (!searchParams.has('minPrice') && prevSearchParams?.has('minPrice')) {
    setCurrentMinPrice(fetchedMinPrice);
    setMinInputValue(String(fetchedMinPrice));
    setCurrentMaxPrice(fetchedMaxPrice);
    setMaxInputValue(String(fetchedMaxPrice));
  }

  if (prevSearchParams !== searchParams) {
    setPrevSearchParams(searchParams);
  }

  // helper functions

  const getMainLinePxWidth = useCallback(() => {
    const mainLine = mainLineRef.current!;

    return mainLine.offsetWidth;
  }, []);

  const getRoundButtonPercentWidth = useCallback(() => {
    const roundButton = minButtonRef.current;
    const roundButtonPxWidth = roundButton!.offsetWidth;
    const mainLinePxWidth = getMainLinePxWidth();

    const roundButtonPercentWidth = (roundButtonPxWidth / mainLinePxWidth) * 100;
    return roundButtonPercentWidth;
  }, [getMainLinePxWidth]);

  // calculation functions

  const calcAndUpdateButtonLeft = useCallback((buttonType: 'min' | 'max', price: number) => {
    const roundButtonWidthInPercent = getRoundButtonPercentWidth();
    const availableMainLineWidth = 100 - roundButtonWidthInPercent * 2;
    const minMaxPriceDiff = fetchedMaxPrice - fetchedMinPrice;
    const valueInPercent = ((price - fetchedMinPrice) / minMaxPriceDiff);

    if (minMaxPriceDiff === 0) {
      setMinButtonLeft(0);
      setMaxButtonLeft(Number((100 - getRoundButtonPercentWidth()).toFixed(2)));
    } else if (buttonType === 'min') {
      const buttonLeft = Number((valueInPercent * availableMainLineWidth).toFixed(2));

      setMinButtonLeft(buttonLeft);
    } else if (buttonType === 'max') {
      const buttonLeft = Number(
        (valueInPercent * availableMainLineWidth + roundButtonWidthInPercent).toFixed(2),
      );

      setMaxButtonLeft(buttonLeft);
    }
  }, [getRoundButtonPercentWidth, fetchedMaxPrice, fetchedMinPrice]);

  function calcCurrentMinMaxPrice(buttonType: 'min' | 'max', leftInPercent: number) {
    const roundButtonWidthInPercent = getRoundButtonPercentWidth();
    const availableMainLineWidth = 100 - roundButtonWidthInPercent * 2;
    const minMaxDiff = fetchedMaxPrice - fetchedMinPrice;

    if (buttonType === 'min') {
      let result = ((leftInPercent / availableMainLineWidth) * minMaxDiff) + fetchedMinPrice;
      result = Number(result.toFixed());

      setCurrentMinPrice(result);
      setMinInputValue(String(result));
    } else {
      let result = (((leftInPercent - roundButtonWidthInPercent)
        / availableMainLineWidth) * minMaxDiff) + fetchedMinPrice;
      result = Number(result.toFixed());

      setCurrentMaxPrice(result);
      setMaxInputValue(String(result));
    }
  }

  const calcAndUpdateButtonsLeft = useCallback(() => {
    calcAndUpdateButtonLeft('min', currentMinPrice);
    calcAndUpdateButtonLeft('max', currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice, calcAndUpdateButtonLeft]);

  useLayoutEffect(calcAndUpdateButtonsLeft, [calcAndUpdateButtonsLeft]);
  useOnResize(calcAndUpdateButtonsLeft);

  // style functions

  const setupActiveLineStyles = useCallback(() => {
    const width = maxButtonLeft - minButtonLeft;
    const left = minButtonLeft;

    activeLineRef.current!.style.width = `${width}%`;
    activeLineRef.current!.style.left = `${left}%`;
  }, [minButtonLeft, maxButtonLeft]);

  useLayoutEffect(setupActiveLineStyles, [setupActiveLineStyles]);

  // user events

  const roundButtonOnDown: PointerEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();

    let filterMenuHasScroll = false;

    const filterMenu = document.querySelector('#filterBlockMenu') as HTMLElement;

    if (filterMenu) {
      if (filterMenu.style.overflowY === 'scroll') {
        filterMenuHasScroll = true;
        filterMenu.style.overflowY = 'hidden';
      }
    }

    const buttonType: 'min' | 'max' = (e.target as HTMLElement).dataset.buttonType as 'min' | 'max';
    const button = buttonType === 'min' ? minButtonRef.current! : maxButtonRef.current!;

    const roundButtonWidthInPercent = getRoundButtonPercentWidth();

    let minLeft: number;
    let maxLeft: number;

    if (buttonType === 'min') {
      minLeft = 0;
      maxLeft = maxButtonLeft - roundButtonWidthInPercent;
    } else {
      minLeft = minButtonLeft + roundButtonWidthInPercent;
      maxLeft = 100 - roundButtonWidthInPercent;
    }

    const cursorCoordXOnDown = e.clientX;
    const buttonCoordLeft = button.getBoundingClientRect().left;
    const cursorDiff = cursorCoordXOnDown - buttonCoordLeft;

    button.setPointerCapture(e.pointerId);

    function roundButtonOnMove(onMoveEvent: PointerEvent) {
      const mainLineLeftCoord = mainLineRef.current!.getBoundingClientRect().left;
      const cursorCoordXOnMove = onMoveEvent.clientX;
      const buttonLeftInPx = cursorCoordXOnMove - mainLineLeftCoord - cursorDiff;

      let buttonLeftInPercent = (buttonLeftInPx / getMainLinePxWidth()) * 100;

      if (buttonLeftInPercent < minLeft) {
        buttonLeftInPercent = minLeft;
      } else if (buttonLeftInPercent > maxLeft) {
        buttonLeftInPercent = maxLeft;
      }

      buttonLeftInPercent = Number(buttonLeftInPercent.toFixed(2));

      calcCurrentMinMaxPrice(buttonType, buttonLeftInPercent);
    }

    function roundButtonOnUp() {
      button.removeEventListener('pointermove', roundButtonOnMove);
      formRef.current!.requestSubmit();

      if (filterMenuHasScroll) {
        filterMenu.style.overflowY = 'scroll';
      }
    }

    button.addEventListener('pointermove', roundButtonOnMove);
    button.addEventListener('pointerup', roundButtonOnUp, { once: true });
  };

  function formOnSubmit(e: FormEvent) {
    e.preventDefault();

    searchParams.set('minPrice', String(currentMinPrice));
    searchParams.set('maxPrice', String(currentMaxPrice));

    setSearchParams(searchParams);
  }

  const inputOnInput: FormEventHandler<HTMLInputElement> = (e) => {
    const inputType = (e.target as HTMLInputElement).name;
    const { value } = e.target as HTMLInputElement;

    if (inputType === 'minPrice') {
      setMinInputValue(value);
    } else {
      setMaxInputValue(value);
    }
  };

  const inputOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.code === 'Enter') {
      const input = e.target as HTMLInputElement;
      const inputType = input.name;
      let value = Number(input.value);

      if (inputType === 'minPrice' && value > currentMaxPrice) {
        value = currentMaxPrice;
      } else if (inputType === 'maxPrice' && value < currentMinPrice) {
        value = currentMinPrice;
      } else if (value < fetchedMinPrice) {
        value = fetchedMinPrice;
      } else if (value > fetchedMaxPrice) {
        value = fetchedMaxPrice;
      }

      if (inputType === 'minPrice') {
        setMinInputValue(String(value));
        setCurrentMinPrice(value);
      } else {
        setMaxInputValue(String(value));
        setCurrentMaxPrice(value);
      }

      setTimeout(() => {
        formRef.current!.requestSubmit();
      }, 0);
    }
  };

  const roundButtonOnKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    const { buttonType } = (e.target as HTMLButtonElement).dataset;

    if (e.code === 'ArrowUp' || e.code === 'ArrowRight') {
      e.preventDefault();

      if (buttonType === 'min') {
        let newCurrentMin = currentMinPrice + 1;

        if (newCurrentMin > currentMaxPrice) newCurrentMin = currentMaxPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        let newCurrentMax = currentMaxPrice + 1;

        if (newCurrentMax > fetchedMaxPrice) newCurrentMax = fetchedMaxPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    } else if (e.code === 'ArrowDown' || e.code === 'ArrowLeft') {
      e.preventDefault();

      if (buttonType === 'min') {
        let newCurrentMin = currentMinPrice - 1;

        if (newCurrentMin < fetchedMinPrice) newCurrentMin = fetchedMinPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        let newCurrentMax = currentMaxPrice - 1;

        if (newCurrentMax < currentMinPrice) newCurrentMax = currentMinPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    } else if (e.code === 'PageUp') {
      e.preventDefault();

      const fivePercentValue = (fetchedMaxPrice - fetchedMinPrice) * 0.05;

      if (buttonType === 'min') {
        let newCurrentMin = Number((currentMinPrice + fivePercentValue).toFixed(0));

        if (newCurrentMin > currentMaxPrice) newCurrentMin = currentMaxPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        let newCurrentMax = Number((currentMaxPrice + fivePercentValue).toFixed(0));

        if (newCurrentMax > fetchedMaxPrice) newCurrentMax = fetchedMaxPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    } else if (e.code === 'PageDown') {
      e.preventDefault();

      const fivePercentValue = (fetchedMaxPrice - fetchedMinPrice) * 0.05;

      if (buttonType === 'min') {
        let newCurrentMin = Number((currentMinPrice - fivePercentValue).toFixed(0));

        if (newCurrentMin < fetchedMinPrice) newCurrentMin = fetchedMinPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        let newCurrentMax = Number((currentMaxPrice - fivePercentValue).toFixed(0));

        if (newCurrentMax < currentMinPrice) newCurrentMax = currentMinPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    } else if (e.code === 'Home') {
      e.preventDefault();

      if (buttonType === 'min') {
        const newCurrentMin = currentMaxPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        const newCurrentMax = fetchedMaxPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    } else if (e.code === 'End') {
      e.preventDefault();

      if (buttonType === 'min') {
        const newCurrentMin = fetchedMinPrice;

        setCurrentMinPrice(newCurrentMin);
        setMinInputValue(String(newCurrentMin));
      } else {
        const newCurrentMax = currentMinPrice;

        setCurrentMaxPrice(newCurrentMax);
        setMaxInputValue(String(newCurrentMax));
      }
    }
  };

  return (
    <form
      onSubmit={formOnSubmit}
      className={filterCls.form}
      ref={formRef}
    >
      <button
        type="button"
        className={filterCls.titleButton}
        onClick={() => setIsClose(!isClosed)}
        aria-label={isClosed ? 'Show price filter' : 'Collapse price filter'}
      >
        <p className={filterCls.title}>
          Price, $
        </p>
        <ChevronUp className={classNames(
          filterCls.chevron,
          isClosed && filterCls.chevron_transformed,
        )}
        />
      </button>
      <div
        ref={contentRef}
        className={filterCls.content}
        style={{ display: isClosed ? 'none' : '' }}
      >
        <div className={filterCls.roundButtonBlock}>
          <span
            ref={mainLineRef}
            className={filterCls.mainLine}
          />
          <span
            ref={activeLineRef}
            className={filterCls.activeLine}
          />
          <button
            ref={minButtonRef}
            onPointerDown={roundButtonOnDown}
            onKeyDown={roundButtonOnKeyDown}
            type="button"
            data-button-type="min"
            className={filterCls.roundButton}
            style={{ left: `${minButtonLeft}%` }}
            role="slider"
            aria-valuemin={fetchedMinPrice}
            aria-valuemax={currentMaxPrice}
            aria-valuenow={currentMinPrice}
            aria-label="Minimal price slider"
          />
          <button
            ref={maxButtonRef}
            onPointerDown={roundButtonOnDown}
            onKeyDown={roundButtonOnKeyDown}
            type="button"
            data-button-type="max"
            className={filterCls.roundButton}
            style={{ left: `${maxButtonLeft}%` }}
            role="slider"
            aria-valuemin={currentMinPrice}
            aria-valuemax={fetchedMaxPrice}
            aria-valuenow={currentMaxPrice}
            aria-label="Maximum price slider"
          />
        </div>
        <div className={filterCls.inputBlock}>
          <input
            onInput={inputOnInput}
            onKeyDown={inputOnKeyDown}
            type="number"
            name="minPrice"
            className={filterCls.input}
            value={minInputValue}
            min={fetchedMinPrice}
            max={currentMaxPrice}
            aria-label="Enter minimal price"
          />
          <span className={filterCls.inputBlockSpan}>-</span>
          <input
            onInput={inputOnInput}
            onKeyDown={inputOnKeyDown}
            type="number"
            name="maxPrice"
            className={filterCls.input}
            value={maxInputValue}
            min={currentMinPrice}
            max={fetchedMaxPrice}
            aria-label="Enter maximum price"
          />
        </div>
      </div>
    </form>
  );
};

export default FilterPriceForm;
