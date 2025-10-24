import { supportLocales } from '@/locales/resources';

export const DEFAULT_LANG = 'zh';
export const APP_LOCALE_COOKIE = 'APP_LOCALE';

/**
 * Check if the language is supported
 * @param locale
 */
export const isLocaleNotSupport = (locale: string) => !supportLocales.includes(locale);
