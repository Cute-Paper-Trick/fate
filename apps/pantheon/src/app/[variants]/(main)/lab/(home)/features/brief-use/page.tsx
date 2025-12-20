'use client';

import { OpenAIOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Col, Row } from 'antd';
import { type FC } from 'react';

import BriefUseBtn from './features/brief-use-btn/page';
import styles from './page.module.css';

const BriefUse: FC = () => {
  const { t } = useTranslate('lab_tour');
  return (
    <div className={styles.briefUseBtn}>
      <div className={styles.top}>
        <div className={styles.title}>
          <div className={styles.text}>{t('tab.lab', { ns: 'common' })}</div>
          <div className={styles.des}>{t('brief_use.detail')}</div>
        </div>
      </div>
      <div className={styles.card}>
        <Row gutter={[20, 20]} style={{ flex: 1 }}>
          <Col md={12} style={{ display: 'flex' }} xs={24}>
            <div className={styles.cardLeft}>
              <div className={styles.cardTitle}>
                <OpenAIOutlined />
                {t('brief_use.card.title')}
              </div>
              <div className={styles.cardDes}>{t('brief_use.card.detail')}</div>
              <BriefUseBtn />
            </div>
          </Col>
          <Col md={12} style={{ display: 'flex' }} xs={24}>
            <div className={styles.cardRight}>
              <video
                autoPlay
                loop
                muted
                playsInline
                src="https://goood-space-assets.oss-cn-beijing.aliyuncs.com/public/cca1ca3a771bf69acbf506730e38b536.mov"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default BriefUse;
