'use server';

import { createServerInstance, detectLanguageFromHeaders } from '@tolgee/react/server';
import { cookies, headers } from 'next/headers';

import { APP_LOCALE_COOKIE, DEFAULT_LANG } from '@/const/locale';

import { ALL_LANGUAGES, createTolgee } from './tolgee';

export async function setLanguage(locale: string) {
  const cookieStore = await cookies();
  cookieStore.set(APP_LOCALE_COOKIE, locale, {
    maxAge: 1000 * 60 * 60 * 24 * 365, // one year in milisecods
  });
}

export async function getLanguage() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(APP_LOCALE_COOKIE)?.value;
  if (locale && ALL_LANGUAGES.includes(locale)) {
    return locale;
  }

  // try to detect language from headers or use default
  const detected = detectLanguageFromHeaders(await headers(), ALL_LANGUAGES);
  return detected || DEFAULT_LANG;
}

export const { getTolgee, getTranslate, T } = createServerInstance({
  getLocale: getLanguage,
  createTolgee: async (language) => {
    return createTolgee().init({
      observerOptions: {
        fullKeyEncode: true,
      },
      language,
    });
  },
});
