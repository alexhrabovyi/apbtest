/* eslint-disable no-param-reassign */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect } from 'react';
import findAllInteractiveElements from '../libs/findAllInteractiveElements';

export default function useToggleInteractiveElements<RefType extends HTMLElement | null>(
  mainElementRef: React.MutableRefObject<RefType>,
  isActive: boolean,
  additionalDependeciesArr: any[] = [],
) {
  const disableInteractiveElements = useCallback(() => {
    const mainElement = mainElementRef.current;

    let noMainElements: HTMLElement[];
    let mainElements: HTMLElement[];

    if (isActive) {
      noMainElements = Array.from(findAllInteractiveElements(document.body))
        .filter((el) => !el.closest('[role="dialog"]'));

      noMainElements.forEach((el) => {
        el.tabIndex = -1;
        el.ariaHidden = 'true';
      });
    } else {
      mainElements = Array.from(findAllInteractiveElements(mainElement!));

      mainElements.forEach((el) => {
        el.tabIndex = -1;
        el.ariaHidden = 'true';
      });
    }

    return () => {
      if (isActive) {
        noMainElements.forEach((el) => {
          el.tabIndex = 0;
          el.ariaHidden = 'false';
        });
      } else {
        mainElements.forEach((el) => {
          el.tabIndex = 0;
          el.ariaHidden = 'false';
        });
      }
    };
  }, [mainElementRef, isActive, ...additionalDependeciesArr]);

  useEffect(disableInteractiveElements, [disableInteractiveElements]);
}
