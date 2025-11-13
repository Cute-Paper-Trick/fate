import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { ShieldCheck, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { MenuProps } from '@/components/Menu';
import { ProfileTabs } from '@/store/global/initialState';

export const useCategory = () => {
  const { t } = useTranslate('profile');

  const cateItems: MenuProps['items'] = [
    {
      icon: <Icon icon={UserCircle} />,
      key: ProfileTabs.Profile,
      label: (
        <Link
          href={'javascript:void(0)'}
          onClick={() => {
            console.log('跳转到旧版app');
          }}
        >
          {t('tab.profile')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={ShieldCheck} />,
      key: ProfileTabs.Security,
      label: (
        <Link href={'/profile/security'} onClick={(e) => e.preventDefault()}>
          {t('tab.security')}
        </Link>
      ),
    },
    // {
    //   icon: <Icon icon={ChartColumnBigIcon} />,
    //   key: ProfileTabs.Stats,
    //   label: (
    //     <Link href={'/profile/stats'} onClick={(e) => e.preventDefault()}>
    //       {t('tab.stats')}
    //     </Link>
    //   ),
    // },
  ].filter(Boolean) as MenuProps['items'];

  return cateItems;
};
