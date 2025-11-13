'use client';

import { Button, Icon, Text, Tooltip } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { createStyles, useResponsive } from 'antd-style';
import { DotIcon } from 'lucide-react';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import OfficialIcon from '@/components/OfficialIcon';
import PublishedTime from '@/components/PublishedTime';
import { useCategory } from '@/hooks/useTutorialCategory';

import { useDetailContext } from './DetailProvider';

const useStyles = createStyles(({ css, token }) => {
  return {
    // author: css`
    //   color: ${token.colorTextDescription};
    // `,
    desc: css`
      color: ${token.colorTextSecondary};
    `,
    time: css`
      font-size: 12px;
      color: ${token.colorTextDescription};
    `,
    version: css`
      font-family: ${token.fontFamilyCode};
      font-size: 13px;
    `,
  };
});

const Header = memo<{ inModal?: boolean; mobile?: boolean }>(({ mobile: isMobile, inModal }) => {
  const { t } = useTranslate('discover');
  const { title, date, id, description, author, category, isOfficial } = useDetailContext();

  const identifier = id;

  const { styles, theme } = useStyles();
  const { mobile = isMobile } = useResponsive();

  const categories = useCategory();
  const cate = categories.find((c) => c.key === category);

  const cateButton = (
    <Button icon={cate?.icon} size={'middle'} variant={'outlined'}>
      {cate?.label}
    </Button>
  );

  return (
    <Flexbox gap={12}>
      <Flexbox align={'flex-start'} gap={16} horizontal width={'100%'}>
        <Flexbox flex={1} gap={4} style={{ overflow: 'hidden' }}>
          <Flexbox
            align={'center'}
            gap={8}
            horizontal
            justify={'space-between'}
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <Flexbox
              align={'center'}
              flex={1}
              gap={12}
              horizontal
              style={{ overflow: 'hidden', position: 'relative' }}
            >
              <Text
                as={'h1'}
                ellipsis
                style={{ fontSize: inModal ? 20 : mobile ? 18 : 24, margin: 0 }}
                title={identifier}
              >
                {title}
              </Text>
              {isOfficial && (
                <Tooltip title={t('isOfficial')}>
                  <OfficialIcon size={24} />
                </Tooltip>
              )}
            </Flexbox>
          </Flexbox>
          <Flexbox align={'center'} gap={4} horizontal>
            {author && (
              <>
                <span>{author}</span>
                <Icon icon={DotIcon} />
              </>
            )}
            <PublishedTime
              className={styles.time}
              date={date as string}
              template={'MMM DD, YYYY'}
            />
          </Flexbox>
        </Flexbox>
      </Flexbox>
      <Flexbox
        align={'center'}
        gap={mobile ? 12 : 24}
        horizontal
        style={{
          color: theme.colorTextSecondary,
        }}
        wrap={'wrap'}
      >
        {!mobile && cateButton}
        <Flexbox align={'center'} gap={mobile ? 12 : 24} horizontal wrap={'wrap'}>
          {description}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default Header;
