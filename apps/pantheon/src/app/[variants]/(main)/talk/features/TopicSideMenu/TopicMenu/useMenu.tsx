'use client';

import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { House, User } from 'lucide-react';
import { useMemo } from 'react';

import type { MenuProps } from '@/components/Menu';

interface UseMenuOptions {
  mobile?: boolean;
}

export const useMenu = ({ mobile }: UseMenuOptions = {}) => {
  const { t } = useTranslate('common');

  const iconSize = mobile ? 20 : undefined;

  const isAdmin = true;

  const cateItems: MenuProps['items'] = useMemo(
    () =>
      [
        {
          icon: <Icon icon={House} size={'middle'} />,
          key: '1',
          label: t('talk.home.title', '首页'),
        },
        {
          icon: <Icon icon={User} size={'middle'} />,
          key: '2',
          label: t('talk.mine.title', '我的'),
          style: { height: '40px' },
        },
      ].filter(Boolean) as MenuProps['items'],
    [t, iconSize, isAdmin],
  );

  return cateItems;
};
