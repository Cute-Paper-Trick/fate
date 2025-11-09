'use client';

import { OpenAIOutlined } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { type FC } from 'react';

import BriefUseBtn from './features/brief-use-btn/page';
import styles from './page.module.css';

const BriefUse: FC = () => {
  const { t } = useTranslate('');
  return (
    <div className={styles.briefUseBtn}>
      <div className={styles.top}>
        <div className={styles.title}>
          <div className={styles.text}>{t('AI 实验室')}</div>
          <div className={styles.des}>
            {t('探索、训练和部署您自己的AI模型。无需代码，即刻开始您的创新之旅。')}
          </div>
        </div>
      </div>
      <div className={styles.card}>
        <div className={styles.cardTitle}>
          <OpenAIOutlined />
          {t('模型训练体验器')}
        </div>
        <div className={styles.cardDes}>
          {t('点击下面的按钮，选择一个项目开始训练您自己的AI模型。')}
        </div>
        <BriefUseBtn />
      </div>
    </div>
  );
};

export default BriefUse;
