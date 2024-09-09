/* eslint-disable react/require-default-props */
/* eslint-disable react/button-has-type */
import { ReactNode, forwardRef } from 'react';
import classNames from 'classnames';
import buttonCls from './Button.module.scss';

interface ButtonProps {
  className?: string,
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  children?: ReactNode,
  id?: string,
  onClick?: React.MouseEventHandler<HTMLButtonElement>,
  ariaHidden?: boolean,
  ariaLabel?: string,
}

type Ref = HTMLButtonElement;

const Button = forwardRef<Ref, ButtonProps>(({
  className, type, children, id, onClick, ariaHidden = false, ariaLabel,
}, ref) => {
  const buttonType = type || 'button';

  return (
    <button
      ref={ref}
      type={buttonType}
      className={classNames(className, buttonCls.button)}
      id={id}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
});

export default Button;
