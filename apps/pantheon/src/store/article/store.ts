import type { StateCreator } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { type ArticleStoreState, initialState } from './initialState';
import { type ArticleDraftAction, createDraftSlice } from './slices/draft/actions';

export type ArticleStore = ArticleStoreState & ArticleDraftAction;

const createStore: StateCreator<ArticleStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialState,
  ...createDraftSlice(...parameters),
});

const devtools = createDevtools('article');

export const useArticleStore = createWithEqualityFn<ArticleStore>()(
  subscribeWithSelector(devtools(createStore)),
  shallow,
);

export const getArticleStoreState = () => useArticleStore.getState();
