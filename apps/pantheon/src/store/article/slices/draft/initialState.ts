import type { Block } from '@fate/vulcan/Article/Editor';

export interface ArticleDraft {
  id?: number;
  title: string;
  description: string;
  cover: string;
  blocks: Block[];
  type: number;
}

export interface SaveStatus {
  lastSaveAt: string;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export interface ArticleDraftState {
  initialized: boolean;

  currentDraft: ArticleDraft;
  saveStatus: SaveStatus;
}

export const initialDraftState: ArticleDraftState = {
  initialized: false,

  currentDraft: {
    title: '',
    description: '',
    cover: '',
    blocks: [],
    type: 1,
  },
  saveStatus: {
    lastSaveAt: '未保存',
    hasUnsavedChanges: false,
    isSaving: false,
  },
};
