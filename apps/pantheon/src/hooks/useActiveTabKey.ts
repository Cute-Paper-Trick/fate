import { usePathname } from 'next/navigation';

import { AppTab } from '@/store/global/initialState';

/**
 * Returns the active tab key (chat/market/settings/...)
 */
export const useActiveTabKey = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/discover')) {
    return pathname.split('/').slice(0, 3).filter(Boolean).join('/') as AppTab;
  }
  return pathname.split('/').find(Boolean)! as AppTab;
};
