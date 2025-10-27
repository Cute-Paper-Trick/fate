'use client';

import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { FlaskConical, MessageSquare, MessagesSquare, NotebookText, Settings } from 'lucide-react';
import { useMemo } from 'react';

import type { MenuProps } from '@/components/Menu';
import { AppFuncs } from '@/store/global/initialState';

interface UseCategoryOptions {
  mobile?: boolean;
}

export const useCategory = ({ mobile }: UseCategoryOptions = {}) => {
  const { t } = useTranslate('common');

  const iconSize = mobile ? 20 : undefined;

  const isAdmin = true;

  const cateItems: MenuProps['items'] = useMemo(
    () =>
      [
        {
          icon: <Icon icon={MessageSquare} size={iconSize} />,
          key: AppFuncs.Chat,
          label: t('funcs.chat'),
        },
        {
          icon: <Icon icon={MessagesSquare} size={iconSize} />,
          key: AppFuncs.Talk,
          label: t('funcs.talk'),
        },
        {
          icon: <Icon icon={NotebookText} size={iconSize} />,
          key: AppFuncs.Task,
          label: t('funcs.task'),
        },
        {
          icon: <Icon icon={FlaskConical} size={iconSize} />,
          key: AppFuncs.Lab,
          label: t('funcs.lab'),
        },
        { type: 'divider' },
        isAdmin && {
          icon: <Icon icon={Settings} size={iconSize} />,
          key: AppFuncs.Settings,
          label: t('funcs.settings'),
        },
      ].filter(Boolean) as MenuProps['items'],
    [t],
  );

  return cateItems;
};
