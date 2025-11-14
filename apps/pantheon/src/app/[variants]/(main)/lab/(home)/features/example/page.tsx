'use client';

import { AudioFilled, FileImageFilled, SmileFilled } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import { Col, Row, Steps } from 'antd';
import Image from 'next/image';
import { useRouter } from 'nextjs-toploader/app';
import { FC, useMemo } from 'react';

import AUDIO_PROJECT from '@/app/assets/images/brief-introduct-img/audio-project.png';
import IMAGE_PROJECT from '@/app/assets/images/brief-introduct-img/image-project.png';
import POSTTURE_PROJECT from '@/app/assets/images/brief-introduct-img/posture-project.png';

import styles from './page.module.css';

const Example: FC = () => {
  const { t } = useTranslate('lab_tour');
  const router = useRouter();
  const data = useMemo(
    () => [
      {
        title: t('tutorial.image.title'),
        icon: <FileImageFilled />,
        img: IMAGE_PROJECT,
        src: '/discover/tutorial/image-recognition',
        stepList: [
          {
            title: t('tutorial.image.step_1.title'),
            description: t('tutorial.image.step_1.description'),
          },
          {
            title: t('tutorial.image.step_2.title'),
            description: t('tutorial.image.step_2.description'),
          },
          {
            title: t('tutorial.image.step_3.title'),
            description: t('tutorial.image.step_3.description'),
          },
        ],
      },
      {
        title: t('tutorial.audio.title'),
        icon: <AudioFilled />,
        img: AUDIO_PROJECT,
        src: '/discover/tutorial/audio-recognition',
        stepList: [
          {
            title: t('tutorial.audio.step_1.title'),
            description: t('tutorial.audio.step_1.description'),
          },
          {
            title: t('tutorial.audio.step_2.title'),
            description: t('tutorial.audio.step_2.description'),
          },
          {
            title: t('tutorial.audio.step_3.title'),
            description: t('tutorial.audio.step_3.description'),
          },
        ],
      },
      {
        title: t('tutorial.posture.title'),
        icon: <SmileFilled />,
        img: POSTTURE_PROJECT,
        src: '/discover/tutorial/pose-recognition',
        stepList: [
          {
            title: t('tutorial.posture.step_1.title'),
            description: t('tutorial.posture.step_1.description'),
          },
          {
            title: t('tutorial.posture.step_2.title'),
            description: t('tutorial.posture.step_2.description'),
          },
          {
            title: t('tutorial.posture.step_3.title'),
            description: t('tutorial.posture.step_3.description'),
          },
        ],
      },
    ],
    [t],
  );
  return (
    <div className={styles.example}>
      <div className={styles.title}>
        <span>{t('tutorial.title')}</span>
      </div>
      {data.map((item, index) => (
        <div className={styles.card} key={index} onClick={() => router.push(item.src)}>
          <div className={styles.cardTitle}>
            <span className={styles.icon}>{item.icon}</span>
            <span>{item.title}</span>
          </div>
          <div className={styles.cardContent}>
            <Row gutter={[20, 20]} style={{ flex: 1 }}>
              <Col md={12} style={{ display: 'flex' }} xs={24}>
                <div className={styles.image}>
                  <Image alt={item.title} src={item.img} />
                </div>
              </Col>
              <Col md={12} style={{ display: 'flex' }} xs={24}>
                <div className={styles.flow}>
                  <Steps current={0} direction="vertical" items={item.stepList} />
                </div>
              </Col>
            </Row>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Example;
