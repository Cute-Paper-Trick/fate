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
  const { t } = useTranslate('lab');
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button className={styles.button} key="training" onClick={showModal} type="primary">
        {t('new_project.title', '开始训练')}
      </Button>
      <Modal
        centered
        className={styles.briefModal}
        footer={null}
        onCancel={handleCancel}
        open={isModalOpen}
        title={t('新项目')}
        width={1200}
      >
        <Flex style={{ justifyContent: 'space-between' }}>
          <GuideCard
            closable={false}
            cover={'/training/training-image.png'}
            desc={t(
              'new_project.image.description',
              '点击训练按钮，等待模型完成。之后，您可以用新图片测试模型效果',
            )}
            height={300}
            onClick={() => router.push('/lab/image-classifier')}
            style={{ width: 300 }}
            title={t('new_project.image.title', '图片训练')}
            width={300}
          />

          <GuideCard
            closable={false}
            cover={'/training/training-audio.png'}
            desc={t(
              'new_project.audio.description',
              '开始训练。训练完成后，通过麦克风实时测试您的声音识别模型。',
            )}
            height={300}
            onClick={() => router.push('/lab/audio-classifier')}
            style={{ width: 300 }}
            title={t('new_project.audio.title', '音频训练')}
            width={300}
          />

          <GuideCard
            closable={false}
            cover={'/training/training-pose.png'}
            desc={t(
              'new_project.pose.description',
              '训练模型，并在完成后通过摄像头实时预览姿势识别效果。',
            )}
            height={300}
            onClick={() => router.push('/lab/audio-classifier')}
            style={{ width: 300 }}
            title={t('new_project.pose.title', '姿态训练')}
            width={300}
          />
        </Flex>
      </Modal>
    </>
  );
};

export default BriefUseModal;
