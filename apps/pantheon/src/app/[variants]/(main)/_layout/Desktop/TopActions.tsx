import { ActionIcon, ActionIconProps } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import {
  BookOpenCheck,
  Compass,
  FlaskConical,
  FolderClosed,
  MessageSquare,
  MessagesSquare,
  NotebookText,
  Palette,
} from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { AppTab } from '@/store/global/initialState';

const ICON_SIZE: ActionIconProps['size'] = {
  blockSize: 40,
  size: 24,
  strokeWidth: 2,
};

export interface TopActionProps {
  isPinned?: boolean | null;
  tab?: AppTab;
}

const TopActions = memo<TopActionProps>(({ tab, isPinned }) => {
  const { t } = useTranslate('common');

  const isChatActive = tab === AppTab.Chat && !isPinned;
  const isDiscoverActive = false;
  const isTalkActive = tab === AppTab.Talk;
  const isLabActice = tab === AppTab.Lab;
  const isLearningActive = tab === AppTab.Learning;
  const isTutorialActive = tab === AppTab.Discover;

  const CHAT_APP_HOST = 'http://localhost:3010';

  return (
    <Flexbox gap={8}>
      <Link
        aria-label={t('tab.chat')}
        href={`${CHAT_APP_HOST}/chat`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ActionIcon
          active={isChatActive}
          icon={MessageSquare}
          size={ICON_SIZE}
          title={
            <Flexbox align={'center'} gap={8} horizontal justify={'space-between'}>
              <span>{t('tab.chat')}</span>
            </Flexbox>
          }
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link aria-label={t('tab.talk')} href={'/talk'}>
        <ActionIcon
          active={isTalkActive}
          icon={MessagesSquare}
          size={ICON_SIZE}
          title={t('tab.talk')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link aria-label={t('tab.learning')} href={'/learning'}>
        <ActionIcon
          active={isLearningActive}
          icon={NotebookText}
          size={ICON_SIZE}
          title={t('tab.learning')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link aria-label={t('tab.lab')} href={'/lab'}>
        <ActionIcon
          active={isLabActice}
          icon={FlaskConical}
          size={ICON_SIZE}
          title={t('tab.lab')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link
        aria-label={t('tab.files')}
        href={`${CHAT_APP_HOST}/files`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ActionIcon
          icon={FolderClosed}
          size={ICON_SIZE}
          title={t('tab.files')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link
        aria-label={t('tab.aiImage')}
        href={`${CHAT_APP_HOST}/image`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ActionIcon
          icon={Palette}
          size={ICON_SIZE}
          title={t('tab.aiImage')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link
        aria-label={t('tab.discover')}
        href={`${CHAT_APP_HOST}/discover`}
        rel="noopener noreferrer"
        target="_blank"
      >
        <ActionIcon
          active={isDiscoverActive}
          icon={Compass}
          size={ICON_SIZE}
          title={t('tab.discover')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
      <Link aria-label={t('tab.tutorial')} href={'/discover'}>
        <ActionIcon
          active={isTutorialActive}
          icon={BookOpenCheck}
          size={ICON_SIZE}
          title={t('tab.tutorial')}
          tooltipProps={{ placement: 'right' }}
        />
      </Link>
    </Flexbox>
  );
});

export default TopActions;
