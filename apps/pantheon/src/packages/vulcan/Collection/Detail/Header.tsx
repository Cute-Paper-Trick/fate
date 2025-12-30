'use client';

import { Tabs } from '@lobehub/ui';
import { ConfigProvider } from 'antd';
import { createStyles } from 'antd-style';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { memo } from 'react';
import { Flexbox } from 'react-layout-kit';

import { useCollectionsDetail } from '@/lib/http';
import { RemoteWrapper } from '@/packages/pithos';

// import Subscription from './Subscription';

const useStyles = createStyles(({ css, prefixCls }) => ({
  header: css`
    width: 100%;
    position: relative;
    background-color: #878787;
    color: #fff;
    overflow: hidden;

    .${prefixCls}-tabs-tab-btn {
      color: #fff;
    }
  `,
  bg: css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-position: 50%;
    background-repeat: no-repeat;
    background-size: cover;
  `,
  cover: css`
    background: rgba(0, 0, 0, 0.06);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  `,
  container: css`
    min-height: 13.125rem;
    padding-bottom: 1.25rem;
    padding-top: 1.25rem;
    text-align: center;
    max-width: 100%;
    width: 100%;
    position: relative;
  `,
  inner: css`
    position: relative;
  `,
  body: css`
    position: relative;
  `,
  title: css`
    font-size: 1.53125rem;
    margin-bottom: 1rem;
    font-weight: 600;
  `,
  desc: css`
    font-size: 1rem;
    font-weight: 400;
  `,
  footerContainer: css`
    padding-inline: 1.25rem;
  `,
  footer: css`
    position: relative;
  `,
  actions: css`
    position: absolute;
    right: 0;
    bottom: 15px;
    gap: 1em;

    span {
      line-height: 35px;
    }
  `,
  tabs: css`
    color: #fff;
  `,
}));

const process = [
  'image',
  'resize,limit_1,m_fixed,w_100,h_100',
  'quality,q_90',
  'format,jpg',
  'blur,r_5,s_5',
];

const CollectionHeader = memo(() => {
  const { styles, cx } = useStyles();

  const [collectionId] = useQueryState('collectionId', parseAsInteger);
  const [cate, setCate] = useQueryState('cate', { ...parseAsString, defaultValue: 'all' });

  const { data } = useCollectionsDetail(
    { id: collectionId as any as number },
    { query: { enabled: !!collectionId } },
  );

  const collection = data?.collection;
  const cover = collection?.cover_url || '';
  const title = collection?.name || '';
  const description = collection?.description || '';

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            inkBarColor: 'rgb(255,255,255)',
            itemActiveColor: 'rgb(255,255,255)',
            itemSelectedColor: 'rgb(255,255,255)',
            itemHoverColor: 'rgb(255,255,255)',
            itemColor: 'rgba(255,255,255)',
          },
        },
      }}
    >
      <Flexbox className={styles.header}>
        <RemoteWrapper path={cover} process={process}>
          {(real_src) => (
            <div
              className={cx(styles.bg, 'bg')}
              style={{
                backgroundImage: `url(${real_src})`,
              }}
            />
          )}
        </RemoteWrapper>
        <div className={styles.cover} />
        <div className={styles.inner}>
          <div className={styles.body}>
            <Flexbox align="center" className={styles.container} justify="center">
              <div className={styles.title}>{title}</div>
              <div className={styles.desc}>{description}</div>
            </Flexbox>
          </div>
          <div className={styles.footerContainer}>
            <Flexbox className={cx(styles.footer, 'footer')} horizontal width={'100%'}>
              <Tabs
                activeKey={cate || ''}
                className={cx(styles.tabs)}
                items={[
                  { key: 'all', label: '全部' },
                  { key: 'articles', label: '文章' },
                ]}
                onChange={(activeKey) => setCate(activeKey)}
              />
              {/* <Flexbox className={styles.actions}>
                <Subscription />
              </Flexbox> */}
            </Flexbox>
          </div>
        </div>
      </Flexbox>
    </ConfigProvider>
  );
});

export default CollectionHeader;
