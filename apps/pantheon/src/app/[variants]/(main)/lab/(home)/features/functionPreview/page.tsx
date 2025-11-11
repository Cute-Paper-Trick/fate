'use client';

import { AudioFilled, FileImageFilled, SmileFilled } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Col, Row } from 'antd';
import Image from 'next/image';
import { FC, useMemo } from 'react';

import AUDIO_FUNCTION from '@/app/assets/images/brief-introduct-img/audio-function.png';
import IMAGE_FUNCTION from '@/app/assets/images/brief-introduct-img/image-function.png';
import POSTTURE_FUNCTION from '@/app/assets/images/brief-introduct-img/posture-function.png';

import styles from './page.module.css';

const FunctionPreview: FC = () => {
  const { t } = useTranslate('lab_tour');
  const data = useMemo(
    () => [
      {
        title: t('preview.image.title'),
        icon: <FileImageFilled />,
        img: IMAGE_FUNCTION,
        src: 'image-training.html',
        imagePosition: 'right',
        detail: t('preview.image.detail'),
        stepList: [
          {
            title: t('preview.image.step_1.title'),
            context: t('preview.image.step_1.context'),
          },
          {
            title: t('preview.image.step_2.title'),
            context: t('preview.image.step_2.context'),
          },
          {
            title: t('preview.image.step_3.title'),
            context: t('preview.image.step_3.context'),
          },
        ],
      },
      {
        title: t('音频项目教程'),
        icon: <AudioFilled />,
        img: AUDIO_FUNCTION,
        src: '/audio-training.html',
        imagePosition: 'left',
        detail: t('preview.audio.detail'),
        stepList: [
          {
            title: t('preview.audio.step_1.title'),
            context: t('preview.audio.step_1.context'),
          },
          {
            title: t('preview.audio.step_2.title'),
            context: t('preview.audio.step_2.context'),
          },
          {
            title: t('preview.audio.step_3.title'),
            context: t('preview.audio.step_3.context'),
          },
        ],
      },
      {
        title: t('preview.posture.title'),
        icon: <SmileFilled />,
        img: POSTTURE_FUNCTION,
        src: 'pose-detection.html',
        imagePosition: 'right',
        detail: t('preview.posture.detail'),
        stepList: [
          {
            title: t('preview.posture.step_1.title'),
            context: t('preview.posture.step_1.context'),
          },
          {
            title: t('preview.posture.step_2.title'),
            context: t('preview.posture.step_2.context'),
          },
          {
            title: t('preview.posture.step_3.title'),
            context: t('preview.posture.step_3.context'),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <div className={styles.experience}>
      <div className={styles.title}>
        <span>{t('preview.title')}</span>
      </div>
      {data.map((item, index) => (
        <div className={styles.card} key={index}>
          <div
            className={`${styles.cardContent} ${item.imagePosition === 'left' ? styles.cardContent2 : ''}`}
          >
            <Row gutter={[20, 20]} style={{ flex: 1 }}>
              <Col sm={12} style={{ display: 'flex' }} xs={24}>
                <div className={styles.flow}>
                  <div className={styles.cardTitle}>
                    <span className={styles.icon}>{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  <div className={styles.cardDetail}>{item.detail}</div>
                  {item.stepList.map((step, stepIndex) => (
                    <div className={styles.step} key={stepIndex}>
                      <span className={styles.stepTitle}>{step.title}</span>
                      <span className={styles.stepContext}>{step.context}</span>
                    </div>
                  ))}
                </div>
              </Col>
              <Col sm={12} style={{ display: 'flex' }} xs={24}>
                <div className={styles.image}>
                  <Image alt={item.title} src={item.img} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FunctionPreview;
