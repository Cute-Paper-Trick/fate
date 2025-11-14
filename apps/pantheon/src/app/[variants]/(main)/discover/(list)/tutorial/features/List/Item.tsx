'use client';

import { Avatar, Block, Icon, Image, Tag, Text, Tooltip } from '@lobehub/ui';
import { Spotlight } from '@lobehub/ui/awesome';
import { useTranslate } from '@tolgee/react';
import { createStyles, cx } from 'antd-style';
import { ClockIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';
import urlJoin from 'url-join';

import OfficialIcon from '@/components/OfficialIcon';
import PublishedTime from '@/components/PublishedTime';
import { useCategory } from '@/hooks/useTutorialCategory';
import { TutorialIndexItem } from '@/types/discover';

const useStyles = createStyles(({ css, token }) => {
  return {
    author: css`
      color: ${token.colorTextDescription};
    `,
    code: css`
      font-family: ${token.fontFamilyCode};
    `,
    desc: css`
      flex: 1;
      margin: 0 !important;
      color: ${token.colorTextSecondary};
    `,
    footer: css`
      margin-block-start: 16px;
      border-block-start: 1px dashed ${token.colorBorder};
      background: ${token.colorBgContainerSecondary};
    `,
    secondaryDesc: css`
      font-size: 12px;
      color: ${token.colorTextDescription};
    `,
    title: css`
      margin: 0 !important;
      font-size: 16px !important;
      font-weight: 500 !important;

      &:hover {
        color: ${token.colorLink};
      }
    `,
  };
});

const McpItem = memo<TutorialIndexItem>(
  ({ title, date, id, description, image, author, category, isFeatured, isOfficial }) => {
    const identifier = id;
    const { t } = useTranslate('discover');
    const { styles } = useStyles();
    const router = useRouter();
    const link = urlJoin('/discover/tutorial', id);

    const categories = useCategory();
    const cate = categories.find((c) => c.key === category);

    return (
      <Block
        clickable
        height={'100%'}
        onClick={() => router.push(link)}
        style={{ overflow: 'hidden', position: 'relative' }}
        variant={'outlined'}
        width={'100%'}
      >
        {<Spotlight size={400} />}
        <Flexbox
          align={'flex-start'}
          gap={16}
          horizontal
          justify={'space-between'}
          padding={16}
          width={'100%'}
        >
          <Flexbox gap={12} horizontal style={{ overflow: 'hidden' }} title={identifier}>
            <Avatar
              avatar={cate?.icon ? <cate.icon /> : '/pantheon.png'}
              size={40}
              style={{ flex: 'none' }}
            />
            <Flexbox flex={1} gap={2} style={{ overflow: 'hidden' }}>
              <Flexbox align={'center'} flex={1} gap={8} horizontal style={{ overflow: 'hidden' }}>
                <Link href={link} style={{ color: 'inherit', overflow: 'hidden' }}>
                  <Text as={'h2'} className={styles.title} ellipsis>
                    {title}
                  </Text>
                </Link>
                {isOfficial && (
                  <Tooltip title={t('isOfficial')}>
                    <OfficialIcon />
                  </Tooltip>
                )}
              </Flexbox>

              {author && <div className={styles.author}>{author}</div>}
            </Flexbox>
          </Flexbox>
        </Flexbox>
        <Flexbox flex={1} gap={12} paddingInline={16}>
          {image && <Image alt={title} preview={false} src={image} />}
          <Text as={'p'} className={styles.desc} ellipsis={{ rows: 3 }}>
            {description}
          </Text>
          <Flexbox
            align={'center'}
            className={styles.secondaryDesc}
            horizontal
            justify={'space-between'}
          >
            <span />
          </Flexbox>
        </Flexbox>
        <Flexbox
          align={'center'}
          className={cx(styles.footer, styles.secondaryDesc)}
          horizontal
          justify={'space-between'}
          padding={16}
        >
          <Flexbox align={'center'} gap={4} horizontal>
            <Icon icon={ClockIcon} size={14} />
            <PublishedTime className={styles.secondaryDesc} date={date} template={'MMM DD, YYYY'} />
          </Flexbox>
          <Flexbox align={'center'} gap={8} horizontal>
            {category && t(`tutorial.categories.${category}.name` as any)}
            {isFeatured && (
              <Tag
                size={'small'}
                style={{ color: 'inherit', fontSize: 'inherit' }}
                variant={'outlined'}
              >
                {t('isFeatured')}
              </Tag>
            )}
          </Flexbox>
          {/* <ConnectionTypeTag type={connectionType} /> */}
          {/* <MetaInfo className={styles.secondaryDesc} installCount={100} stars={100} /> */}
        </Flexbox>
      </Block>
    );
  },
);

export default McpItem;
