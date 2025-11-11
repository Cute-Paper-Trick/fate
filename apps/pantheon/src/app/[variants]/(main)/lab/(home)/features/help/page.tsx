'use client';

import { useTranslate } from '@tolgee/react';
import { Col, Row } from 'antd';
import { FC, useMemo } from 'react';

import styles from './page.module.css';

const Example: FC = () => {
  const { t } = useTranslate('lab_tour');
  const data = useMemo(
    () => [
      {
        title: t('help.content.title1'),
        detail: t('help.content.detail1'),
      },
      {
        title: t('help.content.title2'),
        detail: t('help.content.detail2'),
      },
      {
        title: t('help.content.title3'),
        detail: t('help.content.detail3'),
      },
      {
        title: t('help.content.title4'),
        detail: t('help.content.detail4'),
      },
      {
        title: t('help.content.title5'),
        detail: t('help.content.detail5'),
      },
      {
        title: t('help.content.title6'),
        detail: t('help.content.detail6'),
      },
    ],
    [t],
  );
  return (
    <div className={styles.help}>
      <div className={styles.helpTitle}>
        <div>{t('help.title')}</div>
        <div>{t('help.detail')}</div>
      </div>
      <Row gutter={[20, 20]} style={{ flex: 1 }}>
        {data.map((item, index) => (
          <Col key={index} md={12} span={8} style={{ display: 'flex' }} xl={8} xs={24}>
            <div className={styles.card}>
              <div className={styles.title}>{item.title}</div>
              <div className={styles.detail}>{item.detail}</div>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Example;
