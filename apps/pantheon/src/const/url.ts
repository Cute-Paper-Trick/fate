import qs from 'query-string';
import urlJoin from 'url-join';

const isDev = process.env.NODE_ENV === 'development';

export const OFFICIAL_SITE = 'https://goood.space';

export const UTM_SOURCE = 'chat_preview';

export const DOCUMENTS = urlJoin(OFFICIAL_SITE, '/docs');

export const GITHUB = 'https://github.com/lobehub/lobe-chat';
export const GITHUB_ISSUES = urlJoin(GITHUB, 'issues/new/choose');

export const DOCUMENTS_REFER_URL = `${DOCUMENTS}?utm_source=${UTM_SOURCE}`;
