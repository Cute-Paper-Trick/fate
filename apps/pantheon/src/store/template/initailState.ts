import { TemplateState, initialTemplateState } from './slices/template/initialState';

export type TemplateStoreState = TemplateState;

export const initialState: TemplateStoreState = {
  ...initialTemplateState,
};
