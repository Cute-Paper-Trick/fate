import { Icon } from '@lobehub/ui';
// import { featureFlagsSelectors, useServerConfigStore } from '@/store/serverConfig';
// import { useUserStore } from '@/store/user';
// import { authSelectors } from '@/store/user/slices/auth/selectors';
import { useTranslate } from '@tolgee/react';
import { ChartColumnBigIcon, ShieldCheck, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { MenuProps } from '@/components/Menu';
import { ProfileTabs } from '@/store/global/initialState';

export const useCategory = () => {
  const { t } = useTranslate('profile');
  // const [isLoginWithClerk] = useUserStore((s) => [authSelectors.isLoginWithClerk(s)]);
  // const { showApiKeyManage } = useServerConfigStore(featureFlagsSelectors);

  // const oldAppUrl = useServerConfigStore((s) => s.serverConfig.oldAppUrl);

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
    {
      icon: <Icon icon={ChartColumnBigIcon} />,
      key: ProfileTabs.Stats,
      label: (
        <Link href={'/profile/stats'} onClick={(e) => e.preventDefault()}>
          {t('tab.stats')}
        </Link>
      ),
    },
    // !!showApiKeyManage && {
    //   icon: <Icon icon={KeyIcon} />,
    //   key: ProfileTabs.APIKey,
    //   label: (
    //     <Link href={'/profile/apikey'} onClick={(e) => e.preventDefault()}>
    //       {t('tab.apikey')}
    //     </Link>
    //   ),
    // },
  ].filter(Boolean) as MenuProps['items'];

  return cateItems;
};
