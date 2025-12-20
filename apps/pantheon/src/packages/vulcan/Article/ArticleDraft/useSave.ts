import { useInterval } from 'ahooks';
import { parseAsInteger, useQueryState } from 'nuqs';

import { useContentsCreate, useContentsUpdate } from '@/lib/http';
import { useArticleStore } from '@/store/article';
import { draftSelectors } from '@/store/article/selectors';

export const useSave = () => {
  const [, setId] = useQueryState('id', parseAsInteger);

  const currentDraft = useArticleStore(draftSelectors.currentDraft);
  const hasUnsavedChanges = useArticleStore(draftSelectors.hasUnsavedChanges);

  const updateDraft = useArticleStore((s) => s.updateDraft);
  const markSaved = useArticleStore((s) => s.markSaved);
  const setSaving = useArticleStore((s) => s.setSaving);

  const createMutation = useContentsCreate({
    mutation: {
      onSuccess: (data) => {
        setId(data.id);
        updateDraft({ id: data.id });
        markSaved();
      },
    },
  });

  const updateMutation = useContentsUpdate({
    mutation: {
      onSuccess: () => {
        markSaved();
      },
    },
  });

  const save = ({ force }: { force?: boolean } = {}) => {
    if (!hasUnsavedChanges && !force) {
      console.log(new Date().toLocaleTimeString(), 'everything is updated');
      return;
    }

    console.log(new Date().toLocaleTimeString(), 'saving draft');
    setSaving(true);

    if (!currentDraft.id) {
      createMutation.mutate({
        data: {
          type: currentDraft.type,
          title: currentDraft.title,
          description: currentDraft.description,
          cover_url: currentDraft.cover,
          body: JSON.stringify(currentDraft.blocks),
        },
      });
      return;
    }

    updateMutation.mutate({
      data: {
        id: currentDraft.id,
        type: currentDraft.type,
        title: currentDraft.title,
        description: currentDraft.description,
        cover_url: currentDraft.cover,
        body: JSON.stringify(currentDraft.blocks),
      },
    });
  };

  useInterval(() => {
    save();
  }, 1000 * 30);

  return () => save({ force: true });
};
