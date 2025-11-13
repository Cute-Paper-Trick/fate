import { useTranslate } from '@tolgee/react';
import {
  ActivityIcon,
  BotMessageSquareIcon,
  CameraIcon,
  FolderIcon,
  Gamepad2Icon,
  LayoutPanelTopIcon,
  PersonStandingIcon,
} from 'lucide-react';
import { useMemo } from 'react';

import { TutorialCategory } from '@/types/discover';

export const useCategory = () => {
  const { t } = useTranslate('discover');
  return useMemo(
    () => [
      {
        icon: LayoutPanelTopIcon,
        key: TutorialCategory.All,
        label: t('tutorial.categories.all.name'),
        title: t('tutorial.categories.all.description'),
      },
      {
        icon: Gamepad2Icon,
        key: TutorialCategory.Game,
        label: t('tutorial.categories.game.name'),
        title: t('tutorial.categories.game.description'),
      },
      {
        icon: CameraIcon,
        key: TutorialCategory.Video,
        label: t('tutorial.categories.video.name'),
        title: t('tutorial.categories.video.description'),
      },
      {
        icon: ActivityIcon,
        key: TutorialCategory.Audio,
        label: t('tutorial.categories.audio.name'),
        title: t('tutorial.categories.audio.description'),
      },
      {
        icon: PersonStandingIcon,
        key: TutorialCategory.Posture,
        label: t('tutorial.categories.posture.name'),
        title: t('tutorial.categories.posture.description'),
      },
      {
        icon: BotMessageSquareIcon,
        key: TutorialCategory.Chat,
        label: t('tutorial.categories.chat.name'),
        title: t('tutorial.categories.chat.description'),
      },
      {
        icon: FolderIcon,
        key: TutorialCategory.RAG,
        label: t('tutorial.categories.rag.name'),
        title: t('tutorial.categories.rag.description'),
      },
    ],
    [t],
  );
};

export const useCategoryItem = (key?: TutorialCategory) => {
  const items = useCategory();
  if (!key) return;
  return items.find((item) => item.key === key);
};
