'use client';

import { useTranslate } from '@tolgee/react';
import { Col, Row } from 'antd';
import { FC } from 'react';

import styles from './page.module.css';

const FunctionPreview: FC = () => {
  const { t } = useTranslate('lab_tour');
  return (
    <div className={styles.experience}>
      <div className={styles.title}>
        <span>{t('preview.title')}</span>
      </div>
      <div className={styles.card}>
        <div className={`${styles.cardContent}`}>
          <Row gutter={[20, 20]} style={{ flex: 1 }}>
            <Col sm={12} style={{ display: 'flex' }} xs={24}>
              <div className={styles.image}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/piano.mp4"
                />
              </div>
            </Col>
            <Col sm={12} style={{ display: 'flex' }} xs={24}>
              <div className={styles.image}>
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  src="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/rock_paper_scissors.mp4"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default FunctionPreview;
