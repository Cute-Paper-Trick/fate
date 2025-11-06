import { StateCreator } from 'zustand';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

import { createDevtools } from '../middleware/createDevtools';
import { TemplateStoreState, initialState } from './initailState';
import { TemplateAction, createTemplateSlice } from './slices/template/actions';

export type TemplateStore = TemplateStoreState & TemplateAction;

const createStore: StateCreator<TemplateStore, [['zustand/devtools', never]], []> = (
  ...parameters
) => ({
  ...initialState,

  ...createTemplateSlice(...parameters),
});

const devtools = createDevtools('template');

export const useTemplateStore = createWithEqualityFn<TemplateStore>()(
  devtools(createStore),
  shallow,
);

export const getTemplateStoreState = () => useTemplateStore.getState();
