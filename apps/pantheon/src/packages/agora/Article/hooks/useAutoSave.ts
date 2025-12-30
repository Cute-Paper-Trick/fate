import { Content } from '@tiptap/core';
import { useInterval } from 'ahooks';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useState } from 'react';

import { useContentsCreate, useContentsUpdate } from '@/lib/http';

interface UseAutoSaveOptions {
  onSuccess?: () => void;
  data: {
    cover?: string;
    title?: string;
    description?: string;
    content?: Content;
    collectionId?: number;
  };
}

export const useAutoSave = ({ onSuccess, data }: UseAutoSaveOptions) => {
  const [id, setId] = useQueryState('id', parseAsInteger);

  const [hasUnsavedChanges, setUnsavedChanges] = useState(false);

  const createMutation = useContentsCreate({
    mutation: {
      onSuccess: (data) => {
        onSuccess?.();
        setId(data.id);
        setUnsavedChanges(false);
      },
    },
  });

  const updateMutation = useContentsUpdate({
    mutation: {
      onSuccess: () => {
        onSuccess?.();
        setUnsavedChanges(false);
      },
    },
  });

  const save = ({ force }: { force?: boolean } = {}) => {
    if (!hasUnsavedChanges && !force) {
      console.log(new Date().toLocaleTimeString(), 'everything is updated');
      return;
    }

    console.log(new Date().toLocaleTimeString(), 'saving draft');

    if (!id) {
      console.log('creating draft');
      createMutation.mutate({
        data: {
          type: 1,
          title: data.title,
          description: data.description,
          cover_url: data.cover,
          collection_id: data.collectionId,
          body: JSON.stringify(data.content),
        },
      });
      return;
    }

    console.log('updating draft');
    updateMutation.mutate({
      data: {
        id,
        type: 1,
        title: data.title,
        description: data.description,
        cover_url: data.cover,
        collection_id: data.collectionId,
        body: JSON.stringify(data.content),
      },
    });
  };

  useInterval(() => {
    save();
  }, 1000 * 30);

  return {
    saving: createMutation.isPending || updateMutation.isPending,
    forceSave: () => save({ force: true }),
    hasUnsavedChanges,
    setUnsavedChanges,
  };
};
