import {
  KeyboardEventHandler,
  MouseEventHandler,
  memo, useCallback, useEffect, useRef, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import selectCls from './Select.module.scss';
import ChevronUp from './images/chevronUp.svg';
import { AppliedParameters } from '../Main/Main';

interface SelectOption {
  name: string,
  id: string,
}

interface SelectProps {
  label: string,
  options: SelectOption[],
  defaultSelectedOptionId: string,
  searchParamName: string,
  setParams: React.Dispatch<React.SetStateAction<AppliedParameters | null>>,
}

const Select = memo<SelectProps>(({
  label, options, defaultSelectedOptionId, searchParamName, setParams,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOptionId, setSelectedOptionId] = useState<string>(defaultSelectedOptionId);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);

  const openButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const closeOnClick = useCallback(() => {
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('click', (e) => {
          if ((e.target as HTMLElement).closest('[data-select]') !== selectRef.current) {
            setIsOpen(false);
          }
        }, { once: true });
      });
    }
  }, [isOpen]);

  useEffect(closeOnClick, [closeOnClick]);

  if (searchParams.has(searchParamName)) {
    const searchParamValue = searchParams.get(searchParamName) as string;

    if (searchParamValue !== selectedOptionId) {
      setSelectedOptionId(searchParamValue);
    }
  } else if (selectedOptionId !== defaultSelectedOptionId) {
    setSelectedOptionId(defaultSelectedOptionId);
  }

  function openButtonOnClick() {
    setIsOpen(!isOpen);
    setFocusedOptionIndex(-1);

    if (!isOpen) {
      setTimeout(() => {
        listRef.current?.focus();
      }, 0);
    }
  }

  const optionListOnClick: MouseEventHandler<HTMLDivElement> = (e) => {
    const option = (e.target as HTMLElement).closest('[role="option"]');
    if (!option) return;

    const newOptionId = option.id;

    setSelectedOptionId(newOptionId);
    setIsOpen(false);

    searchParams.set(searchParamName, newOptionId);
    setSearchParams(searchParams);

    setParams((params) => ({ ...params as AppliedParameters, sortBy: newOptionId }));

    openButtonRef.current?.focus();
  };

  const optionListOnKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.code === 'ArrowDown') {
      e.preventDefault();

      let newFocusedOptionIndex = focusedOptionIndex + 1;
      if (newFocusedOptionIndex === options.length) newFocusedOptionIndex = 0;

      const childrenElem = listRef.current?.children[newFocusedOptionIndex] as HTMLButtonElement;
      childrenElem.focus();

      setFocusedOptionIndex(newFocusedOptionIndex);
    } else if (e.code === 'ArrowUp') {
      e.preventDefault();

      let newFocusedOptionIndex = focusedOptionIndex - 1;
      if (newFocusedOptionIndex < 0) newFocusedOptionIndex = options.length - 1;

      const childrenElem = listRef.current?.children[newFocusedOptionIndex] as HTMLButtonElement;
      childrenElem.focus();

      setFocusedOptionIndex(newFocusedOptionIndex);
    } else if (e.code === 'Home') {
      e.preventDefault();

      const newFocusedOptionIndex = 0;
      const childrenElem = listRef.current?.children[newFocusedOptionIndex] as HTMLButtonElement;
      childrenElem.focus();

      setFocusedOptionIndex(newFocusedOptionIndex);
    } else if (e.code === 'End') {
      e.preventDefault();

      const newFocusedOptionIndex = options.length - 1;
      const childrenElem = listRef.current?.children[newFocusedOptionIndex] as HTMLButtonElement;
      childrenElem.focus();

      setFocusedOptionIndex(newFocusedOptionIndex);
    }
  };

  const selectedOption = options.find((o) => o.id === selectedOptionId);

  const optionButtons = options.map((p, i) => (
    <button
      key={p.id}
      type="button"
      className={classNames(
        selectCls.option,
        selectedOptionId === p.id && selectCls.option_active,
      )}
      id={p.id}
      role="option"
      aria-selected={selectedOptionId === p.id}
      style={{
        paddingTop: i === 0 ? '12px' : '',
        paddingBottom: i === options.length - 1 ? '12px' : '',
      }}
    >
      {p.name}
    </button>
  ));

  return (
    <form
      className={selectCls.selectForm}
    >
      <p className={selectCls.label}>
        {`${label}:`}
      </p>
      <div
        ref={selectRef}
        className={selectCls.select}
        data-select
      >
        <button
          ref={openButtonRef}
          className={selectCls.openButton}
          type="button"
          onClick={openButtonOnClick}
          aria-label={`Open select ${label}`}
        >
          {selectedOption?.name}
          <ChevronUp
            className={classNames(
              selectCls.chevron,
              isOpen && selectCls.chevron_active,
            )}
          />
        </button>
        <div
          ref={listRef}
          onClick={optionListOnClick}
          onKeyDown={optionListOnKeyDown}
          className={selectCls.optionList}
          style={{ display: isOpen ? '' : 'none' }}
          role="listbox"
          aria-activedescendant={selectedOptionId}
          tabIndex={0}
        >
          {optionButtons}
        </div>
      </div>
    </form>
  );
});

export default Select;
