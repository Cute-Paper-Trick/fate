import { type ArticleDraftState, initialDraftState } from './slices/draft/initialState';

export type ArticleStoreState = ArticleDraftState;

export const initialState: ArticleStoreState = {
  ...initialDraftState,
};
