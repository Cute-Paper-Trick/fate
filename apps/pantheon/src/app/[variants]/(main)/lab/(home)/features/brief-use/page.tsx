'use client';

import { OpenAIOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { type FC } from 'react';

import BriefUseBtn from './features/brief-use-btn/page';
import styles from './page.module.css';

const BriefUse: FC = () => {
  const { t } = useTranslate('lab_brief_use');
  return (
    <div className={styles.briefUseBtn}>
      <div className={styles.top}>
        <div className={styles.title}>
          <div className={styles.text}>{t('brief_use.title')}</div>
          <div className={styles.des}>{t('brief_use.detail')}</div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <OpenAIOutlined />
          {t('brief_use.card.title')}
        </div>
        <div className={styles.cardDes}>{t('brief_use.card.detail')}</div>
        <BriefUseBtn />
      </div>
    </div>
  );
};

export default BriefUse;
