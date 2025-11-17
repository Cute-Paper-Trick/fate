import { BackendFetch, DevBackend, FormatSimple, Tolgee } from '@tolgee/web';
import { InContextTools } from '@tolgee/web/tools';

import { DEFAULT_LANG } from '@/const/locale';
import { appEnv } from '@/envs/app';

const apiKey = process.env.NEXT_PUBLIC_TOLGEE_API_KEY;
const apiUrl = process.env.NEXT_PUBLIC_TOLGEE_API_URL;

export const ALL_LANGUAGES = ['en', 'zh'];

// const LANGUAGE_COOKIE = 'NEXT_LOCALE';

export const createTolgee = (lang?: string) => {
  const instance = Tolgee()
    .use(FormatSimple())
    // .use(DevTools()) // 启用页内翻译
    .use(DevBackend()) // 从 Tolgee 平台动态加载翻译数据
    // .use(BackendFetch()) // 从 CDN 加载预编译的翻译文件
    .updateDefaults({
      defaultNs: 'common',
      staticData: {
        'en:betterAuth': () => import('@/localization/betterAuth/en.json'),
        'zh:betterAuth': () => import('@/localization/betterAuth/zh-CN.json'),
        'zh:lab_tour': () => import('@/localization/lab/zh-CN.json'),
        'zh:talk': () => import('@/localization/talk/zh-CN.json'),
      },
      language: lang || DEFAULT_LANG,
      apiKey,
      apiUrl,
      projectId: 7,
    });

  if (appEnv.NEXT_PUBLIC_TOLGEE_DELIVERY) {
    instance.use(BackendFetch({ prefix: appEnv.NEXT_PUBLIC_TOLGEE_DELIVERY }));
  }

  if (appEnv.NEXT_PUBLIC_ENABLE_TRANS_TOOLS) {
    instance.use(
      InContextTools({
        // credentials: {
        //   apiKey,
        //   apiUrl,
        //   projectId: 7,
        // },
      }),
    );
  }

  return instance;
};
