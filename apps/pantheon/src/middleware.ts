import debug from 'debug';
import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import urlJoin from 'url-join';

import { APP_LOCALE_COOKIE } from '@/const/locale';
import { APP_THEME_APPEARANCE } from '@/const/theme';
import { appEnv } from '@/envs/app';
import { Locales } from '@/locales/resources';
import { parseBrowserLanguage } from '@/utils/locale';
import { RouteVariants } from '@/utils/server/routeVariants';

const logDefault = debug('middleware:default');

/**
 * 获取用户语言偏好
 * 语言设置优先级
 * 1. search params
 * 2. cookie
 * 3. browser
 */
const getLocale = (request: NextRequest) => {
  const url = request.nextUrl;
  // 最高优先级在搜索参数中明确指定，例如？hl=zh-CN
  const explicitlyLocale = (url.searchParams.get('hl') || undefined) as Locales | undefined;

  // 如果是新用户，没有cookie，所以我们需要使用通过 accept-language 解析的备用语言
  const browserLanguage = parseBrowserLanguage(request.headers);
  const locale =
    explicitlyLocale ||
    ((request.cookies.get(APP_LOCALE_COOKIE)?.value || browserLanguage) as Locales);

  return { browserLanguage, locale };
};

const getTheme = (request: NextRequest) => {
  return request.cookies.get(APP_THEME_APPEARANCE)?.value || 'light';
};

const getDevice = (request: NextRequest) => {
  const ua = request.headers.get('user-agent');
  const device = new UAParser(ua || '').getDevice();
  return device;
};

const getUserPreferences = (request: NextRequest) => {
  const theme = getTheme(request);
  const { browserLanguage, locale } = getLocale(request);
  const device = getDevice(request);

  logDefault('User preferences: %O', {
    browserLanguage,
    deviceType: device.type,
    hasCookies: {
      locale: !!request.cookies.get(APP_LOCALE_COOKIE)?.value,
      theme: !!request.cookies.get(APP_THEME_APPEARANCE)?.value,
    },
    locale,
    theme,
  });

  return { locale, theme, device };
};

const defaultMiddleware = (request: NextRequest) => {
  const url = request.nextUrl;
  logDefault('Processing request: %s %s', request.method, request.url);

  const { locale, theme, device } = getUserPreferences(request);

  // Create normalized preference values
  const route = RouteVariants.serializeVariants({
    isMobile: device.type === 'mobile',
    locale,
    theme,
  });

  logDefault('Serialized route variant: %s', route);

  // refs: https://github.com/lobehub/lobe-chat/pull/5866
  // new handle segment rewrite: /${route}${originalPathname}
  // / -> /zh-CN__0__dark
  // /discover -> /zh-CN__0__dark/discover
  const nextPathname = `/${route}` + (url.pathname === '/' ? '' : url.pathname);
  const nextURL = appEnv.MIDDLEWARE_REWRITE_THROUGH_LOCAL
    ? urlJoin(url.origin, nextPathname)
    : nextPathname;

  logDefault('URL rewrite: %O', {
    isLocalRewrite: appEnv.MIDDLEWARE_REWRITE_THROUGH_LOCAL,
    nextPathname: nextPathname,
    nextURL: nextURL,
    originalPathname: url.pathname,
  });

  url.pathname = nextPathname;

  return NextResponse.rewrite(url, { status: 200 });
};

export default defaultMiddleware;

// Configure middleware to exclude static files and API routes
export const config = {
  matcher: [
    '/'
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - monitoring (Sentry tunnel route)
     * - manifest.webmanifest (PWA manifest)
     */
    // '/((?!api|_next/static|_next/image|favicon.ico|monitoring|manifest.webmanifest).*)',
  ],
};
