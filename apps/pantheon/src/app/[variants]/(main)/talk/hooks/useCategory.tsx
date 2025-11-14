// import { Icon } from '@lobehub/ui';
import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { House, Mail, User } from 'lucide-react';
// import { ShieldCheck, UserCircle } from 'lucide-react';
import Link from 'next/link';

import { MenuProps } from '@/components/Menu';

// import { ProfileTabs } from '@/store/global/initialState';

export const useCategory = () => {
  const { t } = useTranslate('talk');
  const cateItems: MenuProps['items'] = [
    {
      icon: <Icon icon={House} size={'middle'} />,
      key: 'home',
      label: (
        <Link href={'/talk/home'} onClick={(e) => e.preventDefault()}>
          {t('topic.siderbar.home', '首页')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={User} size={'middle'} />,
      key: 'mine',
      label: (
        <Link href={'/talk/mine'} onClick={(e) => e.preventDefault()}>
          {t('topic.siderbar.mine', '我的')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={Mail} size={'middle'} />,
      key: 'messageCenter',
      label: (
        <Link href={'/talk/messageCenter'} onClick={(e) => e.preventDefault()}>
          {t('topic.siderbar.message', '消息中心')}
        </Link>
      ),
    },
  ].filter(Boolean) as MenuProps['items'];

  return cateItems;
};
