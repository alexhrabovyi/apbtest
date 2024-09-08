import { memo } from 'react';
import classNames from 'classnames';
import checkboxCls from './FilterCheckbox.module.scss';

interface CheckboxProps {
  value: string,
  isChecked: boolean,
  updateParams: React.Dispatch<React.SetStateAction<string[]>>,
}

const FilterCheckbox = memo<CheckboxProps>(({ value, isChecked, updateParams }) => {
  function onClickHandler() {
    if (!isChecked) {
      updateParams((oldParams) => [...oldParams, value]);
    } else {
      updateParams((oldParams) => oldParams.filter((p) => p !== value));
    }
  }

  return (
    <button
      className={checkboxCls.checkbox}
      type="submit"
      onClick={onClickHandler}
      role="checkbox"
      aria-checked={isChecked}
    >
      <span className={classNames(
        checkboxCls.checkboxSquare,
        isChecked && checkboxCls.checkboxSquare_checked,
      )}
      />
      {value}
    </button>
  );
});

export default FilterCheckbox;
