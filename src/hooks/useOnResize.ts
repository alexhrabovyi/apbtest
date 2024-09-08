import { useEffect } from 'react';

export default function useOnResize(callback: () => void): void {
  useEffect(() => {
    window.addEventListener('resize', callback);

    return () => window.removeEventListener('resize', callback);
  }, [callback]);
}
