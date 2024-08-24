import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * shortcut untuk scroll ke paling atas pada halaman
 * 
 * @returns {null}
 */

export function useScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
