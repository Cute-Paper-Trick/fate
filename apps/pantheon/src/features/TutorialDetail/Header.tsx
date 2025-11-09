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
  const {
    title,
    date,
    id,
    // description,
    // image,
    author,
    category,
    // isFeatured,
    isOfficial,
  } = useDetailContext();

  const identifier = id;

  const { styles, theme } = useStyles();
  const { mobile = isMobile } = useResponsive();

  // const recommendedDeployment = getRecommendedDeployment(deploymentOptions);
  const categories = useCategory();
  const cate = categories.find((c) => c.key === category);

  // const scores = (
  //   <Scores
  //     deploymentOptions={deploymentOptions}
  //     github={github}
  //     identifier={identifier as string}
  //     isClaimed={isClaimed}
  //     isValidated={isValidated}
  //     overview={overview}
  //     promptsCount={promptsCount}
  //     resourcesCount={resourcesCount}
  //     toolsCount={toolsCount}
  //   />
  // );

  const cateButton = (
    // <Link
    //   href={qs.stringifyUrl({
    //     query: { category: cate?.key },
    //     url: '/discover/mcp',
    //   })}
    // >
    <Button icon={cate?.icon} size={'middle'} variant={'outlined'}>
      {cate?.label}
    </Button>
    // </Link>
  );

  return (
    <Flexbox gap={12}>
      <Flexbox align={'flex-start'} gap={16} horizontal width={'100%'}>
        {/* <Avatar avatar={icon} size={mobile ? 48 : 64} /> */}
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
            <Flexbox align={'center'} gap={6} horizontal>
              {/* {recommendedDeployment?.installationMethod && (
                <InstallationIcon type={recommendedDeployment.installationMethod} />
              )} */}
              {/* {github?.url && (
                <Link href={github.url} onClick={(e) => e.stopPropagation()} target={'_blank'}>
                  <ActionIcon fill={theme.colorTextDescription} icon={Github} />
                </Link>
              )} */}
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
        {/* {mobile && scores} */}
        {!mobile && cateButton}
        <Flexbox align={'center'} gap={mobile ? 12 : 24} horizontal wrap={'wrap'}>
          {/* {Boolean(github?.language) && (
            <Flexbox align={'center'} gap={6} horizontal>
              <Icon
                color={theme.colorFillTertiary}
                fill={getLanguageColor(github?.language)}
                icon={CircleIcon}
                size={12}
              />
              {github?.language}
            </Flexbox>
          )} */}
          {/* {Boolean(github?.license) && (
            <Flexbox align={'center'} gap={6} horizontal>
              <Icon icon={ScaleIcon} size={14} />
              {github?.license}
            </Flexbox>
          )} */}
          {/* {Boolean(installCount) && (
            <Flexbox align={'center'} gap={6} horizontal>
              <Icon icon={DownloadIcon} size={14} />
              {installCount}
            </Flexbox>
          )} */}
          {/* {Boolean(github?.stars) && (
            <Flexbox align={'center'} gap={6} horizontal>
              <Icon icon={StarIcon} size={14} />
              {github?.stars}
            </Flexbox>
          )} */}
        </Flexbox>
      </Flexbox>
    </Flexbox>
  );
});

export default Header;
