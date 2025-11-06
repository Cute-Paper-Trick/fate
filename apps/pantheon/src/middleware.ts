import { createRouteMatcher } from '@clerk/nextjs/server';
import { getCookieCache, getSessionCookie } from 'better-auth/cookies';
import debug from 'debug';
// import { createLocalJWKSet, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';
import urlJoin from 'url-join';

import { APP_LOCALE_COOKIE } from '@/const/locale';
import { APP_THEME_APPEARANCE } from '@/const/theme';
import { appEnv } from '@/envs/app';
import { auth } from '@/features/cerberus/auth';
import { Locales } from '@/locales/resources';
import { parseBrowserLanguage } from '@/utils/locale';
import { RouteVariants } from '@/utils/server/routeVariants';

const logDefault = debug('middleware:default');

const isProtectedRoute = createRouteMatcher(['/', '/dashboard(.*)']);

const isAuthRoute = createRouteMatcher(['/auth(.*)']);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

const isPublicRoute = createRouteMatcher([
  '/',
  '/unauthorized',
  '/lab(.*)',
  '/talk(.*)',
  '/task(.*)',
]);

const middleware = async (request: NextRequest) => {
  const sessionCookie = getSessionCookie(request, { cookiePrefix: 'fate' });

  let session = null;

  // 如果有 session cookie，尝试获取 session
  if (sessionCookie) {
    session = await getCookieCache(request, { cookiePrefix: 'fate' });

    // 如果缓存中没有 session，则从数据库获取
    if (!session) {
      console.log('缓存中未找到 session，正在从数据库获取...');
      session = await auth.api.getSession(request);
    }
  }

  // 未登录访问受保护页面 -> 重定向到登录页
  if (isProtectedRoute(request) && !session) {
    return redirectToLogin(request);
  }

  // 已登录访问鉴权页面 -> 重定向到首页
  if (isAuthRoute(request) && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('用户角色：', isAdminRoute(request), session?.user.role);
  // 访问管理员页面
  if (isAdminRoute(request) && session?.user.role !== 'admin') {
    console.log('非管理员用户，重定向到未授权页面');
    // 需要先进行 variantRewrite，然后 redirect 到带 variants 的 unauthorized 页面
    // const theme = getTheme(request);
    // const { locale } = getLocale(request);
    // const device = getDevice(request);
    // const route = RouteVariants.serializeVariants({
    //   isMobile: device.type === 'mobile',
    //   locale,
    //   theme,
    // });
    // const unauthorizedPath = `/${route}/unauthorized`;
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  // 对所有请求执行 variantRewrite，包括未登录用户
  // 这样 404 页面也能正确显示
  const response = variantRewrite(request);

  return response;
};

export default middleware;

export const config = {
  matcher: [
    '/',
    '/unauthorized',
    '/auth(.*)',
    '/dashboard(.*)',
    '/admin(.*)',
    '/lab(.*)',
    '/talk(.*)',
    '/task(.*)',
    '/brief-introduct(.*)'
  ],
  // matcher: [
  //   /*
  //    * Match all request paths except for the ones starting with:
  //    * - api (API routes)
  //    * - _next/static (static files)
  //    * - _next/image (image optimization files)
  //    * - favicon.ico, sitemap.xml, robots.txt (metadata files)
  //    */
  //   '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  // ],
};

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/auth/sign-in', request.url);
  loginUrl.searchParams.set('callbackUrl', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

/**
 * 变体重写中间件
 * 根据用户的语言、主题和设备类型偏好，重写请求路径以包含相应的变体信息。
 */
function variantRewrite(request: NextRequest) {
  const url = request.nextUrl;
  logDefault('Processing request: %s %s', request.method, request.url);

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
}

/**
 * 获取用户语言偏好
 * 语言设置优先级
 * 1. search params
 * 2. cookie
 * 3. browser
 */
function getLocale(request: NextRequest) {
  const url = request.nextUrl;
  // 最高优先级在搜索参数中明确指定，例如？hl=zh-CN
  const explicitlyLocale = (url.searchParams.get('hl') || undefined) as Locales | undefined;

  // 如果是新用户，没有cookie，所以我们需要使用通过 accept-language 解析的备用语言
  const browserLanguage = parseBrowserLanguage(request.headers);
  const locale =
    explicitlyLocale ||
    ((request.cookies.get(APP_LOCALE_COOKIE)?.value || browserLanguage) as Locales);

  return { browserLanguage, locale };
}

function getTheme(request: NextRequest) {
  return request.cookies.get(APP_THEME_APPEARANCE)?.value || 'light';
}

function getDevice(request: NextRequest) {
  const ua = request.headers.get('user-agent');
  const device = new UAParser(ua || '').getDevice();
  return device;
}
