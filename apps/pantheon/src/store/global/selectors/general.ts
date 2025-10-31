import { Locales } from '@/locales/resources';

import { GlobalState } from '../initialState';
import { systemStatus } from './systemStatus';

const language = (s: GlobalState) => systemStatus(s).language || 'auto';

const currentLanguage = (s: GlobalState) => {
  const locale = language(s);

  if (locale === 'auto') {
    return navigator.language as Locales;
  }

  return locale as Locales;
};

export const globalGeneralSelectors = {
  currentLanguage,
  language,
};
