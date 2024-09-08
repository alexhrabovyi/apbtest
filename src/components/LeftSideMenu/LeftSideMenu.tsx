/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  memo, useRef, useCallback, useEffect,
  ReactNode,
} from 'react';
import classNames from 'classnames';
import useHideScrollbarOnOpen from '../../hooks/useHideScrollbarOnOpen';
import useToggleInteractiveElements from '../../hooks/useToggleInteractiveElements';
import useOnResize from '../../hooks/useOnResize';
import backdropCls from '../../scss/_backdrop.module.scss';
import containerCls from '../../scss/_container.module.scss';
import menuCls from './LeftSideMenu.module.scss';
import CrossIcon from './images/cross.svg';

interface LeftSideMenuProps {
  children: ReactNode | ReactNode[],
  isMenuOpen: boolean,
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>,
  label: string,
  openButton: HTMLButtonElement | null,
  id: string,
}

const LeftSideMenu = memo<LeftSideMenuProps>(({
  children, isMenuOpen, setIsMenuOpen, label, openButton, id,
}) => {
  const menuBackdropRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useHideScrollbarOnOpen(isMenuOpen);
  useToggleInteractiveElements<HTMLDivElement | null>(menuRef, isMenuOpen);

  const calcMenuHeight = useCallback(() => {
    const menu = menuRef.current;

    if (!menu) return;

    menu.style.height = '';
    menu.style.overflowY = '';

    const maximumMenuHeight = window.innerHeight;
    const realMenuHeight = menu.scrollHeight;

    menu.style.overflowY = realMenuHeight > maximumMenuHeight ? 'scroll' : 'hidden';
    menu.style.height = `${maximumMenuHeight}px`;
  }, []);

  calcMenuHeight();
  useOnResize(calcMenuHeight);

  const focusOnOpen = useCallback(() => {
    if (isMenuOpen) menuRef.current?.focus();
  }, [isMenuOpen]);

  useEffect(focusOnOpen, [focusOnOpen]);

  const backdropOnClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.target === menuBackdropRef.current) {
      setIsMenuOpen(false);
      openButton?.focus();
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <div
      ref={menuBackdropRef}
      className={classNames(
        backdropCls.backdrop,
        isMenuOpen && backdropCls.backdrop_active,
      )}
      onClick={backdropOnClick}
    >
      <div
        id={id || undefined}
        ref={menuRef}
        className={classNames(
          containerCls.container,
          menuCls.menu,
          isMenuOpen && menuCls.menu_open,
        )}
        aria-hidden={!isMenuOpen}
        role="dialog"
        aria-modal
        aria-label={label}
        // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
        tabIndex={isMenuOpen ? 0 : -1}
      >
        <button
          type="button"
          className={menuCls.closeButton}
          aria-label={`Закрити ${label}`}
          onClick={() => {
            setIsMenuOpen(false);
            openButton?.focus();
          }}
        >
          <CrossIcon className={menuCls.crossIcon} />
        </button>
        {children}
      </div>
    </div>
  );
});

export default LeftSideMenu;
