'use client';

import { GuideCard } from '@lobehub/ui';
import { useTranslate } from '@tolgee/react';
import { Button, Flex, Modal } from 'antd';
import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';

import styles from './page.module.css';

const BriefUseModal: FC = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslate('lab_brief_use');
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className={styles.button} key="training" onClick={showModal} type="primary">
        {t('brief_use.card.btn')}
      </Button>
      <Modal
        centered
        className={styles.briefModal}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            {t('brief_use.card.btn.cancel')}
          </Button>,
        ]}
        onCancel={handleCancel}
        open={isModalOpen}
        title={t('brief_use.modal.title')}
        width={1200}
      >
        <Flex style={{ justifyContent: 'space-between' }}>
          <GuideCard
            closable={false}
            cover={'/training/training-image.png'}
            desc={t('new_project.image.description')}
            height={300}
            onClick={() => router.push('/lab/image-classifier')}
            style={{ width: 300 }}
            title={t('new_project.image.title')}
            width={300}
          />

          <GuideCard
            closable={false}
            cover={'/training/training-audio.png'}
            desc={t('new_project.audio.description')}
            height={300}
            onClick={() => router.push('/lab/audio-classifier')}
            style={{ width: 300 }}
            title={t('new_project.audio.title')}
            width={300}
          />

          <GuideCard
            closable={false}
            cover={'/training/training-pose.png'}
            desc={t('new_project.pose.description')}
            height={300}
            onClick={() => router.push('/lab/audio-classifier')}
            style={{ width: 300 }}
            title={t('new_project.pose.title')}
            width={300}
          />
        </Flex>
      </Modal>
    </>
  );
};

export default BriefUseModal;
