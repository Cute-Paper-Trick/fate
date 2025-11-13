import matter from 'gray-matter';
import { template } from 'lodash-es';
import { markdownToTxt } from 'markdown-to-txt';
import urlJoin from 'url-join';

import { FetchCacheTag } from '@/const/cacheControl';
import { appEnv } from '@/envs/app';
import { Locales } from '@/locales/resources';
import { TutorialIndexItem } from '@/types/discover';

const LAST_MODIFIED = new Date().toISOString();

export interface ContentConfig {
  urlTemplate: string;
  docsPath: string;
}

export class ContentService {
  cdnUrls: {
    [key: string]: string;
  } = {};
  config: ContentConfig = {
    urlTemplate: `${appEnv.APP_URL}/public/tutorial/{{path}}`,
    docsPath: '',
  };

  async getIndex(): Promise<TutorialIndexItem[]> {
    try {
      const url = this.genUrl(urlJoin(this.config.docsPath, 'index.json'));

      const res = await fetch(url, {
        next: { revalidate: 3600, tags: [FetchCacheTag.Tutorial] },
      });

      if (res.ok) {
        const data = await res.json();

        return data.tutorial as TutorialIndexItem[];
      }

      return [];
    } catch (error) {
      const cause = (error as Error).cause as { code: string };
      if (cause?.code.includes('ETIMEDOUT')) {
        console.warn(
          '[ContentFetchTimeout] fail to fetch content lists due to network timeout. Please check your network connection.',
        );
      } else {
        console.error('Error getting content lists:', error);
      }

      return [];
    }
  }
  async getIndexItemById(id: string) {
    const index = await this.getIndex();
    return index.find((item) => item.id === id);
  }

  async getPostById(id: string, options?: { locale?: Locales }) {
    // await this.cdnInit();
    try {
      const post = await this.getIndexItemById(id);

      const filename = options?.locale?.startsWith('zh') ? `${id}.mdx` : `${id}.mdx`;
      const url = this.genUrl(urlJoin(this.config.docsPath, filename));

      const response = await fetch(url, {
        next: { revalidate: 3600, tags: [FetchCacheTag.Tutorial] },
      });

      const text = await response.text();
      const { data, content } = matter(text);

      const regex = /^#\s(.+)/;
      const match = regex.exec(content.trim());
      const matches = content.trim().split(regex);

      let description: string;

      if (matches[2]) {
        description = matches[2] ? matches[2].trim() : '';
      } else {
        description = matches[1] ? matches[1].trim() : '';
      }

      return {
        ...post,
        date: post?.date
          ? new Date(post.date)
          : data?.date
            ? new Date(data.date)
            : new Date(LAST_MODIFIED),
        description: markdownToTxt(description.replaceAll('\n', '').replaceAll('  ', ' ')).slice(
          0,
          160,
        ),
        title: match ? match[1] : '',
        ...data,
        content: description,
        rawTitle: match ? match[1] : '',
      };
    } catch (error) {
      console.error('[ChangelogFetchError]failed to fetch changlog post', id);
      console.error(error);

      return false as any;
    }
  }

  private genUrl(path: string) {
    // 自定义分隔符为 {{}}
    const compiledTemplate = template(this.config.urlTemplate, { interpolate: /{{([\S\s]+?)}}/g });

    return compiledTemplate({ ...this.config, path });
  }
}
