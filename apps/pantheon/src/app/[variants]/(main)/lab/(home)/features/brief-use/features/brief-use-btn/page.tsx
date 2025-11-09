'use client';

import { useTranslate } from '@tolgee/react';
import { Button, Modal } from 'antd';
import { FC, useState } from 'react';

import styles from './page.module.css';

const BriefUseModal: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslate('');
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className={styles.button} key="training" onClick={showModal} type="primary">
        {t('开始训练')}
      </Button>
      <Modal
        centered
        className={styles.briefModal}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('取消')}
          </Button>,
        ]}
        onCancel={handleCancel}
        open={isModalOpen}
        title={t('新项目')}
        width={1200}
      />
    </>
  );
};

export default BriefUseModal;
