import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Mendapatkan path saat ini
 * 
 * @returns pathname: String
 */

export function usePathname() {
  const { pathname } = useLocation();

  return useMemo(() => pathname, [pathname]);
}
