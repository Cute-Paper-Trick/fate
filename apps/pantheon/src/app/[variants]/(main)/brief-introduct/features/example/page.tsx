'use client';

import { AudioFilled, FileImageFilled, SmileFilled } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Steps } from 'antd';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';

import AUDIO_PROJECT from '@/app/assets/images/brief-introduct-img/audio-project.png';
import IMAGE_PROJECT from '@/app/assets/images/brief-introduct-img/image-project.png';
import POSTTURE_PROJECT from '@/app/assets/images/brief-introduct-img/posture-project.png';

import styles from './page.module.css';

const Example: FC = () => {
  const { t } = useTranslate('');
  const router = useRouter();
  const data = useMemo(
    () => [
      {
        title: t('图片项目教程'),
        icon: <FileImageFilled />,
        img: IMAGE_PROJECT,
        src: 'image-training.html',
        stepList: [
          { title: t('创建类别'), description: t('为您的图片分类，例如“猫”和“狗”。') },
          { title: t('上传样本'), description: t('为每个类别上传相应的图片样本。') },
          {
            title: t('训练并预览'),
            description: t('点击训练按钮，等待模型完成。之后，您可以用新图片测试模型效果。'),
          },
        ],
      },
      {
        title: t('音频项目教程'),
        icon: <AudioFilled />,
        img: AUDIO_PROJECT,
        src: '/audio-training.html',
        stepList: [
          {
            title: t('定义声音类别'),
            description: t('首先，定义您想要识别的声音类别，如“鼓掌”、“打字声”。'),
          },
          {
            title: t('录制或上传音频'),
            description: t('为每个类别录制或上传至少10秒的音频样本。'),
          },
          {
            title: t('训练和测试'),
            description: t('开始训练。训练完成后，通过麦克风实时测试您的声音识别模型。'),
          },
        ],
      },
      {
        title: t('姿态项目教程'),
        icon: <SmileFilled />,
        img: POSTTURE_PROJECT,
        src: 'pose-detection.html',
        stepList: [
          {
            title: t('设定姿势类别'),
            description: t('创建您希望模型识别的姿势类别，例如“站立”、“坐下”。'),
          },
          {
            title: t('采集姿势样本'),
            description: t('使用摄像头为每个类别采集姿势图片或短视频。'),
          },
          {
            title: t('训练并实时预览'),
            description: t('训练模型，并在完成后通过摄像头实时预览姿势识别效果。'),
          },
        ],
      },
    ],
    [t],
  );
  return (
    <div className={styles.example}>
      <div className={styles.title}>
        <span>{t('训练实例教程')}</span>
      </div>
      {data.map((item, index) => (
        <div className={styles.card} key={index} onClick={() => router.push(item.src)}>
          <div className={styles.cardTitle}>
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.title}</span>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.image}>
              <Image alt={item.title} src={item.img} />
            </div>
            <div className={styles.flow}>
              <Steps current={0} direction="vertical" items={item.stepList} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Example;
