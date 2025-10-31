import { APP_LOCALE_COOKIE } from '@/const/locale';
import { setLanguage } from '@/locales/server';
import { LocaleMode } from '@/types/locale';

import { setCookie } from './cookie';

export const switchLang = (locale: LocaleMode) => {
  const lang = locale === 'auto' ? navigator.language : locale;

  setLanguage(lang);
  document.documentElement.lang = lang;

  setCookie(APP_LOCALE_COOKIE, locale === 'auto' ? undefined : locale, 365);
};
