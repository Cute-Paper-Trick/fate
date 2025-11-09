'use client';

import { AudioFilled, FileImageFilled, SmileFilled } from '@ant-design/icons';
import { useTranslate } from '@tolgee/react';
import Image from 'next/image';
import { FC, useMemo } from 'react';

import AUDIO_FUNCTION from '@/app/assets/images/brief-introduct-img/audio-function.png';
import IMAGE_FUNCTION from '@/app/assets/images/brief-introduct-img/image-function.png';
import POSTTURE_FUNCTION from '@/app/assets/images/brief-introduct-img/posture-function.png';

import styles from './page.module.css';

const FunctionPreview: FC = () => {
  const { t } = useTranslate('');
  const data = useMemo(
    () => [
      {
        title: t('图片项目教程'),
        icon: <FileImageFilled />,
        img: IMAGE_FUNCTION,
        src: 'image-training.html',
        imagePosition: 'right',
        detail: t(
          '通过训练图片识别模型，您可以构建各种有趣的应用程序。例如，创建一个可以识别不同种类花卉的应用，或者一个能自动为您的相册分类的智能工具。',
        ),
        stepList: [
          {
            title: t('· 垃圾分类助手:'),
            context: t('拍照识别垃圾属于可回收物还是有害垃圾。'),
          },
          {
            title: t('· 商品识别: '),
            context: t('识别商品并提供相关信息或比价。'),
          },
          {
            title: t('· 安全监控:'),
            context: t('识别监控画面中的异常行为，如摔倒检测。'),
          },
        ],
      },
      {
        title: t('音频项目教程'),
        icon: <AudioFilled />,
        img: AUDIO_FUNCTION,
        src: '/audio-training.html',
        imagePosition: 'left',
        detail: t(
          '训练一个音频模型，让您的设备能“听懂”世界。它可以用于控制智能家居，或者作为辅助工具帮助听障人士感知周围的环境声音。',
        ),
        stepList: [
          {
            title: t('· 语音命令控制:'),
            context: t('用“开灯”或“播放音乐”等特定短语控制设备。'),
          },
          {
            title: t('· 环境声音识别: '),
            context: t('为每个类别上传相应的图片样本。'),
          },
          {
            title: t('· 动物声音识别:'),
            context: t('辨别鸟鸣或其他动物的声音，用于科研或娱乐。'),
          },
        ],
      },
      {
        title: t('姿态项目教程'),
        icon: <SmileFilled />,
        img: POSTTURE_FUNCTION,
        src: 'pose-detection.html',
        imagePosition: 'right',
        detail: t(
          '姿势识别模型可以赋能互动体验。创建AI健身教练，实时纠正您的动作；或者开发体感游戏，让您用身体动作来控制游戏角色。',
        ),
        stepList: [
          {
            title: t('· AI健身教练: '),
            context: t('实时分析深蹲、瑜伽等动作的标准性。'),
          },
          {
            title: t('· 体感游戏: '),
            context: t('通过挥手、跳跃等姿势与游戏进行互动。'),
          },
          {
            title: t('· 康复训练助手:'),
            context: t('引导并记录康复病人的动作完成情况。'),
          },
        ],
      },
    ],
    [t],
  );

  return (
    <div className={styles.experience}>
      <div className={styles.title}>
        <span>{t('功能预览')}</span>
      </div>
      {data.map((item, index) => (
        <div
          className={styles.card}
          key={index}
          onClick={() => (globalThis.location.href = item.src)}
        >
          <div className={styles.cardContent}>
            <div
              className={styles.image}
              style={{ order: item.imagePosition === 'left' ? '1' : '2' }}
            >
              <Image alt={item.title} src={item.img} />
            </div>
            <div
              className={styles.flow}
              style={{ order: item.imagePosition === 'left' ? '2' : '1' }}
            >
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default FunctionPreview;
