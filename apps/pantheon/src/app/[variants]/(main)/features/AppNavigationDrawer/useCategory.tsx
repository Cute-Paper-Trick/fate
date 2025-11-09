import { Icon } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { BrainCog, FlaskConical, MessageSquare, MessagesSquare, NotebookText } from 'lucide-react';
import Link from 'next/link';

import { MenuProps } from '@/components/Menu';
import { AppTab } from '@/store/global/initialState';

export const useCategory = () => {
  const { t } = useTranslate('common');

  const cateItems: MenuProps['items'] = [
    {
      icon: <Icon icon={MessageSquare} />,
      key: AppTab.Chat,
      label: (
        <Link href={'/chat'} onClick={(e) => e.preventDefault()}>
          {t('tab.chat')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={MessagesSquare} />,
      key: AppTab.Talk,
      label: (
        <Link href={'/talk'} onClick={(e) => e.preventDefault()}>
          {t('tab.talk')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={FlaskConical} />,
      key: AppTab.Lab,
      label: (
        <Link href={'/lab'} onClick={(e) => e.preventDefault()}>
          {t('tab.lab')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={NotebookText} />,
      key: AppTab.Learning,
      label: (
        <Link href={'/learning'} onClick={(e) => e.preventDefault()}>
          {t('tab.learning')}
        </Link>
      ),
    },
    {
      icon: <Icon icon={BrainCog} />,
      key: AppTab.Discover,
      label: (
        <Link href={'/discover/tutorial'} onClick={(e) => e.preventDefault()}>
          {t('tab.discover')}
        </Link>
      ),
    },
  ].filter(Boolean) as MenuProps['items'];

  return cateItems;
};
