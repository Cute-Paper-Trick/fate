'use client';

import { GuideCard } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { Button, Flex, Modal, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import styles from './page.module.css';

const BriefUseModal: FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslate('lab_tour');
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleNavigate = (path: string) => {
    setLoading(true); // 开始加载
    router.push(path);
  };

  return (
    <>
      <Button className={styles.button} key="training" onClick={showModal} type="primary">
        {t('brief_use.card.btn')}
      </Button>
      <Modal
        centered
        className={styles.briefModal}
        footer={null}
        onCancel={handleCancel}
        open={isModalOpen}
        title={t('brief_use.modal.title')}
        width={1200}
      >
        <Spin spinning={loading}>
          <Flex style={{ justifyContent: 'space-between' }}>
            <GuideCard
              className={styles.item_btn}
              closable={false}
              cover={'/training/training-image.png'}
              desc={t('new_project.image.description')}
              height={300}
              onClick={() => handleNavigate('/lab/image-classifier')}
              style={{ width: 300, cursor: 'pointer' }}
              title={t('new_project.image.title')}
              width={300}
            />

            <GuideCard
              className={styles.item_btn}
              closable={false}
              cover={'/training/training-audio.png'}
              desc={t('new_project.audio.description')}
              height={300}
              onClick={() => handleNavigate('/lab/audio-classifier')}
              style={{ width: 300, cursor: 'pointer' }}
              title={t('new_project.audio.title')}
              width={300}
            />

            <GuideCard
              className={styles.item_btn}
              closable={false}
              cover={'/training/training-pose.png'}
              desc={t('new_project.pose.description')}
              height={300}
              onClick={() => handleNavigate('/lab/pose-classifier')}
              style={{ width: 300, cursor: 'pointer' }}
              title={t('new_project.pose.title')}
              width={300}
            />
          </Flex>
        </Spin>
      </Modal>
    </>
  );
};

export default BriefUseModal;
