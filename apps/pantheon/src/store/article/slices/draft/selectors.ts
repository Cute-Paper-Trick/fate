import type { ArticleStoreState } from '../../initialState';

// 获取当前草稿
const currentDraft = (s: ArticleStoreState) => s.currentDraft;

// 获取草稿ID
const draftId = (s: ArticleStoreState) => s.currentDraft.id;

// 获取标题
const title = (s: ArticleStoreState) => s.currentDraft.title;

// 获取描述
const description = (s: ArticleStoreState) => s.currentDraft.description;

// 获取封面
const cover = (s: ArticleStoreState) => s.currentDraft.cover;

// 获取编辑器内容
const blocks = (s: ArticleStoreState) => {
  const bs = s.currentDraft.blocks;
  if (bs.length === 0) {
    return undefined;
  }
  return bs;
};

// 获取文章类型
const type = (s: ArticleStoreState) => s.currentDraft.type;

// 获取保存状态
const saveStatus = (s: ArticleStoreState) => s.saveStatus;

// 是否有未保存的变更
const hasUnsavedChanges = (s: ArticleStoreState) => s.saveStatus.hasUnsavedChanges;

// 是否正在保存
const isSaving = (s: ArticleStoreState) => s.saveStatus.isSaving;

// 最后保存时间
const lastSaveAt = (s: ArticleStoreState) => s.saveStatus.lastSaveAt;

// 是否是新文章（没有ID）
const isNewArticle = (s: ArticleStoreState) => !s.currentDraft.id;

// 获取用于保存的数据
const getSaveData = (s: ArticleStoreState) => ({
  id: s.currentDraft.id,
  type: s.currentDraft.type,
  title: s.currentDraft.title,
  description: s.currentDraft.description,
  cover_url: s.currentDraft.cover,
  body: JSON.stringify(s.currentDraft.blocks),
});

export const draftSelectors = {
  currentDraft,
  draftId,
  title,
  description,
  cover,
  blocks,
  type,
  saveStatus,
  hasUnsavedChanges,
  isSaving,
  lastSaveAt,
  isNewArticle,
  getSaveData,
};
