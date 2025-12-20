import type { StateCreator } from 'zustand';

import type { Block } from '@/packages/vulcan/Article/Editor';

import type { ArticleStore } from '../../store';
import type { ArticleDraft } from './initialState';

export interface ArticleDraftAction {
  // 初始化草稿（从服务器加载）
  initDraft: (draft: Partial<ArticleDraft>) => void;

  // 更新草稿字段
  updateDraftField: <K extends keyof ArticleDraft>(field: K, value: ArticleDraft[K]) => void;

  // 批量更新草稿
  updateDraft: (updates: Partial<ArticleDraft>) => void;

  // 更新编辑器内容
  updateBlocks: (blocks: Block[]) => void;

  // 标记有未保存的变更
  markUnsaved: () => void;

  // 标记已保存
  markSaved: (saveTime?: Date) => void;

  // 设置保存中状态
  setSaving: (isSaving: boolean) => void;

  // 重置草稿到初始状态
  resetDraft: () => void;

  // 清空内容但保留ID（用于创建新文章后清空）
  clearContent: () => void;
}

export const createDraftSlice: StateCreator<
  ArticleStore,
  [['zustand/devtools', never]],
  [],
  ArticleDraftAction
> = (set) => ({
  initDraft: (draft) => {
    set(
      (state) => ({
        currentDraft: {
          ...state.currentDraft,
          ...draft,
        },
        saveStatus: {
          ...state.saveStatus,
          hasUnsavedChanges: false,
        },
        initialized: true,
      }),
      false,
      'draft/initDraft',
    );
  },

  updateDraftField: (field, value) => {
    set(
      (state) => ({
        currentDraft: {
          ...state.currentDraft,
          [field]: value,
        },
        saveStatus: {
          ...state.saveStatus,
          hasUnsavedChanges: true,
        },
      }),
      false,
      `draft/updateDraftField/${field}`,
    );
  },

  updateDraft: (updates) => {
    set(
      (state) => ({
        currentDraft: {
          ...state.currentDraft,
          ...updates,
        },
        saveStatus: {
          ...state.saveStatus,
          hasUnsavedChanges: true,
        },
      }),
      false,
      'draft/updateDraft',
    );
  },

  updateBlocks: (blocks) => {
    set(
      (state) => ({
        currentDraft: {
          ...state.currentDraft,
          blocks,
        },
        saveStatus: {
          ...state.saveStatus,
          hasUnsavedChanges: true,
        },
      }),
      false,
      'draft/updateBlocks',
    );
  },

  markUnsaved: () => {
    set(
      (state) => ({
        saveStatus: {
          ...state.saveStatus,
          hasUnsavedChanges: true,
        },
      }),
      false,
      'draft/markUnsaved',
    );
  },

  markSaved: (saveTime = new Date()) => {
    set(
      {
        saveStatus: {
          lastSaveAt: saveTime.toLocaleTimeString(),
          hasUnsavedChanges: false,
          isSaving: false,
        },
      },
      false,
      'draft/markSaved',
    );
  },

  setSaving: (isSaving) => {
    set(
      (state) => ({
        saveStatus: {
          ...state.saveStatus,
          isSaving,
        },
      }),
      false,
      'draft/setSaving',
    );
  },

  resetDraft: () => {
    set(
      {
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
      },
      false,
      'draft/resetDraft',
    );
  },

  clearContent: () => {
    set(
      (state) => ({
        currentDraft: {
          ...state.currentDraft,
          title: '',
          description: '',
          cover: '',
          blocks: [],
        },
        saveStatus: {
          lastSaveAt: '未保存',
          hasUnsavedChanges: false,
          isSaving: false,
        },
      }),
      false,
      'draft/clearContent',
    );
  },
});
